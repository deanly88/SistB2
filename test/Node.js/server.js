var http = require("http");
var url = require("url");
// var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');

function start(route, handle){
    function onRequest(request, response){
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
    
        request.setEncoding('utf8');
        request.
        request.on('data',function(chunk){ 
            console.log(chunk);
        });
        
        request.addListener("data", function(postDataChunk){
            postData += postDataChunk;
            console.log("Received POST data chunk '"+ postDataChunk + "'.");
        });
    
        request.addListener("end", function() {
            route(handle, pathname, response, postData);
        });
    }
    
    http.createServer(onRequest).listen(process.env.PORT);
    console.log("Server has started");
}
exports.start = start;