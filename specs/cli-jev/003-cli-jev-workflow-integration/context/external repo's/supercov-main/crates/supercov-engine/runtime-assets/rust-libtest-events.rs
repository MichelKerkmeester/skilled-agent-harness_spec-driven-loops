use std::fs::{File, OpenOptions};
use std::io::{self, Read, Write};
use std::sync::{Mutex, OnceLock};

use crate::event::TestEvent;
use crate::test_result::TestResult;

const MAGIC: &[u8; 8] = b"SCVLTST1";
const VERSION: u32 = 1;
const HEADER_SIZE: usize = 64;
const RECORD_HEADER_SIZE: usize = 48;
const TOKEN_SIZE: usize = 16;
const MAX_NAME_BYTES: usize = 1_048_576;
const ENDIAN_MARKER: u32 = 0x0102_0304;
const TOKEN_OFFSET: usize = 24;

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

const EVENTS_ENV: &str = "SUPERCOV_RUST_LIBTEST_EVENTS";
const TOKEN_ENV: &str = "SUPERCOV_RUST_LIBTEST_TOKEN";
const CONTEXT_ENV: &str = "SUPERCOV_RUST_CONTEXT";
const CONTEXT_DOMAIN: &[u8] = b"supercov-rust-test-v1\0";
const CONTEXT_RESERVED_REMAP: u64 = 0xa5a5_a5a5_a5a5_a5a5;

unsafe extern "C" {
    fn __supercov_rt_enter_context(context_id: u64) -> u64;
    fn __supercov_rt_exit_test_context(context_id: u64, previous: u64);
}

static EVENTS: OnceLock<Result<Mutex<EventWriter>, String>> = OnceLock::new();

struct EventWriter {
    file: File,
    token: [u8; TOKEN_SIZE],
    sequence: u64,
}

pub(crate) struct TestContextGuard {
    context: u64,
    previous: u64,
}

impl Drop for TestContextGuard {
    fn drop(&mut self) {
        // SAFETY: every Supercov-instrumented test artifact links the one owned
        // process runtime exporting this exact C ABI. The test-boundary record
        // committed here join-bounds every thread phase rooted in this test.
        unsafe { __supercov_rt_exit_test_context(self.context, self.previous) };
    }
}

fn test_context_id(name: &str) -> io::Result<u64> {
    if name.is_empty() || name.contains('\0') {
        return Err(invalid("invalid libtest name for Supercov context"));
    }
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in CONTEXT_DOMAIN.iter().copied().chain(name.bytes()) {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    Ok(if matches!(value, 0 | u64::MAX) {
        value ^ CONTEXT_RESERVED_REMAP
    } else {
        value
    })
}

pub(crate) fn enter_test(name: &str) -> io::Result<TestContextGuard> {
    let context = test_context_id(name)?;
    // SAFETY: the linked Supercov runtime owns the exact C ABI and returns the
    // previous thread context for stack-disciplined restoration.
    let previous = unsafe { __supercov_rt_enter_context(context) };
    Ok(TestContextGuard { context, previous })
}

pub(crate) fn context_environment(name: &str) -> io::Result<(&'static str, String)> {
    Ok((CONTEXT_ENV, format!("{:016x}", test_context_id(name)?)))
}

pub(crate) fn emit_listing(filtered_out: usize, filtered: usize) -> io::Result<()> {
    emit(&TestEvent::TeFilteredOut(filtered_out))?;
    emit(&TestEvent::TeFiltered(filtered, None))
}

fn put_u16(target: &mut [u8], offset: usize, value: u16) {
    target[offset..offset + 2].copy_from_slice(&value.to_le_bytes());
}

fn put_u32(target: &mut [u8], offset: usize, value: u32) {
    target[offset..offset + 4].copy_from_slice(&value.to_le_bytes());
}

fn put_u64(target: &mut [u8], offset: usize, value: u64) {
    target[offset..offset + 8].copy_from_slice(&value.to_le_bytes());
}

fn get_u32(source: &[u8], offset: usize) -> Option<u32> {
    Some(u32::from_le_bytes(
        source.get(offset..offset + 4)?.try_into().ok()?,
    ))
}

fn checksum(token: &[u8; TOKEN_SIZE], prefix: &[u8], name: &[u8]) -> u64 {
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

fn invalid(message: impl Into<String>) -> io::Error {
    io::Error::new(io::ErrorKind::InvalidData, message.into())
}

fn decode_token(value: &str) -> io::Result<[u8; TOKEN_SIZE]> {
    if value.len() != TOKEN_SIZE * 2 {
        return Err(invalid("invalid Supercov libtest event token length"));
    }
    fn nibble(value: u8) -> Option<u8> {
        match value {
            b'0'..=b'9' => Some(value - b'0'),
            b'a'..=b'f' => Some(value - b'a' + 10),
            b'A'..=b'F' => Some(value - b'A' + 10),
            _ => None,
        }
    }
    let bytes = value.as_bytes();
    let mut token = [0_u8; TOKEN_SIZE];
    for (index, target) in token.iter_mut().enumerate() {
        let high = nibble(bytes[index * 2]).ok_or_else(|| invalid("invalid token hex"))?;
        let low = nibble(bytes[index * 2 + 1]).ok_or_else(|| invalid("invalid token hex"))?;
        *target = high << 4 | low;
    }
    Ok(token)
}

impl EventWriter {
    fn open() -> io::Result<Self> {
        let path = std::env::var_os(EVENTS_ENV)
            .ok_or_else(|| invalid(format!("missing {EVENTS_ENV}")))?;
        let token = std::env::var(TOKEN_ENV)
            .map_err(|_| invalid(format!("missing or non-Unicode {TOKEN_ENV}")))?;
        let token = decode_token(&token)?;
        let metadata = std::fs::symlink_metadata(&path)?;
        if !metadata.file_type().is_file() || metadata.len() != HEADER_SIZE as u64 {
            return Err(invalid("unsafe or non-empty Supercov libtest event file"));
        }
        let mut options = OpenOptions::new();
        options.read(true).append(true);
        #[cfg(any(target_os = "linux", target_os = "macos"))]
        {
            use std::os::unix::fs::OpenOptionsExt as _;
            #[cfg(target_os = "linux")]
            const O_NOFOLLOW: i32 = 0x2_0000;
            #[cfg(target_os = "macos")]
            const O_NOFOLLOW: i32 = 0x100;
            options.custom_flags(O_NOFOLLOW);
        }
        let mut file = options.open(path)?;
        if !file.metadata()?.file_type().is_file() {
            return Err(invalid("Supercov libtest event target is not a regular file"));
        }
        let mut header = [0_u8; HEADER_SIZE];
        file.read_exact(&mut header)?;
        if header[..8] != MAGIC[..]
            || get_u32(&header, 8) != Some(VERSION)
            || get_u32(&header, 12) != Some(HEADER_SIZE as u32)
            || get_u32(&header, 16) != Some(RECORD_HEADER_SIZE as u32)
            || get_u32(&header, 20) != Some(ENDIAN_MARKER)
            || header[TOKEN_OFFSET..TOKEN_OFFSET + TOKEN_SIZE] != token
            || header[40..].iter().any(|byte| *byte != 0)
        {
            return Err(invalid("invalid Supercov libtest event header"));
        }
        Ok(Self {
            file,
            token,
            sequence: 0,
        })
    }

    #[allow(clippy::too_many_arguments)]
    fn append(
        &mut self,
        kind: u8,
        result: u8,
        flags: u16,
        count: u64,
        seed: u64,
        name: &str,
    ) -> io::Result<()> {
        if name.len() > MAX_NAME_BYTES {
            return Err(invalid("Supercov libtest event name exceeds the frozen bound"));
        }
        let length = RECORD_HEADER_SIZE
            .checked_add(name.len())
            .and_then(|length| u32::try_from(length).ok())
            .ok_or_else(|| invalid("Supercov libtest event length overflow"))?;
        let name_length = u32::try_from(name.len())
            .map_err(|_| invalid("Supercov libtest event name length overflow"))?;
        let mut record = vec![0_u8; length as usize];
        put_u32(&mut record, 0, length);
        record[4] = kind;
        record[5] = result;
        put_u16(&mut record, 6, flags);
        put_u64(&mut record, 8, self.sequence);
        put_u64(&mut record, 16, count);
        put_u64(&mut record, 24, seed);
        put_u32(&mut record, 32, name_length);
        record[RECORD_HEADER_SIZE..].copy_from_slice(name.as_bytes());
        let digest = checksum(&self.token, &record[..40], name.as_bytes());
        put_u64(&mut record, 40, digest);
        self.file.write_all(&record)?;
        self.file.flush()?;
        self.sequence = self
            .sequence
            .checked_add(1)
            .ok_or_else(|| invalid("Supercov libtest event sequence overflow"))?;
        Ok(())
    }

    fn emit(&mut self, event: &TestEvent) -> io::Result<()> {
        match event {
            TestEvent::TeFiltered(count, seed) => self.append(
                KIND_FILTERED,
                RESULT_NONE,
                if seed.is_some() { FLAG_SHUFFLE_SEED } else { 0 },
                u64::try_from(*count).map_err(|_| invalid("filtered count overflow"))?,
                seed.unwrap_or(NO_SEED),
                "",
            ),
            TestEvent::TeFilteredOut(count) => self.append(
                KIND_FILTERED_OUT,
                RESULT_NONE,
                0,
                u64::try_from(*count).map_err(|_| invalid("filtered-out count overflow"))?,
                NO_SEED,
                "",
            ),
            TestEvent::TeWait(test) => self.append(
                KIND_STARTED,
                RESULT_NONE,
                0,
                0,
                NO_SEED,
                test.name.as_slice(),
            ),
            TestEvent::TeTimeout(test) => self.append(
                KIND_TIMEOUT,
                RESULT_NONE,
                0,
                0,
                NO_SEED,
                test.name.as_slice(),
            ),
            TestEvent::TeResult(completed) => {
                let result = match &completed.result {
                    TestResult::TrOk => RESULT_PASSED,
                    TestResult::TrFailed
                    | TestResult::TrFailedMsg(_)
                    | TestResult::TrTimedFail => RESULT_FAILED,
                    TestResult::TrIgnored => RESULT_IGNORED,
                    TestResult::TrBench(_) => RESULT_BENCHMARKED,
                };
                self.append(
                    KIND_FINISHED,
                    result,
                    0,
                    0,
                    NO_SEED,
                    completed.desc.name.as_slice(),
                )
            }
        }
    }
}

pub(crate) fn emit(event: &TestEvent) -> io::Result<()> {
    let events = EVENTS.get_or_init(|| EventWriter::open().map(Mutex::new).map_err(|e| e.to_string()));
    let events = events
        .as_ref()
        .map_err(|error| invalid(format!("Supercov libtest event transport failed: {error}")))?;
    events
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .emit(event)
}
