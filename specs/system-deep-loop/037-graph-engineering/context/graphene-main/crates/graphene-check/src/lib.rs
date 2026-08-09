//! Deterministic plan validation.
//!
//! Every check here is a fact about **declarations** — schemas, bindings,
//! capabilities, bounds. There are no keyword heuristics, no scoring, and no
//! content inspection.
//!
//! A check that is right 70% of the time trains an agent to ignore the checker,
//! which costs more than the 30% it catches. Anything needing judgment —
//! granularity, decomposition quality, whether a gate is in the *right* place —
//! belongs to the review lenses, not here.

pub mod gates;
pub mod schema;

use std::collections::{BTreeMap, BTreeSet, VecDeque};

use graphene_core::budget::{Budget, Dimension};
use graphene_core::fold::State;
use graphene_core::id::NodeId;
use graphene_core::node::{Node, NodeKind};
use serde::{Deserialize, Serialize};

use schema::Type;

/// Which capabilities exist, and which are irreversible.
///
/// Policy, supplied by the caller — Graphene has no opinion about what
/// `send_email` means, only that a node claiming it must have a human node on
/// every path to it.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Capabilities {
    pub registered: BTreeSet<String>,
    pub gated: BTreeSet<String>,
}

impl Default for Capabilities {
    fn default() -> Self {
        let gated: BTreeSet<String> = [
            "send_email",
            "post_message",
            "write_crm",
            "write_database",
            "grant_access",
            "publish_view",
            "delete",
            "spend_above",
        ]
        .iter()
        .map(|s| s.to_string())
        .collect();

        let mut registered: BTreeSet<String> =
            ["agent", "function", "retrieval", "human", "review", "merge", "read", "query"]
                .iter()
                .map(|s| s.to_string())
                .collect();
        registered.extend(gated.iter().cloned());

        Capabilities { registered, gated }
    }
}

/// The capabilities Graphene ships knowing about. Registration is additive on
/// top of these; nothing removes them.
pub const BUILT_IN_GATED: [&str; 8] = [
    "send_email",
    "post_message",
    "write_crm",
    "write_database",
    "grant_access",
    "publish_view",
    "delete",
    "spend_above",
];

/// The declarable half: what a workspace adds to the built-in set.
///
/// A deployment has capabilities Graphene cannot know — `read_zendesk`,
/// `query_warehouse`. Without a way to declare them, C1 rejects every real
/// plan, so the set is data rather than code.
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct CapabilityRegistry {
    #[serde(default)]
    pub registered: BTreeSet<String>,
    #[serde(default)]
    pub gated: BTreeSet<String>,
}

impl CapabilityRegistry {
    /// Fold a workspace's declarations onto the built-in set.
    ///
    /// **Gating is one-way.** A registry may gate more, never less — otherwise
    /// registering `send_email` as ungated would be a supported way to remove
    /// every gate in front of it, which is the one thing C2 exists to prevent.
    pub fn resolve(&self) -> Capabilities {
        let mut caps = Capabilities::default();
        caps.registered.extend(self.registered.iter().cloned());
        caps.registered.extend(self.gated.iter().cloned());
        caps.gated.extend(self.gated.iter().cloned());
        caps
    }

    /// Names this registry declares that the built-in set already gates. Kept
    /// so `gr capabilities` can say the gate is not negotiable rather than
    /// silently ignoring the declaration.
    pub fn redundant_gates(&self) -> Vec<String> {
        BUILT_IN_GATED
            .iter()
            .filter(|b| self.registered.contains(**b) && !self.gated.contains(**b))
            .map(|b| b.to_string())
            .collect()
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Code {
    Cycle,
    UnresolvedNeed,
    DuplicateName,
    OrphanNode,
    UnboundInput,
    BadSelectPath,
    TypeMismatch,
    FakeEdge,
    UnsupportedSchema,
    UnknownCapability,
    UngatedCapability,
    HumanNodeCapability,
    MergeWithoutFanIn,
    FanInWithoutMerge,
    TooManyNodes,
    TooDeep,
    ForEachUnbounded,
    ForEachBindingNotIndexed,
    LoopUnbounded,
    BudgetOverflow,
    ConcurrencyOverflow,
    MissingOutputSchema,
    MissingIdempotency,
    UntypedEdge,
    MissingTimeoutPolicy,
    UngatedChoice,
    MultipleWriters,
    ReadWriteConflict,
}

impl Code {
    pub fn as_str(&self) -> &'static str {
        use Code::*;
        match self {
            Cycle => "cycle",
            UnresolvedNeed => "unresolved-need",
            DuplicateName => "duplicate-name",
            OrphanNode => "orphan-node",
            UnboundInput => "unbound-input",
            BadSelectPath => "bad-select-path",
            TypeMismatch => "type-mismatch",
            FakeEdge => "fake-edge",
            UnsupportedSchema => "unsupported-schema",
            UnknownCapability => "unknown-capability",
            UngatedCapability => "ungated-capability",
            HumanNodeCapability => "human-node-capability",
            MergeWithoutFanIn => "merge-without-fan-in",
            FanInWithoutMerge => "fan-in-without-merge",
            TooManyNodes => "too-many-nodes",
            TooDeep => "too-deep",
            ForEachUnbounded => "for-each-unbounded",
            ForEachBindingNotIndexed => "for-each-binding-not-indexed",
            LoopUnbounded => "loop-unbounded",
            BudgetOverflow => "budget-overflow",
            ConcurrencyOverflow => "concurrency-overflow",
            MissingOutputSchema => "missing-output-schema",
            MissingIdempotency => "missing-idempotency",
            UntypedEdge => "untyped-edge",
            MissingTimeoutPolicy => "missing-timeout-policy",
            UngatedChoice => "ungated-choice",
            MultipleWriters => "multiple-writers",
            ReadWriteConflict => "read-write-conflict",
        }
    }
}

/// A finding. `fix_hint` names the mechanical remedy, because the consumer is an
/// agent that will act on it directly.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Finding {
    pub code: Code,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub node: Option<NodeId>,
    pub detail: String,
    pub fix_hint: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub related: Vec<NodeId>,
}

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Report {
    pub ok: bool,
    pub errors: Vec<Finding>,
    pub warnings: Vec<Finding>,
}

impl Report {
    fn error(&mut self, f: Finding) {
        self.errors.push(f);
    }
    fn warn(&mut self, f: Finding) {
        self.warnings.push(f);
    }
    fn finish(mut self) -> Report {
        self.ok = self.errors.is_empty();
        self.errors.sort_by(|a, b| a.code.cmp(&b.code).then(a.detail.cmp(&b.detail)));
        self.warnings.sort_by(|a, b| a.code.cmp(&b.code).then(a.detail.cmp(&b.detail)));
        self
    }
}

pub fn check(state: &State, caps: &Capabilities) -> Report {
    let mut r = Report::default();
    let nodes: Vec<&Node> = state.nodes.values().collect();

    let schemas = parse_schemas(&nodes, &mut r);
    structure(state, &nodes, &schemas, &mut r);
    capabilities(state, &nodes, caps, &mut r);
    bounds(state, &nodes, &mut r);
    determinism(&nodes, state, &mut r);
    concurrency(&nodes, &mut r);

    r.finish()
}

struct NodeSchemas {
    inputs: BTreeMap<NodeId, Type>,
    outputs: BTreeMap<NodeId, Type>,
}

fn parse_schemas(nodes: &[&Node], r: &mut Report) -> NodeSchemas {
    let mut inputs = BTreeMap::new();
    let mut outputs = BTreeMap::new();

    for n in nodes {
        match schema::parse(&n.inputs) {
            Ok(t) => {
                inputs.insert(n.id.clone(), t);
            }
            Err(u) => r.error(Finding {
                code: Code::UnsupportedSchema,
                node: Some(n.id.clone()),
                detail: format!(
                    "`{}` inputs use `{}` at `{}`, which this checker cannot verify",
                    n.name, u.construct, u.at
                ),
                fix_hint:
                    "replace the construct with a concrete `type`, or the binding goes unchecked"
                        .into(),
                related: vec![],
            }),
        }
        match schema::parse(&n.outputs) {
            Ok(t) => {
                outputs.insert(n.id.clone(), t);
            }
            Err(u) => r.error(Finding {
                code: Code::UnsupportedSchema,
                node: Some(n.id.clone()),
                detail: format!(
                    "`{}` outputs use `{}` at `{}`, which this checker cannot verify",
                    n.name, u.construct, u.at
                ),
                fix_hint: "replace the construct with a concrete `type`".into(),
                related: vec![],
            }),
        }
    }
    NodeSchemas { inputs, outputs }
}

fn structure(state: &State, nodes: &[&Node], schemas: &NodeSchemas, r: &mut Report) {
    let known: BTreeSet<NodeId> = nodes.iter().map(|n| n.id.clone()).collect();

    let mut names: BTreeMap<&str, Vec<&Node>> = BTreeMap::new();
    for n in nodes {
        names.entry(n.name.as_str()).or_default().push(n);
    }
    for (name, dupes) in names.iter().filter(|(_, v)| v.len() > 1) {
        r.error(Finding {
            code: Code::DuplicateName,
            node: Some(dupes[0].id.clone()),
            detail: format!("{} nodes are named `{name}`", dupes.len()),
            fix_hint: "node names must be unique within a graph; ids anchor on them".into(),
            related: dupes.iter().map(|n| n.id.clone()).collect(),
        });
    }

    for n in nodes {
        for need in &n.needs {
            if !known.contains(need) {
                r.error(Finding {
                    code: Code::UnresolvedNeed,
                    node: Some(n.id.clone()),
                    detail: format!("`{}` needs `{need}`, which is not in this graph", n.name),
                    fix_hint: "add the node, or drop the dependency".into(),
                    related: vec![],
                });
            }
        }
    }

    if let Some(cycle) = find_cycle(nodes) {
        let names: Vec<String> = cycle
            .iter()
            .filter_map(|id| nodes.iter().find(|n| &n.id == id).map(|n| n.name.clone()))
            .collect();
        r.error(Finding {
            code: Code::Cycle,
            node: cycle.first().cloned(),
            detail: format!("dependency cycle: {}", names.join(" → ")),
            fix_hint: "a plan is a DAG; break the cycle by removing one dependency".into(),
            related: cycle,
        });
        return;
    }

    // A `forEach` parent depends on the children it expanded into. The edge is
    // structural — the parent's output *is* their outputs — so there is no
    // binding to find and it is not a fake edge.
    let expansion_child: BTreeSet<(&NodeId, &NodeId)> =
        nodes.iter().filter_map(|c| c.parent.as_ref().map(|p| (&c.id, p))).collect();
    let is_own_child = |owner: &NodeId, dep: &NodeId| expansion_child.contains(&(dep, owner));

    for n in nodes {
        let fake: Vec<NodeId> =
            n.fake_edges().into_iter().filter(|d| !is_own_child(&n.id, d)).collect();
        for dep in fake {
            let dep_name = nodes
                .iter()
                .find(|c| c.id == dep)
                .map(|c| c.name.clone())
                .unwrap_or_else(|| dep.to_string());
            r.error(Finding {
                code: Code::FakeEdge,
                node: Some(n.id.clone()),
                detail: format!(
                    "`{}` lists `{dep_name}` in needs but no binding reads from it",
                    n.name
                ),
                fix_hint:
                    "bind its output or remove the dependency — these nodes can run in parallel"
                        .into(),
                related: vec![dep],
            });
        }
        for ghost in n.unbound_needs() {
            r.error(Finding {
                code: Code::UnresolvedNeed,
                node: Some(n.id.clone()),
                detail: format!(
                    "`{}` binds from `{ghost}` without declaring the dependency",
                    n.name
                ),
                fix_hint: "add it to `needs`".into(),
                related: vec![ghost],
            });
        }
    }

    for n in nodes {
        let Some(input_ty) = schemas.inputs.get(&n.id) else { continue };

        let mut bound_fields: BTreeSet<&str> = BTreeSet::new();
        for b in &n.bindings {
            bound_fields.insert(b.into.as_str());
            let Some(src_ty) = schemas.outputs.get(&b.from) else { continue };

            match schema::resolve(src_ty, &b.select) {
                Err(e) => r.error(Finding {
                    code: Code::BadSelectPath,
                    node: Some(n.id.clone()),
                    detail: format!(
                        "`{}` selects `{}` from `{}`, which its output schema does not provide ({e:?})",
                        n.name, b.select, b.from
                    ),
                    fix_hint: "correct the path, or widen the source's declared output".into(),
                    related: vec![b.from.clone()],
                }),
                Ok(selected) => {
                    if let Type::Object { properties, .. } = input_ty {
                        if let Some(wanted) = properties.get(&b.into) {
                            if !schema::satisfies(&selected, wanted) {
                                r.error(Finding {
                                    code: Code::TypeMismatch,
                                    node: Some(n.id.clone()),
                                    detail: format!(
                                        "`{}` binds `{}` into `{}`, but the types do not match",
                                        n.name, b.select, b.into
                                    ),
                                    fix_hint: "align the declared schemas".into(),
                                    related: vec![b.from.clone()],
                                });
                            }
                        }
                    }
                }
            }
        }

        if let Some(fe) = &n.for_each {
            if let Some(src_ty) = schemas.outputs.get(&fe.over.from) {
                match schema::resolve(src_ty, &fe.over.select) {
                    Ok(t) if !schema::is_array(&t) => r.error(Finding {
                        code: Code::TypeMismatch,
                        node: Some(n.id.clone()),
                        detail: format!(
                            "`{}` expands over `{}`, which is not an array",
                            n.name, fe.over.select
                        ),
                        fix_hint: "point `forEach.over` at an array".into(),
                        related: vec![fe.over.from.clone()],
                    }),
                    Err(e) => r.error(Finding {
                        code: Code::BadSelectPath,
                        node: Some(n.id.clone()),
                        detail: format!(
                            "`{}` expands over `{}`, which does not resolve ({e:?})",
                            n.name, fe.over.select
                        ),
                        fix_hint: "correct the path".into(),
                        related: vec![fe.over.from.clone()],
                    }),
                    _ => {}
                }
            }
            bound_fields.insert(fe.as_field.as_str());
        }

        if let Type::Object { required, .. } = input_ty {
            for field in required {
                if !bound_fields.contains(field.as_str()) {
                    r.error(Finding {
                        code: Code::UnboundInput,
                        node: Some(n.id.clone()),
                        detail: format!(
                            "`{}` requires input `{field}` but nothing binds it",
                            n.name
                        ),
                        fix_hint: "add a binding, or drop the field from `required`".into(),
                        related: vec![],
                    });
                }
            }
        }
    }

    for n in nodes {
        // A review node reviews the plan; it is not part of the work, so being
        // disconnected is its correct shape rather than a defect.
        if n.kind() == NodeKind::Review {
            continue;
        }
        let has_inbound = !n.needs.is_empty();
        let has_outbound = state.edges.keys().any(|(from, _)| from == &n.id)
            || nodes.iter().any(|o| o.needs.contains(&n.id));
        // Review nodes do not count toward "is this graph big enough for a
        // disconnected node to be suspicious", since they are always detached.
        let work_nodes = nodes.iter().filter(|c| c.kind() != NodeKind::Review).count();
        if !has_inbound && !has_outbound && work_nodes > 1 {
            r.error(Finding {
                code: Code::OrphanNode,
                node: Some(n.id.clone()),
                detail: format!("`{}` has no dependencies and nothing depends on it", n.name),
                fix_hint: "connect it, or remove it — a disconnected node is work nobody asked for"
                    .into(),
                related: vec![],
            });
        }
    }
}

fn capabilities(state: &State, nodes: &[&Node], caps: &Capabilities, r: &mut Report) {
    for n in nodes {
        if !caps.registered.contains(&n.capability) {
            r.error(Finding {
                code: Code::UnknownCapability,
                node: Some(n.id.clone()),
                detail: format!(
                    "`{}` declares capability `{}`, which is not registered",
                    n.name, n.capability
                ),
                fix_hint: "register the capability, or use one that exists".into(),
                related: vec![],
            });
        }

        if n.kind() == NodeKind::Human && n.capability != "human" {
            r.error(Finding {
                code: Code::HumanNodeCapability,
                node: Some(n.id.clone()),
                detail: format!("human node `{}` declares capability `{}`", n.name, n.capability),
                fix_hint: "a human node's capability is `human`; a person does not send email on the graph's behalf".into(),
                related: vec![],
            });
        }

        if caps
            .gated
            .iter()
            .any(|g| n.capability == *g || n.capability.starts_with(&format!("{g}_")))
        {
            let unguarded = unguarded_paths(nodes, &n.id);
            if !unguarded.is_empty() {
                let render: Vec<String> = unguarded[0]
                    .iter()
                    .filter_map(|id| nodes.iter().find(|c| &c.id == id).map(|c| c.name.clone()))
                    .collect();
                r.error(Finding {
                    code: Code::UngatedCapability,
                    node: Some(n.id.clone()),
                    detail: format!(
                        "`{}` reaches `{}` with no human gate on the path {}",
                        n.name,
                        n.capability,
                        render.join(" → ")
                    ),
                    fix_hint: "insert a human node upstream — irreversible work needs an owner"
                        .into(),
                    related: unguarded[0].clone(),
                });
            }
        }
    }

    for n in nodes {
        // An expanded `forEach` parent produces an *array* of its children's
        // outputs, while its declared schema describes one child. A plain
        // `$.field` therefore type-checks against the declaration and returns an
        // array at runtime — a mismatch no gate can see. `$[*]` makes the
        // collection explicit on both sides.
        for b in &n.bindings {
            let fans_out = state.nodes.get(&b.from).is_some_and(|u| u.for_each.is_some());
            if fans_out && !b.select.trim_start().starts_with("$[*]") {
                let from = state.nodes.get(&b.from).map(|u| u.name.as_str()).unwrap_or("?");
                r.error(Finding {
                    code: Code::ForEachBindingNotIndexed,
                    node: Some(n.id.clone()),
                    detail: format!(
                        "`{}` binds `{}` from `{from}`, which fans out and produces one entry per child",
                        n.name, b.select
                    ),
                    fix_hint: format!(
                        "write `$[*]{}` — the collection has to be explicit, or the declared type and the runtime value disagree",
                        b.select.trim_start().strip_prefix("$").unwrap_or("")
                    ),
                    related: vec![b.from.clone()],
                });
            }
        }

        // A `forEach` upstream is one edge at plan time and N after it expands,
        // so a merge over a fan-out already has its fan-in — it just has not
        // happened yet.
        let inbound: usize = n
            .needs
            .iter()
            .filter(|d| state.nodes.get(*d).and_then(|c| c.parent.as_ref()) != Some(&n.id))
            .map(|d| {
                let fans_out = state.nodes.get(d).is_some_and(|u| u.for_each.is_some());
                if fans_out {
                    2
                } else {
                    1
                }
            })
            .sum();
        if n.kind() == NodeKind::Merge && inbound < 2 {
            r.error(Finding {
                code: Code::MergeWithoutFanIn,
                node: Some(n.id.clone()),
                detail: format!("merge node `{}` has {inbound} inbound edge(s)", n.name),
                fix_hint: "a merge consolidates a fan-in; with one input it is just a node".into(),
                related: vec![],
            });
        }
        if inbound >= 2 && n.kind() != NodeKind::Merge && n.kind() != NodeKind::Human {
            r.warn(Finding {
                code: Code::FanInWithoutMerge,
                node: Some(n.id.clone()),
                detail: format!("`{}` consolidates {inbound} inputs but is not a merge node", n.name),
                fix_hint: "one owner should own the merge — uncoordinated merges amplify errors 17.2× versus 4.4×".into(),
                related: vec![],
            });
        }
    }
    let _ = state;
}

fn bounds(state: &State, nodes: &[&Node], r: &mut Report) {
    let Some(graph) = &state.graph else { return };
    let limits = graph.limits;

    if nodes.len() as u32 > limits.max_nodes {
        r.error(Finding {
            code: Code::TooManyNodes,
            node: None,
            detail: format!("{} nodes exceeds the limit of {}", nodes.len(), limits.max_nodes),
            fix_hint: "decompose less finely, or raise `limits.max_nodes`".into(),
            related: vec![],
        });
    }

    let depth = graph_depth(nodes);
    if depth > limits.max_depth {
        r.error(Finding {
            code: Code::TooDeep,
            node: None,
            detail: format!("graph depth {depth} exceeds the limit of {}", limits.max_depth),
            fix_hint: "a deep narrow plan usually means the stop rule was ignored".into(),
            related: vec![],
        });
    }

    for n in nodes {
        if let Some(fe) = &n.for_each {
            if fe.max == 0 || fe.max > limits.max_for_each {
                r.error(Finding {
                    code: Code::ForEachUnbounded,
                    node: Some(n.id.clone()),
                    detail: format!(
                        "`{}` expands up to {}, outside the bound of {}",
                        n.name, fe.max, limits.max_for_each
                    ),
                    fix_hint: "declare a real bound — a fan-out over 50,000 rows must fail here, not at node 500".into(),
                    related: vec![],
                });
            }
        }
        if let graphene_core::node::RetryPolicy::Bounded { attempts } = n.retry {
            if attempts == 0 || attempts > limits.max_rounds {
                r.error(Finding {
                    code: Code::LoopUnbounded,
                    node: Some(n.id.clone()),
                    detail: format!(
                        "`{}` retries {attempts} times, outside the bound of {}",
                        n.name, limits.max_rounds
                    ),
                    fix_hint: "every loop gets a maximum round count".into(),
                    related: vec![],
                });
            }
        }
    }

    // Only a *demonstrable* overflow is an error, and it is checked per
    // dimension. Undeclared node budgets make the sum unknown, not excessive —
    // and the graph ceiling is still enforced at claim time, so requiring every
    // node to declare one would turn an optional field into a mandatory one for
    // no safety gain.
    for (dim, cap, of) in [
        (
            Dimension::Tokens,
            graph.budget.tokens,
            (|b: &Budget| b.tokens) as fn(&Budget) -> Option<u64>,
        ),
        (Dimension::MicrosUsd, graph.budget.micros_usd, |b: &Budget| b.micros_usd),
        (Dimension::WallMs, graph.budget.wall_ms, |b: &Budget| b.wall_ms),
    ] {
        let Some(cap) = cap else { continue };
        let declared: Vec<u64> = nodes.iter().filter_map(|n| of(&n.budget)).collect();
        let undeclared = nodes.len() - declared.len();
        let sum: u64 = declared.iter().copied().fold(0, u64::saturating_add);

        if sum > cap {
            r.error(Finding {
                code: Code::BudgetOverflow,
                node: None,
                detail: format!(
                    "declared node budgets already total {sum} against the graph's `{}` cap of {cap}",
                    dim.as_str()
                ),
                fix_hint: "raise the graph budget or lower the node budgets — this must fail at plan time, not mid-run".into(),
                related: vec![],
            });
        } else if undeclared > 0 {
            r.warn(Finding {
                code: Code::BudgetOverflow,
                node: None,
                detail: format!(
                    "{undeclared} node(s) declare no `{}` budget under a bounded graph",
                    dim.as_str()
                ),
                fix_hint: "the ceiling is still enforced at claim time; declare node budgets to catch overrun at plan time instead".into(),
                related: vec![],
            });
        }
    }

    if limits.max_concurrency == 0 {
        r.error(Finding {
            code: Code::ConcurrencyOverflow,
            node: None,
            detail: "`max_concurrency` is zero; nothing could ever run".into(),
            fix_hint: "set it to at least 1".into(),
            related: vec![],
        });
    }
}

fn determinism(nodes: &[&Node], state: &State, r: &mut Report) {
    for n in nodes {
        if n.outputs.is_null() || n.outputs.as_object().is_none_or(|o| o.is_empty()) {
            r.error(Finding {
                code: Code::MissingOutputSchema,
                node: Some(n.id.clone()),
                detail: format!("`{}` declares no output schema", n.name),
                fix_hint: "a declared output is what makes a node testable alone".into(),
                related: vec![],
            });
        }

        if matches!(n.retry, graphene_core::node::RetryPolicy::Bounded { .. })
            && n.idempotency.is_none()
        {
            r.error(Finding {
                code: Code::MissingIdempotency,
                node: Some(n.id.clone()),
                detail: format!("`{}` is retryable but declares no idempotency key", n.name),
                fix_hint: "retry is only safe when a repeated node with side effects is a no-op"
                    .into(),
                related: vec![],
            });
        }

        if let graphene_core::node::NodeSpec::Human(ask) = &n.spec {
            if ask.options.is_empty() {
                r.error(Finding {
                    code: Code::MissingTimeoutPolicy,
                    node: Some(n.id.clone()),
                    detail: format!("human node `{}` offers no options", n.name),
                    fix_hint: "a question with no answers cannot be answered".into(),
                    related: vec![],
                });
            }
            // A human node whose every answer releases the same dependents is
            // not a gate — the person's decision changes nothing. C2 proves a
            // gate is *on the path*; this proves the answer is *load-bearing*.
            let dependents: Vec<&Node> =
                nodes.iter().filter(|d| d.needs.contains(&n.id)).copied().collect();
            if !dependents.is_empty() {
                let declared: BTreeSet<&String> =
                    ask.consequence.iter().map(|(opt, _)| opt).collect();
                let undeclared: Vec<&str> = ask
                    .options
                    .iter()
                    .filter(|o| !declared.contains(o))
                    .map(String::as_str)
                    .collect();
                if !undeclared.is_empty() {
                    r.error(Finding {
                        code: Code::UngatedChoice,
                        node: Some(n.id.clone()),
                        detail: format!(
                            "`{}` gates {} node(s) but does not say what these answers release: {}",
                            n.name,
                            dependents.len(),
                            undeclared.join(", ")
                        ),
                        fix_hint:
                            "declare `unblocks` per option; an answer that names nothing skips its dependents, which is how `no` is expressed"
                                .into(),
                        related: dependents.iter().map(|d| d.id.clone()).collect(),
                    });
                }
            }

            if ask.options.iter().any(|o| o.eq_ignore_ascii_case("approve"))
                && matches!(ask.on_timeout, graphene_core::node::TimeoutPolicy::Wait)
            {
                r.warn(Finding {
                    code: Code::MissingTimeoutPolicy,
                    node: Some(n.id.clone()),
                    detail: format!("human node `{}` waits forever on an approval", n.name),
                    fix_hint:
                        "an approval that never times out can sit unnoticed; consider `escalate`"
                            .into(),
                    related: vec![],
                });
            }
        }
    }

    for (from, to) in state.edges.keys() {
        if !state.nodes.contains_key(from) || !state.nodes.contains_key(to) {
            r.error(Finding {
                code: Code::UntypedEdge,
                node: None,
                detail: format!("edge `{from}` → `{to}` references a node not in the graph"),
                fix_hint: "remove the edge or add the node".into(),
                related: vec![],
            });
        }
    }
}

fn concurrency(nodes: &[&Node], r: &mut Report) {
    let mut writers: BTreeMap<&str, Vec<&Node>> = BTreeMap::new();
    for n in nodes {
        for artifact in &n.writes {
            writers.entry(artifact.as_str()).or_default().push(n);
        }
    }

    for (artifact, ws) in writers.iter().filter(|(_, v)| v.len() > 1) {
        let independent = ws.iter().any(|a| {
            ws.iter().any(|b| {
                a.id != b.id && !reaches(nodes, &a.id, &b.id) && !reaches(nodes, &b.id, &a.id)
            })
        });
        if independent {
            r.error(Finding {
                code: Code::MultipleWriters,
                node: Some(ws[0].id.clone()),
                detail: format!(
                    "`{artifact}` is written by {} nodes that can run concurrently",
                    ws.len()
                ),
                fix_hint: "one writer per artifact; sequence them or split the artifact".into(),
                related: ws.iter().map(|n| n.id.clone()).collect(),
            });
        }
    }
}

// -------------------------------------------------------------- graph maths

fn find_cycle(nodes: &[&Node]) -> Option<Vec<NodeId>> {
    const UNSEEN: u8 = 0;
    const ON_STACK: u8 = 1;
    const DONE: u8 = 2;

    let mut colour: BTreeMap<NodeId, u8> = BTreeMap::new();
    let mut stack: Vec<NodeId> = Vec::new();

    fn visit(
        id: &NodeId,
        nodes: &[&Node],
        colour: &mut BTreeMap<NodeId, u8>,
        stack: &mut Vec<NodeId>,
    ) -> Option<Vec<NodeId>> {
        let entry = nodes.iter().find(|n| &n.id == id)?;
        match colour.get(id).copied().unwrap_or(0) {
            1 => {
                let at = stack.iter().position(|s| s == id).unwrap_or(0);
                let mut cycle = stack[at..].to_vec();
                cycle.push(id.clone());
                return Some(cycle);
            }
            2 => return None,
            _ => {}
        }
        colour.insert(id.clone(), 1);
        stack.push(id.clone());
        for need in &entry.needs {
            if let Some(c) = visit(need, nodes, colour, stack) {
                return Some(c);
            }
        }
        stack.pop();
        colour.insert(id.clone(), 2);
        None
    }

    let _ = (UNSEEN, ON_STACK, DONE);
    for n in nodes {
        if colour.get(&n.id).copied().unwrap_or(0) == 0 {
            if let Some(c) = visit(&n.id, nodes, &mut colour, &mut stack) {
                return Some(c);
            }
        }
    }
    None
}

fn graph_depth(nodes: &[&Node]) -> u32 {
    fn depth_of(id: &NodeId, nodes: &[&Node], memo: &mut BTreeMap<NodeId, u32>) -> u32 {
        if let Some(d) = memo.get(id) {
            return *d;
        }
        memo.insert(id.clone(), 1);
        let d = nodes
            .iter()
            .find(|n| &n.id == id)
            .map(|n| n.needs.iter().map(|p| depth_of(p, nodes, memo)).max().unwrap_or(0) + 1)
            .unwrap_or(0);
        memo.insert(id.clone(), d);
        d
    }
    let mut memo = BTreeMap::new();
    nodes.iter().map(|n| depth_of(&n.id, nodes, &mut memo)).max().unwrap_or(0)
}

/// Every root-to-`target` path carrying no human node.
fn unguarded_paths(nodes: &[&Node], target: &NodeId) -> Vec<Vec<NodeId>> {
    let by_id: BTreeMap<&NodeId, &&Node> = nodes.iter().map(|n| (&n.id, n)).collect();
    let mut out = Vec::new();
    let mut queue: VecDeque<Vec<NodeId>> = VecDeque::new();
    queue.push_back(vec![target.clone()]);

    while let Some(path) = queue.pop_front() {
        let head = path.first().expect("non-empty");
        let Some(node) = by_id.get(head) else { continue };

        if node.kind() == NodeKind::Human && head != target {
            continue;
        }
        if node.needs.is_empty() {
            out.push(path.clone());
            continue;
        }
        if path.len() > nodes.len() {
            continue;
        }
        for need in &node.needs {
            let mut next = path.clone();
            next.insert(0, need.clone());
            queue.push_back(next);
        }
    }
    out
}

fn reaches(nodes: &[&Node], from: &NodeId, to: &NodeId) -> bool {
    let mut seen = BTreeSet::new();
    let mut queue = VecDeque::from(vec![to.clone()]);
    while let Some(cur) = queue.pop_front() {
        if &cur == from {
            return true;
        }
        if !seen.insert(cur.clone()) {
            continue;
        }
        if let Some(n) = nodes.iter().find(|n| n.id == cur) {
            for need in &n.needs {
                queue.push_back(need.clone());
            }
        }
    }
    false
}
