/*
  chapterConfigs
  ==============
  Shared story + puzzle data for the playable chapters.
  This keeps the homepage, world map, and chapter pages in sync.
*/

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const normalizeOutput = (value) =>
  String(value ?? '')
    .replace(/\r/g, '')
    .trim();

const exactText = (expected) => (value) =>
  normalizeText(value) === normalizeText(expected);

const oneOf = (acceptedValues) => (value) =>
  acceptedValues.some((accepted) => normalizeText(value) === normalizeText(accepted));

const normalizeCode = (value) =>
  String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const PLAYABLE_CHAPTERS = [
  {
    id: 1,
    slug: 'forest-of-variables',
    chapter: 'Chapter 1',
    title: 'Forest of Variables',
    theme: 'A forest that forgot its names',
    focus: 'Variables, data types, reassignment, print()',
    cta: 'Enter Forest',
    playable: true,
    href: '/chapters/forest-of-variables',
    progressKey: 'chapter1Complete',
    tone: 'forest',
    bannerSrc: '/art/forest-banner.jpg',
    bannerAlt: 'Forest of Variables banner art',
    bannerLabel: 'Lumenwood',
    artHeading: 'Forest of Variables Illustration',
    artDescription:
      'A glimpse of Lumenwood as names, values, and glowing symbols return to the trees.',
    statusDescription:
      'The forest has forgotten its names. Restore the spirits by assigning values, updating them, and speaking them aloud.',
    storyIntro:
      'The trees whisper in broken syllables. Each spirit needs a name to awaken. By assigning and updating values, you help the forest remember who it is.',
    guideBlurb: 'A patient guide who teaches the forest how to remember values.',
    pipIntro: {
      message:
        'Welcome to Lumenwood! We will restore names by assigning values, updating them when the story changes, and speaking them with print().',
      note: 'Tip: Variables can change. Python always prints the current value.',
    },
    concept: {
      body:
        'Variables store information. You can assign a value, reuse it later, and even change it when the story moves forward.',
      bullets: [
        'Strings hold names, words, and magical phrases.',
        'Numbers can be stored, added, and updated.',
        'Reassignment replaces the old value with a new one.',
        'print() reveals the current value inside a variable.',
      ],
      exampleCode: "spirit_name = 'Liora'\nspirit_name = 'Elara'\nprint(spirit_name)",
    },
    playground: {
      id: 'forest-spell-lab',
      title: 'Live Variable Grove',
      description:
        'Write real Python in the grove. The spell engine will run your code in the browser so you can experiment before or after the story puzzles.',
      goal:
        "Create a variable named forest_name, store 'Lumenwood' in it, and print the value.",
      expectedOutputLabel: 'Lumenwood',
      starterCode: "forest_name = 'Lumenwood'\nprint(forest_name)",
      placeholderOutput: '(run your code to hear the forest answer)',
      runHint:
        'Run the code first, then check the challenge once the output matches the goal.',
      clearedText:
        'Spell Lab cleared. The grove trusts your live code now, so you can keep experimenting freely.',
      successText:
        'Beautiful. The grove answered with the correct name, so your live code spell is working.',
      failureText:
        'Close, but the grove still wants a variable named forest_name and the exact printed output.',
      pipHint:
        'Give the forest a variable, then let print() say the value out loud. Names matter here.',
      pipSuccess:
        'That is the right pattern. Variables hold the value, and print() reveals it clearly.',
      pipNote: 'You can change the value and run the code again to see the grove react.',
      hiddenChecks: [
        {
          id: 'forest-variable-name',
          type: 'code',
          includesAll: ['forest_name', 'print'],
          failMessage:
            'One hidden check still wants the forest spell to use the real forest_name variable and a print statement.',
        },
        {
          id: 'forest-runtime-value',
          type: 'python',
          assertionCode:
            "assert 'forest_name' in globals()\nassert forest_name == 'Lumenwood'\nassert isinstance(forest_name, str)",
          failMessage:
            'A hidden check could not confirm that forest_name stores the exact string value the grove expects.',
        },
        {
          id: 'forest-prints-variable',
          type: 'python',
          assertionCode:
            "import ast\ntree = ast.parse(__user_code__)\nprint_calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call) and getattr(node.func, 'id', '') == 'print']\nassert any(any(isinstance(arg, ast.Name) and arg.id == 'forest_name' for arg in call.args) for call in print_calls)",
          failMessage:
            'A hidden check wants print() to speak the forest_name variable itself, not just hardcoded text.',
        },
      ],
      validate: ({ code, output, error }) =>
        !error &&
        normalizeOutput(output) === 'Lumenwood' &&
        code.includes('forest_name') &&
        code.includes('print'),
      fallbackValidate: ({ code }) => {
        const source = normalizeCode(code);

        return (
          source.includes('forest_name') &&
          source.includes('Lumenwood') &&
          source.includes('print(forest_name)')
        );
      },
    },
    snapshot: {
      title: 'Forest Rename Ritual',
      story: 'Track a name after it changes once the spirit wakes up.',
      code: "spirit = 'Liora'\nspirit = 'Elara'\nprint(spirit)",
    },
    puzzleSummary: '5 escalating puzzles',
    difficultyTrack: 'Warm-Up -> Apprentice -> Adept -> Challenger -> Expert',
    completion: {
      title: 'Forest Restored',
      description:
        'The spirits remember their names again. The forest now answers with brighter, stronger magic.',
      pipMessage:
        'You did it! You restored the forest by mastering names, values, and the way code can change over time.',
      pipNote: 'The river ahead will need even sharper thinking.',
      learned: [
        'Variables hold text, numbers, and other values.',
        'Reassignment changes what a variable stores.',
        'print() always shows the current value.',
        'You can combine variables to build new results.',
      ],
      primaryAction: {
        href: '/chapters/river-of-conditions',
        label: 'Continue to Chapter 2',
      },
      secondaryAction: {
        href: '/chapters',
        label: 'Back to World Map',
      },
    },
    puzzles: [
      {
        id: 'forest-output',
        type: 'choice',
        title: 'Puzzle 1: Whispered Output',
        difficulty: 'Warm-Up',
        prompt: 'What will this code print when the spirit speaks?',
        code: "spirit_name = 'Liora'\nprint(spirit_name)",
        options: ['Liora', 'Lumenwood', 'spirit_name'],
        answer: 'Liora',
        successText: "Correct! The forest prints 'Liora'.",
        failureText: 'Not quite. print() shows the value inside the variable.',
        hint:
          'The variable name is only a label. Python prints the value it is storing.',
      },
      {
        id: 'forest-name',
        type: 'input',
        title: 'Puzzle 2: Restore the True Name',
        difficulty: 'Apprentice',
        prompt:
          'Fill the missing value so the print shows the forest\'s true name.',
        code: 'forest_name = ____\nprint(forest_name)',
        inputLabel: 'Type the forest name without quotes',
        placeholder: 'Type your answer',
        actionLabel: 'Check Spell',
        validate: exactText('Lumenwood'),
        successText: 'Great! Lumenwood answers the spell correctly.',
        failureText: 'Almost. Use the exact forest name from the story.',
        hint: 'The missing value should match the name of the forest itself.',
      },
      {
        id: 'forest-assignment',
        type: 'choice',
        title: 'Puzzle 3: Correct Assignment',
        difficulty: 'Adept',
        prompt: 'Choose the line that correctly assigns the value 7 to a variable.',
        code: '# Which line is valid Python assignment?',
        options: ['spirit_power = 7', '7 = spirit_power', 'spirit_power == 7'],
        answer: 'spirit_power = 7',
        successText: 'Correct! Assignment uses one equals sign.',
        failureText: 'Remember: variable on the left, value on the right.',
        hint:
          'Single equals assigns a value. Double equals only compares two values.',
      },
      {
        id: 'forest-reassign',
        type: 'input',
        title: 'Puzzle 4: Reassignment Echo',
        difficulty: 'Challenger',
        prompt:
          'The lantern spirit gains more light. What number prints after the update?',
        code: 'lantern = 2\nlantern = lantern + 3\nprint(lantern)',
        inputLabel: 'Type the final number',
        placeholder: 'Type your answer',
        actionLabel: 'Check Answer',
        validate: exactText('5'),
        successText: 'Yes! The lantern now shines with power 5.',
        failureText:
          'Trace it carefully: start at 2, then add 3 before printing.',
        hint: 'Reassignment can use the old value to create a new one.',
      },
      {
        id: 'forest-phrase',
        type: 'choice',
        title: 'Puzzle 5: Build the Forest Phrase',
        difficulty: 'Expert',
        prompt:
          'Which output appears after combining the traveler\'s name and title?',
        code: "name = 'Pip'\ntitle = 'Guide'\nprint(name + ' the ' + title)",
        options: ['PipGuide', 'Pip the Guide', 'name the title'],
        answer: 'Pip the Guide',
        successText: 'Perfect! You combined two variables into one message.',
        failureText:
          'Look at the spaces and text inside the quotes. Python joins them exactly.',
        hint: 'The plus sign can join strings together when every piece is text.',
      },
    ],
  },
  {
    id: 2,
    slug: 'river-of-conditions',
    chapter: 'Chapter 2',
    title: 'River of Conditions',
    theme: 'A river that lost its direction',
    focus: 'if, elif, else, booleans, comparison logic',
    cta: 'Sail the River',
    playable: true,
    href: '/chapters/river-of-conditions',
    progressKey: 'chapter2Complete',
    tone: 'river',
    bannerSrc: '/art/river-banner.avif',
    bannerAlt: 'River of Conditions banner art',
    bannerLabel: 'Shifting Waters',
    artHeading: 'River of Conditions Illustration',
    artDescription:
      'A glimpse of the enchanted river as logic restores every fork and current.',
    statusDescription:
      'The river cannot choose its path. Use conditions, elif branches, and boolean logic to guide it safely.',
    storyIntro:
      'The river forks into misty channels. Only one path is safe. You must read the signs, compare clues, and choose the correct flow.',
    guideBlurb: 'A calm guide who listens to every branch before choosing a path.',
    pipIntro: {
      message:
        'This river listens to logic. We will use if, elif, else, and boolean rules to choose the safest current.',
      note: 'Tip: Each condition asks a question. True opens one path, false closes it.',
    },
    concept: {
      body:
        'Conditions help your code make decisions. You can compare values, check booleans, and guide code into different branches.',
      bullets: [
        'if runs when a condition is true.',
        'elif checks another path if the first one fails.',
        'else runs when no earlier condition matched.',
        'Booleans and logic operators help combine decisions.',
      ],
      exampleCode:
        "weather = 'mist'\nif weather == 'sun':\n    print('Bright path')\nelif weather == 'mist':\n    print('Lanterns up')\nelse:\n    print('Wait')",
    },
    playground: {
      id: 'river-spell-lab',
      title: 'Live Logic Current',
      description:
        'Test real if/else code and watch the river respond. This is a good place to change values and see different branches flow.',
      goal:
        "Use if and else so the code prints 'Safe waters' when river is 'left'.",
      expectedOutputLabel: 'Safe waters',
      starterCode:
        "river = 'left'\nif river == 'left':\n    print('Safe waters')\nelse:\n    print('Turn back')",
      placeholderOutput: '(run your code to see which branch the river chooses)',
      runHint:
        'Try changing the river value too. The output should change when the branch changes.',
      clearedText:
        'Spell Lab cleared. The river recognizes your logic, and you can still test other branches any time.',
      successText:
        'Great work. Your condition guided the river into the safe channel.',
      failureText:
        'The river still needs a real if/else branch and the exact safe-water output.',
      pipHint:
        'Your code should ask a question with if, then keep an else ready for the other path.',
      pipSuccess:
        'Nice choice. This is exactly how logic steers code toward different outcomes.',
      pipNote: 'Swap left for right and run again if you want to see the else branch.',
      hiddenChecks: [
        {
          id: 'river-branch-keywords',
          type: 'code',
          includesAll: ['river', 'if', 'else', 'Safe waters', 'Turn back'],
          failMessage:
            'A hidden check still expects the river spell to include the river variable, an if/else path, and both branch messages.',
        },
        {
          id: 'river-runtime-value',
          type: 'python',
          assertionCode:
            "assert 'river' in globals()\nassert river == 'left'\nassert isinstance(river, str)",
          failMessage:
            'One hidden check could not confirm that the river variable is storing the expected starting direction.',
        },
        {
          id: 'river-logic-shape',
          type: 'python',
          assertionCode:
            "import ast\ntree = ast.parse(__user_code__)\nassert any(isinstance(node, ast.If) for node in ast.walk(tree))\nassert any(isinstance(node, ast.Compare) and any(isinstance(op, ast.Eq) for op in node.ops) for node in ast.walk(tree))",
          failMessage:
            'A hidden check wants a real comparison-based if statement, not just printed text without logic.',
        },
      ],
      validate: ({ code, output, error }) =>
        !error &&
        normalizeOutput(output) === 'Safe waters' &&
        code.includes('if ') &&
        code.includes('else') &&
        code.includes('river'),
      fallbackValidate: ({ code }) => {
        const source = normalizeCode(code);

        return (
          source.includes('river') &&
          source.includes('left') &&
          source.includes('if ') &&
          source.includes('else') &&
          source.includes('Safe waters') &&
          source.includes('Turn back')
        );
      },
    },
    snapshot: {
      title: 'Mist Branch',
      story: 'Follow the correct branch when the weather changes midstream.',
      code: "weather = 'mist'\nif weather == 'sun':\n    print('Bright path')\nelif weather == 'mist':\n    print('Lanterns up')",
    },
    puzzleSummary: '5 escalating puzzles',
    difficultyTrack: 'Warm-Up -> Apprentice -> Adept -> Challenger -> Expert',
    completion: {
      title: 'River Restored',
      description:
        'The river flows in harmony again. Your logic kept every branch from collapsing into chaos.',
      pipMessage:
        'You restored the river with thoughtful decisions and strong logic. The caverns ahead will test your stamina next.',
      pipNote: 'The next realm repeats every spell until you control the pattern.',
      learned: [
        'if checks the first true path.',
        'elif adds another decision when the first check fails.',
        'else catches every remaining case.',
        'Boolean logic can combine multiple rules into one test.',
      ],
      primaryAction: {
        href: '/chapters/looping-caverns',
        label: 'Continue to Chapter 3',
      },
      secondaryAction: {
        href: '/chapters',
        label: 'Back to World Map',
      },
    },
    puzzles: [
      {
        id: 'river-basic-branch',
        type: 'choice',
        title: 'Puzzle 1: Which Path Runs?',
        difficulty: 'Warm-Up',
        prompt: 'What will this condition print?',
        code:
          "direction = 'left'\nif direction == 'left':\n    print('Safe waters')\nelse:\n    print('Turn back')",
        options: ['Safe waters', 'Turn back', 'Nothing prints'],
        answer: 'Safe waters',
        successText: "Correct! The left path prints 'Safe waters'.",
        failureText: 'Check whether the condition is true before the else branch runs.',
        hint: 'If the condition is true, Python never reaches the else block.',
      },
      {
        id: 'river-operator',
        type: 'input',
        title: 'Puzzle 2: Seal the Comparison',
        difficulty: 'Apprentice',
        prompt:
          'Fill the operator so the river compares the direction correctly.',
        code: "direction = 'right'\nif direction ____ 'right':\n    print('Safe waters')",
        inputLabel: 'Type the operator',
        placeholder: 'Type your answer',
        actionLabel: 'Check Condition',
        validate: exactText('=='),
        successText: 'Nice! The condition now compares both values correctly.',
        failureText: 'Use the comparison operator, not the assignment operator.',
        hint: 'Use the equality comparison operator, not the storage operator.',
      },
      {
        id: 'river-condition-line',
        type: 'choice',
        title: 'Puzzle 3: Pick the Safe Condition',
        difficulty: 'Adept',
        prompt: 'Which line makes the river print Safe waters?',
        code: "direction = 'right'\nif ____:\n    print('Safe waters')",
        options: ["direction == 'right'", "direction != 'right'", "direction = 'right'"],
        answer: "direction == 'right'",
        successText: 'Correct! That condition matches the river direction exactly.',
        failureText: 'Compare the variable to the text value you want to match.',
        hint: 'The correct line should ask, not assign.',
      },
      {
        id: 'river-elif-output',
        type: 'choice',
        title: 'Puzzle 4: Lantern Fork',
        difficulty: 'Challenger',
        prompt: 'What prints when the weather is mist?',
        code:
          "weather = 'mist'\nif weather == 'sun':\n    print('Bright path')\nelif weather == 'mist':\n    print('Lanterns up')\nelse:\n    print('Wait')",
        options: ['Bright path', 'Lanterns up', 'Wait'],
        answer: 'Lanterns up',
        successText: 'Exactly! The elif branch takes over when the first if fails.',
        failureText: 'The first check is false, so move to the elif branch next.',
        hint: 'elif only matters if the if above it did not match.',
      },
      {
        id: 'river-boolean-logic',
        type: 'choice',
        title: 'Puzzle 5: Gate Logic',
        difficulty: 'Expert',
        prompt: 'Which output appears when both facts are considered together?',
        code:
          "has_key = True\ngate_open = False\nif has_key and not gate_open:\n    print('Unlock gate')\nelse:\n    print('Keep searching')",
        options: ['Unlock gate', 'Keep searching', 'Nothing prints'],
        answer: 'Unlock gate',
        successText: 'Great! You used and + not to reason through two facts at once.',
        failureText:
          'Read both conditions together: the key is owned and the gate is still closed.',
        hint: 'and means both parts must be true. not flips False into True for the check.',
      },
    ],
  },
  {
    id: 3,
    slug: 'looping-caverns',
    chapter: 'Chapter 3',
    title: 'Looping Caverns',
    theme: 'Echoing caves of repetition',
    focus: 'for loops, while loops, range(), repeated patterns',
    cta: 'Enter Caverns',
    playable: true,
    href: '/chapters/looping-caverns',
    progressKey: 'chapter3Complete',
    tone: 'cavern',
    bannerSrc: '/art/cave-banner.jpg',
    bannerAlt: 'Looping Caverns cave banner art',
    bannerLabel: 'Echo Caverns',
    artHeading: 'Looping Caverns Illustration',
    artDescription:
      'A cold, glowing cavern where every repeated spell echoes deeper into the dark.',
    statusDescription:
      'The caverns repeat every sound forever. Use loops, counters, and ranges to control the pattern before the echoes trap you.',
    storyIntro:
      'Every tunnel in the caverns echoes your code back at you. If you cannot control repetition, the chamber never stops speaking.',
    guideBlurb: 'A steady guide who counts every echo before it becomes chaos.',
    pipIntro: {
      message:
        'Welcome to the Looping Caverns. We need loops now, because one spell is no longer enough. Patterns must repeat on purpose.',
      note: 'Tip: Loops repeat code. Your job is to predict and control that repetition.',
    },
    concept: {
      body:
        'Loops repeat work for you. for loops are great when you know how many times to repeat, while while loops continue until a condition changes.',
      bullets: [
        'range() creates a sequence of numbers for a for loop.',
        'for loops step through a pattern one value at a time.',
        'while loops continue until the condition becomes false.',
        'Counters and totals often change inside a loop.',
      ],
      exampleCode:
        'total = 0\nfor crystal in range(1, 4):\n    total = total + crystal\nprint(total)',
    },
    playground: {
      id: 'cavern-spell-lab',
      title: 'Live Echo Console',
      description:
        'The caverns finally give you full control of repetition. Run a loop, tweak the range, and watch the echoes change in real time.',
      goal:
        "Use a for loop with range() so the output prints Echo 1, Echo 2, and Echo 3 on separate lines.",
      expectedOutputLabel: 'Echo 1 / Echo 2 / Echo 3',
      starterCode:
        "for echo in range(1, 4):\n    print(f'Echo {echo}')",
      placeholderOutput: '(run your code to hear the cavern echoes)',
      runHint:
        'Loops are perfect for repeating a clean pattern. Try changing the range once your first run works.',
      clearedText:
        'Spell Lab cleared. The caverns now echo your loop correctly, and you can keep experimenting with the pattern.',
      successText:
        'Excellent. The echoes are now controlled by a proper loop instead of chaotic repetition.',
      failureText:
        'Almost there. The caverns want a loop plus the exact Echo 1 to Echo 3 output.',
      pipHint:
        'Start the loop at 1, stop before 4, and print each echo on its own line.',
      pipSuccess:
        'That is real loop control. One clear pattern, repeated exactly the right number of times.',
      pipNote: 'range(1, 4) gives 1, 2, and 3. That is why the last echo is 3.',
      hiddenChecks: [
        {
          id: 'cavern-loop-keywords',
          type: 'code',
          includesAll: ['for', 'range', 'Echo'],
          failMessage:
            'A hidden check still expects a visible for loop, a range call, and the Echo message pattern.',
        },
        {
          id: 'cavern-loop-shape',
          type: 'python',
          assertionCode:
            "import ast\ntree = ast.parse(__user_code__)\nassert any(isinstance(node, ast.For) for node in ast.walk(tree))\nassert any(isinstance(node, ast.Call) and getattr(node.func, 'id', '') == 'range' for node in ast.walk(tree))",
          failMessage:
            'One hidden check wants the cavern spell to use a real for loop with range(), not repeated print lines by hand.',
        },
        {
          id: 'cavern-loop-output-shape',
          type: 'python',
          assertionCode:
            "lines = [line.strip() for line in __user_code__.splitlines() if line.strip()]\nassert len(lines) >= 2",
          failMessage:
            'A hidden check expects the loop spell to be more than a single-line shortcut so the pattern stays readable.',
        },
      ],
      validate: ({ code, output, error }) =>
        !error &&
        normalizeOutput(output) === 'Echo 1\nEcho 2\nEcho 3' &&
        code.includes('for ') &&
        code.includes('range'),
      fallbackValidate: ({ code }) => {
        const source = normalizeCode(code);

        return (
          source.includes('for ') &&
          source.includes('range(1, 4)') &&
          source.includes('print') &&
          source.includes('Echo')
        );
      },
    },
    snapshot: {
      title: 'Echo Counter',
      story: 'Watch a counter rise as the cavern repeats a spell three times.',
      code: 'echo = 0\nfor step in range(3):\n    echo = echo + 1\nprint(echo)',
    },
    puzzleSummary: '5 escalating puzzles',
    difficultyTrack: 'Warm-Up -> Apprentice -> Adept -> Challenger -> Expert',
    completion: {
      title: 'Caverns Stabilized',
      description:
        'The echoes now repeat in controlled patterns. You turned endless noise into deliberate rhythm.',
      pipMessage:
        'You mastered repetition! The kingdom now trusts you with patterns that would overwhelm most travelers.',
      pipNote: 'The List Labyrinth is open now. It will ask you to keep many values in one place.',
      learned: [
        'for loops repeat code a set number of times.',
        'range() controls the values a for loop uses.',
        'while loops keep running until the condition becomes false.',
        'Totals and counters can change during every loop step.',
      ],
      primaryAction: {
        href: '/chapters/list-labyrinth',
        label: 'Continue to Chapter 4',
      },
      secondaryAction: {
        href: '/chapters',
        label: 'Back to World Map',
      },
    },
    puzzles: [
      {
        id: 'cavern-range-output',
        type: 'choice',
        title: 'Puzzle 1: Echo Sequence',
        difficulty: 'Warm-Up',
        prompt: 'What values does this loop print?',
        code: 'for step in range(3):\n    print(step)',
        options: ['0 1 2', '1 2 3', '0 1 2 3'],
        answer: '0 1 2',
        successText: 'Correct! range(3) starts at 0 and stops before 3.',
        failureText: 'range(3) gives 0, 1, and 2 only.',
        hint: 'range(3) includes 0 but does not include 3 itself.',
      },
      {
        id: 'cavern-range-stop',
        type: 'input',
        title: 'Puzzle 2: Open the Fourth Echo',
        difficulty: 'Apprentice',
        prompt: 'Fill the missing number so the loop prints 0, 1, 2, 3.',
        code: 'for echo in range(____):\n    print(echo)',
        inputLabel: 'Type the stopping number',
        placeholder: 'Type your answer',
        actionLabel: 'Check Loop',
        validate: exactText('4'),
        successText: 'Nice! The loop now prints four values: 0 through 3.',
        failureText: 'The stop number must be one more than the last printed value.',
        hint: 'range() stops right before the number you give it.',
      },
      {
        id: 'cavern-loop-line',
        type: 'choice',
        title: 'Puzzle 3: Choose the Repeating Spell',
        difficulty: 'Adept',
        prompt: 'Which line correctly starts a loop that repeats three times?',
        code: "# Choose the correct line to repeat 'torch' three times",
        options: ['for echo in range(3):', 'if echo in range(3):', 'while echo == 3:'],
        answer: 'for echo in range(3):',
        successText: 'Correct! That loop repeats a fixed number of times.',
        failureText: 'Look for the structure Python uses for counted repetition.',
        hint: 'for + range() is the standard pattern for a known number of repeats.',
      },
      {
        id: 'cavern-total',
        type: 'input',
        title: 'Puzzle 4: Crystal Sum',
        difficulty: 'Challenger',
        prompt: 'What final number prints after the loop adds every crystal?',
        code:
          'total = 0\nfor crystal in range(1, 4):\n    total = total + crystal\nprint(total)',
        inputLabel: 'Type the final total',
        placeholder: 'Type your answer',
        actionLabel: 'Check Total',
        validate: exactText('6'),
        successText: 'Exactly! 1 + 2 + 3 gives a final total of 6.',
        failureText: 'Trace the loop one pass at a time and keep a running total.',
        hint: 'Trace each value from the range and update the running total one pass at a time.',
      },
      {
        id: 'cavern-while-output',
        type: 'choice',
        title: 'Puzzle 5: The Last Echo',
        difficulty: 'Expert',
        prompt: 'What prints after this while loop finishes running?',
        code:
          'steps = 3\nwhile steps > 0:\n    steps = steps - 1\nprint(steps)',
        options: ['3', '1', '0'],
        answer: '0',
        successText: 'Perfect! The loop keeps subtracting until steps reaches 0.',
        failureText: 'The loop stops only after the condition becomes false, so trace every subtraction.',
        hint: 'Each loop removes 1 from steps. Ask what value makes steps > 0 become false.',
      },
    ],
  },
  {
    id: 4,
    slug: 'list-labyrinth',
    title: 'List Labyrinth',
    chapter: 'Chapter 4',
    theme: 'A maze of shifting collections',
    focus: 'lists, indexing, slicing',
    cta: 'Enter Labyrinth',
    playable: true,
    href: '/chapters/list-labyrinth',
    progressKey: 'chapter4Complete',
    tone: 'labyrinth',
    bannerSrc: '/art/list-labyrinth-scene.svg',
    bannerAlt: 'List Labyrinth banner art',
    bannerLabel: 'Index Maze',
    artHeading: 'List Labyrinth Illustration',
    artDescription:
      'A glowing maze where every path marker waits in a numbered collection.',
    statusDescription:
      'The maze keeps moving its treasures. Use lists, indexes, length checks, and slices to keep track of every path.',
    storyIntro:
      'The labyrinth walls rearrange whenever a traveler forgets an item. To pass through, you must gather many values into one list and choose the right one by position.',
    guideBlurb: 'A careful guide who counts each path marker before choosing a turn.',
    pipIntro: {
      message:
        'Welcome to the List Labyrinth. A single variable is not enough here. We need one container that can hold many treasures at once.',
      note: 'Tip: List indexes start at 0, so the first item is at position 0.',
    },
    concept: {
      body:
        'Lists store many values in one variable. You can read one item by index, count the list, add new items, and take a smaller slice.',
      bullets: [
        'Lists use square brackets, like items = ["key", "map"].',
        'Indexes start at 0, so items[0] means the first item.',
        'len() counts how many items are in a list.',
        'append() adds a new item to the end of a list.',
      ],
      exampleCode:
        "relics = ['Key', 'Lantern', 'Map']\nprint(relics[1])\nprint(len(relics))",
    },
    playground: {
      id: 'labyrinth-spell-lab',
      title: 'Live List Console',
      description:
        'Store several maze relics in one Python list, then pull out the exact item the path asks for.',
      goal:
        "Create a list named relics with 'Key', 'Lantern', and 'Map', then print the item at index 1.",
      expectedOutputLabel: 'Lantern',
      starterCode:
        "relics = ['Key', 'Lantern', 'Map']\nprint(relics[1])",
      placeholderOutput: '(run your code to inspect the maze relics)',
      runHint:
        'Remember that index 1 is the second item because Python starts counting at 0.',
      clearedText:
        'Spell Lab cleared. The labyrinth trusts your list indexing now, and you can keep experimenting.',
      successText:
        'Great work. Your list held all three relics, and your index selected the Lantern.',
      failureText:
        'Close, but the labyrinth still wants a real relics list and the exact printed item.',
      pipHint:
        'Use square brackets to make the list, then print the item at index 1.',
      pipSuccess:
        'Exactly. Lists keep related values together, and indexes let you choose one.',
      pipNote: 'Try changing the index after clearing it to see which relic appears.',
      hiddenChecks: [
        {
          id: 'labyrinth-list-keywords',
          type: 'code',
          includesAll: ['relics', 'Lantern', 'print'],
          failMessage:
            'A hidden check still expects a relics list, the Lantern value, and a print statement.',
        },
        {
          id: 'labyrinth-runtime-value',
          type: 'python',
          assertionCode:
            "assert 'relics' in globals()\nassert isinstance(relics, list)\nassert relics == ['Key', 'Lantern', 'Map']\nassert relics[1] == 'Lantern'",
          failMessage:
            'One hidden check could not confirm that relics stores the exact three-item list.',
        },
        {
          id: 'labyrinth-index-shape',
          type: 'python',
          assertionCode:
            "import ast\ntree = ast.parse(__user_code__)\nassert any(isinstance(node, ast.Subscript) for node in ast.walk(tree))",
          failMessage:
            'A hidden check wants you to use indexing, not just print the word directly.',
        },
      ],
      validate: ({ code, output, error }) =>
        !error &&
        normalizeOutput(output) === 'Lantern' &&
        code.includes('relics') &&
        code.includes('print'),
      fallbackValidate: ({ code }) => {
        const source = normalizeCode(code);

        return (
          source.includes('relics') &&
          source.includes('Key') &&
          source.includes('Lantern') &&
          source.includes('Map') &&
          source.includes('print(relics[1])')
        );
      },
    },
    snapshot: {
      title: 'Relic Index',
      story: 'Pick the correct treasure from a list after the maze shifts.',
      code: "relics = ['Key', 'Lantern', 'Map']\nprint(relics[1])",
    },
    puzzleSummary: '5 escalating puzzles',
    difficultyTrack: 'Warm-Up -> Apprentice -> Adept -> Challenger -> Expert',
    completion: {
      title: 'Labyrinth Mapped',
      description:
        'The shifting maze now keeps its treasures in order. You can store, count, add, and slice collections with confidence.',
      pipMessage:
        'You mapped the List Labyrinth! The kingdom can now remember many values at once instead of losing them in the walls.',
      pipNote: 'Four realms are restored. The remaining lands will open another day.',
      learned: [
        'Lists hold many values inside one variable.',
        'Indexes choose one item from a list.',
        'len() counts the items in a list.',
        'append() adds a new item, and slices copy part of a list.',
      ],
      primaryAction: {
        href: '/chapters',
        label: 'Return to World Map',
      },
      secondaryAction: {
        href: '/',
        label: 'Back to Home',
      },
      footerNote: 'You have cleared all currently playable chapters.',
    },
    puzzles: [
      {
        id: 'labyrinth-first-index',
        type: 'choice',
        title: 'Puzzle 1: First Relic',
        difficulty: 'Warm-Up',
        prompt: 'What will this list spell print?',
        code: "relics = ['Key', 'Lantern', 'Map']\nprint(relics[0])",
        options: ['Key', 'Lantern', 'Map'],
        answer: 'Key',
        successText: 'Correct! Index 0 chooses the first item in the list.',
        failureText: 'Not quite. Python lists start counting from 0.',
        hint:
          'Look for the item in the first position. In Python, that position is index 0.',
      },
      {
        id: 'labyrinth-lantern-index',
        type: 'input',
        title: 'Puzzle 2: Find the Lantern',
        difficulty: 'Apprentice',
        prompt: 'Fill the index so the list prints Lantern.',
        code: "relics = ['Key', 'Lantern', 'Map']\nprint(relics[____])",
        inputLabel: 'Type the index number',
        placeholder: 'Type your answer',
        actionLabel: 'Check Index',
        validate: exactText('1'),
        successText: 'Nice! Index 1 points to the second item: Lantern.',
        failureText: 'Almost. Count from 0, not from 1.',
        hint: 'Count positions from 0 until you land on Lantern.',
      },
      {
        id: 'labyrinth-length',
        type: 'choice',
        title: 'Puzzle 3: Count the Relics',
        difficulty: 'Adept',
        prompt: 'What number does len() print for this list?',
        code: "paths = ['north', 'east', 'west']\nprint(len(paths))",
        options: ['2', '3', '4'],
        answer: '3',
        successText: 'Correct! len() counts all three items.',
        failureText: 'Count the items inside the square brackets.',
        hint: 'len() does not use indexes. It counts how many items exist.',
      },
      {
        id: 'labyrinth-append-count',
        type: 'input',
        title: 'Puzzle 4: Add a Path',
        difficulty: 'Challenger',
        prompt: 'What final number prints after append() adds one new path?',
        code:
          "paths = ['left', 'right']\npaths.append('center')\nprint(len(paths))",
        inputLabel: 'Type the final count',
        placeholder: 'Type your answer',
        actionLabel: 'Check Count',
        validate: exactText('3'),
        successText: 'Exactly! append() adds one item, so the list now has 3.',
        failureText: 'Trace the list before and after append() runs.',
        hint: 'append() increases the list length by one item.',
      },
      {
        id: 'labyrinth-slice',
        type: 'choice',
        title: 'Puzzle 5: Maze Slice',
        difficulty: 'Expert',
        prompt: 'Which smaller list appears after this slice?',
        code: "runes = ['A', 'B', 'C', 'D']\nprint(runes[1:3])",
        options: ["['A', 'B', 'C']", "['B', 'C']", "['B', 'C', 'D']"],
        answer: "['B', 'C']",
        successText: 'Perfect! The slice starts at index 1 and stops before index 3.',
        failureText: 'Slices include the start index but stop before the end index.',
        hint: 'The slice includes the start position, but it leaves out the stop position.',
      },
    ],
  },
];

export const LOCKED_CHAPTERS = [
  {
    id: 5,
    title: 'Function Forge',
    chapter: 'Chapter 5',
    status: 'Locked',
    theme: 'A forge that shapes reusable spells',
    focus: 'def, parameters, return values',
    cta: 'Coming Soon',
    playable: false,
  },
  {
    id: 6,
    title: 'Debug Dungeon',
    chapter: 'Chapter 6',
    status: 'Locked',
    theme: 'A dungeon of hidden mistakes',
    focus: 'errors, tracing, fixing bugs',
    cta: 'Coming Soon',
    playable: false,
  },
  {
    id: 7,
    title: 'Dictionary Tower',
    chapter: 'Chapter 7',
    status: 'Locked',
    theme: 'A tower of keys and secrets',
    focus: 'dicts, keys, values, lookups',
    cta: 'Coming Soon',
    playable: false,
  },
  {
    id: 8,
    title: 'Final Chapter: The Core Script',
    chapter: 'Chapter 8',
    status: 'Locked',
    theme: 'The heart of the codebook',
    focus: 'capstone quest',
    cta: 'Coming Soon',
    playable: false,
  },
];

export const CHAPTER_LIST = [
  ...PLAYABLE_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    chapter: chapter.chapter,
    theme: chapter.theme,
    focus: chapter.focus,
    cta: chapter.cta,
    playable: true,
    href: chapter.href,
    progressKey: chapter.progressKey,
    tone: chapter.tone,
    bannerSrc: chapter.bannerSrc,
    bannerAlt: chapter.bannerAlt,
    bannerLabel: chapter.bannerLabel,
    artDescription: chapter.artDescription,
    puzzleSummary: chapter.puzzleSummary,
    difficultyTrack: chapter.difficultyTrack,
  })),
  ...LOCKED_CHAPTERS,
];

export const CHAPTER_BY_SLUG = Object.fromEntries(
  PLAYABLE_CHAPTERS.map((chapter) => [chapter.slug, chapter])
);

export function getChapterConfig(slug) {
  return CHAPTER_BY_SLUG[slug];
}
