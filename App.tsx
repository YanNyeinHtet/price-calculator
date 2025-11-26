
import React, { useState, useMemo, useRef } from 'react';
import { 
  VFXShotData, 
  Complexity, 
  Resolution, 
  FPS, 
  Management, 
  ReelPermission,
  BriefType,
  Scene 
} from './types';
import { DEFAULT_BASE_PRICE, DEFAULT_DURATION, OPTION_DETAILS } from './constants';
import { calculateBreakdown, formatMoney } from './utils';
import { InputGroup, RadioCards } from './components/InputGroup';
import { ResultsPanel } from './components/ResultsPanel';
import { 
  Clock, 
  Monitor, 
  Zap, 
  Wand2, 
  ScanFace, 
  Camera, 
  BoxSelect, 
  Move,
  Users,
  Cuboid,
  Workflow,
  Play,
  User,
  Flame,
  HardHat,
  Tent,
  Layers,
  Sparkles,
  Film,
  Timer,
  FileText,
  Plus,
  Trash2,
  Edit2,
  AlignLeft,
  Download,
  Upload,
  Save
} from 'lucide-react';

// Default Data Template
const DEFAULT_SHOT_DATA: VFXShotData = {
  basePrice: DEFAULT_BASE_PRICE,
  duration: DEFAULT_DURATION,
  resolution: Resolution.RES_1080,
  fps: FPS.FPS_30,
  // Prep
  roto: Complexity.NONE,
  cleanup: Complexity.NONE,
  keying: Complexity.NONE,
  cameraTracking: Complexity.NONE,
  objectTracking: Complexity.NONE,
  matchMove: Complexity.NONE,
  // Production
  model3d: Complexity.NONE,
  rigging: Complexity.NONE,
  sceneReconstruction: Complexity.NONE,
  propsEnvs: Complexity.NONE,
  animation: Complexity.NONE,
  mocap: Complexity.NONE,
  simulation: Complexity.NONE,
  // Post
  compositing3d: Complexity.NONE,
  compositing2d: Complexity.NONE,
  layerAnimation: Complexity.NONE,
  // Extras
  urgent: Complexity.NONE,
  brief: BriefType.CLEAR,
  // Mgmt
  onSceneManagement: Management.NO,
  allowOnReel: ReelPermission.NO,
};

// Demo Scenes for first-time use
const DEMO_SCENE_1: Scene = {
  id: '1',
  name: 'Hero Landing',
  description: 'Hero superhero landing with dust debris. Needs camera tracking and dust simulation.',
  data: {
    ...DEFAULT_SHOT_DATA,
    duration: 4,
    resolution: Resolution.RES_4K,
    cameraTracking: Complexity.MEDIUM,
    simulation: Complexity.EASY,
    compositing3d: Complexity.EASY,
    cleanup: Complexity.EASY,
    onSceneManagement: Management.YES,
  }
};

const DEMO_SCENE_2: Scene = {
  id: '2',
  name: 'Robot Reveal',
  description: 'Close up of a robot face opening. Complex hard surface rigging and compositing.',
  data: {
    ...DEFAULT_SHOT_DATA,
    duration: 6,
    resolution: Resolution.RES_1080,
    fps: FPS.FPS_60,
    model3d: Complexity.MEDIUM,
    rigging: Complexity.HARD,
    animation: Complexity.EASY,
    compositing3d: Complexity.MEDIUM,
    allowOnReel: ReelPermission.YES,
  }
};

const App: React.FC = () => {
  // State: Scenes Array initialized with Demo Scenes
  const [scenes, setScenes] = useState<Scene[]>([DEMO_SCENE_1, DEMO_SCENE_2]);
  const [activeSceneId, setActiveSceneId] = useState<string>('1');
  
  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Helpers
  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];
  const activeShotData = activeScene.data;

  // Calculate breakdown only for the active scene
  const breakdown = useMemo(() => calculateBreakdown(activeShotData), [activeShotData]);
  
  // Calculate total project cost for Header
  const projectTotal = useMemo(() => {
    return scenes.reduce((sum, scene) => sum + calculateBreakdown(scene.data).total, 0);
  }, [scenes]);

  // Handlers - Data Updates
  const updateActiveSceneData = (key: keyof VFXShotData, value: any) => {
    setScenes(prev => prev.map(scene => 
      scene.id === activeSceneId 
        ? { ...scene, data: { ...scene.data, [key]: value } }
        : scene
    ));
  };

  const updateActiveSceneInfo = (key: 'name' | 'description', value: string) => {
    setScenes(prev => prev.map(scene => 
      scene.id === activeSceneId 
        ? { ...scene, [key]: value }
        : scene
    ));
  };

  const handleComplexityChange = (key: keyof VFXShotData) => (value: string) => {
    updateActiveSceneData(key, value);
  };

  const handleNumberChange = (key: keyof VFXShotData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateActiveSceneData(key, isNaN(val) ? 0 : val);
  };

  // Handlers - Scene Management
  const addScene = () => {
    const newId = (Math.max(...scenes.map(s => parseInt(s.id))) + 1).toString();
    const newScene: Scene = {
      id: newId,
      name: `Scene ${newId}`,
      description: '',
      data: { ...DEFAULT_SHOT_DATA } // Copy defaults
    };
    setScenes([...scenes, newScene]);
    setActiveSceneId(newId);
  };

  const deleteScene = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (scenes.length <= 1) return; // Prevent deleting last scene
    
    const newScenes = scenes.filter(s => s.id !== id);
    setScenes(newScenes);
    if (activeSceneId === id) {
      setActiveSceneId(newScenes[0].id);
    }
  };

  // Handlers - Import / Export
  const handleExportProject = () => {
    const projectData = JSON.stringify(scenes, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VFX_Project_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedScenes = JSON.parse(content) as Scene[];
        
        // Basic validation
        if (Array.isArray(importedScenes) && importedScenes.length > 0 && importedScenes[0].data) {
          setScenes(importedScenes);
          setActiveSceneId(importedScenes[0].id);
        } else {
          alert('Invalid project file format.');
        }
      } catch (error) {
        console.error('Error parsing project file:', error);
        alert('Failed to load project file.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = ''; 
  };

  // Styles
  const complexityColors = {
    [Complexity.NONE]: 'bg-neutral-900 border-neutral-800 text-neutral-500',
    [Complexity.EASY]: 'bg-yellow-900/20 border-yellow-700 text-yellow-500',
    [Complexity.MEDIUM]: 'bg-orange-900/30 border-orange-700 text-orange-500',
    [Complexity.HARD]: 'bg-red-900/40 border-red-700 text-red-500',
  };

  const urgentColors = {
    [Complexity.NONE]: 'bg-neutral-900 border-neutral-800 text-neutral-500',
    [Complexity.EASY]: 'bg-red-900/20 border-red-800 text-red-300',
    [Complexity.MEDIUM]: 'bg-red-900/50 border-red-600 text-red-200',
    [Complexity.HARD]: 'bg-red-700 border-red-500 text-white shadow-red-500/20',
  };

  const reelColors = {
    [ReelPermission.NO]: 'bg-neutral-900 border-neutral-800 text-neutral-400',
    [ReelPermission.YES]: 'bg-yellow-900/20 border-yellow-600 text-yellow-500',
  };
  
  const briefColors = {
    [BriefType.CLEAR]: 'bg-neutral-900 border-neutral-700 text-neutral-300',
    [BriefType.NOT_CLEAR]: 'bg-red-900/30 border-red-600 text-red-400',
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 pb-20">
      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      {/* Header */}
      <header className="border-b border-neutral-900 bg-black/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://dn720701.ca.archive.org/0/items/l_20251126/l.png" 
              alt="Chicken can't fly studio Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <div>
              <h1 className="text-sm sm:text-xl font-bold tracking-tight text-white">VFX Price Architect</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="text-[10px] sm:text-xs text-neutral-500 font-medium text-yellow-500/80">by Chicken can't fly studio</p>
                <a 
                  href="https://www.kaung.cc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] sm:text-xs text-neutral-600 hover:text-white transition-colors"
                >
                  www.kaung.cc
                </a>
              </div>
            </div>
          </div>
          
          {/* Mobile Sticky Price Display (Total Project) */}
          <div className="flex flex-col items-end lg:hidden">
             <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Project Total</span>
             <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 leading-none">
               {formatMoney(projectTotal)}
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Scene Manager - Redesigned Film Strip Style */}
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between mb-4 gap-4">
            <h2 className="text-white font-bold flex items-center gap-2 text-lg">
              <Film size={20} className="text-yellow-500" />
              Scenes & Shots
            </h2>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={addScene}
                className="flex items-center gap-2 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg border border-neutral-700 transition-colors shadow-sm"
              >
                <Plus size={14} className="text-yellow-500" /> Add Scene
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x">
            {scenes.map(scene => {
               const sceneTotal = calculateBreakdown(scene.data).total;
               return (
                <div 
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={`
                    relative group flex-shrink-0 flex flex-col w-56 p-4 rounded-xl border cursor-pointer transition-all duration-300 snap-start
                    ${activeSceneId === scene.id 
                      ? 'bg-neutral-900 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.25)] translate-y-0' 
                      : 'bg-black border-neutral-800 hover:border-neutral-700 hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Header: Name & Delete */}
                  <div className="flex justify-between items-start mb-2">
                    <input 
                      type="text"
                      value={scene.name}
                      onChange={(e) => updateActiveSceneInfo('name', e.target.value)}
                      className={`bg-transparent text-sm font-bold focus:outline-none w-full truncate border-b border-transparent focus:border-neutral-700 ${activeSceneId === scene.id ? 'text-white' : 'text-neutral-400'}`}
                      onClick={(e) => e.stopPropagation()} 
                      placeholder="Scene Name"
                    />
                    {scenes.length > 1 && (
                      <button 
                        onClick={(e) => deleteScene(scene.id, e)}
                        className="text-neutral-600 hover:text-red-500 transition-colors p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {/* Mid: Stats */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded text-[10px] text-neutral-400 border border-neutral-800">
                      <Clock size={10} />
                      {scene.data.duration}s
                    </div>
                     <div className="text-[10px] text-neutral-500 truncate flex-1 text-right">
                       {scene.data.fps === FPS.FPS_60 ? '60fps' : '30fps'} / {scene.data.resolution}
                     </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-[10px] text-neutral-500 line-clamp-2 h-8 mb-3 leading-tight">
                    {scene.description || "No description provided."}
                  </p>

                  {/* Footer: Price */}
                  <div className={`mt-auto pt-3 border-t ${activeSceneId === scene.id ? 'border-neutral-800' : 'border-neutral-900'}`}>
                    <div className="text-xs text-neutral-500 uppercase font-semibold">Estimate</div>
                    <div className={`text-lg font-bold truncate leading-none mt-1 ${activeSceneId === scene.id ? 'text-yellow-500' : 'text-neutral-400'}`}>
                       {formatMoney(sceneTotal)}
                    </div>
                  </div>

                  {/* Active Indicator Strip */}
                  {activeSceneId === scene.id && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-yellow-500 to-red-600 rounded-r-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Global Settings */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                {activeScene.name} Parameters
              </h2>
              
              <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-6">
                 {/* Row 1: Base Price & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Base Price (MMK / sec)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">MMK</span>
                      <input
                        type="number"
                        min="0"
                        value={activeShotData.basePrice}
                        onChange={handleNumberChange('basePrice')}
                        className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Shot Duration (Seconds)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                      <input
                        type="number"
                        min="0"
                        value={activeShotData.duration}
                        onChange={handleNumberChange('duration')}
                        className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Description */}
                <div>
                   <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
                     <AlignLeft size={16} /> Scene Description
                   </label>
                   <textarea
                      value={activeScene.description || ''}
                      onChange={(e) => updateActiveSceneInfo('description', e.target.value)}
                      placeholder="Enter a brief description of the shot (e.g. 'Hero character jumps over burning car'). This will appear on the Scene Card."
                      className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all h-24 text-sm resize-none"
                   />
                </div>
              </div>
            </section>

            {/* Technical Specs */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8">Technical Specifications</h2>
              
              <InputGroup label="Resolution" icon={<Monitor size={18}/>} description="Higher resolution adds surcharge relative to base price.">
                <RadioCards 
                  options={Object.values(Resolution)} 
                  value={activeShotData.resolution} 
                  onChange={handleComplexityChange('resolution')} 
                  colorMap={{
                    [Resolution.RES_1080]: 'bg-neutral-900 border-neutral-800 text-neutral-400',
                    [Resolution.RES_4K]: 'bg-neutral-800 border-neutral-600 text-white',
                    [Resolution.RES_6K]: 'bg-neutral-700 border-neutral-500 text-white',
                  }}
                />
              </InputGroup>

              <InputGroup label="Frame Rate" icon={<Zap size={18}/>} description="60 FPS adds a 20% surcharge to the TOTAL scene estimate.">
                <RadioCards 
                  options={Object.values(FPS)} 
                  value={activeShotData.fps} 
                  onChange={handleComplexityChange('fps')} 
                  labels={{[FPS.FPS_30]: '30 FPS', [FPS.FPS_60]: '60 FPS'}}
                  colorMap={{
                    [FPS.FPS_30]: 'bg-neutral-900 border-neutral-800 text-neutral-400',
                    [FPS.FPS_60]: 'bg-red-900/30 border-red-700 text-red-500',
                  }}
                />
              </InputGroup>
            </section>

            {/* Pre Production */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-yellow-500">Pre-Production / Prep</h2>
              
              <InputGroup label="Roto" icon={<ScanFace size={18}/>} description="Isolating objects frame-by-frame to separate them from the background (Rotoscoping).">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.roto} 
                  onChange={handleComplexityChange('roto')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.ROTO}
                />
              </InputGroup>

              <InputGroup label="Cleanup / Paint" icon={<Wand2 size={18}/>} description="Removing unwanted elements like wires, rigs, tracking markers, or blemishes.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.cleanup} 
                  onChange={handleComplexityChange('cleanup')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.CLEANUP}
                />
              </InputGroup>

              <InputGroup label="Keying (Green Screen)" icon={<BoxSelect size={18}/>} description="Extracting subjects from green/blue screens to replace the background.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.keying} 
                  onChange={handleComplexityChange('keying')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.KEYING}
                />
              </InputGroup>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Camera Tracking" icon={<Camera size={18}/>} description="Deriving the movement of the physical camera to match it in 3D space.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.cameraTracking} 
                    onChange={handleComplexityChange('cameraTracking')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.TRACKING}
                    />
                </InputGroup>
                
                <InputGroup label="Object Tracking" icon={<BoxSelect size={18}/>} description="Tracking the movement of specific objects or actors for 3D interaction.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.objectTracking} 
                    onChange={handleComplexityChange('objectTracking')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.TRACKING}
                    />
                </InputGroup>
              </div>

              <InputGroup label="Match Move" icon={<Move size={18}/>} description="Precise alignment of CG elements to the live-action footage perspective.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.matchMove} 
                  onChange={handleComplexityChange('matchMove')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.MATCH_MOVE}
                />
              </InputGroup>
            </section>

             {/* Production Assets */}
             <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-red-400">Production: 3D Assets</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="3D Model" icon={<Cuboid size={18}/>} description="Creating digital 3D geometry for characters, props, or vehicles. Flat fee.">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.model3d} 
                    onChange={handleComplexityChange('model3d')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.MODEL_3D}
                  />
                </InputGroup>

                <InputGroup label="Rigging" icon={<Workflow size={18}/>} description="Building the digital skeleton and controls for animation. Flat fee.">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.rigging} 
                    onChange={handleComplexityChange('rigging')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.RIGGING}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Scene Reconstruct" icon={<HardHat size={18}/>} description="Building a 3D proxy of the set for lighting reference and collisions. Flat fee.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.sceneReconstruction} 
                    onChange={handleComplexityChange('sceneReconstruction')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.SCENE_RECON}
                    />
                </InputGroup>

                <InputGroup label="Props & Environment" icon={<Tent size={18}/>} description="Creating digital set dressing and background elements. Flat fee.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.propsEnvs} 
                    onChange={handleComplexityChange('propsEnvs')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.PROPS_ENV}
                    />
                </InputGroup>
              </div>
            </section>

            {/* Production Animation */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-red-500">Production: Animation & FX</h2>

              <InputGroup label="Keyframe Animation" icon={<Play size={18}/>} description="Manual frame-by-frame animation for stylized or complex character performance.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.animation} 
                  onChange={handleComplexityChange('animation')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.ANIMATION}
                />
              </InputGroup>

              <InputGroup label="Mocap Cleanup" icon={<User size={18}/>} description="Refining raw motion capture data to fix jitters and sliding feet.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.mocap} 
                  onChange={handleComplexityChange('mocap')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.MOCAP}
                />
              </InputGroup>

              <InputGroup label="Simulation (FX)" icon={<Flame size={18}/>} description="Physics-based simulations for fire, water, smoke, cloth, or destruction.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.simulation} 
                  onChange={handleComplexityChange('simulation')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.SIMULATION}
                />
              </InputGroup>
            </section>

            {/* Post Production */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-red-600">Post Production</h2>

              <InputGroup label="3D Compositing" icon={<Layers size={18}/>} description="Integrating multi-pass 3D renders with live-action footage.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.compositing3d} 
                  onChange={handleComplexityChange('compositing3d')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.COMPOSITING_3D}
                />
              </InputGroup>

              <InputGroup label="2D Compositing" icon={<Layers size={18}/>} description="Layer-based blending, color correction, and integration of 2D elements.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.compositing2d} 
                  onChange={handleComplexityChange('compositing2d')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.COMPOSITING_2D}
                />
              </InputGroup>

              <InputGroup label="Layer Animation" icon={<Sparkles size={18}/>} description="Animating 2D graphics, user interfaces (HUDs), or motion graphics.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={activeShotData.layerAnimation} 
                  onChange={handleComplexityChange('layerAnimation')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.LAYER_ANIM}
                />
              </InputGroup>
            </section>

             {/* Extras & Management */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-neutral-200">Delivery & Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Urgent Delivery" icon={<Timer size={18}/>} description="Rush fee multiplier for tight deadlines.">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={activeShotData.urgent} 
                    onChange={handleComplexityChange('urgent')}
                    colorMap={urgentColors}
                    descriptions={OPTION_DETAILS.URGENT}
                  />
                </InputGroup>

                <InputGroup label="Creative Brief" icon={<FileText size={18}/>} description="If brief is not clear, 40% surcharge is applied for R&D.">
                  <RadioCards 
                    options={Object.values(BriefType)} 
                    value={activeShotData.brief} 
                    onChange={handleComplexityChange('brief')}
                    colorMap={briefColors}
                    descriptions={OPTION_DETAILS.BRIEF}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputGroup label="On-Scene Supervisor" icon={<Users size={18}/>} description="Selecting 'Yes' applies a 5% discount for on-set supervision.">
                  <RadioCards 
                    options={Object.values(Management)} 
                    value={activeShotData.onSceneManagement} 
                    onChange={handleComplexityChange('onSceneManagement')}
                    labels={{ [Management.YES]: 'Yes (-5%)', [Management.NO]: 'No' }}
                    colorMap={reelColors}
                  />
                </InputGroup>

                <InputGroup label="Allow on Reel" icon={<Film size={18}/>} description="Granting usage rights for the studio's showreel applies a 5% discount.">
                  <RadioCards 
                    options={Object.values(ReelPermission)} 
                    value={activeShotData.allowOnReel} 
                    onChange={handleComplexityChange('allowOnReel')}
                    labels={{ [ReelPermission.NO]: 'No', [ReelPermission.YES]: 'Yes (-5%)' }}
                    colorMap={reelColors}
                  />
                </InputGroup>
              </div>
            </section>

          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <ResultsPanel 
              activeBreakdown={breakdown} 
              activeScene={activeScene}
              allScenes={scenes}
              onImportProject={handleImportClick}
              onExportProject={handleExportProject}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
