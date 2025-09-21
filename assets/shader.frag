#version 300 es

#define S(a,b,t) smoothstep(a,b,t)

precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_textSize;

out vec4 fragColor;

float character(int n, vec2 p) {
    p = floor(p*vec2(-4.0, 4.0) + vec2(2.5));
    if (clamp(p.x, 0.0, 4.0) == p.x) {
        if (clamp(p.y, 0.0, 4.0) == p.y) {
            int a = int(p.x) + 5 * int(p.y);
            float shift = float(n) * pow(2.0, float(a));
            if (((n >> a) & 1) == 1) return 1.0;
        }
    }
    return 0.0;
}



mat2 Rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

//vec3 noise(vec2 uv) {
//
//    // Time-based variables for smooth animation
//    float t = u_time * 1.5;
//    float t1 = sin(t) * 0.5 + 0.5;
//    float t2 = cos(t) * 0.5 + 0.5;
//
//    // Color components
//    float r = sin(2.0 * uv.x + t1) * 0.5 + 0.5;
//    float g = cos(3.0 * uv.y + t2) * 0.5 + 0.5;
//    float b = sin(4.0 * (uv.x + uv.y) + t1 + t2) * 0.5 + 0.5;
//
//    vec3 color = vec3(r, g, b);
//    vec3 background = vec3(0.18431372549);
//
//    float alpha = pow(uv.y, 1.5);
//
//    return (color * alpha) + (background * (1.0 - alpha));
//}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
}

float noise(vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );

    vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    return 0.5 + 0.5*n;
}

vec3 heading(vec2 uv) {
    float d = -u_time * 0.5;
    float a = 0.0;
    for (float i = 0.0; i < 4.0; ++i) {
        a += cos(i - d - a * uv.x);
        d += sin(uv.y * i + a);
    }
    d += u_time * 0.5;
    vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    return cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
}

void main() {
    vec2 uv = floor(gl_FragCoord.xy/u_textSize)*u_textSize/u_resolution.xy;
    vec3 col = heading(uv);

    col *= col;

    float alpha = pow(uv.y, 1.5);
    col = (col * alpha) + (vec3(0.18431372549) * (1.0 - alpha));

    float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;

    int n =  4096;
    // limited character set
    if (gray > 0.2) n = 65600;    // :
    if (gray > 0.3) n = 163153;   // *
    if (gray > 0.4) n = 15255086; // o
    if (gray > 0.5) n = 13121101; // &
    if (gray > 0.6) n = 15252014; // 8
    if (gray > 0.7) n = 13195790; // @
    if (gray > 0.8) n = 11512810; // #

    if (gray > 0.0233) n = 4096;
    if (gray > 0.0465) n = 131200;
    if (gray > 0.0698) n = 4329476;
    if (gray > 0.0930) n = 459200;
    if (gray > 0.1163) n = 4591748;
    if (gray > 0.1395) n = 12652620;
    if (gray > 0.1628) n = 14749828;
    if (gray > 0.1860) n = 18393220;
    if (gray > 0.2093) n = 15239300;
    if (gray > 0.2326) n = 17318431;
    if (gray > 0.2558) n = 32641156;
    if (gray > 0.2791) n = 18393412;
    if (gray > 0.3023) n = 18157905;
    if (gray > 0.3256) n = 17463428;
    if (gray > 0.3488) n = 14954572;
    if (gray > 0.3721) n = 13177118;
    if (gray > 0.3953) n = 6566222;
    if (gray > 0.4186) n = 16269839;
    if (gray > 0.4419) n = 18444881;
    if (gray > 0.4651) n = 18400814;
    if (gray > 0.4884) n = 33061392;
    if (gray > 0.5116) n = 15255086;
    if (gray > 0.5349) n = 32045584;
    if (gray > 0.5581) n = 18405034;
    if (gray > 0.5814) n = 15022158;
    if (gray > 0.6047) n = 15018318;
    if (gray > 0.6279) n = 16272942;
    if (gray > 0.6512) n = 18415153;
    if (gray > 0.6744) n = 32641183;
    if (gray > 0.6977) n = 32540207;
    if (gray > 0.7209) n = 18732593;
    if (gray > 0.7442) n = 18667121;
    if (gray > 0.7674) n = 16267326;
    if (gray > 0.7907) n = 32575775;
    if (gray > 0.8140) n = 15022414;
    if (gray > 0.8372) n = 15255537;
    if (gray > 0.8605) n = 32032318;
    if (gray > 0.8837) n = 32045617;
    if (gray > 0.9070) n = 33081316;
    if (gray > 0.9302) n = 32045630;
    if (gray > 0.9535) n = 33061407;
    if (gray > 0.9767) n = 11512810;

    vec2 p = mod(gl_FragCoord.xy/u_textSize, 2.0) - vec2(1.0);

    float b = character(n, p);

    if(b == 1.0) {
        fragColor = vec4(col, 1.0);
    } else {
        fragColor = vec4(vec3(0.18431372549), 1.0);
    }
//
//    fragColor = vec4(col, 1.0);
}