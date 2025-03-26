console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterplay');
let myProgressBar = document.getElementById('myprogressbar');
let masterSongName = document.getElementById('mastersongname');
let songItems = Array.from(document.getElementsByClassName('songitem'));
let songItemPlays = Array.from(document.getElementsByClassName('songitemplay'));
let songPoster = document.querySelector('.song-poster');

let songs = [
    {songName: "Birds Of Feather", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Die With a Smile", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "Those Eyes", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Blue", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "I Wanna be Yours", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "This Town", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Thinking Out Loud", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "My Love Mine All Mine", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Can't Help Falling in Love", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    {songName: "Thousand Years", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"},
];

// Update song list UI
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songname")[0].innerText = songs[i].songName;
});

// Function to reset all play buttons
const makeAllPlays = () => {
    songItemPlays.forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

// Update play buttons state and song poster
const updatePlayState = (isPlaying) => {
    if (isPlaying) {
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        songItemPlays[songIndex]?.classList.remove('fa-circle-play');
        songItemPlays[songIndex]?.classList.add('fa-circle-pause');
    } else {
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        songItemPlays[songIndex]?.classList.remove('fa-circle-pause');
        songItemPlays[songIndex]?.classList.add('fa-circle-play');
    }
    
    // Update song poster
    songPoster.src = songs[songIndex].coverPath;
};

// Handle master play button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play()
            .then(() => updatePlayState(true))
            .catch(error => console.error("Playback failed:", error));
    } else {
        audioElement.pause();
        updatePlayState(false);
    }
});

// Play song from song list
songItemPlays.forEach((element, i) => {
    element.addEventListener('click', () => {
        makeAllPlays();
        
        if (songIndex === i && !audioElement.paused) {
            audioElement.pause();
            updatePlayState(false);
        } else {
            songIndex = i;
            updateSongUI();
        }
    });
});

// Next & Previous Buttons
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    updateSongUI();
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    updateSongUI();
});

// Update UI when song changes
const updateSongUI = () => {
    makeAllPlays();
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play()
        .then(() => updatePlayState(true))
        .catch(error => console.error("Playback failed:", error));
};

// Progress Bar Update
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        myProgressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
    }
});

// Seekbar change event
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// When song ends, play next
audioElement.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    updateSongUI();
});

// Sync buttons with audio state
audioElement.addEventListener('play', () => updatePlayState(true));
audioElement.addEventListener('pause', () => updatePlayState(false));

// Initial setup
masterSongName.innerText = songs[songIndex].songName;
songPoster.src = songs[songIndex].coverPath;