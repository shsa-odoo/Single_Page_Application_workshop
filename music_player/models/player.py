# -*- coding: utf-8 -*-

from odoo import models, fields, api


class music_player(models.Model):
    _name = 'music_player.music_player'
    _description = 'music_player.music_player'

    name = fields.Char()
    filename=fields.Char()
    url=fields.Char(compute="_compute_url")
    
    def _compute_url(self):
        for record in self:
            record.url=record.get_base_url()+"/music/"+str(record.id)

