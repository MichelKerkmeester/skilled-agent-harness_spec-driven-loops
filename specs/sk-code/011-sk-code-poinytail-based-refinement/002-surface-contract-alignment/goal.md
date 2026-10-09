---
title: "Goal: Phase 2: surface-contract-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment"
    last_updated_at: "2026-10-09T17:53:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-002-surface-contract-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: surface-contract-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every live sk-code document state the surface precedence OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN and name Obsidian wherever the other surfaces are listed, correct the stack-folder scenario to match its validator, add a workflow-plus-Obsidian canary case, and re-mint the sk-code routing manifest so compiled routing keeps serving sk-code.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `shared/references/stack-detection.md:40` is the authority for the precedence order. Every other document is edited to restate it, and no new mechanism is added. |
| D2 | The stack-folder validator, the restraint ladder and the doctrine text stay unchanged. In `shared/references/universal/code-quality-standards.md` only the precedence parenthetical on line 53 changes, because phase 003 rewrites the ladder above it. |
| D3 | The manifest re-mint runs only after every `SKILL.md` edit is in place. Both manifest copies stay byte-identical, both canary fixture copies stay byte-identical, and a manifest is never restored without restoring `SKILL.md` with it. |
| D4 | The canary fixture is checked through the read-only harness exports `loadSnapshot` and `typedGold`. `harness/build-artifacts.cjs` is never run as a script, because it writes `compiled/` and `activation/` under `001-sk-code`. |
| D5 | Each advisor probe is judged against its own before-edit result. The battery's aggregate failure at baseline (sk-code top-1 on 11 of 15 positives and 2 of 5 negatives) is out of scope and is reported only as a number. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -n "OPENCODE >" .skilled/skills/sk-code --glob '!**/benchmark/reports/**' --glob '!**/changelog/**' | grep -vc "OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN"` prints `0`, the same `rg` piped to `grep -c "OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN"` prints 9 or more, and `rg -n -i "OPENCODE.? over .?WEBFLOW|WEBFLOW ?/ ?OPENCODE ?/ ?UNKNOWN|WEBFLOW, OPENCODE, or UNKNOWN|Webflow vs OpenCode vs UNKNOWN|WEBFLOW or OPENCODE\)|WEBFLOW \+ OPENCODE \+ MOTION_DEV" .skilled/skills/sk-code --glob '!**/benchmark/reports/**' --glob '!**/changelog/**'` prints nothing
- [ ] From the repository root, `node -e 'const H=require("./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs");const {fixture,snapshot}=H.loadSnapshot();const rows=H.typedGold(snapshot,fixture).cases;let bad=0;fixture.cases.forEach((c,i)=>{const r=rows[i];const modes=r.targetQualifiedIds.map(q=>q.split("/")[1]);const ok=r.decisionAction===c.expectedAction&&(!c.expectedSelectionKind||r.selectionKind===c.expectedSelectionKind)&&(!c.expectedModes||JSON.stringify(modes)===JSON.stringify(c.expectedModes));if(!ok)bad++;console.log(ok?"OK":"FAIL",c.id,r.decisionAction,r.selectionKind||"-",modes.join(","));});console.log("cases",rows.length,"failures",bad);process.exit(bad?1:0)'` prints `OK surface-bundle-obsidian route surfaceBundle sk-code-review,sk-code-obsidian` and `cases 10 failures 0` and exits 0, and `cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` prints nothing and exits 0
- [ ] After the re-mint, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "code review my obsidian plugin" | jq -e '.action == "route" and (has("servingAuthority") | not)'` prints `true` and exits 0, so compiled routing serves sk-code and not the legacy fallback; `node .skilled/bin/compiled-route-guard.cjs` lists sk-code as `fresh` and exits 0; `node .skilled/bin/compiled-route-status.cjs --hub sk-code --pretty` reports `causeCode` `compiled-serving`, `manifestFreshness.fresh` true and an `effectivePolicyHash` other than `128cfc2b105f9fdc9a76f92fbdddacb2c9867df0daf0090f21dd4d16f1dcccb8`; `node .skilled/bin/compiled-route-admission.cjs --hub sk-code` reports `pass` and exits 0; and `cmp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` prints nothing and exits 0
- [ ] With `S=specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch`, advisor runs captured before the first edit (`$S/before-sa001.tsv`, `$S/before-probes.tsv`) and after the last edit (`$S/after-sa001.tsv`, `$S/after-probes.tsv`) all exist; `join -t $'\t' -a 2 -e NONE -o 0,1.2,2.2 <(sort $S/before-sa001.tsv) <(sort $S/after-sa001.tsv) | awk -F'\t' '{split($2,b," ");split($3,a," ");v="OK"; if($2=="NONE"){if(!(a[1]=="sk-code"&&a[2]+0>=0.80))v="FAIL-NEW"} else if($1~/^P/){if(b[1]=="sk-code"&&(a[1]!="sk-code"||a[2]+0<b[2]+0))v="WORSE"} else if($1~/^N/){if(b[1]!="sk-code"&&a[1]=="sk-code")v="WORSE"} if(v!="OK")bad++; print v"\t"$0} END{print "worse_or_failed="bad+0; exit bad>0}' > $S/sa001-compare.txt` exits 0 with the last line `worse_or_failed=0`, which also requires Obsidian probes P16 and P17 to give sk-code top-1 at 0.80 or higher; and `diff $S/before-probes.tsv $S/after-probes.tsv` prints nothing
- [ ] `rg -c "sk-code-obsidian" .skilled/skills/sk-code/SKILL.md` prints 8 or more, `rg -c "Obsidian work" .skilled/skills/sk-code/SKILL.md` prints 1, `rg -c "OBSIDIAN" .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` prints 2 or more, `test -f .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md && echo present` prints `present`, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package sk-code` prints `PASS package=sk-code` with `scenarios=33`, `operator=32` and `violations=0` and exits 0
- [ ] `out=$(python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py); echo "exit=$?"; grep -Fq "$out" .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md && echo MATCH` prints `exit=0` and `MATCH`, and `rg -n "fake-surface|fake_surface|config, javascript, python, shell, typescript" .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md` prints nothing
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` prints an `OK` line naming `sk-code` with 0 warnings and exits 0, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| One precedence order and no stale surface list | Done | 0 mismatched, 9 matching lines, stale search empty (orchestrator rerun) |
| Canary passes with the new Obsidian bundle case and both fixture copies match | Done | cases 10 failures 0; cmp exit 0 (orchestrator rerun) |
| Re-mint proven: compiled routing serves sk-code and the guard reports sk-code fresh | Done | jq true; guard sk-code fresh; compiled-serving; admission pass; cmp exit 0 (orchestrator rerun) |
| No advisor probe worse than its baseline, P16 and P17 pass, two-stage probes unchanged | Done | worse_or_failed=0; P16 0.9283 confirmed independently; probe diff empty |
| Obsidian named in the hub, the probe battery and the surface-detection playbook | Done | 8, 1, 2, present; playbook PASS scenarios=33 violations=0 |
| Stack-folder scenario matches the validator | Done | exit=0, MATCH, stale search empty |
| Hub checker passes and the phase folder validates strict | Done | parent-skill-check OK 0 warnings; validate.sh --strict RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | This Level 1 phase has none. The criteria come from REQ-001 to REQ-004, SC-001 and SC-002 in spec.md and the Phase 3 tasks T036 to T049 in tasks.md |
| Baseline counts behind the thresholds | Before any edit, `sk-code-obsidian` appears on 4 lines of the hub `SKILL.md` and T015, T018, T019 and T020 each add one, giving 8. `OBSIDIAN` appears 0 times in the probe battery and T031 adds 2. The precedence search holds 7 lines and T036 expects at least 2 more |
<!-- /ANCHOR:log -->
