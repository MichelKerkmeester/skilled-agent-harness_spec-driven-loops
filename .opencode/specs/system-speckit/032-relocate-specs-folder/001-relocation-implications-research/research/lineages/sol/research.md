# Research Synthesis: Relocating `.opencode/specs` to `specs/`

## Executive Summary

Relocating the canonical specs tree is feasible, but it is a root-policy migration rather than a directory rename. The current repository already exposes top-level `specs` as a tracked relative symlink to `.opencode/specs`; the target topology must invert that object relationship so `specs/` becomes the real tracked tree and `.opencode/specs` becomes a temporary relative compatibility link to `../specs`. [SOURCE: iteration-003]

Four coupled systems make the change high-blast:

1. Spec Kit tools use a mixture of direct paths, canonical-only defaults, membership checks, and two-root fallback orders. [SOURCE: iteration-001]
2. Git must transition a mode-120000 object into a real tree while preserving ignore behavior in both the source repository and downstream symlinked repositories. [SOURCE: iteration-003]
3. Memory MCP can preserve root-relative `spec_folder` identity, but physical indexed paths and several startup/continuity resolvers still encode the old root. [SOURCE: iteration-004]
4. The sampled active surfaces contain 300 files with the literal old root, split into 54 source files, 87 tests/fixtures, and 159 documentation/configuration files. That is a classification workload, not 300 equivalent edits. [SOURCE: iteration-005]

The recommended migration is staged: freeze writers, baseline and manifest both roots, materialize the new canonical tree, install a reverse compatibility link, invert writers and resolvers, reindex Memory MCP, update Git/CI/ignore/downstream contracts, and retire the alias only after executable old-root consumers reach zero. Existing collision, manifest, quarantine, writer-freeze, rollback, and ten-state fixture infrastructure should be directionally inverted and reused. [SOURCE: iteration-005]

## Scope and Method

The research covered the four named Spec Kit tools, the maintained resolver registry, runtime mirrors, Git and ignore rules, Memory MCP resolution and persistence, reference scale, existing migration safeguards, CI, rollback, and proof gates. It did not modify or move the specs tree, run mutating migration tests, change the Memory MCP database, or write outside this lineage.

Five iterations were completed:

| Iteration | Focus | New-information ratio |
|---|---|---:|
| 1 | Tooling and resolver assumptions | 1.00 |
| 2 | Runtime mirrors and symlinks | 0.86 |
| 3 | Git, ignores, and downstream repos | 0.82 |
| 4 | Memory MCP resolution and index identity | 0.78 |
| 5 | Scale, sequencing, and proof gates | 0.55 |

## Confirmed Current Topology

- `.opencode/specs` is the real directory and top-level `specs` is a tracked relative symlink whose payload is `.opencode/specs`. [SOURCE: iteration-003]
- No `.claude/specs`, `.codex/specs`, `.cursor/specs`, `.devin/specs`, or `.pi/specs` path exists. Runtime mirror synchronization manages agents, commands, and hooks—not specs links. [SOURCE: iteration-002]
- `.claude/SYNC.md` claims a `.claude/specs` link that does not exist, so filesystem inspection is authoritative over that documentation. [SOURCE: iteration-002]
- The source `.gitignore` negates both `!.opencode/` and `!specs`, overriding the user-global `/.opencode/` and `/specs` exclusions. Downstream repositories without local negations continue to hide both shared paths. [SOURCE: iteration-003]

## Tooling Implications

The four named tools do not share one failure mode.

| Tool | Current coupling | Migration implication |
|---|---|---|
| `scripts/spec/create.sh` | Default creation writes under `.opencode/specs`; containment accepts both roots; one identity fallback names the old root. | Invert the unqualified writer default and identity fallback; retain explicit-root support during compatibility. [SOURCE: iteration-001] |
| `scripts/spec/validate.sh` | Predominantly validates the caller-supplied folder; the literal old-root hit is packet-specific. | No global rewrite is required for core validation, but fixtures and packet exceptions need classification. [SOURCE: iteration-001] |
| `generate-description` | Scoped generation is folder-driven and uses shared root-relative identity. | Keep absolute/scoped operation; update any default discovery and canonical naming around it. [SOURCE: iteration-001] |
| `backfill-graph-metadata` | Scoped targets use shared identity, but repo discovery/default root is old-root canonical. | Invert default root selection and tests; preserve direct target behavior. [SOURCE: iteration-001] |

The maintained registry contains 21 resolver groups with `legacy-first`, `canonical-first`, `canonical-only`, `direct-path-first`, and `membership-only` contracts. The labels reflect the current model where `.opencode/specs` is canonical and `specs` is legacy. A safe implementation changes semantic roles, expected precedence, and fixtures together; blind textual swapping would corrupt direct-path and membership-only consumers. [SOURCE: iteration-001] [SOURCE: iteration-005]

## Runtime Mirror Implications

There are no five runtime-specific specs symlinks to repoint. Existing authored/generated runtime content frequently refers to root-neutral `specs/...`, which will continue to work when top-level `specs/` becomes real. The actual mirror-related work is:

- correct stale runtime documentation;
- keep mirror sync behavior unchanged unless a future explicit specs mirror is designed;
- verify no runtime-specific specs links appear after the move;
- preserve the no-spec-import guard's intent by prohibiting executable imports from either mutable specs root, while retaining deliberate positive fixtures. [SOURCE: iteration-002] [SOURCE: iteration-005]

## Git, Ignore, and Downstream Implications

The root inversion changes Git object types:

```text
current:  specs (mode 120000) -> .opencode/specs (real tree)
target:   specs/ (real tracked tree)
          .opencode/specs (temporary mode 120000) -> ../specs
```

The reverse target must be relative for clone portability. The existing alias-retirement runbook incorrectly describes the current link as absolute and must not drive implementation. [SOURCE: iteration-003]

Root negations are already directionally compatible, but path-specific ignores under `.opencode/specs/...` must be audited and translated. Obsolete `.claude/specs`, `.codex/specs`, and similar ignore entries should be classified rather than propagated. [SOURCE: iteration-003]

Downstream ownership remains a policy decision:

- Shared framework data: keep both paths globally ignored; symlinked repos stay clean.
- Downstream-owned project specs: add a repository-local `!specs/` negation and define whether data is shared back to Public.

The migration cannot infer that choice. `PUBLIC-RELEASE.md` currently creates project data beneath `.opencode/specs`; after inversion those instructions would write through a compatibility alias and must be updated before alias retirement. [SOURCE: iteration-003]

## Memory MCP Implications

Memory MCP root policy is distributed:

- document and graph discovery prefer `.opencode/specs`;
- generic folder discovery and pending recovery already enumerate `specs` first;
- resume and authored continuity prefer `.opencode/specs`;
- explicit indexing prefers absolute/direct paths, then discovery, then old-root and top-level fallbacks;
- startup drift rename containment and one description refresh are old-root-only. [SOURCE: iteration-004]

The database file does not need to move. Its path is configured independently through Spec Kit DB environment variables or the shared default. [SOURCE: iteration-004]

Logical `spec_folder` values can remain stable because shared identity is relative to either supported `specs` anchor. Physical `file_path` and `canonical_file_path` values still change, and delete/rename handling queries them. The cutover therefore needs an isolated baseline and controlled reindex that proves:

- unchanged distinct root-relative `spec_folder` identities;
- one indexed representation per real file;
- no alias-induced duplicates;
- correct delete/rename repair;
- working resume, search, memory save, and scoped indexing. [SOURCE: iteration-004]

## Scale and Risk Classification

The 300-file literal inventory is an upper bound across selected active surfaces. The practical work separates into:

| Priority | Surface | Risk |
|---|---|---|
| P0 | Canonical writers, root resolver semantics, collision/write guards, Git object transition, Memory MCP physical identity | Split-brain writes, loss, duplicates, or invisible packets |
| P1 | Startup repair, resume/continuity, CI roots, ignore rules, downstream setup, generated metadata defaults | Operational breakage or stale validation/index state |
| P2 | Current docs, examples, mirror documentation, runbooks | Incorrect operator guidance |
| Preserve/classify | Changelogs, historical specs, negative fixtures, benchmarks | Rewriting may falsify history or disable guards |

Existing safeguards materially reduce risk: deterministic packet hashing, divergent-duplicate rejection, writer freeze, quarantine-before-move, byte verification, cross-device fallback, rollback, and a ten-state validation matrix with 61 declared spec-root test cases. They currently encode the opposite direction and require inversion. [SOURCE: iteration-005]

## Recommended Migration Sequence

1. Decide downstream ownership policy and name the rollback/quarantine location.
2. Freeze all spec writers and stop watcher-driven repair for the transaction.
3. Capture packet counts and hashes, Git index mode/payload, strict-validation baseline, Memory MCP row and identity metrics, and resolver/reference inventories.
4. Generate a deterministic two-root manifest; halt on every unresolved divergent duplicate or external/broken root.
5. Materialize top-level `specs/` as a verified real tree without deleting the original.
6. Replace the old real root with the relative compatibility link `.opencode/specs -> ../specs`; verify same-inode/realpath behavior.
7. Invert unqualified writer defaults, canonical resolver semantics, the 21 registry contracts, startup repair, resume/continuity, metadata defaults, and tests.
8. Reindex Memory MCP against the new physical root and remove stale/duplicate physical-path rows while preserving root-relative `spec_folder` values.
9. Update Git ignores, project-specific exclusions, CI roots, root-policy docs, downstream setup, runtime guard wording, and current operator documentation.
10. Unfreeze writers only after focused and whole gates pass. Monitor writes and index drift through the compatibility window.
11. Retire `.opencode/specs` only when executable old-root-only consumers are zero, current docs no longer direct writes there, and rollback has been rehearsed.

## Rollback Boundary

Before new canonical writes, rollback can restore the quarantined old tree and the prior Git link state after byte verification. After any write lands under top-level `specs/`, changing symlinks alone is unsafe. Rollback must freeze writers, treat the new tree as authoritative input, migrate it back transactionally, repair Git object state, and reindex physical paths. [SOURCE: iteration-005]

## Objective Proof Plan

1. Record exact before/after packet counts, file-set hashes, Git object modes, and symlink payloads.
2. Require a collision manifest with zero rejected/divergent entries before mutation.
3. Verify unqualified `create.sh`, description generation, graph backfill, resume, save, and index operations select `specs/`.
4. Validate explicit access through both roots during compatibility and confirm realpath deduplication.
5. Compare Memory MCP row counts, distinct `spec_folder` values, canonical-path duplicates, search results, resume output, and rename/delete repair before and after reindex.
6. Confirm source-repository and downstream ignore behavior against the selected ownership policy.
7. Run the inverted root fixture matrix, migration/fault-injection tests, Git index-shape fixture, runtime mirror checks, and strict freshness sweep with `--roots specs`.
8. Rescan executable/configuration surfaces for old-root-only references; classify intentional historical/negative-fixture residue.
9. Run the authoritative whole gate from the final state and rehearse rollback before production cutover.

## Eliminated Alternatives

| Alternative | Reason rejected |
|---|---|
| Blindly replace `.opencode/specs` with `specs` | Resolver roles differ; historical and negative-fixture references are intentional. |
| Repoint five runtime specs mirrors | Those runtime-specific paths do not exist. |
| Keep tracked `specs` unchanged | It is a symlink blob and cannot also be the real canonical tree. |
| Move the Memory MCP database | Database placement is independent; indexed physical paths are the issue. |
| Skip reindexing because `spec_folder` is stable | `file_path` and `canonical_file_path` change. |
| Retire the reverse alias immediately | Old-root-only startup and continuity consumers would break. |
| Roll back with a symlink flip after new writes | It would strand or overwrite authoritative data and stale index paths. |

## Open Decision

Downstream project-local specs ownership must be selected before implementation: shared/ignored framework state or repo-owned/tracked data. The technical migration supports either, but ignore rules and release instructions differ.

## Confidence and Limitations

Confidence is high for the current filesystem, Git index, resolver code, ignore precedence, literal-file inventory, and existing migration safeguards. Confidence is medium for exact edit count and live Memory MCP row behavior because this lineage did not mutate the shared database or run temporary-workspace tests. Those are explicit implementation proof gates, not assumed outcomes.

## Convergence

The loop completed five iterations and stopped because `maxIterations` was reached. It did not meet the 0.05 convergence threshold: ratios remained `[1.00, 0.86, 0.82, 0.78, 0.55]`. All five research questions were answered; one downstream ownership policy decision remains for the operator.
