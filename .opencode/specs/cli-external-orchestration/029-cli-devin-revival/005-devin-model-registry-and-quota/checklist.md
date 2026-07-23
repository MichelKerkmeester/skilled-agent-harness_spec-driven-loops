---
title: "Verification Checklist: Devin model registry and quota restoration"
description: "Level 2 verification checklist for the model-registry and quota restoration phase, covering registry shape, sibling regression guards, the CI gate's 4 checks, and the phantom permission-mode wording guard."
trigger_phrases: ["devin model registry checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/005-devin-model-registry-and-quota"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the verification checklist for this Planned phase; no items verified yet."
    next_safe_action: "Verify items once tasks.md executes; require evidence before marking done"
    blockers: []
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "sk-prompt/prompt-models/references/models/swe-1.6.md", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin model registry and quota restoration

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
- [ ] CHK-003 [P1] Phase 003 predecessor precondition confirmed: `cli-devin` registered in the hub's shared `graph-metadata.json` with `deepseek`/`kimi`/`glm` family tokens reachable.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `model-profiles.json` remains well-formed JSON after all edits (`python3 -c "json.load(...)"` parses cleanly).
- [ ] CHK-011 [P0] `swe-1.6`'s entry has no `recommended_frameworks` key, mirroring `haiku`'s non-`cli-opencode` shape (correctly exempt from CHECK 3/4's adopted-model obligations).
- [ ] CHK-012 [P1] `check-prompt-quality-card-sync.sh` remains valid Bash (`bash -n check-prompt-quality-card-sync.sh` or an equivalent syntax check) after edits.
- [ ] CHK-013 [P1] `swe-1.6.md`'s frontmatter and section structure follow the sibling cards' conventions (`kimi-k2.7-code.md`, `glm-5.2.md`, `deepseek-v4-pro.md`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in `spec.md` REQ-001 through REQ-005 met with evidence.
- [ ] CHK-021 [P0] `bash check-prompt-quality-card-sync.sh` exits 0 with `GUARD PASS`, including CHECK 4 for the 3 sibling models' new `cli-devin` rows.
- [ ] CHK-022 [P1] The phantom permission-mode wording bug ("auto, dangerous, or dangerous") is absent from `swe-1.6.md` and any other new/modified prose in this phase (0 `rg` matches).
- [ ] CHK-023 [P1] `validate.sh --strict` on this phase folder returns Errors: 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (the CHECK 4 / `CLI_EXECUTOR_HUB_METADATA` dependency crosses from the registry data into the CI gate script's discovery-reachability logic).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: all models carrying a `cli-opencode` row enumerated via `rg -n '"executor":\s*"cli-opencode"'`; confirmed only `deepseek-v4-pro`, `kimi-k2.7-code`, and `glm-5.2` are in this phase's restoration scope (`minimax-m3` and `mimo-v2.5-pro` are NOT touched).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed registry data: `check-prompt-quality-card-sync.sh`'s `cli_cards[]`, `cli_skills[]`, and `CLI_EXECUTOR_HUB_METADATA` all updated together; `sk-prompt/prompt-models/SKILL.md`'s parallel model-executor table explicitly identified as a NOT-updated consumer and recorded as an Open Question, not silently missed.
- [ ] CHK-FIX-004 [P0] N/A - no security/path/parser/redaction surface changed in this phase; this item is data/doc restoration, not a security fix.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed: 3 sibling models × {`cli-opencode` untouched, `cli-devin` added} = 6 assertions + 1 `swe-1.6` addition + 3 script data-structures = 10 verifiable data points (per `plan.md`'s affected-surfaces section).
- [ ] CHK-FIX-006 [P1] N/A - no test or code in this phase reads process-wide/global state; all changes are static file data.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase 005 implementation commit SHA once landed, not a moving branch-relative diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, tokens, or credentials introduced in `model-profiles.json`, `swe-1.6.md`, or `check-prompt-quality-card-sync.sh`.
- [ ] CHK-031 [P1] No auth/credential surface touched (matches phase 001's read-only, auth-adjacent boundary).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` stay synchronized (same file scope, same REQ IDs referenced consistently).
- [ ] CHK-041 [P1] `swe-1.6.md` documents the sequential-thinking 2-layer pattern (`devin mcp add` + `system_instructions`), explicitly naming the banned top-level `mcp_servers` recipe field as the previously-broken alternative.
- [ ] CHK-042 [P2] `model-profiles.json`'s top-level `version`/`description` updated to mention the `swe-1.6` stub (REQ-009), or explicitly deferred with a documented reason.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the 3 declared files changed (`model-profiles.json`, `swe-1.6.md`, `check-prompt-quality-card-sync.sh`); `git status` shows no drift outside this scope.
- [ ] CHK-051 [P1] No temp/scratch files left behind from verification runs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
- **Predecessor**: `../004-devin-hook-adapter-layer/checklist.md`
- **Successor**: `../006-devin-manual-testing-playbook/checklist.md`
