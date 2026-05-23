console.log("lets write js")
let currentsong = new Audio();
let songs;
let currfolder;

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

async function getsongs(folder) {
    currfolder = folder;
// Fetch the manifest instead of directory listing
    let response = await fetch(`/songs-manifest.json`);
    let manifest = await response.json();
    
    // Get songs for the specific folder
    songs = manifest[folder.split('/').pop()] || [];
    
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    console.log(response)//response
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].trim())
        }
    }


    //shows all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = " "
    // songul.innerHTML="";//clear first
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
   
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                               
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="">
                            </div>
                    

    </li>`;


    }

    //attach the event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", Element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    // console.log(songs)
    return songs
}

const playmusic = (track, pause = false) => {
    // let audio =new Audio("/song/"+track)
    currentsong.src = `/${currfolder}/` + track.trim();
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg"
    }
    // currentsong.play();

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayalbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    console.log(response)//response
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")

    let cardcontainer = document.querySelector(".cardcontainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let parts = e.href.split("/").filter(Boolean);

            let last = parts.pop();

            if (last && last !== "songs" && !last.includes(".")) {
                console.log(last);
                //get the metadata of the last
                let a = await fetch(`/songs/${last}/info.json`)
                let response = await a.json();
                console.log(response)
                cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${last}" class="card">

                        <img src="/songs/${last}/cover.jpg" alt="">
                        <div class="play">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                                <path d="M5 3L19 12L5 21V3Z" />
                            </svg>
                        </div>

                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
            }
        }
    }
        //load the playlist when card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            console.log(e)
            e.addEventListener("click", async item => {
                console.log(item.target, item.currentTarget.dataset)
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                playmusic(songs[0])
            })
        })

        // Array.from(anchors).forEach(e=>{
        //     // console.log(e.href)

        //     if(e.href.includes("/songs")){
        //         console.log(e.href.split("/").slice(-1)[0])
        //     }
        // })
        console.log(anchors)
    }

    async function main() {


        //get the list of all songs
        await getsongs("songs/Darshan_Raval")
        // console.log(songs)
        playmusic(songs[0], true)
        //play the first song

        //dispay all the albums on the page
        displayalbums()

        //attach an event listner to play,next and previous
        play.addEventListener("click", () => {
            if (currentsong.paused) {
                currentsong.play()
                play.src = "img/pause.svg"

            }
            else {
                currentsong.pause()
                play.src = "img/play.svg"
            }
        })
        //listnet for time update event
        currentsong.addEventListener("timeupdate", () => {
            console.log(currentsong.currentTime, currentsong.duration);
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        })
        //add an eventlistner to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration) * percent) / 100
        })
        //add an event listner for hamburger
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = 0;
        })
        //add an event listner for close
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";
        })
        //add an event listner to previous 
        document.querySelector("#previous").addEventListener("click", () => {
            console.log("previos click")
            console.log(currentsong);
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            if ((index - 1) >= 0) {
                playmusic(songs[index - 1])
            }
        })
        //add an event listner to  next
        document.querySelector("#next").addEventListener("click", () => {
            console.log("next click")
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }
        })

        //add an event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log("setting volume to", e.target.value, "/100")
            currentsong.volume = parseInt(e.target.value) / 100
            if (currentsong.volume > 0) {
                document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            }
            else {
                document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg")
            }
        })

        //add event listner to the mute the track
        document.querySelector(".volume>img").addEventListener("click", e => {
            console.log(e.target)
            if (e.target.src.includes("volume.svg")) {
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
                currentsong.volume = 0;
            }
            else {
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
                currentsong.volume = .10;
            }
        })


        // Get modal elements
        const modal = document.getElementById("loginModal");
        const loginBtn = document.querySelector(".Loginbtn");
        const signupBtn = document.querySelector(".Signupbtn");
        const closeBtn = document.querySelector(".close-modal");

        // Show modal when Login button is clicked
        loginBtn.addEventListener("click", () => {
            modal.style.display = "block";
        });

        // Show modal when Signup button is clicked
        signupBtn.addEventListener("click", () => {
            modal.style.display = "block";
        });

        // Hide modal when (x) is clicked
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Hide modal if user clicks anywhere outside of the modal box
        window.addEventListener("click", (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
        const modalTitle = document.querySelector(".modal-header h2");
        const modalBtn = document.querySelector(".modal-login-btn");
        const modellog = document.querySelector(".modal-footer");

        loginBtn.addEventListener("click", () => {
            modal.style.display = "block";
            modalTitle.innerHTML = "Log in to Spotify";
            modalBtn.innerHTML = "Log In";
        });

        signupBtn.addEventListener("click", () => {
            modal.style.display = "block";
            modalTitle.innerHTML = "Sign up for Spotify";
            modalBtn.innerHTML = "Sign Up";
            // modellog.innerHTML="";
            // modellog.style.display="none";
            if (signupBtn) {
                modellog.style.display = "none";
            }
        });

        const loginForm = document.querySelector(".login-form");

        // 1. Move showToast outside so it's a "global" tool
        function showToast(message) {
            const toast = document.getElementById("toast");
            toast.innerText = message; // Set the message dynamically
            toast.className = "toast show";

            setTimeout(() => {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }

        // 2. Updated Login/Signup Form Logic
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailValue = document.querySelector('input[type="email"]').value;
            const passwordValue = document.querySelector('input[type="password"]').value;

            // Basic Validation Check
            if (emailValue.includes("@") && passwordValue.length >= 6) {

                // Check if we are currently in "Login" mode or "Signup" mode
                if (modalBtn.innerHTML === "Log In") {
                    showToast("Welcome Back! Logged In Successfully.");
                    loginBtn.innerHTML = "Log Out";
                    loginBtn.style.width = "85px";
                } else {
                    showToast("Account Created! You can now Log In.");
                    // Optional: reset button to Login after signup
                    modalTitle.innerHTML = "Log in to Spotify";
                    modalBtn.innerHTML = "Log In";
                }

                // Close the modal
                modal.style.display = "none";

            } else {
                // Instead of a bad-looking alert, use your toast for errors too!
                showToast("Invalid email or password (min 6 chars)");
                const toast = document.getElementById("toast");
                toast.style.backgroundColor = "#e91e63"; // Turn it red for errors
            }
        });



    }


    main()
