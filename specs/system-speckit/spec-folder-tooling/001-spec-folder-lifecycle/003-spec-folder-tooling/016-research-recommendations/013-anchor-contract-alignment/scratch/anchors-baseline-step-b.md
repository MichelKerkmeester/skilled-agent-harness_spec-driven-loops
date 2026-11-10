# ANCHORS_VALID corpus baseline, step B

Captured after the ANCHOR_NESTING_SEVERITY change, with the compiled validator. The method and the packet set match step A. The JSON sibling is `anchors-baseline-step-b.json` in this folder. Read the caveat under "Working-tree caveat" before using these counts.

## Run facts

- **Date:** 2026-10-08, run 21:47 to 22:03 UTC (16m 23s), 8 parallel workers.
- **Build:** `npm run build` in `.skilled/skills/system-spec-kit/runtime` exited 0. The compiled `dist/lib/validation/orchestrator.js` carries `const ANCHOR_NESTING_SEVERITY = 'error'`.
- **Git HEAD at run start:** `02cc1fb948`. Step A ran at `582656057922`. Two commits sit between the runs, `2ca689341b` and `02cc1fb948`. Together they change 2 files, with 16 insertions and 9 deletions.
- **Working tree:** not clean. 2,083 files under `specs/` and 18 files under the runtime directory differ from HEAD. The runtime set includes `lib/validation/orchestrator.ts`, which holds the error-severity change. Step A recorded no uncommitted validator changes, and that no longer holds.
- **Command, once per packet folder:** `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict --no-recursive --json`, through `xargs -P 8`.
- **Packet set:** the same 4,642 folders as step A, read from the same `folders.txt`. Nothing was added or removed.

## Packet count and status

**Packets: 4,642.** Each row's status is the status of its `ANCHORS_VALID` entry.

| ANCHORS_VALID status | Step B | Step A |
|---|---|---|
| pass | 4,613 | 4,612 |
| warn | 0 | 0 |
| error | 29 | 30 |

Validator exit codes: 0 for 4,346 packets and 2 for 296 packets. Step A had 4,347 and 295. One packet's exit code changed, see "Other exit code change" below.

## Comparison with step A

Step A's `anchors-baseline-step-a.md` reports 4,642 packets, pass 4,612, error 30. Step B reports 4,642 packets, pass 4,613, error 29. The net change is one packet moving from error to pass.

### By location class

| Class | Packets | Step B pass | Step B error | Step A pass | Step A error |
|---|---|---|---|---|---|
| live | 2,207 | 2,203 | 4 | 2,203 | 4 |
| z_archive | 2,238 | 2,228 | 10 | 2,227 | 11 |
| scratch | 191 | 176 | 15 | 176 | 15 |
| research | 5 | 5 | 0 | 5 | 0 |
| review | 1 | 1 | 0 | 1 | 0 |
| **total** | **4,642** | **4,613** | **29** | **4,612** | **30** |

## Changed packets

One packet changed `ANCHORS_VALID` status.

- `specs/system-speckit/z_archive/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation` (z_archive): **error to pass**.
  - Step A: "2 anchor integrity issue(s) found", with "spec.md: duplicate anchor 'requirements'" and "plan.md: duplicate anchor 'dependencies'".
  - Step B: "Anchors well formed in 5 file(s)". The current `spec.md` holds one `requirements` anchor pair, and the current `plan.md` holds one `dependencies` anchor pair.
  - Neither commit between the runs changes this folder, so the fix is an uncommitted working-tree edit. The validator did not cause it.

No other packet changed `ANCHORS_VALID` status.

### Other exit code change

Packet `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups` went from exit 0 to exit 2. Its `ANCHORS_VALID` status did not change. The `AC_CLOSURE` rule moved from info ("0/6 criteria settled; 6 still open while the packet is in progress") at step A to error ("packet claims completion with 1 unmet criterion(s)") in a probe run after step B. The cause is either an uncommitted edit to the packet or an uncommitted change to the `AC_CLOSURE` rule. This worker did not isolate which.

## Nesting findings

Packets carrying any "is opened inside", "is closed while" or "is closed before it is opened" finding: **0**. Per phrase: 0, 0 and 0.

This zero does not show that the check is silent. Two checks show that it still fires.

- The step-A detector found 624 `spec.md` files with the nested questions layout. Run against the current working-tree `spec.md` files, the same detector finds 0 of those 624 still nested.
- A probe ran the current validator on the committed (HEAD) version of `specs/agents/007-orchestrator-inline-authority/spec.md`, which wraps three anchors inside `questions`. The result was `ANCHORS_VALID` error, "3 anchor integrity issue(s) found", with "spec.md: anchor 'nfr' is opened inside 'questions'", "spec.md: anchor 'edge-cases' is opened inside 'questions'" and "spec.md: anchor 'complexity' is opened inside 'questions'".

The check fires on committed content. The zero therefore comes from the uncommitted spec edits in the working tree.

## Working-tree caveat

Step B measured the working tree, not HEAD. The working tree has 2,083 modified files under `specs/` and 18 under the runtime directory. The validator change and the spec edits are mixed in one run, so step B cannot isolate the effect of the validator change.

Inferred, not measured: committed nested files would move from pass to error under this validator. The probe above supports that for one file only.

To isolate the effect, rerun this method on committed HEAD content, for example from a clean checkout of HEAD in a separate directory. That was not done here, because it needs a clean tree or a separate checkout, and this worker does not check out, stash or reset.

## Error packets (29)

- 27 packets fail only with "`<doc>`: no anchors found": 15 scratch, 8 z_archive and 4 live. Most are demo, fixture, sandbox and planted copies.
- 2 packets fail with duplicate anchors:
  - `system-speckit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation`: duplicate `id` in `spec.md` and in `decision-record.md`.
  - `system-speckit/z_archive/013-memory-overhaul-and-agent-upgrade-release/001-readme-alignment`: duplicate `name` in `spec.md`.

## Top 20 message texts

Counts are occurrences across all 4,642 packets. Text is verbatim from the validator output.

| # | Count | Message |
|---|---|---|
| 1 | 2576 | Anchors well formed in 4 file(s) |
| 2 | 894 | Anchors well formed in 5 file(s) |
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
| 13 | 2 | Anchors well formed in 2 file(s) |
| 14 | 2 | Anchors well formed in 8 file(s) |
| 15 | 2 | decision-record.md: duplicate anchor 'id' |
| 16 | 1 | 2 anchor integrity issue(s) found |
| 17 | 1 | 4 anchor integrity issue(s) found |
| 18 | 1 | implementation-summary.md: no anchors found |
| 19 | 1 | spec.md: duplicate anchor 'id' |
| 20 | 1 | spec.md: duplicate anchor 'name' |

## Raw data and reproduction

Stored outside the repo in the session scratchpad, under `build/gates/013b/`:

- `build.log` and `build.rc`: the build output, exit 0.
- `<n>.out`, `<n>.err` and `<n>.rc` for each of the 4,642 folders, indexed as in `folders.txt`.
- `anchors-worker-b.sh`: the single-folder command.
- `aggregate-b.cjs`: writes the step-B JSON and `anchors-stats-b.json`, and compares with step A.
- `anchors-stats-b.json`: class counts, the changed packet, nesting counts and top messages.
- `probe-head/` and `probe-head.out`: the nesting probe on committed content. `probe-nested.out`, `probe-merged030.out` and `probe-003.out` are the other probes.
- `still-nested.txt`: empty, since none of the 624 step-A nested files still nest in the working tree.
- `run-start.txt` and `run-done.txt`: run timestamps and HEAD.

The JSON row shape is `{folder, status, messages}`, the same as step A. `status` is the `ANCHORS_VALID` row's status, and `messages` is the entry message followed by each detail.
