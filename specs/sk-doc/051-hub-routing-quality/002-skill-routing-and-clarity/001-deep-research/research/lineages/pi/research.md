# Skill Routing Shape and Doc Clarity — Deep Research Synthesis (lineage `pi`)

Lineage: `pi` · Session `fanout-pi-1793168730352-knacf5` · 5 iterations · `stopPolicy: max-iterations` · Convergence threshold 0.05 (telemetry only under this policy)

---

## 1. EXECUTIVE SUMMARY

The routing model is not complicated; it is written down too many times. Across the four hubs in scope — `sk-code`, `sk-doc`, `sk-design`, `system-deep-loop` — five routing decisions are made by at most three mechanisms, but each decision is restated in two to five documents, and the copies have drifted in four distinguishable ways. Every proposed simplification is already blocked by a specific check, and the blocks are uneven: the packet level is free to change, the hub level is not.

The starting hypothesis in `scratch/sk-code-advisor-report.md` survives testing with three factual corrections and one significant omission. Its shape verdict stands: JSON decides stage one, one hub `ROUTER.md` decides stage two, script resolvers handle the rest, and JSON-only is viable only as a hybrid. Its inventory numbers do not stand, and it never noticed that `sk-doc` already runs 9 of its 14 packets with no machine-readable router at all — the strongest existing evidence that per-mode router blocks are optional.

---

## 2. RESEARCH CHARTER

**In scope:** `.skilled/skills/{sk-code,sk-doc,sk-design,system-deep-loop}` — their hub `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, every mode packet, and the checks/generators that pin them.

**Out of scope (assigned to the sibling lineage by `steer.md`):** `cli-external-orchestration`, `mcp-tooling`, `cli-classifier`, the seven standalone skills, the command and agent docs, the Hermes and other runtime mirrors, and the advisor's `graph-metadata.json` routing inputs.

**Non-goals:** implementing any change. This run is read-only outside its lineage directory.

---

## 3. METHOD AND EVIDENCE STANDARD

Every finding cites a `path:line` that this run read. Claims about tool behaviour come from reading the tool's source or running it read-only; claims about counts come from parsing the files. Where a claim could not be verified it is marked UNKNOWN in §10.

**Iteration map**

| # | Focus | Findings |
|---|-------|----------|
| 1 | `sk-code` — the advisor report, line by line | 8 |
| 2 | `sk-doc` — the hub that centralizes stage two | 8 |
| 3 | `sk-design` and `system-deep-loop` | 8 |
| 4 | Enforcement: parsers, guards, compiler, packager, canon, reach | 9 |
| 5 | Verdict per skill type and phased plan | 11 |

---

## 4. SCOPE AND COVERAGE

| Hub | `SKILL.md` | `ROUTER.md` | `hub-router.json` | `mode-registry.json` | Modes | Packets |
|-----|-----------|-------------|-------------------|----------------------|-------|---------|
| sk-code | 207 | 394 | 83 | 130 | 4 | 4 |
| sk-doc | 187 | 407 | 477 | 605 | 15 | 14 |
| sk-design | 215 | 115 | 187 | 206 | 4 | 4 |
| system-deep-loop | 170 | 97 | 51 | 104 | 3 | 3 |

26 modes over 25 packets; 83 aliases in sk-code, 152 in sk-doc. Every hub root carries exactly one `ROUTER.md`; no packet anywhere carries one (`find .skilled/skills -mindepth 2 -name ROUTER.md` returns only hub files).

---

## 5. ROUTING INVENTORY — WHO DECIDES WHAT

| Decision | sk-code | sk-doc | sk-design | system-deep-loop |
|---|---|---|---|---|
| D1 which skill | advisor identity (`SKILL.md:54`) | same (`:53`) | same (`:40`) | same (`:12`) |
| D2 which mode | `mode-registry.json` named source (`:54`), `route()` (`:76-134`), `hub-router.json:24-39`, compiled router (`:56-60`) | packet `Keyword triggers:` named source (`:53`), `hub-router.json`, `mode-registry.json`, compiled router (`:55-58`) | `mode-registry.json` + `hub-router.json` (`:42`), mode table (`:54-60`), `route()` (`:89-133`) | `mode-registry.json` (`:12`), `hub-router.json` (51 lines), 12-line `route()` (`:73-76`) |
| D3 which surface | `stack-detection.md` + `--surface-hint` (`:62`), registry `surfaceDetection` (`:138`) | none — no surface axis (`:68`) | none — no surface axis (`:80`) | `runtimeLoopType` (`:59-60`) |
| D4 which leaves | hub `ROUTER.md` §9 **and** every packet's block | hub `ROUTER.md` §3 only (9 of 14 packets have no block) | hub `ROUTER.md` §3 (2 of 4 packets have blocks) | hub `ROUTER.md` §3 (packets carry blocks too) |
| D5 which checklists | `--explain` + registry `quality.checklists` | not applicable | not applicable | not applicable |

The two architectures are visible in the last two rows: sk-code duplicates D4 in the hub and in every packet; sk-doc centralizes it. Both pass today.

---

## 6. RESTATEMENTS AND DRIFT — FOUR CLASSES

**Class 1 — prose table versus machine block, inside one file.** `sk-code/ROUTER.md` §2 lists `TESTING` (`:57`) and `LANGUAGE_STANDARDS` (`:60`) which have no §9 key; §9 carries `JAVASCRIPT`, `TYPESCRIPT`, `PYTHON`, `SHELL`, `RUST` (`:241-252`) which have no §2 row. The file calls its §9 block "the byte-for-byte source a deterministic router parses" (`:223`), so the drift is against its own stated contract, in both directions.

**Class 2 — packet line versus JSON projection, across a hub.** `sk-doc/SKILL.md:53` makes each packet's `Keyword triggers:` line the source of truth and `hub-router.json` "synchronized projections". Comparing all 173 backticked terms across 14 packets to the union of `hub-router.json` `vocabularyClasses` finds 17 absent; `sk-create-diff` is missing 5 of its 7 (`SKILL.md:30`), and every `/create:*` and `/doc:quality` slash form is absent. No code reads `Keyword triggers:` at all — the declared source of truth has no parser.

**Class 3 — one rule copied into four hubs, paraphrased once.** "The machine block must not move into `SKILL.md` … or into `hub-router.json`" appears verbatim at `sk-doc/SKILL.md:65`, `system-deep-loop/SKILL.md:50` and `cli-external-orchestration/SKILL.md:78`; `sk-design/SKILL.md:74` drops the reason ("schema handoff-ambiguity rule") and substitutes "which is a different schema".

**Class 4 — the no-match outcome has three names.** `defer` (`system-deep-loop/SKILL.md:48`, `hub-router.json:11`), `UNKNOWN_FALLBACK` (`sk-code/SKILL.md:110`, `sk-doc/ROUTER.md:405`), "UNKNOWN fallback" (`sk-design/SKILL.md:71`). No shared enum; a consumer joining hub decisions cannot key on one value.

**Authority conflict, separately.** Three documents claim routing authority in sk-code alone: `mode-registry.json` (`SKILL.md:54`), `SMART ROUTING` §2 (`sk-code-review/SKILL.md:612`), and `ROUTER.md` §9 (`:223`). Only the last is measurably true, because `parseRouter` reads the §9 block and nothing reads the other two.

---

## 7. ENFORCEMENT MAP — WHAT PINS THE SHAPE, AND WHAT EACH CHANGE BREAKS

| Mechanism | Pins | A change that breaks it |
|---|---|---|
| `router-replay-lib.cjs` `parseRouter` (`:397`), `findReferencedRouterDoc` (`:374`, `:384`) | stage-two block must be in `SKILL.md` or `references/*.md` | a packet-root `ROUTER.md` is invisible |
| `verify-router-sync.cjs` legs 1a-4 (`:324-329`), `readSkillRouter` (`:47`) | sk-code only; leg 2 fails on empty `SHARED_CONTROL_RESOURCES` (`:198-200`) | deleting a surface block, or a legitimate stage1-only hub |
| `root-router-contract.cjs` `RRC-001..RRC-009` (`:127-135`) via check 12a (`parent-skill-check.cjs:1787`) | every hub has a conforming root `ROUTER.md` | hub-level JSON-only (`RRC-001`, `RRC-009`); non-empty stage1-only maps (`RRC-005`) |
| `build-artifacts.cjs` (`:44-58`) + `compiled-route-guard.cjs` (`:168`) | hub `SKILL.md` + `hub-router.json` + `mode-registry.json` bytes, read from the `.opencode` mirror | editing `.skilled` without the mirror and a re-mint silently drops the hub to legacy |
| `package_skill.py` (`:69`, `:182-184`, `:769`) | an H2 `SMART ROUTING` with `discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK` | shrinking §2 without those three markers |
| `check-rule-copies.js` (`:18`, `:169-170`) | the review `EXTENSION_FLOORS` lines, byte-identical | any prose pass that reflows those lines |
| `doctor-router-reach.yaml` (`:64-65`) | stage-two vocabulary read from `.skilled/skills/*/ROUTER.md` | deleting a hub `ROUTER.md` removes its reach input |
| `parent-skill-check.cjs` 3d-alias (`:625-633`), 3j (`:961`) | alias uniqueness; hub `allowed-tools` equals the union of mode grants | duplicate aliases on a merged vocabulary; a narrowed hub tool grant |

The asymmetry is the actionable part: **packets are outside every hash and outside the reach glob, hubs are inside both.** A packet-level restructuring is revert-only; a hub-level restructuring carries a build step whose failure mode is silent.

---

## 8. READABILITY FINDINGS

1. **Routing precedes instructions, and it is long.** `sk-code-review/SKILL.md` is 730 lines: SMART ROUTING opens at line 49, the first executable step tree at 67, and the resolver pseudocode runs past 392. Roughly half the file is routing apparatus before a reviewer reads the first check.
2. **Hub definitions are run-ons.** `sk-doc/SKILL.md:53` is a 107-word paragraph that defines routing, both stages, the advisor handoff and the separation rule in one sentence chain. Quoted in full in iteration 2.
3. **Build invariants are hidden inside routing sections.** `system-deep-loop/SKILL.md:54-58` explains in 96 words that a hub's `allowed-tools` must equal its modes' union or `parent-skill-check.cjs` check 3j fails — a build constraint placed between the routing model and the discriminator.
4. **Register drifts inside one skill.** `sk-code-quality/SKILL.md:15` addresses the reader as "the acting agent applying `workflow-implement.md`"; its own README reads better. The report's rewrite (iteration 1, finding 8 context) is a fair target.
5. **Terms arrive before definitions.** "MODE child", "two axes", "surface bundle", "typed pair" are all used in the first paragraph of their files and defined later, if at all.
6. **Trigger lines are ungrouped dumps.** `sk-create-frontmatter/SKILL.md:36` carries 28 backticked terms mixing field names, error symptoms and version formats.

---

## 9. VERDICT BY SKILL TYPE

**Hubs (7 today, 4 in scope): one hub `ROUTER.md`, JSON for stage one, script resolvers for checklists — the advisor hybrid.**

- Per-mode `ROUTER.md`: rejected. `parseRouter`'s pointer regex accepts only `references/*.md` (`:374`); the canon states the router is "first-class at the hub root as `ROUTER.md`, never at a nested path" (`parent-skill-root-router-template.md:20`); the reach diagnostic globs `.skilled/skills/*/ROUTER.md` only (`:65`).
- JSON-only at hub level: rejected today. `RRC-001` (missing root router) and `RRC-009` (missing prose section) are frozen codes; the reach diagnostic loses its stage-two input; leg 2 already fails on an empty `SHARED_CONTROL_RESOURCES`.
- The hybrid: no check rejects it, and every hub already implements it. The remaining work is removing restatements, not changing shape.

**Mode packets (25): no router file; shrink §2, then either relocate the machine block inside the same `SKILL.md` or delete it where the hub names the leaves.**

- Moving within the file is free: `parseRouter` reads the whole text (`:397`) and packets are outside the compiler hash.
- Deleting is better where redundant: sk-doc runs 9 of 14 packets with no block and passes, because `ROUTER.md` §3 names their leaves.
- §2 must keep the three marker words in an H2 named `SMART ROUTING` (`package_skill.py:69`, `:182-184`).

**Standalone skills: keep the inline §2 with markers; no router files; JSON-only does not apply.** No standalone skill carries `ROUTER.md`, `hub-router.json` or `mode-registry.json`; there is no registry for a JSON-only shape to live in, and the packager still requires the section and the markers. The sibling lineage owns the per-skill detail.

---

## 10. LIMITATIONS AND CORRECTIONS TO THE STARTING HYPOTHESIS

**Corrections to `scratch/sk-code-advisor-report.md`:**

| Report claim | Status | Evidence |
|---|---|---|
| "`mode-registry.json`, about 59 aliases" | wrong — 83 (13+10+5+55) | `sk-code/mode-registry.json` |
| "`system-deep-loop` reports a stale compiled manifest today" | does not reproduce — 7/7 fresh | `compiled-route-guard.cjs --json` |
| "ROUTER.md §2 has intents §9 lacks" | right, but bidirectional | `ROUTER.md:57`, `:60` vs `:241-252` |
| "`leaf-manifest.json` … decides nothing" | confirmed — no router consumer | `leaf-manifest.json` consumers are tests and the compiler |
| "moving the machine block may not be free" | free at packet level; blocked at hub level | `parseRouter:397`, `sk-doc/SKILL.md:65` |
| "no per-mode ROUTER.md anywhere" | confirmed, and triple-blocked | parser, canon, reach |

**Omission:** sk-doc's 9 router-less packets. The report generalized from sk-code, where all four packets carry blocks.

**UNKNOWN, explicitly:**

- Which process writes the `.opencode/skills` mirror. The two trees are byte-identical today for all four hubs but are separate real directories, and no generator was found under `.skilled` or `.pi`.
- Whether any consumer reads the `Keyword triggers:` lines outside the model. No code hit was found; absence of a hit is not proof of absence.
- The runtime behaviour of the compiled router under a partial re-mint (mirror updated, activation manifest not). The guard reports drift; what the front door serves in that window was not exercised.

---

## 11. RECOMMENDATIONS

**Phase 0 — baseline (no writes).** Capture `compiled-route-guard.cjs --json`, `verify-router-sync.cjs`, `parent-skill-check.cjs`, `check-rule-copies.js`, `package_skill.py --strict`. Without it, "no regressions" is unmeasurable.

**Phase 1 — arrest drift, no restructuring.** Merge the CI vocabulary to `hub-router.json` `code-ci-aliases`; make `sk-code/ROUTER.md` §2 and §9 agree in both directions. Risk: low. Rollback: revert the per-hub files; no re-mint.

**Phase 2 — shrink mode-packet §2 in ascending blast order** (`sk-code-quality` 349 → `sk-code-ci` 111 → `sk-code-skilled` 226 → `sk-code-review` 730 last), keeping the three markers inside §2, moving the Python block to a final appendix or deleting it where the hub names the leaves, and leaving the `EXTENSION_FLOORS` lines byte-identical. Risk: medium (leg 1b/3 read packet routers). Rollback: revert per packet; no re-mint.

**Phase 3 — settle sk-doc's authority with a generator.** Generate `hub-router.json` `vocabularyClasses` from the 14 packets' `Keyword triggers:` lines, which is the only way `sk-doc/SKILL.md:53` becomes true; alternatively declare `mode-registry.json` authoritative, delete the claim and fix the 17 terms. Risk: high (alias churn changes live routing). Rollback: revert JSON and packet lines together; `3d-alias` fails loudly on a partial revert.

**Phase 4 — hub `SKILL.md` last.** Replace each hub's `route()` pseudocode with a five-line statement and a pointer to `compiled-route.cjs`; keep the "must not move" rationale in one place and link the copies to it. Every hub edit requires applying the same bytes to the `.opencode` mirror and re-minting; `compiled-route-guard.cjs` is the only signal that this happened. Risk: high. Rollback: `compiled-route-sync.cjs --revert <rollback-root>`, then revert the doc.

**Phase 5 — prose pass, then a separate contract packet.** Apply the clarity rules, re-run the baseline plus `verify-doc-claims.cjs`. Any JSON-only ambition is a spec-level change that must revise `RRC-001`, `RRC-009`, the reach glob and leg 2 together — not a doc edit.

### Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| One `ROUTER.md` per mode packet | Invisible to the replay parser; forbidden by the authoring canon; outside the reach glob | `router-replay-lib.cjs:374`, `parent-skill-root-router-template.md:20`, `doctor-router-reach.yaml:65` | 4, 5 |
| JSON-only for hubs (delete `ROUTER.md`) | Fails frozen contract codes and empties the reach diagnostic | `root-router-contract.cjs:127-135`, `doctor-router-reach.yaml:65` | 4, 5 |
| Make `Keyword triggers:` the enforced source of truth without a parser | Nothing reads it; the claim is unenforceable today | zero code hits; `sk-doc/SKILL.md:53` | 2, 5 |
| Treat `leaf-manifest.json` as a routing decider | It is generated and checked; no router consumer | `leaf-manifest.json` consumer scan | 1 |
| Cite the report's stale-manifest note as current | Does not reproduce | `compiled-route-guard.cjs --json` | 3 |
| Global JSON template for every hub | Per-mode line cost varies 32-52 with alias and `toolSurface` size | registry line counts per hub | 3 |
| Narrow the hub `allowed-tools` grant to routing-only needs | Fails check 3j by design | `parent-skill-check.cjs:961` | 3 |

### Divergence Map

No divergent pivots ran (`antiConvergence.convergenceMode: default`, `stopPolicy: max-iterations`). Saturated directions: none recorded. Remaining frontier after this lineage: the `.opencode` mirror generator's owner, the behaviour of the compiled front door during a partial re-mint, and the sibling lineage's coverage of standalone skills, commands, agents and the Hermes mirror.

---

## 12. OPEN QUESTIONS

1. Which process owns the `.opencode/skills` mirror, and does it run before or after a re-mint?
2. Does any external consumer read the `Keyword triggers:` lines, or are they purely model-facing?
3. What does `compiled-route.cjs` serve between a mirror update and an activation re-mint — the old targets, a legacy sentinel, or an error?
4. How do the sibling lineage's findings for standalone skills change the phase-2 ordering when a standalone skill shares vocabulary with a hub packet?

---

## 13. REFERENCES AND PROVENANCE

Primary sources read in this run (repo-relative):

- `.skilled/skills/sk-code/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json,leaf-manifest.json}` and its four packets.
- `.skilled/skills/sk-doc/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json,leaf-aliases.json}` and its 14 packets.
- `.skilled/skills/sk-design/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json}` and its 4 packets.
- `.skilled/skills/system-deep-loop/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json}` and its 3 packets.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/{router-replay-lib.cjs,verify-router-sync.cjs}`.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/commands/doctor/assets/doctor-router-reach.yaml`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`, `.skilled/skills/sk-doc/scripts/package_skill.py`.
- `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md`.
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`.
- `.skilled/bin/{compiled-route-guard.cjs,compiled-route-sync.cjs}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs`.
- `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md` (starting hypothesis), and this lineage's `steer.md`.

Per-iteration evidence with line anchors: `iterations/iteration-001.md` through `iteration-005.md`; structured findings in `deltas/iter-001.jsonl` through `iter-005.jsonl`.

---

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 6 / 6
- Remaining questions: 0 in scope; 4 handed forward in §12
- Last 3 iteration summaries: run 3: sk-design and system-deep-loop (0.50); run 4: enforcement layer (0.66); run 5: verdict and plan (0.48)
- Convergence threshold: 0.05 (telemetry only; `stopPolicy: max-iterations`)
- Divergence summary: no divergent pivots recorded
