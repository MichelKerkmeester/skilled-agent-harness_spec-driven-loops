---
title: "Feature Specification: Phase 5: provenance-title-sweep"
description: "947 committed spec documents carry the scaffold's [template:level-N/doc] provenance token in their own title field, and no rule stops a new one from joining them."
trigger_phrases:
  - "provenance title sweep"
  - "template level token cleanup"
  - "placeholder rule third class"
  - "scaffold provenance backlog"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: provenance-title-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/005-provenance-title-sweep` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 16 |
| **Predecessor** | 004-fingerprint-stamp-regeneration |
| **Successor** | 006-lifecycle-command-asset-merge |
| **Handoff Criteria** | The in-scope corpus carries no `[template:level` title token, `rules/check-placeholders.sh` reports the token as a third hard class, the fixtures that model a valid scaffold stay green under that class, and every touched packet regenerates its description.json and graph-metadata.json |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Recorded findings closure specification.

**Scope Boundary**: the `title:` frontmatter field of scaffolded spec documents that still carries `[template:level-N/doc]` or the older `[template:level_N/doc]` shape, plus the one validator rule and the fixtures that stand in for it. Body prose that quotes the token while describing this exact defect (research, review and audit documents) is read, not rewritten.

**Dependencies**:
- `035-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth`, which stopped the scaffolder from writing new provenance-carrying titles and reverted a first attempt at this same rule class
- `035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria/research/lineages/deepseek-v4-flash-templates-r3/findings-registry.json` (`f-iter003-004`), the finding this phase closes

**Deliverables**:
- A title sweep across the packets this session owns, leaving the four other-session groups untouched and named
- A third `PLACEHOLDER_FILLED` class in `rules/check-placeholders.sh` for the title token
- The fixture set the extended suite and the progressive-validation tests read as "valid" brought in step with the new class

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`grep -rIl '\[template:level' specs` currently returns 1,178 files, of which 947 `.md` documents carry the token on their own `title:` frontmatter line rather than in prose quoting it elsewhere (verified 2026-09-07 by filtering the raw match list against `^title:.*\[template:level`). `035-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth` stopped `create.sh` from writing new titles like this (`035-.../018-.../implementation-summary.md:36`), but a first attempt to make the token a validator error was reverted in the same session because it failed `test-validation-extended.sh`'s own "valid" fixture and would have failed every one of the then-1,240 already-closed documents that carry it (`035-.../004-template-system-and-acceptance-criteria/research/confirmed-findings.md:156`, `findings-registry.json:19`). `rules/check-placeholders.sh`'s header now documents that decision, and names `spec/check-placeholders.sh` as the intended home for the token, but that standalone script never actually flags it: its bracket pattern requires an uppercase first letter (`spec/check-placeholders.sh:135`), and `[template:level-1/tasks.md]` starts with a lowercase `t`, confirmed by running the script against a fixture that carries the token (`bash spec/check-placeholders.sh test-fixtures/002-valid-level1` prints `PASS`). Nothing currently strips the historical titles and nothing currently catches a new one.

### Purpose
The committed titles this session owns read like the feature they describe instead of the template that produced them, and a future scaffold cannot reintroduce the token without a validator catching it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stripping `[template:level-N/doc]` and `[template:level_N/doc]` from the `title:` frontmatter line of every in-scope `.md` document, leaving the rest of the title text and every other field untouched
- Regenerating `description.json` and `graph-metadata.json` for every packet whose title changed, using the existing generator and backfill scripts
- Adding a third hard class to `rules/check-placeholders.sh` that flags the token on a `title:` line
- Bringing the fixtures that stand for "a valid, fully-authored packet" (`runtime/cli/test-fixtures/002-valid-level1`, `003-valid-level2`, `004-valid-level3`, and any other fixture the extended suite or `progressive-validation.vitest.js`/`.ts` reads as an unconditional pass) in step with the new class, without touching fixtures whose entire purpose is to model an untouched scaffold (`072-scaffold-never-touched-violation`)

### Out of Scope
- `specs/sk-doc/052-routing-completeness` (2 title matches) - staged by another session. The brief names it as left for its owner
- `specs/system-deep-loop/036-deep-loop-innovation` (1 title match) - same reason
- every packet under `specs/sk-design/` (15 title matches) - same reason
- `specs/sk-doc/051-*` - named in the brief as excluded. The live corpus carries zero matches under this prefix, so there is nothing to skip and nothing to verify skipped
- non-`.md` artifacts that merely quote the token (173 files: `.out` fanout logs, `.jsonl` deltas, `.json` results, `.prompt` files) - not spec-document titles, and rewriting them would corrupt a captured record
- `.md` files where the token appears in body prose describing this defect rather than in the document's own title (58 files, confirmed by direct read of a sample: `sk-prompt/z_archive/002-sk-improve-prompt-rename/review/iterations/iteration-003.md:37`, `system-deep-loop/z_archive/024-deep-loop-improved/009-research-backlog-remediation/007-parent-scaffold-and-governance-docs/spec.md:58`) - editing these would rewrite an audit trail, not fix a title
- expanding `LINKS_VALID`-style repo-wide wikilink coverage or any other unrelated validator work - a different phase's finding

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `title:` line of `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` across 929 in-scope packets under `specs/system-speckit/` (742), `specs/system-deep-loop/` excluding 036 (67), `specs/system-skill-advisor/` (31), `specs/cli-external-orchestration/` (31), `specs/sk-prompt/` (20), `specs/sk-doc/` excluding 051 and 052 (12), `specs/sk-git/` (11), `specs/mcp-tooling/` (8), `specs/sk-code/` (7) | Modify | Strip the provenance token, keep the rest of the title |
| `description.json`, `graph-metadata.json` per touched packet | Modify | Regenerated so the title stays reflected |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Modify | Add the third `PLACEHOLDER_FILLED` class for a `title:` line carrying `[template:level` |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/{spec,plan,tasks,implementation-summary}.md` | Modify | Strip the token so the "No placeholders" pass fixture stays a pass |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/*.md`, `004-valid-level3/*.md` | Modify | Same, verified against every registry rule and vitest suite that reads either fixture as a pass before editing |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh` | Modify | Add or update the isolated-rule case for the third class |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every in-scope document's title (929 files at authoring time, re-counted at execution time from the same grep) no longer carries `[template:level` |
| REQ-002 | `rules/check-placeholders.sh` reports a `title:` line carrying `[template:level` as a third `PLACEHOLDER_FILLED` class, at the same `error` severity as the two existing classes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every packet whose title changed carries a regenerated `description.json` and `graph-metadata.json` |
| REQ-004 | `002-valid-level1`, `003-valid-level2` and `004-valid-level3` validate strict clean under the new class, and `072-scaffold-never-touched-violation` still fails for the reason its test expects |
| REQ-005 | The runtime and CLI vitest projects, the goldens, the registry-coverage test and `npm run check` pass with no failure the third class introduced |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rIl '\[template:level' specs` returns only files under the four named excluded groups
- **SC-002**: `bash .../rules/check-placeholders.sh` run in isolation against a fixture carrying the token in its title reports `fail`, and against a swept fixture reports `pass`
- **SC-003**: Every touched packet prints `RESULT: PASSED` from `validate.sh --strict`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The four excluded packet groups stay untouched by this session while their titles remain dirty | The new rule fails `validate.sh --strict` if their own owner runs it before fixing them | Documented here and in the parent map as left for the owning session. Not this packet's fix |
| Risk | A fixture the extended suite or the progressive-validation tests read as an unconditional pass still carries the token and was missed | The new class breaks a test outside this packet's own validate run | `grep -rl '\[template:level' test-fixtures/` before the rule change, plus a full run of `tests/test-validation-extended.sh`, `progressive-validation.vitest.ts` and `test-validation-system.cjs` after it |
| Risk | The live file count drifts between spec authoring and execution because other sessions create or close packets concurrently | A hardcoded count in a task goes stale | Every count in this packet is reproducible from the cited grep command. Execution re-runs it rather than trusting the number written here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sweep is a scripted literal replacement over ~930 files, not a per-file manual edit
- **NFR-P02**: `check-placeholders.sh`'s added class adds one more grep pass per scanned file, no measurable change to `validate.sh` runtime

### Security
- **NFR-S01**: Not applicable. No auth surface touched
- **NFR-S02**: Not applicable. The change is a title string edit and a validator rule

### Reliability
- **NFR-R01**: The sweep script aborts on any file where the title line does not match the expected two token shapes, rather than silently skipping it
- **NFR-R02**: Zero regressions in the runtime and CLI vitest suites after the rule change
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a document whose title never carried the token is untouched by the sweep and passes the new class already
- Maximum length: not applicable. The token is a fixed bracket shape, not a length-bounded field
- Invalid format: a title carrying the older `[template:level_N/doc]` underscore shape is also stripped and also caught by the new class, since both shapes share the `[template:level` prefix the rule matches on

### Error Scenarios
- External service failure: not applicable. The sweep and the rule change are local file edits
- Network timeout: not applicable
- Concurrent access: another session editing an in-scope packet's title mid-sweep is out of this packet's control. The sweep script re-checks each file's content before writing rather than trusting a stale file list

### State Transitions
- Partial completion: the sweep and the rule change land together, since shipping the rule first without the sweep would fail every not-yet-swept packet's validate run, and shipping the sweep without the rule leaves the class open to regrowth
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~930 title edits via one script, three fixture folders, one rule file, one test file |
| Risk | 10/25 | A rule class reverted once already for breaking a fixture and a large closed-document backlog. This phase must avoid repeating that failure |
| Research | 6/20 | Findings arrived censused from the 035 lane. This phase re-measured the live counts rather than trusting the 2026-07 numbers |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The exclusion list, the token shape and the fixture set are grounded in the grep results and file reads captured during planning.
<!-- /ANCHOR:questions -->

---
