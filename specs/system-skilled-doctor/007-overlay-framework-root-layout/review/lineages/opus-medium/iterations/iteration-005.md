# Iteration 005 - Frontier node F-1-001: security

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-001 (engine), dimension security
- Review focus addressed: path safety and hook fail-open or fail-closed behavior. Verified the phase 006 outside-repository refusal at resolveOverlayDir (prior R1-P2-001 sibling variant) and overlayOutside on the context (prior R13-P2-001), then probed the engine's commit check under the environment git gives a hook.
- Sources: steer.md absent; strategy; dashboard frontier block (active node F-1-001, security).

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-526` (resolveOverlayDir, gitTopLevelOrNull, createContext)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4227-4231` (runGit), `.skilled/commands/doctor/scripts/overlay-engine.cjs:5820-5823` (gitTextOrNull), `.skilled/commands/doctor/scripts/overlay-engine.cjs:5524-5527` (isVendoredKey)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5862-5895` (stagedUnownedChanges)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6152-6159` (containedOverlayPath)
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:148-170` (Barter commit hook calls engine pre-commit with the hook's environment)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:624-639, 763-800`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/implementation-summary.md` Known Limitation 1
- Probes (temp folders under /tmp only): (a) a git repository with a pre-commit hook printing its environment, committed from the main checkout and from a linked worktree; (b) a copy of the strict-writes fixture (sibling overlay folder, git at the workspace, tree in a subfolder, an unowned vendored edit staged) running `overlay-engine.cjs pre-commit --root <tree>` with and without `GIT_DIR` set.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The engine's commit check allows every unowned vendored change when git runs it from a hook in a linked worktree** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:5864 -- stagedUnownedChanges asks `git rev-parse --show-toplevel` through runGit (`.skilled/commands/doctor/scripts/overlay-engine.cjs:4228`), which passes the caller's environment. Git exports `GIT_DIR` to hooks in a linked worktree (probe a: `GIT_DIR=.../.git/worktrees/wt`, and `git -C sub rev-parse --show-toplevel` printed `.../wt/sub`). With `GIT_DIR` set and no work tree, git reports the working folder as the top level, so for a tree in a subfolder the prefix becomes empty, the staged names keep their `skilled/` prefix, isVendoredKey (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5524`) matches none of them, and the function returns no changes. Probe b: the same staged unowned edit gives exit 1 "refuse: staged change to .skilled/skills/hub/fix.md ..." without `GIT_DIR` and exit 0 "allow" with it. Barter's commit hook calls the engine with the hook's environment (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164`), its tree is the `skilled/` subfolder, and `status` does not check unowned paths, so in a linked ai-speckit worktree the strict-writes commit gate passes an edit no overlay owns. The engine already strips these variables in gitTopLevelOrNull (`.skilled/commands/doctor/scripts/overlay-engine.cjs:493` comment: "A git hook exports GIT_DIR without GIT_WORK_TREE") but this probe does not use it. Phase 006 records the probe as Known Limitation 1 and predicts it "would likely ... refuse"; the observed effect is a silent allow, the opposite posture.
   - Finding class: fail-open-gate (pre-existing code, outcome mis-recorded by phase 006)
   - Scope proof: stagedUnownedChanges is the only caller of the hook-environment top-level probe on the commit path; gitTopLevelOrNull is used only by resolveOverlayDir.
   - Affected surface hints: overlay-engine.cjs stagedUnownedChanges and gitTextOrNull callers on the pre-commit path; Barter pre-commit hook; 006 implementation-summary Known Limitation 1; a strict-writes test running pre-commit with GIT_DIR set.
   - Case: in a linked worktree of ai-speckit, edit skilled/.skilled/skills/sk-code/SKILL.md (no overlay owns it), stage it and run git commit; the hook's pre-commit step prints allow and the commit lands.

```json
{"type":"fail-open-gate","claim":"Under a hook-exported GIT_DIR, overlay-engine pre-commit returns allow for a staged unowned vendored change in a tree below the git top level","evidenceRefs":[".skilled/commands/doctor/scripts/overlay-engine.cjs:5864",".skilled/commands/doctor/scripts/overlay-engine.cjs:4228",".skilled/commands/doctor/scripts/overlay-engine.cjs:5524","barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164"],"counterevidenceSought":"Checked whether the Barter hook unsets GIT_DIR (it does not, barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:148-170), whether git exports GIT_DIR in a linked worktree hook (it does, probe a), whether the main checkout is affected (it is not: GIT_DIR unset there, probe a), and reproduced end to end with the engine (probe b)","alternativeExplanation":"If Barter never commits from a linked worktree the path is unreachable in practice; sk-git's numbered worktrees make it reachable","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"Evidence that ai-speckit commits never run from a linked worktree, or that the hook path clears GIT_DIR before calling the engine"}
```

Skeptic/referee (compact): the skeptic case is that GIT_DIR is not exported for a normal checkout, which probe a confirms, so the main checkout is safe; the referee keeps P1 because the linked-worktree case is a supported workflow and the failure is a silent pass of a gate whose sibling bug (prior R2-P1-001) was itself rated P1.

### P2 Findings

1. **An overlayDir inside the tree that is a link to a folder outside the repository skips the outside-repository refusal** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:450 -- resolveOverlayDir runs the git-repository containment check only for a `../<name>` sibling (`.skilled/commands/doctor/scripts/overlay-engine.cjs:450-479`). An in-tree value such as `ov` returns at the final line without resolving links, and createContext computes overlayOutside lexically (`.skilled/commands/doctor/scripts/overlay-engine.cjs:524`), so a tree whose `ov` is a link to a folder outside the repository is accepted as an in-tree overlay folder. The reason the sibling case is refused, "its overlays and pin are never committed with the tree" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:466-468`), applies equally: git commits the link, not the overlays.
   - Finding class: containment-gap
   - Scope proof: the only canonicalPath call in resolveOverlayDir sits inside the sibling branch.
   - Affected surface hints: resolveOverlayDir final branch; createContext overlayOutside.
   - Case: skilled/.skilled-overlays.json names "ov", and skilled/ov is a link to ~/private-overlays; status and apply run against it, and a commit carries only the link.

## Prior-Finding Verification

- R1-P2-001 sibling variant (the sibling check accepted ../.git and other non-overlay siblings): FIXED. A sibling outside the tree must sit inside the tree's git top level and not under its `.git` (`.skilled/commands/doctor/scripts/overlay-engine.cjs:466-474`), and a dangling or looping link is refused (`.skilled/commands/doctor/scripts/overlay-engine.cjs:455-460`). Tests at strict-writes.test.cjs:786 cover the outside-repository refusal.
- R13-P2-001 (overlay-outside test recomputed in four command paths): FIXED. overlayOutside is set once in createContext (`.skilled/commands/doctor/scripts/overlay-engine.cjs:524`) and read at `.skilled/commands/doctor/scripts/overlay-engine.cjs:4631, 5286, 5883`; grep finds no other recomputation.

## Traceability Checks

- spec_code: partial. Phase 006's outside-repository refusal matches its claim; its Known Limitation 1 predicts a refusal where the code allows (P1 above).

## Integration Evidence

- Barter commit hook `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164` -> `overlay-engine.cjs pre-commit --root "$TREE_ROOT"` with the inherited hook environment.

## Edge Cases

- A tree in no git repository keeps any sibling folder by design (`.skilled/commands/doctor/scripts/overlay-engine.cjs:469-470`).
- trackedTreeKeys (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5971-5980`) uses the same hook-environment top-level probe. stagedUnownedChanges also returns no changes when `git diff --cached` fails (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5868`), another silent allow on a git error; folded into the P1's affected surfaces rather than raised separately.

## Confirmed-Clean Surfaces

- containedOverlayPath keeps relayout moves inside the overlay folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6152-6159` through sourceRelative).
- resolveOverlayDir refuses absolute, backslash and NUL values (`.skilled/commands/doctor/scripts/overlay-engine.cjs:440-441`).

## Ruled Out

- Main-checkout commit gate bypass: git exports no GIT_DIR there (probe a), and the engine refuses (probe b, plain run).

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-005 (Barter hooks: guard core and git-write gate fail-open posture)
- Reason: the P1 opens the question of what each Barter hook does when its lookup or the engine fails
- Rotation status: F-1-001 correctness and security done
- Required evidence: barter-overlay-guard-core.cjs and the OpenCode plugin error path; barter-git-write-gate.mjs aiSpeckitRoot null path

Review verdict: CONDITIONAL
