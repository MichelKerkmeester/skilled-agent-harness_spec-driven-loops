# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner`)
- Session: `fanout-accuracy-runner-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: D2 Security
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: safety of offering a mutating command, cross-runtime behaviour (claude, codex, opencode, pi, devin, dsh), holdout hygiene, docs that disagree with code.
- How this iteration addressed the focus: it audited the six runtime argv builders for the permission model each one hands a measured turn, the environment the child inherits, and the guards that are supposed to bound a turn that starts a writing workflow.
- `steer.md`: still absent; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1-300` (runtime argv table, caps, header threat model)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:480-525` (worktree guards, out-folder exemption)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:758-825` (environment builder, spawn)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:978-1081` (per-turn guards, head/stash check, restore)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:46-122`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-120`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:286-307` (daemon warm-up before replay)
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:85-120,145-190` (IPC isolation contrast)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-82,111-114`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A fully-permissioned measured turn inherits operator credentials and can reach hosts the repo-remote guard does not cover** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:782` -- Three of the six measured runtimes are started with every permission check disabled (`claude --permission-mode bypassPermissions` at `:125-127`, `opencode run --auto` at `:176-178`, `devin --permission-mode dangerous` at `:216-217`), and the header states the runner "takes the reach away before the model has it" (`:33-39`). The child environment only removes three GitHub token names and installs an empty git credential helper (`:768-774`, `:782-789`); it keeps `SSH_AUTH_SOCK`, cloud credentials, package-registry tokens and every provider key, so a shell-capable turn can `git push`, `ssh` or `curl` with the operator's own identity. The only network guard is "this repo has no git remote" (`:986-992`), which bounds pushes to this repository and nothing else. Post-turn restore covers worktree paths only (`worktree-restore.mjs:97-122`), and a commit or stash is detected after it happened (`:1017-1037`), not prevented.
Finding class: credential-exposure / execution-containment
Scope proof: all cited files are declared `accuracy-runner` scope; the finding is about the live-turn path the g2 set uses to start `/speckit:complete ... :auto`, not about any out-of-scope caller.
Affected surface hints: `run-command-behaviour.mjs` `childEnv`/`GITHUB_TOKEN_VARS`/`RUNTIMES`, the g2 set, `prepare-behaviour-arena.mjs` (the only containment layer), `measure-brief-cost.mjs` (which already demonstrates the missing IPC/daemon isolation), operator hosts reachable with `SSH_AUTH_SOCK`.
Case: an operator runs the g2 set from a prepared arena; the `/speckit:complete {fixture}/spec.md :auto` row starts a workflow with bypassed permissions, and any shell command it runs inherits `SSH_AUTH_SOCK`, so it can clone or push to an unrelated repository or read any host the operator's key allows, none of which the restore or the no-remote guard can undo.

```json
{
  "type": "claim",
  "claim": "Measured live turns run with all permission checks bypassed on three runtimes and inherit operator credentials beyond the three removed GitHub token names, so the stated 'reach is taken away' property holds for pushes to this repo only, not for network or filesystem reach under the operator's identity.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:33-39",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:125-127",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:176-178",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:216-225",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:768-790",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:986-992",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:97-122"
  ],
  "counterevidenceSought": "Checked whether the environment is otherwise scrubbed (no SSH/cloud/registry removal anywhere in the folder), whether an OS sandbox bounds the three bypassed runtimes (Devin explicitly has none at `:222-225`; Claude and OpenCode pass no sandbox flag), whether restore or the head/stash check could undo the action (both run after the turn and cover the worktree only), and whether the arena removes network reach (it removes the git remote, not the network).",
  "alternativeExplanation": "The fixture prompts are trusted, the arena has no remote, and a model doing a routing task is unlikely to run an SSH command on its own, so the exposure may be judged residual rather than reachable.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "Downgrade to P2 if the playbook or packet requires the arena to be run inside an environment that already removes SSH/cloud/registry credentials, and that requirement is machine-checked before a live arm starts."
}
```

### P2 Findings

2. **Containment is inferred from "no git remote" with no assertion that the checkout is a prepared arena** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:986` -- The arena builder is the only layer that provides a clean baseline, a clone with no outer hooks and a `.env*`-free tree (`prepare-behaviour-arena.mjs:5-34`), but the runner verifies only that `git remote` is empty. A local checkout that legitimately has no remotes satisfies the guard while carrying the operator's ignored build output, hooks and dotenv files, and nothing reads a marker, compares the checkout against the arena, or re-checks the fixture directory the prompts name.
Finding class: defence-in-depth
Scope proof: both files are declared scope; the finding concerns the precondition check, not a claim that any documented workflow already runs in such a checkout.
Affected surface hints: `runTurn` first-turn guard, `prepare-behaviour-arena.mjs` destination refusals, the g2 fixture path default (`run-command-behaviour.mjs:736-738`).
Case: an operator with a local clone that has no `origin` (a mirror stripped of remotes, or a fresh `git init`-style working copy) runs a live chat arm; the remote guard passes, and the run proceeds in a tree that never went through the arena's destination and dotenv checks.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | The header threat model (`run-command-behaviour.mjs:33-39`) claims reach removal that the environment builder does not implement; recorded as finding 1. |
| `agent_cross_runtime` | partial | Six measured runtime tables read; permission model per runtime: claude bypass, codex workspace-write + approval never, opencode auto, pi offline, devin dangerous with no sandbox, dsh workspace-write + approval never. |
| `playbook_capability` | pending | Playbook chapter not yet compared to the guards; deferred to the traceability iteration. |

## Integration Evidence

- Named surfaces: `run-command-behaviour.mjs` (live-turn executor), `prepare-behaviour-arena.mjs` (containment builder), `worktree-restore.mjs` (clean-up), `command-offer.mjs:294-307` (daemon warm-up that runs before each replay), `measure-brief-cost.mjs:99` (the project's own IPC-isolation pattern, absent from the live-turn path).
- Runtime permission matrix verified by reading each `buildArgv` entry: `:112-127`, `:139-156`, `:164-180`, `:189-201`, `:210-229`, `:240-260`.

## Edge Cases

- `steer.md` still absent; recorded, no ruling to apply.
- Cannot execute a live arm under containment, so the credential-reach claim is proved from the environment-builder source and the documented runtime flags, not from an observed exfiltration.
- The g2 fixture directory is not created by the runner; `prepare-behaviour-arena.mjs` prepares a clone but the runner never asserts the fixture exists. Recorded here and carried to the maintainability iteration rather than promoted as a separate finding without a reachable caller.
- Holdout prompt text remained unread: this iteration used id/label counts only.

## Confirmed-Clean Surfaces

- Codex and DSH both run with `workspace-write` plus `approval_policy=never` (`:149-155`, `:251-255`), so their writes are bounded by the harness sandbox rather than the arena alone.
- Pi runs `--offline` with a runner-minted session id (`:189-201`), so a chat turn cannot probe the network at startup and its transcript is unambiguous.
- The github token scrub and empty `GH_CONFIG_DIR` prevent an accidental `gh` write with the operator's account (`:768-790`).
- A commit or stash mid-turn stops the arm and records the changed paths instead of restoring over work it did not create (`:1017-1037`).
- The arena builder refuses a destination inside a repository and an existing destination, and skips every `.env*` file at every depth (`prepare-behaviour-arena.mjs:26-34,43-66`).

## Ruled Out

- `--auto` on OpenCode as an unconditional finding: the arena plus the no-remote guard is the documented containment model, and auto-approval is required to observe an ask row at all (`:176-178`). Folded into finding 1 as a contributing runtime, not reported separately.
- Codex approval gate bypass via `--print-argv`/`--list`: those modes spawn no turn (`:1126-1133`), so the gate is irrelevant there. No finding.
- Prompt leak via argv: corpus prompts are not secret and holdout ids are refused before a prompt reaches argv (`:583-594,724-727`). No finding.

## Next Focus

- Dimension: traceability
- Focus area: does the packet and the playbook describe what the harness actually does (arena precondition, exit codes 2/3, `offerReached` semantics, holdout splits), and do the tests hold the documented behavior.
- Reason: iteration 2 establishes the security posture; the remaining review-focus item with evidence value is whether an operator following the documented path reaches the safe path, especially the arena precondition from finding 2.
- Rotation status: D2 security complete, D3 traceability next.
- Blocked/productive carry-forward: productive (runtime table + environment builder); blocked (no live execution evidence).
- Required evidence: `manual-testing-playbook/manual-testing-playbook.md`, `native-cli-tools/hub-command-attachment.md`, `runtime/tests/README.md`, `command-offer.vitest.ts`, `command-transcript-score.vitest.ts`, and the packet's own capability claims.

Review verdict: CONDITIONAL
