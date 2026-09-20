---
title: Official Orca Skill - Orchestration
description: Discovery-stub reference for the official orchestration skill, which coordinates supervised Orca workers through Runs, Tasks, Dispatches, threaded messages, blocking ask and reply, coordinator loops and task DAGs.
trigger_phrases:
  - "orca orchestration"
  - "supervised orca workers"
  - "orca coordinator loop"
  - "orca task dag"
  - "orca worker done"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skill - Orchestration

Local reference for the official `orchestration` skill. Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`.

---

## 1. OVERVIEW

The stub declares coordinated supervision of Orca workers: threaded messages, blocking ask/reply flows, task dispatch, `worker_done` and escalation waits, task DAGs, decision gates, coordinator loops and decomposing work across agents (snapshot: skills/orchestration/SKILL.md, frontmatter).

The stub states its own status and the reason for its shape: "This file is a discovery stub, not the usage guide. The full, version-matched Orca orchestration reference is served by the `orca` binary itself — kept out of this file on purpose so it can never drift from the binary that will actually run your commands." (snapshot: skills/orchestration/SKILL.md, stub body). The full guide is deliberately withheld from the stub so it cannot drift from the binary that runs the commands. The guide loads with `ORCA skills get orchestration` (snapshot: skills/orchestration/SKILL.md, Load the version-matched guide before running Orca commands). That prints the compact version-matched guide for the exact binary handling the next commands, covering the normal local coordinator loop. For a conditional action gate such as remote placement, uncertain release recovery or expanded DAG work, load only the reference that gate names with `ORCA skills get orchestration --reference references/<file>.md`, where `--references` lists the names. If the binary rejects `--reference`, run `ORCA skills get orchestration --full` and read the named bundled reference before acting (snapshot: skills/orchestration/SKILL.md, Load the version-matched guide before running Orca commands).

The guide opens by positioning the layer: orchestration records who owns work, which attempt is authoritative, and when supervised work has settled (guide: skill-guides/orchestration.md, Orca orchestration).

---

## 2. ROLE ROUTING

The guide routes every agent context to one role with a fixed action (guide: skill-guides/orchestration.md, Classify the role):

| Current context | Role | Action |
|---|---|---|
| The user explicitly asks to supervise, monitor, wait for results, track completion, coordinate a DAG, use a decision gate or manage ask/reply | Coordinator | Use the supervised loop |
| The current prompt contains a live injected preamble with Task and Dispatch IDs | Dispatched worker | Follow the preamble and the worker obligations |
| The user asks to hand off ownership or start another agent or worktree without supervision | Handoff owner | Use `orca-cli`, create no Run, Task or Dispatch and do not monitor completion |
| A message carries a legacy authority label | Compatibility operator | Load the legacy contract reference before any lifecycle mutation |
| No live preamble and no explicit supervision | Ordinary terminal agent | Do not emit lifecycle messages and use `orca-cli` for terminal and worktree work |

Model or effort selection does not make a handoff supervised, and a non-Orca subagent tool is never substituted when Orca orchestration provenance was requested (guide: skill-guides/orchestration.md, Classify the role).

---

## 3. THE COORDINATOR LOOP AND WORKER OBLIGATIONS

The supervisor shape at a high level, from the guide's kernel:

- **Run, Task and Dispatch.** A Run is a durable namespace and coordinator inbox and does not schedule or place workers. A Task is work. A Dispatch is one authoritative Task attempt. Lifecycle authority comes from the active Dispatch, not a terminal title, copied ID, old database row, provider transcript or visible pane (guide: skill-guides/orchestration.md, Authority and safety floor). The loop confirms the runtime, binds one Run with `ORCA orchestration run-create --objective "<objective>" --json`, starts workers with `ORCA orchestration worker-start --spec "<task>" --worktree current --agent <id> --json`, and waits with `ORCA orchestration check --wait --types "worker_done,escalation,question" --timeout-ms 900000 --json` (guide: skill-guides/orchestration.md, Canonical supervised loop).
- **Liveness verdicts.** The fleet verdict is `worker-list`'s `projection.liveness`, preserved as `live`, `unverifiable` or `exited`, while `worker-show`'s `observation.status` is PTY liveness only, so a live terminal can still hold a dead or stuck agent. Contact loss is not process death, and only positive proof of exit authorizes stop, abandon or retry (guide: skill-guides/orchestration.md, Authority and safety floor).
- **Blocking ask and reply.** A dispatched worker does only the current Task and uses the preamble's `ask` command for a blocking coordinator question, resuming the same message ID after an ask timeout. The coordinator processes every delivered message before acknowledgment, replying with `ORCA orchestration reply --id <message_id> --body "<answer>" --json` (guide: skill-guides/orchestration.md, Worker obligations and Canonical supervised loop).
- **Completion accounting.** After an accepted success or failure report the coordinator does exactly one of three things: reuse the same proven agent terminal for an immediate follow-up Dispatch, record user-requested retention with `worker-retain`, or run `worker-release`. Release is post-settlement cleanup, not cancellation, and only an accepted settlement authorizes it (guide: skill-guides/orchestration.md, Completion accounting).
- **The settlement rule.** A valid `worker_done` settles the Task and Dispatch automatically, so the coordinator must not follow it with `task-update --status completed`. The coordinator enumerates terminals still owing a decision with `worker-list --run <run_id> --terminal-state reclaimable --json` and does not end its turn until that returns none (guide: skill-guides/orchestration.md, Completion accounting).
- **Worker obligations.** The injected preamble is authoritative. The worker sends heartbeats only at the preamble's cadence, reads coordinator follow-ups at natural checkpoints, sends `worker_done` exactly once with a three-sentence executive summary, both lifecycle IDs and explicit `--outcome succeeded` or `--outcome failed`, and idles after `worker_done` without polling or starting new work (guide: skill-guides/orchestration.md, Worker obligations).

---

## 4. BOUNDARIES

- The stub routes terminal work away from this skill: use `orca-cli` for full ownership handoffs, and for terminal control, lightweight terminal prompts, shell commands, Orca worktree management, and reading or waiting on terminals, unless the user asked to supervise, monitor or coordinate a DAG (snapshot: skills/orchestration/SKILL.md, frontmatter and stub body).
- The handoff owner role creates no Run, Task or Dispatch and does not monitor completion (guide: skill-guides/orchestration.md, Classify the role).
- Coordination requires real Orca runtime state: never substitute a non-Orca subagent tool (snapshot: skills/orchestration/SKILL.md, stub body). Orca orchestration provenance is never replaced by a non-Orca subagent tool (guide: skill-guides/orchestration.md, Classify the role).
- The ordinary terminal agent role emits no lifecycle messages and uses `orca-cli` for terminal and worktree work (guide: skill-guides/orchestration.md, Classify the role).

---

## 5. NAME COLLISION WARNING

The local `cli-external-orchestration` hub is a different thing from this official `orchestration` skill. The hub dispatches external CLI executors, while the official skill coordinates supervised Orca workers (local skill contract: SKILL.md, The eight official Orca skills). Routing on a bare "orchestration" token without the Orca qualifier risks landing on the wrong one, and this skill's router requires an Orca-qualified phrase or a named Orca surface before it routes at all (local skill contract: SKILL.md, When NOT to Use).

---

## 6. RELATED RESOURCES

- The version-matched guide served by the binary is authoritative for flags: load it with `ORCA skills get orchestration` (snapshot: skills/orchestration/SKILL.md, Load the version-matched guide before running Orca commands).
- This skill defers supervised coordination to the official surface. The local `cli-orca` skill keeps lightweight terminal prompts and full handoffs (local skill contract: SKILL.md, Integration points).
- The verbatim upstream stub is snapshotted at `assets/orchestration.txt` with its release record in `assets/PROVENANCE.md` (local skill contract: SKILL.md, References).
- The local handoff command families live in `references/orca-cli-reference.md` and the receipt and runtime detail in `references/session-and-runtime.md` (local skill contract: SKILL.md, References).
