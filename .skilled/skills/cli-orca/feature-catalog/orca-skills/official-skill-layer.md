---
title: "The official Orca skill layer"
description: "Explains and loads the eight official Orca skills as discovery stubs that defer their flags to the running binary."
trigger_phrases:
  - "official orca skill layer"
  - "official orca skills"
  - "orca discovery stub"
  - "orca skill snapshot provenance"
version: 1.0.0.0
---

# The official Orca skill layer (discovery stubs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Explains and loads the eight official Orca skills as discovery stubs that defer their flags to the running binary.

Orca publishes each skill as a short stub that tells an agent when to engage Orca and how to load the version-matched guide from the running CLI, because the real command flags live in the binary and cannot drift from the app version. The cli-orca skill carries one authored local reference per official skill plus a verbatim snapshot of every stub with a provenance record that pins each copy to an upstream release revision.

---

## 2. HOW IT WORKS

The official set is `computer-use`, `linear-tickets`, `orca-cli`, `orca-emulator`, `orca-emulator-android`, `orca-linear`, `orca-per-workspace-env` and `orchestration`. `orca-cli` covers worktrees, folder contexts, terminals, repositories, automations, artifacts, skill sharing, comments and the embedded browser. `orchestration` covers supervised coordination through Runs, task DAGs, dispatches, worker waits and coordinator loops. `computer-use` drives the GUI of a visible app window through `orca computer`. `orca-linear` runs Linear ticket work through `orca linear`, with `linear-tickets` as the legacy bundled name kept so existing installs converge. `orca-emulator` controls the iOS Simulator on macOS and `orca-emulator-android` controls Android devices and emulators over adb. `orca-per-workspace-env` owns per-workspace environment recipes in `orca.yaml`. Purpose wording comes from each stub's frontmatter. Seven install rows cover the eight names because `linear-tickets` has no install row, so its install command is unknown while its existing installs still resolve.

Loading follows the stub design. Each stub resolves one executable for the session in the fixed order the shared resolution block defines and stops rather than falling through, then loads the guide with `orca skills get <name> --full`, where the form without `--full` prints the compact guide. A guide with action gates names conditional references, one of which loads alone through `--reference references/<file>.md`, with `--references` listing the names. `--json` gives deterministic output and the resolved executable's `--help` covers commands the guide does not. A capability the installed guide does not establish is reported as unknown, because a stub is never a flag authority.

Two collisions stay explicit. `orca-linear` and `linear-tickets` are skill names rather than CLI namespaces and every command still runs as `orca linear`. The local `cli-external-orchestration` hub is a different thing from the official `orchestration` skill: the hub dispatches external CLI executors while the official skill coordinates supervised Orca workers. The stubs also fence each other: `orchestration` routes a full ownership handoff to `orca-cli`, and `computer-use` states it is not for Orca's embedded browser.

The local layer has three parts. One authored reference per skill under `references/orca-skills/` carries the boundary and the hand-off, with an overview holding the full boundary matrix and the install commands. The verbatim upstream wording of each stub is stored as `assets/<name>.txt`, where the `.txt` extension keeps the byte-identical copies outside the markdown frontmatter contracts. A provenance record pins every snapshot by release revision, package digest and sha256, states that the copies were compared byte for byte and against the manifest hashes, and records the refresh procedure together with the rule to record a mismatch instead of guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-orca/SKILL.md` | Routing contract | Holds the official-skill table, the two name collisions, the guide-loading rule and the NEVER rule against restating stub flags as local truth. |
| `.skilled/skills/cli-orca/references/orca-skills/overview.md` | Reference layer | Full boundary matrix, install commands, version-matched guide loading and the provenance pointer for the snapshot set. |
| `.skilled/skills/cli-orca/references/orca-skills/orca-cli.md` | Reference layer | Authored boundary and hand-off note for the flagship stub, one of the eight per-skill references. |
| `.skilled/skills/cli-orca/assets/PROVENANCE.md` | Provenance record | Snapshot source, per-skill release revisions, digests and hashes, the verification record and the refresh procedure. |
| `.skilled/skills/cli-orca/assets/orca-cli.txt` | Verbatim snapshot | Byte-identical upstream stub for `orca-cli`, one of the eight snapshot files kept outside the markdown contracts by the `.txt` extension. |
| `.skilled/skills/cli-orca/leaf-manifest.json` | Metadata projection | Declares the official-skill snapshot assets among the leaf resources the routing contract loads. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Node test | Document validator that classifies this catalog leaf and enforces the Validation And Tests table contract it carries. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Test harness | Fleet gate proving the cli-orca root carries a byte-fresh leaf manifest, so the snapshot assets stay declared routing targets. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Test harness | Package completion gate running the skill package checks for the standalone skill root. |

---

## 4. SOURCE METADATA

- Group: Official Skills
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `orca-skills/official-skill-layer.md`

Related references:

- [../feature-catalog.md](../feature-catalog.md): the package index linking this leaf
- [../../references/orca-skills/overview.md](../../references/orca-skills/overview.md): the boundary matrix and install commands for the eight stubs
- [../../assets/PROVENANCE.md](../../assets/PROVENANCE.md): the verbatim snapshot provenance and refresh procedure
