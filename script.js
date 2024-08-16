
let currentsong = new Audio();
let songs;
let currfolder;
let b=0;
let vol=0.65;

//To play audio
const playaudio = (track, paused = false) => {
    //Get url of the currentsong
    currentsong.src = `./${currfolder}/` + track;
    if (!paused) {
        currentsong.play();
        play.src = "paused.svg";
    }
    //Display song name
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songduration").innerHTML = "00:00/00:00";
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

//To get songs from folder to songs array
async function getsongs(folder) {
    songs=[]
    folder=folder.replaceAll(" ","")
    currfolder=folder;
    console.log(folder)
    let f = await fetch(`/${folder}/`);
    console.log(`/${folder}/`)
    let b = await f.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a")
    console.log(as)
    // console.log(as);
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split(`/${currfolder}/`)[1])
        }
    }
    // console.log(songs)

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML="";
    // console.log(songs)
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + ` <li>
                            <div><div><img src="music.svg" alt=""></div>
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                            </div>

                            <div><span>PlayNow</span>
                                <span><img src="play.svg" alt=""></span>
                            </div>

                        </li>`
    }

     //Play audio if clicked
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songname").innerHTML)
            playaudio(e.querySelector(".songname").innerHTML)
        })
    })

   return songs; 

}

async function playlists(){
   
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
//            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playaudio(songs[0])

        })
    })
    // console.log("Fetching Songs")
    // http://127.0.0.1:3000/practice%20projects/spotify%20clone/songs/dailymix/
}


async function main() {
    
    //To display the songs from folder on to the screen 
    // await getsongs(`songs/${folder}`);
    // // console.log(songs)
    // playaudio(songs[0], true)
   await getsongs(`songs/daily mix`)
   playaudio(songs[0],true);
   await playlists();
  
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "paused.svg";
        }
        else {
            currentsong.pause();
            play.src = "play.svg";
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".ball").style.left = (currentsong.currentTime / currentsong.duration) * 100 - 1 + "%";
        if (currentsong.currentTime == currentsong.duration) {
            let index1 = songs.indexOf(currentsong.src.split("/")[currentsong.src.split("/").length - 1])
            if (index1 < songs.length - 1) {
                playaudio(songs[index1 + 1]);
            }
        }

    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".ball").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        vol=parseInt(e.target.value) / 100;
        currentsong.volume = vol;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = 8 + "px";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = -100 + "%";
    })

    document.querySelector(".previous").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/")[currentsong.src.split("/").length - 1])

        if (index > 0) {
            playaudio(songs[index - 1]);
        }
    })

    document.querySelector(".next").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/")[currentsong.src.split("/").length - 1])

        if (index < songs.length - 1) {
            playaudio(songs[index + 1]);
        }
    })

   sound.addEventListener("click",()=>{
    
    if(b==1){    
        sound.src="volume.svg";
        b=0;
        currentsong.volume=vol;
    }

    else{
        sound.src="mute.svg";
        b=1;
        currentsong.volume=0;
    }
   })


}
main();