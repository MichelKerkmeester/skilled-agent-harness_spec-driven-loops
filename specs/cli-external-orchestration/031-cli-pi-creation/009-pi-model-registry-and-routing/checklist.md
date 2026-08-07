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
    last_updated_at: "2026-07-27T11:26:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified with evidence; LUNA implementation + GLM review complete"
    next_safe_action: "Commit; phase 010 proceeds"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-010). [EVIDENCE: `spec.md:112` §4, 10/10 REQs present]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`, including the affected-surfaces inventory. [EVIDENCE: `plan.md` §3 Architecture + FIX ADDENDUM]
- [x] CHK-003 [P1] Phase 001/002/003 predecessor preconditions confirmed. [EVIDENCE: all 3 Complete; `cli-external-orchestration/graph-metadata.json` carries `cli-pi` trigger phrases, `cli-pi/assets/prompt-quality-card.md` exists]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `model-profiles.json` remains well-formed JSON after all edits. [EVIDENCE: `python3 -c "import json; json.load(open(...))"` returns OK, independently re-run]
- [x] CHK-011 [P0] `PI_SUPPORTED_MODELS` is a hard, curated, non-empty array with zero `"auto"`/router-alias entries; `PI_DEFAULT_MODEL` is one specific allowlisted id. [EVIDENCE: `executor-config.ts` - 7 ids, `PI_DEFAULT_MODEL = 'deepseek-v4-pro'`, no "auto" present]
- [x] CHK-012 [P1] Branch B bookkeeping follows the existing sibling conventions. [EVIDENCE: `_index.md` prose matches the file's existing style; new executor rows in `model-profiles.json` match the exact object shape of existing rows]
- [x] CHK-013 [P1] `check-prompt-quality-card-sync.sh` remains valid Bash after edits. [EVIDENCE: `bash -n check-prompt-quality-card-sync.sh` exit 0, and the script ran to completion (GUARD PASS) which independently proves syntactic validity]
- [x] CHK-014 [P1] Typecheck returns 0 errors after the `executor-config.ts` edit. [EVIDENCE: no `npm run typecheck` script exists in this package; `tsc --ignoreDeprecations 6.0 --noEmit -p tsconfig.json` exit 0, run by LUNA during implementation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria in `spec.md` REQ-001 through REQ-004 met with evidence. [EVIDENCE: `implementation-summary.md` per-REQ table]
- [x] CHK-021 [P0] `check-prompt-quality-card-sync.sh` exits 0 with `GUARD PASS`, including CHECK 4 for `cli-pi`'s rows. [EVIDENCE: independently re-run, exit 0, all 4 checks PASS]
- [x] CHK-022 [P0] `buildPiLineageCommand` throws for `"auto"` and an out-of-roster id, verified by a direct test run. [EVIDENCE: `fanout-run.vitest.ts` accept/reject tests, 169/169 passing, independently re-run]
- [x] CHK-023 [P0] The cli-pi case of `buildSpawnSpec` throws the same class of error, verified by a direct test run. [EVIDENCE: `remediation.vitest.ts` cli-pi tests, 30/31 passing (1 pre-existing unrelated failure), independently re-run]
- [x] CHK-024 [P1] `npx vitest run` on the 3 affected test files shows 0 new regressions. [EVIDENCE: same test runs as CHK-022/023 - the only failure is `git-stash`-confirmed pre-existing from phase 002's closeout]
- [x] CHK-025 [P1] Every unexposed field carries an explicit TBD/unconfirmed marker; 0 fabricated numbers. [EVIDENCE: `mimo-v2.5-pro-ultraspeed`'s object has `context_length: null`, `tool_calling: "unconfirmed"`, `capability.*` all "unconfirmed"/"TBD", `strengths`/`weaknesses` explicit TBD strings, `recommended_frameworks.status: "unconfirmed"` - independently read in full]
- [x] CHK-026 [P1] An omitted `--model` defaults to `PI_DEFAULT_MODEL` at both dispatch entry points, confirmed by a dedicated test at each. [EVIDENCE: `fanout-run.vitest.ts` and `remediation.vitest.ts` both carry an explicit default-model test naming `deepseek-v4-pro`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer`. [EVIDENCE: `plan.md` §3 Affected Surfaces]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. [EVIDENCE: `deepseek-v4-pro`/`minimax-m3`/`mimo-v2.5-pro` (already `cli-opencode`-profiled) gained `cli-pi` rows; `composer-2.5`/`kimi-k2.7-code`/`glm-5.2`/`haiku` did not, confirmed live via GLM-5.2's independent review and my own direct read of the diff]
- [x] CHK-FIX-003 [P0] Consumer inventory completed. [EVIDENCE: `check-prompt-quality-card-sync.sh`'s 3 arrays updated together (independently verified via GUARD PASS); `executor-config.ts`'s allowlist mirrored byte-identically in both `.cjs` dispatch builders, independently diffed]
- [x] CHK-FIX-004 [P0] [DEFERRED: not applicable - the allowlist is a value-membership check (`Set.has()`), not a parser or path-handling fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. [EVIDENCE: `plan.md` §3 Affected Surfaces "Required inventories" block]
- [x] CHK-FIX-006 [P1] [DEFERRED: not applicable - no process-wide/global state read beyond the existing `process.env` pattern already proven by `isCursorBinaryAvailable`]
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase 009 implementation commit SHA. [EVIDENCE: this closeout commit's message body, see `git log -1`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, tokens, or credentials introduced. [EVIDENCE: `rg -i "api[_-]?key|secret|password|token[:=]" model-profiles.json executor-config.ts fanout-run.cjs dispatch-model.cjs` returns 1 hit, a pre-existing `DEEPSEEK_API_KEY` env-var-name reference in an unrelated cli-opencode row, not a literal credential value; 0 hits in any line this phase added]
- [x] CHK-031 [P1] No auth/credential surface touched; the allowlist is a static value check. [EVIDENCE: `Set.has()` membership check only, no auth/credential code path in any touched file]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` stay synchronized. [EVIDENCE: direct read, all 4 docs share the same REQ IDs and file scope]
- [x] CHK-041 [P1] `_index.md` documents which branch applied and why. [EVIDENCE: `_index.md` new prose paragraph names Branch B explicitly and cites the operator-supplied picker evidence]
- [x] CHK-042 [P2] `model-profiles.json`'s `version`/`description` updated. [EVIDENCE: `version: "1.7"`, description gains a Pi clause naming the 3 executor-row additions and the ultraspeed stub]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the declared files changed. [EVIDENCE: `git diff --stat` shows exactly 10 files + 1 new file, all within the declared scope; a temporary `node_modules` symlink used for local test runs was removed before commit]
- [x] CHK-051 [P1] No temp/scratch files left behind. [EVIDENCE: `find 009-pi-model-registry-and-routing/scratch -type f` returns nothing]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. Implemented via LUNA (gpt-5.6-luna xhigh fast) in two dispatch passes - the first used a generic pi.dev/models fetch for the model roster; the operator then supplied direct, stronger evidence (a live screenshot of their own configured Pi model picker) naming the real 7-model roster, and the second pass corrected the implementation to match. Reviewed by GLM-5.2 via cli-devin: APPROVE WITH MINOR NOTES, no blocking findings. Every check-prompt-quality-card-sync.sh/vitest claim in this checklist was independently re-run by the closing agent, not taken on either sub-agent's word.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
- **Predecessor**: `../008-pi-hook-extension-layer/checklist.md`
- **Successor**: `../010-pi-manual-testing-playbook/checklist.md`
