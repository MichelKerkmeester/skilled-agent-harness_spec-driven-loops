# Iteration 10: Active launcher, ignore, and CI identity residue

## Focus

Trace the active worktree launcher into the renamed system-spec-kit runtime's
database path resolver, then compare that path with the trigger-index successor.
Also inspect active CI comments and ignore rules for old package identities. This
was source-only research; no repository command was run that could write state.

## Findings

1. **LUNA-041 — The worktree launcher still exports a live system-spec-kit database directory into every top-level runtime session. P1. CONFIRMED path wiring; runtime file use is INFERRED.** `worktree-session.sh` assigns each worktree `WT_DB_DIR` to `.opencode/skills/system-spec-kit/runtime/database`, prints it as `SPEC_KIT_DB_DIR`, and exports that variable before launching the runtime. The renamed runtime consumes `SPEC_KIT_DB_DIR` before the legacy `SPECKIT_DB_DIR` and `MEMORY_DB_PATH` variables, derives `DATABASE_DIR`/`DATABASE_PATH`, and its shared fallback `DB_PATH` also resolves under `runtime/database`. The successor doctor, in contrast, defines `runtime/data/trigger-index.json` as the diagnosed artifact and says there is no database or daemon. The confirmed defect is the active producer/consumer path contract: a normal worktree launch still advertises and routes a retired database location. Whether a production caller actually opens or creates a file there is inferred, because the bounded runtime source search found only type-only `better-sqlite3` imports and no constructor. Smallest fix: remove the system-spec-kit `SPEC_KIT_DB_DIR` export and database isolation from the launcher after the remaining database consumer is removed, or explicitly re-home a surviving owner under a current, named data contract and update the doctor/ignore rules together. [SOURCE: .opencode/bin/worktree-session.sh:224-244,324-326] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/skills/system-spec-kit/shared/paths.ts:143-171] [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:18-35]

2. **LUNA-042 — The ignore contract still describes `runtime/database` as the retrieval index and backup location even though the successor artifact is the trigger index under `runtime/data`. P2. CONFIRMED documentation/configuration drift.** The root ignore file labels `.opencode/skills/system-spec-kit/runtime/database/` as “the spec-kit retrieval index and its backups,” while the live successor doctor identifies `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` as the generated retrieval artifact and explicitly says the workflow has no database. The ignore rule may be useful for preventing runtime debris from being committed, but its current description preserves the retired database as if it were the canonical retrieval surface. Smallest fix: remove the obsolete `runtime/database` rule if no owner remains, or relabel it as compatibility/legacy cleanup and add an explicit rule for the current generated data boundary. [SOURCE: .gitignore:302-307] [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:18-35,43-55]

3. **LUNA-043 — Active CI workflows still describe the renamed workspace as an `mcp-server`/server package. P2. CONFIRMED documentation drift.** The changed-packet and strict-freshness workflows say validator rules import across the “mcp-server package” and describe “server, shared project and scripts” workspaces, but their actual commands build `shared`, run `runtime`, and install `scripts`; no current system-spec-kit `mcp-server` step appears in those blocks. This can mislead maintainers toward the retired package when repairing CI or deciding which workspace is authoritative, even though the commands themselves currently target the renamed runtime. Smallest fix: update the comments to name `runtime`, `shared`, and `scripts` and state the actual package-root lockfile relationship. [SOURCE: .github/workflows/changed-packet-validation.yml:24-37] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:32-45]

## Ruled Out

- The bounded active config/CI scan found no current `system-spec-kit/mcp-server`, `system-plugins`, `zvec`, `spec-memory`, or `context-server` identity in the inspected root configs and workflow surface. Preserved `mcp-server` paths belong to the separately owned skill-advisor graph, code-mode launchers, or third-party MCP names, so they were not counted as system-spec-kit decommission findings. [SOURCE: opencode.json:11-25] [SOURCE: .mcp.json:1-25] [SOURCE: .opencode/plugins/system-skill-advisor.js:169-189]
- The runtime search did not confirm a production database constructor in the inspected `core`, `lib`, `api`, or `hooks` trees; only configuration/path exports and type-only `better-sqlite3` imports were found. This limits LUNA-041 to confirmed environment/path wiring with inferred file creation/use. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10,258-261] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:6-15,287-289]

## Dead Ends

- No zvec or system-plugins residue was promoted from filename-only or preserved-owner matches without an active consumer/configuration path.

## Edge Cases

- The launcher may be intentionally preparing a compatibility database for code not present in the bounded source tree. That would strengthen the live-residue finding but requires a production-importer decision outside this iteration's read budget.
- Ignore rules are not proof of writes. LUNA-042 is a contract-label finding, not evidence that a database file exists.

## Questions Remaining

- Q1 gains a confirmed active producer of the retired runtime database path, but actual production DB opening remains inferred.
- Q2 gains CI/ignore ownership drift; registration and symlink parity still need a narrower audit.
- Q3-Q7 remain open for package dependency edges, disabled tests, mirror docs, successor coverage, and gate false-green cases.

## Sources Consulted

- [SOURCE: .opencode/bin/worktree-session.sh:224-244,324-326]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113]
- [SOURCE: .opencode/skills/system-spec-kit/shared/paths.ts:143-171]
- [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:18-35,43-55]
- [SOURCE: .gitignore:302-307]
- [SOURCE: .github/workflows/changed-packet-validation.yml:24-37]
- [SOURCE: .github/workflows/strict-pass-freshness-report.yml:32-45]
- [SOURCE: opencode.json:11-25]
- [SOURCE: .mcp.json:1-25]
- [SOURCE: .opencode/plugins/system-skill-advisor.js:169-189]

## Assessment

- New information ratio: 0.75
- Questions addressed: Q1, Q2
- Questions answered: Q1 = partial (live path wiring confirmed; use inferred); Q2 = partial (active CI/ignore residue confirmed)
- Confidence: high for launcher/config/ignore/CI text and path contracts; medium for the runtime's actual database file creation

## Reflection

- What worked and why: following the worktree environment variable into `core/config.ts` distinguished a real producer/consumer seam from harmless historical `mcp-server` strings.
- What did not work and why: the bounded runtime source search did not expose a constructor, so actual database use could not be upgraded from inference.
- What I would do differently: next inspect exact hook/registration target inventories and package dependency edges for current-versus-dropped surfaces.

## Recommended Next Focus

Angle 2/3: compare active hook registrations and mirror targets with their owned source/build outputs, then reconcile system-spec-kit manifest dependencies against non-type production importers without expanding into excluded directories.

