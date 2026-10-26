---
title: "Implementation Summary: Phase 4: doctrine"
description: "The sk-code doctrine now gives an UNKNOWN surface the universal floor and the runner's built-in checks, keeps the SKILLED house checklist on SKILLED and names the runner in every handoff."
trigger_phrases:
  - "phase 4 doctrine implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/004-doctrine"
    last_updated_at: "2026-10-26T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the doctrine phase with every task, checklist row and criterion met"
    next_safe_action: "Land the phase after phase 003, re-picking the version numbers if the landing order changes"
    blockers:
      - "ADR-001 to ADR-005 await operator confirmation at program end. They do not block this phase"
      - "Phase 003 is not on main, so the hub and sk-code-quality changelogs name 3.3.0.0 and 1.7.0.0 as previous versions that land first"
    key_files:
      - ".skilled/skills/sk-code/shared/references/phase-detection.md"
      - ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".skilled/skills/sk-code/shared/references/workflow-verify.md"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-doctrine-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The review-severity column was checked row by row against the sk-code-review contract. Eighteen rows match the default, and two were refined (ADR-003)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-doctrine |
| **Status** | Complete |
| **Completed** | 2026-10-26, on HEAD `f69e5cd2e8` with the changes uncommitted in the working tree |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository with no declared surface can now finish the quality gate. Iron Law 3 gives an UNKNOWN surface the universal floor and the quality runner's built-in checks until the operator names its surface and commands, and the SKILLED house checklist no longer claims to apply to every repository.

### Phase 4: doctrine

Iron Law 3 in `phase-detection.md` names four sources for an UNKNOWN surface: the universal floor in `code-quality-standards.md`, the runner's built-in checks, the quality mode's surface-neutral checklists that the runner lists and the quality checks the repository's quality config names, taken from `--config`, the git config key `skcode.qualityConfig` or `.sk-code/quality.json`. That config never supplies a verification command, the spec-folder authoring checklist applies only where the SKILLED surface resolves, and no other standard or discovered command applies. The UNKNOWN rows in `stack-detection.md` and `code-quality-standards.md` state the same rule. `code-quality-standards.md` defines the universal floor as its sections 3 to 5 and opens section 3 with a mechanical floor: a parse failure, merge-conflict markers and a credential signature are P0 on every surface, and a plain JavaScript parse finding stays heuristic and does not block. Each rule list became a table with a review-severity column, checked row by row against the `sk-code-review` contract. Workflow step 2 runs `quality-gate.cjs`, with comment hygiene as one of its sensors.

`universal-checklist.md` is now the SKILLED House Code Quality Checklist and points every other surface at the floor. The quality checklists no longer name the operator's private Webflow skill, CHK-CSS-09 is P2, and the verification template records the runner's gate values in place of PASS. The style guide points at the repository's `AGENTS.md`, when present. The quality mode's first ESCALATE IF item now fires on an unverifiable P0 check, and its P0 table points at the tier rules and the P0 categories. The implement and debug handoffs name the runner. The verify handoff states that the quality config never supplies verification commands, reads the envelope's `checker_outputs` field and names the three readers of the run verdict.

### Files Changed

Five groups of files fall outside the Files to Change list in `spec.md` section 3, and each follows from a listed edit: the hub README carries the newest-entry row for the new hub changelog, the three Hermes copies and the activation manifest with its authored twin are generator output for the edited skill files, and the parent `spec.md` and `graph-metadata.json` carry this phase's status in the phase map.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Edit | Iron Law 3, version 1.5.5.0 |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Edit | UNKNOWN row and order step 4, version 2.2.8.0 |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Edit | Restraint citation, review-severity sentence, floor definition, mechanical floor, three rule tables, UNKNOWN and SKILLED rows, workflow step 2, version 1.5.5.0 |
| `.skilled/skills/sk-code/shared/references/workflow-verify.md` | Edit | Lines 55 and 56, version 2.2.2.0 |
| `.skilled/skills/sk-code/shared/references/workflow-implement.md` | Edit | Lines 41 and 119, version 2.1.4.0 |
| `.skilled/skills/sk-code/shared/references/workflow-debug.md` | Edit | Lines 41 and 147, version 1.1.2.0 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Edit | SKILLED house checklist title, description, trigger phrases, intro, purpose and usage, version 1.0.3.0 |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` | Edit | Private id removed from lines 37 and 57, CHK-CSS-09 at P2, version 1.5.3.0 |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` | Edit | Private id removed from line 40, version 1.5.4.0 |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` | Edit | Runner gate values at lines 53 and 76, the CSS rows that followed CHK-CSS-09, version 1.5.3.0 |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Edit | Neutral pointers at lines 40 and 105, version 2.2.5.0 |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Edit | P0 table pointer at line 222, ESCALATE IF item 1 at line 291, version 1.8.0.0 |
| `.skilled/skills/sk-code/SKILL.md`, `hub-router.json`, `mode-registry.json`, `description.json` | Edit | Hub version 3.4.0.0 |
| `.skilled/skills/sk-code/README.md` | Edit | Newest-entry row names `v3.4.0.0.md`, version 2.2.24.0 |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Edit | Version 2.1.0.0 |
| `.skilled/skills/sk-code/changelog/v3.4.0.0.md` | Create | Hub changelog |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.8.0.0.md` | Create | Quality changelog |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.1.0.0.md` | Create | Skilled changelog |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/sk-code-skilled/SKILL.md` | Regenerate | By `sync-skills-hermes.cjs` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Regenerate | By `compiled-route-manifest.cjs refresh`, then copied over the twin |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-004-doctrine.md` | Create | Packet changelog, by `nested-changelog.js --write` |
| `specs/sk-code/015-quality-agnostic-gate/004-doctrine/` packet docs | Edit | Tasks, criteria, decisions (ADR-003 confirmed, ADR-005 added), goal log, this summary, spec status and derived metadata |
| `specs/sk-code/015-quality-agnostic-gate/spec.md` | Edit | Phase 4 reads Complete in the phase map |
| `specs/sk-code/015-quality-agnostic-gate/graph-metadata.json` | Regenerate | Derived metadata refreshed after the phase-map edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tasks ran in `tasks.md` order. Baselines came first: the drift guards, the four quality bash suites, both `node --test` suites, the whole-tree comment hygiene count and the hub validators. T005 ran its Verify before T006 to T008 added lines above the UNKNOWN row, and ADR-005 records the three line anchors that moved. The derived metadata, router intent signals and leaf manifest needed no change, the three Hermes copies were regenerated, and the stale sk-code activation manifest was re-minted and copied over its authored twin. The first drift-guard run failed doc-claims on a packet-relative code span in workflow step 2. The step now names the full path, and the rerun passed.

The final gate set, run on the final working tree:

| Gate | Output | Exit |
|------|--------|------|
| `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` | `# tests 27`, `# pass 27`, `# fail 0`, the same as the baseline | 0 |
| `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` | `# tests 27`, `# pass 27`, `# fail 0`, the same as the baseline | 0 |
| The four quality bash suites | 95, 11 and 9 PASS lines, and `Post-edit adapter parse regression fixture passed`, the same as the baseline | 0 each |
| `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-*.test.cjs` | `# tests 94`, `# pass 94`, `# fail 0`, run after the manifest re-mint | 0 |
| `verify-doc-claims.cjs` and `verify-router-sync.cjs` | `doc-claims: 4/4 checks passed` and `router-sync: 5/5 checks passed` | 0 each |
| `run-all-drift-guards.sh` | `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`, the same ten as the baseline and none in a touched file | 0 |
| The eight pre-commit mirror checks | 194 runtime mirrors, 11 codex agents, 38 codex prompts, roster OK, catalog OK, 4 hook registration files, 67 Hermes skill copies and 38 Hermes prompts | 0 each |
| `parent-skill-check.cjs .skilled/skills/sk-code` | `all hard invariants passed, 0 warnings`, subject line `Parent skill: .skilled/skills/sk-code` | 0 |
| `compiled-route-guard.cjs` | `All hubs fresh or excused`, after the re-mint. Before it, `Re-mint: sk-code` | 0 |
| `compiled-route-sync.cjs --check` | `all 55 served copies match their authored files` | 0 |
| `ci-leaf-manifest-freshness.cjs` | `checked=14 fresh=14 failed=0` | 0 |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0 fixed=0` | 0 |
| `generate-router-intent-signals.cjs --check --hub sk-code` | `RESULT: PASSED` | 0 |
| `check-gate-inputs.sh` | `RESULT: PASSED` | 0 |
| `validate_document.py` on every changed Markdown file | `VALID`, 0 issues, for each, with `--type changelog` on the three release entries and `--type spec` on the packet docs | 0 each |
| Comment hygiene over `git ls-files` | 63 findings, all under `specs/`, the same lines as the baseline | 1 |
| Comment hygiene over the changed set | Every changed file is Markdown or JSON, so each is skipped with no finding | 2 |
| Private-id and credential greps over the changed set | No private skill id, only the `local-example` fixture name in pre-existing lines, and no credential signature | 1 each |
| `compiled-route.cjs --hub sk-code` on a quality prompt | `action: route` to `sk-code-quality` | 0 |

No workflow changed, so actionlint had nothing to check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Amend Iron Law 3 (ADR-001). Status: accepted, pending operator confirmation at program end | An UNKNOWN repository could not complete the required gate under the old text |
| Make `universal-checklist.md` the SKILLED house checklist (ADR-002). Status: accepted, pending operator confirmation at program end | Foreign repositories should not receive SKILLED's header and spec-root rules |
| Add a review-severity column to the rule tables (ADR-003). Status: accepted, pending operator confirmation at program end | Every row was checked against the loaded `sk-code-review` contract. Eighteen match the default, and error message quality and type-safety were refined where the default named no case |
| Keep the verify handoff line in this phase (ADR-004). Status: accepted, pending operator confirmation at program end | The dispatch assigns the line here, and the envelope fields exist since phase 002 |
| Check three amended lines where they land (ADR-005). Status: accepted, pending operator confirmation at program end | The phase's own additions, and phase 002's rewrite of the quality `SKILL.md`, moved the lines the criteria name |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Tasks T001 to T028 | All ticked with dated evidence in `tasks.md`, deviations recorded beside T002, T010, T012, T015, T019 and T021 |
| Verification checklist | 12 of 12 P0, 13 of 13 P1 and 1 of 1 P2 rows ticked with evidence |
| AC-001 to AC-016 | All sixteen Met. See `acceptance-criteria.md`, whose closure statement lists every observed line |
| Strict validation of this folder (T026) | `validate.sh --strict --no-recursive` printed `Errors: 0` and `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 003 lands first.** Its config file, init route and template are not on main in this worktree. The doctrine names `.sk-code/quality.json` as phase 003's `spec.md` gives it, and the hub and quality changelogs name 3.3.0.0 and 1.7.0.0 as their previous versions. The coordinator re-picks the numbers at landing if the order changes.
2. **The @code RETURN `Quality Gate` field is named before it exists.** `workflow-verify.md` line 56 lists it as one of the three readers, as T017 asks. Phase 005 adds the field.
3. **Private id outside this phase.** Seven tests or fixtures and two released changelog entries in `.skilled/` still name the operator-private id. The open question in spec.md leaves them to the program owner.
4. **The hub route still loads the SKILLED house checklist on every surface.** `ROUTER.md` lists `universal-checklist.md` in its CODE_QUALITY rows, which phase 002 already recorded. `ROUTER.md` belongs to phase 005, so the title now says SKILLED while that route does not.
5. **The committed trigger index still holds the two old trigger phrases.** The retitle replaced them in the checklist, and the trigger-index rebuild workflow refreshes the index after the change reaches main.
6. **Older punctuation stays in lines this phase did not touch.** The frontmatter descriptions of two quality checklists and one sentence in `sk-code-quality/SKILL.md` section 3 still hold an em dash, and the validator accepts them.
<!-- /ANCHOR:limitations -->

---
