---
description: "Benchmark an AI-system packaging with an independent grader and auto-refine its technique docs behind hard guardrails (Lane D). Dry-run default; --live runs the guarded loop. Modes :auto, :confirm."
skill: deep-improvement
---

# /deep:start-non-dev-ai-system-loop

Lane D of the `deep-improvement` skill. Benchmarks an **AI-system packaging** (one prompt system shipped as CLI runtime, claude.ai Project and native skill), re-grades outputs with an **independent different-family grader**, and runs a **guarded autonomous refine loop**: propose a bounded technique-doc edit, verify it against held-out fixtures inside an isolated git worktree, and promote or roll back. Self-reported quality scores are never the optimization target (the pilot measured them inflated ~+6/25 versus independent graders).

> **EXECUTION PROTOCOL — READ FIRST**
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run the Setup phase (BLOCKED gate) — resolve ALL inputs (in :confirm/no-suffix, present them and wait for confirmation; in :auto, resolve confidently or fail fast naming the missing inputs)
> 3. Execute the Run step only after both gates pass
>
> This command is **general-agent based** — it orchestrates the deep-improvement skill in non-dev-ai-system-refine mode (Lane D). Gate 1 (@general verification) and Gate 2 (the BLOCKED Setup phase) are HARD BLOCKS; neither may be skipped.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-improvement packaging-refine (Lane D) loop-host invocation
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Read `.opencode/skills/deep-improvement/SKILL.md` and `references/non_dev_ai_system/operator_guide.md`, then continue to the Setup phase (also a HARD BLOCK)
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates the deep-improvement skill in    │
    │   │ packaging-refine mode and runs general-agent based.        │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-non-dev-ai-system-loop [arguments]            │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

## Setup

**STATUS: ☐ BLOCKED** — resolve ALL inputs below before the Run step. In `:confirm`/no-suffix, present the resolved inputs and wait for confirmation; in `:auto`, resolve confidently from arguments/defaults or fail fast naming the missing inputs. Do NOT run the loop-host command until inputs are resolved.

Resolve:
- **packaging root** (required) — must implement the `_loop/loop.py` contract (see the operator guide's Contract Conformance Checklist; pilot: `…/AI_Systems/Barter/Copywriter`).
- **live** — default FALSE (dry-run: gates + grader-family guard + gap analysis, zero dispatches). `--live` dispatches models and may promote into an isolated worktree branch; it requires a clean tree (the loop refuses uncommitted knowledge-base or shared-global-doc changes).
- **max iters** — live-loop ceiling (default 1 for a first run).
- **fixtures / variants / held-out / samples** — optional overrides of the packaging's defaults; held-out fixtures must be non-interactive (deliverable-producing) and the proposer never sees them.
- **proposer / grader models** — optional; the grader MUST be a different model family than the proposer (the loop kill-switches otherwise).

Pre-flight before any `--live` run: verify no other loop run is active (single-writer lock), and probe provider auth before the batch (an expired credential fails the whole batch — pilot teaching T11).

## Run

```bash
node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=non-dev-ai-system-refine \
  --packaging-root <path> \
  [--live] [--max-iters <n>] [--fixtures <a,b>] [--variants <a,b>] \
  [--held-out <a,b>] [--samples <n>] [--proposer-model <id>] [--grader-model <id>]
```

The adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) validates the contract and spawns the packaging-owned loop host; all guarded-loop logic (frozen scoring surface, kill-switches, worktree promote-N, resume) lives with the packaging.

## Output

- The packaging's `_loop/state/loop-journal.jsonl` — append-only run journal (per-sample grades, promotion decisions, canonical stop reasons).
- On `promote_accept`: the candidate edit lives in a **kept worktree (detached at the candidate state)** for deliberate operator merge — the loop never writes the live tree.

## Presentation Boundary

The following router-owned display must render verbatim when triggered:

- Phase 0 general-agent-required failure block and `STATUS=FAIL ERROR="General agent required"`.
- Setup blocked-state wording, resolved-input confirmation, and missing-input failure summary.

The following content must not come from this router:

- Loop-host progress, grades, promotion decisions, kill-switch details, journal rows, candidate worktree details, and final benchmark/refinement report wording.
- Packaging-owned fixture, variant, held-out sample, and operator-guide descriptions beyond the setup fields named here.

Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure, new floor breach, held-out regression (or below `LOOP_ACCEPT_MARGIN`), iteration ceiling, concurrent-run lock.

## Scope (current)

Pilot packaging: Barter Copywriter (promotion-accept live-proven via a synthetic-deficit run; red-team gauntlet 10/10). A killed run resumes from its journal (config-hash + HEAD-sha guarded). `LOOP_POLISH=1` opts in to lowest-margin targeting when all floors pass; the default declines-when-clean. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
