---
title: "Implementation Summary: Phase 7: sk-design and system-deep-loop hubs"
description: "Both hubs and all seven packets now open with a short routing statement and keep their machine detail in a final MACHINE ROUTER, the nine ledger entries are gone, and the sk-design mode table moved up into When to Use so the mode-command check reads the row that carries the command."
trigger_phrases:
  - "sk-design and system-deep-loop hubs implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/007-sk-design-and-deep-loop-hubs"
    last_updated_at: "2026-10-28T14:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved both hubs and all seven packets to the routing canon and fixed every review finding"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the phase have to rename the no-match outcome in either hub? No. Both hubs and all seven packets already carried UNKNOWN_FALLBACK only, so the vocabulary requirement was met at the baseline and the phase kept the name as it stood."
      - "Did the sk-design mode table belong in the machine router with the rest of the routing detail? No. The mode-command check reads the first table row whose first cell is a mode id, and How It Works also names each packet folder in its first cell, so the table has to sit above that section. It moved up into When to Use."
      - "What happened to the replay row where both research and review score? Nothing. The live compiled route sends it to research, as the playbook expects, and the tie exists only in the replay's stage-two keyword arm. Recorded, not a defect."
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 7: sk-design and system-deep-loop hubs

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-design-and-deep-loop-hubs |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every sk-design and system-deep-loop document now opens with a short routing statement and keeps its machine detail in a final `MACHINE ROUTER` section. The nine entries these two hubs held in the routing-shape ledger are gone, and the sk-design mode table now sits in When to Use, where a reader meets it first.

### The shape, per file

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. Before is the ledger's recorded count, after is the same rule measured on the final file.

| File | SMART ROUTING (lines / words) | Machine router | Section after SMART ROUTING |
|------|-------------------------------|----------------|------------------------------|
| `.skilled/skills/sk-design/SKILL.md` | 88 / 901 → 12 / 148 | `## 6. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 66 |
| `sk-design-fundamentals/SKILL.md` | 164 / 902 → 8 / 145 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 72 |
| `sk-design-md-generator/SKILL.md` | 145 / 1183 → 5 / 71 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 63 |
| `sk-design-chart/SKILL.md` | 44 / 297 → 5 / 102 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 70 |
| `sk-design-diagram/SKILL.md` | 81 / 617 → 7 / 134 | `## 7. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 62 |
| `.skilled/skills/system-deep-loop/SKILL.md` | 38 / 974 → 10 / 159 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 51 |
| `deep-research/SKILL.md` | 157 / 842 → 6 / 120 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 83 |
| `deep-review/SKILL.md` | 163 / 723 → 8 / 134 | `## 8. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 96 |
| `deep-ai-council/SKILL.md` | 168 / 911 → 9 / 97 | `## 9. MACHINE ROUTER`, last | `## 4. HOW IT WORKS` at 103 |

Every SMART ROUTING section is inside the 12-line and 180-word limits. `MACHINE ROUTER` is the last H2 in all nine files and is numbered contiguously with its file, so no other H2 had to move.

The moved blocks are unchanged. Every machine line, matched by the canon's own regex over `INTENT_SIGNALS`, `RESOURCE_MAP`, `UNKNOWN_FALLBACK_CHECKLIST`, `def discover_markdown_resources` and `def _guard_in_skill`, is byte-identical to `HEAD` in all nine files, and the read-only review of the same diff found the same for every fenced block. The two hubs' `route()` pseudocode moved with them.

### The mode table, moved up

The sk-design mode table lived in §2 SMART ROUTING. It now opens §1 WHEN TO USE, at line 26.

The move is forced by the mode-command check. Check 6c takes `rows.find((r) => firstCellId(r) === mode.workflowMode)`, which is the first table row whose first cell is a mode id, and requires that row to show the mode's registered command. `## 3. HOW IT WORKS` also names every packet folder in a first cell, in its Layout table, and that table has no command column. A mode table placed anywhere below §3 would be read against the Layout row. §1 is above it, and it is where a reader meets the modes first anyway.

### The no-match name

Nothing had to change. A scan of the nine files for `UNKNOWN_*`, `NO_MATCH*` and `FALLBACK_*` finds `UNKNOWN_FALLBACK` and `UNKNOWN_FALLBACK_CHECKLIST` only, at the baseline and at the end, so both hubs already used the one name phase 003 picked. `scratch/before.md` §4 records the baseline reading.

### Ledger, mirrors and carriers

The nine entries came off `routing-shape-known-debt.json` (80 lines removed, none added), so `parent-skill-check` 12b passes with an empty ledger for both hubs: `hub and 4 packet(s) follow the routing canon (0 known debt)` on sk-design and `hub and 3 packet(s)` on system-deep-loop. The ledger drops from 35 entries to 26.

The two compiled-route manifests were refreshed and copied over the archived activation copies that `compiled-route-sync` compares. The nine `.hermes` mirrors were regenerated, and the check reports 67 copies in sync. The three deep-loop command contracts were recompiled after the hub `SKILL.md` changed, three digest lines each, and the drift check reads `OK commands=3`. `skill-graph.json` was regenerated, and the new freshness gate finds no stale, zombie, ghost or signal-drift row.

### Pointers repointed

33 support files named a section a reader should turn to for routing detail, and the ones that named a moved section now name its new number. `sk-design/SKILL.md:121-124` calls §6 the callout and the fallback, `sk-design-fundamentals/SKILL.md:257` and `:314` name Section 9 as the routing authority, `system-deep-loop/README.md:119` names §9 MACHINE ROUTER, the md-generator `SKILL.md` and its three playbook anchors name §9, the diagram playbook names the MACHINE ROUTER section, and the deep-research and deep-review playbooks name §9 and §8. Two pointers were rewritten rather than renumbered: `references/build-procedure.md:92` now names `hierarchy.md` for the hierarchy method, and `references/hierarchy.md:17` now says `SKILL.md` names its four rules and the reference carries the method.

### Changelogs and versions

One patch step for each of the nine files, and each step is a third-segment bump: sk-design 2.0.7.0 → 2.0.8.0, sk-design-fundamentals 1.0.1.0 → 1.0.2.0, sk-design-md-generator 1.1.7.0 → 1.1.8.0, sk-design-chart 0.23.2.0 → 0.23.3.0, sk-design-diagram 1.2.6.0 → 1.2.7.0, system-deep-loop 1.6.17.0 → 1.6.18.0, deep-research 1.15.8.0 → 1.15.9.0, deep-review 1.11.10.0 → 1.11.11.0, deep-ai-council 1.8.5.0 → 1.8.6.0. Nine new changelog files, and the hubs' `description.json`, `hub-router.json` and `mode-registry.json` carry the same versions, which is what check 13a reads.

deep-review was renumbered. Its first entry stepped the fourth segment, which no sibling did, so it became 1.11.11.0 and its changelog and frontmatter now match the third-segment convention the other eight follow.

### Fundamentals, cut down to fit

The canon shape alone pushed `sk-design-fundamentals/SKILL.md` past the 5,000-word hard cap in `package_skill.py` (`MAX_SKILL_MD_WORDS = 5000`, a `return False` when exceeded). The body now points instead of repeating: hierarchy's four rules and the always-true-core table are one-line pointers into `references/hierarchy.md` Sections 2 to 7 and into the six references' own sections, and the palette build order is a pointer into `references/color-system.md` Section 3. `wc -w` gives 4,975 before and 4,880 after, 95 words fewer. The review checked every removed fact against the reference it now names, sentence by sentence, and found each one there.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran in two dispatches. The first dispatched Devin workers to restructure the nine files. They completed part of the work and stopped on the provider's weekly usage limit, so the tree was half-changed when the second dispatch picked it up. The resume brief it carried told the next worker to diff every file against `HEAD` first, keep what was correct, finish what was missing and fix anything half-done, with every machine line still matching `HEAD` byte for byte. The second dispatch ran on `cli-pi` with DeepSeek V4.1 Flash through LLMGATEWAY, which is the model and provider this session reports (`PI_MODEL=deepseek-v4.1-flash-1017`, `PI_PROVIDER=llmgateway`).

The restructure was proven before the gates ran. Each mover slices the existing SMART ROUTING body and the machine blocks by line range and asserts the boundaries it expects before it cuts. Each was followed by a verifier that compared the moved block against the copy of `HEAD` saved before the edit, or against `git show HEAD:<path>` where no copy was kept. The gates then ran as one set: `scratch/gates.sh` runs 39 gates and prints one line per gate, and `scratch/before.md` and `scratch/after.md` record the two runs.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:review -->
## Review Fixes

A read-only review of the uncommitted diff returned no P0, one P1 and six P2 findings (`report.md` ends `FINDINGS: P0=0 P1=1 P2=6`). All seven are fixed in the working tree.

| Finding | Fix |
|---------|-----|
| P1-1 The md-generator packet named a hub signal that does not exist | `hub-router.json` declares `routerSignals` keys `sk-design-fundamentals`, `sk-design-md-generator`, `sk-design-diagram` and `sk-design-chart`. The packet said `md-generator`. It now says `sk-design-md-generator` (`SKILL.md:55`). |
| P2-2 The sk-design hub lost its stage-separation invariant | Restored as one sentence in §2: the hub never emits leaf paths, and the surface router never re-decides the mode. The section is 12 lines and 148 words, inside the canon. |
| P2-3 The deep-loop hub said every packet carries a `Keyword triggers:` line, and two do not | `deep-review` and `deep-ai-council` carry an H3 bullet list instead, which the vocabulary check never parses. The sentence now reads "each packet's `Keyword triggers:` line where one exists". Adding the literal line to two packets was the preferred fix and would have closed an unchecked leg. It was not taken here, and the wording now says what the gate actually reads. |
| P2-4 The sk-design changelog miscounted its own section and misplaced the mode table | The entry names the mode table as moving up into When to Use rather than into the machine router. Its line count now reads twelve in the description and in the body, which is the measured count once the stage-separation sentence went in. |
| P2-5 The fundamentals changelog's before-count came from a scratch copy | The entry said 5,151 words, which was an intermediate candidate. It now reads 4,975 to 4,880, the released file against the final one. |
| P2-6 The fundamentals README still said `SKILL.md` holds the hierarchy technique | Line 39 now says `SKILL.md` holds the scales, the procedure and the four rules, that `references/hierarchy.md` carries the full method, and it lists seven references rather than six. |
| P2-7 An unrelated tracked binary was modified | `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` is the derived dev-only council cache, and the gate run had touched it. It is restored to `HEAD` and no longer appears in `git status`. |

<!-- /ANCHOR:review -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The mode table moved into When to Use rather than into the machine router | Check 6c reads the first table row whose first cell is a mode id and requires it to show the registered command. How It Works names every packet folder in its first cell with no command column, so a table below that section would be read against the wrong row. §1 is above it and is the right place for a reader to meet the modes. |
| No no-match rename was made | Both hubs and all seven packets already carried `UNKNOWN_FALLBACK`, so the requirement was met before the phase touched anything. Renaming would have been churn with a real chance of splitting the name again. |
| The fundamentals body points instead of repeating | The canon shape took the file past the 5,000-word hard cap that `package_skill.py` enforces. Cutting the duplicated method into its reference was the option that keeps every fact and drops no instruction. |
| Every changed `SKILL.md` steps the third version segment | The change is routing shape and prose only, no route, resource or rule changed, and the nine files keep one convention so the next reader can tell what a bump means. |
| The deep-loop `Keyword triggers:` sentence was reworded, not the two packets extended | Adding the line to two packets would have closed an unchecked leg, and it changes what a packet advertises to the vocabulary source, which is a vocabulary change rather than a shape one. The wording was corrected to describe the gate. |
| The replay's two-intent row is recorded, not fixed | The live route is correct and the playbook's expectation is met. The replay's keyword arm does not model the mode-hint rule, and changing it would change a baseline that this phase did not touch. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** `routing-shape-known-debt.json`; `skill-graph.json`; both hubs' `description.json`, `hub-router.json` and `mode-registry.json`; 33 support docs and READMEs; the two compiled-route manifests and their two archived copies; the nine `.hermes` mirrors; the three deep-loop compiled contracts; nine changelogs.
2. **The phase was delivered in two dispatches.** The first, on Devin, stopped part-way on a weekly usage limit. The second resumed on `cli-pi` with DeepSeek V4.1 Flash through LLMGATEWAY. Both are recorded above.
3. **The md-generator signal sentence was fixed here rather than in a vocabulary phase.** A packet naming a signal that does not exist is a wrong instruction to the reader and a one-word fix, so it was corrected in place. The two deep-loop packets that advertise keywords the gate never reads were left as they are, which is the other half of the same finding.
4. **`catalog-packages` is green here.** Unlike the previous phase, this worktree carries the sk-code leaf description fix from main, so the gate is 0 in both runs and no explanation is needed.

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 39 gates | 39 of 39 exit 0 |
| `parent-skill-check` 12b with an empty ledger | `hub and 4 packet(s) follow the routing canon (0 known debt)` and `hub and 3 packet(s) ...`, exit 0 both hubs |
| `package_skill.py --check --strict`, nine files | `Result: PASS` on all nine, one word-count advisory on the fundamentals file |
| `routing-shape-known-debt-ratchet.test.cjs` | 4 of 4 pass |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| `compiled-route-sync.cjs --check` | 55 of 55 served copies match |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `check-contract-drift.cjs` | `OK commands=3` |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| Live route, seven prompts | Same target on all seven as `main`, per the review's side-by-side run, exit 0 each |
| `validate.sh --recursive --strict` | `RESULT: PASSED` |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The word count differs by one between two counting rules.** `wc -w` gives 4,880 for `sk-design-fundamentals/SKILL.md` and `package_skill.py` counts 4,879 by its own rule. The changelog quotes the `wc -w` pair, 4,975 to 4,880. Either rule leaves the file inside the 5,000-word cap.
2. **Two deep-loop packets still advertise keywords the vocabulary check does not read.** `deep-review` and `deep-ai-council` carry `### Keyword Triggers` bullet lists where the check matches the literal `Keyword triggers:` prefix, so the gate reads `triggers=0` for that hub, as it did at the baseline. Fixing it means changing what two packets advertise, which belongs to a vocabulary phase.
3. **The replay's mode-hint row keeps two intents.** Recorded in `scratch/after.md` §8. The live route resolves it correctly.
4. **The packet's scratch files are untracked.** `scratch/before.md`, `scratch/gates.sh` and `scratch/after.md` land with these docs, and `scratch/before.md` is the one the review noticed would be swept in by a broad add.
<!-- /ANCHOR:limitations -->
