---
title: "Checklist: Stale DB-Name and Tool-Count Sweep"
description: "Verification checklist for remediation phase 2."
trigger_phrases:
  - "028 drift remediation"
  - "checklist: stale db-name and tool-count sweep"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded checklist for phase 2"
    next_safe_action: "Verify each finding"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Stale DB-Name and Tool-Count Sweep

<!-- ANCHOR:protocol -->
## Protocol
Mark an item done only after opus re-reads the file and confirms the cited evidence is resolved (or records a false-positive in the ledger).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Ledger entries for 002-stale-db-and-tool-count-sweep loaded
- [ ] Cited files present
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Edits minimal and scoped to cited drift
- [ ] Comment hygiene respected (no artifact-ids/spec paths in code comments)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Affected tests/validators re-run where a finding touches code or a test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets or scope-violating changes introduced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] F014 `.opencode/bin/cli-offline-smoke.cjs` Offline smoke hardcodes spec-memory CLI count as 37 while the MCP registry has 39 tools
- [ ] F015 `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md` Daemon CLI reference documents spec-memory CLI as 37 tools, contradicting the 39-tool MCP surface
- [ ] F039 `.opencode/install_guides/README.md` Install guide claims mk_skill_advisor has 8 tools instead of the registered 9
- [ ] F059 `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` INSTALL_GUIDE still presents context-index__*.sqlite as the active database
- [ ] F060 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md` Manual parity playbook still pins spec-memory CLI to 37 tools
- [ ] F097 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md` Manual playbook still locks spec-memory CLI parity to 37 tools
- [ ] F098 `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` CLI env reference still says spec-memory has 37 tools
- [ ] F135 `.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md` v3.6 changelog says full daemon CLI surface is 37 tools
- [ ] F136 `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` Automated parity test now asserts 39 while manual docs call it a 37-tool lock
- [ ] F175 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md` Stress scenario rationale cites 37 tools as the size driver
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] No files created or moved outside the cited targets
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary
- [ ] All 10 findings terminal in the ledger
<!-- /ANCHOR:summary -->
