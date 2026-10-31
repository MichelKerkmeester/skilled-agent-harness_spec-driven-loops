---
title: "Feature Specification: Phase 5: packet-and-standalone-migration"
description: "Forty-one mode packets and six standalone skills still carry their machine router inside SKILL.md, 35,262 words and 82,439 O200K tokens across the 47. This phase moves each section into a sibling ROUTER.md in five batches, removes one debt ledger entry per move, and keeps every routing check and the replay figure at their baseline."
trigger_phrases:
  - "packet and standalone migration"
  - "phase 5 packet and standalone migration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: packet-and-standalone-migration

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-hub-router-merge |
| **Successor** | 006-regeneration-and-verification |
| **Handoff Criteria** | All 47 skills carry a sibling `ROUTER.md`, the debt ledger is empty, and `package_skill.py --strict` and `parent-skill-check.cjs` pass on the final tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Skill router files specification.

**Scope Boundary**: the 41 mode packets, the six standalone skills, the sibling `ROUTER.md` each one gains, the debt ledger, the Hermes copies that follow the changed files and the batch evidence in `scratch/`.

**Dependencies**:
- Phase 002's shared router-file resolver, its Hermes generator change and its advisor freshness probe.
- Phase 003's reversed RS-004, rewritten RS-005, marker check that reads a sibling file, widened root-router gate and populated debt ledger.
- Phase 004's finished hub move, so the seven hubs no longer carry the section.

**Deliverables**:
- 47 sibling `ROUTER.md` files and 47 shortened `SKILL.md` files.
- An empty `routing-shape-known-debt.json`.
- Five batch evidence files under `scratch/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phase 004, 47 of the 54 skills still carry their machine router inside `SKILL.md`: 41 mode packets and the six standalone skills. The research counts 39,159 router words and about 89,900 O200K tokens across all 54 sections in `../001-deep-research/research/research.md` section 1, and its per-skill table pins the exact total at 89,931. Subtracting the seven hubs leaves 35,262 words and 82,439 tokens for the 47. Each one loads whenever its skill loads. `system-spec-kit` sits on the 5,000-word hard limit in `package_skill.py`, with `sk-design-md-generator` at 4,998 words and `mcp-mobbin` at 4,982, so none of the three can take another rule until its router moves.

The move is blocked in three places until phases 002 and 003 land. `validate_routing_shape` reports RS-005 on a `SKILL.md` with no final MACHINE ROUTER section. `validate_smart_router` reports the three router markers missing once the pseudocode leaves the file, which `--strict` promotes to an error. The routing-shape ledger records a skill's old shape, not a skill that has not moved yet. All 47 files pass `--strict` today, so the tree starts green and every batch has to keep it green.

### Purpose

Every one of the 47 skills keeps its machine router in a sibling `ROUTER.md`, each `SKILL.md` keeps short prose plus one pointer line, and the debt ledger empties as the batches land.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run on the current tree, before phase 004 moves the hubs:

```text
$ rg -l '^##\s+([0-9]+\.\s*)?MACHINE ROUTER\s*$' .skilled/skills --glob 'SKILL.md' | awk 'END{print NR}'
54
$ find .skilled/skills -name ROUTER.md -not -path "*/node_modules/*" | awk 'END{print NR}'
7
$ find .skilled/skills -name SKILL.md -not -path "*/node_modules/*" | while read -r f; do d=$(dirname "$f"); [ -f "$d/ROUTER.md" ] || echo "$d"; done | awk 'END{print NR}'
47
$ python3 -c "import json;print(len(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json'))['debt']))"
0
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep '^total'
total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the MACHINE ROUTER section of the 41 mode packets into a sibling `ROUTER.md`, in four hub-grouped batches, which is the batched move research section 8 sets out.
- Move the same section of the six standalone skills into a sibling `ROUTER.md`, as the fifth batch.
- Replace each moved file's closing router line with the pointer sentence research section 6 proposes, which names `./ROUTER.md`.
- Remove one ledger entry per moved skill and prove the live ledger empty after the last batch.
- Run the seven-leg batch gate after each batch and record its output under `scratch/`.
- Regenerate the Hermes copies that follow each changed `SKILL.md` and `ROUTER.md`.

### Out of Scope
- Changing what any skill routes to. The moved maps stay byte for byte, which the replay line and the dead-route scan prove.
- The seven hub `SKILL.md` files and their root `ROUTER.md`, which phase 004 owns.
- The router readers, the routing-shape checks, the templates and the `/create:skill` workflows, which phases 002 and 003 own.
- The advisor baseline recapture, the derived-file regeneration and the final token table, which phase 006 owns.
- Rule content inside the 47 skills beyond the router move.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-*/SKILL.md` (14 files) and one `ROUTER.md` per folder | Modify/Create | Batch 1, the `sk-doc` mode packets |
| `.skilled/skills/mcp-tooling/mcp-*/SKILL.md` (8 files) and one `ROUTER.md` per folder | Modify/Create | Batch 2, the `mcp-tooling` mode packets |
| `.skilled/skills/cli-external-orchestration/cli-*/SKILL.md` (7 files), `.skilled/skills/cli-classifier/cli-jev/SKILL.md` and one `ROUTER.md` per folder | Modify/Create | Batch 3, the CLI mode packets |
| `.skilled/skills/sk-code/sk-code-*/SKILL.md` (4 files) | Modify/Create | Batch 4, the `sk-code` mode packets |
| `.skilled/skills/sk-design/sk-design-*/SKILL.md` (4 files) | Modify/Create | Batch 4, the `sk-design` mode packets |
| `.skilled/skills/system-deep-loop/deep-*/SKILL.md` (3 files) | Modify/Create | Batch 4, the `system-deep-loop` mode packets |
| `.skilled/skills/cli-orca/SKILL.md`, `.skilled/skills/mcp-code-mode/SKILL.md`, `.skilled/skills/sk-git/SKILL.md`, `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md` and one `ROUTER.md` beside each | Modify/Create | Batch 5, the standalone skills |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` | Modify | One entry removed per moved skill |
| `.hermes/skills/*/SKILL.md` and `.hermes/skills/*/ROUTER.md` | Modify/Create | Generated copies of the changed files |
| `scratch/batch-00.txt`, `scratch/router-replay-baseline.txt`, `scratch/router-token-baseline.csv`, `scratch/batch-01.txt` to `scratch/batch-05.txt` | Create | Baseline and per-batch evidence |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the 47 skills carries a sibling `ROUTER.md` whose body is the section removed from its `SKILL.md`, with `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` unchanged, because scripts read that literal grammar (research section 6) | AC-001 |
| REQ-002 | Each moved `SKILL.md` keeps a SMART ROUTING section of at most 12 lines and 180 words, and its closing router line reads `Read ./ROUTER.md before selecting skill-local resources; open only the matched files.` | AC-002 |
| REQ-003 | The ledger loses a skill's entry in the same batch that moves the skill, and the live ledger holds 0 entries after batch 5 | AC-003 |
| REQ-004 | The batch gate passes after each of the five batches, on the numbers the batch table in `plan.md` records | AC-004 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each batch writes its gate output to `scratch/batch-NN.txt`, and setup writes the replay baseline and the token baseline | AC-005 |
| REQ-006 | No hub `SKILL.md`, hub `ROUTER.md`, reader, check, template or `/create:skill` workflow changes in this phase | AC-006 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 of the 54 `SKILL.md` files carry a final MACHINE ROUTER heading, and 54 `ROUTER.md` files exist, one per skill.
- **SC-002**: The live ledger prints 0 debt entries and the ratchet test still passes 4 of 4.
- **SC-003**: The replay totals match the baseline: `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`.
- **SC-004**: Every `package_skill.py --check --strict` run prints `Result: PASS`, and `parent-skill-check.cjs` prints `OK` with 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase 002 resolver and Hermes generator | Replay, the dead-route scan and `.hermes/skills` cannot see a sibling `ROUTER.md` | Run the batch gate through the new entry points and stop the batch when Hermes reports a missing copy |
| Dependency | The phase 003 marker check | `--strict` fails every moved skill with `SMART ROUTING section missing smart-router marker(s)`, observed on a simulated `sk-git` move | 003 reads the three markers from the sibling file before batch 1 starts |
| Risk | The packet map and the hub root map disagree | One leaf resolves to two intents or two workflow modes | Move the map verbatim and run the leaf manifest check and the replay after each batch |
| Risk | The ledger entry is removed before the file lands | The old shape returns with no gate covering it | Move the file first, delete the entry second, run the gate third |
| Risk | The token count drifts from the recorded baseline | The saving is overstated or the moved content was trimmed | Count each batch with the pinned `o200k_base` command and compare with the batch figure |
| Risk | A batch cuts a fenced block in half | A pseudocode block loses its closing fence and the moved file misparses | The shape leg reads the new file through `package_skill.py --strict` before the ledger entry is deleted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does phase 004 keep the packet-qualified leaves in the hub root `ROUTER.md` once every packet owns a map? If it does, the two maps must agree, and the duplicate leg covers it. If it drops them, the packet file is the only map.
- Which tokenizer is authoritative for gpt-6-luna? UNKNOWN. This phase counts with installed tiktoken `o200k_base`, which reproduces the 89,931 CSV total exactly, and phase 006 recaptures with the authoritative tokenizer.
- Does a packet `ROUTER.md` carry frontmatter? Phase 003's template decides, and the token command counts from the moved heading, so both shapes count the same.
<!-- /ANCHOR:questions -->

---
