---
title: "Implementation Plan: Phase 12: missing-stress-fixture-root"
description: "Recover the pruned fixture corpus from git history, reshape it to the six current runtime agent trees, and repair the sandbox setup script until a sandbox built by the script alone can run the scenarios' helper steps."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: missing-stress-fixture-root

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash setup script, Markdown/TOML fixture surfaces, Node.js helper scripts |
| **Framework** | deep-improvement skill manual-testing playbook |
| **Storage** | None; the fixture is static content and the sandbox lives under `/tmp/` |
| **Testing** | Setup-script execution, helper-script runs, roster and mirror gates, runtime vitest suite |

### Overview

The pruned fixture corpus comes back from `ebe7d6bb3c4^`, reshaped to the six runtime agent
trees the crosswalk defines so a real six-tree agent can be simulated. `setup-cp-sandbox.sh` is
repaired on three axes found by running it: the repo-root walk, the required fixture paths, and
the shared package its sandboxed helper steps resolve. The proof is a fresh sandbox built by the
script alone, running `scan-integration.cjs` and `generate-profile.cjs` against the restored target.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (git history holds the pruned corpus; the crosswalk defines shapes)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Static fixture corpus plus a sandbox-provisioning script. The script copies the skill, the command
and the target agent surfaces into `/tmp/cp-improve-sandbox`, so the improvement scenarios can
dispatch against a controlled target without touching canonical files.

### Key Components
- **Fixture corpus**: one deliberately flawed agent in all six runtime tree shapes, plus a README that names the flaws and the scenario IDs they serve.
- **Sandbox setup script**: path-guarded copy of the command, skill and target surfaces into a validated `/tmp/` directory.
- **Sandboxed helper chain**: the scenario's scanner, profiler, scorer, benchmark and reducer scripts, which resolve the shared frontmatter package by walking up from their own path.

### Data Flow

The script validates the sandbox directory, copies the command and skill trees, then copies each
target surface from the fixture. Scenario operators then run the helper steps against the sandbox
root and dispatch Call A / Call B with `--dir /tmp/cp-NNN-sandbox`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `setup-cp-sandbox.sh` | Producer of every scenario's sandbox | update | Runs exit 0; sandbox helpers pass |
| Three scenario documents | Consumers naming the fixture root and the script | unchanged | Their named paths now resolve |
| Roster / mirror-sync / generators | Potential discoverers of fixture agents | unchanged | 12 agents each; no fixture entry |

Required inventories:
- Same-class producers: `rg -n 'test-fixtures/060-stress-test' .opencode` → four consumers, all located.
- Consumers of changed symbols: the script's `FIXTURE_ROOT`, `REPO_ROOT` and required-path list, read at every `require_path` call.
- Matrix axes: six runtime tree shapes × presence, shape and resolution.
- Algorithm invariant: not a parser or resolver change; the script keeps its `/tmp/`-rooted sandbox guard.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Setup script against a fresh sandbox | `bash setup-cp-sandbox.sh --sandbox-dir /tmp/cp-proof-sandbox` |
| Integration | Scenario helper chain from the sandbox | `scan-integration.cjs`, `generate-profile.cjs` |
| Gate | Roster, mirror-sync, codex/pi generators | `agent-roster-mirror-check.cjs`, `check-agent-mirror-sync.cjs --all`, `sync-agents*.cjs --check` |
| Unit suite | deep-loop runtime | `npx vitest run --no-coverage` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pruned corpus in git history | Internal | Green | Without `ebe7d6bb3c4^` the corpus would need re-authoring |
| Agent mirror crosswalk | Internal | Green | Without it the fixture shapes would be guessed |
| `@spec-kit/shared` + `js-yaml` | Internal | Green | Without them the sandbox helper steps fail module resolution |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fixture is later judged obsolete, or the script's provisioning turns out wrong.
- **Procedure**: `git rm -r` the fixture directory and `git checkout -- setup-cp-sandbox.sh` to return to the pruned state; if restoring, re-run the setup proof.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure | None | Restore |
| Restore | Measure | Verify |
| Verify | Restore | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure | Low | 30-45 min |
| Restore | Low | 30-45 min |
| Verify | Medium | 30-45 min plus the background suite |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---
