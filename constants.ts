
import { Complexity, Resolution, FPS, Management, ReelPermission } from './types';

export const DEFAULT_BASE_PRICE = 100;
export const DEFAULT_DURATION = 5;

export const COLORS = {
  base: '#94a3b8', // slate-400
  resolution: '#22d3ee', // cyan-400
  roto: '#10b981', // emerald-500
  tracking: '#34d399', // emerald-400
  assets: '#818cf8', // indigo-400
  animation: '#f472b6', // pink-400
  simulation: '#fb7185', // rose-400
  compositing: '#fbbf24', // amber-400
  extras: '#a78bfa', // violet-400
};

// Multipliers applied to (Base Price * Duration)
export const MULTIPLIERS = {
  RESOLUTION: {
    [Resolution.RES_1080]: 0,
    [Resolution.RES_4K]: 0.20,
    [Resolution.RES_6K]: 0.40,
  },
  // FPS Logic: 60fps is 2x the RESOLUTION PRICE (not base price)
  FPS_FACTOR: {
    [FPS.FPS_30]: 0,
    [FPS.FPS_60]: 2, // 2x the resolution cost
  },
  
  // --- PRE-PRODUCTION (Applied to Base * Duration) ---
  ROTO: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.35,
    [Complexity.MEDIUM]: 0.45,
    [Complexity.HARD]: 0.60,
  },
  CLEANUP: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.35,
    [Complexity.MEDIUM]: 0.45,
    [Complexity.HARD]: 0.60,
  },
  KEYING: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.30,
    [Complexity.MEDIUM]: 0.40,
    [Complexity.HARD]: 0.60,
  },
  CAM_TRACK: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.15,
    [Complexity.MEDIUM]: 0.35,
    [Complexity.HARD]: 0.70,
  },
  OBJ_TRACK: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.15,
    [Complexity.MEDIUM]: 0.35,
    [Complexity.HARD]: 0.70,
  },
  MATCH_MOVE: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.15,
    [Complexity.MEDIUM]: 0.60,
    [Complexity.HARD]: 1.20,
  },

  // --- PRODUCTION: ASSETS (Applied to Base Price ONLY - Flat Fee) ---
  MODEL_3D: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 4.0,
    [Complexity.MEDIUM]: 9.0,
    [Complexity.HARD]: 15.0,
  },
  RIGGING: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 4.0,
    [Complexity.MEDIUM]: 9.0,
    [Complexity.HARD]: 15.0,
  },
  SCENE_RECON: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 4.0,
    [Complexity.MEDIUM]: 11.0,
    [Complexity.HARD]: 20.0,
  },
  PROPS_ENV: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 4.0,
    [Complexity.MEDIUM]: 11.0,
    [Complexity.HARD]: 20.0,
  },

  // --- PRODUCTION: ANIMATION & FX (Applied to Base * Duration) ---
  ANIMATION: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.30,
    [Complexity.MEDIUM]: 0.60,
    [Complexity.HARD]: 1.20,
  },
  MOCAP: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.15,
    [Complexity.MEDIUM]: 0.30,
    [Complexity.HARD]: 0.60,
  },
  SIMULATION: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 1.0,
    [Complexity.MEDIUM]: 3.0,
    [Complexity.HARD]: 5.0,
  },

  // --- POST PRODUCTION (Applied to Base * Duration) ---
  COMPOSITING_3D: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.35,
    [Complexity.MEDIUM]: 0.45,
    [Complexity.HARD]: 0.60,
  },
  COMPOSITING_2D: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.15,
    [Complexity.MEDIUM]: 0.35,
    [Complexity.HARD]: 0.45,
  },
  LAYER_ANIM: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.30,
    [Complexity.MEDIUM]: 0.60,
    [Complexity.HARD]: 1.20,
  },

  // --- EXTRAS (Applied to Base * Duration) ---
  URGENT: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.30, 
    [Complexity.MEDIUM]: 0.60,
    [Complexity.HARD]: 1.20,
  },
  BRIEF: {
    [Complexity.NONE]: 0,
    [Complexity.EASY]: 0.20,
    [Complexity.MEDIUM]: 0.40,
    [Complexity.HARD]: 0.60,
  },

  // --- DISCOUNTS ---
  MANAGEMENT: {
    [Management.YES]: -0.05, // -5% (Updated: YES gets the discount)
    [Management.NO]: 0,      // (Updated: NO gets no discount)
  },
  REEL_PERMISSION: {
    [ReelPermission.NO]: 0,
    [ReelPermission.YES]: -0.05, // -5%
  }
};
