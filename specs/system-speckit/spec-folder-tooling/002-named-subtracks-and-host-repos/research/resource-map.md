---
title: "Resource Map — Design first-class named sub-tracks in spec-kit (specs/<track>/<sub-track>/<NNN>-<slug>/) and the three smaller host-repository fixes, from the Barter handover barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/005-skilled-harness-support/handover.md and its research note 004-priority-numbering-subtracks/scratch/nested-tracks.md (both read-only). Item 1: every site that assumes a track sits directly under specs/ — known: runtime/cli/lib/track-roots.mjs:38-66,104-130; refresh-track-roots.mjs:76-79; create.sh:1012; lib/validation/orchestrator.ts:219-223,1340; validate.sh:186,273,315; repair-derived.cjs parent_id on move; archive.sh is_packet_home:207 and track_of:189; sweep-track-roots.mjs and the pre-push gate via track-roots. Find any others, define the sub-track level and its metadata, keep flat tracks unchanged, and give a failing-first test plan. Item 3: project_owned .env.example doctor manifest entry (Barter overlay at barter/ai-speckit/skilled/barter-overlays/doctor/). Item 4: the tracked .skilled/specs -> ../specs link dangling in a vendored copy. Item 5: a documented host-repository trigger index and how the Gate 1 lookup finds it. Item 2 (linked specs root writes) is out of scope: packet specs/system-speckit/runtime-and-release/003-symlinked-runtime-root owns it. Read-only outside the spec folder; never open any .env file. Cite file:line for every finding."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 39
- **By category**: READMEs=0, Documents=3, Commands=6, Agents=0, Skills=26, Specs=0, Scripts=1, Tests=1, Config=1, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 044-named-subtracks-and-host-repos
- **Generated**: 2026-11-07T12:58:21.030Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/pre-push | Cited | OK | Citations=2; Iterations=2 |
| barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/004-priority-numbering-subtracks/scratch/nested-tracks.md | Cited | OK | Citations=2; Iterations=2 |
| barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/005-skilled-harness-support/handover.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/symlink-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/install.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/assets/speckit-implement.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/search.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/data/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/lib/description/description-schema.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| barter/ai-speckit/skilled/barter-overlays/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| barter/ai-speckit/skilled/barter-overlays/doctor/scripts/tests/symlink-engine.test.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| barter/ai-speckit/skilled/barter-overlays/doctor/symlink-manifest.json | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=2; Iterations=2 |

---
