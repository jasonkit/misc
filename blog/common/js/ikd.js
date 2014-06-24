// _channels: mapping between channel and its list of handlers
// status: used to indicate module's status
// load_path: every relative path for loading is prepend by load_path
//
// For server-client model, ikd.status can be used to indicate the server status, since both client and server
// may not be ready at first, when client want to make a request to server, it can first check server's status in
// ikd.status, client should also a handler for handling server's "ready" event. In the server side, when server 
// finished all the initialization stuff, it should update ikd.status to "ready", it should also send out "ready"
// event to all the handlers. By doing so, both client and server can make sure each other has been initialized.

var ikd = {
	_channels : {},
	status : {},
	load_path : "",
	event_debug: false,
};

ikd._is_load_already = function (url)
{
	var script_list = document.getElementsByTagName("script");
	var i;
	var is_loaded = false;

	for (i=0; i<script_list.length; i++) {
		if (script_list[i].src === url) {
			is_loaded = true;
			break;
		}
	}

	return is_loaded;
};

ikd._do_load = function(load_queue)
{
	var url = load_queue.queue.shift();
	var script = document.createElement("script");
	var cb = function () { 
			if (load_queue.queue.length === 0) {
				if (load_queue.callback !== undefined) {
					load_queue.callback();
				}
			} else {
				ikd._do_load(load_queue);
			}
	};

	if (url.substr(0,4) !== "http") {
		url = ikd.load_path + url;
	}

	script.type = "text/javascript";
	if (script.readyState) {
		var loader_cb = function () {
			if (script.readyState === "loaded" || script.readyState === "complete") {
				script.removeEventListener("readystatechange", loader_cb);
				cb();
			}
		};

		script.addEventListener("readystatechange", loaded_cb);
	} else {
		script.addEventListener("load", cb);	
	}

	script.src = url;
	if (ikd._is_load_already(script.src)) {
		cb();
	} else {
		document.getElementsByTagName("head")[0].appendChild(script);
	}
};

ikd.load = function (urls, cb)
{
	if(typeof urls === "string") {
		urls = [urls];
	}

	var load_queue = {
		queue : urls,
		callback : cb,
	};

	ikd._do_load(load_queue);
};

ikd.default_handle = function (msg)
{
	var handler = "on_" + msg.msg_id;

	if ((this[handler] !== undefined) && (typeof this[handler] === "function")) {
		this["on_"+msg.msg_id](msg);
	}
};

ikd.subscribe = function (handler, channel)
{
	if (typeof handler.handle !== "function") {
		handler.handle = ikd.default_handle;
	}

	if (ikd._channels[channel] === undefined) {
		ikd._channels[channel] = [];
	}

	ikd._channels[channel].push(handler);
};

ikd.unsubscribe = function (handler, channel)
{
	if (ikd._channels[channel] === undefined) {
		throw "channel_not_exists";
	}

	var i = -1;
	for (i=0; i<ikd._channels[channel].lenght; i++) {
		if (ikd._channels[channel][i] === handler) {
			break;
		}
	}

	if (i >= 0 && i < ikd._channels[channel].length) {
		ikd._channels[channel].splice(i,1);
	} else {
		throw "subscriber_not_found_in_channel";
	}
};

// Some recommended but not necessary message fields:
// sender: ref to sender obj
// cb: callback function
ikd.publish = function (channel, message)
{
	if (typeof message === "string") {
		message = {msg_id: message};
	}


	if (message.msg_id === undefined) {
		throw "message_without_id";
	}

	if (ikd._channels[channel] === undefined) {
		ikd._channels[channel] = [];
	}

	if (ikd.event_debug) {
		console.log("Published ["+message.msg_id+"] on ["+channel+"]");
	}

	var i;
	for (i=0; i<ikd._channels[channel].length; i++) {
		ikd._channels[channel][i].handle(message);
	}
};

ikd.create_ui = function (id, setup)
{
	var ui = {};

	ui.event_handler = {
		handle: ikd.default_handle,
		init: null,
	};

	ui.setup = setup;
	ui.setup();

	var _init = function () {

		if (typeof id === "string") {
			ui.element = document.getElementById(id);

			if ((ui.bind_list !== undefined) && (ui.bind_list instanceof Array)) {
				var i;
				for (i=0; i<ui.bind_list.length; i++) {
					var event = ui.bind_list[i];
					ui.element.addEventListener(event, ui.event_handler["on_"+event]);
				}
			}
		} else {
			var i;
			ui.element = {};
			for (i=0; i<id.length; i++) {
				ui.element[id[i]] = document.getElementById(id[i]);

				if ((ui.bind_list !== undefined) && (typeof ui.bind_list === "object")) {
					for (element in ui.bind_list) {
						var j;
						for (j=0; j<ui.bind_list[element].length; j++) {
							var event = ui.bind_list[element][j];
							ui.element[element].addEventListener(event, ui.event_handler[element]["on_"+event]);
						}	
					}
				}
			
			}
		}

		if ((ui.init !== null) && (typeof ui.init === "function")) {
			ui.init();
		}
	};

	if (document.readyState === "complete") {
		_init();
	} else {
		window.addEventListener("load", _init);
	}

	return ui;
};
