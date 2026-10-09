---
title: "Iteration 7: Reconciling the archived refinement's 17 recommendations and 11 rejections against the current two-axis hub"
trigger_phrases: []
---
# Iteration 7: Reconciling the archived refinement's 17 recommendations and 11 rejections against the current two-axis hub

## Focus

Q7 — take the archived report's recommendations one at a time and classify each as still present, relocated, or lost in the current hub, since iterations 1-6 produced several LOST candidates that need one consolidated verdict. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-88` — the 17 recommendations, the DO-NOT-ADOPT table, and the sequencing section.
- `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/` — `design-restraint-ladder.md`, `ceiling-comment-convention.md`, `implementer-anti-stall.md`, `stack-folders-validator.md`.
- `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:120-140` — native-duplication and needed-ness rows.
- `.skilled/hooks/git/pre-commit:78-94` — the agent mirror-sync gate.
- `.skilled/hooks/session-lifecycle/README.md:1-30` — continuity priming across five runtimes.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/` — Lane B sweep lane.
- `.skilled/skills/sk-code/benchmark/README.md` and `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:239-302` — DR-scenario coverage notes.

## Findings

1. **[ALREADY-ADOPTED, exceeded] Twelve of the seventeen recommendations are present in the current hub, and four of them gained a dedicated playbook scenario the original recommendation did not ask for.** Verified present: the ladder in the always-loaded universal doc (rec 1, 2), the review-status canary (rec 4), the ceiling-comment convention (rec 5), ceiling-as-downgrade-evidence (rec 6), the needed-ness KISS prompt in its proposed wording (rec 7), the `Replacement` removal-plan field (rec 8), the Iron Law relocation and concept-level canary (rec 9), the stack-folders validator (rec 13), the review-depth alias (rec 14), the cross-runtime agent mirror gate (rec 12, 16), and the anti-stall rule (rec 17). The `design-restraint/` playbook folder carries `design-restraint-ladder.md`, `ceiling-comment-convention.md`, `implementer-anti-stall.md`, and `stack-folders-validator.md`, which discharges rec 1's own caveat that its integration was "asserted, not yet exercised". [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45-67] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/design-restraint/] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:138] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py]

2. **[NEW, partially missing] Rec 3 landed only halfway: the native-duplication row exists, a distinct hand-rolled-standard-library row was not located.** The checklist carries "Custom code or a dependency duplicating a native platform/runtime capability without a current requirement the native feature cannot satisfy", but no separate row for hand-rolling a standard-library capability. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:123] The prior recommendation asked for both rows as "genuinely absent today — 0 grep hits". [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:47]

3. **[LOST, pending] Rec 10's `shrink` row is still absent and its deferral now has no owner.** The archived report deferred it for style-churn risk, constrained to equal-clarity and behavior-preserving. No `shrink` row exists in the review checklist or review-core. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:61] Because the deferral lives only in an archived packet, the item is recorded as pending rather than closed; iteration 3's report-only lean-summary line is the natural place for the same information without a subjective per-finding row.

4. **[LOST, pending] Rec 11's `code_loc` plus over-engineering-marker metric was never folded into the Lane B sweep, although both the lane and the mechanism now exist.** The prior recommendation targeted `deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` and the sweep reporter, gated behind the correctness gate. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:62] The lane is still present [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/], but no `code_loc` or over-engineering metric appears in the scorer, while Ponytail's `loc.js` supplies a working, self-corrected measurement-only implementation (iteration 6, finding 4). This is the single clearest pending recommendation with both halves available.

5. **[NEW] Rec 15's stated blocker is gone: cross-runtime priming hooks now exist, but they prime continuity rather than sk-code surface doctrine.** The recommendation deferred a SessionStart surface-priming hook and a standards-injection hook "for the 3-runtime wiring/drift cost". [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:66] `.skilled/hooks/session-lifecycle/` now indexes default-on, fail-open priming adapters for Claude, Codex, Cursor, Devin and Pi, with a shared Claude implementation, thin adapters, and a kill-switch. [SOURCE: .skilled/hooks/session-lifecycle/README.md:1-30] What those hooks inject is spec-folder continuity context, not a surface/standards payload, so the deferred work is now a payload addition to existing, already-wired infrastructure rather than new plumbing.

6. **[NEW] One DO-NOT-ADOPT rationale has aged out and should be restated, while its conclusion still holds.** The rejection of a "Standalone PromptFoo clone" reasoned that it "duplicates the existing deep-improvement Lane B sweep **and** copies ponytail's missing correctness gate". [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:74] Ponytail's agentic harness now contains both a correctness gate and an adversarial safety tier (iteration 6, findings 2 and 7), so the second half of that rationale no longer describes the source. The conclusion stands on duplication grounds alone, and the newly available part — a gate that runs before a size metric and a tier that catches happy-path-correct-but-unsafe code — is precisely what finding 4's pending metric needs.

7. **[ALREADY-ADOPTED] The negative-knowledge list is still honored, and iterations 3, 4 and 6 independently reproduced three of its conclusions.** No second review skill exists, LOC is not a severity gate, no numeric severity tier was added for over-engineering, skill surfaces are not byte-compared or per-turn injected, and the literal `// ponytail:` brand was not adopted. Iteration 3's rejection of command/skill doctrine duplication, iteration 4's rejection of byte-equality for skill surfaces, and iteration 6's rejection of a ported task corpus land on the same conclusions from new evidence. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:70-86] [SOURCE: iterations/iteration-003.md, iterations/iteration-004.md, iterations/iteration-006.md]

8. **[ALREADY-ADOPTED, relocated] Rec 12 landed under a different name than proposed and is enforced at commit time.** The recommendation asked to promote `mirror-sync-verify.cjs` to a repo-wide pre-commit and CI gate; the current tree enforces agent mirror parity in `.skilled/hooks/git/pre-commit`, which checks staged agent files with `check-agent-mirror-sync.cjs` and blocks the commit, failing open with a warning only when node or the checker is unavailable. [SOURCE: .skilled/hooks/git/pre-commit:78-94] [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:63]

### Reconciliation ledger

| Prior item | Current verdict | Evidence |
|---|---|---|
| rec 1, 2 ladder in always-loaded doc | present, plus a `design-restraint-ladder` scenario | code-quality-standards.md:42; design-restraint/ |
| rec 3 stdlib + native rows | partially present (native row only) | code-quality-checklist.md:123 |
| rec 4 review-status canary | present, exceeded by delivery-prefix invariant | check-rule-copies.js |
| rec 5, 6 ceiling content and downgrade | present, plus a scenario | code-quality-checklist.md; ceiling-comment-downgrade.md |
| rec 7 needed-ness prompt | present verbatim | code-quality-checklist.md:138 |
| rec 8 `Replacement` field | present | removal-plan.md:53 |
| rec 9 Iron Law canonicalization | resolved by relocation and concept-level canary | shared/references/workflow-verify.md |
| rec 10 `shrink` row | absent, deferral unowned | no hits |
| rec 11 `code_loc` metric | absent from Lane B | model-benchmark scorer |
| rec 12 mirror-sync promotion | present as a staged-only commit gate | .skilled/hooks/git/pre-commit:78-94 |
| rec 13 stack-folders validator | present, plus a scenario | verify_stack_folders.py |
| rec 14 review-depth alias | present | sk-code-review/SKILL.md:530 |
| rec 15 priming hooks | infrastructure present, payload absent | session-lifecycle/README.md |
| rec 16 review-agent canary | partially: mirror parity yes, header-vocab canary not located | pre-commit mirror gate |
| rec 17 anti-stall rule | present as a verified scenario | design-restraint/implementer-anti-stall.md |
| DO-NOT-ADOPT (11 items) | still honored; one rationale aged out | research.md:70-86 |

### Classification roll-up (iteration 7)

| Classification | Findings |
|---|---|
| ALREADY-ADOPTED | 1 (twelve items, four exceeded), 7 (negative knowledge honored), 8 (rec 12 relocated) |
| NEW | 2 (partial rec 3), 5 (rec 15 blocker gone), 6 (aged rejection rationale) |
| LOST | 3 (rec 10), 4 (rec 11) |

## Ruled Out

- Re-proposing the eleven DO-NOT-ADOPT items: three of them were independently re-derived as rejections in this lineage with new evidence, and the rest are not contradicted by anything read.
- Treating the archived deferrals as closed: two of them (rec 10, rec 11) have no owner and no recorded closure.

## Dead Ends

- Searching for a `shrink` row under alternate names: none found in the checklist, review-core, or removal plan.
- Searching for the `code_loc` metric outside the Lane B scorer: no located implementation anywhere in the deep-improvement scripts.

## Edge Cases

- Ambiguous input: "present" for rec 3 rests on one grep pattern set; the stdlib row may exist under wording not covered by the patterns used, so finding 2 states what was searched rather than asserting absence. [SOURCE: verification standard, confirmed-vs-inferred]
- Contradictory evidence: rec 1's integration caveat is discharged by the presence of a playbook scenario, but the scenario's last recorded verdict comes from a retired harness run; presence of the scenario is confirmed, its current pass state is not.
- Missing dependencies: none.
- Partial success: findings 2 and 8 are explicitly partial.

## Sources Consulted

- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-88
- .skilled/skills/sk-code/manual-testing-playbook/design-restraint/{design-restraint-ladder,ceiling-comment-convention,implementer-anti-stall,stack-folders-validator}.md
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:120-140
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:53
- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
- .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py
- .skilled/hooks/git/pre-commit:78-94
- .skilled/hooks/session-lifecycle/README.md:1-30
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/
- .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:239-302

## Assessment

- New information ratio: 0.5 (2 LOST, 2 new, 1 partial, 3 already-adopted among 8 findings)
- Questions addressed: Q7
- Questions answered: Q7

## Reflection

- What worked and why: resolving each recommendation to a concrete path or scenario turned "was it adopted" into a checkable question and produced a ledger the synthesis can reuse directly.
- What did not work and why: my first pass assumed rec 12 was lost because `mirror-sync-verify.cjs` is not wired anywhere; the actual gate exists under a different filename, which only a pre-commit read revealed.
- What I would do differently: grep the enforcement surface (hooks, workflows) before concluding a guard was never promoted.

## Recommended Next Focus

Q8 — original ideas Ponytail inspires but does not contain, plus a consolidation of the rejection set, so the synthesis can carry proposals that are neither copies of Ponytail nor re-statements of the prior refinement.
