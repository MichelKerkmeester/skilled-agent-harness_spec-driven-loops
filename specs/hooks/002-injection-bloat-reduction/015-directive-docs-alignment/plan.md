---
title: "Plan: Directive-Lifecycle Documentation Alignment"
description: "Register the three directive lifecycle envs in the canonical ENV-REFERENCE.md hook-level block, restate the lifecycle rule in each runtime-facing doc (skill-advisor README, .pi extensions README, cursor catalog row), verify-and-note SAD-003 as no-change, and prove docs-only scope with grep gates and a re-sweep."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle docs alignment plan"
  - "directive lifecycle documentation plan"
  - "hook-level lifecycle flags plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-directive-docs-alignment"
    last_updated_at: "2026-08-11T10:10:08Z"
    last_updated_by: "claude"
    recent_action: "Documentation alignment, gates, and parent reconciliation completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".pi/extensions/README.md"
      - ".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md"
    session_dedup:
      fingerprint: "sha256:c0bffa04b8eda7896d7f4244d7fcdf2ee50f5844cd161d530773b92e044dcaac"
      session_id: "2026-08-11-directive-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Directive-Lifecycle Documentation Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Phase 013 shipped the Pi-local dedup (`SPECKIT_PI_DIRECTIVE_DEDUP`, adapter-local inside `hooks/pi/prompt-advisor.ts`, default ON, kill-switch). Phase 014 generalized it: canonical core `hooks/lib/directive-lifecycle.ts` (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` default ON with fail-open, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` state-dir override) consumed by the shared Claude/Cursor/Devin/Codex shim and the OpenCode plugin mirror. The behavior is live and tested. The documentation surface was audited after 014 reconciled: **zero stale docs** (nothing asserts the old always-full cadence), but **four missing items** — the hook envs are registered nowhere canonical (`ENV-REFERENCE.md` §1's Feature Flags table is search-flags-generated and deliberately excludes hook toggles), the skill-advisor README's bridge-injection paragraph lacks the lifecycle cadence sentence, `.pi/extensions/README.md`'s prompt-advisor rows predate 013's Pi dedup, and the cursor hooks/spec-gate catalog's `user-prompt-submit` row needed a verify-and-note pass against the shared compiled shim. SAD-003 was verified session-less fail-open compatible (no change needed).

### Overview

Add the canonical hook-level env block to `ENV-REFERENCE.md` §1, restate the lifecycle rule in each runtime-facing doc (skill-advisor README, `.pi` extensions README, cursor catalog row), verify-and-note the cursor row, record SAD-003 as verified no-change, then prove the result with content-anchored grep gates, a stale-docs re-sweep, and a scope diff audit showing zero runtime/test change.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The audit is complete: the four missing items and the SAD-003 verification are enumerated, and every target paragraph is located by text anchor (not line number).
- The canonical-registry decision is made: `ENV-REFERENCE.md` §1 is the single source of truth for hook-level directive envs, with per-runtime docs restating the rule and pointing at it.

### Definition of Done

- The hook-level block registers all three envs with defaults and kill-switch semantics; every runtime doc states the lifecycle rule and names the kill-switch values.
- SAD-003 is recorded as verified no-change; the re-sweep finds zero stale assertions; the scope diff proves zero runtime/test/007 change; grep gates pass.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical registry plus per-runtime restatement, docs-only. One source of truth (`ENV-REFERENCE.md` §1 hook-level block) defines the envs, defaults, and kill-switch semantics; every runtime-facing doc states the lifecycle rule and points back at the block; verification is grep-based so the contract is machine-checkable without runtime changes.

### Key Components

- `ENV-REFERENCE.md` §1 — `Hook-level lifecycle flags` block: `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, each with default, kill-switch semantics (`0`/`false`/`off`/`no` → always-full), and canonical-core pointers.
- `system-skill-advisor/README.md` — OpenCode Plugin Note paragraph: the since-014 lifecycle cadence sentence (full on first message + boundaries, route-only repeats, `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` revert, fail-open).
- `.pi/extensions/README.md` — prompt-advisor rows: the 013 lifecycle (`SPECKIT_PI_DIRECTIVE_DEDUP` default ON; full first + `session_start`/`session_compact` boundaries; route-only repeats).
- `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` — `user-prompt-submit` row verify-and-note: registered `beforeSubmitPrompt` proxy, lifecycle-deduped via the shared compiled shim.
- SAD-003 note — `system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` verified session-less fail-open compatible; no edit.

### Data Flow

`ENV-REFERENCE.md` §1 defines the env contract → runtime docs restate the rule and link to the block → grep gates assert presence of the block, the three env names, the lifecycle-rule sentences, and the kill-switch values → re-sweep asserts zero stale assertions → scope diff asserts zero code change.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Locate the four targets by text anchor (ENV-REFERENCE §1 Feature Flags table + §1 end; README OpenCode Plugin Note paragraph; `.pi` prompt-advisor rows; cursor catalog `user-prompt-submit` row) and verify SAD-003 is session-less fail-open compatible.

### Phase 2: Core Implementation

Add the `Hook-level lifecycle flags` block to ENV-REFERENCE §1; add the cadence sentence to the README; document the 013 dedup in the `.pi` rows; verify-and-note the cursor row; record SAD-003 as no-change.

### Phase 3: Verification

Run the grep gates (block + env names; lifecycle-rule sentences; kill-switch values), the stale-docs re-sweep (expect zero), and the scope diff audit (zero runtime/test/007 change); then the parent recursive validation.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- No vitest changes — this phase is docs-only; the shipped 013/014 suites (`directive-lifecycle.vitest.ts`, shim DL1-DL6, plugin PL1-PL7, Pi 54) already prove the behavior the docs now describe.
- Grep gates per requirement: `Hook-level lifecycle flags` + the three env names in ENV-REFERENCE §1 (REQ-001); lifecycle-rule phrasing (first-full, boundary re-delivery, fail-open) in the README, `.pi` rows, and cursor row (REQ-002); kill-switch values `0`/`false`/`off`/`no` documented next to each env (REQ-003).
- Stale-docs re-sweep: grep the named surfaces for assertions of always-full per-turn delivery or contradicting kill-switch values — expect zero matches (SC-003).
- Scope audit: `git diff` over runtime code, tests, and the 007 activation folder — expect zero (REQ-004/SC-004).

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- None new. The four docs and this packet; no packages, no network, no runtime or test surface touched. The parallel implementation edits only the four named doc files.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the four doc edits (one hunk each: the ENV-REFERENCE block, the README sentence, the `.pi` rows, the cursor row) restores the pre-phase docs. Docs-only means there is no runtime behavior to unwind and no kill-switch interaction; the feature stays live with or without this documentation. SAD-003 is untouched by design. No build artifacts, shared-library changes, or activation-matrix edits to unwind.

<!-- /ANCHOR:rollback -->
