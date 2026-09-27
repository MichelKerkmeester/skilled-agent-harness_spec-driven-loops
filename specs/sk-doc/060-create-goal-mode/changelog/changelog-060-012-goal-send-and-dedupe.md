---
title: "Changelog: Phase 12: goal-send-and-dedupe [060-create-goal-mode/012-goal-send-and-dedupe]"
description: "Chronological changelog for the Phase 12: goal-send-and-dedupe phase."
trigger_phrases:
  - "create goal mode goal send and dedupe changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-09-27

> Spec folder: `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe` (Level 2)
> Parent packet: `specs/sk-doc/060-create-goal-mode`

### Summary

A parent goal sent in chat now carries only its directive. This packet's own parent dropped from 3,995 to 2,944 durable characters without losing a decision, a binding row or a criterion.

### Added

- Rerun the baselines in acceptance-criteria.md (V3 12, V7 3156 2823, V8 11, V9 0, V10 9, V13 2, sk-create-goal tests 15 of 15, goal-slice tests 21 of 21) and list any goal.md already dirty under specs/ for V26. Evidence: re-run during planning on 2026-09-26, all matching the scope analysis. The only dirty goal.md files under specs/ were this packet's parent and child.
- Make section 3 the one full cut order with a first cut for legacy author instructions, rewrite section 4 as the send rule from scratch/scope-analysis.md section 5, delete the 3,735 figure in section 6 and bump the version (.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md). Evidence: section 3 is "CUT IN THIS ORDER" with a legacy step 3, section 4 lists the five things a sent goal never contains, section 6 states 1,624, 1,004 and 956. Version 1.1.0.0, validate_document.py VALID, HVR 0 hard blockers.
- Remove the blockquote, the Operator copy section and the criteria introduction, and add the GOAL_AUTHORING pointer comment after HVR_REFERENCE (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl). Evidence: V3 prints 0.
- Admit /create:goal at :61, drop "packet goal", "goal.md" and "nested goal" from :160, point :485 to the send rule and say the objective slice is injected (.skilled/skills/system-spec-kit/SKILL.md). Evidence: V21 1, V22 0. SKILL.md VALID.
- Replace the packet_goal precedence, budget, payload and child-rule text with pointers, and add the /create:goal step to :with-phases and Option D (.skilled/commands/speckit/assets/speckit-plan.yaml, speckit-implement.yaml, speckit-complete.yaml). Evidence: all three parse, V10 prints 0, V11 prints 4 for plan and 4 for complete.
- [P] Point the four "playbook order" lines to section 3 (.skilled/commands/create/assets/create-goal-auto.yaml, create-goal-confirm.yaml). Evidence: both parse, V8 prints 0.

### Changed

- Record the operator's approval of this scope and the answer to open question 1 in goal.md's log (goal.md). Evidence: after setting the parent goal the operator said "okay work on goal" on 2026-09-26. Open question 1 was not answered, so the recommended default holds: older parents are cut at their next amendment, with no renderer change.
- [P] Run the advisor on "author a nested goal.md for phase 3" and keep the output, to compare after T011. Evidence: no before-run was kept. Instead the advisor source settles it: skill_advisor_runtime.py:54 parses only SKILL.md frontmatter and no advisor file reads system-spec-kit's intent keywords. After the edit the prompt routes to sk-doc at 0.847, system-spec-kit 0.125.
- Regenerate the golden snapshot and read its diff (.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap). Evidence: one snapshot updated, 12 of 12 pass. The diff is the removed text plus the pointer line.
- [P] Point the resume payload to the send rule (.skilled/commands/speckit/assets/speckit-resume-auto.yaml, speckit-resume-confirm.yaml). Evidence: both parse.
- Replace the send-rule sentences with the three-sentence rule, the pointer and the authoring owner, and read the diff line by line (AGENTS.md). Evidence: one line changed, V13 0, V14 1. No other file carries the old sentence.
- Key the resend reminder on packet_budget=ok, keep "4000 characters" and update the assertion (.skilled/hooks/goal/lib/goal-slice.cjs, goal-slice.test.cjs). Evidence: V24 21 of 21. Cursor 15 of 15 and Devin 3 of 3 also pass.

### Fixed

- Carry the same removal and comment into each template block and rewrite each "Fixed prose" row (.skilled/skills/sk-doc/sk-create-goal/assets/goal-*-template.md). Evidence: V7 prints 1624 1218. The sk-create-goal suite passes 15 of 15.
- Add the owner line, point sections 3, 4 and 5 to sk-create-goal, delete the "template carries this rule" sentence, correct section 6 and bump the version (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md). Evidence: V8 0 and V20 0. The three sk-create-goal links resolve. Version 3.12.0.0, VALID, HVR 0.
- [P] Point "How to Fix" to the cut order and /create:goal (.skilled/skills/system-spec-kit/references/validation/validation-rules.md). Evidence: the link resolves from references/validation/.
- [P] Add /create:goal to Option D, the phase table and the quick reference, and correct the --with-goal fact (references/structure/phase-definitions.md, phase-system.md, references/workflows/quick-reference.md, references/templates/template-guide.md, README.md). Evidence: V11 shows 1 in phase-definitions.md, V19 prints 1.
- [P] Correct the --with-goal help and name /create:goal in the help and both next-step blocks, echo text only (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh). Evidence: bash -n passes, V12 prints 2, and no test pins the old text.
- Cut the parent goal to the new fixed text, measure it at 3,000 or fewer and resend its chat slice (specs/sk-doc/060-create-goal-mode/goal.md). Evidence: V16 packet_durable_chars=2944, packet_budget=ok, V15 4 of 4. The chat slice was not pasted, because the operator asked this session to stop sending goals.

### Verification

- sk-create-goal tests, parity included - 15 of 15
- Scaffold golden snapshot - 12 of 12 after one update
- goal-slice tests, plus Cursor and Devin - 21 of 21, 15 of 15, 3 of 3
- Search and measure checks V1 to V26 - Every one prints its target
- Runtime mirrors, Codex, Pi, Hermes prompts, Hermes skills - 170, 34, 34, 34 and 71 in sync
- Leaf manifests for system-spec-kit and sk-doc - Both OK
- Parent goal criterion 3 after the re-mint - A goal-authoring prompt routes to sk-doc, then [sk-create-goal]. "Set the goal for this session" defers
- validate_document.py and HVR scan on changed prose - VALID, 0 hard blockers. AGENTS.md is skipped as an instruction file

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Modified | The one cut order, the one send rule and the template cost |
| `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl and sk-create-goal/assets/goal-*-template.md` | Modified | Author instructions removed, pointer comment added |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | The rendered goal without the removed text |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Owner line, pointers, corrected creation section |
| `.skilled/skills/system-spec-kit/SKILL.md, README.md and five references` | Modified | /create:goal admitted and named, authoring keywords dropped, facts corrected |
| `.skilled/commands/speckit/assets/speckit-*.yaml (five)` | Modified | Pointers, plus /create:goal in :with-phases and Option D |
| `.skilled/commands/create/assets/create-goal-*.yaml` | Modified | The four cut-order lines point to section 3 |
| `AGENTS.md` | Modified | Three sentences of the rule, a pointer and the authoring owner |
| `.skilled/hooks/goal/lib/goal-slice.cjs, goal-slice.test.cjs` | Modified | The reminder keys the send on packet_budget=ok |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Help and next-step echo text |
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md, README.md, references/parent-and-nested-goals.md, changelog/v1.2.0.0.md` | Modified, Created | Pointers, versions and the release entry |
| `.hermes/skills/*/SKILL.md` | Regenerated | Every copy whose source is committed or this phase's own, with links that resolve |

### Follow-Ups

- Older goals keep their old text. 227 active goals carry the Operator copy section until their next amendment or cut. AGENTS.md overrides their resend wording.
- Four parents are still over budget. sk-code/007, sk-design/018, sk-design/019 and sk-git/028 need their owners' cuts.
- The README manifest needs one more refresh at commit. It counts tracked files only, so the new benchmark folder joins it once staged. Running python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write after staging refreshes it.
- Hermes caps a prompt section below the brief's bound. The cap is 4,000 characters and the core bounds a brief at 4,800. The longest of the 308 goals in specs/ renders 2,558, so none is cut.
- A new Pi session reads the brief twice on its first turn. The session-start restore and the first turn's injection both carry it, as HEAD did and the goal hooks README documents.
- The rename-tooling test needs a quiet checkout. It hashes the whole checkout and fails when anything writes to it during its run. It passes in an isolated clone, and other sessions write to the shared one.
