---
title: PR-State Content-Hash Dedup
description: Signature computation, JSONL cache format, retention, and skip behavior for the M-1 PR-state review deduplication gate.
trigger_phrases:
  - "pr state dedup gate"
  - "review diff signature hash"
  - "duplicate review skip behavior"
  - "review dedup cache retention"
  - "commented no changes status"
importance_tier: important
contextType: implementation
version: 1.6.0.0
---

# PR-State Content-Hash Dedup (M-1)

## 1. OVERVIEW

Detailed reference for the M-1 PR-state deduplication gate documented in `../SKILL.md` §9.1.

## Signature Computation

```text
diff_content_hash = sha256(git diff <base-ref>...HEAD)
signature         = sha256(commit_subject + "\u001f" + diff_content_hash)
```

- `commit_subject`: first line of `git log <base-ref>...HEAD --format=%s` (latest commit subject only)
- `diff_content_hash`: full diff content, not `--stat` or `--numstat`
- Separator `\u001f` (Unit Separator) prevents collision between subject and hash boundaries

### Example

```bash
BASE="origin/main"
SCOPE=""   # optional pathspec, such as packages/api; empty means the whole repository
DIFF_HASH=$(git diff $BASE...HEAD ${SCOPE:+-- "$SCOPE"} | sha256sum | awk '{print $1}')
SUBJECT=$(git log $BASE...HEAD --format=%s ${SCOPE:+-- "$SCOPE"} | head -1)
SIGNATURE=$(printf '%s\x1f%s' "$SUBJECT" "$DIFF_HASH" | sha256sum | awk '{print $1}')
```

## Cache Format

**Path:** `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl`

The cache lives in the reviewing user's cache directory, outside every reviewed repository. Its one side effect is this file. The gate never creates a file or folder in the repository it reviews.

- `<repo-ref>` = `sha256(<repo identity>).slice(0, 12)`, where `<repo identity>` is the output of `git remote get-url origin`. When the repository has no `origin` remote, `<repo identity>` falls back to `git rev-parse --show-toplevel`, the absolute path of the repository root, so a local-only repository still gets a stable key
- With a pathspec scope, `<repo-ref>` = `sha256(<repo identity> + "\u001f" + <pathspec>).slice(0, 12)`, so each scoped package keeps its own cache file
- One JSON object per line (JSONL format)
- File is append-only with periodic pruning

**Schema per line:**

```json
{"signature": "<sha256-hex-64>", "timestamp": "<ISO-8601>", "prev_sha": "<full-commit-sha>"}
```

## Pathspec Scope

The scope is optional. With no pathspec, the whole repository is one scope, which is the behavior every earlier cache entry was written under.

When a review targets one package of a monorepo, pass that package path as the pathspec. The same pathspec then goes to every command the gate runs:

- `git diff <base-ref>...HEAD -- <pathspec>` for `diff_content_hash`
- `git log <base-ref>...HEAD --format=%s -- <pathspec>` for `commit_subject`
- the `<repo-ref>` hash above

A change outside the package then leaves that package's signature unchanged, and a change inside it no longer matches a whole-repository entry.

## Retention

- Maximum **100 entries** per repo-ref
- On write: append, then if line count > 100, keep last 100 lines
- No TTL-based expiry — entries persist until pruned by the 100-entry cap
- Cache file may be deleted entirely to reset; recreated on next write

## Skip Behavior

When a review is requested and the computed signature matches a prior cache entry:

```
Review status: COMMENTED (no changes since last review at <prev_sha>)
```

- No full review analysis is performed
- The cached `prev_sha` is reported so operators can verify
- Downstream automation must treat `COMMENTED` as equivalent to a pass (no new findings)

## Cache Write

After every **full review** that reaches the final status line, write the current signature to cache. If the gate skipped the review (COMMENTED match), do NOT re-write — the existing cache entry remains authoritative.

## Cache Location Rationale

- The user cache directory sits outside every reviewed repository, so reviewing a foreign repository leaves no folder in it, and deleting the cache folder resets the gate
- `<repo-ref>` deduplication supports multiple remotes / forks without collision
- JSONL format allows line-level append and simple head/tail operations for retention
- The root-path fallback changes when the repository folder moves or is cloned to a new path. The worst case is one cache miss and one full review, never a skipped review
