# Review Report — 002-request-quality-aggregation (lineage p017c002-opus)

Fan-out lineage: `p017c002-opus` · Executor: `cli-claude-code` / `claude-opus-4-8` ·
Iterations: 1 (maxIterations=1) · Stop reason: maxIterations reached.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true`

| Severity | Active |
|----------|--------|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

**Scope.** The `assessRequestQuality` change in
`mcp_server/lib/search/confidence-scoring.ts` (top-dominant `topScore >= 0.8`;
margin-aware `topScore >= 0.7 && (qualityRatio >= 0.6 || topMargin >= 0.15)`; quality
ratio capped at the 5-result head) and its new focused test, plus the packet's
specification and metadata documents.

**Headline.** The **code change is PASS-quality**: logic is correct, edge cases are
guarded, there is no security surface, and the branch logic traces cleanly against all
six new tests and the existing `d5-confidence-scoring` / `absolute-relevance-calibration`
expectations. The CONDITIONAL verdict is driven entirely by **packet
traceability/completion gaps**: completion metadata is not reconciled (graph-metadata
still says `planned`), the spec/plan/tasks are unfilled scaffolds so the core `spec_code`
protocol has no baseline, and the packet is marked 100% complete while the change is not
actually live (dist unbuilt, `dist-freshness` test red).

**Convergence.** Single-iteration fan-out lineage; all four dimensions covered in one
pass. No P0 → verdict is not FAIL. Active P1s → CONDITIONAL.

---

## 2. Planning Trigger

CONDITIONAL routes to **`/speckit:plan` for fixes**. The remediation is small and
mechanical (metadata refresh, spec backfill or re-classification, dist build) — it does
not require re-implementing the scoring logic. None of the P1s touch shipped code
correctness or security.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last |
|----|-----|-----|-------|----------|------------|
| F001 | P1 | traceability | Completion metadata not reconciled — graph-metadata `Status: planned` + stale Key Files vs impl-summary `completion_pct: 100` | `graph-metadata.json:3`, `implementation-summary.md:26` | 1/1 |
| F002 | P1 | traceability | spec.md/plan.md/tasks.md are verbatim scaffolds; `spec_code` core protocol has no normative baseline; no checklist.md | `spec.md:85-127`, `tasks.md:53-77` | 1/1 |
| F003 | P1 | traceability | 100% complete claimed while change not live (runtime runs `dist/`, source unbuilt, `dist-freshness.vitest.ts` FAIL) | `implementation-summary.md:109`, `:117` | 1/1 |
| F004 | P2 | maintainability | Summary says "weak/gap thresholds unchanged" but `qualityRatio` denominator changed to head-capped, shifting the gap→weak boundary | `implementation-summary.md:61`, `confidence-scoring.ts:370-375` | 1/1 |
| F005 | P2 | maintainability | No test pins the `0.7 <= topScore < 0.8 && ratio < 0.6 && margin < 0.15` fall-through-to-weak case | `request-quality-aggregation.vitest.ts:36-87`, `confidence-scoring.ts:389-395` | 1/1 |

---

## 4. Remediation Workstreams

**Lane A — Completion-metadata reconciliation (F001, F003).** Run
`generate-context.js` for the packet to set graph-metadata status to a completed state
and refresh Key/Source Docs to include `implementation-summary.md` and the changed code
files. Run `npm run build` so the runtime picks up the source change and
`dist-freshness.vitest.ts` goes green; then the "complete" claim is true. Order: build →
metadata refresh.

**Lane B — Specification baseline (F002).** Either populate `spec.md` with the real
requirement (top-dominant + margin-aware rule, acceptance criteria for good/weak/gap) and
`tasks.md` with the actual task records, or explicitly record in the packet that
`implementation-summary.md` is the canonical artifact and resolve the Level label.

**Lane C — Doc + test hygiene (F004, F005).** Correct the "thresholds unchanged" wording
to note the head-capped ratio denominator; add a test asserting the near-equal
strong-top-two case falls through to `weak`.

---

## 5. Spec Seed

> The request-quality verdict MUST read `good` when the top hit is dominant
> (`topScore >= 0.8`) regardless of the tail, OR when `topScore >= 0.7` and either the
> 5-result head is mostly confident (`qualityRatio >= 0.6`) or the top hit clearly
> separates from the runner-up (`topMargin >= 0.15`). The `qualityRatio` denominator MUST
> be capped at the ranking head (K=5) so recall expansion does not depress the verdict.
> The weak/gap safety net MUST remain for low-signal sets. Acceptance: the six fixtures in
> `request-quality-aggregation.vitest.ts` plus a fall-through-to-weak fixture (F005).

This seed exists to backfill F002 — the current `spec.md` contains none of it.

---

## 6. Plan Seed

1. `npm run build` in `mcp_server`; confirm `dist-freshness.vitest.ts` green. (F003)
2. `generate-context.js --json '{"specFolder":"<packet>", ...}'` to reconcile
   graph-metadata status + key files. (F001)
3. Backfill `spec.md`/`tasks.md` from the Spec Seed, or record impl-summary-canonical +
   fix the Level 1-vs-2 label. (F002)
4. Edit `implementation-summary.md:61` wording; add fall-through-to-weak test. (F004, F005)

---

## 7. Traceability Status

| Level | Protocol | Status | Gate | Evidence |
|-------|----------|--------|------|----------|
| Core | spec_code | **fail** | hard | `spec.md:85-127` — verbatim scaffold, no claims to trace |
| Core | checklist_evidence | skipped | hard | no `checklist.md` (description.json level=1) |
| Overlay | feature_catalog_code | n/a | advisory | internal scoring helper; no catalog claim |
| Overlay | playbook_capability | n/a | advisory | no playbook scenario for request-quality |

Unresolved gap: the hard-gated `spec_code` protocol cannot pass until F002 is remediated.
Note: severity is held at P1 (incomplete baseline), not P0 — there is no code-vs-spec
*contradiction*, only an *absent* spec; the shipped logic itself is correct.

---

## 8. Deferred Items

- **F004 (P2):** prose imprecision in the implementation summary; advisory.
- **F005 (P2):** test-coverage gap for the in-band fall-through; advisory.
- **Test execution deferred:** `vitest`/`npx` were permission-blocked in this fan-out
  runtime. Code correctness was confirmed by manual branch-logic trace against the
  fixtures and the implementation-summary's self-reported PASS (102 tests, 6 files). A
  follow-up should re-run `vitest run tests/request-quality-aggregation.vitest.ts` plus
  the calibration/confidence suites to convert the trace into executed evidence.

---

## 9. Audit Appendix

**Coverage matrix.**

| Dimension | Covered | Result |
|-----------|---------|--------|
| Correctness | yes | PASS — no defects; guards on empty/single/`head>0` verified |
| Security | yes | PASS — no I/O, path, env, or persistence surface |
| Traceability | yes | 3× P1 (F001–F003) |
| Maintainability | yes | 2× P2 (F004–F005) |

**Convergence replay.** Single iteration; `newFindingsRatio=0.80`; P0 override not
triggered (0 P0). Stop reason: maxIterations=1 reached. Replay of the JSONL synthesis
event agrees with the recorded verdict (CONDITIONAL, P0=0/P1=3/P2=2, coverage=1.0).

**Claim adjudication.** F001, F002, F003 each carry a typed packet
(`iterations/iteration-001.md` § Claim Adjudication) with evidence refs, counterevidence
sought, alternative explanation, confidence, and downgrade trigger. Adjudication event
`passed:true`.

**Code verification note (confirmed vs inferred).** *Confirmed by read:* the
`assessRequestQuality` branch logic (`confidence-scoring.ts:355-398`), the constants
(`:67`, `:72`), the test fixtures, the scaffold state of spec/plan/tasks, graph-metadata
`Status: planned`, and absence of `checklist.md`. *Inferred (not executed here):* the
102-test green result — taken from `implementation-summary.md` self-report plus a manual
trace, not a re-run in this lineage. The claim most likely to be wrong: F003's P1
severity, which would drop to P2 if the packet's definition of done explicitly scopes it
to source+tests with the build tracked separately (no such DoD currently exists because
`plan.md` is unfilled).

Review verdict: CONDITIONAL
