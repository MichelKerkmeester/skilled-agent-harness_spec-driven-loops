# Iteration 026 — Angle 26

**Angle:** detect_changes adoption: blocked-on-stale refusal is shipped — do agent workflows actually call it before acting on diffs; where should it be wired?

**Summary:** detect_changes itself is shipped and correctly refuses stale graph state, but adoption is mostly not wired into the agent workflows that review or act on diffs. The best wiring points are sk-code-review Phase 1/@review diff modes, deep-review diff execution, and any orchestrator handoff that receives a non-local patch; doctor’s current mention should be corrected because it calls the tool without a required diff.

**Findings kept:** 4

## [P1][BROKEN-FEATURE] Primary diff-review workflows do not invoke detect_changes

- Evidence: .opencode/skills/system-code-graph/SKILL.md:34-35 says non-local code-review patches should run detect_changes; .opencode/agents/review.md:96 and .opencode/agents/review.md:113-115 route review through git diff/local changes; .opencode/skills/sk-code-review/SKILL.md:266-269 starts Phase 1 by inspecting git diff/staged diff/file list/commit range; Grep for `detect_changes|mcp__mk_code_index__detect_changes|code-index.cjs detect_changes` in .opencode/agents, .opencode/skills/sk-code-review, .opencode/skills/sk-git, and .opencode/skills/sk-code returned `No files found`.
- Detail: The code graph feature is shipped and documented as a diff preflight, but the agents and review skill that actually act on diffs still use plain git-diff workflows only. This means stale-graph hard refusal never protects normal review/pre-commit paths unless a human remembers to call the tool manually.
- Fix sketch: Wire detect_changes into sk-code-review Phase 1 and @review pre-commit/PR modes immediately after diff capture, treating blocked/unavailable as a surfaced structural-impact gap while continuing plain diff review only with an explicit caveat.

## [P2][BROKEN-FEATURE] Deep-review has code graph permissions but no detect_changes path

- Evidence: .opencode/agents/deep-review.md:15-16 permits only code_graph_query and code_graph_context; .opencode/agents/deep-review.md:164-169 says Execute Review uses available tools and Code Graph structural search, but does not mention detect_changes.
- Detail: Deep-review is another diff/review actor, but its frontmatter exposes only query/context and its workflow text has no diff-preflight step. It can perform structural discovery, but not the shipped stale-refusing changed-symbol preflight that is specific to unified diffs.
- Fix sketch: Add the mk-code-index detect_changes tool/CLI fallback to deep-review’s allowed surface and require it when the review target is a unified diff or changed-file patch.

## [P1][BUG] Doctor code-graph YAML wires detect_changes with an invalid empty argument object

- Evidence: .opencode/commands/doctor/assets/doctor_code-graph.yaml:155-159 says `invoke detect_changes({}) to obtain stale set`; .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:173-182 defines detect_changes with required `diff`; live MCP probe returned `status: "blocked"` before parsing because graph is stale, but with fresh graph the schema still requires a diff.
- Detail: This is the one workflow-like place that names detect_changes, but it is not a valid adoption point because detect_changes is diff-driven and cannot compute a general stale set from empty input. The stale-set diagnostic should come from status/manifest/git metadata, not from detect_changes.
- Fix sketch: Replace the doctor YAML activity with code_graph_status plus manifest/git stale-file analysis, and reserve detect_changes for routes that have an actual unified diff.

## [P2][REFINEMENT] Playbooks validate detect_changes itself, not agent adoption

- Evidence: .opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:20-26 validates stale refusal; .opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-multi-file-diff.md:39-66 validates response shape and stale blocking; .opencode/skills/sk-code-review/manual_testing_playbook/01--baseline-review-flow/large-refactor-pr.md:46-48 reviews a large diff using git diff/stat/name-only and @review with no detect_changes step.
- Detail: The tool’s blocked-on-stale behavior has direct validation, but the workflows most likely to benefit from it do not have regression scenarios proving they call it before acting on diffs. That leaves adoption vulnerable to future documentation-only drift.
- Fix sketch: Add sk-code-review/@review/deep-review manual scenarios that require captured diff -> detect_changes -> blocked/ok handling evidence before final review output.
