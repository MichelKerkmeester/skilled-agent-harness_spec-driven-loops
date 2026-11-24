# Deep Review Report: mcp-browser-use hub epic, fan-out lineage pi-1

Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` by one deep-review lineage (session `fanout-pi-1-1795511024070-2cuwlj`, generation 1, executor `cli-pi` `deepseek-v4.1-flash-1017` at reasoning max). Scope: the 522 files the fan-out root seeded. Seven iterations ran; the loop reached its iteration cap rather than converging, because the target has an open traceability failure that keeps the coverage gate closed.

---

## 1. Executive Summary

**Overall verdict: FAIL.**

The verdict is not a judgement call. `review-verdict.cjs` returned `FAIL` from the registry and the state log: 0 active P0, 1 active P1, 8 active P2, and one required quality gate still failing at the terminal stop (`coverage`, reason `traceability-incomplete`). The chain is explicit: iteration 3 recorded `spec_code: fail` for the target, the reducer counted that as a gating failure, `convergence.cjs` therefore kept `dimensionCoverageGate` closed, and `terminal-gates.cjs` reported `coverage` fail. A reader who treated the phase 015 decision D2 as advisory rather than binding would see CONDITIONAL instead; that sensitivity is stated here rather than hidden.

- **hasAdvisories**: false
- **P0 / P1 / P2**: 0 / 1 / 8 active, the counts the verdict used
- **Stop reason**: `maxIterationsReached` at iteration 7, with `blockedBy: [dimensionCoverageGate, graphlessFallbackGate]`
- **Dimension coverage**: 4 of 4 (correctness, security, traceability, maintainability), one full pass each plus two second passes
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. It was covered by reading the goal criteria of all fifteen phases and testing every criterion a static read can settle; the phase 015 and 2.0.3.0 claims were additionally reproduced against the compiled engine and the replay artifact.
- **Adversarial self-check**: the single active P1 (`pi1-I3-P1-001`) was re-read at both cited lines in iterations 6 and 7 and confirmed at P1, not downgraded. No false positive was recorded; no P2 was promoted.
- **What holds**: the phase 015 fixes that touch behaviour are real. The three-mode bundle routes all three modes through the live compiled path; the two hub-side advisor probes now defer; the Aside installer pins a digest and refuses a mismatch; the activation manifest matches the compiled policy hash; the replay artifact carries 52 rows with 51 PASS and the one documented `MBU-PB-04` failure; and the 2.0.3.0 ratchet claim ("no browser replay row changed between pass and fail") is true across all 52 rows.

---

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is FAIL and one remediation workstream closes a security-remediation gap against a frozen decision.

```json
{
  "triggered": true,
  "reviewDidNotRun": false,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": 9,
  "remediationWorkstreams": [
    {
      "id": "RW-1",
      "priority": 1,
      "findingIds": ["pi1-I3-P1-001"],
      "title": "Make the digest-pinned Aside install the only install path the packet teaches",
      "affectedSurfaces": [
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md",
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh",
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md",
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md",
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/references/troubleshooting.md",
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/mcp-servers/aside-cli/README.md"
      ]
    },
    {
      "id": "RW-2",
      "priority": 2,
      "findingIds": ["pi1-I2-P2-001", "pi1-I2-P2-002", "pi1-I1-P2-002"],
      "title": "Close the three scorer and engine correctness gaps",
      "affectedSurfaces": [
        ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs",
        ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs",
        ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts"
      ]
    },
    {
      "id": "RW-3",
      "priority": 3,
      "findingIds": ["pi1-I4-P2-001", "pi1-I4-P2-002", "pi1-I5-P2-001"],
      "title": "Settle the packet status drift and the release-table drift",
      "affectedSurfaces": [
        "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md",
        "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/goal.md",
        "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/goal.md",
        "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/goal.md",
        "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/012-browser-hub-doc-topic/goal.md",
        ".skilled/skills/mcp-browser-use/README.md"
      ]
    },
    {
      "id": "RW-4",
      "priority": 4,
      "findingIds": ["pi1-I1-P2-001", "pi1-I1-P2-003"],
      "title": "Tighten the two narrow vocabulary and guard edges",
      "affectedSurfaces": [
        ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh",
        ".skilled/skills/mcp-browser-use/description.json"
      ]
    }
  ],
  "specSeed": [
    "A phase 016 packet whose directive is: every Aside install instruction in the packet names the digest-pinned wrapper, and no surface teaches the unpinned pipeline.",
    "Its completion criteria must be grep-checkable: one command proves no `curl … | bash` remains in the Aside packet outside vendor-history citations, and one proves `SKILL.md` names `scripts/install.sh` when the binary is absent.",
    "Record the decision this amends: 015 D2 said the installer runs only a pinned script; the gap is that the packet's own guidance bypassed it."
  ],
  "planSeed": [
    "Rewrite `mcp-aside-devtools/SKILL.md:75`, `scripts/doctor.sh:36`, `INSTALL-GUIDE.md:21,49,83`, `README.md:56`, `references/troubleshooting.md:62` and `mcp-servers/aside-cli/README.md:25,43` to name `bash scripts/install.sh` first and quote the vendor pipeline only as what the wrapper verifies.",
    "Add a check to the Aside packet's doctor or a guard script that fails when the unpinned pipeline appears in the packet, because `check-mcp-mutation-class.sh` matches executed calls only and cannot see printed guidance.",
    "Fix `resolve.cjs:173` to test `args.includes('--hub')` before indexing, so a missing flag prints usage and exits 2.",
    "Point `compiled-route.cjs`'s `ACTIVATION_ROOT` at `SPECKIT_ACTIVATION_ROOT_OVERRIDE` when set, so the engine cache key follows the manifest the resolver actually reads.",
    "Raise the lexical evidence cap or reserve a slot for `token:` entries, so `promptNamesIdNoun` cannot be starved by hints.",
    "Settle the four stale `completion_pct` values and the root status sentence against the child packets; extend the README release table to 1.1.2.0 and 1.1.3.0 and give 1.1.4.0 its own changelog file or lower the README version."
  ],
  "findingClasses": ["security-remediation-gap", "narrow-correctness", "state-drift", "doc-contract-drift"],
  "affectedSurfacesSeed": [
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools",
    ".skilled/skills/mcp-browser-use/description.json",
    ".skilled/skills/mcp-browser-use/README.md",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer",
    ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (root and phases 001, 002, 006, 012)"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class | Disposition |
|---|---|---|---|---|---|---|
| `pi1-I3-P1-001` | P1 | The digest-pinned Aside installer is bypassed by every other Aside surface, including the agent instruction | security | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:36` (plus eight lines in five more files) | security-remediation-gap | active, fix before merge |
| `pi1-I1-P2-001` | P2 | The `..` session-dir guard rejects legal directory names, not only traversal | correctness | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:32` | narrow-correctness | active, advisory |
| `pi1-I1-P2-002` | P2 | The id-noun anchor can be starved by the six-entry evidence cap | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:100` | narrow-correctness | active, advisory |
| `pi1-I1-P2-003` | P2 | Removing `mcp-code-mode` from the keyword list leaves the phrase in the hub description | correctness | `.skilled/skills/mcp-browser-use/description.json:3` | narrow-correctness | active, advisory |
| `pi1-I2-P2-001` | P2 | The engine fingerprints the live manifest while the resolver gates on the overridable one | correctness | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:27` | narrow-correctness | active, advisory |
| `pi1-I2-P2-002` | P2 | The resolver CLI front door misses `--hub` and then routes with the wrong argument | correctness | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:173` | narrow-correctness | active, advisory |
| `pi1-I4-P2-001` | P2 | Four phase continuity blocks report a completion percentage their own spec contradicts | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/goal.md:6` | state-drift | active, advisory |
| `pi1-I4-P2-002` | P2 | The root spec says every phase is Complete while phase 005 declares itself Partial | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:6` | state-drift | active, advisory |
| `pi1-I5-P2-001` | P2 | The hub README states the one-file-per-release rule and then breaks it in its own table | maintainability | `.skilled/skills/mcp-browser-use/README.md:70` | doc-contract-drift | active, advisory |

Evidence, impact and fix recommendation for each row are in the iteration narratives (`iterations/iteration-001.md` to `iteration-007.md`); the reducer-owned registry at `deep-review-findings-registry.json` is the canonical state.

---

## 4. Remediation Workstreams

**RW-1, P1, security.** Amend the six Aside surfaces so the wrapper is the taught path. The fix is text plus one guard: no code behaviour changes, but the packet stops contradicting its own decision. Do not touch the vendor's documentation; quote it as the thing the wrapper verifies.

**RW-2, P2, correctness.** Three independent small fixes in two subsystems: the two engineered argument and root constants, and the lexical evidence cap. None changes a routing decision for a prompt that names a skill; each closes a silent-failure path.

**RW-3, P2, packet state.** Settle the four continuity percentages and the root status sentence, then repair the README release table. This is bookkeeping with a real cost: a continuity reader currently sees a finished phase at 0 percent.

**RW-4, P2, narrow edges.** The `..` guard should test segments, not substrings; the hub description should stop naming the substrate anywhere the lexical lane reads.

---

## 5. Spec Seed

- Phase 016 directive: the Aside packet teaches one install path, the digest-pinned wrapper, and no surface teaches another.
- Completion criteria in grep form: `rg "curl .*\| *bash" .skilled/skills/mcp-browser-use/mcp-aside-devtools` returns only lines that name the wrapper as the reason the pipeline is safe; `rg -n "scripts/install.sh" <each surface>` returns a hit.
- Amend 015 D2's wording so it covers guidance, not only the script that executes.
- Add the two engine fixes and the lexical cap to the same packet only if they stay one-line changes; otherwise give them their own packet so RW-1 ships alone.

---

## 6. Plan Seed

1. Rewrite the nine guidance lines; keep the vendor command only as a citation of what the wrapper checks.
2. Add a packet-local guard (or a doctor check) that fails on the unpinned pipeline in the Aside packet, since the mutation-class guard sees executed calls only.
3. `resolve.cjs`: gate on `args.includes('--hub')` and exit 2 with usage when absent.
4. `compiled-route.cjs`: read `SPECKIT_ACTIVATION_ROOT_OVERRIDE` for `ACTIVATION_ROOT`, matching `resolve.cjs`.
5. `lexical.ts`: reserve evidence slots for `token:` entries, or raise the cap for the noun check.
6. Packet state: correct the four `completion_pct` values and split the root status sentence so the 005 caveat is not contradicted by its own first clause.
7. Hub README: add 1.1.2.0 and 1.1.3.0 rows, and either add `changelog/v1.1.4.0.md` or bring the README version back to 1.1.3.0.

---

## 7. Traceability Status

### Core Protocols

- **`spec_code`: fail.** The packet's decision D2 (`015/goal.md:33`) says the Aside install runs only a digest-pinned script; six surfaces, including the agent instruction at `SKILL.md:75`, teach the unpinned pipeline. Every other `spec_code` strand checked holds: phase 002's three-mode registry, phase 003's relocation, phase 005's catalog leaf and 31 total, phase 011's `returnByValue` guidance, phase 013/015's Aside capability row, and phase 015's activation manifest pin (`fc55eafa…aeb8`, observed equal to the compiled snapshot).
- **`checklist_evidence`: pass.** Phase 014's install-guidance criteria, phase 015's replay counts (52 rows, 51 PASS, 1 FAIL) and its three fix rows all reconcile with the artifacts. Eleven phases state completion as a command output this lineage does not execute; that limit is recorded as an edge case, not counted as clean.

### Overlay Protocols

- **`skill_agent`: fail.** The agent contract for a missing Aside binary (`SKILL.md:75`) prescribes the unpinned pipeline.
- **`agent_cross_runtime`: notApplicable.** No agent mirror is in the seeded scope for this target.
- **`feature_catalog_code`: pass.** Catalogue total and leaf resolve; `leaf-scopes.json` is contract-legal and matches its description.
- **`playbook_capability`: partial.** `MBU-PB-04` localises the stage-one playbook gap the packet already documents; the playbook's install remedy also quotes the unpinned pipeline. Scenario counts were not reproduced.

**`AC_COVERAGE`: disabled** for this lineage. The advisory signal requires a `validate.sh --strict` run, which is outside this lineage's write surface, so nothing here asserts it.

---

## 8. Deferred Items

- The **`@latest` registrations** in the Chrome install guide and three sibling installers: a repository-wide convention, not a hub-level defect (014 already recorded it).
- The **shared 0.45 lexical anchor**: 015 declared it out of scope because it moves every skill's pins. It is the reason the changelog's Known Limitation still fires.
- The **`ASIDE_CLI_BASE_URL` env override** and the unverified fetched archive: disclosed in the wrapper's own comment and in its usage text.
- **Command-output criteria across eleven phases**: a re-review with a read-only executor that may run `parent-skill-check.cjs`, `check-mcp-mutation-class.sh` and `validate.sh --strict` would close them.
- **Loop observation, not a target finding**: this lineage reached its cap rather than converging because its own `spec_code: fail` kept `traceabilityCovered` false, so a review that finds a spec contradiction structurally cannot record a converged stop.

## Dimension Expansion Map



No divergent pivot ran (`convergenceMode: default`). Saturated directions: none. Frontier: none (depth mode default). The five review directions worked in sequence: phase 015 fixes and the advisor id-noun change → compiled-routing engine and activation state → install and guard surfaces → phase goals and status → hub and per-mode documentation.

---

## 9. Search Ledger

| Dimension | Bug class | Disposition | Evidence |
|---|---|---|---|
| correctness | boundary_handling | finding `pi1-I1-P2-001` | guard substring match at `repl-evidence-capture.sh:32` |
| correctness | contract_drift | finding `pi1-I1-P2-002`, `pi1-I1-P2-003` | evidence cap at `lexical.ts:100`; description phrase at `description.json:3` |
| correctness | injection | ruled out | parameter expansion is not rescanned; the quote guard covers the JS string |
| correctness | cache_coherency | finding `pi1-I2-P2-001` | two `ACTIVATION_ROOT` constants, one overridable |
| correctness | argument_parsing | finding `pi1-I2-P2-002` | `args[args.indexOf('--hub')+1]` with no membership check |
| correctness | contract_drift | ruled out | manifest hash equals the compiled snapshot; `.opencode/skills` is a symlink |
| security | guard_bypass | finding `pi1-I3-P1-001` | nine guidance lines against one pinned installer |
| security | secret_exposure | ruled out | every provider key is a `${VAR}` interpolation |
| security | injection | ruled out | `--ignore-scripts` install with post-install digest verification |
| traceability | state_transition | finding `pi1-I4-P2-001` | four `completion_pct` values against Complete statuses |
| traceability | contract_drift | finding `pi1-I4-P2-002` | root status versus phase 005 |
| traceability | regression | ruled out | zero PASS/FAIL flips across 52 replay rows |
| maintainability | doc_drift | finding `pi1-I5-P2-001` | README release rule versus its own table and the changelog set |
| maintainability | index_integrity | ruled out | every hub and per-mode index link resolves |
| maintainability | placeholder_shipping | ruled out | only `mktemp` templates matched |

`searchDebt`: none. `graphCoverageMode`: `graphless_fallback`.

---

## 10. Audit Appendix

**Convergence summary.** Seven iterations; ratio 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0 (P2 = 1, P1 = 5 weights). `convergence.cjs` returned `CONTINUE` with `noStopCandidate` after iteration 6 and `STOP` with `maxIterationsReached` after iteration 7, `blockedBy: [dimensionCoverageGate, graphlessFallbackGate]`, weighted stop score 0.55, stuck count 2, consecutive failures 0.

**Coverage summary.** correctness (iterations 1, 2), security (3), traceability (4, 7), maintainability (5, 6); core protocols recorded in five iterations.

**Terminal gates.** `evidence` pass, `scope` pass, `coverage` fail (`traceability-incomplete`); `failedRequiredGateIds: ["coverage"]`.

**Ruled-out claims.** Nine directions were investigated and eliminated; the reasons are listed in the iteration narratives and the Search Ledger above. Two candidates were withdrawn after a direct read contradicted the tool output: a truncated CDP parameter (a `rg -r` artifact) and missing ROUTER references (a wrong base directory).

**Method note.** Every P0/P1 claim in this run rests on a direct read of the cited line, re-read in at least two iterations. The two behavioural claims that could be settled without running repo tooling were settled by loading the compiled routing modules in-process, which writes nothing: the three-mode bundle and the two hub probes.

**Sources reviewed.** 522 seeded files, of which this lineage read in full or in relevant part: the phase 015 packet, the advisor scorer's fusion, lexical and explicit lanes plus its changelog; the compiled-routing engine, resolver, router, harness and activation state; the three browser mode installers and doctors; the mutation-class manifest, its guard and the pre-commit gate; the hub's SKILL, README, ROUTER, description, mode-registry, leaf-scopes and changelog set; the hub and per-mode benchmark indexes and the 52-row replay artifact; and the goal and spec of all fifteen phases.

**Cross-reference appendix.** Core protocols: `spec_code` fail, `checklist_evidence` pass. Overlay protocols: `skill_agent` fail, `agent_cross_runtime` notApplicable, `feature_catalog_code` pass, `playbook_capability` partial.
