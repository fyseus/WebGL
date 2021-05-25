"use strict";

var canvas, gl, program;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc;
var vBuffer, cBuffer;
var vBuffer2, cBuffer2;//四面体
var vBuffer3, cBuffer3;//圆锥
var vBuffer4,cBuffer4;//圆锥
var vBuffer5,cBuffer5;//球体
var colors5=[];//球体颜色
var Vertices_Q=[];//球体
var colors3=[],colors4=[];//圆锥
var Vertices_circle=[],Vertices_circle_h=[];
var NumYuanZhui = 1;
var NumVertices = 36; //正方体36个顶点
var points = [];
var colors = [];
var vertices = [
    vec4( -1, -1,  0, 1.0 ),
    vec4( -1,  0,  0, 1.0 ),
    vec4(  0,  0,  0, 1.0 ),
    vec4(  0, -1,  0, 1.0 ),
    vec4( -1, -1, -1, 1.0 ),
    vec4( -1,  0, -1, 1.0 ),
    vec4(  0,  0, -1, 1.0 ),
    vec4(  0, -1, -1, 1.0 )
];

var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 5.0;
var theta= [ 0, 0, 0, 0, 0];//存那个
var count=0;
var up_sign = 0;
var right_sign=0;
var right_length=0;
var left_sign=0;
var forward_sign=0;
var forward_length=0;
var back_sign=0;
var down_sign = 0;
var up_height = 0;
var leg_angle = 0;
var actions = 0;

var turnleft_sign=0;
var turnright_sign=0;
var right_angle=0;
var shine_sign=0;
var count_snow=0;

var angle = 0;//角度
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var NumVertices2 = 12; //四面体12个顶点
var points2 = [];
var colors2 = [];
var colors6=[//95,158,160
    vec4( 1.0,182/255,193/255, 1.0 ),  // black
    vec4( 72/255, 209/255, 204/255, 1.0 ),  // red
    vec4( 72/255, 209/255, 204/255, 1.0 ),  // yellow
    vec4( 1.0,182/255,193/255, 1.0 ),  // green
    vec4( 72/255, 209/255, 204/255, 1.0 ),  // blue
    vec4( 1.0,182/255,193/255, 1.0 ),  // magenta
    vec4( 1.0,182/255,193/255, 1.0 ),  // white
    vec4( 72/255, 209/255, 204/255, 1.0 )   // cyan
];
var vertices2 = [
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( 0.5,  -0.5, -0.5, 1.0 ),
    vec4(  0,  -0.5, 1, 1.0 ),
    vec4(  0, 0.5, 0, 1.0 )
];
function quadT(  a,  b,  c ) {
    colors2.push(vertexColors[a]);
    points2.push(vertices2[a]);
    colors2.push(vertexColors[a]);
    points2.push(vertices2[b]);
    colors2.push(vertexColors[a]);
    points2.push(vertices2[c]);
}
function quad4() {
    quadT(  0,  1,  2 );
	quadT(  0,  1,  3 );
	quadT(  2,  3,  0 );
	quadT(  2,  3,  1 );
}

window.onload = function init() {

    initOfFile();
	
	
	
	
	
	
	
	
	
    
	

    
	getData();//存在theta[0..2]中
	endOfFile();
	render();
}
function base() {
	quad4();
	vBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points2), gl.STATIC_DRAW );
	createvPosition();
	cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );
	createvColor();
    var s = scale4(1, 1, 1);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
	t=mult(t,translate(0,-2,0));
	t=mult(t,rotate(45,[1,1,1]));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices2 );//绘制图像函数
}
function right_up_leg(){
	colorCube();//长方体
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	createvPosition();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	createvColor();
	var s = scale4(0.35, 2, 0.35);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(-4.3,-1.5,2.4));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );//绘制图像函数
}
function right_down_leg(){
	colorCube();//长方体
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	createvPosition();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	createvColor();
	var s = scale4(0.35, 1, 0.35);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(-4.3,-5,2.4));
    t = mult(t,rotateZ(-leg_angle));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );//绘制图像函数
}
function left_up_leg(){
	colorCube();//长方体
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	createvPosition();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	createvColor();
	var s = scale4(0.35, 2, 0.35);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(-4.3,-1.5,-1.85));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );//绘制图像函数
}
function left_down_leg(){
	colorCube();//长方体
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	createvPosition();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	createvColor();
	var s = scale4(0.35, 1, 0.35);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(-4.3,-5,-1.85));
    t = mult(t,rotateZ(-leg_angle));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );//绘制图像函数
}
function hat(){
	var x=0,y=0,h=3,l=1;
	Vertices_circle.push(vec4( x, y,  0, 1.0 ));
	colors3.push(vertexColors[6]);
	Vertices_circle_h.push(vec4( x, y,  h, 1.0 ));
	colors4.push(vertexColors[6]);
    var Degree=2*Math.PI/50;
	var x_cla,y_cla,Degree_n;
    for(var i=0;i<=50;i++)
    {
        Degree_n=Degree*i;
        x_cla=x+Math.sin(Degree_n)*l;
        y_cla=y+Math.cos(Degree_n)*l;
        Vertices_circle.push(vec4( x_cla, y_cla,  0, 1.0 ));
		colors3.push(vertexColors[4]);
		Vertices_circle_h.push(vec4( x_cla, y_cla,  0, 1.0 ));
		colors4.push(vertexColors[4]);
    }
	vBuffer3 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer3 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Vertices_circle), gl.STATIC_DRAW );
	createvPosition();
	cBuffer3 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer3);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors3), gl.STATIC_DRAW);
	createvColor();
	var s = scale4(1, 1, 1);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(0,0,0));
    t = mult(t,rotateX(90));
    t = mult(t,rotateY(45));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 52 );//绘制图像函数
	
	vBuffer4 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer4 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Vertices_circle_h), gl.STATIC_DRAW );
	createvPosition();
	cBuffer4 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer4);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors4), gl.STATIC_DRAW);
	createvColor();
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 52 );//绘制图像函数
}

function body(){
	var x=0,y=0,h=3,l=1;
	Vertices_circle.push(vec4( x, y,  0, 1.0 ));
	colors3.push(vertexColors[7]);
	Vertices_circle_h.push(vec4( x, y,  h, 1.0 ));
	colors4.push(vertexColors[7]);
    var Degree=2*Math.PI/50;
	var x_cla,y_cla,Degree_n;
    for(var i=0;i<=50;i++)
    {
        Degree_n=Degree*i;
        x_cla=x+Math.sin(Degree_n)*l;
        y_cla=y+Math.cos(Degree_n)*l;
        Vertices_circle.push(vec4( x_cla, y_cla,  0, 1.0 ));
		colors3.push(vertexColors[7]);
		Vertices_circle_h.push(vec4( x_cla, y_cla,  0, 1.0 ));
		colors4.push(vertexColors[7]);
    }
	vBuffer3 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer3 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Vertices_circle), gl.STATIC_DRAW );
	createvPosition();
	cBuffer3 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer3);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors3), gl.STATIC_DRAW);
	createvColor();
	var s = scale4(1, 1, 1);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    t = mult(t,translate(-2.5,-4,0));
    t = mult(t,rotateX(90));
    t = mult(t,rotateY(-30));
    t = mult(t,scale4(1.5,1.5,1.5));

    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 52 );//绘制图像函数
	
	vBuffer4 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer4 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Vertices_circle_h), gl.STATIC_DRAW );
	createvPosition();
	cBuffer4 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer4);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors4), gl.STATIC_DRAW);
	createvColor();
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 52 );//绘制图像函数
}
function head(){
	var num=0;
	var x=0,y=0,z=0,l=1;
	Vertices_Q.push(vec4( x, y,  z, 1.0 ));
	colors5.push(vec4( 1.0, 1.0, 1.0, 1.0 ));
	num=num+1;
    var Degree=2*Math.PI/50;
	var x_cla1,y_cla1,x_cla2,y_cla2,Degree_n,Degree_n2,Degree_n3,z1,z2;
    for(var i=0;i<50;i++)
    {
		Degree_n=Math.PI/2-Degree*i/2;
		Degree_n2=Math.PI/2-Degree*(i+1)/2;
		z1=Math.sin(Degree_n)*l;
		z2=Math.sin(Degree_n2)*l;
		for(var j=0;j<=50;j++){
			Degree_n3=Degree*j;
			x_cla1=x+Math.sin(Degree_n3)*Math.cos(Degree_n)*l;
			y_cla1=y+Math.cos(Degree_n3)*Math.cos(Degree_n)*l;
			Vertices_Q.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			colors5.push(vec4(1,1,(50-i)/50,1.0));
			x_cla2=x+Math.sin(Degree_n3)*Math.cos(Degree_n2)*l;
			y_cla2=y+Math.cos(Degree_n3)*Math.cos(Degree_n2)*l;
			Vertices_Q.push(vec4( x_cla2, y_cla2,  z2, 1.0 ));
			colors5.push(vec4(1,1,(49-i)/50,1.0));
			num=num+2;
		}
    }
	vBuffer5 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer5 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(Vertices_Q), gl.STATIC_DRAW );
	createvPosition();
	cBuffer5 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer5);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors5), gl.STATIC_DRAW);
	createvColor();
	var s = scale4(1, 1, 1);
    var instanceMatrix = s;
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, num );//绘制图像函数
	
	
}
function Background(){
	colorCube();//长方体
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	createvPosition();
	
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors6), gl.STATIC_DRAW );
    createvColor();
    
    var s = scale4(20, 20, 5);
    s = mult(s,translate(0.50,0.50,-1.5));
    
    
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(s) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );//绘制图像函数
	if(shine_sign==1){
		//alert("event.keyCode");
		var color_snow=[];
		var points_snow=[];
		for(var i=0;i<40;i++){
			var x=Math.random()*2-1;
			var y=Math.random()*2-1;
			var z=Math.random()*2-1;
			points_snow.push(vec4(x,y,z,1));
			points_snow.push(vec4(x+0.01,y,z,1));
			points_snow.push(vec4(x+0.005,y+0.005,z,1));
			color_snow.push(vec4(1.0,1.0,1.0,1.0));
			color_snow.push(vec4(1.0,1.0,1.0,1.0));
			color_snow.push(vec4(1.0,1.0,1.0,1.0));
		}
		var vBuffer_snow = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer_snow );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points_snow), gl.STATIC_DRAW );
		createvPosition();
	
    	var cBuffer_snow = gl.createBuffer();
    	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer_snow );
    	gl.bufferData( gl.ARRAY_BUFFER, flatten(color_snow), gl.STATIC_DRAW );
    	createvColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(s) );
    	gl.drawArrays( gl.TRIANGLES, 0, 120 );//绘制图像函数
	}

}
var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    if(up_sign == 1)
    {
        actions = actions + 1;
        up_height=up_height+0.2;//每次上升0.01
        leg_angle=leg_angle-10;
        if(actions == 5)
        {
            up_sign = 0;
            down_sign = 1;
        }
        

    }
    if(down_sign == 1)
    {
        
        if(actions == 0)
        {
            down_sign = 0;
        }
        else
        {
            actions = actions - 1;
            up_height=up_height-0.1;
            leg_angle=leg_angle+10;

        }
        
    }
	if(right_sign == 1){
		count=count+1;
		if(count>=10){
			right_sign=0;
			count=0;
		}
		right_length=right_length+2/10;
	}
	if(left_sign == 1){
		count=count+1;
		if(count>=10){
			left_sign=0;
			count=0;
		}
		right_length=right_length-2/10;
	}
	if(forward_sign == 1){
		count=count+1;
		if(count>=10){
			forward_sign=0;
			count=0;
		}
		forward_length=forward_length-2/10;
	}
	if(back_sign == 1){
		count=count+1;
		if(count>=10){
			back_sign=0;
			count=0;
		}
		forward_length=forward_length-2/10;
	}
	if(turnleft_sign == 1){
		count=count+1;
		if(count>=5){
			turnleft_sign=0;
			count=0;
		}
		right_angle=right_angle-4;
	}
	if(turnright_sign == 1){
		count=count+1;
		if(count>=5){
			turnright_sign=0;
			count=0;
		}
		right_angle=right_angle+4;
	}
    modelViewMatrix = rotate(theta[0], 0, 1, 0 );
    modelViewMatrix = mult(modelViewMatrix,translate(theta[2]+right_length,theta[3]+up_height,theta[1]+forward_length));
	modelViewMatrix = mult(modelViewMatrix,rotate(right_angle, 0, 1, 0 ));
    //base();
    //base2();
    Background();
	hat();
    head();
    body();
    right_up_leg();
    left_up_leg();
    right_down_leg();
    left_down_leg();
    requestAnimFrame(render);
}
function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}//画正方形
function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}//画正方体
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}






















































function initOfFile(){
	canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
}
function createvPosition(){
	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}
function createvColor(){
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}
function getData(){
	document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("slider2").onchange = function(event) {
         theta[1] = event.target.value*10/180;
    };
    document.getElementById("slider3").onchange = function(event) {
         theta[2] =  event.target.value*10/180;
    };
    document.getElementById("slider4").onchange = function(event) {
        theta[3] =  event.target.value*10/180;
    };
    document.getElementById("legaction").onclick = function() {
        up_sign = 1;
    };
	document.getElementById("MoveRight").onclick = function() {
        right_sign = 1;
    };
	document.getElementById("MoveLeft").onclick = function() {
        left_sign = 1;
    };
	document.getElementById("MoveForward").onclick = function() {
        forward_sign = 1;
    };
	document.getElementById("MoveBack").onclick = function() {
        back_sign = 1;
    };turnleft_sign
	document.getElementById("TurnLeft").onclick = function() {
        turnleft_sign = 1;
    };
	document.getElementById("TurnRight").onclick = function() {
        turnright_sign = 1;
    };
	document.getElementById("Shine").onclick = function() {
        if(shine_sign == 1){
			shine_sign=0;
		}
		else{
			shine_sign=1;
		}
    };
	
}
function endOfFile(){
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
}
