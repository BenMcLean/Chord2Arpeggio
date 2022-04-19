@ECHO OFF
%~d0:
cd %~dp0
git checkout master
call npm run build
git add -A
git commit -m deploy
git push
git subtree push --prefix dist origin gh-pages
@pause
