---
title: "Verification Checklist: /create:diff slash command for the create-diff mode"
description: "Planned P0/P1 verification gates for the /create:diff command: routing + asset existence, tool-surface subset with no Task, engine-never-bypassed, mode-registry command wiring, generated Codex stub, full-user-surface presentation contract, and recursive strict validation."
trigger_phrases:
  - "create diff command checklist"
  - "diff command verification"
  - "create-diff command gates"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/009-create-diff-command"
    last_updated_at: "2026-07-15T19:16:49Z"
    last_updated_by: "claude"
    recent_action: "Applied create-command conformance fix; reconciled 009 to Complete"
    next_safe_action: "Commit the conformance fix + finalized 009 and push to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-command-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: /create:diff slash command for the create-diff mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before the packet is called complete |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later follow-up |

> This packet is built and structurally verified: the build/structural/canon gates below are `[x]` with inline `[EVIDENCE: ...]` brackets. One gate is deferred — live end-to-end `/create:diff` invocation in an actual OpenCode/Codex session (CHK-027) — because it is a user-runtime acceptance step not reproducible from this authoring environment. All verification recorded here is structural (shape, parse, asset resolution, flag validity, registry/canon gates, strict spec validation).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The sibling command pattern (`flowchart.md` + its three assets) and the engine CLI surface (`create-diff/SKILL.md` §3) were read before authoring. [EVIDENCE: `flowchart.md` + its three assets and create-diff SKILL.md §3 were read before authoring (T001).]
- [x] CHK-002 [P0] Scope frozen in `spec.md`; operator selection recorded: full sibling pattern despite the mode being engine-backed. [EVIDENCE: scope frozen in `spec.md` as the full sibling pattern, engine-backed (operator-selected) (T001).]
- [x] CHK-003 [P1] The four command artifacts and the two touched files (`mode-registry.json`, generated Codex stub) are enumerated and nothing outside that scope is planned. [EVIDENCE: the four command artifacts + `mode-registry.json` + the generated Codex stub are the only changes; nothing outside that scope authored.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] The router `diff.md` has valid frontmatter and all six sections (ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY) and ends `User request: $ARGUMENTS`. [EVIDENCE: `diff.md` (54 lines) has valid frontmatter, all six sections, and ends `User request: $ARGUMENTS` (T002).]
- [x] CHK-011 [P0] No workflow behavior is embedded in the router; routing is separated from presentation from workflow (the sibling contract). [EVIDENCE: verified structurally — the router carries only routing; presentation and workflow live in `create_diff_presentation.txt` and the two YAMLs (T002/T008).]
- [x] CHK-012 [P1] The presentation contract owns all user-visible wording; the router invents no visible surface. [EVIDENCE: `create_diff_presentation.txt` (183 lines) owns the user-visible surface; the router adds none (T003).]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] REQ-001 routing: `:auto` resolves `create_diff_auto.yaml`, `:confirm`/omitted resolves `create_diff_confirm.yaml`; exactly one workflow per invocation. [EVIDENCE: verified structurally — MODE ROUTING maps `:auto` → `create_diff_auto.yaml` and `:confirm`/omitted → `create_diff_confirm.yaml`, one workflow per token (T008).]
- [x] CHK-021 [P0] REQ-002 asset existence: every OWNED ASSETS / EXECUTION TARGETS path resolves on disk; a missing asset stops the router with the exact path. [EVIDENCE: `create_diff_presentation.txt`, `create_diff_auto.yaml`, `create_diff_confirm.yaml` all resolve on disk (3/3); router EXECUTION TARGETS maps `:auto`/`:confirm` each to exactly one existing YAML (T008).]
- [x] CHK-022 [P0] REQ-003 engine-never-bypassed: the workflow drives `create_diff.py` (`compare`/`compare-pair`) + `validate_report.py`; no diffing/extraction/rendering re-implemented; source byte-unchanged. [EVIDENCE: verified structurally — the YAMLs shell out to `create_diff.py` (`compare`/`compare-pair`) + `validate_report.py` and re-implement no diffing; compare runs read-only against the source (T009).]
- [x] CHK-023 [P1] REQ-004 tool surface: `allowed-tools` is exactly `Read, Write, Edit, Bash, Glob, Grep` — a subset of the mode surface — and excludes `Task`. [EVIDENCE: `allowed-tools` verified exactly `Read, Write, Edit, Bash, Glob, Grep`, no `Task` (T009).]
- [x] CHK-024 [P1] REQ-007 presentation surface: Phase 0 self-check, the four startup questions, setup/status dashboards, and the completion display (report path + change counts + fidelity tier + validator result) are present. [EVIDENCE: `create_diff_presentation.txt` carries the Phase 0 self-check, the four startup questions, setup/status dashboards, and the completion display (report path, +A −R ~C counts, fidelity tier, validator result) (T003).]
- [x] CHK-025 [P0] REQ-005 registration: `mode-registry.json` create-diff `command` = `"/create:diff"`; JSON valid; `parent-skill-check.cjs` clean. [EVIDENCE: `mode-registry.json` create-diff `command` = `"/create:diff"`; valid JSON; `parent-skill-check.cjs` → "all hard invariants passed, 0 warnings" (12 modes) (T006/T010).]
- [x] CHK-026 [P1] REQ-006 Codex stub: `.codex/prompts/create-diff.md` is generated by `sync-prompts.cjs` and regenerates idempotently with no hand-authored drift. [EVIDENCE: `.codex/prompts/create-diff.md` generated by `sync-prompts.cjs` (wrote 1 of 38); `--check` re-run → "PASS: 38 prompts are in sync"; 12-line stub, no hand-edit (T007).]
- [ ] CHK-027 [P1] DEFERRED — Live end-to-end `/create:diff` invocation in an actual OpenCode/Codex session (baseline vs explicit-pair run producing a validated report end to end) is NOT exercised: it is a user-runtime acceptance step not reproducible from this authoring environment. All verification here is structural (shape, parse, asset resolution, flag validity, registry/canon gates, strict spec validation). See `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Router artifact created and complete; owned-asset table matches the files on disk. [EVIDENCE: `diff.md` created; the OWNED ASSETS table matches the files on disk (T002/T008).]
- [x] CHK-031 [P0] Both workflow YAMLs created; each drives the engine end to end (`:auto` gate-free, `:confirm` checkpointed). [EVIDENCE: `create_diff_auto.yaml` (566 lines, gate-free) and `create_diff_confirm.yaml` (629 lines, checkpointed) created; each drives the engine end to end (T004/T005).]
- [x] CHK-032 [P1] Presentation contract created with the full user surface (Phase 0, startup questions, dashboards, completion display). [EVIDENCE: `create_diff_presentation.txt` (183 lines) created with the full user surface (T003).]
- [x] CHK-033 [P0] Invariants hold: a produced report comes only from the engine + validator; `allowed-tools` never exceeds the mode surface. [EVIDENCE: verified structurally — a produced report comes only from `create_diff.py` + `validate_report.py`, and `allowed-tools` never exceeds the mode surface (T009).]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] The command adds no network, upload, or telemetry surface; all processing stays local (create-diff contract preserved). [EVIDENCE: verified structurally — the workflow shells out only to the local `create_diff.py`/`validate_report.py` CLIs; no network, upload, or telemetry surface added (T009).]
- [x] CHK-041 [P0] `allowed-tools` grants no capability beyond the mode surface; `Task` (sub-agent dispatch) is excluded. [EVIDENCE: `allowed-tools` grants nothing beyond the mode surface; `Task` excluded (T009).]
- [x] CHK-042 [P1] The command never mutates the source document; comparison stays read-only against it. [EVIDENCE: verified structurally — the workflow drives read-only `compare`/`compare-pair`; the source document is never mutated (T009).]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` are consistent; status reads Complete. [EVIDENCE: status flipped to Complete consistently across the spec/plan/tasks/implementation-summary frontmatter and the spec + implementation-summary `Status` metadata rows.]
- [x] CHK-051 [P1] The router `argument-hint` documents the `:auto`/`:confirm` modes and the setup arguments. [EVIDENCE: the router `argument-hint` documents the `:auto`/`:confirm` modes and the setup arguments (T002).]
- [~] CHK-052 [P1] `create-diff/SKILL.md` §8 "Optional `/create:diff` command" note is superseded once the command exists (tracked; owner-updated). [DEFERRED: `create-diff/SKILL.md` is outside the 009 write scope; the §8 supersede edit is owner-owned and handled separately.]
- [x] CHK-053 [P1] The presentation contract's completion display states the fidelity tier honestly and never presents a limited-fidelity result as complete. [EVIDENCE: verified structurally — the completion display in `create_diff_presentation.txt` surfaces the fidelity tier and validator result and does not present a limited-fidelity result as complete (T003).]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] The router lives at `.opencode/commands/create/diff.md`; its three assets under `.opencode/commands/create/assets/`; the Codex stub under `.codex/prompts/`. [EVIDENCE: router at `.opencode/commands/create/diff.md`; the three assets under `.opencode/commands/create/assets/`; the Codex stub at `.codex/prompts/create-diff.md` (T002/T003/T004/T005/T007).]
- [x] CHK-061 [P1] Child holds the Level 2 document set; parent stays a lean phase parent. [EVIDENCE: `009-create-diff-command/` holds `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` (5/5) plus `description.json`/`graph-metadata.json`; the 999 parent keeps only the lean `spec.md`/`description.json`/`graph-metadata.json` trio.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | State | Evidence |
|------|-------|----------|
| Command routing (REQ-001) | VERIFIED (structural) | MODE ROUTING maps `:auto` → `create_diff_auto.yaml`, `:confirm`/omitted → `create_diff_confirm.yaml`, one YAML per token |
| Asset existence (REQ-002) | VERIFIED (structural) | all three referenced owned-asset paths resolve on disk |
| Engine-never-bypassed (REQ-003) | VERIFIED (structural) | YAMLs drive `create_diff.py` (`compare`/`compare-pair`) + `validate_report.py`; no diffing re-implemented; compare read-only |
| Tool-surface subset (REQ-004) | VERIFIED (structural) | `allowed-tools` = `Read, Write, Edit, Bash, Glob, Grep`, no `Task`; flags real against `build_parser` |
| Registry command wired (REQ-005) | VERIFIED (structural) | `mode-registry.json` `command` = `"/create:diff"`; valid JSON; `parent-skill-check.cjs` "0 warnings" (12 modes) |
| Codex stub generated (REQ-006) | VERIFIED (structural) | `sync-prompts.cjs` wrote 1 of 38; `--check` → "PASS: 38 prompts are in sync"; 12-line stub, no hand-edit |
| Presentation surface (REQ-007) | VERIFIED (structural) | `create_diff_presentation.txt` (183 lines): Phase 0 + 4 startup questions + dashboards + completion display |
| Full sibling pattern (REQ-008) | VERIFIED (structural) | router (54 lines) + presentation (183) + auto.yaml (566) + confirm.yaml (629) present |
| Recursive strict validation | VERIFIED | `validate.sh --recursive --strict` on 999 → Errors 0 for every folder incl. 009 (0/0); only warning is a pre-existing continuity-freshness lag in untouched sibling 001-research |
| Live end-to-end invocation (CHK-027) | DEFERRED | Not exercised — user-runtime acceptance step not reproducible from this authoring environment; see Known Limitations |

**Verification Date**: 2026-07-15 (structural verification; live end-to-end invocation deferred — see CHK-027)
<!-- /ANCHOR:summary -->
