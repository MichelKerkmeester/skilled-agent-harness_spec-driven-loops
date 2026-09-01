---
title: "sk-create-with-human-voice References"
description: "Router for this mode's reference set: what the voice rules may touch, and how a score is computed and proved."
trigger_phrases:
  - "human voice references"
  - "which voice reference to load"
  - "hvr workflow references"
importance_tier: normal
contextType: general
version: 1.1.0.1
---

# sk-create-with-human-voice References

| Load | When |
|------|------|
| [`scope-and-exemptions.md`](scope-and-exemptions.md) | **First, always.** Decides which spans of the target the standard governs. Skipping it is how a voice edit corrupts a quotation, a generated file or a test fixture |
| [`scoring-and-verification.md`](scoring-and-verification.md) | Once the scope is settled. Pass order, the precedence arithmetic, the bands, and the re-scan that proves a rewrite landed |
| [`hvr-rules.md`](hvr-rules.md) | The standard. Voice directives, punctuation bans, structural patterns, term lists, precedence and the pre-publish checklist. `scripts/hvr_scan.py` parses it at run time |

The standard lives here, in the packet that applies it, and exists exactly once. Nothing
in this folder restates it and nothing anywhere copies it: a consumer that needs a rule
links to this file. Frozen spec documents written before the move still carry the old
`shared/references/` path, and they keep it, because they record what was true when they
were written.

```bash
# Files carrying the path, frozen spec documents included.
grep -rl "hvr-rules.md" --exclude-dir=node_modules --exclude-dir=.git . | wc -l
```
