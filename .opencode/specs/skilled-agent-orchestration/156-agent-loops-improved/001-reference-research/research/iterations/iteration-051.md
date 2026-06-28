# Iteration 51: W-10 Meta-Loop for Deep-Loop Runtime Self-Improvement

## Focus

W-10 asked what a meta-loop would look like if `/deep:ai-system-improvement` were pointed at the deep-loop runtime's own technique docs, and which guardrails keep that loop from degrading the harness it depends on.

Dimension: D4 synthesis. Prior iterations already covered raw outcome deltas, rejected-pattern suppression, and benchmark promotion gates, so this pass stays on the self-targeting architecture and its guardrails.

## Actions Taken

1. Checked prior iteration and delta files for `W-10`, `ai-system-improvement`, and self-harness coverage. No direct W-10 iteration was present; closest prior coverage was S5-10 benchmark outcome deltas.
2. Read the Lane D command and local non-dev AI-system contract to understand the existing self-improvement surface: `/deep:ai-system-improvement`, `packaging_config.schema.json`, `loop.py.template`, `gauntlet.py.template`, and the operator guide.
3. Mined `kasper` for self-improvement guardrails: self-session exclusion, target typing, strict sanitation, backup/restore messaging, and bounded improvement records.
4. Mined `loop-cli-main` for change-management and wave-safety guardrails: active OpenSpec changes, non-goals, verification gates, disjoint file domains, checkpoints, and one retry.

## Findings

1. **Add a checked-in deep-loop-runtime Lane D packaging profile.**
   Reference mechanism: loop-cli-main makes OpenSpec the active change source of truth and refuses implementation without it (`external/loop-cli-main/AGENTS.md:126`), while its config requires proposal non-goals, persisted-state/IPC impact callouts, and `tsc -> lint -> test` gates (`external/loop-cli-main/openspec/config.yaml:17-27`). Kasper also constrains auto-improvement targets to a typed union, `agents_md` or `agent_prompt` (`external/kasper/src/types.ts:229-239`).
   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json` (new profile).
   Port difficulty: med. Tag: quick-win.
   Why it helps: the meta-loop becomes an explicit Lane D packaging for `.opencode/skills/deep-loop-runtime`, with frozen scorer/harness docs, editable technique-doc maps, visible fixtures, held-out fixtures, and no ambiguous "improve the runtime" target.

2. **Fail promotion if a candidate changes anything outside the selected technique doc plus derived copies.**
   Reference mechanism: Kasper narrows write targets through `ImprovementRecord.target` (`external/kasper/src/types.ts:229-239`) and rejects unsafe generated guidance before writing it (`external/kasper/src/utils.ts:304-345`, `external/kasper/src/evaluate.ts:1396-1405`, `external/kasper/src/evaluate.ts:1502-1510`). Lane D currently instructs the proposer to edit one file only (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template:390-404`) and checks frozen-surface and derived-copy drift during promotion (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template:422-453`), but it does not explicitly assert the full git diff is allow-listed.
   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template`.
   Port difficulty: med. Tag: quick-win.
   Why it helps: a self-targeting run cannot quietly edit runtime harness code, command routers, tests, or its own gates just because those files are not part of the frozen scoring surface.

3. **Quarantine self-generated sessions and benchmark artifacts from the observation corpus.**
   Reference mechanism: Kasper marks internally generated session prefixes (`external/kasper/src/utils.ts:166-170`), filters those sessions from polling (`external/kasper/src/index.ts:805-814`), and has an e2e assertion that scored sessions exclude `kasper-*` and `Kasper` titles (`external/kasper/tests/e2e/e2e-edge-cases.test.ts:175-203`).
   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json`.
   Port difficulty: med. Tag: quick-win.
   Why it helps: a deep-loop self-packaging can declare excluded session/title/path prefixes so proposer, grader, benchmark, and `_loop/state` artifacts never become evidence for improving the runtime itself.

4. **Make self-target mode a command-level setup fork, not an inferred packaging path.**
   Reference mechanism: loop-cli-main stops after proposal generation and asks for implementation confirmation (`external/loop-cli-main/AGENTS.md:83-90`), then applies work only through dependency-aware, file-disjoint waves with verification (`external/loop-cli-main/AGENTS.md:95-102`). `/deep:ai-system-improvement` already has hard Phase 0 and Setup gates plus a dry-run default (`.opencode/commands/deep/ai-system-improvement.md:12-17`, `.opencode/commands/deep/ai-system-improvement.md:63-72`).
   Exact OUR target file: `.opencode/commands/deep/ai-system-improvement.md`.
   Port difficulty: easy. Tag: quick-win.
   Why it helps: a `--self-target=deep-loop-runtime` path can require the checked-in profile, dry-run first, active spec/packet, clean tree, single-writer lock, and explicit operator confirmation before any live runtime-doc candidate is proposed.

5. **Expand accepted-promotion evidence from "kept worktree path" to rollback/merge instructions and diffstat.**
   Reference mechanism: Kasper records backup paths when applying prompt or AGENTS.md improvements (`external/kasper/src/improvements.ts:49-61`, `external/kasper/src/improvements.ts:90-102`) and returns restore hints to the operator (`external/kasper/src/improvements.ts:67-78`, `external/kasper/src/improvements.ts:103-115`). Lane D keeps accepted promotion worktrees and prints the path (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template:619-624`, `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template:644-652`).
   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template`.
   Port difficulty: easy. Tag: quick-win.
   Why it helps: a self-improvement run on deep-loop runtime leaves a reviewable artifact: base SHA, kept worktree, changed target doc, diffstat, merge command, and rollback/removal command, instead of requiring the operator to reconstruct what changed.

6. **Keep self-target candidate execution serial unless a future parallel mode proves disjointness.**
   Reference mechanism: loop-cli-main caps concurrent waves, requires non-overlapping file domains, stops on explicit stalls, and retries a failed group once (`external/loop-cli-main/AGENTS.md:47-58`).
   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/references/non_dev_ai_system/loop_contract.md`.
   Port difficulty: easy. Tag: quick-win.
   Why it helps: the meta-loop should not fan out multiple candidates over shared runtime docs until it can prove disjoint path domains and checkpoint semantics; serial single-candidate Lane D is the safer default for improving the harness it runs on.

## Questions Answered

- W-10 answered: the meta-loop should be a Lane D packaging profile for deep-loop runtime technique docs, not a special ad hoc command. It should freeze evaluator/harness/scoring surfaces, map dimensions to allowed technique docs, benchmark visible fixtures, gate promotion on held-out fixtures, and keep accepted edits in a reviewable worktree.
- The primary degradation risks are self-observation contamination, unbounded candidate diffs, unplanned live mutation, weak rollback evidence, and future parallel candidate conflicts.

## Questions Remaining

- Which exact deep-loop runtime docs should be classified as editable technique docs versus frozen harness/scorer docs? Candidate editable areas are `feature_catalog/`, `manual_testing_playbook/`, and selected reference docs; candidate frozen areas are `tests/`, scorer prompts, Lane D templates, command routers, and runtime scripts.
- Should the deep-loop self-packaging live inside `.opencode/skills/deep-loop-runtime/benchmark/` or as a generated packet-local packaging under the spec folder?
- Should `allowed_diff_relpaths` be added as a generic Lane D schema field, or only generated for the deep-loop-runtime profile?

## Next Focus

W-11 or nearest wildcard: define the exact deep-loop-runtime packaging manifest - frozen surfaces, editable technique-doc map, visible fixtures, held-out fixtures, and exclusion prefixes - so W-10 can become an implementable backlog item rather than a concept.
