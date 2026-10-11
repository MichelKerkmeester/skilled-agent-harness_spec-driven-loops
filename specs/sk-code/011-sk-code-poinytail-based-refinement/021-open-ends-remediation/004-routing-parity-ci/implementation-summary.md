---
title: "Implementation Summary"
description: "A new disagreement between the Python and TypeScript advisor scorers, or a new holdout overlap, now fails CI, and both checks give the same answer on every machine."
trigger_phrases:
  - "routing parity ci implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci"
    last_updated_at: "2026-10-11T22:25:00Z"
    last_updated_by: "routing-parity-ci-builder"
    recent_action: "Built and reviewed parity CI gates"
    next_safe_action: "Merge; renumber advisor version if taken"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs"
    session_dedup:
      fingerprint: "sha256:7cc8ca8f81d16d72a227ed1492c22af6a85c9713c0bf1b01761faa7e924b3fdd"
      session_id: "scaffold-004-routing-parity-ci"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-routing-parity-ci |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new disagreement between the advisor's Python and TypeScript scorers now fails CI, and so does a new prompt shared between the holdout and any test that scores prompts. Before this phase no workflow ran the divergence ratchet, and the ratchet passed only on a machine where the advisor daemon had built a skill graph.

### Phase 4: routing-parity-ci

The golden-prompt-gate job installs Python and runs two blocking steps of their own, outside the warn-only admission step. The divergence ratchet indexes the checkout's skill graph into a temporary directory before it imports the native scorer, so both scorers read the same graph on a clean runner and on a machine with a live daemon. It replays at the instant the ledger records, so the calendar alone cannot flip a decision. Its header says a green run shows harness-regime parity, not live-daemon parity. The holdout check declares every surface that scores prompts, which holdout source types each may share prompts with, through which corpus, and why.

The deep review found that the ledger capture still scored in the old regime. It now scores in the ratchet's regime and records the instant, so a recapture on a clean checkout reproduces the committed ledger exactly.

### Recommendation Ledger

| ID | State | Proof or reason |
|----|-------|-----------------|
| R1 | Fixed | `grep -n local-native-divergence-ratchet .github/workflows/routing-registry-drift.yml` prints line 288 inside golden-prompt-gate with no continue-on-error; `actionlint .github/workflows/routing-registry-drift.yml` prints nothing and exits 0; the ratchet passes 9 of 9 with no built skill graph, where it failed 2 of 6 before |
| R2 | Closed | Build nothing, per the research and prevent-overengineering: the strict top-1 predicate with abstention normalized to none, and its five ledger rules, already exist |
| R3 | Fixed | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` with the clock faked to 2031-01-01 passes 9 of 9; the unpinned ratchet failed at 2027-01-01 when rr-iter3-166 flipped to sk-doc |
| R4 | Closed | Build nothing, per the research and prevent-overengineering: the frozen holdout and its CI floor already exist, and the battery stays a smoke test |
| R5 | Fixed | `npx vitest run tests/parity/holdout-independent.vitest.ts` passes 6 of 6 and runs at line 297 of the workflow; with one holdout prompt injected into ambiguity-prompts.jsonl it fails on "ambiguity-slice scores holdout-regression rows through ambiguity", where the old check passed |
| R6 | Closed | Build nothing, per the research and prevent-overengineering: an exact 0.82 tie that flips top-1 is absorbed by a reviewed ledger entry, never by moving a floor |
| R7 | Closed | Build nothing, per the research and prevent-overengineering. Partly superseded: the deep-loop hub's admission already blocks at routing-registry-drift.yml line 181, while the other hubs stay warn-only; R1 keeps every parity gate out of that step |
| R8 | Fixed | `grep -n "harness-regime parity" .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` prints line 15, which names the local Python scorer, the in-process native scorer and the VITEST fixture vectors |
| R9 | Closed | Build nothing, per the research and prevent-overengineering: only the reading of the battery changes; the ratchet, whose Python side is the local scorer, is the cross-path parity evidence |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/routing-registry-drift.yml` | Modified | Python setup and two blocking steps in golden-prompt-gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modified | Fresh graph, pinned clock, regime header, self-checks, python-less skip |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | Modified | Every scoring surface, per-corpus allowed-overlap map, backed declarations |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Top-level scoringInstant; no entry changed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modified | Capture in the ratchet's regime and record the instant |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts` | Modified | Accept any missing built module, since the capture now loads the skill-graph module before the scorer |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v0.15.4.0.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Modified, Created | Version 0.15.4.0 and its mirror |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each code change went to DeepSeek V4.1 Flash at max effort through cli-pi on DevPass as one short brief carrying the literal diff, and every result was checked byte for byte against the reviewed text. All ten dispatches matched on the first attempt, so nothing was edited by hand. A five-iteration `/deep:review :auto` with the same executor then reviewed the build commit. Every finding was confirmed with a command and fixed (`review/review-report.md`).

### Tests

| ID | Test or command | Before | After |
|----|-----------------|--------|-------|
| T1 | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` with Date faked to 2031-01-01 by a setup file and a fresh graph supplied | before: exit 1 | after: exit 0 |
| T2 | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` with no built skill graph, then with SYSTEM_SKILL_ADVISOR_DB_DIR naming an empty directory | before: exit 1 | after: exit 0 |
| T3 | `npx vitest run tests/parity/holdout-independent.vitest.ts` with a holdout prompt injected into ambiguity-prompts.jsonl, passing when the gate catches it | before: exit 1 | after: exit 0 |
| T4 | Both parity tests present in golden-prompt-gate with setup-python, no continue-on-error and no --warn-only | before: exit 1 | after: exit 0 |
| T5 | `grep` for the harness-regime sentence, VITEST and fixture vectors in the ratchet header | before: exit 1 | after: exit 0 |
| T6 | `node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs --summary` reports no row added, resolved or changed on a clean checkout | before: exit 1 | after: exit 0 |
| T7 | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` with SPECKIT_PARITY_REQUIRE_PYTHON=0 and no python3 on PATH | before: exit 1 | after: exit 0 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Index a fresh skill graph inside the ratchet instead of recapturing the ledger | The ledger matched a built graph exactly, and D1 freezes its entries. The no-graph regime would have meant rewriting ten of them |
| Import the native scorer after setting the graph directory | `lib/scorer/projection.ts` reads SYSTEM_SKILL_ADVISOR_DB_DIR once at module load, so a static import ignored the fresh graph |
| Record scoringInstant in the ledger instead of deriving it from approvals | A derived pin moved with every new approval. The recorded one moves only on a recapture, which re-scores every entry |
| Fix the ledger capture script, outside the spec's Files to Change | The review confirmed the capture would rewrite ten rows on a clean checkout. The operator brief asked for every confirmed finding to be fixed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Parity suites (ratchet, holdout, capture workspace root) | PASS, 19 tests in 3 files |
| Added CI time, measured locally | About 6.7 s for the ratchet and 1.9 s for the holdout check, median of three runs at load 7. The ratchet took 10.8 s at load 34. setup-python was not measured locally |
| Full system-skill-advisor vitest | 4 failed, 1042 passed, 6 skipped, at load 7. The final rerun caught a regression from the capture fix: the workspace-root test expected the first missing module to be `fusion.js`, and it went from 4 failures to 4 passes once it accepted any built module. The 4 remaining failures (python-compat, advisor-corpus-parity, advisor-graph-health, skill-advisor-cli-parity) are in the set that failed before this phase's tests ran, and none reads a file this phase changed |
| Advisor probe batteries | CLI and `--via python` both print positives 17/17 and false positives 0/5, exit 0 |
| compiled-route-sync --check, compiled-route-guard, Hermes sync --check, trigger index --check | All exit 0 |
| actionlint on the workflow | PASS, no output, exit 0 |
| Strict validation | RESULT: PASSED on the final state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon parity is not covered.** The ratchet shows harness-regime parity only, as its header says. A prompt such as rr-iter3-168 can route differently in the live daemon and still pass.
2. **The version may collide at merge.** Sibling phases bump system-skill-advisor in parallel, so the integrator may renumber 0.15.4.0.
3. **Pre-existing advisor suite failures.** Four test files fail in this worktree with or without this change: python-compat, advisor-corpus-parity, advisor-graph-health and skill-advisor-cli-parity. They are outside this phase's scope.
<!-- /ANCHOR:limitations -->

---
