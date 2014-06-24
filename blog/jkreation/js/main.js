function load()
{
	var lib = ["blog.js"];
	
	ikd.load_path = "../common/js/";
	ikd.load(lib, function(){ blog.init();});
}

window.addEventListener("load", load);
