---
title: "Implementation Summary: The alignment findings on the session relaunch remediation are fixed"
description: "Two wrapper defects are fixed with failing-first tests, and the documents, env rows, playbooks, routing signals, release notes and changelog ceilings that describe the session relaunch loop now match what the branch ships."
trigger_phrases:
  - "alignment findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings"
    last_updated_at: "2026-11-12T18:49:24Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 008 and reran the goal gate"
    next_safe_action: "Await the local merge of worktree 351 into main"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/bin/skilled-loop"
      - ".skilled/skills/system-spec-kit/graph-metadata.json"
      - ".skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py"
      - ".skilled/changelog/skilled/v4.0.2.1.md"
    session_dedup:
      fingerprint: "sha256:9093f1a522284cb48dfcc2c27aa6c5ef031e24aa62640b8cfb1e2124cc79ed45"
      session_id: "scaffold-008-alignment-findings"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "6f6d0815-5182-4dab-96b0-b36b0b73deea"
      workspace: "/Users/michelkerkmeester/worktrees/public/351-session-relaunch-review-remediation"
      savedAt: "2026-11-12T18:49:24Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-alignment-findings |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A symlink cycle at the wrapper path no longer hangs your shell, and an attached short option value such as `-H"x: y"` no longer swallows the prompt after it on a hop. Every document, env row and playbook that describes the shim's trust rule, the option replay, the unknown Claude window and the seven denied sub-agent commands now says what the code does.

### Phase 8: alignment-findings

The alignment report of 2026-11-12 read the first three commits of this branch and returned 28 findings. Two were code defects in the shell shim and the wrapper. The rest was drift: documents that still described the behavior from before phases 001 to 007, a variable only an operator sets that no env document listed, a playbook with no scenario for the new `window` subcommand, a cli-opencode skill that changed a rule without a version raise, and two skills whose routing vocabulary did not name the new features.

You can now find `SKILLED_LOOP_TRUSTED_CHECKOUTS` in `.env.example` and `ENV-REFERENCE.md`, read the trust limit wherever the shim is described, run two new playbook scenarios for the window, and ask the advisor about a doctor setup run or a declined hop and get the owning skill. The changelog shape checker allows 280 lines, 32 H4 items and 14 glance bullets, which the operator chose so the v4.0.2.1 release note passes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop-shell.sh` | Modified | `skilled_loop_real_path` counts symlink hops and returns 1 after 40 |
| `.skilled/bin/skilled-loop` | Modified | The value-taking replay branch consumes a following word only when the option value is not attached |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modified | Adds the symlink cycle case for bash and zsh |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Adds the attached short option value case |
| ``README.md`, `.skilled/bin/README.md`, `.skilled/hooks/README.md`, `.skilled/hooks/session-relaunch/claude/README.md`` | Modified | State the shim trust limit, the option replay, the `/doctor:setup` window line and the seven denied commands |
| ``.skilled/skills/system-spec-kit/README.md`, its feature catalog root and `session-relaunch-loop.md` entry` | Modified | State the trust limit, the unknown window skip and the option replay |
| ``.env.example`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`` | Modified | List `SKILLED_LOOP_TRUSTED_CHECKOUTS` and replace the model-default window fallback |
| `Three session-relaunch playbooks and the playbook root under `.skilled/skills/system-spec-kit/manual-testing-playbook/`` | Modified | Add scenarios CL-8 and CL-9 and name the trusted wrapper in the source tables |
| `cli-opencode `SKILL.md`, two playbook scenarios, the playbook root and `changelog/v1.5.10.0.md`` | Modified and Created | Exempt `OPENCODE_API_KEY` in CO-001, add the key-only step to CO-008, raise the version to 1.5.10.0 |
| ``.skilled/skills/system-spec-kit/graph-metadata.json`, `.skilled/skills/system-skilled-doctor/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`` | Modified | Add seven and six routing signals and `setup.md` as a key file, then recompile the graph |
| `.skilled/skills/system-skilled-doctor/README.md` | Modified | The `/doctor:setup` row names the Claude context window line |
| ``check_changelog_shape.py`, `scripts/README.md`, `SKILL.md`, `README.md` and `assets/changelog-template.md` of sk-create-changelog` | Modified | Raise the three ceilings to 280, 32 and 14 |
| `Four compiled-routing manifests for the `cli-external-orchestration` and `sk-doc` hubs` | Modified | Re-minted after the two hubs' skill files changed |
| ``specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md`` | Modified | The first completion criterion says 36 phase folders |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at max built every change through OpenCode Go in six dispatches: the two code fixes test first, the literal document corrections, the playbooks and the cli-opencode changelog, the routing signals, and two small follow-ups for a stale sentence the first sweep missed. The orchestrator wrote each brief with literal replacement text, read every diff and reran every command. Both new tests failed before their fix: `scratch/red.txt` holds the two timeouts of the cycle case and `scratch/red-2.txt` the replayed prompt. The final runs are `scratch/green-full.txt`, `scratch/green-opencode.txt` and `scratch/green-pi.txt`. The seven advisor routing suites ran before and after the signal change, 75 tests each time. The orchestrator stopped the routing dispatch after 30 minutes, when its remaining rounds could not change the two probes the scorer floors by design. The evidence is pinned to the working tree on branch `worktrees/351-session-relaunch-review-remediation` above commit `bd2142a4fd`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The hop bound is 40 | It is the usual symlink depth limit of the platform, and a real wrapper path never needs more than a few hops |
| Probes P04 and P06 stay unrouted | The advisor floors a read-only explainer prompt at 0.25 confidence in `fusion.ts`, so `show` and `explain why` prompts abstain by design. `system-spec-kit` is first on both, and the same prompt opened with `set` scores 0.95. Changing the floor is a scorer decision outside this phase |
| `BASH_VERSION` and `ZSH_VERSION` went into the env check's platform tokens | The shell sets them, so listing them in `.env.example` would be wrong. The token list is the producer of the false finding |
| The ceilings are 280, 32 and 14 | The operator chose to raise them. These are the smallest round values the v4.0.2.1 note passes with: it holds 274 lines, 31 H4 items and 13 glance bullets |
| The stale shim sentence was fixed in four more documents than the report named | A search for the same wording found it in three playbook source tables and `.skilled/hooks/README.md`. Leaving them would repeat the finding |
| The two hub manifests were re-minted before the commit | A changed `SKILL.md` drops its hub to legacy routing until the manifest is minted again, which made three probes fail for an unrelated reason |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 868 tests, 868 pass, 0 fail, exit 0, in `scratch/green-full.txt` (865 before this phase) |
| The two new cases before their fix | FAIL as required: 2 of 2 in `scratch/red.txt` by timeout, 1 of 1 in `scratch/red-2.txt` |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass, exit 0 |
| Pi vitest suite | PASS: 59 passed, exit 0 |
| Seven advisor routing suites, golden prompts and the three ratchets included | PASS: 7 files, 75 tests, the same as before the signal change |
| `run-probes.cjs` on the ten probes | 8 pass, 2 fail (P04, P06), against 4 pass and 6 fail in the report. Output in `scratch/probes-after.json` |
| `skill-graph-freshness.cjs --strict`, `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`, `compiled-route-guard.cjs` | PASS: each exit 0 |
| `check_changelog_shape.py` on `v4.0.2.1.md` and on cli-opencode `v1.5.10.0.md` | PASS for both |
| `check-env-tokens.cjs` on the report's scope | PASS: `STATUS=OK`, `unlisted=0` (2 unlisted in the report) |
| `check-comment-hygiene.sh` and `quality-gate.cjs` on the five changed code files | PASS: exit 0, no finding |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two probe prompts still return no skill.** `show the Claude context window the session relaunch nudge measures against` and `explain why the relaunch nudge is silent because no context window is configured` are read-only explainer prompts. The scorer floors them at 0.25 confidence. The fix would be an entry in the scorer's read-only route allow-list, which is not part of this phase.
2. **One edit sits outside the worktree and in no commit.** `.skilled/commands/assets/local-skilled-alignment` is a symlink to the primary checkout's gitignored local command assets. The two platform tokens were added to `surface-map.yaml` there. Removing the lines `- BASH_VERSION` and `- ZSH_VERSION` undoes it.
3. **A2 has a test for one runtime.** The attached-value case runs for `cursor -H`. The same branch serves every runtime's value-taking options, and no second runtime has a case.
4. **No live hop was run.** The phase changes the shim and the wrapper and is covered by the unit suites only.
<!-- /ANCHOR:limitations -->

---


