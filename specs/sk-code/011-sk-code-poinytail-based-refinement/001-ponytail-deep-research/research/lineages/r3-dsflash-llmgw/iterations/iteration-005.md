# Iteration 5: Override inventory close and cross-surface rule divergence

## Focus

Part 1, closing slice: finish the surface-override inventory by reading the remaining shared-tier files of both surfaces against the universal tier, and answer the question iteration 4 left open — does any surface override a shared rule with a different rule rather than with examples? This clears Part 1's frontier before the run moves to Part 2.

## Actions Taken

1. Read `sk-code-webflow/references/shared/cross-language-rules.md` in full and swept the Webflow language guides for the comment-quantity rule.
2. Swept `sk-code-opencode/references/shared/code-organization/*` for the folder and test-location rules the universal guide owns, to see whether the surface restates them.
3. Swept `sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md` for the two P0 items it restates (boundary validation, secrets handling) and compared wording.
4. Compared the two surfaces' comment-quantity thresholds against each other and against the universal guide.
5. Checked the relative link labels in the two surface files that point at the universal guide.

## Findings

1. **The two surfaces cap comment quantity at different numbers, and the universal contract has no cap at all.** Webflow's shared rules say "Maximum 5 comments per 10 lines of code" [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md:47] and its JavaScript quick reference repeats the row [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md:68]; OpenCode's say three [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:170]. The universal guide that both surfaces consume defines comment policy by purpose, not by count, and requires a comment for every hidden constraint or non-obvious invariant [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:109]. Since both thresholds are surface rules layered over the same contract, one codebase's `sk-code` quality route and another surface's route will disagree about the same file shape, and neither number has an owner to reconcile them. Reproducing case: `rg -n "comments per 10" .skilled/skills/sk-code` prints the Webflow rows at 5 and the OpenCode rows at 3 in one output. NEW, P2 (cross-surface divergence of a rule with no shared owner; extends iteration 4's unowned-budget finding with the second surface's number).
2. **The relative link labels in the surface shared-tier files are stale pre-move paths even where the targets are right — a third and fourth instance of the label drift filed in iteration 4.** `cross-language-rules.md:173` renders a label reading `../../universal/code-style-guide.md` over a target of `../../../shared/references/universal/code-style-guide.md` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md:173], and the OpenCode naming file does the same over a four-level target [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:235]. Both targets resolve; both labels, copied literally, land outside the skill. Reproducing case: `rg -n "\[\.\./\.\./universal/code-style-guide" .skilled/skills/sk-code` prints both labels, and neither path exists from the containing file's directory. NEW, P2 (same class as f-iter004-005; now four known instances across three files, which is enough to justify one sweep rather than four fixes).
3. **The folder and test-location rules have exactly one home, and the P0 restatements in the surface files do not contradict it.** The two structure rules (no double-underscore folder names, tests under a `tests/` tree) appear only in the universal guide [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:100] — the OpenCode code-organization files carry no copy to drift from it (`rg -n "double-underscore|__tests__|tests tree"` over that folder exits 1). The surface security examples restate the P0 boundary-validation and secrets items with language examples, not with different rules; the restatements agree with the universal P0 list [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md:122] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:79]. ALREADY-ADOPTED, P2, no action.
4. **Part 1's override inventory is complete enough to close with one divergence and one duplication set.** Across the scanned surface shared tiers, the only rule-level override disagreements are the comment-quantity thresholds (Finding 1) and the unowned-budget orientation (iteration 4); everything else either defers to the universal tier by explicit pointer [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md:31] or adds surface-specific rules the universal tier never reaches. NEW, P2 (closing statement; no further Part 1 iteration is planned unless a later iteration reopens it).

## Questions Answered

- Key question 4's last leg is answered: no other silent override exists beyond the comment-quantity divergence; the remaining surface rules are additions or pointers, not replacements.
- Key question 1's reachability leg stands answered by iterations 1-2 (inventory, allowlist disagreement, stale families); its "loaded twice" leg was spot-checked and closed as non-issue.

## Questions Remaining

- Part 2: how agnostic `sk-code-review` really is, and whether its contract, checklists, scripts and playbook agree.

## Ruled Out

- **"File the surface security/validation restatements as duplication."** They carry language examples the universal P0 list cannot, and they agree with it; finding nothing to fix there is the correct result.
- **"Re-open the OpenCode 3-per-10 row as its own finding."** Already filed in iteration 4 as the unowned-budget finding; this iteration files only the cross-surface divergence between the two numbers.

## Dead Ends

- `directory-and-test-conventions.md` and `imports-and-exports.md` contain no universal-tier rules; the sweep produced no further candidates.
- The Webflow dev-workflow files are tooling walkthroughs, not standard restatements; not read in full.

## Edge Cases

- Ambiguous input: whether 5-versus-3 is a "divergence" or two deliberate surface dialects. Chosen interpretation: divergence, because neither file cites a surface reason and both sit under the same universal contract.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`
- `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md`
- `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.83 (two fully new findings, one ALREADY-ADOPTED check, one closing statement).
- Questions addressed: key questions 1 and 4.
- Questions answered: key question 4.

## Reflection

- What worked and why: comparing the two surfaces against each other, not only against the universal file. The 5-versus-3 difference is invisible from either surface alone.
- What did not work and why: the folder-rule sweep found nothing because the rules were moved to the universal guide by design; recording the no-hit is what closes the question honestly.
- What I would do differently: keep a running override matrix per universal section so each iteration's additions land in one place instead of being re-derived at synthesis time.

## Recommended Next Focus

Part 2 opens: `sk-code-review`'s repository-specific assumptions and the agreement between its SKILL.md, references, assets, scripts and playbook.
