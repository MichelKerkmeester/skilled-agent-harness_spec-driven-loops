# Iteration 12: Mode Registry and Graph Policy Compilation

## Focus

This iteration maps `OrganizationGraphPolicyV1`, compiled graph policy, admission manifests, gate kinds, executor capabilities, and graph transition/resource classes onto the real system-deep-loop mode registry and its consumers. The selected interpretation is deliberately narrow: `mode-registry.json` remains the descriptive workflow-routing and maximum-tool-surface catalog. A graph-policy compiler consumes a versioned authorization projection from it, but tenant governance, admission, live capability evidence, approvals, and 036 authorization remain separately owned.

## Findings

1. **The mode registry is a routing/capability ceiling, not a governance policy store — CONFIRM Decision 5 and REFINE iteration 5 finding 6.** The registry defines stable `workflowMode`, explicit `runtimeLoopType`, `backendKind`, packet/command/agent/artifact routing, aliases, and a declared `toolSurface`; its own documentation says aliases are advisor projections and runtime loop type is never inferred from workflow mode. The hub reads the packet mapping while advisor and command surfaces keep drift-guarded projections. Graph policy may consume canonical mode identity and tool ceilings, but tenant rules, role assignments, node/edge policy, gate decisions, authorization verdicts, budget facts, and effects do not belong in this file. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-29] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-53] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:38-50]

2. **Authorization must bind a semantic mode-capability projection, not routing aliases or the raw file alone — EXTEND iteration 5's compiled-policy identity and iteration 11's verified-evidence rule.** The graph compiler should derive `ModeCapabilityProjectionV1` from `resourceContractVersion` plus each canonical mode's `workflowMode`, `runtimeLoopType`, `backendKind`, and closed `toolSurface`. Its canonical digest is normative policy input; the full registry version/digest remains audit provenance. This split means a tool-ceiling or backend change invalidates compiled policy, while a spelling-only advisor alias change cannot silently change authority. The shipped policy registry already hashes evaluator source and captured authorization state, so the compiled projection belongs in that captured state rather than in caller context. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts:68-135] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:197-209] [INFERENCE: projection split isolates authority-relevant fields from routing-only fields explicitly distinguished at mode-registry.json:6-17]

3. **Canonical `workflowMode` is a policy subject only after routing normalization; aliases never carry authority — CONFIRM Decision 5 and EXTEND iteration 10 mutants.** `aliases`, `legacyAliases`, command strings, packet names, agent names, and `legacyAdvisorId` exist to find a mode. The drift guard proves those projections stay synchronized, not that an alias grants permission. Policy compilation accepts only an exact canonical `workflowMode`; a router may translate an input alias before constructing the governed request, but the request, admission manifest, compiled policy, evidence, and 036 decision all bind the canonical value. Renaming an instance cannot evade GraphARC node/edge denial, and the same rule applies to mode aliases. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts:144-205] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:280-297] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:425-474]

4. **Admission manifests own executable kinds; runtime evidence owns actual executor capabilities — REFINE Decisions 3–4 and iteration 11's ownership chain.** Mode `toolSurface.allowed` is a platform-declared upper bound, not proof that a selected executor actually exposes or may use a tool. Node kinds, edge kinds, declared reads/writes, transition/resource classes, and required gate kinds belong in the sealed admission/materialization manifests and versioned governance catalogs. At execution, trusted capability resolution supplies the concrete executor/model/tool availability as graph evidence. Effective permission is the intersection of platform capability, mode ceiling, sealed admission, organization policy, verified actor capability, and current 036 authorization; any missing component denies. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:37-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:258-262] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:168-188]

5. **DENY→ASK→ALLOW compilation preserves source provenance and turns ASK into a gate requirement, never an authorization verdict — CONFIRM Decision 5 and iterations 6–7.** GraphARC validates closed immutable policy documents, evaluates all DENY before ASK before ALLOW, chooses first source-order match within the winning tier, and defaults unmatched requests to deny. Its local compiled permission/node/edge objects intentionally lose audit records and approver roles. `CompiledOrganizationGraphPolicyV1` must therefore retain source/compiled digests, rule IDs/order, tenant/role predicates, canonical subjects, gate kind/approver role for ASK, fixed precedence contract, and mode-capability projection digest. DENY becomes an authority-zero refusal; ASK opens a durable gate and requires fresh reevaluation; only 036 returns allow/deny and emits a durable decision audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:19-29] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:71-118] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:15-30]

6. **Tenant and role scope is organization-owned and runtime-verified, never inferred from mode or agent labels — CONFIRM iteration 5 finding 4 and iteration 6.** GraphARC accepts tenant and context as caller inputs, and its approval router is process-locally bound to one tenant and a role-to-handler map. These are descriptive/request values, not authenticated identity. The organization policy names valid tenant namespaces, required caller roles, approver roles, and gate kinds; the gateway evidence resolver independently binds principal, tenant, roles, capability, policy, and exact consequence. `mode.agent`, packet folder, an alias containing “council,” or a tool-surface entry cannot satisfy a role or gate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:55-69] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:70-105] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:107-140]

7. **Migration requires explicit canonical-ID stability, versioned projections, and negative drift gates — EXTEND Decision 8 and iteration 10's promotion contract.** The current registry carries independent file version `2.0.0.1` and `resourceContractVersion: 1`; generated advisor projections are hash-checked and command contracts record exact source SHAs. Graph integration should add a top-level `graph-policy-projection` extension declaration and an external compiler, not reinterpret existing fields. A canonical mode rename is a breaking policy-subject migration requiring a new projection contract, explicit old→new routing-only migration, policy recompilation, dark parity, and mode-scoped 036 cutover. Stored events and decisions retain old canonical IDs; readers never alias them. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-27] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts:159-189] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts:64-84]

## Ownership Matrix

| Concern / field | Owner | Stored/bound form | Explicitly not authority |
|---|---|---|---|
| Canonical mode identity | Mode registry | `workflowMode` in `ModeCapabilityProjectionV1` | Alias, command, packet, agent, legacy advisor ID |
| Backend topology | Mode registry | explicit `runtimeLoopType` and `backendKind` | Inference from mode spelling |
| Maximum tool surface | Mode registry | allowed/forbidden/mutates/allowlist projection | Permission for one actor/request |
| Actual executor/model/tools | Trusted runtime capability resolver | current evidence reference/digest | Static registry declaration or self-report |
| Node kinds, costs, bodies | Node registry + sealed admission/materialization | registry/artifact/admission digest | Node instance name |
| Edge and transition classes | Versioned graph governance catalog + seal | canonical class IDs and catalog digest | Route prose or edge instance labels |
| Protected resource classes | Versioned resource catalog | canonical resource ID/class/version | Filesystem spelling or alias |
| Tenant and caller roles | Organization identity/policy | verified tenant/principal/role evidence | `mode.agent`, packet, or caller context |
| DENY/ASK/ALLOW rules | `OrganizationGraphPolicyV1` | source rule IDs/order/digest | Mode registry metadata |
| Compiled evaluator | 036 transition policy registry | numeric version, evaluator/rule/state/digest | GraphARC local decision object |
| ASK gate kind/approver | Policy + gate-kind catalog + gate service | gate kind, role, consequence, decision refs | Tool callback or mode alias |
| Admission outcome | Admission verifier | `GraphAdmissionProofV1` | Registry membership alone |
| Current transition verdict | 036 gateway | durable authorization decision | Policy ALLOW, admission, approval, or alias |

## Proposed Registry Integration

Keep all current mode entries backward compatible. Add only a top-level extension declaration that tells compilers how to derive the authority-relevant projection:

```json
{
  "extensions": {
    "graph-policy-projection": {
      "contractVersion": 1,
      "canonicalModeField": "workflowMode",
      "authorityFields": [
        "workflowMode",
        "runtimeLoopType",
        "backendKind",
        "toolSurface"
      ],
      "routingOnlyFields": [
        "packetKind", "packet", "packetSkillName", "command", "agent",
        "artifactRoot", "aliases", "advisorRouting"
      ]
    }
  }
}
```

The compiler produces:

```ts
interface ModeCapabilityProjectionV1 {
  projection_version: 'mode-capability-projection@1';
  resource_contract_version: number;
  modes: readonly {
    workflow_mode: string;
    runtime_loop_type: 'research' | 'review' | 'council' | null;
    backend_kind: 'runtime-loop-type' | 'alignment-convergence' | 'improvement-host';
    tool_surface: {
      allowed: readonly string[];
      forbidden: readonly string[];
      mutates_workspace: boolean;
      bash_allowlist: readonly string[];
    };
  }[];
  projection_digest: string;
  source_registry_version: string;
  source_registry_digest: string;
}
```

Arrays are canonicalized as contract-defined sets where order has no meaning; mode records sort by canonical `workflow_mode`. The compiled policy captures the full projection and digest as authorization state. Gate kinds, node/edge/transition/resource classes, tenants, roles, budgets, and actual executor capabilities are references to separately versioned artifacts, never new per-mode keys.

[INFERENCE: additive extension follows the existing top-level extension pattern at mode-registry.json:19-27 while preserving its documented discriminators]

## Compilation Flow

1. Parse the mode registry as closed data; reject duplicate canonical modes, unknown backend kinds, invalid loop types, malformed tool surfaces, and ambiguous aliases.
2. Canonicalize `ModeCapabilityProjectionV1`; record both projection and full source registry digests.
3. Load versioned node, transition, protected-resource, and gate-kind catalogs. Reject missing/unknown IDs; do not resolve them through mode aliases.
4. Parse `OrganizationGraphPolicyV1`; validate unique rule IDs, declared tenants/roles, explicit resource class, canonical workflow modes, and ASK rules with one valid `gate_kind_id` and approver role.
5. Resolve every rule subject against the mode projection and relevant catalog. An ALLOW outside `toolSurface.allowed`, inside `forbidden`, or absent from platform capabilities is a compile error, not a widening.
6. Compile immutable rules under fixed `deny→ask→allow/source-order@1`, preserving source rule digest, tenant/role predicates, reason code, gate metadata, and catalog identities.
7. Register the exact numeric compiled version with 036, capturing the compiled rules and all normative projections/catalogs in authorization state so evaluator-source equality cannot hide changed permissions.
8. At admission, bind canonical mode, node/edge/transition/resource classes, compiled policy digest, seal, and required gate kinds into `GraphAdmissionProofV1`.
9. At runtime, resolve current executor capabilities and authenticated tenant/principal/roles; verify evidence and current registry/policy/catalog digests. DENY refuses; ASK holds and opens a durable gate; ALLOW proceeds only to 036 evaluation.
10. 036 authorizes the exact event against current head/epoch/identity/evidence. The fenced append—not compilation, admission, or gate—commits state.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts:75-135] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts:141-198] [INFERENCE: steps 8-10 compose iterations 3, 6, and 11]

## Trust Boundaries

- **Routing boundary:** may normalize an input alias to exactly one canonical workflow mode; it produces no permission.
- **Registry boundary:** declares stable mode/backend identity and maximum tools; it does not know tenants, actors, gate decisions, current executors, or authority epochs.
- **Compiler boundary:** rejects unknown subjects and emits immutable policy plus provenance; it cannot authorize current state.
- **Admission boundary:** proves the sealed graph uses known canonical subjects and required gates within declared ceilings; it cannot mint authority.
- **Identity/capability boundary:** independently authenticates tenant, principal, roles, and current executor/tool support; caller strings and registry labels are not evidence.
- **Gate boundary:** authenticates one human/quorum decision for one exact ASK consequence; gate kind and role are policy/catalog facts, not mode aliases.
- **036 boundary:** owns the current allow/deny decision and durable audit.
- **Append/effect boundaries:** own mutation and external consequence under current fence/effect authorization.

## Alias and Rename Mutants

| Mutant | Earliest owner | Expected result |
|---|---|---|
| Rename denied node instance while retaining denied kind | Admission policy | `node_denied`; no admission proof |
| Name denied kind after an allowed kind | Admission policy | deny by resolved kind, not instance label |
| Submit `/deep:research`, `deep-research`, or packet name as policy mode | Policy compiler | non-canonical-mode refusal |
| Add alias collision across two modes | Registry validator/drift gate | registry invalid; no projection |
| Change alias target but keep compiled policy | Router parity/drift gate | divergence blocks promotion; authority unchanged |
| Rename canonical `workflowMode` without policy migration | Policy compiler/deployment | unknown old/new subject; recompile required |
| Broaden `toolSurface.allowed` and reuse old projection digest | Evidence/policy verifier | stale projection refusal |
| Policy ALLOW names a tool absent from mode ceiling | Policy compiler | impossible/widening rule error |
| Executor self-reports a tool absent from trusted resolver | Capability resolver | unverified capability denial |
| Rename approver role or gate kind through an alias | Policy/gate catalog | unknown role/kind; no gate decision |
| Use `mode.agent` as authenticated principal or role | Identity resolver | identity mismatch/deny |
| Register an event-type alias for renamed mode history | Event registry | alias-forbidden failure; old bytes remain old |

The runtime event registry already rejects aliased event registrations, providing the correct persisted-history precedent: routing compatibility may normalize before event creation, but stored policy/event identity never changes by alias. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts:403-411]

## Compatibility and Migration

- Preserve existing registry fields and consumers; the new extension only declares a projection contract consumed by graph-policy tooling.
- Treat `version` as source-file release identity, `resourceContractVersion` as registry-shape compatibility, and projection contract version as authority-semantics compatibility. None substitutes for the canonical digest.
- Alias additions/removals update routing projections and drift tests but do not rewrite compiled policy or stored authorization history.
- Tool-surface, backend, or canonical workflow-mode changes produce a new projection digest and invalidate dependent admission/policy artifacts until recompiled and reverified.
- Canonical mode renames require an explicit routing compatibility map, dual-read/shadow comparison, newly compiled policy, new admission artifacts, and a separate 036 cutover. Never make old authorization events decode as the new mode.
- Unknown future projection/catalog versions fail closed. Upcasters may translate syntax only; they cannot invent tenant, role, gate, capability, admission, or authorization evidence.
- Generated advisor maps, command contracts, registry projections, and compiled policy each carry their own digest and drift gate. A green routing drift guard is necessary but not sufficient policy evidence.

## Non-Applicability

- Do not invoke organization graph policy for pure local computation with one owner, no protected resource, no tenant/role distinction, and no durable consequence.
- Do not add graph node kinds, costs, body identities, transitions, resources, tenants, roles, gate instances, budgets, or executor observations to `mode-registry.json`.
- Do not treat `toolSurface.mutatesWorkspace`, an allowed tool name, backend kind, agent name, command, packet path, or advisor alias as a capability grant.
- Do not compile a separate graph evaluator when one small 036 transition policy can express the rule without provenance loss; capture the mode projection directly in that registered policy.
- Do not use policy compilation to reserve budget, approve ASK, mint admission proof, select authority, acquire a fence, or authorize an effect.
- Do not use routing aliases in persisted event, policy, admission, gate, or authorization identity.

## Ruled Out

- Putting tenant policy, role assignments, gate outcomes, or authorization verdicts in mode-registry metadata.
- Matching policy against aliases, command names, packets, agents, or instance names.
- Treating registry tool surfaces or current executor self-reports as request authority.
- Allowing organization policy to widen a mode/platform ceiling.
- Lowering ASK to ALLOW after a callback without durable gate evidence and fresh 036 reevaluation.
- Reusing compiled policy after authority-relevant registry projection drift.
- Rewriting historical canonical modes through alias-aware readers.

## Dead Ends

The initial guessed `grapharc/planner/policy.py` path was absent. Repository evidence located the actual split implementation under `grapharc/policy/{document,engine,approvals,audit}.py`; the stale monolithic path should not be retried.

## Edge Cases

- Ambiguous input: “executor capabilities” could mean declared mode tools or current executor availability. The design separates the registry ceiling from trusted current capability evidence; both are required for an effective allow.
- Contradictory evidence: the mode registry calls itself a single source of truth, while advisor and commands keep hardcoded projections. This is resolved within its own contract: it is the declarative source, and generated/static consumers are permitted only behind digest/drift equality, not independent authority. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:5-17] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts:159-189]
- Missing dependencies: the guessed monolithic policy file was missing; the actual split sources were found and fully supported the analysis.
- Partial success: none; the source failure was recovered without narrowing the requested scope.

## Sources Consulted

- `.opencode/skills/system-deep-loop/mode-registry.json`
- `.opencode/skills/system-deep-loop/SKILL.md`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/{document,engine,approvals,audit}.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_policy_engine.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py`
- Graph-arch lineage iterations 3–11

## Assessment

- New information ratio: 0.71
- Calculation: 3 fully new findings (semantic projection split, field ownership, migration contract) and 4 partially new mappings (registry non-authority, alias boundary, compilation flow, tenant/role separation): `(3 + 0.5 × 4) / 7 = 0.714`, rounded to `0.71`.
- Questions addressed: How do mode registration, policy, admission, gate kinds, executor capabilities, resource classes, and authorization relate without alias-based authority?
- Questions answered: Field ownership, projection schema, compilation/evaluation flow, tenant/role scope, alias/rename behavior, audit provenance, compatibility, mutants, and non-applicability are decided at design level.

## Reflection

- What worked and why: Comparing the registry's documented routing-only alias contract with GraphARC's kind-based rename tests exposed the shared canonical-identity rule, while 036 captured-state hashing supplied a concrete integration point.
- What did not work and why: The first source guess assumed one planner policy module; GraphARC splits policy document, compilation/evaluation, approval, and audit into separate modules.
- What I would do differently: Start future runtime mappings with `rg --files` for the named subsystem, then trace one canonical ID through producers, projections, and authoritative consumers.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `12/12`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Cross-cutting runtime mapping — locks and fencing. Map graph run/task/node ownership, canonical resource identities, multi-resource ordering, leases, epochs, stale-worker exclusion, recovery, approval/budget coordination, and mutants onto the 036 locking substrate without allowing registry aliases, policy ALLOW, or a lease to become authorization.
