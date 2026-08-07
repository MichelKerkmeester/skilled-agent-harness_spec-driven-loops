# Iteration 003: Security — mk-goal.js attack surface (post-phase-010/011/013/014)

## Focus

- Dimension: security
- Goal: validate the security-relevant code paths in `mk-goal.js`
  (prompt-injection clamp, role-label neutralizer, secret redaction,
  disabled-flag inertness) against the current code, and cross-check
  the four-reviewer audit dossier's claims against the live state.
- Files touched in this iteration: read-only.

## Scorecard

- Dimensions covered: security
- Files reviewed: 1 (mk-goal.js at 2657 lines), 2 test files
- New findings: P0=0 P1=2 P2=2
- Refined findings: 0
- New findings ratio: 1.0 (4/4 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F010 — Four-reviewer audit dossier lists F1, F2, F4, F5, F6, F7, F8-F12
  findings as "to be fixed in phase 016", but at least F4 (disabled-flag
  inertness) and F5 (role-label sanitizer bypass) are already mitigated
  in current code** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/scratch/2026-07-03-four-reviewer-audit-findings.md`
  §A lists F4 (P2, mk-goal.js:1752-1839) as "disabled flag that leaves
  event-driven writes running" and F5 (P2, mk-goal.js:199-202) as the
  role-label neutralizer prefix class. The current code at
  `.opencode/plugins/mk-goal.js:2496` has
  `if (!eventOptions.enabled) return;` early-return inside `handleEvent`,
  and a regression test in
  `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:652` ("disabled
  plugin events leave the state directory unchanged") explicitly pins
  that behavior. The role-label neutralizer at
  `.opencode/plugins/mk-goal.js:339-343` uses a broader prefix class
  `[^\p{L}\p{N}_-]` (covers punctuation) plus `foldRoleToken` at
  `.opencode/plugins/mk-goal.js:327-329` which folds Cyrillic/Greek
  homoglyphs via the `ROLE_HOMOGLYPHS` table at lines 60-92. The test
  `mk-goal-state.test.cjs:392` confirms
  `objective: [goal-marker-redacted] system-role: [instruction-redacted]`.
  This means phase 016's REQ-004 (F4 fix) and F5 fix will land on already
  fixed code, producing either no-op diffs or duplicate work.
  - Category: security (with traceability impact)
  - Source evidence: dossier §A F4/F5 entries, mk-goal.js:2496, 339-343,
    ROLE_HOMOGLYPHS table 60-92, lifecycle test 652, state test 392/394/419/420.
  - Affected surface hints: `["scratch/2026-07-03-four-reviewer-audit-findings.md",
    "phase 016 REQ-004", "phase 016 F5 remedy shape"]`

- **F011 — `goalStateLines` (mk-goal.js:2319, 2326-2329) emits four
  duplicate field-name pairs for the same values** — the audit's e-2.8
  finding is confirmed at lines 2319 (`tokens_used=${goal.tokensUsed}`),
  2326 (`usage_source=${goal.usageSource || 'unavailable'}`), 2327
  (`budget_tokens_used=${goal.tokensUsed}`), 2329
  (`budget_usage_source=${goal.usageSource || 'unavailable'}`). Both
  `tokens_used` and `budget_tokens_used` carry the same numeric value;
  both `usage_source` and `budget_usage_source` carry the same string.
  This is a contract smell (callers can't tell which is canonical) and
  is a SECURITY-side concern because the four lines are mixed into
  `status` output that can be read by both operators and downstream
  tools, who may rely on either name. The four-reviewer audit captured
  this in e-2.8, allocated to phase 019 (Code Refinements, currently
  Planned).
  - Category: security
  - Source evidence: mk-goal.js:2319, 2326-2329.
  - Affected surface hints: `["goalStateLines", "status output", "phase 019 e-2.8"]`

### P2 Findings

- **F012 — Audit dossier's e-2.2 claim that `sweepOrphanedActiveStates`
  uses raw `Date.now()` at mk-goal.js:1058 is FALSE for the current
  state** — the dossier records: "a raw `Date.now()` at :1058 inside
  `sweepOrphanedActiveStates`, which starts at :1055". The actual
  function starts at `.opencode/plugins/mk-goal.js:1231` (not :1055),
  and its current body uses `nowMs(rawOptions)` at :1234 and
  `retentionNowMs(options)` at :1241 — no raw `Date.now()`. The line
  at :1058 belongs to a different function (`normalizeGoalRecord`).
  The dossier captured this from an earlier state. Phase 019's e-2.2
  refactor (consolidate clock accessors) may end up creating a no-op
  change here.
  - Category: traceability (audit-dossier drift)
  - Source evidence: dossier §A e-2.2; mk-goal.js:1231, 1234, 1241.
  - Affected surface hints: `["audit-dossier e-2.2", "phase 019 e-2.2"]`

- **F013 — `redactEvidence` regex on line 388 uses `[:=]` for
  `api[_-]?key|token|password|secret` and may match legitimate
  prose** — `.opencode/plugins/mk-goal.js:388` reads
  `\b(api[_-]?key|token|password|secret)\s*[:=]\s*['"]?[^'"\s,;]+/gi`.
  A user-injected goal evidence like "look up the API_KEY documentation
  for the new module" would have `API_KEY` redacted (false positive
  redaction). The pattern is unavoidable (security prefers false
  positives over false negatives for secret-like keywords), but the
  `[secret-redacted]` substitution makes the resulting block
  confusingly truncated for legitimate "API_KEY documentation" mentions.
  This is an advisory: the pattern is correct for the threat model
  (better to over-redact than leak a real secret) but loses
  information for benign usage.
  - Category: security
  - Source evidence: mk-goal.js:388.
  - Affected surface hints: `["redactEvidence", "user-authored evidence display"]`

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | dossier claims vs mk-goal.js source           | 4/12 dossier claims drift from current state (F010, F012) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer to iteration 005 |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer to iteration 009 |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer to iteration 007 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (4/4 novel)
- dimensionsAddressed: security
- noveltyJustification: F4/F5 verification against current state (post
  phases 010-014 fixes); e-2.8 confirmation; e-2.2 dossier drift detection;
  redactEvidence false-positive risk.

## Ruled Out

- F4 (audit) was ruled in as already-fixed in current code; recorded as F010
  (audit-dossier drift) rather than as a live security finding.
- F5 (audit) was ruled in as already-fixed; same disposition.
- e-2.1 (audit: goal-ID normalize helper duplication) — confirmed at
  multiple call sites but the duplication is cosmetic, not a security
  finding, so left to phase 019.

## Dead Ends

- The injection block at mk-goal.js:2189-2231 is well-defended: every
  user-supplied string (`objective`, `goalPrompt`, `reason`, `verdict`,
  `goalId`) is sanitized, and the active-goal markers are reconstructed
  by the code, not interpolated from user input. The clamp at
  `options.maxInjectionChars` (default 4800) prevents unbounded growth.
  No new injection vectors found.

## Recommended Next Focus

Iteration 004: traceability dimension — verify the parent's phase-map
phase-handoff criteria table (spec.md:202-226) against the actual
implementation evidence in each child's `implementation-summary.md`
and `changelog/`. Validate that the documented handoff criteria
"Verification" columns reference real evidence (test runs, file:line
citations, or grep outputs) rather than aspirational claims.

## Claim Adjudication

```json
{"findingId":"F010","claim":"Audit dossier lists F4 (disabled inertness) and F5 (role-label sanitizer bypass) as findings to be fixed in phase 016, but both are already mitigated in current code.","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/scratch/2026-07-03-four-reviewer-audit-findings.md §A F4/F5",".opencode/plugins/mk-goal.js:2496",".opencode/plugins/mk-goal.js:339-343",".opencode/plugins/mk-goal.js:60-92",".opencode/plugins/tests/mk-goal-lifecycle.test.cjs:652",".opencode/plugins/tests/mk-goal-state.test.cjs:392-420"],"counterevidenceSought":"Re-grepped the four-reviewer audit dossier for F4/F5; both still listed as findings. Re-grepped mk-goal.js for the relevant lines; all defenses are in place.","alternativeExplanation":"The audit captured pre-fix state; phase 010 (security) was the partial fix. Phase 016 was supposed to add hardening on top, but the audit-dossier claims read as if the fix had not landed. Phase 016's REQ-004 still wants the disabled-flag fix; if current code already passes the test, REQ-004 should be downgraded or re-scoped.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"If phase 016's REQ-004 adds additional defense-in-depth beyond the current `if (!eventOptions.enabled) return;` (e.g. log-and-warn, return explicit error, additional env-var defense), the finding stays P1; if REQ-004 is a no-op for F4, downgrade to P2."}
{"findingId":"F011","claim":"goalStateLines emits two pairs of duplicate field names (tokens_used/budget_tokens_used and usage_source/budget_usage_source) for the same values.","evidenceRefs":[".opencode/plugins/mk-goal.js:2319",".opencode/plugins/mk-goal.js:2326-2329"],"counterevidenceSought":"Re-read lines 2310-2330; confirmed both pairs are emitted in the same join() block.","alternativeExplanation":"Could be intentional for forward/backward compatibility (new tools read budget_tokens_used, old tools read tokens_used); but both lines carry identical values, so this is contract drift, not versioned aliasing.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If the duplication is documented as a 'legacy alias' in a comment, downgrade to P2."}
```

Review verdict: CONDITIONAL