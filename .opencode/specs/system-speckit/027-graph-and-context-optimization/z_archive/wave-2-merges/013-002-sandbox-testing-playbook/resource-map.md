---
title: "Resource Map [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook]"
description: "Path catalog: 23 scenarios + 31 sandbox files + 8 packet docs + 1 root playbook modification + reuse-pattern citations."
trigger_phrases:
  - "002 resource map"
  - "doctor playbook paths"
  - "sandbox file ledger"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored resource map covering ~67 deliverables across packet, playbook, sandbox"
    next_safe_action: "Run generate-context for description and graph-metadata json"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 76
- **By category**: READMEs=0, Documents=12, Commands=0, Agents=0, Skills=0, Specs=2, Scripts=28, Tests=23, Config=8, Meta=0
- **Missing on disk**: 1 PLANNED dispatch log glob remains absent on disk.
- **Scope**: All files created, updated, analyzed, or cited during packet `002-sandbox-testing-playbook` — covers 23 scenario `.md` files + 31 sandbox files (Dockerfile + harness + scripts + fixtures) + 8 packet docs + 1 root playbook modification + reuse-pattern citations.
- **Generated**: 2026-05-09T16:25:00+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Cited` · `Validated`.
> **Status vocabulary**: `OK` (exists on disk) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents — 002 packet-local

| Path | Action | Status | Note |
|------|--------|--------|------|
| `system-spec-kit/026-.../013-.../002-.../spec.md` | Created | OK | Level 3 (REQ-001..REQ-043) |
| `system-spec-kit/026-.../013-.../002-.../plan.md` | Created | OK | 5-phase plan + dispatch design |
| `system-spec-kit/026-.../013-.../002-.../tasks.md` | Created | OK | T-001..T-068 |
| `system-spec-kit/026-.../013-.../002-.../checklist.md` | Created | OK | P0/P1/P2 across phases |
| `system-spec-kit/026-.../013-.../002-.../decision-record.md` | Created | OK | 7 ADRs |
| `system-spec-kit/026-.../013-.../002-.../resource-map.md` | Created | OK | This file |
| `system-spec-kit/026-.../013-.../002-.../description.json` | Created | OK | Auto via `generate-context.js` (T-008) |
| `system-spec-kit/026-.../013-.../002-.../graph-metadata.json` | Created | OK | Auto via `generate-context.js` (T-008) |
| `system-spec-kit/026-.../013-.../002-.../implementation-summary.md` | Created | OK | Phase E close (T-068) |
| `system-spec-kit/026-.../013-.../002-.../dispatch/track-{p-mem,p-causal,p-loop-coco,p-update-migrate}.prompt.md` | Created | OK | Phase B per-track dispatch prompts |
| `system-spec-kit/026-.../013-.../002-.../dispatch/track-d-sandbox.prompt.md` | Created | OK | Phase D dispatch prompt |
| `system-spec-kit/026-.../013-.../002-.../dispatch/logs/track-*.log` | Created | PLANNED | Per-dispatch cli-codex logs # absent on disk |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:tests -->
## 8. Tests — 23 manual playbook scenarios

All under `system-spec-kit/manual_testing_playbook/23--doctor-commands/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `323-doctor-memory-fresh-install.md` | Created | OK | Track P-MEM |
| `324-doctor-memory-drift-detection.md` | Created | OK | Track P-MEM |
| `325-doctor-memory-long-pole-rebuild.md` | Created | OK | Track P-MEM |
| `326-doctor-memory-sigint-cancellation.md` | Created | OK | Track P-MEM |
| `327-doctor-memory-disk-pressure.md` | Created | OK | Track P-MEM |
| `328-doctor-causal-graph-low-coverage.md` | Created | OK | Track P-CAUSAL |
| `329-doctor-causal-graph-confidence-threshold.md` | Created | OK | Track P-CAUSAL |
| `330-doctor-causal-graph-add-only.md` | Created | OK | Track P-CAUSAL |
| `331-doctor-deep-loop-lazy-init.md` | Created | OK | Track P-LOOP-COCO |
| `332-doctor-deep-loop-empty-no-source.md` | Created | OK | Track P-LOOP-COCO |
| `333-doctor-deep-loop-convergence.md` | Created | OK | Track P-LOOP-COCO |
| `334-doctor-cocoindex-daemon-healthy.md` | Created | OK | Track P-LOOP-COCO |
| `335-doctor-cocoindex-daemon-zombie.md` | Created | OK | Track P-LOOP-COCO |
| `336-doctor-cocoindex-daemon-unreachable.md` | Created | OK | Track P-LOOP-COCO |
| `338-doctor-update-G5-confirm-failure-injection.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `339-doctor-update-G6-concurrent.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `340-doctor-update-G7-sigint.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `341-doctor-update-G8-migration-gap.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `342-doctor-update-G9-dashboard.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `344-doctor-update-tier-aware-default.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `345-version-migration-3.3.0.0-to-3.4.1.0.md` | Created | OK | Track P-UPDATE-MIGRATE (E2E) |
| `346-version-migration-cleanup-legacy.md` | Created | OK | Track P-UPDATE-MIGRATE |
| `347-version-migration-no-op.md` | Created | OK | Track P-UPDATE-MIGRATE |

### Root playbook update

| Path | Action | Status | Note |
|------|--------|--------|------|
| `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Phase C: add 23-- to canonical sources, update last_updated, append 23 Section 12 entries |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts — sandbox harness

All under `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/`.

### Container infrastructure

| Path | Action | Status | Note |
|------|--------|--------|------|
| `Dockerfile` | Created | OK | Node 20-bookworm + python3.11 + sqlite3 + jq + git + curl + non-root user |
| `docker-compose.yml` | Created | OK | Service def + volume mount + env vars |

### Fixture infrastructure

| Path | Action | Status | Note |
|------|--------|--------|------|
| `fixtures/fetch-fixtures.sh` | Created | OK | Idempotent download + SHA-256 verify |
| `fixtures/manifest.json` | Created | OK | Per-fixture URL + SHA-256 + size + version |
| `fixtures/.gitkeep` | Created | OK | Empty placeholder until fetched |

### Harness scripts (4)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `harness/run-all.sh` | Created | OK | Iterates 23 scenarios, captures evidence, emits Markdown rollup |
| `harness/reset-state.sh` | Created | OK | Restores fixture archive between scenarios |
| `harness/capture-evidence.sh` | Created | OK | Snapshots stdout, exit code, file deltas, snapshot files |
| `harness/assert-signals.sh` | Created | OK | Grep-based expected-signal matcher |

### Per-scenario shell wrappers (23)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `scenarios/DOC-323-doctor-memory-fresh-install.sh` | Created | OK | Maps 1:1 to scenario .md |
| `scenarios/DOC-324-doctor-memory-drift-detection.sh` | Created | OK | |
| `scenarios/DOC-325-doctor-memory-long-pole-rebuild.sh` | Created | OK | |
| `scenarios/DOC-326-doctor-memory-sigint-cancellation.sh` | Created | OK | |
| `scenarios/DOC-327-doctor-memory-disk-pressure.sh` | Created | OK | |
| `scenarios/DOC-328-doctor-causal-graph-low-coverage.sh` | Created | OK | |
| `scenarios/DOC-329-doctor-causal-graph-confidence-threshold.sh` | Created | OK | |
| `scenarios/DOC-330-doctor-causal-graph-add-only.sh` | Created | OK | |
| `scenarios/DOC-331-doctor-deep-loop-lazy-init.sh` | Created | OK | |
| `scenarios/DOC-332-doctor-deep-loop-empty-no-source.sh` | Created | OK | |
| `scenarios/DOC-333-doctor-deep-loop-convergence.sh` | Created | OK | |
| `scenarios/DOC-334-doctor-cocoindex-daemon-healthy.sh` | Created | OK | |
| `scenarios/DOC-335-doctor-cocoindex-daemon-zombie.sh` | Created | OK | |
| `scenarios/DOC-336-doctor-cocoindex-daemon-unreachable.sh` | Created | OK | |
| `scenarios/DOC-338-doctor-update-G5-confirm-failure-injection.sh` | Created | OK | |
| `scenarios/DOC-339-doctor-update-G6-concurrent.sh` | Created | OK | |
| `scenarios/DOC-340-doctor-update-G7-sigint.sh` | Created | OK | |
| `scenarios/DOC-341-doctor-update-G8-migration-gap.sh` | Created | OK | |
| `scenarios/DOC-342-doctor-update-G9-dashboard.sh` | Created | OK | |
| `scenarios/DOC-344-doctor-update-tier-aware-default.sh` | Created | OK | |
| `scenarios/DOC-345-version-migration-3.3.0.0-to-3.4.1.0.sh` | Created | OK | |
| `scenarios/DOC-346-version-migration-cleanup-legacy.sh` | Created | OK | |
| `scenarios/DOC-347-version-migration-no-op.sh` | Created | OK | |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:specs -->
## 6. Specs — sibling + parent context

| Path | Action | Status | Note |
|------|--------|--------|------|
| `system-spec-kit/026-.../013-.../001-doctor-commands/spec.md` | Cited | OK | REQ-001..REQ-023 + per-command spec being tested |
| `system-spec-kit/026-.../013-.../001-doctor-commands/decision-record.md` | Cited | OK | ADR-001..ADR-009 council 10-line spec |
| `system-spec-kit/026-.../013-.../graph-metadata.json` | Updated | OK | Phase parent active child tracked at parent graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:reuse -->
## Pattern Sources (read-only references)

| Path | Purpose |
|------|---------|
| `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Root playbook — execution policy, verdict rules, Section 12 cross-reference shape |
| `system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md` | Per-scenario template (multi-block TEST EXECUTION) |
| `system-spec-kit/manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md` | Per-scenario template (single-block TEST EXECUTION) |
| `system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Per-scenario template (multi-branch TEST EXECUTION) |
| `specs/z_future/agentic-system-upgrade/.../babysitter-main/external/Dockerfile` | Dockerfile fork starting point (Node 20 + non-root + workspace mount) |
| `system-spec-kit/scripts/tests/test-validation.sh` | Bash 3.2 harness conventions (set -euo pipefail, color guards, structured logging) |
| `commands/doctor/{memory, causal-graph, deep-loop, cocoindex, update}.md` | Markdown entrypoints — canonical command invocation patterns to wrap |
| `commands/doctor/assets/doctor_*.yaml` | 10 active YAML assets — runtime contract being tested |
<!-- /ANCHOR:reuse -->
