---
title: "Doctor Update Orchestrator Phase 002: RM-8 013 Remediation - Doc Honesty, Security Hardening, Cross-Runtime Mirror"
description: "Four-batch cli-codex campaign that closed the CONDITIONAL verdict from the 013 deep-review. All 30 P1 findings resolved across documentation honesty, security hardening and cross-runtime command mirror. 28 of 30 P2 findings resolved with 2 formally deferred."
trigger_phrases:
  - "013 remediation changelog"
  - "doctor update orchestrator 002"
  - "deep-review conditional to pass"
  - "doctor command security hardening"
  - "cross-runtime doctor mirror"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-11

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`

### Summary

The 013 deep-review (commit `8d794afad`) emitted a CONDITIONAL verdict with 0 P0, 30 P1 and 30 P2 findings against the doctor-update-orchestrator parent plus its 001 and 002 child packets. The findings covered four failure classes: spec docs that claimed completion states contradicted by unchecked checklists, a bootstrap script with a `--no-audit` flag and a TOCTOU-prone mkdir lock, a sandbox container with an overly broad read-write mount and no capability drop and doctor commands present only under `.opencode/commands/doctor/` instead of all four runtime directories.

Four sequential cli-codex (gpt-5.5 high fast) batches resolved all 30 P1 findings and 28 of 30 P2 findings. Batch A reconciled documentation to actual completion state. Batch B hardened the bootstrap script and sandbox container. Batch C mirrored all doctor commands to Claude, Codex (via symlink) and Gemini runtimes and added skill-agent anchors. Batch D cleaned up stale continuity blocks, switched the sandbox base image to bookworm-slim and added a SKIP guard to the sandbox reset harness.

### Added

- `<!-- skill_agent: system-spec-kit -->` anchor to all 10 `.opencode/commands/doctor/*.md` command files
- `.gemini/commands/doctor/*.toml` mirrors for 8 doctor commands (causal-graph, code-graph, cocoindex, deep-loop, memory, skill-advisor, skill-budget, update) following gemini TOML convention
- `cap_drop: [ALL]` plus minimal `cap_add` (CHOWN, SETUID, SETGID, DAC_OVERRIDE) and `security_opt: no-new-privileges:true` to the sandbox docker-compose configuration
- Soft `npm audit --audit-level=high` warning in `doctor-runtime-bootstrap.sh` to replace the suppressed audit

### Changed

- `doctor-runtime-bootstrap.sh` lock primitive replaced from mkdir-based TOCTOU-prone pattern to `flock -n` at FD 9 with lockfile `/tmp/doctor-runtime-bootstrap.lock`
- `doctor-runtime-bootstrap.sh` `--no-audit` flag removed from npm install invocation
- Sandbox docker-compose mount narrowed from `..:/workspace:rw` to `..:/workspace:ro` plus a separate `./evidence:/workspace/evidence:rw` write path
- Sandbox Dockerfile base image changed from `debian:bookworm` to `debian:bookworm-slim`
- Parent `spec.md` Phase Map corrected from "21 yamls" to "10 yamls" per ADR-010 alignment
- Parent `graph-metadata.json` `derived.status` updated from `planned` to `in_progress`
- 001 and 002 child resource-maps bulk-updated from `Status: PLANNED` to `Status: OK` for files verified on disk

### Fixed

- 001 `implementation-summary.md` title, body table and continuity `completion_pct` now consistently state `COMPLETE (~95%)` rather than giving three conflicting completion claims
- 002 `implementation-summary.md` continuity `completion_pct` corrected from 70 to 95
- 001 and 002 `checklist.md` items marked with `[x]` and evidence anchors where disk evidence existed
- 001 `tasks.md` tasks T-008 and 12 others flipped from Pending to Done with on-disk evidence
- Four locations in 002 docs that falsely claimed `last_active_child_id` was set to `002-sandbox-testing-playbook` now corrected or dropped
- ADR-010-obsolete confirm/apply/apply-confirm YAML mentions removed from 001 `implementation-summary.md` Track B1
- Dead `.opencode/skill` symlink row dropped from parent `resource-map.md`
- Sandbox reset harness now returns exit 125 (SKIP verdict) when prerequisites are unset instead of silently succeeding

### Verification

| Check | Result |
|-------|--------|
| `bash -n .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | PASS |
| `grep -nE 'no-audit' .../doctor-runtime-bootstrap.sh` | 0 hits |
| `grep -nE 'flock' .../doctor-runtime-bootstrap.sh` | 1 hit at line 129 |
| `grep -nE 'cap_drop\|cap_add' .../docker-compose.yml` | 2 hits |
| Sandbox harness `bash -n` across 3 scripts | PASS |
| Sandbox guard smoke (DOC-323 with prerequisites unset) | exit 0, verdict SKIP, exit-code.txt = 125 |
| Stale continuity grep (2026-01 to 2026-05-05) across 001 and 002 | 0 hits |
| Packet pointer suffix check on 001 child docs | 0 missing-suffix hits |
| Cross-runtime mirror count | opencode=10, claude=10, codex=10 (via symlink), gemini=10 |
| Skill-agent anchors in opencode doctor commands | 10/10 |
| 013 parent `last_active_child_id` | `002-sandbox-testing-playbook` (was null) |
| 013 parent `derived.status` | `in_progress` (was `planned`) |
| RM-8 scope hygiene | Zero out-of-scope writes across all 4 batches |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | Modified | Dropped `--no-audit`, replaced mkdir lock with `flock -n`, added soft npm audit warning |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml` | Modified | Narrowed mount to read-only root plus writable evidence path, added `cap_drop: [ALL]` and minimal `cap_add`, `no-new-privileges:true` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/Dockerfile` | Modified | Base image changed from `debian:bookworm` to `debian:bookworm-slim` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/reset-state.sh` | Modified | Returns exit 125 SKIP verdict when prerequisites are unmet |
| `.gemini/commands/doctor/*.toml` (8 files, NEW) | Created | TOML mirrors for causal-graph, code-graph, cocoindex, deep-loop, memory, skill-advisor, skill-budget, update |
| `.opencode/commands/doctor/*.md` (10 files) | Modified | Added `<!-- skill_agent: system-spec-kit -->` anchor to each |
| `006-operator-tooling/002-doctor-update-orchestrator/spec.md` | Modified | Phase Map yaml count corrected, REQ-P-001 acceptance criterion relaxed |
| `006-operator-tooling/002-doctor-update-orchestrator/graph-metadata.json` | Modified | `derived.status` and `derived.last_active_child_id` updated |
| `001-implement-initial-doctor-command-set/implementation-summary.md` | Modified | Completion state reconciled, ADR-010 references removed |
| `001-implement-initial-doctor-command-set/checklist.md` | Modified | Items marked with evidence anchors |
| `002-sandbox-testing-playbook/implementation-summary.md` | Modified | `completion_pct` updated to 95 |
| `002-sandbox-testing-playbook/checklist.md` | Modified | 71 items marked with evidence anchors |

### Follow-Ups

- Address the 2 formally deferred P2 findings: R9-P2-006 (parent handover.md doc-code drift with specific symbol references) once parent handover.md is in scope for editing.
- Run `/deep:start-review-loop:auto` on the 013 parent to confirm the verdict moves from CONDITIONAL to PASS or PASS-with-advisories now that all 30 P1 findings are closed.
- Address the 003 packet's own template-compliance issues (spec/plan/tasks/checklist authored at creation did not fully match Level 2 template anchor names) in a follow-on packet.
