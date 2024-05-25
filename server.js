const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const fs = require('fs');
const { SerialPort } = require('serialport');



const INFO_JSON_URL = 'http://localhost:3000/info.json'; //info.json dosyasına erişim için 3000 portunda dosyayı hostlayacak mekanizma başlatılır
const proxy = httpProxy.createProxyServer({target: INFO_JSON_URL,
    changeOrigin: true,
    ws: true,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }});

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.url === '/info.json') { //localhost:8000 bağlantısında iken /info.json uzantısına gidilirse dosyaya erişim sağlanacak
        proxy.web(req, res, { target: INFO_JSON_URL });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

proxy.on('error', (err, req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
});

server.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});


var PORT2 = 8000;
const server2 = http.createServer((req, res) => {
    // Ä°stek yapÄ±lan URL'yi al
    const url = req.url;

    // Ä°stek URL'si /info.json ise gerÃ§ek iÃ§eriÄŸi dÃ¶ndÃ¼r
    if (url === '/info.json') {
        const filePath = path.join(__dirname, 'info.json');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Dosya bulunamadÄ±!");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (url === '/') {
        // Ä°stek URL'si / ise index.html dosyasÄ±nÄ± dÃ¶ndÃ¼r
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Dosya bulunamadÄ±!");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        // DiÄŸer durumlarda 404 hatasÄ± dÃ¶ndÃ¼r
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

server2.listen(PORT2, () => {
    console.log(`Sunucu ${PORT2} portunda başlatıldı.`);
});



//seri port

const port = new SerialPort({
    path: 'COM4',
    baudRate: 2000000,
  }, function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  })


  port.on('data', function (data) {
    let strData = data.toString('utf8'); //seri porttan okunan verinin encode şekli utf8 olarak ayarlanır
    strData = strData.replace(/[\n\r]/g, ''); //alt satıra geçerken bırakılan boşluklar silinerek temiz bir görüntü elde edilir
    parcalanmisVeri = strData.split(" ") //veri, boşluğu baz alarak parçalanır
    ces = {
        derece: parseInt(parcalanmisVeri[0]),
        egim: parseInt(parcalanmisVeri[1])
    };
    let newdatas2 = `{
    "derece": ${ces.derece},
    "egim": ${ces.egim}
}`
    fs.writeFile('info.json', newdatas2, function (err, data) {if (err) throw err;}); //info.json dosyasına verileri işler
})







/* // Mevcut olarak çalışan portları listeler
SerialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err)
  )*/