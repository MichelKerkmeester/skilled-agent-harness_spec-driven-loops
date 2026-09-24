---
title: "Goal: rewrite every skill changelog to the current format"
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
    packet_pointer: "sk-doc/059-skill-changelog-retrofit"
    last_updated_at: "2026-09-24T17:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and its phase binding"
    next_safe_action: "Continue with the phase docs, then report the pilot for style approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Goal: rewrite every skill changelog to the current format

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every skill changelog under `.skilled/skills/` reads in the current sk-create-changelog format and still records exactly what shipped in its version.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Facts outrank style. No added fact, and no dropped change, breaking change, migration step or correction. Frontmatter stays byte-identical and paths stay as written. |
| D2 | Drop Files Changed tables, test counts and internal machinery. Git keeps them. |
| D3 | GPT-6 Luna xhigh on the GPT plan via cli-pi and cli-codex, one dispatch per CLI. LLM Gateway only while the plan hits a usage limit. |
| D4 | Opus orchestrates, reviews and commits. Executors write only their one file. |
| D5 | A rewrite passes the shape checker, 0 HVR hard blockers and a second-model fact check, or the original is restored. |
| D6 | Overwriting is a recorded exception to sk-create-changelog's never-overwrite rule. Spec-folder changelogs and the v4.0.0.0 exemplar are out of scope. |
| D7 | The operator approves the pilot style before the per-skill waves start. One commit per skill, pushed to main. |

### Operator copy

The operator's copy of this directive judges completion. Resend this slice,
frontmatter excluded, whenever anything above the log changes. Keep reminding
while unset, without stopping work.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Decisions above outrank it.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-tooling-and-pilot/goal.md` |
| 002 | `002-cli-external-orchestration/goal.md` |
| 003 | `003-cli-jev/goal.md` |
| 004 | `004-cli-orca/goal.md` |
| 005 | `005-mcp-code-mode/goal.md` |
| 006 | `006-mcp-tooling/goal.md` |
| 007 | `007-sk-code/goal.md` |
| 008 | `008-sk-communication/goal.md` |
| 009 | `009-sk-design/goal.md` |
| 010 | `010-sk-doc/goal.md` |
| 011 | `011-sk-git/goal.md` |
| 012 | `012-sk-prompt/goal.md` |
| 013 | `013-sk-vision/goal.md` |
| 014 | `014-system-deep-loop/goal.md` |
| 015 | `015-system-skill-advisor/goal.md` |
| 016 | `016-system-spec-kit/goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The shape checker exits 0 on every skill changelog, or each failure is listed with its reason
- [ ] Every rewritten changelog has a PASS fact-check verdict
- [ ] `hvr_scan.py` reports 0 hard blockers on every rewritten changelog
- [ ] No rewrite changes a changelog's frontmatter
- [ ] The compiled-route guard and every mirror `--check` pass after the last skill commit
- [ ] `validate.sh --recursive --strict` on this packet reports `RESULT: PASSED`
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
| Checker, briefs and driver | Done | `scratch/check_changelog_shape.py` passes the exemplar and all 25 compliant files |
| Pilot run 2 (10 files) | Done | `scratch/driver-status.json` at 2026-09-24T17:28Z: 6 pass, 4 fail, 32 GPT dispatches, 0 gateway |
| Phase children 001 to 016 | In Progress | Folders created, per-skill lists in `scratch/lists/` (549 files) |
| Pilot style approval | Pending | Operator review |
| Phase docs and goals for 001 to 016 | Done | validate.sh --recursive --strict: 17 of 17 RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Never-overwrite rule | Overwritten on purpose per D6 |
<!-- /ANCHOR:log -->
