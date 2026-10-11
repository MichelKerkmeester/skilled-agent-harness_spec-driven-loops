---
title: "Feature Specification: Phase 7: remediation-deep-review"
description: "Six fix phases shipped as commits fde8a56d87 through 8e1be919a4, each verified only by the orchestrator that built it. This phase reviews them with an independent five-iteration deep review and keeps only the findings a rerun confirms."
trigger_phrases:
  - "remediation deep review"
  - "phase 7 remediation deep review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: remediation-deep-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-hook-late-write-test |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the root cause and UX research packet. It reviews the fixes phases 001 to 006 shipped and changes no product file.

**Scope Boundary**: Review only. The commits `fde8a56d87..8e1be919a4` are read and rerun; findings go to `review/review-report.md`.

**Dependencies**:
- The six fix phases, committed
- The `pi` binary with the llmgateway credential, or cline-pass as the fallback route

**Deliverables**:
- One five-iteration `/deep:review` lineage under `review/lineages/`
- `review/review-report.md` with confirmed findings only

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each fix phase was built by a cli-pi builder and checked by the same orchestrator that wrote its brief. Nobody independent has asked whether each fix is correct, whether it broke a neighbor, whether each new test fails without its fix, and whether each phase's summary claims what its commit does.

### Purpose
A ranked list of confirmed findings against the six fixes, each with file:line evidence and the smallest fix, so the next round can act on it without re-deriving anything.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The review target is the product change in commits `fde8a56d87..8e1be919a4` on branch `worktrees/094-root-cause-ux-research`. Read it with `git show <commit>` or `git diff fde8a56d87^..8e1be919a4 -- <path>`.

| Phase | Commit | Product change to review |
|-------|--------|--------------------------|
| 001 | fde8a56d87 | The authored classifier harness drops its `cli-deem` mode; the manifest test reads its hub count from `sync.HUBS.length` |
| 002 | 48c4d4284f | The admission test pins `LIVE_CORPUS_SIZE` at 86 |
| 003 | 6df2b9c3b5 | The stale `jev-transport-single` canary case leaves the live fixture and its archive copy |
| 004 | 7cd3e8e5db | The Pi guard's ambiguous-command denial names what it accepts, with a test |
| 005 | 54f9d041fd, 4a8a4065b6 | The README states the Node floor |
| 006 | 54b4547bff | The hook stdin suite gains a late-write test; system-spec-kit moves to 2.7.2.1 with a changelog |
| close-out | 8e1be919a4 | Regenerated derived artifacts and parent docs |

Review lenses, in this order:
1. **Correctness**: does each fix do what its phase claims, read against the code it touches.
2. **Regressions**: `node .skilled/bin/compiled-route-sync.cjs --check`, the four `.skilled/bin/tests/compiled-route-*.test.cjs` files, all hub canaries (`node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs`), and the commit guard.
3. **Test quality**: does each new or changed test fail without its fix.
4. **Version and changelog hygiene** for system-spec-kit 2.7.2.1.
5. **Comment hygiene**: no spec paths, phase numbers or finding ids in code comments.
6. **Prevent-overengineering**: each change against `.skilled/repo-rules/prevent-overengineering.md`.
7. **Claim fidelity**: each phase's `spec.md`, `goal.md` and `implementation-summary.md` under `../00[1-6]-*` against its commit.

The files under review are listed in `goal-file-manifest.txt`. The regenerated `runtime/data/trigger-index.json` and retrieval fixtures are derived; check them with their generator's `--check` mode rather than reading them.

### Out of Scope
- Changing any product file. Findings name the fix; a later phase builds it.
- Fixes 4 and 5 of the research, which the skill-authoring track owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `007-remediation-deep-review/review/` | Create | Lineage state and the synthesized `review-report.md` |
| `007-remediation-deep-review/*.md`, `goal-file-manifest.txt` | Create | Phase docs and the review scope |
| `../spec.md`, `../goal.md`, `../graph-metadata.json` | Modify | The phase-map row and the goal binding row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five review iterations run on the named executor | The lineage state log holds five iteration records |
| REQ-002 | Only confirmed findings reach the report | Each finding in `review/review-report.md` carries file:line and the command or read that confirmed it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No product file changes | `git diff --name-only` over this phase's commit lists only spec-folder paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` ranks every confirmed finding P0, P1 or P2 and lists the refuted ones.
- **SC-002**: This phase and the 013 parent pass strict validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass usage limit | Med | Switch to cline-pass, then wait for the reset |
| Risk | A lineage finding is wrong | Med | The synthesis reruns or rereads each one before keeping it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
