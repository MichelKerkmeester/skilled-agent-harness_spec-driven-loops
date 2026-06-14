# Iteration 043 — Angle 43

**Angle:** Regression dataset growth: 100 gold cases — harvesting real misroutes from session logs into the dataset.

**Summary:** The regression-growth path has useful pieces, but the 193-row routing corpus scorer is currently broken and the 50-case regression harness has no size gate. Existing outcome telemetry is prompt-safe rollup data, so real misroute harvesting into 100 gold cases is a new feature rather than already available plumbing.

**Findings kept:** 4

## [P1][BUG] Routing corpus scorer resolves repo root one directory too high

- Evidence: Command: python3 ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/score-routing-corpus.py" --require-historical-clean -> FileNotFoundError: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py'. Code root math at .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/score-routing-corpus.py:20-24.
- Detail: The comment says parents[6] is the repo root, but for the current path it resolves to the parent of Public. That makes the 193-row labeled routing corpus scorer unusable from the current repo, which blocks using that corpus as a practical source for regression growth.
- Fix sketch: Change REPO_ROOT to SCRIPT_DIR.parents[5] or use a sentinel-based workspace-root resolver.

## [P2][REFINEMENT] Regression harness can pass with only 50 cases and has no dataset-size floor

- Evidence: Command: python3 ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py" --dataset ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl" --runner inprocess -> metrics.total_cases=50, passed_cases=50, overall_pass=true. Gates ignore total size at .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py:283-289.
- Detail: The harness reports total_cases but only gates top-1 accuracy, command-bridge false positives, P0 pass rate, and all-case pass status. A 100-gold-case growth target can silently regress or stall because a smaller passing fixture still exits successfully.
- Fix sketch: Add a configurable --min-total-cases gate, set the checked-in baseline toward 100, and fail validation when the fixture shrinks below it.

## [P1][DOC-DRIFT] Manual baseline still says 52 cases while checked-in regression fixture has 50

- Evidence: .opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/regression-suite.md:55 says 'Fewer than 52 cases' is partial load; .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:227 says '52/52 Python regression suite passed'; current command output reports total_cases=50 and passed_cases=50.
- Detail: The docs would tell an operator that the current checked-in fixture is partial, while the actual harness treats it as complete and passing. This is materially misleading for dataset growth work because it obscures whether the intended baseline is 50, 52, or 100.
- Fix sketch: Update the docs to the current fixture count or, preferably, make the count an enforced harness threshold and cite that threshold everywhere.

## [P3][NEW-FEATURE] No harvestable real-misroute payload exists in advisor outcome telemetry

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:283-289 accepts outcomeEvents with runtime, outcome, skillId, correctedSkillId, timestamp only; .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:389-402 persists only timestamp/runtime/outcome/skillLabel/correctedSkillLabel; .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:495-505 records those events.
- Detail: The current outcome telemetry is intentionally prompt-safe and cannot reconstruct a gold regression case because it stores no prompt, scenario, or approved expected skill beyond correction labels. Harvesting real misroutes from session logs therefore needs a new opt-in reviewed capture path, not just a reducer over existing outcome JSONL.
- Fix sketch: Add a privacy-gated candidate queue that stores approved prompt snippets or hashes plus expected skill, then require human promotion into the JSONL gold fixture.
