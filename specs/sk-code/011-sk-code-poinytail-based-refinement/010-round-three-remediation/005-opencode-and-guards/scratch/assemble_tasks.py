#!/usr/bin/env python3
"""Planner tool: assembles tasks.md from the fixed Phase 1 and Phase 3 text and the generated Phase 2 lines."""
F = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards"
OC = ".skilled/skills/sk-code/sk-code-opencode"
CANARY = ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
CANARY_COPY = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
DOCTOR = ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
DOCTOR_TEST = ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"
SCOPE = " ".join([OC, CANARY, CANARY_COPY, DOCTOR, DOCTOR_TEST, ".skilled/skills/sk-code/leaf-manifest.json"])
FV = "F=" + F + ";"
MD = " ".join([
    OC + "/SKILL.md", OC + "/README.md", OC + "/scripts/README.md", OC + "/assets/scripts/README.md",
    OC + "/references/shared/alignment-verification-automation.md",
    OC + "/references/shared/code-organization/directory-and-test-conventions.md",
    OC + "/references/shared/universal-patterns/naming-and-commenting.md",
    OC + "/references/javascript/style-guide.md", OC + "/references/python/style-guide.md",
    OC + "/references/shell/style-guide/overview-structure-and-naming.md",
    OC + "/references/typescript/style-guide/formatting-imports-and-coexistence.md",
    OC + "/references/config/style-guide.md",
    OC + "/manual-testing-playbook/manual-testing-playbook.md",
    OC + "/manual-testing-playbook/authoring-verification/code-quality-gate.md",
    OC + "/manual-testing-playbook/authoring-verification/implementation-authoring.md",
    OC + "/manual-testing-playbook/authoring-verification/verification-alignment.md",
    OC + "/manual-testing-playbook/config-hooks/config-schema.md",
    OC + "/manual-testing-playbook/config-hooks/hooks-wiring.md",
    OC + "/manual-testing-playbook/language-standards/python-standards.md",
    OC + "/manual-testing-playbook/language-standards/rust-standards.md",
    OC + "/manual-testing-playbook/language-standards/shell-standards.md",
    OC + "/manual-testing-playbook/language-standards/typescript-standards.md",
])
HUBS = "cli-classifier cli-external-orchestration mcp-tooling sk-design sk-doc system-deep-loop sk-code"
VALIDATE_LOOP = "for f in %s; do echo \"$f $(python3 -I .skilled/skills/sk-doc/scripts/validate_document.py \"$f\" | grep 'Total issues')\"; done" % MD
HVR_LOOP = "for f in %s; do echo \"$f $(python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py \"$f\" | grep 'hard blockers')\"; done" % MD
DOCTOR_LOOP = "for h in %s; do echo \"$h $(node %s .skilled/skills/$h 2>&1 | grep -E '^(OK|FAIL): parent-skill-check')\"; done" % (HUBS, DOCTOR)

head = open(F + "/tasks.md").read().split("<!-- ANCHOR:phase-1 -->")[0].split("Run every command from the repository root")[0]
tail = "<!-- ANCHOR:completion -->" + open(F + "/tasks.md").read().split("<!-- ANCHOR:completion -->")[1]
phase2 = open(F + "/scratch/phase2-tasks.md").read()

intro = """Run every command from the repository root. Shell state does not carry between commands, so each command that uses the folder starts with `%s`. Save every output in `$F/scratch/` with a `before-` or `after-` prefix. `$F/scratch/dispatch-units.json` holds one unit per Phase 2 task, with the exact OLD and NEW text, the check command and its expected output; `$F/scratch/units/` holds the full content of every file a task creates. `$F/scratch/canary-assert.cjs` is the read-only canary assertion. Do not edit or delete anything under `$F/scratch/` except the outputs you write. Children 001 to 004 build at the same time and own other sk-code files: never edit a file outside `spec.md` Files to Change, and record a sibling's hit or failure instead of fixing it.

""" % FV

p1 = """<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the scope baseline. Run `%s git status --porcelain -- %s > $F/scratch/status-before.txt; echo "exit=$?"; cat $F/scratch/status-before.txt`. Expected: `exit=0` and, at plan time, an empty file. Any line printed belongs to earlier work and is the baseline for T113. (`$F/scratch/status-before.txt`)
- [ ] T002 [P] Record the router-sync baseline. Run `%s node %s/assets/scripts/verify_router_sync.cjs > $F/scratch/before-router-sync.txt; echo "exit=$?"; cat $F/scratch/before-router-sync.txt`. Expected: five `PASS check` lines, `router-sync: 5/5 checks passed`, `exit=0`. (`%s/assets/scripts/verify_router_sync.cjs`)
- [ ] T003 [P] Record the router-sync test baseline. Run `%s node --test %s/scripts/tests/verify_router_sync.test.cjs > $F/scratch/before-router-sync-test.txt 2>&1; echo "exit=$?"; grep -E '^. (pass|fail) ' $F/scratch/before-router-sync-test.txt`. Expected: `pass 3`, `fail 0`, `exit=0`. (`%s/scripts/tests/verify_router_sync.test.cjs`)
- [ ] T004 [P] Record the drift umbrella baseline. Run `%s bash %s/scripts/run-all-drift-guards.sh > $F/scratch/before-umbrella.txt 2>&1; echo "exit=$?"; grep -E '^(PASS|FAIL): |^run-all-drift-guards' $F/scratch/before-umbrella.txt`. Expected at plan time: three `PASS:` lines, `run-all-drift-guards: all 3 guards PASSED`, `exit=0`. Record what prints. (`%s/scripts/run-all-drift-guards.sh`)
- [ ] T005 [P] Record the canary baseline. Run `%s node $F/scratch/canary-assert.cjs > $F/scratch/before-canary.txt 2>&1; echo "exit=$?"; tail -1 $F/scratch/before-canary.txt; cmp %s %s; echo "cmp=$?"`. Expected: `cases 11 failures 0`, `exit=0`, no output from `cmp` and `cmp=0`. (`%s`)
- [ ] T006 [P] Record compiled-routing freshness. Run `%s node .skilled/bin/compiled-route-guard.cjs > $F/scratch/before-crg.txt 2>&1; echo "exit=$?"; grep -E 'sk-code |All hubs' $F/scratch/before-crg.txt; node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code > $F/scratch/before-freshness.json; echo "exit=$?"; grep -o '"fresh":[a-z]*' $F/scratch/before-freshness.json | head -1`. Expected: `sk-code                     fresh`, `All hubs fresh or excused`, `exit=0`, then `exit=0` and `"fresh":true`. At plan time the policy hash was `a59ec9ff7f6a450ca96f1d81b4b3174930058e7fcb94babd4a077b8b058299e2`. (`.skilled/bin/compiled-route-guard.cjs`)
- [ ] T007 [P] Record the leaf-manifest baseline. Run `%s node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code > $F/scratch/before-leaf.txt 2>&1; echo "exit=$?"; cat $F/scratch/before-leaf.txt; node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs 2>&1 | grep 'checked='`. Expected at plan time: `leaf-manifest.json OK (fab6eb8691aa05ea57ffda56837e50fa191f3eb35275f8167202f24fe0b9cfb5)`, `exit=0`, `checked=14 fresh=14 failed=0`. A sibling build may already have moved it; record what prints. (`.skilled/skills/sk-code/leaf-manifest.json`)
- [ ] T008 [P] Record the doctor baselines. Run `%s %s > $F/scratch/before-doctor-hubs.txt; cat $F/scratch/before-doctor-hubs.txt; node %s > $F/scratch/before-doctor-test.txt 2>&1; echo "exit=$?"; grep -E '^. (pass|fail) ' $F/scratch/before-doctor-test.txt`. Expected at plan time: every hub line ends with `OK: parent-skill-check`, then `pass 95`, `fail 0`, `exit=0`. A sibling build in flight can make sk-code fail; record what prints. (`%s`)
- [ ] T009 [P] Record the hub package baseline. Run `%s python3 -I .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-code > $F/scratch/before-package.txt 2>&1; echo "exit=$?"; head -6 $F/scratch/before-package.txt`. Expected at plan time: three lines ending `PASS (exit 0)` and `exit=0`. (`.skilled/skills/sk-code`)
- [ ] T010 [P] Record the document-validator baseline for the 22 Markdown files this phase edits. Run `%s %s > $F/scratch/before-validate.txt 2>&1; cat $F/scratch/before-validate.txt`. Expected at plan time: `Total issues: 0` on every line except `manual-testing-playbook/manual-testing-playbook.md`, which shows `Total issues: 2`. (`$F/scratch/before-validate.txt`)
- [ ] T011 [P] Record the voice-scan baseline for the same files. Run `%s %s > $F/scratch/before-hvr.txt; cat $F/scratch/before-hvr.txt`. Expected: one `hard blockers` count per file. The aim is only that no count rises. (`$F/scratch/before-hvr.txt`)
- [ ] T012 [P] Record the Hermes baseline. Run `%s node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > $F/scratch/before-hermes.txt 2>&1; echo "exit=$?"; cat $F/scratch/before-hermes.txt`. Expected at plan time: `exit=1` with `DRIFT sk-code-quality`, `DRIFT sk-code-review` and `FAIL: 2 drifted, 0 stale`, from sibling builds. Record what prints. (`$F/scratch/before-hermes.txt`)
- [ ] T013 Reproduce each finding before fixing it. Run each command and record its output. (a) f-iter014-002: `grep -n 'code-review\\|code-webflow' %s/SKILL.md` prints lines 24 and 54 among others. (b) f-iter014-001, already fixed by an earlier phase: `grep -n 'every leg of it (1a, 1b, 2, 3 and 4)' %s/SKILL.md` prints line 173, so record it as fixed with this command and change nothing for it. (c) f-iter004-001: `grep -n 'comments per 10' %s/references/shared/universal-patterns/naming-and-commenting.md` prints line 170. (d) f-iter004-005 and f-iter005-002: `grep -n '\\.\\./\\.\\./universal/code-style-guide' %s/references/shared/universal-patterns/naming-and-commenting.md %s/references/javascript/style-guide.md` prints lines 235 and 322. (e) f-iter004-002: `grep -n 'Carry-over from' %s/references/shared/universal-patterns/naming-and-commenting.md` prints line 283. (f) f-iter001-003: `grep -n 'PARENT_TIER_ALLOWLIST' %s/assets/scripts/verify_router_sync.cjs` prints two lines. (g) f-iter004-004: `grep -c 'surface-collision' %s` prints `0`. (h) f-iter018-002: `grep -n '^version:' .skilled/skills/sk-code/README.md .skilled/skills/sk-code/SKILL.md` prints `2.2.1.0` against `2.2.4.0` unless child 001 already changed one. (`%s/SKILL.md`)
- [ ] T014 [P] Record the live tree under the planner's copy of the checker. Run `%s node $F/scratch/units/verify_doc_claims.cjs --root .skilled/skills/sk-code > $F/scratch/before-doc-claims.txt; echo "exit=$?"; grep -E '^(PASS|FAIL) check|^doc-claims' $F/scratch/before-doc-claims.txt`. Expected at plan time: `exit=1` and four `FAIL check` lines (paths 53, names 137, surfaces 1, tiers 6). Sibling builds lower the counts; record what prints. (`$F/scratch/before-doc-claims.txt`)
<!-- /ANCHOR:phase-1 -->

---

""" % (FV, SCOPE, FV, OC, OC, FV, OC, OC, FV, OC, OC, FV, CANARY, CANARY_COPY, CANARY, FV, FV, FV, DOCTOR_LOOP, DOCTOR_TEST, DOCTOR, FV, FV, VALIDATE_LOOP, FV, HVR_LOOP, FV, OC, OC, OC, OC, OC, OC, OC, CANARY, OC, FV)

p2 = """<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Do the tasks in order, one edit per task, and run each task's check before the next. A task whose check does not print its expected text stops the build: report the task id and the output.

- [ ] T015 Read the authoring contracts before the first edit of each kind, and follow them in every task below. Code (the two guards, both tests, the umbrella and the doctor script): read `.skilled/skills/sk-code/SKILL.md`, then `%s/references/javascript/style-guide.md` (sections 2 to 7: module header, `'use strict'`, numbered section dividers, camelCase, 100-character lines, comments that state the reason only) and `%s/references/shell/style-guide/overview-structure-and-naming.md`. Markdown outside spec folders: read `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with its `assets/changelog-template.md` (the new changelog: compact shape, four-part version, spec-folder blockquote) and `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` (no em dash, no semicolon and no serial comma in prose). Version rule: the packet `SKILL.md` and its newest changelog carry the same four-part version, and child docs keep their own `version:` lines unchanged. Expected: nothing is written. If a contract contradicts a planned edit, stop and report the file and line. At plan time the contracts agree with every edit below. (`.skilled/skills/sk-code/SKILL.md`)
%s<!-- /ANCHOR:phase-2 -->

---

""" % (OC, OC, phase2)

p3 = """<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T095 Syntax checks. Run `node --check %s/assets/scripts/verify_doc_claims.cjs; echo "a=$?"; node --check %s/assets/scripts/verify_router_sync.cjs; echo "b=$?"; node --check %s; echo "c=$?"; bash -n %s/scripts/run-all-drift-guards.sh; echo "d=$?"`. Expected: `a=0`, `b=0`, `c=0`, `d=0` and no other output. (`%s/assets/scripts/verify_doc_claims.cjs`)
- [ ] T096 REQ-001 and SC-001, every check can fail and passes on a clean tree. Run `%s node --test %s/scripts/tests/verify_doc_claims.test.cjs > $F/scratch/after-doc-claims-test.txt 2>&1; echo "exit=$?"; grep -E '^. (pass|fail) ' $F/scratch/after-doc-claims-test.txt; grep -c 'known-bad' $F/scratch/after-doc-claims-test.txt`. Expected: `exit=0`, `pass 6`, `fail 0`, and a count of at least `4`, one passing known-bad test per check. (`%s/scripts/tests/verify_doc_claims.test.cjs`)
- [ ] T097 REQ-001, the allowlist is a data block with a reason per row. Run `grep -n "^const ALLOWED = \\[" %s/assets/scripts/verify_doc_claims.cjs; grep -c "    reason: '" %s/assets/scripts/verify_doc_claims.cjs`. Expected: one line, then `2`. (`%s/assets/scripts/verify_doc_claims.cjs`)
- [ ] T098 REQ-002 and SC-002, the umbrella runs four guards. Run `%s bash %s/scripts/run-all-drift-guards.sh > $F/scratch/after-umbrella.txt 2>&1; echo "exit=$?"; grep -E '^(PASS|FAIL): |^run-all-drift-guards' $F/scratch/after-umbrella.txt`. Expected once children 001 to 004 have landed: four `PASS:` lines, the last `PASS: doc-claims       (verify_doc_claims.cjs)`, then `run-all-drift-guards: all 4 guards PASSED` and `exit=0`. Before they land: the first three lines are `PASS:`, the fourth is `FAIL: doc-claims       (verify_doc_claims.cjs)`, then `run-all-drift-guards: 1 guard(s) FAILED` and `exit=1`; record that and go on. If another guard prints FAIL, save its output; stop the build only when a reported file is under `sk-code-opencode/` or is a file this phase created, and otherwise record it against its owner. (`%s/scripts/run-all-drift-guards.sh`)
- [ ] T099 REQ-003, router-sync reads the declared block. Run `%s node %s/assets/scripts/verify_router_sync.cjs > $F/scratch/after-router-sync.txt; echo "exit=$?"; tail -1 $F/scratch/after-router-sync.txt; grep -c 'PARENT_TIER_ALLOWLIST' %s/assets/scripts/verify_router_sync.cjs; grep -c "^  'shared/references/workflow-" %s/assets/scripts/verify_router_sync.cjs; node --test %s/scripts/tests/verify_router_sync.test.cjs 2>&1 | grep -E '^. (pass|fail) '`. Expected: `exit=0`, `router-sync: 5/5 checks passed`, `0`, `3`, `pass 5`, `fail 0`. (`%s/assets/scripts/verify_router_sync.cjs`)
- [ ] T100 REQ-004, the OpenCode packet is clean. Run `node %s/assets/scripts/verify_doc_claims.cjs | grep -c 'sk-code-opencode/'`. Expected: `0`, and grep exits 1. (`%s`)
- [ ] T101 REQ-005, the checker over the whole tree. Run `%s node %s/assets/scripts/verify_doc_claims.cjs > $F/scratch/after-doc-claims.txt; echo "exit=$?"; tail -1 $F/scratch/after-doc-claims.txt; grep '^  - ' $F/scratch/after-doc-claims.txt | cut -d/ -f1 | cut -d: -f1 | sort | uniq -c`. Expected once children 001 to 004 have landed and the orchestrator has assigned the unowned files: `exit=0` and `doc-claims: 4/4 checks passed`. Before then: `exit=1`, and the per-folder counts go into `implementation-summary.md` with the owner from plan.md "Handoffs"; mark this task `[B]` and do not edit those files. (`$F/scratch/after-doc-claims.txt`)
- [ ] T102 REQ-006 and SC-003, version parity. Run `%s node %s > $F/scratch/after-doctor-test.txt 2>&1; echo "exit=$?"; grep -E '^. (pass|fail) ' $F/scratch/after-doctor-test.txt; %s > $F/scratch/after-doctor-hubs.txt; cat $F/scratch/after-doctor-hubs.txt; node %s .skilled/skills/sk-code 2>&1 | grep -E '13[a-d]-'`. Expected: `exit=0`, `pass 98`, `fail 0`; the six other hubs end with `OK: parent-skill-check`; sk-code prints PASS lines for 13a to 13d once child 001 has set the hub README version and child 003 has its changelog. Before that, sk-code may print `FAIL: 13c-readme-version` or `FAIL: 13d-packet-version` naming a sibling's file; record it. (`%s`)
- [ ] T103 REQ-007, the collision case routes Obsidian over Webflow. Run `%s node $F/scratch/canary-assert.cjs > $F/scratch/after-canary.txt 2>&1; echo "exit=$?"; grep -E 'surface-collision|^cases' $F/scratch/after-canary.txt; cmp %s %s; echo "cmp=$?"`. Expected: `exit=0`, `OK surface-collision-obsidian-over-webflow route surfaceBundle sk-code-review,sk-code-obsidian`, `cases 12 failures 0`, no output from `cmp` and `cmp=0`. (`%s`)
- [ ] T104 REQ-008, labels, budgets and pointer. Run `grep -rl 'Quantity limit (OpenCode surface setting)' %s/references | wc -l; grep -rn '\\.\\./\\.\\./universal/code-style-guide' %s; echo "labels=$?"; grep -rn 'Carry-over from' %s; echo "carry=$?"`. Expected: `6`, then no output and `labels=1`, then no output and `carry=1`. (`%s/references/shared/universal-patterns/naming-and-commenting.md`)
- [ ] T105 REQ-009, version, changelog and generated files. Run `grep -n '^version:' %s/SKILL.md %s/changelog/v1.2.0.0.md; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py %s/changelog/v1.2.0.0.md | grep -E 'VALID|Total issues'; python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py %s/changelog/v1.2.0.0.md | grep 'hard blockers'; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo "leaf=$?"; node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '`. Expected: `version: 1.2.0.0` twice, `VALID` and `Total issues: 0`, `hard blockers:          0`, `leaf-manifest.json OK (...)` and `leaf=0`, and `sk-code                     fresh`. If compiled routing is stale, do not re-mint: record it for the orchestrator, because only hub files this phase does not touch move that hash. (`%s/changelog/v1.2.0.0.md`)
- [ ] T106 REQ-009, no edited Markdown got worse. Run `%s %s > $F/scratch/after-validate.txt 2>&1; diff $F/scratch/before-validate.txt $F/scratch/after-validate.txt; echo "validate=$?"; %s > $F/scratch/after-hvr.txt; diff $F/scratch/before-hvr.txt $F/scratch/after-hvr.txt; echo "hvr=$?"`. Expected: `validate=0` with no diff output, then either `hvr=0` or diff lines where no count is higher after than before. (`$F/scratch/after-validate.txt`)
- [ ] T107 Hermes, for the orchestrator. The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once after every build. The builder runs only `%s node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > $F/scratch/after-hermes.txt 2>&1; echo "exit=$?"; cat $F/scratch/after-hermes.txt`. Expected: `exit=1` with the drift lines from T012 plus `DRIFT sk-code-opencode`. Mark this task with the evidence `deferred: orchestrator regenerates Hermes after all builds`. (`.hermes/skills/sk-code-opencode/SKILL.md`)
- [ ] T108 REQ-010, the already-fixed finding. Run `grep -n 'every leg of it (1a, 1b, 2, 3 and 4)' %s/SKILL.md`. Expected: one line (173 at plan time). Record f-iter014-001 as fixed by an earlier phase, with this command, in `implementation-summary.md`. (`%s/SKILL.md`)
- [ ] T109 Fill `$F/implementation-summary.md`: what changed, the files changed (spec.md Files to Change), the T098, T101 and T102 interim results with each open hit attributed to its owner, f-iter014-001 from T108, the deferred Hermes step and the recorded routing note from plan.md "Handoffs". Keep the `_memory` frontmatter keys. Expected: `grep -c '\\[Opening hook\\|\\[What was decided\\]\\|\\[path\\]' $F/implementation-summary.md` prints `0`. (`$F/implementation-summary.md`)
- [ ] T110 Check the goal file. Run `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs %s; echo "exit=$?"`. Expected: `RESULT: PASSED` and `exit=0`. (`$F/goal.md`)
- [ ] T111 Validate this folder. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh %s --strict`. Expected: `RESULT: PASSED`. (`$F/spec.md`)
- [ ] T112 REQ-011, nothing outside scope changed under sk-code. Run `git status --porcelain -- .skilled/skills/sk-code/sk-code-opencode | grep -v -E 'sk-code-opencode/(SKILL|README)\\.md|scripts/|assets/scripts/|references/|manual-testing-playbook/|changelog/v1\\.2\\.0\\.0\\.md'; echo "exit=$?"`. Expected: no output and `exit=1`. (`%s`)
- [ ] T113 Scope check, last. Run `%s git status --porcelain -- %s > $F/scratch/status-after.txt; echo "exit=$?"; diff $F/scratch/status-before.txt $F/scratch/status-after.txt; echo "diff=$?"`. Expected: `exit=0`, then diff lines for exactly the 33 paths in spec.md Files to Change: 30 ` M` lines and 3 `??` lines (`verify_doc_claims.cjs`, `verify_doc_claims.test.cjs`, `changelog/v1.2.0.0.md`), and `diff=1`. A ` M .skilled/skills/sk-code/leaf-manifest.json` line can also come from child 001; any other path stops the build. (`$F/scratch/status-after.txt`)
<!-- /ANCHOR:phase-3 -->

---

""" % (OC, OC, DOCTOR, OC, OC,
       FV, OC, OC,
       OC, OC, OC,
       FV, OC, OC,
       FV, OC, OC, OC, OC, OC,
       OC, OC,
       FV, OC,
       FV, DOCTOR_TEST, DOCTOR_LOOP, DOCTOR, DOCTOR,
       FV, CANARY, CANARY_COPY, CANARY,
       OC, OC, OC, OC,
       OC, OC, OC, OC, OC,
       FV, VALIDATE_LOOP, HVR_LOOP,
       FV,
       OC, OC,
       F, F,
       OC,
       FV, SCOPE)

open(F + "/tasks.md", "w").write(head + intro + p1 + p2 + p3 + tail)
print("ok")
