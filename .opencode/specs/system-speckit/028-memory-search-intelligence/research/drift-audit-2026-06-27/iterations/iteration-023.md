# Iteration 23 — gpt55

**Angle:** Run the offline smoke check and `node .opencode/bin/spec-memory.cjs list-tools` against a built dist to confirm whether the spec-memory CLI currently reports 37 or 39 tools, and identify which two tools are filtered or counted differently.

**Findings:** 4

- **[P1] contradiction** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:3` — Manual parity playbook still pins spec-memory CLI to 37 tools
  - evidence: "spec-memory 37, code-index 8, skill-advisor 9"
  - fix: Update the playbook to 39 for spec-memory and remove the implied two-tool exclusion unless an explicit filter is implemented and named.
- **[P2] contradiction** `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:623` — CLI env reference advertises stale 37-tool spec-memory surface
  - evidence: "node .opencode/bin/spec-memory.cjs` (37 tools)"
  - fix: Change the spec-memory CLI count to 39 and keep sibling counts at code-index 8 and skill-advisor 9.
- **[P2] drift** `.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md:129` — v3.6 changelog says full daemon CLI surface is 37 tools
  - evidence: "37 tools for spec-memory, 8 for code-index and 9 for skill-advisor"
  - fix: Add a correction note or update this release note to say the current spec-memory CLI parity surface is 39 tools.
- **[P2] misalignment** `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts:122` — Automated parity test now asserts 39 while manual docs call it a 37-tool lock
  - evidence: "enumerates the canonical tool surface at exactly 39 tools"
  - fix: Update manual parity references that describe this test as a 37-tool lock; the current test already matches the built CLI output.
