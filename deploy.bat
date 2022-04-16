rem build
npm run build

rem navigate into the build output directory
git subtree push --prefix dist origin gh-pages
