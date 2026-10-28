# Iteration 5 — verdict per skill type and the phased plan

## Focus

Answer Q4 (which shape wins for hubs, mode packets and standalone skills), Q5 (per-skill readability), and Q6 (phased plan with order, risk and rollback), reconciled against every constraint found in iterations 1-4. This is the closure iteration; the per-question provenance for Q1-Q3 is recorded here, with the iteration that substantively answered each.

## Actions Taken

1. Consolidated the four hubs' mechanism inventories and the three drift classes.
2. Tested each candidate shape against the enforcement set from iteration 4: `parseRouter`, `verify-router-sync` legs, `RRC-001..RRC-009`, `package_skill.py`, `check-rule-copies.js`, doctor reach, and the compiler hash.
3. Checked the standalone-skill shape: no standalone skill under `.skilled/skills` carries `ROUTER.md`, `hub-router.json` or `mode-registry.json` — only the seven hubs do (`ls .skilled/skills/*/ROUTER.md` returns exactly seven); check 12a runs from the hub audit path (`parent-skill-check.cjs:2057`).
4. Read the re-mint and rollback verbs in `compiled-route-sync.cjs` (`--verify`, `--check`, `--finalize <rollback-root>`, `--revert <rollback-root>`).

## Findings

1. **Verdict for hubs: one hub `ROUTER.md` wins, and the other three shapes each have a named failing check.** Per-mode `ROUTER.md` is unparseable (`router-replay-lib.cjs:374`) and forbidden by the canon ("never at a nested path", `parent-skill-root-router-template.md:20`); hub-level JSON-only fails `RRC-001` and `RRC-009` (`root-router-contract.cjs:127-135`) and empties the reach diagnostic's stage-two input (`doctor-router-reach.yaml:65`); a per-mode router also leaves the reach glob with nothing to read. The advisor hybrid — JSON for stage one, one hub `ROUTER.md` for stage two, script resolvers for checklists — is the only shape no check rejects. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:127] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:65]

2. **Verdict for mode packets: no `ROUTER.md` per mode; the block may stay inline or move to an appendix in the same file — or be deleted where the hub already names the leaves.** `parseRouter` reads the block from anywhere in `SKILL.md` (`:397`) and packet files are outside the compiler hash (`build-artifacts.cjs:44-58`), so moving is free. But sk-doc already runs 9 of 14 packets with no machine block at all and passes, so for a packet whose leaves the hub `ROUTER.md` §3 already names, the second copy is pure drift surface and should be deleted rather than relocated. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:397] [SOURCE: .skilled/skills/sk-doc/ROUTER.md:145]

3. **Verdict for standalone skills: inline `SMART ROUTING` stays, JSON-only does not apply.** No standalone skill carries a `ROUTER.md`, `hub-router.json` or `mode-registry.json`; there is no registry for a JSON-only shape to live in, and `package_skill.py` still requires the H2 section and the three marker words (`:69`, `:182-184`). The shape is therefore "inline §2 with markers, no router files", and the sibling lineage's per-skill findings refine it. [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:182]

4. **The report's recommendation survives its own errors, with three amendments.** Correct as stated: one hub `ROUTER.md`; no `ROUTER.md` per mode; JSON-only only as a hybrid; `leaf-manifest.json` decides nothing; `parseRouter` cannot see a packet-root router. Wrong and to be corrected before a plan quotes it: "about 59 aliases" is 83; "system-deep-loop reports a stale compiled manifest" does not reproduce (7/7 fresh); the §2/§9 drift is bidirectional, not one-way. Missing: sk-doc's 9 router-less packets, which are the strongest existing evidence that per-mode blocks are optional. [SOURCE: .skilled/skills/sk-code/mode-registry.json:1] [SOURCE: .skilled/bin/compiled-route-guard.cjs:168]

5. **Readability verdict: the routing share of the biggest packet is the problem, not the hub prose.** In `sk-code-review/SKILL.md` (730 lines) SMART ROUTING opens at 49 and the first executable step tree at 67, with the resolver pseudocode running past line 392 — roughly half the file is routing apparatus before a reviewer reads the first check. Hub files are shorter but carry the same defect in miniature: `sk-doc/SKILL.md:53` is a 107-word definition and `system-deep-loop/SKILL.md:54-58` smuggles a build invariant into routing. The README files read better than the `SKILL.md` files, which is a signal about register rather than about length. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:49] [SOURCE: .skilled/skills/sk-doc/SKILL.md:53]

6. **Plan, phase 0 — capture the baseline before any edit.** Record the current output of `compiled-route-guard.cjs --json` (7/7 fresh today), `verify-router-sync.cjs` (sk-code legs 1a-4), `parent-skill-check.cjs`, `check-rule-copies.js` and `package_skill.py --strict`. Without the baseline, a later "no regressions" claim cannot distinguish a pre-existing warning from a new one. Risk: none (read-only). Rollback: not applicable. [SOURCE: .skilled/bin/compiled-route-guard.cjs:168]

7. **Plan, phase 1 — arrest drift inside JSON and inside §2/§9, before any restructuring.** Merge the CI vocabulary to one source (`hub-router.json` `code-ci-aliases`) and delete the three redundant copies at `ROUTER.md:252`, `sk-code-ci/SKILL.md:62` and the packet's prose; then make `ROUTER.md` §2 and §9 agree in both directions (add TESTING and LANGUAGE_STANDARDS to §9, or delete the five language intents from §9 and keep the language axis in `sk-code-skilled`). Risk: low — no contract file changes; `3d-alias` and `5k` catch duplicates and class mismatches. Rollback: revert the two JSON/MD files per hub, no re-mint needed because hub `SKILL.md` is untouched. [SOURCE: .skilled/skills/sk-code/hub-router.json:76] [SOURCE: .skilled/skills/sk-code/ROUTER.md:241]

8. **Plan, phase 2 — shrink mode-packet §2 in ascending blast order, never touching pinned lines.** Order: `sk-code-quality` (349), `sk-code-ci` (111), `sk-code-skilled` (226), `sk-code-review` (730) last. Each keeps an 8-to-12-line §2 that contains `discover_markdown_resources`, `_guard_in_skill` and `UNKNOWN_FALLBACK` (the `package_skill.py:182-184` contract) and moves the Python block to a final `## MACHINE ROUTER` appendix, or deletes it where the hub names the leaves. Review's `EXTENSION_FLOORS` block (`check-rule-copies.js:169`) stays byte-identical. Risk: medium — leg 1b/3 read packet routers, so a deletion must land in the same change as the hub map that replaces it. Rollback: `git revert` per packet; no re-mint (packets are not hashed). [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:184] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:169]

9. **Plan, phase 3 — settle the sk-doc authority question with a generator, not a decision.** Either generate `hub-router.json` `vocabularyClasses` from the 14 packets' `Keyword triggers:` lines (adding a parser is the only way the declared source of truth becomes true), or declare `mode-registry.json` authoritative and delete the "source of truth" claim plus fix the 17 missing terms. The generator path is preferred because it makes `sk-doc/SKILL.md:53` true and removes 152 hand-maintained aliases. Risk: high — alias churn changes live routing; `3d-alias` and the router-reach allowlist are the safety net. Rollback: revert JSON and packet lines together; a partial revert leaves aliases duplicated and `3d-alias` fails loudly. [SOURCE: .skilled/skills/sk-doc/SKILL.md:53]

10. **Plan, phase 4 — hub `SKILL.md` last, because it is the only edit that needs a re-mint and a mirror sync.** Replace each hub's `route()` pseudocode with a five-line statement plus a pointer to `compiled-route.cjs`, keep the hub-level "must not move" rationale in one place and link the other three hubs to it. Every hub `SKILL.md` edit requires the `.opencode` mirror to carry the same bytes (`build-artifacts.cjs:44-58` reads `.opencode`) and then a re-mint with `compiled-route-sync.cjs`; the guard is the only signal that this happened. Risk: high — a missed re-mint silently drops the hub to legacy routing, and the mirror-sync step's owner is UNKNOWN in this lineage. Rollback: `compiled-route-sync.cjs --revert <rollback-root>` restores the serving set, then revert the doc. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:44] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1100]

11. **Plan, phase 5 — prose pass, then a deferred contract phase.** Apply the six clarity rules from the report plus "instructions before apparatus", re-run the baseline set plus `verify-doc-claims.cjs`, and defer any JSON-only ambition to a spec-level change that revises `RRC-001`/`RRC-009`, the reach glob and leg 2 together. Changing the contract is a different scope from changing the docs; conflating them is how a doc pass turns into an unguarded routing change. Risk: low for the prose pass, high for the contract phase, which should not start in the same packet. Rollback: prose is revert-only; the contract phase needs its own packet and its own rollback story. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md:20]

## Questions Answered

- Q1 — answered across iterations 1-3, recorded here: four hubs, five decisions, and the restatement count per decision. [SOURCE: .skilled/skills/sk-code/SKILL.md:54]
- Q2 — answered across iterations 1-3, recorded here: four drift classes (bidirectional §2/§9, packet-trigger versus JSON projection, paraphrased hub-level rule, three-name no-match outcome). [SOURCE: .skilled/skills/sk-doc/ROUTER.md:405]
- Q3 — answered in iteration 4, recorded here: nine enforcement surfaces. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:374]
- Q4 — this iteration, findings 1-3.
- Q5 — this iteration, finding 5.
- Q6 — this iteration, findings 6-11.

## Questions Remaining

None. The six questions are answered; what remains open is implementation, which is out of scope for read-only research.

## Next Focus

Synthesis: compile `research.md` from the five iterations and record the terminal synthesis event with `stopReason: maxIterationsReached`.

## SCOPE VIOLATIONS

None. Every write landed under `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/pi/`.
