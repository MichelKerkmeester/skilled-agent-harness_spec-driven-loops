//! Fail-closed projection of authenticated rustc transport records into the
//! shared evidence-v3 runtime model.

use std::collections::{BTreeMap, BTreeSet};

use serde::Serialize;

use crate::{
    coverage_analysis::McdcVector,
    coverage_report::{CoveragePhase, DecisionSnapshot, RuntimeEvent, RuntimeSnapshot},
    rust_compiler_manifest::NormalizedRustCompilerManifest,
    rust_phase_projection::{RustPhaseProjection, project_rust_assertion_phases},
    rust_probe_transport::{RustTransportError, RustTransportRead},
    rust_runtime::RustProbeObservation,
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustCompilerTransportHealth {
    pub committed: u64,
    pub incomplete: u64,
    pub dropped: u64,
    pub attachments: u64,
}

impl RustCompilerTransportHealth {
    pub fn is_complete(&self) -> bool {
        self.incomplete == 0 && self.dropped == 0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustCompilerEvidenceProjection {
    pub assertion_phases: Vec<CoveragePhase>,
    pub attributed: RuntimeSnapshot,
    pub background: RuntimeSnapshot,
    pub health: RustCompilerTransportHealth,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustCompilerEvidenceError {
    Transport(RustTransportError),
    UnknownProbe(String),
    UnknownOrdinal(u64),
    NonEvidenceOrdinal(u64),
    InvalidVector {
        id: String,
        expected: usize,
        actual: usize,
    },
}

impl std::fmt::Display for RustCompilerEvidenceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Transport(error) => error.fmt(formatter),
            Self::UnknownProbe(id) => write!(formatter, "unknown Rust compiler probe {id}"),
            Self::UnknownOrdinal(ordinal) => {
                write!(formatter, "unknown Rust compiler probe ordinal {ordinal}")
            }
            Self::NonEvidenceOrdinal(ordinal) => write!(
                formatter,
                "Rust compiler internal ordinal {ordinal} was emitted as coverage evidence"
            ),
            Self::InvalidVector {
                id,
                expected,
                actual,
            } => write!(
                formatter,
                "Rust compiler decision {id} expected {expected} conditions but observed {actual}"
            ),
        }
    }
}

impl std::error::Error for RustCompilerEvidenceError {}

impl From<RustTransportError> for RustCompilerEvidenceError {
    fn from(error: RustTransportError) -> Self {
        Self::Transport(error)
    }
}

type DecisionVectorKey = (Vec<Option<bool>>, bool);

#[derive(Default)]
struct SnapshotBuilder {
    hits: BTreeSet<String>,
    decisions: BTreeMap<String, BTreeSet<DecisionVectorKey>>,
    events: Vec<RuntimeEvent>,
}

impl SnapshotBuilder {
    fn hit(&mut self, id: &str, phase_id: Option<&str>, timestamp_ms: i64) {
        self.hits.insert(id.into());
        self.events.push(RuntimeEvent {
            event_type: "hit".into(),
            id: id.into(),
            vector: None,
            // The mmap transport intentionally has no wall clock. The phase
            // envelope time satisfies evidence-v3's required field; explicit
            // phase identity, never this value, owns causal attribution.
            timestamp_ms,
            phase_id: phase_id.map(str::to_owned),
            statement_id: None,
            environment: "rust".into(),
        });
    }

    fn decision(
        &mut self,
        id: &str,
        vector: McdcVector,
        phase_id: Option<&str>,
        timestamp_ms: i64,
    ) {
        self.decisions
            .entry(id.into())
            .or_default()
            .insert((vector.values.clone(), vector.outcome));
        self.events.push(RuntimeEvent {
            event_type: "decision".into(),
            id: id.into(),
            vector: Some(vector),
            timestamp_ms,
            phase_id: phase_id.map(str::to_owned),
            statement_id: None,
            environment: "rust".into(),
        });
    }

    fn finish(
        self,
        decisions: &BTreeMap<&str, &crate::coverage_report::DecisionMeta>,
    ) -> RuntimeSnapshot {
        RuntimeSnapshot {
            decisions: self
                .decisions
                .into_iter()
                .map(|(id, vectors)| DecisionSnapshot {
                    meta: (*decisions[&id.as_str()]).clone(),
                    vectors: vectors
                        .into_iter()
                        .map(|(values, outcome)| McdcVector { values, outcome })
                        .collect(),
                })
                .collect(),
            hits: self.hits.into_iter().collect(),
            events: self.events,
            logicals: Vec::new(),
            phase_id: None,
        }
    }
}

fn builder_and_phase<'builder, 'phase>(
    context_id: u64,
    base_context_id: u64,
    base_phase_id: &'phase str,
    phases: &'phase RustPhaseProjection,
    attributed: &'builder mut SnapshotBuilder,
    background: &'builder mut SnapshotBuilder,
) -> Result<(&'builder mut SnapshotBuilder, Option<&'phase str>), RustCompilerEvidenceError> {
    if context_id == 0 {
        return Ok((background, None));
    }
    let phase_id = phases.phase_id_for_context(base_context_id, base_phase_id, context_id)?;
    Ok((attributed, phase_id))
}

/// Project one supervisor-owned transport partition. The caller may supply a
/// complete isolated-process transport or one exact-test partition from a
/// shared stock-libtest transport. Context zero is preserved separately as
/// background evidence and must not be inserted into an ultimately-passing
/// test result by the caller.
pub fn project_rust_compiler_evidence(
    base_context_id: u64,
    base_phase: &CoveragePhase,
    read: &RustTransportRead,
    normalized: &NormalizedRustCompilerManifest,
) -> Result<RustCompilerEvidenceProjection, RustCompilerEvidenceError> {
    let phases =
        project_rust_assertion_phases(base_context_id, base_phase, read, &normalized.manifest)?;
    let points_and_alternatives = normalized
        .manifest
        .points
        .iter()
        .map(|point| point.id.as_str())
        .chain(normalized.manifest.branches.iter().flat_map(|branch| {
            branch
                .alternatives
                .iter()
                .map(|alternative| alternative.id.as_str())
        }))
        .collect::<BTreeSet<_>>();
    let decisions = normalized
        .manifest
        .decisions
        .iter()
        .map(|decision| (decision.id.as_str(), decision))
        .collect::<BTreeMap<_, _>>();
    let mut attributed = SnapshotBuilder::default();
    let mut background = SnapshotBuilder::default();

    for record in &read.observations {
        let (builder, phase_id) = builder_and_phase(
            record.context_id,
            base_context_id,
            &base_phase.id,
            &phases,
            &mut attributed,
            &mut background,
        )?;
        match &record.observation {
            // Assertion markers come from the owned runtime only.
            RustProbeObservation::Assertion { .. } => continue,
            RustProbeObservation::Hit { id, .. } => {
                if !points_and_alternatives.contains(id.as_str()) {
                    return Err(RustCompilerEvidenceError::UnknownProbe(id.clone()));
                }
                builder.hit(id, phase_id, base_phase.started_at_ms);
            }
            RustProbeObservation::Decision {
                id,
                values,
                outcome,
                ..
            } => {
                let Some(meta) = decisions.get(id.as_str()) else {
                    return Err(RustCompilerEvidenceError::UnknownProbe(id.clone()));
                };
                if values.len() != meta.conditions.len() {
                    return Err(RustCompilerEvidenceError::InvalidVector {
                        id: id.clone(),
                        expected: meta.conditions.len(),
                        actual: values.len(),
                    });
                }
                if let Some(selections) = normalized.decision_logical_selection_obligations.get(id)
                {
                    for selection in selections {
                        let alternative_id = if values[selection.right_condition_index].is_some() {
                            &selection.right_evaluated_id
                        } else {
                            &selection.short_circuited_id
                        };
                        builder.hit(alternative_id, phase_id, base_phase.started_at_ms);
                    }
                }
                builder.decision(
                    id,
                    McdcVector {
                        values: values.clone(),
                        outcome: *outcome,
                    },
                    phase_id,
                    base_phase.started_at_ms,
                );
            }
        }
    }
    for record in &read.ordinal_hits {
        let (builder, phase_id) = builder_and_phase(
            record.context_id,
            base_context_id,
            &base_phase.id,
            &phases,
            &mut attributed,
            &mut background,
        )?;
        if normalized.internal_ordinals.contains(&record.ordinal) {
            return Err(RustCompilerEvidenceError::NonEvidenceOrdinal(
                record.ordinal,
            ));
        }
        let Some(ids) = normalized.hit_obligations_by_ordinal.get(&record.ordinal) else {
            return Err(RustCompilerEvidenceError::UnknownOrdinal(record.ordinal));
        };
        for id in ids {
            builder.hit(id, phase_id, base_phase.started_at_ms);
        }
    }

    Ok(RustCompilerEvidenceProjection {
        assertion_phases: phases.phases,
        attributed: attributed.finish(&decisions),
        background: background.finish(&decisions),
        health: RustCompilerTransportHealth {
            committed: read.committed,
            incomplete: read.incomplete,
            dropped: read.dropped,
            attachments: read.attachments,
        },
    })
}

#[cfg(test)]
mod tests {
    use crate::{
        coverage_analysis::PointKind,
        coverage_report::{
            BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
        },
        rust_compiler_manifest::NormalizedRustCompilerManifest,
        rust_probe_transport::{
            RustOrdinalHit, RustPhaseContext, RustTransportObservation, RustTransportRead,
            rust_assertion_context_id,
        },
    };

    use super::*;

    const BASE: u64 = 42;
    const ASSERTION: &str = "rs:decision:0123456789abcdef01234567";

    fn normalized() -> NormalizedRustCompilerManifest {
        NormalizedRustCompilerManifest {
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: vec![DecisionMeta {
                    id: ASSERTION.into(),
                    file: "src/lib.rs".into(),
                    line: 4,
                    column: 4,
                    source: "assert!(value)".into(),
                    conditions: vec!["value".into()],
                    kind: "assertion".into(),
                }],
                points: vec![PointMeta {
                    id: "rs:statement:111111111111111111111111".into(),
                    kind: PointKind::Statement,
                    file: "src/lib.rs".into(),
                    line: 2,
                    column: 4,
                    source: "work();".into(),
                    label: None,
                }],
                branches: vec![BranchMeta {
                    id: "rs:branch:222222222222222222222222".into(),
                    kind: "match-arm".into(),
                    file: "src/lib.rs".into(),
                    line: 3,
                    column: 4,
                    source: "first => work()".into(),
                    alternatives: vec![
                        BranchAlternativeMeta {
                            id: "rs:branch-alternative:333333333333333333333333".into(),
                            label: "selected".into(),
                        },
                        BranchAlternativeMeta {
                            id: "rs:branch-alternative:444444444444444444444444".into(),
                            label: "not selected".into(),
                        },
                    ],
                }],
                limitations: Vec::new(),
                scope: None,
            },
            hit_obligations_by_ordinal: BTreeMap::from([
                (10, vec!["rs:statement:111111111111111111111111".into()]),
                (
                    20,
                    vec![
                        "rs:branch-alternative:333333333333333333333333".into(),
                        "rs:branch-alternative:444444444444444444444444".into(),
                    ],
                ),
            ]),
            internal_ordinals: BTreeSet::from([100]),
            decision_outcome_obligations: BTreeMap::new(),
            decision_loop_obligations: BTreeMap::new(),
            decision_logical_selection_obligations: BTreeMap::new(),
        }
    }

    fn base_phase() -> CoveragePhase {
        CoveragePhase {
            id: "test-phase".into(),
            kind: "test".into(),
            operation: "libtest test".into(),
            source: Some("src/lib.rs".into()),
            caused_by_phase_id: None,
            started_at_ms: 10,
            ended_at_ms: Some(20),
            status: Some("passed".into()),
            error: None,
        }
    }

    #[test]
    fn projects_exact_contexts_ordinals_background_and_health() {
        let assertion = rust_assertion_context_id(BASE, ASSERTION, 0).unwrap();
        let read = RustTransportRead {
            observations: vec![RustTransportObservation {
                process_id: 1,
                context_id: assertion,
                observation: RustProbeObservation::Decision {
                    id: ASSERTION.into(),
                    values: vec![Some(true)],
                    outcome: true,
                },
            }],
            ordinal_hits: vec![
                RustOrdinalHit {
                    process_id: 1,
                    context_id: BASE,
                    ordinal: 10,
                },
                RustOrdinalHit {
                    process_id: 1,
                    context_id: assertion,
                    ordinal: 20,
                },
                RustOrdinalHit {
                    process_id: 1,
                    context_id: 0,
                    ordinal: 10,
                },
            ],
            phases: vec![RustPhaseContext {
                process_id: 1,
                child_context_id: assertion,
                parent_context_id: BASE,
                invocation_nonce: 0,
                decision_id: ASSERTION.into(),
            }],
            committed: 5,
            incomplete: 1,
            dropped: 2,
            attachments: 1,
            ..RustTransportRead::empty()
        };
        let projection =
            project_rust_compiler_evidence(BASE, &base_phase(), &read, &normalized()).unwrap();
        assert_eq!(projection.assertion_phases.len(), 1);
        assert_eq!(
            projection.assertion_phases[0].status.as_deref(),
            Some("passed")
        );
        assert_eq!(projection.attributed.hits.len(), 3);
        assert_eq!(projection.background.hits.len(), 1);
        assert_eq!(projection.attributed.decisions.len(), 1);
        assert!(
            projection
                .attributed
                .events
                .iter()
                .filter(|event| event.id.contains("branch-alternative"))
                .all(|event| event.phase_id == Some(projection.assertion_phases[0].id.clone()))
        );
        assert!(!projection.health.is_complete());
    }

    #[test]
    fn rejects_unknown_ordinals_and_vector_widths() {
        let mut read = RustTransportRead {
            observations: Vec::new(),
            ordinal_hits: vec![RustOrdinalHit {
                process_id: 1,
                context_id: BASE,
                ordinal: 999,
            }],
            phases: Vec::new(),
            committed: 1,
            incomplete: 0,
            dropped: 0,
            attachments: 1,
            ..RustTransportRead::empty()
        };
        assert!(matches!(
            project_rust_compiler_evidence(BASE, &base_phase(), &read, &normalized()),
            Err(RustCompilerEvidenceError::UnknownOrdinal(999))
        ));
        read.ordinal_hits[0].ordinal = 100;
        assert!(matches!(
            project_rust_compiler_evidence(BASE, &base_phase(), &read, &normalized()),
            Err(RustCompilerEvidenceError::NonEvidenceOrdinal(100))
        ));
        read.ordinal_hits.clear();
        read.observations.push(RustTransportObservation {
            process_id: 1,
            context_id: BASE,
            observation: RustProbeObservation::Decision {
                id: ASSERTION.into(),
                values: vec![Some(true), Some(false)],
                outcome: false,
            },
        });
        assert!(matches!(
            project_rust_compiler_evidence(BASE, &base_phase(), &read, &normalized()),
            Err(RustCompilerEvidenceError::InvalidVector {
                expected: 1,
                actual: 2,
                ..
            })
        ));
    }

    #[test]
    fn projects_logical_selection_hits_from_ternary_vectors_without_ordinals() {
        let mut normalized = normalized();
        normalized.manifest.decisions[0].conditions = vec!["left".into(), "right".into()];
        normalized.manifest.branches.push(BranchMeta {
            id: "logical".into(),
            kind: "logical-selection".into(),
            file: "src/lib.rs".into(),
            line: 4,
            column: 4,
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
            ASSERTION.into(),
            vec![
                crate::rust_compiler_manifest::NormalizedRustLogicalSelection {
                    short_circuited_id: "short".into(),
                    right_evaluated_id: "evaluated".into(),
                    right_condition_index: 1,
                },
            ],
        );
        let read = RustTransportRead {
            observations: vec![
                RustTransportObservation {
                    process_id: 1,
                    context_id: BASE,
                    observation: RustProbeObservation::Decision {
                        id: ASSERTION.into(),
                        values: vec![Some(false), None],
                        outcome: false,
                    },
                },
                RustTransportObservation {
                    process_id: 1,
                    context_id: BASE,
                    observation: RustProbeObservation::Decision {
                        id: ASSERTION.into(),
                        values: vec![Some(true), Some(true)],
                        outcome: true,
                    },
                },
            ],
            ordinal_hits: Vec::new(),
            phases: Vec::new(),
            committed: 2,
            incomplete: 0,
            dropped: 0,
            attachments: 1,
            ..RustTransportRead::empty()
        };

        let projection =
            project_rust_compiler_evidence(BASE, &base_phase(), &read, &normalized).unwrap();
        assert_eq!(
            projection.attributed.hits,
            vec!["evaluated".to_string(), "short".to_string()]
        );
        assert_eq!(
            projection
                .attributed
                .events
                .iter()
                .filter(|event| event.event_type == "hit")
                .map(|event| event.id.as_str())
                .collect::<Vec<_>>(),
            vec!["short", "evaluated"]
        );
    }
}
