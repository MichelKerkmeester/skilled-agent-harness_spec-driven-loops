---
title: "Deep Review Report: Ollama lane removal"
description: "Ten-iteration deep review of the 024 lane removal epic: verdict CONDITIONAL, no P0 or P1, ten P2 advisories and one deferred search item."
trigger_phrases:
  - "ollama lane removal review report"
  - "lane residue deep review"
importance_tier: normal
contextType: review
---

# Deep Review Report: Ollama lane removal

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS, so the flag stays false)
- **Counts the verdict used:** P0 0, P1 0, P2 10, search debt 1. These are the counts `review-verdict.cjs` read from the refreshed registry.
- **Why CONDITIONAL:** No finding is P0 or P1. The verdict rests on one deferred search item, `SL4-005` (fixture realism in `sweep-lane-residue.vitest.ts`), which iteration 4 carried and no later pass closed.
- **Self-check outcomes:** No active P0 or P1 finding existed, so the adversarial self-check had nothing to adjudicate and appended no rows. The orchestrator re-read five of the ten P2 claims at their cited lines and all five hold: R1-P2-001, R3-P2-001, R3-P2-002, R3-P2-003 and R2-P2-001.
- **Scope:** `024-ollama-lane-removal` as a spec folder. That is the packet docs of the parent and its eight phases, plus the 292 surviving files the branch changed outside `specs/` against merge-base `bf6806ad4b3`: 343 files in all. Ten iterations ran on `cli-claude-code`, model `opus`, effort `medium`, under the operator's second Claude account. Stop policy was max-iterations, and the run stopped at `maxIterationsReached` with every terminal gate passing.
- **Run note:** two earlier starts failed at dispatch before any review ran. The repository's recursion guard refuses a Claude Code executor started from inside a Claude Code session. The operator authorised an override, and the loop then ran from a detached process without the parent session's environment. Both failed starts are archived under `review-archive/`.

## 2. Planning Trigger

`/speckit:plan` is optional rather than required. Every finding is P2, and the only reason for CONDITIONAL is search debt. Under the review contract, that points first to another `/deep:review` over the deferred `fixture_realism` class. The P2 items are still worth one small fix pass, grouped into the workstreams in section 4.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": [
      {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1244"},
      {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:761"},
      {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:949"},
      {"id": "R9-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1497"},
      {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:446"},
      {"id": "R3-P2-003", "severity": "P2", "file": ".github/workflows/advisory-checks.yml:3"},
      {"id": "R7-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md:19"},
      {"id": "R3-P2-001", "severity": "P2", "file": "024-ollama-lane-removal/goal.md:88"},
      {"id": "R3-P2-002", "severity": "P2", "file": "024-ollama-lane-removal/005-shared-embeddings-package/goal.md:78"},
      {"id": "R10-P2-001", "severity": "P2", "file": "024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md:126"}
    ],
    "remediationWorkstreams": [
      "WS-1 residue tool hardening: R2-P2-001, R9-P2-001, R1-P2-001",
      "WS-2 gate limits made explicit: R1-P2-002, R4-P2-001",
      "WS-3 push-trigger wording: R3-P2-003, R7-P2-001",
      "WS-4 packet completion metadata: R3-P2-001, R3-P2-002, R10-P2-001"
    ],
    "specSeed": ["Residue tool refuses to delete a non-socket server file", "M7 reports NOT_CHECKED for an unparseable dotenv file", "Docs state the gate's push branch filter and its whole-file allowlist limit"],
    "planSeed": ["Add isSocket check in deleteServerFile", "Honour result.valid in checkDotenv", "Parse the node script path without splitting on spaces", "Reword three every-push claims", "Reconcile 024 goal, 005 status rows and 001/006 CHK evidence"],
    "findingClasses": ["destructive-path hardening gap", "false-negative status in a residue check", "input-parsing edge case", "gate blind spot", "documentation drift in an audit artifact", "doc-to-config claim drift", "doc-code drift", "completion-metadata drift", "evidence-less checklist rows"],
    "affectedSurfacesSeed": ["sweep-lane-residue.mjs", "sweep-lane-residue.vitest.ts", "lane-residue-allowlist.json", "advisory-checks.yml", "lane-residue-gate-and-cleanup.md", "024 goal.md", "005 goal.md, implementation-summary.md, acceptance-criteria.md, tasks.md, spec.md", "001 and 006 tasks.md"],
    "fixCompletenessRequired": false,
    "searchDebt": ["SL4-005 fixture_realism, deferred for budget"]
  }
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | file:line | Fix | Class |
|----|-----|-----------|-------|-----------|-----|-------|
| R2-P2-001 | P2 | correctness (security pass) | Apply deletes whatever regular file `HF_EMBED_SERVER_URL` names, with no check that it is a socket | `sweep-lane-residue.mjs:949`, `:1319`, `:1936` | Accept only a socket (or the known pid file) in `deleteServerFile`; report anything else as a note | destructive-path hardening gap |
| R9-P2-001 | P2 | correctness | M7 drops lane keys on lines the dotenv parser rejects and still reports the check absent | `sweep-lane-residue.mjs:1497`, `:997` | When `result.valid === false`, mark the check incomplete with a note naming the file, so the status is NOT_CHECKED | false-negative status |
| R1-P2-001 | P2 | correctness | Model-server detection misses a server whose script path contains a space | `sweep-lane-residue.mjs:1244` | Match the script by suffix on the joined command line, or read argv another way, instead of splitting on whitespace | input-parsing edge case |
| R1-P2-002 | P2 | correctness | Exact-path allowlist rows exempt the whole file, so new lane text in an allowlisted live file passes repo mode | `sweep-lane-residue.mjs:761` | Either record the allowed terms per row and compare them with `matched`, or name the whole-file limit in the gate docs | gate blind spot |
| R4-P2-001 | P2 | maintainability | 32 of 47 allowlist reasons cite line numbers the check never verifies | `sweep-lane-residue.mjs:446`, `lane-residue-allowlist.json` | Drop the line numbers from reasons, or add a test that the cited lines still hold a lane term | documentation drift |
| R3-P2-003 | P2 | traceability | The gate is documented as running on every push, but the push trigger only covers `main` and `skilled/**` | `advisory-checks.yml:3`, `:23`; `008/plan.md:375` | Say "every pull request and pushes to `main` and `skilled/**`" | doc-to-config drift |
| R7-P2-001 | P2 | traceability | Catalog page repeats the every-push claim | `lane-residue-gate-and-cleanup.md:19` | Same rewording as R3-P2-003 (one fix closes both) | doc-code drift |
| R3-P2-001 | P2 | traceability | Parent goal reads unstarted: five criteria unchecked, phases logged Pending | `024/goal.md:88-92`, `:108` | Tick the criteria that hold and update the progress row through the goal log | completion-metadata drift |
| R3-P2-002 | P2 | traceability | Phase 005 docs still say Blocked and not committed, though `1f85a9dd6dd` exists and the packages are gone | `005/goal.md:78`, `005/implementation-summary.md:39`, `005/acceptance-criteria.md:67`, `005/tasks.md:102`, `005/spec.md:36`, parent `spec.md:41`, `:118` | Close T053 and AC-014 with the `npm ci` evidence and set 005 and the parent to Complete | completion-metadata drift |
| R10-P2-001 | P2 | traceability | Phases 001 and 006 tick 23 checklist rows with no evidence, four of them test claims | `001/tasks.md:126-127` and ten more; `006/tasks.md` eleven rows | Add an `Evidence:` clause to each, naming the vitest cases at `sweep-lane-residue.vitest.ts:497`, `:514`, `:529` for CHK-022 and CHK-023 | evidence-less checklist rows |

Each row's full evidence, scope proof and concrete failure case is in the iteration file that raised it: `iterations/iteration-001.md` (R1), `-002` (R2), `-003` (R3), `-004` (R4), `-007` (R7), `-009` (R9) and `-010` (R10).

## 4. Remediation Workstreams

There is no P0 or P1 work. The P2 advisories fall into four groups:

1. **WS-1 residue tool hardening** (code, with a test each): R2-P2-001 first, because it is the one path that can delete an operator file. Then R9-P2-001 and R1-P2-001.
2. **WS-2 make the gate's limits explicit:** R1-P2-002 and R4-P2-001. Both describe how the allowlist exempts whole files.
3. **WS-3 push-trigger wording:** R3-P2-003 and R7-P2-001, a three-line doc fix.
4. **WS-4 packet completion metadata:** R3-P2-001, R3-P2-002 and R10-P2-001. Spec-folder edits only.

## 5. Spec Seed

- The cleanup deletes a model-server file only when it is a socket or the known pid file.
- M7 reports NOT_CHECKED, never ABSENT, when a dotenv file holds lines the parser rejects.
- The gate's docs state its branch filter and its whole-file allowlist behaviour.

## 6. Plan Seed

- Add an `isSocket()` check to `deleteServerFile`, plus a vitest case where a text file is named by `HF_EMBED_SERVER_URL`.
- Read `result.valid` in `checkDotenv`, plus a vitest case with `EMBEDDINGS_PROVIDER: ollama`.
- Replace whitespace splitting in `nodeScriptOf`, plus a case with a space in the checkout path.
- Reword `advisory-checks.yml:23`, `lane-residue-gate-and-cleanup.md:19` and `008/plan.md:375`.
- Drop or verify the line numbers in the allowlist reasons.
- Reconcile the 024 `goal.md` criteria, the phase 005 status rows, and the CHK evidence in 001 and 006.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | M7 reports lane keys and apply only reports them, matching `001/spec.md:95` and `sweep-lane-residue.mjs:1981`. The rejected-line gap is filed as R9-P2-001. |
| `checklist_evidence` | pass | Every AC row is Met with named evidence, except 005 AC-014, which is honestly Unmet (R3-P2-002). CHK rows carry evidence in six phases, and the gaps in 001 and 006 are R10-P2-001. |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | No agent file in any runtime folder names lane vocabulary. |
| `agent_cross_runtime` | pass | The branch diff over the runtime agent folders is empty. |
| `feature_catalog_code` | partial | The catalog's M7 sentence does not qualify rejected lines (R9-P2-001), and its every-push sentence is R7-P2-001. |
| `playbook_capability` | pass | Playbook flags, ordering and ask-first semantics match the YAML and the tool. |

`AC_COVERAGE`: advisory-shortfall. One of the epic's AC rows, 005 AC-014, is still Unmet in the docs even though the work it waits on is done (R3-P2-002).

resource-map.md was not present at init, so no coverage gate ran. `review/resource-map.md` was emitted from this run's deltas.

## 8. Deferred Items

- `SL4-005` fixture realism in `sweep-lane-residue.vitest.ts:175`, deferred for budget in iteration 4. This is the item that keeps the verdict at CONDITIONAL.
- R1-P2-002 can be closed with documentation alone if per-term allowlist rows are judged too costly.

## Dimension Expansion Map

No divergent pivot ran (convergence mode default), and the frontier was not expanded (depth mode default). Saturated directions: none recorded. The second passes over correctness, security and maintainability (iterations 5, 6 and 8) found nothing new.

## 9. Search Ledger

- `searchCoverage`: required bug classes `checklist_evidence_gap` (covered) and `completion_state_drift` (ruled out as a separate class and filed through R3-P2-001 and R3-P2-002). Graph coverage mode is `graphless_fallback`.
- `candidateCoverage` covered: arbitrary file delete, checklist evidence gap, completion state drift, doc-config drift, doc drift, false-negative status, gate blind spot, input parsing.
- Ruled out with cited evidence (29 rows): among them exit-code ordering, CI privilege, command injection, comment hygiene, config compatibility, cross-tool breakage, dangling references to the 91 deleted files, dead code, destructive rewrite and AC regression.
- `searchDebt`: hasSearchDebt true. One row: `SL4-005`, `fixture_realism`, disposition deferred.

## 10. Audit Appendix

- **Convergence:** 10 of 10 iterations, stop reason `maxIterationsReached`. newFindingsRatio by run: 1, 1, 0.5, 0.14, 0, 0, 0.125, 0, 0.111, 0.1. Dimension coverage 4/4 from iteration 4. Stuck count stayed 0 and no iteration errored. The terminal gates (evidence, scope, coverage) all pass.
- **Coverage:** iterations 1, 5 and 9 correctness; 2 and 6 security; 3, 7 and 10 traceability; 4 and 8 maintainability. The per-file state is in `deep-review-strategy.md`.
- **Ruled-out claims:** see the ledger above and each iteration's Ruled Out section.
- **Sources reviewed:** the files each iteration lists under Files Reviewed, 106 file entries across the ten passes, focused on `sweep-lane-residue.mjs`, its tests and allowlist, the advisor runtime after the lane removal, the doctor commands and apply YAML, the advisory workflow, the catalog page, and every phase's spec, tasks, acceptance criteria and implementation summary.
- **Cross-reference appendix:** the core protocols are `spec_code` and `checklist_evidence`. The overlay protocols are `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability`. Their statuses are in section 7.
