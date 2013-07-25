/*this file is the main file of emulating TC 's graphics functions*/
/*author:DemoHn
 *Date:2013-7-12
 */
/*some consts used in TC's graphic library*/

const DETECT = 0, CGA = 1, MCGA = 2, EGA = 3, EGA64 = 4, EGAMONO = 5, IBM8514 = 6,
    HERCMONO = 7, ATT400 = 8, VGA = 9, PC3270 = 10,
    CURRENT_DRIVER = -1;



const BLACK = 0, /* dark colors */
    BLUE = 1,
    GREEN = 2,
    CYAN = 3,
    RED = 4,
    MAGENTA = 5,
    BROWN = 6,
    LIGHTGRAY = 7,
    DARKGRAY = 8, /* light colors */
    LIGHTBLUE = 9,
    LIGHTGREEN = 10,
    LIGHTCYAN = 11,
    LIGHTRED = 12,
    LIGHTMAGENTA = 13,
    YELLOW = 14,
    WHITE = 15;

const CGA_LIGHTGREEN = 1, /* Palette C0 Color Names	*/
    CGA_LIGHTRED = 2,
    CGA_YELLOW = 3,

    CGA_LIGHTCYAN = 1, /* Palette C1 Color Names	*/
    CGA_LIGHTMAGENTA = 2,
    CGA_WHITE = 3,

    CGA_GREEN = 1, /* Palette C2 Color Names	*/
    CGA_RED = 2,
    CGA_BROWN = 3,

    CGA_CYAN = 1, /* Palette C3 Color Names	*/
    CGA_MAGENTA = 2,
    CGA_LIGHTGRAY = 3;

const SOLID_LINE = 0,
    DOTTED_LINE = 1,
    CENTER_LINE = 2,
    DASHED_LINE = 3,
    USERBIT_LINE = 4;

const NORM_WIDTH = 1,
    THICK_WIDTH = 3;

const DEFAULT_FONT = 0, /* 8x8 bit mapped font */
    TRIPLEX_FONT = 1, /* "Stroked" fonts */
    SMALL_FONT = 2,
    SANS_SERIF_FONT = 3,
    GOTHIC_FONT = 4;

const HORIZ_DIR = 0;
const VERT_DIR = 1;
const USER_CHAR_SIZE = 0;

const EMPTY_FILL = 0, /* fills area in background color */
    SOLID_FILL = 1, /* fills area in solid fill color */
    LINE_FILL = 2, /* --- fill */
    LTSLASH_FILL = 3, /* /// fill */
    SLASH_FILL = 4, /* /// fill with thick lines */
    BKSLASH_FILL = 5, /* \\\ fill with thick lines */
    LTBKSLASH_FILL = 6, /* \\\ fill */
    HATCH_FILL = 7, /* light hatch fill */
    XHATCH_FILL = 8, /* heavy cross hatch fill */
    INTERLEAVE_FILL = 9, /* interleaving line fill */
    WIDE_DOT_FILL = 10, /* Widely spaced dot fill */
    CLOSE_DOT_FILL = 11, /* Closely spaced dot fill */
    USER_FILL = 12;
/* user defined fill */

const COPY_PUT = 0, /* MOV */
    XOR_PUT = 1, /* XOR */
    OR_PUT = 2, /* OR  */
    AND_PUT = 3, /* AND */
    NOT_PUT = 4;
/* NOT */

const LEFT_TEXT = 0,
    CENTER_TEXT = 1,
    RIGHT_TEXT = 2,
    BOTTOM_TEXT = 0,
    TOP_TEXT = 2;

const MAXCOLORS = 15;

/*Some System Objects used in this js file*/
var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var MovetoPoint = new Point(0, 0);
/*this represents the current point that the opeartion "moveTo" results for*/
/*Here are functions that had not done or unnecessarily to use*/
function bar3d(left, top, right, bottom, depth, topflag) {
    //TODO to investigate it and finish it 7-12
}



var CanvasId = "MyCanvas";
var Height = "0";
var Width = "0";
var BackGroundColor = 0;
var ForeGroundColor = 0;
var _writemode = 0;
var _font_is_fill = 0;
var _current_text_height = 0;
var ctx = {};
/*this is the main operating Object of the canvas */

/*private functions ,only for inner usage*/
function _initbackground(obj, color_num) {
    obj.style.backgroundColor = _transcolor(color_num);
    BackGroundColor = color_num;
}

/*to set writemode temperary*/
function _setwritemode(mode) {
    if (mode == 0) {   //copy mode
        ctx.globalCompositeOperation = "source-over";
    } else if (mode == 1) {
        ctx.globalCompositeOperation = "xor";
    } else {
        ctx.globalCompositeOperation = "source-over";
    }
}

/*in order to trans TC's color into RGB*/
function _transcolor(tc_color_num) {
    var ege_color;
    switch (tc_color_num) {
        case 0:
            ege_color = "#000000";
            break; //BLACK
        case 1:
            ege_color = "#0000A8";
            break; //BLUE
        case 2:
            ege_color = "#00A800";
            break; //GREEN
        case 3:
            ege_color = "#00A8A8";
            break; //CYAN
        case 4:
            ege_color = "#A80000";
            break; //RED
        case 5:
            ege_color = "#A800A8";
            break; //MAGENTA
        case 6:
            ege_color = "#A80000";
            break; //BROWN
        case 7:
            ege_color = "#A8A8A8";
            break; //LIGHTGRAY
        case 8:
            ege_color = "#545454";
            break; //DARKGRAY
        case 9:
            ege_color = "#5454FC";
            break; //LIGHTBLUE
        case 10:
            ege_color = "#54FC54";
            break;//LIGHTGREEN
        case 11:
            ege_color = "#54FCFC";
            break;//LIGHTCYAN
        case 12:
            ege_color = "#FC5454";
            break;//LIGHTRED
        case 13:
            ege_color = "#FC54FC";
            break;//LIGHTMAGENTA
        case 14:
            ege_color = "#FCFC54";
            break;//YELLOW
        case 15:
            ege_color = "#FCFCFC";
            break;//WHITE
        default:
            ege_color = "#FCFCFC";//WHITE
    }
    return ege_color;
}

function initgraph(gd, gm, path) {
    /*in fact,currently we only need gd to ensure the size of the canvas*/
    var can = document.getElementById(CanvasId);
    ctx = can.getContext('2d');

    if (gd == 0) {
        can.setAttribute("height", "480px");
        can.setAttribute("width", "600px");

    }
    Height = can.getAttribute("height");
    Width = can.getAttribute("width");

}

function cleardevice() {
    var regpx = /^[0-9]+/;
    ctx.clearRect(0, 0, Number(regpx.exec(Width)), Number(regpx.exec(Height)));
}


function moveto(x, y) {
    MovetoPoint.x = x;
    MovetoPoint.y = y;
    ctx.moveTo(x, y);
}

function lineto(x, y) {
    if (_writemode == 1) {
        _setwritemode(1);
        ctx.moveTo(MovetoPoint.x, MovetoPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        _setwritemode(0);
    } else {
        ctx.moveTo(MovetoPoint.x, MovetoPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    moveto(x, y);
}

function linerel(dx, dy) {
    lineto(MovetoPoint.x + dx, MovetoPoint.y + dy);
    moveto(MovetoPoint.x + dx, MovetoPoint.y + dy);
}
/*SETs*/

/*It's better not to use it because the result is bad,and I don't know why and how to solve the problem*/
function setwritemode(mode) {
    if (mode == 0) {
        _writemode = 0;
    } else if (mode == 1) {
        _writemode = 1;
    } else {
        _writemode = 0;
    }
}

function settextstyle(mode, direction, charsize) {
    if (mode == 0) {             //default mode
        _font_is_fill = 1;
        ctx.font = 12 * charsize + "px sans-serif";
    } else if (mode == 1) {
        _font_is_fill = 1;
        ctx.font = 12 * charsize + "px Times New Roman";
    } else if (mode == 2) {
        _font_is_fill = 1;
        ctx.font = 12 * charsize + "px Consolas";
    } else if (mode == 3) {
        _font_is_fill = 0;
        ctx.font = 12 * charsize + "px Arial";
    } else if (mode == 4) {
        _font_is_fill = 0;
        ctx.font = 12 * charsize + "px Microsoft YaHei";
    } else {
        _font_is_fill = 1;
        ctx.font = 12 * charsize + "px sans-serif";
    }
    _current_text_height = 12 * charsize;
}

function setfillstyle(style, color) {
    /*currently it only supports SOLID_FILL and TC's 16 colors*/
    if (style == 0) {
        ctx.fillStyle = _transcolor(color);
    } else {
        ctx.fillStyle = _transcolor(color);
    }
}

function setlinestyle(style, pattern, width) {
    /*currently it only supports SOLID_LINE (0) and without user's pattern*/
    /*and the width in TC only supports 1 and 3*/
    /*so it is ignored now [2013-7-9]*/
    if (style == 0) {
        if (width == 1) {
            ctx.lineWidth = 1.0;
        } else if (width == 3) {
            ctx.lineWidth = 3.0;
        } else {
            ctx.lineWidth = 1.0;
        }
    } else {
        if (width == 1) {
            ctx.lineWidth = 1.0;
        } else if (width == 3) {
            ctx.lineWidth = 3.0;
        } else {
            ctx.lineWidth = 1.0;
        }
    }
}

function setbkcolor(color_num) {
    document.getElementById(CanvasId).style.backgroundColor = _transcolor(color_num);
    BackGroundColor = color_num;
}

function setcolor(color_num) {
    ctx.strokeStyle = _transcolor(color_num);
    ForeGroundColor = color_num;
}

function setbkcolor(color_num) {
    _initbackground(document.getElementById(CanvasId), color_num);
}

/*GETs*/
function getmaxx() {
    var regpx = /^[0-9]+/;
    return regpx.exec(Width);
}

function getmaxy() {
    var regpx = /^[0-9]+/;
    return regpx.exec(Height);
}

function getbkcolor() {
    return BackGroundColor;
}

function getcolor() {
    return ForeGroundColor;
}
/*DRAW*/
function putpixel(x, y, color_num) {
    setfillstyle(0, _transcolor(color_num));
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    setfillstyle(0, BackGroundColor);
    //TODO modify 0 into a variant
}

function bar(x0, y0, x1, y1) {
    var min_x, min_y;
    var bar_width, bar_height;
    min_x = (x0 > x1) ? x1 : x0;
    min_y = (y0 > y1) ? y1 : y0;
    bar_width = Math.abs(x0 - x1);
    bar_height = Math.abs(y0 - y1);
    ctx.fillRect(min_x, min_y, bar_width, bar_height);
}

function line(x0, y0, x1, y1) {
    ctx.beginPath();
    moveto(x0, y0);
    lineto(x1, y1);
}

function rectangle(x0, y0, x1, y1) {
    var min_x, min_y;
    var bar_width, bar_height;
    min_x = (x0 > x1) ? x1 : x0;
    min_y = (y0 > y1) ? y1 : y0;
    bar_width = Math.abs(x0 - x1);
    bar_height = Math.abs(y0 - y1);
    ctx.strokeRect(min_x, min_y, bar_width, bar_height);
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function arc(x, y, stangle, endangle, r) {
    var st_a = stangle / 360 * (Math.PI * 2);
    var end_a = -endangle / 360 * (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(x, y, r, st_a, end_a, true);
    ctx.stroke();
}

function ellipse(x, y, stangle, endangle, xradius, yradius) {
    var st_a = stangle / 360 * (Math.PI * 2);
    var end_a = -endangle / 360 * (Math.PI * 2);
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(xradius / yradius, 1);
    ctx.arc(0, 0, yradius, st_a, end_a, true);
    ctx.stroke();
    ctx.scale(yradius / xradius, 1);
    ctx.translate(-x, -y);
}

function fillellipse(x, y, xradius, yradius) {
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(xradius / yradius, 1);
    ctx.arc(0, 0, yradius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.scale(yradius / xradius, 1);
    ctx.translate(-x, -y);
}

function pieslice(x, y, stangle, endangle, r) {
    var st_a = stangle / 360 * (Math.PI * 2);
    var end_a = -endangle / 360 * (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(x, y, r, st_a, end_a, true);
    ctx.lineTo(x, y);
    ctx.fill();
}

function sector(x, y, stangle, endangle, xradius, yradius) {
    var st_a = stangle / 360 * (Math.PI * 2);
    var end_a = -endangle / 360 * (Math.PI * 2);
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(xradius / yradius, 1);
    ctx.arc(0, 0, yradius, st_a, end_a, true);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.scale(yradius / xradius, 1);
    ctx.translate(-x, -y);
}

function drawpoly(numpoints, points_arr) {
    ctx.beginPath();
    if (points_arr.length == numpoints * 2) {
        for (var j = 0; j < numpoints; j++) {
            if (j == 0) {
                ctx.moveTo(points_arr[0], points_arr[1]);
            } else {
                ctx.lineTo(points_arr[2 * j], points_arr[2 * j + 1]);
            }
        }
    }
    ctx.stroke();
    ctx.moveTo(MovetoPoint.x, MovetoPoint.y);
}

function fillpoly(numpoints, points_arr) {
    ctx.beginPath();
    if (points_arr.length == numpoints * 2) {
        for (var j = 0; j < numpoints; j++) {
            if (j == 0) {
                ctx.moveTo(points_arr[0], points_arr[1]);
            } else {
                ctx.lineTo(points_arr[2 * j], points_arr[2 * j + 1]);
            }
        }
    }
    ctx.fill();
    ctx.moveTo(MovetoPoint.x, MovetoPoint.y);
}

function outtextxy(x, y , string) {
    if (_font_is_fill == 0) {
        ctx.beginPath();
        ctx.strokeText(string, x, y + _current_text_height );
    } else if (_font_is_fill == 1) {
        ctx.fillStyle = _transcolor(ForeGroundColor);
        ctx.fillText(string, x, y + _current_text_height);
        setfillstyle(0, BackGroundColor);
    }
}

function textheight() {
    return _current_text_height;
}
function textwidth(string) {
    return ctx.measureText(string);
}

/*Other Operations*/


/*test*/
function main() {
    initgraph(0, 0, 0);
    setcolor(15);
    moveto(10, 10);
    line(10, 10, 20, 200);
    for(var i=0;i<=50;i++){

    }

    line(10, 0, 20, 220);
    setcolor(YELLOW);
    setfillstyle(1, 12);
    settextstyle(1, 0, 2);
    outtextxy(100, 200,"DemoHn");
    line(0,200,200,200);
}

