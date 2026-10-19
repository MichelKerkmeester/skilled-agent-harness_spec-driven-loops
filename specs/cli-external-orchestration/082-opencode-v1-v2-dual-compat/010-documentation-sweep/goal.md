---
title: "Goal: Phase 10: documentation-sweep"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "documentation sweep goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-documentation-sweep"
    last_updated_at: "2026-10-18T12:45:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-documentation-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: documentation-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every doc that the OpenCode build touches up to its sk-doc mode, so that each one passes its validator, scores 75 or higher on DQI and passes the human-voice scan, while no doc describes a v1-only dispatch shape as universal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| Parent | Parent decisions D1 to D8 bind this phase. None is restated here. |
| L1 | Each doc is written through the sk-doc mode for its type, and that mode's validator is its gate. |
| L2 | Each doc belongs to one writer dispatch at a time, and no two dispatches edit the same doc. |
| L3 | No doc is trimmed only to raise its DQI score. |
| L4 | Every version-specific claim names 1.19.3 or 2.0.32, or it says the claim is unverified. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Every touched doc exits 0 from the validator named by its sk-doc mode
- [x] Every changed skill, hub and playbook package exits 0 from its sk-doc package check
- [x] Every touched doc scores 75 or higher for `dqi.total` in `extract_structure.py` output
- [x] A search for `--command`, `--dir`, `--share`, `--port` and `--pure` across the touched docs returns only lines that name version 1
- [x] Every touched doc passes `hvr_scan.py` with exit status 0, and its manual human-voice note is recorded
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
| Planning documents filled | Done | The six documents in this folder, written from the phase 010 brief and research sections 6 and 11 |
| Inventory and search | Done | 52 docs in `doc-inventory.md`, 11 of them added with the event correction (`scratch/decisions.txt` 18); 32 phase-004 docs reviewed with no regression (`scratch/decisions.txt` 1, 3) |
| Writes and review | Done | DeepSeek wrote 23 briefs, the catalog, the changelog, two READMEs and five fix rounds; Luna ran three reviews and four verifies, the last PASS. The event correction added rounds 6 to 9 through cli-pi, with two Luna reviews and two verifies (`scratch/reviews/`) |
| Gates | Done | 52 of 52 validator 0, DQI 77 or more, HVR 0; every package check exit 0; no untagged v1-only hit; no claim line (`doc-inventory.md`) |

### Deviations and findings

| Item | Note |
|------|------|
| Playbook file count | The research names 20 playbook files, but its own grouped list sums to 21 before the intra-routing-recall group. The named group folders now hold 34 files. The T004 grep sets the real set, and the packet follows that grep: 17 scenarios and the root page. |
| Criterion 4 reading | A hit counts as naming version 1 when its line, its heading, its table header, the text before its code fence or the doc's version note says so (`scratch/checks/tagctx.py`). 295 of 404 hits are tagged on their own line, and none is untagged. |
| Rule 7 amended | The facts file's "do not change frontmatter" now covers `version` only, so two wrong descriptions were corrected (`scratch/decisions.txt` 7). |
| SKILL.md word limit | The package check failed at 5,363 words. HEAD was already over it after phase 006. SKILL.md is now 4,899 (decision 11). |
| Scope amendments | Two test READMEs, the hub's routing manifest and its authored copy, and the Hermes copy of SKILL.md joined the file list (decisions 10, 13, 14). |
| Route doc | The `/doctor:opencode` route doc does not exist; it waits for Q1 (008 decisions 4 and 15). |
| Executor slip | One test harness ran the operator's `opencode2 --version` once by mistake; it failed to exec and changed nothing (decision 16). |
| Event correction | Phase 011's live runs showed that both versions emit `step_start`, `tool_use`, `text` and `step_finish` with `sessionID`, so the older event names in 26 docs were wrong on OpenCode 1 too. Fixed as an amendment, with 11 docs whose OpenCode 1 lines had no tag (`scratch/decisions.txt` 18). The writer ran through cli-pi because the devin quota was spent. |
<!-- /ANCHOR:log -->
