---
title: "Feature Specification: Pi devin/cursor parity alignment"
description: "Align cli-pi's references, assets, and general setup closer to the cli-devin and cli-cursor mode skills: a new unique-capabilities reference, confidence-level content upgrades reflecting phases 007/012/013's real findings, cross-validation/anti-patterns sections, and a fuller prompt-template library."
trigger_phrases:
  - "pi devin cursor parity alignment"
  - "pi references alignment"
  - "pi skill packet alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/014-pi-devin-cursor-parity-alignment"
    last_updated_at: "2026-07-27T21:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built directly, GLM-5.2 independently reviewed, findings addressed, closed Complete"
    next_safe_action: "None -- terminal phase; packet re-closes at 14 phases"
    blockers: []
    key_files: ["references/pi-tools.md", "references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md", "references/integration-patterns.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Confirmed devin/cursor's own reference-file convention (OVERVIEW section, cross-validation table, anti-patterns section) via direct reads, not the earlier session catalog alone.", "Confirmed 2 content-freshness gaps: native-skills-and-extensions.md and mcp-and-third-party-packages.md both still framed phases 007/012/013's confirmed findings as unconfirmed.", "GLM-5.2 independently reviewed all 11 changed/new files, cross-checked every section cross-reference and every devin/cursor factual claim against the real repo."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi devin/cursor parity alignment

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Phase** | 14 of 14 |
| **Predecessor** | `../013-pi-manual-testing-playbook-authoring/spec.md` |
| **Successor** | None (final phase) |
| **Handoff Criteria** | **Entry**: phases 007/012/013 landed real, live-confirmed findings this phase's content updates cite. **Exit (terminal)**: all touched reference/asset files pass `validate_document.py`, `parent-skill-check.cjs` and the leaf-manifest byte-check both stay clean, and GLM-5.2's independent review returns no unresolved blocking finding. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the CLI Pi creation specification — a third post-hoc phase, added at the operator's explicit request to align `cli-pi`'s references, assets, and general setup closer to the `cli-devin` and `cli-cursor` mode skills, which this packet's own earlier phases (003/005/006/008) used as structural precedent but did not fully match in a few concrete respects.

**Scope Boundary**: Documentation and content alignment only — no `.pi/` runtime artifacts, no deep-loop executor changes, no registry-shape changes beyond the routine leaf-manifest regeneration a new reference file requires.

**Dependencies**:
- `007-pi-mcp-host-integration`, `012-pi-runtime-compatibility`, `013-pi-manual-testing-playbook-authoring` — the real, live-confirmed findings this phase's content updates cite (stdio MCP transport, agent-mirroring, prompt-template/extension discovery).
- `cli-devin/` and `cli-cursor/`'s own reference files (`devin-tools.md`, `cursor-tools.md`, both packets' `integration-patterns.md`) as the structural pattern this phase's new/edited files match.

**Deliverables**:
- A new `references/pi-tools.md` cataloging Pi capabilities with no sibling analog, matching the `devin-tools.md`/`cursor-tools.md` structural pattern.
- Confidence-level upgrades in `references/native-skills-and-extensions.md` and `references/mcp-and-third-party-packages.md`, replacing stale "Per Pi docs, unconfirmed" framing with citations to phases 007/012/013's real findings where those phases actually confirmed the behavior.
- A CROSS-VALIDATION WITH OTHER CLI EXECUTORS section and an ANTI-PATTERNS section added to `references/integration-patterns.md`, matching every sibling packet's own file.
- An OVERVIEW section (Core Principle/Purpose/When to Use) added to the 5 reference files that lacked one, matching the section every devin/cursor reference file already has.
- `assets/prompt-templates.md` expanded with an OVERVIEW/flag-reference section, a concrete "Example" under every template, and a new Gate-3-bypass template.
- `SKILL.md`, `README.md`, and the hub's `leaf-manifest.json` updated to register the new reference.
- `changelog/v1.1.0.0.md` documenting the release; `SKILL.md`/`README.md`/every touched reference and asset file's `version:` bumped to `1.1.0.0`.

**Changelog**: `changelog/v1.1.0.0.md` (this phase's own packet-level changelog entry — distinct from this spec-folder documentation).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-pi` was built to structurally mirror `cli-devin`/`cli-cursor` from the start (phase 003's skill packet, phases 005/006/008's designs), but a direct file-by-file comparison found three real gaps that had grown since: (1) `cli-pi` never gained a "unique capabilities" reference — both `cli-devin` (`devin-tools.md`) and `cli-cursor` (`cursor-tools.md`) have one, cataloging what makes that CLI distinctive versus its 5 siblings; (2) two of `cli-pi`'s own references (`native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`) still framed several claims as "Per Pi docs, unconfirmed" even though phases 007/012/013 — landed after those references were originally written — had already live-confirmed the behavior (stdio MCP transport, agent-mirroring, prompt-template/extension discovery at the project-local surfaces this repo populates); (3) `cli-pi`'s `integration-patterns.md` and `assets/prompt-templates.md` lacked sections both siblings' equivalents have (cross-validation-vs-siblings table, anti-patterns section, an OVERVIEW/flag-reference section, and concrete "Example" fill-ins under every template).

### Purpose
Close these three gaps directly — add the missing reference, upgrade stale confidence framing to cite the real, already-landed evidence, and add the missing structural sections — while preserving `cli-pi`'s own deliberate divergences (its confidence-labeling discipline, the pinned-contract citation pattern, the alias-collision rationale) rather than diluting them to force an exact structural match with siblings that have a materially different, more fully-verified contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `references/pi-tools.md`: persistent bidirectional RPC (`--mode rpc`), first-party native extensions (`.pi/extensions/*.ts`), first-party native prompt templates (`.pi/prompts/*.md`), the minimal 7-tool built-in surface with `--tools` allowlisting, and `--thinking` reasoning-effort control — each framed against the other 5 CLI executors, each fact tagged Confirmed/Type-confirmed/Per-Pi-docs-unconfirmed per this packet's own discipline.
- Confidence-level corrections in `references/native-skills-and-extensions.md` (§4 PROMPT TEMPLATES, §5 EXTENSIONS, §8 DISCOVERY VERIFICATION PLAN) and `references/mcp-and-third-party-packages.md` (§3 PI-SUBAGENTS, §4 PI-MCP-EXTENSION, §5 MCP TRANSPORT DECISION, §11 CONFIDENCE CHECKLIST), citing phases 007/012/013 by number.
- `references/integration-patterns.md`: a new CROSS-VALIDATION WITH OTHER CLI EXECUTORS section (strength-comparison table + strategy table) and a new ANTI-PATTERNS section (5 named BAD/GOOD pairs), matching the section names and shape both sibling packets use; §9's stale confidence note corrected to match the upgrades above.
- An OVERVIEW section (Core Principle/Purpose/When to Use) prepended to `agent-delegation.md`, `model-dispatch-gpt-5.6.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, and `integration-patterns.md`, with every subsequent section renumbered and every same-file and cross-file `§N` reference in the whole packet corrected to match.
- `assets/prompt-templates.md`: a new OVERVIEW section (Purpose/Usage/flag-reference table), a concrete "Example" added under every existing template, and a new SPEC-FOLDER PRE-APPROVAL (GATE 3 BYPASS) template.
- `SKILL.md` §5 REFERENCES and `README.md` §5 Resource Map / §9 RELATED DOCUMENTS updated to list `pi-tools.md`; the hub's `leaf-manifest.json` regenerated via `generate-leaf-manifest.cjs --write` to register it.
- Two pre-existing `h2_not_uppercase` lint violations in `mcp-and-third-party-packages.md` (predating this phase) fixed via `validate_document.py --fix` while the file was already open for the renumbering pass.
- `changelog/v1.1.0.0.md` and a `version: 1.1.0.0` bump on every file this phase actually touched (not `prompt-quality-card.md`, which this phase left untouched).

### Out of Scope
- Any change to `.pi/` runtime artifacts themselves (prompts, agents, extensions, mcp.json, settings.json) — those are phase 012's/007's own deliverables; this phase only updates the DOCUMENTATION describing them.
- Any change to the deep-loop executor, `mode-registry.json`'s or `hub-router.json`'s own entries, or the manual-testing-playbook — none of those needed a structural change for this alignment.
- Resolving the two genuinely still-open items this phase's own content upgrades explicitly name (native skill discovery precedence/flattening; a live lifecycle-event firing trace) — both need a credentialed provider session neither this phase nor any prior phase in this packet has had.
- Rewriting phase 007/012/013's own historical implementation-summary.md/checklist.md/tasks.md content — those remain accurate historical records of what was verified at completion time; only this phase's own reference-file content was updated to reflect the fuller picture now available.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/cli-pi/references/pi-tools.md` | Create | Unique-capabilities catalog matching the devin-tools.md/cursor-tools.md pattern. |
| `cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md` | Modify | Confidence upgrades (phases 012/013) + new OVERVIEW section, sections renumbered. |
| `cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md` | Modify | Confidence upgrades (phases 007/012) + new OVERVIEW section + 2 lint fixes, sections renumbered. |
| `cli-external-orchestration/cli-pi/references/integration-patterns.md` | Modify | New CROSS-VALIDATION and ANTI-PATTERNS sections + new OVERVIEW section, sections renumbered. |
| `cli-external-orchestration/cli-pi/references/agent-delegation.md` | Modify | New OVERVIEW section, sections renumbered. |
| `cli-external-orchestration/cli-pi/references/model-dispatch-gpt-5.6.md` | Modify | New OVERVIEW section, sections renumbered. |
| `cli-external-orchestration/cli-pi/references/cli-reference.md` | Modify | One cross-reference to pi-tools.md added. |
| `cli-external-orchestration/cli-pi/assets/prompt-templates.md` | Modify | New OVERVIEW/flag-reference section, concrete Examples added, new Gate-3-bypass template. |
| `cli-external-orchestration/cli-pi/SKILL.md` | Modify | pi-tools.md added to §5 REFERENCES. |
| `cli-external-orchestration/cli-pi/README.md` | Modify | pi-tools.md added to §5 Resource Map and §9 RELATED DOCUMENTS. |
| `cli-external-orchestration/cli-pi/changelog/v1.1.0.0.md` | Create | Packet-level release changelog entry. |
| `cli-external-orchestration/leaf-manifest.json` | Regenerate | `pi-tools.md` registered as a leaf resource. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new `pi-tools.md` reference documents Pi capabilities with no sibling analog, matching the devin-tools.md/cursor-tools.md structural pattern. | File exists, passes `validate_document.py --type reference`, registered in `leaf-manifest.json`, linked from `SKILL.md`/`README.md`. |
| REQ-002 | Every "Per Pi docs, unconfirmed" claim that phases 007/012/013 actually confirmed is corrected to cite the real evidence. | `native-skills-and-extensions.md` and `mcp-and-third-party-packages.md` diffs show the specific phase-cited corrections; no claim overstates what those phases' own implementation-summary.md files say. |
| REQ-003 | `integration-patterns.md` gains a cross-validation-vs-siblings section and an anti-patterns section. | Both sections present, matching sibling packets' section names; anti-patterns section has at least 5 named BAD/GOOD pairs. |
| REQ-004 | Every `§N` cross-reference in the whole `cli-pi` packet, after renumbering 5 files, points to the section that actually carries that number. | A full grep-based audit of every `§[0-9]` occurrence across all touched files, verified against actual current section numbers, with 0 mismatches. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `prompt-templates.md` gains an OVERVIEW/flag-reference section and a concrete Example under every template. | `validate_document.py` passes; every template section has both a placeholder form and an "**Example:**" block. |
| REQ-006 | GLM-5.2 independently reviews all new/changed files for factual accuracy against the real repo (not just internal consistency). | Review dispatched via `devin -p --model glm-5.2`; verdict recorded in `implementation-summary.md`; every blocking finding fixed before commit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 touched/new markdown files pass `validate_document.py --type reference` with 0 issues.
- **SC-002**: `parent-skill-check.cjs` on the hub returns 0 warnings, including the `10b-byte-drift` leaf-manifest check.
- **SC-003**: GLM-5.2's independent review returns no unresolved blocking finding.
- **SC-004**: Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 14 phases) returns `Errors: 0, Warnings: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renumbering 5 files' sections risks silently breaking a cross-reference (same-file or cross-file) that a reader or a future edit would rely on. | Medium — a wrong `§N` reads as confident but wrong, worse than no reference at all. | Full grep-based audit of every `§[0-9]` occurrence across every touched file, verified by hand against actual current section headings, not assumed from the renumbering script alone. |
| Risk | Upgrading "unconfirmed" framing to "confirmed" could overstate what phases 007/012/013 actually verified. | Medium — false confidence is worse than honest hedging in a packet whose whole discipline is confidence-labeling. | Every upgrade cites the specific phase number; GLM-5.2 independently cross-checked each against the real `implementation-summary.md` files, not from memory. |
| Dependency | `007-pi-mcp-host-integration`, `012-pi-runtime-compatibility`, `013-pi-manual-testing-playbook-authoring` | Complete — their real findings are what this phase's content upgrades cite. | Every citation names the exact phase number; no upgrade invents a finding those phases didn't actually report. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — this phase's scope (documentation/content alignment) had no unresolved design question; the two remaining Pi-native open questions (skill-discovery precedence, live lifecycle-event firing) are explicitly named as still-open in the content itself, inherited from phases 004/008 and not something this phase attempted to resolve.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../003-cli-pi-skill-packet/spec.md`, `../005-pi-command-layer/spec.md`, `../006-pi-agent-bridge/spec.md`, `../008-pi-hook-extension-layer/spec.md` (earlier phases whose designs this phase's content cites)
- `../007-pi-mcp-host-integration/implementation-summary.md`, `../012-pi-runtime-compatibility/implementation-summary.md`, `../013-pi-manual-testing-playbook-authoring/implementation-summary.md` (source of the confirmed findings this phase's content upgrades cite)
- `.opencode/skills/cli-external-orchestration/cli-devin/references/devin-tools.md`, `.opencode/skills/cli-external-orchestration/cli-cursor/references/cursor-tools.md` (structural pattern for the new `pi-tools.md`)
