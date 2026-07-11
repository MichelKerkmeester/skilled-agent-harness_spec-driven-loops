# Opus 4.8 Adversarial Review — GPT-5.6 Proposal

Verdict: APPLY WITH SPECIFIC FIXES — not safe as-is.

## Blocking defect (new)

The two `quick_reference.md` §8 edits (from Rule 1 and Rule 2) collide: Rule 1 replaces the entire §8 with a body that drops the `**Phased Packets**` paragraph; Rule 2 then tries to replace that now-deleted paragraph. Applied in order, Rule 2's target string no longer exists. Fix: merge into a single §8 replacement (see Fix 1 below).

## Factual error repeated (confirmed)

Proposal §1.1 and §4 still say "apply the same Gate 3 wording to both root CLAUDE.md and AGENTS.md" despite CLAUDE.md being a symlink to AGENTS.md. Edit AGENTS.md once; CLAUDE.md updates automatically. `.claude/CLAUDE.md` correctly needs no edit.

## Missed file (new)

`README.md:338-342` carries a Gate 3 ASCII diagram with the same A-E labels, including "E) Phase folder" — not on GPT's edit list. Low severity (labels stay stable), optional sync (Fix 5).

`references/memory/trigger_config.md:138` and `references/workflows/worked_examples.md:60` show illustrative A-D examples (no E) — pre-existing, out of scope, no edit needed.

## Category-mismatch edit

`folder_routing.md §9` "new folder" row governs save-time alignment routing (`generate-context.js`), not Gate 3 creation routing. GPT's edit conflates the two. Defensible to leave unchanged; if keeping it, use the save-scoped rewording in Fix 4.

## Machine-contract check

`shared/gate-3-classifier.ts` (`classifyPrompt`, `validateSpecFolderBinding`, trigger vocabularies) does not parse or render Gate 3's A-E prose — confirmed via grep of all consumers. Prose edits are safe from the code side.

## Stress test: unrelated-work-into-open-parent risk

No new mechanical guard is added — the relatedness test is interpretive. But the real backstops (user always selects, never autonomous; AGENTS.md's existing "verify not a phase child" rule) stay intact. Net risk goes down, not up. One hardening applied: lead Gate 3's recommendation line with the relatedness precondition, not "recommend E first" (Fix 3).

## Open re-qualification question — ANSWERED

Established phase parents do NOT re-qualify per child. Grounds: `phase_definitions.md:108`'s single-source-of-truth `is_phase_parent()` check is purely structural (child folder pattern + spec.md/description.json present) — no score recompute. The 25/level-3 thresholds gate the initial decompose/convert decision only; no per-child scoring construct exists anywhere in the model. `create.sh --phase --parent` adds children with no re-scoring step.

Caveat: this is a real behavioral expansion (decompose-once → growable container) that the proposal appropriately writes down for the first time. Confirm this is the intended model.

## Per-edit applicability (old-strings verified byte-exact)

| # | Edit | Old-string matches | Accomplishes rule cleanly |
|---|------|---------------------|---------------------------|
| 1 | phase_definitions.md (3 locations) | Yes | Yes |
| 2 | SKILL.md ALWAYS-5, ALWAYS-16 | Yes | Yes |
| 3 | AGENTS.md Gate 3 options | Yes | Symlink issue only |
| 4 | quick_reference.md §8 + §8 Phased-Packets + §9 | Yes individually | No — merge required (blocking) |
| 5 | folder_routing.md §9 row | Yes | Category mismatch |
| 6 | sub_folder_versioning.md §1 bullet | Yes | Yes |
| 7 | spec_folder_authoring_checklist.md §2 insert | Yes | Yes, slightly off-domain but harmless |

## Fixes (paste-ready, superseding GPT's raw wording where they conflict)

See full text in the task-notification result captured in this packet's implementation-summary.md — Fix 1 (merged §8), Fix 2 (symlink correction), Fix 3 (relatedness-first Gate 3 wording), Fix 4 (save-scoped folder_routing.md wording, optional), Fix 5 (README.md E-label sync, optional).
