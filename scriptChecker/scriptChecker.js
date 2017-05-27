var request = require("request"),
	cheerio = require("cheerio"),
	promise = require("promise"),
	urlChecking = -1,
	buildSite = "Very",
	device = "Desktop", // Mobile / Desktop
	userAgent = "",
	scriptsRequested = 0,
	scriptsReturned = 0,
	scriptRequestComplete = false;

module.exports = {
	foo: function() {
		return sayHello();
	},
	runScript: function () {
		return new Promise(function (resolve, reject) {
			var testList = [];
			

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
				var veryUrls = {
					siteId: "Very",
					urls: [
						{ title: "Gallery Page", path: "http://www.very.co.uk/women/dresses/e/b/1655.end" },
						{ title: "Product Page", path: "http://www.very.co.uk/v-by-very-stripe-turtleneck-midi-dress/1600093559.prd" },
						{ title: "Zone Page", path: "http://www.very.co.uk/women/e/b/1589.end" },
						{ title: "General Page", path: "http://www.very.co.uk/help/en/online-help-system/help_contact" },
						{ title: "Home Page", path: "http://www.very.co.uk" }
					]
				};

				var littlewoodsUrls = {
					siteId: "Littlewoods",
					urls: [
						{ title: "Gallery Page", path: "http://www.littlewoods.com/women/dresses/e/b/1655.end" },
						{ title: "Product Page", path: "http://www.littlewoods.com/v-by-very-stripe-turtleneck-midi-dress/1600093559.prd" },
						{ title: "Zone Page", path: "http://www.littlewoods.com/women/e/b/1589.end" },
						{ title: "General Page", path: "http://www.littlewoods.com/help/en/online-help-system/help_contact" },
						{ title: "Home Page", path: "http://www.littlewoods.com/" }
					]
				};

				var littlewoodsIrelandUrls = {
					siteId: "LittlewoodsIreland",
					urls: [
						{ title: "Gallery Page", path: "http://www.littlewoodsireland.ie/women/dresses/e/b/1655.end" },
						{ title: "Product Page", path: "http://www.littlewoodsireland.ie/v-by-very-chiffon-maxi-dress/1600141513.prd" },
						{ title: "Zone Page", path: "http://www.littlewoodsireland.ie/women/e/b/1589.end" },
						{ title: "General Page", path: "http://www.littlewoodsireland.ie/help/en/online-help-system/help_contact" },
						{ title: "Home Page", path: "http://www.littlewoodsireland.ie/" }
					]
				};

				var veryExclusiveUrls = {
					siteId: "VeryExclusive",
					urls: [
						{ title: "Gallery Page", path: "http://www.veryexclusive.co.uk/women/clothing/dresses/e/b/116878.end" },
						{ title: "Product Page", path: "http://www.veryexclusive.co.uk/needle-thread-lace-foliage-prom-dress-black/1600150478.prd" },
						{ title: "Zone Page", path: "http://www.veryexclusive.co.uk/women/clothing/e/b/116877.end" },
						{ title: "General Page", path: "http://www.veryexclusive.co.uk/help/en/online-help-system/help_contact" },
						{ title: "Home Page", path: "http://www.veryexclusive.co.uk/" }
					]
				};
				testList.push(veryUrls);
				testList.push(littlewoodsUrls);
				testList.push(littlewoodsIrelandUrls);
				testList.push(veryExclusiveUrls);
				
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

				

				// outputObject(testList);
				checkSites(testList).then(function (data) { 
					console.log("finished in scriptChecker"); 
					// outputObject(data);
					resolve(data); 
				});
			}
		});
	}
};

function sayHello() {
	return "Hello4";
}

function checkSites(sites) {
	return new Promise(function (resolve, reject) {
		console.log("checking sites...");
		for (var i = 0, len = sites.length-1; i < len; i++) {
			console.log("Checking: " + sites[i].siteId);
			for (var j = 0, len = sites[i].urls.length-1; j < len; j++) {
				console.log("Checking URL: " + sites[i].urls[j].path);
				var passUrl = sites[i].urls[j];
				passUrl.site = i;
				passUrl.url = j;
				// outputObject(sites[i].urls[i]);
				makeUrlRequest(passUrl).then(function (data) { 
					console.log(scriptsRequested + " vs " + scriptsReturned);
					console.log("Retrieved Data: " + data.site + " vs " + data.url);
					console.log("Retrieved Data2: " + sites[data.site].siteId);
					sites[data.site].urls[data.url] = data;
					
					if (scriptsRequested === scriptsReturned) {
						console.log("sending back promise");
						outputObject(sites);
						resolve(sites);
					}
				});
			}
		}
		console.log("finished checkSites");
	});

}

function outputObject (object) {
	for (var key in object) {
		// skip loop if the property is from prototype
		if (!object.hasOwnProperty(key)) continue;

		var obj = object[key];
		for (var prop in obj) {
			// skip loop if the property is from prototype
			if(!obj.hasOwnProperty(prop)) continue;

			// your code
			console.log(prop + " = " + obj[prop]);
		}
	}
}

function makeUrlRequest(urlObject) {
	console.log("making url request...");
	// outputObject(urlObject);
	scriptsRequested = scriptsRequested + 1;
	// console.log(userAgent + " is the userAgent");
	// console.log(url + " is the url");
	var options = {
		url: urlObject.path,
		headers: {
			'User-Agent': userAgent
		}
	};
	urlObject.files = [];
	
	return new Promise(function (resolve, reject) {
		request(options, 
			function (error, response, body) {
				console.log(urlObject.site + " is the site");
				// console.log("inside the callback");
				if (!error) {
					var $ = cheerio.load(body),
					scriptTags = $('script, link');
					
					for (var i = 0, len = scriptTags.length; i < len; i++) {
						if($(scriptTags[i]).attr('src') && $(scriptTags[i]).attr('src').indexOf('content.') > 0) {
							urlObject.files.push({
								url: $(scriptTags[i]).attr('src'),
								type: "JS",
								site: urlObject.site,
								url: urlObject.url
							});
							// console.log("JS Source: " + $(scriptTags[i]).attr('src'));
						}
					else if($(scriptTags[i]).attr('href') && $(scriptTags[i]).attr('href').indexOf('content.') > 0 && 
						$(scriptTags[i]).attr('href').indexOf('.png') < 0 && $(scriptTags[i]).attr('href').indexOf('.ico') < 0) {
							// console.log("CSS Source: " + $(scriptTags[i]).attr('href'));

							urlObject.files.push({
								url: $(scriptTags[i]).attr('src'),
								type: "CSS",
								site: urlObject.site,
								url: urlObject.url
							});
						}
					}
				} else {
					console.log("We've encountered an error: " + error);
				}
				scriptsReturned = scriptsReturned + 1;
				// console.log("Requested: " + scriptsRequested + " vs " + "Returned: " + scriptsReturned);
				console.log("outputting so far");
				//outputObject(urlObject);
				console.log(urlObject.site + " is the returning site");
				resolve(urlObject);
			}
		);
	});
	// console.log("finished makeUrlRequest");
}