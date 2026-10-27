---
title: "Implementation Summary"
description: "The universal quality floor now names each rule with an id and marks it fixed or overridable, the always-loaded style guide holds only universal rules, and this repository's house style and checklist map live with the SKILLED surface."
trigger_phrases:
  - "quality floor and style split implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/003-quality-floor-and-style-split"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Gave the floor rule ids and moved the house style into sk-code-skilled"
    next_safe_action: "Land the phase, add it to the parent's phase map and regenerate the derived files"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md"
      - ".skilled/skills/sk-code/sk-code-skilled/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-quality-floor-and-style-split |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Another repository now gets only rules that hold in any codebase, and it can name any floor rule outside the hard floor in a `## Rule overrides` section. This repository's own code keeps every check it had, because the house style moved to the SKILLED surface instead of disappearing.

### Phase 3: quality-floor-and-style-split

Each floor rule carries an id, such as `floor.input-validation` or `floor.naming`, and a FIXED or overridable mark. The floor points at the override contract's precedence instead of saying surfaces only add rules. The style guide keeps comment discipline, the new rule that a comment describes the code as it is now, and lets a surface define a ceiling marker. The JavaScript and CSS house checks load for SKILLED files only, and `--explain <path>` is how quality answers which checklists apply.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modified | Ids, marks, precedence, house rows and wiring moved out |
| `.skilled/skills/sk-code/shared/references/phase-detection.md`, `stack-detection.md` | Modified | Iron Law 3 sources |
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | Modified | Floor id and mark test |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modified | Universal rules only, CHK-CMT-07, opt-in ceiling marker |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Modified | Three extension rows retired |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`, `manual-testing-playbook/**` | Modified | Explain pointer, wiring label, links and the CQ-001 resources |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modified | `fileFacts`: a file behind the `.skilled/plugins` link counts as hub code, pulled forward from the integration child |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modified | F21 inverted, F21a and F21b added, the map case moved out |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/*.md` | Moved | The JavaScript and CSS house checks, relabelled |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modified | Docs, typing and helper-doc rows |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/**` | Modified | Naming table, `MODULE:` note, `ceiling:` marker, file order, size, formatters, line length, test layout |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`, `scripts/tests/quality-checklist-map.test.cjs` | Modified, Created | Checklist map and its test, routes for the moved files |
| `.skilled/skills/sk-code/mode-registry.json`, `ROUTER.md`, `leaf-manifest.json` | Modified | SKILLED rows, routes, regenerated manifest |
| `.skilled/skills/sk-code/manual-testing-playbook/**` | Modified | The ceiling scenario points at the SKILLED marker |
| Three changelog entries, the version carriers and `.hermes/skills/sk-code*/SKILL.md` | Created, Modified | Release notes, versions, regenerated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines came first: every suite and drift guard, and `--explain` on six SKILLED files. Each new or changed test then ran against the old file it guards and failed, and against the new file and passed. The `--explain` runs were repeated after the change and compared by checklist name. The drift guards, the playbook validator, the parent-skill check, the quality runner and the Hermes check ran on the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The JavaScript and CSS files moved under sk-code-skilled and became SKILLED declaration rows | SKILLED `.js` and `.css` files, including about 2,500 tracked style sheets under sk-design, keep exactly the checks they had, while no other repository gets them |
| The floor keeps universal forms of the moved rows: `floor.type-safety`, `floor.naming` and `floor.documentation` | The contract's example names `floor.documentation`, and a universal rule needs a reachable id for a repository to drop it |
| `floor.ephemeral-pointers` is overridable and maps to the `hygiene.*` ids | Under the contract's machine-checked rule a row changes the agent's and review's judgment, and the runner's check changes only through the hygiene key |
| The file order, size, formatter and line-length rules went to `organization-security-and-examples.md` | That SKILLED reference already holds the file organization and length rules, and no other shared reference cited those sections |
| `rule-overrides.md` joined the hub router beside the floor | The floor now leans on it, and router-sync leg 1b already failed because no router named it |
| Style guide sections keep their numbers | About twenty files and four hook messages cite `code-style-guide.md §4` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Floor id test against the old floor, then the new one | FAIL as expected (fail 1, exit 1), then PASS (shared suite 12/12) |
| F21 against the old quality defaults, then the new ones | FAIL as expected (fail 1, exit 1), then PASS |
| F21b against the HEAD runner, then the fixed one | FAIL as expected (UNKNOWN, fail 1), then PASS |
| F21a against the HEAD registry, then the new one | FAIL as expected (fail 1), then PASS |
| F21c (plugins link to `..` and `../..`) on the round 1 code, then the guarded code | FAIL as expected (fail 2), then PASS. F21d (dangling and looping links) PASS |
| `--explain` on the 43 plugin files and links, HEAD tree against the new tree | 43 SUPERSET, UNKNOWN with 4 checklists to SKILLED with 5 |
| Checklist map test against the old quality defaults, then the new ones | FAIL as expected (fail 3, exit 1), then PASS (3/3) |
| `node --test` quality suite | 127/127: the target map case moved to sk-code-skilled, F21a to F21d added |
| `node --test` sk-code-skilled suite | 36/36 (33 before, plus the three map cases) |
| Comment hygiene, ceiling report and rule canary shell suites | exit 0 each, canary 80 PASS |
| `run-all-drift-guards.sh` | PASS on all four guards. Before the change router-sync leg 1b failed on `rule-overrides.md` |
| `--explain` on six SKILLED samples, before and after | Same checklist names on all six |
| `validate-playbook-package.cjs` on both changed packages | exit 0, 0 violations |
| `quality-gate.cjs --format text` on the change | `gate=NO_BLOCKER_FOUND exit=0`, findings 0 |
| `parent-skill-check.cjs .skilled/skills/sk-code` | OK, 13a, 13b and 13d PASS |
| `validate_document.py` on every changed doc and the three changelogs | 0 blocking issues. ROUTER.md and the two playbook roots carry one document-type fallback warning |
| `sync-skills-hermes.cjs --check` | PASS: 67 Hermes skill copies in sync |
| `validate.sh` on this folder, strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only archived spec fixtures lose the JavaScript and CSS rows.** The 24 plugin files under `.opencode/plugins/` and the 19 links to them resolved to no surface because `.skilled/plugins` links outside `.skilled/`. Review round 1 pulled the fix forward from the integration child, `009-integration-fixes`: `fileFacts` counts the link target as hub code unless that target holds the hub, and `--explain` on all 43 now lists a superset of the old checklists. JavaScript files under `specs/` stay UNKNOWN and get the floor alone.
2. **Rows the private web surface needs, for the operator.** That surface's `graph-metadata.json` `quality` block needs these rows, with the three files copied from `sk-code-skilled/assets/checklists/js-css-style/` into the private skill, because an outside skill's row must name a file inside its own folder:
   ```json
   "quality": {"checklists": [
     {"extensions": [".js", ".css"], "file": "assets/checklists/js-css-style/overview-header-and-comments.md"},
     {"extensions": [".js", ".css"], "file": "assets/checklists/js-css-style/naming-init-formatting-and-css.md"},
     {"extensions": [".js", ".css"], "file": "assets/checklists/js-css-style/verification-quick-reference-and-related.md"}
   ]}
   ```
   CHK-CMT-07 is no longer in those files, because the universal style guide carries it.
3. **Derived files left for landing.** The trigger index, the retrieval corpus manifest and the compiled-routing activation manifest for sk-code, which hashes the hub router, are regenerated by the conductor after the rebase.
4. **The router vocabulary reach gate could not run here.** `ci-router-vocabulary-reach.cjs` reported 85 probe errors because the local advisor answered degraded, the same for every hub.
<!-- /ANCHOR:limitations -->
