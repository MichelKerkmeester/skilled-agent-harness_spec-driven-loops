# Deep Review Report — lineage sonnet5-xhigh

**Target:** `specs/sk-communication/006-sk-communication-clarity` (spec-folder, phase-parent packet, 9 children)
**Executor:** cli-claude-code, model claude-sonnet-5, reasoningEffort xhigh
**Session:** fanout-sonnet5-xhigh-1789399870247-b3u57o | generation 1 | lineageMode new
**Iterations:** 5 of 5 (`maxIterations: 5`, `stopPolicy: max-iterations`) | stopReason: `maxIterationsReached`

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (`hasAdvisories: true`)

- Active findings: **0 P0**, **2 P1**, **4 P2**
- Scope: the sk-communication clarity program's engine change (phase 004: the copy-editing instruction now resolves from the wording standard's one home, plus a new claim-omission fidelity veto and no-op/reworded classification), the repo-rules split (phase 003), the wording-standard restructure (phase 007), the two adjacent-surface candidates (phase 009), the verification harness (phase 005), and the parent packet's own completion bookkeeping (`goal.md`).
- All 4 review dimensions covered (correctness, security, traceability, maintainability); both core traceability protocols exercised (`spec_code`: pass, `checklist_evidence`: fail); both overlay protocols exercised (`feature_catalog_code`: pass, `playbook_capability`: fail).
- Neither P1 blocks shipped behavior directly — one is a documentation-completeness contradiction inside the packet's own governing file (F003), the other is a test-coverage gap on new safety-relevant logic (F005) — but both represent real gaps against the packet's own stated bar (`goal.md` D7: "every rule edit passes check-repo-rules.cjs 9/9, every packet edit passes strict validation," and the repo's changed-behavior-gets-coverage quality standard).
- No P0 findings. The core engine change (single-instruction resolution, layered fidelity vetoes) held up under adversarial checking, including a hypothesized negation-bypass of the new claim-coverage check that turned out to be covered by an earlier-running polarity check.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for fixes. Both P1s are narrow, single-file-scoped remediations (see Remediation Workstreams below) — neither requires a new phase or a spec amendment, both fit as small follow-up tasks against the already-Complete 004 and the parent `goal.md`.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last Seen |
|----|----------|-----------|-------|----------|------------------|
| F003 | P1 | traceability | `goal.md` completion-criteria row unchecked despite fully-Met child evidence and the same file's own LOG table | `specs/sk-communication/006-sk-communication-clarity/goal.md:96,120-121` | 3 / 3 |
| F005 | P1 | maintainability | New claim-omission fidelity veto and no-op classification ship with zero test coverage | `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts:130`, `validator.ts:229,267` | 4 / 4 |
| F001 | P2 | correctness | Fidelity `checks` array shrinks silently on the no-op rewrite path (informational only, does not affect accept/reject) | `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:212-238` | 1 / 1 |
| F002 | P2 | correctness/maintainability | `AcceptedProjection.changeKind` added to a contract type with no construction call site anywhere in `src/` or `test/` | `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/projection.ts:29-33` | 1 / 1 |
| F004 | P2 | traceability | Stale continuity/status metadata (`Status: Draft`, `completion_pct: 0`, obsolete `blockers`) in 006 and 008's `acceptance-criteria.md` frontmatter | `006-reply-shape-rules/acceptance-criteria.md:18-28`, `008-decision-and-handoff-rules/acceptance-criteria.md:18-28` | 3 / 3 |
| F006 | P2 | traceability | `manual-testing-playbook.md` has no scenario covering any phase-004 addition | `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` | 4 / 4 |

All six findings are supported by direct `file:line` evidence read during this lineage's iterations; none rely on inference alone. F003 and F005 carry full claim-adjudication packets (iterations 3 and 4 respectively), both adjudicated with `passed: true` (no missing/invalid fields), `finalSeverity` unchanged from initial assertion.

## 4. Remediation Workstreams

1. **Fix the completion-checklist contradiction (F003)** — Tick `goal.md:96`'s row (or, if the operator intends a distinct unmet gate, replace the row with a concrete description of what remains and un-mark the LOG's "Done" entries for 006/008 accordingly — the two must agree). Single-file, single-line change. Depends on nothing else in this list.
2. **Refresh stale child continuity metadata (F004)** — Update `_memory.continuity` (`completion_pct`, `blockers`, `next_safe_action`) and the `## 1. METADATA` `Status` line in `006-reply-shape-rules/acceptance-criteria.md` and `008-decision-and-handoff-rules/acceptance-criteria.md` to reflect their actual Complete state. Same root cause as F003 (closure step that should sync these fields ran inconsistently); fixing both together in one pass is reasonable.
3. **Add direct unit tests for the claim-omission veto and no-op classification (F005)** — Extend `test/fidelity/validator.test.ts` (or a new `test/fidelity/semantics.test.ts`) with: (a) a case where a candidate drops a claim-bearing sentence's content word and confirm `CLAIM_OMITTED` fires, (b) a case where the candidate is byte-identical to source and confirm `changeKind: 'no-op'` on the accepted outcome, (c) a case where the candidate is a genuine rewording and confirm `changeKind: 'reworded'`. Independent of workstreams 1-2.
4. **Add a manual-testing-playbook scenario for the phase-004 additions (F006)** — One new `COMM-0NN` entry exercising the claim-omission veto and/or the no-op recording end-to-end, following the existing scenario format (COMM-001 through COMM-009). Advisory-gated; lowest priority of the four.
5. **(Optional, informational-only) Restore checks-array symmetry or document the tradeoff (F001)** — Either move the five `passed()` pushes back outside the `if (restored.text !== sourceText)` guard in `validator.ts`, or add a one-line comment at `validator.ts:212` explaining why the no-op path intentionally omits them. Does not affect the accept/reject decision; purely an audit-trail clarity item.
6. **(Optional, informational-only) Wire or remove the unconstructed `AcceptedProjection` contract type (F002)** — Either have the orchestrator layer construct `AcceptedProjection` from `AcceptedFidelityOutcome` where the two are meant to connect, or note in the type's doc comment that it is a forward-looking contract not yet wired to a producer. Pre-existing condition this packet's diff perpetuated rather than introduced; lowest priority.

## 5. Spec Seed

No spec.md amendment required. F003's fix is a data correction inside `goal.md` itself (the packet's own completion gate), not a scope or requirement change — `goal.md` §2 "Precedence" already states "Name a conflict rather than resolving it silently," which is exactly what this report does.

## 6. Plan Seed

A single small follow-up task set (workstreams 1-4 above) is sufficient; no new phase folder is needed since all four fixes touch files already owned by phases 002/006/008 (checklist + metadata) and phase 004 (tests + playbook). Suggested order: F003 first (it's the actual closure-gate blocker), F004 alongside it (same files, same root cause), then F005 and F006 independently.

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| `spec_code` | core | hard | **pass** | Router rows for both repo-rules-split halves (iter 1); 9-ADR count exact match (iter 3); 29-row allocation-table arithmetic exact match (iter 3); 007's 449+153 line split exact match (iter 5); 005's release-gate fail-by-design with named blocking rows C1/C6 (iter 5); D6 no-new-AGENTS.md-clause confirmed via empty working-tree diff (iter 5) |
| `checklist_evidence` | core | hard | **fail** | `goal.md`'s own completion checklist contradicts its own LOG table and both owning children's fully-Met acceptance criteria — F003 |
| `feature_catalog_code` | overlay | advisory | **pass** | `feature-catalog.md:119` narrates the phase-004 behavior (claim-omission check, no-op recording, cached single instruction) precisely and currently |
| `playbook_capability` | overlay | advisory | **fail** | No manual-testing-playbook scenario exercises any phase-004 addition — F006 |

Net: both core protocols were exercised (satisfying the coverage quality gate's "must be covered" requirement), but `checklist_evidence` returned a `fail` outcome, which is the direct evidentiary basis for F003 and the CONDITIONAL verdict.

## 8. Deferred Items

- F001, F002, F004, F006 (all P2) are advisories under a PASS/CONDITIONAL verdict — none block shipping, all are listed as remediation workstreams 2/4/5/6 above for the operator's discretion on sequencing.
- The full `process.env` passthrough to external-CLI subprocesses (`src/transports/cli.ts:221`) was identified as a real, broader trust-surface observation but explicitly ruled out as an active finding of this review — it is unchanged by this packet's diff and `spec.md` §3 freezes the projection package's privacy/provider invariants as packet 001's scope. Recorded here as a pointer for a future review of packet 001, not as a finding of packet 006.
- The "powered blind human study" release-gate condition is explicitly and honestly marked unmeasurable by the packet's own `release-gate.md` GAP section — not a finding, since the packet already discloses this rather than overclaiming it.

## 9. Audit Appendix

### Iteration Table

| Iteration | Dimension(s) | Files Reviewed | New Findings | newFindingsRatio | Duration |
|-----------|--------------|-----------------|---------------|-------------------|----------|
| 1 | correctness | 14 | 0 P0, 0 P1, 2 P2 | 0.15 | ~15 min |
| 2 | security | 4 | 0 P0, 0 P1, 0 P2 | 0.00 | ~10 min |
| 3 | traceability | 5 | 0 P0, 1 P1, 1 P2 | 0.55 | ~15 min |
| 4 | maintainability | 9 | 0 P0, 1 P1, 1 P2 | 0.45 | ~15 min |
| 5 | broaden (correctness, traceability) | 7 | 0 P0, 0 P1, 0 P2 | 0.00 | ~15 min |

Cumulative distinct files reviewed across all iterations: 38 (some files, e.g. `goal.md`, cross-referenced across iterations 2-3).

### Convergence Signal Replay

`stopPolicy: max-iterations` was configured for this lineage, so convergence math was computed but never used to gate stopping — per dispatch instructions, signals before iteration 5 were treated as telemetry only and the loop broadened scope instead of synthesizing early. Observed `newFindingsRatio` sequence: 0.15, 0.00, 0.55, 0.45, 0.00 (mean 0.23). Dimension coverage reached 100% (4/4) after iteration 4; iteration 5 was a deliberate broaden pass per the dispatch contract, not a stuck-recovery or re-tread cycle. `stopReason` recorded in the final JSONL synthesis event: `maxIterationsReached` (matches the required contract).

### Dimension Breakdown

| Dimension | Verdict | Active Findings |
|-----------|---------|------------------|
| Correctness | PASS (advisories) | F001, F002 (both P2) |
| Security | PASS | none |
| Traceability | CONDITIONAL | F003 (P1), F004, F006 (P2) |
| Maintainability | CONDITIONAL | F005 (P1) |

### Claim Adjudication Summary

| Finding | Packet Recorded | Adjudicated Severity | Confidence | Passed Validation |
|---------|-------------------|------------------------|------------|---------------------|
| F003 | iteration-003.md | P1 | 0.80 | Yes |
| F005 | iteration-004.md | P1 | 0.82 | Yes |

Both packets carry all required fields (`findingId`, `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`, `transitions`) per `deep-review-findings-registry.json` and `deep-review-state.jsonl`'s `claim_adjudication` events (both `passed: true`).

### Fan-Out Lineage Note

This report covers only the `sonnet5-xhigh` lineage's independent pass over the target. It was executed as a detached, self-contained review packet under `specs/sk-communication/006-sk-communication-clarity/review/program-review/lineages/sonnet5-xhigh/` — every state file in this directory tree (`deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-{001..005}.md`, this report) was produced inline by this lineage's own executor, with no nested CLI/agent dispatch. Cross-lineage merge (strongest-restriction across sibling lineages, if any exist under `../`) is the parent fan-out orchestrator's responsibility, not this lineage's.
