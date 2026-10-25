# Iteration 14: Second-model re-check 4 of 5 — ranks 2, 4 and 5 (extension floors, M-1 cache key, M-2 never-skip list)

## Focus

A second model family re-checking three DERIVED rows in `research/research.md` against the files as they stand now:

- **Rank 2 / I-8.** The floors are written in several places but not as one extension rule.
- **Rank 4 / RA-6 and RA-7.** The M-1 cache key hashes `git remote get-url origin` with no documented fallback, and the diff hash spans the whole repository.
- **Rank 5 / RA-9.** The M-2 never-skip list is fixed with no repository extension.

The job is not to restate the prior model's conclusions. Each verdict below is CONFIRMED, REFUTED or NOT TESTED, with the evidence that decided it. No reducer-owned file is touched.

## Actions Taken

1. Read `deep-research-config.json` for run identity (`lineage.sessionId`) and lifecycle mode.
2. Read `iterations/iteration-013.md` to refresh lineage and avoid re-testing settled claims (F1–F3 there are settled at file level).
3. Grepped `.skilled/skills/sk-code` for the rank anchors plus `extension`/`extensib`. The result hit its 80-match cap on unrelated `extension` tables (README, `mode-registry.json`, `stack-detection.md`) before reaching the review `SKILL.md` anchors. It is recorded as a failed action, not as evidence.
4. Read `sk-code-review/SKILL.md` lines 488–562 in full. That window contains §9.1 (M-1), §9.2 (M-2) and §9.3 (depth alias), which is where two of the three ranks live.

No network fetch. Nothing under `.skilled/` was modified. Nothing under `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/` was read.

## Findings

### F1 — Rank 4: CONFIRMED at the normative spec, with a scope caveat on the fallback's absence

The row's two citations both resolve and both say what it claims.

- OBSERVED. The signature hashes the whole base-to-HEAD diff with no pathspec. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:496] `diff_content_hash = sha256(git diff <base-ref>...HEAD)`
- OBSERVED. The cache identity is derived from the `origin` remote. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:503] `sha256(git remote get-url origin).slice(0, 12)`
- OBSERVED. §9.1 runs from line 490 to line 514 and ends on the cache write. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:514] `**Cache write:** After each full review completes, write the current signature + timestamp + HEAD SHA to the cache file.` No sentence between 494 and 514 names a substitute key when `origin` is absent.
- DERIVED. With no `origin`, `git remote get-url origin` has no URL to hash, and the spec assigns no substitute. The `<repo-ref>` is therefore undefined for that repository. This is a gap in the written spec, not a claim about runtime failure.
- DERIVED. Because line 496 carries no pathspec, every package in a monorepo contributes to one signature under one `<repo-ref>`, so an unrelated package change invalidates a package review.
- NOT TESTED. Whether another layer supplies a fallback — `references/pr-state-dedup.md` was not opened, and the live gate was not run. `research.md` already flags the live confirmation as open.
- NOT TESTED. The row's effort split (S for the fallback, M for pathspec scope), its risk rating and its `pr-state-dedup.md` hub-file claim.

**Verdict: CONFIRMED for both source tags and for the section-level absence of a documented fallback. The framework-wide absence is NOT TESTED.**

### F2 — Rank 5: CONFIRMED, and the dependency gap is concrete

- OBSERVED. The taxonomy is introduced as a closed instruction. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530] `**Conservative skip taxonomy — NEVER skip when diff touches:**`
- OBSERVED. The dependency-manifest row lists npm, Rust, Python and Ruby names only. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:537] `package.json`, `package-lock.json`, `Cargo.toml`, `Cargo.lock`, `pyproject.toml`, `poetry.lock`, `requirements.txt`, `*.lock`, `Gemfile`, `Gemfile.lock`
- OBSERVED. §9.2's only configuration knob is the line threshold. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:522] `export SK_CODE_REVIEW_MIN_CHANGED_LINES=50  # >0 enables; default 0 = disabled`. No key in §9.2 adds patterns to the taxonomy.
- DERIVED. `go.mod`, `build.gradle`, `pom.xml` and `*.csproj` match no row. `*.lock` catches lockfiles but not those manifests, so a Go, Gradle, Maven or .NET dependency change can be skipped when the diff is below the threshold and no other row matches.
- CONFIRMED. The never-skip list is fixed within §9.2 and has no repository extension point.
- NOT TESTED. Whether `references/pr-state-dedup.md` restates or extends the taxonomy, and the row's effort/risk/readiness columns.

**Verdict: CONFIRMED, and the specific gap is wider than "other names": four common manifest families are named nowhere in the table.**

### F3 — Rank 2: PARTIALLY CONFIRMED; the decisive half is NOT TESTED

The claim has two halves. Only the first has evidence from this iteration.

- OBSERVED. Floor language is restated inside §9.3, a subsection about routing depth rather than about floors. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:556] `it NEVER lowers the ALWAYS tier, the baseline security/correctness minimums, or the P0/P1/P2 contract`
- OBSERVED. The same subsection repeats the prohibition one paragraph later. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:558] `The depth alias is advisory routing only; it must never be read as permission to relax a floor.`
- DERIVED. A reader assembling the floor set must collect statements from at least the surface section, the never-approve rule, the shared standards file and §9.3. The scatter half of rank 2 is corroborated.
- NOT TESTED. The row's three cited anchors — `SKILL.md:108`, `SKILL.md:418`, `SKILL.md:426` — and `shared/references/universal/code-quality-standards.md:54` were not opened this iteration. The broad grep hit its 80-match cap before reaching them.
- NOT TESTED. The second half, "not as one extension rule", needs a full-file section read of the 562-line `SKILL.md`; this iteration read only 488–562. A consolidated rule elsewhere in the file would refute it, and nothing read here rules that out.
- NOT TESTED. The row's proposed hub file `sk-code-review/scripts/check-rule-copies.js`, its effort rating and its readiness.

**Verdict: the scatter is CONFIRMED; "no one extension rule" is NOT TESTED. Rank 2 cannot be marked CONFIRMED or REFUTED from this iteration's evidence.**

### F4 — Method note: a negative claim needs a section read, not a token grep

The failed grep is itself the lesson. Searching for `extension` across a hub full of extension tables returns true positives that say nothing about whether the review packet has an extension rule. Both negative claims that survived here — "no fallback" and "no extension key" — were established by reading a bounded section end to end and observing where it ends, not by a zero-match search. The same method is what rank 2 still needs.

## Ruled Out

- **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose.
- **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations.
- **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read.

## Dead Ends

- The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count.

## Edge Cases

- **Ambiguous input:** none. The dispatch named the three ranks and their test method.
- **Contradictory evidence:** none. The section text and the rows agree wherever both were read.
- **Missing dependencies:** none.
- **Partial success:** rank 2's four anchors were not opened. Status stays `complete` because two of the three assigned claims are confirmed at their normative source, and the third is reported as NOT TESTED rather than smoothed over.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/SKILL.md:490-514` (§9.1, full section)
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:516-548` (§9.2, full section)
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:550-558` (§9.3)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-config.json`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/iterations/iteration-013.md`

## Assessment

- New information ratio: 0.15
- Novelty justification: of three assigned claims, two are confirmed at their normative source with one concrete refinement (the four unnamed manifest families), and one is only partly tested because its anchors were not reached. Nothing in the packet changed.
- Questions addressed: rank 2 (partial), rank 4, rank 5
- Questions answered: rank 4 CONFIRMED; rank 5 CONFIRMED; rank 2 partially CONFIRMED, decisive half NOT TESTED

## Reflection

- **What worked and why:** reading §9 as one 74-line block rather than grepping it. The three ranks share a section boundary, and a section's end is what makes "no fallback" and "no extension key" observable claims rather than absences.
- **What did not work and why:** the broad grep. Adding `extension` to the alternation guaranteed a match cap full of false positives, and the anchors that mattered sat past the cap.
- **What I would do differently:** read 488–562 first, then spend one targeted call on rank 2's anchors (`SKILL.md:108`, `:418`, `:426`, `code-quality-standards.md:54`) instead of a broad grep.

## Questions Remaining

- **NOT TESTED (new, rank 2).** Do `SKILL.md:108`, `:418`, `:426` and `code-quality-standards.md:54` say what rank 2 claims, and does the 562-line file contain any consolidated extension rule? One full-file section read answers both.
- **NOT TESTED (narrowed, rank 4).** Is a no-origin fallback documented outside §9.1 — in `references/pr-state-dedup.md` or in runtime code? A read of that reference, or a live no-remote review, answers it.
- **NOT TESTED (narrowed, rank 5).** Does `references/pr-state-dedup.md` restate or extend the never-skip taxonomy?
- **Open (carried from iteration 13).** Rank 6's recommendation row — premise confirmed, row text, effort and hub-file list unread.
- **Open (carried from iterations 11 and 12).** Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7?
- **Open (carried from iteration 9).** Can a real user-authored surface mode route into review and exchange evidence or findings?
- **UNKNOWN (carried, narrowed).** Does the live runtime bridge any handoff informally? A live quality-then-review run would decide it.
- **State discrepancy (carried, untouched).** The dispatch context still lists Q2–Q9 as open while the strategy marks them answered. This iteration does not touch reducer-owned state.

## Recommended Next Focus

Iteration 15 is the last slot. In order:

1. **Rank 2's four anchors**, read directly, plus a section-list scan of `SKILL.md` to settle "no one extension rule". This is the only assigned claim from this slice still open.
2. **Rank 6's recommendation row**, the known coverage gap from iteration 13.
3. **Rank 7's consumer question**, if calls remain. It has been carried since iteration 11 without a test.
