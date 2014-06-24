var logo_color = [
["PU-110", "#ebe6ea"],
["PU-101", "#1c1c1c"],
["PU-109", "#2b3687"],
["PU-102", "#6781c2"],
["PU-108", "#2f2d46"],
["PU-235", "#e48ead"],
["PU-231", "#b2aeab"],
["PU-104", "#336a56"],
["PU-106", "#d00234"],
["PU-203", "#422a60"],
["PU-217", "#e74b2f"],
["PU-237", "#762438"],
["PU-112", "#edc618"],
["PU-323", "#d9f215"],
["PU-325", "#f62b5b"],
["PU-324", "#f6641e"],
["PU-322", "#47e206"],
["PU-001", "#a4a2a3", "銀"],
["PU-202", "#a99c68", "金"],
["PU-236", "#7e7a7b", "鏡"],
["PU-266", "#c60f33", "植毛"],
];

logo_color_bw = {
	black: ["PU-101", "#1c1c1c"],
	white: ["PU-110", "#ebe6ea"]
}

var tshirt = [
{
	name: "2000 Gildan",
	color: [
		["03c","#f8e298"],
		["11c","#85243d"],
		["12c","#97c043"],
		["20c","#f0d5da"],
		["24c","#f5c832"],
		["25c","#d26747"],
		["26c","#3993ca"],
		["30n","#fcfcfc"],
		["32c","#05081f"],
		["33c","#294333"],
		["36c","#151515"],
		["37c","#ec683c"],
		["40c","#d11b30"],
		["42c","#5c5d61"],
		["51c","#2d69ad"],
		["67c","#98876c"],
		["69c","#b7cae5"],
		["81c","#372676"],
		["84c","#8f7065"],
		["93h","#d4d3d9"],
		["95h","#b7b6bc"],
		["98c","#f7e12c"],
		["105c","#3a2929"],
		["106c","#5e5d49"],
		["167c","#2bb45f"],
		["187c","#a8d4ec"],
	],
	black: ["36c","#151515"],
	white: ["30n","#fcfcfc"],
	size: ["S","M","L","XL"],
	reference: "ref1.png",
},
{
	name: "2000B Gildan Youth",
	color: [
		["10c","#c21a63"],
		["11c","#85243d"],
		["12c","#97c043"],
		["20c","#f0d5da"],
		["30n","#fcfcfc"],
		["32c","#05081f"],
		["36c","#151515"],
		["37c","#ec683c"],
		["40c","#d11b30"],
		["51c","#2d69ad"],
		["69c","#b7cae5"],
		["81c","#372676"],
		["95h","#b7b6bc"],
		["98c","#f7e12c"],
		["167c","#2bb45f"],
	],
	black: ["36c","#151515"],
	white: ["30n","#fcfcfc"],
	size: ["XS","S","M","L","XL"],
	reference: "ref2.png",
},

{
	name: "76000/63000 Gildan Asian Fit",
	color: [
		["30n","#fcfcfc"],
		["32c","#05081f"],
		["36c","#151515"],
		["37c","#ec683c"],
		["40c","#d11b30"],
		["51c","#2d69ad"],
		["98c","#f7e12c"],
		["167c","#2bb45f"],
		["109c","#9cb4d7"],
	],
	black: ["36c","#151515"],
	white: ["30n","#fcfcfc"],
	size: ["XS","S","M","L","XL"],
	reference: "ref3.png",
},

{
	name: "日本系列",
	color: [
		["01","#fafbf6"],
		["02","#151515"],
		["03","#131631"],
		["04","#aaaba5"],
		["09","#30874e"],
		["10","#be5120"],
		["20","#3b3b84"],
		["22","#684584"],
		["05","#e3c814"],
		["06","#9e281b"],
	],
	white: ["01","#fafbf6"],
	black: ["02","#151515"],
	size: ["S","M","L","XL"],
	reference: "ref4.jpg",
},

];


var svg_logo_color = null;
var svg_tshirt_color = null;
var logo_cp = null;
var tee_cp = null;

var color_choice = {
	logo: "PU-101",
	tshirt: null,
};

function render_tshirt_colorpicker(idx)
{
	tee_cp.innerHTML = "";

	var i;
	var color = tshirt[idx].color
	for (i=0; i<color.length; i++) {
		var colorblock = document.createElement("span");
		colorblock.className = "colorblock";
		colorblock.style.backgroundColor = color[i][1];
		colorblock.setAttribute("data-color", color[i][0]);

		colorblock.addEventListener("click", function() {
			svg_tshirt_color.setAttribute("fill", this.style.backgroundColor);
			color_choice.tshirt = this.getAttribute("data-color");
		});

		tee_cp.appendChild(colorblock);		
	}

	var size = tshirt[idx].size;
	var select = document.getElementById("tshirt-size");
	select.innerHTML = "";
	for (i=0; i<size.length; i++) {
		select.innerHTML += '<option value="'+size[i]+'">' +size[i]+'</option>';
	}

	svg_tshirt_color.setAttribute("fill", tshirt[idx].white[1]);

	var ref = document.getElementById("tshirt-ref")
	ref.setAttribute("href", "images/"+tshirt[idx].reference);
	ref.setAttribute("target", "_blank");

	color_choice.tshirt = tshirt[idx].white[0];
}

function main()
{
	svg_logo_color = document.getElementById("logo-color");
	svg_tshirt_color = document.getElementById("tshirt-color");

	logo_cp = document.getElementById("logo-colorpicker");
	tee_cp = document.getElementById("tshirt-colorpicker");

	var i;
	for (i=0; i<logo_color.length; i++) {
		var colorblock = document.createElement("span");
		colorblock.className = "colorblock";
		colorblock.style.backgroundColor = logo_color[i][1];
		colorblock.setAttribute("data-color", logo_color[i][0]);

		if (logo_color[i].length == 3) {
			colorblock.innerHTML = logo_color[i][2];
		}

		colorblock.addEventListener("click", function() {
			svg_logo_color.setAttribute("fill", this.style.backgroundColor);
			color_choice.logo = this.getAttribute("data-color");
		});

		logo_cp.appendChild(colorblock);
	}

	var select = document.getElementById("tshirt-type");
	for (i=0; i<tshirt.length; i++) {
		select.innerHTML += '<option value="'+i+'">' +tshirt[i].name+'</option>';
	}
	select.addEventListener("change", function(e){
		render_tshirt_colorpicker(this.value);
	});

	render_tshirt_colorpicker(0);

	document.getElementById("submit-button").addEventListener("click", function(){
		var msg = "";
		msg += "Logo Color: " + color_choice.logo +"\n"; 
		msg += "T-Shirt Color: " + color_choice.tshirt;
		msg += ", Type: " + tshirt[select.value].name;
		msg += ", Size: " + document.getElementById("tshirt-size").value + "\n";

		if (document.getElementById("fallback-bow").checked) {
			msg += "Fallback: Black Logo, White T-Shirt";
		}else{
			msg += "Fallback: White Logo, Black T-Shirt";
		}
	
		var txt = document.getElementById("clipboard_txt");
		txt.innerHTML = msg;
		txt.className = "";
		txt.select();
	});
}

window.addEventListener("load", main);
