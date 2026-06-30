# Iteration 48 — gpt55

**Angle:** Audit every manual/offline parity doc that says 37 while pointing at current 39-tool tests or feature catalog entries.

**Findings:** 4

- **[P2] contradiction** `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3853` — Playbook index still summarizes scenario 427 as 37-tool spec-memory parity
  - evidence: `CLI list-tools parity per system (spec-memory 37 / code-index 8 / skill-advisor 9)` while the same row points to `spec-memory-cli-daemon-backed-surface.md`, whose current catalog says `all 39 MCP tools are CLI commands`.
  - fix: Change the scenario 427 index summary to `spec-memory 39 / code-index 8 / skill-advisor 9`.
- **[P1] contradiction** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md:21` — Compact/completion manual test expects 37 spec-memory tools against a 39-tool catalog source
  - evidence: `Expected signals: Compact and names-only counts are `37`, `8`, and `9``; the playbook source table points at `spec-memory-cli-daemon-backed-surface.md`, which says `Both modes preserve the 39 / 8 / 9 counts`.
  - fix: Update scenario 449 expected counts, embedded Python `expected` map, expected transcript, and pass criteria from 37 to 39 for spec-memory.
- **[P2] misalignment** `.opencode/bin/README.md:68` — bin README documents offline smoke as a 37/8/9 count gate
  - evidence: `cli-offline-smoke.cjs          # Daemon-free smoke: list-tools counts (37/8/9), cwd-independent`; current parity test says `enumerates the canonical tool surface at exactly 39 tools`.
  - fix: Update the README tree and validation command note to describe the smoke target as `39/8/9`, then align the smoke script if it is intended to remain the authoritative offline gate.
- **[P2] drift** `.opencode/skills/system-spec-kit/changelog/v3.5.0.5.md:13` — CLI release note says TOOL_DEFINITIONS generates 37 commands
  - evidence: `All 37 tools become CLI commands, generated at runtime from `TOOL_DEFINITIONS``; the current feature catalog says `all 39 tools become CLI commands generated at runtime from `TOOL_DEFINITIONS``.
  - fix: Add a correction note or update the release note to state the current generated spec-memory CLI surface is 39 tools.
