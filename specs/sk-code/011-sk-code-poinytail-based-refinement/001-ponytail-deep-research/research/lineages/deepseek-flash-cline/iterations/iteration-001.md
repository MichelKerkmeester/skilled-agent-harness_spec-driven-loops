---
title: "Iteration 1: Ponytail core doctrine and the smallest-complete-change ladder vs the sk-code hub"
trigger_phrases: []
---
# Iteration 1: Ponytail core doctrine and the smallest-complete-change ladder vs the sk-code hub

## Focus

Q1 — extract Ponytail 5.1.0's core doctrine, its cost model, and its smallest-complete-change ladder, then compare that doctrine with what the sk-code two-axis hub and shared doctrine actually carry today. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST` against the earlier refinement at `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:1-32` — the compact doctrine: lazy senior dev, scope enumeration, 6-rung ladder, never-cut list, `shortcut:` comment form.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:1-52` — the long-form prompt, session activation, lite/full/ultra levels.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:40-122` — the published numbers, the date-picker before/after, the 7-rung ladder image alt text, the review/audit rebuilds.
- `.skilled/skills/sk-code/SKILL.md:13-17,41,52-64,130-186` — hub identity, two axes, routing, layout, rules.
- `.skilled/skills/sk-code/mode-registry.json:1-115` and `hub-router.json:1-80` — the discriminator and routing signals.
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-56` — the transplanted Design Restraint Ladder.
- `.skilled/skills/sk-code/shared/references/workflow-verify.md:24-40,110,143` — the Iron Law and blind-spot reporting.
- `.skilled/skills/sk-code/shared/references/workflow-implement.md:51` — read-before-write doctrine.
- `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` — the `ceiling:` convention.
- `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-117` — the prior ADOPT/LATER/DO-NOT-ADOPT baseline.

## Findings

1. **[NEW] Ponytail's ladder has a "reuse what is already in this codebase" rung that sk-code's transplanted ladder dropped.** The 7-rung ladder in the v5 README reads: 1 does it need to exist, 2 *already in this codebase*, 3 standard library, 4 native platform feature, 5 installed dependency, 6 can it be one line, 7 minimum plus a test. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:111] The date-picker example is exactly this rung in action: "first looks at what is already there: the repo has an `Input` component". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:88] sk-code's ladder jumps YAGNI → stdlib → native → installed dependency → one line → minimum, with no repo-reuse rung. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46-53] The compact AGENTS.md list the transplant followed also omits it. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:13-18] Not in the prior refinement's recommendation set. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45,114]

2. **[NEW] Ponytail's never-cut guardrail is absent from the sk-code ladder text.** Ponytail states the floor explicitly next to the ladder: "Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:30] The sk-code ladder section ends at rung 6 with a scope-precedence paragraph and no never-cut enumeration. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46-56] sk-code's floors do exist elsewhere (P0/P1/P2 tiers, security/correctness checklists), [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:58-68] so this is a guardrail-localization gap, not an absent floor: an implementer reading only the ladder never sees what the ladder may not cut.

3. **[NEW] The "unfinished without its check" test reflex is not carried by the sk-code ladder or quality standard.** Ponytail: "Lazy code without its check is unfinished: new non-trivial logic (a branch, a loop, a parser, money or security, or a whole new script or app) leaves one small test or an assert-based self-check. Trivial changes need none." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:27] A grep for "one small test", "assert-based", or "smallest test" across sk-code shared references and the hub SKILL.md returns nothing. The framework-level repo `AGENTS.md` carries a "Test what changed" rule, so the reflex exists at framework level, but the code-work packet does not name it where the ladder is read. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-56] Not in the prior recommendation set. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:43-54]

4. **[ALREADY-ADOPTED] Ponytail's reply-close honesty line is already covered by sk-code verification doctrine.** Ponytail requires every reply to end with "what you skipped or did not check, and any risk the user must know". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15] sk-code's verification reference requires naming each rung's blind spot and records a "Claim Scope … and the blind spot that remains" row. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:28,110,143] The framework `AGENTS.md` §10 close-out mandate covers the rest. No adoption needed; a one-line implementation-mode close could still borrow the wording.

5. **[NEW] The pre-write scope enumeration is narrower in sk-code than in Ponytail.** Ponytail asks for the full reach list before editing: "callers, tests, fixtures, config, exports" plus user-facing breakage. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:7] sk-code's implement doctrine only says "Read nearby conventions, callers, and existing examples before introducing new shapes" — tests, fixtures, config, and exports are not enumerated. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:51] The framework `AGENTS.md` Restraint Signals carry a "touch check" for callers/shared contracts, so the gap is packet-local.

6. **[ALREADY-ADOPTED] The doctrine *structure* diverges by design, and Ponytail's flattening should stay rejected.** Ponytail is "one prompt … Everything else in this repo loads that prompt into different agents". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:120-122] sk-code keeps one hub with nested mode packets and one shared workflow doctrine symlinked into surfaces; the hub holds no per-mode logic. [SOURCE: .skilled/skills/sk-code/SKILL.md:15,41,167-186] The prior refinement already rejected per-host copies and always-on injection as a bad fit for a multi-file router. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:84]

7. **[ALREADY-ADOPTED] The lite/full/ultra intensity slider stays rejected; only the depth alias is legitimate.** Ponytail ships three levels including "ultra" questioning the request pre-build. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:46-52] The prior refinement rejected a verification slider in both sk-code and sk-code-review because it lowers the Phase-3 floor, [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:74-75] and the adopted remnant is the `SK_CODE_REVIEW_DEPTH` alias that only names an existing tier. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530-532] Current state is coherent: no new slider work.

8. **[NEW] Ponytail's cost model belongs in sk-code's benchmark harness, never in a severity gate.** Ponytail publishes restraint deltas (-53% code, -41% time, -26% cost, -45% tokens) and a test-rate counter-claim (98% of risky logic ships with a test vs 68% without). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:46-49,80] The prior refinement rejected LOC/net-lines as a severity gate but explicitly allowed an optional supporting benchmark metric. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:78,111] sk-code's benchmark suite is the right home; Q6 covers the harness details.

9. **[ALREADY-ADOPTED] The `shortcut:` comment form already landed as neutral `ceiling:` content.** Ponytail writes `shortcut: <the limit>, <when to upgrade>`. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:28] sk-code's style guide keeps the content but bans brand prefixes and keeps `ceiling:` out of the comment-hygiene allowlist. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md] This matches the prior refinement's neutral-content recommendation. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:49]

### Classification roll-up (iteration 1)

| Classification | Findings |
|---|---|
| NEW | 1 (rung gap), 2 (never-cut), 3 (test reflex), 5 (scope enumeration), 8 (cost metric) |
| ALREADY-ADOPTED | 4 (reply close), 6 (structure), 7 (slider), 9 (ceiling) |
| LOST | none yet — the two-axis migration moved adopted items into `shared/` and packets; the search for LOST items continues in Q7 |

## Ruled Out

- Blaming the ladder transplant for the missing rung: the transplant followed the AGENTS.md 6-rung list faithfully; the 7-rung README version is the one that carries rung 2. The defect is upstream source divergence, not a mistranslation.
- Treating Ponytail's never-cut list as a new floor system for sk-code: P0/P1/P2 tiers and the security/correctness checklists already own the floors. Only the ladder-local guardrail is missing.
- Re-litigating the lite/full/ultra slider: prior negative knowledge is confirmed, not superseded.

## Dead Ends

- Searching for sk-code files that are literal ports of Ponytail paths (`references/universal/code-quality-standards.md` exists under `shared/`, so old-path greps miss). Old-path ancestry checks are unreliable post-migration; the LOST sweep must grep by concept, not by old path.

## Edge Cases

- Ambiguous input: none — Q1 was answered from the named sources.
- Contradictory evidence: Ponytail's own source disagrees with itself (AGENTS.md 6 rungs vs README 7 rungs). Both are cited; the README version is treated as authoritative for the v5 ladder because it names the reuse rung and the example demonstrates it.
- Missing dependencies: none.
- Partial success: none — all planned reads succeeded.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:3,7,11-30
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15,25-44,46-52
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:46-49,80,88,111,120-122
- .skilled/skills/sk-code/SKILL.md:15,41,167-186
- .skilled/skills/sk-code/mode-registry.json:1-115
- .skilled/skills/sk-code/hub-router.json:1-80
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-68
- .skilled/skills/sk-code/shared/references/universal/code-style-guide.md
- .skilled/skills/sk-code/shared/references/workflow-implement.md:51
- .skilled/skills/sk-code/shared/references/workflow-verify.md:24-40,110,143
- .skilled/skills/sk-code/sk-code-review/SKILL.md:530-532
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-117

## Assessment

- New information ratio: 0.5 (3 fully new, 3 partially new, 3 redundant among 9 findings)
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: reading both Ponytail's compact and long-form doctrine side by side exposed an internal source contradiction (6 vs 7 rungs) that a single-file read would have missed; the classification table then forced each finding to justify its bucket.
- What did not work and why: grepping for transplanted content by old paths (`references/universal/...`) under `.opencode/skills/...` returned noise; the packet now lives under `.skilled/skills/sk-code/shared/`. Concept greps are the reliable tool for the LOST sweep.
- What I would do differently: read `shared/`'s always-load contract before judging whether a guardrail is "missing" — the next iteration should verify which shared references are always loaded versus conditional, so localization gaps are judged against the real load path.

## Recommended Next Focus

Q2 — Ponytail's hook mechanisms (activation, mode persistence, session tracking, runtime gating) versus sk-code's hook tooling; this determines whether any hook behavior deserves a sk-code port and where the runtime-parity cost lands.
