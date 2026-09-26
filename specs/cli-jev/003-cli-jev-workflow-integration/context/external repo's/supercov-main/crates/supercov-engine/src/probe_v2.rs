use serde::{Deserialize, Serialize};
use supercov_contracts::{PROBE_V2_JS_MAX_CONDITIONS, PROBE_V2_RADIX};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ConditionValue {
    Unreached,
    False,
    True,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DecisionVector {
    pub values: Vec<ConditionValue>,
    pub outcome: bool,
}

/// Decode the frozen base-3 probe frame without accepting aliased high digits.
pub fn decode(condition_count: usize, encoded: u64, outcome: bool) -> Option<DecisionVector> {
    if condition_count > PROBE_V2_JS_MAX_CONDITIONS {
        return None;
    }
    let mut remaining = encoded;
    let mut values = Vec::with_capacity(condition_count);
    for _ in 0..condition_count {
        let digit = remaining % u64::from(PROBE_V2_RADIX);
        values.push(match digit {
            0 => ConditionValue::Unreached,
            1 => ConditionValue::False,
            2 => ConditionValue::True,
            _ => unreachable!("a radix-3 remainder is always 0, 1, or 2"),
        });
        remaining /= u64::from(PROBE_V2_RADIX);
    }
    (remaining == 0).then_some(DecisionVector { values, outcome })
}

#[cfg(test)]
mod tests {
    use serde::Deserialize;

    use super::*;

    #[derive(Deserialize)]
    struct Fixture {
        conditions: usize,
        encoded: u64,
        outcome: bool,
        vector: FixtureVector,
    }

    #[derive(Deserialize)]
    struct FixtureVector {
        values: Vec<Option<bool>>,
        outcome: bool,
    }

    #[test]
    fn matches_every_language_neutral_contract_vector() {
        let fixtures: Vec<Fixture> =
            serde_json::from_str(include_str!("../test-assets/probe-v2/vectors.json"))
                .expect("probe vectors must be valid JSON");
        for fixture in fixtures {
            let expected = DecisionVector {
                values: fixture
                    .vector
                    .values
                    .into_iter()
                    .map(|value| match value {
                        None => ConditionValue::Unreached,
                        Some(false) => ConditionValue::False,
                        Some(true) => ConditionValue::True,
                    })
                    .collect(),
                outcome: fixture.vector.outcome,
            };
            assert_eq!(
                decode(fixture.conditions, fixture.encoded, fixture.outcome),
                Some(expected)
            );
        }
    }

    #[test]
    fn rejects_width_and_high_digits_instead_of_aliasing() {
        assert_eq!(decode(33, 0, false), None);
        assert_eq!(decode(2, 9, false), None);
    }
}
