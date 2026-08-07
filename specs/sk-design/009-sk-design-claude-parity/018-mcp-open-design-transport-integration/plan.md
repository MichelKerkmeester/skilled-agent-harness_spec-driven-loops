---
title: "Implementation Plan: Phase 018 - design-mcp-open-design Transport Integration"
description: "Plan for fixing the moved skill's broken links, dissolving its independent identity, adding a new transport packetKind axis to sk-design's registries, and repointing every external cross-reference."
trigger_phrases:
  - "phase 018 plan"
  - "design-mcp-open-design integration plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/018-mcp-open-design-transport-integration"
    last_updated_at: "2026-07-07T09:55:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-open-design-transport-018"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 018 - design-mcp-open-design Transport Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Declarative JSON registries (mode-registry.json, hub-router.json, graph-metadata.json) + markdown skill docs + filesystem symlinks |
| **Framework** | sk-code's `extensions.surface-axis` two-axis pattern, generalized to a `transport` axis for sk-design |
| **Storage** | `.opencode/skills/sk-design/` (hub + moved packet), `.opencode/skills/mcp-figma/`, `.opencode/skills/cli-opencode/`, `AGENTS.md`, `.opencode/changelog/` |
| **Testing** | Custom Python link scanner, JSON parse checks, router-mode skill-benchmark (D5 connectivity gate) |

### Overview

The operator moved `mcp-open-design` into `sk-design/design-mcp-open-design/` via raw `mv`. Research established this is a transport skill (external CLI/MCP bridge, `Bash`-capable) fundamentally unlike sk-design's five design-judgment modes (`Read`/`Glob`/`Grep`-only, or `md-generator`'s repo-mutating extraction). Three integration shapes were weighed via AskUserQuestion: (A) keep its own independent identity, just co-located; (B) a new `packetKind: "transport"` axis on sk-design's own registries; (C) fold it into `modes[]` as `packetKind: "workflow"` like sk-code's quality/code-review. The operator chose (B) — architecturally honest (doesn't conflate "transport" with "design-judgment workflow" or force a fake independent identity onto an already-nested folder), and directly modeled on sk-code's existing `extensions.surface-axis` precedent for adding a second discriminator axis to a mode-registry.json.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read the moved skill's full `SKILL.md` to confirm its actual nature (transport, not design-judgment mode)
- [x] Compared sk-code's `mode-registry.json` `extensions.surface-axis` + a surface packet's frontmatter (`code-webflow/SKILL.md`) as the closest existing precedent
- [x] Ran an Explore agent to inventory every repo-wide reference to the old `mcp-open-design` name/path, classified live vs. historical
- [x] Confirmed integration shape with the operator before any edit (AskUserQuestion, three options weighed)

### Definition of Done
- [x] All internal links inside the moved packet fixed and verified via a systematic scanner
- [x] Packet identity renamed throughout (`SKILL.md`/`README.md`/scripts), independent `graph-metadata.json` deleted
- [x] `transport` packetKind axis added to both `mode-registry.json` and `hub-router.json`
- [x] sk-design's own docs and graph edges updated; external cross-references (`mcp-figma`, `cli-opencode`, `AGENTS.md`) repointed
- [x] Changelog symlinks fixed
- [x] Full verification pass: 0 broken links, JSON valid, router-mode benchmark PASS with D5 100/100
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-axis mode registry, generalized from sk-code's `workflow`/`surface` model to sk-design's `workflow`/`transport` model. The key semantic difference: sk-code's `surface` packets are read-only stack-EVIDENCE bundled alongside a workflow mode (`mutatesWorkspace: false`, no independent trigger vocabulary of their own — they're passive knowledge). sk-design's new `transport` packet is an actively-triggerable peer mode with its OWN distinct vocabulary (WIRE/READ/RUN direction keywords, "od cli", "wire open design") that can be selected on its own, not just bundled as evidence — but it never performs design judgment itself, and carries a hard, self-documented mandatory-pairing contract requiring sk-design's own workflow modes before any design-affecting operation.

### Key Components

- **`mode-registry.json`**: new `discriminator.packetKind` field (previously undocumented since only one value existed); new `extensions.transport-axis` block (mirrors `extensions.surface-axis`'s shape: description + array of member workflowMode keys); new `design-mcp-open-design` mode entry with `toolSurface: {allowed: [Read, Bash], forbidden: [Write, Edit], mutatesWorkspace: false}` — `mutatesWorkspace: false` because its Bash calls drive an EXTERNAL daemon/app, never writing to this repo's own workspace (unlike `md-generator`, which does write repo files and correctly has `mutatesWorkspace: true`).
- **`hub-router.json`**: new `routerSignals["design-mcp-open-design"]` (weight 4, its own alias class + `hub-identity`), new `vocabularyClasses["design-mcp-open-design-aliases"]`, `routerPolicy.tieBreak` appended with the new mode LAST (workflow modes before transport, mirroring sk-code's "workflow modes before surface packets" convention).
- **Identity dissolution**: `design-mcp-open-design/graph-metadata.json` deleted (a nested packet — workflow, surface, or transport — never carries one, per the rule already established for sk-design's five modes and sk-code's two surface packets). `SKILL.md`'s `name:` field renamed to match its new folder (`design-mcp-open-design`), consistent with `create-skill`'s own rule that `name` must match the folder.
- **Graph edge cleanup**: `sk-design` and `mcp-figma`'s own `graph-metadata.json` files had `siblings`/`prerequisite_for`/`related_to` edges pointing at the old independent `skill_id: "mcp-open-design"`. These were REMOVED (not retargeted), since the relationship these edges represented (two independent skill identities) no longer exists — it's now an intra-hub structural relationship fully captured by `mode-registry.json`'s own `modes[]` array, and a dangling edge to a non-existent `skill_id` would be worse than no edge.

### Content Mapping (Depth-Shift Fix Pattern)

The moved folder gained one nesting level (`skills/mcp-open-design/` → `skills/sk-design/design-mcp-open-design/`). Two distinct fix patterns applied depending on the link's target:

| Link Target | Old Path Shape | Fix |
|---|---|---|
| Inside `sk-design` (e.g. `shared/design_proof_token.md`, `design-interface/references/...`) | `../../sk-design/X` or `../sk-design/X` (named the hub explicitly since it was a sibling) | Drop the now-redundant `sk-design/` segment, KEEP the same `../` count (the extra nesting level already lands you inside `sk-design/`) |
| Outside `sk-design` (true siblings: `sk-doc`, `mcp-figma`, `mcp-chrome-devtools`, `system-spec-kit`) | `../X` (one hop to `skills/`) | ADD one more `../` (the extra nesting level means one more hop is needed to reach `skills/`) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-mcp-open-design/**` | Moved skill package | Fix 14 depth-shift links + 2 pre-existing missing segments; rename identity; delete graph-metadata.json | Custom link scanner (0 broken); grep sweep (0 stale `mcp-open-design` text outside historical changelog) |
| `sk-design/mode-registry.json` | Hub discriminator registry | Add `transport` packetKind axis + new mode entry | JSON parse; router-mode benchmark |
| `sk-design/hub-router.json` | Hub router signals | Wire new mode's routerSignals/vocabularyClasses/tieBreak | JSON parse; router-mode benchmark |
| `sk-design/{SKILL.md,README.md,graph-metadata.json}` | Hub identity docs | Mode-count prose fixes; edge removal | Grep sweep; JSON parse |
| `mcp-figma/**`, `cli-opencode/SKILL.md`, `AGENTS.md` | External cross-referencing docs | Repoint name + clarify nested-vs-external | Grep sweep |
| `.opencode/changelog/{mcp-open-design, sk-design/design-mcp-open-design}` | Changelog symlinks | Remove stale, add correct | `ls -la` resolution check |

Required inventories:
- Same-class producers: `design-mcp-open-design` is now the ONLY `packetKind: "transport"` entry in sk-design's registry; no other packet needed the same fix.
- Consumers of changed symbols: the sk-design hub router (reads both registries at routing time); `system-skill-advisor`'s compiled `skill-graph.json` (a build artifact that still reflects the OLD identity until separately regenerated — flagged, not fixed here).
- Matrix axes: file x {old value, new value, verification method}.
- Algorithm invariant: every fix is either a path/identity correction or an additive registry entry; no existing mode's routing behavior, weight, alias, or keyword changed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the moved skill's full `SKILL.md` and its `graph-metadata.json`
- [x] Dispatch an Explore agent for a repo-wide reference inventory (live vs. historical)
- [x] Read sk-code's `mode-registry.json`/`code-webflow/SKILL.md` as the surface-axis precedent
- [x] Confirm integration shape with the operator (AskUserQuestion)

### Phase 2: Implementation
- [x] Fix 14 broken internal links + 2 pre-existing missing segments inside `design-mcp-open-design/`
- [x] Rename identity throughout the moved packet; delete its `graph-metadata.json`
- [x] Add `transport` packetKind axis to `mode-registry.json` (discriminator doc, extensions block, new mode entry, version bump)
- [x] Wire the new mode into `hub-router.json` (routerSignals, vocabularyClasses, tieBreak, version bump)
- [x] Fix sk-design's own `SKILL.md`/`README.md`/`graph-metadata.json`
- [x] Fix external cross-references (`mcp-figma`, `cli-opencode`, `AGENTS.md`)
- [x] Fix changelog symlinks

### Phase 3: Verification
- [x] Systematic link scan across `sk-design` + `mcp-figma` (excluding `node_modules`/`changelog`/`benchmark`): 0 broken
- [x] JSON parse on all 4 touched registries
- [x] Router-mode skill-benchmark: verdict PASS, D5 connectivity 100/100
- [x] Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link resolution | Every `.md` link inside the moved packet, then repo-wide across `sk-design`+`mcp-figma` | Custom Python scanner (markdown-link syntax + normpath existence check) |
| Grep sweep | Zero stale `mcp-open-design` text outside historical changelog entries | `grep -rn` |
| JSON syntax | `mode-registry.json`, `hub-router.json`, `sk-design/graph-metadata.json`, `mcp-figma/graph-metadata.json` | `python3 -c "import json; json.load(open(f))"` |
| Connectivity + routing | Full sk-design skill, router mode | `run-skill-benchmark.cjs --trace-mode router` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator's integration-shape decision | Decision gate | Resolved via AskUserQuestion before any edit | Would have required redoing the registry-shape work under a different architecture |
| `run-skill-benchmark.cjs` D5 connectivity gate | Verification tool | Available, exercised in phases 016/017 already this session | Would need manual link-resolution verification only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Link scan or D5 gate finds a broken/missed reference after the restructure; or the new `transport` axis causes an unexpected routing regression on the existing 24-scenario playbook.
- **Procedure**: `git restore` the 4 registry/graph JSON files and the cross-reference docs back to their pre-phase state; if needed, `git mv` the packet back toward its pre-move shape as an intermediate rollback step before deciding a corrected approach.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator's raw `mv`, integration-shape decision | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Medium | Research + architecture decision, not mechanical |
| Implementation | High | ~25 files across 4 skills + AGENTS.md + 2 changelog symlinks |
| Verification | Medium | Scripted link scan + JSON parse + one benchmark run |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm the link scanner reports 0 broken links across both touched skill trees
- [ ] Confirm no existing mode's weight, alias, or keyword changed (diff review)

### Rollback Procedure
1. Identify which surface regressed (packet internals, registries, or external cross-refs).
2. `git restore` just that surface's files.
3. Re-run the link scan and benchmark to confirm recovery.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert the touched docs/registries only; the moved packet's own physical location (the operator's `mv`) is out of this phase's control to reverse.
<!-- /ANCHOR:enhanced-rollback -->
