---
title: "Implementation Summary"
description: "The docs, playbooks, feature catalog, doctor text and hook READMEs now describe the shipped portable quality and review behavior, and both playbooks prove the three foreign-repository cases: almost no inline comments, a comment on every function, and a refused floor override."
trigger_phrases:
  - "docs and doctor alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/010-docs-and-doctor-alignment"
    last_updated_at: "2026-10-28T05:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Aligned the docs, playbooks, catalog, doctor text and hook docs; ran the gates"
    next_safe_action: "Conductor merges and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/README.md"
      - ".skilled/skills/sk-code/sk-code-review/manual-testing-playbook/foreign-repository-rules/"
      - ".skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/floor-override-refused.md"
      - ".skilled/skills/sk-code/feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md"
      - ".skilled/commands/doctor/assets/doctor-sk-code-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "docs-and-doctor-alignment-implementer"
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
| **Spec Folder** | 010-docs-and-doctor-alignment |
| **Status** | Complete (round A) |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the sk-code docs now finds what ships: a hard floor no repository changes, a `## Rule overrides` section and `commentHygiene.disableRules` for everything else, a review that names its rules on a `Rule sources:` line, and an agent whose verdict follows severity. The setup battery moves from 8 of 9 legs to all 9, and each of the three foreign-repository cases has a playbook scenario that was run.

### Documents

- **Review mode.** The README, the single-pass reference and the scripts README describe the floor, the default lens, the `Rule sources:` line and the agent's severity verdict. The scripts README's broken linter path, which failed the drift guard before any edit, is fixed and its fixture tree lists all sixteen fixtures.
- **Quality mode.** The README gains a section on the rules a repository can change. The scripts and library READMEs describe the multi-path explain output and the hygiene helpers, and `SKILL.md` carries the same explain description.
- **SKILLED, hub and shared.** The SKILLED README says the house style lives there. The hub README adds the levers, the shared README says the modes read their overrides through the linter, and the contract's scope states who applies a row.
- **Feature catalog.** Three new leaves (rule overrides and the hygiene policy, the review floor and lens, the agent's verdict), three updated leaves and an updated root.
- **Doctor, hooks and CI.** The doctor text shows the disabled hygiene rules and the init suggestion, and the pre-commit, hook and workflow READMEs name the config key.
- **Root README.** The sk-code, review agent and quality doctor bullets match the shipped behavior.

### Playbook scenarios

| Id | Case | Proven by |
|----|------|-----------|
| CR-029 | A repository that wants almost no inline comments: quality not blocked once `commentHygiene.disableRules` and a `## Rule overrides` row are set, and review raises no documentation finding | Fixture builder, resolver, a live `@review` run read `APPROVED` with both rows under `Overrides:` |
| CR-030 | The opposite repository that wants a comment on every function: the review raises it | A live run read `APPROVED` with a P2 finding for the undocumented functions under the replaced documentation rule |
| CR-031 | A floor override refused | A live run read `REQUESTED_CHANGES` with `Overrides: none. Refused: docs/code-style.md` and a P0 path traversal finding |
| CQ-012 | Quality gate with and without `commentHygiene.disableRules` | `exit_code 0` and `disabled hygiene.issue`; without the key `exit_code 1` and one `hygiene.issue` finding |
| CQ-013 | A floor row and a fixed hygiene id refused | Linter exit 1, resolver `refused true rows 0`, gate `ERROR`, exit 3 |

### Release carriers

sk-code v3.9.14.0, sk-code-quality v1.13.8.0, sk-code-review v1.9.7.0 and sk-code-skilled v2.1.9.0, with the hub's `description.json`, `hub-router.json` and `mode-registry.json` stepped, 17 frontmatter versions bumped, the compiled-route manifest and its archived copy refreshed, and four Hermes copies rewritten.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gates were baselined first (both playbook validators, the canary, the setup battery), then the surfaces were searched and the stale-claim table written. The three fixtures were built, run through the linter, the resolver and the runner, and reviewed by a live `@review` agent, and the saved output became the playbooks' expected output. The docs were then edited at their owners, the changelogs written, the carriers stepped and the generators run. When the work was nearly done, `origin/main` was found to hold the child that makes the quality run apply override sections, so CQ-012 and CQ-013 were replayed against an archive of that tree and the docs that claimed otherwise were neutralized.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| New ids CR-029 to CR-031 and CQ-012 to CQ-013 | CR-028 and CQ-011 are the highest ids and CR-019 is unassigned; the brief says use the next free ids and never renumber |
| Review playbook sections 17 and 18 became 18 and 19, with the new category as section 17 | The root lists categories before the cross-reference sections, so a new category goes ahead of them; scenario ids stay, and the four internal section references were updated |
| The changed docs say nothing about whether a quality run applies override rows | The brief says the run does not apply them, but `origin/main` already does; staying silent keeps the docs true on both trees, and round B documents the run |
| CQ-013 states the `origin/main` result for a refused section (`gate ERROR`, exit 3) | The conductor merges onto `origin/main`, where it is true; in this tree the same step exits 0 because the run reads no override sections |
| The quality `SKILL.md` edit moved off the line `origin/main` changed | Both sides edited the explain sentence; the multi-path description now sits on the line about the declarations behind `--explain` (line 180 of `HEAD`), and the other side changed lines 5, 124, 190, 207 and 239 of the same file |
| Agents, `_routes.yaml` and `command-contract.json` were not edited | The four agents already state the severity verdict, the marker and the `Quality Gate` field; no route or contract text was stale, so no mirror run was needed |
| The hook and workflow READMEs were edited | They describe the layers that read `commentHygiene.disableRules`; the workflows README row may overlap round B's CI profile row |
| The compiled-route manifest and its archived copy were refreshed by the guard's own repair command | Editing `SKILL.md` and the READMEs made the manifest stale and the setup battery red; the pre-commit gate would do the same on commit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Setup battery, baseline | 8 of 9 legs, `FAIL drift-guards` on `sk-code-review/scripts/README.md:43: path does not resolve` |
| Setup battery, final state | 9 `PASS` legs, `STATUS=OK legs=9`, exit 0 |
| `verify-doc-claims.cjs` | `3/4` with one unresolved path, then `doc-claims: 4/4 checks passed`, exit 0 |
| Review playbook | `scenarios=34 categories=10` at baseline; `scenarios=37 categories=11 violations=0 warnings=0` |
| Quality playbook | `violations=0`, 11 warnings at baseline and after |
| Hub playbook | `scenarios=28 violations=0 warnings=0` |
| Feature catalog | `validate_catalog_package.py --package sk-code --json` `"verdict": "PASS"`, exit 0 |
| `validate_document.py --json` over 39 changed or new docs | `39 files, with issues: 0` |
| Four changelogs | `total_issues` 0 each |
| README reference checker | `PASS` on every changed README except the two hook READMEs, which fail on four paths each that this child did not write |
| README count checker | Fails two READMEs on lines present at `HEAD` (a bash suite count and a template example); the new wording that failed was reworded |
| Canary and its suite | `check-rule-copies.js` exit 0; `check-rule-copies.test.sh` `All rule-canary test cases passed` |
| Quality suite | `tests 137 pass 137 fail 0` |
| Shared suite | `tests 18 pass 18 fail 0` |
| Doctor script suite | `pass 485 fail 0` |
| CQ-012 and CQ-013 replay on an `origin/main` archive | Output equals the expected block |
| Three live `@review` runs | Verdicts as in the table above; `check-review-final-line.js` and `check-review-findings.js` exit 0 on all three |
| Hermes sync | `Wrote 4 of 67 Hermes skill copies`; `--check` `PASS: 67 Hermes skill copies in sync` |
| `validate.sh <folder> --recursive --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` |
| `validate.sh <parent> --strict` | `Errors: 0`, `RESULT: PASSED`, with one warning, `GRAPH_METADATA_CHILD_DRIFT`: the parent's `children_ids` lacks this child until the conductor wires it in |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Merge overlap with `origin/main`.** The other side also edited `sk-code-quality/SKILL.md` (different lines), `doctor-sk-code-presentation.txt`, `doctor-sk-code-quality.yaml`, the sk-code and sk-code-quality version carriers and the quality changelog folder. The conflicts are textual: keep both sides' text, and renumber the changelogs above 3.9.13.0 and 1.13.7.0 if they collide. The doctor presentation then carries a `Hygiene:` line here and a `Hygiene rules:` line there, which can be merged into one.
2. **CQ-013 step 3 needs the `origin/main` runner.** In this tree alone the gate exits 0 over a refused section; after the merge it exits 3.
3. **Round B is open.** The CI profile mode, its workflow row, the applied-rules block of the doctor and the run recording its overrides are not documented here beyond what the merge brings.
4. **The router-reach recheck handoff item** from the review-agent child is not part of this docs child.
5. **The live review scenarios are agent runs.** They assert the verdict, the rule sources and the finding class, so a different agent wording does not fail them, but a model that misses the planted path traversal would.
<!-- /ANCHOR:limitations -->

---
