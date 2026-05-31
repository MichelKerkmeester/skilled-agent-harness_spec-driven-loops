---
title: "Feature Specification: Wire worktree-guard into the Claude SessionStart hook chain"
description: "Add worktree-guard.sh as a second SessionStart hook step in .claude/settings.local.json so top-level Claude sessions landing on shared main are warned, completing the in-repo half of the 035 backstop wiring."
trigger_phrases:
  - "sessionstart worktree guard"
  - "worktree-guard hook wiring"
  - "035 backstop sessionstart"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/006-sessionstart-worktree-guard"
    last_updated_at: "2026-05-31T00:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "cli-opencode worker appended guard hook; verified valid JSON"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".claude/settings.local.json"
      - ".opencode/bin/worktree-guard.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003660"
      session_id: "036-006-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "worktree-guard.sh already exists (035, c657219dd9) but was never wired into a live hook chain; 006 wires it into the Claude SessionStart chain as a non-fatal second step after session-prime."
---
# Feature Specification: Wire worktree-guard into the Claude SessionStart hook chain

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
| **Predecessor** | system-spec-kit/035-worktree-per-session-automation |
| **Successor** | None |
| **Handoff Criteria** | `.claude/settings.local.json` SessionStart chain runs session-prime then worktree-guard.sh; JSON valid; guard is non-fatal (exits 0); change is additive (one new hook object). |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 035 created `worktree-guard.sh` — a detect-and-warn SessionStart guard that warns when a top-level session is running directly on the shared `main` checkout instead of an isolated worktree. `bin/README.md` documents that operators should "add `worktree-guard.sh` as a SessionStart hook step", but the guard was never actually wired into the live Claude hook chain (`.claude/settings.local.json`), so it never ran. The backstop existed but was dormant.

### Purpose
Wire `worktree-guard.sh` into the Claude `SessionStart` hook chain as a second, non-fatal step after `session-prime.js`, so the operator is warned on every top-level session that lands on shared `main`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append one command object to the `SessionStart[0].hooks` array in `.claude/settings.local.json` that runs `bash .opencode/bin/worktree-guard.sh` (timeout 3), keeping the existing `session-prime.js` step first.

### Out of Scope
- The other runtimes' hook configs (Gemini `SessionStart`, OpenCode `event` startup, Codex `hooks.json`) — Claude is the active runtime here; the guard is documented centrally and can be wired into the others when they are the active surface.
- The launch-alias path (`alias claude='...worktree-session.sh claude'`) — operator-machine, environment-specific (035 limitation #1). The guard is the no-alias backstop, not a replacement for the alias.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/settings.local.json` | Modify | Append worktree-guard.sh as a 2nd SessionStart hook step |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Guard wired into SessionStart | `SessionStart[0].hooks` has 2 entries: session-prime first, worktree-guard.sh second. |
| REQ-002 | Valid JSON | `node -e "require('./.claude/settings.local.json')"` parses without error. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Non-fatal, additive | The guard step uses the documented non-fatal script (exits 0); only the SessionStart inner hooks array changed — no other key touched. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new top-level Claude session on shared `main` emits the worktree-guard warning; an isolated-worktree or child session stays silent (the guard's own logic).
- **SC-002**: The change cannot break session startup — the guard always exits 0, and it runs after session-prime so priming is unaffected.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Malformed JSON breaks all hooks | Session startup hooks fail | Verified valid JSON after edit; change is a single additive object |
| Risk | Guard noise on every main session | Operator annoyance | The guard is silenceable via `SPECKIT_WORKTREE_GUARD=off` and only warns on main/master top-level sessions |
| Dependency | `.opencode/bin/worktree-guard.sh` | The script being wired | Present since 035 (c657219dd9); non-fatal by design |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Guard adds a sub-second git-dir check at session start (timeout 3s); negligible.

### Security
- **NFR-S01**: No new external input or credential surface; runs a checked-in repo script.

### Reliability
- **NFR-R01**: Guard is non-fatal (always exits 0); a guard failure cannot block a session.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Top-level session on main: guard warns. Correct.
- Inside a linked worktree (`git-dir != git-common-dir`): guard exits silently. Correct.
- Child session (`AI_SESSION_CHILD=1`): guard exits silently. Correct.
- `SPECKIT_WORKTREE_GUARD=off`: guard exits silently. Correct.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 2/25 | One additive JSON hook object |
| Risk | 4/25 | JSON-validity risk on a live hook file; mitigated by post-edit parse check |
| Research | 3/20 | Confirmed the existing SessionStart structure + the guard's non-fatal contract |
| **Total** | **9/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Other-runtime hook wiring is deliberately deferred (Claude is the active surface).

<!-- /ANCHOR:questions -->
