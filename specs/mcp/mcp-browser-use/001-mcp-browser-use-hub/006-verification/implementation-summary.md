---
title: "Implementation Summary"
description: "Live runs of all three mcp-browser-use modes on macOS, a two-stage routing benchmark, hub-routing scenarios and the alignment check."
trigger_phrases:
  - "verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification"
    last_updated_at: "2026-11-21T18:40:05Z"
    last_updated_by: "generate-context"
    recent_action: "Alignment findings fixed, packet validated"
    next_safe_action: "Land per-phase local commits 002-006"
    packet_purpose: "Purpose: Recorded evidence that each mode works from the new hub, Bladebro included on macOS in both its agent-browser and real-browser lanes, and that routing and connected surfaces agree."
    blockers: []
    key_files:
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md"
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/tasks.md"
    session_dedup:
      fingerprint: "sha256:b1efa2fea86ec3ecbed34f208643e4c40d30af0dc9c31214336413066c6d40fc"
      session_id: "84103bdd-4074-43a6-b7db-ab9ef93e3535"
      parent_session_id: "433fe077-5d40-4bad-953f-18be20938fb8"
    session_ref:
      runtime: "claude"
      sessionId: "123e1c5d-fd97-4045-b198-d3b23df4bbdd"
      workspace: "/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub"
      savedAt: "2026-11-21T18:40:05Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-verification |
| **Completed** | 2026-11-21, with the findings listed under Known Limitations |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each mode of the new hub now has a playbook with a recorded run from 2026-11-21, and Bladebro ran live on macOS. Both routing stages were replayed with real requests and archived as a benchmark. The hub gained its own routing scenarios, which also feed its compiled-routing admission check.

### Phase 6: verification

You can now see, run by run, what each browser mode does on this Mac. Bladebro works in its own isolated browser and through both of its lanes, the CLI and Code Mode. It also drives your running Aside browser through a local debug port, using the sessions Aside already holds. Copying Aside's profile into a second instance does not work. A request for any mode reaches the right mode through both the advisor and the compiled hub router, 6 of 6.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/` | Created | 14 scenarios, one per step of the macOS plan |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/` | Created | The 14-step live run and the attach probe against Aside |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/`, `.../mcp-aside-devtools/benchmark/reports/` | Created | Recorded runs of both moved playbooks, plus an Aside re-run with the app running |
| `.skilled/skills/mcp-browser-use/manual-testing-playbook/` | Created | 7 hub-routing scenarios: one per mode, Lighthouse, the defer contract and two holdouts |
| `.skilled/skills/mcp-browser-use/benchmark/` | Created | The two-stage routing replay and the hub-routing playbook run, with indexes |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modified | The Bladebro and hub playbook roots enrolled after they validated clean |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modified | Its pinned scenario count rises by the 7 new hub scenarios |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | The Python fallback scorer sends browser-debugging boosts to `mcp-browser-use`, and a bare "inspect" no longer expands into browser terms |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl`, `tests/parity/fixtures/local-native-approved-divergences.json`, `tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | Two P0 browser cases relabelled, the divergence ledger recaptured, the Python-correct count re-baselined and one native divergence recorded |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `graph-metadata.json`, `runtime/scripts/skill-graph.json` | Modified | A `browser automation` anchor, the advisor's browser edge pointed at the new hub, and the compiled graph regenerated |
| `.skilled/skills/mcp-browser-use/hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Modified | Five verb-attached DevTools phrases route to Chrome DevTools, carried up into the advisor signals |
| `.skilled/bin/lib/compiled-routing/` and its authored copies | Modified | The hub manifest re-minted, a DevTools canary case added and the rule-bound test extended to the new hub |
| Changelogs, the v4.2.0.0 release notes and five reference docs | Modified | Changelog shape fixed, a Browser Use release section, and the hub counts brought to eight |
| `specs/mcp/mcp-tooling/z_archive/003-mcp-figma-transfer/*/.backup-20260505-*` | Deleted | Three superseded snapshots that failed strict validation after the move |
| `spec.md`, `tasks.md`, `goal.md`, `implementation-summary.md` (this folder) | Modified | Evidence and status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Bladebro 4.8.2 was installed after the operator's yes. Its native binary matched the release sidecar's SHA-256 before it first ran. Steps 1 to 10 ran in the isolated agent profile. The real-browser steps ran later, after the operator widened the scope for one read-only probe of example.com on Aside's signed-in profile, using its cookies only. The playbooks, the Chrome DevTools and Aside runs and the hub-routing scenarios were built by Opus 5.5 medium on the second account. The conducting session checked each claim against a re-run and corrected two that were wrong. The routing benchmark was a script run of the advisor and the compiled front door. The alignment check ran four review lanes on `opencode-go/hy4-flash-free#high` and an Opus critic.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Install Bladebro only here, after an explicit yes | The install changes the machine, and upstream never ran its live probes on macOS |
| A failed run is recorded, not rerouted or retried into a pass | Rerouting would be a 005 change, and a retry would hide the failure |
| Benchmark is the two-stage replay, operator-approved 2026-11-21 | `/create:benchmark` registers only `mcp_promotion`, and the `mcp-tooling` routing harness is retired |
| The real-browser probe used a cookie-only copy of Aside's profile | The operator asked for cookies only. The profile held 4 saved passwords, so its password and autofill stores stayed out of the copy |
| MT-H04's gold changed from `mcp-aside-devtools` to `defer` | Operator decision: with Bladebro in the hub, agentic plus signed-in proof wording fits two modes |
| Bladebro stays installed | Operator decision, so attach mode with Aside stays usable |
| The three moved `.backup-*` snapshots are deleted | Operator decision: CI counts a moved packet as a new failing one. Git history keeps them |
| DevTools phrasing without "Chrome" routes to Chrome DevTools | Operator chose bare `devtools`. Bare `devtools` double-scored "chrome devtools" and broke the two-tool bundle canary, so five verb-attached phrases carry it instead |
| The v4.2.0.0 release notes gain a Browser Use section | Operator decision, on this branch |
| The advisor is tuned so "browser automation" reaches the hub | Operator decision for probe P01 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bladebro 14-step run, macOS arm64 | 12 PASS, 1 FAIL (step 13 in `clone` mode), 1 SKIP (uninstall, declined) |
| Bladebro attach probe on the running Aside | 3 of 3 PASS, `navigator.webdriver=false` |
| Chrome DevTools playbook run | 4 PASS, 1 FAIL (BDG-008) |
| Aside playbook runs | 2 PASS, 2 FAIL, 1 SKIP with the app closed, then 3 of 3 PASS with it running |
| Hub routing scenarios | 6 PASS, 1 FAIL as first run; after the MT-H04 gold change, `compiled-route-admission.cjs --hub mcp-browser-use` reports 7 pass, 0 drift |
| Two-stage routing replay | 6 of 6 PASS, each mode 2 of 2 |
| `validate-playbook-package.cjs` on the four roots | exit 0, 0 violations each |
| `compiled-route-admission.cjs --all`, `compiled-route-guard.cjs` | exit 0 and exit 0, all 8 hubs |
| `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` | 29 of 29 pass |
| `/local-skilled-alignment` | 28 findings after the critic: 1 overturned, the rest fixed or decided. A fresh battery prints 446 pass. Its one open row is the package check, which needs a hoisted `node_modules` and predates this change. The 42 overflow packets pass strict validation, 0 failures |
| Advisor runtime suite | 2570 passed, 8 skipped, exit 0 |
| Python regression suite | 0 failed cases, P0 11 of 11; the case-count gate fails on main too |
| Divergence ratchet | 9 of 9 pass |
| `.skilled/bin` vitest files | 97 of 97 pass |
| Live probes | 7 of 8 pass; P02 is held |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Clone mode does not drive Aside.** A second Aside launched from a copied profile exposes no page target, and its extensions cannot reach the running Aside's local service. Attach mode works instead.
2. **Attach mode opens a local debug port.** While it is open, any local process can drive the signed-in browser. Keep it open only for the length of a task.
3. **No signed-in site was tested.** Cookie-backed access to a real account is shown only by construction: attach drives the live browser and its own session store.
4. **BDG-008 fails on today's example.com,** which no longer serves an `h1`. The scenario's expected signal needs a new page or selector.
5. **Live results are a point in time.** Bladebro ships often, and 4.8.3 is already out. Each run records the version it used.
6. **One native divergence is recorded, not fixed.** For "Run an agentic browser session with aside mcp through Code Mode…", the native scorer scores `mcp-browser-use` higher yet ranks `mcp-code-mode` first. A later ranking step does it.
7. **Probe P02 is held.** "Set up browser MCP orchestration through TypeScript execution" routes to `sk-code`. Its wording is `mcp-code-mode`'s own description, and the critic did not uphold it.
8. **The `browser automation` anchor also takes an Orca prompt.** "Use Orca to run a browser automation…" now routes to `mcp-browser-use`. It routed to `sk-git` before, which was wrong too.
9. **The new hub's compiler does not cap bundle size.** Its siblings cap a bundle at four modes. With three modes nothing exceeds the bound, and the rule-bound test now guards it.
<!-- /ANCHOR:limitations -->

---
