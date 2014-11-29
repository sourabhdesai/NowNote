
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(__dirname);
	res.setHeader('Content-Type','text/html');
	res.sendfile('views/index.html');
};