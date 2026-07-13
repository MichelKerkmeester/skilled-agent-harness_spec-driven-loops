---
description: "Benchmark an AI-system packaging with an independent grader and auto-refine its technique docs behind hard guardrails (Lane D). Dry-run default; --live runs the guarded loop. Modes :auto, :confirm."
argument-hint: "<packaging_root> [:auto|:confirm] [--self-target <profile>] [--live] [--max-iters=N] [--fixtures=A,B] [--variants=A,B] [--held-out=A,B] [--samples=N] [--proposer-model=ID] [--grader-model=ID] [--parallel]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
skill: system-deep-loop
---

# Deep Start AI System Improvement Loop

Lane D of the `deep-improvement` skill. Benchmarks an **AI-system packaging** (one prompt system shipped as CLI runtime, claude.ai Project and native skill), re-grades outputs with an **independent different-family grader**, and runs a **guarded autonomous refine loop**: propose a bounded technique-doc edit, verify it against held-out fixtures inside an isolated git worktree, and promote or roll back. Self-reported quality scores are never the optimization target (the pilot measured them inflated ~+6/25 versus independent graders).

## 1. ROUTER CONTRACT

Thin router for the guarded refine loop. This command verifies the runtime agent, resolves setup and execution mode, runs the self-target fork when requested, loads the presentation contract, then executes the owned workflow YAML. All guarded-loop logic — frozen scoring surface, kill-switches, worktree promote-N, resume — lives with the packaging and the workflow YAML, never inline in this document.

Load the presentation contract before showing startup questions, resolved-input confirmations, result output, failure output, or next-step prompts.

> **EXECUTION PROTOCOL - READ FIRST**
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates - do them in order, skip neither):**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run the Mandatory Input Gate (below) - resolve ALL inputs (in :confirm/no-suffix, present them and wait for confirmation; in :auto, resolve confidently or fail fast naming the missing inputs)
> 3. Load the matching workflow YAML and execute it only after both gates pass
>
> This command is **general-agent based** - it orchestrates the deep-improvement skill in non-dev-ai-system-refine mode (Lane D). Gate 1 (dispatch-context check) and Gate 2 (the BLOCKED input gate) are HARD BLOCKS; neither may be skipped. Guarded-loop execution itself is owned by the workflow YAML.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:ai-system-improvement (typed by the
user, or an explicit Task delegation naming this exact command) -- as opposed to
another agent pasting this file's raw content into a Task-dispatch prompt as inline
ad hoc instructions for a worker to follow (that worker should follow its own
dispatch prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Read `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` and `references/non_dev_ai_system/operator_guide.md`, then continue to the Mandatory Input Gate (also a HARD BLOCK)
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-improvement skill in    │
    │   │ packaging-refine mode and runs general-agent based.        │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:ai-system-improvement [arguments]                  │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability (e.g. "can I orchestrate a workflow") -- that question is unanswerable
from the inside and is what caused the original false-positive block. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

**STATUS: ☐ BLOCKED** — resolve ALL inputs below before loading the workflow YAML. In `:confirm`/no-suffix, present the resolved inputs and wait for confirmation; in `:auto`, resolve confidently from arguments/defaults or fail fast naming the missing inputs. Do NOT load the YAML until inputs are resolved.

**YAML START CONDITION**: do not load the workflow YAML until `general_agent_verified`, `packaging_root`, `live`, and `execution_mode` are bound (the self-target fork below resolves `packaging_root` when `--self-target` is used; `max-iters`, `fixtures`, `variants`, `held-out`, `samples`, `proposer-model`, and `grader-model` stay unset when absent). Markdown owns setup; the YAML owns dispatch.

Resolve:
- **packaging root** (required) — must implement the `_loop/loop.py` contract (see the operator guide's Contract Conformance Checklist; pilot: `…/AI_Systems/Barter/Copywriter`).
- **self target** (optional) — `--self-target <profile>` is a router-owned setup shortcut. A bare profile ID resolves under `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/`; a path resolves directly. The profile JSON must validate against `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json` and must define `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, and `excludedSessionPrefixes`.
- **live** — default FALSE (dry-run: gates + grader-family guard + gap analysis, zero dispatches). `--live` dispatches models and may promote into an isolated worktree branch; it requires a clean tree (the loop refuses uncommitted knowledge-base or shared-global-doc changes).
- **max iters** — live-loop ceiling (default 1 for a first run).
- **fixtures / variants / held-out / samples** — optional overrides of the packaging's defaults; held-out fixtures must be non-interactive (deliverable-producing) and the proposer never sees them.
- **proposer / grader models** — optional; the grader MUST be a different model family than the proposer (the loop kill-switches otherwise).

Pre-flight before any `--live` run: verify no other loop run is active (single-writer lock), and probe provider auth before the batch (an expired credential fails the whole batch — pilot teaching T11).

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_ai-system-improvement_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_ai-system-improvement_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_ai-system-improvement_confirm.yaml` |
| Loop host (dispatch target) | `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` (`--mode=non-dev-ai-system-refine`) |
| Adapter (contract validation + spawn) | `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` |
| Self-target profiles + schema | `assets/non_dev_ai_system/profiles/`, `assets/non_dev_ai_system/packaging_config.schema.json` |
| Operator guide | `references/non_dev_ai_system/operator_guide.md`, and the packaging's own `_loop/` contract |

No workflow-asset gap exists for this command.

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat the packaging root, `--self-target`, `--live`, `--max-iters`, `--fixtures`, `--variants`, `--held-out`, `--samples`, `--proposer-model`, `--grader-model`, and `--parallel` as workflow inputs, not execution modes.
3. Resolve the Mandatory Input Gate values. For `:auto`, resolve confidently or fail fast naming the missing inputs; for `:confirm`/no suffix, present the resolved inputs and wait for confirmation.
4. After Phase 0, the input gate, and (when present) the self-target fork pass, load the matching workflow YAML in §4 and execute it step by step using the resolved setup values.

**Self-target fork.** When `--self-target <profile>` is present, setup forks before the workflow YAML loads:

1. Resolve and parse the profile JSON, then validate it against the Lane D packaging schema.
2. Confirm every `editableTechDocs[].relpath` is present in `allowedDiffRelpaths`.
3. Confirm no `frozenSurfaces[].relpath` is present in `allowedDiffRelpaths`.
4. Exclude sessions whose title starts with any `excludedSessionPrefixes[]` value from scoring, polling, or candidate analysis.
5. Require a clean tree for `--live`; dry-run remains the default and runs without dispatches or mutations.
6. Acquire the single-writer loop lock before live execution.
7. Present the resolved profile, packaging root, frozen surfaces, and allowed diff paths for confirmation unless running `:auto` with all checks green.
8. Run one candidate serially by default. Multi-candidate execution is blocked unless the user explicitly passes `--parallel`.

The self-target flag is not forwarded to `loop-host.cjs`. It resolves `packaging_root` after the guard passes, so the workflow YAML loads with the resolved `--packaging-root <resolved-root>`, preserving the adapter's current argv contract.

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_ai-system-improvement_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_ai-system-improvement_confirm.yaml` |

Both workflows dispatch the guarded refine loop host exactly once with the resolved inputs. The dispatch is byte-identical to the prior direct invocation — `--packaging-root` is always passed; `--live` is appended bare only when live; the rest are appended only when set. `--self-target` and `--parallel` are router-owned and are never forwarded to `loop-host.cjs`:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=non-dev-ai-system-refine \
  --packaging-root <path> \
  [--live] [--max-iters <n>] [--fixtures <a,b>] [--variants <a,b>] \
  [--held-out <a,b>] [--samples <n>] [--proposer-model <id>] [--grader-model <id>]
```

The adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) validates the contract and spawns the packaging-owned loop host; all guarded-loop logic (frozen scoring surface, kill-switches, worktree promote-N, resume) lives with the packaging.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_ai-system-improvement_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, resolved-input confirmation, self-target fork display, and reply-format examples.
- `:auto` setup resolution rules and fail-fast display references.
- Benchmark purpose/contract display, dry-run vs live semantics, kill-switch reference list, workflow overview display, and user-facing examples.
- Result and error templates, journal/promotion display, and next-step suggestions.

The following router-owned display must still render verbatim from this document when triggered:

- Phase 0 general-agent-required failure block and `STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"`.
- Mandatory Input Gate blocked-state wording, resolved-input confirmation, and missing-input failure summary.

The following content must not come from this router: loop-host progress, grades, promotion decisions, kill-switch details, journal rows, candidate worktree details, final benchmark/refinement report wording, and any packaging-owned fixture, variant, held-out sample, or operator-guide description beyond the setup fields named here.

Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure, new floor breach, held-out regression (or below `LOOP_ACCEPT_MARGIN`), iteration ceiling, concurrent-run lock.

## 6. WORKFLOW SUMMARY

The dispatched loop host writes the packaging's `benchmark/_loop/state/loop-journal.jsonl` — an append-only run journal (per-sample grades, promotion decisions, canonical stop reasons). On `promote_accept`, the candidate edit lives in a **kept worktree (detached at the candidate state)** for deliberate operator merge — the loop never writes the live tree.

Pilot packaging: Barter Copywriter (promotion-accept live-proven via a synthetic-deficit run; red-team gauntlet 10/10). A killed run resumes from its journal (config-hash + HEAD-sha guarded). `LOOP_POLISH=1` opts in to lowest-margin targeting when all floors pass; the default declines-when-clean. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
