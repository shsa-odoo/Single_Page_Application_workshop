# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request, Response
import json
from odoo.modules.module import get_module_resource


class MusicPlayer(http.Controller):
     @http.route('/music', auth='public')
     def index(self, **kw):
         return http.request.render('music_player.music_template')
     
     @http.route('/music/search', auth='public',type="http",methods=["GET"])
     def search(self,**kw):
        song_name=kw.get('song_name') 
        print(song_name)
        songs=request.env['music_player.music_player'].search_read([('name','ilike',song_name)],fields={"name","url"})
        print(songs)
        if not songs:
            songs='song not found'
    
        return Response(json.dumps({'result':songs}),content_type='application/json')
     
     @http.route('/music/<model("music_player.music_player"):music>', auth='public')
     def object(self, music, **kw):
        music_file_path=get_module_resource("music_player","static/songs",music.filename)
        file=open(music_file_path,'rb').read()
        return file
    
            
        






           
