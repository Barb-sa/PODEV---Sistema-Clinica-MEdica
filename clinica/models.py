from django.db import models

class Paciente(models.Model):
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    data_nascimento = models.DateField()
    celular = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14, unique=True)

    def __str__(self):
        return self.nome

class Exame(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    tipo_exame = models.CharField(max_length=100)
    data_exame = models.DateField()
    resultado = models.TextField()

    def __str__(self):
        return f"{self.tipo_exame} - {self.paciente.nome}"