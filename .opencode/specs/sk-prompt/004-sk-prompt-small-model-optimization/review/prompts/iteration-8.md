DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 8 of 20

## STATE

state_summary: Correctness + Traceability clean (after retractions). Security has 2 confirmed P1 (deny-precedence, abs-path scope-escape) + 8 P2 advisories. Iter 8: switch to maintainability dimension — examine TS code quality, doc completeness, sentinel-skill size discipline, and sk-doc template alignment.

Review Iteration: 8 of 20
Mode: review
Dimension: **maintainability** (4/4)
Review Target: sk-prompt/004-sk-prompt-small-model-optimization
Running findings: P0=0, P1=2 (sec-F2 deny-precedence, sec-F3 abs-path), P2=9

## SHARED DOCTRINE

- **P0 (maintainability)**: code so unreadable / wrong that it blocks future maintenance
- **P1 (maintainability)**: significant quality gap — uncommented `any`, missing types, no test coverage on critical path
- **P2 (maintainability)**: hygiene — TODOs, missing docstring on public symbol, sentinel-skill over-size

## STATE FILES

- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-state.jsonl`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/iterations/iteration-008.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deltas/iter-008.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Soft max 12, hard max 13 tool calls.
- Read-only.
- ALLOWED WRITE PATHS:
  - `review/iterations/iteration-008.md`
  - `review/deep-review-state.jsonl`
  - `review/deltas/iter-008.jsonl`
- Use absolute paths (start with `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`).

## ITERATION 8 FOCUS — MAINTAINABILITY

### Check 1: TS code quality (4 files)

Read each of the 4 new TS files in `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/`:
- `permissions-gate.ts` (Phase 003)
- `bayesian-scorer.ts` (Phase 005)
- `fallback-router.ts` (Phase 005)
- `post-dispatch-validate.ts` (Phase 004 expansion)

For each file, check:
- Any uses of `any` type without an adjacent comment explaining why? (P1 if yes)
- All exported symbols have JSDoc or type annotation? (P2 if missing)
- Error-handling pattern: do all branches return a typed result (no throw without rationale)? (P2 if inconsistent)
- TODO/FIXME/XXX comments? (P2 noise)

### Check 2: Test coverage for new TS files

Glob `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/*.vitest.ts`. Confirm each of the 4 TS files has a corresponding test file. Read the impl-summaries to find expected test counts (003 said ~9 tests; 005 said 5+ bayesian + 16 fallback pairs; 004 said expanded post-dispatch-validate tests).

If test files are missing for any TS impl → P1.

### Check 3: Sentinel skill size discipline

Run `wc -l` (via Bash) on:
- `.opencode/skills/sk-small-model/SKILL.md` (cap was 200 LOC; actual claimed 210 — close call)
- `.opencode/skills/sk-small-model/references/pattern-index.md` (cap was 100 LOC; actual claimed 102)

If over-budget by >5%, flag P2 (sentinel discipline).

### Check 4: sk-doc README template alignment

Read `.opencode/skills/sk-small-model/README.md` (which I authored from `sk-doc/assets/skill/skill_readme_template.md`). Check that it has the canonical sk-doc sections (typically: Overview, When to Use, How it Works, References, Examples, Maintenance). Compare structure (not content verbatim) to `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`.

If sections missing or out-of-order → P2.

### Check 5: Reference doc citation hygiene

Read `.opencode/skills/cli-devin/references/{context-budget,output-verification,quota-fallback}.md` headers. Each should cite the research synthesis (research §RQX) + iter number that grounded the design.

If a doc claims design decisions without citing research source → P2.

### Check 6: Backward-compat absolute defaults still off

Cross-verify (one more time) that all 3 cli-devin agent-config recipes have:
- `verification_enabled: false`
- `bayesian_scoring_enabled: false`
- `fallback_chain: []`

(Already verified iter 3 — but treat as a regression check.)

## OUTPUT CONTRACT

1. **iteration-008.md** — Structure: `## Dimension`, `## Files Reviewed`, `## Check 1 TS Code Quality`, `## Check 2 Test Coverage`, `## Check 3 Sentinel Size`, `## Check 4 sk-doc Alignment`, `## Check 5 Citation Hygiene`, `## Check 6 Backward-Compat Regression`, `## Findings`, `## Verdict`, `## Next Focus`.

2. **state.jsonl APPEND** — single line. Include `findingsNew` count + `newFindingsRatio`.

3. **deltas/iter-008.jsonl** — multi-line.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read 4 TS files for Check 1.
3. Glob tests dir for Check 2.
4. Bash `wc -l` for Check 3.
5. Read sk-doc template + sk-small-model README for Check 4.
6. Read cli-devin references for Check 5.
7. Read 3 agent-configs for Check 6 (frontmatter only).
8. Write iter narrative + delta + state.jsonl. Stop.
