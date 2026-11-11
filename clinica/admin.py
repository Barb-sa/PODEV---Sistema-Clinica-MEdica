from django.contrib import admin

from .models import Paciente
from .models import Exame
from .models import Medico

@admin.register(Paciente) 

class PacienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'idade', 'data_nascimento', 'celular', 'email', 'cpf')
    list_display_links = ('id', 'nome')
    search_fields = ('nome', 'email', 'cpf')
    list_filter = ('idade',)
    ordering = ('nome',)

@admin.register(Exame)

class ExameAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'tipo_exame', 'data_exame', 'arquivo', 'pdf_laudo',)
    list_display_links = ('id', 'paciente')
    search_fields = ('tipo_exame', 'paciente__nome', 'paciente__cpf')
    ordering = ('data_exame',)
    autocomplete_fields = ['paciente',]

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'crm', 'especialidade')
    search_fields = ('usuario__nome', 'crm', 'especialidade')

