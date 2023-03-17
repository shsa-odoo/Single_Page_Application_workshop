const{Component,xml,mount,useState}=owl;

let audio=''

class Player extends Component{
    static template=xml`
    <div style="position:absolute;bottom:0px">
        <h2 id="song_title">song title</h2>
        <div>
            <button id="pause_button" t-on-click="pauseThisSong">pause</button> 
            <button id="play_btn" t-on-click="playThisSong">play</button>
            <button id="stop_button" t-on-click="stopThisSong">stop</button>
        </div>
    </div>`;
    playThisSong() {
        if (!audio) {
            return;
        }
        audio.play();
        }
    pauseThisSong() {
        if (!audio) {
            return;
        }
        audio.pause();
        }
    stopThisSong() {
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
        }
    
}
class PlayList extends Component {
    static template = xml`
    <div id="PlayList" style="float:right">
        <h2>Playlist</h2>
        <t t-if="props.playData[0]">     
            <t t-foreach="props.playData" t-as="song" t-key="song.id">
                <p><t t-out="song.name"/></p>
                <button t-att-value="song.url" t-on-click="removeSongFromPlayList">Remove from playlist</button>
                <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
            </t>
        </t>
    </div>
    `;

    removeSongFromPlayList(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.playData.findIndex(song => song.url===selectedSongUrl);
        this.props.playData.splice(selectedSong,1);
    }

    playSong(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.playData.find(song => song.url===selectedSongUrl);
        document.getElementById("song_title").textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }
}
class MusicList extends Component{
    static template=xml`
    <div style="float:left">
        <t t-if="props.searchData[0] and props.searchData[0] !== 'Song Not Found'">
            <h2>list of song</h2>
            <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
                <p><t t-out="song.name"/></p>
                <button t-att-value="song.url" t-on-click="addSongToPlaylist">add to playlist</button>
                <button t-att-value="song.url" t-on-click="playSong">playsong</button>
            </t>
        </t>
        <Player />
    </div>
    `;
    addSongToPlaylist(ev){
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song => song.url===selectedSongUrl);
        this.props.addToPlayList(selectedSong);

    }
    playSong(ev){
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song=> song.url === selectedSongUrl)
        document.getElementById('song_title').textContent = selectedSong.name;
        audio= new Audio(selectedSongUrl);
        audio.play()
    }
    static props=["searchData"];
    static components={Player};
}

class Search extends Component{
    static template=xml`
    <div style="text-align:center;">
        <input type="text" id="searchsong" placeholder="music search" value="Freedom"/>
        <button t-on-click="getMusic" id="searchButton">search</button>
        <MusicList searchData="searchData" addToPlayList="props.addToPlayList" playData="props.playData"/>
    </div>
    `;
    setup(){
        this.searchData=useState([]);
    }
    async getMusic(){
        const findSong=document.getElementById("searchsong").value;
        console.log(findSong);
        const response=await fetch(`/music/search?song_name=${findSong}`);
        console.log(response);
        const {result: newData}=await response.json();
        console.log(newData)
        this.searchData.push(newData);
    }
    static components={MusicList};
}

class Root extends Component{
    static template=xml`
    <div>
        <Search addToPlayList="this.addToPlayList" playData="playData"/>
        <PlayList playData="playData"/>
    </div>
    
    
    `;
    setup() {
        this.playData = useState([]);
    }

    addToPlayList(song) {
        this.playData.push(song);
    }
    static components={Search,PlayList};
}

window.onload=function(){
    mount(Root,document.body);
};