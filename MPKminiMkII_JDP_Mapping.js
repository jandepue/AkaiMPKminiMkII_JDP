
// MIDI status channels
var CCStatus = 176
var PCStatus = 192
var LEDStatus = 144
//var LEDStatus = null

var LED=
{
	PAD01 : 9,
	PAD02 : 10,
	PAD03 : 11,
	PAD04 : 12,
	PAD05 : 13,
	PAD06 : 14,
	PAD07 : 15,
	PAD08 : 16,	
};


// List of CCs and PCs of the Pads:

// ===================== PROGRAM 1 ======================= //

var Joystick1 = 
{
	LEFT : 0,
	RIGHT : 1,
	UP : null,
	DOWN : null,
};

var Knobs1 =
{
	Knob01 : 3,
	Knob02 : 4,
	Knob03 : 5,
	Knob04 : 6,
	Knob05 : 7,
	Knob06 : 8,
	Knob07 : 9,
	Knob08 : 10,
};

var CC1 =
{
	PAD01 : 11,
	PAD02 : 12,
	PAD03 : 13,
	PAD04 : 14,
	PAD05 : 15,
	PAD06 : 16,
	PAD07 : 17,
	PAD08 : 18,
	PAD09 : 19,
	PAD10 : 20,
	PAD11 : 21,
	PAD12 : 22,
	PAD13 : 23,
	PAD14 : 24,
	PAD15 : 25,
	PAD16 : 26
};

var PC1 =
{
	PAD01 : 27,
	PAD02 : 28,
	PAD03 : 29,
	PAD04 : 30,
	PAD05 : 31,
	PAD06 : 32,
	PAD07 : 33,
	PAD08 : 34,
	PAD09 : 35,
	PAD10 : 36,
	PAD11 : 37,
	PAD12 : 38,
	PAD13 : 39,
	PAD14 : 40,
	PAD15 : 41,
	PAD16 : 42
};


// MAPPING

// Joystick
var panningLEFT=Joystick1.LEFT;
var panningRIGHT=Joystick1.RIGHT;
var pitchbendUP=Joystick1.UP;
var pitchbendDOWN=Joystick1.DOWN;

//Knobs: Device Macros
var macro1=Knobs1.Knob01
var macro2=Knobs1.Knob02
var macro3=Knobs1.Knob03
var macro4=Knobs1.Knob04
var macro5=Knobs1.Knob05
var macro6=Knobs1.Knob06
var macro7=Knobs1.Knob07
var macro8=Knobs1.Knob08


// CC & PB A - Transport and Track
var stop = CC1.PAD01;
var play = CC1.PAD02;
var rec = CC1.PAD03;
var cursorTrackDown = CC1.PAD04;
var toggleArmCursorTrack = CC1.PAD05;
var toggleSoloCursorTrack = CC1.PAD06;
var toggleMuteCursorTrack = CC1.PAD07;
var cursorTrackUp = CC1.PAD08;

// CC & PB B - Navigation and Transpose + Mapping
var tapTempo = CC1.PAD13;
var toggleMetronome = CC1.PAD09;
//var devPageUp = CC1.PAD14;
//var devPageDown = CC1.PAD10;
var shiftPadsUp = CC1.PAD15;
var shiftPadsDown = CC1.PAD11;
var previousRC = CC1.PAD16;
var nextRC = CC1.PAD12;



// PC & PB A - GUI Navigation
var note = PC1.PAD01;
var automation = PC1.PAD02;
var devicebutton = PC1.PAD03;
var mixer = PC1.PAD04;
var inspector = PC1.PAD05;
var perspective = PC1.PAD06;
//var projectbutton = PC1.PAD07;
var editview = PC1.PAD07;
var browserVisible = PC1.PAD08;


// PC & PB B - Preset Navigation
var startbrowsing = PC1.PAD13;
var commitbrowsing = PC1.PAD09;
var previousPreset = PC1.PAD14;
var nextPreset = PC1.PAD10;
var devPageUp = PC1.PAD15;
var devPageDown = PC1.PAD11;
var previousRC2 = PC1.PAD16;
var nextRC2 = PC1.PAD12;




// ===================== PROGRAM 2 ======================= //

var Joystick2 = 
{
	LEFT : 43,
	RIGHT : 44,
	UP : 45,
	DOWN : 46,
};

//var Knobs2 =
//{
	//Knob01 : 3,
	//Knob02 : 4,
	//Knob03 : 5,
	//Knob04 : 6,
	//Knob05 : 7,
	//Knob06 : 8,
	//Knob07 : 9,
	//Knob08 : 10,
//};

var CC2 =
{
	PAD01 : 47,
	PAD02 : 48,
	PAD03 : 49,
	PAD04 : 50,
	PAD05 : 51,
	PAD06 : 52,
	PAD07 : 53,
	PAD08 : 54,
	PAD09 : 55,
	PAD10 : 56,
	PAD11 : 57,
	PAD12 : 58,
	PAD13 : 59,
	PAD14 : 60,
	PAD15 : 61,
	PAD16 : 62,
};

//var PC2 =
//{
	//PAD01 : 27,
	//PAD02 : 28,
	//PAD03 : 29,
	//PAD04 : 30,
	//PAD05 : 31,
	//PAD06 : 32,
	//PAD07 : 33,
	//PAD08 : 34,
	//PAD09 : 35,
	//PAD10 : 36,
	//PAD11 : 37,
	//PAD12 : 38,
	//PAD13 : 39,
	//PAD14 : 40,
	//PAD15 : 41,
	//PAD16 : 42
//};


// MAPPING

// Joystick
var moveLEFT=Joystick2.LEFT;
var moveRIGHT=Joystick2.RIGHT;
var moveUP=Joystick2.UP;
var moveDOWN=Joystick2.DOWN;


////Knobs: Device Macros
//var macro1=Knobs1.Knob01
//var macro2=Knobs1.Knob02
//var macro3=Knobs1.Knob03
//var macro4=Knobs1.Knob04
//var macro5=Knobs1.Knob05
//var macro6=Knobs1.Knob06
//var macro7=Knobs1.Knob07
//var macro8=Knobs1.Knob08


// CC & PB A - Transport and Track
var startSlot00 = CC2.PAD05;
var startSlot01 = CC2.PAD01;
var startSlot10 = CC2.PAD06;
var startSlot11 = CC2.PAD02;
var startSlot20 = CC2.PAD07;
var startSlot21 = CC2.PAD03;
var startSlot30 = CC2.PAD08;
var startSlot31 = CC2.PAD04;

// CC & PB B - Navigation and Transpose + Mapping
var delSlot00 = CC2.PAD13;
var delSlot01 = CC2.PAD09;
var delSlot10 = CC2.PAD14;
var delSlot11 = CC2.PAD10;
var delSlot20 = CC2.PAD15;
var delSlot21 = CC2.PAD11;
var delSlot30 = CC2.PAD16;
var delSlot31 = CC2.PAD12;

//// PC & PB A - Preset Navigation
//var previousPreset = PC1.PAD05;
//var nextPreset = PC1.PAD01;
//var previousPresetCategory = PC1.PAD06;
//var nextPresetCategory = PC1.PAD02;
//var previousPresetCreator = PC1.PAD07;
//var nextPresetCreator = PC1.PAD03;
//var toggleMacro2 = PC1.PAD08;
//var nextMap2 = PC1.PAD04;

//// PC & PB B - GUI Navigation
//var note = PC1.PAD09;
//var automation = PC1.PAD10;
//var mixer = PC1.PAD11;
//var device = PC1.PAD12;
//var inspector = PC1.PAD13;
//var perspective = PC1.PAD14;
//var project = PC1.PAD15;
//var browser = PC1.PAD16;




// ===================== PROGRAM 3 ======================= //

// var Joystick2 = 
// {
// 	LEFT : 43,
// 	RIGHT : 44,
// 	UP : 45,
// 	DOWN : 46,
// };

var Knobs3 =
{
	Knob01 : 64, // TOP 4
	Knob02 : 65,
	Knob03 : 66,
	Knob04 : 67,
	Knob05 : 68, // BOTTOM 4
	Knob06 : 69,
	Knob07 : 70,
	Knob08 : 71,
};

var CC3 =
{
	PAD01 : 72,
	PAD02 : 73,
	PAD03 : 74,
	PAD04 : 75,
	PAD05 : 76,
	PAD06 : 77,
	PAD07 : 78,
	PAD08 : 79,
	PAD09 : 80,
	PAD10 : 81,
	PAD11 : 82,
	PAD12 : 83,
	PAD13 : 84,
	PAD14 : 85,
	PAD15 : 86,
	PAD16 : 87,
};

//var PC2 =
//{
	//PAD01 : 27,
	//PAD02 : 28,
	//PAD03 : 29,
	//PAD04 : 30,
	//PAD05 : 31,
	//PAD06 : 32,
	//PAD07 : 33,
	//PAD08 : 34,
	//PAD09 : 35,
	//PAD10 : 36,
	//PAD11 : 37,
	//PAD12 : 38,
	//PAD13 : 39,
	//PAD14 : 40,
	//PAD15 : 41,
	//PAD16 : 42
//};


// MAPPING

// Joystick
// var moveLEFT=Joystick2.LEFT;
// var moveRIGHT=Joystick2.RIGHT;
// var moveUP=Joystick2.UP;
// var moveDOWN=Joystick2.DOWN;


//Knobs: Device Macros
var volume0=Knobs3.Knob01
var volume1=Knobs3.Knob02
var volume2=Knobs3.Knob03
var volume3=Knobs3.Knob04
var pan0=Knobs3.Knob05
var pan1=Knobs3.Knob06
var pan2=Knobs3.Knob07
var pan3=Knobs3.Knob08


// CC & PB A - Transport and Track
var stop3 = CC3.PAD01;
var play3 = CC3.PAD02;
var rec3 = CC3.PAD03;
var recAuto3 = CC3.PAD04;
var group0 = CC3.PAD05;
var group1 = CC3.PAD06;
var group2 = CC3.PAD07;
var group3 = CC3.PAD08;

// CC & PB B - Navigation and Transpose + Mapping
var mute0 = CC3.PAD09;
var mute1 = CC3.PAD10;
var mute2 = CC3.PAD11;
var mute3 = CC3.PAD12;
var solo0 = CC3.PAD13;
var solo1 = CC3.PAD14;
var solo2 = CC3.PAD15;
var solo3 = CC3.PAD16;

//// PC & PB A - Preset Navigation
//var previousPreset = PC1.PAD05;
//var nextPreset = PC1.PAD01;
//var previousPresetCategory = PC1.PAD06;
//var nextPresetCategory = PC1.PAD02;
//var previousPresetCreator = PC1.PAD07;
//var nextPresetCreator = PC1.PAD03;
//var toggleMacro2 = PC1.PAD08;
//var nextMap2 = PC1.PAD04;

//// PC & PB B - GUI Navigation
//var note = PC1.PAD09;
//var automation = PC1.PAD10;
//var mixer = PC1.PAD11;
//var device = PC1.PAD12;
//var inspector = PC1.PAD13;
//var perspective = PC1.PAD14;
//var project = PC1.PAD15;
//var browser = PC1.PAD16;


