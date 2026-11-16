import os
from io import BytesIO
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors 

def gerar_laudos_pdf(exame): 
    
    # criar um buffer para armazenar o PDF na memória ram
    buffer = BytesIO()
    
    # configura o documento PDF
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightmargin=40,
        leftmargin=40,
        topmargin=40,
        bottommargin=40
     )
    # criar uma lista para armazenar os elementos do PDF
    story = []

    # obtem os styles padrão do reportlab
    styles = getSampleStyleSheet()

    estilo_titulo = ParagraphStyle(
        'titulo_laudo',
        parent=styles['Heading2'],
        fontSize=12,
        leading=14,
        alignment=1,  
        spaceAfter=15,
        )

    estilo_secao = ParagraphStyle(
        'SecaoLaudo',
        parent=styles['Heading3'],
        fontSize=11,
        leading=13,
        spaceBefore=10,
        spaceAfter=5,
        textColor=colors.HexColor('#000000')
    )

    estilo_texto = ParagraphStyle(
        'texto_laudo',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        spaceAfter=6,
        )

    # extrai dados do paciente e do médico do exame.
    paciente = exame.paciente
    medico = exame.medico
    convenio_texto = exame.convenio if exame.convenio else "PARTICULAR"
    nome_medico_solicitante = medico.nome if medico and hasattr(medico, 'nome') else "Não informado"

    dados_cabecalho = [
         [Paragraph(f"<b>Paciente:</b> {paciente.nome}", estilo_texto), 
         Paragraph(f"<b>Protocolo:</b> {exame.id}", estilo_texto)],
        [Paragraph(f"<b>Idade:</b> {paciente.idade} anos", estilo_texto), 
         Paragraph(f"<b>Realizado em:</b> {exame.data_exame.strftime('%d/%m/%Y')}", estilo_texto)],
        [Paragraph(f"<b>Convênio:</b> {convenio_texto}", estilo_texto), 
         Paragraph(f"<b>Solicitante:</b> Dr(a). {nome_medico_solicitante}", estilo_texto)]
    ]
   
    tabela_cabecalho = Table(dados_cabecalho, colWidths=[270, 260])
    tabela_cabecalho.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    
    # Adicionar o cabeçalho à nossa "história" (story)
    story.append(tabela_cabecalho)
    story.append(Spacer(1, 15)) # Espaço em branco a separar a secção seguinte

    # Título do Exame (Centralizado e em destaque)
    story.append(Paragraph(f"<b>{exame.tipo_exame.upper()}</b>", estilo_titulo))
    
    # Indicação Clínica
    story.append(Paragraph(f"<b>INDICAÇÃO:</b> Avaliação clínica solicitada.", estilo_texto))
    story.append(Spacer(1, 10))
    
    # Relatório (Texto redigido pelo médico)
    story.append(Paragraph("<b>RELATÓRIO:</b>", estilo_secao))
    
    if exame.texto_laudo:
        # Divide o texto por quebras de linha para criar tópicos automáticos
        linhas_laudo = exame.texto_laudo.split('\n')
        for linha in linhas_laudo:
            if linha.strip():
                story.append(Paragraph(f"• {linha.strip()}", estilo_texto))
    else:
        story.append(Paragraph("Laudo ainda não preenchido.", estilo_texto))
        
    story.append(Spacer(1, 10))
    
   
    
    story.append(Spacer(1, 40)) # Espaço para dar a margem da assinatura
    
    # Assinatura do Médico Responsável (Simbólica)
    crm_texto = f"CRM: {medico.crm}" if medico and medico.crm else ""
    
    # Criamos um estilo específico centralizado para a assinatura
    estilo_assinatura = ParagraphStyle(
        'AssinaturaMedica',
        parent=estilo_texto,
        alignment=1, # Centralizado
        spaceBefore=5
    )
    
    texto_assinatura = f"<b>Dr(a). {nome_medico_solicitante}</b><br/>{crm_texto}<br/>Diagnóstico por Imagem"
    story.append(Paragraph(texto_assinatura, estilo_assinatura))

    # Compilação final e salvamento do documento no Django
    doc.build(story)
    buffer.seek(0)


    nome_ficheiro = f"laudo_exame_{exame.id}.pdf"
    exame.pdf_laudo.save(nome_ficheiro, ContentFile(buffer.read()), save=True)
    buffer.close()



class Usuario: 
    def __init__(self, id_usuario: int, login: str, senha: str, tipo_perfil: str):
        self.id_usuario = id_usuario
        self.login = login
        self.senha = senha
        self.tipo_perfil = tipo_perfil

    def autenticar(self, login_informado: str, senha_informada: str) -> bool:
        return self.login == login_informado and self.senha == senha_informada

    def recuperar_senha (self) -> str:
        return f"Link para recuperação de senha enviado para o e-mail associado ao usuário {self.login}."


class Secretario(Usuario):
    def __init__(self, id_usuario: int, login: str, senha: str, tipo_perfil: str, nome: str):
        super().__init__(id_usuario, login, senha, tipo_perfil)
        self.nome = nome

    def cadastrar_paciente(self, nome_paciente: str, idade: int, data_nascimento: str, celular: str, email: str):
        senha_temporaria = "senha123"  # Geração de senha temporária, ainda falta desenvolver a lógica.
        print(f"Secretário(a) {self.nome} cadastrou o paciente {nome_paciente} com sucesso."    )
        return {
            "nome": nome_paciente,
            "login": email, 
            "senha": senha_temporaria
        }

    def alterar_dados_paciente(self, paciente, novo_celular: str, novo_email: str):
        paciente.celular = novo_celular
        paciente.email = novo_email
        return f"Dados do paciente {paciente.nome} atualizados pelo secretário(a) {self.nome}."
    

    
class Paciente(Usuario): 
    def __init__(self, id_usuario: int, login: str, senha: str, tipo_perfil: str, nome: str, idade: int, data_nascimento: str, celular: str, email: str, cpf: str):
        super().__init__(id_usuario, login, senha, tipo_perfil)
        self.nome = nome
        self.idade = idade
        self.data_nascimento = data_nascimento
        self.celular = celular
        self.email = email
        self.cpf = cpf
    def alterar_dados(self, novo_celular: str, novo_email: str) -> str:
        self.celular = novo_celular
        self.email = novo_email
        return f"Dados do paciente {self.nome} atualizados com sucesso."

    def visualizar_exames(self) -> list:
        print(f"Procurando exames do paciente {self.nome}")
        #falta implementar a lógica que vai vir do banco de dados.
        return []

    def baixar_documentos(self, exame_id: int) -> str:
        #falta desenvolver a lógica do download do documento do exame.
        return []



class Administrador(Usuario):
    def __init__(self, id_usuario: int, login: str, senha: str, tipo_perfil: str, nome: str):
        super().__init__(id_usuario, login, senha, tipo_perfil)
        self.nome = nome

    def cadastrar_secretario(self, nome_secretario: str, login: str, senha: str) -> dict:
        #falta desenvolver a lógica de cadastro do secretário no banco de dados.
        print(f"Administrador(a) {self.nome} cadastrou o secretário(a) {nome_secretario} com sucesso.")
        return {
            "nome": nome_secretario,
            "login": login,
            "senha": senha, 
            "tipo_perfil": "secretario"
        }
    def cadastrar_medico(self, nome: str, crm: str, email: str, senha_inicial: str) -> dict:
        """
        Requisito: O administrador cadastra novos médicos no sistema.
        """
        print(f"Administrador com credencial {self.credencial_ti} cadastrou o Dr(a). {nome if 'name' in locals() else nome} (CRM: {crm}).")
        return {
            "nome": nome,
            "crm": crm,
            "email": email,
            "tipo_perfil": "Medico"
        }
    def inativar_usuario(self, usuario_alvo) -> str:
        return[]



class Medico(Usuario):
    def __init__(self, id_usuario: int, login: str, senha: str, tipo_perfil: str, nome: str, crm: str):
        super().__init__(id_usuario, login, senha, tipo_perfil)
        self.nome = nome
        self.crm = crm

    def visualizar_historico(self, paciente) -> list:
        print(f"Procurando histórico do paciente {paciente.nome}")
        #falta implementar a lógica.
        return []
    
    def subir_exame(self, paciente, arquivo_exame) -> str:
        return []

    def emitir_laudo(self, exame, conteudo_texto: str) -> dict:
        laudo_gerado = {
            "conteudo": conteudo_texto,
            "medico_responsavel": self.nome,
            "crm": self.crm,
            "assinatura_digital": f"SHA256-ASSINADO-POR-DR-{self.crm}" # Requisito de segurança/integridade
        }
        
        return laudo_gerado


class Exame():
    def __init__(self, ID_EXAME: int, Arquivo_Imagem, paciente, medico):
        self.ID_EXAME = ID_EXAME
        self.Arquivo_Imagem = Arquivo_Imagem
        self.paciente = paciente
        self.medico = medico

    def Salvar_Arquivo(self) -> str:
        print(f"A guardar o ficheiro do exame ID {self.id_exame} associado ao paciente {self.paciente.nome}")
        # Futuramente, integrará com o sistema de storage do Django
        return f"Exame {self.id_exame} guardado com sucesso."

    def Recuperar_Arquivo(self) ->str:
        print(f"A recuperar o ficheiro do exame ID {self.id_exame} enviado pelo Dr(a). {self.medico.nome}")
        return self.arquivo_imagem

class Laudo():
    def __init__(self, ID_Laudo: int, Conteudo_Laudo: str, exame):
        self.ID_Laudo = ID_Laudo
        self.Conteudo_Laudo = Conteudo_Laudo
        self.exame = exame
        self.Assinatura_Digital = None

    def assinar_digitalmente(self, chave_privada: str) -> str:
        # Implementar a lógica de criptografia e hash 
        self.assinatura_digital = "Assinatura_Pendente"
        return self.assinatura_digital

    def validar_integridade(self) -> bool:
        # Implementar a verificação de integridade 
        return True
    
    def gerar_pdf(self) -> str:
        return f"laudo_{self.id_laudo}.pdf"

