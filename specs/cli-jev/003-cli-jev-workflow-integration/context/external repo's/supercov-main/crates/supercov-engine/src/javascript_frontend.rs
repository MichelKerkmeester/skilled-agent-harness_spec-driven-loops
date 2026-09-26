//! JavaScript source frontend for Rust-owned executions.
//!
//! The frontend mutates only an already-isolated workspace. JavaScript files
//! are transformed by the Rust instrumenter; the small Node/browser runtime
//! remains a language shim and is copied into the workspace under `.supercov`.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, OpenOptions},
    io::{self, Write},
    path::{Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
    time::{Instant, SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::{
    js_instrumenter::{
        CandidateBranch, CandidateDecision, CandidateError, CandidateLimitation, CandidatePoint,
        instrument_with_import_policy,
    },
    project_discovery::{BuildAdapter, CoverageProject},
    source_discovery::{SourceLimitation, SourceScope},
};

const RUNTIME_INSTANCE_MARKER: &str = "__SUPERCOV_RUNTIME_INSTANCE__";
const FRONTEND_CACHE_SCHEMA_VERSION: u32 = 2;
const FRONTEND_CACHE_FILE: &str = ".supercov/frontend-cache.json";
const FRONTEND_CACHE_DIRECTORY: &str = ".supercov/frontend-cache-artifacts";
/// Each file Supercov rewrites, as its author wrote it, and the list of them.
/// A linter, formatter or type check run by the test command reads these
/// instead (register.mjs); both sit under node_modules, which none of them
/// walk into.
const AUTHORED_DIRECTORY: &str = ".supercov/node_modules/.authored";
const AUTHORED_LIST: &str = ".supercov/node_modules/authored-sources.json";
const RUNTIME_FILES: &[&str] = &[
    "atomic.mjs",
    "capability.mjs",
    "jest.cjs",
    "jest.config.mjs",
    "jestReporter.mjs",
    "jestRuntime.cjs",
    "launchSupervisor.mjs",
    "nodeAssert.mjs",
    "nodeAssertAdapter.mjs",
    "nodeAssertStrict.mjs",
    "nodeTest.mjs",
    "playwright.mjs",
    "playwrightReporter.mjs",
    "provenance.mjs",
    "register.mjs",
    "resolve-loader.mjs",
    "runnerEvidence.mjs",
    "runtime.mjs",
    "transport.mjs",
    "vitest.mjs",
    "vitestBrowser.mjs",
    "vitestReporter.mjs",
];
static UNIQUE: AtomicU64 = AtomicU64::new(0);

/// Where the setup phase spends its time.
///
/// The timings line reports `setup` as one number, and one number cannot say
/// which operation is slow: on a Windows runner it read 18.7 s for the same
/// two-file fixture that takes 0.4-0.6 s on macOS -- per-file syncs, as it
/// turned out. Every file operation the frontend performs adds to these
/// counters, and `SUPERCOV_PHASE_TIMING=1`
/// prints them beside the phase, so the next platform surprise is measured
/// rather than guessed at. The stage counters (runtime, configs, sources,
/// assertions, cache) partition the phase; the operation counters cut across
/// those stages, and `instrument` is the parsing and rewriting inside
/// `sources`, with the rest of that stage being the writes.
struct SetupAccounting {
    files: AtomicU64,
    bytes: AtomicU64,
    create_ns: AtomicU64,
    write_ns: AtomicU64,
    rename_ns: AtomicU64,
    directories: AtomicU64,
    directory_retries: AtomicU64,
    directory_ns: AtomicU64,
    runtime_ns: AtomicU64,
    config_ns: AtomicU64,
    sources_ns: AtomicU64,
    instrument_ns: AtomicU64,
    assertion_ns: AtomicU64,
    cache_ns: AtomicU64,
}

impl SetupAccounting {
    const fn new() -> Self {
        Self {
            files: AtomicU64::new(0),
            bytes: AtomicU64::new(0),
            create_ns: AtomicU64::new(0),
            write_ns: AtomicU64::new(0),
            rename_ns: AtomicU64::new(0),
            directories: AtomicU64::new(0),
            directory_retries: AtomicU64::new(0),
            directory_ns: AtomicU64::new(0),
            runtime_ns: AtomicU64::new(0),
            config_ns: AtomicU64::new(0),
            sources_ns: AtomicU64::new(0),
            instrument_ns: AtomicU64::new(0),
            assertion_ns: AtomicU64::new(0),
            cache_ns: AtomicU64::new(0),
        }
    }
}

static SETUP: SetupAccounting = SetupAccounting::new();

fn account(counter: &AtomicU64, started: Instant) {
    counter.fetch_add(started.elapsed().as_nanos() as u64, Ordering::Relaxed);
}

fn accounted_ms(counter: &AtomicU64) -> f64 {
    counter.load(Ordering::Relaxed) as f64 / 1_000_000.0
}

fn counted(counter: &AtomicU64) -> u64 {
    counter.load(Ordering::Relaxed)
}

fn timed<T>(counter: &AtomicU64, operation: impl FnOnce() -> T) -> T {
    let started = Instant::now();
    let value = operation();
    account(counter, started);
    value
}

/// One line saying where the setup phase went, when `SUPERCOV_PHASE_TIMING=1`
/// asked for it.
pub fn setup_timing_detail() -> Option<String> {
    if std::env::var("SUPERCOV_PHASE_TIMING").as_deref() != Ok("1") {
        return None;
    }
    Some(format!(
        "setup detail runtime={:.1}ms configs={:.1}ms sources={:.1}ms (instrument={:.1}ms) \
assertions={:.1}ms cache={:.1}ms | files={} bytes={} create={:.1}ms write={:.1}ms \
rename={:.1}ms | directories={} retries={} directory-wait={:.1}ms",
        accounted_ms(&SETUP.runtime_ns),
        accounted_ms(&SETUP.config_ns),
        accounted_ms(&SETUP.sources_ns),
        accounted_ms(&SETUP.instrument_ns),
        accounted_ms(&SETUP.assertion_ns),
        accounted_ms(&SETUP.cache_ns),
        counted(&SETUP.files),
        counted(&SETUP.bytes),
        accounted_ms(&SETUP.create_ns),
        accounted_ms(&SETUP.write_ns),
        accounted_ms(&SETUP.rename_ns),
        counted(&SETUP.directories),
        counted(&SETUP.directory_retries),
        accounted_ms(&SETUP.directory_ns),
    ))
}

#[derive(Debug)]
pub enum JavascriptFrontendError {
    Io {
        path: PathBuf,
        source: io::Error,
    },
    Instrument {
        file: String,
        source: CandidateError,
    },
    MissingRuntimeMarker,
    Serialize(serde_json::Error),
    UnsafeSourcePath(String),
}

impl std::fmt::Display for JavascriptFrontendError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::Instrument { file, source } => {
                write!(formatter, "failed to instrument {file}: {source:?}")
            }
            Self::MissingRuntimeMarker => write!(
                formatter,
                "generated Supercov runtime is missing its instance marker"
            ),
            Self::Serialize(error) => write!(formatter, "failed to serialize manifest: {error}"),
            Self::UnsafeSourcePath(file) => write!(formatter, "unsafe source path: {file}"),
        }
    }
}

impl std::error::Error for JavascriptFrontendError {}

fn io_error(path: &Path, source: io::Error) -> JavascriptFrontendError {
    JavascriptFrontendError::Io {
        path: path.to_owned(),
        source,
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct JavascriptManifest {
    pub decisions: Vec<CandidateDecision>,
    pub points: Vec<CandidatePoint>,
    pub branches: Vec<CandidateBranch>,
    pub limitations: Vec<CandidateLimitation>,
    pub scope: SourceScope,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PreparedJavascriptFrontend {
    pub manifest: JavascriptManifest,
    pub manifest_path: PathBuf,
    pub preload_path: PathBuf,
    pub playwright_config_path: PathBuf,
    pub vite_config_path: PathBuf,
    pub vitest_config_path: PathBuf,
    pub assertion_calls: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct JavascriptFrontendCache {
    schema_version: u32,
    key: String,
    assertion_calls: usize,
    artifacts: Vec<JavascriptFrontendCacheArtifact>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct JavascriptFrontendCacheArtifact {
    path: String,
    cache_file: String,
    sha256: String,
}

fn safe_relative(path: &Path) -> bool {
    path.components().next().is_some()
        && path
            .components()
            .all(|component| matches!(component, std::path::Component::Normal(_)))
}

fn regular_file(workspace: &Path, relative: &str) -> bool {
    safe_relative(Path::new(relative))
        && fs::symlink_metadata(workspace.join(relative))
            .is_ok_and(|metadata| metadata.file_type().is_file())
}

fn valid_cached_artifact(workspace: &Path, artifact: &JavascriptFrontendCacheArtifact) -> bool {
    let expected_cache_file = format!("{FRONTEND_CACHE_DIRECTORY}/{}", artifact.sha256);
    if !safe_relative(Path::new(&artifact.path))
        || !safe_relative(Path::new(&artifact.cache_file))
        || artifact.cache_file != expected_cache_file
        || artifact.sha256.len() != 64
        || !artifact
            .sha256
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        return false;
    }
    let Ok(contents) = fs::read(workspace.join(&artifact.cache_file)) else {
        return false;
    };
    format!("{:x}", Sha256::digest(&contents)) == artifact.sha256
}

pub fn read_javascript_frontend_cache(
    workspace: &Path,
    key: &str,
) -> Option<JavascriptFrontendCache> {
    let metadata: JavascriptFrontendCache =
        serde_json::from_slice(&fs::read(workspace.join(FRONTEND_CACHE_FILE)).ok()?).ok()?;
    if metadata.schema_version != FRONTEND_CACHE_SCHEMA_VERSION
        || metadata.key != key
        || metadata.artifacts.is_empty()
        || metadata
            .artifacts
            .iter()
            .any(|artifact| !valid_cached_artifact(workspace, artifact))
    {
        return None;
    }
    Some(metadata)
}

pub fn javascript_frontend_reuse_paths(cache: &JavascriptFrontendCache) -> Vec<PathBuf> {
    let _ = cache;
    vec![
        PathBuf::from(FRONTEND_CACHE_FILE),
        PathBuf::from(FRONTEND_CACHE_DIRECTORY),
    ]
}

fn restore_cached_file(path: &Path, contents: &[u8]) -> Result<(), JavascriptFrontendError> {
    let parent = path
        .parent()
        .ok_or_else(|| JavascriptFrontendError::UnsafeSourcePath(path.display().to_string()))?;
    create_directory_all(parent)?;
    let temporary = parent.join(format!(".supercov-restore-{}", unique()));
    let result = (|| {
        fs::write(&temporary, contents).map_err(|source| io_error(&temporary, source))?;
        match fs::symlink_metadata(path) {
            Ok(metadata) if metadata.file_type().is_file() || metadata.file_type().is_symlink() => {
                fs::remove_file(path).map_err(|source| io_error(path, source))?;
            }
            Ok(_) => {
                return Err(JavascriptFrontendError::UnsafeSourcePath(
                    path.display().to_string(),
                ));
            }
            Err(source) if source.kind() == io::ErrorKind::NotFound => {}
            Err(source) => return Err(io_error(path, source)),
        }
        fs::rename(&temporary, path).map_err(|source| io_error(path, source))
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary);
    }
    result
}

pub fn load_cached_javascript_frontend(
    workspace: &Path,
    cache: &JavascriptFrontendCache,
) -> Result<PreparedJavascriptFrontend, JavascriptFrontendError> {
    for artifact in &cache.artifacts {
        let cache_path = workspace.join(&artifact.cache_file);
        let contents = fs::read(&cache_path).map_err(|source| io_error(&cache_path, source))?;
        if format!("{:x}", Sha256::digest(&contents)) != artifact.sha256 {
            return Err(JavascriptFrontendError::UnsafeSourcePath(format!(
                "corrupt frontend cache artifact {}",
                artifact.cache_file
            )));
        }
        restore_cached_file(&workspace.join(&artifact.path), &contents)?;
    }
    let generated = workspace.join(".supercov");
    let manifest_path = generated.join("manifest.json");
    let manifest = serde_json::from_slice(
        &fs::read(&manifest_path).map_err(|source| io_error(&manifest_path, source))?,
    )
    .map_err(JavascriptFrontendError::Serialize)?;
    Ok(PreparedJavascriptFrontend {
        manifest,
        manifest_path,
        preload_path: generated.join("node_modules/register.mjs"),
        playwright_config_path: generated.join("playwright.config.mjs"),
        vite_config_path: generated.join("vite.config.mjs"),
        vitest_config_path: generated.join("vitest.config.mjs"),
        assertion_calls: cache.assertion_calls,
    })
}

fn frontend_artifact_paths(workspace: &Path, project: &CoverageProject) -> Vec<String> {
    let mut artifacts = vec![
        ".supercov/node_modules/package.json".to_owned(),
        ".supercov/node_modules/applicationRuntime.mjs".to_owned(),
        ".supercov/node_modules/runtime.d.mts".to_owned(),
        ".supercov/playwright.config.mjs".to_owned(),
        ".supercov/vite.config.mjs".to_owned(),
        ".supercov/vitest.config.mjs".to_owned(),
        ".supercov/vite-transforms.json".to_owned(),
        ".supercov/viteInstrumentation.mjs".to_owned(),
        ".supercov/manifest.json".to_owned(),
        ".supercov/statement-exclusions.json".to_owned(),
        ".supercov/instrumentation-complete".to_owned(),
    ];
    artifacts.extend(
        RUNTIME_FILES
            .iter()
            .map(|name| format!(".supercov/node_modules/{name}")),
    );
    // Scope entries outside the instrumented set may still be rewritten
    // (assertion attribution, capability imports), so they are cached like
    // instrumented sources. Both populations feed the cache key through the
    // source digest -- nothing cached here escapes the fingerprint.
    artifacts.extend(project.source_files.iter().cloned());
    artifacts.extend(
        project
            .source_scope
            .entries
            .iter()
            .map(|entry| entry.file.clone()),
    );
    for root in &project.source_roots {
        let host = if workspace.join(root).is_file() {
            Path::new(root).parent().unwrap_or_else(|| Path::new(""))
        } else {
            Path::new(root)
        };
        for name in ["package.json", "runtime.mjs", "runtime.d.mts"] {
            let path = host.join(".supercov/node_modules").join(name);
            if let Some(path) = path.to_str() {
                artifacts.push(path.replace('\\', "/"));
            }
        }
    }
    let rewritten = project
        .source_files
        .iter()
        .chain(project.source_scope.entries.iter().map(|entry| &entry.file))
        .map(|file| format!("{AUTHORED_DIRECTORY}/{file}"))
        .collect::<Vec<_>>();
    artifacts.extend(rewritten);
    artifacts.push(AUTHORED_LIST.to_owned());
    artifacts.sort();
    artifacts.dedup();
    artifacts.retain(|path| regular_file(workspace, path));
    artifacts
}

/// The project files this run rewrote, as the authored list records them.
pub fn rewritten_files(workspace: &Path) -> Vec<String> {
    fs::read(workspace.join(AUTHORED_LIST))
        .ok()
        .and_then(|contents| serde_json::from_slice(&contents).ok())
        .unwrap_or_default()
}

/// Keep `file` as its author wrote it, the first time it is rewritten.
fn keep_authored(
    workspace: &Path,
    authored: &mut BTreeSet<String>,
    file: &str,
    source: &str,
) -> Result<(), JavascriptFrontendError> {
    if authored.insert(file.to_owned()) {
        let path = checked_source_path(&workspace.join(AUTHORED_DIRECTORY), file)?;
        if let Some(parent) = path.parent() {
            create_directory_all(parent)?;
        }
        atomic_write(&path, source.as_bytes())?;
    }
    Ok(())
}

fn write_javascript_frontend_cache(
    workspace: &Path,
    project: &CoverageProject,
    key: &str,
    assertion_calls: usize,
) -> Result<(), JavascriptFrontendError> {
    let cache_directory = workspace.join(FRONTEND_CACHE_DIRECTORY);
    create_directory_all(&cache_directory)?;
    let mut artifacts = Vec::new();
    for path in frontend_artifact_paths(workspace, project) {
        let contents = fs::read(workspace.join(&path))
            .map_err(|source| io_error(&workspace.join(&path), source))?;
        let sha256 = format!("{:x}", Sha256::digest(&contents));
        let cache_file = format!("{FRONTEND_CACHE_DIRECTORY}/{sha256}");
        let destination = workspace.join(&cache_file);
        if !destination.is_file() {
            atomic_write(&destination, &contents)?;
        }
        artifacts.push(JavascriptFrontendCacheArtifact {
            path,
            cache_file,
            sha256,
        });
    }
    let cache = JavascriptFrontendCache {
        schema_version: FRONTEND_CACHE_SCHEMA_VERSION,
        key: key.to_owned(),
        assertion_calls,
        artifacts,
    };
    let mut encoded =
        serde_json::to_vec_pretty(&cache).map_err(JavascriptFrontendError::Serialize)?;
    encoded.push(b'\n');
    atomic_write(&workspace.join(FRONTEND_CACHE_FILE), &encoded)
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ViteTransform {
    source_sha256: String,
    code: String,
    map: Option<serde_json::Value>,
}

fn embedded_runtime(name: &str) -> Option<&'static [u8]> {
    match name {
        "atomic.mjs" => Some(include_bytes!("../runtime-assets/javascript/atomic.mjs")),
        "capability.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/capability.mjs"
        )),
        "jest.cjs" => Some(include_bytes!("../runtime-assets/javascript/jest.cjs")),
        "jest.config.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/jest.config.mjs"
        )),
        "jestReporter.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/jestReporter.mjs"
        )),
        "jestRuntime.cjs" => Some(include_bytes!(
            "../runtime-assets/javascript/jestRuntime.cjs"
        )),
        "launchSupervisor.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/launchSupervisor.mjs"
        )),
        "nodeAssert.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/nodeAssert.mjs"
        )),
        "nodeAssertAdapter.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/nodeAssertAdapter.mjs"
        )),
        "nodeAssertStrict.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/nodeAssertStrict.mjs"
        )),
        "nodeTest.mjs" => Some(include_bytes!("../runtime-assets/javascript/nodeTest.mjs")),
        "playwright.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/playwright.mjs"
        )),
        "playwrightReporter.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/playwrightReporter.mjs"
        )),
        "provenance.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/provenance.mjs"
        )),
        "register.mjs" => Some(include_bytes!("../runtime-assets/javascript/register.mjs")),
        "resolve-loader.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/resolve-loader.mjs"
        )),
        "runnerEvidence.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/runnerEvidence.mjs"
        )),
        "runtime.mjs" => Some(include_bytes!("../runtime-assets/javascript/runtime.mjs")),
        "transport.mjs" => Some(include_bytes!("../runtime-assets/javascript/transport.mjs")),
        "vitest.mjs" => Some(include_bytes!("../runtime-assets/javascript/vitest.mjs")),
        "vitestBrowser.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/vitestBrowser.mjs"
        )),
        "vitestReporter.mjs" => Some(include_bytes!(
            "../runtime-assets/javascript/vitestReporter.mjs"
        )),
        _ => None,
    }
}

fn unique() -> String {
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

#[cfg(not(windows))]
fn create_directory_all(path: &Path) -> Result<(), JavascriptFrontendError> {
    SETUP.directories.fetch_add(1, Ordering::Relaxed);
    timed(&SETUP.directory_ns, || {
        fs::create_dir_all(path).map_err(|source| io_error(path, source))
    })
}

#[cfg(windows)]
fn create_directory_all(path: &Path) -> Result<(), JavascriptFrontendError> {
    // Windows scanners and just-closed directory handles reject creation of a
    // brand-new path with ERROR_ACCESS_DENIED for as long as they hold the
    // parent open. On a hosted runner with real-time scanning that is not
    // milliseconds: the first Windows build exhausted eleven 20 ms retries on
    // the generated node_modules directory right after the mirror had filled
    // its sibling with junctions. Back off up to a few seconds against the
    // exact owned path -- never broaden or redirect the target -- and when it
    // still fails, say what every ancestor was, so a failure on a machine we
    // cannot see is a diagnosis rather than a guess.
    const ATTEMPTS: usize = 16;
    let started = std::time::Instant::now();
    SETUP.directories.fetch_add(1, Ordering::Relaxed);
    let mut delay = std::time::Duration::from_millis(20);
    for attempt in 0..ATTEMPTS {
        match fs::create_dir_all(path) {
            Ok(()) => {
                account(&SETUP.directory_ns, started);
                return Ok(());
            }
            Err(source)
                if source.kind() == io::ErrorKind::PermissionDenied && attempt + 1 < ATTEMPTS =>
            {
                SETUP.directory_retries.fetch_add(1, Ordering::Relaxed);
                std::thread::sleep(delay);
                delay = (delay * 2).min(std::time::Duration::from_millis(500));
            }
            Err(source) => {
                account(&SETUP.directory_ns, started);
                let detail = format!(
                    "{source} (after {} attempt(s) over {:?}; ancestors: {})",
                    attempt + 1,
                    started.elapsed(),
                    describe_ancestors(path)
                );
                return Err(io_error(path, io::Error::new(source.kind(), detail)));
            }
        }
    }
    unreachable!("the final directory-creation attempt always returns")
}

/// One line per path component from the root down: whether it exists and as
/// what. `symlink_metadata` is used so a reparse point is reported as a link
/// rather than as whatever it points to.
#[cfg_attr(not(windows), allow(dead_code))]
fn describe_ancestors(path: &Path) -> String {
    let mut current = PathBuf::new();
    let mut parts = Vec::new();
    for component in path.components() {
        current.push(component.as_os_str());
        let state = match fs::symlink_metadata(&current) {
            Ok(metadata) if metadata.file_type().is_symlink() => "link",
            Ok(metadata) if metadata.file_type().is_dir() => "dir",
            Ok(_) => "file",
            // A component below a file is "not a directory" on Unix and "path
            // not found" on Windows; either way nothing exists there.
            Err(error)
                if matches!(
                    error.kind(),
                    io::ErrorKind::NotFound | io::ErrorKind::NotADirectory
                ) =>
            {
                "missing"
            }
            Err(error) => return format!("{} -> {error}", current.display()),
        };
        parts.push(format!("{}={state}", current.display()));
    }
    parts.join("; ")
}

fn atomic_write(path: &Path, contents: &[u8]) -> Result<(), JavascriptFrontendError> {
    let parent = path
        .parent()
        .ok_or_else(|| JavascriptFrontendError::UnsafeSourcePath(path.display().to_string()))?;
    let temporary = parent.join(format!(".supercov-write-{}", unique()));
    let result = (|| {
        let open = || {
            OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(&temporary)
        };
        let opened = timed(&SETUP.create_ns, open);
        let mut output = match opened {
            Ok(output) => output,
            Err(source) if source.kind() == io::ErrorKind::NotFound => {
                create_directory_all(parent)?;
                timed(&SETUP.create_ns, open).map_err(|source| io_error(&temporary, source))?
            }
            Err(source) => return Err(io_error(&temporary, source)),
        };
        timed(&SETUP.write_ns, || output.write_all(contents))
            .map_err(|source| io_error(&temporary, source))?;
        // This file is not forced to disk, deliberately. Everything the
        // frontend writes lives in the regenerable workspace cache and is
        // listed in `frontend_artifact_paths`: a later run either rewrites it
        // from the embedded assets and the project's sources, or restores it
        // from the frontend cache, which verifies each artifact's sha256 when
        // it reads the cache and again when it restores it, while mirrored
        // sources are pruned and re-copied every run. A file left half-written
        // by a crash therefore cannot be read back as if it were whole: it
        // fails its digest and is regenerated. `rename` still publishes each
        // file atomically, so no reader in this run can observe a partial one.
        // What is given up is only surviving a power loss for files the next
        // run rebuilds anyway.
        //
        // What it buys is the phase. Preparing a two-file fixture writes 61
        // files, and the syncs were most of the wait: 240-260 ms of a 290-310
        // ms phase on a Windows runner, and 190 ms of file sync plus 180 ms of
        // directory sync in a 400 ms phase on macOS. Both become 14-55 ms. A
        // Windows probe once measured this same phase at 18.7 s, which is a
        // per-sync latency of about 300 ms; a scanner busy enough to do that
        // no longer has anything here to block on.
        //
        // Durability that does matter -- evidence, run state, cache metadata
        // -- goes through `lifecycle::atomic_write`, which still syncs.
        timed(&SETUP.rename_ns, || fs::rename(&temporary, path))
            .map_err(|source| io_error(path, source))?;
        SETUP.files.fetch_add(1, Ordering::Relaxed);
        SETUP
            .bytes
            .fetch_add(contents.len() as u64, Ordering::Relaxed);
        Ok(())
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary);
    }
    result
}

fn checked_source_path(workspace: &Path, file: &str) -> Result<PathBuf, JavascriptFrontendError> {
    let relative = Path::new(file);
    if relative.is_absolute()
        || relative
            .components()
            .any(|component| !matches!(component, std::path::Component::Normal(_)))
    {
        return Err(JavascriptFrontendError::UnsafeSourcePath(file.to_owned()));
    }
    Ok(workspace.join(relative))
}

fn runtime_specifier(file: &str, name: &str) -> Result<String, JavascriptFrontendError> {
    let relative = Path::new(file);
    if relative.is_absolute()
        || relative
            .components()
            .any(|component| !matches!(component, std::path::Component::Normal(_)))
    {
        return Err(JavascriptFrontendError::UnsafeSourcePath(file.to_owned()));
    }
    let depth = relative
        .parent()
        .map_or(0, |parent| parent.components().count());
    Ok(if depth == 0 {
        format!("./.supercov/node_modules/{name}")
    } else {
        format!("{}.supercov/node_modules/{name}", "../".repeat(depth))
    })
}

/// The banner that exempts an instrumented source from the host project's lint
/// and type policy. The disable line comes FIRST so the host's own
/// ban-ts-comment rule cannot reject the `@ts-nocheck` below it: Next.js lints
/// instrumented sources during `next build`, and a real monorepo failed on
/// every route file. Generated and instrumented code is immune to host lint
/// policy as a class.
const GENERATED_SOURCE_BANNER: &str =
    "/* eslint-disable */\n// @ts-nocheck -- generated coverage workspace only\n";

/// Prefix `code` with that banner, keeping a shebang on the first line. `#!`
/// anywhere else is a parse error TypeScript reports as TS18026, which
/// `@ts-nocheck` cannot suppress because it is syntax and not semantics, so a
/// banner in front of it failed the build of every project whose entry point
/// is executable.
fn generated_source_banner(code: &str) -> String {
    let Some(rest) = code.strip_prefix("#!") else {
        return format!("{GENERATED_SOURCE_BANNER}{code}");
    };
    let (line, remainder) = rest.split_once('\n').unwrap_or((rest, ""));
    format!("#!{line}\n{GENERATED_SOURCE_BANNER}{remainder}")
}

fn isolate_runtime(source: &str, collector_id: &str) -> Result<String, JavascriptFrontendError> {
    // Generated runtime files sit inside the lint graph of bundlers that lint
    // whatever they compile (Next.js does), so they must disarm host lint
    // policy the same way the Rust runtime does with #[allow(warnings)].
    let source = format!("/* eslint-disable */\n{source}");
    let source = source.as_str();
    let double = format!("runtimeInstanceToken = \"{RUNTIME_INSTANCE_MARKER}\"");
    let single = format!("runtimeInstanceToken = '{RUNTIME_INSTANCE_MARKER}'");
    if let Some(index) = source.find(&double) {
        let mut isolated = source.to_owned();
        isolated.replace_range(
            index..index + double.len(),
            &format!("runtimeInstanceToken = \"{collector_id}\""),
        );
        return Ok(isolated);
    }
    if let Some(index) = source.find(&single) {
        let mut isolated = source.to_owned();
        isolated.replace_range(
            index..index + single.len(),
            &format!("runtimeInstanceToken = '{collector_id}'"),
        );
        return Ok(isolated);
    }
    Err(JavascriptFrontendError::MissingRuntimeMarker)
}

/// Inline `map` into `code` as a data-URL source map whose single source is the
/// ORIGINAL project file, with the original text embedded.
///
/// The instrumented file may have banner lines prepended AFTER the map was
/// computed (`/* eslint-disable */` and `@ts-nocheck`); VLQ mappings are
/// generated-line-relative with one `;` per line, so the map is shifted by
/// prefixing one semicolon per banner line rather than re-encoding tokens. A
/// shebang keeps the first line and maps to itself, so the banner below it
/// shifts everything after by the same amount.
fn inline_instrumentation_map(
    code: &str,
    map: Option<&serde_json::Value>,
    original_path: &Path,
    original_source: &str,
) -> Option<String> {
    let map = map?.clone();
    let mut map = map;
    let object = map.as_object_mut()?;
    let banner_lines = code
        .lines()
        .skip(usize::from(code.starts_with("#!")))
        .take_while(|line| {
            line.starts_with("/* eslint-disable */") || line.starts_with("// @ts-nocheck")
        })
        .count();
    if banner_lines > 0 {
        let mappings = object.get("mappings")?.as_str()?.to_owned();
        object.insert(
            "mappings".into(),
            serde_json::Value::String(format!("{}{}", ";".repeat(banner_lines), mappings)),
        );
    }
    object.insert(
        "sources".into(),
        serde_json::json!([original_path.display().to_string()]),
    );
    object.insert(
        "sourcesContent".into(),
        serde_json::json!([original_source]),
    );
    let payload = serde_json::to_string(&map).ok()?;
    use base64::Engine as _;
    let encoded = base64::engine::general_purpose::STANDARD.encode(payload);
    Some(format!(
        "{code}\n//# sourceMappingURL=data:application/json;base64,{encoded}\n"
    ))
}

/// Target-language shims are embedded in the Rust engine. Keeping a trailing
/// source-map directive would make Node and browser tooling look for source
/// maps that intentionally are not part of the runtime distribution.
fn strip_source_map_reference(mut bytes: Vec<u8>) -> Vec<u8> {
    const MARKER: &[u8] = b"\n//# sourceMappingURL=";
    if let Some(index) = bytes
        .windows(MARKER.len())
        .rposition(|window| window == MARKER)
    {
        let suffix = &bytes[index + MARKER.len()..];
        let suffix = suffix.strip_suffix(b"\n").unwrap_or(suffix);
        let suffix = suffix.strip_suffix(b"\r").unwrap_or(suffix);
        if !suffix.contains(&b'\n') && !suffix.contains(&b'\r') {
            bytes.truncate(index + 1);
        }
    }
    bytes
}

fn copy_runtime(generated: &Path, collector_id: &str) -> Result<(), JavascriptFrontendError> {
    create_directory_all(generated)?;
    atomic_write(
        &generated.join("package.json"),
        b"{\"private\":true,\"type\":\"module\"}\n",
    )?;
    for name in RUNTIME_FILES {
        let destination = generated.join(name);
        let source_path = PathBuf::from(format!("embedded:{name}"));
        let bytes = embedded_runtime(name)
            .expect("every declared runtime file must have an embedded asset")
            .to_vec();
        let bytes = strip_source_map_reference(bytes);
        if *name == "runtime.mjs" {
            let text = String::from_utf8(bytes).map_err(|source| {
                io_error(
                    &source_path,
                    io::Error::new(io::ErrorKind::InvalidData, source),
                )
            })?;
            atomic_write(
                &destination,
                isolate_runtime(&text, collector_id)?.as_bytes(),
            )?;
            atomic_write(
                &generated.join("applicationRuntime.mjs"),
                isolate_runtime(&text, &format!("{collector_id}-application"))?.as_bytes(),
            )?;
        } else {
            atomic_write(&destination, &bytes)?;
        }
    }
    atomic_write(
        &generated.join("runtime.d.mts"),
        // Generated files must be immune to the HOST project's lint policy --
        // the same rule the Rust runtime enforces with #[allow(warnings)].
        // Next.js runs the project's eslint over the build graph, and
        // @typescript-eslint/no-explicit-any turned every `any` below into a
        // hard "Failed to compile" for a real monorepo.
        b"/* eslint-disable */\n\
export declare function coverageHit(...args: any[]): any;\n\
export declare function selectionBegin(...args: any[]): any;\n\
export declare function selectionRight(...args: any[]): any;\n\
export declare function selectionEnd(...args: any[]): any;\n\
export declare function optionalSelect(...args: any[]): any;\n\
export declare function optionalCallBegin(...args: any[]): any;\n\
export declare function optionalCallReached(...args: any[]): any;\n\
export declare function optionalCallContinued(...args: any[]): any;\n\
export declare function optionalCallEnd(...args: any[]): any;\n\
export declare function defaultSelected(...args: any[]): any;\n\
export declare function defaultEntered(...args: any[]): any;\n\
export declare function tryBegin(...args: any[]): any;\n\
export declare function tryCatch(...args: any[]): any;\n\
export declare function tryEnd(...args: any[]): any;\n\
export declare function loopBegin(...args: any[]): any;\n\
export declare function loopEntered(...args: any[]): any;\n\
export declare function loopEnd(...args: any[]): any;\n\
export declare function mcdcBegin(...args: any[]): any;\n\
export declare function mcdcCondition(...args: any[]): any;\n\
export declare function mcdcEnd(...args: any[]): any;\n\
export declare function registerProbeV2(...args: any[]): any;\n\
export declare function coverageHitV2(...args: any[]): any;\n\
export declare function mcdcEndV2(...args: any[]): any;\n",
    )?;
    Ok(())
}

fn generic_runtime_binding(
    workspace: &Path,
    project: &CoverageProject,
    source_path: &Path,
    generated: &Path,
) -> Result<String, JavascriptFrontendError> {
    let mut hosts = project
        .source_roots
        .iter()
        .filter_map(|root| {
            let candidate = workspace.join(root);
            if candidate.is_dir() && source_path.strip_prefix(&candidate).is_ok() {
                Some(candidate)
            } else if candidate.is_file() && candidate == source_path {
                candidate.parent().map(Path::to_owned)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    hosts.sort_by_key(|path| std::cmp::Reverse(path.components().count()));
    let host = hosts
        .into_iter()
        .next()
        .unwrap_or_else(|| workspace.to_owned());
    let runtime_directory = host.join(".supercov/node_modules");
    fs::create_dir_all(&runtime_directory)
        .map_err(|source| io_error(&runtime_directory, source))?;
    // A bundler may externalize the node_modules import instead of compiling
    // it, leaving Node to interpret the .js file at run time.
    atomic_write(
        &runtime_directory.join("package.json"),
        b"{\"private\":true,\"type\":\"module\"}\n",
    )?;
    for name in ["runtime.mjs", "runtime.d.mts"] {
        let source = generated.join("node_modules").join(name);
        let destination = runtime_directory.join(name);
        let contents = fs::read(&source).map_err(|error| io_error(&source, error))?;
        atomic_write(&destination, &contents)?;
    }
    // A compiler moves the file to its output directory, where a bundler may
    // read it next: lru-cache compiles src/ into dist/esm/ with tshy and
    // bundles that with esbuild, which could not resolve a path relative to
    // src/. There the runtime is imported by absolute path. A bundler that
    // reads the sources where they are keeps the relative one: Turbopack
    // refuses an absolute import ("server relative imports are not
    // implemented yet") and Parcel reads one as relative to its root. Node
    // resolves either (resolve-loader.mjs).
    if project.relocating_build {
        return Ok(runtime_directory
            .join("runtime.mjs")
            .to_string_lossy()
            .replace('\\', "/"));
    }
    let parent = source_path.parent().ok_or_else(|| {
        JavascriptFrontendError::UnsafeSourcePath(source_path.display().to_string())
    })?;
    let local = parent.strip_prefix(&host).map_err(|_| {
        JavascriptFrontendError::UnsafeSourcePath(source_path.display().to_string())
    })?;
    let depth = local.components().count();
    Ok(if depth == 0 {
        "./.supercov/node_modules/runtime.mjs".into()
    } else {
        format!("{}.supercov/node_modules/runtime.mjs", "../".repeat(depth))
    })
}

fn limitation_from_source(value: &SourceLimitation) -> CandidateLimitation {
    CandidateLimitation {
        id: value.id.clone(),
        kind: value.kind.clone(),
        file: value.file.clone(),
        line: value.line,
        column: value.column,
        source: value.source.clone(),
        reason: value.reason.clone(),
    }
}

/// Install the runtime in a file that reads it from a global, before the file
/// reads it.
///
/// A file with no `import` or `export` cannot import the runtime, so it reads
/// `globalThis.__supercovRuntime`, which the page or the preload sets. Nothing
/// sets it in a worker: Actual's database worker, a classic script in its
/// built bundle, stopped on `Cannot read properties of undefined (reading
/// 'mcdcBegin')` and the application never started. Such a file carries a
/// guarded copy of the runtime, which does nothing where a runtime is already
/// installed. In a browser suite the same goes for directly served files,
/// which read `__SUPERCOV_DIRECT_RUNTIME__` and may be loaded by a worker.
/// The copy is inserted as whole lines before the helper declarations, and the
/// source map gains as many empty lines, so every mapped position still holds.
fn bootstrap_runtime(
    output: &mut crate::js_instrumenter::CandidateOutput,
    runtime_source: &str,
    browser_suite: bool,
) {
    let Some(binding) = output.runtime.as_ref() else {
        return;
    };
    let script = format!(
        "{} = globalThis.__supercovRuntime.mcdcBegin",
        binding.mcdc_begin
    );
    let direct = format!(
        "{} = globalThis.__SUPERCOV_DIRECT_RUNTIME__.mcdcBegin",
        binding.mcdc_begin
    );
    let Some(found) = output
        .code
        .find(&script)
        .or_else(|| browser_suite.then(|| output.code.find(&direct)).flatten())
    else {
        return;
    };
    let Some(export_start) = runtime_source.rfind("\nexport {") else {
        return;
    };
    let offset = output.code[..found]
        .rfind('\n')
        .map_or(0, |newline| newline + 1);
    let prelude = format!(
        "(() => {{ if (!globalThis.__SUPERCOV_DIRECT_RUNTIME__) {{\n{}\n}} if (globalThis.__supercovRuntime == null) globalThis.__supercovRuntime = globalThis.__SUPERCOV_DIRECT_RUNTIME__; }})();\n",
        &runtime_source[..export_start]
    );
    let line = output.code[..offset].matches('\n').count();
    let added = prelude.matches('\n').count();
    if let Some(serde_json::Value::String(mappings)) =
        output.map.as_mut().and_then(|map| map.get_mut("mappings"))
    {
        let mut lines: Vec<&str> = mappings.split(';').collect();
        if line <= lines.len() {
            lines.splice(line..line, std::iter::repeat_n("", added));
            *mappings = lines.join(";");
        }
    }
    output.code.insert_str(offset, &prelude);
}

fn relocated_project_file(
    workspace: &Path,
    project: &CoverageProject,
    source: Option<&PathBuf>,
) -> Option<PathBuf> {
    let source = source?;
    let relative = source.strip_prefix(&project.root).ok()?;
    Some(workspace.join(relative))
}

fn write_vitest_config(
    workspace: &Path,
    project: &CoverageProject,
    generated: &Path,
) -> Result<PathBuf, JavascriptFrontendError> {
    let path = generated.join("vitest.config.mjs");
    let original = relocated_project_file(workspace, project, project.vitest_config.as_ref())
        .map(|path| path.display().to_string());
    let original = serde_json::to_string(&original).map_err(JavascriptFrontendError::Serialize)?;
    let source = format!(
        "import {{ createRequire }} from 'node:module';\n\
         import {{ pathToFileURL }} from 'node:url';\n\
         // pnpm's strict layout does not hoist vite to the project root: it\n\
         // lives inside vitest's virtual store, so a bare 'vite' specifier\n\
         // resolved from this generated file fails. Vitest depends on vite, so\n\
         // fall back to resolving it through vitest's own tree rather than\n\
         // requiring the project to hoist anything.\n\
         const supercovRequire = createRequire(import.meta.url);\n\
         const supercovLoadVite = async () => {{\n\
           try {{\n\
             return await import('vite');\n\
           }} catch (error) {{\n\
             let entry;\n\
             try {{\n\
               entry = createRequire(supercovRequire.resolve('vitest')).resolve('vite');\n\
             }} catch {{\n\
               throw error;\n\
             }}\n\
             return await import(pathToFileURL(entry).href);\n\
           }}\n\
         }};\n\
         const viteNamespace = await supercovLoadVite();\n\
         import {{ resolve }} from 'node:path';\n\
         import SupercovVitestReporter from './node_modules/vitestReporter.mjs';\n\
         import {{ supercovBrowserCommands, supercovViteInstrumentation }} from './viteInstrumentation.mjs';\n\
         const vite = viteNamespace.default ?? viteNamespace;\n\
         const {{ loadConfigFromFile, mergeConfig }} = vite;\n\
         const discoveredConfig = {original};\n\
         // Browser Mode runs the test file in the browser, so the node setup --\n\
         // which reaches node:fs to write evidence -- cannot load there. Vite\n\
         // externalises it and the suite fails before collecting a test.\n\
         const supercovBrowserMode = (config) => Boolean(config?.test?.browser?.enabled);\n\
         const supercovSetupFile = (config) =>\n\
           supercovBrowserMode(config)\n\
             ? '.supercov/node_modules/vitestBrowser.mjs'\n\
             : '.supercov/node_modules/vitest.mjs';\n\
         // Evidence leaves the browser over Vitest's own command channel, so\n\
         // the command is registered only for the mode that uses it.\n\
         const supercovBrowserTest = (config) =>\n\
           supercovBrowserMode(config)\n\
             ? {{ browser: {{ commands: supercovBrowserCommands(process.cwd()) }} }}\n\
             : {{}};\n\
         // Child projects do not inherit root setupFiles. Resolve each project's\n\
         // environment after Vitest has loaded file/glob/inline configs and\n\
         // applied --project, preserving the runner's own config semantics.\n\
         const configureProjects = (projects) => {{\n\
           const nodeSetup = resolve(process.cwd(), '.supercov/node_modules/vitest.mjs');\n\
           const browserSetup = resolve(process.cwd(), '.supercov/node_modules/vitestBrowser.mjs');\n\
           for (const project of projects ?? []) {{\n\
             const test = project.config;\n\
             const browser = Boolean(test.browser?.enabled);\n\
             const setup = browser ? browserSetup : nodeSetup;\n\
             test.setupFiles = [setup, ...(test.setupFiles ?? []).filter(file => file !== nodeSetup && file !== browserSetup)];\n\
             test.maxConcurrency = 1;\n\
             if (browser) {{\n\
               const commands = supercovBrowserCommands(process.cwd());\n\
               test.browser.commands = {{ ...test.browser.commands, ...commands }};\n\
               // Browser instances can already exist when reporters initialize.\n\
               // Their parent generates the browser command exports.\n\
               const server = project.browser?.parent ?? project.browser;\n\
               if (server?.commands) Object.assign(server.commands, commands);\n\
             }}\n\
           }}\n\
         }};\n\
         export default async function supercovVitestConfig(env) {{\n\
           const originalPath = process.env.SUPERCOV_ORIGINAL_VITEST_CONFIG || discoveredConfig;\n\
           const loaded = originalPath ? await loadConfigFromFile(env, originalPath, process.cwd()) : undefined;\n\
           const config = mergeConfig(loaded?.config ?? {{}}, {{\n\
             cacheDir: resolve(process.cwd(), '.supercov/vitest-cache'),\n\
             plugins: [supercovViteInstrumentation(process.cwd())],\n\
             test: {{ setupFiles: [resolve(process.cwd(), supercovSetupFile(loaded?.config))], maxConcurrency: 1, ...supercovBrowserTest(loaded?.config) }},\n\
           }});\n\
           const configuredReporters = loaded?.config?.test?.reporters;\n\
           config.test ??= {{}};\n\
           config.test.reporters = configuredReporters\n\
             ? [...(Array.isArray(configuredReporters) ? configuredReporters : [configuredReporters]), new SupercovVitestReporter(configureProjects)]\n\
             : ['default', new SupercovVitestReporter(configureProjects)];\n\
           return config;\n\
         }}\n"
    );
    atomic_write(&path, source.as_bytes())?;
    Ok(path)
}

fn configure_playwright_runtime(
    generated: &Path,
    project: &CoverageProject,
) -> Result<(), JavascriptFrontendError> {
    let adapter_path = generated.join("playwright.mjs");
    let mut adapter =
        fs::read_to_string(&adapter_path).map_err(|source| io_error(&adapter_path, source))?;
    adapter = adapter
        .replace("__SUPERCOV_PLAYWRIGHT_MODULE__", &project.playwright_module)
        .replace(
            "__SUPERCOV_PLAYWRIGHT_TEST_EXPORT__",
            &project.playwright_test_export,
        )
        // Baked in rather than read from the environment alone: pooled
        // runners execute Playwright inside VMs whose environment the host
        // cannot reach, while the generated file rides the workspace mount.
        .replace(
            "__SUPERCOV_PHASE_TIMING__",
            if std::env::var("SUPERCOV_PHASE_TIMING").as_deref() == Ok("1") {
                "1"
            } else {
                "0"
            },
        );
    if project.playwright_module != "@playwright/test" {
        // A facade module exports the project's whole test API, not just the
        // Playwright surface: its full export set must flow through the shim,
        // with only the interception points (`test`, `expect`, the discovered
        // test export) shadowed by the shim's own declarations. The discovered
        // per-name re-exports below stay as a fallback for CommonJS facades,
        // where `export *` only forwards statically detectable names.
        let facade = serde_json::to_string(&project.playwright_module)
            .expect("serializing a module specifier cannot fail");
        adapter = adapter.replace(
            "export * from \"@playwright/test\";",
            &format!("export * from {facade};"),
        );
    }
    let mut exports = Vec::new();
    if project.playwright_test_export != "test" {
        exports.push(format!(
            "export {{ instrumentedTest as {} }};",
            project.playwright_test_export
        ));
    }
    exports.extend(
        project
            .playwright_exports
            .iter()
            .filter(|name| {
                name.as_str() != "test"
                    && name.as_str() != "expect"
                    && *name != &project.playwright_test_export
            })
            .map(|name| {
                let encoded = serde_json::to_string(name)
                    .expect("serializing a JavaScript export name cannot fail");
                format!("export const {name} = __supercovAdapterExport(adapter[{encoded}]);")
            }),
    );
    adapter = adapter.replace("/*__SUPERCOV_ADAPTER_EXPORTS__*/", &exports.join("\n"));
    atomic_write(&adapter_path, adapter.as_bytes())?;

    let loader_path = generated.join("resolve-loader.mjs");
    let loader = fs::read_to_string(&loader_path)
        .map_err(|source| io_error(&loader_path, source))?
        .replace("__SUPERCOV_PLAYWRIGHT_MODULE__", &project.playwright_module);
    atomic_write(&loader_path, loader.as_bytes())
}

fn write_playwright_config(
    workspace: &Path,
    project: &CoverageProject,
    generated: &Path,
) -> Result<PathBuf, JavascriptFrontendError> {
    let path = generated.join("playwright.config.mjs");
    let original = relocated_project_file(workspace, project, project.playwright_config.as_ref());
    let original_import = if let Some(original) = &original {
        let relative = original
            .strip_prefix(workspace)
            .map_err(|_| JavascriptFrontendError::UnsafeSourcePath(original.display().to_string()))?
            .to_string_lossy()
            .replace('\\', "/");
        let specifier = serde_json::to_string(&format!("../{relative}"))
            .map_err(JavascriptFrontendError::Serialize)?;
        format!("import original from {specifier};\n")
    } else {
        "const original = {};\n".into()
    };
    // A TypeScript config in a CommonJS package is transpiled to CommonJS and
    // imported here as its module namespace, `{ __esModule: true, default }`,
    // not as the config. Spreading the namespace lost `testDir`, `use` and
    // `webServer`, and Playwright found no tests. Only an explicitly marked
    // namespace is unwrapped; a config that merely has a `default` key is not.
    let source = format!(
        "import './node_modules/register.mjs';\n\
         import {{ dirname, isAbsolute, relative, resolve }} from 'node:path';\n\
         import {{ fileURLToPath }} from 'node:url';\n\
         {original_import}\
         const configExport = original && original.__esModule === true && Object.prototype.hasOwnProperty.call(original, 'default') ? original.default : original;\n\
         const resolvedValue = typeof configExport === 'function' ? await configExport({{ command: 'test', mode: 'test' }}) : configExport;\n\
         const resolved = resolvedValue ?? {{}};\n\
         const runtimeProjectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');\n\
         const originalDirectory = {};
         const sourceProjectRoot = process.env.SUPERCOV_SOURCE_PROJECT_ROOT;\n\
         const runtimePath = value => {{\n\
           if (!value) return value;\n\
           const absolute = isAbsolute(value) ? value : resolve(originalDirectory, value);\n\
           const local = relative(runtimeProjectRoot, absolute);\n\
           if (local === '' || (!local.startsWith('..') && !isAbsolute(local))) return absolute;\n\
           if (sourceProjectRoot) {{\n\
             const sourceLocal = relative(sourceProjectRoot, absolute);\n\
             if (sourceLocal === '' || (!sourceLocal.startsWith('..') && !isAbsolute(sourceLocal))) return resolve(runtimeProjectRoot, sourceLocal);\n\
           }}\n\
           throw new Error('Supercov refuses a Playwright output/cwd outside the isolated project: ' + absolute);\n\
         }};\n\
         const normalizeWebServer = server => server ? ({{ ...server, cwd: runtimePath(server.cwd ?? originalDirectory) }}) : server;\n\
         const normalized = {{ ...resolved,\n\
           testDir: runtimePath(resolved.testDir),\n\
           outputDir: runtimePath(resolved.outputDir),\n\
           snapshotDir: runtimePath(resolved.snapshotDir),\n\
           projects: resolved.projects?.map(project => ({{ ...project, testDir: runtimePath(project.testDir), outputDir: runtimePath(project.outputDir), snapshotDir: runtimePath(project.snapshotDir) }})),\n\
           webServer: Array.isArray(resolved.webServer) ? resolved.webServer.map(normalizeWebServer) : normalizeWebServer(resolved.webServer),\n\
         }};\n\
         const configuredReporters = normalized.reporter;\n\
         const reporters = configuredReporters\n\
           ? (typeof configuredReporters === 'string' ? [[configuredReporters]] : (Array.isArray(configuredReporters[0]) ? configuredReporters : [configuredReporters]))\n\
           : [['list']];\n\
         const coverageReporter = resolve(runtimeProjectRoot, '.supercov/node_modules/playwrightReporter.mjs');\n\
         export default {{ ...normalized, reporter: [...reporters, [coverageReporter]] }};\n",
        serde_json::to_string(
            &original
                .as_ref()
                .and_then(|path| path.parent())
                .unwrap_or(workspace)
                .display()
                .to_string()
        )
        .map_err(JavascriptFrontendError::Serialize)?
    );
    atomic_write(&path, source.as_bytes())?;
    Ok(path)
}

fn write_vite_config(
    workspace: &Path,
    generated: &Path,
) -> Result<PathBuf, JavascriptFrontendError> {
    let path = generated.join("vite.config.mjs");
    let workspace = serde_json::to_string(&workspace.display().to_string())
        .map_err(JavascriptFrontendError::Serialize)?;
    let source = format!(
        "import {{ createRequire }} from 'node:module';\n\
         import {{ pathToFileURL }} from 'node:url';\n\
         // pnpm's strict layout does not hoist vite to the project root: it\n\
         // lives inside vitest's virtual store, so a bare 'vite' specifier\n\
         // resolved from this generated file fails. Vitest depends on vite, so\n\
         // fall back to resolving it through vitest's own tree rather than\n\
         // requiring the project to hoist anything.\n\
         const supercovRequire = createRequire(import.meta.url);\n\
         const supercovLoadVite = async () => {{\n\
           try {{\n\
             return await import('vite');\n\
           }} catch (error) {{\n\
             let entry;\n\
             try {{\n\
               entry = createRequire(supercovRequire.resolve('vitest')).resolve('vite');\n\
             }} catch {{\n\
               throw error;\n\
             }}\n\
             return await import(pathToFileURL(entry).href);\n\
           }}\n\
         }};\n\
         const viteNamespace = await supercovLoadVite();\n\
         import {{ isAbsolute, relative, resolve }} from 'node:path';\n\
         import {{ supercovViteInstrumentation }} from './viteInstrumentation.mjs';\n\
         const vite = viteNamespace.default ?? viteNamespace;\n\
         const {{ loadConfigFromFile, mergeConfig }} = vite;\n\
         export default async function supercovViteConfig(env) {{\n\
           const isolatedRoot = {workspace};\n\
           const loaded = await loadConfigFromFile(env, undefined, isolatedRoot);\n\
           const config = loaded?.config ?? {{}};\n\
           const relocate = (value, label) => {{\n\
             const absolute = isAbsolute(value) ? value : resolve(isolatedRoot, value);\n\
             const local = relative(isolatedRoot, absolute);\n\
             if (local === '' || (!local.startsWith('..') && !isAbsolute(local))) return absolute;\n\
             throw new Error('Supercov refuses ' + label + ' outside the isolated project: ' + absolute);\n\
           }};\n\
           const relocateOutput = output => output ? ({{ ...output, dir: output.dir ? relocate(output.dir, 'Rollup output') : output.dir, file: output.file ? relocate(output.file, 'Rollup output') : output.file }}) : output;\n\
           const rollupOutput = config.build?.rollupOptions?.output;\n\
           const safe = {{ ...config,\n\
             logLevel: ['1', 'true', 'yes'].includes(process.env.SUPERCOV_VERBOSE ?? process.env.SUPERCOV_DEBUG ?? '') ? config.logLevel : 'error',\n\
             cacheDir: resolve(isolatedRoot, '.supercov/vite-cache'),\n\
             build: {{ ...config.build, outDir: relocate(config.build?.outDir ?? 'dist', 'Vite build output'), rollupOptions: {{ ...config.build?.rollupOptions, output: Array.isArray(rollupOutput) ? rollupOutput.map(relocateOutput) : relocateOutput(rollupOutput) }} }},\n\
           }};\n\
           return mergeConfig(safe, {{ plugins: [supercovViteInstrumentation(isolatedRoot)] }});\n\
         }}\n"
    );
    atomic_write(&path, source.as_bytes())?;
    Ok(path)
}

fn write_vite_transforms(
    generated: &Path,
    transforms: &BTreeMap<String, ViteTransform>,
) -> Result<(), JavascriptFrontendError> {
    let mut payload = serde_json::to_vec(transforms).map_err(JavascriptFrontendError::Serialize)?;
    payload.push(b'\n');
    atomic_write(&generated.join("vite-transforms.json"), &payload)?;
    let adapter = "import { createHash } from 'node:crypto';\n\
import { mkdirSync, readFileSync } from 'node:fs';\n\
import { relative, resolve, sep } from 'node:path';\n\
import { atomicWriteFileSync } from './node_modules/atomic.mjs';\n\
import { inferTestProvenance } from './node_modules/provenance.mjs';\n\
const transforms = JSON.parse(readFileSync(new URL('./vite-transforms.json', import.meta.url), 'utf8'));\n\
const sha256 = value => createHash('sha256').update(value).digest('hex');\n\
// Browser Mode runs the test file in the browser, where none of this is\n\
// reachable: no node:fs to write evidence, no project root to relativise a\n\
// path against, no env to read. Vitest's own browser command channel carries\n\
// what the browser observed to node, which completes the same payload the node\n\
// setup writes -- so one contract keeps one implementation. The command is\n\
// awaited as part of the test, and node learns the test file from Vitest\n\
// rather than from the browser realm, which cannot be trusted to name it.\n\
const supercovEvidenceSuffix = /^[A-Za-z0-9._-]+$/;\n\
export function supercovBrowserCommands(root) {\n\
  return {\n\
    __supercovEvidence(context, payload, suffix) {\n\
      const evidenceDirectory = process.env['SUPERCOV_EVIDENCE_DIR'];\n\
      if (!evidenceDirectory) return;\n\
      // A suffix names one directory under the evidence directory. Anything\n\
      // else is refused rather than resolved, so a malformed one cannot send\n\
      // the write outside the directory it is supposed to stay in.\n\
      if (typeof suffix !== 'string' || !supercovEvidenceSuffix.test(suffix))\n\
        throw new Error('Supercov refused an unusable evidence suffix: ' + suffix);\n\
      const absolute = context.testPath;\n\
      const testFile = absolute ? relative(root, absolute).split(sep).join('/') : undefined;\n\
      const projectName = payload.projectName ?? context.project?.name;\n\
      delete payload.projectName;\n\
      // The browser has no environment to read, so the run identity is stamped\n\
      // here rather than sent from a realm that cannot know it.\n\
      const runId = process.env['SUPERCOV_RUN_ID'];\n\
      if (runId && payload.scope) payload.scope.runId = runId;\n\
      const complete = Object.assign({}, payload, testFile ? { testFile } : {}, {\n\
        provenance: inferTestProvenance({\n\
          runner: 'vitest',\n\
          file: testFile,\n\
          project: projectName,\n\
          explicitKind: process.env['SUPERCOV_TEST_KIND'],\n\
        }),\n\
      });\n\
      const directory = resolve(root, evidenceDirectory, suffix);\n\
      mkdirSync(directory, { recursive: true });\n\
      atomicWriteFileSync(resolve(directory, 'mcdc.json'), JSON.stringify(complete) + '\\n');\n\
    },\n\
  };\n\
}\n\
export function supercovViteInstrumentation(root) {\n\
  const runtimePath = resolve(root, '.supercov/node_modules/applicationRuntime.mjs');\n\
  return {\n\
    name: 'supercov-rust-instrumentation',\n\
    enforce: 'pre',\n\
    resolveId(id) { return id === 'virtual:supercov-runtime' ? runtimePath : null; },\n\
    transform(code, rawId) {\n\
      const id = rawId.split('?')[0] ?? rawId;\n\
      const local = relative(root, id).split(sep).join('/');\n\
      const transformed = transforms[local];\n\
      if (!transformed) return null;\n\
      if (sha256(code) !== transformed.sourceSha256)\n\
        throw new Error('Supercov source changed before Rust instrumentation: ' + local);\n\
      return { code: transformed.code, map: transformed.map ?? null };\n\
    },\n\
  };\n\
}\n";
    atomic_write(
        &generated.join("viteInstrumentation.mjs"),
        adapter.as_bytes(),
    )
}

/// Prepare the complete JavaScript frontend inside an isolated workspace.
/// The source project is read only through the copied workspace inventory.
pub fn prepare_javascript_frontend(
    workspace: &Path,
    project: &CoverageProject,
    collector_id: &str,
    cache_key: &str,
    command: &[String],
) -> Result<PreparedJavascriptFrontend, JavascriptFrontendError> {
    let generated = workspace.join(".supercov");
    // Runtime code files live under a node_modules segment: Node attributes
    // stack frames from node_modules paths to dependency infrastructure, so
    // deprecation warnings the user's own run would suppress (Node's
    // isInsideNodeModules check) stay suppressed when Supercov's module
    // hooks are on the call path.
    let runtime_directory = generated.join("node_modules");
    timed(&SETUP.runtime_ns, || {
        copy_runtime(&runtime_directory, collector_id)
    })?;
    let configuration_started = Instant::now();
    configure_playwright_runtime(&runtime_directory, project)?;
    let playwright_config_path = write_playwright_config(workspace, project, &generated)?;
    let vite_config_path = write_vite_config(workspace, &generated)?;
    let vitest_config_path = write_vitest_config(workspace, project, &generated)?;
    account(&SETUP.config_ns, configuration_started);

    let mut exclusions = Vec::new();
    let mut decisions = BTreeMap::new();
    let mut points = BTreeMap::new();
    let mut branches = BTreeMap::new();
    let mut limitations = BTreeMap::new();
    let mut vite_transforms = BTreeMap::new();
    for limitation in &project.source_limitations {
        limitations.insert(limitation.id.clone(), limitation_from_source(limitation));
    }

    let runtime_path = runtime_directory.join("runtime.mjs");
    let standalone_runtime =
        fs::read_to_string(&runtime_path).map_err(|source| io_error(&runtime_path, source))?;
    // debug's karma bundles its sources with browserify and runs them in
    // Chrome, where nothing had installed the runtime: every file failed on
    // its first line ("reading 'mcdcBegin'"). The browser's evidence has no
    // adapter to reach the run, but its tests pass as they do without it.
    let browser_suite = project.playwright_config.is_some() || project.browser_runner;
    let mut authored = BTreeSet::new();
    let sources_started = Instant::now();
    for file in &project.source_files {
        let path = checked_source_path(workspace, file)?;
        let source = fs::read_to_string(&path).map_err(|source| io_error(&path, source))?;
        let capability_wrapper = runtime_specifier(file, "capability.mjs")?;
        let elide = crate::typescript_imports::elides_type_imports(
            workspace,
            file,
            command,
            &project.build_command,
        );
        let mut output = timed(&SETUP.instrument_ns, || {
            instrument_with_import_policy(
                &source,
                file,
                &capability_wrapper,
                project.build_adapter == BuildAdapter::Direct,
                elide,
            )
        })
        .map_err(|source| JavascriptFrontendError::Instrument {
            file: file.clone(),
            source,
        })?;
        if project.build_adapter == BuildAdapter::Generic {
            let runtime = generic_runtime_binding(workspace, project, &path, &generated)?;
            output.code = output.code.replace("virtual:supercov-runtime", &runtime);
        }
        bootstrap_runtime(&mut output, &standalone_runtime, browser_suite);
        // Direct commands can compile TypeScript themselves (`npm test` may
        // begin with `tsc`), so they need the same generated-source exemption
        // as Supercov's separately orchestrated generic build. Instrumentation
        // necessarily changes control-flow expressions in ways the host type
        // checker cannot narrow through, while source syntax remains covered
        // by the parser before this banner is applied.
        if project.build_adapter != BuildAdapter::Vite
            && matches!(
                path.extension().and_then(|value| value.to_str()),
                Some("ts" | "tsx" | "mts" | "cts")
            )
        {
            output.code = generated_source_banner(&output.code);
        }
        if project.build_adapter == BuildAdapter::Vite {
            vite_transforms.insert(
                file.clone(),
                ViteTransform {
                    source_sha256: format!("{:x}", Sha256::digest(source.as_bytes())),
                    code: output.code.clone(),
                    map: output.map.clone(),
                },
            );
        } else {
            // Attach the instrumentation source map inline, pointed at the
            // ORIGINAL project file with the original text embedded. Node runs
            // with --enable-source-maps, and tsx/esbuild chain input maps, so
            // stack traces show the user's real path and line numbers instead
            // of instrumented workspace positions -- Supercov stays invisible
            // in errors. Without this the map was generated and then dropped.
            let code = match inline_instrumentation_map(
                &output.code,
                output.map.as_ref(),
                &project.root.join(file),
                &source,
            ) {
                Some(code) => code,
                None => output.code.clone(),
            };
            keep_authored(workspace, &mut authored, file, &source)?;
            atomic_write(&path, code.as_bytes())?;
        }
        exclusions.extend(output.excluded_statements);
        for value in output.decisions {
            decisions.insert(value.id.clone(), value);
        }
        for value in output.points {
            points.insert(value.id.clone(), value);
        }
        for value in output.branches {
            branches.insert(value.id.clone(), value);
        }
        for value in output.coverage_limitations {
            limitations.insert(value.id.clone(), value);
        }
    }
    account(&SETUP.sources_ns, sources_started);
    write_vite_transforms(&generated, &vite_transforms)?;

    let assertions_started = Instant::now();
    let mut assertion_calls = 0;
    for entry in &project.source_scope.entries {
        let path = checked_source_path(workspace, &entry.file)?;
        let Ok(source) = fs::read_to_string(&path) else {
            continue;
        };
        let capability_wrapper = (!project.source_files.contains(&entry.file))
            .then(|| runtime_specifier(&entry.file, "capability.mjs"))
            .transpose()?;
        let assertion_runtime = runtime_specifier(&entry.file, "runtime.mjs")?;
        let output = crate::js_instrumenter::instrument_node_assertion_phases_with_runtime_imports(
            &source,
            &entry.file,
            std::slice::from_ref(&project.playwright_module),
            capability_wrapper.as_deref(),
            Some(&assertion_runtime),
        )
        .map_err(|source| JavascriptFrontendError::Instrument {
            file: entry.file.clone(),
            source,
        })?;
        let coverage_transformed_by_vite = project.build_adapter == BuildAdapter::Vite
            && project.source_files.contains(&entry.file);
        if (output.assertions > 0 || output.capability_imports > 0) && !coverage_transformed_by_vite
        {
            keep_authored(workspace, &mut authored, &entry.file, &source)?;
            atomic_write(&path, output.code.as_bytes())?;
            assertion_calls += output.assertions;
        }
    }

    account(&SETUP.assertion_ns, assertions_started);

    let mut manifest = JavascriptManifest {
        decisions: decisions.into_values().collect(),
        points: points.into_values().collect(),
        branches: branches.into_values().collect(),
        limitations: limitations.into_values().collect(),
        scope: project.source_scope.clone(),
    };
    manifest.decisions.sort_by_key(|value| {
        (
            value.file.clone(),
            value.line,
            value.column,
            value.id.clone(),
        )
    });
    manifest.points.sort_by_key(|value| {
        (
            value.file.clone(),
            value.line,
            value.column,
            value.id.clone(),
        )
    });
    manifest.branches.sort_by_key(|value| {
        (
            value.file.clone(),
            value.line,
            value.column,
            value.id.clone(),
        )
    });
    manifest.limitations.sort_by_key(|value| {
        (
            value.file.clone(),
            value.line,
            value.column,
            value.id.clone(),
        )
    });

    atomic_write(
        &workspace.join(AUTHORED_LIST),
        &serde_json::to_vec(&authored).map_err(JavascriptFrontendError::Serialize)?,
    )?;
    atomic_write(
        &generated.join("statement-exclusions.json"),
        &serde_json::to_vec(&exclusions).map_err(JavascriptFrontendError::Serialize)?,
    )?;
    let manifest_path = generated.join("manifest.json");
    let mut encoded =
        serde_json::to_vec_pretty(&manifest).map_err(JavascriptFrontendError::Serialize)?;
    encoded.push(b'\n');
    atomic_write(&manifest_path, &encoded)?;
    atomic_write(
        &generated.join("instrumentation-complete"),
        b"coverage-completeness-v2\n",
    )?;
    timed(&SETUP.cache_ns, || {
        write_javascript_frontend_cache(workspace, project, cache_key, assertion_calls)
    })?;
    Ok(PreparedJavascriptFrontend {
        manifest,
        manifest_path,
        preload_path: generated.join("node_modules/register.mjs"),
        playwright_config_path,
        vite_config_path,
        vitest_config_path,
        assertion_calls,
    })
}

#[cfg(test)]
mod tests {
    #[test]
    fn ancestor_description_names_each_component_and_its_state() {
        let root = std::env::temp_dir().join(format!("supercov-ancestors-{}", unique()));
        fs::create_dir_all(root.join("present")).unwrap();
        fs::write(root.join("present/file.txt"), b"x").unwrap();
        let described = super::describe_ancestors(&root.join("present/file.txt/child"));
        assert!(described.contains("present=dir"), "{described}");
        assert!(described.contains("file.txt=file"), "{described}");
        assert!(described.ends_with("child=missing"), "{described}");
        fs::remove_dir_all(&root).unwrap();
    }

    use super::*;
    use crate::project_discovery::discover_coverage_project;

    fn temporary(name: &str) -> PathBuf {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../target/supercov-test-fixtures")
            .join(format!("javascript-frontend-{name}-{}", unique()));
        // These tests validate frontend contents and manifest construction.
        // The dedicated workspace/platform suite owns directory-creation,
        // link, rename, ENOSPC, crash, and cleanup behavior on every OS. Keep
        // semantic fixtures in Cargo's ignored target tree so hosted-runner
        // policies on the system temporary directory cannot affect them.
        fs::create_dir_all(&path).unwrap();
        crate::workspace::canonicalize_simplified(path).unwrap()
    }

    #[test]
    fn browser_mode_gets_a_browser_setup_and_the_command_that_carries_its_evidence() {
        let generated = temporary("browser-mode-config");
        write_vite_transforms(&generated, &BTreeMap::new()).unwrap();
        let adapter = fs::read_to_string(generated.join("viteInstrumentation.mjs")).unwrap();
        // Evidence leaves the browser over Vitest's own command channel. The
        // dev-server endpoint this replaced was reachable by anything loaded in
        // that realm and took the test file's identity on the browser's word.
        assert!(adapter.contains("export function supercovBrowserCommands(root)"));
        assert!(adapter.contains("__supercovEvidence(context, payload, suffix)"));
        assert!(adapter.contains("const absolute = context.testPath;"));
        assert!(!adapter.contains("configureServer"), "{adapter}");
        assert!(!adapter.contains("__supercov/evidence"), "{adapter}");
        // A suffix names one directory beneath the evidence directory; a
        // traversing one has to be refused rather than resolved.
        assert!(adapter.contains("supercovEvidenceSuffix = /^[A-Za-z0-9._-]+$/"));
        assert!(adapter.contains("Supercov refused an unusable evidence suffix"));
    }

    #[test]
    fn a_browser_mode_project_loads_the_setup_that_can_run_in_a_browser() {
        // The node setup reaches node:fs through atomic.mjs; Vite externalises
        // that for the client, and the suite fails before collecting a test.
        let workspace = temporary("browser-mode-setup");
        let generated = workspace.join(".supercov");
        fs::create_dir_all(&generated).unwrap();
        fs::write(workspace.join("package.json"), "{\"type\":\"module\"}\n").unwrap();
        fs::create_dir_all(workspace.join("src")).unwrap();
        fs::write(
            workspace.join("src/example.mjs"),
            "export const one = () => 1;\n",
        )
        .unwrap();
        let project = discover_coverage_project(
            &workspace,
            &BTreeMap::new(),
            &["npx".into(), "vitest".into(), "run".into()],
        )
        .unwrap();
        let path = write_vitest_config(&workspace, &project, &generated).unwrap();
        let config = fs::read_to_string(path).unwrap();
        assert!(config.contains("config?.test?.browser?.enabled"));
        assert!(config.contains("'.supercov/node_modules/vitestBrowser.mjs'"));
        assert!(config.contains("'.supercov/node_modules/vitest.mjs'"));
        // The command exists only for the mode that uses it.
        assert!(config.contains("browser: { commands: supercovBrowserCommands(process.cwd()) }"));
        assert!(config.contains("...supercovBrowserTest(loaded?.config)"));
    }

    #[test]
    fn runtime_isolation_replaces_only_the_assignment_marker() {
        let source = concat!(
            "const runtimeInstanceToken = \"__SUPERCOV_RUNTIME_INSTANCE__\";\n",
            "const selected = runtimeInstanceToken === \"__SUPERCOV_\" + \"RUNTIME_INSTANCE__\";\n"
        );
        let isolated = isolate_runtime(source, "collector-123").unwrap();
        assert!(isolated.contains("runtimeInstanceToken = \"collector-123\""));
        assert!(isolated.contains("=== \"__SUPERCOV_\" + \"RUNTIME_INSTANCE__\""));
    }

    #[test]
    fn copied_runtime_does_not_reference_unshipped_source_maps() {
        let generated = temporary("runtime-source-maps");
        copy_runtime(&generated, "collector-test").unwrap();
        for name in ["vitest.mjs", "provenance.mjs", "atomic.mjs"] {
            let contents = fs::read_to_string(generated.join(name)).unwrap();
            assert!(
                !contents.contains("sourceMappingURL"),
                "runtime shim retained a source-map directive: {name}"
            );
        }
        fs::remove_dir_all(generated).unwrap();
    }

    #[test]
    fn prepares_sorted_complete_manifest_without_touching_source_project() {
        let source_root = temporary("source");
        let workspace = temporary("workspace");
        fs::create_dir_all(source_root.join("src")).unwrap();
        fs::write(
            source_root.join("src/example.mjs"),
            "export function value(a, b) { if (a || b) return 1; return 0; }\n",
        )
        .unwrap();
        fs::write(source_root.join("package.json"), "{\"type\":\"module\"}\n").unwrap();
        fs::create_dir_all(workspace.join("src")).unwrap();
        fs::create_dir_all(workspace.join(".supercov")).unwrap();
        fs::copy(
            source_root.join("src/example.mjs"),
            workspace.join("src/example.mjs"),
        )
        .unwrap();
        let project = discover_coverage_project(
            &source_root,
            &BTreeMap::new(),
            &["node".into(), "--test".into()],
        )
        .unwrap();
        let original = fs::read_to_string(source_root.join("src/example.mjs")).unwrap();
        let prepared =
            prepare_javascript_frontend(&workspace, &project, "collector-test", "cache-test", &[])
                .unwrap();
        assert_eq!(
            fs::read_to_string(source_root.join("src/example.mjs")).unwrap(),
            original
        );
        let transformed = fs::read_to_string(workspace.join("src/example.mjs")).unwrap();
        assert!(transformed.contains("__SUPERCOV_DIRECT_RUNTIME__"));
        assert_eq!(prepared.manifest.decisions.len(), 1);
        assert!(!prepared.manifest.points.is_empty());
        assert_eq!(prepared.manifest.scope, project.source_scope);
        assert!(prepared.manifest_path.is_file());
        assert!(prepared.preload_path.is_file());
        assert!(prepared.playwright_config_path.is_file());
        assert!(prepared.vite_config_path.is_file());
        assert!(
            fs::read_to_string(&prepared.vite_config_path)
                .unwrap()
                .contains("logLevel: ['1', 'true', 'yes'].includes")
        );
        assert!(prepared.vitest_config_path.is_file());
        assert_eq!(prepared.assertion_calls, 0);
        let cache = read_javascript_frontend_cache(&workspace, "cache-test").unwrap();
        assert_eq!(
            javascript_frontend_reuse_paths(&cache),
            [
                PathBuf::from(".supercov/frontend-cache.json"),
                PathBuf::from(".supercov/frontend-cache-artifacts"),
            ]
        );
        assert!(
            cache
                .artifacts
                .iter()
                .all(|artifact| !artifact.cache_file.contains("src/")
                    && !artifact.cache_file.contains("tests/"))
        );
        fs::write(workspace.join("src/example.mjs"), &original).unwrap();
        fs::remove_file(&prepared.manifest_path).unwrap();
        let restored = load_cached_javascript_frontend(&workspace, &cache).unwrap();
        assert_eq!(restored.manifest, prepared.manifest);
        assert_eq!(
            fs::read_to_string(workspace.join("src/example.mjs")).unwrap(),
            transformed
        );
        fs::write(workspace.join(&cache.artifacts[0].cache_file), "corrupt").unwrap();
        assert!(read_javascript_frontend_cache(&workspace, "cache-test").is_none());
        fs::remove_dir_all(source_root).unwrap();
        fs::remove_dir_all(workspace).unwrap();
    }

    #[test]
    fn embedded_runtime_contains_every_declared_shim() {
        for name in RUNTIME_FILES {
            let bytes = embedded_runtime(name).unwrap();
            assert!(!bytes.is_empty(), "embedded runtime is empty: {name}");
        }
        assert!(
            std::str::from_utf8(embedded_runtime("runtime.mjs").unwrap())
                .unwrap()
                .contains(RUNTIME_INSTANCE_MARKER)
        );
    }
}
