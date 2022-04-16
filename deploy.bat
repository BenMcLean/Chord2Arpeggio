@ECHO ON
%~d0:
cd %~dp0
call npm run build
cd dist
git init
git checkout -b master
git add -A
git commit -m 'deploy'
git subtree push --prefix dist origin gh-pages
@pause
