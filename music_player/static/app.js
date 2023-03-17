/* @odoo-module**/
const {Component,xml,mount,useState} =owl;

let audio=""
class Player extends Component{
    static template=xml`
    <div style="position:absolute;left:45%;">
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
        // audio.pause();
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

class Playlist extends Component{
    static template = xml`
    <div style="position:absolute;right:5px">
    <t t-if="props.playData">
    <t t-if="props.playData[0] and props.playData[0] !== ''">
    <div>
    <h2>Playlist</h2>
    <t t-foreach="props.playData" t-as="song" t-key="song.id">
    <p><t t-out="song.name"/></p>
    <button t-att-value="song.url" id="play-btn" t-on-click="playSong">Play</button>
    <button t-att-value="song.url" id="rmv-btn" t-on-click="removeSongFromPlaylist">Remove</button>
    
    </t>
    </div>
    </t>
    </t>
    </div>
    `;
    // obj=new Musiclist()
    removeSongFromPlaylist(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedremoveUrl = ev.target.value;
        const selectedRemove = this.props.playData.find(song => song.url === selectedremoveUrl);

        console.log(selectedRemove)
        // const selectedremoveVoice = this.props.playData.findIndex(song => song.url === selectedremoveUrl);
        this.props.playData.splice(selectedRemove, 1)
    }

    playSong(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        const selectedAudioUrl = ev.target.value;
        console.log(selectedAudioUrl)
        const selectedAudio = this.props.playData.find(song => song.url === selectedAudioUrl);
        console.log(selectedAudio)
        document.getElementById('song-title').textContent = selectedAudio.name;
        audio = new Audio(selectedAudioUrl);
        // audio.pause();
        // audio.currentTime = 0;
        audio.play();

    }
// }
//     static template=xml`<div id="Playlist" style="float:right">
//                 <t t-esc="props.playData"/>
//     </div>`;
    static props=['playData']
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
    </div>`;

    playSong(ev){
        if(audio){
            audio.pause();
            audio.currentTime = 0;
        }
        console.log(this.playData)

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
        if (! this.playData.includes(addedSong)){
            // console.log(addedSong.name)
            this.playData.push(addedSong);
        }
        // audio=new Audio(addedSongUrl); 
       
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
    <Player/>
    `;
    static components={Search,Playlist,Player};
}

window.onload= function(){
    mount(Root,document.body)

};