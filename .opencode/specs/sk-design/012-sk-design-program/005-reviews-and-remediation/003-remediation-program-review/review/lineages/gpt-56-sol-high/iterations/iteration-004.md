# Deep Review Iteration 004 — Maintainability

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `scan`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct reads, manifest-scoped exact search, pinned Git evidence, and an executable command-contract test were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/database/README.md`
- `.opencode/skills/sk-design/styles/lib/database/operator.mjs`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/{graph-metadata.json,implementation-summary.md}`
- `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/{graph-metadata.json,implementation-summary.md}`
- `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/assets/interface-design-presentation.txt`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The database module README sends every operator command to the removed `_db` tree (`P1-004`)** -- `.opencode/skills/sk-design/styles/lib/database/README.md:75` -- The current module README labels `operator.mjs` as the supported maintenance entry point, but all five status/build/cutover/rollback/repair examples invoke the removed `styles/_db/operator.mjs`; the executable now lives at `styles/lib/database/operator.mjs`. The same README also describes the old `_db/` and `_engine/` ownership at lines 91, 136, and 147, increasing the chance that follow-on maintenance restores or scripts against retired paths. [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-92`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:134-147`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:1-24`]
   - Finding class: matrix/evidence
   - Scope proof: The manifest-scoped stale-path sweep found five executable examples in this current module README; direct path checks proved `styles/_db/operator.mjs` absent and `styles/lib/database/operator.mjs` present. This is separate from `P1-002`, whose primary surface is the manual release playbook.
   - Affected surface hints: `["database operator onboarding", "status/build/cutover/rollback/repair commands", "adapter-mode documentation", "follow-on path edits"]`
   - Recommendation: Replace current operational references with the centralized `lib/database`, `lib/engine`, and `database` paths, then execute each documented command form.
   - Content hash: `sha256:4f8ce8f7707a3903ca99232419b9c1a42f590f842819bc55f38c6850694f0b66`

```json
{"findingId":"P1-004","type":"maintainability-operational-path","claim":"The current database module README presents five supported maintenance commands that all target a removed executable path, so operators cannot run the documented interface without translating it.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/README.md:69-92",".opencode/skills/sk-design/styles/lib/database/README.md:134-147",".opencode/skills/sk-design/styles/lib/database/operator.mjs:1-24"],"counterevidenceSought":"Checked for a compatibility executable at styles/_db/operator.mjs and found none; confirmed the relocated lib/database/operator.mjs exists and directly implements the maintenance entry point.","alternativeExplanation":"The old paths could be historical narration, but they occur under the live Operator Commands and Adapter Modes sections and are written as executable instructions.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if an in-scope compatibility resolver makes all five literal commands executable or the README is explicitly retired from the supported operator surface."}
```

2. **Generated packet graphs still encode pre-rewrite status and pre-restructure paths (`P1-005`)** -- `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:42` -- The interface-rewrite graph reports `in_progress` while its implementation summary explicitly records IMPLEMENTED and a completed 19-test rewrite. Separately, the 001 and 004 database graphs expose removed `_db/retrieval.mjs` and `_db/vectors.mjs` as key files and derived entities. These are runtime metadata rather than historical plans, so graph/resume consumers receive stale status and dead navigation targets after the migrations. [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/implementation-summary.md:80-101`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json:32-55`]
   - Finding class: cross-consumer
   - Scope proof: Manifest-scoped JSON parsing succeeded for every metadata file, then exact stale-path/status inspection found the same dead `_db` entities in both 001 and 004 plus the stale 012 lifecycle state. The 001 implementation summary independently declares its generated refresh pending and retains a zero continuity fingerprint [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:3-23`].
   - Affected surface hints: `["Spec Kit resume status", "code-graph entity navigation", "memory indexing", "generated-metadata refresh", "packet dependency discovery"]`
   - Recommendation: Regenerate the affected packet metadata from current canonical docs after correcting durable path references, and verify every emitted key-file/entity target exists and lifecycle state matches the packet authority.
   - Content hash: `sha256:a5590af0fc7b364239e037d7e2c9e81056163d4a4b4cc4cf9109b49fd560975b`

```json
{"findingId":"P1-005","type":"maintainability-generated-metadata","claim":"Generated graph metadata supplies stale lifecycle state and removed file targets to resume, memory, and graph consumers after the command and styles migrations.","evidenceRefs":[".opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57",".opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/implementation-summary.md:80-101",".opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64",".opencode/specs/sk-design/015-styles-database-evolution/004-growth/graph-metadata.json:32-55",".opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:3-23"],"counterevidenceSought":"Parsed all manifest-listed metadata JSON, compared the 012 graph state with its implementation authority, and checked the 001/004 graph targets against the relocated tree. Current source modules exist under lib/database, not _db.","alternativeExplanation":"Historical spec prose may intentionally preserve pre-move paths, but graph-metadata key_files, entities, and status are generated current-state routing surfaces rather than historical records.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if all consumers are proven to ignore derived status/key_files/entities and another current generated authority supplies correct lifecycle and navigation data."}
```

### P2 Findings

None.

## Traceability Checks

- `stale_reference_closure`: **fail** — the current database README retains executable `_db` commands beyond the already-recorded manual-playbook drift [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-92`].
- `generated_metadata_integrity`: **fail** — manifest-listed graph metadata contains a stale lifecycle state and dead `_db` entities [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/graph-metadata.json:41-57`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/graph-metadata.json:41-64`].
- `command_authority_consistency`: **pass** — the command body and presentation asset mutually identify the body as normative, and the 12-test command contract passed [SOURCE: `.opencode/commands/interface/design.md:32-39`] [SOURCE: `.opencode/commands/interface/assets/interface-design-presentation.txt:1-4`].
- `file_format_hygiene`: **pass** — pinned-HEAD `git diff --check` returned no warning; the iteration-001 blank-line-at-EOF follow-up is no longer reproducible.

## Integration Evidence

- Pinned Git evidence: `HEAD` is `7b9d3b6b71`; `git diff --check` was clean.
- Executable evidence: `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` passed 12/12.
- Exact integration surfaces reviewed: `styles/lib/database/operator.mjs`, its module README, packet `graph-metadata.json` consumers, `/interface:design`, and `interface-design-presentation.txt`.

## Edge Cases

- Historical pre-move paths in the 005 restructure plan/spec and fixture-local `_retrieval-manifest.json` names are intentional migration evidence or explicit test overrides; they were not classified as stale active interfaces.
- The 001 implementation summary openly says generated refresh remains pending; that honesty is counterevidence against hidden drift, but it does not make the runtime metadata current.
- One exact-search command accidentally targeted the wider `.opencode/specs/sk-design` graph-metadata tree instead of only the manifest. Out-of-manifest hits were discarded immediately; no finding or clean claim relies on them. This scope violation is preserved for reducer/operator audit.
- `P1-002` and `P1-003` were not refined: this pass found distinct README and generated-metadata surfaces rather than new evidence changing their claims.

## Confirmed-Clean Surfaces

- Central path authority remains implemented in `styles/lib/paths.mjs`; no compatibility `_db` or `_engine` filesystem alias was found in the manifest-scoped sweep.
- The sampled command/presentation pair agrees that YAML owns execution control, the command body is normative, and the presentation file owns display fixtures only [SOURCE: `.opencode/commands/interface/design.md:32-39`] [SOURCE: `.opencode/commands/interface/assets/interface-design-presentation.txt:1-4`].
- Current file-format evidence is clean: `git diff --check` emitted no warning at the pinned HEAD.

## Ruled Out

- Fixture-local `_retrieval-manifest.json` names: explicitly retained to test path overrides rather than production defaults.
- Historical migration tables in 005 packet docs: they label old paths as before/after or reference-only evidence, not live operator commands.
- Command presentation-authority inversion: direct reads and the 12/12 contract test show the command and presentation asset agree.

## Next Focus

- Dimension: correctness (second-pass cross-reference)
- Focus area: packet-level consumer closure across runtime entry points, generated-state consumers, and the save/regeneration boundary
- Reason: initial four-dimension coverage is complete; the new README and graph findings show that clean implementation seams can still leave adjacent current-state consumers stale
- Rotation status: all four dimensions completed once; broaden to a distinct packet-level integration angle for iteration 005
- Blocked/productive carry-forward: Code Graph remains unavailable; manifest-scoped consumer enumeration, direct reads, pinned Git evidence, and focused executable checks are productive
- Required evidence: named consumers of centralized paths and graph metadata, regeneration ownership, command/document parity, and evidence that no stale current-state authority remains

Review verdict: CONDITIONAL
