console.log("js")
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
            songs.push(element.href)
        }
    }
    // console.log(songs)
    return songs;
}

async function main(){
    //get the list of all songs
let songs = await getsongs()
console.log(songs)
//play the first song

let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songul.innerHTML="";//clear first
for (const song of songs) {
    songul.innerHTML=songul.innerHTML+ `<li>${song}</li>`;
    
    
}

var audio = new Audio(songs[0]);
audio.play();

audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
  console.log(audio.duration,audio.currentSrc,audio.currentTime);
  // The duration variable now holds the duration (in seconds) of the audio clip1
});
}

main()
