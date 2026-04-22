# Visualizador Multiterativo de Algoritmos Gulosos

Este é um projeto didático em React desenvolvido para ilustrar interativamente o conceito e a prática de **Algoritmos Gulosos (Greedy Algorithms)**, muito presentes na matéria de Projeto e Análise de Algoritmos (PAA).

O projeto destrincha algoritmos clássicos acompanhados por um design UI/UX super atraente em "dark mode", micro-interações, ordenação automática e logs passo-a-passo.

## 🧰 Tecnologias Utilizadas
- **React + Vite** (com TypeScript)
- **Tailwind CSS v4** (Para estilização e layout moderno "Glassmorphism")
- **Framer Motion** (Para transições de layout, fluxos de preenchimento e loging contínuo)
- **Lucide React** (Ícones SVG)

---

## 🧬 Módulos Disponíveis

### 1. Mochila Fracionária (Fractional Knapsack)
Demonstra o algoritmo guloso que ordena itens pelo seu **Custo-Benefício** (Razão Valor/Peso).
   - O utilizador pode inserir Itens dinamicamente com Peso e Valor distintos.
   - O sistema auto-ordena a tabela evidenciando qual item oferece a melhor rentabilidade.
   - Uma representação em "barra gráfica" fracionada preenche conforme a capacidade da mochila vai caindo.

### 2. O Problema do Troco (Coin Change)
Exibe se o algoritmo guloso funciona perfeitamente ou se é "enganado" na minimização de moedas.
   - O usuário pode definir moedas customizadas (Ex: `1, 3, 4`).
   - Log exibindo o recolhimento das moedas de maior valor primeiro e a sobra.
   - Aplica em segundo plano `Programação Dinâmica` para achar a restrição ótima real e emite **Alertas Especiais** avisando quando a solução gulosa errou (Ex: usou 3 moedas mas poderia usar apenas 2).

### 3. Grafos e Árvores (Dijkstra, Prim e Kruskal)
Um mini-board com SVGs estáticos e step-loggers didáticos dissecando os algoritmos de grafos e AGMs (Árvore Geradora Mínima). 
   - **Dijkstra**: Pinta e descobre caminhos menores, reportando sua avaliação de menor distância até cada nó.
   - **Prim**: Destaca em esmeralda arestas que aumentam a Árvore sem fechar ciclo explorando sempre o vizinho mais próximo.
   - **Kruskal**: Mostra a avaliação de cada aresta pela ordem absoluta de tamanho de peso, alertando em rosa quando detectar ciclos.

---

## 🚀 Como Rodar Localmente

1. Navegue pelo console até o diretório da aplicação (`algoritmos-gulosos`).
2. Utilize o Node para instalar/recuperar as dependências caso ainda não tenha feito:
   ```bash
   npm install
   ```
3. Inicialize o servidor Vite de Desenvolvimento:
   ```bash
   npm run dev
   ```
4. Caso a aba não seja aberta de maneira automática, no seu navegador de preferência abra [http://localhost:5173](http://localhost:5173).

---
*Projeto idealizado para experimentação em tempo real durante apresentações da matéria de PAA.*
