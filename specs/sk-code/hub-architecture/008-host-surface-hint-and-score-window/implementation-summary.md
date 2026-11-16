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
    last_updated_at: "2026-11-16T16:25:42Z"
    last_updated_by: "generate-context"
    recent_action: "Built the two windows surface score and corrected the stale hint descriptions"
    next_safe_action: "Verify with the operator whether the all-five-modes route needs a bundle rule"
    packet_purpose: "Purpose: A session's surface hint adds its surface to a scored route, and a request that names a workflow mode keeps that mode however many phrases a surface matches."
    blockers: []
    key_files:
      - ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs"
      - ".skilled/bin/tests/compiled-route-surface-hint.test.cjs"
      - ".skilled/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:424a481f8cc3390f99cafcaac7bbc7ffbe1e1079bf2ed9feec844ec26fbcf13d"
      session_id: "scaffold-008-host-surface-hint-and-score-window"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T16:25:42Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
| **Completed** | 2026-11-16. The hint parts shipped first. The two-window surface score shipped later the same day |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A session hint that names a surface the hub declares as specific now joins a scored sk-code route. `--surface-hint FRONTEND` on `review this function for bugs` routes `sk-code-review, sk-code-frontend, sk-code-skilled`. A hinted prompt that scores nothing routes to the hinted surface, and the same prompt with no hint still defers. The hint is a request fact, so two requests that differ only in the hint have different request hashes.

The router now selects workflow modes and surfaces in two windows, as the operator chose on 2026-11-16. Each kind keeps the modes within `ambiguityDelta` of its own top score. The two sets are then joined. `review the dark mode toggle and focus trap` routes `sk-code-review, sk-code-frontend`, so REQ-002 is met. `scoreModes` is unchanged. No case in `canary-cases.v1.json` changed its route. Playbook scenario CB-CR-007 now routes `sk-code-quality` plus `sk-code-ci` at stage one, which is the cost the operator accepted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modified | `joinHintedSurface` adds the hinted specific surface inside `evaluateCanary`. `buildRequest` records the hint as a `runtime:surface-hint` evidence entry. `selectNearTiedByKind` keeps workflow modes and surfaces each within `ambiguityDelta` of their own top score |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modified | Passes the hint into the evaluation for a router that knows its surfaces, then reorders as before |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modified | The comment on `resolveRoute` says the hint adds a declared specific surface and orders it first |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Two hinted cases and one case for the review mode kept beside a frontend surface |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modified | Re-minted, because `SKILL.md` and `ROUTER.md` are hashed inputs of the compiled policy |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` twins of the five files above | Modified | Same bytes as the served copies, so `compiled-route-sync.cjs --check` and the guard pass. Approved by the operator |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | Seven tests: the join, the unscored route, hints that add nothing, the request hash, a host surface placed first, the kept workflow mode and the one-kind window. One title now names what its body checks |
| `.skilled/bin/README.md` | Modified | What `--surface-hint` does now |
| `.skilled/skills/sk-code/README.md` | Modified | How the two windows select and what a host may change in `hub-router.json` |
| `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/ROUTER.md` and `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Each says the hint adds a specific surface to the route and orders it first among the surfaces |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/quality-ci-surface-evidence-compiled-routing.md` | Modified | CB-CR-007 now expects the `surfaceBundle` of `sk-code-quality` and `sk-code-ci`, with the fresh manifest digest |
| `scratch/` | Created | The measurement script, the before and after routes, the T002 and T003 records, the CB-CR-007 run and the dispatch briefs |

The rows for `resolve.cjs`, the activation manifest, `SKILL.md`, `ROUTER.md`, `stack-detection.md` and CB-CR-007 sit outside the Files to Change list in `spec.md`. The build request for T005 named them.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The change was prototyped in the checkout, saved and reverted. A script cut it into six briefs and checked that replaying them over the HEAD bytes rebuilds the prototype byte for byte. Before dispatch, every file the briefs touch still matched the saved HEAD bytes.

DeepSeek v4.1 flash applied each brief through the Mistral Vibe CLI, in order and test first. Each run ended `exit_code= 0 outcome= finished`. After each run, every touched file and twin matched the expected bytes, and the brief's check was rerun by hand. Each authored twin was updated by a plain copy inside its brief, not by the sync build, because that build swaps the whole served directory while other builders work in the checkout.

The surface score came in a second build the same way, as briefs 07 to 17. Brief 07 added the kept-mode test, which failed as planned. Brief 08 changed the router. Brief 09 added the kept-mode case. Briefs 10 to 15 fixed the five places that still called the hint a reorder only and wrote the README paragraph. Brief 16 ran the documented re-mint, `compiled-route-manifest.cjs refresh --hub sk-code`, and copied the manifest to its twin. Two runs in the prototype wrote the same bytes and touched no other file. Brief 17 rewrote CB-CR-007 with the digest the re-mint printed. All eleven runs matched their expected bytes on the first dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Two windows is the surface score | The operator chose it on 2026-11-16 and accepted its cost. It keeps a workflow mode beside a surface with more phrases and changes no case in the case file. A surface with several phrases can still drop a second surface with fewer. See `scratch/score-candidates.md` |
| `scoreModes` is unchanged | Other code reads it, so the windows apply in the selection inside `evaluateCanary`. A direct command match scores every matched mode at the top, so both windows keep all of them as one window did. No sk-code mode declares a command today, so that branch is not exercised on the live hub |
| The activation manifest is re-minted, not the closure rebuilt | `SKILL.md` and `ROUTER.md` are hashed inputs of the compiled policy. Their edits made the manifest stale and the guard failed. The documented refresh rewrites one file. Its twin is a copy |
| CB-CR-007 follows the bundle form of CB-CR-001 | `expected_workflow_mode` becomes `sk-code-quality+sk-code-ci`, so the admission check now needs both targets. `expected_resources` and the typed leaves stay, because the stage-two replay did not change |
| The test `SKILLED alone still routes when a hub also declares another surface` is unchanged | Its assertions call the reorder only. They hold for that step. See Known Limitations |
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
| The same, after brief 03 | `tests 20`, `pass 20`, `fail 0` |
| The same, after brief 07 | `tests 22`, `pass 21`, `fail 1`, the new test `a workflow mode stays beside a surface that matched several phrases` |
| The same, final | `tests 22`, `pass 22`, `fail 0` |
| `node --test .skilled/bin/tests/` at HEAD | `tests 191`, `pass 189`, `fail 1`, `skipped 1` |
| The same, after the hint build | `tests 196`, `pass 194`, `fail 1`, `skipped 1`. The failure is `the live corpus holds the pinned number of gold scenarios` (`82 !== 85`). It fails the same way at HEAD |
| The same, before the score build | `tests 196`, `pass 195`, `fail 0`, `skipped 1`. The pin was fixed outside this packet |
| The same, final | `tests 198`, `pass 197`, `fail 0`, `skipped 1` |
| `compiled-route.cjs --hub sk-code --prompt "review the dark mode toggle and focus trap"` | `route surfaceBundle sk-code-review,sk-code-frontend` |
| `probe-routes.cjs` for `review the dark mode toggle and focus trap` | `targets: sk-code-review, sk-code-frontend` |
| Live route of every prompt in the `measure-candidates.cjs` corpus against its two-windows column | 35 rows, 0 mismatches |
| `compiled-route.cjs --hub sk-code --surface-hint FRONTEND --prompt "review this function for bugs"` | `route surfaceBundle sk-code-review,sk-code-frontend,sk-code-skilled` |
| `probe-routes.cjs` for the hinted `add a filter to the table` | `action: route`, `sk-code-frontend`. Unhinted, the front door prints `defer` |
| `diff scratch/routes-before.txt scratch/routes-after.txt` | Only the three added cases, two hinted and one for the kept mode. The 12 existing routes are unchanged |
| `compiled-route-sync.cjs --check` | Exit 0, `all 55 served copies match their authored files` |
| `compiled-route-sync.cjs --verify` | Exit 0, `move-simulation OK: all 7 hubs resolve` |
| `compiled-route-guard.cjs` | Exit 0, `All hubs fresh or excused`. After the `SKILL.md` and `ROUTER.md` edits it exited 1 with `Re-mint: sk-code` until the re-mint |
| `compiled-route-admission.cjs --all` | Exit 0, `Every hub passes the admission check`. sk-code `9 pass, 0 drift, 0 stale, 0 n/a`, before and after |
| `validate-compiled-routing-scenarios.cjs` on the sk-code compiled-routing folder, `--strict` | Exit 0, `PASS  CB-CR-007 ... shape=surfaceBundle`, `pass=9 fail=0 skip=0 total=9` |
| The CB-CR-007 command sequence | Status `compiled`, stage one `surfaceBundle` with `sk-code-quality` then `sk-code-ci`, stage two `["CI_WORKFLOW"]` with the four CI references. See `scratch/cb-cr-007-run.txt` |
| `verify-router-sync.cjs` | Exit 0, `router-sync: 5/5 checks passed`, the same output before and after |
| `run-all-drift-guards.sh` and `ci-skill-derived-freshness.cjs` | Exit 0, `all 4 guards PASSED` and `checked=14 fresh=14 stale=0` |
| Advisor and bin vitest suites, the doctor, quality, benchmark and surface tests | `48 passed`, `77 passed`, `102`, `154`, `11` and `55` pass with `fail 0`, the same counts as before |
| `sk-code-setup-check.cjs` | Exit 0, `STATUS=OK legs=9` |
| `quality-gate.cjs` on the router, the engine and the test | `gate=NO_BLOCKER_FOUND exit=0` |
| `quality-gate.cjs` on the router, `resolve.cjs` and the test, final | `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0` |
| `validate.sh --strict` | Not run here. The orchestrator runs it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep 3` leaves three archives in `logs/archive`. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A surface with several phrases still drops a second surface with fewer.** `fix the typescript dark mode toggle and focus trap` scores frontend 12 and skilled 4 and routes `sk-code-frontend` alone. A host surface is dropped the same way beside the frontend surface. The sk-code README says a host may lower a surface's `weight` or raise `routerPolicy.ambiguityDelta`.
2. **Two windows can build a route of five targets that the policy has no rule for.** The prompt `quality review of .github/workflows/ci.yml and the github actions workflow, the dark mode toggle css, and the typescript vitest checks` scores skilled 8, ci 8, frontend 8, quality 4 and review 4. The evaluation throws `BUNDLE_NOT_IN_POLICY`, so `resolveRoute` returns null and the caller falls back to legacy routing. Before the change one window kept the three surfaces and routed them. The compiler writes bundle rules for two to four modes only. One window reached five targets only when all five modes tied.
3. **One host-surface test keeps the old reading.** `SKILLED alone still routes when a hub also declares another surface` evaluates without the hint and then reorders. So its WEBFLOW case asserts `sk-code-skilled` alone. In serving the WEBFLOW hint joins: the same prompt with the hint passed into the evaluation routes `sk-code-webflow, sk-code-skilled`. The assertion holds for the reorder step it calls. The test `a hinted host surface joins as the first surface after the workflow modes` covers the join, so the test is unchanged.
4. **`router-replay-lib.cjs` keeps its own scorer.** Leg 4 of `verify-router-sync.cjs` uses it. Nothing compares it with the compiled selection.
5. **A commit may make the CB-CR-007 digest stale.** `evidence_manifest_digest` is the sha256 of the sk-code activation manifest, the `manifestFingerprint` that `compiled-route-status.cjs` prints. The pre-commit hooks may raise doc versions and re-mint the manifest. A version bump in `SKILL.md` or `ROUTER.md` would change the policy hash and so the digest. `validate-compiled-routing-scenarios.cjs` checks only that the field is present, so nothing fails when it goes stale.
<!-- /ANCHOR:limitations -->

---


