console.log("js")
 let currentsong=new Audio();
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

const playmusic=(track)=>{
    // let audio =new Audio("/song/"+track)
    currentsong.src="/songs/"+track.trim();
    currentsong.play();
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main() {
   

    //get the list of all songs
    let songs = await getsongs()
    // console.log(songs)
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
    
})
}


main()
