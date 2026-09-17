import { buildScenarioFixture, type ScenarioFixture as BaseScenarioFixture } from './seed-helpers.js';

export interface ScenarioFixture extends BaseScenarioFixture {}

// DAC-032 normalization provenance lives in seed-helpers.ts at the readiness derivation.
export const fixture: ScenarioFixture = buildScenarioFixture('DAC-032');
