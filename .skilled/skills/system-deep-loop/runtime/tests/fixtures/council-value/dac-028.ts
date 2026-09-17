import { buildScenarioFixture, type ScenarioFixture as BaseScenarioFixture } from './seed-helpers.js';

export interface ScenarioFixture extends BaseScenarioFixture {}

export const fixture: ScenarioFixture = buildScenarioFixture('DAC-028');
