---
title: "Implementation Summary"
description: "The phase is planned and not started. It will move the machine router of 41 mode packets and six standalone skills into sibling ROUTER.md files in five batches, and empty the routing-shape debt ledger."
trigger_phrases:
  - "packet and standalone migration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration"
    last_updated_at: "2026-10-29T07:52:44Z"
    last_updated_by: "claude-opus"
    recent_action: "Wrote the phase plan and no work has started"
    next_safe_action: "Run Phase 1 setup once phases 002 to 004 have landed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-packet-and-standalone-migration |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is planned and has not started, so the tree still carries the 47 inline machine routers the phase exists to move.

### Phase 5: packet-and-standalone-migration

When the phase runs, each of the 41 mode packets and the six standalone skills moves its final MACHINE ROUTER section into a sibling `ROUTER.md`, and its `SKILL.md` keeps short SMART ROUTING prose with one pointer line. The debt ledger loses one entry per move, so a skill is tolerated only while it has not moved. Five batches run in this order, each with its own gate and its own commit.

### Planned Files

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-*/SKILL.md`, `ROUTER.md` (14 pairs) | Modify/Create | Batch 1 |
| `.skilled/skills/mcp-tooling/mcp-*/SKILL.md`, `ROUTER.md` (8 pairs) | Modify/Create | Batch 2 |
| `.skilled/skills/cli-external-orchestration/cli-*/SKILL.md`, `ROUTER.md` (7 pairs) | Modify/Create | Batch 3 |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md`, `ROUTER.md` | Modify/Create | Batch 3 |
| `.skilled/skills/sk-code/sk-code-*/SKILL.md`, `ROUTER.md` (4 pairs) | Modify/Create | Batch 4 |
| `.skilled/skills/sk-design/sk-design-*/SKILL.md`, `ROUTER.md` (4 pairs) | Modify/Create | Batch 4 |
| `.skilled/skills/system-deep-loop/deep-*/SKILL.md`, `ROUTER.md` (3 pairs) | Modify/Create | Batch 4 |
| `.skilled/skills/cli-orca/SKILL.md`, `.skilled/skills/mcp-code-mode/SKILL.md`, `.skilled/skills/sk-git/SKILL.md`, `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md` and one `ROUTER.md` beside each (6 pairs) | Modify/Create | Batch 5 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` | Modify | 47 entries removed as the skills move |
| `.hermes/skills/*/SKILL.md`, `.hermes/skills/*/ROUTER.md` | Modify/Create | Generated copies of the changed files |
| `scratch/batch-00.txt`, `scratch/router-replay-baseline.txt`, `scratch/router-token-baseline.csv`, `scratch/batch-01.txt` to `scratch/batch-05.txt` | Create | Baseline and batch evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The planned order follows the batched move in research section 8 and the task order in `tasks.md`: setup pins the baseline and the five token sums, batches 1 to 5 move the files and shrink the ledger, and verification reruns the strict checks, the replay, the drift scan, the Hermes check and this packet's own validator on the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move `sk-doc`'s 14 packets first | It is the largest group, and its hub `ROUTER.md` is the reference shape, so a problem in the pattern shows up once instead of 47 times |
| Leave the three standalone skills with the largest routers until last | `system-skill-advisor` (2,068 router words), `system-spec-kit` (1,619) and `sk-prompt` (1,050) carry the most content, so they move once the shape is settled |
| Put the pointer sentence in every moved file | Research section 5 found that no runtime loads a sibling file on its own, so the one line is what makes the router reachable at all |
| Move the file before deleting the ledger entry | The entry is the only tolerance the skill has between the phase 003 rule change and the move, so removing it first would reopen the old shape with no gate on it |
| Count tokens from the moved heading | A frontmatter block in `ROUTER.md` then cannot move the number, and the batch figure stays comparable with the CSV |
| One commit per batch | A bad batch reverts alone, and the four good ones stay |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline, 54 headings and 7 `ROUTER.md` files | Not run |
| 47 skills without a sibling router | Not run |
| Five batch gates, `scratch/batch-01.txt` to `scratch/batch-05.txt` | Not run |
| Final heading count 0 and `ROUTER.md` count 54 | Not run |
| Ledger count 0 and ratchet pass 4 fail 0 | Not run |
| Replay totals against `scratch/router-replay-baseline.txt` | Not run |
| `validate.sh --strict` on this packet | Not run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The token figures use an O200K proxy.** The authoritative tokenizer for gpt-6-luna is UNKNOWN, so this phase counts with installed tiktoken `o200k_base`, which reproduces the 89,931 research total exactly. Phase 006 recaptures the token table with the authoritative tokenizer.
2. **The move depends on phase 003 reading the markers from the sibling file.** A simulated move today returns `SMART ROUTING section missing smart-router marker(s)` for all three markers, which `--strict` treats as an error. If phase 003 does not move that check, every batch stops at its first file.
3. **The packet map and the hub root map may both list a packet's leaves.** Phase 004 decides whether the hub keeps those rows. Either way the two must agree, and the duplicate leg and the replay are what prove it.
4. **The 3,000-word advisory warning stays.** `system-spec-kit` drops from 5,000 words to about 3,381 after the move, which is under the hard limit and still over the recommended one. The warning is advisory and not promoted by `--strict`.
<!-- /ANCHOR:limitations -->

---
