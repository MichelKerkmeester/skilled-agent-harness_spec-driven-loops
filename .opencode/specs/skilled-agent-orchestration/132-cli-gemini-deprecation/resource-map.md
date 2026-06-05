---
title: "Resource Map: Deprecate project .gemini runtime surface"
description: "Catalog of files created, updated, removed, or validated during the project .gemini runtime-surface deletion packet."
trigger_phrases:
  - "resource map"
  - "path catalog"
  - "files touched"
  - "gemini deprecation resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cli-gemini-deprecation"
    last_updated_at: "2026-06-05T07:56:00Z"
    last_updated_by: "opencode"
    recent_action: "Added resource map"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "resource-map.md"
      - ".gemini/**"
      - ".opencode/skills/cli-gemini/**"
      - ".opencode/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 180+ touched paths represented; `.gemini/**` and `.opencode/skills/cli-gemini/**` tracked deletions are summarized as grouped rows.
- **By category**: Documents=18, Commands=29, Agents=5, Skills=118, Specs=20, Scripts=2, Tests=6, Config=4, Meta=4, Removed=2 grouped trees.
- **Missing on disk**: 2 grouped trees (`.gemini/**` and `.opencode/skills/cli-gemini/**`, intentionally removed).
- **Scope**: all files created, updated, removed, or validation-touched during the project `.gemini` runtime-surface and `cli-gemini` skill deletion packet.
- **Generated**: 2026-06-05T07:56:00Z.

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Validated`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent by design).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:removed-runtime -->
## Removed Runtime Surface

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.gemini/**` | Removed | MISSING | Deleted checked-in Gemini project runtime mirror: settings, agents, commands, workflows, scripts, skill/spec links, changelog link, and Code Mode config. |
| `.opencode/skills/cli-gemini/**` | Removed | MISSING | Deleted checked-in Gemini CLI skill completely: SKILL.md, README, assets, references, playbooks, changelogs, and graph metadata. |
<!-- /ANCHOR:removed-runtime -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.claude/mcp.json` | Updated | OK | Removed project `.gemini/settings.json` peer assumptions from runtime config references. |
| `.codex/config.toml` | Updated | OK | Removed project Gemini config peer assumptions. |
| `.devin/config.json` | Updated | OK | Removed project Gemini config peer assumptions. |
| `opencode.json` | Updated | OK | Kept OpenCode MCP config aligned with remaining repo-managed runtimes. |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `AGENTS.md` | Updated | OK | Runtime-agent directory guidance now excludes project `.gemini`. |
| `README.md` | Updated | OK | Public repo/runtime overview no longer advertises project `.gemini`. |
| `PUBLIC_RELEASE.md` | Updated | OK | Public-release architecture now lists remaining repo-managed adapters. |
| `scripts/setup-maintainer-filters.sh` | Updated | OK | Maintainer filters no longer include project `.gemini`. |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/README.txt` | Updated | OK | Runtime mirror guidance updated. |
| `.opencode/agents/deep-improvement.md` | Updated | OK | Removed Gemini mirror packaging expectation. |
| `.opencode/agents/deep-review.md` | Updated | OK | Runtime guidance aligned to remaining repo-managed mirrors. |
| `.opencode/agents/orchestrate.md` | Updated | OK | Runtime delegation guidance aligned. |
| `.opencode/agents/prompt-improver.md` | Updated | OK | Runtime mirror guidance aligned. |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/create/README.txt` | Updated | OK | Removed Gemini command/mirror creation target. |
| `.opencode/commands/create/agent.md` | Updated | OK | Removed `.gemini/agents` creation target. |
| `.opencode/commands/create/folder_readme.md` | Updated | OK | Removed Gemini mirror output language. |
| `.opencode/commands/create/sk-skill.md` | Updated | OK | Removed Gemini skill mirror assumptions. |
| `.opencode/commands/create/skill.md` | Updated | OK | Removed Gemini skill mirror assumptions. |
| `.opencode/commands/create/assets/create_agent_auto.yaml` | Updated | OK | Create workflow no longer emits Gemini mirror files. |
| `.opencode/commands/create/assets/create_agent_confirm.yaml` | Updated | OK | Create workflow no longer emits Gemini mirror files. |
| `.opencode/commands/create/assets/create_changelog_auto.yaml` | Updated | OK | Changelog workflow wording aligned. |
| `.opencode/commands/create/assets/create_changelog_confirm.yaml` | Updated | OK | Changelog workflow wording aligned. |
| `.opencode/commands/create/assets/create_feature_catalog_auto.yaml` | Updated | OK | Feature-catalog workflow wording aligned. |
| `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml` | Updated | OK | Feature-catalog workflow wording aligned. |
| `.opencode/commands/create/assets/create_folder_readme_auto.yaml` | Updated | OK | Folder README workflow wording aligned. |
| `.opencode/commands/create/assets/create_folder_readme_confirm.yaml` | Updated | OK | Folder README workflow wording aligned. |
| `.opencode/commands/create/assets/create_sk_skill_auto.yaml` | Updated | OK | Skill workflow no longer targets project `.gemini`. |
| `.opencode/commands/create/assets/create_sk_skill_confirm.yaml` | Updated | OK | Skill workflow no longer targets project `.gemini`. |
| `.opencode/commands/create/assets/create_testing_playbook_auto.yaml` | Updated | OK | Testing-playbook workflow wording aligned. |
| `.opencode/commands/create/assets/create_testing_playbook_confirm.yaml` | Updated | OK | Testing-playbook workflow wording aligned. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Updated | OK | Deep-review runtime list aligned. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Updated | OK | Deep-review runtime list aligned. |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Updated | OK | Deep-improvement runtime list aligned. |
| `.opencode/commands/doctor/_routes.yaml` | Updated | OK | Doctor route manifest no longer scans project Gemini config. |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | Updated | OK | Doctor MCP debug config references aligned. |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Updated | OK | Doctor MCP install config references aligned. |
| `.opencode/commands/doctor/mcp.md` | Updated | OK | Doctor MCP docs aligned. |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Updated | OK | Comment hygiene fix while in changed command surface. |
| `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh` | Updated | OK | Added strict mode and removed stale Gemini config handling. |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Updated | OK | Doctor runtime scan no longer includes project Gemini settings. |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/README.md` | Updated | OK | Skill catalog/runtime notes aligned. |
| `.opencode/skills/cli-claude-code/references/claude_tools.md` | Updated | OK | Cross-runtime wording aligned. |
| `.opencode/skills/cli-devin/changelog/v1.0.5.2.md` | Updated | OK | Historical runtime mirror wording changed to former-Gemini phrasing. |
| `.opencode/skills/cli-gemini/**` | Removed | MISSING | Gemini CLI skill deleted completely per clarified scope. |
| `.opencode/skills/cli-opencode/README.md` | Updated | OK | Cross-runtime mirror references aligned. |
| `.opencode/skills/deep-ai-council/README.md` | Updated | OK | Runtime mirror list aligned. |
| `.opencode/skills/deep-ai-council/assets/runtime_capabilities.json` | Updated | OK | Gemini runtime removed from capability matrix. |
| `.opencode/skills/deep-ai-council/changelog/v1.0.0.0.md` | Updated | OK | Former-Gemini historical wording. |
| `.opencode/skills/deep-ai-council/changelog/v1.2.0.0.md` | Updated | OK | Former-Gemini historical wording. |
| `.opencode/skills/deep-ai-council/feature_catalog/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` | Updated | OK | Runtime mirrors now exclude project Gemini. |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md` | Updated | OK | Manual test now checks remaining mirrors. |
| `.opencode/skills/deep-improvement/README.md` | Updated | OK | Runtime mirror policy aligned. |
| `.opencode/skills/deep-improvement/SKILL.md` | Updated | OK | Mirror policy aligned. |
| `.opencode/skills/deep-improvement/assets/agent-improvement/target_manifest.jsonc` | Updated | OK | Target manifest excludes Gemini mirror. |
| `.opencode/skills/deep-improvement/changelog/v1.0.1.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-improvement/changelog/v1.5.0.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-improvement/feature_catalog/02--integration-scanning/008-runtime-mirrors.md` | Updated | OK | Runtime mirror feature no longer includes project Gemini. |
| `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog aligned. |
| `.opencode/skills/deep-improvement/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md` | Updated | OK | Scanner scenario aligned. |
| `.opencode/skills/deep-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/033-proposal-only-boundary.md` | Updated | OK | Removed Gemini fixture diff. |
| `.opencode/skills/deep-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh` | Updated | OK | Sandbox no longer seeds Gemini mirror. |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Scenario summary aligned. |
| `.opencode/skills/deep-improvement/references/agent-improvement/integration_scanning.md` | Updated | OK | Integration scanner docs aligned. |
| `.opencode/skills/deep-improvement/references/agent-improvement/mirror_drift_policy.md` | Updated | OK | Mirror policy excludes Gemini. |
| `.opencode/skills/deep-improvement/references/shared/promotion_rules.md` | Updated | OK | Promotion guard docs aligned. |
| `.opencode/skills/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Updated | OK | Scanner excludes Gemini mirror. |
| `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs` | Updated | OK | Verifier excludes Gemini mirror. |
| `.opencode/skills/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts` | Updated | OK | Mirror verifier tests updated and passed. |
| `.opencode/skills/deep-research/README.md` | Updated | OK | Runtime matrix aligned. |
| `.opencode/skills/deep-research/SKILL.md` | Updated | OK | Runtime matrix aligned. |
| `.opencode/skills/deep-research/assets/runtime_capabilities.json` | Updated | OK | Gemini runtime removed. |
| `.opencode/skills/deep-research/changelog/v1.2.2.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-research/changelog/v1.4.0.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-research/changelog/v1.6.0.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-research/changelog/v1.6.1.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Updated | OK | Sandbox setup aligned. |
| `.opencode/skills/deep-research/references/guides/capability_matrix.md` | Updated | OK | Capability docs aligned. |
| `.opencode/skills/deep-review/README.md` | Updated | OK | Runtime matrix aligned. |
| `.opencode/skills/deep-review/assets/review_mode_contract.yaml` | Updated | OK | Runtime contract aligned. |
| `.opencode/skills/deep-review/assets/runtime_capabilities.json` | Updated | OK | Gemini runtime removed. |
| `.opencode/skills/deep-review/changelog/v1.1.0.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-review/changelog/v1.3.1.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-review/changelog/v1.3.3.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Updated | OK | Sandbox setup aligned. |
| `.opencode/skills/deep-review/references/protocol/loop_protocol.md` | Updated | OK | Cross-runtime protocol excludes Gemini. |
| `.opencode/skills/sk-code/assets/opencode/checklists/agent_authoring.md` | Updated | OK | Agent authoring mirror guidance aligned. |
| `.opencode/skills/sk-code/assets/opencode/checklists/command_authoring.md` | Updated | OK | Command authoring mirror guidance aligned. |
| `.opencode/skills/sk-code/references/opencode/shared/hooks.md` | Updated | OK | Hook docs aligned. |
| `.opencode/skills/sk-doc/changelog/v1.5.0.0.md` | Updated | OK | Former-Gemini wording. |
| `.opencode/skills/sk-doc/references/agent_creation.md` | Updated | OK | Agent creation mirror guidance aligned. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Updated | OK | Runtime config docs aligned. |
| `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md` | Updated | OK | Removed Gemini config peer. |
| `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` | Updated | OK | Gemini project hook policy unavailable. |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Updated | OK | Repo-managed runtime set excludes Gemini. |
| `.opencode/skills/system-skill-advisor/README.md` | Updated | OK | Runtime docs aligned. |
| `.opencode/skills/system-skill-advisor/changelog/v0.1.0.md` | Updated | OK | Removed Gemini config peer. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Updated | OK | Strict-mode fix after scoped alignment check. |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts` | Updated | OK | Hook parity excludes project Gemini. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Updated | OK | Rename invariants exclude project Gemini. |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` | Updated | OK | Deferred runtime references aligned. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Updated | OK | Runtime docs aligned. |
| `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md` | Updated | OK | Removed Gemini config peer. |
| `.opencode/skills/system-spec-kit/feature_catalog/02--mutation/016-memory-indexing-memorysave.md` | Updated | OK | Feature docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/04--maintenance/036-doctor-router-and-manifest-dispatch.md` | Updated | OK | Doctor feature docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/184-embeddings-and-retry-api.md` | Updated | OK | Config docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/221-template-compliance-contract-enforcement.md` | Updated | OK | Runtime docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/245-embedder-list-registry-inventory.md` | Updated | OK | Runtime docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/277-5-embedding-and-api.md` | Updated | OK | Config docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/283-memory-roadmap-capability-flags.md` | Updated | OK | Config docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/297-cross-runtime-fallback.md` | Updated | OK | Runtime fallback docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/298-runtime-detection.md` | Updated | OK | Runtime detection docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/24--local-llm-query-intelligence/313-category-overview.md` | Updated | OK | Mirror dedupe docs aligned. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Updated | OK | Feature catalog aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/244-runtime-family-count-census.md` | Updated | OK | Runtime count scenario aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/245-runtime-lineage-naming-parity.md` | Updated | OK | Runtime parity scenario aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/246-gemini-runtime-path-resolution.md` | Updated | OK | Now validates project `.gemini` absence. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/287-F--comment-hygiene-gemini-hook.md` | Updated | OK | Gemini hook expectations aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/308-5-embedding-and-api.md` | Updated | OK | Config docs aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/311-memory-roadmap-capability-flags.md` | Updated | OK | Config docs aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/326-cross-runtime-fallback.md` | Updated | OK | Runtime fallback scenario aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/327-runtime-detection.md` | Updated | OK | Runtime detection scenario aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/335-tool-routing-enforcement.md` | Updated | OK | Tool-routing runtime refs aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/368-compound-concept-synthesis.md` | Updated | OK | Mirror dedupe list excludes Gemini. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/README.md` | Updated | OK | Mirror dedupe docs aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Root playbook runtime refs aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Runtime config docs aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Updated | OK | Runtime config docs aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Updated | OK | Runtime config docs aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Updated | OK | Gemini hook docs now describe unavailable project hook policy. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime-detection.ts` | Updated | OK | Gemini project hook policy unavailable. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts` | Updated | OK | Runtime fixtures aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Updated | OK | Parity test aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts` | Updated | OK | Runtime detection test aligned. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Updated | OK | Hook system docs aligned. |
| `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook_validation.md` | Updated | OK | Hook validation docs aligned. |
| `.opencode/skills/system-spec-kit/references/workflows/rename_pattern.md` | Updated | OK | Runtime mirror docs aligned. |
| `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Updated | OK | Resource-map extractor aligned. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Updated | OK | Runtime capability expected IDs updated. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Updated | OK | Runtime capability expected IDs updated. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-mirror-parity.vitest.ts` | Updated | OK | Mirror parity excludes Gemini. |
| `.opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` | Updated | OK | Workflow test references aligned. |
| `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Updated | OK | Template runtime-surface wording aligned. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Updated | OK | Parent graph metadata refreshed. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/spec.md` | Created | OK | Active packet specification. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/plan.md` | Created | OK | Active packet implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/tasks.md` | Created | OK | Active packet task ledger. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/checklist.md` | Created | OK | Active packet verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/decision-record.md` | Created | OK | Active packet decision record. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/implementation-summary.md` | Created | OK | Active packet delivery summary. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/debug-delegation.md` | Created | OK | Debug handoff preserved. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/description.json` | Created | OK | Packet metadata. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/graph-metadata.json` | Created | OK | Packet graph metadata. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/complete-config.json` | Created | OK | Auto-mode configuration. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/scratch/.gitkeep` | Created | OK | Scratch directory placeholder. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/spec.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/plan.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/tasks.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/checklist.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/decision-record.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/implementation-summary.md` | Updated | OK | User-visible packet copy. |
| `specs/skilled-agent-orchestration/132-cli-gemini-deprecation/resource-map.md` | Created | OK | This resource map. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts` | Updated | OK | Verified remaining mirror set. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts` | Updated | OK | Runtime fixture expectations updated. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Updated | OK | Council parity excludes Gemini. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts` | Updated | OK | Runtime detection expects unavailable Gemini project hooks. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Updated | OK | Runtime capability expectations updated. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Updated | OK | Runtime capability expectations updated. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-mirror-parity.vitest.ts` | Updated | OK | Mirror parity excludes Gemini. |
| `.opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` | Updated | OK | Workflow tests aligned. |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:validation -->
## Validation Commands

| Command | Result | Note |
|---------|--------|------|
| `glob .gemini/**` | PASS | No files found. |
| `glob .opencode/skills/cli-gemini/**` | PASS | No files found. |
| `rg --pcre2 "(^|[^~A-Za-z0-9_/-])\.gemini/(agents|commands|workflows|scripts|skills|specs|changelog|settings\.json|GEMINI\.md|\.utcp_config\.json)" ...` | PASS | No disallowed active project `.gemini` path references outside specs. |
| `npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts tests/multi-ai-council-runtime-parity.vitest.ts` | PASS | 33/33 tests passed. |
| `npx vitest run ../scripts/tests/deep-research-contract-parity.vitest.ts ../scripts/tests/deep-review-contract-parity.vitest.ts ../scripts/tests/multi-ai-council-mirror-parity.vitest.ts` | PASS | 16 passed, 1 skipped. |
| `npx vitest run --config vitest.config.mjs shared/tests/mirror-sync-verify.vitest.ts` | PASS | 3/3 tests passed. |
| `node .opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` | PASS | 89/89 checks passed. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/{agents,commands,skills}` | PASS | Active changed surfaces passed; skills had unrelated non-blocking warnings only. |
| `skill_graph_scan .opencode/skills` | PASS | Live skill graph has 21 skills, 4 CLI orchestrators, 0 stale skills. |
| `advisor_rebuild force:true` | PASS | Advisor rebuild completed; `use gemini cli` recommendation no longer returns `cli-gemini`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation --strict` | PASS | 0 errors, 0 warnings. |
| `memory_ingest_status job_neBYuBo1av7c` | PASS | Final packet ingest complete, 6/6 docs. |
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Paths are relative to the repository root.
- `.gemini/**` is grouped because every checked-in project Gemini runtime file under that tree was intentionally removed.
- `.opencode/skills/cli-gemini/**` is grouped because every checked-in Gemini CLI skill file under that tree was intentionally removed.
- The unrelated untracked packet `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/015-docs-drift-review/` is not part of this map.
<!-- /ANCHOR:author-instructions -->
