# AI Council Strategy: Active Codex Reference Cleanup

## Purpose
Plan the follow-up removal of generic Codex/Codex CLI references from active README, hook, command, and skill surfaces while preserving archival evidence.

## Task Framing
The prior packet retired `cli-codex`. The user now wants remaining active `codex` references removed from `README.md`, `.opencode/hooks`, `.opencode/commands`, and `.opencode/skills`, including deletion of Codex CLI hooks. Supported hook/plugin surfaces should become OpenCode plugins and Claude Code hooks only.

## Selected Seats
- Seat 001: Analytical / native OpenCode-gpt-5.5 lens — exact scope boundaries and dependency order.
- Seat 002: Critical / native review lens — false positives, runtime hook failure modes, dangling references.
- Seat 003: Pragmatic / native explore lens — smallest safe edit sequence and verification commands.

## Evidence Inputs
- User-provided target packet and prior-session context.
- Grep evidence showing Codex references in `README.md`, `.opencode/hooks/pre-commit`, `.opencode/commands/**`, and active skill hook/policy/test/doc surfaces.
- Glob evidence showing active Codex hook trees under system-spec-kit and system-skill-advisor.
- Packet docs showing the existing packet is Level 3 and currently complete for `cli-codex` retirement, with generic Codex runtime references previously preserved.

## Convergence Rule
Declare convergence when at least two of three seats agree on the active-scope cleanup strategy and cross-critique raises no unresolved high-severity blocker.

## Known Constraints
- Planning-only council: no implementation files modified.
- Council writes are scoped to packet-local `ai-council/**`.
- Historical specs, archives, changelogs, and intentional fixtures should not be blindly rewritten unless active runtime behavior depends on them.
