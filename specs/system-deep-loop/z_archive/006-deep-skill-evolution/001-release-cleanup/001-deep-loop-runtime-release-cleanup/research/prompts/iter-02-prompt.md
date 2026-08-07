# Iter 2 — Test-Coverage Map + graph-metadata Council Completeness

Spec folder: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime` (pre-approved, skip Gate 3)

## ROLE

You are a documentation-audit specialist auditing test-coverage completeness for the `deep-loop-runtime` peer-skill (`.opencode/skills/deep-loop-runtime/`). Phase 5 deep-research iter 2.

## CONTEXT

This is iteration 2 of a 10-iter convergence loop (ADR-006 authorized, 10 iter cap). Iter 1 emitted 11 cross-doc drift findings (DR-001 .. DR-011). **DO NOT re-report any of those 11 (full list at end of this prompt).** **DO NOT re-report the 21 audit-findings.jsonl items (AF-0001 .. AF-0080).**

**Per ADR-004**, this is LOG-ONLY for code-class findings. Test coverage gaps → emit as doc-audit findings (the gap is that documentation claims coverage that doesn't exist); follow-on packets will add tests.

**SC-007 invariant**: NO edits to `lib/`, `scripts/`, `tests/`, `storage/`. Audit-only.

### Ground-truth enumeration (orchestrator pre-supplied)

**Lib modules (18 total)**:

`lib/deep-loop/` (10 TS):
1. `atomic-state.ts`
2. `bayesian-scorer.ts`
3. `executor-audit.ts`
4. `executor-config.ts`
5. `fallback-router.ts`
6. `jsonl-repair.ts`
7. `loop-lock.ts`
8. `permissions-gate.ts`
9. `post-dispatch-validate.ts`
10. `prompt-pack.ts`

`lib/coverage-graph/` (3 TS):
1. `coverage-graph-db.ts`
2. `coverage-graph-query.ts`
3. `coverage-graph-signals.ts`

`lib/council/` (5 CJS):
1. `adjudicator-verdict-scoring.cjs`
2. `cost-guards.cjs`
3. `multi-seat-dispatch.cjs`
4. `round-state-jsonl.cjs`
5. `session-state-hierarchy.cjs`

**Test files (27 total — iter 1 DR-001 confirmed count)**:

`tests/unit/*.vitest.ts` (14):
1. `atomic-state.vitest.ts`
2. `bayesian-scorer.vitest.ts`
3. `cli-matrix.vitest.ts`
4. `dispatch-failure.vitest.ts`
5. `executor-audit-process-group.vitest.ts`
6. `executor-audit.vitest.ts`
7. `executor-config.vitest.ts`
8. `fallback-router.vitest.ts`
9. `jsonl-repair.vitest.ts`
10. `loop-lock.vitest.ts`
11. `permissions-gate.vitest.ts`
12. `post-dispatch-validate.vitest.ts`
13. `prompt-pack.vitest.ts`
14. `spawn-cjs.vitest.ts`

`tests/integration/*.vitest.ts` (7):
1. `convergence-script.vitest.ts`
2. `query-script.vitest.ts`
3. `review-depth-convergence.vitest.ts`
4. `review-depth-graph.vitest.ts`
5. `review-depth-validator.vitest.ts`
6. `status-script.vitest.ts`
7. `upsert-script.vitest.ts`

`tests/lifecycle/*.vitest.ts` (1):
1. `db-open-close.vitest.ts`

`tests/council/*.vitest.ts` (5):
1. `adjudicator-verdict-scoring.vitest.ts`
2. `cost-guards.vitest.ts`
3. `multi-seat-dispatch.vitest.ts`
4. `round-state-jsonl.vitest.ts`
5. `session-state-hierarchy.vitest.ts`

**graph-metadata.json council state (ground truth from L53-154)**:
- `domains` (L53-61) — 7 entries; "council" is MISSING
- `derived.key_topics` (L79-95) — 15 entries; all 5 council modules MISSING
- `derived.key_files` (L96-104) — 7 entries; NO council files referenced
- `derived.entities` (L105-154) — 9 entities (deep-loop-runtime, coverage-graph, deep-review, deep-research, convergence.cjs, upsert.cjs, query.cjs, status.cjs); 5 council entities MISSING + `cli-guards.cjs` MISSING

## ACTION

Execute these 4 ordered steps. Stop on first hard failure.

**Step 1 — Build coverage matrix** (acceptance: matrix output covers all 18 lib modules):
- For each of the 18 lib modules listed above, identify:
  - Paired unit test (exact filename match by stem, e.g. `bayesian-scorer.ts` ↔ `tests/unit/bayesian-scorer.vitest.ts`)
  - Paired integration test (does any `tests/integration/*.vitest.ts` import the module by path?)
  - Paired council test (for `lib/council/*.cjs` only)
  - Verify by `rg -Fn "from '\.\./\.\./lib/<module>'" .opencode/skills/deep-loop-runtime/tests/` (or equivalent import path)
- Output a markdown matrix with columns: Module | Unit | Integration | Council | Coverage Verdict

**Step 2 — Identify zero-coverage and weak-coverage modules** (acceptance: every gap has file:line evidence):
- Modules with ZERO tests (no unit + no integration + no council) → P1 finding
- Modules with only 1 test file AND <5 test cases inside → P2 finding (weak)
- For each finding: file:line citation (use `wc -l <test_file>` and `rg -c "^\s*(test|it)\(" <test_file>` to bound assertion count)

**Step 3 — graph-metadata.json council-omissions patch** (acceptance: exact missing-entries list with line anchors):
- Confirm the 5 council modules are absent from `derived.key_topics` (L79-95)
- Confirm the 5 council modules + `cli-guards.cjs` are absent from `derived.entities` (L105-154)
- Confirm "council" is absent from `domains` (L53-61)
- Emit ONE consolidated P1 finding (DR-NNN) with the exact missing-entries list AND a recommended JSON patch (just the added entries; do NOT write them)

**Step 4 — Bundle gate + scope check** (acceptance: zero edits outside research/):
- Run `git diff --stat -- 'lib/' 'scripts/' 'tests/' 'storage/'` — MUST be empty
- Smoke-verify 2 of your file:line citations via `sed -n 'L,Lp' <file>` — citations must match
- Report any tool-call failures

## FORMAT

Output to stdout (orchestrator captures via `>`):

```markdown
# Iter 2 Report — Test-Coverage Map + graph-metadata Council Completeness

## Coverage Matrix

[full 18-row markdown table per Step 1]

## Findings

### DR-012 [Severity] — [one-line title]
- **Class**: doc-audit | test-coverage-gap
- **Artifact**: `path:line`
- **Evidence**: `<exact quoted text or empty-line indicator>`
- **Description**: [what's claimed vs what's measured]
- **Recommended fix**: [for follow-on packet — DO NOT apply]
- **Novel vs iter 1 / audit-findings.jsonl**: YES (cite which prior ID is closest if any)

### DR-013 ... (continue for each novel finding)

## graph-metadata council patch (Finding DR-NNN consolidated)

```json
{
  "domains_additions": ["council"],
  "key_topics_additions": ["multi-seat-dispatch", "round-state-jsonl", "adjudicator-verdict-scoring", "cost-guards", "session-state-hierarchy"],
  "key_files_additions": ["..."],
  "entities_additions": [
    {"name": "multi-seat-dispatch", "kind": "...", "path": "..."}
    // ... 5 entries + cli-guards.cjs
  ]
}
```

## Bundle Gate

- `git diff --stat -- 'lib/' 'scripts/' 'tests/' 'storage/'`: empty / non-empty
- Spot-check 1: [file:line claim] → confirmed / drift
- Spot-check 2: [file:line claim] → confirmed / drift

## Summary

- Total novel findings: N (P0=N / P1=N / P2=N)
- Class breakdown: test-coverage-gap=N, graph-metadata-omission=N, other=N
- Convergence signal: newInfoRatio estimate=0.NN (denominator = N findings emitted)
- Continue / Stop / Escalate
```

## Iter 1 finding IDs to NOT re-report (DR-001 .. DR-011)

DR-001: README 22 vitest claim vs actual 27
DR-002: SKILL.md 21+ vitest claim vs actual 27
DR-003: README §4 omits changelog/v1.1.0.0.md
DR-004: README §9 omits v1.1.0.0.md link
DR-005: graph-metadata.json last_updated_at stale
DR-006: graph-metadata key_topics omits 5 council modules (you WILL expand this; that's the secondary focus)
DR-007: graph-metadata entities missing 5 council + cli-guards.cjs (you WILL expand this too)
DR-008: graph-metadata domains missing "council" (you WILL expand this too)
DR-009: README self-inconsistency 18 vs 17 manual-test scenarios
DR-010: SKILL.md §253 grammar drift
DR-011: SKILL.md §266 cites only v1.0.0.0.md

**Expansion vs re-report distinction**: DR-006/7/8 are accepted as known. Your contribution is to consolidate them into a SINGLE patch-ready finding (DR-NNN) with concrete enumeration + recommended JSON patch, NOT three separate re-reports. Anything else (test-coverage findings, new omissions, etc.) is novel.

## Audit-findings.jsonl IDs to NOT re-report (AF-0001 .. AF-0080)

Already known; see `findings/audit-findings.jsonl`. The full list is 21 items including AF-0072 (LOG_ONLY pass on tests/) — that pass said "22 vitest files" which iter 1 DR-001 already corrected.
