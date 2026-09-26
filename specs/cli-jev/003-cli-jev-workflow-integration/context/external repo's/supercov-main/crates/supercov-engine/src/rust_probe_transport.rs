//! Bounded, lock-free, file-backed transport for owned Rust probe events.
//!
//! The supervisor creates and authenticates the fixed-layout file before a
//! test starts. Target code maps that file and publishes variable-length
//! records through fixed descriptors. A release-store commit byte makes every
//! complete descriptor independently recoverable even if another writer or
//! the whole process dies midway through a later record.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, File, OpenOptions},
    path::Path,
    sync::atomic::{AtomicU8, AtomicU64, Ordering},
};

use memmap2::{Mmap, MmapMut, MmapOptions};
use serde::{Deserialize, Serialize};

use crate::rust_runtime::{RustProbeObservation, valid_probe_id};

pub const RUST_TRANSPORT_ENV: &str = "SUPERCOV_RUST_TRANSPORT_FILE";
pub const RUST_TRANSPORT_TOKEN_ENV: &str = "SUPERCOV_RUST_TRANSPORT_TOKEN";
pub const RUST_CONTEXT_ENV: &str = "SUPERCOV_RUST_CONTEXT_ID";
pub const DEFAULT_DESCRIPTOR_CAPACITY: u32 = 32_768;
pub const DEFAULT_PAYLOAD_CAPACITY: u32 = 4 * 1024 * 1024;

const MAGIC: &[u8; 8] = b"SCVRUST3";
const VERSION: u32 = 3;
const HEADER_SIZE: usize = 128;
const DESCRIPTOR_SIZE: usize = 40;
const ENDIAN_MARKER: u32 = 0x0102_0304;
const NEXT_DESCRIPTOR_OFFSET: usize = 32;
const NEXT_PAYLOAD_OFFSET: usize = 40;
const DROPPED_OFFSET: usize = 48;
const TOKEN_OFFSET: usize = 56;
const TOKEN_SIZE: usize = 16;
const ATTACHMENTS_OFFSET: usize = 72;
const NEXT_PHASE_OFFSET: usize = 80;

const COMMIT_OFFSET: usize = 0;
const KIND_OFFSET: usize = 1;
const OUTCOME_OFFSET: usize = 2;
const PID_OFFSET: usize = 4;
const CONTEXT_OFFSET: usize = 8;
const PAYLOAD_OFFSET_OFFSET: usize = 16;
const PAYLOAD_LENGTH_OFFSET: usize = 20;
const ID_LENGTH_OFFSET: usize = 24;
const VALUE_LENGTH_OFFSET: usize = 28;
const CHECKSUM_OFFSET: usize = 32;

const KIND_HIT: u8 = 1;
const KIND_DECISION: u8 = 2;
const KIND_ORDINAL_HIT: u8 = 3;
const KIND_PHASE: u8 = 4;
const KIND_THREAD_PHASE: u8 = 5;
const KIND_THREAD_END: u8 = 6;
const KIND_TEST_BOUNDARY: u8 = 7;

const RUNTIME_TEMPLATE: &str = include_str!("../runtime-assets/rust-mmap-runtime.rs");

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustTransportRead {
    pub observations: Vec<RustTransportObservation>,
    pub ordinal_hits: Vec<RustOrdinalHit>,
    pub phases: Vec<RustPhaseContext>,
    pub thread_phases: Vec<RustThreadPhase>,
    pub thread_ends: Vec<RustThreadEnd>,
    pub test_boundaries: Vec<RustTestBoundary>,
    pub committed: u64,
    pub incomplete: u64,
    pub dropped: u64,
    pub attachments: u64,
}

impl RustTransportRead {
    pub fn empty() -> Self {
        Self {
            observations: Vec::new(),
            ordinal_hits: Vec::new(),
            phases: Vec::new(),
            thread_phases: Vec::new(),
            thread_ends: Vec::new(),
            test_boundaries: Vec::new(),
            committed: 0,
            incomplete: 0,
            dropped: 0,
            attachments: 0,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustTransportObservation {
    pub process_id: u32,
    pub context_id: u64,
    pub observation: RustProbeObservation,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustOrdinalHit {
    pub process_id: u32,
    pub context_id: u64,
    pub ordinal: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustPhaseContext {
    pub process_id: u32,
    pub child_context_id: u64,
    pub parent_context_id: u64,
    pub invocation_nonce: u64,
    pub decision_id: String,
}

/// An inherited native thread's derived phase context definition. The
/// `commit_index` is the record's global transport descriptor index, which is
/// the total order used by the join-bounded acceptance rule.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustThreadPhase {
    pub process_id: u32,
    pub child_context_id: u64,
    pub parent_context_id: u64,
    pub invocation_nonce: u64,
    pub commit_index: u64,
}

/// The end-of-thread record bounding one thread phase in commit order.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustThreadEnd {
    pub process_id: u32,
    pub context_id: u64,
    pub commit_index: u64,
}

/// The exact-test boundary record committed when a test context is exited.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustTestBoundary {
    pub process_id: u32,
    pub context_id: u64,
    pub commit_index: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustTransportPartition {
    pub attributed: BTreeMap<u64, RustTransportRead>,
    pub background: RustTransportRead,
    /// One entry per thread phase whose lifetime escaped its root test; every
    /// record under such a chain is deterministic background evidence.
    pub thread_scope_limitations: BTreeSet<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustTransportError {
    Io(String),
    UnsafeFile(String),
    InvalidHeader,
    InvalidLength,
    InvalidDescriptor(u64),
    InvalidRecord(u64),
    InvalidAssertionContext(String),
    InvalidAttribution(String),
}

impl std::fmt::Display for RustTransportError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "Rust transport I/O failed: {error}"),
            Self::UnsafeFile(path) => write!(formatter, "unsafe Rust transport file: {path}"),
            Self::InvalidHeader => write!(formatter, "invalid Rust transport header"),
            Self::InvalidLength => write!(formatter, "invalid Rust transport length"),
            Self::InvalidDescriptor(index) => {
                write!(formatter, "invalid Rust transport descriptor {index}")
            }
            Self::InvalidRecord(index) => {
                write!(formatter, "invalid Rust transport record {index}")
            }
            Self::InvalidAssertionContext(reason) => {
                write!(formatter, "invalid Rust assertion context: {reason}")
            }
            Self::InvalidAttribution(reason) => {
                write!(formatter, "invalid Rust transport attribution: {reason}")
            }
        }
    }
}

impl std::error::Error for RustTransportError {}

pub fn rust_assertion_context_id(
    parent: u64,
    decision_id: &str,
    invocation_nonce: u64,
) -> Result<u64, RustTransportError> {
    if parent == 0 {
        return Ok(0);
    }
    if parent == u64::MAX {
        return Err(RustTransportError::InvalidAssertionContext(
            "the reserved nesting sentinel cannot be a parent".into(),
        ));
    }
    let digest = decision_id
        .strip_prefix("rs:decision:")
        .filter(|digest| digest.len() == 24 && digest.bytes().all(|byte| byte.is_ascii_hexdigit()))
        .ok_or_else(|| {
            RustTransportError::InvalidAssertionContext(format!(
                "invalid decision ID {decision_id}"
            ))
        })?;
    let id_high = u64::from_str_radix(&digest[..16], 16).map_err(|error| {
        RustTransportError::InvalidAssertionContext(format!(
            "invalid decision ID {decision_id}: {error}"
        ))
    })?;
    let id_low = u32::from_str_radix(&digest[16..], 16).map_err(|error| {
        RustTransportError::InvalidAssertionContext(format!(
            "invalid decision ID {decision_id}: {error}"
        ))
    })?;
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in b"supercov-rust-assertion-phase-v2"
        .iter()
        .copied()
        .chain(parent.to_le_bytes())
        .chain(id_high.to_le_bytes())
        .chain(id_low.to_le_bytes())
        .chain(invocation_nonce.to_le_bytes())
    {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    Ok(if matches!(value, 0 | u64::MAX) {
        value ^ 0xa5a5_5a5a_d3c3_b4b4
    } else {
        value
    })
}

/// Derive the exact thread-phase context for an inherited native thread. This
/// mirrors the in-runtime derivation byte for byte so tampered thread-phase
/// records fail authentication offline.
pub fn rust_thread_context_id(parent: u64, invocation_nonce: u64) -> u64 {
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in b"supercov-rust-thread-phase-v1\0"
        .iter()
        .copied()
        .chain(parent.to_le_bytes())
        .chain(invocation_nonce.to_le_bytes())
    {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    if matches!(value, 0 | u64::MAX) {
        value ^ 0xa5a5_5a5a_d3c3_b4b4
    } else {
        value
    }
}

fn put_u32(target: &mut [u8], offset: usize, value: u32) {
    target[offset..offset + 4].copy_from_slice(&value.to_le_bytes());
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

fn total_size(descriptors: u32, payload: u32) -> Option<usize> {
    HEADER_SIZE
        .checked_add(
            usize::try_from(descriptors)
                .ok()?
                .checked_mul(DESCRIPTOR_SIZE)?,
        )?
        .checked_add(usize::try_from(payload).ok()?)
}

fn map_mut(file: &File) -> Result<MmapMut, RustTransportError> {
    // SAFETY: this function owns the newly created file mapping and no slice
    // alias is produced outside the returned MmapMut.
    unsafe { MmapOptions::new().map_mut(file) }
        .map_err(|error| RustTransportError::Io(error.to_string()))
}

fn map(file: &File) -> Result<Mmap, RustTransportError> {
    // SAFETY: the immutable mapping is retained for the duration of all reads.
    unsafe { MmapOptions::new().map(file) }
        .map_err(|error| RustTransportError::Io(error.to_string()))
}

pub fn create_rust_transport(
    path: &Path,
    token: [u8; TOKEN_SIZE],
    descriptor_capacity: u32,
    payload_capacity: u32,
) -> Result<(), RustTransportError> {
    if descriptor_capacity == 0 || payload_capacity == 0 {
        return Err(RustTransportError::InvalidLength);
    }
    let total = total_size(descriptor_capacity, payload_capacity)
        .ok_or(RustTransportError::InvalidLength)?;
    let mut options = OpenOptions::new();
    options.read(true).write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let file = options
        .open(path)
        .map_err(|error| RustTransportError::Io(error.to_string()))?;
    file.set_len(u64::try_from(total).map_err(|_| RustTransportError::InvalidLength)?)
        .map_err(|error| RustTransportError::Io(error.to_string()))?;
    let mut mapping = map_mut(&file)?;
    mapping[..MAGIC.len()].copy_from_slice(MAGIC);
    put_u32(&mut mapping, 8, VERSION);
    put_u32(&mut mapping, 12, HEADER_SIZE as u32);
    put_u32(&mut mapping, 16, DESCRIPTOR_SIZE as u32);
    put_u32(&mut mapping, 20, descriptor_capacity);
    put_u32(&mut mapping, 24, payload_capacity);
    put_u32(&mut mapping, 28, ENDIAN_MARKER);
    mapping[TOKEN_OFFSET..TOKEN_OFFSET + TOKEN_SIZE].copy_from_slice(&token);
    mapping
        .flush_range(0, HEADER_SIZE)
        .map_err(|error| RustTransportError::Io(error.to_string()))
}

fn regular_file(path: &Path) -> Result<File, RustTransportError> {
    let metadata =
        fs::symlink_metadata(path).map_err(|error| RustTransportError::Io(error.to_string()))?;
    if !metadata.file_type().is_file() {
        return Err(RustTransportError::UnsafeFile(path.display().to_string()));
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
        .map_err(|error| RustTransportError::Io(error.to_string()))?;
    if !file
        .metadata()
        .map_err(|error| RustTransportError::Io(error.to_string()))?
        .file_type()
        .is_file()
    {
        return Err(RustTransportError::UnsafeFile(path.display().to_string()));
    }
    Ok(file)
}

fn atomic_u64(mapping: &[u8], offset: usize) -> Result<&AtomicU64, RustTransportError> {
    let pointer = mapping
        .get(offset..offset + 8)
        .ok_or(RustTransportError::InvalidHeader)?
        .as_ptr();
    if !(pointer as usize).is_multiple_of(std::mem::align_of::<AtomicU64>()) {
        return Err(RustTransportError::InvalidHeader);
    }
    // SAFETY: the fixed layout guarantees alignment and the mapped bytes live
    // at least as long as the returned reference.
    Ok(unsafe { &*pointer.cast::<AtomicU64>() })
}

fn atomic_u8(mapping: &[u8], offset: usize) -> Result<&AtomicU8, RustTransportError> {
    let pointer = mapping
        .get(offset)
        .ok_or(RustTransportError::InvalidLength)? as *const u8;
    // SAFETY: AtomicU8 has byte alignment and the mapping outlives the reference.
    Ok(unsafe { &*pointer.cast::<AtomicU8>() })
}

#[allow(clippy::too_many_arguments)]
fn checksum(
    kind: u8,
    outcome: u8,
    pid: u32,
    context: u64,
    payload_offset: u32,
    payload_length: u32,
    id_length: u32,
    value_length: u32,
    id: &[u8],
    values: &[u8],
) -> u64 {
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in [kind, outcome]
        .into_iter()
        .chain(pid.to_le_bytes())
        .chain(context.to_le_bytes())
        .chain(payload_offset.to_le_bytes())
        .chain(payload_length.to_le_bytes())
        .chain(id_length.to_le_bytes())
        .chain(value_length.to_le_bytes())
        .chain(id.iter().copied())
        .chain(values.iter().copied())
    {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    value
}

pub fn read_rust_transport(
    path: &Path,
    expected_token: &[u8; TOKEN_SIZE],
) -> Result<RustTransportRead, RustTransportError> {
    let file = regular_file(path)?;
    let mapping = map(&file)?;
    if mapping.get(..8) != Some(MAGIC.as_slice())
        || get_u32(&mapping, 8) != Some(VERSION)
        || get_u32(&mapping, 12) != Some(HEADER_SIZE as u32)
        || get_u32(&mapping, 16) != Some(DESCRIPTOR_SIZE as u32)
        || get_u32(&mapping, 28) != Some(ENDIAN_MARKER)
        || mapping.get(TOKEN_OFFSET..TOKEN_OFFSET + TOKEN_SIZE) != Some(expected_token.as_slice())
        || mapping.get(52..56).is_none_or(|bytes| bytes != [0; 4])
        || mapping
            .get(NEXT_PHASE_OFFSET + 8..HEADER_SIZE)
            .is_none_or(|bytes| bytes != [0; 40])
    {
        return Err(RustTransportError::InvalidHeader);
    }
    let descriptors = get_u32(&mapping, 20).ok_or(RustTransportError::InvalidHeader)?;
    let payload_capacity = get_u32(&mapping, 24).ok_or(RustTransportError::InvalidHeader)?;
    if descriptors == 0 || payload_capacity == 0 {
        return Err(RustTransportError::InvalidHeader);
    }
    if mapping.len()
        != total_size(descriptors, payload_capacity).ok_or(RustTransportError::InvalidLength)?
    {
        return Err(RustTransportError::InvalidLength);
    }
    let next = atomic_u64(&mapping, NEXT_DESCRIPTOR_OFFSET)?.load(Ordering::Acquire);
    let next_payload = atomic_u64(&mapping, NEXT_PAYLOAD_OFFSET)?.load(Ordering::Acquire);
    let recorded_dropped = atomic_u64(&mapping, DROPPED_OFFSET)?.load(Ordering::Acquire);
    let attachments = atomic_u64(&mapping, ATTACHMENTS_OFFSET)?.load(Ordering::Acquire);
    let inspect = next.min(u64::from(descriptors));
    let payload_base = HEADER_SIZE + descriptors as usize * DESCRIPTOR_SIZE;
    let mut observations = Vec::new();
    let mut ordinal_hits = Vec::new();
    let mut phases = Vec::new();
    let mut thread_phases = Vec::new();
    let mut thread_ends = Vec::new();
    let mut test_boundaries = Vec::new();
    let mut phase_definitions = BTreeMap::<u64, (u8, u64, u64, String)>::new();
    let mut thread_end_contexts = BTreeSet::<u64>::new();
    let mut boundary_contexts = BTreeSet::<u64>::new();
    let mut committed = 0_u64;
    for index in 0..inspect {
        let descriptor = HEADER_SIZE + index as usize * DESCRIPTOR_SIZE;
        match atomic_u8(&mapping, descriptor + COMMIT_OFFSET)?.load(Ordering::Acquire) {
            0 => continue,
            1 => {}
            _ => return Err(RustTransportError::InvalidDescriptor(index)),
        }
        committed += 1;
        let kind = mapping[descriptor + KIND_OFFSET];
        let outcome = mapping[descriptor + OUTCOME_OFFSET];
        if mapping[descriptor + 3] != 0 {
            return Err(RustTransportError::InvalidDescriptor(index));
        }
        let pid = get_u32(&mapping, descriptor + PID_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?;
        let context_id = get_u64(&mapping, descriptor + CONTEXT_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?;
        let payload_offset = get_u32(&mapping, descriptor + PAYLOAD_OFFSET_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?
            as usize;
        let payload_length = get_u32(&mapping, descriptor + PAYLOAD_LENGTH_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?
            as usize;
        let id_length = get_u32(&mapping, descriptor + ID_LENGTH_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))? as usize;
        let value_length = get_u32(&mapping, descriptor + VALUE_LENGTH_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?
            as usize;
        let expected_checksum = get_u64(&mapping, descriptor + CHECKSUM_OFFSET)
            .ok_or(RustTransportError::InvalidDescriptor(index))?;
        let end = payload_offset
            .checked_add(payload_length)
            .filter(|end| *end <= payload_capacity as usize)
            .ok_or(RustTransportError::InvalidDescriptor(index))?;
        if payload_length != id_length.saturating_add(value_length)
            || u64::from(end as u32) > next_payload
        {
            return Err(RustTransportError::InvalidDescriptor(index));
        }
        let payload = mapping
            .get(payload_base + payload_offset..payload_base + end)
            .ok_or(RustTransportError::InvalidDescriptor(index))?;
        let (id, values) = payload.split_at(id_length);
        if checksum(
            kind,
            outcome,
            pid,
            context_id,
            payload_offset as u32,
            payload_length as u32,
            id_length as u32,
            value_length as u32,
            id,
            values,
        ) != expected_checksum
        {
            return Err(RustTransportError::InvalidRecord(index));
        }
        let id = std::str::from_utf8(id).map_err(|_| RustTransportError::InvalidRecord(index))?;
        if matches!(kind, KIND_HIT | KIND_DECISION | KIND_PHASE) && !valid_probe_id(id) {
            return Err(RustTransportError::InvalidRecord(index));
        }
        match kind {
            KIND_HIT if outcome == 0 && values.is_empty() => {
                observations.push(RustTransportObservation {
                    process_id: pid,
                    context_id,
                    observation: RustProbeObservation::Hit { id: id.into() },
                });
            }
            KIND_DECISION
                if matches!(outcome, 0 | 1)
                    && id.starts_with("rs:decision:")
                    && !values.is_empty()
                    && values.iter().all(|value| matches!(*value, 0..=2)) =>
            {
                observations.push(RustTransportObservation {
                    process_id: pid,
                    context_id,
                    observation: RustProbeObservation::Decision {
                        id: id.into(),
                        values: values
                            .iter()
                            .map(|value| match value {
                                0 => None,
                                1 => Some(false),
                                2 => Some(true),
                                _ => unreachable!(),
                            })
                            .collect(),
                        outcome: outcome == 1,
                    },
                });
            }
            KIND_ORDINAL_HIT if outcome == 0 && id.is_empty() && values.len() == 8 => {
                ordinal_hits.push(RustOrdinalHit {
                    process_id: pid,
                    context_id,
                    ordinal: u64::from_le_bytes(
                        values
                            .try_into()
                            .map_err(|_| RustTransportError::InvalidRecord(index))?,
                    ),
                });
            }
            KIND_PHASE
                if outcome == 0
                    && id.starts_with("rs:decision:")
                    && values.len() == 16
                    && !matches!(context_id, 0 | u64::MAX) =>
            {
                let parent_context_id = u64::from_le_bytes(
                    values[..8]
                        .try_into()
                        .map_err(|_| RustTransportError::InvalidRecord(index))?,
                );
                let invocation_nonce = u64::from_le_bytes(
                    values[8..]
                        .try_into()
                        .map_err(|_| RustTransportError::InvalidRecord(index))?,
                );
                if matches!(parent_context_id, 0 | u64::MAX)
                    || rust_assertion_context_id(parent_context_id, id, invocation_nonce)?
                        != context_id
                {
                    return Err(RustTransportError::InvalidAssertionContext(format!(
                        "phase record {index} does not derive child {context_id:016x} from parent {parent_context_id:016x} and {id}"
                    )));
                }
                let definition = (
                    KIND_PHASE,
                    parent_context_id,
                    invocation_nonce,
                    id.to_owned(),
                );
                if phase_definitions
                    .insert(context_id, definition.clone())
                    .is_some_and(|existing| existing != definition)
                {
                    return Err(RustTransportError::InvalidAssertionContext(format!(
                        "child {context_id:016x} has conflicting phase definitions"
                    )));
                }
                phases.push(RustPhaseContext {
                    process_id: pid,
                    child_context_id: context_id,
                    parent_context_id,
                    invocation_nonce,
                    decision_id: id.into(),
                });
            }
            KIND_THREAD_PHASE
                if outcome == 0
                    && id.is_empty()
                    && values.len() == 16
                    && !matches!(context_id, 0 | u64::MAX) =>
            {
                let parent_context_id = u64::from_le_bytes(
                    values[..8]
                        .try_into()
                        .map_err(|_| RustTransportError::InvalidRecord(index))?,
                );
                let invocation_nonce = u64::from_le_bytes(
                    values[8..]
                        .try_into()
                        .map_err(|_| RustTransportError::InvalidRecord(index))?,
                );
                if matches!(parent_context_id, 0 | u64::MAX)
                    || rust_thread_context_id(parent_context_id, invocation_nonce) != context_id
                {
                    return Err(RustTransportError::InvalidAssertionContext(format!(
                        "thread phase record {index} does not derive child {context_id:016x} from parent {parent_context_id:016x} and nonce {invocation_nonce}"
                    )));
                }
                let definition = (
                    KIND_THREAD_PHASE,
                    parent_context_id,
                    invocation_nonce,
                    String::new(),
                );
                if phase_definitions
                    .insert(context_id, definition.clone())
                    .is_some_and(|existing| existing != definition)
                {
                    return Err(RustTransportError::InvalidAssertionContext(format!(
                        "child {context_id:016x} has conflicting phase definitions"
                    )));
                }
                thread_phases.push(RustThreadPhase {
                    process_id: pid,
                    child_context_id: context_id,
                    parent_context_id,
                    invocation_nonce,
                    commit_index: index,
                });
            }
            KIND_THREAD_END
                if outcome == 0
                    && id.is_empty()
                    && values.is_empty()
                    && !matches!(context_id, 0 | u64::MAX) =>
            {
                if !thread_end_contexts.insert(context_id) {
                    return Err(RustTransportError::InvalidRecord(index));
                }
                thread_ends.push(RustThreadEnd {
                    process_id: pid,
                    context_id,
                    commit_index: index,
                });
            }
            KIND_TEST_BOUNDARY
                if outcome == 0
                    && id.is_empty()
                    && values.is_empty()
                    && !matches!(context_id, 0 | u64::MAX) =>
            {
                if !boundary_contexts.insert(context_id) {
                    return Err(RustTransportError::InvalidRecord(index));
                }
                test_boundaries.push(RustTestBoundary {
                    process_id: pid,
                    context_id,
                    commit_index: index,
                });
            }
            _ => return Err(RustTransportError::InvalidRecord(index)),
        }
    }
    let overflow = next.saturating_sub(u64::from(descriptors));
    Ok(RustTransportRead {
        observations,
        ordinal_hits,
        phases,
        thread_phases,
        thread_ends,
        test_boundaries,
        committed,
        incomplete: inspect.saturating_sub(committed),
        dropped: recorded_dropped.max(overflow),
        attachments,
    })
}

pub fn validate_rust_phase_contexts(
    base_context_id: u64,
    read: &RustTransportRead,
) -> Result<(), RustTransportError> {
    if matches!(base_context_id, 0 | u64::MAX) {
        return Err(RustTransportError::InvalidAssertionContext(
            "the supervisor base context must be nonzero and not reserved".into(),
        ));
    }
    let mut definitions = BTreeMap::<u64, (u8, u64, u64, &str)>::new();
    for phase in &read.phases {
        let definition = (
            KIND_PHASE,
            phase.parent_context_id,
            phase.invocation_nonce,
            phase.decision_id.as_str(),
        );
        if definitions
            .insert(phase.child_context_id, definition)
            .is_some_and(|existing| existing != definition)
        {
            return Err(RustTransportError::InvalidAssertionContext(format!(
                "child {:016x} has conflicting phase definitions",
                phase.child_context_id
            )));
        }
    }
    for phase in &read.thread_phases {
        if rust_thread_context_id(phase.parent_context_id, phase.invocation_nonce)
            != phase.child_context_id
        {
            return Err(RustTransportError::InvalidAssertionContext(format!(
                "thread phase child {:016x} does not derive from parent {:016x} and nonce {}",
                phase.child_context_id, phase.parent_context_id, phase.invocation_nonce
            )));
        }
        let definition = (
            KIND_THREAD_PHASE,
            phase.parent_context_id,
            phase.invocation_nonce,
            "",
        );
        if definitions
            .insert(phase.child_context_id, definition)
            .is_some_and(|existing| existing != definition)
        {
            return Err(RustTransportError::InvalidAssertionContext(format!(
                "child {:016x} has conflicting phase definitions",
                phase.child_context_id
            )));
        }
    }

    let used_contexts = read
        .observations
        .iter()
        .map(|observation| observation.context_id)
        .chain(read.ordinal_hits.iter().map(|hit| hit.context_id))
        .chain(read.thread_ends.iter().map(|end| end.context_id))
        .chain(
            read.test_boundaries
                .iter()
                .map(|boundary| boundary.context_id),
        )
        .filter(|context| *context != 0 && *context != base_context_id)
        .collect::<BTreeSet<_>>();
    for start in used_contexts {
        let mut context = start;
        let mut path = BTreeSet::new();
        while context != base_context_id {
            if !path.insert(context) {
                return Err(RustTransportError::InvalidAssertionContext(format!(
                    "phase context cycle at {context:016x}"
                )));
            }
            let (_, parent, _, _) = definitions.get(&context).ok_or_else(|| {
                RustTransportError::InvalidAssertionContext(format!(
                    "context {context:016x} does not resolve to base {base_context_id:016x}"
                ))
            })?;
            context = *parent;
            if matches!(context, 0 | u64::MAX) {
                return Err(RustTransportError::InvalidAssertionContext(format!(
                    "context {start:016x} crosses the supervisor attempt boundary"
                )));
            }
        }
    }
    Ok(())
}

/// Partition one concurrently written artifact transport without copying any
/// record between tests. Every non-background context must resolve through the
/// authenticated assertion-phase graph to exactly one known libtest root.
pub fn partition_rust_transport_by_test_contexts(
    read: &RustTransportRead,
    base_contexts: &BTreeSet<u64>,
) -> Result<RustTransportPartition, RustTransportError> {
    if base_contexts
        .iter()
        .any(|context| matches!(*context, 0 | u64::MAX))
    {
        return Err(RustTransportError::InvalidAttribution(
            "known test roots must be nonzero and non-reserved".into(),
        ));
    }
    if read.incomplete != 0 || read.dropped != 0 {
        return Err(RustTransportError::InvalidAttribution(format!(
            "shared transport is incomplete (incomplete={}, dropped={})",
            read.incomplete, read.dropped
        )));
    }

    let mut parents = BTreeMap::<u64, u64>::new();
    let mut thread_children = BTreeSet::<u64>::new();
    for (child, parent) in read
        .phases
        .iter()
        .map(|phase| (phase.child_context_id, phase.parent_context_id))
        .chain(
            read.thread_phases
                .iter()
                .map(|phase| (phase.child_context_id, phase.parent_context_id)),
        )
    {
        if matches!(child, 0 | u64::MAX)
            || matches!(parent, 0 | u64::MAX)
            || base_contexts.contains(&child)
            || parents.insert(child, parent).is_some()
        {
            return Err(RustTransportError::InvalidAttribution(format!(
                "phase {child:016x} has an invalid or repeated ownership definition"
            )));
        }
    }
    for phase in &read.thread_phases {
        thread_children.insert(phase.child_context_id);
    }
    let mut thread_end_index = BTreeMap::<u64, u64>::new();
    for end in &read.thread_ends {
        if !thread_children.contains(&end.context_id)
            || thread_end_index
                .insert(end.context_id, end.commit_index)
                .is_some()
        {
            return Err(RustTransportError::InvalidAttribution(format!(
                "thread end {:016x} has no unique thread-phase definition",
                end.context_id
            )));
        }
    }
    let mut boundary_index = BTreeMap::<u64, u64>::new();
    for boundary in &read.test_boundaries {
        if !base_contexts.contains(&boundary.context_id)
            || boundary_index
                .insert(boundary.context_id, boundary.commit_index)
                .is_some()
        {
            return Err(RustTransportError::InvalidAttribution(format!(
                "test boundary {:016x} does not identify one known test root",
                boundary.context_id
            )));
        }
    }

    // One record's exact destination: its root test, safe background, or the
    // root plus the thread phases whose lifetimes escaped it.
    enum Resolution {
        Attributed(u64),
        Background,
        Quarantined { root: u64, escaped: Vec<u64> },
    }
    let resolve = |start: u64| -> Result<Resolution, RustTransportError> {
        if start == 0 {
            return Ok(Resolution::Background);
        }
        if start == u64::MAX {
            return Err(RustTransportError::InvalidAttribution(
                "evidence used the reserved context sentinel".into(),
            ));
        }
        let mut context = start;
        let mut seen = BTreeSet::new();
        let mut chain_threads = Vec::new();
        loop {
            if thread_children.contains(&context) {
                chain_threads.push(context);
            }
            let Some(parent) = parents.get(&context) else {
                break;
            };
            if !seen.insert(context) {
                return Err(RustTransportError::InvalidAttribution(format!(
                    "phase context cycle at {context:016x}"
                )));
            }
            context = *parent;
        }
        if !base_contexts.contains(&context) {
            return Err(RustTransportError::InvalidAttribution(format!(
                "context {start:016x} resolves to unknown test root {context:016x}"
            )));
        }
        let boundary = boundary_index.get(&context).copied();
        let escaped = chain_threads
            .into_iter()
            .filter(|thread| {
                !matches!(
                    (thread_end_index.get(thread), boundary),
                    (Some(end), Some(boundary)) if *end < boundary
                )
            })
            .collect::<Vec<_>>();
        if escaped.is_empty() {
            Ok(Resolution::Attributed(context))
        } else {
            Ok(Resolution::Quarantined {
                root: context,
                escaped,
            })
        }
    };

    let mut attributed = base_contexts
        .iter()
        .map(|context| (*context, RustTransportRead::empty()))
        .collect::<BTreeMap<_, _>>();
    let mut background = RustTransportRead::empty();
    background.attachments = read.attachments;
    let mut thread_scope_limitations = BTreeSet::new();
    let mut note_escape = |root: u64, escaped: Vec<u64>| {
        for thread in escaped {
            thread_scope_limitations.insert(format!(
                "RUST_THREAD_OUTLIVED_TEST: thread phase {thread:016x} escaped test {root:016x}"
            ));
        }
    };

    for observation in &read.observations {
        match resolve(observation.context_id)? {
            Resolution::Attributed(root) => attributed
                .get_mut(&root)
                .expect("resolved root was preallocated")
                .observations
                .push(observation.clone()),
            Resolution::Background => background.observations.push(observation.clone()),
            Resolution::Quarantined { root, escaped } => {
                note_escape(root, escaped);
                background.observations.push(observation.clone());
            }
        }
    }
    for hit in &read.ordinal_hits {
        match resolve(hit.context_id)? {
            Resolution::Attributed(root) => attributed
                .get_mut(&root)
                .expect("resolved root was preallocated")
                .ordinal_hits
                .push(*hit),
            Resolution::Background => background.ordinal_hits.push(*hit),
            Resolution::Quarantined { root, escaped } => {
                note_escape(root, escaped);
                background.ordinal_hits.push(*hit);
            }
        }
    }
    for phase in &read.phases {
        match resolve(phase.child_context_id)? {
            Resolution::Attributed(root) => attributed
                .get_mut(&root)
                .expect("resolved root was preallocated")
                .phases
                .push(phase.clone()),
            Resolution::Background => {
                return Err(RustTransportError::InvalidAttribution(format!(
                    "phase {:016x} resolved to background",
                    phase.child_context_id
                )));
            }
            Resolution::Quarantined { root, escaped } => {
                note_escape(root, escaped);
                background.phases.push(phase.clone());
            }
        }
    }
    for phase in &read.thread_phases {
        match resolve(phase.child_context_id)? {
            Resolution::Attributed(root) => attributed
                .get_mut(&root)
                .expect("resolved root was preallocated")
                .thread_phases
                .push(*phase),
            Resolution::Background => {
                return Err(RustTransportError::InvalidAttribution(format!(
                    "thread phase {:016x} resolved to background",
                    phase.child_context_id
                )));
            }
            Resolution::Quarantined { root, escaped } => {
                note_escape(root, escaped);
                background.thread_phases.push(*phase);
            }
        }
    }
    for end in &read.thread_ends {
        match resolve(end.context_id)? {
            Resolution::Attributed(root) => attributed
                .get_mut(&root)
                .expect("resolved root was preallocated")
                .thread_ends
                .push(*end),
            Resolution::Background => {
                return Err(RustTransportError::InvalidAttribution(format!(
                    "thread end {:016x} resolved to background",
                    end.context_id
                )));
            }
            Resolution::Quarantined { root, escaped } => {
                note_escape(root, escaped);
                background.thread_ends.push(*end);
            }
        }
    }
    for boundary in &read.test_boundaries {
        attributed
            .get_mut(&boundary.context_id)
            .expect("boundary contexts were checked against the known roots")
            .test_boundaries
            .push(*boundary);
    }

    let set_committed = |transport: &mut RustTransportRead| -> Result<u64, RustTransportError> {
        transport.committed = u64::try_from(
            transport.observations.len()
                + transport.ordinal_hits.len()
                + transport.phases.len()
                + transport.thread_phases.len()
                + transport.thread_ends.len()
                + transport.test_boundaries.len(),
        )
        .map_err(|_| {
            RustTransportError::InvalidAttribution("partition record count exceeds u64".into())
        })?;
        Ok(transport.committed)
    };
    let mut assigned = set_committed(&mut background)?;
    for transport in attributed.values_mut() {
        assigned = assigned
            .checked_add(set_committed(transport)?)
            .ok_or_else(|| {
                RustTransportError::InvalidAttribution(
                    "partition record count overflowed u64".into(),
                )
            })?;
    }
    if assigned != read.committed {
        return Err(RustTransportError::InvalidAttribution(format!(
            "partition assigned {assigned} of {} committed records",
            read.committed
        )));
    }
    for (base, transport) in &attributed {
        validate_rust_phase_contexts(*base, transport)?;
    }
    Ok(RustTransportPartition {
        attributed,
        background,
        thread_scope_limitations,
    })
}

pub fn render_rust_mmap_runtime(module_name: &str) -> Result<String, String> {
    let valid_identifier = !module_name.is_empty()
        && module_name.bytes().enumerate().all(|(index, byte)| {
            byte == b'_' || byte.is_ascii_alphabetic() || (index > 0 && byte.is_ascii_digit())
        });
    if !valid_identifier {
        return Err("invalid Rust runtime module name".into());
    }
    Ok(RUNTIME_TEMPLATE.replace("__SUPERCOV_MODULE__", module_name))
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        io::{BufRead as _, BufReader},
        process::{Command, Stdio},
        sync::atomic::{AtomicUsize, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    const TOKEN: [u8; TOKEN_SIZE] = [0x42; TOKEN_SIZE];
    const CONTEXT: u64 = 42;

    fn token_hex() -> String {
        TOKEN.iter().map(|byte| format!("{byte:02x}")).collect()
    }

    fn temporary_directory(name: &str) -> std::path::PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-rust-transport-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir(&path).unwrap();
        path
    }

    fn compile_fixture(directory: &Path) -> std::path::PathBuf {
        let source = directory.join("main.rs");
        let binary = directory.join("program");
        let runtime = render_rust_mmap_runtime("__supercov_runtime_v1").unwrap();
        fs::write(
            &source,
            format!(
                r#"{runtime}
fn main() {{
    let mode = std::env::args().nth(1).unwrap_or_default();
    if mode == "threads" {{
        let mut threads = Vec::new();
        for _ in 0..8 {{
            threads.push(std::thread::spawn(|| {{
                for _ in 0..100 {{ __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567"); }}
            }}));
        }}
        for thread in threads {{ thread.join().unwrap(); }}
        let mut frame = __supercov_runtime_v1::DecisionFrame::new("rs:decision:0123456789abcdef01234567", 2);
        let first = __supercov_runtime_v1::condition(true, &mut frame, 0);
        let second = __supercov_runtime_v1::condition(false, &mut frame, 1);
        __supercov_runtime_v1::decision(first && second, &mut frame);
        __supercov_runtime_v1::ordinal_hit(7);
    }} else if mode == "contexts" {{
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        let outer = __supercov_runtime_v1::enter_context(100);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        let inner = __supercov_runtime_v1::enter_context(200);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        __supercov_runtime_v1::exit_context(inner);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        __supercov_runtime_v1::exit_context(outer);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        let assertion = __supercov_runtime_v1::enter_assertion_context(
            0x0123_4567_89ab_cdef,
            0x0123_4567,
        );
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        __supercov_runtime_v1::exit_context(assertion);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        let repeated_assertion = __supercov_runtime_v1::enter_assertion_context(
            0x0123_4567_89ab_cdef,
            0x0123_4567,
        );
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
        __supercov_runtime_v1::exit_context(repeated_assertion);
        __supercov_runtime_v1::hit("rs:statement:0123456789abcdef01234567");
    }} else if mode == "mir-decisions" {{
        let before_outer = __supercov_runtime_v1::enter_context(901);
        let outer = __supercov_runtime_v1::mir_decision_start(
            0x0123_4567_89ab_cdef,
            0x0123_4567,
            2,
        );
        __supercov_runtime_v1::mir_decision_condition(outer, 0, true);
        let before_inner = __supercov_runtime_v1::enter_context(902);
        let inner = __supercov_runtime_v1::mir_decision_start(
            0xfedc_ba98_7654_3210,
            0xfedc_ba98,
            1,
        );
        let migrated = std::thread::spawn(move || {{
            __supercov_runtime_v1::mir_decision_condition(inner, 0, false);
            __supercov_runtime_v1::mir_decision_finish(inner, false);
        }});
        __supercov_runtime_v1::exit_context(before_inner);
        __supercov_runtime_v1::mir_decision_condition(outer, 1, true);
        __supercov_runtime_v1::exit_context(before_outer);
        __supercov_runtime_v1::mir_decision_finish(outer, true);
        migrated.join().unwrap();
        let before_branch = __supercov_runtime_v1::enter_context(903);
        let branch = __supercov_runtime_v1::mir_branch_start();
        __supercov_runtime_v1::exit_context(before_branch);
        let migrated_branch = std::thread::spawn(move || {{
            __supercov_runtime_v1::mir_branch_hit(branch, 777);
            __supercov_runtime_v1::mir_branch_hit(branch, 888);
        }});
        migrated_branch.join().unwrap();
    }} else if mode == "kill" {{
        __supercov_runtime_v1::hit("rs:function:fedcba9876543210fedcba98");
        let interrupted = __supercov_runtime_v1::mir_decision_start(
            0x1111_1111_1111_1111,
            0x2222_2222,
            2,
        );
        __supercov_runtime_v1::mir_decision_condition(interrupted, 0, true);
        let _interrupted_branch = __supercov_runtime_v1::mir_branch_start();
        println!("ready");
        use std::io::Write as _;
        std::io::stdout().flush().unwrap();
        std::thread::sleep(std::time::Duration::from_secs(30));
    }} else {{
        for _ in 0..3 {{ __supercov_runtime_v1::hit("rs:branch:aaaaaaaaaaaaaaaaaaaaaaaa"); }}
    }}
}}
"#
            ),
        )
        .unwrap();
        let output = Command::new("rustc")
            .args(["--edition=2024"])
            .arg(&source)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
        binary
    }

    #[test]
    fn implementation_matches_frozen_transport_contract() {
        let contract = supercov_contracts::rust_probe_transport_v3_contract().unwrap();
        assert_eq!(MAGIC.as_slice(), contract.magic.as_bytes());
        assert_eq!(VERSION, contract.protocol_version);
        assert_eq!(HEADER_SIZE, contract.header_size);
        assert_eq!(DESCRIPTOR_SIZE, contract.descriptor_size);
        assert_eq!(TOKEN_SIZE, contract.token_size);
        assert_eq!(ENDIAN_MARKER, contract.endian_marker);
        assert_eq!(
            NEXT_DESCRIPTOR_OFFSET,
            contract.header_offsets.next_descriptor
        );
        assert_eq!(NEXT_PAYLOAD_OFFSET, contract.header_offsets.next_payload);
        assert_eq!(DROPPED_OFFSET, contract.header_offsets.dropped);
        assert_eq!(TOKEN_OFFSET, contract.header_offsets.token);
        assert_eq!(ATTACHMENTS_OFFSET, contract.header_offsets.attachments);
        assert_eq!(Some(NEXT_PHASE_OFFSET), contract.header_offsets.next_phase);
        assert_eq!(COMMIT_OFFSET, contract.descriptor_offsets.commit);
        assert_eq!(PID_OFFSET, contract.descriptor_offsets.process_id);
        assert_eq!(CONTEXT_OFFSET, contract.descriptor_offsets.context_id);
        assert_eq!(
            PAYLOAD_OFFSET_OFFSET,
            contract.descriptor_offsets.payload_offset
        );
        assert_eq!(CHECKSUM_OFFSET, contract.descriptor_offsets.checksum);
        assert_eq!(KIND_HIT, contract.record_kinds.hit);
        assert_eq!(KIND_DECISION, contract.record_kinds.decision);
        assert_eq!(KIND_ORDINAL_HIT, contract.record_kinds.ordinal_hit);
        assert_eq!(Some(KIND_PHASE), contract.record_kinds.phase);
        assert_eq!(Some(KIND_THREAD_PHASE), contract.record_kinds.thread_phase);
        assert_eq!(Some(KIND_THREAD_END), contract.record_kinds.thread_end);
        assert_eq!(
            Some(KIND_TEST_BOUNDARY),
            contract.record_kinds.test_boundary
        );
        assert!(RUNTIME_TEMPLATE.contains("b\"SCVRUST3\""));
        assert!(RUNTIME_TEMPLATE.contains("const DESCRIPTOR_SIZE: usize = 40;"));
    }

    #[test]
    fn assertion_context_derivation_is_exact_nested_and_never_promotes_background() {
        let first =
            rust_assertion_context_id(CONTEXT, "rs:decision:0123456789abcdef01234567", 0).unwrap();
        let nested =
            rust_assertion_context_id(first, "rs:decision:fedcba9876543210fedcba98", 1).unwrap();
        assert_ne!(first, CONTEXT);
        assert_ne!(nested, first);
        assert_eq!(
            rust_assertion_context_id(0, "rs:decision:0123456789abcdef01234567", 2).unwrap(),
            0
        );
        assert!(matches!(
            rust_assertion_context_id(CONTEXT, "not-a-decision", 2),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));
        assert!(matches!(
            rust_assertion_context_id(u64::MAX, "rs:decision:0123456789abcdef01234567", 2),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));
    }

    #[test]
    fn phase_context_chains_resolve_exactly_to_the_supervisor_attempt() {
        let outer_id = "rs:decision:0123456789abcdef01234567";
        let inner_id = "rs:decision:fedcba9876543210fedcba98";
        let outer = rust_assertion_context_id(CONTEXT, outer_id, 10).unwrap();
        let inner = rust_assertion_context_id(outer, inner_id, 11).unwrap();
        let read = RustTransportRead {
            observations: vec![RustTransportObservation {
                process_id: 7,
                context_id: inner,
                observation: RustProbeObservation::Hit {
                    id: "rs:statement:0123456789abcdef01234567".into(),
                },
            }],
            ordinal_hits: Vec::new(),
            phases: vec![
                RustPhaseContext {
                    process_id: 7,
                    child_context_id: outer,
                    parent_context_id: CONTEXT,
                    invocation_nonce: 10,
                    decision_id: outer_id.into(),
                },
                RustPhaseContext {
                    process_id: 7,
                    child_context_id: inner,
                    parent_context_id: outer,
                    invocation_nonce: 11,
                    decision_id: inner_id.into(),
                },
            ],
            thread_phases: Vec::new(),
            thread_ends: Vec::new(),
            test_boundaries: Vec::new(),
            committed: 3,
            incomplete: 0,
            dropped: 0,
            attachments: 1,
        };
        validate_rust_phase_contexts(CONTEXT, &read).unwrap();

        let mut threaded = read.clone();
        let thread_child = rust_thread_context_id(inner, 7);
        threaded.thread_phases.push(RustThreadPhase {
            process_id: 7,
            child_context_id: thread_child,
            parent_context_id: inner,
            invocation_nonce: 7,
            commit_index: 3,
        });
        threaded.observations[0].context_id = thread_child;
        threaded.committed = 4;
        validate_rust_phase_contexts(CONTEXT, &threaded).unwrap();

        let mut tampered_thread = threaded.clone();
        tampered_thread.thread_phases[0].invocation_nonce = 8;
        assert!(matches!(
            validate_rust_phase_contexts(CONTEXT, &tampered_thread),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));

        let mut invalid = read.clone();
        invalid.phases[0].parent_context_id = 99;
        assert!(matches!(
            validate_rust_phase_contexts(CONTEXT, &invalid),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));

        let mut unused = read.clone();
        let unused_child = rust_assertion_context_id(CONTEXT, inner_id, 12).unwrap();
        unused.phases.push(RustPhaseContext {
            process_id: 7,
            child_context_id: unused_child,
            parent_context_id: CONTEXT,
            invocation_nonce: 12,
            decision_id: inner_id.into(),
        });
        validate_rust_phase_contexts(CONTEXT, &unused).unwrap();

        let mut cycle = read;
        cycle.phases[0].parent_context_id = inner;
        assert!(matches!(
            validate_rust_phase_contexts(CONTEXT, &cycle),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));
    }

    #[test]
    fn shared_transport_partitions_each_record_once_by_exact_test_root() {
        const SECOND: u64 = 84;
        let outer_id = "rs:decision:0123456789abcdef01234567";
        let inner_id = "rs:decision:fedcba9876543210fedcba98";
        let outer = rust_assertion_context_id(CONTEXT, outer_id, 10).unwrap();
        let inner = rust_assertion_context_id(outer, inner_id, 11).unwrap();
        let read = RustTransportRead {
            observations: vec![
                RustTransportObservation {
                    process_id: 7,
                    context_id: inner,
                    observation: RustProbeObservation::Hit {
                        id: "rs:statement:0123456789abcdef01234567".into(),
                    },
                },
                RustTransportObservation {
                    process_id: 7,
                    context_id: SECOND,
                    observation: RustProbeObservation::Hit {
                        id: "rs:function:fedcba9876543210fedcba98".into(),
                    },
                },
                RustTransportObservation {
                    process_id: 7,
                    context_id: 0,
                    observation: RustProbeObservation::Hit {
                        id: "rs:statement:aaaaaaaaaaaaaaaaaaaaaaaa".into(),
                    },
                },
            ],
            ordinal_hits: vec![RustOrdinalHit {
                process_id: 7,
                context_id: CONTEXT,
                ordinal: 9,
            }],
            phases: vec![
                RustPhaseContext {
                    process_id: 7,
                    child_context_id: outer,
                    parent_context_id: CONTEXT,
                    invocation_nonce: 10,
                    decision_id: outer_id.into(),
                },
                RustPhaseContext {
                    process_id: 7,
                    child_context_id: inner,
                    parent_context_id: outer,
                    invocation_nonce: 11,
                    decision_id: inner_id.into(),
                },
            ],
            thread_phases: Vec::new(),
            thread_ends: Vec::new(),
            test_boundaries: Vec::new(),
            committed: 6,
            incomplete: 0,
            dropped: 0,
            attachments: 3,
        };
        let bases = BTreeSet::from([CONTEXT, SECOND]);
        let partition = partition_rust_transport_by_test_contexts(&read, &bases).unwrap();
        assert_eq!(partition.attributed[&CONTEXT].committed, 4);
        assert_eq!(partition.attributed[&SECOND].committed, 1);
        assert_eq!(partition.background.committed, 1);
        assert_eq!(partition.background.attachments, 3);
        assert!(partition.thread_scope_limitations.is_empty());
        assert_eq!(
            partition
                .attributed
                .values()
                .map(|transport| transport.committed)
                .sum::<u64>()
                + partition.background.committed,
            read.committed
        );

        let mut foreign = read.clone();
        foreign.observations[1].context_id = 99;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&foreign, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut incomplete = read.clone();
        incomplete.dropped = 1;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&incomplete, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut cycle = read;
        cycle.phases[0].parent_context_id = inner;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&cycle, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));
    }

    #[test]
    fn thread_phases_are_join_bounded_by_the_test_boundary() {
        const SECOND: u64 = 84;
        let bases = BTreeSet::from([CONTEXT, SECOND]);
        let joined = rust_thread_context_id(CONTEXT, 0);
        let escaped = rust_thread_context_id(CONTEXT, 1);
        let hit = |context_id: u64| RustTransportObservation {
            process_id: 7,
            context_id,
            observation: RustProbeObservation::Hit {
                id: "rs:statement:0123456789abcdef01234567".into(),
            },
        };
        let read = RustTransportRead {
            observations: vec![hit(joined), hit(escaped), hit(CONTEXT)],
            thread_phases: vec![
                RustThreadPhase {
                    process_id: 7,
                    child_context_id: joined,
                    parent_context_id: CONTEXT,
                    invocation_nonce: 0,
                    commit_index: 0,
                },
                RustThreadPhase {
                    process_id: 7,
                    child_context_id: escaped,
                    parent_context_id: CONTEXT,
                    invocation_nonce: 1,
                    commit_index: 1,
                },
            ],
            thread_ends: vec![RustThreadEnd {
                process_id: 7,
                context_id: joined,
                commit_index: 5,
            }],
            test_boundaries: vec![
                RustTestBoundary {
                    process_id: 7,
                    context_id: CONTEXT,
                    commit_index: 6,
                },
                RustTestBoundary {
                    process_id: 7,
                    context_id: SECOND,
                    commit_index: 7,
                },
            ],
            committed: 8,
            attachments: 1,
            ..RustTransportRead::empty()
        };
        let partition = partition_rust_transport_by_test_contexts(&read, &bases).unwrap();
        // The joined thread's phase, end and hit are exactly attributed; the
        // escaped thread's definition and hit fail closed to background.
        assert_eq!(partition.attributed[&CONTEXT].committed, 5);
        assert_eq!(partition.attributed[&CONTEXT].thread_phases.len(), 1);
        assert_eq!(partition.attributed[&CONTEXT].thread_ends.len(), 1);
        assert_eq!(partition.attributed[&CONTEXT].test_boundaries.len(), 1);
        assert_eq!(partition.attributed[&SECOND].committed, 1);
        assert_eq!(partition.background.committed, 2);
        assert_eq!(partition.background.thread_phases.len(), 1);
        assert_eq!(
            partition.background.observations,
            vec![hit(escaped)],
            "the escaped thread's record must be background"
        );
        assert_eq!(
            partition.thread_scope_limitations,
            BTreeSet::from([format!(
                "RUST_THREAD_OUTLIVED_TEST: thread phase {escaped:016x} escaped test {CONTEXT:016x}"
            )])
        );

        // An end that commits after the boundary is escaped, not joined.
        let mut late_end = read.clone();
        late_end.thread_ends.push(RustThreadEnd {
            process_id: 7,
            context_id: escaped,
            commit_index: 8,
        });
        late_end.committed = 9;
        let partition = partition_rust_transport_by_test_contexts(&late_end, &bases).unwrap();
        assert_eq!(partition.thread_scope_limitations.len(), 1);
        assert_eq!(partition.background.committed, 3);

        // A missing boundary for the root quarantines even ended threads.
        let mut unbounded = read.clone();
        unbounded.test_boundaries.remove(0);
        unbounded.committed = 7;
        let partition = partition_rust_transport_by_test_contexts(&unbounded, &bases).unwrap();
        assert_eq!(partition.attributed[&CONTEXT].committed, 1);
        assert_eq!(partition.thread_scope_limitations.len(), 2);

        let mut duplicate_end = read.clone();
        duplicate_end.thread_ends.push(RustThreadEnd {
            process_id: 7,
            context_id: joined,
            commit_index: 9,
        });
        duplicate_end.committed = 9;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&duplicate_end, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut orphan_end = read.clone();
        orphan_end.thread_ends.push(RustThreadEnd {
            process_id: 7,
            context_id: 99,
            commit_index: 9,
        });
        orphan_end.committed = 9;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&orphan_end, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut duplicate_boundary = read.clone();
        duplicate_boundary.test_boundaries.push(RustTestBoundary {
            process_id: 7,
            context_id: CONTEXT,
            commit_index: 9,
        });
        duplicate_boundary.committed = 9;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&duplicate_boundary, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut unknown_boundary = read.clone();
        unknown_boundary.test_boundaries.push(RustTestBoundary {
            process_id: 7,
            context_id: 99,
            commit_index: 9,
        });
        unknown_boundary.committed = 9;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&unknown_boundary, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));

        let mut duplicate_definition = read;
        duplicate_definition.phases.push(RustPhaseContext {
            process_id: 7,
            child_context_id: joined,
            parent_context_id: CONTEXT,
            invocation_nonce: 0,
            decision_id: "rs:decision:0123456789abcdef01234567".into(),
        });
        duplicate_definition.committed = 9;
        assert!(matches!(
            partition_rust_transport_by_test_contexts(&duplicate_definition, &bases),
            Err(RustTransportError::InvalidAttribution(_))
        ));
    }

    fn append_record(
        bytes: &mut [u8],
        kind: u8,
        outcome: u8,
        context_id: u64,
        id: &[u8],
        values: &[u8],
    ) {
        let descriptor_capacity = get_u32(bytes, 20).unwrap() as usize;
        let payload_base = HEADER_SIZE + descriptor_capacity * DESCRIPTOR_SIZE;
        let next = get_u64(bytes, NEXT_DESCRIPTOR_OFFSET).unwrap();
        let next_payload = get_u64(bytes, NEXT_PAYLOAD_OFFSET).unwrap();
        let descriptor = HEADER_SIZE + usize::try_from(next).unwrap() * DESCRIPTOR_SIZE;
        let payload_length = (id.len() + values.len()) as u32;
        bytes[descriptor + KIND_OFFSET] = kind;
        bytes[descriptor + OUTCOME_OFFSET] = outcome;
        bytes[descriptor + 3] = 0;
        put_u32(bytes, descriptor + PID_OFFSET, 7);
        bytes[descriptor + CONTEXT_OFFSET..descriptor + CONTEXT_OFFSET + 8]
            .copy_from_slice(&context_id.to_le_bytes());
        put_u32(
            bytes,
            descriptor + PAYLOAD_OFFSET_OFFSET,
            next_payload as u32,
        );
        put_u32(bytes, descriptor + PAYLOAD_LENGTH_OFFSET, payload_length);
        put_u32(bytes, descriptor + ID_LENGTH_OFFSET, id.len() as u32);
        put_u32(bytes, descriptor + VALUE_LENGTH_OFFSET, values.len() as u32);
        let record_checksum = checksum(
            kind,
            outcome,
            7,
            context_id,
            next_payload as u32,
            payload_length,
            id.len() as u32,
            values.len() as u32,
            id,
            values,
        );
        bytes[descriptor + CHECKSUM_OFFSET..descriptor + CHECKSUM_OFFSET + 8]
            .copy_from_slice(&record_checksum.to_le_bytes());
        let payload = payload_base + usize::try_from(next_payload).unwrap();
        bytes[payload..payload + id.len()].copy_from_slice(id);
        bytes[payload + id.len()..payload + id.len() + values.len()].copy_from_slice(values);
        bytes[descriptor + COMMIT_OFFSET] = 1;
        bytes[NEXT_DESCRIPTOR_OFFSET..NEXT_DESCRIPTOR_OFFSET + 8]
            .copy_from_slice(&(next + 1).to_le_bytes());
        bytes[NEXT_PAYLOAD_OFFSET..NEXT_PAYLOAD_OFFSET + 8]
            .copy_from_slice(&(next_payload + u64::from(payload_length)).to_le_bytes());
    }

    #[test]
    fn thread_kind_records_are_authenticated_unique_and_strict() {
        let directory = temporary_directory("thread-kinds");
        let child = rust_thread_context_id(CONTEXT, 3);
        let mut definition = [0_u8; 16];
        definition[..8].copy_from_slice(&CONTEXT.to_le_bytes());
        definition[8..].copy_from_slice(&3_u64.to_le_bytes());

        type SyntheticRecord<'bytes> = (u8, u8, u64, &'bytes [u8], &'bytes [u8]);
        let case = AtomicUsize::new(0);
        let build = |records: &[SyntheticRecord<'_>]| {
            let path = directory.join(format!(
                "case-{}.transport",
                case.fetch_add(1, Ordering::Relaxed)
            ));
            create_rust_transport(&path, TOKEN, 16, 4_096).unwrap();
            let mut bytes = fs::read(&path).unwrap();
            for (kind, outcome, context, id, values) in records {
                append_record(&mut bytes, *kind, *outcome, *context, id, values);
            }
            fs::write(&path, bytes).unwrap();
            path
        };

        let valid = build(&[
            (KIND_THREAD_PHASE, 0, child, b"", &definition),
            (KIND_THREAD_END, 0, child, b"", b""),
            (KIND_TEST_BOUNDARY, 0, CONTEXT, b"", b""),
        ]);
        let read = read_rust_transport(&valid, &TOKEN).unwrap();
        assert_eq!(read.committed, 3);
        assert_eq!(
            read.thread_phases,
            vec![RustThreadPhase {
                process_id: 7,
                child_context_id: child,
                parent_context_id: CONTEXT,
                invocation_nonce: 3,
                commit_index: 0,
            }]
        );
        assert_eq!(
            read.thread_ends,
            vec![RustThreadEnd {
                process_id: 7,
                context_id: child,
                commit_index: 1,
            }]
        );
        assert_eq!(
            read.test_boundaries,
            vec![RustTestBoundary {
                process_id: 7,
                context_id: CONTEXT,
                commit_index: 2,
            }]
        );

        // A thread phase whose context does not derive from its payload fails
        // authentication like a tampered assertion phase.
        let tampered = build(&[(KIND_THREAD_PHASE, 0, child ^ 1, b"", &definition)]);
        assert!(matches!(
            read_rust_transport(&tampered, &TOKEN),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));

        let conflicting_definition = {
            let mut other = [0_u8; 16];
            other[..8].copy_from_slice(&CONTEXT.to_le_bytes());
            other[8..].copy_from_slice(&4_u64.to_le_bytes());
            build(&[
                (KIND_THREAD_PHASE, 0, child, b"", &definition),
                (KIND_THREAD_PHASE, 0, child, b"", &other),
            ])
        };
        assert!(matches!(
            read_rust_transport(&conflicting_definition, &TOKEN),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));

        let duplicate_end = build(&[
            (KIND_THREAD_PHASE, 0, child, b"", &definition),
            (KIND_THREAD_END, 0, child, b"", b""),
            (KIND_THREAD_END, 0, child, b"", b""),
        ]);
        assert_eq!(
            read_rust_transport(&duplicate_end, &TOKEN),
            Err(RustTransportError::InvalidRecord(2))
        );

        let duplicate_boundary = build(&[
            (KIND_TEST_BOUNDARY, 0, CONTEXT, b"", b""),
            (KIND_TEST_BOUNDARY, 0, CONTEXT, b"", b""),
        ]);
        assert_eq!(
            read_rust_transport(&duplicate_boundary, &TOKEN),
            Err(RustTransportError::InvalidRecord(1))
        );

        for invalid in [
            // Zero and reserved contexts are never valid thread-kind contexts.
            build(&[(KIND_THREAD_END, 0, 0, b"", b"")]),
            build(&[(KIND_TEST_BOUNDARY, 0, u64::MAX, b"", b"")]),
            // Thread-kind records carry no probe identity or extra payload.
            build(&[(KIND_THREAD_END, 0, CONTEXT, b"x", b"")]),
            build(&[(KIND_TEST_BOUNDARY, 0, CONTEXT, b"", b"y")]),
            build(&[(KIND_THREAD_PHASE, 0, child, b"", &definition[..8])]),
            // Outcomes are meaningless for thread-kind records.
            build(&[(KIND_THREAD_END, 1, CONTEXT, b"", b"")]),
        ] {
            assert_eq!(
                read_rust_transport(&invalid, &TOKEN),
                Err(RustTransportError::InvalidRecord(0))
            );
        }

        fs::remove_dir_all(directory).unwrap();
    }

    /// Off macOS, Linux and Windows the runtime template compiles to its
    /// stub, whose probes record nothing and attach to nothing. That is the
    /// premise of `run_direct_rust` refusing there: the stub must build, and
    /// it must not pretend to measure.
    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    #[test]
    fn runtime_stub_compiles_and_records_nothing_elsewhere() {
        let directory = temporary_directory("stub");
        let binary = compile_fixture(&directory);
        let transport = directory.join("stub.transport");
        create_rust_transport(&transport, TOKEN, 1_024, 128 * 1024).unwrap();
        let output = Command::new(&binary)
            .arg("threads")
            .env(RUST_TRANSPORT_ENV, &transport)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&transport, &TOKEN).unwrap();
        assert_eq!(read.committed, 0);
        assert_eq!(read.attachments, 0);
        fs::remove_dir_all(directory).unwrap();
    }

    #[cfg(any(target_os = "macos", target_os = "linux", target_os = "windows"))]
    #[test]
    fn mmap_transport_is_concurrent_bounded_strict_and_kill_resilient() {
        let directory = temporary_directory("all");
        let binary = compile_fixture(&directory);

        let concurrent = directory.join("concurrent.transport");
        create_rust_transport(&concurrent, TOKEN, 1_024, 128 * 1024).unwrap();
        let output = Command::new(&binary)
            .arg("threads")
            .env(RUST_TRANSPORT_ENV, &concurrent)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&concurrent, &TOKEN).unwrap();
        assert_eq!(read.committed, 818);
        assert_eq!(read.incomplete, 0);
        assert_eq!(read.dropped, 0);
        assert_eq!(read.attachments, 1);
        assert_eq!(read.observations.len(), 801);
        assert!(
            matches!(read.observations.last(), Some(RustTransportObservation { context_id: CONTEXT, observation: RustProbeObservation::Decision { values, outcome: false, .. }, .. }) if values == &[Some(true), Some(false)])
        );
        // Every spawned thread runs under its own derived thread-phase context
        // parented to the creating context; the main thread stays exact.
        assert_eq!(read.thread_phases.len(), 8);
        assert!(
            read.thread_phases
                .iter()
                .all(|phase| phase.parent_context_id == CONTEXT)
        );
        assert_eq!(read.thread_ends.len(), 8);
        let thread_contexts = read
            .thread_phases
            .iter()
            .map(|phase| phase.child_context_id)
            .collect::<BTreeSet<_>>();
        assert_eq!(thread_contexts.len(), 8);
        assert_eq!(
            read.thread_ends
                .iter()
                .map(|end| end.context_id)
                .collect::<BTreeSet<_>>(),
            thread_contexts
        );
        assert!(read.observations.iter().all(|item| {
            item.context_id == CONTEXT || thread_contexts.contains(&item.context_id)
        }));
        assert_eq!(
            read.observations
                .iter()
                .filter(|item| thread_contexts.contains(&item.context_id))
                .count(),
            800
        );
        validate_rust_phase_contexts(CONTEXT, &read).unwrap();
        assert_eq!(read.ordinal_hits.len(), 1);
        assert_eq!(read.ordinal_hits[0].ordinal, 7);
        assert_eq!(read.ordinal_hits[0].context_id, CONTEXT);
        assert_eq!(
            read_rust_transport(&concurrent, &[0x43; TOKEN_SIZE]),
            Err(RustTransportError::InvalidHeader),
            "a supervisor must never accept evidence from another task token"
        );

        let mir_decisions = directory.join("mir-decisions.transport");
        create_rust_transport(&mir_decisions, TOKEN, 16, 4_096).unwrap();
        let output = Command::new(&binary)
            .arg("mir-decisions")
            .env(RUST_TRANSPORT_ENV, &mir_decisions)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&mir_decisions, &TOKEN).unwrap();
        assert_eq!(
            read.committed, 7,
            "two migrated threads add one thread phase and one thread end each"
        );
        assert_eq!(read.thread_phases.len(), 2);
        assert_eq!(read.thread_ends.len(), 2);
        assert_eq!(read.dropped, 0);
        assert_eq!(read.incomplete, 0);
        assert!(read.observations.iter().any(|observation| matches!(
            observation,
            RustTransportObservation {
                context_id: 901,
                observation: RustProbeObservation::Decision { id, values, outcome: true },
                ..
            }
                if id == "rs:decision:0123456789abcdef01234567"
                    && values == &[Some(true), Some(true)]
        )));
        assert!(
            read.ordinal_hits
                .iter()
                .any(|hit| hit.context_id == 903 && hit.ordinal == 777)
        );
        assert!(!read.ordinal_hits.iter().any(|hit| hit.ordinal == 888));
        assert!(read.observations.iter().any(|observation| matches!(
            observation,
            RustTransportObservation {
                context_id: 902,
                observation: RustProbeObservation::Decision { id, values, outcome: false },
                ..
            }
                if id == "rs:decision:fedcba9876543210fedcba98"
                    && values == &[Some(false)]
        )));

        let processes = directory.join("processes.transport");
        create_rust_transport(&processes, TOKEN, 64, 8 * 1024).unwrap();
        let mut children = (0..8)
            .map(|_| {
                Command::new(&binary)
                    .env(RUST_TRANSPORT_ENV, &processes)
                    .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
                    .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
                    .spawn()
                    .unwrap()
            })
            .collect::<Vec<_>>();
        for child in &mut children {
            assert!(child.wait().unwrap().success());
        }
        let read = read_rust_transport(&processes, &TOKEN).unwrap();
        assert_eq!(read.attachments, 8);
        assert_eq!(read.committed, 24);
        assert_eq!(read.incomplete, 0);
        assert_eq!(read.dropped, 0);
        assert_eq!(
            read.observations
                .iter()
                .map(|item| item.process_id)
                .collect::<std::collections::BTreeSet<_>>()
                .len(),
            8
        );

        let nested = directory.join("nested-context.transport");
        create_rust_transport(&nested, TOKEN, 16, 4_096).unwrap();
        let output = Command::new(&binary)
            .arg("contexts")
            .env(RUST_TRANSPORT_ENV, &nested)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&nested, &TOKEN).unwrap();
        assert_eq!(
            read.observations
                .iter()
                .map(|item| item.context_id)
                .collect::<Vec<_>>(),
            [
                CONTEXT,
                100,
                200,
                100,
                CONTEXT,
                rust_assertion_context_id(CONTEXT, "rs:decision:0123456789abcdef01234567", 0)
                    .unwrap(),
                CONTEXT,
                rust_assertion_context_id(CONTEXT, "rs:decision:0123456789abcdef01234567", 1)
                    .unwrap(),
                CONTEXT,
            ]
        );
        let assertion =
            rust_assertion_context_id(CONTEXT, "rs:decision:0123456789abcdef01234567", 0).unwrap();
        assert_eq!(read.phases.len(), 2);
        assert_eq!(read.phases[0].child_context_id, assertion);
        assert_eq!(read.phases[0].parent_context_id, CONTEXT);
        assert_eq!(read.phases[0].invocation_nonce, 0);
        assert_eq!(
            read.phases[0].decision_id,
            "rs:decision:0123456789abcdef01234567"
        );
        assert_ne!(
            read.phases[0].child_context_id,
            read.phases[1].child_context_id
        );
        assert_eq!(read.phases[1].parent_context_id, CONTEXT);
        assert_eq!(read.phases[1].invocation_nonce, 1);
        assert_eq!(read.phases[1].decision_id, read.phases[0].decision_id);
        assert_eq!(read.committed, 11);

        let invalid_phase = directory.join("invalid-phase.transport");
        fs::copy(&nested, &invalid_phase).unwrap();
        let mut bytes = fs::read(&invalid_phase).unwrap();
        let descriptor_capacity = get_u32(&bytes, 20).unwrap();
        let payload_base = HEADER_SIZE + descriptor_capacity as usize * DESCRIPTOR_SIZE;
        let descriptor = (0..read.committed as usize)
            .map(|index| HEADER_SIZE + index * DESCRIPTOR_SIZE)
            .find(|offset| bytes[*offset + KIND_OFFSET] == KIND_PHASE)
            .unwrap();
        let payload_offset = get_u32(&bytes, descriptor + PAYLOAD_OFFSET_OFFSET).unwrap();
        let payload_length = get_u32(&bytes, descriptor + PAYLOAD_LENGTH_OFFSET).unwrap();
        let id_length = get_u32(&bytes, descriptor + ID_LENGTH_OFFSET).unwrap();
        let value_length = get_u32(&bytes, descriptor + VALUE_LENGTH_OFFSET).unwrap();
        let payload = payload_base + payload_offset as usize;
        let id = bytes[payload..payload + id_length as usize].to_vec();
        let values =
            bytes[payload + id_length as usize..payload + payload_length as usize].to_vec();
        let invalid_child = 7_u64;
        bytes[descriptor + CONTEXT_OFFSET..descriptor + CONTEXT_OFFSET + 8]
            .copy_from_slice(&invalid_child.to_le_bytes());
        let replacement_checksum = checksum(
            KIND_PHASE,
            0,
            get_u32(&bytes, descriptor + PID_OFFSET).unwrap(),
            invalid_child,
            payload_offset,
            payload_length,
            id_length,
            value_length,
            &id,
            &values,
        );
        bytes[descriptor + CHECKSUM_OFFSET..descriptor + CHECKSUM_OFFSET + 8]
            .copy_from_slice(&replacement_checksum.to_le_bytes());
        fs::write(&invalid_phase, bytes).unwrap();
        assert!(matches!(
            read_rust_transport(&invalid_phase, &TOKEN),
            Err(RustTransportError::InvalidAssertionContext(_))
        ));

        let rejected = directory.join("rejected-token.transport");
        create_rust_transport(&rejected, TOKEN, 16, 4_096).unwrap();
        let output = Command::new(&binary)
            .env(RUST_TRANSPORT_ENV, &rejected)
            .env(RUST_TRANSPORT_TOKEN_ENV, "00".repeat(TOKEN_SIZE))
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&rejected, &TOKEN).unwrap();
        assert_eq!(read.attachments, 0);
        assert_eq!(read.committed, 0);
        assert_eq!(read.dropped, 0);

        let malformed_context = directory.join("malformed-context.transport");
        create_rust_transport(&malformed_context, TOKEN, 16, 4_096).unwrap();
        let output = Command::new(&binary)
            .env(RUST_TRANSPORT_ENV, &malformed_context)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, "not-a-context")
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&malformed_context, &TOKEN).unwrap();
        assert_eq!(read.attachments, 0);
        assert_eq!(read.committed, 0);

        let bounded = directory.join("bounded.transport");
        create_rust_transport(&bounded, TOKEN, 2, 256).unwrap();
        let output = Command::new(&binary)
            .env(RUST_TRANSPORT_ENV, &bounded)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&bounded, &TOKEN).unwrap();
        assert_eq!(read.committed, 2);
        assert_eq!(read.dropped, 1);

        let payload_bounded = directory.join("payload-bounded.transport");
        create_rust_transport(&payload_bounded, TOKEN, 8, 16).unwrap();
        let output = Command::new(&binary)
            .env(RUST_TRANSPORT_ENV, &payload_bounded)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .output()
            .unwrap();
        assert!(output.status.success());
        let read = read_rust_transport(&payload_bounded, &TOKEN).unwrap();
        assert_eq!(read.committed, 0);
        assert_eq!(read.incomplete, 3);
        assert_eq!(read.dropped, 3);

        let killed = directory.join("killed.transport");
        create_rust_transport(&killed, TOKEN, 16, 4_096).unwrap();
        let mut child = Command::new(&binary)
            .arg("kill")
            .env(RUST_TRANSPORT_ENV, &killed)
            .env(RUST_TRANSPORT_TOKEN_ENV, token_hex())
            .env(RUST_CONTEXT_ENV, format!("{CONTEXT:016x}"))
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();
        let mut ready = String::new();
        BufReader::new(child.stdout.take().unwrap())
            .read_line(&mut ready)
            .unwrap();
        assert_eq!(ready, "ready\n");
        child.kill().unwrap();
        child.wait().unwrap();
        let read = read_rust_transport(&killed, &TOKEN).unwrap();
        assert_eq!(read.committed, 1);
        assert_eq!(read.incomplete, 2);
        assert_eq!(read.dropped, 0);
        assert_eq!(
            read.observations,
            [RustTransportObservation {
                process_id: read.observations[0].process_id,
                context_id: CONTEXT,
                observation: RustProbeObservation::Hit {
                    id: "rs:function:fedcba9876543210fedcba98".into()
                }
            }]
        );

        let corrupt = directory.join("corrupt.transport");
        create_rust_transport(&corrupt, TOKEN, 2, 256).unwrap();
        let mut bytes = fs::read(&corrupt).unwrap();
        bytes[0] ^= 1;
        fs::write(&corrupt, bytes).unwrap();
        assert_eq!(
            read_rust_transport(&corrupt, &TOKEN),
            Err(RustTransportError::InvalidHeader)
        );

        let invalid_commit = directory.join("invalid-commit.transport");
        fs::copy(&bounded, &invalid_commit).unwrap();
        let mut bytes = fs::read(&invalid_commit).unwrap();
        bytes[HEADER_SIZE + COMMIT_OFFSET] = 2;
        fs::write(&invalid_commit, bytes).unwrap();
        assert_eq!(
            read_rust_transport(&invalid_commit, &TOKEN),
            Err(RustTransportError::InvalidDescriptor(0))
        );

        let invalid_flags = directory.join("invalid-flags.transport");
        fs::copy(&bounded, &invalid_flags).unwrap();
        let mut bytes = fs::read(&invalid_flags).unwrap();
        bytes[HEADER_SIZE + 3] = 1;
        fs::write(&invalid_flags, bytes).unwrap();
        assert_eq!(
            read_rust_transport(&invalid_flags, &TOKEN),
            Err(RustTransportError::InvalidDescriptor(0))
        );

        let invalid_checksum = directory.join("invalid-checksum.transport");
        fs::copy(&bounded, &invalid_checksum).unwrap();
        let mut bytes = fs::read(&invalid_checksum).unwrap();
        bytes[HEADER_SIZE + CHECKSUM_OFFSET] ^= 1;
        fs::write(&invalid_checksum, bytes).unwrap();
        assert_eq!(
            read_rust_transport(&invalid_checksum, &TOKEN),
            Err(RustTransportError::InvalidRecord(0))
        );

        #[cfg(unix)]
        {
            use std::os::unix::fs::symlink;

            let linked = directory.join("linked.transport");
            symlink(&bounded, &linked).unwrap();
            assert_eq!(
                read_rust_transport(&linked, &TOKEN),
                Err(RustTransportError::UnsafeFile(linked.display().to_string()))
            );
        }

        let truncated = directory.join("truncated.transport");
        create_rust_transport(&truncated, TOKEN, 2, 256).unwrap();
        OpenOptions::new()
            .write(true)
            .open(&truncated)
            .unwrap()
            .set_len(63)
            .unwrap();
        assert_eq!(
            read_rust_transport(&truncated, &TOKEN),
            Err(RustTransportError::InvalidHeader)
        );

        let incomplete = directory.join("incomplete.transport");
        create_rust_transport(&incomplete, TOKEN, 2, 256).unwrap();
        let file = OpenOptions::new()
            .read(true)
            .write(true)
            .open(&incomplete)
            .unwrap();
        let mapping = map_mut(&file).unwrap();
        atomic_u64(&mapping, NEXT_DESCRIPTOR_OFFSET)
            .unwrap()
            .store(1, Ordering::Release);
        mapping.flush().unwrap();
        drop(mapping);
        let read = read_rust_transport(&incomplete, &TOKEN).unwrap();
        assert_eq!(read.committed, 0);
        assert_eq!(read.incomplete, 1);
        assert!(read.observations.is_empty());
        assert!(read.ordinal_hits.is_empty());

        fs::remove_dir_all(directory).unwrap();
    }
}
