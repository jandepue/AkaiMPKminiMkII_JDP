
loadAPI(6); 

load("MPKminiMkII_JDP_Mapping.js"); // All mapping is done here

// Define the controller

host.defineController("Akai", "MPKminiMkII_JDPv3", "3.0", "FBE16610-F98F-11E4-B939-0800200C9A66","Jan De Pue");
host.defineSysexIdentityReply("F0 7E ?? 06 02 00 20 29 03 00 03 00 ?? ?? ?? ?? ?? F7");
host.addDeviceNameBasedDiscoveryPair(["MPKminiMkII_JDP3"], ["MPKminiMkII_JDP3"]);
host.defineMidiPorts(1, 1);


// Define State and Value Variables

var padShift = 0;
var padshiftHasChanged = true;
var visualFeedback = true;


// var isRecordOn = false;
// var recordHasChanged = false;
// var isPlayOn = false;
// var playHasChanged = false;
// var isStopOn = false;
// var stopHasChanged = false;
// var isOverdubOn = false;
// var overdubHasChanged = false;
// var isSoloOn = false;
// var soloHasChanged = false;
// var isArmOn = false;
// var armHasChanged = false;
// var isMuteOn = false;
// var muteHasChanged = false;
// var isClipOVROn = false;
// var clipOVRHasChanged = false;

var deviceName = "";
var deviceHasChanged = false;
var trackName = "";
var trackHasChanged = false;
var devicePresetName = "";
var rcPageName = "";

var hasFlatTrackBank = false;
var nT = 4;
var tracks = [];
var clSlotBanks = [];
var slotsObserver=[]
for (var i=0; i<4; i++) {
	var _trackSlots = [];
	for (var j=0; j<2; j++) {
	    _trackSlots.push({
		isSelected: false,
		hasContent: false,
		isPlaying: false,
		isRecording: false,
		isQueued: false
	    });
	}
	slotsObserver.push({
	    trackSelected: false,
	    trackSlots: _trackSlots
	});
}

//var isMacroOn = true;
//var macroHasChanged = false;
//var macro = [];
//var param = [];
var remoteControl = [];
var remoteControlPageHasChanged = false;
var nextParameterPageEnabled = true;
var prevParameterPageEnabled = true;
var paraPage = 0;
var paraPageOld = 42;
var showParameter = "";

var isMovingLeft = false;
var isMovingRight = false;
var isMovingUp = false;
var isMovingDown = false;
var moveLimit = 20;

var trackIsGroup0 = false;
var trackIsGroup1 = false;
var trackIsGroup2 = false;
var trackIsGroup3 = false;

var isPlaying = false;	
var lastCC = -99;
// var visualFeedback_CCMin=11;
// var visualFeedback_CCMax=18;
// var transport_visualFeedback=false;

var padTranslation = initArray(0, 128);

// Pad Translation function

function setNoteTable(table, offset) {
    for (var i = 0; i < 128; i++){
	table[i] = offset + i;
	if (table[i] < 0 || table[i] > 127) {
	    table[i] = -1;
	}
    }
    MPKminiPads.setKeyTranslationTable(padTranslation);
}


function clickSlot(trackIndex, slotIndex, slotsObserver, clSlotBanks, transport, transportIsPlaying) {
	var _slotObs = slotsObserver[trackIndex].trackSlots[slotIndex];
	println(_slotObs.isSelected)
	if(!_slotObs.isSelected) {
		clSlotBanks[trackIndex].select(slotIndex);
	}
	if(!_slotObs.hasContent) {
		//Start rec on transport
		if(!transportIsPlaying) {
			transport.play();
		}
		// println('record')
		clSlotBanks[trackIndex].launch(slotIndex);
	}
	else if(_slotObs.hasContent && !_slotObs.isQueued && !_slotObs.isRecording && !_slotObs.isPlaying) {
		// println('launch')
		clSlotBanks[trackIndex].launch(slotIndex);
	}
	else if(_slotObs.hasContent && (_slotObs.isQueued || _slotObs.isRecording || _slotObs.isPlaying)) {
		// println('stop')
		var playAfterStop = _slotObs.isRecording;
		clSlotBanks[trackIndex].stop();
		if(playAfterStop) {
			// println('but keep playing')
			clSlotBanks[trackIndex].launch(slotIndex);
			clSlotBanks[trackIndex].showInEditor(slotIndex);
		}
	}
};


//------------------------------------ Init -----------------------------------//
function init(){
    println("=== Initialize Controller ===")
   // Show the Bitwig Logo on the Pads :-)
    sendNoteOn(LEDStatus, LED.PAD01, 127);
    sendNoteOn(LEDStatus, LED.PAD06, 127);
    sendNoteOn(LEDStatus, LED.PAD07, 127); 
    sendNoteOn(LEDStatus, LED.PAD04, 127);

    // Create Preferences, DocState and Visual Notifications:
    docState = host.getDocumentState();
    prefs = host.getPreferences();
    notif = host.getNotificationSettings();

    notif.setShouldShowChannelSelectionNotifications(true);
    notif.setShouldShowDeviceLayerSelectionNotifications(true);
    notif.setShouldShowDeviceSelectionNotifications(true);
    notif.setShouldShowMappingNotifications(true);
    notif.setShouldShowPresetNotifications(true);
    notif.setShouldShowSelectionNotifications(true);
    notif.setShouldShowTrackSelectionNotifications(true);
    notif.setShouldShowValueNotifications(true);
    
    //Pad Translation
    padTrans = docState.getNumberSetting("Pad Transpose", "Settings", 2, 11, 1, "Bank Steps", 0);
    //println(padTrans)
    padTrans.addValueObserver(2, function(value){
		if (value*8 != padShift) {
	    	padShift = value*8;
	    	setNoteTable(padTranslation, padShift);
		}
    });

    //Creating a view onto our transport.
//    handlersRegistry = new HandlersRegistry();
    transport = host.createTransport();
    application = host.createApplication();
    cursorTrack = host.createEditorTrackSelection(true,0, 8);
    cursorDevice = host.createEditorCursorDevice();
    cursorRemoteControl = cursorDevice.createCursorRemoteControlsPage(8);
    browser = cursorDevice.createDeviceBrowser(1,1);
    popupBrowser = host.createPopupBrowser();
    metronome = transport.isMetronomeEnabled();
    
    track = host.createCursorTrack(2, 0);
    // device = track.getPrimaryDevice();

    transport.addIsPlayingObserver(function(value){
	isPlaying=value;
    });

    cursorDevice.name().addValueObserver(function(value){
		deviceName = value;
	});

	cursorDevice.presetName().addValueObserver(function(value){
		devicePresetName = value;
		if (deviceHasChanged) {
			host.showPopupNotification(deviceName+' - '+devicePresetName);
			// host.showPopupNotification('Remote Control: '+ rcPageName);
			showParameter = "none";
			remoteControlPageHasChanged = false;
	    }
	});

	cursorRemoteControl.getName().addValueObserver(function(value){
		if(value ==""){
			value = "Perform" // name is missing in bitwig 2.3.2
		}
		rcPageName = value;
	    if (remoteControlPageHasChanged) {
			host.showPopupNotification(deviceName+' - '+devicePresetName+': '+rcPageName);
			// host.showPopupNotification('Remote Control: '+ rcPageName);
			showParameter = "none";
			remoteControlPageHasChanged = false;
	    }
	});

	track.name().addValueObserver(function(value){
		trackName = value;
	    if (trackHasChanged) {
			host.showPopupNotification(trackName);
			showParameter = "none";
			trackHasChanged = false;
	    }
	});

    
    // trackBank = track.createMainTrackBank(nT, 2, 2, hasFlatTrackBank);
    trackBank = host.createMainTrackBank(nT, 2, 2);
    for (var iT=0; iT<nT; iT++) {
	    _track = trackBank.getItemAt(iT)
	    _clSlotBank = _track.clipLauncherSlotBank();
	    _clSlotBank.setIndication(true);
	    tracks.push(_track);
	    clSlotBanks.push(_clSlotBank);
	}

    for (var i=0; i<nT; i++) {
    	function setS(){
		    var _track = clSlotBanks[i];
		    var _i = i
		    trackBank.getChannel(i).addIsSelectedObserver(function(isSelected){
				slotsObserver[_i].trackSelected = isSelected;
		    });
		    _track.addIsSelectedObserver(function(slotIndex, isSelected){
				slotsObserver[_i].trackSlots[slotIndex].isSelected = isSelected;
		    });
		    _track.addIsPlayingObserver(function(slotIndex, isPlaying){
				slotsObserver[_i].trackSlots[slotIndex].isPlaying = isPlaying;
		    });
		    _track.addHasContentObserver(function(slotIndex, hasContent){
				slotsObserver[_i].trackSlots[slotIndex].hasContent = hasContent;
		    });
		    _track.addIsRecordingObserver(function(slotIndex, isRecording){
				slotsObserver[_i].trackSlots[slotIndex].isRecording = isRecording;
		    });
		    _track.addIsQueuedObserver(function(slotIndex, isQueued){
				slotsObserver[_i].trackSlots[slotIndex].isQueued = isQueued;
		    });
	    };
		setS();
	};

    //-------- Set MIDI callbacks / port
    host.getMidiInPort(0).setMidiCallback(onMidiPort1);
    
    //Sends Notes to Bitwig, with no input filters. 
    MPKminiKeys = host.getMidiInPort(0).createNoteInput("MPKmini Keys", "?0????");
    MPKminiPads = host.getMidiInPort(0).createNoteInput("MPKmini Pads", "?1????");
    MPKminiKeys.setShouldConsumeEvents(false);
    MPKminiPads.setShouldConsumeEvents(false);
    //setNoteTable(padTranslation, 0);
    

    // Initialize macro and device parameters
    for ( var p = 0; p < 8; p++) {
		remoteControl[p] = cursorRemoteControl.getParameter(p);
    }
    
  //   // Setup Views and Callbacks:
  //   cursorTrack.getSolo().addValueObserver(function(on) {
		// isSoloOn = on;
		// soloHasChanged = true;
  //   });
  //   cursorTrack.getArm().addValueObserver(function(on) {
		// isArmOn = on;
		// armHasChanged = true;
  //   });
  //   cursorTrack.getMute().addValueObserver(function(on) {
		// isMuteOn = on;
		// muteHasChanged = true;
  //   });
  //   transport.addIsPlayingObserver(function(on) {
		// isPlayingOn = on;
		// playHasChanged = true;
  //   });
  //   transport.addIsRecordingObserver(function(on) {
		// isRecordOn = on;
		// recordHasChanged = true;
  //   });
  //   transport.addOverdubObserver(function(on) {
		// isOverdubOn = on;
		// overdubHasChanged = true;
  //   });
  //   transport.addLauncherOverdubObserver(function(on) {
		// isClipOVROn = on;
		// clipOVRHasChanged = true;
  //   });

  	tracks[0].isGroup().addValueObserver(function(value){
  		trackIsGroup0=value;
    });
  	tracks[1].isGroup().addValueObserver(function(value){
  		trackIsGroup1=value;
    });
  	tracks[2].isGroup().addValueObserver(function(value){
  		trackIsGroup2=value;
    });
  	tracks[3].isGroup().addValueObserver(function(value){
  		trackIsGroup3=value;
    });

    for ( var p = 0; p < 8; p++) {
		remoteControl[p] = cursorRemoteControl.getParameter(p);
    }

    // Turn off the lights
    sendNoteOn(LEDStatus, LED.PAD01, 0);
    sendNoteOn(LEDStatus, LED.PAD06, 0);
    sendNoteOn(LEDStatus, LED.PAD07, 0); 
    sendNoteOn(LEDStatus, LED.PAD04, 0);
    
    ////// testing
    //// status byte for controller led : 144
    //// arpegiattor, tap tempo, etc : data1 1 - 9
    //// pad 1 - 8: data1 9 - 17
    //// bandAB, CC, PC : data1 17 - 20
    
    // for (i = 144; i < 145; i++) 
    // {
	   //  println(i)
    // 	for (j = 130; j < 140 ; j++) { 
    // 	sendNoteOn(i, LED.PAD04, 127)
    // 	}
    // }
}



// MIDI Processing

function onMidiPort1(status, data1, data2) {
    ////Test Test 
    // println(status)
    // println(data1)
    // println(data2)
    
    //Checks if the MIDI data is a CC
    if (isChannelController(status)) {
		
		// Joystick
		//if (data1 == panning){		
		//}
		//if (data1 == pitchbend){		
		//}
				
		// Macro knobs
		if (data1<11) {	    
		    switch (data1) {
		    case macro1:
				cursorRemoteControl.getParameter(0).getAmount().value().set(data2, 128);
				break;
		    case macro2:
				cursorRemoteControl.getParameter(1).getAmount().value().set(data2, 128);
				break;
		    case macro3:
				cursorRemoteControl.getParameter(2).getAmount().value().set(data2, 128);
				break;
		    case macro4:
				cursorRemoteControl.getParameter(3).getAmount().value().set(data2, 128);
				break;
		    case macro5:
				cursorRemoteControl.getParameter(4).getAmount().value().set(data2, 128);
				break;
		    case macro6:
				cursorRemoteControl.getParameter(5).getAmount().value().set(data2, 128);
				break;
		    case macro7:
				cursorRemoteControl.getParameter(6).getAmount().value().set(data2, 128);
				break;
		    case macro8:
				cursorRemoteControl.getParameter(7).getAmount().value().set(data2, 128);
				break;
		    }
		}
		
		// CC PADS
		// Program 1 CC
		else if (data1<43) {
			if (data2>0){ // a button is pushed
				switch (data1) {
				// CC & PB A
			    case stop:
					transport.stop();
					showParameter = "stop";
					break;
			    case play:
					transport.play();
					showParameter = "play";
					break;
			    case rec:
					transport.record();
					showParameter = "record";
					break;
				case cursorTrackDown:
				    cursorTrack.selectNext();
					showParameter = "trackchange";
				    break;
			    case toggleArmCursorTrack:
					cursorTrack.getArm().toggle();
					showParameter = "arm";
					break;
			    case toggleSoloCursorTrack:
					cursorTrack.getSolo().toggle();
					showParameter = "solo";
					break;
			    case toggleMuteCursorTrack:
					cursorTrack.getMute().toggle();
					showParameter = "mute";
					break;
				case cursorTrackUp:
			   		cursorTrack.selectPrevious();
					showParameter = "trackchange";
			    	break;

				// CC & PB B
				case tapTempo:
					transport.tapTempo();
					break
				case toggleMetronome:
					metronome.toggle();
					break

				case previousRC:
				    cursorRemoteControl.selectPreviousPage(true);
				    break;
				case nextRC:
				    cursorRemoteControl.selectNextPage(true);
				    break;
			    }
			}
		    if (data2 == 0) { // do sth when button released
			
			// These are workarounds for the fact that the pads overwrite their lighted state on release
			// So we have to re-send the light on message when the button is released...
				switch (data1) {
				case toggleArmCursorTrack:
				    armHasChanged = true;
				    break;		    
				case toggleSoloCursorTrack:
				    soloHasChanged = true;
				    break;
				case toggleMuteCursorTrack:
				    muteHasChanged = true;
				    break;
				case play:
				    playHasChanged = true;
				    break;
				case rec:
				    recordHasChanged = true;
				    break;
				case cursorTrackDown:
				    trackHasChanged = true;
				    break;
				case cursorTrackUp:
				    trackHasChanged = true;
			    	break;

				case shiftPadsUp:
				    if (padShift < 88){
					padShift += 8;
					println(padShift)
					setNoteTable(padTranslation, padShift);
				    }
				    padshiftHasChanged = true;
				    showParameter = "padshift";
				    break;
				case shiftPadsDown:
				    if (padShift > -40){						
					padShift -= 8;
					println(padShift)
					setNoteTable(padTranslation, padShift);
				    }
				    padshiftHasChanged = true;
				    showParameter = "padshift";
				    break;
				case previousRC:
				    remoteControlPageHasChanged = true;
				    // showParameter = "rcPage"
				    break;
				case nextRC:
				    remoteControlPageHasChanged = true;
				    // showParameter = "rcPage"
				    break;
				}
		    }
		}
		
		// Program II joystick
		else if (data1<47){
		    switch (data1){
		    case moveLEFT:
				if (!isMovingLeft && data2 > moveLimit){
				    trackBank.scrollTracksPageUp()
				    isMovingLeft=true;
				}
				else if (isMovingLeft && data2<moveLimit){
				    isMovingLeft=false;
				}
				break;
		    case moveRIGHT:
				if (!isMovingRight && data2 > moveLimit){
				    trackBank.scrollTracksPageDown()
				    isMovingRight=true;
				}
				else if (isMovingRight && data2<moveLimit){
				    isMovingRight=false;
				}
				break;
		    case moveUP:
				if (!isMovingUp && data2 > moveLimit){
				    trackBank.scrollScenesPageUp()
				    isMovingUp=true;
				}
				else if (isMovingUp && data2<moveLimit){
				    isMovingUp=false;
				}
				break;
		    case moveDOWN:
				if (!isMovingDown && data2 > moveLimit){
				    trackBank.scrollScenesPageDown()
				    isMovingDown=true;
				}
				else if (isMovingDown && data2<moveLimit){
				    isMovingDown=false;
				}
				break;
		    }
		}
		
		// Program II CC slot control
		else if (data1<62){
		    if (data2===0){ // do on release
				switch (data1){
				case startSlot00:
					// clickSlot(trackIndex, slotIndex, slotsObserver, clSlotBanks, transport, transportIsPlaying)
				    clickSlot(0, 0, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot01:
				    clickSlot(0, 1, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot10:
				    clickSlot(1, 0, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot11:
				    clickSlot(1, 1, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot20:
				    clickSlot(2, 0, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot21:
				    clickSlot(2, 1, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot30:
				    clickSlot(3, 0, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case startSlot31:
				    clickSlot(3, 1, slotsObserver, clSlotBanks, transport, isPlaying)
				    break;
				case delSlot00:
					clSlotBanks[0].deleteClip(0)
				    break;
				case delSlot01:
					clSlotBanks[0].deleteClip(1)
				    break;
				case delSlot10:
					clSlotBanks[1].deleteClip(0)
				    break;
				case delSlot11:
					clSlotBanks[1].deleteClip(1)
				    break;
				case delSlot20:
					clSlotBanks[2].deleteClip(0)
				    break;
				case delSlot21:
					clSlotBanks[2].deleteClip(1)
				    break;
				case delSlot30:
					clSlotBanks[3].deleteClip(0)
				    break;
				case delSlot31:
					clSlotBanks[3].deleteClip(1)
				    break;
				}
		    }
		}

		// Program III Knobs
		else if (data1<72){
			switch (data1) {
		    case volume0:
				tracks[0].volume().value().set(data2, 128);
				break;
		    case volume1:
				tracks[1].volume().value().set(data2, 128);
				break;
		    case volume2:
				tracks[2].volume().value().set(data2, 128);
				break;
		    case volume3:
				tracks[3].volume().value().set(data2, 128);
				break;
		    case pan0:
				tracks[0].pan().value().set(data2, 128);
				break;
		    case pan1:
				tracks[1].pan().value().set(data2, 128);
				break;
		    case pan2:
				tracks[2].pan().value().set(data2, 128);
				break;
		    case pan3:
				tracks[3].pan().value().set(data2, 128);
				break;
			}
		}
		// Program III CC buttons

		else if (data1<88){
			if (data2>0){
				switch (data1) {
				// CC & PB A
			    case stop3:
					transport.stop();
					// showParameter = "stop";
					break;
			    case play3:
					transport.play();
					// showParameter = "play";
					break;
			    case rec3:
					transport.record();
					// showParameter = "record";
					break;
				case recAuto3:
					transport.toggleWriteArrangerAutomation();
					break;
				case group0:
					if (trackIsGroup0){
						// println('is group')
						application.navigateIntoTrackGroup(tracks[0]);
					} else {
						// println('Get Out')
						application.navigateToParentTrackGroup();
					}
					break;
				case group1:
					if (trackIsGroup1){
						application.navigateIntoTrackGroup(tracks[1]);
					}
					else{
						application.navigateToParentTrackGroup();
					}
					break;
				case group2:
					if (trackIsGroup2){
						application.navigateIntoTrackGroup(tracks[2]);
					}
					else{
						application.navigateToParentTrackGroup();
					}
					break;
				case group3:
					if (trackIsGroup3){
						application.navigateIntoTrackGroup(tracks[3]);
					}
					else{
						application.navigateToParentTrackGroup();
					}
					break;


				// CC & PB B
				case mute0:
					tracks[0].mute().toggle()
					break;
				case mute1:
					tracks[1].mute().toggle()
					break;
				case mute2:
					tracks[2].mute().toggle()
					break;
				case mute3:
					tracks[3].mute().toggle()
					break;
				case solo0:
					tracks[0].solo().toggle()
					break;
				case solo1:
					tracks[1].solo().toggle()
					break;
				case solo2:
					tracks[2].solo().toggle()
					break;
				case solo3:
					tracks[3].solo().toggle()
					break;
			    }
			}
		    if (data2 == 0) { // do sth when button released			
			// These are workarounds for the fact that the pads overwrite their lighted state on release
			// So we have to re-send the light on message when the button is released...
				switch (data1) {
				case play:
				    playHasChanged = true;
				    break;
				case rec:
				    recordHasChanged = true;
				    break;
				}
			}
		}
    }
    
    else if (isProgramChange(status)) {
		switch (data1) {			
		    // PC & PB A
			case inspector:
			    application.toggleInspector();
			    break;
			case perspective:
			    application.nextPanelLayout();
			    break;
			// case projectbutton:
			//     application.nextProject();
			//     break;
			case editview:
				application.setPanelLayout("EDIT")

			case browserVisible:
			    application.toggleBrowserVisibility();
			    break;
			case note:
			    application.toggleNoteEditor();
			    break;
			case automation:
			    application.toggleAutomationEditor();
			    break;
			case devicebutton:
			    application.toggleDevices();
			    break;
			case mixer:
			    application.toggleMixer();
			    break;

		    // PC & PB B
		    case startbrowsing:
				browser.startBrowsing();
			    break;
			case commitbrowsing:
				browser.commitSelectedResult();		    
			    break;
			case nextPreset:
			    popupBrowser.selectNextFile();
			    break;
			case previousPreset:
			    popupBrowser.selectPreviousFile();
			    break;
			case devPageUp:
			    cursorDevice.selectNext();
			    flush()
			    deviceHasChanged = true;
				// showParameter = "device";
			    break;
			case devPageDown:
			    cursorDevice.selectPrevious();
			    flush()
			    deviceHasChanged = true;
				// showParameter = "device";
			    break;
			case previousRC2:
			    cursorRemoteControl.selectPreviousPage(true);
			    remoteControlPageHasChanged = true;
			    // showParameter = "rcPage"
			    break;
			case nextRC2:
			    cursorRemoteControl.selectNextPage(true);
			    remoteControlPageHasChanged = true;		
			    // showParameter = "rcPage"
			    break;
		}
	}
    lastCC=data1;
}



// Sending out Midi to the Controller
// OBSERVER VALUES ARE UPDATED AFTER FLUSH, NOT EARLIER!
function flush() {
    if (visualFeedback && showParameter) {

	switch (showParameter) {
	case "padshift":
	    if (padshiftHasChanged) {
		showParameter = "none";
		host.showPopupNotification("Pad Bank: " + padShift/8);
	    }
	    break;
    //case "arm":
    //	if (armHasChanged) {
    //	host.showPopupNotification("Arm: " + (isArmOn ? "On" : "Off"));
    //	}
    //	break;
    //case "solo":
    //	if (soloHasChanged) {
    //		showParameter = "none";
    //		host.showPopupNotification("Solo: " + (isSoloOn ? "On" : "Off"));
    //	}
    //	break;
    //case "mute":
    //	if (muteHasChanged) {
    //		showParameter = "none";
    //		host.showPopupNotification("Mute: " + (isSoloOn ? "On" : "Off"));
    //	}
    //	break;
	// case "device":
	//     if (deviceHasChanged) {
	// 		host.showPopupNotification(deviceName+' - '+devicePresetName);
	// 		// host.showPopupNotification('Remote Control: '+ rcPageName);
	// 		showParameter = "none";
	// 		remoteControlPageHasChanged = false;
	//     }
 //        break;
	// case "rcPage":
	//     if (remoteControlPageHasChanged) {
	// 		host.showPopupNotification(deviceName+' - '+devicePresetName+': '+rcPageName);
	// 		// host.showPopupNotification('Remote Control: '+ rcPageName);
	// 		showParameter = "none";
	// 		remoteControlPageHasChanged = false;
	//     }
 //        break;
	// case "trackchange":
	//     if (trackHasChanged) {
	// 		host.showPopupNotification(trackName);
	// 		showParameter = "none";
	// 		trackHasChanged = false;
	//     }
 //        break;
	}
    }
  //   if (lastCC>=visualFeedback_CCMin && lastCC<=visualFeedback_CCMin){
		// if (armHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD05, isArmOn ? 127 : 0);
		//     armHasChanged = false;
		// }
		// if (soloHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD06, isSoloOn ? 127 : 0);
		//     soloHasChanged = false;
		// }
		// if (muteHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD07, isMuteOn ? 127 : 0);
		//     muteHasChanged = false;
		// }
		// if (playHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD02, isPlayingOn ? 127 : 0);
		//     sendMidi(LEDStatus, LED.PAD01, isPlayingOn ? 0 : 127);
		//     playHasChanged = false;
		// }
		// if (recordHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD03, isRecordOn ? 127 : 0);
		//     recordHasChanged = false;
		// }
		// if (overdubHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD04, isOverdubOn ? 127 : 0);
		//     overdubHasChanged = false;
		// }
		// if (clipOVRHasChanged) {
		//     sendMidi(LEDStatus, LED.PAD08, isClipOVROn ? 127 : 0);
		//     clipOVRHasChanged = false;
		// }
  //   }
}

// EXIT

function exit() {
    println("exit.");
}



