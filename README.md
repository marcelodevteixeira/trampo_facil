# TrampoFácil

## 1. Problema
A informalidade e a falta de visibilidade impedem que muitos trabalhadores locais encontrem oportunidades de serviço em sua própria vizinhança. Simultaneamente, clientes em potencial têm dificuldade em encontrar profissionais confiáveis e próximos para resolver problemas cotidianos (como reparos domésticos, limpeza ou aulas) de forma rápida e segura.

## 2. Justificativa
O "TrampoFácil" foi desenvolvido com foco no **ODS 8 (Trabalho Decente e Crescimento Econômico)** da ONU, especificamente alinhado à meta 8.5. A aplicação busca democratizar o acesso ao mercado de trabalho local, permitindo que microempreendedores e trabalhadores autônomos divulguem seus serviços gratuitamente, fortalecendo a economia comunitária e reduzindo barreiras de entrada digital.

## 3. Objetivos
*   **Conectar:** Unir prestadores de serviço e clientes baseando-se na geolocalização.
*   **Simplificar:** Oferecer uma interface intuitiva onde o contato (via WhatsApp ou telefone) é direto, sem intermediários burocráticos.
*   **Fomentar:** Incentivar a contratação de mão de obra local.

## 4. Tipo de Aplicação
Este projeto é um **PWA (Progressive Web App)**.
Ele combina a acessibilidade de um site com funcionalidades de aplicativo nativo, como:
*   Instalação na tela inicial do dispositivo.
*   Funcionamento em tela cheia (standalone).
*   Responsividade para diversos tamanhos de tela (Mobile-First).

## 5. Requisitos do Sistema
Para utilizar ou desenvolver o projeto, são necessários:
*   **Navegador Moderno:** Google Chrome, Safari, Firefox ou Edge (com suporte a Service Workers e Geolocalização).
*   **Conexão com Internet:** Necessária para o carregamento inicial e busca de dados (embora o PWA suporte cache de interface offline).
*   **Permissão de Localização:** O app necessita de acesso ao GPS para ordenar os serviços por proximidade.

## 6. Tecnologias Utilizadas
*   **Frontend:** React (TypeScript).
*   **Estilização:** Tailwind CSS (Design System responsivo).
*   **Ícones:** Lucide React.
*   **Backend / Dados:** Integração preparada para Supabase (PostgreSQL + Auth).
*   **Roteamento:** React Router DOM.

## 7. Instalação e Execução Local

Siga os passos abaixo para rodar o projeto em sua máquina:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/trampofacil.git
    cd trampofacil
    ```

2.  **Instale as dependências:**
    Certifique-se de ter o Node.js instalado.
    ```bash
    npm install
    ```

3.  **Execução:**
    Inicie o servidor de desenvolvimento local.
    ```bash
    npm start
    # ou, dependendo do seu gerenciador de pacotes:
    npm run dev
    ```

4.  **Acesso:**
    Abra o navegador no endereço indicado (geralmente `http://localhost:3000` ou `http://localhost:5173`).

---
Desenvolvido como parte de projeto acadêmico focado em Engenharia de Software e Impacto Social.