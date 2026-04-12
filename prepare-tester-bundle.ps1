param(
    [string]$ClientDist = ".\dist\client",
    [string]$OutputRoot = ".\dist\tester-bundle",
    [string]$EnvironmentName = "Production"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientDistPath = Join-Path $projectRoot $ClientDist
$outputDir = Join-Path $projectRoot $OutputRoot

if (-not (Test-Path $clientDistPath)) {
    throw "Client dist not found. Run publish-client.ps1 first."
}

if (Test-Path $outputDir) {
    Remove-Item -LiteralPath $outputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $outputDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $outputDir "app") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $outputDir "docs") | Out-Null

# Copy only the files testers actually need to run the app.
$runtimeFiles = @(
    "CodeExplainer.exe",
    "appsettings.json"
)

foreach ($fileName in $runtimeFiles) {
    $sourcePath = Join-Path $clientDistPath $fileName
    if (-not (Test-Path $sourcePath)) {
        throw "Required client file not found: $sourcePath"
    }

    Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $outputDir "app" $fileName) -Force
}

if (Test-Path (Join-Path $projectRoot "final-tester-package-guide.md")) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "final-tester-package-guide.md") -Destination (Join-Path $outputDir "docs\final-tester-package-guide.md") -Force
}
if (Test-Path (Join-Path $projectRoot "chatgpt-tester-plan-prompt.md")) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "chatgpt-tester-plan-prompt.md") -Destination (Join-Path $outputDir "docs\chatgpt-tester-plan-prompt.md") -Force
}

$readmePath = Join-Path $outputDir "README-FIRST.txt"
$readme = @"
simpleDocs tester bundle

1. Extract this zip first
2. Open the app folder
3. Run CodeExplainer.exe
4. Enter the redeem code you received
5. Use the configured hotkey inside your normal workflow
6. The app starts with Windows by default and can be changed from the tray menu

Environment: $EnvironmentName
"@
Set-Content -LiteralPath $readmePath -Value $readme -Encoding ASCII

Write-Host "Tester bundle prepared at $outputDir"
