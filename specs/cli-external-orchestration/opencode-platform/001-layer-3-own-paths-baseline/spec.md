---
title: "Feature Specification: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths"
description: "The dispatch safety net asked for a clean or committed tree, which in a shared tree can only be met by committing other sessions' work. It now snapshots the target's own in-flight paths and still records the hash."
trigger_phrases:
  - "layer 3 own paths baseline"
  - "the dispatch safety net asked for a clean"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `main (no branch created)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-opencode skill requires a recovery baseline before any non-interactive `opencode run` with `--dangerously-skip-permissions` in a deep-loop dispatch. That is Layer 3 of the four-layer mitigation, and it exists because a 2026-05-04 dispatch deleted 44 files across two phase folders. The wording of Layer 3 asks for more than the baseline needs.

The quick checklist in `destructive-scope-violations.md` said "`git status` clean OR working tree committed". The prose above it said "commit any in-flight working-tree state on `main`". Rule 15 in the cli-opencode `SKILL.md` said "main `git status` clean OR committed". In a tree that other sessions also write into, the only way to meet that wording is to commit their uncommitted work. That publishes changes the dispatching agent did not write and cannot vouch for. The snapshot command in the same section already stages `<relevant-paths>`, so the checklist and the prose asked for more than the command they introduce.

### Purpose
Keep the recovery baseline the incident made mandatory, and drop the clean-tree requirement. The dispatch target's own in-flight paths are committed by explicit path, other sessions' changes stay untouched, and the recovery commit hash is still recorded and surfaced.

The operator chose this direction on 2026-09-29 ("Reword to own paths").
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the Layer 3 prose, the snapshot command block, the recovery-baseline sentence and the checklist row in `destructive-scope-violations.md`.
- Reword the Layer 3 clause of rule 15 in the cli-opencode `SKILL.md`.
- Bring the reference's `version:` to the derived value, plus one for the commit that carries this change.

### Out of Scope
- Layers 1, 2 and 4, which are untouched.
- `permissions-matrix.md:288`, which says "commit-before-dispatch gives a recovery baseline" and states no clean-tree requirement.
- The "primary worktree is clean" fail-closed check noted in `deep-review-auto.yaml:1423`. It is a code-enforced gate in the deep-review wrapper and not prose about Layer 3, so it needs its own packet if it proves to be a problem.
- The `version:` of the cli-opencode `SKILL.md`. The versioning engine treats it as the skill's release anchor and leaves it at `1.4.12.0`, and no changelog release is cut here.
- The runtime scope guard described as future work in section 5 of the reference.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md` | Modify | Layer 3 prose, command block, baseline sentence and checklist row, `version:` set |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Layer 3 clause of rule 15 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No Layer 3 statement requires a clean tree or the whole working tree committed | The old phrases are found in both files at `HEAD` and are absent from both working files |
| REQ-002 | The recovery baseline survives | The checklist row still requires a recorded recovery commit hash, rule 15 still says the recovery-baseline commit hash is recorded, and the reference still tells the agent to surface the hash before dispatch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The reference's `version:` follows the versioning standard | The engine's derived value before the commit is `1.4.0.18` and the file carries `1.4.0.19` |
| REQ-004 | Every other clean-tree or recovery-baseline mention is classified | Each hit across the doc roots is read and its reason for staying is recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old lines are present at `HEAD` and absent from the working files, and the reworded text carries no em dash and no semicolon.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | "Own paths" read as permission to skip the baseline when the tree holds peers' changes | High, the dispatch would run with no recovery point | The checklist row still requires a recorded hash, and a target with no in-flight changes uses `git rev-parse HEAD` as its baseline |
| Risk | Peer changes sit inside the target's own paths | Medium, the snapshot would include them | The `git diff --cached --name-only` line prints the staged set before the commit |
| Risk | The build segment is set one above the derived count by hand | Low, `verify` reads it stale by one if history moves | `verify` after the commit confirms it |
| Dependency | The scoped-staging rule in `sk-git` | Low, the new block follows it | `commit-workflows.md`, "Step 7: Scoped-Staging Discipline" |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
