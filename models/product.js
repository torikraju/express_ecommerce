const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const products = [];
const _path = path.join(rootDir, 'data', 'products.json');


module.exports = class Product {

    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(_path, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(_path, JSON.stringify(products), (err) => console.log(err))
        });
    }

    static fetchAll(cb) {
        fs.readFile(_path, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }


};