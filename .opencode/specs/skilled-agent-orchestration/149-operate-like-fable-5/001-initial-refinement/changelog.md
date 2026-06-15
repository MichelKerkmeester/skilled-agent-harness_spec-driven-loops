---
title: "149 Operate Like Fable 5 Changelog"
description: "Distribution of the Fable 5 operating doctrine across the framework AGENTS.md, constitutional memory, sk-code and Barter surfaces."
trigger_phrases:
  - "fable 5 changelog"
  - "operating discipline distribution"
  - "149 operate like fable 5"
importance_tier: "normal"
contextType: "implementation"
---

# 149 Operate Like Fable 5 Changelog

Date: 2026-06-14. Commit `90c34fc258`, on `origin/system-speckit/028`.

## Summary

Distributed the Fable 5 operating doctrine (`external/Fable5.md`) across the framework's most reliably read surfaces. Added a nine-bullet Operating Discipline subsection to the Public and Barter `AGENTS.md` files, added two always-surface constitutional rules, folded a non-git outward-action step into `main-branch-direct-push.md`, added a baseline-and-blast-radius line to `sk-code` and removed a contradictory copy-paste rule from Barter. The distribution rule was to land each obligation where it is most reliably read and to cross-reference rather than duplicate what a surface already enforces. A deep-research loop on cli-codex gpt-5.5 at xhigh validated the gaps and the surface choices, and a protocol-clean re-run surfaced a runtime defect recorded under Follow-Ups.

## Added

- Public root `AGENTS.md` and its byte-identical `CLAUDE.md` twin gained an Operating Discipline: Claim Legibility and Blast-Radius subsection in section 1, nine bullets, cross-referencing the Four Laws and the section 2 Completion Verification Rule rather than restating them. Plus fourteen lines, file at 447 under the soft budget of about 500.
- Barter `AGENTS.md` gained the same subsection in a read-only-git variant whose rollback bullet defers to the Barter section 1 read-only policy. Plus fourteen lines, file at 468.
- `regression-baseline-and-delta.md`, a new always-surface constitutional rule in the Public and Barter constitutional folders. Capture the baseline before a no-regressions claim, the pass and fail counts with failing-test names, the base commit and the fixture mtime, then re-run the whole gate after each step and report the delta.
- `finding-is-a-hypothesis.md`, a new always-surface constitutional rule in both folders. A sub-agent COMPLETE, a reviewer P0, an Explore lead or a stale note is a hypothesis until you open the cited code and check it against the real symptom.
- `sk-code/SKILL.md` and its `.claude` mirror gained a Baseline and blast-radius line after the Iron Law, tying baseline capture to Phase 1 and the delta report to Phase 3.
- The 149 packet canonical docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `description.json` and `graph-metadata.json`.

## Changed

- `main-branch-direct-push.md` in the Public constitutional folder gained a fifth How to apply step that folds in the non-git outward and irreversible class. Deploy, send, migrate, `pnpm patch`, a write to shared or global or native state and a live remote draft now each require naming the rollback in one line and stopping for a yes unless already told to proceed. The git push authorization is unchanged, and the step opens by scoping itself to non-git actions only.

## Fixed

- The Barter governance contradiction between the read-only-git `AGENTS.md` policy in section 1 and a push-authorizing constitutional rule. Resolved by removing the rule, since a direct push has no valid meaning in a read-only repo.

## Removed

- The stray Barter `main-branch-direct-push.md`. It authorized a direct push to main and referenced the Public repository by name, which contradicted Barter's read-only git policy. It was a copy-paste artifact. Barter's constitutional folder settled at fourteen rules after the two additions and this removal.

## Verification

- `validate.sh --strict` on the 149 packet returned zero errors and zero warnings, RESULT PASSED.
- An adversarial review scored the edits 97 of 100 with no P0 or P1 findings. It stress-tested the two highest-risk seams, the Barter read-only variant and the `main-branch-direct-push.md` fold, and confirmed no contradiction in either.
- `diff -q` confirmed `AGENTS.md` and `CLAUDE.md` byte-identical. Line budgets 447 and 468 stay under the soft 500.
- `memory_search` returned both new rule titles, Baseline Before No-Regressions and A Finding Is a Hypothesis, confirming they index and surface.
- The doctrine commit `90c34fc258` is reachable from `origin/system-speckit/028`, and the `AGENTS.md` on the remote contains the new subsection.

## Files Changed

- `AGENTS.md` and `CLAUDE.md` at the Public root.
- `Barter/ai-speckit/coder/AGENTS.md`.
- `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md`, new in both repos.
- `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md`, new in both repos.
- `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`, edited in Public and removed in Barter.
- `.opencode/skills/sk-code/SKILL.md` and its `.claude` mirror.
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/` packet docs.

## Follow-Ups

- A clean multi-iteration cli-codex deep-research re-run is blocked by a runtime defect. The second and later cli-codex dispatches in a session are SIGKILLed mid-run, reproduced three times out of three, and the executor-audit silently falls back to native gpt-5 instead of failing loud. The fix is to make the executor-audit fail loud rather than substitute a model without surfacing it. This is TypeScript runtime work outside this packet's scope and is documented in `research/research.md`.
- The research flagged a larger future packet. A machine-checkable shared evidence contract wired into post-dispatch validation, carrying claim_class, evidence, baseline and gate_delta fields, so the doctrine can be enforced mechanically rather than only in prose and always-surface memory.
- The constitutional re-index ran after a stale `spec-memory` dist was rebuilt, and the two new rules were confirmed surfacing. No further indexing action is pending.
