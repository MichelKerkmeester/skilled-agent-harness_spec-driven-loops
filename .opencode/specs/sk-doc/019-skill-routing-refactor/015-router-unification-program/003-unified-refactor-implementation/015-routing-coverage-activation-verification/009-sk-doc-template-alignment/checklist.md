---
title: "Checklist: sk-doc Template Alignment"
description: "QA gate for the trigger_phrases claim fix, topology quote-tolerance, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest (Planned; not yet verified)."
trigger_phrases:
  - "sk-doc template alignment checklist"
  - "lockstep manifest QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative evidence (`review-v1.md` §4, `synthesis-v1.md` §2.7/§6, `verification-v1.md`) was read before authoring this plan.
  - **Evidence**: citations in `spec.md`; all cited `file:line` re-anchored on the SYMBOL at build time (e.g. `feature-catalog-snippet-template.md`'s claim confirmed at its live line 41; `validate_document.py`'s `allowed` set confirmed at its live line ~698, not the originally-cited ~715-745).
- [x] CHK-002 [P0] All planned writes stay inside this child's real target files; no edit to the frozen scorer trio is planned.
  - **Evidence**: `spec.md` Files to Change table lists only template/validator/manifest/test targets; `git status` after the full diff shows only the 9 intended files/dirs touched, none of them the frozen scorer trio (see CHK-041).
- [x] CHK-003 [P1] `.opencode/skills/sk-doc/scripts/validate_document.py`'s symlink relationship to `shared/scripts/validate_document.py` is confirmed before editing.
  - **Evidence**: `ls -la .opencode/skills/sk-doc/scripts/validate_document.py` confirms it is a symlink to `../shared/scripts/validate_document.py`; only the shared copy was edited.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_catalog_package.py` has zero new external dependencies beyond the Python standard library and existing sk-doc validator conventions.
  - **Evidence**: imports are `argparse, json, re, sys, pathlib, typing` (stdlib) plus `load_template_rules`/`validate_feature_catalog_table` from `validate_document.py` and `CATALOG_ROOT_NAMES` from `naming_root_resolver.py` (existing sk-doc modules, same `sys.path.insert` cross-directory import convention as `create-skill/scripts/package_skill.py`).
- [x] CHK-011 [P0] The topology validator's quote-tolerance change does not alter parsed output for any previously-passing unquoted fixture.
  - **Evidence**: `git stash` A/B run of `validate-playbook-topology.cjs --strict` against sk-doc's own live 31-scenario `manual-testing-playbook/` corpus (100% unquoted) reports `valid=31 blocked=0 total=31` both before and after the edit — byte-identical outcome.
- [x] CHK-012 [P1] `compiled-routing-lockstep-surfaces.json` follows a documented, versioned schema (not an ad hoc shape).
  - **Evidence**: the manifest carries `schemaVersion: 1`, a `description`, `directiveMarker`, `hubNamePlaceholder`, `notes`, and a `surfaces[]` array of `{id, kind, hubName, path}` records; all 9 `path` values resolve to real files (verified with a script existence check).

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The strict package validator's bijection check has both a positive fixture (clean 7-hub set) and a negative fixture (seeded orphan).
  - **Evidence**: `test_validate_catalog_package.py` (new, `sk-doc/scripts/tests/`) — 12/12 PASS, covering a clean 2-package (advisor-central + 1 fake hub) fixture at zero violations, plus seeded `missing_leaf_file`, `orphan_leaf_file`, `missing_source_path`, `off_taxonomy_validation_type`, and `missing_root_catalog` cases each caught exactly once and named by package/path.
- [x] CHK-021 [P0] The lockstep-parity test fails by naming the specific drifted surface, not a generic diff.
  - **Evidence**: `compiled-routing-lockstep-parity.test.cjs`'s `testSeededDriftIsCaughtByNamingTheDriftedSurface` seeds a 1-of-3 wording drift and asserts exactly 1 violation naming `hub-skill.fixture-hub-c` specifically, not the other two in-sync surfaces.
- [x] CHK-022 [P0] The 12-value taxonomy has zero unmapped stragglers against the fresh corpus census.
  - **Evidence**: `validate_catalog_package.py`'s taxonomy check, run against the full live 8-package corpus (all leaf files under all populated `feature-catalog/` trees), reports zero `off_taxonomy_validation_type` violations — every live Type-column value already resolves to the 12-value canonical set.
- [ ] CHK-023 [P1] The harvester-extension invariance test (if shipped) proves zero score/rank change for existing harvested docs.
  - **Not shipped.** REQ-006/T013/T014 explicitly deferred — see `tasks.md` Phase 3 evidence; `doc-frontmatter.ts` is advisor code, named out of scope for this child by the build directive.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] No sk-doc catalog template claims trigger_phrases drives routing unless the harvester extension (REQ-006) has actually shipped.
  - **Evidence**: `grep -n "drives skill-advisor routing" feature-catalog-snippet-template.md feature-catalog-template.md` returns no hit (exit 1). The corrected comment states the true scope (H3-heading match) and names the surfaces the harvester actually scans.
- [x] CHK-031 [P0] The topology validator accepts quoted and unquoted typed-gold fixtures identically.
  - **Evidence**: `validate-playbook-topology.test.cjs` — 3/3 PASS, including an explicit assertion that quoted scalars parse with zero leftover quote characters and match the unquoted fixture's structured output field-for-field.
- [x] CHK-032 [P0] The strict package validator and the lockstep manifest are both present and internally consistent with the live corpus at completion time.
  - **Evidence**: `validate_catalog_package.py` ran clean against the real `.opencode/skills` tree (report mode) and returned 5 genuine, pre-existing `missing_source_path` findings (stale doc references, none introduced by this child) with zero bijection or taxonomy violations; `compiled-routing-lockstep-surfaces.json`'s 9 paths all resolve to real files.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing file, manifest, or `selectedPolicy` is touched by any change in this child.
  - **Evidence**: `git status` diff scoped to this child's 9 touched paths contains no `hub-router.json`, `mode-registry.json`, or activation/serving-authority file — only sk-doc template/validator/manifest/test surfaces.
- [x] CHK-041 [P0] The shared benchmark scorer is untouched; digests unchanged pre/post.
  - **Evidence**: `shasum -a 256` on `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` before any edit and again after the full diff — identical digests both times (`d5e13daf3e...`, `d5a9cc72ec...`, `5029f22df9...`).
- [x] CHK-042 [P1] No network, package install, credential, or dynamic-code surface is introduced by `validate_catalog_package.py` or the new test.
  - **Evidence**: the new validator and tests use only file reads (`Path.read_text`/`fs.readFileSync`), regex, and stdlib JSON — no `subprocess`, `eval`, `exec`, `fetch`, `require('child_process')`, or credential handling anywhere in the new code.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on status and the P0/P1 requirement split.
  - **Evidence**: `spec.md` Status updated to `Complete (P0 delivered; P1 REQ-005 delivered, REQ-006 deferred)`; `implementation-summary.md` Status updated to match; `tasks.md`/`checklist.md` mark exactly the items with real evidence, leaving T013/T014/CHK-023 (REQ-006) explicitly unchecked with a deferral note rather than silently completing them.
- [x] CHK-051 [P1] No file in this packet claims work is done that has not been done; every unfinished item stays unchecked.
  - **Evidence**: REQ-006 (P1 harvester extension) is the one requirement not implemented; it is marked unchecked everywhere (`tasks.md` T013/T014, this checklist's CHK-023) with the same deferral reason, not marked complete anywhere.
- [ ] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Not fully green.** `validate.sh --strict` reports `Errors: 0, Warnings: 2` (exit 2). Both warnings (`FRONTMATTER_VALID`, `FRONTMATTER_MEMORY_BLOCK`) trace to this packet's originally-authored `spec.md`/`plan.md`/`tasks.md` frontmatter content, untouched by this child's diff (confirmed via `git status` — none of the 5 spec docs' frontmatter blocks were edited by this session beyond body/status text). Sibling `002-runtime-promotion-and-status-foundation` (already implemented and committed) also returns `RESULT: FAILED` under `--strict` with 0 errors, suggesting this is a pre-existing program-wide pattern rather than something introduced here. Left unchecked rather than claimed clean.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All five spec docs for this child live under `009-sk-doc-template-alignment/`; nothing was written outside it (or outside the sibling `008`/`010` folders in this same authoring pass).
  - **Evidence**: this build session wrote only code/template/test files under `sk-doc/create-feature-catalog/`, `sk-doc/create-skill/`, `sk-doc/shared/scripts/`, and `sk-doc/scripts/tests/`, plus this child's own 5 spec docs — no other spec folder was touched.
- [x] CHK-061 [P1] Real implementation targets (`feature-catalog-snippet-template.md`, `validate_document.py`, etc.) are named by their actual repo path, not an invented path.
  - **Evidence**: every path in `spec.md`'s Files to Change table was confirmed to exist (or, for new files, to be created under an existing sibling directory) before editing; `compiled-routing-lockstep-surfaces.json`'s 9 registered paths were existence-checked programmatically.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 12/13 (CHK-052 not fully green — see evidence) |
| P1 Items | 7 | 6/7 (CHK-023/REQ-006 explicitly deferred) |
| P2 Items | 0 | 0/0 |

**Verification Date**: Implementation and verification completed this session (worktree `0089-sk-doc-default-routing-cutover`, uncommitted).
**Verification Scope**: This checklist covers the trigger_phrases claim fix, the topology quote-tolerance fix, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest with its parity test.
**Completion Boundary**: REQ-001 through REQ-005 and REQ-004's manifest/parity infrastructure are implemented and verified with evidence above. REQ-006 (P1 harvester extension in `system-skill-advisor`'s `doc-frontmatter.ts`) is explicitly deferred — out of scope per the build directive ("do NOT touch the advisor/benchmark/sk-code/activation code"), consistent with `spec.md` §7's own open question about whether it belongs to this child at all. `validate.sh --strict` is not fully green (CHK-052) due to pre-existing frontmatter warnings in this packet's originally-authored docs, unrelated to this session's diff.

<!-- /ANCHOR:summary -->
