---
title: "Implementation Plan: Phase 5: packet-and-standalone-migration"
description: "Move the machine router of 41 mode packets and six standalone skills into a sibling ROUTER.md in five batches behind a debt ledger, and keep the router file count, duplicate assignments, dead-resource paths, replay output and token count at their baseline after each batch."
trigger_phrases:
  - "packet and standalone migration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: packet-and-standalone-migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3.9, Node.js |
| **Framework** | None |
| **Storage** | `routing-shape-known-debt.json` |
| **Testing** | pytest, `node --test`, the spec validator, tiktoken `o200k_base` |

### Overview

Each batch moves one skill's final MACHINE ROUTER section out of `SKILL.md` into a sibling `ROUTER.md`, replaces the closing line with the pointer sentence, and deletes the skill's ledger entry. The gate then reads the new file through the phase 002 resolver and the phase 003 checks, which is what proves the move kept the route. The five batch figures are pinned to the token table in the research, so a batch that loses or duplicates content shows up as a count that no longer matches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The seven-leg batch gate passes for all five batches and every `scratch/batch-NN.txt` is kept
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Batched file move behind a ledger.

### Key Components

- **The 47 `SKILL.md` files**: keep short SMART ROUTING prose and the pointer line, and lose the final section.
- **The 47 `ROUTER.md` files**: hold the moved section, which is the skill's only skill-local map after the move.
- **`routing-shape-known-debt.json`**: lists the skills that have not moved, shrinks by one entry per skill and ends empty.
- **The batch gate**: seven legs that read the new files through the phase 002 resolver and the phase 003 checks.

### Data Flow

A batch reads `SKILL.md`, copies the section from its heading to end of file into `ROUTER.md`, rewrites the section's closing line in `SKILL.md` and deletes the ledger entry. The gate then walks the batch's skills through replay, the leaf manifest and the dead-route scan. A mismatch stops the batch before the next one starts, and the ledger entry stays in place until the file is correct.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup pins the baseline and confirms the phase 003 gate rejects a moved file. Implementation runs five batches and empties the ledger. Verification reruns every check on the final tree and validates this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### The five batches

| Batch | Skills | Files | Router words | O200K tokens | `ROUTER.md` after | Ledger after |
|-------|--------|-------|--------------|--------------|-------------------|--------------|
| 1 | `sk-doc` mode packets | 14 | 6,970 | 14,490 | 21 | 33 |
| 2 | `mcp-tooling` mode packets | 8 | 9,059 | 21,034 | 29 | 25 |
| 3 | CLI mode packets under `cli-external-orchestration` and `cli-classifier` | 8 | 5,153 | 12,351 | 37 | 17 |
| 4 | `sk-code`, `sk-design` and `system-deep-loop` mode packets | 11 | 7,196 | 18,503 | 48 | 6 |
| 5 | Standalone skills: `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `system-spec-kit` | 6 | 6,884 | 16,061 | 54 | 0 |
| **Total** | | **47** | **35,262** | **82,439** | **54** | **0** |

The gross figure is 82,439 tokens. One 23-token pointer per skill leaves 81,358 tokens out of the initial skill load, before a task reads a router. The word and token columns come from the per-skill table the research records in `../001-deep-research/research/lineages/luna/token-savings.csv`.

### The seven-leg batch gate

The five checks research section 8 asks for after each batch are the router file count, duplicate assignments, dead-resource paths, replay output and the token count. This phase adds a shape leg, because `--strict` is what fails a half-moved file, and a Hermes leg, because that view copies only `SKILL.md` and would otherwise hide the new router.

In the table, `S` is a moved skill's folder and `H` is its hub's folder. For the standalone batch, `H` is the skill itself and `parent-skill-check.cjs` runs with no argument to cover all hubs.

| Leg | Command | Expected |
|-----|---------|----------|
| 1. Router file count | `find .skilled/skills -name ROUTER.md -not -path "*/node_modules/*" \| awk 'END{print NR}'` | The cumulative count from the batch table |
| 2. Shape | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/H` and `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/S --check --strict` | `12b-routing-shape: ... (0 known debt)`, `OK: parent-skill-check`, `Result: PASS` |
| 3. Duplicate assignments | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/H` and the same `parent-skill-check.cjs` run | `leaf-manifest.json OK` and `PASS: 10c-target-collision: no duplicate composite keys` |
| 4. Dead-resource paths | `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` | `[alignment-drift] PASS` and `Findings: 0` |
| 5. Replay output | `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | The same seven `hub=` lines as `scratch/router-replay-baseline.txt`, ending `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` |
| 6. Token count | The `o200k_base` command below, over the batch's `ROUTER.md` files | The batch figure from the batch table |
| 7. Hermes copies | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` then `--check` | `PASS: 65 Hermes skill copies in sync` |

The token leg counts from the moved heading, so a frontmatter block in `ROUTER.md` does not move the number:

```text
python3 -c "import re,sys,pathlib,tiktoken
e=tiktoken.get_encoding('o200k_base'); total=0
for p in map(pathlib.Path,sys.argv[1:]):
    t=p.read_text(); m=list(re.finditer(r'^##\s+(?:[0-9]+\.\s*)?MACHINE ROUTER\s*$',t,re.M))[-1]; total+=len(e.encode(t[m.start():]))
print(total)" <ROUTER.md files>
```

Batch 4 also runs `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, which prints `router-sync: 5/5 checks passed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 shared resolver and Hermes generator | Internal | Pending | Replay, the dead-route scan and the Hermes view cannot read `ROUTER.md` |
| Phase 003 canon, marker check, widened gate and populated ledger | Internal | Pending | Every moved file fails `--strict` on RS-005 and on the three missing markers |
| Phase 004 finished hub move | Internal | Pending | The hub sections would still load, and the final count would not reach 0 of 54 |
| `tiktoken` 0.11.0 with `o200k_base` | External | Installed | The token leg falls back to `wc -w` and the batch figure is a word count |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a batch's replay line moves from the baseline, the dead-route scan reports a finding, or a moved file fails `--strict` after the batch.
- **Procedure**: revert the batch commit, restore the ledger entries for that batch from the batch diff, and rerun the seven-leg gate on the restored tree. Each batch is a separate commit so one bad batch never carries the four good ones back with it.
<!-- /ANCHOR:rollback -->

---
