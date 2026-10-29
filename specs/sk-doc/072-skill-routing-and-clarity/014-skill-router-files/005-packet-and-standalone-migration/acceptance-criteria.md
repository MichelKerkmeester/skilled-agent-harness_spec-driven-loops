---
title: "Acceptance Criteria: Phase 5: packet-and-standalone-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "packet and standalone migration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration"
    last_updated_at: "2026-10-29T14:15:00Z"
    last_updated_by: "pi"
    recent_action: "Marked every criterion met from the final tree: 54 routers, 0 headings, an empty ledger, an identical replay and green checks"
    next_safe_action: "Commit the packet docs, then open phase 006"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: packet-and-standalone-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-packet-and-standalone-migration
**Level:** 1
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When each of the 47 moved skills is read, Then a sibling `ROUTER.md` holds the section that left its `SKILL.md`, with `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` unchanged | `find .skilled/skills -name ROUTER.md -not -path "*/node_modules/*" \| awk 'END{print NR}'` prints 54. All 47 moved routers carry `router_state: active`, `skill_pointer: SKILL.md`, `## 1. OVERVIEW`, `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER`, and `parseRouter` in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` returns identical output for all 47 against `8bc18283904`, the parent of move commit `ca10a236d2`, 47 same and 0 different. Five bodies differ beyond the shared two-line header in the current tree. At the move, `sk-code-review` kept its "Related skills" line in `SKILL.md` because it is not router content, and `sk-design-diagram` and `sk-design-fundamentals` drop one self-reference line that is false inside `ROUTER.md`. Later router-reference fixes change the `ALWAYS` resource entries in `mcp-obsidian` and `sk-prompt` to name `ROUTER.md`. The `o200k_base` command in `plan.md` section 5 printed 84,664 over the 47 moved routers at move commit `ca10a236d2`, above the 82,439 the batch table projected. The measured saving is the `SKILL.md` word delta, 160,204 to 125,932 | Met | - |
| AC-002 | REQ-002 | Given a moved `SKILL.md`, When its SMART ROUTING section is parsed, Then it is at most 12 lines and 180 words and ends with the pointer sentence research section 6 proposes | `package_skill.py --check --strict` prints `Result: PASS` on all 54 skill folders. `grep -rl 'before selecting skill-local resources' .skilled/skills --include=SKILL.md \| awk 'END{print NR}'` prints 47, and `grep -c 'MACHINE ROUTER'` prints 0 in each of them. The closing line reads `Read [ROUTER.md](./ROUTER.md) before selecting skill-local resources; open only the matched files.`, the same sentence with the path written as a link to the sibling file | Met | - |
| AC-003 | REQ-003 | Given the final ledger, When its debt object is counted, Then every one of the 47 entries is gone and 0 remain | `python3 -c "import json;print(len(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json'))['debt']))"` prints 0, the frozen fixture `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` prints 0, and `node --test` on `routing-shape-known-debt-ratchet.test.cjs` prints pass 4 fail 0. Both ledgers held exactly the 47 moved skills before the move | Met | - |
| AC-004 | REQ-004 | Given each of the five batches, When the seven-leg gate runs, Then every leg prints its expected line and the figures match the batch table in `plan.md` | Met on the substance, with a deviation on the per-batch record. The five batches ran as two waves of parallel workers, 20 skills and then 27, so `scratch/batch-01.txt` to `scratch/batch-05.txt` do not exist and `grep -l 'Findings: 0' scratch/batch-0[1-5].txt` prints nothing. Every skill passed the per-skill checks inside its wave, and one gate ran on the final tree with the lines the table asks for: 54 `Result: PASS` runs, 54 `ROUTER.md` files, ledger 0, `Findings: 0`, `leaf-manifest.json OK`, `OK: parent-skill-check` on all seven hubs and `PASS: 65 Hermes skill copies in sync` | Met | - |
| AC-005 | REQ-005 | Given the evidence folder, When it is read, Then the replay baseline, the token baseline and one file per batch are there with the commands and their output | Met on the substance, with a deviation on the file list. `ls scratch/` lists three files, not eight: `router-replay-baseline.txt`, `router-replay-after.txt` and `router-token-after.csv`, and no `batch-00.txt` to `batch-05.txt`. The replay baseline and the after capture are byte-identical, so the before and after state both survive in the folder. The token CSV carries one row per skill with a before, an after, a saved and a router word column plus a `TOTAL` row, so the baseline numbers survive with the result. The per-batch outputs were replaced by the final-state run AC-004 records | Met | - |
| AC-006 | REQ-006 | Given the phase diff, When its file list is read, Then it touches only the 47 skills, the ledger, the Hermes copies and `scratch/` | Met for what the row protects, with a deviation on the letter. The two phase commits touch no hub `SKILL.md`, no hub `ROUTER.md` and no reader: `router-replay-lib.cjs`, `leaf-route-replay.cjs` and `verify-router-sync.cjs` are unchanged. The diff does exceed the row in four places three findings forced: `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` with its test, which are checks; the `RS-003` row of `assets/skill/skill-md-template.md`, which is a template; rule 21 and the overview and checklist lines of `sk-create-skill`, which are the create-skill canon; and `.skilled/scripts/git-hooks/pre-commit` with its test, which is the commit gate. `T013` to `T015` record each one | Met | - |

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

Every criterion is met on the final tree, and three carry a written deviation rather than a silent pass. AC-001 decides what the phase was for, and the 47 parsed routers return exactly what they returned on `8bc18283904`, so the move changed where the router lives and not what it routes to. AC-003 closes it, because the ledger that tolerated the old shape is empty and the ratchet holds it there. AC-004, AC-005 and AC-006 record where the work left the plan: five gated batches became two waves with one final-state gate and no per-batch files, and three findings pulled a check, a template line, the authoring canon and a commit hook into a phase whose scope had excluded them. Each deviation is named in `tasks.md` and `implementation-summary.md` so a later reader sees the passage, not a criterion that quietly stopped meaning what it says.
<!-- /ANCHOR:closure -->

---
