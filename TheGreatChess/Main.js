var http = require('http');
var fileSystem = require('fs');
var httpdispatcher = require('httpdispatcher');

var path = require('path');
var dispatcher = new httpdispatcher();

function handleRequest(request, response) {
	try{
		console.log(request.url);
		dispatcher.dispatch(request, response);
	} catch(err) {
		console.log(err);
	}
}

var server = http.createServer(handleRequest);

server.listen(process.env.PORT || 5000);

console.log('Listening at: localhost:' + process.env.PORT);

dispatcher.onGet("/", function(req, resp) {

	fileSystem.readFile('./TheGreatChess/Resources/helloworld.html', function(error, fileContent){
		if(error){
			resp.writeHead(500, {'Content-Type': 'text/plain'});
			resp.end('Error');
		}
		else{
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.write(fileContent);
			resp.end();
		}
	});
});

dispatcher.onGet("/board", function(req, resp) {
		 
	fileSystem.readFile('./TheGreatChess/Resources/gameboard.html', function(error, fileContent){
	if(error){
		resp.writeHead(500, {'Content-Type': 'text/plain'});
		resp.end('Error');
	}
	else{
		resp.writeHead(200, {'Content-Type': 'text/html'});
		resp.write(fileContent);
		resp.end();
	}
	});
});

staticDirName = "TheGreatChess\\Resources\\";
staticPrefix = '/';

dispatcher.setStaticDirname(staticDirName);
dispatcher.setStatic(staticPrefix);

dispatcher.onError(function(req, res) {
	var url           = require('url').parse(req.url, true);
    var filenameS      = staticDirName + path.relative(staticPrefix, url.pathname).replace('/', '\\');
	var filename = "/app/" + filenameS.replace(/\\/g, '/');
    require('fs').readFile(filename, function(err, filee) {
		
        if(err) {
			res.writeHead(404);
			res.end("Sorry we did not get what you are doing!");
            return;
        }
        res.writeHeader(200, {
            "Content-Type": require('mime-types').lookup(filename)
        });
        res.write(filee, function(err) { res.end(); });
		return;
    });
});