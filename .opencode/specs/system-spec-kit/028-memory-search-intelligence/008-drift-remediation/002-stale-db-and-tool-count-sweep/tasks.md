---
title: "Tasks: Stale DB-Name and Tool-Count Sweep"
description: "Fix tasks for remediation phase 2."
trigger_phrases:
  - "028 drift remediation"
  - "tasks: stale db-name and tool-count sweep"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded tasks for phase 2"
    next_safe_action: "Work the fix tasks"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Stale DB-Name and Tool-Count Sweep

<!-- ANCHOR:notation -->
## Task Notation
- [ ] open
- [x] fixed and verified
- [~] false-positive (reason in ledger)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Load ledger entries for 002-stale-db-and-tool-count-sweep
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] F014 fix `.opencode/bin/cli-offline-smoke.cjs` Offline smoke hardcodes spec-memory CLI count as 37 while the MCP registry has 39 tools
- [ ] F015 fix `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md` Daemon CLI reference documents spec-memory CLI as 37 tools, contradicting the 39-tool MCP surface
- [ ] F039 fix `.opencode/install_guides/README.md` Install guide claims mk_skill_advisor has 8 tools instead of the registered 9
- [ ] F059 fix `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` INSTALL_GUIDE still presents context-index__*.sqlite as the active database
- [ ] F060 fix `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md` Manual parity playbook still pins spec-memory CLI to 37 tools
- [ ] F097 fix `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md` Manual playbook still locks spec-memory CLI parity to 37 tools
- [ ] F098 fix `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` CLI env reference still says spec-memory has 37 tools
- [ ] F135 fix `.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md` v3.6 changelog says full daemon CLI surface is 37 tools
- [ ] F136 fix `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` Automated parity test now asserts 39 while manual docs call it a 37-tool lock
- [ ] F175 fix `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md` Stress scenario rationale cites 37 tools as the size driver
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] opus re-reads every touched file; evidence resolved; scope respected
- [ ] validate.sh on this phase --strict exit 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 10 findings terminal in the ledger.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- ../remediation-ledger.jsonl
<!-- /ANCHOR:cross-refs -->
