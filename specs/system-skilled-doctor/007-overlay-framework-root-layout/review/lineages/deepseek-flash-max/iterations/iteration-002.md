# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `deepseek-flash-max`, cli-mistral-vibe, model `deepseek-flash`)
- Session: `fanout-deepseek-flash-max-1795192401900-xpt66n`, generation 1, lineageMode `new`
- Iteration: 2 of 24
- Dimension: security
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests`
- Review target: `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder)
- Operator review focus: this iteration addressed the focus's "path safety" and "hook fail-open or fail-closed behavior" clauses by auditing the engine's containment helpers and its two trust boundaries (`guard`, `pre-commit`) against the manifest as an input.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:165-215` (`isWithin`, `relativeKey`, `resolveRemoveRootPath`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-505` (`resolveOverlayDir`, `gitTopLevelOrNull`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2461-2500` (`replacedLinkState`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2510-2580` (`planLayoutLinks`, `applyLayoutLink`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2685-2790` (`isEnvName`, `isTokenName`, `exactManifestPaths`, `isProtectedReadPath`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2818-2890` (`assertSafeToPlan`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4177-4212` (`commandGuard`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5586-5630` (`strictWriteRefusal`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6121-6140` (`commandPreCommit`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6293-6310` (`relayoutLinkTargets`), `:6420-6443` (`rollbackRelayout`)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:398` (the only `layoutLinks` fixture)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`layoutLinks` paths escape the tree root unvalidated, and the relayout rollback now writes through them** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2514` -- `assertSafeToPlan` (`:2818-2890`) refuses a manifest whose `source`, `base`, `fragment`, `destination` or `remove-root` paths escape their roots, and its JSDoc states that invariant. `manifest.layoutLinks[].path` and `layoutLinks[].replaces.path` are never checked: `planLayoutLinks` joins them straight onto the root (`:2514`), `applyLayoutLink` calls `ensureSymlink` on that join (`:2577`), and `replacedLinkState` joins `replaced.path` the same way (`:2472`). The remediation added a second writer on the same unvalidated value: `rollbackRelayout` (`:6431`) calls `ensureSymlink(path.join(ctx.root, change.path), change.from)` for every retargeted link, and `ensureSymlink` (`:290-298`) unlinks whatever stands at that path before creating the link. A manifest naming `"path": "../../outside"` therefore makes `apply` and a failed `apply --relayout` create and delete links outside the tree.
   Finding class: path-safety hardening
   Scope proof: the value reaches the filesystem through two call sites in the reviewed file (`:2577`, `:6431`), and `assertSafeToPlan`'s field list at `:2836` omits `layoutLinks` entirely, so no earlier refusal covers it.
   Affected surface hints: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs`, `.skilled/skills/system-skilled-doctor/references/overlays.md`
   Case: an overlay manifest with `"layoutLinks": [{"path": "../../outside/link", "target": "../overlays/framework/x"}]`. `apply` creates `<tree>/../../outside/link`; a relayout that fails after retargeting it re-creates the same path during rollback.

## Traceability Checks

- `spec_code` -- pass. D2's refusal is enforced at the single setting reader (`:452-477`) and inherited by every command through `createContext` (`:519`). The `layoutLinks` gap above is a pre-existing manifest-validation hole, not a D2 violation: D2 constrains `overlayDir`, and `overlayDir` is checked.
- `checklist_evidence` -- partial. Still read-only in this iteration; the live criteria are scheduled for the traceability iteration.

## Integration Evidence

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4177-4212` (`commandGuard`) is the surface the `overlay-guard` hook calls. It canonicalizes both the candidate and each destination before comparing (`:4181-4199`), so a symlink inside the tree that points at a vendored path is still refused.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6121-6140` (`commandPreCommit`) is the surface the `pre-commit` hook calls. It fails open only when `strictWrites` is off, and it says so on stdout (`:6124`), so the skip is visible rather than silent.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5586-5630` (`strictWriteRefusal`) canonicalizes the root and the input path before comparing (`:5589-5590`), so a symlinked input cannot be used to reach a vendored path it does not lexically name.

## Edge Cases

- **`isWithin` is lexical.** `:165-168` compares `path.relative` output, so a symlinked parent is not resolved. Every caller that guards a write canonicalizes first (`:4181`, `:5589-5590`, `:186-210`), so the lexical helper is only used where both sides are already canonical or where the value is a manifest-relative path. Recorded as a pre-existing property, not raised.
- **`resolveOverlayDir` accepts a sibling when git cannot run.** `gitTopLevelOrNull` (`:497-505`) returns null on a non-zero exit, a spawn error or empty output, and the caller then keeps the folder (`:474`). A tree in no repository is the documented case; a broken git install is indistinguishable from it. Recorded, not raised: the fallback is the documented behaviour and refusing on an unreadable git would break every consumer without git.
- **`gitTopLevelOrNull` spawns git with no timeout.** `:501` passes no `timeout`, so a hung git blocks every command that builds a context for a sibling folder. Recorded as an edge case; the same pattern is used by `runGit` (`:4222`) throughout the engine, so it is a house style rather than a regression.
- **`remove` on a `directory` entry is honoured by `folderEntryHolding` but not by `planDirectoryOverlay`.** Carried forward from iteration 1; still a latent inconsistency outside the documented contract.

## Confirmed-Clean Surfaces

- `resolveRemoveRootPath` (`:185-215`) refuses a null byte, an absolute path, a backslash, a `..` segment, a path equal to the root, and a symlinked parent that resolves outside the tree, and it resolves each parent with `realpathSync.native` rather than trusting the lexical form.
- `isProtectedReadPath` (`:2755-2758`) refuses every `.env*` basename and every `*token*` basename unless the manifest names that exact absolute path, and `exactManifestPaths` (`:2704-2720`) builds that allow-list from entry fields only.
- `commandGuard`'s removal branch (`:4183-4193`) matches both lexically and canonically, so a removal path cannot be dodged by spelling it through a link.
- `strictWriteRefusal` returns null for a path outside the root (`:5590`), so it never refuses a write it does not own, and it skips generated and git-ignored paths before any ownership test.
- `resolveOverlayDir` refuses a null byte, a backslash, an absolute POSIX path, an absolute Windows path, `.`, `..`, any `../` deeper than one segment, a sibling carrying the tree's own name, a dangling link, and a target outside the git top level or inside `.git`.

## Ruled Out

- **The outside-repository refusal can be bypassed with a case variant or a link.** Ruled out: the sibling name is compared against `path.basename(path.resolve(root))` and the resolved target is compared with `canonicalPath`, so both spellings land on the same refusal.
- **A `GIT_DIR` exported by a hook defeats the repository check.** Ruled out: `gitTopLevelOrNull` deletes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` from the child environment (`:499-500`), and `overlay-engine-strict-writes.test.cjs:866-870` covers it.
- **`pre-commit` fails open silently.** Ruled out: the only fail-open branch prints `allow: strictWrites is off in the overlay manifest, so nothing was checked` (`:6124`).
- **A manifest can make the engine read a credential file through `protectedPaths`.** Ruled out: `protectedPathsFor` (`:2730-2748`) refuses a `.env` value and a value outside the entry, and `isProtectedReadPath` still refuses every token-named path the entry does not name exactly.
- **`overlayDir` can name the repository's own `.git`.** Ruled out: `:472` refuses a target whose first segment under the top level is `.git`, and `overlay-engine-strict-writes.test.cjs:820-830` covers it.

## Next Focus

- Dimension: traceability
- Frontier node: F-1-002 (engine path safety and remedies)
- Focus area: the packet's phase 001, 002 and 006 documents against the engine lines they cite, plus the live completion criteria
- Reason: correctness and security are covered for this node; the remaining question is whether the packet's claims and evidence pointers still describe the code after the remediation.
- Rotation status: correctness and security complete for F-1-002; traceability next on the same node.
- Blocked/productive carry-forward: the `layoutLinks` finding is productive for the traceability pass because the packet's path-safety claims should be checked against it.
- Required evidence: phase 001 `spec.md` path-safety requirements, phase 002 `spec.md` evidence pointers, phase 006 `implementation-summary.md`, and the live criteria in the packet goal.

Review verdict: PASS
