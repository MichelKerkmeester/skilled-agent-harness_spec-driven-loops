# Context Report: sk-code-review README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the findings-first model, the severity taxonomy, the output contract and the baseline-plus-surface split. Both flag the same stale facts in the current README (wrong reference count, a non-existent output heading, wrong section order).

---

## 1. PURPOSE

`sk-code-review` is a stack-agnostic, findings-first code-review baseline. It produces severity-ranked findings with file:line evidence and a release-readiness verdict, enforcing security and correctness minimums on every pass and pairing with `sk-code` for the detected surface's style, build and test standards.

## 2. PROBLEM

An ad-hoc review reads the diff once and reports whatever the reviewer happened to notice, so security and correctness gaps slip through and the verdict is inconsistent across reviewers. A single generic checklist cannot capture a specific stack's idioms, build and test commands, but a per-stack reviewer would have to be rebuilt for every language. Without a fixed output shape, downstream automation cannot tell an approval from a request for changes. This skill fixes a baseline that always enforces security and correctness minimums, layers the detected surface's standards on top through `sk-code`, and ends every review with one exact status line a gate can parse.

## 3. MODES & CAPABILITIES

- Findings-first severity: every finding is P0, P1 or P2, ordered by severity, with a file:line citation required on P0 and P1.
- Baseline plus surface: the baseline minimums (security, correctness) are always enforced and never relaxed; the `sk-code` detected surface overrides generic style, build and test guidance.
- Review only: the reviewer reports findings and never edits the code under review.
- Risk checklists: security, code quality, SOLID, test quality, fix completeness and removal planning, each a focused reference.
- Single pass: all findings publish in one message with a next-action prompt, never drip-fed across turns.
- PR-state efficiency: an optional content-hash dedup gate skips a re-review when the diff has not changed since the last one.

## 4. INVOCATION (verified)

The skill is the review baseline for the `@review` agent, dispatched for pre-commit or gate validation (`SKILL.md:20`). The dispatcher prepends the literal two lines `CODE-REVIEW\n\n` to the rendered prompt before the reviewer sees it (`SKILL.md:58`). The review is read-only on the target: it reports findings and never implements fixes (`SKILL.md:380`). The flow is STEP 0 load the baseline plus the `sk-code` surface evidence, then scope and baseline checks, overlay alignment, findings-first analysis (security and correctness first, then quality, architecture, KISS, DRY, SOLID, then removal opportunities), then the output contract.

## 5. SEVERITY & OUTPUT CONTRACT (verified)

Severity (`references/review_core.md:20-24`): P0 is a blocker (exploitable security issue, auth bypass, destructive data loss) that blocks merge; P1 is required (correctness bug, spec mismatch, must-fix gate issue) that must be fixed before merge; P2 is a suggestion (non-blocking improvement, docs, style or maintainability) that is optional. Every P0 and P1 carries a concrete file:line citation. Findings order by severity.

The output is structured markdown (`SKILL.md:304-360`): `## Code Review Summary` (files reviewed, overall assessment, baseline used, surface evidence used), then `## Findings` with `### P0`, `### P1`, `### P2` subsections, then `## Removal/Iteration Plan`, then `## Next Steps`. The review MUST end with exactly one final line, `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` or `Review status: COMMENTED`, with no trailing whitespace, because downstream automation parses it by exact string match. The current README's `## Review Context` heading does not exist in the contract; baseline and surface info live inside `## Code Review Summary`.

## 6. KEY FILES (real, host-verified, 10 references)

| Path | Role |
|------|------|
| `SKILL.md` | The skill definition, smart router, output contract, rules and the PR-state gates |
| `references/review_core.md` | Shared doctrine (also consumed by `@deep-review`): severity, evidence rules, findings schema, baseline-plus-surface precedence |
| `references/review_ux_single_pass.md` | Single-pass report flow and the next-action prompt |
| `references/security_checklist.md` | Auth, injection, secrets, concurrency, headers, supply chain, privacy |
| `references/code_quality_checklist.md` | Error handling, performance, boundaries, contract safety, KISS, DRY |
| `references/solid_checklist.md` | SOLID prompts and architecture smells |
| `references/test_quality_checklist.md` | Coverage quality, test structure, reliability, the test pyramid |
| `references/fix-completeness-checklist.md` | Finding classes and producer/consumer inventories |
| `references/removal_plan.md` | Safe-now versus deferred deletion and rollback planning |
| `references/pr_state_dedup.md` | The content-hash dedup gate: signature scheme, cache format, retention |
| `references/quick_reference.md` | The routing index across the references |

Note: there is no `assets/` directory in this skill (SKILL.md mentions an `assets/` base, but none exists). Do not cite an assets path. The current README says 9 reference files; there are 10 (it omits `pr_state_dedup.md`).

## 7. BOUNDARIES

sk-code-review is the single-pass review baseline. It is not the multi-iteration loop (`deep-review`, which adds JSONL state, deltas and convergence and runs autonomously). It does not supply surface style, build or test standards (`sk-code` does that; sk-code-review consumes it). It never edits the code under review. sk-code-review and deep-review share `references/review_core.md`, so the severity taxonomy and evidence rules are identical across both.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Findings missing severity sections: the reviewer skipped classification. Every finding must carry P0, P1 or P2.
- Minimums skipped: the security and code-quality checklists are non-negotiable, never advisory.
- Findings drip-fed across turns: single-pass is the rule. Collect all findings, emit in one message.
- Surface claimed without evidence: use baseline-only when `sk-code` returned UNKNOWN, and disclose it.
- Baseline-versus-surface conflict: escalate and ask, do not guess the precedence.
- FAQ: why findings-first instead of summary-first, when baseline-only versus surface evidence, how it differs from `deep-review` (single-pass versus the loop), how it differs from `sk-code` (review versus surface standards), and what the mandatory status line is for.

## 9. STALE FACTS

The narrative template drops version lines and brittle counts, so the drift resolves on rewrite:

- Reference count: the README says 9, the real tree has 10 (it omits `pr_state_dedup.md`).
- SKILL.md size: the README says 406 LOC, the file is now larger after the PR-state gates were added. Do not cite a line count.
- Output contract: the README uses a `## Review Context` heading that does not exist and orders `## Findings` before `## Code Review Summary`. The real contract is Summary, then Findings, then Removal/Iteration Plan, then Next Steps, ending with the `Review status:` line. The rewrite must show the correct contract.
- Baseline reference set: the README says 4 always-load references, the real set is 5 (it adds the fix-completeness checklist).
- No version line and no `assets/` path (the directory does not exist).

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the findings-first model and the baseline-plus-surface split; iteration 2 verified the severity taxonomy, the output contract, the reference set and the stale facts, each cited to a file and line. Both models agreed on the output contract and the mandatory status line, and both found the same wrong reference count and non-existent heading in the README. Converged before the three-iteration ceiling.
