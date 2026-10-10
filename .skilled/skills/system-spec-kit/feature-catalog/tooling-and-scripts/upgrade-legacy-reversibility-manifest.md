---
title: "Upgrade-legacy reversibility manifest and refusals"
description: "Records a reversibility manifest before a dirty tree is repaired, and refuses an apply that has no git repository, an unfinished manifest or a manifest that no longer matches the repository."
trigger_phrases:
  - "Upgrade-legacy reversibility manifest and refusals"
  - "upgrade-legacy manifest"
  - "upgrade-legacy.manifest.json"
  - "upgrade-legacy apply refusal"
version: 1.0.0.0
---

# Upgrade-legacy reversibility manifest and refusals (upgrade-legacy.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Upgrade-legacy repairs a spec tree in place, so a run that stops halfway must leave a record of what it touched. Before it repairs a dirty tree, the command writes a reversibility manifest into the git directory of the repository. The manifest lists the packets in scope, a hash of each packet tree and the bytes of every uncommitted file inside those packets. An apply that cannot write that record stops before it changes anything.

The manifest is what lets a later run tell an interrupted repair from a finished one, and it is what a person restores from when a repair goes wrong. It lives outside the working tree, so it never shows up in `git status`.

---

## 2. HOW IT WORKS

### Manifest Lifecycle

The command writes the manifest only when the apply path finds packets that fail and the working tree has uncommitted changes. The manifest records the HEAD commit, a schema version of 1, the scope and the before image of each uncommitted file inside a failing packet. Its status is `in-progress` while the repairs run. Once the run has recorded its baselines, the status becomes `complete` and each scope hash is recomputed from the repaired packets.

### Refusals

Apply needs the repository to be a git repository. Without one it writes `upgrade-legacy: --apply requires REPO to be a git repository` to stderr, exits 2 and writes nothing. A manifest makes apply exit 2 in three cases: its status is `in-progress`, its recorded HEAD commit is no longer the repository's HEAD, or the hash it recorded for a packet no longer matches that packet on disk. Each message names the manifest and both HEAD commits, and a packet mismatch also names the packet and its two hashes. The in-progress message asks for the manifest's before images to be restored before a retry. Apply stops before it changes any packet in these cases. The dry run reports the same condition and carries on, so an operator can still see what would change.

A tree whose packets still live under the legacy `.opencode` spec root is refused by both the dry run and apply, with exit 2. The refusal prints the three commands that move the tree to `specs/`, and it writes nothing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Script | Writes and completes the reversibility manifest, reads it back for interruption and refuses the git, interrupted and v3 layout cases |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Vitest | Covers the dry run and apply paths, including the unwritable manifest case |
| `.skilled/skills/system-spec-kit/runtime/tests/upgrade-baseline.vitest.ts` | Vitest | Covers how the baseline the run records is read back on a later dry run |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/upgrade-legacy-reversibility-manifest.md`

Related references:
- [upgrade-legacy-downgrades-report.md](upgrade-legacy-downgrades-report.md) - The Downgrades and grouped detail report that the same run prints
- [repo-era-report.md](repo-era-report.md) - The layout reading the dry run and apply both judge against
