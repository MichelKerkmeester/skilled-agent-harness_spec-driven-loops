import { buildScenarioFixture, type ScenarioFixture as BaseScenarioFixture } from './seed-helpers.js';

export interface ScenarioFixture extends BaseScenarioFixture {}

// DAC-030 normalization provenance lives in seed-helpers.ts at rankDac030Blockers().
export const fixture: ScenarioFixture = buildScenarioFixture('DAC-030');
