---
title: "Feature Specification: sk-code-obsidian surface and Obsidian source-convention adoption"
description: "A read-only sk-code SURFACE evidence packet for the Note Database plugin, and the source conventions it documents, applied to the plugin tree."
trigger_phrases:
  - "sk-code-obsidian surface"
  - "obsidian plugin code conventions"
  - "obsidian surface detection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface"
    last_updated_at: "2026-08-28T20:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded the 11-leaf phased packet and recorded the measured repo audit"
    next_safe_action: "Author 001 surface design plan against the live sk-code hub contract"
    blockers: []
    key_files:
      - "spec.md"
      - "roadmap.md"
      - "002-repo-convention-audit/audit.json"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Scope includes the kebab-case rename of the plugin source (operator, 2026-08-28)"
      - "Open P0/P1 debt is encoded as evidence, not fixed here (operator, 2026-08-28)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Feature Specification: sk-code-obsidian surface and Obsidian source-convention adoption

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Parent Spec** | None — top-level packet under `specs/sk-code/` |
| **Parent Packet** | None |
| **Predecessor** | `004-component-screenshot-system` |
| **Successor** | None |
| **Handoff Criteria** | The hub bundles `sk-code-obsidian` for a plugin task, and every plugin gate is green from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Code work on this plugin resolves to the `UNKNOWN` surface. `sk-code` detects `OPENCODE`,
`PI_REMOTE`, `WEBFLOW`, then falls through, so a task here loads no stack evidence: not the
Obsidian plugin API boundary, not the single-stylesheet ownership model, not the `.db-*` class
grammar, not the screenshot harness contract, and not the verification gate this repository
actually runs. An agent editing the plugin has to rediscover all of it, and the record shows that
rediscovery goes wrong — two independent audits of the preceding packets found ticked items the
code did not support.

The plugin tree compounds this by carrying none of the source conventions a surface packet would
normally document. Measured at `6b3d77e`: zero of 249 source files open with a `MODULE:` banner,
four contain a box-drawing section rule, no folder anywhere under `src/` or `tools/` carries a
`README.md` or `CODE.md`, and 232 of 248 filenames are PascalCase with no scanner enforcing
anything. There is no convention to point at.

### Purpose

Build `sk-code-obsidian` as a read-only SURFACE evidence packet under the `sk-code` parent hub,
mirroring `sk-code-mobile-cli` exactly in file naming, section grammar, and inline-comment style;
wire a new `OBSIDIAN` surface into detection and hub routing so plugin work loads that evidence
automatically; and adopt in the plugin tree the conventions the packet documents, so the evidence
describes something real rather than something aspirational.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level, alongside
> `goal.md` and `roadmap.md`. All detailed planning, task breakdowns, checklists, and decisions
> live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `sk-code-obsidian` surface packet under `sk-code/`, shaped exactly like `sk-code-mobile-cli`:
  `SKILL.md`, `README.md`, `references/` with its five purpose-named subfolders and the three
  symlinked workflow documents, `assets/` checklists, `manual-testing-playbook/`, `changelog/`,
  and `scripts/`.
- Hub wiring: a `mode-registry.json` surface entry, `hub-router.json` signals and vocabulary
  classes, `ROUTER.md`, and an `OBSIDIAN` branch in `shared/references/stack-detection.md`.
- Plugin source adoption: `MODULE:` banners and numbered upper-case box-drawing sections across
  `src/` and `tools/`; paired `README.md` / `CODE.md` folder documents on the threshold; the same
  section grammar in `styles.css`; and a manifest-driven kebab-case rename of the source tree.
- Three scanners in the plugin repo that make each of those conventions executable.

### Out of Scope (frozen)

- The six open P0/P1 items and the roughly 145 unphotographed surfaces recorded in
  `<plugin-repo>/specs/public/HANDOVER.md`. They are encoded as evidence in this packet's references and
  checklists so a bundled workflow honors them; they are not fixed here.
- Any change to plugin behavior. Every phase is a documentation, naming, or comment change, with
  the sole exception of new scanner scripts under `tools/naming/`.
- The 115-problem lint baseline. It is recorded, not reduced.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `sk-code/sk-code-obsidian/**` | Create | 004-007 | The surface packet |
| `sk-code/mode-registry.json` | Modify | 003-hub-wiring | Surface entry and axis membership |
| `sk-code/hub-router.json` | Modify | 003-hub-wiring | Router signals and vocabulary classes |
| `sk-code/ROUTER.md` | Modify | 003-hub-wiring | Stage-two routing, only if leaves are exposed |
| `sk-code/shared/references/stack-detection.md` | Modify | 003-hub-wiring | The `OBSIDIAN` surface and its precedence |
| `src/**`, `tools/**` | Modify | 009, 010 | Banners, sections, folder docs, kebab rename |
| `styles.css` | Modify | 009 | Section grammar replacing the current preamble |
| `tools/naming/scan-*.mjs` | Create | 008 | The three convention scanners |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | [`001-surface-design-plan`](001-surface-design-plan/) | Design the packet against the live hub contract; author no skill files | Complete |
| 2 | [`002-repo-convention-audit`](002-repo-convention-audit/) | Measure the plugin's real conventions and gate baselines | Complete |
| 3 | [`003-hub-wiring`](003-hub-wiring/) | Registry, router, `ROUTER.md`, and the `OBSIDIAN` detection branch | Complete |
| 4 | [`004-skill-core`](004-skill-core/) | `SKILL.md` and `README.md` | Complete |
| 5 | [`005-references-stack`](005-references-stack/) | The reference set and its subfolders | Complete |
| 6 | [`006-assets-checklists`](006-assets-checklists/) | The on-demand checklists | Complete |
| 7 | [`007-manual-testing-playbook`](007-manual-testing-playbook/) | Routing-recall corpus | Complete |
| 8 | [`008-scanners-and-gates`](008-scanners-and-gates/) | The three scanners and the gates runner | Complete |
| 9 | [`009-banners-and-folder-docs`](009-banners-and-folder-docs/) | Banners, sections, folder docs, stylesheet grammar | Complete |
| 10 | [`010-kebab-rename`](010-kebab-rename/) | The manifest-driven source rename | Complete |
| 11 | [`011-changelog-and-verification`](011-changelog-and-verification/) | Changelog, fleet audit, final gates | In Progress |
| 12 | [`012-doc-template-conformance`](012-doc-template-conformance/) | Every packet markdown audited against the sk-doc templates it claims to follow | Complete |
| 13 | [`013-surface-reality-conformance`](013-surface-reality-conformance/) | Every claim the surface makes about the plugin tree proven true of the tree | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Validation runs through the hub path `.opencode/specs/obsidian-wt001/...`, never from inside the
  plugin repository. See the verification note below.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 002 | 003 | Measured audit recorded with commands and counts | `002-repo-convention-audit/audit.json` |
| 003 | 004 | Detection resolves `OBSIDIAN`; fleet gate exits 0 | `compiled-route.cjs`, `ci-skill-root-metadata.cjs` |
| 007 | 008 | Packet mirrors the template tree exactly | Tree diff against `sk-code-mobile-cli` |
| 008 | 009 | Scanners fail on the current tree | Each `scan-*.mjs` reports a non-zero finding count |
| 009 | 010 | Scanners pass for banners and folder docs | `scan-comments.mjs`, `scan-folder-docs.mjs` |
| 010 | 011 | Rename proven by build, tests, and captures | `npm run build`, `npx vitest run`, `npm run screenshots` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether `ROUTER.md` gains stage-two entries depends on whether the packet exposes leaf resources
  the hub should select directly. Phase 003 resolves it against the live `leaf-manifest.json`;
  synthetic intents are never authored to fill the table.
- Whether `styles.css` is sectioned in place or split is a phase 009 decision. The file is 18,931
  lines and a split changes the load order the tests and the capture harness depend on.
<!-- /ANCHOR:questions -->

---

## 5. VERIFICATION NOTE

`validate.sh` run from inside the plugin repository exits 0 and prints nothing, including for
`002-ui-improvement-research`, which is missing four required files. Validation only reports
findings when the folder is reached through the hub's `.opencode/specs/` path. In `--recursive`
mode the process exit code is additionally unreliable: a tree whose folders all print
`RESULT: PASSED` still exits 2. Read the `RESULT:` and `Summary:` lines, not `$?`.

This is the same failure shape the preceding packets recorded: a green signal that proves nothing.
It is recorded here so no phase in this packet closes against a false pass.

---

## RELATED DOCUMENTS

- [`goal.md`](goal.md) — the standing objective for this packet.
- [`roadmap.md`](roadmap.md) — phase sequencing and current position.
- **Phase children**: sub-folders `[0-9][0-9][0-9]-*/`.
- **Graph Metadata**: `graph-metadata.json` for the `derived.last_active_child_id` pointer.
- `<plugin-repo>/specs/public/HANDOVER.md` — the traps and the open debt this packet encodes as evidence.
