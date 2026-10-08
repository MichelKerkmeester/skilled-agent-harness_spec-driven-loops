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
| `archive.sh` | Moves completed or stale spec folders into the `z_archive/` beside them: `specs/z_archive/` for a packet at the specs root, `specs/<track>/z_archive/` for a packet in a track, and the parent's own `z_archive/` for a phase. `--restore` returns a folder to the place its archive belongs to, and `--list` shows every archive's entries by the path that restores them. Archives are found by following packet folders only, so a copy of a specs tree kept in a packet's research is left out. After every move it runs `repair-derived.cjs` over the moved folder, so the packet and each packet inside it record their new path, and in a track it runs `refresh-track-roots.mjs` for that track, so the track root's `children_ids` follows the packet. A phase parent's `graph-metadata.json` is left as it is, because its writer drops a child only through a reviewed prune. |
| `is-phase-parent.ts` | Detects whether a folder is a phase parent and reports child-count manifest health. |
| `sync-phase-map-status.ts` | Corrects a phase parent's map table rows that disagree with their child's status, warns about a blank line that cuts the table short and about children with no row, and reports descendant `completion_pct` mismatches without writing them, since readers take completion from the implementation summary. |
| `sweep-track-roots.mjs` | Sweeps every track root (spec-less directory under `specs/` carrying a `graph-metadata.json`) and compares its declared `children_ids` with the numbered child directories, one line per track; exits 1 when any track differs. A track matches only when the two sets are equal: equal counts are not enough, since a renamed packet leaves both counts where they were. `--rev <commit>` reads that commit instead of the working tree and leaves out symlinked tracks; the pre-push track-root gate runs it that way. Per-packet validation never reaches a track root, because the orchestrator exempts track directories from packet rules. Read-only. |
| `refresh-track-roots.mjs` | Rewrites a track root's `children_ids` to its numbered child directories, dropping entries for packets no longer on disk and entries under an earlier identity. Only `children_ids` changes, and a matching track is not rewritten. Dry run by default (exits 1 when changes are pending); `--apply` writes, and `--track <name>` limits it to one track. Unreadable metadata is reported and left alone, with exit 2. |
| `repair-derived.cjs` | Repairs derivable packet facts (folder name, packet pointer, level, metadata fingerprint) and refuses authored ones; see `README-repair-derived.md`. |
| `upgrade-legacy.mjs` | Upgrades a specs tree written under v3.x. For each active packet that fails `--strict`, it adds the frontmatter keys a spec document lacks without rewriting any value already there, and names any document whose frontmatter it cannot read and so leaves as is. It then runs `heal-spec-docs`, `repair-derived` and `migrate-generated-json` on that packet alone, then records each finding they cannot clear in the packet's `upgrade-baseline.json`. The validator reports a recorded finding as a warning, and any finding the file does not list stays an error, so a new mistake still fails. A packet that already passes is never touched, copies of spec trees inside `research/`, `review/` and `context/` are skipped, and `--include-archive` brings archived packets in: only `repair-derived` runs on them, so their recorded paths follow where they live while their documents stay as written. It works on packets in a top-level `specs/`, and when they still live in `.opencode/specs` it stops before any write and prints the commands that move them, which also clear the `specs` symlink a v3 checkout tracks. Dry run by default (exits 1 when a packet fails); `--apply` writes, stops before any write when a packet cannot be validated, and exits 2 when that happens, a step fails or a packet still fails. |

### Upgrade Legacy Reversibility

`--apply` requires `REPO` to be a Git repository. On a dirty worktree with failing packets, it writes one manifest before the first packet edit. The manifest lives under the absolute Git directory returned by:

```bash
git -C REPO rev-parse --absolute-git-dir
```

Each worktree has its own Git directory, so its manifest stays separate. A clean committed tree needs no manifest. On the same HEAD, a later dirty apply replaces a completed manifest with a fresh recovery point.

The manifest records `schema`, `headSha`, `recordedAt`, `status`, `baselineMap`, `recordedBaselineMap`, `scopeHashes` and `beforeImages`. `baselineMap` records the baselines present before the run. `recordedBaselineMap` records each in-scope packet's findings after repair. The manifest starts with `status: "in-progress"` and becomes `complete` after the repairs and baseline writes finish.

Each `beforeImages` entry has a repository-relative path and a `beforeImage` value. File entries store the original bytes as base64 and the file mode. Missing paths use `kind: "absent"`. Symbolic links store their target.

Dry run uses a temporary packet copy to predict findings when no matching complete manifest exists. A complete manifest supplies `recordedBaselineMap` for the **Downgrades** section in both dry run and `--apply`, after the tool verifies its HEAD and packet tree hashes. The tool trusts matching hashes even when `repoRoot` names another absolute path. A HEAD or packet tree mismatch makes dry run report the mismatch and continue, while `--apply` refuses. An in-progress manifest marks a run that stopped before finalizing its recovery record. Dry run reports it and continues. `--apply` refuses until you recover or deliberately clear the manifest.

### Recover an Interrupted Apply

Set `repo_root` to the repository the command edits, then find the manifest:

```bash
repo_root="/path/to/repository"
manifest="$(git -C "$repo_root" rev-parse --absolute-git-dir)/upgrade-legacy.manifest.json"
export UPGRADE_LEGACY_REPO_ROOT="$repo_root"
```

The script resolves every restore path from `UPGRADE_LEGACY_REPO_ROOT`, so you can run it from any directory.

Check `headSha` against the current HEAD before restoring committed files. When they differ, restore before-images only if their paths still match the current tree. Otherwise remove the manifest deliberately and keep the current tree.

For a matching HEAD, inspect `git status --short`. Restore changed committed packet files that are not listed in `beforeImages` from `headSha`. Leave paths listed in `beforeImages` for the script below, since those entries may hold uncommitted bytes from before the run. The script restores those bytes and modes, removes paths marked absent, recreates symbolic links and restores or removes baselines according to `baselineMap`.

```js
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRootInput = process.env.UPGRADE_LEGACY_REPO_ROOT;
if (!repoRootInput) throw new Error('UPGRADE_LEGACY_REPO_ROOT must name the repository to restore');
const repoRoot = fs.realpathSync(repoRootInput);
const manifestFile = process.argv[1];
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const beforeImages = Array.isArray(manifest.beforeImages) ? manifest.beforeImages : [];

function resolveInsideRepo(relative) {
  const target = path.resolve(repoRoot, relative);
  const fromRoot = path.relative(repoRoot, target);
  if (!fromRoot || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) {
    throw new Error(`manifest path escapes repository: ${relative}`);
  }
  return target;
}

for (const entry of beforeImages) {
  const target = resolveInsideRepo(entry.path);
  const image = entry.beforeImage;
  if (image.kind === 'file-bytes') {
    fs.rmSync(target, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(image.content, 'base64'));
    fs.chmodSync(target, image.mode);
  } else if (image.kind === 'absent') {
    fs.rmSync(target, { recursive: true, force: true });
  } else if (image.kind === 'symlink-target') {
    fs.rmSync(target, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.symlinkSync(image.target, target);
  } else {
    throw new Error(`unknown before-image kind: ${image.kind}`);
  }
}

const savedPaths = new Set(beforeImages.map((entry) => entry.path));
for (const relative of Object.keys(manifest.scopeHashes || {})) {
  const baselinePath = `${relative}/upgrade-baseline.json`;
  if (savedPaths.has(baselinePath)) continue;
  const target = resolveInsideRepo(baselinePath);
  if (manifest.baselineMap?.[relative] === null) {
    fs.rmSync(target, { force: true });
  } else {
    const saved = execFileSync('git', ['-C', repoRoot, 'show', `${manifest.headSha}:${baselinePath}`]);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, saved);
  }
}
```

After restoring the packet files and baselines, remove the manifest to clear the interrupted state, then validate the recovered packets with `validate.sh [packet] --strict`:

```bash
rm "$manifest"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<packet> --strict
```

If you choose not to recover, remove the manifest deliberately. This discards its before-images.

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

### Repo Era Report

The read-only report prints JSON and writes no files. Run it from the repository root:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs
```

Pass a repository root as the first argument to inspect another checkout. The report has five signals:

- **Layout:** It uses `.opencode/specs`, packet metadata and the top-level `specs/` tree to report `v3`, `v4`, `both` or `unknown`.
- **Frontmatter:** It counts markdown documents with and without complete YAML frontmatter.
- **Template markers:** It counts current markers, legacy markers and documents with no marker.
- **Generated metadata:** It counts packets with complete, stub or missing `graph-metadata.json`.
- **Level documents:** It counts packets whose direct documents match, mismatch or cannot be compared with the declared level.

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
