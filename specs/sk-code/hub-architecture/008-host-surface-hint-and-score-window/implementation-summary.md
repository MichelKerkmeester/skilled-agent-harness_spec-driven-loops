---
title: "Implementation Summary"
description: "Planned, not built. The sk-code hub router ignores a surface hint on a scored route and drops a workflow mode when a surface matches more phrases, and this packet holds the plan for both."
trigger_phrases:
  - "host surface hint and score window implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/008-host-surface-hint-and-score-window"
    last_updated_at: "2026-11-16T13:22:22Z"
    last_updated_by: "generate-context"
    recent_action: "Built the surface hint join and deferred the surface score"
    next_safe_action: "Verify with the operator which surface score T005 builds"
    packet_purpose: "Purpose: A session's surface hint adds its surface to a scored route, and a request that names a workflow mode keeps that mode however many phrases a surface matches."
    blockers:
      - "T005 surface score deferred by the operator"
    key_files:
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"
      - ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs"
      - ".skilled/bin/tests/compiled-route-surface-hint.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-host-surface-hint-and-score-window"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T13:22:22Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-host-surface-hint-and-score-window |
| **Completed** | Partly. The hint parts shipped on 2026-11-16. The surface score is deferred and REQ-002 stays open |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A session hint that names a surface the hub declares as specific now joins a scored sk-code route. `--surface-hint FRONTEND` on `review this function for bugs` routes `sk-code-review, sk-code-frontend, sk-code-skilled`. A hinted prompt that scores nothing routes to the hinted surface, and the same prompt with no hint still defers. The hint is a request fact, so two requests that differ only in the hint have different request hashes.

The surface score is not changed. The operator deferred it after T003 measured both candidates. `review the dark mode toggle and focus trap` still routes `sk-code-frontend` alone, so REQ-002 stays open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modified | `joinHintedSurface` adds the hinted specific surface inside `evaluateCanary`. `buildRequest` records the hint as a `runtime:surface-hint` evidence entry |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modified | Passes the hint into the evaluation for a router that knows its surfaces, then reorders as before |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Two hinted cases |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` twins of the three files above | Modified | Same bytes as the served copies, so `compiled-route-sync.cjs --check` passes. Approved by the operator |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | Five tests: the join, the unscored route, hints that add nothing, the request hash and a host surface placed first |
| `.skilled/bin/README.md` | Modified | What `--surface-hint` does now |
| `.skilled/skills/sk-code/README.md` | Modified | What a host may change in `hub-router.json` until the score is fixed |
| `scratch/` | Created | The measurement script, the before and after routes, the T002 and T003 records and the dispatch briefs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The change was prototyped in the checkout, saved and reverted. A script cut it into six briefs and checked that replaying them over the HEAD bytes rebuilds the prototype byte for byte. Before dispatch, every file the briefs touch still matched the saved HEAD bytes.

DeepSeek v4.1 flash applied each brief through the Mistral Vibe CLI, in order and test first. Each run ended `exit_code= 0 outcome= finished`. After each run, every touched file and twin matched the expected bytes, and the brief's check was rerun by hand. Each authored twin was updated by a plain copy inside its brief, not by the sync build, because that build swaps the whole served directory while other builders work in the checkout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| No surface score is applied | The operator deferred it. Count once fails the existing test `a workflow mode stays first with the shipped surface` and changes the case `visual-review-bundle`. Two windows still drops a second surface beside a surface with three phrases. See `scratch/score-candidates.md` |
| No routing-model field for shared-evidence surfaces | No caller fails without one. Upstream declares one specific surface |
| The hint is an evidence entry of kind `runtime` | `route-request.v1.schema.json` sets `additionalProperties: false`, so a top-level field would break the request contract |
| Any non-empty hint changes the hash | The fact is recorded as the caller gave it, even when it names no surface |
| The join runs inside the evaluation, and the reorder after it | A joined surface changes the route's kind, so the route is validated with it. The reorder then puts the hinted surface first among the surfaces |
| Legacy parity is not a gate | The replay was deleted in `b45ea54cea3`, its harness exits 1 and no workflow runs it. See `scratch/parity-gate.md` |
| `policy.json` and `route-gold.typed.json` are not rebuilt | Both were stale at HEAD and no check reads them. The build script also rewrites the activation manifests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` at HEAD | `tests 15`, `pass 15`, `fail 0` |
| The same, after brief 01 | `tests 20`, `pass 16`, `fail 4`, the four new behavior tests |
| The same, final | `tests 20`, `pass 20`, `fail 0` |
| `node --test .skilled/bin/tests/` at HEAD | `tests 191`, `pass 189`, `fail 1`, `skipped 1` |
| The same, final | `tests 196`, `pass 194`, `fail 1`, `skipped 1`. The failure is `the live corpus holds the pinned number of gold scenarios` (`82 !== 85`). It fails the same way at HEAD |
| `compiled-route.cjs --hub sk-code --surface-hint FRONTEND --prompt "review this function for bugs"` | `route surfaceBundle sk-code-review,sk-code-frontend,sk-code-skilled` |
| `probe-routes.cjs` for the hinted `add a filter to the table` | `action: route`, `sk-code-frontend`. Unhinted, the front door prints `defer` |
| `diff scratch/routes-before.txt scratch/routes-after.txt` | Only the two added hinted cases |
| `compiled-route-sync.cjs --check` | Exit 0, `all 55 served copies match their authored files` |
| `compiled-route-sync.cjs --verify` | Exit 0, `move-simulation OK: all 7 hubs resolve` |
| `compiled-route-guard.cjs` | Exit 0, `All hubs fresh or excused` |
| `sk-code-setup-check.cjs` | Exit 0, `STATUS=OK legs=9` |
| `quality-gate.cjs` on the router, the engine and the test | `gate=NO_BLOCKER_FOUND exit=0` |
| `validate.sh --strict` | Not run here. The orchestrator runs it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep 3` leaves three archives in `logs/archive`. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **REQ-002 stays open.** A surface that matches several phrases still drops a workflow mode that matched one. The sk-code README says what a host may change in `hub-router.json` meanwhile.
2. **Follow-ups outside the Files to Change list.** These describe the hint as a reorder only and were left untouched:
   - the comment on `resolveRoute` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
   - `.skilled/skills/sk-code/shared/references/stack-detection.md` line 66
   - `.skilled/skills/sk-code/SKILL.md` line 94
   - `.skilled/skills/sk-code/ROUTER.md` line 37
   - the title of the test `a hint the prompt did not match, UNKNOWN or an unknown name changes nothing`, which still passes
3. **One host-surface test keeps the old reading.** `SKILLED alone still routes when a hub also declares another surface` passes a WEBFLOW hint to the reorder only. In serving, that hint now joins the webflow surface.
4. **A future score change would leave `router-replay-lib.cjs` behind.** Leg 4 of `verify-router-sync.cjs` keeps its own scorer, and nothing compares the two.
<!-- /ANCHOR:limitations -->

---


