// MODULE: Fanout Merge Question Shape Tests

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const mergeScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/fanout-merge.cjs');

describe('fanout-merge malformed question collections', () => {
  it('continues merging another lineage when question fields are not arrays', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-question-shape-'));
    try {
      const lineagesDir = join(artifactDir, 'lineages');
      const malformedDir = join(lineagesDir, 'malformed');
      const healthyDir = join(lineagesDir, 'healthy');
      fs.mkdirSync(malformedDir, { recursive: true });
      fs.mkdirSync(healthyDir, { recursive: true });
      fs.writeFileSync(join(malformedDir, 'findings-registry.json'), JSON.stringify({
        keyFindings: [],
        openQuestions: 5,
        resolvedQuestions: 3,
        ruledOutDirections: 2,
        metrics: { iterationsCompleted: 0, convergenceScore: 0 },
      }));
      fs.writeFileSync(join(healthyDir, 'findings-registry.json'), JSON.stringify({
        keyFindings: [{ id: 'F-HEALTHY', title: 'Surviving other lineage finding' }],
        openQuestions: [],
        resolvedQuestions: [],
        ruledOutDirections: [],
        metrics: { iterationsCompleted: 1, convergenceScore: 0.5 },
      }));

      const result = spawnSync(process.execPath, [
        mergeScript,
        '--loop-type',
        'research',
        '--artifact-dir',
        artifactDir,
      ], { encoding: 'utf8' });

      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout).status).toBe('ok');
      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8'));
      expect(merged.keyFindings.map((finding: { title: string }) => finding.title)).toContain(
        'Surviving other lineage finding',
      );
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });
});
