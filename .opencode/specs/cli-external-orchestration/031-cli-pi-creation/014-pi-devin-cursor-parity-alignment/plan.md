---
title: "Implementation Plan: Pi devin/cursor parity alignment"
description: "Plan for closing three concrete gaps between cli-pi and its cli-devin/cli-cursor siblings: a missing unique-capabilities reference, stale confidence framing, and missing cross-validation/anti-patterns/overview sections."
trigger_phrases: ["pi devin cursor parity alignment plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/014-pi-devin-cursor-parity-alignment"
    last_updated_at: "2026-07-27T21:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md: direct-authorship pass, GLM-5.2 independent review"
    next_safe_action: "None -- phase complete"
    blockers: []
    key_files: ["references/pi-tools.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi devin/cursor parity alignment

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Markdown reference/asset documents (sk-doc `reference` type); JSON leaf-manifest regeneration via an existing generator. |
| **Framework** | None new — reuses `devin-tools.md`/`cursor-tools.md`'s structural pattern and this packet's own confidence-labeling discipline. |
| **Storage** | None. |
| **Testing** | `validate_document.py --type reference` per file; `parent-skill-check.cjs` for the hub; a full manual grep-based `§N` cross-reference audit; GLM-5.2 independent review. |

### Overview
Author one new reference (`pi-tools.md`), upgrade two references' stale confidence framing, add two missing sections to a third, add a missing OVERVIEW section to five files (renumbering each), expand the prompt-template asset, and wire the new reference into the hub's registration surfaces. Work directly (no LUNA dispatch) since the task is comparative editorial judgment across three packets' existing content, not new-artifact scaffolding a fresh model can do from a brief alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `cli-devin`'s and `cli-cursor`'s complete skill packets cataloged via 3 parallel research agents. [EVIDENCE: workflow `wf_f578832c-f69`]
- [x] `cli-pi`'s own current reference/asset files read in full before drafting any edit. [EVIDENCE: full Read calls on each touched file]
- [x] The 3 concrete gaps (missing unique-capabilities reference, stale confidence framing, missing structural sections) confirmed against real file content, not the catalog's paraphrase alone.

### Definition of Done
- [x] `pi-tools.md` exists and matches the devin-tools.md/cursor-tools.md structural pattern.
- [x] Every "Per Pi docs, unconfirmed" claim phases 007/012/013 actually confirmed is corrected to cite the real evidence.
- [x] `integration-patterns.md` has a cross-validation section and an anti-patterns section.
- [x] Every `§N` cross-reference across the whole packet resolves to the section that actually carries that number.
- [x] GLM-5.2 independent review completed, findings addressed.
- [x] `validate.sh --strict` passes for this phase folder; whole-packet `--recursive --strict` still `Errors: 0`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Match structure, not content: every new/edited file follows `cli-devin`'s or `cli-cursor`'s own section shape (OVERVIEW → per-topic content → comparison tables → anti-patterns), but every fact stays tagged per `cli-pi`'s own Confirmed/Type-confirmed/Per-Pi-docs-unconfirmed discipline — never diluted to look more "aligned" than the underlying evidence supports.

### Key Components
- **`references/pi-tools.md`** (new): OVERVIEW → 5 unique-capability sections (RPC, extensions, prompt templates, tool surface, reasoning-effort) → CAPABILITY COMPARISON table → BEST PRACTICES, matching `devin-tools.md`/`cursor-tools.md`'s exact section shape.
- **Confidence upgrades**: targeted edits to `native-skills-and-extensions.md` §§3-4/7 (now §§4-5/8 post-renumber) and `mcp-and-third-party-packages.md` §§2-4 (now §§3-5 post-renumber), each citing a specific phase number for the correction.
- **`integration-patterns.md` additions**: 2 new sections appended after the existing HANDBACK FORMAT section, matching both siblings' own CROSS-VALIDATION/ANTI-PATTERNS section names and internal shape (strength table + strategy table; 5 named BAD/GOOD pairs).
- **OVERVIEW-insertion script** (`insert_overview.py`, scratch-only): finds the first `## ` heading in a file, inserts a new `## 1. OVERVIEW` section before it, renumbers every subsequent `## N. TITLE` heading by +1, and shifts every same-file `§N` reference by +1 — run once per file, followed by a manual cross-file reference audit since the script cannot distinguish a same-file reference from a cross-file one embedded in prose.

### Data Flow
`cli-devin`/`cli-cursor`'s real reference files (read directly) -> structural pattern extracted -> applied to `cli-pi`'s corresponding file, with content sourced from phases 007/012/013's own `implementation-summary.md` files, never invented. `pi-tools.md` -> `SKILL.md`/`README.md` (linked) -> `leaf-manifest.json` (regenerated) -> `parent-skill-check.cjs` (verified).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Catalog `cli-devin`, `cli-cursor`, and `cli-pi`'s current skill-packet content via 3 parallel research agents.
- [x] Direct-read `cli-pi`'s own `prompt-templates.md`, `integration-patterns.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, `cli-reference.md`.
- [x] Direct-read `cursor-tools.md`, `devin-tools.md`, and both siblings' `integration-patterns.md` cross-validation/anti-patterns sections as the structural template.

### Phase 2: Core Implementation
- [x] Author `references/pi-tools.md`.
- [x] Upgrade confidence framing in `native-skills-and-extensions.md` and `mcp-and-third-party-packages.md`, citing phases 007/012/013.
- [x] Add CROSS-VALIDATION and ANTI-PATTERNS sections to `integration-patterns.md`; correct its stale confidence note.
- [x] Insert a new OVERVIEW section into 5 files; renumber each; audit and correct every `§N` cross-reference across the whole packet (6 real mismatches found and fixed).
- [x] Rewrite `assets/prompt-templates.md` with a new OVERVIEW/flag-reference section, Examples, and a Gate-3-bypass template.
- [x] Update `SKILL.md`/`README.md`; regenerate `leaf-manifest.json`.
- [x] Fix 2 pre-existing `h2_not_uppercase` lint issues in `mcp-and-third-party-packages.md`.
- [x] Bump `version:` to `1.1.0.0` on every touched file; author `changelog/v1.1.0.0.md`.

### Phase 3: Verification
- [x] `validate_document.py --type reference` on all 9 touched/new markdown files.
- [x] `parent-skill-check.cjs` on the hub.
- [x] Dispatch GLM-5.2 (`devin -p --model glm-5.2`) for an independent review; fix every blocking/minor finding (1 blocking + 3 minor found, all fixed).
- [x] Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 14 phases).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document structure | All 9 touched/new markdown files | `validate_document.py --type reference` |
| Hub registration | `leaf-manifest.json` byte-parity | `parent-skill-check.cjs` |
| Cross-reference correctness | Every `§N` in every touched file | Manual grep audit against actual current headings |
| Independent fact-check | All 11 changed/new files vs. the real repo | GLM-5.2 via `devin -p --model glm-5.2` |
| Structural (whole packet) | Parent + all 14 phase folders | `validate.sh --recursive --strict` (main-tree round-trip) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `007-pi-mcp-host-integration`, `012-pi-runtime-compatibility`, `013-pi-manual-testing-playbook-authoring` | Internal | Complete | This phase's content upgrades cite their real findings; a gap here would mean nothing to upgrade |
| `cli-devin/references/devin-tools.md`, `cli-cursor/references/cursor-tools.md` | Internal | Present | Structural pattern source for the new `pi-tools.md` |
| `sk-doc/create-skill/scripts/generate-leaf-manifest.cjs` (existing) | Internal | Present | Needed to register the new reference without hand-editing JSON |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A confidence upgrade is later found to overstate a phase's real finding, or a cross-reference is found wrong post-merge.
- **Procedure**: `git checkout -- <path>` for the specific file (all changes are documentation-only, no runtime artifact touched); re-run `validate_document.py` and the manual `§N` audit before re-committing.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `../003-cli-pi-skill-packet/spec.md` (original packet-structure precedent)
