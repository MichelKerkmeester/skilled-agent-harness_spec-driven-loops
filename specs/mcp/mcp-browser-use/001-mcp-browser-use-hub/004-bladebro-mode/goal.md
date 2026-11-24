---
title: "Goal: Phase 4: bladebro-mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "bladebro mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode"
    last_updated_at: "2026-11-24T05:32:33Z"
    last_updated_by: "claude-code"
    recent_action: "Reran all five criteria and ticked them"
    next_safe_action: "Rerun the five criteria when a later phase edits the Bladebro packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-21-browser-use-hub-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: bladebro-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Agents can use Bladebro through a mode packet that picks its CLI or its Code Mode MCP fallback, names the browser lane to use and the actions to refuse.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The owned agent-browser profile is the default lane; real-browser lanes need an explicit request. |
| D2 | Each Bladebro limit names the mode that covers it. |
| D3 | Aside keeps deterministic signed-in work; this phase does not change the Aside packet (`../001-research/research/research.md` §10). |
| D4 | R-SEC-1, R-SEC-2 and R-SEC-3 go into the packet verbatim from `spec.md` section 3. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] parent-skill-check.cjs run with .skilled/skills/mcp-browser-use exits 0, names that hub, and the registry lists 3 modes
- [x] .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md carries name: mcp-bladebro and the command -v bladebro lane check
- [x] rg -c for R-SEC-1, R-SEC-2 or R-SEC-3 in that SKILL.md prints at least 3, and each rule's text matches spec.md section 3
- [x] jq . .utcp_config.json exits 0 and the file contains a bladebro stdio manual with args ["mcp"]
- [x] git diff --stat on .skilled/skills/mcp-browser-use/mcp-aside-devtools prints nothing
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
| Draft scope written | Done | spec.md marked refined after 001-research |
| Refine from 001-research | Done | spec.md section 3 carries the lane rule, lanes, limits and R-SEC-1/2/3 verbatim; plan.md and tasks.md follow it |
| Re-level | Done | `recommend-level.sh --loc 600 --files 7 --json` printed `recommended_level: 1`, score 39, with 7 = the Files to Change rows; stays Level 1 |
| Packet authored | Done | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exit 0, `OK: parent-skill-check`, 3 modes; `rg -c 'R-SEC-1\|R-SEC-2\|R-SEC-3'` printed 6; each R-SEC line from spec.md matched once with `rg -F` |
| Code Mode manual | Done | `jq . .utcp_config.json` exit 0; the `bladebro` entry is stdio, `command: bladebro`, `args: ["mcp"]` |
| Aside unchanged by 004 | Done | sha256 of `git diff` and `git diff --cached` on the Aside folder equal the pre-edit baselines |
| Rerun 2026-11-24, criterion 1 | Met, ticked | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0, names `.skilled/skills/mcp-browser-use` as the parent skill and prints `OK: parent-skill-check` with 0 warnings. `3b` declares 3 modes, and `jq '.modes \| length'` prints 3 |
| Rerun 2026-11-24, criterion 2 | Met, ticked | `rg -n '^name: mcp-bladebro'` matches line 2. `rg -c 'command -v bladebro'` prints 4 |
| Rerun 2026-11-24, criterion 3 | Met, ticked | `rg -c 'R-SEC-1\|R-SEC-2\|R-SEC-3'` prints 6. Each quoted rule from `spec.md` lines 91, 93 and 95, searched with `rg -c -F`, prints 1 |
| Rerun 2026-11-24, criterion 4 | Met, ticked | `jq . .utcp_config.json` exits 0. The `bladebro` manual is `call_template_type: mcp`, `transport: stdio`, `command: bladebro`, `args: ["mcp"]` |
| Rerun 2026-11-24, criterion 5 | Met, ticked | `git diff --stat` and `git diff --cached --stat` on `.skilled/skills/mcp-browser-use/mcp-aside-devtools` print nothing, exit 0. The 003 relocation is committed, so the literal check now holds |
| Post-execution review | Done | @review APPROVED, 0 P0, 0 P1, 3 P2; the bare `mcp` router keyword was narrowed; R-SEC-3's "owned by 006" wording and the stale retrieval-fixture entry for the removed scaffold leaf are left for the operator and 005 |

### Deviations and findings

| Item | Note |
|------|------|
| Aside scope question closed | KQ8 answered no, so the "change Aside on a yes" branch is gone and REQ-005 asserts no diff |
| Version pin can move | Upstream ships about 40 releases in four months; T002 re-reads the releases API before authoring |
| Hub root `ROUTER.md` left to 005 | This phase writes the packet's own `ROUTER.md` only |
| Upstream moved to v4.8.3 | T002 printed `v4.8.3` (2026-11-21). The compare changes no `docs/` file or README, and the quoted flags were re-read and hold. The pin stays v4.8.2 because R-SEC-2/3 name it |
| Aside no-diff check fails as written | `git diff --stat` prints 33 files from 003's uncommitted relocation; 004's own delta is zero by sha256 baseline |
| Boxes left unticked at close | The evidence rows above met every criterion on 2026-11-21, but the boxes stayed open until the 2026-11-24 deep review flagged them |
| Placeholder folder was untracked | plan.md's `git restore` rollback cannot restore it; the stub was copied to `/tmp/bb004/stub-backup` before editing |
<!-- /ANCHOR:log -->
