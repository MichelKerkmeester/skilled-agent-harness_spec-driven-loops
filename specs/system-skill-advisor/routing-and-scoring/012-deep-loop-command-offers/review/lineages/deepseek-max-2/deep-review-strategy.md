---
title: Deep Review Strategy - 012 Deep-Loop Command Offers
description: Session tracking for the fan-out review lineage deepseek-max-2 over the deep-loop command-offer packet.
trigger_phrases:
  - "deep review strategy 012"
  - "command offers review strategy"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder target): the deep-loop command-offer routing that turns a deep research/review ask into a typed command offer in the skill-advisor brief, plus the sixth fix round recorded as REQ-023..REQ-034, AC-030..AC-042, ADR-005 and ADR-006.

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- Reworking the scoring model or lane weights beyond what the packet's REQs claim.
- Reviewing packets other than 012 (013 appears only where 012 cites it as a dependency).
- Running the repository's suites as proof work: evidence is read from the tree and, where required, from tests read as sources.

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` with `maxIterations: 7`: the loop runs to the cap and convergence is telemetry only.
- Early stop only through the workflow's own blockers (three consecutive failed iterations, pause sentinel, duration).

## 4. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

## 5. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED

- Sampling the exported predicates on the built copy for each REQ paragraph: it turns a prose claim into an observed result in one call and is cheap enough to repeat per REQ group (iteration 1)
- The entry-for-entry list comparison between `command-attach.ts` and `skill_advisor.py`: it settles REQ-031's parity claim without reading the grammar twice (iteration 1)
- Opening every `path:line` cell in the AC table against the tree, one print per cited line: it finds anchor drift that a count check cannot see (iteration 2)

## 9. WHAT FAILED

- Reading the whole `skill_advisor.py` gate for parity: the file is 6,791 lines and the fifteen lists are the only mechanically comparable part, so a full read here would spend the iteration budget for less evidence (iteration 1)
- Trusting a `Met` cell's line numbers without opening them: two of AC-041's anchors land one line off and one is blank, which only a direct print shows (iteration 2)

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `needsMode` surviving beside a typed command producing a contradictory brief: `commandLabel` reads the typed command first and only suppresses the generated row. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `needsMode` surviving beside a typed command producing a contradictory brief: `commandLabel` reads the typed command first and only suppresses the generated row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `needsMode` surviving beside a typed command producing a contradictory brief: `commandLabel` reads the typed command first and only suppresses the generated row.

### A `dist` stale against the source: the built copy reproduced the source's readings on every sampled REQ prompt. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `dist` stale against the source: the built copy reproduced the source's readings on every sampled REQ prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `dist` stale against the source: the built copy reproduced the source's readings on every sampled REQ prompt.

### A `Met` row whose evidence artifact is missing: all nine cited scratch artifacts exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A `Met` row whose evidence artifact is missing: all nine cited scratch artifacts exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `Met` row whose evidence artifact is missing: all nine cited scratch artifacts exist.

### A brief printing the offer options for a typed command: the renderer checks `typed !== true` before it builds the option text. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A brief printing the offer options for a typed command: the renderer checks `typed !== true` before it builds the option text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A brief printing the offer options for a typed command: the renderer checks `typed !== true` before it builds the option text.

### A command-injection path through the child spawn: the call uses an argv vector, no shell, and a fixed in-repo entrypoint. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A command-injection path through the child spawn: the call uses an argv vector, no shell, and a fixed in-repo entrypoint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A command-injection path through the child spawn: the call uses an argv vector, no shell, and a fixed in-repo entrypoint.

### A comment that contradicts its pattern in the changed gate code: every changed block's comment states the grammar beside it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A comment that contradicts its pattern in the changed gate code: every changed block's comment states the grammar beside it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A comment that contradicts its pattern in the changed gate code: every changed block's comment states the grammar beside it.

### A criteria row whose waiver ADR is absent: all four returned rows name a present ADR. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A criteria row whose waiver ADR is absent: all four returned rows name a present ADR.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A criteria row whose waiver ADR is absent: all four returned rows name a present ADR.

### A dead export left behind by the packet: every added export has at least one reader. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A dead export left behind by the packet: every added export has at least one reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dead export left behind by the packet: every added export has at least one reader.

### A denial-of-service path through the gate regexes: bounded windows and linear scans keep the worst sampled prompt under 15 ms. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A denial-of-service path through the gate regexes: bounded windows and linear scans keep the worst sampled prompt under 15 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A denial-of-service path through the gate regexes: bounded windows and linear scans keep the worst sampled prompt under 15 ms.

### A dimension left uncovered: all four are recorded as covered in the registry. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A dimension left uncovered: all four are recorded as covered in the registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dimension left uncovered: all four are recorded as covered in the registry.

### A duplicated offer literal that has already drifted: the two copies agree word for word. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A duplicated offer literal that has already drifted: the two copies agree word for word.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplicated offer literal that has already drifted: the two copies agree word for word.

### A finding outside the declared scope: all five files are scope entries. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A finding outside the declared scope: all five files are scope entries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A finding outside the declared scope: all five files are scope entries.

### A finding whose evidence did not survive the cap: four re-read clean, and the fifth's wording holds while its line is corrected. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A finding whose evidence did not survive the cap: four re-read clean, and the fifth's wording holds while its line is corrected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A finding whose evidence did not survive the cap: four re-read clean, and the fifth's wording holds while its line is corrected.

### A fixture that only the TypeScript suite reads: the Python suite reads the same 285 cases and compares the served and typed columns. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A fixture that only the TypeScript suite reads: the Python suite reads the same 285 cases and compares the served and typed columns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fixture that only the TypeScript suite reads: the Python suite reads the same 285 cases and compares the served and typed columns.

### A label-injection path from the fallback's JSON: the tracked-table check gates every supplied command, and the label sanitizer handles the remaining text. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A label-injection path from the fallback's JSON: the tracked-table check gates every supplied command, and the label sanitizer handles the remaining text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A label-injection path from the fallback's JSON: the tracked-table check gates every supplied command, and the label sanitizer handles the remaining text.

### A missing ADR behind a waiver: the four returned rows (`Waived` AC-008, AC-017; `Superseded` AC-019; and the ADR-005 exception in AC-027) each name an ADR present in `decision-record.md`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missing ADR behind a waiver: the four returned rows (`Waived` AC-008, AC-017; `Superseded` AC-019; and the ADR-005 exception in AC-027) each name an ADR present in `decision-record.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing ADR behind a waiver: the four returned rows (`Waived` AC-008, AC-017; `Superseded` AC-019; and the ADR-005 exception in AC-027) each name an ADR present in `decision-record.md`.

### A parity drift between the two gate copies: all fifteen compared lists agree entry for entry, and the two numbers REQ-031 names agree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A parity drift between the two gate copies: all fifteen compared lists agree entry for entry, and the two numbers REQ-031 names agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A parity drift between the two gate copies: all fifteen compared lists agree entry for entry, and the two numbers REQ-031 names agree.

### A prompt-echo path: the brief prints skill ids, commands and policy words from tracked tables, never the prompt body. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A prompt-echo path: the brief prints skill ids, commands and policy words from tracked tables, never the prompt body.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A prompt-echo path: the brief prints skill ids, commands and policy words from tracked tables, never the prompt body.

### A quadratic cost in the lead scans: bounded windows keep 96,000-character prompts in single-digit milliseconds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A quadratic cost in the lead scans: bounded windows keep 96,000-character prompts in single-digit milliseconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A quadratic cost in the lead scans: bounded windows keep 96,000-character prompts in single-digit milliseconds.

### A REQ whose producer does not exist: all 39 map to a branch, a test line, an ADR or a packet record. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A REQ whose producer does not exist: all 39 map to a branch, a test line, an ADR or a packet record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A REQ whose producer does not exist: all 39 map to a branch, a test line, an ADR or a packet record.

### A row losing `needsMode` when a command is absent: the false branch adds it only when the route defers and no command was produced. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A row losing `needsMode` when a command is absent: the false branch adds it only when the route defers and no command was produced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A row losing `needsMode` when a command is absent: the false branch adds it only when the route defers and no command was produced.

### A stale suite count across the closure docs: the sixth, seventh and eighth rounds each quote their own totals, and the changelog quotes the eighth (`3,188`), which is the current tree's row. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A stale suite count across the closure docs: the sixth, seventh and eighth rounds each quote their own totals, and the changelog quotes the eighth (`3,188`), which is the current tree's row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale suite count across the closure docs: the sixth, seventh and eighth rounds each quote their own totals, and the changelog quotes the eighth (`3,188`), which is the current tree's row.

### A terminal gate that would fail on this record: evidence is vacuous with no P0/P1, scope is 5 of 5, coverage is 4 of 4. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A terminal gate that would fail on this record: evidence is vacuous with no P0/P1, scope is 5 of 5, coverage is 4 of 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A terminal gate that would fail on this record: evidence is vacuous with no P0/P1, scope is 5 of 5, coverage is 4 of 4.

### A ticked task with no evidence at all: the three citation-free boxes each carry a rationale or a readable claim. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A ticked task with no evidence at all: the three citation-free boxes each carry a rationale or a readable claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A ticked task with no evidence at all: the three citation-free boxes each carry a rationale or a readable claim.

### A typed command losing a policy on the served head: the typed row sets policy, owner and typed in one overwrite. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A typed command losing a policy on the served head: the typed row sets policy, owner and typed in one overwrite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A typed command losing a policy on the served head: the typed row sets policy, owner and typed in one overwrite.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- A parity drift between the two gate copies: the fifteen compared lists agree entry for entry, and `LEAD_WINDOW`/`ADVISOR_PROMPT_MAX_CHARS` agree (iteration 1, evidence: `command-attach.ts:330-935`, `skill_advisor.py:4480-5230`)
- A quadratic lead scan: bounded windows keep 96,000-character prompts in single-digit milliseconds (iteration 1, evidence: built `command-attach.js` timed on four long prompts)
- A contradictory brief when `needsMode` survives beside a typed command: `commandLabel` reads the typed command first (`render.ts:227`) (iteration 1)
- A requirement without a producer: all 39 REQ ids resolve to a branch, test line, ADR or packet record (iteration 2)
- A waiver whose ADR is missing: ADR-001, 002, 003, 005, 006 and 007 all exist at their headings (iteration 2)

## 11. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - the iteration cap is reached - Focus area: synthesis - Reason: `stopPolicy: max-iterations` with `maxIterations: 7` stops the loop here; the next step compiles `review-report.md` from this registry - Rotation status: every configured dimension covered; correctness and traceability reviewed twice - Blocked/productive carry-forward: nothing blocked - Required evidence: the registry, this narrative and the delta agree on five open P2 rows and no P0/P1 - Recovery note: none Review verdict: PASS

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 012 packet docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`), the two offer producers (`runtime/lib/command-attach.ts`, `runtime/scripts/skill_advisor.py`), the scorer lane (`runtime/lib/scorer/lanes/explicit.ts`), the presentation assets under `.skilled/commands/deep/assets/`, and the suites that pin the behavior (`tests/deep-loop-offer-cases.vitest.ts`, `tests/fixtures/deep-loop-offer-cases.json`, `tests/python/test_skill_advisor.py`).
- Behavior claims to verify: REQ-001..REQ-039 in `spec.md`; AC-001..AC-047 in `acceptance-criteria.md`; the ticked tasks in `tasks.md`; ADR-001..ADR-007 in `decision-record.md`.
- Reuse and conventions: one typed-offer grammar shared by the TypeScript lane and the Python fallback; the fixture file is the parity oracle; the brief's head length budget is pinned by a suite.
- Review risks and gaps: `resource-map.md` is absent, so the coverage gate is skipped; runtime mirrors (`.claude/`, `.opencode/`) are downstream packaging surfaces and are not review targets; the 013 packet is a sibling dependency, not in scope.

### Prior Context (continuity ladder)

- `handover.md`: not present at the packet root.
- `_memory.continuity`: read from `implementation-summary.md` where present.
- A prior completed lineage for this packet exists under `review-archive/20261124T111600Z/`; it is read-only evidence of earlier findings and is not this lineage's state.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | All 39 REQ ids mapped to a producer, test line, ADR or packet record; one closure cell cites drifted lines (R2-P2-001) |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- /ANCHOR:cross-reference -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | D3 | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | - | - | - | pending |
| remaining 038 scope files | - | - | - | pending |
<!-- /ANCHOR:files-under-review -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 7
- Convergence threshold: 0.10 (telemetry only under `stopPolicy: max-iterations`)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795518961022-7ms9ak, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T11:17:12.795Z
<!-- /ANCHOR:review-boundaries -->
