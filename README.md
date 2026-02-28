# ==== Sistema de Gestão de Estoque ====

    Este projeto consiste em uma API desenvolvida em Node.js para controle de estoque, focada na implementação de uma infraestrutura robusta utilizando Docker, Persistência de Dados e automação de CI/CD.

## ==== Como Executar o Projeto ====

# 1. Scripts de Clonar o Repositório e os do Docker:

git clone [https://github.com/Prompts085/Sistema-de-Estoque.git](https://github.com/Prompts085/Sistema-de-Estoque.git)
cd "Sistema-de-Estoque"

# Subir o Ambiente (Docker Compose):

docker-compose up --build (A API estará disponível em http://localhost:3000)

# Inicializar o Banco de Dados:

docker exec -it sistema-estoque-api npm run db:init


# Alugns detalhes da infraestrutura:

# Docker & Dockerfile:
    Utilizando a imagem leve node:20-alpine. 
    O Dockerfile foi configurado para expor a porta 3000 e inclui um comando de Healthcheck para monitorar a saúde da aplicação.

![Docker Subindo](./screenshots/docker-up.png)

# volumes no docker-compose.yml para garantir que:
    O banco de dados SQLite (/data/database.sqlite) não seja perdido e arquivo de auditoria (acessos.log) seja persistido no host

![banco](./screenshots/DBinit.png)

# Monitoramento:
    O sistema utiliza a instrução HEALTHCHECK no Dockerfile para monitorar a saúde da aplicação internamente
# comando de validação: 
    docker inspect --format='{{json .State.Health.Status}}' sistema-estoque-api

![Healthcheck e LOG](./screenshots/status-log.png)
 (No print acima da pra ver que tambem utilizamos o comando para verificar o acessos.log)

# CI/CD com GitHub Actions:
    A automação de deploy está configurada no arquivo .github/workflows/deploy.yml. Toda vez que um push é realizado na branch main, o GitHub Actions valida o build e simula o deploy:

![Actions](./screenshots/actions.png)


# Principais Rotas de acesso:

    GET /api/registrar: Registrar o admin pra ter acesso ao sistema
    POSt /api/login: Rota para fazer login pra obter o token e conseguir ver as outras rotas
    GET /api/relatorio: Exporta relatório de estoque baixo (CSV)
    GET /api/me: Retorna dados do usuário logado.


# DESAFIOS ESCOLHIDOS:
    Exportar relatório para CSV
    Endpoint /me retorna dados do usuário logado
    Log de auditoria em arquivo (acessos.log)

# Feito por:
    Marcos Cauã de Freitas Barbosa
# Disciplina:
    Ambiente de Software (ADS)