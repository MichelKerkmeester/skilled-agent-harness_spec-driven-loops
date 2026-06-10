---
title: "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-08"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - "deep-review"
  - "deep review"
  - "spec_kit:deep-review"
  - "after implementation"
  - "after every phase"
  - "post-implementation"
  - "post-ship"
  - "verify implementation"
  - "uncertain about"
  - "uncertainty"
  - "validate code change"
  - "audit shipped code"
---

# Post-Implementation Deep-Review Mandate

## Rule

**Run `/deep:start-review-loop` after EVERY substantive implementation phase OR whenever the main agent is uncertain about correctness of shipped code.**

## What counts as "substantive implementation"

| Type | Trigger review? |
|---|---|
| New code / new module (≥ 50 LOC) | ✅ YES — review |
| Architectural change (interface, schema migration, control-flow swap) | ✅ YES — review |
| Bug fix that touches critical-path code (search, embed, schema, security boundary) | ✅ YES — review |
| Refactor that shifts public API surface | ✅ YES — review |
| Multi-file change (≥ 3 files) | ✅ YES — review |
| Pure docs / README / spec authoring | ❌ no — skip |
| Single-character typo fix | ❌ no — skip |
| Scaffold-only (spec.md + tasks.md, no code) | ❌ no — skip |
| Test-only changes | ⚠️ optional — review only if asserting new invariant |

## What "uncertainty" looks like (also triggers review)

- Main agent says "I think this works but I'm not sure" → review
- Main agent's tests pass but the change touches a load-bearing component → review
- The shipped commit has an open question / TODO → review
- Operator explicitly asks for a sanity check → review
- A previous deep-review surfaced findings in the same file recently → review (iteratively converge)

## How to dispatch

**Two roles, two executors:**

| Role | Executor | Why |
|---|---|---|
| **Loop-manager orchestrator** (manages iter sequencing, convergence, synthesis, commit) | **Native Anthropic Agent** (Agent tool with `subagent_type=claude` / `code` / `orchestrate`) | Per the "Native Opus preference for implementation work" mandate in AGENTS.md. Opus has the judgment for iter-by-iter adjudication + final synthesis. |
| **Per-iter review worker** (one dimension/pass, P0/P1/P2 finding) | **A CLI review executor of the operator's choice, e.g. `cli-codex` or `cli-opencode`** | Read the chosen executor's SKILL.md before composing per-iter prompts. Follow the cli-dispatch constitutional preload rule (`cli-dispatch-skill-preload.md`). |

**Per-iter prompt contract** (the loop manager enforces this when authoring each iter prompt):
- Explicit ROLE + CONTEXT + ACTION + FORMAT sections
- Pre-planning block (3-4 ordered steps with per-step acceptance)
- `<ref_file>` tags around every cited path
- sequential_thinking mandate
- Spec folder pre-approved (Gate 3 skip)

### Iteration count tiering

| Scope | iter | Wall time |
|---|---|---|
| Full umbrella stack (10+ packets like 016) | 20 | ~50 min |
| Single sub-phase implementation (1-3 commits) | **10** | ~25 min |
| Single P0/P1 remediation commit | **5-7** | ~15-18 min |
| Single bug-fix patch | **3-5** | ~10-15 min |

Default to **10 iter** for a typical post-implementation review unless the scope is unusually large or narrow.

### Convergence threshold

Use the deep-review default (0.10) — early-stop if 3 consecutive iters yield no new P0/P1.

## Output

Every post-implementation deep-review emits a `review/review-report.md` (9 sections) + `review/iterations/iteration-NNN.md` per iter + `review/deep-review-state.jsonl`. Findings get tiered P0 / P1 / P2 and the main agent decides:

| Verdict | Next action |
|---|---|
| PASS | Move on |
| PASS hasAdvisories=true | Move on; queue P2 backlog |
| CONDITIONAL | **Dispatch remediation** (cli-codex), then re-run deep-review (this rule self-iterates) |
| FAIL | Halt — likely architecture-level issue; escalate to operator |

## Where review packets live

Post-implementation reviews live UNDER the packet they review:
- For a 016/010/001 implementation review → `016/010/001/review/`
- For an 016/008 remediation re-review → `016/008/review-NN/` (or sibling `016/008-002-rereview/` if the original review packet is locked)

Don't create new top-level packets just for follow-up reviews. Keep them packet-local.

## Skip exceptions

- Operator explicitly says "skip review" / "ship without review" — honor it
- Out-of-band tooling work (CI config tweaks, formatter, dependency bump in lockfile only) — no review
- The implementation IS the deep-review remediation itself (would create infinite loop) — single follow-up review max; if still CONDITIONAL after 2 cycles, escalate

## Why

A CLI review executor completes 10-iter reviews in ~25 min wall time. The marginal cost is small; the marginal value is catching P0/P1 bugs while they're cheap to fix. Skipping reviews on substantive ships is the most common path to regressions that bite weeks later.

The 020 deep-review surfaced 3 confirmed P0 in code that had passed all unit tests and strict-validate. That was the proof — without the deep-review, those bugs would be in production.

## Cross-references

- `cli-dispatch-skill-preload.md` — preload the chosen CLI executor's SKILL.md first
- `.opencode/commands/deep/start-review-loop.md` — workflow surface
- AGENTS.md OPERATIONAL MANDATES — adjacent rule
