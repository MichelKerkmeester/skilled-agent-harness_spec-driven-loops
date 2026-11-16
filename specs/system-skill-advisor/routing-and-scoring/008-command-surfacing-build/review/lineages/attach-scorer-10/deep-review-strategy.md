# Deep Review Strategy - attach-scorer-10

## 1. OVERVIEW

Pass-ten fan-out lineage for the `attach-scorer` area. Reviews the mention guard that
now drops inline-code, bold and quote marks before it reads a refusal or question lead
(`commandOnlyMentioned`), the shared scratch-folder pattern in the transcript scorer
(`insideCheckout`'s no-checkout fallback and `guardedWriteCounts`), the re-captured
routing baseline where two slash-variant rows moved from offered to withheld, and the
bench's Vibe row.

## 2. TOPIC

Review: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (lineage attach-scorer-10, pass 10)

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The `docs-merge` area: README.md, SKILL.md, changelog/v1.1.0.0.md, .env.example and the
  merge-resolved `sk-doc`, doctor-install-presentation, changelog and route-slice files.
- Rescoring stored sets, changing thresholds, weights or corpus rows.
- Reading holdout or prompt corpora; printing session text from a CLI session store.
- Changing code under review. This lineage reports findings only.

---

## 5. STOP CONDITIONS

- Convergence at the configured threshold (0.10) once every dimension is covered.
- `maxIterations` 8.
- Any active P0 stops a PASS verdict regardless of convergence.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | CONDITIONAL | 1 | One P1: a single-quoted command name still hides a refusal or question lead in `commandOnlyMentioned`; the scorer, scratch and baseline arithmetic reconcile. |

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Probing the mention guard directly at HEAD with `node --import tsx` separated the quote spellings and showed the single-quote gap that the new table does not cover (iteration 1).
- Reading `REQ-006`/`AC-006` beside the scorer diff named every changed clause and kept the scratch widening out of the findings (iteration 1).
- Reconciling `slash_variant.reached_top3` and `agreement` against the two moved rows showed the baseline arithmetic is consistent (iteration 1).

---

## 9. WHAT FAILED

- Reading the first 8 `sv-*` rows only: the packet's `named_total: 8` counts eight named rows plus four partial rows, so the initial count looked short until the whole `slash_variant` set was enumerated (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- A suffix followed by a file extension: recorded limit, no new input breaks it (iteration 1).
- The two moved baseline rows as a defect: judged without their text under the recorded limit; the lead-index disposition and the metric arithmetic reconcile (iteration 1).
- The scratch-folder widening as a security regression: `REQ-006` owns `/var/tmp` and bare `/tmp`, and F1 records the shared-pattern trade-off as an open P2 (iteration 1).
- Quadratic suffix parsing: the pop loop reads each segment once; `AC-006` records the linear measurement (iteration 1).
- The README's `--write` sentence as a false claim: its antecedent is the real-embedding mode, which is the only refused combination (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security
- Focus: the four changed surfaces under a trust-boundary read, especially prompt text in `commandOnlyMentioned` and paths in `insideCheckout`/`guardedWriteCounts`
- Reason: correctness is complete with one active P1; the security dimension is next uncovered
- Rotation status: D1 complete, D2-D4 pending
- Required evidence: a finding names an in-reach input and a `file:line`; a scratch-widening claim names the requirement that owns it

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `command-attach.ts` (mention guard at 409-451, use at 259 and 501),
  `score-command-transcripts.mjs` (commandParts 610-640, insideCheckout 716-742,
  selfChosenAuto 1450-1470, guardedWriteCounts 1520-1545), `command-routing-baseline.json`
  (slash_variant rows sv-06 and sv-08), `README.md` cell for the capture script, and
  `bench/hook-brief-signal-noise.bench.ts` (SEVEN_AXIS_MATRIX).
- Behavior claims: an offer reads a refusal or question about a command as a mention
  even when the name is backticked, bolded or quoted; the scratch-folder pattern is
  shared by the no-checkout fallback and the guarded-write check; the re-captured
  baseline withholds two slash-variant rows because both ask a question; the bench
  matrix enumerates every advisor runtime.
- Reuse and conventions: `MODE_SUFFIX` was a single regex before, now `WITH_MODIFIER`
  and `SUFFIX_WORD` are shared by `commandParts`, `SELF_AUTO` and `selfChosenAuto`.
- Review risks and gaps: no `resource-map.md` in the packet; the baseline's two moved
  rows are judged only by `lead-diag.mjs` lead indices per the recorded limit; no
  holdout or prompt-corpus read is permitted.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | notApplicable | - | Target is runtime code, not a skill contract |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition changed |
| `feature_catalog_code` | overlay | notApplicable | - | No catalog row names these files |
| `playbook_capability` | overlay | notApplicable | - | No playbook claim covers the area |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | - | - | 0 | pending |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | - | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-attach-scorer-10-1794847584683-k2l24m, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T16:49:26.000Z
<!-- MACHINE-OWNED: END -->
