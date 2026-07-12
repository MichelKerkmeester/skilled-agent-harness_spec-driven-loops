---
title: "Spec: Make the Lane C playbook loader number-agnostic + add a no-new-numbered-snippet guard"
description: "Phase 001 of the numbered-snippet-filename deprecation program (026). Re-base the deep-improvement Lane C benchmark loader's sk-doc-shape scenario gate in load-playbook-scenarios.cjs from the number-anchored `^\\d{3}-.*\\.md$` filename test to a content gate — any markdown file that sits in a category subfolder (not the root index) and carries scenario YAML frontmatter — so both the numbered and de-numbered snippet filenames load during the transition, the loader learns to read an optional `stage:` field, the code-opencode-playbook-ids.vitest.ts oracle is updated in lockstep, and a no-new-numbered-snippet guard blocks the anti-pattern's return. No snippet files are renamed here."
trigger_phrases:
  - "number-agnostic playbook loader"
  - "no-new-numbered-snippet guard"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the loader content-gate change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Make the Lane C Playbook Loader Number-Agnostic + Add a No-New-Numbered-Snippet Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 026/001-loader-and-guard |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 001 of 005 (foundation) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The deep-improvement Lane C skill-benchmark loader ingests a sk-doc-shape scenario file — a per-feature
snippet under `feature_catalog/<category>/` or `manual_testing_playbook/<category>/` — **only when its
basename matches `^\d{3}-.*\.md$`**
(`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:302`,
inside `loadYamlFrontmatterScenarios()`). That number-anchored test is the single hard runtime dependency on
the ordinal prefix carried by the 111 in-scope snippet files (research.md, B): stripping the prefix without
changing the loader first would silently drop every one of them from the Lane C corpus (empirically
reproduced this session). The gate is also already miscounting today — it zeroes 10+ live playbooks whose
files are single-digit-prefixed or generator-output, a latent pre-existing bug the same fix corrects.
`code-opencode-playbook-ids.vitest.ts:28` re-implements the identical `^\d{3}-.*\.md$` regex as an integrity
oracle (`countFeatureFiles()`), so it must change in lockstep or it will assert against a count the loader no
longer produces. sk-code-shape playbooks (root-index-table format, read via `parseRootIndex()`) are
unaffected — they resolve `featureFile` from the table, not from a filename pattern.

**Purpose:** re-base `loadYamlFrontmatterScenarios()` from the filename-ordinal gate to a *content* gate (per
ADR-003) — a `.md` file that sits inside a category subfolder (not the `feature_catalog.md` /
`manual_testing_playbook.md` root index file itself) and carries scenario YAML frontmatter — so both the
numbered `NNN-slug.md` form and the de-numbered `slug.md` form load during the transition. Teach the loader
to parse an optional `stage: routing|holdout|negative` frontmatter field (per ADR-004), defaulting to
`routing` when absent, so the routing/holdout/negative grouping the ordinal used to encode survives the
rename explicitly instead of implicitly. Update the vitest oracle to the same content gate. Add a
no-new-numbered-snippet guard (per ADR-005) that fails on a freshly created numbered snippet file, so the
anti-pattern cannot silently return after Phase 004 renames the corpus. This is the foundation phase — it
must land before any file is renamed (ADR-002 sequencing invariant), and Phase 003's migration tooling is
authored against the tolerant loader this phase ships.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope — de-couple the Lane C loader from the filename ordinal and guard against its return:**
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` —
  `loadYamlFrontmatterScenarios()` (around `:291-338`): replace the `^\d{3}-.*\.md$` basename test at `:302`
  with a structural test (file sits in a category subfolder, its containing directory is not the playbook
  root itself) combined with the existing frontmatter-presence check (`:305-306` already `continue`s when no
  `---` YAML block parses) as the real scenario-membership signal. Add optional `stage:` field parsing
  alongside the existing `id:` / `expected_intent:` / `expected_resources:` extraction and thread it onto the
  returned scenario object.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/code-opencode-playbook-ids.vitest.ts`
  — `countFeatureFiles()` (`:24-31`, the `^\d{3}-.*\.md$` test at `:28`): change to the same content gate so
  the oracle counts what the loader now loads, not what it used to load.
- The new **no-new-numbered-snippet guard**: a check that FAILS on a freshly created
  `feature_catalog/<category>/NNN-*.md` or `manual_testing_playbook/<category>/NNN-*.md` file and PASSES on a
  de-numbered one, mirroring the existing `check_no_numbered_categories.py` folder-level guard's pattern
  (`CATEGORY_ROOTS` walk, exit 0/clean · 1/offenders · 2/error, `--json` mode) but scoped to per-scenario
  filenames instead of category folders.

**Out of scope:** renaming any of the 111 snippet files (Phase 004); `playbook-generator.cjs`'s `AG-NNN.md`
emission and the sk-doc convention docs (Phase 002); the migration/rename tooling itself (Phase 003); the 3
hub-routing root-index tables (Phase 004); the 2 pre-existing failing vitest suites and the 7 dead allowlist
entries folded into Phase 004 (ADR-007); the 20 out-of-scope system-spec-kit single-digit files (ADR-006) —
`parseRootIndex()` and sk-code-shape playbooks generally, which are already number-agnostic and need no
change.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** `loadYamlFrontmatterScenarios()` loads a scenario from BOTH a numbered `NNN-slug.md` file and a
  de-numbered `slug.md` file — tolerate-both during the transition (ADR-002/ADR-003).
- **R2:** The root `feature_catalog.md` / `manual_testing_playbook.md` index file stays excluded from
  scenario loading (its containing directory is the playbook root itself, not a category subfolder).
- **R3:** The loader parses an optional `stage: routing|holdout|negative` frontmatter field and attaches it
  to the scenario object; a scenario file with no `stage:` field defaults to `routing` (ADR-004).
- **R4:** `code-opencode-playbook-ids.vitest.ts`'s `countFeatureFiles()` oracle is updated to the same content
  gate as the loader, and the existing skill-benchmark test suite passes with no regression.
- **R5:** The no-new-numbered-snippet guard FAILS on a freshly created numbered snippet file under
  `feature_catalog/<category>/` or `manual_testing_playbook/<category>/` and PASSES on a de-numbered one
  (ADR-005; grandfather nothing after Phase 004).
- **R6:** The 10+ live playbooks the current `^\d{3}-` gate silently drops (single-digit-prefixed or
  generator-output filenames) now load through the content gate — closing the latent pre-existing bug as a
  side effect.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A de-numbered scenario fixture (`manual_testing_playbook/<category>/<slug>.md` with valid scenario
   frontmatter) is loaded by `loadYamlFrontmatterScenarios()`.
2. A numbered scenario fixture (`manual_testing_playbook/<category>/NNN-<slug>.md`) is still loaded.
3. The root index file (`manual_testing_playbook.md` / `feature_catalog.md`) is NOT loaded as a scenario.
4. A scenario fixture carrying `stage: holdout` (or `negative`) surfaces that value on the returned scenario
   object; a fixture with no `stage:` field surfaces `routing`.
5. `countFeatureFiles()` in the vitest oracle agrees with the loader's parsed scenario count on the live
   `code-opencode` playbook tree (no drift between the two).
6. A newly created numbered snippet file trips the guard (non-zero / FAIL); a de-numbered one does not.
7. The existing skill-benchmark vitest suite passes with no regression.
8. `validate.sh --strict` on this phase folder is Errors 0.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* the content gate over-broadens and loads a non-scenario `.md` file (e.g. a README dropped into a
  category subfolder) as a scenario → keep the frontmatter-presence check as the real membership signal
  (files without a parseable `id:`-bearing YAML block already `continue` before reaching the scenario push)
  and cover it with a negative fixture.
- *Risk:* the loader and the vitest oracle drift onto two different gates again in the future → change both
  in this phase and assert their agreement in R4/success-criterion 5 rather than only inspecting each in
  isolation.
- *Risk:* `stage:` parsing silently swallows a malformed value → default to `routing` on anything that isn't
  exactly `routing`, `holdout`, or `negative`, matching the loader's existing tolerant-parse style for other
  optional fields.
- *Dependency:* independent of Phase 002 (generator alignment); both are foundation. Must land before Phase
  003 authors the migration/rename tooling against the tolerant loader and before Phase 004 renames any
  snippet file (sequencing invariant, ADR-002).
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None.
<!-- /ANCHOR:questions -->
