// ─────────────────────────────────────────────────────────────────────────────
// kanban.jsx — ATUALIZADO (Semana 6, Dia 4)
//
// MUDANÇAS em relação à versão anterior:
//
//   1. Formulário fixo REMOVIDO — substituído pelo modal
//   2. adicionarTarefa REMOVIDO — substituído por salvarTarefa
//   3. alternarConcluida REMOVIDO — coluna Concluído representa o estado
//   4. Novos estados: modalAberto, tarefaEditando, colunaAtiva
//   5. salvarTarefa: cria (proximaId) ou edita (.map + spread)
//   6. Botão + no cabeçalho de cada coluna
//   7. onConcluir removido do ListaTarefas — onEditar adicionado
// ─────────────────────────────────────────────────────────────────────────────

import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefa";
import ModalTarefa from "../componentes/ModalTarefa";
import { useState, useEffect } from "react";

function Kanban() {
  // ── ID incremental — mesmo padrão das semanas anteriores ─────────────────
  const [proximaId, setProximaId] = useState(1);

  // ── Estado das tarefas — inicializador carrega do localStorage ────────────
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return [];
    const tarefasConvertidas = JSON.parse(tarefasSalvas);
    if (Array.isArray(tarefasConvertidas) && tarefasConvertidas.length > 0) {
      // Restaura o próximo id a partir do último id salvo
      setProximaId(tarefasConvertidas[tarefasConvertidas.length - 1].id + 1);
    }
    return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  });

  // ── Estados do modal ───────────────────────────────────────────────────────
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  // ── Persiste tarefas no localStorage sempre que mudar ────────────────────
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // ── Abre modal para CRIAR — botão + no cabeçalho da coluna ───────────────
  function abrirModalCriar(coluna) {
    setTarefaEditando(null); // null = modo criação
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  // ── Abre modal para EDITAR — duplo clique no card ────────────────────────
  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa); // objeto = modo edição
    setModalAberto(true);
  }

  // ── Uma função para CRIAR e EDITAR ────────────────────────────────────────
  // Se dados.id existe → edita com .map() + spread
  // Se dados.id é undefined → cria com proximaId
  function salvarTarefa(dados) {
    if (dados.id !== undefined) {
      // EDITAR — atualiza apenas os campos alterados, mantém coluna
      setTarefas(
        tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t)),
      );
    } else {
      // CRIAR — usa proximaId e incrementa
      // const novaTarefa = {
      //   ...dados,
      //   id: proximaId,
      // };
      // setTarefas([...tarefas, novaTarefa]);

      setTarefas([...tarefas, {...dados, id: proximaId}]);

      setProximaId(proximaId + 1);
    }
  }

  // ── Deletar tarefa ────────────────────────────────────────────────────────
  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  // ── Mover tarefa entre colunas ────────────────────────────────────────────
  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((t) => (t.id === id ? { ...t, coluna: novaColuna } : t)),
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        <div className="kanban-quadro">
          {/* ── COLUNA 1: A FAZER ──────────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "afazer").length}
                </span>
                {/* Botão + abre o modal com a coluna pré-selecionada */}
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("afazer")}
                  title="Nova tarefa em A Fazer"
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          {/* ── COLUNA 2: EM ANDAMENTO ─────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "andamento").length}
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("andamento")}
                  title="Nova tarefa em Em Andamento"
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          {/* ── COLUNA 3: CONCLUÍDO ────────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "concluido").length}
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("concluido")}
                  title="Nova tarefa em Concluído"
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
        {/* fim .kanban-quadro */}

        {/* Modal — único, fora das colunas, no final do JSX */}
        <ModalTarefa
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          tarefa={tarefaEditando}
          coluna={colunaAtiva}
        />
      </main>

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;
