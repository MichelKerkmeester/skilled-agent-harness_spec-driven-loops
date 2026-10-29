#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-root-reader-inventory.test: every skills-root reader states a rule  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';
//
// A private `local-*` skill is linked into one checkout only. Each script that
// lists the top level of the skills root carries its own name check for that
// entry, so a new reader can silently omit it. This test scans the tracked
// sources for a directory listing whose argument is a skills-root variable and
// fails when the file is neither in the inventory below nor carries a rule.
//
// Detection is name based: it sees `readdirSync(skillsRoot ...)`,
// `os.listdir(skills_dir)`, `SKILLS_DIR.iterdir()` and the like. A reader that
// names its root something else is caught only once it is added here, which is
// why every inventoried file is also checked for its rule directly.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');

// A file carries a rule when it names the prefix or calls a shared helper that owns it.
const RULE_MARKER = /local-|createPrivateSkillLinkCheck|create_private_skill_link_check|is_scannable_skill_entry|listSkillRoots\(/;

// include: the local advisor reads a trusted local-* link. exclude: skipped by name before any probe.
const RULED = {
  '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts': 'include',
  '.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts': 'include',
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py': 'include',
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py': 'include',
  '.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts': 'include',
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts': 'include',
  '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts': 'include',
  '.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs': 'include',
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py': 'exclude',
  '.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs': 'exclude',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs': 'exclude',
  '.skilled/commands/doctor/scripts/skill-graph-freshness.cjs': 'exclude',
  '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs': 'exclude',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs': 'exclude',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs': 'exclude',
  '.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts': 'exclude',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs': 'exclude',
  '.skilled/commands/doctor/scripts/audit_descriptions.py': 'exclude',
  '.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs': 'exclude',
};

// Readers reviewed and left without a name rule, each with the reason that makes it safe.
const SCREENED = {
  '.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs':
    'reads through Dirent.isDirectory(), which is false for a link, and writes no tracked file',
  '.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs':
    'reads through Dirent.isDirectory(), which is false for a link, and writes no tracked file',
  '.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs':
    'reads through Dirent.isDirectory(), which is false for a link, and writes only inside the skill it visits',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs':
    'reads through Dirent.isDirectory() and only hubs that hold mode-registry.json and ROUTER.md',
  '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs':
    'reads through Dirent.isDirectory(), skips the private prefix by name and keeps only hubs that hold mode-registry.json, hub-router.json and ROUTER.md',
  // The plugin's sk-code surface reader applies the trusted-root rule itself; this reason
  // covers only its cache-signature reader.
  '.opencode/plugins/system-skill-advisor.js':
    'its cache-signature reader lists skills through Dirent.isDirectory(), which is false for a link, into a local signature that is never tracked',
};

const SOURCE_EXT = /\.(?:c|m)?[jt]s$|\.py$/;
const NOT_SOURCE = /(?:^|\/)(?:tests?|__tests__|fixtures|node_modules|dist)\/|\.(?:test|vitest|spec)\.|(?:^|\/)test_|\.d\.ts$/;
const ROOT_ID = '(?:skills?_?root|skills_?dir|SKILLS(?:_DIR|_ROOT)?)';
const LISTING = [
  new RegExp(`(?:readdirSync|readdir|opendirSync|listdir|scandir)\\(\\s*${ROOT_ID}\\b`, 'i'),
  new RegExp(`\\b${ROOT_ID}\\.iterdir\\(\\)`, 'i'),
];

function trackedSources() {
  const out = execFileSync('git', ['-c', 'core.fsmonitor=false', 'ls-files', '-z', '--', '.skilled', '.opencode'], {
    cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  });
  return out.split('\0').filter((rel) => {
    if (!rel || !SOURCE_EXT.test(rel) || NOT_SOURCE.test(rel)) return false;
    try { return fs.lstatSync(path.join(REPO_ROOT, rel)).isFile(); } catch { return false; }
  });
}

function detectedReaders() {
  const readers = new Map();
  for (const rel of trackedSources()) {
    const lines = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (LISTING.some((re) => re.test(line))) {
        if (!readers.has(rel)) readers.set(rel, []);
        readers.get(rel).push(index + 1);
      }
    });
  }
  return readers;
}

// Every inventoried reader still exists and still carries its rule.
function testInventoriedReadersCarryRule() {
  for (const [rel, rule] of Object.entries(RULED)) {
    const abs = path.join(REPO_ROOT, rel);
    assert.ok(fs.existsSync(abs), `${rel} is inventoried but missing; drop it from the inventory`);
    assert.match(fs.readFileSync(abs, 'utf8'), RULE_MARKER, `${rel} is inventoried as ${rule} but carries no local-* rule`);
  }
}

// A detected reader must be inventoried, screened or carry a rule of its own.
function testNoUnruledReader() {
  const unruled = [];
  for (const [rel, lines] of detectedReaders()) {
    if (RULED[rel] || SCREENED[rel]) continue;
    if (RULE_MARKER.test(fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8'))) continue;
    unruled.push(`${rel}:${lines.join(',')}`);
  }
  assert.deepEqual(unruled, [], `skills-root readers with no local-* rule; add one, or add the file to the inventory:\n  ${unruled.join('\n  ')}`);
}

// The detector itself still sees the readers it was written against.
function testDetectorStillSeesKnownReaders() {
  const found = detectedReaders();
  for (const rel of [
    '.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts',
    '.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py',
    '.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs',
  ]) {
    assert.ok(found.has(rel), `the detector no longer sees ${rel}; the listing pattern has drifted`);
  }
}

testInventoriedReadersCarryRule();
testNoUnruledReader();
testDetectorStillSeesKnownReaders();

console.log('[sk-doc] skill-root reader inventory coverage passed');
