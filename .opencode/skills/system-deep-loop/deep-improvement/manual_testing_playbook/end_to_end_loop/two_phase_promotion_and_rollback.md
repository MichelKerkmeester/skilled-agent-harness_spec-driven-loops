---
title: "E2E-050 -- Two-Phase Promotion And Rollback"
description: "Manual validation scenario for E2E-050: Two-Phase Promotion And Rollback."
feature_id: "E2E-050"
category: "End_to_End Loop"
version: 1.17.0.1
---

# E2E-050 -- Two-Phase Promotion And Rollback

This document captures the canonical manual-testing contract for `E2E-050`.

---

## 1. OVERVIEW

This scenario validates that `promote-candidate.cjs --phase=accept` snapshots candidate evidence without mutating the canonical target, `--phase=ship` ships the accepted snapshot rather than a later-mutated candidate file, `rollback-candidate.cjs` restores the pre-acceptance backup, and ship-time canonical drift emits `promotion_blocked_branch_preserved`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate the accepted-vs-shipped split and rollback recovery.
- Real user request: `Confirm that promotion acceptance does not mutate the target, shipping uses the accepted snapshot, rollback restores the original target, and ship drift preserves the branch event.`
- Prompt: `Validate two-phase promotion and rollback for a benchmark-mode candidate.`
- Expected execution process: Build a disposable benchmark-mode promotion packet, accept a candidate, mutate the original candidate file after acceptance, ship from the accepted-state file, roll back, then run a second accept and force canonical drift before ship.
- Expected signals: accept exits 0 with `status: "accepted"` and leaves target content unchanged; ship exits 0 with `status: "shipped"` and writes the accepted snapshot; rollback exits 0 with `status: "rolled_back"` and restores the original target; drifted ship exits 1, restores the pre-acceptance target, and appends a `promotion_blocked_branch_preserved` event with `phase: "ship"`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from target content, accepted-state file, rollback output, and event log.
- Pass/fail: PASS when accept/ship/rollback/drift behaviors all match the expected signals from the same disposable packet.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Use a disposable `/tmp/e2e-050` workspace.
3. Run the command sequence exactly, preserving stdout, stderr, and generated files.
4. Compare observed output against the expected signals and pass/fail criteria.
5. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| E2E-050 | Two-Phase Promotion And Rollback | Validate accept/ship split, rollback, and branch-preserved ship failure | `Validate two-phase promotion and rollback for a benchmark-mode candidate.` | <pre>rm -rf /tmp/e2e-050 && mkdir -p /tmp/e2e-050 ;<br>node -e "const fs=require('fs');const p='/tmp/e2e-050';fs.writeFileSync(p+'/candidate.txt','CANDIDATE BODY\n');fs.writeFileSync(p+'/target.txt','ORIGINAL TARGET BODY\n');fs.writeFileSync(p+'/report.json',JSON.stringify({status:'benchmark-complete',scoringMethod:'pattern',grader:'noop',profileId:'demo-profile',family:'test',target:p+'/target.txt',aggregateScore:92,maxScore:100,totals:{score:92,delta:1,outcomeScoreDelta:2,pass_rate:1,fixtures:1,passed:1},outcomeScoreDelta:2,fixtureDeltas:[{id:'fx',beforeScore:90,afterScore:92,delta:2,helped:true,hurt:false}],recommendation:'benchmark-pass'},null,2));fs.writeFileSync(p+'/repeatability.json',JSON.stringify({profileId:'demo-profile',passed:true},null,2));fs.writeFileSync(p+'/config.json',JSON.stringify({target:p+'/target.txt',targetProfile:'demo-profile',proposalOnly:false,promotionEnabled:true,branchPreservationPolicy:'preserve-on-failure',scoring:{thresholdDelta:0}},null,2));fs.writeFileSync(p+'/manifest.jsonc',JSON.stringify({targets:[{path:p+'/target.txt',classification:'canonical'}]},null,2));" ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --phase=accept --candidate=/tmp/e2e-050/candidate.txt --target=/tmp/e2e-050/target.txt --benchmark-report=/tmp/e2e-050/report.json --repeatability-report=/tmp/e2e-050/repeatability.json --config=/tmp/e2e-050/config.json --manifest=/tmp/e2e-050/manifest.jsonc --archive-dir=/tmp/e2e-050/archive --acceptance-file=/tmp/e2e-050/accepted.json --preserved-branch=preserved/test --approve ;<br>printf 'MUTATED AFTER ACCEPT\n' > /tmp/e2e-050/candidate.txt ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --phase=ship --acceptance-file=/tmp/e2e-050/accepted.json --approve ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs --acceptance-file=/tmp/e2e-050/accepted.json ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --phase=accept --candidate=/tmp/e2e-050/candidate.txt --target=/tmp/e2e-050/target.txt --benchmark-report=/tmp/e2e-050/report.json --repeatability-report=/tmp/e2e-050/repeatability.json --config=/tmp/e2e-050/config.json --manifest=/tmp/e2e-050/manifest.jsonc --archive-dir=/tmp/e2e-050/archive2 --acceptance-file=/tmp/e2e-050/accepted-drift.json --preserved-branch=preserved/test --approve ;<br>printf 'DRIFTED TARGET BODY\n' > /tmp/e2e-050/target.txt ;<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs --phase=ship --acceptance-file=/tmp/e2e-050/accepted-drift.json --event-log=/tmp/e2e-050/events.jsonl --approve ; echo "drift-ship-exit=$?" ;<br>node -e "const fs=require('fs');const target=fs.readFileSync('/tmp/e2e-050/target.txt','utf8').trim();const events=fs.existsSync('/tmp/e2e-050/events.jsonl')?fs.readFileSync('/tmp/e2e-050/events.jsonl','utf8').trim():'';console.log('target='+target);console.log('eventHasPreserved='+(events.includes('promotion_blocked_branch_preserved')&&events.includes('canonical_target_changed')));"</pre> | accept returns `status: "accepted"`; ship returns `status: "shipped"` and writes accepted snapshot content, not the mutated candidate file; rollback returns `status: "rolled_back"`; drifted ship exits 1; target is restored to `ORIGINAL TARGET BODY`; event log contains `promotion_blocked_branch_preserved` and `canonical_target_changed`. | Terminal transcript, `/tmp/e2e-050/accepted.json`, target file content, `/tmp/e2e-050/events.jsonl`, PASS/FAIL verdict. | PASS when accept leaves canonical untouched, ship writes the accepted snapshot, rollback restores the backup, and drifted ship preserves branch evidence while restoring the target. | If accept mutates the target: inspect `createAcceptanceState()` in `promote-candidate.cjs`<br>If ship writes the post-accept mutated candidate: confirm `acceptedState.candidateSnapshotPath` is used<br>If drifted ship does not restore target: inspect `assertShipPreconditions()`<br>If no event appears: confirm `--event-log` is passed and `branchPreservationPolicy` is `preserve-on-failure` |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste accepted/shipped/rolled_back outputs and event log row]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `end-to-end-loop/two-phase-promotion-and-rollback.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement |
| `../../scripts/shared/promote-candidate.cjs` | Accept/ship promotion helper and preserved-branch event emitter |
| `../../scripts/shared/rollback-candidate.cjs` | Explicit rollback helper for accepted-state backups |
| `../../references/shared/promotion_gate_contract.md` | Documented accept/ship promotion gate contract |
| `../../references/shared/promotion_rules.md` | Branch-preservation and no-go policy reference |
| `../../assets/agent_improvement/improvement_config.json` | Default branch-preservation config surface |
| `../../scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Automated accept/ship/rollback and preserved-branch event coverage |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-050
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `end-to-end-loop/two-phase-promotion-and-rollback.md`
