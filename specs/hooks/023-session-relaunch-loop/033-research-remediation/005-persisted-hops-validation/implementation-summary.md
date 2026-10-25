---
title: "Implementation Summary"
description: "shouldRelaunch now accepts a persisted hop count only when it is a non-negative integer number, so a null, string, negative or fractional count can no longer slip under the hop cap."
trigger_phrases:
  - "persisted hops validation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation"
    last_updated_at: "2026-10-25T13:42:31Z"
    last_updated_by: "builder"
    recent_action: "Tightened the hop check and recorded evidence"
    next_safe_action: "Orchestrator commits and pins the SHA"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-persisted-hops-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-persisted-hops-validation |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunch record whose hop count is not a non-negative integer number no longer relaunches. Before this change `shouldRelaunch` coerced the stored count with `Number()`, so null became 0, "3" became 3, and -1 or 1.5 passed as finite values below the cap.

### Phase 5: persisted-hops-validation

The hop gate now reads `record.hops` as stored and declines with the existing `hop-cap` reason unless the value is a number type, an integer and zero or more, and below the limit. The reason is unchanged, so the `skilled-loop` wrapper and every other reader of the decision need no change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `shouldRelaunch` hop check: typeof, integer and non-negative test instead of coercion |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Added "shouldRelaunch declines malformed persisted hops" (7 subtests) and "shouldRelaunch accepts hop zero below the default cap" |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Producers were read first. `preparePending` defaults `hops = 0` at `relaunch-core.cjs:741` and writes it into the record at `:756`. The CLI prepare path reads `SKILLED_LOOP_HOPS` with `Number()` and throws unless the result is a non-negative integer (`bin/session-relaunch.cjs:497-498`), then passes that number to `preparePending` at `:532`. Both write a number, so the number-type rule is safe.

The table test was written first and run red (`scratch/red-before.txt`, exit 1): negative, fractional, null and numeric string failed, NaN, Infinity and missing passed. After the code change all 19 `shouldRelaunch` tests passed (`scratch/green-after.txt`, exit 0).

Consumers: `bin/session-relaunch.cjs:593` reads the decision reason, which stays `hop-cap`. `nudge.cjs:466` (`armedRecordStillCurrent`) reads only whether the reason is `stale`, and the stale check runs before the hop check, so it is unaffected. `killer.cjs:693-694` still coerces with `Number()` for its own signal decision; it is not a consumer of `shouldRelaunch`, so for a null or "3" record the killer still ends the session and the wrapper then declines with `hop-cap`, printing the manual relaunch command.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the `hop-cap` reason | Every consumer already handles it, so no wrapper or adapter change is needed |
| Reject numeric strings rather than parse them | No producer writes a string, so a string count can only come from a malformed or hand-edited record |
| Leave `killer.cjs` alone | It decides only whether to signal; the wrapper still refuses the relaunch, and the file is outside this phase's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `node --test` relaunch suites plus plugin test | PASS, 868 pass 0 fail, exit 0 (`scratch/baseline-node.txt`) |
| Same command after the change | PASS, 877 pass 0 fail, exit 0 (868 + 9 new) (`scratch/after-node.txt`) |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` alone | PASS, 828 pass 0 fail, exit 0 |
| Baseline vitest Pi adapter | PASS, 54/54, exit 0 |
| Vitest Pi adapter after the change | 55 pass 4 fail of 59, exit 1. The 5 new tests and 4 failures are agent_settled tests another builder added to the Pi test file during this run; none touch hops |
| `node --check` on both changed files | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **killer.cjs still coerces hops.** A null or "3" record still lets the killer end the session; the wrapper then declines and the operator relaunches by hand. Tightening the killer is a separate change.
2. **Changelog not refreshed.** The phase context asks for a `../changelog/` refresh on close, which is outside this builder's write scope.
<!-- /ANCHOR:limitations -->

---
