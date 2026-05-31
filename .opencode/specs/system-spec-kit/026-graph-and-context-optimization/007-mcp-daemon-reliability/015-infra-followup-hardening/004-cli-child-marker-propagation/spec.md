---
title: "Feature Specification: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills"
description: "Add the AI_SESSION_CHILD=1 worktree child-marker ALWAYS rule to cli-claude-code, cli-gemini, and cli-devin, completing the propagation begun in 036/003 (which covered cli-codex + cli-opencode)."
trigger_phrases:
  - "cli child marker propagation"
  - "AI_SESSION_CHILD claude gemini devin"
  - "remaining cli-* worktree rule"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/004-cli-child-marker-propagation"
    last_updated_at: "2026-05-30T23:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "cli-opencode worker added the rule to 3 skills; verified"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003640"
      session_id: "036-004-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "036/003 covered cli-codex + cli-opencode; 004 finishes the family (claude-code, gemini, devin). Mechanical edits dispatched via cli-opencode, governed + committed by the Opus main loop."
---
# Feature Specification: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed (2026-05-30) |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-spec-kit/036-infra-followup-hardening |
| **Predecessor** | system-spec-kit/036-infra-followup-hardening/003-worktree-child-marker-dispatch |
| **Successor** | None |
| **Handoff Criteria** | cli-claude-code + cli-gemini + cli-devin each carry an ALWAYS rule to set AI_SESSION_CHILD=1 on dispatch with the correct per-runtime invocation pattern, referencing the bin/README contract; comment-hygiene clean; one additive hunk per file. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
036/003 added the `AI_SESSION_CHILD=1` dispatch rule to cli-codex and cli-opencode but deferred the other three cli-* dispatchers (cli-claude-code, cli-gemini, cli-devin) as lower-traffic paths. With the worktree wrapper now the intended default isolation mechanism, every dispatcher that can spawn a child runtime should tell the caller to set the marker — otherwise an orchestrated `claude -p` / `gemini` / `devin` child launched under the wrapper would wrongly allocate its own nested worktree.

### Purpose
Finish propagating the child-marker dispatch rule across the whole cli-* family so the contract is uniform.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one ALWAYS rule to each of `cli-claude-code/SKILL.md`, `cli-gemini/SKILL.md`, `cli-devin/SKILL.md`: set `AI_SESSION_CHILD=1` in the dispatched child's env, with the runtime-specific invocation pattern, referencing `bin/README.md` → "Worktree session isolation".

### Out of Scope
- cli-codex / cli-opencode — already done in 036/003.
- The substrate harness wiring and the SessionStart guard — separate 036 children (005, 006).
- Operator-machine launch aliases — environment-specific (035 limitation #1).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | ALWAYS rule 11: set AI_SESSION_CHILD=1 on `claude -p` dispatch |
| `.opencode/skills/cli-gemini/SKILL.md` | Modify | ALWAYS rule 11: set AI_SESSION_CHILD=1 on `gemini` dispatch |
| `.opencode/skills/cli-devin/SKILL.md` | Modify | ALWAYS rule 16: set AI_SESSION_CHILD=1 on `devin` dispatch |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispatch-site rule in all three remaining cli-* skills | Each carries an ALWAYS rule to set AI_SESSION_CHILD=1, with the correct runtime invocation pattern (`claude -p` / `gemini` / `devin`). |
| REQ-002 | Cross-reference the contract | Each rule points to `.opencode/bin/README.md` → "Worktree session isolation". |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No hygiene/structure regression | Comment-hygiene clean; additive only; one hunk per file. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five cli-* dispatcher skills now carry the child-marker rule (codex+opencode from 003; claude-code+gemini+devin from 004).
- **SC-002**: Each rule uses its dispatcher's real invocation verb so the example is copy-pasteable.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A CLI worker edits beyond scope | Out-of-scope churn | Worker dispatched edits-only (no git); Opus main loop scope-guards every commit with explicit pathspecs |
| Risk | Wrong rule number / position | Malformed list | Verified each rule lands as the next number before the NEVER header, one additive hunk |
| Dependency | bin/README "Worktree session isolation" | Cross-ref target | Present since 035 (c657219dd9) |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime impact — doc-only skill change.

### Security
- **NFR-S01**: No new external input or credential surface.

### Reliability
- **NFR-R01**: The marker is advisory; the wrapper's structural backstop catches the common case if a dispatcher omits it.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Dispatcher sets the var, wrapper in use: child exec's in place. Correct.
- Dispatcher omits the var, child inside the parent's worktree: structural backstop still exec's in place. Correct.
- Wrapper not in use: the var is unread; no effect. Correct.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Three one-rule additions to skill docs |
| Risk | 3/25 | Doc-only, additive, hygiene-clean |
| Research | 3/20 | Confirmed each skill's ALWAYS-rule structure + bin/README contract |
| **Total** | **9/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The cli-* family is now uniformly covered.

<!-- /ANCHOR:questions -->
