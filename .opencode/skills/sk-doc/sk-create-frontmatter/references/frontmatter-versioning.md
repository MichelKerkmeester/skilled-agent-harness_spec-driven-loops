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
version: 1.0.0.11
---

# Frontmatter Versioning Standard

Every in-scope skill documentation file carries a 4-part `version: X.Y.Z.W` field in its YAML frontmatter. This reference is the single source of truth for the format, how each document's version is derived, and how the field is inserted and enforced.

---

## 1. OVERVIEW AND SCOPE

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

This gate is mandatory, and its size is worth stating accurately because the number moved. A naive `git log --follow | wc -l` over-counts for two reasons: (a) the historical repo-wide rename `skill/ -> .opencode/skills/`, where a file inherits pre-move history as commits that changed zero of its lines, and (b) bulk sweep commits that touch a file's siblings without changing the file. The gate removes both.

Measured across all 1,214 in-scope docs of `sk-doc` and `system-spec-kit` on 2026-09-02, the ungated count is **1.06-1.09x** the gated one in aggregate, **2.25x** at the worst single file, and identical on 262 of `sk-doc`'s 390. No file in either skill reaches 3x. The gate still changes the answer on 128 of those 390, so run it. But a run that reports a large multiple today is reporting something other than these two inflators, and is worth reading before it is trusted.

Brand-new files (0-1 commits) get `W = 0`.

### Writing `W` is itself an edit, so one pass never converges

`W` is a function of git history, and applying `W` to a file changes that history. Commit a
reconcile and every file it touched is stale again by exactly one, because the version-only
commit changed a line and the numstat gate counts it. Reconcile again and the same thing
happens. This is a property of the definition, not a bug in any run, and it is why a bulk
`apply --update` looks like it failed when it did exactly what it was asked.

Two passes converge, and the second one must amend rather than add:

```bash
node frontmatter-version.mjs apply --skill <name> --update
git commit -m "..." -- .opencode/skills/<name>
node frontmatter-version.mjs apply --skill <name> --update
git commit --amend --no-edit -- .opencode/skills/<name>
```

The amend folds the second pass's increment into the commit that caused it, so the file's
history gains one commit and the file records one more edit. Verify then passes against a
clean tree, which is the only state worth calling converged. A green verify over a dirty
tree just means the numbers have not been committed yet.

The ordinary case avoids this entirely: run `apply` in the same commit as the content change
you are versioning, and no separate version-only commit ever exists.

### What is enforced, and what is advice

Two commands answer different questions and only one of them gates anything.

`gate` is the enforced check, and it is what the post-edit hook runs. It asks whether every
in-scope document carries a well-formed four-part version. It never consults git, so it cannot
drift and it cannot be made stale by a commit.

`verify` compares each recorded version against the value git implies right now. It is a
reconciliation tool, not a gate. Because writing a version is itself an edit, a fleet-wide
`verify` reports thousands of mismatches on a repository whose `gate` is clean, and that is the
expected reading rather than a fault to chase. Reconcile a skill when you want its numbers to
mean something precise. Do not reconcile the fleet to make `verify` quiet, since the sweep
rewrites every in-scope document, buries real changes in noise, and is undone by its own commit.

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
3. **Corpus gate:** `shared/scripts/check-frontmatter-versions.sh` (a wrapper for `frontmatter-version.mjs gate`) discovers every in-scope doc git-free and exits non-zero on any missing/malformed version. Run it in CI or pre-commit. Frontmatter-less docs are skipped, not failed.

---

## 8. EXAMPLES

| File | Anchor (max fm/changelog) | realEdit `W` | Derived version |
|------|---------------------------|-------------:|-----------------|
| `system-spec-kit/SKILL.md` | `3.6.0.0` | — | `3.6.0.0` |
| `system-spec-kit/README.md` | `3.6.x` | 41 | `3.6.0.41` |
| `sk-code/SKILL.md` | `3.5.0.0` | — | `3.5.0.0` |
| `sk-code/ROUTER.md` | `3.5.x` | 9 | `3.5.0.9` |
| `sk-design/.../design-principles.md` | `1.5.x` | 4 | `1.5.0.4` |

Every major equals the owning skill's major — always low.

---

## 9. RELATED RESOURCES

- [frontmatter-templates.md](../assets/frontmatter-templates.md) — frontmatter by document type (carries the per-class `version` rows)
- Engine: [`frontmatter-version.mjs`](../../shared/scripts/frontmatter-version.mjs), the deterministic compute/insert/verify tool that implements this standard
- Corpus gate: [`check-frontmatter-versions.sh`](../../shared/scripts/check-frontmatter-versions.sh), the CI wrapper that runs the engine in `gate` mode
