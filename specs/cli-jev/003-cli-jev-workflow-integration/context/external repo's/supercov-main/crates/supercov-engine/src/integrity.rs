//! Language-neutral run integrity fingerprints.
//!
//! A frontend contributes only its transformation/runtime shim identity. The
//! Rust engine owns source, test, dependency, configuration and execution
//! fingerprints for every language.

use std::{
    collections::BTreeSet,
    fs,
    io::{self, Read},
    path::{Path, PathBuf},
    process::Command,
};

use sha2::{Digest, Sha256};

use crate::{
    project_discovery::CoverageProject,
    run_store::{GitIntegrity, RunFingerprint, RunIntegrity},
};

pub const RUN_INTEGRITY_SCHEMA_VERSION: u32 = 2;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FrontendIntegrityInputs {
    pub language: String,
    pub version: String,
    pub root: PathBuf,
    pub instrumenter_files: Vec<PathBuf>,
    pub execution_files: Vec<PathBuf>,
    pub engine_instrumenter_sha256: String,
    pub engine_execution_sha256: String,
}

impl FrontendIntegrityInputs {
    pub fn javascript(root: PathBuf, runtime_files: Vec<PathBuf>) -> Self {
        Self {
            language: "javascript".into(),
            version: "javascript-v1".into(),
            root,
            instrumenter_files: runtime_files.clone(),
            execution_files: runtime_files,
            engine_instrumenter_sha256: env!("SUPERCOV_JS_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_javascript() -> Self {
        Self {
            language: "javascript".into(),
            version: "javascript-v1".into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_JS_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_rust() -> Self {
        Self {
            language: "rust".into(),
            version: "rust-owned-v1".into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_python() -> Self {
        Self {
            language: "python".into(),
            version: crate::python_evidence::PYTHON_FRONTEND_VERSION.into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_PYTHON_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_go() -> Self {
        Self {
            language: "go".into(),
            version: "go-owned-v1".into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_GO_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_jvm() -> Self {
        Self {
            language: "jvm".into(),
            version: "jvm-owned-v1".into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_JVM_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    pub fn embedded_ruby() -> Self {
        Self {
            language: "ruby".into(),
            version: "ruby-coverage-v1".into(),
            root: PathBuf::from("."),
            instrumenter_files: Vec::new(),
            execution_files: Vec::new(),
            engine_instrumenter_sha256: env!("SUPERCOV_RUBY_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExplicitIntegrityInputs {
    pub source_files: Vec<PathBuf>,
    pub test_files: Vec<PathBuf>,
    pub dependency_files: Vec<PathBuf>,
    pub configuration_files: Vec<PathBuf>,
    pub execution_configuration: Vec<u8>,
}

impl ExplicitIntegrityInputs {
    pub(crate) fn assertion_paths(&self) -> Vec<PathBuf> {
        self.source_files
            .iter()
            .chain(&self.test_files)
            .chain(&self.dependency_files)
            .chain(&self.configuration_files)
            .cloned()
            .collect()
    }
}

pub(crate) fn javascript_assertion_paths(
    root: &Path,
    project: &CoverageProject,
) -> Result<Vec<PathBuf>, IntegrityError> {
    let mut paths = test_files(root)?;
    paths.extend(dependency_files(root)?);
    paths.extend(configuration_files(root, project)?);
    paths.extend(crate::typescript_imports::config_paths(
        root,
        &project.source_files,
    ));
    paths.extend(project.source_files.iter().map(|p| root.join(p)));
    paths.extend(
        project
            .source_scope
            .entries
            .iter()
            .filter(|e| !e.is_generated_output())
            .map(|e| root.join(&e.file)),
    );
    Ok(paths)
}

#[derive(Debug)]
pub enum IntegrityError {
    Io { path: PathBuf, source: io::Error },
    UnsafeFile(PathBuf),
    NonUtf8Path(PathBuf),
    OutsideRoot { root: PathBuf, path: PathBuf },
    InvalidEngineDigest(&'static str),
}

impl std::fmt::Display for IntegrityError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::UnsafeFile(path) => {
                write!(
                    formatter,
                    "fingerprint input is not a regular file: {}",
                    path.display()
                )
            }
            Self::NonUtf8Path(path) => {
                write!(
                    formatter,
                    "fingerprint path is not valid UTF-8: {}",
                    path.display()
                )
            }
            Self::OutsideRoot { root, path } => write!(
                formatter,
                "fingerprint input {} is outside {}",
                path.display(),
                root.display()
            ),
            Self::InvalidEngineDigest(field) => write!(formatter, "invalid {field} SHA-256"),
        }
    }
}

impl std::error::Error for IntegrityError {}

fn io_error(path: &Path, source: io::Error) -> IntegrityError {
    IntegrityError::Io {
        path: path.to_owned(),
        source,
    }
}

fn valid_sha256(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn local_path(root: &Path, path: &Path) -> Result<String, IntegrityError> {
    let path = path
        .strip_prefix(root)
        .map_err(|_| IntegrityError::OutsideRoot {
            root: root.to_owned(),
            path: path.to_owned(),
        })?;
    path.components()
        .map(|component| {
            component
                .as_os_str()
                .to_str()
                .map(str::to_owned)
                .ok_or_else(|| IntegrityError::NonUtf8Path(path.to_owned()))
        })
        .collect::<Result<Vec<_>, _>>()
        .map(|parts| parts.join("/"))
}

/// Fields that name the project rather than its dependencies. None of them can
/// change how installed code behaves, so none of them belong in a fingerprint
/// whose only job is to say whether the execution context moved.
const RELEASE_METADATA: &[&str] = &[
    "author",
    "authors",
    "bugs",
    "categories",
    "classifiers",
    "contributors",
    "description",
    "documentation",
    "funding",
    "homepage",
    "keywords",
    "license",
    "license-file",
    "maintainers",
    "man",
    "readme",
    "repository",
    "urls",
    "version",
];

#[derive(Clone, Copy, PartialEq, Eq)]
enum ManifestKind {
    PackageJson,
    PackageLock,
    CargoToml,
    PyprojectToml,
}

fn manifest_kind(path: &Path) -> Option<ManifestKind> {
    match path.file_name()?.to_str()? {
        "package.json" => Some(ManifestKind::PackageJson),
        "package-lock.json" | "npm-shrinkwrap.json" => Some(ManifestKind::PackageLock),
        "Cargo.toml" => Some(ManifestKind::CargoToml),
        "pyproject.toml" => Some(ManifestKind::PyprojectToml),
        _ => None,
    }
}

/// The part of a manifest that decides behaviour, in a canonical encoding.
///
/// Only release metadata is dropped, and only from the tables that describe
/// this project. Every other field survives, including one a future npm or
/// cargo invents, so an unrecognised key is conservative by default. A lockfile
/// keeps every dependency's version and loses only the project's own, which it
/// mirrors from `package.json`.
fn behavioural_manifest(kind: ManifestKind, raw: &[u8]) -> Option<Vec<u8>> {
    let mut value: serde_json::Value = match kind {
        ManifestKind::PackageJson | ManifestKind::PackageLock => {
            serde_json::from_slice(raw).ok()?
        }
        ManifestKind::CargoToml | ManifestKind::PyprojectToml => {
            let text = std::str::from_utf8(raw).ok()?;
            serde_json::to_value(toml::from_str::<toml::Value>(text).ok()?).ok()?
        }
    };
    match kind {
        ManifestKind::PackageJson => strip_metadata(&mut value, &[]),
        // A lockfile repeats this project's own version at its root and again
        // in `packages[""]`. Every other entry is a real dependency whose
        // version must still be hashed.
        ManifestKind::PackageLock => {
            strip_metadata(&mut value, &[]);
            strip_metadata(&mut value, &["packages", ""]);
        }
        ManifestKind::CargoToml => {
            strip_metadata(&mut value, &["package"]);
            strip_metadata(&mut value, &["workspace", "package"]);
        }
        ManifestKind::PyprojectToml => {
            strip_metadata(&mut value, &["project"]);
            strip_metadata(&mut value, &["tool", "poetry"]);
        }
    }
    let mut bytes = Vec::new();
    canonical(&value, &mut bytes);
    Some(bytes)
}

fn strip_metadata(value: &mut serde_json::Value, path: &[&str]) {
    let mut table = value;
    for key in path {
        match table.get_mut(*key) {
            Some(next) => table = next,
            None => return,
        }
    }
    let Some(table) = table.as_object_mut() else {
        return;
    };
    for key in RELEASE_METADATA {
        table.remove(*key);
    }
}

/// A length-prefixed, key-sorted encoding, so the digest does not move when a
/// formatter reorders keys or rewrites whitespace.
fn canonical(value: &serde_json::Value, out: &mut Vec<u8>) {
    match value {
        serde_json::Value::Null => out.push(0),
        serde_json::Value::Bool(flag) => out.extend([1, u8::from(*flag)]),
        serde_json::Value::Number(number) => tagged(out, 2, number.to_string().as_bytes()),
        serde_json::Value::String(text) => tagged(out, 3, text.as_bytes()),
        serde_json::Value::Array(items) => {
            tagged(out, 4, &(items.len() as u64).to_le_bytes());
            for item in items {
                canonical(item, out);
            }
        }
        serde_json::Value::Object(table) => {
            let mut keys = table.keys().collect::<Vec<_>>();
            keys.sort();
            tagged(out, 5, &(keys.len() as u64).to_le_bytes());
            for key in keys {
                tagged(out, 6, key.as_bytes());
                canonical(&table[key], out);
            }
        }
    }
}

fn tagged(out: &mut Vec<u8>, tag: u8, bytes: &[u8]) {
    out.push(tag);
    out.extend((bytes.len() as u64).to_le_bytes());
    out.extend(bytes);
}

fn digest_files(
    root: &Path,
    paths: impl IntoIterator<Item = PathBuf>,
) -> Result<String, IntegrityError> {
    digest_paths(root, paths, false)
}

/// Digest a set of files the way this module digests any set of files.
///
/// This is not a run's source fingerprint and cannot be compared with one. That
/// fingerprint keys the instrumented build cache, so it deliberately covers
/// every file the frontend may rewrite and reuse, which is wider than any
/// caller here is describing.
///
/// Exported so a caller outside a run gets the same construction rather than a
/// second one: two copies of a hash agree until one of them is changed.
pub fn digest_source_files(
    root: &Path,
    paths: impl IntoIterator<Item = PathBuf>,
) -> Result<String, IntegrityError> {
    digest_files(root, paths)
}

/// Dependency manifests, hashed by what they say rather than by their bytes.
///
/// A manifest carries two unrelated things: what the project depends on, and
/// how the project describes itself. Hashing both means every release
/// invalidates every claim in the map, because a manifest is where the version
/// number lives. Across supergateway's last sixty commits thirty percent
/// touched a manifest, and seven of those eighteen changed nothing but a
/// version string.
fn digest_manifests(
    root: &Path,
    paths: impl IntoIterator<Item = PathBuf>,
) -> Result<String, IntegrityError> {
    digest_paths(root, paths, true)
}

fn digest_paths(
    root: &Path,
    paths: impl IntoIterator<Item = PathBuf>,
    manifests: bool,
) -> Result<String, IntegrityError> {
    let paths = paths.into_iter().collect::<BTreeSet<_>>();
    let mut labeled = paths
        .into_iter()
        .map(|path| local_path(root, &path).map(|label| (label, path)))
        .collect::<Result<Vec<_>, _>>()?;
    labeled.sort_by(|left, right| left.0.cmp(&right.0));
    let mut hash = Sha256::new();
    let mut buffer = [0_u8; 128 * 1024];
    for (label, path) in labeled {
        let metadata = fs::symlink_metadata(&path).map_err(|source| io_error(&path, source))?;
        if !metadata.file_type().is_file() {
            return Err(IntegrityError::UnsafeFile(path));
        }
        hash.update(label.as_bytes());
        hash.update([0]);
        // A manifest we can parse is hashed by meaning; anything else, and any
        // manifest we fail to parse, is hashed whole. Falling back to the bytes
        // keeps an unfamiliar or malformed file conservative.
        let meaning = manifests
            .then(|| manifest_kind(&path))
            .flatten()
            .and_then(|kind| behavioural_manifest(kind, &fs::read(&path).ok()?));
        if let Some(bytes) = meaning {
            hash.update(&bytes);
        } else {
            let mut file = fs::File::open(&path).map_err(|source| io_error(&path, source))?;
            loop {
                let read = file
                    .read(&mut buffer)
                    .map_err(|source| io_error(&path, source))?;
                if read == 0 {
                    break;
                }
                hash.update(&buffer[..read]);
            }
        }
        hash.update([0]);
    }
    Ok(format!("{:x}", hash.finalize()))
}

fn domain_hash(domain: &str, fields: &[(&str, &[u8])]) -> String {
    let mut hash = Sha256::new();
    hash.update(domain.as_bytes());
    hash.update([0]);
    for (name, value) in fields {
        hash.update((*name).len().to_le_bytes());
        hash.update(name.as_bytes());
        hash.update(value.len().to_le_bytes());
        hash.update(value);
    }
    format!("{:x}", hash.finalize())
}

fn source_file(path: &Path) -> bool {
    let lower = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    [
        ".js", ".jsx", ".ts", ".tsx", ".cjs", ".cjsx", ".cts", ".ctsx", ".mjs", ".mjsx", ".mts",
        ".mtsx",
    ]
    .iter()
    .any(|extension| lower.ends_with(extension))
}

fn skipped_directory(name: &str) -> bool {
    [
        ".cache",
        ".git",
        ".mcdc-pool",
        ".next",
        ".nuxt",
        ".output",
        ".supercov",
        "build",
        "coverage",
        "dist",
        "node_modules",
        "out",
        "playwright-report",
        "results",
        "test-results",
        "vendor",
    ]
    .contains(&name)
}

fn owned_workspace_store(path: &Path) -> bool {
    crate::workspace::owned_workspace_path(path)
}

fn walk_files(
    directory: &Path,
    predicate: &impl Fn(&Path) -> bool,
    output: &mut Vec<PathBuf>,
) -> Result<(), IntegrityError> {
    let metadata = match fs::symlink_metadata(directory) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(()),
        Err(source) => return Err(io_error(directory, source)),
    };
    if !metadata.file_type().is_dir() {
        return Err(IntegrityError::UnsafeFile(directory.to_owned()));
    }
    let mut entries = fs::read_dir(directory)
        .map_err(|source| io_error(directory, source))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|source| io_error(directory, source))?;
    entries.sort_by_key(fs::DirEntry::file_name);
    for entry in entries {
        let path = entry.path();
        let file_type = entry
            .file_type()
            .map_err(|source| io_error(&path, source))?;
        if file_type.is_symlink() {
            continue;
        }
        if file_type.is_dir() {
            let name = entry.file_name();
            if !name
                .to_str()
                .is_some_and(|name| name.starts_with('.') || skipped_directory(name))
                && !path.join(".git").exists()
                && !owned_workspace_store(&path)
            {
                walk_files(&path, predicate, output)?;
            }
        } else if file_type.is_file() && predicate(&path) {
            output.push(path);
        }
    }
    Ok(())
}

fn test_file(root: &Path, path: &Path) -> bool {
    if !source_file(path) {
        return false;
    }
    let local = path.strip_prefix(root).unwrap_or(path).to_string_lossy();
    local
        .to_ascii_lowercase()
        .split(['/', '\\', '_', '.', '-'])
        .any(|part| matches!(part, "test" | "spec"))
}

fn test_files(root: &Path) -> Result<Vec<PathBuf>, IntegrityError> {
    let mut files = Vec::new();
    for directory in ["test", "tests", "__tests__"] {
        walk_files(&root.join(directory), &source_file, &mut files)?;
    }
    walk_files(root, &|path| test_file(root, path), &mut files)?;
    files.sort();
    files.dedup();
    Ok(files)
}

fn dependency_files(root: &Path) -> Result<Vec<PathBuf>, IntegrityError> {
    let mut files = Vec::new();
    walk_files(
        root,
        &|path| path.file_name().is_some_and(|name| name == "package.json"),
        &mut files,
    )?;
    for name in [
        "package-lock.json",
        "npm-shrinkwrap.json",
        "pnpm-lock.yaml",
        "yarn.lock",
        "bun.lock",
        "bun.lockb",
    ] {
        let path = root.join(name);
        if path.is_file() {
            files.push(path);
        }
    }
    files.sort();
    files.dedup();
    Ok(files)
}

fn configuration_file(path: &Path) -> bool {
    let name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    if formatting_only(&name) {
        return false;
    }
    name == ".npmrc"
        || (name.starts_with("tsconfig") && name.ends_with(".json"))
        || name.contains(".config.")
        || name.starts_with(".babelrc.")
}

/// Linters and formatters do not change what the code does when it runs, so
/// editing their settings is not a change of execution context. Counting it as
/// one meant a Prettier tweak invalidated every flow in the map. Transpiler
/// configuration is a different matter and stays: Babel and tsconfig decide
/// what actually executes.
fn formatting_only(name: &str) -> bool {
    let stem = name.strip_prefix('.').unwrap_or(name);
    stem.starts_with("eslint") || stem.starts_with("prettier")
}

/// Files whose content already reaches the run fingerprint, for any language
/// Supercov supports.
///
/// When one of these changes the whole map is marked dirty, so a flow that also
/// names one in `watch` buys nothing. Worse, it teaches the author a model of
/// the tool that is not true: that per-flow watching is what catches dependency
/// drift.
const TRACKED_MANIFESTS: &[&str] = &[
    "Cargo.lock",
    "Cargo.toml",
    "Gemfile",
    "Gemfile.lock",
    "Pipfile",
    "Pipfile.lock",
    "bun.lock",
    "bun.lockb",
    "npm-shrinkwrap.json",
    "package-lock.json",
    "package.json",
    "pdm.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "pyproject.toml",
    "setup.cfg",
    "setup.py",
    "uv.lock",
    "yarn.lock",
    ".ruby-version",
    ".tool-versions",
];

/// A dependency manifest or lockfile, for any language Supercov supports.
///
/// These already have a dedicated signal: the run's dependency fingerprint,
/// which reads what a manifest declares rather than its bytes. Reporting their
/// raw bytes a second time would say a release changed something when it
/// changed nothing.
pub fn tracked_manifest(path: &str) -> bool {
    let name = path.rsplit(['/', '\\']).next().unwrap_or(path);
    TRACKED_MANIFESTS.contains(&name)
        || name.ends_with(".gemspec")
        || (name.starts_with("requirements") && name.ends_with(".txt"))
}

pub fn globally_tracked(path: &str) -> bool {
    let name = path.rsplit(['/', '\\']).next().unwrap_or(path);
    tracked_manifest(name) || configuration_file(Path::new(name))
}

fn configuration_files(
    root: &Path,
    project: &CoverageProject,
) -> Result<Vec<PathBuf>, IntegrityError> {
    let mut files = Vec::new();
    walk_files(root, &configuration_file, &mut files)?;
    files.extend(
        [
            project.playwright_config.as_ref(),
            project.vitest_config.as_ref(),
            project.jest_config.as_ref(),
        ]
        .into_iter()
        .flatten()
        .cloned(),
    );
    files.sort();
    files.dedup();
    Ok(files)
}

fn git_integrity(root: &Path) -> Option<GitIntegrity> {
    let revision = Command::new("git")
        .args(["rev-parse", "HEAD"])
        .current_dir(root)
        .output()
        .ok();
    let status = Command::new("git")
        .args(["status", "--porcelain=v1"])
        .current_dir(root)
        .output()
        .ok();
    if !revision
        .as_ref()
        .is_some_and(|output| output.status.success())
        && !status
            .as_ref()
            .is_some_and(|output| output.status.success())
    {
        return None;
    }
    Some(GitIntegrity {
        branch: Command::new("git")
            .args(["symbolic-ref", "--quiet", "--short", "HEAD"])
            .current_dir(root)
            .output()
            .ok()
            .filter(|output| output.status.success())
            .and_then(|output| String::from_utf8(output.stdout).ok())
            .map(|branch| branch.trim().to_owned())
            .filter(|branch| !branch.is_empty()),
        revision: revision
            .filter(|output| output.status.success())
            .and_then(|output| String::from_utf8(output.stdout).ok())
            .map(|revision| revision.trim().to_owned()),
        dirty: !status
            .as_ref()
            .is_some_and(|output| output.status.success() && output.stdout.is_empty()),
    })
}

pub fn create_run_integrity(
    root: &Path,
    project: &CoverageProject,
    frontend: &FrontendIntegrityInputs,
) -> Result<RunIntegrity, IntegrityError> {
    if !valid_sha256(&frontend.engine_instrumenter_sha256) {
        return Err(IntegrityError::InvalidEngineDigest("instrumenter engine"));
    }
    if !valid_sha256(&frontend.engine_execution_sha256) {
        return Err(IntegrityError::InvalidEngineDigest("execution engine"));
    }
    let tests = test_files(root)?;
    let dependencies = dependency_files(root)?;
    let configuration = configuration_files(root, project)?;
    // Scope entries outside the instrumented set still execute in the run,
    // and ones that carry assertions or capability imports are rewritten and
    // cached. Everything the frontend may cache must feed the fingerprint,
    // or an edit to such a file would be overwritten by a stale cached copy.
    // Entries that another domain already digests stay out of the source
    // domain so each stale reason keeps naming exactly one kind of change.
    //
    // Generated outputs stay out too. A theme extension's hashed bundles are
    // rebuilt by the wrapped command and synced back into the project, with a
    // new name every build, so digesting them marked every run stale with
    // "instrumented source changed" the moment it finished -- while nothing
    // instrumented had changed at all.
    let covered_elsewhere = tests
        .iter()
        .chain(dependencies.iter())
        .chain(configuration.iter())
        .collect::<std::collections::BTreeSet<_>>();
    let source_paths = project
        .source_files
        .iter()
        .map(|path| root.join(path))
        .chain(
            project
                .source_scope
                .entries
                .iter()
                .filter(|entry| !entry.is_generated_output())
                .map(|entry| root.join(&entry.file))
                .filter(|path| !covered_elsewhere.contains(path)),
        )
        .collect::<Vec<_>>();
    let source = digest_files(root, source_paths)?;
    let tests_digest = digest_files(root, tests.iter().cloned())?;
    let dependency_digest = digest_manifests(root, dependencies)?;
    let configuration_digest = digest_files(
        root,
        configuration
            .into_iter()
            .chain(crate::typescript_imports::config_paths(
                root,
                &project.source_files,
            )),
    )?;
    let frontend_instrumenter =
        digest_files(&frontend.root, frontend.instrumenter_files.iter().cloned())?;
    let frontend_execution =
        digest_files(&frontend.root, frontend.execution_files.iter().cloned())?;
    let instrumenter = domain_hash(
        "supercov-run-instrumenter-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("engine", frontend.engine_instrumenter_sha256.as_bytes()),
            ("shim", frontend_instrumenter.as_bytes()),
            // The runtime shim decides what evidence looks like, so it is part
            // of who instrumented the run rather than of the run's setup.
            (
                "executionEngine",
                frontend.engine_execution_sha256.as_bytes(),
            ),
            ("executionShim", frontend_execution.as_bytes()),
        ],
    );
    let build_environment = frontend_map_bytes(&project.build_environment);
    // `execution` describes the run's setup, not who instrumented it. Supercov's
    // own source used to be folded in here as well, so upgrading Supercov made
    // every stored run stale for a checkout that had not changed. Its identity
    // still lives in `instrumenter`, which the build caches and run merging
    // consult directly.
    let execution = domain_hash(
        "supercov-run-execution-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("source", source.as_bytes()),
            ("dependencies", dependency_digest.as_bytes()),
            ("configuration", configuration_digest.as_bytes()),
            ("buildEnvironment", &build_environment),
        ],
    );
    let combined = domain_hash(
        "supercov-run-combined-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("source", source.as_bytes()),
            ("tests", tests_digest.as_bytes()),
            ("dependencies", dependency_digest.as_bytes()),
            ("configuration", configuration_digest.as_bytes()),
            ("instrumenter", instrumenter.as_bytes()),
        ],
    );
    Ok(RunIntegrity {
        schema_version: RUN_INTEGRITY_SCHEMA_VERSION,
        instrumenter_version: frontend.version.clone(),
        git: git_integrity(root),
        fingerprint: RunFingerprint {
            algorithm: "sha256".into(),
            source,
            tests: tests_digest,
            dependencies: dependency_digest,
            configuration: configuration_digest,
            instrumenter,
            execution,
            combined,
            source_files: project.source_files.len(),
            test_files: tests.len(),
        },
        stale: None,
        stale_reasons: None,
    })
}

/// Language-neutral integrity construction for frontends whose discovery does
/// not use the JavaScript `CoverageProject` compatibility structure.
pub fn create_explicit_run_integrity(
    root: &Path,
    inputs: &ExplicitIntegrityInputs,
    frontend: &FrontendIntegrityInputs,
) -> Result<RunIntegrity, IntegrityError> {
    if !valid_sha256(&frontend.engine_instrumenter_sha256) {
        return Err(IntegrityError::InvalidEngineDigest("instrumenter engine"));
    }
    if !valid_sha256(&frontend.engine_execution_sha256) {
        return Err(IntegrityError::InvalidEngineDigest("execution engine"));
    }
    let source = digest_files(root, inputs.source_files.iter().map(|path| root.join(path)))?;
    let tests = digest_files(root, inputs.test_files.iter().map(|path| root.join(path)))?;
    let dependencies = digest_manifests(
        root,
        inputs.dependency_files.iter().map(|path| root.join(path)),
    )?;
    let configuration = digest_files(
        root,
        inputs
            .configuration_files
            .iter()
            .map(|path| root.join(path)),
    )?;
    let frontend_instrumenter =
        digest_files(&frontend.root, frontend.instrumenter_files.iter().cloned())?;
    let frontend_execution =
        digest_files(&frontend.root, frontend.execution_files.iter().cloned())?;
    let instrumenter = domain_hash(
        "supercov-run-instrumenter-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("engine", frontend.engine_instrumenter_sha256.as_bytes()),
            ("shim", frontend_instrumenter.as_bytes()),
            // The runtime shim decides what evidence looks like, so it is part
            // of who instrumented the run rather than of the run's setup.
            (
                "executionEngine",
                frontend.engine_execution_sha256.as_bytes(),
            ),
            ("executionShim", frontend_execution.as_bytes()),
        ],
    );
    // `execution` describes the run's setup, not who instrumented it. Supercov's
    // own source used to be folded in here as well, so upgrading Supercov made
    // every stored run stale for a checkout that had not changed. Its identity
    // still lives in `instrumenter`, which the build caches and run merging
    // consult directly.
    let execution = domain_hash(
        "supercov-run-execution-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("source", source.as_bytes()),
            ("dependencies", dependencies.as_bytes()),
            ("configuration", configuration.as_bytes()),
            ("executionConfiguration", &inputs.execution_configuration),
        ],
    );
    let combined = domain_hash(
        "supercov-run-combined-v1",
        &[
            ("language", frontend.language.as_bytes()),
            ("version", frontend.version.as_bytes()),
            ("source", source.as_bytes()),
            ("tests", tests.as_bytes()),
            ("dependencies", dependencies.as_bytes()),
            ("configuration", configuration.as_bytes()),
            ("instrumenter", instrumenter.as_bytes()),
            ("execution", execution.as_bytes()),
        ],
    );
    Ok(RunIntegrity {
        schema_version: RUN_INTEGRITY_SCHEMA_VERSION,
        instrumenter_version: format!("supercov-{}-{}", frontend.language, frontend.version),
        git: git_integrity(root),
        fingerprint: RunFingerprint {
            // The frozen store contract names the digest primitive here. The
            // domain-separation version belongs to the producer implementation,
            // not this wire field.
            algorithm: "sha256".into(),
            source,
            tests,
            dependencies,
            configuration,
            instrumenter,
            execution,
            combined,
            source_files: inputs.source_files.len(),
            test_files: inputs.test_files.len(),
        },
        stale: None,
        stale_reasons: None,
    })
}

fn frontend_map_bytes(values: &std::collections::BTreeMap<String, String>) -> Vec<u8> {
    let mut bytes = Vec::new();
    for (key, value) in values {
        bytes.extend_from_slice(&key.len().to_le_bytes());
        bytes.extend_from_slice(key.as_bytes());
        bytes.extend_from_slice(&value.len().to_le_bytes());
        bytes.extend_from_slice(value.as_bytes());
    }
    bytes
}

#[cfg(test)]
mod tests {
    use std::{
        collections::BTreeMap,
        fs,
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use crate::{project_discovery::discover_coverage_project, run_store::compare_run_integrity};

    use super::*;

    static TEMPORARY_SEQUENCE: AtomicU64 = AtomicU64::new(0);

    fn directory(label: &str) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-integrity-{label}-{}-{nonce}-{}",
            std::process::id(),
            TEMPORARY_SEQUENCE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&root).unwrap();
        root
    }

    #[test]
    fn git_context_records_branch_and_local_changes_without_guessing_detached_heads() {
        let root = directory("git-context");
        assert!(git_integrity(&root).is_none());
        let git = |args: &[&str]| {
            let output = Command::new("git")
                .args(args)
                .current_dir(&root)
                .output()
                .unwrap();
            assert!(
                output.status.success(),
                "{}",
                String::from_utf8_lossy(&output.stderr)
            );
        };
        git(&["init", "--initial-branch=report-test"]);
        git(&[
            "-c",
            "user.name=Report Test",
            "-c",
            "user.email=report@example.invalid",
            "commit",
            "--allow-empty",
            "-m",
            "fixture",
        ]);
        let clean = git_integrity(&root).unwrap();
        assert_eq!(clean.branch.as_deref(), Some("report-test"));
        assert!(!clean.dirty);
        fs::write(root.join("local.txt"), "uncommitted").unwrap();
        let dirty = git_integrity(&root).unwrap();
        assert!(dirty.dirty);
        assert_eq!(dirty.revision, clean.revision);
        git(&["checkout", "--detach"]);
        let detached = git_integrity(&root).unwrap();
        assert!(detached.branch.is_none());
        assert_eq!(detached.revision, clean.revision);
        // Older stored runs remain readable without a branch field.
        let old: GitIntegrity = serde_json::from_value(serde_json::json!({
            "revision": clean.revision, "dirty": false
        }))
        .unwrap();
        assert!(old.branch.is_none());
        fs::remove_dir_all(root).unwrap();
    }

    const PACKAGE: &str = r#"{"name":"g","version":"1.0.0","dependencies":{"a":"^1.2.3"}}"#;
    const LOCK: &str = r#"{"name":"g","version":"1.0.0","packages":{"":{"name":"g","version":"1.0.0"},"node_modules/a":{"version":"1.2.3"}}}"#;
    const CARGO: &str =
        "[package]\nname = \"g\"\nversion = \"1.0.0\"\n\n[dependencies]\na = \"1.2.3\"\n";
    const PYPROJECT: &str =
        "[project]\nname = \"g\"\nversion = \"1.0.0\"\ndependencies = [\"a==1.2.3\"]\n";

    #[test]
    fn a_release_bump_leaves_a_manifest_digest_alone() {
        // A version number says what the project calls itself, not what it
        // depends on, and it lives in the same file as the dependencies. Hashing
        // it meant every release invalidated every claim in the map.
        for (kind, before, after) in [
            (
                ManifestKind::PackageJson,
                PACKAGE.to_owned(),
                PACKAGE.replace("1.0.0", "2.0.0"),
            ),
            (
                ManifestKind::PackageLock,
                LOCK.to_owned(),
                LOCK.replace("\"version\":\"1.0.0\"", "\"version\":\"2.0.0\""),
            ),
            (
                ManifestKind::CargoToml,
                CARGO.to_owned(),
                CARGO.replace("1.0.0", "2.0.0"),
            ),
            (
                ManifestKind::PyprojectToml,
                PYPROJECT.to_owned(),
                PYPROJECT.replace("1.0.0", "2.0.0"),
            ),
        ] {
            let stable = behavioural_manifest(kind, before.as_bytes());
            assert!(stable.is_some());
            assert_eq!(stable, behavioural_manifest(kind, after.as_bytes()));
        }
    }

    #[test]
    fn a_dependency_change_still_moves_a_manifest_digest() {
        // Dropping metadata must not drop the signal. A lockfile keeps every
        // dependency's version and loses only the project's own.
        for (kind, before, after) in [
            (
                ManifestKind::PackageJson,
                PACKAGE.to_owned(),
                PACKAGE.replace("^1.2.3", "^2.0.0"),
            ),
            (
                ManifestKind::PackageLock,
                LOCK.to_owned(),
                LOCK.replace(
                    "\"node_modules/a\":{\"version\":\"1.2.3\"}",
                    "\"node_modules/a\":{\"version\":\"9.9.9\"}",
                ),
            ),
            (
                ManifestKind::CargoToml,
                CARGO.to_owned(),
                CARGO.replace("a = \"1.2.3\"", "a = \"9.9.9\""),
            ),
            (
                ManifestKind::PyprojectToml,
                PYPROJECT.to_owned(),
                PYPROJECT.replace("a==1.2.3", "a==9.9.9"),
            ),
        ] {
            assert_ne!(
                behavioural_manifest(kind, before.as_bytes()),
                behavioural_manifest(kind, after.as_bytes())
            );
        }
    }

    #[test]
    fn the_dependency_fingerprint_survives_a_release_but_not_an_upgrade() {
        // The whole point, at the seam the fingerprint actually uses: cutting a
        // release must cost nothing, and changing a dependency must still cost
        // a recheck.
        let root = directory("manifest-fingerprint");
        let paths = || [root.join("package.json"), root.join("package-lock.json")];
        write(&root, "package.json", PACKAGE);
        write(&root, "package-lock.json", LOCK);
        let before = digest_manifests(&root, paths()).unwrap();

        write(&root, "package.json", &PACKAGE.replace("1.0.0", "2.0.0"));
        write(
            &root,
            "package-lock.json",
            &LOCK.replace("\"version\":\"1.0.0\"", "\"version\":\"2.0.0\""),
        );
        assert_eq!(
            before,
            digest_manifests(&root, paths()).unwrap(),
            "a release must not move the dependency fingerprint"
        );

        write(&root, "package.json", &PACKAGE.replace("^1.2.3", "^2.0.0"));
        assert_ne!(
            before,
            digest_manifests(&root, paths()).unwrap(),
            "an upgrade must still move it"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn reformatting_a_manifest_leaves_its_digest_alone() {
        // Key order and whitespace are not meaning, and a formatter rewriting
        // either should not cost the author a re-acknowledgement.
        let reordered = r#"{"dependencies":{"a":"^1.2.3"},  "version":"1.0.0",
            "name":"g"}"#;
        assert_eq!(
            behavioural_manifest(ManifestKind::PackageJson, PACKAGE.as_bytes()),
            behavioural_manifest(ManifestKind::PackageJson, reordered.as_bytes())
        );
    }

    #[test]
    fn an_unreadable_manifest_falls_back_to_its_bytes() {
        // A file we cannot parse is hashed whole, so a format we do not
        // understand stays conservative instead of silently hashing nothing.
        assert!(behavioural_manifest(ManifestKind::PackageJson, b"{ not json").is_none());
        assert!(behavioural_manifest(ManifestKind::CargoToml, b"[[[").is_none());
        let root = directory("manifest-fallback");
        write(&root, "package.json", "{ not json");
        let first = digest_manifests(&root, [root.join("package.json")]).unwrap();
        write(&root, "package.json", "{ still not json");
        assert_ne!(
            first,
            digest_manifests(&root, [root.join("package.json")]).unwrap()
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn linter_and_formatter_settings_are_not_execution_context() {
        // Neither tool changes what runs, so neither belongs in a fingerprint
        // that answers whether the execution context moved. Transpiler config
        // is a different matter and stays.
        for inert in [
            ".prettierrc",
            ".prettierrc.json",
            "prettier.config.js",
            ".eslintrc",
            ".eslintrc.json",
            "eslint.config.mjs",
        ] {
            assert!(!configuration_file(Path::new(inert)), "{inert}");
        }
        for real in ["tsconfig.json", ".babelrc.js", "vite.config.ts", ".npmrc"] {
            assert!(configuration_file(Path::new(real)), "{real}");
        }
    }

    #[test]
    fn globally_tracked_names_what_the_fingerprint_already_covers() {
        for tracked in [
            "package-lock.json",
            "package.json",
            "Cargo.toml",
            "Gemfile.lock",
            "requirements-dev.txt",
            "supercov.gemspec",
            "tsconfig.json",
            "nested/pyproject.toml",
        ] {
            assert!(globally_tracked(tracked), "{tracked}");
        }
        for own in [
            "src/index.ts",
            "tests/helpers/gateway-process.ts",
            "README.md",
        ] {
            assert!(!globally_tracked(own), "{own}");
        }
    }

    fn write(root: &Path, path: &str, contents: &str) {
        let path = root.join(path);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, contents).unwrap();
    }

    fn frontend(root: &Path) -> FrontendIntegrityInputs {
        FrontendIntegrityInputs {
            language: "javascript".into(),
            version: "javascript-v1".into(),
            root: root.to_owned(),
            instrumenter_files: vec![root.join("instrumenter.js")],
            execution_files: vec![root.join("runtime.mjs")],
            engine_instrumenter_sha256: env!("SUPERCOV_JS_FRONTEND_SOURCE_SHA256").into(),
            engine_execution_sha256: env!("SUPERCOV_ENGINE_SOURCE_SHA256").into(),
        }
    }

    fn fixture() -> (PathBuf, PathBuf) {
        let root = directory("project");
        let shim = directory("shim");
        write(
            &root,
            "package.json",
            r#"{"scripts":{"build":"vite build","test":"node --test"}}"#,
        );
        write(&root, "package-lock.json", "lock");
        write(&root, "src/index.ts", "export const ready = true");
        write(&root, "tests/index.test.ts", "test('ready', () => {})");
        write(&root, "vite.config.ts", "export default {}");
        write(&root, ".cache/test262/fake.test.js", "ignored");
        write(
            &root,
            "supercov/.supercov-workspace-store",
            "Supercov instrumented workspace. Safe to delete.\n",
        );
        write(
            &root,
            "supercov/workspace/copy/tests/copied.test.ts",
            "ignored copied test",
        );
        write(&shim, "instrumenter.js", "instrument");
        write(&shim, "runtime.mjs", "runtime");
        (root, shim)
    }

    fn integrity(root: &Path, shim: &Path, environment: &BTreeMap<String, String>) -> RunIntegrity {
        let project = discover_coverage_project(root, environment, &[]).unwrap();
        create_run_integrity(root, &project, &frontend(shim)).unwrap()
    }

    #[test]
    fn built_assets_the_command_regenerates_do_not_move_the_source_fingerprint() {
        // A theme extension's Vite build lands hashed bundles in `assets/`
        // and the run syncs them back into the project. They are excluded
        // from instrumentation, so a rebuild must not read as a source change.
        let (root, shim) = fixture();
        write(
            &root,
            "package.json",
            r#"{"workspaces":["app_extensions/*"],"scripts":{"test":"node --test"}}"#,
        );
        write(&root, "app_extensions/upsells/package.json", "{}");
        write(&root, "app_extensions/upsells/frontend/embed.ts", "source");
        write(
            &root,
            "app_extensions/upsells/assets/app-embed-Be-aUw9g.js",
            "bundle one",
        );
        let first = integrity(&root, &shim, &BTreeMap::new());

        fs::remove_file(root.join("app_extensions/upsells/assets/app-embed-Be-aUw9g.js")).unwrap();
        write(
            &root,
            "app_extensions/upsells/assets/app-embed-CygpnWPQ.js",
            "bundle two",
        );
        let rebuilt = integrity(&root, &shim, &BTreeMap::new());
        assert_eq!(rebuilt.fingerprint.source, first.fingerprint.source);
        assert!(!compare_run_integrity(Some(&first), &rebuilt).stale);

        write(
            &root,
            "app_extensions/upsells/frontend/embed.ts",
            "edited source",
        );
        let edited = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(edited.fingerprint.source, first.fingerprint.source);
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }

    #[test]
    fn fingerprints_every_independent_input_domain_deterministically() {
        let (root, shim) = fixture();
        let first = integrity(&root, &shim, &BTreeMap::new());
        let second = integrity(&root, &shim, &BTreeMap::new());
        assert_eq!(first, second);
        assert_eq!(first.fingerprint.source_files, 1);
        assert_eq!(first.fingerprint.test_files, 1);
        for digest in [
            &first.fingerprint.source,
            &first.fingerprint.tests,
            &first.fingerprint.dependencies,
            &first.fingerprint.configuration,
            &first.fingerprint.instrumenter,
            &first.fingerprint.execution,
            &first.fingerprint.combined,
        ] {
            assert!(valid_sha256(digest));
        }

        write(&root, "src/index.ts", "export const ready = false");
        let source = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(source.fingerprint.source, first.fingerprint.source);
        assert_eq!(source.fingerprint.tests, first.fingerprint.tests);
        assert_ne!(source.fingerprint.execution, first.fingerprint.execution);

        write(&root, "src/index.ts", "export const ready = true");
        write(&root, "tests/index.test.ts", "test('changed', () => {})");
        let tests = integrity(&root, &shim, &BTreeMap::new());
        assert_eq!(tests.fingerprint.source, first.fingerprint.source);
        assert_ne!(tests.fingerprint.tests, first.fingerprint.tests);
        assert_eq!(tests.fingerprint.execution, first.fingerprint.execution);

        write(&root, "tests/index.test.ts", "test('ready', () => {})");
        write(&root, "package-lock.json", "changed lock");
        let dependencies = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(
            dependencies.fingerprint.dependencies,
            first.fingerprint.dependencies
        );
        assert_ne!(
            dependencies.fingerprint.execution,
            first.fingerprint.execution
        );

        write(&root, "package-lock.json", "lock");
        write(&root, "vite.config.ts", "export default { changed: true }");
        let configuration = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(
            configuration.fingerprint.configuration,
            first.fingerprint.configuration
        );

        write(&root, "vite.config.ts", "export default {}");
        write(&shim, "instrumenter.js", "changed instrumenter");
        let instrumenter = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(
            instrumenter.fingerprint.instrumenter,
            first.fingerprint.instrumenter
        );
        assert_ne!(
            instrumenter.fingerprint.combined,
            first.fingerprint.combined
        );
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }

    #[test]
    fn assertion_inputs_ignore_tool_worktrees_and_nested_repositories() {
        let (root, shim) = fixture();
        write(&root, "packages/ui/package.json", r#"{"name":"ui"}"#);
        write(
            &root,
            "packages/ui/tests/ui.test.ts",
            "import assert from 'node:assert/strict'; assert.equal(1, 1);",
        );
        let before = integrity(&root, &shim, &BTreeMap::new());
        for base in [".claude/worktrees/other", "nested-fork"] {
            write(
                &root,
                &format!("{base}/.git"),
                "gitdir: /unrelated/repository",
            );
            write(
                &root,
                &format!("{base}/tests/other.test.ts"),
                "assert.equal(2, 2);",
            );
            write(&root, &format!("{base}/package.json"), "{}");
            write(&root, &format!("{base}/tsconfig.json"), "{}");
        }
        let after = integrity(&root, &shim, &BTreeMap::new());
        assert_eq!(before.fingerprint, after.fingerprint);
        let project = discover_coverage_project(&root, &BTreeMap::new(), &[]).unwrap();
        let paths = javascript_assertion_paths(&root, &project).unwrap();
        let inputs = crate::assertion_inputs::capture(&root, "javascript", paths).unwrap();
        assert!(inputs.files.contains_key("packages/ui/tests/ui.test.ts"));
        assert!(
            !inputs
                .files
                .keys()
                .any(|p| p.starts_with(".claude/") || p.starts_with("nested-fork/"))
        );
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }

    #[test]
    fn a_new_supercov_moves_its_own_identity_and_nothing_else() {
        // An upgrade must still stop a merge and bust the build caches, because
        // evidence from two different instrumenters is not comparable. It must
        // not touch the run's setup, which is what decides whether a stored run
        // still matches the checkout.
        let (root, shim) = fixture();
        let project = discover_coverage_project(&root, &BTreeMap::new(), &[]).unwrap();
        let baseline = create_run_integrity(&root, &project, &frontend(&shim)).unwrap();
        let mut newer = frontend(&shim);
        newer.engine_instrumenter_sha256 = "b".repeat(64);
        newer.engine_execution_sha256 = "c".repeat(64);
        let upgraded = create_run_integrity(&root, &project, &newer).unwrap();

        assert_ne!(
            baseline.fingerprint.instrumenter, upgraded.fingerprint.instrumenter,
            "a merge and the build caches still have to see this"
        );
        assert_eq!(
            baseline.fingerprint.execution, upgraded.fingerprint.execution,
            "the run's setup did not change"
        );
        assert!(
            !compare_run_integrity(Some(&baseline), &upgraded).stale,
            "upgrading Supercov must not discard a recorded run"
        );
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }

    #[test]
    fn fingerprints_nested_workspace_manifests_and_execution_environment() {
        let (root, shim) = fixture();
        write(
            &root,
            "packages/ui/package.json",
            r#"{"dependencies":{"react":"1"}}"#,
        );
        write(&root, "packages/ui/src/index.ts", "export const ui = true");
        let first = integrity(&root, &shim, &BTreeMap::new());
        write(
            &root,
            "packages/ui/package.json",
            r#"{"dependencies":{"react":"2"}}"#,
        );
        let dependency = integrity(&root, &shim, &BTreeMap::new());
        assert_ne!(
            first.fingerprint.dependencies,
            dependency.fingerprint.dependencies
        );

        let mut environment = BTreeMap::new();
        environment.insert("SUPERCOV_SOURCE_ROOTS".into(), "src,packages/ui/src".into());
        let project = discover_coverage_project(&root, &environment, &[]).unwrap();
        let mut project_with_build_environment = project.clone();
        project_with_build_environment
            .build_environment
            .insert("MODE".into(), "test".into());
        let changed =
            create_run_integrity(&root, &project_with_build_environment, &frontend(&shim)).unwrap();
        let baseline = create_run_integrity(&root, &project, &frontend(&shim)).unwrap();
        assert_ne!(
            baseline.fingerprint.execution,
            changed.fingerprint.execution
        );
        assert_eq!(baseline.fingerprint.combined, changed.fingerprint.combined);
        assert_eq!(
            compare_run_integrity(Some(&baseline), &changed).reasons,
            ["execution environment changed"]
        );
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }

    #[test]
    fn explicit_language_integrity_uses_the_frozen_store_digest_label() {
        let root = directory("rust-project");
        write(&root, "src/lib.rs", "pub fn ready() -> bool { true }");
        write(
            &root,
            "Cargo.toml",
            "[package]\nname='fixture'\nversion='0.0.0'\n",
        );
        let inputs = ExplicitIntegrityInputs {
            source_files: vec!["src/lib.rs".into()],
            test_files: vec!["src/lib.rs".into()],
            dependency_files: vec!["Cargo.toml".into()],
            configuration_files: Vec::new(),
            execution_configuration: b"cargo\0test".to_vec(),
        };
        let result = create_explicit_run_integrity(
            &root,
            &inputs,
            &FrontendIntegrityInputs::embedded_rust(),
        )
        .unwrap();
        assert_eq!(result.fingerprint.algorithm, "sha256");
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn rejects_linked_frontend_identity_files() {
        use std::os::unix::fs::symlink;

        let (root, shim) = fixture();
        let outside = shim.join("outside.js");
        fs::write(&outside, "outside").unwrap();
        fs::remove_file(shim.join("instrumenter.js")).unwrap();
        symlink(&outside, shim.join("instrumenter.js")).unwrap();
        let project = discover_coverage_project(&root, &BTreeMap::new(), &[]).unwrap();
        assert!(matches!(
            create_run_integrity(&root, &project, &frontend(&shim)),
            Err(IntegrityError::UnsafeFile(_))
        ));
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(shim).unwrap();
    }
}
