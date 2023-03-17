
const { Component, xml, mount, useState,useEffect, setup } = owl;
let audio = '';


class SongItems extends Component {
    static template = xml`
    <div style="float:right;margin-right:2%">
        <table>
            <t t-if="props.songitems[0]">
            <h1>Playlist</h1>
            <hr/>
                <t t-foreach="props.songitems" t-as="song" t-key="song.id">
                    <tr>
                        <td>
                            <div>
                                <p id="song_name"><t t-out="song.name"/></p>
                                <button  t-on-click="removeSongFromList" id="listadded" t-att-value="song.url">Remove</button>
                                <button  t-att-value="song.url" t-on-click="playThisSong">Play song</button>
                            </div>
                        </td>
                    </tr>
                </t>
            </t>
        </table>
    </div>
    `;

    removeSongFromList(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedIndex = this.props.songitems.findIndex(song => song.url === selectedSongUrl);
        if (selectedIndex !== -1) {
            this.props.songitems.splice(selectedIndex, 1);
        }
        }

    playThisSong(ev) {  
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.songitems.find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    static props = ['songitems']
}

class PlayList extends Component {
    static template = xml`
    <div id="MusicList">
        <SongItems songitems="props.playlist"/>
    </div>
    `;

    static props = ['playlist'];
    static components = { SongItems };
}

class Player extends Component {
    static template = xml`
    <div style="Position:absolute;bottom:10px;width:100%;text-align:center">
        <h2 id="song-title">Song Title</h2>
        <div id="player-controls">
            <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
            <button id="play_btn" t-on-click="playThisSong">Play</button>
            <button id="stop-button" t-on-click="stopThisSong">Stop</button>
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


class MusicList extends Component {
    static template = xml`
    <div id="MusicList" style="width:40%;float:left;margin-left:2%;">
    <table>  
        <t t-if="props.musicdata[0]">          
            <t t-if="props.musicdata[0] !== 'Song not Found'">
                <h1 style="text-align:center">Song List</h1>
                <hr/>
                <t t-foreach="props.musicdata[0]" t-as="song" t-key="song.id">
                
                    <p><t t-out="song.name"/></p>
                    <button  t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
                    <button  t-att-value="song.url" t-on-click="playSong">Play song</button>                
                </t>
            </t>
        </t>
        <Player/>
        </table>
    </div>
    `;

    
    addSongToPlaylist(ev) {
        let musicInfo = this.props.musicdata[0];
        console.log(musicInfo)
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = musicInfo.find(song => song.url === selectedSongUrl);
        this.props.updateAddToPlayList(selectedSong); 
    }

    playSong(ev) {
        let musicInfo =  this.props.musicdata[0];
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = musicInfo.find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        audio.play();
    }

    static props = ['musicdata', 'updateAddToPlayList'];

    static components = { Player };
    }

class Search extends Component {
    static template = xml`
    <div>
        <div style="border:1px,solid,black;text-align:center">
            <input type="text" id="searchSong" placeholder="Search a music" value="Akon"/>
            <button t-on-click="getMusic" id="SearchButton">Search</button>
        </div>
        <MusicList musicdata="searchData"  updateAddToPlayList="props.updateAddToPlayList"/>
    </div>
    `;
    setup() {
        this.searchData = useState([]);
        
    }

    async getMusic() {
        const findSong = document.getElementById('searchSong').value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData}= await response.json();
        this.searchData.pop();
        this.searchData.push(newData);
    }



    static components = { MusicList }

    static props = ['updateAddToPlayList'];
}

class Root extends Component {

    static template = xml `
    <link rel="stylesheet" href="/music_player/static/style.css"></link>
    <div id="Container" style="position:relative;height:100%">
        <div>  
        <Search updateAddToPlayList="this.updateAddToPlayList"/>
        </div>
        <PlayList playlist="addToPlaylist"/>
        
    </div>`;
    
    setup(){
        this.addToPlaylist = useState([]);
    }

    updateAddToPlayList = (newData) => {
        this.addToPlaylist.push(newData);
    }

    static components = { Search, PlayList };
}

window.onload = function() {
  mount(Root, document.body);
};

