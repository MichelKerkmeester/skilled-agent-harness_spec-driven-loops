---
title: "Feature Specification: Phase 7: links-scan-registry-rule"
description: "check-links.sh has no validator-registry row, so validate.sh never runs it, and the one time it was run over the skill it found 5 broken [[feedback_*]] memory-name wikilinks with no allowlist to catch them."
trigger_phrases:
  - "links scan registry rule"
  - "wikilink registry row"
  - "memory name link allowlist"
  - "check links registry coverage"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: links-scan-registry-rule

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/007-links-scan-registry-rule` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 16 |
| **Predecessor** | 006-lifecycle-command-asset-merge |
| **Successor** | 008-review-research-scaffold-paths |
| **Handoff Criteria** | `validator-registry.json` carries a `LINKS_VALID` row, the registry-coverage test sees it fire on every validated folder, `rename-pattern.md` carries no unresolved memory-name wikilink, and `validate.sh --strict` on this skill's own packets still passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Recorded findings closure specification.

**Scope Boundary**: `rules/check-links.sh`, `lib/validator-registry.json`, the registry-coverage vitest that asserts every registry row fires, and `references/workflows/rename-pattern.md`'s four `[[feedback_*]]` wikilinks. Wikilink coverage for any skill other than `system-spec-kit`, and wikilink coverage for `specs/` documents, are out of scope.

**Dependencies**:
- `035-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment/implementation-summary.md`, which removed a flag-gated integration attempt for this same scan and left it a hand-run tool because running it over the skill reports the memory-name links this phase now resolves
- `035-spec-kit-simplification-research/002-cli-runtime-utilization` (round two row 10, round three row 007) and `035-spec-kit-simplification-research/005-overengineering-simplification` (round two `F2-11`), the findings this phase closes

**Deliverables**:
- A `LINKS_VALID` registry row that `validate.sh` runs like its other 39 rules
- `rename-pattern.md`'s five broken wikilink reports (four unique `[[feedback_*]]` targets) resolved by rewrite or by a documented allowlist convention
- The registry-coverage test passing with the new row included

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`rules/check-links.sh`'s own header states it plainly: "A standalone scan run on demand: it has no validator-registry row, so validate.sh never sources it" (`check-links.sh:5-6`). `035-.../017-.../implementation-summary.md:61` confirms why it stayed that way: "Run over the skill it reports memory-name wikilinks that are not files, which is why it stays a hand-run tool." Running the scan today (`bash rules/check-links.sh .opencode/skills/system-spec-kit`) confirms the report is unchanged: five broken-link lines, all in `references/workflows/rename-pattern.md`, naming four distinct `[[feedback_bundle_gate_smoke_run]]`-style citations of Claude auto-memory entries that have no corresponding file under the skill. `validator-registry.json` lists 39 rules and none of them is this scan (verified by listing every `rule_id` in the file). `tests/validate-runs-every-registry-rule.vitest.ts` asserts every registry row fires when `validate.sh --strict --json` runs against a fresh scaffold, so a row added without a matching fix to `rename-pattern.md` would break that test the moment `validate.sh` runs against any folder, since the scan target is the skill's own documentation tree, not the folder being validated.

### Purpose
The wikilink scan runs as part of the validation gate instead of only when someone remembers to invoke it by hand, and the memory-name citation pattern the skill's own documentation already uses has a place to live that the scan does not flag as broken.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adding a `LINKS_VALID` row to `validator-registry.json` and adapting `check-links.sh` to the registry rule contract (`run_check(folder, level)`, `RULE_*` output variables) while keeping its scan target fixed at `.opencode/skills/system-spec-kit`, the skill this validator infrastructure belongs to, regardless of which folder `validate.sh` was invoked against
- Resolving `rename-pattern.md`'s four `[[feedback_*]]` memory-name wikilinks, either by rewriting them as plain text or by a documented allowlist convention the rule honors
- Extending `tests/validate-runs-every-registry-rule.vitest.ts` coverage (already generic across every registry row) to confirm it sees `LINKS_VALID`
- Confirming `validate.sh --strict` still passes on this skill's own spec packets, including this closure program's siblings under `specs/system-speckit/036-recorded-findings-closure/`, after the row is added

### Out of Scope
- Fixing the `[[Website Relaunch]]` broken wikilinks found in `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/notion-bases-relation-rollup.md` when the scan is run over the full `.opencode/skills` tree - discovered during planning (`bash rules/check-links.sh` with no argument), but it belongs to `mcp-obsidian`'s own testing playbook and is out of this skill's scope. The rule's target stays scoped to `system-spec-kit` specifically so this phase does not become a repo-wide link-fixing sweep
- Extending wikilink checking to `specs/` documents, which use the same `[[...]]` syntax 96 times today (`grep -o` count) for memory citations and template-example prose - a separate, larger scope this phase does not open
- `spec/check-links.sh`'s own bracket pattern, which never actually catches `[template:level...]`-style tokens despite the intent stated in `rules/check-placeholders.sh`'s header - a discovered but unrelated gap, out of scope here
- Fixing `check-markdown-links.cjs`'s standard `[text](path)` link coverage - a separate, already-registered CI guard for a different link syntax

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh` | Modify | Wrapped in a `run_check(folder, level)` adapter that scans `.opencode/skills/system-spec-kit` and sets `RULE_*` output variables, alongside its existing standalone `main()` entry point |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | New `LINKS_VALID` row |
| `.opencode/skills/system-spec-kit/references/workflows/rename-pattern.md` | Modify | Four `[[feedback_*]]` memory-name wikilinks resolved |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md` | Modify | Rule inventory updated to list `LINKS_VALID` as registered, not standalone-only |
| `.opencode/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` | Modify | Its own inventory row for `check-links.sh` (line 79) updated from "not registered with the orchestrator" |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `validator-registry.json` carries a `LINKS_VALID` row that `validate.sh` sources for every folder it validates, the same way it sources the other 39 rules |
| REQ-002 | `rename-pattern.md`'s four `[[feedback_*]]` memory-name wikilinks no longer report as broken when `check-links.sh` scans the skill |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `tests/validate-runs-every-registry-rule.vitest.ts` reports `LINKS_VALID` present in its entries for a fresh scaffold's validate run |
| REQ-004 | `validate.sh --strict` continues to pass on `system-spec-kit`'s own spec packets, including this closure program's own children, after the row is added |
| REQ-005 | The rule's scan target stays `.opencode/skills/system-spec-kit` regardless of which folder `validate.sh` is pointed at, so the pre-existing unrelated `mcp-obsidian` broken link is not a new blocker this phase introduces |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -c "import json; print('LINKS_VALID' in [r['rule_id'] for r in json.load(open('lib/validator-registry.json'))])"` prints `True`
- **SC-002**: `bash rules/check-links.sh .opencode/skills/system-spec-kit` exits 0 with no broken-link report
- **SC-003**: `validate.sh --strict` on this child prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting a `[[feedback_*]]` citation as plain text loses the visual distinctiveness that made it easy to spot as a memory reference in prose | A future reader confuses it with a normal cross-reference | The allowlist convention (documented in `rename-pattern.md` itself) is the preferred fix over a blanket rewrite, so the syntax can stay where a maintainer decides it reads better as a citation |
| Risk | Registering `LINKS_VALID` makes `validate.sh --strict` on ANY folder depend on the entire `system-spec-kit` skill's documentation tree staying link-clean, not just the folder being validated | A future skill-doc edit elsewhere breaks every packet's strict validation, an unusual blast radius for a per-folder rule | Documented explicitly in this spec and in the rule's own header comment, mirroring how `check-markdown-links.cjs` already works as a repo-wide, not per-folder, CI guard |
| Dependency | `017-completion-gate-and-catalog-alignment`'s removal of the earlier flag-gated attempt | This phase re-adds registry wiring to a script that was deliberately made standalone once already | Read before starting so the same failure (a broken link with no allowlist) is not reintroduced without a fix this time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The scan walks `.opencode/skills/system-spec-kit`'s markdown tree once per `validate.sh` invocation. No measurable added latency observed against the skill's current file count
- **NFR-P02**: Not applicable beyond that

### Security
- **NFR-S01**: Not applicable. No auth surface touched
- **NFR-S02**: Not applicable

### Reliability
- **NFR-R01**: A new broken wikilink introduced anywhere in `system-spec-kit`'s documentation now fails `validate.sh --strict` on the next packet validated, rather than going unnoticed until someone runs the standalone scan
- **NFR-R02**: The allowlist convention (if chosen over a rewrite) is documented so it does not silently swallow a genuinely new broken link that happens to start with `feedback_`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a skill directory with no wikilinks at all passes trivially
- Maximum length: not applicable
- Invalid format: a malformed `[[...]]` pair (unbalanced brackets) is already excluded by the existing extraction regex. Unchanged by this phase

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: another session editing `rename-pattern.md` or another skill document mid-change is not this phase's concern. The rule reads the tree at validate time

### State Transitions
- Partial completion: the registry row and the `rename-pattern.md` fix ship together, since a row without the fix fails the registry-coverage test the moment any packet is validated
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One rule adapter, one registry row, one document fix, two README/catalog updates |
| Risk | 9/25 | A repo-wide (not per-folder) rule target is an unusual shape for this registry. Verified against precedent before committing to it |
| Research | 4/20 | Findings arrived censused. The exact broken-link set and the standalone script's own pattern gap were confirmed by direct execution |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The decision to scope the rule to `system-spec-kit` rather than the full `.opencode/skills` tree, and to prefer an allowlist over a blanket rewrite for the memory-name citations, is recorded above with its reasoning.
<!-- /ANCHOR:questions -->

---
