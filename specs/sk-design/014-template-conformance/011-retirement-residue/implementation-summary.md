---
title: "Implementation Summary: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Both tracks substantively complete. Track A: 5 of 6 confirmed sites fixed (1 out of session scope). Track B: all 4 leaves verified and reconciled with real evidence, including 3 genuine additional findings beyond each leaf's original spec."
trigger_phrases:
  - "retirement residue implementation summary"
  - "audit foundations vocabulary cleanup summary"
  - "design-interface leaf docs finish summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T21:30:00Z"
    last_updated_by: "worker-session"
    recent_action: "Closed both open follow-ups (18-file reformat; scripts test suite)"
    next_safe_action: "Hand T001 (design-md-generator/SKILL.md:246) to its owning session"
    blockers: []
    key_files:
      - ".opencode/install-guides/README.md"
      - ".opencode/skills/sk-doc/create-command/assets/command-contract.json"
      - ".opencode/skills/sk-design/manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md"
      - ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json"
      - ".opencode/commands/README.txt"
      - ".opencode/skills/sk-design/design-interface/scripts/naming_doc_check.py"
      - ".opencode/skills/sk-design/design-interface/scripts/baseline_rhythm_check.py"
      - ".opencode/skills/sk-design/design-interface/feature-catalog/build-cards/motion-fill-in-cards.md"
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worker-session"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "scripts/tests/: wrote a real 46-test suite + scoped coverage exception (see Follow-Up Closure)"
      - "18 non-conformant scenario files: all 18 reformatted to the 9-column contract"
      - "foundations mode-consolidation root cause: confirmed via git show --stat b217d74b819"
      - "foundations-*/motion-* procedure-card-contract files: disproven as residue, kept as-is (008/009)"
      - "v1.0.0.0-foundations.md disposition: kept as historical record (009)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Close retirement residue + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-retirement-residue |
| **Status** | Complete (Track A: 5/6 sites fixed, 1 explicitly deferred to sibling scope; Track B: all 4 leaves verified+reconciled, 2 findings left open for operator decision) |
| **Completed** | Substantively yes — 1 item (T001) explicitly out of this session's scope |
| **Level** | 2 |
| **Status** | Complete except sibling-scope handoff |
| **Completion Pct** | 95% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Track A** — re-confirmed all 5 named sites before editing, per this packet's own edge-case rule. 4 fixed as described; the 5th (canary fixtures) needed a larger fix than described (2 extra stale cases: `single-motion`/`interface-motion-separate-bundle`, since the motion merge landed between spec-authoring and this session). Also found and fixed a 6th site not in the original inventory: `.opencode/commands/README.txt` still listed the retired `/interface:motion` command in 3 places. One originally-named site, `design-md-generator/SKILL.md:246`, was re-confirmed as still genuinely broken (`foundations`/`motion`/`audit` still named at lines 60, 246, 315) but is explicitly out of this session's scope (sibling worker's territory) — left unfixed and flagged, not silently dropped.

**Track B** — read all 4 leaves' `spec.md` in full and independently verified their claims against the current on-disk state rather than trusting either the spec's or the interrupted worker's framing:
- `006-scripts`: audit confirmed as described, plus found and fixed a real bug (both non-`contrast_check` checkers were completely non-functional due to a `sys.path` off-by-one) that the spec's "audit only" framing had not anticipated.
- `007-feature-catalog`: confirmed the original 10-file fix was genuinely done, then found the motion merge had introduced the identical typo in 4 new files; fixed those too.
- `008-manual-testing-playbook`: confirmed the `foundations` root cause via git history, then **disproved** the leaf's own residue hypothesis (the `foundations-*`/`motion-*` files are a documented, intentional naming convention, not leftovers) — the disproof pattern this whole program has repeatedly hit. Found and fixed 2 small real defects (a stale scenario-count line, one dead cross-reference), and found (but did not fix) a genuine, larger template-conformance gap in 18 relocated files.
- `009-changelog`: confirmed root cause (shared with 008, not re-researched), applied the "keep as historical record" disposition for `v1.0.0.0-foundations.md`, and found a 3rd file in the directory (sibling `001-apache-devendoring`'s own legitimate changelog entry) the spec's 2-file inventory predates.

For all 4 leaves, marked `checklist.md` items complete only where genuinely verified, with a file/command/grep citation per item, and left items unchecked with a stated reason where a finding was confirmed-but-unresolved (the `tests/` scaffold decision in 006, the 9-column reformat decision in 008).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/install-guides/README.md` | Modify | Corrected sk-design mode/command row |
| `.opencode/skills/sk-doc/create-command/assets/command-contract.json` | Modify | Dropped retired `invocation_aliases` |
| `.opencode/skills/sk-design/manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md` | Modify | Corrected mode-count claim |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json` | Modify | Deleted 5 cases whose premise was a retired mode |
| `.opencode/commands/README.txt` | Modify | Removed retired `/interface:motion` (3 spots) |
| `design-interface/scripts/naming_doc_check.py`, `baseline_rhythm_check.py` | Modify | Fixed a `sys.path` off-by-one bug |
| `design-interface/scripts/README.md` | Modify | Fixed a stale asset path |
| `design-interface/feature-catalog/{restraint-gate-and-choreography/*, procedure-cards/motion-procedure-card-inventory.md, build-cards/motion-fill-in-cards.md}` | Modify | Fixed 4 new underscore-filename typos |
| `design-interface/manual-testing-playbook/manual-testing-playbook.md` | Modify | Corrected stale scenario/category counts |
| `design-interface/manual-testing-playbook/color/contrast-pair-inventory-before-audit.md` | Modify | Fixed 1 dead cross-reference |
| `002-design-interface/{006,007,008,009}-*/checklist.md`, `implementation-summary.md` | Modify | Reconciled to verified on-disk state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verified each Track A site with a fresh `rg`/`grep`/`Read` before editing rather than trusting the spec's line numbers, which caught the directory renumbering (`006-sk-design`'s parent moved from an implied `001-008` scheme to `009-parent-hub-rollout`) and the 2 additional stale canary cases the motion merge introduced after spec-authoring. For Track B, read each leaf's governing template directly (`skill-reference-template.md`, `feature-catalog-template.md`, `manual-testing-playbook-template.md`, `changelog-template.md`) rather than trusting the leaf spec's paraphrase of what the template requires, which surfaced the changelog leaf's imprecise template citation and confirmed the scripts leaf's `tests/`-required rule verbatim. Ran every checker and test the VERIFY section named, plus wrote small inline verification scripts (never persisted to disk) to resolve cross-references across the whole `manual-testing-playbook/` tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Split into two independent tracks in one packet | Both are "residue from earlier retirement work" but share no mechanism; splitting into two packets would be over-ceremonious for this size |
| `design-motion/`-internal residue: no longer a live concern | `010-motion-merge` has since landed; `design-motion/` no longer exists on disk at all, so there is nothing left to defer or fix |
| Never rubber-stamped Track B checklist marks | Verified each leaf's claims against the real on-disk state; this is what surfaced 3 genuine additional findings (a functional bug, 4 repeated typos, a stale count) beyond what each leaf's original spec anticipated |
| Left `design-md-generator/SKILL.md:246` unfixed | Explicitly out of this session's scope per sibling-boundary instruction; documenting the gap honestly is preferable to silently dropping it or violating the boundary |
| Fixed real bugs found during "audit-only" leaves rather than only documenting them | The 006-scripts `sys.path` bug and 007's 4 new typos were small, unambiguous, same-root-cause-as-already-approved-fixes; leaving them broken to stay literally within an "audit" label would itself be a form of rubber-stamping |
| Did NOT reformat the 18 non-9-column-conforming files in 008, and did NOT scaffold `tests/` in 006 | Both are substantial new-authoring decisions with real blast radius, not residue fixes; recorded as open questions for operator sign-off instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` | PASS | hub-wide | 0 warnings |
| `node .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | PASS | 8/8 | |
| `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` | PASS | 7/7 | |
| `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | PASS | commands=2 invalid=0 drift=0 | |
| Canary fixture consumer (`loadSnapshot()`/`typedGold()` direct probe) | PASS | 8 remaining cases evaluate cleanly | The harness's own `activation/manifest.prior.json` bootstrap is missing for ALL 6 sibling hubs (pre-existing, reproduced on `001-sk-code` too) — out of scope, not caused by this edit |
| `npx vitest run bin/compiled-routing-{foundation,flag-propagation}.vitest.ts` | 31/34 pass, unchanged | Same 3 pre-existing unrelated failures before and after this session's canary-fixture edit | |
| `python3 naming_doc_check.py` (compliant/violating fixtures) | PASS | exit 0 / exit 1 as expected | Post-fix |
| `python3 baseline_rhythm_check.py` (real token-starter file) | PASS | exit 0 | Post-fix |
| `python3 package_skill.py --check .opencode/skills/sk-design` | PASS | no scripts/tests-related finding | |
| Whole-playbook-tree cross-reference resolution | PASS | 0 broken links after 1 fix | Inline Python check, both file-relative and packet-root-relative rules |
| Checklist | Verified | 4/4 leaf checklists + this packet's own | See each `checklist.md` |
| **Follow-up closure — baseline vs after** | | | |
| `parent-skill-check.cjs .opencode/skills/sk-design` | PASS → PASS | 0 warnings → 0 warnings | No delta. 10b byte-drift clean, confirming no `leaf-manifest.json` regeneration was needed (no filenames changed) |
| `package_skill.py design-interface --check` | PASS → PASS | 1 warning → 1 warning | Same single pre-existing warning (SKILL.md word count). Count moved 4991→4760 from a **concurrent session's** SKILL.md edit, not this work |
| `load-playbook-scenarios.cjs --skill design-interface` | 43/0 → 43/0 | shape=sk-doc, 25 categories, 43 intent-gold, 43 resource-gold, 0 warnings | Byte-for-byte identical benchmark corpus before and after the reformat — Lane C is unaffected |
| 9-column conformance sweep (escape-aware) | 25/43 → 43/43 | 43 scenario rows, 0 with != 9 columns | Includes the 2 unescaped-pipe fixes |
| Prompt-equality sweep (contract prompt == table prompt) | 43/43 | all scenarios | Root checklist item 6 |
| `check-markdown-links.cjs` (playbook tree) | PASS | 0 broken links | 2 pre-existing breaks elsewhere in `references/foundations/` left under scope lock |
| `pytest scripts/tests/ -q` | **NEW** | 46 passed in 0.4s | Suite validated by reintroducing the historical `sys.path` bug and confirming it fails |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T001 (`design-md-generator/SKILL.md:246`) remains unfixed** — genuinely re-confirmed broken, but explicitly out of this session's scope (sibling territory). Needs a handoff.
2. ~~006-scripts' `tests/` gap~~ — **RESOLVED**, see "Follow-Up Closure" below.
3. ~~008-manual-testing-playbook's 18-file 9-column-format gap~~ — **RESOLVED**, see "Follow-Up Closure" below.
4. **Two pre-existing broken links remain in `design-interface/references/foundations/`** (`layout/layout-responsive.md` → `../../assets/token-starter.md#4-spacing-scale`; `smart-router-pseudocode.md` → `../../../sk-doc/create-skill/assets/skill/skill-smart-router.md`). Found while verifying the playbook tree; both sit outside `manual-testing-playbook/` and `scripts/`, so they were left alone under scope lock. The playbook tree itself is 0 broken links.
5. **Root playbook section numbering has a gap at §12, and ID-007 does not exist.** Both look like residue from a removed scenario. Renumbering would churn every cross-reference in the tree for no functional gain, so it was left as-is and recorded here instead.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup-closure -->
## Follow-Up Closure

The two questions this packet deliberately left open were delegated back with decision authority and are now closed. Both were investigated against the evidence before executing.

### Q1 — 18 scenario files not following the 9-column format

**Decision: reformatted all 18. Zero excluded, zero deleted.**

The premise was checked first, because two plausible readings would have made reformatting wrong:

- *"The relocated scenarios have their own contract."* Partly true but not load-bearing. §23/§24 do give the relocated sets their own preconditions, evidence requirements, and release-readiness rules, and the root §5 checklist scopes its structural sweep to "all 20 files" (the interface-owned set). But none of that speaks to body format. The decisive counterexample is `color/contrast-pair-inventory-before-audit.md` (FOUND-COLOR-002): same category folder, same relocation, same `trigger_phrases`/`importance_tier` frontmatter lineage as the non-conformant FOUND-COLOR-001, added in the *same commit* (`4bf29688aa`) — and it carries a full 9-column table with a real command sequence. Same lineage, two formats, is drift, not a parallel contract.
- *"The format is one style among several."* Disproven by the owning authority. sk-doc owns `create-manual-testing-playbook`, and its per-feature snippet template (`assets/manual-testing-playbook-snippet-template.md`, v1.8.0.11) lists under **Required uses**: "One file per feature ID / **One primary 9-column scenario row per file**". No exemption for relocated scenarios. Since this program is `014-template-conformance`, the template is the authority.

The `foundations-*` / `motion-*` filename prefixes documented in §23/§24 are an intentional collision-avoidance convention, entirely orthogonal to body format — no file was renamed.

Content was preserved rather than rewritten. Each file's frontmatter is byte-identical, each original `## Expected Process` list became the `### Recommended Orchestration Process` verbatim, and each original `## Pass Criteria` list was carried through verbatim into a `### Pass Criteria` subsection so no criterion was reworded or dropped. The table's `Exact Command Sequence` mechanizes the "Load X" steps the files already stated, into `rg` invocations against the anchors they already cite — every `rg` pattern was verified to match real content before use (one initial pick, `state machine`, did not match and was corrected to `ASYNC STATE-MACHINE`). No scenario ids were renumbered.

**No deletions.** All 49 unique paths in `expected_resources` across the tree resolve on disk, so no scenario's premise was dead — the foundations and motion surfaces they test still exist under `design-interface`. This is the opposite of the 5 canary cases deleted earlier in this packet, whose whole premise *was* a retired mode.

One of the 18 was not a relocated file at all: `redesign-intake/redesign-intake-classification.md` is interface-owned (ID-015, indexed in §22), so it sat squarely inside the root §5 checklist's own scope and was the least ambiguous case in the set.

**Two additional real defects found and fixed while verifying.** `color/contrast-pair-inventory-before-audit.md` and `brief-to-dials-intake/register-first-context-gate.md` each carried unescaped `|` characters inside `rg` alternation patterns in their table cells. Markdown splits on those, so those rows rendered with 12 and 14 columns — a direct violation of the root checklist's own "every table row has exactly 9 columns" rule, in two files that otherwise looked conformant. Escaped to `\|`.

**Counts recomputed from disk, not carried forward.** 43 scenarios across 25 category directories (19 interface-owned + 11 foundations + 13 motion). The headline `43`/`25` figures were already correct, but five downstream numbers were still stale at the pre-relocation `20`, and the canonical package artifacts list was missing `redesign-intake/` (24 listed vs 25 on disk). All corrected; root playbook version `1.6.0.0` → `1.6.1.0`.

### Q2 — `design-interface/scripts/` has no `tests/`

**Decision: neither an empty scaffold nor a pure exception. Wrote a real 46-test suite plus a scoped written exception.**

The ruling was to file an exception and not scaffold, with an explicit flip condition: if the scripts are genuinely untested and testable, and a couple of real tests would have caught a bug that actually shipped, write the smallest real test instead. Every part of that condition is met:

- **Zero coverage anywhere.** A repo-wide search for `naming_doc_check` / `baseline_rhythm_check` / `contrast_check` returns 10 non-worktree files, none of which is a test, CI config, or doctor check. The only recorded executions are manual one-offs.
- **Highly testable.** All three expose pure functions over strings (`check(text) -> dict`, `evaluate(fg, bg) -> dict`) with filesystem IO confined to `main`. `contrast_check.py` is pure stdlib with zero IO.
- **A real bug shipped.** `naming_doc_check.py` and `baseline_rhythm_check.py` both built their `sys.path` entry for the shared `md_table` import with three `..` instead of two. That is not a subtle failure — it raised `ModuleNotFoundError` on *every* invocation of both scripts, and it survived from `b217d74b81` until `140fdab23d9f` purely because nothing ever ran them.

An empty `tests/` directory would have been ceremony, and a pure exception would have documented away a gap that had already cost a shipped defect. The middle path is the honest one: 46 tests across three files (`test_naming_doc_check.py`, `test_baseline_rhythm_check.py`, `test_contrast_check.py`, matching the template's `test_[script_name].py` convention), running in 0.4s with no network and no new fixtures.

Each suite leads with a **subprocess smoke test executed from an unrelated working directory** — the only shape that exercises the real path math, since an in-process import would resolve through the test's own `sys.path` and pass regardless. The rest pin the WCAG arithmetic against definitional reference vectors (black-on-white is exactly 21:1), the baseline-resolution rules, and the `0`/`1`/`2` exit contract that callers gate on. The two `fixtures/naming-doc/` files, which the `scripts/README.md` already described as the checker's own positive and negative examples, are now actually executed.

**The suite was validated against the real defect**, not just asserted to cover it: temporarily restoring the three-`..` path made collection fail with the exact historical `ModuleNotFoundError: No module named 'md_table'`. The script was then restored and verified byte-identical by SHA-256, and `git status` confirms the three checkers are unmodified — the only addition is the new `tests/` directory.

The `>=80%` line-coverage half of the template rule (`create-skill/assets/skill/skill-reference-template.md` §8) is **deliberately not met**, and that exception is written into `scripts/README.md` §4 rather than left implicit. The suite targets the regression-prone surface instead of chasing a percentage through display-only helpers (`_print_text`, table-formatting branches) that would need brittle stdout assertions. Coverage is not measured or enforced anywhere in this repo — verified against `parent-skill-check.cjs` and `package_skill.py`, neither of which mentions it — and every other `sk-design` `scripts/` directory has no tests at all, so this leaf now has the most coverage in its hub, not the least.
<!-- /ANCHOR:followup-closure -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| `design-md-generator/SKILL.md:246` fix (T001) | Not fixed | Sibling-owned territory this session; the live task brief that superseded this packet's original file list explicitly excluded `design-md-generator/` |
| `canary-cases.v1.json` fix (T002) scoped to `foundations`/`audit` only | Also removed `single-motion`/`interface-motion-separate-bundle` | The motion merge landed between spec-authoring and this session, adding 2 more stale cases with the same "asserts a retired mode" defect shape |
| No `commands/README.txt` fix in the original spec | Fixed 3 stale `/interface:motion` references | Found via a broader sweep; same category of defect as the named sites, low-risk, directly in scope of "retirement residue" |
| 006/007/008/009 scoped as documentation-conformance audits only | 006 and 007 also got real code/content fixes (sys.path bug, 4 typos) | Both were small, unambiguous, same-pattern-as-already-approved fixes discovered while verifying the audit claims; leaving them broken would itself have been a rubber-stamp |
<!-- /ANCHOR:deviations -->
