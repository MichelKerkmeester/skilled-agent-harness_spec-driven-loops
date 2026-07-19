---
title: "Known-deviation suppression"
description: "Invariant 2: each authority carries its own list of accepted, intentional conventions so a real repo-wide convention is never flagged as drift."
trigger_phrases:
  - "known-deviation suppression"
  - "accepted conventions list"
  - "loadKnownDeviations suppressKnownDeviations"
  - "per-authority deviation list"
  - "alignment invariant 2"
version: 1.0.0.1
---

# Known-deviation suppression

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Invariant 2 of the alignment contract: each authority carries its own list of accepted, intentional conventions so a real repo-wide convention is never flagged as drift.

This is the guard against the naive-linter failure mode. A real repo has intentional conventions that technically deviate from a template but are accepted and load-bearing; flagging them would drown a real finding in noise and erode trust. Each authority owns its own list, per ADR-005's per-authority requirement.

## 2. HOW IT WORKS

Each authority's `sk_*_known_deviations.md` reference doc carries a fenced JSON block that is the single source of truth — there is no separate, hand-synced copy in code. Each adapter's `loadKnownDeviations()` parses that block at runtime, and `suppressKnownDeviations()` runs as the final step of `check()`, filtering findings through per-authority match rules (`matchTypes` plus authority-specific qualifiers such as sk-doc's `matchDocTypes`/`requiresValidatorExitZero`, sk-git's `requiresCommitBeforeHookInstall`, sk-code's `matchSurfaces`, live-render's `matchTargetType`). A match suppresses only that one finding, never the whole artifact. Every entry traces to a real prior finding or an explicit repo-wide convention re-probed at authoring time, and the lists honestly distinguish currently-active entries from dormant ones that no wrapped tool can trigger today.

sk-git is a special case with two distinct mechanisms: its Git-generated-subject and `work/` launch-wrapper exemptions are structural pre-checks that return early before any finding is even produced (REQ-005 requires structural guarantee), while its legacy pre-hook packet-path scope rule uses the same post-hoc JSON suppression the other adapters use. The live-render adapter's deviation file does not exist yet — no real run has produced a finding to seed it — and its loader degrades gracefully to an empty list.

**Difference from deep-review:** deep-review has no per-authority deviation list at all — its convergence and quality gates guard against premature stop on weak evidence, but there is no "these conventions are intentional, do not flag them" registry, because it audits general correctness rather than conformance to a named standard. Suppression is intrinsic to deep-alignment precisely because its findings are relative to an authority's *own* rules, which have their own documented, intentional exceptions.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | §2 states invariant 2 and the NEVER "flag an authority's own documented, intentional convention as drift" rule. |
| `references/adapters/sk-doc-known-deviations.md` | Reference | The sk-doc suppression list (active + dormant entries), Section 8 fenced JSON parsed by the adapter. |
| `references/adapters/sk-git-known-deviations.md` | Reference | The sk-git list: two structural exemptions plus one post-hoc pre-hook-scope rule. |
| `references/adapters/sk-design-known-deviations.md` / `sk-code-known-deviations.md` | Reference | The sk-design and sk-code suppression lists. |
| `scripts/adapters/*.cjs` | Adapter | Each `loadKnownDeviations()`/`suppressKnownDeviations()`/`matchesDeviation()` implementing the filter. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Each `scripts/adapters/*.cjs` CLI (`standard-source`/`check`) | Manual dry-run | Confirms the loaded deviation list and its effect on real findings; the lists' own "Live-Reality Check" notes are the re-probe record. |

---

## 4. SOURCE METADATA

- Group: Alignment contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `alignment-contract/known-deviation-suppression.md`
- Primary sources: `SKILL.md`, `references/adapters/sk-doc-known-deviations.md`, `references/adapters/sk-git-known-deviations.md`
Related references:
- [verify-first.md](../../feature-catalog/alignment-contract/verify-first.md) — Verify-first
- [../adapter-contract/standard-source.md](../../feature-catalog/adapter-contract/standard-source.md) — standardSource(authority)
- [../adapter-contract/check.md](../adapter-contract/check.md) — check(artifact, rules)
