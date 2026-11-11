from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Utilizador", null=True, blank=True)
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    data_nascimento = models.DateField()
    celular = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14, unique=True)

    def _str_(self):
        return self.nome

class Exame(models.Model):
    medico = models.ForeignKey('Medico', on_delete=models.PROTECT, verbose_name="Médico Responsável", null=True, blank=True)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    tipo_exame = models.CharField(max_length=100)
    data_exame = models.DateField()
    arquivo = models.FileField(upload_to='exames/', verbose_name="Ficheiro do Exame", blank=True, null=True)

    texto_laudo = models.TextField(verbose_name="Laudo do Exame", blank=True, null=True)
    pdf_laudo = models.FileField(upload_to='laudospdf/', verbose_name="PDF do Laudo", blank=True, null=True)
    
    def _str_(self):
        return f"{self.tipo_exame} - {self.paciente.nome}"

class Medico(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    crm = models.CharField(max_length=20, unique=True)
    especialidade = models.CharField(max_length=100)

    def _str_(self):
        return self.nome