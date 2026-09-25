---
title: "Goal: Pre-v4 spec folder upgrade path"
description: "The durable directive for the pre-v4 upgrade build: one no-LLM command that brings v3.x spec folders to a v4 strict pass, implemented by MiMo through cli-pi and verified by the conductor."
trigger_phrases:
  - "pre-v4 upgrade goal"
  - "upgrade-legacy goal"
  - "066 goal prompt"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade"
    last_updated_at: "2026-09-25T06:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Every completion criterion met; packet validates with 0 errors"
    next_safe_action: "Operator approves the commit by explicit path"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:5c878dc6ed14b2d1eb5427fbed76057e60ac0fe167d7edc003dd821364f0758f"
      session_id: "abb8eac5-f92d-4f79-aab2-f81adb6c378b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator chose the wide recorded-findings scope, recording over stub documents and Status rewrites, NFR-R01 as convergence, and the current branch"
---
# Goal: Pre-v4 spec folder upgrade path

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a user upgrading from v3.x one deterministic command, with no LLM call, that brings every old spec folder to a pass under v4 `validate.sh --strict` and records what it cannot fix so old findings never block new work.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | MiMo v2.6 Pro writes the code, dispatched through cli-pi as `llmgateway/mimo-v2.6-pro --thinking high`, one change per brief. The conductor checks each diff and runs every gate itself |
| D2 | Recorded findings include inherited old defects. A missing document or a status mismatch is recorded, never fixed with a stub file or a Status rewrite |
| D3 | A finding the packet has not recorded stays an error. The five derivable metadata rules are never recorded in an active packet |
| D4 | An interrupted run converges to the same result when run again |
| D5 | Work stays on `main`. Commits need the operator's yes, go by explicit path, and never include another session's files |
| D6 | A structure-only transform is built only where the measured count of recorded findings justifies the code |

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

- [x] `validate.sh --strict` on this packet prints `RESULT: PASSED`
- [x] After `upgrade-legacy.mjs --apply` in the harness, 170 of 170 (v3.0.0.0) and 995 of 995 (v3.6.0.0) active packets pass `--strict`, and with `--include-archive` 158 of 158 and 895 of 895 archived packets pass, counted by v4's packet rule
- [x] A second `--apply` leaves the sandbox specs manifest identical, and a dry run changes no file and exits 1
- [x] One new broken link in an upgraded packet makes `validate.sh --strict` print `RESULT: FAILED`
- [x] The full `cli` and `root` Vitest projects show no failure beyond the captured baseline, with new tests covering the validator hook, the command and the backfill exit code
- [x] AC-001 to AC-007 read Met with evidence, and the spec README and the v4.0.0.1 release notes name the command
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
| Research, both lineages | Done | `research/research.md`, synthesis recorded as incomplete by operator decision |
| Plan | Done | `validate.sh --strict` printed `RESULT: PASSED` with one sufficiency warning |
| Setup: standards, test commands, before numbers | Done | sk-code routed to `sk-code-opencode`; baselines cli 1,531 and root 1,264 passed at `f2b04f4773` |
| Validator hook, backfill exit code, command, tests | Done | 31 MiMo briefs across code and docs, each exit 0; command tests 16 of 16, hook tests 10 of 10; full suites cli 1,547 and root 1,274 passed, 0 failed |
| Harness proof, docs, closeout | Done | Final-state reruns of both tags passed all five proof items on 2026-09-25; AC-001 to AC-007 Met; 26 of 26 checklist rows; gate review PASS 90 of 100 on re-run |
| Operator decisions | done | counts follow v4's packet rule (170/995 active, 158/895 archived); release notes go in a new v4.0.0.1 file covering every change since the v4.0.0.0 tag |

### Deviations and findings

| Item | Note |
|------|------|
| No nested goal documents | This is a Level 2 packet with no phase children. A nested goal binds a phase child folder, and the plan's phases are task groups inside one folder |
| Fan-out synthesis needs a root dashboard no step writes | Deferred to a separate deep-loop packet by operator decision. Not in this packet's scope |
| The continuity writer never refreshes `implementation-summary.md` continuity | Contradicts `save.md`. Flagged, not fixed here |
| Two spec edge cases disagreed with the code | Operator chose the code on 2026-09-25: a document with unreadable frontmatter is left as is and now named per file, and a tree under `.opencode/specs` is refused with the move printed. Spec amended |
| Trigger index left stale for this packet | The save reports the index stale for `spec.md`. On 2026-09-25 a regeneration also indexed about 77 paths from other work on this disk, such as a cloned repo under `specs/cli-orca/`, so it was reverted to HEAD. Regenerate it once that other work is committed or cleared |
| Proof script shared file lists between runs of one tag | Found 2026-09-25; the run timings show no result was affected; each run now names its own files |
<!-- /ANCHOR:log -->
