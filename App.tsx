
import React, { useState, useMemo } from 'react';
import { 
  VFXShotData, 
  Complexity, 
  Resolution, 
  FPS, 
  Management, 
  ReelPermission,
  CostBreakdown 
} from './types';
import { MULTIPLIERS, DEFAULT_BASE_PRICE, DEFAULT_DURATION } from './constants';
import { InputGroup, RadioCards } from './components/InputGroup';
import { ResultsPanel } from './components/ResultsPanel';
import { 
  Clapperboard, 
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
  FileText
} from 'lucide-react';

const App: React.FC = () => {
  // State initialization
  const [shotData, setShotData] = useState<VFXShotData>({
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
    brief: Complexity.NONE,
    // Mgmt
    onSceneManagement: Management.NO, // Default to No (no discount)
    allowOnReel: ReelPermission.NO,
  });

  // Calculation Logic
  const breakdown = useMemo<CostBreakdown>(() => {
    const { 
      basePrice, duration, resolution, fps, 
      roto, cleanup, keying, 
      cameraTracking, objectTracking, matchMove,
      model3d, rigging, sceneReconstruction, propsEnvs,
      animation, mocap, simulation,
      compositing3d, compositing2d, layerAnimation,
      urgent, brief,
      onSceneManagement, allowOnReel
    } = shotData;

    const baseCostOfShot = basePrice * duration;

    // 1. Resolution Cost
    const resMultiplier = MULTIPLIERS.RESOLUTION[resolution];
    const resolutionCost = baseCostOfShot * resMultiplier;

    // 2. FPS Cost
    const fpsMultiplier = MULTIPLIERS.FPS_FACTOR[fps];
    const fpsCost = resolutionCost * fpsMultiplier;

    // 3. Prep / Post Production Steps (Multiplied by Duration)
    const rotoCost = baseCostOfShot * MULTIPLIERS.ROTO[roto];
    const cleanupCost = baseCostOfShot * MULTIPLIERS.CLEANUP[cleanup];
    const keyingCost = baseCostOfShot * MULTIPLIERS.KEYING[keying];
    const camTrackCost = baseCostOfShot * MULTIPLIERS.CAM_TRACK[cameraTracking];
    const objTrackCost = baseCostOfShot * MULTIPLIERS.OBJ_TRACK[objectTracking];
    const matchMoveCost = baseCostOfShot * MULTIPLIERS.MATCH_MOVE[matchMove];

    const trackingTotal = camTrackCost + objTrackCost + matchMoveCost;

    // 4. Production: Assets (Flat Fee based on BasePrice, NOT Duration)
    const modelCost = basePrice * MULTIPLIERS.MODEL_3D[model3d];
    const riggingCost = basePrice * MULTIPLIERS.RIGGING[rigging];
    const sceneCost = basePrice * MULTIPLIERS.SCENE_RECON[sceneReconstruction];
    const propsCost = basePrice * MULTIPLIERS.PROPS_ENV[propsEnvs];
    
    const assetCost = modelCost + riggingCost + sceneCost + propsCost;

    // 5. Production: Animation & FX (Multiplied by Duration)
    const animCost = baseCostOfShot * MULTIPLIERS.ANIMATION[animation];
    const mocapCost = baseCostOfShot * MULTIPLIERS.MOCAP[mocap];
    const simCost = baseCostOfShot * MULTIPLIERS.SIMULATION[simulation];

    // 6. Post Production (Multiplied by Duration)
    const comp3dCost = baseCostOfShot * MULTIPLIERS.COMPOSITING_3D[compositing3d];
    const comp2dCost = baseCostOfShot * MULTIPLIERS.COMPOSITING_2D[compositing2d];
    const layerAnimCost = baseCostOfShot * MULTIPLIERS.LAYER_ANIM[layerAnimation];

    // 7. Extras (Multiplied by Duration)
    const urgentCost = baseCostOfShot * MULTIPLIERS.URGENT[urgent];
    const briefCost = baseCostOfShot * MULTIPLIERS.BRIEF[brief];

    const subTotal = 
      baseCostOfShot + 
      resolutionCost + 
      fpsCost + 
      rotoCost + 
      cleanupCost + 
      keyingCost + 
      trackingTotal +
      assetCost +
      animCost +
      mocapCost +
      simCost +
      comp3dCost +
      comp2dCost +
      layerAnimCost +
      urgentCost +
      briefCost;

    // 8. Management Discount
    // Using simple lookup now that constants are correct
    const managementAdjustment = subTotal * MULTIPLIERS.MANAGEMENT[onSceneManagement];

    // 9. Reel Discount
    // Calculated from the total after management discount
    const totalAfterMgmt = subTotal + managementAdjustment;
    let reelDiscount = 0;
    if (allowOnReel === ReelPermission.YES) {
      reelDiscount = totalAfterMgmt * MULTIPLIERS.REEL_PERMISSION[ReelPermission.YES];
    }

    const total = totalAfterMgmt + reelDiscount;

    return {
      baseCost: baseCostOfShot,
      resolutionCost,
      fpsCost,
      rotoCost,
      cleanupCost,
      keyingCost,
      trackingCost: trackingTotal,
      assetCost,
      animationCost: animCost + mocapCost,
      simulationCost: simCost,
      compositingCost: comp3dCost + comp2dCost,
      layerAnimCost,
      urgentCost,
      briefCost,
      managementAdjustment,
      reelDiscount,
      total
    };
  }, [shotData]);

  // Handlers
  const handleComplexityChange = (key: keyof VFXShotData) => (value: string) => {
    setShotData(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: keyof VFXShotData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setShotData(prev => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
  };

  // Styles
  const complexityColors = {
    [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
    [Complexity.EASY]: 'bg-emerald-900/30 border-emerald-700 text-emerald-400',
    [Complexity.MEDIUM]: 'bg-yellow-900/30 border-yellow-700 text-yellow-400',
    [Complexity.HARD]: 'bg-rose-900/30 border-rose-700 text-rose-400',
  };

  const assetColors = {
    [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
    [Complexity.EASY]: 'bg-indigo-900/30 border-indigo-700 text-indigo-400',
    [Complexity.MEDIUM]: 'bg-purple-900/30 border-purple-700 text-purple-400',
    [Complexity.HARD]: 'bg-fuchsia-900/30 border-fuchsia-700 text-fuchsia-400',
  };

  const animColors = {
    [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
    [Complexity.EASY]: 'bg-pink-900/30 border-pink-700 text-pink-400',
    [Complexity.MEDIUM]: 'bg-rose-900/30 border-rose-700 text-rose-400',
    [Complexity.HARD]: 'bg-red-900/30 border-red-700 text-red-400',
  };

  const compColors = {
    [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
    [Complexity.EASY]: 'bg-amber-900/30 border-amber-700 text-amber-400',
    [Complexity.MEDIUM]: 'bg-orange-900/30 border-orange-700 text-orange-400',
    [Complexity.HARD]: 'bg-red-950 border-red-800 text-red-500',
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Clapperboard className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">VFX Price Architect</h1>
              <p className="text-xs text-slate-400">Production Cost Estimator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Global Settings */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
                Base Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Base Price ($ / sec)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      min="0"
                      value={shotData.basePrice}
                      onChange={handleNumberChange('basePrice')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Shot Duration (Seconds)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="number"
                      min="0"
                      value={shotData.duration}
                      onChange={handleNumberChange('duration')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Specs */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8">Technical Specifications</h2>
              
              <InputGroup label="Resolution" icon={<Monitor size={18}/>} description="Higher resolution adds surcharge relative to base price.">
                <RadioCards 
                  options={Object.values(Resolution)} 
                  value={shotData.resolution} 
                  onChange={handleComplexityChange('resolution')} 
                />
              </InputGroup>

              <InputGroup label="Frame Rate" icon={<Zap size={18}/>} description="60 FPS doubles the resolution cost surcharge.">
                <RadioCards 
                  options={Object.values(FPS)} 
                  value={shotData.fps} 
                  onChange={handleComplexityChange('fps')} 
                  labels={{[FPS.FPS_30]: '30 FPS', [FPS.FPS_60]: '60 FPS'}}
                />
              </InputGroup>
            </section>

            {/* Pre Production */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-cyan-200">Pre-Production / Prep</h2>
              
              <InputGroup label="Roto" icon={<ScanFace size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.roto} 
                  onChange={handleComplexityChange('roto')}
                  colorMap={complexityColors}
                />
              </InputGroup>

              <InputGroup label="Cleanup / Paint" icon={<Wand2 size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.cleanup} 
                  onChange={handleComplexityChange('cleanup')}
                  colorMap={complexityColors}
                />
              </InputGroup>

              <InputGroup label="Keying (Green Screen)" icon={<BoxSelect size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.keying} 
                  onChange={handleComplexityChange('keying')}
                  colorMap={complexityColors}
                />
              </InputGroup>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Camera Tracking" icon={<Camera size={18}/>}>
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.cameraTracking} 
                    onChange={handleComplexityChange('cameraTracking')}
                    colorMap={complexityColors}
                    />
                </InputGroup>
                
                <InputGroup label="Object Tracking" icon={<BoxSelect size={18}/>}>
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.objectTracking} 
                    onChange={handleComplexityChange('objectTracking')}
                    colorMap={complexityColors}
                    />
                </InputGroup>
              </div>

              <InputGroup label="Match Move" icon={<Move size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.matchMove} 
                  onChange={handleComplexityChange('matchMove')}
                  colorMap={complexityColors}
                />
              </InputGroup>
            </section>

             {/* Production Assets */}
             <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-indigo-300">Production: 3D Assets</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="3D Model" icon={<Cuboid size={18}/>} description="Flat fee based on Base Price (2x-12x+)">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.model3d} 
                    onChange={handleComplexityChange('model3d')}
                    colorMap={assetColors}
                  />
                </InputGroup>

                <InputGroup label="Rigging" icon={<Workflow size={18}/>} description="Flat fee based on Base Price">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.rigging} 
                    onChange={handleComplexityChange('rigging')}
                    colorMap={assetColors}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Scene Reconstruct" icon={<HardHat size={18}/>} description="Flat fee for environment reconstruction">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.sceneReconstruction} 
                    onChange={handleComplexityChange('sceneReconstruction')}
                    colorMap={assetColors}
                    />
                </InputGroup>

                <InputGroup label="Props & Environment" icon={<Tent size={18}/>} description="Flat fee for props and environment">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.propsEnvs} 
                    onChange={handleComplexityChange('propsEnvs')}
                    colorMap={assetColors}
                    />
                </InputGroup>
              </div>
            </section>

            {/* Production Animation */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-pink-300">Production: Animation & FX</h2>

              <InputGroup label="Keyframe Animation" icon={<Play size={18}/>} description="Cost scales with duration">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.animation} 
                  onChange={handleComplexityChange('animation')}
                  colorMap={animColors}
                />
              </InputGroup>

              <InputGroup label="Mocap Cleanup" icon={<User size={18}/>} description="Cost scales with duration">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.mocap} 
                  onChange={handleComplexityChange('mocap')}
                  colorMap={animColors}
                />
              </InputGroup>

              <InputGroup label="Simulation (FX)" icon={<Flame size={18}/>} description="Heavy computational tasks (Fire, Water, Particles)">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.simulation} 
                  onChange={handleComplexityChange('simulation')}
                  colorMap={{
                    [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
                    [Complexity.EASY]: 'bg-orange-900/30 border-orange-700 text-orange-400',
                    [Complexity.MEDIUM]: 'bg-red-900/30 border-red-700 text-red-400',
                    [Complexity.HARD]: 'bg-red-950 border-red-600 text-red-500 shadow-red-500/20',
                  }}
                />
              </InputGroup>
            </section>

            {/* Post Production */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-amber-300">Post Production</h2>

              <InputGroup label="3D Compositing" icon={<Layers size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.compositing3d} 
                  onChange={handleComplexityChange('compositing3d')}
                  colorMap={compColors}
                />
              </InputGroup>

              <InputGroup label="2D Compositing" icon={<Layers size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.compositing2d} 
                  onChange={handleComplexityChange('compositing2d')}
                  colorMap={compColors}
                />
              </InputGroup>

              <InputGroup label="Layer Animation" icon={<Sparkles size={18}/>}>
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.layerAnimation} 
                  onChange={handleComplexityChange('layerAnimation')}
                  colorMap={compColors}
                />
              </InputGroup>
            </section>

             {/* Extras & Management */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white mt-8 text-violet-300">Delivery & Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Urgent Delivery" icon={<Timer size={18}/>} description="Rush fee multiplier">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.urgent} 
                    onChange={handleComplexityChange('urgent')}
                    colorMap={{
                      [Complexity.NONE]: 'bg-slate-800 border-slate-700 text-slate-400',
                      [Complexity.EASY]: 'bg-red-900/20 border-red-800 text-red-300',
                      [Complexity.MEDIUM]: 'bg-red-900/40 border-red-700 text-red-400',
                      [Complexity.HARD]: 'bg-red-900/60 border-red-600 text-red-500',
                    }}
                  />
                </InputGroup>

                <InputGroup label="Creative Brief" icon={<FileText size={18}/>} description="Complexity of creative requirements">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.brief} 
                    onChange={handleComplexityChange('brief')}
                    colorMap={complexityColors}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputGroup label="On-Scene Supervisor" icon={<Users size={18}/>} description="Selecting 'Yes' applies a 5% discount.">
                  <RadioCards 
                    options={Object.values(Management)} 
                    value={shotData.onSceneManagement} 
                    onChange={handleComplexityChange('onSceneManagement')}
                    labels={{ [Management.YES]: 'Yes (-5%)', [Management.NO]: 'No' }}
                  />
                </InputGroup>

                <InputGroup label="Allow on Reel" icon={<Film size={18}/>} description="Granting usage rights applies a 5% discount.">
                  <RadioCards 
                    options={Object.values(ReelPermission)} 
                    value={shotData.allowOnReel} 
                    onChange={handleComplexityChange('allowOnReel')}
                    labels={{ [ReelPermission.NO]: 'No', [ReelPermission.YES]: 'Yes (-5%)' }}
                  />
                </InputGroup>
              </div>
            </section>

          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <ResultsPanel breakdown={breakdown} duration={shotData.duration} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
