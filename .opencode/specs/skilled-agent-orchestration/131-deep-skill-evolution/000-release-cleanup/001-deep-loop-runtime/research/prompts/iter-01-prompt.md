# Deep-research iter 1 — cross-doc consistency sweep

## Role (R)

You are a documentation-audit specialist for the `deep-loop-runtime` peer skill. You are NOT a code editor. ADR-004 of the spec folder forbids any edit to `lib/`, `scripts/`, `tests/`, or `storage/`. Any code-class finding you surface is LOG_ONLY for follow-on packets.

You are dispatched as iter 1 of a 10-iteration `/deep:start-research-loop` execution authorized by ADR-006 in `decision-record.md`. The orchestrator (Claude Code main agent) handles state-machine bookkeeping (`deltas/iter-01.jsonl`, `iterations/iteration-001.md`). YOUR job is to surface CONCRETE cross-doc drift findings with file:line evidence. The orchestrator will format them into the iteration artifacts.

## Context (C)

### Spec folder

`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/` — pre-approved at Gate 3. You do NOT need to ask the Gate 3 question.

### Target docs (the four phase-3-modified artifacts)

| Doc | LOC | Modified in |
| --- | --- | --- |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | 266 | Phase 2 (3 surgical edits: description trim @ L4, Council Primitives H2→H3 @ L142, changelog path fix @ L266) + version bump 1.0.0 → 1.1.0 |
| `.opencode/skills/deep-loop-runtime/README.md` | 470 | Phase 3 (full rewrite, 9-section structure) |
| `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` | 117 | NEW in Phase 3 |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | 170 | UNTOUCHED since v1.0.0 |

### Known prior findings (do NOT re-report these)

The orchestrator already captured 21 findings in `findings/audit-findings.jsonl` (0 P0 / 6 P1 / 15 P2). Highlights:

- AF-0001, 0003, 0004, 0010 — fixed in phase 2 (description trim, council H2→H3, changelog path fix in SKILL+README)
- AF-0002 deferred (Keywords HTML comment block missing in SKILL.md)
- AF-0005, 0006, 0007 deferred (RULES emoji prefix style, missing Use Cases sub-section, SKILL.md size under template target)
- AF-0011/0012/0013 resolved by Phase 3 README rewrite
- AF-0020 references/coverage_graph_schema.md frontmatter resolved
- AF-0030, AF-0040 feature_catalog/playbook structural conformance deferred
- AF-0050 sub-READMEs no-template deferred
- AF-0060 changelog-entry schema applicability deferred
- AF-0070/0071/0072 lib/scripts/tests code-class deferred per ADR-004
- AF-0080 graph-metadata.json no-fix-needed marked resolved

If you re-surface any of these, mark them clearly as RE-REPORT (the orchestrator may still log a sub-finding if novel context changes severity).

### Ground-truth file counts (verified by orchestrator pre-dispatch)

You can rely on these without re-verifying. If your finding contradicts one, RE-VERIFY before reporting:

- `changelog/` contains: `v1.0.0.0.md` (8493 bytes), `v1.1.0.0.md` (8608 bytes, NEW)
- `lib/deep-loop/`: 10 .ts files (atomic-state, bayesian-scorer, executor-audit, executor-config, fallback-router, jsonl-repair, loop-lock, permissions-gate, post-dispatch-validate, prompt-pack)
- `lib/coverage-graph/`: 3 .ts files (coverage-graph-db, coverage-graph-query, coverage-graph-signals)
- `lib/council/`: 5 .cjs files (adjudicator-verdict-scoring, cost-guards, multi-seat-dispatch, round-state-jsonl, session-state-hierarchy)
- `scripts/`: 4 entry .cjs (convergence, query, status, upsert) + `lib/cli-guards.cjs`
- `tests/unit/`: 14 .vitest.ts files (NOT 13 — includes `spawn-cjs.vitest.ts` which tests the helper)
- `tests/integration/`: 7 .vitest.ts files (convergence-script, query-script, review-depth-convergence, review-depth-graph, review-depth-validator, status-script, upsert-script)
- `tests/lifecycle/`: 1 .vitest.ts (db-open-close)
- `tests/council/`: 5 .vitest.ts files (one per lib/council module)
- `tests/helpers/`: `spawn-cjs.ts` + `README.md` (the helper itself, NOT a test)
- **Total vitest files: 14 + 7 + 1 + 5 = 27** (or 28 if you count the helper's own vitest)
- `feature_catalog/`: 17 per-feature .md across 7 domain folders + 1 root index = 18 .md total but 17 entries
- `manual_testing_playbook/`: 18 .md total
- Sub-READMEs: 9 (lib/, lib/council/, lib/coverage-graph/, lib/deep-loop/, scripts/, storage/, tests/, tests/helpers/, plus the top-level README itself)

### Drift hypotheses (starting points only — verify before reporting)

The orchestrator scanned the four docs and surfaced these candidates. Confirm each with file:line evidence, OR refute with counter-evidence:

1. **README.md L82 + L273** claims `22 vitest files` but actual = 27. Drift, P1 fact accuracy.
2. **SKILL.md L81** says `21+ vitest files` — drift from arc-118 baseline, P2 fact accuracy.
3. **README.md §4 STRUCTURE L242** lists only `changelog/v1.0.0.0.md` — does NOT list the NEW `v1.1.0.0.md` even though THIS release exists. P1 self-reference omission.
4. **README.md §9 RELATED DOCUMENTS L438** links only `changelog/v1.0.0.0.md` — does NOT link `v1.1.0.0.md`. Same omission class as above. P1.
5. **graph-metadata.json `last_updated_at: 2026-05-22T00:00:00Z`** but the README + v1.1.0.0.md are 2026-05-23. Stale timestamp. P2.
6. **graph-metadata.json `derived.key_topics`** array (L79-95) does NOT include the 5 council modules (multi-seat-dispatch, round-state-jsonl, adjudicator-verdict-scoring, cost-guards, session-state-hierarchy). Council is an in-scope domain per SKILL.md §3.4 + README §3.5. P1 discoverability gap.
7. **graph-metadata.json `derived.entities`** has no council entities and no `cli-guards.cjs` script. P2.
8. **graph-metadata.json `domains` array (L53-61)** doesn't include "council". SKILL.md/README treat it as a domain. P2.
9. **README.md §9 RELATED DOCUMENTS L442** says `manual_testing_playbook ... (17 entries)` but §4 STRUCTURE L259 says `18 operator-facing manual-test scenarios`. Self-inconsistency in README. P1.
10. **changelog/v1.1.0.0.md L57-65 "Coverage by domain"** mentions `3.7 Storage` but does NOT mention `3.5 Council primitives` index incorrectly — re-check the actual section indices.
11. **SKILL.md §7 INTEGRATION POINTS L252** uses singular "deep-research workflow YAML call" — should be plural for grammar. P2.
12. **SKILL.md §8 REFERENCES L266** still cites `changelog: changelog/v1.0.0.0.md` but the current release is v1.1.0.0 — should the latest changelog link be added? P2 (or P1 if release self-reference is required).

### Look ALSO for (your own pattern hunting)

- Module-count discrepancies between any two of the four docs (e.g. SKILL.md says "10 TS modules" in lib/deep-loop, README says same, but feature_catalog rows or graph-metadata may diverge).
- Path references that don't resolve (`rg -F "path" .` should return at least one hit at the cited line).
- Version-pin disagreements (SKILL.md `version: 1.1.0` ↔ changelog `version: "1.1.0.0"` ↔ graph-metadata absence of version field — is that intentional?).
- Cross-system reference targets (deep-review, deep-research, deep-ai-council) — do the README §9 paths resolve?
- The README §1 OVERVIEW "How It Compares" table mentions `mcp_server/tests/deep-loop/` — does that location still exist and contain the one retained file (review-depth-reducer.vitest.ts per README §8 FAQ)?
- Cross-references to spec folders, ADRs, and arc numbers — are paths correct?
- Trigger phrases consistency: README frontmatter L4-18 lists 14 trigger phrases; graph-metadata `derived.trigger_phrases` lists 6. Mismatch?
- Importance tier consistency: README `importance_tier: "important"` ↔ graph-metadata `importance_tier: "important"` (matches, good). SKILL.md doesn't have one — is that a frontmatter gap?

### Anti-patterns (per strategy.md §3)

- **False positive on stale paths** that resolve through aliases/symlinks: NOT a finding.
- **Re-reporting of audit-findings.jsonl content**: only NOVEL gaps.
- **Code review masquerading as logic gap**: bugs in `lib/`, `scripts/`, `tests/` are LOG_ONLY per ADR-004.

## Action (A)

### Pre-planning (medium-density, 4 ordered steps per cli-devin SKILL.md §3 SWE-1.6 contract)

**Step 1 — Verify orchestrator-supplied drift hypotheses (15 min)**
- For each of the 12 drift hypotheses in the Context block, run `rg -F` or `head/tail/sed -n` to confirm the cited file:line.
- Acceptance: each hypothesis is either CONFIRMED (with verified file:line evidence and a 1-sentence root cause) or REFUTED (with the corrected fact).
- Verification: `rg -F "<exact-string>" <file>` returns at least one hit at the cited line OR a clearly different line that I update the hypothesis with.
- Stop condition: all 12 processed, OR 30 minutes elapsed.

**Step 2 — Pattern hunt for additional drift (10 min)**
- Run `wc -l` and `grep -c` to verify any other count claim in the four docs (entries, modules, files, lines, sections).
- Check `rg -F` resolution of every path mentioned in README §9 RELATED DOCUMENTS table (L437-469).
- Check `rg -F` resolution of every path mentioned in SKILL.md §7 INTEGRATION POINTS (L249-256) and §8 REFERENCES (L259-266).
- Acceptance: at least one additional drift OR at least one "verified clean" pattern check per doc.
- Stop condition: 15 minutes elapsed, OR no novel drift after 5 consecutive checks.

**Step 3 — Bundle gate self-verification (5 min)**
- For every file:line citation in my findings, run `sed -n "Lp" <file>` to confirm the line still says what I claim.
- For every path I claim is broken, confirm with `test -e <path>; echo "exit $?"`.
- For every count claim, run the count command and quote the result.
- Acceptance: zero hallucinated citations (every claim independently re-grep-able).

**Step 4 — Findings synthesis (10 min)**
- Group findings by severity (P0 / P1 / P2) and finding_class (instance-only / class-of-bug / cross-consumer / algorithmic / matrix-evidence / test-isolation).
- Tag each LOG_ONLY if it crosses the ADR-004 boundary (any code change required).
- Recommend `newInfoRatio` for convergence math: `(novel findings / total findings reported)`, where novel = NOT in audit-findings.jsonl.
- Recommend next iteration focus (per strategy.md §4 iter 2 suggested: "Test-coverage map: which `lib/**/*.ts` modules lack a paired vitest file").

### Stop conditions (HARD)

1. SC-007 invariant: do NOT edit `lib/`, `scripts/`, `tests/`, `storage/`. If you find yourself about to, STOP and emit LOG_ONLY finding instead.
2. No new files in `lib/`, `scripts/`, `tests/`, `storage/`.
3. Do NOT update `findings/audit-findings.jsonl` — that's the orchestrator's job. You append nothing to existing JSONL.
4. Do NOT update `validation/validation-report.jsonl` either.
5. 60-minute soft cap on total work. Hard exit at the timeout the orchestrator set (1500 sec = 25 min).
6. If a tool call returns >500 lines, narrow the next call (use `--head` or `-c` or sed ranges).

### Verification approach

After emitting each finding, perform the bundle-gate check:
- `rg -F "<exact-string-i-cited>" "<file-i-cited>" | head -3` — must show the citation
- If counts: rerun the count command (`find`, `wc -l`, `grep -c`) — must match
- If a path: `test -e "<path>" && echo "EXISTS" || echo "MISSING"`

## Format (F)

Emit your findings as a **single markdown report** to stdout. Structure:

```markdown
# Iter 1 — Cross-doc consistency sweep findings

## Summary
- Total findings: N (P0=X / P1=Y / P2=Z)
- Novel (not in audit-findings.jsonl): N
- Re-reported (already in audit-findings.jsonl): N
- newInfoRatio estimate: 0.XX
- Wall-clock: NN minutes

## Findings

### Finding 1 [P1, novel, class: cross-doc-drift]

**Artifact**: `path/to/file:line`
**Description**: Single-sentence description.
**Evidence**:
- `path/to/file:line` quoted snippet 1
- `path/to/other:line` quoted snippet 2
**Recommended fix**: Single-sentence fix recommendation, citing affected line(s).
**LOG_ONLY**: yes/no (yes if fix requires edit inside lib/scripts/tests/storage)

### Finding 2 ...
[repeat]

## Hypothesis disposition

| # | Hypothesis | Status | Evidence |
|---|-----------|--------|----------|
| 1 | README claims 22 vitest files | CONFIRMED/REFUTED | L82+L273 actual count 27 |
| ... | ... | ... | ... |

## Recommendation for iter 2

Per strategy.md §4: "Test-coverage map: which lib/**/*.ts modules lack a paired vitest file in tests/unit/". Confirm focus OR propose alternative based on what surfaced.

## Self-critique

- What I might have missed: ...
- Confidence in counts: ...
- Confidence in path resolutions: ...
```

Keep the report self-contained. The orchestrator parses it directly. Do NOT add filler prose, summaries of the prompt, or restatements of the task. Output findings + evidence only.

---

**Spec folder (Gate 3 pre-approved, skip Gate 3)**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/`

**Bundle gate self-check**: Before final output, smoke-run `rg -F` for every file:line citation. Zero hallucinated paths.

**No sequential_thinking, no SpawnAgent, no code edits.** Read + Grep + Glob + Bash for ground-truth verification only.
