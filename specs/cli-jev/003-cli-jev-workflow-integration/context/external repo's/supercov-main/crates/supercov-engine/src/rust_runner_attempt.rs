//! Exact attempt identity exposed by Rust test runners.
//!
//! Runner identity is an input contract, not an output heuristic. Standard
//! Cargo/libtest has one attempt. Nextest exposes exact list/run and retry
//! identity to target runners; partial identity and unsupported stress axes
//! fail before user test execution.

use std::{collections::BTreeMap, ffi::OsString};

pub const MINIMUM_NEXTEST_ATTEMPT_VERSION: (u64, u64, u64) = (0, 9, 138);
pub const MAXIMUM_NEXTEST_ATTEMPT_VERSION: (u64, u64, u64) = (0, 9, 140);
pub const VERIFIED_NEXTEST_ATTEMPT_VERSIONS: &[(u64, u64, u64)] = &[
    MINIMUM_NEXTEST_ATTEMPT_VERSION,
    MAXIMUM_NEXTEST_ATTEMPT_VERSION,
];

const EXECUTION_IDENTITY_KEYS: &[&str] = &[
    "NEXTEST_RUN_ID",
    "NEXTEST_VERSION",
    "NEXTEST_EXECUTION_MODE",
    "NEXTEST_BINARY_ID",
    "NEXTEST_TEST_NAME",
    "NEXTEST_ATTEMPT",
    "NEXTEST_TOTAL_ATTEMPTS",
    "NEXTEST_ATTEMPT_ID",
    "NEXTEST_STRESS_CURRENT",
    "NEXTEST_STRESS_TOTAL",
];

const ATTEMPT_KEYS: &[&str] = &[
    "NEXTEST_TEST_NAME",
    "NEXTEST_ATTEMPT",
    "NEXTEST_TOTAL_ATTEMPTS",
    "NEXTEST_ATTEMPT_ID",
    "NEXTEST_STRESS_CURRENT",
    "NEXTEST_STRESS_TOTAL",
];

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NextestInvocationIdentity {
    pub run_id: String,
    pub version: String,
    pub binary_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NextestAttemptIdentity {
    pub invocation: NextestInvocationIdentity,
    pub test_name: String,
    pub retry: usize,
    pub total_attempts: usize,
    pub runner_attempt_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustRunnerInvocationIdentity {
    CargoSingleAttempt,
    NextestList(NextestInvocationIdentity),
    NextestAttempt(NextestAttemptIdentity),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustRunnerAttemptError(pub String);

impl std::fmt::Display for RustRunnerAttemptError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(&self.0)
    }
}

impl std::error::Error for RustRunnerAttemptError {}

fn value(
    environment: &BTreeMap<OsString, OsString>,
    key: &str,
) -> Result<Option<String>, RustRunnerAttemptError> {
    environment
        .get(&OsString::from(key))
        .map(|value| {
            value.clone().into_string().map_err(|_| {
                RustRunnerAttemptError(format!("{key} contains non-UTF-8 runner identity"))
            })
        })
        .transpose()
}

fn required(
    environment: &BTreeMap<OsString, OsString>,
    key: &str,
) -> Result<String, RustRunnerAttemptError> {
    let value = value(environment, key)?
        .ok_or_else(|| RustRunnerAttemptError(format!("nextest attempt identity lacks {key}")))?;
    if value.is_empty() || value.len() > 4_096 || value.contains(['\r', '\n', '\0']) {
        return Err(RustRunnerAttemptError(format!(
            "{key} is empty, oversized, or not a single-line identity"
        )));
    }
    Ok(value)
}

fn parse_version(value: &str) -> Result<(u64, u64, u64), RustRunnerAttemptError> {
    let mut parts = value.split('.');
    let mut parse = |name: &str| {
        parts
            .next()
            .ok_or_else(|| RustRunnerAttemptError(format!("nextest version lacks {name}")))?
            .parse::<u64>()
            .map_err(|_| RustRunnerAttemptError(format!("nextest version has invalid {name}")))
    };
    let version = (parse("major")?, parse("minor")?, parse("patch")?);
    if parts.next().is_some() {
        return Err(RustRunnerAttemptError(
            "nextest version must have exactly three numeric components".into(),
        ));
    }
    Ok(version)
}

pub fn validate_nextest_version(value: &str) -> Result<(), RustRunnerAttemptError> {
    let version = parse_version(value)?;
    if version < MINIMUM_NEXTEST_ATTEMPT_VERSION {
        return Err(RustRunnerAttemptError(format!(
            "nextest {value} predates the frozen 0.9.138 target-runner identity contract"
        )));
    }
    if version > MAXIMUM_NEXTEST_ATTEMPT_VERSION {
        return Err(RustRunnerAttemptError(format!(
            "nextest {value} is newer than the verified 0.9.140 command and identity contract"
        )));
    }
    if !VERIFIED_NEXTEST_ATTEMPT_VERSIONS.contains(&version) {
        return Err(RustRunnerAttemptError(format!(
            "nextest {value} is not one of the verified released target-runner contracts (0.9.138, 0.9.140)"
        )));
    }
    Ok(())
}

pub fn parse_nextest_version_output(output: &[u8]) -> Result<String, RustRunnerAttemptError> {
    let output = std::str::from_utf8(output)
        .map_err(|_| RustRunnerAttemptError("nextest --version output is not UTF-8".into()))?;
    if output.contains('\r') {
        return Err(RustRunnerAttemptError(
            "nextest --version output contains a carriage return".into(),
        ));
    }
    let mut lines = output.trim_end_matches('\n').split('\n');
    let first_line = lines.next().unwrap_or_default();
    let mut fields = first_line.split_ascii_whitespace();
    if fields.next() != Some("cargo-nextest") {
        return Err(RustRunnerAttemptError(
            "nextest --version output lacks the cargo-nextest product identity".into(),
        ));
    }
    let version = fields
        .next()
        .ok_or_else(|| RustRunnerAttemptError("nextest --version output lacks a version".into()))?;
    validate_nextest_version(version)?;
    let first_line_metadata = fields.collect::<Vec<_>>();
    let release = lines.next().ok_or_else(|| {
        RustRunnerAttemptError("nextest --version output lacks release metadata".into())
    })?;
    if release != format!("release: {version}") {
        return Err(RustRunnerAttemptError(
            "nextest --version release metadata disagrees with its product version".into(),
        ));
    }
    let remaining = lines.collect::<Vec<_>>();
    let (commit_hash, commit_date, host) = match remaining.as_slice() {
        [host] => (None, None, *host),
        [commit_hash, commit_date, host] => (Some(*commit_hash), Some(*commit_date), *host),
        _ => {
            return Err(RustRunnerAttemptError(
                "nextest --version output has an unknown metadata layout".into(),
            ));
        }
    };
    let host = host
        .strip_prefix("host: ")
        .filter(|host| !host.is_empty())
        .ok_or_else(|| {
            RustRunnerAttemptError("nextest --version output lacks a build host".into())
        })?;
    if host.len() > 255 || !host.is_ascii() {
        return Err(RustRunnerAttemptError(
            "nextest --version build host is oversized or non-ASCII".into(),
        ));
    }
    match (commit_hash, commit_date) {
        (Some(commit_hash), Some(commit_date)) => {
            let commit_hash = commit_hash
                .strip_prefix("commit-hash: ")
                .filter(|hash| {
                    hash.len() >= 9
                        && hash.len() <= 64
                        && hash
                            .bytes()
                            .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase())
                })
                .ok_or_else(|| {
                    RustRunnerAttemptError(
                        "nextest --version output has an invalid commit hash".into(),
                    )
                })?;
            let commit_date = commit_date
                .strip_prefix("commit-date: ")
                .filter(|date| {
                    date.len() == 10
                        && date.bytes().enumerate().all(|(index, byte)| {
                            if matches!(index, 4 | 7) {
                                byte == b'-'
                            } else {
                                byte.is_ascii_digit()
                            }
                        })
                })
                .ok_or_else(|| {
                    RustRunnerAttemptError(
                        "nextest --version output has an invalid commit date".into(),
                    )
                })?;
            if first_line_metadata.len() != 2
                || first_line_metadata[0] != format!("({}", &commit_hash[..9])
                || first_line_metadata[1] != format!("{commit_date})")
            {
                return Err(RustRunnerAttemptError(
                    "nextest --version short build identity disagrees with its metadata".into(),
                ));
            }
        }
        (None, None) if first_line_metadata.is_empty() => {}
        _ => {
            return Err(RustRunnerAttemptError(
                "nextest --version build identity is only partially present".into(),
            ));
        }
    }
    Ok(version.to_owned())
}

fn canonical_uuid(value: &str) -> bool {
    value.len() == 36
        && value.bytes().enumerate().all(|(index, byte)| {
            if matches!(index, 8 | 13 | 18 | 23) {
                byte == b'-'
            } else {
                byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase()
            }
        })
}

fn parse_positive_usize(key: &str, value: &str) -> Result<usize, RustRunnerAttemptError> {
    value
        .parse::<usize>()
        .ok()
        .filter(|number| *number > 0)
        .ok_or_else(|| RustRunnerAttemptError(format!("{key} must be a positive integer")))
}

pub fn classify_rust_runner_environment()
-> Result<RustRunnerInvocationIdentity, RustRunnerAttemptError> {
    classify_rust_runner_environment_from(std::env::vars_os())
}

pub fn classify_rust_runner_environment_from(
    environment: impl IntoIterator<Item = (OsString, OsString)>,
) -> Result<RustRunnerInvocationIdentity, RustRunnerAttemptError> {
    let environment = environment.into_iter().collect::<BTreeMap<_, _>>();
    let nextest = value(&environment, "NEXTEST")?;
    if nextest.is_none() {
        if let Some(key) = EXECUTION_IDENTITY_KEYS
            .iter()
            .find(|key| environment.contains_key(&OsString::from(**key)))
        {
            return Err(RustRunnerAttemptError(format!(
                "runner environment contains {key} without NEXTEST=1"
            )));
        }
        return Ok(RustRunnerInvocationIdentity::CargoSingleAttempt);
    }
    if nextest.as_deref() != Some("1") {
        return Err(RustRunnerAttemptError(
            "NEXTEST must equal 1 when nextest identity is present".into(),
        ));
    }

    let run_id = required(&environment, "NEXTEST_RUN_ID")?;
    if !canonical_uuid(&run_id) {
        return Err(RustRunnerAttemptError(
            "NEXTEST_RUN_ID is not a canonical lowercase UUID".into(),
        ));
    }
    let version = required(&environment, "NEXTEST_VERSION")?;
    validate_nextest_version(&version)?;
    let execution_mode = required(&environment, "NEXTEST_EXECUTION_MODE")?;
    if execution_mode != "process-per-test" {
        return Err(RustRunnerAttemptError(format!(
            "unsupported nextest execution mode: {execution_mode}"
        )));
    }
    let binary_id = required(&environment, "NEXTEST_BINARY_ID")?;
    let invocation = NextestInvocationIdentity {
        run_id,
        version,
        binary_id,
    };

    let present_attempt_keys = ATTEMPT_KEYS
        .iter()
        .filter(|key| environment.contains_key(&OsString::from(**key)))
        .count();
    if present_attempt_keys == 0 {
        return Ok(RustRunnerInvocationIdentity::NextestList(invocation));
    }
    if present_attempt_keys != ATTEMPT_KEYS.len() {
        return Err(RustRunnerAttemptError(
            "nextest supplied only part of the frozen attempt identity".into(),
        ));
    }

    let test_name = required(&environment, "NEXTEST_TEST_NAME")?;
    let attempt = parse_positive_usize(
        "NEXTEST_ATTEMPT",
        &required(&environment, "NEXTEST_ATTEMPT")?,
    )?;
    let total_attempts = parse_positive_usize(
        "NEXTEST_TOTAL_ATTEMPTS",
        &required(&environment, "NEXTEST_TOTAL_ATTEMPTS")?,
    )?;
    if attempt > total_attempts {
        return Err(RustRunnerAttemptError(
            "NEXTEST_ATTEMPT exceeds NEXTEST_TOTAL_ATTEMPTS".into(),
        ));
    }
    let runner_attempt_id = required(&environment, "NEXTEST_ATTEMPT_ID")?;
    if !runner_attempt_id.starts_with(&format!("{}:", invocation.run_id)) {
        return Err(RustRunnerAttemptError(
            "NEXTEST_ATTEMPT_ID does not belong to NEXTEST_RUN_ID".into(),
        ));
    }
    let stress_current = required(&environment, "NEXTEST_STRESS_CURRENT")?;
    let stress_total = required(&environment, "NEXTEST_STRESS_TOTAL")?;
    if stress_current != "none" || stress_total != "none" {
        return Err(RustRunnerAttemptError(
            "nextest stress iterations require a distinct identity axis and are not yet supported"
                .into(),
        ));
    }
    Ok(RustRunnerInvocationIdentity::NextestAttempt(
        NextestAttemptIdentity {
            invocation,
            test_name,
            retry: attempt - 1,
            total_attempts,
            runner_attempt_id,
        },
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn environment(values: &[(&str, &str)]) -> Vec<(OsString, OsString)> {
        values
            .iter()
            .map(|(key, value)| (OsString::from(key), OsString::from(value)))
            .collect()
    }

    fn nextest_base() -> Vec<(&'static str, &'static str)> {
        vec![
            ("NEXTEST", "1"),
            ("NEXTEST_RUN_ID", "2ae19189-240a-433a-a31d-acc411fe8e1f"),
            ("NEXTEST_VERSION", "0.9.140"),
            ("NEXTEST_EXECUTION_MODE", "process-per-test"),
            ("NEXTEST_BINARY_ID", "fixture::integration"),
        ]
    }

    #[test]
    fn standard_cargo_is_one_exact_attempt() {
        assert_eq!(
            classify_rust_runner_environment_from(environment(&[("NEXTEST_RETRIES", "3")]))
                .unwrap(),
            RustRunnerInvocationIdentity::CargoSingleAttempt
        );
    }

    #[test]
    fn nextest_list_is_distinct_and_has_no_attempt() {
        let values = nextest_base();
        assert!(matches!(
            classify_rust_runner_environment_from(environment(&values)).unwrap(),
            RustRunnerInvocationIdentity::NextestList(_)
        ));
    }

    #[test]
    fn nextest_attempt_derives_zero_based_retry_without_parsing_attempt_id() {
        let mut values = nextest_base();
        values.extend([
            ("NEXTEST_TEST_NAME", "tests::flaky"),
            ("NEXTEST_ATTEMPT", "2"),
            ("NEXTEST_TOTAL_ATTEMPTS", "3"),
            (
                "NEXTEST_ATTEMPT_ID",
                "2ae19189-240a-433a-a31d-acc411fe8e1f:fixture::integration$tests::flaky#2",
            ),
            ("NEXTEST_STRESS_CURRENT", "none"),
            ("NEXTEST_STRESS_TOTAL", "none"),
        ]);
        let RustRunnerInvocationIdentity::NextestAttempt(attempt) =
            classify_rust_runner_environment_from(environment(&values)).unwrap()
        else {
            panic!("expected a nextest attempt");
        };
        assert_eq!(attempt.retry, 1);
        assert_eq!(attempt.total_attempts, 3);
        assert_eq!(attempt.test_name, "tests::flaky");
    }

    #[test]
    fn partial_or_cross_run_nextest_identity_is_fatal() {
        let mut partial = nextest_base();
        partial.push(("NEXTEST_ATTEMPT", "1"));
        assert!(
            classify_rust_runner_environment_from(environment(&partial))
                .unwrap_err()
                .to_string()
                .contains("only part")
        );

        let mut cross_run = nextest_base();
        cross_run.extend([
            ("NEXTEST_TEST_NAME", "tests::flaky"),
            ("NEXTEST_ATTEMPT", "1"),
            ("NEXTEST_TOTAL_ATTEMPTS", "2"),
            (
                "NEXTEST_ATTEMPT_ID",
                "11111111-1111-1111-1111-111111111111:fixture$tests::flaky",
            ),
            ("NEXTEST_STRESS_CURRENT", "none"),
            ("NEXTEST_STRESS_TOTAL", "none"),
        ]);
        assert!(
            classify_rust_runner_environment_from(environment(&cross_run))
                .unwrap_err()
                .to_string()
                .contains("does not belong")
        );
    }

    #[test]
    fn stress_and_future_execution_modes_fail_closed() {
        let mut stress = nextest_base();
        stress.extend([
            ("NEXTEST_TEST_NAME", "tests::stress"),
            ("NEXTEST_ATTEMPT", "1"),
            ("NEXTEST_TOTAL_ATTEMPTS", "1"),
            (
                "NEXTEST_ATTEMPT_ID",
                "2ae19189-240a-433a-a31d-acc411fe8e1f:fixture$tests::stress@stress-0",
            ),
            ("NEXTEST_STRESS_CURRENT", "0"),
            ("NEXTEST_STRESS_TOTAL", "3"),
        ]);
        assert!(
            classify_rust_runner_environment_from(environment(&stress))
                .unwrap_err()
                .to_string()
                .contains("distinct identity axis")
        );

        let mut future = nextest_base();
        future[3].1 = "in-process";
        assert!(
            classify_rust_runner_environment_from(environment(&future))
                .unwrap_err()
                .to_string()
                .contains("unsupported nextest execution mode")
        );
    }

    #[test]
    fn nextest_version_handshake_accepts_only_verified_releases() {
        assert_eq!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.138 (fc97e97bb 2026-06-21)\nrelease: 0.9.138\ncommit-hash: fc97e97bbe0a3927482a694247da00c099f4269e\ncommit-date: 2026-06-21\nhost: aarch64-apple-darwin\n"
            )
            .unwrap(),
            "0.9.138"
        );
        assert_eq!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.140 (a9fef2964 2026-07-05)\nrelease: 0.9.140\ncommit-hash: a9fef2964e34f64ed4fceeee7c0c3559ce560920\ncommit-date: 2026-07-05\nhost: aarch64-apple-darwin\n"
            )
            .unwrap(),
            "0.9.140"
        );
        assert!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.139\nrelease: 0.9.139\nhost: aarch64-apple-darwin\n"
            )
            .unwrap_err()
            .to_string()
            .contains("not one of the verified released")
        );
        assert!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.137\nrelease: 0.9.137\nhost: aarch64-apple-darwin\n"
            )
            .unwrap_err()
            .to_string()
            .contains("predates")
        );
        assert!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.141\nrelease: 0.9.141\nhost: aarch64-apple-darwin\n"
            )
            .unwrap_err()
            .to_string()
            .contains("newer")
        );
        assert!(
            parse_nextest_version_output(
                b"cargo 0.9.140\nrelease: 0.9.140\nhost: aarch64-apple-darwin\n"
            )
            .is_err()
        );
        assert!(
            parse_nextest_version_output(
                b"cargo-nextest 0.9.140\nrelease: 0.9.140\nextra: value\nhost: aarch64-apple-darwin\n"
            )
            .is_err()
        );
    }
}
