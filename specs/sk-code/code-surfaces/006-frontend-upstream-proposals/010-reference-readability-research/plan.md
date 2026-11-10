---
title: "Implementation Plan: Phase 10: reference-readability-research"
description: "Land ten render checks in validate_document.py as warnings first, fix the sk-create-skill templates and guidance that teach the defects, then clear the 27 confirmed sk-code defects with scripts and four DeepSeek V4.1 Flash builds, and finally let package_skill.py --strict block new render defects past a known-debt ledger."
trigger_phrases:
  - "reference readability research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: reference-readability-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the validator and package script, with new code on the standard library only; Markdown for the references, templates and guidance |
| **Framework** | sk-doc `validate_document.py` with `template-rules.json`; sk-create-skill `package_skill.py`; the sk-code hub and its five packets |
| **Storage** | None. One new JSON ledger, `render-known-debt.json`, beside `routing-shape-known-debt.json` |
| **Testing** | `run-script-tests.sh` (pytest), a new `test_render_checks.py`, `package_skill.py --check --strict`, the repo link guard, a scratch anchor check, `run-all-drift-guards.sh`, compiled-route and playbook suites |

### Overview
Track B lands first. The validator gains ten render checks, all warnings and all proven on known-bad fixtures. The sk-create-skill templates and guidance that model the defects are then fixed, so the checks report zero on sk-create-skill. Track A follows: scripts clear the mechanical sk-code defects, four parallel DeepSeek V4.1 Flash max builds clear the authored ones, and the same checks prove both by reporting zero render warnings across sk-code. The last build promotes the render findings under `package_skill.py --strict`, past a ledger seeded from the other skills' current hits, so a new skill cannot ship them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator approves this plan. `spec.md` REQ-003 holds every skill edit until then.
- [ ] The operator rules on the SC-002 wording in `research/research.md` Section 8.
- [ ] `scratch/baseline.txt` holds the starting numbers T002 records.

### Definition of Done
- [ ] `python3 scratch/render-gate.py` prints `render_warnings=0` over every sk-code and sk-create-skill Markdown file, and `invalid=0`.
- [ ] `ONLY_TESTS=test_render_checks.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `PASS test_render_checks.py`, and the full suite matches the T001 baseline.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` prints `0 broken`, and `python3 scratch/check-anchors.py .` prints `broken=0`.
- [ ] `package_skill.py --check --strict` prints `Skill is valid!` for the hub, its five packets and `sk-doc/sk-create-skill`.
- [ ] The frontend rule-id list equals the T002 list.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Check-first remediation. The detector lands before the fixes and proves them. Two documents carry linking contracts that the plan must respect. Rule ids (`P10`, `M-1`, `CHK-CMT-07`) never change. Sections that other files cite by number keep their number (`runner-contract.md` 2-8, `quality-config.md` 3-9, `figma-to-code.md` §5), unless a task names every citation it updates.

### Key Components
- **`validate_document.py` render checks**: one new function group, fence-aware through the existing `_fenced_line_numbers`, called from `validate_document()` after `validate_general_structure`. It is enabled per document type by a `renderChecks` key in `template-rules.json` (reference, asset, skill, skill_router), and every finding is `severity: warning`.
- **sk-create-skill templates and guidance**: `skill-reference-template.md`, `skill-asset-template.md`, `skill-md-template.md`, `skill-router-template.md`, `parent-skill-hub-template.md`, `hub-skill-scaffold.md`, three `references/` files, `creation-workflow.md` and `validation-and-packaging.md`.
- **sk-code references and skill bodies**: the 27 findings in `research/research.md` Section 3.
- **`package_skill.py` render pass**: runs the render checks on `references/` and `assets/`, emits warnings carrying the marker `render check`, promotes them under `--strict`, and tolerates entries in `render-known-debt.json`.

### Data Flow
the gates and `scratch/baseline.txt` (T001, T002) → render checks plus fixtures (T010) → template and guidance fixes (T011 to T013) → sk-code scripts (T020, T021) → four sk-code builds (T022 to T025) → strict promotion plus ledger (T030) → changelogs (T031) → gates (T040 to T046). Each build brief lives in `scratch/`, and this session reads every diff before the next step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-doc/shared/scripts/validate_document.py` | Producer of every doc verdict in the fleet | update: add render checks as warnings | `test_render_checks.py`; full sk-doc suite equals baseline |
| `sk-doc/shared/assets/template-rules.json` | Rule data for every doc type | update: `renderChecks` on four types; `lastSectionPattern: related` on reference, asset and skill | Suite equals baseline; fleet `valid` count unchanged |
| `sk-create-skill/scripts/package_skill.py` | Completion gate for `/create:skill` and `/doctor:sk-skill` | update: render pass promoted under `--strict` past a ledger | `test_package_skill_regressions.py`; strict passes on sk-code and sk-create-skill and on a ledgered skill |
| `sk-create-skill` templates, scaffold and guidance | What every new skill copies | update | `render-gate.py` reports 0 on sk-create-skill |
| `sk-code` references, assets, `SKILL.md`, `ROUTER.md` | Readers' surface | update | `render-gate.py` reports 0 on sk-code; anchors and links stay intact |
| `sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs:31` | Consumer that pins `## 5. QUALITY CHECKLIST MAP` | update the literal with the renumber | `node --test` on that file passes |
| sk-code-review `SKILL.md`, `pr-state-dedup.md` and six playbook files citing `SKILL.md` §9 (18 lines) | Consumers of the section number | update §9 to §8 | `rg -n '§ ?9|[Ss]ection 9\.' .skilled/skills/sk-code/sk-code-review -g '!changelog/**' \| grep -v review-core` prints nothing |
| `sk-code/README.md:132,143`, `sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md:104`, hub `ROUTER.md:49,86,452,470` | Consumers of hub `ROUTER.md` §9 (7 lines) | update §9 to §8 | The T022 `rg` command prints nothing |
| `init_skill.py:648` | Copies `hub-skill-scaffold.md` into each new hub | not a consumer of section numbers; it copies the text | sk-doc suite equals baseline |
| Other skills' docs | Validated by the same script | unchanged: warnings only, debt recorded in the ledger | Fleet `valid` count before and after are equal |

Required inventories:
- Same-class producers: `python3 scratch/render-gate.py --fleet` lists every hit fleet-wide, and the ledger is seeded from that list less sk-code and sk-create-skill.
- Consumers of changed section numbers: `rg -n '(§|[Ss]ection )(8|9|10)\b' .skilled/skills/sk-code` for the hub router and the review skill, and `rg -n 'QUALITY CHECKLIST MAP' .skilled` for the skilled renumber.
- Matrix axes: document type (reference, asset, skill, skill_router, other) by scope (sk-code, sk-create-skill, other skills). The fixture table in T010 holds one positive and one negative row per check.
- Algorithm invariant: a render check never fires inside a fenced block or frontmatter, and never changes `valid` while its severity is warning.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline and writes the two scratch gates. Implementation lands the validator checks, then the template and guidance fixes, then the sk-code scripts and builds, then strict promotion. Verification reruns every gate against the baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each render check: one known-bad fixture flags, one look-alike negative stays clean | `ONLY_TESTS=test_render_checks.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` |
| Unit | Strict promotion and the ledger | `ONLY_TESTS=test_package_skill_regressions.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` |
| Integration | Zero render warnings on sk-code and sk-create-skill; fleet `valid` unchanged | `python3 scratch/render-gate.py` and `python3 scratch/render-gate.py --fleet` |
| Integration | Links and anchors | `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`; `python3 scratch/check-anchors.py .` |
| Regression | sk-code routing and guards | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`; `node --test .skilled/bin/tests/compiled-route-*.test.cjs`; `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` |
| Regression | Playbooks that cite the moved sections | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <playbook dir>` for sk-code, sk-code-review, sk-code-quality and sk-code-frontend |
| Manual | Rendered reading of each file an authoring build touched | Open the diff in a Markdown preview |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode run -m opencode-go/deepseek-v4.1-flash#max`, stdin closed with `</dev/null` | External | Green in phase 009 | No build; stop and ask, never re-route to another provider |
| `python3`, `node`, `pytest` | Internal | Green | No gate |
| The operator's approval of this plan | Internal | Pending | Nothing outside this phase folder may change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed at T002 fails after a task, or a fleet doc that was `valid: true` at T002 turns `valid: false`.
- **Procedure**: each task lands as its own commit, so `git revert <sha>` undoes it. Revert T030 alone to drop strict promotion and keep the warnings. The changes are documentation, rule data and two scripts, so no route needs a republish.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Validator checks ──► Templates and guidance ──► sk-code scripts ──► sk-code builds ──► Strict promotion ──► Changelogs ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (T001 to T003) | Operator approval | Every later task |
| Validator checks (T010) | Setup | All fixes, because they are proven by its output |
| Templates and guidance (T011 to T013) | T010 | T030 |
| sk-code scripts (T020, T021) | T010 | The builds that edit the same files |
| sk-code builds (T022 to T025) | T020, T021 | T030 |
| Strict promotion (T030) | T011 to T025, so sk-code and sk-create-skill seed no debt | T031 |
| Changelogs (T031) | T030 | Verification |
| Verification (T040 to T046) | T031 | Phase close |
<!-- /ANCHOR:phase-deps -->

---

## Plan Review

Second pass, read as a reviewer against `research/research.md`, the scripts on disk and a fresh `rg` for every consumer. It changed the following.

- **Widened the hub router consumers from one line to seven.** The draft named only `sk-code/README.md:143` for the `ROUTER.md` §9 renumber. A wider search found `README.md:132` (a hand-edit instruction) and `sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md:104`. T022 now owns both, and its `rg` covers all three files. Research HUB-1 was corrected to match.
- **Swapped T001 and T002.** The baseline records the fleet `valid: true` count, which needs `render-gate.py --fleet`, so writing the gates now comes first. Every later "matches the baseline" check points at T002.
- **Measured the gate's starting value.** `invalid=0` was an assumption. A run over the 181 sk-code and sk-create-skill files found all of them `valid: true` at HEAD, so the expectation stands, now with evidence.
- **Narrowed T010's reading of the order keys.** The draft read `firstSectionName` and `lastSectionPattern` "wherever declared", which would have put unmeasured warnings on every README in the fleet. T010 now reads them for the four enabled types only, and research Section 8 records the `readme` and `security_policy` keys as a follow-up.
- **Corrected the T010 expectation.** The render gate covers sk-create-skill as well as sk-code, so the first run must list both columns of research Section 6.
- **Replaced the T045 hygiene check.** `rg 'specs/'` over whole files matches legitimate mentions of the `specs/` folder that already exist. The check now reads only added lines from `git diff -U0`.
- **Recounted the checklist.** The summary said 11, 14 and 1. The boxes are 12 P0, 13 P1 and 1 P2.
- **Added T031 and T046 to the data flow and the phase table.** Both were missing from the draft.
- **Kept T031 though it maps to no finding.** CI's `doc-version-raise` job fails a pull request whose changed docs keep their version, so the changelog and version task is process the other tasks need, not added scope.

Coverage check: every confirmed row in `research/research.md` (HUB-1 to HUB-4, CI-1 to CI-4, FE-1 to FE-3, QA-1 to QA-5, RV-1 to RV-4, SK-1 to SK-6, XS-1, TPL-1 to TPL-11, VAL-1 to VAL-6) appears in the `tasks.md` coverage table, and no task edits a file outside those rows, their named consumers or the changelogs. Command check: `package_skill.py` accepts `--check` and `--strict`; `run-script-tests.sh` honours `ONLY_TESTS`; `check-markdown-links.cjs` takes no flags and checks file targets only, which is why T001 adds the anchor check; every test file the tasks name exists. `opencode run --help` is refused by the dispatch hook, so the build command is the packet's recorded form plus the hook's `-m` and `</dev/null` rules.
