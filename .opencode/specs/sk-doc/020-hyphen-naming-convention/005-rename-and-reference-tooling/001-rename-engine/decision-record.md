---
title: "Decision Record: semantic rename engine (020 phase 005.001)"
description: "Design decisions for the semantic rename engine: dependency-closure batching, explicit source-to-target maps, exemption detection, dry-run and idempotency, filesystem-mode preservation, and journaled rollback."
trigger_phrases:
  - "semantic rename engine decisions"
  - "rename closure batching decision"
  - "rename engine idempotency rollback"
  - "rename exemption detection decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-18T07:35:59Z"
    last_updated_by: "codex"
    recent_action: "Verified the engine against the recorded decisions"
    next_safe_action: "Use the dry-run report as the reference checker's input contract"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dependency closure, not file extension, determines batch boundaries."
      - "Exemptions are classified and reported before execution; they are not inferred from a failed rename."
      - "The engine is dry-run by default, idempotent after apply, and reversible through its own inverse journal."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Semantic Rename Engine

<!-- ANCHOR:context -->
## Context

The 020 program changes filesystem names to kebab-case while preserving Python filenames and package directories, generated
and lockfile output, tool-mandated names, test-runner magic, vendored/third-party trees, and frozen history. A mechanical
underscore replacement would produce invalid or unsafe targets such as leading hyphens and doubled separators, and it could
rename a path that the policy explicitly excludes. A file-extension queue would also split references across commits.

The engine therefore needs a stable contract for map input, closure membership, preflight safety, operation state, and reversal.
The policy source is `001-convention-policy-and-scope/decision-record.md`; phase 006 supplies the final bijective map.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Batch by dependency closure, not by file extension

The engine accepts a batch identity derived from the reference graph. All mapped paths in one dependency closure move together,
even when the closure mixes scripts, manifests, configuration, documentation, and symlinks. Extension-based queues are rejected
because a registry or shell source can reference a script in a different extension group.

**Alternative rejected:** one batch for each extension. It is easier to schedule, but violates the in-lockstep reference
invariant and can leave an intermediate commit broken.

### DR-002 — Use a semantic source-to-target map

Every operation comes from an explicit source path, target path, classification, and closure identity. The engine never invents
a target by replacing `_` with `-`; this keeps leading underscores, double underscores, names with deliberate separators, and
special directory names under explicit review. Duplicate sources, duplicate targets, and unsafe path boundaries fail preflight.

**Alternative rejected:** a repository-wide character substitution. It cannot distinguish a filesystem name from an identifier or
key and cannot account for the program's exemptions.

### DR-003 — Detect and skip exemptions before planning writes

The classifier evaluates path segments and file names against the phase 001 policy. Python `.py` files and Python import-package
directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces
receive a skip disposition with its class and rationale. Code identifiers, JSON/YAML/TOML keys, and frontmatter fields are never
rename targets; path-valued frontmatter references remain reference-checker inputs when they point at a renamed path.

**Alternative rejected:** let the rename operation fail and treat the failure as an exemption. That is too late, loses the reason,
and can leave a dependency closure partially planned.

### DR-004 — Default to dry-run and make apply explicit

The default command path validates the map, plans closures, reports collisions and skips, and performs zero writes. A separate
explicit apply action is required before `git mv` is called. The plan includes the candidate SHA or worktree identity, map
identity, closure, and operation order so a reviewer can inspect it before applying.

**Alternative rejected:** apply by default with an opt-out dry-run. A rename tool has a high filesystem blast radius, so the safe
default must be non-mutating.

### DR-005 — Make applied state idempotent

Each entry reports one of `pending`, `skipped`, `applied`, `already-at-target`, `failed`, or `reverted`. A rerun recognizes a
source that is absent because its target is present and returns `already-at-target`; it does not repeat the move. If both source
and target are present, or neither can be reconciled with the map, the engine stops with an actionable ambiguity rather than
guessing.

**Alternative rejected:** treat every rerun as a new batch. That would make recovery unsafe and could overwrite a target.

### DR-006 — Preserve filesystem semantics and journal inverse operations

Before apply, the engine records file type, symlink mode `120000`, executable bits, and path identity. It records an inverse
operation for every successful `git mv` in order. Preflight failures write nothing; an apply failure stops with a non-zero result,
persists the partial journal, and can replay completed inverses to restore the batch. A clean batch can also be reverted by the
same journal or by discarding the disposable worktree.

**Alternative rejected:** promise that `git mv` alone is the rollback contract. Git can show the move, but it does not provide the
engine with a scoped recovery record for a partially completed multi-path batch.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The engine needs a map schema and reference-graph closure identity before it can execute any batch.
- A dry-run report and inverse journal become durable interfaces for phase 002's checker and phase 003's harness.
- Mixed-extension batches are less convenient to schedule but keep the repository coherent at every intermediate commit.
- Exemption decisions are explicit and auditable; an incomplete classifier blocks execution instead of silently broadening scope.
- Recovery has a small amount of state-management overhead, which buys safe reruns and a bounded rollback surface.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Parent phase map: `../spec.md`
- Naming policy and exemption boundary: `../../001-convention-policy-and-scope/decision-record.md`
- Frozen map consumer: `../../006-inventory-and-frozen-map/spec.md`
<!-- /ANCHOR:references -->
