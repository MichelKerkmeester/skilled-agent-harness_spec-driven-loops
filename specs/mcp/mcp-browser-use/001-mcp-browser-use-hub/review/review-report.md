# Deep Review Report - mcp-browser-use parent hub (fan-out root)

Two lineages, five iterations each: `vibe` (cli-mistral-vibe, deepseek-flash) and `claude2` (cli-claude-code, claude-opus-5-5, effort medium, second account). Stop policy `max-iterations`, so both lineages stopped on the cap and convergence is telemetry only. Lineage reports: `lineages/vibe/review-report.md` and `lineages/claude2/review-report.md`. Attribution: `fanout-attribution.md`. Merged registry: `deep-review-findings-registry.json`.

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false (the verdict is CONDITIONAL, so the 17 active P2 items are advisories inside it)
- Counts the verdict used: P0 = 0, P1 = 4, P2 = 17. These are the merged lineage counts from `fanout-merge.cjs`, passed to `review-verdict.cjs` with search debt 0 and no failed required gate.
- Terminal gates: both lineages pass evidence (`all-findings-cited`), scope (`all-findings-in-scope`) and coverage (`coverage-complete`). Vibe recorded its own `terminal_gates` row. Claude2 skipped `record_terminal_gates`, so its gates were computed at the root with `terminal-gates.cjs` against its config, state log and registry, read-only. The result is the same three passes.
- Self-check at the root (recorded for the report only, per the fan-out rule): every P1 was re-read against the current tree. All four are confirmed and none changed severity. C2-I1-P1-001 was also reproduced live. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "debug the 403 Forbidden network requests in chrome devtools"` returns `"action":"reject"`. The same prompt without "Forbidden" routes to `mcp-chrome-devtools`.
- Review scope: 277 pre-bound files: the hub scaffold, the Chrome DevTools and Aside move into the hub, the Bladebro mode, two-stage advisor routing, nested sub-tracks in system-spec-kit, and the verification packet.
- Operator review focus: The 8 commits main..HEAD on this branch that build the browser-use parent hub: the hub scaffold, the move of the Chrome DevTools and Aside modes into the hub, the Bladebro stealth-browser mode, advisor routing at both stages, nested sub-track support in system-spec-kit, and the end-to-end verification. Pure renames of moved spec packets are out of scope; review the edited and added files.
- Run history: the first launch of this run was stopped for a hand-over and archived to `../review-archive/20261121T221729Z-stopped-run2/`. The relaunch was stopped again after claude2's fifth iteration, before its synthesis. That claude2 lineage is archived to `../review-archive/20261121T223122Z-claude2-stopped/`, and claude2 was rerun alone (`--only-lineage claude2`). The vibe lineage here is from the relaunch and completed normally.

## 2. Planning Trigger

`/speckit:plan` is required: four active P1 findings.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "C2-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107", "lineage": "claude2"},
    {"id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/hub-router.json:98", "lineage": "vibe"},
    {"id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46", "lineage": "vibe"},
    {"id": "R4-P1-001", "severity": "P1", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:9", "lineage": "vibe"}
  ],
  "remediationWorkstreams": ["WS1 routing correctness (C2-I1-P1-001, R1-P1-001)", "WS2 Bladebro teardown safety (R2-P1-001)", "WS3 stale routing evidence (R4-P1-001)", "WS4 P2 advisories"],
  "specSeed": ["A compiled hub router rejects only on the constraints channel, never on prompt text", "Every stage-two keyword has a stage-one signal that can select the hub", "The teardown runbook removes only the data root bladebro doctor reports, after the named-session check"],
  "planSeed": ["Reject on constraints.has('forbidden') only; add a 403 Forbidden canary that must route to mcp-chrome-devtools", "Add 'chrome live manual' and 'core web vitals' to ROUTER.md INTENT_SIGNALS.CHROME_DEVTOOLS", "Rewrite uninstall-and-data-root.md steps 2-3 with the reported root, the precondition and a data-root assertion", "Record a superseding hub-routing benchmark run"],
  "findingClasses": ["correctness/routing-contract", "correctness/vocabulary-gap", "security/destructive-runbook", "maintainability/stale-evidence", "security/supply-chain", "security/consent-boundary", "traceability/status-drift", "maintainability/duplicated-invariant"],
  "affectedSurfacesSeed": [".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/", ".skilled/skills/mcp-browser-use/ROUTER.md", ".skilled/skills/mcp-browser-use/hub-router.json", ".skilled/skills/mcp-browser-use/mcp-bladebro/", ".skilled/skills/mcp-browser-use/benchmark/reports/", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/", ".skilled/skills/system-spec-kit/runtime/cli/"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1 (required)

| ID | Lineage | Dimension | File:line | Issue | Fix |
|----|---------|-----------|-----------|-------|-----|
| C2-I1-P1-001 | claude2 | correctness | `010-mcp-browser-use/lib/router.cjs:107` | `evaluateRoute` rejects when the prompt text contains "forbidden". Compiled routing is the hub's default and SKILL.md:62 says `reject` refuses, so a 403 Forbidden debugging request is refused. Reproduced live. | Reject on `constraints.has('forbidden')` only. Add a 403 canary that must route to `mcp-chrome-devtools`. |
| R1-P1-001 | vibe | correctness | `hub-router.json:98`, `:119`; `ROUTER.md:51` | Stage two holds "chrome live manual" and "core web vitals"; stage one `INTENT_SIGNALS.CHROME_DEVTOOLS` holds neither, so a request carrying only one of them never selects the hub. | Add both phrases to `ROUTER.md:51`, or drop them from `hub-router.json`. |
| R2-P1-001 | vibe | security | `mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46` | `rm -rf ~/.local/state/blade` is unconditional. `install-and-verify.md:77` says to remove the root `bladebro doctor` reports, and only after confirming that no needed named sessions remain. The pass criterion cannot detect a surviving root. | Use the reported root, add the precondition, assert the root is gone. |
| R4-P1-001 | vibe | maintainability | `benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:9` | The newest hub-routing record says FAIL with admission exit 1. The holdout gold now expects `defer` and the live admission gate exits 0, and no later run supersedes the record. | Record a superseding run in a new dated folder; leave the historical folder as is. |

### P2 (advisories)

| ID | Lineage | Dimension | File:line | Issue |
|----|---------|-----------|-----------|-------|
| C2-I1-P2-001 | claude2 | correctness | `hub-router.json:117` | Bare `aside` matches as a substring ("Aside from that, run lighthouse"); the note's premise is contradicted by 005 Known Limitation 3 |
| C2-I1-P2-002 | claude2 | correctness | `hub-router.json:5` | Uniform weight 4 with `ambiguityDelta: 1` turns every one-hit cross-mode overlap into a bundle |
| R1-P2-001 | vibe | correctness | `hub-router.json:12` | `routerPolicy.outcomes` declares three outcomes; the compiled router emits four |
| C2-I5-P2-001 | claude2 | traceability | `mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:47` | The validation row cites a playbook with no Lighthouse or trace scenario |
| C2-I2-P2-001 | claude2 | security | `mcp-bladebro/references/install-and-verify.md:79` | The update path drops the pin and the digest check |
| C2-I2-P2-002 | claude2 | security | `native-binary-digest.md:44` | The digest gate covers the native binary, not the npm launcher on PATH |
| R2-P2-001 | vibe | security | `native-binary-digest.md:46` | The scenario reads a release sidecar no step obtains |
| C2-I2-P2-003 | claude2 | security | `mcp-bladebro/references/browser-lanes.md:51` | The default `auto` lane attaches to any reachable debug endpoint, bypassing consent item 2 |
| R2-P2-003 | vibe | security | `mcp-chrome-devtools/scripts/install.sh:235` | Suggests a global npm install under sudo |
| C2-I3-P2-001 | claude2 | traceability | `spec.md:51` | Parent says 005 has two unmet requirements; the 005 summary lists three, the 005 spec a different two |
| C2-I3-P2-002 | claude2 | traceability | `mcp-bladebro/references/install-and-verify.md:14`, `mcp-wiring.md:67` | Pre-run prose survives the live macOS run |
| R3-P2-001 | vibe | traceability | `005-routing-and-surfaces/implementation-summary.md:3` | Frontmatter says the compiled front door was deferred; the body says it was built |
| R3-P2-002 | vibe | traceability | `006-verification/implementation-summary.md:14` | Continuity still names landing commits that are already on the branch |
| R4-P2-001 | vibe | maintainability | `changelog/v1.1.0.0.md:26` | Calls the advisor "stage one", the name the hub gives `hub-router.json` |
| R4-P2-002 | vibe | maintainability | `README.md:50` | Navigation table omits `leaf-scopes.json` |
| C2-I4-P2-001 | claude2 | maintainability | `system-spec-kit/runtime/cli/spec/create.sh:1045` | The sub-track rule and the 2-level limit are encoded in about eight places; `create.sh` ignores `MAX_SUB_TRACK_DEPTH` |
| C2-I4-P2-002 | claude2 | maintainability | `system-spec-kit/runtime/cli/lib/track-roots.mjs:131` | A symlinked declared folder below level 1 is skipped silently, while level 1 reports it |

No finding appears in both lineages. The two `native-binary-digest.md` findings name different defects in the same scenario.

## 4. Remediation Workstreams

1. WS1, routing correctness (P1): C2-I1-P1-001, then R1-P1-001. Rebuild the hub's compiled artifacts and rerun `compiled-route-admission.cjs --hub mcp-browser-use` and the canary fixture.
2. WS2, Bladebro teardown safety (P1): R2-P1-001.
3. WS3, stale routing evidence (P1): R4-P1-001.
4. WS4, advisories (P2): vocabulary precision (C2-I1-P2-001/002, R1-P2-001), Bladebro supply chain and consent docs (C2-I2-*, R2-P2-001, R2-P2-003), status and stale prose (C2-I3-*, R3-*, C2-I5-P2-001, R4-*), and spec-kit invariant consolidation (C2-I4-*).

## 5. Spec Seed

- A compiled hub router rejects only on the constraints channel, never on free prompt text.
- Every stage-two vocabulary keyword has a stage-one signal that can select the hub.
- A destructive teardown step removes only the data root `bladebro doctor` reports, after the named-session check, and its pass criterion proves the root is gone.
- The newest routing benchmark record agrees with the current gold and the live gate.

## 6. Plan Seed

- T1: `router.cjs:107` rejects on `constraints.has('forbidden')` only; keep the `forbidden-reject` canary on the constraint and add a 403 Forbidden case that routes to `mcp-chrome-devtools`.
- T2: add "chrome live manual" and "core web vitals" to `ROUTER.md:51`.
- T3: rewrite `uninstall-and-data-root.md` steps 2 and 3 and its expected block.
- T4: record a superseding hub-routing run and its row in `benchmark/reports/README.md`.
- T5: P2 advisories by workstream.

## 7. Traceability Status

### Core Protocols

| Protocol | vibe | claude2 | Drift |
|----------|------|---------|-------|
| `spec_code` (hard) | pass | partial | The forbidden reject contradicts SKILL.md's routing contract (C2-I1-P1-001); the Bladebro update path and run-state prose drift from the shipped state (C2-I2-P2-001, C2-I3-P2-002) |
| `checklist_evidence` (hard) | pass | pass | none |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `playbook_capability` | pass (claude2) | 7 hub-routing scenarios feed admission |
| `feature_catalog_code` | partial (claude2) | Lighthouse validation row cites no matching scenario (C2-I5-P2-001) |
| `skill_agent`, `agent_cross_runtime` | notApplicable | No agent definitions in scope |

AC_COVERAGE: advisory only. Phase 003 is the phase with an acceptance-criteria file, and every row is Met.

## 8. Deferred Items

- The same `text.includes('forbidden')` reject in the sibling hub routers (`003-mcp-tooling`, `001-sk-code`, `002-system-deep-loop`, `009-sk-design`) predates this branch. It needs a separate follow-up.
- Pre-existing, out of scope (adjudicated by vibe): `mcp-aside-devtools/scripts/install.sh` pipes a remote script into `bash` with no integrity check; the branch only moved it.
- Pre-existing, out of scope (adjudicated by vibe): `compiled-route-sync.cjs --check` exits 1 on `007-sk-doc/lib/registry-compiler.cjs:253`, which is on main.
- Not run inside lineage containment: the advisor CLI, `nested-subtrack.vitest.ts`, `validate.sh` and `generate-context.js`.

### Workflow defect (outside this packet)

Claude2 skipped `record_terminal_gates`, as both lineages did in the 509 run, so `fanout-run.cjs` marked a lineage that completed with a synthesis as failed ("state log holds no terminal stop row"), and exited 3. Vibe recorded the row this time. Two models across two runs skipped the step, so the shared deep-review workflow does not hold lineages to it. Reported, not fixed here.

## Dimension Expansion Map

Both lineages swept correctness, security, traceability and maintainability, plus a fifth cross-reference pass. No pivots, overrides or Council artifacts. Remaining frontier (claude2): stage-one graph-metadata aliases and the one-line `compiled-route-sync.cjs` change.

## 9. Search Ledger

- Search debt: 0 in both lineages.
- Bug classes covered (claude2): routing_contract, input_matching, supply_chain, consent_boundary, status_drift, stale_prose, duplicated_invariant, diagnostic_consistency, catalog_reference.
- Ruled out (claude2): state_identity, guard_coverage, secret_exposure, metadata_drift, gold_tuning, view_parity, stranded_alias.
- Ledger note carried from claude2: iteration 5 row SL-005-3 links to C2-I5-P2-001 by mistake; it concerns C2-I1-P1-001.

## 10. Audit Appendix

- Convergence: vibe 0.417, claude2 0.938 (newFindingsRatio 1.0, 0.3, 0.208, 0.133, 0.062). Both stopped on `maxIterationsReached`.
- Coverage: 4 of 4 dimensions in each lineage.
- Cost: claude2 USD 5.72; vibe not reported.
- Integrity: the 505 tree outside `review/` and `review-archive/` matched its baseline (HEAD `c7f38f295d2`, empty status) after the run.
- Method note (claude2): two-dot `main..HEAD` diffs include main's newer commits as reversions, so scope diffs after iteration 1 used the merge base.

## 11. Remediation Outcome (after the review)

The verdict above is the review's and stays CONDITIONAL. This section records what was done with it afterwards, without a re-review.

- **Fixed, P1:** C2-I1-P1-001. The router rejects only on the `forbidden` constraint, and a 403 Forbidden canary failed before the fix and passes after it. R2-P1-001. The teardown reads the root from `bladebro doctor`, waits for the named-session confirmation and asserts the root is gone. R4-P1-001. The new run `benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing--post-review/` records 7 of 7 PASS and supersedes the FAIL record.
- **Downgraded and not changed:** R1-P1-001, now P2. A stage-one replay showed no misroute. "chrome live manual" already picks the hub (0.87), and "core web vitals" picks sk-code (0.90), whose `WEB_PERF` intent owns it. Declaring "chrome live manual" in `ROUTER.md` made an out-of-domain prompt pick the hub (0.835, none before), so the edit was reverted. Dropping both phrases from `hub-router.json` changes the policy hash and is the operator's call.
- **Fixed, P2:** R3-P2-001, R3-P2-002 (the 006 continuity block was rewritten by the save after this review), C2-I3-P2-001, C2-I3-P2-002, C2-I2-P2-001, C2-I5-P2-001, R4-P2-002.
- **Deferred, needs the operator:** R1-P2-001, C2-I1-P2-001, C2-I1-P2-002 and R4-P2-001 each need a `hub-router.json` or `SKILL.md` edit, which re-mints the manifest. R4-P2-001 also points the wrong way: the changelog matches the repo's stage naming, and `SKILL.md` and `README.md` are the ones that call `hub-router.json` stage one. C2-I2-P2-002 and C2-I2-P2-003 change a Bladebro security gate or consent default. R2-P2-001 needs the sidecar's download URL, which the packet does not record.
- **Out of scope:** R2-P2-003. The `sudo` line moved unchanged from `mcp-tooling`. C2-I4-P2-001 and C2-I4-P2-002 would change shared spec-kit infrastructure.
- **Outside this packet:** the router fix's producer is the authored bundle under `specs/sk-doc/z_archive/…/009-parent-hub-rollout/010-mcp-browser-use/`, edited there and copied file by file to `.skilled/bin/lib/compiled-routing/`. The sibling hubs' identical reject and the kebab-name checker that rejects the benchmark run-folder grammar are reported, not changed.
- **Evidence:** every baselined gate matches or improves. Admission and guard exit 0. Sync `--check` fails only on the pre-existing `007-sk-doc` file. Advisor suite 2570 passed. `.skilled/bin` node tests 195 pass and 1 fail, as before. `.skilled/bin` vitest 97 of 97. Details are in `006-verification/implementation-summary.md` and `006-verification/tasks.md` T017 to T022.

Review verdict: CONDITIONAL
