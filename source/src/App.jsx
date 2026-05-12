import React, { useState, useMemo } from 'react';
import { 
  Activity, Users, Calculator, BookOpen, Settings, Plus, ChevronRight, ChevronLeft,
  Search, Filter, Heart, FlaskConical, Dna, ShieldCheck, AlertTriangle, 
  Stethoscope, FileText, TrendingUp, Calendar, Pill, Microscope, X,
  ArrowRight, Check, Info, Sparkles, ClipboardList,
  User, Building2, Globe, Bell, LogOut, ChevronDown, Moon, Lock, HelpCircle
} from 'lucide-react';

// ============================================================
// NCCN HEPATOBILIARY DATA — extracted from v5.2021
// ============================================================

const NCCN_CATEGORIES = {
  '1': { label: 'Cat. 1', color: 'bg-emerald-500', text: 'text-emerald-50', desc: 'Alto nivel de evidencia + consenso uniforme' },
  '2A': { label: 'Cat. 2A', color: 'bg-sky-500', text: 'text-sky-50', desc: 'Menor evidencia + consenso uniforme' },
  '2B': { label: 'Cat. 2B', color: 'bg-amber-500', text: 'text-amber-50', desc: 'Menor evidencia + consenso NCCN' },
  '3':  { label: 'Cat. 3', color: 'bg-rose-500', text: 'text-rose-50', desc: 'Desacuerdo importante' },
};

// HCC — Sistémicos (NCCN HCC-G)
const HCC_REGIMENS = {
  first_line: [
    { 
      name: 'Atezolizumab + Bevacizumab', 
      category: '1', 
      preferred: true,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Régimen preferido 1L. Requiere evaluación endoscópica de varices esofágicas ~6 meses previos.',
      caution: 'Evaluación endoscópica obligatoria por riesgo de sangrado.'
    },
    { 
      name: 'Sorafenib', 
      category: '1', 
      preferred: false,
      requires: { childPugh: ['A','B'] },
      biomarkers: [],
      notes: 'Cat.1 para Child-Pugh A. Uso en Child-Pugh B7 con precaución.',
      caution: 'Datos limitados de seguridad en CP-B. Bilirrubina elevada → precaución extrema.'
    },
    { 
      name: 'Lenvatinib', 
      category: '1', 
      preferred: false,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Solo Child-Pugh A.'
    },
    { 
      name: 'Nivolumab', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['A','B'] },
      biomarkers: [],
      notes: 'Si inelegible para TKIs u otros antiangiogénicos. Cat. 2B.'
    },
    { 
      name: 'FOLFOX', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Datos limitados. Preferible en contexto de ensayo clínico.'
    },
  ],
  subsequent_line: [
    { 
      name: 'Regorafenib', 
      category: '1', 
      preferred: true,
      requires: { childPugh: ['A'], priorTreatment: 'sorafenib' },
      biomarkers: [],
      notes: 'Tras sorafenib (≥400 mg/día tolerado).'
    },
    { 
      name: 'Cabozantinib', 
      category: '1', 
      preferred: true,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Tras sorafenib previo.'
    },
    { 
      name: 'Ramucirumab', 
      category: '1', 
      preferred: true,
      requires: { childPugh: ['A'], afp: '≥400 ng/mL' },
      biomarkers: ['AFP≥400'],
      notes: 'Solo si AFP ≥400 ng/mL.'
    },
    { 
      name: 'Lenvatinib', 
      category: '2A', 
      preferred: false,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Opción subsiguiente.'
    },
    { 
      name: 'Nivolumab + Ipilimumab', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Useful in certain circumstances.'
    },
    { 
      name: 'Pembrolizumab', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['A'] },
      biomarkers: [],
      notes: 'Recomendado con o sin MSI-H.'
    },
    { 
      name: 'Nivolumab', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['B'] },
      biomarkers: [],
      notes: 'Solo Child-Pugh B. Sin tratamiento previo con checkpoint inhibitor.'
    },
    { 
      name: 'Dostarlimab-gxly', 
      category: '2B', 
      preferred: false,
      requires: { childPugh: ['A','B'] },
      biomarkers: ['MSI-H','dMMR'],
      notes: 'Tumores MSI-H/dMMR refractarios sin alternativa satisfactoria.'
    },
    { 
      name: 'Larotrectinib', 
      category: '2A', 
      preferred: false,
      requires: { childPugh: ['A','B'] },
      biomarkers: ['NTRK'],
      notes: 'NTRK gene fusion-positive.'
    },
    { 
      name: 'Entrectinib', 
      category: '2A', 
      preferred: false,
      requires: { childPugh: ['A','B'] },
      biomarkers: ['NTRK'],
      notes: 'NTRK gene fusion-positive.'
    },
  ]
};

// Biliary Tract (Vesícula + Colangiocarcinoma intra/extrahepático)
const BILIARY_REGIMENS = {
  first_line: [
    { name: 'Gemcitabina + Cisplatino', category: '1', preferred: true, biomarkers: [], notes: 'Régimen de referencia (ABC-02).' },
    { name: 'Gemcitabina + Cisplatino + nab-Paclitaxel', category: '2B', preferred: false, biomarkers: [], notes: 'Útil en circunstancias específicas.' },
    { name: '5-FU + Oxaliplatino', category: '2A', preferred: false, biomarkers: [], notes: 'Other recommended.' },
    { name: 'Capecitabina + Oxaliplatino', category: '2A', preferred: false, biomarkers: [], notes: 'Other recommended.' },
    { name: 'Gemcitabina + Capecitabina', category: '2A', preferred: false, biomarkers: [], notes: 'Other recommended.' },
    { name: 'Gemcitabina + Oxaliplatino', category: '2A', preferred: false, biomarkers: [], notes: 'Other recommended.' },
    { name: '5-FU + Cisplatino', category: '2B', preferred: false, biomarkers: [], notes: 'Useful in certain circumstances.' },
    { name: 'Capecitabina + Cisplatino', category: '2B', preferred: false, biomarkers: [], notes: 'Useful in certain circumstances.' },
    { name: 'Gemcitabina + nab-Paclitaxel', category: '2A', preferred: false, biomarkers: [], notes: 'Other recommended.' },
    { name: 'Entrectinib', category: '2A', preferred: false, biomarkers: ['NTRK'], notes: 'NTRK fusion-positive.' },
    { name: 'Larotrectinib', category: '2A', preferred: false, biomarkers: ['NTRK'], notes: 'NTRK fusion-positive.' },
    { name: 'Pembrolizumab', category: '2A', preferred: false, biomarkers: ['MSI-H','dMMR'], notes: 'MSI-H/dMMR tumors.' },
  ],
  subsequent_line: [
    { name: 'FOLFOX', category: '2A', preferred: true, biomarkers: [], notes: 'Tras gem-cis (ABC-06).' },
    { name: 'FOLFIRI', category: '2B', preferred: false, biomarkers: [], notes: 'Datos limitados.' },
    { name: 'Regorafenib', category: '2B', preferred: false, biomarkers: [], notes: 'Refractario.' },
    { name: 'Pemigatinib', category: '2A', preferred: false, biomarkers: ['FGFR2'], notes: 'CCA con fusión/reordenamiento FGFR2.' },
    { name: 'Infigratinib', category: '2A', preferred: false, biomarkers: ['FGFR2'], notes: 'CCA con fusión/reordenamiento FGFR2.' },
    { name: 'Ivosidenib', category: '2A', preferred: false, biomarkers: ['IDH1'], notes: 'CCA con mutación IDH1 (ClarIDHy).' },
    { name: 'Dabrafenib + Trametinib', category: '2A', preferred: false, biomarkers: ['BRAF-V600E'], notes: 'BRAF-V600E mutado (ROAR).' },
    { name: 'Pembrolizumab', category: '2A', preferred: false, biomarkers: ['MSI-H','dMMR','TMB-H'], notes: 'MSI-H/dMMR/TMB-H.' },
    { name: 'Dostarlimab-gxly', category: '2B', preferred: false, biomarkers: ['MSI-H','dMMR'], notes: 'MSI-H/dMMR refractarios.' },
    { name: 'Entrectinib', category: '2A', preferred: false, biomarkers: ['NTRK'], notes: 'NTRK fusion-positive.' },
    { name: 'Larotrectinib', category: '2A', preferred: false, biomarkers: ['NTRK'], notes: 'NTRK fusion-positive.' },
    { name: 'Nivolumab', category: '2B', preferred: false, biomarkers: [], notes: 'Useful in certain circumstances.' },
    { name: 'Lenvatinib + Pembrolizumab', category: '2B', preferred: false, biomarkers: [], notes: 'Useful in certain circumstances.' },
  ]
};

// ============================================================
// CALCULATORS
// ============================================================

function calculateChildPugh({ encephalopathy, ascites, albumin, inr, bilirubin, isPBC }) {
  let pts = 0;
  // Encephalopathy
  pts += encephalopathy === 'none' ? 1 : encephalopathy === 'mild' ? 2 : 3;
  // Ascites
  pts += ascites === 'absent' ? 1 : ascites === 'slight' ? 2 : 3;
  // Albumin
  const alb = parseFloat(albumin);
  pts += alb > 3.5 ? 1 : alb >= 2.8 ? 2 : 3;
  // INR
  const inrV = parseFloat(inr);
  pts += inrV < 1.7 ? 1 : inrV <= 2.3 ? 2 : 3;
  // Bilirubin
  const bil = parseFloat(bilirubin);
  if (isPBC) {
    pts += bil < 4 ? 1 : bil <= 10 ? 2 : 3;
  } else {
    pts += bil < 2 ? 1 : bil <= 3 ? 2 : 3;
  }
  const cls = pts <= 6 ? 'A' : pts <= 9 ? 'B' : 'C';
  const risk = cls === 'A' ? 'Buen riesgo operatorio' : cls === 'B' ? 'Riesgo operatorio moderado' : 'Riesgo operatorio pobre';
  return { score: pts, class: cls, risk };
}

function calculateMELD({ creatinine, bilirubin, inr, dialysis }) {
  let cr = Math.max(parseFloat(creatinine), 1.0);
  if (dialysis) cr = 4.0;
  if (cr > 4.0) cr = 4.0;
  const bil = Math.max(parseFloat(bilirubin), 1.0);
  const inrV = Math.max(parseFloat(inr), 1.0);
  const meld = 3.78 * Math.log(bil) + 11.2 * Math.log(inrV) + 9.57 * Math.log(cr) + 6.43;
  return Math.round(Math.max(6, Math.min(40, meld)));
}

function checkMilan({ lesions }) {
  // Milan: 1 lesion ≤5cm OR up to 3 lesions ≤3cm each
  if (!lesions || lesions.length === 0) return { meets: false, reason: 'Sin lesiones registradas' };
  if (lesions.length === 1 && lesions[0] <= 5) return { meets: true, reason: '1 lesión ≤5 cm' };
  if (lesions.length <= 3 && lesions.every(l => l <= 3)) return { meets: true, reason: `${lesions.length} lesiones ≤3 cm` };
  return { meets: false, reason: 'Excede criterios de Milán' };
}

function checkUNOS({ lesions, afp }) {
  const afpVal = parseFloat(afp);
  if (afpVal > 1000) return { meets: false, reason: 'AFP > 1000 ng/mL' };
  if (!lesions || lesions.length === 0) return { meets: false, reason: 'Sin lesiones registradas' };
  if (lesions.length === 1 && lesions[0] >= 2 && lesions[0] <= 5) {
    return { meets: true, reason: '1 lesión entre 2–5 cm + AFP ≤1000' };
  }
  if (lesions.length >= 2 && lesions.length <= 3 && lesions.every(l => l >= 1 && l <= 3)) {
    return { meets: true, reason: `${lesions.length} lesiones de 1–3 cm + AFP ≤1000` };
  }
  return { meets: false, reason: 'No cumple criterios UNOS' };
}

// ============================================================
// AJCC TNM 8th Ed.
// ============================================================

const TNM_STAGE = {
  hcc: (t, n, m) => {
    if (m === 'M1') return 'IVB';
    if (n === 'N1') return 'IVA';
    if (t === 'T1a') return 'IA';
    if (t === 'T1b') return 'IB';
    if (t === 'T2') return 'II';
    if (t === 'T3') return 'IIIA';
    if (t === 'T4') return 'IIIB';
    return '—';
  },
  gallbladder: (t, n, m) => {
    if (m === 'M1') return 'IVB';
    if (n === 'N2') return 'IVB';
    if (t === 'T4') return 'IVA';
    if (n === 'N1') return 'IIIB';
    if (t === 'T3') return 'IIIA';
    if (t === 'T2b') return 'IIB';
    if (t === 'T2a') return 'IIA';
    if (t === 'T1') return 'I';
    if (t === 'Tis') return '0';
    return '—';
  },
  cholangio: (t, n, m) => {
    if (m === 'M1') return 'IVB';
    if (n === 'N1') return 'IIIB';
    if (t === 'T4') return 'IVA';
    if (t === 'T3') return 'IIIA';
    if (t === 'T2') return 'II';
    if (t === 'T1') return 'I';
    return '—';
  }
};

// ============================================================
// SAMPLE PATIENTS
// ============================================================

const SAMPLE_PATIENTS = [
  { 
    id: 1, initials: 'M.G.R.', age: 68, sex: 'M', 
    diagnosis: 'HCC', stage: 'IIIA', cp: 'A',
    biomarkers: [], afp: 245, lastVisit: 'Hace 3 días',
    treatment: 'Atezolizumab + Bevacizumab', cycle: 4
  },
  { 
    id: 2, initials: 'A.L.P.', age: 72, sex: 'F', 
    diagnosis: 'Colangio. intra', stage: 'IV', cp: 'A',
    biomarkers: ['FGFR2'], afp: null, lastVisit: 'Ayer',
    treatment: 'Pemigatinib', cycle: 2
  },
  { 
    id: 3, initials: 'J.M.S.', age: 64, sex: 'M', 
    diagnosis: 'Vesícula', stage: 'IIB', cp: 'A',
    biomarkers: [], afp: null, lastVisit: 'Hace 1 semana',
    treatment: 'Gem + Cis', cycle: 6
  },
  { 
    id: 4, initials: 'C.D.V.', age: 71, sex: 'F', 
    diagnosis: 'HCC', stage: 'II', cp: 'B',
    biomarkers: ['MSI-H'], afp: 89, lastVisit: 'Hoy',
    treatment: 'Pendiente decisión', cycle: 0
  },
];

// ============================================================
// UI COMPONENTS
// ============================================================

const NCCNBadge = ({ category, size = 'sm' }) => {
  const cat = NCCN_CATEGORIES[category];
  if (!cat) return null;
  const sizeCls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`${cat.color} ${cat.text} ${sizeCls} rounded-md font-semibold tracking-wide inline-flex items-center gap-1`}>
      <ShieldCheck className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {cat.label}
    </span>
  );
};

const BiomarkerChip = ({ name }) => (
  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 font-semibold border border-violet-200 inline-flex items-center gap-1">
    <Dna className="w-2.5 h-2.5" />
    {name}
  </span>
);

const StatusPill = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============================================================
// SCREENS
// ============================================================

function HomeScreen({ setScreen, setSelectedPatient, doctorName }) {
  const initials = doctorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase();

  return (
    <div className="px-5 pt-2 pb-24">
      {/* Header with avatar */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Martes, 12 mayo</p>
          <h1 className="text-3xl mt-1 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
            Buenos días, <em className="text-teal-700 font-medium">{doctorName.split(' ')[0]}</em>
          </h1>
        </div>
        <button 
          onClick={() => setScreen('settings')}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center font-semibold text-sm shrink-0 shadow-md active:scale-95 transition-transform"
        >
          {initials || 'DR'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
          <Users className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>34</p>
          <p className="text-xs opacity-80 mt-0.5">Pacientes activos</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <Calendar className="w-5 h-5 mb-2 text-amber-600" />
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>8</p>
          <p className="text-xs text-slate-500 mt-0.5">Citas hoy</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <Activity className="w-5 h-5 mb-2 text-rose-500" />
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>3</p>
          <p className="text-xs text-slate-500 mt-0.5">Decisiones MTB</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <Dna className="w-5 h-5 mb-2 text-violet-600" />
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>12</p>
          <p className="text-xs text-slate-500 mt-0.5">Biomarcadores +</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 tracking-wide">Acciones rápidas</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setScreen('new-patient')} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <Plus className="w-4 h-4 text-teal-700" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Nuevo</span>
          </button>
          <button onClick={() => setScreen('calculators')} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-amber-700" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Calcular</span>
          </button>
          <button onClick={() => setScreen('treatment')} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <Pill className="w-4 h-4 text-violet-700" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Régimen</span>
          </button>
        </div>
      </div>

      {/* Pacientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 tracking-wide">Mis pacientes</h2>
          <button className="text-xs text-teal-700 font-medium">Ver todos</button>
        </div>
        <div className="space-y-2.5">
          {SAMPLE_PATIENTS.map(p => (
            <button 
              key={p.id} 
              onClick={() => { setSelectedPatient(p); setScreen('patient-detail'); }}
              className="w-full bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-sm"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                {p.initials.split('.').filter(Boolean).slice(0,2).join('')}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-slate-900">{p.initials}</p>
                  <span className="text-xs text-slate-400">{p.age}a · {p.sex}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-xs text-slate-600">{p.diagnosis}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-slate-800">St. {p.stage}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-slate-800">CP-{p.cp}</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  {p.biomarkers.map(b => <BiomarkerChip key={b} name={b} />)}
                  {p.afp && <StatusPill variant="info">AFP {p.afp}</StatusPill>}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewPatientScreen({ setScreen }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    initials: '', age: '', sex: 'M',
    diagnosis: 'HCC',
    t: 'T1a', n: 'N0', m: 'M0',
    biomarkers: []
  });

  const toggleBio = (b) => {
    setFormData(f => ({
      ...f,
      biomarkers: f.biomarkers.includes(b) ? f.biomarkers.filter(x => x !== b) : [...f.biomarkers, b]
    }));
  };

  const stage = useMemo(() => {
    const key = formData.diagnosis === 'HCC' ? 'hcc' : 
                formData.diagnosis === 'Vesícula' ? 'gallbladder' : 'cholangio';
    return TNM_STAGE[key](formData.t, formData.n, formData.m);
  }, [formData.diagnosis, formData.t, formData.n, formData.m]);

  const tOptions = {
    'HCC': ['T1a','T1b','T2','T3','T4'],
    'Vesícula': ['Tis','T1','T2a','T2b','T3','T4'],
    'Colangio. intra': ['T1','T2','T3','T4'],
    'Colangio. extra': ['T1','T2','T3','T4']
  };

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('home')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Nuevo paciente</h1>
        <div className="w-9 h-9"></div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1,2,3].map(s => (
          <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-teal-700' : 'bg-slate-200'}`}></div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Datos básicos</p>
          
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Iniciales</label>
            <input 
              type="text" 
              value={formData.initials}
              onChange={e => setFormData(f => ({...f, initials: e.target.value}))}
              placeholder="A.B.C."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Edad</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={e => setFormData(f => ({...f, age: e.target.value}))}
                placeholder="65"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Sexo</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1">
                {['M','F'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setFormData(f => ({...f, sex: s}))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.sex === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Diagnóstico</label>
            <div className="space-y-2">
              {['HCC','Vesícula','Colangio. intra','Colangio. extra'].map(d => (
                <button 
                  key={d}
                  onClick={() => setFormData(f => ({...f, diagnosis: d, t: tOptions[d][0]}))}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all ${
                    formData.diagnosis === d 
                      ? 'bg-teal-700 text-white' 
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {d}
                  {formData.diagnosis === d && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            disabled={!formData.initials || !formData.age}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm mt-4 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Estadiaje TNM · AJCC 8.ª ed.</p>

          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-5 text-white">
            <p className="text-xs opacity-70 tracking-widest uppercase">Estadio</p>
            <p className="text-5xl font-bold mt-1" style={{ fontFamily: 'Fraunces, serif' }}>{stage}</p>
            <p className="text-xs opacity-80 mt-2">{formData.diagnosis} · {formData.t} {formData.n} {formData.m}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Tumor primario (T)</label>
            <div className="flex flex-wrap gap-1.5">
              {tOptions[formData.diagnosis].map(t => (
                <button 
                  key={t}
                  onClick={() => setFormData(f => ({...f, t}))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    formData.t === t ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Ganglios (N)</label>
            <div className="flex gap-1.5">
              {(formData.diagnosis === 'Vesícula' ? ['N0','N1','N2'] : ['N0','N1']).map(n => (
                <button 
                  key={n}
                  onClick={() => setFormData(f => ({...f, n}))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
                    formData.n === n ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Metástasis (M)</label>
            <div className="flex gap-1.5">
              {['M0','M1'].map(m => (
                <button 
                  key={m}
                  onClick={() => setFormData(f => ({...f, m}))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold ${
                    formData.m === m ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold text-sm">
              Atrás
            </button>
            <button onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm">
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Biomarcadores</p>
          <p className="text-xs text-slate-500 -mt-2">Marca los detectados en el panel molecular del paciente.</p>

          <div className="grid grid-cols-2 gap-2">
            {['FGFR2','IDH1','MSI-H','dMMR','NTRK','BRAF-V600E','TMB-H','AFP≥400'].map(b => (
              <button 
                key={b}
                onClick={() => toggleBio(b)}
                className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  formData.biomarkers.includes(b) 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5" />
                  {b}
                </span>
                {formData.biomarkers.includes(b) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              NCCN recomienda testar NTRK, MSI-H/dMMR y BRCA en tumores hepatobiliares avanzados, 
              y FGFR2/IDH1 específicamente en colangiocarcinoma.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(2)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold text-sm">
              Atrás
            </button>
            <button onClick={() => setScreen('home')} className="flex-1 bg-teal-700 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Crear paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalculatorsScreen({ setScreen, setCalcType }) {
  const calcs = [
    { id: 'child-pugh', name: 'Child-Pugh', desc: 'Función hepática y riesgo operatorio', icon: Heart, color: 'from-rose-500 to-rose-700' },
    { id: 'meld', name: 'MELD', desc: 'Severidad enfermedad hepática · UNOS', icon: FlaskConical, color: 'from-amber-500 to-amber-700' },
    { id: 'milan', name: 'Milán / UNOS', desc: 'Criterios de trasplante hepático', icon: ShieldCheck, color: 'from-teal-600 to-teal-800' },
  ];

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="mb-6">
        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Herramientas</p>
        <h1 className="text-3xl mt-1 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
          Calculadoras <em className="text-teal-700">clínicas</em>
        </h1>
      </div>

      <div className="space-y-3">
        {calcs.map(c => (
          <button 
            key={c.id}
            onClick={() => { setCalcType(c.id); setScreen('calc-detail'); }}
            className="w-full bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>{c.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-5 text-white">
        <Sparkles className="w-5 h-5 mb-2 opacity-80" />
        <p className="font-semibold text-sm mb-1">Score automático</p>
        <p className="text-xs opacity-70">
          Las calculadoras alimentan automáticamente las recomendaciones de tratamiento, 
          filtrando regímenes según función hepática.
        </p>
      </div>
    </div>
  );
}

function ChildPughCalc({ setScreen }) {
  const [vals, setVals] = useState({
    encephalopathy: 'none',
    ascites: 'absent',
    albumin: '3.5',
    inr: '1.2',
    bilirubin: '1.0',
    isPBC: false
  });

  const result = calculateChildPugh(vals);
  const classColor = result.class === 'A' ? 'from-emerald-500 to-emerald-700' :
                     result.class === 'B' ? 'from-amber-500 to-amber-700' :
                     'from-rose-500 to-rose-700';

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('calculators')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Child-Pugh</h1>
        <div className="w-9 h-9"></div>
      </div>

      {/* Result Card */}
      <div className={`bg-gradient-to-br ${classColor} rounded-2xl p-5 text-white mb-5 relative overflow-hidden`}>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-12 w-24 h-24 bg-white/5 rounded-full"></div>
        <p className="text-xs opacity-80 tracking-widest uppercase">Clase</p>
        <div className="flex items-end gap-3 mt-1">
          <p className="text-6xl font-bold leading-none" style={{ fontFamily: 'Fraunces, serif' }}>{result.class}</p>
          <p className="text-2xl font-semibold opacity-80 mb-1">{result.score} pts</p>
        </div>
        <p className="text-xs opacity-90 mt-3">{result.risk}</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Encefalopatía</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1">
            {[
              {v: 'none', l: 'Ausente'},
              {v: 'mild', l: 'Grado 1-2'},
              {v: 'severe', l: 'Grado 3-4'}
            ].map(o => (
              <button 
                key={o.v}
                onClick={() => setVals(v => ({...v, encephalopathy: o.v}))}
                className={`py-2 rounded-lg text-[11px] font-medium transition-all ${vals.encephalopathy === o.v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Ascitis</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1">
            {[
              {v: 'absent', l: 'Ausente'},
              {v: 'slight', l: 'Leve'},
              {v: 'moderate', l: 'Moderada'}
            ].map(o => (
              <button 
                key={o.v}
                onClick={() => setVals(v => ({...v, ascites: o.v}))}
                className={`py-2 rounded-lg text-[11px] font-medium transition-all ${vals.ascites === o.v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Albúmina (g/dL)</label>
            <input 
              type="number" step="0.1"
              value={vals.albumin}
              onChange={e => setVals(v => ({...v, albumin: e.target.value}))}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">INR</label>
            <input 
              type="number" step="0.1"
              value={vals.inr}
              onChange={e => setVals(v => ({...v, inr: e.target.value}))}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Bilirrubina (mg/dL)</label>
          <input 
            type="number" step="0.1"
            value={vals.bilirubin}
            onChange={e => setVals(v => ({...v, bilirubin: e.target.value}))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
          />
        </div>

        <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer">
          <input 
            type="checkbox"
            checked={vals.isPBC}
            onChange={e => setVals(v => ({...v, isPBC: e.target.checked}))}
            className="w-4 h-4 accent-teal-700"
          />
          <span className="text-sm text-slate-700">Cirrosis biliar primaria</span>
        </label>
      </div>

      <div className="mt-5 text-[10px] text-slate-400 text-center">
        Source: Pugh R et al. Br J Surg 1973;60:646-649 · NCCN HCC-C
      </div>
    </div>
  );
}

function MELDCalc({ setScreen }) {
  const [vals, setVals] = useState({
    creatinine: '1.0',
    bilirubin: '1.5',
    inr: '1.3',
    dialysis: false
  });

  const meld = calculateMELD(vals);
  const severity = meld < 10 ? 'Leve' : meld < 20 ? 'Moderado' : meld < 30 ? 'Severo' : 'Crítico';
  const color = meld < 10 ? 'from-emerald-500 to-emerald-700' :
                meld < 20 ? 'from-amber-500 to-amber-700' :
                meld < 30 ? 'from-orange-500 to-orange-700' :
                'from-rose-500 to-rose-700';

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('calculators')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">MELD Score</h1>
        <div className="w-9 h-9"></div>
      </div>

      <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white mb-5 relative overflow-hidden`}>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <p className="text-xs opacity-80 tracking-widest uppercase">MELD</p>
        <p className="text-6xl font-bold mt-1 leading-none" style={{ fontFamily: 'Fraunces, serif' }}>{meld}</p>
        <p className="text-xs opacity-90 mt-3">Severidad: {severity}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Creatinina (mg/dL)</label>
          <input 
            type="number" step="0.1"
            value={vals.creatinine}
            onChange={e => setVals(v => ({...v, creatinine: e.target.value}))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Bilirrubina (mg/dL)</label>
          <input 
            type="number" step="0.1"
            value={vals.bilirubin}
            onChange={e => setVals(v => ({...v, bilirubin: e.target.value}))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">INR</label>
          <input 
            type="number" step="0.1"
            value={vals.inr}
            onChange={e => setVals(v => ({...v, inr: e.target.value}))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
          />
        </div>

        <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer">
          <input 
            type="checkbox"
            checked={vals.dialysis}
            onChange={e => setVals(v => ({...v, dialysis: e.target.checked}))}
            className="w-4 h-4 accent-teal-700"
          />
          <span className="text-sm text-slate-700">Hemodiálisis ≥2 veces en última semana</span>
        </label>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex gap-2">
          <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <p className="text-xs text-sky-800">
            UNOS utiliza MELD para priorizar la lista de trasplante hepático. 
            Excepciones por HCC pueden añadir puntos.
          </p>
        </div>
      </div>

      <div className="mt-5 text-[10px] text-slate-400 text-center">
        Kamath PS et al. Hepatology 2001;33:464-470 · NCCN HCC-D
      </div>
    </div>
  );
}

function MilanCalc({ setScreen }) {
  const [lesions, setLesions] = useState([3.5]);
  const [afp, setAfp] = useState('150');

  const milan = checkMilan({ lesions });
  const unos = checkUNOS({ lesions, afp });

  const addLesion = () => setLesions([...lesions, 2.0]);
  const removeLesion = (i) => setLesions(lesions.filter((_,idx) => idx !== i));
  const updateLesion = (i, v) => {
    const ls = [...lesions];
    ls[i] = parseFloat(v) || 0;
    setLesions(ls);
  };

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('calculators')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Milán / UNOS</h1>
        <div className="w-9 h-9"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={`rounded-2xl p-4 text-white ${milan.meets ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
          <p className="text-[10px] opacity-80 tracking-widest uppercase">Milán</p>
          <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'Fraunces, serif' }}>
            {milan.meets ? 'Cumple' : 'No cumple'}
          </p>
          <p className="text-[10px] opacity-80 mt-2 leading-tight">{milan.reason}</p>
        </div>
        <div className={`rounded-2xl p-4 text-white ${unos.meets ? 'bg-gradient-to-br from-teal-600 to-teal-800' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
          <p className="text-[10px] opacity-80 tracking-widest uppercase">UNOS</p>
          <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'Fraunces, serif' }}>
            {unos.meets ? 'Cumple' : 'No cumple'}
          </p>
          <p className="text-[10px] opacity-80 mt-2 leading-tight">{unos.reason}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-600">Lesiones (cm)</label>
            <button onClick={addLesion} className="text-xs font-semibold text-teal-700 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Añadir
            </button>
          </div>
          <div className="space-y-2">
            {lesions.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 w-8">#{i+1}</span>
                <input 
                  type="number" step="0.1"
                  value={l}
                  onChange={e => updateLesion(i, e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
                />
                {lesions.length > 1 && (
                  <button onClick={() => removeLesion(i)} className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">AFP (ng/mL)</label>
          <input 
            type="number"
            value={afp}
            onChange={e => setAfp(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
            <p className="text-xs text-slate-600"><b>Milán:</b> 1 lesión ≤5 cm, o hasta 3 lesiones ≤3 cm.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0"></div>
            <p className="text-xs text-slate-600"><b>UNOS:</b> AFP ≤1000 ng/mL + 1 lesión 2-5 cm, o 2-3 lesiones 1-3 cm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreatmentScreen({ setScreen }) {
  const [cancer, setCancer] = useState('HCC');
  const [line, setLine] = useState('first_line');
  const [childPugh, setChildPugh] = useState('A');
  const [biomarkers, setBiomarkers] = useState([]);

  const toggleBio = (b) => {
    setBiomarkers(biomarkers.includes(b) ? biomarkers.filter(x => x !== b) : [...biomarkers, b]);
  };

  const allRegimens = cancer === 'HCC' ? HCC_REGIMENS : BILIARY_REGIMENS;
  const regimens = allRegimens[line];

  const filtered = regimens.filter(r => {
    // HCC filters by Child-Pugh
    if (cancer === 'HCC' && r.requires?.childPugh && !r.requires.childPugh.includes(childPugh)) {
      return false;
    }
    // Biomarker-required regimens: only show if user has that biomarker
    if (r.biomarkers && r.biomarkers.length > 0) {
      const hasMatch = r.biomarkers.some(b => biomarkers.includes(b));
      return hasMatch;
    }
    return true;
  });

  const biomarkerRegimens = filtered.filter(r => r.biomarkers && r.biomarkers.length > 0);
  const standardRegimens = filtered.filter(r => !r.biomarkers || r.biomarkers.length === 0);
  const preferred = standardRegimens.filter(r => r.preferred);
  const otherStandard = standardRegimens.filter(r => !r.preferred);

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="mb-5">
        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Decisión terapéutica</p>
        <h1 className="text-3xl mt-1 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
          Selector de <em className="text-teal-700">régimen</em>
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase block mb-1.5">Tumor</label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1">
            {['HCC','Biliar'].map(c => (
              <button 
                key={c}
                onClick={() => setCancer(c === 'HCC' ? 'HCC' : 'Biliar')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  (cancer === 'HCC' && c === 'HCC') || (cancer === 'Biliar' && c === 'Biliar')
                    ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase block mb-1.5">Línea</label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1">
            <button 
              onClick={() => setLine('first_line')}
              className={`py-2 rounded-lg text-xs font-semibold ${line === 'first_line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              1.ª línea
            </button>
            <button 
              onClick={() => setLine('subsequent_line')}
              className={`py-2 rounded-lg text-xs font-semibold ${line === 'subsequent_line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Subsiguiente
            </button>
          </div>
        </div>

        {cancer === 'HCC' && (
          <div>
            <label className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase block mb-1.5">Child-Pugh</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1">
              {['A','B','C'].map(c => (
                <button 
                  key={c}
                  onClick={() => setChildPugh(c)}
                  className={`py-2 rounded-lg text-xs font-semibold ${childPugh === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase block mb-1.5">Biomarcadores</label>
          <div className="flex flex-wrap gap-1.5">
            {(cancer === 'HCC' 
              ? ['MSI-H','dMMR','NTRK','AFP≥400']
              : ['FGFR2','IDH1','MSI-H','dMMR','NTRK','BRAF-V600E','TMB-H']
            ).map(b => (
              <button 
                key={b}
                onClick={() => toggleBio(b)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                  biomarkers.includes(b) 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Dna className="w-3 h-3" />
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {childPugh === 'C' && cancer === 'HCC' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800">
            <b>Child-Pugh C:</b> No hay regímenes sistémicos recomendados por NCCN. 
            Considerar best supportive care / hospice. Trasplante hepático si elegible.
          </p>
        </div>
      )}

      {/* Results */}
      {preferred.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            Preferidos
          </h3>
          <div className="space-y-2">
            {preferred.map((r, i) => <RegimenCard key={i} regimen={r} preferred />)}
          </div>
        </div>
      )}

      {otherStandard.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2">
            Otros recomendados
          </h3>
          <div className="space-y-2">
            {otherStandard.map((r, i) => <RegimenCard key={i} regimen={r} />)}
          </div>
        </div>
      )}

      {biomarkerRegimens.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2 flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-violet-700" />
            Dirigidos por biomarcador
          </h3>
          <div className="space-y-2">
            {biomarkerRegimens.map((r, i) => <RegimenCard key={i} regimen={r} targeted />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Sin regímenes recomendados con los criterios actuales</p>
        </div>
      )}

      <div className="mt-4 text-[10px] text-slate-400 text-center">
        NCCN Hepatobiliary Cancers · v5.2021 · HCC-G / BIL-C
      </div>
    </div>
  );
}

function RegimenCard({ regimen, preferred, targeted }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border ${preferred ? 'border-teal-200 ring-1 ring-teal-100' : targeted ? 'border-violet-200 ring-1 ring-violet-100' : 'border-slate-200'} overflow-hidden shadow-sm`}>
      <button 
        onClick={() => setOpen(!open)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${preferred ? 'bg-teal-50' : targeted ? 'bg-violet-50' : 'bg-slate-50'}`}>
          <Pill className={`w-4 h-4 ${preferred ? 'text-teal-700' : targeted ? 'text-violet-700' : 'text-slate-700'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-sm text-slate-900 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
              {regimen.name}
            </p>
            <NCCNBadge category={regimen.category} />
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {regimen.requires?.childPugh && (
              <StatusPill variant="info">CP {regimen.requires.childPugh.join('/')}</StatusPill>
            )}
            {regimen.biomarkers?.map(b => <BiomarkerChip key={b} name={b} />)}
            {regimen.caution && (
              <StatusPill variant="warning">
                <AlertTriangle className="w-2.5 h-2.5 inline -mt-0.5 mr-0.5" />
                Precaución
              </StatusPill>
            )}
          </div>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-600 leading-relaxed">{regimen.notes}</p>
          {regimen.caution && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">{regimen.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PatientDetailScreen({ setScreen, patient }) {
  if (!patient) return null;
  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('home')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Paciente</h1>
        <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ClipboardList className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 rounded-2xl p-5 text-white mb-4 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full"></div>
        <div className="absolute -right-4 -bottom-16 w-32 h-32 bg-teal-500/10 rounded-full"></div>
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center font-bold text-base border border-white/20">
            {patient.initials.split('.').filter(Boolean).slice(0,2).join('')}
          </div>
          <div>
            <p className="font-bold text-lg" style={{ fontFamily: 'Fraunces, serif' }}>{patient.initials}</p>
            <p className="text-xs opacity-70">{patient.age} años · {patient.sex} · {patient.lastVisit}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 relative">
          <div>
            <p className="text-[10px] opacity-60 tracking-widest uppercase">Dx</p>
            <p className="text-sm font-semibold mt-0.5">{patient.diagnosis}</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60 tracking-widest uppercase">Estadio</p>
            <p className="text-sm font-semibold mt-0.5">{patient.stage}</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60 tracking-widest uppercase">Child-Pugh</p>
            <p className="text-sm font-semibold mt-0.5">{patient.cp}</p>
          </div>
        </div>
      </div>

      {/* Biomarcadores */}
      {(patient.biomarkers.length > 0 || patient.afp) && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-violet-600" />
              Perfil molecular
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.biomarkers.map(b => <BiomarkerChip key={b} name={b} />)}
            {patient.afp && <StatusPill variant="info">AFP {patient.afp} ng/mL</StatusPill>}
          </div>
        </div>
      )}

      {/* Tratamiento actual */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2.5 flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-teal-700" />
          Tratamiento actual
        </h3>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>{patient.treatment}</p>
            {patient.cycle > 0 && <p className="text-xs text-slate-500 mt-0.5">Ciclo {patient.cycle}</p>}
          </div>
          {patient.cycle > 0 && (
            <div className="w-12 h-12 rounded-full border-2 border-teal-700 flex items-center justify-center">
              <span className="text-sm font-bold text-teal-700">C{patient.cycle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-3 flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
          Cronología
        </h3>
        <div className="space-y-3">
          {[
            { date: '12 may', text: 'Revisión RM hepática · respuesta parcial' },
            { date: '08 abr', text: 'Inicio ciclo 4 · sin toxicidad relevante' },
            { date: '15 mar', text: 'MTB · decisión multidisciplinar' },
            { date: '03 feb', text: 'Diagnóstico inicial' },
          ].map((e, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-teal-600' : 'bg-slate-300'}`}></div>
                {i < 3 && <div className="w-px flex-1 bg-slate-200 my-1"></div>}
              </div>
              <div className="flex-1 pb-1">
                <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">{e.date}</p>
                <p className="text-xs text-slate-700 mt-0.5">{e.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setScreen('treatment')}
        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Ver regímenes recomendados
      </button>
    </div>
  );
}

function GuideScreen({ setScreen }) {
  const sections = [
    { title: 'Hepatocellular Carcinoma', code: 'HCC', items: ['Screening (HCC-1)', 'Diagnóstico (HCC-2)', 'Workup (HCC-3)', 'Resección/Trasplante (HCC-4)', 'Sistémicos (HCC-G)'], color: 'bg-teal-700' },
    { title: 'Carcinoma de vesícula', code: 'GALL', items: ['Workup', 'Cirugía (GALL-A)', 'Sistémicos (BIL-C)'], color: 'bg-amber-700' },
    { title: 'Colangiocarcinoma intra', code: 'INTRA', items: ['Workup (INTRA-1)', 'Cirugía (INTRA-A)', 'Sistémicos (BIL-C)'], color: 'bg-violet-700' },
    { title: 'Colangiocarcinoma extra', code: 'EXTRA', items: ['Workup (EXTRA-1)', 'Cirugía (EXTRA-A)', 'Sistémicos (BIL-C)'], color: 'bg-rose-700' },
  ];

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="mb-6">
        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Referencia</p>
        <h1 className="text-3xl mt-1 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
          NCCN <em className="text-teal-700">Guidelines</em>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Hepatobiliary Cancers · v5.2021</p>
      </div>

      {/* NCCN Categories legend */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-3">Categorías de evidencia</h3>
        <div className="space-y-2">
          {Object.entries(NCCN_CATEGORIES).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <NCCNBadge category={k} />
              <p className="text-xs text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {sections.map((s, i) => (
          <button key={i} className="w-full bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0`}>
              {s.code}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>{s.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.items.length} secciones</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ setScreen, settings, setSettings }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(settings);

  const save = () => {
    setSettings(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(settings);
    setEditing(false);
  };

  const initials = settings.doctorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase();

  return (
    <div className="px-5 pt-2 pb-24">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setScreen('home')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Ajustes</h1>
        <div className="w-9 h-9"></div>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full"></div>
        <div className="absolute -right-4 -bottom-16 w-32 h-32 bg-teal-500/10 rounded-full"></div>
        <div className="flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center font-bold text-xl border border-white/20">
            {initials || 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
              {settings.doctorName}
            </p>
            <p className="text-xs opacity-70 mt-0.5 truncate">{settings.specialty}</p>
            <p className="text-[10px] opacity-60 mt-0.5 truncate">{settings.hospital}</p>
          </div>
        </div>
      </div>

      {/* Account section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Cuenta</h3>
          {!editing ? (
            <button 
              onClick={() => setEditing(true)}
              className="text-xs text-teal-700 font-semibold"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={cancel}
                className="text-xs text-slate-500 font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={save}
                className="text-xs text-teal-700 font-bold"
              >
                Guardar
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Nombre */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-teal-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-0.5">Nombre</p>
                {editing ? (
                  <input 
                    type="text"
                    value={draft.doctorName}
                    onChange={e => setDraft(d => ({...d, doctorName: e.target.value}))}
                    placeholder="Dra. Marta Vega"
                    autoFocus
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 truncate">{settings.doctorName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Especialidad */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4 text-violet-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-0.5">Especialidad</p>
                {editing ? (
                  <select 
                    value={draft.specialty}
                    onChange={e => setDraft(d => ({...d, specialty: e.target.value}))}
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
                  >
                    <option>Oncología Médica</option>
                    <option>Oncología Médica · Hepatobiliar</option>
                    <option>Cirugía Hepatobiliar</option>
                    <option>Hepatología</option>
                    <option>Radiología Intervencionista</option>
                    <option>Oncología Radioterápica</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-900 truncate">{settings.specialty}</p>
                )}
              </div>
            </div>
          </div>

          {/* Hospital */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-0.5">Hospital · Servicio</p>
                {editing ? (
                  <input 
                    type="text"
                    value={draft.hospital}
                    onChange={e => setDraft(d => ({...d, hospital: e.target.value}))}
                    placeholder="Hospital 12 de Octubre"
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 truncate">{settings.hospital}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2.5 px-1">Preferencias</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Idioma */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-sky-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Idioma</p>
              <p className="text-[11px] text-slate-500">Interfaz y nomenclatura clínica</p>
            </div>
            <select 
              value={settings.language}
              onChange={e => setSettings(s => ({...s, language: e.target.value}))}
              className="text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg px-2 py-1.5 border-0 outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Unidades */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Unidades de laboratorio</p>
              <p className="text-[11px] text-slate-500">Sistema convencional o SI</p>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
              <button 
                onClick={() => setSettings(s => ({...s, units: 'conv'}))}
                className={`px-2 py-1 rounded text-[10px] font-semibold ${settings.units === 'conv' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                mg/dL
              </button>
              <button 
                onClick={() => setSettings(s => ({...s, units: 'si'}))}
                className={`px-2 py-1 rounded text-[10px] font-semibold ${settings.units === 'si' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                SI
              </button>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-rose-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Notificaciones</p>
              <p className="text-[11px] text-slate-500">Citas, MTB y resultados de labs</p>
            </div>
            <button 
              onClick={() => setSettings(s => ({...s, notifications: !s.notifications}))}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-teal-700' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.notifications ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          {/* Modo oscuro */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4 text-slate-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Tema oscuro</p>
              <p className="text-[11px] text-slate-500">Reduce fatiga visual en guardias</p>
            </div>
            <button 
              onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-teal-700' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          {/* Modo Demo */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-violet-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Modo demo</p>
              <p className="text-[11px] text-slate-500">Pacientes ficticios para ponencias</p>
            </div>
            <button 
              onClick={() => setSettings(s => ({...s, demoMode: !s.demoMode}))}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.demoMode ? 'bg-teal-700' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.demoMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Seguridad / Soporte */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-2.5 px-1">Seguridad y soporte</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <button className="w-full p-4 border-b border-slate-100 flex items-center gap-3 active:bg-slate-50">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900">Privacidad y datos</p>
              <p className="text-[11px] text-slate-500">RGPD · cifrado local</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          <button className="w-full p-4 flex items-center gap-3 active:bg-slate-50">
            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-sky-700" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900">Ayuda y soporte</p>
              <p className="text-[11px] text-slate-500">Contacto y manual de uso</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="bg-slate-100 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <p className="text-xs font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>HEPATIQ</p>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Versión 1.0.0 · Build 2026.05<br />
          Basado en NCCN Hepatobiliary Cancers v5.2021
        </p>
        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
          Esta app es una herramienta de soporte clínico. Las decisiones terapéuticas finales son responsabilidad del facultativo.
        </p>
      </div>

      {/* Logout */}
      <button className="w-full bg-white border border-rose-200 text-rose-600 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [calcType, setCalcType] = useState(null);
  const [settings, setSettings] = useState({
    doctorName: 'Dra. Marta Vega',
    specialty: 'Oncología Médica · Hepatobiliar',
    hospital: 'Hospital 12 de Octubre',
    language: 'es',
    units: 'conv',
    notifications: true,
    darkMode: false,
    demoMode: true,
  });

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen setScreen={setScreen} setSelectedPatient={setSelectedPatient} doctorName={settings.doctorName} />;
      case 'new-patient': return <NewPatientScreen setScreen={setScreen} />;
      case 'patient-detail': return <PatientDetailScreen setScreen={setScreen} patient={selectedPatient} />;
      case 'calculators': return <CalculatorsScreen setScreen={setScreen} setCalcType={setCalcType} />;
      case 'calc-detail': 
        if (calcType === 'child-pugh') return <ChildPughCalc setScreen={setScreen} />;
        if (calcType === 'meld') return <MELDCalc setScreen={setScreen} />;
        if (calcType === 'milan') return <MilanCalc setScreen={setScreen} />;
        return null;
      case 'treatment': return <TreatmentScreen setScreen={setScreen} />;
      case 'guide': return <GuideScreen setScreen={setScreen} />;
      case 'settings': return <SettingsScreen setScreen={setScreen} settings={settings} setSettings={setSettings} />;
      default: return <HomeScreen setScreen={setScreen} setSelectedPatient={setSelectedPatient} doctorName={settings.doctorName} />;
    }
  };

  // Map current screen to bottom-nav active state
  const navScreen = ['calc-detail'].includes(screen) ? 'calculators' :
                    ['patient-detail','new-patient','settings'].includes(screen) ? 'home' :
                    screen;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-50 via-white to-teal-50/30 flex flex-col" style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}>
      
      {/* Contenedor central — full-width en móvil, centrado en desktop */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col relative">
        
        {/* Contenido scrolleable */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{ 
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))'
          }}
        >
          {renderScreen()}
        </div>

      </div>

      {/* Bottom Nav fijo — siempre abajo */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4 px-3 pt-2 pb-2 max-w-md mx-auto">
          {[
            { id: 'home', icon: Users, label: 'Pacientes' },
            { id: 'calculators', icon: Calculator, label: 'Calc' },
            { id: 'treatment', icon: Pill, label: 'Régimen' },
            { id: 'guide', icon: BookOpen, label: 'Guía' },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setScreen(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${navScreen === t.id ? 'text-teal-700' : 'text-slate-400'}`}
            >
              <t.icon className={`w-5 h-5 ${navScreen === t.id ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
