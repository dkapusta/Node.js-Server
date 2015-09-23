var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

function onRequest(request, response) {
	console.log("-----");
	console.log("New request, ip: " + request.connection.remoteAddress);

	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), "public" + uri);

	fs.exists(filename, function(exists) {
		console.log("Requested filename: " + filename);

		if(!exists) {
			console.log("Response: 404");
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 File not found");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				console.log("Response: 500");
				return;
			}

			console.log("Response: 200");

			switch(path.extname(filename)) {
				case ".ico":
					response.writeHead(200, {"Content-Type": "image/x-icon"});
					response.end(file, "binary");
					break;
				case ".jpg":
				case ".jpeg":
					response.writeHead(200, {"Content-Type": "image/jpeg"});
					response.end(file, "binary");
					break;
				case ".png":
					response.writeHead(200, {"Content-Type": "image/png"});
					response.end(file, "binary");
					break;
				case ".gif":
					response.writeHead(200, {"Content-Type": "image/gif"});
					response.end(file, "binary");
					break;
				case ".html":
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write(file);
					response.end();
					break;
				case ".css":
					response.writeHead(200, {"Content-Type": "text/css;"});
					response.write(file);
					response.end();
					break;
				case ".js":
					response.writeHead(200, {"Content-Type": "text/javascript"});
					response.write(file);
					response.end();
					break;
				case ".txt":
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(file);
					response.end();
					break;
				default:
					response.writeHead(200);
					response.write(file, "binary");
					response.end();
					break;
			}
		});
	});
}

http.createServer(onRequest).listen(8888);
console.log("Start listening on port 8888");