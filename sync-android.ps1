# Capacitor Android 동기화 + 자동 수정 스크립트

Write-Host "🔄 Capacitor Android 동기화 시작..."
npx cap sync android

Write-Host "🔧 AGP와 Java 버전 자동 수정..."
.\fix-gradle-versions.ps1

Write-Host "✅ 모든 작업 완료!"