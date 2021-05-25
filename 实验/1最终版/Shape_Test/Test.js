var gl;
var points;
window.onload = function init(){
var canvas = document.getElementById( "gl-canvas" );
gl = WebGLUtils.setupWebGL( canvas );
if ( !gl ) { alert( "WebGL isn't available" );
}
var vertices_circle_head=Circle(50,0.60,0.0,0.0);
var vertexColors_1=[];//头部

gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 0.0, 0.0, 0.0, 1.0 );


var program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program );


//头的绘制
for( var i = 0;i<53;i++)
{
 vertexColors_1.push(vec4(30/255,144/255,1.0,1.0));
}

var cBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors_1), gl.STATIC_DRAW);

var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

var bufferId_2 = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId_2 );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices_circle_head), gl.STATIC_DRAW );

var vPosition = gl.getAttribLocation( program, "vPosition" );
gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vPosition ); 

gl.drawArrays( gl.TRIANGLE_FAN, 0, 53 );






};


function Circle(n,l,x,y)
{
    var Vertices_circle=[
        vec2(x*1.0,y*1.0),
        vec2(x*1.0,y*1.0+l*1.0)
    ];

    var Degree=2*Math.PI/n;
    for(var i=0;i<=n;i++)
    {
        Degree_n=Degree*i;
        x_cla=x*1.0+Math.sin(Degree_n)*l*1.0;
        y_cla=y*1.0+Math.cos(Degree_n)*l*1.0;
        Vertices_circle.push(vec2(x_cla,y_cla));
    }

    return Vertices_circle;
}
