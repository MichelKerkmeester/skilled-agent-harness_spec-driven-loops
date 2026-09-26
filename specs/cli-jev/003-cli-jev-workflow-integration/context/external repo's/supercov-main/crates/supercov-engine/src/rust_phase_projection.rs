//! Exact projection of compiler-owned Rust assertion contexts into evidence v3.

use std::collections::{BTreeMap, BTreeSet};

use sha2::{Digest, Sha256};

use crate::{
    coverage_report::{CoverageManifest, CoveragePhase},
    rust_probe_transport::{
        RustPhaseContext, RustTransportError, RustTransportRead, validate_rust_phase_contexts,
    },
    rust_runtime::RustProbeObservation,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustPhaseProjection {
    pub phases: Vec<CoveragePhase>,
    pub phase_id_by_context: BTreeMap<u64, String>,
    /// Thread phases are execution scope, not evidence-v3 phases: work under
    /// an accepted thread phase belongs to the nearest enclosing assertion
    /// phase or test, exactly as it did on the creating thread.
    pub thread_parent_by_context: BTreeMap<u64, u64>,
}

impl RustPhaseProjection {
    pub fn phase_id_for_context<'a>(
        &'a self,
        base_context_id: u64,
        base_phase_id: &'a str,
        context_id: u64,
    ) -> Result<Option<&'a str>, RustTransportError> {
        if context_id == 0 {
            return Ok(None);
        }
        let mut context_id = context_id;
        let mut hops = 0_usize;
        while let Some(parent) = self.thread_parent_by_context.get(&context_id) {
            hops += 1;
            if hops > self.thread_parent_by_context.len() {
                return Err(RustTransportError::InvalidAssertionContext(format!(
                    "thread phase context cycle at {context_id:016x}"
                )));
            }
            context_id = *parent;
        }
        if context_id == base_context_id {
            return Ok(Some(base_phase_id));
        }
        self.phase_id_by_context
            .get(&context_id)
            .map(String::as_str)
            .map(Some)
            .ok_or_else(|| {
                RustTransportError::InvalidAssertionContext(format!(
                    "context {context_id:016x} has no evidence-v3 phase"
                ))
            })
    }
}

fn phase_id(base_phase_id: &str, context_id: u64, invocation_nonce: u64) -> String {
    let mut digest = Sha256::new();
    digest.update((base_phase_id.len() as u64).to_be_bytes());
    digest.update(base_phase_id.as_bytes());
    digest.update(context_id.to_be_bytes());
    digest.update(invocation_nonce.to_be_bytes());
    let hex = format!("{:x}", digest.finalize());
    format!("rust-phase:{}", &hex[..40])
}

fn assertion_status(
    phase: &RustPhaseContext,
    read: &RustTransportRead,
) -> Result<Option<String>, RustTransportError> {
    let outcomes = read
        .observations
        .iter()
        .filter_map(|record| match &record.observation {
            RustProbeObservation::Decision { id, outcome, .. }
                if record.context_id == phase.child_context_id && id == &phase.decision_id =>
            {
                Some(*outcome)
            }
            _ => None,
        })
        .collect::<BTreeSet<_>>();
    match outcomes.len() {
        0 => Ok(None),
        1 if outcomes.contains(&true) => Ok(Some("passed".into())),
        1 => Ok(Some("failed".into())),
        _ => Err(RustTransportError::InvalidAssertionContext(format!(
            "assertion phase {:016x} committed contradictory outcomes",
            phase.child_context_id
        ))),
    }
}

pub fn project_rust_assertion_phases(
    base_context_id: u64,
    base_phase: &CoveragePhase,
    read: &RustTransportRead,
    manifest: &CoverageManifest,
) -> Result<RustPhaseProjection, RustTransportError> {
    validate_rust_phase_contexts(base_context_id, read)?;
    let decisions = manifest
        .decisions
        .iter()
        .map(|decision| (decision.id.as_str(), decision))
        .collect::<BTreeMap<_, _>>();
    let mut definitions = BTreeMap::<u64, &RustPhaseContext>::new();
    for phase in &read.phases {
        definitions.entry(phase.child_context_id).or_insert(phase);
    }
    let thread_parent_by_context = read
        .thread_phases
        .iter()
        .map(|phase| (phase.child_context_id, phase.parent_context_id))
        .collect::<BTreeMap<_, _>>();
    // Thread phases are execution scope, not causality: an assertion entered
    // on an inherited thread is caused by the nearest enclosing assertion
    // phase or the test itself, exactly as on the creating thread.
    let collapse_thread_parents = |mut context: u64| -> Result<u64, RustTransportError> {
        let mut hops = 0_usize;
        while let Some(parent) = thread_parent_by_context.get(&context) {
            hops += 1;
            if hops > thread_parent_by_context.len() {
                return Err(RustTransportError::InvalidAssertionContext(format!(
                    "thread phase context cycle at {context:016x}"
                )));
            }
            context = *parent;
        }
        Ok(context)
    };
    let phase_id_by_context = definitions
        .values()
        .map(|phase| {
            (
                phase.child_context_id,
                phase_id(
                    &base_phase.id,
                    phase.child_context_id,
                    phase.invocation_nonce,
                ),
            )
        })
        .collect::<BTreeMap<_, _>>();

    let mut ordered = definitions.values().copied().collect::<Vec<_>>();
    ordered.sort_by_key(|phase| phase.invocation_nonce);
    let mut phases = Vec::with_capacity(ordered.len());
    for phase in ordered {
        let decision = decisions.get(phase.decision_id.as_str()).ok_or_else(|| {
            RustTransportError::InvalidAssertionContext(format!(
                "phase {:016x} references unknown decision {}",
                phase.child_context_id, phase.decision_id
            ))
        })?;
        if decision.kind != "assertion" {
            return Err(RustTransportError::InvalidAssertionContext(format!(
                "phase {:016x} references non-assertion decision {}",
                phase.child_context_id, phase.decision_id
            )));
        }
        let parent_context_id = collapse_thread_parents(phase.parent_context_id)?;
        let caused_by_phase_id = if parent_context_id == base_context_id {
            Some(base_phase.id.clone())
        } else {
            Some(
                phase_id_by_context
                    .get(&parent_context_id)
                    .cloned()
                    .ok_or_else(|| {
                        RustTransportError::InvalidAssertionContext(format!(
                            "phase {:016x} has unresolved parent {:016x}",
                            phase.child_context_id, parent_context_id
                        ))
                    })?,
            )
        };
        let status = assertion_status(phase, read)?;
        phases.push(CoveragePhase {
            id: phase_id_by_context[&phase.child_context_id].clone(),
            kind: "assertion".into(),
            operation: format!(
                "Rust assertion at {}:{}:{}",
                decision.file, decision.line, decision.column
            ),
            source: Some(decision.source.clone()),
            caused_by_phase_id,
            started_at_ms: base_phase.started_at_ms,
            ended_at_ms: status.as_ref().and(base_phase.ended_at_ms),
            status,
            error: None,
        });
    }
    Ok(RustPhaseProjection {
        phases,
        phase_id_by_context,
        thread_parent_by_context,
    })
}

#[cfg(test)]
mod tests {
    use crate::{
        coverage_report::{CoverageManifest, CoveragePhase, DecisionMeta},
        rust_probe_transport::{
            RustPhaseContext, RustThreadPhase, RustTransportObservation, RustTransportRead,
            rust_assertion_context_id, rust_thread_context_id,
        },
        rust_runtime::RustProbeObservation,
    };

    use super::*;

    const BASE: u64 = 42;
    const ASSERTION: &str = "rs:decision:0123456789abcdef01234567";

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

    fn manifest() -> CoverageManifest {
        CoverageManifest {
            unmeasured: Vec::new(),
            decisions: vec![DecisionMeta {
                id: ASSERTION.into(),
                file: "src/lib.rs".into(),
                line: 7,
                column: 5,
                source: "assert!(value)".into(),
                conditions: vec!["value".into()],
                kind: "assertion".into(),
            }],
            points: Vec::new(),
            branches: Vec::new(),
            limitations: Vec::new(),
            scope: None,
        }
    }

    #[test]
    fn repeated_and_nested_assertions_become_distinct_causal_evidence_phases() {
        let first = rust_assertion_context_id(BASE, ASSERTION, 0).unwrap();
        let repeated = rust_assertion_context_id(BASE, ASSERTION, 1).unwrap();
        let nested = rust_assertion_context_id(first, ASSERTION, 2).unwrap();
        let phases = vec![
            RustPhaseContext {
                process_id: 1,
                child_context_id: first,
                parent_context_id: BASE,
                invocation_nonce: 0,
                decision_id: ASSERTION.into(),
            },
            RustPhaseContext {
                process_id: 2,
                child_context_id: repeated,
                parent_context_id: BASE,
                invocation_nonce: 1,
                decision_id: ASSERTION.into(),
            },
            RustPhaseContext {
                process_id: 1,
                child_context_id: nested,
                parent_context_id: first,
                invocation_nonce: 2,
                decision_id: ASSERTION.into(),
            },
        ];
        let observations = [(first, true), (repeated, false)]
            .into_iter()
            .map(|(context_id, outcome)| RustTransportObservation {
                process_id: 1,
                context_id,
                observation: RustProbeObservation::Decision {
                    id: ASSERTION.into(),
                    values: vec![Some(outcome)],
                    outcome,
                },
            })
            .collect();
        let thread_under_first = rust_thread_context_id(first, 9);
        let thread_under_base = rust_thread_context_id(BASE, 10);
        let read = RustTransportRead {
            observations,
            ordinal_hits: Vec::new(),
            phases,
            thread_phases: vec![
                RustThreadPhase {
                    process_id: 1,
                    child_context_id: thread_under_first,
                    parent_context_id: first,
                    invocation_nonce: 9,
                    commit_index: 5,
                },
                RustThreadPhase {
                    process_id: 1,
                    child_context_id: thread_under_base,
                    parent_context_id: BASE,
                    invocation_nonce: 10,
                    commit_index: 6,
                },
            ],
            committed: 7,
            attachments: 2,
            ..RustTransportRead::empty()
        };
        let projection =
            project_rust_assertion_phases(BASE, &base_phase(), &read, &manifest()).unwrap();
        assert_eq!(
            projection
                .phase_id_for_context(BASE, "test-phase", thread_under_first)
                .unwrap(),
            Some(projection.phases[0].id.as_str()),
            "thread work belongs to the nearest enclosing assertion phase"
        );
        assert_eq!(
            projection
                .phase_id_for_context(BASE, "test-phase", thread_under_base)
                .unwrap(),
            Some("test-phase"),
            "thread work directly under the test belongs to the test phase"
        );
        assert_eq!(projection.phases.len(), 3);
        assert_eq!(
            projection
                .phases
                .iter()
                .map(|phase| phase.id.as_str())
                .collect::<BTreeSet<_>>()
                .len(),
            3
        );
        assert_eq!(projection.phases[0].status.as_deref(), Some("passed"));
        assert_eq!(projection.phases[1].status.as_deref(), Some("failed"));
        assert_eq!(projection.phases[2].status, None);
        assert_eq!(
            projection.phases[2].caused_by_phase_id.as_deref(),
            Some(projection.phases[0].id.as_str())
        );
        assert_eq!(
            projection
                .phase_id_for_context(BASE, "test-phase", repeated)
                .unwrap(),
            Some(projection.phases[1].id.as_str())
        );
        assert_eq!(
            projection
                .phase_id_for_context(BASE, "test-phase", 0)
                .unwrap(),
            None
        );
    }
}
