async function createShader(gl, type, source) {

    let fragmentShader = gl.createShader(type);

    gl.shaderSource(fragmentShader, source);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return null;
    }

    return fragmentShader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    let displayWidth  = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    let needResize = canvas.width  !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

async function main() {
    let canvas = document.getElementById("c");
    let gl = canvas.getContext('webgl2');

    let slider = document.getElementById("textSize");
    let out = document.getElementById("read");

    let fragmentSource = await fetch('assets/shader.frag')
        .then(res => res.text());
    let vertexSource = await fetch('assets/shader.vert')
        .then(res => res.text());

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    let fragment = await createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    let vertex = await createShader(gl, gl.VERTEX_SHADER, vertexSource);
    let program = createProgram(gl, vertex, fragment);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points
    let positions = [
        -1.0, -1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let timeUniformLocation = gl.getUniformLocation(program, "u_time");
    let textSizeUniformLocation = gl.getUniformLocation(program, "u_textSize");

    let t = 0.0;

    function draw() {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeUniformLocation, t);
        gl.uniform1f(textSizeUniformLocation, slider.value);

        out.innerText = slider.value;

        gl.vertexAttribPointer(
            positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    setInterval(function() {
        t += 0.05;
        draw();
    }, 50);
}

window.onload = main;

