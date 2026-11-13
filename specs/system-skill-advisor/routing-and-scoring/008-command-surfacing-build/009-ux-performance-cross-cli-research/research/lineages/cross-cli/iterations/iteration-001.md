# Iteration 1: Wiring map, live pre-arm score, and what 005-008 already cover

## Focus

Establish the cross-CLI baseline before recommending anything: (a) score the current `runs-pre.jsonl`, (b) map each runtime's advisor delivery path in this repository, and (c) separate what phases 005-008 already plan from what they leave open. The lineage steer binds this angle to per-runtime start rate and its causes.

## Actions Taken

1. Ran the committed scorer over the pre-arm log: `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs --summary .../scratch/runs-pre.jsonl` (summary and `--json`).
2. Read `spec.md`, `goal.md`, and the plans of phases 005-008.
3. Read each runtime's delivery surface: `.claude/settings.json`, `.codex/hooks.json`, the Codex/Devin user-prompt-submit shims, `.pi/extensions/prompt-advisor.ts`, `.opencode/plugins/system-skill-advisor.js`, `.dsh/plugins/repo-guards/index.mjs` and its prompt-advisor adapter.
4. Read `scratch/g5/result.txt` and the measured embedder/hook timings.
5. Counted host command surfaces (`.codex/prompts`, `.pi/prompts`, `.dsh/prompts`, `.opencode/commands`, `.claude/commands`) and read one generated stub per runtime.

## Findings

1. **The pre-arm start rate is not a surfacing baseline.** Phase 005 is planned, not built, so no brief in the pre-arm names a command; `started` is defined as a read of the expected command document *or* a `COMMAND:` line, not as a response to a brief. The 3/12, 0/12, and similar numbers therefore measure spontaneous document reads, not whether a model starts an offered command. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:67] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:194] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:646]

2. **The dispatched baseline is stale because the log is still growing, and the arms are unequal.** Live scoring on 2026-11-12T22:5xZ prints claude 3/12, codex 0/12, pi 0/12, devin 2/12, opencode 5/10, dsh 3/10 with one DSH `COMMAND:` line. Row counts are claude 24, codex 24, pi 24, devin 13, opencode 10, dsh 10, while the phase plan expects 24 chat runs per runtime. A before/after comparison over different row sets cannot attribute a delta. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:73] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1146]

3. **Capped runs sit inside the start denominator and depress it by an unknown amount.** The scorer flags a run capped when its exit is 143 or null, keeps it scored, and counts it in `startRows`. The live log has pi 2, devin 4, opencode 4 capped. The real range is wide: opencode 5/10 could be 5/6 if every capped run failed before a start, devin 2/12 could be 2/8, pi 0/12 could be 0/10. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1082] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1158] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl:1]

4. **Five runtimes have an in-repo delivery path; DSH is conditional and unconfigured here.** Claude runs the advisor through the spec-kit shim (2,500 ms budget), Codex and Devin through their own shims calling the same Claude adapter (2,800 ms), Pi through an auto-loaded extension that calls the compiled advisor in-process, and OpenCode through its plugin. DSH's `prompt-advisor` adapter returns immediately unless `options.promptAdvisor === true`, and no repo-side DSH config enables that flag. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts:28] [SOURCE: .pi/extensions/prompt-advisor.ts:1] [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] [SOURCE: .dsh/plugins/repo-guards/adapters/prompt-advisor.mjs:147]

5. **The host command name is not the canonical command name on three runtimes.** Codex, Pi and DSH generate flat prompt entries named `/create-readme` from the canonical `/create:readme`. Phase 006 adds a "Starting a surfaced command" table and tells the model to read the command document, which covers the intended path, but no phase maps the canonical label to the host entry or measures an attempted host invocation that fails. [SOURCE: .codex/prompts/create-readme.md:2] [SOURCE: .pi/prompts/create-readme.md:2] [SOURCE: .dsh/prompts/create-readme.md:2] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md:69]

6. **The G5 shadowing defect is documented by phase 006 but fixed by no phase.** `.claude/commands/create/skill.md` is a symlink to the canonical command file; with a `skill.md` present Claude Code lists the whole folder as one Skill entry named `create` and hides the other twelve `create:*` names. Phase 006's T018 writes that fact into the hook doc and stops there. [SOURCE: .claude/commands/create/skill.md:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:2] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md:69]

## Ruled Out

- **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22]
- **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

## Dead Ends

- Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate.
- Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81]

## Edge Cases

- **Ambiguous input:** the dispatched baseline numbers and the live file disagree. I treat the live scorer output as the fact and the dispatch text as a stale snapshot, and record both.
- **Contradictory evidence:** none. DSH produced one `COMMAND:` line and 3/10 starts even though its adapter's flag defaults off; the likely explanation is a host-side config outside this repo, which I cannot read. Recorded as an open uncertainty, not resolved.
- **Missing dependency:** the per-run capped/started overlap is not available without a scorer change; recorded as a bound.
- **Partial success:** the pre-arm log is incomplete (10-24 rows per runtime), so every rate is provisional. Status is `complete` for the wiring map and `partial-success` in effect for the rate table.

## Questions Answered

- Q1: Which hook or pointer surface must each of the six runtimes have before an advisor recommendation is even offered, and which runtimes are unwired in the pre-arm log? — Answered: five paths exist; DSH is conditional on a row flag with no repo config.
- Q2: Why does the model start so few offered commands on each runtime ... and what does the missing COMMAND line prove about the brief? — Answered: pre-005 the brief names no command, so a start can only be a spontaneous document read; the missing `COMMAND:` line is expected pre-change and proves nothing about the post-change contract.

## Questions Remaining

3 of 5 key questions: the raise-start-rate change, the command-file layout/install path, and the cheapest measurement harness.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/plan.md`, `tasks.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/plan.md`, `scratch/measured-2026-11-12.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`, `scratch/g5/result.txt`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.pi/extensions/prompt-advisor.ts`, `.opencode/plugins/system-skill-advisor.js`, `.dsh/plugins/repo-guards/index.mjs`
- `steer.md`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1, Q2
- Questions answered: Q1, Q2 (Q2 answered with the correction that the quoted baseline is stale)

## Reflection

- What worked and why: scoring the log before reading plans exposed that the baseline measures the wrong thing; the plan's own ADR-002 confirms it. Reading each runtime's shim rather than assuming "not wired" avoided a wrong root cause.
- What did not work and why: no exported per-run score prevented an exact uncapped rate; the bound is the honest substitute.
- What I would do differently: read the scorer's aggregation before trusting any quoted rate.

## Recommended Next Focus

Iteration 2: quantify what the lowest-cost fix changes. Test the command-file naming/shadowing and the runtime-name mapping against the generated mirrors, then design the two scorer changes (arm completeness + capped split + brief attribution) with their exact checks.
