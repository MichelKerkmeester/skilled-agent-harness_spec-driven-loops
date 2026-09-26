//! Validation and normalization of the Python runtime's evidence records.
//!
//! Each Supercov-hooked interpreter publishes commit-framed JSON records into
//! its own mmap: the process identity, every phase it entered (with the exact
//! test identity that phase stands for), runner outcomes, hits, decision
//! vectors and any measurement limitation the runtime detected. The one-byte
//! commit marker is written last, so records completed before a hard kill
//! remain readable while a torn tail stays inert.
//!
//! Probes do not write records: they store bytes into their context's slot, a
//! small mapped file beside the transport, and the runtime harvests a slot into
//! records when a phase ends. A process that dies between harvests leaves its
//! slots behind; `layout.json`, written once per run, says which obligation or
//! decision vector each byte stands for, and the slot's bytes are read as the
//! last records of its process. Rust joins those records into the shared
//! frontend protocol; the runtime never computes a verdict.

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
        RawTestResult, RuntimeSnapshot, TestProvenance,
    },
    evidence_archive::EvidenceArchiveEntry,
};

pub const PYTHON_EVIDENCE_VERSION: u32 = 1;
pub const PYTHON_FRONTEND_VERSION: &str = "python-probes-v1";
pub const PYTEST_RUNNER: &str = "pytest";
pub const UNITTEST_RUNNER: &str = "unittest";

const TRANSPORT_MAGIC: &[u8; 8] = b"SCVPYTH1";
/// Version 2 checksums records with CRC-32; version 1 used FNV-1a, and the
/// runtime computed it a byte at a time in Python -- two microseconds of every
/// record's five. Evidence kept from a failed run by an older runtime still
/// reads, by its own checksum.
const TRANSPORT_VERSION: u32 = 2;
const TRANSPORT_VERSION_FNV: u32 = 1;
const TRANSPORT_HEADER_SIZE: usize = 64;
const TRANSPORT_RECORD_HEADER_SIZE: usize = 16;
const TRANSPORT_MAX_RECORD_SIZE: usize = 4 * 1024 * 1024;

fn default_runner() -> String {
    PYTEST_RUNNER.into()
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
        python: String,
        executable: String,
        argv: Vec<String>,
        /// Which observer measured the process. Probes are the only one
        /// now; the field stays so evidence kept by an earlier runtime reads.
        #[serde(default)]
        frontend: Option<String>,
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
        /// synthesised tests that cannot name a file.
        #[serde(default)]
        file: Option<String>,
    },
    Hit {
        ctx: u64,
        id: String,
    },
    /// Many hits of one context in one record: the probe frontend harvests
    /// a context's array at the phase switch and writes what it found at
    /// once, instead of a record per first hit.
    Hits {
        ctx: u64,
        ids: Vec<String>,
    },
    /// Hits read out of a slot, by position in the layout's ids. Made here,
    /// never written by the runtime.
    #[serde(skip)]
    SlotHits {
        ctx: u64,
        positions: Vec<u32>,
    },
    Dec {
        ctx: u64,
        id: String,
        v: String,
        o: u8,
    },
    /// Many decision vectors of one context: (id, digits, outcome).
    Decs {
        ctx: u64,
        v: Vec<(String, String, u8)>,
    },
    /// A harvest of one context's slot: its set bytes as runs, each a first
    /// byte and a length, read through the run's slot layout exactly as a
    /// slot a killed process left behind is read. The runtime names bytes,
    /// not ids, so a harvest costs it a few dozen runs rather than a string
    /// per hit.
    Runs {
        ctx: u64,
        r: Vec<usize>,
    },
    /// The first assertion of a call phase: what the context recorded before
    /// this record is the assertion's evidence too.
    Assert {
        ctx: u64,
    },
    /// One assertion site a call phase reached, once per site per test.
    /// `unittest` reports the caller's frame and pytest reports the line its
    /// rewriter recorded; both are resolved against the syntax inventory, and
    /// a frame naming no inventoried site witnesses nothing.
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
pub enum PythonEvidenceError {
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
    UnsupportedPython(String),
}

impl std::fmt::Display for PythonEvidenceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(reason) => write!(formatter, "could not read Python evidence: {reason}"),
            Self::UnsafeEntry(name) => write!(formatter, "unsafe Python evidence entry: {name}"),
            Self::InvalidRecord { file, line, reason } => {
                write!(formatter, "invalid Python evidence record {file}:{line}: {reason}")
            }
            Self::InvalidTransport { file, reason } => {
                write!(formatter, "invalid Python evidence transport {file}: {reason}")
            }
            Self::DroppedRecords { file, count } => write!(
                formatter,
                "Python evidence transport {file} exhausted its bounded capacity and dropped {count} record(s)"
            ),
            Self::RunMismatch { expected, actual } => write!(
                formatter,
                "Python evidence belongs to run {actual}, expected {expected}"
            ),
            Self::UnsupportedVersion(version) => {
                write!(formatter, "unsupported Python evidence version {version}")
            }
            Self::UnknownContext { file, line, context } => write!(
                formatter,
                "Python evidence {file}:{line} references undeclared context {context}"
            ),
            Self::UnknownObligation(id) => {
                write!(formatter, "Python runtime reported an unknown obligation: {id}")
            }
            Self::InvalidVector {
                id,
                expected,
                actual,
            } => write!(
                formatter,
                "Python decision {id} reported {actual} condition values, expected {expected}"
            ),
            Self::NoInterpreter => formatter.write_str(
                "no Supercov-hooked Python interpreter ran: the test command did not start CPython 3.9+ with Supercov's start-up hook (PYTHONPATH may be ignored by -I/-E/-S, or the runner is not Python)",
            ),
            Self::NoTests => formatter.write_str(
                "the Python run produced no test outcomes; Supercov measures Python through pytest and unittest",
            ),
            Self::UnsupportedPython(version) => write!(
                formatter,
                "Supercov measures CPython 3.9 or newer; the test command ran Python {version}"
            ),
        }
    }
}

impl std::error::Error for PythonEvidenceError {}

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
/// indexed so a runtime frame can name one exactly.
///
/// Python reports a file and a line for an assertion, while an assertion
/// anchor is a file, line and column. The inventory supplies the missing
/// column and validates the frame: one that names no inventoried site
/// witnesses nothing, so a wrong frame loses a witness rather than inventing
/// one.
pub struct PythonAssertionInventory {
    root: PathBuf,
    /// (project-relative file, line) -> the sites on that line
    columns: BTreeMap<(String, usize), Vec<usize>>,
}

impl PythonAssertionInventory {
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

    /// Python reports both forms: a frame's `co_filename` is whatever the
    /// interpreter loaded, absolute or relative. A path outside the project
    /// names nothing here.
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
    /// Two assertions on one line cannot be told apart from a line number, so
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
    /// Hits a harvest named by slot byte, as positions in the layout's ids,
    /// repeats included: turned into ids once, when the phase's snapshot is
    /// built. A subprocess-heavy run harvests millions, and an owned id per
    /// hit was most of reading its evidence.
    slot_hits: Vec<u32>,
    vectors: BTreeMap<String, ObservedVectors>,
}

impl Observations {
    fn is_empty(&self) -> bool {
        self.hits.is_empty() && self.slot_hits.is_empty() && self.vectors.is_empty()
    }
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
    python_versions: BTreeSet<String>,
    per_identity: BTreeMap<Identity, Observations>,
    background: BTreeMap<String, Observations>,
    outcomes: OutcomesByAttempt,
    runners: RunnersByAttempt,
    test_files: TestFilesByAttempt,
    sites: SitesByAttempt,
    limitations: BTreeMap<(String, Option<String>, Option<String>), RuntimeLimitation>,
    /// The layout's ids, which slot hits are positions in.
    slot_ids: Vec<String>,
}

fn read_evidence_directory(
    directory: &Path,
    run_id: &str,
) -> Result<Evidence, PythonEvidenceError> {
    let mut evidence = Evidence::default();
    let mut files = match fs::read_dir(directory) {
        Ok(entries) => entries
            .collect::<Result<Vec<_>, _>>()
            .map_err(|error| PythonEvidenceError::Io(error.to_string()))?,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Vec::new(),
        Err(error) => return Err(PythonEvidenceError::Io(error.to_string())),
    };
    files.sort_by_key(|entry| entry.file_name());
    let mut transports = Vec::new();
    let mut slots = BTreeMap::<String, Vec<(String, PathBuf)>>::new();
    let mut layout_path = None;
    for entry in files {
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| PythonEvidenceError::UnsafeEntry("<non-utf8>".into()))?;
        if Path::new(&name)
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
        {
            return Err(PythonEvidenceError::UnsafeEntry(name));
        }
        // A layout write cut short by the process dying; another process of
        // the run, or none, published the whole file.
        if name.starts_with(SLOT_LAYOUT_NAME) && name.ends_with(".partial") {
            continue;
        }
        let Some(metadata) = entry_metadata(&name, &entry.path())? else {
            continue;
        };
        if !metadata.file_type().is_file() {
            return Err(PythonEvidenceError::UnsafeEntry(name));
        }
        if name == SLOT_LAYOUT_NAME {
            layout_path = Some(entry.path());
        } else if name.ends_with(".mmap") {
            transports.push((name, entry.path()));
        } else if let Some((slot_name, transport)) = name.strip_suffix(".shm").and_then(|stem| {
            let (transport, number) = stem.rsplit_once('.')?;
            number
                .parse::<u64>()
                .ok()
                .map(|_| (format!("{stem}.slot"), format!("{transport}.mmap")))
        }) {
            if let Some(path) = materialize_shared_slot(&entry.path(), &slot_name)? {
                slots.entry(transport).or_default().push((slot_name, path));
            }
        } else if let Some(transport) = name
            .strip_suffix(".slot")
            .and_then(|stem| stem.rsplit_once('.'))
            .filter(|(_, number)| number.parse::<u64>().is_ok())
            .map(|(transport, _)| format!("{transport}.mmap"))
        {
            // Created and killed before it was sized: nothing was written.
            if metadata.len() > 0 {
                slots
                    .entry(transport)
                    .or_default()
                    .push((name, entry.path()));
            }
        } else {
            return Err(PythonEvidenceError::UnsafeEntry(name));
        }
    }
    let layout = match layout_path {
        Some(path) => Some(SlotLayout::read(&path)?),
        None => None,
    };
    // Each process's transport and slots are read and parsed on their own --
    // a subprocess-heavy suite leaves tens of thousands -- and applied to the
    // run's evidence in the order they are listed, as they were one by one.
    let work = transports
        .into_iter()
        .map(|(name, path)| {
            let owned = slots.remove(&name).unwrap_or_default();
            (name, path, owned)
        })
        .collect::<Vec<_>>();
    let parse = |(name, path, owned): &(String, PathBuf, Vec<(String, PathBuf)>)| {
        let contents = map_evidence(path)?;
        let slot_contents = owned
            .iter()
            .filter_map(|(slot, path)| match map_slot(path) {
                Ok(Some(contents)) => Some(Ok((slot.clone(), contents))),
                Ok(None) => None,
                Err(error) => Some(Err(error)),
            })
            .collect::<Result<Vec<_>, _>>()?;
        parse_transport(name, &contents, &slot_contents, layout.as_ref())
    };
    let parsed = parallel_map(&work, parse);
    for ((name, _, _), parsed) in work.iter().zip(parsed) {
        apply_transport(name, parsed?, run_id, &mut evidence)?;
    }
    evidence.slot_ids = layout.map(|layout| layout.ids).unwrap_or_default();
    if let Some((_, orphans)) = slots.into_iter().next() {
        return Err(PythonEvidenceError::InvalidTransport {
            file: orphans[0].0.clone(),
            reason: "a slot was left without its process's transport".into(),
        });
    }
    Ok(evidence)
}

/// An evidence entry's metadata, or None for a slot gone since the listing.
///
/// A process that outlived the test command -- multiprocessing's resource
/// tracker is one -- can close between the listing and this read. It harvested
/// its slot into its transport first, so a slot that is gone holds nothing to
/// miss. Anything else missing is still an error.
fn entry_metadata(name: &str, path: &Path) -> Result<Option<fs::Metadata>, PythonEvidenceError> {
    match fs::symlink_metadata(path) {
        Ok(metadata) => Ok(Some(metadata)),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound && name.ends_with(".slot") => {
            Ok(None)
        }
        Err(error) => Err(PythonEvidenceError::Io(error.to_string())),
    }
}

/// A slot a macOS process kept in POSIX shared memory, which `marker` names,
/// copied into an ordinary slot file beside it and then removed: evidence kept
/// after a failed publication must hold what it held, and nothing else frees
/// an object whose process was killed. None when there is nothing to read --
/// the process closed and removed it, died before creating it, or its bytes
/// were copied out by an earlier read, whose slot file the listing holds.
fn materialize_shared_slot(
    marker: &Path,
    slot_name: &str,
) -> Result<Option<PathBuf>, PythonEvidenceError> {
    let slot = marker.with_file_name(slot_name);
    if fs::symlink_metadata(&slot).is_ok() {
        return Ok(None);
    }
    let contents = match fs::read(marker) {
        Ok(contents) => contents,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(PythonEvidenceError::Io(error.to_string())),
    };
    // Killed between creating the marker and writing the name into it.
    if contents.is_empty() {
        return Ok(None);
    }
    // `<name> <slot bytes>`: macOS rounds the object itself up to a page.
    let unsafe_marker = || PythonEvidenceError::UnsafeEntry(marker.to_string_lossy().into_owned());
    let (name, size) = std::str::from_utf8(&contents)
        .ok()
        .and_then(|text| text.split_once(' '))
        .and_then(|(name, size)| Some((name.as_bytes(), size.parse::<usize>().ok()?)))
        .ok_or_else(unsafe_marker)?;
    if name.len() > 31
        || name.first() != Some(&b'/')
        || !name[1..]
            .iter()
            .all(|byte| byte.is_ascii_alphanumeric() || *byte == b'.')
    {
        return Err(unsafe_marker());
    }
    shared_slot_bytes(name)?
        // Created and killed before it was sized: nothing was written.
        .filter(|bytes| !bytes.is_empty())
        .map(|mut bytes| {
            if bytes.len() < size {
                return Err(PythonEvidenceError::InvalidTransport {
                    file: slot_name.into(),
                    reason: "a shared slot is smaller than its process sized it".into(),
                });
            }
            bytes.truncate(size);
            let partial = marker.with_file_name(format!("{slot_name}.partial"));
            fs::write(&partial, bytes)
                .and_then(|()| fs::rename(&partial, &slot))
                .map_err(|error| PythonEvidenceError::Io(error.to_string()))?;
            Ok(slot)
        })
        .transpose()
}

/// Only the macOS runtime keeps slots in shared memory.
#[cfg(target_os = "macos")]
fn shared_slot_bytes(name: &[u8]) -> Result<Option<Vec<u8>>, PythonEvidenceError> {
    use std::os::fd::FromRawFd;
    let name = std::ffi::CString::new(name)
        .map_err(|_| PythonEvidenceError::UnsafeEntry("<shared slot name>".into()))?;
    // SAFETY: a NUL-terminated name; the descriptor is owned by `file` below.
    let descriptor = unsafe { libc::shm_open(name.as_ptr(), libc::O_RDONLY) };
    if descriptor < 0 {
        let error = std::io::Error::last_os_error();
        return if error.kind() == std::io::ErrorKind::NotFound {
            Ok(None)
        } else {
            Err(PythonEvidenceError::Io(error.to_string()))
        };
    }
    // SAFETY: shm_open returned a fresh descriptor this function owns.
    let file = unsafe { File::from_raw_fd(descriptor) };
    let length = file
        .metadata()
        .map_err(|error| PythonEvidenceError::Io(error.to_string()))?
        .len();
    let bytes = if length == 0 {
        Vec::new()
    } else {
        // SAFETY: read-only; the process that wrote it has stopped measuring.
        unsafe { MmapOptions::new().map(&file) }
            .map_err(|error| PythonEvidenceError::Io(error.to_string()))?
            .to_vec()
    };
    // SAFETY: the same NUL-terminated name.
    unsafe { libc::shm_unlink(name.as_ptr()) };
    Ok(Some(bytes))
}

#[cfg(not(target_os = "macos"))]
fn shared_slot_bytes(_name: &[u8]) -> Result<Option<Vec<u8>>, PythonEvidenceError> {
    Ok(None)
}

/// A slot, or None when it is gone by the time it is opened: taken back by a
/// process that closed after the directory was listed, and so already
/// harvested into its transport.
fn map_slot(path: &Path) -> Result<Option<Mmap>, PythonEvidenceError> {
    match File::open(path) {
        Ok(file) => unsafe { MmapOptions::new().map(&file) }
            .map(Some)
            .map_err(|error| PythonEvidenceError::Io(error.to_string())),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(error) => Err(PythonEvidenceError::Io(error.to_string())),
    }
}

fn map_evidence(path: &Path) -> Result<Mmap, PythonEvidenceError> {
    let file = File::open(path).map_err(|error| PythonEvidenceError::Io(error.to_string()))?;
    // The file is immutable from Supercov's perspective after the wrapped
    // interpreter has exited. No mutable alias is created while this map is
    // alive.
    unsafe { MmapOptions::new().map(&file) }
        .map_err(|error| PythonEvidenceError::Io(error.to_string()))
}

const SLOT_LAYOUT_NAME: &str = "layout.json";
/// The widest decision the runtime gives a region, as `supercov_probes`
/// declares it; a wider one records its vectors directly.
const SLOT_MAX_REGION_WIDTH: usize = 6;

/// What each byte of a slot stands for: `SlotLayout::header` bytes naming the
/// context and the layout, one byte per obligation, then a region per decision.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct SlotLayout {
    #[allow(dead_code)]
    version: u32,
    digest: String,
    header: usize,
    bytes: usize,
    ids: Vec<String>,
    decisions: Vec<SlotDecision>,
    /// A byte that stands for others besides its own: the probe of a
    /// statement heading a function, loop body or one-condition branch is
    /// the only store its entry, `entered` or outcome gets.
    #[serde(default)]
    implied: Vec<(usize, Vec<usize>)>,
    #[serde(skip)]
    implied_by: std::collections::HashMap<usize, Vec<usize>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct SlotDecision {
    start: usize,
    width: usize,
    id: String,
    outcome_true: String,
    outcome_false: String,
    logical: Vec<SlotLogical>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct SlotLogical {
    evaluated: String,
    short_circuit: String,
    previous_leaves: Vec<usize>,
    operand_leaves: Vec<usize>,
}

impl SlotDecision {
    /// A single condition has a byte per truth; a wider decision a byte per
    /// evaluation mask and outcome, the mask one base-3 digit per condition.
    fn region_bytes(&self) -> usize {
        if self.width == 1 {
            2
        } else {
            2 * 3_usize.pow(self.width as u32)
        }
    }

    /// The vector a region byte stands for, as the evidence spells it.
    fn vector(&self, offset: usize) -> (String, bool) {
        if self.width == 1 {
            let outcome = offset == 1;
            return ((if outcome { "2" } else { "1" }).into(), outcome);
        }
        let mut mask = offset >> 1;
        let digits = (0..self.width)
            .map(|_| {
                let digit = b"012"[mask % 3] as char;
                mask /= 3;
                digit
            })
            .collect();
        (digits, offset & 1 == 1)
    }

    /// What the runtime's harvest adds for a vector: the outcome hit, and
    /// each logical operator's alternative the vector decided.
    fn implied(&self, digits: &str, outcome: bool, into: &mut Vec<String>) {
        into.push(
            if outcome {
                &self.outcome_true
            } else {
                &self.outcome_false
            }
            .clone(),
        );
        let evaluated = |leaves: &[usize]| {
            leaves.iter().any(|index| {
                digits
                    .as_bytes()
                    .get(*index)
                    .is_some_and(|digit| *digit != b'0')
            })
        };
        for logical in &self.logical {
            if evaluated(&logical.operand_leaves) {
                into.push(logical.evaluated.clone());
            } else if evaluated(&logical.previous_leaves) {
                into.push(logical.short_circuit.clone());
            }
        }
    }
}

impl SlotLayout {
    fn read(path: &Path) -> Result<Self, PythonEvidenceError> {
        let invalid = |reason: String| PythonEvidenceError::InvalidTransport {
            file: SLOT_LAYOUT_NAME.into(),
            reason,
        };
        let bytes = fs::read(path).map_err(|error| PythonEvidenceError::Io(error.to_string()))?;
        let mut layout: Self =
            serde_json::from_slice(&bytes).map_err(|error| invalid(error.to_string()))?;
        if layout.digest.len() < 16 || !layout.digest.bytes().all(|byte| byte.is_ascii_hexdigit()) {
            return Err(invalid("the layout digest is not hex".into()));
        }
        // Regions follow the obligations back to back, in slot order, and end
        // where the slot does: a byte stands for exactly one thing.
        let mut cursor = layout.header + layout.ids.len();
        for decision in &layout.decisions {
            if decision.start != cursor
                || decision.width == 0
                || decision.width > SLOT_MAX_REGION_WIDTH
            {
                return Err(invalid(format!(
                    "decision {} has no valid region",
                    decision.id
                )));
            }
            if decision
                .logical
                .iter()
                .flat_map(|logical| {
                    logical
                        .previous_leaves
                        .iter()
                        .chain(&logical.operand_leaves)
                })
                .any(|leaf| *leaf >= decision.width)
            {
                return Err(invalid(format!(
                    "decision {} names a condition it lacks",
                    decision.id
                )));
            }
            cursor += decision.region_bytes();
        }
        if cursor != layout.bytes || layout.header < 16 {
            return Err(invalid("the regions do not fill the slot".into()));
        }
        // A head is a statement's byte; what it implies is an obligation's
        // byte or a region's, never another head.
        let id_end = layout.header + layout.ids.len();
        for (head, implied) in &layout.implied {
            if *head < layout.header
                || *head >= id_end
                || implied
                    .iter()
                    .any(|byte| *byte < layout.header || *byte >= layout.bytes || *byte == *head)
            {
                return Err(invalid(format!(
                    "byte {head} implies bytes outside the slot"
                )));
            }
        }
        layout.implied_by = layout.implied.iter().cloned().collect();
        if layout
            .implied_by
            .values()
            .flatten()
            .any(|byte| layout.implied_by.contains_key(byte))
        {
            return Err(invalid("an implied byte implies others".into()));
        }
        Ok(layout)
    }

    fn tag(&self) -> Vec<u8> {
        (0..8)
            .map(|index| {
                u8::from_str_radix(&self.digest[index * 2..index * 2 + 2], 16).unwrap_or(0)
            })
            .collect()
    }

    /// A slot's bytes as the records a harvest would have written from them.
    fn records(&self, name: &str, contents: &[u8]) -> Result<Vec<Record>, PythonEvidenceError> {
        let invalid = |reason: &str| PythonEvidenceError::InvalidTransport {
            file: name.into(),
            reason: reason.into(),
        };
        let tag = contents
            .get(8..16)
            .ok_or_else(|| invalid("slot header is missing"))?;
        // Its process closed it after a final harvest: whatever a thread wrote
        // after that belongs to no test.
        if tag.iter().all(|byte| *byte == 0) {
            return Ok(Vec::new());
        }
        if tag != self.tag().as_slice() {
            return Err(invalid("slot was written for another layout"));
        }
        if contents.len() != self.bytes {
            return Err(invalid("slot size does not match the layout"));
        }
        let context =
            transport_u64(contents, 0).ok_or_else(|| invalid("slot context is missing"))?;
        let mut decoded = Decoded::default();
        for (index, byte) in contents.iter().enumerate().skip(self.header) {
            match byte {
                0 => continue,
                1 => self.decode(index, &mut decoded),
                _ => return Err(invalid("slot byte is neither 0 nor 1")),
            }
        }
        Ok(decoded.into_records(context))
    }

    /// A harvest's runs as the records a slot holding those bytes reads as.
    fn runs(&self, context: u64, runs: &[usize]) -> Result<Vec<Record>, &'static str> {
        if !runs.len().is_multiple_of(2) {
            return Err("slot runs must pair a first byte with a length");
        }
        let mut decoded = Decoded::default();
        for run in runs.chunks_exact(2) {
            let (start, length) = (run[0], run[1]);
            let end = start
                .checked_add(length)
                .filter(|end| length > 0 && start >= self.header && *end <= self.bytes)
                .ok_or("a slot run lies outside the layout")?;
            for index in start..end {
                self.decode(index, &mut decoded);
            }
        }
        Ok(decoded.into_records(context))
    }

    /// What one set byte stands for, with what the layout says it implies.
    fn decode(&self, index: usize, into: &mut Decoded) {
        self.decode_one(index, into);
        if let Some(implied) = self.implied_by.get(&index) {
            for byte in implied {
                self.decode_one(*byte, into);
            }
        }
    }

    /// What one byte stands for: an obligation, or a decision vector and
    /// what the vector implies.
    fn decode_one(&self, index: usize, into: &mut Decoded) {
        let id_end = self.header + self.ids.len();
        if index < id_end {
            into.positions.push((index - self.header) as u32);
            return;
        }
        let decision = &self.decisions[self
            .decisions
            .partition_point(|decision| decision.start <= index)
            - 1];
        let (digits, outcome) = decision.vector(index - decision.start);
        decision.implied(&digits, outcome, &mut into.ids);
        into.vectors
            .push((decision.id.clone(), digits, u8::from(outcome)));
    }
}

#[derive(Default)]
struct Decoded {
    ids: Vec<String>,
    positions: Vec<u32>,
    vectors: Vec<(String, String, u8)>,
}

impl Decoded {
    fn into_records(self, context: u64) -> Vec<Record> {
        let mut records = Vec::new();
        if !self.positions.is_empty() {
            records.push(Record::SlotHits {
                ctx: context,
                positions: self.positions,
            });
        }
        if !self.ids.is_empty() {
            records.push(Record::Hits {
                ctx: context,
                ids: self.ids,
            });
        }
        if !self.vectors.is_empty() {
            records.push(Record::Decs {
                ctx: context,
                v: self.vectors,
            });
        }
        records
    }
}

/// `items.iter().map(work)`, spread over the machine's cores, in order.
fn parallel_map<T: Sync, R: Send>(items: &[T], work: impl Fn(&T) -> R + Sync) -> Vec<R> {
    let threads = std::thread::available_parallelism()
        .map_or(1, std::num::NonZeroUsize::get)
        .min(items.len().div_ceil(64).max(1));
    if threads <= 1 {
        return items.iter().map(work).collect();
    }
    let next = std::sync::atomic::AtomicUsize::new(0);
    let mut done = std::thread::scope(|scope| {
        let workers = (0..threads)
            .map(|_| {
                scope.spawn(|| {
                    let mut done = Vec::new();
                    loop {
                        let index = next.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
                        let Some(item) = items.get(index) else {
                            break done;
                        };
                        done.push((index, work(item)));
                    }
                })
            })
            .collect::<Vec<_>>();
        workers
            .into_iter()
            .flat_map(|worker| {
                worker
                    .join()
                    .unwrap_or_else(|panic| std::panic::resume_unwind(panic))
            })
            .collect::<Vec<_>>()
    });
    done.sort_unstable_by_key(|(index, _)| *index);
    done.into_iter().map(|(_, result)| result).collect()
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

fn transport_checksum(payload: &[u8], version: u32) -> u32 {
    if version == TRANSPORT_VERSION_FNV {
        return payload.iter().fold(0x811c_9dc5_u32, |value, byte| {
            (value ^ u32::from(*byte)).wrapping_mul(0x0100_0193)
        });
    }
    crc32fast::hash(payload)
}

fn align_transport(value: usize) -> Option<usize> {
    value.checked_add(7).map(|value| value & !7)
}

/// A transport's records, in order, with its slots' leftovers after them:
/// what reading one process's evidence needs nothing else of the run for,
/// so many are parsed at once.
struct ParsedTransport {
    pid: u64,
    records: Vec<(usize, Record)>,
}

fn parse_transport(
    name: &str,
    contents: &[u8],
    slots: &[(String, Mmap)],
    layout: Option<&SlotLayout>,
) -> Result<ParsedTransport, PythonEvidenceError> {
    let invalid_transport = |reason: &str| PythonEvidenceError::InvalidTransport {
        file: name.into(),
        reason: reason.into(),
    };
    let version = transport_u32(contents, 8);
    if contents.len() < TRANSPORT_HEADER_SIZE
        || contents.get(..8) != Some(TRANSPORT_MAGIC.as_slice())
        || !matches!(version, Some(TRANSPORT_VERSION | TRANSPORT_VERSION_FNV))
        || transport_u32(contents, 12) != Some(TRANSPORT_HEADER_SIZE as u32)
    {
        return Err(invalid_transport("header or version does not match"));
    }
    let version = version.unwrap_or(TRANSPORT_VERSION);
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
        return Err(PythonEvidenceError::DroppedRecords {
            file: name.into(),
            count: dropped,
        });
    }
    let transport_pid = transport_u64(contents, 32)
        .filter(|pid| *pid != 0)
        .ok_or_else(|| invalid_transport("process id is missing"))?;
    let mut records = Vec::new();
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
        let invalid = |reason: &str| PythonEvidenceError::InvalidRecord {
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
        if transport_checksum(payload, version) != expected_checksum {
            return Err(invalid("payload checksum does not match"));
        }
        let record: Record = serde_json::from_slice(payload).map_err(|error| {
            PythonEvidenceError::InvalidRecord {
                file: name.into(),
                line: line_number,
                reason: error.to_string(),
            }
        })?;
        if let Record::Runs { ctx, r } = record {
            let layout =
                layout.ok_or_else(|| invalid("slot runs arrived without the run's slot layout"))?;
            for record in layout.runs(ctx, &r).map_err(invalid)? {
                records.push((line_number, record));
            }
        } else {
            records.push((line_number, record));
        }
        cursor = next_cursor;
    }
    // What the process's slots still held when it ended: after every record
    // of its transport, as the harvest it never reached would have been.
    for (slot, slot_contents) in slots {
        let layout = layout.ok_or_else(|| PythonEvidenceError::InvalidTransport {
            file: slot.clone(),
            reason: "a slot was left without the run's slot layout".into(),
        })?;
        for record in layout.records(slot, slot_contents)? {
            record_index += 1;
            records.push((record_index, record));
        }
    }
    Ok(ParsedTransport {
        pid: transport_pid,
        records,
    })
}

/// A parsed transport's records applied to the run's evidence, in order.
fn apply_transport(
    name: &str,
    parsed: ParsedTransport,
    run_id: &str,
    evidence: &mut Evidence,
) -> Result<(), PythonEvidenceError> {
    let transport_pid = parsed.pid;
    let mut contexts = BTreeMap::<u64, Identity>::new();
    // What each call phase recorded so far, kept until its first assertion
    // marker moves it to the phase's assertion identity.
    let mut before_assertion = BTreeMap::<u64, Observations>::new();
    let mut process_worker: Option<String> = None;
    let mut apply = |line_number: usize, record: Record| -> Result<(), PythonEvidenceError> {
        let invalid = |reason: &str| PythonEvidenceError::InvalidRecord {
            file: name.into(),
            line: line_number,
            reason: reason.into(),
        };
        match record {
            Record::Process {
                v,
                run,
                pid,
                worker,
                python,
                ..
            } => {
                if v != PYTHON_EVIDENCE_VERSION {
                    return Err(PythonEvidenceError::UnsupportedVersion(v));
                }
                if run != run_id {
                    return Err(PythonEvidenceError::RunMismatch {
                        expected: run_id.into(),
                        actual: run,
                    });
                }
                if pid != transport_pid {
                    return Err(invalid("process record does not match the transport owner"));
                }
                let supported = python
                    .split('.')
                    .take(2)
                    .map(|part| part.parse::<u32>().ok())
                    .collect::<Option<Vec<_>>>()
                    // The runtime measures 3.9 and newer and refuses to
                    // install on anything older.
                    .is_some_and(|parts| parts.len() == 2 && (parts[0], parts[1]) >= (3, 9));
                if !supported {
                    return Err(PythonEvidenceError::UnsupportedPython(python));
                }
                evidence.interpreters += 1;
                evidence.python_versions.insert(python);
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
                    return Err(invalid("unknown pytest phase"));
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
                if !matches!(runner.as_str(), PYTEST_RUNNER | UNITTEST_RUNNER) {
                    return Err(invalid("unknown Python test runner"));
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
            // An empty record names no phase evidence: it must not make one.
            Record::Hits { ids, .. } if ids.is_empty() => {}
            Record::SlotHits { positions, .. } if positions.is_empty() => {}
            Record::SlotHits { ctx, positions } => {
                if let Some(before) = before_assertion.get_mut(&ctx) {
                    before.slot_hits.extend(&positions);
                }
                observations(
                    evidence,
                    &contexts,
                    process_worker.as_deref(),
                    ctx,
                    name,
                    line_number,
                )?
                .slot_hits
                .extend(positions);
            }
            Record::Decs { v, .. } if v.is_empty() => {}
            Record::Hits { ctx, ids } => {
                if let Some(before) = before_assertion.get_mut(&ctx) {
                    before.hits.extend(ids.iter().cloned());
                }
                // One lookup of the phase for the record, not one per hit.
                observations(
                    evidence,
                    &contexts,
                    process_worker.as_deref(),
                    ctx,
                    name,
                    line_number,
                )?
                .hits
                .extend(ids);
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
            Record::Decs { ctx, v: vectors } => {
                let mut before = before_assertion.get_mut(&ctx);
                let observed = observations(
                    evidence,
                    &contexts,
                    process_worker.as_deref(),
                    ctx,
                    name,
                    line_number,
                )?;
                for (id, v, o) in vectors {
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
                    if let Some(before) = before.as_mut() {
                        before
                            .vectors
                            .entry(id.clone())
                            .or_default()
                            .insert((values.clone(), o == 1));
                    }
                    observed
                        .vectors
                        .entry(id)
                        .or_default()
                        .insert((values, o == 1));
                }
            }
            Record::Assert { ctx } => {
                // Only the first marker of a call phase moves anything; a
                // later one, or one outside a call phase, is inert.
                if let Some(before) = before_assertion.remove(&ctx) {
                    let identity =
                        contexts
                            .get(&ctx)
                            .ok_or(PythonEvidenceError::UnknownContext {
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
                    asserted.slot_hits.extend(before.slot_hits);
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
                    .ok_or(PythonEvidenceError::UnknownContext {
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
            } => {
                // Thousands of interpreters may report the same limitation.
                // Deduplicate before expanding file-wide obligations, while
                // retaining each affected file and obligation independently.
                evidence
                    .limitations
                    .entry((id.clone(), file.clone(), obligation.clone()))
                    .or_insert(RuntimeLimitation {
                        id,
                        reason,
                        file,
                        obligation,
                    });
            }
            // Expanded through the layout before it is applied.
            Record::Runs { .. } => return Err(invalid("slot runs were not expanded")),
            Record::Exit { .. } => {}
        }
        Ok(())
    };
    for (line_number, record) in parsed.records {
        apply(line_number, record)?;
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
) -> Result<&'a mut Observations, PythonEvidenceError> {
    if context == 0 {
        return Ok(evidence
            .background
            .entry(process_worker.unwrap_or("main").to_owned())
            .or_default());
    }
    let identity = contexts
        .get(&context)
        .ok_or(PythonEvidenceError::UnknownContext {
            file: file.into(),
            line,
            context,
        })?;
    Ok(evidence.per_identity.entry(identity.clone()).or_default())
}

/// Python is observed through probes compiled into each measured module as it
/// is imported, from the obligations the plan derived from the source.
pub fn python_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "python".into(),
        variant: "python-owned-probes".into(),
        name: PYTHON_FRONTEND_VERSION.into(),
        completeness_meaning: "Every statement, function, decision vector, loop, short-circuit, match and exception-flow obligation Supercov derived from the source was observed through probes compiled into the code at import, with exact test identity; the declared runtime limitations remain separate.".into(),
        measured: vec![
            "executable statements, each by a probe placed before it".into(),
            "function and lambda entry".into(),
            "boolean decision vectors with masking MC/DC, each condition's value taken as the program evaluated it".into(),
            "for-loop and comprehension zero-versus-entered iteration".into(),
            "logical and/or short-circuit alternatives".into(),
            "match case selection and guards".into(),
            "try completion, handler selection and exception propagation".into(),
            "pytest and unittest worker, test, retry and setup/call/teardown phase identity".into(),
            "evidence a test recorded before its first assertion, linked to that assertion when the test passes".into(),
        ],
        not_measured: vec![
            "causal linkage to individual actions, or to any assertion after a test's first".into(),
            "code compiled from strings at runtime".into(),
            "measured modules imported before Supercov installed, or compiled past the import system; the run names each as a limitation".into(),
            "causal test context for raw _thread or native-extension-created threads".into(),
            "child coverage outside subprocess.Popen and multiprocessing adapters".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

fn phase_id(run: &str, identity: &Identity) -> String {
    stable_id(
        "python-phase",
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
        test_key: stable_id("python-test", &[worker, test]),
        retry,
        attempt_id: stable_id("python-attempt", &[run, worker, test, &retry.to_string()]),
    }
}

struct ManifestIndex<'a> {
    points: crate::interned::FastSet<&'a str>,
    alternatives: crate::interned::FastSet<&'a str>,
    decisions: crate::interned::FastMap<&'a str, &'a DecisionMeta>,
    lines: BTreeMap<&'a str, (&'a str, usize)>,
    files: BTreeMap<&'a str, Vec<&'a str>>,
}

impl<'a> ManifestIndex<'a> {
    fn new(manifest: &'a CoverageManifest) -> Self {
        let mut lines = BTreeMap::new();
        for point in &manifest.points {
            lines.insert(point.id.as_str(), (point.file.as_str(), point.line));
        }
        for decision in &manifest.decisions {
            lines.insert(
                decision.id.as_str(),
                (decision.file.as_str(), decision.line),
            );
        }
        for branch in &manifest.branches {
            lines.insert(branch.id.as_str(), (branch.file.as_str(), branch.line));
        }
        let mut files = BTreeMap::<&str, Vec<&str>>::new();
        for (id, (file, _)) in &lines {
            files.entry(*file).or_default().push(*id);
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
            files,
        }
    }
}

fn snapshot(
    index: &ManifestIndex<'_>,
    observations: &Observations,
    slot_ids: &[String],
    phase: &str,
) -> Result<RuntimeSnapshot, PythonEvidenceError> {
    let mut positions = observations.slot_hits.clone();
    positions.sort_unstable();
    positions.dedup();
    let mut hits = BTreeSet::new();
    for id in observations.hits.iter().map(String::as_str).chain(
        positions
            .iter()
            .map(|position| slot_ids[*position as usize].as_str()),
    ) {
        if !index.points.contains(id) && !index.alternatives.contains(id) {
            return Err(PythonEvidenceError::UnknownObligation(id.to_owned()));
        }
        hits.insert(id);
    }
    let hits = hits.into_iter().map(str::to_owned).collect::<BTreeSet<_>>();
    let mut decisions = Vec::new();
    for (id, vectors) in &observations.vectors {
        let Some(meta) = index.decisions.get(id.as_str()) else {
            return Err(PythonEvidenceError::UnknownObligation(id.clone()));
        };
        let mut observed = Vec::new();
        for (values, outcome) in vectors {
            if values.len() != meta.conditions.len() {
                return Err(PythonEvidenceError::InvalidVector {
                    id: id.clone(),
                    expected: meta.conditions.len(),
                    actual: values.len(),
                });
            }
            observed.push(McdcVector {
                values: values.clone(),
                outcome: *outcome,
            });
        }
        decisions.push(DecisionSnapshot {
            meta: (*meta).clone(),
            vectors: observed,
        });
    }
    // One snapshot per phase: everything in it is that phase's, which the
    // snapshot says once rather than with an event per hit and vector.
    Ok(RuntimeSnapshot {
        decisions,
        hits: hits.into_iter().collect(),
        events: Vec::new(),
        logicals: Vec::new(),
        phase_id: Some(phase.into()),
    })
}

/// One phase, however many times its runner reported it. pytest-subtests
/// reports every subtest under the same node id and `call` phase, so an
/// attempt carries several outcomes for the identity a phase id is derived
/// from; each became a phase of its own with the same id, and the run was
/// refused whole. The outcomes fold the way an attempt's do -- a failure
/// anywhere is the phase's, then a skip -- because that is what the phase
/// ended up doing, and the coverage recorded under that identity is one
/// phase's however the runner chose to narrate it.
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
pub struct PythonFrontendRun {
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
    pub tests: usize,
    pub interpreters: usize,
    pub python_versions: Vec<String>,
}

impl PythonFrontendRun {
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let model = PersistedCoverageModel::from_declaration(
            self.request
                .coverage_model
                .as_ref()
                .expect("Python frontend always declares a coverage model"),
        )
        .expect("Python coverage model is contract-valid");
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
pub fn build_python_frontend_run(
    manifest: &CoverageManifest,
    evidence_directory: &Path,
    run_id: &str,
    generated_at: &str,
    test_exit_code: i32,
    assertions: &PythonAssertionInventory,
) -> Result<PythonFrontendRun, PythonEvidenceError> {
    let evidence = read_evidence_directory(evidence_directory, run_id)?;
    if evidence.interpreters == 0 {
        return Err(PythonEvidenceError::NoInterpreter);
    }
    if evidence.outcomes.is_empty() {
        return Err(PythonEvidenceError::NoTests);
    }
    let Evidence {
        interpreters,
        python_versions,
        per_identity,
        background,
        outcomes,
        runners,
        test_files,
        sites,
        limitations,
        slot_ids,
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
    // Each phase's snapshot stands alone: built side by side, taken in the
    // order below, and any error raised where the phase is reached.
    let phases_observed = per_identity.iter().collect::<Vec<_>>();
    let mut snapshots = phases_observed
        .iter()
        .map(|(identity, _)| *identity)
        .zip(parallel_map(
            &phases_observed,
            |(identity, observations)| {
                snapshot(&index, observations, &slot_ids, &phase_id(run_id, identity))
            },
        ))
        .collect::<BTreeMap<_, _>>();
    let mut take = |identity: &Identity| {
        snapshots
            .remove(identity)
            .expect("each phase's snapshot is taken once")
    };
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
            if let Some((observed, _)) = attempt_identities
                .iter()
                .find(|(candidate, _)| candidate.phase == phase_name.as_str())
            {
                runtime.push(take(observed)?);
            }
            if phase_name != "call" {
                continue;
            }
            // What the test recorded before its first assertion is that
            // assertion's evidence, linked when the phase passed outright:
            // a failed, skipped or expected-to-fail phase witnessed nothing.
            if let Some((identity, _)) = attempt_identities
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
                runtime.push(take(identity)?);
                // One phase per assertion site the call phase reached, so an
                // assertion map can tell the sites apart. The per-test phase
                // above keeps carrying the pre-assertion evidence; these are
                // witnesses only, and a site the inventory does not know is
                // skipped rather than guessed at.
                let attempt = (worker.clone(), test.clone(), retry);
                // Keyed on the located site, not on the spelling reported:
                // two spellings of one file name one site, and a phase id
                // minted twice refuses the run, as it did in #40.
                let mut located = BTreeSet::new();
                for (path, line) in sites.get(&attempt).into_iter().flatten() {
                    let Some(location) = assertions.locate(path, *line) else {
                        continue;
                    };
                    if !located.insert(location.clone()) {
                        continue;
                    }
                    phases.push(CoveragePhase {
                        id: stable_id("python-assertion", &[run_id, &id, &location]),
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
        // A phase the runtime entered but pytest never reported (the worker
        // died inside it) is a failed phase with its evidence kept.
        for (identity, _) in attempt_identities {
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
                runtime.push(take(identity)?);
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
            // What the runner named, as the project names it. A dotted
            // module path or a pytest node id is not a path, so the old
            // derivation stays only as a fallback.
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
                source: PYTHON_FRONTEND_VERSION.into(),
            },
            role: "test".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
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
        for (position, (identity, _)) in identities.iter().enumerate() {
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
            runtime.push(take(identity)?);
        }
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, &worker, &test, retry)),
            test: test.clone(),
            // What the runner named, as the project names it. A dotted
            // module path or a pytest node id is not a path, so the old
            // derivation stays only as a fallback.
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
                source: PYTHON_FRONTEND_VERSION.into(),
            },
            role: "test".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases,
            runtime,
            browser: Vec::new(),
            server: Vec::new(),
        });
    }
    for (worker, observations) in &background {
        if observations.is_empty() {
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
            test: "Python import, collection and background execution".into(),
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
                source: PYTHON_FRONTEND_VERSION.into(),
            },
            role: "background".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: vec![CoveragePhase {
                id: phase.clone(),
                kind: "background".into(),
                operation: "Python import and collection background".into(),
                source: None,
                caused_by_phase_id: None,
                started_at_ms: 0,
                ended_at_ms: Some(0),
                status: Some("passed".into()),
                error: None,
            }],
            runtime: vec![snapshot(&index, observations, &slot_ids, &phase)?],
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
    // What any process was seen to run, to tell a file some process ran
    // unobserved from a file nothing observed at all.
    let observed = raw_results
        .iter()
        .flat_map(|raw| raw.runtime.iter())
        .flat_map(|snapshot| snapshot.hits.iter().cloned())
        .collect::<std::collections::HashSet<String>>();
    for limitation in limitations.values() {
        if let Some(obligation) = &limitation.obligation {
            if !index.lines.contains_key(obligation.as_str()) {
                return Err(PythonEvidenceError::UnknownObligation(obligation.clone()));
            }
            unmeasured.insert(obligation.clone());
        } else if let Some(file) = &limitation.file {
            // A code-object mapping failure or missing debug ranges prevents
            // every obligation in that source file from being observed. Mark
            // the whole file unmeasured instead of presenting its denominator
            // as ordinary uncovered code.
            //
            // An unobserved module is narrower: one process ran the file
            // without probes -- most often `python path/script.py`, which
            // CPython compiles outside the import system -- while every
            // process that imported it was measured. A project whose tests
            // both import its scripts and run them lost 43 files and six
            // points of line coverage when the direct run discarded the
            // imports' evidence. Such a file stays measured, a lower bound
            // the limitation still flags, unless nothing it ran was observed.
            let observed_elsewhere = limitation.id == "python-probes-unobserved-module"
                && index
                    .files
                    .get(file.as_str())
                    .is_some_and(|obligations| obligations.iter().any(|id| observed.contains(*id)));
            if !observed_elsewhere && let Some(obligations) = index.files.get(file.as_str()) {
                unmeasured.extend(obligations.iter().map(|id| (*id).to_owned()));
            }
        }
        let id = if limitation.file.is_some() || limitation.obligation.is_some() {
            stable_id(
                &limitation.id,
                &[
                    limitation.file.as_deref().unwrap_or_default(),
                    limitation.obligation.as_deref().unwrap_or_default(),
                ],
            )
        } else {
            limitation.id.clone()
        };
        if limitation_ids.insert(id.clone()) {
            let (file, line) = limitation
                .obligation
                .as_deref()
                .and_then(|id| {
                    index
                        .lines
                        .get(id)
                        .map(|(file, line)| ((*file).to_owned(), *line))
                })
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
            new_limitations.push(json!({
                "id": id,
                "code": limitation.id,
                "kind": "semantic-safety",
                "file": file,
                "line": line,
                "column": 0,
                "source": "",
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
    Ok(PythonFrontendRun {
        declaration: FrontendRunDeclaration {
            protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
            frontend_id: "python".into(),
            frontend_version: PYTHON_FRONTEND_VERSION.into(),
            language: "python".into(),
            structural_source: StructuralSource::OwnedProbes,
            runners: observed_runners
                .iter()
                .map(|runner| FrontendRunnerDeclaration {
                    runner: runner.clone(),
                    execution_model: if runner == UNITTEST_RUNNER {
                        ExecutionModel::SerialInProcess
                    } else {
                        ExecutionModel::ParallelContextPropagated
                    },
                    attribution: FrontendAttribution {
                        run: AttributionPrecision::Exact,
                        worker: AttributionPrecision::Exact,
                        test: AttributionPrecision::Exact,
                        retry: AttributionPrecision::Exact,
                        phase: AttributionPrecision::Exact,
                        action: AttributionPrecision::Unavailable,
                        assertion: AttributionPrecision::Exact,
                    },
                    limitations: vec![FrontendLimitation {
                        id: format!("python-{runner}-action-linkage"),
                        scopes: vec![FrontendLimitationScope::Action],
                        reason: format!("{runner} exposes no general action lifecycle"),
                    }],
                })
                .collect(),
            structural_limitations,
        },
        request: CoverageReportRequest {
            run_id: run_id.into(),
            manifest,
            raw_results,
            generated_at: generated_at.into(),
            coverage_model: Some(python_coverage_model()),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(test_exit_code)),
        },
        tests,
        interpreters,
        python_versions: python_versions.into_iter().collect(),
    })
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;
    use crate::{
        frontend_protocol::validate_frontend_report_request,
        python_instrumenter::build_python_obligations,
    };

    fn temporary(name: &str) -> std::path::PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-python-evidence-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir_all(&path).unwrap();
        path
    }

    fn write_transport(path: &Path, records: &[serde_json::Value], dropped: u64) {
        write_transport_version(path, records, dropped, TRANSPORT_VERSION, None);
    }

    /// A transport of any version, checksummed as that version does -- or,
    /// with `corrupt`, with one payload's checksum deliberately wrong.
    fn write_transport_version(
        path: &Path,
        records: &[serde_json::Value],
        dropped: u64,
        version: u32,
        corrupt: Option<usize>,
    ) {
        let payloads = records
            .iter()
            .map(|record| serde_json::to_vec(record).unwrap())
            .collect::<Vec<_>>();
        let capacity = payloads
            .iter()
            .fold(TRANSPORT_HEADER_SIZE, |cursor, payload| {
                align_transport(cursor + TRANSPORT_RECORD_HEADER_SIZE + payload.len()).unwrap()
            })
            + 64;
        let mut bytes = vec![0_u8; capacity];
        bytes[..8].copy_from_slice(TRANSPORT_MAGIC);
        bytes[8..12].copy_from_slice(&version.to_le_bytes());
        bytes[12..16].copy_from_slice(&(TRANSPORT_HEADER_SIZE as u32).to_le_bytes());
        bytes[16..24].copy_from_slice(&(capacity as u64).to_le_bytes());
        bytes[24..32].copy_from_slice(&dropped.to_le_bytes());
        bytes[32..40].copy_from_slice(&1_u64.to_le_bytes());
        let mut cursor = TRANSPORT_HEADER_SIZE;
        for (index, payload) in payloads.into_iter().enumerate() {
            let payload_start = cursor + TRANSPORT_RECORD_HEADER_SIZE;
            let payload_end = payload_start + payload.len();
            bytes[payload_start..payload_end].copy_from_slice(&payload);
            bytes[cursor + 4..cursor + 8].copy_from_slice(&(payload.len() as u32).to_le_bytes());
            // Computed here, not through the reader's own function: a test of
            // which checksum a version means must not share the code under
            // test with the transport it writes.
            let expected = if version == TRANSPORT_VERSION_FNV {
                payload.iter().fold(0x811c_9dc5_u32, |value, byte| {
                    (value ^ u32::from(*byte)).wrapping_mul(0x0100_0193)
                })
            } else {
                crc32fast::hash(&payload)
            };
            let checksum = expected ^ u32::from(corrupt == Some(index));
            bytes[cursor + 8..cursor + 12].copy_from_slice(&checksum.to_le_bytes());
            bytes[cursor] = 1;
            cursor = align_transport(payload_end).unwrap();
        }
        fs::write(path, bytes).unwrap();
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

    fn inventory_of(root: &str, sites: &[(&str, usize, usize)]) -> PythonAssertionInventory {
        use crate::assertion_map::{Anchor, Files, Inputs, InventorySite};
        PythonAssertionInventory::new(
            Path::new(root),
            &Inputs {
                schema_version: 1,
                language: "python".into(),
                context_digest: "context".into(),
                files: Files::new(),
                assertions: sites
                    .iter()
                    .map(|(file, line, column)| InventorySite {
                        at: Anchor {
                            file: (*file).into(),
                            line: *line,
                            column: *column,
                            text: "assert f(1) == 1".into(),
                        },
                        operation: "assert".into(),
                    })
                    .collect(),
                limitations: vec![],
            },
        )
    }

    fn assertion_sources(run: &PythonFrontendRun) -> Vec<String> {
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
        inventory: &PythonAssertionInventory,
    ) -> PythonFrontendRun {
        let source = "def f(a):\n    return a\n";
        let obligations = build_python_obligations("m.py", source).unwrap();
        let mut outcome = json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call","outcome":"passed","xfail":false});
        if let Some(file) = outcome_file {
            outcome["file"] = json!(file);
        }
        let mut lines = vec![
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"python","argv":["pytest"]}),
            json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
            json!({"t":"assert","ctx":1}),
        ];
        lines.extend(sites.iter().cloned());
        lines.push(outcome);
        lines.push(json!({"t":"exit","at":9}));
        let directory = temporary(name);
        write_transport(&directory.join("main.1.mmap"), &lines, 0);
        let run = build_python_frontend_run(
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

    const SLOT_DIGEST: &str = "0123456789abcdef0123456789abcdef";

    /// Two obligations and one two-condition decision `a or b`, whose
    /// logical branch is decided by the vector: a 16-byte header, two
    /// obligation bytes, then the decision's `2 * 3^2` region bytes.
    fn slot_layout() -> serde_json::Value {
        json!({
            "version": 2, "digest": SLOT_DIGEST, "header": 16, "bytes": 36,
            "ids": ["s1", "s2"],
            "decisions": [{
                "start": 18, "width": 2, "id": "d",
                "outcomeTrue": "d:true", "outcomeFalse": "d:false",
                "logical": [{"evaluated": "or:evaluated", "shortCircuit": "or:short",
                             "previousLeaves": [0], "operandLeaves": [1]}]
            }]
        })
    }

    /// A slot of `slot_layout` for `context`, with `set` bytes at 1.
    fn slot_bytes(context: u64, tag: Option<&str>, set: &[usize]) -> Vec<u8> {
        let mut bytes = vec![0_u8; 36];
        bytes[..8].copy_from_slice(&context.to_le_bytes());
        if let Some(tag) = tag {
            for index in 0..8 {
                bytes[8 + index] = u8::from_str_radix(&tag[index * 2..index * 2 + 2], 16).unwrap();
            }
        }
        for index in set {
            bytes[*index] = 1;
        }
        bytes
    }

    /// A process killed during a test's call phase: its transport declares the
    /// phase and nothing after it, and its slot holds what it observed.
    fn killed_process(name: &str, slot: &[u8]) -> PathBuf {
        let directory = temporary(name);
        write_transport(
            &directory.join("main.1.token.mmap"),
            &[
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.9.21","executable":"python","argv":["pytest"]}),
                json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
            ],
            0,
        );
        fs::write(directory.join("main.1.token.0.slot"), slot).unwrap();
        fs::write(
            directory.join("layout.json"),
            serde_json::to_vec(&slot_layout()).unwrap(),
        )
        .unwrap();
        directory
    }

    fn call_observations(evidence: &Evidence) -> Observations {
        evidence
            .per_identity
            .iter()
            .find(|(identity, _)| identity.phase == "call")
            .map(|(_, observations)| Observations {
                // Slot hits named, as a snapshot names them.
                hits: observations
                    .hits
                    .iter()
                    .cloned()
                    .chain(
                        observations
                            .slot_hits
                            .iter()
                            .map(|position| evidence.slot_ids[*position as usize].clone()),
                    )
                    .collect(),
                slot_hits: Vec::new(),
                vectors: observations.vectors.clone(),
            })
            .unwrap_or_default()
    }

    #[test]
    fn a_killed_process_slot_is_read_as_its_last_records() {
        // s1 ran; `a or b` evaluated a false, then b true -- digits "12", mask
        // 1 + 2*3 = 7 -- and came out true: region byte 18 + 2*7 + 1.
        let directory = killed_process(
            "py-slot-killed",
            &slot_bytes(1, Some(SLOT_DIGEST), &[16, 18 + 15]),
        );
        let evidence = read_evidence_directory(&directory, "run-1").unwrap();
        let call = call_observations(&evidence);
        assert_eq!(
            call.hits.iter().cloned().collect::<Vec<_>>(),
            ["d:true", "or:evaluated", "s1"],
            "the obligation, and what the vector implies"
        );
        assert_eq!(
            call.vectors["d"],
            BTreeSet::from([(vec![Some(false), Some(true)], true)])
        );
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_head_byte_is_read_with_the_bytes_it_stands_for() {
        // Byte 17 (s2) heads what bytes 16 (s1) and 18 + 2*7 + 1 (a vector
        // of d) stand for: the transform left those stores out because s2's
        // probe records them, and reading s2 reads them.
        let directory = temporary("py-slot-implied");
        write_transport(
            &directory.join("main.1.token.mmap"),
            &[
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.9.21","executable":"python","argv":["pytest"]}),
                json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
                json!({"t":"runs","ctx":1,"r":[17, 1]}),
            ],
            0,
        );
        let mut layout = slot_layout();
        layout["implied"] = json!([[17, [16, 18 + 15]]]);
        fs::write(
            directory.join("layout.json"),
            serde_json::to_vec(&layout).unwrap(),
        )
        .unwrap();
        let evidence = read_evidence_directory(&directory, "run-1").unwrap();
        let call = call_observations(&evidence);
        assert_eq!(
            call.hits.iter().cloned().collect::<Vec<_>>(),
            ["d:true", "or:evaluated", "s1", "s2"]
        );
        assert_eq!(
            call.vectors["d"],
            BTreeSet::from([(vec![Some(false), Some(true)], true)])
        );
        // A byte may not imply a statement's own head, past the slot, or a
        // byte that implies others.
        for implied in [
            json!([[17, [17]]]),
            json!([[17, [36]]]),
            json!([[17, [16]], [16, [18]]]),
        ] {
            layout["implied"] = implied;
            fs::write(
                directory.join("layout.json"),
                serde_json::to_vec(&layout).unwrap(),
            )
            .unwrap();
            assert!(read_evidence_directory(&directory, "run-1").is_err());
        }
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_slot_gone_since_the_listing_is_skipped_and_nothing_else_is() {
        // Between listing the evidence and reading it, a process that outlived
        // the test command can close. A slot it took back is skipped at either
        // step; a transport, or anything else, that goes missing is still an
        // error rather than evidence quietly lost.
        let directory = temporary("py-slot-vanished");
        let gone = directory.join("main.1.token.0.slot");
        assert!(
            entry_metadata("main.1.token.0.slot", &gone)
                .unwrap()
                .is_none()
        );
        assert!(map_slot(&gone).unwrap().is_none());
        assert!(entry_metadata("main.1.token.mmap", &directory.join("main.1.token.mmap")).is_err());
        assert!(entry_metadata("layout.json", &directory.join("layout.json")).is_err());
        fs::write(&gone, slot_bytes(1, Some(SLOT_DIGEST), &[16])).unwrap();
        assert!(
            entry_metadata("main.1.token.0.slot", &gone)
                .unwrap()
                .is_some()
        );
        assert!(map_slot(&gone).unwrap().is_some());
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_slot_its_process_closed_is_not_counted() {
        // Close zeroes the tag after its final harvest; a daemon thread may
        // still have written after that, and nothing it wrote is a test's.
        let directory = killed_process("py-slot-closed", &slot_bytes(1, None, &[16]));
        let evidence = read_evidence_directory(&directory, "run-1").unwrap();
        assert!(call_observations(&evidence).hits.is_empty());
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_slot_is_read_only_against_its_own_layout() {
        let other = "fedcba9876543210fedcba9876543210";
        let directory = killed_process("py-slot-foreign", &slot_bytes(1, Some(other), &[16]));
        assert!(matches!(
            read_evidence_directory(&directory, "run-1"),
            Err(PythonEvidenceError::InvalidTransport { .. })
        ));
        fs::remove_dir_all(directory).unwrap();

        // A byte that is neither set nor clear was not written by a probe.
        let directory = killed_process("py-slot-byte", &slot_bytes(1, Some(SLOT_DIGEST), &[]));
        let mut bytes = slot_bytes(1, Some(SLOT_DIGEST), &[]);
        bytes[17] = 7;
        fs::write(directory.join("main.1.token.0.slot"), bytes).unwrap();
        assert!(read_evidence_directory(&directory, "run-1").is_err());
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_slot_needs_its_transport_and_a_partial_layout_is_ignored() {
        let directory = killed_process("py-slot-orphan", &slot_bytes(1, Some(SLOT_DIGEST), &[16]));
        // A layout write cut short by the process dying is left behind.
        fs::write(directory.join("layout.json.42.token.partial"), b"{").unwrap();
        assert!(read_evidence_directory(&directory, "run-1").is_ok());
        fs::write(
            directory.join("other.9.token.0.slot"),
            slot_bytes(1, Some(SLOT_DIGEST), &[16]),
        )
        .unwrap();
        assert!(matches!(
            read_evidence_directory(&directory, "run-1"),
            Err(PythonEvidenceError::InvalidTransport { .. })
        ));
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn an_assertion_site_becomes_a_located_phase_when_the_inventory_names_one() {
        // Python reports a file and a line for an assertion, so a line is a
        // witness only when the inventory holds exactly one site on it. The
        // column reported is zero-based, which is what every native manifest
        // reports and what the assertion report adds one to.
        let inventory = inventory_of(&under("project", ""), &[("tests/test_m.py", 6, 5)]);
        let run = run_with_sites(
            "py-asite-located",
            &[json!({"t":"asite","ctx":1,"f":under("project", "tests/test_m.py"),"l":6})],
            None,
            &inventory,
        );
        assert!(
            assertion_sources(&run).contains(&"tests/test_m.py:6:4".to_string()),
            "expected a located assertion phase, got {:?}",
            assertion_sources(&run)
        );
    }

    #[test]
    fn an_ambiguous_or_foreign_assertion_site_witnesses_nothing() {
        // Two sites on one line cannot be told apart from a line number, and a
        // frame outside the project names nothing. Both lose the witness
        // rather than guessing one.
        let ambiguous = inventory_of(
            &under("project", ""),
            &[("tests/test_m.py", 6, 5), ("tests/test_m.py", 6, 30)],
        );
        let run = run_with_sites(
            "py-asite-ambiguous",
            &[json!({"t":"asite","ctx":1,"f":under("project", "tests/test_m.py"),"l":6})],
            None,
            &ambiguous,
        );
        assert_eq!(
            assertion_sources(&run),
            vec!["tests/test_m.py::test_a".to_string()],
            "only the per-test assertion phase should remain"
        );

        let known = inventory_of(&under("project", ""), &[("tests/test_m.py", 6, 5)]);
        let outside = run_with_sites(
            "py-asite-outside",
            &[json!({"t":"asite","ctx":1,"f":under("elsewhere", "tests/test_m.py"),"l":6})],
            None,
            &known,
        );
        assert_eq!(
            assertion_sources(&outside),
            vec!["tests/test_m.py::test_a".to_string()]
        );
    }

    #[test]
    fn the_runner_names_the_test_file_in_either_path_form() {
        // pytest reports the file from the report's location and unittest from
        // the test's module; either may be absolute or relative. Both name the
        // same project file, and a runner that names none falls back to the
        // node id.
        let inventory = inventory_of(&under("project", ""), &[("tests/test_m.py", 6, 5)]);
        for reported in [
            under("project", "tests/test_m.py"),
            "tests/test_m.py".to_owned(),
            "./tests/test_m.py".to_owned(),
        ] {
            let run = run_with_sites("py-asite-file", &[], Some(reported.as_str()), &inventory);
            assert_eq!(
                run.request.raw_results[0].test_file.as_deref(),
                Some("tests/test_m.py"),
                "{reported} should resolve to the project path"
            );
        }
        let without = run_with_sites("py-asite-nofile", &[], None, &inventory);
        assert_eq!(
            without.request.raw_results[0].test_file.as_deref(),
            Some("tests/test_m.py"),
            "a pytest node id already begins with the file"
        );
    }

    /// A run with every kind of phase evidence: setup, a call phase split by
    /// its first assertion, teardown, background, and decision vectors on
    /// both sides of the assertion.
    fn phased_run(name: &str) -> PythonFrontendRun {
        let source = "def f(a, b):\n    if a and b:\n        return 1\n    return 2\n";
        let obligations = build_python_obligations("m.py", source).unwrap();
        let statements = &obligations.plan.statements;
        let decision = &obligations.manifest.decisions[0].id;
        let test = "tests/test_m.py::test_a";
        let lines = [
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"python","argv":["pytest"]}),
            json!({"t":"hit","ctx":0,"id":statements[0].id}),
            json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":test,"retry":0,"phase":"setup"}),
            json!({"t":"hits","ctx":1,"ids":[statements[0].id, statements[1].id]}),
            json!({"t":"outcome","worker":"main","test":test,"retry":0,"phase":"setup","outcome":"passed","xfail":false}),
            json!({"t":"phase","ctx":2,"at":6,"worker":"main","test":test,"retry":0,"phase":"call"}),
            json!({"t":"hit","ctx":2,"id":statements[1].id}),
            json!({"t":"dec","ctx":2,"id":decision,"v":"22","o":1}),
            json!({"t":"assert","ctx":2}),
            json!({"t":"hit","ctx":2,"id":statements[2].id}),
            json!({"t":"dec","ctx":2,"id":decision,"v":"21","o":0}),
            json!({"t":"outcome","worker":"main","test":test,"retry":0,"phase":"call","outcome":"passed","xfail":false}),
            json!({"t":"phase","ctx":3,"at":7,"worker":"main","test":test,"retry":0,"phase":"teardown"}),
            json!({"t":"hit","ctx":3,"id":statements[2].id}),
            json!({"t":"outcome","worker":"main","test":test,"retry":0,"phase":"teardown","outcome":"passed","xfail":false}),
            json!({"t":"exit","at":9}),
        ];
        let directory = temporary(name);
        write_transport(&directory.join("main.1.mmap"), &lines, 0);
        let run = build_python_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            0,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        fs::remove_dir_all(directory).unwrap();
        run
    }

    #[test]
    fn a_snapshot_that_names_its_phase_analyses_as_the_events_it_replaces() {
        // Python names a snapshot's phase once instead of writing an explicit
        // event per hit and vector. Every count and relation the analysis
        // derives must be the one those events gave.
        use crate::coverage_report::{RuntimeEvent, analyze_coverage_results};
        let run = phased_run("py-phase-named");
        let named = &run.request;
        assert!(
            named
                .raw_results
                .iter()
                .flat_map(|raw| &raw.runtime)
                .filter(|snapshot| snapshot.phase_id.is_some())
                .count()
                >= 4,
            "setup, call, assertion and teardown each name their phase"
        );
        let mut events = named.clone();
        for snapshot in events
            .raw_results
            .iter_mut()
            .flat_map(|raw| raw.runtime.iter_mut())
        {
            let Some(phase) = snapshot.phase_id.take() else {
                continue;
            };
            let mut clock = 1;
            let mut event = |event_type: &str, id: &str, vector: Option<McdcVector>| {
                clock += 1;
                RuntimeEvent {
                    event_type: event_type.into(),
                    id: id.into(),
                    vector,
                    timestamp_ms: clock,
                    phase_id: Some(phase.clone()),
                    statement_id: None,
                    environment: "python".into(),
                }
            };
            let mut written = snapshot
                .hits
                .iter()
                .map(|hit| event("hit", hit, None))
                .collect::<Vec<_>>();
            for decision in &snapshot.decisions {
                for vector in &decision.vectors {
                    written.push(event("decision", &decision.meta.id, Some(vector.clone())));
                }
            }
            snapshot.events = written;
        }
        let from_names = analyze_coverage_results(named).unwrap();
        let from_events = analyze_coverage_results(&events).unwrap();
        assert!(
            from_names
                .view
                .phases
                .iter()
                .any(|phase| phase.explicit_events > 1),
            "the fixture's phases carry explicit evidence"
        );
        assert_eq!(
            serde_json::to_value(&from_names).unwrap(),
            serde_json::to_value(&from_events).unwrap()
        );
    }

    #[test]
    fn analysing_the_archived_request_is_analysing_the_archive() {
        // Publication analyses the request it has just archived instead of
        // reading the archive back. The two must agree to the byte.
        use crate::coverage_report::{
            ArchiveReportRequest, ExitCodeInput, TransportStats, analyze_coverage_archive,
            analyze_frontend_request,
        };
        let run = phased_run("py-archived");
        let directory = temporary("py-archived-archive");
        let archive = directory.join("evidence.raw.gz");
        crate::evidence_archive::write_archive(run.archive_entries().unwrap(), &archive).unwrap();
        let integrity = json!({"schemaVersion": 2});
        let from_archive = analyze_coverage_archive(&ArchiveReportRequest {
            archive_path: archive,
            run_id: "run-1".into(),
            generated_at: "then".into(),
            integrity: Some(integrity.clone()),
            test_exit_code: ExitCodeInput::Present(Some(0)),
        })
        .unwrap();
        let in_memory = analyze_frontend_request(
            &run.declaration,
            &CoverageReportRequest {
                run_id: "run-1".into(),
                generated_at: "then".into(),
                integrity: Some(integrity),
                test_exit_code: ExitCodeInput::Present(Some(0)),
                ..run.request.clone()
            },
            TransportStats::none(),
        )
        .unwrap();
        fs::remove_dir_all(directory).unwrap();
        assert_eq!(
            serde_json::to_value(&in_memory).unwrap(),
            serde_json::to_value(&from_archive).unwrap()
        );
    }

    #[test]
    fn evidence_before_the_first_assertion_links_to_it_when_the_test_passes() {
        // The runtime's marker says everything the call phase recorded so far
        // ran before an assertion. That evidence carries an assertion phase
        // that passed with the test; what ran after the marker, and all of a
        // test that failed, stays execution only. A second marker is inert.
        let source = "def f(a):\n    return a\n\n\ndef g(b):\n    return b\n";
        let obligations = build_python_obligations("m.py", source).unwrap();
        let before = &obligations.plan.statements[0].id;
        let after = &obligations.plan.statements[1].id;
        let run_with = |name: &str, outcome: &str| {
            let lines = [
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"python","argv":["pytest"]}),
                json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
                json!({"t":"hit","ctx":1,"id":before}),
                json!({"t":"assert","ctx":1}),
                json!({"t":"assert","ctx":1}),
                json!({"t":"hit","ctx":1,"id":after}),
                json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call","outcome":outcome,"xfail":false}),
                json!({"t":"exit","at":9}),
            ];
            let directory = temporary(name);
            write_transport(&directory.join("main.1.mmap"), &lines, 0);
            let run = build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty(),
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
                .filter(|snapshot| snapshot.phase_id.as_deref() == Some(phase))
                .flat_map(|snapshot| snapshot.hits.iter().cloned())
                .collect()
        };

        let run = run_with("asserted-passed", "passed");
        let passed = &run.request.raw_results[0];
        assert_eq!(passed.test, "tests/test_m.py::test_a");
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
    fn repeated_runtime_limitations_keep_each_affected_file_once() {
        let mut manifest = build_python_obligations("a.py", "x = 1\n")
            .unwrap()
            .manifest;
        let second = build_python_obligations("b.py", "y = 2\n")
            .unwrap()
            .manifest;
        manifest.points.extend(second.points);
        let directory = temporary("repeated-limitations");
        let mut records = vec![
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.11","executable":"python","argv":[]}),
            json!({"t":"outcome","worker":"main","test":"test_a","retry":0,"phase":"call","outcome":"passed","xfail":false}),
        ];
        for _ in 0..1000 {
            for file in ["a.py", "b.py"] {
                records.push(json!({"t":"limitation","id":"python-probes-unobserved-module","file":file,"reason":"entry script"}));
            }
        }
        write_transport(&directory.join("main.1.mmap"), &records, 0);
        let evidence = read_evidence_directory(&directory, "run-1").unwrap();
        assert_eq!(
            evidence.limitations.len(),
            2,
            "deduplicate before manifest expansion"
        );
        let run = build_python_frontend_run(
            &manifest,
            &directory,
            "run-1",
            "now",
            0,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        let limitations = &run.request.manifest.limitations;
        assert_eq!(limitations.len(), 2);
        assert_ne!(limitations[0]["id"], limitations[1]["id"]);
        assert_eq!(limitations[0]["file"], "a.py");
        assert_eq!(limitations[1]["file"], "b.py");
        assert_eq!(limitations[0]["code"], "python-probes-unobserved-module");
        assert_eq!(run.request.manifest.unmeasured.len(), 2);
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_script_run_unobserved_stays_measured_where_its_imports_were_observed() {
        // issue #40: tests import `bin/anti-drift-gate.py` and also run it as
        // `python bin/anti-drift-gate.py`. The direct run made the whole file
        // unmeasured, discarding what the imports were seen to run.
        let imported = build_python_obligations("imported.py", "def f():\n    return 1\n").unwrap();
        let only_run = build_python_obligations("only_run.py", "y = 2\n").unwrap();
        let mut manifest = imported.manifest.clone();
        manifest.points.extend(only_run.manifest.points.clone());
        let statement = &imported.plan.statements[0];
        let directory = temporary("script-and-import");
        let records = vec![
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.11","executable":"python","argv":["pytest"]}),
            json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
            json!({"t":"hit","ctx":1,"id":statement.id}),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call","outcome":"passed","xfail":false}),
            json!({"t":"limitation","id":"python-probes-unobserved-module","file":"imported.py","reason":"entry script"}),
            json!({"t":"limitation","id":"python-probes-unobserved-module","file":"only_run.py","reason":"entry script"}),
        ];
        write_transport(&directory.join("main.1.mmap"), &records, 0);
        let run = build_python_frontend_run(
            &manifest,
            &directory,
            "run-1",
            "now",
            0,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        let unmeasured = &run.request.manifest.unmeasured;
        let file_points = |file: &str| {
            manifest
                .points
                .iter()
                .filter(|point| point.file == file)
                .map(|point| point.id.clone())
                .collect::<Vec<_>>()
        };
        assert!(
            file_points("imported.py")
                .iter()
                .all(|id| !unmeasured.contains(id)),
            "an observed file keeps its measurement"
        );
        assert!(
            file_points("only_run.py")
                .iter()
                .all(|id| unmeasured.contains(id)),
            "a file nothing observed stays unmeasured"
        );
        // Both still say so: the imported file's numbers are a lower bound.
        let files = run
            .request
            .manifest
            .limitations
            .iter()
            .map(|limitation| limitation["file"].as_str().unwrap().to_owned())
            .collect::<BTreeSet<_>>();
        assert!(files.contains("imported.py") && files.contains("only_run.py"));
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn joins_phases_outcomes_hits_and_vectors_into_exact_results() {
        let source = "def f(a, b):\n    if a and b:\n        return 1\n    return 0\n";
        let obligations = build_python_obligations("m.py", source).unwrap();
        let decision = &obligations.plan.decisions[0];
        let statement = &obligations.plan.statements[0];
        let directory = temporary("join");
        let lines = [
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"python","argv":["pytest"]}),
            json!({"t":"hit","ctx":0,"id":statement.id}),
            json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call"}),
            json!({"t":"dec","ctx":1,"id":decision.id,"v":"22","o":1}),
            json!({"t":"hit","ctx":1,"id":decision.outcome_true}),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"setup","outcome":"passed","xfail":false}),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"call","outcome":"passed","xfail":false}),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_a","retry":0,"phase":"teardown","outcome":"passed","xfail":false}),
            json!({"t":"limitation","id":"python-decision-partially-mapped","reason":"folded","obligation":decision.id}),
            json!({"t":"exit","at":9}),
        ];
        write_transport(&directory.join("main.1.mmap"), &lines, 0);
        let run = build_python_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            0,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        assert_eq!(run.tests, 1);
        assert_eq!(run.request.raw_results.len(), 2);
        let test = &run.request.raw_results[0];
        assert_eq!(test.status.as_deref(), Some("passed"));
        assert_eq!(test.phases.len(), 3);
        assert_eq!(test.runtime.len(), 1);
        assert_eq!(test.runtime[0].decisions.len(), 1);
        assert!(test.runtime[0].phase_id.is_some());
        assert!(test.runtime[0].events.is_empty());
        let background = &run.request.raw_results[1];
        assert_eq!(background.role, "background");
        assert!(run.request.manifest.unmeasured.contains(&decision.id));
        assert!(run.declaration.structural_limitations.contains(&stable_id(
            "python-decision-partially-mapped",
            &["", &decision.id]
        )));
        fs::remove_dir_all(directory).unwrap();
    }

    // Version 2 checksums with CRC-32, version 1 with FNV-1a. A runtime older
    // than this reader -- evidence kept from a failed run, say -- still reads,
    // by its own checksum; a payload that does not match its checksum, and a
    // version this reader does not know, are refused rather than guessed at.
    #[test]
    fn a_transport_reads_by_its_own_versions_checksum() {
        let obligations = build_python_obligations("m.py", "x = 1\n").unwrap();
        let process = json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"p","argv":[]});
        let read = |name: &str, version: u32, corrupt: Option<usize>| {
            let directory = temporary(name);
            write_transport_version(
                &directory.join("main.1.mmap"),
                std::slice::from_ref(&process),
                0,
                version,
                corrupt,
            );
            let outcome = build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty(),
            );
            fs::remove_dir_all(directory).unwrap();
            outcome.map(|_| ()).map_err(|error| error.to_string())
        };
        let current = read("checksum-v2", TRANSPORT_VERSION, None);
        let older = read("checksum-v1", TRANSPORT_VERSION_FNV, None);
        assert_eq!(
            older, current,
            "a version 1 transport reads as a version 2 one does"
        );
        assert!(
            !current
                .as_ref()
                .err()
                .is_some_and(|error| error.contains("checksum")),
            "{current:?}"
        );
        let corrupted = read("checksum-bad", TRANSPORT_VERSION, Some(0)).unwrap_err();
        assert!(corrupted.contains("checksum does not match"), "{corrupted}");
        let unknown = read("checksum-v3", TRANSPORT_VERSION + 1, None).unwrap_err();
        assert!(unknown.contains("version"), "{unknown}");
    }

    #[test]
    fn mixed_pytest_and_unittest_runs_have_distinct_runner_limitations() {
        let obligations = build_python_obligations("m.py", "def f():\n    return 1\n").unwrap();
        let directory = temporary("mixed-runners");
        let mut records = vec![json!({"t":"process","v":1,"run":"run-1","pid":1,
            "worker":"main","python":"3.11.11","executable":"python","argv":["pytest"]})];
        for (index, runner) in [PYTEST_RUNNER, UNITTEST_RUNNER].iter().enumerate() {
            let test = format!("tests/test_m.py::test_{runner}");
            records.push(
                json!({"t":"phase","ctx":index+1,"at":index+5,"worker":"main",
                "test":test,"retry":0,"phase":"call"}),
            );
            records.push(json!({"t":"hit","ctx":index+1,"id":obligations.plan.statements[0].id}));
            records.push(json!({"t":"outcome","worker":"main","test":test,"retry":0,
                "phase":"call","outcome":"passed","xfail":false,"runner":runner}));
        }
        write_transport(&directory.join("main.1.mmap"), &records, 0);
        let run = build_python_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            0,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        assert_eq!(run.tests, 2);
        assert_eq!(run.declaration.runners.len(), 2);
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        for runner in &run.declaration.runners {
            assert_eq!(runner.limitations.len(), 1);
            assert_eq!(runner.attribution.action, AttributionPrecision::Unavailable);
            assert_eq!(
                runner.limitations[0].scopes,
                [FrontendLimitationScope::Action]
            );
        }
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_phase_its_runner_reported_more_than_once_is_one_phase() {
        // pytest-subtests reports every subtest under the same node id and the
        // same `call` phase, so an attempt carries several outcomes for the
        // identity a phase id is derived from. Each became its own phase with
        // the same id, and the run was refused whole -- a suite of 6872 tests
        // lost two and three-quarter hours of measurement to it (#40). The
        // outcomes fold the way an attempt's do: a failure anywhere is the
        // phase's.
        let source = "def f(a):\n    return a\n";
        let obligations = build_python_obligations("m.py", source).unwrap();
        let directory = temporary("subtests");
        let subtest = |outcome: &str| {
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_many","retry":0,
                   "phase":"call","outcome":outcome,"xfail":false})
        };
        let lines = [
            json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"python","argv":["pytest"]}),
            json!({"t":"phase","ctx":1,"at":5,"worker":"main","test":"tests/test_m.py::test_many","retry":0,"phase":"call"}),
            json!({"t":"hit","ctx":1,"id":obligations.plan.statements[0].id}),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_many","retry":0,"phase":"setup","outcome":"passed","xfail":false}),
            subtest("passed"),
            subtest("passed"),
            subtest("failed"),
            subtest("passed"),
            json!({"t":"outcome","worker":"main","test":"tests/test_m.py::test_many","retry":0,"phase":"teardown","outcome":"passed","xfail":false}),
            json!({"t":"exit","at":9}),
        ];
        write_transport(&directory.join("main.1.mmap"), &lines, 0);
        let run = build_python_frontend_run(
            &obligations.manifest,
            &directory,
            "run-1",
            "now",
            1,
            &PythonAssertionInventory::empty(),
        )
        .unwrap();
        // The protocol refuses a repeated phase id, which is what threw the
        // run away; nothing may reach it twice.
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        let test = &run.request.raw_results[0];
        assert_eq!(
            test.phases.len(),
            3,
            "setup, one call, teardown: {:?}",
            test.phases
        );
        assert_eq!(
            test.phases
                .iter()
                .filter(|phase| phase.kind == "test")
                .count(),
            1,
            "the subtests share the call phase their coverage was recorded under"
        );
        assert_eq!(
            test.status.as_deref(),
            Some("failed"),
            "a subtest that failed fails its test"
        );
        // And the coverage recorded under that identity survives the fold.
        assert_eq!(test.runtime.len(), 1);
        assert!(!test.runtime[0].hits.is_empty());
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn fails_closed_without_an_interpreter_or_tests() {
        let obligations = build_python_obligations("m.py", "x = 1\n").unwrap();
        let directory = temporary("empty");
        assert!(matches!(
            build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty()
            ),
            Err(PythonEvidenceError::NoInterpreter)
        ));
        let path = directory.join("main.1.mmap");
        write_transport(
            &path,
            &[
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"p","argv":[]}),
            ],
            0,
        );
        assert!(matches!(
            build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty()
            ),
            Err(PythonEvidenceError::NoTests)
        ));
        // A killed writer may have copied part of its next payload without
        // publishing the commit byte. The reader must stop at that frame,
        // even when the tail would be invalid JSON if treated as committed.
        let mut torn = fs::read(&path).unwrap();
        let process_length = transport_u32(&torn, TRANSPORT_HEADER_SIZE + 4).unwrap() as usize;
        let torn_cursor =
            align_transport(TRANSPORT_HEADER_SIZE + TRANSPORT_RECORD_HEADER_SIZE + process_length)
                .unwrap();
        torn[torn_cursor + 4..torn_cursor + 8].copy_from_slice(&5_u32.to_le_bytes());
        torn[torn_cursor + TRANSPORT_RECORD_HEADER_SIZE
            ..torn_cursor + TRANSPORT_RECORD_HEADER_SIZE + 5]
            .copy_from_slice(b"{nope");
        fs::write(&path, torn).unwrap();
        assert!(matches!(
            build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty()
            ),
            Err(PythonEvidenceError::NoTests)
        ));
        write_transport(
            &path,
            &[
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.8.20","executable":"p","argv":[]}),
            ],
            0,
        );
        assert!(matches!(
            build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty()
            ),
            Err(PythonEvidenceError::UnsupportedPython(_))
        ));
        write_transport(
            &path,
            &[
                json!({"t":"process","v":1,"run":"run-1","pid":1,"worker":"main","python":"3.14.4","executable":"p","argv":[]}),
            ],
            2,
        );
        assert!(matches!(
            build_python_frontend_run(
                &obligations.manifest,
                &directory,
                "run-1",
                "now",
                0,
                &PythonAssertionInventory::empty()
            ),
            Err(PythonEvidenceError::DroppedRecords { count: 2, .. })
        ));
        fs::remove_dir_all(directory).unwrap();
    }
}
