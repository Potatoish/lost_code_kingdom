'use client';

/*
  pyodideRuntime
  ==============
  Small browser helper for loading Pyodide once and reusing it across chapters.
  We pin the CDN version so the public game gets predictable client-side behavior.
  Source: https://pyodide.org/en/latest/usage/api/js-api.html
*/

const PYODIDE_VERSION = '0.29.3';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

let pyodideReadyPromise = null;
const HIDDEN_CHECK_HELPER_NAME = '__lost_code_run_hidden_check';
const HIDDEN_CHECK_HELPER_CODE = `
import contextlib
import io
import traceback

def ${HIDDEN_CHECK_HELPER_NAME}(user_code, assertion_code=""):
    namespace = {"__user_code__": user_code}
    output_buffer = io.StringIO()

    try:
        with contextlib.redirect_stdout(output_buffer):
            exec(user_code, namespace, namespace)
            if assertion_code:
                exec(assertion_code, namespace, namespace)
        return {
            "ok": True,
            "stdout": output_buffer.getvalue(),
            "error": "",
        }
    except Exception:
        return {
            "ok": False,
            "stdout": output_buffer.getvalue(),
            "error": traceback.format_exc(),
        }
`;

function normalizeConsoleText(messages, extraMessage = '') {
  const lines = messages
    .map((entry) => String(entry ?? '').replace(/\s+$/, ''))
    .filter(Boolean);

  if (extraMessage) {
    lines.push(String(extraMessage).trim());
  }

  return lines.join('\n').trim();
}

function normalizeCode(code) {
  return String(code ?? '').replace(/\r/g, '').trim();
}

function ensurePyodideScript() {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only load in the browser.');
  }

  if (window.loadPyodide) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[data-pyodide-script="${PYODIDE_VERSION}"]`
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('The spell engine could not be loaded.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.dataset.pyodideScript = PYODIDE_VERSION;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('The spell engine could not be loaded.'));
    document.body.appendChild(script);
  });
}

export async function loadPyodideRuntime(onStatusChange = () => {}) {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only load in the browser.');
  }

  if (window.__lostCodePyodide) {
    onStatusChange('Spell engine ready.');
    return window.__lostCodePyodide;
  }

  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      onStatusChange('Loading spell engine...');
      await ensurePyodideScript();
      const runtime = await window.loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
      });
      window.__lostCodePyodide = runtime;
      return runtime;
    })().catch((error) => {
      pyodideReadyPromise = null;
      throw error;
    });
  }

  const runtime = await pyodideReadyPromise;
  onStatusChange('Spell engine ready.');
  return runtime;
}

async function ensureHiddenCheckHelper(runtime) {
  const helperExists = runtime.runPython(
    `'${HIDDEN_CHECK_HELPER_NAME}' in globals()`
  );

  if (helperExists) {
    return;
  }

  await runtime.runPythonAsync(HIDDEN_CHECK_HELPER_CODE);
}

export async function runPythonSnippet(code, onStatusChange = () => {}) {
  const runtime = await loadPyodideRuntime(onStatusChange);
  const stdout = [];
  const stderr = [];

  runtime.setStdout({
    batched(output) {
      stdout.push(output);
    },
  });

  runtime.setStderr({
    batched(output) {
      stderr.push(output);
    },
  });

  try {
    onStatusChange('Casting your code...');

    if (typeof runtime.loadPackagesFromImports === 'function') {
      await runtime.loadPackagesFromImports(code);
    }

    const result = await runtime.runPythonAsync(code);
    let returnValue = '';

    if (result !== undefined && result !== null) {
      returnValue = String(result);
    }

    if (result && typeof result.destroy === 'function') {
      result.destroy();
    }

    return {
      output: normalizeConsoleText(stdout, returnValue === 'None' ? '' : returnValue),
      error: normalizeConsoleText(stderr),
      hasError: false,
    };
  } catch (error) {
    return {
      output: normalizeConsoleText(stdout),
      error: normalizeConsoleText(stderr, error?.message ?? 'Unknown spell error'),
      hasError: true,
    };
  } finally {
    runtime.setStdout();
    runtime.setStderr();
    onStatusChange('Spell engine ready.');
  }
}

export async function runPythonHiddenChecks(
  code,
  hiddenChecks = [],
  onStatusChange = () => {}
) {
  if (!hiddenChecks.length) {
    return {
      allPassed: true,
      passedCount: 0,
      totalCount: 0,
      results: [],
    };
  }

  const runtime = await loadPyodideRuntime(onStatusChange);
  await ensureHiddenCheckHelper(runtime);

  if (typeof runtime.loadPackagesFromImports === 'function') {
    await runtime.loadPackagesFromImports(code);
  }

  const results = [];

  for (const check of hiddenChecks) {
    let passed = false;
    let rawError = '';

    if (check.type === 'code') {
      const source = normalizeCode(code);
      const includesAll = (check.includesAll ?? []).every((snippet) =>
        source.includes(snippet)
      );
      const excludesAll = (check.excludesAll ?? []).every(
        (snippet) => !source.includes(snippet)
      );

      passed = includesAll && excludesAll;
    } else {
      runtime.globals.set('__lost_code_user_code', code);
      runtime.globals.set(
        '__lost_code_assertion_code',
        check.assertionCode ?? ''
      );

      const jsonResult = await runtime.runPythonAsync(`
import json
json.dumps(${HIDDEN_CHECK_HELPER_NAME}(__lost_code_user_code, __lost_code_assertion_code))
      `);
      const parsedResult = JSON.parse(String(jsonResult));

      if (jsonResult && typeof jsonResult.destroy === 'function') {
        jsonResult.destroy();
      }

      passed = Boolean(parsedResult.ok);
      rawError = parsedResult.error ?? '';
    }

    results.push({
      id: check.id,
      passed,
      message: passed ? check.passMessage ?? 'Hidden check passed.' : check.failMessage,
      rawError,
    });
  }

  runtime.globals.delete('__lost_code_user_code');
  runtime.globals.delete('__lost_code_assertion_code');

  const passedCount = results.filter((result) => result.passed).length;

  return {
    allPassed: passedCount === results.length,
    passedCount,
    totalCount: results.length,
    results,
  };
}
