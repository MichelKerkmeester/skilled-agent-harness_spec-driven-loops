//! Frozen Rust test-attempt context identity and supervisor collision preflight.

use std::collections::{BTreeMap, BTreeSet};

const DOMAIN: &[u8] = b"supercov-rust-test-v1\0";
const OFFSET_BASIS: u64 = 0xcbf2_9ce4_8422_2325;
const PRIME: u64 = 0x0000_0100_0000_01b3;
const RESERVED_REMAP: u64 = 0xa5a5_a5a5_a5a5_a5a5;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustTestContextError {
    InvalidTestName,
    DuplicateTest(String),
    Collision {
        context_id: u64,
        first: String,
        second: String,
    },
}

impl std::fmt::Display for RustTestContextError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidTestName => write!(formatter, "Rust test name is empty or contains NUL"),
            Self::DuplicateTest(test) => write!(formatter, "duplicate Rust test identity {test}"),
            Self::Collision {
                context_id,
                first,
                second,
            } => write!(
                formatter,
                "Rust test context {context_id:016x} collides between {first} and {second}"
            ),
        }
    }
}

impl std::error::Error for RustTestContextError {}

pub fn rust_test_context_id(test: &str) -> Result<u64, RustTestContextError> {
    if test.is_empty() || test.contains('\0') {
        return Err(RustTestContextError::InvalidTestName);
    }
    let mut value = OFFSET_BASIS;
    for byte in DOMAIN.iter().copied().chain(test.bytes()) {
        value ^= u64::from(byte);
        value = value.wrapping_mul(PRIME);
    }
    Ok(if matches!(value, 0 | u64::MAX) {
        value ^ RESERVED_REMAP
    } else {
        value
    })
}

fn preflight_with(
    tests: impl IntoIterator<Item = String>,
    derive: impl Fn(&str) -> Result<u64, RustTestContextError>,
) -> Result<BTreeMap<String, u64>, RustTestContextError> {
    let mut names = BTreeSet::new();
    let mut owners = BTreeMap::<u64, String>::new();
    let mut contexts = BTreeMap::new();
    for test in tests {
        if !names.insert(test.clone()) {
            return Err(RustTestContextError::DuplicateTest(test));
        }
        let context_id = derive(&test)?;
        if let Some(first) = owners.insert(context_id, test.clone()) {
            return Err(RustTestContextError::Collision {
                context_id,
                first,
                second: test,
            });
        }
        contexts.insert(test, context_id);
    }
    Ok(contexts)
}

pub fn preflight_rust_test_contexts(
    tests: impl IntoIterator<Item = String>,
) -> Result<BTreeMap<String, u64>, RustTestContextError> {
    preflight_with(tests, rust_test_context_id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn derivation_matches_the_compiler_contract_and_handles_unicode() {
        assert_eq!(
            rust_test_context_id("tests::child_context").unwrap(),
            0x4a50_d37c_b3b7_f06f
        );
        assert_ne!(
            rust_test_context_id("tests::δ").unwrap(),
            rust_test_context_id("tests::d").unwrap()
        );
        assert!(matches!(
            rust_test_context_id(""),
            Err(RustTestContextError::InvalidTestName)
        ));
    }

    #[test]
    fn supervisor_rejects_duplicates_and_hash_collisions_before_launch() {
        assert!(matches!(
            preflight_rust_test_contexts(["same".into(), "same".into()]),
            Err(RustTestContextError::DuplicateTest(_))
        ));
        assert!(matches!(
            preflight_with(["first".into(), "second".into()], |_| Ok(7)),
            Err(RustTestContextError::Collision { context_id: 7, .. })
        ));
        let contexts = preflight_rust_test_contexts(["second".into(), "first".into()]).unwrap();
        assert_eq!(
            contexts.keys().cloned().collect::<Vec<_>>(),
            ["first", "second"]
        );
    }
}
