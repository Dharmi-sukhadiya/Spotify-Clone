console.log("js")
 let currentsong=new Audio();

 function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds)) return "00:00";

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // add leading zero
    if (secs < 10) {
        secs = "0" + secs;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return `${minutes}:${secs}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1].trim())
        }
    }
    // console.log(songs)
    return songs;
}

const playmusic=(track,pause=false)=>{
    // let audio =new Audio("/song/"+track)
    currentsong.src="/songs/"+track.trim();
    if(!pause){
         currentsong.play();
         play.src="pause.svg"
    }
    // currentsong.play();
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main() {
   

    //get the list of all songs
    let songs = await getsongs()
    // console.log(songs)
    playmusic(songs[0],true)
//play the first song
//shows all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // songul.innerHTML="";//clear first
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
   
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>song artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                            <img class="invert" src="play.svg" alt="">
                            </div>
                    

    </li>`;


    }

 //attach the event listner to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",Element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    
})
//attach an event listner to play,next and previous
play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src="pause.svg"
        
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
})
//listnet for time update event
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration) * 100 + "%";
})
//add an eventlistner to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left= percent + "%";
    currentsong.currentTime=((currentsong.duration)*percent)/100
})
//add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = 0;
}) 
//add an event listner for close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%";
}) 
}


main()
