---
title: "Feature Specification: sk-vision 006 contract realignment"
description: "Phase parent for closing sk-create-skill conformance drift: real SKILL.md contract, accurate README, references corpus, package hygiene."
trigger_phrases:
  - "sk-vision contract realignment"
  - "sk-vision SKILL.md rewrite"
  - "sk-vision package hygiene"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006 phase parent over two nested children."
    next_safe_action: "Implement 001-skill-md-and-readme from its spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "001-skill-md-and-readme/spec.md"
      - "002-package-hygiene/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-parent-20260816"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-vision 006 contract realignment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | 005-pi-adapter |
| **Successor** | 007-pi-input-images |
| **Handoff Criteria** | Both nested children Complete. SKILL.md passes `validate_document.py --type skill` with zero errors, README is accurate, `references/runtime-reference.md` exists, manifests regenerated, package.json publish/provenance neutralized, `.venv` removed, tests hermetic, rebuild green. Next implementer target is 007-pi-input-images. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped skill fails sk-create-skill conformance: `SKILL.md` still reads as a scaffold stub that defers the runtime to "later children", `README.md` repeats that stale framing, `references/` is empty, and `vision-runtime/package.json` carries upstream provenance with a live publish config. `validate_document.py --type skill` reports four blocking errors on `SKILL.md`.

### Purpose
Deliver the executable skill contract, accurate operator docs, a real references corpus, and a hygienic runtime package so 008 (catalog) and 009 (playbook) can describe the skill truthfully.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-vision/SKILL.md` as the executable contract (13 tools, env vars, adapters, SUCCESS CRITERIA).
- Rewrite `.opencode/skills/sk-vision/README.md`; author `references/runtime-reference.md`; regenerate leaf manifests.
- Neutralize `vision-runtime/package.json` publish/provenance fields; remove `.venv` residue; prove hermetic tests; rebuild `dist/`; sweep residual identifiers.
- Fix the stale continuity metadata in 002-001 (reconciliation happens in 010, but 006 must not regress it).

### Out of Scope
- Any change to `context/` (read-only dump).
- Feature catalog (008), playbook (009), final gate (010).
- Rewriting child phase history of 001-005.
- Publishing to npm (unless the operator explicitly asks in 002-package-hygiene).

### Files to Change
Per-phase detail lives in the nested children. Summary:

| File Path | Change Type | Phase |
|-----------|-------------|-------|
| `.opencode/skills/sk-vision/SKILL.md` | Rewrite | 001-skill-md-and-readme |
| `.opencode/skills/sk-vision/README.md` | Rewrite | 001-skill-md-and-readme |
| `.opencode/skills/sk-vision/references/runtime-reference.md` | Create | 001-skill-md-and-readme |
| `.opencode/skills/sk-vision/leaf-manifest.json` + `leaf-aliases.json` | Regenerate | 001-skill-md-and-readme |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Modify | 002-package-hygiene |
| `.opencode/skills/sk-vision/vision-runtime/.venv` | Delete | 002-package-hygiene |
| `.opencode/skills/sk-vision/vision-runtime/dist/**` | Rebuild | 002-package-hygiene |
| `.opencode/skills/sk-vision/vision-runtime/.gitignore` | Create if absent | 002-package-hygiene |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-skill-md-and-readme/` | SKILL.md contract + README + references corpus | 1 | Planned |
| 2 | `002-package-hygiene/` | package.json, `.venv`, hermetic tests, rebuild, sweep | 1 | Planned |

### 001-skill-md-and-readme (Planned)

**Purpose.** Replace the scaffold stub with the real contract. `SKILL.md` must say what the skill does today: 13 `sk_vision_*` tools, the JSON-RPC runtime lifecycle, `SK_VISION_*` env vars, the OpenCode plugin and Pi extension load paths, WHEN NOT TO USE boundaries, and SUCCESS CRITERIA. `README.md` gets an accurate layout table, quick start, and env-var list. `references/runtime-reference.md` carries the overflow detail (protocol, cache dirs, model, GPU notes, tool semantics table). Regenerate `leaf-manifest.json` and `leaf-aliases.json` after the references corpus changes.

### 002-package-hygiene (Planned)

**Purpose.** Make the fork clean and un-publishable by accident. Remove `publishConfig` and the `publish:npm` script, replace the upstream repository/author URLs with fork-appropriate values (or drop them), delete the 22MB `.venv` residue, prove `bun test` passes without it (hermetic), rebuild `dist/` so it matches `src/`, and sweep for residual `opencode-senses` / `SENSES_` strings outside the LICENSE attribution.

### Phase Transition Rules

- Run `validate.sh --strict` on each child after its implementation.
- Do not touch `context/`. Do not touch files outside the two children's scope tables.
- If `bun test` cannot pass without the deleted `.venv`, stop and report (the fix is to make tests provision their own interpreter, not to restore the residue).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-skill-md-and-readme | 002-package-hygiene | SKILL.md is the real contract and passes the shared validator; README accurate; references corpus exists; manifests regenerated | `validate_document.py --type skill` exit 0; `package_skill.py --check` PASS; `ci-skill-root-metadata.cjs` OK `[S] sk-vision` |
| 002-package-hygiene | 007-pi-input-images | package.json neutralized; `.venv` gone; tests hermetic and green; dist rebuilt; sweep clean | `bun run build && bun test` exit 0 without `.venv`; `rg` sweep exit 1 on residual identifiers; both children `validate.sh --strict` exit 0 |
<!-- /ANCHOR:phase-map -->
