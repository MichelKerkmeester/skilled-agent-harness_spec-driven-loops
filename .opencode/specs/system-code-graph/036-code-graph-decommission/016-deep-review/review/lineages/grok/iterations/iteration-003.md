# Iteration 003 — Traceability (spec vs live evidence)

## Focus
D3 Traceability / `spec_code` + `checklist_evidence`: verify 015 and parent completion claims, matrix applicability, and test imports against the deleted skill.

## Method
- Listed 015 directory; confirmed checklist.md absent
- Re-read implementation-summary status vs limitations
- Read matrix-manifest F5/F6 rows
- Confirmed broken imports in opencode-plugin.vitest.ts against absent paths

## Findings

### P0 - Blockers
- **P0-003**: Live tests still import deleted system-code-graph modules — `.opencode/skills/system-spec-kit/mcp-server/tests/opencode-plugin.vitest.ts:14` — Import resolves into deleted skill/plugin paths. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/opencode-plugin.vitest.ts:14]

### P1 - Required
- **P1-004**: 015 claims checklist.md Created but file is missing — `015-verification-and-closeout/implementation-summary.md:81` — Files Changed row asserts Created; file absent. [SOURCE: .opencode/specs/system-code-graph/036-code-graph-decommission/015-verification-and-closeout/implementation-summary.md:81]
- **P1-005**: 015 Status Complete contradicts In Progress full-suite limitation — `implementation-summary.md:145` — Complete metadata vs In Progress limitation / IN FLIGHT verification. [SOURCE: .opencode/specs/system-code-graph/036-code-graph-decommission/015-verification-and-closeout/implementation-summary.md:145]
- **P1-006**: matrix-manifest still schedules applicable code_graph F5/F6 cells — `matrix-manifest.json:12` — applicable:true for retired tools. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/matrix-runners/matrix-manifest.json:12]

## Traceability checks
| Protocol | Result | Notes |
|----------|--------|-------|
| spec_code | fail | Live hints/tests contradict residual-sweep / suite-green claims |
| checklist_evidence | fail | Claimed checklist artifact missing |

## Adversarial self-check (P0-003)
- Hunter: hard import of missing module breaks module load.
- Skeptic: test may be skipped? File has active describe('mk-code-graph plugin') without describe.skip at top level.
- Referee: CONFIRMED P0 for suite integrity / phase-006 incomplete cleanup.

## Ruled Out
- Parent phase map incorrectly listing 016 as Complete — correctly Pending.
- Runtime config residual registrations — clean.

## Recommended Next Focus
D4 Maintainability: plugins README, skill-root-metadata-contract S-tier list, system-spec-kit graph-metadata edges, stress-harness / compact-merger imports.

Review verdict: FAIL
