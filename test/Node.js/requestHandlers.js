var fs = require("fs");
var querystring = require("querystring");

function start(response){
    console.log("Request handler 'start' was called.");
    // 비동기 Non-Blocking 함수를 사용.
    fs.readFile("start.html",function(error,data){
        if(error){
            console.log(error)
        }else{
            response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
            response.end(data);
        }
    });
}

function hello(response, postData){
    console.log("Request handler 'hello' was called."); 
    response.writeHead(200, {"Content-Type" : "text/plain; charset=utf-8"});
    response.write("안녕하세요. "+ querystring.parse(postData).text +"님");
    response.end();
}

exports.start = start;
exports.hello = hello;
