# Iteration 15: Second-Model Re-check 5 of 5 — Ranks 6, 7, 11, 13, 14 and the Reordering

## Focus

Final leg of the second-model pass. Iterations 1 to 10 ran on one model family and the synthesis says so: every judgment, "including the order of the ranked rows, is one model family's reading until another family checks it" [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:31] `one model family's reading until another family checks it`. This iteration opens the source tags of the last five unexamined rows in section 6 — ranks 6, 7, 11, 13 and 14 — and returns CONFIRMED, REFUTED or NOT TESTED per row. It then states my own top five and names every place my order differs from the first-pass order.

It does not repeat the first pass. Where a row's tags resolve, the question is whether the lines still say what the row claims, and whether the row claims anything its tags do not cover.

## Actions Taken

1. Opened the quality mode's target-path map and workflow: `sk-code-quality/SKILL.md` lines 108-125 and 165-220.
2. Opened the two structural claims behind rank 6: `mode-registry.json` lines 55-75 and `check-dist-staleness.sh` lines 125-205.
3. Opened the four benchmark artifacts behind ranks 7 and 13: `source.md`, `skill-benchmark-report.md`, `skill-benchmark-report.json` and `reports/README.md`.
4. Ran five disk checks in one command: `git ls-files .opencode/specs | wc -l` (0), `test -d .opencode/specs` (absent), `git check-ignore -v .opencode/specs` (`.gitignore:12:!specs`), `test -f` on the cited spec-folder checklist (exists), `ls` on `workflow-implement.md` (exists), `awk '/--all/'` over the quality `SKILL.md` (no match), `wc -l` (324 lines).
5. Read `iteration-011.md` and `iteration-014.md` for the second-model findings this order builds on. `iteration-012.md` was not opened (see Edge Cases).

## Findings

### Verdict table

| Row | Claim as ranked | Verdict | Classification |
|---|---|---|---|
| 6 | Quality hands new-file work back to a surface packet the registry forbids from writing | CONFIRMED | OBSERVED |
| 7 | The saved runs score one routing scenario, leave D4 unscored, record intent recall 0 and no corpus | CONFIRMED, one sub-claim uncited | OBSERVED |
| 11 | The `.opencode/specs/` row names a path with no tracked file here | CONFIRMED, and understated | OBSERVED |
| 13 | The live run records an absolute root under an old path, and corpus and sources are not recorded | CONFIRMED | OBSERVED |
| 14 | `--all` mode rebuilds stale packages by default, which writes files the mode may not create | CONFIRMED, framing corrected | OBSERVED |

No row was REFUTED. Two rows are understated rather than wrong: rank 11 has a second stale site, and rank 14 corrects an instruction that does not exist.

### Rank 6 — CONFIRMED, and the evidence upgrades from DERIVED to OBSERVED-grade

**OBSERVED — the handback names a specific sibling packet.** The workflow's seventh step reads: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:185] `hand back to the surface skill` and continues `(\`sk-code-skilled\`)`. So quality does not hand back to "the surface" generically; it names one packet by id. That is the fact the row needs, and it is verbatim.

**OBSERVED — that packet's declared tool surface forbids every mutating tool.** The registry entry opens at [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] `"workflowMode": "sk-code-skilled",` with `"packetKind": "surface"`, and declares [SOURCE: .skilled/skills/sk-code/mode-registry.json:66] `"forbidden": ["Write", "Edit", "Task"],` followed by [SOURCE: .skilled/skills/sk-code/mode-registry.json:67] `"mutatesWorkspace": false,`.

**DERIVED — the contradiction is now observable on both sides.** The first pass labeled rank 6 DERIVED because it joined a prose instruction to a registry field. Both sides are now lines I read directly, so the contradiction is an observed property of two files rather than an inference from one. The narrower reading still applies: `toolSurface` is declared under a `workflowMode` entry, so it governs how that mode is dispatched, not necessarily every reader who opens the packet. What it unambiguously publishes is a contract of "no Write, no Edit, no Task" for the packet quality names. A reader who follows `SKILL.md:185` therefore arrives at a target whose own declaration says it cannot perform the work being handed to it.

**OBSERVED — the row's proposed replacement target exists.** Rank 6 says to hand off to "the acting agent applying the surface's `workflow-implement.md`". That file is present: `.skilled/skills/sk-code/shared/references/workflow-implement.md`. The recommendation is therefore a wording change to a real destination, not a pointer to a file someone would have to author. No iteration had checked this.

### Rank 7 — CONFIRMED, and the unmeasured share is larger than the row states

**OBSERVED — D4 is unscored, and so is D1 inter.** The rendered report shows [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:20] `| D4 usefulness | 25pts | _unscored-mode-a_ |` and, one table row above it, [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:16] `| D1 inter (advisor) | 12pts | _unscored-mode-a_ |`.

**DERIVED — 37 of 100 weighted points are unmeasured.** The six weights sum to 100 (12 + 13 + 20 + 15 + 25 + 15). Two of them, 12 and 25, are unscored. The report's own headline is [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:5] `**Verdict: PASS** · aggregate 100/100`, so a reader who takes the verdict at face value reads "100/100" as full coverage when it is a normalized score over 63 weighted points. The row says "leave D4 usefulness unscored"; the sharper statement is that the packet's only saved PASS covers 63 of 100 points, and the single largest weight is among the missing. That strengthens the row's case for a D4-scored run rather than weakening it.

**OBSERVED — one scenario, as the row says.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:9] `Scored (text executors): **1**`. The machine record's only scenario row is `CQ-001` at `tier: playbook`.

**OBSERVED — intent recall is zero while resource recall is one.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:174] `"intentRecall": 0,` sits beside `"resourceRecall": 1` and `"score": 0.6` in the same `d1intra` block. So the scenario reached the right resources without matching the intended intent — the exact failure mode rank 12 later described from the other direction.

**OBSERVED, with a tag gap — the corpus is unrecorded, but rank 7 does not cite the line that says so.** The run's own source map reads [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/source.md:12] `| Scenario corpus | not recorded |`, and the index repeats it: [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md:27] `not recorded`. Rank 7's own row cites only `report.md:20` and `report.json:174`, neither of which mentions a corpus. The claim is true on disk; the row should carry the third tag. This is a citation defect, not a factual one.

### Rank 11 — CONFIRMED, and the fix scope is twice what the row records

**OBSERVED — the row is keyed to a path that does not exist here.** The map row reads [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:119] `Check spec-folder structure and packet-document consistency.` in the gate-behavior column, keyed in the first column to `.opencode/specs/`.

**OBSERVED (command output) — the path fails every test, not just the tracking test.** `git ls-files .opencode/specs | wc -l` returned `0`; `test -d .opencode/specs` returned `DIR ABSENT`; and `git check-ignore -v .opencode/specs` printed [SOURCE: .gitignore:12] `!specs`, a negation pattern. The negation matters: it means the absence is not explained by a gitignored local directory that exists on disk and works for the operator. The directory is simply not there and never was in this checkout, so the row cannot match by any route.

**OBSERVED — the row is duplicated, which the first pass did not record.** The CONDITIONAL tier table carries the same key and the same target: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:105] `../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` (system-spec-kit). Rank 11 cites only line 119. Replacing the map row alone therefore leaves a second `.opencode/specs/` entry live in the file's loading table. **This is the iteration's clearest new fact**: the fix is two edits, not one, and a maintainer following the row as written would ship a half-fix.

**OBSERVED — the replacement target is real.** `specs/` exists at the repository root, and the cited checklist resolves: `system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` is present. So the row points at a live checklist through a dead key, which is why the defect is silent: the resource loads, the selector never fires.

### Rank 13 — CONFIRMED, and the decision owner is correctly identified

**OBSERVED — the recorded root is absolute and under a path this repository no longer uses.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/source.md:11] `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/code-quality`. It is both machine-specific and stale: the packet now lives under `.skilled/skills/sk-code/sk-code-quality`.

**OBSERVED — sources are unrecorded in the index.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md:27] `not recorded`, in the Source column, and the same value on the second row.

**OBSERVED — the harness, not the packet, owns the format.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md:19] `Rows are written by the benchmark harness at the moment it writes the report`. Rank 13's "Needs decision: the benchmark harness owns the report format, outside the quality packet" is therefore correct about who must agree. The row is a request to another owner, and its readiness cell is accurate.

### Rank 14 — CONFIRMED, but the row corrects an instruction that does not exist

**OBSERVED — `--all` is the branch that rebuilds.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:198] `surface_result(item, repo_root, auto_rebuild=True)` sits inside the branch opened at `:190` by `if sys.argv[1] == "--all":`. The per-file path below it calls the same function without that argument, and the definition defaults it off: [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:166] `def surface_result(payload, repo_root, auto_rebuild=False) -> None:`. So per-file mode is already non-writing by default.

**OBSERVED — the switch defaults to on.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:136] `value = os.environ.get("SPECKIT_DIST_AUTO_REBUILD", "1").strip().lower()`, and `auto_rebuild_enabled()` returns true for anything outside `0`, `false`, `off`, `no`. Setting it to `0` disables the rebuild as the row proposes.

**OBSERVED — the rebuild is deliberate, not accidental.** The function's own comment says so: [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:132] `# Session-start self-heal is on by default.` The row's fix therefore cannot be "stop rebuilding"; it must be a workflow sentence about which invocation quality may use. The row already frames it that way, and this confirms the framing is the only available one.

**OBSERVED, framing correction — quality contains no `--all` instruction to correct.** `awk '/--all/'` over `sk-code-quality/SKILL.md` returned no match, and the tier row that names the checker is bare: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:108] `| CONDITIONAL | Generated distribution artifacts or mirrored outputs changed |` with the script as the resource. Rank 14's "why" reads as though the workflow currently asks for `--all` and the row redirects it. The truth is that the workflow says nothing, and the risk is latent: a reader who reaches for the mode that checks everything silently gains a rebuild. "Ready now" still holds; the justification should say *absent* instruction, not *wrong* instruction. The `--all` attribution the row makes — "shared doctrine, whose session-start hook runs `--all`" — is **NOT TESTED** here: I did not open that hook.

### Cross-cutting: what these five rows have in common

**DERIVED.** Four of the five (6, 11, 13, 14) are text repairs to statements that are false or absent, and the fifth (7) is a request for an instrument. None requires a new mechanism, and all five are S or M effort. Rank 11 is a two-line fix to a dead key; rank 6 is one clause in one sentence; rank 14 is one sentence that does not exist yet. The cheap half of this backlog is documentation truth, and no runtime gate in the packet would ever catch any of it — which is the same conclusion iterations 11 to 14 reached from other rows.

## My Top Five, and Where the Order Differs

Ranked under the packet's own rule — total gain across the three goals, then evidence strength, then low effort [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:191] `Rank orders by total gain across the three goals, then by evidence strength, then by low effort.`

1. **Name the CI surface and give a workflow-editing prompt a workflow primary** (first-pass rank 3, moved **up 2**). It is the only row in the set with runtime evidence: iteration 14's replay returned a lone `sk-code-ci` target with `packetKind: surface` and `backendKind: evidence-base` for the prompt "fix the GitHub Actions workflow". A request that must change a file resolves to the one packet kind that cannot change it. Documentary rows cannot outrank an observed routing failure under an evidence-first rule.
2. **Report a checker that checked nothing as skipped, never as clean or N/A** (first-pass rank 4, moved **up 2**). Its tag is exact — [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:216] `checker_outputs: <comment-hygiene and dist-staleness results, or N/A>` — so the envelope still admits the outcome the checker's exit 2 was built to prevent. It is S effort and it is the difference between "passed" and "not checked" for every non-JavaScript repository.
3. **Add behavior fixtures with D4 scoring and record catch rate, misses and time** (first-pass rank 7, moved **up 4**). This is the instrument the other rows are judged by. My check shows the saved PASS covers 63 of 100 weighted points, with the 25-point usefulness dimension unscored, so every "High useful" gain cell in the table is currently unmeasured. Measuring is a precondition for trusting ranks 1, 2 and 5, which is why it outranks them here.
4. **Replace the duplicated `.opencode/specs/` row** (first-pass rank 11, moved **up 7**). Cheapest true fix in the set: a dead key in two places, with the replacement checklist and the `specs/` root both verified present. It moved because the scope doubled — two edits, not one — and because the row is ready now with no decision attached.
5. **Hand back to the acting agent, not to the read-only surface packet** (first-pass rank 6, moved **up 1**). Both sides of the contradiction are now directly read lines, so its evidence upgrades from DERIVED to OBSERVED-grade. That upgrade is what lifts it above rank 5 under the evidence tiebreak; on gain alone the two are close.

**Dropped from the top five:**

- **Rank 1, the checklist split** (first-pass **1**, now outside the top five, down at least 6). Iteration 11's Refinement A narrowed the false-block scope to `.js` and `.css` files, so a Python, Go or Rust repository gains ceremony reduction rather than a removed block. The row also waits on the P0 decision. A decision-gated row with a narrowed gain does not sit first.
- **Rank 2, surface-declared checklists** (first-pass **2**, now outside the top five, down at least 6). Its evidence is DERIVED, it has no runtime proof, and rank 3's replay shows the CI surface is the first surface that would need to declare anything. It is better built after rank 3 than before it.
- **Rank 5, probe the enforcement layers** (first-pass **5**, now outside the top five, down at least 6). Nothing refutes it — it stays High repo-agnostic and OBSERVED. It drops only because rank 6's evidence upgraded past it and the top five is capped at five. This is the weakest of my divergences and the first I would reverse.

**Every divergence, listed:** 3→1, 4→2, 7→3, 11→4, 6→5; 1, 2 and 5 out of the top five. No row's substance is rejected. The reordering is about evidence grade and readiness, not about whether the changes are right.

**What would change this order.** If the CI packet turns out to carry only reference material and no procedural guidance, rank 3's fix is smaller than I rank it and drops below rank 4. If a D4-scored fixture shows the gate catching nothing in a real change, rank 7's fixtures move to first, because they would be measuring a gate that does not work. Both are open questions below.

## Questions Answered

None of the strategy key questions. All five were already ticked, as iterations 13 and 14 also report.

## Questions Remaining

- **Does the CI packet carry procedural guidance, or only reference material?** Iteration 14 opened this; it now decides my rank 1. A packet that can only inform cannot act as the workflow primary a "fix this workflow" prompt needs.
- **Where should the boundary between the quality and review checklists sit?** Open since iterations 5 and 11, untouched in 12, 13 and here.
- **Which of `ROUTER.md`'s two CODE_QUALITY lists is authoritative — the prose row or the keyword row?** Rank 12's fix depends on it, and iteration 14 showed the disagreement is inside one file as much as across two stages.
- **Does a stage-two intent match a `yagni` or `simplify` prompt, and which instrument observes it?** Stage one is confirmed by replay; stage two remains UNKNOWN at runtime.
- **Who consumes the `code-quality/v1` schema id outside this repository?** Unchanged since iteration 13.
- **NEW — does any shared-doctrine instruction tell quality to run the dist checker with `--all`?** Rank 14 attributes `--all` to the session-start hook. I did not open that hook, so the attribution is **NOT TESTED**.
- **NEW — is the `.opencode/specs/` key duplicated anywhere beyond the two sites found here?** Two were found by reading the map and the tier table; a token search across the packet would settle whether a third exists.

## Edge Cases

- **Ambiguous input:** none. The focus named five rows and the sources were unambiguous.
- **Contradictory evidence:** none between sources. One contradiction was *found* rather than encountered — quality's handback names a packet the registry forbids from writing — and it is recorded as the rank 6 finding rather than as a conflict in this iteration's evidence.
- **Missing dependencies:** `iteration-012.md` was not opened; the tool budget was reserved for artifact creation and verification, which the agent contract puts ahead of a final research call. Iteration 12's content is therefore known here only from the carried-forward state summary (rank 4's envelope half NOT TESTED), not from the file. Its conclusion is not relied on in the ordering above.
- **Partial success:** none. Every planned check ran and every tag resolved.

## Assessment

- New information ratio: 0.45. Three of five rows confirmed with no fact beyond their tags. Two produced facts no iteration recorded: rank 11's row is duplicated at a second site, and rank 14 has no `--all` instruction to correct. Two smaller new facts — the proposed `workflow-implement.md` target exists, and the saved PASS covers 63 of 100 weighted points — plus the reordering itself.
- Questions addressed: ranks 6, 7, 11, 13 and 14 of section 6, all five verdicts.
- Questions answered: none of the strategy key questions; all were already ticked.

## Reflection

- **What worked and why:** testing each row's *uncited* sub-claims, not just its tags, is what produced the two new facts. Rank 11's tag was correct and the row was still understated, because the same key appears in a table the row never cites. A tag check alone would have passed it.
- **What did not work and why:** treating `report.md:5`'s "100/100" as context rather than as a claim. It took the weight arithmetic to see that the headline hides 37 unmeasured points; the first pass quoted the D4 row and stopped there.
- **What I would do differently:** open `iteration-012.md` before spending the fifth research call on a disk check whose answer (the checklist exists) was already strongly implied by the tag resolving.

## Recommended Next Focus

The second-model pass is complete at 5 of 5. The remaining value is no longer in reading. Two instruments would settle the open questions that block the reordered list: a D4-scored behavior fixture, which decides whether rank 7 moves to first, and opening the CI packet's procedural content, which decides whether my rank 1 is a routing fix or a packet-authoring one.
