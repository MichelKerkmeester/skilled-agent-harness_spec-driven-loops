---
title: "Feature Specification: Worktree child-marker dispatch documentation"
description: "Document that cli-* dispatchers must set AI_SESSION_CHILD=1 in the dispatched child's env so orchestrated sub-sessions share the parent's worktree instead of allocating their own (035 T006, in-repo doc portion)."
trigger_phrases:
  - "worktree child-marker dispatch docs"
  - "AI_SESSION_CHILD cli dispatch"
  - "035 T006 in-repo doc"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch"
    last_updated_at: "2026-05-30T23:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added AI_SESSION_CHILD dispatch rule to cli-codex + cli-opencode"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003620"
      session_id: "036-003-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "bin/README already documents the worktree child contract (committed c657219dd9); 003 adds the actionable dispatch-site rule to the two cli-* skills that actually spawn children."
---
# Feature Specification: Worktree child-marker dispatch documentation

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
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening |
| **Predecessor** | system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/005-worktree-per-session-automation (T006) |
| **Successor** | None |
| **Handoff Criteria** | cli-codex + cli-opencode carry an ALWAYS rule to set AI_SESSION_CHILD=1 on dispatch, referencing the bin/README contract; comment-hygiene clean; strict-validate exit 0. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 035 built `worktree-session.sh`, which isolates each top-level AI session in its own git worktree but exec's in place for orchestrated children. A child is detected by `AI_SESSION_CHILD=1` (or the structural `git --git-common-dir` backstop). 035 T006's in-repo documentation portion — telling the cli-* dispatchers to actually SET that env var when they spawn a child — was never written. `bin/README.md` documents the contract from the wrapper's side, but the dispatch recipes (cli-codex, cli-opencode) had no instruction to set the marker, so an orchestrated `codex exec` / `opencode run` launched under the wrapper would wrongly allocate its own nested worktree.

### Purpose
Add an ALWAYS rule to the two cli-* skills that spawn child sessions, so dispatchers set `AI_SESSION_CHILD=1` and orchestrated children share the parent's worktree.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one ALWAYS rule to `cli-codex/SKILL.md` and one to `cli-opencode/SKILL.md`: set `AI_SESSION_CHILD=1` in the dispatched child's env, with the runtime-specific invocation pattern, referencing `bin/README.md` → "Worktree session isolation".

### Out of Scope
- The operator-machine wiring (launch aliases, SessionStart guard-hook entries) — environment-specific, remains the operator's (035 limitation #1).
- cli-claude-code / cli-gemini / cli-devin — those dispatch paths are lower-traffic for this repo's worktree flow; the contract is documented centrally in bin/README and can be added to them if/when they become primary dispatchers. (Noted, not silently dropped.)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-codex/SKILL.md` | Modify | ALWAYS rule 13: set AI_SESSION_CHILD=1 on `codex exec` dispatch |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | ALWAYS rule 15: set AI_SESSION_CHILD=1 on `opencode run` dispatch |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispatch-site rule in both primary cli-* skills | cli-codex + cli-opencode each carry an ALWAYS rule to set AI_SESSION_CHILD=1, with the correct runtime invocation pattern (`AI_SESSION_CHILD=1 codex exec ...` / `AI_SESSION_CHILD=1 opencode run ...`). |
| REQ-002 | Cross-reference the contract | Each rule points to `.opencode/bin/README.md` → "Worktree session isolation" so the why/mechanism is not duplicated. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No hygiene/structure regression | Comment-hygiene clean; the rule is additive (no other skill content changed); diff is one hunk per file. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dispatcher reading cli-codex or cli-opencode sees an explicit instruction to set `AI_SESSION_CHILD=1`, closing the 035 T006 in-repo doc gap.
- **SC-002**: The instruction is harmless when the wrapper is not in use (the env var is simply unread), so it imposes no cost on non-worktree workflows.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dispatchers ignore the rule | Child nests its own worktree | The structural `git --git-common-dir` backstop in worktree-session.sh catches the common case (child already inside the parent's tree) even without the env var |
| Risk | Doc-only; no enforcement | Drift | The wrapper's behavior is the enforcement; this doc just makes the dispatcher's part explicit |
| Dependency | bin/README "Worktree session isolation" section | Cross-ref target | Already committed in 035 (c657219dd9); verified present |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime impact — doc-only skill change.

### Security
- **NFR-S01**: No new external input or credential surface.

### Reliability
- **NFR-R01**: The marker is advisory; the structural backstop provides defense-in-depth if a dispatcher omits it.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Dispatcher sets the var, wrapper in use: child exec's in place (shares parent worktree). Correct.
- Dispatcher omits the var, child runs inside the parent's worktree: structural backstop still exec's in place. Correct.
- Wrapper not in use at all: the var is unread; no effect. Correct.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Two one-rule additions to skill docs |
| Risk | 3/25 | Doc-only, additive, hygiene-clean |
| Research | 4/20 | Confirmed bin/README contract + the two skills' ALWAYS-rule structure |
| **Total** | **10/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. cli-claude-code/cli-gemini/cli-devin are deliberately out of scope (lower-traffic dispatch paths; the central contract lives in bin/README and can be propagated later).

<!-- /ANCHOR:questions -->
