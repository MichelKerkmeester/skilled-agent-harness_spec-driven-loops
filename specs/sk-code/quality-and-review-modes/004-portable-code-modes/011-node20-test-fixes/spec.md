---
title: "Feature Specification: Node 20 test fixes for the advisor plugin suite and the parallel node check helper"
description: "Two suites fail on Node 20.19.5 and pass on Node 22 and 26: the advisor plugin suite stops at load on a missing module.registerHooks, and the parallel syntax check loses the SyntaxError line of a long one-line file."
trigger_phrases:
  - "node20 test fixes"
  - "node 20 test fixes for the advisor plugin"
  - "registerHooks is not a function"
  - "the direct check reported no message"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Node 20 test fixes for the advisor plugin suite and the parallel node check helper

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/240-node20-test-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two test files fail on Node 20.19.5 and pass on Node 22.23.1 and 26.8.2, on unchanged main. `.opencode/plugins/tests/system-skill-advisor.test.cjs` calls `module.registerHooks`, which exists only from Node 22.15 and 23.5, so the suite stops at load. `parallel-node-check.test.cjs` fails its long one-line case because a node child that exits while an async stderr write is still queued loses what the stdio channel its parent created could not take at once: 8 KiB under a Node 20 parent and 64 KiB under Node 22 and later on macOS. The 20,000-character case crossed only the Node 20 limit, so the `SyntaxError:` line never arrived under a Node 20 runner, in the test's direct reference and in the helper the quality runner uses; a 100,000-character file loses it under every Node. Linux writes to pipes and sockets synchronously and is inferred unaffected.

### Purpose
Both suites pass on every Node the code supports, and a minified file's `syntax-node` finding quotes its real message on Node 20.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ~/.nvm/versions/node/v20.19.5/bin/node --test .opencode/plugins/tests/system-skill-advisor.test.cjs
# registerHooks({
# ^
# TypeError: registerHooks is not a function
# pass 0
# fail 1

$ ~/.nvm/versions/node/v20.19.5/bin/node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs
not ok 2 - unit: node pool helper: a long one-line file keeps its message inside the record budget
  error: 'the direct check reported no message'
# pass 2
# fail 1

# A 20,000-character one-line file, its node --check report read through a spawnSync pipe:
v20.19.5: status 1, stderr length 8192, ends inside the quoted source line
# The same report redirected to a file, or through a shell pipe:
v20.19.5: 21372 bytes   v22.23.1: 21372 bytes   v26.8.2: 21371 bytes
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Give the advisor plugin suite a Node 20 path for its import stubs: keep `module.registerHooks` where it exists and register the same resolve rule through `module.register` otherwise.
- Make the parallel syntax helper read each child's stderr from a file, so a Node 20 child's whole report survives its exit.
- Make the long-line test read its direct reference report from a file, so the reference is not lossy itself.
- Make the real-chokidar watcher case poll on macOS, where FSEvents can lag seconds under a busy `fseventsd`.
- Write one changelog entry for each owning skill and step its `SKILL.md` version.

### Out of Scope
- The plugin code under test - it never calls `registerHooks`, so it already runs on Node 20.
- CI workflow Node versions - both suites run on Node 22 in CI, and adding a Node 20 matrix is a separate decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | Feature-detect `registerHooks`, fall back to `module.register` with the stubs passed as data |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs` | Modify | Child stderr goes to a per-child file in a run-owned temp folder, read back inside the same budget |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` | Modify | Direct reference report read from a file |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modify | Stat polling on macOS for the real-chokidar case |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.2.0.md` | Create | Changelog entry |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.10.0.md` | Create | Changelog entry |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Version carriers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` exits 0 with no failing case on Node 20.19.5, 22.23.1 and 26.8.2, three runs each. |
| REQ-002 | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` exits 0 with no failing case on Node 20.19.5, 22.23.1 and 26.8.2, three runs each. |
| REQ-003 | On Node 20, the helper's record for a long one-line file carries the same `SyntaxError:` message as a direct check read from a file; the unchanged helper fails that assertion. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The whole sk-code-quality script suite and the whole plugin suite still pass on the default Node. |
| REQ-005 | Each owning skill has a changelog entry with 0 validator issues and its `SKILL.md` version stepped. |
| REQ-006 | `daemon-watcher-new-root-ingestion.vitest.ts` passes five consecutive runs on macOS, with its real-chokidar case polling on macOS and keeping the native watcher on Linux. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both test files report `fail 0` and exit 0 on Node 20.19.5, 22.23.1 and 26.8.2 across three runs each.
- **SC-002**: Running the quality gate under Node 20 on a long one-line file reports `node --check: Unexpected token 'function'`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `module.register` off-thread hooks on Node 20 | Without it the fallback stubs nothing | Available from Node 20.6; the read-counting cases only pass when the parent-scoped stub applies, so a silent miss fails the suite |
| Risk | A stderr temp folder outlives a stopped helper | Low | The folder is removed on every exit path, signals included; a run of the suite leaves no `parallel-node-check-*` folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The helper adds one file open, one read and one delete per child; the full sk-code-quality suite still passes on Node 20 and the default Node.

### Security
- **NFR-S01**: Stderr files live under `os.tmpdir()` in a `mkdtemp` folder, never in the repository the runner guards.

### Reliability
- **NFR-R01**: Three consecutive runs per Node version give the same result.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty file list starts no child and creates no temp folder.
- Maximum input: a report longer than the 4096-character budget keeps its head and tail, as before.
- Failure path: a child that fails to spawn or is killed still gets one record, read from whatever its file holds.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Three code files, two changelogs, two version lines |
| Risk | 6/25 | One helper the quality runner calls; record format unchanged |
| Research | 8/20 | Root-causing the Node 20 stderr loss |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
