# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner`)
- Session: `fanout-accuracy-runner-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: D3 Traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: docs that disagree with code; cross-runtime behaviour; safety of offering a mutating command; holdout hygiene.
- How this iteration addressed the focus: it checked the operator-facing documentation and the packet's own phase evidence against the runner's real guards and exits, and re-verified every numeric floor the packet claims against the committed baseline artifact.
- `steer.md`: still absent; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-182`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:25-40,68-69,480-495,1013-1081`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/hub-command-attachment.md:1-124`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:381-405`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:187-230,316-370,413-500,717-790,871`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15,306,334,357,398`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:893-900`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:84-149`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md:101,139,149-151`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/implementation-summary.md:49`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope.txt:98-145`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Runner README describes an unconditional restore and omits the exit code that skips it** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:113` -- The README says a run "restores the checkout to HEAD and reports any `leftoverPaths`", and lists only exit 2 refusals. The code defines a separate exit `3` (`run-command-behaviour.mjs:68-69`), and when a commit or stash appears mid-turn it writes a line with `restored: false, headMoved: true`, returns `EXIT_HEAD_MOVED`, and deliberately does not restore (`:1017-1037`). The guard comment beside it also claims the stop happens "rather than after the damage" (`:484-489`), but the commit has already happened by the time the post-turn snapshot sees it. An operator who reads the README as a contract will believe a stopped arm left the worktree as found.
Finding class: docs-vs-code
Scope proof: `runtime/scripts/routing-accuracy/README.md` and `run-command-behaviour.mjs` are both declared scope files; the finding names one documented behavior and the code path that contradicts it.
Affected surface hints: `runtime/scripts/routing-accuracy/README.md` §4 and §6 usage text, the operator triage path for a failed arm, `run-command-behaviour.mjs` exit-3 path.
Case: a measured `/speckit:complete` turn runs `git commit` before the post-turn snapshot; the arm exits 3 and keeps the commit, while the README documents that the checkout was restored to HEAD and lists exit 2 as the only refusal.

2. **The packet's phase map leaves the per-runtime behaviour proof open while marking later phases complete** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:120` -- The phase table marks `007-per-runtime-behaviour-proof/` "In Progress" while phases 10-13 are "Complete", and the table's own transition rule says each phase must pass validation before the next phase begins (`spec.md:133-134`). The owning phase is genuinely unclosed: its implementation summary says "Not completed. Planned 2026-11-12" (`007-per-runtime-behaviour-proof/implementation-summary.md:49`) and its closing tasks are unticked, including the one that writes the summary and marks acceptance evidence (`007-per-runtime-behaviour-proof/tasks.md:139,149-151`). The cross-runtime claim this review was asked to check (behaviour on claude, codex, opencode, pi, devin, dsh) therefore has no closed packet evidence behind it, only an open phase.
Finding class: checklist-evidence
Scope proof: the packet is the declared review target; the finding cites the packet's own phase map and the owning phase's task/summary files as read-only evidence and makes no claim about code behavior.
Affected surface hints: `spec.md` phase map and transition rule, `007-per-runtime-behaviour-proof/tasks.md` closing checklist, `007-per-runtime-behaviour-proof/implementation-summary.md`, the parent review's cross-runtime traceability conclusion.
Case: a reader checks whether the build proved behaviour on all six runtimes, follows `spec.md` to phase 007, and finds its tasks and summary open while the later phases that consume that proof are already Complete.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass (numeric floors) | Packet floors re-derived from the committed baseline: typed combined 44 of 44 (`spec.md:148` vs `attachedMetrics.typed`), plain tune combined 23 of 45 above the 9 floor (`spec.md:149`), false offers 0 of 35 (`spec.md:144`), holdout plain combined 1 of 44 above the 0 floor (`spec.md:144`). |
| `checklist_evidence` | partial | The parent packet has no `checklist.md`; the owning phase's closing checklist is open (`007-per-runtime-behaviour-proof/tasks.md:139,149-151`), recorded as finding 2. |
| `playbook_capability` | pass | NC-011 is executable as written: every command is a repo-relative `advisor_recommend` call, and its triage references resolve (`MODE_COMMANDS` `command-attach.ts:15`, `DEPTH_WORDING` `:306`, `command-speckit-save` row `projection.ts:893-900`). |
| `feature_catalog_code` | pass | `command-meaning-matching.md:44` claims `--real-embedding` refuses `--write`; `capture-command-routing-baseline.mjs:661` refuses that combination. |
| `skill_agent` | notApplicable | The accuracy-runner area has no agent definition of its own; the harness is called by operators and tests, not by an agent. |

## Integration Evidence

- Named surfaces: `spec.md` (packet requirements R8/G2/G5 and the numeric floors), `007-per-runtime-behaviour-proof` (owning phase evidence), `command-routing-baseline.json` (the artifact the floors are read from), `manual-testing-playbook/native-cli-tools/hub-command-attachment.md` (operator capability case), `runtime/tests/command-offer.vitest.ts:381-401` (holdout refusal proven by test), `runtime/tests/command-transcript-score.vitest.ts:717-776` (capped rows, policy buckets and loop-without-init proven by test).
- Cross-runtime evidence status: the runtime table is documented and tested at the argv level, but the end-to-end proof that phase 007 owns is still open, so this review reports cross-runtime behavior as read-verified and packet-unproven.

## Edge Cases

- `steer.md` still absent; recorded, no ruling to apply.
- The parent packet owns no checklist, so `checklist_evidence` cannot be marked pass at parent level; treating the absence as a pass would hide finding 2.
- Phase 007's open tasks require live runs, which this lineage cannot execute under containment; the finding is about missing evidence, not about a missing implementation.
- The packet's own review packet (`review/`) is excluded from the target per the deep-review boundary; only `spec.md` and the phase children were read as traceability evidence.
- Holdout prompt text remained unread; the corpus was used through counts and the baseline's aggregate metrics only.

## Confirmed-Clean Surfaces

- Every numeric floor the packet claims is present in the committed baseline and meets or exceeds its threshold (typed 44/44, plain tune 23/45, false offers 0/35, holdout 1/44).
- NC-011's failure triage names real symbols in the current tree, so an operator following the playbook reaches a working diagnosis.
- `command-meaning-matching.md:44` matches the capture script's `--write`/`--real-embedding` refusal.
- The transcript scorer's documented safety floor is tested: loop-without-init as unsafe (`command-transcript-score.vitest.ts:776`), capped rows kept out of the start rate (`:729`), policy bucketing from changed paths (`:748`).
- Backfill holdout refusal is proven by test, not only by code (`command-offer.vitest.ts:381-401`).

## Ruled Out

- NC-011 stale triage: ruled out; `MODE_COMMANDS`, `DEPTH_WORDING` and the `command-speckit-save` owner row all exist at the cited locations.
- Packet floor misstatement: ruled out; all four claimed floors match the committed artifact.
- README claim that `unsafe` counts a loop without init: ruled out as drift; `score-command-transcripts.mjs:1205` and `README.md:111` agree.
- Documentation of the arena precondition: `prepare-behaviour-arena.mjs:36-37` documents the `--source/--dest` invocation, so the missing piece is enforcement (iteration 2), not documentation.

## Next Focus

- Dimension: maintainability
- Focus area: cost benches and fixtures (`measure-brief-cost.mjs`, `measure-embedder-cost.mjs`, `hook-brief-signal-noise.bench.ts`, `gate2-golden-prompts.jsonl`, `skill-advisor-regression-cases.jsonl`), legacy fidelity tests, and the duplication cost of the two hand-maintained runtime tables.
- Reason: correctness, security and traceability have each had a full pass; the remaining dimension is whether the area is safely changeable, especially where two tables or two corpora must stay in sync.
- Rotation status: D3 traceability complete, D4 maintainability next.
- Blocked/productive carry-forward: productive (docs/tests/spec cross-check); blocked (no live execution).
- Required evidence: bench source and its thresholds, fixture row counts and their consumers, legacy test assertions, and the duplicated runtime/command tables.

Review verdict: CONDITIONAL
