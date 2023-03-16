/* @odoo-module**/
const {Component,xml,mount,useState} =owl;

let audio=""

class Playlist extends Component{
    static template = xml`
    <div style="position:absolute;right:5px">
    <h2>Playlist</h2>
    <t t-if="props.playData">
    <div>
    <t t-foreach="props.playData" t-as="song" t-key="song.id">
    <p><t t-out="song.name"/></p>
    <button id="play-btn" t-on-click="playThisSong">Play</button>
    
    </t>
    </div>
    </t>
    </div>
    `;
    playThisSong() {
        if (!audio) {
            return;
        }
        console.log("p")
        audio.play();
    }

// }
//     static template=xml`<div id="Playlist" style="float:right">
//                 <t t-esc="props.playData"/>
//     </div>`;
    static props=['playData']
}
class Player extends Component{
    static template=xml`
    <div style="">
    <h2 id="song-title"></h2>
    <div>
    <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
    <button id="play-btn" t-on-click="playThisSong">Play</button>
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
class Musiclist extends Component{
    static template=xml`<Playlist playData="playData"/><div id="Musiclist" style="float:left">
    
    <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
    <h2>List of Songs</h2>
    <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
            <p><t t-out="song.name"/></p>
            <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
            <button t-att-value="song.url" t-on-click="playSong">Play song</button>
        </t>
        </t>
        <Player/>
    </div>`;

    playSong(ev){
        const selectedSongUrl=ev.target.getAttribute('value');
        const selectedSong=this.props.searchData[0].find(song=>song.url === selectedSongUrl);
        document.getElementById('song-title').textContent=selectedSong.name;
        audio=new Audio(selectedSongUrl);
        audio.play()
    }
    setup(){
        this.playData=useState([])
        
    }
    pl=""
    addSongToPlaylist(ev){
        // console.log("")
        const addedSongUrl=ev.target.getAttribute('value');
        const addedSong=this.props.searchData[0].find(song=>song.url === addedSongUrl);
        this.playData.push(addedSong);
        audio=new Audio(addedSongUrl);
        audio.play()
        // this.pl=selectedSong.name
        // console.log(this.pl)
    }
    static props=['searchData'];
    static components={Player,Playlist};

}
class Search extends Component{
    static template=xml`
    <div style="border:1px,solid,black; text-align:center">
    <input type="text" id="searchSong" placeholder="Search a music" value="akon" style="font-size='1.3rem'"/>
    <button t-on-click="getMusic" id="SearchButton">Search</button>
    </div>
    <Musiclist searchData="searchData"/>
    `
    setup(){
        this.searchData=useState([])
    }
    async getMusic(){
        const findSong=document.getElementById("searchSong").value;
        const response= await fetch(`/music/search?song_name=${findSong}`) ;

        const {result:newData}=await response.json();
        // console.log(newData[0].id)
        this.searchData.pop();
        this.searchData.push(newData);
        // console.log(this.searchData)
    }
    static components={Musiclist}
}
class Root extends Component{
    static template=xml `
    <div>
    <Search/>
    </div>
    `;
    static components={Search,Playlist};
}

window.onload= function(){
    mount(Root,document.body)

};