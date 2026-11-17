from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from clinica.models import Exame, Paciente
from clinica.models import Exame, Medico

@login_required
def listar_exames_medico(request):
    try:
        # 1. Encontra o Médico associado à conta de User que fez login
        medico_logado = Medico.objects.get(usuario=request.user)
        
        # 2. Busca TODOS os exames dos pacientes associados a este médico
        exames = Exame.objects.filter(medico=medico_logado)
        
    except Medico.DoesNotExist:
        # Se o utilizador logado não for um médico registado
        exames = Exame.objects.none()

    return exames

@login_required
def listar_exames_paciente(request):
    try:
        # 1. Encontra o Paciente que está associado à conta de User que fez login
        paciente_logado = Paciente.objects.get(usuario=request.user)
        
        # 2. Busca APENAS os exames pertencentes a este paciente (Isolamento total)
        exames = Exame.objects.filter(paciente=paciente_logado)
        
    except Paciente.DoesNotExist:
        # Se por acaso o utilizador logado não tiver um perfil de paciente associado
        exames = Exame.objects.none()

    return exames