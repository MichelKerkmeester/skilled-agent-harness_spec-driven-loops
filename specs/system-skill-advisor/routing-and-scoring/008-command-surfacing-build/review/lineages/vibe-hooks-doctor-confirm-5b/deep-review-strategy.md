---
title: Deep Review Strategy - vibe-hooks-doctor-confirm-5b lineage
description: Runtime strategy for the confirming round of pass five in the vibe-hooks-doctor area.
version: 1.11.17.0
---

# Deep Review Strategy - vibe-hooks-doctor-confirm-5b lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this detached fan-out lineage. It records the dimensions still to
cover, the findings raised so far, the approaches that worked or failed, and the next focus.
It is read before every review action.

---

## 2. TOPIC

Confirming round 5b of review pass five of
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, area
`vibe-hooks-doctor`. Target files, from `review/review-scope-5b.txt`:

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`
- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`

Plus the docs that describe them, chiefly
`.skilled/commands/doctor/scripts/README.markdown` and the hook contract.

The confirming question is whether the fixes for the pass-five findings hold, and whether the
fixes added a defect. `review/verify-5/report.md` is the base: its rejected item and the limits
recorded in `032-review-pass-five-remediation/plan.md` D13 and in `scratch/review/report-2.txt`
and `report-3.txt` are not re-reported without a new input that breaks them. Plan D9 freezes the
doctor's `match` rule, `re:` selectors included.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The transcript scorer, the behaviour arena and the live runner are the `accuracy-runner`
  lineage's scope. Their five focus checks are read here only as context, never graded.
- The kill-switch CLI, launcher and `ENV-REFERENCE.md` are the `kill-switch-cli` lineage's
  scope. The hook contract is graded here only where it describes this area's code.
- The feature catalog, changelog, playbook and leaf metadata are `docs-metadata`'s scope.
- Holdout prompt text is never read or printed. Corpus work is limited to filename searches.
- No code changes. This lineage writes only its own directory.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below 0.10 with no active P0 and dimension coverage complete.
- Cap: `maxIterations` 3.
- Stuck: two consecutive iterations with no new evidence.
- Any active P0 forces `Review verdict: FAIL` regardless of convergence.

---

## 6. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

## 7. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Running the exported `withCommandDocuments` and `reduceRepeatedHead` instead of reading them:
  the fallback guard and the receipt environment each print one observable (`changed: false`;
  `injected 1 / process 0`), so the two fixes are confirmed rather than inferred (iteration 1).
- Comparing the new resolver walk with the old six-hop URL from both the source and the built
  folder: the source misses the old path and the built folder hits it, which is exactly the
  reported asymmetry, and the walk resolves both (iteration 1).
- Reading the new hook test for what it can only pass with: a missing resolver answers enabled,
  so `{}` plus an uncalled producer proves the walk found the file, not the fail-open branch
  (iteration 1).
- Running the doctor on four fixtures built from the shipped command string, instead of reading
  the regex: the literal/comment/basic forms print `ok vibe` and `agents_spawn` prints
  `hook-missing vibe`, which pins the selector rule and the README contradiction in one table
  (iteration 2).
- Comparing a new test case with the helper's default argument: the two bodies are byte-identical
  TOML, so the duplicate is provable without running either case (iteration 2).
- Comparing the doc's ten switch rows with the resolver's own name set programmatically instead
  of by eye: both sets print the same ten names, which turns "do the names agree" into an
  equality check (iteration 3).
- Reading the direct-call precedence from `advisorDisabledBy` into `hookFlagDecision`: the
  environment wins over the flags file by construction, which is the sentence the doc makes
  (iteration 3).

---

## 9. WHAT FAILED

- Reading the unbounded resolver walk as a new defect failed: plan D9 freezes the walk-up and
  `advisor-disabled.ts:50-68` is the same loop, so a finding would re-open a decided tradeoff
  without a new input (iteration 1).
- Reading the compiled runtime as the reviewed artifact failed: it is untracked and rebuilt, so
  the TypeScript source is the review target and the working-tree copy is only corroboration
  (iteration 1).
- Reading the doctor README's "a value with a trailing comment or a single-quoted string reads
  `hook-missing`" as still true failed: the fix accepts both shapes for `match`, so the sentence
  now describes only `type` and `command` (iteration 2).
- Reading the new "names the main agent" case as coverage of an explicit selector failed: the
  helper default already writes `match = "main"`, so the case duplicates its predecessor
  (iteration 2).
- Reading the Codex, Cursor and Devin hook-contract rows as naming a per-runtime advisor build
  failed: the right side of each arrow is the compiled system-spec-kit shim, which exists, and
  the shim then spawns the one advisor handler (iteration 3).

---

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A `re:` selector that includes `main` is falsely reported.** Not raised: plan D9 decides that -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `re:` selector that includes `main` is falsely reported.** Not raised: plan D9 decides that
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `re:` selector that includes `main` is falsely reported.** Not raised: plan D9 decides that

### **A missing resolver now fails closed.** `hookFlagsResolverPath` returning null answers `true` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A missing resolver now fails closed.** `hookFlagsResolverPath` returning null answers `true`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing resolver now fails closed.** `hookFlagsResolverPath` returning null answers `true`

### **A trailing-comment `type` or `command` line is now accepted.** Still refused: the entry regex -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A trailing-comment `type` or `command` line is now accepted.** Still refused: the entry regex
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A trailing-comment `type` or `command` line is now accepted.** Still refused: the entry regex

### **The `MK_` rows are stale after the env-aliases bridge.** Ruled out: `env-aliases.cjs` maps -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `MK_` rows are stale after the env-aliases bridge.** Ruled out: `env-aliases.cjs` maps
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `MK_` rows are stale after the env-aliases bridge.** Ruled out: `env-aliases.cjs` maps

### **The Codex, Cursor and Devin rows name a per-runtime advisor build that does not exist.** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The Codex, Cursor and Devin rows name a per-runtime advisor build that does not exist.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Codex, Cursor and Devin rows name a per-runtime advisor build that does not exist.**

### **The directive-only early return also skips a real head.** A context that starts with the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The directive-only early return also skips a real head.** A context that starts with the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The directive-only early return also skips a real head.** A context that starts with the

### **The env injection changes the receipt call contract.** `read` and `write` receive the env as a -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The env injection changes the receipt call contract.** `read` and `write` receive the env as a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The env injection changes the receipt call contract.** `read` and `write` receive the env as a

### **The Python CLI also reads the newer names.** Ruled out: it reads only -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The Python CLI also reads the newer names.** Ruled out: it reads only
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Python CLI also reads the newer names.** Ruled out: it reads only

### **The three added cases after T023 make the suite count wrong.** T023's evidence says 47 tests -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The three added cases after T023 make the suite count wrong.** T023's evidence says 47 tests
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The three added cases after T023 make the suite count wrong.** T023's evidence says 47 tests

### **The unbounded ancestor walk loads a foreign resolver.** `hookFlagsResolverPath` climbs to the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The unbounded ancestor walk loads a foreign resolver.** `hookFlagsResolverPath` climbs to the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The unbounded ancestor walk loads a foreign resolver.** `hookFlagsResolverPath` climbs to the

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- **The unbounded ancestor walk loads a foreign resolver.** Ruled out as a finding: plan D9
  freezes the walk-up, `advisor-disabled.ts:50-68` is the identical sibling, and no in-repo
  caller places a `hooks/shared/hook-flags.cjs` above a checkout (iteration 1).
- **The directive-only early return skips a real head.** Ruled out: the handler's no-brief
  fallback is the only context that opens with `Directives:`, and a headed brief opens with
  `Advisor:` (iteration 1).
- **A missing resolver now fails closed.** Ruled out: null answers enabled, the same fail-open
  answer the old catch gave (iteration 1).
- **A `re:` selector that includes `main` is falsely reported.** Not raised: plan D9 decides that
  any value other than absent or exactly `main` reads `hook-missing`, `re:` selectors included,
  and the case at `hook-wiring-check.test.cjs:273-280` pins it (iteration 2).
- **A trailing-comment `type` or `command` line is now accepted.** Ruled out: the entry regex
  anchors on the closing quote with no comment (`hook-wiring-check.cjs:263`); only `match` gained
  comment tolerance (iteration 2).

---

## 11. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - the lineage report, the release-readiness state and the convergence record - Reason: all four dimensions are covered, no blocking finding is active, and the three-iteration cap is reached - Rotation status: correctness, security, traceability and maintainability complete - Blocked/productive carry-forward: no blocked approach; two P2 advisories are the remaining work - Required evidence: the registry's active counts, the three iteration final lines, the synthesis close-out record and the report Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`,
  `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`,
  `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, their tests, and the hook contract.
- Behavior claims: `review/review-brief-5b.txt`, `review/verify-5/report.md`, plan D9 and D13,
  `032-review-pass-five-remediation/spec.md` REQ-007.
- Reuse and conventions: hooks are standalone Node/TypeScript entry points fed a JSON event on
  stdin; the Vibe part imports the compiled advisor; doctor scripts are plain CommonJS with
  `node:test` suites.
- Review risks and gaps: no live Vibe or Claude session is available, so behavior claims rest on
  the exported helpers and the suites. The compiled advisor runtime is not tracked, so the source
  is the reviewed artifact.
- Out of scope: scorer arithmetic, arena building, live turns, holdout prompt text, the rest of
  the kill-switch surface.

---

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Not yet checked. |
| `checklist_evidence` | core | pending | - | Not yet checked. |
| `skill_agent` | overlay | pending | - | Not yet checked. |
| `agent_cross_runtime` | overlay | pending | - | Not yet checked. |
| `feature_catalog_code` | overlay | pending | - | Not yet checked. |
| `playbook_capability` | overlay | pending | - | Not yet checked. |
<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | correctness, security | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | correctness, security | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | correctness | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | correctness | 1 | 0 | complete |
| the doctor script and its two tests | traceability, maintainability | 2 | 1 P2 (README) | complete |
| `skill-advisor-hook.md` and the describing docs | traceability, maintainability | 3 | 0 | complete |

---

## 16. REVIEW BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.1
- Session lineage: sessionId=fanout-vibe-hooks-doctor-confirm-5b-1794780590351-ezt1v0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Severity threshold: P2
- Review target type: spec-folder
- Started: 2026-11-15T22:21:04Z
