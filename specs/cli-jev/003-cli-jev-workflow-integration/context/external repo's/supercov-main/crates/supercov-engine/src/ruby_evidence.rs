//! Validation and normalization of the Ruby runtime's evidence records.
//!
//! Each Supercov-hooked Ruby interpreter publishes commit-framed JSON records into
//! its own mmap: the process identity, every phase it entered (with the exact
//! test identity that phase stands for), runner outcomes, first-sighting hits,
//! decision vectors and any measurement limitation the runtime detected. The
//! one-byte commit marker is written last, so records completed before a hard
//! kill remain readable while a torn tail stays inert. Rust joins those records
//! into the shared frontend protocol; the runtime never computes a verdict.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, File},
    path::{Component, Path, PathBuf},
};

use memmap2::{Mmap, MmapOptions};
use serde::Deserialize;
use serde_json::json;
use sha2::{Digest, Sha256};
use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
};

use crate::{
    coverage_analysis::McdcVector,
    coverage_report::{
        CoverageManifest, CoverageModelDeclaration, CoveragePhase, CoverageReportRequest,
        DecisionMeta, DecisionSnapshot, ExecutionScope, ExitCodeInput, PersistedCoverageModel,
        RawTestResult, RuntimeEvent, RuntimeSnapshot, TestProvenance,
    },
    evidence_archive::EvidenceArchiveEntry,
};

pub const RUBY_EVIDENCE_VERSION: u32 = 1;
pub const RUBY_FRONTEND_VERSION: &str = "ruby-coverage-v1";
pub const RSPEC_RUNNER: &str = "rspec";
pub const MINITEST_RUNNER: &str = "minitest";
pub const TEST_UNIT_RUNNER: &str = "test-unit";
pub const CUCUMBER_RUNNER: &str = "cucumber";

const TRANSPORT_MAGIC: &[u8; 8] = b"SCVRUBY1";
const TRANSPORT_VERSION: u32 = 1;
const TRANSPORT_HEADER_SIZE: usize = 64;
const TRANSPORT_RECORD_HEADER_SIZE: usize = 16;
const TRANSPORT_MAX_RECORD_SIZE: usize = 4 * 1024 * 1024;

fn default_runner() -> String {
    RSPEC_RUNNER.into()
}

/// Every field the runtime writes is named so `deny_unknown_fields` keeps
/// the record shape frozen, even where Rust does not read the value yet.
#[derive(Debug, Deserialize)]
#[allow(dead_code)]
#[serde(tag = "t", rename_all = "lowercase", deny_unknown_fields)]
enum Record {
    Process {
        v: u32,
        run: String,
        pid: u64,
        worker: String,
        ruby: String,
        executable: String,
        argv: Vec<String>,
    },
    Worker {
        worker: String,
    },
    Phase {
        ctx: u64,
        at: i64,
        worker: String,
        test: String,
        retry: usize,
        phase: String,
    },
    Outcome {
        worker: String,
        test: String,
        retry: usize,
        phase: String,
        outcome: String,
        xfail: bool,
        #[serde(default = "default_runner")]
        runner: String,
        /// Where the runner says the test is defined. Absent for adapters or
        /// synthesised methods that cannot name a file.
        #[serde(default)]
        file: Option<String>,
    },
    Hit {
        ctx: u64,
        id: String,
    },
    Dec {
        ctx: u64,
        id: String,
        v: String,
        o: u8,
    },
    /// The first assertion of a call phase: what the context recorded before
    /// this record is the assertion's evidence too.
    Assert {
        ctx: u64,
    },
    /// One assertion site a call phase reached, once per site per test. Ruby
    /// backtraces carry no column, so the line is resolved against the syntax
    /// inventory; a frame that names no inventoried site witnesses nothing.
    Asite {
        ctx: u64,
        f: String,
        l: usize,
    },
    Limitation {
        id: String,
        reason: String,
        #[serde(default)]
        file: Option<String>,
        #[serde(default)]
        obligation: Option<String>,
    },
    Exit {
        at: i64,
    },
}

#[derive(Debug)]
pub enum RubyEvidenceError {
    Io(String),
    UnsafeEntry(String),
    InvalidRecord {
        file: String,
        line: usize,
        reason: String,
    },
    InvalidTransport {
        file: String,
        reason: String,
    },
    DroppedRecords {
        file: String,
        count: u64,
    },
    RunMismatch {
        expected: String,
        actual: String,
    },
    UnsupportedVersion(u32),
    UnknownContext {
        file: String,
        line: usize,
        context: u64,
    },
    UnknownObligation(String),
    InvalidVector {
        id: String,
        expected: usize,
        actual: usize,
    },
    NoInterpreter,
    NoTests,
    UnsupportedRuby(String),
}

impl std::fmt::Display for RubyEvidenceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(reason) => write!(formatter, "could not read Ruby evidence: {reason}"),
            Self::UnsafeEntry(name) => write!(formatter, "unsafe Ruby evidence entry: {name}"),
            Self::InvalidRecord { file, line, reason } => {
                write!(formatter, "invalid Ruby evidence record {file}:{line}: {reason}")
            }
            Self::InvalidTransport { file, reason } => {
                write!(formatter, "invalid Ruby evidence transport {file}: {reason}")
            }
            Self::DroppedRecords { file, count } => write!(
                formatter,
                "Ruby evidence transport {file} exhausted its bounded capacity and dropped {count} record(s)"
            ),
            Self::RunMismatch { expected, actual } => write!(
                formatter,
                "Ruby evidence belongs to run {actual}, expected {expected}"
            ),
            Self::UnsupportedVersion(version) => {
                write!(formatter, "unsupported Ruby evidence version {version}")
            }
            Self::UnknownContext { file, line, context } => write!(
                formatter,
                "Ruby evidence {file}:{line} references undeclared context {context}"
            ),
            Self::UnknownObligation(id) => {
                write!(formatter, "Ruby runtime reported an unknown obligation: {id}")
            }
            Self::InvalidVector {
                id,
                expected,
                actual,
            } => write!(
                formatter,
                "Ruby decision {id} reported {actual} condition values, expected {expected}"
            ),
            Self::NoInterpreter => formatter.write_str(
                "no Supercov-hooked Ruby interpreter ran: the test command did not start Ruby 3.3+ with Supercov's RUBYOPT hook (RUBYOPT may be cleared by the command, or the runner is not Ruby)",
            ),
            Self::NoTests => formatter.write_str(
                "the Ruby run produced no test outcomes; Supercov measures Ruby through RSpec, Minitest, test-unit and Cucumber",
            ),
            Self::UnsupportedRuby(version) => write!(
                formatter,
                "Supercov measures Ruby 3.3 or newer; the test command ran Ruby {version}"
            ),
        }
    }
}

impl std::error::Error for RubyEvidenceError {}

fn stable_id(prefix: &str, values: &[&str]) -> String {
    let mut hash = Sha256::new();
    for value in values {
        hash.update(value.as_bytes());
        hash.update([0]);
    }
    let digest = hash.finalize();
    let mut encoded = String::with_capacity(prefix.len() + 25);
    encoded.push_str(prefix);
    encoded.push(':');
    for byte in &digest[..12] {
        use std::fmt::Write as _;
        write!(&mut encoded, "{byte:02x}").expect("string formatting");
    }
    encoded
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct Identity {
    worker: String,
    test: String,
    retry: usize,
    phase: String,
}

type ObservedVectors = BTreeSet<(Vec<Option<bool>>, bool)>;
/// (worker, test, retry) -> [(phase, outcome, xfail)]
type OutcomesByAttempt = BTreeMap<(String, String, usize), Vec<(String, String, bool)>>;
/// (worker, test, retry) -> runner that reported the attempt
type RunnersByAttempt = BTreeMap<(String, String, usize), String>;
/// (worker, test, retry) -> the source file the runner named for the test
type TestFilesByAttempt = BTreeMap<(String, String, usize), String>;
/// (worker, test, retry) -> assertion sites the call phase reached, in the
/// order they were first seen, as the runtime reported them: (path, line)
type SitesByAttempt = BTreeMap<(String, String, usize), Vec<(String, usize)>>;

/// The assertion sites Supercov inventoried from source before the run,
/// indexed so a runtime backtrace frame can name one exactly.
///
/// Ruby backtraces carry a file and a line but no column, while an assertion
/// anchor is a file, line and column. The inventory supplies the missing
/// column. It is also the validator: a frame that names no inventoried site
/// witnesses nothing, so a runtime that reports the wrong frame loses a
/// witness rather than inventing one.
pub struct RubyAssertionInventory {
    root: PathBuf,
    /// (project-relative file, line) -> the sites on that line
    columns: BTreeMap<(String, usize), Vec<usize>>,
}

impl RubyAssertionInventory {
    pub fn new(root: &Path, inputs: &crate::assertion_map::Inputs) -> Self {
        let mut columns = BTreeMap::<(String, usize), Vec<usize>>::new();
        for site in &inputs.assertions {
            columns
                .entry((site.at.file.clone(), site.at.line))
                .or_default()
                // Every native manifest reports a zero-based byte column and
                // the report adds one to reach the anchor's own column.
                .push(site.at.column.saturating_sub(1));
        }
        for sites in columns.values_mut() {
            sites.sort_unstable();
            sites.dedup();
        }
        Self {
            root: root.to_path_buf(),
            columns,
        }
    }

    /// An inventory with no sites: every frame names nothing, which is what a
    /// run with no assertion inputs should see.
    pub fn empty() -> Self {
        Self {
            root: PathBuf::new(),
            columns: BTreeMap::new(),
        }
    }

    /// Ruby reports both forms: a backtrace frame is absolute, while a method
    /// defined by a file the interpreter loaded by a relative path keeps that
    /// path. A path outside the project names nothing here.
    pub fn relative(&self, path: &str) -> Option<String> {
        let candidate = Path::new(path);
        let relative = if candidate.is_absolute() {
            candidate.strip_prefix(&self.root).ok()?
        } else {
            candidate.strip_prefix("./").unwrap_or(candidate)
        };
        let text = relative.to_string_lossy().replace('\\', "/");
        (!text.is_empty() && !text.starts_with("../")).then_some(text)
    }

    /// `file:line:column` when that line holds exactly one inventoried site.
    /// Two assertions on one line cannot be told apart from a backtrace, so
    /// the frame names neither rather than guessing between them.
    pub fn locate(&self, path: &str, line: usize) -> Option<String> {
        let file = self.relative(path)?;
        match self.columns.get(&(file.clone(), line))?.as_slice() {
            [column] => Some(format!("{file}:{line}:{column}")),
            _ => None,
        }
    }
}

#[derive(Debug, Default)]
struct Observations {
    hits: BTreeSet<String>,
    vectors: BTreeMap<String, ObservedVectors>,
}

#[derive(Debug, Clone)]
struct RuntimeLimitation {
    id: String,
    reason: String,
    file: Option<String>,
    obligation: Option<String>,
}

#[derive(Debug, Default)]
struct Evidence {
    interpreters: usize,
    ruby_versions: BTreeSet<String>,
    per_identity: BTreeMap<Identity, Observations>,
    background: BTreeMap<String, Observations>,
    outcomes: OutcomesByAttempt,
    runners: RunnersByAttempt,
    test_files: TestFilesByAttempt,
    sites: SitesByAttempt,
    limitations: Vec<RuntimeLimitation>,
}

fn read_evidence_directory(directory: &Path, run_id: &str) -> Result<Evidence, RubyEvidenceError> {
    let mut evidence = Evidence::default();
    let mut files = match fs::read_dir(directory) {
        Ok(entries) => entries
            .collect::<Result<Vec<_>, _>>()
            .map_err(|error| RubyEvidenceError::Io(error.to_string()))?,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Vec::new(),
        Err(error) => return Err(RubyEvidenceError::Io(error.to_string())),
    };
    files.sort_by_key(|entry| entry.file_name());
    for entry in files {
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| RubyEvidenceError::UnsafeEntry("<non-utf8>".into()))?;
        if Path::new(&name)
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
            || !name.ends_with(".mmap")
        {
            return Err(RubyEvidenceError::UnsafeEntry(name));
        }
        let metadata = fs::symlink_metadata(entry.path())
            .map_err(|error| RubyEvidenceError::Io(error.to_string()))?;
        if !metadata.file_type().is_file() {
            return Err(RubyEvidenceError::UnsafeEntry(name));
        }
        let file =
            File::open(entry.path()).map_err(|error| RubyEvidenceError::Io(error.to_string()))?;
        // The file is immutable from Supercov's perspective after the wrapped
        // interpreter has exited. No mutable alias is created while this map
        // is alive.
        let contents = unsafe { MmapOptions::new().map(&file) }
            .map_err(|error| RubyEvidenceError::Io(error.to_string()))?;
        read_evidence_file(&name, &contents, run_id, &mut evidence)?;
    }
    Ok(evidence)
}

fn transport_u32(bytes: &[u8], offset: usize) -> Option<u32> {
    bytes
        .get(offset..offset + 4)
        .and_then(|value| value.try_into().ok())
        .map(u32::from_le_bytes)
}

fn transport_u64(bytes: &[u8], offset: usize) -> Option<u64> {
    bytes
        .get(offset..offset + 8)
        .and_then(|value| value.try_into().ok())
        .map(u64::from_le_bytes)
}

fn transport_checksum(payload: &[u8]) -> u32 {
    payload.iter().fold(0x811c_9dc5_u32, |value, byte| {
        (value ^ u32::from(*byte)).wrapping_mul(0x0100_0193)
    })
}

fn align_transport(value: usize) -> Option<usize> {
    value.checked_add(7).map(|value| value & !7)
}

fn read_evidence_file(
    name: &str,
    contents: &Mmap,
    run_id: &str,
    evidence: &mut Evidence,
) -> Result<(), RubyEvidenceError> {
    let invalid_transport = |reason: &str| RubyEvidenceError::InvalidTransport {
        file: name.into(),
        reason: reason.into(),
    };
    if contents.len() < TRANSPORT_HEADER_SIZE
        || contents.get(..8) != Some(TRANSPORT_MAGIC.as_slice())
        || transport_u32(contents, 8) != Some(TRANSPORT_VERSION)
        || transport_u32(contents, 12) != Some(TRANSPORT_HEADER_SIZE as u32)
    {
        return Err(invalid_transport("header or version does not match"));
    }
    let declared_capacity =
        transport_u64(contents, 16).ok_or_else(|| invalid_transport("capacity is missing"))?;
    if declared_capacity < TRANSPORT_HEADER_SIZE as u64 || declared_capacity > contents.len() as u64
    {
        return Err(invalid_transport(
            "declared capacity is outside the mapped file",
        ));
    }
    let dropped =
        transport_u64(contents, 24).ok_or_else(|| invalid_transport("drop counter is missing"))?;
    if dropped != 0 {
        return Err(RubyEvidenceError::DroppedRecords {
            file: name.into(),
            count: dropped,
        });
    }
    let transport_pid = transport_u64(contents, 32)
        .filter(|pid| *pid != 0)
        .ok_or_else(|| invalid_transport("process id is missing"))?;
    let mut contexts = BTreeMap::<u64, Identity>::new();
    // What each call phase recorded so far, kept until its first assertion
    // marker moves it to the phase's assertion identity.
    let mut before_assertion = BTreeMap::<u64, Observations>::new();
    let mut process_worker: Option<String> = None;
    let mut process_started = false;
    let mut process_reported = false;
    let mut cursor = TRANSPORT_HEADER_SIZE;
    let mut record_index = 0;
    while cursor + TRANSPORT_RECORD_HEADER_SIZE <= contents.len() {
        let commit = contents[cursor];
        if commit == 0 {
            // Payload bytes can exist after a killed writer, but an absent
            // commit byte makes that frame and every later zeroed frame inert.
            break;
        }
        record_index += 1;
        let line_number = record_index;
        let invalid = |reason: &str| RubyEvidenceError::InvalidRecord {
            file: name.into(),
            line: line_number,
            reason: reason.into(),
        };
        if commit != 1
            || contents[cursor + 1..cursor + 4] != [0, 0, 0]
            || contents[cursor + 12..cursor + 16] != [0, 0, 0, 0]
        {
            return Err(invalid("commit marker or reserved bytes are invalid"));
        }
        let length = transport_u32(contents, cursor + 4)
            .map(|value| value as usize)
            .ok_or_else(|| invalid("payload length is missing"))?;
        if length == 0 || length > TRANSPORT_MAX_RECORD_SIZE {
            return Err(invalid("payload length is outside the transport bound"));
        }
        let payload_start = cursor + TRANSPORT_RECORD_HEADER_SIZE;
        let payload_end = payload_start
            .checked_add(length)
            .filter(|end| *end <= contents.len())
            .ok_or_else(|| invalid("payload extends past the mapped file"))?;
        let next_cursor = align_transport(payload_end)
            .filter(|end| *end <= contents.len())
            .ok_or_else(|| invalid("aligned frame extends past the mapped file"))?;
        if contents[payload_end..next_cursor]
            .iter()
            .any(|byte| *byte != 0)
        {
            return Err(invalid("frame padding is not zero"));
        }
        let payload = &contents[payload_start..payload_end];
        let expected_checksum = transport_u32(contents, cursor + 8)
            .ok_or_else(|| invalid("payload checksum is missing"))?;
        if transport_checksum(payload) != expected_checksum {
            return Err(invalid("payload checksum does not match"));
        }
        let record: Record =
            serde_json::from_slice(payload).map_err(|error| RubyEvidenceError::InvalidRecord {
                file: name.into(),
                line: line_number,
                reason: error.to_string(),
            })?;
        match record {
            Record::Process {
                v,
                run,
                pid,
                worker,
                ruby,
                ..
            } => {
                if v != RUBY_EVIDENCE_VERSION {
                    return Err(RubyEvidenceError::UnsupportedVersion(v));
                }
                if run != run_id {
                    return Err(RubyEvidenceError::RunMismatch {
                        expected: run_id.into(),
                        actual: run,
                    });
                }
                if pid != transport_pid {
                    return Err(invalid("process record does not match the transport owner"));
                }
                let supported = ruby
                    .split('.')
                    .take(2)
                    .map(|part| part.parse::<u32>().ok())
                    .collect::<Option<Vec<_>>>()
                    .is_some_and(|parts| parts.len() == 2 && (parts[0], parts[1]) >= (3, 3));
                if !supported {
                    return Err(RubyEvidenceError::UnsupportedRuby(ruby));
                }
                evidence.interpreters += 1;
                evidence.ruby_versions.insert(ruby);
                process_started = true;
                process_worker = Some(worker);
            }
            Record::Worker { worker } => process_worker = Some(worker),
            Record::Phase {
                ctx,
                worker,
                test,
                retry,
                phase,
                ..
            } => {
                if ctx == 0 {
                    return Err(invalid("phase context 0 is reserved for background"));
                }
                if !matches!(phase.as_str(), "setup" | "call" | "teardown") {
                    return Err(invalid("unknown test phase"));
                }
                if test.trim().is_empty() || worker.trim().is_empty() {
                    return Err(invalid("phase identity must name a worker and test"));
                }
                if phase == "call" {
                    before_assertion.insert(ctx, Observations::default());
                }
                contexts.insert(
                    ctx,
                    Identity {
                        worker,
                        test,
                        retry,
                        phase,
                    },
                );
            }
            Record::Outcome {
                worker,
                test,
                retry,
                phase,
                outcome,
                xfail,
                runner,
                file,
            } => {
                if !matches!(phase.as_str(), "setup" | "call" | "teardown") {
                    return Err(invalid("unknown test outcome phase"));
                }
                if !matches!(
                    outcome.as_str(),
                    "passed" | "failed" | "skipped" | "rerun" | "error"
                ) {
                    return Err(invalid("unknown test outcome"));
                }
                if !matches!(
                    runner.as_str(),
                    RSPEC_RUNNER | MINITEST_RUNNER | TEST_UNIT_RUNNER | CUCUMBER_RUNNER
                ) {
                    return Err(invalid("unknown Ruby test runner"));
                }
                let key = (worker, test, retry);
                if let Some(previous) = evidence.runners.get(&key)
                    && previous != &runner
                {
                    return Err(invalid("one attempt was reported by two runners"));
                }
                evidence.runners.insert(key.clone(), runner);
                if let Some(file) = file.filter(|path| !path.is_empty()) {
                    evidence.test_files.entry(key.clone()).or_insert(file);
                }
                fold_outcome(
                    evidence.outcomes.entry(key).or_default(),
                    phase,
                    outcome,
                    xfail,
                );
            }
            Record::Hit { ctx, id } => {
                if let Some(before) = before_assertion.get_mut(&ctx) {
                    before.hits.insert(id.clone());
                }
                observations(
                    evidence,
                    &contexts,
                    process_worker.as_deref(),
                    ctx,
                    name,
                    line_number,
                )?
                .hits
                .insert(id);
            }
            Record::Dec { ctx, id, v, o } => {
                if v.is_empty() || !v.bytes().all(|digit| matches!(digit, b'0' | b'1' | b'2')) {
                    return Err(invalid("decision vector digits must be 0, 1 or 2"));
                }
                if o > 1 {
                    return Err(invalid("decision outcome must be 0 or 1"));
                }
                let values = v
                    .bytes()
                    .map(|digit| match digit {
                        b'0' => None,
                        b'1' => Some(false),
                        _ => Some(true),
                    })
                    .collect::<Vec<_>>();
                if let Some(before) = before_assertion.get_mut(&ctx) {
                    before
                        .vectors
                        .entry(id.clone())
                        .or_default()
                        .insert((values.clone(), o == 1));
                }
                observations(
                    evidence,
                    &contexts,
                    process_worker.as_deref(),
                    ctx,
                    name,
                    line_number,
                )?
                .vectors
                .entry(id)
                .or_default()
                .insert((values, o == 1));
            }
            Record::Assert { ctx } => {
                // Only the first marker of a call phase moves anything; a
                // later one, or one outside a call phase, is inert.
                if let Some(before) = before_assertion.remove(&ctx) {
                    let identity = contexts
                        .get(&ctx)
                        .ok_or(RubyEvidenceError::UnknownContext {
                            file: name.into(),
                            line: line_number,
                            context: ctx,
                        })?;
                    let asserted = evidence
                        .per_identity
                        .entry(Identity {
                            phase: "assertion".into(),
                            ..identity.clone()
                        })
                        .or_default();
                    asserted.hits.extend(before.hits);
                    for (id, vectors) in before.vectors {
                        asserted.vectors.entry(id).or_default().extend(vectors);
                    }
                }
            }
            Record::Asite { ctx, f, l } => {
                if f.is_empty() || l == 0 {
                    return Err(invalid("assertion site needs a file and a line"));
                }
                let identity = contexts
                    .get(&ctx)
                    .ok_or(RubyEvidenceError::UnknownContext {
                        file: name.into(),
                        line: line_number,
                        context: ctx,
                    })?;
                // Only the call phase witnesses a test's assertions; setup and
                // teardown assertions belong to no single site under test.
                if identity.phase == "call" {
                    let key = (
                        identity.worker.clone(),
                        identity.test.clone(),
                        identity.retry,
                    );
                    let sites = evidence.sites.entry(key).or_default();
                    let site = (f, l);
                    if !sites.contains(&site) {
                        sites.push(site);
                    }
                }
            }
            Record::Limitation {
                id,
                reason,
                file,
                obligation,
            } => evidence.limitations.push(RuntimeLimitation {
                id,
                reason,
                file,
                obligation,
            }),
            Record::Exit { .. } => process_reported = true,
        }
        cursor = next_cursor;
    }
    // Ruby reads Coverage's own result in the `at_exit` that writes this
    // record, so a process that never wrote one -- killed with a signal it
    // could not catch, or left through `exit!` -- took everything it had
    // observed since its last test boundary with it. Nothing outside that
    // process can recover the counters or say which lines they were, so the
    // run declares the gap instead of reporting those lines as merely
    // uncovered. A declared limitation blocks completeness, which is the
    // honest answer: coverage measured here is a floor, not a total.
    if process_started && !process_reported {
        evidence.limitations.push(RuntimeLimitation {
            id: "ruby-process-did-not-report".into(),
            reason: format!(
                "an interpreter process (pid {transport_pid}) ended without reporting, so line, branch and method observations it made after its last test boundary are missing; a process killed with SIGKILL, or one that left through exit!, cannot flush them"
            ),
            file: None,
            obligation: None,
        });
    }
    Ok(())
}

fn observations<'a>(
    evidence: &'a mut Evidence,
    contexts: &BTreeMap<u64, Identity>,
    process_worker: Option<&str>,
    context: u64,
    file: &str,
    line: usize,
) -> Result<&'a mut Observations, RubyEvidenceError> {
    if context == 0 {
        return Ok(evidence
            .background
            .entry(process_worker.unwrap_or("main").to_owned())
            .or_default());
    }
    let identity = contexts
        .get(&context)
        .ok_or(RubyEvidenceError::UnknownContext {
            file: file.into(),
            line,
            context,
        })?;
    Ok(evidence.per_identity.entry(identity.clone()).or_default())
}

pub fn ruby_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "ruby".into(),
        variant: "ruby-owned-coverage".into(),
        name: "ruby-coverage-probes-v1".into(),
        completeness_meaning: "Every statement, method, decision vector, loop, short-circuit, case and rescue obligation Supercov derived from the source was observed through Ruby's Coverage module or a load-time probe with exact test identity; the declared limitations remain separate.".into(),
        measured: vec![
            "executable statements proven by Ruby's line coverage, or a probe when a line holds several".into(),
            "method definitions entered (Ruby's method coverage)".into(),
            "if/unless/elsif/ternary/while/until decisions with masking MC/DC vectors from operand probes".into(),
            "while, until, for and iterator-block (each, map, times, ...) zero-versus-entered iteration".into(),
            "&&, ||, ||= and &&= short-circuit alternatives".into(),
            "case/when and case/in clause selection, safe navigation".into(),
            "begin/rescue completion, handler selection and exception propagation".into(),
            "RSpec, Minitest, test-unit and Cucumber worker, test and setup/call/teardown phase identity".into(),
            "evidence a test recorded before its first assertion, linked to that assertion when the test passes".into(),
        ],
        not_measured: vec![
            "blocks and lambdas as function entry points (they are statements inside their methods)".into(),
            "blocks passed by reference (map(&:to_s)) as loops: they have no block body to observe".into(),
            "line, branch and method observations made while test phases overlapped in threads (attributed to the run; probe observations stay per test)".into(),
            "causal linkage to individual actions, or to any assertion after a test's first".into(),
            "code compiled from strings at runtime (eval, instance_eval with strings)".into(),
            "child coverage outside Process.spawn, Kernel#spawn, Kernel#system and fork".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

fn phase_id(run: &str, identity: &Identity) -> String {
    stable_id(
        "ruby-phase",
        &[
            run,
            &identity.worker,
            &identity.test,
            &identity.retry.to_string(),
            &identity.phase,
        ],
    )
}

fn scope(run: &str, worker: &str, test: &str, retry: usize) -> ExecutionScope {
    ExecutionScope {
        version: 1,
        run_id: run.into(),
        worker_id: worker.into(),
        test_id: test.into(),
        test_key: stable_id("ruby-test", &[worker, test]),
        retry,
        attempt_id: stable_id("ruby-attempt", &[run, worker, test, &retry.to_string()]),
    }
}

struct ManifestIndex<'a> {
    points: BTreeSet<&'a str>,
    alternatives: BTreeSet<&'a str>,
    decisions: BTreeMap<&'a str, &'a DecisionMeta>,
    lines: BTreeMap<&'a str, (String, usize)>,
    sources: BTreeMap<&'a str, &'a str>,
}

impl<'a> ManifestIndex<'a> {
    fn new(manifest: &'a CoverageManifest) -> Self {
        let mut lines = BTreeMap::new();
        let mut sources = BTreeMap::new();
        for point in &manifest.points {
            lines.insert(point.id.as_str(), (point.file.clone(), point.line));
            sources.insert(point.id.as_str(), point.source.as_str());
        }
        for decision in &manifest.decisions {
            lines.insert(decision.id.as_str(), (decision.file.clone(), decision.line));
            sources.insert(decision.id.as_str(), decision.source.as_str());
        }
        for branch in &manifest.branches {
            lines.insert(branch.id.as_str(), (branch.file.clone(), branch.line));
            sources.insert(branch.id.as_str(), branch.source.as_str());
        }
        Self {
            points: manifest
                .points
                .iter()
                .map(|point| point.id.as_str())
                .collect(),
            alternatives: manifest
                .branches
                .iter()
                .flat_map(|branch| branch.alternatives.iter().map(|alt| alt.id.as_str()))
                .collect(),
            decisions: manifest
                .decisions
                .iter()
                .map(|decision| (decision.id.as_str(), decision))
                .collect(),
            lines,
            sources,
        }
    }
}

fn snapshot(
    index: &ManifestIndex<'_>,
    observations: &Observations,
    phase: &str,
) -> Result<RuntimeSnapshot, RubyEvidenceError> {
    let mut hits = BTreeSet::new();
    for id in &observations.hits {
        if !index.points.contains(id.as_str()) && !index.alternatives.contains(id.as_str()) {
            return Err(RubyEvidenceError::UnknownObligation(id.clone()));
        }
        hits.insert(id.clone());
    }
    let mut decisions = Vec::new();
    let mut events = Vec::new();
    let mut clock = 1;
    for id in &hits {
        events.push(RuntimeEvent {
            event_type: "hit".into(),
            id: id.clone(),
            vector: None,
            timestamp_ms: clock,
            phase_id: Some(phase.into()),
            statement_id: None,
            environment: "ruby".into(),
        });
        clock += 1;
    }
    for (id, vectors) in &observations.vectors {
        let Some(meta) = index.decisions.get(id.as_str()) else {
            return Err(RubyEvidenceError::UnknownObligation(id.clone()));
        };
        let mut observed = Vec::new();
        for (values, outcome) in vectors {
            if values.len() != meta.conditions.len() {
                return Err(RubyEvidenceError::InvalidVector {
                    id: id.clone(),
                    expected: meta.conditions.len(),
                    actual: values.len(),
                });
            }
            let vector = McdcVector {
                values: values.clone(),
                outcome: *outcome,
            };
            events.push(RuntimeEvent {
                event_type: "decision".into(),
                id: id.clone(),
                vector: Some(vector.clone()),
                timestamp_ms: clock,
                phase_id: Some(phase.into()),
                statement_id: None,
                environment: "ruby".into(),
            });
            clock += 1;
            observed.push(vector);
        }
        decisions.push(DecisionSnapshot {
            meta: (*meta).clone(),
            vectors: observed,
        });
    }
    Ok(RuntimeSnapshot {
        decisions,
        hits: hits.into_iter().collect(),
        events,
        logicals: Vec::new(),
        phase_id: None,
    })
}

/// One phase, however many times its runner reported it, as on the Python
/// path: a phase id is derived from an identity with no room for a repeat, so
/// a second report of one phase duplicated an id and the run was refused
/// whole. No Ruby runner reports twice today -- RSpec identifies an example by
/// position, Minitest and test-unit by class and method, Cucumber by line --
/// but losing a whole run is too much to leave resting on that.
fn fold_outcome(
    outcomes: &mut Vec<(String, String, bool)>,
    phase: String,
    outcome: String,
    xfail: bool,
) {
    let Some(reported) = outcomes.iter_mut().find(|(name, _, _)| *name == phase) else {
        outcomes.push((phase, outcome, xfail));
        return;
    };
    if outcome_severity(&outcome) > outcome_severity(&reported.1) {
        reported.1 = outcome;
    }
    reported.2 |= xfail;
}

/// The order `attempt_status` reads outcomes in, as one value.
fn outcome_severity(outcome: &str) -> u8 {
    match outcome {
        "failed" | "rerun" | "error" => 2,
        "skipped" => 1,
        _ => 0,
    }
}

fn attempt_status(outcomes: &[(String, String, bool)]) -> String {
    if outcomes
        .iter()
        .any(|(_, outcome, _)| matches!(outcome.as_str(), "failed" | "rerun" | "error"))
    {
        "failed"
    } else if outcomes.iter().any(|(_, outcome, _)| outcome == "skipped") {
        "skipped"
    } else {
        "passed"
    }
    .into()
}

#[derive(Debug, Clone, PartialEq)]
pub struct RubyFrontendRun {
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
    pub tests: usize,
    pub interpreters: usize,
    pub ruby_versions: Vec<String>,
}

impl RubyFrontendRun {
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let model = PersistedCoverageModel::from_declaration(
            self.request
                .coverage_model
                .as_ref()
                .expect("Ruby frontend always declares a coverage model"),
        )
        .expect("Ruby coverage model is contract-valid");
        let mut entries = vec![
            EvidenceArchiveEntry {
                path: "coverage-model.json".into(),
                contents: serde_json::to_vec(&model)?,
            },
            EvidenceArchiveEntry {
                path: "frontend.json".into(),
                contents: serde_json::to_vec(&self.declaration)?,
            },
            EvidenceArchiveEntry {
                path: "manifest.json".into(),
                contents: serde_json::to_vec(&self.request.manifest)?,
            },
        ];
        for (index, result) in self.request.raw_results.iter().enumerate() {
            entries.push(EvidenceArchiveEntry {
                path: format!("results/{index:08}/mcdc.json"),
                contents: serde_json::to_vec(result)?,
            });
        }
        Ok(entries)
    }
}

/// Join the runtime's evidence directory with the ahead-of-run manifest into
/// a protocol-conformant frontend run.
pub fn build_ruby_frontend_run(
    manifest: &CoverageManifest,
    evidence_directory: &Path,
    run_id: &str,
    generated_at: &str,
    test_exit_code: i32,
    assertions: &RubyAssertionInventory,
) -> Result<RubyFrontendRun, RubyEvidenceError> {
    let evidence = read_evidence_directory(evidence_directory, run_id)?;
    if evidence.interpreters == 0 {
        return Err(RubyEvidenceError::NoInterpreter);
    }
    if evidence.outcomes.is_empty() {
        return Err(RubyEvidenceError::NoTests);
    }
    let Evidence {
        interpreters,
        ruby_versions,
        per_identity,
        background,
        outcomes,
        runners,
        test_files,
        sites,
        limitations,
    } = evidence;
    let mut manifest = manifest.clone();
    let index = ManifestIndex::new(&manifest);

    let mut raw_results = Vec::new();
    let mut observed_runners = BTreeSet::new();
    let mut identities_by_attempt =
        BTreeMap::<(String, String, usize), Vec<(&Identity, &Observations)>>::new();
    for (identity, observations) in &per_identity {
        identities_by_attempt
            .entry((
                identity.worker.clone(),
                identity.test.clone(),
                identity.retry,
            ))
            .or_default()
            .push((identity, observations));
    }
    for ((worker, test, retry), mut outcomes) in outcomes {
        let runner = runners
            .get(&(worker.clone(), test.clone(), retry))
            .cloned()
            .unwrap_or_else(default_runner);
        let attempt_identities = identities_by_attempt
            .remove(&(worker.clone(), test.clone(), retry))
            .unwrap_or_default();
        observed_runners.insert(runner.clone());
        outcomes.sort_by_key(|(phase, _, _)| match phase.as_str() {
            "setup" => 0,
            "call" => 1,
            _ => 2,
        });
        let mut phases = Vec::new();
        let mut runtime = Vec::new();
        let mut observed_phases = BTreeSet::new();
        for (position, (phase_name, outcome, xfail)) in outcomes.iter().enumerate() {
            observed_phases.insert(phase_name.clone());
            let identity = Identity {
                worker: worker.clone(),
                test: test.clone(),
                retry,
                phase: phase_name.clone(),
            };
            let id = phase_id(run_id, &identity);
            phases.push(CoveragePhase {
                id: id.clone(),
                kind: match phase_name.as_str() {
                    "call" => "test",
                    value => value,
                }
                .into(),
                operation: format!("{runner} {phase_name}"),
                source: Some(test.clone()),
                caused_by_phase_id: None,
                started_at_ms: position as i64 * 2 + 1,
                ended_at_ms: Some(position as i64 * 2 + 2),
                status: Some(match outcome.as_str() {
                    "rerun" | "error" => "failed".into(),
                    value => value.into(),
                }),
                error: None,
            });
            if let Some((_, observations)) = attempt_identities
                .iter()
                .find(|(candidate, _)| candidate.phase == phase_name.as_str())
            {
                runtime.push(snapshot(&index, observations, &id)?);
            }
            if phase_name != "call" {
                continue;
            }
            // What the test recorded before its first assertion is that
            // assertion's evidence, linked when the phase passed outright:
            // a failed, skipped or expected-to-fail phase witnessed nothing.
            if let Some((identity, observations)) = attempt_identities
                .iter()
                .find(|(candidate, _)| candidate.phase == "assertion")
            {
                observed_phases.insert("assertion".to_owned());
                let id = phase_id(run_id, identity);
                phases.push(CoveragePhase {
                    id: id.clone(),
                    kind: "assertion".into(),
                    operation: format!("{runner} assertion"),
                    source: Some(test.clone()),
                    caused_by_phase_id: None,
                    started_at_ms: position as i64 * 2 + 1,
                    ended_at_ms: Some(position as i64 * 2 + 2),
                    status: Some(
                        if outcome == "passed" && !*xfail {
                            "passed"
                        } else {
                            "failed"
                        }
                        .into(),
                    ),
                    error: None,
                });
                runtime.push(snapshot(&index, observations, &id)?);
                // One phase per assertion site the call phase reached, so an
                // assertion map can tell the sites apart. The per-test phase
                // above keeps carrying the pre-assertion evidence; these are
                // witnesses only, and a site the inventory does not know is
                // skipped rather than guessed at.
                let attempt = (worker.clone(), test.clone(), retry);
                for (path, line) in sites.get(&attempt).into_iter().flatten() {
                    let Some(location) = assertions.locate(path, *line) else {
                        continue;
                    };
                    phases.push(CoveragePhase {
                        id: stable_id("ruby-assertion", &[run_id, &id, &location]),
                        kind: "assertion".into(),
                        operation: format!("{runner} assertion at {location}"),
                        source: Some(location),
                        caused_by_phase_id: Some(id.clone()),
                        started_at_ms: position as i64 * 2 + 1,
                        ended_at_ms: Some(position as i64 * 2 + 2),
                        status: Some(
                            if outcome == "passed" && !*xfail {
                                "passed"
                            } else {
                                "failed"
                            }
                            .into(),
                        ),
                        error: None,
                    });
                }
            }
        }
        // A phase the runtime entered but the runner never reported (the worker
        // died inside it) is a failed phase with its evidence kept.
        for (identity, observations) in attempt_identities {
            if !observed_phases.contains(&identity.phase) {
                let id = phase_id(run_id, identity);
                phases.push(CoveragePhase {
                    id: id.clone(),
                    kind: match identity.phase.as_str() {
                        "call" => "test",
                        value => value,
                    }
                    .into(),
                    operation: format!("{runner} {}", identity.phase),
                    source: Some(test.clone()),
                    caused_by_phase_id: None,
                    started_at_ms: phases.len() as i64 * 2 + 1,
                    ended_at_ms: None,
                    status: Some("failed".into()),
                    error: Some("the phase started but the runner reported no outcome".into()),
                });
                runtime.push(snapshot(&index, observations, &id)?);
            }
        }
        let status = if phases.iter().any(|phase| phase.error.is_some()) {
            "failed".into()
        } else {
            attempt_status(&outcomes)
        };
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, &worker, &test, retry)),
            test: test.clone(),
            // What the runner named, as the project names it. A runner
            // identity is not a path, so the old derivation stays only as a
            // fallback for an adapter that cannot name the file.
            test_file: test_files
                .get(&(worker.clone(), test.clone(), retry))
                .and_then(|path| assertions.relative(path))
                .or_else(|| test.split("::").next().map(str::to_owned)),
            title: test.rsplit("::").next().map(str::to_owned),
            retry: Some(retry),
            status: Some(status),
            expected_status: Some(
                if outcomes.iter().any(|(_, _, xfail)| *xfail) {
                    "failed"
                } else {
                    "passed"
                }
                .into(),
            ),
            flaky: false,
            provenance: TestProvenance {
                runner: runner.clone(),
                kind: "unit".into(),
                project: None,
                source: RUBY_FRONTEND_VERSION.into(),
            },
            role: "test".into(),
            // What a Ruby test is recorded as reaching is its own and is not
            // all of it. The runtime asks Ruby's Coverage for one-shot lines,
            // which report a line the first time it executes in the process
            // and never again -- so the first test to reach a line is credited
            // with it and every later test that runs the same line is recorded
            // as having reached nothing there. Cheap to collect, and it makes
            // a test's hits a lower bound rather than a description.
            attribution: crate::coverage_report::ATTRIBUTION_PARTIAL.into(),
            phases,
            runtime,
            browser: Vec::new(),
            server: Vec::new(),
        });
    }
    // Phases with observations whose test never produced any outcome at all
    // (for example a worker killed during its first phase).
    let default_observed = observed_runners
        .iter()
        .next()
        .cloned()
        .unwrap_or_else(default_runner);
    for ((worker, test, retry), identities) in identities_by_attempt {
        let runner = default_observed.clone();
        let mut phases = Vec::new();
        let mut runtime = Vec::new();
        for (position, (identity, observations)) in identities.iter().enumerate() {
            let id = phase_id(run_id, identity);
            phases.push(CoveragePhase {
                id: id.clone(),
                kind: match identity.phase.as_str() {
                    "call" => "test",
                    value => value,
                }
                .into(),
                operation: format!("{runner} {}", identity.phase),
                source: Some(test.clone()),
                caused_by_phase_id: None,
                started_at_ms: position as i64 * 2 + 1,
                ended_at_ms: None,
                status: Some("failed".into()),
                error: Some("the phase started but the runner reported no outcome".into()),
            });
            runtime.push(snapshot(&index, observations, &id)?);
        }
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, &worker, &test, retry)),
            test: test.clone(),
            // What the runner named, as the project names it. A runner
            // identity is not a path, so the old derivation stays only as a
            // fallback for an adapter that cannot name the file.
            test_file: test_files
                .get(&(worker.clone(), test.clone(), retry))
                .and_then(|path| assertions.relative(path))
                .or_else(|| test.split("::").next().map(str::to_owned)),
            title: test.rsplit("::").next().map(str::to_owned),
            retry: Some(retry),
            status: Some("failed".into()),
            expected_status: Some("passed".into()),
            flaky: false,
            provenance: TestProvenance {
                runner: runner.clone(),
                kind: "unit".into(),
                project: None,
                source: RUBY_FRONTEND_VERSION.into(),
            },
            role: "test".into(),
            // What a Ruby test is recorded as reaching is its own and is not
            // all of it. The runtime asks Ruby's Coverage for one-shot lines,
            // which report a line the first time it executes in the process
            // and never again -- so the first test to reach a line is credited
            // with it and every later test that runs the same line is recorded
            // as having reached nothing there. Cheap to collect, and it makes
            // a test's hits a lower bound rather than a description.
            attribution: crate::coverage_report::ATTRIBUTION_PARTIAL.into(),
            phases,
            runtime,
            browser: Vec::new(),
            server: Vec::new(),
        });
    }
    for (worker, observations) in &background {
        if observations.hits.is_empty() && observations.vectors.is_empty() {
            continue;
        }
        let test = format!("__supercov_background__:{worker}");
        let identity = Identity {
            worker: worker.clone(),
            test: test.clone(),
            retry: 0,
            phase: "background".into(),
        };
        let phase = phase_id(run_id, &identity);
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, worker, &test, 0)),
            test: "Ruby load and background execution".into(),
            test_file: None,
            title: None,
            retry: Some(0),
            status: Some("unknown".into()),
            expected_status: None,
            flaky: false,
            provenance: TestProvenance {
                runner: default_observed.clone(),
                kind: "unit".into(),
                project: None,
                source: RUBY_FRONTEND_VERSION.into(),
            },
            role: "background".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: vec![CoveragePhase {
                id: phase.clone(),
                kind: "background".into(),
                operation: "Ruby load background".into(),
                source: None,
                caused_by_phase_id: None,
                started_at_ms: 0,
                ended_at_ms: Some(0),
                status: Some("passed".into()),
                error: None,
            }],
            runtime: vec![snapshot(&index, observations, &phase)?],
            browser: Vec::new(),
            server: Vec::new(),
        });
    }

    // Runtime-detected limitations: obligations the runtime could not map
    // become unmeasured, and every limitation ID joins the manifest so the
    // declaration and manifest agree.
    let mut limitation_ids = manifest
        .limitations
        .iter()
        .filter_map(|item| item.get("id").and_then(serde_json::Value::as_str))
        .map(str::to_owned)
        .collect::<BTreeSet<_>>();
    let mut unmeasured = manifest.unmeasured.iter().cloned().collect::<BTreeSet<_>>();
    let mut new_limitations = Vec::new();
    for limitation in &limitations {
        if let Some(obligation) = &limitation.obligation {
            if !index.lines.contains_key(obligation.as_str()) {
                return Err(RubyEvidenceError::UnknownObligation(obligation.clone()));
            }
            unmeasured.insert(obligation.clone());
        } else if let Some(file) = &limitation.file {
            // A code-object mapping failure or missing debug ranges prevents
            // every obligation in that source file from being observed. Mark
            // the whole file unmeasured instead of presenting its denominator
            // as ordinary uncovered code.
            unmeasured.extend(
                index
                    .lines
                    .iter()
                    .filter(|(_, (obligation_file, _))| obligation_file == file)
                    .map(|(id, _)| (*id).to_owned()),
            );
        }
        if limitation_ids.insert(limitation.id.clone()) {
            let (file, line) = limitation
                .obligation
                .as_deref()
                .and_then(|id| index.lines.get(id).cloned())
                .unwrap_or_else(|| {
                    (
                        limitation.file.clone().unwrap_or_else(|| {
                            manifest
                                .points
                                .first()
                                .map_or(".".into(), |point| point.file.clone())
                        }),
                        1,
                    )
                });
            let source = limitation
                .obligation
                .as_deref()
                .and_then(|id| index.sources.get(id))
                .map(|source| source.lines().next().unwrap_or_default().to_owned())
                .unwrap_or_default();
            new_limitations.push(json!({
                "id": limitation.id,
                "kind": "semantic-safety",
                "file": file,
                "line": line,
                "column": 0,
                "source": source,
                "reason": limitation.reason
            }));
        }
    }
    manifest.limitations.extend(new_limitations);
    manifest.unmeasured = unmeasured.into_iter().collect();
    let structural_limitations = limitation_ids.into_iter().collect::<Vec<_>>();

    // Retries are separate raw results so their coverage remains attempt
    // exact, but the public lifecycle diagnostic reports logical tests rather
    // than inflating the count when a flaky test is rerun.
    let tests = raw_results
        .iter()
        .filter(|raw| raw.role == "test")
        .map(|raw| raw.test.as_str())
        .collect::<BTreeSet<_>>()
        .len();
    Ok(RubyFrontendRun {
        declaration: FrontendRunDeclaration {
            protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
            frontend_id: "ruby".into(),
            frontend_version: RUBY_FRONTEND_VERSION.into(),
            language: "ruby".into(),
            structural_source: StructuralSource::OwnedProbes,
            runners: observed_runners
                .iter()
                .map(|runner| FrontendRunnerDeclaration {
                    runner: runner.clone(),
                    execution_model: ExecutionModel::SerialInProcess,
                    attribution: FrontendAttribution {
                        run: AttributionPrecision::Exact,
                        worker: AttributionPrecision::Exact,
                        test: AttributionPrecision::Exact,
                        retry: AttributionPrecision::Exact,
                        phase: AttributionPrecision::Exact,
                        action: AttributionPrecision::Unavailable,
                        assertion: AttributionPrecision::Exact,
                    },
                    limitations: vec![
                        FrontendLimitation {
                            id: format!("ruby-{runner}-action-linkage"),
                            scopes: vec![FrontendLimitationScope::Action],
                            reason: format!("{runner} exposes no general action lifecycle"),
                        },
                        // Declared because it was not, and the declaration is
                        // what a reader checks a number against. Ruby's
                        // Coverage reports a line the first time it executes
                        // in the process and never again, which is what makes
                        // collecting it cheap: the first test to reach a line
                        // is credited with it and every later test that runs
                        // the same line is recorded against none of it. What a
                        // test is credited with is its own; what it is not
                        // credited with is not evidence it did not run.
                        FrontendLimitation {
                            id: format!("ruby-{runner}-first-sighting-lines"),
                            scopes: vec![FrontendLimitationScope::Test],
                            reason:
                                "Ruby records a line for the first test that reaches it, so a test's coverage is a lower bound and the run's is its upper one"
                                    .into(),
                        },
                    ],
                })
                .collect(),
            structural_limitations,
        },
        request: CoverageReportRequest {
            run_id: run_id.into(),
            manifest,
            raw_results,
            generated_at: generated_at.into(),
            coverage_model: Some(ruby_coverage_model()),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(test_exit_code)),
        },
        tests,
        interpreters,
        ruby_versions: ruby_versions.into_iter().collect(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        coverage_analysis::PointKind, frontend_protocol::validate_frontend_report_request,
        ruby_instrumenter::build_ruby_obligations,
    };

    fn frame(payload: &[u8]) -> Vec<u8> {
        let mut bytes = vec![1u8, 0, 0, 0];
        bytes.extend_from_slice(&(payload.len() as u32).to_le_bytes());
        bytes.extend_from_slice(&transport_checksum(payload).to_le_bytes());
        bytes.extend_from_slice(&[0, 0, 0, 0]);
        bytes.extend_from_slice(payload);
        while bytes.len() % 8 != 0 {
            bytes.push(0);
        }
        bytes
    }

    fn transport(records: &[serde_json::Value]) -> Vec<u8> {
        let mut body = Vec::new();
        for record in records {
            body.extend(frame(record.to_string().as_bytes()));
        }
        let capacity = TRANSPORT_HEADER_SIZE + body.len();
        let mut bytes = vec![0u8; TRANSPORT_HEADER_SIZE];
        bytes[..8].copy_from_slice(TRANSPORT_MAGIC);
        bytes[8..12].copy_from_slice(&TRANSPORT_VERSION.to_le_bytes());
        bytes[12..16].copy_from_slice(&(TRANSPORT_HEADER_SIZE as u32).to_le_bytes());
        bytes[16..24].copy_from_slice(&(capacity as u64).to_le_bytes());
        bytes[32..40].copy_from_slice(&7u64.to_le_bytes());
        bytes.extend(body);
        bytes
    }

    fn temporary(name: &str) -> std::path::PathBuf {
        let nonce = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-ruby-evidence-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir_all(&path).unwrap();
        path
    }

    #[test]
    fn declares_the_gap_when_a_process_never_reported() {
        // Coverage's own result is read in the `at_exit` that writes the exit
        // record, so a transport without one belongs to a process that was
        // killed or left through `exit!`. What it observed is unrecoverable and
        // unknowable, so the run says so rather than reporting those lines as
        // uncovered. The same records WITH an exit record must stay silent, or
        // every ordinary run would claim a gap it does not have.
        let source = "def f(a)\n  a\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let statement = obligations
            .manifest
            .points
            .iter()
            .find(|point| point.kind == PointKind::Statement)
            .unwrap();
        let base = [
            serde_json::json!({"t":"process","v":1,"run":"run-1","pid":7,"worker":"main","ruby":"4.0.6","executable":"ruby","argv":["child.rb"]}),
            serde_json::json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"MTest#test_x","retry":0,"phase":"call"}),
            serde_json::json!({"t":"hit","ctx":1,"id":statement.id}),
            serde_json::json!({"t":"outcome","worker":"main","test":"MTest#test_x","retry":0,"phase":"call","outcome":"passed","xfail":false,"runner":"minitest"}),
        ];

        let killed = temporary("killed");
        fs::write(killed.join("main.7.a.mmap"), transport(&base)).unwrap();
        let run = build_ruby_frontend_run(
            &obligations.manifest,
            &killed,
            "run-1",
            "now",
            0,
            &RubyAssertionInventory::empty(),
        )
        .unwrap();
        let declared = serde_json::to_string(&run.request.manifest.limitations).unwrap();
        assert!(
            declared.contains("ruby-process-did-not-report"),
            "a process that never reported must declare the gap: {declared}"
        );
        fs::remove_dir_all(&killed).unwrap();

        let mut clean = base.to_vec();
        clean.push(serde_json::json!({"t":"exit","at":9}));
        let reported = temporary("reported");
        fs::write(reported.join("main.7.a.mmap"), transport(&clean)).unwrap();
        let run = build_ruby_frontend_run(
            &obligations.manifest,
            &reported,
            "run-1",
            "now",
            0,
            &RubyAssertionInventory::empty(),
        )
        .unwrap();
        let declared = serde_json::to_string(&run.request.manifest.limitations).unwrap();
        assert!(
            !declared.contains("ruby-process-did-not-report"),
            "a process that reported cleanly must declare nothing: {declared}"
        );
        fs::remove_dir_all(&reported).unwrap();
    }

    // A path is only absolute in the platform's own spelling: "/project" is a
    // relative path on Windows, where an absolute one needs a drive. The
    // runtimes report whatever the interpreter loaded, so these fixtures have
    // to speak the host's dialect too.
    fn under(first: &str, rest: &str) -> String {
        let mut path = PathBuf::from(if cfg!(windows) {
            format!("C:\\{first}")
        } else {
            format!("/{first}")
        });
        for part in rest.split('/').filter(|part| !part.is_empty()) {
            path.push(part);
        }
        path.to_string_lossy().into_owned()
    }

    fn inventory_of(root: &str, sites: &[(&str, usize, usize)]) -> RubyAssertionInventory {
        use crate::assertion_map::{Anchor, Files, Inputs, InventorySite};
        RubyAssertionInventory::new(
            Path::new(root),
            &Inputs {
                schema_version: 1,
                language: "ruby".into(),
                context_digest: "context".into(),
                files: Files::new(),
                assertions: sites
                    .iter()
                    .map(|(file, line, column)| InventorySite {
                        at: Anchor {
                            file: (*file).into(),
                            line: *line,
                            column: *column,
                            text: "assert_equal 1, f(1)".into(),
                        },
                        operation: "assert".into(),
                    })
                    .collect(),
                limitations: vec![],
            },
        )
    }

    fn assertion_sources(run: &RubyFrontendRun) -> Vec<String> {
        run.request.raw_results[0]
            .phases
            .iter()
            .filter(|phase| phase.kind == "assertion")
            .filter_map(|phase| phase.source.clone())
            .collect()
    }

    fn run_with_sites(
        name: &str,
        sites: &[serde_json::Value],
        outcome_file: Option<&str>,
        inventory: &RubyAssertionInventory,
    ) -> RubyFrontendRun {
        let source = "def f(a)\n  a\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let mut outcome = serde_json::json!({"t":"outcome","worker":"main","test":"MTest#test_x","retry":0,"phase":"call","outcome":"passed","xfail":false,"runner":"minitest"});
        if let Some(file) = outcome_file {
            outcome["file"] = serde_json::json!(file);
        }
        let mut records = vec![
            serde_json::json!({"t":"process","v":1,"run":"run-1","pid":7,"worker":"main","ruby":"4.0.6","executable":"ruby","argv":["test.rb"]}),
            serde_json::json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"MTest#test_x","retry":0,"phase":"call"}),
            serde_json::json!({"t":"assert","ctx":1}),
        ];
        records.extend(sites.iter().cloned());
        records.push(outcome);
        records.push(serde_json::json!({"t":"exit","at":9}));
        let directory = temporary(name);
        fs::write(directory.join("main.7.a.mmap"), transport(&records)).unwrap();
        let run = build_ruby_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            0,
            inventory,
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        fs::remove_dir_all(directory).unwrap();
        run
    }

    #[test]
    fn an_assertion_site_becomes_a_located_phase_when_the_inventory_names_one() {
        // A Ruby backtrace carries no column, so a line is a witness only when
        // the inventory holds exactly one site on it. The column reported is
        // zero-based, which is what every native manifest reports and what the
        // assertion report adds one to.
        let inventory = inventory_of(&under("project", ""), &[("test/m_test.rb", 6, 5)]);
        let run = run_with_sites(
            "asite-located",
            &[
                serde_json::json!({"t":"asite","ctx":1,"f":under("project", "test/m_test.rb"),"l":6}),
            ],
            None,
            &inventory,
        );
        assert!(
            assertion_sources(&run).contains(&"test/m_test.rb:6:4".to_string()),
            "expected a located assertion phase, got {:?}",
            assertion_sources(&run)
        );
    }

    #[test]
    fn an_ambiguous_or_foreign_assertion_site_witnesses_nothing() {
        // Two sites on one line cannot be told apart from a backtrace, and a
        // frame outside the project names nothing. Both lose the witness
        // rather than guessing one.
        let ambiguous = inventory_of(
            &under("project", ""),
            &[("test/m_test.rb", 6, 5), ("test/m_test.rb", 6, 30)],
        );
        let run = run_with_sites(
            "asite-ambiguous",
            &[
                serde_json::json!({"t":"asite","ctx":1,"f":under("project", "test/m_test.rb"),"l":6}),
            ],
            None,
            &ambiguous,
        );
        assert_eq!(
            assertion_sources(&run),
            vec!["MTest#test_x".to_string()],
            "only the per-test assertion phase should remain"
        );

        let known = inventory_of(&under("project", ""), &[("test/m_test.rb", 6, 5)]);
        let outside = run_with_sites(
            "asite-outside",
            &[
                serde_json::json!({"t":"asite","ctx":1,"f":under("elsewhere", "test/m_test.rb"),"l":6}),
            ],
            None,
            &known,
        );
        assert_eq!(
            assertion_sources(&outside),
            vec!["MTest#test_x".to_string()]
        );
    }

    #[test]
    fn the_runner_names_the_test_file_in_either_path_form() {
        // Minitest keeps the path the interpreter loaded, which may be
        // relative; a backtrace is absolute. Both name the same project file,
        // and an adapter that names none falls back to the identity.
        let inventory = inventory_of(&under("project", ""), &[("test/m_test.rb", 6, 5)]);
        for reported in [
            under("project", "test/m_test.rb"),
            "test/m_test.rb".to_owned(),
            "./test/m_test.rb".to_owned(),
        ] {
            let run = run_with_sites("asite-file", &[], Some(reported.as_str()), &inventory);
            assert_eq!(
                run.request.raw_results[0].test_file.as_deref(),
                Some("test/m_test.rb"),
                "{reported} should resolve to the project path"
            );
        }
        let without = run_with_sites("asite-nofile", &[], None, &inventory);
        assert_eq!(
            without.request.raw_results[0].test_file.as_deref(),
            Some("MTest#test_x"),
            "an adapter that cannot name a file keeps the identity fallback"
        );
    }

    #[test]
    fn a_phase_a_runner_reported_more_than_once_is_one_phase() {
        // The Python path lost a suite's whole run to a repeated phase id
        // (#40). No Ruby runner reports a phase twice today, but the reader is
        // the same shape, and a run is too much to lose to it.
        let source = "def f(a)\n  a\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let statement = obligations
            .manifest
            .points
            .iter()
            .find(|point| point.kind == PointKind::Statement)
            .unwrap();
        let again = |outcome: &str| {
            serde_json::json!({"t":"outcome","worker":"main","test":"MTest#test_x","retry":0,
                               "phase":"call","outcome":outcome,"xfail":false,"runner":"minitest"})
        };
        let records = [
            serde_json::json!({"t":"process","v":1,"run":"run-1","pid":7,"worker":"main","ruby":"4.0.6","executable":"ruby","argv":["test.rb"]}),
            serde_json::json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"MTest#test_x","retry":0,"phase":"call"}),
            serde_json::json!({"t":"hit","ctx":1,"id":statement.id}),
            again("passed"),
            again("failed"),
            again("passed"),
            serde_json::json!({"t":"exit","at":9}),
        ];
        let directory = temporary("repeated-phase");
        fs::write(directory.join("main.7.a.mmap"), transport(&records)).unwrap();
        let run = build_ruby_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            1,
            &RubyAssertionInventory::empty(),
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        let test = &run.request.raw_results[0];
        assert_eq!(test.phases.len(), 1, "{:?}", test.phases);
        assert_eq!(test.status.as_deref(), Some("failed"));
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn evidence_before_the_first_assertion_links_to_it_when_the_test_passes() {
        // The runtime's marker says everything the call phase recorded so far
        // ran before an assertion. That evidence carries an assertion phase
        // that passed with the test; what ran after the marker, and all of a
        // test that failed, stays execution only. A second marker is inert.
        let source = "def f(a)\n  a\nend\n\ndef g(b)\n  b\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let statements: Vec<_> = obligations
            .manifest
            .points
            .iter()
            .filter(|point| point.kind == PointKind::Statement)
            .collect();
        let (before, after) = (&statements[0].id, &statements[1].id);
        let run_with = |name: &str, outcome: &str| {
            let records = [
                serde_json::json!({"t":"process","v":1,"run":"run-1","pid":7,"worker":"main","ruby":"4.0.6","executable":"ruby","argv":["test.rb"]}),
                serde_json::json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"MTest#test_x","retry":0,"phase":"call"}),
                serde_json::json!({"t":"hit","ctx":1,"id":before}),
                serde_json::json!({"t":"assert","ctx":1}),
                serde_json::json!({"t":"assert","ctx":1}),
                serde_json::json!({"t":"hit","ctx":1,"id":after}),
                serde_json::json!({"t":"outcome","worker":"main","test":"MTest#test_x","retry":0,"phase":"call","outcome":outcome,"xfail":false,"runner":"minitest"}),
                serde_json::json!({"t":"exit","at":9}),
            ];
            let directory = temporary(name);
            fs::write(directory.join("main.7.a.mmap"), transport(&records)).unwrap();
            let run = build_ruby_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &RubyAssertionInventory::empty(),
            )
            .unwrap();
            validate_frontend_report_request(&run.declaration, &run.request).unwrap();
            fs::remove_dir_all(directory).unwrap();
            run
        };
        let events_of = |result: &RawTestResult, phase: &str| -> BTreeSet<String> {
            result
                .runtime
                .iter()
                .flat_map(|snapshot| snapshot.events.iter())
                .filter(|event| event.phase_id.as_deref() == Some(phase))
                .map(|event| event.id.clone())
                .collect()
        };

        let run = run_with("asserted-passed", "passed");
        let passed = &run.request.raw_results[0];
        assert_eq!(passed.test, "MTest#test_x");
        let assertion = passed
            .phases
            .iter()
            .find(|phase| phase.kind == "assertion")
            .expect("the asserting test carries an assertion phase");
        assert_eq!(assertion.status.as_deref(), Some("passed"));
        assert_eq!(
            events_of(passed, &assertion.id),
            BTreeSet::from([before.clone()]),
            "only what ran before the marker is the assertion's evidence"
        );
        let test_phase = passed
            .phases
            .iter()
            .find(|phase| phase.kind == "test")
            .unwrap();
        assert_eq!(
            events_of(passed, &test_phase.id),
            BTreeSet::from([before.clone(), after.clone()]),
            "the test phase keeps everything it ran"
        );
        assert_eq!(
            run.declaration.runners[0].attribution.assertion,
            AttributionPrecision::Exact
        );

        let run = run_with("asserted-failed", "failed");
        let failed = &run.request.raw_results[0];
        let assertion = failed
            .phases
            .iter()
            .find(|phase| phase.kind == "assertion")
            .unwrap();
        assert_eq!(
            assertion.status.as_deref(),
            Some("failed"),
            "a failed test's assertion witnessed nothing"
        );
    }

    #[test]
    fn joins_rspec_and_minitest_outcomes_into_exact_results() {
        let source = "def f(a, b)\n  if a && b\n    1\n  else\n    0\n  end\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let decision = &obligations.manifest.decisions[0];
        let statement = obligations
            .manifest
            .points
            .iter()
            .find(|point| point.kind == PointKind::Statement)
            .unwrap();
        let directory = temporary("join");
        let records = [
            serde_json::json!({"t":"process","v":1,"run":"run-1","pid":7,"worker":"main","ruby":"4.0.6","executable":"ruby","argv":["rspec"]}),
            serde_json::json!({"t":"hit","ctx":0,"id":statement.id}),
            serde_json::json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"spec/m_spec.rb[1:1]","retry":0,"phase":"call"}),
            serde_json::json!({"t":"dec","ctx":1,"id":decision.id,"v":"22","o":1}),
            serde_json::json!({"t":"outcome","worker":"main","test":"spec/m_spec.rb[1:1]","retry":0,"phase":"setup","outcome":"passed","xfail":false,"runner":"rspec"}),
            serde_json::json!({"t":"outcome","worker":"main","test":"spec/m_spec.rb[1:1]","retry":0,"phase":"call","outcome":"passed","xfail":false,"runner":"rspec"}),
            serde_json::json!({"t":"outcome","worker":"main","test":"spec/m_spec.rb[1:1]","retry":0,"phase":"teardown","outcome":"passed","xfail":false,"runner":"rspec"}),
            serde_json::json!({"t":"phase","ctx":2,"at":6,"worker":"main","test":"MTest#test_x","retry":0,"phase":"call"}),
            serde_json::json!({"t":"outcome","worker":"main","test":"MTest#test_x","retry":0,"phase":"call","outcome":"skipped","xfail":false,"runner":"minitest"}),
            serde_json::json!({"t":"exit","at":9}),
        ];
        fs::write(directory.join("main.7.a.mmap"), transport(&records)).unwrap();
        let run = build_ruby_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            0,
            &RubyAssertionInventory::empty(),
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        assert_eq!(run.tests, 2);
        let runners = run
            .declaration
            .runners
            .iter()
            .map(|runner| runner.runner.clone())
            .collect::<Vec<_>>();
        assert_eq!(runners, ["minitest", "rspec"]);
        assert_eq!(run.ruby_versions, ["4.0.6"]);
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn fails_closed_without_an_interpreter() {
        let mut probe = 0;
        let obligations = build_ruby_obligations("m.rb", b"x = 1\n", &mut probe).unwrap();
        let directory = temporary("empty");
        assert!(matches!(
            build_ruby_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &RubyAssertionInventory::empty()
            ),
            Err(RubyEvidenceError::NoInterpreter)
        ));
        fs::remove_dir_all(directory).unwrap();
    }
}
