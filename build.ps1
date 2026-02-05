# ============================================================
# Script de Build WordPress Plugin - IA Pilote MCP Ability
# ============================================================
# Ce script cree un ZIP compatible WordPress/Linux avec :
# - Forward slashes (/) pour compatibilite Linux
# - Dossier principal = nom du plugin (sans version)
# ============================================================

param(
    [string]$Version = "1.6.0"
)

# Configuration
$PluginName = "ia-pilote-mcp-ability"
$SourceDir = $PSScriptRoot
$OutputDir = Split-Path -Parent $SourceDir
$ZipFileName = "$PluginName-v$Version.zip"
$ZipPath = Join-Path $OutputDir $ZipFileName

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Build WordPress Plugin: $PluginName v$Version" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1 : Nettoyer ancien ZIP
Write-Host "[1/4] Nettoyage..." -ForegroundColor Yellow
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
    Write-Host "  -> Ancien ZIP supprime" -ForegroundColor Gray
}

# Etape 2 : Verifier les fichiers requis
Write-Host "[2/4] Verification des fichiers..." -ForegroundColor Yellow
$requiredFiles = @(
    "ia-pilote-mcp-ability.php",
    "includes\class-ability.php",
    "includes\class-license.php",
    "includes\class-mcp-server.php",
    "abilities\system.php"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $SourceDir $file
    if (Test-Path $filePath) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    }
    else {
        Write-Host "  [MANQUANT] $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`nERREUR: Fichiers manquants! Annulation." -ForegroundColor Red
    exit 1
}

# Etape 3 : Creer le ZIP avec forward slashes (compatible Linux)
Write-Host "[3/4] Creation du ZIP (forward slashes)..." -ForegroundColor Yellow

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($ZipPath, 'Create')

# Fichiers a exclure
# Note: ce build doit packager uniquement le plugin WordPress (pas le bridge Node.js dans mcp/)
$excludePatterns = @(
    '\.ps1$',
    '\.bat$',
    '\.git',
    '\.DS_Store',
    'Thumbs\.db',
    '([\\/])mcp([\\/])',
    '([\\/])\.gitignore$',
    '([\\/])README\.md$',
    '([\\/])ROADMAP\.md$'
)

Get-ChildItem $SourceDir -Recurse -File | Where-Object {
    $path = $_.FullName
    $exclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($path -match $pattern) {
            $exclude = $true
            break
        }
    }
    -not $exclude
} | ForEach-Object {
    # Creer le chemin avec forward slashes pour Linux
    $relativePath = $_.FullName.Substring($SourceDir.Length + 1).Replace('\', '/')
    $entryPath = "$PluginName/$relativePath"
    
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $zip,
        $_.FullName,
        $entryPath
    ) | Out-Null
    
    Write-Host "  + $entryPath" -ForegroundColor Gray
}

$zip.Dispose()

# Etape 4 : Verification finale
Write-Host "[4/4] Verification du ZIP..." -ForegroundColor Yellow

$zipCheck = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
$mainFile = $zipCheck.Entries | Where-Object { $_.FullName -eq "$PluginName/ia-pilote-mcp-ability.php" }
$includesExist = $zipCheck.Entries | Where-Object { $_.FullName -like "$PluginName/includes/*" }

if ($mainFile -and $includesExist) {
    Write-Host "  [OK] Structure validee" -ForegroundColor Green
}
else {
    Write-Host "  [ERREUR] Structure invalide!" -ForegroundColor Red
}

$zipCheck.Dispose()

# Resume
$zipInfo = Get-Item $ZipPath
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  BUILD REUSSI!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichier: $ZipPath" -ForegroundColor Cyan
Write-Host "Taille:  $([math]::Round($zipInfo.Length / 1KB, 2)) KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Structure (compatible WordPress/Linux):" -ForegroundColor White
Write-Host "  $PluginName/" -ForegroundColor Yellow
Write-Host "    +-- ia-pilote-mcp-ability.php" -ForegroundColor Gray
Write-Host "    +-- includes/ (class-ability.php, ...)" -ForegroundColor Gray
Write-Host "    +-- abilities/ (system.php, ...)" -ForegroundColor Gray
Write-Host "    +-- assets/" -ForegroundColor Gray
Write-Host ""
Write-Host "WordPress installera dans:" -ForegroundColor White
Write-Host "  /wp-content/plugins/$PluginName/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pret pour upload!" -ForegroundColor Green
