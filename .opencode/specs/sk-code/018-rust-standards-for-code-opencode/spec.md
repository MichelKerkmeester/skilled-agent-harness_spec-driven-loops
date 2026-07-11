---
title: "Feature Specification: Rust Standards + sk-code Reference-File Hygiene (Phase Parent)"
description: "Phase parent with two workstreams. WS1 (001-006, complete): add Rust as a first-class language to the sk-code code-opencode surface. WS2 (007-012): hub-wide reference-file hygiene — split every reference/asset doc over 500 lines into topic-cohesive sub-files and rewire the machine-readable router contract (child SKILL.md RESOURCE_MAPs, the parent smart_routing.md union, the drift-guard and surface-slice vitests, and graded playbook expected_resources) so every deterministic gate stays green."
trigger_phrases:
  - "018 rust standards code-opencode"
  - "sk-code rust language support"
  - "code-opencode rust standards"
  - "sk-code reference file hygiene"
  - "split oversized sk-code references"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode"
    last_updated_at: "2026-07-11T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "WS1 (001-006) complete. Opened WS2 reference-hygiene phases 007-012; executing 007 (code-opencode Rust references)"
    next_safe_action: "Execute phase 007: split the 4 Rust reference/asset docs and rewire the router contract green"
    blockers: []
    key_files:
      - "spec.md"
      - "007-code-opencode-rust-references/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-reference-hygiene"
      parent_session_id: null
    completion_pct: 55
    status: "In Progress"
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Standards + sk-code Reference-File Hygiene (Phase Parent)

## How to read this packet

This phase parent hosts **two workstreams** against the `sk-code` skill:

- **Workstream 1 — Rust standards (phases `001-006`, complete).** Adds **Rust** as a first-class language to the `code-opencode` surface so a future `.rs` task routes to real standards. See phases `001-research/` through `006-gate-verification-rollup/`.
- **Workstream 2 — reference-file hygiene (phases `007-012`).** Every `references/`/`assets` doc across the whole `sk-code` hub that exceeds **500 lines** is split into topic-cohesive sub-files (semantic kebab-case names in a subdir per file; no numbered snippet filenames). Because most of these files are entries in a machine-readable router contract, each split rewires that contract in lockstep and is proven green by the deterministic gates. Scope covers all four surfaces/modes: `code-opencode`, `code-webflow`, `code-quality`, `code-review`.

> **Why WS2 lives here:** the operator elected to house hub-wide reference hygiene under 018 as new phases rather than a standalone packet (Gate 3 answer, 2026-07-11). WS2 is not Rust-specific; the two workstreams share only this parent.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-11 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
**WS1:** `sk-code`'s `code-opencode` surface encodes per-language standards as a `references/<lang>/{style_guide,quality_standards,quick_reference}.md` trio plus an `assets/checklists/<lang>_checklist.md` and a `manual_testing_playbook/language-standards/` entry, wired into a machine-readable SMART ROUTING block whose `RESOURCE_MAP` the parent hub mirrors under a drift guard. Rust was not represented.

**WS2:** 33 reference/asset docs across the hub exceed 500 lines (the largest is 1987). Oversized references are hard to maintain and violate the repo's progressive-disclosure and ≤500-line doc-hygiene norm. But most are load-bearing entries in the router contract — the child SKILL.md `RESOURCE_MAP`s, the parent `shared/references/smart_routing.md` union, the `sk-code-router-sync` and `surface-slice-sync` vitests, and ~30 graded playbook `expected_resources` blocks — so they cannot be split with a naive file move.

### Purpose
**WS1:** produce, from evidence, a Rust standard and ship it into `code-opencode` without breaking the parent-hub union or drift guard. (Complete.)

**WS2:** split every >500-line reference/asset into topic-cohesive sub-files (each ≤500 lines) and rewire every live authored reference to the new parts — leaving generated benchmark reports and historical spec-docs/changelogs untouched — so the deterministic router gates (`sk-code-router-sync.vitest.ts`, `surface-slice-sync.vitest.ts`, `code-surface-path-parse.vitest.ts`) and `validate.sh --strict` all stay green.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Each workstream's detail lives in its phase children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for this packet's phase children (both workstreams).
- WS2: splitting the 33 oversized `references/`/`assets` docs across `code-opencode`, `code-webflow`, `code-quality` (and a documented decision on the 2 flagged `code-review` files), and rewiring the machine-readable router contract to match.

### Out of Scope
- WS1: writing Rust application code (ships *standards*, not an implementation).
- WS2: changing the *content* of any reference (splits are lossless partitions — no rewriting), adding new intents/sub-routing, or splitting files ≤500 lines.
- WS2 flagged exemptions (operator decision 2026-07-11): `code-review/SKILL.md` (a skill entry doc — splitting breaks the routing frontmatter contract) and `code-review/manual_testing_playbook/manual_testing_playbook.md` (a benchmark index over an already-split scenario tree).
- Editing generated benchmark reports (`benchmark/*/skill-benchmark-report.*`) or historical spec-docs/changelogs to point at new paths (would falsify record; reports refresh on the next benchmark run).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Update | parent | Add WS2 framing + phase map (this edit) |
| `graph-metadata.json` | Update | parent | children_ids += 007-012; last_active_child_id → 007 |
| `007-code-opencode-rust-references/**` | Create | 007 | Split 4 Rust docs (1987/1571/1475/1005) → 21 parts; rewire |
| `008-code-opencode-other-references/**` | Create | 008 | Split 9 code-opencode non-Rust + shared docs → ~22 parts |
| `009-code-webflow-implementation-references/**` | Create | 009 | Split 11 code-webflow implementation docs → ~34 parts |
| `010-code-webflow-other-references/**` | Create | 010 | Split 8 code-webflow docs (incl. debugging 1940) → ~30 parts |
| `011-code-quality-and-flagged/**` | Create | 011 | Split code-quality checklist → parts; record code-review exemptions |
| `012-gate-verification-rollup/**` | Create | 012 | Full vitest + validate --strict recursive + parent rollup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

### Workstream 1 — Rust standards (complete)

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 10-round deep-research pass producing `research.md` with the Rust standard + upgrade manifest | Complete |
| 002 | `002-standard-docs/` | Author the Rust trio + checklist + playbook | Complete |
| 003 | `003-surface-routing/` | `code-opencode/SKILL.md`: `.rs`/Cargo detection, RUST intent/resource, CODE_QUALITY registration | Complete |
| 004 | `004-parent-union-drift-guard/` | `shared/references/smart_routing.md` parent RUST union + drift guard green | Complete |
| 005 | `005-touchpoints-and-multilang/` | Six registration touchpoints + touched-language-set behavior | Complete |
| 006 | `006-gate-verification-rollup/` | Run the WS1 gate plan and roll up the parent | Complete |

### Workstream 2 — reference-file hygiene (in progress)

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 007 | `007-code-opencode-rust-references/` | Split the 4 Rust docs (style_guide 1987, quick_reference 1571, quality_standards 1475, rust_checklist 1005) → 21 parts; rewire RUST + CODE_QUALITY RESOURCE_MAPs, parent union, both vitests, playbook 009 expected_resources | Planned |
| 008 | `008-code-opencode-other-references/` | Split 9 code-opencode docs (typescript/shell/javascript trios + shared code_organization/universal_patterns) | Planned |
| 009 | `009-code-webflow-implementation-references/` | Split 11 code-webflow implementation-cluster docs | Planned |
| 010 | `010-code-webflow-other-references/` | Split 8 code-webflow docs (debugging 1940, css patterns/quality, javascript quality, shared dev_workflow, verification, minification) | Planned |
| 011 | `011-code-quality-and-flagged/` | Split code-quality `code_quality_checklist.md` → parts; document the 2 code-review exemptions | Planned |
| 012 | `012-gate-verification-rollup/` | Full deterministic gate (both vitests + path-parse + `validate.sh --recursive --strict`), live-benchmark re-baseline follow-up, parent rollup | Planned |

### Phase Transition Rules

- WS1 (001-006) is complete and frozen; WS2 does not modify WS1's phase docs.
- WS2 phases 007-011 each: split their files (lossless line-partition), rewire the router contract for those files, and MUST leave `sk-code-router-sync.vitest.ts` + `surface-slice-sync.vitest.ts` + `code-surface-path-parse.vitest.ts` green before commit.
- 012 is the terminal gate: recursive strict validation + a clean full vitest run + parent rollup. The live Mode-B benchmark re-baseline (some runs paid) is a tracked follow-up, not a blocker (same posture as the pre-existing stale-report limitation).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 006 | 007 | WS1 done; parent widened for WS2 | This spec + graph-metadata list 007-012 |
| 007-011 | next | Phase's files split; router gates green; phase committed | 3 vitests pass; no dangling old paths grep-clean; `validate.sh --strict` on the child |
| 011 | 012 | All hub reference splits done | Every routable doc ≤500 lines; child maps == parent union |
| 012 | done | Recursive strict + full vitest green; parent rolled up | `validate.sh --recursive --strict` + full vitest suite |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- WS1: none. WS2: live Mode-B benchmark re-baseline requires paid runs and is deferred to a post-012 follow-up (deterministic gates cover correctness in the meantime).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **WS1 children**: `001-research/` … `006-gate-verification-rollup/` (complete)
- **WS2 children**: `007-code-opencode-rust-references/` … `012-gate-verification-rollup/`
- **Upgrade target**: `../../../skills/sk-code/` (all four surfaces/modes)
- **Router contract**: `../../../skills/sk-code/shared/references/smart_routing.md`; guards under `../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/`
- **Graph metadata**: `graph-metadata.json`
