---
title: Deep Review Report - mcp-browser-use parent hub (vibe lineage)
description: Synthesis of five review iterations over the browser-use parent hub, its advisor routing at both stages, and the compiled-routing closure that serves it.
trigger_phrases:
  - "deep review report"
  - "mcp-browser-use hub review"
importance_tier: high
contextType: analysis
version: 1.0.0.0
---

# Deep Review Report - mcp-browser-use parent hub

## Executive Summary

**Verdict: CONDITIONAL**

Five iterations covered all four canonical dimensions plus a cross-reference pass. Ten findings are open: **0 P0, 3 P1, 7 P2**. Two further findings were raised and then adjudicated out of scope because the files they name are pure moves the branch did not edit; both are recorded under Limitations as pre-existing issues worth a separate ticket.

No blocker exists, so the hub is not unsafe to ship; three required fixes remain, so it is not ready to promote as-is.

The hub's architecture holds up. The three modes are registered, the two-stage routing is wired, the compiled policy hash matches the live activation manifest, the canary fixture passes 14/14, the parent-skill checker exits 0, and the admission gate passes for the whole hub cohort. The findings are concentrated in three places: a stage-one/stage-two keyword gap that silently degrades two vocabulary classes to the defer fallback, a destructive teardown runbook that contradicts the reference it cites, and a packet whose own recorded gate result is stale.

| Severity | Count | Meaning |
|---|---|---|
| P0 | 0 | No blocker |
| P1 | 3 | Required before promotion |
| P2 | 7 | Suggested; does not block |

- Run: `fanout-vibe-1795299580084-7g6zan`, generation 1, lineage mode `new`.
- Stop reason: `maxIterationsReached` (`config.stopPolicy: max-iterations`, `config.maxIterations: 5`).
- Convergence score: 0.417 against a 0.10 threshold — the loop stopped on the iteration cap, not on convergence, so the score is telemetry only.
- Release readiness: `converged` — every dimension is covered and the final pass raised no new P0 or P1. The CONDITIONAL verdict comes from the three carried P1s, not from incomplete coverage.
- Terminal gates: evidence **pass** (`all-findings-cited`), scope **pass** (`all-findings-in-scope`), coverage **pass** (`coverage-complete`). No failed required gate.

## Findings

### P1 - Required

| ID | Dimension | Location | Finding |
|---|---|---|---|
| R1-P1-001 | correctness | `.skilled/skills/mcp-browser-use/hub-router.json:98` and `:119` | Stage-two intent map omits two stage-one keywords, so a routed request loads no leaf and falls to the defer checklist |
| R2-P1-001 | security | `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46` | The Bladebro teardown runbook hardcodes one of two data roots, drops the packet's named-session precondition, and cannot verify its own pass criterion |
| R4-P1-001 | maintainability | `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:9` | The hub's own routing gate is recorded as failing, and no later run supersedes it after the gold was changed |

**R1-P1-001.** `hub-router.json` declares `"chrome live manual"` in the `chrome-devtools-live` class and `"core web vitals"` in the `browser-debug` class. `ROUTER.md:51` `INTENT_SIGNALS.CHROME_DEVTOOLS` contains neither. A request whose only signal is one of those two phrases scores zero at stage one, so the advisor never selects `mcp-browser-use` and the request never reaches the hub. `parent-skill-check.cjs` does not cross-check the two lists, which is why the gate is green. Fix: add both phrases to `ROUTER.md:51`, or remove them from `hub-router.json:98` and `:119` if they were never intended to route.

**R2-P1-001.** `uninstall-and-data-root.md:46` runs `rm -rf ~/.local/state/blade` unconditionally. `references/install-and-verify.md:77` requires removing "the data root `bladebro doctor` reported only after confirming no needed named sessions remain". The runbook therefore both hardcodes a root that may not be the reported one and drops the precondition that protects named sessions. Line 47's pass criterion (`command -v bladebro || echo absent`) cannot detect a surviving data root, so the runbook reports success after a partial teardown. Fix: read the root from `bladebro doctor`, gate the removal on the named-session check, and add a data-root assertion to the pass criterion.

**R4-P1-001.** The report at line 9 records `Verdict: FAIL` and at line 11 states "The admission check reports the same drift and exits 1". The scenario it cites, `manual-testing-playbook/hub-routing/holdout-agentic-browser.md:6`, now sets `expected_intent: defer`, and the live gate exits 0. The packet's newest hub-routing record therefore contradicts both its own gold and the running system. Fix: record a superseding run rather than editing the historical folder, per `benchmark/reports/README.md:19`.

### P2 - Suggested

| ID | Dimension | Location | Finding |
|---|---|---|---|
| R1-P2-001 | correctness | `.skilled/skills/mcp-browser-use/hub-router.json` | `routerPolicy.outcomes` declares three outcomes while the compiled router emits four |
| R2-P2-001 | security | `.../mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md` | The supply-chain digest scenario reads a release sidecar that no step obtains |
| R2-P2-003 | security | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` | The Chrome DevTools installer suggests running a global npm install under sudo |
| R3-P2-001 | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md` | The 005 summary's frontmatter says the compiled front door was deferred, while its own body says it was built in that phase |
| R3-P2-002 | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md` | The 006 continuity block still names landing the per-phase commits as the next safe action, and those commits are already on the branch |
| R4-P2-001 | maintainability | `.skilled/skills/mcp-browser-use/changelog/v1.1.0.0.md:26` | The hub changelog calls the advisor stage one, which is the name the hub gives `hub-router.json` |
| R4-P2-002 | maintainability | `.skilled/skills/mcp-browser-use/README.md:50` | The hub README's navigation table omits `leaf-scopes.json`, the file that decides which leaves are routable |

## Scope Adjudications

Two findings were raised during the run and then removed from the active set at synthesis, because the Scope Lock forbids keeping a code finding on a file the branch did not edit. Both were recorded through the append gateway as `claim_adjudication` rows with `finalSeverity: "none"`.

| Finding | Raised in | File | Why out of scope |
|---|---|---|---|
| R2-P2-002 | iteration 2 | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` | Byte-identical to `main`'s `.skilled/skills/mcp-tooling/mcp-aside-devtools/scripts/install.sh`. The branch only moved it, and `reviewScopeFiles` correctly omits pure moves. Its Chrome DevTools twin **does** differ from `main` and stays in scope as R2-P2-003. |
| R5-P2-001 | iteration 5 | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs` | Absent from `git diff --name-only main..HEAD` and absent from `reviewScopeFiles`. The drift predates the branch and belongs to the `sk-doc` hub's promoted mirror. |

Removing them is what turned the scope gate from `findings-out-of-scope` to `all-findings-in-scope`. The gate was right both times: the first pass caught two findings outside the bound scope, and the adjudication resolved them rather than the gate being relaxed.

## Adversarial Self-Check

All three active P1 findings were re-read against current file content at synthesis. The Referee changed no severity: `selfcheck_adjudications` is empty.

| Finding | Hunter | Skeptic | Referee |
|---|---|---|---|
| R1-P1-001 | Re-read `hub-router.json:95-122` and `ROUTER.md:51`. `"chrome live manual"` and `"core web vitals"` are present in the stage-two classes and absent from `INTENT_SIGNALS.CHROME_DEVTOOLS`. | Could this be P2? The consequence is a routed request loading no leaf and falling to `ROUTER.md:84`'s defer fallback — a functional routing failure, not a documentation gap. | Confirm P1. |
| R2-P1-001 | Re-read `uninstall-and-data-root.md:42-50` and `install-and-verify.md:74-80`. The hardcoded `rm -rf` and the missing named-session precondition both stand. | Could this be P2? It is a destructive command with a wrong precondition and an unverifiable pass criterion. | Confirm P1. |
| R4-P1-001 | Re-read the report at `:9` and `:11`, the holdout gold at `:6`, and ran the admission gate: exit 0, 7 pass, 0 drift. | Could this be P2 now that the gate is green? The gate being green is what makes the record stale rather than the gate broken; the record still says FAIL and still blocks a release decision. | Confirm P1, refined: stale evidence, not a broken gate. |

## Traceability

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | The parent goal's seven completion criteria are satisfied by shipped artifacts: three modes in the hub registry and six in `mcp-tooling`, no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` references, `parent-skill-check.cjs` exit 0 naming the hub, one recorded request per mode through both stages, three mode playbooks with recorded runs, and `validate.sh --strict --recursive` PASSED. |
| `checklist_evidence` | core | pass | Child phase `tasks.md` evidence is present for 002 through 006. The open findings are in the hub's own artifacts, not in child phase evidence. |

## Integration Evidence

- **Advisor stage one** — `ROUTER.md:51` `INTENT_SIGNALS` scores the request; the hub is selected when a class fires. R1-P1-001 is the one gap in this stage.
- **Hub stage two** — `hub-router.json` maps the selected class to a leaf set; `ROUTER.md:84` is the defer fallback.
- **Compiled front door** — `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` returns `{servingAuthority:'legacy'}` on any error; `resolve.cjs` honours `SPECKIT_COMPILED_ROUTING` with `0`/`false`/`off` as a fleet kill-switch and an invalid value failing closed to legacy.
- **Activation manifest** — `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` is byte-identical to its authored twin, `servingAuthority: "compiled"`, `shadowOnly: false`, `effectivePolicyHash: 8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a` — matching the hash compiled in memory from the three authored hub files.
- **Serving closure** — `serving-closure.manifest.json` lists 8 hubs including `mcp-browser-use`, `fileCount: 69` equal to the actual `files` length, `generatedFrom` resolving to an existing directory.
- **Admission gate** — `compiled-route-admission.cjs --hub mcp-browser-use` exits 0: `7 pass, 0 drift, 0 stale, 0 n/a`, `Every hub passes the admission check`.
- **Promoted-copy parity** — `compiled-route-sync.cjs --check` exits 1 on one file, `007-sk-doc/lib/registry-compiler.cjs`, which belongs to the `sk-doc` hub and predates this branch. The `mcp-browser-use` bundle is byte-identical to its authored source in all five files.
- **Canary fixture** — 14/14 cases pass through `evaluateRoute` in memory.
- **Parent-skill checker** — exit 0, 0 warnings, names `mcp-browser-use` as its subject.

## Dimension Coverage

| Dimension | Iteration | Findings |
|---|---|---|
| correctness | 1 | 1 P1, 1 P2 |
| security | 2 | 1 P1, 2 P2 (1 adjudicated out of scope) |
| traceability | 3 | 2 P2 |
| maintainability | 4 | 1 P1, 2 P2 |
| cross-reference (integration verification) | 5 | 1 refinement (1 P2 adjudicated out of scope) |

Coverage: 4 of 4 canonical dimensions, plus the cross-reference pass. Ratio 1.0.

## Planning Packet

Ordered by severity, then by fix cost. Each entry names the file to change and the change.

1. **R1-P1-001** — `.skilled/skills/mcp-browser-use/ROUTER.md:51`. Add `"chrome live manual"` and `"core web vitals"` to `INTENT_SIGNALS.CHROME_DEVTOOLS.keywords`, or delete them from `hub-router.json:98` and `:119`. Then extend `parent-skill-check.cjs` to cross-check the two lists so the gap cannot reopen.
2. **R2-P1-001** — `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46-47`. Replace the hardcoded root with the `bladebro doctor`-reported root, gate removal on the named-session check from `install-and-verify.md:77`, and add a data-root assertion to the pass criterion.
3. **R4-P1-001** — `.skilled/skills/mcp-browser-use/benchmark/reports/`. Record a superseding hub-routing run under a new dated folder and add its row to `benchmark/reports/README.md`. Do not edit the historical folder.
4. **R2-P2-003** — `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh`. Drop the `sudo` suggestion from the global npm install.
5. **R3-P2-001 / R3-P2-002** — the 005 and 006 `implementation-summary.md` files. Correct the 005 frontmatter's deferred-compiled-front-door claim and refresh the 006 continuity block.
6. **R1-P2-001, R2-P2-001, R4-P2-001, R4-P2-002** — the outcome-count mismatch, the unobtained digest sidecar, the changelog's stage-one naming, and the README's missing `leaf-scopes.json` row.

## Limitations

- The `main..HEAD` diff spans 5066 files because of the spec-packet move. The 277-file `reviewScopeFiles` list is the operative scope; pure renames were excluded by the operator's focus binding.
- `resource-map.md` is absent, so the coverage gate is skipped for this packet.
- The `mcp-tooling` bundle could not be compiled in memory to check its manifest: its `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`. The cohort-wide admission line covers the same ground.
- `validate.sh` and `generate-context.js` were not run, per the dispatch's write-scope prohibition. Their results are read from the packet's recorded runs.
- **Pre-existing, out of scope, worth a separate ticket:** `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` pipes a remote script into `bash` with no integrity check. The branch moved this file unchanged from `mcp-tooling`, so it is not a regression, but the hub now owns it.
- **Pre-existing, out of scope, worth a separate ticket:** `compiled-route-sync.cjs --check` exits 1 because `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:253` says `Skilled` where its authored twin says `OpenCode`. The drift is on `main` and the branch never touched that file, but the parity gate is red for anyone who runs it.

## Next Action

`/speckit:plan` against the three P1 findings. The hub is not promotable until R1-P1-001, R2-P1-001 and R4-P1-001 are closed; the seven P2 findings can follow.

Review verdict: CONDITIONAL
