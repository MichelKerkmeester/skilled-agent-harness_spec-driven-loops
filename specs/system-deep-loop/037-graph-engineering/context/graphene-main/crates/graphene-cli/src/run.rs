use std::path::{Path, PathBuf};

use graphene_check::{check, CapabilityRegistry};
use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Spend};
use graphene_core::event::{Event, FindingResolution};
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, FindingId, GraphId, NodeId, SessionId};
use graphene_core::node::{NodeState, TimeoutPolicy};
use graphene_core::time::{ObservedAt, Seq, Timestamp};
use graphene_core::BeliefEdge;
use graphene_exec::{Ask, ExecError, Executor};
use graphene_server::wait::{wait, WaitOptions};
use graphene_server::{discovery, Config, Server};
use graphene_store::{ListFilter, Store, StoreError};
use serde_json::{json, Value};

use crate::cli::{Cli, Command};
use crate::out::{code, failed, ok, refused, Format};

pub fn dispatch(args: Cli, fmt: Format) -> i32 {
    match run(args, fmt) {
        Ok(exit) => exit,
        Err(Failure::Refused(r)) => refused(&r, fmt),
        Err(Failure::Store(e)) => failed(e, code::STORE, fmt),
        Err(Failure::Usage(m)) => failed(m, code::USAGE, fmt),
        Err(Failure::Protocol(m)) => failed(m, code::PROTOCOL, fmt),
    }
}

enum Failure {
    Refused(Box<graphene_core::refusal::Refusal>),
    Store(String),
    Usage(String),
    Protocol(String),
}

impl From<StoreError> for Failure {
    fn from(e: StoreError) -> Self {
        match e {
            StoreError::Refusal(r) => Failure::Refused(r),
            other => Failure::Store(other.to_string()),
        }
    }
}

impl From<ExecError> for Failure {
    fn from(e: ExecError) -> Self {
        match e {
            ExecError::Refused(r) => Failure::Refused(r),
            other => Failure::Store(other.to_string()),
        }
    }
}

type R = Result<i32, Failure>;

fn run(args: Cli, fmt: Format) -> R {
    let store_path = resolve_store(&args)?;
    let session =
        SessionId(args.session.clone().unwrap_or_else(|| format!("cli-{}", std::process::id())));

    match args.command {
        // ------------------------------------------------------------ graphs
        Command::Init { path, force } => {
            let root = path.canonicalize().unwrap_or(path.clone());
            let installed = crate::skill::install(&root, force)
                .map_err(|e| Failure::Store(format!("{}: {e}", root.display())))?;

            // Creating the store here means the first real command does not have
            // to, and `gr status` in a fresh repo answers instead of erroring.
            let store_path = root.join(graphene_store::STORE_DIR).join(graphene_store::STORE_FILE);
            Store::open(&store_path)?;

            Ok(ok(
                &json!({
                    "skill": installed.root,
                    "store": store_path,
                    "written": installed.written,
                    "skipped": installed.skipped,
                    "next": if installed.written.is_empty() && !installed.skipped.is_empty() {
                        "already installed; pass --force to overwrite"
                    } else {
                        "ask your agent to plan a task, or run `gr new --task \"...\"`"
                    },
                }),
                fmt,
            ))
        }

        Command::New { task, title, description, tag, tokens } => {
            let mut store = Store::open(&store_path)?;
            let seed = format!("{}-{}", now().0, std::process::id());
            let graph = GraphId::from_seed(&seed);
            store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::GraphCreate {
                    seed,
                    title: title.unwrap_or_else(|| first_line(&task)),
                    description: description.unwrap_or_default(),
                    task,
                    budget: tokens.map(Budget::tokens).unwrap_or_default(),
                    limits: Default::default(),
                    tags: tag,
                    parent: None,
                },
            )?;
            Ok(ok(&json!({ "graph": graph, "state": "draft" }), fmt))
        }

        Command::Plan { graph, file } => {
            let graph = parse_graph(&graph)?;
            let doc: crate::plan::TaskDoc = serde_json::from_str(&read_text(file)?)
                .map_err(|e| Failure::Usage(format!("malformed task.v1 document: {e}")))?;
            let nodes =
                crate::plan::compile(&doc, &graph).map_err(|e| Failure::Usage(e.to_string()))?;

            let mut store = Store::open(&store_path)?;
            let mut added = Vec::new();
            for node in nodes {
                added.push(json!({ "name": node.name, "id": node.id }));
                store.append(
                    &graph,
                    Actor::System,
                    now(),
                    Event::NodeAdd { node: Box::new(node) },
                )?;
            }
            Ok(ok(&json!({ "graph": graph, "nodes": added }), fmt))
        }

        Command::Check { graph } => {
            let graph = require_graph(&store_path, graph)?;
            let mut store = Store::open(&store_path)?;
            let state = store.state(&graph)?;
            let report = check(&state, &capabilities(&store_path)?);

            store.append(
                &graph,
                Actor::System,
                now(),
                Event::CheckResult {
                    passed: report.ok,
                    errors: report.errors.len() as u32,
                    warnings: report.warnings.len() as u32,
                    codes: code_counts(&report),
                },
            )?;

            if report.ok && state.graph.as_ref().is_some_and(|g| g.state == GraphState::Draft) {
                let _ = store.append(
                    &graph,
                    Actor::System,
                    now(),
                    Event::GraphState { to: GraphState::Checked, reason: None },
                );
            }

            let exit = if report.ok { code::OK } else { code::CHECK_FAILED };
            ok(&report, fmt);
            Ok(exit)
        }

        // `reviewed` has deterministic preconditions — review nodes done,
        // findings resolved — so it is not a separate decision. Approving
        // carries the graph through it in one step, which is how a person
        // experiences saying "go".
        Command::Approve { graph } => {
            let graph = parse_graph(&graph)?;
            let mut store = Store::open(&store_path)?;
            if store.state(&graph)?.graph.as_ref().is_some_and(|g| g.state == GraphState::Checked) {
                store.append(
                    &graph,
                    Actor::System,
                    now(),
                    Event::GraphState { to: GraphState::Reviewed, reason: None },
                )?;
            }
            store.append(
                &graph,
                Actor::System,
                now(),
                Event::GraphState { to: GraphState::Approved, reason: None },
            )?;
            Ok(ok(&json!({ "graph": graph, "state": "approved" }), fmt))
        }
        Command::Start { graph } => transition(&store_path, &graph, GraphState::Running, fmt),

        Command::Cancel { graph, reason } => {
            let graph = parse_graph(&graph)?;
            let mut store = Store::open(&store_path)?;
            store.append(
                &graph,
                Actor::System,
                now(),
                Event::GraphState { to: GraphState::Cancelled, reason: Some(reason) },
            )?;
            Ok(ok(&json!({ "graph": graph, "state": "cancelled" }), fmt))
        }

        Command::Amend { graph, reason } => derive_graph(&store_path, &graph, &reason, fmt),
        Command::Clone { graph } => derive_graph(&store_path, &graph, "cloned as a template", fmt),

        Command::List { all, state, tag, limit } => {
            let store = Store::open(&store_path)?;
            let filter = ListFilter {
                include_terminal: all,
                state: state.as_deref().and_then(parse_graph_state),
                tag,
                limit,
            };
            let graphs = store.list(&filter)?;
            Ok(ok(&json!({ "graphs": graphs }), fmt))
        }

        Command::Show { graph } => {
            let graph = parse_graph(&graph)?;
            Ok(ok(&Store::open(&store_path)?.state(&graph)?, fmt))
        }

        Command::Export { graph } => {
            let graph = parse_graph(&graph)?;
            print!("{}", Store::open(&store_path)?.export(&graph)?);
            Ok(code::OK)
        }

        // ------------------------------------------------------------- nodes
        Command::Node { id, graph } => {
            let node = parse_node(&id)?;
            let graph = require_graph(&store_path, graph)?;
            let exec = Executor::new(Store::open(&store_path)?);
            if let Ok(view) = exec.human_node(&graph, &node) {
                return Ok(ok(&view, fmt));
            }
            let state = exec.store().state(&graph)?;
            let Some(n) = state.nodes.get(&node) else {
                return Err(Failure::Usage(format!("no node `{node}` in `{graph}`")));
            };

            // The point of a binding is that the work receives the data. Showing
            // the binding without its value makes every claimer re-fetch each
            // upstream output by hand.
            let mut view = serde_json::to_value(n).unwrap_or_else(|_| json!({}));
            if let Some(obj) = view.as_object_mut() {
                let named: Vec<Value> = n
                    .bindings
                    .iter()
                    .map(|b| {
                        json!({
                            "from": state.nodes.get(&b.from).map(|u| u.name.clone()),
                            "from_id": b.from,
                            "select": b.select,
                            "into": b.into,
                        })
                    })
                    .collect();
                obj.insert("bindings".into(), Value::Array(named));
                obj.insert(
                    "needs".into(),
                    Value::Array(
                        n.needs
                            .iter()
                            .map(|d| {
                                json!({
                                    "node": d,
                                    "name": state.nodes.get(d).map(|u| u.name.clone()),
                                    "state": state.nodes.get(d).map(|u| u.state.as_str()),
                                })
                            })
                            .collect(),
                    ),
                );
                match graphene_exec::resolve_inputs(&state, n) {
                    Ok(v) => {
                        obj.insert("inputs_resolved".into(), v);
                    }
                    Err(e) => {
                        obj.insert("inputs_resolved".into(), Value::Null);
                        obj.insert("inputs_unresolved_because".into(), json!(e.to_string()));
                    }
                }
            }
            Ok(ok(&view, fmt))
        }

        Command::Nodes { graph, state } => {
            let graph = parse_graph(&graph)?;
            let folded = Store::open(&store_path)?.state(&graph)?;
            let want = state.as_deref().and_then(parse_node_state);
            let nodes: Vec<_> =
                folded.nodes.values().filter(|n| want.is_none_or(|w| n.state == w)).collect();
            Ok(ok(&nodes, fmt))
        }

        Command::Next { graph } => {
            let graph = parse_graph(&graph)?;
            let exec = swept(&store_path, &graph)?;
            Ok(ok(&exec.next(&graph)?, fmt))
        }

        Command::Claim { node, graph, assumes, lease_ms } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let read_set =
                assumes.iter().map(|s| parse_belief(s)).collect::<Result<Vec<_>, _>>()?;
            let mut exec = swept(&store_path, &graph)?;
            let claimed = exec.claim(&graph, &node, &session, &read_set, lease_ms, now())?;
            Ok(ok(&claimed, fmt))
        }

        Command::Renew { node, graph, lease_ms } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let mut exec = Executor::new(Store::open(&store_path)?);
            let expires = exec.renew(&graph, &node, lease_ms, now())?;
            Ok(ok(&json!({ "node": node, "expires_at": expires }), fmt))
        }

        Command::Release { node, graph, reason } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let mut exec = Executor::new(Store::open(&store_path)?);
            exec.release(&graph, &node, reason, now())?;
            Ok(ok(&json!({ "node": node, "released": true }), fmt))
        }

        Command::Checkpoint { node, graph, state } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let value = parse_json(&state)?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            exec.checkpoint(&graph, &node, value, now())?;
            Ok(ok(&json!({ "node": node, "checkpointed": true }), fmt))
        }

        Command::Done { node, graph, output, tokens, micros_usd } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let value = parse_json(&output)?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            let applied =
                exec.done(&graph, &node, value, Spend { tokens, micros_usd, wall_ms: 0 }, now())?;
            Ok(ok(&json!({ "node": node, "effects": applied.effects }), fmt))
        }

        Command::Fail { node, graph, reason, retryable } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let mut exec = Executor::new(Store::open(&store_path)?);
            let applied = exec.fail(&graph, &node, reason, retryable, now())?;
            Ok(ok(&json!({ "node": node, "effects": applied.effects }), fmt))
        }

        Command::Expand { node, graph } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let mut exec = Executor::new(Store::open(&store_path)?);
            Ok(ok(&json!({ "children": exec.expand(&graph, &node, now())? }), fmt))
        }

        // ------------------------------------------------------- human nodes
        Command::Await { node, graph, ask, options, context, unblocks, on_timeout } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let context = context.iter().map(|s| parse_belief(s)).collect::<Result<Vec<_>, _>>()?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            exec.ask(
                &graph,
                &node,
                Ask {
                    question: ask,
                    options: options.clone(),
                    context,
                    consequence: parse_unblocks(&unblocks, &options)?,
                    on_timeout: parse_timeout(&on_timeout)?,
                },
                now(),
            )?;
            Ok(ok(&exec.human_node(&graph, &node)?, fmt))
        }

        Command::Awaiting { graph } => {
            let graph = parse_graph(&graph)?;
            let _ = swept(&store_path, &graph)?;
            let exec = Executor::new(Store::open(&store_path)?);
            Ok(ok(&exec.awaiting(&graph)?, fmt))
        }

        Command::Resolve { node, graph, by, choice, input } => {
            let (graph, node) = (parse_graph(&graph)?, parse_node(&node)?);
            let input = input.as_deref().map(parse_json).transpose()?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            let applied = exec.resolve(&graph, &node, by, choice, input, now())?;
            Ok(ok(&json!({ "node": node, "effects": applied.effects }), fmt))
        }

        // ----------------------------------------------------------- beliefs
        Command::Findings { graph, open } => {
            let graph = parse_graph(&graph)?;
            let store = Store::open(&store_path)?;
            let state = store.state(&graph)?;
            let name = |id: &NodeId| {
                state.nodes.get(id).map(|n| n.name.clone()).unwrap_or_else(|| id.to_string())
            };

            let mut rows: Vec<Value> = state
                .findings
                .values()
                .filter(|f| !open || f.resolution.is_none())
                .map(|f| {
                    json!({
                        "id": f.id,
                        "target": name(&f.target),
                        "target_id": f.target,
                        "raised_by": name(&f.review_node),
                        "severity": f.severity,
                        "body": f.body,
                        "resolution": f.resolution,
                    })
                })
                .collect();
            rows.sort_by_key(|r| r["resolution"].is_string());

            let unresolved = state.findings.values().filter(|f| f.resolution.is_none()).count();
            Ok(ok(&json!({ "findings": rows, "open": unresolved }), fmt))
        }

        Command::Finding { id, graph, resolution, reason } => {
            let graph = parse_graph(&graph)?;
            let id = FindingId::parse(&id).map_err(|_| {
                Failure::Usage(format!("expected an id starting with `gf_`, got `{id}`"))
            })?;
            let resolution = match resolution.as_str() {
                "applied" => FindingResolution::Applied,
                "rejected" => FindingResolution::Rejected,
                other => {
                    return Err(Failure::Usage(format!(
                        "`{other}` is not a resolution; use `applied` or `rejected`"
                    )))
                }
            };
            let mut exec = Executor::new(Store::open(&store_path)?);
            exec.resolve_finding(&graph, &id, resolution, reason, now())?;
            Ok(ok(&json!({ "finding": id, "resolution": resolution }), fmt))
        }

        Command::Believe { graph, content, provenance, summary, source, shared, derives_from } => {
            let graph = parse_graph(&graph)?;
            let prov = parse_provenance(&provenance)?;
            let mut src = SourceRef::new(source_system(&source));
            if let Some(path) = source_path(&source) {
                src = src.at(path);
            }
            if shared {
                src = src.shared();
            }
            let id = BeliefId::for_content(&graph, &content, prov.as_str(), &src.key());
            let edges = derives_from
                .iter()
                .map(|s| parse_belief(s).map(|b| (BeliefEdge::DerivesFrom, b)))
                .collect::<Result<Vec<_>, _>>()?;

            let mut store = Store::open(&store_path)?;
            store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::BeliefAdd {
                    id: id.clone(),
                    provenance: prov,
                    fidelity: Fidelity::Claimed,
                    summary: summary.unwrap_or_else(|| truncate(&content, 80)),
                    content,
                    source: src,
                    observed_at: ObservedAt::observed(now()),
                    support_mode: SupportMode::All,
                    sensitivity: Default::default(),
                    edges,
                    produced_by: None,
                    scoped_to: None,
                },
            )?;
            Ok(ok(&json!({ "belief": id }), fmt))
        }

        Command::Retract { id, graph, reason, evidence } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let state = Store::open(&store_path)?.state(&graph)?;
            if let Some(b) = state.beliefs.get(&id) {
                if !b.provenance.caller_may_retract() {
                    return Err(Failure::Refused(Box::new(b.provenance.refuse_retraction())));
                }
            }
            let evidence =
                evidence.iter().map(|s| parse_belief(s)).collect::<Result<Vec<_>, _>>()?;
            let mut store = Store::open(&store_path)?;
            let (_, applied) = store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Retract { id: id.clone(), reason, evidence, rule: None },
            )?;
            Ok(ok(&json!({ "belief": id, "effects": applied.effects }), fmt))
        }

        Command::Contradict { id, graph, reason, evidence } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let evidence =
                evidence.iter().map(|s| parse_belief(s)).collect::<Result<Vec<_>, _>>()?;
            let mut store = Store::open(&store_path)?;
            let (_, applied) = store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Contradict { id: id.clone(), reason, evidence },
            )?;
            Ok(ok(&json!({ "belief": id, "effects": applied.effects }), fmt))
        }

        Command::Uncontradict { id, graph, reason } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let mut store = Store::open(&store_path)?;
            store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Uncontradict { id: id.clone(), reason },
            )?;
            Ok(ok(&json!({ "belief": id }), fmt))
        }

        Command::Corroborate { id, graph, by } => {
            let (graph, id, by) = (parse_graph(&graph)?, parse_belief(&id)?, parse_belief(&by)?);
            let mut store = Store::open(&store_path)?;
            store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Corroborate { id: id.clone(), by },
            )?;
            let state = store.state(&graph)?;
            let fidelity = state.beliefs.get(&id).map(|b| b.fidelity);
            Ok(ok(&json!({ "belief": id, "fidelity": fidelity }), fmt))
        }

        Command::Reinstate { id, graph, reason } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let mut store = Store::open(&store_path)?;
            let (_, applied) = store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Reinstate { id: id.clone(), reason },
            )?;
            Ok(ok(&json!({ "belief": id, "effects": applied.effects }), fmt))
        }

        Command::Supersede { id, graph, content, reason, observation_proof } => {
            let (graph, old) = (parse_graph(&graph)?, parse_belief(&id)?);
            let mut store = Store::open(&store_path)?;
            let state = store.state(&graph)?;
            let prior = state
                .beliefs
                .get(&old)
                .ok_or_else(|| Failure::Usage(format!("no belief `{old}`")))?;

            if prior.provenance == Provenance::ToolObservation && observation_proof.is_none() {
                return Err(Failure::Refused(Box::new(
                    graphene_core::refusal::Refusal::new(
                        graphene_core::RefusalCode::NoObservationProof,
                        graphene_core::Suggestion::ObserveAgain,
                        "I6 — superseding an observation requires evidence of a fresh observation in this turn",
                    ),
                )));
            }

            let src = prior.source.clone();
            let prov = prior.provenance;
            let new = BeliefId::for_content(&graph, &content, prov.as_str(), &src.key());

            store.append(
                &graph,
                Actor::Session { id: session.clone() },
                now(),
                Event::BeliefAdd {
                    id: new.clone(),
                    provenance: prov,
                    fidelity: Fidelity::Claimed,
                    summary: truncate(&content, 80),
                    content,
                    source: src,
                    observed_at: ObservedAt::observed(now()),
                    support_mode: SupportMode::All,
                    sensitivity: Default::default(),
                    edges: vec![],
                    produced_by: None,
                    scoped_to: None,
                },
            )?;
            let (_, applied) = store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Supersede {
                    old: old.clone(),
                    new: new.clone(),
                    reason,
                    // Evidence a caller writes in prose ("re-queried db#schema at
                    // 12:04"), not a document. Parsing it as JSON refused every
                    // proof anyone would actually supply.
                    observation_proof: observation_proof.map(Value::String),
                },
            )?;
            Ok(ok(&json!({ "old": old, "new": new, "effects": applied.effects }), fmt))
        }

        Command::Nogood { graph, members, note } => {
            let graph = parse_graph(&graph)?;
            let mut ids = members.iter().map(|s| parse_belief(s)).collect::<Result<Vec<_>, _>>()?;
            ids.sort();
            ids.dedup();
            if ids.len() < 2 {
                return Err(Failure::Usage(
                    "a nogood needs at least two members — one belief cannot be jointly inconsistent".into(),
                ));
            }
            let id = graphene_core::id::NogoodId::for_set(&graph, &ids);
            let mut store = Store::open(&store_path)?;
            store.append(
                &graph,
                Actor::Session { id: session },
                now(),
                Event::Nogood { id: id.clone(), members: ids.clone(), note },
            )?;
            Ok(ok(&json!({ "nogood": id, "members": ids }), fmt))
        }

        Command::Dependents { id, graph } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let state = Store::open(&store_path)?.state(&graph)?;
            let falls: Vec<_> = state
                .belief_edges
                .iter()
                .filter(|(_, k, to)| *k == BeliefEdge::DerivesFrom && to == &id)
                .filter_map(|(from, _, _)| state.beliefs.get(from))
                .map(|b| json!({ "id": b.id, "summary": b.summary, "state": b.state }))
                .collect();
            Ok(ok(&json!({ "belief": id, "dependents": falls }), fmt))
        }

        Command::Stale { graph, source } => {
            let graph = parse_graph(&graph)?;
            let mut src = SourceRef::new(source_system(&source));
            if let Some(path) = source_path(&source) {
                src = src.at(path);
            }
            let mut store = Store::open(&store_path)?;
            let (_, applied) =
                store.append(&graph, Actor::System, now(), Event::Stale { source: src })?;
            Ok(ok(&json!({ "effects": applied.effects }), fmt))
        }

        Command::Belief { id, graph } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let state = Store::open(&store_path)?.state(&graph)?;
            match state.beliefs.get(&id) {
                Some(b) => Ok(ok(b, fmt)),
                None => Err(Failure::Usage(format!("no belief `{id}`"))),
            }
        }

        Command::Why { id, graph, depth } => {
            let (graph, id) = (parse_graph(&graph)?, parse_belief(&id)?);
            let state = Store::open(&store_path)?.state(&graph)?;
            Ok(ok(&why(&state, &id, depth), fmt))
        }

        Command::Contested { graph } => {
            let graph = parse_graph(&graph)?;
            let state = Store::open(&store_path)?.state(&graph)?;
            let contested: Vec<_> = state
                .beliefs
                .values()
                .filter(|b| b.state == graphene_core::TruthState::Both)
                .collect();
            Ok(ok(&contested, fmt))
        }

        Command::History { id, graph } => {
            let graph = parse_graph(&graph)?;
            let records = Store::open(&store_path)?.records(&graph)?;
            let touching: Vec<_> = records
                .into_iter()
                .filter(|r| serde_json::to_string(&r.event).unwrap_or_default().contains(&id))
                .collect();
            Ok(ok(&touching, fmt))
        }

        // ---------------------------------------------------------- sessions
        Command::Attach { graph, label } => {
            let graph = parse_graph(&graph)?;
            ensure_server(&store_path)?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            let status = exec.attach(&graph, &session, label, now())?;
            let info = discovery::find_live(&store_path);
            Ok(ok(
                &json!({
                    "session": session,
                    "server": info.as_ref().map(|i| i.url()),
                    "status": status,
                }),
                fmt,
            ))
        }

        Command::Detach { graph } => {
            let graph = parse_graph(&graph)?;
            let mut exec = Executor::new(Store::open(&store_path)?);
            let applied = exec.detach(&graph, &session, now())?;
            Ok(ok(&json!({ "session": session, "effects": applied.effects }), fmt))
        }

        Command::Sessions { graph } => {
            let graph = parse_graph(&graph)?;
            let state = Store::open(&store_path)?.state(&graph)?;
            Ok(ok(&json!({ "sessions": graphene_exec::sessions(&state) }), fmt))
        }

        Command::Status { graph } => {
            let graph = require_graph(&store_path, graph)?;
            let exec = swept(&store_path, &graph)?;
            Ok(ok(&exec.status(&graph, Some(&session), now())?, fmt))
        }

        Command::Wait { graph, timeout, interests } => {
            let graph = parse_graph(&graph)?;
            let mut opts = WaitOptions::new(session, graph);
            opts.timeout = std::time::Duration::from_secs(timeout);
            opts.interests = interests.iter().filter_map(|s| parse_interest(s)).collect();

            let rt = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .map_err(|e| Failure::Store(e.to_string()))?;
            let result =
                rt.block_on(wait(&store_path, opts)).map_err(|e| Failure::Store(e.to_string()))?;
            Ok(ok(&result, fmt))
        }

        // --------------------------------------------------------- integrity
        Command::Validate { graph } => {
            let graph = require_graph(&store_path, graph)?;
            let store = Store::open(&store_path)?;
            let state = store.state(&graph)?;
            let records = store.records(&graph)?;
            let report =
                graphene_check::gates::validate(&records, &state, &capabilities(&store_path)?);
            let exit = if report.ok { code::OK } else { code::CHECK_FAILED };
            ok(&report, fmt);
            Ok(exit)
        }

        Command::Bench { bmb } => {
            if !bmb {
                return Err(Failure::Usage("only `--bmb` is available".into()));
            }
            let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
            let script = root.join("bench/run_bmb.py");
            if !script.exists() {
                return Err(Failure::Usage(format!(
                    "{} is missing; the benchmark harness is not checked out",
                    script.display()
                )));
            }
            let status = std::process::Command::new("python3")
                .arg(&script)
                .env("GRAPHENE_BIN", std::env::current_exe().unwrap_or_default())
                .status()
                .map_err(|e| Failure::Usage(format!("python3: {e}")))?;
            Ok(if status.success() { code::OK } else { code::CHECK_FAILED })
        }

        Command::Capabilities { register, gated } => {
            let mut registry = read_registry(&store_path)?;
            if !register.is_empty() {
                for name in &register {
                    registry.registered.insert(name.clone());
                    if gated {
                        registry.gated.insert(name.clone());
                    }
                }
                let path = registry_path(&store_path);
                if let Some(dir) = path.parent() {
                    std::fs::create_dir_all(dir)
                        .map_err(|e| Failure::Store(format!("{}: {e}", dir.display())))?;
                }
                std::fs::write(&path, serde_json::to_string_pretty(&registry).unwrap() + "\n")
                    .map_err(|e| Failure::Store(format!("{}: {e}", path.display())))?;
            }

            let effective = registry.resolve();
            Ok(ok(
                &json!({
                    "registered": effective.registered,
                    "gated": effective.gated,
                    "declared_in": registry_path(&store_path),
                    "already_gated": registry.redundant_gates(),
                }),
                fmt,
            ))
        }

        Command::Evidence {} => {
            let store = Store::open(&store_path)?;
            Ok(ok(&graphene_exec::evidence::gather(&store)?, fmt))
        }

        Command::Rebuild => {
            let mut store = Store::open(&store_path)?;
            store.rebuild()?;
            Ok(ok(&json!({ "rebuilt": true }), fmt))
        }

        Command::Fold { graph, up_to } => {
            let graph = parse_graph(&graph)?;
            let store = Store::open(&store_path)?;
            Ok(ok(&store.state_at(&graph, Seq(up_to))?, fmt))
        }

        Command::Compact => {
            let mut store = Store::open(&store_path)?;
            Ok(ok(&store.compact()?, fmt))
        }

        Command::Apply { file } => {
            let jsonl = read_text(file)?;
            let mut store = Store::open(&store_path)?;
            Ok(ok(&json!({ "imported": store.import(&jsonl)? }), fmt))
        }

        // ---------------------------------------------------------------- ui
        Command::Serve { port } => {
            let rt = tokio::runtime::Runtime::new().map_err(|e| Failure::Store(e.to_string()))?;
            rt.block_on(async {
                let mut cfg = Config::new(&store_path);
                cfg.port = port;
                cfg.idle_exit = None;
                match Server::start(cfg).await {
                    Ok(server) => {
                        if !fmt.quiet {
                            println!(
                                "{}",
                                serde_json::to_string(&json!({
                                    "listening": server.http(),
                                    "ws": server.url(),
                                    "store": store_path,
                                }))
                                .unwrap_or_default()
                            );
                        }
                        let _ = tokio::signal::ctrl_c().await;
                        server.shutdown().await;
                        Ok(code::OK)
                    }
                    Err(e) => Err(Failure::Store(e.to_string())),
                }
            })
        }

        Command::Ui { graph } => {
            ensure_server(&store_path)?;
            let Some(info) = discovery::find_live(&store_path) else {
                return Err(Failure::Store("could not reach a server".into()));
            };
            let url = match graph {
                Some(g) => format!("{}/?graph={g}", info.http()),
                None => info.http(),
            };
            open_browser(&url);
            Ok(ok(&json!({ "url": url }), fmt))
        }
    }
}

// ------------------------------------------------------------------ helpers

fn now() -> Timestamp {
    Timestamp(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis() as i64)
            .unwrap_or(0),
    )
}

const CAPABILITIES_FILE: &str = "capabilities.json";

/// Deadlines pass whether or not a server is running, so the commands whose
/// answer would otherwise be wrong sweep first. Reading is what makes an expiry
/// real in a no-daemon workflow.
fn swept(store_path: &Path, graph: &GraphId) -> Result<Executor, Failure> {
    let mut exec = Executor::new(Store::open(store_path)?);
    exec.sweep_deadlines(graph, now())?;
    Ok(exec)
}

/// Which codes fired and how often, so `gr evidence` can answer "are we still
/// writing fake edges?" rather than only "how many findings were there".
fn code_counts(report: &graphene_check::Report) -> Vec<(String, u32)> {
    let mut counts: std::collections::BTreeMap<String, u32> = Default::default();
    for f in report.errors.iter().chain(report.warnings.iter()) {
        *counts.entry(f.code.as_str().to_string()).or_default() += 1;
    }
    counts.into_iter().collect()
}

fn registry_path(store_path: &Path) -> PathBuf {
    store_path.with_file_name(CAPABILITIES_FILE)
}

fn read_registry(store_path: &Path) -> Result<CapabilityRegistry, Failure> {
    let path = registry_path(store_path);
    match std::fs::read_to_string(&path) {
        Ok(body) => serde_json::from_str(&body)
            .map_err(|e| Failure::Usage(format!("{}: {e}", path.display()))),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(CapabilityRegistry::default()),
        Err(e) => Err(Failure::Store(format!("{}: {e}", path.display()))),
    }
}

fn capabilities(store_path: &Path) -> Result<graphene_check::Capabilities, Failure> {
    Ok(read_registry(store_path)?.resolve())
}

/// `option=gn_a,gn_b`. An option named with no nodes releases nothing, which is
/// how "no" is expressed.
fn parse_unblocks(
    specs: &[String],
    options: &[String],
) -> Result<Vec<(String, Vec<NodeId>)>, Failure> {
    let mut out: Vec<(String, Vec<NodeId>)> = Vec::new();
    for spec in specs {
        let (opt, list) = spec
            .split_once('=')
            .ok_or_else(|| Failure::Usage(format!("`{spec}` is not `<option>=<node,node>`")))?;
        if !options.iter().any(|o| o == opt) {
            return Err(Failure::Usage(format!(
                "`{opt}` is not one of the declared options: {}",
                options.join(", ")
            )));
        }
        let nodes = list
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(parse_node)
            .collect::<Result<Vec<_>, _>>()?;
        out.push((opt.to_string(), nodes));
    }
    Ok(out)
}

fn resolve_store(args: &Cli) -> Result<PathBuf, Failure> {
    if let Some(p) = &args.store {
        return Ok(p.clone());
    }
    let cwd = std::env::current_dir().map_err(|e| Failure::Store(e.to_string()))?;
    for dir in cwd.ancestors() {
        let candidate = dir.join(graphene_store::STORE_DIR).join(graphene_store::STORE_FILE);
        if candidate.exists() {
            return Ok(candidate);
        }
    }
    Ok(cwd.join(graphene_store::STORE_DIR).join(graphene_store::STORE_FILE))
}

/// Fall back to the single graph in the store when one is unambiguous.
fn require_graph(store_path: &PathBuf, given: Option<String>) -> Result<GraphId, Failure> {
    if let Some(g) = given {
        return parse_graph(&g);
    }
    let store = Store::open(store_path)?;
    let pending = store.list(&ListFilter::default())?;
    match pending.len() {
        1 => Ok(pending[0].id.clone()),
        0 => Err(Failure::Usage("no graph is pending; name one explicitly".into())),
        n => Err(Failure::Usage(format!("{n} graphs are pending; name one explicitly"))),
    }
}

fn transition(store_path: &PathBuf, graph: &str, to: GraphState, fmt: Format) -> R {
    let graph = parse_graph(graph)?;
    let mut store = Store::open(store_path)?;
    store.append(&graph, Actor::System, now(), Event::GraphState { to, reason: None })?;
    Ok(ok(&json!({ "graph": graph, "state": to.as_str() }), fmt))
}

/// `amend` and `clone` are the same operation: a new graph with `parent` set,
/// carrying completed outputs forward. A started plan is never mutated.
fn derive_graph(store_path: &PathBuf, graph: &str, reason: &str, fmt: Format) -> R {
    let parent = parse_graph(graph)?;
    let mut store = Store::open(store_path)?;
    let source = store.state(&parent)?;
    let meta = source.graph.as_ref().ok_or_else(|| Failure::Usage("no such graph".into()))?;

    let seed = format!("{}-{}-derived", now().0, std::process::id());
    let child = GraphId::from_seed(&seed);

    store.append(
        &child,
        Actor::System,
        now(),
        Event::GraphCreate {
            seed,
            title: meta.title.clone(),
            description: format!("{} ({reason})", meta.description),
            task: meta.task.clone(),
            budget: meta.budget,
            limits: meta.limits,
            tags: meta.tags.clone(),
            parent: Some(parent.clone()),
        },
    )?;

    let mut carried = Vec::new();
    for node in source.nodes.values() {
        let mut copy = node.clone();
        copy.id = NodeId::for_name(&child, &node.name);
        copy.graph = child.clone();
        copy.needs = node
            .needs
            .iter()
            .filter_map(|n| source.nodes.get(n).map(|s| NodeId::for_name(&child, &s.name)))
            .collect();
        copy.bindings = node
            .bindings
            .iter()
            .filter_map(|b| {
                source.nodes.get(&b.from).map(|s| graphene_core::node::Binding {
                    from: NodeId::for_name(&child, &s.name),
                    select: b.select.clone(),
                    into: b.into.clone(),
                })
            })
            .collect();
        copy.claim = None;
        copy.checkpoints.clear();
        copy.attempts = 0;
        copy.spend = Spend::default();

        if node.state == NodeState::Done {
            carried.push(copy.id.clone());
            copy.state = NodeState::Done;
        } else {
            copy.state = NodeState::Pending;
            copy.output = None;
        }
        store.append(&child, Actor::System, now(), Event::NodeAdd { node: Box::new(copy) })?;
    }

    Ok(ok(&json!({ "graph": child, "parent": parent, "carried_forward": carried }), fmt))
}

fn why(state: &graphene_core::fold::State, id: &BeliefId, depth: u32) -> Value {
    let Some(belief) = state.beliefs.get(id) else {
        return json!({ "error": "no such belief" });
    };
    json!({
        "belief": belief,
        "support": support_of(state, id, depth),
        "dependents": state
            .belief_edges
            .iter()
            .filter(|(_, k, to)| *k == BeliefEdge::DerivesFrom && to == id)
            .map(|(from, _, _)| from.clone())
            .collect::<Vec<_>>(),
    })
}

fn support_of(state: &graphene_core::fold::State, id: &BeliefId, depth: u32) -> Vec<Value> {
    if depth == 0 {
        return vec![];
    }
    state
        .belief_edges
        .iter()
        .filter(|(from, k, _)| from == id && *k == BeliefEdge::DerivesFrom)
        .filter_map(|(_, _, to)| {
            state.beliefs.get(to).map(|b| {
                json!({
                    "id": b.id,
                    "summary": b.summary,
                    "state": b.state,
                    "fidelity": b.fidelity,
                    "stale": b.stale,
                    "support": support_of(state, to, depth - 1),
                })
            })
        })
        .collect()
}

/// Start a detached server if none is running. Idempotent.
fn ensure_server(store_path: &PathBuf) -> Result<(), Failure> {
    match discovery::require_compatible(store_path) {
        Ok(Some(_)) => return Ok(()),
        Ok(None) => {}
        Err(e) => return Err(Failure::Protocol(e.to_string())),
    }

    let exe = std::env::current_exe().map_err(|e| Failure::Store(e.to_string()))?;
    let _ = std::process::Command::new(exe)
        .arg("--store")
        .arg(store_path)
        .arg("serve")
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .spawn();

    for _ in 0..40 {
        std::thread::sleep(std::time::Duration::from_millis(50));
        if discovery::find_live(store_path).is_some() {
            return Ok(());
        }
    }
    Ok(())
}

fn open_browser(url: &str) {
    let opener = if cfg!(target_os = "macos") {
        "open"
    } else if cfg!(target_os = "windows") {
        "cmd"
    } else {
        "xdg-open"
    };
    let _ = std::process::Command::new(opener)
        .arg(url)
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .spawn();
}

fn read_text(file: Option<PathBuf>) -> Result<String, Failure> {
    match file {
        Some(p) => std::fs::read_to_string(p).map_err(|e| Failure::Usage(e.to_string())),
        None => {
            use std::io::Read;
            let mut buf = String::new();
            std::io::stdin().read_to_string(&mut buf).map_err(|e| Failure::Usage(e.to_string()))?;
            Ok(buf)
        }
    }
}

fn parse_json(s: &str) -> Result<Value, Failure> {
    serde_json::from_str(s).map_err(|e| Failure::Usage(format!("malformed JSON: {e}")))
}

fn parse_graph(s: &str) -> Result<GraphId, Failure> {
    GraphId::parse(s).map_err(|e| Failure::Usage(e.to_string()))
}

fn parse_node(s: &str) -> Result<NodeId, Failure> {
    NodeId::parse(s).map_err(|e| Failure::Usage(e.to_string()))
}

fn parse_belief(s: &str) -> Result<BeliefId, Failure> {
    BeliefId::parse(s).map_err(|e| Failure::Usage(e.to_string()))
}

fn parse_provenance(s: &str) -> Result<Provenance, Failure> {
    Ok(match s {
        "user-instruction" => Provenance::UserInstruction,
        "tool-observation" => Provenance::ToolObservation,
        "derived" => Provenance::Derived,
        "hypothesis" => Provenance::Hypothesis,
        "artifact" => Provenance::Artifact,
        "journal" => Provenance::Journal,
        other => return Err(Failure::Usage(format!("unknown provenance `{other}`"))),
    })
}

fn parse_graph_state(s: &str) -> Option<GraphState> {
    Some(match s {
        "draft" => GraphState::Draft,
        "checked" => GraphState::Checked,
        "reviewed" => GraphState::Reviewed,
        "approved" => GraphState::Approved,
        "running" => GraphState::Running,
        "done" => GraphState::Done,
        "failed" => GraphState::Failed,
        "cancelled" => GraphState::Cancelled,
        _ => return None,
    })
}

fn parse_node_state(s: &str) -> Option<NodeState> {
    Some(match s {
        "pending" => NodeState::Pending,
        "ready" => NodeState::Ready,
        "claimed" => NodeState::Claimed,
        "running" => NodeState::Running,
        "awaiting" => NodeState::Awaiting,
        "blocked" => NodeState::Blocked,
        "done" => NodeState::Done,
        "failed" => NodeState::Failed,
        "skipped" => NodeState::Skipped,
        _ => return None,
    })
}

/// `wait` | `expire:<ms>` | `escalate:<ms>` — no default, deliberately.
fn parse_timeout(s: &str) -> Result<TimeoutPolicy, Failure> {
    if s == "wait" {
        return Ok(TimeoutPolicy::Wait);
    }
    let (kind, ms) = s.split_once(':').ok_or_else(|| {
        Failure::Usage("--on-timeout takes `wait`, `expire:<ms>`, or `escalate:<ms>`".into())
    })?;
    let after_ms: u64 = ms
        .parse()
        .map_err(|_| Failure::Usage(format!("`{ms}` is not a number of milliseconds")))?;
    match kind {
        "expire" => Ok(TimeoutPolicy::Expire { after_ms }),
        "escalate" => Ok(TimeoutPolicy::Escalate { after_ms }),
        other => Err(Failure::Usage(format!("unknown timeout policy `{other}`"))),
    }
}

fn parse_interest(s: &str) -> Option<graphene_server::protocol::EventKind> {
    use graphene_server::protocol::EventKind::*;
    Some(match s {
        "node-ready" | "node_ready" => NodeReady,
        "human-resolved" | "human_resolved" => HumanResolved,
        "premise-invalidated" | "premise_invalidated" => PremiseInvalidated,
        "claim-revoked" | "claim_revoked" => ClaimRevoked,
        "node-failed" | "node_failed" => NodeFailed,
        "graph-changed" | "graph_changed" => GraphChanged,
        _ => return None,
    })
}

fn source_system(s: &str) -> &str {
    s.split_once('#').map(|(a, _)| a).unwrap_or(s)
}

fn source_path(s: &str) -> Option<&str> {
    s.split_once('#').map(|(_, b)| b)
}

fn first_line(s: &str) -> String {
    truncate(s.lines().next().unwrap_or(s), 72)
}

fn truncate(s: &str, n: usize) -> String {
    if s.chars().count() <= n {
        s.to_string()
    } else {
        s.chars().take(n.saturating_sub(1)).collect::<String>() + "…"
    }
}
