---
title: "Plan: Directive-Lifecycle Playbook Alignment"
description: "Author manual scenario 457 validating the directive-lifecycle dedup per runtime (first-full, route-only repeats, boundary re-delivery, kill-switch revert, fail-open), register its root-index row, add the optional 119-C lifecycle note, publish the feature-catalog entry with both kill-switches, and prove docs-only scope with grep gates and a re-sweep."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle playbook alignment plan"
  - "directive lifecycle scenario plan"
  - "directive lifecycle dedup catalog plan"
importance_tier: "high"
contextType: "plan"
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
      fingerprint: "sha256:abdd1892ea2fec76fb18db374e49e0236e8efe68da9187debba2bd2b46a17b67"
      session_id: "2026-08-11-directive-playbook-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Directive-Lifecycle Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Phases 013 and 014 made the directive-lifecycle rule live on every runtime: full delivery of the three constant advisor directives on the first message of a session and after every lifecycle boundary; the dynamic `Advisor:` route line kept with the block dropped on a proven same-content repeat; fail-open on every uncertain path; kill-switches `SPECKIT_PI_DIRECTIVE_DEDUP` (Pi) and `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` (shim + OpenCode plugin, with `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`). The playbook and catalog surfaces were audited: zero stale assertions, but the feature has no manual-testing scenario, no root-index row, and no feature-catalog entry. The ux-hooks group hosts the OpenCode-plugin scenarios (119-C comment-hygiene among them), and the system-spec-kit feature-catalog root lists skill-advisor entries without the directive-lifecycle feature.

### Overview

Author manual scenario 457 (`ux-hooks/directive-lifecycle-dedup.md`) covering the five behaviors per runtime with concrete assertable signals and automated-suite pointers; register the 457 row in the root `manual-testing-playbook.md` index; add the optional lifecycle-aware note to 119-C; publish the feature-catalog entry (topical file + root row) naming the feature, the canonical core, and both kill-switches; then prove the result with grep gates, a stale-assertion re-sweep, and a docs-only scope diff.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The audit is complete: zero stale assertions confirmed, missing coverage enumerated (scenario, index row, catalog entry, 119-C note), scenario numbering confirmed free (457), and the per-runtime adapter surfaces located.
- The authoritative-lane decision is made: the shipped vitest suites are the executable proof; the scenario's manual commands reproduce at the adapter boundary with identical assertions.

### Definition of Done

- 457 exists with the five per-runtime behaviors and its root-index row; the catalog entry and root row exist with both kill-switches; the 119-C note is present or deferred with a reason.
- Grep gates pass; the re-sweep finds zero stale playbook/catalog assertions; the scope diff proves zero runtime/test/007 change.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Executable-doc coverage: the manual scenario is the discoverable contract, the shipped vitest suites are the authoritative automated lane, and the catalog entry is the feature map. The scenario asserts behavior by observable signals at the adapter boundary (`Advisor:` / `Directives:` / `Comment hygiene` presence), never by reimplementing the decision logic.

### Key Components

- `ux-hooks/directive-lifecycle-dedup.md` (457) — scenario contract with five per-runtime behaviors: first-full, repeat route-only, boundary re-delivery, kill-switch revert, fail-open; automated-lane pointers to `directive-lifecycle.vitest.ts`, shim DL1-DL6, plugin PL1-PL7, and the Pi 54-test suite; per-runtime commands (shim stdin envelope, transcript shrink, kill-switch env, session-less call; plugin transform lane; Pi adapter suite).
- `manual-testing-playbook.md` root index — 457 row under UX Hooks with scenario + feature-file links.
- `feature-catalog/ux-hooks/directive-lifecycle-dedup.md` + root row — feature map: canonical core, per-runtime adapters, both kill-switches, automated suites.
- `ux-hooks/C--comment-hygiene-opencode-plugin.md` (119-C) — optional lifecycle note aligning the injection cadence with the rule and referencing 457.

### Data Flow

Scenario prompts the operator → per-runtime commands drive the adapters (shim envelope / plugin transform / Pi suite) → observed signals (`Advisor:` present vs `Directives:`/`Comment hygiene` absent, full block after boundaries, full under kill-switch, full session-less) → per-runtime PASS/FAIL verdict → root index + catalog entry make the scenario and the feature discoverable.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm scenario numbering (457 free), the ux-hooks group path, the root-index row format, the catalog root and entry format, and the per-runtime adapter surfaces and suite paths.

### Phase 2: Core Implementation

Author scenario 457 with the five behaviors, per-runtime commands, evidence fragments, and automated-lane pointers; add the 457 root-index row; add the optional 119-C lifecycle note; publish the feature-catalog entry and its root row.

### Phase 3: Verification

Run the grep gates (five behaviors encoded; both kill-switches named; index + catalog rows present both directions), the stale-assertion re-sweep (expect zero), and the scope diff audit (zero runtime/test/007 change); then the parent recursive validation.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- No vitest changes — the shipped suites are the authoritative lane and are untouched: `directive-lifecycle.vitest.ts` (core + store), shim DL1-DL6, plugin PL1-PL7, Pi dispatch 54.
- Scenario-level gates: grep the scenario for the five behaviors and their signals — `Advisor:` present / `Comment hygiene` absent on repeats; boundary events (transcript shrink, `session.compacted`, `session_start`/`session_compact`); both kill-switch envs; a session-less fail-open step.
- Index/catalog gates: the 457 row exists in the root index and the file exists; the catalog root row exists and the topical file exists; both kill-switches appear in the catalog entry.
- Re-sweep: grep the playbooks and catalogs for assertions contradicting the live cadence (always-full claims, wrong kill-switch semantics) — expect zero.
- Scope audit: `git diff` over runtime code, tests, and the 007 activation folder — expect zero.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- None new. The scenario reuses the shipped suites and adapters; the catalog entry and index rows are self-contained markdown. No packages, no network, no runtime or test surface touched. The parallel implementation edits only the named playbook/catalog files.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete scenario 457 and its root-index row, remove the catalog entry and its root row, and revert the 119-C note (if added) — each a single-file or single-row revert. Docs-only means there is no runtime behavior to unwind and no kill-switch interaction; the feature stays live with or without this coverage. No build artifacts, shared-library changes, or activation-matrix edits to unwind.

<!-- /ANCHOR:rollback -->
