---
title: "Goal: Phase 21: goal-scan-large-log"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal scan large log goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/021-goal-scan-large-log"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the bounded whole-log scan"
    next_safe_action: "The builder changes the assertions and the reader"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-goal-scan-large-log"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How many Claude logs exceed 16 MB? The review measured 35 of 801 on one account."
    answered_questions:
      - "Does the cap change? No, only the read behind it when the tail cannot answer."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: goal-scan-large-log

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude session log over the 16 MB tail cap is read whole when its capped tail holds no goal entry, so the newest goal entry anywhere in the log decides and a log with no goal entry reaches the packet goal fallback.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Keep the 256 KiB first tail read and the 16 MB cap. Add a front-to-back scan of the bytes before the capped tail only when that tail holds no goal entry. |
| D2 | Read the scan in fixed 64 KiB buffers with one line remainder, and parse only lines that contain `goal`. |
| D3 | Report `whole: true` after the head scan and the tail together cover the file. Report the newest entry found. |
| D4 | The tail is read first, so a tail entry outranks an older head entry and the scan never runs in that case. |
| D5 | The fixed test is the same test, with two changed assertions. The failing-first rule of parent D1 is met by the empty packet and the `ended: false` result it produces before the edit. |
| D6 | The Claude goal reader only, per parent D2. No module, record key or log event, per parent D3. No live hop, and nothing is merged or pushed without the operator, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The red run saved in `scratch/red.txt` shows both changed assertions failing before the source edit, and `scratch/green.txt` shows them passing after.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`, saved to `scratch/relaunch-core.txt`.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count in `scratch/baseline.txt`.
- [ ] `rg -c 'fixed chunks' .skilled/hooks/session-relaunch/README.md` prints 1 or more, and `rg -c 'a log read only in part' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints nothing with exit 1.
- [ ] `validate.sh 021-goal-scan-large-log --strict` prints `RESULT: PASSED`.
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
| Review finding | Done | 2026-11-14, the whole-epic review finding F2, CONFIRMED against the tree at `fa6a56f0fc`: the capped tail returns `whole: false` and the fallback refuses it |
| Code read | Done | 2026-11-14 at `fa6a56f0fc`: the cap at `lib/relaunch-core.cjs:61`, the refusal at `:687`, the partial-read assertions at `tests/relaunch-core.test.cjs:2876` and `:2944`, and the cost comment at `:58` and `:59` |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written |
| Build | Pending | The builder runs T001 to T016 and records the runs under `scratch/` |
| Fix commit | Pending | Recorded after the build |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| The memory bound is one line | A single JSONL line can be longer than the chunk. The buffer stays fixed and the remainder holds at most that one line, which is the same bound the tail read already accepts. |
| The second assertion keeps its result | The claimed-note test at `tests/relaunch-core.test.cjs:2941` still returns `ended: true` after the change, because the note's mark is read first. Only its comment changes. |
<!-- /ANCHOR:log -->
