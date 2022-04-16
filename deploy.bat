@ECHO ON
%~d0:
cd %~dp0
git checkout -b master
call npm run build
git add -A
git commit -m 'deploy'
git subtree push --prefix dist origin gh-pages
@pause
