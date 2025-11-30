import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, Calendar, Folder, FileText, 
  ChevronRight, ChevronLeft, Save, Download, 
  HelpCircle, CheckCircle, AlertTriangle, Lightbulb,
  Plus, Trash2, Info
} from 'lucide-react';

/**
 * CONFIGURATIE & DATA
 */

const PROJECT_CATEGORIES = [
  { id: 'MEDIA', label: 'Media Productie', icon: '🎬' },
  { id: 'CAMPAGNE', label: 'Campagne', icon: '📢' },
  { id: 'ONDERZOEK', label: 'Onderzoek', icon: '🔍' },
  { id: 'EVENT', label: 'Evenement', icon: '📅' },
  { id: 'OVERIG', label: 'Overig', icon: '📂' },
];

const PROJECT_SUBTYPES = {
  MEDIA: ['Video', 'Fotografie', 'Social Content', 'Podcast', 'Vormgeving'],
  CAMPAGNE: ['Social Media Campagne', 'Awareness', 'Branding'],
  ONDERZOEK: ['Doelgroeponderzoek', 'Concurrentieanalyse', 'Concept'],
  EVENT: ['Event Organiseren', 'School Open Dag', 'Expositie'],
  OVERIG: ['Eigen invulling']
};

const CANVAS_STEPS = [
  {
    id: 'aanleiding',
    title: '1. Aanleiding & Context',
    question: 'Waarom doen jullie dit project? Wat is de reden?',
    routes: [
      'Schoolopdracht (je wilt een leerdoel halen)',
      'Opdrachtgever (die heeft een probleem of wens)',
      'Eigen idee (je ziet een kans)'
    ],
    starters: [
      "De aanleiding voor dit project is...",
      "Wij doen dit project omdat...",
      "De opdrachtgever heeft gevraagd om..."
    ],
    checklist: [
      "Heb je beschreven wat het probleem is?",
      "Weet je voor wie je het doet?",
      "Is de opdracht duidelijk?"
    ]
  },
  {
    id: 'doel',
    title: '2. Doel & Resultaat',
    question: 'Wat is er af als jullie klaar zijn? Wat moet het opleveren?',
    routes: [],
    starters: [
      "Het eindresultaat is een...",
      "Met dit project willen we bereiken dat...",
      "Het doel is geslaagd als..."
    ],
    checklist: [
      "Is het eindproduct concreet (bijv. een video van 3 min)?",
      "Is het doel haalbaar in de tijd die je hebt?",
      "Weet je wanneer je tevreden bent?"
    ]
  },
  {
    id: 'doelgroep',
    title: '3. Doelgroep',
    question: 'Voor wie maken jullie dit? Wie gaat er naar kijken?',
    routes: [],
    starters: [
      "Onze doelgroep bestaat uit...",
      "De mensen die dit gaan zien zijn ongeveer ... jaar oud.",
      "Wij richten ons op mensen die houden van..."
    ],
    checklist: [
      "Heb je de leeftijd genoemd?",
      "Weet je wat de doelgroep interessant vindt?",
      "Weet je waar je de doelgroep kunt bereiken?"
    ]
  },
  {
    id: 'team',
    title: '4. Team & Rollen',
    question: 'Wie doet wat in de groep? Wie is verantwoordelijk?',
    routes: [],
    starters: [
      "De taakverdeling is als volgt: ... doet de planning.",
      "... is verantwoordelijk voor de techniek/vormgeving.",
      "We beslissen samen over..."
    ],
    checklist: [
      "Heeft iedereen een duidelijke taak?",
      "Wie bewaakt de deadline?",
      "Wie heeft het contact met de docent/opdrachtgever?"
    ]
  },
  {
    id: 'eisen',
    title: '5. Eisen & Wensen',
    question: 'Wat MOET er sowieso in zitten? Wat mag er extra bij?',
    routes: [],
    starters: [
      "Het product moet in ieder geval voldoen aan...",
      "Een harde eis is dat...",
      "Als we tijd over hebben, willen we ook nog..."
    ],
    checklist: [
      "Heb je de eisen van school gecheckt?",
      "Wat is het minimale dat af moet zijn?",
      "Zijn er technische eisen (bestandsformaat, lengte)?"
    ]
  },
  {
    id: 'risicos',
    title: '6. Risico’s',
    question: 'Wat kan er fout gaan? Wat vind je lastig?',
    routes: [],
    starters: [
      "Een groot risico is dat...",
      "Wij vinden het lastig om...",
      "Als ... gebeurt, lossen we dat op door..."
    ],
    checklist: [
      "Wat doe je als iemand ziek wordt?",
      "Wat als de techniek niet werkt?",
      "Hebben jullie genoeg tijd ingepland?"
    ]
  },
  {
    id: 'planning',
    title: '7. Planning & Mijlpalen',
    question: 'Wat zijn de belangrijkste momenten? Wanneer moet wat af?',
    // Algemene tips
    tips: [
        "📅 Begin bij de deadline en werk terug naar vandaag.",
        "🎬 Vergeet de voorbereiding niet (script, locaties, afspraken).",
        "🗣️ Plan momenten in voor feedback van je docent.",
        "⚠️ Zorg voor een buffer: dingen duren vaak langer dan je denkt.",
        "💻 Houd rekening met techniek (renderen, uploaden, testen)."
    ],
    routes: [],
    starters: [
      "In week 3 moet het concept definitief zijn.",
      "De deadline voor de eerste versie is...",
      "Elke week bespreken we de voortgang op..."
    ],
    checklist: [
      "Staan alle deadlines erin?",
      "Is er tijd voor feedback?",
      "Is er tijd om dingen te verbeteren?"
    ]
  },
  {
    id: 'bronnen',
    title: '8. Bronnen & Benodigdheden',
    question: 'Wat heb je nodig? (Spullen, geld, mensen, software)',
    routes: [],
    starters: [
      "Wij hebben de volgende apparatuur nodig: ...",
      "We gebruiken de software...",
      "Het budget voor dit project is..."
    ],
    checklist: [
      "Heb je camera's/ruimtes gereserveerd?",
      "Heb je toestemming om ergens te filmen?",
      "Zijn er kosten?"
    ]
  }
];

/**
 * LOSSE COMPONENTEN
 */

const StepProjectBasis = ({ data, updateData, updateMember, addMember, removeMember }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800">Laten we beginnen!</h2>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <label className="block text-lg font-medium mb-2">Hoe heet jullie project?</label>
      <input 
        type="text" 
        className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        placeholder="Bijv: Promotievideo Open Dag"
        value={data.projectName}
        onChange={(e) => updateData('projectName', e.target.value)}
      />
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <label className="block text-lg font-medium mb-2">Welke klas / groep?</label>
      <input 
        type="text" 
        className="w-full p-4 border-2 border-gray-300 rounded-lg"
        placeholder="Bijv: M1A1 - groep 1"
        value={data.groupName}
        onChange={(e) => updateData('groupName', e.target.value)}
      />
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <label className="block text-lg font-medium mb-4">Wie zitten er in het team?</label>
      {data.members.map((member, i) => (
        <div key={i} className="flex gap-2 mb-3">
            <input 
                type="text" 
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                placeholder={`Naam teamlid ${i + 1}`}
                value={member}
                onChange={(e) => updateMember(i, e.target.value)}
            />
            {data.members.length > 1 && (
                <button 
                    onClick={() => removeMember(i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Verwijder lid"
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>
      ))}
      <button 
        onClick={addMember}
        className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors mt-2"
      >
        <Plus size={20} /> Lid toevoegen
      </button>
    </div>
  </div>
);

const StepTime = ({ data, updateData, totalHours }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Tijd & Planning</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block font-bold mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600"/> Aantal weken
        </label>
        <select 
          className="w-full p-3 border rounded-lg bg-gray-50"
          value={data.durationWeeks}
          onChange={(e) => updateData('durationWeeks', parseInt(e.target.value))}
        >
          {[1,2,3,4,5,6,7,8,9,10,12,16,20].map(n => (
            <option key={n} value={n}>{n} weken</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block font-bold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600"/> Lesuren per week
        </label>
        <select 
          className="w-full p-3 border rounded-lg bg-gray-50"
          value={data.hoursPerWeek}
          onChange={(e) => updateData('hoursPerWeek', parseInt(e.target.value))}
        >
          {[1,2,3,4,5,6,7,8].map(n => (
            <option key={n} value={n}>{n} uur op school</option>
          ))}
        </select>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <label className="block font-bold mb-3">Werken jullie ook buiten schooltijd?</label>
      <div className="flex flex-col gap-3">
        {[
          { val: 0, label: 'Nee, alleen in de les' },
          { val: 1, label: 'Ja, een beetje (+1 uur/week)' },
          { val: 3, label: 'Ja, best veel (+3 uur/week)' }
        ].map(opt => (
          <button 
            key={opt.val}
            onClick={() => updateData('extraHours', opt.val)}
            className={`p-4 rounded-lg border text-left flex items-center gap-3 transition-colors ${
              data.extraHours === opt.val ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 ${data.extraHours === opt.val ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}></div>
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
      <p className="text-blue-100 uppercase text-sm font-bold tracking-wide">Totale projecttijd</p>
      <p className="text-4xl font-extrabold my-2">{totalHours} uur</p>
      <p className="text-sm opacity-90">Dat is {data.durationWeeks} weken × {(parseInt(data.hoursPerWeek) + parseInt(data.extraHours))} uur per week.</p>
    </div>
  </div>
);

const StepType = ({ data, updateData }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Wat gaan jullie maken?</h2>
    
    {!data.category ? (
      <div className="grid grid-cols-2 gap-4">
        {PROJECT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateData('category', cat.id)}
            className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
          >
            <span className="text-4xl">{cat.icon}</span>
            <span className="font-bold text-gray-700">{cat.label}</span>
          </button>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        <button onClick={() => { updateData('category', ''); updateData('subtype', ''); }} className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
          <ChevronLeft size={16}/> Kies een andere categorie
        </button>
        
        <h3 className="font-bold text-lg">Kies een type {PROJECT_CATEGORIES.find(c => c.id === data.category)?.label}:</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {PROJECT_SUBTYPES[data.category].map(sub => (
            <button
              key={sub}
              onClick={() => updateData('subtype', sub)}
              className={`p-4 text-left border-2 rounded-lg transition-all ${
                data.subtype === sub ? 'border-blue-500 bg-blue-50 font-bold' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);


const StepCanvasInput = ({ stepId, data, updateCanvas }) => {
  const currentCanvasStep = CANVAS_STEPS.find(s => s.id === stepId);
  const [showHelp, setShowHelp] = useState(false);

  if (!currentCanvasStep) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{currentCanvasStep.title}</h2>
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">STAP {CANVAS_STEPS.findIndex(s => s.id === stepId) + 1}/8</span>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-bold text-blue-900 mb-2">{currentCanvasStep.question}</h3>
        
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-blue-700 font-semibold underline flex items-center gap-1 mt-2"
        >
          {showHelp ? 'Verberg hulp' : 'Ik weet het niet, help mij!'}
        </button>

        {showHelp && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm animate-fade-in space-y-4">
            {currentCanvasStep.routes.length > 0 && (
              <div>
                <p className="font-bold text-xs uppercase text-gray-500 mb-1">Kies een richting:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {currentCanvasStep.routes.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            
            <div>
              <p className="font-bold text-xs uppercase text-gray-500 mb-1">Zin-starters:</p>
              <div className="flex flex-col gap-2">
                {currentCanvasStep.starters.map((starter, i) => (
                  <button 
                    key={i}
                    onClick={() => updateCanvas(stepId, data.canvas[stepId] + starter + " ")}
                    className="text-left text-sm bg-gray-50 p-2 rounded border hover:bg-gray-100 hover:border-blue-300 transition-colors"
                  >
                    "{starter}..."
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-xs uppercase text-gray-500 mb-1">Checklist:</p>
              <ul className="space-y-1">
                {currentCanvasStep.checklist.map((check, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0"/> {check}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Speciale TIP sectie voor de Planning */}
      {currentCanvasStep.tips && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="text-sm text-yellow-900">
            <p className="font-bold flex items-center gap-2 mb-2"><Lightbulb size={16}/> Denk hieraan bij je planning:</p>
            <ul className="space-y-1">
                {currentCanvasStep.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <textarea
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base leading-relaxed"
        placeholder="Typ hier jullie antwoord..."
        value={data.canvas[stepId]}
        onChange={(e) => updateCanvas(stepId, e.target.value)}
      />
    </div>
  );
};

const StepOverview = ({ data, totalHours }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Goed gedaan!</h2>
        <p className="text-gray-600">Jullie Project Canvas is compleet.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center hide-print">
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          <Download size={20}/> Download / Print PDF
        </button>
      </div>
      
      {/* PREVIEW AREA (What gets printed) */}
      <div id="print-area" className="bg-white p-8 shadow-2xl border border-gray-200 max-w-4xl mx-auto print:shadow-none print:border-none print:w-full">
        
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider leading-none">Project Canvas</h1>
            <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wide mt-1">GLR Mediamanager</h2>
            <p className="text-lg text-gray-600 font-medium mt-4">{data.projectName}</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Groep:</strong> {data.groupName}</p>
            <p><strong>Type:</strong> {data.subtype}</p>
            <p><strong>Tijd:</strong> {data.durationWeeks} weken ({totalHours} uur)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          
          {/* VAK 1 & 2 */}
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">1. Aanleiding</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.aanleiding || "..."}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">2. Doel & Resultaat</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.doel || "..."}</p>
          </div>

          {/* VAK 3 & 4 */}
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">3. Doelgroep</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.doelgroep || "..."}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">4. Team</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.team || "..."}</p>
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
              Leden: {data.members.filter(m => m).join(', ')}
            </div>
          </div>

          {/* VAK 5 & 6 */}
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">5. Eisen & Wensen</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.eisen || "..."}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">6. Risico's</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.risicos || "..."}</p>
          </div>

           {/* VAK 7 & 8 */}
           <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800 md:col-span-2">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">7. Planning</h3>
            <p className="whitespace-pre-wrap text-sm font-mono">{data.canvas.planning || "..."}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white print:border-gray-800 md:col-span-2">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">8. Bronnen & Benodigdheden</h3>
            <p className="whitespace-pre-wrap text-sm">{data.canvas.bronnen || "..."}</p>
          </div>

        </div>
      </div>
    </div>
  );
};


/**
 * HOOFDCOMPONENT
 */
export default function App() {
  const [step, setStep] = useState(0); // 0 = start
  
  // STATE VOOR ALLE DATA
  const [data, setData] = useState({
    projectName: '',
    groupName: '',
    members: ['', '', '', ''],
    startDate: '',
    durationWeeks: 4,
    hoursPerWeek: 2,
    extraHours: 0,
    category: '',
    subtype: '',
    canvas: {
      aanleiding: '',
      doel: '',
      doelgroep: '',
      team: '',
      eisen: '',
      risicos: '',
      planning: '',
      bronnen: ''
    }
  });

  // Bereken totale tijd
  const totalHours = data.durationWeeks * (parseInt(data.hoursPerWeek) + parseInt(data.extraHours));

  // Functie om data te updaten
  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateMember = (index, value) => {
    const newMembers = [...data.members];
    newMembers[index] = value;
    updateData('members', newMembers);
  };

  const addMember = () => {
    updateData('members', [...data.members, '']);
  };

  const removeMember = (index) => {
    const newMembers = data.members.filter((_, i) => i !== index);
    updateData('members', newMembers);
  };

  const updateCanvas = (field, value) => {
    setData(prev => ({
      ...prev,
      canvas: { ...prev.canvas, [field]: value }
    }));
  };

  // --- RENDER FUNCTIES VOOR VERSCHILLENDE FASES

  const renderProgress = () => {
    // Totaal stappen: basis(1) + tijd(1) + type(1) + canvas(8) + overzicht(1) = 12 stappen
    const totalSteps = 12;
    const percentage = Math.min(100, (step / (totalSteps - 1)) * 100);
    
    return (
      <div className="w-full bg-gray-200 h-2 mb-6 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };


  // --- NAVIGATIE LOGICA ---

  const STEPS = [
    { 
      render: () => <StepProjectBasis 
                      data={data} 
                      updateData={updateData} 
                      updateMember={updateMember}
                      addMember={addMember}
                      removeMember={removeMember}
                    />, 
      validate: () => data.projectName.length > 0 
    },
    { 
      render: () => <StepTime data={data} updateData={updateData} totalHours={totalHours} />, 
      validate: () => true 
    },
    { 
      render: () => <StepType data={data} updateData={updateData} />, 
      validate: () => data.subtype.length > 0 
    },
    
    // Inject Canvas Steps
    ...CANVAS_STEPS.map(s => ({ 
      render: () => <StepCanvasInput stepId={s.id} data={data} updateCanvas={updateCanvas} />, 
      validate: () => true 
    })),
    { 
      render: () => <StepOverview data={data} totalHours={totalHours} />, 
      validate: () => true 
    }
  ];

  const handleNext = () => {
    if (STEPS[step].validate()) {
      setStep(step + 1);
      window.scrollTo(0,0);
    } else {
      alert("Vul eerst de verplichte velden in voordat je verder gaat.");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // --- RENDER COMPLETE APP ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 hide-print">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Project Canvas</h1>
              <p className="text-xs text-gray-500">GLR Mediamanager</p>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Stap {step + 1} van {STEPS.length}
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          {renderProgress()}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {STEPS[step].render()}
      </main>

      {/* Footer Navigatie */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 hide-print">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
              step === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} /> Vorige
          </button>

          {step < STEPS.length - 1 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-transform active:scale-95"
            >
              Volgende <ChevronRight size={20} />
            </button>
          ) : (
            <button 
               onClick={() => window.print()} 
               className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-green-700"
            >
              <Save size={20}/> Opslaan
            </button>
          )}
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          .hide-print { display: none !important; }
          body { background: white; }
          #print-area { border: none; shadow: none; width: 100%; max-width: none; }
        }
      `}</style>
    </div>
  );
}