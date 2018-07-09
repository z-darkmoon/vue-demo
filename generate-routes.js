/*
* 递归同步抓取src/page  下所有一Routes.js命名的文件，最终生成src/page/allRoutes.js文件
* */
var fs = require('fs');
var path = require('path');
var pagePath = path.join(__dirname, './src/view');
var imports = [];
var routesNames = [];
getRoutes(pagePath);
var fileString = imports.join('\n');
fileString += '\nexport default [].concat(\n    ';
fileString += routesNames.join(',\n    ');
fileString += '\n);\n';
fs.writeFileSync(path.join(__dirname, './src/allRoutes.js'), fileString);

function getRoutes(filePath, fileName, modulesName) {
    if (!modulesName) {
        modulesName = fileName;
    }

    var stat = fs.statSync(filePath);
    var isDir = stat.isDirectory();
    if (isDir) {
        var files = fs.readdirSync(filePath)
        if (files && files.length) {
            files.forEach(function (fn, index) {
                var fp = path.join(filePath, fn);
                getRoutes(fp, fn, modulesName);
            });
        }
    } else {
        if (fileName === 'routes.js') {
            var pathName = filePath.replace(pagePath, '');
            var routesPath = './view'+pathName;

            if (process.platform.indexOf('win') >= 0) {
                routesPath = routesPath.replace(/\\/g, "\/");
            }

            pathName = pathName.replace('.js', '');
            pathName = pathName.split('/');
            var pName = '';
            pathName.forEach(function (p) {
                if(p){
                    var ps = p.split('-');
                    ps.forEach(function (v) {
                        pName += v.replace(/(\w)/, function (v) {
                            return v.toUpperCase()
                        });
                    });
                }
            });
            console.log(routesPath);
            modulesName = 'modules_' + (modulesName + '').replace(/-/g, '_');
            routesNames.push(modulesName);
            imports.push("import " + modulesName + " from '"+routesPath+"';");
        }
    }
}

