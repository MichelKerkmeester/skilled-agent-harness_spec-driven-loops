---
title: "Feature Specification: Phase 11: two-version-proof-and-closeout"
description: "Prove the whole OpenCode v1 and v2 tree against the phase 001 baseline and the doctor battery on both pinned versions. Then record the scoped compatibility claim and close the packet."
trigger_phrases:
  - "two version proof and closeout"
  - "phase 11 two version proof and closeout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: two-version-proof-and-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/011-two-version-proof-and-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-documentation-sweep |
| **Successor** | None |
| **Handoff Criteria** | Every suite meets its baseline count, the doctor battery exits 0 on OpenCode 1.19.3 and 2.0.32, recursive strict validation prints `RESULT: PASSED` and every acceptance row in every child carries evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The whole tree. This phase runs the proof, records the scoped claim and closes the packet. It changes no plugin, guard, runtime or install code. A failure goes back to the phase that owns the code.

**Dependencies**:
- Phases 001 to 010 closed, each with its own strict validation passing.
- The phase 001 baseline in `../001-unknowns-and-baseline/baseline.json`, which holds each plugin's load state on both versions and each suite's pass count.
- The phase 008 doctor battery at `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`.
- The installed `opencode` 1.19.3 and `opencode2` 2.0.32 on this machine. The phase uses them as they are and changes no install (D4).

**Deliverables**:
- `proof.md` in this folder, with each suite count against its baseline, the doctor battery output for both versions and the recursive validation result.
- The scoped claim (D8) in the cli-opencode `SKILL.md`, with the verification date.
- Completion state reconciled across the parent spec phase map, the parent goal log and each child's status.

**Executor**: The orchestrator runs every suite, probe, battery and validator, and it reconciles the packet. The claim text goes to DeepSeek through cli-devin with the markdown persona inlined, and Luna reviews it through cli-codex, as D6 requires. The open questions below record this conflict with the brief.

**Frozen decisions that bind this phase**:
- D1: Every plugin default-exports one plain object `{ id, setup, server }`, never a function carrying `.id`.
- D2: `opencode.json` stays in the v1 shape, with the singular `permission` map and `mcp.servers`.
- D3: Version comes from parsed `--version` output, never from the binary name. Every v2 child dispatch uses `run --standalone`.
- D4: No phase runs `opencode upgrade --major`, changes an operator install or restarts the v2 background service.
- D5: `@opencode-ai/plugin` is pinned at 1.19.3 exactly, zod is declared and `@opencode/plugin` 2.0.32 is a type-only dev dependency.
- D6: Code goes to Luna through cli-codex. Docs, probes and review go to DeepSeek through cli-devin. Each model reviews the other's output, and the orchestrator runs every test and probe.
- D7: New and changed code follows the sk-code OPENCODE surface, and new and changed docs follow their sk-doc mode.
- D8: The public claim is scoped. Its wording is "Verified against OpenCode 1.19.3 and 2.0.32 on <date>. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified."

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The build spans eleven phase children. Without one closing proof, a reader cannot tell whether the tree works on both versions, whether each suite still meets its baseline or whether the packet's own status is true. A compatibility claim without that proof would repeat the failure the research set out to fix, which is a claim that works on one version and fails on the other with no error.

### Purpose
The whole tree loads and runs on OpenCode 1.19.3 and 2.0.32, with every suite at or above its baseline count. The packet validates recursively, and the scoped compatibility claim sits in the cli-opencode docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rerun every plugin, guard, cli-opencode and deep-loop suite, and compare each count with the baseline.
- Run the doctor battery on OpenCode 1.19.3, and again on OpenCode 2.0.32.
- Run recursive strict validation on the parent packet.
- Reconcile the completion state across the parent and every child.
- Write the scoped claim (D8) into the cli-opencode docs.

### Out of Scope
- Code changes. A failing suite goes back to the phase that owns it.
- Changing an install, upgrading OpenCode or restarting the v2 background service (D4).
- Claiming any version other than 1.19.3 and 2.0.32 (D8).
- Closing the nine irreducible gaps. They stay documented.
- Committing or pushing any branch. Every push needs a separate operator go-ahead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | The scoped claim (D8) with the verification date. The parent goal names this file. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | The same scoped claim, wherever the README names a version. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/` | Modify | The same scoped claim, wherever a reference names a version. |
| `proof.md` in this folder | Create | Suite counts against the baseline, battery output for both versions and the recursive validation result. |
| `../spec.md` (parent) | Modify | The phase map status for phases 001 to 011. |
| `../goal.md` (parent) | Modify | A closeout entry in the log section only. The directive does not change. |
| `implementation-summary.md` in each of the folders from `../001-unknowns-and-baseline/` to `../011-two-version-proof-and-closeout/` | Modify | Status and completion state, reconciled. |
| `acceptance-criteria.md` in each of the folders from `../001-unknowns-and-baseline/` to `../010-documentation-sweep/` | Modify | The Evidence cell of each row. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every suite named in the phase 001 baseline passes at or above its recorded pass count. |
| REQ-002 | The doctor battery exits 0 on OpenCode 1.19.3, and it exits 0 on OpenCode 2.0.32. |
| REQ-003 | `validate.sh` with `--recursive --strict` on the parent packet prints `RESULT: PASSED`. |
| REQ-004 | Every acceptance row in phases 001 to 011 is Met, Waived or Superseded, and each Met row carries evidence in its Evidence cell. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The scoped claim (D8) appears in the cli-opencode `SKILL.md`, with both versions and the verification date. |
| REQ-006 | The parent phase map, the parent goal log and each child's status show the same completion state. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every suite reports a pass count at or above its phase 001 baseline count.
- **SC-002**: The doctor battery exits 0 on both pinned versions.
- **SC-003**: Recursive strict validation of the parent packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 008 doctor battery | The version proof cannot run | Stop. Do not claim the version proof |
| Dependency | Phase 001 baseline in `baseline.json` | Counts cannot be compared | Stop until the baseline file exists |
| Dependency | Installed `opencode` 1.19.3 and `opencode2` 2.0.32 | A binary is missing or reports another version | Stop. Do not install or upgrade (D4). Record the version output |
| Risk | The v2 background service is restarted during the proof | Other sessions lose the daemon they use | Never restart or stop the v2 background service (D4) (High) |
| Risk | A count is lowered to pass a suite | A green run hides a regression | Compare every count with the baseline file, never with an earlier run in this phase (High) |
| Risk | The claim outlives its evidence | A later version is wrongly covered | Name only the two pinned versions and the date of the passing battery (Med) |
| Risk | Recursive validation warns on a child | The packet looks closed while a warning stands | Read each warning and record its classification in `proof.md` (Med) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The proof runs the same commands the baseline recorded, so the counts compare.
- **NFR-P02**: The battery and the suite runs happen in the same session, so the version outputs match the runs they support.

### Security
- **NFR-S01**: `proof.md` carries no provider key or session token.
- **NFR-S02**: No command in this phase runs `opencode upgrade --major` or restarts the v2 background service (D4).

### Reliability
- **NFR-R01**: Each count comes from a command run in this phase, never from an earlier run.
- **NFR-R02**: A battery counts as a pass only after its count is stable across repeated reads.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: A suite that reports zero tests fails the count check unless its baseline count is also zero. The proof records which case applies.
- Maximum length: No limit applies to the proof. The proof records the full output that the counts come from.
- Invalid format: A battery output that never shows a stable count is treated as failed, and it reruns.

### Error Scenarios
- External service failure: The v2 service does not answer. Do not restart it (D4). Record the failure and stop.
- Network timeout: A timed-out battery reruns once, then stops.
- Concurrent access: Suites run one after another, so their output does not interleave with the battery output.

### State Transitions
- Partial completion: Some suites pass and one fails. The failing suite goes back to its owning phase, and this phase stays In Progress.
- Session expiry: Resume from `proof.md` and the open rows in each acceptance table.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | The whole tree across eleven phase children, and the parent packet. |
| Risk | 16/25 | The closeout claim, and a shared v2 daemon that the proof must not disturb. |
| Research | 6/20 | The method is set by the research and the baseline. |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The brief names the orchestrator as the only executor for this phase. D6 routes doc writes to DeepSeek and review to Luna. This spec follows D6 for the claim text, and the orchestrator runs every other step. The orchestrator decides the route before the claim is written.
- D8 needs a verification date. This plan uses the date of the battery run that passes on both versions. A run that fails on either version sets no date.
<!-- /ANCHOR:questions -->
