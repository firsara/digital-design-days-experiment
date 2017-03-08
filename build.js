
var crypto = require('crypto');
var execSync = require('child_process').execSync;
var fs = require('fs-extra');

function hash(file) {
  var ver = crypto.createHash('md5');
  ver.update(fs.readFileSync(file, 'utf8'));
  return ver.digest('hex').slice(0, 16);
}

execSync('rimraf dist');
execSync('r.js -o baseUrl=src/app name=main out=dist/main.js optimize=none');

fs.copySync('src/index.html', 'dist/index.html');
fs.copySync('node_modules/requirejs/require.js', 'dist/vendor/require.js');
fs.copySync('node_modules/stats.js/build/stats.min.js', 'dist/vendor/stats.min.js');
fs.copySync('node_modules/dat.gui/build/dat.gui.min.js', 'dist/vendor/dat.gui.min.js');

fs.copySync('src/images/favicon-32x32.png', 'dist/images/favicon-32x32.png');
fs.copySync('src/images/favicon-96x96.png', 'dist/images/favicon-96x96.png');
fs.copySync('src/images/favicon-16x16.png', 'dist/images/favicon-16x16.png');

var image = 'data:image/jpeg;base64,' + fs.readFileSync('src/pixel.jpg').toString('base64');
var main = fs.readFileSync('dist/main.js').toString();
main = main + "\n\n" + "require(['main']);";
main = 'window.DEFAULT_IMAGE = "' + image + '";' + "\n\n" + main;
fs.writeFileSync('dist/main.js', main);

var ver = hash('dist/main.js');
fs.renameSync('dist/main.js', 'dist/main.' + ver + '.js');

var index = fs.readFileSync('dist/index.html').toString();
index = index.replace('<script src="../node_modules/stats.js/build/stats.min.js"></script>', '');
index = index.replace('<script src="../node_modules/dat.gui/build/dat.gui.min.js"></script>', '<script src="vendor/dat.gui.min.js"></script>');
index = index.replace('<script data-main="app/main.js" src="../node_modules/requirejs/require.js"></script>', '<script data-main="main.' + ver + '.js" src="vendor/require.js"></script>');
fs.writeFileSync('dist/index.html', index);
