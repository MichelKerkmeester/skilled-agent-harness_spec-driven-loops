// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Helper Hand-off Tests
// ───────────────────────────────────────────────────────────────────
// A doctor problem worded unlike any bridge phrase reaches /doctor:helper through the helper's
// own ranker. These cases pin the cue tiers and the ranker bridge; the routing slice pins the
// end-to-end ranking.

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { doctorProblemCue, genericRepairCue, matchDoctorProblem } from '../lib/scorer/doctor-helper-handoff.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: '.skilled' });

describe('doctor problem cue', () => {
  it('reads a wrong state or a health check as a strong cue', () => {
    expect(doctorProblemCue('code mode mcp is not registered in my runtime')).toBe('strong');
    expect(doctorProblemCue('my deep research run never converges')).toBe('strong');
    expect(doctorProblemCue('the trigger index lookup returns nothing')).toBe('strong');
    expect(doctorProblemCue('turn off one of the github actions workflows')).toBe('strong');
  });

  // A hook that does not fire is a broken state, not a bare problem word: the
  // operator reports it in exactly this shape, and the cue is what lets the
  // hand-off stand beside a passing skill.
  it('reads a hook that does not fire as a strong cue', () => {
    expect(doctorProblemCue('my hooks are not firing, what do I run')).toBe('strong');
    expect(doctorProblemCue('the git hooks are not triggering on commit')).toBe('strong');
  });

  // A loop that stopped converging reports the same wrong state in the past
  // tense, which the "never <verb>" form does not cover.
  it('reads a loop that stopped converging as a strong cue', () => {
    expect(doctorProblemCue('my research loop stopped converging and I cannot see why')).toBe('strong');
  });

  it('reads a bare problem word as a weak cue', () => {
    expect(doctorProblemCue('Fix the broken JSON example and revalidate the packet.')).toBe('weak');
    expect(doctorProblemCue('my AGENTS.md is out of date with the template')).toBe('weak');
  });

  it('finds no cue in a plain request', () => {
    expect(doctorProblemCue('Start a deep review loop over the packet docs.')).toBeNull();
    expect(doctorProblemCue('my doctor update came in')).toBeNull();
  });
});

describe('generic repair request cue', () => {
  // A repair route asked for in these words names no problem the ranker knows,
  // and the helper lists every route with its reason.
  it('reads a request for a repair route as a doctor request', () => {
    expect(genericRepairCue('I have a problem and want the right repair path suggested with reasons')).toBe(true);
  });

  // The same words in a remark about resolved work describe no open problem.
  it('ignores the same words once the problem is fixed', () => {
    expect(genericRepairCue('much appreciated, that fixed the problem completely')).toBe(false);
  });
});

describe('doctor helper ranker bridge', () => {
  it('returns the command the helper ranks first for a doctor problem', () => {
    const match = matchDoctorProblem('my deep research run never converges', WORKSPACE);
    expect(match?.command).toBe('/doctor:deep-loop');
    expect(match?.score).toBeGreaterThanOrEqual(6);
  });

  // The manifest phrases are the whole reason this reaches a command: the ranker
  // carries no synonym list of its own.
  it('reaches the git route for hooks that stopped firing', () => {
    const match = matchDoctorProblem('my hooks are not firing, what do I run', WORKSPACE);
    expect(match?.command).toBe('/doctor:git');
    expect(match?.score).toBeGreaterThanOrEqual(6);
  });

  // The ranker names the runnable with its subcommand, so a hand-off can offer
  // the exact command that runs instead of the helper that lists it.
  it('returns the ranked runnable with its subcommand', () => {
    expect(matchDoctorProblem('confirm the AGENTS.md sections in this repo have not drifted', WORKSPACE)?.runnable).toBe('/doctor:agents-md check');
    expect(matchDoctorProblem('show me every GitHub Actions workflow and whether each is enabled', WORKSPACE)?.runnable).toBe('/doctor:ci report');
  });

  it('returns null for a prompt the helper does not match', () => {
    expect(matchDoctorProblem('write me a poem about cats', WORKSPACE)).toBeNull();
  });

  it('returns null when the workspace has no doctor helper', () => {
    expect(matchDoctorProblem('my deep research run never converges', mkdtempSync(join(tmpdir(), 'no-doctor-')))).toBeNull();
  });
});
