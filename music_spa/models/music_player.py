# -*- coding: utf-8 -*-

from odoo import models, fields, api


class MusicPlayer(models.Model):
    _name = 'music.player'
    _description = 'music_spa.music_spa'

    name = fields.Char("Song Name")
    filename = fields.Char("File Name")
    url = fields.Char(compute = "_compute_url")

    @api.depends('filename')
    def _compute_url(self):
        for record in self:
            record.url = record.get_base_url() + "/music/" + str(record.id)

#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
