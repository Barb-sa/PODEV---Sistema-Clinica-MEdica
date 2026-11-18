from django.contrib import admin

from .models import Paciente
from .models import Exame
from .models import Medico
from .models import Secretaria

@admin.register(Paciente) 
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'idade', 'data_nascimento', 'celular', 'email', 'cpf')
    list_display_links = ('id', 'nome')
    search_fields = ('nome', 'email', 'cpf')
    list_filter = ('idade',)
    ordering = ('nome',)
    exclude = ('usuario',)

@admin.register(Exame)
class ExameAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'tipo_exame', 'data_exame', 'resultado')
    list_display_links = ('id', 'paciente')
    list_filter = ('data_exame',)
    list_display = ('id', 'paciente', 'tipo_exame', 'data_exame', 'arquivo', 'pdf_laudo',)
    search_fields = ('tipo_exame', 'paciente__nome', 'paciente__cpf')
    ordering = ('data_exame',)
    autocomplete_fields = ['paciente',]
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs # Superuser vê tudo
        try:
            medico_logado = Medico.objects.get(usuario=request.user)
            return qs.filter(medico=medico_logado) # Médico vê apenas os exames dos seus pacientes
        except Medico.DoesNotExist:
            pass
            
        # 3. Tenta ver se é Paciente (caso acedam ao admin)
        try:
            paciente_logado = Paciente.objects.get(usuario=request.user)
            return qs.filter(paciente=paciente_logado)
        except Paciente.DoesNotExist:
            pass
        return qs.none()

        

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'crm', 'especialidade')
    search_fields = ('usuario__nome', 'crm', 'especialidade')

@admin.register(Secretaria)
class SecretariaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'telefone')
    search_fields = ('usuario__username', 'usuario__email', 'telefone')