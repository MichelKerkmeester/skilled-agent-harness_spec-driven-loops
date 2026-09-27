# Source: sk-create-goal manual testing playbook run, 2026-09-26, after the review remediation

## 1. OVERVIEW

This file names what the run executed against and where its raw evidence lives. Every field derives from the run records.

---

## 2. PLAYBOOK COMMIT STATE

The run executed against an uncommitted worktree at commit `fa4f76d881`. `git status --porcelain` reported the mode's changed files as modified, among them the playbook root, all eight scenario files, `check-goal.cjs`, `SKILL.md` and the `/create:goal` router, workflows and presentation file.

The handoff gate landed after SCG-005 attempt 1 and while SCG-002, SCG-004, SCG-007 and SCG-008 were still running. It changes only a run that ends with a checker finding open, and only SCG-005 grades that ending. The session-goal redirect dropped `/goal-cursor` after SCG-007 had run, and SCG-007 grades the redirect and the absence of writes, not the command list. No scenario file changed during the run.

---

## 3. SCENARIO FILES

Root document: [`manual-testing-playbook.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md)

| ID | Feature file |
|---|---|
| SCG-001 | [`goal-authoring/top-level-goal.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md) |
| SCG-002 | [`goal-authoring/phase-parent-and-nested-child-goals.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/phase-parent-and-nested-child-goals.md) |
| SCG-003 | [`goal-authoring/add-goal-to-packet-without-goal.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/add-goal-to-packet-without-goal.md) |
| SCG-004 | [`goal-authoring/cut-over-budget-parent.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/cut-over-budget-parent.md) |
| SCG-005 | [`goal-authoring/refuse-leftover-placeholder.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md) |
| SCG-006 | [`goal-authoring/detect-unbound-phase.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/detect-unbound-phase.md) |
| SCG-007 | [`goal-authoring/route-session-goal-away.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/route-session-goal-away.md) |
| SCG-008 | [`goal-authoring/resend-parent-after-child-change.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/resend-parent-after-child-change.md) |

---

## 4. HOW EACH STEP RAN

- `bash:` steps ran in the orchestrator's run script from the repository root with `SCRATCH` set, and their output and exit status were captured exactly.
- `agent:` steps went to MiMo v2.6 Pro at high thinking through `pi -p ... --mode text --offline` with stdin from `/dev/null`, under the child-dispatch exemption and the `@markdown` persona. Each step's prompt named the scenario request, that step alone and the scratch workspace as the only write target.
- A fixture step's files were compared with the scenario text byte for byte. No scenario needed a restore.
- Before a workspace was removed, the run script copied it to `scratch-snapshot/` in that scenario's raw folder.

---

## 5. RAW EVIDENCE

| Path | Holds |
|---|---|
| `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-00N.md` | The graded record for each scenario, SCG-005 from attempt 3 |
| `.../playbook-run/SCG-005-attempt-1.md`, `SCG-005-attempt-2.md` | The two earlier SCG-005 attempts |
| `.../playbook-run/SCG-00N/record.json` | Every step's text, exit status and elapsed time |
| `.../playbook-run/SCG-00N/scratch-snapshot/` | The scratch workspace as the last step found it |
| `.../playbook-run/SCG-005--attempt-2/step-05-pi-session.jsonl` | The Pi session file that holds attempt 2's answer |
