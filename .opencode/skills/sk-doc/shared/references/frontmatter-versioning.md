---
title: Frontmatter Versioning Standard - 4-Part Derivation Reference
description: Canonical rules for the 4-part version field carried by every in-scope skill doc, including changelog-anchored derivation and idempotent insertion.
trigger_phrases:
  - "frontmatter versioning standard"
  - "4-part version derivation"
  - "changelog anchored version"
  - "numstat gated edit count"
  - "skill anchored doc version"
importance_tier: important
contextType: general
version: 1.8.0.0
---

# Frontmatter Versioning Standard

Every in-scope skill documentation file carries a 4-part `version: X.Y.Z.W` field in its YAML frontmatter. This reference is the single source of truth for the format, how each document's version is derived, and how the field is inserted and enforced.

---

## 1. SCOPE

### In scope (MUST carry `version`)

Under `.opencode/skills/*/`:

| Doc class | Path glob |
|-----------|-----------|
| Skill manifest | `SKILL.md` |
| Skill readme | `README.md` |
| References | `references/**/*.md` |
| Assets | `assets/**/*.md` |
| Feature catalogs | `feature-catalog/**/*.md` (roots **and** per-feature leaves) |
| Testing playbooks | `manual-testing-playbook/**/*.md` (roots **and** per-feature leaves) |

### Out of scope (do NOT add `version` in this standard)

`.opencode/commands/*.md`, `.opencode/agents/*.md`, and standalone `.opencode/install-guides/`. These also carry frontmatter but are governed separately; a follow-up packet may bring them in.

---

## 2. FORMAT — `X.Y.Z.W`

Exactly four dot-separated non-negative integers. Segments are **not** capped at 9 — the minor/patch/build may grow large — but the **major stays low** by construction (it is inherited from the human-curated skill version, never computed from git).

| Segment | Name | Source |
|---------|------|--------|
| `X` | major | Skill anchor major (human-curated; rarely changes) |
| `Y` | minor | Skill anchor minor (human-curated; changelog cadence) |
| `Z` | patch | Reserved for future granular per-doc bumps; seeded `0` |
| `W` | build | Per-document real edit count (git-derived) |

> Design rule: keep the front digit low. A document reads `3.6.0.41` (low major, magnitude in the build segment), never `41.x.x.x`.

Validation pattern: `^\d+\.\d+\.\d+\.\d+$`.

---

## 3. SKILL ANCHOR (per skill)

A skill's anchor is the version written to its `SKILL.md` and inherited (major.minor) by all of its child docs:

```
anchor = max( normalize4(SKILL.md frontmatter version),
              normalize4(highest changelog/v*.md filename version) )
```

- Compared as integer tuples (not string compare).
- The changelog is frequently **more current** than the frontmatter (e.g. `system-spec-kit` frontmatter `3.4.1.0` vs changelog `3.6.0.0`); taking `max` reconciles them.
- If the skill has no `changelog/` directory, fall back to the frontmatter version and record `anchor-source = frontmatter-only`.
- Mode-packet sub-skills (a `SKILL.md` nested under a parent skill) each resolve their own anchor; their child docs inherit from the nearest `SKILL.md`.

The `SKILL.md` version is set to the anchor (normalized to 4-part). This reconciles stale frontmatter values and normalizes any 3-part versions.

---

## 4. CHILD DOC VERSION

For every in-scope doc that is **not** a `SKILL.md`:

```
X = anchor.major          # inherited — stays low
Y = anchor.minor          # inherited — ties the doc to its skill-version era
Z = 0                     # reserved for future granular per-doc patch bumps
W = min( realEditCount(file), 99 )
```

### `realEditCount(file)` — the critical correctness rule

`W` is the number of commits whose **own added+deleted line count for that file is > 0**. Trace the path with `git log --follow` for continuity across renames, but **gate every commit through per-file `numstat`** and discard commits that changed 0 lines in the file.

This gate is mandatory: a naive `git log --follow | wc -l` over-counts by **3-5x** because of (a) the historical repo-wide rename `skill/ -> .opencode/skills/` (every file inherits the pre-move history as zero-line "edits") and (b) bulk sweep commits that touch a file's siblings without changing the file. The numstat gate removes both.

Brand-new files (0-1 commits) get `W = 0`.

---

## 5. NORMALIZATION & EDGE CASES

| Case | Rule |
|------|------|
| 3-part version (`1.4.0`) | Append `.0` exactly once -> `1.4.0.0`. Never left-pad or shift segments; padding adds zero magnitude and cannot inflate. |
| No `changelog/` dir | Anchor = frontmatter version; record `anchor-source = frontmatter-only`. |
| File has no frontmatter | Skip and report (`skipped:no-frontmatter`). A versioning pass never synthesizes a frontmatter block. |
| `version` already present, equal to computed | No-op. |
| `version` already present, differs | Skip and report (`skip-conflict`); never silently overwrite a human-set version. An explicit `--update` flag rewrites. |
| `SKILL.md` differs from its anchor | Reconciled to the anchor (engine `reconcile` path). The `SKILL.md` version IS the anchor of record, so this is the one intentional exception to the skip-on-differ rule above, and it is not gated by `--update`. |
| Idempotency | Re-running a versioned tree is a byte-level no-op. |

---

## 6. INSERTION RULE

Insert `version: X.Y.Z.W` as the **last key inside the frontmatter block, immediately before the closing `---`**. This is field-relative, not a fixed line number: a reference carries the 5-field block (`title/description/trigger_phrases/importance_tier/contextType`) while a playbook leaf may carry only `title` + `description`. "Last line before closing `---`" is correct for every doc class and never lands inside a multi-line `trigger_phrases` array.

Edit **line-wise**. Never run a YAML re-serializer — it reflows and corrupts multi-line block sequences such as `trigger_phrases`.

---

## 7. ENFORCEMENT ROLLOUT

`version` is a **required** field for all in-scope doc classes. Enforcement is now active:

1. **Format-check:** `quick_validate.py` and `package_skill.py` reject a `version` that is not `^\d+\.\d+\.\d+\.\d+$`.
2. **Required:** the same validators error on an absent `version` for skills (commands keep it optional).
3. **Corpus gate:** `scripts/check-frontmatter-versions.sh` (a wrapper for `frontmatter-version.mjs gate`) discovers every in-scope doc git-free and exits non-zero on any missing/malformed version. Run it in CI / pre-commit; frontmatter-less docs are skipped, not failed.

---

## 8. EXAMPLES

| File | Anchor (max fm/changelog) | realEdit `W` | Derived version |
|------|---------------------------|-------------:|-----------------|
| `system-spec-kit/SKILL.md` | `3.6.0.0` | — | `3.6.0.0` |
| `system-spec-kit/README.md` | `3.6.x` | 41 | `3.6.0.41` |
| `sk-code/SKILL.md` | `3.5.0.0` | — | `3.5.0.0` |
| `sk-code/references/smart-routing.md` | `3.5.x` | 5 | `3.5.0.5` |
| `sk-design/.../design-principles.md` | `1.5.x` | 4 | `1.5.0.4` |

Every major equals the owning skill's major — always low.

---

## 9. RELATED RESOURCES

- [frontmatter-templates.md](../assets/frontmatter-templates.md) — frontmatter by document type (carries the per-class `version` rows)
- Engine: `scripts/frontmatter-version.*` — the deterministic compute/insert/verify tool that implements this standard
