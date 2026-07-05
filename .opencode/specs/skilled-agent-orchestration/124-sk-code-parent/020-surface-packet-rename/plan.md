---
title: "Implementation Plan: Phase 20 sk-code surface-packet rename to code- prefix"
description: "Forward-looking Level 2 plan for renaming the four bare sk-code surface packets to code-* identities, repairing live references, and preserving platform names and historical records."
trigger_phrases:
  - "phase 20 rename plan"
  - "sk-code surface packet rename plan"
  - "code prefix rename plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/020-surface-packet-rename"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rename executed; sk-code surface packets and live references now use code-* identity"
    next_safe_action: "Run advisor reindex handoff; keep benchmark-gold rewrite separate"
---
# Implementation Plan: Phase 20 sk-code surface-packet rename to code- prefix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript validator scripts, YAML assets, OpenCode agent docs |
| **Framework** | sk-code two-axis parent hub, parent-hub canon, system-spec-kit phase docs |
| **Storage** | Repository filesystem: `.opencode/skills/sk-code/`, `.opencode/agents/`, `.claude/agents/`, command assets, and phase docs |
| **Testing** | Folder inventory, grep sweeps, JSON parse checks, markdown link checker, parent-skill-check strict, vocab-sync |

### Overview
This phase completes the sk-code rename follow-up handed forward from phase 019. It renames the four bare surface packets (`review`, `webflow`, `opencode`, `animation`) to `code-review`, `code-webflow`, `code-opencode`, and `code-animation`; updates the two-axis registry/router contract to the `code-*` identity; repairs internal and external live references; preserves platform/product names and detection labels; and records scoped deferrals for advisor semantic metadata, benchmark-gold re-baselining, and historical records.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 020 spec defines the rename scope, out-of-scope boundaries, REQ-001 through REQ-007, SC-001 through SC-005, risks, and edge cases.
- [x] Phase 019 handed forward the sk-code Lane-C benchmark-gold rewrite and re-baseline as a separate rename follow-up concern.
- [x] Operator directive is explicit: the four formerly bare sub-skills and their public workflowMode identities should carry the `code-` prefix.
- [x] Historical spec-tree records and archived references are identified as intentionally read-only inputs.

### Definition of Done
- [x] Four sk-code folders are renamed with history preserved: `review -> code-review`, `webflow -> code-webflow`, `opencode -> code-opencode`, `animation -> code-animation`; hub inventory lists exactly eight `code-*` sub-skills plus four unprefixed infrastructure folders.
- [x] `mode-registry.json`, `hub-router.json`, and each renamed packet `SKILL.md` agree on `workflowMode`, `packet`, `packetSkillName`, `surfaces`, router signals, resources, and vocabulary classes.
- [x] Internal markdown cross-packet links, hub routing docs, hub `SKILL.md`, metadata path references, link-checker allowlist, and external live references are repaired.
- [x] Verification gates are green: no `code-code-` double-prefixes, JSON parses, zero sk-code broken links, empty live stale-ref sweep, parent-skill-check strict exit 0, and vocab-sync score 100 with no drift.
- [x] Scoped deferrals are documented: REQ-007 advisor semantic refresh, sk-code Lane-C benchmark playbook-gold rewrite/re-baseline, and historical/archived references.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename with oracle-verified reference repair: preserve history first, update structural contracts second, sweep live references third, verify with deterministic gates last.

### Key Components
- **Renamed surface packets**: `code-review`, `code-webflow`, `code-opencode`, and `code-animation`, each with a matching `SKILL.md` `name:` field.
- **Two-axis contract**: `mode-registry.json` and `hub-router.json` fields that expose the public `code-*` workflowMode and packet identity.
- **Reference graph**: Internal markdown links, hub routing prose, hub `SKILL.md`, external agent docs, command YAML assets, deep-review prompt template, and link-checker allowlist.
- **Scoped metadata**: `graph-metadata.json` and `description.json` path references updated without refreshing advisor semantic tokens.

### Data Flow
The folder rename changes the physical packet paths. Registry and router updates then make those paths the canonical public identity. Markdown link and textual-reference sweeps repair all live callers of the old path segments while preserving platform names and detection labels. Validation gates confirm no double-prefixes, no broken sk-code links, no stale live path refs, and no router/vocabulary drift.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [ ] Confirm phase-020 scope, out-of-scope historical records, and operator prefix directive.
- [ ] Inventory the four bare surface folders and the unprefixed infrastructure folders.
- [ ] Identify live reference surfaces: sk-code markdown, hub routing docs, metadata JSON, checker allowlist, agents, command assets, and deep-review prompt template.

### Phase 2: Fresh Benchmark Packages
- [ ] Rename the four surface packet folders to `code-*` with history preserved.
- [ ] Update `mode-registry.json`, `hub-router.json`, and packet `SKILL.md` names to the `code-*` identity.
- [ ] Repair internal markdown cross-packet links and live textual path references.
- [ ] Repoint advisor metadata paths without changing advisor semantic tokens.

### Phase 3: Validator Promotion
- [ ] Verify the hub folder inventory lists exactly eight `code-*` sub-skills plus four unprefixed infrastructure folders.
- [ ] Verify JSON integrity for registry, router, and metadata files.
- [ ] Run the sk-code markdown link-checker oracle and confirm zero sk-code broken links.
- [ ] Run stale-reference and double-prefix sweeps.
- [ ] Run parent-skill-check strict and vocab-sync.

### Phase 4: Parent Rollup and Optional Catalogs
- [ ] Preserve platform names, CAPS detection labels, filenames, and natural-language utterances.
- [ ] Preserve historical/archived records per standing decision.
- [ ] Document REQ-007 advisor semantic refresh as deferred to the gated advisor reindex handoff.
- [ ] Document the benchmark-gold rewrite and re-baseline as a separate tracked follow-up.
- [ ] Run final close-out doc verification after the rename evidence is recorded.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Folder inventory | sk-code sub-skill and infrastructure directory set | `ls` confirmation |
| Contract integrity | mode registry, hub router, packet names, metadata JSON | JSON parse plus parent-skill-check strict |
| Reference repair | Internal markdown links and live external references | `check-markdown-links.cjs` and stale-ref grep sweep |
| Scope guardrails | Platform names, detection labels, natural-language utterance, no double-prefix | Targeted grep/diff review |
| Spec validation | Phase close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 spec scope | Internal | Available | Rename scope, REQ mapping, and deferral boundaries would be ambiguous |
| sk-code two-axis registry/router | Internal | Available | Public `workflowMode` and packet identity could not be made consistent |
| Markdown link checker | Internal | Available | Broken internal links could escape the rename |
| parent-skill-check strict | Internal | Available | Router and packet invariants could not be proven after the rename |
| Advisor reindex handoff | Internal | Deferred by scope | Advisor semantic tokens remain old until the gated reindex refresh runs |
| Benchmark-gold rewrite | Internal | Deferred by scope | Lane-C gold remains tracked separately; phase 020 verifies router resolution but does not re-freeze gold |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A renamed packet path fails to resolve, live references still point at old `sk-code/{review,webflow,opencode,animation}/` paths, or scope guardrails corrupt platform/detection names.
- **Procedure**: Revert the rename and reference-repair commit as one mechanical unit, restore the pre-rename registry/router/metadata/checker entries, and re-run the folder inventory, stale-ref sweep, link-checker oracle, parent-skill-check strict, and vocab-sync before attempting a narrower segment-anchored sweep.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Phase 020 spec and phase 019 handoff | Rename execution |
| Fresh Benchmark Packages | Inventory and operator prefix directive | Verification gate runs |
| Validator Promotion | Completed rename, contract updates, and reference sweep | Close-out documentation |
| Parent Rollup and Optional Catalogs | Green rename gates and documented deferrals | Final handoff to advisor reindex and benchmark follow-up |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Bounded by four folders but wide reference discovery across live docs/assets |
| Fresh Benchmark Packages | High | Mechanical rename fans out into registry, router, links, metadata, and external refs |
| Validator Promotion | Medium | Deterministic gates, with careful stale-ref and platform-name guardrails |
| Parent Rollup and Optional Catalogs | Medium | Close-out docs must record scoped deferrals without overstating completion |
| **Total** | | **Medium-high rename and reference-repair phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record pre-rename folder inventory for the four surface packet paths.
- [ ] Record pre-change registry/router/metadata path state.
- [ ] Record baseline live stale-ref and markdown-link checker output.

### Rollback Procedure
1. Revert the mechanical rename and all same-phase reference edits together.
2. Restore registry, router, metadata, and link-checker allowlist entries to the pre-rename paths.
3. Re-run stale-ref and double-prefix sweeps to confirm the old and new path sets are not mixed.
4. Re-run markdown link checking, parent-skill-check strict, and vocab-sync.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of renamed folders and textual/JSON/YAML/markdown path updates; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
