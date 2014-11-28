var width = 640;
var height = 480;

var svg = d3.select("#svgHolder").append("svg")
    .attr("width", width)
    .attr("height", height)
.append("g");


var circleData = [];

// Define first circle and type of motion:- circular
var t_circle = d3.map();
t_circle.set("id", 1);
t_circle.set("cr", 10);
t_circle.set("rotr", 100);
t_circle.set("rtype", "circle");
t_circle.set("offset", 20);
t_circle.set("timelimit", 2000);
t_circle.set("starttime", undefined);
t_circle.set("elapsed", 0);
t_circle.set("x", 100);
t_circle.set("y", 100);
t_circle.set("scale", 1);
t_circle.set("move", false);
circleData.push(t_circle);

// Elliptical motion
t_circle = d3.map();
t_circle.set("id", 2);
t_circle.set("cr", 20);
t_circle.set("rotrx", 200);
t_circle.set("rotry", 100);
t_circle.set("rtype", "ellipse");
t_circle.set("offset", -100);
t_circle.set("timelimit", 2000);
t_circle.set("starttime", undefined);
t_circle.set("elapsed", 0);
t_circle.set("x", 200);
t_circle.set("y", 100);
t_circle.set("scale", 1);
t_circle.set("move", false);
circleData.push(t_circle);


// Create the circle elements, and move them into their start positions
var circle = svg.selectAll("circle")
	.data(circleData, function(d) { return d.get('id');})
	.enter()
	.append("circle")
	.attr("r", function(d)	{ return d.get('cr'); })
	.attr('d', function(d) {
		var initial_x = (d.get('rotr') != undefined ? d.get('rotr') : d.get('rotrx')); 
		d.set('x', (width/2) + d.get('offset') + initial_x);
		d.set('y', (height/2) + d.get('offset'));
		return d;
	})
	.attr("transform", function(d) {return "translate(" + d.get('x') + "," + d.get('y') + "), scale(" + d.get('scale') + ")";});

// Create the text elements, bind the same data:
var text = svg.selectAll("text")
	.data(circleData, function(d) { return d.get('id');})
	.enter()
	.append("text")
	.text(function(d){  return d.get('id');})


// timer_ret_val: could be used to stop the timer, but not actually used in this code really. 
var timer_ret_val = false;

// Keeps a record of the elapsed time since the timer began.
var timer_elapsed = 0;

// Kick off the timer, and the action begins: 
d3.timer(tickFn);


function tickFn(_elapsed) {
	timer_elapsed = _elapsed;

	// Process all circles data. 
	for (var i = 0; i<circleData.length;i++)	{

		var t_circleData = circleData[i];
		if (t_circleData.get('move') == true)	{
			if (t_circleData.get('starttime') == undefined)
				t_circleData.set('starttime', _elapsed);

			// Calc elapsed time.
			var t_elapsed = _elapsed - t_circleData.get('starttime');

			// Keep a record.
			t_circleData.set('elapsed', t_elapsed);

			// Calculate how far through the desired time for one iteration.
			var t = t_elapsed / t_circleData.get('timelimit');

			// Calculate new x/y positions depending upon whether circular or elliptical motion required.
			if (t_circleData.get('rtype') == 'circle')	{
				var rotation_radius = t_circleData.get('rotr');
				var t_offset = t_circleData.get('offset');
				var t_angle = (2 * Math.PI) * t;
				var t_x = rotation_radius * Math.cos(t_angle);
				var t_y = rotation_radius * Math.sin(t_angle);

				t_circleData.set('x', (width/2) + t_offset + t_x);
				t_circleData.set('y', (height/2) + t_offset + t_y);
			}

			if (t_circleData.get('rtype') == 'ellipse')	{
				var rotation_radius_x = t_circleData.get('rotrx');
				var rotation_radius_y = t_circleData.get('rotry');
				var t_offset = t_circleData.get('offset');
				var t_angle = (2 * Math.PI) * t;
				var t_x = rotation_radius_x * Math.cos(t_angle);
				var t_y = rotation_radius_y * Math.sin(t_angle);

				t_circleData.set('x', (width/2) + t_offset + t_x);
				t_circleData.set('y', (height/2) + t_offset + t_y);
			}
		}
	}


	// Actually move the circles and the text.
	var t_circle = svg.selectAll("circle");
	t_circle
		.attr("transform", function(d) {return "translate(" + d.get('x') + "," + d.get('y') + "), scale(" + d.get('scale') + ")";});

	var t_text = svg.selectAll("text");
	t_text
		.attr("transform", function(d) {return "translate(" + d.get('x') + "," + d.get('y') + "), scale(" + d.get('scale') + ")";});


	return timer_ret_val;
}


// These two buttons don't stop the timer, 
// just set flags to indicate that these two elements should stop/start:
var startbtn=d3.select("#startbtn");
startbtn.on("click", function()	{
	for (var i = 0; i<circleData.length;i++)	{
		var t_circleData = circleData[i];
		t_circleData.set('move', true);
		t_circleData.set('starttime', timer_elapsed - t_circleData.get('elapsed'));
	}

});


var stopbtn=d3.select("#stopbtn");
stopbtn.on("click", function()	{
	for (var i = 0; i<circleData.length;i++)	{
		var t_circleData = circleData[i];
		t_circleData.set('move', false);
	}

});