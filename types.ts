
export enum Complexity {
  NONE = 'No',
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum Resolution {
  RES_1080 = '1080p',
  RES_4K = '4K',
  RES_6K = '6K',
}

export enum FPS {
  FPS_30 = '30',
  FPS_60 = '60',
}

export enum Management {
  YES = 'Yes',
  NO = 'No',
}

export enum ReelPermission {
  NO = 'No',
  YES = 'Yes',
}

export enum BriefType {
  CLEAR = 'Clear',
  NOT_CLEAR = 'Not Clear',
}

export interface VFXShotData {
  basePrice: number;
  duration: number;
  resolution: Resolution;
  fps: FPS;
  
  // Pre-Production / Prep
  roto: Complexity;
  cleanup: Complexity;
  keying: Complexity;
  cameraTracking: Complexity;
  objectTracking: Complexity;
  matchMove: Complexity;
  
  // Production - Assets
  model3d: Complexity;
  rigging: Complexity;
  sceneReconstruction: Complexity;
  propsEnvs: Complexity;

  // Production - Animation & FX
  animation: Complexity;
  mocap: Complexity;
  simulation: Complexity;

  // Post Production
  compositing3d: Complexity;
  compositing2d: Complexity;
  layerAnimation: Complexity;

  // Extras
  urgent: Complexity;
  brief: BriefType;

  // Discounts/Admin
  onSceneManagement: Management;
  allowOnReel: ReelPermission;
}

export interface CostBreakdown {
  baseCost: number;
  resolutionCost: number;
  fpsCost: number;
  
  // Prep
  rotoCost: number;
  cleanupCost: number;
  keyingCost: number;
  trackingCost: number;
  
  // Production
  assetCost: number;
  animationCost: number;
  simulationCost: number;

  // Post
  compositingCost: number;
  layerAnimCost: number;
  
  // Extras
  urgentCost: number;
  briefCost: number;

  managementAdjustment: number;
  reelDiscount: number;
  
  total: number;
}