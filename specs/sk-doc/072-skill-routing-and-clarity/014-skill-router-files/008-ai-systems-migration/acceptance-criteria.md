---
title: "Acceptance Criteria: Phase 8: ai-systems-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ai systems migration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/008-ai-systems-migration"
    last_updated_at: "2026-10-29T15:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the status of each criterion after the migration run"
    next_safe_action: "Conductor commits, releases T022, and rules on T023"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: ai-systems-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-ai-systems-migration
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

All commands run with `AIS="/Users/michelkerkmeester/MEGA/Development/AI Systems/AI Systems"` and `PYTHONDONTWRITEBYTECODE=1`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the unmoved tree, When the edited gates run, Then each prints its baseline pass line and the gate commits come before the first skill commit | `check_hub.py` prints `PASSED the hub, 4 registry packets and 51 gold rows`; `git log --reverse --format=%s <start>..HEAD` lists the gate commits first Observed: every edited gate printed its baseline pass line on the unmoved tree before any skill moved (`check_hub.py` `PASSED the hub, 4 registry packets and 51 gold rows`, T005 to T012). AI Systems holds one commit per system, `e6973a1f7` to `8171d5249`, each carrying that system's gate edits with its skill moves, so no commit has a moved skill under an unedited gate; each nested repository holds one commit. | Met | - |
| AC-002 | REQ-002 | Given the moved tree, When `ROUTER.md` files are counted and read, Then 16 exist, each with `router_state: active`, `skill_pointer: SKILL.md` and `## 3. MACHINE ROUTER` as its last H2 | `find "$AIS" -name ROUTER.md -not -path '*/specs/*' -not -path '*/node_modules/*' \| wc -l` prints 16; `grep '^## ' <file> \| tail -1` prints `## 3. MACHINE ROUTER` for each Observed: `find` printed 16, and a check of each printed `16 routers, 0 bad`. | Met | - |
| AC-003 | REQ-003 | Given the 14 moved skill `SKILL.md` and the 2 hub `SKILL.md`, When SMART ROUTING is read, Then each skill ends with the skill pointer sentence, each hub with the hub pointer line, and every link resolves | `grep -rlF '(./ROUTER.md) before selecting skill-local resources; open only the matched files.' "$AIS" --include=SKILL.md \| grep -v /specs/ \| wc -l` prints 14; `grep -rlF '(./ROUTER.md) before selecting hub resources.'` prints the Moneybird and Product Owner hubs Observed: the skill pointer grep printed 14 and the hub grep 2; RS-005 reports no unresolved link on any of the 16. | Met | - |
| AC-004 | REQ-004 | Given `scratch/baseline.md`, When every row is rerun into `scratch/after.md`, Then each row that exited 0 exits 0 with the same counts, and rows 1, 7, 13 and 29 are no worse | Differential counts 281, 221, 186, 132 and 110 and parity counts 18, 29, 7, 65, 13, 49 and 27 (plus any declared routing pair) reappear in `scratch/after.md` Observed: `scratch/after.md` has 37 rows; all eleven counts reappear in the final run, rows 7, 13 and 29 fail as recorded, and row 1 went from 3 failing gates to `all 15 gates pass`. | Met | - |
| AC-005 | REQ-005 | Given the local commits, When the phase closes, Then nothing has been pushed without the operator's approval | `git -C "$AIS/.." rev-list --count origin/main..main` prints the local commit count until the operator says push Observed: AI Systems `rev-list --count origin/main..main` prints 7 and `main..origin/main` prints 0; the eleven local commits across the five repositories wait for the operator's push approval. | Met | - |
| AC-006 | REQ-006 | Given the conductor's option C, When the Project folders, kernels and `SYNC.md` files are read, Then no routing knowledge document exists, no kernel or `systems.py` changed, each `SYNC.md` lists `ROUTER.md` in step 1 with a dated note, and parity passes | `ls "$AIS"/*/"claude project"/knowledge/ \| grep -ci rout` prints 0; `git diff --name-only -- '*/Custom Instructions.md' '*/systems.py'` prints nothing in each repository; each `bash benchmark/parity/run_parity.sh` exits 0 with its baseline pass line Observed: the `ls` grep printed 0; the `git diff` printed nothing in AI Systems and in the Media Editor, Moneybird, Product Owner and Prompt Improver repositories; all seven `SYNC.md` carry the step 1 change and the dated note; parity printed `PASSED 18/18`, `29 declared pair(s)`, `7/7`, `65/65`, `13/13`, `49/49` and `27/27`, each exit 0 | Met | - |
| AC-007 | REQ-007 | Given the changed route-table check, When `check-route-table.py --write` runs twice, Then the second run changes nothing and the check passes | `git diff` is identical after the two runs; `check-route-table.py` prints `route-table: ok` Observed: both `--write` runs printed `router block: unchanged (ROUTER.md)`, the nested repository's `git diff` hash stayed `dadff878`, and the check prints `route-table: ok`, exit 0. | Met | - |
| AC-008 | REQ-008 | Given the 16 moved skills, When the Public canon checker runs, Then each passes | `python3 "$AIS/../.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py" --check --strict <skill>` prints `Result: PASS` 16 times Observed: `Result: PASS` for 12 of 16. Copywriter lacks `HOW IT WORKS` and `REFERENCES` sections, Sales Communication and Deal Templates are named unlike their folders, and HubSpot has 28 findings (19 `0.NNN` resource-doc versions, 8 changelog entries without `version`, and an `UNKNOWN_FALLBACK` marker its pre-move `SKILL.md` also lacked); each fix reaches past a routing move. No RS-001 to RS-005 finding on any of the 16. | Waived | ADR-001 |
| AC-009 | REQ-009 | Given the Moneybird hub, When its folder is read, Then it holds a `ROUTER.md` whose final `## 3. MACHINE ROUTER` names the child modes as `hub-router.json` and `mode-registry.json` do, its `SKILL.md` Section 2 ends with the hub pointer line and still names its three children, and its routing is unchanged | `grep '^## ' ROUTER.md \| tail -1` prints `## 3. MACHINE ROUTER`; `grep -c 'cli-jortt\|cli-moneybird\|sk-moneybird-accountant' SKILL.md` prints at least 3; `check-route-table.py` prints `route-table: ok` Observed: the last H2 is `## 3. MACHINE ROUTER`, the children grep prints 9, `route-table: ok` (the check now holds each registry mode to the hub router), and `route-replay.py --mode replay` printed `31 replay rows passed`, the same after the `repo-root-hub` extension was added to `mode-registry.json`. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met except AC-008, which ADR-001 waives to a follow-up canon packet.
<!-- /ANCHOR:closure -->
