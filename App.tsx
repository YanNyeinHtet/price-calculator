
import React, { useState, useMemo } from 'react';
import { 
  VFXShotData, 
  Complexity, 
  Resolution, 
  FPS, 
  Management, 
  ReelPermission,
  BriefType,
  CostBreakdown 
} from './types';
import { MULTIPLIERS, DEFAULT_BASE_PRICE, DEFAULT_DURATION, OPTION_DETAILS } from './constants';
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
  FileText
} from 'lucide-react';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MMK';
};

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
    brief: BriefType.CLEAR, // Default to Clear (No Cost)
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
    
    // Brief Cost: 40% of BasePrice * Duration if Not Clear
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

  // Styles - Yellow/Red/Black Theme
  // Easy: Yellow, Medium: Orange, Hard: Red
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
          
          {/* Mobile Sticky Price Display */}
          <div className="flex flex-col items-end lg:hidden">
             <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Estimated Cost</span>
             <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 leading-none">
               {formatMoney(breakdown.total)}
             </span>
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
                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                Base Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Base Price (MMK / sec)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">MMK</span>
                    <input
                      type="number"
                      min="0"
                      value={shotData.basePrice}
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
                      value={shotData.duration}
                      onChange={handleNumberChange('duration')}
                      className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
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
                  colorMap={{
                    [Resolution.RES_1080]: 'bg-neutral-900 border-neutral-800 text-neutral-400',
                    [Resolution.RES_4K]: 'bg-neutral-800 border-neutral-600 text-white',
                    [Resolution.RES_6K]: 'bg-neutral-700 border-neutral-500 text-white',
                  }}
                />
              </InputGroup>

              <InputGroup label="Frame Rate" icon={<Zap size={18}/>} description="60 FPS doubles the resolution cost surcharge.">
                <RadioCards 
                  options={Object.values(FPS)} 
                  value={shotData.fps} 
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
                  value={shotData.roto} 
                  onChange={handleComplexityChange('roto')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.ROTO}
                />
              </InputGroup>

              <InputGroup label="Cleanup / Paint" icon={<Wand2 size={18}/>} description="Removing unwanted elements like wires, rigs, tracking markers, or blemishes.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.cleanup} 
                  onChange={handleComplexityChange('cleanup')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.CLEANUP}
                />
              </InputGroup>

              <InputGroup label="Keying (Green Screen)" icon={<BoxSelect size={18}/>} description="Extracting subjects from green/blue screens to replace the background.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.keying} 
                  onChange={handleComplexityChange('keying')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.KEYING}
                />
              </InputGroup>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Camera Tracking" icon={<Camera size={18}/>} description="Deriving the movement of the physical camera to match it in 3D space.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.cameraTracking} 
                    onChange={handleComplexityChange('cameraTracking')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.TRACKING}
                    />
                </InputGroup>
                
                <InputGroup label="Object Tracking" icon={<BoxSelect size={18}/>} description="Tracking the movement of specific objects or actors for 3D interaction.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.objectTracking} 
                    onChange={handleComplexityChange('objectTracking')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.TRACKING}
                    />
                </InputGroup>
              </div>

              <InputGroup label="Match Move" icon={<Move size={18}/>} description="Precise alignment of CG elements to the live-action footage perspective.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.matchMove} 
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
                    value={shotData.model3d} 
                    onChange={handleComplexityChange('model3d')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.MODEL_3D}
                  />
                </InputGroup>

                <InputGroup label="Rigging" icon={<Workflow size={18}/>} description="Building the digital skeleton and controls for animation. Flat fee.">
                  <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.rigging} 
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
                    value={shotData.sceneReconstruction} 
                    onChange={handleComplexityChange('sceneReconstruction')}
                    colorMap={complexityColors}
                    descriptions={OPTION_DETAILS.SCENE_RECON}
                    />
                </InputGroup>

                <InputGroup label="Props & Environment" icon={<Tent size={18}/>} description="Creating digital set dressing and background elements. Flat fee.">
                    <RadioCards 
                    options={Object.values(Complexity)} 
                    value={shotData.propsEnvs} 
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
                  value={shotData.animation} 
                  onChange={handleComplexityChange('animation')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.ANIMATION}
                />
              </InputGroup>

              <InputGroup label="Mocap Cleanup" icon={<User size={18}/>} description="Refining raw motion capture data to fix jitters and sliding feet.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.mocap} 
                  onChange={handleComplexityChange('mocap')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.MOCAP}
                />
              </InputGroup>

              <InputGroup label="Simulation (FX)" icon={<Flame size={18}/>} description="Physics-based simulations for fire, water, smoke, cloth, or destruction.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.simulation} 
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
                  value={shotData.compositing3d} 
                  onChange={handleComplexityChange('compositing3d')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.COMPOSITING_3D}
                />
              </InputGroup>

              <InputGroup label="2D Compositing" icon={<Layers size={18}/>} description="Layer-based blending, color correction, and integration of 2D elements.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.compositing2d} 
                  onChange={handleComplexityChange('compositing2d')}
                  colorMap={complexityColors}
                  descriptions={OPTION_DETAILS.COMPOSITING_2D}
                />
              </InputGroup>

              <InputGroup label="Layer Animation" icon={<Sparkles size={18}/>} description="Animating 2D graphics, user interfaces (HUDs), or motion graphics.">
                <RadioCards 
                  options={Object.values(Complexity)} 
                  value={shotData.layerAnimation} 
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
                    value={shotData.urgent} 
                    onChange={handleComplexityChange('urgent')}
                    colorMap={urgentColors}
                    descriptions={OPTION_DETAILS.URGENT}
                  />
                </InputGroup>

                <InputGroup label="Creative Brief" icon={<FileText size={18}/>} description="If brief is not clear, 40% surcharge is applied for R&D.">
                  <RadioCards 
                    options={Object.values(BriefType)} 
                    value={shotData.brief} 
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
                    value={shotData.onSceneManagement} 
                    onChange={handleComplexityChange('onSceneManagement')}
                    labels={{ [Management.YES]: 'Yes (-5%)', [Management.NO]: 'No' }}
                    colorMap={reelColors}
                  />
                </InputGroup>

                <InputGroup label="Allow on Reel" icon={<Film size={18}/>} description="Granting usage rights for the studio's showreel applies a 5% discount.">
                  <RadioCards 
                    options={Object.values(ReelPermission)} 
                    value={shotData.allowOnReel} 
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
            <ResultsPanel breakdown={breakdown} duration={shotData.duration} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
