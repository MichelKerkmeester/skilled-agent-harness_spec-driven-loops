---
title: "Implementation Plan: Live Verification and Closeout"
description: "Run real DeepSeek-direct and boundary-model sessions against the vendored patched deep-pi, resolve the REQ-003 decision, and reconcile all 006 docs to Complete."
trigger_phrases:
  - "deep-pi live verification plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's confirmed findings closed; RPC mode followed up"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Live Verification and Closeout

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A — live Pi session verification, not code |
| **Framework** | Pi CLI (`pi --print --session-id ...`) |
| **Storage** | N/A |
| **Testing** | Manual: live session output inspection |

### Overview
Run a real `deepseek/deepseek-v4-flash` session against the vendored, patched fork; run boundary-model and non-DeepSeek sessions to confirm no regression; resolve REQ-003; reconcile every doc in the 006 subtree (three phases plus the parent) to its true final state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 complete: vendored extension resolves via `pi list`

### Definition of Done
- [x] Live DeepSeek-direct session confirms clean operation (counter-value observation limited by a real tooling gap — see Known Limitations in `implementation-summary.md`)
- [x] Live boundary/non-DeepSeek sessions confirm no regression (2 of 3 live-tested; the third confirmed via phase 1's source-level test due to a missing API key, not this phase's doing)
- [x] REQ-003 decision recorded and phase 1's blocked tasks closed accordingly
- [x] All 006 docs (three phases + parent) reconciled; `validate.sh --recursive --strict` passes 0/0 on the whole subtree
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same live-verification methodology phases 003/004/005 already used: real `pi --print --session-id <name> --model <provider>/<id>` sessions, inspecting genuine command output rather than trusting the unit-test suite alone.

### Key Components
- **Live DeepSeek-direct check**: a `deepseek/deepseek-v4-flash` session with a real API credential, `/deeppi` output inspected for the new counter fields
- **Live boundary check**: `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` sessions confirming no warning and no activation, matching phase 004's original boundary
- **REQ-003 closeout**: read the operator's decision, update phase 1's `spec.md` §7 and `tasks.md` T004/T007 accordingly
- **Doc reconciliation**: Status fields, Phase Documentation Map, `graph-metadata.json` across the whole 006 subtree

### Data Flow
Each live session round-trips through the vendored `.pi/extensions/deep-pi/` exactly as a real operator session would — no test doubles, no mocked provider.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 2 (`002-vendor-and-repoint`) is Complete before proceeding

### Phase 2: Core Implementation
- [x] Live `deepseek/deepseek-v4-flash` session completed cleanly (real "OK" response); zero new `pi-cache-optimizer` stats entries, guard still holds with `deep-pi` vendored. `/deeppi`'s counter output wasn't directly observable via `pi --print` (confirmed via session-file inspection — `ctx.ui.notify()` doesn't persist there), substituted with phase 1's unit-test proof
- [x] Live regression check: `opencode-go/deepseek-v4-flash` (67→68) and `openai-codex/gpt-5.6-luna` (92→93) both confirmed live, unaffected. `opencode/deepseek-v4-flash-free` had no configured API key at verification time — substituted phase 1's new source-level eligibility test

### Phase 3: Verification
- [x] REQ-003 already resolved in phase 1: implemented, not cut
- [x] All three phases' `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` updated to Complete with real evidence
- [x] Parent `006-fork-and-improve-deep-pi/spec.md`'s Phase Documentation Map and `graph-metadata.json` updated
- [x] `validate.sh --recursive --strict` on the whole 006 subtree: 0 errors, 0 warnings
- [x] HANDOFF `gpt-5.6-sol` review's 2 confirmed findings against this phase closed: the "Partially met" approval-language gap on REQ-007/REQ-008 (resolved by citing the governing `/goal` directive's own standing disclosure instruction as the approval basis), and the missed `pi --mode rpc` observation path (followed up directly — status-bar signal confirmed observable via `extension_ui_request`, full report body still not confirmed, recorded as a genuine residual limitation rather than closed prematurely)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual smoke | DeepSeek-direct session with the vendored fork active | `pi --print` sessions |
| Manual regression | Boundary and non-DeepSeek models stay excluded | `pi --print` sessions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 (`002-vendor-and-repoint`) complete | Internal (this packet) | Green (Complete, confirmed before this phase's own work began) | A live test against an unvendored extension proves nothing about the actual deliverable |
| Live DeepSeek API access | External | Green (already confirmed working in phases 003/004/005) | Not a new dependency this phase introduces |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The live smoke test or regression check surfaces a real defect
- **Procedure**: Revert `.pi/settings.json`'s `packages` entry for `@arter/deep-pi` back to `npm:@arter/deep-pi@1.0.0` (phase 2's rollback path). Report the specific failure back to phase 1 for a fix, rather than reconciling docs to Complete on a failing check.
<!-- /ANCHOR:rollback -->
