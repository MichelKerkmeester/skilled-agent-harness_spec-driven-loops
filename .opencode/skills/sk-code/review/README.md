---
title: "code-review mode"
description: "sk-code family review mode: stack-agnostic findings-first code review baseline that enforces security and correctness minimums, classifies every finding by blocking severity and ends with a machine-parsable approval status."
trigger_phrases:
  - "code review"
  - "review"
  - "findings-first"
  - "pull request"
  - "security review"
  - "code-review"
version: 1.0.0.0
---

# code-review mode

> Stack-agnostic findings-first code review that catches what an ad-hoc pass misses, classifies every finding by blocking severity with file:line evidence and ends with one exact status line a gate can parse.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Stack-agnostic code review with blocking severity, file:line evidence and a machine-parsable approval verdict |
| **Invoke with** | `@review` agent dispatch, or "code review", "review", "pull request", "security review" |
| **Works on** | Diffs, staged files, commit ranges or explicit file lists |
| **Produces** | Severity-ranked findings (P0/P1/P2), a removal plan, next steps and one exact `Review status:` line |

---

## 2. OVERVIEW

### Why This Mode Exists

An ad-hoc review reads the diff once and reports whatever the reviewer happened to notice. Security gaps slip through. Correctness bugs get a mention but no evidence. A single generic checklist cannot capture a specific stack's idioms, build and test commands, but a per-stack reviewer would need rebuilding for every language. Without a fixed output shape, downstream automation cannot tell an approval from a request for changes.

The `code-review` mode (of the sk-code family) fixes this. It pairs a stack-agnostic baseline that always enforces security and correctness minimums with surface-specific standards loaded through sk-code, and it ends every review with one exact status line a gate can parse.

### What It Does

The `code-review` mode (of the sk-code family) is the single-pass review baseline for the `@review` agent. It classifies every finding as P0 (blocking, blocks merge), P1 (required, fix before merge) or P2 (suggestion, optional), ordered by severity with file:line evidence on P0 and P1 findings. It is read-only on the target: it reports findings and never edits the code under review.

It is not the multi-iteration loop. `deep-review` adds JSONL state, deltas and convergence. `sk-code` supplies the surface style, build and test standards that the `code-review` mode pairs with its baseline.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on review keywords, or you dispatch the `@review` agent. The dispatcher prepends `CODE-REVIEW` as the first line of the rendered prompt so the reviewer knows it is operating as the baseline.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "review my staged changes" --threshold 0.8

# Or read the runtime instructions directly
Read(".opencode/skills/sk-code/review/SKILL.md")
```

**Step 2: Read the output contract.** Every review follows the same shape. Findings come before summary. Security and correctness checks run first. The review ends with one exact status line.

```markdown
## Code Review Summary
**Files reviewed**: 3 files, 127 lines changed
**Overall assessment**: REQUEST_CHANGES
**Baseline used**: sk-code (code-review)
**Surface evidence used**: sk-code:typescript

## Findings

### P0 - Critical
1. src/auth.ts:42 Missing authorization check
   - Risk: Unauthenticated write path
   - User impact: Any caller can mutate user records
   - Finding class: cross-consumer
   - Scope proof: rg -n "writeUser" src/ shows three call sites
   - Recommended fix: Enforce the permission guard before mutation

### P1 - High
...

### P2 - Suggestion
...

## Removal/Iteration Plan
...

## Next Steps
1. Fix the auth gap at src/auth.ts:42
2. Add input validation for the /api/users endpoint

Review status: REQUESTED_CHANGES
```

The final line is always exactly one of `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` or `Review status: COMMENTED`, with no trailing whitespace. Downstream automation parses it by exact string match.

---

## 4. HOW IT WORKS

### The Analysis Order

Findings-first means the review runs security and correctness checks before anything else. After those come quality and performance, then architecture (KISS, DRY, SOLID) and finally removal opportunities. This order keeps the blocking risks visible at the top where a merge decision needs them.

### Severity Taxonomy

Every finding carries one severity level from `references/review_core.md`, shared with `deep-review` so the labels mean the same thing across both workflows.

P0 is a blocker: exploitable security issues, auth bypass or destructive data loss. A P0 blocks merge. P1 is required: correctness bugs, spec mismatches or must-fix gate issues that need resolution before merge. P2 is a suggestion: non-blocking improvements, documentation polish or style follow-ups that are optional.

Every P0 and P1 finding must include a concrete file:line citation. P2 findings should include specific evidence when available.

### Baseline Plus Surface

The baseline minimums from the `code-review` mode are always enforced and never relaxed by surface guidance. Security and correctness checks are non-negotiable. When a code surface is detected, `sk-code` supplies the surface's style conventions, build commands and test commands, which override the baseline's generic guidance on those topics.

When the surface is unknown, the review runs baseline-only and discloses the uncertainty. When baseline and surface guidance conflict in a way that cannot be resolved, the reviewer escalates instead of guessing.

### Single Pass

All findings publish in one message with a next-action prompt. Findings never drip across multiple turns. The reviewer collects everything, orders by severity and emits the full report, then waits for explicit direction before any follow-up.

### PR-State Efficiency

Two optional gates reduce redundant work. The content-hash dedup gate skips a re-review when the diff has not changed since the last one, writing a signature into `.opencode/.code-review-cache/`. The minimum-evidence gate skips full review for trivially small diffs when enabled through `SK_CODE_REVIEW_MIN_CHANGED_LINES`, but it never skips diffs that touch auth, config, persistence, dependencies, sandboxing or public-facing response paths. Both gates are opt-in and never change the baseline findings. The optional `SK_CODE_REVIEW_DEPTH=lite|full|ultra` alias names and persists this routing for a session: `ultra` biases toward the deep-dive reference set, `lite` maps to the conservative skip, and neither relaxes the security and correctness floor.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Reach for the `code-review` mode (of the sk-code family) when you want severity-ranked findings with file:line evidence before merging, when a gate workflow dispatches `@review` for pre-commit validation or when you need a read-only security and correctness pass with a machine-readable verdict. Skip it for feature implementation without review intent, for pure documentation edits or for git-only tasks that carry no code-quality evaluation.

### Related Skills

| Skill | Relationship |
|---|---|
| `code-implement` | Applies fixes after review findings are accepted. |
| `code-quality` | Runs author-side quality gates before review. |
| `code-debug` | Owns root-cause debugging when review findings expose a defect needing investigation. |
| `code-verify` | Owns verification evidence after fixes or when proof is requested. |
| `deep-review` | The multi-iteration review loop. It adds JSONL state, deltas and autonomous convergence on top of the same severity taxonomy and evidence rules from `references/review_core.md`. |

The `code-review` mode and deep-review share `references/review_core.md`, so P0, P1 and P2 mean the same thing in both workflows. The boundary is single-pass versus iterative. Use `code-review` when you want one report. Use deep-review when the scope demands multiple passes with tracked convergence.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Findings missing severity labels | The reviewer skipped classification | Every finding must carry P0, P1 or P2 from `references/review_core.md` |
| Security minimums not enforced | The security checklist was skipped or downgraded | The security and code-quality checklists are non-negotiable. Rerun with them loaded. |
| Findings arrive across multiple messages | The reviewer broke the single-pass contract | Collect all findings and emit in one message. Single-pass is the rule. |
| Surface evidence claimed without source | sk-code returned UNKNOWN or was not loaded | Fall back to baseline-only and disclose that the surface was not detected |
| Baseline and surface guidance conflict | Precedence is ambiguous | Escalate and ask. Do not guess which rule wins. |
| Output omits the Review status line | The reviewer missed the final-line contract | Every review must end with exactly `Review status: APPROVED`, `REQUESTED_CHANGES` or `COMMENTED` |

---

## 7. FAQ

**Q: Why findings-first instead of summary-first?**

A: The findings are the blocking pieces of the review. A merge decision depends on them. Putting them first puts the evidence where the reviewer and the automation both reach for it.

**Q: When does the review run baseline-only versus with surface evidence?**

A: Baseline-only when sk-code cannot detect the code surface or returns UNKNOWN. In that case the review enforces security and correctness minimums and discloses the gap. When a surface is detected, the review loads the surface's style, build and test standards on top.

**Q: How does this differ from deep-review?**

A: The `code-review` mode is the single-pass baseline. One report, one status line, next action decided by a human. deep-review adds iterative passes, JSONL state tracking, deltas between iterations and autonomous convergence. Both use the same severity taxonomy and evidence rules from `references/review_core.md`.

**Q: How does this differ from sibling sk-code modes?**

A: `code-implement` applies fixes, `code-quality` owns author-side gates, `code-debug` owns root-cause debugging and `code-verify` owns verification evidence. The `code-review` mode consumes surface evidence as the review layer. It owns the review workflow, the severity classification and the output contract.

**Q: Why the mandatory status line?**

A: Downstream automation reads the final line by exact string match to decide whether to block a merge, request changes or pass. The three values are the contract. No variation is accepted.

---

## 8. VERIFICATION

The mode ships a manual testing playbook with per-feature scenarios for findings-first output, severity classification and output contract compliance.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/review/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/review/manual_testing_playbook/manual_testing_playbook.md` |
| Rule invariants | `node .opencode/skills/sk-code/review/scripts/check-rule-copies.js` exits 0 (canary locking the `Review status:` verdict triplet and the cross-doc Iron Law wording) |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/<NN>--<topic>/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart router and the full rule set |
| [`references/review_core.md`](./references/review_core.md) | Shared doctrine: severity taxonomy, evidence rules and baseline-plus-surface precedence |
| [`references/review_ux_single_pass.md`](./references/review_ux_single_pass.md) | Single-pass report flow and the next-action prompt |
| [`assets/security_checklist.md`](./assets/security_checklist.md) | Mandatory security checks: auth, injection, secrets, concurrency and supply chain |
| [`assets/code_quality_checklist.md`](./assets/code_quality_checklist.md) | Correctness, performance, boundary handling, KISS and DRY |
| [`assets/solid_checklist.md`](./assets/solid_checklist.md) | SOLID principles and architecture smell detection |
| [`assets/test_quality_checklist.md`](./assets/test_quality_checklist.md) | Test coverage quality, structure and reliability |
| [`assets/fix-completeness-checklist.md`](./assets/fix-completeness-checklist.md) | Finding classes and producer/consumer inventory for proportional fixes |
| [`assets/removal_plan.md`](./assets/removal_plan.md) | Safe-now versus deferred deletion and rollback planning |
| [`references/pr_state_dedup.md`](./references/pr_state_dedup.md) | Content-hash dedup gate: signature scheme, cache format and retention |
| [`references/quick_reference.md`](./references/quick_reference.md) | Lightweight routing index across all references |
