---
title: "Tasks: Phase 6: evidence-gated-provenance"
description: "The task list for Phase 6: evidence-gated-provenance, each task naming its file. Every task is done and carries the evidence that closed it."
trigger_phrases:
  - "evidence gated provenance tasks"
  - "template version stamping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: evidence-gated-provenance

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace matchesSignature logic in heal-spec-docs.cjs (around line 80) and understand superset checking (at HEAD `matchesSignature` returned `sig.anchors.every(a => have.has(a))` against `TEMPLATE_SIGNATURES`, a fixed list of Level 1 anchors, so any document carrying those anchors plus others was stamped; both are gone after the build)
- [x] T002 Trace the --auto-upgrade branch in check-template-staleness.sh (lines 171-186) and its caller in quality-audit.sh (lines 148-153) (at HEAD the branch ran `sed -i ''` over spec, plan, tasks, acceptance-criteria, goal, decision-record and implementation-summary to bump any old version marker to the current one; the caller ran it under `if $FIX_MODE` with `--root "$folder"` and `2>/dev/null || true`, as spec.md section 2 describes)
- [x] T003 [P] Review MIGRATION.md line 24 and understand the never-invent-history rule (line 24 says legacy markers stay supported indefinitely and line 40 says "Do not rewrite old packets only to normalize marker style"; both lines are unchanged by the build)
- [x] T004 Confirm no other in-repo caller: `rg -n "auto-upgrade" . --glob '!specs/**'` (`git grep -n -- '--auto-upgrade' HEAD` outside specs/ found the script's own parse and usage lines and one call, `quality-audit.sh:152`; no other caller)
- [x] T014 [P] Locate the renderer that yields a level's anchor set (the validator's `renderedTemplate`) for the healer to reuse (`loadTemplateContractForDocument` in `runtime/cli/utils/template-structure.js` returns the required anchors, the optional anchors and the template path for a level and document; the healer imports it. `evaluateTemplateGate` and `renderManifestTemplate` are not exported, so the healer mirrors their gate walk locally)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Retire or restrict decided 2026-10-08 by the operator: retire, with a one-release loud failure
- [x] T006 Change matchesSignature to exact equality against the anchor set rendered for the document's level (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs) (done differently: `matchesSignature` and `TEMPLATE_SIGNATURES` are deleted, and `provenMarker` at `heal-spec-docs.cjs:158` compares the document's anchors with the required plus optional anchors of the level's contract and refuses with a named reason on a superset, a subset, a missing level or an unresolved contract; the stamped header is read from the rendered template, so no fixed header table remains)
- [x] T007 Replace the --auto-upgrade branch with a message "removed, use upgrade-legacy" and exit 2 (.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh) (`check-template-staleness.sh:39` prints "--auto-upgrade was removed, use upgrade-legacy" to stderr and exits 2 while parsing arguments, before any discovery; the `AUTO_UPGRADE` variable and the whole write block are gone, the usage and help text no longer list the flag, and `bash -n` exits 0)
- [x] T015 Remove the dead --fix branch, or point it at upgrade-legacy (.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh) (done differently: the branch and `FIX_MODE` are removed and the flag at `quality-audit.sh:32` now prints "--fix was removed, use upgrade-legacy" and exits 2, so it is neither silently accepted nor repointed; `rg -n "auto-upgrade" quality-audit.sh` finds nothing, rc 1)
- [x] T008 [P] State the never-invent-history rule. Add no marker for unknown provenance (.skilled/skills/system-spec-kit/templates/MIGRATION.md) (new section `## 4. NEVER INVENT PROVENANCE` at `MIGRATION.md:51`; the old section 4, the extension process link, is now section 5; the section says no marker or comment is ever added to record unknown provenance)
- [x] T009 Add tests: exact level match stamps, superset and subset do not, --auto-upgrade exits 2 and writes nothing (`runtime/cli/tests/heal-provenance.vitest.ts`, 4 cases: `--auto-upgrade` refusal at line 118, `--fix` refusal at line 132, exact stamp with superset, subset and level-less refusals at line 146, and a frontmatter-only level at line 187; each fixture is compared by content digest or byte for byte)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run Vitest for heal-spec-docs signature matching tests (from the skill root, `npx vitest run --config vitest.config.ts runtime/cli/tests/heal-provenance.vitest.ts` printed `Tests 4 passed`, rc 0; the build record shows the stamp case failing against the HEAD healer, 1 failed and 2 passed at that point, and passing against the new one; the whole cli suite after wave 2 exits 0 with 167 files passed and 3 skipped, 1,682 tests passed and 19 skipped)
- [x] T011 Run `validate.sh --strict` on this spec packet (prints `RESULT: PASSED` after `repair-derived.cjs --apply`; `check-goal.cjs` passes)
- [x] T012 Grep for every writer of SPECKIT_TEMPLATE_SOURCE and verify none stamps without an exact level match (`rg -n SPECKIT_TEMPLATE_SOURCE` over `runtime/`, minus tests and fixtures, finds two writers that touch an existing document, `heal-spec-docs.cjs:262`, now gated, and the removed `check-template-staleness.sh` bump; the rest build a new document: `create.sh` renders a template and only moves a marker the render already carries (`ensure_template_source_near_top`, lines 907 to 979), `scaffold-debug-delegation.sh:139` copies the marker from its rendered debug template, and `extract-from-evidence.cjs:134` emits a new resource map; every other hit, including `spec-doc-health.ts` and the validator, only reads the marker, and `upgrade-legacy.mjs` has no hit and reaches the marker only through the healer)
- [x] T013 Manual check: trace one markerless and one old-marker document through heal-spec-docs and verify neither gets a marker (traced in a scratch copy under the session scratchpad, removed afterwards: a Level 2 plan with a `plan-core | v1.0` marker and exact anchors stayed byte-identical, and a markerless plan with a subset of the anchors stayed byte-identical; a markerless plan with exactly the level's anchors was named `plan-core | v2.2`, which is the intended exact-match case)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] validate.sh --strict shows no failures (`RESULT: PASSED`)
- [x] Tests pass (heal-provenance.vitest.ts 4 of 4; cli suite exits 0 with 1,682 passed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: Section 8.5 and Section 11 recommendation SH-06 of ../../014-spec-auto-healing-research/research/research.md
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 3 and 4)
- [x] CHK-003 [P1] Code paths in heal-spec-docs.cjs, check-template-staleness.sh and quality-audit.sh traced (T001, T002 and T014)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes linter (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exits 0 and CLI typecheck exits 0 in the wave 2 full gates; `bash -n` exits 0 for `check-template-staleness.sh` and `quality-audit.sh`)
- [x] CHK-011 [P0] No new console.log or debug statements left in (the added lines of the three changed scripts hold no `console.` call, and `heal-provenance.vitest.ts` has none)
- [x] CHK-012 [P1] Changes follow existing code style (the healer keeps its section-banner comments, CommonJS `require` style and `/** */` helper docs; judged from the diff, and the review round raised no style finding)
- [x] CHK-013 [P1] Test additions use Vitest or Bash patterns from existing tests (the file uses `describe`, `it`, `expect`, `spawnSync` and `mkdtemp` fixtures removed in `afterEach`, as the neighbouring cli tests do)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md; all six rows are Met)
- [x] CHK-021 [P0] Level match tests pass (exact, superset and subset cases) (the case at `heal-provenance.vitest.ts:146` stamps the exact plan and leaves the superset, subset and level-less plans byte-identical; `packets=4 documents healed=1`)
- [x] CHK-022 [P1] Retired-flag test passes (message, exit 2, no write) (cases at lines 118 and 132 assert exit 2, the message on stderr and an unchanged content digest of the fixture tree)
- [x] CHK-023 [P1] All document types (spec, plan, tasks, impl-summary) tested (done differently: the Vitest file pins `plan.md` only; at closing, an exact-anchor Level 2 `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` were each traced through the healer in a scratch copy and each was named `spec-core`, `plan-core`, `tasks-core` and `impl-summary-core | v2.2`, while a copy of each with one extra anchor stayed unmarked; the other three types are not pinned by a test, see implementation-summary.md follow-ups)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: class-of-bug (two header writers stamp without exact evidence) (both writers fixed: the healer's superset stamp and the staleness script's version bump)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: rg for SPECKIT_TEMPLATE_SOURCE writers (see T012: no other tool writes or bumps the header on an existing document; the writers that create a new document are outside the invariant)
- [x] CHK-FIX-003 [P0] Consumer inventory: quality-audit.sh, tests, upgrade-legacy.mjs (`quality-audit.sh` no longer references the staleness script; the script's other consumers are two README mentions, `template-version-parity.vitest.ts`, which reads its manifest path and is unchanged, and the new test; `upgrade-legacy.mjs` calls the healer with `--apply` at line 723 and writes no marker itself)
- [x] CHK-FIX-004 [P0] Not a security fix, no adversarial cases needed (not applicable: the change decides when a provenance comment is written, not any path, permission or input boundary)
- [x] CHK-FIX-007 [P1] Evidence pinned: heal-spec-docs.cjs line 80, check-template-staleness.sh line 181, MIGRATION.md line 24 (the cited lines are pre-build positions: the superset check sat at `heal-spec-docs.cjs:80`, the `sed -i ''` bump inside the `*)` arm of `check-template-staleness.sh`, and `MIGRATION.md` lines 24 and 40 still read as before; `git show HEAD:` confirms each)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md section 10 and Files to Change, plan.md Overview, Key Components, Data Flow and Testing now describe the built healer and the `--fix` refusal, and its Definition of Ready and Done boxes are ticked)
- [x] CHK-041 [P1] Inline code comments explain why the comparison uses the level's rendered anchor set (comments in `heal-spec-docs.cjs` say the template contract is the renderer's own account of a level and that a document cannot be named without a recorded level; a third says the gate grammar mirrors `evaluateTemplateGate`)
- [x] CHK-042 [P2] MIGRATION.md clearly states policy (`MIGRATION.md:51` to `55`: a marker is written only on an exact anchor match, an unmatched document keeps no marker, and the two retired flags point to `upgrade-legacy.mjs`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only `.gitkeep`; the Vitest fixtures live under the OS temp directory and are removed in `afterEach`)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---

