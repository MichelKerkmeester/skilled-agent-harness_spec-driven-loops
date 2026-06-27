---
title: "Feature Specification: Stale DB-Name and Tool-Count Sweep"
description: "Remediation phase 2 of 6: 10 drift findings (P1 6, P2 4). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: stale db-name and tool-count sweep"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 2 from the remediation ledger"
    next_safe_action: "Triage and fix the 10 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Stale DB-Name and Tool-Count Sweep

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 2 of 6
- Findings: 10 (P1 6, P2 4)
- Ledger: ../remediation-ledger.jsonl (phase=002-stale-db-and-tool-count-sweep)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 10 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 10 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.opencode/bin/cli-offline-smoke.cjs`
- `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md`
- `.opencode/install_guides/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### Required (complete OR user-approved deferral)
- F014 [P1 drift] `.opencode/bin/cli-offline-smoke.cjs:12` Offline smoke hardcodes spec-memory CLI count as 37 while the MCP registry has 39 tools
- F015 [P1 contradiction] `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:27` Daemon CLI reference documents spec-memory CLI as 37 tools, contradicting the 39-tool MCP surface
- F039 [P1 contradiction] `.opencode/install_guides/README.md:318` Install guide claims mk_skill_advisor has 8 tools instead of the registered 9
- F059 [P1 drift] `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:98,101` INSTALL_GUIDE still presents context-index__*.sqlite as the active database
- F060 [P1 contradiction] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:3` Manual parity playbook still pins spec-memory CLI to 37 tools
- F097 [P1 misalignment] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:3,11,17-21,40,59-60,69,89,93` Manual playbook still locks spec-memory CLI parity to 37 tools
- F098 [P2 contradiction] `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:623` CLI env reference still says spec-memory has 37 tools
- F135 [P2 drift] `.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md:129` v3.6 changelog says full daemon CLI surface is 37 tools
- F136 [P2 misalignment] `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts:122` Automated parity test now asserts 39 while manual docs call it a 37-tool lock
- F175 [P2 drift] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md:11` Stress scenario rationale cites 37 tools as the size driver
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every listed finding terminal in the ledger (fixed+verified or false-positive with reason).
- opus re-read confirms evidence resolved and scope respected.
- validate.sh --strict exit 0 for this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS
- A fix touches more than the cited drift (scope creep) -> opus verifies scope per file.
- A finding is a false positive -> triage before fixing; never fix a phantom.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- No behavior regressions; edits are doc/config/test alignment only.
- Comment hygiene: no artifact-ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- Same file cited by multiple findings -> batch edits, verify once per file.
- Evidence line numbers shifted since the audit -> verify by content, not line.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS
None open; deferrals (if any) are recorded as false-positive with reason in the ledger.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCS
- ../remediation-ledger.jsonl
- ../../research/drift-audit-2026-06-27/converged-report.md
<!-- /ANCHOR:related-docs -->
