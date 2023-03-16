# -*- coding: utf-8 -*-

from odoo import models, fields, api


class Player(models.Model):
    _name = 'music_player.player'
    _description = 'Music Player'

    name = fields.Char("Song Name")
    filename = fields.Char("File Name")
    url = fields.Char(compute="_compute_url")
    
    def _compute_url(self):
        for record in self:
            record.url = record.get_base_url() + '/music/' + str(record.id)