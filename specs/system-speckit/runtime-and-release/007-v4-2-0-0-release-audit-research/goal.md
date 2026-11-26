---
title: "Goal: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "v4 2 0 0 release audit research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research"
    last_updated_at: "2026-11-25T07:59:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Find every user-visible change the v4.2.0.0 release notes miss, every note the code contradicts and every bug shipped since v4.1.0.0, each one verified in the repository.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The research runs as one `/deep:research:auto` fan-out: cli-codex `gpt-6-luna` at `xhigh` on the `fast` tier and cli-devin `deepseek-v4-1-flash-max`, ten iterations each, convergence stop. |
| D2 | The window is `v4.1.0.0..HEAD`, read from `scratch/window-commits.txt`, plus the 21 packets in `scratch/recent-packets.txt`. |
| D3 | Amended 2026-11-25 by the operator: the confirmed bugs are fixed first, then the release notes are updated from `research/research.md`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `research/research.md` exists and `research/deep-research-config.json` reads `"status": "complete"`.
- [x] Both lineage labels have iteration files under `research/lineages/`.
- [x] `validate.sh <packet> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Inputs frozen in `scratch/` | Done | `window-commits.txt` holds 1084 lines, `recent-packets.txt` lists 21 packets |
| Fan-out run | Done | run `1795593886068-na5znl` exit 0, codex and devin 10 iterations each, both `maxIterationsReached` |
| Synthesis and verification | Done | `research/research.md`: 16 of 26 candidates confirmed (9 missing, 5 drift, 2 bug), 10 rejected |
| Follow-up on main | Done | stop-decision frontier fix 4067 passed, dists rebuilt, release notes PASS/VALID |
| Save | Done | tasks.md verification counts set to 12/12, 13/13, 1/1 |
| Dependabot and main CI | Done | hono 4.13.22, PR 108 merged, 12 pip alerts dismissed, 3 failing main checks fixed |
| Generation 3 deep research (codex luna xhigh, 10 iters) | initialized, loop pending | research/deep-research-config.json |
| Generation 3 deep research (codex luna xhigh, 10 iters) | Done | maxIterationsReached; research.md: 2 P2 + 2 P3 in window, 3 pre-existing, 2 rejected; no fixes |
| Alias fallout fix and merge of worktree 547 | done | main 76dde2351f8, link guard 0 broken, deep-loop 4069/0, spec-kit CLI 2725/0 |
| Fixed the two pre-existing red workflows on main | done | deep-loop 4071/0 detached, skill-root and graph checks 0, corpus pins match and floors hold |

### Deviations and findings

| Item | Note |
|------|------|
| Per-iteration timeout | Raised from 900 s to 1,800 s for xhigh. No iteration timed out. |
| Stop reason | Both lineages hit the iteration cap, not convergence, so the audit is not exhaustive. |
| Release notes updated | Shape, voice and document checks pass on `v4.2.0.0.md`. |
| D3 amendment | The operator asked for the bug fixes, then the changelog update. B2 fixed in `overlay-engine.cjs`, and the executable bit restored on three files. |
| Generation 3 budget | Iteration 1 took 887 s, so the YAML-default 120-minute budget would have stopped the loop near iteration 8. The operator chose to raise `maxDurationMinutes` to 180 on 2026-11-26. The per-iteration timeout stays at 1,800 s, not the 900 s the invocation implied. |
| Stop-hook write | The Claude Stop hook wrote `decision-record.md` into this packet unasked at 08:05:05Z. Kept, and cited as live evidence for finding M1. |
<!-- /ANCHOR:log -->
