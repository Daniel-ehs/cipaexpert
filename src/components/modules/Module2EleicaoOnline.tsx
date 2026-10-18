import React, { useState } from 'react';
import { Candidato, VotoAuditoria } from '../../types/cipa';
import { generateCipaDocument, GeneratedDocument } from '../../data/documentTemplates';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  Users, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Hash, 
  Clock, 
  ChevronRight,
  User,
  Fingerprint
} from 'lucide-react';

interface Module2EleicaoOnlineProps {
  onOpenDocument: (doc: GeneratedDocument) => void;
  companyName: string;
  cnpj: string;
  totalEleitoresAptos?: number;
}

export const Module2EleicaoOnline: React.FC<Module2EleicaoOnlineProps> = ({
  onOpenDocument,
  companyName,
  cnpj,
  totalEleitoresAptos = 145
}) => {
  // State for candidates
  const [candidatos, setCandidatos] = useState<Candidato[]>([
    {
      id: 'c1',
      nome: 'Renata Vasconcelos',
      cargo: 'Operadora de Produção',
      setor: 'Usinagem',
      tempoEmpresa: '4 anos e 2 meses',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      numero: '101',
      propostas: 'Foco em manutenção de guardas de proteção de maquinário e melhorias na ventilação industrial.',
      votos: 34
    },
    {
      id: 'c2',
      nome: 'Lucas Albuquerque',
      cargo: 'Técnico de Manutenção Mecânica',
      setor: 'Manutenção',
      tempoEmpresa: '6 anos e 8 meses',
      fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      numero: '102',
      propostas: 'Revisão periódica de EPIs contra ruído e treinamentos contínuos de bloqueio elétrico LOTO.',
      votos: 28
    },
    {
      id: 'c3',
      nome: 'Juliana Ferreira',
      cargo: 'Assistente Administrativo',
      setor: 'Logística',
      tempoEmpresa: '2 anos e 5 meses',
      fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      numero: '103',
      propostas: 'Implementação de campanhas ativas de acolhimento e combate ao assédio moral no ambiente corporativo.',
      votos: 22
    },
    {
      id: 'c4',
      nome: 'Marcos Vinícius Prado',
      cargo: 'Operador de Empilhadeira',
      setor: 'Expedição',
      tempoEmpresa: '5 anos e 1 mês',
      fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      numero: '104',
      propostas: 'Sinalização visual reforçada nas vias de pedestres e faixas de tráfego de cargas pesadas.',
      votos: 16
    },
    {
      id: 'c5',
      nome: 'Beatriz Nogueira',
      cargo: 'Analista de Qualidade',
      setor: 'Controle de Qualidade',
      tempoEmpresa: '3 anos',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      numero: '105',
      propostas: 'Ergonomia nos postos de bancada e pausas ativas para alívio de estresse biomecânico.',
      votos: 11
    }
  ]);

  const [votosBrancosNulos, setVotosBrancosNulos] = useState<number>(3);
  
  // Voting simulator states
  const [matriculaVotante, setMatriculaVotante] = useState('COLAB-4819');
  const [candidatoSelecionadoId, setCandidatoSelecionadoId] = useState<string>('c1');
  const [votoEmitidoComprovante, setVotoEmitidoComprovante] = useState<VotoAuditoria | null>(null);

  // Audit trail logs
  const [auditLogs, setAuditLogs] = useState<VotoAuditoria[]>([
    {
      id: 'aud-1',
      timestamp: '2026-10-10 09:12:44',
      hashComprovante: '9A7F41C2E8301B8D8F4E29A1009CF5B731',
      eleitorMatriculaMascarada: 'COLAB-***2',
      ipOrigemAnonimizado: '192.168.10.***',
      status: 'computado'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-10 09:15:10',
      hashComprovante: '3B8D991A54FE67C29A10DF88029A7B3E41',
      eleitorMatriculaMascarada: 'COLAB-***9',
      ipOrigemAnonimizado: '192.168.10.***',
      status: 'computado'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-10 09:21:05',
      hashComprovante: 'FE45A910CB881E93309B74CA6102DE4B92',
      eleitorMatriculaMascarada: 'COLAB-***1',
      ipOrigemAnonimizado: '192.168.10.***',
      status: 'computado'
    }
  ]);

  // Total votes computed
  const totalVotos = candidatos.reduce((acc, c) => acc + c.votos, 0) + votosBrancosNulos;
  const quorumMinimo = Math.floor(totalEleitoresAptos / 2) + 1; // 50% + 1
  const quorumAtingido = totalVotos >= quorumMinimo;
  const quorumPercentual = Math.min(100, Math.round((totalVotos / totalEleitoresAptos) * 100));

  // Sort candidates by votes (descending)
  const candidatosOrdenados = [...candidatos].sort((a, b) => b.votos - a.votos);

  // Voting handler
  const handleVotar = () => {
    if (!candidatoSelecionadoId) return;

    if (candidatoSelecionadoId === 'branco') {
      setVotosBrancosNulos((prev) => prev + 1);
    } else {
      setCandidatos((prev) =>
        prev.map((c) => (c.id === candidatoSelecionadoId ? { ...c, votos: c.votos + 1 } : c))
      );
    }

    const newHash = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();

    const novoRegistro: VotoAuditoria = {
      id: 'aud-' + (auditLogs.length + 1),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      hashComprovante: newHash,
      eleitorMatriculaMascarada: matriculaVotante.slice(0, 6) + '***' + matriculaVotante.slice(-1),
      ipOrigemAnonimizado: '172.20.1.***',
      status: 'computado'
    };

    setAuditLogs((prev) => [novoRegistro, ...prev]);
    setVotoEmitidoComprovante(novoRegistro);
  };

  const handleEmitirAtaEleicao = () => {
    const doc = generateCipaDocument('ata_eleicao', companyName, cnpj, new Date().toISOString(), 8);
    onOpenDocument(doc);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-150">
      
      {/* Module Top Bar: Verde Claro Padronizado */}
      <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
            <Vote className="w-5 h-5 text-emerald-700" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Módulo 2 · Eleição Online Auditada & Urna Digital
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEmitirAtaEleicao}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Emitir Ata de Apuração Oficial</span>
          </button>
        </div>
      </div>

      {/* Quorum and KPIs Row com Headers Coloridos e Cantos Arredondados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Votes */}
        <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-200/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Vote className="w-4 h-4 text-emerald-700" />
              <span>Votos Computados</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-bold">
              Urna CIPA
            </span>
          </div>
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {totalVotos}
            </div>
            <p className="text-[11px] text-slate-500">De {totalEleitoresAptos} colaboradores aptos</p>
          </div>
        </div>

        {/* Quorum Progress */}
        <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between md:col-span-2">
          <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-200/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Quórum Eleitoral (Exigência NR-5: 50% + 1)</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
              {quorumPercentual}% ({totalVotos}/{quorumMinimo} necessários)
            </span>
          </div>
          <div className="p-4 sm:p-5 space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  quorumAtingido ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${quorumPercentual}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className={quorumAtingido ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {quorumAtingido ? '✓ Quórum Válido em 1º Turno' : 'Atenção: Quórum ainda não alcançado'}
              </span>
              <span className="text-slate-400">Item 5.5.4 da NR-5</span>
            </div>
          </div>
        </div>

        {/* Security Audit Status */}
        <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-200/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Auditoria Digital</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Ativa
            </span>
          </div>
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Urna Segura & Homologada</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              Zero-Knowledge Hash
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Interactive Voting Booth & Real-time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Voting Booth Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
          <div className="bg-emerald-50/80 px-5 py-3.5 border-b border-emerald-200/70 flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-700" />
              <span>Simulador de Votação do Colaborador</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Voto Secreto
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-5">

          {/* Voter Authentication Simulation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Matrícula do Eleitor
            </label>
            <input
              type="text"
              value={matriculaVotante}
              onChange={(e) => setMatriculaVotante(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              A identidade do eleitor é desacoplada do voto registrado, garantindo sigilo pela NR-5 e LGPD.
            </p>
          </div>

          {/* Candidate Radio List */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Escolha seu Candidato:
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {candidatos.map((c) => (
                <label
                  key={c.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    candidatoSelecionadoId === c.id
                      ? 'border-emerald-500 bg-emerald-50/70'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="candidato"
                    value={c.id}
                    checked={candidatoSelecionadoId === c.id}
                    onChange={() => setCandidatoSelecionadoId(c.id)}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{c.nome}</span>
                      <span className="font-mono text-xs font-semibold text-slate-600 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        Nº {c.numero}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{c.cargo} · {c.setor}</p>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                      "{c.propostas}"
                    </p>
                  </div>
                </label>
              ))}

              {/* White/Null Vote Option */}
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  candidatoSelecionadoId === 'branco'
                    ? 'border-slate-500 bg-slate-100'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <input
                  type="radio"
                  name="candidato"
                  value="branco"
                  checked={candidatoSelecionadoId === 'branco'}
                  onChange={() => setCandidatoSelecionadoId('branco')}
                  className="text-slate-600 focus:ring-slate-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Votar em Branco / Nulo
                </span>
              </label>
            </div>
          </div>

          {/* Submit Vote Button */}
          <button
            type="button"
            onClick={handleVotar}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar e Registrar Voto na Urna</span>
          </button>

          {/* Receipt display */}
          {votoEmitidoComprovante && (
            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs space-y-1.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Comprovante Emitido
                </span>
                <span className="font-mono">{votoEmitidoComprovante.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Eleitor: <span className="font-mono">{votoEmitidoComprovante.eleitorMatriculaMascarada}</span>
              </p>
              <p className="text-[10px] font-mono text-slate-400 break-all">
                Hash de Auditoria: {votoEmitidoComprovante.hashComprovante}
              </p>
            </div>
          )}

          </div>
        </div>

        {/* Right: Apuração Oficial e Classificação de Eleitos (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            <div className="bg-emerald-50/80 px-5 py-3.5 border-b border-emerald-200/70 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">
                Classificação Oficial dos Candidatos (NR-5)
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200">
                {totalVotos} votos apurados
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">

            {/* Candidates Ranked Table */}
            <div className="space-y-2.5">
              {candidatosOrdenados.map((c, index) => {
                const percentual = totalVotos > 0 ? Math.round((c.votos / totalVotos) * 100) : 0;
                const isTitular = index < 3; // Top 3 titulares
                const isSuplente = index >= 3 && index < 5; // Next 2 suplentes

                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}º
                        </span>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{c.nome}</span>
                          <span className="text-[11px] text-slate-500">
                            {c.cargo} · {c.setor} · {c.tempoEmpresa} de empresa
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                          {c.votos} votos
                        </span>
                        <span className="text-[11px] text-slate-500 block font-mono">
                          {percentual}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar and Status Tag */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-semibold whitespace-nowrap shrink-0">
                        {isTitular ? (
                          <span className="text-emerald-700">Eleito Titular</span>
                        ) : isSuplente ? (
                          <span className="text-amber-700">Eleito Suplente</span>
                        ) : (
                          <span className="text-slate-400">Não Eleito</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {/* Immutable Audit Log */}
          <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            <div className="bg-emerald-50/80 px-5 py-3.5 border-b border-emerald-200/70 flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-700" />
                <span>Trilha de Auditoria Digital da Urna (Últimos Registros)</span>
              </h4>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                Inviolabilidade Garantida
              </span>
            </div>

            <div className="p-5 space-y-2 font-mono text-[11px]">
              {auditLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-600"
                >
                  <span className="truncate pr-2">
                    <strong className="text-slate-800">{log.eleitorMatriculaMascarada}</strong> · Hash: {log.hashComprovante.slice(0, 16)}...
                  </span>
                  <span className="text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
