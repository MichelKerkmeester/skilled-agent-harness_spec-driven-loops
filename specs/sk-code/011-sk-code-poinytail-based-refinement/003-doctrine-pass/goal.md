---
title: "Goal: Phase 3: doctrine-pass"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass"
    last_updated_at: "2026-10-09T17:52:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-003-doctrine-pass"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: doctrine-pass

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sk-code's always-loaded restraint ladder and its implement workflow state the same seven-rung, reuse-first order and the same reach list, with the items the ladder may never cut pinned in the rule-copy canary.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase starts only after phase 002 is complete, because both phases edit the same paragraph of `code-quality-standards.md`. Before any edit, `rg -n "OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` must print one hit; if it prints nothing, no file is edited. |
| D2 | The reuse step enters the ladder as rung 2, "Already in this codebase (a helper, component, service, pattern)?", giving seven rungs. `workflow-implement.md` restates the same order without a file path, because it is read through three surface symlinks. |
| D3 | The ladder points at the P0 tier in one sentence instead of copying the P0 list, and accessibility joins the P0 tier as item 8. |
| D4 | Ponytail's one-small-test reflex and the codebase map hook stay out of this phase. The P1 happy-path-plus-edge-case coverage floor is not changed. |
| D5 | Rollback copies the six snapshots in `scratch/before/` back over their source paths. `git checkout` and `git restore` are not used on these files, so phase 002's precedence edit is never lost. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e 'const fs=require("fs");const R=".skilled/skills/sk-code/shared/references/";const k=["to exist","codebase","standard library","native platform","installed dependency","one line","minimum code"];const a=fs.readFileSync(R+"universal/code-quality-standards.md","utf8");const s=a.slice(a.indexOf("### Design Restraint Ladder"));const ladder=s.slice(0,s.indexOf("\n---")).toLowerCase();const rungs=(ladder.match(/^\d+\. \*\*/gm)||[]).length;const w=(fs.readFileSync(R+"workflow-implement.md","utf8").split("\n").find(l=>l.startsWith("Apply the"))||"").toLowerCase();let ok=rungs===7;if(!ok)console.log("FAIL ladder has "+rungs+" rungs, expected 7");for(const [n,t] of [["ladder",ladder],["workflow",w]]){let p=-1;for(const x of k){const i=t.indexOf(x,p+1);if(i<0){console.log("FAIL "+n+": missing or out of order: "+x);ok=false;break}p=i}}console.log(ok?"PASS: ladder and workflow list the same 7 rungs in order":"FAIL");process.exit(ok?0:1)'` prints `PASS: ladder and workflow list the same 7 rungs in order` and exits 0, and `rg -n "callers, tests, fixtures, config and exports|components, services, templates and patterns" .skilled/skills/sk-code/shared/references/workflow-implement.md` prints exactly two hits.
- [ ] `rg -n "Test coverage at boundaries.*happy path plus at least one edge case per public surface\.$" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints exactly one hit, and `diff specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass/scratch/before/code-quality-standards.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | rg "Test coverage"` prints nothing and exits 1.
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s)).` and exits 0, and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` prints 20 `PASS` lines, including `seeded_tree_consistent`, `never_cut_removed_1` to `never_cut_removed_6` and `never_cut_names_1` to `never_cut_names_6`, then `All rule-canary test cases passed`, and exits 0.
- [ ] `sed -n '/^### Design Restraint Ladder/,/^---$/p' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | rg -c "Already in this codebase|never cuts a P0 item"` prints `2`.
- [ ] `specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass/implementation-summary.md` records `wc -l -c` line and byte counts for `code-quality-standards.md` and `workflow-implement.md` taken once phase 002 has landed and before any edit, again after all edits, and a before-to-after delta per file.
- [ ] `rg -c "already in this codebase|codebase-reuse rung|codebase reuse / stdlib" .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` prints `4`, and `rg -c "5 exact-string file\(s\) \+ 2 Iron Law file\(s\) \+ 21 delivery-prefix anchor\(s\)" .skilled/skills/sk-code/sk-code-review/scripts/README.md` prints `1`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass --strict` prints `RESULT: PASSED`.
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
| Ladder and workflow list the same seven rungs, reach list and reuse step widened | Pending | Not started |
| Coverage floor line unchanged | Pending | Not started |
| Canary passes and the tamper suite prints 20 PASS lines | Pending | Not started |
| Ladder section shows the reuse rung and the never-cut pointer | Pending | Not started |
| Size before, after and delta recorded in implementation-summary.md | Pending | Not started |
| Playbook scenario and canary README match the change | Pending | Not started |
| Strict spec validation passes | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
