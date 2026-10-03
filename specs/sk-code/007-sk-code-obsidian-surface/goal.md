---
title: "Goal: sk-code-obsidian surface and Obsidian source-convention adoption"
description: "The standing objective, the frozen constraints, and the definition of done for this packet."
trigger_phrases:
  - "sk-code-obsidian goal"
  - "obsidian surface objective"
  - "packet 005 goal"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface"
    last_updated_at: "2026-09-20T07:02:30+02:00"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Restructured goal to the template anchors"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "obsidian-surface-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-code-obsidian surface and Obsidian source-convention adoption

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build `sk-code-obsidian` as read-only evidence under the `sk-code` hub, wire an `OBSIDIAN` surface so code work on the plugin stops resolving to `UNKNOWN`, and adopt in the plugin tree the conventions it documents, so the packet describes a real tree rather than an intended one.

### Decisions

| ID | Decision |
|----|----------|
| D1 | The `sk-code-mobile-cli` template is binding for file and folder naming, upper-case numbered section headers and inline-comment style. Mirror it; do not improve on it. |
| D2 | No packet-level identity: a surface packet carries no `graph-metadata.json` or `description.json`. |
| D3 | Evidence, not repair: the six open P0/P1 items and the unphotographed surfaces are encoded in references and checklists, not fixed. |
| D4 | No behavior change. The only new executable code is the three scanners under `tools/naming/`. |
| D5 | The lint baseline of 115 problems is recorded, not reduced. |
| D6 | The hub lives in `Public`; plugin source, this packet and the scanners live in `Obsidian Plugin`. Work happens in worktree `worktrees/001-sk-code-obsidian-surface`. |
| D7 | Spec validation runs through the hub path, never from inside the plugin repo, and is read from `RESULT:` lines, not the exit code. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-surface-design-plan | `001-surface-design-plan/goal.md` |
| 002-repo-convention-audit | `002-repo-convention-audit/goal.md` |
| 003-hub-wiring | `003-hub-wiring/goal.md` |
| 004-skill-core | `004-skill-core/goal.md` |
| 005-references-stack | `005-references-stack/goal.md` |
| 006-assets-checklists | `006-assets-checklists/goal.md` |
| 007-manual-testing-playbook | `007-manual-testing-playbook/goal.md` |
| 008-scanners-and-gates | `008-scanners-and-gates/goal.md` |
| 009-banners-and-folder-docs | `009-banners-and-folder-docs/goal.md` |
| 010-kebab-rename | `010-kebab-rename/goal.md` |
| 011-changelog-and-verification | `011-changelog-and-verification/goal.md` |
| 012-doc-template-conformance | `012-doc-template-conformance/goal.md` |
| 013-surface-reality-conformance | `013-surface-reality-conformance/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every leaf validates through the hub path with no errors.
- [ ] `compiled-route.cjs --hub sk-code --prompt "<obsidian plugin task>"` bundles `sk-code-obsidian` instead of deferring, and `ci-skill-root-metadata.cjs` exits 0.
- [ ] The packet's tree matches `sk-code-mobile-cli`'s shape.
- [ ] Every scanner passes, and each one demonstrably failed before its phase ran.
- [ ] Every plugin gate is green from the final state with no task-created residue: `npx tsc --noEmit`, `npm run build`, `npx vitest run` (386 passing), `npm run screenshots:verify` (180 entries), `npm run lint` (115-problem baseline).
- [ ] `goal.md` and `roadmap.md` describe what is actually true.
- [ ] Every packet markdown file is audited against the sk-doc template it claims through `/doc:quality`, not by eye; deviations are corrected or recorded with a reason.
- [ ] A cross-repo drift guard (the `scan-skill-references.mjs` equivalent, documented in `references/skill-reference-integrity.md`) reports `broken : 0`, so every claim the surface makes about the plugin is enforced by script.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Volatile: status, findings and position, kept out of the durable objective.

### Context kept from the earlier goal

The hub reaches this packet through `.opencode/specs/obsidian`, a symlink to the plugin's `specs/`, and sees the worktree through `.opencode/specs/obsidian-wt001`. From inside the plugin repo the validator exits 0 and prints nothing even for a packet missing four required files, and under `--recursive` it exits 2 on a tree where every folder passes. The rename's oracle is a clean build, 386 passing tests and a regenerated capture manifest, not inspection of the diff. Scanners run as `node tools/naming/scan-*.mjs` once phase 008 lands.

Related documents: [`spec.md`](spec.md) (specification and phase map), [`roadmap.md`](roadmap.md) (sequencing and milestones), `<plugin-repo>/specs/public/HANDOVER.md` (traps and open debt encoded as evidence).

### Current position

All thirteen phases are built. The packet mirrors the template's tree, the hub routes to it, and the
conventions it documents are true of the plugin and enforced by script.

`bash scripts/run-source-gates.sh` from the plugin repo root reports all four guards PASS: naming,
comment grammar, folder docs, and cross-repo reference integrity. Those counts moved from 235, 249,
19 and absent to zero. The plugin's own gates hold at type-check 0, build 0, 386 passing tests, 180
current captures, and lint at exactly its known 115-problem baseline.

Two things remain outside this packet's reach. Phase 011's own closing verification is not finished,
so it stands In Progress. And `description.json` cannot be generated while the Spec Kit Memory MCP is
unreachable, so every leaf carries two environmental errors that no amount of authoring clears.

One standing risk worth carrying: the reference guard resolves paths, not claims. A document can
cite a file that exists while describing it wrongly. Only reading keeps the prose true.

2026-10-03: both outside items are closed. Phase 011's `spec.md` records Status Complete as of
2026-08-29, and every leaf now carries its `description.json`, so strict validation passes across
the packet's 14 folders.
<!-- /ANCHOR:log -->
