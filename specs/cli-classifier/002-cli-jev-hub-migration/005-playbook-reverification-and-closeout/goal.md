---
title: "Goal: Phase 5: playbook-reverification-and-closeout"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "playbook re-verification"
  - "cli-jev closeout"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/005-playbook-reverification-and-closeout"
    last_updated_at: "2026-09-20T16:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Both corpora executed and recorded; docs reconciled; program closed"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-005-playbook-reverification-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: playbook-reverification-and-closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The migration is verified by execution, not by citation: both playbooks run from
their new home with their streams captured, their reports dated, and the living docs edited only
where an observation contradicted them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The corpora are executed before any doc is edited, so the verdicts decide the wording rather than the reverse |
| D2 | The no-key half runs against an isolated credential store, because variables alone no longer reproduce the key check once a key is stored |
| D3 | The no-key half is compared against the recorded matrices field by field; a byte-identical result is the finding, not a formality |
| D4 | The two suites are read on the live files only, with a review quarantine copy and a sibling worktree copy excluded and named |
| D5 | The dispatch guard's predicate is observed and recorded, never widened to suit a scenario |
| D6 | Only docs that make a false claim are edited; recorded evidence keeps its recorded text |
| D7 | Derived surfaces are regenerated last, over final bytes, through each owner's own writer |

### Operator copy

Phase 5 could have been closed on paper: every earlier phase had already re-cited this corpus. It was
re-executed instead, and the two things that found — a stored credential hides the key check, and the
stdin rule refuses a quoted state — are what only an execution shows.

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] All 22 transport scenarios executed from the migrated home, `22 PASS, 0 FAIL, 0 SKIP`
- [x] The no-key half and the surface pass compared against the recorded baseline with 0 differences
- [x] The credential half executed live with 0 key-material hits across every capture
- [x] The hub's three routing scenarios executed against the compiled front door, with the kill-switch control
- [x] The dispatch gates re-probed: five deny decisions, two advisories, eight approvals
- [x] Both runs recorded as dated reports with raw captures and their scripts
- [x] Living docs reconciled: both run records, the index row, the refused command, the reworded criterion
- [x] Derived surfaces regenerated: leaf manifest unchanged, versions converged, manifest re-derived, trigger index regenerated
- [x] Both packets validate with `RESULT: PASSED`
- [x] Program closed with the phase map and continuity in agreement

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| No-key half | Done | 21 labels vs baseline, 0 differences (`compare.py`) |
| Surface pass | Done | 11 sections vs baseline, 0 differences (`compare-surface.py`) |
| Credential half | Done | `auth status`/`test`, `noul` `0.95`, `choice` `billing`, `score` `2.0`, all exit 0 |
| Leak check | Done | 0 store tokens across captures (`leak-check.py`); sentinel count `0` |
| Dispatch suites | Done | rule-checks 20/20 exit 0; audit 75/75 exit 0 on the live file |
| Dispatch gates | Done | 5 deny, 2 advisory, 8 approve (`preflight-probe*.txt`) |
| Hub corpus | Done | CJ-001/CJ-002 route, CJ-003 + holdout defer, sentinel under the flag |
| End to end | Done | `jev noul … --value` through the resolved packet → `0.86` |
| Reports | Done | Both dated report folders, each with `raw/` |
| Doc reconciliation | Done | Both run records, index row, refused command, reworded criterion |
| Derived surfaces | Done | Versions converged (40 ok / 1 skip), manifest 2,932 rows / 0 old-path, trigger index regenerated |
| Gates | Done | Doctor 42 PASS exit 0; playbook validator PASS; freshness fresh; admission exit 0; recursive validate exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The plan's unauthenticated recipe | Clearing the provider variables no longer reproduces the key check once a credential is stored; `XDG_CONFIG_HOME` isolation was added, proven by a control probe, and the report states it |
| The stdin rule's reach | `jev-stdin-bounded` refuses a quoted-literal state too, though its declaration names only `-s -`, an omitted flag and `run -`; recorded as a finding for the guard's owner and left unchanged |
| A mistyped manifest flag | `--manifest-out <path>.json` made the engine write `<path>.json.json`/`.csv` and, on an earlier invocation without the flag, rewrite the repository manifest with the cli-jev subset; the stray files were removed, the manifest regenerated repo-wide (2,932 rows) through the same tool, and the row count checked against HEAD |
| A contaminated suite run | The first audit invocation matched a review quarantine copy and a sibling worktree copy; the live file was isolated and the naive result kept in the record |
| Pre-existing reds | Re-measured at close: the foundation suite reports 2 of 37 and the manifest suite 15 of 42, all the archived authored resolver. The pre-phase baseline's 4 and 16 included `sk-doc`'s stale manifest — three tolerance assertions across the two suites — which that hub's owner re-minted before this phase closed |
| Other hubs' prose | Five-hub fleet-count claims in `sk-doc` templates, the architecture reference and `sk-design` remain their owners' follow-ups |
| Working tree | Left uncommitted; the commit decision is the operator's |
<!-- /ANCHOR:log -->
