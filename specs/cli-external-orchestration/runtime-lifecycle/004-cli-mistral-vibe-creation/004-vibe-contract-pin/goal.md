---
title: "Goal: Phase 4: vibe-contract-pin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe contract pin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin"
    last_updated_at: "2026-11-14T14:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the contract-pin dispatches from the research phase plan"
    next_safe_action: "Operator exports MISTRAL_API_KEY in ~/.zshenv, then run T001"
    blockers:
      - "MISTRAL_API_KEY is not exported in ~/.zshenv"
    key_files:
      - "../001-deep-research/research/research.md"
      - "../001-deep-research/research/phase-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What are the --output json and streaming payload shapes?"
      - "Is stdin a prompt source in vibe 3.1.2?"
      - "Does the ancestor walk see vibe or vibe-rs?"
      - "Does the Mistral catalog list both roster ids without a hand-written row?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: vibe-contract-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Pin Mistral Vibe's headless dispatch contract with recorded evidence from keyed runs, so later phases build on observation instead of source reading.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every Vibe command in this phase runs with `VIBE_HOME` set to a fresh temp dir and a temp working directory, never the operator's home or the repository root |
| D2 | Hook wire format is phase 008's; this phase does not settle it |
| D3 | Reasoning effort is pinned by a hand-written model row's `thinking = "max"`, because Vibe has no reasoning flag |
| D4 | No default model changes anywhere. DevPass stays the default |
| D5 | Evidence and drafts stay in this packet's `evidence/` and `scratch/`, and no file holds a key value |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `ls evidence` lists `export.json`, `exit-code.txt`, `output-json.txt` and `output-streaming.txt`
- [ ] `jq -r .exit_code evidence/export.json` prints `0`
- [ ] `rg -c '^\| Q[1347] \|.*\| Done \|' goal.md` prints `4`
- [ ] `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`
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
| Key exported | Blocked | `env \| grep -c MISTRAL_API_KEY` printed `0` on 2026-11-14 |
| Q1 payload shapes | Pending | `evidence/output-json.txt`, `evidence/output-streaming.txt` |
| Q3 stdin as prompt source | Pending | `evidence/stdin.md` |
| Q4 ancestor process name | Pending | `evidence/ancestors.txt` |
| Q7 catalog listing | Pending | `evidence/catalog.md` |

When a question is answered, its row becomes `| Q<n> ... | Done | evidence/<file> |`.

### Open questions

- Open question: What are the `--output json` and `streaming` payload shapes? (research question 1)
- Open question: Is stdin a prompt source in 3.1.2? The help text lists stdin, but the binary's message reads "Pass either -p TEXT or --prompt-file". (research question 3)
- Open question: Does a recursion guard's ancestor walk see `vibe`, `vibe-rs` or both? (research question 4)
- Open question: Does the Mistral catalog list `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` for Vibe without a hand-written row? (research question 7)

### Deviations and findings

| Item | Note |
|------|------|
| Blocker | `MISTRAL_API_KEY` is absent from `~/.zshenv`, so no task can start until the operator exports it |
| Research observation | Unisolated Vibe commands wrote `~/.vibe/logs`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` during research, which is why D1 exists |
<!-- /ANCHOR:log -->
