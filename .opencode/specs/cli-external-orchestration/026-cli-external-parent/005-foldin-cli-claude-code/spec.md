---
title: "Feature Specification: Phase 5: foldin-cli-claude-code"
description: "Fold the cli-claude-code skill into cli-external as the second workflow packet, dissolve both children's graph identities into one hub identity, and rewrite the executor-delegation scorer to be hub-aware. The move, dissolution, scorer rewrite, dist rebuild, and parity-fixture re-baseline must land as one atomic change, with the dissolution gated behind the scorer rewrite."
trigger_phrases:
  - "foldin cli-claude-code"
  - "identity dissolution"
  - "executor-delegation scorer rewrite"
  - "parity fixtures re-baseline"
  - "phase 005 atomic bundle"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the atomic fold-in + scorer-rewrite spec, plan, tasks, checklist"
    next_safe_action: "Execute the atomic dissolution + scorer bundle after phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/cli-claude-code/"
      - ".opencode/skills/cli-external/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-cli-claude-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The dissolution is gated behind the scorer rewrite: both land in the same commit, so there is no window where the family filter matches the hub (leaves gone) and delegation routing silently degrades"
      - "cli-claude-code lacks cli-opencode's parallel-detached carve-out; the asymmetry is intentional and preserved"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: foldin-cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-onboard-cli-opencode |
| **Successor** | 006-advisor-and-integration |
| **Handoff Criteria** | The cli-claude-code tree is moved under cli-external (with its ~13 internal outbound relative paths rewritten), exactly one hub `graph-metadata.json` remains, the executor-delegation scorer sources its alias table from the hub mode-registry and resolves to the executor-kind strings, the dist is rebuilt, the 11 parity cases (6/2/2/1) are re-baselined green with the negatives preserved and no scenario resolving to `cli-external`, and all of this landed as one atomic change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Move plus the atomic identity dissolution and scorer rewrite. This phase relocates cli-claude-code, dissolves both children's graph identities into one hub identity, rewrites the executor-delegation scorer to be hub-aware, rebuilds its dist, and re-baselines its parity fixtures — all in one change. It does not perform the broad prose/documentation referrer sweep (phase 006).

**Dependencies**:
- Phase 004 relocated cli-opencode and repointed the fail-open PreToolUse hook path.
- Phase 002's ADR-004 and ADR-005 froze the identity dissolution and the scorer-rewrite contract, paired and atomic.
- Phase 003 created the hub `mode-registry.json` that becomes the rewritten scorer's source of truth.

**Deliverables**:
- Full `git mv` relocation of `.opencode/skills/cli-claude-code/` (~50 files) into `.opencode/skills/cli-external/cli-claude-code/`, preserving history.
- Identity dissolution: delete both children's `graph-metadata.json` and fold the union of their `intent_signals`, `trigger_phrases`, and `edges` into the single hub `graph-metadata.json` (`family: cli`).
- Hub-aware rewrite of `executor-delegation.ts` sourcing its executor alias table from the hub `mode-registry.json` `packetSkillName` values, resolving to the `EXECUTOR_KINDS` strings, with the compiled dist rebuilt and the parity fixtures re-baselined green — all in the same commit as the dissolution.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-claude-code` is still a second independent advisor identity, and the two children still carry separate `graph-metadata.json` files. The moment both identities dissolve into one hub identity with `family: cli`, the executor-delegation scorer's `projection.skills.filter(family === 'cli' && lifecycleStatus === 'active')` selects the hub, and its alias table silently DEGRADES (no thrown error): the hub id yields the noun `external` into `orchestratorNouns` so prompts resolve to the non-executor `cli-external`, and the model-alias backstop drops because the `activeExecutorIds` guard no longer holds `cli-opencode`/`cli-claude-code`. The dissolution therefore cannot ship without the scorer rewrite landing in the same change.

### Purpose
Fold `cli-claude-code` into `.opencode/skills/cli-external/cli-claude-code/`, dissolve both graph identities into one hub identity, and rewrite the scorer to source its alias table from the hub `mode-registry.json` — resolving to the same executor-kind strings downstream config expects — as one atomic change, so delegation routing never breaks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the complete `.opencode/skills/cli-claude-code/` tree (~50 files) into `.opencode/skills/cli-external/cli-claude-code/` with `git mv`, rewriting its ~13 internal outbound relative cross-skill paths (each gains a `../` because the tree nests one dir deeper) in the same move — grep cannot catch these afterward, so a link-resolve check is required here.
- Delete both children's `graph-metadata.json` and fold their union of edges, domains, and intent signals into the single surviving hub `graph-metadata.json`.
- Rewrite `executor-delegation.ts` to source its executor alias table from the hub `mode-registry.json` `packetSkillName` values instead of the top-level `family === 'cli'` filter, without deriving an orchestrator noun from the hub id (so `external` never enters the alias table), while resolving each match to the `EXECUTOR_KINDS` strings `cli-opencode` / `cli-claude-code`.
- Rebuild the compiled `dist/` scorer artifact in the same change.
- Re-baseline `tests/parity/fixtures/executor-delegation-cases.json` (the actual 11 cases: 6 `expectedTop: cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`), keeping the 2 `sk-code` + 1 `none` negatives green, asserting no scenario resolves to `cli-external`, and keeping `tests/scorer/executor-delegation.vitest.ts` green.
- Finalize the PreToolUse hook's cli-claude-code registry entry to the hub path, and repoint `check-prompt-quality-card-sync.sh`'s cli-claude-code card path in the same commit as the move (closing the CI window opened at phase 004).

### Out of Scope
- The broad documentation and prose referrer sweep, the Python alias-map repoint, and the constitutional path-template repoint - phase 006 owns those.
- The Lane-C benchmark and the live delegation-routing re-baseline - phase 007 owns those; this phase only keeps the vitest green.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-claude-code/` | Move | Source of the ~50-file tree to relocate with `git mv` into `.opencode/skills/cli-external/cli-claude-code/`. |
| `cli-external/cli-claude-code/**` internal outbound paths (~13 relative cross-skill refs) | Modify | Add a `../` to every relative cross-skill path (nested one dir deeper) in the same move; verify with a link-resolve check — grep cannot catch these afterward. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | Repoint the cli-claude-code card path in the same commit as the move, closing the CI window opened at phase 004. |
| `.opencode/skills/cli-external/graph-metadata.json` | Modify | Single surviving advisor identity (`family: cli`); absorbs the union of both children's edges, domains, and intent signals. |
| both children's `graph-metadata.json` | Delete | Remove both packet-local identities as part of the dissolution, after their content is folded into the hub metadata. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Modify | Source the alias table from the hub `mode-registry.json` packets, resolving to the `EXECUTOR_KINDS` strings. |
| `system-skill-advisor/mcp_server/dist/...` (compiled scorer) | Modify | Rebuild the compiled dist in the same change. |
| `system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json` | Modify | Re-baseline the 11 cases (6 `cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`) against the hub-aware scorer, preserving the negatives and asserting no scenario resolves to `cli-external`. |
| `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | Modify | Finalize the hook's cli-claude-code registry entry to the hub path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The full cli-claude-code tree is moved with `git mv`, history preserved. | The destination packet contains the ~50-file tree (SKILL.md, README, references, assets, changelog, manual_testing_playbook); the old flat folder is absent; `git status --short` shows renames. |
| REQ-002 | Exactly one `graph-metadata.json` survives under `.opencode/skills/cli-external/`. | A file inventory under `cli-external/` reports only `cli-external/graph-metadata.json`; no packet-local graph metadata remains; the folded union of both children's edges and intent signals is present. |
| REQ-003 | The scorer is rewritten to be hub-aware and lands atomically with the dissolution. | `executor-delegation.ts` sources its alias table from the hub `mode-registry.json` `packetSkillName` values and resolves to the `EXECUTOR_KINDS` strings; the change is in the SAME commit as the dissolution — no commit exists where the leaves are gone but the scorer still reads the family filter. |
| REQ-004 | The dist is rebuilt and the parity fixtures re-baseline green with the negatives preserved. | The compiled dist reflects the rewritten scorer; `executor-delegation-cases.json` passes all 11 cases in the real distribution — 6 `expectedTop: cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`; the 2 `sk-code` + 1 `none` NEGATIVE-for-cli assertions must stay green (the hub-aware rewrite must not let an `external` noun steal them); NO scenario resolves to `cli-external`; and `tests/scorer/executor-delegation.vitest.ts` is green. |
| REQ-007 | cli-claude-code's internal outbound paths are rewritten in the same move and resolve. | Every relative cross-skill path gains the extra `../`; a link-resolve check confirms zero dangling `../sk-`/`../system-` targets — not deferred to phase 006, whose grep cannot detect a depth-broken relative path. |
| REQ-008 | The card-sync CI gate is green after the cli-claude-code repoint. | `check-prompt-quality-card-sync.sh`'s cli-claude-code card path is repointed in the same commit as the move, closing the window opened at phase 004 so `.github/workflows/prompt-card-sync.yml` is green. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The PreToolUse hook's cli-claude-code entry resolves the hub path. | The hook's `DISPATCH_SKILLS` registry resolves cli-claude-code from `cli-external/cli-claude-code/SKILL.md`; the mid-migration window from phase 004 is closed. |
| REQ-006 | The self-invocation guard survives unchanged, including its intentional asymmetry. | cli-claude-code keeps its runtime-signal-based `$CLAUDECODE` guard and does NOT gain cli-opencode's parallel-detached carve-out; the asymmetry is preserved on purpose. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the atomic change, a delegation prompt naming an executor resolves the correct executor-kind string through the rewritten scorer, with no silent misroute.
- **SC-002**: Exactly one advisor identity (`cli-external`) exists, carrying the folded union of both children's edges and intent signals.
- **SC-003**: `tests/scorer/executor-delegation.vitest.ts` and the re-baselined parity fixtures pass, and the dissolution plus scorer rewrite are provably in one commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 cli-opencode relocation and hook repoint | The destination hub and the hook's cli-opencode branch must already exist | Confirm phase 004 landed before executing; halt if the hub layout is missing |
| Risk | The scorer rewrite lands in a separate commit from the dissolution | High: opens a silent-degradation window where the family filter matches the hub, routing prompts to the non-executor `cli-external` and dropping the model-alias backstop | Gate the dissolution behind the scorer rewrite: both in one atomic commit; treat as one verification unit |
| Risk | A parity fixture is missed and the scorer regresses undetected | High | Re-baseline all 11 cases (incl. the 2 `sk-code` + 1 `none` negatives), assert no scenario resolves to `cli-external`, and keep the vitest green; phase 007 re-runs a live delegation-routing baseline |
| Risk | An edge or intent signal is dropped during the fold | Medium | Fold the union of both children's edges/signals into the hub metadata before deleting the packet-local files; phase 006 regenerates the graph to confirm |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Atomicity
The directory move, the identity dissolution, the scorer rewrite, the dist rebuild, and the parity-fixture re-baseline are one atomic execution unit and one verification unit. Reverting reverts all of them together.

### Reversibility
The whole change reverts as one commit (`git revert`), restoring both packet-local `graph-metadata.json` files, the family-filter scorer, its prior dist, and the prior fixtures together. No partial restore is permitted.

### Traceability
The scorer rewrite must be traceable to ADR-005: the source (hub `mode-registry.json`), the resolution target (`EXECUTOR_KINDS`), the no-hub-noun rule, the dist refresh, and the 11-case fixture re-baseline (with negative-preservation and no `cli-external` resolution) are all named obligations.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Scorer resolves a mode not in the registry
If a delegation prompt names an executor whose `packetSkillName` is not in the hub `mode-registry.json`, the scorer must fall through to its existing no-match behavior, not throw — the registry is the source of truth, and an unknown executor is a no-route, not a crash.

### Fold-in leaves an orphaned edge
If a reciprocal `enhances` edge from another skill still names an old flat identity after dissolution, it is repointed to `cli-external` (started here for any edge touched by the fold, completed in phase 006's sweep), not left dangling.

### Vitest reveals a routing regression
If the re-baselined vitest surfaces a routing regression, the phase does not hand off: the scorer or fixtures are corrected until green, because a red delegation vitest means live misroute risk.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for this drafting pass. During execution, confirm the exact `EXECUTOR_KINDS` enum members and the current fixture `expectedTop` distribution from the live worktree before applying the atomic change.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
