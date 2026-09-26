//! Language-neutral coverage arithmetic and masking MC/DC witness search.
//!
//! Frontends provide obligations and observed vectors; this module owns the
//! structural verdicts for every language. Witness selection is deterministic
//! in observation order while bitsets avoid a scalar pair scan for each
//! condition.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct McdcVector {
    pub values: Vec<Option<bool>>,
    pub outcome: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WitnessIndexes {
    pub first: usize,
    pub second: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AnalysisError {
    EmptyDecision {
        decision: usize,
    },
    InconsistentVectorWidth {
        vector: usize,
        expected: usize,
        actual: usize,
    },
}

#[derive(Clone)]
struct Bits(Vec<u64>);

impl Bits {
    fn empty(items: usize) -> Self {
        Self(vec![0; items.div_ceil(64)])
    }

    fn insert(&mut self, index: usize) {
        self.0[index / 64] |= 1_u64 << (index % 64);
    }

    fn and_assign(&mut self, other: &Self) {
        for (word, mask) in self.0.iter_mut().zip(&other.0) {
            *word &= mask;
        }
    }

    fn and_not_assign(&mut self, other: &Self) {
        for (word, mask) in self.0.iter_mut().zip(&other.0) {
            *word &= !mask;
        }
    }

    fn remove_through(&mut self, index: usize) {
        let word = index / 64;
        for entry in &mut self.0[..word] {
            *entry = 0;
        }
        if let Some(entry) = self.0.get_mut(word) {
            let bit = index % 64;
            *entry &= if bit == 63 { 0 } else { !0_u64 << (bit + 1) };
        }
    }

    fn first(&self) -> Option<usize> {
        self.0.iter().enumerate().find_map(|(word, value)| {
            (*value != 0).then(|| word * 64 + value.trailing_zeros() as usize)
        })
    }
}

pub fn is_independence_pair(first: &McdcVector, second: &McdcVector, condition: usize) -> bool {
    if first.values.len() != second.values.len() || condition >= first.values.len() {
        return false;
    }
    let (Some(first_target), Some(second_target)) =
        (first.values[condition], second.values[condition])
    else {
        return false;
    };
    if first_target == second_target || first.outcome == second.outcome {
        return false;
    }
    first
        .values
        .iter()
        .zip(&second.values)
        .enumerate()
        .all(|(index, (left, right))| {
            index == condition || left.is_none() || right.is_none() || left == right
        })
}

/// Return the same first witness pair as the reference nested-order scan for
/// every condition, using dense bitsets to reject incompatible candidates.
pub fn find_witnesses(
    vectors: &[McdcVector],
) -> Result<Vec<Option<WitnessIndexes>>, AnalysisError> {
    let width = vectors.first().map_or(0, |vector| vector.values.len());
    find_witnesses_for_conditions(vectors, width)
}

/// Find witnesses against the manifest denominator. Unlike [`find_witnesses`],
/// this retains every condition when a decision has no observations.
pub fn find_witnesses_for_conditions(
    vectors: &[McdcVector],
    width: usize,
) -> Result<Vec<Option<WitnessIndexes>>, AnalysisError> {
    for (index, vector) in vectors.iter().enumerate() {
        if vector.values.len() != width {
            return Err(AnalysisError::InconsistentVectorWidth {
                vector: index,
                expected: width,
                actual: vector.values.len(),
            });
        }
    }
    let mut outcomes = [Bits::empty(vectors.len()), Bits::empty(vectors.len())];
    let mut false_values = (0..width)
        .map(|_| Bits::empty(vectors.len()))
        .collect::<Vec<_>>();
    let mut true_values = false_values.clone();
    for (index, vector) in vectors.iter().enumerate() {
        outcomes[usize::from(vector.outcome)].insert(index);
        for (condition, value) in vector.values.iter().enumerate() {
            match value {
                Some(false) => false_values[condition].insert(index),
                Some(true) => true_values[condition].insert(index),
                None => {}
            }
        }
    }

    let witnesses = (0..width)
        .map(|target| {
            for (left_index, left) in vectors.iter().enumerate() {
                let Some(left_target) = left.values[target] else {
                    continue;
                };
                let mut candidates = outcomes[usize::from(!left.outcome)].clone();
                candidates.and_assign(if left_target {
                    &false_values[target]
                } else {
                    &true_values[target]
                });
                candidates.remove_through(left_index);
                for (condition, value) in left.values.iter().enumerate() {
                    if condition == target {
                        continue;
                    }
                    match value {
                        Some(false) => candidates.and_not_assign(&true_values[condition]),
                        Some(true) => candidates.and_not_assign(&false_values[condition]),
                        None => {}
                    }
                }
                if let Some(second) = candidates.first() {
                    debug_assert!(is_independence_pair(left, &vectors[second], target));
                    return Some(WitnessIndexes {
                        first: left_index,
                        second,
                    });
                }
            }
            None
        })
        .collect();
    Ok(witnesses)
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PointKind {
    Statement,
    Function,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PointCoverage {
    pub kind: PointKind,
    pub covered: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BranchCoverage {
    pub kind: String,
    pub alternatives: Vec<bool>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DecisionCoverage {
    pub condition_count: usize,
    pub vectors: Vec<McdcVector>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CoverageCoreInput {
    pub decisions: Vec<DecisionCoverage>,
    pub points: Vec<PointCoverage>,
    pub branches: Vec<BranchCoverage>,
    pub lines: Vec<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoverageCount {
    pub covered: usize,
    pub total: usize,
    #[serde(serialize_with = "serialize_javascript_number")]
    pub percentage: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoverageSummary {
    pub decisions: usize,
    pub executed_decisions: usize,
    pub covered_decisions: usize,
    pub conditions: usize,
    pub covered_conditions: usize,
    #[serde(serialize_with = "serialize_javascript_number")]
    pub condition_coverage_pct: f64,
    pub lines: CoverageCount,
    pub statements: CoverageCount,
    pub functions: CoverageCount,
    pub branches: CoverageCount,
    pub decision_outcomes: CoverageCount,
    pub condition_outcomes: CoverageCount,
    pub value_selections: CoverageCount,
    pub coverage_complete: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub completeness_blocked: Option<bool>,
    /// Obligations Supercov declined to measure exactly. They are excluded
    /// from every covered/uncovered count above, because a measurement gap is
    /// not a coverage gap and reporting one as the other is a wrong number.
    /// Absent when everything was measured, so fully exact runs keep their
    /// existing output byte for byte.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unmeasured_obligations: Option<usize>,
    /// Share of obligations Supercov measured exactly, as a percentage. This
    /// is the number that must ratchet toward 100 and never regress.
    #[serde(
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_optional_javascript_number"
    )]
    pub exact_fraction_pct: Option<f64>,
}

pub(crate) fn serialize_optional_javascript_number<S>(
    value: &Option<f64>,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match value {
        Some(value) => serialize_javascript_number(value, serializer),
        None => serializer.serialize_none(),
    }
}

/// `JSON.stringify` emits integer-valued Numbers without a trailing `.0`.
/// Agent output is a frozen byte contract, so match that representation while
/// retaining floating-point arithmetic internally.
pub(crate) fn serialize_javascript_number<S>(value: &f64, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    const MAX_SAFE_INTEGER: f64 = 9_007_199_254_740_991.0;
    if value.is_finite() && value.fract() == 0.0 && value.abs() <= MAX_SAFE_INTEGER {
        serializer.serialize_i64(*value as i64)
    } else {
        serializer.serialize_f64(*value)
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoverageCoreOutput {
    pub witnesses: Vec<Vec<Option<WitnessIndexes>>>,
    pub summary: CoverageSummary,
}

fn percentage(covered: usize, total: usize) -> f64 {
    if total == 0 {
        100.0
    } else {
        ((covered as f64 / total as f64) * 10_000.0).round() / 100.0
    }
}

fn count(covered: usize, total: usize) -> CoverageCount {
    CoverageCount {
        covered,
        total,
        percentage: percentage(covered, total),
    }
}

pub fn analyze_core(input: &CoverageCoreInput) -> Result<CoverageCoreOutput, AnalysisError> {
    let witnesses = input
        .decisions
        .iter()
        .enumerate()
        .map(|(decision, coverage)| {
            if coverage.condition_count == 0 {
                return Err(AnalysisError::EmptyDecision { decision });
            }
            find_witnesses_for_conditions(&coverage.vectors, coverage.condition_count)
        })
        .collect::<Result<Vec<_>, _>>()?;
    let conditions = witnesses.iter().map(Vec::len).sum::<usize>();
    let covered_conditions = witnesses
        .iter()
        .flatten()
        .filter(|witness| witness.is_some())
        .count();
    let executed_decisions = input
        .decisions
        .iter()
        .filter(|coverage| !coverage.vectors.is_empty())
        .count();
    let covered_decisions = witnesses
        .iter()
        .filter(|conditions| conditions.iter().all(Option::is_some))
        .count();
    let decision_outcome_covered = input
        .decisions
        .iter()
        .map(|coverage| {
            let vectors = &coverage.vectors;
            usize::from(vectors.iter().any(|vector| !vector.outcome))
                + usize::from(vectors.iter().any(|vector| vector.outcome))
        })
        .sum::<usize>();
    let condition_outcome_covered = input
        .decisions
        .iter()
        .map(|coverage| {
            (0..coverage.condition_count)
                .map(|condition| {
                    usize::from(
                        coverage
                            .vectors
                            .iter()
                            .any(|vector| vector.values[condition] == Some(false)),
                    ) + usize::from(
                        coverage
                            .vectors
                            .iter()
                            .any(|vector| vector.values[condition] == Some(true)),
                    )
                })
                .sum::<usize>()
        })
        .sum::<usize>();
    let generic_alternative_total = input
        .branches
        .iter()
        .map(|branch| branch.alternatives.len())
        .sum::<usize>();
    let generic_alternative_covered = input
        .branches
        .iter()
        .flat_map(|branch| &branch.alternatives)
        .filter(|covered| **covered)
        .count();
    let value_branches = input
        .branches
        .iter()
        .filter(|branch| branch.kind == "logical-value")
        .collect::<Vec<_>>();
    let value_alternative_total = value_branches
        .iter()
        .map(|branch| branch.alternatives.len())
        .sum::<usize>();
    let value_alternative_covered = value_branches
        .iter()
        .flat_map(|branch| &branch.alternatives)
        .filter(|covered| **covered)
        .count();
    let statements = input
        .points
        .iter()
        .filter(|point| point.kind == PointKind::Statement)
        .collect::<Vec<_>>();
    let functions = input
        .points
        .iter()
        .filter(|point| point.kind == PointKind::Function)
        .collect::<Vec<_>>();
    let lines = count(
        input.lines.iter().filter(|covered| **covered).count(),
        input.lines.len(),
    );
    let statements = count(
        statements.iter().filter(|point| point.covered).count(),
        statements.len(),
    );
    let functions = count(
        functions.iter().filter(|point| point.covered).count(),
        functions.len(),
    );
    let branches = count(
        decision_outcome_covered + generic_alternative_covered,
        input.decisions.len() * 2 + generic_alternative_total,
    );
    let decision_outcomes = count(decision_outcome_covered, input.decisions.len() * 2);
    let condition_outcomes = count(condition_outcome_covered, conditions * 2);
    let value_selections = count(value_alternative_covered, value_alternative_total);
    let condition_coverage_pct = percentage(covered_conditions, conditions);
    let coverage_complete = lines.percentage == 100.0
        && statements.percentage == 100.0
        && functions.percentage == 100.0
        && branches.percentage == 100.0
        && condition_outcomes.percentage == 100.0
        && condition_coverage_pct == 100.0;
    Ok(CoverageCoreOutput {
        witnesses,
        summary: CoverageSummary {
            unmeasured_obligations: None,
            exact_fraction_pct: None,
            decisions: input.decisions.len(),
            executed_decisions,
            covered_decisions,
            conditions,
            covered_conditions,
            condition_coverage_pct,
            lines,
            statements,
            functions,
            branches,
            decision_outcomes,
            condition_outcomes,
            value_selections,
            coverage_complete,
            completeness_blocked: None,
        },
    })
}

#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};

    use super::*;

    #[derive(Deserialize)]
    struct Oracle {
        conditions: usize,
        #[serde(rename = "observedVectors")]
        observed_vectors: Vec<Vec<Option<bool>>>,
        outcomes: Vec<bool>,
        cases: Vec<OracleCase>,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct OracleCase {
        input_indexes: Vec<usize>,
        covered_conditions: usize,
    }

    #[derive(Serialize)]
    struct JavascriptNumber {
        #[serde(serialize_with = "serialize_javascript_number")]
        value: f64,
    }

    #[test]
    fn serializes_positive_and_negative_integers_like_json_stringify() {
        assert_eq!(
            serde_json::to_string(&JavascriptNumber { value: 50.0 }).unwrap(),
            r#"{"value":50}"#
        );
        assert_eq!(
            serde_json::to_string(&JavascriptNumber { value: -50.0 }).unwrap(),
            r#"{"value":-50}"#
        );
        assert_eq!(
            serde_json::to_string(&JavascriptNumber { value: -0.0 }).unwrap(),
            r#"{"value":0}"#
        );
    }

    #[test]
    fn masking_witnesses_match_the_independent_clang_oracle() {
        let oracle: Oracle = serde_json::from_str(include_str!(
            "../../../tests/fixtures/clang-mcdc/oracle.json"
        ))
        .expect("Clang oracle fixture must be valid JSON");
        for case in oracle.cases {
            let vectors = case
                .input_indexes
                .iter()
                .map(|index| McdcVector {
                    values: oracle.observed_vectors[*index].clone(),
                    outcome: oracle.outcomes[*index],
                })
                .collect::<Vec<_>>();
            let witnesses = find_witnesses(&vectors).expect("uniform oracle vectors");
            assert_eq!(witnesses.len(), oracle.conditions);
            assert_eq!(
                witnesses.iter().filter(|witness| witness.is_some()).count(),
                case.covered_conditions
            );
        }
    }

    #[test]
    fn bitset_search_preserves_the_frozen_first_pair_order() {
        let vectors = vec![
            McdcVector {
                values: vec![Some(false), None],
                outcome: false,
            },
            McdcVector {
                values: vec![Some(true), Some(false)],
                outcome: false,
            },
            McdcVector {
                values: vec![Some(true), Some(true)],
                outcome: true,
            },
            McdcVector {
                values: vec![Some(false), None],
                outcome: false,
            },
        ];
        assert_eq!(
            find_witnesses(&vectors).unwrap(),
            vec![
                Some(WitnessIndexes {
                    first: 0,
                    second: 2
                }),
                Some(WitnessIndexes {
                    first: 1,
                    second: 2
                }),
            ]
        );
    }

    #[test]
    fn rejects_mixed_vector_widths() {
        assert_eq!(
            find_witnesses(&[
                McdcVector {
                    values: vec![Some(true)],
                    outcome: true
                },
                McdcVector {
                    values: vec![],
                    outcome: false
                },
            ]),
            Err(AnalysisError::InconsistentVectorWidth {
                vector: 1,
                expected: 1,
                actual: 0,
            })
        );
    }

    #[test]
    fn retains_unexecuted_manifest_conditions_in_the_denominator() {
        let output = analyze_core(&CoverageCoreInput {
            decisions: vec![DecisionCoverage {
                condition_count: 3,
                vectors: vec![],
            }],
            points: vec![],
            branches: vec![],
            lines: vec![],
        })
        .unwrap();
        assert_eq!(output.summary.conditions, 3);
        assert_eq!(output.summary.covered_conditions, 0);
        assert_eq!(output.summary.condition_coverage_pct, 0.0);
        assert_eq!(output.witnesses, vec![vec![None, None, None]]);
    }
}
