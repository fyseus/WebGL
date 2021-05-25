"use strict";
var canvas,gl,program;
//***********layout of 函数****//
	//mat4()单位矩阵,mat4(0,1,2,3...,15);
	//add(b,c)矩阵相加
	//transpose(e)矩阵转置
	//inverse(a)矩阵的逆
	//determinant(a)矩阵行列式
	//mult(e,d)矩阵乘积
	//flatten(a)转为一维数组
	//a[1][2]=0修改某个值
	//rotate(angle,direction)旋转对于原点,第二个为旋转轴
	//rotateX(angle),rotateY(angle),rotateZ(angle)
	//scale(x,y,z)缩放不动点原点
	//translate(x,y,z)平移(ctm=translate(ctm,d))
	//negate(d)对d取负
	//gl.uniformMatrix4fv(modelViewMatrixLoc,flase,flattrn(ctm))设置uniform变量
	//gl.uniform3fv(Loc,flattrn(theta))
	//旋转第三种方法课本152radians()角度转弧度
	//lookAt(eye,at,up)得到观察矩阵
	//normalize(a)归一化
//**********main**************//
window.onload = function init() {
    initOfFile();
	//getData();//按钮相关
	render();//循环绘制
}
//**********常量数据***************//
var pointsArray = [];//background顶点的数组
var normalsArray = [];//background法向量数组
var index=0;//background顶点数

var points_head = [];//head顶点的数组
var normals_head = [];//head法向量数组
var index_head=0;//head顶点数

var points_body = [];//body顶点的数组
var normals_body = [];//body法向量数组
var points_body_h = [];//body顶点的数组
var normals_body_h = [];//body法向量数组
var index_body=0;//body顶点数
var index_body_h=0;//body顶点数

var points_leg=[];//leg顶点的数组
var normals_leg = [];//leg法向量数组
var index_leg=0;//leg顶点数

var points_light=[];//light顶点的数组
var normals_light = [];//light法向量数组
var index_light=0;//light顶点数

var points_tree=[];//tree顶点的数组
var normals_tree = [];//tree法向量数组
var index_tree=0;

var points_leaf=[];//leaf顶点的数组
var normals_leaf = [];//leaf法向量数组
var index_leaf=0;
var points_leaf_h = [];//leaf顶点的数组
var normals_leaf_h = [];//leaf法向量数组
var index_leaf_h=0;//leaf顶点数

var points_boll=[];//boll顶点的数组
var normals_boll = [];//boll法向量数组
var index_boll=0;

var near = -0,far = 10,left = -5.0,right = 5.0,ytop =5.0,bottom = -5.0;//平行投影数据
//**********变量数据***************//
var viewTotal=1;
var handOut=0;
var dt=0;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var background_matrix=mat4();
var change_matrix=mat4();
var head_matrix=mat4();
var body_matrix=mat4();
var light_matrix=mat4();
var turn_matrix=mat4();
var tree_matrix=mat4();
var leaf_matrix=mat4();
var boll_matrix=mat4();
//**********light_data*********//
var lightPosition = vec4(2.0, 1.0, 2.0, 1.0 );//光源位置
var lightPositionLoc;
var lightAmbient = vec4(0.7, 0.7, 0.7, 1.0 );//环境光
var lightDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );//漫反射光
var lightSpecular = vec4( 1.0, 1.0,1.0, 1.0 );//镜面反射光

var materialAmbient = vec4( 0.3, 0.3, 0.3, 1.0 );//环境光材质
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );//漫反射材质
var materialSpecular = vec4( 0.8867, 0.8085,0.88, 1.0 );//镜面反射材质
var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);

var materialAmbient1 = vec4( 0.5, 0.3, 0.0, 1.0 );//light材质
var materialDiffuse1 = vec4( 0.5, 0.3, 0.0, 1.0 );//light材质
var materialSpecular1 = vec4( 0.0, 0.0, 1.0, 1.0 );//light反射材质
var ambientProduct1 = mult(lightAmbient, materialAmbient1);
var diffuseProduct1 = mult(lightDiffuse, materialDiffuse1);
var specularProduct1 = mult(lightSpecular, materialSpecular1);
var materialShininess_light = 10.0;//表面高光系数

var materialAmbient2 = vec4( 0.7, 0.7, 0.7, 1.0 );//环境光材质2
var materialDiffuse2 = vec4(0.3, 0.3, 0.7, 1.0 );//漫反射材质2
var materialSpecular2= vec4( 1.0, 1.0, 0, 1.0 );//镜面反射材质2
var ambientProduct2 = mult(lightAmbient, materialAmbient2);
var diffuseProduct2 = mult(lightDiffuse, materialDiffuse2);
var specularProduct2 = mult(lightSpecular, materialSpecular2);

var materialAmbient3 = vec4( 0.3, 0.3, 0.3, 1.0 );//环境光材质3
var materialDiffuse3 = vec4(0.2, 0.2, 0.2, 1.0 );//漫反射材质3
var materialSpecular3= vec4( 0.262, 0.99, 0.266, 1.0 );//镜面反射材质3
var ambientProduct3 = mult(lightAmbient, materialAmbient3);
var diffuseProduct3 = mult(lightDiffuse, materialDiffuse3);
var specularProduct3 = mult(lightSpecular, materialSpecular3);

var materialAmbient4 = vec4( 1.0, 0.3, 0.3, 1.0 );//环境光材质3
var materialDiffuse4 = vec4(0.9, 0.2, 0.2, 1.0 );//漫反射材质3
var materialSpecular4= vec4( 1.0, 0.5, 0.5, 1.0 );//镜面反射材质3
var ambientProduct4 = mult(lightAmbient, materialAmbient4);
var diffuseProduct4 = mult(lightDiffuse, materialDiffuse4);
var specularProduct4 = mult(lightSpecular, materialSpecular4);


var materialShininess = 20.0;//表面高光系数
//***********Texture********//
var texCoordsArray = [];
var texSize = 64;
var image1 = new Array();
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
        image1[i][j] = [c, c, c, 1];
    }
var image2 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ )
        for ( var j = 0; j < texSize; j++ )
           for(var k =0; k<4; k++)
                image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
function configureTexture_draw(image) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);//Y轴旋转
    gl.activeTexture( gl.TEXTURE0 );//激活
    gl.bindTexture( gl.TEXTURE_2D, texture );//绑定
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}
function configureTexture_picture( image ) {
    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );//激活
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
function configureTexture0( image ) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
}
function configureTexture1(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 1);
}
function configureTexture2(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 2);
}
function configureTexture3(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture3"), 3);
}
function configureTexture4(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture4"), 4);
}
function configureTexture5(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE5);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture5"), 5);
}
function configureTexture6(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE6);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture6"), 6);
}
function configureTexture7(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE7);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture7"), 7);
}
function configureTexture8(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE8);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture8"), 8);
}
function configureTexture9(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE9);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture9"), 9);
}
function configureTexture10( image ) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE10);

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture10"), 10);
}
//***********Camera******//
var eye= vec3(0.0, -1.0, 0);
var at = vec3(0.0, -1.0, -1);
var up = vec3(0.0, 1.0,0.0);
var direction=subtract(at, eye);
var eye_Object=vec3(0.0,-1, 0);
var up_Object = vec3(0.0, 1.0,0.0);
var direction_Object=vec3(0.0, 0, 1);
var at_Object=add(eye_Object,direction_Object);
//*************out points and color**********//
function createvPosition(){
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}
function createvNormal(){
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
}
//*************eventListener*********/
function listenAll(){
	canvas.addEventListener("mousemove", function(event) {
		if(!viewTotal){
			direction=subtract(at, eye);
		
			var angle_X = getAngle([0, -1], [direction[0], direction[2]]);
			var angle_Y = Math.asin(direction[1]);
			//alert("1");
			if(true) {
				//alert("1");
				angle_X += (event.movementX / 200);
				angle_Y += (-event.movementY / 200);
			}
			if(angle_Y >= 4*Math.PI/9) {
				angle_Y = 4*Math.PI/9;
			} else if(angle_Y <= -Math.PI/6) {
				angle_Y = -Math.PI/6;
			}
			direction=([Math.sin(angle_X)*Math.cos(angle_Y), Math.sin(angle_Y), -Math.cos(angle_X) * Math.cos(angle_Y)]);
			at=add(direction,eye);
		}
		else{
			direction_Object=subtract(at_Object, eye_Object);
		
			var angle_X = getAngle([0, -1], [direction_Object[0], direction_Object[2]]);
			var angle_Y = Math.asin(direction_Object[1]);
			//alert("1");
			if(true) {
				//alert("1");
				angle_X += (event.movementX / 200);
				angle_Y += (-event.movementY / 200);
			}
			if(angle_Y >= Math.PI/4) {
				angle_Y = Math.PI/4;
			} else if(angle_Y <= -Math.PI/6) {
				angle_Y = -Math.PI/6;
			}
			direction_Object=([Math.sin(angle_X)*Math.cos(angle_Y), Math.sin(angle_Y), -Math.cos(angle_X) * Math.cos(angle_Y)]);
			change_matrix=mult(change_matrix,rotate((-event.movementX*180 / (200*Math.PI)),[0,1,0]));
			at_Object=add(direction_Object,eye_Object);
		}
		
    }, false);
	canvas.addEventListener("mousedown", function(event) {
		if(!viewTotal){
			
		}
		else{
			if(!handOut){
				turn_matrix=rotate(60,[1,0,0]);
				handOut=!handOut;
			}
			else{
				turn_matrix=mat4();
				handOut=!handOut;
			}
		}
		
    }, false);
	document.onkeydown = function(e) {
        var code = e.keyCode;
		var step;
		var length_step=0.04;
		if(!viewTotal){
			switch(code) {
				case 87:
					//前
					//alert("1");
					step=[length_step*direction[0],length_step*direction[1],length_step*direction[2]];
					eye=add(eye,step);
					at=add(at,step);
					break;
				case 83:
					//后
					step=[length_step*direction[0],length_step*direction[1],length_step*direction[2]];
					eye=subtract(eye,step);
					at=subtract(at,step);
					break;
				case 65:
					//左
					step=[length_step*direction[2],0,-length_step*direction[0]];
					eye=add(eye,step);
					at=add(at,step);
					break;
				case 68:
					//右
					step=[-length_step*direction[2],0,length_step*direction[0]];
					eye=add(eye,step);
					at=add(at,step);
					break;
				case 32:
					//空格
					step=[0,0.01,0];
					eye=add(eye,step);
					at=add(at,step);
					break;
				case 88:
					eye=[-1.5,-1.5,-1.5];
					direction=normalize([1,0.5,1.5]);
					at=add(eye,direction);
					break;
				case 67:
					viewTotal=!viewTotal;
					break;
			}
		}
		else{
			switch(code) {
				case 87:
					//前
					//alert("1");
					step=[length_step*direction_Object[0],0,length_step*direction_Object[2]];
					eye_Object=add(eye_Object,step);
					at_Object=add(at_Object,step);
					if(isout(7.5)){
						eye_Object=subtract(eye_Object,step);
						at_Object=subtract(at_Object,step);
					}
					else{
						change_matrix=mult(translate(step[0],step[1],step[2]),change_matrix);
					}
					break;
				case 83:
					//后
					step=[-length_step*direction_Object[0],0,-length_step*direction_Object[2]];
					eye_Object=add(eye_Object,step);
					at_Object=add(at_Object,step);
					if(isout(7.5)){
						eye_Object=subtract(eye_Object,step);
						at_Object=subtract(at_Object,step);
					}
					else{
						change_matrix=mult(translate(step[0],step[1],step[2]),change_matrix);
					}
					break;
				case 65:
					//左
					step=[length_step*direction_Object[2],0,-length_step*direction_Object[0]];
					eye_Object=add(eye_Object,step);
					at_Object=add(at_Object,step);
					if(isout(7.5)){
						eye_Object=subtract(eye_Object,step);
						at_Object=subtract(at_Object,step);
					}
					else{
						change_matrix=mult(translate(step[0],step[1],step[2]),change_matrix);
					}
					break;
				case 68:
					//右
					step=[-length_step*direction_Object[2],0,length_step*direction_Object[0]];
					eye_Object=add(eye_Object,step);
					at_Object=add(at_Object,step);
					if(isout(7.5)){
						eye_Object=subtract(eye_Object,step);
						at_Object=subtract(at_Object,step);
					}
					else{
						change_matrix=mult(translate(step[0],step[1],step[2]),change_matrix);
					}
					break;
				case 32:
					//空格
					step=[0,0.01,0];
					eye_Object=add(eye_Object,step);
					at_Object=add(at_Object,step);
					change_matrix=mult(translate(step[0],step[1],step[2]),change_matrix);
					break;
				case 67:
					viewTotal=!viewTotal;
					break;
        	}
		}
        
    };
	document.onkeyup = function(e) {
        var code = e.keyCode;
		var step;
        switch(code) {
			case 90:
				step=[0,eye[1],0];
				eye=subtract(eye,step);
				at=subtract(at,step);
                break;
        }
	};
	
}
//************draw of background********/
function Background(i){
	draw_quar(vec4(-i,-i,-i,1.0),vec4(-i,i,-i,1.0),vec4(i,i,-i,1.0),vec4(i,-i,-i,1.0));//S
	draw_quar(vec4(-i,-i,i,1.0),vec4(-i,i,i,1.0),vec4(i,i,i,1.0),vec4(i,-i,i,1.0));//N
	draw_quar(vec4(-i,-i,i,1.0),vec4(-i,i,i,1.0),vec4(-i,i,-i,1.0),vec4(-i,-i,-i,1.0));//L
	draw_quar(vec4(i,-i,i,1.0),vec4(i,i,i,1.0),vec4(i,i,-i,1.0),vec4(i,-i,-i,1.0));//R
	draw_quar(vec4(-i,i,i,1.0),vec4(i,i,i,1.0),vec4(i,i,-i,1.0),vec4(-i,i,-i,1.0));//U
	draw_quar(vec4(-i,-i,i,1.0),vec4(i,-i,i,1.0),vec4(i,-i,-i,1.0),vec4(-i,-i,-i,1.0));//B
}//背景的长方体的坐标点和颜色
function draw_quar(  a,  b,  c,  d ) {
    triangle(a, b, c,1);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
	triangle(a, c, d,1);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);
}//画正方形
var j=0;
function drawBackground(){
	
	background_matrix=mult(modelViewMatrix,translate_mat4(0,6,0));
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    createvPosition();
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(background_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
	configureTexture_draw(image2);
	defineOfSurface_background3();
    for( var i=0; i<index; i+=3){
		if(i==0)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
		if(i==6)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
		if(i==12)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
		if(i==18)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
		if(i==24)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
		if(i==30)gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
        gl.drawArrays( gl.TRIANGLES, i, 3 );
		//if(i==12)defineOfSurface_background1();
	}
}
//***********定义使用的函数************/
function scale_mat4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
	result[2][2] = c;
   	return result;
}
function translate_mat4(a,b,c){
	var result = mat4();
   	result[0][0] = 1;
   	result[1][1] = 1;
   	result[2][2] = 1;
	result[0][3] = a;
	result[1][3] = b;
	result[2][3] = c;
   	return result;
}
function triangle(a, b, c,m) {
     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t2, t1));
     normal = vec4(normal);
	 if(m==1)normal=[-normal[0],-normal[1],-normal[2],-normal[3]];
     normal[3]  = 0.0;
     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);
     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);
     index += 3;
}
function defineOfSurface_background0(){
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct1) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct1) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct1) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess_light );
}
function defineOfSurface_background1(){
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
}
function defineOfSurface_background2(){
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct2) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct2) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct2) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
}
function defineOfSurface_background3(){
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct3) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct3) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct3) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
}
function defineOfSurface_background4(){
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct4) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct4) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct4) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
}
function getAngle(A, B) {
            if(B[0] === 0 && A[0] === 0) {
                return 0;
            }

            var diffX = B[0] - A[0];
            var diffY = B[1] - A[1];

            var a = A[0] * B[0] + A[1] * B[1];
            var b = Math.sqrt(A[0] * A[0] + A[1] * A[1]);
            var c = Math.sqrt(B[0] * B[0] + B[1] * B[1]);

            return (B[0] / Math.abs(B[0])) *  Math.acos(a / b / c);
        }
function calnormalMatrix(modelViewMatrix){
	normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
}
function callightposition(){
	dt=dt+0.02;
	if(dt>=2*Math.PI)dt=0;
	lightPosition[2]=3*Math.cos(dt);
	lightPosition[0]=3*Math.sin(dt);
	lightPosition[1]=Math.sin(dt)*Math.cos(dt)+2.5+Math.cos(dt)+1.5*Math.sin(dt)+0.3*dt/Math.PI;
}
function isout(size){
	if(Math.abs(eye_Object[0])>size||Math.abs(eye_Object[1])>size||Math.abs(eye_Object[2])>size){
		return true;
	}
	return false;
}
//********init***********//
var modelViewMatrix, projectionMatrix,normalMatrix;
var modelViewMatrixLoc,projectionMatrixLoc, normalMatrixLoc;//Location
var vPosition,vNormal;
function initOfFile() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
	lightPositionLoc=gl.getUniformLocation(program,"lightPosition")
	vNormal = gl.getAttribLocation( program, "vNormal" );
	vPosition = gl.getAttribLocation( program, "vPosition");
	
	var image_background_B = document.getElementById("background_B");
	var image_background_N = document.getElementById("background_N");
	var image_background_S = document.getElementById("background_S");
	var image_background_L = document.getElementById("background_L");
	var image_background_R = document.getElementById("background_R");
	var image_background_U = document.getElementById("background_U");
	var tree1 = document.getElementById("tree1");
	var tree2 = document.getElementById("tree2");
	var image_cloths = document.getElementById("cloths");
	var image_sun = document.getElementById("sun");
	configureTexture10(image_sun);
    configureTexture1(image_background_B);
	configureTexture2(image_background_N);
	configureTexture3(image_background_S);
	configureTexture4(image_background_L);
	configureTexture5(image_background_R);
	configureTexture6(image_background_U);
	configureTexture7(image_cloths);
	configureTexture8(tree1);
	configureTexture9(tree2);
	Background(8.0);
	Head();
	Body();
	boll();
	leaf();
	leaf();
	tree(0.2,4,0.2);
	tree(0.3,2,0.3);
	Leg(0.15,0.25,0.15);
	Leg(0.05,0.10,0.05);
	Leg(0.05,0.15,0.05);
	Leg(0.05,0.15,0.05);
	Leg(0.04,0.2,0.04);
	Leg(0.04,0.2,0.04);
    //projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	projectionMatrix =perspective( 130, canvas.width / canvas.height, 0.1, 500);
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	
	listenAll();
}
//*******************render********//
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	callightposition();
    gl.uniform4fv( lightPositionLoc,flatten(lightPosition) );
	light_circle();
    if(!viewTotal) modelViewMatrix = lookAt(eye, at , up);
	else modelViewMatrix = lookAt(subtract(eye_Object,vec3(direction_Object[0]*0.8,direction_Object[1]*0.8,direction_Object[2]*0.8)), subtract(at_Object,vec3(direction_Object[0]*0.8,direction_Object[1]*0.8,direction_Object[2]*0.8)) , up_Object);
    calnormalMatrix(modelViewMatrix);
	drawBackground();
	drawlight();
	drawleaf(3,translate_mat4(2,2,2));
	drawleaf(2,mult(translate_mat4(2,2,2),translate(-1,0,3)));
	drawtree();
	drawboll();
	modelViewMatrix=mult(modelViewMatrix,translate(0,-1,0));
	modelViewMatrix=mult(modelViewMatrix,change_matrix);
	drawHead();
	drawBody();
	drawLeg();
	
    window.requestAnimFrame(render);
}
//*************drow Objects*********//
//***********light_circle************//
function light_circle(){
	index_light=0;
	points_light=[];
	normals_light=[];
	var x=0,y=0,z=0,l=0.1;
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
			points_light.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			normals_light.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			x_cla2=x+Math.sin(Degree_n3)*Math.cos(Degree_n2)*l;
			y_cla2=y+Math.cos(Degree_n3)*Math.cos(Degree_n2)*l;
			points_light.push(vec4( x_cla2, y_cla2,  z2, 1.0 ));
			normals_light.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			index_light=index_light+2;
		}
    }
}
function drawlight(){
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_light), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_light), gl.STATIC_DRAW);
    createvPosition();
	changeOflight(1);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(light_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	defineOfSurface_background0();
	
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 10);
	
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, index_light );
}
function changeOflight(size){
	light_matrix=mult(modelViewMatrix,translate_mat4(lightPosition[0],lightPosition[1],lightPosition[2],0));
	//light_matrix=mult(light_matrix,translate_mat4(lightPosition[0],lightPosition[1],lightPosition[2]));
	light_matrix=mult(light_matrix,scale_mat4(size,size,size));
	
	
}
//***********head************//
function Head(){
	var x=0,y=0,z=0,l=1;
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
			points_head.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			normals_head.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			x_cla2=x+Math.sin(Degree_n3)*Math.cos(Degree_n2)*l;
			y_cla2=y+Math.cos(Degree_n3)*Math.cos(Degree_n2)*l;
			points_head.push(vec4( x_cla2, y_cla2,  z2, 1.0 ));
			normals_head.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			index_head=index_head+2;
		}
    }
}
function drawHead(){
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_head), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_head), gl.STATIC_DRAW);
    createvPosition();
	changeOfHead(0.1);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(head_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	defineOfSurface_background2();
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, index_head );
}
function changeOfHead(size){
	head_matrix=modelViewMatrix;
	head_matrix=mult(head_matrix,scale_mat4(size,size,size));
	calnormalMatrix(head_matrix);
}
//**********body*******************//
function Body(){
	var x=0,z=0,y=1,l=1;
	points_body.push(vec4( x, 0,  z, 1.0 ));
	normals_body.push(vec4( 0, -1,  0, 1.0 ));
	index_body++;
	points_body_h.push(vec4( x, y,  z, 1.0 ));
	normals_body_h.push(vec4( 0, 1,  0, 1.0 ));
	index_body_h++;
    var Degree=2*Math.PI/50;
	var x_cla,z_cla,Degree_n;
    for(var i=0;i<=50;i++)
    {
        Degree_n=Degree*i;
        x_cla=x+Math.sin(Degree_n)*l;
        z_cla=z+Math.cos(Degree_n)*l;
        points_body.push(vec4( x_cla, 0,  z_cla, 1.0 ));
		normals_body.push(vec4( 0, -1,  0, 1.0 ));
		points_body_h.push(vec4( x_cla, 0,  z_cla, 1.0 ));
		normals_body_h.push(normalize(vec4( x_cla, 1,  z_cla, 1.0 )));
		index_body++;
		index_body_h++;
    }
}
function drawBody(){
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 4);
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_body), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_body), gl.STATIC_DRAW);
    createvPosition();
	changeOfBody(0.2);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(body_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	defineOfSurface_background4();
    gl.drawArrays( gl.TRIANGLE_FAN, 0, index_body );
	var nBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_body_h), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_body_h), gl.STATIC_DRAW);
    createvPosition();
	gl.drawArrays( gl.TRIANGLE_FAN, 0, index_body_h );
}
function changeOfBody(size){
	body_matrix=modelViewMatrix;
	body_matrix=mult(body_matrix,scale_mat4(size,size,size));
	calnormalMatrix(body_matrix);
}
//***********leg*************//
function Leg(i,j,k){
	Leg_square(vec4(-i,-j,-k,1.0),vec4(i,-j,-k,1.0),vec4(i,j,-k,1.0),vec4(-i,j,-k,1.0));
	Leg_square(vec4(-i,-j,k,1.0),vec4(-i,j,k,1.0),vec4(i,j,k,1.0),vec4(i,-j,k,1.0));
	Leg_square(vec4(-i,-j,k,1.0),vec4(-i,j,k,1.0),vec4(-i,j,-k,1.0),vec4(-i,-j,-k,1.0));
	Leg_square(vec4(i,-j,k,1.0),vec4(i,j,k,1.0),vec4(i,j,-k,1.0),vec4(i,-j,-k,1.0));
	Leg_square(vec4(-i,j,k,1.0),vec4(i,j,k,1.0),vec4(i,j,-k,1.0),vec4(-i,j,-k,1.0));
	Leg_square(vec4(-i,-j,k,1.0),vec4(i,-j,k,1.0),vec4(i,-j,-k,1.0),vec4(-i,-j,-k,1.0));
}//长方体的坐标点和颜色
function Leg_square(  a,  b,  c,  d ) {
    triangle(a, b, c,0);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
	triangle(a, c, d,0);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);
	index_leg+=6;
	index-=6;
}//画正方形
function drawLeg(){
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    createvPosition();
	var t=modelViewMatrix;
	t=mult(t,translate(0,-0.4,0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
	configureTexture_draw(image2);
	defineOfSurface_background3();
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 7);
    for( var i=index; i<index+index_leg; i+=3){
		if(i-index==36){
			t=mult(t,translate(0,0.25,0));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t) );
		}
		if(i-index==36*2){
			t=mult(t,translate(0.2,-0.3,0));
			var newt=mult(t,turn_matrix);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(newt) );
		}
		if(i-index==36*3){
			t=mult(t,translate(-0.4,0,0));
			var newt=mult(t,turn_matrix);
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(newt) );
		}
		if(i-index==36*4){
			t=mult(t,translate(0.1,-0.2,0));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t) );
		}
		if(i-index==36*5){
			t=mult(t,translate(0.2,0,0));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t) );
		}
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
}
//**********tree**********//
function tree(i,j,k){
	tree_square(vec4(-i,-j,-k,1.0),vec4(-i,j,-k,1.0),vec4(i,j,-k,1.0),vec4(i,-j,-k,1.0));
	tree_square(vec4(-i,-j,k,1.0),vec4(-i,j,k,1.0),vec4(i,j,k,1.0),vec4(i,-j,k,1.0));
	tree_square(vec4(-i,-j,k,1.0),vec4(-i,j,k,1.0),vec4(-i,j,-k,1.0),vec4(-i,-j,-k,1.0));
	tree_square(vec4(i,-j,k,1.0),vec4(i,j,k,1.0),vec4(i,j,-k,1.0),vec4(i,-j,-k,1.0));
	tree_square(vec4(-i,j,k,1.0),vec4(i,j,k,1.0),vec4(i,j,-k,1.0),vec4(-i,j,-k,1.0));
	tree_square(vec4(-i,-j,k,1.0),vec4(i,-j,k,1.0),vec4(i,-j,-k,1.0),vec4(-i,-j,-k,1.0));
}//长方体的坐标点和颜色
function tree_square(  a,  b,  c,  d ) {
    triangletree(a, b, c,0);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
	triangletree(a, c, d,0);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);
	index_tree+=6;
}//画正方形
function drawtree(){
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_tree), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_tree), gl.STATIC_DRAW);
    createvPosition();
	tree_matrix=mult(modelViewMatrix,translate_mat4(2,0,2));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(tree_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
	configureTexture_draw(image2);
	defineOfSurface_background1();
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 8);
    for( var i=0; i<index_tree; i+=3){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(tree_matrix) );
		if(i==36){
			tree_matrix=mult(tree_matrix,translate(-1,0,3));
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(tree_matrix) );
		}
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), -1);
}
function triangletree(a, b, c,m) {
     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t2, t1));
     normal = vec4(normal);
	 if(m==1)normal=[-normal[0],-normal[1],-normal[2],-normal[3]];
     normal[3]  = 0.0;
     normals_tree.push(normal);
     normals_tree.push(normal);
     normals_tree.push(normal);
     points_tree.push(a);
     points_tree.push(b);
     points_tree.push(c);
}
//***************leaf***********//
function leaf(){
	var x=0,z=0,y=1,l=1;
	points_leaf.push(vec4( x, 0,  z, 1.0 ));
	normals_leaf.push(vec4( 0, -1,  0, 1.0 ));
	index_leaf++;
	points_leaf_h.push(vec4( x, y,  z, 1.0 ));
	normals_leaf_h.push(vec4( 0, 1,  0, 1.0 ));
	index_leaf_h++;
    var Degree=2*Math.PI/50;
	var x_cla,z_cla,Degree_n;
    for(var i=0;i<=50;i++)
    {
        Degree_n=Degree*i;
        x_cla=x+Math.sin(Degree_n)*l;
        z_cla=z+Math.cos(Degree_n)*l;
        points_leaf.push(vec4( x_cla, 0,  z_cla, 1.0 ));
		normals_leaf.push(vec4( 0, -1,  0, 1.0 ));
		points_leaf_h.push(vec4( x_cla, 0,  z_cla, 1.0 ));
		normals_leaf_h.push(normalize(vec4( x_cla, 1,  z_cla, 1.0 )));
		index_leaf++;
		index_leaf_h++;
    }
}
function drawleaf(size,mat){
	gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 9);
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_leaf), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_leaf), gl.STATIC_DRAW);
    createvPosition();
	leaf_matrix=mult(modelViewMatrix,mat);
	changeOfleaf(size);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(leaf_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	defineOfSurface_background3();
    gl.drawArrays( gl.TRIANGLE_FAN, 0, index_leaf/2 );
	var nBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_leaf_h), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_leaf_h), gl.STATIC_DRAW);
    createvPosition();
	gl.drawArrays( gl.TRIANGLE_FAN, 0, index_leaf_h/2 );
}
function changeOfleaf(size){
	leaf_matrix=mult(leaf_matrix,scale_mat4(size/2,1.5*size,size/2));
	calnormalMatrix(leaf_matrix);
}
//***********ball********//
function boll(){
	var x=0,y=0,z=0,l=1;
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
			points_boll.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			normals_boll.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			x_cla2=x+Math.sin(Degree_n3)*Math.cos(Degree_n2)*l;
			y_cla2=y+Math.cos(Degree_n3)*Math.cos(Degree_n2)*l;
			points_boll.push(vec4( x_cla2, y_cla2,  z2, 1.0 ));
			normals_boll.push(vec4( x_cla1, y_cla1,  z1, 1.0 ));
			index_boll=index_boll+2;
		}
    }
}
function drawboll(){
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals_boll), gl.STATIC_DRAW );
    createvNormal();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_boll), gl.STATIC_DRAW);
    createvPosition();
	changeOfboll(0.13);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(boll_matrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	defineOfSurface_background2();
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, index_boll );
}
function changeOfboll(size){
	boll_matrix=modelViewMatrix;
	boll_matrix=mult(boll_matrix,translate_mat4(1,-1.8,0));
	boll_matrix=mult(boll_matrix,scale_mat4(size,size,size));
	calnormalMatrix(boll_matrix);
}
