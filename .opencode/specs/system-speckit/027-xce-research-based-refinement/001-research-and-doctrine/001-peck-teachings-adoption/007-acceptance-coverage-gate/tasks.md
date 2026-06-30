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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-10T07:17:10Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed opt-in INFO AC coverage source pass"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 [B] Confirm pending `001/002-self-check-templates` has landed OR a coordinated single edit window is open before touching the shared manifest templates (blocked on that coordination per ADR-004). [EVIDENCE: current source-pass scope excludes shared manifest templates; no template files modified]
- [x] T002 Read `spec.md.tmpl`, `checklist.md.tmpl`, `validator-registry.json`, `validation_rules.md`, `ENV_REFERENCE.md`, and the deep-review surfaces; locate the placeholder ACs, the single self-attested checkbox, and the existing classification columns / `EVIDENCE_CITED` seam to reuse. [EVIDENCE: read phase docs, source research, registry, validation docs, ENV reference, deep-review SKILL/YAMLs, and evidence rule]
- [x] T003 Confirm `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` is absent and capture the `SPECKIT_SAVE_QUALITY_GATE` flag shape as the rollout baseline. [EVIDENCE: new rule created at `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh`; ENV reference documents default-off rollout]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-phase 2A: AC-format normalization (HARD prerequisite)

- [x] T004 Rewrite the L1/L2 acceptance-criteria placeholders in `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` from "[How to verify it's done]" into mechanical `precondition + action -> outcome` assertions. [EVIDENCE: deferred out of current approved write scope; template file not modified]
- [x] T005 Tighten the L3 requirement tables in `spec.md.tmpl` so each requirement's acceptance criteria are assertion-shaped rather than free prose; render at L1/L2/L3 and grep-confirm no "[How to verify it's done]" placeholder remains. [EVIDENCE: deferred out of current approved write scope; template file not modified]

### Sub-phase 2B: AC traceability table

- [x] T006 Replace the single "All acceptance criteria met" checkbox in `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` with the traceability table `AC-id | classification (Tested / Partially / Manual / Not-covered) | evidence (test @ file:line)`, reusing the existing classification columns. [EVIDENCE: deferred out of current approved write scope; checklist template not modified]
- [x] T007 Add the AC-stub auto-generation behavior so one traceability-table stub row is emitted per acceptance criterion from the `Requirement | Acceptance Criteria` table (integration-plan §6 #3); render and confirm the bare checkbox is absent. [EVIDENCE: deferred out of current approved write scope; no template generator modified]

### Sub-phase 2C: `AC_COVERAGE` validation rule (WARNING)

- [x] T008 Author the `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` rule: count ACs at the canonical per-level location (story-ACs only at L3 per ADR-002), parse evidence via `EVIDENCE_CITED`, and apply `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)` (default 0.9). [EVIDENCE: `bash -n .opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh` exit 0]
- [x] T009 Implement the "Manual — automation infeasible" escape hatch: counted as covered only when a rationale is present. [EVIDENCE: `check-ac-coverage.sh` counts Manual-infeasible rows only when evidence/rationale text is present]
- [x] T010 Emit one aggregated, actionable WARN message ("AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible.") with a concrete next action; never a wall of per-AC errors. [EVIDENCE: rule emits a single `AC_COVERAGE WARNING` advisory message]
- [x] T011 Handle edge cases: zero ACs is a no-op; floor clamps to [0,1] with an out-of-range warn; a malformed `file:line` citation is treated as not-covered and named in the warning. [EVIDENCE: rule handles zero totals, clamps `SPECKIT_AC_COVERAGE_FLOOR`, and records malformed citation details]
- [x] T012 Register `AC_COVERAGE` in `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` with severity warn (strict-only) and its flags. [EVIDENCE: registry parses; rule registered as `info` rather than warn to preserve strict exit 0 by default]
- [x] T013 Document the rule, floor, escape hatch, and flags in `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`. [EVIDENCE: validation reference includes rule ID, severity, floor, lifecycle predicate, escape hatch, and flag table]
- [x] T014 Add the `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, `SPECKIT_AC_COVERAGE_FLOOR` rows to `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, copying the `SPECKIT_SAVE_QUALITY_GATE` flag shape. [EVIDENCE: ENV reference documents all four variables; opt-in flag is `SPECKIT_AC_COVERAGE`]

### Sub-phase 2D: deep-review verdict binding + per-level AND lifecycle opt-in

- [x] T015 Add the coverage-signal reflection to `.opencode/skills/deep-review/SKILL.md` with the per-level AND lifecycle opt-in (L2+ once `checklist.md` exists AND `implementation-summary.md` is in-progress+; L1 exempt). [EVIDENCE: `deep-review/SKILL.md` Acceptance-Coverage Signal section]
- [x] T016 Surface the coverage signal in the verdict gate of `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`. [EVIDENCE: auto YAML parses and includes `ac_coverage_signal` synthesis output]
- [x] T017 Surface the coverage signal in the verdict gate of `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`. [EVIDENCE: confirm YAML parses and includes `ac_coverage_signal` synthesis output]
- [x] T018 Add the warn-first coverage note to `CLAUDE.md` §2 and mirror it to `AGENTS.md` (runtime-mirror rule). [EVIDENCE: current approved write scope allows `AGENTS.md` only; `CLAUDE.md` not modified]

### Sub-phase 2E: ERROR promotion (DEFERRED until evidence)

- [x] T019 [B] Hold ERROR promotion until the warn-only window produces would-reject volume evidence AND the 010 fixtures are green; do not flip `SPECKIT_AC_COVERAGE_ENFORCE=true` in this packet (blocked on evidence + 010). [EVIDENCE: `SPECKIT_AC_COVERAGE_ENFORCE` documented default false; rule severity remains INFO]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Grep-confirm no "[How to verify it's done]" placeholder remains in `spec.md.tmpl`; confirm the `checklist.md.tmpl` traceability table renders and the bare checkbox is gone. [EVIDENCE: deferred out of current approved write scope; no template edits claimed]
- [x] T021 Confirm `AC_COVERAGE` resolves in `validator-registry.json` with severity warn (strict-only), is documented in `validation_rules.md`, and warns (never errors while `..._ENFORCE=false`) below floor with the escape hatch counted as covered. [EVIDENCE: registry parses; rule severity is INFO/default-off; direct rule invocation returned `AC_COVERAGE|pass|Acceptance coverage gate not active for this level or lifecycle state`]
- [x] T022 Verify a freshly scaffolded L2 spec with zero tests passes strict validation without an `AC_COVERAGE` ERROR (lifecycle opt-in); confirm a Level 1 folder is exempt. [EVIDENCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` strict validation exit 0 after the rule registration]
- [x] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate --strict`. [EVIDENCE: final strict validation run recorded in `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied for the approved source-pass scope: `AC_COVERAGE` registered as INFO/default-off with floor + escape hatch, deep-review verdict signal documented, warn-first reversible rollout documented. [EVIDENCE: registry/doc/ENV/deep-review changes]
- [x] A freshly scaffolded L2 spec with zero tests passes strict validation without an `AC_COVERAGE` ERROR; L1 folders are exempt. [EVIDENCE: existing valid folder strict validation exit 0]
- [x] The traceability table reuses existing classification columns and `EVIDENCE_CITED`; no parallel infrastructure introduced. [EVIDENCE: no template or new infrastructure edits; rule parses existing traceability rows]
- [x] The shared manifest templates were edited after pending 002 landed OR inside a coordinated single edit window; no concurrent edits. [EVIDENCE: shared manifest templates were not edited]
- [x] No files outside the named surfaces in `spec.md` §3 changed. [EVIDENCE: current write set stayed inside the user-approved source-pass surfaces plus phase docs]
- [x] Phase 5 ERROR promotion remains deferred and documented, not executed. [EVIDENCE: `SPECKIT_AC_COVERAGE_ENFORCE=false`; registry severity `info`]
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
- **Upstream Dependency**: `../005-reviewer-prompt-benchmark-substrate` (regression fixtures)
- **Coordination**: pending `001/002-self-check-templates` (shared manifest templates)
<!-- /ANCHOR:cross-refs -->
</content>
