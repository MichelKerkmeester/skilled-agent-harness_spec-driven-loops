---
title: Folder Structure Reference
description: Spec folder naming conventions, level requirements, and organization patterns
trigger_phrases:
  - "folder structure reference"
  - "spec folder naming conventions"
  - "level folder requirements"
  - "scratch folder usage"
importance_tier: normal
contextType: general
version: 1.6.7.0
---

# Folder Structure Reference

Open this when you are about to create a packet and need the folder name, the level it sits at and the files that level requires.

---

## 1. OVERVIEW

### Purpose

This document covers spec folder organization, naming conventions, and level-specific requirements for the Spec Kit system.

### When to Use

- Use when naming a spec folder or checking required files by level.

### Template Directory Structure

```
templates/
├── core/                           # Scaffolded at every level
│   ├── spec.md.tmpl
│   ├── plan.md.tmpl
│   ├── tasks.md.tmpl
│   └── implementation-summary.md.tmpl
│
├── addons/                         # Level-gated and workflow-owned documents
│   ├── acceptance-criteria.md.tmpl
│   ├── decision-record.md.tmpl
│   ├── goal.md.tmpl
│   ├── handover.md.tmpl
│   ├── debug-delegation.md.tmpl
│   ├── research.md.tmpl
│   └── timeline.md.tmpl
│
├── packet-types/                   # Non-level packet shapes
│   ├── phase-parent.spec.md.tmpl
│   ├── research.spec.md.tmpl
│   ├── review-report.md.tmpl
│   └── review.spec.md.tmpl
│
├── spec-kit-docs.json              # Level contract resolved by create.sh
├── examples/               # Rendered examples by Level
├── changelog/              # Deprecated packet changelog templates, kept to re-render existing files
└── scratch/                # Local ignored render workspace
```

> **IMPORTANT:** Always scaffold new specs from the Level contract. `create.sh` and the Level contract resolver share `templates/spec-kit-docs.json`.

---

## 2. NAMING CONVENTION

### Spec Folder Names

Format: `NNN-short-descriptive-name`

| Component | Rule | Example |
|-----------|------|---------|
| Number prefix | 3 digits, zero-padded | `007` |
| Separator | Single hyphen | `-` |
| Name | Lowercase, hyphen-separated | `add-auth-system` |

**Examples:**
- ✅ `001-initial-setup`
- ✅ `042-refactor-api-endpoints`
- ❌ `1-setup` (missing zero-padding)
- ❌ `001_setup` (underscore instead of hyphen)
- ❌ `001-Setup` (uppercase)

### Sub-Folder Names

For iterative work within a spec folder:

Format: `NNN-topic-name`

```
007-feature/
├── 001-initial-implementation/
├── 002-bug-fixes/
└── 003-performance-optimization/
```

### Sub-Track Folders

A track may hold one optional level of named sub-tracks between itself and its packets:

```
specs/<track>/
├── <NNN>-<slug>/                  # packet filed directly in the track
├── <sub-track>/
│   ├── 001-<slug>/                # numbering restarts inside the sub-track
│   └── 002-<slug>/
└── z_archive/
```

A sub-track is declared, not inferred. All of these hold:

| Part | Requirement |
|---|---|
| Shape | Direct child of a track root, name not `NNN-*`, no `spec.md` |
| `description.json` | `"level": "sub-track"`, with `specFolder` and `specId` set to `<track>/<sub-track>` |
| `graph-metadata.json` | Track-root shape: `packet_id` `<track>/<sub-track>`, `parent_id` the track, `children_ids` its immediate numbered packets |
| Track registration | The sub-track id appears in the track's `graph-metadata.json` `children_ids` |

Numbering continues per folder, so each sub-track numbers its own packets from `001`. One level is supported: a sub-track holds numbered packets, not another sub-track.

A track's `children_ids` lists its direct numbered packets and its declared sub-tracks. A sub-track's `children_ids` lists only its own immediate numbered packets. A numbered phase parent counts as one entry, and its phases stay its own children.

A sub-track has its own `z_archive/`. Any `z_` folder inside a track or sub-track is never a sub-track and is never discovered as content. A non-numbered folder without the declaration gets one diagnostic and is never promoted. A symlinked sub-track is skipped with one diagnostic in both the working-tree and the commit view. Diagnostics are advisory and never change an exit code.

---

## 3. LEVEL REQUIREMENTS

### Level 1 (< 100 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md                    # Problem statement, goals, scope
├── plan.md                    # Implementation approach
├── tasks.md                   # Task breakdown
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `scratch/` - Temporary files
- `memory/` - Retired compatibility folder for older packets only; current continuity lives in packet docs plus `description.json` and `graph-metadata.json`

### Level 2 (100-499 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md
├── plan.md
├── tasks.md
├── implementation-summary.md  # Created AFTER implementation completes
└── acceptance-criteria.md     # Closure gate, scaffolded at this level
```

`acceptance-criteria.md` is required through the `AC_CLOSURE` rule, not through the level contract's core doc list: the contract files it as an add-on that `create.sh` scaffolds at this level, and `AC_CLOSURE` fails a packet created after 2026-08-30 that lacks it. For an older packet its absence is advisory.

**Optional:**
- `scratch/`
- `memory/` - Retired compatibility folder for older packets only; current save workflows skip new `[spec]/memory/*.md` writes

### Level 3 (≥ 500 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md
├── plan.md
├── tasks.md
├── implementation-summary.md  # Created AFTER implementation completes
└── acceptance-criteria.md     # Closure gate, scaffolded at this level
```

`acceptance-criteria.md` is required through the `AC_CLOSURE` rule, not through the level contract's core doc list: the contract files it as an add-on that `create.sh` scaffolds at this level, and `AC_CLOSURE` fails a packet created after 2026-08-30 that lacks it. For an older packet its absence is advisory.

**Optional:**
- `decision-record.md` - architecture and operator decisions; created on request, or by a full-auto save that records an operator decision at any level, and skipped silently when absent
- `scratch/`
- `memory/` - Retired compatibility folder for older packets only; current save workflows skip new `[spec]/memory/*.md` writes
- `research/` / `review/` local-owner folders — see §4 `research/` and `review/` (local owner folders). Root specs keep them at the root packet; child phases and sub-phases keep them under the owning phase folder.

---

## 4. SPECIAL FOLDERS

### scratch/

Temporary, disposable files. Cleaned up after task completion.

**Use for:**
- Debug logs
- Test scripts
- Prototypes
- Temporary data

**Rules:**
- Never commit sensitive data
- Clean up when done
- Don't reference from permanent docs

### memory/

Retired compatibility folder for older packets. Current save workflows skip legacy `[spec]/memory/*.md` writes; canonical continuity lives in packet docs (`handover.md`, `_memory.continuity`, and related spec documents) plus `description.json` and `graph-metadata.json` metadata.

**Use for:**
- Reading or migrating historical packets that already contain legacy memory artifacts
- Compatibility with old links that still point at `[spec]/memory/*.md`

**Current save path:** do not create new `memory/` session files; use `/speckit:save` so continuity routes into canonical packet docs and metadata.

**Legacy File Naming:** `DD-MM-YY_HH-MM__topic-name.md`

Example: `07-12-25_14-30__feature-name.md`

```markdown
---
title: Session Summary
created: DD-MM-YY
type: context
triggers:
  - keyword1
  - keyword2
---

# Content here
```

### research/ and review/ (local owner folders)

Deep-research and deep-review artifacts (iterations, deltas, prompts, state logs, synthesis) live under the **target spec folder's local** `research/` or `review/` folder. Root specs, child phases, and sub-phases all use a flat-first layout at `{spec_folder}/research/` or `{spec_folder}/review/` for first runs. A `pt-NN` packet directory is allocated only when prior local content already exists for a different target.

**Why:** the owning phase keeps its own deep-loop artifacts local, nested runs do not spill into ancestor roots, and resume/restart logic can stay bound to the exact target spec instead of re-resolving through a coordination parent.

**Layout (root spec plus flat-first child phases):**

```text
<spec-folder>
├── spec.md
├── research/                               <- root-spec deep-research artifacts
├── review/                                 <- root-spec deep-review artifacts
├── 019-system-hardening/
│   ├── spec.md
│   ├── research/                               <- first run is flat
│   │   ├── deep-research-config.json
│   │   ├── deep-research-state.jsonl
│   │   ├── deep-research-strategy.md
│   │   ├── deep-research-dashboard.md
│   │   ├── findings-registry.json
│   │   ├── research.md
│   │   ├── iterations/iteration-NNN.md
│   │   ├── deltas/iter-NNN.jsonl
│   │   └── prompts/iteration-N.md
│   └── review/                                 <- first run is flat
└── 020-skill-advisor-hook-surface/
    ├── spec.md
    ├── research/
    │   └── 020-skill-advisor-hook-surface-pt-01/ <- conditional: prior non-matching content already existed
    └── review/
```

**Naming (when a packet subfolder is allocated):** `{ownerSlug}-pt-{NN}/`
- `ownerSlug` = the owning spec folder name by default (for example `019-system-hardening` or `003-gate-c-writer-ready`)
- `NN` = two-digit zero-padded sequential counter per owner folder when a new packet must be allocated

**Flat-first convention:** child-phase first runs go directly under `{spec_folder}/research/` or `{spec_folder}/review/` with no `-pt-NN` subfolder. A packet subfolder is allocated only when prior content already exists for a non-matching target. Continuation runs reuse the existing flat artifact (or matching `pt-NN` packet). Root specs always use the flat path.

**Required resolver:** always use `resolveArtifactRoot(specFolder, 'research' | 'review')` from [`.skilled/skills/system-spec-kit/shared/review-research-paths.cjs`](../../shared/review-research-paths.cjs). It resolves the local owner folder, returns flat for first runs and matching continuations, reuses an existing packet for the same target when present, and allocates a `pt-NN` packet only when prior content for a non-matching target exists. Never hand-pick the path.

**Forbidden:** creating or continuing child-phase research/review packets under an ancestor/root spec's `research/` or `review/` folder.

**See also:** `system-deep-loop/deep-research/references/protocol/loop-protocol.md`, `system-deep-loop/deep-review/references/protocol/loop-protocol.md`, and the `step_resolve_artifact_root` block in `.skilled/commands/deep/assets/deep-research-auto.yaml`.

---

## 5. ARCHIVE PATTERN

Completed or superseded specs use the `z_archive/` prefix:

```
specs/
├── 001-active-feature/
├── 002-in-progress/
└── z_archive/
    ├── 001-completed-feature/
    └── 002-abandoned-approach/
```

A declared sub-track archives into its own `z_archive/`, not the track's:

```
specs/demo/
├── sub/
│   ├── 001-active/
│   └── z_archive/
│       └── 001-retired/
└── z_archive/
    └── 001-old-track-packet/
```

**Archive Triggers:**
- Feature fully implemented and verified
- Approach abandoned for alternative
- Spec superseded by newer version

---

## 6. EXAMPLE STRUCTURES

### Simple Feature (Level 1)

```
specs/015-add-dark-mode/
├── spec.md
├── plan.md
├── tasks.md
└── implementation-summary.md  # Created after implementation
```

### Medium Feature (Level 2)

```
specs/016-user-preferences/
├── spec.md
├── plan.md
├── tasks.md
├── acceptance-criteria.md
├── implementation-summary.md  # Created after implementation
├── scratch/
│   └── test-data.json
└── memory/
    └── 15-01-24_10-30__user-preferences.md
```

### Complex Feature (Level 3)

```
specs/017-authentication-system/
├── spec.md
├── plan.md
├── tasks.md
├── acceptance-criteria.md
├── decision-record.md
├── implementation-summary.md
├── scratch/
│   ├── oauth-flow-test.js
│   └── token-debug.log
└── memory/
    ├── 10-01-24_09-15__authentication-system.md
    └── 12-01-24_14-00__authentication-system.md
```

### Iterative Work (Sub-folders)

```
specs/018-api-refactor/
├── 001-endpoint-analysis/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── 002-breaking-changes/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── acceptance-criteria.md
└── 003-migration-guide/
    ├── spec.md
    └── plan.md
```

```
specs/022-hybrid-rag-fusion/        <- Coordination root (point-in-time snapshot)
├── spec.md                          <- Phase map + current tree truth
├── decision-record.md               <- ADR-001: tree truth > historical synthesis
├── 001-epic/                        <- Child phase packet
├── 002-indexing/                    <- Child phase packet
└── 011-skill-alignment/             <- Child phase packet
    └── 002-skill-review/            <- Nested child
```

### Track With Sub-Tracks

```
specs/billing/
├── description.json                 # level: "track"
├── graph-metadata.json              # children_ids: 001-invoices, invoicing
├── 001-invoices/
│   ├── spec.md
│   └── ...
├── invoicing/                       # declared sub-track
│   ├── description.json             # level: "sub-track"
│   ├── graph-metadata.json          # parent_id: billing
│   ├── 001-numbering/
│   │   ├── spec.md
│   │   └── ...
│   └── 002-credits/
└── z_archive/
```

---

## 7. HOST REPOSITORY TRIGGER INDEX

The packaged index at `runtime/data/trigger-index.json` is the default every lookup reads. A host repository that vendors Skilled can build an index over its own docs at `.speckit-index/trigger-index.json`. Nothing selects that file on its own, so the host passes it with `--index`.

Generate from the host root:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs \
  --repo-root . \
  --out .speckit-index/trigger-index.json
```

Call it from the host's Gate 1 lookup:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs \
  --index .speckit-index/trigger-index.json \
  --json -- "<prompt>"
```

Exit `0` means candidates, `1` a clean miss and `2` a bad invocation or an unreadable index. `--out` alone writes the corpus manifest, diagnostics and phrase variants beside the index. Check freshness against the same file:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs \
  --check \
  --repo-root . \
  --out .speckit-index/trigger-index.json
```

Without `--index`, the lookup keeps reading the packaged index.

---

## 8. RELATED RESOURCES

- [spec-kit-docs.json](../../templates/spec-kit-docs.json) - Level contract resolved by create.sh
- [Template Guide](../templates/template-guide.md)
- [Sub-folder Versioning](sub-folder-versioning.md)
