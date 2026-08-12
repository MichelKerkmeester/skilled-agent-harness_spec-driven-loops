---
title: "Per-Prompt Injection Bloat Reduction"
description: "Phase parent: implement the ranked per-prompt injection reductions from the hooks/001 research — measurement-first, flag-gated, guardrail-preserving, one candidate at a time across all six runtime hook adapters."
status: in_progress
completion_pct: 52

trigger_phrases:
  - "injection bloat reduction"
  - "per-prompt directive reduction"
  - "lifecycle policy capsule"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction"
    last_updated_at: "2026-08-11T13:20:00Z"
    last_updated_by: "pi"
    recent_action: "Phase 018 remediation planning now covers the full directive-lifecycle review"
    next_safe_action: "Capture phase 018 whole-gate baseline before changing runtime code"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:6166966361399e1cd96431c3d34c9a677f0721ddea8bcdde64cb8ce587f9bed4"
      session_id: "2026-08-06-hooks-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Per-Prompt Injection Bloat Reduction

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress (shadow-only; deep-review fixes shipped, activation flags off) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Research source** | `hooks/001-per-prompt-injection-audit/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `hooks/001` research measured that the three always-on directives (comment-hygiene, governor, proof-over-appearance) are ~763 bytes / ~190 estimated tokens and constitute ~94.7% of the per-turn advisor payload, delivered on nearly every valid turn across Claude Code, Codex, Devin, and OpenCode; Pi adds its own ~554-byte dispatch directive. A representative 10-turn session carries roughly 9,600 bytes of repeated policy text, growing linearly with turns.

### Purpose
Implement the research's ranked reductions to move recurring policy off the per-turn path — full policy once per session/lifecycle epoch, route-only deltas on repeats, edge-triggered Gate relay — cutting the modeled 10-turn payload by ~82% while preserving every guardrail. The program is **measurement-first** (ship receipts before behavior changes), **flag-gated** (one independent candidate at a time, never combined), and **guardrail-preserving** (behavioral negative controls before any activation). Prompt caching is explicitly not a lever: cached reads remain context occupancy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
The seven candidate phase children below (001-007), each an independently shippable candidate from the research's §9 ranked reductions and §11 rollout sequence, plus two follow-on alignment audits (008, 009), the playbook-results/fails tooling phases (010-012), the Pi-local and cross-runtime lifecycle work (013-014), documentation and playbook alignment (015-016), superseded adapter-evidence planning (017), and comprehensive review remediation delivery (018).

### Out of Scope
- Treating provider prompt-cache placement as a context-occupancy saving (research ruled out).
- Unconditional directive removal or no-match/failure silence (breaks the fail-open guardrail contract).
- Any behavior change that lacks a host-delivery receipt or a passing behavioral negative control.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-measurement-and-receipts-foundation/ | Shadow planner beside `render.ts`; canonical block IDs; observed-receipt delivery contract; byte-stable parity fixtures. No output change. | In Progress (open checklist items remain) |
| 2 | 002-opencode-route-line-bounding/ | Bound/digest OpenCode's uncapped compiled-route target list, with an explicit reveal/clarification path. | Planned |
| 3 | 003-opencode-transform-dedup/ | Stable-message-identity dedup with peek/commit and lifecycle session cleanup. | In Progress (open checklist items remain) |
| 4 | 004-full-first-route-only-repeats/ | Full policy on first delivery + route-only repeats; fail-open shadow observers; policy-set completeness gate. Shadow-first, flag-gated. | Complete (shadow-only) |
| 5 | 005-gate3-relay-edge-triggering/ | Gate-3 observed-receipt contract, unknown-session rejection, lifecycle epoch owner, production observer wiring. | Complete (shadow-only) |
| 6 | 006-pi-dispatch-and-compaction/ | Pi shadow receipts keyed per session; inert delivery without observed host receipt. | Complete (shadow-only) |
| 7 | 007-guardrail-controls-and-activation/ | Behavioral negative controls, receipt-bound activation matrix schema, per-runtime rollback. | Complete |
| 8 | 008-sk-code-alignment/ | sk-code opencode-surface alignment audit of the changed surface plus README-freshness corrections (comment hygiene, three READMEs). Docs-only follow-on; frozen behavior unchanged. | Complete |
| 9 | 009-testing-doc-alignment/ | Dual-lineage (gpt-5.6-luna + opencode-go deepseek-v4-flash) repo-wide sweep of manual-testing-playbooks and feature-catalogs; one change-derived stale test count fixed, two adapter-catalog notes added. Docs-only follow-on. | Complete |
| 10 | 010-playbook-cheapest-model/ | Playbook-results automation: cheapest viable model selection evidence and receipts. Follow-on tooling. | Complete |
| 11 | 011-playbook-results-automation/ | Playbook-results automation tooling. Follow-on; carries pre-existing SPEC_DOC_INTEGRITY validation debt tracked separately. | In Progress (pre-existing validate debt) |
| 12 | 012-playbook-fails-remediation/ | Playbook-fails remediation. Follow-on; carries pre-existing SPEC_DOC_INTEGRITY validation debt tracked separately. | Complete |
| 13 | 013-pi-local-directive-dedup/ | Pi-local visible-repetition fix: per-session dedup of the three constant directives inside `prompt-advisor.ts`, default-on with `SPECKIT_PI_DIRECTIVE_DEDUP` kill-switch; central machine and 007 gate untouched. | Complete (live) |
| 14 | 014-cross-runtime-directive-lifecycle/ | Extends 013's lifecycle rule to the model-context runtimes: canonical core `hooks/lib/directive-lifecycle.ts` + shim wiring + OpenCode plugin mirror, `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` kill-switch, fail-open everywhere; Pi and the shadow program untouched. | Complete (live) |
| 15 | 015-directive-docs-alignment/ | Docs alignment for the live lifecycle feature: registers the three directive envs in the canonical `ENV-REFERENCE.md` hook-level block and states the lifecycle rule in the skill-advisor README, `.pi` extensions README, and the cursor hooks catalog. Docs-only. | Complete |
| 16 | 016-directive-playbook-alignment/ | Playbook/catalog coverage for the live lifecycle feature: manual scenario 457 (first-full, repeat route-only, boundary re-delivery, kill-switch revert, fail-open per runtime), root-index + catalog rows, 119-C lifecycle note. Docs-only. | Complete |
| 17 | 017-adapter-live-delivery-verification/ | Historical adapter-delivery verification plan. Its incorrect discovery-symlink deletion diagnosis is superseded by phase 018; no phase-017 implementation is authorized. | Superseded by 018 |
| 18 | 018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/ | Comprehensive P0-P3 review remediation: lifecycle high-water and host epochs, fail-open identity/stat handling, hardened state storage, adapter parity, durable evidence taxonomy, and phases 014-018 truth reconciliation. | In progress — implementation and whole-gate proof complete; fresh review and final metadata pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Phase 001 is a hard prerequisite for 002-007: no behavior-changing candidate activates without its receipts and parity fixtures.
- Candidates 002-006 are independent flags and MUST NOT be combined; each ships shadow → parity → negative-control → activation on its own.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-measurement-and-receipts-foundation | 002-opencode-route-line-bounding | Canonical block IDs, hashes, delivery-receipt fields, and byte-stable parity fixtures land with zero output diff | shadow-only diff is empty; parity fixtures green |
| 002-opencode-route-line-bounding | 003-opencode-transform-dedup | Compiled-route list bounded behind a flag with a working reveal path | route choice/clarification retains required target names |
| 003-opencode-transform-dedup | 004-full-first-route-only-repeats | Same-message dedup keyed on stable message identity; distinct repeats still delivered | multi-transform receipts prove no distinct-message loss |
| 004-full-first-route-only-repeats | 005-gate3-relay-edge-triggering | Full-first + route-only repeats behind a flag; lifecycle/compaction replay resets delivery state | negative controls pass; changed-route delivers ~43 B |
| 005-gate3-relay-edge-triggering | 006-pi-dispatch-and-compaction | Unchanged Gate relay suppressed while open; first/invalid/scope-change/recovery preserved | Gate matrix negative controls pass |
| 006-pi-dispatch-and-compaction | 007-guardrail-controls-and-activation | Pi arbitration is semantic-preserving; dispatch directive retained until native enforcement exists | Pi failure retains dispatch guard |
| 007-guardrail-controls-and-activation | — | Every activated runtime/candidate cell passed delivery and behavioral controls; rollback is per-cell | forbidden-comment reject + unsupported-completion block + governor scenarios green |
| 017-adapter-live-delivery-verification | 018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery | Review disproves the symlink-deletion diagnosis and identifies lifecycle, storage-security, adapter-parity, evidence-integrity, and metadata gaps outside phase 017 scope | Phase 018 maps every formal P0/P1/P2 finding plus non-gating P3 residuals and explicitly preserves all discovery symlinks |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

| # | Question | Status |
|---|----------|--------|
| 1 | Which runtimes expose host-delivery receipts today vs need a shadow harness first? | Partially resolved — observed-receipt contract enforced; live host adapters remain inert pre-activation (phase 004/005/006) |
| 2 | Is a single 292-char policy capsule the delivery form, or per-directive IDs with lifecycle replay? | Resolved — per-block IDs with lifecycle epoch replay; route-only requires all directive blocks `SUPPRESSED_SAME` |
<!-- /ANCHOR:questions -->
