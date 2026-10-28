---
title: "DR-003: Intentional-simplification ceiling comment"
description: "Verify that when sk-code takes a deliberate shortcut it emits a neutral ceiling: comment naming the shortcut, its ceiling, and the upgrade trigger as a durable WHY, and that comment-hygiene passes it without allow-listing."
version: 1.6.1.0
---

# DR-003: Intentional-simplification ceiling comment

## 1. OVERVIEW

This scenario verifies the `ceiling:` comment convention that the SKILLED surface defines in `sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §3. The universal style guide, `sk-code-quality/references/code-style-guide.md` §4, only allows a surface to define such a marker; the `ceiling:` marker itself is SKILLED house style, and the target here is SKILLED code. When a simplification is deliberate, a known shortcut chosen on purpose and not an oversight, it should read as intent. The convention introduces a neutral `ceiling:` comment that names the shortcut, its known ceiling, and the upgrade path or trigger.

It is a durable WHY, not a brand or tool prefix (a brand prefix reads as a perishable, cargo-cult label), and it is explicitly NOT added to the comment-hygiene checker's allowed-pattern list — it already passes because it carries no forbidden id, and allow-listing it would let a forbidden id on the same line slip through. This is the producer-side companion to the reviewer-side downgrade rule (sk-code-review CR-022).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for a deliberately simple in-memory cache around a table the quality gate reads on every call, and wants the shortcut marked so it reads as a choice.

**Exact prompt**:
```
Add a small process-lifetime memo to readHygieneRules() in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. One gate run reads the table once, so a fixed in-memory cache is fine, and mark the deliberate ceiling.
```

Prompt: `Add a small process-lifetime memo to readHygieneRules() in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. One gate run reads the table once, so a fixed in-memory cache is fine, and mark the deliberate ceiling.`

**Expected detection**:
- Surface: `SKILLED` (target path contains `/.skilled/`)
- Intent: implementation (write work)
- Sub-language: `JAVASCRIPT` (target file extension `.cjs`)

**Expected behavior**:
- The AI emits a `ceiling:` comment that names the shortcut, its known ceiling (one process, so another process re-reads the table, and an edited table needs a restart), and the upgrade trigger (drop the memo if the table must be re-read within a run).
- The comment is a plain WHY — no brand prefix, no forbidden tracking id.
- `check-comment-hygiene.sh` passes the file (exit 0) WITHOUT `ceiling:` being added to the checker's allowed-pattern list.

**Desired user-visible outcome**: A simplification that reads as a deliberate, upgradeable choice and survives the comment-hygiene gate on its own merits.

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §3 documents the `ceiling:` convention: `bash: rg -n "ceiling:" .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`.
2. The comment-hygiene checker resolves: `bash: test -f .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`.
3. `ceiling:` is NOT in the checker's allowed-pattern list: `bash: rg -n "ALLOWED_PATTERN|allowed" .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` returns no `ceiling` entry.

### Exact Command Sequence

1. **Invoke sk-code** with the exact prompt against a sandbox copy under `/tmp/skc-DR003-sandbox/`.
2. **Capture the emitted comment**: confirm it is a `ceiling:` comment with shortcut, ceiling, and upgrade trigger.
3. **Run comment-hygiene** on the produced file:
   ```
   bash: python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh /tmp/skc-DR003-sandbox/quality-config.cjs
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

- **PASS** iff: the ceiling comment follows `sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §3 (neutral WHY, not allow-listed), names the shortcut, ceiling, and upgrade trigger, AND comment-hygiene exits 0 on the file.
- **FAIL** iff: the comment brands the prefix, embeds a forbidden id, gets added to the allowed-pattern list, fails the hygiene checker, or omits the ceiling or the upgrade trigger.

Evidence: `/tmp/skc-DR003-hygiene.txt` (comment-hygiene checker output).

### Failure Triage

1. If hygiene fails (exit 1): the comment likely embeds a forbidden artifact id — rewrite as a durable WHY.
2. If `ceiling:` was allow-listed: revert the checker change; the convention must pass without an allow-list entry.
3. If the comment is a bare label: verify the SKILLED §3 convention requires shortcut + ceiling + upgrade trigger.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`: §3 neutral `ceiling:` intentional-simplification convention.
- `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md`: §4, which lets a surface define an intentional-simplification marker.
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` — Comment-hygiene checker the convention must pass without an allow-list entry.
- `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` — the target file and its `readHygieneRules()` call.

Catalog: `feature-catalog/review-calibration/review-floor-lens-and-overrides.md`, which carries the review lens rule `review.ceiling-marker` this producer-side convention pairs with.

---

## 5. SOURCE METADATA

- Group: Design Restraint
- Playbook ID: DR-003
- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (writes only under `/tmp/skc-DR003-sandbox/`; production files untouched)
- **Sandbox**: all writes confined to `/tmp/skc-DR003-sandbox/`.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
