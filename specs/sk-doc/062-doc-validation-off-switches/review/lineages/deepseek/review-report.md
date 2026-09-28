---
title: "Deep Review Report — specs/sk-doc/062-doc-validation-off-switches (lineage: deepseek)"
trigger_phrases: []
---

# Deep Review Report — Doc validation off switches

<!-- Machine-owned markers preserved for reducer re-runs -->
<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

## 1. Executive Summary

**Verdict: PASS** (hasAdvisories: true — 4 P2)

- **Active findings**: 0 P0, 0 P1, 4 P2 across 5 iterations (4 dimensions + 1 broadening pass). Terminal stop: `maxIterationsReached` (`stopPolicy: max-iterations`); dimension coverage 4/4; no P0 or P1 found in any iteration.
- **Scope**: the completed 062 packet (`SPECKIT_SKIP_VALIDATION` / `SKDOC_SKIP_VALIDATION` and the `hook-flags.env` comment rule) against its 127-file manifest — the switch implementation, all four readers of the flags file, the 20 guarded sk-doc validators, the spec-kit skip path and its readers, the changelog work and entries, the contracts/references/user docs, and both packets' own docs.
- **Headline**: the switch work is sound. Precedence (environment-first, set-but-empty wins), the truthy set, the comment rule, the skip-path ordering, the guard placement and the exemptions all match the spec and its evidence on every path read; CI enforcement, the ignore status and the injection guard each hold. All four findings are P2 advisories — three documentation-completeness gaps (`.env.example`, the upcoming release entry, one wording) and one cross-reader parity edge on an artificial value.
- **Executor**: `cli-devin`, model `deepseek-v4-1-flash-max`, one fan-out lineage (`deepseek`), in-process iteration execution. All verification in this lineage is by reading plus read-only commands; the suites were not re-run (see Audit Appendix).

## 2. Planning Trigger

`/speckit:plan` is **not required** — the verdict is PASS with no P0/P1. `/create:changelog` is the next step if the operator wants these advisories recorded; the four P2 items are optional doc/parity polish and can also ride the next routine edit. The Planning Packet below is emitted per the report contract with `triggered: false`.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 4 },
  "remediationWorkstreams": [
    "WS-A (advisory): documentation completeness — add the two switches to .env.example §16 and cover them in the upcoming release entry before it is tagged (F002, F003)",
    "WS-B (advisory): precision polish — say 'space or tab' in hooks/README.md and pin the shell reader's internal-whitespace case in the cross-reader table (F004, F001)"
  ],
  "specSeed": "No spec delta required. Optional: record the two documentation omissions as a deferred-items note in the packet or the next release entry.",
  "planSeed": "Optional single task: update .env.example §16, the v4.0.0.2 entry and the hooks README sentence, then re-run the affected doc validators.",
  "findingClasses": ["cross-consumer", "instance-only"],
  "affectedSurfacesSeed": [".env.example", ".skilled/changelog/skilled/v4.0.0.2.md", ".skilled/hooks/README.md", ".skilled/hooks/shared/hook-flags.sh"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Evidence | Fix |
|----|-----|-----------|-----------|---------|----------|-----|
| F001 | P2 | correctness | `.skilled/hooks/shared/hook-flags.sh:26` | Shell truthy check deletes internal whitespace (`tr -d '[:space:]'`), so a quoted value whose internal space removal spells a truthy token (`"o n"`) reads on in the shell reader and off in the Node/Python readers. The cross-reader table has no internal-whitespace row. | `hook-flags.sh:26` vs `hook-flags.cjs:93-97`, `validation_switch.py:43-45`, `hook-flags.test.cjs:193-249` | Trim edges only in the shell mirror, or pin the divergence in the cross-reader table as a documented difference. |
| F002 | P2 | maintainability | `.env.example:399-404` | The repo's central git-hook bypass reference documents every sibling bypass (`SPECKIT_SKIP_COMMIT_MSG_VALIDATE`, `SPECKIT_SKIP_ROUTE_REMINT`, `SPECKIT_SKIP_PREPUSH_SKILL_GATE`, `SPECKIT_SKIP_PREPUSH_TRACK_GATE`) but not the two validation switches. Zero matches for either switch name in the file (positive control: same pattern matches `validate.sh:75,125,129`). | `.env.example:399-404`; `rg` sweep with positive control | Add the two switch lines beside the other bypasses, or record the omission as intentional. |
| F003 | P2 | traceability | `.skilled/changelog/skilled/v4.0.0.2.md` | The upcoming (untagged) release entry does not mention the validation switches although the switch commits (`396d26d4ff` et al., 2026-09-28 10:02 +0200) predate the entry's last update (`47432cf846`, 14:19 +0200). No release entry mentions them. | `README.md:25` ("the entry for the upcoming release … `v4.0.0.2.md`"); `git log -1` dates; `git rev-parse refs/tags/v4.0.0.2` fails | Cover the switches in `v4.0.0.2` before tagging, or confirm they are deferred to a later release entry. |
| F004 | P2 | maintainability | `.skilled/hooks/README.md:71` | The README states the comment rule as "after a space"; the implementation and every other description say "after a space or tab". (Citation corrected from `:74` to `:71` during iteration 5; the finding is unchanged.) | `hooks/README.md:71` vs `hook-flags.cjs:99-101`, `hooks/shared/README.md:25`, `hook-flags.env.example:9` | Say "after a space or tab" in the sentence, or leave it as an explanation of the example's own spacing. |

Finding lifecycle: all four are `active`; none was downgraded, contested or disproved; none was a refinement of another (each is a distinct root cause). No P0/P1 existed, so no claim-adjudication packets were required and every `claim_adjudication` event carries `passed: true` with `activeP0P1: 0`.

## 4. Remediation Workstreams

P0: none. P1: none.

**WS-A — Documentation completeness (advisory; F002, F003).** One pass adds the two switches to `.env.example` §16 and covers them in the upcoming release entry. Order: `.env.example` first (operator-facing), release entry second (before the tag). Verification: the same greps that found the gaps.

**WS-B — Precision polish (advisory; F001, F004).** One sentence change in `.skilled/hooks/README.md`; either a shell-mirror trim fix or a new cross-reader table row for the internal-whitespace case. Neither changes shipped behavior.

## 5. Spec Seed

No normative change is implied by this review. If the operator wants the advisories captured: a deferred-items line in the 062 packet naming the two documentation omissions, or the release-entry coverage in F003 once written.

## 6. Plan Seed

1. Add `SPECKIT_SKIP_VALIDATION` and `SKDOC_SKIP_VALIDATION` lines to `.env.example` §16 beside the other bypasses (F002).
2. Cover the validation switches in `.skilled/changelog/skilled/v4.0.0.2.md` before it is tagged, or note the deferral (F003).
3. Say "after a space or tab" in `.skilled/hooks/README.md:71` (F004).
4. Optionally add the internal-whitespace row to the cross-reader test table, or trim edges only in `hook-flags.sh` (F001).

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | pass | hard | `validate.sh:155-173`, `repair-derived.cjs:167-170`, `hook-flags.cjs:181-193`, `hook-flags.sh:37-49`, `validation_switch.py:87-92`, guard sweep, `.gitignore:352` | REQ-001..REQ-008 each resolve to shipped behavior; no contradictions. |
| `checklist_evidence` | partial | hard | `tasks.md:38-68`, `acceptance-criteria.md:60-67` | 10 rows re-verified by reading pass; suite-count rows (T014, T015, T016, CHK-010) are the packet's own executed claims — lineage containment forbids re-running suites. 0 fails. |

### Overlay Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `feature_catalog_code` | pass | advisory | `spec-validation-rule-engine.md:29-31`; `changelog-entry-frontmatter-check.md` vs `validate_document.py:253-258,1467,1513-1590,1666-1667`, `template-rules.json` | Catalog claims resolve in code. |
| `playbook_capability` | pass | advisory | CHG-011 (`write-global-entry-metadata.md:45-52`), scenario 458 (`nested-changelog-generator.md`) vs `validate_document.py:1702`, `nested-changelog.ts:83-84,119-123`, existing dist build | Both scenarios' commands are executable as written. |
| `skill_agent` | notApplicable | advisory | - | Spec-folder target; no skill/agent drift observed. |
| `agent_cross_runtime` | notApplicable | advisory | - | Spec-folder target. |

**AC_COVERAGE**: exempt — the packet has no `checklist.md`, so the validation-signal predicate is inactive (Level 2 folder, predicate requires `checklist.md` plus `implementation-summary.md` in-progress or later). Advisory only; it does not alter the verdict.

## 8. Deferred Items

- **P2 advisories** F001–F004 (above) — non-blocking; recorded as advisories on a PASS.
- **Packet-recorded follow-ups, confirmed accurate and left to their own tracking**: the dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions (`.skilled/scripts/install-git-hooks.sh:18,180`, `.skilled/scripts/git-hooks/README.md:103`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:31`; the current pre-commit hook does not read it and states the doc-model validator moved to CI at `:6,:52`), and the BOM asymmetry across readers (`hook-flags.cjs`/`validation_switch.py` drop it, `hook-flags.sh`/`check-dist-staleness.sh` keep it on the first name). Both are explicitly outside the packet; this review confirms the descriptions rather than re-filing them.
- **Executed-claim rows**: the suite counts in `tasks.md`/`implementation-summary.md` were not re-derived here (see Audit Appendix).
- **Unreviewed manifest areas** (partial coverage): the three 061 child phase docs (head-checked), `retrieval-conventions.md` and the retrieval test files, and several of the 20 guarded validators (verified by guard-placement sweep rather than full read).

## Dimension Expansion Map

- Saturated directions: none recorded; `divergence.saturatedDirections` empty (convergence mode `default`; no pivots prepared).
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Council artifact references: none.
- Selected review directions: D1 correctness → D2 security → D3 traceability → D4 maintainability → broadening pass (fixed by the dimension queue).
- Remaining frontier: the partial rows in §8; a single-writer run outside the lineage could close the suite rows.

## Search Ledger

*No search-depth state captured (legacy v1 record)* — `reviewDepthSchemaVersion` was not set (v1 path), so `searchCoverage`, `candidateCoverage`, `searchDebt` and `ruledOutCandidates` are absent. `hasSearchDebt: false`.

## Audit Appendix

### Iterations

| # | Focus | Files | New | Ratio | Verdict line |
|---|-------|-------|-----|-------|--------------|
| 1 | correctness | 9 + guard sweep | 1 P2 | 1.0 | PASS |
| 2 | security | 7 + 3 sweeps | 1 P2 | 1.0 | PASS |
| 3 | traceability | 5 packet docs + 2 release docs + 13 changelog entries + git history | 1 P2 | 1.0 | PASS |
| 4 | maintainability | 8 + follow-up sweeps | 1 P2 | 1.0 | PASS |
| 5 | broadening | 12 additional | 0 | 0.0 | PASS |

### Convergence Signal Replay (full-history audit)

Ratios from the stored JSONL: `[1.0, 1.0, 1.0, 1.0, 0.0]`. Rolling average (window 2) = 0.5 > 0.08 → no vote. MAD of all ratios = 0 → noise floor 0 → latest ratio 0.0 <= 0 → vote. Dimension coverage 1.0 with stabilization, but the required `checklist_evidence` protocol is `partial`, so the coverage vote's "protocols covered" condition is not met → no vote. Weighted stop score = (0.30×0 + 0.25×1 + 0.45×0) / 1.00 = **0.25** < 0.60 → the inline vote never promotes STOP. Terminal stop: iteration count 5 >= maxIterations 5 → **`maxIterationsReached`**, a terminal ceiling that bypasses the legal-stop veto per the workflow contract. The replayed decision and stop reason agree with the recorded `synthesis_complete` event.

### Evidence basis (stated plainly)

All findings and verdicts in this lineage rest on **reading** the cited files and on read-only commands (`rg`, `git log/show/check-ignore/ls-files/rev-parse`, `sed`, `python3 -c` reads, the trigger-index lookup, `date`). No test suite was executed: lineage write-containment forbids commands that write outside the lineage directory (vitest/node caches, temp fixtures), and the review contract for a detached lineage is observation, not re-execution. Where the packet's own evidence rests on executed runs, it is marked as an executed claim rather than re-derived.

### Coverage

- Dimensions: 4/4 covered (correctness 1, security 2, traceability 3, maintainability 4, broadening 5).
- Files read and assessed: ~45 of the 127-file manifest, including every file the packet modified or created and every reader/consumer surface it names; the remaining manifest areas are named in §8.
- Registry: 4 open findings (all P2), 0 resolved; severity counts P0:0 P1:0 P2:4.

### Provenance

- Lineage: `deepseek` (`cli-devin`, `deepseek-v4-1-flash-max`), session `fanout-deepseek-1790598126829-x9gy4v`, generation 1, mode `new`.
- Artifacts: this report, `deep-review-state.jsonl` (5 iteration records + events), `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `prompts/iteration-001..005.md`, `resource-map.md`.
- Process notes: the append gateway, `reduce-state.cjs`, `convergence.cjs`, `upsert.cjs`, `generate-context.js`, `loop-lock.cjs` and `synthesis-closeout.cjs` were **not run** — every one of them writes outside the lineage directory (ledgers, graph DB, spec docs, lock files) or stages into them, which the lineage containment forbids. Their outputs (registry, dashboard, strategy, state log, synthesis event) were produced directly and conform to the documented schemas. The graph-convergence events carry `graphStatus: "unavailable"` and decision `CONTINUE`; the run-5 event was corrected from an erroneous `STOP_ALLOWED` via an appended correction event. The F004 citation correction is recorded in iteration 5 and in the registry.
