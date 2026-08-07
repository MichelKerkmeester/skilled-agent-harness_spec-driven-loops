# Phase 002 — Migration Tool (DeepSeek authoring brief, RCAF)

## Role
You are a senior systems engineer specialising in safe, deterministic refactoring tools. Your strength is correct path/string manipulation with exhaustive edge-case handling and fail-closed safety.

## Context
Repository: an OpenCode AI framework (CWD = repo root). We are de-numbering per-feature snippet FILENAMES across "feature catalog" and "manual testing playbook" documentation packages: `NN--category-name/NNN-slug.md` → `NN--category-name/slug.md` (strip the leading number from the FILE basename; KEEP the FOLDER number `NN--`). The standard already changed (phase 001). Now we need the tool that performs the migration on real trees: ~1,531 files across 20 skills, run inside a dedicated git worktree, sometimes by parallel agents (one per skill).

Pre-plan (medium):
1. Enumerate renameable files and build the rename map (strip `^[0-9]+-` from basename only).
2. Fail-closed collision gate before ANY write.
3. Rewrite references using the EXACT known old paths (no regex-guessing), `.md`-anchored and boundary-bounded so Feature IDs never match.
4. Apply with plain `fs.renameSync` (NOT git — the orchestrator handles git staging/commit, so parallel agents in one worktree never race the git index).
5. Emit machine-readable manifests in both modes.

## Action
Author a single pure-Node CommonJS script `denumber-snippets.cjs` (no external dependencies) implementing this exact contract:

CLI: `node denumber-snippets.cjs --tree <dir> [--referrers <file>] [--dry-run | --apply] [--manifest-dir <dir>]`
- `--tree`: a `feature_catalog/` or `manual_testing_playbook/` directory (repo-relative or absolute).
- `--referrers`: optional path to a UTF-8 file of newline-separated repo-relative paths of EXTERNAL files that may link to this tree's snippets (root docs are auto-included; do not require them here).
- `--dry-run` (DEFAULT when neither flag given): compute everything, write manifests, modify NO target file.
- `--apply`: perform renames + reference edits in place. Still aborts on any collision.
- `--manifest-dir`: directory for manifests (default: current working directory).

Algorithm:
1. Category dirs = immediate subdirectories of `<tree>` whose name matches `^[0-9]{2,3}--`.
2. In each category dir, renameable files match `^([0-9]+)-(.+)\.md$`. The rename target basename is capture group 2 + `.md` (i.e. strip the leading `^[0-9]+-`). Non-matching files (e.g. already un-numbered) are left out of the rename set.
3. COLLISION GATE (fail-closed): build `dst -> [srcs]`. A collision is: two different srcs mapping to the same dst, OR a dst path that already exists on disk and is not itself a src being renamed. If ANY collision exists, write `collision-report.json` and exit with code 2 — performing NO renames and NO edits, even under `--apply`.
4. Reference maps (per tree): `fullOld -> fullNew` = tree-relative `<categoryDir>/<NNN-slug>.md` -> `<categoryDir>/<slug>.md`; and `baseOld -> baseNew` = `<NNN-slug>.md` -> `<slug>.md` (used only for same-directory neighbor links inside a renamed file).
5. Reference rewrite — apply to: (a) each renamed file's own content (its SOURCE METADATA self-path + its same-dir neighbor links), (b) the tree root doc (`feature_catalog.md` or `manual_testing_playbook.md` at the tree root), (c) every `--referrers` file. Rewrite RULES:
   - Replace only the EXACT known old strings from the maps (literal match on `<categoryDir>/<NNN-slug>.md`, and for same-dir neighbors the bare `<NNN-slug>.md`). Do NOT build a generic `[0-9]+-` regex over the content.
   - A match is valid only when the character immediately BEFORE the old string is a non-alphanumeric boundary (start-of-line, whitespace, `(`, `/`, `]`, quote, etc.) AND the character immediately AFTER the `.md` is a non-alphanumeric boundary or end-of-string or one of `#`, `)`, whitespace, quote. This guarantees a Feature ID like `M-219` or text like `xNNN-slug.mdx` never matches, and a `#anchor` / trailing `)` is preserved untouched.
   - Handle `./` and `../` prefixes on links naturally (the literal old path may be preceded by `./` or `../`; match the path component regardless of such a prefix).
   - Links inside fenced code blocks ARE rewritten (they are real paths in these docs).
   - A slug that is a substring of another slug in the same dir is disambiguated by the exact-literal + boundary matching (e.g. `005-foo.md` vs `006-foo-bar.md` never cross-match).
6. APPLY (only under `--apply`, only when zero collisions): for each rename do `fs.renameSync(src, dst)`; write each touched file's rewritten content with `fs.writeFileSync`. Do NOT invoke git in any way.
7. Idempotency: a file with no numbered prefix is never in the rename set, so re-running `--apply` on an already-migrated tree performs zero renames and zero edits.
8. Manifests (write in BOTH modes, into `--manifest-dir`): `rename-manifest.json` (array of {src, dst}), `reference-edit-manifest.json` (array of {file, edits:[{old,new,count}]}), `collision-report.json` (object dst -> [srcs], empty {} when none). Always print one final summary line to stdout: `TREE=<tree> RENAMES=<n> REFFILES=<n> EDITS=<n> COLLISIONS=<n> MODE=<dry-run|apply>`.

Acceptance criteria:
- Under `--dry-run` (default), zero target files change; manifests are written.
- Any collision → exit code 2, no writes, collision-report populated.
- Feature IDs (`M-219`, `EX-001`, `{PREFIX}-{NNN}`) are never altered.
- `#anchor` suffixes and `./`/`../` prefixes on links are preserved/handled.
- `--apply` uses `fs.renameSync` only; never calls git.
- Re-running `--apply` on a migrated tree is a no-op (idempotent).

## Format
Return ONLY the complete contents of `denumber-snippets.cjs` in a single fenced ```javascript code block. No prose before or after. The script must run as-is under `node` with no npm install. Spec folder is pre-approved (skip Gate 3); do not ask questions.
