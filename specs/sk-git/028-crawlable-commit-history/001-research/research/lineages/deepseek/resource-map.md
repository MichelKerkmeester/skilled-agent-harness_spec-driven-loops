---
title: "Resource Map — Crawlable commit history (deepseek lineage)"
description: "Evidence-derived resource map for the detached deepseek lineage."
trigger_phrases: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: commit message grammar, identifier minting, retrofit mapping, rewrite mechanics, citation remap, enforcement plan.
- Generated from: ten mechanically verified iteration deltas.
- Primary local authorities: the `commit-msg` hook, `sk-git` SKILL.md, the commit template, `worktree-naming.sh`, `filter-repo --help`, the retrieval conventions and trigger-index corpus, the live git history of `skilled/v4.0.0.0`.
- Resource status is an evidence snapshot pinned to `skilled/v4.0.0.0` @ `1b57a90d73` (9,112 commits) plus commands' live output; git refs drift while the repo is written to.

## Local Repository Sources

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `.opencode/scripts/git-hooks/commit-msg` | Read + executed on fixtures | OK | The blocking contract: SUBJECT_RE:72, numeric scope:79-81, summary rules:83-100, PROCESS_LABEL_RE:102-105, cap:110-113, TRAILER_RE:117, body gate:153-155 |
| `.opencode/skills/sk-git/SKILL.md:352-519` | Read | OK | ALWAYS/NEVER rules, Commit Message Logic §1-7, body contract |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | Read | OK | Canonical template, examples, Refs line |
| `.opencode/skills/sk-git/references/commit-workflows.md:163-214` | Read | OK | Step 5/6 workflow |
| `.opencode/skills/sk-git/references/quick-reference.md:106-109,349` | Read | OK | Command forms, length guidance |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Read | OK | Locked high-water allocator precedent (lines 8-32, 209-247, 250-309) |
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` | Read | OK | 17 command-safety checks; no message checks |
| `.opencode/scripts/install-git-hooks.sh:69-107` | Read | OK | Symlink install mechanics; machine-wide hooks path |
| `.opencode/scripts/git-hooks/tests/` + `post-commit`, `post-rewrite` | Read | OK | Test inventory; autosync and autostash guard behavior |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Read | OK | Two retrieval lanes; keyed vs free-text |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Read + executed | OK | Index lookup contract; demo returned score-0 partials |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:29` | Read | OK | CORPUS_ROOTS = specs, .opencode/skills, .opencode/install-guides; lineages excluded |
| `.opencode/skills/sk-git/references/remote-branch-policy.md:36-70` | Read | OK | Pre-push allowlist and autosync exemption |
| `.opencode/bin/git-sync.sh:3-28` | Read | OK | Live-branch publish/ff/rebase behavior |
| `.github/workflows/*.yml` | Read | OK | CI triggers on main/skilled/** |
| `git filter-repo --help` (installed 3.9 site) | Read | OK | Callback, commit-map, replace-refs, signature, fresh-clone contracts |

## Git History Commands Run (read-only)

| Command family | Action | Evidence use |
|---|---|---|
| `git rev-list --count`, `git log --format=%s/%b/%P/%cI` | Analyzed | Baseline counts, subjects, bodies, parents, dates |
| `git log --grep / --all-match / --fixed-strings / -S / -G` | Analyzed | Search-surface semantics; AND failure = 2; pickaxe = 0 |
| `git log --format='%(trailers:key=...)'` | Analyzed | Trailer extraction loss 119/349; Commit-Id parseable |
| `git log --name-only -- specs .opencode/specs` | Analyzed | Per-commit packet touch map (6,110 commits) |
| `rg` token scans over `specs/**/*.md` | Analyzed | 12,718 tokens / 7,260 unique / 1,700 real + 294 full-SHA |
| `uniq -d` subject duplication | Analyzed | 413 duplicated subjects / 1,002 commits |
| `git branch / worktree list / tag / for-each-ref` | Analyzed | Blast radius 60 / 28 / 149 / 8 / 2 |
| `git patch-id --stable` | Analyzed | Content-id format demo (`90bb5766000c...`) |
| `git notes list`, `git replace -l`, `git config --get-all remote.origin.fetch` | Analyzed | Alternatives rejected; refspec evidence |

## Verification Notes

- The hook itself was executed against nine constructed fixture messages (`scratch/candidates/c1-c9`), with verbatim pass/block output recorded in iteration 4 and 5.
- The iterator counts were re-measured at the cap: 9,112 commits at `1b57a90d73` (the tip moved 9,108→9,112 during the session).
- No network fetch was performed; GitHub search behavior is labeled local knowledge and remains unverified.
- No write outside the lineage directory was performed by the research artifacts (one incidental shell temp file was created and removed; noted for audit completeness).
