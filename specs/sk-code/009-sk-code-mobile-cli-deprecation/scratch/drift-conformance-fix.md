# Compiled-route admission conformance: the four drifts, fixed

Follow-up to `devin-swe2-drift-advice.md` (the SWE-2-max review) and `devin-swe2-drift-verification.md`
(the citation checks). Operator instruction: "fix all drift", with SD-H02 reclassified as a fail-safe
negative and the record kept in this packet.

## What was wrong, and what changed

| Case | Fix | Mechanism |
|---|---|---|
| **AI-003** `unsafe-route` | `.skilled/skills/system-deep-loop/hub-router.json`: `model-benchmark-aliases` keywords narrowed to `["/deep:model-benchmark"]` | The class carried `"model benchmark"` and `"benchmark a model"`, contradicting the same hub's `ROUTER.md:76` (`["/deep:model-benchmark"]` only), the registry's `routingClass: command-bridge` (`mode-registry.json:150`), and IL-002's own FAIL criterion ("the lane fires from a bare advisor alias"). Removal flips AI-003 to `defer` while the command prompt still routes — verified in memory and through the served closure. |
| **MO-004** `silent-defer` | `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs`: new `hintedMode()` + a waterfall branch | A leading `<mode>:` token now resolves before keyword scoring, but only on an exact single-mode match — an unrecognised prefix falls through to scoring, so the hint adds no new no-match path. The documented override lives at `system-deep-loop/SKILL.md:73` and `:89`; the compiled layer never read it. |
| **SD-015** `silent-defer` | `.skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md`: `stage: routing` → `stage: negative`, plus title/description/overview/contract/pass-fail rewritten to the fail-safe assertion | The 14-mode fan-out is unreachable by contract (`discoveryClassesContract`, `maximumIntents` = largest declared bundle), so the scenario now asserts the correct outcome: a bare full-toolkit request must not fan out. Typed gold (125 leaf pairs) retained as the ceiling reference. |
| **SD-H02** `silent-defer` | `.skilled/skills/sk-doc/manual-testing-playbook/holdout/doc-quality-natural.md`: `stage: holdout` → `stage: negative`, with a reclassification note and contract text updated | The defer is the designed result for phrasing that shares no vocabulary with any mode. The typed gold still names `sk-create-quality-control` as the *intended* route; what now fails is a misroute. |

Index lines in `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` were updated to
match both reclassifications.

## Why `stage:`, not the reviewer's one-line `expected_workflow_mode: UNKNOWN`

The review proposed reclassifying SD-015 by setting its mode declaration to `UNKNOWN`. That would have made
the scenario an **invalid oracle**, not a passing negative: the typed-gold gate
(`sk-create-skill/scripts/validate-playbook-topology.cjs:300-304`) requires every typed pair's workflowMode
to belong to the scenario's own declared `expected_workflow_mode` set, and its only bypass —
`full_inventory_intent: true`, line 306 — relaxes the simultaneous-mode *cap*, not that membership check.
`stage: negative` is a first-class value in the compiled-scenario contract
(`validate-compiled-routing-scenarios.cjs`) and is what the admission library reads
(`lib/compiled-route-admission.cjs`: `negative = stage === 'negative' || …`, passing on any non-route
decision), so it clears the drift while keeping the typed gold valid and the reference inventory intact.

## Regenerated artifacts

- Deep-loop child rebuild: `basePolicyHash dd5868720b…`, **`effectivePolicyHash 7d22a7b4d0da3db8d135029b5817c43bc8ccab56aa0f774a84adf7b6effb6608`**, generation 4.
- Manifests re-selected and copied to their authored counterparts: system-deep-loop (`9e55ea00501de3a9…`), mcp-tooling (`136ed771e2122d58…`).
- Promotion: `compiled-route-sync.cjs` → 48 closure files, of which **three differ** — the deep-loop router and the two manifests; finalized with `--finalize` (rollback tree removed).

## Evidence

| Check | Result |
|---|---|
| `compiled-route-admission.cjs --all` | **every hub pass, 0 drift, 0 stale** (cli-external 7, mcp-tooling 18, sk-code 1, sk-doc 24 + 2 n/a, system-deep-loop 20) |
| Served-closure probes | AI-003 → `defer`; MO-004 → `route research`; IL-002 → `route model-benchmark`; `review:` hint → `route review`; SD-H02 and SD-015 → `defer` |
| In-memory matrix (authored sources) | 7/7 behavioural cases + **9/9 canary golds unchanged** |
| `compiled-route-guard.cjs` | all five hubs fresh |
| `compiled-route-sync.cjs --check` / `--verify` | all 5 hubs resolve; 0 reads under `.opencode/specs` |
| Routing parity + registry drift suites | 16 tests passed |
| `validate-playbook-topology.cjs` | 26 scenarios valid, 0 blocked |
| `validate-playbook-package.cjs --strict` (sk-doc) | 0 violations, exit 0 (one pre-existing advisory: missing result-persistence marker, absent at HEAD too) |
| Comment hygiene (edited router) | clean |
| `parent-skill-check` | system-deep-loop and sk-doc: 0 warnings |
| Derived / leaf-manifest / root metadata freshness | 13/13, 13/13, 13/13 |
| Markdown link integrity | 7,763 files, 13,191 links, 0 broken |

## Disclosures and open items

- **mcp-tooling was re-minted** with operator approval: the fleet-wide promotion refuses to publish while any
  hub is `stale-manifest`, and that hub (another session's in-flight `mcp-orca-cli` work) was stale. Only its
  manifest was re-selected; no authored file of theirs was touched.
- The hub's registry `aliases` still list the bare benchmark phrases. They project as metadata
  (`registry-compiler.cjs` `aliasProjections`), not scoring vocabulary, so the compiled contract is narrowed
  by the hub-router edit alone; the legacy advisor surface keeps them until that path is retired.
- **SD-015's reservation stands**: the token-cost ladder's ceiling rung no longer asserts a load-all outcome.
  It now measures that a full-toolkit request must not fan out. Restoring a real ceiling needs a fan-out
  feature (`compositionRules` + a 14-mode bundle), not a gold edit.
- The holdout bucket drops 19 → 18; the generalization gap SD-H02 measured is now recorded in the scenario
  and here rather than as a red admission line.
- The reviewer's cost estimates and its in-memory hash prediction were not reproduced (the real policy hash
  is `7d22a7b4…`, not the predicted `3f0d9d85…`); every behavioural claim it made did reproduce.
- The tree was not frozen while this ran: a concurrent session landed two commits (`6e8257908`, `dca7f67a4e`)
  and its commit hooks rewrote `.opencode/` mirror files. No gate above was measured against those paths.
