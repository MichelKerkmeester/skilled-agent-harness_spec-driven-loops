---
title: "Verification Checklist: large-surface catalog reconciliation"
description: "The two catalog surfaces outside every gate are the two that most need one: system-spec-kit (348 leaves, 94 orphans, eight registered MCP tools with no root mention, two leaves publishing obsolete contracts) and the system-deep-loop nested runtime and benchmark catalogs (75 leaves, whole undocumented typed-spine domains, two stale executor rosters, 22 leaves carrying forbidden packet-history metadata). This phase reconciles both, with the typed-spine rollout state adjudicated externally rather than guessed."
trigger_phrases:
  - "large surface catalog reconciliation verification checklist"
  - "feature catalog integrity verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level3-verify | v2.2 -->

# QA Checklist: Large-Surface Catalog Reconciliation

<!-- ANCHOR:protocol -->
## Verification Protocol

Planned phase. All items open. Two lanes. Every item closes with evidence: a command and its output, or a file and
line. Rollout labels close against real wiring, not against the evidence table that produced them.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] Missing-tools check completed across all 41 `TOOL_DEFINITIONS` (baseline: 8 absent, 5 sampled and confirmed).
- [ ] `session_bootstrap` handler and schema re-read; the live envelope recorded.
- [ ] `CONTEXT_MODES` re-read; the live budgets recorded (baseline: leaf 800/1500/2000/1200, live 800/3500/3000).
- [ ] `Source phase:` file count captured (baseline: 22).
- [ ] Both executor rosters re-derived from `executor-config.ts` and `KNOWN_EXECUTORS`.
- [ ] Spec-kit orphan count re-derived (baseline: 94 of the repo-wide 104).
- [ ] Typed-spine rollout-state evidence table built and dispatched for adjudication.
- [ ] `RC-008-02` confirmed still closed and recorded as do-not-resurrect.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] No runtime code, handler, schema, or script modified. Catalog markdown plus one generator.
- [ ] Every roster, budget and envelope is derived or asserted, never transcribed.
- [ ] The generator, not the table it emits, is the committed artifact.
- [ ] No catalog comment or prose embeds a spec path, packet number, phase number, or finding ID.
- [ ] Every module labeled dark, shadow-only, or unresolved carries an empty or stub SOURCE FILES table.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] Generated reconciliation: zero registered MCP tools absent from the spec-kit root, from a baseline of 8.
- [ ] `rg -c "Source phase"` over the runtime catalog returns 0 files, from 22.
- [ ] Roster test passes on the current tree and fails on a synthetic new executor.
- [ ] `session_bootstrap` envelope asserted green against the handler and schema.
- [ ] `memory_context` budgets asserted green against `CONTEXT_MODES`.
- [ ] After `001` lands: both packages inside the widened validator, `--strict` clean.
- [ ] Spec-kit orphans 94 to 0-by-ruling, each linked or classified with a recorded reason.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

**Lane A — `system-spec-kit`**

- [ ] `RC-003-01` — all 41 registered tools present in the root; linked where a leaf already existed.
- [ ] `RC-003-02` — `session_bootstrap` response contract corrected and asserted.
- [ ] `RC-008-01` — `memory_context` budgets corrected and asserted.
- [ ] `RC-001-06` — four template-shape defects repaired and packet-history prose removed from the root.

**Lane B — `system-deep-loop` nested catalogs**

- [ ] `RC-004-01` — typed spine documented with adjudicated rollout labels. **OPERATOR-DECISION (Q5).**
- [ ] `RC-004-02` — fan-out roster derived from `executor-config.ts`.
- [ ] `RC-010-01` — model-benchmark roster derived from `KNOWN_EXECUTORS`.
- [ ] `RC-010-02` — five Lane C benchmark controls documented with accurate default-off or live-only labels.
- [ ] `RC-004-04` — `Source phase:` metadata removed from all 22 runtime leaves.

- [ ] All 9 findings accounted for; none silently dropped.
- [ ] `RC-008-02` NOT reopened.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] No leaf documents a credential path, token, or internal-only endpoint.
- [ ] No module with an unresolved rollout state is labeled shipped by default.
- [ ] No catalog entry claims a safety-relevant runtime behavior that its wiring does not support.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] Every new or repaired leaf follows OVERVIEW / HOW IT WORKS / SOURCE FILES / SOURCE METADATA.
- [ ] Every leaf's frontmatter carries `title`, `description` and `trigger_phrases`, with `title` matching its root H3.
- [ ] The deep-loop catalogs cite current source paths only; no packet or phase identifiers remain.
- [ ] Where `036/032` already states a fact, this phase links to it rather than re-stating it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] The tool-reconciliation generator sits in `.opencode/skills/sk-doc/shared/scripts/` so `001`'s gate can run it.
- [ ] The orphan classification ledger is committed alongside the phase, not left in scratch.
- [ ] Every leaf added has exactly one root entry, and every root entry has exactly one leaf.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] Baselines captured and deltas reported: tools absent 8 to 0, `Source phase:` 22 to 0, orphans 94 to 0-by-ruling.
- [ ] Every OPERATOR-DECISION item resolved or carrying a recorded deferral.
- [ ] The adjudication outcome is recorded in `decision-record.md`, including any module returned as unknown.
- [ ] Nothing in `002`'s scope was edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] Every mirrored fact is derived from one source of record, not duplicated across catalogs.
- [ ] The rollout labels are data traced to an adjudicated table, not an authoring judgment embedded in prose.
- [ ] The roster test makes recurrence a build failure rather than a future finding.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] The tool-reconciliation generator runs in a single pass and is cheap enough to run in `001`'s gate.
- [ ] The added checks do not materially change the validator's full-corpus runtime measured in `001`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] Both packages are inside the widened validator and clean, so the gate can promote them from `warn` to `fail`.
- [ ] The rollback path is proven: correcting a label and its SOURCE FILES table together restores conformance.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] Scope lock held: no hub-root catalog outside `system-spec-kit` was edited.
- [ ] Scope lock held: no deep-loop README, SKILL.md, script contract, or registry was edited.
- [ ] Comment hygiene held: no ephemeral artifact labels anywhere in the authored content.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] The catalog no longer claims a complete 50-entry runtime inventory unless it is one.
- [ ] Each of the 94 orphan classifications is legible to a future reader: path, class, reason.
- [ ] A reader starting at a nested catalog can tell which modules ship and which do not.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] 036 program owner sign-off on the adjudicated rollout-state table.
- [ ] Operator sign-off on the orphan classification ledger.
<!-- /ANCHOR:sign-off -->
