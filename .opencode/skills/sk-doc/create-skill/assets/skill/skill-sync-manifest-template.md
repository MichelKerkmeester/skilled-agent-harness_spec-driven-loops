---
title: "[RUNTIME] — Runtime Sync Manifest"
description: "How [RUNTIME_DIR] derives from .opencode: [SUMMARY]."
---

# [RUNTIME] Sync Manifest

Purpose: Document how [RUNTIME_DIR] derives from the canonical `.opencode/` tree.

<!-- Keep this manifest factual and repository-root-relative. Replace every placeholder, remove unused scaffolding, and preserve the nine-section order. -->

## 1. OVERVIEW

[PLACEHOLDER: Describe what [RUNTIME_DIR] contains, which canonical tree or trees it derives from, and the important exceptions.]

<!-- Authoring guidance: Name the runtime's discovery paths and the canonical source of truth. Explain the main sync model and any deliberate asymmetry in 1-3 lines. -->

## 2. SURFACE INVENTORY

<!-- Authoring guidance: Keep one row per surface. The Mechanism cell must use exactly one taxonomy label: whole-dir symlink, per-file symlink, generated, hand-authored, or operator-local. State the exact source, whether the surface can drift, and name its checker whenever it can. -->

| Surface | Mechanism | Source | Can it drift? | Checker |
|---|---|---|---|---|
| [WHOLE-DIR SURFACE] | whole-dir symlink | [EXACT SOURCE] | No — same inode | n/a |
| [PER-FILE SURFACE] | per-file symlink | [EXACT SOURCE] | [Yes/No] | [CHECKER OR n/a] |
| [GENERATED SURFACE] | generated | [EXACT SOURCE] | Yes | [CHECKER] |
| [HAND-AUTHORED SURFACE] | hand-authored | [EXACT SOURCE OR —] | [Yes/No/n/a] | [CHECKER OR n/a] |
| [OPERATOR-LOCAL SURFACE] | operator-local | [LOCAL-ONLY ORIGIN] | No — not synced | n/a |

## 3. WHEN TO SYNC

- [PLACEHOLDER: Change that requires a sync]
- [PLACEHOLDER: Add, rename, or retire event that requires a sync]
- [PLACEHOLDER: Change that does not require a sync because the surface is linked]

<!-- Authoring guidance: Describe the source changes that trigger regeneration, mirroring, or hand edits. Call out rename and retire behavior when stale output can survive. -->

## 4. SYNC WORKFLOW

```bash
# [PLACEHOLDER: Regenerate or refresh the runtime surface]
[COMMAND FROM REPO ROOT]

# [PLACEHOLDER: Run the runtime-specific verification]
[COMMAND FROM REPO ROOT]
```

<!-- Authoring guidance: Every command must be copy-pasteable from the repository root. State whether it writes, checks, installs, backs up, or prunes, and preserve the safe ordering. -->

## 5. FORMAT CONTRACT

### [RUNTIME FORMAT]

[PLACEHOLDER: Describe the runtime parser, file naming rules, frontmatter or config schema, path-shape quirks, and any event or tool vocabulary differences.]

### Strict YAML Caution

An unquoted `description:` containing a colon is invalid YAML, and some runtimes silently drop the whole file:

```yaml
description: "[DESCRIPTION WITH A COLON: QUOTE THIS]"
```

<!-- Authoring guidance: Record the parser quirks that affect loading. Include the strict-YAML caution even when the current runtime is lenient, because a shared canonical file may be consumed by a stricter sibling. -->

### Generated Surface Losses

[PLACEHOLDER: For each generated surface, state exactly what generation loses or derives. If there is no generated surface, write `None`.]

<!-- Authoring guidance: Lossy mappings cannot round-trip. Name fields, permissions, metadata, or paths that cannot be recovered from generated output. -->

## 6. REQUIRED PARITY

- [PLACEHOLDER: Required surface or roster parity]
- [PLACEHOLDER: Required source-path or symlink invariant]
- [PLACEHOLDER: Required parser or generated-output invariant]

<!-- Authoring guidance: Never hard-code counts as authority. Any “N agents” or “N commands” claim must name the authoritative drift check so the check dates the snapshot when items are added or retired. -->

## 7. DRIFT CHECKS

<!-- Authoring guidance: Every command must run unchanged from the repository root. Use exit semantics exactly as implemented: 0 ok / 1 drift; document any additional exit codes explicitly. -->

| Check | Command | Exit |
|---|---|---|
| [CHECK NAME] | `[COMMAND FROM REPO ROOT]` | 0 ok / 1 drift |
| [CHECK NAME] | `[COMMAND FROM REPO ROOT]` | 0 ok / 1 drift |
| [CHECK NAME] | `[COMMAND FROM REPO ROOT]` | 0 ok / 1 drift |

## 8. KNOWN GAPS

- [PLACEHOLDER: Unautomated surface, parser blind spot, or behavior that only runtime testing can detect]
- [PLACEHOLDER: Honest limitation of the generator, mirror, or checker]

<!-- Authoring guidance: List what stays unautomated honestly, including known silent or runtime-only drift. Do not imply coverage that no checker provides. -->

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [PLACEHOLDER: Runtime-specific script or README] | [PLACEHOLDER: Ownership or usage contract] |
| [PLACEHOLDER: Runtime-specific skill or rules file] | [PLACEHOLDER: Related runtime behavior] |
| Sibling manifests | [`../.claude/SYNC.md`](../.claude/SYNC.md) · [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) · [`../.devin/SYNC.md`](../.devin/SYNC.md) · [`../.pi/SYNC.md`](../.pi/SYNC.md) |

<!-- Authoring guidance: End with the sibling-manifests row. Keep every other live runtime SYNC.md cross-linked and omit only the manifest being authored. -->
