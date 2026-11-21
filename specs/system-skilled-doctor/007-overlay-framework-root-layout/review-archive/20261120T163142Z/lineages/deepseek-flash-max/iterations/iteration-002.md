# Review Iteration 002

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-005` at depth 1 of 3
- Dimension: correctness
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its hook clause: whether the Barter hooks learn both overlay locations correctly and fail open or fail closed in the right cases when the overlay folder is missing, moved or ambiguous.

## Files Reviewed

- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169`
- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:1-50`
- `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:1-155`
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs:147-220`
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:160-215`
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:1-120`
- `barter/ai-speckit/overlays/README.md:40,47,234`
- `barter/ai-speckit/overlays/framework/scripts/git-hooks/README.md:24,113`
- `barter/ai-speckit/overlays/overlay-manifest.json:716-720`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:53,54,64,67,108-115`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The commit gate silently skips every overlay check when the overlay folder is not found** -- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-92` -- `HAS_OVERLAYS` is set to 1 only when `$TREE_ROOT/../overlays/overlay-manifest.json` exists (`:89-92`). When it does not, the whole overlay block at `:95-116` is skipped and the hook falls through to `exit 0` at `:118` with no message on stdout or stderr. The phase 005 spec names this exact behavior as the defect the phase exists to fix: "The edit guard then fails open, the commit gate skips its overlay checks without a word, and the git-write gate fails closed" (`005-barter-move-overlays-out-of-tree/spec.md:64`). The phase taught the hook the new path but left the silent skip, so a consumer that renames or moves its overlay folder again loses the commit gate with no signal, and a staged vendored edit that no overlay owns reaches the commit. `overlays/README.md:47` documents the hook as running `status` then `pre-commit` and never mentions the skip.
   Finding class: `fail-open-without-signal`
   Scope proof: the finding is inside the declared review target's Barter overlay tree and names the exact branch that suppresses the gate.
   Affected surface hints: `pre-commit` overlay block; `overlays/README.md:47`; `overlay-manifest.json:716-720` (`barter-pre-commit` entry); the `SPECKIT_SKIP_OVERLAY_SYNC` bypass at `:95`.
   Case: an operator renames `ai-speckit/overlays` to `ai-speckit/overlay-sources`. Every later commit passes the hook with no output, and a staged edit to `.skilled/skills/sk-git/sk-git-skilled/SKILL.md` commits even though no overlay owns it.

```json
{
  "type": "claim",
  "claim": "The pre-commit hook treats a missing overlay folder as a reason to skip its overlay checks silently rather than to report the missing folder",
  "evidenceRefs": [
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-92",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:95-116",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:118",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:64"
  ],
  "counterevidenceSought": "Searched the hook for an else branch, a warning, or a nonzero exit on the missing-folder path: there is none. Searched overlays/README.md and framework/scripts/git-hooks/README.md for a documented skip: neither mentions it. Checked whether the spec accepts the skip: spec.md:64 lists it as the measured defect, and spec.md:32's handoff criterion says only that the hooks behave as before.",
  "alternativeExplanation": "The skip may be deliberate so a repository that vendors Skilled without overlays still commits. That is a real case, but it is distinguishable from a moved folder: the hook can test for the setting file at the tree root, which only an overlay consumer has, and report the missing folder only when the setting names one.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "Downgrade to P2 if the maintainers document the silent skip as the intended behavior for a tree with no overlay setting, and add a diagnostic for the case where the setting file exists but the folder it names does not."
}
```

### P2 Findings

1. **No test covers the pre-commit git hook's overlay lookup or its skip branch** -- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-116` -- the phase modified this hook's overlay path resolution (`005-barter-move-overlays-out-of-tree/spec.md:109`), yet `rg -l "HAS_OVERLAYS"` over `barter/ai-speckit` outside `specs/` and `repin-runs/` returns only the hook itself, and `find barter/ai-speckit/overlays -name "*pre-commit*"` returns only the hook. The spec's own hook-test row (`:111`) lists four test files, none of which exercises the hook. The other two hooks are covered: the guard core has `guard throws when no overlays folder holds a manifest` (`barter-overlay-guard-core.test.cjs:160`) and the plugin has `allows the edit when the overlay guard throws` (`barter-overlay-guard.test.cjs:121`).
   Finding class: `test-gap`
   Scope proof: the finding is inside the declared review target's Barter overlay tree and names the untested statements and the search that proves no test exists.
   Affected surface hints: `pre-commit` overlay block; `005-barter-move-overlays-out-of-tree/spec.md:111`; the `barter-pre-commit` manifest entry at `overlay-manifest.json:716-720`.
   Case: a later edit changes the `$TREE_ROOT/../overlays` probe to `$TREE_ROOT/overlays`. Nothing fails, and the commit gate stops running for every commit in the repository.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `005-barter-move-overlays-out-of-tree/spec.md:108-111`; `barter-overlay-guard-core.cjs:60-84`; `barter-git-write-gate.mjs:178-187`; `pre-commit:85-92` | All three hooks resolve the folder at the path the spec's file table names, and the two `aiSpeckitRoot`/`findBarterOverlays` resolvers agree on both the applied and the overlay-source copy. |
| `checklist_evidence` | partial | `005-barter-move-overlays-out-of-tree/tasks.md`; `005-barter-move-overlays-out-of-tree/spec.md:111` | The checked tasks carry observed results for the guard and the git-write gate, but the spec's hook-test row names no pre-commit test and none exists, so the commit gate's migration has no recorded evidence. |

## Integration Evidence

- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` and `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` are byte-identical (`diff` empty).
- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js` and `barter/ai-speckit/skilled/.opencode/plugins/barter-overlay-guard.js` are byte-identical.
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` and `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` are byte-identical.
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` and `barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit` are byte-identical.
- `barter/ai-speckit/overlays/overlay-manifest.json:716-720` installs the pre-commit copy as the `barter-pre-commit` file entry, so the overlay source is the live hook's source.

## Edge Cases

- **The guard core hardcodes the folder names `overlays` and `skilled`** (`barter-overlay-guard-core.cjs:47-48,60-84`) while the engine accepts any `../<name>` (decision D2). A consumer naming its folder differently gets a core that throws, which the plugin turns into a warning and an allowed edit. Recorded, not raised: the function is named `findBarterOverlays` and the file is Barter's own overlay, so the hardcoded names are Barter's contract, not the engine's.
- **The OpenCode plugin's relative import `../../.skilled/hooks/...` resolves only at the applied location**, not at the overlay source copy. Recorded, not raised: the plugin is a source that is applied into the tree, and its test copies it into a fixture tree before loading it (`barter-overlay-guard.test.cjs:44-58`).
- **Tests were not re-run** for the same containment reason recorded in iteration 1. Hook behavior is judged from the hook source and from the test source that covers it.

## Confirmed-Clean Surfaces

- `findBarterOverlays` (`barter-overlay-guard-core.cjs:60-84`) resolves both the applied copy and the overlay source copy: candidate 1 matches the applied copy at `<tree>/.skilled/hooks/...`, candidate 2 matches the overlay source copy at `<overlays>/framework/hooks/...`, and each candidate's `matchLayout` rejects the other's anchor because the engine or the manifest is missing there.
- `matchLayout` (`:52-58`) requires the folder to be named `overlays`, the tree to hold the engine, and the folder to hold the manifest, so a stray folder with a manifest elsewhere cannot steer the guard.
- `guard` (`:139-158`) skips a path outside the tree, refuses on a `refuse:` line, and throws on any other non-zero engine exit, so an engine error is never read as an allow.
- The plugin's `warnCoreFailure` (`barter-overlay-guard.js:19-23`) fails open by design and is covered by `allows the edit when the overlay guard throws` (`barter-overlay-guard.test.cjs:121-155`), which asserts exactly one stderr line and no throw.
- `aiSpeckitRoot` (`barter-git-write-gate.mjs:178-187`) walks five levels from the script's realpath, which lands on `<tree>` for the applied copy and on `<overlays>` for the overlay source copy; both then probe `<parent>/overlays/overlay-manifest.json` and return `<parent>`, so the two copies agree.
- The pre-commit hook's `$?` checks at `:101` and `:109` read the exit status of the command substitution, which bash preserves, so a failing engine is caught rather than ignored.

## Ruled Out

- **The guard's fail-open on a missing overlay folder is a defect.** Checked and ruled out: `barter-overlay-guard.js:19-23` documents the choice, `barter-overlay-guard.test.cjs:121-155` pins it, and `005-barter-move-overlays-out-of-tree/spec.md:64` records it as the pre-existing behavior the phase preserves.
- **The vendored and overlay copies of the four hook files disagree.** Checked and ruled out: all four `diff` runs are empty.
- **The pre-commit hook's repo-root branch mis-resolves the tree.** Checked and ruled out: at `ai-speckit/.opencode/scripts/git-hooks` the probe at `:85` finds `ai-speckit/overlays/overlay-manifest.json` and rewrites `TREE_ROOT` to `ai-speckit/skilled`, after which `:89` finds the manifest beside it.

## Next Focus

- Dimension: correctness
- Focus area: frontier node `F-1-007` -- the Barter re-pin parity against Skilled `063daaee2c1` and the consistency of the pin record, `sync-state.json` and the `v4.1.0.0` changelog
- Reason: the last seeded depth-1 node, and the operator focus names the re-pin and the pin record explicitly
- Rotation status: first pass on F-1-007; F-1-005 correctness is complete but the node stays open for its remaining dimensions
- Blocked/productive carry-forward: productive -- byte-comparing the overlay source against the vendored copy found no drift and is the same technique the parity check needs
- Required evidence: `overlay-manifest.json` `pin`, `sync-state.json` `pin`, `overlays/framework/changelog/skilled-coder/v4.1.0.0.md`, and a byte comparison of the engine-relevant files against Skilled at `063daaee2c1`

Review verdict: CONDITIONAL
