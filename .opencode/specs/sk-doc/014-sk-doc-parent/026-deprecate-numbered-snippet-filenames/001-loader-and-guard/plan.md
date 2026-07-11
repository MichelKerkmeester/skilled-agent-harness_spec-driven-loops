---
title: "Plan: make the Lane C playbook loader number-agnostic + add a no-new-numbered-snippet guard"
description: "Re-base the sk-doc-shape scenario gate in load-playbook-scenarios.cjs from the `^\\d{3}-.*\\.md$` filename test to a structural-plus-frontmatter content gate, teach the loader an optional `stage:` field, re-base the code-opencode-playbook-ids.vitest.ts oracle onto the same gate, and add a guard that rejects new numbered snippet files."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the loader content-gate change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Make the Lane C Playbook Loader Number-Agnostic + Add a No-New-Numbered-Snippet Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
A small, surgical code change in the Lane C benchmark loader plus its vitest oracle, plus one new guard
script. Replace the number-anchored `^\d{3}-.*\.md$` basename test in `loadYamlFrontmatterScenarios()` with a
structural-plus-frontmatter content gate so both the numbered and de-numbered snippet filenames load during
the transition, teach the loader an optional `stage:` field, update the oracle to the same gate, and ship a
guard that fails on any newly introduced numbered snippet file. No snippet files are renamed here; this is
the foundation that makes the later rename safe without losing corpus coverage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
De-numbered and numbered scenario files both load; root index file stays excluded; `stage:` field parses with
a `routing` default; the vitest oracle's count agrees with the loader; new numbered snippet file trips the
guard, de-numbered does not; existing skill-benchmark suite passes; `validate.sh --strict` Errors 0 on this
phase folder; comment hygiene respected (no ephemeral spec/ADR/phase ids in code comments — keep the durable
WHY).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Scenario loading for sk-doc-shape playbooks lives in `loadYamlFrontmatterScenarios()` in
`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`. The
function walks `playbookDir` with an explicit stack (directories pushed, files tested), and today gates each
file on `/^\d{3}-.*\.md$/` before attempting to parse it. The new gate keys on two conditions instead of the
filename: the file's containing directory is not `playbookDir` itself (i.e. it sits in a category subfolder,
not directly at the playbook root — this is what excludes `manual_testing_playbook.md` /
`feature_catalog.md`), and the file parses a `---`-delimited YAML frontmatter block (the existing `fm` check
already downstream, promoted to the actual membership test). `stage:` is extracted with the same single-line
regex style already used for `id:` / `expected_intent:`, defaulting to `routing` when absent or unrecognized,
and attached to the scenario object alongside the existing fields. sk-code-shape playbooks
(`parseRootIndex()`) are architecturally untouched — they never depended on the filename pattern.
`code-opencode-playbook-ids.vitest.ts`'s `countFeatureFiles()` is a separate, hand-rolled walk that
re-implements the old gate as an integrity oracle; it is re-based onto the identical content-gate condition so
the two never drift apart again. The no-new-numbered-snippet guard is a new, standalone script mirroring the
existing `check_no_numbered_categories.py` folder-level guard's shape (`CATEGORY_ROOTS` walk over
`feature_catalog/` and `manual_testing_playbook/`, exit 0 clean / 1 offenders found / 2 error, `--json` mode)
but scoped one level deeper — per-scenario filenames inside a category subfolder rather than the category
folder name itself.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Read `load-playbook-scenarios.cjs` in full (both `parseRootIndex()` and `loadYamlFrontmatterScenarios()`)
   and `code-opencode-playbook-ids.vitest.ts` to confirm the two `^\d{3}-.*\.md$` sites and every caller of
   `loadYamlFrontmatterScenarios()` / `loadPlaybookScenarios()`.
2. Replace the basename gate at `load-playbook-scenarios.cjs:302` with the structural-plus-frontmatter content
   gate; keep the walk's directory-push logic unchanged so recursion behavior is preserved.
3. Add `stage:` frontmatter parsing next to the existing `id:` / `expected_intent:` / `expected_resources:`
   extraction; default to `routing`; attach to the returned scenario object.
4. Re-base `countFeatureFiles()` in `code-opencode-playbook-ids.vitest.ts` onto the same content-gate
   condition as the loader.
5. Author the no-new-numbered-snippet guard script, mirroring `check_no_numbered_categories.py`'s
   `CATEGORY_ROOTS` / exit-code / `--json` shape, scoped to per-scenario filenames.
6. Add fixtures (numbered scenario, de-numbered scenario, root index file, scenario with `stage:`, scenario
   without `stage:`, non-scenario file in a category subfolder, newly created numbered snippet file) and
   verify each; run the existing skill-benchmark vitest suite; `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit-level fixtures exercising `loadYamlFrontmatterScenarios()`: a de-numbered scenario file → loaded; a
numbered scenario file → still loaded; the root index file → NOT loaded; a non-scenario `.md` file with no
parseable frontmatter sitting in a category subfolder → NOT loaded (negative case); a scenario with
`stage: holdout` → surfaces `holdout`; a scenario with no `stage:` field → surfaces `routing`. Oracle test:
re-run `code-opencode-playbook-ids.vitest.ts` against the live `code-opencode` playbook tree and confirm
`countFeatureFiles()` agrees with the loader's parsed count. Guard tests: a freshly created numbered snippet
file → FAIL; a de-numbered one → PASS. Re-run the full existing skill-benchmark test suite for no regression.
`validate.sh --strict` on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Independent of Phase 002 (generator alignment); both are foundation and can land in parallel. Must land before
Phase 003 authors the migration/rename tooling against the tolerant loader and before Phase 004 renames any
snippet file (ADR-002 sequencing invariant).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` `load-playbook-scenarios.cjs`, `code-opencode-playbook-ids.vitest.ts`, and the new guard script
+ its fixtures. The loader change is additive-tolerant (it widens what loads, it does not narrow — every file
that loaded under the old gate still loads under the new one), so reverting restores the prior
number-anchored behavior with no corpus impact beyond re-losing the 10+ playbooks the old gate already drops.
<!-- /ANCHOR:rollback -->
