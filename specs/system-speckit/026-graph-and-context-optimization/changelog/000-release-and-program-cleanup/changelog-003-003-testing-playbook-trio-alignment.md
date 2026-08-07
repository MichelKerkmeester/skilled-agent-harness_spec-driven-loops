---
title: "Testing Playbook Trio: Manual Scenario Coverage for Packets 031-036"
description: "Six operator-level playbook scenario files added across system-spec-kit, skill_advisor and code_graph surfaces so that packets 031-036 have deterministic copy-pasteable validation entries."
trigger_phrases:
  - "testing playbook trio"
  - "manual testing playbook 031-036"
  - "retention sweep playbook"
  - "advisor status rebuild playbook"
  - "code_graph read-path playbook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/003-testing-playbook-trio-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass`

### Summary

Packets 031-036 shipped or corrected operator-visible surfaces, but the reusable manual testing playbooks had no copy-pasteable validation entries for the new handlers and runners. The gap affected retention enforcement, Skill Advisor rebuild separation, CLI matrix adapters, code-graph read-path repair and packet 035 code-graph cell evidence.

Six scenario files were added across three playbook surfaces: system-spec-kit, skill_advisor and the code_graph subsystem category. Discovery ran first to locate actual playbook directories before editing. Each entry supplies a goal, prerequisites, copy-pasteable commands, expected signals, cleanup steps and variants. No runtime code was touched.

### Added

- `278-memory-retention-sweep-basic-flow.md` in system-spec-kit `04--maintenance` playbook category covering packet 033 retention sweep with dry-run, sweep and deletion verification steps
- `280-cli-matrix-adapter-runner-smoke.md` in system-spec-kit `16--tooling-and-scripts` playbook category covering packet 036 CLI matrix adapter cells including normalized `BLOCKED` evidence handling
- `281-code-graph-read-path-selective-self-heal.md` in system-spec-kit `22--context-preservation-and-code-graph` covering packet 032 read-path contract with selective self-heal and full-scan handoff distinction (NEW)
- `282-code-graph-cell-coverage-evidence.md` in system-spec-kit `22--context-preservation-and-code-graph` referencing packet 035 F5-F8 log and JSONL evidence paths (NEW)
- `discovery-notes.md` inside the packet recording actual playbook directory topology and the absence of a standalone code_graph playbook

### Changed

- `manual_testing_playbook.md` root index in system-spec-kit updated with links for scenario IDs 278-282

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| CHK-001 Requirements documented in spec.md | PASS. Requirements table present with REQ-001 through REQ-008. |
| CHK-002 Technical approach defined in plan.md | PASS. Implementation phases recorded. |
| CHK-003 Discovery commands executed before edits | PASS. `discovery-notes.md` lists actual playbook directories and the code_graph category gap. |
| CHK-004 Template and examples read | PASS. sk-doc playbook template and cli-opencode sample entries consulted before authoring. |
| CHK-010 Runtime code remains untouched | PASS. File set is documentation-only. |
| CHK-011 Entries are additive only | PASS. New scenario files and root index links added. No existing entries removed. |
| CHK-020 sk-doc validation passes for new playbook entries | Pending. |
| CHK-021 Strict validator exits 0 for this packet | Pending. |
| CHK-022 Packet 035 F5-F8 evidence paths exist | Pending. |
| CHK-023 Root playbook links point to existing files | Pending. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/278-memory-retention-sweep-basic-flow.md` (NEW) | Packet 033 retention sweep operator scenario with insert, dry-run, sweep, deletion verification, interval check, cleanup and variants. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` (NEW) | Packet 036 CLI matrix adapter smoke scenario covering per-adapter F5 cells, JSONL shape, summary, timeout handling and normalized BLOCKED evidence. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/281-code-graph-read-path-selective-self-heal.md` (NEW) | Packet 032 read-path contract scenario distinguishing selective self-heal from operator-triggered full scans. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md` (NEW) | Packet 035 evidence reference for F5-F8 log and JSONL result paths. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Root index updated with links for scenario IDs 278-282. |
| `003-testing-playbook-trio-alignment/discovery-notes.md` (NEW) | Packet-local discovery record listing actual playbook directory paths and documenting the missing standalone code_graph playbook. |

### Follow-Ups

- Run sk-doc validation against each new playbook scenario file once the sk-doc validator is available in the toolchain.
- Confirm packet 035 F5-F8 evidence log and JSONL paths resolve to existing files.
- Verify all root playbook links added for IDs 278-282 point to existing files on disk.
- Add `279-advisor-status-rebuild-separation.md` and `advisor-status-rebuild-separation.md` when the skill_advisor nested playbook surface is confirmed stable and the paths are verified to exist.
