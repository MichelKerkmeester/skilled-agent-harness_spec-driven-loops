---
title: "Spec: Directive-Lifecycle Playbook Alignment"
description: "Close the playbook/catalog coverage gap left by the live directive-lifecycle feature (013/014): add manual scenario 457 validating first-message full, repeat-turn route-only, boundary re-delivery, kill-switch revert, and fail-open per runtime (Pi/Claude/Cursor/Devin/Codex/OpenCode), register it in the root index, add the lifecycle-aware 119-C note, and publish the feature-catalog entry with both kill-switches — docs only."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle playbook alignment"
  - "directive lifecycle scenario 457"
  - "directive lifecycle dedup playbook"
  - "directive lifecycle feature catalog"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-directive-playbook-alignment"
    last_updated_at: "2026-08-11T10:10:08Z"
    last_updated_by: "claude"
    recent_action: "Playbook and catalog alignment, gates, and reconciliation completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md"
      - ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/C--comment-hygiene-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:0a0a1d60f5ddda711f6a38fc6ad7ee9970b76b5b7abf1698e5380a97d93d5ecc"
      session_id: "2026-08-11-directive-playbook-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Directive-Lifecycle Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-directive-playbook-alignment |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Predecessor** | 015-directive-docs-alignment |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The directive-lifecycle feature is live on every runtime — Pi since 013 (`SPECKIT_PI_DIRECTIVE_DEDUP`), the Claude/Cursor/Devin/Codex shim and the OpenCode plugin since 014 (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` default ON, fail-open, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`). The manual-testing-playbook and feature-catalog surfaces were audited against the shipped behavior: **zero stale assertions** — nothing in the playbooks or catalogs contradicts the first-full / route-only-repeat / boundary re-delivery cadence — but the coverage is **missing entirely**: the lifecycle feature has no manual-testing scenario, no root-index row, and no feature-catalog entry, so an operator cannot discover, exercise, or verify the dedup contract from the playbook/catalog surfaces. The comment-hygiene OpenCode scenario (119-C) also predates the lifecycle note.

The purpose is to close that coverage gap with executable documentation: a manual scenario (457) that validates the five behaviors per runtime — first-message full, repeat-turn route-only (`Advisor:` present, `Comment hygiene` absent), boundary re-delivery (compact/resume/restart), kill-switch revert (env `0` → always full), and fail-open (unknown/unconfirmed session → full) — registered in the root index; a lifecycle-aware note in 119-C; and a feature-catalog entry documenting the feature and both kill-switches. This phase is docs-only.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: (1) new manual scenario 457 `ux-hooks/directive-lifecycle-dedup.md` covering the five behaviors per runtime (Pi, Claude, Cursor, Devin, Codex, OpenCode) with concrete assertable signals and pointers to the automated suites as the authoritative lane; (2) the 457 root-index row in `.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`; (3) an optional lifecycle-aware note in `ux-hooks/C--comment-hygiene-opencode-plugin.md` (119-C) aligning the comment-hygiene injection cadence with the lifecycle rule and referencing 457; (4) a new feature-catalog entry (topical file `feature-catalog/ux-hooks/directive-lifecycle-dedup.md` plus a root `feature-catalog.md` row) documenting the directive-lifecycle feature, the canonical core, and both kill-switches.

Out of scope: any runtime or test change (the shipped 013/014 suites are the authoritative automated lane and are untouched), the 007 activation matrix and the shadow program, the ENV-REFERENCE hook-level env block (sibling phase 015), and any playbook/catalog surface beyond the named items. This packet documents the shipped behavior and changes nothing about what the runtimes emit.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** Manual scenario 457 (`ux-hooks/directive-lifecycle-dedup.md`) validates, per runtime (Pi, Claude, Cursor, Devin, Codex, OpenCode): first-message full delivery; repeat-turn route-only (the dynamic `Advisor:` present, `Comment hygiene` absent); boundary re-delivery (compact/resume/restart); kill-switch revert (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` / `SPECKIT_PI_DIRECTIVE_DEDUP=0` → always full); fail-open (unknown/unconfirmed session → full).
- **REQ-002 [P0]** The scenario is registered in the root index `manual-testing-playbook.md` with a 457 row pointing at the scenario file.
- **REQ-003 [P1]** A feature-catalog entry (topical file plus root `feature-catalog.md` row) documents the directive-lifecycle feature, the canonical core, the per-runtime adapters, and both kill-switches.
- **REQ-004 [P1]** The 119-C comment-hygiene OpenCode plugin scenario carries an optional lifecycle-aware note aligning its injection cadence with the lifecycle rule and referencing 457 (deferral acceptable with a recorded reason).
- **REQ-005 [P1]** Docs only: zero behavior change; a re-sweep of the playbooks and catalogs finds zero assertions contradicting the live behavior, and the runtime code, tests, and 007 activation matrix are byte-identical.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** 457 exists with the five per-runtime behaviors, each with a concrete assertable signal (first turn contains `Directives:` + `Comment hygiene`; repeat turn contains `Advisor:` and neither; boundary events restore the full block; kill-switch yields full every turn; session-less yields full), and the 457 root-index row is present.
- **SC-002** The scenario encodes the grep-verifiable expectations — `Advisor:` present / `Comment hygiene` absent on repeats, kill-switch steps for both envs, and a fail-open step — and points at the automated suites (`directive-lifecycle.vitest.ts`, shim DL1-DL6, plugin PL1-PL7, Pi 54) as the authoritative lane.
- **SC-003** The feature-catalog entry and its root row name the directive-lifecycle feature, the canonical core, and both kill-switches.
- **SC-004** The 119-C lifecycle note is present or explicitly deferred with a reason; the re-sweep finds zero stale playbook/catalog assertions; zero code/test/007 change.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Six-runtime matrix drift.** One scenario covering Pi, Claude, Cursor, Devin, Codex, and OpenCode risks step drift as adapter surfaces evolve. Mitigated by making the vitest suites the authoritative automated lane and keeping the manual commands adapter-boundary reproductions with the same assertions.
- **Index/catalog row drift.** A scenario file without a root-index row is undiscoverable; a row without the file is a broken link. Mitigated by grep gates asserting both directions of the 457 row and the catalog row.
- **Optional 119-C note.** The lifecycle-aware note in 119-C is optional (REQ-004/SC-004); if deferred, the reason is recorded rather than silently dropped.
- **Behavior change temptation.** The scenario could read as prescribing new runtime behavior; the contract is explicitly that the docs describe the shipped 013/014 behavior and the scope diff proves zero code change.
- **Dependencies.** None new. No packages, no network; the scenario reuses the existing suites and the already-live adapters.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The historical scenario, index, catalog, lifecycle note, grep gates, re-sweep, scope audit, and parent reconciliation completed. Phase 018 later hardened scenario evidence classes and provenance.

<!-- /ANCHOR:questions -->
