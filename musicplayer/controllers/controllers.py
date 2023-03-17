# -*- coding: utf-8 -*-
import json

from odoo.http import Response
from odoo import http
from odoo.modules.module import get_module_resource

class Musicplayer(http.Controller):
    @http.route('/music', auth='public')
    def index(self, **kw):
        return http.request.render('musicplayer.music_template')

    @http.route('/music/search', auth='public')
    def search(self, **kw):
        song_name = kw.get('song_name')
        musics = http.request.env['musicplayer.musicplayer'].search_read([('name','ilike',song_name)],fields={'name','url'})
        if not musics:
            musics = "Song not Found"

        return Response(json.dumps({'result':musics}), content_type='application/json')
#     @http.route('/musicplayer/musicplayer/objects/<model("musicplayer.musicplayer"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('musicplayer.object', {
#             'object': obj
#         })
    # @http.route('/music/fetch', type='http', auth='public', methods=['GET'])
    # def find(self, **kw):
    #     album = kw.get('album_name')
    #     albums = http.request.env['music.album'].search_read([('name', 'ilike', album)], fields=['name', 'player_ids'])
    #     player_ids = [player_id for album in albums for player_id in album['player_ids']]
    #     musics = http.request.env['music.player'].search_read([('id', 'in', player_ids)],fields={"name", "url"})
    #     print(musics)

    #     if not albums:
    #         albums = "Album not Found"

    #     return Response(json.dumps({'result': musics}), content_type='application/json')
    @http.route('/music/<model("musicplayer.musicplayer"):music>', type="http", auth='public')
    def load(self, music, **kw):
            music_file_path = get_module_resource('musicplayer', 'static/songs', music.filename)
            file = open(music_file_path, 'rb').read()
            return file