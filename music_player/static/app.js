/**  @odoo-module **/ 

const { Component,xml,mount,useState,setup } = owl;

let audio = '';
// let playlistAudio = '';

class Player extends Component {
    static template = xml`
        <div style="position:absolute;bottom:0px; margin-left:2rem">
            <h2 id="song-title">Song Title</h2>
            <div>
                <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
                <button id="play-button" t-on-click="playThisSong">Play</button>
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
        audio.currentTime=0;
    }
}

class PlayList extends Component{

    static template = xml`

    <div id="PlayList" style="float:right; margin-right:5rem">
        <t t-if="props.addedSong" >
        <h2> PlayList </h2>
            <t t-foreach="props.addedSong" t-as="song" t-key="song.id">

                <p><t t-out="song.name"/></p>
                <div>
                    <button id="play-btn" t-att-value="song.url" t-on-click = "playSong">Play</button>
                    <button id="remove-btn" t-att-value="song.url" t-on-click = "removeSong">Remove</button> 
                </div>
            </t>
        </t>
    </div>
    `;
    removeSong(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedUrl = ev.target.value;
        console.log(selectedUrl)
        const selectedVoice = this.props.addedSong.findIndex(song => song.url === selectedUrl);
        console.log(selectedVoice)
        this.props.addedSong.splice(selectedVoice, 1)
        console.log(ev.target.value)
    }

    playSong(ev){


        if(audio)
        {
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedAudioUrl = ev.target.getAttribute('value');
        const selectedAudio = this.props.addedSong.find(song => song.url === selectedAudioUrl);
        document.getElementById('song-title').textContent = selectedAudio.name;
        console.log("dhsbdfj");

        audio = new Audio(selectedAudioUrl);
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    static props = ['addedSong'];
    
}

class MusicList extends Component {

    static template = xml`
    <div id="MusicList" style="float:left">
        <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
        <h2>List of Songs</h2>
        <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
            <p><t t-out="song.name"/></p>
            <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
            <button t-att-value="song.url" t-on-click="playSong">Play song</button>
        </t>
        </t>
        <Player/>
    </div> 
    <PlayList addedSong = "addedSong"/>`;

    playSong(ev){

        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song=>song.url === selectedSongUrl);
        document.getElementById("song-title").textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }

    addSongToPlaylist(ev)
    {
        const addedSongUrl = ev.target.getAttribute('value');
        const songData = this.props.searchData[0].find(song=>song.url === addedSongUrl);
        console.log(songData);
        console.log(this.addedSong);

        if(this.addedSong.includes(songData))
        {
            return;
        }
        else{
        this.addedSong.push(songData);
            
        }
    }

    setup()
    {
        this.addedSong = useState([]);

    }

    static props = ['searchData'];
    static components = {Player,PlayList};
}

class Search extends Component {

    static template = xml`
    <div style="border:1px,solid,black; text-align:center">
        <input type="text" id ="searchSong" placeholder="Search a music" value="Freedom" />
        <button t-on-click = "getMusic" id="SearchButton">Search</button>
        <MusicList searchData="SearchData"/>
    </div>
    `;

    setup()
    {
        this.SearchData = useState([]);
    }

    async getMusic(){
        const findSong = document.getElementById('searchSong').value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData} = await response.json();
        console.log(newData);

        this.SearchData.push(newData);
        console.log(this.SearchData)
    }

    static components = {MusicList};
}


class Root extends Component{
    
    static template = xml`
    <div></div>
    <Search/>
    `;

    static components = {Search};
}

window.onload = function(){
mount(Root,document.body);
}