---
title: "sk-code-review mode"
description: "sk-code family review mode: stack-agnostic findings-first code review baseline that enforces a fixed floor of security and correctness minimums, applies a default lens a repository can change, classifies every finding by blocking severity and ends with a machine-parsable approval status."
trigger_phrases:
  - "code review"
  - "review"
  - "findings-first"
  - "pull request"
  - "security review"
  - "code-review"
version: 1.7.10.0
---

# sk-code-review mode

> A stack-agnostic findings-first code review that catches what an ad-hoc pass misses, ranks every finding by blocking severity with file:line evidence and closes with one exact status line a gate can parse.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Stack-agnostic code review with blocking severity, file:line evidence and a machine-parsable approval verdict |
| **Invoke with** | `@review` agent dispatch, the "code review", "review", "pull request" and "security review" keywords |
| **Works on** | Diffs, staged files, commit ranges or explicit file lists |
| **Produces** | Severity-ranked findings (P0/P1/P2), a `Rule sources:` line naming the rules applied, a removal plan, next steps and one exact `Review status:` line |

---

## 2. OVERVIEW

### Why This Mode Exists

An ad-hoc review reads the diff once and reports whatever the reviewer happened to notice. Security gaps slip through. Correctness bugs get a mention but no evidence. A single generic checklist cannot capture a specific stack's idioms and its build and test commands, but a per-stack reviewer would need rebuilding for every language. Without a fixed output shape, downstream automation cannot tell an approval from a request for changes. And a reviewer that carries one house style into every repository raises findings the repository has already decided against.

The `sk-code-review` mode of the sk-code family fixes this. It pairs a stack-agnostic floor that always enforces security and correctness minimums with a default lens a repository can change, and with surface-specific standards loaded through sk-code. Every review ends with one exact status line a gate can parse.

### What It Does

The `sk-code-review` mode is the single-pass review baseline for the `@review` agent. It classifies every finding by blocking severity with file:line evidence on P0 and P1 findings, orders the report by severity and closes with one exact status line. It is read-only on the target: it reports findings and never edits the code under review.

The `@review` agent applies this mode's rules and keeps no checklist of its own. Its verdict follows severity alone: any P0 finding, or an open P1, means `REQUESTED_CHANGES` and a failed gate. Its 100-point score is advisory and never decides a verdict.

It is not the multi-iteration loop. `deep-review` owns iterative passes with JSONL state and tracked convergence. `sk-code` supplies the surface style and build and test standards that pair with the baseline. The boundary is single-pass versus iterative: use this mode when you want one report. Use deep-review when the scope demands multiple passes.

### The Severity Taxonomy

Every finding carries one severity level from `references/review-core.md`, shared with `deep-review` so the labels mean the same thing in both workflows. P0 and P1 findings carry a concrete file:line citation. P2 findings include specific evidence when available.

| Severity | What it means | What the skill delivers |
|---|---|---|
| **P0 - Critical** | Blocks merge | Exploitable security issues, auth bypass and destructive data loss stop here |
| **P1 - High** | Required before merge | Correctness bugs, spec mismatches and must-fix gate issues land here |
| **P2 - Suggestion** | Optional | Non-blocking improvements and style follow-ups |

A P0 or P1 finding must name its reach: an input or call path the code's stated contract allows, or a real caller that sends it. A failure that needs input outside that contract, such as `NaN` where the contract says a number, is P2 hardening unless the code claims to validate that input. Data that crosses a trust boundary is always in reach.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on review keywords. You can also dispatch the `@review` agent directly. When `@orchestrate` dispatches the review, it adds `CODE-REVIEW` as the first line of the rendered prompt so the reviewer knows it is operating as the baseline. The `/speckit:implement` and `/speckit:complete` workflows state the same marker for any step that dispatches `@review`.

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review my staged changes" --threshold 0.8
```

The advisor prints the recommended skill route when confidence lands at or above 0.8. To read the runtime contract directly, open `.skilled/skills/sk-code/sk-code-review/SKILL.md`.

**Step 2: Run the primary workflow.** Every review follows the same shape. Findings come before summary. Security and correctness checks run first. The review ends with one exact status line.

```markdown
## Code Review Summary
**Files reviewed**: X files, Y lines changed
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: SKILLED
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Overrides: review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Refused: none. Ignored: none. Conflicts: none

## Findings

### P0 - Critical
1. src/auth.ts:42 Missing authorization check
   - Case: a request with no session token reaches the write path and changes a user record
   - Risk: Unauthenticated write path
   - User impact: Until this is fixed, any caller can mutate user records
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

Not checked: the permission guard's behavior for service accounts; no fixture covers them

Review status: REQUESTED_CHANGES
```

The `Rule sources:` line lists the checklists the review read and every override it applied, refused, ignored or found in conflict, with `none` for an empty group. The final line is always exactly one of the three status values below, with no trailing whitespace. Downstream automation parses it by exact string match. The line above it, after one blank line, is the `Not checked:` line.

- `Review status: APPROVED`
- `Review status: REQUESTED_CHANGES`
- `Review status: COMMENTED`

**Step 3: Verify before you rely on it.**

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
```

Exits 0 when the verdict triplet and the Iron Law wording stay in lockstep across the skill docs, the resolver step and the four floor ids stay pinned, and both example outputs end on a `Not checked:` line followed by the exact status line. The full run also reads this repository's `AGENTS.md`. In another repository, add `--mode-only` to check only the skill's own pins: it prints a `SKIPPED:` line for the `AGENTS.md` checks and runs from any folder. Run the playbook scenarios from the manual testing playbook for the full behavior gate.

---

## 4. HOW IT WORKS

### The Analysis Order

Findings-first means the review runs security and correctness checks before anything else. After those come quality and performance, then architecture (KISS, DRY, SOLID) and finally removal opportunities. This order keeps the blocking risks at the top where a merge decision needs them.

### Floor, Default Lens And Surface

The floor is the part of the review no repository and no surface can change: the severity ids, the reach rule and the baseline security and correctness minimums. Those checks are non-negotiable. Everything else is the default lens, the mode's own view of maintainable code, such as function length, nesting depth or the Rule of Three. Each lens rule has an id in `references/review-core.md` section 8, and a repository can drop it or replace it.

A repository does that with a `## Rule overrides` section in a checklist its quality config or a surface declaration already names. The review does not search for such a section. It asks the quality runner's `--explain` entry, which names each reviewed file's surfaces, checklists and parsed override rows, and applies them by the contract's precedence: the floor, then the repository checklist, then a specific surface, then the SKILLED fallback, then the default lens. A comment-hygiene rule the repository switched off in its quality config raises no review finding either.

When a code surface is detected, sk-code supplies the surface style and build and test standards that override the lens's generic guidance on those topics. A surface the hub's router bundles from request words is only a candidate, and it applies to the files the resolver places in it. When the surface is unknown, the review runs on the floor and the default lens and discloses the uncertainty. When two sources at the same level disagree on one rule, the review applies the default, lists the conflict on the `Rule sources:` line and asks the repository to settle it.

### Single Pass

All findings publish in one message with a next-action prompt. Findings never drip across multiple turns. The reviewer collects everything, orders by severity and emits the full report, then waits for explicit direction before any follow-up.

### PR-State Efficiency

Two optional gates reduce redundant work. The content-hash dedup gate skips a re-review when the diff has not changed since the last one, writing a signature into `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/` in your user cache directory, never into the reviewed repository. The minimum-evidence gate skips full review for trivially small diffs when enabled through `SK_CODE_REVIEW_MIN_CHANGED_LINES`, but it never skips diffs that touch auth, config, persistence, dependencies, sandboxing or public-facing response paths. Both gates are opt-in and never change the baseline findings.

The optional `SK_CODE_REVIEW_DEPTH=lite|full|ultra` alias names and persists this routing for a session. `ultra` biases toward the deep-dive reference set. `lite` maps to the conservative skip. Neither relaxes the security and correctness floor.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Reach for the `sk-code-review` mode when you want severity-ranked findings with file:line evidence before merging, when a gate workflow dispatches `@review` for pre-commit validation or when you need a read-only security and correctness pass with a machine-readable verdict. Skip it for feature implementation without review intent, for pure documentation edits or for git-only tasks that carry no code quality evaluation.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code-skilled` | Surface evidence packets that carry the implement → debug → verify workflow doctrine the acting agent applies after review findings are accepted |
| `sk-code-ci` | CI surface the hub bundles beside review when a request names GitHub Actions workflow terms or a `.github/workflows/` path |
| `sk-code-quality` | Runs author-side quality gates before review |
| `deep-review` | The multi-iteration review loop with JSONL state, deltas and convergence, built on the same severity taxonomy and evidence rules from `references/review-core.md` |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Findings missing severity labels | The reviewer skipped classification | Every finding must carry a severity level from `references/review-core.md` |
| Security minimums not enforced | The security checklist was skipped or downgraded | The security and code quality checklists are non-negotiable. Rerun with them loaded. |
| A rule the repository dropped still shows up as a finding | The override section is not in a checklist a declaration names, or the linter refused it | Run `node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md>` and read the `Refused:` group of the `Rule sources:` line |
| The `Rule sources:` line lists a checklist under `Refused:` | The section names a floor id, a `replace:` row on a machine-checked id or a repeated id | Remove the row. A floor rule cannot be overridden, and `commentHygiene.disableRules` is the way to switch off a hygiene rule |
| Findings arrive across multiple messages | The reviewer broke the single-pass contract | Collect all findings and emit in one message. Single-pass is the rule. |
| Surface evidence claimed without source | sk-code returned UNKNOWN or was not loaded | Fall back to baseline-only and disclose that the surface was not detected |
| Baseline and surface guidance conflict | Precedence is ambiguous | Escalate and ask. Do not guess which rule wins. |
| Output omits the Review status line | The reviewer missed the final-line contract | Every review must end with one exact `Review status:` line from the output contract |
| `@review` reports a low score and still passes the gate | The score is advisory | The verdict follows severity alone: only a P0 or an open P1 fails the gate |

---

## 7. FAQ

**Q: Why findings-first instead of summary-first?**

A: The findings are the blocking pieces of the review. A merge decision depends on them. Putting them first puts the evidence where the reviewer and the automation both reach for it.

**Q: When does the review run baseline-only versus with surface evidence?**

A: Baseline-only when sk-code cannot detect the code surface or returns UNKNOWN. In that case the review enforces security and correctness minimums and discloses the gap. When a surface is detected, the review loads the surface's style standards and its build and test standards on top.

**Q: How does this differ from deep-review?**

A: The `sk-code-review` mode is the single-pass baseline. One report, one status line, next action decided by a human. deep-review adds iterative passes, JSONL state tracking, deltas between iterations and autonomous convergence. Both use the same severity taxonomy and evidence rules from `references/review-core.md`.

**Q: How does this differ from sibling sk-code modes?**

A: The surface packets (`sk-code-skilled`) carry the implement → debug → verify workflow doctrine the acting agent applies to fix accepted findings. `sk-code-quality` owns author-side gates. The `sk-code-review` mode consumes surface evidence as the review layer. It owns the review workflow and the output contract, with severity classification at the core.

**Q: Can a repository switch off a review rule?**

A: Yes, for any rule outside the floor. Add a row to the `## Rule overrides` section of a checklist the repository already declares: `none` drops the rule, and `replace: <text>` puts the text in its place at the same severity. The `Rule sources:` line in the report records each override the review applied. The shared contract is `../shared/references/universal/rule-overrides.md`.

**Q: Why the mandatory status line?**

A: Downstream automation reads the final line by exact string match to decide whether to block the merge or pass it through with changes requested. The three values are the contract. No variation is accepted.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-review/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type playbook .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` reports zero issues under the playbook rule set |
| Rule invariants | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 (canary locking the `Review status:` verdict triplet, the cross-doc Iron Law wording, the resolver step and the four floor ids). In another repository add `--mode-only` |
| Report shape | `node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <review-output>` and `check-review-findings.js <review-output>` exit 0. The first also checks the `Rule sources:` line when it is present |
| Behavior | Run the playbook scenarios under `manual-testing-playbook/<topic>/<scenario>.md` (bare descriptive slugs, no numeric prefix) in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and the full rule set |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |
| [`references/review-core.md`](./references/review-core.md) | Shared doctrine: severity taxonomy, evidence rules, the floor, the default lens and its rule ids, rule overrides and the `Rule sources:` line |
| [`references/review-ux-single-pass.md`](./references/review-ux-single-pass.md) | Single-pass report flow and the next-action prompt |
| [`../shared/references/universal/rule-overrides.md`](../shared/references/universal/rule-overrides.md) | The shared override format, rule ids, hard floor and precedence the review and quality modes both read |
| [`assets/security-checklist.md`](./assets/security-checklist.md) | Mandatory security checks: auth, injection, secrets, concurrency and supply chain |
| [`assets/code-quality-checklist.md`](./assets/code-quality-checklist.md) | Correctness, performance, boundary handling, KISS and DRY |
| [`assets/solid-checklist.md`](./assets/solid-checklist.md) | SOLID principles and architecture smell detection |
| [`assets/test-quality-checklist.md`](./assets/test-quality-checklist.md) | Test coverage quality, structure and reliability |
| [`assets/fix-completeness-checklist.md`](./assets/fix-completeness-checklist.md) | Finding classes and producer/consumer inventory for proportional fixes |
| [`assets/removal-plan.md`](./assets/removal-plan.md) | Safe-now versus deferred deletion and rollback planning |
| [`references/pr-state-dedup.md`](./references/pr-state-dedup.md) | Content-hash dedup gate: signature scheme, cache format and retention |
| [`references/quick-reference.md`](./references/quick-reference.md) | Lightweight routing index across all references |
