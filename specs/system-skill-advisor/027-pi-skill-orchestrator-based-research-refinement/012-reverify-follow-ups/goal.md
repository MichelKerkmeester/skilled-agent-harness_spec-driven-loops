---
title: "Goal: Closing the Goal Re-verification Follow-ups"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/012-reverify-follow-ups"
    last_updated_at: "2026-09-28T05:36:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed FU2 with round 3 and proved the parent goal again"
    next_safe_action: "None. Every criterion holds"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-phase-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Closing the Goal Re-verification Follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close each of the four follow-ups the goal re-verification after phase 11 left for the operator, so none of them stays open.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A defect found while closing a follow-up goes into `spec.md` before any work on it starts. |
| D2 | The sandbox teardown in CP-003 and CP-004 sends no signal. Nothing in this phase stops the live advisor. |
| D3 | The cli-devin edit ships in one commit with its re-minted route manifests and its Hermes copy. |
| D4 | No file another session has changed is staged or rewritten. A generated mirror is rebuilt in a scratch folder, and only this phase's file is copied back. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The parent goal's decisions table holds D5, which limits `--permission-mode dangerous` for cli-devin to scenario test runs, and `goal.cjs packet` on packet 030 reports `packet_budget=ok`
- [ ] cli-devin's NEVER rule 1 and ESCALATE IF rule 4 ask for one approval per task, its `SKILL.md` reads version 1.4.5.0 and `validate_document.py` reports 0 issues for `changelog/v1.4.5.0.md`
- [ ] `compiled-route-guard.cjs` exits 0 with every hub fresh, and `sync-skills-hermes.cjs --check` prints PASS
- [ ] Under a one-minute idle timeout, the committed CP-003 step 1 leaves a `/tmp/cp003.*` folder behind and the new step 1 leaves none, and the new teardown sends no signal, so decoy pids named in a lease survive it and a process holding a file open in the sandbox keeps the sandbox from removal
- [ ] CP-003 and CP-004 report PASS in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, and no `/tmp/cp003.*` or `/tmp/cp004.*` folder remains afterward
- [ ] `daemon-absent-fallback.md` has no `## 6.` or `## 7.` heading, and `validate_document.py` reports 0 issues for it
- [ ] The system-spec-kit benchmark reports hold `2026-09-27--manual-testing-playbook--directive-lifecycle-dedup-five-cli/` with five outcomes, and each evidence byte count and SHA-256 in it matches its file
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
| Phase opened | Done | Scaffolded with `create.sh`, baselines in `evidence/baselines.txt` |
| FU1 Devin approval and rule | Done | D5 in the parent goal, cli-devin 1.4.5.0 with its release entry, route guard fresh, Devin prompt routes compiled, Hermes check PASS (`evidence/routing-after-remint.txt`) |
| FU2 sandbox teardown | Done | CP-003 and CP-004 share a teardown that sends no signal and waits for the lease, the socket and every open sandbox file to go. The negative control, both behaviour tests and GPT-6 Luna's fourth verify pass (`evidence/cp003-negative-control-3-idle.txt`, `evidence/teardown-check/open-file-result.txt`, `evidence/luna-verify/report-4.txt`). Round 3 passed ten of ten in the five CLIs with no sandbox left. The two Codex testers removed the sandbox with a substitute command where the brief called for BLOCKED (`evidence/teardown-reruns/`) |
| FU3 CP-004 record | Done | Sections 6 and 7 removed, `validate_document.py` reports 0 issues |
| FU4 scenario 457 record | Done | Five outcomes. 10 byte and SHA-256 pairs, each listed twice, recomputed with 0 mismatches. The index lists the folder first |
| Parent goal proved again | Done | The four suites, the live plugin load, a sandboxed daemon and the installer check pass from the final state. CP-003 and CP-004 passed round 3, and the other seven scenarios keep their phase 11 result, since no commit changed code in the paths they run through. Route manifests changed as well, but they feed only metadata none of the seven checks (`evidence/goal-reverify/`) |

### Deviations and findings

| Item | Note |
|------|------|
| Teardown defect found while closing FU2 | The first GPT-6 Luna verify returned FAIL: the socket check compared text, so a `..` path passed it, and the block signalled lease pids unchecked and removed the sandbox without waiting for the daemon. CP-004 step 5 runs the same code. Per D1 the defect went into `spec.md` first, then D2 was amended and criteria 4 and 5 were extended to cover CP-004 (`evidence/luna-verify/report-1.txt`) |
| Second verify, teardown redesigned | The hardened teardown still trusted lease pids, and the second verify showed a lease left by a killed launcher can name a pid another process takes later. The teardown now sends no signal at all: the sandbox daemon exits on a 12-second idle timeout and the block waits for its lease and socket to go. D2 and criterion 4 were amended again, and `spec.md` records the change first (`evidence/luna-verify/report-2.txt`) |
| Codex usage limit | The third Luna dispatch stopped at 16:28Z on "You've hit your usage limit", with a reset at 20:43Z. The verify ran after the reset at 20:45Z |
| Third verify, open-file test added | The third verify returned FAIL on 2026-09-27. A launcher that crashes deletes its lease without waiting for its daemon, so the block could remove the sandbox during the daemon's startup scan or shutdown drain. Per D1 the finding went into `spec.md` first. The operator chose to close both windows, and the wait now also needs `lsof -t +D "$SANDBOX"` to print nothing. The block still sends no signal, and the fourth verify returned PASS. Its one text finding, a stray period in CP-003 step 1, was then removed |
| Live advisor restarted | Launcher 79958 exited between 15:34:28Z and 15:35:57Z and the next call started 97186 and 97187. Those two exited in turn after round 2a, and 9495 and 9506 started at 17:23:40Z. The likely cause both times is the 30-minute idle exit, not confirmed. A third change, 92477 to 40890 at 05:02:08Z on 2026-09-28, came two to four minutes after 92477 started, during the open-file behaviour test. Its cause is unknown, and the test's crashed-launcher case is not ruled out, so that case waits for the operator (`evidence/live-launcher-change.txt`) |
| Other sessions' advisors | The Barter coder advisor (18680, 18683) and a worktree 069 advisor started at 16:16:45Z (30503, 30504) ran beside the tests. Every snapshot lists them, and nothing in this phase touched them |
| Prompt hook outage at the pool start | The pi CP-003 and devin CP-004 testers, started one second apart at 16:31:07Z, saw `Advisor: outage (fail_open)` at prompt time. The four testers outside Cursor saw a live brief, and the two Cursor testers saw no `Advisor:` line. The hook failed open as designed, and the runs were unaffected. This phase did not look further |
| CP-004 exports lost between tool calls | The devin and opencode shells do not keep step 2's exports for the next command, so each tester's first step 3 reached the live daemon with a read-only query. Both followed the scenario's own failure row and reran steps 2 to 5 in one shell. The live generation and lease hashes stayed the same |
<!-- /ANCHOR:log -->
