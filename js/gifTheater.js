
var screenPlay = {
    "screen_id": "GifTheaterScreen",
    "screen_class": "center-fit",
    "random_play":true,
    "scenes": [
        {"title":"hi", "duration": 10, "preview":"imgs/preview.gif" ,"img":"imgs/K-Hi.gif" , "description": "waves hi", "random_replay":1, "starting_scene": true},
        {"title":"tap-1", "duration": 10,"preview":"imgs/preview.gif" ,"img":"imgs/K-Tap-1.gif", "description": "just programing, shorter duration", "random_replay": Infinity},
        {"title":"tap-2", "duration": 20, "preview":"imgs/preview.gif","img":"imgs/K-Tap-2.gif", "description": "just programing, longer duration", "random_replay": Infinity},
        {"title":"thinking", "duration": 20, "preview":"imgs/preview.gif","img":"imgs/K-Scratch.gif", "description": "scratches head while thinking", "random_replay": Infinity},
        {"title":"drinking-1", "duration": 20,"preview":"imgs/preview.gif" ,"img":"imgs/K-Drink-1.gif", "description": "drinks something", "random_replay": Infinity},
        {"title":"drinking-2", "duration": 20, "preview":"imgs/preview.gif","img":"imgs/K-Drink-2.gif", "description": "is taping then starts drinking then spits it out", "random_replay": Infinity}
    ]
};




(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.GifTheater = factory();
    }
}(this, function () {
    var GifTheater = function ( screenplay ) {

        //Obj holding all the movie SuperGifs
        var movieGifs = [];
        var defaultScreenClass = screenplay.screen_class;
        var screenId = screenplay.screen_id;
        var sceneTitleArrayLoc = {}; //A dictionary that given a scene title will locate its location in o(1) time
        var scenes = screenplay.scenes;
        var isRandomPlayOn = screenplay.random_play;
        var sceneCounter = {};  //Keeps track of how many times a screen has been displayed
        var currentSceneLoc = 0;

        //Generic Functions
        var newScene = function (screenClass, screenId, scene, arrayLoc){
            let elem = document.createElement("img");
            let newId = generateSceneId(screenId, arrayLoc);
            elem.setAttribute("id", newId);
            elem.setAttribute("src", scene.preview);
            //elem.setAttribute("height", "768");
            //elem.setAttribute("width", "1024");
            try {
                if(scene.starting_scene === true){
                    elem.setAttribute("class", screenClass);
                }else{
                    elem.setAttribute("class",  screenClass+" hide");
                }
            } catch (e) {
                if(i === 0)
                {
                    elem.setAttribute("class",  screenClass);
                }
                else{
                    elem.setAttribute("class",  screenClass+" hide");
                }
            }

            elem.setAttribute( "rel:auto_play", "0");
            elem.setAttribute("rel:animated_src", scene.img);
            elem.setAttribute("alt", scene.title);
            document.getElementById(screenId).appendChild(elem);
            return newId
        };

        var switchScenes = function(previousSceneElementId, NewSceneElementId){
            console.log("Switching Scenes now");
            let prevScene = document.getElementById(previousSceneElementId);
            let nextScene = document.getElementById(NewSceneElementId);
            prevScene.classList.add("hide");
            nextScene.classList.remove("hide")
        };

        var generateSceneId = function (screen_id, arrayLoc){
            return screen_id+"Scene"+arrayLoc.toString()
        };

        var playNext = function() {
            let nextSceneLoc = 0;
            let currentScene = scenes[currentSceneLoc];
            console.log("Play next scene");

            // When random play is on we select a scene at random
            if (isRandomPlayOn === true){
                console.log("Picking a random scene to play next");
                if(sceneCounter[currentScene.title] === undefined){
                    sceneCounter[currentScene.title] = 1;
                }
                else{
                    sceneCounter[currentScene.title] += 1;
                }
                console.log(sceneCounter);
                console.log(currentScene);

                //Use this loop to make sure we pick a random scene that was not the previous scene
                while(true) {
                    console.log("in loop");
                    nextSceneLoc = Math.floor(Math.random() * scenes.length);
                    //Fixme: find the righ logic for this
                    nextScene = scenes[nextSceneLoc];
                    if(nextScene.random_replay === Infinity && nextSceneLoc !== currentSceneLoc){
                        break
                    }else if (sceneCounter[nextScene.title] < nextScene.random_replay && nextSceneLoc !== currentSceneLoc) {
                        break
                    }
                    console.log("re picking")
                }

            }else{
                nextSceneLoc = sceneTitleArrayLoc[movieGifs[currentSceneLoc].next_scene]
            }
            let nextSceneElemId = generateSceneId(screenplay.screen_id, nextSceneLoc);
            let currentSceneElemId = generateSceneId(screenplay.screen_id, currentSceneLoc);

            movieGifs[currentSceneLoc].pause();
            switchScenes(currentSceneElemId, nextSceneElemId);
            currentSceneLoc = nextSceneLoc;
            console.log("current "+currentSceneLoc);
            movieGifs[currentSceneLoc].play();
        };

        // For gif in gif movie create a canvas for every gif
        // load all the canvas but hide everything but the first one
        for (let i=0; i< scenes.length; i++){
            //Add the scenes id
            sceneTitleArrayLoc[scenes[i].id] = i;
            //Set the starting scene according to whats in the screen play.
            try{
                if(scenes[i].starting_scene === true){
                    currentSceneLoc = i;
                }
            }catch (e) {
                continue
            }
            // Create an element inside the GifTheaterScreen
            var newId = newScene(defaultScreenClass, screenId, scenes[i], i);

            // The element will be whats passed in allowing someone to have multiple screens

            // Make it a SuperGif
            movieGifs[i] =  new SuperGif({  gif: document.getElementById(newId), on_end: playNext, max_width: window.innerWidth/1.5});

        }


        return {
            // play controls
            GetCurrentScene : function () {},
            Pause: function(){movieGifs[currentSceneLoc].pause()},
            Start: movieGifs[currentSceneLoc].play,
            nextScene : function () {},
            //startSceneOver : movieGifs[currentSceneLoc].move_to(0),
            previouseScene : function () {},
            // getters for instance vars
            LoadMovie: function (finishedLoadingCallback = function () {
                console.log("Finished loading gif movie");
                RandomFadeout();
                movieGifs[currentSceneLoc].play();
            }) {
                let loadCount = 0;
                for (let i = 0; i < movieGifs.length; i++) {
                    // Load the SuperGif
                    movieGifs[i].load(function () {
                        loadCount += 1;
                        if (loadCount === movieGifs.length) {
                            //call Finished Loading callback
                            finishedLoadingCallback()
                        }
                    })
                }
            },

        };
    };

    return GifTheater;
}));