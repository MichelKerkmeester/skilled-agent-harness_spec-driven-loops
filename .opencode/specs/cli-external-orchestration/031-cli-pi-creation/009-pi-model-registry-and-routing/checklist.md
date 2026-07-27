---
title: "Verification Checklist: Pi model registry and routing"
description: "Level 2 verification checklist covering the Branch A/B registry resolution, CI gate coverage, the fail-closed PI_SUPPORTED_MODELS allowlist, and its dual-entry-point enforcement."
trigger_phrases:
  - "cli-pi model registry checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/009-pi-model-registry-and-routing"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planning-only verification checklist"
    next_safe_action: "Verify items once tasks.md executes; require evidence before marking done"
    blockers: []
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh", "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi model registry and routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-010).
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`, including the affected-surfaces inventory.
- [ ] CHK-003 [P1] Phase 001/002/003 predecessor preconditions confirmed: live pi CLI facts available, `buildPiLineageCommand`/`EXECUTOR_KINDS` includes `cli-pi`, and `cli-pi` is registered in the hub's shared `graph-metadata.json` with `cli-pi/assets/prompt-quality-card.md` shipped.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `model-profiles.json` remains well-formed JSON after all edits (`python3 -c "import json; json.load(open('model-profiles.json'))"` parses cleanly).
- [ ] CHK-011 [P0] `PI_SUPPORTED_MODELS` (`executor-config.ts`) is a hard, curated, non-empty array with zero `"auto"`/router-alias entries; `PI_DEFAULT_MODEL` is one specific allowlisted id.
- [ ] CHK-012 [P1] Whichever branch applies, the resulting profile (`references/models/<id>.md`) or bookkeeping note follows the exact structural shape of the existing sibling conventions (`composer-2.5.md`'s 8 sections, or `_index.md`'s existing prose style).
- [ ] CHK-013 [P1] `check-prompt-quality-card-sync.sh` remains valid Bash (`bash -n check-prompt-quality-card-sync.sh`) after edits.
- [ ] CHK-014 [P1] `npm run typecheck` (system-deep-loop/runtime) returns 0 errors after the `executor-config.ts` edit.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in `spec.md` REQ-001 through REQ-004 met with evidence.
- [ ] CHK-021 [P0] `bash check-prompt-quality-card-sync.sh` exits 0 with `GUARD PASS`, including CHECK 4 for `cli-pi`'s rows.
- [ ] CHK-022 [P0] `buildPiLineageCommand` (`fanout-run.cjs`) throws for `"auto"` and for at least one out-of-roster id, verified by a direct test run - not inferred from code inspection alone.
- [ ] CHK-023 [P0] The cli-pi case of `buildSpawnSpec` (`dispatch-model.cjs`) throws the same class of error for `"auto"` and an out-of-roster id, verified by a direct test run.
- [ ] CHK-024 [P1] `npx vitest run` on the 3 affected test files shows 0 new regressions against a pre-phase-009 baseline.
- [ ] CHK-025 [P1] Whichever branch applies, every unexposed numeric/behavioral field carries an explicit TBD/unconfirmed marker (`grep -n -i "TBD\|unconfirmed"` on the touched profile/note shows >=1 hit per unexposed field); 0 fabricated numbers.
- [ ] CHK-026 [P1] An omitted `--model` defaults to `PI_DEFAULT_MODEL` at both dispatch entry points, confirmed by a dedicated test at each.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (the CHECK 4 / `CLI_EXECUTOR_HUB_METADATA` dependency crosses from registry data into the CI gate script's discovery-reachability logic; the allowlist crosses from `executor-config.ts` into 2 independent `.cjs` dispatch builders).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: every model carrying a `cli-opencode`/`cli-cursor` row enumerated via `rg -n '"executor":\s*"cli-opencode"|"executor":\s*"cli-cursor"'`; confirmed which (if any) also gained a `cli-pi` row is a live-confirmed decision (Branch B), not a speculative sweep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols: `check-prompt-quality-card-sync.sh`'s `cli_cards[]`, `cli_skills[]`, and `CLI_EXECUTOR_HUB_METADATA` all updated together; `executor-config.ts`'s `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` consumed identically by both `fanout-run.cjs` and `dispatch-model.cjs` - no single-entry-point gap.
- [ ] CHK-FIX-004 [P0] N/A - no path/redaction/parser surface changed; the allowlist is a value-membership check (`Set.has()`), not a parser or path-handling fix, so no adversarial delimiter/joined-input table applies here.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (per `plan.md`'s affected-surfaces section): {Branch A, Branch B} x {3 CI-gate coverage points} x {2 runtime dispatch entry points} x {3 test files}.
- [ ] CHK-FIX-006 [P1] N/A - no test or code in this phase reads process-wide/global state beyond the existing `process.env` pattern already used by `isCursorBinaryAvailable`'s proven precedent; no new hostile-env variant is introduced.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase 009 implementation commit SHA once landed, not a moving branch-relative diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, tokens, or credentials introduced in `model-profiles.json`, the new/modified profile, `check-prompt-quality-card-sync.sh`, `executor-config.ts`, `fanout-run.cjs`, or `dispatch-model.cjs`.
- [ ] CHK-031 [P1] No auth/credential surface touched (matches phase 001's read-only, auth-adjacent boundary); the allowlist is a static value check, not an auth mechanism.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` stay synchronized (same file scope, same REQ IDs referenced consistently).
- [ ] CHK-041 [P1] `references/models/_index.md` (or the touched profile) documents which branch (A/B) applied and why, so a future reader does not have to re-derive Open Question 1's resolution.
- [ ] CHK-042 [P2] `model-profiles.json`'s top-level `version`/`description` updated to mention the Pi contribution (REQ-009), or explicitly deferred with a documented reason.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the declared files changed (registry data, CI gate script, `executor-config.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, 3 test files, spec-folder docs); `git status` shows no drift outside this scope.
- [ ] CHK-051 [P1] No temp/scratch files left behind from verification runs; `scratch/` cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
- **Predecessor**: `../008-pi-hook-extension-layer/checklist.md`
- **Successor**: `../010-pi-manual-testing-playbook/checklist.md`
