# Iteration 19: Gap Analysis and Recommendations

## Focus
Consolidate the residual gaps that block graph-engineering-based loops, rank them by blast radius and dependency order, specify the runtime module or governance surface for each fix, define objective closure evidence, and separate work belonging to the 036 epic from a follow-up 037 implementation packet. The dispatch focus is narrower than the strategy's ownership-only next-focus note: this pass records the ownership gap and does not infer missing phase status.

## Actions Taken
1. Read the rendered prompt pack, config, state log, strategy, and findings registry before selecting the focus.
2. Performed bounded line-level checks of the 036 handover/specification, the transition gateway and append primitive, loop-lock acquisition, phase-folder inventory, graph-engineering-master inventory, and the LangChain packet.
3. Verified that the packet-local iteration narrative and delta paths were available before writing; no researched or reducer-owned file was modified.

## Findings
1. **P0 / highest blast radius — 024 append-boundary fencing is still unbuilt and blocks authority cutover.** The dated handover says the core fence is absent, `appendAuthorized` is still public, and 024 is not discharged; its concrete scope is to make the primitive private, require a coordinator-issued current fence capability, reject stale/superseded writers, and migrate roughly 109 callers atomically. The live primitive remains `public async appendAuthorized` at `append-only-ledger.ts:349`, while the gateway is only documented as a default-deny boundary. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:128-165] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:349] **Recommendation:** keep this in the 036 epic's 024/014 gate: implement the capability/private primitive in `runtime/lib/authorized-ledger/append-only-ledger.ts`, route callers through the gateway, and preserve the append-only evidence contract. **Closure evidence:** a red-before/green-after stale-writer test, a negative test proving no direct or cast-reachable append path, a clean typecheck plus concurrent-write suite, and an independently code-verified 014 certificate.

2. **P0 / cutover prerequisite — F001 identity resolution is optional at the gateway seam.** The gateway invokes identity checking only when `identityResolver` is truthy and `#checkIdentity` returns without an opinion when no resolver is configured; the type is optional, and the unit contract explicitly describes no resolver as fail-open behavior. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:726-783] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:335] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:419-452] **Recommendation:** in the 036 epic's pre-014 work, make production gateway construction require an owner-approved resolver (including the concrete construction sites such as `runtime/lib/branch-leases-waves/durable-orchestrator.ts:277`), while retaining an explicitly marked fixture-only bypass if the test harness needs one. **Closure evidence:** production construction fails closed without a resolver, resolver output pins the selected actor/capability/evidence identity, mismatches and resolver exceptions deny, and negative tests prove a caller cannot supply an unverified identity.

3. **P0 / concurrency prerequisite — F005's fresh-lock partial-record window remains open.** Fresh acquisition creates the target with `openSync(lockPath, 'wx')` and only then writes JSON; readers parse the target and collapse any parse failure to `null`. The separate temp-file atomic writer does not remove the fresh-create path's window. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:57-61] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:215-245] **Recommendation:** keep F005 in the 036 pre-014 gate and change the fresh acquisition protocol in `runtime/lib/deep-loop/loop-lock.ts` to preserve exclusive claim semantics while publishing a complete record atomically (for example, an exclusive claim inode followed by a validated publication protocol); do not weaken stale-reclaim ownership. **Closure evidence:** a concurrent acquisition/read stress test observes no malformed or transiently absent holder, exactly one winner is recorded, stale reclaim remains single-winner, and the result is included in the 014 cutover certificate.

4. **P1 / operational but not control-plane blocking — the coverage-graph database has a native ABI mismatch.** The packet records repeated `better-sqlite3 ERR_DLOPEN_FAILED` failures with `NODE_MODULE_VERSION 127 vs 141`, so graph convergence/upsert is skipped and treated as absent. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5] **Recommendation:** handle this in a follow-up tooling/runtime packet, not as a prerequisite for adapter correctness: either rebuild `better-sqlite3` under the Node 25 ABI or run the graph-projection runtime under Node 22 (ABI 127), then pin that choice in the toolchain/lockfile. **Closure evidence:** `require('better-sqlite3')` loads under the declared runtime, coverage-graph convergence and upsert complete without `ERR_DLOPEN_FAILED`, and the graph-off fixture still passes so the database remains optional telemetry rather than a parity gate. [INFERENCE: based on the recorded ABI pair and the existing graph-off fallback contract]

5. **P1 / governance dependency — canonical ownership records for 034 and 036-046 are missing.** The parent specification says every phase is an independently executable child and its map jumps from 032 to 047, listing 047-050 but no 034 or 036-046 entries; direct packet inventory likewise contains 035 and 047-050 but no folders for 034 or 036-046. The phase transition rules require independent validation and an integrated recursive validation, so the omission prevents an honest completion/ownership claim. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:207-255] [INFERENCE: based on the direct directory inventory of specs/system-deep-loop/036-deep-loop-innovation, where 034 and 036-046 are absent while 035 and 047-050 are present] **Recommendation:** keep an owner-approved manifest, merge record, or explicit deprecation record in the 036 epic before closeout; for each number record owner, status, source packet, superseding phase, and validation evidence, with intentional omissions made explicit. **Closure evidence:** every ID in 034 and 036-046 is accounted for exactly once, each status links to a real child or signed merge/deprecation record, and `validate.sh --recursive` reports no orphan or duplicate phase.

6. **P1 / implementation gap — graph-engineering-master supplies a packaged skill, not a local runnable implementation.** Its README identifies `graph-engineering/` as a skill and `dist/graph-engineering.skill` as the package, while the packet's `graph-engineering/` source directory is empty. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-38] [INFERENCE: based on the direct empty-directory inventory of specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/] **Recommendation:** put the first graph adapter and its typed state/node/edge, admission, fan-out/fan-in, and shadow-parity tests in a follow-up 037 implementation packet under the system-deep-loop runtime (alongside `runtime/scripts/convergence.cjs`, `fanout-run.cjs`, and `upsert.cjs`), or explicitly record GraphARC as the reference-only dependency; do not treat the packaged skill as executable code. **Closure evidence:** a real source module and tests exist, the DB-independent research-mode fixture runs through the adapter, and no graph adapter can bypass the gateway or become authoritative before 024/014 gates pass.

7. **P2 / research-source gap — `LangChain.md` is URL-only, not a usable local source snapshot.** The packet file contains only the LangChain URL and no captured API or persistence content. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/LangChain.md:1] **Recommendation:** in the follow-up 037 research/implementation packet, pin and summarize the official LangGraph graph API and persistence boundary with retrieval date/checksum, then map only the needed primitives to the adapter; do not introduce a LangChain runtime dependency solely to fill this corpus gap. **Closure evidence:** the packet has a reviewed, versioned source snapshot with provenance, claims are mapped to adapter tests, and the evidence-ledger remains a separate authority/audit plane.

8. **Dependency order and packet split.** The supported order is: (a) owner-approved 034/036-046 accounting so the 036 status surface is trustworthy; (b) 024 fencing plus F001 and F005 because they are pre-014 authority/concurrency gates; (c) independently execute the research-mode fixture/replay and shadow-parity oracle; (d) build the graph adapter and guarded graph routing in a follow-up 037 packet; (e) restore the optional database projection and source-corpus documentation. This order preserves the documented additive-dark, shadow-parity, staged cutover, and rollback sequence rather than making graph topology authoritative prematurely. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:128-165] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:250-254] [INFERENCE: dependency ranking from the blast radius of the mutation, identity, locking, fixture, adapter, and projection gaps]

### Recommendation ownership

| Rank | Gap/work | Owner surface | Why this order | Packet |
|---|---|---|---|---|
| 1 | 024 gateway-only fencing | `runtime/lib/authorized-ledger/append-only-ledger.ts` plus gateway/callers | Security-critical authoritative mutation surface; ~109-call migration | 036 epic |
| 2 | F001 resolver and F005 lock publication | `runtime/lib/authorized-ledger/*`, `runtime/lib/deep-loop/loop-lock.ts` | Required to make 014 identity and concurrency claims true | 036 epic |
| 3 | 034/036-046 manifest | 036 parent spec/handover/phase manifest | Prevents false completion and gives 016 a complete scope | 036 epic |
| 4 | Fixture, independent reducer, graph adapter, guarded routing | New 037 implementation packet under system-deep-loop runtime | Proves graph mapping without changing authority | Follow-up |
| 5 | better-sqlite3 runtime alignment | Toolchain/runtime environment | Projection-only; must not gate graph-off correctness | Follow-up tooling |
| 6 | graph-engineering-master source and LangChain snapshot | 037 context/implementation packet | Raises implementation/research confidence but has no cutover authority | Follow-up |

## Questions Answered
- **Q1:** The residual status is now ranked: the authority cutover is blocked by 024 fencing and the F001/F005 preconditions; database projection is unavailable but optional; phase accounting and graph reference artifacts are incomplete.
- **Q2:** The 036-owned work is the authority, identity, locking, and phase-accounting substrate plus its independently verified cutover evidence; it is not the place to hide a new graph implementation.
- **Q5:** The graph path should begin as a DB-independent, shadow-only research-mode adapter after the 036 gates, with graph state/routing layered over the existing runtime and ledger authority preserved.

## Questions Remaining
- Execute the deterministic research-mode fixture, independent reducer oracle, malformed-event/partial-success/contradiction cases, and replay/shadow-parity comparison.
- Build and independently verify 024 fencing, production F001 resolver construction, and F005 fresh-lock publication.
- Obtain the owner-approved manifest, merge, or deprecation record for 034 and 036-046.
- Restore a compatible coverage-graph database only for optional projection/enrichment validation.
- Supply a real graph-engineering implementation or explicitly approve a reference-only dependency, and capture a vetted LangGraph source snapshot.

## Edge Cases
- **Contradictory evidence:** ADR-008's historical “Accepted” design narrative conflicts with its correction and live code, which still shows a public unfenced append primitive; the correction and direct source win for current status. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:349]
- **Missing dependencies:** the native graph database and executable graph-engineering source are unavailable; static, DB-independent evidence was used and both remain explicit residuals. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5] [INFERENCE: based on the empty graph-engineering directory inventory]
- **Partial success:** the gap inventory and recommendations are complete, but closure evidence is specified rather than executed because this is research-only.

## Sources Consulted
- `specs/system-deep-loop/036-deep-loop-innovation/handover.md:57-61,128-165`
- `specs/system-deep-loop/036-deep-loop-innovation/spec.md:207-255`
- `specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408`
- `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:349`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:523-545,726-783`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:335`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:215-245`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:419-452`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5`
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-38`
- `specs/system-deep-loop/037-graph-engineering/context/LangChain.md:1`

## Assessment
- **New information ratio:** 0.72
- **Questions addressed:** Q1 gap-level status; Q2 036-owned prerequisites and ownership accounting; Q5 module-level graph recommendations and migration boundary.
- **Questions answered:** Q1, Q2, and Q5 at recommendation/closure-criteria level.
- **Fully new vs partially new:** two cross-gap dependency/packet-split conclusions are fully new; six direct residuals consolidate or sharpen evidence established in prior iterations.

## Reflection
- **What worked and why:** Narrow line-level reads of the live gateway, lock implementation, phase map, and packet inventories converted repeated residual prose into module-specific closure checks and exposed the exact contradiction between ADR narrative and runtime code.
- **What did not work and why:** No runtime fix or fixture execution was attempted; the research-only boundary and the unavailable native database prevent claiming behavioral closure.
- **What I would do differently:** The next implementation owner should start with the red-before fixture and independent oracle, then land one 036 gate at a time before adding graph topology or database enrichment.

## Recommended Next Focus
Final closeout should consume an owner-approved phase manifest and the first executable fixture result; if neither exists, report them as blockers rather than reclassifying the documented gaps as resolved.
