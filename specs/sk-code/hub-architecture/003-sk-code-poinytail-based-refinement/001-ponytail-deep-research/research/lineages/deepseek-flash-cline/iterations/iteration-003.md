---
title: "Iteration 3: Ponytail command and skill delegation vs sk-code routing and the review output contract"
trigger_phrases: []
---
# Iteration 3: Ponytail command and skill delegation vs sk-code routing and the review output contract

## Focus

Q3 — how Ponytail's commands and bundled skills delegate work (`ponytail-review`, `ponytail-audit`, `ponytail-gain`, `ponytail-debt`, `ponytail-help`) and how that compares with sk-code's two-stage registry routing and the sk-code-review output contract. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail.md:1-5`, `ponytail-review.md:1-5`, `ponytail-audit.md:1-5`, `ponytail-debt.md:1-5`, `ponytail-gain.md:1-5`, `ponytail-help.md` — all six command contracts (five lines each).
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:1-40` — the long-form review skill.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/plugin.yaml:1-20` — provides_commands/provides_skills lists.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:152-163` — commands table and host capability notes.
- `.skilled/skills/sk-code/SKILL.md:52-64` — compiled routing and the discriminator.
- `.skilled/skills/sk-code/hub-router.json:1-107` — stage-one signals and outcomes.
- `.skilled/skills/sk-code/ROUTER.md:16-49,51-106` — stage-two intent model and evidence-surface folding.
- `.skilled/skills/sk-code/mode-registry.json:22-114` — toolSurface, backendKind, aliases.
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:315,328-395` — output contract and final-line contract.
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md:44-118` — finding schema and ordering.
- `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:20-70` — removal evidence requirements.

## Findings

1. **[NEW] Ponytail's review/audit finding format carries a consequence-of-inaction bullet that sk-code-review's schema lacks.** Every Ponytail review finding has four bullets — "What this is, Problem, Fix, If we skip it" — and audit uses the same four. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:5] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:5] sk-code-review's finding schema requires id, severity, title, file, evidence, findingClass, scopeProof, optional affectedSurfaceHints, optional riskScore, and recommendation. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:88-108] "User impact" and "Risk" exist in the rendered report, but neither names the cost of deferring the fix — the decision information an operator actually uses to accept a P1. Additive schema row, no severity-model change.

2. **[NEW] Ponytail's "Not checked:" closer has no sk-code-review equivalent.** The review command ends with "'Not checked:' if something mattered and you could not check it"; the audit ends with "'Not checked:' for the parts you did not read". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:5] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:5] sk-code-review's output contract ends with a Removal/Iteration Plan, Next Steps, and one exact `Review status:` line; no section names the review's own coverage limits. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:328-395] The verification doctrine's blind-spot rule covers verification, not review coverage; this is a review-local honesty gap. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:110]

3. **[NEW] The "Lean: -N lines / -M dependencies" report-only line is absent and is compatible with the prior LOC rejection.** Ponytail review ends with "'Lean: -N lines possible.' when lean findings exist" and audit with "'Lean: -N lines, -M dependencies possible.'". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:5] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:5] sk-code-review reports a removal plan with per-item evidence and impact but no overall lean summary. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:40-60] The prior refinement rejected LOC as a severity gate or score while allowing it as optional supporting evidence; a summary line is exactly that supporting-evidence role. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:78]

4. **[NEW] Ponytail's gain command states an anti-fabricated-baseline rule that sk-code's measurement surfaces should copy verbatim in spirit.** "NEVER print a per-repo savings number: the unbuilt version was never written, so there is no real baseline to subtract from in a live repo." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5] The command also declares itself one-shot and non-persistent ("do not switch mode, write flag files, or persist anything"). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5] Q6 owns the benchmark-harness detail; this finding is the honesty rule that makes any restraint metric safe to publish.

5. **[REJECT] Duplicating one doctrine across a command paragraph and a full skill file is the wrong pattern for sk-code.** Ponytail ships the same review procedure twice: a five-line command paragraph and a multi-section skill file. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:1-5] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:1-40] `plugin.yaml` lists the same six names as both commands and skills. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/plugin.yaml:8-19] sk-code's one-baseline rule keeps review doctrine in one mode packet and routes to it; the prior refinement explicitly rejected a second review skill or output contract. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:77] Only the *runtime shim* idea (a host capability wrapper over the one packet) is separable from the duplication.

6. **[ALREADY-ADOPTED, stronger] sk-code's two-stage registry routing has no Ponytail counterpart.** Stage one is `hub-router.json` (mode signals, tie-break, outcomes including `surfaceBundle`), stage two is `ROUTER.md` (surface-first, intent-second resource maps, with the machine-readable projection in §11). [SOURCE: .skilled/skills/sk-code/hub-router.json:1-47] [SOURCE: .skilled/skills/sk-code/ROUTER.md:22-49,51-106] Compiled routing is default-on with a legacy sentinel and a kill-switch. [SOURCE: .skilled/skills/sk-code/SKILL.md:56-60] Ponytail's commands are direct prompts with no routing layer; the only selection mechanism is the host's command namespace. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:152-163]

7. **[NEW, partially] Ponytail names a fixed review traversal order independent of severity.** The review skill states the importance order: "correct, safe, holds under load, tested, fast, lean." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md] sk-code-review orders *output* by severity and within a bucket by impact and confidence [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:53-57] but does not name a fixed check-pass order; its checks come from intent-routed checklist families. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:288-315] A named traversal order is a cheap addition that cannot change severity or routing.

8. **[NEW, partially] Ponytail enumerates the exact artifact classes to search before calling code unused.** The audit command: "Before calling code unused, grep the whole tree including tests, fixtures, config and string references." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:5] sk-code-review's removal plan already requires "Codebase reference search complete", "Dynamic/reflective usage considered", and an Evidence field, but the checklist does not enumerate the artifact classes (tests, fixtures, config, string references). [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:32,44-60]

9. **[ALREADY-ADOPTED, enforced] "Change no code" is a tool-surface rule in sk-code-review, stronger than a prose rule.** Ponytail's review/audit commands end with "Change no code." / "Report only." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:5] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:5] sk-code-review forbids `Edit` in its registry toolSurface and scopes the only `Write` to an untracked review cache. [SOURCE: .skilled/skills/sk-code/mode-registry.json:42-58]

### Classification roll-up (iteration 3)

| Classification | Findings |
|---|---|
| NEW | 1 (skip-consequence bullet), 2 (not-checked closer), 3 (lean summary line), 4 (anti-fabricated baseline), 7 (traversal order), 8 (removal artifact classes) |
| ALREADY-ADOPTED | 6 (two-stage routing, stronger), 9 (no-code enforcement, stronger) |
| REJECT (reasoned) | 5 (doctrine duplication across command and skill) |
| LOST | none — no prior adopted review item is missing; the prior ADOPT-LATER items (shrink row #10) remain open, not lost |

## Ruled Out

- Copying Ponytail's command-plus-skill duplication into sk-code: it contradicts the one-baseline rule and the router's single-source discipline.
- Treating the lean summary line as a gate: the prior LOC rejection stands; the line is report-only evidence.

## Dead Ends

- Comparing command counts (6 Ponytail commands vs 0 sk-code commands) as a maturity signal: the surfaces have different invocation models; the count says nothing about routing quality.

## Edge Cases

- Ambiguous input: none — Q3 answered from named sources.
- Contradictory evidence: the prior research rejected `shrink` (rec #10, LOC-flavored) as a review row while this iteration proposes a report-only lean line. Both are cited; the scope difference (gate vs report-only evidence) resolves the apparent conflict and is stated in the finding.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail.md:1-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-review.md:1-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-audit.md:1-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-debt.md:1-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:1-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:1-40
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/plugin.yaml:1-20
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:152-163
- .skilled/skills/sk-code/SKILL.md:52-64
- .skilled/skills/sk-code/hub-router.json:1-107
- .skilled/skills/sk-code/ROUTER.md:16-106
- .skilled/skills/sk-code/mode-registry.json:22-114
- .skilled/skills/sk-code/sk-code-review/SKILL.md:288-395
- .skilled/skills/sk-code/sk-code-review/references/review-core.md:44-118
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:20-70
- .skilled/skills/sk-code/shared/references/workflow-verify.md:110
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:61,77-78

## Assessment

- New information ratio: 0.56 (4 fully new, 2 partially new, 3 already-adopted/rejected among 9 findings)
- Questions addressed: Q3
- Questions answered: Q3

## Reflection

- What worked and why: reading the five-line commands in full exposed that the *dense paragraph* is the entire contract — a format that made the four-bullet finding shape and the honesty closers immediately comparable against sk-code-review's schema.
- What did not work and why: an initial assumption that Ponytail's commands delegate to the skills was wrong; both carry the doctrine, which is itself the finding.
- What I would do differently: check the audit command's grep-before-unused rule against `removal-plan.md` before drafting, to avoid an early over-claim that removal evidence was missing entirely.

## Recommended Next Focus

Q4 — portability across agent runtimes and rule-file copies: what Ponytail's per-host adapters and always-on rule files can teach sk-code's runtime surfaces and rule-copy checks, and where token-set mirroring already beats byte-equality.
