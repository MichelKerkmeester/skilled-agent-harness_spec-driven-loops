---
title: "Task Breakdown: Codex Dispatch Scope"
description: "Establish the runtime surface, scope each statement, verify none remain."
trigger_phrases:
  - "codex dispatch scope tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-codex-dispatch-scope-loosening"
    last_updated_at: "2026-08-30T11:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scoped the runtime-delegation rule to deep-loop fan-outs"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-cli-codex-058"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Codex Dispatch Scope

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Establish the runtime's accepted loop types from its own code. Evidence: it asserts an active loop type and the accepted values are `deep-research` and `deep-review`; a third value is a workspace marker, not a dispatch mode.
- [x] T-002 [P0] Confirm the mismatch is real. Evidence: the runtime requires specFolder, loopType, fanoutConfigJson and baseArtifactDir, so a document-repair dispatch cannot be expressed through it.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Scope the frontmatter hard rule to deep-loop fan-outs.
- [x] T-102 [P0] Rewrite Execution Ownership to state both paths and what still binds a direct dispatch.
- [x] T-103 [P0] Scope ALWAYS rule 2.
- [x] T-104 [P0] Rewrite NEVER rule 5 so the adapter prohibition is precise rather than broad.
- [x] T-105 [P1] Scope the success-criteria and integration-points restatements.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] No unscoped statement survives. Evidence: a search for "orchestrated execution" and "orchestrated dispatches" returns nothing.
- [x] T-202 [P0] The two loop types are still bound to the runtime in the rule text.
- [x] T-203 [P1] The adapter prohibition still reads as a prohibition.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- The rule requires the runtime for what it can run, and permits a direct
  dispatch for what it cannot, without licensing a second adapter.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 through REQ-003
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
