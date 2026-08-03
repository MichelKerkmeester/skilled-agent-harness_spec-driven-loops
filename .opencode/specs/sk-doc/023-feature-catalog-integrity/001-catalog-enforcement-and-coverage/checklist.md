---
title: "Verification Checklist: catalog enforcement and coverage"
description: "The catalog validator covers 8 of 26 feature-catalog packages (66 of 804 leaves), runs four narrow check families rather than the standard's eight rules, and exits 0 on its default invocation while printing FAIL: 19 violations. This phase settles the four rulings both siblings depend on, switches discovery to feature-catalog presence, adds six unenforced checks with paired fixtures, and wires a gate that actually fails."
trigger_phrases:
  - "catalog enforcement and coverage verification checklist"
  - "feature catalog integrity verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
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

# QA Checklist: Catalog Enforcement and Coverage

<!-- ANCHOR:protocol -->
## Verification Protocol

Planned phase. All items open. Every item is closed with evidence: a command and its output, or a file and line.
Baselines are the ones re-measured by T001, not the ones copied from the synthesis.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] T001 confirm-against-HEAD complete; validator baseline recorded (expected: 19 violations, all
      `missing_source_path`, default exit 0, `--strict` exit 1).
- [ ] Census re-derived and recorded (expected: 26 packages, 804 leaves, 8 packages / 66 leaves covered).
- [ ] Bijection sweep re-derived and recorded (expected: 104 orphan leaves, 0 dangling links across all 26).
- [ ] Full-run wall-clock measured, so the Q4 pre-push question is decided on data.
- [ ] Existing callers of the validator enumerated.
- [ ] The 14 never-audited nested catalogs measured for the covered-set ruling.
- [ ] Q1, Q2, Q3, Q4, Q6, Q8 answered or explicitly deferred with an operator note.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] Discovery is presence-based; no package is included or excluded by an unexplained name.
- [ ] Every exclusion in the ruled map carries a recorded reason.
- [ ] The count-derivation helper has exactly one definition site; the validator imports it.
- [ ] No comment in the validator or fixtures embeds a spec path, packet number, phase number, or finding ID.
- [ ] No catalog content file was edited by this phase.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] Exit-code test: seeded violation returns non-zero on the default invocation.
- [ ] Exit-code test: clean tree returns zero.
- [ ] Exit-code test: `--report-only` returns zero regardless of violations.
- [ ] Coverage test: a `feature-catalog/` directory outside the ruled set fails.
- [ ] Determinism test: two `--json` runs on an unchanged tree are byte-identical.
- [ ] Phantom-row check: positive fixture passes, negative fixture (advisor `(not yet authored)` row) fails.
- [ ] Prose-path check: positive fixture passes, negative fixture (`feature-flag-governance.md`) fails.
- [ ] Title-parity check: positive fixture passes, negative fixture fails.
- [ ] Description-parity check at the ruled strictness: positive fixture passes, negative fixture fails.
- [ ] Packet-history check: positive fixture passes, negative fixture (a `Source phase:` leaf) fails.
- [ ] Dark-vs-shipped check: positive fixture passes, negative fixture fails.
- [ ] Single-definition-site test for the shared helper passes.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] `RC-001-01` — 425-leaf baseline landed as the expected-inventory fixture.
- [ ] `RC-001-02` — census correction applied; `system-code-graph` is not in the covered set and is not flagged.
- [ ] `RC-001-03` — `mcp-code-mode` applicability ruling recorded. **OPERATOR-DECISION (Q1).**
- [ ] `RC-003-03` — feature-leaf definition ruled and recorded; `003` can act on the 94 orphans.
- [ ] `RC-007-07` — README half fixed; catalog half ruled. **OPERATOR-DECISION (Q1).**
- [ ] `RC-008-02` is NOT reopened. It was refuted at iteration 9 and confirmed repaired at HEAD. Do not resurrect.
- [ ] The blast-radius baseline is unchanged by this phase: still 104 orphans, 0 dangling links.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] The validator reads only repository files and performs no network access.
- [ ] No fixture embeds a credential, token, or absolute machine-local path.
- [ ] A relative path resolving outside the repo root is rejected, never followed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] `sk-create-feature-catalog/SKILL.md` documents the covered set and the enforced rule roster.
- [ ] The two asset templates carry the ruled amendments and no longer leave Q2 or the feature-leaf definition open.
- [ ] `decision-record.md` records four rulings, each with status, evidence, and consequences.
- [ ] `002` and `003` cite the decision record by path rather than re-deciding.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Fixtures live under the `sk-create-feature-catalog` package, not scattered in the catalogs they mimic.
- [ ] The shared helper lives in `.opencode/skills/sk-doc/shared/scripts/`, not inside one consumer.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] Baseline captured, delta reported: violations before and after, coverage before and after, orphans before and
      after.
- [ ] Every new violation surfaced by the widened corpus is explained, not merely counted.
- [ ] Every OPERATOR-DECISION item is either resolved or carries a recorded deferral.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] Coverage is derived, not enumerated, so it cannot silently narrow again.
- [ ] Severity is data, not code, so a package can be demoted without a code change.
- [ ] The three consumers of the count-derivation helper share one definition.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] Full-corpus run time measured over 26 packages and 804 leaves and recorded.
- [ ] The pre-push question in Q4 is answered against that measurement, not against a guess.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] Every existing caller of the validator still works after the exit-code inversion.
- [ ] CI on `skilled/v*` wired at the ruled severity and observed green on a clean tree.
- [ ] The `/doctor` route runs locally and reports the same result as CI.
- [ ] Rollback path proven: demoting one package to `warn` turns a red run green without a code change.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] Scope lock held: no catalog content file was modified by this phase.
- [ ] Comment hygiene held: no ephemeral artifact labels in code comments.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] The standard's eight rules are each mapped to either an enforced check or a recorded reason for staying manual.
- [ ] The gap between the standard and the enforcement surface is stated explicitly rather than implied.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] Operator sign-off on the four rulings.
- [ ] Operator sign-off on the gate point and severity.
<!-- /ANCHOR:sign-off -->
