---
title: "Graph metadata write guard"
description: "Admits graph-metadata writes for a packet reached through a specs folder that links into another workspace, and refuses any destination outside the specs roots of both workspaces."
trigger_phrases:
  - "graph metadata write guard"
  - "graph-metadata.json linked specs root"
  - "refusing graph metadata outside a configured specs root"
  - "specs folder symlink graph metadata"
version: 1.0.0.0
---

# Graph metadata write guard (writeGraphMetadataFile)

## 1. OVERVIEW

The graph-metadata write guard decides whether `graph-metadata.json` may be written to a given path. A packet reached through a `specs` folder that links into another workspace's track is admitted, and a destination outside every specs root of both workspaces is still refused.

The continuity save workflow and the backfill run both refresh graph metadata through this guard. A project whose `specs` folder links into another workspace therefore gets its packets' metadata written at their real track location, while a destination outside the configured roots is refused.

---

## 2. HOW IT WORKS

### Core Behavior

Every write of `graph-metadata.json` must land inside a specs root. A specs root is the `specs` folder of a workspace, or the specs folder inside its `.opencode` directory. A root counts only when it exists and a real `.opencode` directory anchors its workspace, so a path that merely contains a `specs` segment has no roots and cannot authorize itself.

A destination inside a root is written. A destination outside every root is refused before anything is written, and the error reads `Refusing to write graph metadata outside a configured specs root:` followed by the path. A backfill run reports that error under `failed` in its JSON summary and exits 1. The refusal throws from the writer, so no file is created or replaced.

### Linked Specs Roots

A specs root can itself be a symbolic link to a track in another workspace, which is how a project checkout shares its packets with another repository. The guard therefore also compares real locations: a destination counts when its real location sits inside the real location of a root. The real location of a path is the target that its links resolve to, and a last segment that does not exist yet resolves through its real parent directory.

The roots used for this comparison come from two workspaces: the destination's own workspace and the workspace the process runs in. The second set matters because a continuity save resolves the packet before it refreshes, so the packet arrives already resolved into the other workspace. A save run from a project whose `specs` folder links into another workspace is admitted, and a packet outside the roots of both workspaces is still refused.

The refresh authorizes against the folder as the caller named it, through the project's own link, and then writes the canonical path, which is the real location the bytes reach. A packet reached through the project's link therefore gets its `graph-metadata.json` at the track's real path.

### Edge Cases

A symbolic link planted inside a root is trusted by design. The guard authorizes the path as spelled, so a link inside a root can point the write at a real location outside it. Creating such a link already requires write access to the repository.

A destination whose workspace cannot be anchored by a real `.opencode` directory contributes no roots, so it is refused unless the process's own workspace admits its real location.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `runtime/lib/graph/graph-metadata-parser.ts` | Shared | Owns the write guard (`isWithinConfiguredSpecsRoot`), the real-location comparison, the canonical-path writer `writeGraphMetadataFile` and the refresh `refreshGraphMetadataForSpecFolder` |
| `runtime/cli/graph/backfill-graph-metadata.ts` | Script | Scoped and all-tree backfill. It reports each writer refusal under `failed` and exits 1 |
| `runtime/cli/core/workflow.ts` | Script | Continuity save workflow that refreshes graph metadata for the packet it resolved |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `runtime/tests/graph-metadata-schema.vitest.ts` | Automated test | Writes through a linked specs root, refresh from a project whose specs root links into another workspace, and refusal of a packet outside both workspaces |
| `runtime/cli/tests/symlinked-project-root.vitest.ts` | Automated test | Continuity save of a packet reached through a specs folder that links into another workspace |
| `../../manual-testing-playbook/tooling-and-scripts/graph-metadata-write-guard.md` | Manual playbook | Scratch-project operator run of a linked track write and a refused stray packet |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/graph-metadata-write-guard.md`

Related references:
- [derived-packet-repair.md](derived-packet-repair.md) - Derived packet repair, including how it leaves a linked `graph-metadata.json` untouched
- [canonical-first-spec-root-resolution.md](canonical-first-spec-root-resolution.md) - Canonical-first spec-root resolution and the divergent-duplicate write guard
