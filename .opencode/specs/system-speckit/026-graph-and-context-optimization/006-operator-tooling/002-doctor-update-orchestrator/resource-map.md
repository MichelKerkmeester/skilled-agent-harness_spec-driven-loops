---
title: "Resource Map: Doctor Update Orchestrator Parent Aggregate"
description: "Parent-level path ledger for both 013 child phases: doctor command authoring and sandbox/testing playbook, including later fresh-start MCP launcher and scenario verification fixes."
trigger_phrases:
  - "013 resource map"
  - "doctor update paths"
  - "doctor command resources"
  - "sandbox testing playbook resources"
  - "fresh-start MCP launcher"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator"
    last_updated_at: "2026-05-10T07:28:30Z"
    last_updated_by: "codex"
    recent_action: "Created parent aggregate resource map for both child phases"
    next_safe_action: "Use resource-map.md for cross-phase file ledger review"
    blockers: []
    key_files:
      - "resource-map.md"
      - "001-implement-initial-doctor-command-set/resource-map.md"
      - "002-sandbox-testing-playbook/resource-map.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-013-resource-map-2026-05-10"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parent aggregate resource map requested and placed at 013 root"
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total listed rows**: 81
- **Expanded path coverage**: 140+ files when glob rows are expanded
- **By category**: Commands=9, Skills=12, Specs=18, Scripts=12, Tests=9, Config=11, Meta=3, Verification=7
- **Missing on disk**: 1 removed legacy handover path; all other listed repo paths are OK or runtime-generated
- **Scope**: Parent aggregate for `010-doctor-update-orchestrator`, covering child phase `001-implement-initial-doctor-command-set`, child phase `002-sandbox-testing-playbook`, the later root-cause launcher/bootstrap fix, and the scenario verification pass.
- **Generated**: 2026-05-10T09:28:30+02:00

> **Action vocabulary**: `Created` | `Updated` | `Analyzed` | `Removed` | `Cited` | `Validated` | `Moved`.
> **Status vocabulary**: `OK` | `MISSING` | `RUNTIME` | `EXTERNAL`.
> This is the parent aggregate requested after both phase maps already existed. The child maps remain useful for historical phase-local detail.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/doctor/memory.md` | Created | OK | Phase 001 isolated `/doctor:memory` entrypoint. |
| `.opencode/commands/doctor/causal-graph.md` | Created | OK | Phase 001 isolated `/doctor:causal-graph` entrypoint. |
| `.opencode/commands/doctor/deep-loop.md` | Created | OK | Phase 001 isolated `/doctor:deep-loop` entrypoint. |
| `.opencode/commands/doctor/cocoindex.md` | Created | OK | Phase 001 isolated `/doctor:cocoindex` entrypoint. |
| `.opencode/commands/doctor/update.md` | Updated | OK | Phase 001 orchestrator; later patched for launcher bootstrap, `--resume-bootstrap`, and `SPECKIT_FAIL_STEP`. |
| `.opencode/commands/doctor/code-graph.md` | Cited | OK | Canonical existing doctor command pattern. |
| `.opencode/commands/doctor/skill-advisor.md` | Cited | OK | Existing lower-mutation doctor command pattern. |
| `.opencode/commands/doctor/skill-budget.md` | Cited | OK | Existing doctor command surface context. |
| `.opencode/commands/doctor/{mcp_debug.md,mcp_install.md}` | Cited | OK | Existing MCP doctor command context. |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Analyzed | OK | Spec-folder workflow, phase-parent, resource-map, and validation rules. |
| `.opencode/skills/sk-doc/SKILL.md` | Analyzed | OK | Documentation quality and Markdown creation guidance. |
| `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Analyzed | OK | Template source for this parent aggregate map. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Phase 002 registered category `doctor-commands` and scenario index entries. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/*.md` | Created | OK | 23 scenario docs: DOC-323..336, DOC-338..342, DOC-344..347. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md` | Cited | OK | Scenario structure reference. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/maintenance/startup-runtime-compatibility-guards.md` | Cited | OK | Startup/runtime scenario structure reference. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Cited | OK | Cross-runtime fallback scenario reference. |
| `.opencode/skills/system-spec-kit/mcp_server/database/README.md` | Cited | OK | Database artifact and auto-init contract reference. |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | Updated | OK | 3.3.0.0 -> 3.4.1.0 migration chain and launcher/bootstrap guidance. |
| `.opencode/skills/system-spec-kit/package-lock.json` | Updated | OK | Added MCP server type dependency lockfile coverage for build parity. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.spec-kit-memory-launcher.json` | Created | RUNTIME | Launcher runtime state file written during smoke/startup checks. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` | Updated | OK | Phase-parent topology and requirements for both child phases. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/description.json` | Updated | OK | Parent metadata refreshed by memory save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/graph-metadata.json` | Updated | OK | Parent graph metadata refreshed by memory save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/handover.md` | Created | OK | Root handover with root-cause fix and scenario verification evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/resource-map.md` | Created | OK | This parent aggregate file. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md,resource-map.md}` | Created | OK | Phase 001 canonical docs for doctor command authoring. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/{description.json,graph-metadata.json}` | Created | OK | Phase 001 metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/ai-council/*` | Created | OK | Multi-AI council plan and report for orchestrator design/root-cause perspective. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/dispatch/*.prompt.md` | Created | OK | Phase 001 cli-codex/worker dispatch prompts. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/handover.md` | Created | OK | Child handover for parity with sibling 002 (closes P2-007-003 from re-review). Documents Phase A-E completion + 003 RM-8 remediation outcomes + G4-G9 deferred runtime smoke gates. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md,resource-map.md,handover.md}` | Created | OK | Phase 002 canonical docs for sandbox and testing playbook. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/{description.json,graph-metadata.json}` | Created | OK | Phase 002 metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/dispatch/*.prompt.md` | Created | OK | Phase 002 dispatch prompts for scenarios, sandbox, and repair tracks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/dispatch/logs/*.log` | Created | OK | Phase 002 dispatch execution logs. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/external/opencode--spec-kit-skilled-agent-orchestration-3.3.0.1.{tar.gz,zip}` | Cited | OK | Legacy fixture source for migration/E2E testing. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/external/opencode--spec-kit-skilled-agent-orchestration-3.4.0.0.{tar.gz,zip}` | Cited | OK | Current-ish fixture source for sandbox comparison. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md` | Cited | OK | Predecessor context for causal-edge starting state. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json` | Cited | OK | Parent 026 graph context and child relationship source. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Created | OK | Fresh-start MCP launcher; builds missing runtime outputs before OpenCode registers MCP tools. |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | Created | OK | Non-MCP bootstrap script for `/doctor:update` Phase 0 and fixture checks. |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Cited | OK | Existing command-side Python utility pattern. |
| `.opencode/commands/doctor/scripts/{mcp-doctor.sh,mcp-doctor-lib.sh}` | Cited | OK | Existing shell doctor helper pattern. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` | Cited | OK | Repo-rooted invocation pattern for graph initialization. |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation.sh` | Cited | OK | Bash harness conventions for Phase 002 scripts. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/fixtures/fetch-fixtures.sh` | Created | OK | Fixture fetch and checksum verification script. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/harness/run-all.sh` | Created | OK | Sandbox scenario orchestrator. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/harness/reset-state.sh` | Created | OK | Fixture reset between scenarios. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/harness/capture-evidence.sh` | Created | OK | Evidence capture for stdout, exit codes, deltas, and snapshots. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/harness/assert-signals.sh` | Created | OK | Expected-signal matcher. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/scenarios/DOC-*.sh` | Created | OK | 23 scenario wrappers mapping playbook docs to runnable commands. |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/323-doctor-memory-fresh-install.md` | Created | OK | `/doctor:memory` fresh install scenario. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/324-doctor-memory-drift-detection.md` | Created | OK | `/doctor:memory` drift scenario. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/325-doctor-memory-long-pole-rebuild.md` | Created | OK | `/doctor:memory` long-pole rebuild scenario. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/326-doctor-memory-sigint-cancellation.md` | Created | OK | `/doctor:memory` cancellation scenario. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/327-doctor-memory-disk-pressure.md` | Created | OK | `/doctor:memory` disk pressure scenario. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/328-*.md` to `336-*.md` | Created | OK | Causal graph, deep-loop, and CocoIndex scenarios. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/338-*.md` to `347-*.md` | Created | OK | `/doctor:update` and version-migration scenarios; DOC-337 and DOC-343 intentionally unused. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/evidence/DOC-323/*` | Created | OK | Existing captured sample evidence from sandbox harness run. |
| `/tmp/sk_bootstrap_full_matrix`, `/tmp/sk_oc_tool_visibility`, `/tmp/sk_doctor_update_full_e2e` | Validated | EXTERNAL | Disposable verification workspaces for bootstrap matrix, fresh MCP visibility, and full v3.3-style E2E. |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Created | OK | `/doctor:memory` workflow contract. |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | Created | OK | `/doctor:causal-graph` workflow contract. |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Created | OK | `/doctor:deep-loop` workflow contract. |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` | Created | OK | `/doctor:cocoindex` workflow contract. |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Updated | OK | `/doctor:update` orchestrator; patched for Phase 0 bootstrap and DOC-338 failure injection. |
| `.opencode/commands/doctor/assets/{doctor_code-graph.yaml,doctor_skill-advisor.yaml,doctor_skill-budget.yaml,doctor_mcp_debug.yaml,doctor_mcp_install.yaml}` | Cited | OK | Existing doctor workflow references and surrounding command surface. |
| `.mcp.json` | Updated | OK | Routes `spec_kit_memory` through the launcher. |
| `opencode.json` | Updated | OK | Routes `spec_kit_memory` through the launcher for OpenCode. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/docker-compose.yml` | Created | OK | Sandbox service config. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/fixtures/manifest.json` | Created | OK | Fixture URL/checksum manifest. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/doctor-commands/Dockerfile` | Created | OK | Sandbox container image definition. |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.{flock,lock,last-run.json}` | Validated | RUNTIME | Runtime lock/state artifacts checked in full E2E; not all are expected to exist persistently. |
| `.opencode/skills/system-spec-kit/mcp_server/database/*.sqlite.*doctor-update*.bak` | Validated | RUNTIME | Snapshot artifact pattern verified in full E2E temp workspace. |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:verification-commands -->
## Verification Commands

| Check | Result |
|-------|--------|
| `python3 -c "import yaml; yaml.safe_load(open('.opencode/commands/doctor/assets/doctor_update.yaml'))"` | PASS |
| `python3 -c "import json; json.load(open('opencode.json')); json.load(open('.mcp.json'))"` | PASS |
| `bash -n .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | PASS |
| `node --check .opencode/bin/spec-kit-memory-launcher.cjs` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator --strict` | PASS, 0 errors, 0 warnings |
| Full `/doctor:update` v3.3-style OpenCode E2E | PASS, `STATUS=OK`, `final_status=ok`, 648 seconds |
| Scenario contract matrix | PASS, 17/17 |
<!-- /ANCHOR:verification-commands -->
