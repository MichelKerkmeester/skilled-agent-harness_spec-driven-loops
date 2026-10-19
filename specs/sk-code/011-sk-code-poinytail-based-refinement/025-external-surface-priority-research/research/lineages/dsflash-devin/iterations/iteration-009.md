# Iteration 9: Q6 + synthesis — ideas to reject, ranked recommendations, implementation phases

## Focus
Q6 as dispatched — "Which ideas should be rejected, and why?" — with the final synthesis: a ranked recommendation set R1–R5 and proposed implementation phases, each tied to path:line evidence and a `prevent-overengineering` climbing sentence. Folds in the last Q1 slice: does `ROUTER.md` 265–618 encode the surface order or treat the examples as installed?

## Actions Taken
1. Read state: `deep-research-config.json` (sessionId `dr-025-dsflash-devin-2026-10-12T16:28:06.444Z`, progressiveSynthesis true), `deep-research-strategy.md` (Q1/Q6 exact text at :49 and :54; exhausted approaches), `findings-registry.json` (Q2–Q5 resolved; Q1/Q6 open), `deep-research-dashboard.md`, and `iterations/iteration-006.md`, `iteration-007.md`, `iteration-008.md` (so no prior row is repeated).
2. Re-verified every anchor the recommendations cite, in one sweep: `hub-router.json` full read (tieBreak :7 ranks `sk-code-skilled` ahead of both examples; routerSignals webflow :31, opencode :36, obsidian :42), `mode-registry.json` slices (`surfaces` declaration :19; webflow :61-77, opencode :79-95, obsidian :98-114), `SKILL.md:40` (the canonical "exactly three surfaces" sentence every other doc defers to), `compiled-route.cjs` hint sites (:82, :84, :99, :103, :106-107), and `prevent-overengineering.md` (:45-46 the rule; :55-56 the reversal-cost mandate; :79-84 the sentence form; :117-119 the two-real-callers bar).
3. Closed the Q1 remainder: `rg -n 'tieBreak|One Surface Order|then Obsidian|opencode, then' ROUTER.md` → 0 matches (exit 0); `rg -n 'obsidian|webflow' ROUTER.md | awk -F: '$1>=265'` → hits only at :290 (anti-pattern bullet), :346 (`OBSIDIAN_PLUGIN` scoring class), :354-523 and :555-558 (per-class resource lists), :607 (Motion.dev overlay note). No order encoding exists in 265–618.
4. Wrote this narrative, the delta file, and the gateway record; ran the iteration verification script.

## Findings
Format: `| class | claim | evidence | priority |`. New citations were opened this iteration; carried rows name their lineage source.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| OK | **Q1 close-out — the order is encoded in exactly one authored place, `hub-router.json:7` tieBreak, and `ROUTER.md` 265–618 encodes no order at all.** tieBreak (re-read): `["sk-code-quality","sk-code-review","sk-code-skilled","sk-code-obsidian","sk-code-webflow"]` — opencode ahead of both examples; the surface set is declared, not ranked, at `mode-registry.json:19` and `SKILL.md:40`; the compiler copies tieBreak verbatim (carried, iteration 6); the runtime reorders only via the matched-only hint (`compiled-route.cjs:99-108`, re-verified). In `ROUTER.md` 265–618 the surfaces appear only as a scoring class (`:346 OBSIDIAN_PLUGIN`) and per-class resource lists (:354-523, :555-558, :607) — an `rg` for `tieBreak|One Surface Order|then Obsidian|opencode, then` over the whole file returns 0 matches. | [SOURCE: .skilled/skills/sk-code/hub-router.json:7] [SOURCE: .skilled/skills/sk-code/ROUTER.md:346] [SOURCE: .skilled/skills/sk-code/mode-registry.json:19] [SOURCE: .skilled/skills/sk-code/SKILL.md:40] [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99]; rg runs this iteration (exit 0) | P1 |
| ORDER | **A user surface appended to the shipped `tieBreak` is valid yet loses every tie; position decides and nothing enforces position.** opencode sits at index 2 of 5 (re-verified :7); sibling validators compare mode sets, not order (carried). | [SOURCE: .skilled/skills/sk-code/hub-router.json:7]; carried: iteration-006.md:22 | P1 |
| PRESENCE | **The shipped data still treats both examples as installed for routing.** routerSignals entries are all weight 4 — webflow `:31`, opencode `:36`, obsidian `:42`; registry surface entries `:61-77`/`:79-95`/`:98-114`; `SKILL.md:40` "exactly three surfaces"; `ROUTER.md:346`/`:555-558` resource classes; plus the carried README/note/doctor lines. | [SOURCE: .skilled/skills/sk-code/hub-router.json:31] [SOURCE: .skilled/skills/sk-code/hub-router.json:42] [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] [SOURCE: .skilled/skills/sk-code/mode-registry.json:98] [SOURCE: .skilled/skills/sk-code/SKILL.md:40] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-008.md:21] | P1 |
| BREAK (carried) | **The baseline every fix must answer.** Deletion (copy-observed): `parent-skill-check.cjs` exit 1, 113 invariant failures (3c×2, 5d, 10a `MODE_LEAF_SET_COLLISION`, 12a×109), fleet gate `ci-skill-root-metadata.cjs` exit 1 with `RRC-006`; guard still `fresh`; front door still serves the deleted packets. Addition: five new FAILs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary; 113 → 118). A hand edit without a working re-mint leaves the guard stale and the front door on the legacy stub. | [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-004.md:25] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-004.md:27] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-005.md:24] | P1 |

### Rejected ideas (Q6)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| 1. New operator-vs-external config file (or engine layer) | a new file the mint/doctor would have to read to rank surfaces; no such layer exists — the engine's decisions vocabulary (`adopt-release`, `keep-local`, `merge`, `use-proposal`) applies uniformly per checkout (carried iteration-007.md:23) | new schema + engine wiring + mint integration | ranks nothing until the compiler reads it; duplicates the decisions machinery; consumers who never run align still keep the operator's order | Cheaper: rank data + derived tieBreak (R1) — it covers the requirement; the split the file promises is already data (Q4), so the file is rejected |
| 2. Plugin system for surfaces | a new loader/API for third-party surface packets; surfaces are already registry+packet data (`mode-registry.json:19`, `:61`/`:79`/`:98`) that the mint reads | new contract + tests for zero new capability | none of the five observed add-surface FAILs (carried iteration-005.md:24) are fixed by an API | Cheaper: scaffold via `/create:skill-parent --surfaces` (documented; carried iteration-008.md:24) — it works; a plugin API is a second path to the same registry entry, so rejected |
| 3. Hard-code the operator order behind a flag (`native`/`fallback` boolean on opencode) | one boolean at `mode-registry.json:79` + a compiler rule that flagged surfaces sort last (carried iteration-006.md:32) | smaller schema than a rank field | one flag cannot give two repositories different orders — it forces the operator's repo to the same order (`hub-router.json:7`) | Cheaper: rank field per surface (R1) — it covers the requirement; the boolean fails precisely because the operator/external split is data, so rejected |
| 4. Remove obsidian and webflow from the operator repo | deletes the packets and their data (`mode-registry.json:61-77`, `:98-114`; `hub-router.json:31-34`, `:42-46`; tieBreak `:7`) | coordinated deletion + re-mint + fixture regeneration | the operator's tree is the release source (carried iteration-007.md:28): removing them here removes the examples from the shipped release; parity breakage until artifacts regenerate | Cheaper: demote them in the shipped routing data while keeping the packets as deletable examples (R2) — it covers the requirement; removal is rejected because the operator wants the surfaces and external users get the signal from docs (R3) |
| 5. Docs-only insertion convention ("insert your surface before `sk-code-skilled` in tieBreak + routerSignals") | hand-edited lists — `hub-router.json:7` + routerSignals key order (:31-46) | zero code | two lists must agree and already drifted in a sibling hub; insertion position is unenforced; a hand edit serves the legacy stub until a working re-mint (carried iteration-006.md:37) | Cheaper: R1 rank field — it covers the requirement; the convention is rejected because nothing enforces it |
| 6. `--surface-hint` as the shipped default tie fix | runtime reorder only — `compiled-route.cjs:99-108` (re-verified :99, :103, :106-107) | zero | opt-in per call; matched-only (an unmatched surface can never lead); cannot be the default | Cheaper: none exists below zero — it fails as a default and works as the complement (R4), so rejected as the fix |
| 7. Derive the order from the installed packet set at mint | new derivation in sk-code's compiler (carried `registry-compiler.cjs:261`/`:265`/`:338`) | new code in a seven-hub compiler family | compiled artifacts become environment-dependent; no installed-set input exists — the update engine computes file status, not order (carried iteration-007.md:25) | Cheaper: authored rank field (R1) — it covers the requirement; derivation is rejected because identical inputs would mint different manifests |
| 8. Checker-only downgrade of absent example surfaces (blanket WARN / new "example" check) | `parent-skill-check.cjs` legs / a new doctor check | new checker + tests | no example marker exists in the engine (carried iteration-007.md:26); a blanket WARN silences 3c | Cheaper: fix the data (R2) + docs (R3) — it covers the requirement; rejected because it polices a state R2 removes |
| 9. `examples` schema list + WARN on absent example dirs | registry schema + `parent-skill-check.cjs` + `ci-skill-root-metadata.cjs` + tests (carried iteration-008.md:35) | schema growth, still mint-gated | same outcome as R2 for every user who ships without the examples | Cheaper: R3 now + R2 at the next cut — it covers the requirement; rejected because only the operator wants the examples shipped (two-real-callers bar, `prevent-overengineering.md:117`) |

### Ranked recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| **R1 (recommended): rank field per surface in `mode-registry.json` + derive the compiled tieBreak at mint** | add an optional rank to the surface entries (`mode-registry.json:61`, `:79`, `:98`); replace the verbatim tieBreak copies at `registry-compiler.cjs:261`, `:265`, `:338` with a derivation (precedent: sk-doc `:357`, carried) | one data field + one derivation in sk-code's compiler; guard re-mint; canary + hint-test regeneration (carried) | mint dependency — an authored change is hash-stale until a working re-mint (carried P1); the unranked-surface default must be defined once | Cheaper: docs-only insertion convention — fails: two drifting lists, unenforced position, stale stub (rejected #5) |
| **R2: ship-without-examples default** | drop obsidian/webflow from the shipped routing data (`mode-registry.json:61-77`, `:98-114`; `hub-router.json:7`, `:31-34`, `:42-46`), keep the packets as deletable examples; pair with R1 so a user surface has a defined slot | coordinated data edit + re-mint + fixture regeneration | parity breakage until every artifact regenerates (carried) | Cheaper: the data edit alone — fails: deleting the examples cannot express where a future user surface sorts (carried iteration-006.md:35) |
| **R3: example markers in docs** | `SKILL.md:40` one sentence; `README.md:800`, `:1384`, `:1447-1448`; `v4.0.0.4.md:297`; `create-skill-parent-presentation.txt:86`; three rows in `parent-skills-nested-packets.md:220-229` (carried iteration-008.md:33) | 5–6 prose edits; zero regeneration | routing and doctor unchanged — deletion still hard-fails until R2 | Cheaper: README-only wording — fails: `SKILL.md:40` is the pointer target every doc defers to (carried iteration-008.md:53) |
| **R4: keep `--surface-hint` as the zero-code complement** | runtime reorder `compiled-route.cjs:99-108` (re-verified) | zero | opt-in, matched-only — cannot be the default | Cheaper: none exists below zero; it fails as a default (carried test :79-83), which is why it stays a complement |
| **R5: update-engine and scaffold doc follow-ups once R1/R2 land** | `update.md:78-83` external-user path; the 5k trio rows in `parent-skills-nested-packets.md:220-229`; the add-path FAILs (carried iteration-005.md:24) | doc edits (+ check fixes if the add-path FAILs stay) | sequenced after R1/R2 — the state it documents | Cheaper: nothing now — fails because the docs would describe a data shape that does not exist yet |

### Implementation phases
- **Phase 0 (prerequisite, unobserved)** — full-tree re-mint verification. The copy recipe excludes `specs/`, so the authored closure cannot resolve; every authored-data move (R1, R2) is gated on it. Settle before Phase 2.
- **Phase 1 (independent, immediate)** — R3 doc markers; R4 requires no work.
- **Phase 2** — R1 rank field + derivation + canary/hint fixture regeneration (`canary-cases.v1.json:117-140`, carried).
- **Phase 3** — R2 shipped-default data edit + the operator-side process (the operator keeps its order by its own ranks; external repos ship opencode ranked last — carried iteration-007.md:37) + R5 docs.

### Climbing sentence (whole set)
Per `prevent-overengineering.md:45-46` and `:55-56`, in the form of the file's own example (`:79-84`): *the docs-only move (R3) fails, because the shipped data still references the examples and a user who deletes them still hits the carried hard failures; the checker-only move fails, because no example marker exists in the engine and a blanket WARN would blind 3c; the data edit alone fails, because it cannot express where a future user surface sorts. So: one rank field per surface in `mode-registry.json` (the data the compiler already reads) with the compiled tieBreak derived from it (R1), the shipped-default value change it enables (R2), and the doc markers (R3) — nothing new in the engine.*

## Questions Answered
- **Q6** — nine rejected ideas with reasons (table above), each with its covering cheaper move.
- **Q1** — closed: the order is encoded only in authored hub data (`hub-router.json:7` tieBreak; set declared at `mode-registry.json:19` / `SKILL.md:40`; `stack-detection.md:39` precedence carried), `ROUTER.md` 265–618 encodes none, and the examples are treated as installed at routerSignals (`:31`/`:42`), the registry entries (`:61-77`, `:98-114`), `SKILL.md:40`, `ROUTER.md:346`/`:555-558`, the README and v4.0.0.4 note (carried), and the canary fixtures (carried).

## Questions Remaining
- None — 6/6 answered (Q2–Q5 in iterations 5–8; Q1 and Q6 this iteration). The full-tree re-mint verification remains an unobserved deployment prerequisite (Phase 0), not an open key question.

## Next Focus
None — final scheduled iteration; recommend convergence. The reducer should carry Phase 0 as the follow-up verification when implementation starts.

## Ruled Out
- Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema).

## Dead Ends
- None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried).

## Edge Cases
- Ambiguous input: none material; "ideas to reject" was read as the concrete examples given plus every larger move previously ruled out.
- Contradictory evidence: none new; the prior "ROUTER.md:265-618 still open" resolves to a negative — no order encoding exists there (recorded).
- Missing dependencies: the full-tree re-mint branch remains unobserved (copy recipe excludes `specs/`); named as Phase 0.
- Partial success: none; every cited line was opened this iteration or is a lineage file read this iteration (marked carried).

## Sources Consulted
- Lineage files read this iteration: `deep-research-config.json`, `deep-research-strategy.md` (:49, :54), `findings-registry.json`, `deep-research-dashboard.md`, `iterations/iteration-006.md` (:22, :32, :33, :35, :37), `iteration-007.md` (:23, :25, :26, :28, :37), `iteration-008.md` (:21, :24, :33, :35, :53), `iteration-004.md` (:25, :27), `iteration-005.md` (:24)
- Repo anchors re-verified: `.skilled/skills/sk-code/hub-router.json` (:7, :31-46), `.skilled/skills/sk-code/mode-registry.json` (:19, :61-77, :79-95, :98-114), `.skilled/skills/sk-code/SKILL.md` (:34-40), `.skilled/skills/sk-code/ROUTER.md` (:290, :346, :354-523, :555-558, :607), `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` (:82, :84, :99, :103, :106-107), `.skilled/repo-rules/prevent-overengineering.md` (:45-46, :55-56, :79-84, :117-119)
- Commands: `rg` order-phrase scan over ROUTER.md (0 matches, exit 0); `rg`+`awk` surface-hit scan (hits listed above); `cat -n`/`sed -n` numbered scans (exit 0)

## Assessment
- New information ratio: 0.68 — 1 of 6 findings fully new (the `ROUTER.md` 265–618 negative that closes Q1), 5 partially new (rejection list, ranked recommendations, inventory consolidation, order/validation, presence), +0.10 simplicity bonus for closing Q1+Q6 and reducing open questions to zero.
- Questions addressed: Q1, Q6
- Questions answered: Q1, Q6

## Reflection
- What worked and why: one batched exec re-verified every anchor the recommendations cite, so the synthesis rests on lines opened this iteration; the two `rg` checks converted the carried "ROUTER §8–§11 open" into a decisive negative.
- What did not work and why: the combined `cat` of iterations 6–7 overflowed mid-file, costing a second read; the `prevent-overengineering` §2 text needed the overflow again — reading each prior iteration with the line-numbered read tool would have avoided both.
- What I would do differently: read each prior iteration with the read tool rather than `cat`, and grep overflow buffers by anchor phrase.

## Recommended Next Focus
None — convergence candidate. Phase 0 (full-tree re-mint verification) is the first implementation-time check.
