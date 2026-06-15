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

**Run `/deep:review` after EVERY substantive implementation phase OR whenever the main agent is uncertain about correctness of shipped code.**

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

Run it through `/deep:review`, which owns iter sequencing, convergence, the per-iter prompt contract, and the `review/` output. Two roles: a **native Anthropic Agent** as loop-manager (iter adjudication + synthesis) and a **CLI review worker** (`cli-codex` / `cli-opencode`) per iteration — preload the executor's SKILL.md first per `cli-dispatch-skill-preload.md`. Default **10 iterations** (3-7 for a single patch/commit, ~20 for a full umbrella stack); convergence default 0.10, early-stop after 3 iters with no new P0/P1.

## Verdict → next action

Findings are tiered P0/P1/P2; the main agent decides:

| Verdict | Next action |
|---|---|
| PASS | Move on |
| PASS hasAdvisories=true | Move on; queue P2 backlog |
| CONDITIONAL | **Dispatch remediation** (cli-codex), then re-run deep-review (this rule self-iterates) |
| FAIL | Halt — likely architecture-level; escalate to operator |

Output (`review/review-report.md` + per-iter files + state JSONL) and review-packet placement (packet-local — never a new top-level packet for a follow-up review) follow the deep-review SKILL.md and spec-folder conventions.

## Skip exceptions

- Operator explicitly says "skip review" / "ship without review" — honor it
- Out-of-band tooling work (CI config tweaks, formatter, dependency bump in lockfile only) — no review
- The implementation IS the deep-review remediation itself (would create infinite loop) — single follow-up review max; if still CONDITIONAL after 2 cycles, escalate

## Why

A CLI review executor completes 10-iter reviews in ~25 min wall time. The marginal cost is small; the marginal value is catching P0/P1 bugs while they're cheap to fix. Skipping reviews on substantive ships is the most common path to regressions that bite weeks later.

The 020 deep-review surfaced 3 confirmed P0 in code that had passed all unit tests and strict-validate. That was the proof — without the deep-review, those bugs would be in production.

## Cross-references

- `cli-dispatch-skill-preload.md` — preload the chosen CLI executor's SKILL.md first
- `.opencode/commands/deep/review.md` — workflow surface
- AGENTS.md OPERATIONAL MANDATES — adjacent rule
