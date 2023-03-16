/** @odoo-module**/

const{ Component , xml, mount,useState} = owl;
let audio=""
class Player extends Component{
    static template = xml`
    <div >
    <h2 id = "song-title">Song Title</h2>
    <div>
    <button id ="pause-button" t-on-click="pauseThisSong">Pause</button>
    <button id ="play-button" t-on-click="playThisSong">Play</button>
    <button id ="stop-button" t-on-click="stopThisSong">Stop</button>
    </div>
    </div>`;

    playThisSong() {
        if (!audio) {
          return;
        }
        audio.play();
      }
      pauseThisSong() {
        console.log("pause")
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
  <div id="PlayList" style="float: right">
    <SongItems songitems="props.playlist"/>
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

    static props = ['playlist'];
 
}
class MusicList extends Component{
    static template = xml`
    <div id ="MusicList" style="float:left">
    <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
    <h2>List of Songs</h2>
    <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
            <p><t t-out="song.name"/></p>
            <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
            <button t-att-value="song.url" t-on-click="playSong">Play song</button>
        </t>
    </t>
    </div>
    <Player/>
    </div>
    `;
  
    addSongToPlaylist(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song => song.url === selectedSongUrl);
        this.props.addToPlayList(selectedSong);
    }
    playSong(ev) {
    
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
  
        audio.play();
      }
    static props = ['searchData'];
    static components = {Player};
}
class Search extends Component{
    static template = xml`
        <div style="border: 1px, solid, black; text-align:center">
            <input type="text" id="searchSong" placeholder="Search a music"/>
            <button t-on-click="getMusic" id="SeachButton">Search</button>
            <MusicList searchData="searchData" addToPlayList="props.addToPlayList" playData="props.playData"/>
        </div>
    `;

    setup(){
        this.searchData = useState([]);
    
    }
    async getMusic(){
        const findSong = document.getElementById("searchSong").value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData} = await response.json();
        this.searchData.pop(newData)
    
        this.searchData.push(newData)
        
    }
    static components = {MusicList};
}

class Root extends Component{
    static template = xml`
    <div>
      <Search addToPlayList="this.addToPlayList" playData="playData"/>
      <PlayList playData="playData"/>
    </div>
    `;
    setup(){
        this.playData = useState([]);
    }
    addToPlayList(song){
      this.playData.push(song)
    }
    static components = {Search,PlayList};

}
window.onload = function()
{
    mount(Root, document.body)
};