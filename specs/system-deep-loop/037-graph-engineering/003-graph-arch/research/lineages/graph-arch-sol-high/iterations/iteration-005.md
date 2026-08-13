# Iteration 5: Organization Policy Compiler and Provenance

## Focus

This iteration specified `OrganizationGraphPolicyV1` and a provenance-preserving `CompiledOrganizationPolicyV1` for tool, node, edge, and spend decisions. It resolved GraphARC's lossy adapter seam, fixed the exact precedence and request-binding rules, mapped policy evaluation into the 036 durable decision ledger, and defined mode-registry as a referenced identity/capability source rather than a tenant-policy store.

## Findings

1. **The source document is a stable organization-governance input, not an authorization decision — CONFIRM Decision 7 and EXTEND its organization-policy schema.** GraphARC already provides the right source primitives: immutable rules over `tool|node|edge|spend`, closed `deny|ask|allow` effects, tenant patterns, explicit approver roles for ASK, spend thresholds/bases, unique rule IDs, author version, parsed-document digest, and ordered rules. For system-deep-loop, `OrganizationGraphPolicyV1` should require default deny, stable policy identity, full rule order, organization-graph and mode-registry references, and a canonical digest; author version remains a label while digest is evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:57-138] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:141-216] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-001.md:13]

2. **Precedence is effect-tier then source order, with no automatic specificity ranking — REFINE Decision 7 and CONFIRM GraphARC's deterministic semantics.** Evaluation first filters by resource, verified tenant, canonical subject, and spend threshold; it then evaluates every DENY tier before ASK before ALLOW, and chooses the first matching rule in document order within the winning tier. A tenant-specific or narrower pattern never overrides a broader deny. “Specificity” is therefore author-controlled source order, not wildcard-count sorting; compilation must preserve `source_order` exactly and a linter should report shadowed overlaps rather than silently reorder them. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:19-29] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:316-385] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_policy_engine.py:335-375]

3. **Compiled policy must preserve every causal field the bare adapters lose — EXTEND Decision 7 and Decision 1's sealed-artifact boundary.** GraphARC's tool, node, and edge adapters preserve decision parity and some reason text, but their target interfaces return bare decisions and omit rule ID, approver role, policy digest/version, and audit linkage. `CompiledOrganizationPolicyV1` must retain the complete normalized source rule, source order, matcher form, tenant scope, role, reason code, source and compiler digests, and resource index; each evaluation returns both the decisive rule and all matched/considered rule IDs. The compiled digest is then sealed into `SealedCompiledGraphV1`, while current deployment resolution still checks it at execution. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:193-299] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_policy_engine.py:731-756] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-004.md:9]

4. **Tenant, caller, and role values need independent identity binding — REFINE Decision 4 and iteration 3's gateway verification order.** GraphARC accepts tenant and context as call arguments; `PolicyDecision.context` is explicitly caller-supplied, and a tenant-bound approval router supplies its own tenant. These values are useful audit dimensions but not verified identity. The 036 adapter must evaluate only a gateway-resolved organization tenant, principal, role set, capability, mode, evidence digest, and exact request/event digest; any unresolved or mismatched binding denies, and the record states which fields were positively verified. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:55-69] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:125-173] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:319-352]

5. **The 036 authorization ledger, not GraphARC policy JSONL, is the canonical decision/audit mapping — CONFIRM Decision 4 and Graphene P2/P3; REFINE the local audit role.** GraphARC's engine records source rule, tenant, effect, policy version/digest, request, and context, but compiled adapters can decide without invoking the engine, and an audit log without a file path can lose capped entries. The 036 mapping must write `policy_id`, numeric compiled version, source/compiled digests, evaluator version, decisive and matched rule IDs, reason code, verified identities, request/event digests, authority epoch, and prior head/state into one durable authorization decision; audit storage failure denies and no allow proof exists. GraphARC-style policy audit becomes a projection/debug record only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:10-30] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/audit.py:41-68] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:197-209] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-625]

6. **Mode registry contributes stable mode/tool-surface identity but owns no tenant policy — EXTEND Decision 7's runtime integration and CONFIRM its non-authority rule.** `mode-registry.json` is the source of stable `workflowMode`, backend, command, agent, artifact root, and allowed tool surface. The organization-policy compiler should bind its registry version/digest, validate referenced modes and tool subjects, and compute effective permission as the intersection of platform/mode limits and organization policy; organization policy may narrow but never grant a tool absent from the mode surface. Tenant rules, approver assignments, and authorization verdicts do not belong in the mode registry. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-29] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-53] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:108-157]

7. **ASK is a durable gate request, never a third 036 authorization verdict — REFINE Decisions 3 and 4 and EXTEND Graphene P7.** GraphARC correctly requires ASK rules to name an approver role and fails closed for missing handlers, handler exceptions, malformed roles, and DENY decisions. But its approval callback returns a process-local Boolean. The compiler must emit `approval_required` with exact rule/policy/request/consequence identity; a durable human-gate protocol then opens, decides, and revalidates that dependency vector. Only the subsequent 036 reevaluation returns allow or deny, and any unknown rule, digest mismatch, evaluator timeout/exception, undeclared tenant, malformed request, or audit append failure denies with zero domain, budget, projection, or effect mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:89-118] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:88-140] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:753-775] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-001.md:17]

## Source Schema

```ts
interface OrganizationGraphPolicyV1 {
  schema_version: 'organization-graph-policy@1';
  policy_id: string;
  source_version: string;
  name: string;
  description: string;
  default: 'deny';
  organization_graph: {
    organization_id: string;
    organization_graph_digest: string;
  };
  mode_registry: {
    resource_contract_version: number;
    registry_version: string;
    registry_digest: string;
  };
  tenants: readonly {
    tenant_id: string;
    principal_namespace: string;
    enabled: boolean;
  }[];
  rules: readonly {
    rule_id: string;
    source_order: number;
    resource: 'tool' | 'node' | 'edge' | 'spend';
    effect: 'deny' | 'ask' | 'allow';
    subject_match:
      | { kind: 'glob'; pattern: string }
      | { kind: 'edge'; source_pattern: string; target_pattern: string };
    tenant_pattern: string;
    required_caller_roles: readonly string[];
    approver_role: string | null;
    reason_code: string;
    reason: string;
    spend?: {
      over_minor_units: number | null;
      currency: string;
      basis: 'request' | 'authorized_lifetime';
    };
  }[];
  canonical_digest: string;
}
```

Rules are immutable and extra fields fail validation. ASK requires exactly one non-empty `approver_role`; non-ASK forbids it. Spend fields are forbidden on other resources. Edge matchers must have separately parsed source and target patterns. Rule IDs and tenant IDs are unique. Floating USD is replaced by integer minor units plus currency, and cumulative spend is renamed `authorized_lifetime` to make the dependency on a canonical committed budget ledger explicit. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:71-138] [INFERENCE: integer currency and canonical lifetime naming close ambiguity in GraphARC's process-local float spend counter]

## Compiled Schema

```ts
interface CompiledOrganizationPolicyV1 {
  artifact_version: 'compiled-organization-policy@1';
  artifact_id: string;
  source: {
    policy_id: string;
    source_version: string;
    source_digest: string;
    organization_graph_digest: string;
    mode_registry_version: string;
    mode_registry_digest: string;
  };
  compiler: {
    compiler_version: string;
    compiler_digest: string;
    matcher_contract_version: string;
    precedence_contract: 'resource-tenant-subject-threshold/deny-ask-allow/source-order@1';
  };
  compiled_policy_version: number;
  default: 'deny';
  rule_ids: readonly string[];
  rules: readonly {
    rule_id: string;
    source_order: number;
    resource: 'tool' | 'node' | 'edge' | 'spend';
    effect: 'deny' | 'ask' | 'allow';
    canonical_matcher: unknown;
    tenant_pattern: string;
    required_caller_roles: readonly string[];
    approver_role: string | null;
    reason_code: string;
    reason_digest: string;
    source_rule_digest: string;
  }[];
  indexes: {
    by_resource_and_tier_digest: string;
    known_mode_ids_digest: string;
    effective_tool_ceiling_digest: string;
  };
  evaluation_input_schema_digest: string;
  compiled_digest: string;
  issuer: {
    compiler_id: string;
    build_id: string;
    key_id: string;
    attestation: string;
  };
}
```

The artifact retains source rules rather than lowering them to bare decision enums. Its numeric `compiled_policy_version` satisfies the existing 036 registry contract while `source_version` remains the author's opaque label. It contains no current actor, tenant assertion, approval outcome, authority epoch, budget balance, allow proof, or effect receipt. [INFERENCE: schema preserves GraphARC fields lost at specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:193-299 and fits the transition policy contract at .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:197-209]

## Precedence Algorithm

1. Validate the closed request and canonicalize the resource subject: tool name, registry node kind, separately parsed edge source/target kinds, or spend category plus integer amount/currency.
2. Resolve mode, tenant, principal, caller roles, capability, authority epoch, request/event digest, and evidence through trusted runtime providers; caller strings alone are never verified.
3. Select rules for the exact resource. Reject cross-resource leakage.
4. Retain rules whose tenant pattern matches the verified tenant and whose required caller roles are satisfied.
5. Match the canonical subject; for spend, resolve the current authorized-lifetime head and apply threshold/basis.
6. Evaluate matching rules by fixed effect tier `deny → ask → allow`.
7. Within the first non-empty tier, choose the lowest `source_order`; do not compute pattern specificity. Record every considered/matched rule ID and the decisive rule ID.
8. If none match, return default deny. ASK returns `approval_required`, not allow.
9. Return a closed evaluation result bound to source/compiled digests and exact request digest; the 036 gateway normalizes any malformed output, unknown rule, ambiguity, exception, or timeout to deny.

[INFERENCE: steps 3-8 preserve GraphARC's engine loop at specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:316-385 while steps 1-2 and 9 add the 036 identity boundary]

## Audit and 036 Decision Mapping

| Organization-policy fact | 036 destination |
|---|---|
| `policy_id`, `compiled_policy_version`, `compiled_digest` | `TransitionPolicyDefinition` identity and decision `policy_id/version/digest`. |
| `compiler_version`, matcher/precedence contract | `evaluator_version` plus compiled digest. |
| Decisive rule and all matched rules | `matched_rule_ids`; decisive rule is first and also drives `reason_code`. |
| Verified tenant/principal/roles/capability | Gateway evaluation input and explicit verified identity fields; tenant/roles extend the resolver contract rather than hiding in caller context. |
| Exact tool/node/edge/spend request | Canonical requested event digest plus authorization request digest and evidence digest. |
| ASK rule and approver role | `approval_required` refusal/gate-open event; no allow proof until a new evaluation verifies durable approval evidence. |
| DENY/ALLOW result | Closed gateway deny/allow, durably appended to the non-domain authorization audit before any domain append. |
| GraphARC policy JSONL | Optional derived projection linked to the 036 decision/audit receipt; never canonical authority. |

The durable record must also retain prior head/state, authority epoch, event-registry digest, decision time/expiry, request correlation/causation, and audit receipt. A reader can then prove exactly which source rule, compiler artifact, request, identity, and live authority state produced the decision. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:234-315] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:485-531]

## Mode-Registry Integration

- Treat `workflowMode` as the stable mode subject and bind the full registry version/digest into compilation; never infer `runtimeLoopType` from it. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:3-17]
- Validate every policy mode reference and tool pattern against the registry/capability catalog. Unknown subjects are compile errors, not silently dead rules.
- Compute effective tools as `mode.toolSurface.allowed ∩ platform capabilities ∩ organization-policy allow`, then subtract any deny and convert ASK to a gate requirement. Policy can narrow the mode ceiling but cannot widen it.
- Keep routing aliases, command names, packet paths, and backend selection out of authorization matchers except as descriptive source metadata; stable `workflowMode` is the canonical key.
- Keep tenant lists, roles, approver assignments, policy documents, and decisions outside `mode-registry.json`; reference their digests from compiled policy and deployment configuration.

[INFERENCE: integration distinguishes mode routing identity in .opencode/skills/system-deep-loop/mode-registry.json:30-53 from stable organization ownership described at specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-157]

## Failure Behavior

- Source TOML/schema error, duplicate rule ID, invalid edge pattern, missing ASK role, impossible tenant pattern, non-deny default, or invalid spend amount: compilation fails; the previously active compiled artifact remains unchanged.
- Unknown mode/tool/node/capability reference, unsupported matcher, ambiguous role namespace, compiler exception, digest mismatch, or unattested artifact: deployment/evaluation fails closed.
- Undeclared or unverified tenant/principal/role, malformed request, cross-resource subject, missing budget head, or stale organization/mode/policy digest: return deny or an authority-zero refusal; do not guess a default identity.
- ASK: persist a gate-open request. Missing handler, handler error, denial, timeout, stale decision, or mismatched consequence remains denied.
- 036 unknown policy/rule, malformed evaluator result, evaluator timeout/exception, identity mismatch, stale head/epoch, audit-storage failure, or idempotency conflict: durable deny when storage permits; otherwise deny with no proof.
- No policy evaluation outcome directly mutates domain state, debits budget, emits an authoritative projection, or executes an effect.

[INFERENCE: failure behavior combines GraphARC's validation and fail-closed approval at specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:89-118 and specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:107-135 with gateway denials at .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:753-775]

## When Not to Use

- Do not create organization policy for a single local deterministic transform or harness with one owner, no tenant/role separation, no governed graph edges, and no protected consequence. A direct code allowlist is clearer. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:52-72]
- Do not store organization policy in `mode-registry.json`; that registry describes workflow/runtime routing and tool ceilings, not tenant governance or current authority.
- Do not compile a separate graph-policy evaluator when the existing 036 transition policy can express the same small rule set without loss; register one transition policy and preserve source provenance there.
- Do not use `spend` rules as the canonical budget ledger, reservation, debit, refund, or receipt. They are policy predicates over authoritative budget facts; the budget lifecycle remains a later contract.
- Do not use organization policy to grant capabilities, leases, fences, effects, or authority epochs. It can deny, require approval, or contribute evidence to authorization.
- Do not auto-formalize an organization graph before stable roles, ownership, tool boundaries, and consequence edges have been observed. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-100]

## Ruled Out

- Lowering compiled rules to bare `Decision` values: it reproduces behavior but loses the exact source rule, approver role, policy identity, and audit cause.
- Treating a more specific or tenant-scoped allow as an exception to a broad deny: the fixed tier model deliberately forbids that.
- Accepting caller-provided tenant, role, or context as identity evidence.
- Adding tenant policy, role assignments, or verdicts to mode-registry metadata.
- Treating GraphARC's JSONL policy audit as the canonical 036 decision ledger.

## Dead Ends

None promoted. The policy compiler is now defined; the durable human-gate lifecycle remains the next productive mechanism because ASK deliberately stops before authorization.

## Edge Cases

- Ambiguous input: “rule specificity/order” could imply automatic specificity ranking. The implementation proves there is none; the chosen rule is the first source-ordered match in the winning effect tier. The design preserves this and assigns overlap diagnosis to linting.
- Contradictory evidence: GraphARC states that asking the engine always records a decision, but its compiled tool/node/edge adapters intentionally bypass the engine and therefore do not audit. Resolved by making provenance part of the compiled artifact and making the 036 authorization ledger canonical. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:10-24] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:193-299]
- Missing dependencies: none.
- Partial success: none; policy compilation and mapping are answered, while durable gate and budget lifecycles are intentionally deferred.

## Sources Consulted

- `context/graph-arch/grapharc/policy/{document.py,engine.py,approvals.py,audit.py,example.toml}`
- `context/graph-arch/tests/test_policy_engine.py`
- `.opencode/skills/system-deep-loop/mode-registry.json`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,transition-authorization-gateway.ts}`
- `context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
- `context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md`
- Lineage iterations 1–4 and reducer-owned state.

## Assessment

- New information ratio: 0.86 (5 fully new compiler/mapping decisions and 2 partially new precedence/approval refinements: `(5 + 0.5 × 2) / 7 = 0.857`, rounded).
- Questions addressed: How does organization policy compile without losing source rule or audit provenance?
- Questions answered: Source and compiled schemas, precedence, verified request binding, rule-to-036 audit mapping, mode-registry integration, failure behavior, and when-not-to-use boundaries are decided at design level.
- Questions remaining: Four strategy questions remain open; this resolves the policy-compilation slice of the second question.

## Reflection

- What worked and why: Tracing each source rule through direct evaluation, lossy adapters, approval routing, and the 036 decision schema made provenance loss observable field by field.
- What did not work and why: The reducer's generated next-focus text pointed to iteration 4's mutant finding rather than its explicit recommendation; the dispatch prompt and planned focus sequence were more specific and aligned with the prior narrative.
- What I would do differently: Hold the compiled-policy artifact fixed and model ASK as a durable state machine, including decision races, expiry, reassignment, cancellation, and exact 036 reevaluation evidence.

## Recommended Next Focus

Specify the unified durable human-gate contract: `GraphGateRequestV1`, `GraphGateDecisionV1`, open/claim/decide/timeout/cancel/revalidate states, principal and role binding, sealed consequence identity, policy/authority/budget/resource dependency freshness, single-use semantics, and 036 append/effect integration.

