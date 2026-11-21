# AuraSync AI — Landing page + Studio Free

Site estático, sem dependências externas, com a edição Free 1.5 incluída.

## Estrutura
- `index.html`: página de apresentação e planos.
- `css/landing.css`, `js/landing.js`: visual e menu responsivo.
- `assets/`: logotipo e capturas reais do editor com dados fictícios.
- `studio/`: edição gratuita, com HTML, CSS e JavaScript próprios.
- `vercel.json`: URLs limpas e barra final para que arquivos relativos funcionem em `/studio/`.

## Teste local
Execute `python -m http.server 8000` na raiz e abra `http://localhost:8000/`. A edição gratuita abre em `/studio/`.

## Publicação GitHub + Vercel
1. Preserve um backup do repositório e da configuração atual do domínio. Não publique a versão Pro neste repositório.
2. Extraia o ZIP e envie o conteúdo da pasta (incluindo as subpastas), não o ZIP em si, a um repositório de teste ou ao repositório público da versão Free.
3. Na Vercel, importe o repositório, selecione Other e deixe sem comando de build. A raiz é `./`; não configure `dist` como saída.
4. Teste o endereço de preview: `/`, `/studio/`, menu mobile, tour, upload e PNG. Confirme que não há código Pro no deploy.
5. Só então altere o domínio existente, se desejado. O pacote não altera seu domínio nem sua conta automaticamente.

## Checkout (pendente)
O preço Pro de R$ 49 é proposto. O botão está desativado e identificado como lançamento futuro. Quando o checkout real estiver pronto, ajuste a oferta e substitua o botão desativado por um link oficial; publique políticas comerciais e de privacidade apropriadas. A edição Pro continua separada para entrega após pagamento. Antes de vender, confirme os requisitos de idade, cadastro, tributos e termos da plataforma de vendas e da hospedagem; se necessário, peça apoio de um responsável legal.

## Notas
A Free gera 3 slides e 2 formatos de texto, sem marca-d'água e sem IA generativa. Não salva projetos completos. As imagens de exemplo são capturas do editor com dados fictícios. Não há analytics, cookies de publicidade, cadastro ou processamento de pagamentos nesta página; o editor guarda a preferência do tour no armazenamento local do navegador.
