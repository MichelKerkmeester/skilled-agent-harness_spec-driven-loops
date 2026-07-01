---
description: "Benchmark an AI-system packaging with an independent grader and auto-refine its technique docs behind hard guardrails (Lane D). Dry-run default; --live runs the guarded loop. Use --self-target <profile> for guarded self-improvement setup. Modes :auto, :confirm."
skill: deep-loop-workflows
---

# /deep:ai-system-improvement

Lane D of the `deep-improvement` skill. Benchmarks an **AI-system packaging** (one prompt system shipped as CLI runtime, claude.ai Project and native skill), re-grades outputs with an **independent different-family grader**, and runs a **guarded autonomous refine loop**: propose a bounded technique-doc edit, verify it against held-out fixtures inside an isolated git worktree, and promote or roll back. Self-reported quality scores are never the optimization target (the pilot measured them inflated ~+6/25 versus independent graders).

> **EXECUTION PROTOCOL — READ FIRST**
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run the Setup phase (BLOCKED gate) — resolve ALL inputs (in :confirm/no-suffix, present them and wait for confirmation; in :auto, resolve confidently or fail fast naming the missing inputs)
> 3. Execute the Run step only after both gates pass
>
> This command is **general-agent based** — it orchestrates the deep-improvement skill in non-dev-ai-system-refine mode (Lane D). Gate 1 (dispatch-context check) and Gate 2 (the BLOCKED Setup phase) are HARD BLOCKS; neither may be skipped.

---

# 🚨 PHASE 0: DISPATCH-CONTEXT CHECK

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
│   └─ general_agent_verified = TRUE → Read `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md` and `references/non_dev_ai_system/operator_guide.md`, then continue to the Setup phase (also a HARD BLOCK)
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
    │   │ packaging-refine mode and runs general-agent based.         │
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

---

## SETUP

**STATUS: ☐ BLOCKED** — resolve ALL inputs below before the Run step. In `:confirm`/no-suffix, present the resolved inputs and wait for confirmation; in `:auto`, resolve confidently from arguments/defaults or fail fast naming the missing inputs. Do NOT run the loop-host command until inputs are resolved.

Resolve:
- **packaging root** (required) — must implement the `_loop/loop.py` contract (see the operator guide's Contract Conformance Checklist; pilot: `…/AI_Systems/Barter/Copywriter`).
- **self target** (optional) — `--self-target <profile>` is a router-owned setup shortcut. A bare profile ID resolves under `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/`; a path resolves directly. The profile JSON must validate against `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json` and must define `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, and `excludedSessionPrefixes`.
- **live** — default FALSE (dry-run: gates + grader-family guard + gap analysis, zero dispatches). `--live` dispatches models and may promote into an isolated worktree branch; it requires a clean tree (the loop refuses uncommitted knowledge-base or shared-global-doc changes).
- **max iters** — live-loop ceiling (default 1 for a first run).
- **fixtures / variants / held-out / samples** — optional overrides of the packaging's defaults; held-out fixtures must be non-interactive (deliverable-producing) and the proposer never sees them.
- **proposer / grader models** — optional; the grader MUST be a different model family than the proposer (the loop kill-switches otherwise).

Pre-flight before any `--live` run: verify no other loop run is active (single-writer lock), and probe provider auth before the batch (an expired credential fails the whole batch — pilot teaching T11).

### Self-Target Fork

When `--self-target <profile>` is present, setup forks before the normal Run step:

1. Resolve and parse the profile JSON, then validate it against the Lane D packaging schema.
2. Confirm every `editableTechDocs[].relpath` is present in `allowedDiffRelpaths`.
3. Confirm no `frozenSurfaces[].relpath` is present in `allowedDiffRelpaths`.
4. Exclude sessions whose title starts with any `excludedSessionPrefixes[]` value from scoring, polling, or candidate analysis.
5. Require a clean tree for `--live`; dry-run remains the default and runs without dispatches or mutations.
6. Acquire the single-writer loop lock before live execution.
7. Present the resolved profile, packaging root, frozen surfaces, and allowed diff paths for confirmation unless running `:auto` with all checks green.
8. Run one candidate serially by default. Multi-candidate execution is blocked unless the user explicitly passes `--parallel`.

The self-target flag is not forwarded to `loop-host.cjs`. It compiles to the existing `--mode=non-dev-ai-system-refine --packaging-root <resolved-root>` invocation after the guard passes, preserving the adapter's current argv contract.

---

## RUN

```bash
node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=non-dev-ai-system-refine \
  --packaging-root <path> \
  [--live] [--max-iters <n>] [--fixtures <a,b>] [--variants <a,b>] \
  [--held-out <a,b>] [--samples <n>] [--proposer-model <id>] [--grader-model <id>]
```

Router-only self-target setup:

```bash
/deep:ai-system-improvement --self-target deep-loop-runtime [--live] [--parallel]
```

The adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) validates the contract and spawns the packaging-owned loop host; all guarded-loop logic (frozen scoring surface, kill-switches, worktree promote-N, resume) lives with the packaging.

---

## OUTPUT

- The packaging's `_loop/state/loop-journal.jsonl` — append-only run journal (per-sample grades, promotion decisions, canonical stop reasons).
- On `promote_accept`: the candidate edit lives in a **kept worktree (detached at the candidate state)** for deliberate operator merge — the loop never writes the live tree.

---

## PRESENTATION BOUNDARY

The following router-owned display must render verbatim when triggered:

- Phase 0 general-agent-required failure block and `STATUS=FAIL ERROR="General agent required"`.
- Setup blocked-state wording, resolved-input confirmation, and missing-input failure summary.

The following content must not come from this router:

- Loop-host progress, grades, promotion decisions, kill-switch details, journal rows, candidate worktree details, and final benchmark/refinement report wording.
- Packaging-owned fixture, variant, held-out sample, and operator-guide descriptions beyond the setup fields named here.

Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure, new floor breach, held-out regression (or below `LOOP_ACCEPT_MARGIN`), iteration ceiling, concurrent-run lock.

---

## SCOPE (CURRENT)

Pilot packaging: Barter Copywriter (promotion-accept live-proven via a synthetic-deficit run; red-team gauntlet 10/10). A killed run resumes from its journal (config-hash + HEAD-sha guarded). `LOOP_POLISH=1` opts in to lowest-margin targeting when all floors pass; the default declines-when-clean. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
