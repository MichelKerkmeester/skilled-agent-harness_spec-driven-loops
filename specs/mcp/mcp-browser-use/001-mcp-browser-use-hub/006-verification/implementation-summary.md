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
    last_updated_at: "2026-11-21T23:07:38Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed 3 review P1s and 7 P2s; gates match baseline"
    next_safe_action: "Await operator call on 5 deferred routing findings"
    packet_purpose: "Purpose: Recorded evidence that each mode works from the new hub, Bladebro included on macOS in both its agent-browser and real-browser lanes, and that routing and connected surfaces agree."
    blockers: []
    key_files:
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md"
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/tasks.md"
    session_dedup:
      fingerprint: "sha256:9a9bec8307c5c8c7babd8dde2c0dc6dff0bc2fa60cb5d65b6b533ad9eb8a0f7d"
      session_id: "84103bdd-4074-43a6-b7db-ab9ef93e3535"
      parent_session_id: "433fe077-5d40-4bad-953f-18be20938fb8"
    session_ref:
      runtime: "claude"
      sessionId: "bec0c49b-26aa-4dee-92d7-8f33fa351357"
      workspace: "/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub"
      savedAt: "2026-11-21T23:07:38Z"
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
| `010-mcp-browser-use/lib/router.cjs` and `fixtures/canary-cases.v1.json`, authored under `specs/sk-doc/z_archive/…/009-parent-hub-rollout/` and promoted under `.skilled/bin/lib/compiled-routing/`; the authored `compiled/route-gold.typed.json` and `activation/acceptance.json` rebuilt | Modified | Deep-review fix: a reject comes only from the `forbidden` constraint, and a 403 Forbidden canary pins it |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md` and the playbook root's BB-014 summary | Modified | Deep-review fix: the teardown removes only the doctor-reported root after the named-session confirmation |
| `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing--post-review/` and the reports index | Created, Modified | Deep-review fix: a PASS run that supersedes the FAIL hub-routing record |
| `.skilled/skills/mcp-browser-use/README.md`, the Bladebro install and wiring references, the Lighthouse catalog entry, `../005-routing-and-surfaces/` summary and spec, the parent `spec.md` | Modified | Deep-review P2 fixes to stale prose and status rows |
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
| The router fix lands in the authored bundle and only its two files are promoted | The authored file is the producer. A full `compiled-route-sync.cjs` rebuild would also overwrite the unrelated `007-sk-doc` drift that predates this branch |
| The four sibling hub routers keep their own `text.includes('forbidden')` | They predate this branch; a separate follow-up owns them |
| Deep-review R1-P1-001 downgraded to P2 and not changed | Replay showed no misroute: "chrome live manual" already reaches the hub, and sk-code owns "core web vitals" at stage one. Declaring the first in `ROUTER.md` captured an out-of-domain prompt. Dropping both from `hub-router.json` would change the policy hash, so it is the operator's call |
| Deferred P2s that change routing behavior or the policy hash: R1-P2-001 (outcome list), C2-I1-P2-001 (bare `aside` substring), C2-I1-P2-002 (weights and delta), R4-P2-001 | Each needs a `hub-router.json` or `SKILL.md` edit, which re-mints the manifest. R4-P2-001 also points the wrong way: the changelog matches the repo's stage naming, and `SKILL.md` and `README.md` are the ones that call `hub-router.json` stage one |
| Deferred P2s on Bladebro security design: C2-I2-P2-002 (npm launcher integrity), C2-I2-P2-003 (default `auto` lane), R2-P2-001 (sidecar source) | Each changes a security gate or consent default. The sidecar's download URL is not recorded anywhere in the packet, so the step cannot be written without guessing it |
| Out of scope: R2-P2-003 (`sudo` hint), C2-I4-P2-001 and C2-I4-P2-002 (spec-kit sub-track invariants) | The installer line moved unchanged from `mcp-tooling`. The spec-kit items change shared infrastructure every packet uses |
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
| Deep review, two lineages of five iterations | CONDITIONAL: 0 P0, 4 P1, 17 P2; every terminal gate passes (`../review/review-report.md`) |
| 403 Forbidden canary before and after the router fix | Before: `action reject but expected route`. After: 15 cases built, policy hash unchanged at `8793753e…` |
| Hub-routing re-run after the fixes | 7 of 7 PASS plus the canary probe; admission 7 pass, 0 drift |
| Gates after the remediation | admission `--all` and guard exit 0; sync `--check` exit 1 on the pre-existing `007-sk-doc` file only, as before; parent-skill-check 0 warnings; intent-signal check PASSED; advisor suite 2570 passed; `.skilled/bin` node tests 195 pass and 1 fail, as before; `.skilled/bin` vitest 97 of 97; both edited playbook roots 0 violations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Clone mode does not drive Aside.** A second Aside launched from a copied profile exposes no page target, and its extensions cannot reach the running Aside's local service. Attach mode works instead.
2. **Attach mode opens a local debug port.** While it is open, any local process can drive the signed-in browser. Keep it open only for the length of a task.
3. **No signed-in site was tested.** Cookie-backed access to a real account is shown only by construction: attach drives the live browser and its own session store.
4. **BDG-008 fails on today's example.com,** which no longer serves an `h1`. The scenario's expected signal needs a new page or selector.
5. **Live results are a point in time.** Bladebro ships often, and 4.8.3 is already out. Each run records the version it used.
6. **The Code Mode bonus no longer outranks a named MCP.** For "Run an agentic browser session with aside mcp through Code Mode…", the native scorer used to score `mcp-browser-use` higher yet rank `mcp-code-mode` first, because a "code mode" bonus applied at ranking time. The bonus now skips a prompt that names another MCP (`<name> mcp`), so `rr-hub6-204` reaches `mcp-browser-use` and the Mobbin row `rr-hub6-207` reaches `mcp-tooling`. The corpus parity pin moved from 113 to 114, the full-corpus baseline from 159 to 161, and `rr-hub6-207` is now ledgered as a native improvement the Python reference does not share. All 196 advisor test files pass.
11. **A browser automation test belongs to `sk-code`.** The `browser automation` anchor also took test-authoring prompts such as "fix the flaky browser automation test in our ci suite". An `automation test` anchor now hands those back to `sk-code`, while P01, the Orca prompt and plain browser automation requests still reach `mcp-browser-use`.
7. **Probe P02 is held.** "Set up browser MCP orchestration through TypeScript execution" routes to `sk-code`. Its wording is `mcp-code-mode`'s own description, and the critic did not uphold it.
8. **The `browser automation` anchor also takes an Orca prompt.** "Use Orca to run a browser automation…" now routes to `mcp-browser-use`. It routed to `sk-git` before, which was wrong too.
9. **The new hub's compiler does not cap bundle size.** Its siblings cap a bundle at four modes. With three modes nothing exceeds the bound, and the rule-bound test now guards it.
10. **Eleven deep-review findings stay open by decision.** They are listed under Key Decisions, each with its reason. Five of them change routing or the policy hash and wait for the operator.
<!-- /ANCHOR:limitations -->

---
