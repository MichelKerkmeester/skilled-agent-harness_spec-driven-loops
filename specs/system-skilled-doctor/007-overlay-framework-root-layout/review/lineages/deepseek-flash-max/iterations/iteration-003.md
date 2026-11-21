# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `deepseek-flash-max`, cli-mistral-vibe, model `deepseek-flash`)
- Session: `fanout-deepseek-flash-max-1795192401900-xpt66n`, generation 1, lineageMode `new`
- Iteration: 3 of 24
- Dimension: correctness
- Frontier node: F-1-004 (depth 1 of 3), scope `barter/ai-speckit/overlays/root/opencode`, `barter/ai-speckit/overlays/framework/hooks`, `barter/ai-speckit/overlays/framework/skills`, `barter/ai-speckit/skilled/.opencode/scripts/git-hooks`, `barter/ai-speckit/skilled/.opencode/plugins/tests`, `barter/ai-speckit/skilled/.skilled/hooks`, `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks`
- Review target: `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder)
- Operator review focus: this iteration addressed the focus's "hook fail-open or fail-closed behavior" and "test strength" clauses by reading the three Barter hooks and their new tests, and by diffing each applied copy against its overlay source.

## Files Reviewed

- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:1-176`
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs:1-200`
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-190`
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:170-215`
- `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:145-170`
- `barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit` (applied copy, byte-diffed)
- `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` (applied copy, byte-diffed)
- `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` (applied copy, byte-diffed)
- `git -C barter/ai-speckit show 5dd004f3faa` (the remediation commit)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The commit gate can resolve the tree one level too deep and then report a missing engine instead of a missing manifest** -- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:88` -- the re-resolution block steps into `skilled/` when the tree has no setting file and either `skilled/.skilled-overlays.json` or `overlays/overlay-manifest.json` exists (`:86-90`). The second condition also fires when the hook already resolved to the tree itself, so a tree holding an in-tree `overlays/` folder and no setting file gets `TREE_ROOT=<tree>/skilled`. The overlay lookup then still finds `<tree>/overlays/overlay-manifest.json` through the default `../overlays` (`:104-118`), so `HAS_OVERLAYS` is 1, but `OVERLAY_ENGINE` is built from the wrong root (`:150`) and the hook exits 1 with `BLOCKED: the overlay engine is missing: <tree>/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` (`:151-153`). That branch prints no fix line, so the operator is told a file is missing that was never supposed to be there.
   Finding class: misleading-diagnostic
   Scope proof: the block is new in `5dd004f3faa` (the diff replaces the previous `../overlays` test at the same place), and the engine-missing branch at `:150-153` is the only consumer of the re-resolved root before the engine runs.
   Affected surface hints: `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit`, `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs`, `barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit`
   Case: a tree at `<tree>` with `<tree>/overlays/overlay-manifest.json` and no `<tree>/.skilled-overlays.json`, committed through `<tree>/.opencode/scripts/git-hooks/pre-commit`. The hook exits 1 naming `<tree>/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`, a path that cannot exist.

## Traceability Checks

- `spec_code` -- pass. D4's "`ai-speckit/skilled/.skilled-overlays.json` stays inside the vendored copy and names `../overlays`" holds: the setting file is at `skilled/.skilled-overlays.json` and the three hooks read it rather than hard-coding the folder.
- `checklist_evidence` -- partial. The packet's live criteria were not re-executed; the Barter-side criteria are scheduled for the F-1-006 iteration.

## Integration Evidence

- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` is the overlay source; `barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit` is the applied copy. `diff -q` reports them identical.
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` and `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` are identical.
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` and `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` are identical.
- `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:157-170` imports the applied plugin at `skilled/.opencode/plugins/barter-overlay-guard.js`, which resolves the vendored bridge, so the test exercises the real `definePlugin` export rather than the stub at `:64-65`.

## Edge Cases

- **Prior-generation findings re-verified, all fixed.**
  - `R2-P1-001` (commit gate fails closed without a manifest): fixed at `pre-commit:120-146`. A staged vendored path with no manifest exits 1 and names the manifest path it looked for; with nothing vendored staged it prints one visible skip line. The vendored scan reads NUL-separated names (`:127`), so a non-ASCII path cannot slip past, and `pre-commit.test.cjs:107-116` proves it with `café.md`.
  - `R2-P2-001--e1e7b8a500f3` (no hook test): fixed. `pre-commit.test.cjs` covers the default folder, a different `overlayDir`, the visible skip, the refusal, an unparsable setting, and the repository-root hook stepping into `skilled/`.
  - `R14-P2-001` (hooks hard-code the folder): fixed. All three read `.skilled-overlays.json` through their own `overlaysRootFor` (`pre-commit:104-118`, `barter-overlay-guard-core.cjs:60-72`, `barter-git-write-gate.mjs:177-187`).
  - `R12-P2-001` (plugin test stubs the bridge): fixed at `barter-overlay-guard.test.cjs:157-170`.
- **The edit guard fails open on an engine error.** `barter-overlay-guard-core.cjs:174-181` throws when the engine exits non-zero without a `refuse:` line, and the plugin turns that into `guard failed, allowing the edit` (`barter-overlay-guard.test.cjs:149`). A malformed setting therefore disables edit protection with one warning. This is the documented posture and the prior generation accepted it; recorded, not raised.
- **The commit gate's `$?` test after a command substitution.** `pre-commit:155-156` reads `$?` after `STATUS_OUT="$(...)"`. In bash the assignment carries the substitution's status, so the test is correct; recorded because it reads like a bug.
- **`overlaysRootFor` does not validate `overlayDir` in any of the three hooks.** Each falls back to `../overlays` on an unreadable setting and lets the engine reject a bad value. A folder outside the repository that happens to hold a manifest makes the hook run the engine, which then refuses; the outcome is fail-closed in every case. Recorded, not raised.

## Confirmed-Clean Surfaces

- `pre-commit:150-176` runs `status` and then `pre-commit` through the engine and blocks on either non-zero exit, so a drifted tree and an unowned staged change both stop the commit.
- `barter-overlay-guard-core.cjs:76-100` resolves the overlay folder from the core's own realpath with two candidates, and `matchLayout` (`:74-80`) accepts a candidate only when the tree's setting names that folder, the tree holds the engine, and the folder holds a manifest.
- `barter-overlay-guard-core.cjs:160-181` skips a path outside the tree, runs the engine with an absolute path and an explicit `--root`, and treats a non-zero exit without a `refuse:` line as an error rather than an allow.
- `barter-git-write-gate.mjs:189-200` walks five levels up from its own realpath to the tree and returns the repository root only when the tree's setting names a folder that holds a manifest.
- `runNode` (`barter-overlay-guard-core.cjs:141-155`) sets a 30-second timeout and rethrows a spawn error, so a hung engine blocks rather than allows.

## Ruled Out

- **The commit gate still skips silently when no manifest is found.** Ruled out: `pre-commit:120-146` refuses with exit 1 when a vendored path is staged and prints a skip line otherwise.
- **A non-ASCII vendored path slips past the staged scan.** Ruled out: the scan reads `git diff --cached --name-only -z` (`:127`) and `pre-commit.test.cjs:107-116` stages `café.md`.
- **The applied hook copies drifted from their overlay sources.** Ruled out: `diff -q` reports all three pairs identical.
- **The plugin test still stubs the bridge it is meant to guard.** Ruled out: `barter-overlay-guard.test.cjs:157-170` imports the applied plugin and asserts the real `definePlugin` shape.
- **The guard core can be steered by a stray manifest elsewhere.** Ruled out: `matchLayout` requires the tree's own setting to name the folder before it is accepted.

## Next Focus

- Dimension: security
- Frontier node: F-1-004 (Barter hooks)
- Focus area: the three hooks' trust boundaries, the `SPECKIT_SKIP_*` bypasses, and the plugin's fail-open path
- Reason: correctness is covered for this node; the same hooks are the enforcement surface for a consumer's vendored tree, so their bypass and failure modes need their own pass.
- Rotation status: correctness complete for F-1-004; security next on the same node.
- Blocked/productive carry-forward: the tree-root re-resolution finding is productive for the security pass because the same block decides which tree the engine judges.
- Required evidence: the skip variables, the plugin's error handling, and the gate's environment refusals.

Review verdict: PASS
