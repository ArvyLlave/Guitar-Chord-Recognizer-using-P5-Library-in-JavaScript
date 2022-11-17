// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Basic Pitch Detection
=== */

let arr = [6];
let i =0; // nag declare ako dito i for the loop
let audioContext;
let mic;
let pitch;
let data; // variable para sa stored Hz

//stored hz ng mga standard chords
var chords = {
  "E": 329.63,
  "B": 246.94,
  "G": 196.00,
  "D": 146.83,
  "A": 110.00,
  "e": 82.41
}

function setup() {
  noCanvas();
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
}

//filter setup
function soundFilter(stream){
    var filter, mediaStreamSource;
  
    var analyser = audioContext.createAnalyser();
      analyser.minDecibels = -35;
      analyser.maxDecibels = -5;
      analyser.smoothingTimeConstant = 0.85;
  
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( {audio:true}, initAudio , function(err){
        console.log('usermedia error', err)
    });

    //applies a filter to reduce noise from input mic
    function initAudio(stream) {

        filter = audioContext.createBiquadFilter();
        filter.Q.value = 300;
        filter.frequency.value = 440.0;
        filter.type = 'bandpass';
     
      source = audioContext.createMediaStreamSource( stream );
      source.connect(analyser);
      analyser.connect(filter);
      //filter.connect(audioContext.destination);
  }
}

function startPitch(){ 
  pitch = ml5.pitchDetection('./model/', audioContext , mic.stream, modelLoaded);
   
}

function modelLoaded() {
  //select('#status').html('Model Loaded');
  var indicatr = document.getElementById('indicator');
  indicatr.style.backgroundColor = "#0b0";
  var mic = document.getElementById('mic');
  mic.style.opacity = 1;
}


//function to start record
function getPitch() {
  soundFilter(mic.stream);
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      select('#result').html(frequency.toFixed(0));
    } else {
 
      select('#result').html('No pitch detected');
    }
    
    for(i; i < 500; i++){    // good for storing the set of frequency using 
      getPitch(frequency);         // for loops and have an array size of 500
      arr [i] = frequency;
    }
    
    console.log (arr);
    compare(arr);
   
   // data = frequency; // dito na yung storing nung nakuhang Hz sa data variable for future use
    
    //dont mind this part para lang sa pag execute if nag work sya 
  //  console.log(data);
    
   /* if (chords.E <= data){
    console.log("The input freqeuncy is greater than the frequency of standard chord E 329.63Hz ")
  } else {
    console.log("The input freqeuncy is less than the frequency of standard chord E 329.63Hz")
  }*/ 
    
  })
}

  
//function to stop/pause record
function stopPitch(){
  audioContext.suspend();
}
//function to resume record
function resumePitch() {
  audioContext.resume();
}
//function to compare the frequency
function compare(arr){
  
  var chordname = document.getElementById('chordname');
    for(i=0; i<500; i++){
	  if((arr[i]>310) && (arr[i]<350)){
        console.log ("E");
        chordname.innerHTML = "E";
			//output will be E = 329.63
      }
        
	  else if( (arr[i]>230) && (arr[i]<260) ){
        console.log ("B");
        chordname.innerHTML = "B";
			//output will be B = 246.94
      }
        
	  else if( (arr[i]>185) && (arr[i]<210) ){
        console.log ("G");
        chordname.innerHTML = "G";
			//output will be G = 196.00
      }
      
	  else if( (arr[i]>130) && (arr[i]<160) ){
         console.log ("D");
        chordname.innerHTML = "D";
			//output will be D = 146.83
      }
	  else if( (arr[i]>100) && (arr[i]<120) ){
        console.log ("A");
        chordname.innerHTML = "A";
			//output will be A = 110.00
      }
        
	  else if( (arr[i]>70) && (arr[i]<90) ){
        console.log ("e");
        chordname.innerHTML = "e";
			//output will be e = 82.41
      }
        
      else
        console.log("Chord Not Recognized. Make sure Guitar is in Standard tuning");
      chordname.innerHTML="Chord Not Recognized";


  
	}
}
