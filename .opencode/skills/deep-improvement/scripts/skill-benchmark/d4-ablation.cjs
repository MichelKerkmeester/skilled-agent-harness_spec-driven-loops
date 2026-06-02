#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ d4-ablation — D4/D4-R usefulness ablation (skill-ON vs skill-OFF delta)  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * d4-ablation.cjs — D4 usefulness ablation (APPROXIMATE).
 *
 * "Does the skill actually help?" measured as the quality delta between a
 * skill-ON run and a skill-OFF run of the same scenario, graded by the existing
 * Lane B grader (gradeD4).
 *
 * Honest constraint (validated in the Phase 0 spike): opencode has no clean
 * single-skill suppression. Skill-OFF is APPROXIMATED with
 * MK_SKILL_ADVISOR_HOOK_DISABLED=1 + a "do not load any skill" preamble, then
 * verified by checking the skill was NOT loaded/read (else the pair is dropped
 * as contaminated). D4 scores are stamped attribution:"approximate".
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const { runDispatch, parseLiveResult, buildLiveDispatchPrompt } = require('./live-executor.cjs');
const grader = require('../model-benchmark/scorer/grader/harness.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp a number into the [0,1] range, mapping non-finite values to 0.
 *
 * @param {number} x - Value to clamp.
 * @returns {number} Clamped value in [0,1].
 */
function clamp01(x) { return Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0)); }

/**
 * Build the skill-OFF prompt: answer from the model's own knowledge, no skill,
 * no project skill-file reads. Pairs with MK_SKILL_ADVISOR_HOOK_DISABLED=1.
 *
 * @param {Object} scenario - Scenario whose prompt is being ablated.
 * @returns {string} Skill-OFF dispatch prompt.
 */
function buildSkillOffPrompt(scenario) {
  return [
    'Answer ONLY from your own knowledge. Do NOT load any skill and do NOT read project skill files.',
    `Task: ${scenario.prompt || ''}`,
    'Emit ONLY a fenced ```json code block: {"surface": "...", "resources": ["..."], "assets": ["..."], "agent": "none"}',
  ].join('\n');
}

/**
 * Grade the on/off output pair into a normalized D4 usefulness score.
 * Deterministic when graderMode is a mock mode. score in [0,1]: 0.5 = no delta,
 * 1 = skill-on fully better, 0 = skill-off better (skill hurt).
 *
 * @param {Object} args - Grading inputs.
 * @param {Object} args.scenario - Scenario being graded.
 * @param {string} args.onText - Skill-ON response text.
 * @param {string} args.offText - Skill-OFF response text.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4 score object plus raw on/off grades.
 */
async function gradeAblation({ scenario, onText, offText, graderMode = 'mock', cacheDir }) {
  const base = {
    variant_hash: 'live', rubric_version: 'v1.0.0', grader_model_build_hash: 'na',
    mode: graderMode,
    mock_mode: graderMode.startsWith('mock-') ? graderMode.slice('mock-'.length) : 'default',
    cache_dir: cacheDir,
  };
  const rubric = scenario.passCriteria || scenario.prompt || '';
  const onG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#on`, rubric }, swe16_output_text: onText || '', ...base });
  const offG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#off`, rubric }, swe16_output_text: offText || '', ...base });
  const onScore = clamp01(onG.score);
  const offScore = clamp01(offG.score);
  const score = clamp01(0.5 + (onScore - offScore) / 2);
  return { d4: { score, onScore, offScore, attribution: 'approximate', graderMode }, raw: { onG, offG } };
}

/**
 * Full live ablation: two real dispatches (on/off) + grade. Spends API.
 *
 * @param {Object} args - Ablation inputs.
 * @param {Object} args.scenario - Scenario to ablate.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.model - Model id for dispatch.
 * @param {string} args.variant - Reasoning-effort variant.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4 result object (graded or unscored).
 */
async function runD4Ablation({ scenario, skillRoot, model, variant, graderMode = 'mock', cacheDir }) {
  const dir = path.resolve(skillRoot, '..', '..', '..');
  const skillId = path.basename(skillRoot || '');

  const on = runDispatch({ prompt: buildLiveDispatchPrompt(scenario), dir, model, variant });
  const off = runDispatch({ prompt: buildSkillOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
  if (on.status !== 0 || off.status !== 0) {
    return { d4: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate' } };
  }
  const onParsed = parseLiveResult(on.stdout, { skillId });
  const offParsed = parseLiveResult(off.stdout, { skillId });

  // Contamination guard: skill-OFF must NOT have loaded/read the skill.
  const offTouched = (offParsed.activation && offParsed.activation.activated)
    || (offParsed.raw.observedReads || []).length > 0;
  if (offTouched) {
    return { d4: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate' }, contaminated: true };
  }

  const graded = await gradeAblation({
    scenario, onText: onParsed.raw.responseText, offText: offParsed.raw.responseText, graderMode, cacheDir,
  });
  return { ...graded, onActivated: !!(onParsed.activation && onParsed.activation.activated) };
}

// ─────────────────────────────────────────────────────────────────────────────
// D4-R: task-outcome usefulness (the complement of the hallucination delta).
//
// The hallucination ablation above grades a ROUTING-ANALYSIS answer with a
// grader that is explicitly forbidden from scoring correctness — so it cannot
// say whether the skill makes a ROUTINE TASK answer better. D4-R fixes that: it
// asks the model to produce the actual change (a minimal patch plan + the
// verification command), not a list of which docs it would load, and grades the
// on/off pair with a task-outcome rubric. Reported as a SEPARATE number; the two
// are never collapsed.
// ─────────────────────────────────────────────────────────────────────────────

const TASK_OUTCOME_PROMPT_PATH = path.join(
  __dirname, '..', 'model-benchmark', 'scorer', 'grader', 'prompts', 'system-grader-task-outcome.md',
);

/**
 * Build the skill-ON task-outcome prompt: do the work, do not just route.
 *
 * @param {Object} scenario - Scenario whose task is being graded.
 * @returns {string} Skill-ON task-outcome dispatch prompt.
 */
function buildTaskOutcomePrompt(scenario) {
  return [
    'Produce a MINIMAL implementation plan for the task below — not a routing list.',
    `Task: ${scenario.prompt || ''}`,
    'Using the project code skill, output exactly: (1) the precise file(s) to change and the',
    'exact edit (a short unified-diff-style sketch is fine), and (2) the verification command(s)',
    'that would confirm the change. Do NOT edit files. Do NOT just list which docs you would load.',
  ].join('\n');
}

/**
 * Build the skill-OFF task-outcome prompt: same work, from the model's own
 * knowledge, no skill.
 *
 * @param {Object} scenario - Scenario whose task is being graded.
 * @returns {string} Skill-OFF task-outcome dispatch prompt.
 */
function buildTaskOutcomeOffPrompt(scenario) {
  return [
    'Answer ONLY from your own knowledge. Do NOT load any skill and do NOT read project skill files.',
    `Task: ${scenario.prompt || ''}`,
    'Output exactly: (1) the precise file(s) to change and the exact edit, and (2) the verification',
    'command(s) that would confirm it. Do NOT edit files.',
  ].join('\n');
}

/**
 * Grade an on/off task-outcome pair with the task-outcome rubric (NOT the
 * hallucination grader). Deterministic under a mock graderMode. Mirrors
 * gradeAblation's delta math so the two instruments are comparable.
 *
 * @param {Object} args - Grading inputs.
 * @param {Object} args.scenario - Scenario being graded.
 * @param {string} args.onText - Skill-ON response text.
 * @param {string} args.offText - Skill-OFF response text.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4-R score object plus raw on/off grades.
 */
async function gradeTaskOutcome({ scenario, onText, offText, graderMode = 'mock', cacheDir }) {
  const base = {
    variant_hash: 'live-d4r', rubric_version: 'v1.0.0', grader_model_build_hash: 'na',
    mode: graderMode,
    mock_mode: graderMode.startsWith('mock-') ? graderMode.slice('mock-'.length) : 'default',
    cache_dir: cacheDir,
    system_prompt_path: TASK_OUTCOME_PROMPT_PATH,
  };
  const rubric = scenario.passCriteria || scenario.prompt || '';
  const onG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#taskoutcome#on`, rubric }, swe16_output_text: onText || '', ...base });
  const offG = await grader.gradeD4({ fixture: { id: `${scenario.scenarioId}#taskoutcome#off`, rubric }, swe16_output_text: offText || '', ...base });
  const onScore = clamp01(onG.score);
  const offScore = clamp01(offG.score);
  const score = clamp01(0.5 + (onScore - offScore) / 2);
  return { d4r: { score, onScore, offScore, attribution: 'approximate', instrument: 'task-outcome', graderMode }, raw: { onG, offG } };
}

/**
 * Full live D4-R ablation: two real dispatches (on/off) in task-outcome mode +
 * grade. Spends API. Same contamination guard as the hallucination ablation.
 *
 * @param {Object} args - Ablation inputs.
 * @param {Object} args.scenario - Scenario to ablate.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.model - Model id for dispatch.
 * @param {string} args.variant - Reasoning-effort variant.
 * @param {string} [args.graderMode='mock'] - Grader mode.
 * @param {string} [args.cacheDir] - Optional grader cache directory.
 * @returns {Promise<Object>} D4-R result object (graded or unscored).
 */
async function runD4RAblation({ scenario, skillRoot, model, variant, graderMode = 'mock', cacheDir }) {
  const dir = path.resolve(skillRoot, '..', '..', '..');
  const skillId = path.basename(skillRoot || '');

  const on = runDispatch({ prompt: buildTaskOutcomePrompt(scenario), dir, model, variant });
  const off = runDispatch({ prompt: buildTaskOutcomeOffPrompt(scenario), dir, model, variant, extraEnv: { MK_SKILL_ADVISOR_HOOK_DISABLED: '1' } });
  if (on.status !== 0 || off.status !== 0) {
    return { d4r: { score: null, unscored: 'ablation dispatch failed', attribution: 'approximate', instrument: 'task-outcome' } };
  }
  const onParsed = parseLiveResult(on.stdout, { skillId });
  const offParsed = parseLiveResult(off.stdout, { skillId });

  // Contamination guard: skill-OFF must NOT have loaded/read the skill.
  const offTouched = (offParsed.activation && offParsed.activation.activated)
    || (offParsed.raw.observedReads || []).length > 0;
  if (offTouched) {
    return { d4r: { score: null, unscored: 'skill-off contaminated (skill was loaded)', attribution: 'approximate', instrument: 'task-outcome' }, contaminated: true };
  }

  const graded = await gradeTaskOutcome({
    scenario, onText: onParsed.raw.responseText, offText: offParsed.raw.responseText, graderMode, cacheDir,
  });
  return { ...graded, onActivated: !!(onParsed.activation && onParsed.activation.activated) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  runD4Ablation, gradeAblation, buildSkillOffPrompt, clamp01,
  runD4RAblation, gradeTaskOutcome, buildTaskOutcomePrompt, buildTaskOutcomeOffPrompt,
};
