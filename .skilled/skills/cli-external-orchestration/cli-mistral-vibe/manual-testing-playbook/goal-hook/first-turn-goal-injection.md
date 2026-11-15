---
title: "VIB-GOAL-002 -- First-turn goal injection"
description: "This scenario validates that the single session_start hook is registered and that a bound first turn received the packet's goal slice in the session journal."
version: 1.0.0.0
---

# VIB-GOAL-002 -- First-turn goal injection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-GOAL-002`.

---

## 1. OVERVIEW

This scenario validates the goal hook end to end on a recorded keyed turn. It focuses on the registration count and on the journal record that shows the slice reached the first user message.

### Why This Matters

A passing unit suite does not prove the hook is declared, and a declaration does not prove the runtime called it. The registration is one `session_start` entry in `.vibe/hooks.toml`, and the proof that it fired is the packet's Objective line inside a block tagged `vibe.hookContext: true` in the session journal. A caller that reads only the reply cannot tell whether the model saw the goal or guessed it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the hook is registered once and that a bound first turn carried the packet's goal slice.
- Real user request: `Confirm the Vibe goal hook is registered once and that a bound first turn actually received the packet's goal slice.`
- Prompt: `Quote the line in your context that starts with "**Objective:**" exactly, then stop. Use no tools.`
- Expected execution process: Count the `session_start` declarations in `.vibe/hooks.toml` -> count the `vibe.hookContext` tags and the Objective phrase in the recorded journal -> read the recorded `export.json` pair.
- Expected signals: `rg -c 'session_start' .vibe/hooks.toml` prints `1`. The journal carries `vibe.hookContext` and the packet's Objective line. `export.json` records `exit_code` `0` and `outcome` `finished`.
- Evidence: The three command transcripts with their counts, and the recorded `export.json` pair.
- Desired user-visible outcome: A clear statement that the hook is registered once and that the bound turn received the slice, with the journal path.
- Pass/fail: PASS if the registration count is `1`, the journal carries the hook-context tag and the Objective line, and the recorded pair is `0`/`finished`. FAIL if the count differs, the journal lacks the tag or the line, or the pair differs.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Count the `session_start` declarations in `.vibe/hooks.toml`.
2. Count the hook-context tags and the Objective phrase in the recorded journal.
3. Read the recorded `export.json` pair.
4. Read each exit code.

### Commands

```bash
rg -c 'session_start' .vibe/hooks.toml
rg -c 'vibe\.hookContext' specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/session/journal/0000000000000001.jsonl
rg -c 'Give every Vibe dispatch bound to a packet' specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/session/journal/0000000000000001.jsonl
node -e 'const j=require("./specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json"); console.log(j.exit_code, j.outcome);'
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Basis: recorded evidence from an earlier keyed run, not a run started by this review. The journal and the record named above exist, and the counts and the pair below were read from them.
- Observed: `rg -c 'session_start' .vibe/hooks.toml` printed `1` and exited `0`.
- Observed: `rg -c 'vibe\.hookContext'` over the journal printed `3` and exited `0`; the Objective phrase count printed `6` and exited `0`.
- Observed: the recorded `export.json` printed `0 finished`.
- Observed: the journal's first user message carries the packet's goal slice in a block tagged `vibe.hookContext: true`, beside the session context and the startup warnings.
- Caveat: the recorded run trusted the checkout root and ran from the root on purpose so the project hook would load. A scratch-cwd dispatch and a fan-out lineage trust only their own folder, so the project hook does not load there; they get the slice from the hooks `render-home-hooks.cjs` writes into their home, when `VIBE_SPEC_FOLDER` names the packet. A keyed scratch-cwd run with the home file quoted the Objective line; its record is under `011-vibe-context-and-goal-hooks/scratch/scratch-cwd-home-hooks/`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-GOAL-002 | First-turn goal injection | Prove one registration and a slice in the first turn | `Quote the line in your context that starts with "**Objective:**" exactly, then stop. Use no tools.` | 1. `rg -c 'session_start' .vibe/hooks.toml` -> 2. `rg -c 'vibe\.hookContext' <journal>` -> 3. `rg -c '<Objective phrase>' <journal>` -> 4. read the recorded `export.json` pair | Step 1: `1`. Step 2: `3`. Step 3: `6`. Step 4: `0 finished` | The three command transcripts and the recorded record `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json` | PASS if the count is `1`, the tag and the Objective line are present, and the pair is `0`/`finished`. FAIL otherwise | 1. If the count is not `1`, read `hooks.toml` for a second `session_start` entry. 2. If the tag is absent, confirm the run trusted the checkout root. 3. If the Objective line is absent, confirm `VIBE_SPEC_FOLDER` named a packet with a `goal.md` |

### Failure Triage

1. If the registration count is not `1`, read `.vibe/hooks.toml` for a duplicate `session_start` entry.
2. If the hook-context tag is absent, confirm the run's folder was trusted; an untrusted folder loads no project hook and reports no error.
3. If the Objective line is absent, confirm `VIBE_SPEC_FOLDER` named a packet with a `goal.md` and that `goal.cjs packet` prints a `chat_slice`.
4. If the pair is not `0`/`finished`, read `stop_reason` and `error` from the same record.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the recorded-evidence policy |
| [SKILL.md](../../SKILL.md) | The session-start hook and the goal-slice contract |
| [guards-and-hooks.md](../../references/guards-and-hooks.md) | The `session_start` seam, `additional_context` and the fail-open rule |
| [runtime-folder-and-sync.md](../../references/runtime-folder-and-sync.md) | The trust gate and the home isolation that decide whether the hook loads |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/hooks.toml` | The single `session_start` declaration |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | The composing hook |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | The slice renderer |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json` | Recorded outcome record for the cited turn |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/session/journal/0000000000000001.jsonl` | Journal that carries the injected slice |

---

## 5. SOURCE METADATA

- Group: Goal And Context Hook
- Playbook ID: VIB-GOAL-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/first-turn-goal-injection.md`
