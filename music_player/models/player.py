# -*- coding: utf-8 -*-

from odoo import models, fields, api


class music_player(models.Model):
    _name = 'music_player.music_player'
    _description = 'music_player.music_player'

    name = fields.Char(string='Song Name')
    filename = fields.Char(string='File Name')
    url = fields.Char(compute='_compute_url')

    # @api.depends('')
    def _compute_url(self):
        for record in self:
            record.url = record.get_base_url() + '/music/' + str(record.id)
