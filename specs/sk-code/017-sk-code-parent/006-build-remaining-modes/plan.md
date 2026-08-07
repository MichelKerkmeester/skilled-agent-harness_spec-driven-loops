---
title: "Implementation Plan: Phase 6 — build remaining modes"
description: "Recover the pre-hub flat doctrine, distribute it into four mode contracts by lifecycle phase, mirror the sk-design shape, pin registry tool surfaces, and verify links/hygiene/one-identity."
trigger_phrases:
  - "sk-code build remaining modes plan"
  - "code mode contract plan"
  - "sk-code doctrine distribution plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/006-build-remaining-modes"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the completed mode-contract build plan"
    next_safe_action: "phase 007 advisor-and-integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6 — build remaining modes

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown; JSON routing metadata read-only |
| **Framework** | `sk-code` parent hub with nested mode packets; `sk-design` as the mirror shape |
| **Storage** | `.opencode/skills/sk-code/{code-implement,code-quality,code-debug,code-verify}/` |
| **Testing** | Deterministic relative-link resolution, comment-hygiene scan of code fences, tool-surface equality vs registry, one-identity scan |

### Overview
Recover the pre-hub flat `sk-code/SKILL.md` doctrine from git history, split it by lifecycle phase, and author four full mode contracts. Each contract mirrors the sk-design mode shape, consumes surface detection from `../shared/`, points at that packet's relocated material, and pins its `allowed-tools` to the registry. Claude orchestrates and verifies; GPT-5.5-fast (high) via cli-opencode authors the contracts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004 relocated the reference/asset/script material the contracts point at.
- [x] Phase 005 built the `code-review` sibling contract that the others cross-reference.
- [x] The flat doctrine is recoverable from history and its section-to-mode ownership is mapped.
- [x] The registry tool surfaces and the sk-design mirror shape are fixed inputs.

### Definition of Done
- [x] Four full `SKILL.md` contracts replace the placeholders.
- [x] Each `allowed-tools` equals the registry `toolSurface.allowed` for that mode.
- [x] No mode packet gains a `graph-metadata.json`.
- [x] Every relative link in the eight authored files resolves.
- [x] No comment-hygiene violation inside code fences.
- [x] Phase 006 docs record the build, verification, and deferrals.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doctrine distribution over a routing hub: the hub stays routing-only, `shared/` owns surface detection, and each mode packet owns one lifecycle-phase contract that consumes shared detection and loads only its own resources.

### Key Components
- **Content source**: the pre-hub flat `sk-code/SKILL.md` (recovered via `git show <scaffold-commit>~1:...`), holding the Phase 0/1/1.5/2/3 doctrine.
- **Mirror shape**: `sk-design/design-interface/SKILL.md` and `design-audit/SKILL.md` (section set, depth, shared-consumption pattern).
- **Four mode packets**: `code-implement` (Phase 0/1), `code-quality` (Phase 1.5), `code-debug` (Phase 2), `code-verify` (Phase 3, non-mutating).
- **Registry**: `mode-registry.json` is the read-only source of truth for each mode's tool surface.

### Data Flow
Recover flat doctrine → map sections to modes → dispatch GPT-5.5 (implement solo; quality+debug+verify grouped) to author contracts + READMEs → verify tool surfaces, links, hygiene, one-identity, and content against the doctrine → document the phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase affects only the four non-review mode packets and the approved 006 phase docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-implement/{SKILL,README}.md` | Placeholder implement packet | author Phase 0/1 contract + README | tool surface = registry; links resolve; doctrine placed |
| `code-quality/{SKILL,README}.md` | Placeholder quality packet | author Phase 1.5 contract + README | tool surface = registry (no Write/Task); links resolve |
| `code-debug/{SKILL,README}.md` | Placeholder debug packet | author Phase 2 contract + README | tool surface = registry (no Write); links resolve |
| `code-verify/{SKILL,README}.md` | Placeholder verify packet | author Phase 3 contract + README | tool surface = registry (non-mutating); links resolve |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Recover the pre-hub flat doctrine and map each section to its owning mode.
- [x] Inventory `shared/` (consumed) and each packet's relocated material (pointed at).
- [x] Confirm the registry tool surface for each mode and the mirror shape.

### Phase 2: Core
- [x] Dispatch GPT-5.5-fast (high) for `code-implement` (Phase 0/1 authoring mode) and verify.
- [x] Dispatch GPT-5.5-fast (high) for `code-quality` + `code-debug` + `code-verify` as a coherent set and verify.
- [x] Confirm each contract mirrors the sk-design section set and consumes `../shared/`.

### Phase 3: Verification
- [x] Assert each `allowed-tools` equals the registry tool surface for that mode.
- [x] Assert no packet-local `graph-metadata.json` exists (one-identity holds).
- [x] Resolve every relative link across the eight authored files.
- [x] Scan code fences for comment-hygiene violations.
- [x] Read each contract to confirm correct doctrine placement and handoff chain.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Tool-surface equality | Four SKILL.md frontmatters | Grep frontmatter vs `mode-registry.json` |
| One-identity | Four mode packets | `find -name graph-metadata.json` |
| Link resolution | Eight authored files | Deterministic relative-path resolver |
| Comment hygiene | Four SKILL.md code fences | Fenced-block scan for spec paths / artifact ids |
| Content correctness | Four contracts | Direct read vs the recovered doctrine and the mirror shape |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 relocation | Internal | Complete | Contracts would have nothing to point at |
| Phase 005 code-review contract | Internal | Complete | Sibling cross-references would dangle |
| Recovered flat doctrine | Internal | Complete | No content source to distribute |
| Phase 007 advisor rebuild | Internal | Pending | Advisor keyword merge and graph rebuild happen next |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A mode contract is wrong, widens a tool surface, or breaks links before phase 007.
- **Procedure**: The four packets are additive edits over committed placeholders in a git-tracked worktree; revert the mode `SKILL.md`/`README.md` edits (or `git reset` to the pre-006 commit) without affecting the hub, registry, shared, or other packets. No destructive step occurs in this phase.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
