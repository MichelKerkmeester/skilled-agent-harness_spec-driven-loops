---
title: "Feature Specification: zvec-grep vendoring into system-plugins "
description: "The zvec-grep fork the retrieval lane depends on lived in a clone outside the repository, reachable only through an environment variable while the upstream package on PATH won by default; this packet vendors the fork under system-plugins as a git subtree and puts that copy first in the lane's resolution order."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: zvec-grep vendoring into system-plugins

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `worktrees/044-zvec-grep-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval lane built in packet 050 depends on fork behaviour: the Ollama embedder, the daemon-free MCP server and the direct query that no longer scans the workspace. That fork lived in a clone beside the repository, invisible to a fresh checkout, and the lane reached it only through `SPECKIT_ZVEC_GREP_BIN`; without the variable the upstream Homebrew `zg` on PATH answered instead, silently lacking all three.

### Purpose
A fresh checkout carries the fork's source at `.opencode/skills/system-plugins/zvec-grep/`, builds it with two commands, and the lane picks that build ahead of anything on PATH.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The fork's `harness` branch as a squashed git subtree at `.opencode/skills/system-plugins/zvec-grep/`, with a `system-plugins` README covering build and update.
- The lane's resolution order changed to override, vendored build, PATH, outside checkout, with the vendored rung injectable for tests.
- The doctor `zvec` route naming an unbuilt vendored copy as a signal; the retrieval conventions and skills catalog naming the new home.

### Out of Scope
- Committing `dist/` or `node_modules/` - both are ignored by the fork's own rules; the build is a documented step.
- Editing the fork inside the subtree - changes go to the fork repository and come back through `git subtree pull`.
- The prompt-time hook - packet 050's `goal.md` hands that to its own packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-plugins/zvec-grep/**` | Create | Squashed subtree of the fork's `harness` branch, 380 files |
| `.opencode/skills/system-plugins/README.md` | Create | What is vendored, why, how to build and update |
| `.opencode/skills/README.txt` | Modify | Catalog row for `system-plugins` |
| `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs` | Modify | Vendored rung ahead of PATH, injectable for tests |
| `.opencode/skills/system-spec-kit/scripts/tests/zvec-lane.vitest.ts` | Modify | Vendored-rung tests; existing order tests pinned to a missing vendored path |
| `.opencode/commands/doctor/assets/doctor-zvec.yaml` | Modify | `vendored_not_built` signal and the resolution order |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Where the tool lives and how it is resolved |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fork's source is tracked in this repository under `.opencode/skills/system-plugins/zvec-grep/` and rebuilds from a fresh checkout with `npm ci && npm run build` |
| REQ-002 | With no override set, the lane resolves the vendored build before any `zg` on PATH, and reports `binarySource: vendored` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An unbuilt vendored copy is a named doctor signal, and the lane still answers from the next rung rather than failing |
| REQ-004 | The five baseline queries return the same top hits through the vendored build as through the outside clone |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `zvec-lane.mjs status --json` from the worktree reports `binarySource: vendored` with the entry under `system-plugins`.
- **SC-002**: The five concept queries through the vendored build match the post-fix baseline's top hits and stay under two seconds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The fork's `harness` branch | Subtree has nothing to pull | The branch exists at `893af2f` with the three feature branches merged |
| Risk | Repository growth from the subtree | Low | 19 MB tracked, 15 MB of it upstream's `.github`; squashed so history adds one commit per pull |
| Risk | A fresh checkout runs the lane before building | Med | The doctor route names the unbuilt copy; the lane falls through to PATH or the outside clone and says which answered |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Resolution adds one `stat` before the PATH walk; no measurable change to query latency.
- **NFR-P02**: The vendored build's query latency equals the outside clone's, under two seconds cold on the baseline index.

### Security
- **NFR-S01**: The subtree carries no secrets; the fork's `.gitignore` excludes env files and local state.
- **NFR-S02**: The vendored copy talks only to loopback Ollama, as the lane did before.

### Reliability
- **NFR-R01**: Resolution is a pure function of its arguments; the vendored rung is injectable so tests prove the order on any machine.
- **NFR-R02**: A missing vendored build never produces an error from the lane; it produces the next rung and a doctor signal.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty override variable is treated as unset and resolution continues to the vendored rung.
- Maximum length: not applicable; the entry is one path.
- Invalid format: a vendored entry that exists but is not a module still resolves; the spawn reports the failure with the path named.

### Error Scenarios
- External service failure: unchanged from packet 050; Ollama unreachable is reported on its own status line.
- Network timeout: not applicable to resolution.
- Concurrent access: two processes resolving at once read the same file; no state is written.

### State Transitions
- Partial completion: a half-built `dist/` without `cli/index.js` counts as unbuilt and falls through.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One subtree, one wrapper edit, tests, three docs |
| Risk | 6/25 | Resolution order changes which binary answers; covered by tests and a doctor signal |
| Research | 3/20 | Subtree mechanics and the harness's vendoring pattern were known |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should upstream's 15 MB `.github` tree be pruned from the subtree? Pruning complicates every later `subtree pull`, so it stays until the size matters.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
