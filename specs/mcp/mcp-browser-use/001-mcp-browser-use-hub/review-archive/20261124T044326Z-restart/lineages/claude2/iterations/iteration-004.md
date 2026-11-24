# Iteration 004 — Maintainability: nested sub-track support in system-spec-kit

## Dispatcher

- Lineage: claude2, sessionId `fanout-claude2-1795300286921-qfagh7`, iteration 4 of 5
- Dimension: maintainability
- Operator focus coverage: this pass reviewed the "nested sub-track support in system-spec-kit" commit (`b0b3c8d9bf1`), which lets the `mcp` track hold `mcp-browser-use` as a sub-track. It covered the reader refactor in `track-roots.mjs`, the depth rule as `create.sh`, `relocate.mjs`, `sweep-track-roots.mjs`, `validate.sh`, `archive.sh`, `orchestrator.ts`, `graph-metadata-parser.ts` and `repair-derived.cjs` each apply it, and the new `nested-subtrack.vitest.ts`. All diffs were taken against the merge base.
- Sources: `steer.md` absent; strategy Next Focus from iteration 3.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:16-330` (merge-base diff)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1040-1130,1445-1461`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:57,96,370-395,636-660,1774`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:49,140-165`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:190-240`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:196-226`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:222-240`
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:851` and its diff
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:320`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts:192-384` (test names)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The sub-track declaration rule and the two-level limit are written out independently in about eight places** -- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1045 -- `track-roots.mjs:41` exports `MAX_SUB_TRACK_DEPTH = 2`, and `relocate.mjs` and `sweep-track-roots.mjs` import it. `create.sh` still hardcodes `const maxSubTrackDepth = 2` (line 1045) and two bash `*/*/*/*` globs (lines 1123, 1445), and re-implements the declaration read (lstat, no symlink, JSON object, `level === 'sub-track'`, no `spec.md`) in `inspectLevel` (lines 1057-1077). The same predicate appears again in `validate.sh:199-217` (`has_subtrack_declaration`), `archive.sh:226`, `orchestrator.ts:225-235` (`hasSubTrackLevel`), and as separate `'sub-track'` constants in `graph-metadata-parser.ts:851`, `repair-derived.cjs:320` and `relocate.mjs:96`. The copies agree today, and the vitest suite exercises most entry points. But raising the limit or changing what counts as a declaration means editing every copy by hand, and the bash glob and JS constant in `create.sh` can drift from the exported one without any test catching it.
   - Finding class: maintainability / duplicated invariant
   - Scope proof: every listed line is in this branch's merge-base diff of the nested sub-track commit.
   - Affected surface hints: `create.sh` embedded node block and track refresh, `validate.sh`, `archive.sh`, `orchestrator.ts`, `graph-metadata-parser.ts`, `repair-derived.cjs`, `relocate.mjs`.
   - Case: a later change raises `MAX_SUB_TRACK_DEPTH` to 3 in `track-roots.mjs`; the reader, relocate and sweep accept a level-3 sub-track while `create.sh` still refuses it through its own constant and globs, and `validate.sh` still classifies only two levels.

2. **The working-tree and commit readers skip a symlinked declared folder below level 1 silently, while level 1 reports it** -- .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:131 -- At depth 1 a symlinked folder gets the diagnostic `symlinked folder skipped, not followed`. At depth 2 the working-tree reader `continue`s on `entry.isSymbolicLink()` with no diagnostic (line 131), and the commit reader drops a `120000` entry through `sub.type !== 'tree'` with no diagnostic (line 288). The two views agree with each other, so this is not a parity bug, but an operator who symlinks a level-2 sub-track gets no signal while the same mistake one level up is reported. The header comment explains that deeper levels only act on declared folders, but a symlink's declaration is never read, so the folder vanishes from the listing with no message.
   - Finding class: maintainability / diagnostic consistency
   - Scope proof: lines added in this branch's track-roots refactor.
   - Affected surface hints: `track-roots.mjs` `readWorkingTreeSubTracks` and `readCommitSubTracks`, `sweep-track-roots.mjs` output.
   - Case: an operator links `specs/mcp/mcp-browser-use/inner` to another folder; the sweep lists neither the sub-track nor a diagnostic, and the packets behind the link drop out of the track listing.

## Traceability Checks

- `spec_code` (pass for this surface): the track-roots header (lines 19-23) says two levels is the limit and that a declared folder inside a level-2 sub-track is reported. The reader emits `NESTED_TOO_DEEP` for that case in both views (lines 133 and 297). The test `lists a level-2 sub-track under its level-1 parent and refuses the third level` covers it.
- `feature_catalog_code`: not run this iteration (carried to iteration 5).

## Integration Evidence

- Consumers of `MAX_SUB_TRACK_DEPTH`: `relocate.mjs:57` (import), `relocate.mjs:380,429,650,1774`, `sweep-track-roots.mjs:49,152`. Non-consumers that re-encode it: `create.sh:1045,1081,1123,1445`.
- The test suite `nested-subtrack.vitest.ts` has 13 cases across reader, sweep, create, validate classification, graph parent derivation, repair, archive and relocate. It was not run here, because running it would write outside the lineage directory.

## Edge Cases

- `relocate.mjs:650` and `sweep-track-roots.mjs:152` exclude level-2 sub-tracks from the mixed-layout check on purpose (comment at sweep lines 150-151: a level-2 sub-track holds packets alone). This is consistent, not a finding.
- Large generated fixtures (`trigger-index.json`, retrieval fixtures) dominate the diff size but are regenerated data, so they were not reviewed line by line.

## Confirmed-Clean Surfaces

- The `track-roots.mjs` refactor keeps the exact level-1 behaviour: the old inline loop and the new `readWorkingTreeSubTracks(…, 1, …)` path produce the same diagnostics in the same order, and the stranded-numbered report runs only when a container holds a sub-track.
- `graph-metadata-parser.ts` requires every sub-track on the way to declare itself before deriving a level-2 parent.
- `create.sh` walks the levels in order and reports the first undeclared folder by its own id.

## Ruled Out

- Working-tree vs commit parity drift for depth > 2: both emit `NESTED_TOO_DEEP` only for declared folders.
- Mixed-track check gap at level 2: intentional and documented.

## Next Focus

- Dimension: correctness (second pass, cross-reference)
- Focus area: stage-one advisor routing changes (`system-skill-advisor` lexical/explicit lanes, `fusion.ts`, `skill_advisor.py`, `skill-graph.json`, fixtures) plus the `feature_catalog_code` overlay on `mcp-chrome-devtools/feature-catalog` and `mcp-tooling/feature-catalog`.
- Reason: all four dimensions now covered once; stage one of "advisor routing at both stages" and the feature-catalog overlay are still unreviewed.
- Rotation status: 4/4 dimensions covered.
- Verdict basis: C2-I1-P1-001 remains active.

Review verdict: CONDITIONAL
