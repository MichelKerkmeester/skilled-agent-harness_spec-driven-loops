# ANCHORS_VALID corpus baseline, step A

Captured before any change to the ANCHORS_VALID check. The JSON sibling is `anchors-baseline-step-a.json` in this folder.

## Run facts

- **Date:** 2026-10-08 (run 16:43 to 17:04 CEST, 21m 17s, 8 parallel workers)
- **Git HEAD at run start:** `582656057922df40c61d09e9eb66f63619acdafb` (commit `5826560579`)
- **Git HEAD at run end:** `2ca689341b`. Another session committed at 16:44:09 during the run. That commit touched only the parent `goal.md` and `graph-metadata.json`. It touched no spec.md file and no validator source, so the baseline is not affected.
- **Validator sources:** `runtime/lib/validation/orchestrator.ts`, its `dist/` copy and `cli/spec/validate.sh` have no uncommitted working-tree changes. The baseline therefore measures the committed validator.
- **Command, once per packet folder:**
  `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict --no-recursive --json`
  Driven through `xargs -P 8`, one invocation per folder. Each folder is validated once, with `--no-recursive`, so phase children are validated as their own packets.
- **Packet enumeration:** `find specs -name spec.md`, then the containing folder. Each folder is listed once. There are no symlinked spec.md files, no `node_modules` or `.git` spec.md files, and no duplicate paths.

## Packet count and status

**Packets: 4,642.** Each row's status is the status of its `ANCHORS_VALID` entry.

| ANCHORS_VALID status | Packets |
|---|---|
| pass | 4,612 |
| error | 30 |

The validator exit code was 0 for 4,347 packets and 2 for 295. Exit 2 comes from other rules' failures. The `ANCHORS_VALID` row in those outputs is what this baseline records. 471 of the passes are phase parents accepted by the existing exemption ("Phase parent lean document set accepted").

### By location class

Each folder is assigned one class, in this priority: `z_archive`, then `scratch`, then `research`, then `review`, then `live`. A folder under `z_archive/` that also sits under `scratch/` counts as `z_archive`.

| Class | Packets | pass | error |
|---|---|---|---|
| live | 2,207 | 2,203 | 4 |
| z_archive | 2,238 | 2,227 | 11 |
| scratch | 191 | 176 | 15 |
| research | 5 | 5 | 0 |
| review | 1 | 1 | 0 |
| **total** | **4,642** | **4,612** | **30** |

### The 30 errors

- 27 packets fail only with "`<doc>`: no anchors found". Most are demo, fixture, sandbox and snapshot copies, for example the `playbook-run/*/scratch-snapshot` demo packets under `sk-doc/060`, the `system-deep-loop` benchmark fixtures under `z_archive`, the `system-speckit/027` review scopes and sandbox, and one `planted-packet` under scratch.
- 3 packets fail with duplicate anchors:
  - `system-speckit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation`: duplicate `id` in spec.md, and duplicate `id` twice in decision-record.md.
  - `system-speckit/z_archive/013-memory-overhaul-and-agent-upgrade-release/001-readme-alignment`: duplicate `name` in spec.md.
  - `system-speckit/z_archive/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation`: duplicate `requirements` in spec.md and duplicate `dependencies` in plan.md.

## Top 20 message texts

Each packet contributes its entry message and each detail finding as separate strings. Counts are occurrences across all 4,642 packets. Text is verbatim from the validator output.

| # | Count | Message |
|---|---|---|
| 1 | 2576 | Anchors well formed in 4 file(s) |
| 2 | 893 | Anchors well formed in 5 file(s) |
| 3 | 471 | Phase parent lean document set accepted |
| 4 | 340 | Anchors well formed in 6 file(s) |
| 5 | 262 | Anchors well formed in 3 file(s) |
| 6 | 45 | Anchors well formed in 7 file(s) |
| 7 | 27 | spec.md: no anchors found |
| 8 | 21 | Anchors well formed in 1 file(s) |
| 9 | 20 | 1 anchor integrity issue(s) found |
| 10 | 8 | plan.md: no anchors found |
| 11 | 7 | 3 anchor integrity issue(s) found |
| 12 | 7 | tasks.md: no anchors found |
| 13 | 2 | 2 anchor integrity issue(s) found |
| 14 | 2 | Anchors well formed in 2 file(s) |
| 15 | 2 | Anchors well formed in 8 file(s) |
| 16 | 2 | decision-record.md: duplicate anchor 'id' |
| 17 | 1 | 4 anchor integrity issue(s) found |
| 18 | 1 | implementation-summary.md: no anchors found |
| 19 | 1 | plan.md: duplicate anchor 'dependencies' |
| 20 | 1 | spec.md: duplicate anchor 'id' |

Folding numbers, quoted ids and the doc prefix together, the messages reduce to five shapes: "Anchors well formed in N file(s)" (4,141), "Phase parent lean document set accepted" (471), "<doc>: no anchors found" (43), "N anchor integrity issue(s) found" (30) and "<doc>: duplicate anchor '<id>'" (6).

## Nested questions layout

**Count: 624 spec.md files** carry the old nested questions layout.

- live: 406
- z_archive: 171
- scratch: 47
- research and review: 0

**How it was detected.** A Node pass over every spec.md under the same packet list. It follows the validator's own rules:

1. Fenced code blocks are dropped first, with the same fence rule as the validator's `stripFences`.
2. Anchor tags are read in document order using the validator's grammar. Openers are `<!-- ANCHOR:id -->` and closers are `<!-- /ANCHOR:id -->`, where `id` matches `[a-z0-9-]+` and whitespace is tolerated.
3. A stack tracks open anchors. A file counts as nested when an anchor opens while `questions` is still open on the stack, meaning the questions opener sits above and wraps another section.

Two related counts, for context:
- **Any non-`adr-NNN` child nesting: 636 files** (live 409, z_archive 180, scratch 47). The 12 files beyond the 624 nest without involving `questions`.
- **Unclosed questions opener: 0 files.**

Cross-check: the 013 spec's measured table gives 403 live, 164 z_archive and 47 scratch for "questions is the only cause". This detector gives 406, 171 and 47. The method differs (per spec.md, with no phase-parent or already-failing exclusion), so small differences are expected.

Two spec.md files produced detector anomalies that the current check does not report: one closer for an anchor that was never opened, and one out-of-order close. Neither is counted above.

## Scope decisions

- **The weekly sweep's enumeration was read, not reused as-is.** `cli/sweep/strict-pass-freshness.ts` skips `node_modules`, `.git`, `z_archive` and `scratch`. It also keeps only folders whose implementation-summary claims completion. Neither filter applied here. The instruction asked for z_archive to be included, and a baseline needs every packet. The spec.md-presence rule is the same. `node_modules` and `.git` hold no spec.md, so skipping them changes nothing.
- **research and review folders are included.** The validator's direct run does not skip them. Its recursive walk only descends into numbered phase folders, and a direct run validates whatever folder it is given. They are counted separately in the class table, so they can be dropped without rerunning.
- **Phase parents** pass through the existing exemption and are counted as passes.

## Raw data and reproduction

Stored outside the repo in the session scratchpad, under `build/gates/`:
- `anchors-raw/<n>.out`, `.err`, `.rc` for each of the 4,642 folders
- `folders.txt`, `indexed.txt`: the packet list
- `anchors-worker.sh`: the single-folder command
- `aggregate-anchors.cjs`: produces the JSON, the statistics and the nested-layout detector
- `anchors-stats.json`, `anchors-run.log`

The JSON row shape is `{folder, status, messages}`. `status` is the `ANCHORS_VALID` row's status. `messages` is `[entry.message, ...entry.details]`. A folder with unparseable output or no `ANCHORS_VALID` row would be recorded as `unparseable` or `no-entry`. There were none.
