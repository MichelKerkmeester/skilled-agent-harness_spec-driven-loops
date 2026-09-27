---
title: "Skilled Release Notes"
description: "Release notes for every Skilled framework release, one entry per version."
trigger_phrases:
  - "skilled release notes"
  - "framework release line"
  - "skilled changelog"
---

# Skilled Release Notes

> One entry per Skilled release, written for the operator who upgrades the framework.

---

## 1. OVERVIEW

This folder holds the framework's release notes, one entry per Skilled release. An entry's version is the git tag and GitHub release of the same number.

| Path | Holds |
|---|---|
| `v1+/`, `v2+/`, `v3+/` | Older entries, grouped by generation |
| `v4.0.0.0.md`, `v4.0.0.1.md`, `v4.0.0.2.md` | Current generation entries at the top level |

An entry lives here when a GitHub release carries its version number. The entry for the upcoming release lives here too, before its tag exists. Today that is `v4.0.0.2.md`.

---

## 2. ADDING AN ENTRY

Run `/create:changelog skilled`. The workflow writes to this folder only when the operator names `skilled`.

Adding `--release` also tags `v<version>` and publishes the GitHub release, titled with the tag and the entry's editorial title.

House style: `v4.0.0.0.md` in this folder is the canonical exemplar that the changelog template points to.

---

## 3. VERSIONS

The scheme is `MAJOR.MINOR.SERIES.PATCH`. The version is also the release's git tag. Pass `--bump` explicitly for a release entry.

| `--bump` value | Bumps |
|---|---|
| `major` | MAJOR |
| `minor` | MINOR |
| `patch` | SERIES |
| `build` | PATCH |

---

## 4. RELATED

Each skill keeps its own changelog in `.skilled/skills/<skill>/changelog/`, reachable as `.skilled/changelog/<skill>/`. system-spec-kit's own history, for example, is in `.skilled/skills/system-spec-kit/changelog/`.

| Resource | Purpose |
|---|---|
| [`v4.0.0.0.md`](./v4.0.0.0.md) | Canonical exemplar for entry style |
| [`changelog-template.md`](../../skills/sk-doc/sk-create-changelog/assets/changelog-template.md) | Template every entry follows |
| [`PUBLIC-RELEASE.md`](../../../PUBLIC-RELEASE.md) | Release process and version scheme |
