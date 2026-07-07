---
title: "Feature Specification: Phase 018 - design-mcp-open-design Transport Integration"
description: "Integrates the operator-relocated mcp-open-design skill (now sk-design/design-mcp-open-design) as a proper nested transport packet: a new packetKind:\"transport\" axis on sk-design's mode-registry.json/hub-router.json, dissolved independent advisor identity, and every stale cross-reference repointed."
trigger_phrases:
  - "design-mcp-open-design integration"
  - "sk-design transport axis"
  - "phase 018 mcp-open-design"
  - "open design nested transport packet"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/018-mcp-open-design-transport-integration"
    last_updated_at: "2026-07-07T09:50:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md after the full integration and verification pass completed"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-open-design-transport-018"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Integration shape: extend mode-registry.json/hub-router.json with a new packetKind:\"transport\" axis (operator-selected over keep-separate-identity and full-workflow-merge alternatives)"
---
# Feature Specification: Phase 018 - design-mcp-open-design Transport Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator physically moved and renamed `.opencode/skills/mcp-open-design/` to `.opencode/skills/sk-design/design-mcp-open-design/` via a raw `mv` (outside git). This is a genuine architectural fork, not a simple relocation: `mcp-open-design` is a transport skill (drives the external Open Design app's `od` CLI and stdio MCP server, `allowed-tools: [Read, Bash]`), not a design-judgment mode like sk-design's existing five (`interface`/`foundations`/`motion`/`audit`/`md-generator`, all `Read`/`Glob`/`Grep` or `md-generator`'s `Write`/`Edit`/`Bash`). Left as-is, the move broke: 14 internal relative links (the folder is now one level deeper than when it was a sibling of `sk-design`), the skill's own dual identity (it still carried `graph-metadata.json` claiming `skill_id: "mcp-open-design"` as an independent advisor identity, alongside its new physical nesting), a stale flat changelog symlink, and every external cross-reference (`mcp-figma`, `cli-opencode`, `AGENTS.md`, sk-design's own docs and graph edges).

### Purpose

Properly integrate the moved skill as a nested transport packet of `sk-design`: extend the hub's mode-registry.json/hub-router.json with a new `packetKind: "transport"` axis (alongside the existing `workflow` axis), dissolve the packet's independent advisor identity, repoint every internal and external stale reference, and verify the hub's D5 connectivity gate and full link graph stay clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix 14 broken internal relative links inside `design-mcp-open-design/` caused by the added nesting depth (`SKILL.md`, `INSTALL_GUIDE.md`, 4 `references/*.md` files, `feature_catalog/`, `manual_testing_playbook/`), plus 2 pre-existing missing `design-interface/` path segments surfaced by the same links.
- Rename the packet's own identity: `SKILL.md` `name:`/H1/keywords, `README.md` `title:`/H1, scripts' log/comment self-references, from `mcp-open-design` to `design-mcp-open-design`.
- Delete `design-mcp-open-design/graph-metadata.json` (dissolves its independent advisor identity — a nested transport packet must not carry one, same rule as sk-design's five workflow packets).
- Add a `packetKind: "transport"` axis to `sk-design/mode-registry.json`: new `discriminator.packetKind` doc, `extensions.transport-axis`, and a new `design-mcp-open-design` mode entry (`toolSurface: {allowed: [Read, Bash], forbidden: [Write, Edit], mutatesWorkspace: false}`, `command: null`, aliases, `advisorRouting`).
- Wire the new mode into `sk-design/hub-router.json`: `routerSignals["design-mcp-open-design"]`, `vocabularyClasses["design-mcp-open-design-aliases"]`, `routerPolicy.tieBreak` append.
- Update `sk-design`'s own `SKILL.md`/`README.md` prose (mode counts, transport listings) and `graph-metadata.json` (remove now-internal `mcp-open-design` edges rather than retarget, since the relationship is now structural via `mode-registry.json`, not cross-skill).
- Update external cross-references: `mcp-figma` (`SKILL.md`, `README.md`, `graph-metadata.json`, `manual_testing_playbook.md`), `cli-opencode/SKILL.md` (ALWAYS rule #13), `AGENTS.md` (2 routing rows).
- Fix changelog symlinks: remove the stale `.opencode/changelog/mcp-open-design` (broken, target no longer exists), add `.opencode/changelog/sk-design/design-mcp-open-design` (matching phase 016's per-packet symlink pattern).
- Verify: zero broken links (custom scanner across `sk-design` + `mcp-figma`, excluding `node_modules`/`changelog`/`benchmark`), JSON parse on all 4 touched registries, router-mode skill-benchmark (D5 connectivity + full 24-scenario pass).

### Out of Scope

- Extending `sk-design`'s `manual_testing_playbook` with new scenarios covering `design-mcp-open-design` specifically (the existing 24 scenarios don't exercise it; a future phase can add MR-class or a new category).
- Regenerating `system-skill-advisor/mcp_server/scripts/skill-graph.json` (a compiled build artifact spanning the whole skill graph, not just this packet) — flagged as a required follow-up, not run here, to avoid colliding with concurrent-session reindex activity already active this session.
- Changing `mcp-figma`'s own architecture (it remains a fully independent, external sibling skill; only its prose/graph mentions of the moved skill were corrected).
- Any behavior change inside `design-mcp-open-design`'s own transport logic (`od` CLI invocation, MCP wiring, the WIRE/READ/RUN direction router) — this phase is a structural/identity integration, not a functional rewrite.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/design-mcp-open-design/{SKILL.md,README.md,INSTALL_GUIDE.md,scripts/*.sh,references/*.md,feature_catalog/**,manual_testing_playbook/**,mcp-servers/**}` | Edit | Depth-shift link fixes + identity rename (~14 files) |
| `.opencode/skills/sk-design/design-mcp-open-design/graph-metadata.json` | Delete | Dissolves independent advisor identity |
| `.opencode/skills/sk-design/mode-registry.json` | Edit | New `transport` packetKind axis + new mode entry; version bump |
| `.opencode/skills/sk-design/hub-router.json` | Edit | New routerSignals/vocabularyClasses/tieBreak entry; version bump |
| `.opencode/skills/sk-design/{SKILL.md,README.md,graph-metadata.json}` | Edit | Mode-count prose, transport listings, edge removal |
| `.opencode/skills/mcp-figma/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/manual_testing_playbook.md}` | Edit | Cross-reference repoint |
| `.opencode/skills/cli-opencode/SKILL.md` | Edit | ALWAYS rule #13 Design Standards Loading; version bump |
| `AGENTS.md` | Edit | 2 routing table rows |
| `.opencode/changelog/mcp-open-design` | Delete | Stale broken symlink |
| `.opencode/changelog/sk-design/design-mcp-open-design` | Create | New per-packet changelog symlink |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero broken internal links inside the moved packet | Custom link scanner over `design-mcp-open-design/` (excluding historical `changelog/`) returns 0 hits |
| REQ-002 | Packet's independent advisor identity dissolved | `graph-metadata.json` removed from the packet folder |
| REQ-003 | `mode-registry.json` and `hub-router.json` both parse as valid JSON and route the new mode | `python3 -c "import json; json.load(...)"` succeeds on both; `design-mcp-open-design` present in `modes[]` and `routerSignals` |
| REQ-004 | D5 connectivity gate still passes after the restructure | Router-mode skill-benchmark: D5 connectivity 100/100, verdict PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Every external cross-reference repointed | `mcp-figma`, `cli-opencode`, `AGENTS.md`, sk-design's own docs all say `design-mcp-open-design` (or explicitly qualify "external sibling" for `mcp-figma`), not the stale `mcp-open-design` |
| REQ-006 | Changelog symlinks correct | `.opencode/changelog/mcp-open-design` removed; `.opencode/changelog/sk-design/design-mcp-open-design` resolves to real changelog files |
| REQ-007 | No dangling graph edges to a non-existent skill_id | `sk-design` and `mcp-figma` `graph-metadata.json` files contain no `"mcp-open-design"` edge target |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the full link scan runs over `sk-design` and `mcp-figma` (excluding `node_modules`/`changelog`/`benchmark`), **Then** it reports 0 broken links.
- **SC-002**: **Given** the router-mode skill-benchmark runs against `sk-design`, **Then** verdict is PASS, aggregate 100/100, D5 connectivity 100/100, matching the pre-integration baseline.
- **SC-003**: **Given** a request like "wire open design" or "od cli", **Then** `hub-router.json`'s `design-mcp-open-design-aliases` vocabulary class matches it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing (vs. retargeting) graph edges loses the relationship signal entirely | Low | The relationship is now captured structurally in `mode-registry.json`'s `modes[]` array, which is the authoritative source for hub-internal packet relationships; a dangling edge to a non-existent `skill_id` would be worse than no edge |
| Risk | `skill-graph.json` compiled index still shows the old identity until regenerated | Medium | Explicitly flagged as a required follow-up in Known Limitations rather than run here, given active concurrent-session reindex activity this session |
| Risk | Missing an internal link during the depth-shift fix | Medium | Systematic Python-based link scanner (not manual grep) used for both discovery and final verification, catching both markdown-link and plain-backtick-path forms |
| Dependency | Operator's chosen integration shape (new `transport` packetKind axis) | High | Confirmed via AskUserQuestion before any edit; the two alternatives (keep-separate-identity, full-workflow-merge) were explicitly weighed and rejected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — integration shape and spec folder placement were both confirmed before implementation began.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: A future transport packet (if any) can reuse the same `packetKind: "transport"` axis and `extensions.transport-axis` pattern without re-deriving the toolSurface/mutatesWorkspace semantics from scratch.

### Reliability
- **NFR-R01**: `design-mcp-open-design`'s own mandatory-pairing contract (must load sk-design's judgment before any design-affecting operation) is preserved verbatim in its SKILL.md — this phase only fixes identity/paths, never the runtime contract.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A request naming both a design axis and Open Design (e.g. "ground this in an Open Design system") — the hub's existing `orderedBundle`/`defer` outcomes handle multi-signal requests; no new outcome type was added since the existing three (`single`/`orderedBundle`/`defer`) already cover this without inventing transport-specific bundling.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~25 files touched across 4 skills + AGENTS.md + 2 changelog symlinks, but each edit is small and mechanical |
| Risk | 12/25 | Real architecture decision (new registry axis) but additive-only to existing registries; no runtime code path |
| Research | 8/20 | Required understanding the skill's actual nature (transport vs mode) plus the sk-code surface-axis precedent before designing the fix |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Reference Pattern**: `.opencode/skills/sk-code/mode-registry.json` (`extensions.surface-axis`, the closest existing precedent for a second packetKind axis)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
