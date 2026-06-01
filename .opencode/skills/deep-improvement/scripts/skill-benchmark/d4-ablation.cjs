#!/usr/bin/env node
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

const path = require('path');
const { runDispatch, parseLiveResult, buildLiveDispatchPrompt } = require('./live-executor.cjs');
const grader = require('../model-benchmark/scorer/grader/harness.cjs');

function clamp01(x) { return Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0)); }

// skill-OFF prompt: answer from the model's own knowledge, no skill, no project
// skill-file reads. Pairs with MK_SKILL_ADVISOR_HOOK_DISABLED=1.
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

module.exports = { runD4Ablation, gradeAblation, buildSkillOffPrompt, clamp01 };
