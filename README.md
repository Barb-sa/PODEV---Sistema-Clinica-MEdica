# PODEV---Sistema-Clinica-Medica
# 🩺 CB Clinical

Sistema web para gerenciamento de uma **Clínica Médica de Ultrassom**, permitindo o cadastro de pacientes, médicos e secretários, além do gerenciamento de exames e laudos.

## 📌 Funcionalidades

* Cadastro e gerenciamento de usuários.
* Pacientes podem visualizar e baixar seus exames e laudos.
* Médicos podem consultar pacientes, exames e histórico, além de criar e assinar digitalmente laudos.
* Secretários podem cadastrar e atualizar dados dos pacientes, sem acesso aos exames e laudos.
* Notificações automáticas sobre novos exames e laudos.
* Recuperação de senha por e-mail ou SMS.
* Verificação da integridade dos laudos após assinatura digital.

## 🛠️ Tecnologias

* **Frontend:** React, HTML e CSS
* **Backend:** Django + Django REST Framework
* **Autenticação e permissões:** JWT + django-guardian
* **Banco de dados:** PostgreSQL
* **Armazenamento:** MinIO + django-storages
* **Assinatura digital:** pyHanko
* **Tarefas assíncronas:** Celery + Redis

## 👥 Equipe

* Bárbara Teodoro de Sá
* Cícero Davel Cevolane

**Disciplina:** Paradigma Orientado a Objetos para Desenvolvimento de Software

**Professor:** João Luiz de Almeida Filho

