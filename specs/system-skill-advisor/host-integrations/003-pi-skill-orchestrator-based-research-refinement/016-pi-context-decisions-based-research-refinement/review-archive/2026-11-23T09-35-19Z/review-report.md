---
title: "Review Report: the whole 016 pi-context-decisions epic at HEAD, generation 2"
description: "Five-pass deep review of the code and docs epic 016 shipped across phases 001 to 027. FAIL on the coverage gate and one open search-debt row. No P0 or P1. Six P2 advisories."
trigger_phrases:
  - "016 epic review report"
  - "016 epic second review"
  - "pi context decisions epic review"
importance_tier: normal
contextType: review
---

# Review Report: the whole 016 pi-context-decisions epic at HEAD, generation 2

<!-- ANCHOR:deep-review-016-epic-generation-2 -->

## 1. Executive Summary

- **Verdict:** FAIL. This is the output of `review-verdict.cjs`, and it binds. It does not come from any P0 or P1.
- **hasAdvisories:** false. The script sets it only on PASS. Six P2 advisories are active.
- **Counts the verdict used:** P0 0, P1 0, P2 6. Search debt 1. Failed required gate ids: `coverage`.
- **Self-check outcomes:** none recorded. The self-check owes a Hunter, Skeptic and Referee pass only on active P0 and P1 findings, and there were none. Synthesis still re-read the cited line of each of the six P2s at HEAD `ea73ab54056`. It reran the two `command-attach.ts` findings as live probes in both runtimes (Node 26 and `python3 -I`, both exit 0). All six hold as P2. None is a false positive and none rises to P1. No `claim_adjudication` row was appended.
- **Why the verdict is FAIL, in plain words.** Two things hold it there.
  1. **The coverage gate failed.** At the terminal stop, the `evidence` gate passed (`all-findings-cited`) and the `scope` gate passed (`all-findings-in-scope`). The `coverage` gate failed with `traceability-incomplete`. The cause is the core protocol `checklist_evidence`, which ended `partial`. Pass 5 kept it partial over R3-P2-003: the AC-006 row in phase 027 says its grep "exited 1", but the same grep run at HEAD prints a changelog line and exits 0. Pass 3 had also cited R3-P2-001, the Planned status of children 007 to 010. A failed required gate makes the verdict FAIL whatever the severities are.
  2. **One search-debt row is still open.** Row SL-005 (`env_parity`) was deferred in pass 1 for budget. Pass 2 did check bridge env parity, through the allowlist diff and the drift test at `runtime/tests/python/test_skill_advisor.py:2787-2793`. But pass 2 logged that work under other bug classes (`secret_env_leak`, `argv_disclosure`), never under `env_parity`, so the ledger still shows the row as deferred. The debt is a bookkeeping gap, not unread code. Search debt alone would give CONDITIONAL. With the failed gate the verdict is FAIL.
- **What clears each.**
  - Coverage gate: the gate fails while any hard-class protocol reads partial, fail or blocked (`system-deep-loop/runtime/scripts/reduce-state.cjs:1680-1681`, `convergence.cjs:1717-1726`, `terminal-gates.cjs:200`). Overlays do not count. Pass 5 named AC-006 as the residual, but pass 3 tied `checklist_evidence` to two findings: AC-006 (R3-P2-003) and the Planned status of children 007 to 010 (R3-P2-001). Fix both before the rerun. For AC-006 in `027-epic-review-fixes/acceptance-criteria.md:59`, either scope its grep to run "outside `specs/` and changelogs", the wording AC-001 and AC-015 already use, or correct the evidence cell to what the command prints. Synthesis checked the first option: `git grep -n score-outcome-rerank -- ':!specs' ':!**/changelog/**'` prints nothing and exits 1. For R3-P2-001, mark the four children Complete. Then rerun `/deep:review` so `checklist_evidence` records `pass`.
  - Search debt: a later ledger row with the same bug class whose disposition is neither deferred nor blocked removes the debt (`reduce-state.cjs:1875-1882`). In that rerun, record a search-ledger row for `env_parity` as `ruled_out`, citing `.skilled/bin/system-skill-advisor-launcher.cjs:111-166`, `runtime/scripts/skill_advisor.py:214-261` and `runtime/tests/python/test_skill_advisor.py:2787-2793`.
- **Why every pass said PASS.** Each `iteration-NNN.md` ends with "Review verdict: PASS" because each pass judged only its own findings. The binding verdict is the terminal one, and it adds the gate results and the search ledger.
- **Review scope:** 113 files in `reviewScopeFiles` (the epic spec docs plus every non-spec file the epic's commits touched), and the child packets 001 to 027. Target type: spec-folder. Dimensions: correctness, security, traceability, maintainability, all covered. Native `deep-review` executor, Opus, medium effort, single executor, 5 of 5 passes, stop reason `maxIterationsReached`. Session `2026-11-23T05:51:03.170Z`, generation 2, lineage `restart`.
- **Operator review focus:** Review the code and docs the whole epic shipped across phases 001 to 027 as they stand at HEAD: pasted-reply stripping, crash fallback, route receipts, the Ollama and embedding lane removal and its residue tool, the doctor cleanup, and the third-round fixes (bridge env parity, deep-loop offer gate, exclusion reload). Judge from code and tests; treat packet evidence and verdict tables as claims to check, not facts.

## 2. Planning Trigger

`/speckit:plan` is not required by severity. No P0 or P1 is active. The FAIL comes from the coverage gate and the stale search-debt row. The changes that clear the gate are packet-doc edits: the AC-006 cell and the four child status rows. They do not need a plan. Whether to plan a P2 fix phase for the other advisories is the operator's call. The fastest path to a clean verdict is WS1 and WS2, then a rerun of `/deep:review`.

**Planning Packet**

```json
{
  "triggered": false,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage"],
  "searchDebtCount": 1,
  "activeFindings": [
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:248", "registryLine": 247, "findingClass": "missing-guard"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/spec.md:25", "findingClass": "completion-metadata drift"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:16", "findingClass": "catalog-to-code source gap"},
    {"id": "R3-P2-003", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59", "findingClass": "non-reproducible acceptance evidence"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:476", "findingClass": "inconsistent input normalization across sibling helpers"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494", "findingClass": "comment contradicts code"}
  ],
  "remediationWorkstreams": [
    "WS1 coverage gate: AC-006 evidence (R3-P2-003)",
    "WS2 child status metadata 007 to 010 (R3-P2-001)",
    "WS3 route-receipt catalog sources (R3-P2-002)",
    "WS4 deep-loop offer gate in TS and Python (R4-P2-001, R4-P2-002)",
    "WS5 Python-advisor spawn stdin guard (R2-P2-001)"
  ],
  "specSeed": [
    "Amend 027 AC-006 so its command excludes changelogs like AC-001 and AC-015, or so its evidence cell matches the HEAD output",
    "Set Status to Complete in the spec.md and graph-metadata.json of children 007, 008, 009 and 010",
    "Decide whether a bare spelled-count question such as 'why does it stop after ten iterations' asks for a run, then state it in the ITERATION_COUNT comment"
  ],
  "planSeed": [
    "Edit the AC-006 row, rerun its grep, record the real exit status",
    "Flip four child status rows and four graph-metadata status fields, then run validate.sh --strict on each",
    "Add the DSH adapter, its test and the Vibe adapter to the receipt-guard catalog Source Files and reword the Claude-only overview",
    "Fold curly quotes in asksForLoopRun and asks_for_loop_run, add a curly-apostrophe case to deep-loop-offer-cases.json",
    "Fix the ITERATION_COUNT comment or rule in both runtimes and pin the chosen behavior with a fixture case",
    "Add child.stdin error listener in runSpawnAttempt and a test in subprocess-output-cap.vitest.ts",
    "Rerun /deep:review and record env_parity as ruled out in the search ledger"
  ],
  "findingClasses": [
    "missing-guard",
    "completion-metadata drift",
    "catalog-to-code source gap",
    "non-reproducible acceptance evidence",
    "inconsistent input normalization across sibling helpers",
    "comment contradicts code"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts",
    "016 children 007 to 010 spec.md and graph-metadata.json",
    ".skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md",
    "016 child 027 acceptance-criteria.md AC-006",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Synthesis opened every citation below at HEAD `ea73ab54056`. Fields come from the iteration delta `findingDetails`. The reducer registry leaves `findingClass`, `scopeProof` and `affectedSurfaceHints` empty for all six, so the deltas are the source for those three fields.

### R2-P2-001. Python-advisor spawn has no error listener on the child's stdin

- **Severity:** P2. **Dimension:** security. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:248`. The registry records line 247. At HEAD the write is on line 248.
- **Evidence:** `runSpawnAttempt` calls `child.stdin?.write(args.prompt)` and attaches no `error` listener to `child.stdin` (`subprocess.ts:228-249`). The sibling crash-fallback spawn guards the same write with `child.stdin?.on('error', () => undefined)` (`hooks/lib/skill-advisor-cli-fallback.ts:278`). Synthesis found no `uncaughtException` handler in the advisor runtime or hooks outside tests.
- **Impact:** if the Python child exits before it drains stdin, the write fails with EPIPE. With no listener, Node raises it as an uncaught exception in the caller, not the fail-open result the function otherwise returns. The trigger needs a child that dies at import or a timeout kill during a prompt larger than the pipe buffer. The uncaught-exception step is inferred, not reproduced.
- **Fix:** add `child.stdin?.on('error', () => undefined)` before the write, as the sibling does. Add a test that spawns a child which exits at once while a large prompt is written.
- **findingClass:** missing-guard. **scopeProof:** one write site in `runSpawnAttempt`. The CLI fallback write is guarded. **affectedSurfaceHints:** `runtime/lib/subprocess.ts`, `runtime/lib/skill-advisor-brief.ts`, `runtime/tests/subprocess-output-cap.vitest.ts`.

### R3-P2-001. Children 007 to 010 record status Planned while the parent map and summaries record them complete

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed.
- **File:** `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/spec.md:25`.
- **Evidence:** `| **Status** | Planned |` at line 25 in 007, 008 and 010 and line 26 in 009. `"status": "planned"` in `graph-metadata.json` at line 38 in 007 and 008 and line 39 in 009 and 010. The parent phase map (`spec.md:143-146`) marks all four Complete. The code agrees the work shipped, for example the Python strip mirror at `runtime/scripts/skill_advisor.py:5053`.
- **Impact:** a status or graph query over the epic reports four built phases as not started. Strict validation passes child 007 anyway, so the validator does not catch it.
- **Fix:** set Status to Complete in the four `spec.md` tables and the four `graph-metadata.json` files.
- **findingClass:** completion-metadata drift. **scopeProof:** status grep over all 27 child `spec.md` files, only 007 to 010 differ. **affectedSurfaceHints:** 007 to 010 `spec.md` metadata, 007 to 010 `graph-metadata.json` status.

### R3-P2-002. Route-receipt catalog entry omits the DSH adapter source and test and calls the guard Claude-only

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed. Pass 5 found it slightly wider.
- **File:** `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:16`.
- **Evidence:** the overview says "The Claude hook holds back a confidence-floored route" (line 16). How It Works describes the DSH adapter dropping a receipt at session start and clean compaction (line 24). The Source Files tables (lines 34-41) list only `route-receipt.ts`, the Claude handler and `route-receipt.vitest.ts`. The DSH code is `hooks/dsh/prompt-advisor.mjs:184` and `:213`, tested in `hooks/tests/dsh-prompt-advisor.test.mjs`. The Vibe adapter also reaches the guard through the compiled Claude handler (`hooks/vibe/prompt-advisor.mjs:33`).
- **Impact:** documentation traceability only. An operator tracing a DSH receipt drop from the catalog never reaches the adapter that does it.
- **Fix:** reword the overview to name the shared handler and its runtimes. Add the DSH adapter, its test and the Vibe adapter to Source Files.
- **findingClass:** catalog-to-code source gap. **scopeProof:** single catalog entry, the pasted-reply entry matches its code. **affectedSurfaceHints:** `weak-follow-up-route-receipt-guard.md` overview and Source Files.

### R3-P2-003. 027 AC-006 evidence says the grep exited 1 but the grep prints a changelog line at HEAD

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed. Pass 5 named this as the residual that holds `checklist_evidence` at partial and so fails the coverage gate. Pass 3 also cited R3-P2-001 for the same protocol.
- **File:** `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59`.
- **Evidence:** the row records "The grep exited 1". Synthesis reran `git grep -n score-outcome-rerank -- ':!specs'` at HEAD. It printed `.skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md:32` and exited 0. The intent holds, since no live code names the deleted script.
- **Impact:** the row's own command cannot reproduce its recorded evidence, so a closure audit cannot confirm the Met mark.
- **Fix:** add a changelog exclusion to the AC-006 command, as AC-001 and AC-015 do, or correct the evidence cell.
- **findingClass:** non-reproducible acceptance evidence. **scopeProof:** AC-001 and AC-015 exclude changelogs and reproduce, AC-006 omits the exclusion. **affectedSurfaceHints:** 027 `acceptance-criteria.md` AC-006.

### R4-P2-001. The loop-run ask does not fold a curly apostrophe while its sibling helpers do

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active, confirmed by a live probe at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:476`.
- **Evidence:** `asksForLoopRun` only lowercases (`command-attach.ts:475-476`). `isStuckRunComplaint` (`:388`), `isPastRunRead` (`:400`) and `isNoEditRequest` (`:443`) fold `‘’` to `'` first. The want-lead vocabulary spells `i'd like` with a straight quote (`:455`). The Python copy has the same gap: `asks_for_loop_run` uses `prompt.lower()` (`skill_advisor.py:4597`) while `_fold_quotes` serves only the stuck-run and past-run checks. Synthesis probe, both runtimes exit 0: `i'd like a research loop on cache eviction` returns true and the curly `I’d like a research loop on cache eviction` returns false.
- **Impact:** a prompt typed with a typographic apostrophe loses the deep-research offer. The gate's design ranks a lost offer as the cheaper error.
- **Fix:** fold quotes in `asksForLoopRun` and `asks_for_loop_run`, or route all gate helpers through one normalizer. Add a curly-apostrophe case to the shared fixture.
- **findingClass:** inconsistent input normalization across sibling helpers. **scopeProof:** every `toLowerCase` site in the gate section was checked, only line 476 skips the fold. **affectedSurfaceHints:** `command-attach.ts` `asksForLoopRun`, `skill_advisor.py` `asks_for_loop_run`, `tests/fixtures/deep-loop-offer-cases.json`.

### R4-P2-002. The ITERATION_COUNT comment says a spelled-count question stays a question, but both copies read it as a run ask

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active, confirmed by a live probe at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494`.
- **Evidence:** the comment at `command-attach.ts:493-497` says "why does it stop after ten iterations" stays the question it was. `LOOP_COUNT` matches `ten iterations` because `after` is not in its look-back list (`:320-323`), and the question exemption needs a loop name near the question verb (`:487-491`). Synthesis probe in both runtimes: that sentence returns true. Two controls return false: `why does the deep review stop after ten iterations` and `how many passes does it run`. So the comment holds for a question that names the loop and fails for its own bare example.
- **Impact:** no wrong behavior is proven, since the code may be right and the comment wrong. The next person to tune the question rule will rely on a false example.
- **Fix:** decide the intended behavior. Then fix the comment, or the rule in both runtimes, and pin it with a fixture case.
- **findingClass:** comment contradicts code. **scopeProof:** the comment's literal example was probed, and the `MULTI_PASS` comment example agrees with its code. **affectedSurfaceHints:** `command-attach.ts` `ITERATION_COUNT` comment, `skill_advisor.py` `_LOOP_DIGIT_COUNT_RE` note.

## 4. Remediation Workstreams

No P0 or P1 workstream exists. All five workstreams below are P2 advisories. WS1 and WS2 come first because pass 3 tied both findings to `checklist_evidence`, the protocol that fails the gate. Do both before the rerun.

1. **WS1 coverage gate (R3-P2-003).** Fix the AC-006 row in phase 027. After WS2, rerun `/deep:review` so `checklist_evidence` reads `pass`, and log `env_parity` as ruled out in the search ledger to clear the debt.
2. **WS2 child status metadata (R3-P2-001).** Mark children 007, 008, 009 and 010 Complete in `spec.md` and `graph-metadata.json`. Pass 3 also cited this drift as a reason `checklist_evidence` stayed partial.
3. **WS3 catalog sources (R3-P2-002).** Name the shared handler and its runtimes in the receipt-guard catalog entry, and list the DSH adapter, its test and the Vibe adapter.
4. **WS4 deep-loop offer gate (R4-P2-001, R4-P2-002).** Fold curly quotes in the loop-run ask in TS and Python. Settle the spelled-count question behavior and make the comment match. Pin both with shared fixture cases so the two runtimes stay together.
5. **WS5 spawn stdin guard (R2-P2-001).** Add the stdin `error` listener in `runSpawnAttempt` and a test for an early-exit child.

## 5. Spec Seed

- Phase 027 AC-006: the command excludes changelogs, or the evidence cell records what HEAD prints.
- Children 007 to 010: the Status row and `graph-metadata.json` status read Complete.
- Deep-loop offer gate: a typographic apostrophe in a want-lead gets the same offer as a straight one, in both runtimes.
- Deep-loop offer gate: one stated rule for a bare spelled-count question, with the comment matching the code.
- Python-advisor spawn: a child that exits before reading stdin returns the fail-open result, never an uncaught exception.
- Receipt-guard catalog: Source Files lists every adapter that reaches the guard.

## 6. Plan Seed

- T1. Edit 027 `acceptance-criteria.md` AC-006 and rerun its command. Record the real exit status.
- T2. Set Complete in the four child `spec.md` tables and the four `graph-metadata.json` files. Run `validate.sh --strict` on each child.
- T3. Rewrite the receipt-guard catalog overview and add the DSH and Vibe rows to Source Files.
- T4. Fold quotes in `asksForLoopRun` and `asks_for_loop_run`. Add a curly-apostrophe fixture case. Run `deep-loop-offer-cases.vitest.ts` and the Python suite.
- T5. Fix the `ITERATION_COUNT` comment or rule in both runtimes and add a fixture case for `why does it stop after ten iterations`.
- T6. Add the stdin `error` listener in `subprocess.ts` with a test in `subprocess-output-cap.vitest.ts`.
- T7. Rerun `/deep:review` on this spec folder and confirm the verdict script reports no failed gate and zero search debt.

## 7. Traceability Status

### Core protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | hard | pass | Third-round fixes hold: exclusion reload `runtime/lib/route-exclusions.ts:94-116`, offer gate in both runtimes (32 off-fixture probes agree), bridge env parity with a drift test `test_skill_advisor.py:2787-2793`, crash fallback `skill-advisor-cli-fallback.ts:256-331`, doctor cleanup contract 21 of 21 pass. | None. The strip call-site parity check was not run. |
| `checklist_evidence` | hard | partial | 117 AC rows across seven children read Met with no waiver. 027 AC-001, AC-003, AC-014 and AC-015 reproduce at HEAD. Phase 003 T009 to T014 are open by a recorded no-ship decision (`003-follow-up-routing-benchmark/implementation-summary.md:78`). | AC-006 does not reproduce (R3-P2-003). Pass 3 also cited the 007 to 010 status drift (R3-P2-001). This is the gating failure. |

### Overlay protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `skill_agent` | advisory | pass | `SKILL.md:26-27` carries triggers for both shipped behaviors. No agent definition was touched. | None. |
| `agent_cross_runtime` | not recorded | not recorded in this run | No pass emitted a result for this overlay, and the registry holds none. It is not marked pass or not-applicable. | Unknown. A rerun should record it. |
| `feature_catalog_code` | soft | partial | Weights entry matches the four live lanes (`weights-config.md:22`, `lane-registry.ts:9-12`). Pasted-reply entry matches `fusion.ts:1087-1089`. | Receipt-guard entry under-lists its sources (R3-P2-002). Soft class, so it does not gate. |
| `playbook_capability` | advisory | pass | `manual-testing-playbook.vitest.ts` 2 of 2 pass. Playbook commands name real entry points. | None. |

The registry summary reads required 5, executed 5, pass 3, partial 2, gating failures 1. It counts five protocols although the config lists six, because `agent_cross_runtime` never reported.

### AC_COVERAGE

- **Epic parent (the review target):** exempt. The parent folder has no `acceptance-criteria.md`, so the rule's lifecycle predicate does not apply.
- **Children, read at synthesis from `validate.sh --strict` (each `RESULT: PASSED`, tree unchanged):**

| Child | AC_COVERAGE | Covered / total | Floor |
|---|---|---|---|
| 018 | advisory-shortfall | 0 / 10 | 9 |
| 019 | advisory-shortfall | 0 / 13 | 12 |
| 020 | not active for its level or lifecycle state | n/a | n/a |
| 022 | advisory-shortfall | 0 / 15 | 14 |
| 025 | advisory-shortfall | 0 / 24 | 22 |
| 026 | advisory-shortfall | 0 / 28 | 26 |
| 027 | pass | 22 / 22 | 20 |

- **Overall signal:** advisory-shortfall. Five children mark their rows Met but cite no `file:line` in the Verification cell. The rule is INFO and default-advisory, so it does not change the verdict. Next action, if wanted: retro-cite `file:line` evidence in those five children.

### Resource map

- resource-map.md not present at the spec-folder root, so the Resource Map Coverage Gate is skipped. The reducer did write `review/resource-map.md` at synthesis. See the Audit Appendix for its quality.

## 8. Deferred Items

- The registry has no `frontier` object, so no exhausted or blocked frontier nodes are carried.
- **Strip call-site parity not checked.** Pass 5 proved the two strip functions agree (0 diffs over 14,013 probes) but did not check that the TS call site and `skill_advisor.py:1050-1052` pass the same text.
- **Codex reach of the receipt guard unverified.** `hooks/` has no codex directory. Pass 5 left it as a note.
- **Out-of-scope context reads.** `sweep-lane-residue.mjs` and `.skilled/commands/doctor/assets/doctor-update-apply.yaml` were read as context. They are not in `reviewScopeFiles`, because the scope list is built from commit trailers. No finding was raised against them.
- **Maintainability notes not raised.** The TS and Python offer gates are hand-kept copies held together only by a 27-case fixture. The launcher and bridge allowlists differ on two non-scorer hook-timeout keys under a drift test. The live and shadow lane weights each sum to 0.95, with no sum-to-one contract.
- **Search debt SL-005 (`env_parity`).** Deferred in pass 1, checked in pass 2 under other bug classes, never closed under its own class.

## Dimension Expansion Map

- Saturated directions: none recorded. `divergence.saturatedDirections` is empty.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Council artifacts: none.
- Selected review directions: the fixed rotation of correctness (pass 1), security (pass 2), traceability (pass 3), maintainability (pass 4), then a traceability stabilization pass (pass 5).
- Remaining frontier: none recorded.

## 9. Search Ledger

- **hasSearchDebt:** true. One deferred row, SL-005 `env_parity`, reason "budget", carried to pass 2 and never closed. It is what keeps search debt at 1. On its own it would make the verdict CONDITIONAL. The coverage gate makes it FAIL.
- **searchCoverage:** required bug classes `mirror_drift` and `checklist_evidence_gap`, both ruled out. Graph coverage mode `graphless_fallback`.
- **candidateCoverage:**
  - Covered (each produced a finding): `unhandled_io_error`, `completion_metadata_drift`, `catalog_code_drift`, `acceptance_evidence`, `input_normalization`, `comment_drift`.
  - Ruled out: `cross_runtime_drift`, `stale_cache`, `idempotence`, `state_transition`, `secret_env_leak`, `argv_disclosure`, `path_traversal_delete`, `removed_feature_residue`, `mirror_drift`, `dead_code`, `comment_hygiene`, `checklist_evidence_gap`.
  - Deferred: `env_parity`. Blocked: none.
- **ruledOutCandidates and cleanSearchProof (13 rows each):**

| Row | Pass | Bug class | Proof |
|---|---|---|---|
| SL-001 | 1 | cross_runtime_drift | Shared fixtures pass in both suites (127 TS, 18 Python) |
| SL-002 | 1 | stale_cache | Exclusion stamp covers file choice, size and mtime |
| SL-003 | 1 | idempotence | Strip loops to a fixed point |
| SL-004 | 1 | state_transition | End-to-end receipt suppression tests pass with real stores |
| SL-201 | 2 | secret_env_leak | Exact-key allowlists with a drift test |
| SL-202 | 2 | argv_disclosure | Every prompt-carrying spawn uses stdin |
| SL-204 | 2 | path_traversal_delete | Containment and ownership guards in the residue tool |
| SL-304 | 3 | removed_feature_residue | Grep finds only an env-prefix scrub entry |
| SL-401 | 4 | mirror_drift | 32 off-fixture gate probes agree |
| SL-404 | 4 | dead_code | Lane registry holds only live lanes |
| SL-405 | 4 | comment_hygiene | No ephemeral ids in epic code comments |
| SL-501 | 5 | mirror_drift | 0 strip diffs over 14,013 probes |
| SL-502 | 5 | checklist_evidence_gap | Open 003 tasks follow a recorded no-ship decision |

## 10. Audit Appendix

### Convergence summary

- 5 of 5 passes, stop policy `max-iterations`, stop reason `maxIterationsReached`. Convergence is telemetry only under this policy.
- Reducer convergence score 1, graph convergence score 1, graph decision `STOP_ALLOWED`, no graph blockers.
- New findings by pass: 0, 1, 3, 2, 0. Pass 5 rechecked all six and confirmed each.
- Terminal gates (state log, run 6): `evidence` pass `all-findings-cited`, `scope` pass `all-findings-in-scope`, `coverage` fail `traceability-incomplete`.
- Verdict script output: `{"status":"ok","verdict":"FAIL","has_advisories":false,"active_p0":0,"active_p1":0,"active_p2":6,"search_debt":1,"failed_required_gate_ids":["coverage"]}`, exit 0. Same output before and after the resource-map reducer run.

### Coverage summary

- Dimensions: correctness, security, traceability and maintainability all covered.
- Files: the passes read the advisor runtime (`command-attach.ts`, `skill_advisor.py`, `route-exclusions.ts`, `prompt-policy.ts`, `subprocess.ts`, `fusion.ts`, `lane-registry.ts`), the hooks (`user-prompt-submit.ts`, `route-receipt.ts`, `skill-advisor-cli-fallback.ts`, the DSH and Vibe adapters), the launcher, the catalog and playbook entries, and the child packet docs for 001 to 027. Comment-hygiene and test-title greps covered all 54 code and test files in scope.
- Runs the passes read with output and exit: vitest over 6 files (127 pass), pytest (18 pass), doctor contract (21 pass), playbook vitest (2 pass), `validate.sh --strict` on child 007, a 32-prompt offer-gate differential and a 14,013-probe strip differential.
- Runs at synthesis: the six P2 citations re-read at HEAD, a five-prompt probe of `asksForLoopRun` and `asks_for_loop_run` (both exit 0), the AC-006 grep (exit 0, one changelog hit), `validate.sh --strict` on the seven AC children (all `RESULT: PASSED`), the verdict script twice and the resource-map reducer once (exit 0).

### Ruled-out claims

- Strip non-idempotence between hook and scorer. Receipt invalidated by directive delivery. Receipt base dir permission failure.
- Prompt disclosure through argv. Unrelated env leak to the daemon or bridge child. Residue-tool delete outside its root or signal to a foreign process.
- Live Ollama or embedding lane code after phase 024. Unmet or waived AC rows in the seven AC files.
- Off-fixture TS and Python drift in the offer gate and the pasted-reply strip. Unnormalized lane weights. Ephemeral ids in epic code comments.
- Open 003 tasks hiding missing evidence.

### Sources reviewed

- Review packet: `iterations/iteration-001.md` to `iteration-005.md`, `deltas/iter-001.jsonl` to `iter-005.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-config.json`, `deep-review-state.jsonl` (terminal gate row).
- Code and docs at HEAD `ea73ab54056` as cited in section 3.

### Tooling note on the resource map

`review/resource-map.md` was emitted by the reducer, but its content is weak. Eight of its 13 rows are graph node ids (`dim-security`, `file-subprocess` and similar) filed as Documents and marked MISSING. Every row reports `P0=0 P1=0 P2=0`, including the files that carry the six P2s. This is a reducer tooling issue, not a review finding. It does not affect the verdict, since the coverage gate reads the spec-folder `resource-map.md`, which is absent.

### Core Protocols

- `spec_code`: pass, final in pass 4.
- `checklist_evidence`: partial, final in pass 5. Gating failure.

### Overlay Protocols

- `skill_agent`: pass, pass 3.
- `agent_cross_runtime`: not recorded in this run.
- `feature_catalog_code`: partial, pass 4. Soft, non-gating.
- `playbook_capability`: pass, pass 3.

<!-- /ANCHOR:deep-review-016-epic-generation-2 -->
