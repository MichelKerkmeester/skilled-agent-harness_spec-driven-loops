---
title: "Tasks: deep-review :auto non-interactive setup bypass"
description: "Task list for fixing /deep:start-review-loop:auto setup-phase stdin hang."
trigger_phrases:
  - "deep-review setup hang"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/018-deep-review-three-tier-setup"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "codex-inline"
    recent_action: "Completed command-contract implementation and dry-run verification"
    next_safe_action: "Review evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-001-deep-review-three-tier-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: deep-review :auto non-interactive setup bypass

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `.opencode/commands/deep/start-review-loop.md` §0 UNIFIED SETUP PHASE; map every Q0..Q-Exec input to its source (flag, default, ask). Evidence: ordered read completed before edits.
- [x] T002 Read `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` setup steps; note which fields it reads from `deep-review-config.json`. Evidence: YAML setup inputs and config creation were read; no YAML edit needed.
- [x] T003 Decide pre-binding marker block name and field syntax. Evidence: documented `PRE-BOUND SETUP ANSWERS:` YAML-style key/value block.
- [x] T004 Pick a small test target spec folder for verification dispatches (Level 1 or 2; cheap to deep-review). Evidence: runtime override replaced live dispatch with required dry-run traces using the provided hypothetical targets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add non-interactive branch to deep-review.md §0 — when AUTONOMOUS + resolvable, skip question block. Evidence: `### Three-Tier Setup Resolution for :auto` now documents Tier 1 persistence and YAML load without Q0..Q-Exec.
- [x] T011 Document the pre-binding marker schema in deep-review.md (new subsection under §0). Evidence: `### PRE-BOUND SETUP ANSWERS Schema (for :auto non-interactive dispatch)` added.
- [x] T012 Add fail-fast error emitter for AUTONOMOUS + unresolved case. Evidence: Tier 3 exact error format is documented with named missing inputs and non-zero exit.
- [x] T013 Document per-field default-resolution rules and confirm YAML compatibility. Evidence: `### Default Resolution Table` added; YAML read showed no consumer-side adjustment required.
- [x] T014 Update command argument-hint comment to reference the new bypass path. Evidence: frontmatter `argument-hint` and execution protocol now mention the `:auto` three-tier contract and marker block.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Runtime override for this execution: do not run the full `/deep:start-review-loop:auto` YAML loop. Verification is dry-run setup-phase resolution only.

- [x] V1 Read-back check of `.opencode/commands/deep/start-review-loop.md` §0. Evidence: confirmed three-tier branch, marker schema, default table, Tier 3 error, and unchanged `:confirm` path.
- [x] V2 Mental dispatch traces. Evidence: `evidence/dry-run-verification.txt` contains Trace A, Trace B, Trace C, and Trace D with verdicts.
- [x] V3 Populate `implementation-summary.md`. Evidence: summary now includes metadata, build notes, delivery approach, key decisions, verification, and limitations.
- [x] V4 Update `tasks.md` for T010-T014 and V1-V3. Evidence: this file marks those items complete with evidence.
- [x] V5 Update `checklist.md` with evidence text. Evidence: checklist records dry-run evidence and runtime-approved deferrals for live dispatch checks.
- [x] T020 Author verification scenario (file + non-interactive Setup block). Evidence: dry-run scenario written to `evidence/dry-run-verification.txt`.
- [x] T021 Dispatch verification scenario via `codex exec` — must load YAML + run iteration loop without setup question. Evidence: not run by runtime instruction; replaced by V2 Trace A dry-run setup verification.
- [x] T022 Dispatch verification scenario via `opencode run --pure` — same. Evidence: not run by runtime instruction; replaced by V2 Trace A dry-run setup verification.
- [x] T023 Dispatch `/deep:start-review-loop:auto ""` (empty args) via `codex exec </dev/null` — must exit non-zero within 10s with named-missing-inputs error. Evidence: not run by runtime instruction; replaced by V2 Trace C dry-run fail-fast verification.
- [x] T024 Manual `:confirm` dispatch — must still emit the question block (regression check). Evidence: not run by runtime instruction; replaced by V2 Trace D read-back verification.
- [x] T025 Run `validate.sh --strict` against this folder; exit 0. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/001-deep-review-three-tier-setup --strict` passed with Errors: 0, Warnings: 0.
- [x] T026 Populate `implementation-summary.md` with audit notes, design decisions, dispatch evidence pointers. Evidence: completed in `implementation-summary.md`.
- [x] T027 Update `_memory.continuity` blocks to `completion_pct: 100`. Evidence: `tasks.md` and `implementation-summary.md` frontmatter updated to `completion_pct: 100`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 4 dry-run verification traces produced expected outcomes
- [x] Strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Origin**: F-Stage-E-001 — `.opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/implementation-summary.md` §Known Limitations
- **Related memory**: `feedback_codex_spawnagent_allowlist.md` (different bug, similar inline-contract pattern), `feedback_gate3_no_tmp_exemption.md` (related Gate 3 gotcha that this fix may also need to handle in the bypass branch)
<!-- /ANCHOR:cross-refs -->
