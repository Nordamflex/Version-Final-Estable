// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import {
  Baby as BabyIcon,
  Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon,
  ShieldAlert as ShieldAlertIcon,
  Scale as ScaleIcon,
  Eye as EyeIcon,
  Ear as EarIcon,
  Thermometer as ThermometerIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  HeartPulse as HeartPulseIcon,
  Wind as WindIcon,
  Brain as BrainIcon,
  Stethoscope as StethoscopeIcon,
  Droplet as DropletIcon,
  ClipboardList as ClipboardListIcon,
  Beaker as BeakerIcon,
  CheckCircle2 as CheckCircleIcon,
  Zap as ZapIcon,
  MapPin as MapPinIcon,
  Microscope as MicroscopeIcon,
  Crosshair as CrosshairIcon,
  Flame as FlameIcon,
  Waves as WavesIcon,
  FileText as FileTextIcon,
  Syringe as SyringeIcon,
  Pill as PillIcon,
  TestTube as TestTubeIcon,
  Clock as ClockIcon,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  ShieldCheck as ShieldCheckIcon,
  Utensils as UtensilsIcon,
  Bone as BoneIcon,
  Dna as DnaIcon,
  FlaskConical as FlaskConicalIcon,
  Heart as HeartIcon,
  Ruler as RulerIcon,
  LineChart as LineChartIcon,
  User as UserIcon,
  Info as InfoIcon,
} from 'lucide-react';

// ======================================================
// BASE DE DATOS MAESTRA COMPLETA (RESTAURADA)
// ======================================================
const MEDICAMENTOS = {
  'Antiinfecciosos Sistémicos': [
    {
      nombre: 'Amoxicilina',
      clase: 'Penicilina',
      rutas: {
        'VO - Susp. 250mg/5ml': {
          min: 13.3,
          max: 16.6,
          maxD: 500,
          frec: 'Cada 8 h',
          conc: 250,
          vol: 5,
          admin: 'Agitar bien. Con alimentos.',
          nota: 'Dosis: 40-50 mg/kg/día.',
          efectos: 'Diarrea leve.',
        },
        'VO - Susp. 500mg/5ml': {
          min: 40,
          max: 45,
          maxD: 1000,
          frec: 'Cada 12 h',
          conc: 500,
          vol: 5,
          admin: 'Dosis alta para OMA.',
          nota: '80-90 mg/kg/día.',
          efectos: 'Diarrea.',
        },
      },
    },
    {
      nombre: 'Amoxicilina / Clavulanato',
      clase: 'Inhibidor Betalactamasa',
      rutas: {
        'VO - Susp. 400/57mg (7:1)': {
          min: 35,
          max: 45,
          maxD: 1000,
          frec: 'Cada 12 h',
          conc: 400,
          vol: 5,
          admin: 'Refrigerar tras preparar.',
          nota: 'Relación 7:1.',
          efectos: 'Diarrea frecuente.',
        },
      },
    },
    {
      nombre: 'Azitromicina',
      clase: 'Macrólido',
      rutas: {
        'VO - Susp. 200mg/5ml': {
          min: 10,
          max: 10,
          maxD: 500,
          frec: 'Cada 24 h',
          conc: 200,
          vol: 5,
          admin: '1h antes de comer.',
          nota: 'Esquema de 3 días.',
          efectos: 'Dolor abdominal.',
        },
      },
    },
    {
      nombre: 'Claritromicina',
      clase: 'Macrólido',
      rutas: {
        'VO - Susp. 250mg/5ml': {
          min: 7.5,
          max: 7.5,
          maxD: 500,
          frec: 'Cada 12 h',
          conc: 250,
          vol: 5,
          admin: 'No refrigerar (sabor amargo).',
          nota: 'Dosis: 15 mg/kg/día.',
          efectos: 'Sabor metálico.',
        },
      },
    },
    {
      nombre: 'Ceftriaxona',
      clase: 'Cefalosporina 3ra Gen',
      rutas: {
        'IV - Amp. 1g': {
          min: 50,
          max: 75,
          maxD: 2000,
          frec: 'Cada 24 h',
          admin: 'Infusión lenta 30 min.',
          nota: 'Meningitis: 100mg/kg/día.',
          efectos: 'Barro biliar.',
        },
      },
    },
    {
      nombre: 'Metronidazol',
      clase: 'Nitroimidazol',
      rutas: {
        'VO - Susp. 250mg/5ml': {
          min: 10,
          max: 16.6,
          maxD: 500,
          frec: 'Cada 8 h',
          conc: 250,
          vol: 5,
          admin: 'Dar con comida abundante.',
          nota: 'Amibiasis / Giardiasis.',
          efectos: 'Sabor metálico.',
        },
      },
    },
    {
      nombre: 'Dicloxacilina',
      clase: 'Penicilina Antiestaf.',
      rutas: {
        'VO - Susp. 250mg/5ml': {
          min: 6.25,
          max: 12.5,
          maxD: 500,
          frec: 'Cada 6 h',
          conc: 250,
          vol: 5,
          admin: 'Ayuno: 1h antes o 2h después de comer.',
          nota: 'Infecciones de piel.',
          efectos: 'Gastritis.',
        },
      },
    },
    {
      nombre: 'Aciclovir',
      clase: 'Antiviral',
      rutas: {
        'VO - Susp. 200mg/5ml': {
          min: 20,
          max: 20,
          maxD: 800,
          frec: 'Cada 6 h',
          conc: 200,
          vol: 5,
          admin: 'Iniciar en primeras 24h de exantema.',
          nota: 'Varicela: 80 mg/kg/día.',
          efectos: 'Cefalea.',
        },
      },
    },
    {
      nombre: 'Nitazoxanida',
      clase: 'Antiparasitario',
      rutas: {
        'VO - Susp. 100mg/5ml': {
          min: 7.5,
          max: 7.5,
          maxD: 500,
          frec: 'Cada 12 h',
          conc: 100,
          vol: 5,
          admin: 'Dar con alimentos. Solo 3 días.',
          nota: 'Helmintos / Protozoarios.',
          efectos: 'Orina amarilla.',
        },
      },
    },
  ],
  'Analgésicos y Antipiréticos': [
    {
      nombre: 'Paracetamol',
      clase: 'Analgésico',
      rutas: {
        'VO - Gotas 100mg/ml': {
          min: 10,
          max: 15,
          maxD: 750,
          frec: 'Cada 4-6 h',
          conc: 100,
          vol: 1,
          admin: 'Máximo 5 dosis al día.',
          nota: 'Pilar de la fiebre.',
          efectos: 'Seguro.',
        },
        'VO - Jarabe 160mg/5ml': {
          min: 10,
          max: 15,
          maxD: 1000,
          frec: 'Cada 4-6 h',
          conc: 160,
          vol: 5,
          admin: 'Usar jeringa graduada.',
          nota: 'Dosis máx: 75 mg/kg/día.',
          efectos: 'Seguro.',
        },
      },
    },
    {
      nombre: 'Metamizol (Dipirona)',
      clase: 'Pirazolona',
      rutas: {
        'VO - Jarabe 250mg/5ml': {
          min: 10,
          max: 15,
          maxD: 500,
          frec: 'Cada 8 h',
          conc: 250,
          vol: 5,
          admin: 'Dar después de alimentos.',
          nota: 'Fiebre refractaria.',
          efectos: 'Hipotensión.',
        },
      },
    },
  ],
  'Antiinflamatorios (AINEs)': [
    {
      nombre: 'Ibuprofeno',
      clase: 'AINE',
      rutas: {
        'VO - Susp. 100mg/5ml': {
          min: 5,
          max: 10,
          maxD: 400,
          frec: 'Cada 6-8 h',
          conc: 100,
          vol: 5,
          admin: 'Dar con leche o comida.',
          nota: 'Evitar en < 6 meses.',
          efectos: 'Gastritis.',
        },
      },
    },
    {
      nombre: 'Diclofenaco',
      clase: 'AINE',
      rutas: {
        'VO - Gotas 15mg/ml': {
          min: 0.5,
          max: 1.0,
          maxD: 50,
          frec: 'Cada 8-12 h',
          conc: 15,
          vol: 1,
          admin: 'Diluir gotas en agua.',
          nota: 'Dolor e inflamación.',
          efectos: 'Dolor gástrico.',
        },
      },
    },
  ],
  Antihistamínicos: [
    {
      nombre: 'Loratadina',
      clase: 'Antihistamínico 2da G',
      rutas: {
        'VO - Jarabe 1mg/ml': {
          min: 0.2,
          max: 0.2,
          maxD: 10,
          frec: 'Cada 24 h',
          conc: 1,
          vol: 1,
          admin: 'Dosis única diaria.',
          nota: 'No causa sueño.',
          efectos: 'Boca seca.',
        },
      },
    },
    {
      nombre: 'Desloratadina',
      clase: 'Antihistamínico 3ra G',
      rutas: {
        'VO - Jarabe 2.5mg/5ml': {
          min: 0.1,
          max: 0.1,
          maxD: 5,
          frec: 'Cada 24 h',
          conc: 2.5,
          vol: 5,
          admin: 'Muy seguro en niños.',
          nota: 'Rinitis alérgica.',
          efectos: 'Faringitis leve.',
        },
      },
    },
    {
      nombre: 'Cetirizina',
      clase: 'Antihistamínico',
      rutas: {
        'VO - Gotas 10mg/ml': {
          min: 0.25,
          max: 0.25,
          maxD: 10,
          frec: 'Cada 24 h',
          conc: 10,
          vol: 1,
          admin: 'Preferible por la noche.',
          nota: 'Urticaria.',
          efectos: 'Somnolencia leve.',
        },
      },
    },
  ],
  Respiratorios: [
    {
      nombre: 'Salbutamol',
      clase: 'Broncodilatador',
      rutas: {
        'Inhalado - MDI 100mcg': {
          fija: '2 disparos (200mcg)',
          frec: 'Cada 4-6 h',
          admin: 'Usar aerocámara obligatoriamente.',
          nota: 'Rescate asmático.',
          efectos: 'Taquicardia.',
        },
        'Nebulizado - 5mg/ml': {
          min: 0.15,
          max: 0.15,
          maxD: 5,
          frec: 'Cada 4-6 h',
          admin: 'Diluir en 3ml de Sol. Salina.',
          nota: 'Crisis severa.',
          efectos: 'Temblor.',
        },
      },
    },
    {
      nombre: 'Budesonida',
      clase: 'Corticoide Inhalado',
      rutas: {
        'Nebulizado - 0.250mg': {
          fija: '1 ampolleta',
          frec: 'Cada 12 h',
          admin: 'Lavar cara tras nebulizar.',
          nota: 'Laringitis / Asma.',
          efectos: 'Candidiasis oral.',
        },
      },
    },
  ],
  Gastrointestinales: [
    {
      nombre: 'Ondansetrón',
      clase: 'Antiemético',
      rutas: {
        'VO - Jarabe 4mg/5ml': {
          min: 0.15,
          max: 0.15,
          maxD: 8,
          frec: 'Cada 8-12 h',
          conc: 4,
          vol: 5,
          admin: '15 min antes del suero.',
          nota: 'Vómito en GEPI.',
          efectos: 'Cefalea.',
        },
      },
    },
    {
      nombre: 'Metoclopramida',
      clase: 'Procinético',
      rutas: {
        'VO - Gotas 4mg/ml': {
          min: 0.1,
          max: 0.15,
          maxD: 10,
          frec: 'Cada 8 h',
          conc: 4,
          vol: 1,
          admin: '30 min antes de comer.',
          nota: 'Evitar en < 1 año.',
          efectos: 'Síndrome extrapiramidal.',
        },
      },
    },
    {
      nombre: 'Omeprazol',
      clase: 'IBP',
      rutas: {
        'VO - Cáp 20mg': {
          min: 0.7,
          max: 1,
          maxD: 20,
          frec: 'Cada 24 h',
          admin: 'Ayuno estricto.',
          nota: 'Reflujo.',
          efectos: 'Diarrea.',
        },
      },
    },
    {
      nombre: 'Trimebutina',
      clase: 'Antiespasmódico',
      rutas: {
        'VO - Susp. 0.6g/100ml': {
          min: 3,
          max: 4,
          maxD: 300,
          frec: 'Cada 8 h',
          conc: 6,
          vol: 1,
          admin: 'Antes de tomas de leche.',
          nota: 'Cólico lactante.',
          efectos: 'Boca seca.',
        },
      },
    },
  ],
  'Cardio y Diuréticos': [
    {
      nombre: 'Captopril',
      clase: 'IECA',
      rutas: {
        'VO - Tabs 25mg': {
          min: 0.1,
          max: 0.5,
          maxD: 25,
          frec: 'Cada 8-12 h',
          admin: 'Ayuno estricto.',
          nota: 'Antihipertensivo.',
          efectos: 'Tos seca.',
        },
      },
    },
    {
      nombre: 'Furosemida',
      clase: 'Diurético',
      rutas: {
        'VO - Tabs 40mg': {
          min: 1,
          max: 2,
          maxD: 40,
          frec: 'Cada 12-24 h',
          admin: 'Dar por la mañana.',
          nota: 'Edema.',
          efectos: 'Hipocalemia.',
        },
      },
    },
  ],
  'Neuro y Psico': [
    {
      nombre: 'Diazepam',
      clase: 'Benzodiazepina',
      rutas: {
        'IV - Crisis': {
          min: 0.1,
          max: 0.3,
          maxD: 10,
          frec: 'Bolo lento',
          admin: 'Pasar en 3-5 min.',
          nota: 'Estatus epiléptico.',
          efectos: 'Apnea.',
        },
      },
    },
    {
      nombre: 'Ácido Valproico',
      clase: 'Antiepiléptico',
      rutas: {
        'VO - Jarabe 250mg/5ml': {
          min: 10,
          max: 15,
          maxD: 1000,
          frec: 'Cada 12 h',
          conc: 250,
          vol: 5,
          admin: 'No con bebidas carbonatadas.',
          nota: 'Mantenimiento.',
          efectos: 'Aumento peso.',
        },
      },
    },
    {
      nombre: 'Metilfenidato',
      clase: 'Estimulante',
      rutas: {
        'VO - Tabs 10mg': {
          min: 0.3,
          max: 0.3,
          maxD: 20,
          frec: 'Cada 12 h',
          admin: 'Antes de desayuno y comida.',
          nota: 'TDAH.',
          efectos: 'Anorexia.',
        },
      },
    },
  ],
  'Suplementos y Tópicos': [
    {
      nombre: 'Hierro Elemental',
      clase: 'Mineral',
      rutas: {
        'VO - Gotas 50mg/ml': {
          min: 3,
          max: 6,
          maxD: 60,
          frec: 'Cada 24 h',
          conc: 50,
          vol: 1,
          admin: 'Lejos de lácteos.',
          nota: 'Anemia.',
          efectos: 'Heces negras.',
        },
      },
    },
    {
      nombre: 'Mupirocina',
      clase: 'Antibiótico Tópico',
      rutas: {
        'Tópico - Ungüento 2%': {
          fija: 'Capa fina',
          frec: 'Cada 8 h',
          admin: 'Lavar área antes.',
          nota: 'Impétigo.',
          efectos: 'Ardor local.',
        },
      },
    },
  ],
};

// ======================================================
// ESQUEMA DE VACUNACIÓN Y LOGÍSTICA
// ======================================================
const ESQUEMA_VACUNACION = [
  {
    meses: 0,
    titulo: 'Nacimiento',
    vacunas: ['BCG (Tuberculosis)', 'Hepatitis B (1ra dosis)'],
  },
  {
    meses: 2,
    titulo: '2 Meses',
    vacunas: [
      'Hexavalente (1ra)',
      'Hepatitis B (2da)',
      'Rotavirus (1ra)',
      'Neumococo (1ra)',
    ],
  },
  {
    meses: 4,
    titulo: '4 Meses',
    vacunas: ['Hexavalente (2da)', 'Rotavirus (2da)', 'Neumococo (2da)'],
  },
  {
    meses: 6,
    titulo: '6 Meses',
    vacunas: [
      'Hexavalente (3ra)',
      'Hepatitis B (3ra)',
      'Rotavirus (3ra)',
      'Influenza (1ra)',
    ],
  },
  {
    meses: 12,
    titulo: '12 Meses',
    vacunas: ['SRP (1ra)', 'Neumococo (Refuerzo)'],
  },
  { meses: 18, titulo: '18 Meses', vacunas: ['Hexavalente (Refuerzo)'] },
  { meses: 48, titulo: '4 Años', vacunas: ['DPT (Refuerzo)'] },
  { meses: 72, titulo: '6 Años', vacunas: ['SRP (Refuerzo)'] },
];

// TABLAS OMS LMS
const LMS_DATA = {
  M: {
    months: [0, 6, 12, 24, 60, 120],
    weight: [
      { l: 0.34, m: 3.34, s: 0.14 },
      { l: -0.16, m: 7.93, s: 0.1 },
      { l: -0.27, m: 9.64, s: 0.1 },
      { l: -0.31, m: 12.15, s: 0.11 },
      { l: -0.34, m: 18.32, s: 0.13 },
      { l: -0.63, m: 31.39, s: 0.2 },
    ],
    height: [
      { l: 1, m: 49.8, s: 0.03 },
      { l: 1, m: 67.6, s: 0.03 },
      { l: 1, m: 75.7, s: 0.03 },
      { l: 1, m: 87.8, s: 0.03 },
      { l: 1, m: 110.0, s: 0.03 },
      { l: 1, m: 137.8, s: 0.04 },
    ],
    bmi: [
      { l: 0.22, m: 13.4, s: 0.08 },
      { l: -0.09, m: 17.0, s: 0.08 },
      { l: -0.1, m: 16.5, s: 0.07 },
      { l: -0.06, m: 15.6, s: 0.07 },
      { l: -0.09, m: 15.2, s: 0.08 },
      { l: -0.99, m: 16.5, s: 0.13 },
    ],
  },
  F: {
    months: [0, 6, 12, 24, 60, 120],
    weight: [
      { l: 0.43, m: 3.23, s: 0.14 },
      { l: -0.09, m: 7.29, s: 0.11 },
      { l: -0.21, m: 8.94, s: 0.11 },
      { l: -0.32, m: 11.48, s: 0.11 },
      { l: -0.27, m: 18.23, s: 0.14 },
      { l: -0.58, m: 32.32, s: 0.22 },
    ],
    height: [
      { l: 1, m: 49.1, s: 0.03 },
      { l: 1, m: 65.7, s: 0.03 },
      { l: 1, m: 74.0, s: 0.03 },
      { l: 1, m: 86.4, s: 0.03 },
      { l: 1, m: 109.3, s: 0.04 },
      { l: 1, m: 138.3, s: 0.04 },
    ],
    bmi: [
      { l: 0.04, m: 13.3, s: 0.08 },
      { l: -0.17, m: 16.5, s: 0.08 },
      { l: -0.15, m: 16.0, s: 0.08 },
      { l: -0.12, m: 15.2, s: 0.08 },
      { l: -0.04, m: 15.0, s: 0.09 },
      { l: -0.8, m: 16.7, s: 0.14 },
    ],
  },
};

function interpolateLMS(metric, sex, ageMonths) {
  const data = LMS_DATA[sex];
  let i = 0;
  while (i < data.months.length - 1 && ageMonths > data.months[i + 1]) {
    i++;
  }
  if (ageMonths <= 0) return data[metric][0];
  if (i === data.months.length - 1) return data[metric][i];
  const ratio =
    (ageMonths - data.months[i]) / (data.months[i + 1] - data.months[i]);
  const v1 = data[metric][i],
    v2 = data[metric][i + 1];
  return {
    l: v1.l + ratio * (v2.l - v1.l),
    m: v1.m + ratio * (v2.m - v1.m),
    s: v1.s + ratio * (v2.s - v1.s),
  };
}

function calculateZ(x, l, m, s) {
  return l === 0 ? Math.log(x / m) / s : (Math.pow(x / m, l) - 1) / (l * s);
}
function zToP(z) {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf =
    1 -
    ((((1.061405 * t - 1.453152) * t + 1.421413) * t - 0.284496) * t +
      0.254829) *
      t *
      Math.exp(-x * x);
  return Math.round(0.5 * (1 + sign * erf) * 100);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <div className="p-10 text-center font-bold">
          Error de navegador. Por favor recarga.
        </div>
      );
    return this.props.children;
  }
}

function MainApp() {
  const [vista, setVista] = useState('dosificacion');
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState('años');
  const [talla, setTalla] = useState('');
  const [sexo, setSexo] = useState('M');
  const [grupo, setGrupo] = useState('Antiinfecciosos Sistémicos');
  const [med, setMed] = useState('Amoxicilina');
  const [ruta, setRuta] = useState('');

  const edadMeses = useMemo(() => {
    const e = parseFloat(edad);
    return isNaN(e) ? 0 : unidadEdad === 'años' ? e * 12 : e;
  }, [edad, unidadEdad]);

  useEffect(() => {
    if (MEDICAMENTOS[grupo]) setMed(MEDICAMENTOS[grupo][0].nombre);
  }, [grupo]);
  useEffect(() => {
    const currentMed = MEDICAMENTOS[grupo]?.find((m) => m.nombre === med);
    if (currentMed?.rutas) setRuta(Object.keys(currentMed.rutas)[0]);
  }, [med, grupo]);

  const calc = useMemo(() => {
    const p = parseFloat(peso);
    if (isNaN(p) || p <= 0) return null;
    const currentMed = MEDICAMENTOS[grupo]?.find((m) => m.nombre === med);
    if (!currentMed || !currentMed.rutas || !currentMed.rutas[ruta])
      return null;
    const data = currentMed.rutas[ruta];
    if (data.fija)
      return {
        esFija: true,
        d: data.fija,
        f: data.frec,
        a: data.admin,
        n: data.nota,
        e: data.efectos,
      };
    const minMg = Math.min(p * data.min, data.maxD),
      maxMg = Math.min(p * data.max, data.maxD);
    const ml = data.conc
      ? `${((minMg / data.conc) * data.vol).toFixed(1)} - ${(
          (maxMg / data.conc) *
          data.vol
        ).toFixed(1)} ml`
      : null;
    return {
      esFija: false,
      mg: `${minMg.toFixed(1)} - ${maxMg.toFixed(1)} mg`,
      ml,
      f: data.frec,
      a: data.admin,
      n: data.nota,
      e: data.efectos,
      max: data.maxD,
    };
  }, [peso, grupo, med, ruta]);

  const nutricion = useMemo(() => {
    const p = parseFloat(peso),
      t = parseFloat(talla);
    if (isNaN(p) || isNaN(t) || t <= 0 || edadMeses <= 0) return null;
    const imcVal = p / ((t / 100) * (t / 100));
    const lmsB = interpolateLMS('bmi', sexo, edadMeses);
    const zB = calculateZ(imcVal, lmsB.l, lmsB.m, lmsB.s);
    let diag =
      zB > 2
        ? 'Obesidad'
        : zB > 1
        ? 'Sobrepeso'
        : zB < -2
        ? 'Desnutrición'
        : 'Normopeso';
    return { imc: imcVal.toFixed(1), pB: zToP(zB), zB: zB.toFixed(2), diag };
  }, [peso, talla, edadMeses, sexo]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8 font-sans selection:bg-blue-100">
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 sticky top-0 z-40 shadow-lg text-white flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <FlaskConicalIcon size={24} />{' '}
          <span className="font-black text-xl tracking-tight">
            Pediatría PRO
          </span>
        </div>
        <div className="hidden md:flex gap-2 bg-black/10 p-1 rounded-xl">
          {['dosificacion', 'inmunizaciones', 'somatometria'].map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                vista === v ? 'bg-white text-blue-600' : 'hover:bg-white/10'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50 shadow-2xl pb-[env(safe-area-inset-bottom,1rem)]">
        <button
          onClick={() => setVista('dosificacion')}
          className={`flex flex-col items-center w-20 ${
            vista === 'dosificacion' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <PillIcon size={22} />
          <span className="text-[9px] font-black uppercase mt-1">Fármacos</span>
        </button>
        <button
          onClick={() => setVista('inmunizaciones')}
          className={`flex flex-col items-center w-20 ${
            vista === 'inmunizaciones' ? 'text-cyan-600' : 'text-slate-400'
          }`}
        >
          <SyringeIcon size={22} />
          <span className="text-[9px] font-black uppercase mt-1">Vacunas</span>
        </button>
        <button
          onClick={() => setVista('somatometria')}
          className={`flex flex-col items-center w-20 ${
            vista === 'somatometria' ? 'text-violet-600' : 'text-slate-400'
          }`}
        >
          <LineChartIcon size={22} />
          <span className="text-[9px] font-black uppercase mt-1">
            Nutrición
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border-slate-100 border space-y-4">
            <h3 className="font-black text-[10px] uppercase text-slate-400 border-b pb-3 flex gap-2 tracking-[0.2em]">
              <BabyIcon size={16} /> Biometría
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-black text-3xl border-2 border-transparent focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Edad
                </label>
                <input
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold border border-transparent focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Unidad
                </label>
                <select
                  value={unidadEdad}
                  onChange={(e) => setUnidadEdad(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold text-blue-600 outline-none"
                >
                  <option value="meses">Meses</option>
                  <option value="años">Años</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Sexo
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold text-violet-600 outline-none"
                >
                  <option value="M">Niño</option>
                  <option value="F">Niña</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Talla (cm)
                </label>
                <input
                  type="number"
                  value={talla}
                  onChange={(e) => setTalla(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-xl font-bold border border-transparent focus:border-violet-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          {vista === 'dosificacion' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {Object.keys(MEDICAMENTOS).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrupo(g)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${
                      grupo === g
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white text-slate-500 border border-slate-100 shadow-sm'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-t-8 border-blue-600">
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                      Fármaco
                    </label>
                    <select
                      value={med}
                      onChange={(e) => setMed(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 mt-1"
                    >
                      {MEDICAMENTOS[grupo]
                        ? MEDICAMENTOS[grupo].map((m) => (
                            <option key={m.nombre}>{m.nombre}</option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                      Presentación
                    </label>
                    <select
                      value={ruta}
                      onChange={(e) => setRuta(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl font-black text-blue-700 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 mt-1"
                    >
                      {MEDICAMENTOS[grupo]?.find((m) => m.nombre === med)?.rutas
                        ? Object.keys(
                            MEDICAMENTOS[grupo].find((m) => m.nombre === med)
                              .rutas
                          ).map((r) => <option key={r}>{r}</option>)
                        : null}
                    </select>
                  </div>
                </div>
                {calc ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-8 rounded-[2rem] border text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                          Masa Requerida
                        </span>
                        <div className="text-4xl font-black text-slate-800 tracking-tighter">
                          {calc.esFija ? calc.d : calc.mg}
                        </div>
                        <div className="mt-4 bg-white px-4 py-2 rounded-xl border w-fit mx-auto text-blue-600 text-xs font-black uppercase">
                          {calc.f}
                        </div>
                      </div>
                      {calc.ml ? (
                        <div className="bg-blue-600 p-8 rounded-[2rem] text-white text-center shadow-lg">
                          <span className="text-[10px] font-black text-blue-100 uppercase block mb-2">
                            Volumen ml
                          </span>
                          <div className="text-5xl font-black tracking-tighter">
                            {calc.ml}
                          </div>
                          <div className="mt-4 bg-black/20 px-4 py-2 rounded-xl w-fit mx-auto text-[10px] font-black uppercase border border-white/10">
                            Confirmar Concentración
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-8 rounded-[2rem] border-dashed border-2 flex items-center justify-center text-slate-400 font-bold uppercase text-[10px]">
                          Dosis Sólida / Tópica
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                        <span className="font-black text-emerald-600 uppercase text-[9px] block mb-2 tracking-widest">
                          Admin
                        </span>
                        <p className="text-[11.5px] font-medium leading-relaxed">
                          {calc.a}
                        </p>
                      </div>
                      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <span className="font-black text-blue-600 uppercase text-[9px] block mb-2 tracking-widest">
                          Nota
                        </span>
                        <p className="text-[11.5px] italic font-medium leading-relaxed">
                          {calc.n}
                        </p>
                      </div>
                      <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                        <span className="font-black text-rose-600 uppercase text-[9px] block mb-2 tracking-widest">
                          Efectos
                        </span>
                        <p className="text-[11.5px] font-bold leading-relaxed">
                          {calc.e}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-300 font-black uppercase tracking-[0.3em] bg-slate-50 rounded-[2rem] border-dashed border-2">
                    Esperando Datos de Peso
                  </div>
                )}
              </div>
            </div>
          )}

          {vista === 'somatometria' && nutricion && (
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-t-8 border-violet-600 space-y-8 animate-in slide-in-from-bottom-6">
              <div className="flex justify-between items-center border-b pb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                    Análisis Nutricional
                  </h3>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                    Metodología OMS
                  </p>
                </div>
                <div className="bg-violet-600 text-white px-8 py-4 rounded-[2rem] text-center shadow-lg">
                  <span className="block text-[10px] font-black uppercase opacity-80 mb-1">
                    IMC
                  </span>
                  <span className="text-3xl font-black tracking-tighter">
                    {nutricion.imc}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Z-Score IMC
                  </span>
                  <div className="text-5xl font-black text-slate-800 mt-2 tracking-tighter">
                    {nutricion.zB}
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Percentil
                  </span>
                  <div className="text-5xl font-black text-slate-800 mt-2 tracking-tighter">
                    P{nutricion.pB}
                  </div>
                </div>
              </div>
              <div
                className={`p-8 rounded-[2rem] border-2 text-center shadow-sm ${
                  nutricion.diag === 'Normopeso'
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-rose-50 border-rose-100'
                }`}
              >
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-[0.3em]">
                  Diagnóstico
                </span>
                <div
                  className={`text-4xl font-black uppercase tracking-tight ${
                    nutricion.diag === 'Normopeso'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {nutricion.diag}
                </div>
              </div>
            </div>
          )}

          {vista === 'inmunizaciones' && (
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-t-8 border-cyan-500 space-y-8 animate-in fade-in">
              <div className="flex items-center gap-4 border-b pb-6">
                <ShieldCheckIcon size={32} className="text-cyan-500" />
                <h3 className="font-black text-2xl text-slate-800">
                  Cartilla Nacional de Vacunación
                </h3>
              </div>
              <div className="space-y-4">
                {ESQUEMA_VACUNACION.filter(
                  (e) => e.meses <= (edadMeses || 0)
                ).map((e) => (
                  <div
                    key={e.titulo}
                    className="flex gap-5 items-start bg-slate-50 p-5 rounded-2xl border hover:shadow-md transition-all"
                  >
                    <div className="bg-cyan-500 text-white p-2.5 rounded-xl shrink-0">
                      <ClockIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-slate-700 uppercase mb-3">
                        {e.titulo}
                      </div>
                      <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                        {e.vacunas.map((v) => (
                          <li
                            key={v}
                            className="text-[11px] font-bold text-slate-500 flex gap-2 items-center"
                          >
                            <CheckCircleIcon
                              size={14}
                              className="text-emerald-500"
                            />{' '}
                            {v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                {ESQUEMA_VACUNACION.filter((e) => e.meses <= (edadMeses || 0))
                  .length === 0 && (
                  <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest">
                    Ingresa la edad del paciente
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-8 text-center text-[8px] text-slate-400 uppercase font-black tracking-[0.5em] leading-relaxed px-6">
        Referencias: P.R. Vademécum • Taketomo • CeNSIA (México) • OMS Growth
        Standards
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
