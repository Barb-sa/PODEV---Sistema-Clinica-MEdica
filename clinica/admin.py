from django.contrib import admin

from .models import Paciente
from .models import Exame

@admin.register(Paciente) 

class PacienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'idade', 'data_nascimento', 'celular', 'email', 'cpf')
    list_display_links = ('id', 'nome')
    search_fields = ('nome', 'email', 'cpf')
    list_filter = ('idade',)
    ordering = ('nome',)

@admin.register(Exame)

class ExameAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'tipo_exame', 'data_exame', 'resultado')
    list_display_links = ('id', 'paciente')
    search_fields = ('tipo_exame', 'cpf', 'paciente__nome')
    list_filter = ('data_exame',)
    ordering = ('data_exame',)