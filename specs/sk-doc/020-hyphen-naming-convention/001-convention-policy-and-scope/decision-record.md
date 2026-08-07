---
title: "Decision Record: kebab-case filesystem-naming program (020 phase 001)"
description: "Program-level decision record for the 020 kebab-case filesystem-naming migration: the GPT-5.6-sol design-review outcome and the locked decisions (dual-name tolerance, dependency-closure batching, fresh-install worktree, packet numbering, exemption boundary) that shape the 020 phased plan."
trigger_phrases:
  - "hyphen naming decision record"
  - "kebab-case migration decisions"
  - "020 program decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
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
written") with verified P0/P1 findings. Every accepted finding is folded into the current phased plan (000-011); the
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
and shell sourcing, dispositions every dynamic `require`/`source`/glob site, and fails on a zero-file scan. The
leading-hyphen hazard carries an **executable** criterion, not just a caution: a path operand beginning with `-` is
rejected with a cited reason or executed through option-terminated argv (`git mv -- <src> <dst>`), proven by
leading-hyphen source and target fixtures. Apply is additionally bound to an immutable plan identity (pinned BASE SHA +
map hash) with an atomic pre-write revalidation of HEAD, map hash, clean tree, and the exact source/target set and order.

### DR-006 — A dedicated runtime/package-layout closure before general script renames
Directories such as `mcp_server` (a declared `package-lock.json` workspace), `install_scripts`, `plugin_bridges`,
`matrix_runners`, `behavior_benchmark`, and the `level_1/2/3` template dirs interact with manifests, lockfiles,
tsconfigs, test discovery, and launchers, and cannot be deferred to "stragglers". **Decision:** each moves in a
dedicated dependency-closed step — the per-skill `mcp-server-dir-and-manifest-closure` leaf within the 008 component
fan-out — carrying its full closure (manifests, lockfiles, launchers, imports, tests, registries) and re-proving a
reproducible install/build via `realpath`.

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

### DR-010 — Packet number stays 020
The concurrent session's `032-smart-routing-mechanism-notes` is being folded into `016-sk-doc-router-alignment` (their
commit that merges 020+018 into the 016 phase parent), which frees `020`. The operator confirmed "Force 020". The review
suggested `020` only because it read the origin state before that fold; that context makes `020` correct.

### DR-011 — Formally supersede the 027 catalog/playbook underscore restyle
`sk-doc/014-sk-doc-parent/027-catalog-naming-convention` child `003` restyled `feature_catalog/` and
`manual_testing_playbook/` content to `underscore_case`. **Decision:** that decision is superseded by this program.
The repo-wide kebab-case canon returns catalog/playbook content to hyphens as one canonical filesystem-naming form, so the
split-brain (hyphenated skill/command/phase trees versus underscored catalog/playbook content) is removed. The supersession
is additive per the frozen-history rule: 027 carries a supersession banner pointing here, its completed work is not
rewritten, and its unrelated children (`001`/`002` de-numbering, `004` hook-bridge removal) are unaffected. The canonical
rule now lives at `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md`.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:classification -->
## Policy Classification Fixtures

The policy taxonomy is exhaustive and mutually exclusive: every in-scope filesystem name is exactly one of
`rename` / `exempt` / `frozen` / `generated` / `tool-mandated`. There is no "unknown" bucket by construction. The
per-candidate application over the whole census is frozen in phase 006; the fixtures below prove the matcher is
unambiguous at the policy level (positive = the class applies; negative = it does not, so the name renames).

| Name | Class | Positive/Negative |
|------|-------|-------------------|
| `validate_document.py` | exempt (`.py`) | positive: Python source stays snake_case |
| `mcp_server/` | exempt (Python import-package dir) | positive: `import mcp_server` would break under a hyphen |
| `__snapshots__/`, `test_router.py` | exempt (test-runner magic) | positive: discovery matches the literal pattern |
| `SKILL.md`, `.utcp_config.json`, `action.yml` | exempt (tool-mandated) | positive: a tool matches the name exactly |
| `node_modules/`, `dist/`, `package-lock.json` | exempt (vendored / generated) | positive: not authored by this repo |
| `z_archive/2025-old-thing/` | frozen (append-only history) | positive: excluded from the zero-snake gate |
| `feature_catalog/read_path_freshness.md` | rename | negative for every exempt class: content doc, renames to hyphens |
| `my_document.md` | rename | negative: a plain snake_case doc renames to `my-document.md` |
| `packet_pointer:` (a frontmatter field) | out of scope | negative: a key/field name, never a filesystem rename target |
| `{ "feature_catalog": ... }` (a JSON key) | out of scope | negative: structured-data key keeps idiomatic case |
<!-- /ANCHOR:classification -->

<!-- ANCHOR:consequences -->
## Consequences

- The review's accepted findings grew the draft, and the program was then restructured into the literal-maximal nested
  tree — 12 top-level phases (000-011) over 175 nodes: baseline (000), policy (001), all-consumer logic (002),
  create-generators (003), the no-new-snake guard (004), rename/reference tooling (005), the frozen map (006), shared
  cross-cutting closures (007), the per-component migration fan-out (008), alias-removal (009), the whole-repo gate (010),
  and integrate/closeout (011). The old flat surface-migration phases fold into the 008 component fan-out.
- Every intermediate commit stays green (dual-name tolerance + changed-only guard + dependency-closed batches), and the
  whole-repo gate (010) reruns after integrating the latest origin (011).
- The verification burden is explicit and front-loaded: no rename batch lands without its SOL contract passing against
  the pinned baseline.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Parent spec: `../spec.md` (000-011 phase map + sequencing invariants).
- The GPT-5.6-sol review verdict and ranked findings shaped every decision above.
- Canonical convention doc: `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md`.
- Superseded ADR: `.opencode/specs/sk-doc/014-sk-doc-parent/027-catalog-naming-convention/spec.md` (child `003`).
<!-- /ANCHOR:references -->
