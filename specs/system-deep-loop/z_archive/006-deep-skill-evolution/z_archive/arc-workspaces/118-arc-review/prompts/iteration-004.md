# RCAF DEEP REVIEW — ITERATION 4 — deep-loop-runtime + 118 arc

## ROLE
Expert reviewer. P0/P1/P2 with file:line evidence. Concise findings.

## CONTEXT
Iter 4 of 10. Cumulative findings F-001..F-020 (do NOT re-report):
- Iter-1 [correctness+security]: 4 (F-001..F-004 — path validation, DB lifecycle, TSX loader, lock path)
- Iter-2 [traceability+maintainability]: 5 (F-005..F-009 — system-code-graph stale refs, playbook cross-ref drift, 3 missing MODULE headers)
- Iter-3 [cross-cutting+test-depth]: ~10 (F-010..F-020 — exit-code test gap, DB lock test gap, spawn-cjs untested, Phase B fixture stubs, completion_pct=5 in 4 phase tasks.md files, 007 placeholder verification data)

**Status**: 0 P0 / 10 P1 / 8 P2. Convergence not yet — newFindingsRatio still >0.10.

## ACTION

This iter focuses on **ADR + 118 packet structural integrity** + **SQLite storage lifecycle**.

**Step 1: ADR-001 alignment (003 + 004)**
Read:
- `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation/decision-record.md`
- `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/004-mcp-tool-surface-removal/decision-record.md`

For each ADR:
- Does the §Decision describe what actually shipped? (Compare to actual `.cjs` scripts, deleted handler files, etc.)
- Does §Five Checks Evaluation honestly reflect the work? (5/5 PASS — is it earned?)
- Does §Migration Outline match actual file moves? (Or has drift crept in?)
- Does §Implementation §What changes match what landed in commits?
Cite file:line for any drift. P1 for ADR-vs-reality mismatch; P2 for stylistic gaps.

**Step 2: Storage + SQLite lifecycle verification**
- Read `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`. Verify:
  - SQLite path constant points at `deep-loop-runtime/storage/deep-loop-graph.sqlite` (post-relocation)
  - Schema creation is idempotent (CREATE TABLE IF NOT EXISTS, indexes)
  - Connection lifecycle: opened once per script invocation, closed in finally
  - Allow-list for node-kinds matches the 116/007 graph vocabulary extension (BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST)
- Read each of the 4 `.cjs` scripts and verify they all use the SAME DB-open helper from coverage-graph-db.ts (single connection owner)
Cite file:line. P0 for broken lifecycle. P1 for missing error handling. P2 for stylistic.

**Step 3: Phase 116 deferred resource-map verification**
Read `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration/resource-map.md` (created in phase 118/008).
- Does it cite the FINAL post-118 file locations? (e.g. `deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`)
- Are all 16/008-touched files accounted for?
- Are version bumps accurate (deep-review v1.3.3.0 → v1.4.0.0)?
Cite file:line. P1 for wrong file paths; P2 for missing entries.

**Step 4: deep-review v1.4.0.0 changelog accuracy**
Read `.opencode/skills/deep-review/changelog/v1.4.0.0.md`. Compare against actual changes in arc 118:
- Does it correctly describe the dependency switch (system-spec-kit → deep-loop-runtime)?
- Does it cite the right commits / ADRs?
- Are user-facing impact statements accurate?
Cite file:line for drift. P1 for factual error; P2 for clarity gaps.

**Step 5: Write findings (F-021 onwards)**

Write to `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/iterations/iteration-004.md`:

```markdown
# Iteration 4 — ADR + Storage + Resource-Map + Changelog (cli-devin swe-1.6)

## Summary
...

## Findings

### P0 (Blockers)
### P1 (Required)
### P2 (Suggestions)

## Convergence Signal
- newFindings: <N>
- newFindingsRatio: <N/prior_ratio>
- Cumulative: P0=0 P1=<sum> P2=<sum>
```

ALSO write delta JSONL at `.opencode/specs/.../review/deltas/iter-004.jsonl`. THIS FILE IS REQUIRED — iter-3 skipped it; do NOT skip it here. One JSON object per finding:
```jsonl
{"iter":4,"finding_id":"F-021","severity":"P1","dimension":"adr-alignment","file":"<path>","line":<N>,"title":"<short>","evidence":"<2-line quote>","fix":"<one-line>"}
```

## FORMAT

File:line citations mandatory. Evidence = direct quotes. F-NNN starts at F-021.

After writing both files, print:
`ITER-4 DONE: <P0>/<P1>/<P2>, dimensions=adr+storage+resource-map+changelog`
