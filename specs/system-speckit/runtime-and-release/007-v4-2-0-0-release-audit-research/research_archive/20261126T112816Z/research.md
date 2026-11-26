# v4.2.0.0 Logic and Features Audit: Research Synthesis

Topic: v4.2.0.0 logic and features. The run looks for remaining bugs, docs that drifted from the code and bad UX in what shipped since v4.1.0.0. Findings count only code changed in `v4.1.0.0..v4.2.0.0`, and older issues are listed separately as pre-existing. This is generation 2 of the packet's research. Generation 1, the changelog audit, is archived at `research_archive/20261125T162358Z/`, and its 16 confirmed findings are excluded here.

## 1. Verdict

There is no P0 or P1 in what v4.2.0.0 shipped. Ten native iterations confirmed 3 P2 and 14 P3 defects, plus one by-design behavior and one note without severity. The P2s are in the fan-out runner's signal stop on win32 and in the Claude Stop decision auto-record. Most P3s follow one pattern: a new step reports to a stream the operator does not watch, or it treats "the file exists" as "the step worked".

## 2. Findings Ranked by Severity

The table comes from the iteration 10 closing summary, which folds re-grade rows into their parent findings. Each row's evidence and reproduction are in the iteration log below and in `iterations/iteration-NNN.md`.

| Rank | Severity | Id | Finding | file:line | Commit |
|---|---|---|---|---|---|
| 1 | P2 | f-iter004-001 (+009-006) | A fan-out runner stopped by a signal leaves lineages that have no `process_start` running. That is always the case on win32. | fanout-run.cjs:1037, :1279, :1408, :1419 | `a20a1d96a05` |
| 2 | P2 | f-iter006-001 | The Stop auto-record misreads a packet path that ends at a JSON `\n` escape, so a phase child resolves wrongly. | session-stop.ts:49, :52, :831 | `d57563b175a` |
| 3 | P2 (inferred) | f-iter006-002 | An unlocked read-rebuild-rename of decision-record.md races a concurrent save, and the lost rows are still marked consumed. | decision-record-writer.ts:787, :819; session-stop.ts:216 | `d57563b175a` |
| 4 | P3 (re-graded to logic defect) | f-iter008-003 (+009-004) | The merged frontier counts an untrusted lineage's nodes. The final synthesis reports them, and a confirm-mode B re-entry gates on them. | fanout-merge.cjs:786, :803, :1887; convergence.cjs:1665; deep-research.yaml:1103, :1995, :2045; fanout-merge.md:50 | `965b88ca150` |
| 5 | P3 | f-iter002-001 | A destination that changes shape and letter case at once is refused as unowned. The case-fold fix was incomplete. | overlay-engine.cjs:2511, :2575 | `5a6f2e211c3` |
| 6 | P3 | f-iter002-002 | A layout link can delete a distinct, byte-identical user file because the `isSameFile` guard is missing. | overlay-engine.cjs:3382 (cf. :2622) | `8ab99ee8106` |
| 7 | P3 | f-iter006-003 | A failed consumed append lets the next Stop overwrite an edited row. | decision-record-writer.ts:323 | `d57563b175a` |
| 8 | P3 | f-iter003-001 | The `--extend` re-stop warning goes silent once the inbox has ever held a line, and it never fires on expansive runs. | workflow-steps.cjs:195, :206 | `2c80c64f391` |
| 9 | P3 | f-iter005-001 | In degraded mode, a refused `/deep:*` command is printed as the reader's typed choice. | skill_advisor.py:4624; skill-advisor-cli.ts:1563 | `73d98332fff` + `777feef2920` |
| 10 | P3 (cause inferred) | f-iter005-002 | The native hub leads a refused single-pass review, 0.912 against 0.877. | fusion.ts:1322 | `527fc5f9d43` (inferred) |
| 11 | P3 | f-iter007-001 (+009-005) | The operator never sees the Stop auto-record outcome, which reaches stderr only on an exit-0 hook. | session-stop.ts:217, :221, :769, :903 | `d57563b175a` |
| 12 | P3 | f-iter007-002 | A refused level-2 `create.sh` sub-track gets no remedy. | create.sh:1458, :1461 | `b0b3c8d9bf1` |
| 13 | P3 | f-iter007-003 | The non-Claude goal hop warning can be false and names no next step. | skilled-loop:486 | `12fe3abc66b` |
| 14 | P3 | f-iter008-001 (+009-001) | Provisioning can report a tree ready when skill-graph.sqlite exists but is unusable. P2 is ruled out because the advisor self-heals. | worktree-naming.sh:801, :809 | `957f47570f3` |
| 15 | P3 | f-iter008-002 (+009-002) | A failed skill-graph scan prints no reason. The exit is non-zero, but the output goes to `/dev/null`. | worktree-naming.sh:806 | `957f47570f3` |
| 16 | P3 | f-iter001-001 | The repin rollback's list-runs remedy cannot be pasted as printed. | overlay-engine.cjs:7404 | `59d26c89f38` |
| 17 | P3 | f-iter001-002 | A finished relayout's backup has no restore command. | overlay-engine.cjs:8879 | `3aab896957e` |
| 18 | By design | f-iter005-003 | A typed command beside a stuck run is offered as a rerun, not as `/doctor:deep-loop`. | deep-loop-offer-cases.json:123 | not attributed |
| 19 | No severity | f-iter009-003 | Frontier ids at depth 2 and below can collide across lineages, with no consequence shown. | frontier-admit.cjs:280, :831 | not attributed |

Totals: 3 P2 (one inferred), 14 P3, 1 by design and 1 without severity.

## 3. Evidence Strength

- **Reproduced:** f-iter002-001, f-iter002-002, f-iter003-001, f-iter005-001 (Python step), f-iter006-001 (via the exported `detectSpecFolder`), f-iter007-002, f-iter008-001 and f-iter008-002.
- **Confirmed by test or runtime:** the advisor rebuilds an empty or corrupt `skill-graph.sqlite` (iteration 9), which keeps f-iter008-001 at P3. `fanout-stop-identity.vitest.ts` passed 7 of 7 and pins the refused row that win32 writes (iteration 10).
- **Traced from code, not run:** f-iter004-001 on win32, f-iter006-002 (the unlocked write race), f-iter007-001, f-iter007-003 and the confirm-mode B path of f-iter008-003.
- The orchestrator re-read the code behind the three P2s before synthesis: `SPEC_FOLDER_PATH_RE` at `session-stop.ts:49` keeps a literal `\n`, `processStartOf` at `fanout-run.cjs:1279` returns `''` on win32, `lineageIdentityRefusal` refuses that row as `no_recorded_identity`, and `decision-record-writer.ts:787`-`:819` reads, rebuilds and writes with no lock.

## 4. Pre-existing Observations (outside the window)

- Overlay engine: stray words such as `onto` parse as `--to` (`overlay-engine.cjs:8975`), `--json` callers get plain text on a usage error (`:9030`), `repin --rollback` has no staleness check (`:7323`) and the relayout's last line has no root prefix (`:8939`).
- `run_extended` sets `lineageId` to `parentSessionId` (`workflow-steps.cjs:166`). This predates the window and was accepted by the gateway on a restarted copy.
- The pre-synthesis gate's B option on a fan-out run returns to a main loop that `phase_init` never set up (`deep-research.yaml:1995`). Inferred, not run.

## 5. Eliminated Alternatives

- The json-entry writers: each one keeps the file's indent unit and line ending (iteration 2).
- Rollback writing outside the tree through a link, and relayout's backup skipping files silently (iteration 1).
- `frontier_drained`, the `--extend-minutes` arithmetic and the gateway's identity minting all match their docs (iteration 3).
- The research trust merge key, repeated-signal re-entry and the exited-leader UTC split in fan-out (iteration 4).
- Count-based, "iteratively" and past-run asks, and "loop" as a code word, all route as documented (iteration 5).
- Duplicate decision rows: the writer reuses an id per source key (iteration 6).
- Two-level sub-tracks in the depth guard, `validate.sh` and `create.sh` (iteration 6).
- The `create.sh` refusal for four or more segments, and the fan-out refusal for a still-running lineage, give exact messages (iteration 7).
- `--extend`, the `step_frontier_*` steps, the reducer and the stuck-close gate as readers of the merged frontier (iteration 10).

## 6. Divergence Map

- Saturated directions: none. The run used default convergence mode, so no divergent pivot ran.
- Pivots taken: 0. Pivot failures: 0. Audited overrides: 0.
- Remaining frontier: none recorded. The run used default depth mode, so no frontier nodes exist.

## 7. Open Questions

- Can a fan-out lineage dealt zero frontier nodes seed its own `F-1-*` ids, so a collision hides a missing node? Not verified.
- Does the confirm-mode B re-entry on a fan-out run work at all, given that `phase_init` never ran there? Not run.
- Whether Claude Code shows a Stop hook's stderr in verbose mode was not checked. The hooks reference says stderr from an exit-0 hook goes to the debug log.
- f-iter005-002's cause at `fusion.ts:1322` is inferred, not confirmed.

## 8. Recommended Remediation Order

1. The three P2s: give win32 lineages a recorded identity the stop can trust, or signal them by pid when no start time was ever recordable; strip JSON escapes before `SPEC_FOLDER_PATH_RE` matches; and lock or compare-and-swap the decision-record write before marking keys consumed.
2. Gate `mergeResearchFrontier` on lineage trust or label untrusted nodes.
3. The operator UX P3s: show the Stop auto-record outcome in chat, print the skill-graph scan's reason, and fix the two overlay remedies that cannot be followed as printed.

## 9. References

- Iteration narratives: `iterations/iteration-001.md` through `iterations/iteration-010.md`.
- Delta streams: `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`.
- Resource map: `resource-map.md` in this folder, emitted from the deltas.
- Claude Code hooks reference: https://code.claude.com/docs/en/hooks (iteration 9).

## 10. Iteration Log

### Overlay engine and doctor overlay commands (iteration 1)

#### Findings in the window
- **P3: the repin rollback's list-runs remedy cannot be pasted as printed.** `rollbackRun` ends the command with `from <root>` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7404]. `parseArguments` refuses those two unknown words, so the pasted line prints usage and exits 2. Every other remedy uses the `Next: from <root>: <command>` form built by `nextEngine` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:92].
- **P3: a finished relayout's backup has no restore command.** The run prints only `backup <label>` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8879]. No command word undoes a relayout [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:123], and `repin --rollback` reads only `repin-runs/` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7409].

#### Pre-existing (older than v4.1.0.0, out of scope by NON-GOALS)
- Words such as `onto` and `auto` parse as `--to` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975]. Reproduced.
- `--json` callers get plain text for a usage error or a bad root [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. Reproduced.
- `repin --rollback` has no check that the live tree still holds what the run wrote [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. Inference, not executed.
- The relayout's final `run ... apply` line lacks the root prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939].

#### Open
- The json-entry operation set and the case-folding path checks are not yet reviewed against their in-window diffs.

### Overlay engine, diff-driven sibling check (iteration 2)

#### Findings in the window
- **P3: a destination that changes shape and letter case at once is refused as unowned.** `5a6f2e211c3` folded only the sub-folder walk. The top-level shape checks still match the state by the manifest spelling [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2511] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2575]. Reproduced on a case-folding volume, for file `Tool` to folder `tool` and for the reverse. Same-case controls pass. The refusal text is false, and its remedy moves the engine's own output aside.
- **P3: a layout link can delete a distinct, byte-identical user file.** The recorded-spelling fallback `8ab99ee8106` added has no `isSameFile` guard [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3382], unlike the one `aba8f76e97f` added to the directory plan [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2622]. Because the engine folds `ı` to `i`, a link at `sib` replaced the user's `sib` while the state recorded `sıb`. Reproduced.

#### Q1 verdict
Q1 is answered: the overlay engine carries only low-severity logic bugs in the window. Two letter-case fixes were incomplete, and iteration 1 found two rollback and relayout UX defects. The json-entry layout fix chain is clean at every sibling site: every value writer uses the document's unit and line ending, and both restore paths deliberately write back upstream's bytes. No P0, P1 or P2 was found.

#### Open
- Q2, the deep-loop runtime, is next. One overlay lead is still unverified: `engineLinkText` folds case with no same-file check [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2405].

### Deep-loop runtime: --extend, frontier_drained and the append gateway (iteration 3)

#### Findings in the window
- **P3: the research `--extend` re-stop warning goes silent once the inbox has ever held a line.** `extendResearch` counts every non-empty line of `research/inbox.jsonl` as pending [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:195], and warns only at zero [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:206]. The reducer only reads the inbox and never drains a consumed line [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3454]. So an answered question still silences the warning, and an expansive run, whose inbox always holds frontier rows [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:800], never gets it. Reproduced. Introduced by `2c80c64f391`.

#### Checked clean
- `frontier_drained` matches loop-protocol.md and convergence.md [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. The `--extend-minutes` arithmetic matches the flag table [SOURCE: .skilled/commands/deep/research.md:119]. The gateway's legacy-branch identity minting shows no defect.

#### Open
- Q2 stays open: `fanout-run.cjs` and `fanout-merge.cjs` are not yet read. Lead: `run_extended` scopes `lineageId` to `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166].

### Deep-loop runtime: fan-out trust and stop paths (iteration 4)

#### Findings in the window
- P2 regression (`a20a1d96a05`): a runner stopped by a signal no longer signals its own lineage children whose `spawned` row has no `process_start`. That is always the case on win32, and on any host where `ps` fails at spawn. They are refused as `no_recorded_identity`, then listed as survivors with no `stopped` row, and the runner exits with them running. `--stop` refuses them too [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1037] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1323] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5274]. Inferred from code, not run on Windows.

#### Checked clean
- The `run_extended` lineageId (`parentSessionId`) predates the window, and the gateway accepts it and later iteration rows on a restarted run (scratch reproduction).
- The research and review trust merge, the `--stop` identity check and exited-leader member split, and the repeat-signal handling all match their docs.

#### Q2 verdict
- Answered. Two in-window defects: the P3 `--extend` warning (iteration 3) and the P2 runner signal stop (iteration 4). The rest matches the docs.

#### Open
- `mergeResearchFrontier` (`fanout-merge.cjs:786`) may count an untrusted lineage's answered frontier nodes, against `fanout-merge.md:50`. Unverified.
- Typed-reducer `assertRunIdentity` callers on a restarted and extended run: not traced.

### Skill advisor: loop offers, typed-only fallback, distinctive-word floor (iteration 5)

#### Findings in the window
- **P3 (`73d98332fff` with `777feef2920`): in degraded mode, a refused deep-loop command is printed as the reader's own choice.** The Python fallback keeps any typed `/deep:*` row and marks it `typed`, whatever wording surrounds it [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4624]. Reproduced: `please do not run /deep:review, just review the parser once` gives `deep-review` 0.95 `typed`. The degraded CLI path carries the mark [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1563], and the renderer drops the A/B/C offer for a typed row [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250]. The render step is inferred, and policy stays `ask`.
- **P3 (observed; cause inferred from `527fc5f9d43`): the native hub leads a refused single-pass review.** That prompt gives `system-deep-loop` 0.912 above `sk-code` 0.877, with the command withheld. A typed command still anchors its owner unless it is only mentioned [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1322].
- **P3 UX, by design: a typed command beside a stuck run is offered as a rerun, not as `/doctor:deep-loop`.** The fixture pins this [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:123].

#### Checked clean
- Counted, adverb, question, past-run and loop-as-code-subject prompts route as documented. The docs state the typed-only fallback [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md:33]. The fallback's loss of untyped loop asks is the documented outcome, not drift.

#### Q3 verdict
- Answered: two low-severity refusal misroutes and one by-design UX gap. No P0, P1 or P2 was found.

#### Open
- `mergeResearchFrontier` trust gate (`fanout-merge.cjs:786` against `fanout-merge.md:50`) is still unverified. The cause of the native refusal lead is unconfirmed.

### Session hooks and spec tooling: Stop auto-record, tail detection, nested sub-tracks (iteration 6)

#### Findings in the window
- **P2 (`d57563b175a`, reproduced on the compiled detector): the one-packet check misreads a packet path that ends at a JSON escape.** The transcript is JSONL, so a newline after a path is stored as `\n`. The path regex keeps that `\n` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:49]. The leaf segment then fails [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:52], and the auto-record trim does not strip a backslash [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:831]. A phase child then resolves to its parent, which has a `spec.md`, and a top-level packet drops out. So answers can be written to the parent phase, or to the only other packet named.
- **P2, inferred (`d57563b175a`): an unlocked record write races a concurrent save.** The write is read, rebuild, then rename [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:787] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:819], followed by a consumed-key append [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:216]. The save workflow does the same sequence [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:805]. The rows that lose the race are still marked consumed and never offered again.
- **P3 (`d57563b175a`): a failed consumed append lets the next Stop overwrite an edited row.** The id is reused, so there is no duplicate, but the row is replaced [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:323]. That wipes a reason a person added.

#### Checked clean
- No duplicate rows on retry. The two-level sub-track depth guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] and the `validate.sh` nested walk [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453] hold at two levels.

#### Q4 verdict
- Answered: two P2s and one P3, all in the Stop auto-record. The sub-track tooling read clean, though `relocate.mjs` was only grep-read.

### Operator UX: Stop auto-record, create.sh sub-track refusals, goal hop warning (iteration 7)

#### Findings in the window
- **P3 (`d57563b175a`): the operator never sees what the Stop auto-record did.**
  - `main` discards the auto-record result [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:769].
  - Success and failure reach stderr only [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:217] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:221]. The `not_one_packet` and `no_spec` skips log nothing [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:198].
  - The chat nudge fires only when the pending count rises [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:462]. So a failed auto-record of answers already nudged is silent, and a success never says a packet file was written.
- **P3 (`b0b3c8d9bf1` routes level 2 into an older branch): a refused level-2 sub-track gets no remedy.**
  - Reproduced: `Error: --track 'demo/sub/missing' refused: demo/sub/missing: undeclared folder ignored`, printed for a folder that does not exist.
  - The diagnostic branch never prints the `Declare its description.json` remedy [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1458] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1461].
- **P3 (`12fe3abc66b`): the non-Claude goal hop warning can be false and names no next step.**
  - It says the packet is "only in the linked worktree" [SOURCE: .skilled/bin/skilled-loop:486].
  - Yet `goal_root` can be kept while this checkout holds a copy [SOURCE: .skilled/hooks/session-handover/goal-carry-over.md:108]. Inferred from code and docs.

#### Checked clean
- The `create.sh` four-segment error is exact and actionable (reproduced). `8f90ec94c0d` adds no new message. The fan-out earlier-run refusal names the running lineages.

#### Open
- Q5 stays open. The `worktree-naming.sh` provisioning messages (`957f47570f3`, `16f83331276`) are unread.

### Operator UX: worktree provisioning scan and the frontier trust lead (iteration 8)

#### Findings in the window
- **P3 (`957f47570f3`, reproduced with a stub advisor): provisioning can report a tree ready with no usable skill-graph database.**
  - The scan runs only when the database is absent [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:801]. The check after it tests existence only [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:809].
  - A failed scan that left a file behind goes green on the printed `provision` rerun [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:420]. A 0-byte file from a scan that exits 0 is counted as built.
  - `initDb` opens the database before indexing [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:387], so a real failure can leave such a file.
  - This breaks the "never reported ready" contract [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:682]. It becomes P2 if the advisor does not self-heal an empty graph.
- **P3 (`957f47570f3`, reproduced): a failed scan prints no reason.** Its output goes to `/dev/null` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:806]. The install path in the same function prints error lines and a remedy [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:741].
- **P3 doc drift (`965b88ca150`, inferred): the merged research frontier counts a rejected lineage's nodes.**
  - `mergeResearchFrontier` has no trust gate and adds no `_untrusted` label [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786]. The partition guard's reported set takes in untrusted nodes [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:803].
  - The doc says "An untrusted lineage claims no coverage" [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50].
  - The merged frontier appears to be report-only.

#### Checked clean
- `16f83331276` adds no operator message. The file-mode change in `957f47570f3` was restored to 100755 before the tag.

#### Q5 verdict
- Answered. Across iterations 3, 7 and 8 there are six P3 operator UX defects and no P0, P1 or P2.
- The pattern repeats: a new step reports to a stream the operator does not watch, or treats "exists" as "done".

#### Open
- Does the advisor self-heal an empty graph? Does a failed scan set `isError` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702]?
- Do partition ids collide across lineages?
- Is Stop-hook stderr visible in Claude Code? Does the win32 signal-stop P2 hold?

### Confirmation pass: severity questions (iteration 9)

#### Re-grades
- **f-iter008-001 stays P3, and P2 is ruled out by a runtime probe.** The advisor rebuilt both a 0-byte and a corrupt `skill-graph.sqlite` on its first recommend call, leaving 15 nodes in each. Corrupt files go through quick_check recovery [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:383].
- **f-iter008-002 stays P3.** A failed scan exits non-zero. The handler error reaches `EXIT_RUNTIME` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and a backend failure exited 75. Only the reason is lost [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:806].
- **f-iter007-001 stays P3, now with two sources.** Claude Code shows exit-0 hook stderr only in the debug log [SOURCE: https://code.claude.com/docs/en/hooks]. `session-stop` always exits 0 [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:903].
- **f-iter004-001 stays P2.**
  - Trace: on win32 `processStartOf` returns '' [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1279]. The spawned row then has no `process_start`, so the lineage is refused [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1408] and left running.
  - The win32 signal branch can no longer be reached [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1419].
  - The row shape is pinned by test, which was not run [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:236].
- **f-iter008-003 stays P3, but "report-only" is unconfirmed.** The merged registry is written as `findings-registry.json` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1732]. That is the name the expansive frontier gates read [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:218].

#### New
- Frontier ids at depth 2 and below can collide across lineages, because each lineage mints serials from its own store [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:280]. No consequence is shown: merged nodes keep their lineage label, and the partition guard checks only the unique dealt depth-1 ids [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:803].

#### Open
- Does any base-directory step after a fan-out merge read the merged `registry.frontier`?

### Merged-frontier readers, stop-identity test, closing ranking (iteration 10)

#### Settled
- **The merged registry is the base `findings-registry.json`.** It is written at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1887]. Line :1732 is only the load name.
- **No gate reads it on the normal fan-out path.**
  - `--extend` and the frontier caps are refused on fan-out [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:365].
  - Fan-out skips `phase_init` and the main loop [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:427].
  - The reducer rebuilds the frontier from the node store [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3503].
- **Two synthesis steps report it unlabeled.** `divergence_summary` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1970] and the Divergence Map [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2045] both read it, so an untrusted lineage's nodes reach research.md.

#### Re-grade
- **f-iter008-003 becomes a P3 logic defect. This is traced, not executed.**
  - In confirm mode, the pre-synthesis gate's B returns to `phase_loop` with no fan-out skip [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1995].
  - `step_graph_convergence` then reads the merged registry [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1103].
  - `frontierOpen` counts the untrusted lineages' open nodes [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1665].

#### Test
- **`fanout-stop-identity.vitest.ts` passed 7/7 with exit 0.** The no-recorded-identity case pins the row shape that win32 writes [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:236]. That confirms the P2 f-iter004-001 mechanism; it does not clear it.

#### Final ranking
- 3 P2:
  - f-iter004-001 (`a20a1d96a05`)
  - f-iter006-001 (`d57563b175a`)
  - f-iter006-002 (`d57563b175a`, inferred)
- 14 P3, 1 by-design and 1 without severity. No P0 or P1.
- The full ranked table, with file:line and commit for each finding, is in iterations/iteration-010.md.

#### Open
- Can a lineage dealt zero nodes seed its own `F-1-*` ids?
- Does the confirm-mode B re-entry work at all on a fan-out run? It is pre-existing, from before the window.
- Registry note: the delta rows f-iter010-001, -002 and -005 and the iteration-9 re-grade rows confirm or correct earlier findings. They are not new defects, despite their severity tags. The ranked table in iterations/iteration-010.md gives the authoritative counts: 3 P2 and 14 P3.
- Re-grade basis: Finding 3 is the deterministic consumer. On every expansive fan-out run with an untrusted lineage, the synthesis steps print that lineage's nodes unlabeled. Finding 4 is narrower and low harm: the read happens on the first pass only, before `step_reduce_state` rebuilds the frontier, and the veto can only return CONTINUE.

## 11. Convergence Report

- Stop reason: maxIterationsReached. The last two stop checks found every question answered but were blocked by the source-diversity guard, so the run ended at its iteration cap.
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 8: operator UX, worktree provisioning and the frontier trust lead (0.83); run 9: confirmation pass on severities (0.67); run 10: merged-frontier readers, the stop-identity test and the closing ranking (0.60)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 12. Independent Verification

A fresh Opus 5.5 agent at xhigh effort checked 13 of the findings without reading this file or the iteration narratives. It refuted none. All 11 cited commits fail `git merge-base --is-ancestor <sha> v4.1.0.0` and pass it against v4.2.0.0, and every cited file is unchanged between the tag and HEAD. Its reproductions are in the session scratchpad under `verify/`.

- **f-iter004-001 (P2), partly confirmed:** with the platform faked as `win32`, `processStartOf` returns `''`, the lineage is refused as `no_recorded_identity` and no signal is sent. Lines `fanout-run.cjs:5262`-`:5266` then list it as a survivor with no stopped row. Before `a20a1d96a05` the runner killed every child on win32. Whether children outlive the runner is unverified, because win32 spawns them with `detached: false` (`:3379`).
- **f-iter006-001 (P2), confirmed by reproduction:** with the compiled hook, a transcript naming only `.../007-parent/001-child\n...` wrote the answer to the parent's `decision-record.md`, and `008-other` plus `007-parent\n` counted as one packet. The trigger is narrower than first stated: when the child path also appears in a quoted tool input the hook skips. The regex at `:49` predates the window, and writing to its result is new.
- **f-iter006-002 (P2), confirmed in code with simulated timing:** the save path takes `acquireCanonicalSaveLock` for the same writer (`workflow.ts:793`), and the Stop caller does not (`session-stop.ts:215`). A forced overlap lost the save's row, and both writers handed out `Q002`.
- **f-iter008-003 (P3), partly confirmed:** `mergeResearchFrontier` has no trust filter, and untrusted nodes count in the partition guard (`fanout-merge.cjs:803`). The merged frontier reaches the review report (`deep-review.yaml:2350`). `fanout-merge.md:50` never names the frontier, so "contradicts" overstates it.
- **f-iter002-001, f-iter002-002, f-iter006-003, f-iter001-001 (P3):** each confirmed by reproduction.
- **f-iter003-001, f-iter008-001, f-iter008-002 (P3):** confirmed in code. The current `--extend` lines come from `d239dd6d2ae`, which moved the logic of `2c80c64f391`.
- **f-iter005-001 (P3):** the Python filter, run alone, marks "please do not run /deep:review ..." as `typed: True`. `skill-advisor-cli.ts:1519`-`:1523` states the opposite rule for the TypeScript fallback.
- **f-iter007-001 (P3), partly confirmed:** when the pending count rises the nudge still reaches chat as a `systemMessage` (`session-stop.ts:770`-`:773`), so only a successful write is fully silent.
- **f-iter007-002 (P3):** confirmed, but broader and older: every refused sub-track prints "undeclared folder ignored", and the dead remedy branch was already in v4.1.0.0 (`f46c48fa2ad`).

Defects the verifier found nearby:
- **V-1:** `session-stop.ts:215`-`:222` logs "Auto-record of queued answers skipped" and returns `failed` even when the decision record was already written.
- **V-2:** in the f-iter006-002 race both writers allocate the same id, so the consumed log points the lost key at the other writer's row.
- **V-3:** on win32 `--stop` refuses every lineage the same way, signals nothing and exits 2 (`fanout-run.cjs:4862`, `aca3e6858b3`). Read from code, not run.
- **V-4:** the autosave retarget `detectSpecFolder` has had the same escaped-newline flaw since v4.1.0.0.
