# Lightweight local HTTP server in PowerShell for testing PWA and mobile access
$port = 3000
$listener = New-Object System.Net.HttpListener
$prefix = "http://*:$port/"
try {
    $listener.Prefixes.Add($prefix)
    $listener.Start()
} catch {
    # If wildcard binding fails due to permissions, fallback to localhost
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " HEVY GYM TRACKER - Server Locale Attivo" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Apri sul PC:       http://localhost:$port" -ForegroundColor Yellow
if ($localIp) {
    Write-Host "  Apri su iPhone:    http://${localIp}:$port" -ForegroundColor Green
    Write-Host "  (Assicurati che iPhone e PC siano sulla stessa rete Wi-Fi)" -ForegroundColor Gray
}
Write-Host "`nPremi CTRL+C per arrestare il server.`n" -ForegroundColor Gray

$baseDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/") {
            $urlPath = "index.html"
        }
        $urlPath = $urlPath -replace '/', '\'
        $filePath = Join-Path $baseDir $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Cache-Control", "no-cache")
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Listener stopped or client aborted
    }
}
