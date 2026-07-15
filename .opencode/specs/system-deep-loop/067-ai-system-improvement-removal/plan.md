---
title: "Implementation Plan: Remove the Deep AI-System Improvement Lane"
description: "Delete the dedicated deprecated runtime assets, surgically scrub both shared manifests, and verify the remaining deep-loop lanes with focused tests, JSON parsing, residual scanning, and strict packet validation."
trigger_phrases:
  - "implementation plan"
  - "AI-system lane removal"
  - "runtime scrub"
  - "residual scan"
  - "strict packet validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/067-ai-system-improvement-removal"
    last_updated_at: "2026-07-15T10:14:02Z"
    last_updated_by: "codex"
    recent_action: "Executed the primary and Wave 1b manifests and captured verification receipts"
    next_safe_action: "Orchestrator review and one commit; rollback with git revert <sha>"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/plugins/tests/mk-deep-loop-guard.test.cjs"
      - "README.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The removal is one wave; historical specs are deferred."
---
# Implementation Plan: Remove the Deep AI-System Improvement Lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript/CommonJS, TypeScript test source |
| **Framework** | OpenCode command/skill runtime and Node test tooling |
| **Storage** | Version-controlled runtime files; no data migration |
| **Testing** | `node --test`, Node JSON parsing, `rg`, `validate.sh --strict` |

### Overview

Use the operator's two manifests as the change boundary. The primary Wave 1 removal covers seven dedicated files and 29 shared files; Wave 1b adds eleven dedicated files and 20 shared files. Keep all other lane entries and surrounding prose intact, then verify the combined 67-target runtime result against the focused gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Scope is fixed to the combined 18-delete/49-scrub runtime manifests — receipt in `implementation-summary.md`.
  Evidence: `spec.md` records the primary seven/29 paths and the Wave 1b eleven/20 paths, including both registry surfaces.
- [x] All 67 manifest targets were read at the current worktree state — receipt in `implementation-summary.md`.
  Evidence: Read-before-edit inventory completed before any Wave 1b target mutation; preexisting Wave 1 changes were preserved.
- [x] Existing dirty status was captured before edits — receipt in `implementation-summary.md`.
  Evidence: Baseline `git status --porcelain=v1` captured before the runtime edits.
- [x] Rollback is documented as `git revert <sha>` — receipt in `implementation-summary.md`.
  Evidence: `spec.md` and this plan record the single-commit rollback procedure.

### Definition of Done

- [x] All eighteen dedicated files are deleted — receipt in `implementation-summary.md`.
  Evidence: The seven primary paths and eleven Wave 1b paths are absent; the workspace patch recorded equivalent unstaged deletions where the sandbox denied `.git/index.lock`.
- [x] All 49 shared files are scrubbed without weakening remaining lanes — receipt in `implementation-summary.md`.
  Evidence: Exact residual scan returned zero hits; remaining-lane guard tests passed.
- [x] Focused tests pass — receipt in `implementation-summary.md`.
  Evidence: Both configured Vitest files, the Python family test, and both requested Node plugin tests pass.
- [x] JSON, residual, scope, and strict packet checks pass — receipt in `implementation-summary.md`.
  Evidence: Every edited JSON parses, residual scan returned zero, the operator delta contains the combined 67 manifest paths plus 067, and strict validation reported Errors: 0; unrelated shared-branch paths were left untouched.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manifest-driven surgical removal with separate deletion, shared-scrub, and verification passes.

### Key Components

- **Mode registry and hub router**: remove the deprecated route and aliases while preserving all remaining modes.
- **Deep-improvement documentation**: remove the lane sections, counts, and links without rewriting unrelated lane contracts.
- **Plugin tests and benchmark reports**: remove only deprecated cases/rows and retain coverage/evidence for the remaining lanes.
- **Packet validation**: record the scope, rollback, and receipts in the 067 Level 2 packet.

### Data Flow

The manifest identifies targets → dedicated files are deleted → shared files are scrubbed → JSON is parsed and tests run → residual and git-scope checks confirm the removal is complete.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Dedicated command/assets | Expose the deprecated mode directly | Delete eighteen files | `git status --short` and filesystem checks |
| Registry/router JSON | Advertise modes and aliases | Remove only the deprecated entries | Node `JSON.parse` for all edited JSON |
| Skill/agent/README/playbook docs | Describe lane inventory and routing | Remove lane-specific sections and rebalance counts | Residual scan plus manual coherence review |
| Plugin guard tests | Assert allowed mode routing | Remove only deprecated assertions/cases | Two requested `node --test` files |
| Benchmark reports | Record historical runtime scenarios | Remove deprecated scenario/mode rows | JSON parsing and markdown review |
| Historical `.opencode/specs/**` | Later-wave historical record | Leave unchanged except this 067 packet | Final status delta and protected-path check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read all target files and local workflow instructions — receipt in `implementation-summary.md`.
  Evidence: Workflow contracts and all 67 manifest target paths were read before edits.
- [x] Capture baseline `git status --porcelain=v1` — receipt in `implementation-summary.md`.
  Evidence: Baseline status was stored before the runtime delta.
- [x] Reconcile the 29-file shared manifest, including `mode-registry.json` named by the JSON scrub rule — receipt in `implementation-summary.md`.
  Evidence: The packet manifest contains 49 shared paths across both waves; the user enumeration omitted `mode-registry.json`, which the JSON rule explicitly names.

### Phase 2: Core Implementation

- [x] Delete the seven dedicated files with the requested deletion set — receipt in `implementation-summary.md`.
  Evidence: All seven paths are absent; the `git rm` command was blocked by the read-only `.git` index, so patch deletion was used.
- [x] Remove the deprecated mode/aliases from registry, hub, descriptors, and rollout JSON — receipt in `implementation-summary.md`.
  Evidence: Node parsing passed for all four routing/descriptor JSON files and the focused guards passed.
- [x] Scrub lane-specific prose, rows, links, and test cases from the remaining shared files — receipt in `implementation-summary.md`.
  Evidence: The exact 36-target residual scan returned zero hits and the broader lane scan was also clean.
- [x] Remove empty dedicated-file parent directories when applicable — receipt in `implementation-summary.md`.
  Evidence: The empty authoring-guide parent directory was removed; directories containing remaining files were preserved.

### Phase 2b: Wave 1b Completeness Expansion

- [x] Delete the eleven dedicated Wave 1b files — receipt in `implementation-summary.md`.
  Evidence: All eleven listed paths are absent and only empty dedicated-only parents were removed.
- [x] Scrub the twenty shared Wave 1b files — receipt in `implementation-summary.md`.
  Evidence: Dispatcher branches, parser validation, remaining-lane tests, create-benchmark registries, reports, docs, and graph metadata were scrubbed surgically.
- [x] Preserve all non-deprecated lanes — receipt in `implementation-summary.md`.
  Evidence: Configured Vitest, Python, and plugin guard tests pass after the Wave 1b edits.

### Phase 3: Verification

- [x] Run focused Node tests — receipt in `implementation-summary.md`.
  Evidence: `node --test .opencode/plugins/tests/mk-deep-loop-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` passed 2/2.
- [x] Parse every edited JSON file — receipt in `implementation-summary.md`.
  Evidence: Node `JSON.parse` passed for every edited runtime and packet JSON target.
- [x] Run the zero-hit residual scan across the non-spec `.opencode` runtime — receipt in `implementation-summary.md`.
  Evidence: The exact four-pattern `rg` scan returned no matches.
- [x] Run strict validation for 067 and compare final status to baseline — receipt in `implementation-summary.md`.
  Evidence: `validate.sh --strict` reported Errors: 0; baseline/final status comparison found no out-of-scope delta.

### Phase 3b: Wave 1b Verification

- [x] Run the configured deep-improvement Vitest files — receipt in `implementation-summary.md`.
  Evidence: The dispatcher test passed 21 tests and the host-driven runtime test passed 3 tests.
- [x] Run the create-benchmark family registry test — receipt in `implementation-summary.md`.
  Evidence: Python parity passed for six families and six resource keys.
- [x] Re-run JSON parsing, the all-runtime residual scan, strict validation, and the final scope audit — receipt in `implementation-summary.md`.
  Evidence: All current gates pass and no protected spec or `sk-doc/create-diff` path changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/regression | Dispatcher and host-driven improvement assertions | Configured Vitest runners for the two deep-improvement test files |
| Family registry | Remaining create-benchmark family parity | `python3 .opencode/skills/sk-doc/scripts/tests/test_create_benchmark_family_registry.py` |
| Guard regression | Remaining plugin dispatch assertions | `node --test .opencode/plugins/tests/mk-deep-loop-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` |
| Syntax | Every edited JSON target, including benchmark reports and packet metadata | Node `JSON.parse` for each JSON target |
| Residual | Four deprecated identifiers across the non-spec `.opencode` runtime | `rg -i "ai[-_]system[-_]improvement|non[-_]dev[-_]ai[-_]system|self[-_]target[-_]packaging|lane[-_]d[-_]packaging" .opencode --glob '!.opencode/specs/**'` |
| Packet | Level 2 structure, anchors, frontmatter, evidence, and metadata | `bash .../validate.sh .../067-ai-system-improvement-removal --strict` |
| Scope | Only requested runtime targets plus 067 packet | Baseline/final `git status --porcelain=v1` comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current shared branch | Internal | Dirty but captured | Unrelated changes could be misattributed. |
| Node runtime | Internal | Required | Tests and JSON parsing cannot run. |
| Spec-kit validator | Internal | Required | Packet cannot pass the completion gate. |
| Operator's manifest | External decision | Fixed | Scope or lane preservation becomes ambiguous. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any review finding that the removal breaks a remaining lane, removes a required assertion, or exceeds the manifest.
- **Procedure**: Land the whole removal as one commit, then run `git revert <sha>` to restore the pre-removal runtime. Do not reset, checkout, or stash the shared branch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Delete and scrub |
| Core removal | Setup | Verification |
| Verification | Core removal | Review handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core removal | High | 2-4 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Commit Checklist

- [x] Baseline status captured — receipt in `implementation-summary.md`.
  Evidence: Baseline `git status --porcelain=v1` captured before edits.
- [x] Focused tests pass — receipt in `implementation-summary.md`.
  Evidence: Configured Vitest passed 24 tests, Python family parity passed, and the requested Node command passed 2/2.
- [x] Residual scan returns zero — receipt in `implementation-summary.md`.
  Evidence: Exact residual command returned no matches across the non-spec `.opencode` runtime; alternate projections remain outside scope.
- [x] Final path delta contains no protected historical spec changes — receipt in `implementation-summary.md`.
  Evidence: Final status comparison preserved all baseline paths; the operator delta is the combined 67-path manifest plus 067, while unrelated `sk-doc/create-diff` paths were left untouched.

### Rollback Procedure

1. Identify the single removal commit SHA after review.
2. Run `git revert <sha>`.
3. Re-run the focused tests and status comparison.
4. Report any remaining issue without mutating unrelated work.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the single commit; runtime files and docs are restored by Git.
<!-- /ANCHOR:enhanced-rollback -->
