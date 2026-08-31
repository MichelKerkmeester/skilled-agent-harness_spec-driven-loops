---
title: "sk-create-with-human-voice References"
description: "Router for this mode's reference set: what the voice rules may touch, and how a score is computed and proved."
trigger_phrases:
  - "human voice references"
  - "which voice reference to load"
  - "hvr workflow references"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# sk-create-with-human-voice References

| Load | When |
|------|------|
| [`scope-and-exemptions.md`](scope-and-exemptions.md) | **First, always.** Decides which spans of the target the standard governs. Skipping it is how a voice edit corrupts a quotation, a generated file or a test fixture |
| [`scoring-and-verification.md`](scoring-and-verification.md) | Once the scope is settled. Pass order, the precedence arithmetic, the bands, and the re-scan that proves a rewrite landed |

The standard itself is not in this folder and is not copied into it. It lives at
[`../../shared/references/hvr-rules.md`](../../shared/references/hvr-rules.md), where
hundreds of files across this repository already point, most of them frozen spec
documents. This mode references that path, applies what it says, and never restates it.

```bash
# Current count of files carrying the path.
grep -rl "hvr-rules.md" --exclude-dir=node_modules --exclude-dir=.git . | wc -l
```
