# AI Council Report: Round 002 Operational Plan

## Task Classification
Operational-plan persistence for whether to proceed with ordered strict-mode validation, a fresh dry-run, one supervised real orphan MCP sweep, and a post-sweep check.

## Council Composition
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001-analytical | Analytical | simulated cli-codex | Avoid unnecessary dirty-file rewrites and sequence validation safely. | 90 |
| seat-002-critical | Critical | simulated cli-claude-code | Define hard blockers before any real orphan MCP sweep. | 94 |
| seat-003-pragmatic | Pragmatic | simulated cli-gemini | Keep execution and reporting lean within stated boundaries. | 91 |

## Strategy Comparison
| Seat | Final | Correctness | Completeness | Elegance | Robustness | Integration | Adjustment |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Seat001 | 89 | 29 | 17 | 14 | 16 | 14 | -1 |
| Seat002 | 95 | 28 | 20 | 12 | 20 | 14 | +1 |
| Seat003 | 89 | 28 | 16 | 15 | 16 | 14 | 0 |

## Deliberation Notes
The seats converged that the two requested strict-mode edits are already applied in `.opencode/scripts/copy-skill-advisor-dist-data.sh` and `.opencode/scripts/install-git-hooks.sh`. Because both target files are already dirty, the edit step should be treated as satisfied/no-op rather than rewritten. The real decision point is the safety gate between dry-run and real orphan MCP sweep.

## Winning Strategy
Seat002 wins with final score 95. Merge Seat001's no-op handling for already-applied strict mode and Seat003's lean reporting and no-side-effect boundary.

## Recommended Plan
1. Treat strict-mode edit step as already satisfied because both target scripts already contain `set -euo pipefail`.
2. Do not rewrite the dirty target files.
3. Run ordered strict-mode validation and alignment checks.
4. Run a fresh pre-real orphan MCP dry-run.
5. Review the dry-run as a conservative allowlist gate.
6. Run one supervised real orphan MCP sweep only if the dry-run output is fully allowlisted.
7. Run a post-sweep dry-run/check and report the delta.

## Implementation Steps
1. Verify syntax/alignment for the two strict-mode scripts without editing them.
2. Execute the dry-run command and capture candidate classes.
3. Block real sweep if any candidate falls outside the allowlist or appears ambiguous.
4. If fully allowlisted, run exactly one supervised real sweep.
5. Run the post-sweep check immediately after and summarize remaining candidates.

## Prerequisites
- Current dirty-file contents must remain untouched unless the user explicitly authorizes script edits.
- The fresh dry-run must be reviewed immediately before any real sweep.
- Operator must confirm that candidates are orphan MCP artifacts only.

## Plan Confidence
**Overall**: 91%.

## Dropped Alternatives
- Rewriting the two dirty strict-mode scripts despite `set -euo pipefail` already being present.
- Installing or loading LaunchAgent changes as part of this step.
- Editing handover, implementation-summary, home-level Claude config, code scripts, or git index.
- Running a real sweep without a fresh allowlisted dry-run.

## Risks & Mitigations
- Risk: Real sweep could terminate active non-orphan resources. Mitigation: require Seat002's fresh dry-run allowlist gate.
- Risk: Dirty files could include user changes. Mitigation: treat strict-mode step as no-op and do not rewrite.
- Risk: Scope drift into docs, LaunchAgent, home config, or git. Mitigation: keep execution/reporting lean and bounded.
- Risk: Process state changes between dry-run and real sweep. Mitigation: run real sweep only immediately after reviewing the fresh dry-run.

## Cross-References
- seats/round-002/seat-001-analytical.md
- seats/round-002/seat-002-critical.md
- seats/round-002/seat-003-pragmatic.md
- critiques/round-002-critique.md
- deliberations/round-002.md
- ai-council-state.jsonl

## Planning-Only Boundary
This council round is planning and persistence only. It does not run validation commands, does not run orphan-mcp-sweeper, does not edit LaunchAgent or home-level Claude config, does not stage or commit, and does not modify files outside `ai-council/**`.

## Seat 001 Summary
Analytical simulated cli-codex seat: strict-mode is already satisfied, dirty files should not be rewritten, and the ordered sequence should proceed through validation, dry-run, conditional real sweep, and post-sweep check. Confidence 90.

## Seat 002 Summary
Critical simulated cli-claude-code seat: real sweep is blocked until the fresh dry-run is reviewed as a conservative allowlist gate. Stop on active non-MCP servers, Ollama, `devin --print`, `/tmp/devin-*`, `/tmp/cli-devin-*`, `/tmp/codex-browser-use`, live Claude descendants, active non-MCP TCP listeners, cache directories, or ambiguous classes. Confidence 94.

## Seat 003 Summary
Pragmatic simulated cli-gemini seat: keep execution/reporting lean; no handover, implementation-summary, LaunchAgent install/load, home Claude config edit, staging, commit, or unrelated edits. Confidence 91.
