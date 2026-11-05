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
version: 1.6.2.0
---

# PR-State Content-Hash Dedup (M-1)

An unchanged pull request should not be reviewed twice, and a skip is only trustworthy when its evidence is written down. Open this when a run reports an unchanged pull request and you want the recorded signature, cache entry and status line behind the skip.

---

## 1. OVERVIEW

### Purpose

This is the detailed reference for the M-1 PR-state deduplication gate documented in [SKILL.md](../SKILL.md) §8.1. A pull request whose diff and commit subject are unchanged since the last recorded review gets no second full analysis, and the cache entry states which revision was already reviewed.

### When to Use

- A review is requested for a branch that may already have been reviewed at the same content.
- A reviewer needs the cache path, the retention cap or the pathspec key the gate uses.
- An operator needs to audit a skip or reset the cache.

---

## 2. SIGNATURE COMPUTATION

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

---

## 3. CACHE FORMAT

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

---

## 4. PATHSPEC SCOPE

The scope is optional. With no pathspec, the whole repository is one scope, which is the behavior every earlier cache entry was written under.

When a review targets one package of a monorepo, pass that package path as the pathspec. The same pathspec then goes to every command the gate runs:

- `git diff <base-ref>...HEAD -- <pathspec>` for `diff_content_hash`
- `git log <base-ref>...HEAD --format=%s -- <pathspec>` for `commit_subject`
- the `<repo-ref>` hash above

A change outside the package then leaves that package's signature unchanged, and a change inside it no longer matches a whole-repository entry.

---

## 5. RETENTION

- Maximum **100 entries** per repo-ref
- On write: append, then if line count > 100, keep last 100 lines
- No TTL-based expiry — entries persist until pruned by the 100-entry cap
- Cache file may be deleted entirely to reset; recreated on next write

---

## 6. SKIP BEHAVIOR

When a review is requested and the computed signature matches a prior cache entry:

```
Review status: COMMENTED (no changes since last review at <prev_sha>)
```

- No full review analysis is performed
- The cached `prev_sha` is reported so operators can verify
- Downstream automation must treat `COMMENTED` as equivalent to a pass (no new findings)

---

## 7. CACHE WRITE

After every **full review** that reaches the final status line, write the current signature to cache. If the gate skipped the review (COMMENTED match), do NOT re-write — the existing cache entry remains authoritative.

---

## 8. CACHE LOCATION RATIONALE

- The user cache directory sits outside every reviewed repository, so reviewing a foreign repository leaves no folder in it, and deleting the cache folder resets the gate
- `<repo-ref>` deduplication supports multiple remotes / forks without collision
- JSONL format allows line-level append and simple head/tail operations for retention
- The root-path fallback changes when the repository folder moves or is cloned to a new path. The worst case is one cache miss and one full review, never a skipped review
