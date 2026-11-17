# Review Report: Command Surfacing, Pass Ten (attach-scorer lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Lineage: `attach-scorer-10`, area `attach-scorer` of `review/review-scope-10.txt`
- Diff basis: `git -c core.fsmonitor=false diff 05f776202e0 5b2b062baef -- <area paths>`, then the whole file at HEAD
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations, threshold 0.10, stop policy convergence
- Focus: `review/review-brief-10.txt` (mention guard, shared scratch pattern, re-captured routing baseline, bench Vibe row)

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** One active P1 and three active P2 findings. `hasAdvisories` is false because the verdict is not PASS.
- **Counts the verdict used:** P0 0, P1 1, P2 3 (from `deep-review-findings-registry.json`).
- **Self-check outcomes:** the P1 passed the P0 Hunter/Skeptic/Referee and a compact skeptic/referee pass, and was confirmed at P1 in the stuck-recovery escalation pass. The three P2 were evidence-only and kept their severity in iterations 4, 5 and 7. No finding was downgraded or called a false positive; no finding was raised to P0.
- **Scope summary:** seven files, all reviewed under all four dimensions with the changed surfaces read at HEAD; the two moved baseline rows were judged under the recorded lead-index limit and no prompt corpus was opened.
- **Operator review focus (verbatim):** "Review pass ten. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-10.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule."

The branch's four changes in this area are sound where they matter: the mention guard now reads a refusal or question through inline code, bold and double quotes; the transcript scorer reads the suffix chain off the name before the route in linear time and treats `/tmp`, `/var/tmp` and `/var/folders` as scratch in both consumers; the re-captured baseline withholds the two backticked question rows and its metric arithmetic reconciles; and the bench matrix covers the Vibe runtime honestly at `not-recorded`. The one P1 is an incomplete member of the same mention-markup class the branch set out to close: a single-quoted command name still hides its lead, so a refused or asked-about command is offered.

## 2. Planning Trigger

`/speckit:plan` is **required** because an active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["AC10-P1-001", "AC10-P2-001", "AC10-P2-002", "AC10-P2-003"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "severity": "P1",
      "title": "Close the single-quote member of the mention-markup class",
      "findingIds": ["AC10-P1-001"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    },
    {
      "id": "WS-2",
      "severity": "P2",
      "title": "Pin the reversed-order suffix chain and the curly double quotes",
      "findingIds": ["AC10-P2-001", "AC10-P2-002"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts, .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts"
    },
    {
      "id": "WS-3",
      "severity": "P2",
      "title": "Write down why the apostrophe stays out of the strip",
      "findingIds": ["AC10-P2-003"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    }
  ],
  "specSeed": [
    "The mention guard drops every markup character that can surround a command name, including straight and curly single quotes, without breaking the ask and decline leads for contractions such as what's and don't.",
    "REQ-006's in-any-order suffix clause carries a reversed-order case, not only a mode-first longest chain."
  ],
  "planSeed": [
    "Add the single-quote and curly-single-quote rows to the markup table and fix the reader so the refusal and question forms withhold the command (AC10-P1-001).",
    "Add the reversed-order chain case speckit:complete:with-research:auto to the suffix cases (AC10-P2-001).",
    "Add the curly double-quote row to the markup table (AC10-P2-002).",
    "Extend the strip comment to name the apostrophe exclusion and the contraction leads it protects (AC10-P2-003)."
  ],
  "findingClasses": [
    "incomplete markup normalization in the shared mention guard",
    "requirement clause without a regression test on changed code",
    "changed character class without a regression case",
    "comment contract misses a load-bearing exclusion on a changed line"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:399",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:416",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:632",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1544"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | Location | Evidence | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|----------|----------|--------------------|-------------|---------------|-------------|------------------------|
| AC10-P1-001 | P1 | A single-quoted command name still hides a refusal or a question lead | correctness | `command-attach.ts:423` | `commandOnlyMentioned("do not run '/create:readme' yet", "/create:readme")` is false at HEAD; the plain and backticked forms are true | Remove the quotes that abut a command name (straight and curly), or teach the lead patterns to step over them, without a blanket apostrophe strip | Open | incomplete markup normalization in the shared mention guard | strip at `:423`, comment `:411-418`, call sites `:259`/`:501`, new markup table `tests/command-attach-guards.vitest.ts:172` | `command-attach.ts:423`, `:259`, `:501`, `tests/command-attach-guards.vitest.ts:172` |
| AC10-P2-001 | P2 | `REQ-006`'s in-any-order clause has no test behind it | traceability | `command-transcript-score.vitest.ts:1544` | every new suffix case is mode-first; the reversed chain starts correctly but has no assertion | Add `speckit:complete:with-research:auto` beside the longest-chain case | Open | requirement clause without a regression test on changed code | changed helper `score-command-transcripts.mjs:624-638`, new cases `:1528-1554` | `score-command-transcripts.mjs:632`, `command-transcript-score.vitest.ts:1544` |
| AC10-P2-002 | P2 | The curly double quotes in the new strip have no test of their own | maintainability | `command-attach.ts:423` | the typographic pair is stripped in code and absent from the markup table | Add one row with `\u201c...\u201d` around the command | Open | changed character class without a regression case | strip `:423`, table `tests/command-attach-guards.vitest.ts:172-184` | `command-attach.ts:423`, `tests/command-attach-guards.vitest.ts:172` |
| AC10-P2-003 | P2 | The comment says why `_` stays but not why `'` stays, and the obvious P1 fix breaks the `what's` lead | maintainability | `command-attach.ts:416` | `what's /create:readme do?` is withheld; `whats ...` is not, which is what a blanket apostrophe strip would produce | Name the apostrophe exclusion and the `what's`/`don't` leads it protects | Open | comment contract misses a load-bearing exclusion on a changed line | comment `:411-418`, strip `:423`, fold `:424`, ask leads `:399` | `command-attach.ts:416`, `:423`, `:399` |

No finding carries a waiver. The P1's claim-adjudication packet is in `iterations/iteration-001.md` with `confidence: 0.85` and a stated downgrade trigger.

## 4. Remediation Workstreams

**P1 - required before merge**

1. **WS-1, fix the single-quote lead (AC10-P1-001).** Fix the shared reader at `command-attach.ts:420-451`, not either caller, because both `attachCommand:501` and `typedCommandForTop:259` consume it. Add straight and curly single-quote refusal and question rows to the markup table. Do not strip the apostrophe everywhere: `what's` must keep working (`:399`), which is the constraint AC10-P2-003 asks to document.
2. **Verify the fix at both call sites.** The P1 is one predicate with three consumers (`attachCommand`, `typedCommandForTop`, `scorer/fusion.ts:1213`); a passing unit table is necessary but a hub-level probe on one refused prompt and one question prompt is the reach evidence.

**P2 - advisories, schedule after the P1**

3. **WS-2, pin the untested members.** Add the reversed-order chain (`speckit:complete:with-research:auto`) to the suffix cases and the curly double-quote pair to the markup table. Both behaviours are correct today; the cases exist to keep them.
4. **WS-3, write the apostrophe constraint.** Extend the strip comment with the one sentence that stops the next maintainer from completing the class destructively.

## 5. Spec Seed

- The mention guard drops every markup character that can surround a command name, including straight and curly single quotes, without breaking the ask and decline leads for contractions (`what's`, `don't`).
- `REQ-006`'s in-any-order suffix clause carries a reversed-order case, not only a mode-first longest chain.
- The markup table covers every character class the strip names: backtick, asterisk, straight double quote, curly double quote, straight single quote and curly single quote.

## 6. Plan Seed

1. Add the failing single-quote rows first (refusal and question) to `tests/command-attach-guards.vitest.ts`; confirm they fail at HEAD.
2. Change the reader so quotes that abut the command name are stepped over; keep `what's`, `don't`, `dont` and the existing or-list cases green.
3. Add the reversed-order suffix row and the curly double-quote row.
4. Extend the comment with the apostrophe exclusion and the contraction leads it protects.
5. Re-run the advisor suite, typecheck, FLOOR and EVAL; the pass-nine and alignment-final evidence files name the expected lines.

## 7. Traceability Status

**Core Protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | pass | `REQ-006` (`038-alignment-p1-remediation/spec.md:137`) matches `score-command-transcripts.mjs:624-638`, `:1368`, `:1461-1468`, `:721`; `REQ-003` anchor pinned at `command-attach-guards.vitest.ts:474`; `AC-006` evidence `scratch/after-pass-nine.txt` prints build/typecheck exit 0, 2339 passed 0 failed both ways, FLOOR 24/44 0/35 2/44 and EVAL [160,49,21,5] | None on the requirement rows. The D-01 mention fix leaves the single-quote input uncovered (AC10-P1-001) and the reversed-order clause unpinned (AC10-P2-001) |
| `checklist_evidence` | notApplicable | the phase-parent packet has no `checklist.md` | None |

`AC_COVERAGE`: **exempt**. The target root has no `acceptance-criteria.md`, `checklist.md` or `implementation-summary.md`; the phase children own their own rows.

**Overlay Protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill contract changed; the area is runtime code |
| `agent_cross_runtime` | notApplicable | No agent definition changed |
| `feature_catalog_code` | notApplicable | No catalog row names these files |
| `playbook_capability` | notApplicable | No playbook claim covers the scorer or the bench |

## 8. Deferred Items

- The `capturedAtSha` value `dae6d02810e` predates the D-01 fix that produced the moved rows. The slice test at `tests/command-routing-slice.vitest.ts:320` defines the field as the checkout that ran the capture and deliberately does not compare it, so this is a documented practice rather than a defect; if a future reader wants the field to be a reproducibility pin, it needs a separate change.
- The pre-existing per-occurrence prefix scan in `commandOnlyMentioned` is superlinear on a pathological prompt; the 64 KiB prompt cap and the 3 s hook timeout bound it, and the diff does not change its shape.
- A symlink under a scratch folder that points into the checkout remains a recorded contract limit: the scorer compares path text and never resolves links.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept directions: none
- Pivot lineage: none
- Selected review directions: correctness, security, traceability, maintainability, then confirmation, cross-reference and a stuck-recovery severity escalation
- Remaining frontier: none recorded

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* The run used v1 iteration records; the reducer reports `searchDebtCount: 0`, `candidateCoverage: []`, `requiredBugClasses: []` and no blocked or deferred bug classes. `ruledOutCandidates` and `cleanSearchProof` are empty in reducer state.

## 10. Audit Appendix

### Convergence Summary

| Iteration | Focus | Ratio | Findings | Decision |
|-----------|-------|-------|----------|----------|
| 1 | correctness | 1.00 | 0 P0 / 1 P1 / 0 P2 | CONTINUE (noStopCandidate) |
| 2 | security | 0.00 | 0 / 0 / 0 | CONTINUE (noStopCandidate) |
| 3 | traceability | 0.17 | 0 / 0 / 1 | CONTINUE (noStopCandidate) |
| 4 | maintainability | 0.22 | 0 / 0 / 2 | CONTINUE (noStopCandidate) |
| 5 | confirmation | 0.00 | 0 / 0 / 0 | CONTINUE (graph_convergence_continue) |
| 6 | cross-reference | 0.00 | 0 / 0 / 0 | STUCK_RECOVERY (stuckThresholdReached) |
| 7 | severity escalation | 0.00 | 0 / 0 / 0 | STOP converged (composite_converged) |

- Stop reason: `converged`; terminal decision `STOP` with `composite_converged`.
- Final graph signals: dimensionCoverage 1, findingStability 1, p0ResolutionRate 1, evidenceDensity 1, hotspotSaturation 1 (score 1).
- Graph repair: one EVIDENCE_FOR edge id was reused between iterations 1 and 3, which dropped the P1's edge from the coverage graph and held `evidenceDensity` at 0.75; the P1 edge was re-emitted under a unique id (`edge:evidence-001-for-finding`) before the terminal decision.
- Stuck recovery: after two zero-finding passes the loop ran one escalation pass (`escalate-severity-review`), which re-checked the P1 against the call paths and confirmed it is an unfit offer, not an execution path.

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability, all complete, plus confirmation, cross-reference and recovery passes.
- Files: all seven scope files read under at least two dimensions, and all seven under correctness.
- Core protocols: `spec_code` recorded in iterations 1, 2, 3, 4, 5, 6 and 7; `checklist_evidence` recorded `notApplicable` each time.
- Holdout rule: no prompt corpus opened, no `git diff/show/log -p` over a corpus path, no `--summary` run, no session text printed.

### Ruled-Out Claims

- A suffix followed by a file extension reading as the command: recorded limit.
- The two moved baseline rows as a defect: recorded lead-index limit; the metric arithmetic reconciles.
- The shared scratch pattern as a security regression: `REQ-006` owns it and F1 records the trade-off as an open P2.
- Quadratic suffix parsing: linear pop, measured in `AC-006`.
- `capturedAtSha` as a reproducibility defect: defined as HEAD-at-capture by the slice test.
- The README `--write` sentence: its antecedent is the real-embedding mode.
- Regex injection, ReDoS growth, `..` escape and secret exposure: each checked and ruled out in iteration 2.
- Escalating the P1 to P0 or a P2 to P1: the escalation pass found no execution path and no behaviour break.

### Sources Reviewed

`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`; `runtime/tests/command-attach-guards.vitest.ts`; `runtime/scripts/routing-accuracy/score-command-transcripts.mjs`; `runtime/tests/command-transcript-score.vitest.ts`; `runtime/scripts/routing-accuracy/command-routing-baseline.json`; `runtime/scripts/routing-accuracy/README.md`; `runtime/bench/hook-brief-signal-noise.bench.ts`; context evidence from `runtime/tests/command-routing-slice.vitest.ts`, `runtime/lib/advisor-runtime-values.ts`, `runtime/lib/scorer/fusion.ts`, `hooks/claude/user-prompt-submit.ts`, phase 038 `spec.md`, `acceptance-criteria.md`, `scratch/after-pass-nine.txt`, `scratch/after-alignment-final.txt` and `scratch/alignment-final-dispositions.md`.

### Cross-Reference Appendix

**Core Protocols:** `spec_code` pass; `checklist_evidence` notApplicable.
**Overlay Protocols:** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` all notApplicable for this area.
