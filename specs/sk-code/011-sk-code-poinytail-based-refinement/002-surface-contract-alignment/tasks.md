---
title: "Tasks: Phase 2: surface-contract-alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface contract alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: surface-contract-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Run every command from the repository root, with `S=specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch`. Every task below writes only into `$S`. Read each command's output and its exit status.

- [x] T001 Capture the precedence baseline: `rg -n "OPENCODE >" .skilled/skills/sk-code --glob '!**/benchmark/reports/**' --glob '!**/changelog/**' > $S/before-precedence.txt`. The plan-time result was 7 lines, and only `shared/references/universal/code-quality-standards.md:53` lacks OBSIDIAN (`$S/before-precedence.txt`) Evidence: 7 lines; only 'code-quality-standards.md:53' lacks OBSIDIAN.
- [x] T002 Capture the stale surface-list baseline: `rg -n -i "OPENCODE.? over .?WEBFLOW|WEBFLOW ?/ ?OPENCODE ?/ ?UNKNOWN|WEBFLOW, OPENCODE, or UNKNOWN|Webflow vs OpenCode vs UNKNOWN|WEBFLOW or OPENCODE\)|WEBFLOW \+ OPENCODE \+ MOTION_DEV" .skilled/skills/sk-code --glob '!**/benchmark/reports/**' --glob '!**/changelog/**' > $S/before-surface-lists.txt`. The plan-time result was 14 lines (`$S/before-surface-lists.txt`) Evidence: 14 matches.
- [x] T003 [P] Run the two-stage probe loop from `plan.md` §5 with `TAG=before`. The plan-time output is the table in `plan.md` §5 (`$S/before-probes.tsv`) Evidence: 6 rows; routes match the expected surfaces. Confidence scores differ from the plan-time table.
- [x] T004 [P] Run the SA-001 battery loop from `plan.md` §5 with `TAG=before`. The plan-time result was sk-code top-1 on 11 of 15 positives and on 2 of 5 negatives (`$S/before-sa001.tsv`) Evidence: sk-code top-1 on 11/15 positives and 2/5 negatives.
- [x] T005 [P] Capture compiled-routing state: `node .skilled/bin/compiled-route-status.cjs --hub sk-code --pretty > $S/before-status.json`, `node .skilled/bin/compiled-route-guard.cjs > $S/before-guard.txt`, and `node .skilled/bin/compiled-route-admission.cjs --hub sk-code > $S/before-admission.txt`. Plan-time results: status `causeCode` `compiled-serving` with `effectivePolicyHash` `128cfc2b105f9fdc9a76f92fbdddacb2c9867df0daf0090f21dd4d16f1dcccb8`; guard lists all 7 hubs `fresh`, exit 0; admission `pass`, exit 0 (`$S/before-status.json`) Evidence: 'compiled-serving', expected policy hash, all 7 hubs fresh, admission pass.
- [x] T006 [P] Run the canary assertion from `plan.md` §5 and save its output to `$S/before-canary.txt`. Expect `cases 9 failures 0`, exit 0 (`$S/before-canary.txt`) Evidence: 'cases 9 failures 0'.
- [x] T007 [P] Run `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py > $S/before-stack-folders.txt; echo "exit=$?" >> $S/before-stack-folders.txt`. Expect exit 0 and an OK line naming 6 folders: config, javascript, python, rust, shell, typescript (`$S/before-stack-folders.txt`) Evidence: 6 folders listed, 'exit=0'.
- [x] T008 [P] Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh 2>&1 | grep -E '^(PASS|FAIL|run-all)' > $S/before-drift-guards.txt`. Plan-time result: `FAIL: alignment-drift`, `PASS: stack-folders`, exit 1. The alignment-drift failure is pre-existing and comes from files outside sk-code (`$S/before-drift-guards.txt`) Evidence: 'PASS: alignment-drift', 'PASS: stack-folders'; differs from the plan-time red baseline.
- [x] T009 [P] Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code > $S/before-parent-check.txt` (plan-time: OK, 0 warnings, exit 0) and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package sk-code > $S/before-playbook.txt` (plan-time: `PASS package=sk-code`, `scenarios=32`, `operator=31`, `violations=0`, exit 0) (`$S/before-parent-check.txt`) Evidence: hard invariants passed with 0 warnings; 'scenarios=32', 'operator=31', 'violations=0'.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Line numbers are the pre-edit numbers observed at plan time. Deleting the blank line in T014 shifts every later `SKILL.md` line up by one, so match each edit on the quoted text. Do not touch the machine-readable block in `ROUTER.md` §11 (line 316 onward).

**Shared references**

- [x] T010 Replace `surface precedence (OPENCODE > WEBFLOW > UNKNOWN)` with `surface precedence (OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN)`. Change nothing else on the line, because phase 003 rewrites the ladder above it (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:53`) Evidence: line 53 has the required order.
- [x] T011 Delete the blank line between the OPENCODE row (`:29`) and the OBSIDIAN row (`:31`) so the four surface rows form one table (`.skilled/skills/sk-code/shared/references/stack-detection.md:30`) Evidence: surface rows are contiguous.
- [x] T012 In the Motion.dev note, replace `Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first` with `Surface detection still chooses OPENCODE, OBSIDIAN, WEBFLOW, or UNKNOWN first` (`.skilled/skills/sk-code/shared/references/stack-detection.md:34`) Evidence: updated surface order appears.
- [x] T013 Replace `Surface detection (WEBFLOW / OPENCODE / UNKNOWN)` with `Surface detection (OPENCODE / OBSIDIAN / WEBFLOW / UNKNOWN)` in the `stack-detection.md` row of the references table (`.skilled/skills/sk-code/shared/README.md:31`) Evidence: updated surface list appears.

**Hub SKILL.md** (`.skilled/skills/sk-code/SKILL.md` is a compiled-router input, so every edit here changes the sk-code policy hash; see `plan.md` §3)

- [x] T014 Delete the blank line between the `sk-code-opencode` row (`:37`) and the `sk-code-obsidian` row (`:39`) in the surface-axis table (`.skilled/skills/sk-code/SKILL.md:38`) Evidence: Obsidian row is contiguous.
- [x] T015 Replace ``or `sk-code-webflow`, `sk-code-opencode` (surface)`` with ``or `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian` (surface)`` (`.skilled/skills/sk-code/SKILL.md:67`) Evidence: 'sk-code-obsidian' is listed.
- [x] T016 Replace the first `UNKNOWN_FALLBACK_CHECKLIST` item with `"Confirm whether this is sk-code-quality, sk-code-review, Webflow, OpenCode, or Obsidian work",`. Keep the double quotes and the trailing comma, and add no apostrophe or quote character inside the string, because the compiler extracts items with `["']([^"']+)["']` and needs at least three (`registry-compiler.cjs:85-92`) (`.skilled/skills/sk-code/SKILL.md:79`) Evidence: Obsidian is named.
- [x] T017 Replace the sentence that begins ``Surface detection (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`, with `OPENCODE` over `WEBFLOW` precedence)`` with: ``Surface detection (`OPENCODE`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`, at precedence OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN) lives once in the hub's `shared/` layer and is consumed by every mode and surface. `MOTION_DEV` is a resource intent loaded after the surface decision, not a surface. Modes own workflow contracts, not surface identity.`` (`.skilled/skills/sk-code/SKILL.md:136`) Evidence: precedence and Motion.dev resource intent are stated.
- [x] T018 In the Layout block, insert `  sk-code-obsidian/      # obsidian surface packet (read-only evidence)` after the `sk-code-opencode/` line (`.skilled/skills/sk-code/SKILL.md:156`) Evidence: Obsidian packet row appears.
- [x] T019 In the Backend paragraph, replace `It centralizes WEBFLOW, OPENCODE, and MOTION_DEV detection and precedence,` with `It centralizes OPENCODE, OBSIDIAN, WEBFLOW, and UNKNOWN detection and their precedence (MOTION_DEV is a resource intent resolved after the surface, not a surface),`, and replace ``(`sk-code-webflow/`, `sk-code-opencode/`)`` with ``(`sk-code-webflow/`, `sk-code-opencode/`, `sk-code-obsidian/`)`` (`.skilled/skills/sk-code/SKILL.md:163`) Evidence: Obsidian and updated precedence are stated.
- [x] T020 Replace ``- Surface evidence packets: `sk-code-webflow/SKILL.md`, `sk-code-opencode/SKILL.md`.`` with ``- Surface evidence packets: `sk-code-webflow/SKILL.md`, `sk-code-opencode/SKILL.md`, `sk-code-obsidian/SKILL.md`.`` (`.skilled/skills/sk-code/SKILL.md:193`) Evidence: Obsidian packet is listed.

**ROUTER.md** (prose only; `ROUTER.md` is not a compiled-router input)

- [x] T021 In both stack-detection link lines, replace `surface detection (WEBFLOW/OPENCODE/UNKNOWN)` with `surface detection (OPENCODE/OBSIDIAN/WEBFLOW/UNKNOWN)` (`.skilled/skills/sk-code/ROUTER.md:45`, `.skilled/skills/sk-code/ROUTER.md:300`) Evidence: both updated surface descriptions appear.
- [x] T022 In the overview, replace `a detected surface (WEBFLOW / OPENCODE / UNKNOWN)` with `a detected surface (OPENCODE / OBSIDIAN / WEBFLOW / UNKNOWN)` at `:26`; replace `determines WEBFLOW / OPENCODE / UNKNOWN` with `determines OPENCODE / OBSIDIAN / WEBFLOW / UNKNOWN` at `:30`; at `:37`, replace `(Webflow vs OpenCode vs UNKNOWN)` with `(OpenCode vs Obsidian vs Webflow vs UNKNOWN)` and `loaded after either surface, not a third surface` with `loaded after the surface decision, not a surface` (`.skilled/skills/sk-code/ROUTER.md:26-37`) Evidence: Obsidian appears in the overview and Motion.dev wording.
- [x] T023 In the UNKNOWN fallback, replace ``Is this Webflow/frontend code or `.skilled/` system code?`` with ``Is this Webflow/frontend code, `.skilled/` system code, or Obsidian plugin code?`` at `:260`; replace `Canonical sk-code only owns WEBFLOW + OPENCODE + MOTION_DEV.` with `Canonical sk-code only owns the WEBFLOW, OPENCODE and OBSIDIAN surfaces plus the MOTION_DEV resource category.` at `:265`; replace `(WEBFLOW or OPENCODE)` with `(OPENCODE, OBSIDIAN or WEBFLOW)` at `:271` (`.skilled/skills/sk-code/ROUTER.md:260-271`) Evidence: Obsidian appears in all three specified lines.

**Playbook text that restates precedence or the surface list**

- [x] T024 [P] Replace `surface precedence (OPENCODE over WEBFLOW over UNKNOWN)` with `surface precedence (OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN)` (`.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md:13`) Evidence: required precedence appears.
- [x] T025 [P] Make the T012 replacement in both copies of the Motion.dev note (`.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/decision-matrix-routing.md:24`, `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/snippet-reuse-cross-stack.md:24`) Evidence: both files have the updated surface order.
- [x] T026 [P] Replace `The detected code surface (WEBFLOW / OPENCODE / UNKNOWN)` with `The detected code surface (OPENCODE / OBSIDIAN / WEBFLOW / UNKNOWN)` (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:91`) Evidence: updated surface list appears.

**D3: stack-folder scenario**

- [x] T027 Rewrite the DR-004 index row to match the scenario file and the validator. Set the Exact Prompt to `Run the language reference folder validator, confirm a clean pass, then add an orphan references/<fake-language> folder and confirm it fails.`, which is the prompt at `stack-folders-validator.md:28`. In the command sequence, replace ``mkdir orphan `assets/zzz_fake_surface` `` with ``mkdir orphan `references/zzz_fake_language` ``. In Pass/Fail, replace ``an orphan folder in `references/` or `assets/` produces exit 1`` with ``an orphan folder in `references/` produces exit 1``. In Failure Triage, replace ``verify both `references/` and `assets/` trees are scanned`` with ``verify every directory directly under `references/` is scanned``. Keep the Feature ID, the Feature Name and the evidence paths (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:293`) Evidence: prompt, command path, pass/fail and triage text updated.
- [x] T028 Replace the five-language list `config, javascript, python, shell, typescript` with `config, javascript, python, rust, shell, typescript` at `:33` and `:54`. At `:74`, replace the quoted OK line with the exact OK line from `$S/before-stack-folders.txt` (T007), copied byte for byte (`.skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md:33,54,74`) Evidence: OK: 6 language folder(s) all resolve — config, javascript, python, rust, shell, typescript (exit 0)

**Obsidian scenario and probes**

- [x] T029 Create SD-004, modeled section for section on `surface-detection/opencode-detection.md`: frontmatter `title: "SD-004: OBSIDIAN Surface Detection"`, a one-line `description`, `version: 1.0.0.0`; then §1 OVERVIEW, §2 SCENARIO CONTRACT, §3 TEST EXECUTION, §4 SOURCE FILES and §5 SOURCE METADATA. Use the prompt `Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention.` Expected detection: surface `OBSIDIAN` from the repo-root markers in `shared/references/stack-detection.md:46-51`. Expected stage one: advisor top-1 `sk-code` at 0.80 or higher (plan-time 0.9448). Expected stage two: `compiled-route.cjs` returns `route` / `single` / `sk-code-obsidian`. Expected references: the three `DEFAULT_RESOURCE` files (`ROUTER.md:320-324`) plus `sk-code-obsidian/references/db-class-naming.md` from the `OBSIDIAN_PLUGIN` map (`ROUTER.md:555-559`). Expected NOT loaded: any `sk-code-webflow/references/*` or `sk-code-opencode/references/*`. Evidence files: `/tmp/skc-SD004-advisor.txt`, `/tmp/skc-SD004-route.txt`. Metadata: Group Surface Detection, Playbook ID SD-004, Critical path No, read-only. Link the packet-level positive control OB-020 at `sk-code-obsidian/manual-testing-playbook/surface-detection/obsidian-surface-resolution.md` in §4 (`.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md`, new) Evidence: PASS SD-004 structure, prompt, references, evidence paths, metadata, no added em dash
- [x] T030 Register SD-004 in the playbook index: change the heading ``## 7. SURFACE DETECTION (`SD-001..SD-003`)`` to ``## 7. SURFACE DETECTION (`SD-001..SD-004`)`` at `:189`; add an SD-004 row after the SD-003 row at `:195`, using the same nine columns and the T029 values; change `(SD-001, SD-002, SD-003)` to `(SD-001, SD-002, SD-003, SD-004)` at `:332`; add a row after `:356` in the same shape as the SD-003 row above it, with Category `Surface Detection`, Feature ID `SD-004`, a Per-Feature File link whose label and target are both `surface-detection/obsidian-detection.md`, and Critical Path `No`; change `**Total scenarios**: 31` to `32` at `:386`. Leave the critical-path lists at `:145`, `:151` and `:387` unchanged (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`) Evidence: heading and index include SD-004; Total scenarios: 32
- [x] T031 Add two Obsidian positive controls after the P15 row: ``| P16 | OBSIDIAN | TypeScript | `Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention.` |`` and ``| P17 | OBSIDIAN | TypeScript | `Add a status column to the Obsidian plugin data layer and register the view with the plugin's onload in src/main.ts.` |``. Both scored sk-code at 0.80 or higher at plan time (0.9448 and 0.95) (`.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:41`) Evidence: both OBSIDIAN probe rows present
- [x] T032 Update the battery counts to match T031: `P1-P15 / N1-N5` becomes `P1-P17 / N1-N5` at `:19`; `(≥12 of 15)` becomes `(≥14 of 17)` at `:58`; `fewer than 12 of 15` becomes `fewer than 14 of 17` at `:59`; `(P1-P15, N1-N5)` becomes `(P1-P17, N1-N5)` at `:72`; `20+ JSON lines` becomes `22+ JSON lines` at `:89`. In the playbook index, `sk-code wins ≥12 of 15 positives` becomes `sk-code wins ≥14 of 17 positives` (`advisor-probe-battery.md`, `manual-testing-playbook.md:229`) Evidence: P1-P17; threshold ≥14 of 17; 22+ JSON lines

**Canary fixture**

- [x] T033 Insert this case into `cases` directly after the `surface-bundle-reference` case, which closes at `:77`, keeping 2-space JSON indentation and valid commas (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:77`): Evidence: cases 10; new_case_after surface-bundle-reference

  ```json
  {
    "id": "surface-bundle-obsidian",
    "prompt": "code review my obsidian plugin",
    "riskSlice": "actor:mutating:composite",
    "certificateFixture": "valid-composite",
    "expectedAction": "route",
    "expectedSelectionKind": "surfaceBundle",
    "expectedModes": ["sk-code-review", "sk-code-obsidian"],
    "gold": {
      "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
      "expectedResources": []
    }
  }
  ```

- [x] T034 Copy the edited fixture over its authored copy so a later `compiled-route-sync.cjs` rebuild keeps the new case: `cp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, then `cmp` the two files; expect no output and exit 0 (`specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`) Evidence: no output; exit 0
- [x] T035 Re-mint the sk-code manifest. Run this only after every `SKILL.md` edit (T014-T020) is in place, because any later `SKILL.md` byte change stales the manifest again. (1) Record the interim state: `node .skilled/bin/compiled-route-guard.cjs > $S/interim-guard.txt; echo "exit=$?" >> $S/interim-guard.txt` should list sk-code as stale with a non-zero exit, and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "code review my obsidian plugin" > $S/interim-route.json` should hold `{"servingAuthority":"legacy","hubId":"sk-code"}`. (2) Run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code > $S/remint.json` and expect exit 0 with `"fresh":true` and `"refreshed":true` in the output. (3) Run `cp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` and `cmp` the two files; expect no output and exit 0. (4) Prove compiled serving: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "code review my obsidian plugin" | jq -e '.action == "route" and (has("servingAuthority") | not)'` prints `true` and exits 0, and `node .skilled/bin/compiled-route-guard.cjs` lists sk-code as `fresh` and exits 0 (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`, `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`) Evidence: fresh:true; refreshed:true; route=true; sk-code fresh
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T036 REQ-001: `rg -n "OPENCODE >" .skilled/skills/sk-code --glob '!**/benchmark/reports/**' --glob '!**/changelog/**' | tee $S/after-precedence.txt | grep -vc "OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN"` prints `0`, and `$S/after-precedence.txt` holds the 7 lines from T001 plus `SKILL.md:136` and `design-restraint-ladder.md:13`, and one more if the new SD-004 file quotes the order. The globs exclude the frozen reports under `benchmark/reports/compiled-routing/`, which quote the old line inside recorded model output, and the historical `changelog/` entries, as REQ-001 now states (`$S/after-precedence.txt`) Evidence: 0; 9 precedence lines; wrapper exit 0
- [x] T037 SC-001: rerun the T002 command into `$S/after-surface-lists.txt`. Expect no output, since T013 fixes `shared/README.md:31`, the only line left after the other edits. Then run `sed -n '260p;265p;271p' .skilled/skills/sk-code/ROUTER.md` and confirm each line names Obsidian (`$S/after-surface-lists.txt`) Evidence: no stale matches; lines 260, 265 and 271 name Obsidian
- [x] T038 REQ-002: rerun the canary assertion from `plan.md` §5 into `$S/after-canary.txt`. Expect `OK surface-bundle-obsidian route surfaceBundle sk-code-review,sk-code-obsidian` and `cases 10 failures 0`, exit 0 (`$S/after-canary.txt`) Evidence: OK surface-bundle-obsidian route surfaceBundle sk-code-review,sk-code-obsidian; cases 10 failures 0
- [x] T039 REQ-002: after T035, rerun the three T005 commands into `$S/after-status.json`, `$S/after-guard.txt` and `$S/after-admission.txt`. Expect status `causeCode` `compiled-serving` with a new `effectivePolicyHash` and `manifestFreshness.fresh` true; guard lists every hub `fresh`, exit 0; admission `pass`, exit 0. Also confirm `cmp` still finds both fixture copies and both manifest copies identical (`$S/after-status.json`) Evidence: compiled-serving; fresh true; pass; both cmp commands exit 0
- [x] T040 Routing change report: rerun the two-stage probe loop with `TAG=after`, then `diff $S/before-probes.tsv $S/after-probes.tsv`. The expected output is empty. Report every differing line verbatim. A compiled column reading `servingAuthority:"legacy"` means T035 did not take effect and fails REQ-002 (`$S/after-probes.tsv`) Evidence: diff empty; exit 0
- [x] T041 SC-002: rerun the SA-001 loop with `TAG=after`, then compare each probe with its own baseline: `join -t $'\t' -a 2 -e NONE -o 0,1.2,2.2 <(sort $S/before-sa001.tsv) <(sort $S/after-sa001.tsv) | awk -F'\t' '{split($2,b," ");split($3,a," ");v="OK"; if($2=="NONE"){if(!(a[1]=="sk-code"&&a[2]+0>=0.80))v="FAIL-NEW"} else if($1~/^P/){if(b[1]=="sk-code"&&(a[1]!="sk-code"||a[2]+0<b[2]+0))v="WORSE"} else if($1~/^N/){if(b[1]!="sk-code"&&a[1]=="sk-code")v="WORSE"} if(v!="OK")bad++; print v"\t"$0} END{print "worse_or_failed="bad+0; exit bad>0}' > $S/sa001-compare.txt`. Worse means: a positive that sk-code won before is now lost or scores lower, or a negative that sk-code did not win before is now won. P16 and P17 have no baseline row and pass only when sk-code is top-1 at 0.80 or higher. Expect `worse_or_failed=0` and exit 0. Apply the same rule to the advisor column of the six T003 probes, using the `diff` from T040. The battery's aggregate verdict, which already fails at baseline, is out of scope and is reported only as a number (`$S/sa001-compare.txt`) Evidence: 22 rows; worse_or_failed=0
- [x] T042 REQ-003: `rg -n "sk-code-obsidian" .skilled/skills/sk-code/SKILL.md` shows the surface table row plus the mode-keys, layout, backend and references lines; `rg -n "Obsidian work" .skilled/skills/sk-code/SKILL.md` shows the checklist item; `rg -c "OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` prints 2 or more; `test -f .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md && echo present` prints `present` (`.skilled/skills/sk-code/SKILL.md`) Evidence: counts 8, 1, 2; present
- [x] T043 REQ-004: run `out=$(python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py); echo "exit=$?"; grep -Fq "$out" .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md && echo MATCH`. Expect `exit=0` and `MATCH`. Then `rg -n "fake-surface|fake_surface|config, javascript, python, shell, typescript" .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md` prints nothing (`stack-folders-validator.md`) Evidence: exit=0; MATCH; stale search empty
- [x] T044 Hub-routing rule: rerun `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code > $S/after-parent-check.txt`. Expect OK, 0 warnings, exit 0, with the subject line naming `sk-code` (`$S/after-parent-check.txt`) Evidence: OK, all hard invariants passed, 0 warnings
- [x] T045 Playbook package: rerun the T009 validator into `$S/after-playbook.txt`. Expect `PASS package=sk-code`, `scenarios=33`, `operator=32`, `violations=0`, exit 0 (`$S/after-playbook.txt`) Evidence: PASS package=sk-code; scenarios=33; operator=32; violations=0
- [x] T046 Drift guards: rerun T007 and T008 into `$S/after-stack-folders.txt` and `$S/after-drift-guards.txt`, then `diff $S/before-drift-guards.txt $S/after-drift-guards.txt`. Expect no difference: stack-folders PASS, and alignment-drift unchanged from its pre-existing state (`$S/after-drift-guards.txt`) Evidence: stack-folders PASS; before/after diff empty; exit 0
- [x] T047 Table integrity: `grep -n -B1 '^| \*\*sk-code-obsidian\*\*' .skilled/skills/sk-code/SKILL.md` and `grep -n -B1 '^| OBSIDIAN |' .skilled/skills/sk-code/shared/references/stack-detection.md`. In both, the preceding line must start with `|`, not be blank (`.skilled/skills/sk-code/SKILL.md`) Evidence: both rows have a preceding table row
- [x] T048 Scope check: `git status --porcelain -- .skilled specs/sk-doc/z_archive` lists only the files named in T010-T035 (the two `z_archive` copies included) plus the files that were already modified before this phase began. No file under `benchmark/` may appear, and nothing may appear under `001-sk-code/compiled/` or `001-sk-code/activation/` (`git status`) Evidence: scoped paths listed; exit 0
- [x] T049 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment --strict` and require an explicit `RESULT: PASSED` (`spec.md`) Evidence: validate.sh --strict on this folder: Errors 0 Warnings 0, RESULT: PASSED (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
