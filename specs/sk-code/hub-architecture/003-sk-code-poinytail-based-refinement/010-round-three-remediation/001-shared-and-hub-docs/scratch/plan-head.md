---
title: "Implementation Plan: Phase 1: shared-and-hub-docs"
description: "Repoint every legacy path in the sk-code shared tier, keep one copy of the Webflow pattern assets, make each copied fact point to its owner, describe three surfaces in every owned doc and release the hub as 2.2.5.0, as 105 single-change dispatch units checked one by one."
trigger_phrases:
  - "shared and hub docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: shared-and-hub-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, three JSON descriptors, one Python-in-Markdown router block |
| **Framework** | sk-code parent hub with a root `ROUTER.md`, validated by the root-router contract and the router-sync guard |
| **Storage** | None |
| **Testing** | `verify_router_sync.cjs`, `check-rule-copies.js`, `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs`, `validate_document.py`, `hvr_scan.py`, and the two scratch checkers `check-links.cjs` and `check-unit.cjs` |

### Overview
The shared tier and the hub front pages drifted after the packet merge and the Obsidian surface landed. This plan rewrites only text: 97 single-span edits and one new changelog, three file deletions, one folder removal and three ripple commands, each a dispatch unit in `scratch/dispatch-units.json` with its own check. Every OLD text was proven to occur exactly once, in the order the units apply, by `scratch/gen_units.py`. A dry run of all units on a copy of the hub kept router-sync at 5/5, the rule-copy canary, `parent-skill-check.cjs` and the leaf manifest green, and left only the compiled manifest stale, which T116 re-mints.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-owner documentation repair: each fact gets one owning file, and every other file either states it once or points to the owner.

### Key Components
- **Shared references** (`.skilled/skills/sk-code/shared/references/`): eight files carried 24 legacy-family lines (`rg` count at plan time). Each legacy path becomes the real repo-root path inside the owning packet, written as a backticked `.skilled/skills/sk-code/...` path, the form `error-recovery.md` and the debugging checklist already used for cross-packet pointers, so `test -e` resolves it from the repository root.
- **Intra-shared links**: three forms existed (`references/x.md`, `./x.md` and the full `.skilled/skills/sk-code/shared/...` path). All become the shared README's form, a Markdown link whose label is the backticked file name and whose target starts with `./` or `../`, relative to the linking file.
- **Pattern assets**: `shared/assets/patterns/` held older copies of `validation-patterns.js` and `wait-patterns.js` (both `diff -q` pairs differ at plan time) plus a README routed under `IMPLEMENTATION` beside the Webflow README. The Webflow copies stay. The shared route (`ROUTER.md:382`), the shared-control entry (`ROUTER.md:595`), the three files and the two folders go, and the shared README section 6 points to the Webflow folder.
- **Shared controls** (`ROUTER.md:583-596`, `SKILL.md:63`): see Decision D2.
- **Load-tier prose** (`ROUTER.md:111`, `:604`, `:608`, `:616`, `:617`): the map's `DEFAULT_RESOURCE` emits stack detection, phase detection and `code-quality-standards.md` on every route, and the other three universal files only under `CODE_QUALITY`, `DEBUGGING` and `IMPLEMENTATION`. The replay (`router_replay_lib.cjs:585-627`) keeps any non-surface entry the matched intents map. The prose now says exactly that and does not change the map.
- **Canonical surface sentence**: a `**Surface list.**` paragraph after the hub `SKILL.md` surface table. The phase lifecycle and the hub README point to it.
- **Versioning**: hub release 2.2.4.0 to 2.2.5.0 (patch: docs and cleanup) in `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` and `README.md`, plus `changelog/v2.2.5.0.md` in the v2.2.4.0 entry's shape. Child docs keep their derived `version:` lines, per the frontmatter-versioning standard section 4.

### Data Flow
The builder applies units T014 to T115 in order, runs the check after each, then T116 re-mints the compiled manifest (the policy hash reads the hub `SKILL.md`, `hub-router.json` and `mode-registry.json`, which all change), T117 copies it to its archive. T116 to T118 are orchestrator-owned: the re-mint and copy run once after every child, and T118 regenerates the leaf manifest and then checks it, because this child's deletions and 005's new checker leaf both change the leaf set.

### Extra batches
Two batches were added after the main chain was planned, each in its own scratch unit file. Batch 1 (T146 to T161, verified by T162) fixes hits that 005's doc-claims checker found in hub files no other child owns: retired packet keys and the old Webflow checklist paths in six hub playbook scenarios, and the retired keys in the graph-metadata.json causal_summary. Their OLD texts were computed against the tree after the main chain ran. Batch 2 (T163 to T165, verified by T166) replaces the three OpenCode-only subsections in workflow-implement.md and workflow-verify.md with pointers to the OpenCode guardrails file, which 005 creates, so it runs after 005. The earlier units T039 edit inside the Verification Reality subsection, so batch 2 runs after the main chain. Batch 2 also carries T167, added after child 002 moved the review cache out of the repository: it rewrites the review mode's writeScopeNote in mode-registry.json to name the user cache path and drops "untracked", and T166 checks it.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Cross-packet pointers in shared docs use the backticked repo-root form `.skilled/skills/sk-code/<packet>/...`, and pointers within the shared tier use `./` or `../` Markdown links | Two pointer kinds, each with one form the scratch checker can resolve; the shared README already uses the link form for its own files |
| D2 | `SHARED_CONTROL_RESOURCES` stays the list of `shared/` paths that `RESOURCE_MAP` references, seven entries after the pattern README leaves. Its comment declares it plus `DEFAULT_RESOURCE` as the complete hub-level control set, and `SKILL.md:63` points there with no count | The root-router contract rejects a declared control that no `RESOURCE_MAP` entry references (`root-router-contract.cjs:613-648`), so `stack-detection.md` and `phase-detection.md` cannot join the list without changing the routing map |
| D3 | The hub README takes the hub release version, and the `SKILL.md` version-authority sentence names it | The README is a hub-root front page read beside `SKILL.md`, and `ROUTER.md` is the precedent for a hub-root doc carrying the release version instead of a derived child-doc version |
| D4 | The comment-density rule lives in a new `### Comment density` subsection inside `code-style-guide.md` section 4, whose heading `## 4. COMMENTING` keeps its text and number | The hooks and the ephemeral-pointer audit cite `code-style-guide.md §4`, and 004-webflow-and-obsidian and 005-opencode-and-guards link that section from their budget rows |
| D5 | The "OpenCode Surface Only" subsections stay where they are in this child | No OpenCode packet reference holds that content today, so moving it would mean writing a file 005 owns |
| D6 | `mode-registry.json`'s two-surface description, its review write-scope note's old `code-review` key (T103, asked for by 002-review-mode) and the hub `SKILL.md` `workflow_*.md` globs are fixed here although no listed finding names them. The cache path in that note, `.skilled/.code-review-cache/<repo-ref>.jsonl`, already matches `sk-code-review/SKILL.md:491` and `references/pr-state-dedup.md:41`, so it stays | Same files, same drift class, and the requirement that no owned file describes two surfaces would otherwise fail |
| D7 | The "across WEBFLOW and OPENCODE" sentences in the two universal checklists, `error-recovery.md`'s description and `code-quality-standards.md:16` stay | Those docs carry Webflow and OpenCode command sets only, so the sentence is accurate. Adding Obsidian rows would invent commands the Obsidian packet runs in another repository |

### Handoffs

| To | Item |
|----|------|
| 005-opencode-and-guards | Make `verify_router_sync.cjs` read `SHARED_CONTROL_RESOURCES` and `DEFAULT_RESOURCE` from `ROUTER.md` section 11 instead of `PARENT_TIER_ALLOWLIST`. After this child, the list's `shared/assets/patterns/README.md` entry is unused, and `sk-code-review/assets/code-quality-checklist.md` cannot move into the ROUTER list because the contract accepts only `shared/` paths, so the guard must keep that one entry its own way |
| 005-opencode-and-guards | Create an OpenCode reference holding the three "OpenCode Surface Only" subsections (`workflow-implement.md:78-84`, `workflow-verify.md:76-99`). A later change then turns the shared subsections into pointers |
| 005-opencode-and-guards | Label `naming-and-commenting.md:170` (three per ten lines) as the OpenCode setting and link `code-style-guide.md` section 4, and add the OBSIDIAN-versus-WEBFLOW collision case to the canary fixture |
| 004-webflow-and-obsidian | Label `cross-language-rules.md:47` and `javascript/quick-reference.md:68` (five per ten lines) as the Webflow setting and link `code-style-guide.md` section 4 |
| 003-quality-mode | The quality `SKILL.md` hook rows (the other half of f-iter012-001) use the live-hook wording T055 writes into the universal standard |
| Orchestrator | T119 Hermes regeneration, T120 trigger-index rebuild and T121 the two sk-doc README fixtures, each once after every build |

### Finding status at plan time

Every finding in this child reproduced on 2026-10-10 (T012 records the commands). None was already fixed by an earlier phase.

### Proposed text

The units below change more than one line or delete a line. Each block is the exact text of `scratch/units/<task>.old.txt` or `.new.txt`. A single-line unit is quoted inline in its task.

