/* @odoo-module**/
const {Component,xml,mount,setup,useState} =owl;

let audio = '';

class Player extends Component{
    static template = xml`
    <div style="position:absolute;bottom: 0px">
        <h2 id="song-title">Song Title</h2>
        <div>
            <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
            <button id="play-btn" t-on-click="playThisSong">Play</button>
            <button id="stop-button" t-on-click="stopThisSong">Stop</button>
        </div>
    </div>
    `;

    playThisSong(){
        if(!audio){
            return;
        }
        audio.play();
    }
    pauseThisSong(){
        if(!audio){
            return;
        }
        audio.pause();
    }
    stopThisSong(){
        if(!audio){
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    }
}

class Playlist extends Component{
    static template = xml`
    <div style="float:right; margin-top: 100px;">
        <t t-if="props.playlist">
        <h2>Playlist</h2>
        <t t-foreach="props.playlist" t-as="song" t-key="song.id">
            <p><t t-out="song.name"/></p>
            <button t-att-value="song.url" t-on-click="removeSongFromPlaylist">Remove song</button>
            <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
        </t>
        </t>
    </div>
    `;

    removeSongFromPlaylist(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedUrl = ev.target.value;
        console.log(selectedUrl)
        const selectedVoice = this.props.playlist.findIndex(song => song.url === selectedUrl);
        console.log(selectedVoice)
        this.props.playlist.splice(selectedVoice, 1)
        console.log(ev.target.value)
    }

    playSong(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedAudioUrl = ev.target.getAttribute('value');
        const selectedAudio = this.props.playlist.find(song => song.url === selectedAudioUrl);
        document.getElementById('song-title').textContent = selectedAudio.name;
        audio = new Audio(selectedAudioUrl);
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }
    
    static props = ['playlist'];
}

class Musiclist extends Component{
    static template = xml`
    <div id="MusicList" style="float:left; margin-top: 100px;">
        <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
        <h2>List of Songs</h2>
            <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
                <p><t t-out="song.name"/></p>
                <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
                <button t-att-value="song.url" t-on-click="playSong">Play song</button>
            </t>
        </t>
        <Player />
        </div>
        <Playlist playlist="playlist"/>
        `;

    setup(){
        this.playlist = useState([])
    }

    addSongToPlaylist(ev){
        const selectedMusicUrl = ev.target.getAttribute('value');
        const selectedMusic = this.props.searchData[0].find(song => song.url === selectedMusicUrl);
        if (this.playlist.includes(selectedMusic)) {
            return;
        }
        // console.log(selectedMusic)
        this.playlist.push(selectedMusic)
    } 

    playSong(ev){
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }

    static props = ['searchData'];
    static components = { Player, Playlist };
}

class Search extends Component{
    static template = xml`
    <div style="border:1px,solid,black; text-align:center">
        <input type="text" id="searchSong" placeholder="Search a music" value="Freedom" style="font-size='1.3rem'"/>
        <button t-on-click="getMusic" id="SearchButton">Search</button>
        <Musiclist searchData="searchData"/>
    </div>
    `;

    setup(){
        this.searchData=useState([])
    }

    async getMusic(){
        const findSong=document.getElementById("searchSong").value;
        const response= await fetch(`/music/search?song_name=${findSong}`) ;
        const {result:newData}=await response.json();
        this.searchData.push(newData);
        console.log(newData);
    }

    static components = { Musiclist }
}

class Root extends Component{
    static template=xml `
    <div>
    <Search />
    </div>
    `;

    static components={ Search };
}

window.onload= function(){
    mount(Root,document.body)
};