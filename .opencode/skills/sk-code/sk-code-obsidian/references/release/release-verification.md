---
title: Release Verification
description: The tag-triggered GitHub Actions release build, the exact three artifacts it ships, the versions.json/manifest.json contract a release must satisfy, and the annotated-tag release-notes requirement.
trigger_phrases:
  - "obsidian plugin release workflow"
  - "release.yml github actions"
  - "annotated tag release notes"
  - "versions.json minappversion mapping"
  - "main.js manifest.json styles.css release assets"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Release Verification

A release is a git tag push. `.github/workflows/release.yml` builds, verifies the tag carries
release notes, and publishes exactly three files as GitHub release assets. This reference is that
pipeline and the two version files it depends on being correct before the tag is pushed.

---

## 1. OVERVIEW

### When to Use

- Preparing a version bump before tagging a release
- Understanding what a tag push actually verifies before publishing
- Debugging a failed release workflow run
- Deciding whether a change needs a `versions.json` row in the same change

### Key Sources

- `.github/workflows/release.yml` — the workflow itself
- `manifest.json` — `version`, `minAppVersion`
- `versions.json` — the version → `minAppVersion` compatibility map
- `package.json` — `version` (kept in sync with `manifest.json`'s)

---

## 2. THE WORKFLOW

Triggered on any tag push matching `*.*.*` (`on: push: tags: - "*.*.*"`). Steps, in order:

1. Checkout with full history (`fetch-depth: 0`).
2. `npm ci` on Node 22.
3. `npx tsc --noEmit` — the release gate's only automated check beyond the build itself.
4. `npm run build` — produces `main.js`.
5. Fetch the pushed tag's **annotated message** as release notes:
   ```bash
   git fetch --force origin "refs/tags/$TAG_NAME:refs/tags/release-notes/$TAG_NAME"
   git for-each-ref --format='%(contents)' "refs/tags/release-notes/$TAG_NAME" > release-notes.md
   test -s release-notes.md
   ```
   A **lightweight** tag (no message) produces an empty file and fails the `test -s` check — the
   tag must be annotated (`git tag -a`), not lightweight.
6. `gh release create "$TAG_NAME" main.js manifest.json styles.css --title "$TAG_NAME" --notes-file release-notes.md`
7. Attest build provenance for the three uploaded files (`actions/attest-build-provenance@v2`).

Note what the workflow does **not** run: `vitest`, `screenshots:verify`, or `lint`. Those are the
repository's own change-gate (`verification.md`), expected to already be clean going into a
release tag — the release workflow's own automated check is `tsc --noEmit` plus a successful
build, nothing more.

---

## 3. THE THREE SHIPPED ARTIFACTS

Exactly `main.js`, `manifest.json`, and `styles.css` — the same three files the manual-install
path in `README.md` and `setup/setup.md` §3 copies into a vault's
`.obsidian/plugins/note-database/`. No other file (no `package.json`, no source, no
`screenshots/`) is part of a release.

---

## 4. VERSION FILES — BOTH MUST AGREE BEFORE TAGGING

- **`manifest.json`**: `version` is the version being released; `minAppVersion` is the Obsidian
  app-version floor this release requires.
- **`versions.json`**: a flat map of every previously released plugin `version` to the
  `minAppVersion` it required at the time — Obsidian's community plugin infrastructure reads this
  to decide which plugin version to install for a given Obsidian app version. **A new release
  needs a new row added to `versions.json` in the same change that bumps `manifest.json`'s
  `version`** — the release workflow does not add this row automatically, and a missing row means
  older Obsidian installs cannot resolve a compatible version.
- **`package.json`**: its own `version` field should track `manifest.json`'s; nothing in the
  release workflow enforces this, so treat a mismatch as a pre-tag review item.

---

## 5. PRE-TAG CHECKLIST

Before pushing an annotated release tag:

1. `manifest.json`'s `version` bumped, `package.json`'s `version` matching.
2. A new `versions.json` row added for the new version.
3. Full local gate green: `npx tsc --noEmit`, `npm run build`, `npx vitest run`,
   `npm run screenshots:verify` — see `../verification.md` for the exact baseline these compare
   against.
4. `npm run lint` re-run and its problem count reported (baseline 115; never claimed clean).
5. Tag created with `git tag -a <version> -m "<release notes>"` — an annotated tag, not
   lightweight, so step 5 of the workflow does not fail on an empty `release-notes.md`.

---

## 6. RELATED REFERENCES

- `../verification.md` — the full local gate this release checklist assumes is already green.
- `../../setup/setup.md` §3 — the manual-install path consuming the same three artifacts.
- `../standards/platform-support.md` — `minAppVersion`'s meaning for Obsidian's own compatibility
  resolution.
