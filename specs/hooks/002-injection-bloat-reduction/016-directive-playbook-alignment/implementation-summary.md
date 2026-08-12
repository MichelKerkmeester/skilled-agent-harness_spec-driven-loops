---
title: "Implementation Summary: Directive-Lifecycle Playbook Alignment"
description: "The directive-lifecycle feature now has executable documentation coverage: manual scenario 457 validates first-full, route-only repeats, boundary re-delivery, kill-switch revert, and fail-open per runtime and is registered in the root index; 119-C carries the lifecycle note; the feature-catalog entry and root row document the feature and both kill-switches — docs only, zero behavior change."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle playbook alignment implementation"
  - "directive lifecycle scenario summary"
  - "directive lifecycle dedup catalog summary"
importance_tier: "high"
contextType: "implementation"
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
      fingerprint: "sha256:3a3ee6b428a51ad19e5edde847f18d33c914140aaafec7ac3319589798f3e4ba"
      session_id: "2026-08-11-directive-playbook-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Directive-Lifecycle Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-directive-playbook-alignment |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Completion** | 100% — scenario, rows, note, catalog entry, gates, and reconciliation completed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four playbook/catalog artifacts, driven by an audit that found zero stale assertions but entirely missing coverage of the live directive-lifecycle feature.

1. **Scenario 457.** `ux-hooks/directive-lifecycle-dedup.md` — a full manual scenario validating, per runtime (Pi, Claude, Cursor, Devin, Codex, OpenCode): first-message full delivery; repeat-turn route-only (the dynamic `Advisor:` present, `Comment hygiene` absent); boundary re-delivery (compact/resume/restart — transcript shrink on the shim, session-lifecycle events on the plugin, `session_start`/`session_compact` on Pi); kill-switch revert (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` / `SPECKIT_PI_DIRECTIVE_DEDUP=0` → always full); fail-open (unknown/unconfirmed session → full). It includes per-runtime commands, expected-signal fragments, PASS/FAIL verdicts, failure triage through the canonical core, and pointers to the shipped suites as the authoritative automated lane.

2. **Root-index registration.** `manual-testing-playbook.md` gains the 457 UX Hooks row linking the scenario file and its feature-file path.

3. **The 119-C lifecycle note.** `ux-hooks/C--comment-hygiene-opencode-plugin.md` gains a lifecycle note aligning the comment-hygiene injection cadence (session start + boundary re-delivery, never dropped on an uncertain path) with the lifecycle rule and pointing at scenario 457 as the covering validation.

4. **The feature-catalog entry.** `feature-catalog/ux-hooks/directive-lifecycle-dedup.md` plus the root `feature-catalog.md` row document the directive-lifecycle feature: the canonical core, the per-runtime adapters, the fail-open semantics, and both kill-switches (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`).

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit after 014's reconciliation swept the manual-testing-playbooks and feature-catalogs for assertions contradicting the live 013/014 behavior: zero were found — nothing claims the old always-full cadence. What was missing was coverage: the lifecycle feature had no scenario an operator could run, no index row, and no catalog entry; 119-C predated the lifecycle note. The gap was closed with executable documentation: the scenario asserts only adapter-boundary-observable signals (`Advisor:` / `Directives:` / `Comment hygiene` presence) and delegates the decision proof to the shipped vitest suites (core + store, shim DL1-DL6, plugin PL1-PL7, Pi 54), keeping the manual lane reproducible and the automated lane authoritative. The index and catalog rows make both the scenario and the feature discoverable in both directions (row → file, file → row). Nothing runtime-adjacent was touched; the shipped 013/014 behavior is the contract these docs now exercise and map.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scenario asserts observable signals, not decision logic | Reimplementing the split/decision in the scenario would duplicate the canonical core and drift. Asserting `Advisor:` present / `Comment hygiene` absent at the adapter boundary keeps the scenario honest and the core the single implementation. |
| Shipped suites are the authoritative automated lane | DL1-DL6, PL1-PL7, the core+store suite, and the Pi 54-test suite already prove every branch; the scenario's manual commands reproduce the same assertions at the adapter boundary without re-running the full matrix. |
| One scenario for all six runtimes | The feature is one lifecycle rule across six adapters; one scenario with per-runtime commands exposes drift between adapters in a single run, and the per-runtime verdicts localize a failure to one adapter. |
| Kill-switches front and center | The switches are the operator's only runtime control over the dedup; the scenario's kill-switch steps and the catalog entry's trigger phrases + body make both `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` and `SPECKIT_PI_DIRECTIVE_DEDUP` discoverable. |
| 119-C note included (optional but landed) | The comment-hygiene scenario's injection cadence is exactly the lifecycle cadence; the note prevents an operator from reading 119-C as a per-turn injection guarantee and routes to 457 for the validation. |
| Docs only; zero behavior change | The behavior is live, tested, and reconciled (013/014); this phase exists because coverage lagged the feature, so changing any code would be both unnecessary and out of scope. The scope diff is the proof. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scenario 457 surface | PASS (static) — five behaviors, six runtimes, per-runtime commands, evidence fragments, automated-lane pointers, PASS/FAIL + triage present. |
| Root-index row | PASS (static) — 457 UX Hooks row present in `manual-testing-playbook.md`; scenario file resolves. |
| Catalog entry + root row | PASS (static) — topical file present; root row names the feature and resolves; both kill-switches in trigger phrases + body. |
| 119-C lifecycle note | PASS (static) — lifecycle note present and references 457. |
| Comment hygiene | PASS (static) — docs-only; no code comments added. |
| Grep gates | PASS — behaviors, signals, kill switches, and bidirectional row resolution verified. |
| Stale-assertion re-sweep | PENDING — expect zero always-full / contradicting kill-switch / boundary claims in playbooks and catalogs. |
| Scope diff audit | PENDING — zero git diff on runtime code, tests, and the 007 activation folder; recursive validate.sh on the parent. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six-runtime matrix in one scenario.** The scenario is long and its manual commands depend on the adapter surfaces staying stable; the automated suites are the authoritative lane, so a drift that breaks a manual command fails the suite first, not the doc. The failure-triage section names the canonical core for root-causing.
2. **Manual lane requires live adapters.** The shim and plugin commands assume the compiled dist and installed plugin; an environment without them must fall back to the suite lane (which the scenario already marks authoritative).
3. **Sibling coverage split.** Env-registry documentation of the same feature is sibling phase 015's scope; this phase covers only the playbook/catalog surfaces named in the findings.
4. **119-C note is scenario-adjacent, not a new scenario.** The note aligns an existing scenario with the lifecycle rule; it does not re-validate the comment-hygiene behavior, which remains 119-C's own contract.

<!-- /ANCHOR:limitations -->
