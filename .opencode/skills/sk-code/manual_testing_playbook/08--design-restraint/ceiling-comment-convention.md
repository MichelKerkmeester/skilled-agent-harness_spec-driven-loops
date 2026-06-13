---
title: "DR-003: Intentional-simplification ceiling comment"
description: "Verify that when sk-code takes a deliberate shortcut it emits a neutral ceiling: comment naming the shortcut, its ceiling, and the upgrade trigger as a durable WHY, and that comment-hygiene passes it without allow-listing."
---

# DR-003: Intentional-simplification ceiling comment

## 1. OVERVIEW

This scenario verifies the `ceiling:` comment convention added to `references/universal/code_style_guide.md` §4. When a simplification is deliberate — a known shortcut chosen on purpose, not an oversight — it should read as intent. The convention introduces a neutral `ceiling:` comment that names the shortcut, its known ceiling, and the upgrade path or trigger.

It is a durable WHY, not a brand or tool prefix (a brand prefix reads as a perishable, cargo-cult label), and it is explicitly NOT added to the comment-hygiene checker's allowed-pattern list — it already passes because it carries no forbidden id, and allow-listing it would let a forbidden id on the same line slip through. This is the producer-side companion to the reviewer-side downgrade rule (sk-code-review CR-022).

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for a deliberately simple in-memory rate limiter on a local-only preview server, and wants the shortcut marked so it reads as a choice.

**Exact prompt**:
```
Add a small in-memory rate limiter to the sk-doc local preview server at .opencode/skills/sk-doc/scripts/preview-server.ts. A fixed in-memory window is fine for local use, so mark the deliberate ceiling.
```

**Expected detection**:
- Surface: `OPENCODE` (target path contains `/.opencode/`)
- Intent: implementation (write work)
- Sub-language: `TYPESCRIPT` (target file extension `.ts`)

**Expected behavior**:
- The AI emits a `ceiling:` comment that names the shortcut, its known ceiling (in-memory, single-process, resets on restart), and the upgrade trigger (move to a shared store when multi-process or persistence is needed).
- The comment is a plain WHY — no brand prefix, no forbidden tracking id.
- `check-comment-hygiene.sh` passes the file (exit 0) WITHOUT `ceiling:` being added to the checker's allowed-pattern list.

**Desired user-visible outcome**: A simplification that reads as a deliberate, upgradeable choice and survives the comment-hygiene gate on its own merits.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/references/universal/code_style_guide.md` §4 documents the `ceiling:` convention: `bash: rg -n "ceiling:" .opencode/skills/sk-code/references/universal/code_style_guide.md`.
2. The comment-hygiene checker resolves: `bash: test -f .opencode/skills/sk-code/scripts/check-comment-hygiene.sh`.
3. `ceiling:` is NOT in the checker's allowed-pattern list: `bash: rg -n "ALLOWED_PATTERN|allowed" .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` returns no `ceiling` entry.

### Exact Command Sequence

1. **Invoke sk-code** with the exact prompt against a sandbox copy under `/tmp/skc-DR003-sandbox/`.
2. **Capture the emitted comment**: confirm it is a `ceiling:` comment with shortcut, ceiling, and upgrade trigger.
3. **Run comment-hygiene** on the produced file:
   ```
   bash: python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh /tmp/skc-DR003-sandbox/preview-server.ts
   ```
4. **Verify**: exit 0 (clean), and the checker's allowed-pattern list was not modified.
5. **Persist evidence** to `/tmp/skc-DR003-hygiene.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | A `ceiling:` comment names the shortcut, its ceiling, and the upgrade trigger as a plain WHY. |
| 2 | No brand prefix and no forbidden tracking id on the comment line. |
| 4 | `check-comment-hygiene.sh` exits 0 on the file. |
| 4 | `ceiling:` was NOT added to the checker's allowed-pattern list. |

### Pass/Fail Criteria

- **PASS** iff: the ceiling comment follows `references/universal/code_style_guide.md` §4 (neutral WHY, not allow-listed) AND comment-hygiene exits 0 on the file.
- **PARTIAL** iff: a ceiling comment is present and hygiene passes, but the comment omits the ceiling or the upgrade trigger.
- **FAIL** iff: the comment brands the prefix, embeds a forbidden id, gets added to the allowed-pattern list, or fails the hygiene checker.

### Failure Triage

1. If hygiene fails (exit 1): the comment likely embeds a forbidden artifact id — rewrite as a durable WHY.
2. If `ceiling:` was allow-listed: revert the checker change; the convention must pass without an allow-list entry.
3. If the comment is a bare label: verify the §4 convention requires shortcut + ceiling + upgrade trigger.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/references/universal/code_style_guide.md` — §4 neutral `ceiling:` intentional-simplification convention.
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` — Comment-hygiene checker the convention must pass without an allow-list entry.

## 5. SOURCE METADATA

- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (writes only under `/tmp/skc-DR003-sandbox/`; production files untouched)
- **Sandbox**: all writes confined to `/tmp/skc-DR003-sandbox/`.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
