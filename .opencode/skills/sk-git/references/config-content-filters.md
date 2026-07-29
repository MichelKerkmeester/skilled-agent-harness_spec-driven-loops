# Config Content Filters — Why Four Files Commit Differently Than They Read

Four config files in this repository pass through a `maintainer-flags` content filter, so the
committed blob deliberately differs from the file on disk. If you edit one of these and review
your change in the working copy, you are reviewing content you are not committing.

| File | On disk (maintainer) | In every commit |
|------|---------------------|-----------------|
| `opencode.json` | `SPECKIT_CODE_GRAPH_INDEX_*: "true"` | `"false"` |
| `.claude/mcp.json` | same | same |
| `.vscode/mcp.json` | same | same |
| `.codex/config.toml` | same | same |

Five keys are affected: `SPECKIT_CODE_GRAPH_INDEX_{SKILLS,AGENTS,COMMANDS,SPECS,PLUGINS}`.

## Why This Exists

This repository is a public template. End users cloning it should inherit the framework default —
no indexing of `.opencode/` backend folders — while maintainers want the backend indexed locally
without scrubbing the file before every push. The filter automates both directions:

- **clean** (working tree → commit): rewrites the five values `"true"` → `"false"`.
- **smudge** (commit → working tree): rewrites them back `"false"` → `"true"`.

The behaviour is intentional. The problem it created was silence — nothing told an operator or an
agent that the diff they reviewed was not the diff they committed. That surprise once cost real
debugging time, which is why it is now written down and warned about.

## How to See What You Are Actually Committing

```bash
git show HEAD:opencode.json | grep SPECKIT_CODE_GRAPH_INDEX   # the committed form
cat opencode.json | grep SPECKIT_CODE_GRAPH_INDEX             # the working form
git diff --cached                                             # shows the CLEANED content
```

`git diff` (unstaged) compares smudged working content against the cleaned index, so the five keys
can appear "modified" when nothing meaningful changed — or appear unchanged when your edit to one
of those keys will be silently reverted in the commit.

## The Advisory

The git preflight advisory (`staged-path-rewritten-by-filter` in this skill's `hard_rules:`) fires
whenever one of these files appears in an `add` or `commit`, precisely because reading the working
copy will not tell you what you are committing.

## Authoritative Sources

The table above is a summary. The filter mapping lives in `.gitattributes` (with its full design
rationale in the header comment) and the sed transforms live in `.git/config` under
`filter.maintainer-flags`, installed by `./scripts/setup-maintainer-filters.sh`. When this document
and those files disagree, those files win.

## If the Filter Is Not Installed

A fresh clone without running the setup script has the attribute mapping but no filter definition,
and `filter.maintainer-flags.required=true` makes affected git operations fail rather than commit
un-cleaned content. That failure is the filter protecting the public default — run the setup
script, don't remove the attribute.
