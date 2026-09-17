import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { cleanupNamespace } from '../helpers/spawn-cjs';
import {
  appendMetricsReport,
  seedArtifactTree,
  upsertFixtureGraph,
} from '../fixtures/council-value/seed-helpers.js';
import { fixture as dac027 } from '../fixtures/council-value/dac-027.js';
import { fixture as dac028 } from '../fixtures/council-value/dac-028.js';
import { fixture as dac029 } from '../fixtures/council-value/dac-029.js';
import { fixture as dac030 } from '../fixtures/council-value/dac-030.js';
import { fixture as dac031 } from '../fixtures/council-value/dac-031.js';
import { fixture as dac032 } from '../fixtures/council-value/dac-032.js';

describe('Council graph value scenarios through runtime CLI (DAC-027..DAC-032)', () => {
  it('DAC-027 graph beats no-graph baseline', async () => runFixture(dac027));
  it('DAC-028 graph beats no-graph baseline', async () => runFixture(dac028));
  it('DAC-029 graph beats no-graph baseline', async () => runFixture(dac029));
  it('DAC-030 graph beats no-graph baseline', async () => runFixture(dac030));
  it('DAC-031 graph beats no-graph baseline', async () => runFixture(dac031));
  it('DAC-032 graph beats no-graph baseline', async () => runFixture(dac032));
});

async function runFixture(fx: typeof dac027): Promise<void> {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${fx.scenarioId.toLowerCase()}-`));
  let namespace: Awaited<ReturnType<typeof upsertFixtureGraph>> | null = null;

  try {
    seedArtifactTree(tmpRoot, fx.artifactTree);
    namespace = await upsertFixtureGraph(fx.specFolder, fx.sessionId, fx.graphSeed);

    const baseline = await fx.baseline.runner(tmpRoot);
    const graph = await fx.graph.runner(fx.specFolder, fx.sessionId);

    expect(graph.answer).toEqual(fx.graph.expectedAnswer);
    expect(baseline.answer).toEqual(fx.baseline.expectedAnswer);
    expect(baseline.fileReads).toBeGreaterThanOrEqual(fx.baseline.minFileReads);
    expect(graph.runtimeCalls).toBeLessThanOrEqual(baseline.fileReads);

    appendMetricsReport(fx.scenarioId, {
      baselineFileReads: baseline.fileReads,
      runtimeGraphCalls: graph.runtimeCalls,
      ratio: baseline.fileReads / Math.max(graph.runtimeCalls, 1),
    });
  } finally {
    if (namespace) await cleanupNamespace(namespace);
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}
