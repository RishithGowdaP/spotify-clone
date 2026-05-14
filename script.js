const songs = [
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248497/To_The_End_Of_The_World_-_National_Sweetheart_abehls.mp3', title: 'To The End Of The World', artist: 'National Sweetheart', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248496/Working_-_Cory_Barker_feat._Jordan_King_jpckt5.mp3', title: 'Working', artist: 'Cory Barker feat. Jordan King', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248495/Chase_The_Sun_-_Bel_Tempo_dq8g02.mp3', title: 'Chase The Sun', artist: 'Bel Tempo', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248493/iSongs.info_02_-_Jagave_Neenu_Gelathiye_Cover_Version_rzbj7d.mp3', title: 'Jagave Neenu Gelathiye (Cover)', artist: 'iSongs', album: 'Covers', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248492/Taught_Her_How_To_Leave_-_Bill_Douglas_dyqa4x.mp3', title: 'Taught Her How To Leave', artist: 'Bill Douglas', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248491/Turn_In_The_Sun_-_Simon_Herody_nwq9an.mp3', title: 'Turn In The Sun', artist: 'Simon Herody', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248491/iSongs.info_02_-_Jai_Sriram_fadt0p.mp3', title: 'Jai Sriram', artist: 'iSongs', album: 'Devotional', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248487/iSongs.info_02_-_Kone_Irada_Preethi_pzqmyf.mp3', title: 'Kone Irada Preethi', artist: 'iSongs', album: 'Hits', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248486/The_Fog_-_Trey_Xavier_Rod_Kim_vzbarm.mp3', title: 'The Fog', artist: 'Trey Xavier & Rod Kim', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1483000805330-4eaf0a0d8c2c?w=150&auto=format&fit=crop&q=60' },
    { url: 'https://res.cloudinary.com/deoowle6h/video/upload/v1778248483/Tonight_Again_-_Rod_Kim_feat._Mostly_Moss_lnzfd3.mp3', title: 'Tonight Again', artist: 'Rod Kim feat. Mostly Moss', album: 'Single', date: 'May 10, 2026', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=60' },
];

// DOM Elements with Error Handling (Null Checks)
const getEl = (id) => document.getElementById(id);

const audioPlayer = getEl('audio-player');
const playPauseBtn = getEl('play-pause-btn');
const playIcon = getEl('play-icon');
const prevBtn = getEl('prev-btn');
const nextBtn = getEl('next-btn');

const nowPlayingCover = getEl('now-playing-cover');
const nowPlayingTitle = getEl('now-playing-title');
const nowPlayingArtist = getEl('now-playing-artist');

const currentTimeEl = getEl('current-time');
const totalTimeEl = getEl('total-time');
const progressWrapper = getEl('progress-wrapper');
const progressFill = getEl('progress-fill');
let progressHandle = null;
if (progressWrapper) progressHandle = progressWrapper.querySelector('.progress-handle');

const volumeWrapper = getEl('volume-wrapper');
const volumeFill = getEl('volume-fill');
const volumeIcon = getEl('volume-icon');

const songsListContainer = getEl('songs-list');
const playAllBtn = getEl('play-all-btn');
const mainPlayIcon = getEl('main-play-icon');
const searchInput = getEl('search-input');
const totalSongsCountEl = getEl('total-songs-count');

// State
let currentSongIndex = 0;
let isPlaying = false;
let visibleSongs = [...songs];

// Check critical elements before executing
if (!audioPlayer || !songsListContainer) {
    console.error("Critical elements missing. App cannot initialize.");
} else {
    initApp();
}

// Initialization function
function initApp() {
    loadSettings();
    renderSongs();
    loadSong(currentSongIndex, false);
    setupEventListeners();
    updateTotalCount(songs.length);
}

// Local Storage Management
function loadSettings() {
    const savedIndex = localStorage.getItem('spotifyClone_lastSongIndex');
    const savedVolume = localStorage.getItem('spotifyClone_volume');
    const savedTime = localStorage.getItem('spotifyClone_currentTime');

    if (savedIndex !== null && !isNaN(savedIndex)) {
        let idx = parseInt(savedIndex);
        if (idx >= 0 && idx < songs.length) {
            currentSongIndex = idx;
        }
    }
    
    if (savedVolume !== null && !isNaN(savedVolume)) {
        let vol = parseFloat(savedVolume);
        if (vol >= 0 && vol <= 1) {
            audioPlayer.volume = vol;
            updateVolumeUI(vol);
        }
    } else {
        audioPlayer.volume = 1;
        updateVolumeUI(1);
    }
    
    // Attempt to restore playback position once metadata is loaded
    if (savedTime !== null && !isNaN(savedTime)) {
        const timeToRestore = parseFloat(savedTime);
        const handleRestore = () => {
            if (audioPlayer.duration >= timeToRestore) {
                audioPlayer.currentTime = timeToRestore;
            }
            audioPlayer.removeEventListener('loadedmetadata', handleRestore);
        };
        audioPlayer.addEventListener('loadedmetadata', handleRestore);
    }
}

function saveSettings() {
    localStorage.setItem('spotifyClone_lastSongIndex', currentSongIndex);
    localStorage.setItem('spotifyClone_volume', audioPlayer.volume);
    localStorage.setItem('spotifyClone_currentTime', audioPlayer.currentTime);
}

// Rendering & UI
function renderSongs() {
    if (!songsListContainer) return;
    
    songsListContainer.innerHTML = '';
    songs.forEach((song, originalIndex) => {
        const row = document.createElement('div');
        row.className = `song-row`;
        row.dataset.index = originalIndex;
        
        row.innerHTML = `
            <div class="col-hash">
                <span class="number">${originalIndex + 1}</span>
                <i class="fas fa-play play-icon"></i>
            </div>
            <div class="col-title">
                <img src="${song.cover}" alt="${song.title}" class="song-cover" loading="lazy">
                <div class="song-info">
                    <span class="col-title-text">${song.title}</span>
                    <span class="col-artist">${song.artist}</span>
                </div>
            </div>
            <div class="col-album">${song.album}</div>
            <div class="col-date">${song.date}</div>
            <div class="col-duration">-:--</div>
        `;
        
        row.addEventListener('click', () => {
            if (currentSongIndex === originalIndex) {
                togglePlay();
            } else {
                loadSong(originalIndex, true);
            }
        });
        
        songsListContainer.appendChild(row);
        
        // Asynchronously load durations
        const tempAudio = new Audio(song.url);
        tempAudio.addEventListener('loadedmetadata', () => {
            const durationEl = row.querySelector('.col-duration');
            if (durationEl) durationEl.textContent = formatTime(tempAudio.duration);
        });
    });
    updateSongRowsUI();
}

function updateSongRowsUI() {
    if (!songsListContainer) return;
    const rows = songsListContainer.querySelectorAll('.song-row');
    
    rows.forEach((row) => {
        const idx = parseInt(row.dataset.index);
        const icon = row.querySelector('.play-icon');
        const number = row.querySelector('.number');
        
        if (idx === currentSongIndex) {
            row.classList.add('playing');
            if (icon) {
                icon.className = `fas ${isPlaying ? 'fa-pause' : 'fa-play'} play-icon`;
                icon.style.display = isPlaying ? 'block' : '';
                icon.style.color = isPlaying ? 'var(--essential-bright-accent)' : '';
            }
            if (number) number.style.display = isPlaying ? 'none' : '';
        } else {
            row.classList.remove('playing');
            if (icon) {
                icon.className = 'fas fa-play play-icon';
                icon.style.color = '';
                icon.style.display = '';
            }
            if (number) number.style.display = 'block';
        }
    });
    
    // Update main play button
    if (mainPlayIcon) {
        mainPlayIcon.className = `fas ${isPlaying ? 'fa-pause' : 'fa-play'}`;
    }
}

function updateTotalCount(count) {
    if (totalSongsCountEl) totalSongsCountEl.textContent = count;
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!songsListContainer) return;
    
    const rows = songsListContainer.querySelectorAll('.song-row');
    let count = 0;
    
    rows.forEach(row => {
        const idx = parseInt(row.dataset.index);
        const song = songs[idx];
        const match = song.title.toLowerCase().includes(query) || 
                      song.artist.toLowerCase().includes(query) || 
                      song.album.toLowerCase().includes(query);
        
        if (match) {
            row.classList.remove('hidden');
            count++;
        } else {
            row.classList.add('hidden');
        }
    });
    
    updateTotalCount(count);
}

// Audio Control
function loadSong(index, autoPlay = true) {
    if (index < 0 || index >= songs.length || !audioPlayer) return;
    
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    audioPlayer.src = song.url;
    if (nowPlayingCover) nowPlayingCover.src = song.cover;
    if (nowPlayingTitle) nowPlayingTitle.textContent = song.title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = song.artist;
    
    document.title = `${song.title} - ${song.artist} | Spotify Clone`;
    
    saveSettings();
    updateSongRowsUI();
    
    if (autoPlay) {
        playSong();
    } else {
        // Just load metadata to display total time
        audioPlayer.load();
    }
}

function playSong() {
    if (!audioPlayer) return;
    isPlaying = true;
    if (playIcon) playIcon.className = 'fas fa-pause';
    
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Auto-play was prevented. Waiting for user interaction.");
            isPlaying = false;
            if (playIcon) playIcon.className = 'fas fa-play';
            updateSongRowsUI();
        });
    }
    updateSongRowsUI();
}

function pauseSong() {
    if (!audioPlayer) return;
    isPlaying = false;
    if (playIcon) playIcon.className = 'fas fa-play';
    audioPlayer.pause();
    saveSettings();
    updateSongRowsUI();
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function prevSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
        newIndex = songs.length - 1;
    }
    loadSong(newIndex, true);
}

function nextSong() {
    let newIndex = currentSongIndex + 1;
    if (newIndex > songs.length - 1) {
        newIndex = 0;
    }
    loadSong(newIndex, true);
}

// Progress and Volume
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration) || !progressFill) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    if (progressHandle) progressHandle.style.left = `${progressPercent}%`;
    
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    
    // Save state periodically (throttle in real app, but fine here)
    if (Math.floor(currentTime) % 5 === 0) saveSettings();
}

function setProgress(e) {
    if (!audioPlayer) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (!isNaN(duration)) {
        audioPlayer.currentTime = (clickX / width) * duration;
        saveSettings();
    }
}

function updateVolumeUI(volumePercent) {
    if (volumeFill) volumeFill.style.width = `${volumePercent * 100}%`;
    if (volumeWrapper) {
        const handle = volumeWrapper.querySelector('.progress-handle');
        if (handle) handle.style.left = `${volumePercent * 100}%`;
    }
    
    if (volumeIcon) {
        if (volumePercent === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volumePercent < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
}

function setVolume(e) {
    if (!audioPlayer) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    let volumePercent = clickX / width;
    
    if (volumePercent < 0) volumePercent = 0;
    if (volumePercent > 1) volumePercent = 1;
    
    audioPlayer.volume = volumePercent;
    updateVolumeUI(volumePercent);
    saveSettings();
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Keyboard Shortcuts
function handleKeyboard(e) {
    // Ignore if typing in input
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    switch(e.code) {
        case 'Space':
            e.preventDefault(); // prevent scrolling
            togglePlay();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSong();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSong();
            break;
    }
}

// Setup Event Listeners Safely
// Setup Event Listeners Safely
function setupEventListeners() {
    // Attach media controls securely with null checks
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevSong);
    if (nextBtn) nextBtn.addEventListener('click', nextSong);
    
    // Attach audio events
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('loadedmetadata', (e) => {
            if (totalTimeEl) totalTimeEl.textContent = formatTime(e.target.duration);
        });
    }
    
    // Attach progress and volume bars securely
    if (progressWrapper) progressWrapper.addEventListener('click', setProgress);
    if (volumeWrapper) volumeWrapper.addEventListener('click', setVolume);
    
    // Play all logic
    if (playAllBtn) {
        playAllBtn.addEventListener('click', () => {
            if (currentSongIndex !== 0 || !isPlaying) {
                const firstVisible = Array.from(songsListContainer.querySelectorAll('.song-row:not(.hidden)'))[0];
                if (firstVisible) {
                    const idx = parseInt(firstVisible.dataset.index);
                    loadSong(idx, true);
                } else {
                    loadSong(0, true);
                }
            } else {
                pauseSong();
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', handleSearch);
    document.addEventListener('keydown', handleKeyboard);
    window.addEventListener('beforeunload', saveSettings);

    // Fix sidebar buttons so they visually respond when clicked
    const sidebarItems = document.querySelectorAll('.nav-item, .action-item');
    sidebarItems.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            // Add active class switching for sidebar items only
            sidebarItems.forEach(n => n.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}
