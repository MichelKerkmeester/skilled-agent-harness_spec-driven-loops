---
title: "Verification Checklist: Skill Root Metadata JSON Unification"
description: "Verification record for the class contract, fleet gate, canonical doctrine, consumer wiring and sk-git remediation, with the observed result of each command."
trigger_phrases:
  - "skill metadata unification checklist"
  - "fleet class gate verification"
importance_tier: "normal"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-27T20:31:30Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded observed results for every verification item"
    next_safe_action: "None; verification complete"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: Skill Root Metadata JSON Unification

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item records the command run and the result observed, not the result expected. An item without an observed result is not checked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Research converged before implementation began — 5/10 iterations, 5/5 questions answered, stop reason `converged`
- [x] CHK-002 [P1] Operator directive resolved before design — uniformity per documented class, scope limited to root-level JSON [evidence: operator selected "Uniform per class, documented" and scope "All root-level skill JSONs" at the pre-build question]
- [x] CHK-003 [P1] Root cause confirmed against source, not inferred — all three gates verified presence-conditional at file:line [evidence: parent-skill-check.cjs:237-238 single-target, :1067-1070 opt-in leaf block, ci-leaf-manifest-freshness.cjs:11 walks committed manifests]
- [x] CHK-004 [P1] Baseline captured before any change — 12 roots, 12 distinct shapes, `sk-git` sparsest
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Pure library does no filesystem access — `skill-root-metadata-contract.cjs` imports nothing but its own constants
- [x] CHK-006 [P1] Classification consults no generated file — `testClassificationIgnoresGeneratedOutput` asserts a manifest's presence does not change the class
- [x] CHK-007 [P1] The two consumers share one judgment rather than re-deriving it — `parent-skill-check.cjs` rule 11 requires the same library the fleet gate uses
- [x] CHK-008 [P1] Comment hygiene — no spec paths, packet numbers, or ADR/REQ/task ids in any authored code comment [evidence: `grep -cE "ADR-[0-9]|REQ-[0-9]|CHK-[0-9]|\.opencode/specs/"` returns 0 on all 3 new code files]
- [x] CHK-009 [P1] House conventions followed — banner headers, numbered sections, and the existing pure-library / CLI-wrapper split [evidence: `skill-root-metadata-contract.cjs` mirrors the banner and numbered-section layout of `leaf-resource-contract.cjs`; pure-lib / CLI-wrapper split preserved]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Contract + gate suite passes — `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`, 21 tests
- [x] CHK-011 [P0] Fleet assertions are load-bearing, not vacuous — mutation 1 (remove `sk-git` config) fails with `sk-git: class S requires leaf-manifest.config.json`; mutation 2 (plant `leaf-manifest.config.json` on `sk-doc`) fails with `class H forbids leaf-manifest.config.json`
- [x] CHK-012 [P0] Negative cases covered — XOR declaration, missing authored file, missing generated file, forbidden-per-class, overlay misuse, nested identity, stale bytes, non-zero exit [evidence: 21 named tests in `skill-root-metadata-contract.test.cjs` sections 3-6]
- [x] CHK-013 [P0] Same-named continuity metadata is correctly ignored — `testGateIgnoresSameNamedContinuityMetadata` passes
- [x] CHK-014 [P0] `--fix` scope proven — `testFixNeverWritesAuthoredFiles` and `testFixDoesNotTouchHubAliases` pass
- [x] CHK-015 [P0] Alias projection deterministic — two invocations byte-identical [evidence: `testAliasProjectionIsDeterministicAndSetPreserving` asserts `Buffer.compare(first, second) === 0`]
- [x] CHK-016 [P0] Existing suites still pass — create-skill 5/5, doctor 1/1, the latter deterministic across 3 re-runs
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-017 [P0] Fleet gate exits 0 — `checked=12 passed=12 failed=0`
- [x] CHK-018 [P0] Idempotent — re-run reports `fixed=0`
- [x] CHK-019 [P0] `sk-git` conforms — one authored file added, manifest (65 leaves) and aliases derived
- [x] CHK-020 [P0] Existing freshness gate green and now covering 12 manifests — `checked=12 fresh=12 failed=0` (previously 11)
- [x] CHK-021 [P0] All 7 hubs pass the new per-hub rule — `11a-class` PASS on each
- [x] CHK-022 [P0] XOR half-declaration now rejected — synthetic root fails package validation with the partial-declaration message [evidence: synthetic halfhub root returns `skill-root-metadata-contract: FAIL (exit 1)` with the partial-declaration message]
- [x] CHK-023 [P0] The two rewritten alias files verified set-identical — 48→48 and 7→7 rows [evidence: sorted-key set comparison returned true for both files, 48/48 and 7/7 rows]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] No credential, token, or network surface introduced — the gate reads and writes local JSON only [evidence: `require` list at ci-skill-root-metadata.cjs:49-53 is fs, path and two local libraries only]
- [x] CHK-025 [P0] Write scope bounded — `--fix` writes only `leaf-manifest.json` and, for standalone roots, `leaf-aliases.json`; every other file is reported and never written
- [x] CHK-026 [P0] The spec tree is never scanned — discovery is limited to direct children of the skills directory [evidence: discovery is `fs.readdirSync(skillsDir)` at ci-skill-root-metadata.cjs:80, direct children only]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] Canonical contract exists — `references/shared/skill-root-metadata-contract.md`
- [x] CHK-028 [P1] No doc restates the per-class table — every other touched doc carries a pointer only [evidence: `grep -rl leaf-manifest.config.json *.md` under create-skill returns only the canonical doc plus one SKILL.md pointer sentence]
- [x] CHK-029 [P1] The two-schema distinction is stated explicitly in the canonical doc [evidence: "never the same file" blockquote in `skill-root-metadata-contract.md` section 1]
- [x] CHK-030 [P1] Violation codes documented with their remediation [evidence: 8/8 violation-code rows present in `skill-root-metadata-contract.md` section 5, one per code the gate emits]
- [x] CHK-031 [P1] `create-skill/SKILL.md` covers both shapes — standalone authors one config; hub confirms class H
- [x] CHK-032 [P1] The ADR-004 deviation from the research report is recorded, not silently applied [evidence: ADR-004 in `decision-record.md` states the deviation, the measurement table and why]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-033 [P1] Pure library in `scripts/lib/` beside its sibling contract
- [x] CHK-034 [P1] Fleet gate in `scripts/` beside the freshness gate it fronts
- [x] CHK-035 [P1] Test in `scripts/tests/` following the assert-based house pattern
- [x] CHK-036 [P1] Canonical doc in `references/shared/`, the correct tier for cross-workflow doctrine
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Class gate | `ci-skill-root-metadata.cjs` | `checked=12 passed=12 failed=0` |
| Idempotence | `ci-skill-root-metadata.cjs --fix` (second pass) | `fixed=0` |
| Contract + gate tests | `tests/skill-root-metadata-contract.test.cjs` | passed, 21 tests |
| Freshness gate | `ci-leaf-manifest-freshness.cjs` | `checked=12 fresh=12 failed=0` |
| create-skill suite | `scripts/tests/*.test.cjs` | 5/5 pass |
| Doctor suite | `doctor/scripts/tests/*.test.cjs` | pass, 3/3 deterministic |
| Per-hub rule | `parent-skill-check.cjs` × 7 hubs | `11a-class` PASS on all 7 |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-037 [P1] The class judgment has exactly one implementation, shared by all consumers [evidence: both `ci-skill-root-metadata.cjs` and `parent-skill-check.cjs` rule 11 require `skill-root-metadata-contract.cjs`]
- [x] CHK-038 [P1] Classification depends only on an authored declaration, so a freshly scaffolded root is classifiable and therefore checkable [evidence: `testClassificationIgnoresGeneratedOutput` proves a manifest does not change the class]
- [x] CHK-039 [P1] The gate can report a file that was never written — the specific failure mode that made the original drift invisible [evidence: baseline run reported `sk-git` MISSING_GENERATED_FILE before any file existed there]
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Fleet gate stays fast enough for the existing doctor and CI paths — 12 roots evaluated per run with no new timeout budget requested (NFR-P01) [evidence: 12 roots per run, no timeout budget requested by the doctor route entry in `_routes.yaml`]
- [x] CHK-111 [P1] Generated output is byte-reproducible, so freshness comparison is a constant-cost byte compare rather than a semantic diff (NFR-R01) [evidence: `canonicalManifestBytes` plus sorted alias projection; freshness is `Buffer.compare`]
- [x] CHK-112 [P2] No load testing required — the gate is a bounded local filesystem walk over 12 direct children, not a service
- [x] CHK-113 [P2] Cost characteristic documented: one manifest regeneration per class-required root, reusing the existing generator
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Every change is additive or revertible; rollback steps recorded per change in `plan.md` §7
- [x] CHK-121 [P0] No feature flag needed — the gate is additive and no existing gate changes behaviour on a previously-conforming root [evidence: 11/11 previously-conforming roots returned identical results from both pre-existing gates]
- [x] CHK-122 [P1] Surfaced through the existing doctor route rather than a new monitoring surface [evidence: added to the `parent-skill` target `script_invocations` in `_routes.yaml`]
- [x] CHK-123 [P1] Remediation is documented per violation code in the canonical contract doc [evidence: `skill-root-metadata-contract.md` section 5 pairs each of the 8 codes with its remediation]
- [x] CHK-124 [P2] The new doctor route entry runs the fleet gate before the per-hub audit, matching the documented rationale
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Write scope reviewed — `--fix` writes only derivable files; authored files are reported, never written
- [x] CHK-131 [P1] No new dependency introduced; the gate reuses the existing generator and contract library [evidence: `require` list at ci-skill-root-metadata.cjs:49-53 adds no package dependency]
- [x] CHK-132 [P2] No network, credential, or user-input surface exists in the added code, so the injection and secrets classes do not apply
- [x] CHK-133 [P2] Data handling bounded to local JSON under `.opencode/skills/`; the spec tree is never read
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — spec, plan, tasks, checklist, decision-record and implementation-summary agree on Complete status and the same evidence [evidence: `validate.sh --strict` reports STATUS_CROSS_DOC_CONSISTENCY pass and Errors: 0]
- [x] CHK-141 [P1] The contract surface is documented at field level, including every violation code and its remediation [evidence: `skill-root-metadata-contract.md` documents all 8 files, both classes and all 8 violation codes]
- [x] CHK-142 [P2] Maintainer-facing docs updated — `create-skill/SKILL.md` covers both shapes, `scripts/README.md` documents the run order
- [x] CHK-143 [P2] Knowledge transfer captured — ADR-004 records why the implementation deviates from the research report
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Status | Evidence |
|---|---|---|
| Implementation | Complete | 12/12 fleet conformance, idempotent |
| Verification | Complete | Every gate in `plan.md` §2 run, results recorded above |
| Documentation | Complete | Canonical doc plus pointers; no restatement |
| Operator acceptance | Pending | Worktree not merged; merge is an operator decision |
<!-- /ANCHOR:sign-off -->

---
