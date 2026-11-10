# Iteration 8: Checklist severity models and the review agent

## Focus

Part 2, third slice: the six asset checklists against `review-core.md`'s severity definitions, and the review agent (`.skilled/agents/review.md`) with its Claude fork and generated mirrors against the mode it loads. This follows iteration 7's Recommended Next Focus.

## Actions Taken

1. Swept all six checklists for their severity rows and boundary statements (`P0`/`P1`/`P2` assignments, priority models, class names).
2. Compared the class vocabulary in `fix-completeness-checklist.md` against `SKILL.md` and `review-core.md` row by row.
3. Read the checklists' priority redefinitions and checked each against `review-core.md`'s severity table.
4. Diffed `.skilled/agents/review.md` against `.claude/agents/review.md` and checked the evidence-table case rule in all generated mirrors (Codex, Pi, Hermes, OpenCode) plus the Cursor symlink.
5. Confirmed the agent's report-order paragraph and connected-code budget note against the mode's Phase 1 and Phase 4.

## Findings

1. **The removal plan redefines `P0`/`P1`/`P2` for removal urgency under the same tokens the severity contract uses for findings, with no cross-reference.** `removal-plan.md` says "**P0**: Immediate removal required (critical security/correctness cost). **P1**: Remove in current sprint/release window. **P2**: Defer with migration plan and owner." [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:36] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:37] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:38]. The severity contract those tokens normally carry is "P0 Blocker: exploitable security issue, auth bypass, destructive data loss → Block merge; P1 Required: correctness bug → Fix before merge; P2 Suggestion: non-blocking improvement" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:32]. The removal scale asks when to delete; the severity scale asks how bad the finding is. A review that uses both in one report can say "P0" about a safe-to-delete candidate that is not a blocker, or rank a P2 finding's removal as P0. Reproducing case: `rg -n "P0" .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md .skilled/skills/sk-code/sk-code-review/references/review-core.md` prints the two incompatible definitions of the same token. NEW, P2 (internal vocabulary collision on the mode's primary severity tokens; one disambiguating sentence fixes it).
2. **The finding-class vocabulary agrees across the contract, the checklists and the output template.** All six classes and their required proofs are identical in `fix-completeness-checklist.md` [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:37] and the mode's Phase 3 and output template [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:312] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:348], and the security and test-quality checklists assign severities in the same direction as `review-core.md` (authz gaps "at least P1 and often P0" [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/security-checklist.md:62]; assertion-free tests P0 [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md:52]). ALREADY-ADOPTED, P2, no action.
3. **The review agent and its Claude fork agree on behaviour, and the generated mirrors carry the round-008 case rule.** The agent's evidence table requires a reproducing case at every severity ("Reproducing case + file:line + …", and "A finding with no reproducing case is not reported") [SOURCE: .skilled/agents/review.md:366] [SOURCE: .skilled/agents/review.md:370], its report-order paragraph matches the mode's final-line contract [SOURCE: .skilled/agents/review.md:276], and its connected-code note mirrors the mode's Phase-1 reads [SOURCE: .skilled/agents/review.md:74]. The `.claude` fork differs only in runtime dialect (frontmatter permissions, path convention, related-resource paths) and no behavioural text [SOURCE: .claude/agents/review.md]. The rule text is present in the Codex, Pi, Hermes and OpenCode mirrors, and the Cursor copy is a symlink into the Claude fork. ALREADY-ADOPTED, P2, no action; this closes the agent-versus-mode leg of key question 6.

## Questions Answered

- Key question 6's agent leg is closed: the agent, its fork and the mirrors agree with the mode; the remaining disagreement found this iteration is inside the asset set (Finding 1).

## Questions Remaining

- Does the playbook's scenario set still match the files it tests?
- What do the review scripts do on foreign-repository inputs?

## Ruled Out

- **"File the checklist severity assignments as conflicting with the core."** The checklists assign severity to rules; the core defines the tiers. No assignment contradicts a definition.
- **"File the `.claude` fork as drift."** The diff is dialect and path constants only, the documented fork pattern; phase 008's criterion already covered the shared text.
- **"Chase `.devin/agents/review.md`."** The folder has a different layout; runtime-mirror coverage of Devin is phase 007's recorded operator decision, not a review-mode defect.

## Dead Ends

- `solid-checklist.md` carries no severity tokens; it is prompt-based, so there is no scale to compare.
- `code-quality-checklist.md`'s contract-safety severities (P0 breaking API, P1 unhandled nulls, P2 implicit contracts) map cleanly onto the core definitions; no finding.

## Edge Cases

- Ambiguous input: whether the removal plan's P-scale is a sub-scale or a misuse of the severity tokens. Chosen interpretation: misuse by silence, because nothing in the file names the severity contract it borrows from.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md`
- `.skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md`
- `.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md`
- `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md`
- `.skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md`
- `.skilled/skills/sk-code/sk-code-review/assets/solid-checklist.md`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/agents/review.md`
- `.claude/agents/review.md`
- `.codex/agents/review.toml`, `.pi/agents/review.md`, `.hermes/skills/agent-review/SKILL.md`, `.opencode/agents/review.md`, `.cursor/agents/review.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.80 (one fully new finding, two ALREADY-ADOPTED agreement matrices and one mirror check).
- Questions addressed: key question 6 (agent leg closed).
- Questions answered: key question 6's agent leg.

## Reflection

- What worked and why: reading the removal plan as a document with its own scale rather than as a checklist row. The token collision is invisible if every file is assumed to use the shared severity table.
- What did not work and why: the mirror check could not use the repo's own mirror script without leaving the lineage's write discipline; the targeted presence check is weaker but sufficient for a text-parity question.
- What I would do differently: grep for redefinitions of core vocabulary (`P0`, `severity`) in every asset the moment a packet's severity contract is first read.

## Recommended Next Focus

The review playbook: do its scenarios match the files and behaviours they test, and does the root playbook index agree with the scenario files?
