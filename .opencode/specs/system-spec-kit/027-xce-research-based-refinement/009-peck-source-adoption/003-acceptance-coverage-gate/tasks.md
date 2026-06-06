---
title: "Tasks: 011 — Acceptance-Criteria Coverage Gate"
description: "Task list for the revived T1 acceptance-criteria coverage gate: normalize AC format in spec.md.tmpl, add the AC traceability table to checklist.md.tmpl, author and register the warn-first AC_COVERAGE rule, and bind the deep-review verdict with per-level AND lifecycle opt-in."
trigger_phrases:
  - "027 phase 011"
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "AC traceability table"
  - "AC-format normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/003-acceptance-coverage-gate"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 011 tasks from research 006 sub-packet-proposal P011 + integration-plan"
    next_safe_action: "Land pending 002 templates, then start T001 AC-format normalization"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 011 — Acceptance-Criteria Coverage Gate

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 [B] Confirm pending `001/002-self-check-templates` has landed OR a coordinated single edit window is open before touching the shared manifest templates (blocked on that coordination per ADR-004).
- [ ] T002 Read `spec.md.tmpl`, `checklist.md.tmpl`, `validator-registry.json`, `validation_rules.md`, `ENV_REFERENCE.md`, and the deep-review surfaces; locate the placeholder ACs, the single self-attested checkbox, and the existing classification columns / `EVIDENCE_CITED` seam to reuse.
- [ ] T003 Confirm `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` is absent and capture the `SPECKIT_SAVE_QUALITY_GATE` flag shape as the rollout baseline.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-phase 2A: AC-format normalization (HARD prerequisite)

- [ ] T004 Rewrite the L1/L2 acceptance-criteria placeholders in `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` from "[How to verify it's done]" into mechanical `precondition + action -> outcome` assertions.
- [ ] T005 Tighten the L3 requirement tables in `spec.md.tmpl` so each requirement's acceptance criteria are assertion-shaped rather than free prose; render at L1/L2/L3 and grep-confirm no "[How to verify it's done]" placeholder remains.

### Sub-phase 2B: AC traceability table

- [ ] T006 Replace the single "All acceptance criteria met" checkbox in `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` with the traceability table `AC-id | classification (Tested / Partially / Manual / Not-covered) | evidence (test @ file:line)`, reusing the existing classification columns.
- [ ] T007 Add the AC-stub auto-generation behavior so one traceability-table stub row is emitted per acceptance criterion from the `Requirement | Acceptance Criteria` table (integration-plan §6 #3); render and confirm the bare checkbox is absent.

### Sub-phase 2C: `AC_COVERAGE` validation rule (WARNING)

- [ ] T008 Author the `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` rule: count ACs at the canonical per-level location (story-ACs only at L3 per ADR-002), parse evidence via `EVIDENCE_CITED`, and apply `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)` (default 0.9).
- [ ] T009 Implement the "Manual — automation infeasible" escape hatch: counted as covered only when a rationale is present.
- [ ] T010 Emit one aggregated, actionable WARN message ("AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible.") with a concrete next action; never a wall of per-AC errors.
- [ ] T011 Handle edge cases: zero ACs is a no-op; floor clamps to [0,1] with an out-of-range warn; a malformed `file:line` citation is treated as not-covered and named in the warning.
- [ ] T012 Register `AC_COVERAGE` in `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` with severity warn (strict-only) and its flags.
- [ ] T013 Document the rule, floor, escape hatch, and flags in `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`.
- [ ] T014 Add the `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, `SPECKIT_AC_COVERAGE_FLOOR` rows to `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, copying the `SPECKIT_SAVE_QUALITY_GATE` flag shape.

### Sub-phase 2D: deep-review verdict binding + per-level AND lifecycle opt-in

- [ ] T015 Add the coverage-signal reflection to `.opencode/skills/deep-review/SKILL.md` with the per-level AND lifecycle opt-in (L2+ once `checklist.md` exists AND `implementation-summary.md` is in-progress+; L1 exempt).
- [ ] T016 Surface the coverage signal in the verdict gate of `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`.
- [ ] T017 Surface the coverage signal in the verdict gate of `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`.
- [ ] T018 Add the warn-first coverage note to `CLAUDE.md` §2 and mirror it to `AGENTS.md` (runtime-mirror rule).

### Sub-phase 2E: ERROR promotion (DEFERRED until evidence)

- [ ] T019 [B] Hold ERROR promotion until the warn-only window produces would-reject volume evidence AND the 010 fixtures are green; do not flip `SPECKIT_AC_COVERAGE_ENFORCE=true` in this packet (blocked on evidence + 010).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Grep-confirm no "[How to verify it's done]" placeholder remains in `spec.md.tmpl`; confirm the `checklist.md.tmpl` traceability table renders and the bare checkbox is gone.
- [ ] T021 Confirm `AC_COVERAGE` resolves in `validator-registry.json` with severity warn (strict-only), is documented in `validation_rules.md`, and warns (never errors while `..._ENFORCE=false`) below floor with the escape hatch counted as covered.
- [ ] T022 Verify a freshly scaffolded L2 spec with zero tests passes strict validation without an `AC_COVERAGE` ERROR (lifecycle opt-in); confirm a Level 1 folder is exempt.
- [ ] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/003-acceptance-coverage-gate --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied (AC-format normalized, traceability table present, `AC_COVERAGE` registered as WARNING with floor + escape hatch, deep-review verdict bound, warn-first reversible rollout).
- [ ] A freshly scaffolded L2 spec with zero tests passes strict validation without an `AC_COVERAGE` ERROR; L1 folders are exempt.
- [ ] The traceability table reuses existing classification columns and `EVIDENCE_CITED`; no parallel infrastructure introduced.
- [ ] The shared manifest templates were edited after pending 002 landed OR inside a coordinated single edit window; no concurrent edits.
- [ ] No files outside the named surfaces in `spec.md` §3 changed.
- [ ] Phase 5 ERROR promotion remains deferred and documented, not executed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Source Proposal**: `../../research/006-peck-source-deep-mining/sub-packet-proposal.md` (§3 Packet 011, §7)
- **Integration Synthesis**: `../../research/006-peck-source-deep-mining/integration-plan.md`
- **Verdict Evidence**: `../../research/006-peck-source-deep-mining/research.md` (§2 T1, §5 cross-model)
- **Upstream Dependency**: `../001-reviewer-prompt-benchmark-substrate` (regression fixtures)
- **Coordination**: pending `001/002-self-check-templates` (shared manifest templates)
<!-- /ANCHOR:cross-refs -->
</content>
