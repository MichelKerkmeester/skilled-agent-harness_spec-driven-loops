# Iteration 8: Bot computer design beyond a worktree

## Focus

Broadening pass. The frontier is drained, so this iteration takes the second half of the **Uses** pair: what a bot's computer has to be for a small team, what skilled bots already has, and what a terminal genuinely cannot give. The angle is deliberately narrow — the previous iterations established that OpenBot's computer is a container with a browser, and the question here is which parts of that a CLI-first product must copy and which it can decline.

## Actions Taken

1. Read `state-root.ts`'s run-folder resolution and its refusals.
2. Read `repo-config.ts` and `status-index.ts` for run-folder retention.
3. Read `executor-config.ts`'s preventive-sandbox map and its per-kind comments.
4. Re-read `isolation.ts`'s header for what the worktree is and is not.

## Findings

1. Skilled bots **already keeps a per-run folder**: `runFolderPath` resolves to `<skilledTree>/.skilled/skills/.state/system-skilled-bots/<identity>/runs/<runId>`, created owner-only at mode `0700`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:366]
2. The run folder is **refused when the Skilled tree is a linked worktree**, "because worktree cleanup would delete the evidence", and refused when the path is not gitignored, "so a vendored tree that lacks the ignore line never puts run files in its git status". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:414]
3. The run folder is **retained per bot**: `runFoldersPerBot: 200`, and the reaper keeps any run folder whose needs-you item is still open or awaiting resume. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:83] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:521]
4. So the **"workspace volume" OpenBot gets from `agent-workspace:/workspace` already exists** in skilled bots as the run folder. The gap is not persistence — it is that the run folder is treated as *evidence* and never as a working directory the bot is told about.
5. The sandbox is **not a container**: `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` is true for only `cli-codex`, `cli-cursor` and `cli-deepseek-harness`. Every other kind's "sandbox" is a tool gate or an approval mode. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299]
6. The `cli-opencode` comment states the exact limit: "workspace-write denies external_directory to the file tools only (Bash can still write outside the working directory)". [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:307]
7. `cli-devin` **never passes `--sandbox` at all**: "confinement is the fan-out's post-hoc write-containment guard, not an OS boundary". [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:313]
8. The worktree is **a tree of the repo, not a home**: it links the launcher's shared paths "instead of a full install, so setup needs no network", and removal unlinks each recorded link "as a link, never followed". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:5]
9. OpenBot's computer gives **three things a worktree cannot**: a headed browser on its own X server, profiles that survive restarts, and a shell whose environment is the container's rather than the server's. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1]
10. Of those three, **only the browser is genuinely unavailable to a terminal**, and it is unavailable for a stated reason: bot checks such as Cloudflare's challenge treat headless worse. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1]
11. The smallest addition is therefore **not a container**: it is (a) telling the bot its run folder and starting its shell there, and (b) an opt-in headed browser behind one command rather than a per-bot computer. [INFERENCE: from findings 4, 5 and 10 — the run folder already provides persistence, the sandbox is executor-dependent rather than container-provided, and the only capability with no terminal equivalent is a headed browser]

## The smallest change, with size and risk

**Shape.**

- `HonoredPosture.runFolder` already exists on the record; add the same path to the **prompt preamble** and set it as the child's working directory when `isolation: shared`, so a bot that is not in a worktree still has somewhere to write that is not the operator's checkout.
- A `bots open <run-id>` verb that opens the run folder in the operator's own browser or file manager. Zero new machinery: the operator's browser already has their logins, which is the thing OpenBot's profiles volume exists to preserve.

**Size.** 20–40 lines for the working directory, 0 lines for the browser (it is a documented command, not code).

**Risk.** Low. The residual risk is that a bot writes into its run folder and the reaper deletes it after 200 runs — which is the correct behaviour for a scratch area and the wrong behaviour for an artifact, so the prompt must say which is which.

**What a desktop shell would add that a terminal cannot.** A headed browser with the operator's live sessions, and a place to type into a masked field. Both are things the *operator* does, not the bot, so a terminal plus the operator's own browser covers them without a Tauri shell.

## Ruled Out

- A per-bot container: it is the largest piece of OpenBot's computer and it exists to serve a browser farm. A small team runs one bot at a time on one machine.
- gVisor: OpenBot itself leaves it unset by default, and the executor kinds that matter already give an OS boundary.
- A profiles volume: the operator's own browser profile is the profiles volume, and it is already logged in.

## Dead Ends

- Looking for a browser capability in the executor matrix: there is none. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` covers web *search*, not a browser, so a headed browser is not something any executor kind can be asked for.

## Edge Cases

- Ambiguous input: "computer" could mean the sandbox, the workspace, or the browser. Selected interpretation: all three, answered separately, because the evidence shows they have three different answers.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:355-440
- .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:33,83
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:505-535
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-60
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:165-335
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1

## Assessment

- New information ratio: 0.85
- Questions addressed: what a bot's computer must be for a small team; what a terminal cannot give
- Questions answered: what a bot's computer must be for a small team; what a terminal cannot give

## Reflection

- What worked and why: reading the *retention* code rather than the isolation code. The isolation module says what a worktree is; the reaper says how long it lives, and that is what turns "a tree" into "a workspace".
- What did not work and why: assuming the sandbox was a property of the product. It is a property of the *executor kind*, and the map that says so is three files away from the posture module that enforces it.
- What I would do differently: start from `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` whenever a question mentions sandboxing. It is the only place that answers "is this a boundary or a gate", and every other file describes intent rather than enforcement.

## Recommended Next Focus

Cross-part coupling: how the apps and computer decisions constrain approvals, activity, routines and memory — specifically, which of the three new stores has to be readable by the status index and the needs-you path, and which can stay write-only.
