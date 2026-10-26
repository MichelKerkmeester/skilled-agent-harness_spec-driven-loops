---
title: "Goal: Phase 17: measured-behavior-and-draft-metadata"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "measured behavior and draft metadata goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata"
    last_updated_at: "2026-10-26T18:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Closed out: every completion criterion holds"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-017-measured-behavior-and-draft-metadata"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: measured-behavior-and-draft-metadata

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Make new specs quote measured current behavior, and let validate settle derived metadata on its own while a packet is a Draft, without a new warning or failure for any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The block is anchor `measured-behavior` with an H3 `Measured Behavior` and no H2, placed right after the `problem` anchor in `templates/core/spec.md.tmpl`, so every level gets it and no required anchor is added. |
| D2 | `MEASURED_BEHAVIOR` is a registry rule at severity `warn`, applied only to a `spec.md` stamped at the version D3 sets or later; it checks the block is present and non-empty, not that each number quotes it. |
| D3 | The spec-core stamp moves to the next minor after the one phases 015 and 016 leave; the version is recorded as "Stamp taken" in section 4 before any template edit. |
| D4 | Auto-repair lives in the orchestrator CLI entry, never in `validateFolder`; it runs once, only for a Draft packet whose every error is in `repair-derived.cjs` `DERIVABLE` less `SPEC_DOC_INTEGRITY`, spawns the repair with `SPECKIT_DRAFT_AUTO_REPAIR=0`, and is off when that switch is `0`, `false` or `off` or `CI` is set. |
| D5 | DeepSeek V4.1 Flash max through cli-pi builds each change from one short brief; cli-codex gpt-6-luna is the fallback; a fresh Opus medium agent reviews; the conductor runs every gate, with the build never concurrent with tests. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [x] `cd .skilled/skills/system-spec-kit && npx vitest run --config vitest.config.ts --project cli tests/<name>.vitest.ts`, for `measured-behavior-rule` and `draft-auto-repair`, prints every test passed
- [x] The strict and six-rule censuses over the 4,757 folders in the shared census list match their baselines row for row, and none reports a `MEASURED_BEHAVIOR` warning
- [x] `npm --prefix .skilled/skills/system-spec-kit/runtime run build` exits 0, and the full runtime suite lists no failure its baseline lacks
- [x] `check-card-sync.sh` prints `CARD SYNC OK`, `sync-skills-hermes.cjs --check` prints `PASS`, and no "41-rule registry" line remains in system-spec-kit
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `rg -n quiet` printed line 510. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | spec, plan, tasks, acceptance criteria and this goal written on 2026-10-26 |
| T001 metadata rounds | Done | `scratch/metadata-rounds.md`: 122 validate calls, 36 failed, 33 derived-only, 0 content, 3 cut off with the repair hint printed; 19 of 24 runs had a derived-only round |
| Stamp taken | Done | v2.4 for spec, plan, tasks, implementation-summary and acceptance-criteria. Phases 015 to 017 were built in parallel in one uncommitted tree and are committed together, so 015 and 016 were not committed first |
| Baselines | Done, with deviations | Census before and after in `../016-scaffold-filler-section-trim/scratch/baseline/`, shared with 016. Suites after only, in `scratch/baseline/suite-after-runtime.txt` (279 files passed, 0 failed) and `suite-after-cli.txt` (1 failed, also failing in 013's `cli-after.txt`); no pre-phase suite baseline |

### Deviations and findings

| Item | Note |
|------|------|
| `author.validate` holds only the final run | The round count joins `author.calls` to `author.updates` by `toolCallId` instead, because the final run cannot show earlier rounds |
| Review claim checked | The insight review's "never failed on content" holds: no content rule failed in any of the 122 calls |
<!-- /ANCHOR:log -->
