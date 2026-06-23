---
title: "Spec 154 Timeline"
description: "Chronological view of the skill frontmatter versioning work across six phases plus the two-model deep review, all on 2026-06-23, from the versioning standard through the remediation."
trigger_phrases:
  - "154 timeline"
  - "frontmatter versioning timeline"
  - "versioning work chronology"
importance_tier: "normal"
contextType: "implementation"
---
# Spec 154 Timeline

The whole effort ran on 2026-06-23. The order below mirrors the spec tree, phases 1 through 6, with the two-model deep review sitting between phase 5 and phase 6.

| Step | Phase | What happened |
|------|-------|---------------|
| 1 | 001 versioning standard | Wrote the 4-part `X.Y.Z.W` standard into sk-doc, added `version` to the nine doc templates and promoted it to required in the validators. |
| 2 | 002 derivation engine | Built `frontmatter-version.mjs` with compute, apply, verify and gate modes, anchored to `max(frontmatter, changelog)` and gated on numstat. Added a 21-assertion test suite. |
| 3 | 003 apply core docs | Versioned 457 core docs (SKILL.md, README, references and assets) from the precomputed manifest. Normalized 12 SKILL.md including the four pre-existing 3-part files. |
| 4 | 004 apply catalogs and playbooks | Versioned the full corpus, 693 feature-catalog and 1,060 testing-playbook docs, 1,753 in all, from the same manifest. |
| 5 | 005 verify and enforce | Flipped the validators to required everywhere in scope and added the corpus-wide CI gate. The full-corpus gate ran clean at 2,210 versioned and 12 skipped. |
| 6 | deep review | Ran a two-model deep review, MiMo v2.5 Pro and DeepSeek v4 Pro at five iterations each. Verdict CONDITIONAL with zero P0 and no correctness or security defects. Every finding was documentation or metadata drift. |
| 7 | 006 fix deep-review findings | Corrected the spec counts to the gate ground truth, refreshed parent and child metadata and continuity, populated the child plan and tasks, documented the reconcile exception and hardened the engine. |

## Closing state

Every in-scope skill doc carries a 4-part version. The standard is enforced by a gate that blocks any in-scope doc missing or malformed. The engine passes 21 of 21 assertions, the corpus gate exits 0 at 2,222 files, and `validate.sh --strict` exits 0 on the parent and all six children.

The chronological detail per phase lives in the per-phase leaf changelogs under [`changelog/`](./changelog/). The before-and-after narrative lives in [`before-vs-after.md`](./before-vs-after.md).
