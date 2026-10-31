---
title: "Goal: Phase 5: packet-and-standalone-migration"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: packet-and-standalone-migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the machine router of the 41 mode packets and six standalone skills into a sibling `ROUTER.md` each, leaving each SKILL.md with short prose and one pointer line, and empty the debt ledger.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each moved router keeps the literal `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` grammar, because scripts read it. |
| D2 | A ledger entry is removed only after its skill's `ROUTER.md` has landed. |
| D3 | No hub `SKILL.md`, hub `ROUTER.md`, reader, check, template or create-skill workflow changes in this phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `find .skilled/skills -name ROUTER.md` lists 54 files, one beside each skill's `SKILL.md`.
- [ ] Each moved `SKILL.md` has a SMART ROUTING section of at most 12 lines and 180 words that ends with `Read ./ROUTER.md before selecting skill-local resources; open only the matched files.`
- [ ] `routing-shape-known-debt.json` holds 0 debt entries, and `routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4.
- [ ] Batch gate outputs `scratch/batch-01.txt` to `scratch/batch-05.txt` each report `Findings: 0`.
- [ ] `package_skill.py --check --strict` prints `Result: PASS` on the final tree, and `parent-skill-check.cjs` prints `OK` with 0 warnings.
- [ ] `git diff --name-only` for the phase names no hub file, reader, check, template or create-skill workflow.
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
| Move 47 skills (41 mode packets, six standalone skills) | Done per operator | Operator status: all 47 skills moved and verified identical in routing. Child acceptance criteria still read Unmet. |
| Stale references | Open | Operator status. |
| Contract rules for non-hub routers | Open | Operator status. |
| Versions and changelogs | Open | Operator status. |

### Deviations and findings

| Item | Note |
|------|------|
| Child status | The child spec reads Draft and its criteria read Unmet. The operator reports work in progress. This goal does not mark any criterion Met. |

### Closeout

This section supersedes the state rows above. The child packet now reads Complete.

| Item | State | Evidence |
|------|-------|----------|
| Move 47 skills (41 mode packets, six standalone skills) | Done | 47 sibling `ROUTER.md` files carry `router_state: active` and `skill_pointer: SKILL.md`, 0 MACHINE ROUTER headings are left in any `SKILL.md`, 54 routers sit in the tree, and `parseRouter` returns identical output for all 47 against `main` |
| Stale references | Done | A sweep found 627 candidate lines in 151 files that placed the router in `SKILL.md`; they were rewritten per packet, four canon lines were fixed by hand, 27 remaining hits were reviewed as correct, and the link check prints 0 broken |
| Contract rules for non-hub routers | Done | `NO_LOAD_INTENTS`, an own-root `ROOT_RESOURCES` probe and the `INTENT_SIGNALS`/`INTENT_MODEL` mirror rule, six new cases, and `OK: parent-skill-check` on all seven hubs |
| Versions and changelogs | Done | All 47 editions raised, `sk-create-skill` to 1.9.0.0 and `system-spec-kit` to 2.12.25.0, one changelog entry each reported with 0 issues |
| Debt ledgers | Done | Both ledgers hold 0 entries and the ratchet prints pass 4 fail 0 |
| Hook defect | Done | The doc-version raise now runs before the mirror-parity and re-mint gates, a hook case pins the order, and the hook suite prints 153 passed, 0 failed |
| Token result | Measured | `SKILL.md` text across the 47 fell from 160,204 to 125,932 words, 34,272 words or 21.4 percent, about 45,600 tokens |
| Child criteria | Met | All six rows read Met, three with a written deviation note, and the packet reads Status Complete with 100 percent completion |

Deviations carried by that closeout:

| Deviation | Note |
|-----------|------|
| Five gated batches | Ran as two waves of parallel workers, 20 skills then 27, so no `scratch/batch-NN.txt` exists and the final-state gate replaced the per-batch evidence |
| Token projection | The router text measures 84,640 `o200k_base` tokens where the batch table projected 82,439, so the saving is claimed from the measured word delta |
| Scope passage | A check, a template row, the create-skill canon and the commit hook changed, which the plan's scope excluded; the child tasks record the finding behind each one |
<!-- /ANCHOR:log -->
