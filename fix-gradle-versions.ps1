# Capacitor 동기화 후 AGP와 Java 버전을 자동으로 수정하는 스크립트

Write-Host "🔧 AGP와 Java 버전을 수정 중..."

# AGP 버전을 8.5.0으로 수정
$buildGradlePath = "android\capacitor-cordova-android-plugins\build.gradle"
if (Test-Path $buildGradlePath) {
    $content = Get-Content $buildGradlePath -Raw
    $content = $content -replace "gradle:8\.7\.2", "gradle:8.5.0"
    $content = $content -replace "JavaVersion\.VERSION_21", "JavaVersion.VERSION_17"
    Set-Content $buildGradlePath $content
    Write-Host "✅ $buildGradlePath 수정 완료"
}

Write-Host "🚀 모든 버전 수정 완료!"