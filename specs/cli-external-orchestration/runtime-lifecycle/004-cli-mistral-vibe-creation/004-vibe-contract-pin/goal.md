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
    last_updated_at: "2026-11-14T15:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ran the keyed contract-pin dispatches and recorded Q1, Q3, Q4 and Q7"
    next_safe_action: "Carry the Q1, Q3, Q4 and Q7 answers into phases 005 to 012"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "../001-deep-research/research/phase-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: json is one array of entries, streaming one entry per line; export.json is the verdict"
      - "Q3: stdin works only behind a bare -p"
      - "Q4: the ancestor walk sees vibe-rs and vibe-app-server, never vibe"
      - "Q7: roster ids need hand-written rows"
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

- [x] `ls evidence` lists `export.json`, `exit-code.txt`, `output-json.txt` and `output-streaming.txt`
- [x] `jq -r .exit_code evidence/export.json` prints `0`
- [x] `rg -c '^\| Q[1347] \|.*\| Done \|' goal.md` prints `4`
- [x] `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | Answer | State | Evidence |
|------|--------|-------|----------|
| Key | `zsh -c 'env \| grep -c MISTRAL_API_KEY'` prints `1` (2026-11-14) | Done | operator export in `~/.zshenv` |
| Q1 | `--output json` prints one JSON array of session entries (user and assistant messages) at the end; `--output streaming` prints the same entries as one JSON object per line. Neither carries the exit code, so `export.json` stays the verdict | Done | `evidence/output-json.txt`, `evidence/output-streaming.txt` |
| Q3 | Stdin is a prompt source only behind a bare `-p`: `echo "<prompt>" \| vibe -p ...` exits 0 and answers; with no `-p` it exits 1, "Interactive mode needs a terminal" | Done | `evidence/stdin.md` |
| Q4 | The walk sees `vibe-rs` and its child `vibe-app-server`, never `vibe`: the Python launcher execs away. A recursion guard must match `vibe-rs` and `vibe-app-server` | Done | `evidence/ancestors.txt` |
| Q7 | No. Without a hand-written row both roster ids exit 1, `Unknown model ... Available: mistral-medium-3.5`. Hand-written rows with their own aliases are required | Done | `evidence/catalog.md` |

When a question is answered, its row becomes `| Q<n> ... | Done | evidence/<file> |`.

### Open questions

None. Research questions 1, 3, 4 and 7 are answered in the Progress table.

### Deviations and findings

| Item | Note |
|------|------|
| Blocker cleared | The operator exported `MISTRAL_API_KEY` in `~/.zshenv` on 2026-11-14 |
| Built-in rows | A config with hand-written rows also carries two built-in rows, `mistral-vibe-cli-latest` (alias `mistral-medium-3.5`) and `zai-glm-5-3-flash-vibe-free` (alias `zai-glm-5-3-flash`). Only `mistral-medium-3.5` of the two is selectable |
| Default system prompt | A one-word answer cost about 8,450 input tokens, so Vibe's own system prompt is large |
| Research observation | Unisolated Vibe commands wrote `~/.vibe/logs`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` during research, which is why D1 exists |
<!-- /ANCHOR:log -->
