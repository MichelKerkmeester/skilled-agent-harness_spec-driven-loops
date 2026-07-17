---
title: "Plan: 017/002 Tool-surface coverage audit"
description: "Execution plan for tool-surface coverage audit."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 017/002 Tool-surface coverage audit

<!-- ANCHOR:summary -->
## 1. SUMMARY
Run a scoped sweep, write packet-local evidence, and update child docs with observed counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Read-only audit phases do not edit scenario files.
- Expansion phase edits only selected `manual_testing_playbook/**` scenario files.
- No `z_archive/**` writes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The generator reads Markdown scenarios, optionally checks live `memory_index` rows through sqlite3, and writes CSV evidence. Scenario expansion uses the existing manual_testing_playbook template style.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. PHASES
1. Inventory inputs.
2. Generate evidence.
3. Author or update scoped docs.
4. Validate packet.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING
Run `node ../evidence/generate-playbook-quality-audit.js`, `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`, and a no-archive diff check.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Existing playbook files under `.opencode/skills/system-spec-kit/manual_testing_playbook`.
- Active sqlite memory index for exact-ID liveness checks.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK
Revert this packet's explicit files and the scoped scenario additions/repairs from the commit.
<!-- /ANCHOR:rollback -->
