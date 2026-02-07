@echo off
chcp 65001 > nul

echo [0/5] 캐시 강제 업데이트 설정 중 (Cache Busting)...
:: 날짜와 시간에서 숫자만 추출하여 버전 문자열 생성 (YYYYMMDDHHMMSS)
set VERSION=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set VERSION=%VERSION: =0%

:: index.html 내의 스타일시트와 자바스크립트 경로에 버전 쿼리 스트링 추가/업데이트
:: Get-Content와 Out-File 모두 -Encoding UTF8을 명시하여 한글 깨짐 방지
powershell -Command "$c = Get-Content -Path index.html -Encoding UTF8; $c = $c -replace 'style\.css(\?v=\d+)?', 'style.css?v=%VERSION%'; $c = $c -replace 'script\.js(\?v=\d+)?', 'script.js?v=%VERSION%'; $today = Get-Date -Format 'yyyy.MM.dd'; $c = $c -replace 'Ver \d+\.\d+\.\d+(\.\d+)?', ('Ver ' + $today); Set-Content -Path index.html -Value $c -Encoding UTF8"

echo 캐시 방지 버전 적용 완료: v=%VERSION%
echo.

echo [1/5] 원격 서버의 변경사항을 확인 중입니다...
git pull origin main
echo.

echo [2/5] 변경된 파일을 준비 중입니다 (추가/수정/삭제 모두 포함)...
git add -A
echo.

echo [3/5] 로컬 저장소에 기록 중입니다...
git commit -m "Auto Update: %date% %time% (v=%VERSION%)"
echo.

echo [4/5] GitHub로 업로드 중입니다...
git push origin main
echo.

echo ==========================================
echo 동기화 완료! 웹사이트가 업데이트 되었습니다.
echo (사용자 기기에서도 새로운 내용이 즉시 반영됩니다.)
echo ==========================================
pause
