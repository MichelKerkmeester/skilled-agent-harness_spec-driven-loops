---
title: "Spec Scripts"
description: "Spec lifecycle shell entrypoints for create, upgrade, validation, completion checks and archival."
trigger_phrases:
  - "spec scripts"
  - "upgrade spec level"
  - "validate spec folder"
  - "check placeholders"
---

# Spec Scripts

---

## 1. OVERVIEW

`runtime/cli/spec/` owns shell entrypoints for spec folder lifecycle work. It creates packet folders, upgrades documentation levels, validates structure, checks completion state and archives finished or stale folders.

Current state:

- Shell scripts are the public command surface for spec lifecycle operations.
- Validation delegates rule checks to `../rules/` and shared helpers in `../lib/`.
- Scripts accept explicit spec folder paths and are intended to run from the repository root.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                         SPEC SCRIPTS                         │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ Operator     │ ───▶ │ create.sh      │ ───▶ │ Spec folder    │
│ or command   │      │ upgrade-level  │      │ files          │
└──────┬───────┘      └───────┬────────┘      └───────┬────────┘
       │                      │                       │
       │                      ▼                       ▼
       │              ┌──────────────┐       ┌────────────────┐
       └────────────▶ │ validate.sh  │ ───▶  │ rules/check-*  │
                      └──────┬───────┘       └───────┬────────┘
                             │                       │
                             ▼                       ▼
                      ┌──────────────┐       ┌────────────────┐
                      │ completion   │       │ lib/*.sh       │
                      │ and archive  │       │ helpers        │
                      └──────────────┘       └────────────────┘

Dependency direction: spec/*.sh ───▶ rules/*.sh ───▶ lib/*.sh
```

---

## 3. PACKAGE TOPOLOGY

```text
runtime/cli/spec/
+-- create.sh                    # Scaffold spec folders from templates
+-- upgrade-level.sh             # Add level-owned docs and sections
+-- check-placeholders.sh        # Detect unresolved template placeholders
+-- validate.sh                  # Run structural validation rules
+-- progressive-validate.sh      # Staged validation helper
+-- check-completion.sh          # Verify the tasks checklist and acceptance closure
+-- scaffold-debug-delegation.sh # Generate debug-delegation handoff scaffolds
+-- calculate-completeness.sh    # Report checklist completion metrics
+-- recommend-level.sh           # Recommend documentation level from task signals
+-- archive.sh                   # Move completed or stale spec folders
+-- check-template-staleness.sh  # Compare generated docs with templates
+-- quality-audit.sh             # Batch quality audit helper
+-- test-validation.sh           # Legacy wrapper for scripts/tests/test-validation.sh
+-- is-phase-parent.ts           # Phase-parent detection and manifest health check
+-- sync-phase-map-status.ts     # Sync a phase parent's map table; report completion mismatches
+-- sweep-track-roots.mjs        # Report track roots whose children_ids differ from their packets
+-- refresh-track-roots.mjs      # Rewrite a track root's children_ids to its packets on disk
+-- repair-derived.cjs           # Repair packet facts derivable from disk; refuses authored facts
+-- README-repair-derived.md     # Derived-vs-authored repair boundary reference
+-- upgrade-legacy.mjs           # Upgrade a v3.x specs tree: repair failing packets, record the rest
`-- README.md
```

Allowed direction:

- `spec/*.sh` may source shared shell helpers from `../lib/`.
- `validate.sh` may call validation rules from `../rules/`.
- Lifecycle scripts may read templates and write only the selected spec folder. There are two exceptions. `create.sh --track` also lists the new packet in that track root's `children_ids`, and `upgrade-legacy.mjs` writes across every failing packet in the specs roots it is given.

Disallowed direction:

- Rule scripts should not mutate spec content.
- Shell helpers should not call spec lifecycle entrypoints.
- Source modules should not import generated `dist/` output directly. Shell entrypoints may execute freshness-verified compiled output, as `validate.sh` does for the runtime validation orchestrator.

---

## 4. KEY FILES

| File | Role |
|---|---|
| `create.sh` | Creates new Level 1 or phase folders from templates. With `--track`, it then runs `refresh-track-roots.mjs` for that track, so the new packet is listed in the track root's `children_ids` from the start. |
| `upgrade-level.sh` | Adds missing files and sections for higher documentation levels. |
| `validate.sh` | Runs the modular validation gate used before completion claims. `resolve_orchestrator()` checks the compiled runtime dist freshness (via `../lib/dist-freshness.cjs`) before trusting it and fails closed with exit `3` when stale: no silent auto-rebuild. |
| `check-completion.sh` | Confirms the `tasks.md` checklist evidence and, when present, acceptance-criteria closure before a task is called complete; the completion sentinel reads its JSON. |
| `scaffold-debug-delegation.sh` | Generates `debug-delegation.md` handoff scaffolds from failure-trail input. |
| `progressive-validate.sh` | Runs a staged validation pass for detect, fix, suggest and report flows. |
| `test-validation.sh` | Legacy wrapper forwarding to `runtime/cli/tests/test-validation.sh`. |
| `archive.sh` | Moves completed or stale spec folders into the `z_archive/` beside them: `specs/z_archive/` for a packet at the specs root, `specs/<track>/z_archive/` for a packet in a track, and the parent's own `z_archive/` for a phase. `--restore` returns a folder to the place its archive belongs to, and `--list` shows every archive's entries by the path that restores them. Archives are found by following packet folders only, so a copy of a specs tree kept in a packet's research is left out. After a move in a track it runs `refresh-track-roots.mjs` for that track, so the track root's `children_ids` follows the packet. A phase parent's `graph-metadata.json` is left as it is, because its writer drops a child only through a reviewed prune. |
| `is-phase-parent.ts` | Detects whether a folder is a phase parent and reports child-count manifest health. |
| `sync-phase-map-status.ts` | Corrects a phase parent's map table rows that disagree with their child's status, warns about a blank line that cuts the table short and about children with no row, and reports descendant `completion_pct` mismatches without writing them, since readers take completion from the implementation summary. |
| `sweep-track-roots.mjs` | Sweeps every track root (spec-less directory under `specs/` carrying a `graph-metadata.json`) and compares its declared `children_ids` with the numbered child directories, one line per track; exits 1 when any track differs. A track matches only when the two sets are equal: equal counts are not enough, since a renamed packet leaves both counts where they were. `--rev <commit>` reads that commit instead of the working tree and leaves out symlinked tracks; the pre-push track-root gate runs it that way. Per-packet validation never reaches a track root, because the orchestrator exempts track directories from packet rules. Read-only. |
| `refresh-track-roots.mjs` | Rewrites a track root's `children_ids` to its numbered child directories, dropping entries for packets no longer on disk and entries under an earlier identity. Only `children_ids` changes, and a matching track is not rewritten. Dry run by default (exits 1 when changes are pending); `--apply` writes, and `--track <name>` limits it to one track. Unreadable metadata is reported and left alone, with exit 2. |
| `repair-derived.cjs` | Repairs derivable packet facts (folder name, packet pointer, level, metadata fingerprint) and refuses authored ones; see `README-repair-derived.md`. |
| `upgrade-legacy.mjs` | Upgrades a specs tree written under v3.x. For each active packet that fails `--strict`, it adds the frontmatter keys a spec document lacks without rewriting any value already there, and names any document whose frontmatter it cannot read and so leaves as is. It then runs `heal-spec-docs`, `repair-derived` and `migrate-generated-json` on that packet alone, then records each finding they cannot clear in the packet's `upgrade-baseline.json`. The validator reports a recorded finding as a warning, and any finding the file does not list stays an error, so a new mistake still fails. A packet that already passes is never touched, copies of spec trees inside `research/`, `review/` and `context/` are skipped, and `--include-archive` records archived packets without rewriting them. It works on packets in a top-level `specs/`, and when they still live in `.opencode/specs` it stops before any write and prints the commands that move them, which also clear the `specs` symlink a v3 checkout tracks. Dry run by default (exits 1 when a packet fails); `--apply` writes, stops before any write when a packet cannot be validated, and exits 2 when that happens, a step fails or a packet still fails. |

---

## 5. BOUNDARIES AND FLOW

Main validation flow:

```text
╭──────────────────────────────╮
│ Repository-root command      │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ validate.sh                  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Load lib shell helpers       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Run rules/check-*.sh         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Print pass, warning or error │
└──────────────────────────────┘
```

This folder owns shell orchestration only. Template content belongs under `templates/`, validation rule behavior belongs under `rules/` and shared shell primitives belong under `lib/`.

---

## 6. ENTRYPOINTS

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh specs/<name>
bash .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh specs/<name> --to 3
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/<name>
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<name> --strict
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh specs/<name>
node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs [--specs <dir>] [--rev <commit>]
node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs [--specs <dir>] [--track <name>]... [--apply]
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [--roots <dir>]... [--include-archive] [--apply]
```

---

## 7. VALIDATION

Use repository-root commands:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<name> --strict
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh specs/<name>
```

Use `--recursive` with `validate.sh` when the target is a phase parent with child phase folders.

---

## 8. RELATED

- [`README-repair-derived.md`](./README-repair-derived.md)
- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../rules/README.md`](../rules/README.md)
- [`../templates/README.md`](../templates/README.md)
