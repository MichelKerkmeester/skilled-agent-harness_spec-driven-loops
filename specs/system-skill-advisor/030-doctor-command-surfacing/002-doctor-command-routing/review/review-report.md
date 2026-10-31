# Deep Review Report: v4.0.0.12 Doctor-Command Routing

Packet: `specs/system-skill-advisor/035-doctor-command-routing`
Run: fan-out `1792125949812-grdnrc`, two lineages, `stopPolicy=max-iterations`, `maxIterations=5` each
Review target: the shipped v4.0.0.12 work (advisor routing to the doctor commands, the `/doctor:setup` hint in Claude, Pi and OpenCode, and the new `/doctor:setup` command), with the explicit file scope in `lineages/*/steer.md`

---

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (9 active P2 findings)
- **Counts (active, merged):** P0 = 0, P1 = 0, P2 = 9
- **Lineages:** `luna-max-fast` (cli-codex, gpt-6-luna, max, fast) completed 5 of 5 iterations; `deepseek-max` (cli-pi, deepseek-v4.1-flash, max) completed 5 of 5. Both stopped on `maxIterationsReached`.
- **Lineage verdicts:** deepseek-max PASS. luna-max-fast closed CONDITIONAL on severity-clean findings because one probe stayed blocked (search debt SL-009). The orchestrator ran that probe at synthesis and it passed, so the debt is closed and the merged verdict is PASS. See section 9.
- **Review scope:** advisor code, the `/doctor:setup` command and its five runtime mirrors, the advisor skill docs, the cross-repo references and root README, and the three changelogs.
- **Fix first:** R2-P2-001. On every runtime except Claude Code, a healthy install shows a failing sk-git leg in `/doctor:setup`, and the repair it names cannot clear it.

---

## 2. Planning Trigger

`/speckit:plan` is **not required**. The verdict is PASS and every active finding is a P2 advisory. The advisories can go into the next maintenance packet.

```json
{
  "Planning Packet": true,
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"R2-P2-001","lineage":"deepseek-max","severity":"P2","title":"Umbrella sk-git leg fails on runtimes the battery cannot identify; the named repair cannot clear it","dimension":"correctness","file":".skilled/commands/doctor/assets/doctor-setup.yaml:53"},
    {"id":"P2-001","lineage":"luna-max-fast","severity":"P2","title":"Quoted doctor-command text bypasses skill-first ordering","dimension":"correctness","file":".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679"},
    {"id":"P2-002","lineage":"luna-max-fast","severity":"P2","title":"Generic check wording advertises setup on unrelated no-match prompts","dimension":"correctness","file":".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51"},
    {"id":"P2-003","lineage":"luna-max-fast","severity":"P2","title":"Doctor phrase reach can report stale scorer behavior as current","dimension":"correctness","file":".skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264"},
    {"id":"P2-008","lineage":"luna-max-fast","severity":"P2","title":"DOC-391's write-free claim misses a socket-directory creation","dimension":"correctness","file":".skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16"},
    {"id":"P2-004","lineage":"luna-max-fast","severity":"P2","title":"Doctor-routing scenarios omit their required feature-catalog backlink","dimension":"maintainability","file":".skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94"},
    {"id":"P2-006","lineage":"luna-max-fast","severity":"P2","title":"Feature catalog lists an OpenCode hook capability without a feature page","dimension":"traceability","file":".skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126"},
    {"id":"P2-007","lineage":"luna-max-fast","severity":"P2","title":"Root README understates the command catalog by two entries","dimension":"traceability","file":"README.md:1074"},
    {"id":"R4-P2-001","lineage":"deepseek-max","severity":"P2","title":"Fleet-wide DOC-number registry omits DOC-385..DOC-391 and /doctor:setup","dimension":"traceability","file":".skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26"}
  ],
  "remediationWorkstreams": [
    {"name":"Umbrella leg attribution","findingIds":["R2-P2-001"]},
    {"name":"Advisor routing and probe accuracy","findingIds":["P2-001","P2-002","P2-003"]},
    {"name":"Setup side-effect claim","findingIds":["P2-008"]},
    {"name":"Catalog, registry and README traceability","findingIds":["P2-004","P2-006","P2-007","R4-P2-001"]}
  ],
  "specSeed": [
    "State whether an unattributable doctor check (UNKNOWN) is reported as SKIP or FAIL in the umbrella, and make the umbrella and /doctor:git setup agree.",
    "Separate a directly typed doctor command from quoted command text in the scorer.",
    "Require setup or tooling-health context before the no-match fallback adds the /doctor:setup hint.",
    "Make the phrase-reach probe reject or flag a stale built scorer.",
    "Describe the /tmp socket-directory creation in DOC-391 and the read-only claims."
  ],
  "planSeed": [
    "Pass --tool=<runtime> to git-setup-check.cjs in doctor-setup.yaml, as _routes.yaml:285 says the workflow does.",
    "Add quoted-command and unrelated-check cases to the doctor routing tests.",
    "Add a freshness check to doctor-phrase-reach.cjs.",
    "Add feature-catalog backlinks to DOC-385..DOC-391 and an OpenCode hook feature leaf.",
    "Correct the README command totals at README.md:80 and README.md:1074.",
    "Add DOC-385..DOC-391 and /doctor:setup to the spec-kit doctor-commands registry README."
  ],
  "findingClasses": ["instance-only","routing-disambiguation","fallback-intent-qualification","stale-build-probe","side-effect-accuracy","documentation-traceability","catalog-leaf-coverage","command-catalog-count-drift"],
  "affectedSurfacesSeed": [".skilled/commands/doctor/","system-skill-advisor runtime scorer and hooks","system-skill-advisor playbook and feature catalog","system-spec-kit doctor-commands playbook README","README.md"],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

### R2-P2-001: Umbrella sk-git leg fails on runtimes the battery cannot identify

- **Severity:** P2 | **Dimension:** correctness | **Lineage:** deepseek-max | **Disposition:** active
- **Location:** `.skilled/commands/doctor/assets/doctor-setup.yaml:53`
- **Evidence:** the umbrella runs `git-setup-check.cjs` with no `--tool` and maps any non-zero exit to FAIL. The battery's `ai-tool-hooks` check detects only `CLAUDECODE` (`git-setup-check.cjs:867`) and otherwise returns UNKNOWN, exit 3. `_routes.yaml:285` says the workflow adds `--tool=<name>`; the umbrella does not. Orchestrator re-run at synthesis, `CLAUDECODE` unset: `STATUS=DEGRADED ... unknown=1`, exit 3.
- **Impact:** on OpenCode, Pi, Codex, Cursor, Devin and Hermes, a healthy install shows a failing sk-git leg, and running the named repair does not change the next umbrella result.
- **Fix:** pass `--tool=<runtime>`, or add an UNKNOWN or SKIP result to the presentation contract.
- **findingClass:** instance-only | **scopeProof:** two callers of the battery exist; only the umbrella omits `--tool`.
- **Severity note:** filed as P2 by its lineage because DOC-391:65 records the exit-3-is-FAIL mapping as deliberate. It is the strongest P1 candidate in this run.

### P2-001: Quoted doctor-command text bypasses skill-first ordering

- **Severity:** P2 | **Dimension:** correctness | **Lineage:** luna-max-fast
- **Location:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679`
- **Evidence and impact:** a raw `/doctor:` substring skips the skill-first reorder, so a prompt that quotes `/doctor:setup` can rank a matching skill below the doctor bridge.
- **Fix:** tell a direct slash-command invocation apart from a quoted reference.

### P2-002: Generic check wording advertises setup on unrelated no-match prompts

- **Severity:** P2 | **Dimension:** correctness | **Lineage:** luna-max-fast
- **Location:** `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51`
- **Evidence and impact:** the setup predicate accepts a standalone "check" inflection, and the no-match renderer then adds `/doctor:setup`. "Check what time the tide turns" gets a tooling setup hint. The same predicate drives the Pi and OpenCode fallbacks.
- **Fix:** require setup, environment, installation or tooling-health context alongside the check verb.

### P2-003: Doctor phrase reach can report stale scorer behavior as current

- **Severity:** P2 | **Dimension:** correctness | **Lineage:** luna-max-fast
- **Location:** `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264`
- **Evidence and impact:** the probe checks that the built scorer exists but not that it matches source, so a stale build can report a phrase as reachable after the source changed.
- **Fix:** check source and build freshness, or report the result as indeterminate when the build is stale.

### P2-008: DOC-391's write-free claim misses a socket-directory creation

- **Severity:** P2 | **Dimension:** correctness | **Lineage:** luna-max-fast
- **Location:** `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16`
- **Evidence and impact:** the advisor CLI shim calls `ensureSocketDir()` at startup, which creates `/tmp/system-skill-advisor` when absent. The scenario's repo-status comparison cannot see that write. `--warm-only` does not start the daemon or write its lease database (P2-005, which claimed it did, was disproved and resolved in iteration 5).
- **Fix:** document and assert the `/tmp` effect, or create the directory only in modes that start or attach to the daemon.

### P2-004: Doctor-routing scenarios omit their feature-catalog backlink

- **Severity:** P2 | **Dimension:** maintainability (standards conformance) | **Lineage:** luna-max-fast
- **Location:** `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94`, and DOC-385 to DOC-391 alike
- **Evidence and impact:** the scenarios link to the playbook and the sources but not to `feature-catalog/scorer-fusion/doctor-command-routing.md`, which the playbook authoring contract requires. A reader cannot follow a scenario to its behavior contract.
- **Fix:** add the backlink to each scenario.

### P2-006: Feature catalog lists an OpenCode hook capability without a feature page

- **Severity:** P2 | **Dimension:** traceability | **Lineage:** luna-max-fast
- **Location:** `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126`
- **Evidence and impact:** the root catalog lists native OpenCode SessionStart and UserPromptSubmit hooks with a prompt-wrapper fallback and states there is no feature page. The catalog contract requires a leaf per entry.
- **Fix:** add the leaf, or merge or remove the row.

### P2-007: Root README understates the command catalog by two entries

- **Severity:** P2 | **Dimension:** traceability | **Lineage:** luna-max-fast
- **Location:** `README.md:1074`, repeated at `README.md:80`
- **Evidence and impact:** the README says 37 commands; the command catalog checker and the command index report 39.
- **Fix:** update both totals and the group breakdown.

### R4-P2-001: Fleet-wide DOC-number registry omits DOC-385..DOC-391 and `/doctor:setup`

- **Severity:** P2 | **Dimension:** traceability | **Lineage:** deepseek-max
- **Location:** `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26`
- **Evidence and impact:** four sibling doctor READMEs name this file as the shared DOC-number registry, and it has no mention of DOC-385 to DOC-391 or `/doctor:setup`. A maintainer allocating the next number can reuse 385. The peer `category-overview.md` was updated.
- **Fix:** extend the `/doctor:skill-advisor` entry to name `/doctor:setup` and DOC-385 to DOC-391.

### Resolved

- **P2-005** (luna-max-fast): the cold-start lease-write claim was disproved in iteration 5; `--warm-only` returns a retryable error before any spawn. Superseded by P2-008.

---

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** none.
- **P2 advisories:**
  1. Umbrella leg attribution: R2-P2-001. One YAML line plus presentation wording.
  2. Advisor routing and probe accuracy: P2-001, P2-002, P2-003.
  3. Setup side-effect claim: P2-008.
  4. Catalog, registry and README traceability: P2-004, P2-006, P2-007, R4-P2-001.

---

## 5. Spec Seed

- The doctor leg result vocabulary states how an unattributable check is reported, so the umbrella and `/doctor:git setup` agree on what a healthy install prints.
- Doctor routing distinguishes a typed command from quoted command text.
- The setup hint fires only on setup or tooling-health context.
- Any new doctor scenario updates the shared DOC-number registry in the same change.

---

## 6. Plan Seed

- Add `--tool=<runtime>` to the sk-git leg in `doctor-setup.yaml:53` and recheck DOC-391:65.
- Add test rows for a quoted `/doctor:setup` and for "check" prompts with no tooling context.
- Add a stale-build check to `doctor-phrase-reach.cjs`.
- Add backlinks to DOC-385..DOC-391, an OpenCode hook feature leaf, the README totals, and the registry entry.

---

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|---|---|---|
| spec_code | pass | Both lineages traced REQ items to the advisor code and the command; deepseek iteration 1 maps REQ-011 and REQ-012. |
| checklist_evidence | pass, advisory | The packet is Level 2 and complete; no checklist contradiction was filed. |

**Overlay protocols**

| Protocol | Status | Evidence |
|---|---|---|
| skill_agent | pass | No drift filed between the advisor SKILL.md and its hooks. |
| agent_cross_runtime | pass | The five `/doctor:setup` runtime mirrors match their source; the mirror and catalog checks passed in deepseek iteration 2. |
| feature_catalog_code | advisory | P2-006 (missing leaf). |
| playbook_capability | advisory | P2-004 (backlinks), P2-008 (side effect), R4-P2-001 (registry). Deepseek ran six of seven new scenarios as written and all passed. |

**AC_COVERAGE:** exempt for this verdict; the advisory signal does not change the verdict.

---

## 8. Deferred Items

- Severity review of R2-P2-001 as a possible P1, at the operator's discretion.
- The `luna-max-fast` lineage config sets `resource_map.emit=false`, so only `lineages/deepseek-max/resource-map.md` exists. No root resource map was emitted: the root reducer has no root state log under fan-out (`reduce-state.cjs` exit 3, ENOENT on `review/deep-review-state.jsonl`).

---

## Dimension Expansion Map

- Saturated directions: none recorded at the root; each lineage covered the five steer scope groups in order.
- Pivots: none. Council artifacts: none.
- Remaining frontier: runtime behavior of the hooks under live Pi and OpenCode sessions (static and probe evidence only).

---

## 9. Search Ledger

- **luna-max-fast:** 9 ruled-out candidates, 9 clean-search proofs, 1 search-debt item (SL-009: `doctor-phrase-reach.cjs` not executed, to keep writes inside the lineage).
- **deepseek-max:** no search debt; ran `doctor-phrase-reach.cjs` in iteration 1 (`evidence/iter-001-doctor-phrase-reach.txt`).
- **Orchestrator closure of SL-009:** `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` run at synthesis with `TMPDIR` in the session scratchpad: `STATUS=OK phrases=82 bridges=15`, exit 0, and `git status` showed no repo write.
- **hasSearchDebt: false** after closure.

---

## 10. Audit Appendix

**Convergence:** luna-max-fast score 0.8571, deepseek-max 1.0; both telemetry-only under `stopPolicy=max-iterations`. Terminal records carry `stopReason: maxIterationsReached`.

**Coverage:** correctness, traceability and maintainability (standards conformance) covered in both lineages; security secondary per steer, none filed.

**Route proof:** all 10 iteration state records carry `mode: review`, `target_agent: deep-review`, `agent_definition_loaded: true` and `resolved_route: "Resolved route: mode=review target_agent=deep-review"`.

**Containment:** both lineages ended `completed` with a containment advisory. Every flagged path belongs to the parallel review in `specs/sk-git/033-git-setup-customization/006-release-conformance-review/`; preserve mode copied them to quarantine and left them in place.

**Synthesis closeout:** `synthesis-closeout.cjs` exited 0 and the gateway recorded `synthesis_incomplete` (reason `synthesis_artifact_invariant_failed`, invariant `structured_state_findings_partially_reflected_in_registry`). Cause: the iteration records carry earlier findings forward, so 28 finding groups across 10 records map onto 10 deduplicated registry entries. `missingStructuredFindingCount` is 0, so every finding in the state records is in the registry. The count check compares group totals rather than distinct keys, which fails on any lineage that re-lists carried findings.

**Cross-reference appendix**

- Core Protocols: spec_code, checklist_evidence (section 7).
- Overlay Protocols: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability (section 7).

**Sources:** `lineages/luna-max-fast/review-report.md`, `lineages/deepseek-max/review-report.md`, `deep-review-findings-registry.json` (merged), `fanout-attribution.md`, `orchestration-summary.json`.
