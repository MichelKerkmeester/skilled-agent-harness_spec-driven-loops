# Iteration 13: Stable Organization Graph

## Focus

The orientation distinguishes durable organizational structure from per-run topology. This pass defines the former as governance, not scheduler state.

## Findings

1. The corpus separates a stable org graph (“who”) from an ephemeral work graph (“what, right now”); the org graph carries roles, zone ownership, memory, and stable handoffs. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170]
2. Decision: `OrganizationGraphV1` is a versioned deployment artifact whose nodes are role/capability identities, not running agents. It declares capability ids/versions, allowed tools and data zones, trust class, budget ceiling, isolation requirement, owner/escalation principal, and accepted input/output contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:227-235]
3. Its edges are permitted handoff/control relationships with schema, classification ceiling, required evidence, and escalation policy. They authorize possible work-graph edges but do not schedule anything by themselves. [INFERENCE: prevents the stable policy graph from becoming mutable run state]
4. The current mode registry is a proto-organization graph: it already binds modes to owners, definitions, backends, and runtime capabilities. Its next representation should be compiled into the org graph, not copied into another competing registry. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-200]
5. Every organization-graph release is content-addressed and reviewed through 036; a run pins one version. Mid-run policy changes create an explicit reauthorization/migration event rather than silently changing authority. [INFERENCE: stable version pinning makes replay and audit meaningful]
6. When not to use: do not create long-lived agent personas for one-off bounded tasks, and do not store conversational memory merely because a role is stable. Persist only governed domain state with provenance and retention policy. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:193-231]

## Ruled Out

- Org graph as live scheduler; per-run mutation of role policy; persona sprawl.

## Assessment

- New information ratio: 0.76
- Novelty: defines the org graph as a deployable capability and handoff policy boundary.
- Questions addressed/answered: q-org-work stable layer.

## Recommended Next Focus

Define constrained generation, validation, authorization, and evolution of per-run work graphs.
