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
+-- template-phrase-census.mjs   # Read-only census of template trigger-phrase blocks
+-- template-phrase-cleanup.mjs  # Rewrite template-seeded trigger phrases, dry run by default
+-- template-phrase-lint.mjs     # Check trigger phrases a commit adds to staged Markdown
+-- repo-era.mjs                 # Read-only Repo Era Report for a checkout
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
| `create.sh` | Creates new Level 1 or phase folders from templates. It seeds the trigger phrases of the 18 template document kinds with the packet slug. After the documents are written, it replaces the planned `graph-metadata.json` stub with metadata derived from them through `backfill-graph-metadata.ts`, and a failed derivation warns and leaves the stub in place. With `--track`, it then runs `refresh-track-roots.mjs` for that track, so the new packet is listed in the track root's `children_ids` from the start. |
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
| `heal-spec-docs.cjs` | Restores scaffold values a spec document lost, and only where the document itself proves the right value. By default it refills an empty `trigger_phrases` list from the packet slug and stamps the template-source header only when the document's anchors prove the render. `--anchor-repair` repairs duplicate anchor pairs in `spec.md` and un-nests only the questions anchor, editing marker lines and never prose, and refuses documents it cannot repair marker-only. `--lane-modes` runs the five lane modes; see the **Heal Lane Modes** subsection below. Dry run by default, printing what it would heal and what it refuses; `--apply` writes. |
| `upgrade-legacy.mjs` | Upgrades a specs tree written under v3.x. For each active packet that fails `--strict`, it adds the frontmatter keys a spec document lacks without rewriting any value already there, filling each missing value from the document class's template literal before the builder's runtime tables, and names any document whose frontmatter it cannot read and so leaves as is. It then runs the anchor repair, `heal-spec-docs`, the lane modes, `repair-derived` and `migrate-generated-json` on that packet alone, then records each finding they cannot clear and each lane-mode refusal in the packet's `upgrade-baseline.json`. The validator reports a recorded finding as a warning, and any finding the file does not list stays an error, so a new mistake still fails. A packet that already passes is never touched, copies of spec trees inside `research/`, `review/` and `context/` are skipped, and `--include-archive` brings archived packets in: they receive the questions-anchor un-nesting and `repair-derived` only, so their recorded paths follow where they live while their documents otherwise stay as written. The un-nesting moves only the questions opener marker line, never prose, and refuses a document it cannot repair marker-only. It works on packets in a top-level `specs/`, and when they still live in `.opencode/specs` it stops before any write and prints the commands that move them, which also clear the `specs` symlink a v3 checkout tracks. Dry run by default (exits 1 when a packet fails); `--apply` writes, stops before any write when a packet cannot be validated, and exits 2 when that happens, a step fails or a packet still fails. The dry run also prints a `repo era report:` block from `repo-era.mjs`, and both the dry run and `--apply` print a grouped detail with one `### <packet> / x <RULE> (<count>)` heading per failing rule, followed by its detail lines. With `--layout-map` it prints the planned v3-to-v4 move of the spec roots as JSON and writes nothing. The JSON holds `state` (`none`, `v3`, `v4` or `partial`), `moves`, `alreadyMoved`, `collisions` and `steps`. It exits 0 when no collisions are found, 1 when it lists collisions and 2 when it cannot produce the map. |
| `template-phrase-census.mjs` | Read-only census of the trigger phrases that template blocks leave in the 18 document kinds, split into live and archived tracks, with a count of malformed frontmatter. `--root <dir>` picks the tree, `specs` by default, and `--json` prints the report as JSON. |
| `template-phrase-cleanup.mjs` | Rewrites the trigger phrases that template seeds left behind, for the same 18 kinds. A dry run lists each change, and `--apply` writes. Each write goes to a temp file beside the document and is renamed over it. Archived packets are skipped unless `--include-archive` is given. A document with no opening frontmatter delimiter is not rewritten. The report lists it as routed to `fill-frontmatter`, with a `node upgrade-legacy.mjs --roots <packet> --apply` command to run. |

### Upgrade Legacy Reversibility

`--apply` requires `REPO` to be a Git repository. On a dirty worktree with failing packets, it writes one manifest before the first packet edit. The manifest lives under the absolute Git directory returned by:

```bash
git -C REPO rev-parse --absolute-git-dir
```

Each worktree has its own Git directory, so its manifest stays separate. A clean committed tree needs no manifest. On the same HEAD, a later dirty apply replaces a completed manifest with a fresh recovery point.

The manifest records `schema`, `repoRoot`, `headSha`, `recordedAt`, `status`, `baselineMap`, `recordedBaselineMap`, `scopeHashes` and `beforeImages`. `baselineMap` records the baselines present before the run. `recordedBaselineMap` records each in-scope packet's findings after repair. The manifest starts with `status: "in-progress"` and becomes `complete` after the repairs and baseline writes finish.

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

### Heal Lane Modes

A lane mode is a structure-only repair that acts only when the packet's own files or the rendered template prove the fix. The five modes run in this order, each reading the text the one before it returned:

| Mode | Acts when | Refuses when |
|---|---|---|
| `anchor-wrap` | A heading sits outside every anchor pair, the level's active template maps that heading to an anchor id, the document carries at least one ANCHOR marker with every marker paired, and the id is not already present. Wraps the heading and its section with `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->`; headings the template does not map are authored prose and stay untouched. | A heading needs wrapping but the document carries no ANCHOR marker, carries an unmatched marker, records no level in `spec.md`, cannot resolve a template for its level, repeats the heading text, or already carries the id. |
| `link-repoint` | An inline link fails the same resolution probe the validator uses, against the document's own directory and the repository root, and exactly one indexed `.md` file ends with the link's own last one or two path segments. Repoints the path between the label and the fragment only; the label, angle brackets and fragment survive. | No file ends with the broken target's key, more than one does, the target carries no path segment to match, or a reference definition does not resolve. Never unlinks. |
| `continuity-placeholders` | Both `recent_action` and `next_safe_action` in the frontmatter `_memory` continuity block are scaffold or empty, where a scaffold value matches the validator's signature and a template ships that exact value, and an empty value is a placeholder whatever the templates ship. Writes `recent_action: "No continuity update was recorded"` and `next_safe_action: "None recorded"`, or `"None, the packet is archived"` when the path below its `specs` root carries a `z_archive` or `z_future` segment. | Only one of the two fields is scaffold or empty, because the pair is then an edit in progress; the document is refused whole. |
| `level-from-spec` | A document other than `spec.md` declares no level in any form the validator reads (the `SPECKIT_LEVEL` marker, a `- **Level**:` list item, a `Level` metadata-table row, a frontmatter `level:` key, or an inline `Level: 3` or `Level 3` line), and `spec.md` carries one or more valid `SPECKIT_LEVEL` markers that agree. Writes `level: <value>` into the frontmatter. A document that already declares a level in any of those forms, valid or not, is left untouched. | `spec.md` is missing or unreadable, carries no marker, carries a malformed value, or carries markers that disagree; or the document has no frontmatter to write into. |
| `header-add` | The document carries no template-source header, its anchors match the level's render exactly, none beyond the render and none missing, and that template renders a `SPECKIT_TEMPLATE_SOURCE` marker. Stamps `<!-- SPECKIT_TEMPLATE_SOURCE: <marker> -->` after the frontmatter. | No level is recorded in `spec.md`, the template cannot be resolved or renders no template, the template renders no marker, the anchors carry extra or missing ids, or there is no frontmatter to stamp after. |

A refusal is recorded only when a mode found the defect it repairs and could not derive the fix for; a document without the defect yields nothing. `upgrade-legacy.mjs --apply` writes the refusals as a `refusals` array of `{mode, document, reason}` entries beside `findings` in each packet's `upgrade-baseline.json`, in mode order and then by document and reason, and the validator ignores that key. Lane modes never run on archived packets there: an archived packet receives the questions-anchor un-nesting and `repair-derived` only. A second run over a repaired packet changes nothing, leaving the documents and the recorded baseline identical.

Reconstructing a missing document and aligning a summary's status with `spec.md` stay reported and are never automated, because both change what a document asserts.

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

The layout signal reads a v3 checkout whose `specs` is a symlink to `.opencode/specs` as v4, because it takes the alias as the absence of a legacy root. The same checkout reports `both` when its `description.json` files still name `.opencode/specs`. For the layout state of such a checkout, use `upgrade-legacy.mjs --layout-map`, which reports it as `v3`.

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
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs [--folder <packet> | --roots <dir>] [--apply]
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --anchor-repair [--folder <packet> | --roots <dir>] [--apply]
node .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs --lane-modes [--folder <packet> | --roots <dir>] [--apply]
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [--roots <dir>]... [--include-archive] [--apply]
node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --layout-map
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
