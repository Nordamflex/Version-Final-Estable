// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Baby as BabyIcon, Activity as ActivityIcon, AlertTriangle as AlertTriangleIcon, 
  ShieldAlert as ShieldAlertIcon, Scale as ScaleIcon, Eye as EyeIcon, Ear as EarIcon, 
  Thermometer as ThermometerIcon, Search as SearchIcon, ChevronRight as ChevronRightIcon, 
  HeartPulse as HeartPulseIcon, Wind as WindIcon, Brain as BrainIcon, 
  Stethoscope as StethoscopeIcon, Droplet as DropletIcon, ClipboardList as ClipboardListIcon, 
  Beaker as BeakerIcon, CheckCircle2 as CheckCircleIcon, Zap as ZapIcon, MapPin as MapPinIcon, 
  Microscope as MicroscopeIcon, Crosshair as CrosshairIcon, Flame as FlameIcon, 
  Waves as WavesIcon, FileText as FileTextIcon, Syringe as SyringeIcon, Pill as PillIcon, 
  TestTube as TestTubeIcon, Clock as ClockIcon, Compass as CompassIcon, 
  Navigation as NavigationIcon, ShieldCheck as ShieldCheckIcon, Utensils as UtensilsIcon, 
  Bone as BoneIcon, Dna as DnaIcon, FlaskConical as FlaskConicalIcon, Heart as HeartIcon,
  Ruler as RulerIcon, LineChart as LineChartIcon, User as UserIcon, Info as InfoIcon,
  Home as HomeIcon, BookOpen as BookOpenIcon, Shield as ShieldIcon, AlertOctagon as AlertOctagonIcon,
  Frown as FrownIcon
} from 'lucide-react';

// ======================================================
// SUPRESIÓN GLOBAL DE ERRORES DE EXTENSIONES DE CHROME
// ======================================================
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.filename?.includes('chrome-extension://') || event.message?.includes('chrome-extension')) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('Fallo de extensión de Chrome interceptado y suprimido por seguridad.');
    }
  }, true);
}

// ======================================================
// BASE DE DATOS MAESTRA - FARMACOLOGÍA PEDIÁTRICA
// ======================================================
const MEDICAMENTOS = {
  "Antiinfecciosos Sistémicos": [
    {
      nombre: "Amoxicilina (Amoxil, Penamox)", clase: "Penicilina",
      rutas: {
        "VO - Susp. 250mg/5ml": { min: 13.3, max: 16.6, maxD: 500, frec: "Cada 8 h", conc: 250, vol: 5, admin: "Agitar bien. Con alimentos.", nota: "Dosis estándar: 40-50 mg/kg/día.", efectos: "Diarrea leve, exantema." },
        "VO - Susp. 500mg/5ml": { min: 40, max: 45, maxD: 1000, frec: "Cada 12 h", conc: 500, vol: 5, admin: "Dosis alta para OMA.", nota: "80-90 mg/kg/día.", efectos: "Diarrea." },
        "VO - Cápsula 500mg": { fija: "1 cápsula (500mg)", frec: "Cada 8 h", admin: "Con alimentos.", nota: "Niños > 40kg.", efectos: "Diarrea, malestar GI." }
      }
    },
    {
      nombre: "Amoxicilina / Clavulanato (Augmentin, Clavulin)", clase: "Inhibidor Betalactamasa",
      rutas: {
        "VO - Susp. 250/62.5mg": { min: 13.3, max: 16.6, maxD: 500, frec: "Cada 8 h", conc: 250, vol: 5, admin: "Refrigerar tras preparar.", nota: "Esquema dosis baja.", efectos: "Diarrea frecuente." },
        "VO - Susp. 400/57mg (7:1)": { min: 35, max: 45, maxD: 1000, frec: "Cada 12 h", conc: 400, vol: 5, admin: "Refrigerar tras preparar.", nota: "Relación 7:1.", efectos: "Alta tasa de diarrea." }
      }
    },
    {
      nombre: "Cefalexina (Keflex)", clase: "Cefalosporina 1ra Gen",
      rutas: {
        "VO - Susp. 250mg/5ml": { min: 6.25, max: 12.5, maxD: 1000, frec: "Cada 6 h", conc: 250, vol: 5, admin: "Independiente de alimentos.", nota: "Infección piel y tejidos blandos.", efectos: "Náuseas, vómito." }
      }
    },
    {
      nombre: "TMP / SMX (Bactrim, Septrin)", clase: "Sulfonamida",
      rutas: {
        "VO - Susp. 40/200mg/5ml": { min: 4, max: 5, maxD: 160, frec: "Cada 12 h", conc: 40, vol: 5, admin: "Dar con abundante agua.", nota: "Dosis basada en componente TMP (8-10 mg/kg/día).", efectos: "Rash, Síndrome Stevens-Johnson." }
      }
    },
    {
      nombre: "Azitromicina (Azitrocin)", clase: "Macrólido",
      rutas: {
        "VO - Susp. 200mg/5ml": { min: 10, max: 10, maxD: 500, frec: "Cada 24 h", conc: 200, vol: 5, admin: "1h antes de comer.", nota: "Esquema corto de 3 a 5 días.", efectos: "Dolor abdominal, arritmia." }
      }
    },
    {
      nombre: "Claritromicina (Klaricid)", clase: "Macrólido",
      rutas: {
        "VO - Susp. 250mg/5ml": { min: 7.5, max: 7.5, maxD: 500, frec: "Cada 12 h", conc: 250, vol: 5, admin: "Con o sin comida.", nota: "Dosis: 15 mg/kg/día.", efectos: "Sabor metálico." }
      }
    },
    {
      nombre: "Clindamicina (Dalacin C)", clase: "Lincosamida",
      rutas: {
        "VO - Susp. 75mg/5ml": { min: 6.25, max: 8.3, maxD: 450, frec: "Cada 6-8 h", conc: 75, vol: 5, admin: "Con vaso lleno de agua.", nota: "Infecciones dentales/piel.", efectos: "Diarrea por C. difficile." }
      }
    },
    {
      nombre: "Ceftriaxona (Rocephin, Megion)", clase: "Cefalosporina 3ra Gen",
      rutas: {
        "IV - Amp. 1g": { min: 50, max: 75, maxD: 2000, frec: "Cada 24 h", admin: "Infusión lenta 30 min.", nota: "Meningitis: 100mg/kg/día div c/12h.", efectos: "Barro biliar." },
        "IM - Amp. 500mg": { min: 50, max: 75, maxD: 1000, frec: "Cada 24 h", admin: "Diluir con lidocaína 1%.", nota: "Vía dolorosa.", efectos: "Induración local." }
      }
    },
    {
      nombre: "Metronidazol (Flagyl, Flagenase)", clase: "Nitroimidazol",
      rutas: {
        "VO - Susp. 250mg/5ml": { min: 10, max: 16.6, maxD: 500, frec: "Cada 8 h", conc: 250, vol: 5, admin: "Dar con comida abundante para enmascarar el sabor.", nota: "Amibiasis / Giardiasis.", efectos: "Sabor metálico persistente, náusea." }
      }
    },
    {
      nombre: "Nitazoxanida (Daxon, Paramix)", clase: "Antiparasitario",
      rutas: {
        "VO - Susp. 100mg/5ml": { min: 7.5, max: 7.5, maxD: 500, frec: "Cada 12 h", conc: 100, vol: 5, admin: "Dar con alimentos. Tratamiento exacto de 3 días.", nota: "Amplio espectro (Amebas/Giardia/Helmintos).", efectos: "Orina color verde-amarillento." }
      }
    },
    {
      nombre: "Ivermectina (Ivexterm)", clase: "Antihelmíntico",
      rutas: {
        "VO - Tabs 6mg": { min: 0.2, max: 0.2, maxD: 12, frec: "Dosis Única", admin: "Dosis de 200 mcg/kg. Tomar en ayunas.", nota: "Pediculosis/Escabiosis. Repetir a los 7-14 días.", efectos: "Astenia, mialgia." }
      }
    },
    {
      nombre: "Aciclovir (Zovirax, Cicloferon)", clase: "Antiviral",
      rutas: {
        "VO - Susp. 200mg/5ml": { min: 20, max: 20, maxD: 800, frec: "Cada 6 h", conc: 200, vol: 5, admin: "Iniciar primeras 24-48 hrs del exantema.", nota: "Dosis Varicela: 80 mg/kg/día.", efectos: "Malestar GI." }
      }
    },
    {
      nombre: "Fluconazol (Diflucan)", clase: "Antimicótico Sistémico",
      rutas: {
        "VO - Susp. 50mg/5ml": { min: 3, max: 6, maxD: 400, frec: "Cada 24 h", conc: 50, vol: 5, admin: "Dosis de carga el primer día.", nota: "Candidiasis orofaríngea.", efectos: "Hepatotoxicidad leve." }
      }
    }
  ],
  "Analgésicos y Antipiréticos": [
    {
      nombre: "Paracetamol (Tempra, Tylenol)", clase: "Analgésico no opioide",
      rutas: {
        "VO - Gotas 100mg/ml": { min: 10, max: 15, maxD: 750, frec: "Cada 4-6 h", conc: 100, vol: 1, admin: "Máximo 5 dosis al día.", nota: "Antipirético de 1ra línea.", efectos: "Hepatotoxicidad en sobredosis." },
        "VO - Jarabe 160mg/5ml": { min: 10, max: 15, maxD: 1000, frec: "Cada 4-6 h", conc: 160, vol: 5, admin: "Usar jeringa graduada.", nota: "Dosis máx: 75 mg/kg/día.", efectos: "Seguro a dosis correctas." },
        "Rectal - Supositorio": { min: 15, max: 20, maxD: 1000, frec: "Cada 6 h", admin: "Vía útil en caso de vómito persistente.", nota: "Absorción errática.", efectos: "Irritación local." },
        "IV - Infusión 10mg/ml": { min: 10, max: 15, maxD: 1000, frec: "Cada 6 h", admin: "Infusión estricta en 15 min.", nota: "Uso hospitalario.", efectos: "Hipotensión transitoria." }
      }
    },
    {
      nombre: "Ibuprofeno (Motrin, Advil)", clase: "AINE",
      rutas: {
        "VO - Susp. 100mg/5ml": { min: 5, max: 10, maxD: 400, frec: "Cada 6-8 h", conc: 100, vol: 5, admin: "Dar con leche o comida.", nota: "Evitar en < 6 meses.", efectos: "Gastritis leve." },
        "VO - Susp. 200mg/5ml (Forte)": { min: 5, max: 10, maxD: 400, frec: "Cada 6-8 h", conc: 200, vol: 5, admin: "Agitar bien. Concentración doble.", nota: "Ideal para escolares.", efectos: "Dolor estomacal." }
      }
    },
    {
      nombre: "Diclofenaco (Cataflam Ped)", clase: "AINE",
      rutas: {
        "VO - Gotas 15mg/ml": { min: 0.5, max: 1.0, maxD: 50, frec: "Cada 8-12 h", conc: 15, vol: 1, admin: "Diluir gotas en agua. Con alimentos.", nota: "Dolor somático e inflamación.", efectos: "Irritación gástrica severa." }
      }
    },
    {
      nombre: "Naproxeno (Flanax, Dafloxen)", clase: "AINE",
      rutas: {
        "VO - Susp. 125mg/5ml": { min: 5, max: 7.5, maxD: 500, frec: "Cada 12 h", conc: 125, vol: 5, admin: "Protección gástrica recomendada.", nota: "Efecto prolongado.", efectos: "Dispepsia." }
      }
    },
    {
      nombre: "Ketorolaco (Supradol, Dolac)", clase: "AINE Potente",
      rutas: {
        "IV/IM - Amp. 30mg": { min: 0.5, max: 0.5, maxD: 30, frec: "Cada 6-8 h", admin: "Uso máximo 48-72h.", nota: "Dolor postquirúrgico.", efectos: "Sangrado GI, nefrotoxicidad." }
      }
    },
    {
      nombre: "Metamizol (Neo-Melubrina)", clase: "Pirazolona",
      rutas: {
        "VO - Jarabe 250mg/5ml": { min: 10, max: 15, maxD: 500, frec: "Cada 8 h", conc: 250, vol: 5, admin: "Dar después de alimentos.", nota: "Fiebre refractaria.", efectos: "Hipotensión." },
        "IM/IV - Amp. 1g/2ml": { min: 10, max: 20, maxD: 1000, frec: "Cada 8 h", admin: "IV MUY LENTO (>15min) diluido.", nota: "Peligro de choque rápido.", efectos: "Choque anafilactoide." }
      }
    }
  ],
  "Corticosteroides": [
    {
      nombre: "Dexametasona (Alin, Decadron)", clase: "Corticoide potente",
      rutas: {
        "IM/VO - Crisis Crup/Asma": { min: 0.6, max: 0.6, maxD: 16, frec: "Dosis Única", admin: "Puede darse la ampolleta vía oral mezclada con jugo.", nota: "Potente antiinflamatorio de vía aérea.", efectos: "Irritabilidad." }
      }
    },
    {
      nombre: "Prednisona (Meticorten)", clase: "Corticoide oral",
      rutas: {
        "VO - Tabletas 5mg/50mg": { min: 1, max: 2, maxD: 60, frec: "Cada 24 h", admin: "Dar por la mañana para mimetizar ciclo circadiano.", nota: "Crisis asmática: Esquema de 3 a 5 días.", efectos: "Aumento de apetito, insomnio." }
      }
    },
    {
      nombre: "Prednisolona (Fisopred)", clase: "Corticoide oral",
      rutas: {
        "VO - Solución 1mg/ml o 3mg/ml": { min: 1, max: 2, maxD: 60, frec: "Cada 24 h", conc: 1, vol: 1, admin: "Mejor tolerancia gástrica y sabor que prednisona.", nota: "Exacerbación asmática.", efectos: "Inquietud." }
      }
    }
  ],
  "Antigripales y Combinados": [
    {
      nombre: "Paracetamol / Amantadina / Clorfenamina (Antiflu-Des)", clase: "Antigripal",
      rutas: {
        "VO - Gotas (Infantil)": { fija: "1 a 2 gotas por kg", frec: "Cada 8 h", admin: "Vía Oral.", nota: "Contiene 300mg Paracetamol, 50mg Amantadina, 2mg Clorfenamina por ml. No exceder 5 días.", efectos: "Somnolencia, sequedad de boca." },
        "VO - Jarabe (Infantil)": { fija: "3 a 5 años: 5ml | 6 a 12 años: 10ml", frec: "Cada 8 h", admin: "Vía Oral.", nota: "Contiene 3g Paracetamol, 0.5g Amantadina, 0.02g Clorfenamina por 100ml.", efectos: "Somnolencia, excitación paradójica." }
      }
    },
    {
      nombre: "Loratadina / Fenilefrina (Sensibit D)", clase: "Antihistamínico + Descongestionante",
      rutas: {
        "VO - Jarabe (Infantil)": { fija: "2 a 5 años: 2.5ml | 6 a 12 años: 5ml", frec: "Cada 12 h", admin: "Vía Oral.", nota: "Contiene 100mg Loratadina, 20mg Fenilefrina por 100ml. Evitar en menores de 2 años.", efectos: "Insomnio, taquicardia leve." },
        "VO - Sol. Gotas (Ped)": { fija: "1 gota por kg", frec: "Cada 12 h", admin: "Vía Oral.", nota: "Para pacientes menores a 2 años bajo supervisión estricta.", efectos: "Boca seca, nerviosismo." }
      }
    },
    {
      nombre: "Ibuprofeno / Pseudoefedrina (Motrin Cold Infantil)", clase: "AINE + Descongestionante",
      rutas: {
        "VO - Susp. 100mg/15mg por 5ml": { fija: "2 a 5 años: 5ml | 6 a 12 años: 10ml", frec: "Cada 6 h", admin: "Con alimentos.", nota: "Precaución en niños con cardiopatías o hiperactividad.", efectos: "Irritación gástrica, insomnio agudo." }
      }
    },
    {
      nombre: "Dextrometorfano / Ambroxol (Histiacil NF)", clase: "Antitusígeno + Mucolítico",
      rutas: {
        "VO - Jarabe (Infantil)": { fija: "2 a 5 años: 2.5ml | 6 a 12 años: 5ml", frec: "Cada 6-8 h", admin: "Vía Oral.", nota: "Uso exclusivo en tos irritativa con secreciones adherentes. Evitar en < 2 años.", efectos: "Náuseas, mareo leve." }
      }
    },
    {
      nombre: "Butilhioscina / Paracetamol (Buscapina Compositum)", clase: "Antiespasmódico + Analgésico",
      rutas: {
        "VO - Gotas (Ped)": { fija: "1 a 2 gotas por kg", frec: "Cada 8 h", admin: "Vía Oral.", nota: "Indicado para espasmos gastrointestinales dolorosos.", efectos: "Sequedad de boca, taquicardia, retención urinaria." }
      }
    }
  ],
  "Respiratorios y Antialérgicos": [
    {
      nombre: "Salbutamol (Ventolin)", clase: "Broncodilatador",
      rutas: {
        "Inhalado - MDI 100mcg": { fija: "2 disparos (200mcg)", frec: "Cada 4-6 h", admin: "Usar aerocámara obligatoriamente.", nota: "Rescate asmático.", efectos: "Taquicardia, temblor." },
        "Nebulizado - 5mg/ml": { min: 0.15, max: 0.15, maxD: 5, frec: "Cada 4-6 h", admin: "Diluir en 3ml de Sol. Salina.", nota: "Crisis asmática en urgencias.", efectos: "Hipocalemia." },
        "VO - Jarabe 2mg/5ml": { min: 0.1, max: 0.15, maxD: 4, frec: "Cada 8 h", conc: 2, vol: 5, admin: "Vía de segunda elección (menor eficacia, más efectos adversos).", nota: "Broncoespasmo leve.", efectos: "Taquicardia pronunciada." }
      }
    },
    {
      nombre: "Budesonida (Pulmicort)", clase: "Corticoide Inhalado",
      rutas: {
        "Nebulizado - 0.250mg": { fija: "1 ampolleta", frec: "Cada 12 h", admin: "Lavar cara y boca tras nebulizar.", nota: "Laringitis / Asma.", efectos: "Candidiasis oral." }
      }
    },
    {
      nombre: "Montelukast (Singulair)", clase: "Antileucotrieno",
      rutas: {
        "VO - Sobres 4mg (<5 años)": { fija: "1 sobre (4mg)", frec: "Cada 24 h", admin: "Mezclar con puré frío. Dar por la noche.", nota: "Prevención de asma.", efectos: "Alteraciones del sueño." },
        "VO - Tab Mast 5mg (6-14 años)": { fija: "1 tableta (5mg)", frec: "Cada 24 h", admin: "Masticar bien. Noche.", nota: "Asma moderado.", efectos: "Cefalea." }
      }
    },
    {
      nombre: "Loratadina (Laritol, Clarityne)", clase: "Antihistamínico 2da G",
      rutas: {
        "VO - Jarabe 1mg/ml": { min: 0.2, max: 0.2, maxD: 10, frec: "Cada 24 h", conc: 1, vol: 1, admin: "Dosis <30kg: 5mg. >30kg: 10mg.", nota: "No causa sedación.", efectos: "Boca seca." }
      }
    },
    {
      nombre: "Desloratadina (Aviant, Azomyr)", clase: "Antihistamínico 3ra G",
      rutas: {
        "VO - Jarabe 2.5mg/5ml": { min: 0.1, max: 0.1, maxD: 5, frec: "Cada 24 h", conc: 2.5, vol: 5, admin: "Muy seguro en niños.", nota: "Rinitis alérgica.", efectos: "Faringitis leve." }
      }
    },
    {
      nombre: "Cetirizina (Zyrtec, Virlix)", clase: "Antihistamínico",
      rutas: {
        "VO - Gotas 10mg/ml": { min: 0.25, max: 0.25, maxD: 10, frec: "Cada 24 h", conc: 10, vol: 1, admin: "Preferible por la tarde/noche.", nota: "Urticaria/Alergias.", efectos: "Somnolencia leve." }
      }
    },
    {
      nombre: "Ambroxol (Mucosolvan, Histiacil)", clase: "Mucolítico",
      rutas: {
        "VO - Jarabe 15mg/5ml": { min: 1.5, max: 2.0, maxD: 90, frec: "Cada 8-12 h", conc: 15, vol: 5, admin: "Incrementar ingesta de líquidos.", nota: "Tos con flema.", efectos: "Molestia gástrica." }
      }
    },
    {
      nombre: "Dextrometorfano (Romilar, Athos)", clase: "Antitusígeno",
      rutas: {
        "VO - Jarabe 15mg/5ml": { min: 1, max: 1.5, maxD: 60, frec: "Cada 6-8 h", conc: 15, vol: 5, admin: "Evitar en < 2 años. Solo tos seca.", nota: "Supresión de tos irritativa.", efectos: "Mareo, letargo." }
      }
    }
  ],
  "Antiácidos y Gastrointestinales": [
    {
      nombre: "Ondansetrón (Zofran)", clase: "Antiemético",
      rutas: {
        "VO - Jarabe 4mg/5ml": { min: 0.15, max: 0.15, maxD: 8, frec: "Cada 8-12 h", conc: 4, vol: 5, admin: "Dar 15 min ANTES del suero oral.", nota: "Vómito en gastroenteritis.", efectos: "Cefalea, constipación." },
        "IV - Amp 4mg/2ml": { min: 0.15, max: 0.15, maxD: 8, frec: "Cada 8 h", admin: "Paso lento en 2-5 min.", nota: "Uso intrahospitalario.", efectos: "Prolongación QT." }
      }
    },
    {
      nombre: "Metoclopramida (Carnotprim, Plasil)", clase: "Procinético",
      rutas: {
        "VO - Gotas 4mg/ml": { min: 0.1, max: 0.15, maxD: 10, frec: "Cada 8 h", conc: 4, vol: 1, admin: "30 min antes de comer.", nota: "Evitar en < 1 año.", efectos: "Síndrome extrapiramidal (tortícolis)." }
      }
    },
    {
      nombre: "Domperidona (Motilium)", clase: "Procinético Periférico",
      rutas: {
        "VO - Susp 1mg/ml": { min: 0.25, max: 0.25, maxD: 10, frec: "Cada 8 h", conc: 1, vol: 1, admin: "Antes de alimentos.", nota: "Náuseas.", efectos: "Riesgo cardíaco en dosis altas." }
      }
    },
    {
      nombre: "Omeprazol (Losec, Inhibitron)", clase: "IBP",
      rutas: {
        "VO - Cáp 20mg": { min: 0.7, max: 1, maxD: 20, frec: "Cada 24 h", admin: "Ayuno estricto (30 min antes desayuno).", nota: "Reflujo Gastroesofágico.", efectos: "Diarrea leve." }
      }
    },
    {
      nombre: "Trimebutina (Libertrim Ped)", clase: "Antiespasmódico",
      rutas: {
        "VO - Susp. 0.6g/100ml": { min: 3, max: 4, maxD: 300, frec: "Cada 8 h", conc: 6, vol: 1, admin: "Antes de tomas de leche.", nota: "Cólico del lactante.", efectos: "Boca seca." }
      }
    },
    {
      nombre: "Senósidos A y B (Senokot)", clase: "Laxante Estimulante",
      rutas: {
        "VO - Jarabe": { fija: "2.5 - 5.0 ml", frec: "Cada 24 h", admin: "Administrar por la noche.", nota: "Uso a corto plazo para estreñimiento.", efectos: "Cólicos, dolor abdominal." }
      }
    },
    {
      nombre: "Macrogol 3350 (Contumax, Movicol)", clase: "Laxante Osmótico",
      rutas: {
        "VO - Sobres 6.9g (Ped)": { min: 0.5, max: 1.0, maxD: 17, frec: "Cada 24 h", admin: "Diluir en agua. Titular dosis.", nota: "Estreñimiento crónico.", efectos: "Meteorismo." }
      }
    }
  ],
  "Neuro y Psico": [
    {
      nombre: "Diazepam (Valium)", clase: "Benzodiazepina",
      rutas: {
        "IV - Crisis": { min: 0.1, max: 0.3, maxD: 10, frec: "Bolo lento", admin: "Pasar en 3-5 min. Mantener soporte ventilatorio cerca.", nota: "Estatus epiléptico.", efectos: "Apnea, hipotensión." },
        "Rectal - Gel (Diastat)": { min: 0.5, max: 0.5, maxD: 10, frec: "Dosis única", admin: "Comprimir glúteos tras aplicar.", nota: "Crisis extrahospitalaria.", efectos: "Letargo." }
      }
    },
    {
      nombre: "Ácido Valproico (Epival, Depakene)", clase: "Antiepiléptico",
      rutas: {
        "VO - Jarabe 250mg/5ml": { min: 10, max: 15, maxD: 1000, frec: "Cada 12 h", conc: 250, vol: 5, admin: "No dar con bebidas carbonatadas.", nota: "Mantenimiento epilepsia.", efectos: "Hepatotoxicidad, aumento peso." }
      }
    },
    {
      nombre: "Levetiracetam (Keppra)", clase: "Antiepiléptico",
      rutas: {
        "VO - Sol. 100mg/ml": { min: 10, max: 20, maxD: 1500, frec: "Cada 12 h", conc: 100, vol: 1, admin: "Con o sin alimentos.", nota: "Muy seguro a nivel hepático.", efectos: "Irritabilidad, agresividad." }
      }
    },
    {
      nombre: "Fenitoína (Epamin)", clase: "Hidantoína",
      rutas: {
        "VO - Susp. 30mg/5ml": { min: 2.5, max: 4, maxD: 300, frec: "Cada 12 h", conc: 30, vol: 5, admin: "Higiene dental estricta requerida.", nota: "Mantenimiento.", efectos: "Hiperplasia gingival, hirsutismo." }
      }
    }
  ],
  "Suplementos y Tópicos": [
    {
      nombre: "Hierro Elemental (Ferrum, Valfer)", clase: "Mineral",
      rutas: {
        "VO - Gotas 50mg/ml": { min: 3, max: 6, maxD: 60, frec: "Cada 24 h", conc: 50, vol: 1, admin: "Dar con jugo de naranja. Lejos de lácteos.", nota: "Anemia Ferropénica.", efectos: "Heces negras (normal), constipación." }
      }
    },
    {
      nombre: "Colecalciferol Vit D3 (Valmetrol)", clase: "Vitamina",
      rutas: {
        "VO - Gotas 400 UI": { fija: "1 gota (400 UI)", frec: "Cada 24 h", admin: "Directo o en leche.", nota: "Profilaxis raquitismo < 1 año.", efectos: "Seguro." }
      }
    },
    {
      nombre: "Mupirocina (Bactroban)", clase: "Antibiótico Tópico",
      rutas: {
        "Tópico - Ungüento 2%": { fija: "Capa fina", frec: "Cada 8 h", admin: "Lavar área antes de aplicar.", nota: "Impétigo / Foliculitis.", efectos: "Ardor local leve." }
      }
    }
  ]
};

// ======================================================
// DATOS DE ADOLESCENTES (HEEADSSS & TANNER)
// ======================================================
const HEEADSSS_DATA = [
  { id: "Hogar", icon: <HomeIcon size={20}/>, desc: "¿Quién vive contigo? ¿Tienes propio cuarto? ¿Relación con padres? ¿Alguien se ha ido? ¿Violencia en casa?" },
  { id: "Educación", icon: <BookOpenIcon size={20}/>, desc: "¿Qué año cursas? ¿Calificaciones? ¿Trabajas? ¿Amigos en escuela? ¿Bullying/Expulsiones?" },
  { id: "Alimentación", icon: <UtensilsIcon size={20}/>, desc: "¿Qué te disgusta de tu cuerpo? ¿Dietas/Cambio de peso reciente? ¿Cuántas veces comes al día?" },
  { id: "Actividades", icon: <ActivityIcon size={20}/>, desc: "¿Qué haces por diversión? ¿Deportes? ¿Grupos religiosos? ¿Tiempo en TV/Videojuegos?" },
  { id: "Drogas", icon: <WindIcon size={20}/>, desc: "¿Tus amigos fuman/toman? ¿Alguien en casa bebe? ¿Te han ofrecido alcohol/drogas?" },
  { id: "Sexualidad", icon: <HeartIcon size={20}/>, desc: "¿Relaciones románticas? ¿Relaciones sexuales? ¿Uso de condón/Anticonceptivos? ¿Presión o abuso?" },
  { id: "Seguridad", icon: <ShieldIcon size={20}/>, desc: "¿Cinturón de seguridad? ¿Viajado con conductor ebrio? ¿Peleas físicas? ¿Armas?" },
  { id: "Suicidio / Depresión", icon: <FrownIcon size={20}/>, desc: "¿Tristeza/Ganas de llorar? ¿Pérdida de interés? ¿Pensamientos de herirte? ¿Insomnio?" }
];

const TANNER_MUJERES = [
  { grado: "I", mamas: "Preadolescente. Sólo elevación del pezón.", vello: "Preadolescente. Sin vello púbico." },
  { grado: "II", mamas: "Botón mamario. Elevación de la mama y pezón.", vello: "Escaso, largo, ligeramente pigmentado en labios mayores." },
  { grado: "III", mamas: "Agrandamiento de mama y areola sin separación de contornos.", vello: "Más oscuro, más grueso, empieza a rizarse." },
  { grado: "IV", mamas: "Areola y pezón forman un montículo secundario por encima de la mama.", vello: "Parecido al adulto, pero sin extensión a los muslos." },
  { grado: "V", mamas: "Madura. Proyección sólo del pezón, areola retraída al contorno general.", vello: "Distribución adulta con extensión a la cara interna de los muslos." }
];

const TANNER_HOMBRES = [
  { grado: "I", genitales: "Preadolescente. Testículos, escroto y pene infantiles (<4ml).", vello: "Preadolescente. Sin vello púbico." },
  { grado: "II", genitales: "Agrandamiento de escroto y testículos (4-6ml). Piel escrotal enrojecida.", vello: "Escaso, largo, poco pigmentado en base del pene." },
  { grado: "III", genitales: "Agrandamiento del pene (longitud). Testículos continúan creciendo (8-10ml).", vello: "Más oscuro, comienza a rizarse, mayor cantidad." },
  { grado: "IV", genitales: "Aumento del grosor del pene. Escroto más oscuro. Testículos (10-15ml).", vello: "Parecido al adulto, sin extensión a los muslos." },
  { grado: "V", genitales: "Genitales adultos en tamaño y forma. Testículos (>15ml).", vello: "Distribución adulta, extensión a cara interna de muslos." }
];

// ======================================================
// ESQUEMA DE VACUNACIÓN Y TABLAS LMS OMS
// ======================================================
const ESQUEMA_VACUNACION = [
  { meses: 0, titulo: "Nacimiento", vacunas: ["BCG (Tuberculosis)", "Hepatitis B (1ra dosis)"] },
  { meses: 2, titulo: "2 Meses", vacunas: ["Hexavalente (1ra)", "Hepatitis B (2da)", "Rotavirus (1ra)", "Neumococo (1ra)"] },
  { meses: 4, titulo: "4 Meses", vacunas: ["Hexavalente (2da)", "Rotavirus (2da)", "Neumococo (2da)"] },
  { meses: 6, titulo: "6 Meses", vacunas: ["Hexavalente (3ra)", "Hepatitis B (3ra)", "Rotavirus (3ra)", "Influenza (1ra)"] },
  { meses: 12, titulo: "12 Meses", vacunas: ["SRP (1ra)", "Neumococo (Refuerzo)"] },
  { meses: 18, titulo: "18 Meses", vacunas: ["Hexavalente (Refuerzo)"] },
  { meses: 48, titulo: "4 Años", vacunas: ["DPT (Refuerzo)"] },
  { meses: 72, titulo: "6 Años", vacunas: ["SRP (Refuerzo)"] }
];

const LMS_DATA = {
    M: { months: [0, 6, 12, 24, 60, 120], weight: [{l:0.34, m:3.34, s:0.14}, {l:-0.16, m:7.93, s:0.10}, {l:-0.27, m:9.64, s:0.10}, {l:-0.31, m:12.15, s:0.11}, {l:-0.34, m:18.32, s:0.13}, {l:-0.63, m:31.39, s:0.20}], height: [{l:1, m:49.8, s:0.03}, {l:1, m:67.6, s:0.03}, {l:1, m:75.7, s:0.03}, {l:1, m:87.8, s:0.03}, {l:1, m:110.0, s:0.03}, {l:1, m:137.8, s:0.04}], bmi: [{l:0.22, m:13.4, s:0.08}, {l:-0.09, m:17.0, s:0.08}, {l:-0.10, m:16.5, s:0.07}, {l:-0.06, m:15.6, s:0.07}, {l:-0.09, m:15.2, s:0.08}, {l:-0.99, m:16.5, s:0.13}] },
    F: { months: [0, 6, 12, 24, 60, 120], weight: [{l:0.43, m:3.23, s:0.14}, {l:-0.09, m:7.29, s:0.11}, {l:-0.21, m:8.94, s:0.11}, {l:-0.32, m:11.48, s:0.11}, {l:-0.27, m:18.23, s:0.14}, {l:-0.58, m:32.32, s:0.22}], height: [{l:1, m:49.1, s:0.03}, {l:1, m:65.7, s:0.03}, {l:1, m:74.0, s:0.03}, {l:1, m:86.4, s:0.03}, {l:1, m:109.3, s:0.04}, {l:1, m:138.3, s:0.04}], bmi: [{l:0.04, m:13.3, s:0.08}, {l:-0.17, m:16.5, s:0.08}, {l:-0.15, m:16.0, s:0.08}, {l:-0.12, m:15.2, s:0.08}, {l:-0.04, m:15.0, s:0.09}, {l:-0.80, m:16.7, s:0.14}] }
};

function interpolateLMS(metric, sex, ageMonths) {
    const data = LMS_DATA[sex];
    let i = 0; while (i < data.months.length - 1 && ageMonths > data.months[i+1]) { i++; }
    if (ageMonths <= 0) return data[metric][0];
    if (i === data.months.length - 1) return data[metric][i];
    const ratio = (ageMonths - data.months[i]) / (data.months[i+1] - data.months[i]);
    const v1 = data[metric][i], v2 = data[metric][i+1];
    return { l: v1.l + ratio*(v2.l-v1.l), m: v1.m + ratio*(v2.m-v1.m), s: v1.s + ratio*(v2.s-v1.s) };
}

function calculateZ(x, l, m, s) { return l === 0 ? Math.log(x/m)/s : (Math.pow(x/m, l)-1)/(l*s); }
function zToP(z) {
    const sign = z < 0 ? -1 : 1; const x = Math.abs(z)/Math.sqrt(2); const t = 1/(1 + 0.3275911*x);
    const erf = 1 - ((((1.061405*t - 1.453152)*t + 1.421413)*t - 0.284496)*t + 0.254829)*t * Math.exp(-x*x);
    return Math.round(0.5*(1 + sign*erf)*100);
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { if (this.state.hasError) return <div className="p-10 text-center font-bold">Error de navegador. Por favor recarga.</div>; return this.props.children; }
}

function MainApp() {
  const [vista, setVista] = useState("dosificacion");
  const [subVistaAdolescente, setSubVistaAdolescente] = useState("heeadsss");
  const [subVistaLiquidos, setSubVistaLiquidos] = useState("mantenimiento");
  const [gradoDeshidratacion, setGradoDeshidratacion] = useState("leve");
  const [diaVida, setDiaVida] = useState(1);
  
  const [peso, setPeso] = useState("");
  const [edad, setEdad] = useState("");
  const [unidadEdad, setUnidadEdad] = useState("años");
  const [talla, setTalla] = useState("");
  const [sexo, setSexo] = useState("M");
  
  const [grupo, setGrupo] = useState("Antiinfecciosos Sistémicos");
  const [med, setMed] = useState("Amoxicilina (Amoxil, Penamox)");
  const [ruta, setRuta] = useState("");

  const [copiado, setCopiado] = useState(false);

  const copiarNota = (texto) => {
    const el = document.createElement('textarea');
    el.value = texto;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar', err);
    }
    document.body.removeChild(el);
  };

  const getIcon = (nombreGrupo) => {
    if (nombreGrupo.includes("Antiinfecciosos")) return <MicroscopeIcon size={14} />;
    if (nombreGrupo.includes("Analgésicos")) return <ThermometerIcon size={14} />;
    if (nombreGrupo.includes("Corticosteroides")) return <ShieldAlertIcon size={14} />;
    if (nombreGrupo.includes("Combinados")) return <BeakerIcon size={14} />;
    if (nombreGrupo.includes("Respiratorios")) return <WindIcon size={14} />;
    if (nombreGrupo.includes("Gastrointestinales")) return <DropletIcon size={14} />;
    if (nombreGrupo.includes("Neuro")) return <BrainIcon size={14} />;
    if (nombreGrupo.includes("Suplementos")) return <HeartPulseIcon size={14} />;
    return <PillIcon size={14} />;
  };

  const edadMeses = useMemo(() => { const e = parseFloat(edad); return isNaN(e) ? 0 : (unidadEdad === 'años' ? e * 12 : e); }, [edad, unidadEdad]);

  useEffect(() => { if (MEDICAMENTOS[grupo]) setMed(MEDICAMENTOS[grupo][0].nombre); }, [grupo]);
  useEffect(() => { 
    const currentMed = MEDICAMENTOS[grupo]?.find(m => m.nombre === med);
    if (currentMed?.rutas) setRuta(Object.keys(currentMed.rutas)[0]); 
  }, [med, grupo]);

  const calc = useMemo(() => {
    const p = parseFloat(peso); if (isNaN(p) || p <= 0) return null;
    const currentMed = MEDICAMENTOS[grupo]?.find(m => m.nombre === med);
    if (!currentMed || !currentMed.rutas || !currentMed.rutas[ruta]) return null;
    const data = currentMed.rutas[ruta];
    if (data.fija) return { esFija: true, d: data.fija, f: data.frec, a: data.admin, n: data.nota, e: data.efectos };
    const minMg = Math.min(p * data.min, data.maxD), maxMg = Math.min(p * data.max, data.maxD);
    const ml = data.conc ? `${(minMg/data.conc*data.vol).toFixed(1)} - ${(maxMg/data.conc*data.vol).toFixed(1)} ml` : null;
    return { esFija: false, mg: `${minMg.toFixed(1)} - ${maxMg.toFixed(1)} mg`, ml, f: data.frec, a: data.admin, n: data.nota, e: data.efectos, max: data.maxD };
  }, [peso, grupo, med, ruta]);

  const nutricion = useMemo(() => {
    const p = parseFloat(peso), t = parseFloat(talla); if (isNaN(p) || isNaN(t) || t <= 0 || edadMeses <= 0) return null;
    const imcVal = p / ((t/100)*(t/100)); const lmsB = interpolateLMS('bmi', sexo, edadMeses);
    const zB = calculateZ(imcVal, lmsB.l, lmsB.m, lmsB.s);
    let diag = zB > 2 ? "Obesidad" : zB > 1 ? "Sobrepeso" : zB < -2 ? "Desnutrición" : "Normopeso";

    let expectativas = "";
    if (edadMeses <= 1) expectativas = "Neonato: Se espera ganancia ponderal de 20-30 g/día. Presencia de reflejos primitivos (Moro, búsqueda, succión).";
    else if (edadMeses <= 6) expectativas = "Lactante (1-6m): Ganancia aprox. 600-800 g/mes y 2.5 cm/mes. Hitos: Sostén cefálico (3m), rodamientos (4-5m), inicia sedestación (6m).";
    else if (edadMeses <= 12) expectativas = "Lactante (6-12m): Ganancia aprox. 400 g/mes. Hitos: Sedestación sin apoyo (7-8m), gateo (8-10m), bipedestación (11-12m). Pinza fina.";
    else if (edadMeses <= 24) expectativas = "Lactante mayor (1-2a): Triplica el peso de nacimiento al año. Marcha independiente (12-15m). Une 2 palabras.";
    else if (edadMeses <= 60) expectativas = "Preescolar (2-5a): Ganancia de 2 kg/año y 6-8 cm/año. Hitos: Control de esfínteres (2.5-3a), lenguaje estructurado (3a), salta en un pie (4a).";
    else if (edadMeses <= 120) expectativas = "Escolar (5-10a): Ganancia constante de 3 kg/año y 5-6 cm/año. Caída de dientes temporales (6a). Desarrollo de pensamiento lógico-concreto.";
    else expectativas = "Adolescente (>10a): Estirón puberal. Desarrollo de caracteres sexuales secundarios (Tanner) y pensamiento abstracto. Riesgo de trastornos alimenticios.";

    return { imc: imcVal.toFixed(1), pB: zToP(zB), zB: zB.toFixed(2), diag, expectativas };
  }, [peso, talla, edadMeses, sexo]);

  const liquidos = useMemo(() => {
    const p = parseFloat(peso);
    if (isNaN(p) || p <= 0) return null;

    // 1. Holliday-Segar (Mantenimiento)
    let holliTotal = 0;
    if (p <= 10) holliTotal = p * 100;
    else if (p <= 20) holliTotal = 1000 + ((p - 10) * 50);
    else holliTotal = 1500 + ((p - 20) * 20);
    const holliRate = holliTotal / 24;

    // 2. Déficit por Deshidratación
    let defMultiplier = 0;
    if (edadMeses < 60) {
      if (gradoDeshidratacion === 'leve') defMultiplier = 50;
      else if (gradoDeshidratacion === 'moderada') defMultiplier = 100;
      else defMultiplier = 150;
    } else {
      if (gradoDeshidratacion === 'leve') defMultiplier = 30;
      else if (gradoDeshidratacion === 'moderada') defMultiplier = 60;
      else defMultiplier = 90;
    }
    const deficitTotal = p * defMultiplier;
    const rehidratacionTotal = holliTotal + deficitTotal;
    const rate8h = (rehidratacionTotal * 0.5) / 8;
    const rate16h = (rehidratacionTotal * 0.5) / 16;

    // 3. Requerimientos Neonatales (IMSS - 1era semana)
    let neoReq = 0;
    const d = diaVida;
    if (p < 1.0) {
      neoReq = [80, 100, 120, 130, 140, 150, 160][d - 1];
    } else if (p <= 1.5) {
      neoReq = [80, 95, 110, 120, 130, 140, 150][d - 1];
    } else {
      neoReq = [60, 75, 90, 105, 120, 135, 150][d - 1];
    }
    const neoTotal = neoReq * p;
    const neoRate = neoTotal / 24;

    return {
      holliTotal: Math.round(holliTotal),
      holliRate: holliRate.toFixed(1),
      deficitTotal: Math.round(deficitTotal),
      rehidratacionTotal: Math.round(rehidratacionTotal),
      rate8h: rate8h.toFixed(1),
      rate16h: rate16h.toFixed(1),
      neoReq,
      neoTotal: Math.round(neoTotal),
      neoRate: neoRate.toFixed(1)
    };
  }, [peso, edadMeses, gradoDeshidratacion, diaVida]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 md:pb-8 font-sans selection:bg-blue-100">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 sticky top-0 z-40 shadow-lg text-white flex justify-between items-center px-6">
        <div className="flex items-center gap-2"><FlaskConicalIcon size={24}/> <span className="font-black text-xl tracking-tight">Pediatría PRO</span></div>
        <div className="hidden md:flex gap-1.5 bg-black/10 p-1 rounded-xl overflow-x-auto">
            {[{id: 'dosificacion', icon: <PillIcon size={14}/>, label: 'Fármacos'},
              {id: 'inmunizaciones', icon: <SyringeIcon size={14}/>, label: 'Vacunas'},
              {id: 'somatometria', icon: <LineChartIcon size={14}/>, label: 'Nutrición'},
              {id: 'liquidos', icon: <DropletIcon size={14}/>, label: 'Líquidos'},
              {id: 'adolescente', icon: <UserIcon size={14}/>, label: 'Adolescentes'}].map(v => (
                <button key={v.id} onClick={() => setVista(v.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${vista === v.id ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/10'}`}>
                  {v.icon} {v.label}
                </button>
            ))}
        </div>
      </nav>

      {/* NAVBAR INFERIOR MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex p-1 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0.5rem)] overflow-x-auto no-scrollbar">
        {[{id: 'dosificacion', icon: <PillIcon size={20}/>, label: 'Fármacos'},
          {id: 'inmunizaciones', icon: <SyringeIcon size={20}/>, label: 'Vacunas'},
          {id: 'somatometria', icon: <LineChartIcon size={20}/>, label: 'Nutrición'},
          {id: 'liquidos', icon: <DropletIcon size={20}/>, label: 'Líquidos'},
          {id: 'adolescente', icon: <UserIcon size={20}/>, label: 'Adol.'}].map(v => (
            <button key={v.id} onClick={() => setVista(v.id)} className={`min-w-[70px] flex-1 flex flex-col items-center py-2 mx-0.5 rounded-xl transition-all ${vista === v.id ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
              {v.icon}
              <span className="text-[8px] font-black uppercase mt-1">{v.label}</span>
            </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 grid lg:grid-cols-12 gap-6">
        
        {/* PANEL LATERAL BIOMETRÍA */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border-slate-100 border space-y-4">
            <h3 className="font-black text-[10px] uppercase text-slate-400 border-b pb-3 flex gap-2 tracking-[0.2em]"><BabyIcon size={16}/> Biometría del Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Peso Corporal (kg)</label><input type="number" value={peso} onChange={e=>setPeso(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-3xl border-2 border-transparent focus:border-blue-500 outline-none transition-all"/></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Edad</label><input type="number" value={edad} onChange={e=>setEdad(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold border border-transparent focus:border-blue-500 outline-none"/></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Unidad</label><select value={unidadEdad} onChange={e=>setUnidadEdad(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-blue-600 outline-none"><option value="meses">Meses</option><option value="años">Años</option></select></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Sexo</label><select value={sexo} onChange={e=>setSexo(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-violet-600 outline-none"><option value="M">Niño</option><option value="F">Niña</option></select></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Talla (cm)</label><input type="number" value={talla} onChange={e=>setTalla(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold border border-transparent focus:border-violet-500 outline-none"/></div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-[2rem] text-white hidden lg:block">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-400 mb-2">Seguridad S4S</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">Todas las dosis están topadas al máximo adulto fisiológico para evitar eventos adversos.</p>
          </div>
        </div>

        {/* PANEL PRINCIPAL DINÁMICO */}
        <div className="lg:col-span-8">
            
            {/* DOSIFICACIÓN */}
            {vista === 'dosificacion' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {Object.keys(MEDICAMENTOS).map(g => (
                            <button key={g} onClick={()=>setGrupo(g)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${grupo===g?'bg-blue-600 text-white shadow-lg shadow-blue-500/30':'bg-white text-slate-500 border border-slate-100 shadow-sm hover:bg-blue-50'}`}>
                                {getIcon(g)} {g}
                            </button>
                        ))}
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-t-8 border-blue-600">
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div><label className="text-[9px] font-black uppercase text-slate-400 ml-2">Fármaco Comercial</label><select value={med} onChange={e=>setMed(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 mt-1">{MEDICAMENTOS[grupo] ? MEDICAMENTOS[grupo].map(m=><option key={m.nombre}>{m.nombre}</option>) : null}</select></div>
                            <div><label className="text-[9px] font-black uppercase text-slate-400 ml-2">Presentación</label><select value={ruta} onChange={e=>setRuta(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-blue-700 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 mt-1">{MEDICAMENTOS[grupo]?.find(m=>m.nombre===med)?.rutas ? Object.keys(MEDICAMENTOS[grupo].find(m=>m.nombre===med).rutas).map(r=><option key={r}>{r}</option>) : null}</select></div>
                        </div>
                        {calc ? (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Masa Requerida / Dosis</span><div className="text-4xl font-black text-slate-800 tracking-tighter">{calc.esFija?calc.d:calc.mg}</div><div className="mt-4 bg-white px-4 py-2 rounded-xl border w-fit mx-auto text-blue-600 text-xs font-black uppercase">{calc.f}</div></div>
                                    {calc.ml ? (<div className="bg-blue-600 p-8 rounded-[2rem] text-white text-center shadow-lg"><span className="text-[10px] font-black text-blue-100 uppercase block mb-2">Volumen ml</span><div className="text-5xl font-black tracking-tighter">{calc.ml}</div><div className="mt-4 bg-black/20 px-4 py-2 rounded-xl w-fit mx-auto text-[10px] font-black uppercase border border-white/10">Confirmar Concentración</div></div>) : (<div className="bg-slate-50 p-8 rounded-[2rem] border-dashed border-2 flex items-center justify-center text-slate-400 font-bold uppercase text-[10px]">Dosis Sólida / Tópica</div>)}
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100"><span className="font-black text-emerald-600 uppercase text-[9px] block mb-2 tracking-widest">Admin</span><p className="text-[11.5px] font-medium leading-relaxed">{calc.a}</p></div>
                                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100"><span className="font-black text-blue-600 uppercase text-[9px] block mb-2 tracking-widest">Nota</span><p className="text-[11.5px] italic font-medium leading-relaxed">{calc.n}</p></div>
                                    <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100"><span className="font-black text-rose-600 uppercase text-[9px] block mb-2 tracking-widest">Efectos</span><p className="text-[11.5px] font-bold leading-relaxed">{calc.e}</p></div>
                                </div>
                            </div>
                        ) : <div className="text-center py-24 text-slate-300 font-black uppercase tracking-[0.3em] bg-slate-50 rounded-[2rem] border-dashed border-2">Esperando Datos de Peso</div>}
                    </div>
                </div>
            )}

            {/* SOMATOMETRÍA */}
            {vista === 'somatometria' && nutricion && (
                <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-t-8 border-violet-600 space-y-8 animate-in slide-in-from-bottom-6">
                    <div className="flex justify-between items-center border-b pb-6">
                        <div><h3 className="text-3xl font-black text-slate-800 tracking-tight">Análisis Nutricional</h3><p className="text-[10px] font-bold uppercase text-slate-400 mt-1">Metodología OMS</p></div>
                        <div className="bg-violet-600 text-white px-8 py-4 rounded-[2rem] text-center shadow-lg"><span className="block text-[10px] font-black uppercase opacity-80 mb-1">IMC</span><span className="text-3xl font-black tracking-tighter">{nutricion.imc}</span></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-6 rounded-[2rem] text-center border"><span className="text-[10px] font-black text-slate-400 uppercase">Z-Score IMC</span><div className="text-4xl font-black text-slate-800 mt-2 tracking-tighter">{nutricion.zB}</div></div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] text-center border"><span className="text-[10px] font-black text-slate-400 uppercase">Percentil</span><div className="text-4xl font-black text-slate-800 mt-2 tracking-tighter">P{nutricion.pB}</div></div>
                        <div className={`p-6 rounded-[2rem] border-2 text-center flex flex-col justify-center shadow-sm ${nutricion.diag === 'Normopeso' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}><span className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Diagnóstico</span><div className={`text-2xl font-black uppercase tracking-tight ${nutricion.diag === 'Normopeso' ? 'text-emerald-600' : 'text-rose-600'}`}>{nutricion.diag}</div></div>
                    </div>
                    <div className="bg-violet-50/50 p-8 rounded-[2rem] border border-violet-100 mt-8">
                         <h4 className="flex items-center gap-3 font-black text-violet-800 mb-4 uppercase text-[11px] tracking-[0.2em]"><BrainIcon className="text-violet-600" size={20} /> Hitos del Desarrollo</h4>
                         <p className="text-sm text-violet-900/80 font-medium leading-relaxed">{nutricion.expectativas}</p>
                    </div>
                </div>
            )}

            {/* INMUNIZACIONES */}
            {vista === 'inmunizaciones' && (
                <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-t-8 border-cyan-500 space-y-8 animate-in fade-in">
                    <div className="flex items-center gap-4 border-b pb-6"><ShieldCheckIcon size={32} className="text-cyan-500" /><h3 className="font-black text-2xl text-slate-800">Cartilla Nacional de Vacunación</h3></div>
                    <div className="space-y-4">
                      {ESQUEMA_VACUNACION.filter(e => e.meses <= (edadMeses || 0)).map(e => (
                          <div key={e.titulo} className="flex gap-5 items-start bg-slate-50 p-5 rounded-2xl border hover:shadow-md transition-all">
                              <div className="bg-cyan-500 text-white p-2.5 rounded-xl shrink-0"><ClockIcon size={18}/></div>
                              <div className="flex-1">
                                <div className="font-black text-sm text-slate-700 uppercase mb-3">{e.titulo}</div>
                                <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">{e.vacunas.map(v => <li key={v} className="text-[11px] font-bold text-slate-500 flex gap-2 items-center"><CheckCircleIcon size={14} className="text-emerald-500"/> {v}</li>)}</ul>
                              </div>
                          </div>
                      ))}
                      {ESQUEMA_VACUNACION.filter(e => e.meses <= (edadMeses || 0)).length === 0 && <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest">Ingresa la edad del paciente</div>}
                    </div>
                </div>
            )}

            {/* ADOLESCENTE */}
            {vista === 'adolescente' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {[{id:'heeadsss', label:'Test HEEADSSS'}, {id:'tanner', label:'Escala Tanner'}, {id:'gineco', label:'Gineco/Anticonceptivos'}, {id:'trastornos', label:'Trastornos y Adicciones'}].map(s => (
                            <button key={s.id} onClick={()=>setSubVistaAdolescente(s.id)} className={`px-5 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${subVistaAdolescente===s.id?'bg-indigo-600 text-white shadow-lg':'bg-white text-slate-500 border shadow-sm'}`}>{s.label}</button>
                        ))}
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-t-8 border-indigo-600">
                        {subVistaAdolescente === 'heeadsss' && (
                            <div>
                                <h3 className="font-black text-2xl text-slate-800 border-b pb-4 mb-6">Entrevista Psicosocial (HEEADSSS)</h3>
                                <p className="text-xs text-slate-500 mb-6 font-medium">Herramienta estructurada para evaluación del adolescente. Realizar preguntas abiertas y sin juicios de valor.</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {HEEADSSS_DATA.map(h => (
                                        <div key={h.id} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex gap-4 items-start">
                                            <div className="bg-indigo-500 text-white p-2 rounded-lg shrink-0">{h.icon}</div>
                                            <div><span className="font-black text-indigo-900 text-xs uppercase block mb-1">{h.id}</span><p className="text-[11px] text-indigo-900/80 font-medium leading-relaxed">{h.desc}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {subVistaAdolescente === 'tanner' && (
                            <div>
                                <h3 className="font-black text-2xl text-slate-800 border-b pb-4 mb-6">Escala de Desarrollo de Tanner</h3>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
                                        <h4 className="font-black text-pink-600 uppercase text-sm mb-4">Mujeres</h4>
                                        <div className="space-y-4">
                                            {TANNER_MUJERES.map(t => (
                                                <div key={t.grado} className="bg-white p-4 rounded-xl shadow-sm"><span className="font-black text-pink-500 block mb-1">Grado {t.grado}</span><p className="text-[11px] text-slate-600"><b>Mamas:</b> {t.mamas}</p><p className="text-[11px] text-slate-600 mt-1"><b>Vello:</b> {t.vello}</p></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                        <h4 className="font-black text-blue-600 uppercase text-sm mb-4">Hombres</h4>
                                        <div className="space-y-4">
                                            {TANNER_HOMBRES.map(t => (
                                                <div key={t.grado} className="bg-white p-4 rounded-xl shadow-sm"><span className="font-black text-blue-500 block mb-1">Grado {t.grado}</span><p className="text-[11px] text-slate-600"><b>Genitales:</b> {t.genitales}</p><p className="text-[11px] text-slate-600 mt-1"><b>Vello:</b> {t.vello}</p></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {subVistaAdolescente === 'gineco' && (
                            <div className="space-y-8">
                                <h3 className="font-black text-2xl text-slate-800 border-b pb-4">Ginecología y Anticoncepción</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border"><h4 className="font-black text-slate-700 text-xs uppercase mb-3"><ActivityIcon size={16} className="inline mr-1 text-pink-500"/> Ciclo Normal</h4><ul className="text-xs text-slate-600 space-y-2 font-medium"><li><b>Menarquia media:</b> 12.43 años</li><li><b>Duración ciclo:</b> 21 a 45 días</li><li><b>Sangrado:</b> Promedio 7 días (3-6 toallas)</li></ul></div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border"><h4 className="font-black text-slate-700 text-xs uppercase mb-3"><AlertOctagonIcon size={16} className="inline mr-1 text-rose-500"/> Dismenorrea</h4><p className="text-xs text-slate-600 font-medium leading-relaxed">Dolor cólico en abdomen inferior. <b>Tratamiento:</b> AINEs con horario 1 a 2 días previos al sangrado. Descartar endometriosis o infecciones si no hay respuesta.</p></div>
                                </div>
                                <div className="bg-white border rounded-2xl overflow-hidden">
                                    <h4 className="font-black text-slate-700 text-xs uppercase bg-slate-50 p-4 border-b">Métodos Anticonceptivos</h4>
                                    <div className="p-4 grid md:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
                                        <div className="p-3 bg-blue-50 rounded-xl"><b>Hormonales Orales:</b> Uso diario. Reducen dismenorrea y acné. Efecto: Náusea, cefalea.</div>
                                        <div className="p-3 bg-blue-50 rounded-xl"><b>Inyectable:</b> Cada 3 meses. Sin estrógenos. Puede causar amenorrea y aumento de peso.</div>
                                        <div className="p-3 bg-blue-50 rounded-xl"><b>DIU Hormonal:</b> 5 años. Sin estrógenos. Disminuye sangrado abundante. Posible EPI.</div>
                                        <div className="p-3 bg-emerald-50 rounded-xl"><b>Condón Masculino:</b> Único que previene ETS. Uso recomendado siempre combinado.</div>
                                        <div className="p-3 bg-emerald-50 rounded-xl"><b>Parche:</b> Semanal x 3 semanas. Pierde eficacia en pacientes &gt;90kg.</div>
                                        <div className="p-3 bg-emerald-50 rounded-xl"><b>Implante Subdérmico:</b> Progestágeno. Alta eficacia (3 años). Irregularidad menstrual.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {subVistaAdolescente === 'trastornos' && (
                            <div className="space-y-8">
                                <h3 className="font-black text-2xl text-slate-800 border-b pb-4">Salud Mental y Adicciones</h3>
                                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                                    <h4 className="font-black text-rose-700 uppercase text-xs mb-4"><AlertTriangleIcon size={16} className="inline mr-1"/> Criterios de Hospitalización (TCA)</h4>
                                    <div className="grid md:grid-cols-2 gap-6 text-xs text-rose-900/80 font-medium">
                                        <ul className="list-disc pl-4 space-y-2"><li>Peso &lt;75% sobre el peso ideal para la edad.</li><li>Pérdida aguda de peso o rechazo total a alimentarse.</li><li>Hipotermia o Bradicardia (&lt;50 lpm).</li><li>Cambios ortostáticos (PA sistólica &lt;90 mmHg).</li></ul>
                                        <ul className="list-disc pl-4 space-y-2"><li>Desequilibrio electrolítico (K &lt;3.2, Cl &lt;88).</li><li>Arritmias cardiacas o QTc alargado.</li><li>Ideación, intento o plan suicida.</li><li>Vómito intratable / Hematemesis.</li></ul>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                    <h4 className="font-black text-slate-700 uppercase text-xs mb-4">Señales Físicas de Abuso de Sustancias</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-slate-600">
                                        <div className="bg-white p-3 rounded-xl border text-center"><b>Marihuana:</b><br/><span className="text-[10px] font-medium text-slate-500">Taquicardia, ataques de pánico, tos.</span></div>
                                        <div className="bg-white p-3 rounded-xl border text-center"><b>Cocaína/Metas:</b><br/><span className="text-[10px] font-medium text-slate-500">Pérdida de peso, agresividad, arritmias.</span></div>
                                        <div className="bg-white p-3 rounded-xl border text-center"><b>Inhalantes:</b><br/><span className="text-[10px] font-medium text-slate-500">Restos de pintura en narinas, falta coordinación.</span></div>
                                        <div className="bg-white p-3 rounded-xl border text-center"><b>Opiáceos:</b><br/><span className="text-[10px] font-medium text-slate-500">Pupilas puntiformes, depresión respiratoria, somnolencia.</span></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CÁLCULO DE LÍQUIDOS Y ELECTROLITOS */}
            {vista === 'liquidos' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {[{id:'mantenimiento', label:'Mantenimiento (Holliday)'}, {id:'deficit', label:'Déficit (Deshidratación)'}, {id:'neonatos', label:'Requerimientos Neonatales'}].map(s => (
                            <button key={s.id} onClick={()=>setSubVistaLiquidos(s.id)} className={`px-5 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${subVistaLiquidos===s.id?'bg-sky-600 text-white shadow-lg':'bg-white text-slate-500 border shadow-sm'}`}>{s.label}</button>
                        ))}
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-t-8 border-sky-600">
                        
                        {subVistaLiquidos === 'mantenimiento' && liquidos && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="font-black text-2xl text-slate-800 tracking-tight flex items-center gap-2 border-b pb-4"><DropletIcon className="text-sky-500" size={28}/> Holliday-Segar (Mantenimiento)</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-4">Cálculo basal estandarizado para pacientes pediátricos estables (ayuno/pérdidas fisiológicas).</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Volumen Total (24h)</span><div className="text-5xl font-black text-slate-800 tracking-tighter">{liquidos.holliTotal} <span className="text-2xl text-slate-400">ml</span></div></div>
                                    <div className="bg-sky-600 p-8 rounded-[2rem] text-white text-center shadow-lg shadow-sky-500/20"><span className="text-[10px] font-black text-sky-100 uppercase tracking-widest block mb-2">Velocidad de Infusión</span><div className="text-5xl font-black tracking-tighter">{liquidos.holliRate} <span className="text-2xl text-sky-200">ml/h</span></div></div>
                                </div>
                                <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100">
                                    <h4 className="font-black text-sky-700 uppercase text-[10px] mb-2 tracking-widest flex items-center gap-2"><ShieldAlertIcon size={14}/> Prevención de Hiponatremia Iatrogénica</h4>
                                    <p className="text-xs text-sky-900/80 leading-relaxed font-medium">De acuerdo a las guías clínicas actuales, <b>se desaconseja el uso rutinario de soluciones hipotónicas</b> (ej. Sol. Salina al 0.45% o menos). Para el mantenimiento hídrico es preferible utilizar <b>Cristaloides Isotónicos Balanceados</b> (ej. Sterofundin, PlasmaLyte, Ringer Lactato) o Solución Salina 0.9% para prevenir el riesgo de encefalopatía hiponatrémica en niños hospitalizados.</p>
                                </div>
                            </div>
                        )}

                        {subVistaLiquidos === 'deficit' && liquidos && (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="flex flex-col md:flex-row justify-between md:items-end border-b pb-4 gap-4">
                                    <div><h3 className="font-black text-2xl text-slate-800 tracking-tight flex items-center gap-2"><ActivityIcon className="text-amber-500" size={28}/> Corrección de Deshidratación</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Déficit Hídrico + Mantenimiento</p></div>
                                    <div className="w-full md:w-64"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Grado Clínica (OMS)</label><select value={gradoDeshidratacion} onChange={e=>setGradoDeshidratacion(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-amber-600 border-none outline-none ring-2 ring-transparent focus:ring-amber-500 mt-1 cursor-pointer"><option value="leve">Leve (Mucosa semihúmeda)</option><option value="moderada">Moderada (Mucosa seca/Letargo)</option><option value="severa">Severa (Pliegue/Shock)</option></select></div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mantenimiento</span><div className="text-2xl font-black text-slate-800">{liquidos.holliTotal} ml</div></div>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Déficit Clínico</span><div className="text-2xl font-black text-amber-600">+{liquidos.deficitTotal} ml</div></div>
                                    <div className="bg-slate-800 p-5 rounded-2xl text-white text-center shadow-lg"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Rehidratación Total (24h)</span><div className="text-3xl font-black">{liquidos.rehidratacionTotal} ml</div></div>
                                </div>
                                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                                    <h4 className="font-black text-amber-700 uppercase text-xs mb-4 text-center tracking-widest">Esquema de Reposición Parenteral</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm text-center"><span className="block text-[10px] font-bold text-slate-500 uppercase">Primeras 8 Horas (50%)</span><div className="text-3xl font-black text-amber-600 my-1">{liquidos.rate8h}</div><span className="text-[10px] font-black text-slate-400 uppercase">ml/hora</span></div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm text-center"><span className="block text-[10px] font-bold text-slate-500 uppercase">Siguientes 16 Horas (50%)</span><div className="text-3xl font-black text-amber-600 my-1">{liquidos.rate16h}</div><span className="text-[10px] font-black text-slate-400 uppercase">ml/hora</span></div>
                                    </div>
                                    <p className="text-[10px] text-amber-800/80 font-medium text-center mt-4">* Si el paciente se encuentra en shock (Deshidratación Severa), iniciar con <b>Bolos de Cristaloides Isotónicos de 10 a 20 ml/kg</b> en 30-60 minutos previo a esta corrección, vigilando datos de sobrecarga.</p>
                                </div>
                            </div>
                        )}

                        {subVistaLiquidos === 'neonatos' && liquidos && (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="flex flex-col md:flex-row justify-between md:items-end border-b pb-4 gap-4">
                                    <div><h3 className="font-black text-2xl text-slate-800 tracking-tight flex items-center gap-2"><BabyIcon className="text-indigo-500" size={28}/> Hídricos en Neonatos / Prematuros</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Guía IMSS - Primera Semana de Vida</p></div>
                                    <div className="w-full md:w-48"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Día de Vida (1 al 7)</label><select value={diaVida} onChange={e=>setDiaVida(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-indigo-600 border-none outline-none ring-2 ring-transparent focus:ring-indigo-500 mt-1 cursor-pointer">{[1,2,3,4,5,6,7].map(d=><option key={d} value={d}>Día {d}</option>)}</select></div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Requerimiento IMSS</span>
                                        <div className="text-5xl font-black text-slate-800 tracking-tighter">{liquidos.neoReq}</div>
                                        <span className="text-xs font-black text-slate-400 mt-1">ml/kg/día</span>
                                    </div>
                                    <div className="md:col-span-2 bg-indigo-600 p-8 rounded-[2rem] text-white shadow-lg shadow-indigo-500/20 flex flex-col justify-center">
                                        <div className="grid grid-cols-2 gap-4 text-center divide-x divide-indigo-400/50">
                                            <div><span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-2">Volumen Total (24h)</span><div className="text-4xl md:text-5xl font-black tracking-tighter">{liquidos.neoTotal} <span className="text-xl text-indigo-300">ml</span></div></div>
                                            <div><span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-2">Infusión Continua</span><div className="text-4xl md:text-5xl font-black tracking-tighter">{liquidos.neoRate} <span className="text-xl text-indigo-300">ml/h</span></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-xs text-indigo-900/80 font-medium leading-relaxed">
                                    <h4 className="font-black text-indigo-700 uppercase text-[10px] mb-2 tracking-widest flex items-center gap-2"><InfoIcon size={14}/> Consideraciones del Recién Nacido</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>El requerimiento se cruza automáticamente tomando el <b>Peso al Nacer</b> ingresado ({peso} kg) en la tabla oficial.</li>
                                        <li>En prematuros menores de 1500g bajo fototerapia, considerar aumentar líquidos de 10 a 20 ml/kg/día por pérdidas insensibles.</li>
                                        <li>El primer día de vida no se adicionan electrolitos en las infusiones, administrando preferentemente Solución Glucosada.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {liquidos && (
                            <div className="mt-8 bg-slate-800 p-6 md:p-8 rounded-[2rem] text-slate-300 relative shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
                                <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none"><ClipboardListIcon size={150}/></div>
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-4">
                                        <h4 className="font-black text-white uppercase text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-2">
                                            <FileTextIcon size={16} className="text-blue-400"/> Indicaciones para Expediente
                                        </h4>
                                        <button 
                                            onClick={() => {
                                                let textoNota = "";
                                                if (subVistaLiquidos === 'mantenimiento') {
                                                    textoNota = `INDICACIONES DE FLUIDOTERAPIA (MANTENIMIENTO):\n• Solución: Cristaloide Isotónico Balanceado (ej. Ringer Lactato, Sterofundin) o Solución Salina 0.9%.\n• Volumen Total en 24 horas: ${liquidos.holliTotal} ml.\n• Velocidad de infusión: Pasar a ${liquidos.holliRate} ml/h en bomba de infusión continua.`;
                                                } else if (subVistaLiquidos === 'deficit') {
                                                    textoNota = `INDICACIONES DE FLUIDOTERAPIA (CORRECCIÓN DE DÉFICIT):\n• Solución: Cristaloide Isotónico Balanceado o Solución Salina 0.9%.\n• Volumen Total 24h: ${liquidos.rehidratacionTotal} ml (Mantenimiento: ${liquidos.holliTotal} ml + Déficit Hídrico: ${liquidos.deficitTotal} ml).\n• ESQUEMA DE REPOSICIÓN:\n  - 1ras 8 horas (50%): Pasar ${Math.round(liquidos.rehidratacionTotal / 2)} ml a ${liquidos.rate8h} ml/h.\n  - Siguientes 16 horas (50%): Pasar ${Math.round(liquidos.rehidratacionTotal / 2)} ml a ${liquidos.rate16h} ml/h.`;
                                                } else if (subVistaLiquidos === 'neonatos') {
                                                    const pesoNum = parseFloat(peso);
                                                    const tipoDx = pesoNum < 1.0 ? 'al 5%' : pesoNum <= 1.5 ? 'al 7.5% - 10%' : 'al 10%';
                                                    const notaElectrolitos = diaVida === 1 ? 'Sin añadir electrolitos (Día 1 de vida).' : 'Añadir electrolitos según requerimiento y balance sérico diario.';
                                                    textoNota = `INDICACIONES DE FLUIDOTERAPIA (NEONATAL DÍA ${diaVida}):\n• Requerimiento: ${liquidos.neoReq} ml/kg/día.\n• Volumen Total en 24 horas: ${liquidos.neoTotal} ml.\n• Solución Base: Solución Glucosada ${tipoDx}.\n• Electrolitos: ${notaElectrolitos}\n• Velocidad de infusión: Pasar a ${liquidos.neoRate} ml/h en bomba de infusión continua.`;
                                                }
                                                copiarNota(textoNota);
                                            }} 
                                            className={`flex items-center justify-center gap-1.5 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl transition-all shadow-md ${copiado ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                        >
                                            {copiado ? <><CheckCircleIcon size={14}/> Copiado al portapapeles</> : <><ClipboardListIcon size={14}/> Copiar Indicación</>}
                                        </button>
                                    </div>
                                    
                                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/50 shadow-inner">
                                        <pre className="font-mono text-[11px] md:text-xs whitespace-pre-wrap leading-relaxed text-blue-100">
                                            {subVistaLiquidos === 'mantenimiento' && `INDICACIONES DE FLUIDOTERAPIA (MANTENIMIENTO):\n• Solución: Cristaloide Isotónico Balanceado (ej. Ringer Lactato, Sterofundin) o Solución Salina 0.9%.\n• Volumen Total en 24 horas: ${liquidos.holliTotal} ml.\n• Velocidad de infusión: Pasar a ${liquidos.holliRate} ml/h en bomba de infusión continua.`}
                                            {subVistaLiquidos === 'deficit' && `INDICACIONES DE FLUIDOTERAPIA (CORRECCIÓN DE DÉFICIT):\n• Solución: Cristaloide Isotónico Balanceado o Solución Salina 0.9%.\n• Volumen Total 24h: ${liquidos.rehidratacionTotal} ml (Mantenimiento: ${liquidos.holliTotal} ml + Déficit Hídrico: ${liquidos.deficitTotal} ml).\n• ESQUEMA DE REPOSICIÓN:\n  - 1ras 8 horas (50%): Pasar ${Math.round(liquidos.rehidratacionTotal / 2)} ml a ${liquidos.rate8h} ml/h.\n  - Siguientes 16 horas (50%): Pasar ${Math.round(liquidos.rehidratacionTotal / 2)} ml a ${liquidos.rate16h} ml/h.`}
                                            {subVistaLiquidos === 'neonatos' && `INDICACIONES DE FLUIDOTERAPIA (NEONATAL DÍA ${diaVida}):\n• Requerimiento: ${liquidos.neoReq} ml/kg/día.\n• Volumen Total en 24 horas: ${liquidos.neoTotal} ml.\n• Solución Base: Solución Glucosada ${parseFloat(peso) < 1.0 ? 'al 5%' : parseFloat(peso) <= 1.5 ? 'al 7.5% - 10%' : 'al 10%'}.\n• Electrolitos: ${diaVida === 1 ? 'Sin añadir electrolitos (Día 1 de vida).' : 'Añadir electrolitos según requerimiento y balance sérico diario.'}\n• Velocidad de infusión: Pasar a ${liquidos.neoRate} ml/h en bomba de infusión continua.`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!liquidos && <div className="text-center py-24 text-slate-300 font-black uppercase tracking-[0.3em] bg-slate-50 rounded-[2rem] border-dashed border-2">Esperando Datos de Peso y Edad</div>}
                    </div>
                </div>
            )}

        </div>
      </div>
      <footer className="mt-8 text-center text-[8px] text-slate-400 uppercase font-black tracking-[0.5em] leading-relaxed px-6 pb-6">Referencias: P.R. Vademécum • Taketomo • CeNSIA (México) • OMS Growth Standards • Medicina del Adolescente • IMSS (Líquidos Prematuro)</footer>
    </div>
  );
}

export default function App() { return ( <ErrorBoundary><MainApp /></ErrorBoundary> ); }