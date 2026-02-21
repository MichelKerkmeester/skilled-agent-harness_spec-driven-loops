#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Phase Command Workflow Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify /spec_kit:phase and --phase-folder command contracts.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const COMMAND_ROOT = path.join(REPO_ROOT, '.opencode', 'command', 'spec_kit');
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
  const phaseDoc = path.join(COMMAND_ROOT, 'phase.md');
  const phaseAutoYaml = path.join(ASSETS_ROOT, 'spec_kit_phase_auto.yaml');
  const phaseConfirmYaml = path.join(ASSETS_ROOT, 'spec_kit_phase_confirm.yaml');

  assertTrue(exists(phaseDoc), '/spec_kit:phase doc exists');
  assertTrue(exists(phaseAutoYaml), '/spec_kit:phase auto workflow asset exists');
  assertTrue(exists(phaseConfirmYaml), '/spec_kit:phase confirm workflow asset exists');

  const phaseText = readFile(phaseDoc);
  assertTrue(
    phaseText.includes('spec_kit_phase_auto.yaml') && phaseText.includes('spec_kit_phase_confirm.yaml'),
    '/spec_kit:phase doc routes to auto + confirm YAML assets'
  );
  assertTrue(
    phaseText.includes('argument-hint: "[feature-description] [--phases N] [--phase-names list] [--parent specs/NNN-name/] [:auto|:confirm]"'),
    '/spec_kit:phase argument-hint includes auto/confirm and phase flags'
  );
}

function testPhaseFolderContracts() {
  const commandDocs = [
    { name: 'plan', file: 'plan.md' },
    { name: 'research', file: 'research.md' },
    { name: 'implement', file: 'implement.md' },
    { name: 'complete', file: 'complete.md' },
    { name: 'resume', file: 'resume.md' },
  ];

  for (const doc of commandDocs) {
    const filePath = path.join(COMMAND_ROOT, doc.file);
    assertTrue(exists(filePath), `/spec_kit:${doc.name} doc exists`);

    const text = readFile(filePath);
    assertTrue(
      text.includes('--phase-folder=<path>') || text.includes('--phase-folder=<path> provided'),
      `/spec_kit:${doc.name} documents --phase-folder contract`
    );

    assertTrue(
      text.includes('Option E') || text.includes('phase child') || text.includes('Phase folder'),
      `/spec_kit:${doc.name} includes Option E/phase-child behavior`
    );
  }
}

function testAssetPhaseFolderNotes() {
  const yamlAssets = [
    'spec_kit_plan_auto.yaml',
    'spec_kit_plan_confirm.yaml',
    'spec_kit_research_auto.yaml',
    'spec_kit_research_confirm.yaml',
    'spec_kit_implement_auto.yaml',
    'spec_kit_implement_confirm.yaml',
    'spec_kit_complete_auto.yaml',
    'spec_kit_complete_confirm.yaml',
    'spec_kit_resume_auto.yaml',
    'spec_kit_resume_confirm.yaml',
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

function main() {
  testPhaseCommandContracts();
  testPhaseFolderContracts();
  testAssetPhaseFolderNotes();

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
