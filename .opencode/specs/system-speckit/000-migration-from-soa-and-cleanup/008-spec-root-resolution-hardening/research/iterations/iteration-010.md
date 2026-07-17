# Iteration 10: Final Adversarial Consistency and Completeness Audit

## Focus

This final forced-depth iteration audited iterations 1–9 against the original root-resolution ask. It checked the claimed call-site inventory, precedence classifications, automatic-writer scope, symlink provenance, migration/rollback consistency, and symlink/no-symlink validation matrix. Narrow verification was limited to exact resolver symbols, direct root constructors, selected high-impact source anchors, and current Git evidence; no implementation or live-root mutation was performed.

## Route Proof

- Exact rendered route: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. This is `iteration: 10`, `run: 10`, and the only write targets are this narrative, one canonical state append, and `deltas/iter-010.jsonl`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-10.md:1-12]

## Findings

1. **Iteration 1's shared-scripts resolver consumer list survives the exact-symbol audit, but its broader “exhaustive root-resolution call-site inventory” claim does not.** The exact `getSpecsDirectories`/`getAllExistingSpecsDirs`/`findActiveSpecsDir` search reproduced the production consumers already listed: subfolder search, folder detection, `generate-context`, session collection, workflow, directory setup, and nested changelog. A separate direct-constructor check exposed independent production resolvers absent from that inventory, including MCP startup pending-recovery roots, generic MCP search base paths, resume/authored-continuity resolution, API indexing resolution, script affinity, and memory-quality validation. Synthesis must therefore call iteration 1 an exhaustive inventory of the **shared scripts resolver plus the specifically audited MCP/Gate-3/direct-writer paths**, not of every root resolver in Spec Kit. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-339] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts:41,132] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:196-226,311-375,542,789] [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts:1205-1208,1439-1442] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1021-1027,1676-1678] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379]

2. **The omitted resolvers prove that subsystem-wide precedence labels are unsafe; precedence must remain per function.** `resume-ladder` and authored-continuity resolution are canonical-first; API indexing preserves an existing direct path, then uses canonical-first discovery, then canonical-before-legacy fallback. In contrast, generic MCP `getSpecsBasePaths()` constructs legacy before canonical, MCP startup pending recovery scans legacy before canonical, `spec-affinity` tries direct candidates then legacy before canonical, and memory-quality validation inserts direct, legacy, then canonical candidates at each ancestor. Startup drift-marker containment is canonical-only rather than a two-root selector. Accordingly, “the MCP indexing/read path is canonical-first” remains confirmed only for `memory-index-discovery` and named consumers, while any synthesis phrasing that generalizes it to all MCP or all scripts readers must be downgraded. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:863-910] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/continuity/authored-continuity-snapshot.ts:50-70] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:68-92] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1627] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts:619-651] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/startup-checks.ts:261-292]

3. **Symlink intent and tracked capture are confirmed, but exact creation and exclusive maintenance ownership remain inferred.** Current Git evidence still records `specs` as mode `120000`, stores the developer-specific absolute target, and shows the latest adding commit describing “root specs -> .opencode/specs symlink” inside a checkpoint of pre-existing uncommitted work. That supports “intentional compatibility alias” and proves Git captures/restores the tracked entry; it does not identify the command, actor, or working-tree event that created the current link, and the negative creator search cannot prove that Git checkout is the only mechanism in every external environment. Synthesis must state: **no in-scope runtime installer/self-healer was found; Git checkout is the observed repository maintenance mechanism; exact creator and any external automation are unknown.** [SOURCE: command `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`; `git log -1 --format='%H%n%B' -- specs`, 2026-07-17] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:10-20]

4. **The final recommendation is data-before-writer deployment, with resolver normalization broadened beyond the shared scripts helper.** Ranked release order is: (1) lock the expected behavior and run a fail-closed, read-only classifier across every physical root; (2) freeze packet writers and canonicalize/quarantine legacy-only or duplicate data while rollback remains lossless; (3) deploy one source+dist writer bundle that canonicalizes Stop, bare/new saves, phase-pointer follow-up, and both create paths with per-write collision rejection; (4) normalize every unqualified reader/resolver to canonical-first while retaining legacy-only reads, including the independently implemented functions identified above rather than only `getSpecsDirectories()`; and (5) retire the alias only after the 28-day zero-hit window and complete no-alias proof. The implementation-priority ranking in iteration 6 remains useful, but its writer-before-migration stage order is superseded by iteration 9. The first successful post-unfreeze canonical write remains the lossless data-rollback boundary; later rollback is behavior-only and preserves canonical data. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:14-22] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-29,42-59] [INFERENCE: omitted independent resolvers must join the canonical-first reader stage or mixed precedence survives the shared-helper change]

5. **The validation design is strong but not complete: it lacks an explicit misdirected-symlink/cross-worktree cell and does not assign all independent resolver families or Gate-3 to blocking execution lanes.** R1–R9 cover valid alias, absent, dangling, distinct-directory, and plain-file states, while S1 says a misdirected alias must fail; no R-cell proves that a valid symlink pointing outside the active workspace is rejected rather than leaking reads/writes across worktrees. Iteration 6 names Gate-3, but iteration 8's execution split and iteration 9's L1–L4 responsibilities omit an explicit Gate-3 row. Add a capability-conditioned `R10` for an external/misdirected symlink and table-driven rows for Gate-3, startup pending recovery, generic MCP folder discovery, resume/authored continuity, API indexing, spec affinity, and memory-quality validation. The no-symlink rows remain mandatory on Linux/macOS/Windows; source and freshly rebuilt dist must consume the same expectations. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:13-15] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:22] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-008.md:14-37,61-69] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:31-40] [INFERENCE: a declared S1 rejection without a fixture/CI assignment is an unverified acceptance condition]

## Ruled Out

- Preserving “exhaustive every root-resolution call site” in synthesis: narrow direct-constructor verification found concrete omitted production resolvers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174]
- Generalizing canonical-first behavior to all MCP code: generic MCP folder discovery and startup pending recovery construct legacy before canonical. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1371-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619]
- Retaining iteration 6's writer-before-data sequence as deployment order: iteration 9 correctly shows that it can create a canonical twin beside a unique legacy packet. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-27]
- Treating relative-symlink repair or canonical-only selection as the endpoint; both remain blocked by plain-file checkouts and legacy-only discoverability respectively. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:24-29]

## Dead Ends

- Regex/literal scanning cannot itself certify global completeness: the narrow direct-constructor search reached its result cap and still excludes dynamically composed paths and external automation. Future implementation must maintain an explicit resolver registry or an AST-backed inventory and prove it against the blocking matrix; synthesis must not turn this bounded audit into a universal negative claim. [INFERENCE: based on the capped direct-constructor search and the concrete omitted resolvers verified above]

## Edge Cases

- Ambiguous input: “completeness” was interpreted as completeness against executable in-repository root selection and configured automatic packet writers; external cron/jobs and unknown local tooling are reported as residual unknowns rather than inferred absent.
- Contradictory evidence: iteration 6's implementation ranking and iteration 9's deployment order conflict only if treated as the same axis. The resolution is code-priority versus rollout-order separation, with iteration 9 controlling deployment. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:54-59]
- Missing dependencies: no authoritative supported-OS policy or central registry of external packet writers/resolvers was found. Exact symlink creator/command also remains unavailable. These claims are explicitly residual, not marked resolved.
- Partial success: the audit found enough cited discrepancies to correct synthesis and the rollout contract, but the capped direct-constructor scan cannot establish a new exhaustive inventory. Status is `complete` for the adversarial audit, not for a universal source inventory.

## Sources Consulted

- `research/prompts/iteration-10.md:1-12`
- `research/deep-research-config.json:1-85`
- `research/deep-research-state.jsonl:1-12`
- `research/deep-research-strategy.md:24-44,56-393`
- `research/findings-registry.json:1-1366`
- `research/deep-research-dashboard.md:17-155`
- `research/iterations/iteration-001.md:1-80` through `research/iterations/iteration-009.md:1-92`
- `.opencode/skills/system-spec-kit/scripts/core/config.ts:321-339` and exact shared-resolver symbol search results
- `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts:261-292`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1592-1627`
- `.opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:68-92`
- `.opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:863-910`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379`
- `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/authored-continuity-snapshot.ts:50-70`
- `.opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174`
- `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts:619-651`
- Read-only Git evidence: `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`; `git log -1 --format='%H%n%B' -- specs`

## Assessment

- New information ratio: 0.90 (3 fully new audit findings + 2 partially new corrections = 0.80, plus a 0.10 simplicity bonus for resolving the ranking/deployment contradiction and replacing unsafe subsystem-wide claims with per-function classifications)
- Novelty justification: Three findings expose omitted resolver families and validation cells; two refine prior symlink-provenance and rollout conclusions without discarding their supported core.
- Questions addressed: Are iterations 1–9 consistent and complete against the original ask; which claims require downgrade; what final ranking and residual unknowns must synthesis preserve?
- Questions answered: The final audit identifies the exact synthesis downgrades, resolves the iteration-6/9 ordering conflict, broadens the remediation scope, and names the missing validation rows.
- Residual unknowns: exact symlink creator/command/actor; existence of external automatic packet writers; authoritative supported-OS policy; full independent-resolver count beyond the bounded source scan; runtime outcomes until the designed implementation matrix executes.

## Reflection

- What worked and why: Rechecking exact shared symbols first preserved the validated core inventory, while a separate direct-constructor pass exposed independent implementations without repeating the blocked repository-wide literal scan.
- What did not work and why: The direct-constructor search reached the result cap and cannot prove universal absence; it is evidence of incompleteness, not a replacement exhaustive inventory.
- What I would do differently: Require a maintained resolver registry and one shared table-driven precedence contract so new direct constructors cannot escape the source/dist/OS matrix.

## Recommended Next Focus

Workflow synthesis should treat this iteration as the controlling audit: downgrade universal inventory and provenance wording, preserve iteration 9's data-before-writer transaction, add the independent resolver families plus Gate-3 and misdirected-symlink `R10` to the implementation acceptance plan, and carry the five residual unknowns explicitly. No further static research iteration is recommended; the next evidence must come from the isolated source/dist/OS implementation matrix.
