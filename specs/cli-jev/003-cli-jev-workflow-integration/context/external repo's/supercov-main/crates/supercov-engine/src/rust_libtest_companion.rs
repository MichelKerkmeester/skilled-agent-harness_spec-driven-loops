//! Deterministic source preparation for Supercov's exact-toolchain libtest
//! companion.
//!
//! Published Supercov platform packages will contain the already-built rlib.
//! This module is the release/development builder: it consumes the selected
//! toolchain's exact `library/test` source, rejects unrecognized layouts, and
//! atomically publishes a patched tree whose identity contains no scratch
//! paths.

use std::{
    ffi::OsString,
    fs::{self, OpenOptions},
    io::{Cursor, Write},
    path::{Component, Path, PathBuf},
    process::Command,
    thread,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

use ar_archive_writer::{
    ArchiveKind as WritableArchiveKind, DEFAULT_OBJECT_READER, NewArchiveMember,
    write_archive_to_stream,
};
use object::read::archive::{ArchiveFile, ArchiveKind as ReadableArchiveKind};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use supercov_contracts::{
    RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION, RUST_LIBTEST_EVENT_PROTOCOL_VERSION,
    RustCompilerIdentity,
};

use crate::{
    rust_compiler_selection::{
        SelectedRustCompilerCompanion, probe_rustc_identity, select_rust_compiler_companion,
    },
    rust_libtest_events::rust_libtest_event_runtime_source,
};

const SOURCE_IDENTITY_FILE: &str = "supercov-libtest-source.json";
const BUILD_LOCK_TIMEOUT: Duration = Duration::from_secs(300);

const LIB_ANCHOR: &str = "mod console;";
const LIB_REPLACEMENT: &str = "mod console;\nmod supercov_events;";
const CONSOLE_ANCHOR: &str = "fn on_test_event(\n    event: &TestEvent,\n    st: &mut ConsoleTestState,\n    out: &mut dyn OutputFormatter,\n) -> io::Result<()> {\n    match (*event).clone() {";
const CONSOLE_REPLACEMENT: &str = "fn on_test_event(\n    event: &TestEvent,\n    st: &mut ConsoleTestState,\n    out: &mut dyn OutputFormatter,\n) -> io::Result<()> {\n    crate::supercov_events::emit(event)?;\n    match (*event).clone() {";
const LISTING_ANCHOR: &str =
    "    out.write_discovery_start()?;\n    for test in filter_tests(opts, tests).into_iter() {";
const LISTING_REPLACEMENT: &str = "    out.write_discovery_start()?;\n    let tests_len = tests.len();\n    let filtered_tests = filter_tests(opts, tests);\n    crate::supercov_events::emit_listing(tests_len - filtered_tests.len(), filtered_tests.len())?;\n    for test in filtered_tests {";
const IN_PROCESS_ANCHOR: &str = "    // Buffer for capturing standard I/O\n    let data =";
const IN_PROCESS_REPLACEMENT: &str = "    let _supercov_context = crate::supercov_events::enter_test(desc.name.as_slice())\n        .expect(\"Supercov could not enter the exact libtest context\");\n\n    // Buffer for capturing standard I/O\n    let data =";
const SPAWNED_PROCESS_ANCHOR: &str = "fn run_test_in_spawned_subprocess(desc: TestDesc, runnable_test: RunnableTest) -> ! {\n    let builtin_panic_hook";
const SPAWNED_PROCESS_REPLACEMENT: &str = "fn run_test_in_spawned_subprocess(desc: TestDesc, runnable_test: RunnableTest) -> ! {\n    let _supercov_context = crate::supercov_events::enter_test(desc.name.as_slice())\n        .expect(\"Supercov could not enter the exact spawned libtest context\");\n    let builtin_panic_hook";
const BENCH_ANCHOR: &str = "        Runnable::Bench(runnable_bench) => {\n            // Benchmarks aren't expected to panic, so we run them all in-process.\n            runnable_bench.run";
const BENCH_REPLACEMENT: &str = "        Runnable::Bench(runnable_bench) => {\n            // Benchmarks aren't expected to panic, so we run them all in-process.\n            let _supercov_context = crate::supercov_events::enter_test(desc.name.as_slice())\n                .expect(\"Supercov could not enter the exact benchmark context\");\n            runnable_bench.run";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestCompanionSourceIdentity {
    pub event_protocol_version: u32,
    pub rustc_commit_hash: String,
    pub rustc_release: String,
    pub host_triple: String,
    pub original_source_sha256: String,
    pub event_runtime_sha256: String,
    pub patched_source_sha256: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustLibtestCompanionBuildPlan {
    pub source: PathBuf,
    pub output: PathBuf,
    pub arguments: Vec<OsString>,
    pub rustc_bootstrap: OsString,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestCompanionBundle {
    pub schema_version: u32,
    pub event_protocol_version: u32,
    pub compiler_companion_build_id: String,
    pub rustc_commit_hash: String,
    pub host_triple: String,
    pub original_source_sha256: String,
    pub event_runtime_sha256: String,
    pub patched_source_sha256: String,
    pub artifact_file: String,
    pub artifact_sha256: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectedRustLibtestCompanion {
    pub bundle_path: PathBuf,
    pub artifact_path: PathBuf,
    pub bundle: RustLibtestCompanionBundle,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustLibtestCompanionError {
    Io {
        path: PathBuf,
        reason: String,
    },
    UnsafeSource(PathBuf),
    NonUtf8Path(PathBuf),
    UnrecognizedSource {
        path: PathBuf,
        anchor: &'static str,
    },
    DependencyMetadata {
        directory: PathBuf,
        crate_name: &'static str,
        count: usize,
    },
    InvalidBundle {
        path: PathBuf,
        reason: String,
    },
    InvalidArchive(String),
    BundleMismatch(String),
    BuildFailed {
        program: PathBuf,
        status: Option<i32>,
        stdout: String,
        stderr: String,
    },
    LockTimeout(PathBuf),
}

impl std::fmt::Display for RustLibtestCompanionError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::UnsafeSource(path) => write!(
                formatter,
                "exact libtest source contains a symlink or special file: {}",
                path.display()
            ),
            Self::NonUtf8Path(path) => write!(
                formatter,
                "exact libtest source contains a non-UTF-8 path: {}",
                path.display()
            ),
            Self::UnrecognizedSource { path, anchor } => write!(
                formatter,
                "selected toolchain libtest source {} does not contain exactly one {anchor} patch anchor",
                path.display()
            ),
            Self::DependencyMetadata {
                directory,
                crate_name,
                count,
            } => write!(
                formatter,
                "expected exactly one full {crate_name} metadata file in {}, found {count}",
                directory.display()
            ),
            Self::InvalidBundle { path, reason } => write!(
                formatter,
                "invalid libtest companion bundle {}: {reason}",
                path.display()
            ),
            Self::InvalidArchive(reason) => {
                write!(formatter, "invalid libtest companion rlib: {reason}")
            }
            Self::BundleMismatch(reason) => {
                write!(formatter, "libtest companion bundle mismatch: {reason}")
            }
            Self::BuildFailed {
                program,
                status,
                stdout,
                stderr,
            } => write!(
                formatter,
                "{} failed with status {status:?}: {stderr}{stdout}",
                program.display()
            ),
            Self::LockTimeout(path) => write!(
                formatter,
                "timed out waiting for the exact libtest builder lock {}",
                path.display()
            ),
        }
    }
}

impl std::error::Error for RustLibtestCompanionError {}

fn io_error(path: &Path, error: impl std::fmt::Display) -> RustLibtestCompanionError {
    RustLibtestCompanionError::Io {
        path: path.to_path_buf(),
        reason: error.to_string(),
    }
}

#[cfg(unix)]
fn sync_directory(path: &Path) -> Result<(), RustLibtestCompanionError> {
    let directory = OpenOptions::new()
        .read(true)
        .open(path)
        .map_err(|error| io_error(path, error))?;
    directory.sync_all().map_err(|error| io_error(path, error))
}

#[cfg(not(unix))]
fn sync_directory(_path: &Path) -> Result<(), RustLibtestCompanionError> {
    Ok(())
}

fn regular_directory(path: &Path) -> Result<PathBuf, RustLibtestCompanionError> {
    let canonical = fs::canonicalize(path).map_err(|error| io_error(path, error))?;
    let metadata = fs::symlink_metadata(&canonical).map_err(|error| io_error(&canonical, error))?;
    if !metadata.file_type().is_dir() {
        return Err(RustLibtestCompanionError::UnsafeSource(canonical));
    }
    Ok(canonical)
}

fn safe_component(path: &Path) -> Result<String, RustLibtestCompanionError> {
    if path
        .components()
        .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()));
    }
    path.to_str()
        .map(|value| value.replace('\\', "/"))
        .ok_or_else(|| RustLibtestCompanionError::NonUtf8Path(path.to_path_buf()))
}

fn collect_tree(
    root: &Path,
    relative: &Path,
    entries: &mut Vec<(String, PathBuf, bool)>,
) -> Result<(), RustLibtestCompanionError> {
    let directory = root.join(relative);
    let mut children = fs::read_dir(&directory)
        .map_err(|error| io_error(&directory, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(&directory, error))?;
    children.sort_by_key(std::fs::DirEntry::file_name);
    for child in children {
        let name = child.file_name();
        let child_relative = relative.join(name);
        let display = safe_component(&child_relative)?;
        let file_type = child
            .file_type()
            .map_err(|error| io_error(&child.path(), error))?;
        if file_type.is_dir() {
            entries.push((display, child.path(), true));
            collect_tree(root, &child_relative, entries)?;
        } else if file_type.is_file() {
            entries.push((display, child.path(), false));
        } else {
            return Err(RustLibtestCompanionError::UnsafeSource(child.path()));
        }
    }
    Ok(())
}

fn source_tree_digest(root: &Path) -> Result<String, RustLibtestCompanionError> {
    source_tree_digest_excluding(root, None)
}

fn source_tree_digest_excluding(
    root: &Path,
    excluded_root_file: Option<&str>,
) -> Result<String, RustLibtestCompanionError> {
    let mut entries = Vec::new();
    collect_tree(root, Path::new(""), &mut entries)?;
    let mut digest = Sha256::new();
    for (relative, path, directory) in entries {
        if excluded_root_file.is_some_and(|excluded| relative == excluded) {
            continue;
        }
        digest.update([u8::from(directory)]);
        digest.update((relative.len() as u64).to_le_bytes());
        digest.update(relative.as_bytes());
        if !directory {
            let bytes = fs::read(&path).map_err(|error| io_error(&path, error))?;
            digest.update((bytes.len() as u64).to_le_bytes());
            digest.update(bytes);
        }
    }
    Ok(format!("{:x}", digest.finalize()))
}

fn copy_regular_tree(source: &Path, destination: &Path) -> Result<(), RustLibtestCompanionError> {
    let mut entries = Vec::new();
    collect_tree(source, Path::new(""), &mut entries)?;
    for (relative, path, directory) in entries {
        let destination_path = destination.join(&relative);
        if directory {
            fs::create_dir(&destination_path)
                .map_err(|error| io_error(&destination_path, error))?;
        } else {
            let bytes = fs::read(&path).map_err(|error| io_error(&path, error))?;
            let mut options = OpenOptions::new();
            options.write(true).create_new(true);
            #[cfg(unix)]
            {
                use std::os::unix::fs::OpenOptionsExt as _;
                options.mode(0o600);
            }
            let mut file = options
                .open(&destination_path)
                .map_err(|error| io_error(&destination_path, error))?;
            file.write_all(&bytes)
                .and_then(|()| file.sync_all())
                .map_err(|error| io_error(&destination_path, error))?;
        }
    }
    Ok(())
}

fn replace_once(
    path: &Path,
    anchor: &'static str,
    replacement: &str,
) -> Result<(), RustLibtestCompanionError> {
    let source = fs::read_to_string(path).map_err(|error| io_error(path, error))?;
    if source.matches(anchor).count() != 1 {
        return Err(RustLibtestCompanionError::UnrecognizedSource {
            path: path.into(),
            anchor,
        });
    }
    let bytes = source.replacen(anchor, replacement, 1).into_bytes();
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(path)
        .map_err(|error| io_error(path, error))?;
    file.write_all(&bytes)
        .and_then(|()| file.sync_all())
        .map_err(|error| io_error(path, error))
}

struct RemoveDirectoryOnDrop(Option<PathBuf>);

impl Drop for RemoveDirectoryOnDrop {
    fn drop(&mut self) {
        if let Some(path) = self.0.take() {
            let _ = fs::remove_dir_all(path);
        }
    }
}

struct RemoveFileOnDrop(Option<PathBuf>);

impl Drop for RemoveFileOnDrop {
    fn drop(&mut self) {
        if let Some(path) = self.0.take() {
            let _ = fs::remove_file(path);
        }
    }
}

fn acquire_kernel_lock(path: &Path) -> Result<fs::File, RustLibtestCompanionError> {
    if let Ok(metadata) = fs::symlink_metadata(path)
        && !metadata.file_type().is_file()
    {
        return Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()));
    }
    let started = Instant::now();
    loop {
        let mut options = OpenOptions::new();
        options.read(true).write(true).create(true);
        #[cfg(unix)]
        {
            use std::os::unix::fs::OpenOptionsExt as _;
            #[cfg(target_os = "linux")]
            const O_NOFOLLOW: i32 = 0x2_0000;
            #[cfg(target_os = "macos")]
            const O_NOFOLLOW: i32 = 0x100;
            #[cfg(any(target_os = "linux", target_os = "macos"))]
            options.custom_flags(O_NOFOLLOW);
            options.mode(0o600);
        }
        let mut file = options.open(path).map_err(|error| io_error(path, error))?;
        if !file
            .metadata()
            .map_err(|error| io_error(path, error))?
            .file_type()
            .is_file()
        {
            return Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()));
        }
        match file.try_lock() {
            Ok(()) => {
                file.set_len(0)
                    .and_then(|()| writeln!(file, "{}", std::process::id()))
                    .and_then(|()| file.sync_all())
                    .map_err(|error| io_error(path, error))?;
                return Ok(file);
            }
            Err(fs::TryLockError::WouldBlock) => {
                if started.elapsed() >= BUILD_LOCK_TIMEOUT {
                    return Err(RustLibtestCompanionError::LockTimeout(path.to_path_buf()));
                }
                thread::sleep(Duration::from_millis(25));
            }
            Err(fs::TryLockError::Error(error)) => return Err(io_error(path, error)),
        }
    }
}

#[cfg(unix)]
fn inherit_lock_through_exec(command: &mut Command, lock: &fs::File) {
    use std::os::{fd::AsRawFd as _, unix::process::CommandExt as _};

    let lock_fd = lock.as_raw_fd();
    // OpenOptions uses close-on-exec. Duplicate the already locked open-file
    // description in the post-fork child so an abruptly killed builder cannot
    // release publication ownership while its rustc child is still writing.
    // `dup` is async-signal-safe and the child-only duplicate intentionally
    // survives exec until rustc exits.
    unsafe {
        command.pre_exec(move || {
            if libc::dup(lock_fd) < 0 {
                Err(std::io::Error::last_os_error())
            } else {
                Ok(())
            }
        });
    }
}

#[cfg(not(unix))]
fn inherit_lock_through_exec(_command: &mut Command, _lock: &fs::File) {
    // Windows releases a process's byte-range locks when it terminates, an
    // inherited handle notwithstanding, so the Unix trick has no counterpart.
    // A builder killed while its rustc still writes leaves one uniquely named
    // .partial behind; the next builder ignores it and publishes its own.
}

fn remove_owned_path(path: &Path, expect_directory: bool) -> Result<(), RustLibtestCompanionError> {
    let metadata = match fs::symlink_metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(io_error(path, error)),
    };
    if expect_directory && metadata.file_type().is_dir() {
        fs::remove_dir_all(path).map_err(|error| io_error(path, error))
    } else if !expect_directory && metadata.file_type().is_file() {
        fs::remove_file(path).map_err(|error| io_error(path, error))
    } else {
        Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()))
    }
}

fn remove_owned_partials(
    directory: &Path,
    prefix: &str,
    expect_directory: bool,
) -> Result<(), RustLibtestCompanionError> {
    for entry in fs::read_dir(directory).map_err(|error| io_error(directory, error))? {
        let entry = entry.map_err(|error| io_error(directory, error))?;
        let name = entry.file_name();
        let Some(name) = name.to_str() else {
            continue;
        };
        if name.starts_with(prefix) && name.ends_with(".partial") {
            remove_owned_path(&entry.path(), expect_directory)?;
        }
    }
    Ok(())
}

fn validate_prepared_libtest_source(
    source_root: &Path,
    destination: &Path,
    compiler: &RustCompilerIdentity,
) -> Result<RustLibtestCompanionSourceIdentity, RustLibtestCompanionError> {
    let destination = regular_directory(destination)?;
    let identity_path = destination.join(SOURCE_IDENTITY_FILE);
    let identity: RustLibtestCompanionSourceIdentity =
        serde_json::from_slice(&read_regular_file(&identity_path)?).map_err(|error| {
            RustLibtestCompanionError::InvalidBundle {
                path: identity_path.clone(),
                reason: error.to_string(),
            }
        })?;
    let runtime_sha256 = format!(
        "{:x}",
        Sha256::digest(rust_libtest_event_runtime_source().as_bytes())
    );
    if identity.event_protocol_version != RUST_LIBTEST_EVENT_PROTOCOL_VERSION
        || identity.rustc_commit_hash != compiler.rustc_commit_hash
        || identity.rustc_release != compiler.rustc_release
        || identity.host_triple != compiler.host_triple
        || identity.event_runtime_sha256 != runtime_sha256
        || [
            identity.original_source_sha256.as_str(),
            identity.event_runtime_sha256.as_str(),
            identity.patched_source_sha256.as_str(),
        ]
        .iter()
        .any(|value| !canonical_lower_sha256(value))
    {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "prepared libtest source identity differs from the exact compiler/runtime".into(),
        ));
    }
    if source_tree_digest(source_root)? != identity.original_source_sha256 {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "exact toolchain libtest source changed after preparation".into(),
        ));
    }
    if source_tree_digest_excluding(&destination, Some(SOURCE_IDENTITY_FILE))?
        != identity.patched_source_sha256
    {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "prepared libtest source tree digest differs".into(),
        ));
    }
    Ok(identity)
}

/// Copy and patch an exact `library/test` source tree without modifying the
/// toolchain sysroot. `destination` becomes visible only after the complete
/// patched tree and its identity have been validated.
pub fn prepare_exact_libtest_source(
    source_root: &Path,
    destination: &Path,
    compiler: &RustCompilerIdentity,
) -> Result<RustLibtestCompanionSourceIdentity, RustLibtestCompanionError> {
    let source_root = regular_directory(source_root)?;
    let parent = destination
        .parent()
        .ok_or_else(|| RustLibtestCompanionError::UnsafeSource(destination.to_path_buf()))?;
    let parent = regular_directory(parent)?;
    let name = destination
        .file_name()
        .and_then(|name| name.to_str())
        .filter(|name| !name.is_empty() && *name != "." && *name != "..")
        .ok_or_else(|| RustLibtestCompanionError::UnsafeSource(destination.to_path_buf()))?;
    let destination = parent.join(name);
    let lock_path = parent.join(format!(".{name}.lock"));
    let _lock = acquire_kernel_lock(&lock_path)?;
    remove_owned_partials(&parent, &format!(".{name}."), true)?;
    match fs::symlink_metadata(&destination) {
        Ok(metadata) if metadata.file_type().is_dir() => {
            return validate_prepared_libtest_source(&source_root, &destination, compiler);
        }
        Ok(_) => return Err(RustLibtestCompanionError::UnsafeSource(destination)),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(io_error(&destination, error)),
    }
    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| io_error(&destination, error))?
        .as_nanos();
    let partial = parent.join(format!(".{name}.{}-{nonce}.partial", std::process::id()));
    fs::create_dir(&partial).map_err(|error| io_error(&partial, error))?;
    let mut cleanup = RemoveDirectoryOnDrop(Some(partial.clone()));

    let original_source_sha256 = source_tree_digest(&source_root)?;
    copy_regular_tree(&source_root, &partial)?;
    if source_tree_digest(&source_root)? != original_source_sha256 {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "exact toolchain libtest source changed while it was copied".into(),
        ));
    }
    let lib = partial.join("src/lib.rs");
    let console = partial.join("src/console.rs");
    replace_once(&lib, LIB_ANCHOR, LIB_REPLACEMENT)?;
    replace_once(&lib, IN_PROCESS_ANCHOR, IN_PROCESS_REPLACEMENT)?;
    replace_once(&lib, SPAWNED_PROCESS_ANCHOR, SPAWNED_PROCESS_REPLACEMENT)?;
    replace_once(&lib, BENCH_ANCHOR, BENCH_REPLACEMENT)?;
    replace_once(&console, CONSOLE_ANCHOR, CONSOLE_REPLACEMENT)?;
    replace_once(&console, LISTING_ANCHOR, LISTING_REPLACEMENT)?;
    let event_runtime = rust_libtest_event_runtime_source();
    let event_path = partial.join("src/supercov_events.rs");
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut event_file = options
        .open(&event_path)
        .map_err(|error| io_error(&event_path, error))?;
    event_file
        .write_all(event_runtime.as_bytes())
        .and_then(|()| event_file.sync_all())
        .map_err(|error| io_error(&event_path, error))?;
    drop(event_file);

    let identity = RustLibtestCompanionSourceIdentity {
        event_protocol_version: RUST_LIBTEST_EVENT_PROTOCOL_VERSION,
        rustc_commit_hash: compiler.rustc_commit_hash.clone(),
        rustc_release: compiler.rustc_release.clone(),
        host_triple: compiler.host_triple.clone(),
        original_source_sha256,
        event_runtime_sha256: format!("{:x}", Sha256::digest(event_runtime.as_bytes())),
        patched_source_sha256: source_tree_digest(&partial)?,
    };
    let identity_path = partial.join(SOURCE_IDENTITY_FILE);
    let mut identity_bytes =
        serde_json::to_vec_pretty(&identity).map_err(|error| io_error(&identity_path, error))?;
    identity_bytes.push(b'\n');
    let mut identity_file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&identity_path)
        .map_err(|error| io_error(&identity_path, error))?;
    identity_file
        .write_all(&identity_bytes)
        .and_then(|()| identity_file.sync_all())
        .map_err(|error| io_error(&identity_path, error))?;
    // Windows will not rename a directory while a file inside it is open, so
    // both writers are closed before the tree is published; the file
    // publications below already did this.
    drop(identity_file);
    fs::rename(&partial, &destination).map_err(|error| io_error(&destination, error))?;
    sync_directory(&parent)?;
    cleanup.0 = None;
    Ok(identity)
}

fn one_metadata(
    directory: &Path,
    crate_name: &'static str,
) -> Result<PathBuf, RustLibtestCompanionError> {
    let prefix = format!("lib{crate_name}-");
    let mut matches = fs::read_dir(directory)
        .map_err(|error| io_error(directory, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(directory, error))?
        .into_iter()
        .filter(|entry| {
            let metadata = entry
                .file_name()
                .to_str()
                .is_some_and(|name| name.starts_with(&prefix) && name.ends_with(".rmeta"));
            let archive = entry.path().with_extension("rlib");
            metadata
                && entry.file_type().is_ok_and(|file_type| file_type.is_file())
                && fs::symlink_metadata(archive)
                    .is_ok_and(|metadata| metadata.file_type().is_file())
        })
        .map(|entry| entry.path())
        .collect::<Vec<_>>();
    matches.sort();
    matches.dedup();
    match matches.as_slice() {
        [path] => Ok(path.clone()),
        _ => Err(RustLibtestCompanionError::DependencyMetadata {
            directory: directory.to_path_buf(),
            crate_name,
            count: matches.len(),
        }),
    }
}

pub fn rust_libtest_companion_build_plan(
    patched_source: &Path,
    target_libdir: &Path,
    output: &Path,
) -> Result<RustLibtestCompanionBuildPlan, RustLibtestCompanionError> {
    let patched_source = regular_directory(patched_source)?;
    let target_libdir = regular_directory(target_libdir)?;
    let source = patched_source.join("src/lib.rs");
    if !fs::symlink_metadata(&source).is_ok_and(|metadata| metadata.file_type().is_file()) {
        return Err(RustLibtestCompanionError::UnsafeSource(source));
    }
    let getopts = one_metadata(&target_libdir, "getopts")?;
    let libc = one_metadata(&target_libdir, "libc")?;
    let identity_path = patched_source.join("supercov-libtest-source.json");
    let identity: RustLibtestCompanionSourceIdentity =
        serde_json::from_slice(&read_regular_file(&identity_path)?).map_err(|error| {
            RustLibtestCompanionError::InvalidBundle {
                path: identity_path,
                reason: error.to_string(),
            }
        })?;
    if !canonical_lower_sha256(&identity.patched_source_sha256) {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "patched libtest source identity is noncanonical".into(),
        ));
    }
    Ok(RustLibtestCompanionBuildPlan {
        source: source.clone(),
        output: output.to_path_buf(),
        arguments: vec![
            source.into_os_string(),
            "--crate-name".into(),
            "test".into(),
            "--crate-type".into(),
            "rlib".into(),
            "--edition".into(),
            "2024".into(),
            "-Zcrate-attr=feature(rustc_private)".into(),
            format!(
                "--remap-path-prefix={}=/supercov/libtest-source",
                patched_source.display()
            )
            .into(),
            format!(
                "-Cmetadata=supercov_{}",
                &identity.patched_source_sha256[..16]
            )
            .into(),
            "-L".into(),
            format!("dependency={}", target_libdir.display()).into(),
            "--extern".into(),
            format!("getopts={}", getopts.display()).into(),
            "--extern".into(),
            format!("libc={}", libc.display()).into(),
            "-o".into(),
            output.as_os_str().to_owned(),
        ],
        rustc_bootstrap: "1".into(),
    })
}

fn canonical_archive_kind(
    kind: ReadableArchiveKind,
    host_triple: &str,
) -> Result<WritableArchiveKind, RustLibtestCompanionError> {
    match kind {
        ReadableArchiveKind::Gnu => Ok(WritableArchiveKind::Gnu),
        ReadableArchiveKind::Gnu64 => Ok(WritableArchiveKind::Gnu64),
        ReadableArchiveKind::Bsd if host_triple.contains("-apple-") => {
            Ok(WritableArchiveKind::Darwin)
        }
        ReadableArchiveKind::Bsd => Ok(WritableArchiveKind::Bsd),
        ReadableArchiveKind::Bsd64 => Ok(WritableArchiveKind::Darwin64),
        ReadableArchiveKind::Coff => Ok(WritableArchiveKind::Coff),
        ReadableArchiveKind::AixBig => Ok(WritableArchiveKind::AixBig),
        _ => Err(RustLibtestCompanionError::InvalidArchive(format!(
            "unsupported archive kind {kind:?} for {host_triple}"
        ))),
    }
}

/// Rebuild rustc's rlib container with content-derived member names.
///
/// rustc's object and metadata payloads are reproducible for an exact libtest
/// source/compiler identity, but its temporary codegen archive-member suffix
/// is deliberately per-session. The suffix has no linking semantics, yet it
/// changes the rlib digest and its symbol table. Supercov owns release artifact
/// identity, so it replaces only those container-local names and lets LLVM's
/// archive writer reconstruct the target-format symbol table from the exact,
/// unmodified payloads.
pub fn canonicalize_rust_libtest_rlib(
    bytes: &[u8],
    host_triple: &str,
) -> Result<Vec<u8>, RustLibtestCompanionError> {
    let archive = ArchiveFile::parse(bytes).map_err(|error| {
        RustLibtestCompanionError::InvalidArchive(format!("cannot parse archive: {error}"))
    })?;
    if archive.is_thin() {
        return Err(RustLibtestCompanionError::InvalidArchive(
            "thin archives are not self-contained".into(),
        ));
    }
    let archive_kind = canonical_archive_kind(archive.kind(), host_triple)?;

    let mut metadata = None;
    let mut objects = Vec::new();
    for member in archive.members() {
        let member = member.map_err(|error| {
            RustLibtestCompanionError::InvalidArchive(format!(
                "cannot parse archive member: {error}"
            ))
        })?;
        let name = std::str::from_utf8(member.name()).map_err(|_| {
            RustLibtestCompanionError::InvalidArchive(
                "archive contains a non-UTF-8 member name".into(),
            )
        })?;
        let data = member.data(bytes).map_err(|error| {
            RustLibtestCompanionError::InvalidArchive(format!(
                "cannot read archive member {name}: {error}"
            ))
        })?;
        if name == "lib.rmeta" {
            if metadata.replace(data.to_vec()).is_some() {
                return Err(RustLibtestCompanionError::InvalidArchive(
                    "archive contains more than one lib.rmeta member".into(),
                ));
            }
        } else if name.ends_with(".rcgu.o") {
            objects.push((format!("{:x}", Sha256::digest(data)), data.to_vec()));
        } else {
            return Err(RustLibtestCompanionError::InvalidArchive(format!(
                "unexpected archive member {name}"
            )));
        }
    }
    let metadata = metadata.ok_or_else(|| {
        RustLibtestCompanionError::InvalidArchive("archive has no lib.rmeta member".into())
    })?;
    if objects.is_empty() {
        return Err(RustLibtestCompanionError::InvalidArchive(
            "archive has no codegen object members".into(),
        ));
    }
    objects.sort_by(|left, right| left.0.cmp(&right.0).then_with(|| left.1.cmp(&right.1)));

    let mut owned_members = Vec::with_capacity(objects.len() + 1);
    owned_members.push(("lib.rmeta".to_owned(), metadata));
    for (ordinal, (digest, data)) in objects.into_iter().enumerate() {
        owned_members.push((
            format!("supercov-libtest-{ordinal:06}-{digest}.rcgu.o"),
            data,
        ));
    }
    let members = owned_members
        .iter()
        .map(|(name, data)| NewArchiveMember::new(data, &DEFAULT_OBJECT_READER, name.clone()))
        .collect::<Vec<_>>();
    let mut output = Cursor::new(Vec::new());
    write_archive_to_stream(
        &mut output,
        &members,
        archive_kind,
        false,
        Some(host_triple.contains("arm64ec")),
    )
    .map_err(|error| {
        RustLibtestCompanionError::InvalidArchive(format!(
            "cannot write canonical archive: {error}"
        ))
    })?;
    let output = output.into_inner();
    let reparsed = ArchiveFile::parse(output.as_slice()).map_err(|error| {
        RustLibtestCompanionError::InvalidArchive(format!(
            "canonical archive did not parse: {error}"
        ))
    })?;
    if reparsed.is_thin() || reparsed.members().count() != owned_members.len() {
        return Err(RustLibtestCompanionError::InvalidArchive(
            "canonical archive failed structural verification".into(),
        ));
    }
    Ok(output)
}

pub fn rust_libtest_companion_bundle_path(compiler_companion: &Path) -> PathBuf {
    let mut value = compiler_companion.as_os_str().to_owned();
    value.push(".libtest.json");
    PathBuf::from(value)
}

fn canonical_lower_sha256(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn sha256_file(path: &Path) -> Result<String, RustLibtestCompanionError> {
    Ok(format!("{:x}", Sha256::digest(read_regular_file(path)?)))
}

fn read_regular_file(path: &Path) -> Result<Vec<u8>, RustLibtestCompanionError> {
    let metadata = fs::symlink_metadata(path).map_err(|error| io_error(path, error))?;
    if !metadata.file_type().is_file() {
        return Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()));
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
    let mut file = options.open(path).map_err(|error| io_error(path, error))?;
    if !file
        .metadata()
        .map_err(|error| io_error(path, error))?
        .file_type()
        .is_file()
    {
        return Err(RustLibtestCompanionError::UnsafeSource(path.to_path_buf()));
    }
    let mut bytes = Vec::new();
    std::io::Read::read_to_end(&mut file, &mut bytes).map_err(|error| io_error(path, error))?;
    Ok(bytes)
}

fn safe_artifact_basename(value: &str) -> bool {
    let path = Path::new(value);
    !value.is_empty()
        && value != "."
        && value != ".."
        && path.components().count() == 1
        && path
            .components()
            .all(|component| matches!(component, Component::Normal(_)))
}

/// Authenticate the release-built libtest rlib against the already verified
/// compiler companion. The sidecar binds both content hashes and exact rustc
/// identity; npm/crate package integrity then authenticates the sidecar as part
/// of the same platform artifact.
pub fn select_rust_libtest_companion(
    selection: &SelectedRustCompilerCompanion,
) -> Result<SelectedRustLibtestCompanion, RustLibtestCompanionError> {
    let bundle_path = rust_libtest_companion_bundle_path(&selection.companion_path);
    let bundle_metadata =
        fs::symlink_metadata(&bundle_path).map_err(|error| io_error(&bundle_path, error))?;
    if !bundle_metadata.file_type().is_file() {
        return Err(RustLibtestCompanionError::UnsafeSource(bundle_path));
    }
    let bundle: RustLibtestCompanionBundle =
        serde_json::from_slice(&read_regular_file(&bundle_path)?).map_err(|error| {
            RustLibtestCompanionError::InvalidBundle {
                path: bundle_path.clone(),
                reason: error.to_string(),
            }
        })?;
    if bundle.schema_version != RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION
        || bundle.event_protocol_version != RUST_LIBTEST_EVENT_PROTOCOL_VERSION
        || !safe_artifact_basename(&bundle.artifact_file)
        || [
            bundle.compiler_companion_build_id.as_str(),
            bundle.original_source_sha256.as_str(),
            bundle.event_runtime_sha256.as_str(),
            bundle.patched_source_sha256.as_str(),
            bundle.artifact_sha256.as_str(),
        ]
        .iter()
        .any(|value| !canonical_lower_sha256(value))
    {
        return Err(RustLibtestCompanionError::InvalidBundle {
            path: bundle_path,
            reason: "unsupported schema/protocol, unsafe artifact name or noncanonical digest"
                .into(),
        });
    }
    if bundle.compiler_companion_build_id != selection.handshake.companion_build_id {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "compiler companion build ID differs".into(),
        ));
    }
    if bundle.rustc_commit_hash != selection.compiler.rustc_commit_hash
        || bundle.host_triple != selection.compiler.host_triple
    {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "selected rustc identity differs".into(),
        ));
    }
    let directory = selection.companion_path.parent().ok_or_else(|| {
        RustLibtestCompanionError::BundleMismatch(
            "compiler companion has no artifact directory".into(),
        )
    })?;
    let artifact_path = directory.join(&bundle.artifact_file);
    if sha256_file(&artifact_path)? != bundle.artifact_sha256 {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "libtest artifact digest differs".into(),
        ));
    }
    Ok(SelectedRustLibtestCompanion {
        bundle_path,
        artifact_path,
        bundle,
    })
}

pub fn write_rust_libtest_companion_bundle(
    compiler_companion: &Path,
    source_identity: &RustLibtestCompanionSourceIdentity,
    artifact: &Path,
) -> Result<PathBuf, RustLibtestCompanionError> {
    let compiler_companion = fs::canonicalize(compiler_companion)
        .map_err(|error| io_error(compiler_companion, error))?;
    let artifact = fs::canonicalize(artifact).map_err(|error| io_error(artifact, error))?;
    let directory = compiler_companion.parent().ok_or_else(|| {
        RustLibtestCompanionError::BundleMismatch(
            "compiler companion has no artifact directory".into(),
        )
    })?;
    if artifact.parent() != Some(directory) {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "libtest artifact is not adjacent to the compiler companion".into(),
        ));
    }
    let artifact_file = artifact
        .file_name()
        .and_then(|value| value.to_str())
        .filter(|value| safe_artifact_basename(value))
        .ok_or_else(|| {
            RustLibtestCompanionError::BundleMismatch(
                "libtest artifact has an unsafe filename".into(),
            )
        })?
        .to_owned();
    let bundle = RustLibtestCompanionBundle {
        schema_version: RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION,
        event_protocol_version: source_identity.event_protocol_version,
        compiler_companion_build_id: sha256_file(&compiler_companion)?,
        rustc_commit_hash: source_identity.rustc_commit_hash.clone(),
        host_triple: source_identity.host_triple.clone(),
        original_source_sha256: source_identity.original_source_sha256.clone(),
        event_runtime_sha256: source_identity.event_runtime_sha256.clone(),
        patched_source_sha256: source_identity.patched_source_sha256.clone(),
        artifact_file,
        artifact_sha256: sha256_file(&artifact)?,
    };
    let path = rust_libtest_companion_bundle_path(&compiler_companion);
    let mut bytes = serde_json::to_vec_pretty(&bundle).map_err(|error| io_error(&path, error))?;
    bytes.push(b'\n');
    let partial = path.with_file_name(format!(
        ".{}.{}-{}.partial",
        path.file_name()
            .and_then(|value| value.to_str())
            .unwrap_or("libtest"),
        std::process::id(),
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|error| io_error(&path, error))?
            .as_nanos()
    ));
    let mut cleanup = RemoveFileOnDrop(Some(partial.clone()));
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut file = options
        .open(&partial)
        .map_err(|error| io_error(&partial, error))?;
    file.write_all(&bytes)
        .and_then(|()| file.sync_all())
        .map_err(|error| io_error(&partial, error))?;
    drop(file);
    if let Ok(metadata) = fs::symlink_metadata(&path)
        && !metadata.file_type().is_file()
    {
        return Err(RustLibtestCompanionError::UnsafeSource(path));
    }
    fs::rename(&partial, &path).map_err(|error| io_error(&path, error))?;
    sync_directory(directory)?;
    cleanup.0 = None;
    Ok(path)
}

fn libtest_builder_lock_path(compiler_companion: &Path) -> PathBuf {
    let mut value = compiler_companion.as_os_str().to_owned();
    value.push(".libtest.lock");
    PathBuf::from(value)
}

fn bundle_matches_source_identity(
    selected: &SelectedRustLibtestCompanion,
    identity: &RustLibtestCompanionSourceIdentity,
) -> Result<(), RustLibtestCompanionError> {
    if selected.bundle.event_protocol_version != identity.event_protocol_version
        || selected.bundle.rustc_commit_hash != identity.rustc_commit_hash
        || selected.bundle.host_triple != identity.host_triple
        || selected.bundle.original_source_sha256 != identity.original_source_sha256
        || selected.bundle.event_runtime_sha256 != identity.event_runtime_sha256
        || selected.bundle.patched_source_sha256 != identity.patched_source_sha256
    {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "published bundle differs from the authenticated prepared source".into(),
        ));
    }
    Ok(())
}

/// Build and atomically publish the exact-toolchain libtest companion.
///
/// All mutable builder state is protected by kernel locks. A killed process
/// releases its lock immediately; the next builder removes only narrowly
/// named, regular builder-owned partials, authenticates any completed state,
/// and resumes. Final source trees, artifacts and bundles become visible only
/// after their bytes have been synced and verified.
pub fn build_exact_rust_libtest_companion(
    source_root: &Path,
    work_root: &Path,
    rustc: &Path,
    compiler_companion: &Path,
) -> Result<SelectedRustLibtestCompanion, RustLibtestCompanionError> {
    let rustc = fs::canonicalize(rustc).map_err(|error| io_error(rustc, error))?;
    let compiler = probe_rustc_identity(&rustc).map_err(|error| {
        RustLibtestCompanionError::BundleMismatch(format!(
            "could not authenticate exact rustc: {error}"
        ))
    })?;
    let work_root = regular_directory(work_root)?;
    let compiler_companion = fs::canonicalize(compiler_companion)
        .map_err(|error| io_error(compiler_companion, error))?;
    if !fs::symlink_metadata(&compiler_companion)
        .is_ok_and(|metadata| metadata.file_type().is_file())
    {
        return Err(RustLibtestCompanionError::UnsafeSource(compiler_companion));
    }
    let artifact_directory = compiler_companion.parent().ok_or_else(|| {
        RustLibtestCompanionError::BundleMismatch(
            "compiler companion has no artifact directory".into(),
        )
    })?;
    let lock_path = libtest_builder_lock_path(&compiler_companion);
    let builder_lock = acquire_kernel_lock(&lock_path)?;
    let selection =
        select_rust_compiler_companion(&rustc, std::slice::from_ref(&compiler_companion), false)
            .map_err(|error| {
                RustLibtestCompanionError::BundleMismatch(format!(
                    "could not authenticate compiler companion: {error}"
                ))
            })?;

    let bundle_path = rust_libtest_companion_bundle_path(&compiler_companion);
    let bundle_name = bundle_path
        .file_name()
        .and_then(|name| name.to_str())
        .ok_or_else(|| RustLibtestCompanionError::UnsafeSource(bundle_path.clone()))?;
    remove_owned_partials(artifact_directory, &format!(".{bundle_name}."), false)?;

    let patched_source = work_root.join("patched-libtest");
    let source_identity = prepare_exact_libtest_source(source_root, &patched_source, &compiler)?;
    match fs::symlink_metadata(&bundle_path) {
        Ok(metadata) if metadata.file_type().is_file() => {
            let selected = select_rust_libtest_companion(&selection)?;
            bundle_matches_source_identity(&selected, &source_identity)?;
            return Ok(selected);
        }
        Ok(_) => return Err(RustLibtestCompanionError::UnsafeSource(bundle_path)),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(io_error(&bundle_path, error)),
    }

    let target_libdir_output = Command::new(&rustc)
        .args(["--print", "target-libdir"])
        .env_remove("RUSTC_WRAPPER")
        .env_remove("RUSTC_WORKSPACE_WRAPPER")
        .output()
        .map_err(|error| io_error(&rustc, error))?;
    if !target_libdir_output.status.success() || !target_libdir_output.stderr.is_empty() {
        return Err(RustLibtestCompanionError::BuildFailed {
            program: rustc,
            status: target_libdir_output.status.code(),
            stdout: String::from_utf8_lossy(&target_libdir_output.stdout).into_owned(),
            stderr: String::from_utf8_lossy(&target_libdir_output.stderr).into_owned(),
        });
    }
    let target_libdir = PathBuf::from(
        std::str::from_utf8(&target_libdir_output.stdout)
            .map_err(|_| {
                RustLibtestCompanionError::BundleMismatch("rustc target libdir is not UTF-8".into())
            })?
            .trim(),
    );
    let artifact_name = format!(
        "libtest-supercov-v{}-{}-{}.rlib",
        RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION,
        &source_identity.rustc_commit_hash[..12],
        &source_identity.patched_source_sha256[..12]
    );
    let artifact = artifact_directory.join(&artifact_name);
    remove_owned_partials(artifact_directory, &format!(".{artifact_name}."), false)?;

    // The stable, content-derived output basename is part of rustc's codegen
    // identity. It is built in the dedicated work root and copied into a
    // unique adjacent publication partial only after canonicalization.
    let build_output = work_root.join(&artifact_name);
    remove_owned_path(&build_output, false)?;
    let mut build_cleanup = RemoveFileOnDrop(Some(build_output.clone()));
    let plan = rust_libtest_companion_build_plan(&patched_source, &target_libdir, &build_output)?;
    let mut command = Command::new(&rustc);
    command
        .args(&plan.arguments)
        .env("RUSTC_BOOTSTRAP", &plan.rustc_bootstrap)
        .env_remove("RUSTC_WRAPPER")
        .env_remove("RUSTC_WORKSPACE_WRAPPER")
        .env_remove(crate::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV)
        .env_remove(crate::rust_compiler_orchestration::RUST_COMPILER_INNER_MODE_ENV);
    inherit_lock_through_exec(&mut command, &builder_lock);
    let output = command.output().map_err(|error| io_error(&rustc, error))?;
    if !output.status.success() {
        return Err(RustLibtestCompanionError::BuildFailed {
            program: rustc,
            status: output.status.code(),
            stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
            stderr: String::from_utf8_lossy(&output.stderr).into_owned(),
        });
    }
    let compiled = read_regular_file(&build_output)?;
    let canonical = canonicalize_rust_libtest_rlib(&compiled, &compiler.host_triple)?;
    let partial = artifact_directory.join(format!(
        ".{artifact_name}.{}-{}.partial",
        std::process::id(),
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|error| io_error(&artifact, error))?
            .as_nanos()
    ));
    let mut partial_cleanup = RemoveFileOnDrop(Some(partial.clone()));
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut partial_file = options
        .open(&partial)
        .map_err(|error| io_error(&partial, error))?;
    partial_file
        .write_all(&canonical)
        .and_then(|()| partial_file.sync_all())
        .map_err(|error| io_error(&partial, error))?;
    drop(partial_file);

    match fs::symlink_metadata(&artifact) {
        Ok(metadata) if metadata.file_type().is_file() => {
            if read_regular_file(&artifact)? != canonical {
                return Err(RustLibtestCompanionError::BundleMismatch(
                    "the same exact libtest identity produced different artifact bytes".into(),
                ));
            }
            fs::remove_file(&partial).map_err(|error| io_error(&partial, error))?;
            partial_cleanup.0 = None;
        }
        Ok(_) => return Err(RustLibtestCompanionError::UnsafeSource(artifact)),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            fs::rename(&partial, &artifact).map_err(|error| io_error(&artifact, error))?;
            sync_directory(artifact_directory)?;
            partial_cleanup.0 = None;
        }
        Err(error) => return Err(io_error(&artifact, error)),
    }
    fs::remove_file(&build_output).map_err(|error| io_error(&build_output, error))?;
    build_cleanup.0 = None;

    let published_bundle =
        write_rust_libtest_companion_bundle(&compiler_companion, &source_identity, &artifact)?;
    let selected = select_rust_libtest_companion(&selection)?;
    bundle_matches_source_identity(&selected, &source_identity)?;
    if selected.bundle_path != published_bundle || selected.artifact_path != artifact {
        return Err(RustLibtestCompanionError::BundleMismatch(
            "published libtest companion did not reselect exactly".into(),
        ));
    }
    Ok(selected)
}

#[cfg(test)]
mod tests {
    use std::{
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;
    use supercov_contracts::{
        EVIDENCE_ARCHIVE_SCHEMA_VERSION, RUST_COMPILER_COMPANION_PROTOCOL_VERSION,
        RustCompilerCompanionCapabilities, RustCompilerCompanionHandshake,
    };

    fn compiler() -> RustCompilerIdentity {
        RustCompilerIdentity {
            rustc_commit_hash: "a".repeat(40),
            rustc_release: "1.95.0".into(),
            host_triple: "aarch64-apple-darwin".into(),
            rustc_driver_sha256: "b".repeat(64),
        }
    }

    fn selection(
        compiler_companion: PathBuf,
        compiler: RustCompilerIdentity,
    ) -> SelectedRustCompilerCompanion {
        let build_id = sha256_file(&compiler_companion).unwrap();
        SelectedRustCompilerCompanion {
            rustc_path: compiler_companion.with_file_name("rustc"),
            compiler_library_directory: compiler_companion.parent().unwrap().to_path_buf(),
            companion_path: compiler_companion,
            compiler: compiler.clone(),
            handshake: RustCompilerCompanionHandshake {
                protocol_version: RUST_COMPILER_COMPANION_PROTOCOL_VERSION,
                frontend_id: "rust".into(),
                coverage_model_variant: "rust-source-v1".into(),
                evidence_schema_version: EVIDENCE_ARCHIVE_SCHEMA_VERSION,
                companion_build_id: build_id,
                compiler,
                capabilities: RustCompilerCompanionCapabilities {
                    expanded_hir_provenance: true,
                    runtime_mir_probe_insertion: true,
                    generated_source_provenance: true,
                    ctfe_path_tracing: true,
                    rustdoc_doctest_tracing: true,
                    exact_test_harness_attribution: true,
                },
            },
        }
    }

    fn fixture() -> PathBuf {
        static NEXT_FIXTURE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-libtest-source-{}-{nonce}-{}",
            std::process::id(),
            NEXT_FIXTURE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(root.join("source/src")).unwrap();
        fs::write(root.join("source/Cargo.toml"), b"[package]\nname='test'\n").unwrap();
        fs::write(root.join("source/src/lib.rs"), fixture_lib_source()).unwrap();
        fs::write(
            root.join("source/src/console.rs"),
            format!("use std::io;\n{CONSOLE_ANCHOR}\n    }}\n}}\n{LISTING_ANCHOR}\n}}\n"),
        )
        .unwrap();
        root
    }

    fn fixture_lib_source() -> String {
        format!(
            "#![feature(test)]\n{LIB_ANCHOR}\n{IN_PROCESS_ANCHOR} synthetic;\n{SPAWNED_PROCESS_ANCHOR};\n{BENCH_ANCHOR}(synthetic);\n"
        )
    }

    #[test]
    fn patches_atomically_with_relocation_stable_identity() {
        let first = fixture();
        let second = fixture();
        let first_identity = prepare_exact_libtest_source(
            &first.join("source"),
            &first.join("patched"),
            &compiler(),
        )
        .unwrap();
        let second_identity = prepare_exact_libtest_source(
            &second.join("source"),
            &second.join("patched"),
            &compiler(),
        )
        .unwrap();
        assert_eq!(first_identity, second_identity);
        assert!(
            fs::read_to_string(first.join("patched/src/lib.rs"))
                .unwrap()
                .contains("mod supercov_events;")
        );
        assert_eq!(
            fs::read_to_string(first.join("patched/src/lib.rs"))
                .unwrap()
                .matches("supercov_events::enter_test")
                .count(),
            3
        );
        assert!(
            fs::read_to_string(first.join("patched/src/console.rs"))
                .unwrap()
                .contains("crate::supercov_events::emit(event)?;")
        );
        assert!(
            fs::read_to_string(first.join("patched/src/console.rs"))
                .unwrap()
                .contains("crate::supercov_events::emit_listing(")
        );
        assert_eq!(
            fs::read_to_string(first.join("source/src/lib.rs")).unwrap(),
            fixture_lib_source()
        );
        assert!(first.join("patched/supercov-libtest-source.json").is_file());
        assert_eq!(
            prepare_exact_libtest_source(
                &first.join("source"),
                &first.join("patched"),
                &compiler()
            )
            .unwrap(),
            first_identity
        );
        fs::remove_dir_all(first).unwrap();
        fs::remove_dir_all(second).unwrap();
    }

    #[test]
    fn prepared_source_reuse_fails_closed_on_tree_or_identity_tampering() {
        let root = fixture();
        let source = root.join("source");
        let patched = root.join("patched");
        prepare_exact_libtest_source(&source, &patched, &compiler()).unwrap();
        fs::write(patched.join("src/lib.rs"), b"tampered\n").unwrap();
        assert!(matches!(
            prepare_exact_libtest_source(&source, &patched, &compiler()),
            Err(RustLibtestCompanionError::BundleMismatch(reason))
                if reason.contains("tree digest")
        ));

        fs::remove_dir_all(&patched).unwrap();
        prepare_exact_libtest_source(&source, &patched, &compiler()).unwrap();
        let identity_path = patched.join(SOURCE_IDENTITY_FILE);
        let mut identity: serde_json::Value =
            serde_json::from_slice(&fs::read(&identity_path).unwrap()).unwrap();
        identity["unknown"] = serde_json::json!(true);
        fs::write(&identity_path, serde_json::to_vec(&identity).unwrap()).unwrap();
        assert!(matches!(
            prepare_exact_libtest_source(&source, &patched, &compiler()),
            Err(RustLibtestCompanionError::InvalidBundle { .. })
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn concurrent_source_preparation_converges_without_partial_debris() {
        let root = fixture();
        let source = root.join("source");
        let patched = root.join("patched");
        let workers = (0..8)
            .map(|_| {
                let source = source.clone();
                let patched = patched.clone();
                std::thread::spawn(move || {
                    prepare_exact_libtest_source(&source, &patched, &compiler()).unwrap()
                })
            })
            .collect::<Vec<_>>();
        let identities = workers
            .into_iter()
            .map(|worker| worker.join().unwrap())
            .collect::<Vec<_>>();
        assert!(identities.windows(2).all(|pair| pair[0] == pair[1]));
        assert!(fs::read_dir(&root).unwrap().all(|entry| {
            !entry
                .unwrap()
                .file_name()
                .to_string_lossy()
                .ends_with(".partial")
        }));
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn libtest_builder_lock_holder_helper() {
        let Some(lock) = std::env::var_os("SUPERCOV_TEST_LIBTEST_LOCK") else {
            return;
        };
        let partial =
            PathBuf::from(std::env::var_os("SUPERCOV_TEST_LIBTEST_PARTIAL").expect("partial path"));
        let ready =
            PathBuf::from(std::env::var_os("SUPERCOV_TEST_LIBTEST_READY").expect("ready path"));
        let _lock = acquire_kernel_lock(Path::new(&lock)).unwrap();
        fs::write(&partial, b"incomplete\n").unwrap();
        fs::write(&ready, b"locked\n").unwrap();
        loop {
            std::thread::sleep(Duration::from_secs(1));
        }
    }

    #[cfg(unix)]
    #[test]
    fn killed_builder_releases_lock_and_owned_partial_is_recoverable() {
        use std::process::Stdio;

        let root = fixture();
        let lock = root.join("companion.libtest.lock");
        let partial = root.join(".artifact.123.partial");
        let ready = root.join("builder-ready");
        let mut child = Command::new(std::env::current_exe().unwrap())
            .args([
                "--exact",
                "rust_libtest_companion::tests::libtest_builder_lock_holder_helper",
                "--nocapture",
            ])
            .env("SUPERCOV_TEST_LIBTEST_LOCK", &lock)
            .env("SUPERCOV_TEST_LIBTEST_PARTIAL", &partial)
            .env("SUPERCOV_TEST_LIBTEST_READY", &ready)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .unwrap();
        let started = Instant::now();
        while !ready.is_file() {
            assert!(
                started.elapsed() < Duration::from_secs(10),
                "libtest builder helper did not acquire its kernel lock"
            );
            std::thread::sleep(Duration::from_millis(10));
        }
        assert_eq!(
            unsafe { libc::kill(child.id().try_into().unwrap(), libc::SIGKILL) },
            0
        );
        assert_eq!(child.wait().unwrap().code(), None);
        let recovery_started = Instant::now();
        let _lock = acquire_kernel_lock(&lock).unwrap();
        assert!(recovery_started.elapsed() < Duration::from_secs(5));
        remove_owned_partials(&root, ".artifact.", false).unwrap();
        assert!(!partial.exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn libtest_builder_child_lock_holder_helper() {
        let Some(lock) = std::env::var_os("SUPERCOV_TEST_LIBTEST_CHILD_LOCK") else {
            return;
        };
        let ready = PathBuf::from(
            std::env::var_os("SUPERCOV_TEST_LIBTEST_CHILD_READY").expect("ready path"),
        );
        let lock = acquire_kernel_lock(Path::new(&lock)).unwrap();
        let mut command = Command::new("/bin/sh");
        command.args(["-c", "sleep 2"]);
        inherit_lock_through_exec(&mut command, &lock);
        let child = command.spawn().unwrap();
        fs::write(&ready, format!("{}\n", child.id())).unwrap();
        // This helper is deliberately SIGKILLed by its parent test; dropping
        // the handle leaves the compiler-shaped child alive so it alone proves
        // that the inherited open-file description retains the kernel lock.
        drop(child);
        loop {
            std::thread::sleep(Duration::from_secs(1));
        }
    }

    #[cfg(unix)]
    #[test]
    fn killed_builder_keeps_lock_until_its_compiler_child_exits() {
        use std::process::Stdio;

        let root = fixture();
        let lock = root.join("companion-child.libtest.lock");
        let ready = root.join("compiler-ready");
        let mut builder = Command::new(std::env::current_exe().unwrap())
            .args([
                "--exact",
                "rust_libtest_companion::tests::libtest_builder_child_lock_holder_helper",
                "--nocapture",
            ])
            .env("SUPERCOV_TEST_LIBTEST_CHILD_LOCK", &lock)
            .env("SUPERCOV_TEST_LIBTEST_CHILD_READY", &ready)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .unwrap();
        let started = Instant::now();
        while !ready.is_file() {
            assert!(started.elapsed() < Duration::from_secs(10));
            std::thread::sleep(Duration::from_millis(10));
        }
        assert_eq!(
            unsafe { libc::kill(builder.id().try_into().unwrap(), libc::SIGKILL) },
            0
        );
        assert_eq!(builder.wait().unwrap().code(), None);
        let recovery_started = Instant::now();
        let _lock = acquire_kernel_lock(&lock).unwrap();
        assert!(
            recovery_started.elapsed() >= Duration::from_millis(500),
            "the compiler child did not retain the publication lock"
        );
        assert!(recovery_started.elapsed() < Duration::from_secs(5));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn rejects_unrecognized_or_unsafe_exact_source() {
        let root = fixture();
        fs::write(root.join("source/src/console.rs"), "not libtest\n").unwrap();
        assert!(matches!(
            prepare_exact_libtest_source(&root.join("source"), &root.join("patched"), &compiler()),
            Err(RustLibtestCompanionError::UnrecognizedSource { .. })
        ));
        assert!(!root.join("patched").exists());
        assert_eq!(
            fs::read_to_string(root.join("source/src/console.rs")).unwrap(),
            "not libtest\n"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn rejects_symlinks_without_leaving_a_destination() {
        use std::os::unix::fs::symlink;

        let root = fixture();
        symlink("lib.rs", root.join("source/src/alias.rs")).unwrap();
        assert!(matches!(
            prepare_exact_libtest_source(&root.join("source"), &root.join("patched"), &compiler()),
            Err(RustLibtestCompanionError::UnsafeSource(_))
        ));
        assert!(!root.join("patched").exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn build_plan_requires_exact_full_metadata() {
        let root = fixture();
        prepare_exact_libtest_source(&root.join("source"), &root.join("patched"), &compiler())
            .unwrap();
        fs::create_dir(root.join("libdir")).unwrap();
        fs::write(root.join("libdir/libgetopts-a.rmeta"), b"getopts").unwrap();
        fs::write(root.join("libdir/libgetopts-a.rlib"), b"getopts archive").unwrap();
        fs::write(root.join("libdir/liblibc-b.rmeta"), b"libc").unwrap();
        fs::write(root.join("libdir/liblibc-b.rlib"), b"libc archive").unwrap();
        let plan = rust_libtest_companion_build_plan(
            &root.join("patched"),
            &root.join("libdir"),
            &root.join("libtest-supercov.rlib"),
        )
        .unwrap();
        assert_eq!(
            plan.source,
            fs::canonicalize(root.join("patched/src/lib.rs")).unwrap()
        );
        assert!(
            plan.arguments
                .iter()
                .any(|value| value == "-Zcrate-attr=feature(rustc_private)")
        );
        assert!(
            !plan
                .arguments
                .iter()
                .any(|value| value.to_string_lossy().starts_with("-Cincremental"))
        );
        fs::write(root.join("libdir/liblibc-c.rmeta"), b"duplicate").unwrap();
        fs::write(root.join("libdir/liblibc-c.rlib"), b"duplicate archive").unwrap();
        assert!(
            rust_libtest_companion_build_plan(
                &root.join("patched"),
                &root.join("libdir"),
                &root.join("duplicate.rlib")
            )
            .is_err()
        );
        fs::remove_dir_all(root).unwrap();
    }

    fn synthetic_rlib(object_suffix: &str, reverse: bool) -> Vec<u8> {
        let metadata = b"metadata".as_slice();
        let first = b"first object".as_slice();
        let second = b"second object".as_slice();
        let first_name = format!("test.alpha.{object_suffix}.rcgu.o");
        let second_name = format!("test.beta.{object_suffix}.rcgu.o");
        let mut owned = [
            ("lib.rmeta".to_owned(), metadata),
            (first_name, first),
            (second_name, second),
        ];
        if reverse {
            owned[1..].reverse();
        }
        let members = owned
            .iter()
            .map(|(name, data)| NewArchiveMember::new(data, &DEFAULT_OBJECT_READER, name.clone()))
            .collect::<Vec<_>>();
        let mut output = Cursor::new(Vec::new());
        write_archive_to_stream(
            &mut output,
            &members,
            WritableArchiveKind::Darwin,
            false,
            Some(false),
        )
        .unwrap();
        output.into_inner()
    }

    #[test]
    fn canonical_rlib_ignores_session_names_and_member_order() {
        let first = canonicalize_rust_libtest_rlib(
            &synthetic_rlib("random-one", false),
            "aarch64-apple-darwin",
        )
        .unwrap();
        let second = canonicalize_rust_libtest_rlib(
            &synthetic_rlib("random-two", true),
            "aarch64-apple-darwin",
        )
        .unwrap();
        assert_eq!(first, second);

        let archive = ArchiveFile::parse(first.as_slice()).unwrap();
        let names = archive
            .members()
            .map(|member| {
                std::str::from_utf8(member.unwrap().name())
                    .unwrap()
                    .to_owned()
            })
            .collect::<Vec<_>>();
        assert_eq!(names.first().map(String::as_str), Some("lib.rmeta"));
        assert!(
            names[1..]
                .iter()
                .all(|name| name.starts_with("supercov-libtest-") && name.ends_with(".rcgu.o"))
        );
    }

    #[test]
    fn bundle_binds_exact_compiler_source_runtime_and_artifact_bytes() {
        let root = fixture();
        let compiler = compiler();
        let source_identity =
            prepare_exact_libtest_source(&root.join("source"), &root.join("patched"), &compiler)
                .unwrap();
        let compiler_companion = root.join("supercov-rustc-companion");
        let artifact = root.join("libtest-supercov.rlib");
        fs::write(&compiler_companion, b"compiler companion").unwrap();
        fs::write(&artifact, b"exact libtest rlib").unwrap();
        let selected = selection(
            fs::canonicalize(&compiler_companion).unwrap(),
            compiler.clone(),
        );
        let bundle_path =
            write_rust_libtest_companion_bundle(&compiler_companion, &source_identity, &artifact)
                .unwrap();
        let bound = select_rust_libtest_companion(&selected).unwrap();
        assert_eq!(bound.bundle_path, bundle_path);
        assert_eq!(bound.artifact_path, fs::canonicalize(&artifact).unwrap());
        assert_eq!(
            bound.bundle.compiler_companion_build_id,
            selected.handshake.companion_build_id
        );
        assert_eq!(
            bound.bundle.original_source_sha256,
            source_identity.original_source_sha256
        );

        fs::write(&artifact, b"tampered").unwrap();
        assert!(matches!(
            select_rust_libtest_companion(&selected),
            Err(RustLibtestCompanionError::BundleMismatch(_))
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn bundle_rejects_unknown_fields_unsafe_paths_and_companion_mismatch() {
        let root = fixture();
        let compiler = compiler();
        let source_identity =
            prepare_exact_libtest_source(&root.join("source"), &root.join("patched"), &compiler)
                .unwrap();
        let compiler_companion = root.join("supercov-rustc-companion");
        let artifact = root.join("libtest-supercov.rlib");
        fs::write(&compiler_companion, b"compiler companion").unwrap();
        fs::write(&artifact, b"exact libtest rlib").unwrap();
        let mut selected = selection(
            fs::canonicalize(&compiler_companion).unwrap(),
            compiler.clone(),
        );
        let bundle_path =
            write_rust_libtest_companion_bundle(&compiler_companion, &source_identity, &artifact)
                .unwrap();
        let mut value: serde_json::Value =
            serde_json::from_slice(&fs::read(&bundle_path).unwrap()).unwrap();
        value["unknown"] = serde_json::json!(true);
        fs::write(&bundle_path, serde_json::to_vec(&value).unwrap()).unwrap();
        assert!(matches!(
            select_rust_libtest_companion(&selected),
            Err(RustLibtestCompanionError::InvalidBundle { .. })
        ));

        value.as_object_mut().unwrap().remove("unknown");
        value["artifactFile"] = serde_json::json!("../escaped.rlib");
        fs::write(&bundle_path, serde_json::to_vec(&value).unwrap()).unwrap();
        assert!(matches!(
            select_rust_libtest_companion(&selected),
            Err(RustLibtestCompanionError::InvalidBundle { .. })
        ));

        value["artifactFile"] = serde_json::json!("libtest-supercov.rlib");
        fs::write(&bundle_path, serde_json::to_vec(&value).unwrap()).unwrap();
        selected.handshake.companion_build_id = "f".repeat(64);
        assert!(matches!(
            select_rust_libtest_companion(&selected),
            Err(RustLibtestCompanionError::BundleMismatch(_))
        ));
        fs::remove_dir_all(root).unwrap();
    }
}
