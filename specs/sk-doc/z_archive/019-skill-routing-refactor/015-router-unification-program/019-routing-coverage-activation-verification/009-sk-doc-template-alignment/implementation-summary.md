---
title: "Implementation Summary: sk-doc Template Alignment"
description: "Planning-time record (Status: Planned) of the trigger_phrases claim fix, topology quote-tolerance, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest. No code has been written yet; this document will be updated with delivery evidence once implementation completes."
trigger_phrases:
  - "sk-doc template alignment implementation summary"
  - "lockstep manifest planned summary"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — P0 (REQ-001..REQ-004) and P1 REQ-005 delivered; P1 REQ-006 explicitly deferred (out of scope per build directive) |
| **Authored** | 2026-07-20 |
| **Implemented** | 2026-07-21 (worktree `0089-sk-doc-default-routing-cutover`, uncommitted) |
| **Level** | 2 |
| **Serving authority** | Unaffected — this child changed no manifest, no `selectedPolicy`, and no routing decision |
| **Strict validation** | `validate.sh --strict` on this folder: Errors: 0, Warnings: 2 (exit 2). Both warnings are pre-existing in this packet's originally-authored frontmatter, untouched by this implementation session; sibling `002` (already shipped) shows the same FAILED-with-0-errors pattern under `--strict`. |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Corrected sk-doc catalog and playbook templates: the false trigger_phrases-drives-routing claim removed from `feature-catalog-snippet-template.md`, a quote-tolerant topology validator with one documented canonical serialization, a 12-value canonical test-type taxonomy replacing the stale 2-value documented set (the code-level canonical list already existed in `template-rules.json`; this child aligned the template's documented line and `validate_document.py`'s fallback default to match it), a new strict package validator proving catalog-set bijection/path-existence/taxonomy conformance, and a P4 lockstep directive-surface manifest naming all 9 surfaces (7 hub SKILL.md + 2 create-skill parent templates) with a normalized-parity fixture test. None of this changed a routing decision. REQ-006 (P1, extending `system-skill-advisor`'s harvester) was explicitly deferred as out of scope.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Doc-truth (REQ-001) | `feature-catalog-snippet-template.md` (modified) | Removed the false trigger_phrases-drives-routing claim; `feature-catalog-template.md` swept, no equivalent wording found |
| Quote-tolerance (REQ-002) | `validate-playbook-topology.cjs` (modified) | Quote-tolerant `expected_workflow_mode`, `full_inventory_intent`, and typed-gold pair parsing; canonical serialization documented in a code comment |
| Quote-tolerance test (T005) | `validate-playbook-topology.test.cjs` (new) | Quoted/unquoted parity fixtures, multi-mode union, quote-stripping regression guard |
| Taxonomy (REQ-005) | `validate_document.py` (modified), `feature-catalog-snippet-template.md` (modified), `feature-catalog-template.md` (modified) | 12-value canonical `allowed` set (fallback default + stale-comment fix); template's Type-column line and scaffold placeholder updated to match |
| Package validator (REQ-003) | `validate_catalog_package.py` (new) | Bijection (root-catalog links ↔ leaf files, both directions) + SOURCE FILES path existence + Type-column taxonomy conformance, across router/advisor-central + the 7 mode hubs |
| Package validator test | `test_validate_catalog_package.py` (new) | 12 fixture assertions: 1 clean-corpus positive, 5 seeded-violation negatives (one per violation class) |
| Lockstep manifest (REQ-004) | `compiled-routing-lockstep-surfaces.json` (new) | The 9-surface P4 rewrite-target manifest (7 hub SKILL.md + 2 create-skill parent templates, the latter registered with no content change) |
| Lockstep parity test (REQ-004) | `compiled-routing-lockstep-parity.test.cjs` (new) | Seeded-fixture parity checks (never the live tree) + a non-asserting informational live report |
| Documentation | `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated with delivery evidence and the resolved Open Questions; `plan.md` unchanged (build followed it as authored) |
| Deferred (REQ-006, P1) | `doc-frontmatter.ts` | Not touched — advisor code, out of scope per build directive |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per `plan.md`, three phases, all executed: (1) setup — removed/corrected the trigger_phrases claim in `feature-catalog-snippet-template.md` (swept `feature-catalog-template.md`, found no equivalent wording), made the topology validator quote-tolerant, added quoted/unquoted fixtures; (2) implementation — confirmed the live corpus's Type-column taxonomy was already a curated 12-value canonical set in `template-rules.json` (committed 2026-07-06, predating this child) rather than needing a from-scratch census, wired `validate_document.py` and the template to match it, authored the strict package validator, authored the lockstep manifest and its parity test; (3) verification — the P1 harvester-extension stretch was explicitly deferred (out of scope per build directive) rather than shipped, then a frozen-scorer re-hash and `validate.sh --strict` were run on this folder. Every phase was additive or a doc-truth correction; no rollback was needed, and none would require more than a plain file revert if one were.

**One deviation from the plan's exact task sequence, recorded per this repo's brief-intent-over-letter convention**: T006 ("run a fresh census of the live corpus's SOURCE FILES Type-column values") was satisfied by discovering and confirming the ALREADY-EXISTING curated 12-value set in `template-rules.json`, rather than performing an independent from-scratch census. This is the same 12-value list REQ-005 needed to produce; re-deriving it from raw corpus strings would have risked a second, competing taxonomy (violating NFR-A01's single-source-of-truth requirement) instead of aligning with the one already live in the code. `validate_catalog_package.py`'s taxonomy check, run against the full live corpus, independently confirms this list already accounts for 100% of observed Type values (zero off-taxonomy findings).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Split CF-TPL-2 into a P0 "remove the false claim" and a P1 "extend the harvester to make it true" | The removal is the cheapest correct fix and ships independently; extending the harvester is a larger, separately-gated change to a different skill's code (`system-skill-advisor`) |
| Taxonomy census (REQ-005) runs before the 12-value list is finalized | Fabricating 12 labels without checking the live corpus would just relocate the "de-facto stale" problem the finding describes |
| New standalone `validate_catalog_package.py` rather than folding bijection logic into `validate_document.py` | The bijection check is cross-file (comparing multiple catalogs against the 7-hub set), while `validate_document.py` is single-file scoped; kept as an Open Question in `spec.md` §7 pending a build-time look at how much state-sharing is actually needed |
| Lockstep manifest ships before 011 or 013 exist | A concrete, testable manifest is more useful to 011's eventual design than prose describing "7 SKILL.md directives"; the parity test is written to compare current wording, not to assume 013's not-yet-authored literal text |
| The parity test's pass/fail assertions run only against synthetic temp-directory fixtures, never the live 9 surfaces | A live-tree comparison would have made this test fail on discovery, before any seeding: `sk-code/SKILL.md`'s directive prose already diverges from the other 6 hubs in 3 places (pre-existing, out of scope — `sk-code` is explicitly named off-limits for this child). A non-asserting informational report section still surfaces this finding without turning the file red over out-of-scope drift. |
| REQ-006 deferred rather than partially attempted | The build directive named `system-skill-advisor`/advisor code explicitly out of scope; attempting even a minimal harvester change would have crossed that boundary. This also resolves `spec.md` §7's own open question about whether REQ-006 belongs to this child at all. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks below were run this session; results are evidenced, not assumed:

1. **No catalog template claims trigger_phrases drives routing** — `grep -n "drives skill-advisor routing" feature-catalog-snippet-template.md feature-catalog-template.md` returns no hit. PASS.
2. **Topology validator's quoted and unquoted fixtures parse to identical output** — `validate-playbook-topology.test.cjs`, 3/3 PASS; a `git stash` A/B run against sk-doc's real 31-scenario playbook corpus shows `valid=31 blocked=0` unchanged before/after. PASS.
3. **Strict package validator reports zero violations on a clean corpus and fails each seeded violation class by name** — `test_validate_catalog_package.py`, 12/12 PASS (1 clean positive + 5 seeded negatives: missing-leaf, orphan-leaf, missing-source-path, off-taxonomy, missing-root-catalog, each named). A live run against the real repo found 5 genuine, pre-existing, out-of-scope stale-path findings and zero bijection/taxonomy violations. PASS.
4. **Lockstep-parity test passes clean and fails on a seeded drift by naming the drifted surface** — `compiled-routing-lockstep-parity.test.cjs`, 4/4 seeded-fixture assertions PASS; its non-asserting live report additionally found a real pre-existing drift on `sk-code`'s SKILL.md (informational only, correctly not turning the suite red). PASS.
5. **12-value taxonomy accounts for 100% of the live corpus with zero unmapped stragglers** — `validate_catalog_package.py`'s taxonomy check across the full live 8-package corpus returns zero `off_taxonomy_validation_type` violations. PASS.
6. **Frozen-scorer SHA-256 digests unchanged pre/post** — `shasum -a 256` before any edit and after the full diff: identical for all three files. PASS.
7. **`validate.sh --strict` on this folder reports Errors: 0** — TRUE (Errors: 0), but 2 pre-existing frontmatter warnings (untouched by this session, present in the originally-authored docs) push the overall `--strict` exit code to 2/FAILED. Sibling `002` (already shipped) shows the same 0-errors-but-FAILED pattern under `--strict`. PARTIAL — see `checklist.md` CHK-052.
8. **`git status` shows only intended files, no frozen scorer, no deletions** — confirmed: exactly the 9 files/dirs in "Files Delivered" above, isolated from a substantial amount of concurrent, unrelated uncommitted activity from other sessions in this shared worktree (sibling `006-feature-catalogs` populating hub catalogs, and other in-flight work). PASS.
9. **No ephemeral-artifact-id comments in new/changed code** — grep for `REQ-\d`, `CHK-\d`, `T00\d`, `CF-TPL`, spec-folder paths, and `ADR-\d` across all 9 touched files returns zero hits. PASS.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-006 (P1 harvester extension) is not delivered.** Explicitly deferred, out of scope per the build directive (`doc-frontmatter.ts` is advisor code); confirmed in `spec.md` §7 as belonging to a future `system-skill-advisor` packet, not this child.
2. **`validate.sh --strict` is not fully green on this folder** (Errors: 0, 2 warnings, exit 2). The two warnings trace to this packet's originally-authored frontmatter content from 2026-07-20, not to anything this implementation session changed; a known-good sibling (`002`) shows the same pattern under `--strict`. Not fixed here — out of this child's named scope (spec.md/plan.md/tasks.md frontmatter authoring, not a REQ target).
3. **`validate_catalog_package.py`'s SOURCE FILES path check is best-effort, not exhaustive.** It resolves a bare backtick-wrapped path only when it starts with a recognized top-level repo prefix (`.opencode/`, `.claude/`, `.codex/`), strips a trailing `:LINE-LINE` citation suffix, and follows one embedded markdown link per cell; glob patterns (`*`) and skill-relative shorthand paths without a recognized prefix are left unchecked rather than risking a false positive. This was tuned against the live corpus during verification (started at 31 findings, 26 of which were parser false positives on line-range suffixes, glob patterns, and non-repo-relative shorthand; 5 genuine findings remained).
4. **The strict package validator and lockstep-parity test are shipped as reportable checks, not wired into any blocking gate**, per `spec.md`'s own risk mitigation — the live corpus is not expected to be violation-free yet (5 genuine stale-path findings exist today) and `sk-code`'s SKILL.md carries a real pre-existing directive-wording drift this child does not fix (out of scope; `sk-code` is explicitly named off-limits).

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: complete
    current_focus: "009-sk-doc-template-alignment implemented and verified in worktree 0089-sk-doc-default-routing-cutover (uncommitted): REQ-001..REQ-005 delivered with evidence, REQ-006 explicitly deferred (advisor code, out of scope)"
    next_steps:
      - "Operator/orchestrator to review and commit this child's diff (9 files: 4 modified, 5 new) alongside sibling children in this worktree"
      - "Optional follow-up: sk-code SKILL.md's compiled-routing directive wording drift from the other 6 hubs (found via the new lockstep-parity test's live report; out of scope for this child, sk-code named off-limits)"
      - "Optional follow-up: 5 genuine stale SOURCE FILES paths found by validate_catalog_package.py's live run (out of scope for this child; population/upkeep owned elsewhere)"
      - "REQ-006 (doc-frontmatter.ts harvester extension) remains for a future system-skill-advisor packet, not this one"
    blockers: []
-->
