---
title: "Implementation Summary"
description: "Every open item in the 011 and 066 trees now has a final state in the ledger below, and the failures the gate run surfaced are fixed."
trigger_phrases:
  - "open items ledger implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/009-open-items-ledger"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-015-009-open-items-ledger"
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
| **Spec Folder** | 009-open-items-ledger |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every open item in the 011 and 066 trees now has a final state in the ledger below, and the failures the gate run surfaced are fixed.

### Phase 9: open-items-ledger

The parent-hub scaffold now lists its primary packet name and `<hub> primary workflow` alias among the mode's router keywords and the packet name among the description keywords, which the doctor's 5k checks require. The deep/ai-council, deep/review and deep/research command contracts were recompiled, because their recorded digests of the deep-loop SKILL.md, mode registry and mode SKILL.md files had gone stale and five runtime tests failed on it. system-deep-loop releases 1.5.6.0 for that and for deep-loop-runtime 1.9.8.0, and its README now carries the release version. A trial that added the model-benchmark aliases as router keywords, to clear four doctor warnings, made playbook AI-003 drift, because that mode is reached only by its command by design; it was reverted and the warnings are recorded as intended. The cli-classifier and mcp-tooling hub releases the catalog track handed off are listed in each hub's unreleased entry.

### Open-items ledger

Every item the closeout list named, and every Known Limitation in the 012, 013, 014 and 066 trees, ends in one of two states. FIXED names the phase and the check. CLOSED names the reason a fix is not built.

| Item | Source | State | Evidence or reason |
|------|--------|-------|--------------------|
| 36 HVR hard blockers in the sk-code hub | closeout 1 | FIXED | Phase 001: hvr_scan 0 hard blockers |
| Stale goal criteria | closeout 2 | FIXED | Phase 002: 75 amendments, each rerun |
| sk-git playbook change without a changelog line | closeout 3 | FIXED | Phase 003: line in v1.8.4.0 |
| Hooks vitest exit 1 on node:test files | closeout 4 | FIXED | Phase 004: dispatch and hooks-tree vitest exit 0, node --test 257 pass |
| `--check` compares no content | closeout 5, 013/008 | FIXED | Phase 006: 55 of 55 served copies compared |
| `-c` payload cut at the first escaped quote | closeout 6, 013/009 | FIXED | Phase 004: new cases fail before, pass after |
| Late write covers one short-deadline entry | closeout 7, 013/006 #1 | FIXED | Phase 005: all seven entries, early and late |
| 43 review folders error during reduction | closeout 8, 012 research | FIXED | Phase 007: probe errors 43 to 0 |
| Battery misses P4, P7, P15 | closeout 9, 014/007 #1 | CLOSED | Phase 008: each loses to a calibrated rule other probe sets rely on; changing it is overfitting to one probe |
| Surface-hint adoption | closeout 10 | FIXED for OpenCode, CLOSED for Claude and Codex | Phase 008: the OpenCode plugin sends the workspace surface; the hook briefs render no compiled targets |
| Two catalog validator notes | closeout 11 | CLOSED | Both are `ignored_path_absent` notes for gitignored runtime files (`hook-flags.env`, the loop-guard log). The note never changes the verdict: the validator exits 0 with 0 fail and 0 warn |
| 500 ms short-host residual risk | closeout 12, 013/006 #2 | FIXED | Phase 005: README paragraph, and a parity test over the three copies |
| create-journey-proof.test.cjs fails | closeout 13, 014/006 | FIXED | This phase: the parent scaffold lists its own aliases as router keywords; 43 of 43 sk-create-skill tests pass |
| Deep command contracts carry stale source digests (5 runtime tests fail) | closeout 13 (gate run) | FIXED | This phase: recompiled; check-contract-drift OK, the two test files 42 passed |
| system-deep-loop README carries 1.4.3.0 | closeout 13 (doctor) | FIXED | This phase: README at the release version; the doctor's 13c warning is gone |
| Four model-benchmark alias warnings in the deep-loop doctor | closeout 13 (doctor) | CLOSED | The mode is a command bridge reached only by `/deep:model-benchmark`. Adding the aliases as keywords made playbook AI-003 drift, so they stay non-routing by design |
| cli-classifier and mcp-tooling hub releases handed off | 066/003 #2, 066/005 #1 | FIXED | This phase: the work is listed in each hub's unreleased entry, v0.8.1.0 and v1.8.1.0 |
| Other 066 hub bumps handed off (cli-external-orchestration, sk-code, sk-doc, system-deep-loop, sk-design) | 066/003 #2, 066/004, 066/007, 066/009 | FIXED | Each carries a newer unreleased version: 1.7.3.0, 2.2.10.0, 2.3.2.0, 1.5.6.0, 2.0.1.0 |
| sk-vision build-dependent case | 012/001 | CLOSED | Passes where `vision-runtime/dist` is built (9 of 9 here). The dist is gitignored build output, so an unbuilt checkout must build first; shipping build output would add a second copy to keep in sync |
| Skipped Webflow callbacks unchecked | 012/002 | CLOSED | Only a browser run sees code that runs past the cap; the warning names the gap |
| 277 drift-guard style warnings | 012/003 | CLOSED | Non-blocking style advisories spread over scratch scripts in 20+ unrelated packets. Fixing them folds other tracks' files into this change, the "while we're here" restraint |
| Playbook prompts naming `preview-server` | 012/004 | CLOSED | Illustrative quoted requests that claim no file exists |
| Comment-ceiling count tracks fixtures | 012/005 | CLOSED | The report reads every tracked file by design |
| Four 012/006 P2s | 012/006 #1 | FIXED | Phase 012/007 fixed them |
| Epic summary count stale | 012/006 #2 | FIXED | The epic goal's criteria 1 and 2 are updated with this closeout |
| Partial pre-fix archive | 012/007 | CLOSED | A record of how a past proof ran; nothing to change |
| 012 run bookkeeping (reducer recount, containment advisory, convergence events) | 012 parent | CLOSED | Finished-run history; phase 007 now reduces all 505 review folders |
| Authored routing source under `z_archive` | 013/001 | CLOSED | Moving the authored tree is a restructure with no failing check; phase 006 now fails `--check` on any authored or served drift |
| One drifted deep-loop admission scenario | 013/002 | CLOSED | DOC-331 says "We just finished a deep-research run" and routes to research. The router has no negative vocabulary, so a fix means a new router mechanism for one scenario. The hub stays admitted and CI runs admission with `--warn-only` |
| No guard ties a canary case to its hub | 013/003 | CLOSED | `all-canaries.cjs` replays every case against its hub's compiled registry, so a moved mode fails its case: all hubs failures 0 |
| Why `node --test` read as ambiguous | 013/004 | FIXED | `inspectDispatch("node --test ...")` now returns none |
| Advisor runtime has no `engines` field | 013/005 | FIXED | Added in 014/012 (`engines.node >=20.19.0`) |
| 013/007 findings unfixed in that phase | 013/007 | FIXED | Fixed in 013/008 and 013/009, and the last two items here |
| 013 parent: phase 1 effect inferred | 013 parent #1 | FIXED | compiled-route-manifest tests 43 pass |
| 013 parent: three incidents UNKNOWN, close-out event | 013 parent #2, #3 | CLOSED | No run output was recorded, so nothing can confirm them now |
| Parent goal over budget | 014/001 #1 | FIXED | 014/002; check-goal on the epic parent passes |
| JSON version copies, battery jitter, terse decisions | 014/001 #2, #3, 014/002, 014/003 | CLOSED | Decided in 014/003 with the commit hook as backstop; jitter is ties at 0.82 |
| Commit gate applies after merge | 014/004 #1, 014/014 | CLOSED | Hooks run from the checkout that commits; this worktree's commits ran them (spec-remint, phrase lint) |
| cli-classifier intent-signal check | 014/004 #2 | FIXED | generate-router-intent-signals --check: 7 hubs, missing 0 |
| Changelog workflow not executed by a test | 014/005 | CLOSED | A YAML recipe for the agent; the commit hook checks its result |
| Compiled skill graph lags metadata | 014/007 #2 | FIXED | skill_graph_compiler --validate-only passes; derived freshness 14 of 14 |
| Renumber at merge (advisor, catalog tooling) | 014/008, 014/016 | FIXED | Bumps in this closeout are numbered past origin/main |
| New CI steps first run on main | 014/009 | CLOSED | Merging is out of scope; the same scripts pass here |
| Root-row output names and alias paths | 014/010, 066/003 #1 | CLOSED | Names of documents, not file citations, kept by design |
| 014/011 findings and probe history | 014/011 | CLOSED | Review only; findings fixed in 014/012 to 014/016 |
| Derived triggers changed without a stamp | 014/015 | CLOSED | The regenerator preserves authored derived content by contract, so a content check would flag legitimate edits |
| Marker left in catalogs after 066/001 | 066/001 | FIXED | 066/002 removed it; one `sk-doc-template:` line remains repository-wide |
| Package findings in untouched units | 066/002 #1 | CLOSED | 13 units fail `package_skill --check --strict`, all with files unchanged since origin/main: version keys in older changelogs and three SKILL.md word limits. They belong to their own tracks, outside both trees |
| fanout-write-containment.md separators | 066/002 #2 | FIXED | validate_document reports VALID, 0 issues |
| Other template-name comments | 066/002 #3 | FIXED | One line remains repository-wide |
| Validator gaps handed off | 066/006 | FIXED | sk-create-skill v1.5.2.0: fixture folders, hub sections, `.ts`, `.txt` |
| 066/008 P2s, bookkeeping | 066/008 | FIXED | Fixed in 066/009; bookkeeping is finished-run history |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| init_skill.py | Modify | Scaffold keywords |
| Three compiled command contracts | Modify | Recompiled |
| system-deep-loop hub carriers, README, v1.5.6.0, manifests, Hermes copy | Modify, Create | Release 1.5.6.0 |
| cli-classifier v0.8.1.0, mcp-tooling v1.8.1.0, sk-create-skill v1.5.2.0 | Modify | Lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each limitation was checked against today's tree before its state was written. The scaffold test failed before its fix, and the contract tests failed with the old reducer restored too, which showed they were not caused by phase 007.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model-benchmark aliases stay non-routing | Playbook AI-003 requires bare benchmark wording not to reach the command-bridge mode |
| Untouched units stay as they are | Their files are unchanged since origin/main and belong to other tracks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test create-journey-proof.test.cjs` | fail 1 before, pass 1 after; all 43 sk-create-skill tests pass |
| `node check-contract-drift.cjs` | 9 stale digests before; OK commands=3 after |
| `npx vitest run` check-contract-drift and render-command-contract | 5 failed before, 42 passed after |
| `parent-skill-check.cjs system-deep-loop` | OK; the 13c README warning is gone, and the four model-benchmark alias warnings stay by design |
| `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `all-canaries.cjs` | all fresh; 55 of 55 match; all hubs failures 0 |
| `package_skill.py --check --strict` on system-deep-loop, cli-classifier, mcp-tooling, sk-create-skill | Result: PASS each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. None.
<!-- /ANCHOR:limitations -->

---
