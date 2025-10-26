# 🧮 ProcSim — Simulador de Escalonamento de Processos

ProcSim é um **simulador de algoritmos de escalonamento de processos de CPU** desenvolvido em **React + TypeScript**.  
Ele permite cadastrar processos, configurar algoritmos de escalonamento e visualizar a execução em tempo real, incluindo filas, processos ativos, históricos e métricas.

---

## ⚙️ Funcionalidades

1. **Cadastro de processos**

   - Atributos: `duração`, `momento de criação`, `prioridade`.
   - Cada processo recebe um **ID único** automaticamente.

2. **Configuração do escalonador**

   - Seleção de algoritmos: `FCFS`, `SJF`, `SRTF`, `PRIORITY_NON_PREEMPTIVE`, `PRIORITY_PREEMPTIVE`.

3. **Execução em tempo real**

   - Atualização a cada segundo (`tempoDecorrido`).
   - Controle de **fila de prontos**, **processo atual**, **histórico de execução**.
   - Diferencia algoritmos **cooperativos** e **preemptivos**.

4. **Visualização interativa**

   - Tabelas de processos e execução.
   - Cards para cada processo em execução.
   - Barra de progresso e métricas dinâmicas.

---

## 🔢 Algoritmos de Escalonamento

| Algoritmo                   | Estratégia                                                       |
| --------------------------- | ---------------------------------------------------------------- |
| **FCFS**                    | First-Come, First-Served — processo mais antigo executa primeiro |
| **SJF**                     | Shortest Job First — menor duração primeiro                      |
| **SRTF**                    | Shortest Remaining Time First — menor tempo restante primeiro    |
| **PRIORITY_NON_PREEMPTIVE** | Maior prioridade primeiro, não preemptivo                        |
| **PRIORITY_PREEMPTIVE**     | Maior prioridade primeiro, preemptivo                            |

---

## 🧩 Conceitos Simulados

- **Cooperativo vs Preemptivo**
  Algoritmos cooperativos esperam o término do processo atual; preemptivos podem interromper.

- **Histórico de Execução**
  Permite gerar gráficos de Gantt ou tabelas de execução em tempo real.

- **Fila de Prontos**
  Lista dinâmica de processos que estão aptos a serem executados.

---

## 🚀 Tecnologias

- **React + TypeScript**
- **Context API** para estado global
- **Vite** como bundler
- **TailwindCSS** para estilos
- **Framer Motion** para animações
- **ESLint & Prettier** para qualidade de código

---

## 💻 Como rodar

```bash
# Baixar projeto
git clone https://github.com/Lusca-umaia/PROC_SIM.git

# Entrar no projeto
cd ./PROC_SIM

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

> ⚠️ Observação
>
> No momento, os algoritmos de **Round Robin (RR)** ainda não foram implementados nesta versão do simulador.  
> O sistema atualmente suporta os algoritmos cooperativos e de prioridade, mas o controle de quantum para RR será adicionado em futuras atualizações.

---
