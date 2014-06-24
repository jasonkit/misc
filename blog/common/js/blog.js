var blog = {};

blog.get_data = function(id, attr)
{
	return document.getElementById(id).attributes["data-" + attr].nodeValue;
}

blog.render_article = function (content, with_comment)
{
	var article = document.createElement("article");
	article.innerHTML = content;

	var h1 = article.getElementsByTagName("h1")[0];
	var header = document.createElement("header");

	if (h1 !== undefined) {
		document.title += ": " + h1.innerText;
		header.innerHTML = "<a href=\"" + window.location + "\">" + h1.innerText + "</a>";
		article.insertBefore(header,h1);
		article.removeChild(h1);
	}

	document.getElementById("post-holder").appendChild(article);

	blog.gist_post_process(article);
	blog.date_post_process(article);
	
	if (with_comment) {
		blog.disqus_post_process(article);
	}
};

blog.disqus_post_process = function (article)
{
	var script = document.createElement('script');

	script.type = 'text/javascript';
	script.async = true;
	script.src = 'http://' + blog.disqus_shortname + '.disqus.com/embed.js';

	article.innerHTML += '<div class="seperator"></div><div id="disqus_thread"></div>';

	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
};

// Replace [gist:GIST_ID] with the syntax highlighted code
blog.gist_pre_process = function (content)
{
	var pattern = /\[gist:([0-9]+)\]/g;
	var match = content.match(pattern);

	if (match !== null) {
		var i;
		for (i=0; i<match.length; i++) {
			var str = match[i];
			str = str.substring(6,str.length-1);
			var gist = "<div id=\"gist"+str+"-holder\" class=\"gist-holder\"></div>";

			content = content.replace(match[i],gist);
		}
	}

	return content;
};

blog.gist_post_process = function (article)
{
	var gists = article.getElementsByClassName("gist-holder");
	var i;

	for(i=0; i<gists.length; i++) {
		var id = gists[i].id;
		var script = document.createElement("script");

		id = id.replace("gist","").replace("-holder","");

		script.type = "text/javascript";
		script.async = true;
		script.src = "https://gist.github.com/" + id + ".js";
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
	}
};

blog.gist_callback = function (str)
{
	var holder = document.createElement("div");
	holder.innerHTML = str;

	var node = holder.firstChild;
	if (node instanceof HTMLDivElement) {
		if(node.id.substring(0,4) === "gist") {
			document.getElementById(node.id+"-holder").appendChild(node);
			var script = document.querySelector("script[src=\"https://gist.github.com/" + node.id.substring(4) + ".js\"]");
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).removeChild(script);
		}
	}
};

// Replace [date:ANY_DATE_FORMAT] to time tag and place below header of the article
blog.date_pre_process = function (content)
{
	var pattern = /\[date:(.+)\]/g;
	var match = content.match(pattern);

	if (match !== null) {
		var str = match[0];
		var date = new Date(str.substring(6,str.length-1));

		var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul" , "Aug", "Sep", "Oct", "Nov", "Dec"];
		str = date.getDate() + " " + month[date.getMonth()] + ", " + date.getFullYear();

		var time = "<time>"+str+"</time>";
		content = content.replace(match[0],time);
	}

	return content;
};

blog.date_post_process = function (article)
{
	var time = article.getElementsByTagName("time")[0];
	if (time !== undefined) {
		if (article.firstChild.tagName === "HEADER") {
			article.insertBefore(time, article.childNodes[1]);
		}else{
			article.insertBefore(time, article.childNodes[0]);
		}
	}
};

blog.process_content = function (content)
{
	content = marked(content);
	content = blog.gist_pre_process(content);
	content = blog.date_pre_process(content);
	return content;
};

blog.parse_query = function ()
{
	var items = window.location.search.substring(1).split("&");	
	var i;
	var query = {};

	for (i=0; i<items.length; i++) {
		var item = items[i].split("=");
		query[item[0]] = item[1];
	}

	return query;
};

blog.render_message = function (message) {
	var msg = document.getElementById("message");
	msg.textContent = message;
	msg.style.display = "block";
	document.getElementById("post-holder").style.display = "none";
	
};

blog.remove_message = function () {
	var msg = document.getElementById("message");
	msg.style.display = "none";
	document.getElementById("post-holder").style.display = "block";
};

blog.start = function ()
{
	var url = "";

	// Make the URL don't contain index.html so that there can have unique url for each article
	if (window.location.pathname.match("index.html") !== null) {
		url = window.location.toString();
		url = url.replace("index.html","");
		window.location = url;
	}

	// Mainly for displaying gist as gist using document.write to render html
	document.write = function() {
		blog.gist_callback(arguments[0]);
	};

	var query = blog.parse_query();
	var xhr = new XHR();

	var with_comment = false;

	if (query.article !== undefined) {
		url = "./article/" + query.article + ".txt";
		with_comment = true;
	}else if (query.static !== undefined) {
		url = "./static/" + query.static + ".txt";
		with_comment = false;
	}else{
		url = "./static/archive.txt";
		with_comment = false;
	}

	blog.render_message(blog.message.loading);
	
	xhr.get(url, function(content){
		blog.remove_message();
		content = blog.process_content(content);
		blog.render_article(content, with_comment);
	}, function() {
		blog.render_message(blog.message.error);
	});
};

// Init
blog.init = function () 
{
	blog.disqus_shortname = blog.get_data("post-holder", "disqus_shortname");
	blog.message = {
		"loading": blog.get_data("message", "loading"),
		"error": blog.get_data("message", "error")
	};
	
	ikd.load(["xhr.js", "marked.js"], blog.start);
};
