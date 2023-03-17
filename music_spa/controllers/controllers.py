# -*- coding: utf-8 -*-
import json
from odoo import http
from odoo.http import Response
from odoo.modules.module import get_module_resource

class MusicSpa(http.Controller):
    @http.route('/music', auth='public')
    def index(self, **kw):
        return http.request.render('music_spa.music_template')
    
    @http.route('/music/search/', type="http", auth="public", methods=['GET'])
    def search(self, **kw):
        searchSong = kw.get('song_name')
        
        print(searchSong)
        songlist = http.request.env['music.player'].search_read([('name','ilike',searchSong)])
        print("----------------")
        print(songlist)
        songs = [self._get_song_data(song) for song in songlist]
        print(songs)
        if not songs:
            songs = "Song not found"

        return Response(json.dumps({'result' : songs}), content_type="application/json")
    
    def _get_song_data(self, song):
        fields_list = ['id', 'name', 'filename', 'url']
        song_values = dict((i, song[i]) for i in fields_list)
        return song_values

    @http.route('/music/<model("music.player"):music>', type="http" ,auth='public')
    def load(self, music, **kw):
        music_file_path = get_module_resource('music_spa', 'static/songs', music.filename)
        #rb - read binanry
        file = open(music_file_path, 'rb').read()
        return file