---
title: "Decision Record: kebab-case filesystem-naming program (017 phase 001)"
description: "Program-level decision record for the 017 kebab-case filesystem-naming migration: the GPT-5.6-sol design-review outcome and the locked decisions (dual-name tolerance, dependency-closure batching, fresh-install worktree, packet numbering, exemption boundary) that shape the 16-phase plan."
trigger_phrases:
  - "hyphen naming decision record"
  - "kebab-case migration decisions"
  - "017 program decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the GPT-5.6-sol review outcome and the program decisions"
    next_safe_action: "Author the canonical convention doc under sk-doc and supersede the 027 ADR"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Kebab-Case Filesystem-Naming Program

<!-- ANCHOR:context -->
## Context

This program reverses the 027 underscore migration and makes kebab-case (hyphens) the sole canonical form for in-scope
filesystem names repo-wide. Before execution, the 12-phase draft plan was reviewed by a GPT-5.6-sol (max reasoning)
design review against the pinned origin tree. The review returned **REQUESTED_CHANGES** ("not safe to execute as
written") with verified P0/P1 findings. Every accepted finding is folded into the current 16-phase (000-015) plan; the
raw review is archived with the packet working notes. This record captures the decisions that shape the plan so later
phases inherit the "why", not just the "what".
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Pin an immutable BASE SHA; execute on an isolated worktree with a fresh install
The main checkout is actively raced by concurrent sessions and its working-tree census drifted (3,522 → 3,489) between
two measurements minutes apart. **Decision:** phase 000 pins an immutable BASE SHA, creates the worktree off it, and
does a fresh deterministic dependency install — never a symlink to the main tree's `node_modules` or `dist` (a symlinked
root can resolve the wrong workspace and falsely pass, per sk-git's worktree guidance). All parity checks compare
against a baseline captured at BASE.

### DR-002 — Migrate ALL catalog/playbook root-name consumers, not just the classifier
The classifier is not the only consumer of the `feature_catalog` / `manual_testing_playbook` root and index names, and
the `sk-doc/scripts/validate_document.py` path is a **symlink** to the real file under `shared/scripts/`. Confirmed
additional consumers: the Lane C loader + generator, `parent-skill-check.cjs`, `post-edit-router.cjs`,
`package_skill.py`, and an **inverse guard** (`check_no_hyphenated_catalog_content.py`) that currently *rejects* the
target state. **Decision:** phase 002 migrates every consumer from a reviewed manifest, preserves the symlink + mode,
and redefines the inverse guard and its tests to the hyphenated target.

### DR-003 — Bounded dual-name tolerance + an explicit alias-removal phase
**Decision:** phase 002 accepts both the underscore and hyphen roots for reads, emits only hyphens, and fails closed if
both physical roots coexist. Phase 007 renames the roots; phase 008 removes the underscore alias and proves the old live
names are rejected. This keeps every intermediate commit green without making the repo-wide rename one unreviewable
atomic commit. (Alternative considered: a single atomic logic+rename commit — rejected as unreviewable and
non-bisectable at this scale.)

### DR-004 — Batch by dependency closure, not by file extension
A script renamed in an "008-scripts" phase can be referenced by a JSON registry deferred to a "010-config" phase, which
violates the in-lockstep invariant. **Decision:** phase 006 partitions the frozen rename map by reference-graph strongly
connected components; a batch may mix `.ts`/`.sh`/`.json`/`.yaml`/`.md`. The surface labels on phases 009-013 are
organizational, not atomicity boundaries. Shared dispatch/runtime scripts form their own cross-cutting batch.

### DR-005 — Semantic source→target map, never a mechanical `_`→`-` substitution
A blind character substitution produces `_common.sh`→`-common.sh`, `__fixtures__`→`--fixtures--`, and leading-hyphen
CLI hazards, and cannot see dynamic references. **Decision:** phase 005 builds a deterministic, dry-run-default rename
engine driven by a semantic, explicitly-classified map with collision hard-abort (exact/casefold/NFC) and symlink-mode
+ exec-bit preservation, plus a rename-map-driven whole-repo reference checker that resolves modules, config path-values,
and shell sourcing, dispositions every dynamic `require`/`source`/glob site, and fails on a zero-file scan.

### DR-006 — A dedicated runtime/package-layout phase before general script renames
Directories such as `mcp_server` (a declared `package-lock.json` workspace), `install_scripts`, `plugin_bridges`,
`matrix_runners`, `behavior_benchmark`, and the `level_1/2/3` template dirs interact with manifests, lockfiles,
tsconfigs, test discovery, and launchers, and cannot be deferred to "stragglers". **Decision:** phase 009 moves each with
its full dependency closure (manifests, lockfiles, launchers, imports, tests, registries) and re-proves a reproducible
install/build via `realpath`.

### DR-007 — Every candidate classified exactly once; no "unknown" bucket
**Decision:** phase 006 freezes a bijective rename map in which every in-scope candidate is exactly one of
rename / exempt / frozen / generated / tool-mandated, hashed together with BASE. The `--all` naming guard is enabled
only after migration; a `--changed-since $BASE` mode keeps the guard debt-tolerant during execution.

### DR-008 — Expanded, load-bearing exemptions
**Decision:** beyond `.py`, lockfiles, and obvious tool-mandated names, the exemption set explicitly covers Python
import-package directory names (a `_`→`-` breaks `import`), `.utcp_config.json`, test-runner magic (`__snapshots__`,
`__mocks__`, `conftest.py`, `test_*.py`/`*_test.py`) unless moved with their discovery closure, `action.yml`/`.yaml`,
plugin manifests, and `SKILL.md`. Frontmatter FIELD names and JSON/YAML/TOML KEYS are never touched; frontmatter VALUES
that are paths/slugs change when required. Frozen surfaces (`z_archive/`, changelogs, completed history) are append-only,
and the "zero snake_case" gate is scope-aware and excludes them.

### DR-009 — Verification is a blocking, evidence-pinned SOL contract per phase
**Decision:** each phase's `checklist.md` is the blocking verifier contract the paired SOL verify agent runs before a
candidate commit lands. Each SOL report pins the candidate SHA, BASE SHA, and rename-map hash; records commands, exit
codes, and discovery counts; proves `git diff-index --quiet HEAD --` after verification; and fails on zero
tests/scenarios or unexpected tracked mutation. SOL reports findings; it does not repair.

### DR-010 — Packet number stays 017
The concurrent session's `017-smart-routing-mechanism-notes` is being folded into `016-sk-doc-router-alignment` (their
commit that merges 017+018 into the 016 phase parent), which frees `017`. The operator confirmed "Force 017". The review
suggested `019` only because it read the origin state before that fold; that context makes `017` correct.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The plan grows from 12 to 16 phases (000-015): a baseline phase (000), an all-consumer logic phase (002), a split of
  guard vs rename/reference tooling (004/005), an alias-removal phase (008), and a runtime/package-layout phase (009).
- Every intermediate commit stays green (dual-name tolerance + changed-only guard + dependency-closed batches), and the
  whole-repo gate (014) reruns after integrating the latest origin (015).
- The verification burden is explicit and front-loaded: no rename batch lands without its SOL contract passing against
  the pinned baseline.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Parent spec: `../spec.md` (16-phase map + sequencing invariants).
- The GPT-5.6-sol review verdict and ranked findings shaped every decision above.
<!-- /ANCHOR:references -->
