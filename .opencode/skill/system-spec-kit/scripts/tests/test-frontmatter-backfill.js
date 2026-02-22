#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST_LIB = path.join(ROOT, 'scripts', 'dist', 'lib', 'frontmatter-migration.js');
const DIST_CLI = path.join(ROOT, 'scripts', 'dist', 'memory', 'backfill-frontmatter.js');

let passed = 0;
let failed = 0;

function pass(name, evidence) {
  passed += 1;
  console.log(`  [PASS] ${name}`);
  if (evidence) {
    console.log(`         ${evidence}`);
  }
}

function fail(name, reason) {
  failed += 1;
  console.log(`  [FAIL] ${name}`);
  console.log(`         ${reason}`);
}

function ensureDist() {
  if (!fs.existsSync(DIST_LIB)) {
    throw new Error(`Missing compiled utility module: ${DIST_LIB}`);
  }
  if (!fs.existsSync(DIST_CLI)) {
    throw new Error(`Missing compiled CLI module: ${DIST_CLI}`);
  }
}

function run() {
  console.log('=== Frontmatter Backfill Tests ===');
  ensureDist();

  const migration = require(DIST_LIB);

  // --------------------------------------------------------------------------
  // T-FMB-001: No false-positive frontmatter detection after leading comments.
  // --------------------------------------------------------------------------
  try {
    const content = `<!-- TEMPLATE: context_template.md v2.2 -->\n\n---\n\n# SESSION SUMMARY\n\n| **Meta Data** | **Value** |\n|:--------------|:----------|\n| Context Type | general |\n\n---\n`;
    const detection = migration.detectFrontmatter(content);
    if (!detection.found) {
      pass('T-FMB-001: Thematic separator after comments is not frontmatter', 'detectFrontmatter().found === false');
    } else {
      fail('T-FMB-001: Thematic separator after comments is not frontmatter', 'Unexpected frontmatter detection');
    }
  } catch (error) {
    fail('T-FMB-001: Thematic separator after comments is not frontmatter', error.message);
  }

  // --------------------------------------------------------------------------
  // T-FMB-002: Unknown frontmatter keys are preserved during merge.
  // --------------------------------------------------------------------------
  try {
    const input = `---\ntitle: "Old Title"\ncustom_meta: "keep-me"\ntriggerPhrases:\n  - "legacy"\n---\n\n# Spec Header\n\nContent body.\n`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-test', 'spec.md')
    );

    if (result.content.includes('custom_meta: "keep-me"')) {
      pass('T-FMB-002: Unknown keys preserved', 'custom_meta retained in output frontmatter');
    } else {
      fail('T-FMB-002: Unknown keys preserved', 'custom_meta missing after merge');
    }
  } catch (error) {
    fail('T-FMB-002: Unknown keys preserved', error.message);
  }

  // --------------------------------------------------------------------------
  // T-FMB-003: Long titles keep disambiguating suffix and max length.
  // --------------------------------------------------------------------------
  try {
    const longTitle = '# This is an intentionally very long heading designed to exceed the normal dashboard title width for suffix retention tests\n\nBody.';
    const result = migration.buildFrontmatterContent(
      longTitle,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-frontmatter-test', 'spec.md')
    );

    const titleMatch = result.content.match(/^title:\s*"(.+)"/m);
    const title = titleMatch ? titleMatch[1] : '';
    const suffixOk = title.endsWith('[007-frontmatter-test/spec]');
    const lengthOk = title.length <= 120;

    if (suffixOk && lengthOk) {
      pass('T-FMB-003: Truncated title keeps suffix', `length=${title.length}`);
    } else {
      fail('T-FMB-003: Truncated title keeps suffix', `suffixOk=${suffixOk}, lengthOk=${lengthOk}, title="${title}"`);
    }
  } catch (error) {
    fail('T-FMB-003: Truncated title keeps suffix', error.message);
  }

  // --------------------------------------------------------------------------
  // T-FMB-004: CLI idempotency (apply then dry-run => zero changed).
  // --------------------------------------------------------------------------
  let tmpRoot = null;
  try {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-backfill-'));
    const specsRoot = path.join(tmpRoot, 'specs');
    const specDir = path.join(specsRoot, '001-cli-idempotency');
    const memoryDir = path.join(specDir, 'memory');

    fs.mkdirSync(memoryDir, { recursive: true });

    fs.writeFileSync(
      path.join(specDir, 'spec.md'),
      '# CLI Idempotency Spec\n\nSpec content for idempotency test.\n',
      'utf-8'
    );

    fs.writeFileSync(
      path.join(memoryDir, 'session.md'),
      '<!-- header -->\n\n---\n\n# SESSION SUMMARY\n\n| **Meta Data** | **Value** |\n|:--------------|:----------|\n| Importance Tier | normal |\n| Context Type | general |\n',
      'utf-8'
    );

    const reportApply = path.join(tmpRoot, 'apply-report.json');
    const reportDry = path.join(tmpRoot, 'dry-report.json');

    execSync(
      `node "${DIST_CLI}" --apply --roots "${specsRoot}" --skip-templates --include-archive --report "${reportApply}"`,
      { stdio: 'pipe' }
    );

    execSync(
      `node "${DIST_CLI}" --dry-run --roots "${specsRoot}" --skip-templates --include-archive --report "${reportDry}"`,
      { stdio: 'pipe' }
    );

    const dry = JSON.parse(fs.readFileSync(reportDry, 'utf-8'));
    if (dry.summary.changed === 0 && dry.summary.failed === 0) {
      pass('T-FMB-004: CLI idempotency', 'dry-run after apply reports 0 changed');
    } else {
      fail('T-FMB-004: CLI idempotency', `changed=${dry.summary.changed}, failed=${dry.summary.failed}`);
    }
  } catch (error) {
    fail('T-FMB-004: CLI idempotency', error.message);
  } finally {
    if (tmpRoot && fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  }

  console.log('');
  console.log(`Summary: pass=${passed}, fail=${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();
