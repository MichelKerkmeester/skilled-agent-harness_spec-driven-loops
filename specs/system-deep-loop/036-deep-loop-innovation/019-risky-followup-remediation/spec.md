---
title: "Feature Specification: Risky Pre-Existing Failure Remediation (phase parent)"
description: "Phase parent for properly remediating the two risky pre-existing runtime test failures that packet 018 deliberately deferred: the cross-skill better-sqlite3 version drift under an unstable Node ABI, and the command rollout-mode regression that recompiling the deep/* contracts introduces. Each is a distinct workstream with its own decision point, tracked as a phase child."
trigger_phrases:
  - "risky followup remediation"
  - "better-sqlite3 version drift node abi"
  - "command rollout mode resolution"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation"
    last_updated_at: "2026-08-26T12:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Both children complete: 002 rollout mode restored to fix; 001 dependency-seams realpath fix"
    next_safe_action: "Push both 019 children to v4 + main"
    blockers: []
    key_files:
      - "001-dependency-and-node-abi-alignment/implementation-summary.md"
      - "002-command-rollout-mode-resolution/implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Child 001: dependency-seams failure was a worktree symlink artifact; realpath fix, version bump deferred."
      - "Child 002: intended deep/* rollout mode is fix (restored; accidentally demoted in bce47507b6d)."
---
# Feature Specification: Risky Pre-Existing Failure Remediation (phase parent)

<!-- SPECKIT_LEVEL: Phase Parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Type** | Phase Parent |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Source** | `018-pre-existing-test-triage` (the two risky-unrelated failures it deferred) |
| **Successor** | 020-tsx-boot-spaced-path-hardening |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 018 triaged the ten pre-existing runtime test failures and fixed the one that was cleanly correct. Two were deferred not because they are unimportant but because each requires a real decision that a rushed fix would get wrong: aligning `better-sqlite3` across two skills that can load native bindings in one process (an ABI-safety concern, complicated by a Node runtime that shifted `25.x → 26.x` mid-session), and resolving the command rollout mode that recompiling the stale `deep/*` contracts silently flips from `fix` to `fallback`. Both change real behavior — a native binding and how a command renders — so both need to be worked deliberately, each verified against the whole suite.

### Purpose

Remediate the two deferred risky failures properly, one phase child each, so that `dependency-seams`, `render-command-contract`, and `check-contract-drift` pass without introducing a regression, and the decisions behind the fixes are recorded rather than guessed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Child 001 — dependency & Node ABI alignment.** Decide the canonical `better-sqlite3` version across the runtime and system-spec-kit, align it, and establish a Node-ABI strategy that survives Node version bumps. Make `dependency-seams` pass ABI-safely.
- **Child 002 — command rollout-mode resolution.** Determine the intended default rollout mode for `deep/review` / `deep/research` / `deep/ai-council`, fix the compiler/config or the stale test accordingly, then recompile the contracts. Make `render-command-contract` + `check-contract-drift` pass without changing runtime behavior unintentionally.

### Out of Scope

- The six environment-only failures from 018 (locale, live-CLI stress, timeout/temp-dir flakes) — not code-fixable.
- Any deep-loop runtime finding already remediated in 017.

### Phase Documentation Map

| Child | Workstream | Level |
|-------|------------|-------|
| `001-dependency-and-node-abi-alignment` | better-sqlite3 version + Node ABI | 2 |
| `002-command-rollout-mode-resolution` | deep/* rollout mode + contract recompile | 2 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both risky failures are fixed with their decisions recorded | `dependency-seams`, `render-command-contract`, `check-contract-drift` pass; each child carries a decision-record for its choice. |
| REQ-002 | No new whole-suite regression | Each child re-runs the whole runtime suite against the 017 baseline; no new code-caused failures. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `dependency-seams` passes ABI-safely across the current Node.
- **SC-002**: `render-command-contract` + `check-contract-drift` pass with the rollout mode intentionally set.
- **SC-003**: Whole-suite delta shows no new code-caused failures beyond the documented environment flakes.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-skill dependency change | Could break the memory MCP | Change one version, verify both skills' native load + the whole suite |
| Risk | Unstable Node ABI (major bump within the session) | A rebuild goes stale on the next bump | Child 001 defines a rebuild-on-mismatch strategy, not a one-shot pin |
| Risk | Rollout-mode change alters command behavior | deep/review renders differently | Child 002 decides the intended mode first, then makes tests + config agree |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved per child: the canonical dependency version + Node strategy (001) and the intended rollout mode (002) are each decided inside their phase.

<!-- /ANCHOR:questions -->
