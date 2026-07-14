---
round: 1
seat: seat-001
executor: native-general
lens: Analytical
status: ok
timestamp: 2026-06-30T12:00:00.000Z
simulated: false
---

# Seat 001 — Analytical / Native OpenCode Lens

## Proposed Plan
1. Freeze scope to active `README.md`, `.opencode/hooks`, `.opencode/commands`, and `.opencode/skills`; exclude historical specs, archives, changelogs, and run logs unless imported by active code.
2. Delete active Codex hook support trees: `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/**` and `.opencode/skills/system-skill-advisor/hooks/codex/**`.
3. Remove or retire associated active policy files after checking imports: `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/shared/codex-hook-policy.ts`, and related tests/docs.
4. Remove `.codex` parity enforcement from `.opencode/hooks/pre-commit`.
5. Update command assets so create/doctor/deep flows no longer generate, install, debug, or advertise Codex CLI paths or `if_cli_codex`/`codex exec` branches.
6. Update README support matrices and setup snippets to OpenCode plugin + Claude Code hook only.
7. Verify with active-scope grep excluding archive/changelog/fixture paths, then run strict packet validation and changed-surface tests.

## Reasoning
Correctness depends on removing producers and registrations before docs: deleted hooks must not leave command routes, doctor targets, or pre-commit checks pointing at missing paths.

## Risks & Trade-offs
A blind string deletion damages audit history and fixtures. Conversely, only updating README leaves runtime-active Codex hook paths live.

## Assumptions and Evidence Gaps
Imports/callers for Codex hook policy modules must be checked before deletion versus retargeting.

## Alternative Challenged
Do not do repo-wide deletion; do active-surface classification with explicit archive/fixture allowlists.

## Confidence
86/100 — strong scope/order, pending caller checks.
