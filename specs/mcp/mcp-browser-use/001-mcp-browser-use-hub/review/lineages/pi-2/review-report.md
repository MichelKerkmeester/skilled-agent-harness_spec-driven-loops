# Review Report - mcp-browser-use hub (lineage pi-2)

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (PASS with 4 active P2 advisories)
- **Findings by severity, the counts the verdict used: P0 0, P1 0, P2 4**
- **Self-check outcomes:** every finding was put through claim adjudication with an alternative explanation and a downgrade trigger. No finding was downgraded or called false positive at synthesis; two candidate findings were reclassified during review (the documented `reject` outcome in iteration 1 was ruled round-trippable, and the adapter-stream edge case in iteration 2 was judged prevented by the MCP stdio EOF contract), and one earlier README observation was narrowed to the changelog rows because phase 015 recorded a ruling on the version line.
- **Review scope:** the pre-bound 522-file scope, reviewed across five iterations covering the hub's routing tables and compiled front door (D1 correctness), its install/doctor and hook mutation surfaces (D2 security), phase 015 plus the epic goal criteria and the advisor 2.0.3.0 change (D3 traceability), and the hub's own doc, version, index and cross-reference consistency (D4 maintainability).
- **Operator review focus:** every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change.

All four review dimensions are covered, all nine legal-stop gates pass, the graph decision is STOP_ALLOWED, and the three terminal gates (evidence, scope, coverage) pass at stop reason `converged`.

## 2. Planning Trigger

`/speckit:plan` is required only for the four P2 advisories below. They are documentation repairs in two files; no behavioural defect was found.

```json
{
  "triggered": true,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    { "id": "PI2-D1-P2-001", "severity": "P2", "title": "Reject outcome documented as reachable from the compiled front door, but the CLI cannot pass the constraint that produces it", "file": ".skilled/skills/mcp-browser-use/SKILL.md:62", "dimension": "correctness", "findingClass": "doc_behavior_mismatch" },
    { "id": "PI2-D2-P2-001", "severity": "P2", "title": "Chrome DevTools installer verifies its pinned CLI by version only, with no content digest, unlike the Bladebro installer", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30", "dimension": "security", "findingClass": "supply_chain_verification_gap" },
    { "id": "PI2-D3-P2-001", "severity": "P2", "title": "The hub README changelog table links three of the five release files", "file": ".skilled/skills/mcp-browser-use/README.md:70", "dimension": "traceability", "findingClass": "doc_index_drift" },
    { "id": "PI2-D4-P2-001", "severity": "P2", "title": "The README changelog section states a per-entry files-changed list that none of the five entries contains", "file": ".skilled/skills/mcp-browser-use/README.md:66", "dimension": "maintainability", "findingClass": "doc_format_misstatement" }
  ],
  "remediationWorkstreams": [
    { "order": 1, "id": "WS-1", "title": "Correct the hub README changelog section", "covers": ["PI2-D3-P2-001", "PI2-D4-P2-001"], "files": [".skilled/skills/mcp-browser-use/README.md"] },
    { "order": 2, "id": "WS-2", "title": "Make the documented routing outcomes match the compiled front door", "covers": ["PI2-D1-P2-001"], "files": [".skilled/skills/mcp-browser-use/SKILL.md", ".skilled/skills/mcp-browser-use/ROUTER.md"] },
    { "order": 3, "id": "WS-3", "title": "Give the Chrome DevTools installer the digest check its sibling has", "covers": ["PI2-D2-P2-001"], "files": [".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh", ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md"] }
  ],
  "specSeed": [
    "One packet-level change: bring the hub's shipped docs in line with what the compiled front door and the installers actually do.",
    "Scope the README changelog section (rows and format sentence), the documented `reject` outcome in SKILL.md and ROUTER.md, and the Chrome installer's verification step.",
    "No behavioural change outside the installer's verification step; no version bump is required by any of the three workstreams beyond the doc-version gate."
  ],
  "planSeed": [
    "WS-1: add the 1.1.2.0 and 1.1.3.0 rows to README section 4, and either reword the format sentence or add the files-changed list it promises.",
    "WS-2: either document `reject` as an in-process outcome that the CLI cannot reach, or give `compiled-route.cjs` a constraints input; pick one and make SKILL.md and ROUTER.md say it.",
    "WS-3: record the `browser-debugger-cli@0.6.10` tarball digest, verify it after install the way the Bladebro installer does, and note the check in INSTALL-GUIDE."
  ],
  "findingClasses": ["doc_behavior_mismatch", "supply_chain_verification_gap", "doc_index_drift", "doc_format_misstatement"],
  "affectedSurfacesSeed": [
    ".skilled/skills/mcp-browser-use/README.md",
    ".skilled/skills/mcp-browser-use/SKILL.md",
    ".skilled/skills/mcp-browser-use/ROUTER.md",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### PI2-D1-P2-001 - documented `reject` outcome is unreachable from the compiled CLI

- Severity: P2. Dimension: correctness. Finding class: doc_behavior_mismatch.
- File: `.skilled/skills/mcp-browser-use/SKILL.md:62`, restated at `ROUTER.md:107`.
- Evidence: `compiled-route.cjs` accepts only `--hub`, `--prompt`, `--prompt-stdin` and `--surface-hint` (takesValue list at line 30, usage at 37 and 52), and neither it nor `resolve.cjs` passes routing constraints; `router.cjs` emits `reject` only from `input.constraints`. A prompt containing "forbidden" stays routable.
- Impact: a reader who follows the hub docs prepares for an outcome the front door cannot produce; the documented contract and the shipped tool disagree.
- Fix recommendation: either document `reject` as an in-process outcome reachable only through the policy-card replay path, or add a constraints input to the front door.
- Disposition: active. Scope proof: both files are inside the pre-bound scope. Affected surfaces: hub SKILL.md, ROUTER.md, `.skilled/bin/compiled-route.cjs`.
- Confidence 0.82. Downgrade trigger: a documented hub caller that passes constraints.

### PI2-D2-P2-001 - Chrome installer verifies by version only

- Severity: P2. Dimension: security. Finding class: supply_chain_verification_gap.
- File: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30`, install at line 233.
- Evidence: the installer pins `browser-debugger-cli@0.6.10` and runs `npm install -g "${MCP_PACKAGE}"` with npm's registry hash as the only integrity signal. The Bladebro installer in the same hub pins `4.8.2`, installs with `--ignore-scripts`, verifies four recorded SHA-256 values and removes the install on mismatch. The mutation-class manifest claims digest checking for Bladebro alone, so no doc overstates the Chrome check.
- Impact: a registry-side substitution of the pinned tarball installs unverified code, while the same substitution against Bladebro is caught.
- Fix recommendation: record the tarball digest, verify after install, remove on mismatch, and document it in INSTALL-GUIDE.
- Disposition: active. Scope proof: installer and manifest row are in scope. Affected surfaces: Chrome installer, INSTALL-GUIDE, Bladebro installer as the reference pattern.
- Confidence 0.7. Downgrade trigger: stays P2 while the only attack is registry compromise.

### PI2-D3-P2-001 - README changelog table links three of five release files

- Severity: P2. Dimension: traceability. Finding class: doc_index_drift.
- File: `.skilled/skills/mcp-browser-use/README.md:70`.
- Evidence: README section 4 lists 1.1.1.0, 1.1.0.0 and 1.0.0.0 while `changelog/` holds five files including `v1.1.2.0.md` and `v1.1.3.0.md`. Phase 015's out-of-scope ruling covers the README's own version line, not the table.
- Impact: a reader on 1.1.3.0 cannot reach what changed since 1.1.1.0 from the index that says it lists one file per release.
- Fix recommendation: add the two rows.
- Disposition: active. Scope proof: README is in scope, changelog sits under the same skill root. Affected surfaces: README, changelog directory.
- Confidence 0.85. Downgrade trigger: a statement that the table is a partial index.

### PI2-D4-P2-001 - README format sentence describes a list no entry has

- Severity: P2. Dimension: maintainability. Finding class: doc_format_misstatement.
- File: `.skilled/skills/mcp-browser-use/README.md:66` (the registry's `line` field points at the section's table header, line 68).
- Evidence: the section says each entry "lists what changed and the files changed"; no entry among the five contains a files-changed list (0 matches for files-changed markers and headings across all five).
- Impact: the next author follows a format no sibling release uses, and readers look for a list that was never written.
- Fix recommendation: reword the sentence to the format the entries use, or add the list and backfill it.
- Disposition: active. Scope proof: README and changelog are in scope. Affected surfaces: README, changelog directory.
- Confidence 0.8. Downgrade trigger: the sentence reworded or the lists added.

## 4. Remediation Workstreams

**P0:** none.

**P1:** none.

**P2 advisories, in fix order:**

1. **WS-1 - README changelog section (PI2-D3-P2-001, PI2-D4-P2-001).** One edit closes both: rows for 1.1.2.0 and 1.1.3.0, and a format sentence that describes the entries as they are. Lowest risk, highest reader value.
2. **WS-2 - routing outcome contract (PI2-D1-P2-001).** Decide whether `reject` is a CLI outcome or an in-process one, then make SKILL.md and ROUTER.md agree with the answer. Row-level change plus one doc sentence; no behaviour change if the in-process answer is chosen.
3. **WS-3 - Chrome installer digest (PI2-D2-P2-001).** Mirror the Bladebro pattern: record the tarball digest, verify after install, remove on mismatch, and say so in INSTALL-GUIDE. This is the only workstream that touches an executed script, so it carries the only behavioural risk.

## 5. Spec Seed

- The packet-level change is doc-versus-shipped-work alignment for the hub, with one installer hardening.
- In scope: README section 4, the `reject` documentation in SKILL.md and ROUTER.md, and the Chrome installer verification step plus its guide sentence.
- Out of scope: the shared 0.45 lexical anchor, the `@latest` install-guide convention across three packets, the 006 status drift, and the README version line, all of which earlier phases recorded rulings on.

## 6. Plan Seed

- T1: README section 4 - add 1.1.2.0 and 1.1.3.0 rows; reword or fulfil the files-changed promise. Verify: `grep -c 'changelog/v' README.md` is at least 5 and the sentence matches the entries.
- T2: decide the `reject` contract; edit SKILL.md:62 and ROUTER.md:107 accordingly. Verify: the doc names only outcomes the named caller can produce.
- T3: Chrome installer - record and verify the pinned tarball digest. Verify: `node --test .skilled/bin/tests/mcp-installers.test.cjs` still passes 5 of 5, and a mismatched digest removes the install.
- T4: run the hub's own gates after the edits: `parent-skill-check.cjs`, the sk-doc validator, and the canary gold assertions.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | phase 015 criteria 5 of 7 reproduced by command (front door, canary gold, six advisor probes, 52-row replay); epic criteria 5 of 7 reproduced; advisor 2.0.3.0 traced from changelog claim to live effect and its disclosed limitation reproduced | none |
| `checklist_evidence` | pass | phase 015 tasks T004, T008 and T019 re-executed rather than trusted; T008's `exit=1` direction needs an edited tree and is recorded unverified | one unverifiable direction, named |

**Overlay protocols**

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | the reviewed artifacts assert no skill or agent definition |
| `agent_cross_runtime` | not run | no cross-runtime agent surface was in the reviewed scope |
| `feature_catalog_code` | partial | the Chrome lighthouse and performance-trace catalog claims were checked against the packet's docs and the matrix cells in iteration 1; the packet's remaining catalog entries were not opened |
| `playbook_capability` | partial | playbook presence and the recorded macOS Bladebro run were verified; the playbooks' individual claims were not re-run |

**AC_COVERAGE:** advisory-shortfall for this run. The two phase-015 acceptance rows that name a command (AC-001 bundle and canary, AC-006 five probes) were evidenced by command; the remaining AC rows of phases 013 to 015 were not scanned, so covered is 2 and total is UNKNOWN rather than a number this run can claim. The floor is not defined for this target.

Two criteria are unverified for reasons outside the packet: the advisor's full Vitest suite (2,737 tests, needs a `dist` build) and `validate.sh --strict --recursive`, which this dispatched worker may not run. Both are recorded as UNKNOWN, not as passes.

## 8. Deferred Items

- **The advisor suite's health claim** (phase 015 criterion 2, second half) is unverified here. The behaviour the suite covers was verified directly by six probes; the suite-wide claim needs an operator run.
- **`validate.sh --strict --recursive` on the hub packet** (phase 015 criterion 3 and epic criterion 7) is blocked in this run; the packet's own validator has not been re-run by this lineage.
- **The 006 status drift** (spec says Complete while its continuity waits on deferred routing findings) is an operator decision per phase 015's out-of-scope list.
- **The shared 0.45 lexical anchor** still lets two generic words lift several skills, disclosed in advisor 2.0.3.0's Known Limitation and out of scope for this hub.
- No frontier object exists in this registry, so there are no exhausted or blocked frontier nodes to list.

## Dimension Expansion Map

- Divergent expansion was not configured (`convergence_mode: default`), so there are no completed pivots, failed pivots, audited overrides or Council artifacts for this lineage.
- `divergence.saturatedDirections` is empty: the reducer recorded no saturated direction.
- Selected review directions: the four configured dimensions, each covered once, with a fifth pass spent on graph reconciliation and citation integrity rather than on a fifth direction.
- Remaining frontier: none open. The coverage graph holds 526 seed nodes, 4 `FINDING` nodes and their `EVIDENCE_FOR` edges, and the hotspot saturation signal passes.

## 9. Search Ledger

- `searchCoverage` required bug classes: `doc_format_misstatement` (iteration 4) and `citation_integrity` (iteration 5); all covered.
- `candidateCoverage.covered`: `citation_integrity`, `doc_behavior_mismatch`, `doc_format_misstatement`, `doc_index_drift`, `supply_chain_verification_gap`.
- `candidateCoverage.ruledOut` (19 classes) includes `broken_link`, `layout_entry_stale`, `version_mismatch`, `secret_exposure`, `privileged_execution`, `readonly_label_misclassification`, `hook_gate_bypass`, `stale_compiled_policy`, `routing_table_divergence`, `vocabulary_orphan`, `generated_manifest_drift`, `goal_evidence_stale` and `changelog_missing`.
- `searchDebt`: empty. `hasSearchDebt: false`.
- `cleanSearchProof`: present for the five finding rows, each carrying evidence refs and a linked finding id.
- `ruledOutCandidates`: the 19 classes above plus the per-iteration ruled-out directions recorded in each narrative.

## 10. Audit Appendix

**Convergence summary.** Five iterations, stop reason `converged`, stop decision STOP with reason detail `all_dimensions_clean`, weighted stop score 0.7 against a 0.60 bar; graph decision STOP_ALLOWED; all nine legal-stop gates pass; terminal gates evidence, scope and coverage all pass. Findings by iteration: 1 (P2), 1 (P2), 1 (P2), 1 (P2), 0. New-findings ratios: 1.0, 0.5, 0.3333, 0.25, 0.0.

**Coverage summary.** Four dimensions, all covered; five of the 522 pre-bound files read in depth per iteration with roughly forty unique files cited across the run; the coverage graph seeded from all 522 scope paths so the hotspot signal has a real frontier to judge.

**Ruled-out claims.** (1) The hub routing tables are aligned, no orphan vocabulary and no stale compiled policy. (2) The doctor handshake probes are documented read-only and watchdog-bounded, not a mislabelled mutation. (3) The pre-commit comment-hygiene gate checks staged blobs and fails closed. (4) No credential literal exists in the hub tree or the UTCP config. (5) Phase 015's replay evidence is current, not stale. (6) The advisor version line matches its newest changelog and its behaviour matches its changelog. (7) The README version line is a recorded ruling, not drift.

**Sources reviewed.** The hub's own sixteen-file root, three mode packets' SKILL/ROUTER/INSTALL-GUIDE files, five hub changelog files and the mode changelogs' headings, the compiled-routing library and front door, the canary fixture and harness, the two-stage replay corpus and report, the mutation-class manifest and guard, the repo pre-commit hook, the three installers and three doctors, the UTCP registration, the advisor changelog and probe behaviour, and phases 001 to 015 goal, spec, acceptance, tasks and implementation-summary documents as far as their criteria required.

**Cross-reference appendix - Core Protocols.** `spec_code`: pass, five phase-015 and five epic criteria reproduced by command, two criteria blocked by run limits. `checklist_evidence`: pass, three phase-015 task rows re-executed, one direction unverifiable without an edited tree.

**Cross-reference appendix - Overlay Protocols.** `skill_agent`: notApplicable. `agent_cross_runtime`: not run. `feature_catalog_code`: partial (Chrome lighthouse and performance-trace claims verified, the rest not opened). `playbook_capability`: partial (presence and the recorded macOS Bladebro run verified, individual claims not re-run).
