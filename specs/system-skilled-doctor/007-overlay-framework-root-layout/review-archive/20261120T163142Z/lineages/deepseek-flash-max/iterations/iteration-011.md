# Review Iteration 011

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: none active; all three nodes are `answered` on all four dimensions
- Dimension: cross-reference (recovery pass)
- Recovery note: `convergence.cjs` returned `STUCK_RECOVERY` with `reasonDetail: stuckThresholdReached` and `stuckCount: 2`, because iterations 9 and 10 produced no findings. The approach changed from per-node dimension review to verifying the packet's own completion criteria read-only, which is a different granularity and a different evidence source.
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its completion-criteria clause: whether the six criteria the durable directive states actually hold on the tree as it stands.

## Files Reviewed

- `barter/ai-speckit/skilled/.skilled-overlays.json`
- `barter/ai-speckit/skilled/barter-overlays` (absence)
- `barter/ai-speckit/skilled/.skilled/skills/sk-git/sk-git-skilled/SKILL.md` (absence)
- `barter/ai-speckit/overlays/overlay-manifest.json` (`sk-git-root` entry)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4372-4405` (`managedPathTest`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5510-5518` (`folderEntryHolding`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5528-5570` (`strictWriteRefusal`)
- `.skilled/skills/system-skilled-doctor/SKILL.md:5`
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The strict-write refusal tells an operator to create a copy for a path the overlay removes, and `apply` never installs it** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556` -- `managedPathTest` treats a `skill-root` entry's `remove` list as managed, exactly as it treats its `replace` list (`:4385-4388`). `strictWriteRefusal` then takes the managed branch and, for a path that does not exist, prints `refuse: <key> is a new file inside overlay <id>; create it as <overlay>/<source>/<relative>, then run <engine> apply` (`:5552-5556`). For a path on the `remove` list that remedy cannot work: `apply` removes the destination and never installs the copy, because only the `replace` list hands a path to the overlay. The packet's own completion criterion exercises exactly this path — `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` — and the manifest's `sk-git-root` entry lists `sk-git-skilled` under `remove`, not `replace`, so the file does not exist in the tree at all.
   Finding class: `misleading-remedy`
   Scope proof: inside the declared review target's engine; names the exact branch, the exact manifest entry and the exact criterion that reaches it.
   Affected surface hints: `overlay-engine.cjs:4385-4388,5552-5556`; `overlay-manifest.json` `sk-git-root` entry; `references/overlays.md:51`; the packet's completion criterion for `--guard`.
   Case: an operator or agent writes `.skilled/skills/sk-git/sk-git-skilled/SKILL.md`, a path the `sk-git-root` overlay removes. The guard refuses with `create it as ../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md, then run ... apply`. The operator creates that copy and runs `apply`; `apply` removes `.skilled/skills/sk-git/sk-git-skilled` again and never installs the copy, because `sk-git-skilled` is on the entry's `remove` list. The operator is left with an orphaned overlay copy and the same refusal on the next write.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `barter/ai-speckit/skilled/.skilled-overlays.json`; `barter/ai-speckit/skilled/barter-overlays`; `.skilled/skills/system-skilled-doctor/SKILL.md:5`; `changelog/v1.2.0.0.md` | Four of the six completion criteria were verified read-only and all four hold. |
| `checklist_evidence` | partial | `overlay-manifest.json` `sk-git-root`; `overlay-engine.cjs:5552-5556` | The `--guard` criterion is satisfied in form (exit 1, names a source under `../overlays/framework/`) but the line it prints gives a remedy that cannot work, which is `R11-P2-001`. |

## Integration Evidence

- Criterion 2 holds: `sed -n 5p .skilled/skills/system-skilled-doctor/SKILL.md` prints `version: 1.2.0.0`, and `changelog/v1.2.0.0.md` names `apply --relayout` three times.
- Criterion 3 holds: `cat barter/ai-speckit/skilled/.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }` exactly, and `ls -d barter/ai-speckit/skilled/barter-overlays` exits 1 with `No such file or directory`.
- Criterion 5 holds in form: the guard target `.skilled/skills/sk-git/sk-git-skilled/SKILL.md` does not exist, so `strictWriteRefusal` takes the managed branch at `:5552` and returns a line naming `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`, which is a source under `../overlays/framework/`. The exit code is `EXIT_CONFLICT`, so the command exits 1.
- `managedPathTest` (`:4385-4388`) pushes both `replace` and `remove` relative paths into the managed prefixes for a `skill-root` entry, which is why a removed path reaches the managed branch at all.
- `folderEntryHolding` (`:5510-5518`) matches any `directory` or `skill-root` entry whose destination prefixes the key, so `sk-git-root` holds `.skilled/skills/sk-git-sk-git-skilled/SKILL.md` and supplies the `relative` the remedy prints.
- Criteria 1, 4 and 6 were not verified: the engine suite writes to OS temp directories, `status --json` and `--guard` were not executed, and `validate.sh --recursive --strict` is outside this lineage's write surface.

## Edge Cases

- **The `--guard` criterion passes while the line it prints is wrong.** Recorded because it is the reason this finding is a P2 rather than a criterion failure: the guard fails closed and names the right source, so the criterion's stated check succeeds. Only the remedy is unusable.
- **Three of the six criteria were not verified.** Criteria 1, 4 and 6 need the engine suite, `status --json` and `validate.sh`, all of which write outside this lineage. Recorded so the coverage claim is not read as a full criteria audit.
- **This is a recovery iteration, not a dimension iteration.** The frontier is drained, so the pass changed granularity rather than retrying a dimension. Recorded so the strategy's rotation notes stay accurate.
- **Tests were not re-run** for the containment reason recorded in iteration 1.

## Confirmed-Clean Surfaces

- The setting file holds exactly the value decision D4 requires, with no extra keys.
- The old `barter-overlays` folder is gone from the vendored tree, so no consumer can still read the pre-move location.
- The doctor skill's version line and its release entry agree, and the entry names the migration command.
- The guard refuses rather than allowing the write, so the strict-write contract fails closed even where its remedy is wrong.

## Ruled Out

- **The setting file names a folder other than `../overlays`.** Checked and ruled out: it prints `{ "overlayDir": "../overlays" }`.
- **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: `ls -d` exits 1.
- **The `--guard` criterion fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.
- **The doctor skill version and its changelog disagree.** Checked and ruled out: both are `1.2.0.0`.

## Next Focus

- Dimension: cross-reference
- Focus area: the six open findings grouped by root cause, and whether any pair contradicts another
- Reason: the frontier is drained and the recovery pass produced one finding; the next pass is the synthesis grouping the strategy names
- Rotation status: all three nodes answered on all four dimensions; recovery pass complete
- Blocked/productive carry-forward: productive -- verifying the packet's own criteria found a defect that ten dimension iterations missed, so the criteria are worth re-reading against the code in synthesis
- Required evidence: the findings registry, the seven open findings, and the strategy's exhausted-approach list

Review verdict: CONDITIONAL
