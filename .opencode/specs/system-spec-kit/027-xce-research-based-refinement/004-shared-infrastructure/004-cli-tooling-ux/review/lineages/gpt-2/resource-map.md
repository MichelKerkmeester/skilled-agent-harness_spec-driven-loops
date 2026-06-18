# Review Resource Map

## Phase-5 Augmentation
- Novel logic gaps: F001 shows freshness-hash finalization is asymmetric across CLI packages.
- Documentation gaps: F003 shows the legacy parity playbook still teaches the pre-smoke workflow.
- Prompt-safety hardening gaps: F002 shows the bridge allowlist is tool-safe but not route-pair exact.

## Evidence Sources
| Finding | Sources |
| --- | --- |
| F001 | `.opencode/bin/code-index.cjs:60-78`, `.opencode/bin/skill-advisor.cjs:81-95`, package build scripts |
| F002 | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-19`, `:221-227`, `:347-356` |
| F003 | `001-cli-freshness-and-smoke/spec.md:89-96`, `implementation-summary.md:54-58`, playbook `:32-50` |
