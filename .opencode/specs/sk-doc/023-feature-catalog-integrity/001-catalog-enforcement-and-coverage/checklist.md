---
title: "Verification Checklist: catalog enforcement and coverage"
description: "The catalog validator discovers all 26 present feature-catalog packages, enforces the widened rule roster with paired fixtures, stages four known-backlog packages at WARN, and fails closed for promoted violations; shared helper and caller wiring are deferred."
trigger_phrases:
  - "catalog enforcement and coverage verification checklist"
  - "feature catalog integrity verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded validator, fixture, regression, and full-fleet gate receipts"
    next_safe_action: "Run strict packet validation"
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

Implementation is in progress. Closed items carry a command/output receipt or a file-and-line reference; the remaining
items are the intentionally deferred shared-helper and caller work, the widened-corpus explanation, and strict packet
validation.
Baselines are the ones re-measured by T001, not the ones copied from the synthesis.
<!-- /ANCHOR:protocol -->

---

## P1 - Verification Context

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] T001 confirm-against-HEAD complete; validator baseline recorded (expected: 19 violations, all
      `missing_source_path`, default exit 0, `--strict` exit 1).
- [x] CHK-002 [P1] Census re-derived and recorded (expected: 26 packages, 804 leaves, 8 packages / 66 leaves covered). **Evidence:** frozen pre-edit census `26/804/104/0` is recorded in `spec.md`.
- [x] CHK-003 [P1] Bijection sweep re-derived and recorded (expected: 104 orphan leaves, 0 dangling links across all 26). **Evidence:** frozen pre-edit bijection baseline is `104/0` in `spec.md`; post-ruling census is `103/0` by case-insensitive root classification.
- [x] CHK-004 [P1] Full-run wall-clock measured, so the Q4 pre-push question is decided on data. **Receipt:** `real 1.66`; full
      output digest `608fb7f8889461c00ff9b6a29512d68da2103f8d8be84219d4b7f23861fa19c6`.
- [x] CHK-005 [P1] Existing callers of the validator enumerated. **Receipt:** executable-file search found only the validator and
      its two tests; no CI, hook, or `/doctor` caller exists in the current tree.
- [ ] CHK-006 [P1] The 14 never-audited nested catalogs measured for the covered-set ruling.
- [ ] CHK-007 [P1] Q1, Q2, Q3, Q4, Q6, Q8 answered or explicitly deferred with an operator note.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Discovery is presence-based; no package is included or excluded by an unexplained name. **Evidence:** `validate_catalog_package.py` uses `rglob('feature-catalog')` discovery.
- [x] CHK-009 [P1] Every exclusion in the ruled map carries a recorded reason. **Evidence:** `EXCLUDED_PACKAGE_PREFIXES` contains the runtime-data reason.
- [B] The count-derivation helper has exactly one definition site; the validator imports it. **Deferred outside this leaf scope.**
- [x] CHK-010 [P1] No comment in the validator or fixtures embeds a spec path, packet number, phase number, or finding ID. **Evidence:** `validate_catalog_package.py` comment scan returned no forbidden code-comment labels.
- [x] CHK-011 [P1] No catalog content file was edited by this phase. **Evidence:** `git diff --name-only` contains only validator package files and this child packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-012 [P1] Exit-code test: seeded violation returns non-zero on the default invocation. **Evidence:** fixture harness reports `promoted package fails closed by default`.
- [x] CHK-013 [P1] Exit-code test: clean tree returns zero. **Evidence:** fixture harness reports `clean package exits zero`.
- [x] CHK-014 [P1] Exit-code test: `--report-only` returns zero regardless of violations.
- [x] CHK-015 [P1] Coverage test: a `feature-catalog/` directory outside the ruled set fails.
- [x] CHK-016 [P1] Determinism test: two `--json` runs on an unchanged tree are byte-identical.
- [x] CHK-017 [P1] Phantom-row check: positive fixture passes, negative fixture (advisor `(not yet authored)` row) fails.
- [x] CHK-018 [P1] Prose-path check: positive fixture passes, negative fixture (retired compiled-routing path) fails. **Evidence:** fixture harness output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] CHK-019 [P1] Title-parity check: positive fixture passes, negative fixture fails. **Evidence:** fixture harness output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] CHK-020 [P1] Description-parity check at the ruled strictness: positive fixture passes, negative fixture fails. **Evidence:** fixture harness output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] CHK-021 [P1] Packet-history check: positive fixture passes, negative fixture (a `Source phase:` leaf) fails.
- [x] CHK-022 [P1] Dark-vs-shipped check: positive fixture passes, negative fixture fails. **Evidence:** fixture harness output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] CHK-023 [P1] Volatile-value policy: positive fixture passes, measurement-snapshot negative fixture fails. **Evidence:** fixture harness output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [B] Single-definition-site test for the shared helper passes. **Deferred with the helper.**
- [x] CHK-024 [P1] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0. **Evidence:** final verbose output digest `f1853890f5b9bec83f93b0fb47f60fd818e4c4bd6950a1616082f59286b9d035`, direct rc 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [B] `RC-001-01` — 425-leaf baseline deferred as an expected-inventory fixture outside this leaf's locked scope.
- [x] CHK-025 [P1] `RC-001-02` — census correction applied; `system-code-graph` is not in the covered set and is not flagged.
- [x] CHK-026 [P1] `RC-001-03` — `mcp-code-mode` applicability ruling recorded as deferred/not applicable at HEAD.
- [x] CHK-027 [P1] `RC-003-03` — feature-leaf definition ruled and recorded; `003` can act on the 94 orphans.
- [x] CHK-028 [P1] `RC-007-07` — struck at HEAD with rationale; no README/package change, catalog applicability ruled.
- [x] CHK-029 [P1] `RC-008-02` is NOT reopened. It was refuted at iteration 9 and confirmed repaired at HEAD. Do not resurrect.
- [x] CHK-030 [P1] The blast-radius baseline is unchanged by this phase: still 104 orphans, 0 dangling links. **Evidence:** frozen `26/804/104/0` baseline and logical `26/803/103/0` census are recorded in `tasks.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-031 [P1] The validator reads only repository files and performs no network access.
- [ ] CHK-032 [P1] No fixture embeds a credential, token, or absolute machine-local path.
- [ ] CHK-033 [P1] A relative path resolving outside the repo root is rejected, never followed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-034 [P1] `sk-create-feature-catalog/SKILL.md` documents the covered set and the enforced rule roster.
- [x] CHK-035 [P1] The two asset templates carry the ruled amendments and no longer leave Q2 or the feature-leaf definition open. **Evidence:** `feature-catalog-template.md` and `feature-catalog-snippet-template.md` contain the amendments.
- [x] CHK-036 [P1] `decision-record.md` records four rulings, each with status, evidence, and consequences.
- [x] CHK-037 [P1] `002` and `003` cite the decision record by path rather than re-deciding.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-038 [P1] Fixtures live under the `sk-create-feature-catalog` package, not scattered in the catalogs they mimic.
- [B] The shared helper lives in `.opencode/skills/sk-doc/shared/scripts/`, not inside one consumer. **Deferred outside this leaf scope.**
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-039 [P1] Baseline captured, delta reported: pre-edit `26/804/104/0`; post-ruling logical census `26/803/103/0`, with
      the one-leaf delta caused solely by case-insensitive ClickUp root classification; full validator output is
      `1163` violations (`565` fail, `598` warn).
- [ ] CHK-040 [P1] Every new violation surfaced by the widened corpus is explained, not merely counted.
- [ ] CHK-041 [P1] Every OPERATOR-DECISION item is either resolved or carries a recorded deferral.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-042 [P1] Coverage is derived, not enumerated, so it cannot silently narrow again.
- [ ] CHK-043 [P1] Severity is data, not code, so a package can be demoted without a code change.
- [ ] CHK-044 [P1] The three consumers of the count-derivation helper share one definition.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-045 [P1] Full-corpus run time measured over 26 packages and the frozen 804-leaf baseline and recorded: `real 1.66`.
- [ ] CHK-046 [P1] The pre-push question in Q4 is answered against that measurement, not against a guess; caller wiring is deferred.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-047 [P1] Every existing caller of the validator still works after the exit-code inversion.
- [ ] CHK-048 [P1] CI on `skilled/v*` wired at the ruled severity and observed green on a clean tree.
- [ ] CHK-049 [P1] The `/doctor` route runs locally and reports the same result as CI.
- [ ] CHK-050 [P1] Rollback path proven: demoting one package to `warn` turns a red run green without a code change.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-051 [P1] Scope lock held: no catalog content file was modified by this phase. **Evidence:** `git diff --name-only` contains no live catalog content path.
- [x] CHK-052 [P1] Comment hygiene held: no ephemeral artifact labels in code comments. **Evidence:** `validate_catalog_package.py` comment scan returned no forbidden markers.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-053 [P1] The standard's eight rules are each mapped to either an enforced check or a recorded reason for staying manual.
- [ ] CHK-054 [P1] The gap between the standard and the enforcement surface is stated explicitly rather than implied.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-055 [P1] Operator sign-off on the four rulings.
- [ ] CHK-056 [P1] Operator sign-off on the gate point and severity.
<!-- /ANCHOR:sign-off -->
