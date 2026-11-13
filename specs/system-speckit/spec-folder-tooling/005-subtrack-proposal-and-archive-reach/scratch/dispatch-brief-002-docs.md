REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

OTHER GATES, ALSO PRE-RESOLVED
- Git workspace: this worktree, branch worktrees/364-subtrack-proposal-archive-reach. Do not create branches or worktrees. Do not commit, push or stage.
- Execution mode: autonomous. Dispatch: you are the single worker; do not dispatch agents.
- Session goal: author the goal files; do not call any goal-setting tool.

ROLE
You close out the documents of one built phase of a spec packet. You write no runtime code and change no file outside the phase folder.

CONTEXT
Phase folder: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal. The build is finished and verified by the orchestrator. Read the phase `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md`, then `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`. Use `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine` as the model for how a closed phase records evidence.

OBSERVED EVIDENCE (all observed by the orchestrator on 2026-11-13; record it, do not rerun it, do not invent more)
- Built: `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` (new) and `advise_sub_track` in `create.sh`, both written by DeepSeek V4.1 Flash through the dsh harness on the LLM Gateway route, one change per dispatch. Wording and doc edits were made by the orchestrator.
- `node suggest-subtracks.mjs --track does-not-exist` printed "suggest-subtracks: track does-not-exist does not exist" and exited 2.
- `--track cli-classifier` printed "track cli-classifier has 6 live packets, below the threshold of 8; no map", exit 0. `--threshold 3` printed a 6-entry map with sub-tracks completion-directive and general, and `relocate.mjs --map` accepted it in a dry run.
- `--track system-speckit --describe "archive a spec folder"` printed "best fit: system-speckit/spec-folder-tooling". `--describe "bake sourdough bread"` printed "none fits: propose a new sub-track in system-speckit".
- No real flat track holds 8 or more live packets (the largest is cli-classifier with 6). The FLAT track for the tasks is therefore a fixture: a 10-packet track `demo` built in a throwaway `git clone --shared` under /private/tmp, deleted afterwards. There, `suggest-subtracks.mjs --track demo` exited 0 with a 10-entry map (billing-invoice, index-query, login-oauth, general), and `relocate.mjs --map` dry run exited 1 with "moves=10 moved=0 rewrites=21 identity=10 roots=5 ledger=10". `create.sh --track demo` printed "[speckit] Track demo has grown into clusters. Consider sub-tracks: ...".
- `git status --porcelain` was identical before and after every run of the tool on the real tree.
- Clustering as built: terms from description.json keywords and graph-metadata trigger_phrases and key_topics, terms in more than 60 percent of packets dropped, Jaccard similarity of 0.2 or more merged by union-find, single packets collected in a remainder sub-track named general, names from the two most shared terms. Present mode needs a score of 0.2 and at least 2 matched terms.
- Operator decision during the build: the option C wording changed on every surface, not only the five files this spec listed. Changed: the three strings in `spec-gate-core.mjs`, 6 create presentation assets, 3 deep presentation assets, 3 compiled deep contracts (regenerated with compile-command-contracts.cjs --write), speckit plan and complete presentation assets, `speckit-implement.yaml`, `AGENTS.md` Gate 3 option C, `agents-md-manifest.json` (regenerated, check PASS), `trigger-config.md`, `worked-examples.md`, the skill-advisor parity fixture `baseline-contexts.json` and the pinned strings and plannedHash in `spec-gate-core.test.mjs`.
- Tests: `npm test` in runtime/cli exit 0, vitest 206 files passed 3 skipped, 2524 tests passed 20 skipped, every legacy stage 0 failed, identical to `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/scratch/baseline.txt`. spec-gate-core and gate-3-menu-parity node tests: 127 tests, 124 pass, 3 skipped, 0 fail. agents-md tests 71 pass. skill-advisor policy-plan parity 32 pass. deep-loop contract tests 23 pass.
- Docs added: "When to Propose a Sub-Track" in folder-structure.md, a pointer in phase-definitions.md, `--track <track>/<sub>` in SKILL.md and quick-reference.md.

ACTION
1. Tick each task in `tasks.md` that the evidence above proves, and the checklist rows it proves. Reword a task only where the built behavior differs (the fixture FLAT track, the wider wording scope). Leave unticked anything the evidence does not prove and say why in your report.
2. Fill the evidence rows of `acceptance-criteria.md` as that file instructs.
3. Update `spec.md` and `plan.md` so they match what was built: the wider Files to Change list, the answered open questions, the clustering constants, the fixture finding.
4. Fill `implementation-summary.md` per the authoring card with no placeholder left.
5. Append two rows to the phase goal log with `node .skilled/hooks/goal/bin/goal.cjs packet-log specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal "<item> | <state> | <evidence>" --workspace .` (one for the build, one for the fixture finding).

CONSTRAINTS
- Write only inside `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal/`. No em dashes, no semicolons in prose. Do not hand-edit description.json or graph-metadata.json. Do not stage or commit.

VERIFICATION
`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal --strict` must print `RESULT: PASSED`. At most three repair rounds.

RETURN FORMAT
The validator result line, the files you changed, every task or criterion left open with the reason, and anything you could not finish.
