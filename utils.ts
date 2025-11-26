
import { VFXShotData, CostBreakdown, ReelPermission } from './types';
import { MULTIPLIERS } from './constants';

export const calculateBreakdown = (shotData: VFXShotData): CostBreakdown => {
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

  // 2. Prep / Post Production Steps (Multiplied by Duration)
  const rotoCost = baseCostOfShot * MULTIPLIERS.ROTO[roto];
  const cleanupCost = baseCostOfShot * MULTIPLIERS.CLEANUP[cleanup];
  const keyingCost = baseCostOfShot * MULTIPLIERS.KEYING[keying];
  const camTrackCost = baseCostOfShot * MULTIPLIERS.CAM_TRACK[cameraTracking];
  const objTrackCost = baseCostOfShot * MULTIPLIERS.OBJ_TRACK[objectTracking];
  const matchMoveCost = baseCostOfShot * MULTIPLIERS.MATCH_MOVE[matchMove];

  const trackingTotal = camTrackCost + objTrackCost + matchMoveCost;

  // 3. Production: Assets (Flat Fee based on BasePrice, NOT Duration)
  const modelCost = basePrice * MULTIPLIERS.MODEL_3D[model3d];
  const riggingCost = basePrice * MULTIPLIERS.RIGGING[rigging];
  const sceneCost = basePrice * MULTIPLIERS.SCENE_RECON[sceneReconstruction];
  const propsCost = basePrice * MULTIPLIERS.PROPS_ENV[propsEnvs];
  
  const assetCost = modelCost + riggingCost + sceneCost + propsCost;

  // 4. Production: Animation & FX (Multiplied by Duration)
  const animCost = baseCostOfShot * MULTIPLIERS.ANIMATION[animation];
  const mocapCost = baseCostOfShot * MULTIPLIERS.MOCAP[mocap];
  const simCost = baseCostOfShot * MULTIPLIERS.SIMULATION[simulation];

  // 5. Post Production (Multiplied by Duration)
  const comp3dCost = baseCostOfShot * MULTIPLIERS.COMPOSITING_3D[compositing3d];
  const comp2dCost = baseCostOfShot * MULTIPLIERS.COMPOSITING_2D[compositing2d];
  const layerAnimCost = baseCostOfShot * MULTIPLIERS.LAYER_ANIM[layerAnimation];

  // 6. Extras (Multiplied by Duration)
  const urgentCost = baseCostOfShot * MULTIPLIERS.URGENT[urgent];
  const briefCost = baseCostOfShot * MULTIPLIERS.BRIEF[brief];

  // Calculate Subtotal BEFORE FPS Surcharge
  const subTotalBeforeFPS = 
    baseCostOfShot + 
    resolutionCost + 
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

  // 7. FPS Cost (20% of Total Scene Estimate)
  // Logic: 60FPS adds 20% to the accumulation of all previous costs
  const fpsMultiplier = MULTIPLIERS.FPS_FACTOR[fps];
  const fpsCost = subTotalBeforeFPS * fpsMultiplier;

  const subTotal = subTotalBeforeFPS + fpsCost;

  // 8. Management Discount
  const managementAdjustment = subTotal * MULTIPLIERS.MANAGEMENT[onSceneManagement];

  // 9. Reel Discount
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
};

export const formatMoney = (amount: number, symbol = 'MMK') => {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${symbol}`;
};
