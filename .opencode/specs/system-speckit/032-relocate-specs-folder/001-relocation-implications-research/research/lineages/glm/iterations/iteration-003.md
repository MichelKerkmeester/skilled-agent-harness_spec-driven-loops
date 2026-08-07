# Iteration 003 — Git and .gitignore Interactions (Q3)

**Focus:** Q3 — the existing root `specs` symlink, the `!specs` and `!.opencode/` negation rules, and `~/.gitignore_global`'s `/specs` and `/.opencode/` ignores for downstream symlinked repos.
**Track:** git
**Executor:** cli-devin / glm-5-2
**Date:** 2026-08-06

## Approach
Inspected the root `specs` entry (`ls -la`, `readlink`), grepped root `.gitignore` for `specs`/`opencode` rules, read `~/.gitignore_global`, verified git tracking state (`git ls-files -s`, `git cat-file`, `git check-ignore -v`), and checked `.gitattributes` for symlink-specific handling.

## Findings

### F3.1 — `specs` is a git-tracked SYMLINK to `.opencode/specs`, not a real directory
```
$ ls -la specs
lrwxr-xr-x@ 1 michelkerkmeester  staff  15 Aug  6 09:25 specs -> .opencode/specs
$ git ls-files -s specs
120000 b22b603b1b5cef0a472490e6a0e4bc2dc49e9603 0	specs
$ git cat-file -p HEAD:specs
.opencode/specs
```
Git tracks `specs` as a symlink (mode `120000`) whose blob content is the string `.opencode/specs`. The real spec tree lives at `.opencode/specs/` (a real directory, `drwxr-xr-x`). **The relocation proposal is therefore not "move a directory" but "replace a tracked symlink with a real tracked tree"** — a categorically different git operation.
[SOURCE: repo root `specs` symlink; `git ls-files -s specs`; `git cat-file -p HEAD:specs`]

### F3.2 — The `.gitignore` negation architecture: source repo re-tracks what the global ignore hides
Root `.gitignore`:
```
7: # The global ~/.gitignore_global ignores /.opencode/ for symlinked repos.
8: # But THIS repo is the SOURCE of .opencode/ content — it MUST be tracked.
10: !.opencode/
11: !specs
```
- `!.opencode/` (L10) and `!specs` (L11) are negation rules that RE-TRACK `.opencode/` and `specs` in THIS repo, overriding the global ignores.
- `git check-ignore -v specs` and `git check-ignore -v .opencode/specs` both return empty (exit 1) → neither is ignored; the negations work and both are tracked.
**Verdict:** The negation architecture is the mechanism by which the source repo tracks content that downstream repos ignore. Relocation does NOT require changing the negation rules themselves — `!specs` tracks a symlink OR a real directory equally well. The rules are form-agnostic.
[SOURCE: .gitignore:7-11; `git check-ignore -v specs` / `.opencode/specs` (both unignored)]

### F3.3 — `~/.gitignore_global` ignores `/specs` and `/.opencode/` for DOWNSTREAM symlinked repos
`~/.gitignore_global`:
```
# AI-SpecKit root symlinks
/specs
/opencode.json
/.utcp_config.json
# AI-SpecKit .opencode directory (entire directory)
/.opencode/
```
The global ignore is explicitly scoped (per its own comment) to "all Barter repositories" that symlink in `.opencode` and `specs` from the source repo. The `/specs` and `/.opencode/` rules keep those symlinks UNTRACKED in downstream repos.
**Relocation implication for downstream repos:** If the source repo's `specs/` becomes a real directory, downstream repos that symlink `specs -> <source>/specs` continue to be ignored by the global `/specs` rule — **no downstream `.gitignore` change required**. The global rule keys on the path `/specs`, not on whether the source's entry is a symlink or a real dir. The downstream symlink contract is preserved.
[SOURCE: ~/.gitignore_global (AI-SpecKit root symlinks section)]

### F3.4 — Replacing the symlink with a real directory is a large but non-breaking git change
Currently `git` stores `specs` as one symlink blob (mode 120000). Replacing it with a real directory means git now tracks every file under `specs/` as individual tree objects. This is a large diff (every spec file appears as a new added file; the symlink blob is deleted) but it is NOT a corruption or break — it is the intended migration. The `!specs` negation handles tracking either form. **Risk: the commit is large and reviewable; the operation is atomic in git; no history rewrite is needed.** The reverse (real dir → symlink) is also possible if rollback is required.
[SOURCE: `git ls-files -s specs` mode 120000; .gitignore:11 `!specs`]

### F3.5 — No `.gitattributes` symlink-specific handling exists
`.gitattributes` contains only `opencode.json filter=maintainer-flags` (a maintainer-mode clean/smudge filter for code-graph flags). There are NO rules keyed on `specs`, `.opencode/`, or symlink attributes. **Relocation requires no `.gitattributes` changes.**
[SOURCE: .gitattributes:1,18]

### F3.6 — The critical interaction: in-repo `.opencode/specs` path references dangle unless a back-symlink is kept
The 271 in-repo references to `.opencode/specs` (Q5, scale track) all resolve today because `.opencode/specs/` is the real tree and `specs` is a forward symlink to it. If the real tree moves to root `specs/`, two options exist:
- **Option A (literal rename):** `.opencode/specs` ceases to exist. All 271 in-repo references dangle. Requires repointing every reference (Q5 scale) OR adding a back-symlink `.opencode/specs -> ../specs`.
- **Option B (keep `.opencode/specs` as real tree, `specs/` stays a convenience symlink):** No dangling references; the current architecture is preserved. This is the spec's deferred open question (§7) and is the LOWER-RISK option by construction.
**This is the single most important relocation decision** and it is gated on the Q5 reference-count finding. The git layer itself (F3.1-F3.5) does not force either option; the in-repo reference scale does.
[SOURCE: spec.md §7 open questions; iteration-001 grep (271 files); F3.1 symlink architecture]

## What Worked
- `git ls-files -s` + `git cat-file -p HEAD:specs` definitively established the symlink-vs-real-dir tracking form — `ls -la` alone would have left ambiguity about git's view.
- `git check-ignore -v` proved the negations are active (empty output = not ignored), rather than assuming from the rule text.

## What Failed / Ruled Out
- Ruled out: "relocation requires changing the `.gitignore` negation rules." FALSE — `!specs` and `!.opencode/` are form-agnostic (F3.2).
- Ruled out: "downstream repos need `.gitignore` updates." FALSE — the global `/specs` rule keys on path, not source form (F3.3).
- Ruled out: "`.gitattributes` needs symlink handling." FALSE — no such rules exist (F3.5).

## Novelty Justification
New track (git) with several genuinely new structural facts: the symlink-not-directory tracking form (F3.1), the negation-override architecture (F3.2), the downstream-global-ignore contract (F3.3), and the framing that the git layer is form-agnostic and does NOT force the relocation decision — the in-repo reference scale does (F3.6). Builds on iter 1's 271-reference count but introduces the git-specific decision frame. Partially-new with a structural reframing of where the real risk lives.

## newInfoRatio: 0.65 (new track + structural reframing; integration with Q5 reference count)

## Next Focus Suggestion
Q5 (scale/risk) is now the gating track: F3.6 showed the relocation decision hinges on the count and distribution of in-repo `.opencode/specs` references. Quantify: total count repo-wide (not just spec-kit), distribution by directory (skills vs commands vs agents vs specs themselves vs mirrors), and classify which are path-resolver literals (would break) vs. documentation/prose (cosmetic). This directly determines whether Option A (literal rename) is viable or Option B (keep `.opencode/specs` real) is forced.
