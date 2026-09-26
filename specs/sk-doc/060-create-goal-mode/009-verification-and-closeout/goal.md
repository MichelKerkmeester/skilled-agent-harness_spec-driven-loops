---
title: "Goal: Phase 9: verification-and-closeout"
description: "This goal sets the durable directive and completion criteria for Phase 009 closeout."
trigger_phrases:
  - "phase 009 goal"
  - "goal mode closeout directive"
  - "goal authoring final evidence"
  - "phase 009 completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/009-verification-and-closeout"
    last_updated_at: "2026-09-26T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every completion criterion with evidence"
    next_safe_action: "None; packet closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0da02-83a9-73a6-a4a5-e2b967866478"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-create-changelog global mode and sk-doc/create-goal: unsupported; it accepts one kebab-case segment (SKILL.md:190)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: verification-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** This phase establishes observed evidence for the goal-authoring mode and aligns the packet's final status.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each playbook scenario gets an observed `PASS`, `FAIL` or `SKIP` verdict with its reason and evidence path. |
| D2 | The accept path uses a verified real packet need; never invent a case to force a pass. |
| D3 | The reachability measurement reuses the ten fixed prompts and reports results for both routing commands. |
| D4 | Write the mode changelog directly and create its relative hub link, whether or not the global changelog workflow accepts a nested target. |
| D5 | Close the packet only when all phase acceptance criteria have evidence and the recursive strict validator passes. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The dated playbook run record contains exactly eight final scenario rows, each with a verdict, reason and evidence path.
- [ ] The real accept-path `goal.cjs packet` output reports `packet_budget=ok`, and all seven direct phase goal files for the selected packet pass `test -f`.
- [ ] The reachability record contains ten prompt rows and a count for advisor, compiled-route and joint success.
- [ ] `sk-create-goal/README.md` passes `validate_document.py` and `hvr_scan.py` reports zero hard blockers.
- [ ] `sk-create-goal/changelog/v1.0.0.0.md` exists and `test -f .skilled/changelog/sk-doc/create-goal/v1.0.0.0.md` succeeds.
- [ ] Recursive strict validation of `specs/sk-doc/060-create-goal-mode` prints `RESULT: PASSED` and exits 0.
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
| Phase planned | Done | this folder's spec.md, plan.md, tasks.md |
| Playbook run | Done | 8 PASS, 0 FAIL, 0 SKIP in `benchmark/reports/2026-09-26--manual-testing-playbook--create-goal/results.csv` |
| Real accept path | Done | `phase-add` on 017: check 4/4 on parent and child, `packet_budget=ok` at 3,728, seven goals present |
| Routing replay | Done | Hub 10 of 10, advisor 9 of 10, joint 9 of 10, probes 0 of 6 (`scratch/routing-final.txt`) |
| README and changelog | Done | README `VALID`, 0 HVR hard blockers; `v1.0.0.0.md` reachable through `.skilled/changelog/sk-doc/create-goal` |
| Packet reconciled | Done | Nine phases Complete and closeable; recursive strict `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Doc corrections | `goal.cjs packet` prints `packet_budget=ok`, not `within`, so every mention now names `ok`; the mode changelog path in `spec.md` gained its missing `sk-doc/` segment. No parent decision or criterion changed. |
| Mirror-check amendment | Operator approved on 2026-09-26: the final gate reruns every runtime-mirror check, including the two Hermes checks CI runs (REQ-010, T019, AC-011). No parent decision or criterion changed. |
| Changelog question answered | Unsupported: `sk-create-changelog` global mode accepts one kebab-case segment (`SKILL.md:190`). The direct write and link stand. |
| 017 map and disk disagree | The map names phase 7 `007-deep-review-remediation/`; the folder is `007-decommission-review-p1-p2-fixes/`. The mode's phase-add stop rule would halt here; the worker used the disk name because the brief named it. Left for 017's owner. |
| Files to Change amended | Added the two 017 goal files the T006 accept path writes, with their regenerated metadata. No parent decision or criterion changed. |
| Nested changelog name | The generator writes `changelog-060-009-verification-and-closeout.md`: packet number plus phase folder, as this child's own changelog note says. The planned path carried the full packet name, so `spec.md`, T012 and AC-007 now name the real file. No parent decision or criterion changed. |
<!-- /ANCHOR:log -->
