//! Isolated project snapshots and crash-recoverable stable build cache.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, OpenOptions},
    io::{self, Write},
    path::{Component, Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::lifecycle::{
    LifecycleError, ProjectLock, atomic_rename, atomic_write, remove_stored_tree_deferred,
};

const WORKSPACE_MARKER: &str = ".supercov-workspace-store";
const WORKSPACE_MARKER_CONTENTS: &[u8] = b"Supercov instrumented workspace. Safe to delete.\n";
const CARGO_WORKSPACE_VERSION: u32 = 2;
const CARGO_WORKSPACE_LOCATOR_VERSION: u32 = 1;
const CARGO_WORKSPACE_LOCATOR: &str = ".supercov/cargo-workspace.json";
const ROOT_EXCLUSIONS: &[&str] = &[
    ".cache",
    ".git",
    ".supercov",
    ".mcdc-pool",
    "node_modules",
    "build",
    "dist",
    ".next",
    ".nuxt",
    ".output",
    "coverage",
    "playwright-report",
    "test-results",
    "target",
];
const NESTED_EXCLUSIONS: &[&str] = &[".supercov", ".mcdc-pool"];
static UNIQUE: AtomicU64 = AtomicU64::new(0);

#[derive(Debug)]
pub enum WorkspaceError {
    Io { path: PathBuf, source: io::Error },
    UnsafePath(PathBuf),
    UnsupportedEntry(PathBuf),
    MissingLock,
    Lifecycle(LifecycleError),
    InvalidCacheMetadata(serde_json::Error),
    UnsupportedPlatform(&'static str),
}

impl std::fmt::Display for WorkspaceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::UnsafePath(path) => {
                write!(formatter, "unsafe workspace path: {}", path.display())
            }
            Self::UnsupportedEntry(path) => {
                write!(
                    formatter,
                    "unsupported filesystem entry in isolated project: {}",
                    path.display()
                )
            }
            Self::MissingLock => write!(
                formatter,
                "isolated workspace preparation requires the active project lock"
            ),
            Self::Lifecycle(error) => write!(formatter, "{error}"),
            Self::InvalidCacheMetadata(error) => {
                write!(formatter, "invalid build-cache metadata: {error}")
            }
            Self::UnsupportedPlatform(reason) => {
                write!(formatter, "unsupported workspace platform: {reason}")
            }
        }
    }
}

impl std::error::Error for WorkspaceError {}

impl From<LifecycleError> for WorkspaceError {
    fn from(value: LifecycleError) -> Self {
        Self::Lifecycle(value)
    }
}

/// Leftover tool state -- a Chrome test profile linking into /tmp was the
/// field case -- must not abort measurement. The mirror omits the entry:
/// nothing outside the project is ever followed, and a test that truly needs
/// the link fails visibly inside the workspace with this line as the cause.
fn omit_escaping_link(path: &Path, target: &Path) {
    eprintln!(
        "[supercov] omitting symlink outside the isolated project: {} -> {}",
        path.display(),
        target.display()
    );
}

/// `fs::canonicalize` on Windows returns a verbatim path -- `\\?\C:\...` or
/// `\\?\UNC\server\share\...` -- and that prefix does not survive contact with
/// anything else: Node's pathToFileURL reads `?` as a UNC host, `Path::starts_with`
/// treats `\\?\C:\` and `C:\` as different prefixes so containment checks
/// misjudge every link, and the prefix shows up in every diagnostic. Canonical
/// paths are simplified back to the ordinary form at the one place they are
/// made, so nothing downstream ever sees the verbatim spelling.
pub(crate) fn canonicalize_simplified<P: AsRef<Path>>(path: P) -> io::Result<PathBuf> {
    fs::canonicalize(path).map(simplified)
}

#[cfg(windows)]
pub(crate) fn simplified(path: PathBuf) -> PathBuf {
    match path.to_str().and_then(strip_verbatim) {
        Some(plain) => PathBuf::from(plain),
        None => path,
    }
}

#[cfg(not(windows))]
pub(crate) fn simplified(path: PathBuf) -> PathBuf {
    path
}

/// The pure string half, kept host-independent so it can be tested anywhere:
/// `\\?\C:\a` -> `C:\a`, `\\?\UNC\srv\share\a` -> `\\srv\share\a`, and `None`
/// for a path that carries no verbatim prefix.
#[cfg_attr(not(windows), allow(dead_code))]
pub(crate) fn strip_verbatim(path: &str) -> Option<String> {
    let rest = path.strip_prefix(r"\\?\")?;
    if let Some(unc) = rest.strip_prefix(r"UNC\") {
        return Some(format!(r"\\{unc}"));
    }
    let mut chars = rest.chars();
    let drive = chars.next()?;
    if drive.is_ascii_alphabetic() && chars.next() == Some(':') {
        return Some(rest.to_owned());
    }
    None
}

/// The `file://` URL for an absolute path, the way Node's `pathToFileURL`
/// derives it. Node takes a bare `--import=C:\...` for a URL with scheme `c:`
/// and refuses it -- ERR_UNSUPPORTED_ESM_URL_SCHEME -- while `/abs/path` has no
/// colon and passes, which is why every POSIX run worked and every Windows run
/// died in the first Node child. Windows paths reach here already simplified
/// (no `\\?\`); `\` becomes `/`, a drive path becomes `file:///C:/...`, a UNC
/// path `file://server/share/...`, and every byte outside the URL-safe set is
/// percent-encoded so a space or a `#` in a temp directory cannot break it.
pub(crate) fn file_url(path: &Path) -> String {
    let text = path.to_string_lossy();
    #[cfg(windows)]
    let text = text.replace('\\', "/");
    file_url_from_slash_path(&text)
}

/// The pure half: `slash_path` uses `/` separators on every host.
pub(crate) fn file_url_from_slash_path(slash_path: &str) -> String {
    let mut url = String::from("file://");
    let mut rest = slash_path;
    if let Some(unc) = rest.strip_prefix("//") {
        // `//server/share/dir` -> `file://server/share/dir`: the host is the server.
        let (host, tail) = unc.split_once('/').unwrap_or((unc, ""));
        url.push_str(host);
        rest = tail;
        url.push('/');
    } else if !rest.starts_with('/') {
        // A drive path such as `C:/dir`.
        url.push('/');
    }
    for byte in rest.bytes() {
        let keep =
            byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'.' | b'_' | b'~' | b'/' | b':');
        if keep {
            url.push(byte as char);
        } else {
            url.push_str(&format!("%{byte:02X}"));
        }
    }
    url
}

fn io_error(path: &Path, source: io::Error) -> WorkspaceError {
    WorkspaceError::Io {
        path: path.to_owned(),
        source,
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

fn project_name(root: &Path) -> Result<&std::ffi::OsStr, WorkspaceError> {
    root.file_name()
        .ok_or_else(|| WorkspaceError::UnsafePath(root.into()))
}

pub fn workspace_container(root: &Path) -> PathBuf {
    // Everything Supercov keeps in a project lives under .supercov: one
    // directory to gitignore, one directory to delete. Users interact with
    // their real files and the CLI; command outputs sync back after every
    // run, so nothing in the container is ever theirs to fetch.
    let preferred = root.join(".supercov/workspaces");
    if fs::symlink_metadata(&preferred).is_err() || owned_workspace_path(&preferred) {
        return preferred;
    }
    let digest = format!("{:x}", Sha256::digest(root.as_os_str().as_encoded_bytes()));
    for sequence in 0..1_024usize {
        let name = if sequence == 0 {
            format!(".supercov/workspaces-{}", &digest[..16])
        } else {
            format!(".supercov/workspaces-{}-{sequence}", &digest[..16])
        };
        let candidate = root.join(name);
        if fs::symlink_metadata(&candidate).is_err() || owned_workspace_path(&candidate) {
            return candidate;
        }
    }
    root.join(format!(".supercov/workspaces-{}-overflow", &digest[..16]))
}

pub fn cached_workspace_path(root: &Path) -> Result<PathBuf, WorkspaceError> {
    Ok(workspace_container(root)
        .join("workspace")
        .join(project_name(root)?))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CargoWorkspaceMarker {
    version: u32,
    root_sha256: String,
    token: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
enum CargoWorkspacePlacement {
    Sibling,
    Temporary,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct CargoWorkspaceLocator {
    version: u32,
    root_sha256: String,
    placement: CargoWorkspacePlacement,
    token: String,
}

fn canonical_root_and_digest(root: &Path) -> Result<(PathBuf, String), WorkspaceError> {
    let canonical = canonicalize_simplified(root).map_err(|error| io_error(root, error))?;
    let digest = format!(
        "{:x}",
        Sha256::digest(canonical.as_os_str().as_encoded_bytes())
    );
    Ok((canonical, digest))
}

fn preferred_cargo_workspace_container(root: &Path) -> Result<PathBuf, WorkspaceError> {
    let (canonical, digest) = canonical_root_and_digest(root)?;
    let parent = canonical
        .parent()
        .ok_or_else(|| WorkspaceError::UnsafePath(canonical.clone()))?;
    Ok(parent.join(format!(".supercov-cargo-{}", &digest[..24])))
}

fn cargo_locator_path(root: &Path) -> PathBuf {
    root.join(CARGO_WORKSPACE_LOCATOR)
}

fn valid_token(token: &str) -> bool {
    token.len() == 64
        && token
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn new_cargo_token() -> Result<String, WorkspaceError> {
    let mut bytes = [0_u8; 32];
    getrandom::fill(&mut bytes).map_err(|source| {
        io_error(
            Path::new(CARGO_WORKSPACE_LOCATOR),
            io::Error::other(source.to_string()),
        )
    })?;
    Ok(bytes.iter().map(|byte| format!("{byte:02x}")).collect())
}

fn container_for_locator(
    root: &Path,
    locator: &CargoWorkspaceLocator,
) -> Result<PathBuf, WorkspaceError> {
    match locator.placement {
        CargoWorkspacePlacement::Sibling => preferred_cargo_workspace_container(root),
        CargoWorkspacePlacement::Temporary => {
            let temporary_root = canonicalize_simplified(std::env::temp_dir())
                .map_err(|source| io_error(&std::env::temp_dir(), source))?;
            Ok(temporary_root.join(format!(
                ".supercov-cargo-{}-{}",
                &locator.root_sha256[..24],
                &locator.token[..32]
            )))
        }
    }
}

fn validate_cargo_locator(
    root: &Path,
    locator: CargoWorkspaceLocator,
) -> Result<CargoWorkspaceLocator, WorkspaceError> {
    let (_, digest) = canonical_root_and_digest(root)?;
    if locator.version != CARGO_WORKSPACE_LOCATOR_VERSION
        || locator.root_sha256 != digest
        || !valid_token(&locator.token)
    {
        return Err(WorkspaceError::UnsafePath(cargo_locator_path(root)));
    }
    Ok(locator)
}

fn read_cargo_locator(root: &Path) -> Result<Option<CargoWorkspaceLocator>, WorkspaceError> {
    let path = cargo_locator_path(root);
    let metadata = match fs::symlink_metadata(&path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(io_error(&path, error)),
    };
    if !metadata.file_type().is_file() {
        return Err(WorkspaceError::UnsafePath(path));
    }
    let locator = serde_json::from_slice(&fs::read(&path).map_err(|error| io_error(&path, error))?)
        .map_err(WorkspaceError::InvalidCacheMetadata)?;
    validate_cargo_locator(root, locator).map(Some)
}

fn write_cargo_locator(root: &Path, locator: &CargoWorkspaceLocator) -> Result<(), WorkspaceError> {
    let mut bytes =
        serde_json::to_vec_pretty(locator).map_err(WorkspaceError::InvalidCacheMetadata)?;
    bytes.push(b'\n');
    atomic_write(root, &cargo_locator_path(root), &bytes).map_err(WorkspaceError::from)
}

pub fn cargo_workspace_container(root: &Path) -> Result<PathBuf, WorkspaceError> {
    match read_cargo_locator(root)? {
        Some(locator) => container_for_locator(root, &locator),
        None => preferred_cargo_workspace_container(root),
    }
}

pub fn cargo_cached_workspace_path(root: &Path) -> Result<PathBuf, WorkspaceError> {
    let container = cargo_workspace_container(root)?;
    Ok(container.join("workspace/root").join(project_name(root)?))
}

fn expected_cargo_marker(root: &Path, token: &str) -> Result<CargoWorkspaceMarker, WorkspaceError> {
    let (_, digest) = canonical_root_and_digest(root)?;
    Ok(CargoWorkspaceMarker {
        version: CARGO_WORKSPACE_VERSION,
        root_sha256: digest,
        token: token.into(),
    })
}

fn read_cargo_marker(path: &Path) -> Result<CargoWorkspaceMarker, WorkspaceError> {
    let metadata = fs::symlink_metadata(path).map_err(|error| io_error(path, error))?;
    if !metadata.file_type().is_file() {
        return Err(WorkspaceError::UnsafePath(path.into()));
    }
    serde_json::from_slice(&fs::read(path).map_err(|error| io_error(path, error))?)
        .map_err(WorkspaceError::InvalidCacheMetadata)
}

fn validate_cargo_marker(
    root: &Path,
    container: &Path,
    marker: &CargoWorkspaceMarker,
) -> Result<(), WorkspaceError> {
    let (_, digest) = canonical_root_and_digest(root)?;
    if marker.version != CARGO_WORKSPACE_VERSION
        || marker.root_sha256 != digest
        || !valid_token(&marker.token)
    {
        return Err(WorkspaceError::UnsafePath(container.into()));
    }
    Ok(())
}

fn ensure_cargo_container_at(
    root: &Path,
    container: &Path,
    expected: &CargoWorkspaceMarker,
) -> Result<(), WorkspaceError> {
    let mut created = false;
    match fs::symlink_metadata(container) {
        Ok(metadata) if !metadata.file_type().is_dir() => {
            return Err(WorkspaceError::UnsafePath(container.into()));
        }
        Ok(_) => {}
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            let parent = container
                .parent()
                .ok_or_else(|| WorkspaceError::UnsafePath(container.into()))?;
            let parent_metadata =
                fs::symlink_metadata(parent).map_err(|source| io_error(parent, source))?;
            if !parent_metadata.file_type().is_dir() {
                return Err(WorkspaceError::UnsafePath(parent.into()));
            }
            fs::create_dir(container).map_err(|source| io_error(container, source))?;
            created = true;
        }
        Err(source) => return Err(io_error(container, source)),
    }
    let marker_path = container.join(WORKSPACE_MARKER);
    let result = (|| {
        match fs::symlink_metadata(&marker_path) {
            Ok(_) if read_cargo_marker(&marker_path)? != *expected => {
                return Err(WorkspaceError::UnsafePath(container.into()));
            }
            Ok(_) => {}
            Err(error) if error.kind() == io::ErrorKind::NotFound && created => {
                let mut bytes = serde_json::to_vec_pretty(&expected)
                    .map_err(WorkspaceError::InvalidCacheMetadata)?;
                bytes.push(b'\n');
                let mut file = OpenOptions::new()
                    .write(true)
                    .create_new(true)
                    .open(&marker_path)
                    .map_err(|source| io_error(&marker_path, source))?;
                file.write_all(&bytes)
                    .and_then(|_| file.sync_all())
                    .map_err(|source| io_error(&marker_path, source))?;
            }
            Err(error) if error.kind() == io::ErrorKind::NotFound => {
                return Err(WorkspaceError::UnsafePath(container.into()));
            }
            Err(source) => return Err(io_error(&marker_path, source)),
        }
        for path in [container.join(".cargo"), container.join("workspace/.cargo")] {
            if fs::symlink_metadata(&path).is_ok() {
                return Err(WorkspaceError::UnsafePath(path));
            }
        }
        if project_name(root)? != ".cargo" {
            let path = container.join("workspace/root/.cargo");
            if fs::symlink_metadata(&path).is_ok() {
                return Err(WorkspaceError::UnsafePath(path));
            }
        }
        Ok(())
    })();
    if result.is_err() && created {
        let _ = fs::remove_dir_all(container);
    }
    result
}

fn fallback_eligible(error: &WorkspaceError) -> bool {
    matches!(
        error,
        WorkspaceError::Io { source, .. }
            if matches!(
                source.kind(),
                io::ErrorKind::PermissionDenied | io::ErrorKind::ReadOnlyFilesystem
            )
    )
}

fn ensure_cargo_container(root: &Path) -> Result<PathBuf, WorkspaceError> {
    if let Some(locator) = read_cargo_locator(root)? {
        let container = container_for_locator(root, &locator)?;
        let expected = expected_cargo_marker(root, &locator.token)?;
        ensure_cargo_container_at(root, &container, &expected)?;
        return Ok(container);
    }

    let preferred = preferred_cargo_workspace_container(root)?;
    if fs::symlink_metadata(&preferred).is_ok() {
        let marker = read_cargo_marker(&preferred.join(WORKSPACE_MARKER))?;
        validate_cargo_marker(root, &preferred, &marker)?;
        let (_, digest) = canonical_root_and_digest(root)?;
        let locator = CargoWorkspaceLocator {
            version: CARGO_WORKSPACE_LOCATOR_VERSION,
            root_sha256: digest,
            placement: CargoWorkspacePlacement::Sibling,
            token: marker.token.clone(),
        };
        write_cargo_locator(root, &locator)?;
        ensure_cargo_container_at(root, &preferred, &marker)?;
        return Ok(preferred);
    }

    let (_, digest) = canonical_root_and_digest(root)?;
    let token = new_cargo_token()?;
    let preferred_locator = CargoWorkspaceLocator {
        version: CARGO_WORKSPACE_LOCATOR_VERSION,
        root_sha256: digest.clone(),
        placement: CargoWorkspacePlacement::Sibling,
        token: token.clone(),
    };
    let expected = expected_cargo_marker(root, &token)?;
    match ensure_cargo_container_at(root, &preferred, &expected) {
        Ok(()) => {
            write_cargo_locator(root, &preferred_locator)?;
            Ok(preferred)
        }
        Err(error) if fallback_eligible(&error) => {
            let fallback_locator = CargoWorkspaceLocator {
                placement: CargoWorkspacePlacement::Temporary,
                ..preferred_locator
            };
            write_cargo_locator(root, &fallback_locator)?;
            let fallback = container_for_locator(root, &fallback_locator)?;
            ensure_cargo_container_at(root, &fallback, &expected)?;
            Ok(fallback)
        }
        Err(error) => Err(error),
    }
}

pub fn isolated_workspace_path(root: &Path, run_id: &str) -> Result<PathBuf, WorkspaceError> {
    if run_id.is_empty()
        || run_id == "."
        || run_id == ".."
        || run_id
            .chars()
            .any(|character| matches!(character, '/' | '\\' | '\0') || character.is_control())
    {
        return Err(WorkspaceError::UnsafePath(PathBuf::from(run_id)));
    }
    Ok(workspace_container(root)
        .join("work")
        .join(run_id)
        .join(project_name(root)?))
}

pub(crate) fn owned_workspace_path(path: &Path) -> bool {
    fs::symlink_metadata(path).is_ok_and(|metadata| metadata.file_type().is_dir())
        && fs::symlink_metadata(path.join(WORKSPACE_MARKER))
            .is_ok_and(|metadata| metadata.file_type().is_file())
        && fs::read(path.join(WORKSPACE_MARKER))
            .is_ok_and(|contents| contents == WORKSPACE_MARKER_CONTENTS)
}

fn ensure_container(root: &Path) -> Result<PathBuf, WorkspaceError> {
    let container = workspace_container(root);
    let mut created = false;
    match fs::symlink_metadata(&container) {
        Ok(metadata) if !metadata.file_type().is_dir() => {
            return Err(WorkspaceError::UnsafePath(container));
        }
        Ok(_) => {}
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            fs::create_dir_all(&container).map_err(|source| io_error(&container, source))?;
            // One directory covers everything Supercov writes; make Git
            // ignore it without the user touching their own .gitignore.
            let store_ignore = root.join(".supercov/.gitignore");
            if fs::symlink_metadata(&store_ignore).is_err() {
                let _ = fs::write(&store_ignore, b"*\n");
            }
            created = true;
        }
        Err(source) => return Err(io_error(&container, source)),
    }
    let result = (|| {
        if !created && !owned_workspace_path(&container) {
            return Err(WorkspaceError::UnsafePath(container.clone()));
        }
        for (name, contents) in [
            (".gitignore", b"*\n".as_slice()),
            (WORKSPACE_MARKER, WORKSPACE_MARKER_CONTENTS),
        ] {
            let path = container.join(name);
            match OpenOptions::new().write(true).create_new(true).open(&path) {
                Ok(mut file) => file
                    .write_all(contents)
                    .and_then(|_| file.sync_all())
                    .map_err(|source| io_error(&path, source))?,
                Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {
                    if !fs::symlink_metadata(&path)
                        .is_ok_and(|metadata| metadata.file_type().is_file())
                    {
                        return Err(WorkspaceError::UnsafePath(path));
                    }
                    if name == WORKSPACE_MARKER
                        && !fs::read(&path)
                            .is_ok_and(|contents| contents == WORKSPACE_MARKER_CONTENTS)
                    {
                        return Err(WorkspaceError::UnsafePath(path));
                    }
                }
                Err(source) => return Err(io_error(&path, source)),
            }
        }
        Ok(container.clone())
    })();
    if result.is_err() && created {
        let _ = fs::remove_dir_all(&container);
    }
    result
}

fn lexical_normalize(path: &Path) -> Option<PathBuf> {
    let mut normalized = PathBuf::new();
    for component in path.components() {
        match component {
            Component::Prefix(prefix) => normalized.push(prefix.as_os_str()),
            Component::RootDir => normalized.push(component.as_os_str()),
            Component::CurDir => {}
            Component::ParentDir => {
                if !normalized.pop() {
                    return None;
                }
            }
            Component::Normal(value) => normalized.push(value),
        }
    }
    Some(normalized)
}

fn inside(root: &Path, path: &Path) -> bool {
    path == root
        || path.strip_prefix(root).is_ok_and(|local| {
            !local.as_os_str().is_empty()
                && local
                    .components()
                    .all(|component| matches!(component, Component::Normal(_)))
        })
}

trait WorkspaceOperations {
    fn copy_file(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError>;
    fn rename(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError>;
}

struct SystemWorkspaceOperations;

impl WorkspaceOperations for SystemWorkspaceOperations {
    fn copy_file(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
        // Per-file APFS clonefile calls can cost tens of milliseconds for tiny
        // files—far more than copying their bytes. Preserve CoW for genuinely
        // large artifacts, while ordinary source/config files take the fast
        // portable path.
        const REFLINK_MINIMUM_BYTES: u64 = 1024 * 1024;
        let bytes = fs::symlink_metadata(source)
            .map_err(|source_error| io_error(source, source_error))?
            .len();
        if bytes < REFLINK_MINIMUM_BYTES {
            fs::copy(source, destination)
                .map(|_| ())
                .map_err(|source_error| io_error(destination, source_error))
        } else {
            reflink_copy::reflink_or_copy(source, destination)
                .map(|_| ())
                .map_err(|source_error| io_error(destination, source_error))
        }
    }

    fn rename(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
        atomic_rename(source, destination).map_err(WorkspaceError::from)
    }
}

#[cfg(unix)]
fn create_link(target: &Path, destination: &Path, _directory: bool) -> io::Result<()> {
    std::os::unix::fs::symlink(target, destination)
}

#[cfg(windows)]
fn create_link(target: &Path, destination: &Path, directory: bool) -> io::Result<()> {
    if directory {
        // Junctions work on ordinary NTFS installations without requiring
        // Developer Mode or SeCreateSymbolicLinkPrivilege. This is the common
        // path for dependency mounts and internal directory links. A project
        // may still live on a non-NTFS/network filesystem where junctions are
        // unavailable but unprivileged symlinks are enabled, so preserve that
        // valid fallback instead of assuming one Windows filesystem.
        match junction::create(target, destination) {
            Ok(()) => Ok(()),
            Err(junction_error) => {
                let _ = fs::remove_dir(destination);
                std::os::windows::fs::symlink_dir(target, destination).map_err(
                    |symlink_error| {
                        io::Error::new(
                            symlink_error.kind(),
                            format!(
                                "junction creation failed ({junction_error}); directory symlink fallback failed ({symlink_error})"
                            ),
                        )
                    },
                )
            }
        }
    } else {
        // A project that already contains a file symlink necessarily runs in
        // an environment capable of creating one. Do not silently copy it:
        // that can change Node realpath/module-identity semantics.
        std::os::windows::fs::symlink_file(target, destination)
    }
}

/// Clone a directory copy-on-write. `false` means the platform or filesystem
/// cannot (Linux has no directory reflink; APFS refuses across volumes and for
/// trees holding entries a clone cannot carry), and the caller falls back to
/// entry links. Any partial destination is removed first so the fallback
/// starts from a clean slate.
#[cfg(target_os = "macos")]
fn clone_directory(source: &Path, destination: &Path) -> bool {
    use std::{ffi::CString, os::unix::ffi::OsStrExt};

    let (Ok(source_c), Ok(destination_c)) = (
        CString::new(source.as_os_str().as_bytes()),
        CString::new(destination.as_os_str().as_bytes()),
    ) else {
        return false;
    };
    // SAFETY: both arguments are valid NUL-terminated paths that outlive the
    // call, and clonefile touches nothing else.
    let status = unsafe { libc::clonefile(source_c.as_ptr(), destination_c.as_ptr(), 0) };
    if status == 0 {
        return true;
    }
    let _ = fs::remove_dir_all(destination);
    false
}

#[cfg(all(unix, not(target_os = "macos")))]
fn clone_directory(_source: &Path, _destination: &Path) -> bool {
    false
}

/// Materialise `source` at `destination` without copying bytes: real
/// directories, one hard link per file, symlinks recreated verbatim. This is
/// the mount-safe form where a directory cannot be cloned (Linux has no
/// directory reflink): a container or VM that mounts the workspace sees real
/// dependency files where entry links would dangle. Hard links share inodes
/// with the originals, so an in-place write still reaches the user's tree --
/// the caveat entry links already carry -- but replacing an entry, which is
/// what npm does, only unlinks the workspace's name. `false` means the tree
/// could not be linked (another volume, protected files, an entry that is
/// neither file, directory nor symlink) and the caller falls back to entry
/// links after the partial destination is removed.
#[cfg(unix)]
fn hard_link_tree(source: &Path, destination: &Path) -> bool {
    fn link(source: &Path, destination: &Path) -> io::Result<()> {
        fs::create_dir(destination)?;
        for entry in fs::read_dir(source)? {
            let entry = entry?;
            let from = entry.path();
            let to = destination.join(entry.file_name());
            let file_type = entry.file_type()?;
            if file_type.is_dir() {
                link(&from, &to)?;
            } else if file_type.is_symlink() {
                std::os::unix::fs::symlink(fs::read_link(&from)?, &to)?;
            } else if file_type.is_file() {
                fs::hard_link(&from, &to)?;
            } else {
                return Err(io::Error::new(
                    io::ErrorKind::Unsupported,
                    "entry is neither a file, a directory nor a symlink",
                ));
            }
        }
        Ok(())
    }
    if link(source, destination).is_ok() {
        return true;
    }
    let _ = fs::remove_dir_all(destination);
    false
}

#[derive(Clone, Copy)]
struct CopyRoots<'a> {
    source: &'a Path,
    destination: &'a Path,
    final_destination: &'a Path,
    canonical_source: &'a Path,
}

fn copy_tree<Operations: WorkspaceOperations>(
    source: &Path,
    destination: &Path,
    roots: CopyRoots<'_>,
    root_level: bool,
    operations: &mut Operations,
) -> Result<(), WorkspaceError> {
    fs::create_dir_all(destination).map_err(|source| io_error(destination, source))?;
    let mut entries = fs::read_dir(source)
        .map_err(|error| io_error(source, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(source, error))?;
    entries.sort_by_key(fs::DirEntry::file_name);
    for entry in entries {
        let name = entry.file_name();
        let name_text = name
            .to_str()
            .ok_or_else(|| WorkspaceError::UnsafePath(entry.path()))?;
        if (root_level && ROOT_EXCLUSIONS.contains(&name_text))
            || NESTED_EXCLUSIONS.contains(&name_text)
        {
            continue;
        }
        let from = entry.path();
        let metadata = fs::symlink_metadata(&from).map_err(|error| io_error(&from, error))?;
        if metadata.file_type().is_dir() && owned_workspace_path(&from) {
            continue;
        }
        let to = destination.join(&name);
        if metadata.file_type().is_dir() {
            // Nested node_modules are never instrumented, so they are not
            // mirrored file by file: on a real monorepo (many packages and
            // examples, each with node_modules) the deep copy was 43-52
            // seconds of every run's startup.
            //
            // Preferred: a copy-on-write clone of the whole directory. It is
            // one call on APFS (85k files in ~1.2s, no bytes duplicated until
            // written) and leaves the workspace self-contained -- a suite that
            // mounts the workspace into a VM or container sees real dependency
            // trees, and writes stay in the workspace instead of passing
            // through to the user's tree.
            //
            // Next best, where directories cannot be cloned (Linux): the same
            // tree as hard links -- real directories inside a mount, no bytes
            // copied, one link call per file.
            //
            // Last resort: one symlink per package pointing at the original
            // tree, the same semantics the root has. The directory itself is
            // real, so tools creating NEW entries (vite's .cache) still write
            // into the workspace, but the links dangle wherever the original
            // path is not visible (a mounted VM), and npm then treats them as
            // broken installs and fails to re-link them across the mount.
            #[cfg(unix)]
            if name_text == "node_modules" && !root_level {
                if clone_directory(&from, &to) || hard_link_tree(&from, &to) {
                    continue;
                }
                fs::create_dir_all(&to).map_err(|error| io_error(&to, error))?;
                let mut packages = fs::read_dir(&from)
                    .map_err(|error| io_error(&from, error))?
                    .collect::<Result<Vec<_>, _>>()
                    .map_err(|error| io_error(&from, error))?;
                packages.sort_by_key(fs::DirEntry::file_name);
                for package in packages {
                    let link_destination = to.join(package.file_name());
                    create_link(&package.path(), &link_destination, false)
                        .map_err(|error| io_error(&link_destination, error))?;
                }
                continue;
            }
            copy_tree(&from, &to, roots, false, operations)?;
        } else if metadata.file_type().is_symlink() {
            let link = fs::read_link(&from).map_err(|error| io_error(&from, error))?;
            let unresolved_target = if link.is_absolute() {
                link.clone()
            } else {
                from.parent().expect("entry parent").join(&link)
            };
            let Some(lexical_target) = lexical_normalize(&unresolved_target) else {
                omit_escaping_link(&from, &link);
                continue;
            };
            // A dangling symlink is a fact of the user's tree that their own
            // tooling tolerates: npm and pnpm workspaces routinely leave links
            // to packages that are not installed, and plain `npm test` never
            // resolves them. Refusing to mirror the project over one broke a
            // real monorepo on first touch. It resolves to nothing, so it can
            // leak nothing; the LEXICAL containment check still applies, and
            // the link is preserved as-is so the workspace matches the source.
            let canonical_target = match canonicalize_simplified(&from) {
                Ok(target) => Some(target),
                Err(error) if error.kind() == io::ErrorKind::NotFound => None,
                Err(error) => return Err(io_error(&from, error)),
            };
            let escapes = !inside(roots.source, &lexical_target)
                || canonical_target
                    .as_deref()
                    .is_some_and(|target| !inside(roots.canonical_source, target));
            if escapes {
                omit_escaping_link(&from, &link);
                continue;
            }
            let local_target = lexical_target
                .strip_prefix(roots.source)
                .map_err(|_| WorkspaceError::UnsafePath(lexical_target.clone()))?;
            let relocated = roots.destination.join(local_target);
            let Some(canonical_target) = canonical_target else {
                if cfg!(windows) {
                    // Windows link creation needs the target's type, which a
                    // dangling link cannot provide; the entry resolves to
                    // nothing either way.
                    continue;
                }
                let isolated_link = if link.is_absolute() {
                    pathdiff(&to, &relocated)?
                } else {
                    link
                };
                create_link(&isolated_link, &to, false).map_err(|error| io_error(&to, error))?;
                continue;
            };
            let target_metadata = fs::metadata(&canonical_target)
                .map_err(|error| io_error(&canonical_target, error))?;
            let isolated_link = if cfg!(windows) && target_metadata.is_dir() {
                roots.final_destination.join(local_target)
            } else if link.is_absolute() {
                pathdiff(&to, &relocated)?
            } else {
                link
            };
            create_link(&isolated_link, &to, target_metadata.is_dir())
                .map_err(|error| io_error(&to, error))?;
        } else if metadata.file_type().is_file() {
            operations.copy_file(&from, &to)?;
        } else {
            return Err(WorkspaceError::UnsupportedEntry(from));
        }
    }
    Ok(())
}

fn pathdiff(from: &Path, to: &Path) -> Result<PathBuf, WorkspaceError> {
    let from = from
        .parent()
        .ok_or_else(|| WorkspaceError::UnsafePath(from.into()))?;
    let from_components = from.components().collect::<Vec<_>>();
    let to_components = to.components().collect::<Vec<_>>();
    let common = from_components
        .iter()
        .zip(&to_components)
        .take_while(|(left, right)| left == right)
        .count();
    if common == 0 {
        return Err(WorkspaceError::UnsafePath(to.into()));
    }
    let mut relative = PathBuf::new();
    for _ in common..from_components.len() {
        relative.push("..");
    }
    for component in &to_components[common..] {
        relative.push(component.as_os_str());
    }
    Ok(relative)
}

fn link_node_modules<Operations: WorkspaceOperations>(
    root: &Path,
    workspace: &Path,
    operations: &mut Operations,
) -> Result<(), WorkspaceError> {
    #[cfg(unix)]
    let _ = &operations;
    let source = root.join("node_modules");
    let source_metadata = match fs::symlink_metadata(&source) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(io_error(&source, error)),
    };
    // pnpm setups routinely make the root node_modules itself a symlink into a
    // store elsewhere. The mirror links each entry to its absolute target
    // anyway, so following the root link loses no isolation -- refusing it
    // forced one user to materialise a 3.7 GB tree by hand.
    let source = if source_metadata.file_type().is_symlink() {
        let resolved =
            canonicalize_simplified(&source).map_err(|error| io_error(&source, error))?;
        if !fs::symlink_metadata(&resolved)
            .map_err(|error| io_error(&resolved, error))?
            .file_type()
            .is_dir()
        {
            return Err(WorkspaceError::UnsafePath(source));
        }
        resolved
    } else if source_metadata.file_type().is_dir() {
        source
    } else {
        return Err(WorkspaceError::UnsafePath(source));
    };
    let destination = workspace.join("node_modules");
    fs::create_dir_all(&destination).map_err(|error| io_error(&destination, error))?;
    let mut entries = fs::read_dir(&source)
        .map_err(|error| io_error(&source, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(&source, error))?;
    entries.sort_by_key(fs::DirEntry::file_name);
    for entry in entries {
        let target = entry.path();
        let to = destination.join(entry.file_name());
        #[cfg(unix)]
        create_link(&target, &to, false).map_err(|error| io_error(&to, error))?;
        #[cfg(windows)]
        {
            let file_type = entry
                .file_type()
                .map_err(|error| io_error(&target, error))?;
            let resolved = if file_type.is_symlink() {
                canonicalize_simplified(&target).map_err(|error| io_error(&target, error))?
            } else {
                target.clone()
            };
            let metadata = fs::metadata(&resolved).map_err(|error| io_error(&resolved, error))?;
            if metadata.is_dir() {
                create_link(&resolved, &to, true).map_err(|error| io_error(&to, error))?;
            } else if metadata.is_file() {
                // Top-level node_modules metadata files are cheap to copy and a
                // link would unnecessarily require Windows symlink privileges.
                operations.copy_file(&resolved, &to)?;
            } else {
                return Err(WorkspaceError::UnsupportedEntry(target));
            }
        }
    }
    Ok(())
}

fn require_lock(root: &Path, lock: &ProjectLock) -> Result<(), WorkspaceError> {
    if lock.protects(root) {
        Ok(())
    } else {
        Err(WorkspaceError::MissingLock)
    }
}

pub fn prepare_isolated_workspace(
    root: &Path,
    run_id: &str,
    lock: &ProjectLock,
) -> Result<PathBuf, WorkspaceError> {
    require_lock(root, lock)?;
    ensure_container(root)?;
    let mut operations = SystemWorkspaceOperations;
    let workspace = isolated_workspace_path(root, run_id)?;
    remove_stored_tree_deferred(root, &workspace)?;
    let canonical_root = canonicalize_simplified(root).map_err(|error| io_error(root, error))?;
    copy_tree(
        root,
        &workspace,
        CopyRoots {
            source: root,
            destination: &workspace,
            final_destination: &workspace,
            canonical_source: &canonical_root,
        },
        true,
        &mut operations,
    )?;
    link_node_modules(root, &workspace, &mut operations)?;
    Ok(workspace)
}

fn transaction_prefix(root: &Path, kind: &str) -> Result<String, WorkspaceError> {
    Ok(format!(
        ".{}.{}-",
        project_name(root)?.to_string_lossy(),
        kind
    ))
}

fn transaction_path(root: &Path, kind: &str) -> Result<PathBuf, WorkspaceError> {
    let workspace = cached_workspace_path(root)?;
    Ok(workspace.parent().expect("workspace parent").join(format!(
        "{}{}",
        transaction_prefix(root, kind)?,
        unique()
    )))
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CacheRecoveryResult {
    pub restored_previous: bool,
    pub removed_staging: usize,
    pub removed_previous: usize,
}

pub fn recover_cached_workspace(
    root: &Path,
    lock: &ProjectLock,
) -> Result<CacheRecoveryResult, WorkspaceError> {
    require_lock(root, lock)?;
    let workspace = cached_workspace_path(root)?;
    let parent = workspace.parent().expect("workspace parent");
    let entries = match fs::read_dir(parent) {
        Ok(entries) => entries,
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            return Ok(CacheRecoveryResult {
                restored_previous: false,
                removed_staging: 0,
                removed_previous: 0,
            });
        }
        Err(error) => return Err(io_error(parent, error)),
    };
    let staging_prefix = transaction_prefix(root, "staging")?;
    let previous_prefix = transaction_prefix(root, "previous")?;
    let mut staging = Vec::new();
    let mut previous = Vec::new();
    let mut invalid_previous = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|error| io_error(parent, error))?;
        let name = entry.file_name().to_string_lossy().into_owned();
        if name.starts_with(&staging_prefix) {
            staging.push(entry.path());
        } else if name.starts_with(&previous_prefix) {
            let metadata = entry
                .file_type()
                .map_err(|error| io_error(&entry.path(), error))?;
            if metadata.is_dir() {
                let modified = entry
                    .metadata()
                    .and_then(|metadata| metadata.modified())
                    .unwrap_or(UNIX_EPOCH);
                previous.push((modified, entry.path()));
            } else {
                invalid_previous.push(entry.path());
            }
        }
    }
    previous.sort_by_key(|entry| std::cmp::Reverse(entry.0));
    let mut restored = false;
    if fs::symlink_metadata(&workspace).is_err()
        && let Some((_, newest)) = previous.first()
    {
        atomic_rename(newest, &workspace)?;
        previous.remove(0);
        restored = true;
    }
    let removed_staging = staging.len();
    let removed_previous = previous.len() + invalid_previous.len();
    for path in staging
        .into_iter()
        .chain(previous.into_iter().map(|(_, path)| path))
        .chain(invalid_previous)
    {
        remove_stored_tree_deferred(root, &path)?;
    }
    Ok(CacheRecoveryResult {
        restored_previous: restored,
        removed_staging,
        removed_previous,
    })
}

fn checked_reuse_path(workspace: &Path, requested: &Path) -> Result<PathBuf, WorkspaceError> {
    if requested.is_absolute()
        || requested
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(WorkspaceError::UnsafePath(requested.into()));
    }
    let path = workspace.join(requested);
    if path == workspace || fs::symlink_metadata(&path).is_err() {
        return Err(WorkspaceError::UnsafePath(requested.into()));
    }
    Ok(path)
}

pub fn prepare_cached_workspace(
    root: &Path,
    lock: &ProjectLock,
    reuse_paths: &[PathBuf],
) -> Result<PathBuf, WorkspaceError> {
    let mut operations = SystemWorkspaceOperations;
    prepare_cached_workspace_with_operations(root, lock, reuse_paths, &mut operations)
}

fn cargo_transaction_prefix(root: &Path, kind: &str) -> Result<String, WorkspaceError> {
    Ok(format!(
        ".{}.{}-",
        project_name(root)?.to_string_lossy(),
        kind
    ))
}

fn cargo_transaction_path(
    root: &Path,
    container: &Path,
    kind: &str,
) -> Result<PathBuf, WorkspaceError> {
    Ok(container.join(format!(
        "{}{}",
        cargo_transaction_prefix(root, kind)?,
        unique()
    )))
}

fn validate_cargo_descendant(container: &Path, target: &Path) -> Result<(), WorkspaceError> {
    let local = target
        .strip_prefix(container)
        .map_err(|_| WorkspaceError::UnsafePath(target.into()))?;
    if local.as_os_str().is_empty()
        || local
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(WorkspaceError::UnsafePath(target.into()));
    }
    let mut current = container.to_owned();
    for component in local.components() {
        current.push(component.as_os_str());
        match fs::symlink_metadata(&current) {
            Ok(metadata) if metadata.file_type().is_symlink() => {
                return Err(WorkspaceError::UnsafePath(current));
            }
            Ok(_) => {}
            Err(error) if error.kind() == io::ErrorKind::NotFound => break,
            Err(error) => return Err(io_error(&current, error)),
        }
    }
    Ok(())
}

fn remove_cargo_owned_tree(container: &Path, target: &Path) -> Result<bool, WorkspaceError> {
    validate_cargo_descendant(container, target)?;
    match fs::symlink_metadata(target) {
        Ok(metadata) if metadata.file_type().is_dir() => {
            fs::remove_dir_all(target).map_err(|error| io_error(target, error))?;
            Ok(true)
        }
        Ok(_) => Err(WorkspaceError::UnsafePath(target.into())),
        Err(error) if error.kind() == io::ErrorKind::NotFound => Ok(false),
        Err(error) => Err(io_error(target, error)),
    }
}

fn recover_cargo_workspace_at(
    root: &Path,
    container: &Path,
    workspace: &Path,
) -> Result<CacheRecoveryResult, WorkspaceError> {
    let staging_prefix = cargo_transaction_prefix(root, "staging")?;
    let previous_prefix = cargo_transaction_prefix(root, "previous")?;
    let mut staging = Vec::new();
    let mut previous = Vec::new();
    for entry in fs::read_dir(container)
        .map_err(|error| io_error(container, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(container, error))?
    {
        let name = entry.file_name().to_string_lossy().into_owned();
        let metadata = entry
            .file_type()
            .map_err(|error| io_error(&entry.path(), error))?;
        if name.starts_with(&staging_prefix) {
            if !metadata.is_dir() {
                return Err(WorkspaceError::UnsafePath(entry.path()));
            }
            staging.push(entry.path());
        } else if name.starts_with(&previous_prefix) {
            if !metadata.is_dir() {
                return Err(WorkspaceError::UnsafePath(entry.path()));
            }
            let modified = entry
                .metadata()
                .and_then(|metadata| metadata.modified())
                .unwrap_or(UNIX_EPOCH);
            previous.push((modified, entry.path()));
        }
    }
    previous.sort_by_key(|entry| std::cmp::Reverse(entry.0));
    let mut restored = false;
    if fs::symlink_metadata(workspace).is_err()
        && let Some((_, newest)) = previous.first()
    {
        fs::create_dir_all(workspace.parent().expect("Cargo workspace parent"))
            .map_err(|error| io_error(workspace, error))?;
        atomic_rename(newest, workspace)?;
        previous.remove(0);
        restored = true;
    }
    let removed_staging = staging.len();
    let removed_previous = previous.len();
    for path in staging
        .into_iter()
        .chain(previous.into_iter().map(|(_, path)| path))
    {
        remove_cargo_owned_tree(container, &path)?;
    }
    Ok(CacheRecoveryResult {
        restored_previous: restored,
        removed_staging,
        removed_previous,
    })
}

pub fn recover_cargo_cached_workspace(
    root: &Path,
    lock: &ProjectLock,
) -> Result<CacheRecoveryResult, WorkspaceError> {
    require_lock(root, lock)?;
    let container = ensure_cargo_container(root)?;
    let workspace = cargo_cached_workspace_path(root)?;
    recover_cargo_workspace_at(root, &container, &workspace)
}

pub fn prepare_cargo_cached_workspace(
    root: &Path,
    lock: &ProjectLock,
) -> Result<PathBuf, WorkspaceError> {
    let mut operations = SystemWorkspaceOperations;
    prepare_cargo_cached_workspace_with_operations(root, lock, &mut operations)
}

fn prepare_cargo_cached_workspace_with_operations<Operations: WorkspaceOperations>(
    root: &Path,
    lock: &ProjectLock,
    operations: &mut Operations,
) -> Result<PathBuf, WorkspaceError> {
    require_lock(root, lock)?;
    let container = ensure_cargo_container(root)?;
    let workspace = cargo_cached_workspace_path(root)?;
    recover_cargo_workspace_at(root, &container, &workspace)?;
    let staging = cargo_transaction_path(root, &container, "staging")?;
    let previous = cargo_transaction_path(root, &container, "previous")?;
    let result = (|| {
        let canonical_root =
            canonicalize_simplified(root).map_err(|error| io_error(root, error))?;
        copy_tree(
            root,
            &staging,
            CopyRoots {
                source: root,
                destination: &staging,
                final_destination: &workspace,
                canonical_source: &canonical_root,
            },
            true,
            operations,
        )?;
        link_node_modules(root, &staging, operations)?;
        fs::create_dir_all(workspace.parent().expect("Cargo workspace parent"))
            .map_err(|error| io_error(&workspace, error))?;
        let mut moved_previous = false;
        if fs::symlink_metadata(&workspace).is_ok() {
            operations.rename(&workspace, &previous)?;
            moved_previous = true;
        }
        if let Err(error) = operations.rename(&staging, &workspace) {
            if moved_previous && fs::symlink_metadata(&workspace).is_err() {
                let _ = operations.rename(&previous, &workspace);
            }
            return Err(error);
        }
        if fs::symlink_metadata(&previous).is_ok() {
            remove_cargo_owned_tree(&container, &previous)?;
        }
        Ok(workspace.clone())
    })();
    if fs::symlink_metadata(&staging).is_ok() {
        remove_cargo_owned_tree(&container, &staging)?;
    }
    result
}

pub fn remove_cargo_workspace_run(root: &Path, run_id: &str) -> Result<bool, WorkspaceError> {
    let container = cargo_workspace_container(root)?;
    match fs::symlink_metadata(&container) {
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(false),
        Err(error) => return Err(io_error(&container, error)),
        Ok(metadata) if !metadata.file_type().is_dir() => {
            return Err(WorkspaceError::UnsafePath(container));
        }
        Ok(_) => {}
    }
    let marker = read_cargo_marker(&container.join(WORKSPACE_MARKER))?;
    validate_cargo_marker(root, &container, &marker)?;
    let workspace = cargo_cached_workspace_path(root)?;
    remove_cargo_owned_tree(&container, &workspace.join(".supercov/work").join(run_id))
}

pub fn clean_cargo_workspace(root: &Path, dry_run: bool) -> Result<bool, WorkspaceError> {
    let container = cargo_workspace_container(root)?;
    let locator_path = cargo_locator_path(root);
    let has_locator = fs::symlink_metadata(&locator_path).is_ok();
    match fs::symlink_metadata(&container) {
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            if has_locator && !dry_run {
                let metadata = fs::symlink_metadata(&locator_path)
                    .map_err(|source| io_error(&locator_path, source))?;
                if !metadata.file_type().is_file() {
                    return Err(WorkspaceError::UnsafePath(locator_path));
                }
                fs::remove_file(&locator_path).map_err(|source| io_error(&locator_path, source))?;
            }
            return Ok(has_locator);
        }
        Err(error) => return Err(io_error(&container, error)),
        Ok(metadata) if !metadata.file_type().is_dir() => {
            return Err(WorkspaceError::UnsafePath(container));
        }
        Ok(_) => {}
    }
    let marker = read_cargo_marker(&container.join(WORKSPACE_MARKER))?;
    validate_cargo_marker(root, &container, &marker)?;
    if !dry_run {
        fs::remove_dir_all(&container).map_err(|error| io_error(&container, error))?;
        if has_locator {
            let metadata = fs::symlink_metadata(&locator_path)
                .map_err(|source| io_error(&locator_path, source))?;
            if !metadata.file_type().is_file() {
                return Err(WorkspaceError::UnsafePath(locator_path));
            }
            fs::remove_file(&locator_path).map_err(|source| io_error(&locator_path, source))?;
        }
    }
    Ok(true)
}

fn prepare_cached_workspace_with_operations<Operations: WorkspaceOperations>(
    root: &Path,
    lock: &ProjectLock,
    reuse_paths: &[PathBuf],
    operations: &mut Operations,
) -> Result<PathBuf, WorkspaceError> {
    require_lock(root, lock)?;
    ensure_container(root)?;
    recover_cached_workspace(root, lock)?;
    let workspace = cached_workspace_path(root)?;
    let staging = transaction_path(root, "staging")?;
    let previous = transaction_path(root, "previous")?;
    let result = (|| {
        let canonical_root =
            canonicalize_simplified(root).map_err(|error| io_error(root, error))?;
        copy_tree(
            root,
            &staging,
            CopyRoots {
                source: root,
                destination: &staging,
                final_destination: &workspace,
                canonical_source: &canonical_root,
            },
            true,
            operations,
        )?;
        link_node_modules(root, &staging, operations)?;
        for requested in reuse_paths {
            let from = checked_reuse_path(&workspace, requested)?;
            let to = staging.join(requested);
            // Output directories are excluded from the mirror only at the
            // root, so the staging tree may already hold a stale source copy
            // of a nested artifact. The cached artifact is the exact
            // post-build state and replaces it wholesale.
            match fs::symlink_metadata(&to) {
                Ok(existing) if existing.file_type().is_dir() => {
                    fs::remove_dir_all(&to).map_err(|error| io_error(&to, error))?;
                }
                Ok(_) => {
                    fs::remove_file(&to).map_err(|error| io_error(&to, error))?;
                }
                Err(_) => {}
            }
            let metadata = fs::symlink_metadata(&from).map_err(|error| io_error(&from, error))?;
            if metadata.file_type().is_dir() {
                let canonical_workspace = canonicalize_simplified(&workspace)
                    .map_err(|error| io_error(&workspace, error))?;
                copy_tree(
                    &from,
                    &to,
                    CopyRoots {
                        source: &workspace,
                        destination: &staging,
                        final_destination: &workspace,
                        canonical_source: &canonical_workspace,
                    },
                    false,
                    operations,
                )?;
            } else if metadata.file_type().is_file() {
                fs::create_dir_all(to.parent().expect("reuse parent"))
                    .map_err(|error| io_error(&to, error))?;
                operations.copy_file(&from, &to)?;
            } else {
                return Err(WorkspaceError::UnsupportedEntry(from));
            }
        }
        let mut moved_previous = false;
        if fs::symlink_metadata(&workspace).is_ok() {
            operations.rename(&workspace, &previous)?;
            moved_previous = true;
        }
        if let Err(error) = operations.rename(&staging, &workspace) {
            if moved_previous && fs::symlink_metadata(&workspace).is_err() {
                let _ = operations.rename(&previous, &workspace);
            }
            return Err(error);
        }
        if fs::symlink_metadata(&previous).is_ok() {
            remove_stored_tree_deferred(root, &previous)?;
        }
        Ok(workspace.clone())
    })();
    if fs::symlink_metadata(&staging).is_ok() {
        remove_stored_tree_deferred(root, &staging)?;
    }
    result
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct BuildCacheMetadata {
    #[serde(default)]
    artifact_paths: Vec<String>,
}

fn retain_cached_artifact_roots(
    keep: &mut BTreeSet<String>,
    artifact_paths: impl IntoIterator<Item = String>,
) {
    for artifact in artifact_paths {
        if let Some(top) = Path::new(&artifact)
            .components()
            .next()
            .and_then(|component| match component {
                Component::Normal(value) => value.to_str(),
                _ => None,
            })
        {
            keep.insert(top.into());
        }
    }
}

/// The state of every regular file in the mirror the moment before the
/// wrapped command starts: relative path to (length, modified time). Cheap to
/// take (stat only) and precise enough to attribute changes to the command.
pub struct WorkspaceOutputBaseline {
    entries: BTreeMap<PathBuf, (u64, SystemTime)>,
}

/// What flowed back to the real project after the wrapped command finished.
#[derive(Debug, Default, PartialEq, Eq)]
pub struct CommandOutputSync {
    pub synced: usize,
    /// Source files the command modified inside the workspace. Their mirror
    /// copies are instrumented, so copying them back would inject probes into
    /// the user's repository; they are reported instead.
    pub skipped_instrumented: Vec<PathBuf>,
    /// Files the command deleted inside the workspace. Deletions are reported
    /// rather than propagated: a defect here would destroy user data.
    pub deleted_in_workspace: Vec<PathBuf>,
}

fn walk_output_files(
    workspace: &Path,
    directory: &Path,
    entries: &mut BTreeMap<PathBuf, (u64, SystemTime)>,
) -> Result<(), WorkspaceError> {
    for entry in fs::read_dir(directory)
        .map_err(|error| io_error(directory, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(directory, error))?
    {
        let path = entry.path();
        let name = entry.file_name();
        let relative = path
            .strip_prefix(workspace)
            .map_err(|_| WorkspaceError::UnsafePath(path.clone()))?
            .to_owned();
        // Supercov's generated state never flows back, `.git` is not a
        // command output, and symlinks (the node_modules link above all) point
        // at the real project already.
        if relative.components().count() == 1
            && matches!(name.to_str(), Some(".supercov") | Some(".git"))
        {
            continue;
        }
        let metadata = entry.metadata().map_err(|error| io_error(&path, error))?;
        // Dependencies are never command outputs. Nested node_modules may be
        // materialised clones (see copy_tree), and a tool's cache inside any
        // node_modules must not flow back into the project's dependency tree.
        if metadata.is_dir() && name.to_str() == Some("node_modules") {
            continue;
        }
        if fs::symlink_metadata(&path)
            .map_err(|error| io_error(&path, error))?
            .file_type()
            .is_symlink()
        {
            continue;
        }
        if metadata.is_dir() {
            walk_output_files(workspace, &path, entries)?;
        } else if metadata.is_file() {
            let modified = metadata
                .modified()
                .map_err(|error| io_error(&path, error))?;
            entries.insert(relative, (metadata.len(), modified));
        }
    }
    Ok(())
}

pub fn workspace_output_baseline(
    workspace: &Path,
) -> Result<WorkspaceOutputBaseline, WorkspaceError> {
    let mut entries = BTreeMap::new();
    walk_output_files(workspace, workspace, &mut entries)?;
    Ok(WorkspaceOutputBaseline { entries })
}

/// Refuse to copy through any pre-existing symlink component under the
/// project root, so a command output can never be redirected outside it.
fn validate_writeback_destination(root: &Path, relative: &Path) -> Result<(), WorkspaceError> {
    if relative.as_os_str().is_empty()
        || relative
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(WorkspaceError::UnsafePath(relative.into()));
    }
    let mut current = root.to_owned();
    for component in relative.components() {
        current.push(component.as_os_str());
        match fs::symlink_metadata(&current) {
            Ok(metadata) if metadata.file_type().is_symlink() => {
                return Err(WorkspaceError::UnsafePath(current));
            }
            Ok(_) => {}
            Err(error) if error.kind() == io::ErrorKind::NotFound => break,
            Err(error) => return Err(io_error(&current, error)),
        }
    }
    Ok(())
}

/// Copy files the wrapped command created or changed in the mirror back to
/// the real project, so `supercov -- <command>` leaves the working tree in
/// the same state `<command>` alone would have: updated snapshots, generated
/// fixtures, and reports land in the repository, not in a cache directory.
/// `protected` names relative paths whose mirror copies are instrumented and
/// must never flow back.
pub fn sync_command_outputs(
    root: &Path,
    workspace: &Path,
    baseline: &WorkspaceOutputBaseline,
    protected: &BTreeSet<PathBuf>,
) -> Result<CommandOutputSync, WorkspaceError> {
    let mut current = BTreeMap::new();
    walk_output_files(workspace, workspace, &mut current)?;
    let mut sync = CommandOutputSync::default();
    for (relative, state) in &current {
        if baseline.entries.get(relative) == Some(state) {
            continue;
        }
        if protected.contains(relative) {
            sync.skipped_instrumented.push(relative.clone());
            continue;
        }
        let from = workspace.join(relative);
        // A file the command built FROM an instrumented source carries the
        // instrumentation with it. Copying that into the project would leave
        // probes and a workspace-only runtime import in the application's own
        // build output, which is the one thing isolation promises never
        // happens. The generated runtime lives only inside a workspace, so a
        // reference to it is proof the file is not the command's own output.
        if references_generated_runtime(&from)? {
            sync.skipped_instrumented.push(relative.clone());
            continue;
        }
        if unaccompanied_install_manifest(root, workspace, relative) {
            continue;
        }
        validate_writeback_destination(root, relative)?;
        let to = root.join(relative);
        if let Some(parent) = to.parent() {
            fs::create_dir_all(parent).map_err(|error| io_error(parent, error))?;
        }
        fs::copy(&from, &to).map_err(|error| io_error(&to, error))?;
        sync.synced += 1;
    }
    for relative in baseline.entries.keys() {
        if !current.contains_key(relative) {
            sync.deleted_in_workspace.push(relative.clone());
        }
    }
    Ok(sync)
}

/// Give the workspace a git repository of its own, as the project has one.
///
/// Tools in a test command read git: npm's template-oss-check derives the
/// repository and release branches it expects from it, and semver's posttest
/// failed without one ("\"repository\" ... expected to be removed"). The
/// project's own .git is never shared -- a test's `git add` or `commit`
/// would then change the user's index and refs -- so this is a clone that
/// borrows the project's objects and has its own refs, index and config: the
/// project's HEAD, remotes and remote branches, and an index read from HEAD.
/// Best effort: without git, or on any failure, the workspace has no .git.
pub fn mirror_git_repository(root: &Path, workspace: &Path) -> Result<(), String> {
    if fs::symlink_metadata(root.join(".git")).is_err() {
        return Ok(());
    }
    let target = workspace.join(".git");
    let git = |directory: &Path, arguments: &[&str]| -> Result<String, String> {
        let output = std::process::Command::new("git")
            .arg("-C")
            .arg(directory)
            .args(arguments)
            .env("GIT_TERMINAL_PROMPT", "0")
            .stdin(std::process::Stdio::null())
            .output()
            .map_err(|error| format!("git {}: {error}", arguments.join(" ")))?;
        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).trim().to_owned())
        } else {
            Err(format!(
                "git {}: {}",
                arguments.join(" "),
                String::from_utf8_lossy(&output.stderr).trim()
            ))
        }
    };
    let result = (|| {
        if fs::symlink_metadata(&target).is_ok() {
            fs::remove_dir_all(&target).map_err(|error| error.to_string())?;
        }
        let source = root.to_string_lossy();
        let destination = target.to_string_lossy();
        git(
            workspace,
            &[
                "clone",
                "--quiet",
                "--shared",
                "--bare",
                &source,
                &destination,
            ],
        )?;
        git(workspace, &["config", "core.bare", "false"])?;
        match git(root, &["symbolic-ref", "-q", "HEAD"]) {
            Ok(branch) => git(workspace, &["symbolic-ref", "HEAD", &branch])?,
            Err(_) => {
                let commit = git(root, &["rev-parse", "HEAD"])?;
                git(workspace, &["update-ref", "--no-deref", "HEAD", &commit])?
            }
        };
        git(workspace, &["remote", "remove", "origin"])?;
        let remotes = git(root, &["remote"])?;
        for name in remotes.lines().filter(|name| !name.is_empty()) {
            // As configured: get-url applies the user's insteadOf rewrites,
            // which the clone's own reads apply again.
            let url = git(root, &["config", "--get", &format!("remote.{name}.url")])?;
            git(workspace, &["remote", "add", name, &url])?;
        }
        git(
            workspace,
            &[
                "fetch",
                "--quiet",
                "--no-tags",
                &source,
                "+refs/remotes/*:refs/remotes/*",
            ],
        )?;
        git(workspace, &["read-tree", "HEAD"])?;
        // Supercov's own directories are not the command's untracked files.
        let exclude = target.join("info/exclude");
        fs::create_dir_all(target.join("info")).map_err(|error| error.to_string())?;
        let mut patterns = fs::read_to_string(&exclude).unwrap_or_default();
        patterns.push_str("\n.supercov/\n");
        fs::write(&exclude, patterns).map_err(|error| error.to_string())?;
        Ok(())
    })();
    if result.is_err() {
        let _ = fs::remove_dir_all(&target);
    }
    result
}

/// Keep the files Supercov rewrote out of the workspace repository's status:
/// natively they are unmodified, and a test that checks for a clean tree must
/// find one. Best effort, as the repository is.
pub fn hide_rewritten_files(workspace: &Path, files: &[String]) {
    if files.is_empty() || !workspace.join(".git").is_dir() {
        return;
    }
    let run = |arguments: &[&str], input: &str| {
        let mut child = std::process::Command::new("git")
            .arg("-C")
            .arg(workspace)
            .args(arguments)
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::null())
            .spawn()
            .ok()?;
        child.stdin.take()?.write_all(input.as_bytes()).ok()?;
        let output = child.wait_with_output().ok()?;
        output
            .status
            .success()
            .then(|| String::from_utf8_lossy(&output.stdout).into_owned())
    };
    // Only tracked files carry the bit; git refuses the rest.
    let Some(listed) = run(&["ls-files", "-z"], "") else {
        return;
    };
    let tracked = listed.split('\0').collect::<BTreeSet<_>>();
    let hidden = files
        .iter()
        .filter(|file| tracked.contains(file.as_str()))
        .map(String::as_str)
        .collect::<Vec<_>>();
    if !hidden.is_empty() {
        let _ = run(
            &["update-index", "--skip-worktree", "--stdin"],
            &hidden.join("\n"),
        );
    }
}

/// Whether `relative` is the manifest or lockfile of an install the command
/// made in the workspace alone. node_modules never flows back, so copying
/// these would leave the project claiming an install it does not have: tap
/// installs its plugins into .tap/plugins, found package.json and a lockfile
/// there on the next run without Supercov, and failed to import them. Left
/// out, the tool installs them again as it would the first time.
fn unaccompanied_install_manifest(root: &Path, workspace: &Path, relative: &Path) -> bool {
    let manifest = relative
        .file_name()
        .and_then(|name| name.to_str())
        .is_some_and(|name| {
            matches!(
                name,
                "package.json"
                    | "package-lock.json"
                    | "npm-shrinkwrap.json"
                    | "yarn.lock"
                    | "pnpm-lock.yaml"
                    | "bun.lock"
                    | "bun.lockb"
            )
        });
    let Some(directory) = relative.parent() else {
        return false;
    };
    manifest
        && workspace.join(directory).join("node_modules").is_dir()
        && !root.join(directory).join("node_modules").exists()
}

/// Whether `path` mentions the generated runtime module, which exists only
/// inside an instrumented workspace. Read as bytes: build output can be
/// minified, source-mapped or not valid UTF-8, and the marker is ASCII.
fn references_generated_runtime(path: &Path) -> Result<bool, WorkspaceError> {
    const MARKER: &[u8] = b".supercov/node_modules/";
    let contents = match fs::read(path) {
        Ok(contents) => contents,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(false),
        Err(error) => return Err(io_error(path, error)),
    };
    Ok(contents
        .windows(MARKER.len())
        .any(|window| window == MARKER))
}

pub fn prune_cached_workspace_sources(
    root: &Path,
    lock: &ProjectLock,
) -> Result<Vec<String>, WorkspaceError> {
    require_lock(root, lock)?;
    let workspace = cached_workspace_path(root)?;
    if fs::symlink_metadata(&workspace).is_err() {
        return Ok(Vec::new());
    }
    let mut keep = BTreeSet::from(["node_modules".to_owned(), ".supercov".to_owned()]);
    let metadata_path = workspace.join(".supercov/build-cache.json");
    if let Ok(bytes) = fs::read(&metadata_path) {
        let metadata: BuildCacheMetadata =
            serde_json::from_slice(&bytes).map_err(WorkspaceError::InvalidCacheMetadata)?;
        retain_cached_artifact_roots(&mut keep, metadata.artifact_paths);
    }
    let mut removed = Vec::new();
    for entry in fs::read_dir(&workspace).map_err(|error| io_error(&workspace, error))? {
        let entry = entry.map_err(|error| io_error(&workspace, error))?;
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| WorkspaceError::UnsafePath(entry.path()))?;
        if keep.contains(&name) {
            continue;
        }
        remove_stored_tree_deferred(root, &entry.path())?;
        removed.push(name);
    }
    removed.sort();
    Ok(removed)
}

#[cfg(test)]
mod tests {
    #[test]
    fn file_urls_match_what_node_derives_for_every_path_shape() {
        use super::file_url_from_slash_path;
        assert_eq!(
            file_url_from_slash_path("C:/Users/runner/AppData/Local/Temp/x/register.mjs"),
            "file:///C:/Users/runner/AppData/Local/Temp/x/register.mjs"
        );
        assert_eq!(
            file_url_from_slash_path("C:/Users/a b/#1/register.mjs"),
            "file:///C:/Users/a%20b/%231/register.mjs"
        );
        assert_eq!(
            file_url_from_slash_path("//server/share/dir/register.mjs"),
            "file://server/share/dir/register.mjs"
        );
        assert_eq!(
            file_url_from_slash_path("/w/p/register.mjs"),
            "file:///w/p/register.mjs"
        );
        assert_eq!(
            file_url_from_slash_path("/w/p x?q/ü.mjs"),
            "file:///w/p%20x%3Fq/%C3%BC.mjs"
        );
    }

    #[test]
    fn verbatim_prefixes_are_stripped_and_plain_paths_left_alone() {
        use super::strip_verbatim;
        assert_eq!(strip_verbatim(r"\\?\C:\a\b").as_deref(), Some(r"C:\a\b"));
        assert_eq!(strip_verbatim(r"\\?\d:\x").as_deref(), Some(r"d:\x"));
        assert_eq!(
            strip_verbatim(r"\\?\UNC\server\share\dir").as_deref(),
            Some(r"\\server\share\dir")
        );
        assert_eq!(strip_verbatim(r"C:\a\b"), None);
        assert_eq!(strip_verbatim("/w/project"), None);
        assert_eq!(strip_verbatim(r"\\server\share"), None);
        assert_eq!(strip_verbatim(r"\\?\"), None);
    }

    use super::*;

    fn writeback_fixture(name: &str) -> (PathBuf, PathBuf) {
        let base =
            std::env::temp_dir().join(format!("supercov-writeback-{}-{name}", std::process::id()));
        if base.exists() {
            fs::remove_dir_all(&base).unwrap();
        }
        let root = base.join("project");
        let workspace = base.join("workspace");
        fs::create_dir_all(root.join("src")).unwrap();
        fs::create_dir_all(workspace.join("src")).unwrap();
        fs::create_dir_all(workspace.join(".supercov")).unwrap();
        fs::write(root.join("src/app.ts"), "original\n").unwrap();
        fs::write(workspace.join("src/app.ts"), "instrumented\n").unwrap();
        fs::write(workspace.join(".supercov/state.json"), "{}").unwrap();
        (root, workspace)
    }

    #[test]
    fn the_workspace_has_a_repository_of_its_own_that_reads_like_the_project() {
        let (root, workspace) = writeback_fixture("git-mirror");
        let git = |directory: &Path, arguments: &[&str]| {
            let output = std::process::Command::new("git")
                .arg("-C")
                .arg(directory)
                .args(arguments)
                .output()
                .unwrap();
            assert!(output.status.success(), "git {arguments:?}: {output:?}");
            String::from_utf8(output.stdout).unwrap().trim().to_owned()
        };
        git(&root, &["init", "--quiet", "--initial-branch=release/v2"]);
        git(&root, &["config", "user.email", "test@example.com"]);
        git(&root, &["config", "user.name", "Test"]);
        git(
            &root,
            &[
                "remote",
                "add",
                "origin",
                "https://github.com/example/app.git",
            ],
        );
        git(&root, &["add", "src/app.ts"]);
        git(&root, &["commit", "--quiet", "-m", "first"]);
        let head = git(&root, &["rev-parse", "HEAD"]);

        mirror_git_repository(&root, &workspace).unwrap();
        assert_eq!(git(&workspace, &["rev-parse", "HEAD"]), head);
        assert_eq!(
            git(&workspace, &["symbolic-ref", "HEAD"]),
            "refs/heads/release/v2"
        );
        assert_eq!(
            git(&workspace, &["config", "--get", "remote.origin.url"]),
            "https://github.com/example/app.git"
        );
        // The workspace copy is instrumented and .supercov is Supercov's.
        hide_rewritten_files(&workspace, &["src/app.ts".to_owned()]);
        assert_eq!(git(&workspace, &["status", "--porcelain"]), "");

        // A commit a test makes stays in the workspace's own repository.
        fs::write(workspace.join("new.txt"), "new\n").unwrap();
        git(&workspace, &["add", "new.txt"]);
        git(
            &workspace,
            &[
                "-c",
                "user.email=t@example.com",
                "-c",
                "user.name=T",
                "commit",
                "--quiet",
                "-m",
                "second",
            ],
        );
        assert_eq!(git(&root, &["rev-parse", "HEAD"]), head);
        assert_eq!(git(&root, &["status", "--porcelain"]), "");
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn an_install_the_command_made_does_not_flow_back_without_its_dependencies() {
        let (root, workspace) = writeback_fixture("tool-install");
        fs::write(workspace.join("package.json"), "{}").unwrap();
        fs::write(root.join("package.json"), "{}").unwrap();
        fs::create_dir_all(workspace.join("node_modules")).unwrap();
        fs::create_dir_all(root.join("node_modules")).unwrap();
        let baseline = workspace_output_baseline(&workspace).unwrap();
        // tap installs the plugins its config names into .tap/plugins.
        fs::create_dir_all(workspace.join(".tap/plugins/node_modules/@tapjs/clock")).unwrap();
        fs::write(workspace.join(".tap/plugins/package.json"), "{}").unwrap();
        fs::write(workspace.join(".tap/plugins/package-lock.json"), "{}").unwrap();
        fs::create_dir_all(workspace.join(".tap/test-results")).unwrap();
        fs::write(workspace.join(".tap/test-results/basic.tap"), "ok").unwrap();
        // The project's own manifest still flows back beside its own install.
        fs::write(workspace.join("package.json"), "{\"version\":\"2\"}").unwrap();
        let sync = sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap();
        assert!(!root.join(".tap/plugins/package.json").exists());
        assert!(!root.join(".tap/plugins/package-lock.json").exists());
        assert!(root.join(".tap/test-results/basic.tap").is_file());
        assert_eq!(
            fs::read_to_string(root.join("package.json")).unwrap(),
            "{\"version\":\"2\"}"
        );
        assert_eq!(sync.synced, 2);
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn dependency_trees_never_flow_back() {
        // Nested node_modules may be materialised clones, and any node_modules
        // can hold a tool's cache: neither is a command output.
        let (root, workspace) = writeback_fixture("dependencies");
        let baseline = workspace_output_baseline(&workspace).unwrap();
        fs::create_dir_all(workspace.join("node_modules/.vite")).unwrap();
        fs::write(workspace.join("node_modules/.vite/deps.json"), "{}").unwrap();
        fs::create_dir_all(workspace.join("packages/app/node_modules/dep")).unwrap();
        fs::write(
            workspace.join("packages/app/node_modules/dep/index.js"),
            "dep",
        )
        .unwrap();
        let sync = sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap();
        assert_eq!(sync.synced, 0);
        assert!(sync.deleted_in_workspace.is_empty());
        assert!(!root.join("node_modules").exists());
        assert!(!root.join("packages").exists());
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn output_built_from_instrumented_sources_never_flows_back() {
        // A build the command runs inside the workspace compiles the
        // instrumented copies, so its output carries probes and an import of a
        // runtime that exists only in the workspace. Writing that into the
        // project would leave the application's own build output instrumented
        // after the run, which isolation promises never happens.
        let (root, workspace) = writeback_fixture("built-output");
        let baseline = workspace_output_baseline(&workspace).unwrap();
        fs::create_dir_all(workspace.join("dist")).unwrap();
        fs::write(
            workspace.join("dist/app.js"),
            "import { coverageHit } from \"./.supercov/node_modules/runtime.mjs\";\ncoverageHit(0);\n",
        )
        .unwrap();
        fs::write(
            workspace.join("dist/app.d.ts"),
            "export declare const a: number;\n",
        )
        .unwrap();

        let sync = sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap();

        assert_eq!(
            sync.skipped_instrumented,
            vec![PathBuf::from("dist/app.js")],
            "the instrumented artifact is reported, not copied"
        );
        assert!(!root.join("dist/app.js").exists());
        // A sibling the build emitted that carries no instrumentation is the
        // command's own output and still belongs to the project.
        assert_eq!(sync.synced, 1);
        assert!(root.join("dist/app.d.ts").exists());
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn command_outputs_flow_back_to_the_project() {
        let (root, workspace) = writeback_fixture("outputs");
        let baseline = workspace_output_baseline(&workspace).unwrap();
        fs::create_dir_all(workspace.join("src/__snapshots__")).unwrap();
        fs::write(
            workspace.join("src/__snapshots__/app.snap"),
            "updated snapshot\n",
        )
        .unwrap();
        fs::write(workspace.join(".supercov/state.json"), "{\"changed\":1}").unwrap();
        let sync = sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap();
        assert_eq!(sync.synced, 1);
        assert_eq!(
            fs::read_to_string(root.join("src/__snapshots__/app.snap")).unwrap(),
            "updated snapshot\n"
        );
        assert!(!root.join(".supercov/state.json").exists());
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn instrumented_sources_never_flow_back() {
        let (root, workspace) = writeback_fixture("protected");
        let baseline = workspace_output_baseline(&workspace).unwrap();
        // A formatter run by the command rewrites the instrumented copy; the
        // real source must keep its original bytes.
        fs::write(workspace.join("src/app.ts"), "instrumented, reformatted\n").unwrap();
        let protected = BTreeSet::from([PathBuf::from("src/app.ts")]);
        let sync = sync_command_outputs(&root, &workspace, &baseline, &protected).unwrap();
        assert_eq!(sync.synced, 0);
        assert_eq!(sync.skipped_instrumented, [PathBuf::from("src/app.ts")]);
        assert_eq!(
            fs::read_to_string(root.join("src/app.ts")).unwrap(),
            "original\n"
        );
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[test]
    fn workspace_deletions_are_reported_but_never_propagated() {
        let (root, workspace) = writeback_fixture("deletions");
        fs::write(workspace.join("stale.txt"), "old\n").unwrap();
        fs::write(root.join("stale.txt"), "old\n").unwrap();
        let baseline = workspace_output_baseline(&workspace).unwrap();
        fs::remove_file(workspace.join("stale.txt")).unwrap();
        let sync = sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap();
        assert_eq!(sync.deleted_in_workspace, [PathBuf::from("stale.txt")]);
        assert!(root.join("stale.txt").exists());
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn writeback_refuses_a_symlinked_destination() {
        let (root, workspace) = writeback_fixture("symlink");
        let outside = root.parent().unwrap().join("outside");
        fs::create_dir_all(&outside).unwrap();
        std::os::unix::fs::symlink(&outside, root.join("reports")).unwrap();
        let baseline = workspace_output_baseline(&workspace).unwrap();
        fs::create_dir_all(workspace.join("reports")).unwrap();
        fs::write(workspace.join("reports/result.txt"), "output\n").unwrap();
        let error =
            sync_command_outputs(&root, &workspace, &baseline, &BTreeSet::new()).unwrap_err();
        assert!(matches!(error, WorkspaceError::UnsafePath(_)));
        assert!(!outside.join("result.txt").exists());
        fs::remove_dir_all(root.parent().unwrap()).unwrap();
    }

    struct OrdinaryCopyOperations;

    impl WorkspaceOperations for OrdinaryCopyOperations {
        fn copy_file(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
            fs::copy(source, destination)
                .map(|_| ())
                .map_err(|error| io_error(destination, error))
        }

        fn rename(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
            atomic_rename(source, destination).map_err(WorkspaceError::from)
        }
    }

    struct FaultOperations {
        copy_count: usize,
        fail_copy_at: Option<usize>,
        rename_count: usize,
        fail_rename_at: Option<usize>,
    }

    impl WorkspaceOperations for FaultOperations {
        fn copy_file(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
            self.copy_count += 1;
            if self.fail_copy_at == Some(self.copy_count) {
                return Err(io_error(
                    destination,
                    io::Error::new(io::ErrorKind::StorageFull, "injected disk full"),
                ));
            }
            SystemWorkspaceOperations.copy_file(source, destination)
        }

        fn rename(&mut self, source: &Path, destination: &Path) -> Result<(), WorkspaceError> {
            self.rename_count += 1;
            if self.fail_rename_at == Some(self.rename_count) {
                return Err(io_error(
                    destination,
                    io::Error::other("injected publication rename failure"),
                ));
            }
            SystemWorkspaceOperations.rename(source, destination)
        }
    }

    fn transaction_debris(root: &Path) -> Vec<String> {
        let workspace = cached_workspace_path(root).unwrap();
        let prefix = format!(".{}.", project_name(root).unwrap().to_string_lossy());
        fs::read_dir(workspace.parent().unwrap())
            .unwrap()
            .filter_map(Result::ok)
            .map(|entry| entry.file_name().to_string_lossy().into_owned())
            .filter(|name| name.starts_with(&prefix))
            .collect()
    }

    fn project() -> PathBuf {
        let root = std::env::temp_dir().join(format!("supercov-workspace-rust-{}", unique()));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(root.join("src/index.js"), "one").unwrap();
        fs::write(root.join("package.json"), "{}").unwrap();
        root
    }

    #[test]
    #[cfg(unix)]
    fn root_node_modules_symlink_is_followed() {
        // pnpm layouts often make the project's node_modules a symlink into an
        // external store. Refusing it forced a 3.7 GB manual materialisation;
        // entries are linked to absolute targets regardless, so following the
        // root link is isolation-neutral.
        let root = project();
        let store = std::env::temp_dir().join(format!("supercov-store-{}", unique()));
        fs::create_dir_all(store.join("left-pad")).unwrap();
        fs::write(store.join("left-pad/package.json"), "{}").unwrap();
        std::os::unix::fs::symlink(&store, root.join("node_modules")).unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_isolated_workspace(&root, "run", &lock).unwrap();
        assert!(
            fs::symlink_metadata(workspace.join("node_modules/left-pad"))
                .unwrap()
                .file_type()
                .is_symlink()
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(store).unwrap();
    }

    #[test]
    #[cfg(unix)]
    fn dangling_symlinks_are_preserved_and_escaping_ones_still_refused() {
        // npm and pnpm workspaces routinely leave symlinks to packages that
        // are not installed. superinterface's examples/*/node_modules carried
        // one, plain `npm test` never resolves it, and the mirror died on
        // `canonicalize` with ENOENT before any test ran. A dangling link
        // resolves to nothing, so it can leak nothing: it is preserved as-is,
        // while the lexical containment check still applies.
        let root = project();
        let nested = root.join("examples/app/node_modules/@scope");
        fs::create_dir_all(&nested).unwrap();
        std::os::unix::fs::symlink(
            "../../../../packages/react/node_modules/@scope/pkg",
            nested.join("pkg"),
        )
        .unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_isolated_workspace(&root, "run", &lock).unwrap();
        let mirrored = workspace.join("examples/app/node_modules/@scope/pkg");
        let metadata = fs::symlink_metadata(&mirrored).unwrap();
        assert!(metadata.file_type().is_symlink());
        assert_eq!(
            fs::read_link(&mirrored).unwrap(),
            PathBuf::from("../../../../packages/react/node_modules/@scope/pkg")
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    #[cfg(target_os = "macos")]
    fn nested_node_modules_are_cloned_not_linked() {
        // A suite that mounts the workspace into a VM sees no host paths, so
        // entry links into the original tree dangle there and npm fails to
        // re-link them across the mount. APFS clones the directory instead:
        // real files, relative links inside kept verbatim, and writes staying
        // in the workspace.
        let root = project();
        let nested = root.join("packages/app/node_modules");
        fs::create_dir_all(nested.join("dep")).unwrap();
        fs::create_dir_all(nested.join(".bin")).unwrap();
        fs::write(nested.join("dep/index.js"), "dep").unwrap();
        std::os::unix::fs::symlink("../dep/index.js", nested.join(".bin/dep")).unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_isolated_workspace(&root, "run", &lock).unwrap();
        let mirrored = workspace.join("packages/app/node_modules");
        assert!(
            fs::symlink_metadata(mirrored.join("dep"))
                .unwrap()
                .file_type()
                .is_dir()
        );
        assert_eq!(
            fs::read_to_string(mirrored.join("dep/index.js")).unwrap(),
            "dep"
        );
        assert_eq!(
            fs::read_link(mirrored.join(".bin/dep")).unwrap(),
            PathBuf::from("../dep/index.js")
        );
        fs::write(mirrored.join("dep/index.js"), "changed in the workspace").unwrap();
        assert_eq!(
            fs::read_to_string(nested.join("dep/index.js")).unwrap(),
            "dep"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    #[cfg(unix)]
    fn hard_linked_dependency_tree_is_real_and_replaceable() {
        // The Linux materialisation: files share inodes with the originals,
        // symlinks are carried verbatim, and replacing an entry in the
        // workspace (npm's reify) leaves the user's tree untouched.
        use std::os::unix::fs::MetadataExt;
        let base = std::env::temp_dir().join(format!("supercov-hardlink-{}", unique()));
        let source = base.join("node_modules");
        fs::create_dir_all(source.join("dep")).unwrap();
        fs::create_dir_all(source.join(".bin")).unwrap();
        fs::write(source.join("dep/index.js"), "dep").unwrap();
        std::os::unix::fs::symlink("../dep/index.js", source.join(".bin/dep")).unwrap();
        let destination = base.join("workspace/node_modules");
        fs::create_dir_all(destination.parent().unwrap()).unwrap();
        assert!(hard_link_tree(&source, &destination));
        assert_eq!(
            fs::metadata(destination.join("dep/index.js"))
                .unwrap()
                .ino(),
            fs::metadata(source.join("dep/index.js")).unwrap().ino()
        );
        assert_eq!(
            fs::read_link(destination.join(".bin/dep")).unwrap(),
            PathBuf::from("../dep/index.js")
        );
        fs::remove_dir_all(destination.join("dep")).unwrap();
        fs::create_dir_all(destination.join("dep")).unwrap();
        fs::write(destination.join("dep/index.js"), "replaced").unwrap();
        assert_eq!(
            fs::read_to_string(source.join("dep/index.js")).unwrap(),
            "dep"
        );
        fs::remove_dir_all(base).unwrap();
    }

    #[test]
    #[cfg(unix)]
    fn symlink_escaping_the_project_is_omitted_from_the_mirror() {
        // The escape check guards the MIRRORED source tree. node_modules (root
        // and nested) are linked or cloned from the user's originals instead,
        // so the escaping fixture lives outside node_modules here.
        // Leftover tool state (a Chrome test profile linking into /tmp) must
        // not abort measurement: the entry is omitted and the run proceeds.
        let root = project();
        let nested = root.join("examples/app/lib");
        fs::create_dir_all(&nested).unwrap();
        std::os::unix::fs::symlink("../../../../../outside-the-project/pkg", nested.join("pkg"))
            .unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_isolated_workspace(&root, "run", &lock).unwrap();
        assert!(fs::symlink_metadata(workspace.join("examples/app/lib/pkg")).is_err());
        assert!(workspace.join("src/index.js").exists());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn isolated_copy_never_changes_source_and_requires_the_lock() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_isolated_workspace(&root, "run", &lock).unwrap();
        fs::write(workspace.join("src/index.js"), "instrumented").unwrap();
        assert_eq!(
            fs::read_to_string(root.join("src/index.js")).unwrap(),
            "one"
        );
        lock.release().unwrap();
        assert!(matches!(
            prepare_isolated_workspace(&root, "other", &lock),
            Err(WorkspaceError::MissingLock)
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn everything_supercov_writes_lives_under_the_store() {
        let root = project();
        assert_eq!(
            workspace_container(&root),
            root.join(".supercov/workspaces")
        );
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        assert!(workspace.starts_with(root.join(".supercov")));
        assert_eq!(
            fs::read_to_string(root.join(".supercov/.gitignore")).unwrap(),
            "*\n"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn an_unowned_container_gets_a_deterministic_fallback() {
        let root = project();
        fs::create_dir_all(root.join(".supercov/workspaces")).unwrap();
        fs::write(root.join(".supercov/workspaces/user-file"), "mine\n").unwrap();
        let container = workspace_container(&root);
        assert_ne!(container, root.join(".supercov/workspaces"));
        let name = container
            .file_name()
            .unwrap()
            .to_string_lossy()
            .into_owned();
        assert!(name.starts_with("workspaces-"));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn user_supercov_directory_is_copied_and_never_adopted() {
        let root = project();
        fs::create_dir(root.join("supercov")).unwrap();
        fs::write(root.join("supercov/user-module.js"), "export default 1;\n").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        assert_ne!(workspace_container(&root), root.join("supercov"));
        assert_eq!(
            fs::read_to_string(workspace.join("supercov/user-module.js")).unwrap(),
            "export default 1;\n"
        );
        assert_eq!(
            fs::read_to_string(root.join("supercov/user-module.js")).unwrap(),
            "export default 1;\n"
        );
        assert!(!root.join("supercov").join(WORKSPACE_MARKER).exists());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cargo_cache_is_an_owned_same_parent_sibling_and_cleans_exactly() {
        let root = project();
        fs::create_dir_all(root.join(".cargo")).unwrap();
        fs::write(
            root.join(".cargo/config.toml"),
            "[build]\nrustflags=[\"--cfg\",\"copied-once\"]\n",
        )
        .unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cargo_cached_workspace(&root, &lock).unwrap();
        let container = cargo_workspace_container(&root).unwrap();
        assert_eq!(
            container.parent(),
            canonicalize_simplified(&root).unwrap().parent()
        );
        assert!(!workspace.starts_with(&root));
        assert_eq!(workspace.file_name(), root.file_name());
        assert_eq!(
            fs::read_to_string(workspace.join(".cargo/config.toml")).unwrap(),
            "[build]\nrustflags=[\"--cfg\",\"copied-once\"]\n"
        );
        fs::create_dir_all(workspace.join(".supercov/work/run_1")).unwrap();
        assert!(remove_cargo_workspace_run(&root, "run_1").unwrap());
        assert!(!workspace.join(".supercov/work/run_1").exists());
        assert!(clean_cargo_workspace(&root, true).unwrap());
        assert!(container.exists());
        assert!(clean_cargo_workspace(&root, false).unwrap());
        assert!(!container.exists());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn read_only_checkout_parent_uses_authenticated_temporary_fallback() {
        use std::os::unix::fs::PermissionsExt;

        let outer = std::env::temp_dir().join(format!("supercov-read-only-parent-{}", unique()));
        let root = outer.join("project");
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(root.join("src/index.rs"), "pub fn value() -> usize { 1 }\n").unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='fallback-fixture'\nversion='0.0.0'\n",
        )
        .unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        fs::set_permissions(&outer, fs::Permissions::from_mode(0o555)).unwrap();
        let prepared = prepare_cargo_cached_workspace(&root, &lock);
        fs::set_permissions(&outer, fs::Permissions::from_mode(0o700)).unwrap();
        let workspace = prepared.unwrap();
        let locator = read_cargo_locator(&root).unwrap().unwrap();
        assert_eq!(locator.placement, CargoWorkspacePlacement::Temporary);
        let container = cargo_workspace_container(&root).unwrap();
        assert_eq!(workspace, container.join("workspace/root/project"));
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.rs")).unwrap(),
            "pub fn value() -> usize { 1 }\n"
        );
        assert!(!workspace.starts_with(&root));
        assert!(clean_cargo_workspace(&root, false).unwrap());
        assert!(!container.exists());
        assert!(!cargo_locator_path(&root).exists());
        lock.release().unwrap();
        fs::remove_dir_all(outer).unwrap();
    }

    #[test]
    fn cargo_locator_and_container_marker_must_share_the_random_token() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        prepare_cargo_cached_workspace(&root, &lock).unwrap();
        let original = read_cargo_locator(&root).unwrap().unwrap();
        let mut tampered = original.clone();
        tampered.token = "0".repeat(64);
        write_cargo_locator(&root, &tampered).unwrap();
        assert!(matches!(
            prepare_cargo_cached_workspace(&root, &lock),
            Err(WorkspaceError::UnsafePath(_))
        ));
        write_cargo_locator(&root, &original).unwrap();
        clean_cargo_workspace(&root, false).unwrap();
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cargo_cache_rejects_a_tampered_marker_without_deleting_it() {
        let root = project();
        let container = cargo_workspace_container(&root).unwrap();
        fs::create_dir(&container).unwrap();
        fs::write(container.join(WORKSPACE_MARKER), "{}\n").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        assert!(matches!(
            prepare_cargo_cached_workspace(&root, &lock),
            Err(WorkspaceError::InvalidCacheMetadata(_)) | Err(WorkspaceError::UnsafePath(_))
        ));
        assert!(container.exists());
        lock.release().unwrap();
        fs::remove_dir_all(container).unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cargo_cache_copy_and_rename_failures_preserve_the_complete_generation() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cargo_cached_workspace(&root, &lock).unwrap();
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );
        fs::write(root.join("src/index.js"), "two").unwrap();

        let mut copy_failure = FaultOperations {
            copy_count: 0,
            fail_copy_at: Some(1),
            rename_count: 0,
            fail_rename_at: None,
        };
        assert!(matches!(
            prepare_cargo_cached_workspace_with_operations(&root, &lock, &mut copy_failure),
            Err(WorkspaceError::Io { .. })
        ));
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );

        let mut rename_failure = FaultOperations {
            copy_count: 0,
            fail_copy_at: None,
            rename_count: 0,
            fail_rename_at: Some(2),
        };
        assert!(matches!(
            prepare_cargo_cached_workspace_with_operations(&root, &lock, &mut rename_failure),
            Err(WorkspaceError::Io { .. })
        ));
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );

        let container = cargo_workspace_container(&root).unwrap();
        let prefix = format!(".{}.", project_name(&root).unwrap().to_string_lossy());
        assert!(
            fs::read_dir(&container)
                .unwrap()
                .filter_map(Result::ok)
                .all(|entry| !entry.file_name().to_string_lossy().starts_with(&prefix))
        );
        clean_cargo_workspace(&root, false).unwrap();
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn stable_cache_refreshes_atomically_and_reuses_only_explicit_artifacts() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let first = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        fs::create_dir_all(first.join("build")).unwrap();
        fs::write(first.join("build/output.js"), "instrumented").unwrap();
        fs::write(first.join("stale.txt"), "stale").unwrap();
        fs::write(root.join("src/index.js"), "two").unwrap();
        let second = prepare_cached_workspace(&root, &lock, &[PathBuf::from("build")]).unwrap();
        assert_eq!(first, second);
        assert_eq!(
            fs::read_to_string(second.join("src/index.js")).unwrap(),
            "two"
        );
        assert_eq!(
            fs::read_to_string(second.join("build/output.js")).unwrap(),
            "instrumented"
        );
        assert!(!second.join("stale.txt").exists());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn reused_artifact_replaces_the_mirrored_stale_copy_wholesale() {
        let root = project();
        fs::create_dir_all(root.join("packages/app/dist")).unwrap();
        fs::write(root.join("packages/app/dist/stale.js"), "uninstrumented").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let first = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        fs::remove_file(first.join("packages/app/dist/stale.js")).unwrap();
        fs::write(first.join("packages/app/dist/built.js"), "instrumented").unwrap();
        let second =
            prepare_cached_workspace(&root, &lock, &[PathBuf::from("packages/app/dist")]).unwrap();
        assert_eq!(
            fs::read_to_string(second.join("packages/app/dist/built.js")).unwrap(),
            "instrumented"
        );
        assert!(!second.join("packages/app/dist/stale.js").exists());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn terminal_workspace_keeps_flat_frontend_cache_without_discoverable_test_sources() {
        let root = project();
        fs::create_dir_all(root.join("tests/e2e")).unwrap();
        fs::write(root.join("tests/e2e/app.spec.js"), "test source").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        let artifacts = workspace.join(".supercov/frontend-cache-artifacts");
        fs::create_dir_all(&artifacts).unwrap();
        fs::write(artifacts.join("digest"), "instrumented test").unwrap();
        fs::write(
            workspace.join(".supercov/frontend-cache.json"),
            "{\"schemaVersion\":2}",
        )
        .unwrap();
        prune_cached_workspace_sources(&root, &lock).unwrap();
        assert!(!workspace.join("tests/e2e/app.spec.js").exists());
        assert_eq!(
            fs::read_to_string(artifacts.join("digest")).unwrap(),
            "instrumented test"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn ordinary_copy_fallback_preserves_workspace_semantics() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let mut operations = OrdinaryCopyOperations;
        let workspace =
            prepare_cached_workspace_with_operations(&root, &lock, &[], &mut operations).unwrap();
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );
        assert_eq!(
            fs::read_to_string(root.join("src/index.js")).unwrap(),
            "one"
        );
        assert!(transaction_debris(&root).is_empty());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn enospc_during_copy_preserves_the_complete_generation() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        fs::write(workspace.join("generation"), "complete").unwrap();
        fs::write(root.join("src/index.js"), "new source").unwrap();
        let mut operations = FaultOperations {
            copy_count: 0,
            fail_copy_at: Some(1),
            rename_count: 0,
            fail_rename_at: None,
        };
        let error = prepare_cached_workspace_with_operations(&root, &lock, &[], &mut operations)
            .unwrap_err();
        assert!(matches!(
            error,
            WorkspaceError::Io { ref source, .. }
                if source.kind() == io::ErrorKind::StorageFull
        ));
        assert_eq!(
            fs::read_to_string(workspace.join("generation")).unwrap(),
            "complete"
        );
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );
        assert!(transaction_debris(&root).is_empty());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn failed_publication_rename_restores_the_complete_generation() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        fs::write(workspace.join("generation"), "complete").unwrap();
        fs::write(root.join("src/index.js"), "new source").unwrap();
        let mut operations = FaultOperations {
            copy_count: 0,
            fail_copy_at: None,
            rename_count: 0,
            fail_rename_at: Some(2),
        };
        let error = prepare_cached_workspace_with_operations(&root, &lock, &[], &mut operations)
            .unwrap_err();
        assert!(matches!(
            error,
            WorkspaceError::Io { ref source, .. }
                if source.kind() == io::ErrorKind::Other
        ));
        assert_eq!(
            operations.rename_count, 3,
            "prior generation was not restored"
        );
        assert_eq!(
            fs::read_to_string(workspace.join("generation")).unwrap(),
            "complete"
        );
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );
        assert!(transaction_debris(&root).is_empty());
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn relocates_internal_links_and_rejects_external_links() {
        use std::os::unix::fs::symlink;

        let root = project();
        fs::create_dir_all(root.join("shared")).unwrap();
        fs::write(root.join("shared/value"), "inside").unwrap();
        symlink("../shared/value", root.join("src/value-link")).unwrap();
        let external = project();
        fs::write(external.join("outside"), "outside").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        assert_eq!(
            fs::read_to_string(workspace.join("src/value-link")).unwrap(),
            "inside"
        );
        symlink(external.join("outside"), root.join("src/external-link")).unwrap();
        let refreshed = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        assert!(fs::symlink_metadata(refreshed.join("src/external-link")).is_err());
        assert_eq!(
            fs::read_to_string(workspace.join("src/index.js")).unwrap(),
            "one"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(external).unwrap();
    }

    #[cfg(windows)]
    #[test]
    fn relocates_internal_junctions_without_symlink_privileges() {
        let root = project();
        fs::create_dir_all(root.join("shared")).unwrap();
        fs::write(root.join("shared/value"), "inside").unwrap();
        junction::create(root.join("shared"), root.join("linked-shared")).unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        let isolated_link = workspace.join("linked-shared");
        assert!(junction::exists(&isolated_link).unwrap());
        assert_eq!(
            canonicalize_simplified(junction::get_target(&isolated_link).unwrap()).unwrap(),
            canonicalize_simplified(workspace.join("shared")).unwrap()
        );
        assert_eq!(
            fs::read_to_string(isolated_link.join("value")).unwrap(),
            "inside"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(windows)]
    #[test]
    fn mounts_node_modules_with_junctions_and_copies_metadata_files() {
        let root = project();
        fs::create_dir_all(root.join("node_modules/example")).unwrap();
        fs::write(root.join("node_modules/example/index.js"), "module").unwrap();
        fs::write(root.join("node_modules/.package-lock.json"), "lock").unwrap();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        let workspace = prepare_cached_workspace(&root, &lock, &[]).unwrap();
        let package = workspace.join("node_modules/example");
        assert!(junction::exists(&package).unwrap());
        assert_eq!(
            canonicalize_simplified(junction::get_target(&package).unwrap()).unwrap(),
            canonicalize_simplified(root.join("node_modules/example")).unwrap()
        );
        let metadata = workspace.join("node_modules/.package-lock.json");
        assert!(fs::symlink_metadata(&metadata).unwrap().is_file());
        assert_eq!(fs::read_to_string(metadata).unwrap(), "lock");
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn recovery_restores_the_newest_previous_generation_and_discards_staging() {
        let root = project();
        let mut lock = ProjectLock::acquire(&root, "run", "now").unwrap();
        ensure_container(&root).unwrap();
        let workspace = cached_workspace_path(&root).unwrap();
        let parent = workspace.parent().unwrap();
        fs::create_dir_all(parent).unwrap();
        let previous = parent.join(format!(
            "{}old",
            transaction_prefix(&root, "previous").unwrap()
        ));
        let staging = parent.join(format!(
            "{}new",
            transaction_prefix(&root, "staging").unwrap()
        ));
        fs::create_dir_all(&previous).unwrap();
        fs::write(previous.join("complete"), "yes").unwrap();
        fs::create_dir_all(&staging).unwrap();
        let result = recover_cached_workspace(&root, &lock).unwrap();
        assert!(result.restored_previous);
        assert_eq!(result.removed_staging, 1);
        assert_eq!(
            fs::read_to_string(workspace.join("complete")).unwrap(),
            "yes"
        );
        lock.release().unwrap();
        fs::remove_dir_all(root).unwrap();
    }
}
