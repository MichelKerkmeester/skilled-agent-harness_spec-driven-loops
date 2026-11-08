---
title: "Implementation Plan: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "Teach spec-kit's track tooling one declared sub-track level, test first, with flat tracks unchanged, then upstream Barter's project-owned doctor entry, tolerate a vendored copy with no host specs folder and document a host trigger index."
trigger_phrases:
  - "named subtracks and host repos plan"
  - "sub-track implementation plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`, `.cjs`), TypeScript compiled to `runtime/dist`, bash |
| **Framework** | None; spec-kit CLI scripts and the validation orchestrator |
| **Storage** | Files: `description.json` and `graph-metadata.json` per track, sub-track and packet |
| **Testing** | Vitest in `runtime/cli/tests/`, `node --test` for the doctor engine |

### Overview
A sub-track is a direct child of a track whose `description.json` says `level: "sub-track"`, the same way a track root says `level: "track"`; its `graph-metadata.json` keeps the track-root shape, so no schema migration is needed. Each track-level tool learns that one extra level, starting from red tests built on one fixture, and every existing flat-track test must pass unchanged. The three host items follow: the doctor engine's `project_owned` entry, setup tolerating a missing host `specs/`, and documentation for a host trigger index. The design and evidence are `research/research.md` sections 3 to 8.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The baseline is recorded: pass and fail counts of every test file named in section 5, taken before the first edit.
- [ ] `spec.md` names every file to change, and `validate.sh <packet> --strict` prints `RESULT: PASSED`.
- [ ] Packet 037's state of `graph-metadata-parser.ts` is known: committed, or still a working-tree edit to work around.

### Definition of Done
- [ ] Every requirement in `acceptance-criteria.md` is met with evidence.
- [ ] `npm run build` in `runtime/` exits 0, then the section 5 test command prints zero failures and the baseline totals plus the new tests.
- [ ] Docs updated (spec/plan/tasks), and the packet validates `--strict` with `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared reader. `track-roots.mjs` stays the single source of what a track or sub-track contains; refresh, sweep, create and the pre-push gate keep reading through it.

### Key Components
- **`track-roots.mjs`**: returns tracks and declared sub-tracks, each with its immediate numbered packets, in the working-tree and commit views, plus a list of undeclared folders and skipped symlinked sub-tracks.
- **`orchestrator.ts` and `validate.sh`**: treat a declared sub-track folder as a container and recurse through it.
- **`resolveParentId` in `graph-metadata-parser.ts`**: returns the sub-track as a packet's parent when the packet's parent folder is a declared sub-track.
- **`archive.sh`**: accepts `<track>/<sub-track>` as a packet home and refreshes both levels.
- **`symlink-engine.cjs`**: keeps a `project_owned` file and reports `project-owned`.

### Data Flow
`create.sh --track demo/sub` writes the packet under `specs/demo/sub/`, then calls `refresh-track-roots.mjs` for `demo/sub` and `demo`. Refresh asks `track-roots.mjs` for the immediate children of each and rewrites their `children_ids`. The pre-push gate runs `sweep-track-roots.mjs --rev`, which reads the same reader's commit view, so both views must return the same sub-tracks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and builds the red fixture. Implementation turns each red test green in the order of `tasks.md`: reader, refresh and sweep, create, validation, parent derivation, archive, then the three host items. Verification reruns the whole suite against the baseline and the Barter reproduction. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit/runtime/cli` after `npm run build` in `runtime/`. The runtime's default vitest config excludes `runtime/cli/**`, so the cli project config is named explicitly:

```bash
npx vitest run --config ../../vitest.config.ts --project cli tests/track-roots.vitest.ts tests/create-track-refresh.vitest.ts tests/create-track-containment.vitest.ts tests/create-root-numbering.vitest.ts tests/archive-track.vitest.ts tests/repair-derived.vitest.ts tests/graph-metadata-refresh.vitest.ts tests/validate-recursive-artifact-skip.vitest.ts tests/subtrack-fixture.vitest.ts tests/validate-subtrack.vitest.ts
node --test ../../../../commands/doctor/scripts/tests/symlink-engine.test.cjs ../../../../commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs
```

Every new case is written first and shown failing on the unchanged code. The fixture holds a flat packet, a declared sub-track with a numbered phase parent and one phase child, the sub-track's `z_archive/`, an undeclared folder and a symlinked sub-track. A flat-only fixture proves byte-identical metadata before and after (NFR-R01). The Barter reproduction in `spec.md` Measured Behavior is the end-to-end check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. The work depends on the spec-kit runtime build (`npm run build` in `runtime/`) and on packet 037 landing or staying clear of `resolveParentId`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a flat-track test fails after a change, or the pre-push gate blocks a push that passed before. Revert that task's commit with `git revert <sha>`; each task lands as its own commit, so a revert removes one behavior and leaves the rest. A tree with no declared sub-track never reaches the new code paths.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches path handling and a shared policy (what counts as a track), so the inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/lib/track-roots.mjs` | Defines a track and its packets | update | `track-roots.vitest.ts` |
| `runtime/cli/spec/refresh-track-roots.mjs`, `sweep-track-roots.mjs`, `.skilled/scripts/git-hooks/pre-push` | Consume the reader | update refresh and sweep; pre-push unchanged | refresh and sweep tests; `rg -n 'sweep-track-roots' .skilled/scripts/git-hooks/pre-push` |
| `runtime/cli/spec/create.sh` | Refreshes after creating | update | `create-track-refresh.vitest.ts` |
| `runtime/lib/validation/orchestrator.ts`, `runtime/cli/spec/validate.sh` | Track exemption and recursion | update | validate tests and the reproduction |
| `runtime/lib/graph/graph-metadata-parser.ts`, `runtime/cli/spec/repair-derived.cjs` | Parent derivation and repair | update | `repair-derived.vitest.ts`, `graph-metadata-refresh.vitest.ts` |
| `runtime/cli/spec/archive.sh` | Packet home and track lookup | update | `archive-track.vitest.ts` |
| `runtime/handlers/spec-doc-discovery.ts`, `runtime/cli/retrieval/lib/corpus.mjs` | Recursive discovery | unchanged | existing tests still pass |
| `runtime/cli/ops/retrofit-convention.mjs` | Groups reports by track | unchanged (report only) | noted in research section 3 |
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Links shared files into a host | update | `symlink-engine.test.cjs` |

Matrix axes: view (working tree, commit), level (track, sub-track), entry (flat packet, sub-track packet, phase parent, `z_archive`, undeclared folder, symlinked sub-track). Invariant: a packet appears in exactly one `children_ids` list, its nearest track or sub-track's.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because every change needs its red test and the baseline |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the packet |
<!-- /ANCHOR:phase-deps -->
