#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Phase Command Workflow Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify /speckit:phase and --phase-folder command contracts.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const fs = require('fs');
const path = require('path');
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const COMMAND_ROOT = path.join(REPO_ROOT, '.opencode', 'commands', 'speckit');
const ASSETS_ROOT = path.join(COMMAND_ROOT, 'assets');

let passed = 0;
let failed = 0;

function pass(message) {
  passed += 1;
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`FAIL: ${message}`);
}

function assertTrue(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function testPhaseCommandContracts() {
  const planDoc = path.join(COMMAND_ROOT, 'plan.md');
  const completeDoc = path.join(COMMAND_ROOT, 'complete.md');
  const planAutoYaml = path.join(ASSETS_ROOT, 'speckit-plan.yaml');
  const completeAutoYaml = path.join(ASSETS_ROOT, 'speckit-complete.yaml');

  assertTrue(exists(planDoc), '/speckit:plan doc exists');
  assertTrue(exists(completeDoc), '/speckit:complete doc exists');
  assertTrue(exists(planAutoYaml), '/speckit:plan auto workflow asset exists');
  assertTrue(exists(completeAutoYaml), '/speckit:complete auto workflow asset exists');

  const phaseText = `${readFile(planDoc)}\n${readFile(completeDoc)}`;
  assertTrue(
    phaseText.includes(':with-phases') && phaseText.includes('--phase-folder=<path>'),
    '/speckit:plan and /speckit:complete document phase flags'
  );
  assertTrue(
    readFile(planAutoYaml).includes('create.sh "{feature_description}" --phase') &&
      readFile(completeAutoYaml).includes('create.sh "{feature_description}" --phase'),
    'phase workflow assets route to create.sh --phase'
  );
}

function testPhaseFolderContracts() {
  const commandDocs = [
    { name: 'plan', file: 'plan.md' },
    { name: 'implement', file: 'implement.md' },
    { name: 'complete', file: 'complete.md' },
    { name: 'resume', file: 'resume.md' },
  ];

  for (const doc of commandDocs) {
    const filePath = path.join(COMMAND_ROOT, doc.file);
    assertTrue(exists(filePath), `/speckit:${doc.name} doc exists`);

    const text = readFile(filePath);
    const hasPhaseFolderContract =
      text.includes('--phase-folder=<path>') || text.includes('--phase-folder=<path> provided');

    assertTrue(
      hasPhaseFolderContract,
      `/speckit:${doc.name} documents --phase-folder contract`
    );

    // Presentation docs own argument surfaces; phase-child behavior prose
    // lives in the workflow YAML assets, so check the command's full surface.
    const assetTexts = [`speckit-${doc.name}.yaml`, `speckit-${doc.name}-auto.yaml`, `speckit-${doc.name}-confirm.yaml`]
      .map((assetName) => path.join(ASSETS_ROOT, assetName))
      .filter((assetPath) => exists(assetPath))
      .map((assetPath) => readFile(assetPath));
    const combinedText = [text, ...assetTexts].join('\n');

    assertTrue(
      combinedText.includes('Option E') || combinedText.includes('phase child') || combinedText.includes('Phase folder'),
      `/speckit:${doc.name} includes Option E/phase-child behavior`
    );
  }
}

function testAssetPhaseFolderNotes() {
  const yamlAssets = [
    'speckit-plan.yaml',
    'speckit-implement.yaml',
    'speckit-complete.yaml',
    'speckit-resume-auto.yaml',
    'speckit-resume-confirm.yaml',
  ];

  for (const yaml of yamlAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    assertTrue(exists(filePath), `${yaml} exists`);
    const text = readFile(filePath);

    const hasPhaseFolderContract =
      text.includes('--phase-folder') ||
      text.includes('phase-folder') ||
      text.includes('phase child') ||
      text.includes('Option E');

    assertTrue(
      hasPhaseFolderContract,
      `${yaml} includes phase-folder/phase-child contract`
    );
  }
}

function testTemplateCompliancePromptContracts() {
  const planImplementCompleteAssets = [
    'speckit-plan.yaml',
    'speckit-implement.yaml',
    'speckit-complete.yaml',
  ];

  for (const yaml of planImplementCompleteAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    assertTrue(exists(filePath), `${yaml} exists for template compliance checks`);

    const text = readFile(filePath);
    assertTrue(
      text.includes('template_compliance:') && text.includes('inline_scaffolds:'),
      `${yaml} embeds inline template scaffold guidance`
    );
    assertTrue(
      text.includes('validate.sh [SPEC_FOLDER] --strict'),
      `${yaml} requires strict validation after spec-doc writes`
    );
    assertTrue(
      text.includes('template_prompt_contract:') || text.includes('summary_document:'),
      `${yaml} ties authoring steps back to the inline scaffold contract`
    );
  }

  const agentDocs = [
    path.join(REPO_ROOT, '.agents', 'agents', 'speckit.md'),
    path.join(REPO_ROOT, '.opencode', 'agent', 'speckit.md'),
    path.join(REPO_ROOT, '.claude', 'agents', 'speckit.md'),
  ];

  for (const agentDoc of agentDocs) {
    if (!exists(agentDoc)) {
      continue;
    }
    const text = readFile(agentDoc);
    assertTrue(
      text.includes('Inline Scaffold Contract'),
      `${path.relative(REPO_ROOT, agentDoc)} documents inline scaffold usage`
    );
    assertTrue(
      text.includes('validate.sh [SPEC_FOLDER] --strict'),
      `${path.relative(REPO_ROOT, agentDoc)} requires strict post-write validation`
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   Semantic assertions — beyond string-presence
   test-phase-command-workflows.js is a string-presence
   check only; it never asserts implementation scope semantics or
   PREFLIGHT/POSTFLIGHT score contracts.
────────────────────────────────────────────────────────────── */

function testPhaseYamlStructuralContracts() {
  const yamlAssets = [
    'speckit-plan.yaml',
    'speckit-implement.yaml',
    'speckit-complete.yaml',
  ];

  for (const yaml of yamlAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    if (!exists(filePath)) continue;
    const text = readFile(filePath);

    // YAML assets must define numbered steps (step_N or step N)
    const hasNumberedSteps = /step[_\s]?\d+/i.test(text) || /^\s*\d+\.\s/m.test(text);
    assertTrue(
      hasNumberedSteps,
      `T242-SS1: ${yaml} defines numbered workflow steps`
    );

    // Validate.sh invocation must include --strict flag
    if (text.includes('validate.sh')) {
      assertTrue(
        text.includes('--strict'),
        `T242-SS2: ${yaml} validate.sh call uses --strict flag`
      );
    }

    // Template compliance must define both inline_scaffolds AND
    // a validation step — not just mention the words
    if (text.includes('template_compliance:')) {
      assertTrue(
        text.includes('inline_scaffolds:') && text.includes('validate'),
        `T242-SS3: ${yaml} template_compliance includes scaffolds + validation`
      );
    }
  }
}

function testImplementScopeContracts() {
  const implementAssets = ['speckit-implement.yaml'];

  for (const yaml of implementAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    if (!exists(filePath)) continue;
    const text = readFile(filePath);

    // Implement assets must reference plan.md as input
    assertTrue(
      text.includes('plan.md') || text.includes('plan_path'),
      `T242-IS1: ${yaml} references plan.md as prerequisite`
    );

    // Implement assets must reference tasks.md for tracking
    assertTrue(
      text.includes('tasks.md') || text.includes('task_tracker'),
      `T242-IS2: ${yaml} references tasks.md for progress tracking`
    );

    // Implement assets must reference checklist or verification
    assertTrue(
      text.includes('checklist') || text.includes('verification') || text.includes('validate'),
      `T242-IS3: ${yaml} references verification/checklist step`
    );
  }
}

function testCompleteYamlContracts() {
  const completeAssets = ['speckit-complete.yaml'];

  for (const yaml of completeAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    if (!exists(filePath)) continue;
    const text = readFile(filePath);

    // Complete assets must reference implementation-summary.md
    assertTrue(
      text.includes('implementation-summary') || text.includes('implementation_summary'),
      `T242-CS1: ${yaml} references implementation-summary.md`
    );

    // Complete assets should mention completion verification
    assertTrue(
      text.includes('complete') || text.includes('finish') || text.includes('done'),
      `T242-CS2: ${yaml} references completion state`
    );
  }
}

function testExecutionModeContracts() {
  // Each lifecycle command ships one asset that carries every execution mode;
  // the checkpoint list must name real steps and each named step must carry
  // a confirm-only block or flag, so a mode cannot silently lose a gate.
  const mergedAssets = ['speckit-plan.yaml', 'speckit-implement.yaml', 'speckit-complete.yaml'];

  for (const yaml of mergedAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    assertTrue(exists(filePath), `${yaml} exists as the single lifecycle asset`);
    const text = readFile(filePath);

    assertTrue(
      /^execution_mode:\n\s+source: "\$ARGUMENTS"\n\s+values: \[auto, confirm, autopilot\]\n\s+default: confirm/m.test(text),
      `T-EM1: ${yaml} declares execution_mode with auto, confirm and autopilot`
    );

    const checkpointsMatch = text.match(/^checkpoints: \[([^\]]*)\]/m);
    assertTrue(checkpointsMatch !== null, `T-EM2: ${yaml} lists its checkpoint steps`);
    const checkpoints = checkpointsMatch ? checkpointsMatch[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
    assertTrue(checkpoints.length > 0, `T-EM2: ${yaml} has at least one checkpoint step`);

    const stepNames = new Set([...text.matchAll(/^  (step_\d+[a-z0-9_]*):/gm)].map((m) => m[1]));
    for (const step of checkpoints) {
      assertTrue(stepNames.has(step), `T-EM3: ${yaml} checkpoint ${step} names a real step`);
      const stepStart = text.indexOf(`\n  ${step}:`);
      const afterHeader = text.indexOf('\n', stepStart + 1);
      const rest = text.slice(afterHeader);
      const nextStep = rest.search(/\n  [a-z_0-9]+:/);
      const body = nextStep === -1 ? rest : rest.slice(0, nextStep);
      assertTrue(
        body.includes('applies_to: confirm') || body.includes('checkpoint_confirm:'),
        `T-EM4: ${yaml} checkpoint ${step} carries a confirm-only block or flag`
      );
    }

    assertTrue(
      text.includes('mode_overrides:') && text.includes('\n  confirm:\n'),
      `T-EM5: ${yaml} carries confirm wording overrides`
    );
    assertTrue(
      text.includes('shared_tail: "assets/speckit-save-context-tail.yaml#save_context_core"'),
      `T-EM6: ${yaml} routes save_context through the shared tail`
    );
  }

  const tailPath = path.join(ASSETS_ROOT, 'speckit-save-context-tail.yaml');
  assertTrue(exists(tailPath), 'shared save-context tail exists');
  const tail = readFile(tailPath);
  assertTrue(
    tail.includes('save_context_core:') && tail.includes('tool_invocation:') && tail.includes('post_save_write:') && tail.includes('anchor_requirements:'),
    'T-EM7: shared save-context tail carries the writer, post-save rule and anchor requirements'
  );
}

function main() {
  testPhaseCommandContracts();
  testPhaseFolderContracts();
  testAssetPhaseFolderNotes();
  testTemplateCompliancePromptContracts();
  testPhaseYamlStructuralContracts();
  testImplementScopeContracts();
  testCompleteYamlContracts();
  testExecutionModeContracts();

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
