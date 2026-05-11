import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  appendMetricsReport,
  openTempCouncilGraphDb,
  seedArtifactTree,
  upsertFixtureGraph,
} from './fixtures/council-value/seed-helpers.js';
import { fixture as dac027 } from './fixtures/council-value/dac-027.js';
import { fixture as dac028 } from './fixtures/council-value/dac-028.js';
import { fixture as dac029 } from './fixtures/council-value/dac-029.js';
import { fixture as dac030 } from './fixtures/council-value/dac-030.js';
import { fixture as dac031 } from './fixtures/council-value/dac-031.js';
import { fixture as dac032 } from './fixtures/council-value/dac-032.js';

const fixtures = [dac027, dac028, dac029, dac030, dac031, dac032];

describe('Council graph value scenarios (DAC-027..DAC-032)', () => {
  for (const fx of fixtures) {
    it(`${fx.scenarioId} graph beats no-graph baseline`, async () => {
      const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${fx.scenarioId.toLowerCase()}-`));
      const { db, cleanup } = openTempCouncilGraphDb();

      try {
        seedArtifactTree(tmpRoot, fx.artifactTree);
        await upsertFixtureGraph(fx.specFolder, fx.sessionId, fx.graphSeed);

        const baseline = await fx.baseline.runner(tmpRoot);
        const graph = await fx.graph.runner(db, fx.specFolder, fx.sessionId);

        expect(graph.answer).toEqual(fx.graph.expectedAnswer);
        expect(baseline.answer).toEqual(fx.baseline.expectedAnswer);
        expect(baseline.fileReads).toBeGreaterThanOrEqual(fx.baseline.minFileReads);
        expect(graph.mcpCalls).toBeLessThanOrEqual(baseline.fileReads);

        appendMetricsReport(fx.scenarioId, {
          baselineFileReads: baseline.fileReads,
          graphMcpCalls: graph.mcpCalls,
          ratio: baseline.fileReads / Math.max(graph.mcpCalls, 1),
        });
      } finally {
        cleanup();
        fs.rmSync(tmpRoot, { recursive: true, force: true });
      }
    });
  }
});
