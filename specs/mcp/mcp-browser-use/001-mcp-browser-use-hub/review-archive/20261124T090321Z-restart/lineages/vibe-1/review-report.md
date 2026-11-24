---
title: "Deep Review Report - mcp-browser-use hub (lineage vibe-1)"
description: "Seven-iteration deep review of the mcp-browser-use hub packet: 0 P0, 4 P1, 9 P2 active findings, verdict CONDITIONAL, release readiness converged."
importance_tier: high
contextType: review
verdict: CONDITIONAL
sessionId: fanout-vibe-1-1795504079797-ay97sx
generation: 1
lineageMode: new
---

# Deep Review Report - mcp-browser-use hub

## 1. Executive Summary

- **Overall verdict**: `CONDITIONAL`
- **hasAdvisories**: `false` (the verdict is CONDITIONAL, so the advisory flag does not apply)
- **Active findings**: P0 = 0, P1 = 4, P2 = 9. These are the counts `review-verdict.cjs` read from `deep-review-findings-registry.json` and the counts this report and the closeout use.
- **Search debt**: 0. No deferred or blocked bug classes.
- **Failed required gate ids**: none reported by the verdict step. The `checklist_evidence` core protocol is `partial`, which is recorded as a traceability shortfall rather than a gating failure.
- **Iterations**: 7 of a permitted 7. Stop reason `converged` at a 0.0345 new-findings ratio against the 0.10 threshold.
- **Dimension coverage**: 4 of 4 (correctness, security, traceability, maintainability), plus a cross-reference convergence pass closing all six protocols.
- **Review scope summary**: the `mcp-browser-use` hub packet -- 14 phase children, 507 pre-bound scope files. The run sampled by surface rather than reading all 507 line by line: the hub's four-file contract, the compiled routing engine and its admission corpus, the three mode packets' installers and playbooks, the advisor scorer change, the changelog and benchmark documentation layer, and the parent and child goal criteria.
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.

**Self-check outcomes.** The adversarial self-check ran Hunter, Skeptic and Referee over all four active P1 findings. The Referee changed nothing: all four were confirmed at P1, none was downgraded and none was called a false positive. The Hunter pass re-read each cited `file:line` in iteration 7 and found every one still present, so no finding has been silently fixed since it was raised. The Skeptic pass considered a downgrade for each:

| Finding | Skeptic challenge | Referee |
|---|---|---|
| R1-P1-001 | A combined three-mode request is an edge case; each mode routes correctly alone. | Confirmed P1. The compiler ships a bundle rule and the router never reaches it for the canonical ids, so a shipped capability is unreachable. |
| R2-P1-001 | A missing test case is not a product defect. | Confirmed P1. It is the admission gate for compiled routing, and it is the gate that would have caught R1-P1-001. |
| R3-P1-001 | D5 makes installation operator-gated, so the path is not unattended. | Confirmed P1, not P0. Operator-gated and not reachable from agent routing, but it is the only installer in the repository that pipes an unverified remote script to a shell. |
| R4-P1-001 | The 014 scorer change fixed the out-of-domain over-reach it targeted. | Confirmed P1. The over-reach is fixed; the hub is still unreachable for prompts its own router handles, which is the objective's second half. |

**What holds.** Six of the seven parent completion criteria are verified by execution or direct read rather than by prose: criterion 1 (12 research records, `research.md` present), criterion 2 (three modes in the hub registry, six in `mcp-tooling`), criterion 3 (no old id survives in the five named files), criterion 4 (the parent-skill checker exits 0 and names the hub), criterion 6 (a recorded run per mode including the macOS live Bladebro run), and criterion 7 (every child goal criterion checked). Criterion 5 holds per mode but not for a combined three-mode request, which is R1-P1-001.

## 2. Planning Trigger

`/speckit:plan` **is required**. The verdict is CONDITIONAL with four active P1 findings, and the promotion gate blocks on active P1.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 4,
    "P2": 9,
    "total": 13
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": 1,
      "title": "Make the three canonical mode ids reach the three-mode bundle",
      "findings": ["R1-P1-001"],
      "surfaces": [".skilled/skills/mcp-browser-use/hub-router.json", ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs"]
    },
    {
      "id": "WS-2",
      "priority": 2,
      "title": "Extend the admission canary corpus to the three-mode bundle and the canonical ids",
      "findings": ["R2-P1-001"],
      "surfaces": [".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json"]
    },
    {
      "id": "WS-3",
      "priority": 3,
      "title": "Verify the Aside installer before executing it",
      "findings": ["R3-P1-001", "R3-P2-002"],
      "surfaces": [".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh", ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh"]
    },
    {
      "id": "WS-4",
      "priority": 4,
      "title": "Widen the advisor-facing keyword set to the router vocabulary",
      "findings": ["R4-P1-001"],
      "surfaces": [".skilled/skills/mcp-browser-use/description.json", ".skilled/skills/mcp-browser-use/graph-metadata.json"]
    },
    {
      "id": "WS-5",
      "priority": 5,
      "title": "Correct the documentation and metadata drift",
      "findings": ["R1-P2-002", "R4-P2-002", "R5-P2-001", "R5-P2-002", "R6-P2-001", "R6-P2-002", "R7-P2-001"],
      "surfaces": [".skilled/skills/mcp-browser-use/README.md", ".skilled/skills/mcp-browser-use/benchmark/reports/README.md", ".skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md", ".skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md"]
    },
    {
      "id": "WS-6",
      "priority": 6,
      "title": "Align the activation-root override between engine and resolver",
      "findings": ["R2-P2-002"],
      "surfaces": [".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"]
    }
  ],
  "specSeed": "Amend the hub packet so criterion 5 states the three-mode bundle explicitly, and add a phase that owns the advisor keyword surface as a first-class artifact rather than a 17-keyword summary.",
  "planSeed": "Start with WS-1 and WS-2 together: the bundle fix and the canary case that pins it are one change. Then WS-3, which is the only security finding. Then WS-4, which needs a replay run to prove the widened vocabulary does not reintroduce the out-of-domain over-reach 014 fixed.",
  "findingClasses": [
    "routing-correctness",
    "admission-coverage",
    "installer-integrity",
    "advisor-reachability",
    "documentation-index drift",
    "documentation-accuracy drift",
    "capability-inventory gap",
    "environment-override divergence",
    "operator-gate enforcement"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/mcp-browser-use/hub-router.json",
    ".skilled/skills/mcp-browser-use/description.json",
    ".skilled/skills/mcp-browser-use/graph-metadata.json",
    ".skilled/skills/mcp-browser-use/README.md",
    ".skilled/skills/mcp-browser-use/benchmark/reports/README.md",
    ".skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md",
    ".skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json",
    ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1 Findings

| ID | Severity | Dimension | Location | Title |
|---|---|---|---|---|
| R1-P1-001 | P1 | correctness | `.skilled/skills/mcp-browser-use/hub-router.json:96` | The three canonical mode ids do not route to all three modes |
| R2-P1-001 | P1 | correctness | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:4` | The admission canary corpus never exercises the declared three-mode bundle or the canonical ids |
| R3-P1-001 | P1 | security | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:78` | The Aside installer executes unverified remote code and is the only installer in the repository that does |
| R4-P1-001 | P1 | traceability | `.skilled/skills/mcp-browser-use/description.json:6` | The advisor-facing keyword set is far narrower than the hub router vocabulary, so the hub is unreachable for prompts it routes correctly |

**R1-P1-001.** A prompt naming all three canonical mode ids does not produce the three-mode bundle the compiler declares. Evidence: `hub-router.json:96-97,142-143,162` (the per-mode alias blocks) and `router.cjs:88,100` (`selectNearTiedModes` filters by `ambiguityDelta`, so a near-tie never reaches `exactBundle`). Impact: a shipped bundle capability is unreachable through the canonical ids. Fix: score the canonical ids so the three-way tie falls inside `ambiguityDelta`, or add an explicit bundle rule keyed on the ids. Finding class: routing-correctness. Scope proof: both the router and the compiler are shipped files of the declared target's hub. Affected surface hints: `hub-router.json`, `router.cjs`.

**R2-P1-001.** The admission canary corpus has no case for the three-mode bundle and no case using the canonical ids. Evidence: `canary-cases.v1.json:4` (`"cases": [`) and `:141` (`"id": "named-tools-bundle"`), read against `resolve.cjs:34,39` which admits `mcp-browser-use` to compiled routing on the strength of that corpus. Impact: the bundle can regress without the admission gate noticing, which is exactly how R1-P1-001 survived. Fix: add a three-mode bundle case and a canonical-id case to the corpus. Finding class: admission-coverage. Scope proof: the corpus and the resolver are both shipped files of the declared target. Affected surface hints: `canary-cases.v1.json`.

**R3-P1-001.** `install.sh:78` runs `if curl -fsSL "$INSTALLER_URL" | bash; then` against `https://releases.aside.com/install.sh` (`:9`) with no digest or signature check, and it is the only installer in the repository that does. Impact: an operator following the hub's install path executes whatever that URL serves. Fix: pin a version and verify a published digest before executing, as the Bladebro installer already does with `--ignore-scripts` and digest checks. Finding class: installer-integrity. Scope proof: the installer is a shipped file of the declared target's Aside mode packet. Affected surface hints: `mcp-aside-devtools/scripts/install.sh`.

**R4-P1-001.** `description.json` carries 17 keywords against `hub-router.json`'s 76 across six classes, so the advisor never surfaces the hub for prompts the router handles. Evidence: `description.json:6`; `results.csv:50` (`MBU-PB-04`, `hub_confidence` 0, empty `advisor_top`, `stage1=false`); `holdout-browser-inspect.md:46` (the same prompt is playbook `MT-H01`, whose pass rule is router-only, so the packet holds two verdicts for one scenario). Impact: the objective's "route through both advisor stages" fails for a plain browser-inspection prompt. Fix: widen the advisor keyword surface to the router vocabulary and re-run the replay to prove the out-of-domain rows still defer. Finding class: advisor-reachability. Scope proof: `description.json`, `hub-router.json`, the replay CSV and the playbook are all shipped files of the declared target. Affected surface hints: `description.json`, `graph-metadata.json`, the replay report, `holdout-browser-inspect.md`.

### P2 Findings

| ID | Severity | Dimension | Location | Title |
|---|---|---|---|---|
| R1-P2-002 | P2 | correctness | `.skilled/skills/mcp-browser-use/README.md:58` | `leaf-scopes.json` is described as per-mode but holds one mode |
| R2-P2-002 | P2 | correctness | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:29` | The engine ignores the activation-root override the resolver honours |
| R3-P2-002 | P2 | security | `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:8` | Neither installer enforces the operator-yes gate in code |
| R4-P2-002 | P2 | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:83` | Two goal logs still report the 014 work as in progress while every criterion is checked |
| R5-P2-001 | P2 | traceability | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:53` | The parent spec overstates phase 005 unmet requirements |
| R5-P2-002 | P2 | traceability | `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:62` | The playbook index names a superseded run as the latest |
| R6-P2-001 | P2 | maintainability | `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:18` | Benchmark run index omits the newest run folder, including the run the release note cites as its evidence |
| R6-P2-002 | P2 | maintainability | `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md:33` | The phase-014 release note misstates all three of its out-of-domain counts |
| R7-P2-001 | P2 | maintainability | `.skilled/skills/mcp-browser-use` | The hub ships no feature catalog while its predecessor hub and nine other skills do |

Each P2 carries a `findingClass`, a `scopeProof` and `affectedSurfaceHints` in its iteration delta. The two documentation-accuracy findings (R6-P2-001, R6-P2-002) are the only ones whose evidence is a count rather than a code path, and both counts were derived with a quote-aware CSV reader rather than by eye.

## 4. Remediation Workstreams

**P1 workstreams, in order.**

1. **WS-1 -- three-mode bundle reachability** (R1-P1-001). Change `hub-router.json` scoring or `router.cjs`'s tie handling so the canonical ids reach `exactBundle`. Verify by running `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "bladebro chrome devtools aside devtools"` and confirming an `orderedBundle` with all three modes.
2. **WS-2 -- admission corpus coverage** (R2-P1-001). Add the three-mode bundle case and a canonical-id case to `canary-cases.v1.json`. This is the regression pin for WS-1 and should land with it.
3. **WS-3 -- installer integrity** (R3-P1-001, R3-P2-002). Pin the Aside installer version and verify a digest before executing; add an explicit operator-yes check to both installers so D5 is enforced in code rather than in prose.
4. **WS-4 -- advisor reachability** (R4-P1-001). Widen `description.json` and the `graph-metadata.json` intent signals to the router vocabulary, then re-run the two-stage replay and confirm the out-of-domain rows still defer. This is the only workstream that needs a new recorded run to close.

**P2 advisories, separated.**

5. **WS-5 -- documentation and metadata drift** (R1-P2-002, R4-P2-002, R5-P2-001, R5-P2-002, R6-P2-001, R6-P2-002, R7-P2-001). Seven corrections, all one-line or one-row edits except R7-P2-001, which adds a `feature-catalog/feature-catalog.md` following the `mcp-tooling` shape.
6. **WS-6 -- environment override divergence** (R2-P2-002). Make `compiled-route.cjs:29` honour `SPECKIT_ACTIVATION_ROOT_OVERRIDE` the way `resolve.cjs:24` does, or document why the engine deliberately ignores it.

## 5. Spec Seed

- Amend the parent `goal.md` criterion 5 to state the three-mode bundle explicitly, so a per-mode pass cannot satisfy it. R1-P1-001 exists because the criterion is satisfiable mode by mode.
- Add a phase that owns the advisor-facing keyword surface as a first-class artifact. `description.json` is currently a 17-keyword summary maintained beside a 76-keyword router vocabulary, and nothing keeps them in step.
- Record the D7 both-stages bar in the playbook contract. `MT-H01` passes on stage two alone, which is why the packet can hold a PASS and a FAIL for one prompt.
- State whether a feature catalog is required for a hub skill. Ten skills ship one and this hub does not, and no checker decides the question either way.
- Correct the parent `spec.md:53` phase-005 status row and the two `goal.md` logs that still read "In Progress" while every criterion is checked.

## 6. Plan Seed

- **Task 1**: reproduce R1-P1-001 with the three canonical ids, then fix the scoring or the tie handling and re-run the same command to confirm an `orderedBundle`.
- **Task 2**: add the two missing canary cases and run the admission check to confirm the corpus now fails without the Task 1 fix.
- **Task 3**: replace the Aside installer's `curl | bash` with a pinned version plus a digest check, and add an operator-yes guard to both installers.
- **Task 4**: widen the advisor keyword surface, then re-run the two-stage replay and diff the out-of-domain rows against the 2026-11-24 baseline to prove no regression.
- **Task 5**: apply the seven documentation corrections and add the feature catalog.
- **Task 6**: align the activation-root override between engine and resolver, or document the divergence.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | pass | `.skilled/skills/mcp-browser-use/SKILL.md:18` | None. Criterion 2 holds, phase 005's compiled-serving claim holds (manifest and executed route agree on hash `be9b1fe7...` and generation 1), and version authority reads `1.1.2.0` in all four files. |
| `checklist_evidence` | partial | `.skilled/skills/mcp-browser-use/hub-router.json:96` | Criterion 5 holds per mode but not for a combined three-mode request (R1-P1-001), and the admission corpus never tests it (R2-P1-001). |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | notApplicable | `.skilled/skills/mcp-browser-use/SKILL.md:1` | None. The hub's `SKILL.md` names no agent contract, so there is no SKILL.md-to-agent pair to compare. |
| `agent_cross_runtime` | notApplicable | `.skilled/agents:1`, `.claude/agents:1`, `.opencode/agents:1` | None. No agent definition in the three runtime trees names the hub or any of its three modes. |
| `feature_catalog_code` | partial | `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:28` | The hub ships no `feature-catalog/` (R7-P2-001). The sibling catalog carries no stale browser-mode claim. |
| `playbook_capability` | partial | `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md:46` | Seven case files and seven index entries, so coverage is complete. `MT-H01` passes on stage two alone while the replay marks the same prompt FAIL at stage one (R4-P1-001). |

**AC_COVERAGE**: exempt. The target is a spec-folder at level 2, but `acceptance-criteria.md` is absent, so the advisory does not apply.

**Resource Map Coverage Gate**: skipped. `resource_map_present` is `false` for this packet -- no `resource-map.md` existed at init. The reducer emitted a lineage-local `resource-map.md` from the converged deltas at synthesis, but the gate's cross-check against `applied/T-*.md` has no packet map to compare against.

## 8. Deferred Items

- **R7-P2-001 (feature catalog)** is the only finding whose fix is a new artifact rather than an edit. It is advisory and does not block the verdict.
- **The maintainability dimension was sampled, not swept.** `changelog/v1.1.0.0.md`, `changelog/v1.0.0.0.md` and the three mode packets' own changelogs were not read. Those surfaces are unverified rather than clean, and a follow-up review should read them.
- **`MBU-N-12` routes after the change with `hub_confidence` 0.** It is the only one of 16 negative rows that does not defer. It passes under the report's stated rule, so it is not a defect against any shipped claim, but a front door that routes a prompt the advisor scored zero deserves a correctness read of `router.cjs`'s scoring in a future run.
- **The two agent protocols closed on a negative search.** The run never verified agent parity for this target because there was nothing to verify. If an agent definition for the hub is added later, both protocols become applicable.
- **No frontier object exists in the registry**, so there are no exhausted or blocked frontier nodes to list as follow-up review work.

### Dimension Expansion Map

- **Saturated directions**: none recorded. The reducer's `divergence.saturatedDirections` is empty.
- **Completed pivots**: none. The run never entered recovery mode; every iteration produced at least one finding or a verified-clean result.
- **Failed pivots**: none.
- **Audited overrides**: none.
- **Council artifact references**: none.
- **Selected review directions**: correctness (iterations 1, 2), security (iteration 3), traceability (iterations 4, 5), maintainability (iteration 6), cross-reference (iteration 7).
- **Remaining frontier**: none. All four dimensions and all six protocols are closed.

## 9. Search Ledger

- **searchCoverage**: `requiredBugClasses` empty, `covered` empty, `ruledOut` empty, `deferred` empty, `blocked` empty. No search-depth state was required for this run.
- **candidateCoverage**: empty.
- **searchDebt**: empty. `hasSearchDebt: false`.
- **ruledOutCandidates**: empty at the registry level. The iteration deltas carry 26 `ruled_out` rows, which the reducer folded into the strategy's Exhausted Approaches section.
- **cleanSearchProof**: the run's clean results are recorded per iteration as Confirmed-Clean Surfaces rather than as a search ledger, because the review was a file audit rather than a candidate search.

*No search-depth state captured (legacy v1 record).*

## 10. Audit Appendix

### Convergence Summary

| Iteration | Dimension | New findings | Weighted new | Cumulative weighted | Ratio |
|---|---|---|---|---|---|
| 1 | correctness | 2 (1 P1, 1 P2) | 6 | 6 | 1.0000 |
| 2 | correctness | 2 (1 P1, 1 P2) | 6 | 12 | 0.5000 |
| 3 | security | 2 (1 P1, 1 P2) | 6 | 18 | 0.3333 |
| 4 | traceability | 2 (1 P1, 1 P2) | 6 | 24 | 0.2500 |
| 5 | traceability | 2 (0 P1, 2 P2) | 2 | 26 | 0.0769 |
| 6 | maintainability | 2 (0 P1, 2 P2) | 2 | 28 | 0.0714 |
| 7 | cross-reference | 1 (0 P1, 1 P2) | 1 | 29 | 0.0345 |

Stop reason `converged`: the final ratio 0.0345 is below the 0.10 threshold, and iteration 7 was the last permitted by `maxIterations: 7`.

### Coverage Summary

- **Dimensions**: 4 of 4 covered (`correctness`, `security`, `traceability`, `maintainability`), plus the cross-reference pass.
- **Protocols**: 4 required executed (1 pass, 3 partial, 0 fail, 0 blocked), 2 overlay not applicable.
- **Files read**: 16 distinct shipped surfaces plus the packet's goal, spec and child goal files. The 507-file scope was sampled by surface, and each iteration names what it read and what it did not.

### Ruled-Out Claims

Twenty-six directions were investigated and eliminated across the run. The load-bearing ones:

- `ambiguityDelta: 1` is not too tight to ever bundle -- a three-mode prompt does return an `orderedBundle`, which is why R1-P1-001 is a scoring defect rather than a bundle-construction defect.
- `defaultMode: null` does not cause a silent default route -- `router.cjs:126-128` defers with reason `no-match`.
- `.opencode/skills` is a symlink to `../.skilled/skills` (same inode), so there is no mirror drift.
- The hub serves compiled, not legacy -- the executed route returned policy hash `be9b1fe7...` and generation 1, matching the manifest.
- The mutation-class guard covers `mcp-browser-use` -- `HOOK_PATTERN` and `DISCOVERY_GLOBS` both name it and the manifest carries a row per mode.
- The parent-skill checker passes -- exit 0, 0 warnings, hub named as subject.
- The 014 advisor scorer change works for its stated purpose -- all ten negative and negative-rb replay rows defer with hub confidence 0.
- The Bladebro installer does not run package lifecycle scripts -- `--ignore-scripts` plus digest checks.
- The Aside password boundary is not agent-reachable -- `session-management.md:50` keeps saved passwords hidden and MFA, passkeys, CAPTCHA and vault unlock human-only.
- No credentials are embedded in the hub -- the only match is a usage comment at `mcp-chrome-devtools/scripts/_utils.sh:738`.
- The global changelog tree is correct -- four symlinks into `../../skills/mcp-browser-use/`, and `mcp-tooling/` holds no browser mode.
- The 2026-11-24 replay report is complete -- `README.md`, `results.csv`, `skill-benchmark-report.json` and `source.md` all present; only its index row is missing.

### Sources Reviewed

Packet: `goal.md`, `spec.md`, `decision-record.md`, and the 14 child phase folders' `goal.md` and `spec.md` files.

Hub: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-scopes.json`, `description.json`, `graph-metadata.json`, `shared/README.md`, `changelog/v1.1.1.0.md`, `changelog/v1.1.2.0.md`, `benchmark/reports/README.md`, `benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/{README.md,results.csv}`, `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/hub-routing/holdout-browser-inspect.md`.

Modes: `mcp-aside-devtools/scripts/install.sh`, `mcp-bladebro/scripts/install.sh`, `mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`, `mcp-chrome-devtools/scripts/_utils.sh`.

Engine: `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-route-layout.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/{router.cjs,registry-compiler.cjs}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/{fixtures/canary-cases.v1.json,harness/build-artifacts.cjs}`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{resolve.cjs,compiled-route.cjs}`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`.

Cross-skill: `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md,feature-catalog/feature-catalog.md}`, `.skilled/skills/system-skill-advisor/`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/changelog/mcp-browser-use/`, `.skilled/changelog/mcp-tooling/`, `.skilled/agents/`, `.claude/agents/`, `.opencode/agents/`.

### Cross-Reference Appendix

**Core Protocols**: `spec_code` pass; `checklist_evidence` partial.

**Overlay Protocols**: `skill_agent` notApplicable; `agent_cross_runtime` notApplicable; `feature_catalog_code` partial; `playbook_capability` partial.

---

**Release readiness**: `converged`. No active P0, the stop reason is `converged`, and the verdict is CONDITIONAL. Promotion is blocked by the four active P1 findings, so the next step is `/speckit:plan` over the six workstreams above, not `/create:changelog`.
