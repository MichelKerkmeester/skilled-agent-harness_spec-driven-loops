---
title: "Implementation Plan: system-skill-advisor subtree skill gate"
description: "Aggregate sibling checklists and run a scope-aware whole-surface inventory, stale-path scan, link/reference check, and runtime/documentation parity gate without performing new migration work."
trigger_phrases:
  - "system-skill-advisor subtree gate plan"
  - "kebab-case rollup gate implementation"
  - "advisor whole-surface verification"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the subtree gate implementation plan"
    next_safe_action: "Collect sibling receipts and prepare the scope-aware surface scan"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 008 is evidence-only; newly discovered candidates block the gate and return to their owning phase."
      - "The scope-aware scan must distinguish filesystem names from identifiers, keys, tool names, and exemptions."
---

# Implementation Plan: system-skill-advisor subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Repository filesystem, Markdown, TypeScript/Node, Python compatibility surface |
| **Framework** | 020 rename-map, SOL checklist, and sk-doc validation conventions |
| **Storage** | Source tree, phase evidence, generated reports |
| **Testing** | Sibling checklist aggregation, scoped naming scan, links, builds, discovery, release evidence |

### Overview
Treat the system-skill-advisor directory and its phase packet as one evidence boundary. Aggregate all sibling P0
receipts, reconcile the full classification map, run the scope-aware zero-snake scan and stale-path scan, then verify
runtime, catalog, playbook, and release parity. This phase never fixes a failed scan.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sibling 001–007 docs and evidence receipts exist.
- [ ] Candidate SHA, BASE SHA, and rename-map hash are available for each sibling.
- [ ] Exemption, frozen-history, generated, and intentional-mention rules are loaded.

### Definition of Done
- [ ] Every sibling P0 check passes with pinned evidence.
- [ ] Whole-surface classification has no unknown bucket.
- [ ] Scope-aware snake_case and stale-path scans report no blocking result.
- [ ] Runtime, docs, catalog/playbook, and changelog/version parity checks pass.
- [ ] The gate diff contains evidence only.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence aggregation followed by a fail-closed whole-surface gate.

### Key Components
- Leaf receipts: phases 001–007 checklists and reports.
- Classification map: rename, exempt, frozen, generated, and tool-mandated dispositions.
- Surface checks: filesystem names, live path references, links, runtime discovery, and release evidence.

### Data Flow
Leaf phases emit receipts and target maps. The gate joins those maps, scans the actual skill tree and known consumers,
filters only approved exemptions, then compares behavior/discovery/release outputs to BASE. Any unresolved hit stops
the gate and routes back to the owning leaf.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Load each sibling checklist, receipt, candidate SHA, BASE SHA, and map hash.
- [ ] Verify required leaf files and absence of stray implementation summaries/scratch directories.
- [ ] Build the aggregate disposition ledger and define scan roots/consumer sets.

### Phase 2: Implementation
- [ ] Perform no new rename or source edit.
- [ ] Reconcile sibling maps and classify every remaining underscore-bearing filesystem path/hit.

### Phase 3: Verification
- [ ] Run the scope-aware filesystem-name and stale-live-path scans.
- [ ] Resolve whole-surface links and path-valued references.
- [ ] Re-run package/launcher, script, catalog, playbook, and hook discovery checks.
- [ ] Verify changelog/version evidence and emit the final gate receipt.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Leaf aggregation | Sibling P0 receipts and required docs | checklist/report matrix |
| Naming | All advisor filesystem names within exemptions | scope-aware naming guard |
| References | Live old paths and broken links | rg, link/path resolver |
| Runtime | Launcher, scripts, hooks, catalog/playbook discovery | package and test smoke |
| Release | Changelog/version alignment | version and evidence cross-check |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Leaf phases 001–007 | Internal | Required | No valid rollup |
| BASE and rename-map receipts | Internal | Required | No trustworthy parity or classification |
| Central verification environment | Internal | Required | Local false positives/negatives cannot be resolved |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any missing receipt, unknown classification, remaining in-scope snake_case name, stale live path, or
  parity failure.
- **Procedure**: Mark the rollup blocked, preserve the evidence report, and route the exact hit to its owning leaf.
  Do not rename or edit source from the rollup phase.
<!-- /ANCHOR:rollback -->
