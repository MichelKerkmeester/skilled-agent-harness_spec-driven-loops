# Lead steer

## Lead ruling (binding, read first)

This is a non-interactive run: nobody can answer a question, and `deep-review/SKILL.md` NEVER rule 4 forbids asking. Do not stop to ask. Where two instructions seem to conflict, follow the workflow YAML and record the conflict as a finding.

Known conflict, already ruled: `SKILL.md:392` (NEVER rule 6, config read-only after init) and `deep-review-auto.yaml:2322-2325` (`step_update_config_status` sets `status: complete`). Rule 6 forbids changing review parameters during the loop. The terminal status flip is the workflow's own step: do it. You may log this wording gap as a P2 finding.


Second ruling: a failed tool or gateway call is not a halt condition here. The `AGENTS.md` halt list is for interactive sessions; in this lineage, stopping loses the run. When a call fails (for example the claim-adjudication gateway answering `INPUT_ERROR` because it could not read a file), check the path, pass the absolute lineage path `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/090-deep-review-okf-adoption/specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/deepseek-flash-max/...`, and retry once. If it still fails, record the failure in that iteration's narrative and continue to the next iteration. Resume from the last recorded iteration; never redo or delete earlier ones. Stop only at maxIterations, then run synthesis.

Review target: the release range `v4.0.0.2..v4.0.0.3`. The scope list is `goal-file-manifest.txt` in the packet. Use `git diff v4.0.0.2..v4.0.0.3 -- <path>` and `git log v4.0.0.2..v4.0.0.3 -- <path>` to see what changed in a file; review the change, not the whole history.

Three lineages run at once. Start in your focus area below so the three do not duplicate work. Expand actively: when a finding points to a caller, a contract, a doc or a test outside your area, follow it and say so in the iteration. Once your focus area feels covered, widen into the rest of the manifest.

Every finding needs file:line or commit evidence and a concrete failure scenario. Do not report style nits as P1.

Your focus area: `.skilled/skills/system-spec-kit/` runtime and shared code, `.skilled/skills/system-deep-loop/` (fan-out, gateway, locks, dispatch), `.skilled/skills/cli-external-orchestration/` and `.skilled/skills/cli-classifier/` (Jev), and `.skilled/skills/system-skill-advisor/`. You have 15 iterations: spend the later ones on cross-skill contracts between these areas.
