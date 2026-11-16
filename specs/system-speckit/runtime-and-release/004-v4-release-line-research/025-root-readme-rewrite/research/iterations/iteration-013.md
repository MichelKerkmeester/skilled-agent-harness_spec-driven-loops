# Iteration 13: Link and Switch Integrity of the Current README

## Focus

All five key questions are ticked and the strategy next-focus line is the placeholder `[All tracked questions are resolved]`, so this iteration applied the focus rule and took the lowest-coverage reader-facing surface instead of inventing a question.

That surface is the mechanical integrity of the document the rewrite must replace. Q4 audited *claims*; iteration 12 verified the four install anchors and the clone block. Nobody had checked whether the 1,773-line README's own navigation still works after the post-tag hook-library rename (`1c88ed62854`, `3fd4e4bdf1a`), which renamed hook folders literally. A rewrite that preserves anchors and link targets wholesale is only safe if those targets resolve today.

Three questions, in priority order:

1. Do all relative link targets in `README.md` exist on disk, and are they tracked so a clone receives them?
2. Do all same-file anchors resolve against the headings the rewrite would have to preserve?
3. Do the environment switches the README documents still exist in code after the `session relaunch` to `session handover` rename?

Deferred: per-runtime activation. `INSTALL-SKILLED.md` owns it, the README already delegates to it, and reading that guide in full is a blocked approach from iteration 12.

## Actions Taken

1. Read the config, state projection, strategy, findings registry and the iteration 12 narrative to fix the iteration number, the exhausted-approach list and the last recorded next focus.
2. Parsed `README.md` outside fenced code blocks: 91 inline and reference-style links, classified as 69 relative, 4 external and 18 same-file anchors.
3. Resolved every relative target with `fs.existsSync`, and every same-file anchor against the heading set.
4. Re-derived the heading slugs and printed the context line for each of the 7 apparent anchor misses.
5. Compared all 40 unique relative targets against `git ls-files`, treating a directory target as satisfied when any tracked file sits under its prefix.
6. Extracted all 24 distinct `SYSTEM_*` / `SKILLED_*` / runtime-prefixed environment tokens from `README.md` and counted the `.skilled` code files that reference each, excluding changelogs and markdown.
7. Searched `README.md` for the retired `SYSTEM_SESSION_RELAUNCH_*` family and for the four `42 rules` occurrences, then checked iteration 8's settled measurement of that count.

## Findings

### Verified — the README's navigation is intact

1. **Every relative link in `README.md` resolves on disk, and every target is tracked in the git index.** 69 relative links carry 40 unique targets: 0 missing paths and 0 untracked targets, including directory targets that are satisfied by tracked files beneath them. The post-tag hook-library rename therefore broke no README path. [SOURCE: README.md:1757] [INFERENCE: node audit over `README.md` combining `fs.existsSync` with `git ls-files` prefix matching]

2. **All 18 same-file anchors are valid; the 7 apparent misses were an artifact of a collapsing slugger.** GitHub maps each space to one hyphen and an emoji leaves an empty slot, so the §7 heading at `README.md:564` slugs to `#7--deep-loop` — exactly the form used at `README.md:857`, `:1015`, `:1019` and `:1297` — and the §6 and §13 headings at `README.md:260` and `:1455` slug to `#6--spec-kit` and `#13--code-mode-mcp`. `#customizing-for-your-stack` (`README.md:226`) resolves through an explicit HTML anchor at `README.md:1546`. The rewrite hazard is that element: drop the `<a id="customizing-for-your-stack"></a>` and line 226 becomes the one broken link in the file. [SOURCE: README.md:226] [SOURCE: README.md:564] [SOURCE: README.md:1546] [INFERENCE: heading set plus the slug rule that each space becomes a hyphen; the first-pass slugger collapsed whitespace, which produced the 7 false positives]

3. **All 24 distinct environment tokens the README names exist in `.skilled` code, and the renamed family is the current one.** No `SYSTEM_SESSION_RELAUNCH_*` token appears anywhere in `README.md`; the handover switches do, with `SYSTEM_SESSION_HANDOVER_ENABLED` in 19 code files, `SYSTEM_SESSION_HANDOVER_DISABLED` in 17 and `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED` in 6. The v4.0.2.1 rename did not leave a dead switch in the configuration section. [INFERENCE: token extraction from `README.md`, then per-token `rg -l` counts under `.skilled` excluding changelogs and markdown]

### P2 — terminology residue a rewrite should settle

4. **The README still calls the handover restart a "relaunch" in prose while the feature, folder and switches are `session-handover`.** Occurrences at `README.md:1058`, `:1108`, `:1130`, `:1227` and `:1346`; the release renamed the feature from session relaunch to session handover, so this is legacy wording rather than a factual error. The rewrite should pick one term and use it in both the plugin table and the configuration section. [SOURCE: README.md:1227]

### Reconfirmed, not new

5. **The "42 rules" claim is correct and must not be "corrected" by the rewrite.** The four occurrences at `README.md:153`, `:403`, `:410` and `:809` were settled in iteration 8 against the 42-entry validator registry. Recorded here only so the rewrite treats it as verified. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-008.md:20]

## Ruled Out

- **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6.
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question.
- **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences.
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS.

## Dead Ends

- **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation.

## Edge Cases

- Ambiguous input: none. The next-focus line is a placeholder, so the lowest-coverage rule applied; per-runtime activation was deferred as owned by another document.
- Contradictory evidence: none. Disk existence, the git index and the heading set agree with the README's links.
- Missing dependencies: none. Every tool and file the audit needed was present.
- Partial success: none. Every action produced usable evidence.

## Sources Consulted

- `README.md` (1,773 lines; link extraction across the whole file, plus `:153`, `:226`, `:260`, `:403`, `:410`, `:564`, `:809`, `:857`, `:1015`, `:1019`, `:1058`, `:1108`, `:1130`, `:1227`, `:1297`, `:1346`, `:1455`, `:1546`, `:1757`)
- `git ls-files` (tracked-path set for target verification)
- `.skilled/` (per-token code-file counts, excluding changelogs and markdown)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-008.md:20` (settled rule count)
- Commands: `node -e` link/anchor audit, `node -e` tracked-target comparison, `rg -o` env-token extraction, `rg -n` context reads

## Assessment

- New information ratio: 0.70
- Questions addressed: none open; last mechanical reader-facing surface
- Questions answered: none (all five were already ticked)

## Reflection

- What worked and why: measuring the artifact the rewrite must preserve, rather than re-reading its prose, produced a citable negative result in two calls. Pairing disk existence with the git index is what makes "a clone receives every target" a claim rather than an assumption; a disk-only check would have passed an untracked target silently.
- What did not work and why: the first slugger collapsed runs of whitespace, so seven valid anchors looked broken. The error came from guessing a renderer rule instead of reproducing it — the same shape as iteration 3's `workflowModes` probe and iteration 8's `rules` key, now on slug generation.
- What I would do differently: before declaring an anchor broken, re-derive the slug from the actual heading and the documented rule; the false-positive investigation is what surfaced the only real rewrite hazard, the HTML anchor at line 1546.

## Next Focus

None. This iteration closes the last mechanical surface the rewrite needs. Remaining items are decisions or a synthesis apply, not measurements: the root `repo-rules/` mirror, the `sk-design` README gap, and the stale `research/research.md` that still lists Q3 and Q4 as open and lacks §5E-§5I. Recommend the workflow owner apply the synthesis and converge the loop rather than dispatch another iteration.

## SCOPE VIOLATIONS

- `research/research.md` was not updated although `progressiveSynthesis` is true in config. This dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`, so the synthesis edit was not executed. The synthesis remains at 172 lines, lists Q3 and Q4 as open in its §5, and has no §5E-§5I. Findings 1-5 above are ready to paste.
