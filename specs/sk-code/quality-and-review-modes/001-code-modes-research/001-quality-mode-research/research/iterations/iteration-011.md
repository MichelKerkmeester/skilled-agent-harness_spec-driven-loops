# Iteration 11: Second-Model Re-Check 1 — Ranked Rows 1 and 2

## Focus

Second-model verification pass. Iterations 1 to 10 ran on one model family (`cli-codex` `gpt-6-luna`), and the synthesis says so explicitly: every judgment, including the order of the ranked rows, is "one model family's reading until another family checks it" [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:31] `one model family's reading until another family checks it`. This iteration does not repeat the first pass. It opens every source tag cited by rank 1 and rank 2 of section 6 and tests each claim against current disk, returning CONFIRMED, REFUTED or NOT TESTED per claim.

The two rows under test:

- **Rank 1:** split the always-loaded checklist into a surface-neutral baseline and an opt-in JavaScript/CSS overlay. Claimed basis: the ALWAYS tier holds P0 house-style items such as the 67-character header, while the shared phase doctrine names a universal checklist instead.
- **Rank 2:** let each surface declare its quality checklists by target pattern. Claimed basis: the quality target-path map is authoritative and kept by hand, and `sk-code-skilled` declares CODE_QUALITY resources.

## Actions Taken

1. Read the agent definition, the run config and lineage id, the strategy, and `research.md` sections 3, 5 and 6 to fix the exact claim text and its cited anchors.
2. Opened all four cited files on current disk in one bounded read: `sk-code-quality/SKILL.md` (lines 85-180, 190-230, 288-300), the always-loaded checklist `overview-header-and-comments.md` (lines 1-75), `shared/references/phase-detection.md` (lines 40-75) and `sk-code-skilled/SKILL.md` (lines 80-110).
3. Tested each claim against those lines. Where a claim needed a line outside its cited anchor (the ALWAYS tier row, the literal map table, the envelope surface field, the existing universal baseline reference), the narrowest adjacent range was read and is cited below.
4. No network fetch. No file under `.skilled/` was modified. `002-review-mode-research/research/` was not read.

## Findings

### Verdict table

| # | Claim as ranked | Verdict | Classification | Anchor |
|---|---|---|---|---|
| 1a | The ALWAYS tier loads the JavaScript/CSS checklist before any implementation-done claim | CONFIRMED | OBSERVED | `sk-code-quality/SKILL.md:100` |
| 1b | That checklist is a web house style, and the 67-character header is a P0 item | CONFIRMED | OBSERVED | `overview-header-and-comments.md:3`, `:60` |
| 1c | The shared phase doctrine names a universal checklist "instead" | CONFIRMED for the naming; the "instead" is DERIVED | OBSERVED + DERIVED | `phase-detection.md:63` |
| 2a | The target-path map is authoritative inside quality | CONFIRMED | OBSERVED | `sk-code-quality/SKILL.md:171` |
| 2b | The map is kept by hand, so surface add/remove needs a quality edit | DERIVED, plausible; drift corroboration NOT TESTED here | DERIVED | `sk-code-quality/SKILL.md:114-121` |
| 2c | `sk-code-skilled` declares CODE_QUALITY resources | CONFIRMED | OBSERVED | `sk-code-skilled/SKILL.md:95-96` |

No claim was REFUTED.

### Rank 1

**1a — CONFIRMED (OBSERVED).** The second ALWAYS row fires before any completion claim and names the checklist: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:100] `Before any implementation-done claim`. The row's resource cell begins with `assets/code-quality-checklist/overview-header-and-comments.md`. So the checklist is loaded unconditionally by the mode, not selected by target path.

**1b — CONFIRMED (OBSERVED).** The checklist describes itself as web house style: [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:3] `Validation checklist for JavaScript and CSS code quality and style compliance.` The 67-character header is a P0 item, exactly as the row states: [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:60] `Header line width is 67 characters`. The line reads `- [ ] **[P0] CHK-HDR-03**: Header line width is 67 characters`, so the severity is P0 and the gate effect is the P0 floor at `SKILL.md:193` (`Blocks completion until fixed or escalated.`).

**1c — CONFIRMED for the naming, DERIVED for "instead".** The shared doctrine's Code Quality row does name a universal checklist plus a language checklist: [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:63] `Universal OpenCode checklist plus language checklist`. The word "instead" is the synthesis's inference, not the doctrine's. The doctrine row is a resource/evidence column in a phase table; it does not forbid an overlay, and quality still lists the universal checklist as a reference: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:296] `Universal OpenCode quality baseline.` The observable divergence is narrower and still real: the ALWAYS tier names the JS/CSS overview, the phase doctrine names the universal checklist, and the universal checklist is not in the ALWAYS tier.

**Refinement A — the false-block scope is `.js` and `.css` only.** Rank 1's repo-agnostic gain is stated as "High". The checklist scopes its own sections: [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:53] `Applies to:` (the line reads `**Applies to:** JavaScript (`.js`)`), and the language table admits only two extensions: [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:35] `| JavaScript | `.js` | Sections 2-7 |`. A Python, Go or Rust change therefore reads the checklist and finds no applicable P0 item — that is ceremony and token cost, not a false block. The false P0 block is real for a JavaScript repository that does not adopt this header, IIFE and naming convention, which is the case the row's last cell names. This does not refute rank 1; it narrows which repository actually gains.

**Refinement B — the surface-neutral baseline already exists.** The split does not need a new baseline authored. `sk-code-skilled` owns `assets/checklists/universal-checklist.md`, and quality already points at it as "Universal OpenCode quality baseline" [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:296] `Universal OpenCode quality baseline.`. Rank 1 is therefore a pointer swap in the ALWAYS row plus demoting the JS/CSS checklist to conditional. Whether that universal checklist is genuinely surface-neutral is **NOT TESTED** — the file was not opened this iteration, and its name says "OpenCode", which is the same portability question at one remove.

### Rank 2

**2a — CONFIRMED (OBSERVED).** The map's authority is stated in the mode's own text: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative`. The sentence continues `; the prompt-intent projection only makes the default quality resources scoreable.`, so stage-two intent routing is explicitly subordinate to the map.

**2b — DERIVED, drift corroboration NOT TESTED.** The map is a literal six-row Markdown table, not a generated artifact: [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:114] `| Target Path | Authoring Checklist | Gate Behavior |`. Nothing in the read range names a generator, loader or schema for it, so "kept by hand" is a structural inference from a hand-authored table plus the absence of a generator reference — DERIVED, not OBSERVED. The synthesis corroborates the drift with the Obsidian removal (`research.md:121`); this iteration did **NOT TEST** that corroboration, because it did not open the changelog entry or `specs/sk-code/013-private-surface-skills/spec.md`. One half of the drift is re-confirmed: the envelope still accepts only two surface values, [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:214] `resolved_surface: <skilled | unknown>`, so an Obsidian surface id has no representable value today.

**2c — CONFIRMED (OBSERVED), with a scope limit that matters to the recommendation.** `sk-code-skilled` does declare CODE_QUALITY resources: [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:95] `"CODE_QUALITY": [` and the first entry is [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:96] `"assets/checklists/universal-checklist.md",`. But the declaration is a flat resource list keyed by intent, not a target-pattern map. Rank 2 proposes that each surface declare checklists **by target pattern** and that quality consult that declaration before its built-in map. The existing declaration is precedent for "a surface can name its checklists"; it is not precedent for the per-glob contract the recommendation introduces. That raises rank 2's implementation cost relative to a reading that treats the existing `CODE_QUALITY` block as the target shape — it is a different shape.

**Not tested in rank 2.** The row's "Hub files touched" cell asserts that routing reaches both stages through `ROUTER.md` RESOURCE_MAP and `hub-router.json` routerSignals. Those two files were not opened this iteration, so that routing claim is **NOT TESTED** here and stands only on the first pass.

### Cross-row observation

Both rows are anchored correctly: every cited line exists at the cited number and says what the row says it says. The first pass's weakness is not misquotation. It is the leap from a quoted line to a gain estimate — rank 1's "High" repo-agnostic gain assumes the false block reaches non-JavaScript repositories, and Refinement A shows it does not; rank 2's "Ready now" assumes the surface declaration shape already exists, and 2c shows it does not.

## Ruled Out

- **Re-deriving the rankings from scratch.** Ruled out: this iteration's mandate is claim verification, and a fresh ranking would duplicate the first pass without adding an independent check.
- **Treating the absence of a generator reference as proof the map is hand-kept.** Ruled out as proof; recorded as DERIVED instead, because a generator could live outside the read range.

## Dead Ends

None. Every cited anchor resolved and every claim could be tested.

## Edge Cases

- **Ambiguous input:** none. The dispatch named ranks 1 and 2 and the exact claims.
- **Contradictory evidence:** none found. The only tension is rank 1's "instead" wording versus the doctrine's neutral table row; resolved by splitting OBSERVED from DERIVED.
- **Missing dependencies:** none. All four cited files exist and were readable.
- **Partial success:** the Obsidian drift corroboration and the stage-two routing claim in rank 2 were deliberately left NOT TESTED rather than inferred. Status is `insight`: the verification produced low new external evidence but materially sharpened two gain estimates.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` (85-180, 190-230, 288-300)
- `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` (1-75)
- `.skilled/skills/sk-code/shared/references/phase-detection.md` (40-75)
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` (80-110)
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md` (sections 3, 5, 6)
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-config.json`

## Assessment

- New information ratio: 0.4
- Questions addressed: verification of ranked rows 1 and 2 (six sub-claims)
- Questions answered: none of the five strategy key questions is newly answered; all are already ticked. This is a verification pass, not a new angle.

## Reflection

- **What worked and why:** opening the cited anchor plus the narrowest adjacent lines. The ALWAYS row, the map table and the envelope field each sit within a few lines of the cited tag, so one bounded read could test the quote and its context together. That is what surfaced both refinements.
- **What did not work and why:** nothing failed. The budget was spent almost entirely on reads, which left the Obsidian drift and stage-two routing claims untested; both need a different file than the row cites.
- **What I would do differently:** for a re-check row, open the cited anchor plus the artifact the row's remedy would change, not just the anchor. Rank 2's shape mismatch was visible only because `sk-code-skilled/SKILL.md` was read.

## Recommended Next Focus

Second-model re-check 2: ranks 3 and 4 in section 6 — the CI-surface naming row and the skipped-check reporting row. Test the CI row's claim that quality names neither the CI surface nor a `.github/` target, and the skipped-check row's exit-code and envelope claims, on current disk.
