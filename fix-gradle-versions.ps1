# Capacitor 동기화 후 AGP와 Java 버전을 자동으로 수정하는 스크립트

Write-Host "🔧 모든 build.gradle 파일의 AGP와 Java 버전을 수정 중..."

# 수정할 파일 목록
$gradleFiles = @(
    "android\build.gradle",
    "android\app\build.gradle", 
    "android\capacitor-cordova-android-plugins\build.gradle",
    "node_modules\@capacitor\android\capacitor\build.gradle"
)

# 각 파일 수정
foreach ($filePath in $gradleFiles) {
    if (Test-Path $filePath) {
        Write-Host "🔍 $filePath 확인 중..."
        $content = Get-Content $filePath -Raw
        $originalContent = $content
        
        # AGP 버전을 8.5.0으로 수정 (8.7.2, 8.6.0 등 모든 변형 포함)
        $content = $content -replace "gradle:8\.7\.\d+", "gradle:8.5.0"
        $content = $content -replace "gradle:8\.6\.\d+", "gradle:8.5.0"
        $content = $content -replace "gradle:8\.8\.\d+", "gradle:8.5.0"
        $content = $content -replace "gradle:8\.9\.\d+", "gradle:8.5.0"
        
        # Java 버전을 21로 수정 (Java 17로 강제 변경하지 않음)
        $content = $content -replace "JavaVersion\.VERSION_17", "JavaVersion.VERSION_21"
        $content = $content -replace "JavaVersion\.VERSION_23", "JavaVersion.VERSION_21"
        $content = $content -replace "JavaVersion\.VERSION_25", "JavaVersion.VERSION_21"
        
        # 변경사항이 있으면 저장
        if ($content -ne $originalContent) {
            Set-Content $filePath $content
            Write-Host "✅ $filePath 수정 완료"
        } else {
            Write-Host "✅ $filePath 이미 올바른 설정"
        }
    } else {
        Write-Host "⚠️ $filePath 파일 없음"
    }
}

Write-Host "🚀 모든 build.gradle 파일 수정 완료!"