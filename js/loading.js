

function RandomFadeout() {
    $("#spinner").fadeOut("fast",function () {
       console.log("hid spinner")
    });
    //Build an array of all available boxes
    availableBoxes = [];
    for(var i=0;i < 50; i++){
        availableBoxes[i] = "#box"+(i+1).toString()
    }
    console.log(availableBoxes);

    for(var k=0; k< 50; k++){
       var boxIndex = Math.floor(Math.random() * (50-k));
       console.log("index "+boxIndex+" fade out box "+availableBoxes[boxIndex]);
       if(k===49){
           fadeaway(availableBoxes[boxIndex], true);
       }else{
           fadeaway(availableBoxes[boxIndex], false);
       }

        availableBoxes.splice(boxIndex,1);
    }


}

function fadeaway(boxId, isFinal){
    var maxDelayTime = 2100;
    if(isFinal){
        delayTime = maxDelayTime;
    }else{
        var delayTime = Math.floor(Math.random() * maxDelayTime);

    }

    //First transition everything to the same color
    $(boxId).animate({backgroundColor: '#5099EB'}, 1000);
    //Transition color to transparent with random delays for pixeling out effect
    $(boxId).delay(delayTime).animate({backgroundColor: 'transparent'}, 1000, function () {
        if(isFinal){
            // WIll make sure things under the overlay are clickable
            elem2 = document.getElementById("overlay");
            elem2.style.display = "none";
            console.log("got rid of everythin")
        }
    });

}