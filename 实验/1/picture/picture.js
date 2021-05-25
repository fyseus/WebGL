
var gl;
var points=[];
var vPosition, vPosition2;
var bufferId, bufferId2;
var program;

var vertexColors = [
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0)   // blue
    ];
//var vertices2 = new Float32Array([-1, 1, 0, -1, 1, 1]);
window.onload = function init()
{
	R=1.0,G=1.0,B=1.0;//背景颜色
    initOfDetails();//背景初始化（不需改）
    
    c1=vec4(1.0, 0.0, 0.0, 1.0);//红
	c2=vec4(0.0, 1.0, 0.0, 1.0);//绿
	c3=vec4(0.0, 0.0, 1.0, 1.0);//蓝
    
	
    

    //画圆形
	circle(0.0,0.0,1.5,c1);
    
    

	//画帽子（三角形组成）
	render1(-0.2, 0.6, 0, 1, 0.2, 0.6,c2,c3,c2);//分别对应于(x1,y1,x2,y2,x3,y3);c1,c2,c3,代表顶点颜色
	render2(-0.15, 0.7, 0, 1, 0.15, 0.7,c3,c3,c3);
	render3(-0.1, 0.8, 0, 1, 0.1, 0.8,c1,vec4(1.0, 0.8, 0.0, 1.0),c1);
	//render2();
};

function initOfDetails(){
	var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( R, G, B, 1.0 );
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
}
function circle(x,y,r,c){
	//顶点颜色处理
	var cBufferR = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferR);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([c,c,c]), gl.STATIC_DRAW);
	var vColorR = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColorR, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorR);
	//绘制圆形
	points.push(x);
	points.push(y);
	var vertexCount = 1;
	for(i = 0; i <= 100; i ++){
		points.push(x + r * Math.cos(2 * Math.PI / 200));
		points.push(y + r * Math.sin(2 * Math.PI / 200));
		vertexCount++;
	}
	bufferIdR = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdR );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );
	
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdR );
    vPositionR = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionR, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionR );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, vertexCount );
}
function render1(x1,y1,x2,y2,x3,y3,c1,c2,c3) {
	//顶点颜色处理
	var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([c1,c2,c3]), gl.STATIC_DRAW);
	var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
	//坐标处理
	var vertices = new Float32Array([x1, y1, x2, y2, x3, y3]);
	bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );
	
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
function render2(x1,y1,x2,y2,x3,y3,c1,c2,c3) {
	//顶点颜色处理
	var cBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([c1,c2,c3]), gl.STATIC_DRAW);
	var vColor2 = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor2, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor2);
	//坐标处理
	vertices2 = new Float32Array([x1, y1, x2, y2, x3, y3]);
	bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ARRAY_BUFFER,vertices2, gl.STATIC_DRAW );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    vPosition2 = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition2 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 ); 
}
function render3(x1,y1,x2,y2,x3,y3,c1,c2,c3) {
	//顶点颜色处理
	var cBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([c1,c2,c3]), gl.STATIC_DRAW);
	var vColor3 = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor3, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor3);
	//坐标处理
	vertices3 = new Float32Array([x1, y1, x2, y2, x3, y3]);
	bufferId3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId3 );
    gl.bufferData( gl.ARRAY_BUFFER,vertices3, gl.STATIC_DRAW );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId3 );
    vPosition3 = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition3, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition3 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 ); 
}