---
title: "Tasks: Phase 20 sk-code surface-packet rename to code- prefix"
description: "Executed task list for the sk-code rename follow-up: four bare surface packets moved to code-* identities, live references repaired, gates verified, and scoped deferrals documented."
trigger_phrases:
  - "phase 20 tasks"
  - "sk-code rename tasks"
  - "code prefix rename tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/020-surface-packet-rename"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rename executed; live sk-code references and gates repaired"
    next_safe_action: "Run gated advisor reindex handoff; handle benchmark-gold rewrite separately"
---
# Tasks: Phase 20 sk-code surface-packet rename to code- prefix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase-020 scope and out-of-scope boundaries [small] — spec.md defines REQ-001..REQ-007, SC-001..SC-005, risks, edge cases, historical-record exclusions, advisor-semantic deferral, and benchmark-gold deferral
- [x] T002 Inventory bare sk-code surface packet folders before rename [small] — target folders were `review`, `webflow`, `opencode`, and `animation`
- [x] T003 Confirm unprefixed infrastructure folders must remain unprefixed [small] — final hub inventory expects `benchmark`, `changelog`, `manual_testing_playbook`, and `shared`
- [x] T004 Identify internal live reference surfaces [medium] — workflow-mode packets, code-webflow packet, `shared/references/smart_routing.md`, hub `SKILL.md`, metadata JSON, and link-checker allowlist
- [x] T005 Identify external live reference surfaces [medium] — `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, speckit complete assets, and deep-review prompt pack template

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Rename four sk-code sub-skill folders with history preserved [large] — `review -> code-review`, `webflow -> code-webflow`, `opencode -> code-opencode`, `animation -> code-animation`; final `ls` confirms exactly eight `code-*` sub-skills plus four unprefixed infrastructure dirs
- [x] T007 Verify no double-prefix was introduced [small] — `grep -rn "code-code-" sk-code` returned 0

### sk-design Baseline
- [x] T008 Update `mode-registry.json` two-axis identity [medium] — `workflowMode`, `packet`, `packetSkillName`, and `surfaces` for the four renamed packets now use `code-*`; JSON parses
- [x] T009 Update `hub-router.json` router contract [medium] — `tieBreak`, `routerSignals` keys, `resources`, and the ten `<mode>-*` vocabulary classes now use `code-*`; JSON parses

### deep-loop Baseline
- [x] T010 Update renamed packet `SKILL.md` names and internal links [medium] — each renamed packet `name:` matches its folder, and broken `../webflow/`, `../opencode/`, `../animation/`, and `../review/` links were repointed
- [x] T011 Sweep hub routing documentation and hub `SKILL.md` [medium] — 56 bare surface-path refs in `shared/references/smart_routing.md` moved to `code-*`; hub layout, workflowMode keys, surface/workflow tables, resolved-key example, and references list updated while preserving platform names and detection labels

### Comparison
- [x] T012 Update metadata, checker allowlist, and external live references [medium] — `graph-metadata.json` and `description.json` path references repointed; moved illustrative-example allowlist key updated; agent docs, speckit complete assets, and deep-review prompt pack template point at `code-*`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Confirm final sk-code directory inventory [small] — hub lists exactly `code-animation`, `code-debug`, `code-implement`, `code-opencode`, `code-quality`, `code-review`, `code-verify`, `code-webflow`, plus `benchmark`, `changelog`, `manual_testing_playbook`, and `shared`
- [x] T014 Parse changed JSON contract and metadata files [small] — `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, and `description.json` all parse
- [x] T015 Run markdown link-checker oracle for sk-code [medium] — ZERO sk-code broken links; repo-wide exit=1 remains 40 pre-existing broken links entirely outside sk-code in system-spec-kit database README files, baseline unchanged and out of scope

### Severity Promotion
- [x] T016 Run live stale-reference sweep [medium] — EMPTY; zero live files under `.opencode` + `.claude` reference `sk-code/{review,webflow,opencode,animation}/` as a path, excluding historical specs, changelog, benchmark, playbook, and archive records
- [x] T017 Run parent-skill-check strict and vocab-sync [medium] — parent-skill-check strict exit 0 with all hard invariants passed and 0 warnings; vocab-sync score 100, driftDetected false, findings [], orphanAliases [], aliasCollisions [], ownershipDrift []

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T018 Preserve platform and detection names during the sweep [small] — Webflow/OpenCode/Motion.dev prose names, WEBFLOW/OPENCODE/MOTION_DEV labels, the natural-language utterance "review my webflow animation for jank", and the Keywords comment remain intact
- [x] T019 Leave historical and archived references unchanged [small] — old-name references remain only in historical phase records under 124 phases 013/014/016 and archive material by standing decision
- [x] T020 Document REQ-007 advisor semantic refresh deferral [small] — only dangling path references were repaired; semantic keyword/topic/derived-token refresh is deferred to the gated advisor reindex handoff

### Optional Feature Catalogs
- [x] T021 [P] sk-code Lane-C benchmark playbook-gold rewrite [medium] — DEFERRED; tracked separately from this rename, while router path resolution passes check 5d
- [x] T022 [P] Advisor projection coverage metrics [small] — DEFERRED; untypedKeywords and phantomTypedKeywords are not drift and belong to the deferred advisor reindex
- [x] T023 [P] Historical spec/archive rewrite [small] — SKIPPED; historical records intentionally narrate the names that existed when those phases ran

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T024 Record verification evidence in checklist.md [small] — each item marked `[x]` with an evidence tag grounded in executed gates
- [x] T025 Record Files Changed and Deviations in implementation-summary.md [medium] — includes folder renames, registry/router, internal links, hub docs, metadata paths, checker allowlist, external references, and scoped deferrals
- [x] T026 Cross-reference spec.md, plan.md, and checklist.md [small]
- [x] T027 Self-verify close-out docs [small] — frontmatter, anchors, checkboxes, evidence, and no invented commit SHAs reviewed

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 rename and contract tasks completed; all four formerly bare surface packets now use the `code-*` identity.
- [x] Internal markdown links and live external references are repaired; historical and archived records are intentionally left unchanged.
- [x] Verification gates are green: inventory, double-prefix sweep, JSON parse, sk-code link oracle, stale-ref sweep, parent-skill-check strict, and vocab-sync.
- [x] REQ-007 advisor semantic refresh, benchmark-gold rewrite/re-baseline, and historical/archive rewrites are documented as scoped deferrals.
- [x] Checklist marked with execution evidence and cross-references to spec/plan/checklist are present.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
