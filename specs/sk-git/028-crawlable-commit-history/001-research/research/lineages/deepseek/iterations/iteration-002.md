---
title: "Iteration 2: What the history actually contains"
trigger_phrases: []
---
# Iteration 2: What the history actually contains

## Focus

Measure the 9,106-commit baseline the dispatch brief describes, over all commits reachable from `skilled/v4.0.0.0` and `main`: type/scope distribution, subject length, body and trailer populations, spec-path linkage, and spec-tree touches. This is the baseline every later angle uses.

## What was read

- No contract files this iteration; this is a pure git measurement pass. Repo state at measurement time: `HEAD` = `worktrees/048-crawlable-commit-history` (9,107 commits), `git version 2.50.1 (Apple Git-155)`, `git filter-repo` present on PATH.

## What was measured

```text
$ git rev-list --count HEAD / main / skilled/v4.0.0.0 / origin/main
HEAD=9107, main=9061, skilled/v4.0.0.0=9108, origin/main=9108
$ git rev-list --count main..skilled/v4.0.0.0   -> 47
$ git rev-list --count skilled/v4.0.0.0..main   -> 0     (main is an ancestor)
$ git rev-list --count origin/main..skilled/v4.0.0.0 / reverse -> 0 / 0  (same tip)
$ git log --format='%h %ci %s' -1 skilled/v4.0.0.0
6106f88ccd 2026-09-11 09:20:00 +0200 docs(specs): close out four phases against what actually shipped

$ git branch --format='%(refname:short)' | wc -l   -> 60
$ git worktree list | wc -l                        -> 28
$ git tag | wc -l                                  -> 149

$ python3 over `git log --format=%s` and `--format=%b%x00` on skilled/v4.0.0.0:
commits: 9108
exempt (Merge /Revert "/fixup! /squash! /amend! ): 147
matches SUBJECT_RE (hook line 72): 6643
non-matched authored: 2318   (1864 have a `type(` prefix but a scope/charset failure; 601 have no `type(` prefix at all)
subject length: avg 75.6, median 75, p90 94, max 359
subjects >80 chars: 2948 | >100 chars: 558  (572 including exempt; 263 of the >100 also match SUBJECT_RE)
summary lowercase-start violations: 616 | trailing punctuation: 1 | double spaces: 0 | vague list: 0
types: docs 2367, fix 1511, feat 1278, chore 637, refactor 427, test 153, release 128,
       merge 102, style 19, ci 8, build 7, perf 3, revert 3
distinct scopes: 463 | top: specs 514, spec-kit 471, deep-loop 429, sk-doc 372, 028 256,
       sk-design 244, system-spec-kit 241, 026 112, 016 106, agents 100, 027 94, readme 90,
       routing 88, hooks 81, system-speckit 81, sk-code 80, sk-git 75, system-deep-loop 73,
       cli-external-orchestration 72, 029 69, mcp-tooling 62, repo 60, changelog 55, ...
numeric-only scopes: 1355 commits (14.9%); top numeric scopes 028:256, 026:112, 016:106, 027:94,
       029:69, 152:42, 017:38, 030:27, 042:27, 018:22, 155:21, 036:20, 133:20, ...
subjects mentioning '028': 480 | subjects mentioning 'specs/': 11

bodies:
commits with non-empty body: 8203 (90.1%)
commits with an explanatory (non-trailer) body line: 8061
commits with a Refs: line: 349   {spec-path: 306, other/URL/free-text: 51, numeric/issue: 0}
commits with Co-Authored-By: 7363 (80.8%) | Claude-Session: 3836 (42.1%) | BREAKING CHANGE: 11
bodies mentioning 'specs/': 677

spec tree touches:
commits touching specs/: 1194
commits touching .opencode/specs: 4937

citation scan:
rg -l '\b[0-9a-f]{10}\b' specs --glob '*.md'         -> 1904 files
rg -o '\b[0-9a-f]{10}\b' specs --glob '*.md'         -> 12718 occurrences
rg -l '\b[0-9a-f]{10}\b' .opencode/skills --glob '*.md' -> 31 files
rg -l '\b[0-9a-f]{10}\b' .opencode/skills/*/changelog README.md -> 0
```

## Findings

1. **The live count is 9,108, not 9,106.** Two commits landed after the brief was written (`7bf1c3af7d` 09:19:38, `6106f88ccd` 09:20:00 on 2026-09-11), and `main` is 47 behind `skilled/v4.0.0.0` (not 45). `origin/main` and `skilled/v4.0.0.0` are the same tip. The retrofit baseline must be pinned by SHA at execution time, not by the brief's counts. [SOURCE: command:git rev-list --count main..skilled/v4.0.0.0 → 47] [SOURCE: command:git log -1 skilled/v4.0.0.0 → 6106f88ccd]
2. **Branch/worktree/tag landscape has drifted from the brief: 60 branches (not 59), 28 worktrees (not 20), 149 tags (not 5).** Tags include release tags (`1.0.0.0`…), backup tags (`backup-0131-presync`, `backup-A-rebase-…`), `Test`, and `027/baseline`. Angle 9's blast radius must be re-derived from the live refs, not the brief. [SOURCE: command:git branch / git worktree list / git tag counts]
3. **Only 73% of authored subjects satisfy the current hook grammar.** 6,643 of 9,108 match `SUBJECT_RE`; 147 are git-generated exemptions; 2,318 authored commits fail — 1,864 with a `type(` prefix but a scope/charset failure (spaces like `fix(spec-kit tests):`, slashes like `(036/014)`, uppercase) and 601 with no `type(` prefix at all (e.g. `restore hook hub and centralize every runtime hook`). [SOURCE: command:python3 SUBJECT_RE scan over skilled/v4.0.0.0]
4. **Numeric scopes are 15% of history despite the hook blocking them.** 1,355 commits carry a numeric-only scope, led by `028` (256), `026` (112), `016` (106), `027` (94), `029` (69), `152` (42). The current contract postdates much of this history; any retrofit that normalizes scopes must decide what happens to these 1,355 subjects, and angle 7's mapping can exploit them. [SOURCE: command:python3 numeric-scope scan]
5. **Length compliance is the largest mechanical gap.** 2,948 subjects exceed the documented 80-char target (32.4%), 558–572 exceed the hard 100 limit; the max subject is 359 characters. A rewrite that only remapped citations would still leave a third of subjects out of documented bounds; a rewrite that tightens all subjects is a message-content change with review cost. [SOURCE: command:subject length distribution]
6. **Trailer reality is Co-Authored-By and Claude-Session, not Refs.** 80.8% of commits carry `Co-Authored-By`, 42.1% carry `Claude-Session` (neither `Claude-Session:` nor most runtime trailers are in the hook's `TRAILER_RE`), while `Refs:` appears in only 349 commits (3.8%) — 306 naming a spec path, 51 free-text/URL, and **zero** numeric issue/PR references. The packet link today is effectively the `specs/` path inside that Refs line, not any structured key. [SOURCE: command:python3 body/trailer scan]
7. **Spec-path linkage is thin and ambiguous.** Only 677 bodies mention `specs/` at all, 349 use `Refs:`, 1,194 commits touch `specs/` as a path, and 4,937 touch `.opencode/specs`. Mapping "commit → packet" from content alone is therefore partial by construction; angle 7 must measure per-commit resolution, not assume it. [SOURCE: command:git log --format=%H -- specs and -- .opencode/specs]
8. **Citation mass is concentrated under `specs/`: 12,718 ten-hex tokens across 1,904 markdown files.** Only 31 markdown files outside `specs/` under `.opencode/skills` carry a 10-hex token, and no changelog/README file matched in this scan. The remap (angle 9) is a `specs/`-scoped problem first; the brief's "about 11,213 lines" is directionally confirmed at 12,718 token occurrences today. [SOURCE: command:rg -o '\b[0-9a-f]{10}\b' specs --glob '*.md' | wc -l → 12718]
9. **`BREAKING CHANGE:` is nearly absent (11 commits),** so a grammar that reserves footer space for breaking metadata costs almost nothing in retrofit volume. [SOURCE: command:python3 body scan]
10. **Body coverage is already high (90.1%),** so a retrofit that appends a trailer key rather than rewriting bodies has a full, existing body to attach to in nearly every commit. [SOURCE: command:count of non-empty bodies]

## Recommendations

1. **[implementable today]** Pin the retrofit baseline as a SHA of `skilled/v4.0.0.0` (`6106f88ccd` at measurement) plus the merge-base with `main`, and state the live ref counts, rather than the brief's 9,106/45/59/20/5 numbers.
2. **[needs a contract decision]** Decide whether retrofit normalization covers only structure (identifier/citation) or also hook hygiene (length, lowercase, scope charset). Findings 3-5 show the two have very different volumes: ~2,300 regex failures and ~2,900 over-length subjects versus a identifier/citation touch that can leave subjects untouched.
3. **[implementable today]** Treat the 1,355 numeric-scope subjects as the highest-value mapping input for angle 7 (each already names a packet number in the scope), before falling back to `Refs:` (349), `specs/` touches (1,194), or ordinals.
4. **[needs a contract decision]** Since `Co-Authored-By` (7,363) and `Claude-Session` (3,836) dominate trailers and neither is fully whitelisted, trailer policy in the new grammar should explicitly say whether existing trailers are preserved verbatim, normalized, or left alone.
5. **[implementable today]** For angle 9, scope citation enumeration to `specs/**/*.md` first (12,718 of 12,718+31 ≈ 99.8% of the sampled mass) and still scan `README.md`, changelogs, and memory files for exact-hash references.

## What this iteration could not settle

- Per-commit packet resolution (only 349 `Refs:` + 1,355 numeric scopes + 1,194 `specs/` touches are plausible signals; the overlap and the unmappable remainder are angle 7).
- Whether `.opencode/specs` and `specs/` path forms resolve to the same packet for every historical commit (path renames over time), which angle 7's coverage measurement must handle.
- The exact tag list to rewrite and the live-sync/live-branch reach of a force-push (angle 9).
