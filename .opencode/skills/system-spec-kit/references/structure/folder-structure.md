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
version: 3.6.0.26
---

# Folder Structure Reference

Spec folder naming conventions, level requirements, and organization patterns.

---

## 1. OVERVIEW

This document covers spec folder organization, naming conventions, and level-specific requirements for the Spec Kit system.

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
│   ├── resource-map.md.tmpl
│   ├── before-after.md.tmpl
│   ├── timeline.md.tmpl
│   └── roadmap.md.tmpl
│
├── packet-types/                   # Non-level packet shapes
│   ├── phase-parent.spec.md.tmpl
│   ├── review.spec.md.tmpl
│   └── context-index.md.tmpl
│
├── spec-kit-docs.json              # Level contract resolved by create.sh
├── examples/               # Rendered examples by Level
├── changelog/              # Template history
├── stress-test/            # Review/research rubric assets
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
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `acceptance-criteria.md` - the closure gate; validation warns when it is absent
- `scratch/`
- `memory/` - Retired compatibility folder for older packets only; current save workflows skip new `[spec]/memory/*.md` writes

### Level 3 (≥ 500 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md
├── plan.md
├── tasks.md
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `acceptance-criteria.md` - the closure gate; validation warns when it is absent
- `decision-record.md` - architecture decisions; created on request, skipped silently when absent
- `scratch/`
- `memory/` - Retired compatibility folder for older packets only; current save workflows skip new `[spec]/memory/*.md` writes
- `research/` / `review/` local-owner folders — see §4 `research/` and `review/` (local owner folders). Root specs keep them at the root packet; child phases and sub-phases keep them under the owning phase folder.
- `improvement/` local-owner folder — see §4 `improvement/` (improvement artifact family). Written by the deep-loop improvement runtimes at the target spec folder.

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

**Flat-first convention (post-028):** child-phase first runs go directly under `{spec_folder}/research/` or `{spec_folder}/review/` with no `-pt-NN` subfolder. A packet subfolder is allocated only when prior content already exists for a non-matching target. Continuation runs reuse the existing flat artifact (or matching `pt-NN` packet). Root specs always use the flat path.

**Required resolver:** always use `resolveArtifactRoot(specFolder, 'research' | 'review')` from [`.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`](../../shared/review-research-paths.cjs). It resolves the local owner folder, returns flat for first runs and matching continuations, reuses an existing packet for the same target when present, and allocates a `pt-NN` packet only when prior content for a non-matching target exists. Never hand-pick the path.

**Forbidden:** creating or continuing child-phase research/review packets under an ancestor/root spec's `research/` or `review/` folder.

**See also:** `system-deep-loop/deep-research/references/protocol/loop-protocol.md`, `system-deep-loop/deep-review/references/protocol/loop-protocol.md`, and the `step_resolve_artifact_root` block in `.opencode/commands/deep/assets/deep-research-auto.yaml`.

### improvement/ (improvement artifact family)

Artifacts from the deep-loop improvement runtimes — `/deep:agent-improvement` and `/deep:model-benchmark` — live under the **target spec folder's local** `improvement/` folder. Root specs, child phases, and sub-phases all write it flat at `{spec_folder}/improvement/` for the run's owner, mirroring the flat-first convention of `research/` and `review/`.

**Why:** the owning packet keeps its own improvement/benchmark evidence local, so candidate promotion state, score histories and benchmark outputs stay bound to the agent or benchmark run that produced them and never spill into ancestor roots.

**Who writes it:** the `deep-improvement` runtime behind `/deep:agent-improvement` and `/deep:model-benchmark`. Nothing in the validation tooling regenerates these files; they are written once per run and then read.

**What lives inside (real example):**

```text
improvement/
├── agent-improvement-config.json       <- run configuration written at start
├── agent-improvement-state.jsonl       <- append-only state log
├── agent-improvement-strategy.md       <- improvement strategy notes
├── agent-improvement-dashboard.md      <- generated run dashboard
├── agent-improvement-charter.md        <- run charter
├── dynamic-profile.json                <- resolved dynamic target profile
├── experiment-registry.json            <- generated experiment registry
├── improvement-journal.jsonl           <- append-only lifecycle journal
├── integration-report.json             <- final integration report
├── score-iter1.json ... score-iterN.json  <- per-iteration score records
├── session.json / target-manifest.jsonc   <- run identity and target manifest
├── candidates/                         <- one write-once folder per candidate
├── benchmark-outputs/                  <- benchmark evidence
└── pre-promote-backup/                 <- pre-promotion backup of the target
```

**Naming:** the config file is named for the owning runtime (`agent-improvement-config.json`); benchmark-only runs add `benchmark-run-pointer.json` beside it. No `pt-NN` packet subfolders are in use for this family today.

**Validation:** `IMPROVEMENT_ARTIFACTS` (see the validator registry) checks that every `*-config.json` directly inside `improvement/` parses as JSON and carries the top-level fields every generated config carries.

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

---

## 7. RELATED RESOURCES

- Level specifications reference
- [Template Guide](../templates/template-guide.md)
- [Sub-folder Versioning](sub-folder-versioning.md)
