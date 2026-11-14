// ───────────────────────────────────────────────────────────────────
// MODULE: Sub-Track Fixture Tree
// ───────────────────────────────────────────────────────────────────
// Builds one specs/ tree that holds every shape a named sub-track can
// meet, so the track-level tools are all tested against the same layout:
//
//   <specs>/demo/                      track root
//   <specs>/demo/001-flat-probe/       flat packet directly in the track
//   <specs>/demo/sub/                  declared sub-track (level "sub-track")
//   <specs>/demo/sub/001-nested-probe/ phase parent inside the sub-track
//     001-phase-one/                 its one phase child
//   <specs>/demo/sub/z_archive/        the sub-track's own archive
//   <specs>/demo/loose/                undeclared non-numbered folder
//   <specs>/demo/linked -> ../../linked-target   symlinked sub-track
//
// The symlink target sits outside specs/, so a tool that follows it would
// count packets no track owns.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* ───────────────────────────────────────────────────────────────
   1. WRITERS
──────────────────────────────────────────────────────────────── */

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function containerMetadata(id, children) {
  return {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.includes('/') ? id.split('/').slice(0, -1).join('/') : null,
    children_ids: children,
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [id], causal_summary: `Container folder for ${id}.` },
  };
}

function container(specsDir, id, level, children) {
  const dir = path.join(specsDir, id);
  writeJson(path.join(dir, 'description.json'), { level, specFolder: id, description: `Fixture ${level} ${id}.` });
  writeJson(path.join(dir, 'graph-metadata.json'), containerMetadata(id, children));
  return dir;
}

function packet(dir, title) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), `# ${title}\n`);
  return dir;
}

/* ───────────────────────────────────────────────────────────────
   2. BUILDER
──────────────────────────────────────────────────────────────── */

/**
 * Build the sub-track tree under `root`.
 * @param {string} root an empty directory; specs/ and linked-target/ are created in it
 * @param {{ declared?: boolean, flat?: boolean }} [options] declared=false leaves every
 *   children_ids list empty, which is the state a tool must repair. flat=false leaves out the
 *   flat packet, so the track holds sub-tracks only and is not mixed
 * @returns {{ specs: string, entries: Record<string, string> }}
 */
export function buildSubtrackTree(root, options = {}) {
  const declared = options.declared !== false;
  const withFlat = options.flat !== false;
  const specs = path.join(root, 'specs');
  const list = (ids) => (declared ? ids : []);

  container(specs, 'demo', 'track', list(withFlat ? ['demo/001-flat-probe', 'demo/sub'] : ['demo/sub']));
  const flat = withFlat ? packet(path.join(specs, 'demo', '001-flat-probe'), 'Flat probe') : null;

  const sub = container(specs, 'demo/sub', 'sub-track', list(['demo/sub/001-nested-probe']));
  const nested = packet(path.join(sub, '001-nested-probe'), 'Nested probe');
  const phase = packet(path.join(nested, '001-phase-one'), 'Phase one');
  const archive = path.join(sub, 'z_archive');
  packet(path.join(archive, '001-old-probe'), 'Archived probe');

  const loose = path.join(specs, 'demo', 'loose');
  fs.mkdirSync(loose, { recursive: true });
  fs.writeFileSync(path.join(loose, 'notes.md'), '# Loose notes\n');

  const target = path.join(root, 'linked-target');
  writeJson(path.join(target, 'description.json'), { level: 'sub-track', specFolder: 'demo/linked', description: 'Fixture symlinked sub-track.' });
  writeJson(path.join(target, 'graph-metadata.json'), containerMetadata('demo/linked', []));
  packet(path.join(target, '001-outside-probe'), 'Outside probe');
  const linked = path.join(specs, 'demo', 'linked');
  fs.symlinkSync(path.relative(path.dirname(linked), target), linked);

  return {
    specs,
    entries: { flat, sub, nested, phase, archive, loose, linked },
  };
}

/** Build a tree with flat tracks only, the layout every existing repository has. */
export function buildFlatTree(root) {
  const specs = path.join(root, 'specs');
  container(specs, 'alpha', 'track', ['alpha/001-one', 'alpha/002-two']);
  packet(path.join(specs, 'alpha', '001-one'), 'One');
  packet(path.join(specs, 'alpha', '002-two'), 'Two');
  container(specs, 'beta', 'track', ['beta/001-three']);
  packet(path.join(specs, 'beta', '001-three'), 'Three');
  return { specs };
}

/* ───────────────────────────────────────────────────────────────
   3. TRUE-PIPELINE REPOSITORY
──────────────────────────────────────────────────────────────── */

// The module lives inside the skill it is testing, so every path a writer
// resolves from its own location can be copied from here into the temp tree.
const FIXTURE_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_DIR = path.resolve(FIXTURE_DIR, '../..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');
const SKILLS_ROOT = path.resolve(SKILL_ROOT, '..');
const REPO_ROOT = path.resolve(SKILL_ROOT, '../../..');

const PACKET_SPEC_DOC = `---
title: "Feature Specification: Pipeline Fixture"
description: "A fixture packet whose one behavior is to exist so the relocation pipeline can move it."
trigger_phrases:
  - "pipeline fixture packet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Pipeline Fixture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fixture packet has no real problem.

### Purpose
It exists so the relocation pipeline has a packet to move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
~~~text
$ true
~~~
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Being moved by the relocation pipeline.

### Out of Scope
- Any work beyond existing on disk.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| 1 | The packet exists | It is on disk |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The packet validates after it moves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | None | None | None |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
`;

const PACKET_PLAN_DOC = `---
title: "Implementation Plan: Pipeline Fixture"
description: "The fixture packet is carried from one folder to another and read back from the new place."
trigger_phrases:
  - "pipeline fixture plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Pipeline Fixture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |

### Overview
The packet is carried to a sub-track and read back.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The packet exists

### Definition of Done
- [ ] The packet moved and validates
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A folder move.

### Key Components
- **Packet**: the folder the pipeline moves.

### Data Flow
The packet moves into a sub-track.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Move the packet and read the stores back.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Read the moved packet and run its validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the move fails.
- **Procedure**: move the packet back.
<!-- /ANCHOR:rollback -->
`;

const PACKET_TASKS_DOC = `---
title: "Tasks: Pipeline Fixture"
description: "Fixture task list for the pipeline packet."
trigger_phrases:
  - "pipeline fixture tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Pipeline Fixture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] Confirm the fixture packet exists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] Move the fixture packet into its sub-track.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] Read the moved packet spec document.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] The packet moved and validates.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
<!-- /ANCHOR:cross-refs -->
`;

/**
 * Copy a source tree, leaving every nested package directory to be linked and
 * dropping build caches: a cache names absolute paths, so the copied checkout
 * would never find its own record.
 */
function copyToolTree(from, to) {
  fs.cpSync(from, to, {
    recursive: true,
    filter: (source) => {
      const name = path.basename(source);
      return name !== 'node_modules' && !name.startsWith('.dist-freshness-');
    },
  });
}

function freshnessTool(root) {
  return path.join(root, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'lib', 'dist-freshness.cjs');
}

const FRESHNESS_ARGS = ['--package', 'system-spec-kit/runtime', '--entry', 'validation-orchestrator'];

/**
 * Refuse to build a fixture from a checkout whose compiled runtime is stale.
 * The read-only switch keeps this probe from writing a cache in the caller's
 * checkout; the canonical build command is named instead.
 */
function assertCompiledRuntimeFresh(root) {
  const result = spawnSync('node', [freshnessTool(root), 'check', ...FRESHNESS_ARGS, '--no-write'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(
      `the compiled runtime is stale; run: npm --prefix .skilled/skills/system-spec-kit run build\n${result.stdout}${result.stderr}`,
    );
  }
}

/**
 * Re-record the copied build attestation for the temp tree. The copied sources
 * and dist are byte-identical to the checkout the freshness probe just passed,
 * and the record's cache path is derived from absolute paths, so it has to be
 * written again for the copy.
 */
function attestCopiedRuntime(root) {
  const tool = freshnessTool(root);
  for (const command of ['prepare-build', 'record-build']) {
    const result = spawnSync('node', [tool, command, ...FRESHNESS_ARGS], { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`cannot re-record the compiled runtime build for the fixture: ${result.stdout}${result.stderr}`);
    }
  }
}

/**
 * Link the installed packages into the temp skill. The packages are read-only
 * for this pipeline; the spec-kit links point at the temp copies so module
 * resolution and any cache a writer keeps do not reach the real checkout.
 */
function linkInstalledPackages(tempSkill, tempRuntime, tempShared) {
  const source = path.join(SKILL_ROOT, 'node_modules');
  const target = path.join(tempSkill, 'node_modules');
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === '@spec-kit') continue;
    fs.symlinkSync(
      path.join(source, entry.name),
      path.join(target, entry.name),
      entry.isDirectory() ? 'dir' : 'file',
    );
  }
  const scoped = path.join(target, '@spec-kit');
  fs.mkdirSync(scoped);
  fs.symlinkSync(tempRuntime, path.join(scoped, 'runtime'), 'dir');
  fs.symlinkSync(tempShared, path.join(scoped, 'shared'), 'dir');
  fs.symlinkSync(path.join(tempRuntime, 'cli'), path.join(scoped, 'cli'), 'dir');
}

/** The one packet the relocation map moves, with the docs strict validation needs. */
function writePipelinePacket(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), PACKET_SPEC_DOC);
  fs.writeFileSync(path.join(dir, 'plan.md'), PACKET_PLAN_DOC);
  fs.writeFileSync(path.join(dir, 'tasks.md'), PACKET_TASKS_DOC);
  writeJson(path.join(dir, 'description.json'), {
    level: '1',
    specFolder: 'demo/001-alpha',
    description: 'Pipeline fixture packet.',
    specId: '001',
    folderSlug: 'alpha',
    parentChain: ['demo'],
  });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: 'demo/001-alpha',
    spec_folder: 'demo/001-alpha',
    parent_id: 'demo',
    children_ids: [],
  });
}

function commitAll(root) {
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '-A', '-f'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  execFileSync(
    'git',
    ['-c', 'commit.gpgsign=false', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.com', 'commit', '--quiet', '--no-verify', '-m', 'fixture'],
    { cwd: root, maxBuffer: 64 * 1024 * 1024 },
  );
}

/**
 * Build a committed repository in which the relocation pipeline can run with
 * every true writer. The script copy is selected by the caller so the mutation
 * check can substitute a scratch version; by default it is the committed one.
 *
 * @param {{ root?: string, relocateSource?: string }} [options]
 * @returns {{ root: string, specs: string, map: string, packet: string, moved: string, tools: Record<string, string> }}
 */
export function buildRealPipelineRepo(options = {}) {
  assertCompiledRuntimeFresh(REPO_ROOT);
  const root = fs.realpathSync(options.root ?? fs.mkdtempSync(path.join(os.tmpdir(), 'relocate-real-pipeline-')));
  const tempSkill = path.join(root, '.skilled', 'skills', 'system-spec-kit');
  const tempRuntime = path.join(tempSkill, 'runtime');
  const tempShared = path.join(tempSkill, 'shared');

  copyToolTree(path.join(SKILL_ROOT, 'runtime'), tempRuntime);
  copyToolTree(path.join(SKILL_ROOT, 'shared'), tempShared);
  copyToolTree(path.join(SKILL_ROOT, 'templates'), path.join(tempSkill, 'templates'));
  fs.copyFileSync(path.join(SKILL_ROOT, 'SKILL.md'), path.join(tempSkill, 'SKILL.md'));
  copyToolTree(path.join(SKILLS_ROOT, 'sk-doc', 'shared'), path.join(root, '.skilled', 'skills', 'sk-doc', 'shared'));
  copyToolTree(path.join(SKILLS_ROOT, 'cli-classifier', 'shared'), path.join(root, '.skilled', 'skills', 'cli-classifier', 'shared'));
  copyToolTree(path.join(REPO_ROOT, '.skilled', 'hooks', 'shared'), path.join(root, '.skilled', 'hooks', 'shared'));
  linkInstalledPackages(tempSkill, tempRuntime, tempShared);
  attestCopiedRuntime(root);

  if (options.relocateSource) {
    fs.copyFileSync(options.relocateSource, path.join(tempRuntime, 'cli', 'spec', 'relocate.mjs'));
  }

  const specs = path.join(root, 'specs');
  const trackDir = path.join(specs, 'demo');
  writeJson(path.join(trackDir, 'description.json'), {
    level: 'track',
    specFolder: 'demo',
    description: 'Fixture track.',
  });
  writeJson(path.join(trackDir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: 'demo',
    spec_folder: 'demo',
    parent_id: null,
    children_ids: ['demo/001-alpha'],
  });
  writePipelinePacket(path.join(trackDir, '001-alpha'));

  const map = path.join(root, 'relocate-map.json');
  fs.writeFileSync(map, `${JSON.stringify([{ from: 'demo/001-alpha', to: 'demo/sub/001-alpha' }], null, 2)}\n`);

  commitAll(root);
  return {
    root,
    specs,
    map,
    packet: 'demo/001-alpha',
    moved: 'demo/sub/001-alpha',
    tools: {
      relocate: path.join(tempRuntime, 'cli', 'spec', 'relocate.mjs'),
      archive: path.join(tempRuntime, 'cli', 'spec', 'archive.sh'),
      migrate: path.join(tempRuntime, 'cli', 'graph', 'migrate-generated-json.ts'),
      citeDrift: path.join(root, '.skilled', 'skills', 'sk-doc', 'shared', 'scripts', 'cite-drift-scan.mjs'),
      tsxLoader: path.join(tempSkill, 'node_modules', 'tsx', 'dist', 'loader.mjs'),
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   4. RESUME AND RESTORE STAGING
──────────────────────────────────────────────────────────────── */

/**
 * Replace a copied writer with a wrapper that fails its first invocation and
 * runs the true writer afterwards. The marker keeps that failure to one run
 * across processes, so the next run has to finish the interrupted steps.
 *
 * @param {string} script path to the writer inside the temp repository
 * @param {{ loader?: string, reexport?: boolean }} [options] `loader` runs a
 *   TypeScript writer; `reexport` keeps the writer's exports available to the
 *   validator, which imports the same module for its citation helpers
 * @returns {string} the marker path that records the failed first call
 */
export function failWriterFirstCall(script, options = {}) {
  const extension = path.extname(script);
  const trueScript = `${script}.true${extension}`;
  const trueName = path.basename(trueScript);
  fs.renameSync(script, trueScript);
  const runArgs = options.loader
    ? `['--import', ${JSON.stringify(options.loader)}, \`\${script}.true\${path.extname(script)}\`, ...process.argv.slice(2)]`
    : `[\`\${script}.true\${path.extname(script)}\`, ...process.argv.slice(2)]`;
  fs.writeFileSync(script, `import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
${options.reexport ? `export * from './${trueName}';\n` : ''}
const script = fileURLToPath(import.meta.url);
const samePath = (left, right) => {
  try {
    return fs.realpathSync(left) === fs.realpathSync(right);
  } catch {
    return path.resolve(left) === path.resolve(right);
  }
};
// The validator imports this module for its exports, so only a direct run fails.
if (process.argv[1] && samePath(process.argv[1], script)) {
  const marker = \`\${script}.first-call\`;
  if (!fs.existsSync(marker)) {
    fs.writeFileSync(marker, 'first call fails on purpose\\n');
    process.exit(1);
  }
  const result = spawnSync(process.execPath, ${runArgs}, { stdio: 'inherit' });
  process.exit(result.status ?? 2);
}
`);
  return `${script}.first-call`;
}

/**
 * Copy a live packet into an archive beside it and record the archived id in
 * its generated files. The copy keeps every document strict validation needs;
 * only the two generated files are rewritten for the place the copy sits.
 *
 * @param {string} root temp repository root
 * @param {string} fromId live packet id, specs-relative
 * @param {string} archivedId archived packet id, specs-relative
 * @returns {string} the archived packet directory
 */
export function archivePacketCopy(root, fromId, archivedId) {
  const source = path.join(root, 'specs', ...fromId.split('/'));
  const target = path.join(root, 'specs', ...archivedId.split('/'));
  const name = path.basename(archivedId);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  writeJson(path.join(target, 'description.json'), {
    level: '1',
    specFolder: archivedId,
    description: 'Archived pipeline fixture packet.',
    specId: name.slice(0, 3),
    folderSlug: name.slice(4),
    parentChain: archivedId.split('/').slice(0, -1),
  });
  writeJson(path.join(target, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: archivedId,
    spec_folder: archivedId,
    parent_id: archivedId.split('/').slice(0, -1).join('/'),
    children_ids: [],
  });
  return target;
}
