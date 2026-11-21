# Review Iteration 008

## Dispatcher

- Target spec folder: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet root: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Frontier node: `F-1-004` at depth 1 of 3
- Dimension: maintainability
- Focus: Frontier node F-1-004: maintainability
- Executor: cli-mistral-vibe model=deepseek-flash (inline, no nested dispatch)
- Operator review focus: follow-up round after remediation. This iteration asks the maintainability half of the hook question: whether the remediated `pre-commit` reads as one check or three, and whether the prior engine maintainability findings stayed fixed.
- Rotation note: the reducer's next-focus projection named F-1-004 with the traceability dimension, which iteration 7 already covered. Maintainability was the only dimension the reducer still listed as remaining, so this iteration keeps the reducer's node and takes the uncovered dimension. The deviation is recorded as an edge case.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` | 1-172 | The three staged-list scans and their filters |
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js` | 1-50 | Session-directory resolution and the fail-open arm |
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js` | 1-72 | The same idiom in the sibling plugin |
| `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | 150-180 | How the test supplies the bridge the overlay source omits |
| `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` | 165-192 | The stub bridge and the fallback assertion |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | 3435-3445, 4624-4640 | The two prior maintainability findings, re-checked |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The three staged-list scans in `pre-commit` disagree on which change types they see** -- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45` -- The hook derives the staged list three times: `:45` for comment hygiene, `:71` for the card-sync surface, and `:132` for the vendored-path check. The first two pass `--diff-filter=ACM`; the third passes `-z` and no filter, so it sees deletions as well. The third scan is the one the R2-P1-001 remediation hardened, and the other two were left as they were. The result is that a staged deletion of a prompt-skill file never reaches the card-sync check, and the same list is fetched from git three times per commit.
   Finding class: maintainability
   Scope proof: read `pre-commit:1-172` end to end; the three `git -C "$TREE_ROOT" diff --cached` invocations are the only staged-list reads in the file, and their flags differ at `:45`, `:71` and `:132`.
   Affected surface hints: `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit`, `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs`
   Case: a commit deletes `.skilled/skills/sk-prompt/SKILL.md`. The card-sync scan at `:62-71` filters the deletion out, so `CARD_SURFACE_STAGED` stays 0 and the prompt-knowledge drift guard never runs, even though the card surface changed.

   ```json
   {
     "type": "claim",
     "claim": "Two of the three staged-list scans exclude deletions while the third includes them, so the card-sync check cannot see a staged deletion of a prompt-skill file.",
     "evidenceRefs": [
       "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45",
       "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:71",
       "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:132"
     ],
     "counterevidenceSought": "checked whether a deletion could reach the card check another way: the only producer of CARD_SURFACE_STAGED is the loop at :62-71, and it reads the filtered list. Checked whether the hygiene scan needs deletions: it does not, because a deleted file has no comments, so only the card scan is affected.",
     "alternativeExplanation": "the filter may be deliberate for the card check on the theory that a deletion cannot introduce drift. That reading does not explain why the vendored scan at :132 deliberately omits the filter, which shows the author knew the difference mattered.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "drop if a maintainer records that a deletion cannot cause prompt-knowledge drift and adds a test asserting the card check stays silent on a deletion"
   }
   ```

## Traceability Checks

| Check | Protocol | Result | Evidence |
|-------|----------|--------|----------|
| `checklist_evidence` | core | pass | Completion criterion 4 re-executed read-only: `status --json` reports `PASSED` with an empty `offLayout` |
| `spec_code` | core | pass | The prior maintainability findings stay fixed: the `layoutMoves` JSDoc at `overlay-engine.cjs:3435-3443` names both layout paths and the `.base` rule, and `writeBackup:4624-4628` keeps its `groups` map split |
| `integration_naming` | core | pass | The three scans are named by line, and the test surface that would cover the gap is named by path |

## Integration Evidence

- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:6` and `barter-git-write-gate.js:15` both import `./lib/v2-bridge.js`, and the overlay source folder carries no `lib/`. That is correct rather than a gap: `v2-bridge.js` is upstream content that lands beside the plugins in the applied tree (`skilled/.opencode/plugins/lib/v2-bridge.js`, 23130 bytes), and both tests supply it themselves (`barter-git-write-gate.test.cjs:176-178` writes a stub, `barter-overlay-guard.test.cjs:157-170` imports the applied copy).
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:132` is the only scan that reads NUL-separated names, which is what the R2-P1-001 remediation added; the other two still read newline-separated names.

## Edge Cases

- **Dimension rotation deviated from the reducer's projection.** The reducer named F-1-004 with traceability, which iteration 7 already covered, while maintainability was the only dimension still listed as remaining. This iteration kept the node and took the uncovered dimension so STOP is not blocked on a dimension with no iteration behind it. Recorded here rather than silently.
- **The duplicated session-directory idiom is not reported.** `barter-overlay-guard.js:26-28` and `barter-git-write-gate.js:34-36` carry the same three-line `ctx?.directory` fallback. It is real duplication, but three lines across two files with no behavioural divergence is cleanup rather than an active finding, so it is recorded here instead of raised.
- **The engine suites remain unrun.** `node --test` on the overlay-engine suites writes fixtures outside this lineage's write surface, so every assertion cited in this run was read from the suite source rather than executed.

## Confirmed-Clean Surfaces

- `overlay-engine.cjs:3435-3443` carries the `layoutMoves` JSDoc the prior generation asked for, and it names the `framework/` path, the `root/` path with its leading-dot rule, and the `.base` fragment rule.
- `overlay-engine.cjs:4624-4628` keeps `writeBackup` split, with the `groups` map built from `touched.copy` and `touched.delete` before the write loop, which is the readability fix the prior generation asked for.
- `pre-commit:132` reads NUL-separated names, so the vendored-path scan cannot be fooled by a quoted path.
- `pre-commit:116-119` carries the comment that explains why a missing manifest must not pass a vendored change silently, which is the reasoning the R2-P1-001 fix rests on.
- `barter-overlay-guard.js:9-22` documents why the guard fails open, and the comment names the boundary it protects rather than restating the code.

## Ruled Out

- **The overlay source is missing the bridge its plugins import.** Ruled out: `v2-bridge.js` is upstream content that lands beside the plugins in the applied tree, and both tests supply it.
- **The prior `layoutMoves` JSDoc finding regressed.** Ruled out by direct read at `:3435-3443`.
- **The prior `writeBackup` readability finding regressed.** Ruled out by direct read at `:4624-4628`.
- **The three scans are one scan written three times with identical flags.** Ruled out: the flags differ at `:45`, `:71` and `:132`, which is the finding rather than a refutation of it.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: all four canonical dimensions now have an iteration behind them, and the reducer lists no dimension as remaining
- Rotation status: F-1-002, F-1-004 and F-1-006 each carry at least two dimensions; eight P2 findings are open and none is P0 or P1
- Blocked/productive carry-forward: productive -- the hook read closed the last uncovered dimension and found one behavioural inconsistency between the three scans
- Required evidence: the synthesis must carry the two unrun completion criteria as limits, not passes
- Recovery note: convergence sits at 0.875 against a 0.10 threshold, so the run stops on dimension coverage rather than on the convergence score; the synthesis should say so plainly

Review verdict: PASS
