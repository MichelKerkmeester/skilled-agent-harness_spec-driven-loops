# Iteration 7: Implement and quality ancillary-doc convergence pass

## Focus

This iteration checked `code-implement` and `code-quality` ancillary docs/assets for contradictions or re-ranking evidence after iteration 6 broadened README/checklist path drift. The selected interpretation was narrow: inspect whether implement/quality READMEs, quality checklist, and quality helper script add materially new upgrade proposals or only refine the current ranking.

## Findings

1. `code-implement/README.md` confirms the stale-path vocabulary proposal but does not change its rank: quick start still says to load packet-owned `references/webflow/`, `references/opencode/`, and `references/motion_dev/`, while later related-document links point to sibling packets such as `../code-webflow/...`, `../code-opencode/...`, and `../code-animation/...`. The fix should normalize visible wording to delegated sibling surface packets rather than add local reference trees. [SOURCE: .opencode/skills/sk-code/code-implement/README.md:42] [SOURCE: .opencode/skills/sk-code/code-implement/README.md:73] [SOURCE: .opencode/skills/sk-code/code-implement/README.md:74] [SOURCE: .opencode/skills/sk-code/code-implement/README.md:75]
2. `code-quality/README.md` repeats the same OpenCode checklist label drift found in `SKILL.md`: it says the matching checklist is under `assets/opencode-checklists/`, but the actual Markdown link targets `../code-opencode/assets/checklists/`. This corroborates proposal 3 and confirms the path-normalization change must update README quick-start and related-doc tables, not just runtime contract prose. [SOURCE: .opencode/skills/sk-code/code-quality/README.md:47] [SOURCE: .opencode/skills/sk-code/code-quality/README.md:104] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:144]
3. `code-quality/assets/code_quality_checklist.md` is correctly specialized for Webflow/frontend JavaScript and CSS, with source standards pointing into `../../code-webflow/references/...`; this supports keeping checklist overlap intentional rather than merging all quality material into one OpenCode checklist. It also narrows the proposal: preserve this asset as the Webflow/general quality gate, while delegated OpenCode checklists remain in `code-opencode`. [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:14] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:35] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:52] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:56]
4. The quality checklist's “review baseline handoff” explicitly points formal findings-first review to `code-review`, while using the checklist as web-specific overlay evidence. This corroborates prior overlap analysis: author-side quality, findings-first review, and workflow verification are adjacent but not interchangeable; the proposal should document boundaries, not collapse packets. [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:42] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:44] [SOURCE: .opencode/skills/sk-code/code-quality/README.md:65]
5. `check-dist-staleness.sh` is intentionally advisory: it says it always exits 0, prints a warning banner when stale dist is detected, and silently exits on missing checker, parse errors, or timeout. This does not add a new top-five proposal, but it refines the quality-mode upgrade: document advisory semantics in the handoff schema/quality evidence so warnings are surfaced without treating the script as a hard pass/fail verifier. [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:5] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:7] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:37] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:60]

## Ruled Out

- Promoting a new separate proposal for `check-dist-staleness.sh`; its advisory behavior is useful as a quality-evidence field but lower priority than the broken verifier, handoff schema, and path normalization. [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:7]
- Merging `code-quality` and `code-review`; the quality checklist explicitly treats formal review as a separate baseline mode and uses this checklist as overlay evidence. [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:42]
- Adding local `references/` directories under `code-implement`; the README's own related links already point to sibling surface packets. [SOURCE: .opencode/skills/sk-code/code-implement/README.md:73]

## Dead Ends

- Further ancillary-doc rereads are approaching low yield: this pass corroborated existing proposals and added only advisory-script nuance.
- Historical changelog archaeology remains low value for current upgrade ranking; current READMEs/assets are enough to describe the migration target.

## Edge Cases

- Ambiguous input: none; continuation explicitly preserved the same research target.
- Contradictory evidence: visible labels still name old local paths while Markdown destinations use current sibling paths; resolved as documentation drift.
- Missing dependencies: none required; no resource map was generated because this leaf iteration's allowed writes remain packet-local research artifacts.
- Partial success: none for the iteration scope; convergence is closer but not yet at threshold because advisory-script semantics and README drift details refine proposals.

## Sources Consulted

- .opencode/skills/sk-code/code-implement/README.md:42
- .opencode/skills/sk-code/code-implement/README.md:73
- .opencode/skills/sk-code/code-implement/README.md:74
- .opencode/skills/sk-code/code-implement/README.md:75
- .opencode/skills/sk-code/code-quality/README.md:47
- .opencode/skills/sk-code/code-quality/README.md:65
- .opencode/skills/sk-code/code-quality/README.md:104
- .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:14
- .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:42
- .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:7
- .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:60

## Assessment

- New information ratio: 0.30
- Questions addressed:
  - What coverage gaps exist across `SKILL.md`, `references/`, and `assets`?
  - What friction do users or agents encounter when routing, loading, applying, or verifying these skills?
  - Which upgrade proposals have the highest leverage and clearest evidence?
- Questions answered:
  - Implement/quality ancillary docs corroborate the existing ranking rather than adding a new top proposal.
  - The path-normalization proposal should include `code-implement/README.md` and `code-quality/README.md`; the handoff-schema proposal should include advisory dist-warning semantics.

## Reflection

- What worked and why: Narrow ancillary-doc checks found proposal refinements without reopening already answered lifecycle questions.
- What did not work and why: This pass produced diminishing new information; most evidence repeated already-known delegated-path drift.
- What I would do differently: Next iteration should stop broad source inspection and produce a convergence-focused final synthesis, checking only for contradictions to the top-five ordering.

## Recommended Next Focus

Run a final synthesis/convergence iteration: no broad rereads unless a contradiction is found; consolidate final ranked proposals, evidence targets, and validation hooks in `research.md`.
