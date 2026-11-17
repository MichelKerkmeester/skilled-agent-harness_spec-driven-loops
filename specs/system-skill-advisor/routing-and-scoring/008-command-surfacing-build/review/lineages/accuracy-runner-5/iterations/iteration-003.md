# Review Iteration 003

## Dimension

Traceability: docs and code comments against the code they describe, plus the measurement-provenance claim the arena builder and the runner make. One security finding is recorded here because its whole content is a guard contract that the code applies in a narrower place than it says, which is a traceability question first.

## Dispatcher

Pass-five fan-out lineage `accuracy-runner-5` (area `accuracy-runner`). Sources read this iteration: `review/review-brief-5.txt`, `review/review-focus-5.txt`, `review/review-scope-5.txt`, and the lineage strategy's exhausted-approach list from iterations 1-2.

## Files Reviewed

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-40]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:189-327]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:600-620]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1256-1290]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1330-1420]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:20-120]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-124]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:127-152]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:35-130]

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The arena's build output comes from the working tree while its tracked tree comes from HEAD, and no step checks that the two agree** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:310-327 -- `buildArena` clones the source and checks out `headOf(source)`, so the tracked tree is exactly that commit. `copyPlan(source)` then walks the **working tree** and `copyPath` copies each ignored `dist`, `node_modules` and `.sqlite` path as it is on disk now. The header's claim that "the copied build is the same commit's build" (lines 22-24) is therefore only true for a clean worktree, and nothing reads `git status` before building. `stampBuildTree` sets the build's timestamps to the copy time, so the CLI's freshness guard cannot notice either. The run line records no commit at all, so the mismatch cannot be recovered later from the log.
   Finding class: traceability (provenance claim not enforced)
   Scope proof: both halves of the mismatch are in the scoped builder (`headOf`, `copyPlan`, `buildArena`), and the claim is the module header the pass-five brief asks to check against the code.
   Affected surface hints: `copyPlan`, `buildArena`, `stampBuildTree`, the `.git/skilled-behaviour-arena` marker, and every arm whose numbers are attributed to a commit.
   Case: an operator edits a source file, runs the repository build, then builds an arena from that worktree. The arena's `dist/` carries the uncommitted change while its tracked sources are HEAD, the stamped timestamps satisfy the CLI's freshness guard, and the arm measures code that the recorded commit does not contain.

2. **The containment guard runs before the first turn only, so a git remote added by any turn survives the restore and a later turn can push** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1264-1268 -- `runTurn` calls `liveArmRefusal(REPO_ROOT)` only when `isFirst` is true (`runTurn(job, options, exempt, index === 0)` at line 1403). The restore between turns is path-based over `git status` (`worktree-restore.mjs` `statusSnapshot`/`restorePath`), and `.git/config` is never a status path, so a remote a turn adds outlives both the restore and the marker check. The guard's own comment (lines 610-613) says "a live arm refuses to start when one is listed", which reads as an invariant over the arm rather than over its first turn.
   Finding class: security (containment invariant applied once)
   Scope proof: the guard call site, the restore mechanism and the comment are all in the two scoped files; the claim under test is the comment above `liveArmRefusal`.
   Affected surface hints: `runTurn`, `liveArmRefusal`, `restoreTurn`, `statusSnapshot`, and the arm's whole remaining turn list.
   Case: turn 1 of an arm runs `git remote add origin https://example.invalid/x.git`. The restore puts tracked paths back and leaves `.git/config` alone; turn 2 runs `git push origin HEAD` and reaches outside the arena, which is the one thing the arena exists to prevent.

```json
{
  "type": "claim",
  "claim": "The no-remote containment check is evaluated once for the arm, while the mechanism that could create a remote runs on every turn and is not reverted by the restore.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1264-1268",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1403",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:610-613",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:20-120"
  ],
  "counterevidenceSought": "Read the whole runTurn prelude and the caller's flag, checked whether any later step re-checks remotes, and read the restore to see whether git configuration is restored. Nothing re-checks and nothing restores .git/config.",
  "alternativeExplanation": "The check may be intentionally per-arm because a turn that could add a remote would already be a failure the operator sees. That reading does not survive the shared arena: one arm runs many turns, and only the first is gated.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if each turn is proven to start in a fresh arena or if the restore is shown to reset git configuration."
}
```

### P2 Findings

None new this iteration.

## Traceability Checks

- `spec_code`: the scope list's area assignment and the seven files were cross-checked again; the arena builder and runner claims are the ones this iteration measured. Pass.
- `checklist_evidence`: every claim in `routing-accuracy/README.md` sections 3 and 4 that names builder or runner behaviour was matched to a code line. The two claims below still hold, and the two above do not.
- `skill_agent`: the runner and scorer are consumed from `system-skill-advisor`'s runtime folder; no agent definition is in this area's scope. Pass.
- `feature_catalog_code`: `docs-metadata` owns the feature-catalog pages for this area, so only the two folder READMEs were cross-checked here. Partial by scope, not by defect.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs`: `statusSnapshot` reads `git status --porcelain -z` and `restorePath` checks out or deletes each path, which is why `.git/config` survives a turn. Exact surface read: the snapshot and restore pair.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` run-line assembly: the line holds runtime, row id, arm, run, locator, fixture, exit, changed paths, offer fields, delivery and restore state, and no commit, head or marker digest.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs` marker write: `.git/skilled-behaviour-arena` holds the head, and it stays in the arena, so it is not carried into a run log.

## Edge Cases

- A clean worktree makes the two provenance halves agree, so finding P1-1 is latent rather than always wrong; the repository ignores `dist/`, so the build is always a local artefact and never part of the commit.
- A turn that adds a remote and then removes it leaves no trace, which is why the guard cannot be reconstructed from the log either.
- `--dry-run` skips `liveArmRefusal` entirely, which is consistent with spawning nothing; the gap above is about later live turns, not about dry runs.

## Confirmed-Clean Surfaces

- `command-bridges/README.md` section 8's policy table matches `derivePolicy` step for step: `ask_first`, doctor `mutates`, `read-only`, `add-only` with a spec-folder write scope, then `start`.
- `identityViolations` implements both halves of the README's inventory claim: a command file with no declaration and a declaration with no command file are both reported.
- The README's attribution section (offered command, policy, `offeredAs`, `briefDelivered`) matches the fields the runner writes through `offerLineFields`, and the four-null / `offerError` fallbacks are implemented in `command-offer.mjs`.
- The README's `--pair` usage line matches `selectMode`: a pair without a summary is `--pair needs --summary`, and one arm name is `--pair needs two arm names`.
- The builder refuses an existing destination, a destination inside a repository, a missing source repository, a head mismatch and a failed clone, each with its own code.

## Ruled Out

- `--set chat` probe bucket and holdout rows: recorded in iteration 2; no holdout row carries that row type.
- The README's backfill field counts, `--brief-only` wording, `--row-id` scope and paired-block wording: already recorded by pass two and pass four in the packet registry, so not re-reported.
- The README structure table's file count: already recorded, and the table is generated prose rather than a behavioural claim.
- A dirty-worktree refusal mid-arm: `runTurn` takes `isFirst` from `index === 0` and the dirty check sits inside that branch, so the README's "before or during its first prompt" is accurate (evidence: `run-command-behaviour.mjs:1266-1281`).

## Next Focus

- Dimension: maintainability
- Focus area: the scorer's tally surface and the guards test -- duplicated label sources, dead fields and the test coverage the arena changes would need
- Reason: the last uncovered dimension, and the two P1 findings raise a test-coverage question the guards test should answer
- Rotation status: first maintainability pass
- Required evidence: file:line for each duplication or gap, and the test that would have caught a P1

Review verdict: CONDITIONAL
