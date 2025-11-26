
import { Complexity, Resolution, FPS, Management, ReelPermission, BriefType } from './types';

export const DEFAULT_BASE_PRICE = 10000; // Updated default for MMK scale
export const DEFAULT_DURATION = 5;

// Theme: Yellow, Red, White, Black
export const COLORS = {
  base: '#525252',      // neutral-600 (Grey)
  resolution: '#d4d4d4',// neutral-300 (White/Light Grey)
  roto: '#fbbf24',      // amber-400 (Yellow)
  tracking: '#f59e0b',  // amber-500 (Dark Yellow)
  assets: '#f87171',    // red-400 (Light Red)
  animation: '#ef4444', // red-500 (Red)
  simulation: '#b91c1c',// red-700 (Dark Red)
  compositing: '#7f1d1d', // red-900 (Deep Red)
  extras: '#ffffff',    // white
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
    [BriefType.CLEAR]: 0,
    [BriefType.NOT_CLEAR]: 0.40,
  },

  // --- DISCOUNTS ---
  MANAGEMENT: {
    [Management.YES]: -0.05, 
    [Management.NO]: 0,      
  },
  REEL_PERMISSION: {
    [ReelPermission.NO]: 0,
    [ReelPermission.YES]: -0.05, 
  }
};

// Detailed Descriptions for User Selection
export const OPTION_DETAILS = {
  ROTO: {
    [Complexity.EASY]: "Simple, rigid objects with hard edges and minimal movement (e.g., a phone, a box, a sign).",
    [Complexity.MEDIUM]: "Organic shapes with articulation and moderate movement (e.g., a person walking, hand gestures).",
    [Complexity.HARD]: "Fast motion blur, fine detail like hair/fur, or complex overlapping crowds.",
  },
  CLEANUP: {
    [Complexity.EASY]: "Static removal on non-moving backgrounds (e.g., removing a wire against a clear sky).",
    [Complexity.MEDIUM]: "Removing tracking markers or rigs from moving skin, cloth, or dynamic surfaces.",
    [Complexity.HARD]: "Complex background reconstruction behind the removed object, or reflections/refractions.",
  },
  KEYING: {
    [Complexity.EASY]: "Perfectly lit green screen, no motion blur, clear separation from background.",
    [Complexity.MEDIUM]: "Uneven lighting, minor spill, or semi-transparent objects requiring extra edge work.",
    [Complexity.HARD]: "Heavy spill, fine hair detail, motion blur, or color similarity between subject and screen.",
  },
  TRACKING: {
    [Complexity.EASY]: "Smooth camera movement with high-contrast, static markers visible throughout the shot.",
    [Complexity.MEDIUM]: "Handheld camera motion, rack focus, or markers that become temporarily obscured.",
    [Complexity.HARD]: "Rapid whip-pans, excessive motion blur, zoom lenses, or lack of trackable texture.",
  },
  MATCH_MOVE: {
    [Complexity.EASY]: "Basic alignment of simple geometry to the camera perspective.",
    [Complexity.MEDIUM]: "Matching 3D objects to interact with the ground or walls (shadow catching).",
    [Complexity.HARD]: "Precise contact points for deforming objects, or matching complex physical interactions.",
  },
  MODEL_3D: {
    [Complexity.EASY]: "Simple hard-surface props with low detail (e.g., phone, crate, street sign).",
    [Complexity.MEDIUM]: "Stylized characters, vehicles, or hero props with moderate textural detail.",
    [Complexity.HARD]: "Photorealistic humans, complex creatures, or hero vehicles with full interiors.",
  },
  RIGGING: {
    [Complexity.EASY]: "Basic prop rigging (e.g., hinges, wheels, simple pivots).",
    [Complexity.MEDIUM]: "Standard bipedal character rig with basic facial controls.",
    [Complexity.HARD]: "Complex creature rigs (quadrupeds, wings), muscle systems, or advanced facial performance.",
  },
  SCENE_RECON: {
    [Complexity.EASY]: "Basic planes and cubes to catch shadows and reflections.",
    [Complexity.MEDIUM]: "Rough geometry of a room or street for accurate lighting interactions.",
    [Complexity.HARD]: "Photogrammetry-level detail of a complex environment for collision and close-ups.",
  },
  PROPS_ENV: {
    [Complexity.EASY]: "Simple 2D/2.5D background replacements or matte painting extensions.",
    [Complexity.MEDIUM]: "3D set extensions, digital foliage, or mid-ground elements.",
    [Complexity.HARD]: "Full CG environment creation, weather effects, or water simulation.",
  },
  ANIMATION: {
    [Complexity.EASY]: "Simple cycles (walk/run) or mechanical prop movement.",
    [Complexity.MEDIUM]: "Character acting, physical weight, and interaction with the environment.",
    [Complexity.HARD]: "Nuanced facial performance, complex combat choreography, or acrobatics.",
  },
  MOCAP: {
    [Complexity.EASY]: "Basic data cleanup, fixing sliding feet on flat ground.",
    [Complexity.MEDIUM]: "Retargeting data to a character with different proportions.",
    [Complexity.HARD]: "Solving heavy occlusion, stitching multiple takes, or cleaning finger/face data.",
  },
  SIMULATION: {
    [Complexity.EASY]: "Simple particles (dust, rain, sparks) or cigarette smoke.",
    [Complexity.MEDIUM]: "Fire, volumetric smoke, or rigid body destruction (breaking glass).",
    [Complexity.HARD]: "Complex fluid dynamics (water splashes), realistic cloth/hair, or large-scale destruction.",
  },
  COMPOSITING_3D: {
    [Complexity.EASY]: "Placing a static CG object on a table with basic shadow integration.",
    [Complexity.MEDIUM]: "Integrating moving CG characters with proper lighting and shadow catching.",
    [Complexity.HARD]: "Deep compositing, full CG shots, volumetrics, and crowd integration.",
  },
  COMPOSITING_2D: {
    [Complexity.EASY]: "Screen replacements, simple sky swaps, or basic color matching.",
    [Complexity.MEDIUM]: "Day-for-night conversion, cosmetic fixes (beauty work), or set extensions.",
    [Complexity.HARD]: "Deep restoration, complex beauty work, or seamless integration of multiple plates.",
  },
  LAYER_ANIM: {
    [Complexity.EASY]: "Simple text overlays, lower thirds, or subtitles.",
    [Complexity.MEDIUM]: "Tracking graphic elements (HUDs) to moving actors or objects.",
    [Complexity.HARD]: "Complex holographic interfaces, particle-based motion graphics, or FUI (Future UI).",
  },
  URGENT: {
    [Complexity.EASY]: "Timeline is tight but manageable (e.g., < 1 week).",
    [Complexity.MEDIUM]: "Overtime required, weekend work necessary (e.g., 2-3 days).",
    [Complexity.HARD]: "Immediate turnaround required, 24/7 crunch (e.g., overnight/same day).",
  },
  BRIEF: {
    [BriefType.CLEAR]: "Detailed storyboard, locked edit, and references provided. No extra cost.",
    [BriefType.NOT_CLEAR]: "Vague concepts, loose timeline, or requires extensive R&D/Look-dev. Adds 40% surcharge.",
  },
};