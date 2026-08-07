# RCAF DEEP REVIEW — ITERATION 2 — deep-loop-runtime skill

## ROLE
You are an expert reviewer of OpenCode peer skills. You audit traceability + maintainability of `.opencode/skills/deep-loop-runtime/`. You produce structured findings with P0/P1/P2 severity tags and concrete file:line evidence.

## CONTEXT
Iteration 2 of 10. The deep-loop-runtime skill was shipped in arc 118. Iter-1 covered correctness + security on the .cjs script + lib surface; it found 0 P0 / 2 P1 / 2 P2 findings (path validation, DB lifecycle deviation, TSX loader path assumption, loop-lock path relative to caller).

**Iter-1 findings (do NOT re-report; this iter should find NEW issues in different surfaces):**
- F-001 [P1] Missing path validation on CLI args — scripts/convergence.cjs:231 (security)
- F-002 [P1] DB lifecycle pattern deviates from ADR-001 contract — scripts/convergence.cjs:243 (correctness)
- F-003 [P2] TSX loader path assumes specific directory structure — scripts/convergence.cjs:11 (maintainability)
- F-004 [P2] Lock file path in loop-lock.ts is relative to caller — lib/deep-loop/loop-lock.ts:175 (maintainability)

This iter focuses on **traceability** + **maintainability** dimensions, on different surfaces from iter-1:
- Skill docs surface (SKILL.md, README.md, changelog/, feature_catalog/, manual_testing_playbook/, references/, graph-metadata.json)
- Tests surface (tests/unit/, tests/integration/, tests/lifecycle/, tests/helpers/spawn-cjs.ts)
- Cross-skill cross-references (deep-review/SKILL.md v1.4.0.0 changelog, workflow YAMLs, /doctor + system-code-graph collateral)

Review state files at `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/`.

## ACTION

Execute 4 ordered steps.

**Step 1: Traceability audit on skill docs (ACCEPTANCE: every cross-ref verified).**
For each of: SKILL.md, README.md, changelog/v1.0.0.md, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md, graph-metadata.json, references/*.md:
- Verify every internal cross-reference resolves to an existing file/anchor
- Verify feature catalog entries match actual lib files + scripts (17 features × 7 categories)
- Verify manual_testing_playbook scenarios cite the right source files
- Verify graph-metadata.json's `key_files` + `entities` match actual content
- Verify SKILL.md §7 INTEGRATION POINTS accurately reflects current arc 118 state
- Verify changelog/v1.0.0.md references 118 commits + ADRs correctly
Cite file:line for each drift. P1 for broken links / wrong claims; P2 for stylistic drift.

**Step 2: Maintainability audit on docs + tests (ACCEPTANCE: each rule checked).**
- Run alignment-drift verifier mentally: TS files have `MODULE:` header? CJS files have `'use strict';`?
- Are test imports relative paths correct after the migration (post-002 git-mv)?
- spawn-cjs.ts helper: well-named exports? Reusable across all 4 script integration tests?
- DB lifecycle test (lifecycle/db-open-close.vitest.ts): covers all 4 scripts? Tests overlapping-writer scenario?
- Are review-depth-*.vitest.ts files (Phase B fixtures) correctly pointing at the moved post-dispatch-validate.ts?
- sk-doc DQI on the new docs: check feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md, references/*.md (you can run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>` if the tool is available)
Cite file:line. P1 for actual breakage; P2 for stylistic gaps.

**Step 3: Cross-skill consistency audit (ACCEPTANCE: each consumer surface checked).**
Verify the consumers update correctly post-118:
- `.opencode/skills/deep-review/SKILL.md` — version 1.4.0.0 frontmatter? changelog/v1.4.0.0.md references the 118 arc?
- `.opencode/commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml` + same for deep-research — every `mcp__mk_spec_memory__deep_loop_graph_*` reference replaced with `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs ...`?
- `.opencode/commands/doctor/*` — references new script paths?
- `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md` — points at new script paths?
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` — has the "arc 118" supersession note for the 4 deep_loop_graph_* features?
Cite file:line for any incomplete cutover. P1 for runtime-breaking; P2 for documentation drift.

**Step 4: Write findings (ACCEPTANCE: structured markdown + delta JSONL).**

Write to `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/iterations/iteration-002.md`:
```markdown
# Iteration 2 — Traceability + Maintainability (cli-devin swe-1.6)

## Summary
<one paragraph>

## Findings

### P0 (Blockers)
- [F-NNN] <title> — <file:line>
  Evidence: <quote>
  Recommended fix: <one-liner>

### P1 (Required)
...

### P2 (Suggestions)
...

## Dimensions Covered This Iter
- traceability: ...
- maintainability: ...

## Next-Iter Suggestions
- ...

## Convergence Signal (self-report)
- newFindings: <N>
- newFindingsRatio (vs iter-1): <N/4 normalized>
- evidence gate: PASS/FAIL
- scope gate: PASS/FAIL
- coverage gate: PASS/FAIL (running tally: correctness ✓ security ✓ traceability ✓ maintainability ✓)
```

Write delta JSONL at `.opencode/specs/.../review/deltas/iter-002.jsonl`:
```jsonl
{"iter":2,"finding_id":"F-NNN","severity":"P0/P1/P2","dimension":"traceability/maintainability","file":"<path>","line":<N>,"title":"<title>","evidence":"<quote>","fix":"<recommendation>"}
```

Continue F-NNN numbering from where iter-1 left off (next is F-005).

## FORMAT

- file:line citations mandatory
- Evidence = direct quotes from source (2-3 lines)
- DO NOT modify files outside `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/`

After writing both files, print:
`ITER-2 DONE: <P0 count>/<P1 count>/<P2 count>, dimensions=traceability+maintainability`
