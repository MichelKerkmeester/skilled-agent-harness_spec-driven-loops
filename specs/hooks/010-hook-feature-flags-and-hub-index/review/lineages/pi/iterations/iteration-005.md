# Iteration 5: D4 Maintainability — README/tree coherence, naming, injection-contract alignment

## Focus
- Dimension: maintainability
- Files: `.opencode/hooks/README.md` (directory tree, prose, key-files table, matrix), `.opencode/hooks/injection-contract.md`, `.opencode/hooks/{dispatch,goal,mcp-route-guard,post-edit-quality,task-dispatch}/pi/**`, `.pi/extensions/**`

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F007**: README `DIRECTORY TREE` (section 2, lines 55-98) is stale against the full-index model — it shows only the four portable concerns plus `goal/` and `git/`, and omits the ten skill-owned concern folders (`skill-advisor/`, `spec-gate/`, `session-lifecycle/`, `completion/`, `directive-lifecycle/`, `git-preflight/`, `spec-memory/`, `dist-freshness/`, `codex-watchdog/`, `permission-policy/`) that the "Full index + kill-switches" prose (line 31-33) and the 15×6 matrix claim are symlinked in. A maintainer reading the tree would not see the majority of the hub's entries. Recommendation: extend the tree (or add a pointer) to list all 15 concern folders.
- **F008**: README tree annotations for Pi adapters state "(symlinked from .pi/extensions/)" (`README.md:70,76,83,95`), which describes the direction backwards. The real adapter files live in the hub (`.opencode/hooks/{dispatch,goal,mcp-route-guard,post-edit-quality,task-dispatch}/pi/*.ts` are regular files, verified `-rw-r--r--`), and `.pi/extensions/*.ts` are the symlinks pointing back to the hub (e.g. `.pi/extensions/mcp-route-guard.ts -> ../../.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts`). The README's own prose at line 99 says ".pi/extensions/ holds relative symlinks back to the real files" — the tree annotations contradict that. Recommendation: reword to "real file here; `.pi/extensions/` symlinks to it" (or drop the parenthetical).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F007, F008 | Tree/prose drift in README |
| checklist_evidence | pass | hard | — | unchanged |

## Assessment
- New findings ratio: 1.00 (2 new P2)
- Dimensions addressed: maintainability
- Novelty justification: Compared README tree + prose against the actual hub tree. Naming/disambiguation is otherwise coherent (`speckit-` prefix correctly distinguishes Spec Kit vs Skill Advisor Claude basenames in `skill-advisor/claude/` and `directive-lifecycle/claude/`); all 15 concern slugs appear in `injection-contract.md`; the matrix row for `task-dispatch` (`:188`) matches code reality (codex `unverified`, pi `~ partial`). The two findings are pure doc drift.

## Ruled Out
- F007/F008 as P1: doc-tree inaccuracy does not change shipped behavior; symlinks resolve, loader paths proven. Ruled out as P1.
- Missing concern slug in injection-contract: all 15 slugs present (verified loop). Ruled out.

## Dead Ends
- None.

## Recommended Next Focus
D4 Maintainability (broaden) — hub index completeness vs matrix (session-lifecycle indexing, skill-advisor pi prompt-advisor representation), dist/build boundary claims, and the `.cursor/hooks/` discovery mirror P2 from implementation-summary (completion entrypoint not listed).

Review verdict: PASS
