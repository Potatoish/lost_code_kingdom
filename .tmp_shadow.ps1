Add-Type -AssemblyName System.Drawing
$path = (Resolve-Path 'public/art/pip-mascot-cutout.png').Path
$img = [System.Drawing.Bitmap]::new($path)
$width = $img.Width
$height = $img.Height
$visited = New-Object 'bool[]' ($width * $height)
$queue = New-Object 'System.Collections.Generic.Queue[int]'

function Get-Index([int]$x, [int]$y, [int]$w) { return ($y * $w) + $x }
function Get-Brightness([System.Drawing.Color]$c) {
  $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
  $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
  return ($max + $min) / 510.0
}
function Get-Saturation([System.Drawing.Color]$c) {
  $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
  $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
  if ($max -eq 0) { return 0.0 }
  return ($max - $min) / [double]$max
}
function Is-ShadowCandidate([System.Drawing.Color]$current, [System.Drawing.Color]$neighbor) {
  if ($neighbor.A -eq 0) { return $true }
  $brightness = Get-Brightness $neighbor
  $saturation = Get-Saturation $neighbor
  $dr = [Math]::Abs([int]$neighbor.R - [int]$current.R)
  $dg = [Math]::Abs([int]$neighbor.G - [int]$current.G)
  $db = [Math]::Abs([int]$neighbor.B - [int]$current.B)
  $distance = $dr + $dg + $db

  if (($brightness -gt 0.7) -and ($saturation -lt 0.22) -and ($distance -lt 110)) { return $true }
  if (($brightness -gt 0.75) -and ($neighbor.R -gt 180) -and ($neighbor.G -gt 170) -and ($neighbor.B -gt 150) -and ($distance -lt 130)) { return $true }
  return $false
}

for ($x = 0; $x -lt $width; $x++) {
  foreach ($y in @(0, ($height - 1))) {
    $idx = Get-Index $x $y $width
    if (-not $visited[$idx]) {
      $c = $img.GetPixel($x, $y)
      if ($c.A -eq 0) {
        $visited[$idx] = $true
        $queue.Enqueue($idx)
      }
    }
  }
}
for ($y = 0; $y -lt $height; $y++) {
  foreach ($x in @(0, ($width - 1))) {
    $idx = Get-Index $x $y $width
    if (-not $visited[$idx]) {
      $c = $img.GetPixel($x, $y)
      if ($c.A -eq 0) {
        $visited[$idx] = $true
        $queue.Enqueue($idx)
      }
    }
  }
}

$offsets = @(@(-1,0),@(1,0),@(0,-1),@(0,1),@(-1,-1),@(1,-1),@(-1,1),@(1,1))
while ($queue.Count -gt 0) {
  $index = $queue.Dequeue()
  $x = $index % $width
  $y = [int][Math]::Floor($index / $width)
  $current = $img.GetPixel($x, $y)

  foreach ($offset in $offsets) {
    $nx = $x + $offset[0]
    $ny = $y + $offset[1]
    if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $width -or $ny -ge $height) { continue }
    $nidx = Get-Index $nx $ny $width
    if ($visited[$nidx]) { continue }

    $neighbor = $img.GetPixel($nx, $ny)
    if (Is-ShadowCandidate $current $neighbor) {
      $visited[$nidx] = $true
      $queue.Enqueue($nidx)
    }
  }
}

for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    $idx = Get-Index $x $y $width
    if ($visited[$idx]) {
      $color = $img.GetPixel($x, $y)
      if ($color.A -ne 0) {
        $img.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $color.R, $color.G, $color.B))
      }
    }
  }
}

$img.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
Write-Output 'Updated cutout'
