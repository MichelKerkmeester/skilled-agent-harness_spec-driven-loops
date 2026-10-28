#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const generator = require('../generate-leaf-manifest.cjs');
const GENERATOR_PATH = path.resolve(__dirname, '..', 'generate-leaf-manifest.cjs');

function writeFile(root, relativePath, content) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function writeStandaloneSkill(skillDir, workflowMode = 'standalone-scope-probe') {
  writeFile(skillDir, 'leaf-manifest.config.json', `${JSON.stringify({
    workflowMode,
    packet: '.',
    leafRoots: ['hooks'],
  }, null, 2)}\n`);
}

function testStandaloneScopesLimitLeavesToDeclaredPaths() {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-standalone-scopes-'));
  try {
    const skillDir = path.join(scratch, 'skill');
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'hooks/routed.md', '# routed\n');
    writeFile(skillDir, 'hooks/nested/also-routed.md', '# nested\n');
    writeFile(skillDir, 'hooks/runtime.ts', 'export {};\n');
    writeFile(skillDir, 'leaf-scopes.json', `${JSON.stringify({ scopes: [{
      workflowMode: 'standalone-scope-probe',
      leafScopes: ['hooks/routed.md', 'hooks/nested/also-routed.md'],
    }] }, null, 2)}\n`);

    const manifest = JSON.parse(generator.buildManifestBytes(skillDir).toString('utf8'));
    assert.deepEqual(manifest.modes[0].leaves, ['hooks/nested/also-routed.md', 'hooks/routed.md']);
    assert.ok(!manifest.modes[0].leaves.includes('hooks/runtime.ts'));
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function testStandaloneCheckAcceptsBothArgumentOrders() {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-standalone-arg-order-'));
  try {
    const skillDir = path.join(scratch, 'skill');
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'hooks/routed.md', '# routed\n');
    fs.writeFileSync(path.join(skillDir, 'leaf-manifest.json'), generator.buildManifestBytes(skillDir));

    for (const args of [['--check', skillDir], [skillDir, '--check']]) {
      const result = childProcess.spawnSync(process.execPath, [GENERATOR_PATH, ...args], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /leaf-manifest\.json OK/);
    }
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function testStandaloneScopesRejectUnknownMode() {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-standalone-orphan-scopes-'));
  try {
    const skillDir = path.join(scratch, 'skill');
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'hooks/routed.md', '# routed\n');
    writeFile(skillDir, 'leaf-scopes.json', `${JSON.stringify({ scopes: [{
      workflowMode: 'other-mode',
      leafScopes: ['hooks/routed.md'],
    }] }, null, 2)}\n`);

    assert.throws(
      () => generator.buildManifestBytes(skillDir),
      (error) => error.code === 'ORPHAN_LEAF_SCOPE_MODE',
    );
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function testStandaloneScopesStayWithinDeclaredRoots() {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-standalone-root-scopes-'));
  try {
    const skillDir = path.join(scratch, 'skill');
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'references/not-declared.md', '# outside configured roots\n');
    writeFile(skillDir, 'leaf-scopes.json', `${JSON.stringify({ scopes: [{
      workflowMode: 'standalone-scope-probe',
      leafScopes: ['references/not-declared.md'],
    }] }, null, 2)}\n`);

    assert.throws(
      () => generator.buildManifestBytes(skillDir),
      (error) => error.code === 'OUT_OF_ROOT_LEAF_SCOPE',
    );
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

testStandaloneScopesLimitLeavesToDeclaredPaths();
testStandaloneCheckAcceptsBothArgumentOrders();
testStandaloneScopesRejectUnknownMode();
testStandaloneScopesStayWithinDeclaredRoots();
console.log('[sk-doc] standalone leaf-scope coverage passed');
