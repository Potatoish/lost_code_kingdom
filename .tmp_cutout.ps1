Add-Type -AssemblyName System.Drawing

$inputPath = (Resolve-Path 'public/art/pip-mascot-real.jfif').Path
$outputPath = Join-Path (Split-Path $inputPath -Parent) 'pip-mascot-cutout.png'

$src = [System.Drawing.Bitmap]::new($inputPath)
$width = $src.Width
$height = $src.Height
$visited = New-Object 'bool[]' ($width * $height)
$queue = New-Object 'System.Collections.Generic.Queue[int]'

function Get-Index([int]$x, [int]$y, [int]$w) {
  return ($y * $w) + $x
}

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

function Is-SeedColor([System.Drawing.Color]$c) {
  $brightness = Get-Brightness $c
  $saturation = Get-Saturation $c
  return ($brightness -gt 0.68) -or (($brightness -gt 0.5) -and ($saturation -lt 0.25))
}

function Is-BackgroundNeighbor([System.Drawing.Color]$current, [System.Drawing.Color]$neighbor) {
  $dr = [Math]::Abs([int]$neighbor.R - [int]$current.R)
  $dg = [Math]::Abs([int]$neighbor.G - [int]$current.G)
  $db = [Math]::Abs([int]$neighbor.B - [int]$current.B)
  $distance = $dr + $dg + $db
  $brightness = Get-Brightness $neighbor
  $saturation = Get-Saturation $neighbor

  if ($brightness -gt 0.82) { return $true }
  if (($brightness -gt 0.68) -and ($distance -lt 95)) { return $true }
  if (($brightness -gt 0.52) -and ($saturation -lt 0.34) -and ($distance -lt 88)) { return $true }
  if (($neighbor.R -gt 215) -and ($neighbor.G -gt 180) -and ($neighbor.B -gt 180) -and ($distance -lt 120)) { return $true }
  return $false
}

for ($x = 0; $x -lt $width; $x++) {
  foreach ($y in @(0, ($height - 1))) {
    $idx = Get-Index $x $y $width
    if (-not $visited[$idx]) {
      $color = $src.GetPixel($x, $y)
      if (Is-SeedColor $color) {
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
      $color = $src.GetPixel($x, $y)
      if (Is-SeedColor $color) {
        $visited[$idx] = $true
        $queue.Enqueue($idx)
      }
    }
  }
}

$neighborOffsets = @(
  @(-1, 0),
  @(1, 0),
  @(0, -1),
  @(0, 1),
  @(-1, -1),
  @(1, -1),
  @(-1, 1),
  @(1, 1)
)

while ($queue.Count -gt 0) {
  $index = $queue.Dequeue()
  $x = $index % $width
  $y = [int][Math]::Floor($index / $width)
  $current = $src.GetPixel($x, $y)

  foreach ($offset in $neighborOffsets) {
    $nx = $x + $offset[0]
    $ny = $y + $offset[1]
    if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $width -or $ny -ge $height) { continue }
    $nidx = Get-Index $nx $ny $width
    if ($visited[$nidx]) { continue }

    $neighbor = $src.GetPixel($nx, $ny)
    if (Is-BackgroundNeighbor $current $neighbor) {
      $visited[$nidx] = $true
      $queue.Enqueue($nidx)
    }
  }
}

$dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    $idx = Get-Index $x $y $width
    $color = $src.GetPixel($x, $y)
    if ($visited[$idx]) {
      $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $color.R, $color.G, $color.B))
    }
    else {
      $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $color.R, $color.G, $color.B))
    }
  }
}

$dest.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dest.Dispose()
Write-Output "Saved $outputPath"
