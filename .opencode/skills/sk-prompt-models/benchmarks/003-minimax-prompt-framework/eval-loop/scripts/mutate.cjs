#!/usr/bin/env node
/**
 * scripts/mutate.cjs
 *
 * Variant generation: council-seeded queue + hill-climbing mutation along
 * one axis per iteration. Tracks signatures to avoid re-evaluating duplicates.
 *
 * Axes (council-ratified):
 *   - framework: STAR | RCAF | BUILD | ATLAS | CONTEXT
 *   - preplanning_density: sparse | medium | dense
 *   - thinking_threshold: 3 | 5 | 8
 *   - bundle_gate_strictness: standard | strict | smoke-run-required
 *   - anti_hallucination_strength: standard | medium | aggressive
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');
const VARIANTS_DIR = path.join(PACKET_ROOT, 'variants');
const config = require(path.join(PACKET_ROOT, 'state', 'eval-loop-config.json'));

const AXES = {
  framework: ['RCAF', 'RACE', 'CIDI', 'TIDD-EC', 'COSTAR'],
  preplanning_density: ['sparse', 'medium', 'dense'],
  thinking_threshold: ['3', '5', '8'],
  bundle_gate_strictness: ['standard', 'strict', 'smoke-run-required'],
  anti_hallucination_strength: ['standard', 'medium', 'aggressive'],
};

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function variantSignature(variantMeta) {
  const canonical = JSON.stringify({
    framework: variantMeta.framework,
    preplanning_density: variantMeta.preplanning_density,
    thinking_threshold: variantMeta.thinking_threshold,
    bundle_gate_strictness: variantMeta.bundle_gate_strictness,
    anti_hallucination_strength: variantMeta.anti_hallucination_strength,
  });
  return sha256Hex(canonical).slice(0, 16);
}

function readVariantTemplate(variantPath) {
  const raw = fs.readFileSync(variantPath, 'utf8');
  const m = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  const meta = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (kv) {
        let v = kv[2].trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        meta[kv[1]] = v;
      }
    }
  }
  return { meta, body: m ? m[2] : raw };
}

function listSeededVariants() {
  if (!fs.existsSync(VARIANTS_DIR)) return [];
  return fs.readdirSync(VARIANTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(VARIANTS_DIR, f));
}

function loadMutationCoverage() {
  const p = path.join(PACKET_ROOT, 'state', 'mutation-coverage.json');
  if (!fs.existsSync(p)) {
    return {
      proposed_signatures: [],
      exhausted_signatures: [],
      active_axis: null,
      axis_switches: 0,
      no_improvement_count: 0,
    };
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveMutationCoverage(coverage) {
  const p = path.join(PACKET_ROOT, 'state', 'mutation-coverage.json');
  fs.writeFileSync(p, JSON.stringify(coverage, null, 2));
}

function nextSeedVariant(coverage) {
  // Returns the next council-seeded variant that hasn't been scored yet.
  const seeded = listSeededVariants();
  for (const p of seeded) {
    const { meta } = readVariantTemplate(p);
    const sig = variantSignature(meta);
    if (!coverage.proposed_signatures.includes(sig)) {
      return { variantPath: p, meta, signature: sig, source: 'seeded' };
    }
  }
  return null;
}

function mutate(bestVariant, coverage) {
  // Mutate along the active axis. If no active axis OR exhausted, pick next axis.
  const axes = config.mutation.axes;
  let activeAxis = coverage.active_axis;
  if (!activeAxis) activeAxis = axes[0];

  const currentValues = bestVariant.meta || {};
  const optionsForAxis = AXES[activeAxis] || [];
  const currentVal = currentValues[activeAxis];

  // Try each option for the active axis; produce a mutated variant
  for (const opt of optionsForAxis) {
    if (opt === currentVal) continue;
    const newMeta = { ...currentValues, [activeAxis]: opt };
    const sig = variantSignature(newMeta);
    if (coverage.proposed_signatures.includes(sig) || coverage.exhausted_signatures.includes(sig)) continue;
    return { meta: newMeta, signature: sig, source: 'mutation', axis: activeAxis, from: currentVal, to: opt };
  }
  // Active axis exhausted: switch
  return null;
}

function switchAxis(coverage) {
  const axes = config.mutation.axes;
  const currentIdx = axes.indexOf(coverage.active_axis);
  const nextIdx = currentIdx + 1;
  if (nextIdx >= axes.length || coverage.axis_switches >= config.mutation.max_axis_switches) {
    return { switched: false, reason: 'no_more_axes_or_max_switches_reached' };
  }
  coverage.active_axis = axes[nextIdx];
  coverage.axis_switches += 1;
  coverage.no_improvement_count = 0;
  return { switched: true, new_axis: coverage.active_axis };
}

function proposeNextVariant(opts) {
  const { bestVariant, noImprovementCount } = opts;
  const coverage = loadMutationCoverage();

  // Step 1: still have unseen seeded variants? Use them first
  const seeded = nextSeedVariant(coverage);
  if (seeded) {
    coverage.proposed_signatures.push(seeded.signature);
    saveMutationCoverage(coverage);
    return seeded;
  }

  // Step 2: if no_improvement_count exceeds threshold, switch axis
  if (noImprovementCount >= config.mutation.no_improvement_iters_before_switch) {
    const sw = switchAxis(coverage);
    if (!sw.switched) {
      // No more axes; return null (signal exit)
      saveMutationCoverage(coverage);
      return null;
    }
  }

  // Step 3: mutate the best variant along active axis
  const mut = mutate(bestVariant, coverage);
  if (mut) {
    coverage.proposed_signatures.push(mut.signature);
    saveMutationCoverage(coverage);
    return mut;
  }

  // Step 4: active axis exhausted; mark + try switching
  const sw = switchAxis(coverage);
  if (!sw.switched) {
    saveMutationCoverage(coverage);
    return null;
  }
  // Recurse once after switch
  const mut2 = mutate(bestVariant, coverage);
  if (mut2) {
    coverage.proposed_signatures.push(mut2.signature);
    saveMutationCoverage(coverage);
    return mut2;
  }
  saveMutationCoverage(coverage);
  return null;
}

function markExhausted(signature) {
  const coverage = loadMutationCoverage();
  if (!coverage.exhausted_signatures.includes(signature)) {
    coverage.exhausted_signatures.push(signature);
  }
  saveMutationCoverage(coverage);
}

module.exports = {
  proposeNextVariant,
  variantSignature,
  readVariantTemplate,
  listSeededVariants,
  loadMutationCoverage,
  saveMutationCoverage,
  markExhausted,
  AXES,
};
