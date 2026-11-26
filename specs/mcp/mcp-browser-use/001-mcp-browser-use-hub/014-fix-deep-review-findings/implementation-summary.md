---
title: "Implementation Summary: Phase 14: fix-deep-review-findings"
description: "Every finding of the 2026-11-24 deep review is fixed at its source: installer parity is green, installs are pinned and gated, Aside and Bladebro docs match their live results, and the advisor no longer lifts the browser hub on out-of-domain prompts."
trigger_phrases:
  - "fix deep review findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings"
    last_updated_at: "2026-11-24T08:30:00Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 014: scorer fix landed, every acceptance row Met"
    next_safe_action: "Commit the two changes, then run the follow-up deep review"
    packet_purpose: "Purpose: Every finding in the review registry is fixed at its source, so the installer parity test passes and a follow-up deep review can record `checklist_evidence` as pass."
    blockers: []
    key_files:
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/spec.md"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-fix-deep-review-findings"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "1b110a41-65f6-4fde-b664-519810b2fcde"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-24T06:19:01Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 14: fix-deep-review-findings

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-fix-deep-review-findings |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The installer parity test is green again, and no browser doc or script fetches a package without an exact version and an operator yes. The skill advisor no longer recommends the browser hub for out-of-domain prompts such as "set that aside and fix the failing unit test".

### Phase 14: fix-deep-review-findings

The 2026-11-24 deep review of phases 001 to 013 returned FAIL with 2 P1 and 18 P2 defects. Five lanes fixed them in their source files: the shared installer helper, the Chrome DevTools pin, the Aside capture docs, the Bladebro install gate and the hub routing vocabulary, plus the packet docs that lagged behind the tree.

Narrowing the hub's aliases cleared stage two, but stage one, the advisor, still returned the hub at 0.82 on eight out-of-domain prompts. The operator widened the scope to the shared advisor scorer (Q001). Its task-intent confidence floor lifted any skill with one shared word to 0.82. The floor now needs the prompt to name the skill: an explicit-lane hit, a declared lexical hint, a lexical score of 0.45 or more, or the noun the skill id ends in. A bare `har` no longer anchors the hub, and a bare "performance trace" no longer lifts it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `mcp-chrome-devtools/scripts/_utils.sh` | Modified | Identical helper copies, so the parity test passes |
| `mcp-chrome-devtools/` install script, docs and `changelog/` (v1.0.27.0 restored, v1.0.28.0 added) | Modified/Created | Pin `browser-debugger-cli@0.6.10` |
| `mcp-aside-devtools/` SKILL.md, README, catalog, example, playbook root, `changelog/v1.1.13.0.md` | Modified/Created | Capture guidance that matches the live result, the `./tmp` example default, a derived census |
| `mcp-bladebro/` SKILL.md, install and doctor scripts, BB-015, ClickUp report, `changelog/` | Modified/Created | The npx gate, `--ignore-scripts` with a launcher digest check, the Chrome 136+ precondition, honest evidence citations |
| Hub root `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `changelog/`, `benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/` | Modified/Created | The own-Chrome rule, narrower aliases, wider tie-break vocabulary and the 49-row replay |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{fusion.ts,scoring-constants.ts,lanes/explicit.ts,lanes/lexical.ts}` | Modified | The anchored task-intent floor, no bare `har`, the narrower performance-trace lift |
| Advisor `scorer-eval-baseline.json`, `command-routing-baseline.json`, `doctor-prompts.jsonl`, `local-native-approved-divergences.json`, `python-ts-parity.vitest.ts` | Modified | Re-pins the operator approved (Q003, Q004) |
| Advisor `SKILL.md` and `changelog/v2.0.2.0.md` | Modified/Created | Version 2.0.2.0 |
| Parent `spec.md`, `goal.md`, `graph-metadata.json`, and the 001, 003, 004, 005 and 011 docs | Modified | Packet state that matches the tree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five opus-medium lanes owned disjoint file lists and ran in parallel. The orchestrating session closed the dependent packet docs and owned the scorer under Q001. Each scorer variant was scored in-process from the TypeScript source with a scratch harness that reproduced the committed ratchet numbers exactly before any edit. A first gate that needed an explicit-lane hit dropped five ratchet metrics, so it was rejected. The landed gate changed one accuracy metric, and the full suite showed four pinned slices that moved. The operator asked for a narrower anchor, and variant E restored every real routing loss while keeping all 18 out-of-domain fixes.

The runtime was then built with `npm run build`, the dist record contract test passed, and the live advisor CLI served the new build. Baselines were re-captured only through their own capture scripts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the shared advisor scorer instead of superseding AC-018 and AC-020 (Q001) | The leak came from the scorer's confidence floor, not from the hub's vocabulary, so no hub edit could clear stage one |
| Anchor the floor on four signals that name the skill, not on an explicit-lane hit alone | The explicit-only gate cost deep-loop, typed `/create:` and bare "doctor" requests that name their skill through lexical hints or the id noun |
| Re-baseline `unknown_count` 13 to 14 (Q003) | The one moved corpus row was already wrong and now abstains, and no correct answer changed |
| Re-pin the command slice, one doctor row and three ledger rows (Q004) | Each moved toward the expected answer, or ranked the exact command a prompt names above a hub it reached on one shared word |
| Close the ClickUp evidence finding by disclosure | A live rerun needs an operator-approved browser session, and no finding needs it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/bin/tests/mcp-installers.test.cjs` | PASS: `pass 5`, `fail 0` |
| `parent-skill-check.cjs .skilled/skills/mcp-browser-use` | PASS: `OK`, 0 warnings |
| Playbook validators for the three modes | PASS: each `violations=0 warnings=0` |
| Two-stage replay, 49 rows, through the advisor CLI and the compiled front door | 48 PASS, 1 FAIL (MBU-PB-04, stage one only) |
| Advisor accuracy ratchet | Full 161/196, holdout 49/63, ambiguity 21/24, review 25, memory save 27, delegation 22, false fires 5, all held. Unknown 13 to 14, approved |
| Full advisor suite, `npx vitest run` | 2,737 passed, 4 skipped, 1 failed. The failure is the known empty `system-skilled-bots` folder, the same single failure as before |
| `compiled-route-guard.cjs --json` | PASS: 8 hubs fresh, 0 failures |
| `quality-gate.cjs` on the scorer files | `NO_BLOCKER_FOUND`, 0 findings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MBU-PB-04 misses at stage one.** "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM" gets no advisor recommendation, while the front door routes it to Chrome DevTools. Name Chrome DevTools in the request until the advisor learns that phrasing.
2. **A request that names a skill by one shared word may now abstain.** The floor needs the prompt to name the skill, so "set that aside and fix the test" no longer reaches a skill through "aside". Name the skill or its domain phrase.
3. **The ClickUp live run's raw output was not retained.** Its report says so per row, and a rerun needs an operator-approved browser session.
4. **The follow-up deep review has not run yet.** The operator chose to run it after the commit (Q002).
<!-- /ANCHOR:limitations -->

---
