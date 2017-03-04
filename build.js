
var fs = require('fs-extra');
fs.copySync('src/index.html', 'dist/index.html');
fs.copySync('node_modules/requirejs/require.js', 'dist/require.js');
fs.copySync('node_modules/stats.js/build/stats.min.js', 'dist/stats.min.js');
fs.copySync('node_modules/dat.gui/build/dat.gui.min.js', 'dist/dat.gui.min.js');
fs.copySync('src/pixel.jpg', 'dist/pixel.jpg');

var main = fs.readFileSync('dist/main.js').toString();
main = main + "\n\n" + "require(['main']);";
fs.writeFileSync('dist/main.js', main);

var hash = Date.now();
fs.renameSync('dist/main.js', 'dist/main.' + hash + '.js');

var index = fs.readFileSync('dist/index.html').toString();
index = index.replace('<script src="../node_modules/stats.js/build/stats.min.js"></script>', '');
index = index.replace('<script src="../node_modules/dat.gui/build/dat.gui.min.js"></script>', '<script src="dat.gui.min.js"></script>');
index = index.replace('<script data-main="app/main.js" src="../node_modules/requirejs/require.js"></script>', '<script data-main="main.' + hash + '.js" src="require.js"></script>');
fs.writeFileSync('dist/index.html', index);
