# Research: Spec Root Resolution Hardening

> Ten-iteration autonomous synthesis for `008-spec-root-resolution-hardening`.
> Stop reason: `maxIterationsReached`. Research only; no resolver, hook, test, build, symlink, or migration implementation was changed.

## 1. Executive Summary

Spec Kit does not have one root-resolution contract. It has several independently implemented contracts:

- The shared scripts resolver is legacy-first: `specs/` precedes `.opencode/specs/`.
- MCP document/graph discovery and Gate 3 are canonical-first.
- Other MCP and scripts functions independently use canonical-first, legacy-first, canonical-only, or direct-path-first behavior.
- Automatic writers include resolver consumers and direct-root writers that a shared-list reorder cannot fix.

The current repository-root `specs` symlink hides much of this split because both spellings resolve to one inode in this checkout. The tracked Git blob is nevertheless a developer-specific absolute symlink target. It is unsafe for fresh clones, linked worktrees, archives, and `core.symlinks=false` checkouts. Repository evidence supports an intentional compatibility-alias purpose, but the exact creator/command/actor remains unknown and no in-scope runtime installer or self-healer was found. [SOURCE: research/iterations/iteration-003.md:9-30] [SOURCE: research/iterations/iteration-010.md:17-17]

**Decision:** canonical-first is the correct universal default for unqualified selection, provided that:

1. explicit qualified paths remain authoritative during migration;
2. unique legacy-only packets remain readable through fallback;
3. divergent same-relative duplicates block implicit reads/writes rather than silently switching winners;
4. all automatic writers are canonicalized directly;
5. runtime correctness never depends on the symlink.

The safe deployment order is **data before writers**: lock behavior, inventory roots, freeze writers, canonicalize/quarantine packet data, deploy canonical writer and collision-guard changes as one source+dist bundle, normalize readers to canonical-first with read-only legacy fallback, then retire the alias after a 28-day zero-hit window and no-alias proof. The first successful canonical write after writer unfreeze is the point after which packet-location rollback is no longer lossless. [SOURCE: research/iterations/iteration-009.md:14-29]

## 2. Research Scope And Verdict

The research answered the five tracked questions about resolver precedence, canonical-first compatibility, symlink provenance/portability, automatic-writer behavior, and remediation/rollback/validation. [SOURCE: research/deep-research-dashboard.md:51-58]

The final audit found that iteration 1 was exhaustive for the **shared scripts resolver and specifically audited MCP/Gate-3/direct-writer paths**, but not for every direct root constructor in Spec Kit. This synthesis therefore reports a verified per-function inventory and an explicit completeness limit. A central resolver registry or AST-backed inventory is required before implementation can claim universal call-site coverage. [SOURCE: research/iterations/iteration-010.md:11-15,23-32]

## 3. Methodology

- Iterations 1-2 traced shared resolver definitions, reverse callers, precedence, persisted identity, and canonical-first regressions.
- Iteration 3 used Git index/blob/history evidence plus official Git behavior to assess symlink intent and portability.
- Iterations 4-5 traced the configured Claude Stop hook through source and compiled dist into `generate-context`, folder detection, workflow writes, and phase-parent refresh.
- Iterations 6-9 ranked remediation, measured current root/data state, designed R1-R9 fixtures, and corrected rollout to data-before-writer sequencing.
- Iteration 10 adversarially searched for omitted direct constructors, downgraded subsystem-wide claims, and added the R10 misdirected-symlink gap.
- Every iteration passed the mechanical narrative, route-proof, and delta gate. Iteration 4 is honestly recorded as `timeout` because source/dist verification exceeded its tool budget; iteration 5 closed that bounded gap. [SOURCE: research/deep-research-dashboard.md:29-49]
- The code coverage graph remained empty, so graph convergence stayed `CONTINUE`; the explicit ten-iteration hard cap controlled termination.

## 4. Verified Resolver And Writer Inventory

This is the verified inventory from exact-symbol and bounded direct-constructor checks. It is not a proof that no additional dynamically composed or external resolver exists.

| Function / call site | Consumer or effect | Current precedence |
|---|---|---|
| `scripts/core/config.ts:321-360` | `getSpecsDirectories`, active root, existing-root enumeration | Legacy-first; same-inode dedup preserves first spelling |
| `scripts/core/subfolder-utils.ts:39-58,129-149` | Sync/async recursive packet lookup | Inherits legacy-first; realpath dedup |
| `scripts/spec-folder/folder-detector.ts:181-186,1121-1139` | Containment and bare packet detection | Membership accepts both; bare lookup legacy-first; explicit root preserved |
| `scripts/memory/generate-context.ts:193-230,269-380,531-549,785-799` | Save target validation, lookup, packet identity, diagnostics | Explicit/exact path first; otherwise legacy-first |
| `scripts/extractors/collect-session-data.ts:1063-1093,1193-1220,1437-1469` | Session packet and related-doc resolution | Unqualified legacy-first; matched explicit root retained |
| `scripts/core/workflow.ts:1016-1043,1663-1687` | Root-relative identity and description regeneration | Detected absolute target wins; candidate inference legacy-first |
| `scripts/spec-folder/directory-setup.ts:22-80` | Write-boundary validation and diagnostics | Membership accepts both; active-root diagnostics legacy-first |
| `scripts/spec-folder/nested-changelog.ts:589` | Changelog write-boundary validation | Membership-only; ordering does not select target |
| `mcp_server/handlers/memory-index-discovery.ts:203-223,308-382` | Spec documents and graph metadata discovery | Canonical-first; legacy used only when canonical absent |
| `shared/gate-3-classifier.ts:125-137,348-418` | Gate-3 workspace roots and candidate binding | Canonical-first; explicit root accepted |
| `scripts/spec/create.sh:811-819` | Packet creation | Tracked mode direct canonical; untracked mode direct legacy |
| `scripts/graph/migrate-generated-json.ts:149-170,590-598` | Graph metadata migration default | Direct canonical |
| `scripts/graph/backfill-graph-metadata.ts:238-259,278-319` | Graph metadata backfill default | Direct canonical |
| `mcp_server/startup-checks.ts:261-292` | Startup drift-marker containment | Canonical-only |
| `mcp_server/context-server.ts:1602-1627` | Startup pending-recovery root scan | Legacy-first |
| `mcp_server/lib/search/folder-discovery.ts:1363-1379` | Generic MCP spec base paths | Legacy-first |
| `mcp_server/lib/resume/resume-ladder.ts:863-910` | Resume packet resolution | Canonical-first |
| `mcp_server/lib/continuity/authored-continuity-snapshot.ts:50-70` | Authored continuity resolution | Canonical-first |
| `mcp_server/api/indexing.ts:68-92` | Indexing path resolution | Existing direct path, canonical discovery, then canonical-before-legacy fallback |
| `scripts/utils/spec-affinity.ts:153-174` | Spec affinity candidates | Direct candidates, then legacy-first |
| `scripts/lib/validate-memory-quality.ts:619-651` | Memory-quality candidate roots | Direct candidate, then legacy, then canonical at each ancestor |

The shared scripts consumer inventory is stable under exact-symbol recheck, but subsystem labels such as "all MCP is canonical-first" are false. Precedence must be specified per function until these constructors share one contract. [SOURCE: research/iterations/iteration-001.md:9-34] [SOURCE: research/iterations/iteration-010.md:13-15]

## 5. Canonical-First Contract And Regressions

The recommended contract is:

- `.opencode/specs` wins every unqualified ambiguous selection.
- An explicit qualified or absolute input remains explicit during migration.
- Unique legacy-only packets remain readable.
- Implicit mutation fails closed when the same relative packet exists under two physical roots.
- Legacy compatibility becomes read-only after canonicalization; ordinary legacy writes are blocked.

The one material default-order regression is a divergent duplicate: a bare relative lookup that currently selects the legacy packet would select the canonical packet. Same-inode aliases only change spelling; canonical-only and legacy-only layouts remain reachable with fallback. Membership-only consumers and diagnostics can reorder without retargeting a write. [SOURCE: research/iterations/iteration-002.md:9-17]

Primary persisted packet identities do not require bulk rewriting because inspected `packet_id`, parent/child IDs, and workflow identities are root-relative or metadata-backed. Generated path caches are mixed: the read-only inventory found canonical and legacy-qualified `derived.*.path` values, so metadata regeneration/canonicalization needs tests even though IDs remain stable. [SOURCE: research/iterations/iteration-002.md:15-17] [SOURCE: research/iterations/iteration-007.md:14-18]

## 6. Symlink Provenance And Portability

Confirmed:

- Git tracks `specs` as mode `120000`.
- The earliest inspected link blob was relative (`.opencode/specs`); the current blob is the absolute path `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs`.
- The current adding commit describes `root specs -> .opencode/specs symlink`, supporting intentional compatibility-alias intent.
- No in-scope production installer/self-healer was found; Git checkout is the observed repository maintenance mechanism.
- The absolute payload leaks across linked worktrees, is broken or misdirected in fresh clones, and is preserved by tar archives.
- `core.symlinks=false` can materialize a plain file containing the target text instead of a directory alias.

Unknown:

- The exact command, actor, or working-tree event that created the current link.
- Whether external local automation also maintains it.
- The authoritative supported-OS policy.

The resolver contract must not depend on the symlink. Replacing the absolute target with a relative link can be a temporary compatibility bridge, but not the endpoint. [SOURCE: research/iterations/iteration-003.md:9-30] [SOURCE: research/iterations/iteration-010.md:17-17]

## 7. Automatic-Writer Failure Modes

| Writer / state | Symlink absent or dangling | Distinct plain `specs/` directory | Plain file at `specs` |
|---|---|---|---|
| Claude Stop autosave | Hook emits `specs/<id>`; unique-basename fallback may recover canonical, ambiguity/no-match fails. Hook logs warning but exits 0. | Existing legacy target can receive a split-brain write hidden from canonical-first MCP discovery. | Fallback or failure; not a writable root. |
| Manual `generate-context` | Bare/canonical input can select canonical; explicit legacy input follows Stop-like fallback/failure. | Explicit or legacy-first lookup can write legacy. | Cannot contain target; fallback/failure. |
| Workflow description/graph/research metadata | Follows the resolved absolute packet; no independent reselection. | Coherently updates legacy packet if upstream selected it, but MCP may ignore it. | Depends on upstream fallback/failure. |
| Phase-parent pointer refresh | Can silently skip after child save because it re-resolves the original legacy-qualified argument instead of using the resolved child path. | Can update legacy parent while MCP reads canonical parent. | Re-resolution fails or falls back. |
| `spec/create.sh --track` | Direct canonical and safe. | Direct canonical. | Direct canonical. |
| `spec/create.sh` untracked | `mkdir -p` materializes a new plain legacy root, causing split-brain. | Writes legacy split-brain. | Hard failure. |
| Graph migration/backfill defaults | Direct canonical and safe. | Direct canonical unless explicit legacy target supplied. | Direct canonical. |

The configured Claude route executes compiled `mcp_server/dist/hooks/claude/session-stop.js`, which invokes compiled `scripts/dist/memory/generate-context.js`. Targeted source/dist branch comparison found no semantic drift in this chain, but source maps omit `sourcesContent`, so this is not global dist-freshness proof. [SOURCE: research/iterations/iteration-004.md:15-35] [SOURCE: research/iterations/iteration-005.md:13-23]

## 8. Current Data And Persistence State

The live checkout currently has one physical root: `specs` and `.opencode/specs` resolve to the same inode. Git tracks no `specs/` descendants separately, so no distinct legacy-only packet migration exists in this checkout while the alias is intact. The research inventory found 45,224 tracked canonical descendants and no tracked legacy descendants. [SOURCE: research/iterations/iteration-007.md:12-18]

That does not remove migration requirements for other clones, worktrees, archives, historical states, or plain-directory replacements. A preflight must classify each relative packet identity as canonical-only, legacy-only, same-inode alias, byte-identical independent duplicate, or divergent independent duplicate.

## 9. Ranked Remediation

1. **Establish contract and collision preflight.** Create a maintained resolver registry, table-driven expected behavior, and a fail-closed read-only classifier across every physical root.
2. **Canonicalize packet data under a writer freeze.** Quarantine legacy-only/duplicate sources with hashes and explicit winner decisions before writer changes.
3. **Fix automatic writers as one source+dist bundle.** Make Stop emit canonical targets, make bare/new saves canonical, pass the resolved absolute packet to phase-pointer refresh, make both `spec/create.sh` modes canonical, and add per-write same-ID collision rejection.
4. **Normalize all unqualified readers/resolvers.** Change the shared scripts helper and independent direct constructors to canonical-first while retaining unique legacy-only read fallback.
5. **Retire runtime symlink dependence.** Prove all mandatory no-alias/plain-file/misdirected-link cases, run a zero-hit compatibility window, then remove the tracked alias. A relative link is only a temporary bridge.

Rejected endpoints are resolver-order-only, relative-symlink-only, and canonical-only cutovers. [SOURCE: research/iterations/iteration-006.md:12-29] [SOURCE: research/iterations/iteration-010.md:19-21]

## 10. Migration And Rollback

| Stage | Action | Promotion gate | Rollback |
|---|---|---|---|
| S0 | Record source revision and both dist hashes; lock expected red/green behavior | No unexplained source/dist mismatch | Discard candidate build |
| S1 | Read-only root and packet classifier with file-set hashes | No unclassified, drifting, plain-file, dangling, misdirected, or divergent packet | Discard manifest and rescan |
| S2 | Freeze all packet writers; manually resolve divergence; move legacy-only packets to canonical; quarantine originals | Hash/schema/parent-child validation, zero writers, zero unresolved duplicate IDs | Lossless data rollback from quarantine while freeze remains |
| S3 | Deploy canonical writer/collision-guard source+dist bundle; smoke with alias absent; unfreeze | No losing-root mutation, visibility mismatch, parent/child split, or source/dist mismatch | Refreeze and roll back behavior bundle; preserve canonical data |
| S4 | Switch readers to canonical-first; retain read-only legacy fallback for 28 clean days | Zero fallback hits, legacy-write attempts, duplicate conflicts, or matrix failures | Roll back reader behavior only; keep writers/data canonical |
| S5 | Remove tracked alias after complete no-alias proof | No alias dependency or skipped mandatory no-alias row | Relative alias may be restored only as non-universal convenience |

The last fully data-reversible point is before S3 writer unfreeze. The first successful post-unfreeze canonical write makes the quarantine older than live data, so later rollback must preserve canonical data and change behavior only. Restoring the symlink alone is never a valid rollback. [SOURCE: research/iterations/iteration-009.md:18-29]

## 11. Validation Strategy

The fixture factory should factor root mode from packet mode, use temporary workspaces, and never mutate the checkout's live alias.

| Cell | Required state and assertion |
|---|---|
| R1 | Canonical-only: canonical active; implicit writes canonical |
| R2 | Legacy-only: unique packet readable through fallback; implicit writes blocked until migration |
| R3 | Valid relative alias: one realpath; canonical spelling/identity |
| R4 | Independent unique roots: canonical active; both readable where enumeration is intended |
| R5 | Same-ID byte-identical duplicates: classify identical; canonical winner; no move required |
| R6 | Same-ID divergent duplicates: report both paths; block implicit read/write orchestration |
| R7 | Dangling alias: reject alias; canonical remains active; no legacy root materialized |
| R8 | Distinct plain legacy directory: implicit reads/writes canonical; explicit migration read bounded |
| R9 | Plain file at `specs`: reject non-directory; canonical remains active |
| R10 | Misdirected/external symlink: reject cross-workspace target; no read/write leakage |

Blocking lanes:

- **L1 Source semantics:** all resolver rows, Gate 3, readers, Stop payload, generator, phase pointer, and create paths.
- **L2 Clean compiled runtime:** delete candidate dist/build-info in an isolated checkout, build scripts first, test scripts dist, rebuild MCP second, then execute built Stop/MCP behavior against the same expected values.
- **L3 OS/no-symlink matrix:** Linux, macOS, Windows; R1/R2/R4-R10 mandatory. Symlink-capability rows may skip only with a named reason and published skip count.
- **L4 Migration/rollback fault injection:** scan/move races, cross-device copy/hash/rename failure, writer-during-freeze, S2 rollback, and refusal of destructive data rollback after a post-S3 write.

The matrix must include independent resolver families found by iteration 10, not only the shared scripts helper: Gate 3, startup pending recovery, generic MCP discovery, resume/authored continuity, API indexing, spec affinity, and memory-quality validation. [SOURCE: research/iterations/iteration-008.md:12-69] [SOURCE: research/iterations/iteration-009.md:29-40] [SOURCE: research/iterations/iteration-010.md:21-21]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Reorder `getSpecsDirectories()` only | Misses explicit Stop target, phase-pointer re-resolution, direct `spec/create.sh`, and independent root constructors | `iteration-004.md:15-26`; `iteration-010.md:13-15` | 4, 10 |
| Canonical-only resolver | Orphans unique legacy-only packets | `iteration-002.md:11-23` | 2 |
| Relative symlink as endpoint | Fails `core.symlinks=false` and does not remove runtime dependence | `iteration-003.md:13-24` | 3 |
| Writer cutover before data migration | Can create a canonical twin beside a unique legacy packet | `iteration-009.md:14-27` | 9 |
| Read/write legacy compatibility window | Legacy writers can recreate split state | `iteration-009.md:42-48` | 9 |
| Restore symlink as rollback | Does not restore data, pointers, or plain-file checkouts | `iteration-006.md:18-20`; `iteration-009.md:27` | 6, 9 |
| Bulk persisted-ID rewrite | Primary IDs are root-relative or metadata-backed | `iteration-002.md:17-23`; `iteration-007.md:14-18` | 2, 7 |
| Source-only or freshness-marker-only validation | Production Stop and generator execute compiled JavaScript | `iteration-005.md:15-23`; `iteration-008.md:59-75` | 5, 8 |
| Ubuntu symlink test as portability proof | No-symlink/plain-file behavior is independent and cross-platform | `iteration-003.md:13-20`; `iteration-009.md:31-40` | 3, 9 |
| Claim globally exhaustive inventory from regex/literal scans | Direct-constructor search found omissions and reached its cap | `iteration-010.md:13-15,30-32` | 10 |

## Divergence Map

- No divergent pivot transaction ran.
- The important conceptual pivot was from "shared resolver reorder" to "per-function contract plus automatic-writer fixes."
- The rollout pivot was from writer-first implementation priority to data-before-writer deployment order.
- Remaining frontier: implementation-time central resolver registry, dynamic R1-R10 results, external writer inventory, and supported-OS policy.

## 12. Open Questions

1. Who or what exact command created the current absolute symlink?
2. Do external cron jobs, local hooks, or unindexed tools write packets outside the in-repository inventory?
3. What operating systems are officially supported rather than conservatively tested?
4. How many additional independent resolvers exist beyond the bounded direct-constructor scan?
5. Do the proposed source/dist/OS fixtures produce the expected runtime outcomes?

These are residual unknowns, not evidence against the recommended direction. [SOURCE: research/iterations/iteration-010.md:34-39,61-67]

## 13. Confidence Assessment

| Claim | Confidence | Basis |
|---|---|---|
| Shared scripts consumer inventory and precedence | High | Exact symbol definitions, reverse callers, final recheck |
| Named independent resolver precedence | High | Direct source anchors per function |
| Universal resolver count | Low | Bounded search reached cap; no registry exists |
| Canonical-first contract | High | Existing canonical authorities plus bounded duplicate regression |
| Symlink intent and tracked payload | High | Git mode/blob/history and source wording |
| Exact symlink creator and exclusive maintenance | Low | Not present in repository evidence |
| Auto-writer control flow | High | Source and configured dist branch parity |
| Cross-platform runtime outcomes | Medium-Low | Git contracts and static code; matrix not implemented |
| Migration/rollback model | Medium-High | Evidence-grounded transaction design; fault injection pending |

## 14. Source Diversity

Evidence spans TypeScript source, compiled JavaScript, shell writers, hook configuration, Git index/blobs/history/archive behavior, existing Vitest harnesses, CI workflow configuration, generated packet metadata, and ten independently verified iteration narratives. The generated resource map records 29 primary references, though line-range-bearing citations are represented as missing paths by its current parser and should not be interpreted as missing source files. [SOURCE: research/resource-map.md:11-17,32-83]

## 15. Implementation Handoff

The first implementation packet should not begin with a resolver reorder. It should:

1. establish the resolver registry and R1-R10 expected-result table;
2. baseline source and freshly rebuilt dist behavior;
3. implement the read-only collision classifier and writer-freeze procedure;
4. only then sequence packet canonicalization, writer fixes, reader normalization, and alias retirement.

No code implementation was performed in this research run.

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Iterations: 10/10
- Tracked questions answered: 5/5
- Iteration statuses: 9 `complete`, 1 `timeout` with the bounded gap closed in the following pass
- Last three novelty ratios: `0.80 -> 0.90 -> 0.90`
- Convergence threshold: `0.05`
- Graph decision: `CONTINUE` because no graph events were emitted; hard iteration cap controlled termination
- Route proof: all ten iterations passed the mechanical narrative + route-proof + delta validator
- Residual unknowns: five, listed in Section 12

## 17. References

- `research/iterations/iteration-001.md` through `iteration-010.md`
- `research/deep-research-state.jsonl`
- `research/deep-research-strategy.md`
- `research/findings-registry.json`
- `research/deep-research-dashboard.md`
- `research/resource-map.md`
- `.opencode/skills/system-spec-kit/scripts/core/config.ts`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`
- `.claude/settings.json`
- `.github/workflows/strict-pass-freshness-sweep.yml`
