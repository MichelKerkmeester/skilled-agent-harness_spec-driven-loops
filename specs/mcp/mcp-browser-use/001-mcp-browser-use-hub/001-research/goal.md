---
title: "Goal: Phase 1: research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research"
    last_updated_at: "2026-11-21T08:11:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: Phase 1: research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Produce ten iterations of evidence-cited research that settle how Bladebro, Aside and Chrome DevTools fit one browser-use hub: their capabilities, each mode's CLI-or-Code-Mode lane, the hub contract, the blast radius of the move, the mode names, a macOS verification plan for Bladebro and the security limits.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executor is cli-opencode with opencode-go/hy4-flash-free at reasoning high, 10 iterations, stop policy max-iterations. |
| D2 | Local claims cite a file and line; upstream Bladebro claims cite a URL and the version read. |
| D3 | This phase produces findings only. No file outside research/ changes, and nothing in the repository changes while the lineage runs. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] research/deep-research-state.jsonl holds at least 10 iteration records
- [x] research/iterations/iteration-001.md through iteration-010.md exist
- [x] research/research.md has one answered section for each of KQ1 to KQ8
- [x] research/research.md names the folder, workflowMode and packetSkillName for all three modes
- [x] research/research.md has a synthesis section for each of 002 to 006
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
| Charter authored | Done | spec.md KQ1-KQ8 table |
| Deep-research run | Done | `rg -c '"type":"iteration"' research/deep-research-state.jsonl` printed 12; `ls research/iterations` lists iteration-001.md to iteration-012.md |
| KQ coverage | Done | `rg -o 'KQ[1-8]' research/research.md \| sort -u \| wc -l` printed 8; `rg -o '00[2-6]-[a-z-]+'` printed 5; §7 names all three mode ids |
| Closeout | Accepted by operator with known closeout gap | Last `synthesis_incomplete` event: 80 findings claimed, 59 rebuilt; config status `initialized` |

### Deviations and findings

| Item | Note |
|------|------|
| 12 iterations, not 10 | The run was extended by two iterations to answer operator inbox questions 9 (outside-hub blast radius) and 10 (Lighthouse). The criteria above count at least 10 and still hold |
| Workflow closeout incomplete | `synthesis-closeout.cjs` reports `count_only_state_findings_not_reconstructed`: iterations 1 to 8 wrote `### Finding N` subsections the reducer does not parse. Accepted by operator; the reducer heading-format blind spot is tracked as a separate follow-up |
| `research.md` §17 stale | Still shows the pre-extension 65/44 counts; iterations 11 and 12 carry the later answers |
<!-- /ANCHOR:log -->
