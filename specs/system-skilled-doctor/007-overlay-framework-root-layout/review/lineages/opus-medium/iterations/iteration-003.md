# Iteration 003 - Frontier node F-1-005: correctness

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-005 (Barter hygiene, read-only nested repo), dimension correctness
- Review focus addressed: verified the ai-speckit fix commit 5dd004f3faa (commit gate fails closed without a manifest, hooks read overlayDir, relayout-runs ignore, fixture rename) and swept both repositories for leftover barter-overlays references outside spec history and changelogs.
- Sources: steer.md absent; strategy; frontier block F-1-005; `git log 64cfee51628..e63bd038a5d` in barter/ai-speckit.

## Files Reviewed

- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:83-170` (overlay lookup, no-manifest refusal, engine status and pre-commit calls); deployed copy `barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit` is byte-identical (diff exit 0)
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:53-100` (overlaysRootFor, matchLayout, findBarterOverlays)
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177-200` (overlaysRootFor, aiSpeckitRoot)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:72-73` and resolveOverlayDir (engine setting reader)
- `barter/ai-speckit/.gitignore:68-69`, `barter/ai-speckit/overlays/README.md:8, 44-48, 234, 458-459`, `barter/ai-speckit/overlays/framework/repo-rules/barter-overlay-first.md:44-63`
- `barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs` (fixture diff in 5dd004f3faa)
- `git grep barter-overlays` in both repositories, excluding specs/ and changelogs

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A Skilled engine test still names its overlay folder barter-overlays** -- .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79 -- The setting test builds its custom overlay folder as `barter-overlays` and asserts on it at `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:91, 96, 99`. It is the last live reference to the retired Barter folder name in the framework repository outside spec history, and the vendored copy carries it into ai-speckit at `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79`. The test only needs a non-default name, so the name is a leftover, not a requirement.
   - Finding class: naming-leftover
   - Scope proof: `git grep barter-overlays` outside specs/, barter/ and changelogs returns only these four lines.
   - Affected surface hints: overlay-engine-fixes.test.cjs setting test; the vendored copy updates on the next re-pin.
   - Case: an operator greps for barter-overlays to confirm the rename landed and still finds a hit in the engine tests of both repositories.

2. **overlays/README.md does not document that the commit hook now refuses a vendored commit when no manifest is found** -- barter/ai-speckit/overlays/README.md:47 -- The README's commit-hook paragraph says only that the hook runs status and then pre-commit, and the overlay-first rule (`barter/ai-speckit/overlays/framework/repo-rules/barter-overlay-first.md:63`) describes only the engine's pre-commit check. Since 5dd004f3faa the hook also blocks with exit 1 when vendored paths are staged and the manifest the setting names is missing, and prints a visible skip line when none are (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-146`). Neither page names that refusal, the overlayDir lookup it depends on, or its bypass.
   - Finding class: doc-gap
   - Scope proof: grep of README.md for "manifest was found" or "skipped" in the hook paragraph returns nothing; lines 44-48 are the whole paragraph.
   - Affected surface hints: overlays/README.md commit hook paragraph; barter-overlay-first.md commit gate paragraph.
   - Case: overlayDir in skilled/.skilled-overlays.json is mistyped; the commit is refused with "no overlay manifest was found" and the README gives the operator no account of that refusal.

## Prior-Finding Verification

- R2-P1-001 (commit gate silently skips every check when the folder is not found): FIXED. `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-146` blocks when a vendored path is staged and prints a skip line otherwise; names are read NUL-separated (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:124, 132`), and the engine calls exit 1 on any non-zero engine exit (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156-168`).
- R14-P2-001 (hooks hard-code the overlays folder): FIXED. The guard core (`barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60`), the git-write gate (`barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177`) and the commit hook (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:93-107`) read overlayDir from .skilled-overlays.json.
- R3-P2-001 (relayout-runs not ignored): FIXED at `barter/ai-speckit/.gitignore:69`, documented at `barter/ai-speckit/overlays/README.md:459`.
- R3-P2-002 (barter-overlays fixture): FIXED in compiled-routing-byte-parity.test.cjs (now `overlays`).

## Traceability Checks

- spec_code: pass for the ai-speckit commit message claims against the code (fail closed, overlayDir read, ignore, rename).

## Integration Evidence

- Hook lookup and engine reader: the hooks fall back to `../overlays` (`barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:53`) when the setting is absent or unparsable, while the engine falls back to `skilled-overlays` (`overlay-engine.cjs:73`) when absent and errors when unparsable. For the commit gate the mismatch still fails closed, because the engine call that follows exits non-zero and the hook blocks. Recorded as an edge case, not a finding, because Barter always ships the setting.

## Edge Cases

- Guard core source copy (`barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:90`) assumes the tree sits beside the overlay folder as `skilled/`; a non-sibling overlayDir only works through the applied copy. The comment documents this.
- git-write gate returns `path.dirname(tree)` as the ai-speckit root regardless of where overlayDir points, which is still the repository root for any legal setting.

## Confirmed-Clean Surfaces

- No-manifest refusal, NUL-separated staged-name loop, engine exit handling, deployed hook parity, .gitignore entries.

## Ruled Out

- Changelog and spec hits for barter-overlays (`overlays/framework/changelog/skilled-coder/v4.1.0.0.md`, `specs/skilled-barter-overlays/`): history, out of scope by the node question.
- `skilled-barter-overlays` spec-track name in sk-git ROUTER.md and SKILL.md: a track name, not the folder.

## Next Focus

- Dimension: correctness
- Focus area: frontier node F-1-007 (remediation records traceable to code and test runs)
- Reason: last unvisited frontier node
- Rotation status: F-1-001, F-1-003, F-1-005 correctness done
- Required evidence: phases 006-008 spec, tasks, acceptance criteria, implementation summaries; prior R4-P2-001 and R6-P2-001

Review verdict: PASS
