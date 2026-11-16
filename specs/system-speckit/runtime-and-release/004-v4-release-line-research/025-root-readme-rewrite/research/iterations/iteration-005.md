# Iteration 5: Q5 — Reader-First Section Order for a Shorter README

## Focus

Q5: what a new reader needs first, what can shrink to a link, and what the repository's other READMEs already own so the root can link instead of repeat.

The iteration measured the root `README.md` by section rather than by claim, then measured the 14 skill READMEs and the sibling docs the root already links to. The output is a proposed section order with a line budget and a shrink map keyed to the file that would own each removed block.

Not in scope this iteration: Q3 (per-runtime hook/plugin adapter mapping) and Q4 (claim-by-claim staleness audit). Both remain open.

## Actions Taken

1. Read the run config, strategy and state projection to fix the iteration number, the focus, the exhausted-approach list and the lifecycle branch (`new`).
2. Mapped every ATX heading in the root `README.md` with its line number, then computed the exact inclusive span of all 17 H2 sections from consecutive heading starts. The spans sum to 1,763 plus 10 lines of front matter, which reconciles to the 1,773-line total — the measurement is complete, not sampled.
3. Enumerated the per-skill READMEs, their line counts and their H2 skeletons, to test whether they can absorb content the root currently carries.
4. Measured the sibling docs the root already links to (`.skilled/hooks/README.md`, `INSTALL-SKILLED.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/README.txt`, `AGENTS.md`) by line count and, for the hooks README, by section.
5. Counted, per skill, how many times the root README links that skill's `README.md`, to separate "already deferred" from "not linked at all".
6. Read the front matter, §3, §6 head, §9 head, §11 head and §12 SPEC KIT head to confirm what each block actually contains rather than inferring from its title.

## Findings

### Structure and size

1. The root `README.md` is 1,773 lines across 17 H2 sections with no table of contents. Front matter runs lines 1-10 (title, three badges, a donation line); §1 SUMMARY begins at line 11; the last section, RELATED DOCUMENTS, begins at line 1751. A reader has no in-document map. [SOURCE: README.md:11] [SOURCE: README.md:1751]

2. Four catalog sections carry 898 of 1,773 lines — 50.6% of the file. Measured inclusive spans: §6 SPEC KIT 304 lines (260-563), §12 COMMAND LIBRARY 283 (1172-1454), §9 SKILL LIBRARY 162 (799-960), §11 PLUGIN & EXTENSION LIBRARY 149 (1023-1171). No other section exceeds 143 lines: §15 CONFIGURATION 143, §8 SKILL ADVISOR 129, §7 DEEP LOOP 106, §4 QUICK START 89, §3 OVERVIEW 70, §13 CODE MODE MCP 67, §16 FAQ 64, §10 AGENT LIBRARY 62, §2 WHAT YOU GET 61, §17 RELATED DOCUMENTS 23, §14 GIT WORKTREE 22, §1 SUMMARY 18, §5 USE IT IN YOUR OWN PROJECT 11. [SOURCE: README.md:260] [SOURCE: README.md:1172] [SOURCE: README.md:799] [SOURCE: README.md:1023]

3. The doctor commands are 129 of the 283 COMMAND LIBRARY lines (1314-1442) — 45.6% of that section — and `.skilled/skills/system-skilled-doctor/README.md` is 144 lines owning the same eleven commands. The duplication is concentrated in one place, not spread across the catalog. [SOURCE: README.md:1314] [SOURCE: .skilled/skills/system-skilled-doctor/README.md:1]

### What the other READMEs already own

4. All 14 skill READMEs share one skeleton: OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, then a troubleshooting/FAQ block where present, VERIFICATION and RELATED DOCUMENTS. Total 3,179 lines, mean 227. `system-spec-kit/README.md` is the outlier at 716 lines and carries its own COMMANDS (36) and CONFIGURATION (52) sections, which is the content the root's §12 SPEC KIT block (41 lines) and much of §15 repeat. [SOURCE: .skilled/skills/system-spec-kit/README.md:1] [SOURCE: .skilled/skills/sk-code/README.md:1]

5. Nine of fourteen skill READMEs are not linked from the root README at all. Link counts: `sk-code` 3, `system-spec-kit` 2, `system-skill-advisor` 2, `system-deep-loop` 1, `system-skilled-doctor` 1; `cli-classifier`, `cli-external-orchestration`, `cli-orca`, `local-webflow`, `mcp-code-mode`, `mcp-tooling`, `sk-doc`, `sk-git`, `sk-prompt` all 0. The "link instead of repeat" premise is already half-built — and half-broken. [SOURCE: README.md:1751]

6. `.skilled/hooks/README.md` is 436 lines and already owns the hook coverage story: a DIRECTORY TREE section (157 lines) and a COVERAGE MATRIX (50 lines) that states which runtime runs each hook. The root's PLUGIN & EXTENSION LIBRARY already defers to it in one sentence ("The [hooks README](.skilled/hooks/README.md) holds the coverage matrix"), so the deferral pattern is established and can be extended rather than invented. [SOURCE: .skilled/hooks/README.md:1] [SOURCE: README.md:1168]

7. `INSTALL-SKILLED.md` is 368 lines and owns install plus the link-versus-copy decision. The root duplicates two npm build blocks (lines 166-180) and spends a 10-line §5 whose entire payload is "the install guide walks through both". §4 QUICK START already links out at line 164 and line 249, so the duplication is not load-bearing. [SOURCE: INSTALL-SKILLED.md:1] [SOURCE: README.md:160] [SOURCE: README.md:249]

### Ordering

8. Install does not start until line 160 of 1,773 — 9% into the file — behind 149 lines of positioning (SUMMARY 18 + WHAT YOU GET 61 + OVERVIEW 70). The only link hub in the document, RELATED DOCUMENTS with roughly 20 links, is the final section at line 1751. Both are inverted for a reader who arrives without context: the front loads orientation, the back hides navigation. [SOURCE: README.md:160] [SOURCE: README.md:1751]

9. Runtime support is stated twice with two different answers and never as a table. §1 SUMMARY names six ("Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI"); §4 names eight, adding DeepSeek Harness and Mistral Vibe. There is no runtime matrix section anywhere in the root README, so a reader choosing a runtime has to reconcile two lists. [SOURCE: README.md:15] [SOURCE: README.md:184]

10. §3 OVERVIEW spends 49 of its 70 lines on one ASCII flow diagram (lines 111-159) and the remainder on a three-item conceptual list. The diagram is the largest prose-free block in the front matter. [INFERENCE: based on the §3 span of 70 lines with the diagram occupying lines 111-159, the diagram is a candidate to move beside or behind a link to `.skilled/skills/system-spec-kit/ARCHITECTURE.md`, which the root already links at line 1770]

### Proposed reader-first order

11. Five tiers, ordered by what a reader needs next rather than by what the product contains:

**Tier 1 — first screen, target ≤ 60 lines.** Title + badges (keep 1-10); "what it is" as six one-line capability bullets each linking to its owning section (WHAT YOU GET 61 → ~15); a new runtime matrix, eight runtimes × columns for hooks, command spelling and notes (~20); a documentation map table of the 14 skill READMEs plus INSTALL-SKILLED.md, AGENTS.md, the hooks README and the git-hooks README, promoted from §17 (23 → ~20).

**Tier 2 — get running, target ≤ 120 lines.** Install and build (keep 160-181, drop the prose that repeats INSTALL-SKILLED.md §2); check the setup via `/doctor:setup` (keep 182-193); first task with the runtime command-spelling note (keep 194-211); use it in your own project (11 → 5, link).

**Tier 3 — how it works, target ≤ 120 lines.** Gate system and core workflow (condense §3's list, move or link the diagram); Spec Kit at concept level — levels table and folder structure only (304 → ~70) linking `system-spec-kit/README.md`; Deep Loop (106 → ~35) linking `system-deep-loop/README.md`; Skill Advisor (129 → ~35) linking `system-skill-advisor/README.md`; Code Mode MCP (67 → ~30) linking `mcp-code-mode/README.md`.

**Tier 4 — catalogs as tables, target ≤ 120 lines.** Skills as a 14-row table with one README link per row (162 → ~25); agents as an 11-row table (62 → ~15); commands as a six-row group table (283 → ~25) linking `.skilled/commands/` and the owning skill READMEs; hooks and plugins as ~30 lines linking `.skilled/hooks/README.md` (149 → ~30).

**Tier 5 — reference, target ≤ 100 lines.** Configuration (143 → ~30, linking `INSTALL-SKILLED.md` and `sk-code/README.md`); git worktrees and live sync (22, keep); FAQ (64, keep or trim); RELATED DOCUMENTS only if it was not promoted to tier 1.

Projected total ~500-620 lines from 1,773, a 65% cut. The eight largest shrink deltas: COMMAND LIBRARY −258, SPEC KIT −234, SKILL LIBRARY −137, PLUGIN & EXTENSION LIBRARY −119, CONFIGURATION −113, SKILL ADVISOR −94, DEEP LOOP −71, CODE MODE MCP −37. [INFERENCE: based on the measured spans in finding 2 and the target budgets in this finding]

12. Shrink map — each block paired with the file that would own it: §6 → `system-spec-kit/README.md` (716); §12 DOCTOR → `system-skilled-doctor/README.md` (144); §12 SPEC KIT → `system-spec-kit/README.md` COMMANDS; §9 → the 14 skill READMEs (3,179 combined); §11 Goal Plugin → `.skilled/hooks/goal/README.md`; §11 Session Handover → `.skilled/hooks/session-handover/README.md`; §11 remainder → `.skilled/hooks/README.md` (436); §13 → `mcp-code-mode/README.md` (223); §8 → `system-skill-advisor/README.md` (280); §7 → `system-deep-loop/README.md` (127); §14 and the git-hooks note → `.skilled/scripts/git-hooks/README.md` (202); §15 adapting section → `sk-code/README.md` (226); install prose and §5 → `INSTALL-SKILLED.md` (368). Every target already exists on disk and is already linked somewhere in the root README except the nine unlinked skill READMEs in finding 5. [SOURCE: .skilled/skills/sk-code/README.md:1] [SOURCE: .skilled/scripts/git-hooks/README.md:1]

## Ruled Out

- **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections.
- **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it.
- **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map.

## Dead Ends

- None this iteration. Every action produced usable evidence.

## Edge Cases

- Ambiguous input: none. Q5 named the three deliverables (what comes first, what shrinks, what the other READMEs own) and all three are answered.
- Contradictory evidence: none. The 6-versus-8 runtime discrepancy in finding 9 is a defect in the README, not a conflict between sources.
- Missing dependencies: none. `resource-map.md` is absent by config (`resource_map_present: false`), so the coverage gate is skipped rather than failed.
- Partial success: none. All six actions completed.

## Sources Consulted

- `README.md:1` (front matter), `README.md:11`, `README.md:15`, `README.md:90`, `README.md:160`, `README.md:184`, `README.md:249`, `README.md:260`, `README.md:799`, `README.md:1023`, `README.md:1168`, `README.md:1172`, `README.md:1314`, `README.md:1751`
- `.skilled/skills/system-spec-kit/README.md:1`
- `.skilled/skills/sk-code/README.md:1`
- `.skilled/skills/system-skilled-doctor/README.md:1`
- `.skilled/hooks/README.md:1`
- `INSTALL-SKILLED.md:1`
- `.skilled/scripts/git-hooks/README.md:1`
- `wc -l` over `.skilled/skills/*/README.md` (14 files, 3,179 lines)
- `grep -c "skills/<name>/README.md" README.md` over all 14 skill names

## Assessment

- New information ratio: 0.87
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- What worked and why: computing section spans from consecutive heading line numbers gave an exact, self-reconciling size map (1,763 + 10 front matter = 1,773) in one call. The reconciliation is what makes the measurement trustworthy — a sampled or estimated span set would not have summed to the file total, and the 50.6% catalog share is the single number the whole recommendation rests on. Pairing it with the per-skill README skeleton in the next call is what turned a size map into a shrink map: the spans say where the lines are, the skeletons say who can absorb them.
- What did not work and why: nothing failed this iteration, but the earlier instinct to treat §17 as the navigation answer was wrong and was caught by counting link coverage per skill rather than counting links. A link hub that omits nine of fourteen targets looks complete from its own contents.
- What I would do differently: count inbound links per target rather than total links per section. The 0-count list was the actual finding, and it came from a per-name loop, not from reading the section.

## Questions Answered

- **Q5** — Reader-first section order for a shorter README: what a new reader needs first (what it is, install, core workflow), what can shrink to a link, and what other READMEs in the repo (`.skilled/skills/*/README.md`) already own so the root can link instead of repeat.

## Questions Remaining

- **Q3** — every dedicated hook, plugin and extension per runtime, one README subsection each. The 27 hook cores are named and verified; the per-runtime adapter mapping is still unmeasured.
- **Q4** — claim audit of the current 1,773-line `README.md`. Q5 supplies the section order the audit should walk.

## Recommended Next Focus

**Q4** — the claim audit. Q5 supplies the measurement Q4 needs: the audit should be walked section by section in the proposed tier order, so the highest-read claims (front matter, install, first task) are verified first and the catalog claims are verified only where they survive the shrink. Two specific claims are already flagged for Q4 to settle rather than re-discover: the six-versus-eight runtime enumeration (README.md:15 against README.md:184) and the 45-command count asserted at README.md:1174.

Q3 remains open and independent; it needs the per-runtime adapter mapping, which no iteration has measured yet.
