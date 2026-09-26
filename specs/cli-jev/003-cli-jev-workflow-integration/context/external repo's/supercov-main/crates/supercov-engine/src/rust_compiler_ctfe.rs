//! Strict reconstruction of compiler-owned constant-evaluation evidence.
//!
//! rustc's interpreter step events expose no stable parent span. The exact
//! companion therefore inserts entry/exit markers and records the compiler
//! thread. This module reconstructs a nested invocation stack per compiler
//! process and thread before any observation is allowed to cover an
//! obligation.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

use crate::{
    coverage_analysis::McdcVector,
    coverage_report::{DecisionSnapshot, RuntimeEvent, RuntimeSnapshot},
    rust_compiler_manifest::NormalizedRustCompilerManifest,
};

const BUNDLE_SCHEMA: &str = "supercov-rust-ctfe-unit-v1";

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CtfeBundleFile {
    schema: String,
    #[serde(rename = "crate")]
    crate_name: String,
    mappings: Vec<CtfeMapping>,
    events: Vec<CtfeEvent>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CtfeMapping {
    marker: String,
    definition: String,
    observation_kind: String,
    ordinal: u32,
    hit_ordinals: Vec<String>,
    decision: Option<CtfeDecisionMapping>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CtfeDecisionMapping {
    id: String,
    event: String,
    condition_index: Option<u64>,
    value: Option<bool>,
    outcome: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CtfeEvent {
    #[serde(rename = "crate")]
    crate_name: String,
    kind: String,
    marker: String,
    definition: String,
    observation_kind: String,
    ordinal: u32,
    thread: String,
}

#[derive(Debug)]
struct ActiveDecision {
    id: String,
    values: Vec<Option<bool>>,
}

#[derive(Debug)]
struct ActiveInvocation {
    definition: String,
    decisions: Vec<ActiveDecision>,
    committed_loops: BTreeSet<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustCompilerCtfeUnit {
    pub identity: String,
    pub crate_name: String,
    pub snapshot: RuntimeSnapshot,
    pub observations: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustCompilerCtfeError {
    Io { path: PathBuf, reason: String },
    Invalid(String),
}

impl std::fmt::Display for RustCompilerCtfeError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::Invalid(reason) => write!(formatter, "invalid Rust CTFE evidence: {reason}"),
        }
    }
}

impl std::error::Error for RustCompilerCtfeError {}

fn io_error(path: &Path, error: impl std::fmt::Display) -> RustCompilerCtfeError {
    RustCompilerCtfeError::Io {
        path: path.to_path_buf(),
        reason: error.to_string(),
    }
}

fn parse_u64(value: &str, context: &str) -> Result<u64, RustCompilerCtfeError> {
    if value.is_empty() || (value.len() > 1 && value.starts_with('0')) {
        return Err(RustCompilerCtfeError::Invalid(format!(
            "{context} is not canonical unsigned decimal"
        )));
    }
    value.parse::<u64>().map_err(|_| {
        RustCompilerCtfeError::Invalid(format!("{context} is not canonical unsigned decimal"))
    })
}

fn parse_json<T: for<'de> Deserialize<'de>>(
    path: &Path,
    bytes: &[u8],
) -> Result<T, RustCompilerCtfeError> {
    serde_json::from_slice(bytes)
        .map_err(|error| RustCompilerCtfeError::Invalid(format!("{}: {error}", path.display())))
}

fn ctfe_files(directory: &Path) -> Result<BTreeMap<String, PathBuf>, RustCompilerCtfeError> {
    let mut units = BTreeMap::new();
    for entry in fs::read_dir(directory)
        .map_err(|error| io_error(directory, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(directory, error))?
    {
        let path = entry.path();
        let Some(name) = entry.file_name().to_str().map(str::to_owned) else {
            return Err(RustCompilerCtfeError::Invalid(
                "compiler output contains a non-UTF-8 name".into(),
            ));
        };
        let file_type = entry.file_type().map_err(|error| io_error(&path, error))?;
        if !file_type.is_file() {
            if name.starts_with("ctfe-") || name.starts_with(".ctfe-") {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "CTFE compiler artifact is not a regular file: {name}"
                )));
            }
            continue;
        }
        let identity = name
            .strip_prefix("ctfe-unit-")
            .and_then(|name| name.strip_suffix(".json"))
            .filter(|identity| !identity.is_empty());
        if let Some(identity) = identity {
            if units.insert(identity.to_owned(), path).is_some() {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "duplicate CTFE compiler unit {identity}"
                )));
            }
        } else if name.starts_with("ctfe-") || name.starts_with(".ctfe-") {
            return Err(RustCompilerCtfeError::Invalid(format!(
                "unrecognized or incomplete CTFE compiler artifact {name}"
            )));
        }
    }
    Ok(units)
}

fn reconstruct_unit(
    identity: String,
    bundle_path: &Path,
    normalized: &NormalizedRustCompilerManifest,
    timestamp_ms: i64,
) -> Result<RustCompilerCtfeUnit, RustCompilerCtfeError> {
    let bundle: CtfeBundleFile = parse_json(
        bundle_path,
        &fs::read(bundle_path).map_err(|error| io_error(bundle_path, error))?,
    )?;
    if bundle.schema != BUNDLE_SCHEMA || bundle.crate_name.trim().is_empty() {
        return Err(RustCompilerCtfeError::Invalid(format!(
            "{} has an unsupported schema or empty crate",
            bundle_path.display()
        )));
    }
    let decisions = normalized
        .manifest
        .decisions
        .iter()
        .map(|decision| (decision.id.as_str(), decision))
        .collect::<BTreeMap<_, _>>();
    let mut mappings = BTreeMap::<u64, CtfeMapping>::new();
    for mapping in bundle.mappings {
        let marker = parse_u64(&mapping.marker, "CTFE marker")?;
        if marker == 0
            || mapping.definition.trim().is_empty()
            || !matches!(
                mapping.observation_kind.as_str(),
                "entry"
                    | "block"
                    | "edge"
                    | "selection"
                    | "exit"
                    | "decision-start"
                    | "decision-condition"
                    | "decision-finish"
            )
        {
            return Err(RustCompilerCtfeError::Invalid(format!(
                "malformed mapping for marker {marker}"
            )));
        }
        let mut previous = None;
        for hit in &mapping.hit_ordinals {
            let hit = parse_u64(hit, "CTFE hit ordinal")?;
            if hit == 0 || previous.is_some_and(|previous| previous >= hit) {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "marker {marker} has non-canonical hit ordinals"
                )));
            }
            if normalized.internal_ordinals.contains(&hit)
                || !normalized.hit_obligations_by_ordinal.contains_key(&hit)
            {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "marker {marker} references unknown/non-evidence ordinal {hit}"
                )));
            }
            previous = Some(hit);
        }
        match &mapping.decision {
            None if mapping.observation_kind.starts_with("decision-") => {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "semantic marker {marker} has no decision mapping"
                )));
            }
            Some(_) if !mapping.observation_kind.starts_with("decision-") => {
                return Err(RustCompilerCtfeError::Invalid(format!(
                    "non-decision marker {marker} carries a decision mapping"
                )));
            }
            Some(decision) => {
                let meta = decisions.get(decision.id.as_str()).ok_or_else(|| {
                    RustCompilerCtfeError::Invalid(format!(
                        "marker {marker} references unknown decision {}",
                        decision.id
                    ))
                })?;
                let valid_shape = match decision.event.as_str() {
                    "start" => {
                        mapping.observation_kind == "decision-start"
                            && decision.condition_index.is_none()
                            && decision.value.is_none()
                            && decision.outcome.is_none()
                    }
                    "condition" => {
                        mapping.observation_kind == "decision-condition"
                            && decision
                                .condition_index
                                .is_some_and(|index| index < meta.conditions.len() as u64)
                            && decision.value.is_some()
                            && decision.outcome.is_none()
                    }
                    "finish" => {
                        mapping.observation_kind == "decision-finish"
                            && decision.condition_index.is_none()
                            && decision.value.is_none()
                            && decision.outcome.is_some()
                    }
                    _ => false,
                };
                if !valid_shape {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "marker {marker} has a malformed decision event"
                    )));
                }
                let expected_hits = match decision.event.as_str() {
                    "start" | "condition" => BTreeSet::new(),
                    "finish" => {
                        let outcome = decision.outcome.expect("validated decision outcome");
                        let alternatives = normalized
                            .decision_outcome_obligations
                            .get(&decision.id)
                            .expect("validated decision outcome mapping");
                        let mut expected = BTreeSet::from([if outcome {
                            alternatives.1.as_str()
                        } else {
                            alternatives.0.as_str()
                        }]);
                        if let Some(loop_alternatives) =
                            normalized.decision_loop_obligations.get(&decision.id)
                        {
                            expected.insert(if outcome {
                                loop_alternatives.1.as_str()
                            } else {
                                loop_alternatives.0.as_str()
                            });
                        }
                        expected
                    }
                    _ => unreachable!("validated decision event"),
                };
                let mapped_hits = mapping
                    .hit_ordinals
                    .iter()
                    .map(|ordinal| parse_u64(ordinal, "CTFE hit ordinal"))
                    .collect::<Result<Vec<_>, _>>()?
                    .into_iter()
                    .flat_map(|ordinal| normalized.hit_obligations_by_ordinal[&ordinal].iter())
                    .map(String::as_str)
                    .collect::<BTreeSet<_>>();
                if mapped_hits != expected_hits {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "decision {} {} marker maps to the wrong coverage obligations",
                        decision.id, decision.event
                    )));
                }
            }
            None => {}
        }
        if mappings.insert(marker, mapping).is_some() {
            return Err(RustCompilerCtfeError::Invalid(format!(
                "duplicate CTFE marker {marker}"
            )));
        }
    }
    if mappings.is_empty() {
        return Err(RustCompilerCtfeError::Invalid(format!(
            "{} contains no mappings",
            bundle_path.display()
        )));
    }

    let events = bundle.events;
    let mut stacks = BTreeMap::<String, Vec<ActiveInvocation>>::new();
    let mut hits = BTreeSet::new();
    let mut decision_vectors = BTreeMap::<String, BTreeSet<(Vec<Option<bool>>, bool)>>::new();
    let mut runtime_events = Vec::new();
    for event in &events {
        let mut ignored_hits = BTreeSet::new();
        if event.kind != "ctfe-marker"
            || event.crate_name != bundle.crate_name
            || event.thread.trim().is_empty()
        {
            return Err(RustCompilerCtfeError::Invalid(format!(
                "{} contains malformed event identity",
                bundle_path.display()
            )));
        }
        let marker = parse_u64(&event.marker, "observed CTFE marker")?;
        let mapping = mappings.get(&marker).ok_or_else(|| {
            RustCompilerCtfeError::Invalid(format!("observed CTFE marker {marker} is unmapped"))
        })?;
        if mapping.definition != event.definition
            || mapping.observation_kind != event.observation_kind
            || mapping.ordinal != event.ordinal
        {
            return Err(RustCompilerCtfeError::Invalid(format!(
                "observed CTFE marker {marker} changed identity"
            )));
        }
        let stack = stacks.entry(event.thread.clone()).or_default();
        match event.observation_kind.as_str() {
            "entry" => stack.push(ActiveInvocation {
                definition: event.definition.clone(),
                decisions: Vec::new(),
                committed_loops: BTreeSet::new(),
            }),
            "block" | "edge" | "selection" | "decision-start" | "decision-condition"
            | "decision-finish" => {
                let Some(invocation) = stack.last_mut() else {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "CTFE marker {marker} was observed outside an invocation on {}",
                        event.thread
                    )));
                };
                if invocation.definition != event.definition {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "CTFE marker {marker} crossed invocation identity on {}",
                        event.thread
                    )));
                }
                if let Some(decision) = &mapping.decision {
                    match decision.event.as_str() {
                        "start" => {
                            let meta = decisions[decision.id.as_str()];
                            invocation.decisions.push(ActiveDecision {
                                id: decision.id.clone(),
                                values: vec![None; meta.conditions.len()],
                            });
                        }
                        "condition" => {
                            let active = invocation.decisions.last_mut().ok_or_else(|| {
                                RustCompilerCtfeError::Invalid(format!(
                                    "decision condition {} has no active frame",
                                    decision.id
                                ))
                            })?;
                            if active.id != decision.id {
                                return Err(RustCompilerCtfeError::Invalid(format!(
                                    "decision condition {} crossed active decision {}",
                                    decision.id, active.id
                                )));
                            }
                            let index = usize::try_from(
                                decision.condition_index.expect("validated condition index"),
                            )
                            .map_err(|_| {
                                RustCompilerCtfeError::Invalid(format!(
                                    "decision {} condition index exceeds usize",
                                    decision.id
                                ))
                            })?;
                            if active.values[index]
                                .replace(decision.value.expect("validated condition value"))
                                .is_some()
                            {
                                return Err(RustCompilerCtfeError::Invalid(format!(
                                    "decision {} condition {index} was observed twice",
                                    decision.id
                                )));
                            }
                        }
                        "finish" => {
                            let active = invocation.decisions.pop().ok_or_else(|| {
                                RustCompilerCtfeError::Invalid(format!(
                                    "decision finish {} has no active frame",
                                    decision.id
                                ))
                            })?;
                            if active.id != decision.id {
                                return Err(RustCompilerCtfeError::Invalid(format!(
                                    "decision finish {} closed active decision {}",
                                    decision.id, active.id
                                )));
                            }
                            let outcome = decision.outcome.expect("validated decision outcome");
                            if let Some(loop_alternatives) =
                                normalized.decision_loop_obligations.get(&decision.id)
                                && !invocation.committed_loops.insert(decision.id.clone())
                            {
                                ignored_hits.insert(if outcome {
                                    loop_alternatives.1.clone()
                                } else {
                                    loop_alternatives.0.clone()
                                });
                            }
                            decision_vectors
                                .entry(decision.id.clone())
                                .or_default()
                                .insert((active.values.clone(), outcome));
                            if let Some(selections) = normalized
                                .decision_logical_selection_obligations
                                .get(&decision.id)
                            {
                                for selection in selections {
                                    let alternative_id =
                                        if active.values[selection.right_condition_index].is_some()
                                        {
                                            &selection.right_evaluated_id
                                        } else {
                                            &selection.short_circuited_id
                                        };
                                    hits.insert(alternative_id.clone());
                                    runtime_events.push(RuntimeEvent {
                                        event_type: "hit".into(),
                                        id: alternative_id.clone(),
                                        vector: None,
                                        timestamp_ms,
                                        phase_id: None,
                                        statement_id: None,
                                        environment: "rust-ctfe".into(),
                                    });
                                }
                            }
                            runtime_events.push(RuntimeEvent {
                                event_type: "decision".into(),
                                id: decision.id.clone(),
                                vector: Some(McdcVector {
                                    values: active.values,
                                    outcome,
                                }),
                                timestamp_ms,
                                phase_id: None,
                                statement_id: None,
                                environment: "rust-ctfe".into(),
                            });
                        }
                        _ => unreachable!("validated decision event"),
                    }
                }
            }
            "exit" => {
                let Some(invocation) = stack.pop() else {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "CTFE marker {marker} closed an absent invocation on {}",
                        event.thread
                    )));
                };
                if invocation.definition != event.definition || !invocation.decisions.is_empty() {
                    return Err(RustCompilerCtfeError::Invalid(format!(
                        "CTFE marker {marker} closed the wrong or incomplete invocation on {}",
                        event.thread
                    )));
                }
            }
            _ => unreachable!("validated observation kind"),
        }
        for ordinal in &mapping.hit_ordinals {
            let ordinal = parse_u64(ordinal, "CTFE hit ordinal")?;
            for id in &normalized.hit_obligations_by_ordinal[&ordinal] {
                if ignored_hits.contains(id) {
                    continue;
                }
                hits.insert(id.clone());
                runtime_events.push(RuntimeEvent {
                    event_type: "hit".into(),
                    id: id.clone(),
                    vector: None,
                    timestamp_ms,
                    phase_id: None,
                    statement_id: None,
                    environment: "rust-ctfe".into(),
                });
            }
        }
    }
    if let Some((thread, stack)) = stacks.iter().find(|(_, stack)| !stack.is_empty()) {
        return Err(RustCompilerCtfeError::Invalid(format!(
            "successful compiler unit {identity} left {} CTFE frame(s) open on {thread}",
            stack.len()
        )));
    }
    Ok(RustCompilerCtfeUnit {
        identity,
        crate_name: bundle.crate_name,
        snapshot: RuntimeSnapshot {
            decisions: decision_vectors
                .into_iter()
                .map(|(id, vectors)| DecisionSnapshot {
                    meta: decisions[id.as_str()].clone(),
                    vectors: vectors
                        .into_iter()
                        .map(|(values, outcome)| McdcVector { values, outcome })
                        .collect(),
                })
                .collect(),
            hits: hits.into_iter().collect(),
            events: runtime_events,
            logicals: Vec::new(),
            phase_id: None,
        },
        observations: events.len(),
    })
}

pub fn read_rust_compiler_ctfe(
    directory: &Path,
    normalized: &NormalizedRustCompilerManifest,
    timestamp_ms: i64,
) -> Result<Vec<RustCompilerCtfeUnit>, RustCompilerCtfeError> {
    ctfe_files(directory)?
        .into_iter()
        .map(|(identity, bundle)| reconstruct_unit(identity, &bundle, normalized, timestamp_ms))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use serde_json::{Value, json};

    use crate::{
        coverage_analysis::PointKind,
        coverage_report::{
            BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
        },
    };

    static SCRATCH_NONCE: AtomicU64 = AtomicU64::new(0);

    struct Scratch(PathBuf);

    impl Scratch {
        fn new() -> Self {
            let epoch = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .expect("clock before epoch")
                .as_nanos();
            let path = std::env::temp_dir().join(format!(
                "supercov-rust-ctfe-{}-{epoch}-{}",
                std::process::id(),
                SCRATCH_NONCE.fetch_add(1, Ordering::Relaxed)
            ));
            fs::create_dir_all(&path).expect("create CTFE scratch directory");
            Self(path)
        }

        fn write(&self, map: Value, events: &[Value]) {
            let mut bundle = map;
            bundle["events"] = Value::Array(events.to_vec());
            fs::write(
                self.0.join("ctfe-unit-unit.json"),
                serde_json::to_vec(&bundle).expect("serialize CTFE bundle"),
            )
            .expect("write CTFE bundle");
        }

        fn write_raw(&self, name: &str, bytes: &[u8]) {
            fs::write(self.0.join(name), bytes).expect("write raw CTFE artifact");
        }
    }

    impl Drop for Scratch {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.0);
        }
    }

    fn normalized_manifest() -> NormalizedRustCompilerManifest {
        let decision = DecisionMeta {
            id: "decision".into(),
            file: "src/lib.rs".into(),
            line: 1,
            column: 1,
            source: "value".into(),
            conditions: vec!["value".into()],
            kind: "control".into(),
        };
        let branch = BranchMeta {
            id: "outcome".into(),
            kind: "decision-outcome".into(),
            file: "src/lib.rs".into(),
            line: 1,
            column: 1,
            source: "value".into(),
            alternatives: vec![
                BranchAlternativeMeta {
                    id: "false-alternative".into(),
                    label: "condition false".into(),
                },
                BranchAlternativeMeta {
                    id: "true-alternative".into(),
                    label: "condition true".into(),
                },
            ],
        };
        NormalizedRustCompilerManifest {
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: vec![decision],
                points: vec![PointMeta {
                    id: "function".into(),
                    kind: PointKind::Function,
                    file: "src/lib.rs".into(),
                    line: 1,
                    column: 1,
                    source: "const fn evaluated(value: bool) -> bool".into(),
                    label: None,
                }],
                branches: vec![branch],
                limitations: Vec::new(),
                scope: None,
            },
            hit_obligations_by_ordinal: BTreeMap::from([
                (101, vec!["function".into()]),
                (201, vec!["false-alternative".into()]),
                (202, vec!["true-alternative".into()]),
            ]),
            internal_ordinals: BTreeSet::new(),
            decision_outcome_obligations: BTreeMap::from([(
                "decision".into(),
                ("false-alternative".into(), "true-alternative".into()),
            )]),
            decision_loop_obligations: BTreeMap::new(),
            decision_logical_selection_obligations: BTreeMap::new(),
        }
    }

    fn mapping(
        marker: &str,
        observation_kind: &str,
        hit_ordinals: &[&str],
        decision: Option<Value>,
    ) -> Value {
        json!({
            "marker": marker,
            "definition": "fixture::evaluated",
            "observationKind": observation_kind,
            "ordinal": 0,
            "hitOrdinals": hit_ordinals,
            "decision": decision,
        })
    }

    fn event(marker: &str, observation_kind: &str) -> Value {
        json!({
            "crate": "fixture",
            "kind": "ctfe-marker",
            "marker": marker,
            "definition": "fixture::evaluated",
            "observationKind": observation_kind,
            "ordinal": 0,
            "thread": "compiler-thread-1",
        })
    }

    fn decision_event(
        id: &str,
        event: &str,
        condition_index: Option<u64>,
        value: Option<bool>,
        outcome: Option<bool>,
    ) -> Value {
        json!({
            "id": id,
            "event": event,
            "conditionIndex": condition_index,
            "value": value,
            "outcome": outcome,
        })
    }

    fn valid_map() -> Value {
        json!({
            "schema": BUNDLE_SCHEMA,
            "crate": "fixture",
            "mappings": [
                mapping("1", "entry", &["101"], None),
                mapping("2", "decision-start", &[], Some(decision_event(
                    "decision", "start", None, None, None,
                ))),
                mapping("3", "decision-condition", &[], Some(decision_event(
                    "decision", "condition", Some(0), Some(false), None,
                ))),
                mapping("4", "decision-finish", &["201"], Some(decision_event(
                    "decision", "finish", None, None, Some(false),
                ))),
                mapping("5", "exit", &[], None),
                mapping("6", "decision-condition", &[], Some(decision_event(
                    "decision", "condition", Some(0), Some(true), None,
                ))),
                mapping("7", "decision-finish", &["202"], Some(decision_event(
                    "decision", "finish", None, None, Some(true),
                ))),
            ],
        })
    }

    fn valid_events() -> Vec<Value> {
        [
            ("1", "entry"),
            ("2", "decision-start"),
            ("3", "decision-condition"),
            ("4", "decision-finish"),
            ("5", "exit"),
            ("1", "entry"),
            ("2", "decision-start"),
            ("6", "decision-condition"),
            ("7", "decision-finish"),
            ("5", "exit"),
        ]
        .into_iter()
        .map(|(marker, kind)| event(marker, kind))
        .collect()
    }

    fn loop_manifest() -> NormalizedRustCompilerManifest {
        let mut normalized = normalized_manifest();
        normalized.manifest.decisions[0].kind = "while".into();
        normalized.manifest.branches.push(BranchMeta {
            id: "loop-entry".into(),
            kind: "loop-entry".into(),
            file: "src/lib.rs".into(),
            line: 1,
            column: 1,
            source: "while value".into(),
            alternatives: vec![
                BranchAlternativeMeta {
                    id: "zero-iterations".into(),
                    label: "zero iterations".into(),
                },
                BranchAlternativeMeta {
                    id: "entered".into(),
                    label: "entered".into(),
                },
            ],
        });
        normalized
            .hit_obligations_by_ordinal
            .insert(301, vec!["zero-iterations".into()]);
        normalized
            .hit_obligations_by_ordinal
            .insert(302, vec!["entered".into()]);
        normalized.decision_loop_obligations.insert(
            "decision".into(),
            ("zero-iterations".into(), "entered".into()),
        );
        normalized
    }

    fn loop_map() -> Value {
        let mut map = valid_map();
        map["mappings"][3]["hitOrdinals"] = json!(["201", "301"]);
        map["mappings"][6]["hitOrdinals"] = json!(["202", "302"]);
        map
    }

    #[test]
    fn canonical_unsigned_decimal_rejects_aliases() {
        assert_eq!(parse_u64("12", "marker").unwrap(), 12);
        assert!(parse_u64("012", "marker").is_err());
        assert!(parse_u64("-1", "marker").is_err());
        assert!(parse_u64("", "marker").is_err());
    }

    #[test]
    fn reconstructs_exact_independent_ctfe_vectors_and_outcome_hits() {
        let scratch = Scratch::new();
        scratch.write(valid_map(), &valid_events());

        let units = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42).unwrap();
        assert_eq!(units.len(), 1);
        assert_eq!(units[0].observations, 10);
        assert_eq!(
            units[0].snapshot.hits,
            ["false-alternative", "function", "true-alternative"]
        );
        assert_eq!(units[0].snapshot.decisions.len(), 1);
        assert_eq!(
            units[0].snapshot.decisions[0].vectors,
            [
                McdcVector {
                    values: vec![Some(false)],
                    outcome: false,
                },
                McdcVector {
                    values: vec![Some(true)],
                    outcome: true,
                },
            ]
        );
    }

    #[test]
    fn reconstructs_logical_selection_hits_from_ctfe_ternary_vectors() {
        let scratch = Scratch::new();
        let mut map = valid_map();
        map["mappings"].as_array_mut().unwrap().push(mapping(
            "8",
            "decision-condition",
            &[],
            Some(decision_event(
                "decision",
                "condition",
                Some(1),
                Some(true),
                None,
            )),
        ));
        let events = [
            ("1", "entry"),
            ("2", "decision-start"),
            ("3", "decision-condition"),
            ("4", "decision-finish"),
            ("2", "decision-start"),
            ("6", "decision-condition"),
            ("8", "decision-condition"),
            ("7", "decision-finish"),
            ("5", "exit"),
        ]
        .into_iter()
        .map(|(marker, kind)| event(marker, kind))
        .collect::<Vec<_>>();
        scratch.write(map, &events);

        let mut normalized = normalized_manifest();
        normalized.manifest.decisions[0].conditions = vec!["left".into(), "right".into()];
        normalized.manifest.branches.push(BranchMeta {
            id: "logical".into(),
            kind: "logical-selection".into(),
            file: "src/lib.rs".into(),
            line: 1,
            column: 1,
            source: "left && right".into(),
            alternatives: vec![
                BranchAlternativeMeta {
                    id: "short".into(),
                    label: "short-circuited".into(),
                },
                BranchAlternativeMeta {
                    id: "evaluated".into(),
                    label: "right operand evaluated".into(),
                },
            ],
        });
        normalized.decision_logical_selection_obligations.insert(
            "decision".into(),
            vec![
                crate::rust_compiler_manifest::NormalizedRustLogicalSelection {
                    short_circuited_id: "short".into(),
                    right_evaluated_id: "evaluated".into(),
                    right_condition_index: 1,
                },
            ],
        );

        let units = read_rust_compiler_ctfe(&scratch.0, &normalized, 42).unwrap();
        assert_eq!(
            units[0].snapshot.hits,
            [
                "evaluated",
                "false-alternative",
                "function",
                "short",
                "true-alternative"
            ]
        );
        assert_eq!(
            units[0].snapshot.decisions[0].vectors,
            [
                McdcVector {
                    values: vec![Some(false), None],
                    outcome: false,
                },
                McdcVector {
                    values: vec![Some(true), Some(true)],
                    outcome: true,
                },
            ]
        );
    }

    #[test]
    fn commits_only_the_first_loop_entry_outcome_per_ctfe_invocation() {
        let scratch = Scratch::new();
        let events = [
            ("1", "entry"),
            ("2", "decision-start"),
            ("6", "decision-condition"),
            ("7", "decision-finish"),
            ("2", "decision-start"),
            ("3", "decision-condition"),
            ("4", "decision-finish"),
            ("5", "exit"),
        ]
        .into_iter()
        .map(|(marker, kind)| event(marker, kind))
        .collect::<Vec<_>>();
        scratch.write(loop_map(), &events);

        let units = read_rust_compiler_ctfe(&scratch.0, &loop_manifest(), 42).unwrap();
        assert_eq!(
            units[0].snapshot.hits,
            [
                "entered",
                "false-alternative",
                "function",
                "true-alternative"
            ]
        );
        assert_eq!(
            units[0].snapshot.decisions[0].vectors,
            [
                McdcVector {
                    values: vec![Some(false)],
                    outcome: false,
                },
                McdcVector {
                    values: vec![Some(true)],
                    outcome: true,
                },
            ]
        );
    }

    #[test]
    fn preserves_a_zero_iteration_loop_outcome() {
        let scratch = Scratch::new();
        let events = [
            ("1", "entry"),
            ("2", "decision-start"),
            ("3", "decision-condition"),
            ("4", "decision-finish"),
            ("5", "exit"),
        ]
        .into_iter()
        .map(|(marker, kind)| event(marker, kind))
        .collect::<Vec<_>>();
        scratch.write(loop_map(), &events);

        let units = read_rust_compiler_ctfe(&scratch.0, &loop_manifest(), 42).unwrap();
        assert_eq!(
            units[0].snapshot.hits,
            ["false-alternative", "function", "zero-iterations"]
        );
    }

    #[test]
    fn rejects_semantic_marker_with_unrelated_hit() {
        let scratch = Scratch::new();
        let mut map = valid_map();
        map["mappings"][1]["hitOrdinals"] = json!(["201"]);
        scratch.write(map, &valid_events());

        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("semantic start marker must not carry a coverage hit");
        assert!(error.to_string().contains("wrong coverage obligations"));
    }

    #[test]
    fn rejects_finish_mapped_to_the_wrong_outcome_alternative() {
        let scratch = Scratch::new();
        let mut map = valid_map();
        map["mappings"][3]["hitOrdinals"] = json!(["202"]);
        scratch.write(map, &valid_events());

        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("false finish must not map to the true alternative");
        assert!(error.to_string().contains("wrong coverage obligations"));
    }

    #[test]
    fn rejects_finish_mapped_to_the_wrong_loop_alternative() {
        let scratch = Scratch::new();
        let mut map = loop_map();
        map["mappings"][3]["hitOrdinals"] = json!(["201", "302"]);
        scratch.write(map, &valid_events());

        let error = read_rust_compiler_ctfe(&scratch.0, &loop_manifest(), 42)
            .expect_err("zero-iteration finish must not map to entered");
        assert!(error.to_string().contains("wrong coverage obligations"));
    }

    #[test]
    fn rejects_condition_without_an_active_decision() {
        let scratch = Scratch::new();
        let mut events = valid_events();
        events.remove(1);
        scratch.write(valid_map(), &events);

        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("condition without start must fail closed");
        assert!(error.to_string().contains("has no active frame"));
    }

    #[test]
    fn rejects_exit_with_an_incomplete_decision() {
        let scratch = Scratch::new();
        let events = valid_events()
            .into_iter()
            .enumerate()
            .filter_map(|(index, event)| (index != 3).then_some(event))
            .collect::<Vec<_>>();
        scratch.write(valid_map(), &events);

        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("invocation exit with an open decision must fail closed");
        assert!(error.to_string().contains("wrong or incomplete invocation"));
    }

    #[test]
    fn rejects_legacy_partial_nonregular_and_truncated_units() {
        for (name, bytes, expected) in [
            ("ctfe-map-unit.json", b"{}".as_slice(), "unrecognized"),
            (".ctfe-unit-unit.partial", b"{}".as_slice(), "unrecognized"),
            ("ctfe-unit-unit.json", b"{", "EOF"),
        ] {
            let scratch = Scratch::new();
            scratch.write_raw(name, bytes);
            let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
                .expect_err("recognized invalid CTFE artifact must fail closed");
            assert!(
                error.to_string().contains(expected),
                "unexpected {name} error: {error}"
            );
        }

        let scratch = Scratch::new();
        fs::create_dir(scratch.0.join("ctfe-unit-unit.json"))
            .expect("create nonregular CTFE artifact");
        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("nonregular CTFE artifact must fail closed");
        assert!(error.to_string().contains("not a regular file"));
    }

    #[test]
    fn rejects_unknown_bundle_and_event_fields() {
        let scratch = Scratch::new();
        let mut map = valid_map();
        map["unknown"] = json!(true);
        scratch.write(map, &valid_events());
        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("unknown bundle field must fail closed");
        assert!(error.to_string().contains("unknown field"));

        let scratch = Scratch::new();
        let mut events = valid_events();
        events[0]["unknown"] = json!(true);
        scratch.write(valid_map(), &events);
        let error = read_rust_compiler_ctfe(&scratch.0, &normalized_manifest(), 42)
            .expect_err("unknown event field must fail closed");
        assert!(error.to_string().contains("unknown field"));
    }
}
