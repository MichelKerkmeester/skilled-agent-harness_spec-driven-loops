---
title: "Implementation Summary"
description: "The docs, playbooks, feature catalog, doctor text and hook READMEs now describe the shipped portable quality, review and CI behavior, and the playbooks prove four foreign-repository cases: almost no inline comments, a comment on every function, a refused floor override, and a CI doctor that reads a repository's own switch names."
trigger_phrases:
  - "docs and doctor alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/010-docs-and-doctor-alignment"
    last_updated_at: "2026-10-28T05:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Round B aligned the CI and override docs"
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
| **Status** | Complete (rounds A and B) |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Round B repeated the pass on top of the rebased tree, which adds the CI repository profile and the quality run that applies override sections. A reader of the sk-code docs now finds what ships: a hard floor no repository changes, a `## Rule overrides` section and `commentHygiene.disableRules` for everything else, a review that names its rules on a `Rule sources:` line, and an agent whose verdict follows severity. The setup battery moves from 8 of 9 legs to all 9, and each of the four foreign-repository cases has a playbook scenario that was run.

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

### Round B

- **The run applies override sections.** The quality README, the scripts READMEs, the shared README (now listing the rule registry module and its test), `rule-overrides.md` and the catalog leaves state that a refused section or an unknown rule id is `CONFIG_INVALID` with exit 3, accepted rows land in `rule_overrides` and `p0_p1_p2_decisions`, and two checklists that disagree at one level make the rule unverified. CQ-012 now prints the decisions line with both style rows. CQ-012 and CQ-013 both pass in this tree.
- **The doctor shows what the gate would apply.** `sk-code.md`, the doctor scripts README and the catalog doctor leaf describe the applies block, its sample of one file per first three folders and extension, and the failures it raises. The presentation prints one `Hygiene:` line in the status block and one `Hygiene rules:` line in the applied block, the duplicate in the result summary is gone and the init plan gains the `why:` line the script prints.
- **The CI profile.** The sk-code-ci README gets a profile section, the template and the doctor test row. `SKILL.md`, the router row, the hub README and `SKILL.md` name it, the catalog describes the lookup, shape-based switch detection, ruleset refusal and second confirmation, and the hub playbook scenarios DOC-392 and DOC-394 name the profile key and the protected-workflow confirmation. The sk-code-ci playbook gains `ci-foreign-repository-profile`.
- **README checker failures.** The hook READMEs' unresolved paths are corrected or carry a reason marker, the quality scripts README's two correct count claims carry reason markers, and the review README example uses the contract's placeholders.
- **Release carriers.** The four unlanded entries are extended, sk-code-ci v1.1.6.0 is new, and 19 frontmatter versions are bumped again.
- **Review fixes.** A fresh read-only review returned one P1 and seven P2 claims, each fixed at its line: the hub README's floor list names the security and correctness minimums, the CI usage line and the DOC-392 key list name `--profile` and `profile`, the resolver's exit is 2 on success and 3 on a usage error or a missing path, CR-029 says four resolver lines, the review README's `Rule sources:` example uses the `hub:` form, and two changelog lines no longer claim a rule count or a mode-table change.

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
| Round A stayed silent on whether a quality run applies override rows | The base tree and the other tree disagreed; round B states the shipped behavior now that the tree is rebased |
| CQ-013 states that a refused section ends the run `ERROR`, exit 3 | True in the rebased tree, where the replay printed it |
| The quality `SKILL.md` edit sits on the line about the declarations behind `--explain` | Both sides edited the explain sentence in round A, so the multi-path description moved off the line the other side changed |
| Agents, `_routes.yaml` and `command-contract.json` were not edited | The four agents already state the severity verdict, the marker and the `Quality Gate` field; no route or contract text was stale, so no mirror run was needed |
| The hook and workflow READMEs were edited | They describe the layers that read `commentHygiene.disableRules` |
| The compiled-route manifest and its archived copy were refreshed by the guard's own repair command | Editing `SKILL.md` and the READMEs made the manifest stale and the setup battery red; the pre-commit gate would do the same on commit |
| Presentation hygiene lines: keep `Hygiene:` in the status block and `Hygiene rules:` in the applied block, drop the second `Hygiene:` | The status script prints exactly those two lines, so the document matches what it prints; the summary's `Applies:` line already carries the counts |
| README checker failures: a correct path or placeholder where one exists, a reason marker only where the token is right and cannot resolve | `.git/hooks/` is a git-directory path with no tracked file, and the two bash-suite counts are correct but the checker cannot derive them; every other token was fixed at the doc |
| The sk-code-ci foreign-repository scenario has no `expected_intent` | The router-sync guard replays every scenario that has one as a routing check, and this scenario is an operator run with a mocked `gh`, so it must not be replayed as a routing scenario |
| The CI scenario copies the scripts into the fixture | The scripts resolve the repository root from their own location, so a copy is the only way to run them against a different tree without a profile |
| `--sha` in the scenario's report | It skips the commit search, so the fixture needs no git history |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Round A ran against the base tree before the rebase; round B ran against the rebased tree.

| Check | Result |
|-------|--------|
| Setup battery, round A baseline | 8 of 9 legs, `FAIL drift-guards` on `sk-code-review/scripts/README.md:43: path does not resolve` |
| Setup battery, round B baseline and final state | 9 `PASS` legs, `STATUS=OK legs=9`, exit 0, both times (the final run after the manifest refresh) |
| `verify-doc-claims.cjs` | Round A `3/4` with one unresolved path, then `4/4`; round B final `doc-claims: 4/4 checks passed`, exit 0 |
| Review playbook | `scenarios=34 categories=10` at baseline; `scenarios=37 categories=11 violations=0 warnings=0`, unchanged in round B |
| Quality playbook | `violations=0`, 11 warnings at baseline and after, with CQ-012 extended |
| sk-code-ci playbook | `scenarios=1 categories=1` at the round B baseline; `scenarios=2 categories=2 violations=0 warnings=0`; router-sync check 4 `1/1 checks passed` |
| Hub playbook | `scenarios=28 violations=0 warnings=0` |
| Feature catalog | `validate_catalog_package.py --package sk-code --json` `"verdict": "PASS"`, `violationCount` 0 |
| `validate_document.py --json` over the 64 docs changed since `origin/main` | 63 with 0 issues; `ROUTER.md` reports one `document_type_fallback` and 0 issues with `--type reference` |
| README reference checker over the 14 changed READMEs | Round B baseline: two hook READMEs failed on four paths each. Final: `SUMMARY files=14 pass=14 fail=0`, exit 0 |
| README count checker over the 14 changed READMEs | Round B baseline: the quality scripts README (2 claims) and the review README (1 claim) failed. Final: `SUMMARY files=14 pass=14 fail=0`, exit 0 |
| Canary and its suite | `check-rule-copies.js` exit 0; `check-rule-copies.test.sh` `All rule-canary test cases passed` |
| Quality suite, explicit files | `tests 143 pass 143 fail 0` |
| Shared suite, explicit files | `tests 22 pass 22 fail 0`; `rule-registry.test.cjs` alone `tests 4 pass 4` |
| Five CI suites, explicit files | `tests 64 pass 64 fail 0` |
| Full doctor suite, `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` | `tests 529 pass 529 fail 0`, exit 0 |
| CQ-012 and CQ-013 replay in this tree | Output equals the expected blocks (CQ-013 step 3 `gate ERROR`, `gate exit 3`) |
| CI scenario replay with a mocked `gh` | `profile default`, `errors 0`, `flags none` on three workflows, scaffold Skilled-text count `0`, plan for `ACME_CI_TESTS`, three `REFUSE:` lines with exit 1, write calls `0` |
| `sk-code-quality-config.cjs status` | Printed one `Hygiene:` and one `Hygiene rules:` line; for a fixture with a refused section it printed `STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID` and exited 1 |
| Three live `@review` runs (round A) | Verdicts as in the table above; `check-review-final-line.js` and `check-review-findings.js` exit 0 on all three |
| Hermes sync | Round A `Wrote 4 of 67`; round B `Wrote 2 of 67`; `--check` `PASS: 67 Hermes skill copies in sync` |
| `validate.sh <folder> --recursive --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` |
| `validate.sh <parent> --strict` | `RESULT: PASSED`; any `GRAPH_METADATA_CHILD_DRIFT` warning is the parent's `children_ids`, which the conductor wires |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sample is not the tree.** The doctor's applies block lists the checklists a sample of the tree reaches, so a hub or outside-skill checklist behind a path selector deeper than three folders can go unlisted. The docs say so.
2. **The live review scenarios are agent runs.** They assert the verdict, the rule sources and the finding class, so a different agent wording does not fail them, but a model that misses the planted path traversal would.
3. **The CI scenario is an operator run.** It carries no `expected_intent`, so the router-sync guard does not replay it, and it needs the checkout's node modules on `NODE_PATH`.
4. **DOC-394's live round trip was not rerun.** Its text now names the protected-workflow list and the second confirmation, taken from the toggle script's printed plan with `--no-gh`; the `gh`-authenticated round trip stays an operator run.
5. **The router-reach recheck handoff item** from the review-agent child is not part of this docs child.
<!-- /ANCHOR:limitations -->

---
