from django.db import models
from django.contrib.auth.models import User
from clinica.services import gerar_laudos_pdf

class Paciente(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Utilizador", null=True, blank=True)
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    data_nascimento = models.DateField()
    celular = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14, unique=True)

    def __str__(self):
        return self.nome
    def save(self, *args, **kwargs):
        # Só executa na criação, se ainda não houver um User vinculado
        if not self.usuario:
            cpf_limpo = ''.join(filter(str.isdigit, self.cpf))
            user = User.objects.create_user(
                username=self.email,  # Usando o email como username
                email=self.email,
                password=cpf_limpo,  # Senha padrão inicial
                first_name=self.nome.split()[0],
                is_staff=False,      # Bloqueia acesso ao /admin/
                is_superuser=False
            )
            self.usuario = user
        super().save(*args, **kwargs)

class Exame(models.Model):
    medico = models.ForeignKey('Medico', on_delete=models.PROTECT, verbose_name="Médico Responsável", null=True, blank=True)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    tipo_exame = models.CharField(max_length=100)
    convenio = models.CharField(max_length=100, blank=True, null=True)
    data_exame = models.DateField()
    arquivo = models.FileField(upload_to='exames/', verbose_name="Ficheiro do Exame", blank=True, null=True)

    texto_laudo = models.TextField(verbose_name="Laudo do Exame", blank=True, null=True)
    pdf_laudo = models.FileField(upload_to='laudospdf/', verbose_name="PDF do Laudo", blank=True, null=True)
    
    def _str_(self):
        return f"{self.tipo_exame} - {self.paciente.nome}"

    def save(self, *args, **kwargs):
        # 1. Verificamos se o exame já tem um PDF gerado antes de salvar
        is_new = self.pk is None
        
        # 2. Guardamos o exame normalmente na base de dados
        super().save(*args, **kwargs)
        
        # 3. SÓ geramos o PDF se houver texto no laudo E o campo do PDF estiver vazio!
        if self.texto_laudo and not self.pdf_laudo:
            gerar_laudos_pdf(self)

class Medico(models.Model):
    nome = models.CharField(max_length=100)
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    crm = models.CharField(max_length=20, unique=True)
    especialidade = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Secretaria(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Utilizador")
    telefone = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username