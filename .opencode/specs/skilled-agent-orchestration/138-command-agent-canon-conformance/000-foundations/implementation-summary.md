---
title: "Implementation Summary: foundations — deep-alignment lane-config + live sk-doc adapter confirmation"
description: "Audit foundation for packet 138: immutable BASE + census pinned, deep-alignment lane-config authored and resolved (2 lanes, exit 0), and the sk-doc adapter confirmed live via 20 real validate_document.py-keyed findings in the delta stream. Reducer-gap deviation documented."
trigger_phrases:
  - "deep-alignment lane config summary"
  - "canon conformance foundations implementation"
  - "sk-doc adapter live confirmation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/000-foundations"
    last_updated_at: "2026-07-14T18:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 000 foundations audit-evidence writeup"
    next_safe_action: "Orchestrator runs strict validate then rolls up the parent"
    blockers: []
    key_files:
      - "000-foundations/lane-config.json"
      - "000-foundations/alignment/deltas/iter-001.jsonl"
      - "000-foundations/alignment/alignment-report.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 000-foundations |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Completed** | 2026-07-14 |
| **Level** | 2 |
| **Executor (frozen)** | `openai/gpt-5.6-luna-fast --variant xhigh` |
| **Immutable BASE** | `9c1c523165` (pre-138 merge commit) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase established the audit foundation for the whole 138 canon-conformance program: the immutable BASE + census, the deep-alignment `--lane-config`, and live proof the sk-doc adapter returns real findings (not blanket `could-not-validate`).

### Immutable BASE + census
- **BASE**: the pre-138-work merge commit `9c1c523165`, pinned so every downstream phase diff has a stable anchor.
- **Census**: 37 OpenCode command docs; 13 agents × 2 markdown runtimes (`.opencode/agents/` + `.claude/agents/` = 26 `.md`) plus 13 `.codex/agents/*.toml`; Codex command prompts 0 → 37 (the 37 codex prompt files are built later, in phase 003).

### Deep-alignment lane-config
`lane-config.json` declares exactly two sk-doc/docs lanes:
- **Lane 1 (command-docs)**: globs `.opencode/commands/{create,design,doctor,memory,speckit}/*.md` + `prompt-improve.md` + `goal_opencode.md`.
- **Lane 2 (agent-docs)**: globs `.opencode/agents/*.md` + `.claude/agents/*.md`.

It resolves via the deep-alignment `scoping.cjs --lane-config` with exit 0 and exactly 2 lanes (REQ-001).

### Live sk-doc adapter confirmation
The live deep-alignment sk-doc run (executor `openai/gpt-5.6-luna-fast --variant xhigh`) produced 20 REAL findings in `alignment/deltas/iter-001.jsonl` — 20 P1 `missing_recommended_router_section` findings (router_contract / mode_routing / execution_targets / workflow_summary across the command docs), each carrying `sourceTool: validate_document.py` and `validatorExitCode: 0`. This disproves the blanket-`could-not-validate` failure mode and confirms the adapter is functional and keys severities off genuine `validate_document.py --type command` results (REQ-002).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audit-foundation-first, in three moves: (1) pin the BASE commit and record the census; (2) author `lane-config.json` and prove it resolves via `scoping.cjs`; (3) run the live deep-alignment sk-doc audit and inspect the raw delta stream for real `validate_document.py`-keyed findings. The phase edits no command or agent files — it is read-only/audit-only and behavior-preserving. Downstream phases 001-003 consume the confirmed lane output as their verifier contracts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate downstream phases on a REAL finding, not just a completed run | The adapter previously emitted blanket `could-not-validate` P1s when the `template_rules.json` path broke; a real validator-keyed finding is the only proof the audit input is trustworthy. |
| Accept the RAW delta stream as REQ-002 evidence | The reducer never consumed the deltas (see Known Limitations), so the delta stream — not the reduced report — is the authoritative source for the 20 findings. |
| Pin an immutable BASE commit | Every downstream diff and re-audit needs a stable reference; `9c1c523165` freezes the pre-138 state. |
| Keep the phase audit-only | Fixing findings is phases 001-003; conflating audit and fix would break the behavior-preserving contract. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lane-config resolution (REQ-001) | CONFIRMED: `scoping.cjs --lane-config` exit 0, exactly 2 sk-doc/docs lanes resolved. |
| Lane-config schema/shape | CONFIRMED: `lane-config.json` holds 2 objects, each `authority: sk-doc` / `artifactClass: docs` / `scope.type: globs`. |
| Live adapter real finding (REQ-002) | CONFIRMED: `alignment/deltas/iter-001.jsonl` = 21 rows (1 iteration row `findingsCount: 20` + 20 finding rows); every finding `sourceTool: validate_document.py`, `validatorExitCode: 0`, typed `missing_recommended_router_section`. |
| Not blanket `could-not-validate` | CONFIRMED: findings are validator-keyed template-conformance results, not adapter errors. |
| Run artifacts persisted (REQ-004) | CONFIRMED: `alignment/deep-alignment-state.jsonl`, `alignment/deltas/iter-001.jsonl`, `alignment/deep-alignment-config.json`, `alignment/deep-alignment-corpus.json`, `alignment/prompts/`, `alignment/iterations/` all present. |
| BASE + census recorded (REQ-003) | CONFIRMED: BASE `9c1c523165` and census recorded above. |
| Executor frozen (REQ-005) | CONFIRMED: `openai/gpt-5.6-luna-fast --variant xhigh` recorded in metadata and delta-stream config. |
| Loop convergence / reduced report | NOT ACHIEVED: `alignment/alignment-report.md` shows `NOT_APPLICABLE` / 0 iterations / 0 findings — reducer never consumed the deltas (see Known Limitations). |
| Re-audit-clean proof (downstream) | INFERRED for this phase / CONFIRMED downstream: because phase 001 resolved all 20 findings, a fresh re-audit would find 0; the deterministic `validate_document.py` sweep (all command files exit 0, 0/0) is the stronger re-audit-clean proof used by phases 001-003. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deep-alignment reducer gap (documented deviation).** The deep-alignment loop's LEAF iteration executed and produced the 20 findings (proving the sk-doc adapter works), BUT the loop did NOT complete its convergence/reduce step: the reduced views (`alignment/alignment-report.md`, `alignment/deep-alignment-findings-registry.json`) show `NOT_APPLICABLE` / 0 iterations / 0 findings — the reducer never consumed the iter-001 deltas. This reducer gap is a known headless deep-alignment-loop limitation and a candidate follow-up for `system-deep-loop/059-deep-alignment-mode/015-headless-model-matrix-hardening` (Phase B/C). REQ-002 is therefore satisfied by the RAW delta-stream evidence, NOT by the reduced report. Because the downstream conformance (phase 001) has since resolved all 20 findings, a fresh re-audit would now find 0 — so the pre-remediation delta stream is the historical REQ-002 evidence, and the deterministic `validate_document.py` sweep (all command files exit 0, 0/0) is the stronger re-audit-clean proof used by phases 001-003.
   - **CONFIRMED** (evidence): `alignment/deltas/iter-001.jsonl` has 20 finding rows; `alignment/alignment-report.md` shows `NOT_APPLICABLE`.
   - **NOT achieved** (honest): the loop-completion claim.
2. **Status stays "In progress."** This child's own gates (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005) are all MET; the parent packet 138 remains in progress until phases 001-004 integrate, so the child `spec.md` Status field is left "In progress" by design rather than flipped to Complete.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:rollback -->
## Rollback

This phase is audit-only — no command, agent, or executor behavior was changed, so there is nothing runtime to reverse. To roll back the foundation itself: revert `lane-config.json` (or delete if net-new) and delete the regenerated `alignment/**` loop state from git, then re-author the config and re-run `scoping.cjs` + the deep-alignment audit. The immutable BASE `9c1c523165` remains the reference for any re-run.
<!-- /ANCHOR:rollback -->
