# Lead steer

## Lead ruling (binding, read first)

This is a non-interactive run: nobody can answer a question, and `deep-review/SKILL.md` NEVER rule 4 forbids asking. Do not stop to ask. Where two instructions seem to conflict, follow the workflow YAML and record the conflict as a finding.

Known conflict, already ruled: `SKILL.md:392` (NEVER rule 6, config read-only after init) and `deep-review-auto.yaml:2322-2325` (`step_update_config_status` sets `status: complete`). Rule 6 forbids changing review parameters during the loop. The terminal status flip is the workflow's own step: do it. You may log this wording gap as a P2 finding.


Second ruling: a failed tool or gateway call is not a halt condition here. The `AGENTS.md` halt list is for interactive sessions; in this lineage, stopping loses the run. When a call fails (for example the claim-adjudication gateway answering `INPUT_ERROR` because it could not read a file), check the path, pass the absolute lineage path `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/090-deep-review-okf-adoption/specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/...`, and retry once. If it still fails, record the failure in that iteration's narrative and continue to the next iteration. Resume from the last recorded iteration; never redo or delete earlier ones. Stop only at maxIterations, then run synthesis.

**Session ID on resume: answered (option 1).** The runner was restarted, so your prompt's session ID differs from the one in this lineage's existing state. Resume the existing lineage under the session ID already recorded in `deep-review-config.json` and `deep-review-state.jsonl`, exactly as `loop-protocol.md:590-592` requires. The ID in the prompt is only the new runner's attempt label. Do not create a new lineage directory and do not rewrite earlier records.

**Lock lifecycle: answered, approved (option A).** Acquire `.deep-review.lock` in init and release it at the end, exactly as `deep-review-auto.yaml:295-311` and `loop-lock.ts` do. This is not the irreversible tier of `blast-radius.md`: that tier protects untracked files nobody can recreate, while `AGENTS.md` §4 FINAL-STATE VERIFICATION requires removing task-created temporary output, and a lock this lineage itself created is that. The operator delegated this run's approvals to the lead session on 2026-10-06 ("so you can fully do this autonomously"). Rollback, if ever needed: reacquire with `loop-lock.cjs acquire`. Scope: only lock files this lineage creates inside its own lineage directory.

**Paths.** The repository root is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/090-deep-review-okf-adoption`; copy it exactly. The agent definition is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/090-deep-review-okf-adoption/.skilled/agents/deep-review.md` (it exists). A "file not found" usually means a mistyped path: recheck the spelling before concluding a file is absent.

Review target: the release range `v4.0.0.2..v4.0.0.3`. The scope list is `goal-file-manifest.txt` in the packet. Use `git diff v4.0.0.2..v4.0.0.3 -- <path>` and `git log v4.0.0.2..v4.0.0.3 -- <path>` to see what changed in a file; review the change, not the whole history.

Three lineages run at once. Start in your focus area below so the three do not duplicate work. Expand actively: when a finding points to a caller, a contract, a doc or a test outside your area, follow it and say so in the iteration. Once your focus area feels covered, widen into the rest of the manifest.

Every finding needs file:line or commit evidence and a concrete failure scenario. Do not report style nits as P1.

Your focus area: release and update (`.skilled/release/`, `/doctor:*` commands, `.skilled/commands/doctor/`), git hooks and commit-message checks (`.skilled/scripts/git-hooks/`, `.skilled/skills/sk-git/`), session hooks (`.skilled/hooks/`, `.devin/hooks/`, `.opencode/plugins/`, `.pi/`), and `.github/workflows/`.
