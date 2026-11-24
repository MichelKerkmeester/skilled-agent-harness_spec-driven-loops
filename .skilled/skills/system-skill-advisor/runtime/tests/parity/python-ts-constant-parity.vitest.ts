// ───────────────────────────────────────────────────────────────────
// MODULE: Python and TypeScript Advisor Constant Parity Tests
// ───────────────────────────────────────────────────────────────────
import { spawnSync } from 'node:child_process';

import { beforeAll, describe, expect, it } from 'vitest';

import { SCORING_CALIBRATION } from '../../lib/scorer/scoring-constants.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';
import { ADVISOR_PROMPT_MAX_CHARS } from '../../schemas/advisor-tool-schemas.js';

interface PythonConstants {
  readonly promptMaxChars: number;
  readonly loopOwnerConfidenceFloor: number;
}

let pythonConstants: PythonConstants;

beforeAll(() => {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print(json.dumps({
    'promptMaxChars': mod.ADVISOR_PROMPT_MAX_CHARS,
    'loopOwnerConfidenceFloor': mod._LOOP_OWNER_CONFIDENCE_FLOOR,
}))
`;
  const result = spawnSync('python3', ['-c', script, findAdvisorWorkspaceRoot(import.meta.dirname)], {
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Python advisor constants failed to load: ${result.stderr || result.error?.message || result.stdout}`);
  }
  pythonConstants = JSON.parse(result.stdout) as PythonConstants;
});

describe('Python and TypeScript advisor constant parity', () => {
  it('keeps the Python fallback prompt cap equal to the TypeScript schema cap', () => {
    expect(pythonConstants.promptMaxChars).toBe(ADVISOR_PROMPT_MAX_CHARS);
  });

  it('keeps the Python loop-owner floor equal to the TypeScript task-intent floor', () => {
    expect(pythonConstants.loopOwnerConfidenceFloor).toBe(SCORING_CALIBRATION.confidence.taskIntentFloor);
  });

  it('keeps the Python loop-owner floor equal to the TypeScript direct-score floor', () => {
    expect(pythonConstants.loopOwnerConfidenceFloor).toBe(SCORING_CALIBRATION.confidence.directScoreFloor);
  });
});
