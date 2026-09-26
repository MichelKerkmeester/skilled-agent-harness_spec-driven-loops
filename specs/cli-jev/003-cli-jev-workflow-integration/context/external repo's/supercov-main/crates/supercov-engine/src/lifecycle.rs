//! Crash-safe run publication, recovery and explicit retention.
//!
//! Deletion targets are derived from a trusted project root. Large trees are
//! atomically moved into durable trash; recursive unlinking is a separate,
//! retryable operation that the CLI can run in a detached child.

use std::{
    collections::BTreeSet,
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    path::{Component, Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::run_store::{RunMetadata, valid_run_id};

const TRASH: &str = ".supercov/.trash";
const INCOMPLETE_LOCK_GRACE: Duration = Duration::from_secs(30);
static UNIQUE: AtomicU64 = AtomicU64::new(0);

#[derive(Debug)]
pub enum LifecycleError {
    Io { path: PathBuf, source: io::Error },
    InvalidRunId(String),
    UnsafePath(PathBuf),
    InvalidState(String),
    ActiveRun { run_id: String, pid: u32 },
    LockAcquiring,
    LockUnavailable,
    PublicationExists(String),
    Metadata(serde_json::Error),
    EvidenceLength { expected: u64, actual: u64 },
    EvidenceChanged,
}

impl std::fmt::Display for LifecycleError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::InvalidRunId(id) => write!(formatter, "invalid coverage run ID: {id}"),
            Self::UnsafePath(path) => {
                write!(
                    formatter,
                    "unsafe Supercov storage path: {}",
                    path.display()
                )
            }
            Self::InvalidState(reason) => write!(formatter, "invalid run state: {reason}"),
            Self::ActiveRun { run_id, pid } => write!(
                formatter,
                "coverage run {run_id} is already active in this project (pid {pid})"
            ),
            Self::LockAcquiring => {
                write!(
                    formatter,
                    "a coverage run is currently acquiring the project lock"
                )
            }
            Self::LockUnavailable => {
                write!(formatter, "could not acquire the Supercov project lock")
            }
            Self::PublicationExists(id) => write!(formatter, "coverage run already exists: {id}"),
            Self::Metadata(error) => write!(formatter, "invalid run metadata: {error}"),
            Self::EvidenceLength { expected, actual } => write!(
                formatter,
                "evidence length changed before publication: expected {expected}, got {actual}"
            ),
            Self::EvidenceChanged => write!(formatter, "evidence changed during publication"),
        }
    }
}

impl std::error::Error for LifecycleError {}

fn io_error(path: &Path, source: io::Error) -> LifecycleError {
    LifecycleError::Io {
        path: path.to_owned(),
        source,
    }
}

fn checked_id(id: &str) -> Result<(), LifecycleError> {
    valid_run_id(id)
        .then_some(())
        .ok_or_else(|| LifecycleError::InvalidRunId(id.into()))
}

fn absolute_root(root: &Path) -> Result<PathBuf, LifecycleError> {
    if root.is_absolute() {
        Ok(root.to_owned())
    } else {
        std::env::current_dir()
            .map(|cwd| cwd.join(root))
            .map_err(|source| io_error(root, source))
    }
}

fn lexical_descendant(root: &Path, path: &Path) -> bool {
    let Ok(local) = path.strip_prefix(root) else {
        return false;
    };
    !local.as_os_str().is_empty()
        && local
            .components()
            .all(|component| matches!(component, Component::Normal(_)))
}

fn reject_linked_ancestors(
    root: &Path,
    path: &Path,
    include_leaf: bool,
) -> Result<(), LifecycleError> {
    let local = path
        .strip_prefix(root)
        .map_err(|_| LifecycleError::UnsafePath(path.into()))?;
    let components = local.components().collect::<Vec<_>>();
    let through = if include_leaf {
        components.len()
    } else {
        components.len().saturating_sub(1)
    };
    let mut current = root.to_owned();
    for component in components.into_iter().take(through) {
        let Component::Normal(component) = component else {
            return Err(LifecycleError::UnsafePath(path.into()));
        };
        current.push(component);
        match fs::symlink_metadata(&current) {
            Ok(metadata) if metadata.file_type().is_symlink() => {
                return Err(LifecycleError::UnsafePath(current));
            }
            Ok(metadata) if !metadata.file_type().is_dir() => {
                return Err(LifecycleError::UnsafePath(current));
            }
            Ok(_) => {}
            Err(error) if error.kind() == io::ErrorKind::NotFound => break,
            Err(source) => return Err(io_error(&current, source)),
        }
    }
    Ok(())
}

fn owned_workspace_container(root: &Path) -> bool {
    let container = crate::workspace::workspace_container(root);
    crate::workspace::owned_workspace_path(&container)
}

fn unique_name() -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos();
    format!(
        "{}-{nanos}-{}",
        std::process::id(),
        UNIQUE.fetch_add(1, Ordering::Relaxed)
    )
}

/// Make a rename or creation inside `path` durable. On Unix a directory opens
/// like a file and fsync flushes its entries. On Windows there is nothing to
/// do and no way to do it: CreateFileW refuses to open a directory without
/// FILE_FLAG_BACKUP_SEMANTICS and answers ERROR_ACCESS_DENIED, which is how
/// the first Windows run died -- in the JavaScript frontend's own copy of this
/// idiom, on the generated node_modules directory it had just created -- and
/// NTFS journals directory metadata without an explicit sync. Every place
/// that syncs a directory goes through here so the rule is stated once.
pub(crate) fn sync_directory_handle(path: &Path) -> io::Result<()> {
    #[cfg(unix)]
    {
        File::open(path).and_then(|directory| directory.sync_all())
    }
    #[cfg(not(unix))]
    {
        let _ = path;
        Ok(())
    }
}

pub(crate) fn sync_directory(path: &Path) -> Result<(), LifecycleError> {
    sync_directory_handle(path).map_err(|source| io_error(path, source))
}

pub(crate) fn atomic_rename(source: &Path, destination: &Path) -> Result<(), LifecycleError> {
    let source_parent = source
        .parent()
        .ok_or_else(|| LifecycleError::UnsafePath(source.into()))?;
    let destination_parent = destination
        .parent()
        .ok_or_else(|| LifecycleError::UnsafePath(destination.into()))?;
    fs::create_dir_all(destination_parent).map_err(|error| io_error(destination_parent, error))?;
    fs::rename(source, destination).map_err(|error| io_error(destination, error))?;
    sync_directory(destination_parent)?;
    if source_parent != destination_parent {
        sync_directory(source_parent)?;
    }
    Ok(())
}

pub(crate) fn atomic_write(root: &Path, path: &Path, bytes: &[u8]) -> Result<(), LifecycleError> {
    let parent = path
        .parent()
        .ok_or_else(|| LifecycleError::UnsafePath(path.into()))?;
    reject_linked_ancestors(root, parent, true)?;
    fs::create_dir_all(parent).map_err(|source| io_error(parent, source))?;
    for _ in 0..16 {
        let temporary = parent.join(format!(
            ".{}.{}.tmp",
            path.file_name()
                .and_then(|value| value.to_str())
                .unwrap_or("state"),
            unique_name()
        ));
        let mut file = match OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&temporary)
        {
            Ok(file) => file,
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => continue,
            Err(source) => return Err(io_error(&temporary, source)),
        };
        if let Err(source) = file.write_all(bytes).and_then(|_| file.sync_all()) {
            let _ = fs::remove_file(&temporary);
            return Err(io_error(&temporary, source));
        }
        drop(file);
        if let Err(source) = fs::rename(&temporary, path) {
            let _ = fs::remove_file(&temporary);
            return Err(io_error(path, source));
        }
        sync_directory(parent)?;
        return Ok(());
    }
    Err(LifecycleError::LockUnavailable)
}

pub fn remove_stored_tree_deferred(
    project_root: &Path,
    target: &Path,
) -> Result<Option<PathBuf>, LifecycleError> {
    let root = absolute_root(project_root)?;
    let target = if target.is_absolute() {
        target.to_owned()
    } else {
        root.join(target)
    };
    match fs::symlink_metadata(&target) {
        Ok(_) => {}
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(None),
        Err(source) => return Err(io_error(&target, source)),
    }
    let store = root.join(".supercov");
    let trash = root.join(TRASH);
    let in_store = lexical_descendant(&store, &target) && !lexical_descendant(&trash, &target);
    let container = crate::workspace::workspace_container(&root);
    let in_workspace = owned_workspace_container(&root)
        && (target == container || lexical_descendant(&container, &target));
    if !in_store && !in_workspace {
        return Err(LifecycleError::UnsafePath(target));
    }
    reject_linked_ancestors(if in_store { &store } else { &container }, &target, false)?;
    reject_linked_ancestors(&root, &trash, true)?;
    fs::create_dir_all(&trash).map_err(|source| io_error(&trash, source))?;
    let destination = trash.join(unique_name());
    atomic_rename(&target, &destination)?;
    Ok(Some(destination))
}

/// Retryable trash unlinking. Public commands execute this in a child.
pub fn sweep_trash(project_root: &Path) -> Result<usize, LifecycleError> {
    let root = absolute_root(project_root)?;
    let trash = root.join(TRASH);
    reject_linked_ancestors(&root, &trash, true)?;
    let entries = match fs::read_dir(&trash) {
        Ok(entries) => entries,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(0),
        Err(source) => return Err(io_error(&trash, source)),
    };
    let Some(_lock) = TrashLock::acquire(&trash)? else {
        return Ok(0);
    };
    let mut removed = 0;
    for entry in entries {
        let entry = entry.map_err(|source| io_error(&trash, source))?;
        let path = entry.path();
        if entry.file_name() == ".deleter.lock" {
            continue;
        }
        let metadata = fs::symlink_metadata(&path).map_err(|source| io_error(&path, source))?;
        if metadata.file_type().is_dir() {
            fs::remove_dir_all(&path).map_err(|source| io_error(&path, source))?;
        } else {
            fs::remove_file(&path).map_err(|source| io_error(&path, source))?;
        }
        removed += 1;
    }
    Ok(removed)
}

struct TrashLock {
    path: PathBuf,
}

impl TrashLock {
    fn acquire(trash: &Path) -> Result<Option<Self>, LifecycleError> {
        let path = trash.join(".deleter.lock");
        for _ in 0..2 {
            match OpenOptions::new().write(true).create_new(true).open(&path) {
                Ok(mut file) => {
                    write!(file, "{}", std::process::id())
                        .and_then(|_| file.sync_all())
                        .map_err(|source| io_error(&path, source))?;
                    return Ok(Some(Self { path }));
                }
                Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {
                    let owner = fs::read_to_string(&path)
                        .ok()
                        .and_then(|value| value.parse::<u32>().ok());
                    if owner.is_some_and(process_exists) {
                        return Ok(None);
                    }
                    if owner.is_none() {
                        let age = fs::metadata(&path)
                            .and_then(|metadata| metadata.modified())
                            .ok()
                            .and_then(|modified| SystemTime::now().duration_since(modified).ok())
                            .unwrap_or_default();
                        if age < INCOMPLETE_LOCK_GRACE {
                            return Ok(None);
                        }
                    }
                    fs::remove_file(&path).map_err(|source| io_error(&path, source))?;
                }
                Err(source) => return Err(io_error(&path, source)),
            }
        }
        Ok(None)
    }
}

impl Drop for TrashLock {
    fn drop(&mut self) {
        let _ = fs::remove_file(&self.path);
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RunStateStatus {
    Preparing,
    Building,
    Testing,
    Publishing,
    Complete,
    Failed,
    Interrupted,
    Abandoned,
}

impl RunStateStatus {
    pub fn terminal(self) -> bool {
        matches!(
            self,
            Self::Complete | Self::Failed | Self::Interrupted | Self::Abandoned
        )
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RunState {
    pub id: String,
    pub pid: u32,
    pub root: String,
    pub workspace: String,
    pub started_at: String,
    pub updated_at: String,
    pub status: RunStateStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub signal: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

fn state_path(root: &Path, id: &str) -> PathBuf {
    root.join(".supercov/work").join(id).join("state.json")
}

pub fn write_run_state(root: &Path, state: &RunState) -> Result<(), LifecycleError> {
    checked_id(&state.id)?;
    let mut bytes = serde_json::to_vec_pretty(state).map_err(LifecycleError::Metadata)?;
    bytes.push(b'\n');
    atomic_write(root, &state_path(root, &state.id), &bytes)
}

fn read_state(root: &Path, id: &str) -> Result<Option<RunState>, LifecycleError> {
    checked_id(id)?;
    let path = state_path(root, id);
    let bytes = match fs::read(&path) {
        Ok(bytes) => bytes,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(None),
        Err(source) => return Err(io_error(&path, source)),
    };
    serde_json::from_slice(&bytes)
        .map(Some)
        .map_err(|error| LifecycleError::InvalidState(error.to_string()))
}

pub fn update_run_state(
    root: &Path,
    id: &str,
    status: RunStateStatus,
    updated_at: &str,
    error: Option<String>,
) -> Result<RunState, LifecycleError> {
    let mut state = read_state(root, id)?
        .ok_or_else(|| LifecycleError::InvalidState(format!("state is missing for {id}")))?;
    state.status = status;
    state.updated_at = updated_at.into();
    state.error = error;
    write_run_state(root, &state)?;
    Ok(state)
}

pub fn interrupt_run_state(
    root: &Path,
    id: &str,
    updated_at: &str,
    signal: &str,
) -> Result<RunState, LifecycleError> {
    let mut state = read_state(root, id)?
        .ok_or_else(|| LifecycleError::InvalidState(format!("state is missing for {id}")))?;
    state.status = RunStateStatus::Interrupted;
    state.updated_at = updated_at.into();
    state.signal = Some(signal.into());
    state.error = Some(format!("Interrupted by {signal}"));
    write_run_state(root, &state)?;
    Ok(state)
}

#[cfg(unix)]
fn process_exists(pid: u32) -> bool {
    if pid == 0 || pid > libc::pid_t::MAX as u32 {
        return false;
    }
    // SAFETY: signal zero only checks existence/permission.
    let result = unsafe { libc::kill(pid as libc::pid_t, 0) };
    result == 0 || io::Error::last_os_error().raw_os_error() == Some(libc::EPERM)
}

#[cfg(not(unix))]
fn process_exists(pid: u32) -> bool {
    // Replaced by the Windows Job-object strategy before Windows GA.
    pid == std::process::id()
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct LockOwner {
    run_id: String,
    pid: u32,
    started_at: String,
}

pub struct ProjectLock {
    root: PathBuf,
    path: PathBuf,
    owner: LockOwner,
    released: bool,
}

impl ProjectLock {
    pub fn acquire(root: &Path, run_id: &str, started_at: &str) -> Result<Self, LifecycleError> {
        checked_id(run_id)?;
        let path = root.join(".supercov/locks/active.json");
        let parent = path.parent().expect("lock parent");
        reject_linked_ancestors(root, parent, true)?;
        fs::create_dir_all(parent).map_err(|source| io_error(parent, source))?;
        // Direct frontends do not create an isolated workspace. Initialize
        // the store's ignore file here as well, without replacing user rules
        // or following a pre-existing symlink.
        let ignore = root.join(".supercov/.gitignore");
        match OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&ignore)
        {
            Ok(mut file) => file
                .write_all(b"*\n")
                .map_err(|source| io_error(&ignore, source))?,
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {}
            Err(source) => return Err(io_error(&ignore, source)),
        }
        let owner = LockOwner {
            run_id: run_id.into(),
            pid: std::process::id(),
            started_at: started_at.into(),
        };
        let mut payload = serde_json::to_vec_pretty(&owner).map_err(LifecycleError::Metadata)?;
        payload.push(b'\n');
        for _ in 0..2 {
            match OpenOptions::new().write(true).create_new(true).open(&path) {
                Ok(mut file) => {
                    file.write_all(&payload)
                        .and_then(|_| file.sync_all())
                        .map_err(|source| io_error(&path, source))?;
                    sync_directory(parent)?;
                    return Ok(Self {
                        root: root.to_owned(),
                        path,
                        owner,
                        released: false,
                    });
                }
                Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {
                    let existing = fs::read(&path)
                        .ok()
                        .and_then(|bytes| serde_json::from_slice::<LockOwner>(&bytes).ok());
                    if let Some(existing) = existing {
                        if process_exists(existing.pid) {
                            return Err(LifecycleError::ActiveRun {
                                run_id: existing.run_id,
                                pid: existing.pid,
                            });
                        }
                    } else {
                        let age = fs::metadata(&path)
                            .and_then(|metadata| metadata.modified())
                            .ok()
                            .and_then(|modified| SystemTime::now().duration_since(modified).ok())
                            .unwrap_or_default();
                        if age < INCOMPLETE_LOCK_GRACE {
                            return Err(LifecycleError::LockAcquiring);
                        }
                    }
                    fs::remove_file(&path).map_err(|source| io_error(&path, source))?;
                }
                Err(source) => return Err(io_error(&path, source)),
            }
        }
        Err(LifecycleError::LockUnavailable)
    }

    pub fn release(&mut self) -> Result<(), LifecycleError> {
        if self.released {
            return Ok(());
        }
        self.released = true;
        let owned = fs::read(&self.path)
            .ok()
            .and_then(|bytes| serde_json::from_slice::<LockOwner>(&bytes).ok())
            .is_some_and(|owner| owner == self.owner);
        if owned {
            fs::remove_file(&self.path).map_err(|source| io_error(&self.path, source))?;
        }
        Ok(())
    }

    pub(crate) fn protects(&self, root: &Path) -> bool {
        !self.released && self.root == root
    }
}

impl Drop for ProjectLock {
    fn drop(&mut self) {
        let _ = self.release();
    }
}

fn copy_regular_file(source: &Path, destination: &Path) -> Result<u64, LifecycleError> {
    let metadata = fs::symlink_metadata(source).map_err(|error| io_error(source, error))?;
    if !metadata.file_type().is_file() {
        return Err(LifecycleError::UnsafePath(source.into()));
    }
    // A clone where the filesystem can make one (APFS, Btrfs, XFS): the
    // archive's blocks are shared, not copied -- 150 MB on a large run --
    // and the clone is the source as it was at that instant.
    if reflink_copy::reflink(source, destination).is_ok() {
        File::open(destination)
            .and_then(|file| file.sync_all())
            .map_err(|error| io_error(destination, error))?;
        return fs::symlink_metadata(destination)
            .map(|metadata| metadata.len())
            .map_err(|error| io_error(destination, error));
    }
    let mut input = File::open(source).map_err(|error| io_error(source, error))?;
    let mut output = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(destination)
        .map_err(|error| io_error(destination, error))?;
    let copied = io::copy(&mut input, &mut output).map_err(|error| io_error(destination, error))?;
    output
        .sync_all()
        .map_err(|error| io_error(destination, error))?;
    Ok(copied)
}

fn file_sha256(path: &Path) -> Result<[u8; 32], LifecycleError> {
    let metadata = fs::symlink_metadata(path).map_err(|source| io_error(path, source))?;
    if !metadata.file_type().is_file() {
        return Err(LifecycleError::UnsafePath(path.into()));
    }
    let mut file = File::open(path).map_err(|source| io_error(path, source))?;
    let mut hash = Sha256::new();
    let mut buffer = [0_u8; 128 * 1024];
    loop {
        let read = file
            .read(&mut buffer)
            .map_err(|source| io_error(path, source))?;
        if read == 0 {
            break;
        }
        hash.update(&buffer[..read]);
    }
    Ok(hash.finalize().into())
}

fn hex_digest(digest: &[u8; 32]) -> String {
    use std::fmt::Write as _;
    digest
        .iter()
        .fold(String::with_capacity(64), |mut text, byte| {
            let _ = write!(text, "{byte:02x}");
            text
        })
}

/// Publish immutable run evidence and its initial assertion map/state together.
pub fn publish_run(
    root: &Path,
    metadata: &RunMetadata,
    evidence_source: &Path,
) -> Result<PathBuf, LifecycleError> {
    publish_run_with_fault(root, metadata, evidence_source, Archived::default(), None)
}

/// What a frontend that still holds the run it archived hands publication,
/// so it need not read the archive back: the analysis of the archived
/// request, and the assertion inputs archived beside it. Each must be what
/// the archive gives; a frontend that cannot say so leaves it out.
#[derive(Default)]
pub struct Archived {
    pub report: Option<crate::coverage_report::CoverageReport>,
    pub inputs: Option<crate::assertion_map::InputManifest>,
}

/// `publish_run` for a frontend that holds what it archived; see `Archived`.
pub fn publish_archived_run(
    root: &Path,
    metadata: &RunMetadata,
    evidence_source: &Path,
    archived: Archived,
) -> Result<PathBuf, LifecycleError> {
    publish_run_with_fault(root, metadata, evidence_source, archived, None)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RunPublicationFault {
    FinalRename,
    /// The query index cannot be written at publication.
    QueryIndexWrite,
}

pub(crate) fn publish_run_with_fault(
    root: &Path,
    metadata: &RunMetadata,
    evidence_source: &Path,
    archived: Archived,
    fault: Option<RunPublicationFault>,
) -> Result<PathBuf, LifecycleError> {
    checked_id(&metadata.id)?;
    let destination = root.join(".supercov/runs").join(&metadata.id);
    reject_linked_ancestors(root, &destination, false)?;
    if fs::symlink_metadata(&destination).is_ok() {
        return Err(LifecycleError::PublicationExists(metadata.id.clone()));
    }
    let staging = root
        .join(".supercov/work")
        .join(&metadata.id)
        .join("run-publication");
    reject_linked_ancestors(root, &staging, true)?;
    if fs::symlink_metadata(&staging).is_ok() {
        remove_stored_tree_deferred(root, &staging)?;
    }
    let evidence_sha256 = file_sha256(evidence_source)?;
    fs::create_dir_all(&staging).map_err(|source| io_error(&staging, source))?;
    let copied = copy_regular_file(evidence_source, &staging.join("evidence.raw.gz"))?;
    if copied != metadata.raw_evidence.compressed_bytes {
        remove_stored_tree_deferred(root, &staging)?;
        return Err(LifecycleError::EvidenceLength {
            expected: metadata.raw_evidence.compressed_bytes,
            actual: copied,
        });
    }
    // What is published is the copy: it must be the evidence as hashed
    // before it was taken.
    if file_sha256(&staging.join("evidence.raw.gz"))? != evidence_sha256 {
        remove_stored_tree_deferred(root, &staging)?;
        return Err(LifecycleError::EvidenceChanged);
    }
    let mut json = serde_json::to_vec_pretty(metadata).map_err(LifecycleError::Metadata)?;
    json.push(b'\n');
    atomic_write(root, &staging.join("run.json"), &json)?;
    // Everything publication derives from the evidence -- the assertion map's
    // record of what each test ran, the summary `runs latest` shows, the query
    // index -- comes from one analysis of it, made here. Each used to analyse
    // the archive on its own: once here, twice more in the first query after
    // the run, and on a 3,900-test Python suite each analysis took 5 to 8
    // seconds. Evidence that will not analyse is published as before; the
    // first query then reports why.
    let staged = crate::run_store::StoredRun {
        id: metadata.id.clone(),
        directory: staging.clone(),
        evidence_path: staging.join("evidence.raw.gz"),
        metadata_path: staging.join("run.json"),
        query_index_path: staging.join(crate::run_store::RUST_QUERY_INDEX_FILE),
        metadata: metadata.clone(),
    };
    let analysed = if metadata.merged == Some(true) {
        None
    } else if archived.report.is_some() {
        archived.report
    } else {
        crate::run_store::analyze_stored_run(&staged).ok()
    };
    let archived_inputs = match archived
        .inputs
        .map(|manifest| {
            crate::assertion_store::archived_manifest(manifest, hex_digest(&evidence_sha256))
        })
        .transpose()
    {
        Ok(inputs) => inputs,
        Err(reason) => {
            let _ = remove_stored_tree_deferred(root, &staging);
            return Err(LifecycleError::InvalidState(format!(
                "assertion map publication: {reason}"
            )));
        }
    };
    // The assertion map and the query index both read the analysis and
    // write their own files, so they are written side by side.
    let prepared = std::thread::scope(|scope| {
        let index = analysed.as_ref().map(|report| {
            scope.spawn(|| {
                // Disposable, like every query index: one that failed to
                // write is rebuilt by the first query.
                if fault == Some(RunPublicationFault::QueryIndexWrite)
                    || crate::run_store::write_query_index_from(&staged, report).is_err()
                {
                    let _ = fs::remove_file(&staged.query_index_path);
                }
            })
        });
        let prepared = crate::assertion_store::prepare_publication_with(
            root,
            &staging,
            metadata,
            analysed.as_ref(),
            archived_inputs,
        );
        if let Some(index) = index {
            index
                .join()
                .unwrap_or_else(|panic| std::panic::resume_unwind(panic));
        }
        prepared
    });
    // Everything publication derives from the analysis is written. It is
    // gigabytes of small allocations on a large run, and freeing them is
    // nobody's wait.
    if let Some(report) = analysed {
        std::thread::spawn(move || drop(report));
    }
    if let Err(reason) = prepared {
        let _ = remove_stored_tree_deferred(root, &staging);
        return Err(LifecycleError::InvalidState(format!(
            "assertion map publication: {reason}"
        )));
    }
    sync_directory(&staging)?;
    let runs = destination.parent().expect("runs parent");
    fs::create_dir_all(runs).map_err(|source| io_error(runs, source))?;
    if fault == Some(RunPublicationFault::FinalRename) {
        let error = io_error(
            &destination,
            io::Error::new(
                io::ErrorKind::PermissionDenied,
                "injected final run publication rename failure",
            ),
        );
        let _ = remove_stored_tree_deferred(root, &staging);
        return Err(error);
    }
    fs::rename(&staging, &destination).map_err(|source| io_error(&destination, source))?;
    sync_directory(runs)?;
    Ok(destination)
}

/// Read a published run's start timestamp for retention ordering. Runs whose
/// metadata is missing or unreadable sort as oldest, matching the run inventory,
/// which leaves such directories out of its listing altogether.
fn published_started_at(root: &Path, id: &str) -> String {
    let directory = root.join(".supercov/runs").join(id);
    fs::read(directory.join("run.json"))
        .ok()
        .and_then(|bytes| serde_json::from_slice::<serde_json::Value>(&bytes).ok())
        .as_ref()
        .and_then(|value| value.get("startedAt"))
        .and_then(|value| value.as_str())
        .unwrap_or_default()
        .to_owned()
}

fn published_run(root: &Path, id: &str) -> bool {
    let directory = root.join(".supercov/runs").join(id);
    let metadata = fs::read(directory.join("run.json"))
        .ok()
        .and_then(|bytes| serde_json::from_slice::<serde_json::Value>(&bytes).ok());
    metadata
        .as_ref()
        .and_then(|value| value.get("id"))
        .and_then(|value| value.as_str())
        == Some(id)
        && fs::symlink_metadata(directory.join("evidence.raw.gz"))
            .is_ok_and(|metadata| metadata.file_type().is_file())
}

pub fn finalize_published_run(root: &Path, id: &str) -> Result<bool, LifecycleError> {
    checked_id(id)?;
    if !published_run(root, id) {
        return Ok(false);
    }
    remove_stored_tree_deferred(root, &root.join(".supercov/evidence").join(id))?;
    remove_stored_tree_deferred(root, &root.join(".supercov/work").join(id))?;
    Ok(true)
}

fn child_directories(path: &Path) -> Result<Vec<String>, LifecycleError> {
    let root = path
        .ancestors()
        .find(|ancestor| ancestor.file_name().is_some_and(|name| name == ".supercov"))
        .and_then(Path::parent)
        .unwrap_or(path);
    reject_linked_ancestors(root, path, true)?;
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(source) => return Err(io_error(path, source)),
    };
    let mut names = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|source| io_error(path, source))?;
        let file_type = entry
            .file_type()
            .map_err(|source| io_error(&entry.path(), source))?;
        if file_type.is_symlink() {
            return Err(LifecycleError::UnsafePath(entry.path()));
        }
        if !file_type.is_dir() {
            continue;
        }
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| LifecycleError::UnsafePath(entry.path()))?;
        checked_id(&name)?;
        names.push(name);
    }
    names.sort();
    Ok(names)
}

/// Where a run's evidence is kept when Supercov could not publish it.
const FAILED_EVIDENCE: &str = ".supercov/failed-evidence";

/// Keep what a run measured when Supercov itself is what failed.
///
/// A suite pays for its measurement in wall clock, and the one that lost a run
/// to a phase reported twice had spent two and three-quarter hours on it. The
/// work directory goes when a run does not publish, and it held the only copy
/// of the evidence: nothing was left to diagnose the failure with, and nothing
/// to recover. The evidence is kept outside the work tree, where neither the
/// recovery sweep nor the next run reclaims it, and the failure says where.
///
/// Best effort by design: a run has already failed by the time this is called,
/// and being unable to keep the evidence must not replace the failure that
/// matters with one about copying it.
pub fn keep_failed_evidence(root: &Path, evidence: &Path, id: &str) -> Option<PathBuf> {
    if !evidence.is_dir() {
        return None;
    }
    let kept = root.join(FAILED_EVIDENCE).join(id);
    fs::create_dir_all(&kept).ok()?;
    let mut files = 0;
    if copy_evidence(evidence, &kept, &mut files).is_err() || files == 0 {
        // Nothing worth keeping, or nothing that could be: leave no empty
        // directory behind to puzzle over.
        let _ = fs::remove_dir_all(&kept);
        return None;
    }
    Some(kept)
}

/// Say where a failed run's evidence was kept, on the failure itself.
///
/// The user is looking at a Supercov bug at this point; the one thing they can
/// do about it is send the evidence, and they only will if the failure says
/// where it is. Returns the error unchanged when there was nothing to keep.
pub fn note_kept_evidence(root: &Path, evidence: &Path, id: &str, error: String) -> String {
    let Some(kept) = keep_failed_evidence(root, evidence, id) else {
        return error;
    };
    format!(
        "{error}\n[supercov] the tests were measured and the run could not be published; \
their evidence is kept at {} -- this is a Supercov bug, and that directory is what diagnoses it",
        kept.display()
    )
}

fn copy_evidence(source: &Path, destination: &Path, files: &mut usize) -> std::io::Result<()> {
    for entry in fs::read_dir(source)? {
        let entry = entry?;
        let target = destination.join(entry.file_name());
        if entry.file_type()?.is_dir() {
            fs::create_dir_all(&target)?;
            copy_evidence(&entry.path(), &target, files)?;
        } else {
            fs::copy(entry.path(), &target)?;
            *files += 1;
        }
    }
    Ok(())
}

pub fn recover_abandoned_runs(
    root: &Path,
    updated_at: &str,
) -> Result<Vec<String>, LifecycleError> {
    let mut recovered = Vec::new();
    for id in child_directories(&root.join(".supercov/work"))? {
        let Some(state) = read_state(root, &id)? else {
            continue;
        };
        if state.status.terminal() {
            finalize_published_run(root, &id)?;
            continue;
        }
        if process_exists(state.pid) {
            continue;
        }
        let workspace_name = root.file_name().unwrap_or_default();
        remove_stored_tree_deferred(
            root,
            &root.join(".supercov/work").join(&id).join(workspace_name),
        )?;
        remove_stored_tree_deferred(
            root,
            &root
                .join(".supercov/work")
                .join(&id)
                .join("run-publication"),
        )?;
        if !finalize_published_run(root, &id)? {
            remove_stored_tree_deferred(root, &root.join(".supercov/evidence").join(&id))?;
            update_run_state(
                root,
                &id,
                RunStateStatus::Abandoned,
                updated_at,
                Some(format!(
                    "Recovered after process {} exited without cleanup",
                    state.pid
                )),
            )?;
            remove_stored_tree_deferred(root, &root.join(".supercov/work").join(&id))?;
        }
        recovered.push(id);
    }
    recovered.sort();
    Ok(recovered)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CleanupOptions {
    pub keep: usize,
    pub dry_run: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CleanupResult {
    pub removed_runs: Vec<String>,
    pub removed_workspaces: Vec<String>,
    pub removed_evidence: Vec<String>,
    /// Evidence kept from runs Supercov itself failed to publish. Retention
    /// leaves it alone -- it is the only copy, and the automatic path taking it
    /// is what made a lost run unrecoverable -- but `clean` is the user asking
    /// for the project's storage back, so it goes then, and the summary says so.
    pub removed_failed_evidence: Vec<String>,
    pub removed_build_cache: bool,
}

pub fn cleanup_storage_locked(
    root: &Path,
    options: CleanupOptions,
    remove_build_cache: bool,
) -> Result<CleanupResult, LifecycleError> {
    let runs_root = root.join(".supercov/runs");
    let work_root = root.join(".supercov/work");
    let evidence_root = root.join(".supercov/evidence");
    let published = child_directories(&runs_root)?;
    let work = child_directories(&work_root)?;
    let evidence = child_directories(&evidence_root)?;
    let mut ids = published
        .iter()
        .chain(&work)
        .chain(&evidence)
        .cloned()
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();
    ids.sort_by(|left, right| right.cmp(left));
    let mut active = BTreeSet::new();
    for id in &ids {
        if read_state(root, id)?.is_some_and(|state| !state.status.terminal()) {
            active.insert(id.clone());
        }
    }
    let mut retention_order = published
        .iter()
        .filter(|id| !active.contains(*id))
        .map(|id| (published_started_at(root, id), id.clone()))
        .collect::<Vec<_>>();
    retention_order.sort_by(|left, right| right.0.cmp(&left.0).then_with(|| right.1.cmp(&left.1)));
    let retained = retention_order
        .into_iter()
        .take(options.keep)
        .map(|(_, id)| id)
        .collect::<BTreeSet<_>>();
    let mut result = CleanupResult {
        removed_runs: Vec::new(),
        removed_workspaces: Vec::new(),
        removed_evidence: Vec::new(),
        removed_failed_evidence: Vec::new(),
        removed_build_cache: false,
    };
    for id in ids {
        if active.contains(&id) {
            continue;
        }
        let has_run = published.contains(&id);
        let remove_history = has_run && !retained.contains(&id);
        if work.contains(&id) && read_state(root, &id)?.is_none_or(|state| state.status.terminal())
        {
            result.removed_workspaces.push(id.clone());
            if !options.dry_run {
                remove_stored_tree_deferred(root, &work_root.join(&id))?;
            }
        }
        if evidence.contains(&id) && (!has_run || remove_history) {
            result.removed_evidence.push(id.clone());
            if !options.dry_run {
                remove_stored_tree_deferred(root, &evidence_root.join(&id))?;
            }
        }
        if remove_history {
            result.removed_runs.push(id.clone());
            if !options.dry_run {
                remove_stored_tree_deferred(root, &runs_root.join(&id))?;
            }
        }
    }
    // Only a full `clean` reclaims kept evidence. `--keep N` is a trim, and the
    // evidence of a run Supercov failed to publish is the last thing a user
    // trimming their history means to lose; a retention pass would take it
    // within one run of keeping it.
    if remove_build_cache && options.keep == 0 && active.is_empty() {
        let kept_root = root.join(FAILED_EVIDENCE);
        for id in child_directories(&kept_root)? {
            result.removed_failed_evidence.push(id.clone());
            if !options.dry_run {
                remove_stored_tree_deferred(root, &kept_root.join(&id))?;
            }
        }
    }
    let container = crate::workspace::workspace_container(root);
    let legacy = [root.join(".supercov/.cache"), root.join(".supercov/cache")];
    let mut caches = Vec::new();
    let mut removed_cargo_cache = false;
    if remove_build_cache && active.is_empty() {
        if owned_workspace_container(root) {
            caches.push(container);
        }
        caches.extend(
            legacy
                .into_iter()
                .filter(|path| fs::symlink_metadata(path).is_ok()),
        );
        removed_cargo_cache = crate::workspace::clean_cargo_workspace(root, options.dry_run)
            .map_err(|error| {
                LifecycleError::InvalidState(format!(
                    "could not clean the owned Cargo workspace: {error}"
                ))
            })?;
    }
    result.removed_build_cache = removed_cargo_cache || !caches.is_empty();
    if !options.dry_run {
        for cache in caches {
            remove_stored_tree_deferred(root, &cache)?;
        }
    }
    Ok(result)
}

fn cleanup_storage(
    root: &Path,
    options: CleanupOptions,
    remove_build_cache: bool,
    updated_at: &str,
) -> Result<CleanupResult, LifecycleError> {
    let operation = if remove_build_cache {
        "clean"
    } else {
        "retention"
    };
    let lock_id = format!("{operation}-{}-{}", std::process::id(), unique_name());
    let mut lock = ProjectLock::acquire(root, &lock_id, updated_at)?;
    recover_abandoned_runs(root, updated_at)?;
    let result = cleanup_storage_locked(root, options, remove_build_cache);
    lock.release()?;
    result
}

pub fn clean_storage(
    root: &Path,
    options: CleanupOptions,
    updated_at: &str,
) -> Result<CleanupResult, LifecycleError> {
    cleanup_storage(root, options, true, updated_at)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::run_store::{RawEvidenceMetadata, RunFingerprint, RunIntegrity};

    fn project() -> PathBuf {
        let root = std::env::temp_dir().join(format!("supercov-lifecycle-{}", unique_name()));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(root.join("src/index.js"), "user source").unwrap();
        root
    }

    fn kept_evidence(root: &Path, id: &str) -> PathBuf {
        let evidence = root.join(".supercov/work").join(id).join("python/evidence");
        fs::create_dir_all(&evidence).unwrap();
        fs::write(evidence.join("main.jsonl"), "what the run saw").unwrap();
        keep_failed_evidence(root, &evidence, id).expect("the evidence")
    }

    fn state(root: &Path, id: &str, status: RunStateStatus, pid: u32) -> RunState {
        RunState {
            id: id.into(),
            pid,
            root: root.display().to_string(),
            workspace: root.join("dist").display().to_string(),
            started_at: "start".into(),
            updated_at: "update".into(),
            status,
            signal: None,
            error: None,
        }
    }

    fn metadata(id: &str, bytes: u64) -> RunMetadata {
        RunMetadata {
            id: id.into(),
            started_at: "2026-01-01T00:00:00Z".into(),
            duration_ms: 1.0,
            command: vec!["test".into()],
            test_exit_code: Some(0),
            integrity: RunIntegrity {
                schema_version: 2,
                instrumenter_version: "rust".into(),
                git: None,
                fingerprint: RunFingerprint {
                    algorithm: "sha256".into(),
                    source: "0".repeat(64),
                    tests: "0".repeat(64),
                    dependencies: "0".repeat(64),
                    configuration: "0".repeat(64),
                    instrumenter: "0".repeat(64),
                    execution: "0".repeat(64),
                    combined: "0".repeat(64),
                    source_files: 1,
                    test_files: 1,
                },
                stale: None,
                stale_reasons: None,
            },
            raw_evidence: RawEvidenceMetadata {
                schema_version: 2,
                format: "supercov-evidence-archive".into(),
                file: "evidence.raw.gz".into(),
                files: 1,
                uncompressed_bytes: bytes,
                compressed_bytes: bytes,
            },
            isolated_build: None,
            instrumented_build_cache: None,
            timings: None,
            merged: None,
            parents: None,
            source_roots: None,
        }
    }

    fn evidence(root: &Path) -> (PathBuf, u64) {
        use crate::evidence_archive::{EvidenceArchiveEntry, write_archive};
        let mut entries = ["manifest.json", "frontend.json", "coverage-model.json"]
            .into_iter()
            .map(|path| EvidenceArchiveEntry {
                path: path.into(),
                contents: b"{}".to_vec(),
            })
            .collect::<Vec<_>>();
        let inputs =
            crate::assertion_inputs::capture(root, "javascript", [PathBuf::from("src/index.js")])
                .unwrap();
        entries = crate::assertion_inputs::append(entries, &inputs).unwrap();
        let path = root.join("evidence.gz");
        let metadata = write_archive(entries, &path).unwrap();
        (path, metadata.compressed_bytes)
    }

    #[test]
    fn defers_only_owned_storage_and_sweeps_without_touching_source() {
        let root = project();
        let owned = root.join(".supercov/evidence/run");
        fs::create_dir_all(&owned).unwrap();
        fs::write(owned.join("hit"), "hit").unwrap();
        let trash = remove_stored_tree_deferred(&root, &owned).unwrap().unwrap();
        assert!(!owned.exists());
        assert!(trash.exists());
        assert!(matches!(
            remove_stored_tree_deferred(&root, &root.join("src")),
            Err(LifecycleError::UnsafePath(_))
        ));
        assert_eq!(sweep_trash(&root).unwrap(), 1);
        assert!(root.join("src/index.js").exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn refuses_linked_storage_ancestors_instead_of_renaming_external_data() {
        use std::os::unix::fs::symlink;

        let root = project();
        let outside = project();
        fs::create_dir_all(root.join(".supercov")).unwrap();
        fs::create_dir_all(outside.join("run")).unwrap();
        fs::write(outside.join("run/user.txt"), "user").unwrap();
        symlink(&outside, root.join(".supercov/evidence")).unwrap();
        assert!(matches!(
            remove_stored_tree_deferred(&root, &root.join(".supercov/evidence/run")),
            Err(LifecycleError::UnsafePath(_))
        ));
        assert_eq!(
            fs::read_to_string(outside.join("run/user.txt")).unwrap(),
            "user"
        );
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(outside).unwrap();
    }

    /// Evidence that analyses -- the analysable fixture run -- to publish as
    /// `id`, from outside the project's runs.
    fn analysable_evidence(root: &Path, id: &str) -> (PathBuf, RunMetadata) {
        let source = project();
        let directory = crate::run_store::create_analyzable_test_run(&source, "source");
        let evidence = root.join(format!("{id}.evidence.gz"));
        fs::copy(directory.join("evidence.raw.gz"), &evidence).unwrap();
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(directory.join("run.json")).unwrap()).unwrap();
        metadata.id = id.into();
        fs::remove_dir_all(source).unwrap();
        (evidence, metadata)
    }

    /// The published run as a query reads it.
    fn stored(root: &Path, id: &str) -> crate::run_store::StoredRun {
        let directory = root.join(".supercov/runs").join(id);
        crate::run_store::StoredRun {
            id: id.into(),
            evidence_path: directory.join("evidence.raw.gz"),
            metadata_path: directory.join("run.json"),
            query_index_path: directory.join(crate::run_store::RUST_QUERY_INDEX_FILE),
            metadata: serde_json::from_slice(&fs::read(directory.join("run.json")).unwrap())
                .unwrap(),
            directory,
        }
    }

    #[test]
    fn publication_writes_the_query_index_a_first_query_would_have_built() {
        // Written beside staged evidence and renamed with it, the index must be
        // the one the first query builds from the published evidence -- the
        // same bytes, valid under the published run's identity.
        let root = project();
        let id = "2026-01-01T00-00-00-100Z";
        let (evidence, metadata) = analysable_evidence(&root, id);
        let published = publish_run(&root, &metadata, &evidence).unwrap();
        let index = published.join(crate::run_store::RUST_QUERY_INDEX_FILE);
        assert!(index.is_file(), "publication wrote the index");
        let run = stored(&root, id);
        assert!(
            crate::run_store::open_existing_query_index(&run)
                .unwrap()
                .is_some(),
            "and it is valid for the published run"
        );
        let written = fs::read(&index).unwrap();
        fs::remove_file(&index).unwrap();
        crate::run_store::open_or_rebuild_query_index(&run).unwrap();
        assert_eq!(
            fs::read(&index).unwrap(),
            written,
            "a query rebuilds the same bytes"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn evidence_that_will_not_analyse_is_published_as_it_was_before() {
        // Publication used to tolerate evidence it could not analyse and leave
        // the first query to report why. It still publishes it, writes neither
        // index nor summary, and the first query fails as it did.
        let root = project();
        let id = "2026-01-01T00-00-00-200Z";
        let (evidence, bytes) = evidence(&root);
        let published = publish_run(&root, &metadata(id, bytes), &evidence).unwrap();
        assert!(published.join("run.json").is_file());
        assert!(published.join("assertions.json").is_file());
        assert!(
            !published
                .join(crate::run_store::RUST_QUERY_INDEX_FILE)
                .exists()
        );
        assert!(!published.join("assertions.summary.cache.json").exists());
        let run = stored(&root, id);
        let Err(query) = crate::run_store::open_or_rebuild_query_index(&run) else {
            panic!("the first query cannot analyse it either");
        };
        let direct = crate::run_store::analyze_stored_run(&run).expect_err("unanalysable");
        assert_eq!(
            query.to_string(),
            direct.to_string(),
            "and says why in the same words"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_merged_run_is_indexed_by_its_first_query() {
        // Publication does not analyse a merged run; its first query does.
        let root = project();
        let id = "2026-01-01T00-00-00-300Z";
        let (evidence, mut metadata) = analysable_evidence(&root, id);
        metadata.merged = Some(true);
        let published = publish_run(&root, &metadata, &evidence).unwrap();
        let index = published.join(crate::run_store::RUST_QUERY_INDEX_FILE);
        assert!(!index.exists());
        crate::run_store::open_or_rebuild_query_index(&stored(&root, id)).unwrap();
        assert!(index.is_file());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn an_index_that_could_not_be_written_is_built_by_the_first_query() {
        // A failed index write loses nothing: publication succeeds without a
        // partial file, and the first query builds the index as it used to.
        let root = project();
        let id = "2026-01-01T00-00-00-400Z";
        let (evidence, metadata) = analysable_evidence(&root, id);
        let published = publish_run_with_fault(
            &root,
            &metadata,
            &evidence,
            Archived::default(),
            Some(RunPublicationFault::QueryIndexWrite),
        )
        .unwrap();
        let index = published.join(crate::run_store::RUST_QUERY_INDEX_FILE);
        assert!(!index.exists(), "no partial index is left");
        assert!(published.join("run.json").is_file());
        crate::run_store::open_or_rebuild_query_index(&stored(&root, id)).unwrap();
        assert!(index.is_file());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn publishes_both_required_files_with_one_visible_rename() {
        let root = project();
        let id = "2026-01-01T00-00-00-000Z";
        let (evidence, bytes) = evidence(&root);
        let published = publish_run(&root, &metadata(id, bytes), &evidence).unwrap();
        assert!(published.join("run.json").is_file());
        assert_eq!(
            fs::read(published.join("evidence.raw.gz")).unwrap(),
            fs::read(&evidence).unwrap()
        );
        assert!(published.join("assertions.json").is_file());
        assert!(published.join("assertions.state.json").is_file());
        assert!(matches!(
            publish_run(&root, &metadata(id, bytes), &evidence),
            Err(LifecycleError::PublicationExists(_))
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn final_rename_failure_exposes_no_run_and_removes_staging() {
        let root = project();
        let id = "2026-01-01T00-00-00-000Z";
        let (evidence, bytes) = evidence(&root);
        let error = publish_run_with_fault(
            &root,
            &metadata(id, bytes),
            &evidence,
            Archived::default(),
            Some(RunPublicationFault::FinalRename),
        )
        .unwrap_err();
        assert!(
            error
                .to_string()
                .contains("injected final run publication rename failure")
        );
        assert!(!root.join(".supercov/runs").join(id).exists());
        assert!(
            !root
                .join(".supercov/work")
                .join(id)
                .join("run-publication")
                .exists()
        );
        sweep_trash(&root).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn malformed_assertion_inputs_expose_no_partial_run() {
        use crate::evidence_archive::{read_archive, write_archive};
        let root = project();
        let id = "2026-01-01T00-00-00-000Z";
        let (evidence, _) = evidence(&root);
        let mut entries = read_archive(&evidence).unwrap();
        entries
            .iter_mut()
            .find(|e| e.path == crate::assertion_inputs::ARCHIVE_PATH)
            .unwrap()
            .contents = b"{broken".to_vec();
        let raw = write_archive(entries, &evidence).unwrap();
        let error = publish_run(&root, &metadata(id, raw.compressed_bytes), &evidence).unwrap_err();
        assert!(error.to_string().contains("assertion map publication"));
        assert!(!root.join(".supercov/runs").join(id).exists());
        assert!(
            !root
                .join(".supercov/work")
                .join(id)
                .join("run-publication")
                .exists()
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn recovers_dead_unpublished_and_fully_published_runs_from_derived_paths() {
        let root = project();
        let dead = "2026-01-01T00-00-00-000Z";
        let published = "2026-01-02T00-00-00-000Z";
        for id in [dead, published] {
            fs::create_dir_all(
                root.join(".supercov/work")
                    .join(id)
                    .join(root.file_name().unwrap()),
            )
            .unwrap();
            fs::create_dir_all(root.join(".supercov/evidence").join(id)).unwrap();
            write_run_state(&root, &state(&root, id, RunStateStatus::Testing, u32::MAX)).unwrap();
        }
        let (evidence, bytes) = evidence(&root);
        publish_run(&root, &metadata(published, bytes), &evidence).unwrap();
        assert_eq!(
            recover_abandoned_runs(&root, "recovered").unwrap(),
            [dead, published]
        );
        assert!(!root.join(".supercov/work").join(dead).exists());
        assert!(!root.join(".supercov/work").join(published).exists());
        assert!(root.join(".supercov/runs").join(published).exists());
        assert!(root.join("src/index.js").exists());
        sweep_trash(&root).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn retention_is_deterministic_dry_run_safe_and_preserves_active_work() {
        let root = project();
        let ids = [
            "2026-01-01T00-00-00-000Z",
            "2026-01-02T00-00-00-000Z",
            "2026-01-03T00-00-00-000Z",
        ];
        for id in ids {
            fs::create_dir_all(root.join(".supercov/runs").join(id)).unwrap();
            write_run_state(
                &root,
                &state(&root, id, RunStateStatus::Complete, std::process::id()),
            )
            .unwrap();
        }
        let active = "2025-12-31T00-00-00-000Z";
        write_run_state(
            &root,
            &state(&root, active, RunStateStatus::Testing, std::process::id()),
        )
        .unwrap();
        let preview = cleanup_storage_locked(
            &root,
            CleanupOptions {
                keep: 1,
                dry_run: true,
            },
            false,
        )
        .unwrap();
        assert_eq!(preview.removed_runs, [ids[1], ids[0]]);
        assert!(
            ids.iter()
                .all(|id| root.join(".supercov/runs").join(id).exists())
        );
        let result = cleanup_storage_locked(
            &root,
            CleanupOptions {
                keep: 1,
                dry_run: false,
            },
            false,
        )
        .unwrap();
        assert_eq!(result, preview);
        assert!(root.join(".supercov/work").join(active).exists());
        assert!(root.join(".supercov/runs").join(ids[2]).exists());
        sweep_trash(&root).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn retention_keeps_the_newest_runs_when_run_ids_disagree_with_recency() {
        let root = project();
        let (evidence, bytes) = evidence(&root);
        // Run IDs are random hex, so ordering them as strings says nothing about
        // time. The newest run here carries the smallest ID and must survive.
        for (id, started_at) in [
            ("run_ffffffffffffffff", "2026-01-01T00:00:00Z"),
            ("run_7777777777777777", "2026-05-01T00:00:00Z"),
            ("run_0000000000000001", "2026-09-01T00:00:00Z"),
        ] {
            let mut run = metadata(id, bytes);
            run.started_at = started_at.into();
            publish_run(&root, &run, &evidence).unwrap();
        }
        let result = cleanup_storage_locked(
            &root,
            CleanupOptions {
                keep: 1,
                dry_run: false,
            },
            false,
        )
        .unwrap();
        assert_eq!(
            result.removed_runs,
            ["run_ffffffffffffffff", "run_7777777777777777"]
        );
        assert!(
            root.join(".supercov/runs")
                .join("run_0000000000000001")
                .exists()
        );
        sweep_trash(&root).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn direct_runs_initialize_store_ignore_without_overwriting_existing_rules() {
        let root = project();
        let ignore = root.join(".supercov/.gitignore");
        let mut lock = ProjectLock::acquire(&root, "first", "start").unwrap();
        assert_eq!(fs::read_to_string(&ignore).unwrap(), "*\n");
        lock.release().unwrap();
        fs::write(&ignore, "custom\n").unwrap();
        let mut lock = ProjectLock::acquire(&root, "second", "start").unwrap();
        assert_eq!(fs::read_to_string(&ignore).unwrap(), "custom\n");
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cleanup_is_project_locked_and_clean_alone_removes_owned_caches() {
        let root = project();
        let container = root.join(".supercov/workspaces");
        fs::create_dir_all(container.join("workspace/project")).unwrap();
        fs::write(
            container.join(".supercov-workspace-store"),
            b"Supercov instrumented workspace. Safe to delete.\n",
        )
        .unwrap();
        fs::create_dir_all(root.join(".supercov/cache/legacy")).unwrap();
        let mut preparation = ProjectLock::acquire(&root, "prepare", "start").unwrap();
        crate::workspace::prepare_cargo_cached_workspace(&root, &preparation).unwrap();
        let cargo_container = crate::workspace::cargo_workspace_container(&root).unwrap();
        preparation.release().unwrap();

        let mut active = ProjectLock::acquire(&root, "active", "start").unwrap();
        assert!(matches!(
            clean_storage(
                &root,
                CleanupOptions {
                    keep: 0,
                    dry_run: false
                },
                "now"
            ),
            Err(LifecycleError::ActiveRun { .. })
        ));
        assert!(container.exists());
        assert!(cargo_container.exists());
        active.release().unwrap();

        let cleaned = clean_storage(
            &root,
            CleanupOptions {
                keep: 0,
                dry_run: false,
            },
            "now",
        )
        .unwrap();
        assert!(cleaned.removed_build_cache);
        assert!(!container.exists());
        assert!(!cargo_container.exists());
        assert!(!root.join(".supercov/cache").exists());
        sweep_trash(&root).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    // What a failed run measured is the only record of hours of test time, and
    // it lived in the work tree that failing removes. #40 lost a run to a phase
    // reported twice after two and three-quarter hours, with nothing left to
    // diagnose it from.
    #[test]
    fn evidence_a_failed_run_measured_outlives_the_work_tree() {
        let root = project();
        let work = root.join(".supercov/work/run_kept");
        let evidence = work.join("python/evidence");
        fs::create_dir_all(evidence.join("worker-1")).unwrap();
        fs::write(evidence.join("main.jsonl"), "what the run saw").unwrap();
        fs::write(evidence.join("worker-1/mcdc.json"), "{}").unwrap();

        let kept = keep_failed_evidence(&root, &evidence, "run_kept").expect("the evidence");
        remove_stored_tree_deferred(&root, &work).unwrap();
        sweep_trash(&root).unwrap();

        assert!(!evidence.exists(), "the work tree still went");
        assert_eq!(
            fs::read_to_string(kept.join("main.jsonl")).unwrap(),
            "what the run saw",
        );
        // Nested workers are evidence too: a run measured by several of them
        // cannot be diagnosed from one.
        assert_eq!(
            fs::read_to_string(kept.join("worker-1/mcdc.json")).unwrap(),
            "{}"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn nothing_to_keep_leaves_no_directory_to_puzzle_over() {
        let root = project();
        // A run that failed before it measured anything: the frontend never
        // reached the point of writing evidence, or wrote none.
        let missing = root.join(".supercov/work/run_early/python/evidence");
        assert!(keep_failed_evidence(&root, &missing, "run_early").is_none());
        fs::create_dir_all(&missing).unwrap();
        assert!(keep_failed_evidence(&root, &missing, "run_early").is_none());
        assert!(
            !root.join(".supercov/failed-evidence/run_early").exists(),
            "an empty directory is worse than none: it reads as evidence",
        );
        fs::remove_dir_all(root).unwrap();
    }

    // The failure is the only thing the user reads. Keeping the evidence and
    // not saying where is the same as not keeping it.
    #[test]
    fn the_failure_says_where_the_evidence_was_kept() {
        let root = project();
        let evidence = root.join(".supercov/work/run_told/python/evidence");
        fs::create_dir_all(&evidence).unwrap();
        fs::write(evidence.join("main.jsonl"), "what the run saw").unwrap();

        let told = note_kept_evidence(&root, &evidence, "run_told", "boom".into());
        // Taken from the keeper rather than spelled out here: a path written as
        // one string renders every separator the same way, which is not what a
        // Windows path built join by join looks like, so asserting on the
        // spelling tested this test instead of the message. Keeping is
        // idempotent, so asking again names the directory already kept.
        let kept = keep_failed_evidence(&root, &evidence, "run_told").expect("the evidence");
        assert_eq!(kept, root.join(FAILED_EVIDENCE).join("run_told"));
        assert!(
            told.starts_with("boom\n"),
            "the failure itself came second: {told}"
        );
        assert!(told.contains(&kept.display().to_string()), "{told}");

        // Nothing kept, nothing to say: the failure that matters is not buried
        // under one about copying it.
        let nothing = root.join(".supercov/work/run_empty/python/evidence");
        assert_eq!(
            note_kept_evidence(&root, &nothing, "run_empty", "boom".into()),
            "boom",
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_trim_leaves_kept_evidence_alone() {
        let root = project();
        let kept = kept_evidence(&root, "run_trimmed");

        // `--keep N` is the user trimming history, not asking for a reset, and
        // a retention pass runs on its own: either taking the evidence would
        // undo the keeping within one run.
        clean_storage(
            &root,
            CleanupOptions {
                keep: 20,
                dry_run: false,
            },
            "now",
        )
        .unwrap();
        let retention = cleanup_storage_locked(
            &root,
            CleanupOptions {
                keep: 0,
                dry_run: false,
            },
            false,
        )
        .unwrap();
        sweep_trash(&root).unwrap();

        assert!(retention.removed_failed_evidence.is_empty());
        assert!(kept.join("main.jsonl").exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cleaning_everything_reclaims_kept_evidence_and_says_which() {
        let root = project();
        let kept = kept_evidence(&root, "run_cleaned");

        let preview = clean_storage(
            &root,
            CleanupOptions {
                keep: 0,
                dry_run: true,
            },
            "now",
        )
        .unwrap();
        assert_eq!(
            preview.removed_failed_evidence,
            vec!["run_cleaned".to_string()]
        );
        assert!(kept.join("main.jsonl").exists(), "a preview removed it");

        let result = clean_storage(
            &root,
            CleanupOptions {
                keep: 0,
                dry_run: false,
            },
            "now",
        )
        .unwrap();
        sweep_trash(&root).unwrap();

        // Removing it is irreversible and it is not a run, so the summary has
        // to name it rather than fold it into the run count.
        assert_eq!(
            result.removed_failed_evidence,
            vec!["run_cleaned".to_string()]
        );
        assert!(!kept.exists());
        fs::remove_dir_all(root).unwrap();
    }
}
