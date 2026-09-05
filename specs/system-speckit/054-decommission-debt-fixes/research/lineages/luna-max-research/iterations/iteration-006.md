# Iteration 6: Documentation and runtime mirror parity

## Focus

Compare the public successor narrative with the paths and ownership that the code and runtime mirrors still expose. The useful distinction is between an intentional continuity name (`/memory:save`) and a retired database/server name that remains actionable or is left without an owner.

## Findings

1. **LUNA-026 — The skill documentation scopes `MEMORY_DB_PATH` to the advisor, while the live spec-kit detector still consumes it for session-folder discovery. P1. CONFIRMED.** The environment table says `MEMORY_DB_PATH` overrides the one SQLite store owned by the skill advisor and the note tells users to use it only for that advisor. The spec-folder detector imports the shared DB path and opens `session_learning` rows during its active Priority 2.5 path, and the runtime resolver explicitly treats `MEMORY_DB_PATH` as a system-spec-kit database-path input. A user following the documented ownership boundary can therefore change the detector's database selection without realizing it, or believe the retired system path is gone when it is not. Smallest fix: remove the detector's legacy DB branch, or document separate variable ownership and rename/scope the override so advisor and spec-kit consumers cannot silently share it. [SOURCE: .opencode/skills/system-spec-kit/README.md:354-370] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-22,1341-1354] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-75]

2. **LUNA-027 — Install recovery instructions contradict the successor's explicit no-database retrieval contract and still prescribe system-spec-kit database backup/rebuild behavior. P1. CONFIRMED.** The install guide says spec-folder retrieval has no server and no database to create, while its disaster-recovery section backs up and restores `.opencode/skills/system-spec-kit/runtime/database`, labels database corruption as a recovery case, and presents deletion/rebuild guidance in the same guide. The guide does not identify that database as a separately owned advisor store, so the old runtime database remains an actionable operational surface after the decommission narrative says it is absent. Smallest fix: delete the retired system-spec-kit database backup/recovery commands, or relabel them with the exact surviving owner/path and a testable recovery procedure. [SOURCE: .opencode/install-guides/README.md:544-568] [SOURCE: .opencode/install-guides/README.md:904-917,921-934] [SOURCE: .opencode/install-guides/README.md:987-998] [SOURCE: README.md:953-955]

3. **LUNA-028 — The Pi mirror documents a nonexistent bare `mcp-server` path for the post-compaction adapter. P2. CONFIRMED.** The Pi README says paths without a leading `.opencode/` are relative to `.opencode/skills/`, then identifies the session-compact delegate as `mcp-server/hooks/devin/post-compaction.cjs`. Under that documented resolution the path would be `.opencode/skills/mcp-server/...`; the current adapter is at `.opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`, and its source describes a current bespoke Devin adapter. This leaves a stale runtime-rename identity in a live mirror reference. Smallest fix: change the table to the full `system-spec-kit/runtime/hooks/devin/post-compaction.cjs` path and state that it is the current Devin adapter, not a port from an unnamed `mcp-server` package. [SOURCE: .pi/extensions/README.md:59-74] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:1-17] [INFERENCE: relative-path resolution from the Pi README makes the documented bare path resolve outside the owning package]

4. **LUNA-029 — The central docs leave memory-named successor and retired code boundaries ambiguous. P2. INFERRED.** The skill README says the old memory MCP server is gone and that its lifecycle, scoring, graph, and evaluation behavior did not return, but the same public documentation continues to expose `/memory:save`, `/memory:search`, `scripts/dist/memory/generate-context.js`, and memory environment variables. The architecture document additionally names `handlers/memory-index-discovery.ts` as the discovery implementation, while the runtime README lists `scripts/memory/generate-context.ts` as a live caller. The continuity names are partly intentional, but the docs do not mark which memory-named paths are successor continuity surfaces, compatibility code, or debt slated for removal; this makes a decommission audit and operator troubleshooting non-deterministic. Smallest fix: add an ownership table mapping every retained memory-named command/module/env var to its successor contract, or rename/remove the entries that are not supported. [SOURCE: .opencode/skills/system-spec-kit/README.md:284-294,328-337,354-374] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:130-140] [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:28-37]

## Ruled Out

- The `.pi` README's references to `system-skill-advisor/mcp-server` are not classified as retired system-spec-kit residue: the root README identifies that as the standalone advisor package and its own database owner. [SOURCE: README.md:304-310] [SOURCE: .pi/extensions/README.md:23-25,29-30,67-71]
- The four hook mirror READMEs correctly state that they are discovery mirrors and that runtime wiring lives in the corresponding JSON authority; this pass does not claim that every mirror reference is executable wiring. [SOURCE: .claude/hooks/README.md:5-13] [SOURCE: .codex/hooks/README.md:5-13] [SOURCE: .cursor/hooks/README.md:5-13] [SOURCE: .devin/hooks/README.md:5-13]

## Dead Ends

- A literal search for `mcp-server` alone is insufficient: the advisor's package intentionally uses that segment, while the bare Pi reference is wrong because the surrounding README establishes a relative `.opencode/skills/` base. Ownership and path resolution were required before classifying the term. [SOURCE: .pi/extensions/README.md:70-74] [SOURCE: README.md:304-310]

## Edge Cases

- `MEMORY_DB_PATH` may be retained for an intentional compatibility window, but the current docs' advisor-only wording is not compatible with an unlabelled spec-kit detector consumer.
- The install guide's database commands may have been inherited from a broader pre-decommission guide. Their placement under the no-server retrieval section still makes them actionable unless an owner and scope are named.
- The Pi adapter's historical “native port” wording might be useful provenance, but it must not substitute for the current source path or package identity.

## Questions Remaining

- Q5 is partially answered: docs contain a confirmed env-owner contradiction, a stale Pi path, and an inferred memory-name ownership gap; mirror count drift from iteration 3 remains a separate confirmed issue.
- Q1-Q4 and Q6-Q7 remain open. Next focus: the trigger index, ripgrep retrieval lane, and continuity writer as successors, including coverage gaps against the retired memory surface.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/README.md:284-294,328-337,354-374]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-22,1341-1354]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-75]
- [SOURCE: .opencode/install-guides/README.md:544-568,904-934,987-998]
- [SOURCE: README.md:304-310,953-955]
- [SOURCE: .pi/extensions/README.md:23-30,59-74]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:1-17]
- [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:130-140]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:28-37]
- [SOURCE: .claude/hooks/README.md:5-13]
- [SOURCE: .codex/hooks/README.md:5-13]
- [SOURCE: .cursor/hooks/README.md:5-13]
- [SOURCE: .devin/hooks/README.md:5-13]

## Assessment

- New information ratio: 0.82
- Questions addressed: Q5 documentation and runtime mirror parity
- Questions answered: Q5 = partial; database ownership and Pi path contradictions are confirmed, while the broader memory-name boundary is inferred.
- Confidence: high for the explicit code/doc path and environment mismatch; medium for whether the database recovery section is intentionally advisor-owned, because the guide does not say so.

## Reflection

- What worked and why: resolving relative paths against the mirror's own stated base separated a genuine stale `mcp-server` reference from the intentionally retained advisor package.
- What did not work and why: treating all uses of “memory” as retired would erase the documented continuity successor and overstate the defect.
- What I would do differently: compare successor guarantees directly against trigger-index and continuity-writer implementation contracts before proposing any further documentation cleanup.

## Recommended Next Focus

Angle 6: audit trigger-index, ripgrep retrieval, and continuity-writer coverage for guarantees the retired memory surface provided, including declared-phrase gaps, lexical-only misses, freshness, and packet-local recovery.
