@echo off
chcp 65001 > nul
echo [1/4] 원격 서버의 변경사항을 확인 중입니다...
git pull origin main
echo.
echo [2/4] 변경된 파일을 준비 중입니다...
git add .
echo.
echo [3/4] 로컬 저장소에 기록 중입니다...
git commit -m \ Auto Update: %date% %time%\
echo.
echo [4/4] GitHub로 업로드 중입니다...
git push origin main
echo.
echo ==========================================
echo 동기화 완료! 웹사이트가 업데이트 되었습니다.
echo ==========================================
pause
