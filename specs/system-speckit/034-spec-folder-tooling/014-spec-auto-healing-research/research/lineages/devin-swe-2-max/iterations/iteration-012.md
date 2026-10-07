# Iteration 12: Q4 close (corpus-commit lessons) + Q5 surface (the gate lattice that exists)

## Focus

Extract what the four corpus-scale commits teach about mass writes, then map the complete gate lattice - pre-commit, pre-push, PR CI, post-merge, weekly - to locate the uncovered seams.

## Actions Taken

1. Re-read `steer.md`.
2. Read commit messages + stats for bdd678bccff, 7fe1cbeda87, b36842de3c1, d727cf94fe1.
3. Read `changed-packet-validation.yml` and `spec-kit-check.yml` in full.
4. Read `install-git-hooks.sh`, `git-hooks/pre-commit` (spec-remint block :536-610), `git-hooks/pre-push` gates.
5. Read `strict-pass-freshness-report.yml` in full and `strict-pass-freshness.ts` baseline handling.

## Findings

1. Every corpus commit follows one discipline: content edit + metadata re-derive + index rebuild + idempotency proof, all inside the commit message. 7fe1cbeda87 records "a second cleanup run finds nothing to change"; bdd678bccff notes the re-derive "also replaced 18 leftover scaffold packet pointers" (repair-derived side effect); the index rides the same commit as the corpus change. CONFIRMED [SOURCE: git show 7fe1cbeda87, bdd678bccff, d727cf94fe1 commit messages]
2. b36842de3c1 is the lane playbook executed by hand on 21 packets BEFORE the lanes existed: fill importance_tier/contextType from the packet's spec.md, seed empty trigger lists from slug+title, wrap anchors+headers around unchanged prose, fix a status cell - identical rule classes, proving the playbook predates the lane machinery. CONFIRMED [SOURCE: git show b36842de3c1 message; batch-01.task rules]
3. `changed-packet-validation.yml` is regression-gated, not state-gated: scope = packets whose own graded docs changed (a nested-artifact over-scope once pulled in 427 packets); a failing packet is re-validated against a base worktree and only NEW failures block; new packets must pass outright; "no verdict fails closed" on both sides. This is the correct cheap gate shape. CONFIRMED [SOURCE: .github/workflows/changed-packet-validation.yml:56-157]
4. The pre-commit spec-remint gate auto-FIXES rather than blocks: staged spec docs -> nearest ancestor carrying both graph-metadata.json and spec.md (phase-child safe, grouping-dir safe) -> regenerate + stage derived metadata. It refuses exactly where regenerating would lie: pathspec-narrowed commits (throwaway `next-index-*`) and half-staged input docs. Its own comment names the discovery: "A repository sweep found 460 packets carrying a stale fingerprint." CONFIRMED [SOURCE: .skilled/scripts/git-hooks/pre-commit:536-590; install-git-hooks.sh gate list]
5. GAP - the weekly freshness sweep's ratchet is plumbed but inert: `strict-pass-freshness.ts` accepts `--baseline report.json` and distinguishes regression/new-failure/first-run/known-failure, but the workflow never passes --baseline (no previous-artifact download step), so the `by.regression` warning block can never fire. CONFIRMED [SOURCE: .github/workflows/strict-pass-freshness-report.yml:50-85; .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:20-32,77-96,213-215]
6. GAP - no commit-time structural validation: the pre-commit lattice fixes derived metadata but never runs the validator, so an edit that breaks an anchor pair or removes a required section ships locally and only fails at the PR gate (or the weekly). At ~2s/packet the strict check is affordable for the staged-packets set - which is already computed for the remint. CONFIRMED [SOURCE: install-git-hooks.sh gate list (no validate entry); upgrade-legacy.mjs:67 timing note; pre-commit:536-590]
7. `spec-kit-check.yml` covers the toolchain: typecheck + cli check gate + three test projects + NINE mirror-parity checks with deliberately widened path triggers ("Every mirror source and every mirror output triggers it now" after a drift-attribution miss). CONFIRMED [SOURCE: .github/workflows/spec-kit-check.yml:10-28,89-161]
8. Pre-push guards the PUSHED tree, not the working tree - route guard validated at each tip commit, track roots checked at the pushed ref via `sweep-track-roots --rev`; catches the "clean working tree, dirty commit" gap a working-tree check would miss. CONFIRMED [SOURCE: .skilled/scripts/git-hooks/pre-push:17-20,436-470; README sweep-track-roots row]

## Ruled Out

- Making strict-pass-freshness a merge gate: the file documents why report-only is the design ("a gate that cannot fail is worse than no gate") - corpus state includes archived debt no PR can fix. The ratchet (baseline diff) is the middle path between gate and blind spot.
- Whole-corpus validation on every PR: ~2s/packet x thousands of packets is the wrong cost curve; regression-scoping is the established answer.

## Dead Ends

None.

## Edge Cases

- The remint gate's pathspec-narrowed-commit refusal shows the authors already hit the "staged in throwaway index, silently reverted" trap - any new auto-fix gate needs the same detection.
- strict-pass-freshness deliberately omits --apply on the repair-derived step "because nobody would learn that a rename left records pointing at the old place" - report-only by design.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R12.1 | Activate the inert ratchet: fetch the previous run's artifact (or a committed baseline file), pass `--baseline` to the sweep, and let `regression`/`new-failure` drive a workflow summary + optional issue filing | Q5 | strict-pass-freshness-report.yml + optionally a committed baseline | S | Low: report still doesn't block; just becomes informative | workflow yml | finding 5 | CONFIRMED gap |
| R12.2 | Add a cheap structural check to the pre-commit spec gate: after remint, run `validate.sh <packet> --strict --no-recursive` on the already-computed staged-packet set when the set is small (cap ~20); larger sets warn-and-pass to keep the hook fast | Q5 | git-hooks/pre-commit spec-remint block | M | Med: hook latency; cap avoids the mass-edit stall; reversal = SPECKIT_SKIP_* | pre-commit | finding 6 | CONFIRMED gap, INFERRED latency bound |
| R12.3 | Keep the corpus-commit discipline as the documented recipe for any future mass edit: change + re-derive + index rebuild + idempotency proof line in the commit message | Q4, Q5 | spec/README.md or CONTRIBUTING-equivalent doc | S | Low: docs | 1 doc | finding 1 | CONFIRMED pattern |
| R12.4 | Wire `repair-derived` drift output into the changed-packet job as a fix-hint annotation: when a changed packet fails on a DERIVABLE rule, print the one-line repair command in the failure block (the gate already re-runs validate for output) | Q5 | changed-packet-validation.yml failure print | S | Low: output only | workflow yml | repair-derived DERIVABLE set; job:141-142 | INFERRED value, CONFIRMED mechanics |

Idempotency/reversal/meaning: all four are CI/hook behavior; none mutates repo content. R12.2's auto-fix already exists via remint; this only adds the verdict check.

## Sources Consulted

- `steer.md`
- `git show` for bdd678bccff, 7fe1cbeda87, b36842de3c1, d727cf94fe1
- `.github/workflows/changed-packet-validation.yml` (full)
- `.github/workflows/spec-kit-check.yml` (full)
- `.github/workflows/strict-pass-freshness-report.yml` (full)
- `.skilled/scripts/install-git-hooks.sh` + `git-hooks/pre-commit` (:530-610) + `git-hooks/pre-push` (gate map)
- `strict-pass-freshness.ts` (:20-32,77-96,213-215)

## Assessment

- New information ratio: 0.9 (findings 1-8 all new evidence)
- Questions addressed: Q4 (corpus-commit discipline), Q5 (gate lattice mapped; two real gaps named)
- Questions answered: Q1, Q3, Q4; Q5 substantially (pending iter 13's gap synthesis)

## Reflection

- What worked: the commit messages themselves carry the engineering rationale ("a second cleanup run finds nothing to change") - the corpus commits were self-auditing.
- What did not: nothing.
- Do differently: pre-commit content is dense; targeted grep + block read was the right ratio.

## Recommended Next Focus

Iteration 13 (Q5 close): verify the remaining unchecked failure classes against the gate map (anchors/links/phrases/level/headers reach CI only via changed-packet or weekly sweep), then assemble the definitive check-placement table.
