//! Authenticated, crash-detecting outcomes emitted by Supercov's exact-version
//! libtest companion.
//!
//! This transport deliberately does not infer outcomes from libtest's human
//! output. The selected toolchain's own libtest remains the scheduling,
//! capture and presentation authority and appends one strict binary event for
//! each callback it handles. A partial or semantically invalid stream is a
//! fatal attribution error.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, File, OpenOptions},
    io::Read,
    path::Path,
};

use serde::{Deserialize, Serialize};
use supercov_contracts::{
    RUST_LIBTEST_EVENT_HEADER_SIZE, RUST_LIBTEST_EVENT_MAGIC, RUST_LIBTEST_EVENT_MAX_NAME_BYTES,
    RUST_LIBTEST_EVENT_PROTOCOL_VERSION, RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE,
    RUST_LIBTEST_EVENT_TOKEN_SIZE,
};

pub const RUST_LIBTEST_EVENTS_ENV: &str = "SUPERCOV_RUST_LIBTEST_EVENTS";
pub const RUST_LIBTEST_TOKEN_ENV: &str = "SUPERCOV_RUST_LIBTEST_TOKEN";
const RUST_LIBTEST_EVENT_RUNTIME: &str = include_str!("../runtime-assets/rust-libtest-events.rs");

pub fn rust_libtest_event_runtime_source() -> &'static str {
    RUST_LIBTEST_EVENT_RUNTIME
}

const ENDIAN_MARKER: u32 = 0x0102_0304;
const HEADER_TOKEN_OFFSET: usize = 24;
const HEADER_RESERVED_OFFSET: usize = 40;

const RECORD_KIND_OFFSET: usize = 4;
const RECORD_RESULT_OFFSET: usize = 5;
const RECORD_FLAGS_OFFSET: usize = 6;
const RECORD_SEQUENCE_OFFSET: usize = 8;
const RECORD_COUNT_OFFSET: usize = 16;
const RECORD_SEED_OFFSET: usize = 24;
const RECORD_NAME_LENGTH_OFFSET: usize = 32;
const RECORD_RESERVED_OFFSET: usize = 36;
const RECORD_CHECKSUM_OFFSET: usize = 40;

const KIND_FILTERED_OUT: u8 = 1;
const KIND_FILTERED: u8 = 2;
const KIND_STARTED: u8 = 3;
const KIND_TIMEOUT: u8 = 4;
const KIND_FINISHED: u8 = 5;
const FLAG_SHUFFLE_SEED: u16 = 1;
const NO_SEED: u64 = u64::MAX;

const RESULT_NONE: u8 = 0;
const RESULT_PASSED: u8 = 1;
const RESULT_FAILED: u8 = 2;
const RESULT_IGNORED: u8 = 3;
const RESULT_BENCHMARKED: u8 = 4;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RustLibtestTerminalResult {
    Passed,
    Failed,
    Ignored,
    Benchmarked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "kebab-case", deny_unknown_fields)]
pub enum RustLibtestEvent {
    FilteredOut {
        count: u64,
    },
    Filtered {
        count: u64,
        shuffle_seed: Option<u64>,
    },
    Started {
        name: String,
    },
    Timeout {
        name: String,
    },
    Finished {
        name: String,
        result: RustLibtestTerminalResult,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestAttemptEvent {
    pub name: String,
    pub result: RustLibtestTerminalResult,
    pub timed_out: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestRunEvents {
    pub filtered_out: u64,
    pub shuffle_seed: Option<u64>,
    pub attempts: Vec<RustLibtestAttemptEvent>,
    pub unstarted: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustLibtestEventError {
    Io(String),
    UnsafeFile(String),
    InvalidHeader,
    EmptyStream,
    TruncatedRecord(u64),
    InvalidRecord(u64),
    InvalidSequence { expected: u64, actual: u64 },
    NameTooLong(u64),
    InvalidName(u64),
    InvalidLifecycle(String),
}

impl std::fmt::Display for RustLibtestEventError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "Rust libtest event I/O failed: {error}"),
            Self::UnsafeFile(path) => {
                write!(formatter, "unsafe Rust libtest event file: {path}")
            }
            Self::InvalidHeader => formatter.write_str("invalid Rust libtest event header"),
            Self::EmptyStream => formatter.write_str("Rust libtest event stream is empty"),
            Self::TruncatedRecord(sequence) => {
                write!(
                    formatter,
                    "Rust libtest event record {sequence} is truncated"
                )
            }
            Self::InvalidRecord(sequence) => {
                write!(formatter, "Rust libtest event record {sequence} is invalid")
            }
            Self::InvalidSequence { expected, actual } => write!(
                formatter,
                "Rust libtest event sequence is not contiguous: expected {expected}, got {actual}"
            ),
            Self::NameTooLong(sequence) => {
                write!(
                    formatter,
                    "Rust libtest event {sequence} has an oversized name"
                )
            }
            Self::InvalidName(sequence) => {
                write!(
                    formatter,
                    "Rust libtest event {sequence} has an invalid name"
                )
            }
            Self::InvalidLifecycle(reason) => {
                write!(formatter, "invalid Rust libtest event lifecycle: {reason}")
            }
        }
    }
}

impl std::error::Error for RustLibtestEventError {}

#[cfg(test)]
fn put_u16(target: &mut [u8], offset: usize, value: u16) {
    target[offset..offset + 2].copy_from_slice(&value.to_le_bytes());
}

fn put_u32(target: &mut [u8], offset: usize, value: u32) {
    target[offset..offset + 4].copy_from_slice(&value.to_le_bytes());
}

#[cfg(test)]
fn put_u64(target: &mut [u8], offset: usize, value: u64) {
    target[offset..offset + 8].copy_from_slice(&value.to_le_bytes());
}

fn get_u16(source: &[u8], offset: usize) -> Option<u16> {
    Some(u16::from_le_bytes(
        source.get(offset..offset + 2)?.try_into().ok()?,
    ))
}

fn get_u32(source: &[u8], offset: usize) -> Option<u32> {
    Some(u32::from_le_bytes(
        source.get(offset..offset + 4)?.try_into().ok()?,
    ))
}

fn get_u64(source: &[u8], offset: usize) -> Option<u64> {
    Some(u64::from_le_bytes(
        source.get(offset..offset + 8)?.try_into().ok()?,
    ))
}

fn checksum(token: &[u8; RUST_LIBTEST_EVENT_TOKEN_SIZE], prefix: &[u8], name: &[u8]) -> u64 {
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in token
        .iter()
        .copied()
        .chain(prefix.iter().copied())
        .chain(name.iter().copied())
    {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    value
}

fn regular_file(path: &Path) -> Result<File, RustLibtestEventError> {
    let metadata =
        fs::symlink_metadata(path).map_err(|error| RustLibtestEventError::Io(error.to_string()))?;
    if !metadata.file_type().is_file() {
        return Err(RustLibtestEventError::UnsafeFile(
            path.display().to_string(),
        ));
    }
    let mut options = OpenOptions::new();
    options.read(true);
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        #[cfg(target_os = "linux")]
        const O_NOFOLLOW: i32 = 0x2_0000;
        #[cfg(target_os = "macos")]
        const O_NOFOLLOW: i32 = 0x100;
        options.custom_flags(O_NOFOLLOW);
    }
    let file = options
        .open(path)
        .map_err(|error| RustLibtestEventError::Io(error.to_string()))?;
    if !file
        .metadata()
        .map_err(|error| RustLibtestEventError::Io(error.to_string()))?
        .file_type()
        .is_file()
    {
        return Err(RustLibtestEventError::UnsafeFile(
            path.display().to_string(),
        ));
    }
    Ok(file)
}

pub fn create_rust_libtest_event_file(
    path: &Path,
    token: [u8; RUST_LIBTEST_EVENT_TOKEN_SIZE],
) -> Result<(), RustLibtestEventError> {
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut file = options
        .open(path)
        .map_err(|error| RustLibtestEventError::Io(error.to_string()))?;
    let mut header = [0_u8; RUST_LIBTEST_EVENT_HEADER_SIZE];
    header[..8].copy_from_slice(RUST_LIBTEST_EVENT_MAGIC.as_bytes());
    put_u32(&mut header, 8, RUST_LIBTEST_EVENT_PROTOCOL_VERSION);
    put_u32(&mut header, 12, RUST_LIBTEST_EVENT_HEADER_SIZE as u32);
    put_u32(
        &mut header,
        16,
        RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE as u32,
    );
    put_u32(&mut header, 20, ENDIAN_MARKER);
    header[HEADER_TOKEN_OFFSET..HEADER_TOKEN_OFFSET + RUST_LIBTEST_EVENT_TOKEN_SIZE]
        .copy_from_slice(&token);
    std::io::Write::write_all(&mut file, &header)
        .and_then(|()| file.sync_data())
        .map_err(|error| RustLibtestEventError::Io(error.to_string()))
}

pub fn read_rust_libtest_events(
    path: &Path,
    expected_token: &[u8; RUST_LIBTEST_EVENT_TOKEN_SIZE],
) -> Result<Vec<RustLibtestEvent>, RustLibtestEventError> {
    let mut file = regular_file(path)?;
    let mut bytes = Vec::new();
    file.read_to_end(&mut bytes)
        .map_err(|error| RustLibtestEventError::Io(error.to_string()))?;
    if bytes.len() < RUST_LIBTEST_EVENT_HEADER_SIZE
        || bytes.get(..8) != Some(RUST_LIBTEST_EVENT_MAGIC.as_bytes())
        || get_u32(&bytes, 8) != Some(RUST_LIBTEST_EVENT_PROTOCOL_VERSION)
        || get_u32(&bytes, 12) != Some(RUST_LIBTEST_EVENT_HEADER_SIZE as u32)
        || get_u32(&bytes, 16) != Some(RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE as u32)
        || get_u32(&bytes, 20) != Some(ENDIAN_MARKER)
        || bytes.get(HEADER_TOKEN_OFFSET..HEADER_TOKEN_OFFSET + RUST_LIBTEST_EVENT_TOKEN_SIZE)
            != Some(expected_token.as_slice())
        || bytes
            .get(HEADER_RESERVED_OFFSET..RUST_LIBTEST_EVENT_HEADER_SIZE)
            .is_none_or(|reserved| reserved != [0; 24])
    {
        return Err(RustLibtestEventError::InvalidHeader);
    }

    let mut offset = RUST_LIBTEST_EVENT_HEADER_SIZE;
    let mut expected_sequence = 0_u64;
    let mut events = Vec::new();
    while offset < bytes.len() {
        let remaining = &bytes[offset..];
        if remaining.len() < RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE {
            return Err(RustLibtestEventError::TruncatedRecord(expected_sequence));
        }
        let record_length = get_u32(remaining, 0)
            .and_then(|value| usize::try_from(value).ok())
            .filter(|length| *length >= RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE)
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        if record_length > remaining.len() {
            return Err(RustLibtestEventError::TruncatedRecord(expected_sequence));
        }
        let record = &remaining[..record_length];
        let actual_sequence = get_u64(record, RECORD_SEQUENCE_OFFSET)
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        if actual_sequence != expected_sequence {
            return Err(RustLibtestEventError::InvalidSequence {
                expected: expected_sequence,
                actual: actual_sequence,
            });
        }
        let name_length = get_u32(record, RECORD_NAME_LENGTH_OFFSET)
            .and_then(|value| usize::try_from(value).ok())
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        if name_length > RUST_LIBTEST_EVENT_MAX_NAME_BYTES {
            return Err(RustLibtestEventError::NameTooLong(expected_sequence));
        }
        if record_length != RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE + name_length
            || get_u32(record, RECORD_RESERVED_OFFSET) != Some(0)
        {
            return Err(RustLibtestEventError::InvalidRecord(expected_sequence));
        }
        let name_bytes = &record[RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE..];
        if get_u64(record, RECORD_CHECKSUM_OFFSET)
            != Some(checksum(
                expected_token,
                &record[..RECORD_CHECKSUM_OFFSET],
                name_bytes,
            ))
        {
            return Err(RustLibtestEventError::InvalidRecord(expected_sequence));
        }
        let kind = record[RECORD_KIND_OFFSET];
        let result = record[RECORD_RESULT_OFFSET];
        let flags = get_u16(record, RECORD_FLAGS_OFFSET)
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        let count = get_u64(record, RECORD_COUNT_OFFSET)
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        let seed = get_u64(record, RECORD_SEED_OFFSET)
            .ok_or(RustLibtestEventError::InvalidRecord(expected_sequence))?;
        let name = if name_bytes.is_empty() {
            None
        } else {
            Some(
                std::str::from_utf8(name_bytes)
                    .map_err(|_| RustLibtestEventError::InvalidName(expected_sequence))?
                    .to_owned(),
            )
        };
        let event = match (kind, result, flags, count, seed, name) {
            (KIND_FILTERED_OUT, RESULT_NONE, 0, count, NO_SEED, None) => {
                RustLibtestEvent::FilteredOut { count }
            }
            (KIND_FILTERED, RESULT_NONE, 0, count, NO_SEED, None) => RustLibtestEvent::Filtered {
                count,
                shuffle_seed: None,
            },
            (KIND_FILTERED, RESULT_NONE, FLAG_SHUFFLE_SEED, count, seed, None)
                if seed != NO_SEED =>
            {
                RustLibtestEvent::Filtered {
                    count,
                    shuffle_seed: Some(seed),
                }
            }
            (KIND_STARTED, RESULT_NONE, 0, 0, NO_SEED, Some(name)) if !name.is_empty() => {
                RustLibtestEvent::Started { name }
            }
            (KIND_TIMEOUT, RESULT_NONE, 0, 0, NO_SEED, Some(name)) if !name.is_empty() => {
                RustLibtestEvent::Timeout { name }
            }
            (KIND_FINISHED, result, 0, 0, NO_SEED, Some(name)) if !name.is_empty() => {
                let result = match result {
                    RESULT_PASSED => RustLibtestTerminalResult::Passed,
                    RESULT_FAILED => RustLibtestTerminalResult::Failed,
                    RESULT_IGNORED => RustLibtestTerminalResult::Ignored,
                    RESULT_BENCHMARKED => RustLibtestTerminalResult::Benchmarked,
                    _ => return Err(RustLibtestEventError::InvalidRecord(expected_sequence)),
                };
                RustLibtestEvent::Finished { name, result }
            }
            _ => return Err(RustLibtestEventError::InvalidRecord(expected_sequence)),
        };
        events.push(event);
        offset += record_length;
        expected_sequence = expected_sequence
            .checked_add(1)
            .ok_or(RustLibtestEventError::InvalidRecord(actual_sequence))?;
    }
    if events.is_empty() {
        return Err(RustLibtestEventError::EmptyStream);
    }
    Ok(events)
}

pub fn validate_rust_libtest_run_events(
    events: &[RustLibtestEvent],
    selected_tests: impl IntoIterator<Item = String>,
) -> Result<RustLibtestRunEvents, RustLibtestEventError> {
    let mut selected = BTreeSet::new();
    for test in selected_tests {
        if test.is_empty() || test.contains('\0') || !selected.insert(test.clone()) {
            return Err(RustLibtestEventError::InvalidLifecycle(format!(
                "selected test identity is invalid or duplicated: {test:?}"
            )));
        }
    }
    let [
        RustLibtestEvent::FilteredOut {
            count: filtered_out,
        },
        RustLibtestEvent::Filtered {
            count,
            shuffle_seed,
        },
        remaining @ ..,
    ] = events
    else {
        return Err(RustLibtestEventError::InvalidLifecycle(
            "stream must begin with exactly one filtered-out and filtered event".into(),
        ));
    };
    if *count != selected.len() as u64 {
        return Err(RustLibtestEventError::InvalidLifecycle(format!(
            "libtest selected {count} tests but the authenticated catalog contains {}",
            selected.len()
        )));
    }

    let mut started_order = Vec::new();
    let mut attempts = BTreeMap::<String, (bool, Option<RustLibtestTerminalResult>)>::new();
    for event in remaining {
        match event {
            RustLibtestEvent::Started { name } => {
                if !selected.contains(name)
                    || attempts.insert(name.clone(), (false, None)).is_some()
                {
                    return Err(RustLibtestEventError::InvalidLifecycle(format!(
                        "test started outside the catalog or more than once: {name}"
                    )));
                }
                started_order.push(name.clone());
            }
            RustLibtestEvent::Timeout { name } => {
                let Some((timed_out, result)) = attempts.get_mut(name) else {
                    return Err(RustLibtestEventError::InvalidLifecycle(format!(
                        "timeout preceded start: {name}"
                    )));
                };
                if *timed_out || result.is_some() {
                    return Err(RustLibtestEventError::InvalidLifecycle(format!(
                        "timeout was duplicated or followed a terminal result: {name}"
                    )));
                }
                *timed_out = true;
            }
            RustLibtestEvent::Finished { name, result } => {
                let Some((_, terminal)) = attempts.get_mut(name) else {
                    return Err(RustLibtestEventError::InvalidLifecycle(format!(
                        "terminal result preceded start: {name}"
                    )));
                };
                if terminal.replace(*result).is_some() {
                    return Err(RustLibtestEventError::InvalidLifecycle(format!(
                        "terminal result was duplicated: {name}"
                    )));
                }
            }
            RustLibtestEvent::FilteredOut { .. } | RustLibtestEvent::Filtered { .. } => {
                return Err(RustLibtestEventError::InvalidLifecycle(
                    "aggregate selection event appeared after execution started".into(),
                ));
            }
        }
    }

    let mut joined = Vec::with_capacity(started_order.len());
    for name in started_order {
        let (timed_out, result) = attempts.remove(&name).expect("started attempt exists");
        let result = result.ok_or_else(|| {
            RustLibtestEventError::InvalidLifecycle(format!(
                "started test has no terminal result: {name}"
            ))
        })?;
        joined.push(RustLibtestAttemptEvent {
            name,
            result,
            timed_out,
        });
    }
    let started = joined
        .iter()
        .map(|attempt| attempt.name.as_str())
        .collect::<BTreeSet<_>>();
    let unstarted = selected
        .into_iter()
        .filter(|name| !started.contains(name.as_str()))
        .collect();
    Ok(RustLibtestRunEvents {
        filtered_out: *filtered_out,
        shuffle_seed: *shuffle_seed,
        attempts: joined,
        unstarted,
    })
}

#[cfg(test)]
fn encode_event(
    token: &[u8; RUST_LIBTEST_EVENT_TOKEN_SIZE],
    sequence: u64,
    event: &RustLibtestEvent,
) -> Vec<u8> {
    let (kind, result, flags, count, seed, name) = match event {
        RustLibtestEvent::FilteredOut { count } => {
            (KIND_FILTERED_OUT, RESULT_NONE, 0, *count, NO_SEED, "")
        }
        RustLibtestEvent::Filtered {
            count,
            shuffle_seed,
        } => (
            KIND_FILTERED,
            RESULT_NONE,
            u16::from(shuffle_seed.is_some()),
            *count,
            shuffle_seed.unwrap_or(NO_SEED),
            "",
        ),
        RustLibtestEvent::Started { name } => {
            (KIND_STARTED, RESULT_NONE, 0, 0, NO_SEED, name.as_str())
        }
        RustLibtestEvent::Timeout { name } => {
            (KIND_TIMEOUT, RESULT_NONE, 0, 0, NO_SEED, name.as_str())
        }
        RustLibtestEvent::Finished { name, result } => (
            KIND_FINISHED,
            match result {
                RustLibtestTerminalResult::Passed => RESULT_PASSED,
                RustLibtestTerminalResult::Failed => RESULT_FAILED,
                RustLibtestTerminalResult::Ignored => RESULT_IGNORED,
                RustLibtestTerminalResult::Benchmarked => RESULT_BENCHMARKED,
            },
            0,
            0,
            NO_SEED,
            name.as_str(),
        ),
    };
    let mut record = vec![0_u8; RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE + name.len()];
    let record_len = record.len() as u32;
    put_u32(&mut record, 0, record_len);
    record[RECORD_KIND_OFFSET] = kind;
    record[RECORD_RESULT_OFFSET] = result;
    put_u16(&mut record, RECORD_FLAGS_OFFSET, flags);
    put_u64(&mut record, RECORD_SEQUENCE_OFFSET, sequence);
    put_u64(&mut record, RECORD_COUNT_OFFSET, count);
    put_u64(&mut record, RECORD_SEED_OFFSET, seed);
    put_u32(&mut record, RECORD_NAME_LENGTH_OFFSET, name.len() as u32);
    record[RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE..].copy_from_slice(name.as_bytes());
    let digest = checksum(token, &record[..RECORD_CHECKSUM_OFFSET], name.as_bytes());
    put_u64(&mut record, RECORD_CHECKSUM_OFFSET, digest);
    record
}

#[cfg(test)]
mod tests {
    use std::{
        io::Write as _,
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    fn fixture() -> (std::path::PathBuf, [u8; RUST_LIBTEST_EVENT_TOKEN_SIZE]) {
        static NEXT_FIXTURE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-libtest-events-{}-{nonce}-{}",
            std::process::id(),
            NEXT_FIXTURE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&root).unwrap();
        (
            root.join("events.bin"),
            [0x5a; RUST_LIBTEST_EVENT_TOKEN_SIZE],
        )
    }

    #[test]
    fn joins_concurrent_terminal_order_and_fail_fast_unstarted_tests() {
        let events = vec![
            RustLibtestEvent::FilteredOut { count: 3 },
            RustLibtestEvent::Filtered {
                count: 3,
                shuffle_seed: Some(42),
            },
            RustLibtestEvent::Started { name: "b".into() },
            RustLibtestEvent::Started { name: "a".into() },
            RustLibtestEvent::Timeout { name: "b".into() },
            RustLibtestEvent::Finished {
                name: "a".into(),
                result: RustLibtestTerminalResult::Passed,
            },
            RustLibtestEvent::Finished {
                name: "b".into(),
                result: RustLibtestTerminalResult::Failed,
            },
        ];
        let run = validate_rust_libtest_run_events(
            &events,
            ["a".to_owned(), "b".to_owned(), "c".to_owned()],
        )
        .unwrap();
        assert_eq!(run.filtered_out, 3);
        assert_eq!(run.shuffle_seed, Some(42));
        assert_eq!(
            run.attempts,
            vec![
                RustLibtestAttemptEvent {
                    name: "b".into(),
                    result: RustLibtestTerminalResult::Failed,
                    timed_out: true,
                },
                RustLibtestAttemptEvent {
                    name: "a".into(),
                    result: RustLibtestTerminalResult::Passed,
                    timed_out: false,
                },
            ]
        );
        assert_eq!(run.unstarted, ["c"]);

        let mut malformed = events;
        malformed.push(RustLibtestEvent::Finished {
            name: "b".into(),
            result: RustLibtestTerminalResult::Passed,
        });
        assert!(matches!(
            validate_rust_libtest_run_events(
                &malformed,
                ["a".to_owned(), "b".to_owned(), "c".to_owned()]
            ),
            Err(RustLibtestEventError::InvalidLifecycle(_))
        ));
    }

    fn append(path: &Path, bytes: &[u8]) {
        let mut file = OpenOptions::new().append(true).open(path).unwrap();
        file.write_all(bytes).unwrap();
        file.flush().unwrap();
    }

    #[test]
    fn roundtrips_every_frozen_event_kind() {
        let (path, token) = fixture();
        create_rust_libtest_event_file(&path, token).unwrap();
        let expected = vec![
            RustLibtestEvent::FilteredOut { count: 2 },
            RustLibtestEvent::Filtered {
                count: 4,
                shuffle_seed: Some(91),
            },
            RustLibtestEvent::Started {
                name: "tests::works".into(),
            },
            RustLibtestEvent::Timeout {
                name: "tests::works".into(),
            },
            RustLibtestEvent::Finished {
                name: "tests::works".into(),
                result: RustLibtestTerminalResult::Passed,
            },
            RustLibtestEvent::Finished {
                name: "tests::ignored".into(),
                result: RustLibtestTerminalResult::Ignored,
            },
            RustLibtestEvent::Finished {
                name: "bench::one".into(),
                result: RustLibtestTerminalResult::Benchmarked,
            },
            RustLibtestEvent::Finished {
                name: "tests::fails".into(),
                result: RustLibtestTerminalResult::Failed,
            },
        ];
        for (sequence, event) in expected.iter().enumerate() {
            append(&path, &encode_event(&token, sequence as u64, event));
        }
        assert_eq!(read_rust_libtest_events(&path, &token).unwrap(), expected);
        fs::remove_dir_all(path.parent().unwrap()).unwrap();
    }

    #[test]
    fn rejects_wrong_token_empty_partial_reordered_and_tampered_streams() {
        let (path, token) = fixture();
        create_rust_libtest_event_file(&path, token).unwrap();
        assert_eq!(
            read_rust_libtest_events(&path, &token),
            Err(RustLibtestEventError::EmptyStream)
        );
        assert_eq!(
            read_rust_libtest_events(&path, &[0; RUST_LIBTEST_EVENT_TOKEN_SIZE]),
            Err(RustLibtestEventError::InvalidHeader)
        );

        let event = RustLibtestEvent::Started {
            name: "tests::works".into(),
        };
        let encoded = encode_event(&token, 0, &event);
        append(&path, &encoded[..encoded.len() - 1]);
        assert_eq!(
            read_rust_libtest_events(&path, &token),
            Err(RustLibtestEventError::TruncatedRecord(0))
        );
        fs::remove_file(&path).unwrap();

        create_rust_libtest_event_file(&path, token).unwrap();
        append(&path, &encode_event(&token, 1, &event));
        assert_eq!(
            read_rust_libtest_events(&path, &token),
            Err(RustLibtestEventError::InvalidSequence {
                expected: 0,
                actual: 1,
            })
        );
        fs::remove_file(&path).unwrap();

        create_rust_libtest_event_file(&path, token).unwrap();
        let mut tampered = encode_event(&token, 0, &event);
        *tampered.last_mut().unwrap() ^= 1;
        append(&path, &tampered);
        assert_eq!(
            read_rust_libtest_events(&path, &token),
            Err(RustLibtestEventError::InvalidRecord(0))
        );
        fs::remove_dir_all(path.parent().unwrap()).unwrap();
    }

    #[test]
    fn rejects_unknown_kind_flags_result_and_non_utf8_name() {
        for mutate in [
            |record: &mut Vec<u8>| record[RECORD_KIND_OFFSET] = 99,
            |record: &mut Vec<u8>| put_u16(record, RECORD_FLAGS_OFFSET, 2),
            |record: &mut Vec<u8>| record[RECORD_RESULT_OFFSET] = RESULT_FAILED,
            |record: &mut Vec<u8>| *record.last_mut().unwrap() = 0xff,
        ] {
            let (path, token) = fixture();
            create_rust_libtest_event_file(&path, token).unwrap();
            let mut record =
                encode_event(&token, 0, &RustLibtestEvent::Started { name: "x".into() });
            mutate(&mut record);
            let name = &record[RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE..];
            let digest = checksum(&token, &record[..RECORD_CHECKSUM_OFFSET], name);
            put_u64(&mut record, RECORD_CHECKSUM_OFFSET, digest);
            append(&path, &record);
            assert!(read_rust_libtest_events(&path, &token).is_err());
            fs::remove_dir_all(path.parent().unwrap()).unwrap();
        }
    }

    #[cfg(unix)]
    #[test]
    fn rejects_symlink_transport() {
        use std::os::unix::fs::symlink;

        let (path, token) = fixture();
        let real = path.with_file_name("real.bin");
        create_rust_libtest_event_file(&real, token).unwrap();
        append(
            &real,
            &encode_event(&token, 0, &RustLibtestEvent::FilteredOut { count: 0 }),
        );
        symlink(&real, &path).unwrap();
        assert_eq!(
            read_rust_libtest_events(&path, &token),
            Err(RustLibtestEventError::UnsafeFile(
                path.display().to_string()
            ))
        );
        fs::remove_dir_all(path.parent().unwrap()).unwrap();
    }
}
