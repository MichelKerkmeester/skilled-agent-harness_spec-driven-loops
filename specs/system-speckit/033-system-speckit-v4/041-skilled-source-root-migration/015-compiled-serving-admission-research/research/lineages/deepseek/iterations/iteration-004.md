---
title: "Iteration 4: What Each Admission Path Costs and Risks"
trigger_phrases: []
---

# Iteration 4: What Each Admission Path Costs and Risks

## Focus

Q4 — price restoring the retired legacy-parity path (Path A), building a new checker of
`compiledRoute()` decisions against routing gold (Path B), and keeping admission closed (Path C),
including the continuing risk Path C leaves behind.

## Refinement to Iteration 3

**F3.1 refined.** The foundation test discloses more cohort copies than the five surfaces listed in
Iteration 1-3. It holds four `DEFAULT_ON_HUBS` copies in lockstep —
the deployed runtime resolver, its authored source (`compiled-route-sync.cjs`'s
`AUTHORED_RESOLVER`), the advisor flag source, and the advisor compiled dist — and separately
cross-checks `COMPILED_ROUTING_HUBS` (advisor) against `HUB_CHILD` keys. The live copies are:

1. `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` (`HUB_CHILD`)
2. `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` (`DEFAULT_ON_HUBS`)
3. the authored resolver under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs`
4. `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` (`COMPILED_ROUTING_HUBS` + `DEFAULT_ON_HUBS`)
5. `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/compiled-routing-flag.js`
6. `.skilled/bin/compiled-route-guard.cjs` (`HUBS`)
7. `.skilled/bin/compiled-route-sync.cjs` (`HUBS`)
8. `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` (`hubs[]`)

Tests enforce lockstep within the resolver family and the advisor family, and equality between
`COMPILED_ROUTING_HUBS` and `HUB_CHILD`. Guard and sync lists plus the closure manifest have no
lockstep test of their own: they are exactly the surfaces an admission change can forget.

[SOURCE: `.skilled/bin/compiled-routing-foundation.vitest.ts:47-59,69-78,124-146`]
[SOURCE: `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:14-34`]

## Findings

### F4.1 — Path A cost: restore the four modules is bounded; restoring them *as they were* is not

| Item | Size / state |
|---|---|
| `compiled-routing-parity.cjs` | 845 lines, deleted at `b45ea54cea3`, recoverable from `b45ea54cea3^` |
| `score-skill-benchmark.cjs` | 1,889 lines |
| `router-replay.cjs` | 741 lines |
| `load-playbook-scenarios.cjs` | 766 lines |
| module test | `tests/compiled-routing-parity.vitest.ts`, deleted in the same commit |
| driver | the `/deep:skill-benchmark` YAML + presentation + command entry were removed too; the parity module itself has no CLI (it exports functions) |

Total module code to restore: **4,241 lines** plus test plus a driver. Verbatim restore is plausible
*today*: `.opencode/skills` and `.opencode/bin` are symlinks into `.skilled` (migration scaffolding),
`leaf-resource-contract.cjs` is live at the path the harness imports, and the
`@spec-kit/shared/frontmatter/parse-frontmatter.js` specifier resolves through
`.skilled/skills/system-deep-loop/node_modules/@spec-kit`. But the restore path then depends on
pre-migration symlinks for its correctness; once the migration removes them, the modules need path
edits, and an edit to any of the frozen trio (`router-replay`, `score-skill-benchmark`,
`load-playbook-scenarios`) forces re-pinning the SHA-256 digests the parity module enforces. A full
lane restore (five command entry points, typed ledgers, fixtures, ~43 docs) is strictly larger and
overlaps the spec's out-of-scope decision.

[SOURCE: `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{compiled-routing-parity,score-skill-benchmark,router-replay,load-playbook-scenarios}.cjs` — line counts]
[SOURCE: `git show b45ea54cea3 --stat` — command entry points, presentation, fixture corpus, typed ledgers]
[SOURCE: `.opencode/skills -> ../.skilled/skills`, `.opencode/bin -> ../.skilled/bin` (symlinks, migration scaffolding)]
[SOURCE: `compiled-routing-parity.cjs:93-110` — digest pins force re-pinning after any trio edit]

### F4.2 — Path A risk: the strongest comparison the repo ever had, against the strongest maintenance drag

**What it buys** (and nothing cheaper does): a two-observation verdict — compiled vs the Mode A
legacy replay, both scored against gold — with the frozen-scorer pin as an anti-tamper device, the
`match/drift/vacuous/n/a/resolver-missing` vocabulary, the run-level sub-verdict, and the
`lane-c-compiled-parity` blocking owner. That is the only machinery ever built here that can say
"compiled still equals legacy", which is the admission sentence in the architecture reference.

**What it risks**: the lane was retired deliberately (`BREAKING CHANGE: /deep:skill-benchmark is
removed on every runtime`), its script tree and ledgers removed from every surface, and the spec
declares reopening the lane as a whole out of scope. Restoring the four modules re-creates a
419-line-visible public surface that no command owns, whose docs were deleted, and whose frozen trio
must be kept byte-stable or re-pinned — the exact maintenance posture the retirement ended. It also
re-imports the retired loader's coupling to the frontmatter workspace package, which only resolves
when `@spec-kit/shared` is installed/built.

[SOURCE: `git show b45ea54cea3 --format=%B` — retirement rationale and BREAKING CHANGE]
[SOURCE: `spec.md:82` — "Reopening the decision to retire the skill-benchmark lane as a whole" is out of scope]
[SOURCE: `.github/workflows/routing-registry-drift.yml:132-140` — the install/build steps `@spec-kit/shared` requires]

### F4.3 — Path B cost: a small checker that reuses live seams and slots into an existing CI pattern

The retiring of Path A does not retire its *inputs*: the typed-gold corpus (74 scenarios), the
`qualifiedIdToLeaf` bridge, the per-hub leaf manifests and the front door are all live. A new checker
therefore needs roughly:

1. a scenario reader for playbook frontmatter gold (the retired loader's own parsing contract is
   described at `load-playbook-scenarios.cjs:535-616`; a fenced-YAML-block reader plus list parsing is
   the bulk of it);
2. the bridge call — `compiledRoute` (or `compiled-route.cjs --hub --prompt`) → `qualifiedIdToLeaf`
   with a per-hub `{ packet, leaves }` mode index;
3. scoring: exact mode set for concrete gold; no-route for `defer`/`UNKNOWN`; supression for
   `negative`; the fitted/holdout partition (the same split the frozen scorer used);
4. a JSON/markdown report and a non-zero exit.

That is a few hundred lines, not thousands, and no component is frozen. It can run as a standing gate
(admission-time for a new hub, release-time for the cohort) rather than only at admission. An
existing CI building block is already in the tree: `routing-golden-prompts.vitest.ts` shells to
`.skilled/bin/compiled-route.cjs` and asserts the compiled `workflowMode` for golden prompts — but it
covers only 2 of its 10 fixtures with `expectedMode`, asserts containment not exact sets, and skips
hubs outside `COMPILED_ROUTING_HUBS`.

[SOURCE: `.skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts:29-43,76-136`]
[SOURCE: `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` — 10 fixtures, 2 with `expectedMode`]
[SOURCE: `.github/workflows/routing-registry-drift.yml:227-231` — the golden-prompt suite runs in CI]

### F4.4 — Path B risks: it redefines the bar, and the checker owns the oracle

1. **One observation, not two.** A gold-only checker cannot see legacy; a shared legacy/gold
   divergence that Lane C scored as parity becomes a compiled-only failure, and a stale gold fails a
   legacy-equivalent engine (F2.7). If the operator wants "compiled equals legacy" as the admission
   sentence, Path B alone does not deliver it — the sentence must be restated as "compiled satisfies
   the authored routing contract", or a legacy side must be re-derived inside the checker (which
   re-imports router-replay; see A).
2. **The checker becomes the oracle.** Lane C delegated judgment to a frozen scorer precisely to
   avoid a second scoring implementation; a new checker re-encodes the defer/clarify/reject and
   holdout/negative rules (F2.3-F2.5). A tight, documented, tested implementation is required.
3. **Corpus floors become part of the contract.** sk-code contributes 1 typed-gold scenario; without
   a per-hub/per-mode coverage floor, "zero drift" on a one-scenario corpus is nearly vacuous
   (F2.1). A build phase must set floors (e.g. minimum scenarios per admitted mode and a minimum
   holdout count) and fail admission when they are not met.
4. **Admission machinery is unchanged.** Whichever check wins, the touch list (F4.0), the
   authority flip with no owning tool (F3.2) and the closure promotion (F3.4) still have to be built
   and tested; no path avoids them.

[SOURCE: `compiled-routing-parity.cjs:675-705` at `b45ea54cea3^`]
[SOURCE: `spec.md:61-64` — the admission sentence being restated]

### F4.5 — Path C cost: nothing to build, and a measurable ongoing blindness

What "closed" actually means today: the door is not bolted, it is unmaintained and undocumented as a
tooling gap — the architecture reference still says a new hub cannot reach `compiled-serving` until a
harness exists, and its topology section says seven hubs (F3.5). Keeping admission closed costs no
build and no risk to the five serving hubs' current behavior. The real cost is coverage:

- **No still-running compiled-vs-legacy measurement.** Since retirement, the standing gates are:
  foundation invariants, flag/cohort lockstep, status causeCodes, guard freshness, the golden-prompt
  joined-mode check (2 fixtures), and advisor routing-parity suites. None compares a compiled
  decision to a legacy decision. A compiler change that re-mints the manifest passes every gate —
  freshness proves *inputs → manifest* consistency, never parity. The canary fixtures do not close
  this: `build-artifacts.cjs` evaluates them only when run as a generator, and `loadHubEngine` calls
  only `loadSnapshot()`, which does not evaluate the cases.
- **Admission remains a manual, per-candidate sweep.** The sk-prompt post-retirement
  `playbook-verify` report (5/5, 0 drift) is the precedent: feasible, trusted, and unrepeatable.
  Each future candidate re-pays that cost in agent time and trust.
- **The cohort can shrink but not grow.** 7 → 6 (sk-design dissolution) → 5 (sk-prompt retirement)
  shows hubs leave the topology by table edits; there is no equivalent low-friction path in, and a
  dissolved/retired hub that returns would need exactly the admission chain that does not exist.

[SOURCE: `.github/workflows/routing-registry-drift.yml:132-168,227-231,234-275` — the actual standing gates]
[SOURCE: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:38-57,100-110` — `loadSnapshot` does not evaluate canary cases]
[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:79` — engine loads only `loadSnapshot()`]
[SOURCE: `.skilled/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` — the manual precedent]
[SOURCE: `git log --all --oneline -S "'sk-design'"` — 7→6; `git show 8da89c0594e --stat` — 6→5]

### F4.6 — The comparison, stated plainly

| | A: restore legacy parity | B: new gold checker | C: keep closed |
|---|---|---|---|
| Build size | 4,241 lines + test + driver (modules-only); full lane strictly larger | low hundreds of lines + test | zero |
| Independent legacy side | yes | no (unless router-replay is restored/re-derived) | no |
| Frozen artifacts / pins | yes, three files, re-pin on edit | none | none |
| Standing drift gate for the fleet | yes (its original purpose) | yes, if run beyond admission | no |
| Admission sentence preserved | yes, literally | redefined to gold agreement | n/a |
| Maintenance drag | high (retired-lane surface, deleted docs, workspace deps) | low, all seams live | none |
| Biggest risk | re-opening a deliberately retired lane; no owner | oracle ownership + semantic downgrade | permanent manual admission + unmeasured drift |
| Fits spec out-of-scope fence | modules-only is adjacent; full lane is out | yes | yes |

The three paths share one fixed cost — the admission machinery of F3.1/F3.2/F3.4 — so the decision is
purely about the check: buying back the legacy side (A), buying a proportionate new bar (B), or
paying per-candidate forever (C).

## Ruled-Out Directions

- **Restoring the full lane (commands, typed ledgers, fixtures, docs) to get the parity modules** —
  out of scope by the spec's own fence and far larger than the modules; the archived manual sweep
  already shows the modules can be driven without the lane. Ruled out.
- **Path B with no corpus-coverage floor** — a one-scenario hub (sk-code) could admit on a single
  assertion; floors are part of the checker's contract, not an optional extra. Ruled out.
- **Relying on canary fixtures as the standing drift gate under Path C** — they are evaluated only
  when the generator runs, not by the engine, the tests, or CI. Ruled out as a false assurance.

## Open Threads Carried Forward

- Iteration 5 selects one path, states its costs/risks in the form the spec asks for, and lays out
  the build steps a later phase would take.

## Quality Note

Costs are grounded in file line counts, deleted-file inventories from git objects, and live CI/test
contents. No writes outside the lineage.
