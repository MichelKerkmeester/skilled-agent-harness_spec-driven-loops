---
title: "sk-code-review"
description: "Stack-agnostic code-review baseline that classifies every finding by blocking severity with file:line evidence and ends with one parseable status line."
trigger_phrases:
  - "code review"
  - "review"
  - "findings-first"
  - "pull request"
  - "security review"
---

# sk-code-review

> Get a severity-ranked review with file:line evidence and one exact status line a gate can parse.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Severity-ranked code review findings with file:line evidence and a merge-readiness verdict |
| **Invoke with** | "@review" dispatch, or keywords "code review", "review", "security review", "quality gate" |
| **Works on** | Git diffs, staged files, commit ranges and explicit file lists |
| **Produces** | Findings ordered by severity (P0/P1/P2), a structured report and one parseable status line |

---

## 2. OVERVIEW

### Why This Skill Exists

An ad-hoc review reads the diff once and reports whatever the reviewer happened to notice. Security and correctness gaps slip through and the verdict changes with each reviewer. A single generic checklist cannot capture a specific stack's idioms, build commands and test conventions, but rebuilding a reviewer for every language is not practical. Without a fixed output shape, downstream automation cannot tell an approval from a request for changes.

### What It Does

sk-code-review fixes a findings-first baseline that always enforces security and correctness minimums. It layers the detected surface's standards on top through `sk-code`, classifies every finding by blocking severity (P0/P1/P2) with file:line evidence, and ends every review with one exact `Review status:` line a gate can parse.

The review is read-only. It reports findings and never implements fixes.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on review keywords, or you read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "review my code" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-code-review/SKILL.md")
```

**Step 2: The dispatcher assembles the prompt.** The agent prepends the literal two lines `CODE-REVIEW\n\n` to the rendered prompt before the reviewer sees it. The skill loads the baseline plus `sk-code` surface evidence for the detected code surface.

**Step 3: Read the output.** The report follows one fixed structure:

```markdown
## Code Review Summary
**Files reviewed**: X files, Y lines changed
**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]
**Baseline used**: [sk-code (`sk-code-review`)]
**Surface evidence used**: [sk-code:<surface>]

## Findings
### P0 - Critical
1. [path:line] Title
   - Risk
   - User impact
   - Recommended fix

### P1 - High
...

### P2 - Suggestions
...

## Removal/Iteration Plan
## Next Steps

Review status: REQUESTED_CHANGES
```

The final line is always one of `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` or `Review status: COMMENTED`. Downstream automation parses it by exact string match.

---

## 4. HOW IT WORKS

### Findings-First Analysis

The review analyzes security and correctness first. Then it covers quality, performance, test adequacy, contract safety and architecture concerns. Then KISS/DRY and SOLID violations. Then removal opportunities. Every finding publishes in one message, never drip-fed across turns.

Each finding carries a classification: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. A finding uses the narrow `instance-only` path only when `rg` proves no same-class producer or consumer exists, the fix is not P0/P1 security or auth, and verification is local and cheap.

### Severity Taxonomy

Every finding carries one of three severity levels, defined in `references/review_core.md`:

| Level | Meaning | Handling |
|---|---|---|
| **P0** | Blocker: exploitable security issue, auth bypass, destructive data loss | Blocks merge |
| **P1** | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| **P2** | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional |

P0 and P1 findings require a concrete `file:line` citation. P2 findings should include specific evidence when available.

### Baseline-Plus-Surface Precedence

The skill applies a two-layer model. The baseline minimums (security and correctness) are always enforced and never relaxed. The `sk-code` detected surface overrides generic style, build and test guidance. When the surface is unknown, the review runs baseline-only and discloses the uncertainty.

If baseline and surface guidance conflict in a non-deterministic way, the skill escalates instead of guessing.

### Single-Pass Rule

All findings collect into one message. The review does not drip findings across turns. After the report, it requests an explicit next action before any implementation follow-up.

### PR-State Efficiency

An optional content-hash dedup gate skips a re-review when the diff has not changed since the last one. Details live in `references/pr_state_dedup.md`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code-review when you need a code review, a PR quality gate, a security or correctness risk analysis before merge, or severity-ranked findings with evidence. Skip it for feature implementation without review intent, pure documentation editing or git-only workflow tasks.

### Boundary With deep-review

sk-code-review is the single-pass review baseline. `deep-review` is the multi-iteration loop that adds JSONL state, deltas and convergence detection and runs autonomously. Both share `references/review_core.md`, so the severity taxonomy and evidence rules are identical across both.

### Boundary With sk-code

`sk-code` supplies the detected surface's style, build and test standards. sk-code-review consumes that evidence but owns the review doctrine, the findings schema and the output contract. One reviews code. The other defines how code on a given surface should look.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Supplies surface standards evidence for the detected code surface |
| `deep-review` | Multi-iteration review loop; shares `references/review_core.md` with this skill |
| `system-spec-kit` | Owns spec folders, memory and continuity |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Findings missing severity sections | The reviewer skipped classification | Every finding must carry P0, P1 or P2. Re-run the review. |
| Security or code-quality minimums skipped | The checklists were treated as advisory | The security and code-quality checklists are non-negotiable. Load them on every pass. |
| Findings drip-fed across turns | The single-pass rule was broken | Collect all findings and emit them in one message. |
| Surface claimed without evidence | `sk-code` returned UNKNOWN | Use baseline-only and disclose the uncertainty. |
| Baseline and surface guidance conflict | Precedence was not resolved | Escalate and ask. Do not guess which wins. |

---

## 7. FAQ

**Q: Why findings-first instead of summary-first?**

A: Findings carry the actionable detail. A summary that precedes them risks anchoring the reader on a verdict before the evidence. Present the findings, then the summary.

**Q: When do I get baseline-only versus surface evidence?**

A: When `sk-code` detects a code surface, the review layers that surface's standards on top of the baseline. When detection returns UNKNOWN, the review runs baseline security and correctness minimums only and says so in the report.

**Q: How does this differ from deep-review?**

A: sk-code-review is a single pass. `deep-review` is a multi-iteration loop with JSONL state, delta tracking and convergence detection. Both share the same severity taxonomy through `references/review_core.md`.

**Q: How does this differ from sk-code?**

A: `sk-code` defines how code on a given surface should look: style, build and test conventions. sk-code-review applies those standards during review and adds its own findings-first doctrine, severity classification and output contract. One is the standard. The other is the review that checks it.

**Q: What is the mandatory status line for?**

A: Downstream automation (gates, CI, orchestrators) parses the final line by exact string match to determine whether a review approved the code, requested changes or commented without findings. The line must be the absolute last line of the output with no trailing punctuation.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios for baseline review flow, severity discipline and precedence behavior.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code-review/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md` |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/<NN>--<topic>/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/review_core.md`](./references/review_core.md) | Shared doctrine: severity model, evidence rules, findings schema |
| [`references/review_ux_single_pass.md`](./references/review_ux_single_pass.md) | Single-pass report flow and the next-action prompt |
| [`references/security_checklist.md`](./references/security_checklist.md) | Auth, injection, secrets, concurrency, headers, supply chain, privacy |
| [`references/code_quality_checklist.md`](./references/code_quality_checklist.md) | Error handling, performance, boundaries, contract safety, KISS, DRY |
| [`references/solid_checklist.md`](./references/solid_checklist.md) | SOLID prompts and architecture smells |
| [`references/test_quality_checklist.md`](./references/test_quality_checklist.md) | Coverage quality, test structure, reliability, the test pyramid |
| [`references/fix-completeness-checklist.md`](./references/fix-completeness-checklist.md) | Finding classes and producer/consumer inventories |
| [`references/removal_plan.md`](./references/removal_plan.md) | Safe-now versus deferred deletion and rollback planning |
| [`references/pr_state_dedup.md`](./references/pr_state_dedup.md) | Content-hash dedup gate: signature scheme, cache format, retention |
| [`references/quick_reference.md`](./references/quick_reference.md) | Routing index across the references |
