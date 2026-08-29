---
title: "Goal: sk-code-obsidian surface and Obsidian source-convention adoption"
description: "The standing objective, the frozen constraints, and the definition of done for this packet."
trigger_phrases:
  - "sk-code-obsidian goal"
  - "obsidian surface objective"
  - "packet 005 goal"
importance_tier: "important"
contextType: "general"
---

# Goal: sk-code-obsidian surface and Obsidian source-convention adoption

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

> Refreshed after every leaf closes, alongside `roadmap.md`.

---

## 1. THE OBJECTIVE

Give code work on this plugin a surface of its own. Today it resolves to `UNKNOWN`, so nothing
about the Obsidian API boundary, the single-stylesheet ownership model, the `.db-*` class grammar,
the capture harness, or the real verification gate reaches the agent doing the work. Build
`sk-code-obsidian` as read-only evidence under the `sk-code` hub, wire an `OBSIDIAN` surface so it
loads automatically, and adopt in the plugin tree the conventions it documents — so the packet
describes a real tree rather than an intended one.

---

## 2. THE TWO REPOSITORIES

| Root | Holds |
|------|-------|
| `~/MEGA/Development/Code_Environment/Public` | The `sk-code` hub, the surface packet, the hub wiring |
| `~/MEGA/Development/Obsidian Plugin` | The plugin source, this spec packet, the scanners |

The hub reaches this packet through `.opencode/specs/obsidian`, a symlink to the plugin's `specs/`.
Work happens in the worktree `worktrees/001-sk-code-obsidian-surface`; the hub sees it through
`.opencode/specs/obsidian-wt001`.

---

## 3. FROZEN CONSTRAINTS

- **The template is binding.** `sk-code-mobile-cli` sets file and folder naming, upper-case
  numbered section headers, and inline-comment style. Mirror it; do not improve on it.
- **No packet-level identity.** A surface packet carries no `graph-metadata.json` and no
  `description.json`; a nested one is a `NESTED_IDENTITY` violation.
- **Evidence, not repair.** The six open P0/P1 items and the roughly 145 unphotographed surfaces
  are encoded in the references and checklists. This packet does not fix them.
- **No behavior change.** Every phase is documentation, naming, or comments. The only new
  executable code is the three scanners under `tools/naming/`.
- **The lint baseline stands.** 115 problems are recorded, not reduced.

---

## 4. HOW WORK IS PROVEN

Run from the worktree, reading output and exit status:

`npx tsc --noEmit` · `npm run build` · `npx vitest run` (baseline 386 passing across 49 files) ·
`npm run screenshots:verify` (baseline 180 entries) · `npm run lint` (known baseline 115 problems) ·
`node tools/naming/scan-*.mjs` once phase 008 lands.

Spec validation runs through the hub path, never from inside the plugin repository, and is read
from the `RESULT:` lines rather than the process exit code. Both caveats are measured facts, not
caution: from inside the plugin repo the validator exits 0 and prints nothing even for a packet
missing four required files, and under `--recursive` it exits 2 on a tree where every folder passes.

The rename's oracle is a clean build, 386 passing tests, and a regenerated capture manifest — not
inspection of the diff.

---

## 5. DEFINITION OF DONE

- Every leaf validates through the hub path with no errors.
- `compiled-route.cjs --hub sk-code --prompt "<obsidian plugin task>"` bundles `sk-code-obsidian`
  instead of deferring, and `ci-skill-root-metadata.cjs` exits 0.
- The packet's tree matches `sk-code-mobile-cli`'s shape.
- Every scanner passes, and each one demonstrably failed before its phase ran.
- Every plugin gate is green from the final state, with no task-created residue in the diff.
- `goal.md` and `roadmap.md` describe what is actually true.
- **Doc conformance:** every markdown file in the packet is audited against the sk-doc template it
  claims to follow — `sk-create-skill`'s packet scaffold for `SKILL.md`, `readme-template.md` and
  `readme-code-template.md` for folder docs, and the manual-testing-playbook scenario contract —
  through `sk-create-quality-control` (`/doc:quality`), not by eye. Deviations are corrected or
  recorded with a reason.
- **Surface reality conformance:** every claim the surface makes about the plugin is true of the
  plugin — enforced by a script, not a reading. The template backs this with a cross-repo drift
  guard (`scan-skill-references.mjs`) that resolves every app path the skill names and expects
  `broken : 0`; this packet needs its equivalent, plus the `references/skill-reference-integrity.md`
  that documents it. With it, the naming, comment-banner and folder-doc scanners passing, and the
  architecture, folder layout and source matching what the packet describes, the surface cannot
  silently drift into documenting an intended tree rather than the real one.

---

## 6. CURRENT POSITION

All thirteen phases are built. The packet mirrors the template's tree, the hub routes to it, and the
conventions it documents are true of the plugin and enforced by script.

`bash scripts/run-source-gates.sh` from the plugin repo root reports all four guards PASS — naming,
comment grammar, folder docs, and cross-repo reference integrity. Those counts moved from 235, 249,
19 and absent to zero. The plugin's own gates hold at type-check 0, build 0, 386 passing tests, 180
current captures, and lint at exactly its known 115-problem baseline.

Two things remain outside this packet's reach. Phase 011's own closing verification is not finished,
so it stands In Progress. And `description.json` cannot be generated while the Spec Kit Memory MCP is
unreachable, so every leaf carries two environmental errors that no amount of authoring clears.

One standing risk worth carrying: the reference guard resolves paths, not claims. A document can
cite a file that exists while describing it wrongly. Only reading keeps the prose true.

## RELATED DOCUMENTS

- [`spec.md`](spec.md) — the packet specification and phase map.
- [`roadmap.md`](roadmap.md) — sequencing and milestones.
- `<plugin-repo>/specs/public/HANDOVER.md` — the traps and open debt encoded as evidence.
