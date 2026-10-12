---
title: Frontmatter Versioning Standard - Skill Edition Reference
description: Canonical rules for the 4-part version field, which names the skill edition and lives on SKILL.md only, anchored to the changelog.
trigger_phrases:
  - "frontmatter versioning standard"
  - "skill edition version contract"
  - "changelog anchored version"
  - "version on skill md only"
  - "4-part version format"
importance_tier: important
contextType: general
version: 1.0.0.11
---

# Frontmatter Versioning Standard

`version` names the skill edition. It lives on `SKILL.md` only, as a 4-part `version: X.Y.Z.W` field, and it equals the highest of that frontmatter value and the skill's newest changelog entry. Child docs carry no version. This reference is the single source of truth for the format, the anchor rule and how the field is enforced.

---

## 1. OVERVIEW AND SCOPE

### In scope (MUST carry `version`)

| Doc class | Path glob |
|-----------|-----------|
| Skill manifest | `.skilled/skills/*/SKILL.md`, and the `SKILL.md` of every mode packet nested under a hub |

### Out of scope (MUST NOT carry `version`)

The child docs of a skill: a `README.md` beside a `SKILL.md`, and every file under `references/**`, `assets/**`, `feature-catalog/**` and `manual-testing-playbook/**`. A child doc ships inside the same package as its `SKILL.md` and its changelog, so the edition is already known to anyone who holds it, and a per-doc copy only goes stale.

Other files under a skill, such as a hub's `ROUTER.md`, benchmark reports, component READMEs, examples and hook docs, sit outside this contract. A `version` on one of them is not the skill edition, and no check reads it.

Changelog entries keep the version of the release they record, and `package_skill.py` checks it. `.skilled/commands/*.md` and `.skilled/agents/*.md` are governed separately: a command's `version` stays optional, and an agent carries none.

---

## 2. FORMAT: `X.Y.Z.W`

Exactly four dot-separated non-negative integers, validated by `^\d+\.\d+\.\d+\.\d+$`. The value is the skill edition the changelog records, so the segments follow the release cadence in [`sk-create-changelog`](../../sk-create-changelog/SKILL.md) rather than any per-document count.

---

## 3. SKILL ANCHOR

A skill's version is its anchor:

```
anchor = max( normalize4(SKILL.md frontmatter version),
              normalize4(highest changelog/v*.md filename version) )
```

- Compared as integer tuples, not as strings.
- If the skill has no `changelog/` directory, the anchor is the frontmatter version and the engine records `anchor-source = frontmatter-only`.
- A mode packet's `SKILL.md` resolves its own anchor from its own changelog. It is never compared against its hub's.

The anchor never consults git, so no commit can make it stale. It changes only when a release adds a changelog entry above the frontmatter value, and that release is the moment to raise the `SKILL.md` version to match.

---

## 4. NORMALIZATION AND EDGE CASES

| Case | Rule |
|------|------|
| 3-part version (`1.4.0`) | Append `.0` exactly once, giving `1.4.0.0`. Never shift segments. |
| No `changelog/` dir | Anchor = frontmatter version, `anchor-source = frontmatter-only`. |
| `SKILL.md` has no frontmatter | Skip and report (`skip-no-frontmatter`). A versioning pass never synthesizes a block. |
| `SKILL.md` differs from its anchor | `apply` reconciles it to the anchor. |
| Idempotency | Re-running `apply` on a reconciled tree is a byte-level no-op. |

---

## 5. INSERTION RULE

When `apply` adds a missing `version`, it inserts `version: X.Y.Z.W` as the last key of the frontmatter block, immediately before the closing `---`. Edit line-wise. Never run a YAML re-serializer, because it reflows multi-line values such as a block list.

---

## 6. ENFORCEMENT

Three checks read the field, and each one is git-free:

1. **Post-edit gate:** editing a `SKILL.md` runs `shared/scripts/check-frontmatter-versions.sh`, a wrapper for `frontmatter-version.mjs gate`, which fails a missing or malformed `version`.
2. **Validators:** `quick_validate.py` and `package_skill.py` require a 4-part `version` on `SKILL.md`, and `package_skill.py` also checks the version on changelog entries.
3. **Reconciliation:** `frontmatter-version.mjs verify` compares each `SKILL.md` version with its anchor and exits 0 when they agree. It is run by hand after a release, and no workflow or git hook calls it.

### What nothing enforces

Every check above is per-document. No gate compares a hub's routing artifacts against each other, so nothing fails when `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` state different values. Version parity across a hub's own artifacts is upheld by convention and review, which is why the shared value is restated in each hub's `SKILL.md`.

---

## 7. EXAMPLES

| File | Frontmatter | Highest changelog | Version |
|------|-------------|-------------------|---------|
| `system-spec-kit/SKILL.md` | `2.7.11.0` | `v2.7.11.0.md` | `2.7.11.0` |
| A `SKILL.md` that lags its newest entry | `1.2.0.0` | `v1.3.0.0.md` | `1.3.0.0` after `apply` |
| `sk-code/references/...` | none | n/a | none, a child doc |

---

## 8. RELATED RESOURCES

- [frontmatter-templates.md](../assets/frontmatter-templates.md): frontmatter by document type, with `version` on the `SKILL.md` template only
- Engine: [`frontmatter-version.mjs`](../../shared/scripts/frontmatter-version.mjs), the deterministic compute, apply, verify and gate tool that implements this standard
- Gate wrapper: [`check-frontmatter-versions.sh`](../../shared/scripts/check-frontmatter-versions.sh), which the post-edit hook runs in `gate` mode
