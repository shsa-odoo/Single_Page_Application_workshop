# -*- coding: utf-8 -*-

from odoo import models, fields, api


class musicplayer(models.Model):
    _name = 'musicplayer.musicplayer'
    _description = 'musicplayer.musicplayer'
    
    name = fields.Char('Song Name')
    filename = fields.Char("File Name")
    url = fields.Char(compute="_compute_url")

    def _compute_url(self):
        for records in self:
            records.url = records.get_base_url() + '/music/' + str(records.id)
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
