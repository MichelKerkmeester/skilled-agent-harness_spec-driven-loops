---
title: "Goal: prove, publish and close the .skilled migration"
description: "The durable directive for the final phase, which proves the new source root on every runtime and gate, pushes the verified SHA to skilled/v4.0.0.0 and main, reconciles this machine and closes the parent criteria."
trigger_phrases:
  - "skilled rollout phase goal"
  - "skilled verification phase goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/011-verification-and-rollout"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the directive for the final phase"
    next_safe_action: "Start when phase 010 validates PASSED"
    blockers: []
    key_files:
      - "plan.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-011-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: prove, publish and close the .skilled migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the `.skilled` source root on all seven runtimes and every gate at one pinned SHA, publish that SHA to `skilled/v4.0.0.0` and `main` and leave this machine reconciled and clean.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Verify, then publish, one pinned SHA. Every proof runs at `TIP`, only `TIP` is pushed and a moved remote tip means rebase and re-verify, three rounds at most. |
| D2 | A verdict comes from an affirmative marker, a canary token or a mutant that fails. An exit status alone decides nothing, and a gate that cannot show it ran counts as red. |
| D3 | DeepSeek V4.1 Flash max on cli-pi takes read-only units (residue areas, census and log triage) and writes nothing. GPT-5.6 on cli-codex reviews the evidence before the first push. The orchestrator runs smoke tests, gates, pushes, CI verdicts and cleanup. |
| D4 | A bypass variable rides on one push command, and the mass-deletion bypass also needs a pairing check with no unpaired deletion. Worktree removal and any history rewrite wait for the operator's yes, because parent D2 does not pre-authorize them. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] 21 canary cells, seven runtimes by skill, command and agent, return their `.skilled/` token, and no negative control does
- [ ] 13 local gates pass at the pushed SHA, each with its affirmative marker recorded
- [ ] The residue scan finds 0 residue files and its planted control, and the independent check passes its control and fails every mutant
- [ ] `origin/skilled/v4.0.0.0` and `origin/main` equal the verified SHA, and every expected CI run for it concluded `success`
- [ ] The main checkout carries the verified SHA, and all 7 global hook links resolve from it
- [ ] All eleven phases validate `RESULT: PASSED`, and the parent's six criteria are checked with receipts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, authored 2026-09-16. Strict validation passes every content rule. Its two errors are the generated-metadata rules on `description.json` and `graph-metadata.json`, and its one warning is `implementation-summary.md`, all outside this authoring pass |
| Pins and pre-flight | Done | `TIP` `48e5740f3beb85e85a107032f42d45f0420ebf3d`, `BASE` = `OLD_V4` = `OLD_MAIN` = `3717ac8854bcc755e8d56591ab3b2d0d21484105`. All seven runtime CLIs, `gh`, `rg` and Hermes trust read live. No rebase was needed: the remote base was already an ancestor |
| Runtime canaries | Done | A token per surface, planted after the frontmatter and removed afterwards. Codex, Hermes, opencode and Pi answered all four cells; Claude answered skill and command; Devin answered its skill cell and its listing shows the new root. The eight resolving copies all point under the worktree's new root, and the three pointer stubs name the new command path |
| Local gate matrix | Done | G01, G02, G03, G04, G05, G07, G08, G09, G10 and G13 pass with their own markers: 2 drift guards, `checked=13 passed=13`, the naming guard's clean run, four byte-identical index fixtures, 154 deep-loop files and 2,684 tests, 68 Hermes copies in sync, and 12 of 12 packets `RESULT: PASSED`. G06, G11 and G12 each carry only failures that reproduce at `BASE` |
| Tree shape and residue | Done | The new root holds all ten authored directories; the old root is one entry at mode 120000 and no link dangles. The scan enumerated 37,739 files and 1,152,114 lines, 1,298 files outside frozen history, and a planted control in a clone proved the pattern catches both a markdown and a JSON mention |
| Published | Done | `skilled/v4.0.0.0` and `main` both at `48e5740f3b`, pushed with no bypass variable. CI: 11 of 12 runs green; `Playbook Operator Contract` fails 3 packages where `BASE` fails 5, so the push removed two failures and added none |
| Machine proofs from the primary | Done | Seven hook links resolve, `core.hooksPath` unchanged, 18 Codex identities on the new root and none on the old, one Codex header and two Pi manifest lines on the new root |

### Deviations and findings

| Item | Note |
|------|------|
| Remote refs at planning time | `origin/main` and `origin/skilled/v4.0.0.0` both pointed at `728c4f3efc` as of the last fetch, so both pushes were fast-forwards on 2026-09-16. T006 and T033 re-check this at execution time |
| Four grandfathered snake_case names | Observed 2026-09-16 by running the naming guard's own functions over the 17,767 tracked paths under `.opencode/`: `commands/prompt/assets/prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`, `prompt_improve_presentation.txt` and the fixture `skills/system-spec-kit/runtime/cli/tests/fixtures/grep-convention/naming-exception/Spec_Draft.md`. The guard treats a moved name as new, so G03 and CI report all four unless phase 005 or 007 handles them |
| Primary checkout dirty | On 2026-09-16 the primary checkout carried a tracked change to `council-graph.sqlite` and 21 untracked entries. Step 5b cannot fast-forward over that without the operator |
| Push policy document drift | `remote-branch-policy.md:38-39` says `skilled/v*` is hardcoded. `worktree-naming.sh:152-158` builds in only `main` and reads release branches from the allowlist file, and `pre-push:128-130` skips `skilled/v*` entirely. Both pushes pass either way |
| Deep-loop baseline unrecorded | The figure of 154 files and 2,681 tests comes from the dispatch brief. No packet file records it, so T007 re-captures it at `BASE` |
| Seven PR-only workflows | A direct push never runs them, so gate G11 runs them locally before the push |
| A regression the canaries did not catch, but CI did | The remote-push allowlist resolver named only the new root, so a checkout carrying just the legacy root found no allowlist file and narrowed the operator's approvals back to `main` without saying so. The pre-push suite was 32 of 32 at `BASE` and 31 of 32 at the tip. Fixed at `48e5740f3b` by trying the real directory first and falling back to the legacy one; all six hook suites are green again and CI's Gate Inputs passes on both branches |
| The installer had the same shape of bug | `install-git-hooks.sh` preferred the legacy root, which a link always satisfies, so the first relink recorded seven targets that reach their scripts through the link. Fixed in phase 010 at `974d27e29b` |
| A probe clone proves nothing without dependencies | Both the old-layout hook probe and the playbook validator failed on a missing workspace package in a fresh clone, which looks like a finding and is not one. Linking the installed package directories in made both runs meaningful |
| The Claude agent cell cannot have a clean control | Claude Code injects the agent roster into every session, so the fork's token appears in a bare probe as well. Its skill and command cells still discriminate, and the other six runtimes' controls are clean |
| Cursor was out of account quota | All four Cursor cells returned `ActionRequiredError: You're out of usage`. The resolve census still shows its command and agent files pointing into the tree, which is the part the move could have broken |
| Devin cannot run a subagent cell non-interactively | It rejects a tool call that needs confirmation unless the permission mode is widened, which this phase did not do. Its skill cell and its skills listing both read the new root |
| The residue resolve test over-counts | 7,497 of 10,558 distinct path tokens do not resolve, and the ones sampled are deliberate fixtures such as `gone.cjs`, `missing.sh` and `probe.md`, plus another project's path. The classification of record is phase 009's rescan, which reports zero unclassified at this tip |
| CI keeps reading the legacy root by design | 25 workflow files name `.opencode/...` paths, routed to phase 005 so that CI runs on pre-move commits too. They resolve through the retained link |
| Parent criterion 3 wording | Codex and Pi agents and Devin commands have no non-interactive surface that reads `.skilled/` directly. If phase 004 keeps the `.claude/agents` fork, Claude Code, Cursor and Devin agents read the fork too. If generated-copy and fork proofs do not satisfy the parent wording, the criterion needs an amendment applied to the parent first |
<!-- /ANCHOR:log -->
