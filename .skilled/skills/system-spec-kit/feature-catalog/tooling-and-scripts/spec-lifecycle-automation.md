---
title: "Spec lifecycle automation"
description: "Coordinated shell lifecycle for recommending spec depth, creating spec folders and phases, upgrading level, measuring completion and archiving finished work."
trigger_phrases:
  - spec lifecycle automation
  - recommend-level.sh
  - create.sh upgrade-level.sh
  - spec folder archival
  - completeness measurement
version: 1.6.2.0
---

# Spec Lifecycle Automation

## 1. OVERVIEW

Spec Lifecycle Automation is the shell-script toolchain that moves Spec Kit work through its operational lifecycle instead of treating spec folders as static templates.

The lifecycle is intentionally split into focused commands. `recommend-level.sh` scores a task and recommends the documentation level and optional phasing strategy. `create.sh` materializes the parent spec, optional child phases, or versioned subfolders. `upgrade-level.sh` raises an existing spec folder to a richer documentation level without discarding authored content. `calculate-completeness.sh` measures placeholder burn-down and optional content quality, `check-completion.sh` enforces checklist completion and evidence rules, and `archive.sh` archives or restores completed work with a completeness gate.

Two newer tools sit beside these scripts and have their own entries. `relocate.mjs` moves, renumbers and re-parents packets and is described in [spec-packet-relocation.md](spec-packet-relocation.md). `suggest-subtracks.mjs` proposes a sub-track grouping and is described in [sub-track-proposal.md](sub-track-proposal.md). This entry covers only where the lifecycle scripts call them.

---

## 2. HOW IT WORKS

### Core Behavior

The shipped lifecycle is modular rather than fully auto-chained.

Level recommendation is handled by `recommend-level.sh` as a standalone scoring tool. It accepts estimated LOC, file count, and risk flags for auth, API, database, and architectural work, converts those inputs into a 100-point score, maps the result to Level 0 through Level 3, and separately computes whether phased execution is recommended. Phase scoring uses its own 50-point signal model and only recommends phases when the phase score crosses the threshold and the recommended documentation level is Level 3 or higher.

Spec creation is handled by `create.sh`, which defaults to Level 1 unless `--level` is provided. The script creates `scratch/`, copies the level template set, optionally creates a git branch and writes `description.json` when the Node helper is available. For root and phase scaffolds it then derives `graph-metadata.json` through the graph backfill, which warns and continues when the derivation fails. It also replaces the template placeholder trigger phrases of 18 document kinds with phrases built from the packet slug, and it runs full post-create validation only when `SPECKIT_POST_VALIDATE=1` is set. Beyond normal folder creation, it supports versioned subfolders with `--subfolder`, phased parent-plus-child creation with `--phase`, append-mode phase growth with `--parent`, named child phases with `--phase-names`, and Level 3 sharded spec sections with `--sharded`. The current implementation exposes complexity fields in its output, but the script itself still depends on explicit `--level` input rather than invoking `recommend-level.sh` automatically.

When `create.sh` picks the number itself, it numbers after the highest numbered folder in the root it writes to, and the folders in that root's `z_archive/` count too, so a new packet never takes the number of an archived one. With `--track` it also asks `suggest-subtracks.mjs` for advice and prints at most one `[speckit]` line on stderr: a flat track that clusters gets a pointer to the proposal command, and a packet filed in a sub-track is told when no sub-track fits its description or when another one fits better. The line is advice only. A missing node, a missing tool or a failed run prints nothing and the scaffold continues.

### Upgrade & Validation

Upgrade automation is handled by `upgrade-level.sh`. It detects the current level from explicit markers in `spec.md` or from the presence of `acceptance-criteria.md` and `decision-record.md`, validates that upgrades only move upward, creates timestamped `.backup-*` directories, and rolls back markdown changes if an upgrade step fails. The upgrade path is chained, so a request like Level 1 to Level 3 passes through the intermediate Level 2 transformations automatically. New files are introduced only when needed, such as `acceptance-criteria.md` for Level 2 and `decision-record.md` for Level 3, while higher-level addendum sections are injected or appended into existing documents. `--dry-run`, `--json`, `--verbose`, and `--keep-backups` support inspection and automation use cases.

Completion measurement and completion gating are separated on purpose. `calculate-completeness.sh` scans the root spec files for placeholder markers such as `[PLACEHOLDER]`, `[TODO: ...]`, and `[NEEDS CLARIFICATION: ...]`, computes per-file and overall completion percentages with `bc`, and can add quality checks for minimum word counts and required sections. `check-completion.sh` then evaluates the verification checklist in `tasks.md`, and the acceptance-criteria table when the document exists, as a release gate: it inherits priority from headings when needed, treats untagged items as blocking, requires evidence markers on completed P0 and P1 tasks, supports `--strict` to make P2 mandatory, and returns one of a fixed set of statuses such as `P0_INCOMPLETE`, `EVIDENCE_MISSING`, `AC_UNMET`, or `COMPLETE`.

### Post-Action Behavior

Archival is handled by `archive.sh`. A folder goes into the `z_archive/` beside it: `specs/z_archive/` for a packet at the specs root, the track's own `specs/<track>/z_archive/` for a packet in a track, a declared sub-track's own `z_archive/` for a packet in that sub-track and the parent's own `z_archive/` for a phase. A restore returns a folder to the home its archive sits in, under its own name when its number is free there. When a live packet under another name already holds that number, the restore does not reuse it: the packet takes the number after the highest one used in that home, live or archived, and `archive.sh` hands the move to `relocate.mjs --from <archived> --to <new> --apply` so every record that names the packet follows the new number. If `relocate.mjs` is missing or its run fails, the restore exits with status 1 and prints the command to rerun. A folder or link already at the exact restore path is refused. The list shows every archive's entries by the path that restores them. Archives are only looked for along packet homes: the specs root, tracks, declared sub-tracks and the numbered packets and phases reached from them. A folder without the sub-track declaration is not a home, so copies of a specs tree kept in a packet's research are never listed or restored from. After an archive and after a plain restore, the script re-derives the moved packet's recorded paths with `repair-derived.cjs`, asks the description cache's own producer to rebuild `specs/descriptions.json` when that file exists and runs `refresh-track-roots.mjs` for the track. A move inside a declared sub-track refreshes the sub-track's list and its track's list together, so each root's `children_ids` stays equal to its packets and the pre-push track-root gate has nothing to block. A tree without the cache file gets none, and a failed refresh is a warning that names the rerun and leaves the move in place. A phase parent's `children_ids` is left as it is: its writer adds children and drops one only through a reviewed prune, so an archived phase stays listed and a restore finds it there. Before archiving, it calls `calculate-completeness.sh --json` and enforces a default 90 percent minimum unless `--force` is used or the operator confirms archiving a less-complete spec. The script also validates `NNN-name` folder naming, refuses to archive outside the specs root, detects folders already under any `z_archive/`, and uses a copy-to-temp-then-rename flow before deleting the source folder. A `z_archive/` that is a symlink is refused on archive and on restore, and `--list` leaves a linked archive out without naming it. A linked packet folder is archived by its real path when that path stays inside the specs root. An archive or restore path with a `.` or `..` segment is refused before anything resolves it, since such a segment can reach a linked `z_archive/` that the literal path does not show.

Taken together, the lifecycle tooling currently covers recommendation, creation, decomposition, upgrade, measurement, completion gating, and archival, but it does so through explicit script composition rather than one umbrella command.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Script | Creates new spec folders, versioned subfolders, phased parent-child structures, optional git branches, and post-create validation runs. Counts archived numbers when numbering and prints the sub-track advisory line |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Script | Archives, lists, and restores spec folders while enforcing path safety and a completeness threshold. Restores onto the next free number through the relocation tool and refreshes the description cache after a move |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Script | Moves a restored packet to its new number and rewrites the records that name it |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Script | Answers the read-only question behind the `create.sh` sub-track advisory line |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh` | Script | Enforces checklist completion rules, priority coverage, and evidence requirements before a spec can be claimed complete |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Script | Scores requested work to recommend documentation level and optional phase decomposition |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Script | Upgrades existing spec folders to higher levels with backup creation, chained transformations, and rollback on failure |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Script | Measures placeholder replacement progress and optional content quality across root spec documents |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-numbering.vitest.ts` | Vitest | Covers `create.sh` numbering after archived packets at the specs root, in a track and in a declared sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Vitest | Covers numbering at the specs root, including after an archived packet |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Vitest | Covers archive and restore inside a track |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-lifecycle-automation.md`
Related references:
- [phase-system-knowledge-node.md](../../feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md) — Phase-System Knowledge Node
- [spec-validation-rule-engine.md](../../feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md) — Spec Validation Rule Engine
- [spec-packet-relocation.md](../../feature-catalog/tooling-and-scripts/spec-packet-relocation.md) — Spec packet relocation
- [sub-track-proposal.md](../../feature-catalog/tooling-and-scripts/sub-track-proposal.md) — Sub-track proposal
