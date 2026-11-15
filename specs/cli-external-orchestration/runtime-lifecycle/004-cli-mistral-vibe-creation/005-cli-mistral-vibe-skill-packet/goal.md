---
title: "Goal: Phase 5: cli-mistral-vibe-skill-packet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli mistral vibe skill packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/005-cli-mistral-vibe-skill-packet"
    last_updated_at: "2026-11-14T14:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the cli-mistral-vibe mode packet: eight files, all checks passing"
    next_safe_action: "Phase 006 builds the .vibe/ runtime folder"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "../004-vibe-contract-pin/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What is the hook decision wire format?"
      - "Does a Vibe turn draw on the same Mistral usage pool as an API turn?"
    answered_questions:
      - "Payload shapes, stdin, process name and catalog: answered by phase 004"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: cli-mistral-vibe-skill-packet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give Mistral Vibe a governed mode packet whose rules and references state only what phase 004 observed or the research read from source.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The packet follows the layout of `cli-deepseek-harness` and lives at `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/` |
| D2 | Print mode (`vibe -p`) is the only dispatch surface the packet documents. ACP stays deferred |
| D3 | A dispatch outcome is read from `export.json`, never from stdout |
| D4 | The hooks reference does not state the wire format. Phase 008 owns it |
| D5 | No default model changes anywhere. DevPass stays the default |
| D6 | This phase writes only inside the new mode folder. Hub registration is phase 010's |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `jq '[.[] | select((.check // "") == "")] | length' hard-rules.json` prints `0`
- [x] `validate_document.py` prints `Total issues: 0` for all seven markdown files in the packet
- [x] `rg -o UNKNOWN references/cli-reference.md | wc -l` prints `0`
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
| Phase 004 evidence | Done | `004-vibe-contract-pin/evidence/` holds export, payloads, stdin, ancestors and catalog |
| Mode packet folder | Done | `find .skilled/skills/cli-external-orchestration/cli-mistral-vibe -type f \| wc -l` prints `8` |
| Hard rules | Done | 0 rules without a check; 6 of 6 named checks |
| Markdown validation | Done | 7 of 7 files print `Total issues: 0` |
| Scope | Done | `.skilled` status outside the packet matches `scratch/status-before.txt` |

### Open questions

- Answered by phase 004: `--output json` prints one JSON array of session entries at the end, and `--output streaming` prints the same entries one per line; neither carries the exit code, so `export.json` is the verdict.
- Answered by phase 004: stdin is a prompt source only behind a bare `-p` (`echo ... | vibe -p` exits 0); a pipe with no `-p` exits 1, "Interactive mode needs a terminal".
- Answered by phase 004: the ancestor walk sees `vibe-rs` and its child `vibe-app-server`, never `vibe`, because the Python launcher execs away.
- Answered by phase 004: neither roster id resolves without a hand-written model row (`Unknown model ... Available: mistral-medium-3.5`), so the rows use their own aliases, `deepseek-flash` and `glm-flash`; `mistral-medium-3.5` stays selectable until `allowed_models` closes it.
- Open question: What does a hook receive and how does it answer? UNKNOWN until phase 008. `guards-and-hooks.md` marks it UNKNOWN.
- Open question: Does a Vibe turn draw on the same Mistral usage pool as an API turn (research question 6)? UNKNOWN, and the phase plan gives it no owner. The providers reference states it as UNKNOWN.

### Deviations and findings

| Item | Note |
|------|------|
| Delegated writes | Each file was written by one `opencode run` dispatch on `mistral/deepseek-v4-1-flash-1017#max`, one file per brief; every Verify was rerun by the orchestrator. No fallback route was needed |
| Corrections after review | `hard-rules.json` roster message said Vibe "does not validate catalog membership"; it now says unknown ids exit 1 but `mistral-medium-3.5` stays selectable. `cli-reference.md` cited research for `-p TEXT`; it now cites the phase 004 capture. `providers-and-models.md` cited a task id; the sentence now describes the proof |
| Completion line | The Completion Criteria said T013 prints `0` and `5`, written before the sixth rule; corrected to `0` and `6` |
| Corrected by phase 006 | Phase 006 probes showed `allowed_models` matches model names, not aliases, and that `--trust` from a subdirectory does not apply the root config. `providers-and-models.md`, `runtime-folder-and-sync.md`, `cli-reference.md`, `guards-and-hooks.md` and `SKILL.md` were corrected there |
<!-- /ANCHOR:log -->
