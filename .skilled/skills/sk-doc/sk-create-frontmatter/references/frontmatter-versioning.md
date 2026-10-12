---
title: Frontmatter Versioning Standard - Per-Doc Edition Reference
description: Canonical rules for the 4-part version field: SKILL.md carries the skill edition anchored to the changelog, and every other skill doc carries its own edition, raised at commit.
trigger_phrases:
  - "frontmatter versioning standard"
  - "per doc version contract"
  - "doc version bump rule"
  - "changelog anchored version"
  - "4-part version format"
importance_tier: important
contextType: general
version: 1.0.2.0
---

# Frontmatter Versioning Standard

Every skill doc carries a 4-part `version: X.Y.Z.W` field in its frontmatter. On `SKILL.md` it names the skill edition and equals the newest changelog entry. On every other doc it names that doc's own edition: a new doc starts at `1.0.0.0`, and any change to its body raises it. This reference is the single source of truth for the format, the scope, the bump rule and how the field is enforced.

---

## 1. OVERVIEW AND SCOPE

### In scope (MUST carry `version`)

Every Markdown doc under `.skilled/skills/**` that has a frontmatter block:

| Doc | Version it carries |
|-----|--------------------|
| `SKILL.md`, at a skill root or a mode-packet root | The skill edition, anchored to the changelog (Section 3) |
| Every other doc: READMEs, references, assets, feature catalogs, testing playbooks, `ROUTER.md`, `ARCHITECTURE.md`, `INSTALL-GUIDE.md`, hook docs and the rest | Its own edition, raised by the bump rule (Section 4) |

### Out of scope

| Class | Why |
|-------|-----|
| Changelog entries (`changelog/**`) | They keep the version of the release they record, which `package_skill.py` checks |
| Test input: anything under a `tests/` or `fixtures/` folder | A fixture is shaped like a doc but is input to a test, and a test may compare its bytes |
| Generated output and runtime internals: anything under `runtime/`, `benchmark/` or `behavior-benchmark/`, unless a `references/`, `assets/`, `feature-catalog/` or `manual-testing-playbook/` folder sits above the file | Reports, corpora and code-folder notes are produced or owned by their tooling. A catalog or playbook inside a runtime folder is still authored, so it stays in |
| Filled spec-folder examples under `templates/examples/` | They carry system-spec-kit's spec-doc frontmatter, not a skill doc's |
| A doc with no frontmatter block, such as the style corpus | Every check skips it, and a versioning pass never synthesizes a block |
| `.skilled/scratch/`, `node_modules/`, `dist/` | Not docs |

`.skilled/commands/*.md` and `.skilled/agents/*.md` are governed separately: a command's `version` stays optional, and an agent carries none.

---

## 2. FORMAT: `X.Y.Z.W`

Exactly four dot-separated non-negative integers, validated by `^\d+\.\d+\.\d+\.\d+$`. A value may be quoted (`version: "1.2.0.0"`); the check reads the value inside the quotes, and a raise keeps them.

---

## 3. SKILL ANCHOR

A `SKILL.md` version is its skill's anchor:

```
anchor = max( normalize4(SKILL.md frontmatter version),
              normalize4(highest changelog/v*.md filename version) )
```

- Compared as integer tuples, not as strings.
- If the skill has no `changelog/` directory, the anchor is the frontmatter version and the engine records `anchor-source = frontmatter-only`.
- A mode packet's `SKILL.md` resolves its own anchor from its own changelog. It is never compared against its hub's.

The anchor never consults git. It changes only when a release adds a changelog entry, and that release is the moment to raise the `SKILL.md` version to match. The commit gate never touches `SKILL.md`.

---

## 4. BUMP RULE FOR EVERY OTHER DOC

A doc's edition goes up whenever its body changes. The body is everything after the closing `---` of the frontmatter block, so a change to the frontmatter alone, the version line included, raises nothing.

| Case | Result |
|------|--------|
| New doc with no version | `1.0.0.0` |
| Body changed, version not raised since the base | Third segment up by one, fourth reset: `1.2.3.4` becomes `1.2.4.0` |
| Body changed, version already raised by hand to any higher value | Left alone |
| Only the frontmatter changed | Nothing |
| Renamed without a content change | Nothing |
| Malformed version, such as `1.2` | Not guessed at; the author sets a 4-part value |

The comparison base is the merge base of the base ref and `HEAD`: `HEAD` itself at commit time, the target branch on a pull request. A raise rewrites the version line in place in its own quoting, or inserts `version: 1.0.0.0` as the last frontmatter key when the doc has none.

---

## 5. NORMALIZATION AND EDGE CASES

| Case | Rule |
|------|------|
| 3-part version (`1.4.0`) | `apply` appends `.0` exactly once, giving `1.4.0.0`. Never shift segments. `verify` fails a 3-part value on a doc that is not `SKILL.md` |
| No `changelog/` dir | Anchor = frontmatter version, `anchor-source = frontmatter-only` |
| A doc has no frontmatter | Skip and report (`skip-no-frontmatter`) |
| `SKILL.md` differs from its anchor | `apply` reconciles it to the anchor |
| A doc has no version | `apply` inserts `1.0.0.0`; a valid version is kept |
| An empty `version:` key | Malformed, not missing: `verify`, `gate` and `bump` fail and name the doc. Set a 4-part value by hand |
| A leading zero (`01.2.0.0`) | Read as its tuple, `1.2.0.0`. `apply` rewrites it in that canonical form |
| A move that also rewrites most of the body | git pairs a rename only above its similarity threshold (50% by default), so such a move reads as a new doc. Its carried version is kept and nothing is raised; raise it by hand when the edition matters |
| A staged path with a line break, or a doc that is a symlink in the working tree | `bump` refuses it and names the path, since the hook stages raised paths one per line and a raise must not write through a link |
| Idempotency | Re-running `apply` on a reconciled tree is a byte-level no-op |

---

## 6. INSERTION RULE

When `apply` or `bump` adds a missing `version`, it inserts `version: X.Y.Z.W` as the last key of the frontmatter block, immediately before the closing `---`. Edit line-wise. Never run a YAML re-serializer, because it reflows multi-line values such as a block list.

---

## 7. ENFORCEMENT

| Check | When it runs | What it does |
|-------|--------------|--------------|
| Pre-commit gate `[gate:doc-version-bump]` | Every commit that stages a doc in scope | Runs `frontmatter-version.mjs bump`, raises each doc whose body changed and re-stages it. It blocks on a doc staged and unstaged at once, a malformed version, or a pathspec-narrowed commit that needs a raise. Bypass: `SPECKIT_SKIP_DOC_VERSION_BUMP=1`, or `git config speckit.hooks.docVersionBump off` to keep it off |
| Pull-request check | `doc-version-raise` in `skill-doc-frontmatter.yml` | Runs `bump --check --base origin/<base>` and fails on a changed doc whose body changed and whose version did not go up. The fix is the command it prints: `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/<base>`, then commit |
| `verify` | By hand | Each `SKILL.md` equals its anchor, and every other doc in scope carries a valid 4-part version |
| `gate` | The post-edit hook, through `check-frontmatter-versions.sh` | Presence and format on every doc in scope, git-free |
| Validators | `quick_validate.py`, `package_skill.py` | A 4-part version on `SKILL.md`; `package_skill.py --strict` also on every doc in scope and on changelog entries |

### What nothing enforces

No gate compares a hub's routing artifacts against each other, so nothing fails when `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` state different values, except the parent-skill doctor's README check. Hub-root artifacts carry the hub release, restated in each hub's `SKILL.md`.

---

## 8. EXAMPLES

| File | Before | Change | After |
|------|--------|--------|-------|
| `system-spec-kit/SKILL.md` | `2.7.11.0`, newest entry `v2.7.11.0.md` | none | `2.7.11.0` |
| A `SKILL.md` that lags its newest entry | `1.2.0.0`, newest entry `v1.3.0.0.md` | `apply` | `1.3.0.0` |
| `sk-code/references/stack-detection.md` | `1.5.0.6` | body edit | `1.5.1.0` |
| A new `assets/guide.md` | none | added | `1.0.0.0` |
| `references/guide.md` | `1.0.1.0` | description edit only | `1.0.1.0` |

---

## 9. RELATED RESOURCES

- [frontmatter-templates.md](../assets/frontmatter-templates.md): frontmatter by document type, each in-scope template seeding `version: 1.0.0.0`
- Engine: [`frontmatter-version.mjs`](../../shared/scripts/frontmatter-version.mjs), the compute, apply, verify, gate and bump tool that implements this standard
- Gate wrapper: [`check-frontmatter-versions.sh`](../../shared/scripts/check-frontmatter-versions.sh), which the post-edit hook runs in `gate` mode
