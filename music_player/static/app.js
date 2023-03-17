
const{Component,xml,mount,useState}=owl;

let audio='';
class PlayList extends Component{
    static template=xml`
    <div style="position:absolute;right:0px;top:0px;">
    <p id="playlist">PLAYLIST</p>
    <t t-foreach="props.selectedPlaylist" t-as="song" t-key="song.id">
    <p><t t-out="song.name"/></p>
    <button t-att-value="song.url" t-on-click="removeSong">Remove from Playlist</button>
    <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
    

    </t>
    
    </div>`;
    removeSong(ev){
            const selectedSongUrl = ev.target.getAttribute('value');
            const selectedSong = this.props.selectedPlaylist.findIndex(song => song.url===selectedSongUrl);
            this.props.selectedPlaylist.splice(selectedSong,1);
        
    

    }
    playSong(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.selectedPlaylist.find(song => song.url===selectedSongUrl);
        document.getElementById("song_title").textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }
    static props=["selectedPlaylist"]
}
class Player extends Component{
    static template=xml`
    <div style="position:absolute;bottom:0px">
       <h2 id="song_title">Song Title</h2>
       <div>
         <button id="pause_button" t-on-click="pauseThisSong">Pause</button>
         <button id="play_button" t-on-click="playThisSong">Play</button>
         <button id="stop_button" t-on-click="stopThisSong">Stop</button>


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
        audio.pause()
    }
    stopThisSong(){
        if(!audio){
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    }
}

class MusicList extends Component{
    static template=xml`
    <div style="float:left;">
    <t t-if="props.searchData[0] and props.searchData[0] !== 'Song Not Found'">
    <h2>List of Songs</h2>
    <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
      <p><t t-out="song.name"/></p>
      <button t-att-value="song.url" t-on-click="addSongToPlayList">Add to Playlist</button>
      <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
    </t>
    </t>
    <Player />
    <PlayList selectedPlaylist="selectedPlaylist"/>
    </div>
    `;
    setup(){
        this.selectedPlaylist=useState([]);
    }

    addSongToPlayList(ev){
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song=> song.url === selectedSongUrl)
        console.log(selectedSong)
        document.getElementById('playlist').textContent = selectedSong.name;
        this.selectedPlaylist.push(selectedSong)

    }
    playSong(ev){
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song=> song.url === selectedSongUrl)
        document.getElementById('song_title').textContent = selectedSong.name;
        audio= new Audio(selectedSongUrl);
        audio.play()  
    }

    static props=["searchData"];
    static components={Player,PlayList};
}

class Search extends Component{
    static template=xml`
    <div style="text-align:center;">
        <input type="text" id="searchsong" placeholder="music search" value="Freedom"/>
        <button t-on-click="getMusic" id="searchButton">search</button>
        <MusicList searchData="searchData"/>
    </div>
    `;
    setup(){
        this.searchData=useState([]);
    }
    async getMusic(){
        const findSong=document.getElementById("searchsong").value;
        const response=await fetch(`/music/search?song_name=${findSong}`);
        const {result: newData}=await response.json();
        this.searchData.push(newData);
    }
    static components={MusicList};
}

class Root extends Component{
    static template=xml`
    <div> I am root
    <Search/>
    </div>
    `;
    static components={Search};
}
window.onload=function(){
    mount(Root,document.body);
}
