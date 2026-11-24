# Deep Review Report: mcp-browser-use hub epic (lineage vibe-2)

> `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` · review lineage `vibe-2` · session `fanout-vibe-2-1795511024070-2cuwlj` · generation 1 · lineageMode `new`

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** Eleven findings are active: 0 P0, 4 P1, 7 P2. No P0 exists, so the verdict is not FAIL; four P1 findings remain, so it is not PASS.
- **Stop reason: `maxIterationsReached`.** The run used all 7 iterations. Convergence did not fire: the rolling average over iterations 5 to 7 was 0.0, but the dimension-coverage gate stayed closed on `traceabilityCovered: false` with `unfinishedCoreProtocols: ["spec_code","checklist_evidence"]`, which cannot pass while P1 findings are open. Release-readiness state is `in-progress`, not `converged`.
- **Dimensions covered: 4 of 4.** correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4), plus two cross-reference passes (iterations 5 and 7) and a P1 verification pass (iteration 6).
- **Operator focus addressed.** Every iteration checked shipped work against its phase goal criteria. All fifteen phase `goal.md` files carry zero unchecked criteria, the phase 015 canary case and 52-row replay hold, and the advisor 2.0.3.0 id-noun change was verified live at both ends: "staging site" still reaches the hub at 0.82, and the re-pinned doctor control row routes nowhere.
- **What the run found.** The hub's routing contract is sound for the all-id form and unsound for the mixed id/alias form; the hub's own front-door instruction is shell-unsafe for realistic browser tasks; the hub README declares a release that has no changelog; and the Aside feature catalog still documents the install path that phase 015 decision D2 closed.
- **What the run cleared.** The parent-skill checker, the `.opencode` mirror parity, the leaf manifest, the benchmark report indexes, the hub layout block, the mode packet layouts, the phase 008 run counts, the advisor id-noun rule, the routing vocabulary, the installer's fail-closed behaviour and the capture example's guards all held under direct test.

---

## 2. Findings by Severity

### P0 Findings

None.

### P1 Findings

| # | Finding | Evidence | Raised | Re-read |
|---|---------|----------|--------|---------|
| 1 | Mixed id and alias forms drop a named mode from the bundle | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:88` | 1 | 6 |
| 2 | The hub front-door instruction splices the user task into a double-quoted shell argument | `.skilled/skills/mcp-browser-use/SKILL.md:62` | 2 | 6 |
| 3 | The hub README declares a release that has no changelog entry | `.skilled/skills/mcp-browser-use/README.md:8` | 3 | 6 |
| 4 | The Aside feature catalog still offers the unpinned curl-to-bash install | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24` | 2 | 6 |

**P1-1.** `scoreModes` counts distinct fold-deduped keywords times the mode weight, and `selectNearTiedModes` keeps every mode within `ambiguityDelta` of the top score. `mcp-chrome-devtools` folds to two keyword hits (8) while the short alias `bladebro` gives one (4), so a gap of 4 against a delta of 1 drops Bladebro. Live: `--prompt "use mcp-chrome-devtools and bladebro"` returns `single` with one target; `--prompt "use mcp-chrome-devtools and mcp-bladebro"` returns `orderedBundle` with both. This contradicts `hub-router.json`'s `routerPolicy.outcomes.orderedBundle`.

**P1-2.** Both `SKILL.md:62` and `ROUTER.md:105` tell the agent to run `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"`. A browser task routinely quotes on-screen text. Run literally, `--prompt "click the "Sign in" button in chrome devtools"` returns `{"action":"defer","selectionKind":null,"targets":[]}`, and a task containing `$(whoami)` has the substitution executed in the caller's shell before the CLI sees it. The same text passed as one argv element routes correctly to `mcp-chrome-devtools`, which isolates the defect to the documented form. `compiled-route.cjs:43` documents `--prompt-stdin` for exactly this case, and neither hub doc mentions it.

**P1-3.** `README.md:8` declares `version: 1.1.4.0` while `mode-registry.json:3`, `hub-router.json:3`, `SKILL.md:6` and `description.json` all say `1.1.3.0`, and the newest changelog is `v1.1.3.0.md`. The invariant is stated at `SKILL.md:18` and repeated at `README.md:66`.

**P1-4.** The feature catalog reads "Install with `curl -fsSL https://releases.aside.com/install.sh | bash` or the packaged wrapper `bash scripts/install.sh`", with no deprecation marker. Phase 015 decision D2 states the installer runs only a script matching a pinned sha256, and `install.sh:14` implements that. An agent reading the capability reference rather than the wrapper bypasses the pin.

### P2 Findings

| # | Finding | Evidence | Raised | Re-read |
|---|---------|----------|--------|---------|
| 1 | `selectionKinds` cannot express the bundle kind the compiler can emit | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:263` | 1 | 7 |
| 2 | `ROUTER.md` calls itself the single machine-readable projection while a second one is live | `.skilled/skills/mcp-browser-use/ROUTER.md:53` | 1 | 7 |
| 3 | The installer pin covers the script but not the archive, and the archive source is env-overridable | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:14` | 2 | 7 |
| 4 | The phase 006 log records the older, greener Chrome DevTools run as the mode playbook evidence | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md:49` | 3 | 7 |
| 5 | Two of three mode READMEs carry a version behind their own SKILL.md and newest changelog | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md:1` | 4 | 7 |
| 6 | The parent goal's BINDING table stops at phase 014 while the packet ships a fifteenth phase | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:70` | 5 | 7 |
| 7 | The parent goal cites a review report path that no longer resolves | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:129` | 5 | 7 |

---

## 3. Traceability Status

### Core protocols

| Protocol | Status | Basis |
|----------|--------|-------|
| `spec_code` | partial | Phase 015's four claimed fixes are present at source, but the bundle claim fails for the mixed id/alias form (P1-1), the hub version-authority invariant is broken (P1-3), `selectionKinds` cannot express `surfaceBundle` (P2-1), `ROUTER.md` declares four intent signals against three `routerSignals` (P2-2), and two mode READMEs are behind their own SKILL.md (P2-5). |
| `checklist_evidence` | partial | The canary corpus and the 52-row replay do not cover the mixed id/alias path (P1-1); phase 006 cites a superseded Chrome DevTools run (P2-4); the parent goal's own evidence row cites a path that does not resolve (P2-7). |

### Overlay protocols

| Protocol | Status | Basis |
|----------|--------|-------|
| `skill_agent` | pass | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and names the hub; PASS on 3b, 3d-name and 3d-alias with 20 unique aliases. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | The Aside install catalog documents an unpinned path that decision D2 forbids (P1-4). |
| `playbook_capability` | pass | All three modes carry a playbook with a recorded run, including the Bladebro macOS live run. |

---

## 4. Completion Criteria, Checked

| Criterion | State | Evidence |
|-----------|-------|----------|
| 001-research holds at least 10 iteration records and `research.md` | Met | 12 iteration records in `001-research/research/deep-research-state.jsonl` |
| The hub registry lists three modes and `mcp-tooling` lists six | Met | `mode-registry.json` in both skills |
| No `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` id survives | Met | `rg` under `.skilled` excluding changelog and benchmark/reports returns no match; the five named `mcp-tooling` files are clean |
| The parent-skill checker exits 0 and names the hub | Met | Direct run, exit 0 |
| One real browser request per mode reaches the hub and its mode | Met | Replay rows MBU-R-01 to MBU-R-03 plus the phase 006 and 008 live runs |
| Each mode has a playbook with a recorded run, Bladebro macOS live included | Met | Three playbook trees with recorded runs; the 2026-11-22 Bladebro report records macOS arm64 with Bladebro v4.8.2 |
| `validate.sh --strict --recursive` prints RESULT: PASSED | Not re-run | Forbidden by this lineage's write surface; stands on the recorded evidence in each child's implementation summary |

---

## 5. Audit Appendix

### Iterations

| Iteration | Dimension | New findings | Ratio | Verdict |
|-----------|-----------|--------------|-------|---------|
| 1 | correctness | 1 P1, 2 P2 | 1.0 | CONDITIONAL |
| 2 | security | 2 P1, 1 P2 | 1.0 | CONDITIONAL |
| 3 | traceability | 1 P1, 1 P2 | 1.0 | CONDITIONAL |
| 4 | maintainability | 1 P2 | 1.0 | CONDITIONAL |
| 5 | cross-reference | 2 P2 | 1.0 | CONDITIONAL |
| 6 | cross-reference (P1 verification) | none | 0.0 | CONDITIONAL |
| 7 | cross-reference (P2 carry-forward) | none | 0.0 | CONDITIONAL |

The ratio uses the iteration-local denominator this run applied from iteration 1. Against the accumulated corpus the run's 11 findings total 27 weighted points (4 P1 at 5, 7 P2 at 1), and iterations 5, 6 and 7 added 2, 0 and 0 of those.

### Convergence

| Signal | Value | Threshold | Stop |
|--------|-------|-----------|------|
| `rollingAverage` | 0 | 0.1 | true |
| `madNoiseFloor` | 0 | — | true |
| `dimensionCoverage` | 1 | 1 | false |

Gates: `convergenceGate` pass, `dimensionCoverageGate` fail, `p0ResolutionGate` pass, `evidenceDensityGate` pass, `hotspotSaturationGate` fail, `claimAdjudicationGate` pass, `fixCompletenessReplayGate` pass, `candidateCoverageGate` skipped, `graphlessFallbackGate` skipped. Blocked by `dimensionCoverageGate` and `hotspotSaturationGate`; the decision is `STOP` on `maxIterationsReached`.

### Files written by this lineage

- `iterations/iteration-001.md` through `iteration-007.md`
- `deltas/iter-001.jsonl` through `iter-007.jsonl`
- `deep-review-strategy.md` (edited in place)
- `review-report.md` (this file)
- Gateway and reducer outputs: `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`

No file outside `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2` was created, modified or deleted. No review target file, config, registry, reducer output, dashboard, report, command, skill, canonical agent or runtime mirror was written by this lineage.

### Verification limits

- `validate.sh --strict --recursive` was not executed: the dispatch forbids it.
- The hub canary harness (`build-artifacts.cjs`) was not executed: it writes build artifacts outside this lineage's write surface. The phase 015 harness evidence stands on `tasks.md:50` as recorded.
- `generate-context.js` was not executed: the dispatch forbids it.
- The review sampled 522 scope files by phase goal and by the surfaces each goal names. Files not read are recorded as deferred in the iteration narratives, not as clean.

---

Review verdict: CONDITIONAL
