import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const WORKFLOW_PATH = resolve(
  process.cwd(),
  '../../../../commands/deep/assets/deep-model-benchmark-auto.yaml',
);

describe('autonomous benchmark promotion authority', () => {
  it('is advisory-only and cannot invoke a canonical promotion command', () => {
    const workflow = readFileSync(WORKFLOW_PATH, 'utf8');

    expect(workflow).toMatch(/promotion:\s+advisory_only/);
    expect(workflow).toMatch(/step_recommend_candidate:/);
    expect(workflow).not.toMatch(/command:.*promote-candidate\.cjs/);
    expect(workflow).not.toMatch(/--approve=/);
  });
});
