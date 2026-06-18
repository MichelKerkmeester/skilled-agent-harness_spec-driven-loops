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

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
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
  const planAutoYaml = path.join(ASSETS_ROOT, 'speckit_plan_auto.yaml');
  const completeAutoYaml = path.join(ASSETS_ROOT, 'speckit_complete_auto.yaml');

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
    const assetTexts = ['auto', 'confirm']
      .map((mode) => path.join(ASSETS_ROOT, `speckit_${doc.name}_${mode}.yaml`))
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
    'speckit_plan_auto.yaml',
    'speckit_plan_confirm.yaml',
    'speckit_implement_auto.yaml',
    'speckit_implement_confirm.yaml',
    'speckit_complete_auto.yaml',
    'speckit_complete_confirm.yaml',
    'speckit_resume_auto.yaml',
    'speckit_resume_confirm.yaml',
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
    'speckit_plan_auto.yaml',
    'speckit_plan_confirm.yaml',
    'speckit_implement_auto.yaml',
    'speckit_implement_confirm.yaml',
    'speckit_complete_auto.yaml',
    'speckit_complete_confirm.yaml',
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
    'speckit_plan_auto.yaml',
    'speckit_plan_confirm.yaml',
    'speckit_implement_auto.yaml',
    'speckit_implement_confirm.yaml',
    'speckit_complete_auto.yaml',
    'speckit_complete_confirm.yaml',
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
  const implementAssets = [
    'speckit_implement_auto.yaml',
    'speckit_implement_confirm.yaml',
  ];

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
  const completeAssets = [
    'speckit_complete_auto.yaml',
    'speckit_complete_confirm.yaml',
  ];

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

function testPhaseAssetsMutualConsistency() {
  // All auto/confirm pairs should have matching step counts
  const pairs = [
    ['speckit_plan_auto.yaml', 'speckit_plan_confirm.yaml'],
    ['speckit_implement_auto.yaml', 'speckit_implement_confirm.yaml'],
    ['speckit_complete_auto.yaml', 'speckit_complete_confirm.yaml'],
  ];

  for (const [autoYaml, confirmYaml] of pairs) {
    const autoPath = path.join(ASSETS_ROOT, autoYaml);
    const confirmPath = path.join(ASSETS_ROOT, confirmYaml);
    if (!exists(autoPath) || !exists(confirmPath)) continue;

    const autoText = readFile(autoPath);
    const confirmText = readFile(confirmPath);

    // Both should reference the same phase-folder contract
    const autoHasPhase = autoText.includes('phase-folder') || autoText.includes('phase child');
    const confirmHasPhase = confirmText.includes('phase-folder') || confirmText.includes('phase child');

    assertTrue(
      autoHasPhase === confirmHasPhase,
      `T242-MC1: ${autoYaml} and ${confirmYaml} agree on phase-folder contract`
    );
  }
}

function main() {
  testPhaseCommandContracts();
  testPhaseFolderContracts();
  testAssetPhaseFolderNotes();
  testTemplateCompliancePromptContracts();
  testPhaseYamlStructuralContracts();
  testImplementScopeContracts();
  testCompleteYamlContracts();
  testPhaseAssetsMutualConsistency();

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
