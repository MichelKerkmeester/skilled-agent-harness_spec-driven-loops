/**
 * Task Mode Detection Module
 * 
 * Analyzes user requests to suggest appropriate task modes:
 * - quick: Small fixes, single file changes
 * - standard: Normal feature development
 * - comprehensive: Large-scale refactors, system changes
 * - milestone: Release-oriented work, multi-phase projects
 * 
 * @module features/mode-detection
 */

export { detectTaskMode, shouldPromptForMode } from "./detector.js";
export type { ModeDetectionResult, DetectorOptions } from "./detector.js";
export type { TaskMode } from "../../core/types.js";
