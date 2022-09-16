const fs = require('fs');
const http = require('http');
const url = require('url');
/// FILES

// Read file 
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// Write file
// const textOut = `This is what we know about the avocado: ${textIn}. \nCreate on ${new Date(Date.now()).toDateString()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('Write successful!');

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('ERROR:' + err.message);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             if(err) return console.log(err.message);
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written !');
//             })
//         })
//     })
// })
// console.log('Will read file !');

// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) =>{
    const {query, pathname} = url.parse(req.url, true);
    console.log(url.parse(req.url, true));
    console.log(url.parse(req.url));

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        })
        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHTML);
        res.end(output);
    
    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        })
        console.log(query);
        const product = dataObj[query.id];
        
        res.end("output");
    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        })
        res.end(data);
    
    // Not found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page not found</h1>');
    }
})

server.listen('8000', '127.0.0.1');