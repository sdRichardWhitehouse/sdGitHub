module.exports = {
	foo: function() {
		return sayHello();
	},
	runScript: function () {
		var request = require("request"),
			cheerio = require("cheerio"),
			urlChecking = -1,
			buildSite = "Very",
			device = "Desktop", // Mobile / Desktop
			userAgent = "";

		var testList = [];
		var testObject = { 
			testObject: 'testObject1'
		};
		testList.push(testObject);
		testObject = { 
			testObject: 'testObject2'
		};
		testList.push(testObject);
		

		process.argv.forEach(function (val, index, array) {
			if (index == 2) {
				buildSite = val;
			}
			else if(index == 3) {
				device = val;
			}
		});

		if (buildSite == "help")
		{
			console.log("\x1b[32m\x1b[1m", "Welcome to the help section" ,"\x1b[0m");
			console.log("'node app.js' and 'node app.js Very' - Checks Very Desktop");
			console.log("'node app.js Littlewoods Desktop' - Checks Littlewoods Desktop");
			console.log("'node app.js LittlewoodsIreland Mobile' - Checks Littlewoods Ireland Mobile");
			console.log("'node app.js VeryExclusive Mobile' - Checks Very Exclusive Mobile");
		} else {
			var veryUrls = [
				{ title: "Gallery Page", path: "http://www.very.co.uk/women/dresses/e/b/1655.end" },
				{ title: "Product Page", path: "http://www.very.co.uk/v-by-very-stripe-turtleneck-midi-dress/1600093559.prd" },
				{ title: "Zone Page", path: "http://www.very.co.uk/women/e/b/1589.end" },
				{ title: "General Page", path: "http://www.very.co.uk/help/en/online-help-system/help_contact" },
				{ title: "Home Page", path: "http://www.very.co.uk" }
			];

			var littlewoodsUrls = [
				{ title: "Gallery Page", path: "http://www.littlewoods.com/women/dresses/e/b/1655.end" },
				{ title: "Product Page", path: "http://www.littlewoods.com/v-by-very-stripe-turtleneck-midi-dress/1600093559.prd" },
				{ title: "Zone Page", path: "http://www.littlewoods.com/women/e/b/1589.end" },
				{ title: "General Page", path: "http://www.littlewoods.com/help/en/online-help-system/help_contact" },
				{ title: "Home Page", path: "http://www.littlewoods.com/" }
			];

			var littlewoodsIrelandUrls = [
				{ title: "Gallery Page", path: "http://www.littlewoodsireland.ie/women/dresses/e/b/1655.end" },
				{ title: "Product Page", path: "http://www.littlewoodsireland.ie/v-by-very-chiffon-maxi-dress/1600141513.prd" },
				{ title: "Zone Page", path: "http://www.littlewoodsireland.ie/women/e/b/1589.end" },
				{ title: "General Page", path: "http://www.littlewoodsireland.ie/help/en/online-help-system/help_contact" },
				{ title: "Home Page", path: "http://www.littlewoodsireland.ie/" }
			];

			var veryExclusiveUrls = [
				{ title: "Gallery Page", path: "http://www.veryexclusive.co.uk/women/clothing/dresses/e/b/116878.end" },
				{ title: "Product Page", path: "http://www.veryexclusive.co.uk/needle-thread-lace-foliage-prom-dress-black/1600150478.prd" },
				{ title: "Zone Page", path: "http://www.veryexclusive.co.uk/women/clothing/e/b/116877.end" },
				{ title: "General Page", path: "http://www.veryexclusive.co.uk/help/en/online-help-system/help_contact" },
				{ title: "Home Page", path: "http://www.veryexclusive.co.uk/" }
			];
			
			if (device == "Mobile") {
				userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
			} else if (device != "Desktop") {
				console.log("\x1b[31m\x1b[1m","Invalid Device Selected. Run 'node app.js options' for help. Using Desktop.","\x1b[0m");
				device = "Desktop";
			}
			
			urls = veryUrls;
			if (buildSite == "Littlewoods") { urls = littlewoodsUrls; }
			else if (buildSite == "LittlewoodsIreland") { urls = littlewoodsUrls; }
			else if (buildSite == "VeryExclusive") { urls = littlewoodsUrls; }
			else if (buildSite != "Very") {
				buildSite = "Very";
				console.log("\x1b[31m\x1b[1m", "Invalid Site Selected. Using Very. Run 'node app.js options' for help" ,"\x1b[0m");
				urls = veryUrls;
			}

			console.log("\x1b[1m", "Checking: " + buildSite + " - " + device ,"\x1b[0m");

			checkUrl();	
			return testList;
		}
	}
};

function sayHello() {
	return "Hello4";
}

function checkUrl() {
	urlChecking = urlChecking + 1;
	if (urls[urlChecking]) {
		console.log("");
		console.log("");
		console.log("\x1b[37m\x1b[1m",urls[urlChecking].title,"\x1b[0m", "(" + urls[urlChecking].path + ")");
		//console.log("Checking: " + urls[urlChecking].title + " (" + urls[urlChecking].path + ")");
		makeUrlRequest(urls[urlChecking].path);
	} else {
		// console.log("finished");
	}
}

function makeUrlRequest(url) {
	console.log(userAgent);
	var options = {
		url: url,
		headers: {
			'User-Agent': userAgent
		}
	};
	
	request(options, 
		function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body),
			scriptTags = $('script, link');
			
			for (var i = 0, len = scriptTags.length; i < len; i++) {
				if($(scriptTags[i]).attr('src') && $(scriptTags[i]).attr('src').indexOf('content.') > 0) {
					console.log("JS Source: " + $(scriptTags[i]).attr('src'));
				}
			else if($(scriptTags[i]).attr('href') && $(scriptTags[i]).attr('href').indexOf('content.') > 0 && 
				$(scriptTags[i]).attr('href').indexOf('.png') < 0 && $(scriptTags[i]).attr('href').indexOf('.ico') < 0) {
					console.log("CSS Source: " + $(scriptTags[i]).attr('href'));
				}
			}
		} else {
			console.log("We've encountered an error: " + error);
		}
		checkUrl();
		}
	);
}