---
title: "Spec: Directive-Lifecycle Documentation Alignment"
description: "Audit-driven documentation alignment for the live directive-lifecycle feature (013/014): register the three directive lifecycle envs in the canonical ENV-REFERENCE.md hook-level block, state the lifecycle rule in every runtime-facing document (skill-advisor README, .pi extensions README, cursor hooks/spec-gate catalog), and verify-and-note SAD-003 as session-less fail-open compatible — docs only, zero behavior change."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle docs alignment"
  - "directive lifecycle documentation"
  - "hook-level lifecycle flags"
  - "SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP docs"
  - "directive lifecycle env reference"
importance_tier: "high"
contextType: "spec"
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
      fingerprint: "sha256:ccf9ea2976b9bc4d7df62cc8acdeb3cf93de9ca9343322529f8f4646b2b813f9"
      session_id: "2026-08-11-directive-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Directive-Lifecycle Documentation Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-directive-docs-alignment |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Predecessor** | 014-cross-runtime-directive-lifecycle |
| **Successor** | 016-directive-playbook-alignment |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 013 (Pi, `SPECKIT_PI_DIRECTIVE_DEDUP`) and phase 014 (Claude/Cursor/Devin/Codex shim + OpenCode plugin, `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` default ON with fail-open and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`) made the directive-lifecycle rule live on every runtime. The behavior is shipped and tested; the documentation surface that operators, runtimes, and future phases read has not caught up uniformly. An audit of that surface found **zero stale docs** — nothing asserts the old always-full per-turn cadence — but **four missing items**: the three directive lifecycle envs are registered nowhere canonical (`ENV-REFERENCE.md` §1's Feature Flags table is search-flags-generated and deliberately excludes hook-level toggles), the skill-advisor README's bridge-injection paragraph predates the lifecycle cadence sentence, `.pi/extensions/README.md`'s prompt-advisor rows predate 013's Pi dedup, and the cursor hooks/spec-gate catalog's `user-prompt-submit` row needed a verify-and-note pass against the shared compiled shim. A fifth item, SAD-003 (`system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md`), was verified session-less fail-open compatible and needs **no change** — recorded so nobody re-audits it.

The purpose is a canonical, discoverable documentation contract for the lifecycle rule and its kill-switches: one registry that is authoritative, per-runtime statements that point at it, and grep-verifiable presence so the docs cannot silently drift back to the always-full story. This phase changes documentation only.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the four audit findings — (1) a deliberate **Hook-level lifecycle flags** block in `ENV-REFERENCE.md` §1 registering `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` with defaults and kill-switch semantics; (2) a lifecycle-cadence sentence in `.opencode/skills/system-skill-advisor/README.md` (OpenCode Plugin Note / bridge-injection paragraph); (3) documentation of `SPECKIT_PI_DIRECTIVE_DEDUP` + the 013 lifecycle in `.pi/extensions/README.md` prompt-advisor rows; (4) verify-and-note of the `user-prompt-submit` reference in `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`. Also in scope: recording SAD-003 as verified no-change, and the verification gates (grep gates, stale-docs re-sweep, scope diff audit).

Out of scope: any runtime code or test change (`directive-lifecycle.ts`, the shim, the OpenCode plugin, `prompt-advisor.ts`, all vitest suites), the 007 activation matrix and the shadow program, regenerating the search-flags-derived Feature Flags table, playbook/catalog authoring (that is sibling phase 016), and any doc surface not named in the four findings. This packet documents the shipped 013/014 behavior and changes nothing about what the runtimes emit.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** The canonical registry for hook-level directive envs is `ENV-REFERENCE.md` §1: a deliberate **Hook-level lifecycle flags** block registers `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` with their defaults and kill-switch semantics (`0`/`false`/`off`/`no` → always-full delivery). The block lives beside — never inside — the search-flags-generated Feature Flags table and is explicitly marked as hook/plugin-level.
- **REQ-002 [P0]** Every runtime-facing document that describes advisor brief injection states the lifecycle rule: full delivery on the first message of a session and after every lifecycle boundary; the dynamic `Advisor:` route line kept with the constant directive block dropped on a proven same-content repeat; fail-open on every uncertain path (a guardrail is never silently dropped).
- **REQ-003 [P0]** Kill-switch values are documented wherever the feature or its envs are named: at minimum ENV-REFERENCE.md (canonical) plus each runtime doc that mentions the dedup (the skill-advisor README, the `.pi` extensions README, and the cursor catalog row).
- **REQ-004 [P1]** Docs only: zero behavior change. `directive-lifecycle.ts`, the shim, the plugin, `prompt-advisor.ts`, the vitest suites, and the 007 activation matrix are byte-identical to their post-014 revisions.
- **REQ-005 [P1]** All four audit findings are addressed, and SAD-003 is re-verified session-less fail-open compatible and explicitly recorded as no-change so it is not re-audited by a later phase.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `ENV-REFERENCE.md` §1 contains a `Hook-level lifecycle flags` block naming all three envs with defaults and the kill-switch semantics; a grep gate finds the block and the three env names.
- **SC-002** The skill-advisor README (OpenCode Plugin Note paragraph), the `.pi/extensions/README.md` prompt-advisor rows, and the cursor catalog `user-prompt-submit` row each state the lifecycle rule (first-full + boundary re-delivery + fail-open) and reference the canonical block.
- **SC-003** A re-sweep of the named surfaces finds zero stale assertions about per-turn delivery of the constant directive block (no doc claims always-full, no doc contradicts the kill-switch values).
- **SC-004** Docs-only scope proven: zero git diff on runtime code, tests, or the 007 activation matrix; only the four doc files plus this packet changed.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Doc drift after the sweep.** The documentation can silently fall back to the always-full story as the feature evolves. Mitigated by making ENV-REFERENCE §1 the canonical registry and having every runtime doc state the rule and point at the block; the grep gates in this packet are re-runnable.
- **Generated-table confusion.** `ENV-REFERENCE.md` §1's Feature Flags table is search-flags-generated; a hand-authored hook block sitting nearby could be mistaken for generated output (and vice versa). Mitigated by the explicit `Hook-level lifecycle flags` heading and the in-block statement that these are hook/plugin-level toggles, not search-pipeline flags.
- **Line-anchor drift.** The README cadence sentence sits near line ~101 today; a paragraph edit shifts it. The change anchors on the OpenCode Plugin Note paragraph text, not the line number, and the grep gate greps for content, not line numbers.
- **Dependencies.** None new. No packages, no network, no runtime surface touched.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The historical docs-only audit, edits, grep gates, re-sweep, scope audit, and parent reconciliation completed.

<!-- /ANCHOR:questions -->
