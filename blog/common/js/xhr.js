function XHR() {
	var self = this;
	this.xhr = null;
	
    if (window.XMLHttpRequest) {
        this.xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        this.xhr = new ActiveXObject("MSXML2.XMLHTTP.3.0");
    }

	this.get = function(url, cb, fail_cb) {
		
		self.xhr.addEventListener("readystatechange", function() {
			if(self.xhr.readyState === 4) {
				if(self.xhr.status >= 400) {
					if(fail_cb) {
						fail_cb(self.xhr.status);
					}
				}else{
					cb(self.xhr.response);
				}
			}
		});
		self.xhr.open("GET", url, true);
		self.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		self.xhr.send();
	};
}

