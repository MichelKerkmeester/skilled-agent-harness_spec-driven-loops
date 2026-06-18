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
---

# PR-State Content-Hash Dedup (M-1)

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
DIFF_HASH=$(git diff $BASE...HEAD | sha256sum | awk '{print $1}')
SUBJECT=$(git log $BASE...HEAD --format=%s | head -1)
SIGNATURE=$(echo -n "$SUBJECT"$'\x1f'"$DIFF_HASH" | sha256sum | awk '{print $1}')
```

## Cache Format

**Path:** `.opencode/.sk-code-review-cache/<repo-ref>.jsonl`

- `<repo-ref>` = `sha256(git remote get-url origin).slice(0, 12)`
- One JSON object per line (JSONL format)
- File is append-only with periodic pruning

**Schema per line:**

```json
{"signature": "<sha256-hex-64>", "timestamp": "<ISO-8601>", "prev_sha": "<full-commit-sha>"}
```

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

- `.opencode/` is gitignored by convention in OpenCode projects
- `<repo-ref>` deduplication supports multiple remotes / forks without collision
- JSONL format allows line-level append and simple head/tail operations for retention
