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
[All dimensions complete]

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
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 3
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
### `capturedAtSha` as a reproducibility defect: the slice test at `:320` defines the field as the checkout that ran the capture and does not compare it; the reproducibility pin is the corpus hash and the live totals. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `capturedAtSha` as a reproducibility defect: the slice test at `:320` defines the field as the checkout that ran the capture and does not compare it; the reproducibility pin is the corpus hash and the live totals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `capturedAtSha` as a reproducibility defect: the slice test at `:320` defines the field as the checkout that ran the capture and does not compare it; the reproducibility pin is the corpus hash and the live totals.

### A `--write` refusal claim in the README: the sentence's antecedent is the real-embedding mode, and the script at `:800-806` refuses only `--write --real-embedding`; the fixture `--write` path stays available to the slice test. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `--write` refusal claim in the README: the sentence's antecedent is the real-embedding mode, and the script at `:800-806` refuses only `--write --real-embedding`; the fixture `--write` path stays available to the slice test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `--write` refusal claim in the README: the sentence's antecedent is the real-embedding mode, and the script at `:800-806` refuses only `--write --real-embedding`; the fixture `--write` path stays available to the slice test.

### A `..` traversal escaping the guarded-write rule: normalised before the test. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A `..` traversal escaping the guarded-write rule: normalised before the test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `..` traversal escaping the guarded-write rule: normalised before the test.

### A `REQ-006` code mismatch: every clause is present and only the reversed-order coverage is missing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A `REQ-006` code mismatch: every clause is present and only the reversed-order coverage is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `REQ-006` code mismatch: every clause is present and only the reversed-order coverage is missing.

### A new correctness, security, traceability or maintainability direction: all four dimensions are covered and the confirmation re-read found no new input. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new correctness, security, traceability or maintainability direction: all four dimensions are covered and the confirmation re-read found no new input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new correctness, security, traceability or maintainability direction: all four dimensions are covered and the confirmation re-read found no new input.

### A new finding from the cross-reference read: no new input appeared. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A new finding from the cross-reference read: no new input appeared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from the cross-reference read: no new input appeared.

### A stale `reached_top3` sentence in the README: the sentence is an upper bound and matches the 8 named plus 4 partial split. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A stale `reached_top3` sentence in the README: the sentence is an upper bound and matches the 8 named plus 4 partial split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale `reached_top3` sentence in the README: the sentence is an upper bound and matches the 8 named plus 4 partial split.

### A stale comment on `guardedWriteCounts`: its scratch list, `..` resolution and home-path clause each match the code. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A stale comment on `guardedWriteCounts`: its scratch list, `..` resolution and home-path clause each match the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale comment on `guardedWriteCounts`: its scratch list, `..` resolution and home-path clause each match the code.

### A state-integrity defect: the four state surfaces agree. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A state-integrity defect: the four state surfaces agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A state-integrity defect: the four state surfaces agree.

### A suffix followed by a file extension (`:auto.md`) reading as the command: recorded limit, no new input breaks it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A suffix followed by a file extension (`:auto.md`) reading as the command: recorded limit, no new input breaks it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A suffix followed by a file extension (`:auto.md`) reading as the command: recorded limit, no new input breaks it.

### A symlinked scratch path as a false negative: recorded contract limit from pass eight. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A symlinked scratch path as a false negative: recorded contract limit from pass eight.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A symlinked scratch path as a false negative: recorded contract limit from pass eight.

### Escalating AC10-P1-001 to P0: no automatic execution follows the offer. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Escalating AC10-P1-001 to P0: no automatic execution follows the offer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating AC10-P1-001 to P0: no automatic execution follows the offer.

### Escalating any P2 to P1: each gap leaves today's behaviour correct. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Escalating any P2 to P1: each gap leaves today's behaviour correct.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating any P2 to P1: each gap leaves today's behaviour correct.

### Quadratic suffix parsing: the pop loop reads each segment once, and `AC-006` records the 12055 ms to 8 ms measurement. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Quadratic suffix parsing: the pop loop reads each segment once, and `AC-006` records the 12055 ms to 8 ms measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Quadratic suffix parsing: the pop loop reads each segment once, and `AC-006` records the 12055 ms to 8 ms measurement.

### Re-opening any carried finding for a different severity: no new fact arrived in this pass. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-opening any carried finding for a different severity: no new fact arrived in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening any carried finding for a different severity: no new fact arrived in this pass.

### Re-opening the recorded limits or the `capturedAtSha` question. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Re-opening the recorded limits or the `capturedAtSha` question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening the recorded limits or the `capturedAtSha` question.

### Re-reporting the duplicate suffix vocabulary: recorded S9-P2-005. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Re-reporting the duplicate suffix vocabulary: recorded S9-P2-005.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the duplicate suffix vocabulary: recorded S9-P2-005.

### Re-reporting the recorded limits and the `capturedAtSha` question. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Re-reporting the recorded limits and the `capturedAtSha` question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the recorded limits and the `capturedAtSha` question.

### Re-reporting the recorded limits: S9-P2-005 duplicate vocabulary, F1 shared scratch pattern, and the `capturedAtSha` provenance question all stay in their recorded state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-reporting the recorded limits: S9-P2-005 duplicate vocabulary, F1 shared scratch pattern, and the `capturedAtSha` provenance question all stay in their recorded state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the recorded limits: S9-P2-005 duplicate vocabulary, F1 shared scratch pattern, and the `capturedAtSha` provenance question all stay in their recorded state.

### Re-reporting the shared scratch pattern: recorded F1 in the open P2 list. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Re-reporting the shared scratch pattern: recorded F1 in the open P2 list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the shared scratch pattern: recorded F1 in the open P2 list.

### ReDoS in the mention regexes: the leads hold bounded gaps and no nested quantifier over one span; the only superlinear shape is the pre-existing per-occurrence prefix slice, unchanged by this diff. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: ReDoS in the mention regexes: the leads hold bounded gaps and no nested quantifier over one span; the only superlinear shape is the pre-existing per-occurrence prefix slice, unchanged by this diff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS in the mention regexes: the leads hold bounded gaps and no nested quantifier over one span; the only superlinear shape is the pre-existing per-occurrence prefix slice, unchanged by this diff.

### ReDoS through the mention guard: bounded input plus bounded leads. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: ReDoS through the mention guard: bounded input plus bounded leads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS through the mention guard: bounded input plus bounded leads.

### Regex injection through a command name: the name is internal and escaped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Regex injection through a command name: the name is internal and escaped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex injection through a command name: the name is internal and escaped.

### Secret or credential exposure in the area: no such surface exists in the seven files. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secret or credential exposure in the area: no such surface exists in the seven files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret or credential exposure in the area: no such surface exists in the seven files.

### The `--write` sentence: its antecedent is the real-embedding mode, the only refused combination. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The `--write` sentence: its antecedent is the real-embedding mode, the only refused combination.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `--write` sentence: its antecedent is the real-embedding mode, the only refused combination.

### The `/var/tmp` widening as an unsafe-write bypass: `REQ-006` owns it and it hides no workflow-owned folder. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The `/var/tmp` widening as an unsafe-write bypass: `REQ-006` owns it and it hides no workflow-owned folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `/var/tmp` widening as an unsafe-write bypass: `REQ-006` owns it and it hides no workflow-owned folder.

### The `SCRATCH_FOLDER` widening as a security regression: `REQ-006` names `/var/tmp` and bare `/tmp` as scratch, and the dispositions record the shared-pattern trade-off as an open P2 (F1), so re-reporting it without a new input would violate the recorded-limit rule. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The `SCRATCH_FOLDER` widening as a security regression: `REQ-006` names `/var/tmp` and bare `/tmp` as scratch, and the dispositions record the shared-pattern trade-off as an open P2 (F1), so re-reporting it without a new input would violate the recorded-limit rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `SCRATCH_FOLDER` widening as a security regression: `REQ-006` names `/var/tmp` and bare `/tmp` as scratch, and the dispositions record the shared-pattern trade-off as an open P2 (F1), so re-reporting it without a new input would violate the recorded-limit rule.

### The long README cell as a style defect: pre-existing table style, no new claim broken. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The long README cell as a style defect: pre-existing table style, no new claim broken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The long README cell as a style defect: pre-existing table style, no new claim broken.

### The two moved baseline rows as a defect: judged under the recorded limit that their text is not read; the metric shift and the dispositions' lead-index evidence reconcile with the D-01 fix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The two moved baseline rows as a defect: judged under the recorded limit that their text is not read; the metric shift and the dispositions' lead-index evidence reconcile with the D-01 fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The two moved baseline rows as a defect: judged under the recorded limit that their text is not read; the metric shift and the dispositions' lead-index evidence reconcile with the D-01 fix.

### The two moved baseline rows as a defect: recorded limit plus consistent arithmetic. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The two moved baseline rows as a defect: recorded limit plus consistent arithmetic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The two moved baseline rows as a defect: recorded limit plus consistent arithmetic.

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
- Dimension: none remaining - Focus area: stop decision, then synthesis - Reason: the recovery pass confirmed the finding set and all four dimensions are covered - Rotation status: D1-D4 complete; recovery complete - Required evidence: the next convergence decision is a STOP before synthesis - Recovery note: the escalation strategy was applied and produced no severity change Review verdict: CONDITIONAL

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
| `spec_code` | core | pass | 1-7 | `REQ-006` clauses match `score-command-transcripts.mjs:624-638`, `:1368`, `:1461-1468`, `:721`; `REQ-003` anchor pinned at `tests/command-attach-guards.vitest.ts:474`; `AC-006` evidence `scratch/after-pass-nine.txt` observed. D-01 owns the mention fix with the single-quote input uncovered. |
| `checklist_evidence` | core | notApplicable | 1-7 | No `checklist.md` in this phase-parent packet. |
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
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2, D3, D4 | 7 | 0 P0, 1 P1, 2 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1, D2, D3, D4 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1, D2, D3, D4 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1, D2, D3, D4 | 6 | 0 P0, 0 P1, 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | D1, D2, D3, D4 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D1, D2, D3, D4 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | D1, D2, D3, D4 | 6 | 0 P0, 0 P1, 0 P2 | complete |
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
