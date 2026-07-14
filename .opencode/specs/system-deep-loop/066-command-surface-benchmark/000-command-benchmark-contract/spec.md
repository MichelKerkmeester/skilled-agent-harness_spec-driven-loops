---
title: "Feature Specification: command-benchmark contract — freeze census, topology taxonomy, two-axis verdict semantics, and ownership boundaries"
description: "First child of the command-surface benchmark. Freezes the canonical command census (37 sources / 37 Codex mirrors), the four-topology taxonomy, the two non-averaged verdict axes, per-phase baseline counts, ownership boundaries between this benchmark and existing validators, and the handoff gates every downstream phase builds against."
status: planned
trigger_phrases:
  - "command benchmark contract"
  - "command census freeze"
  - "command topology taxonomy"
  - "two-axis verdict semantics"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract"
    last_updated_at: "2026-07-14T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the contract child from the reconciled three-model benchmark design"
    next_safe_action: "Freeze the census and topology taxonomy against the live command tree"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Two non-averaged verdict axes: deterministic P0/P1/P2 plus behavioral D1-D5 terminal buckets (design congregation, 2026-07-14)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command-benchmark contract — freeze census, topology taxonomy, two-axis verdict semantics, and ownership boundaries

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent** | system-deep-loop/066-command-surface-benchmark |

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Every downstream phase — fixtures, adapter, lane integration, behavior evaluator, scenarios, matrix, and
scorecard — needs a single frozen target to build against. Without a contract phase, the command census can
drift, command topologies can be classified inconsistently, and the two verdict axes can be conflated. This
phase freezes that contract: the canonical command set, the topology taxonomy, the verdict semantics, the
baseline counts, and the ownership boundary that keeps this benchmark from duplicating existing validators.

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Freeze the canonical command census using the `sync-prompts.cjs` source inventory (current verified baseline:
  37 sources / 37 mirrors).
- Define the four command topologies — workflow router, subaction router, direct-tool/plugin router, and
  monolithic command — with an assignment rule per command.
- Document the two non-averaged verdict axes and their severity/bucket vocabulary.
- Record per-phase baseline counts and the ownership boundary versus generic `validate_document.py --type command`.
- Define the handoff gate each phase must pass to unblock the next.

**Out of scope:**
- Any adapter code, fixtures, scenarios, or matrix runs (later phases).
- Changing command behavior or command docs.

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Freeze the canonical command census from `sync-prompts.cjs` exclusions and record the exact
  source/mirror counts, so every phase discovers the same set.
- **REQ-002 (P0):** Publish a topology taxonomy that assigns every command to exactly one of the four topologies,
  with a fail-closed rule for unclassified shapes.
- **REQ-003 (P1):** Document the two non-averaged verdict axes — deterministic P0/P1/P2 and behavioral D1–D5
  terminal buckets — and forbid averaging across them.
- **REQ-004 (P1):** Record the ownership boundary: this benchmark does not re-run or reclassify generic command
  document validation, which remains a separate `sk-doc` responsibility.
- **REQ-005 (P1):** Define per-phase handoff gates (evidence + exit code) that must pass before the next phase begins.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The census is frozen and reproduced by `sync-prompts.cjs --check` at exit 0 with the recorded counts.
- Every command in the census maps to exactly one topology; unclassified shapes fail closed.
- The verdict-axis contract and ownership boundary are documented and referenced by downstream phase specs.
- Handoff gates are enumerated and testable.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Census churn** — new or removed commands change counts; mitigated by regenerating the census from
  `sync-prompts.cjs` rather than hand-listing.
- **Topology drift** — new command shapes escape the taxonomy; mitigated by a fail-closed unclassified rule.
- **Dependencies:** `sync-prompts.cjs`, `validate-command-references.cjs`, and the deep-alignment authority registry.

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether any legacy monolithic command needs an explicit topology exception recorded in the taxonomy.
