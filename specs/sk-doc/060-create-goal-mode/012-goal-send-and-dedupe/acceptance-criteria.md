---
title: "Acceptance Criteria: Phase 12: goal-send-and-dedupe"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal send rule acceptance"
  - "goal template cut acceptance"
  - "goal nesting pointer acceptance"
  - "phase 012 closure gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/012-goal-send-and-dedupe"
    last_updated_at: "2026-09-27T07:58:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all forty-one criteria with evidence"
    next_safe_action: "Commit the phase when the operator asks"
    blockers: []
    key_files:
      - "scratch/scope-analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Older parents are cut at their next amendment, the recommended default, since the operator did not choose otherwise"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: goal-send-and-dedupe

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/012-goal-send-and-dedupe
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited reference, When section 4 is read, Then it names all five removed elements, the durable-slice measure and `packet_budget=ok` | V1 hits lines 54 and 66, both inside section 4. V2's section 4 lists all five elements. Cited: `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:52`. | Met | - |
| AC-002 | REQ-002 | Given the goal template and its three asset copies, When searched for the removed instructions, Then nothing matches | V3 prints 0, from a baseline of 12. Cited: `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:33`. | Met | - |
| AC-003 | REQ-002 | Given the new templates, When the parity and checker tests run, Then all pass | V4 prints `pass 15`, `fail 0`, the same as the baseline. | Met | - |
| AC-004 | REQ-002 | Given the regenerated snapshot, When the scaffold snapshot test runs, Then it passes and holds no Operator copy heading | V5 passes 12 of 12 after one snapshot update, and V6 prints 0, from a baseline of 1. The diff is only the removed text and the pointer line. | Met | - |
| AC-005 | REQ-002 | Given the unfilled phase-parent asset block, When measured, Then durable is at most 1,700 and chat at most 1,300 | V7 prints `1624 1218`, from a baseline of `3156 2823`. | Met | - |
| AC-006 | REQ-003 | Given the repository, When searched for cut-order citations of the playbook, Then none remain | V8 prints 0, from a baseline of 11. | Met | - |
| AC-007 | REQ-004 | Given system-spec-kit and speckit, When searched for sk-create-goal, Then every pointer surface names it | V9 lists 14 files, from a baseline of 0. | Met | - |
| AC-008 | REQ-004 | Given the speckit YAMLs, When searched for restated nesting rules, Then none remain | V10 prints 0, from a baseline of 9. | Met | - |
| AC-009 | REQ-005 | Given the phase entry points, When searched, Then each names `/create:goal` | V11 prints 4 for plan, 4 for complete and 1 for `phase-definitions.md`. V12 prints 2. Cited: `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:205`. | Met | - |
| AC-010 | REQ-006 | Given the instruction surfaces, When searched for a chat-only cap, Then none remain | V13 prints 0, from a baseline of 2, and V14 prints 1, from a baseline of 0. Cited: `AGENTS.md:187`. | Met | - |
| AC-011 | REQ-007 | Given 060's parent goal, When the checker and the packet report run, Then 4 of 4 pass within 3,000 | V15 prints `RESULT: PASSED (4/4 checks)`. V16 prints `packet_durable_chars=2944` and `packet_budget=ok`, from 3,995. | Met | - |
| AC-012 | REQ-007 | Given the edited packet, When validated, Then strict validation passes | V17 prints `RESULT: PASSED` for all 13 folders. | Met | - |
| AC-013 | REQ-008 | Given the help and README, When read, Then the child-only behavior is stated | V18 shows the help naming `--phase` as child-only and `--level phase-parent` as the parent path. V19 prints 1. A scratch-repo run of `--level phase-parent --with-goal` scaffolded a parent goal, confirming the help. | Met | - |
| AC-014 | REQ-009 | Given the playbook and validation rules, When searched for the renderer recipe, Then it is gone | V20 prints 0 and V21 prints 1. | Met | - |
| AC-015 | REQ-010 | Given `SKILL.md:160`, When read, Then the authoring keywords are gone | V22 prints 0, from a baseline of 1. | Met | - |
| AC-016 | REQ-011 | Given the reference, When searched for the live figure, Then none remains | V23 prints 0, from a baseline of 1. | Met | - |
| AC-017 | REQ-012 | Given the new reminder, When the hook tests run, Then they pass and the reminder names the budget state and 4000 | V24 prints 21 of 21 with the new `packet_budget=ok` assertion. Cited: `.skilled/hooks/goal/lib/goal-slice.cjs:211`. | Met | - |
| AC-018 | REQ-013 | Given the generated copies, When checked, Then they match and no other goal changed | V25 prints `PASS: 71 Hermes skill copies in sync` after 2 of 71 were rewritten. V26 lists only this packet's parent and child goals. | Met | - |
| AC-019 | REQ-014 | Given the repository outside `specs/`, When searched for a claim that the durable slice is injected, Then none remains, and the root README, goal hooks README and phase checklist name `/create:goal` | V27 prints 0, from a baseline of 8. V28 prints 4, 1 and 1. Cited: `README.md:990` and `.skilled/hooks/goal/README.md:147` | Met | - |
| AC-020 | REQ-015 | Given an over-budget goal and a missing binding row, When the validator runs, Then each finding names its fix in sk-create-goal | `spec-doc-structure.vitest.ts` passes 30 of 30, from a HEAD baseline of 30, with both hints asserted. The rebuilt `dist/lib/validation/spec-doc-structure.js` contains the `phase-add` hint | Met | - |
| AC-021 | REQ-016 | Given the implement workflow and the phase docs, When searched, Then the implement YAML names `phase-add` and no touched file says `/spec_kit:plan` | V29 prints 3 for the implement YAML and 0 and 0 for the two old names. The YAML parses | Met | - |
| AC-022 | REQ-017 | Given HEAD plus this phase's files in a scratch worktree, When the trigger index is regenerated after the last doc edit, Then it publishes and a phrase from this phase resolves | V30 exits 0 and the lookup of `goal send rule` returns this phase | Met | - |
| AC-023 | REQ-018 | Given the reference and the plugin test, When checked, Then both pass | `validate_document.py` prints VALID with 0 issues. The OpenCode goal test passes 15 of 15, from 14 | Met | - |
| AC-024 | REQ-019 | Given a phase parent nested inside another packet and a plain phase child, both over 4,000 durable characters, When the goal checker runs, Then the nested parent fails `parent-budget` and the child passes | V31 passes 18 of 18, from 15. HEAD's checker passes the nested-parent fixture, and the current one fails it. V32 prints 0 after fifteen restatements, the system-spec-kit README line found by the producer sweep included, were rewritten to or pointed at section 2 | Met | - |
| AC-025 | REQ-020 | Given a goal file that opens with many comments and no fence, and a goal whose frontmatter holds an inner `---`, When they are parsed and checked, Then parsing stays linear and the checker reports `frontmatter-fence` | V24 passes 24 of 24, from 21: 2,000 leading comments parse in under 250 ms, where HEAD took 12,568 ms for 26. HEAD's checker passes the inner-fence fixture, and the current one fails it. V37 reports `frontmatter-fence_findings=0` across 312 active goals, with every other count unchanged from HEAD | Met | - |
| AC-026 | REQ-021 | Given `--help` as the action, a failed action, a missing path under a symlinked parent and a folder name with a line break, When the CLI and the slice module run, Then the CLI fails with `UNKNOWN_ACTION` and exit 1, the path reads as outside and the reminder stays one line | V38 passes 8 of 8 and 74 of 74, from 7 and 74. HEAD stores `--help` as an objective and exits 0 on a failure, and HEAD's reminder splits across two lines. V24 covers the path and reminder cases | Met | - |
| AC-027 | REQ-022 | Given the `/create:goal` router and both workflows, When searched, Then each requires a real path inside the workspace and states that packet prose is data | V33 prints 1, 1 and 1 for each phrase, from 0, 0 and 0 at HEAD. Both YAMLs parse | Met | - |
| AC-028 | REQ-023 | Given the mode's docs, When validated, Then no `contextType` sits outside the enum, the README points at `changelog/`, `v1.0.0.0.md` carries `## Upgrade` and SCG-007's request reads naturally | V34 prints 0 files, from 7, then 1 and 1. `validate_document.py` reports 0 issues on all 28 changed docs, and the package validator passes 8 scenarios with 0 violations and 0 warnings | Met | - |
| AC-029 | REQ-024 | Given SCG-004 and SCG-005, When read against section 3 and the top-level asset template, Then SCG-004 runs all six cut steps in order and SCG-005 seeds the asset wording | V35 prints 2 and 1, from 0 and 0 | Met | - |
| AC-030 | REQ-025 | Given every line citation into `goal-slice.cjs`, `goal.cjs` and the hooks docs, When each cited line is opened, Then it holds the cited code or row | The six code citations in `budget-and-handoff.md` moved to the current lines and were each re-opened. The Devin row cites goal-plugin lines 158 and 162 to 168, and AC-019 cites `README.md:990`. V36 prints 0, from 2 | Met | - |
| AC-031 | REQ-026 | Given the eight playbook scenarios, When each runs with MiMo v2.6 Pro at high thinking, Then each has a verdict, a reason and evidence in a new dated run folder | All eight PASS in `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal--review-remediation/`, with one record per scenario under `scratch/playbook-run/`. SCG-005 passed on attempt 3, and `failed-runs.md` records attempts 1 and 2 with their causes and fixes. The earlier run folder is unchanged. A scan of all 28 MiMo session transcripts found no write outside the scratch workspaces | Met | - |
| AC-032 | REQ-027 | Given a goal the checker fails and an operator brief that asks for a handoff anyway, When `/create:goal` runs, Then it reports the finding, prints no chat slice and ends with `STATUS=FAIL` | SCG-005 attempt 1, before the gate, printed the slice and ended `STATUS=OK`. Attempts 2 and 3, after it, each ended `STATUS=FAIL` with the placeholder finding and no `chat_slice` field, no `DURABLE DIRECTIVE` heading and no objective line in the reply | Met | - |
| AC-033 | REQ-028 | Given the OpenCode plugin, the Pi extension and the Cursor, Devin and Hermes hooks, When each goal suite and goal-hook scenario runs, Then every suite reports `fail 0` and every scenario passes a live run | V41 passes 294 of 294 with exit 0: OpenCode 148 from 147, Pi 22 from 21, Cursor 15, Devin 3 and the shared CLI, core and slice 8, 74 and 24. V42 passes 46 of 46, from 43. CO-039, the Pi one-shot turn, CU-027, DV-022 and HERMES-030 each pass live, recorded in `scratch/runtime-verification/runtime-verification.md`. The Hermes, Pi and OpenCode fixes each carry a test that fails on HEAD | Met | - |
| AC-034 | REQ-029 | Given the regenerated `.hermes/skills/` copies, When every relative link is resolved from its copy, Then only copies this phase could not regenerate keep a broken link | V39 passes 4 of 4, and HEAD's generator fails the new link test. V40 prints 0, from 530 at HEAD. The cli-cursor and deep-review copies were regenerated once their owners committed those sources, and `sync-skills-hermes.cjs --check` reports all 71 copies in sync | Met | - |
| AC-035 | REQ-030 | Given a Pi session with a bound goal, When a one-shot `pi -p` turn ends, Then no extension message starts another turn and the run exits after its answer | V43 passes 22 of 22 and V44 passes 10 of 10. HEAD's goal extension and HEAD's completion-evidence extension each fail their new test. The live turn exits 0 after 40 s with one answer and no tool call, where HEAD's ran 18 more turns over 18 minutes | Met | - |
| AC-036 | REQ-031 | Given a file named `AGENTS.md` and a file whose name only starts the same way, When `validate_document.py` runs, Then `AGENTS.md` is skipped with exit 0 and no issues, the other name is still checked, and `--no-exclude` still validates `AGENTS.md` | V45 passes 2 of 2, and HEAD's validator fails the skip test with `Missing required section: overview`. V46 prints `SKIPPED` with exit 0, and with `--no-exclude` it reports the overview issue. V47 passes 23 of 25, from a baseline of 22 of 24, and the eleven tests that run the validator pass on the final bytes. `test_readme_manifest.py` and `test_rename_tooling_fixture_harness.py` fail in both runs for causes outside this change. Both pass after the remaining-issue pass, as AC-038 records | Met | - |
| AC-037 | REQ-032 | Given a skill whose sections open with WHEN THE HUB BUNDLES THIS, When `validate_document.py --type skill` runs, Then only that section, REFERENCE MAP and SURFACE STANDARDS are required, and a missing one is named | V48 passes 2 of 2, and HEAD's validator fails both tests, naming WHEN TO USE, SMART ROUTING and HOW IT WORKS as missing. V49 reports 0 issues on the three sk-code surface packets and their three Hermes copies, where HEAD's validator reports 4, 4 and 3 missing sections for the webflow, opencode and obsidian pairs | Met | - |
| AC-038 | REQ-033 | Given every document this phase changed or regenerated outside `specs/`, the cli-pi playbook and the sk-doc script suite, When each check runs, Then each document reports 0 issues apart from by-design skips, the stated scenario count matches the files, and every script test passes | V50 checks the 95 changed documents outside `specs/` and the three sk-code surface sources: 96 report 0 issues, and `AGENTS.md` and a fixture README are skipped by design, where two generated Hermes copies carried 5 and 3 issues before. V51 reports 36 scenarios in 11 categories and no census mismatch, where HEAD states 37. V47 passes 25 of 25 in the shared checkout with the rename test skipped, `test_readme_manifest.py` reproducing 825 of 825 directories. V52 passes the rename test in an isolated clone at HEAD `05231a01ea` with this phase's files copied in. V53 finds 0 hard voice findings in the review report, and V54 reports every hub's route fresh, mcp-tooling included | Met | - |
| AC-039 | REQ-034 | Given the three create-goal changelogs, When each is checked against the sk-create-changelog contract, Then each takes the shape its change count calls for, carries the exact spec-folder line and holds no test counts, validation results or file inventories | V55 reports 0 hard voice findings and 0 validator issues on all three, and each scores DQI 85. v1.0.0.0 and v1.1.0.0 are compact, and v1.2.0.0, with ten changes, is expanded with Why This Release, three domain sections and Upgrade Notes. V56 prints 1 for each, the spec-folder line alone, where v1.1.0.0 and v1.2.0.0 carried a second `phase N of N` line and v1.0.0.0 read `(Level 2, nine phases)`. The test counts, validator results and canary numbers are gone | Met | - |
| AC-040 | REQ-035 | Given sk-doc, mcp-tooling and cli-pi, When their changelogs and version carriers are read, Then each has an entry next in sequence that every carrier matches, with its route fresh and its Hermes copy in sync | V57 prints 2.2.0.0 for all five sk-doc carriers, 1.8.0.1 for all six mcp-tooling carriers and 1.5.11.1 for cli-pi, next after 2.1.0.0, 1.8.0.0 and 1.5.11.0. The skill-root metadata gate passes all three hubs. V58 reports all seven hubs fresh after three re-mints and all 71 Hermes copies in sync, with 0 broken links. Each new entry reports 0 validator issues and 0 hard voice findings, and a goal-authoring prompt still routes to `sk-create-goal` | Met | - |
| AC-041 | REQ-036 | Given every skill changelog folder under `.skilled/skills/`, When the links under `.skilled/changelog/` are resolved, Then each folder is reached by one link named by the tree's rule, and no link is broken | V59 prints `60 60`, from 60 folders with 47 reached before the change. V60 prints 0 broken links. sk-design is now a folder like every other hub, and no live file cites a path under its old single link. The route guard still reports every hub fresh | Met | - |

### Verification commands

Run from the repository root unless noted. Counts use `wc -l` or `grep -c`, so a clean result prints 0 rather than nothing.

```bash
# V1, V2
rg -n "packet_budget=ok" .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md
sed -n '/^## 4\./,/^## 5\./p' .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md
# V3
rg -n "^### Operator copy|^Three to seven bullets|DURABLE SLICE: it is" .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl .skilled/skills/sk-doc/sk-create-goal/assets/goal-*-template.md | wc -l
# V4
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
# V5, run from .skilled/skills/system-spec-kit/runtime
npx vitest run cli/tests/scaffold-golden-snapshots.vitest.ts --config ../vitest.config.ts
# V6
grep -c "### Operator copy" .skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap
# V7
node -e 'const gs=require("./.skilled/hooks/goal/lib/goal-slice.cjs");const t=require("fs").readFileSync(".skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md","utf8");const b=t.match(/<!-- BEGIN TEMPLATE -->\n`{3}markdown\n([\s\S]*?)\n`{3}\n<!-- END TEMPLATE -->/)[1]+"\n";console.log(gs.extractDurableSlice(b).length, gs.renderChatSlice(b).length)'
# V8
rg -n "playbook order|playbook, section 4|order the goal set-string playbook|set-string playbook's order|order the \[set-string playbook\]" .skilled AGENTS.md | wc -l
# V9
rg -l "sk-create-goal|create:goal" .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/references .skilled/skills/system-spec-kit/templates/addons .skilled/commands/speckit/assets
# V10
rg -n "child detail outranks any summary of either|is applied to the parent first, then the parent is resent|bounded so it fits one chat message" .skilled/commands/speckit | wc -l
# V11, V12
grep -c "create:goal" .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/skills/system-spec-kit/references/structure/phase-definitions.md
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help | grep -c "create:goal"
# V13, V14
rg -n "chat slice is over 4,000|when the slice is longer" .skilled AGENTS.md | wc -l
grep -c "budget-and-handoff.md" AGENTS.md
# V15, V16
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-doc/060-create-goal-mode
node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-doc/060-create-goal-mode --workspace "$PWD" | grep -E "packet_durable_chars|packet_budget"
# V17
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict
# V18, V19
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help | grep -A2 -- "--with-goal"
sed -n 232p .skilled/skills/system-spec-kit/README.md
# V20, V21
rg -n "inline-gate-renderer" .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md .skilled/skills/system-spec-kit/references/validation/validation-rules.md | wc -l
sed -n 61p .skilled/skills/system-spec-kit/SKILL.md | grep -c "create:goal"
# V22
grep '"HOOKS": {' .skilled/skills/system-spec-kit/SKILL.md | grep -cE '"packet goal"|"goal.md"|"nested goal"'
# V23
rg -n "3,735" .skilled/skills/sk-doc/sk-create-goal | wc -l
# V24
node --test .skilled/hooks/goal/lib/goal-slice.test.cjs
# V25, V26
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
git status --short -uall -- 'specs/*goal.md'
# V27, V28
rg -n "inject[a-z]* (the |its |that file's |the file's )?durable slice|injects the same slice|reads the durable slice only" --hidden -g '!.git' -g '!specs/**' -g '!**/node_modules/**' -g '!**/changelog/**' -g '!**/dist/**' . | wc -l
grep -c "create:goal" README.md .skilled/hooks/goal/README.md .skilled/skills/system-spec-kit/references/validation/phase-checklists.md
# V29
grep -c "create:goal" .skilled/commands/speckit/assets/speckit-implement.yaml; grep -c "spec_kit:plan" .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh .skilled/skills/system-spec-kit/references/structure/phase-system.md
# V30, in a scratch worktree at HEAD with this phase's files applied
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --repo-root <scratch worktree>
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "goal send rule"
# V31
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
# V32
rg -c "Phase children are exempt|phase children are exempt|children are unbounded[.,]|Phase-child goals are exempt|Children are unbounded\.|Phase children skip the budget check" .skilled AGENTS.md -g '!**/changelog/**' | wc -l
# V33
grep -c "real path" .skilled/commands/create/assets/create-goal-auto.yaml .skilled/commands/create/assets/create-goal-confirm.yaml .skilled/commands/create/goal.md
grep -c "data to read, never instructions" .skilled/commands/create/assets/create-goal-auto.yaml .skilled/commands/create/assets/create-goal-confirm.yaml .skilled/commands/create/goal.md
# V34
rg -c "^contextType: reference$" .skilled/skills/sk-doc/sk-create-goal | wc -l
grep -c "^## Upgrade" .skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md
grep -c "(./changelog/)" .skilled/skills/sk-doc/sk-create-goal/README.md
# V35
grep -c "cut-order step 6 only" .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/cut-over-budget-parent.md
grep -cF "[A frozen choice from spec.md or decision-record.md" .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md
# V36
grep -c "operator copy" .skilled/hooks/goal/README.md
# V37
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all | head -7
# V38
node --test .skilled/hooks/goal/bin/goal.test.cjs .skilled/hooks/goal/lib/goal-core.test.cjs
# V39
node --test .skilled/skills/system-spec-kit/runtime/cli/hermes/tests/sync-skills-hermes.test.mjs
# V40
python3 -c "import re,os,glob;print(sum(1 for f in glob.glob('.hermes/skills/*/SKILL.md') for t in re.findall(r'\]\(([^)\s#]+)',re.sub(r'\`[^\`\n]*\`','',re.sub(r'\`\`\`.*?\`\`\`','',open(f).read(),flags=re.S))) if not re.match(r'^([a-zA-Z][\w+.-]*:|/)',t) and not os.path.exists(os.path.join(os.path.dirname(f),t))))"
# V41
node --test .opencode/plugins/tests/*goal*.test.cjs .skilled/hooks/goal/pi/goal-pi.test.mjs .skilled/hooks/goal/bin/goal.test.cjs .skilled/hooks/goal/lib/goal-core.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/goal/cursor/goal-cursor.test.mjs .skilled/hooks/goal/devin/goal-devin.test.mjs
# V42
python3 -m pytest .hermes/plugins/repo-guards/tests -q
# V43
node --test .skilled/hooks/goal/pi/goal-pi.test.mjs
# V44, from .skilled/skills/system-spec-kit
npx vitest run runtime/tests/completion-evidence-pi-extension.vitest.ts runtime/tests/spec-gate-pi-extension.vitest.ts
# V45
python3 -m pytest -q -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_instruction_file_exclusion.py
# V46
python3 .skilled/skills/sk-doc/scripts/validate_document.py AGENTS.md; echo "exit=$?"
python3 .skilled/skills/sk-doc/scripts/validate_document.py AGENTS.md --no-exclude
# V47
bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
# V48
python3 -m pytest -q -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_surface_packet_sections.py
# V49
for f in .skilled/skills/sk-code/sk-code-{webflow,opencode,obsidian}/SKILL.md .hermes/skills/sk-code-{webflow,opencode,obsidian}/SKILL.md; do python3 .skilled/skills/sk-doc/scripts/validate_document.py "$f"; done
# V50
git status --porcelain --untracked-files=all | cut -c4- | grep '\.md$' | grep -v '^specs/' | while read -r f; do python3 .skilled/skills/sk-doc/scripts/validate_document.py "$f"; done
# V51
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook
# V52, from an isolated clone with this phase's files copied in
ONLY_TESTS=test_rename_tooling_fixture_harness.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
# V53
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/review/review-report.md
# V54
node .skilled/bin/compiled-route-guard.cjs
# V55
for f in .skilled/skills/sk-doc/sk-create-goal/changelog/v1.*.md; do python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f"; python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f"; done
# V56
grep -c '^> ' .skilled/skills/sk-doc/sk-create-goal/changelog/v1.*.md
# V57
grep -h -E '^version:|"version":' .skilled/skills/sk-doc/{SKILL.md,ROUTER.md,description.json,hub-router.json,mode-registry.json} .skilled/skills/mcp-tooling/{SKILL.md,README.md,ROUTER.md,description.json,hub-router.json,mode-registry.json} .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md
# V58
node .skilled/bin/compiled-route-guard.cjs && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
# V59
python3 -c "import os;R={os.path.realpath(os.path.join(d,n)) for d,ds,fs in os.walk('.skilled/changelog') for n in ds+fs if os.path.islink(os.path.join(d,n))};F=[d for d,ds,fs in os.walk('.skilled/skills') if os.path.basename(d)=='changelog' and any(f.startswith('v') and f.endswith('.md') for f in fs) and not any(x in d for x in ('/tests/','/fixtures/','/benchmark/','/templates/'))];print(len(F), sum(os.path.realpath(d) in R for d in F))"
# V60
find -L .skilled/changelog -type l | wc -l
```

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All forty-one criteria are met, each against a baseline taken before the change. The trigger index was regenerated last, from HEAD plus this phase's files, so other sessions' uncommitted work stays out of it. system-spec-kit got no release changelog entry, because its changelog is written per release.
<!-- /ANCHOR:closure -->
