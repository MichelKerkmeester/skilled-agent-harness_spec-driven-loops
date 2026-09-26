//! Deterministic first-party JavaScript/TypeScript source discovery.
//!
//! Discovery defines the coverage denominator. The walker never follows
//! links and turns unclassified first-party files into explicit blockers.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs, io,
    path::{Component, Path, PathBuf},
};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};

const GENERATED_DIRECTORIES: &[&str] = &[
    ".cache",
    "generated",
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
];
/// Whether a directory called `target` is a build tool's output rather than a
/// project's own code.
///
/// Cargo, Maven, sbt and Leiningen write there, but the name is not theirs: a
/// Flask application kept its whole package in `target/`, and dropping the
/// directory by name left the repository with no source at all. It is output
/// when a build that writes there is declared beside it, or when Cargo's own
/// markers are inside it, which also covers a `CARGO_TARGET_DIR` placed
/// elsewhere.
pub fn target_is_build_output(directory: &Path) -> bool {
    const BUILDS: &[&str] = &[
        "Cargo.toml",
        "pom.xml",
        "build.gradle",
        "build.gradle.kts",
        "settings.gradle",
        "settings.gradle.kts",
        "build.sbt",
        "project.clj",
    ];
    const MARKERS: &[&str] = &["CACHEDIR.TAG", ".rustc_info.json"];
    directory
        .parent()
        .is_some_and(|parent| BUILDS.iter().any(|name| parent.join(name).is_file()))
        || MARKERS.iter().any(|name| directory.join(name).is_file())
}

const SOURCE_DIRECTORIES: &[&str] = &["app", "src", "lib", "server", "client", "functions", "api"];
const PACKAGE_PARENTS: &[&str] = &["apps", "packages", "services", "workspaces"];
const TEST_DIRECTORIES: &[&str] = &[
    "__tests__",
    "test",
    "tests",
    "spec",
    "specs",
    "e2e",
    "fixture",
    "fixtures",
    "mock",
    "mocks",
    "__mocks__",
];
const CONFIG_TOOLS: &[&str] = &[
    "babel",
    "eslint",
    "graphql",
    "jest",
    "next",
    "nuxt",
    "playwright",
    "postcss",
    "prettier",
    "remix",
    "rollup",
    "stylelint",
    "tailwind",
    "tsup",
    "vite",
    "vitest",
    "webpack",
];
const DOT_CONFIG_TOOLS: &[&str] = &["babel", "eslint", "graphql", "prettier", "stylelint"];

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SourceScopeStatus {
    Included,
    Excluded,
    Ambiguous,
}

/// Scope reason for a bundler's output found in the tree (see `built_asset`).
pub const BUILT_ASSET_REASON: &str = "built asset";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SourceScopeEntry {
    pub file: String,
    pub status: SourceScopeStatus,
    pub reason: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub package_root: Option<String>,
}

impl SourceScopeEntry {
    /// A file the wrapped command generates rather than one anyone edits: it
    /// is never instrumented or cached, and a bundler renames it on every
    /// build, so it must not feed the source fingerprint.
    pub fn is_generated_output(&self) -> bool {
        self.status == SourceScopeStatus::Excluded && self.reason == BUILT_ASSET_REASON
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SourceScopeMode {
    Automatic,
    Explicit,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SourceScope {
    pub version: u32,
    pub mode: SourceScopeMode,
    pub roots: Vec<String>,
    pub entries: Vec<SourceScopeEntry>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SourceLimitation {
    pub id: String,
    pub kind: String,
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub source: String,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DiscoveredSourceScope {
    pub source_files: Vec<String>,
    pub source_roots: Vec<String>,
    pub scope: SourceScope,
    pub limitations: Vec<SourceLimitation>,
}

#[derive(Debug)]
pub enum SourceDiscoveryError {
    Io { path: PathBuf, source: io::Error },
    NonUtf8Path(PathBuf),
    InvalidRoot(PathBuf),
}

impl std::fmt::Display for SourceDiscoveryError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::NonUtf8Path(path) => {
                write!(
                    formatter,
                    "source path is not valid UTF-8: {}",
                    path.display()
                )
            }
            Self::InvalidRoot(path) => write!(
                formatter,
                "source root is not a regular file or directory: {}",
                path.display()
            ),
        }
    }
}

impl std::error::Error for SourceDiscoveryError {}

fn io_error(path: &Path, source: io::Error) -> SourceDiscoveryError {
    SourceDiscoveryError::Io {
        path: path.to_owned(),
        source,
    }
}

/// The variable that names first-party source roots, for every frontend.
pub const SOURCE_ROOTS_VARIABLE: &str = "SUPERCOV_SOURCE_ROOTS";

/// Why a file a frontend would otherwise measure was left out.
pub const OUTSIDE_EXPLICIT_ROOTS: &str = "outside explicit source roots";

/// The first-party source roots named in `SUPERCOV_SOURCE_ROOTS`:
/// comma-separated, trimmed, empties dropped. `None` when the variable is unset
/// or names nothing, which leaves discovery automatic.
///
/// Every frontend reads the roots through here. It used to be read on the
/// JavaScript path alone while the documentation described it without a
/// language, so a Python project that set it had every file measured anyway --
/// a vendored tree beside flat-layout sources came out at 660 files instead of
/// fifteen, with nothing to say the variable had been ignored.
pub fn configured_source_roots(environment: &BTreeMap<String, String>) -> Option<Vec<String>> {
    let roots = environment
        .get(SOURCE_ROOTS_VARIABLE)?
        .split(',')
        .map(str::trim)
        .filter(|root| !root.is_empty())
        .map(str::to_owned)
        .collect::<Vec<_>>();
    (!roots.is_empty()).then_some(roots)
}

/// Fold the roots a run was measured under into its execution configuration,
/// the part of a run's identity that records how it was asked to run. Two runs
/// over different roots measure different denominators and are not the same
/// run; nothing is appended when no roots were named, so every existing
/// fingerprint stays as it was.
pub fn fold_roots_into_configuration(configuration: &mut Vec<u8>, roots: Option<&[String]>) {
    let Some(roots) = roots.filter(|roots| !roots.is_empty()) else {
        return;
    };
    configuration.push(0);
    configuration
        .extend_from_slice(format!("{SOURCE_ROOTS_VARIABLE}={}", roots.join(",")).as_bytes());
}

/// Explicit source roots resolved against a project root. Each is an existing
/// directory or a single file, so a flat layout can name the modules it keeps
/// at the root one by one. A root that does not exist names nothing to measure
/// and is skipped; one that is neither a file nor a directory is refused, since
/// a symlink root would reach outside what the project owns.
#[derive(Debug, Clone)]
pub struct ExplicitSourceRoots {
    root: PathBuf,
    roots: Vec<PathBuf>,
    configured: Vec<String>,
}

impl ExplicitSourceRoots {
    pub fn resolve(root: &Path, configured: &[String]) -> Result<Self, SourceDiscoveryError> {
        let root = lexical_normalize(root);
        let roots = existing_roots(configured.iter().map(|value| resolve(&root, value)))?;
        Ok(Self {
            root,
            roots,
            configured: configured.to_vec(),
        })
    }

    /// Read the roots from the environment, if any are named.
    pub fn from_environment(
        root: &Path,
        environment: &BTreeMap<String, String>,
    ) -> Result<Option<Self>, SourceDiscoveryError> {
        configured_source_roots(environment)
            .map(|configured| Self::resolve(root, &configured))
            .transpose()
    }

    /// Read the roots named against `project`, resolved inside `workspace` --
    /// the isolated copy Go, the JVM and Rust measure. The copy mirrors the
    /// project, so a relative root names the same file in both. An absolute one
    /// names the original tree, which nothing in the copy lies under, so it is
    /// rebased onto the copy; without that it would match nothing and read as a
    /// typo. The roots are still quoted as they were written.
    pub fn from_environment_in(
        project: &Path,
        workspace: &Path,
        environment: &BTreeMap<String, String>,
    ) -> Result<Option<Self>, SourceDiscoveryError> {
        let Some(configured) = configured_source_roots(environment) else {
            return Ok(None);
        };
        let project = lexical_normalize(project);
        let rebased = configured
            .iter()
            .map(|value| {
                let path = Path::new(value);
                if !path.is_absolute() {
                    return value.clone();
                }
                lexical_normalize(path)
                    .strip_prefix(&project)
                    .map(|rest| {
                        let rest = rest.to_string_lossy().into_owned();
                        if rest.is_empty() { ".".into() } else { rest }
                    })
                    .unwrap_or_else(|_| value.clone())
            })
            .collect::<Vec<_>>();
        let mut roots = Self::resolve(workspace, &rebased)?;
        roots.configured = configured;
        Ok(Some(roots))
    }

    /// Whether a project-relative file lies under these roots: inside a
    /// directory root, or the very file a file root names.
    pub fn contains(&self, relative: &str) -> bool {
        root_contains(&self.roots, &lexical_normalize(&self.root.join(relative)))
    }

    /// The roots exactly as they were written, including any that name nothing.
    /// An error about roots quotes these, because the one that does not exist
    /// is usually the typo the person needs to see.
    pub fn configured(&self) -> &[String] {
        &self.configured
    }

    /// Refuse roots that left a frontend nothing to measure. A typo in the
    /// variable must not become a green run over zero files -- the failure mode
    /// most likely to pass unnoticed in an agent loop.
    pub fn refuse_if_empty(&self, remaining: usize, language: &str) -> Result<(), String> {
        if remaining > 0 {
            return Ok(());
        }
        let missing = self
            .configured
            .iter()
            .filter(|value| fs::symlink_metadata(resolve(&self.root, value)).is_err())
            .cloned()
            .collect::<Vec<_>>();
        let mut message = format!(
            "{SOURCE_ROOTS_VARIABLE}={} left no {language} source to measure",
            self.configured.join(",")
        );
        if !missing.is_empty() {
            message.push_str(&format!("; {} does not exist", missing.join(", ")));
        }
        message.push_str("; name the directories or files that hold your own code");
        Err(message)
    }

    /// The scope a frontend that has no scope of its own records when explicit
    /// roots shaped what it measures: the files kept, and the files the roots
    /// left out. Without it, honouring the variable would be as invisible as
    /// ignoring it -- the complaint that started this -- since `runs <id>
    /// scope` would have nothing to show.
    pub fn scope(
        &self,
        included: &[String],
        excluded: &[(String, &'static str)],
    ) -> Result<SourceScope, SourceDiscoveryError> {
        let mut entries = included
            .iter()
            .map(|file| SourceScopeEntry {
                file: file.clone(),
                status: SourceScopeStatus::Included,
                reason: "explicit source root".into(),
                package_root: None,
            })
            .chain(
                excluded
                    .iter()
                    .filter(|(_, reason)| *reason == OUTSIDE_EXPLICIT_ROOTS)
                    .map(|(file, reason)| SourceScopeEntry {
                        file: file.clone(),
                        status: SourceScopeStatus::Excluded,
                        reason: (*reason).into(),
                        package_root: None,
                    }),
            )
            .collect::<Vec<_>>();
        entries.sort_by(|left, right| left.file.cmp(&right.file));
        Ok(SourceScope {
            version: 1,
            mode: SourceScopeMode::Explicit,
            roots: self.local_roots()?,
            entries,
        })
    }

    /// The roots as project-relative paths, as the recorded scope names them.
    pub fn local_roots(&self) -> Result<Vec<String>, SourceDiscoveryError> {
        self.roots
            .iter()
            .map(|path| local_path(&self.root, path))
            .collect()
    }

    /// Split `sources` into the files these roots keep and the ones they leave
    /// out, recording why each was left out. A frontend's own exclusions --
    /// tests, environments, build output -- have already been applied, so a
    /// root narrows what is measured and never pulls a test file back in.
    pub fn narrow<T>(
        &self,
        sources: &mut Vec<T>,
        excluded: &mut Vec<(String, &'static str)>,
        file: impl Fn(&T) -> &str,
    ) {
        let (kept, outside): (Vec<T>, Vec<T>) = sources
            .drain(..)
            .partition(|source| self.contains(file(source)));
        excluded.extend(
            outside
                .iter()
                .map(|source| (file(source).to_owned(), OUTSIDE_EXPLICIT_ROOTS)),
        );
        *sources = kept;
    }
}

/// The configured or discovered roots that exist, each a regular file or
/// directory. Shared by explicit and automatic discovery so the two cannot
/// disagree about what counts as a root.
fn existing_roots(
    candidates: impl IntoIterator<Item = PathBuf>,
) -> Result<Vec<PathBuf>, SourceDiscoveryError> {
    let mut existing = BTreeSet::new();
    for path in candidates {
        match fs::symlink_metadata(&path) {
            Ok(metadata) if metadata.file_type().is_file() || metadata.file_type().is_dir() => {
                existing.insert(path);
            }
            Ok(_) => return Err(SourceDiscoveryError::InvalidRoot(path)),
            Err(error) if error.kind() == io::ErrorKind::NotFound => {}
            Err(error) => return Err(io_error(&path, error)),
        }
    }
    Ok(existing.into_iter().collect())
}

/// Whether `path` lies under one of `roots`: inside a directory root, or equal
/// to a file root.
fn root_contains(roots: &[PathBuf], path: &Path) -> bool {
    roots.iter().any(|directory| {
        fs::symlink_metadata(directory)
            .map(|metadata| {
                if metadata.file_type().is_dir() {
                    within(directory, path)
                } else {
                    directory == path
                }
            })
            .unwrap_or(false)
    })
}

fn lexical_normalize(path: &Path) -> PathBuf {
    let mut output = PathBuf::new();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                if !output.pop() {
                    output.push(component.as_os_str());
                }
            }
            _ => output.push(component.as_os_str()),
        }
    }
    output
}

fn resolve(root: &Path, value: impl AsRef<Path>) -> PathBuf {
    let value = value.as_ref();
    let joined;
    let path = if value.is_absolute() {
        value
    } else {
        joined = root.join(value);
        &joined
    };
    lexical_normalize(path)
}

fn local_path(root: &Path, path: &Path) -> Result<String, SourceDiscoveryError> {
    let local = path
        .strip_prefix(root)
        .map_err(|_| SourceDiscoveryError::InvalidRoot(path.to_owned()))?;
    if local.as_os_str().is_empty() {
        return Ok(".".into());
    }
    local
        .components()
        .map(|component| {
            component
                .as_os_str()
                .to_str()
                .map(str::to_owned)
                .ok_or_else(|| SourceDiscoveryError::NonUtf8Path(path.to_owned()))
        })
        .collect::<Result<Vec<_>, _>>()
        .map(|parts| parts.join("/"))
}

fn generated_directory(name: &str) -> bool {
    GENERATED_DIRECTORIES.contains(&name)
}

fn owned_workspace_store(path: &Path) -> bool {
    crate::workspace::owned_workspace_path(path)
}

/// A directory carrying its own `.git` entry is another checkout — a nested
/// clone, a submodule, or an agent worktree such as `.claude/worktrees/*` —
/// not this project's source. Treating its files as ambiguous first-party
/// code turned one real project's report into 1,032 blocking limitations.
fn nested_checkout(path: &Path) -> bool {
    fs::symlink_metadata(path.join(".git")).is_ok()
}

/// A hidden directory at the project root is tool state (.shopify, .vercel,
/// .idea, .claude, ...) by convention, never application source. Nested
/// hidden directories keep their normal treatment so a source tree that
/// happens to contain one is not silently truncated.
/// A hashed bundle (`app-embed-Be-aUw9g.js`) inside an assets/static/public
/// directory is a bundler's output, not source: a theme extension's `assets/`
/// receives its Vite build, and every such bundle was an ambiguous blocker.
fn built_asset(file: &str) -> bool {
    let mut segments = file.rsplit('/');
    let Some(name) = segments.next() else {
        return false;
    };
    let in_asset_directory =
        segments.any(|segment| matches!(segment, "assets" | "static" | "public"));
    let Some(stem) = name
        .strip_suffix(".js")
        .or_else(|| name.strip_suffix(".mjs"))
        .or_else(|| name.strip_suffix(".cjs"))
    else {
        return false;
    };
    // Bundler hashes are eight base64url characters, which may themselves
    // contain '-', so take the suffix by length rather than splitting on it.
    if stem.len() < 10 || stem.as_bytes()[stem.len() - 9] != b'-' {
        return false;
    }
    let hash = &stem[stem.len() - 8..];
    let looks_hashed = hash
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'-')
        && (hash.bytes().any(|byte| byte.is_ascii_digit())
            || (hash.bytes().any(|byte| byte.is_ascii_uppercase())
                && hash.bytes().any(|byte| byte.is_ascii_lowercase())));
    in_asset_directory && looks_hashed
}

fn root_tool_directory(root: &Path, path: &Path) -> bool {
    path.parent() == Some(root)
        && path
            .file_name()
            .and_then(|name| name.to_str())
            .is_some_and(|name| name.starts_with('.'))
}

fn source_file(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    [
        ".js", ".jsx", ".ts", ".tsx", ".cjs", ".cjsx", ".cts", ".ctsx", ".mjs", ".mjsx", ".mts",
        ".mtsx",
    ]
    .iter()
    .any(|extension| lower.ends_with(extension))
}

fn declaration_file(file: &str) -> bool {
    let lower = file.to_ascii_lowercase();
    lower.ends_with(".d.ts") || lower.ends_with(".d.cts") || lower.ends_with(".d.mts")
}

fn test_or_fixture(file: &str) -> bool {
    let lower = file.to_ascii_lowercase();
    if lower
        .split('/')
        .any(|segment| TEST_DIRECTORIES.contains(&segment))
    {
        return true;
    }
    lower
        .split(['/', '_', '.', '-'])
        .any(|part| matches!(part, "test" | "spec"))
}

/// A benchmark: Vitest's `*.bench.ts` beside the code it measures, or a file
/// under a `bench`/`benchmarks` directory. It runs the product; it is not the
/// product. jshttp/cookie keeps four `src/*.bench.ts` files, which were
/// counted as application source and led the list of code no test ran.
fn benchmark(file: &str) -> bool {
    let lower = file.to_ascii_lowercase();
    let (directories, name) = lower.rsplit_once('/').unwrap_or(("", lower.as_str()));
    directories
        .split('/')
        .any(|segment| matches!(segment, "bench" | "benches" | "benchmark" | "benchmarks"))
        || name
            .split('.')
            .skip(1)
            .any(|part| matches!(part, "bench" | "benchmark"))
}

fn tool_script(file: &str) -> bool {
    file.to_ascii_lowercase()
        .split('/')
        .any(|segment| segment == "scripts")
}

fn config_file(file: &str) -> bool {
    let lower = file.to_ascii_lowercase();
    let name = lower.rsplit('/').next().unwrap_or(&lower);
    source_file(name)
        && (CONFIG_TOOLS
            .iter()
            .any(|tool| name.starts_with(&format!("{tool}.config.")))
            || DOT_CONFIG_TOOLS
                .iter()
                .any(|tool| name.starts_with(&format!(".{tool}rc.")))
            || (!lower.contains('/')
                && (name.contains(".config.")
                    || name.starts_with("build.")
                    || name.starts_with("gulpfile.")
                    || name.starts_with("gruntfile."))))
}

fn read_directory(path: &Path) -> Result<Vec<fs::DirEntry>, SourceDiscoveryError> {
    let mut entries = fs::read_dir(path)
        .map_err(|error| io_error(path, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| io_error(path, error))?;
    entries.sort_by_key(fs::DirEntry::file_name);
    Ok(entries)
}

/// Source files under a root, in name order.
///
/// A file the project's own `.gitignore` excludes is not its source: recording
/// Actual counted `packages/loot-core/lib-dist/browser/kcab.worker.dev.js`, a
/// 5 MB bundle its build writes and git ignores, as application code, and
/// instrumented it. Only the project's `.gitignore` files are read, and only
/// inside a git repository; a user's global excludes and `.git/info/exclude`
/// differ between machines, and a run must count the same files on each.
fn files_under(
    root: &Path,
    directory: &Path,
    output: &mut Vec<PathBuf>,
) -> Result<(), SourceDiscoveryError> {
    let metadata = fs::symlink_metadata(directory).map_err(|error| io_error(directory, error))?;
    if !metadata.file_type().is_dir() {
        return Err(SourceDiscoveryError::InvalidRoot(directory.to_owned()));
    }
    let project = root.to_owned();
    let walker = ignore::WalkBuilder::new(directory)
        .standard_filters(false)
        .git_ignore(true)
        .parents(true)
        .require_git(true)
        .follow_links(false)
        .sort_by_file_name(|left, right| left.cmp(right))
        .filter_entry(move |entry| {
            entry.depth() == 0
                || !entry.file_type().is_some_and(|kind| kind.is_dir())
                || entry.file_name().to_str().is_some_and(|name| {
                    !generated_directory(name)
                        && !owned_workspace_store(entry.path())
                        && !nested_checkout(entry.path())
                        && !root_tool_directory(&project, entry.path())
                })
        })
        .build();
    for entry in walker {
        let entry =
            entry.map_err(|error| io_error(directory, io::Error::other(error.to_string())))?;
        let Some(kind) = entry.file_type() else {
            continue;
        };
        if kind.is_symlink() || !kind.is_file() {
            continue;
        }
        let name = entry
            .file_name()
            .to_str()
            .ok_or_else(|| SourceDiscoveryError::NonUtf8Path(entry.path().to_owned()))?;
        if source_file(name) {
            output.push(entry.into_path());
        }
    }
    Ok(())
}

fn read_json(path: &Path) -> Option<Value> {
    serde_json::from_slice(&fs::read(path).ok()?).ok()
}

fn package_directories(root: &Path) -> Result<Vec<PathBuf>, SourceDiscoveryError> {
    fn visit(
        root: &Path,
        directory: &Path,
        depth: usize,
        found: &mut BTreeSet<PathBuf>,
    ) -> Result<(), SourceDiscoveryError> {
        if depth > 5 {
            return Ok(());
        }
        for entry in read_directory(directory)? {
            let name = entry
                .file_name()
                .into_string()
                .map_err(|name| SourceDiscoveryError::NonUtf8Path(directory.join(name)))?;
            let path = entry.path();
            let file_type = entry.file_type().map_err(|error| io_error(&path, error))?;
            if !file_type.is_dir()
                || file_type.is_symlink()
                || generated_directory(&name)
                || owned_workspace_store(&path)
                || nested_checkout(&path)
                || root_tool_directory(root, &path)
            {
                continue;
            }
            let local = local_path(root, &path)?;
            let under_package_parent = local
                .split('/')
                .any(|segment| PACKAGE_PARENTS.contains(&segment));
            if path.join("package.json").is_file() && (depth == 0 || under_package_parent) {
                found.insert(path.clone());
            }
            visit(root, &path, depth + 1, found)?;
        }
        Ok(())
    }

    let mut found = BTreeSet::from([root.to_owned()]);
    visit(root, root, 0, &mut found)?;
    for directory in declared_workspace_packages(root)? {
        found.insert(directory);
    }
    Ok(found.into_iter().collect())
}

/// Packages the project itself declares: `workspaces` in the root
/// package.json (array or `{ "packages": [...] }`) and `packages:` in
/// pnpm-workspace.yaml. The manifest is the most authoritative statement of
/// where packages live, and it routinely names directories outside the
/// conventional parents (a real project keeps its Shopify extensions under
/// `app_extensions/*`; every file there was an ambiguous blocker).
fn declared_workspace_packages(root: &Path) -> Result<Vec<PathBuf>, SourceDiscoveryError> {
    let mut patterns = Vec::new();
    let manifest = read_json(&root.join("package.json")).unwrap_or(Value::Null);
    let declared = match manifest.get("workspaces") {
        Some(Value::Array(items)) => Some(items),
        Some(Value::Object(object)) => object.get("packages").and_then(Value::as_array),
        _ => None,
    };
    if let Some(items) = declared {
        patterns.extend(items.iter().filter_map(Value::as_str).map(str::to_owned));
    }
    if let Ok(pnpm) = fs::read_to_string(root.join("pnpm-workspace.yaml")) {
        let mut in_packages = false;
        for line in pnpm.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with("packages:") {
                in_packages = true;
                continue;
            }
            if in_packages {
                if let Some(item) = trimmed.strip_prefix("- ") {
                    patterns.push(item.trim_matches(|c| c == '"' || c == '\'').to_owned());
                } else if !trimmed.is_empty() && !trimmed.starts_with('#') {
                    in_packages = false;
                }
            }
        }
    }
    let mut found = Vec::new();
    for pattern in patterns {
        let pattern = pattern.trim_start_matches("./").trim_end_matches('/');
        if pattern.starts_with('!') || pattern.contains("**") {
            continue;
        }
        let (parent, wildcard) = match pattern.strip_suffix("/*") {
            Some(parent) => (parent, true),
            None => (pattern, false),
        };
        if parent.is_empty()
            || parent
                .split('/')
                .any(|segment| segment.is_empty() || segment == ".." || segment.contains('*'))
        {
            continue;
        }
        let base = root.join(parent);
        let candidates: Vec<PathBuf> = if wildcard {
            match fs::read_dir(&base) {
                Ok(entries) => entries
                    .filter_map(Result::ok)
                    .map(|entry| entry.path())
                    .collect(),
                Err(_) => Vec::new(),
            }
        } else {
            vec![base]
        };
        for candidate in candidates {
            let is_dir = fs::symlink_metadata(&candidate)
                .is_ok_and(|metadata| metadata.file_type().is_dir());
            if is_dir
                && candidate.join("package.json").is_file()
                && !nested_checkout(&candidate)
                && !owned_workspace_store(&candidate)
            {
                found.push(candidate);
            }
        }
    }
    Ok(found)
}

fn string_targets(value: &Value, depth: usize, output: &mut Vec<String>) {
    if depth > 8 {
        return;
    }
    match value {
        Value::String(value) => output.push(value.clone()),
        Value::Array(values) => {
            for value in values {
                string_targets(value, depth + 1, output);
            }
        }
        Value::Object(values) => {
            for value in values.values() {
                string_targets(value, depth + 1, output);
            }
        }
        _ => {}
    }
}

fn entry_targets(directory: &Path, manifest: &Value) -> Vec<PathBuf> {
    let mut targets = Vec::new();
    for key in ["main", "module", "browser", "bin", "exports"] {
        if let Some(value) = manifest.get(key) {
            string_targets(value, 0, &mut targets);
        }
    }
    targets
        .into_iter()
        .filter_map(|target| {
            if !target.starts_with('.') || target.contains("node_modules") {
                return None;
            }
            let prefix = target.split('*').next()?.trim_end_matches('/');
            (!prefix.is_empty()).then(|| resolve(directory, prefix))
        })
        .collect()
}

pub(crate) fn strip_jsonc_comments(contents: &str) -> String {
    let mut output = String::with_capacity(contents.len());
    let mut chars = contents.chars().peekable();
    let mut string = false;
    let mut escaped = false;
    while let Some(character) = chars.next() {
        if string {
            output.push(character);
            if escaped {
                escaped = false;
            } else if character == '\\' {
                escaped = true;
            } else if character == '"' {
                string = false;
            }
            continue;
        }
        if character == '"' {
            string = true;
            output.push(character);
        } else if character == '/' && chars.peek() == Some(&'/') {
            chars.next();
            for comment in chars.by_ref() {
                if comment == '\n' {
                    output.push('\n');
                    break;
                }
            }
        } else if character == '/' && chars.peek() == Some(&'*') {
            chars.next();
            let mut previous = '\0';
            for comment in chars.by_ref() {
                if previous == '*' && comment == '/' {
                    break;
                }
                previous = comment;
            }
        } else {
            output.push(character);
        }
    }
    output
}

pub(crate) fn strip_trailing_commas(contents: &str) -> String {
    let chars = contents.chars().collect::<Vec<_>>();
    let mut output = String::with_capacity(contents.len());
    let mut string = false;
    let mut escaped = false;
    for (index, character) in chars.iter().copied().enumerate() {
        if string {
            output.push(character);
            if escaped {
                escaped = false;
            } else if character == '\\' {
                escaped = true;
            } else if character == '"' {
                string = false;
            }
            continue;
        }
        if character == '"' {
            string = true;
            output.push(character);
        } else if character == ','
            && chars[index + 1..]
                .iter()
                .find(|character| !character.is_whitespace())
                .is_some_and(|character| matches!(character, '}' | ']'))
        {
        } else {
            output.push(character);
        }
    }
    output
}

fn tsconfig_roots(directory: &Path) -> Vec<PathBuf> {
    let path = directory.join("tsconfig.json");
    let Some(contents) = fs::read_to_string(path).ok() else {
        return Vec::new();
    };
    let jsonc = strip_trailing_commas(&strip_jsonc_comments(&contents));
    let Some(config) = serde_json::from_str::<Value>(&jsonc).ok() else {
        return Vec::new();
    };
    let mut values = Vec::new();
    if let Some(root_dir) = config
        .get("compilerOptions")
        .and_then(|options| options.get("rootDir"))
        .and_then(Value::as_str)
    {
        values.push(root_dir.to_owned());
    }
    if let Some(include) = config.get("include").and_then(Value::as_array) {
        values.extend(include.iter().filter_map(Value::as_str).map(str::to_owned));
    }
    if values.is_empty() {
        return vec![directory.to_owned()];
    }
    values
        .into_iter()
        .filter_map(|value| {
            if value.starts_with('!') {
                return None;
            }
            let prefix = value
                .find(['?', '*', '{', '['])
                .map_or(value.as_str(), |index| &value[..index])
                .trim_end_matches('/');
            (!prefix.is_empty()).then(|| resolve(directory, prefix))
        })
        .collect()
}

fn within(parent: &Path, child: &Path) -> bool {
    child == parent || child.starts_with(parent)
}

fn nearest_package_root<'a>(path: &Path, packages: &'a [PathBuf]) -> Option<&'a PathBuf> {
    packages
        .iter()
        .filter(|directory| within(directory, path))
        .max_by_key(|directory| directory.components().count())
}

fn scope_limitation(file: &str) -> SourceLimitation {
    let digest = Sha256::digest(file.as_bytes());
    let id = digest[..10]
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<String>();
    SourceLimitation {
        id: format!("scope:{id}"),
        kind: "source-scope".into(),
        file: file.into(),
        line: 1,
        column: 1,
        source: file.into(),
        reason: "First-party JavaScript/TypeScript source could not be classified automatically. Configure SUPERCOV_SOURCE_ROOTS or move it under a discovered package source root.".into(),
    }
}

// A declared Jest setup file is test infrastructure even when it lives under
// a source root with an arbitrary name. Instrumenting its mock factories adds
// out-of-scope bindings that Babel's jest-hoist correctly rejects.
fn declared_test_setup(packages: &[PathBuf]) -> BTreeSet<PathBuf> {
    let mut paths = BTreeSet::new();
    for package in packages {
        let manifest = read_json(&package.join("package.json")).unwrap_or(Value::Null);
        let Some(jest) = manifest.get("jest") else {
            continue;
        };
        let root = jest
            .get("rootDir")
            .and_then(Value::as_str)
            .map(|value| {
                resolve(
                    package,
                    value.replace("<rootDir>", &package.to_string_lossy()),
                )
            })
            .unwrap_or_else(|| package.clone());
        for field in [
            "setupFiles",
            "setupFilesAfterEnv",
            "globalSetup",
            "globalTeardown",
        ] {
            let values = match jest.get(field) {
                Some(Value::Array(values)) => values.iter().collect::<Vec<_>>(),
                Some(value) => vec![value],
                None => Vec::new(),
            };
            for value in values.into_iter().filter_map(Value::as_str) {
                let path = resolve(&root, value.replace("<rootDir>", &root.to_string_lossy()));
                if path.is_file() {
                    paths.insert(path);
                }
            }
        }
    }
    paths
}

pub fn discover_source_scope(
    root: &Path,
    configured_roots: Option<&[String]>,
) -> Result<DiscoveredSourceScope, SourceDiscoveryError> {
    let root = lexical_normalize(root);
    let root_metadata = fs::symlink_metadata(&root).map_err(|error| io_error(&root, error))?;
    if !root_metadata.file_type().is_dir() {
        return Err(SourceDiscoveryError::InvalidRoot(root));
    }
    let packages = package_directories(&root)?;
    let test_setup = declared_test_setup(&packages);
    let explicit = configured_roots.is_some_and(|roots| !roots.is_empty());
    let include_roots = if explicit {
        configured_roots
            .unwrap_or_default()
            .iter()
            .map(|directory| resolve(&root, directory))
            .collect::<Vec<_>>()
    } else {
        packages
            .iter()
            .flat_map(|directory| {
                let manifest = read_json(&directory.join("package.json")).unwrap_or(Value::Null);
                let candidates = SOURCE_DIRECTORIES
                    .iter()
                    .map(|name| directory.join(name))
                    .chain(entry_targets(directory, &manifest))
                    .chain(tsconfig_roots(directory))
                    .collect::<Vec<_>>();
                // A declared package that keeps its code somewhere
                // unconventional (a Shopify theme extension's `frontend/` and
                // `blocks/`, say) is still first-party source. Its own
                // directory becomes the root; generated subtrees stay excluded
                // by the walker as everywhere else.
                if directory != &root
                    && !candidates
                        .iter()
                        .any(|candidate| fs::symlink_metadata(candidate).is_ok())
                {
                    return vec![directory.clone()];
                }
                candidates
            })
            .collect()
    };
    let existing_roots = existing_roots(include_roots)?;
    let mut all_files = Vec::new();
    files_under(&root, &root, &mut all_files)?;
    all_files.sort();

    let mut entries = Vec::new();
    let mut included = Vec::new();
    let mut limitations = Vec::new();
    for path in all_files {
        let file = local_path(&root, &path)?;
        let package_root = nearest_package_root(&path, &packages)
            .map(|package| local_path(&root, package))
            .transpose()?
            .filter(|package| package != ".");
        let entry = |status, reason: &str| SourceScopeEntry {
            file: file.clone(),
            status,
            reason: reason.into(),
            package_root: package_root.clone(),
        };
        if declaration_file(&file) {
            entries.push(entry(SourceScopeStatus::Excluded, "TypeScript declaration"));
        } else if test_setup.contains(&path) {
            entries.push(entry(SourceScopeStatus::Excluded, "declared test setup"));
        } else if test_or_fixture(&file) {
            entries.push(entry(SourceScopeStatus::Excluded, "test or fixture source"));
        } else if tool_script(&file) {
            entries.push(entry(
                SourceScopeStatus::Excluded,
                "conventional tool script",
            ));
        } else if benchmark(&file) {
            entries.push(entry(SourceScopeStatus::Excluded, "benchmark"));
        } else if config_file(&file) {
            entries.push(entry(
                SourceScopeStatus::Excluded,
                "build/test/tool configuration",
            ));
        } else if built_asset(&file) {
            entries.push(entry(SourceScopeStatus::Excluded, BUILT_ASSET_REASON));
        } else if root_contains(&existing_roots, &path) {
            included.push(path);
            entries.push(entry(
                SourceScopeStatus::Included,
                if explicit {
                    "explicit source root"
                } else {
                    "discovered package source root"
                },
            ));
        } else if explicit {
            entries.push(entry(
                SourceScopeStatus::Excluded,
                "outside explicit source roots",
            ));
        } else {
            entries.push(entry(
                SourceScopeStatus::Ambiguous,
                "unclassified first-party source",
            ));
            limitations.push(scope_limitation(&file));
        }
    }
    let source_files = included
        .iter()
        .map(|path| local_path(&root, path))
        .collect::<Result<Vec<_>, _>>()?;
    let source_roots = existing_roots
        .iter()
        .map(|path| local_path(&root, path))
        .collect::<Result<Vec<_>, _>>()?;
    Ok(DiscoveredSourceScope {
        source_files,
        source_roots: source_roots.clone(),
        scope: SourceScope {
            version: 1,
            mode: if explicit {
                SourceScopeMode::Explicit
            } else {
                SourceScopeMode::Automatic
            },
            roots: source_roots,
            entries,
        },
        limitations,
    })
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    fn repository(label: &str, files: &[(&str, &str)]) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-source-{label}-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(&root).unwrap();
        for (file, contents) in files {
            let path = root.join(file);
            fs::create_dir_all(path.parent().unwrap()).unwrap();
            fs::write(path, contents).unwrap();
        }
        root
    }

    fn entry<'a>(scope: &'a DiscoveredSourceScope, file: &str) -> &'a SourceScopeEntry {
        scope
            .scope
            .entries
            .iter()
            .find(|entry| entry.file == file)
            .unwrap()
    }

    #[test]
    fn a_file_the_project_tells_git_to_ignore_is_not_its_source() {
        // Actual's build writes a 5 MB worker bundle under
        // packages/loot-core/lib-dist, which its own nested .gitignore names.
        let files = [
            ("package.json", r#"{"workspaces":["packages/*"]}"#),
            ("packages/core/package.json", r#"{"name":"core"}"#),
            ("packages/core/.gitignore", "lib-dist\n"),
            ("packages/core/src/index.ts", "export const a = 1;"),
            (
                "packages/core/lib-dist/browser/worker.dev.js",
                "var bundled = 1;",
            ),
        ];
        let repository_root = repository("gitignored", &files);
        fs::create_dir_all(repository_root.join(".git")).unwrap();
        let discovered = discover_source_scope(&repository_root, None).unwrap();
        assert!(
            discovered
                .source_files
                .contains(&"packages/core/src/index.ts".into())
        );
        assert!(
            !discovered
                .source_files
                .iter()
                .any(|file| file.contains("lib-dist")),
            "{:?}",
            discovered.source_files
        );
        fs::remove_dir_all(repository_root).unwrap();

        // Outside a git repository a .gitignore means nothing.
        let plain = repository("not-a-repository", &files);
        let discovered = discover_source_scope(&plain, None).unwrap();
        assert!(
            discovered
                .scope
                .entries
                .iter()
                .any(|entry| entry.file.contains("lib-dist"))
        );
        fs::remove_dir_all(plain).unwrap();
    }

    #[test]
    fn excludes_declared_jest_setup_without_hiding_neighboring_application_code() {
        let root = repository(
            "jest-setup",
            &[
                (
                    "package.json",
                    r#"{"jest":{"setupFilesAfterEnv":["<rootDir>/src/bootstrap.js"]}}"#,
                ),
                (
                    "src/bootstrap.js",
                    "jest.mock('storage', () => ({read: () => null}));",
                ),
                ("src/index.js", "export const value = 1;"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(discovered.source_files, ["src/index.js"]);
        assert_eq!(
            entry(&discovered, "src/bootstrap.js").reason,
            "declared test setup"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn discovers_conventional_and_workspace_sources_and_blocks_ambiguity() {
        let root = repository(
            "automatic",
            &[
                ("package.json", r#"{"workspaces":["packages/*"]}"#),
                ("src/index.ts", "export const root = true"),
                ("lib/helper.js", "export const helper = true"),
                ("src/index.test.ts", "test('root', () => {})"),
                ("tests/e2e.spec.ts", "test('e2e', () => {})"),
                ("scripts/release.mjs", "export const release = true"),
                ("vite.config.ts", "export default {}"),
                ("build.mjs", "export default async function build() {}"),
                (".eslintrc.cjs", "module.exports = {}"),
                (".graphqlrc.ts", "export default {}"),
                ("orphan.ts", "export const missed = true"),
                ("packages/ui/package.json", r#"{"module":"./src/index.ts"}"#),
                ("packages/ui/src/index.ts", "export const ui = true"),
                ("packages/ui/tests/ui.spec.ts", "test('ui', () => {})"),
                ("dist/generated.js", "generated"),
                (".cache/tool/generated.js", "cached"),
                ("src/parse.bench.ts", "bench('parse', () => {})"),
                (
                    "benchmarks/value-slice.bench.ts",
                    "bench('slice', () => {})",
                ),
                ("src/benchmarkReport.ts", "export const report = 1"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(
            discovered.source_files,
            [
                "lib/helper.js",
                "packages/ui/src/index.ts",
                "src/benchmarkReport.ts",
                "src/index.ts"
            ]
        );
        for file in ["src/parse.bench.ts", "benchmarks/value-slice.bench.ts"] {
            assert_eq!(entry(&discovered, file).reason, "benchmark", "{file}");
        }
        assert_eq!(
            entry(&discovered, "orphan.ts").status,
            SourceScopeStatus::Ambiguous
        );
        assert_eq!(
            entry(&discovered, "scripts/release.mjs").reason,
            "conventional tool script"
        );
        assert_eq!(
            entry(&discovered, "build.mjs").reason,
            "build/test/tool configuration"
        );
        assert_eq!(
            entry(&discovered, "packages/ui/src/index.ts").package_root,
            Some("packages/ui".into())
        );
        assert_eq!(discovered.limitations.len(), 1);
        assert_eq!(discovered.limitations[0].file, "orphan.ts");
        assert_eq!(discovered.limitations[0].id.len(), "scope:".len() + 20);
        assert!(
            discovered
                .scope
                .entries
                .iter()
                .all(|entry| !entry.file.contains(".cache"))
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn declared_workspaces_outside_conventional_parents_are_package_roots() {
        let root = repository(
            "declared-workspaces",
            &[
                ("package.json", r#"{"workspaces":["app_extensions/*"]}"#),
                ("app/main.ts", "product"),
                ("app_extensions/discounts/package.json", "{}"),
                ("app_extensions/discounts/src/index.ts", "extension"),
                // No conventional source directory at all: the package itself
                // is the root, so its frontend code is still first-party.
                ("app_extensions/upsells/package.json", "{}"),
                ("app_extensions/upsells/frontend/embed.ts", "embed"),
                ("app_extensions/upsells/dist/embed.js", "built"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(
            discovered.source_files,
            [
                "app/main.ts",
                "app_extensions/discounts/src/index.ts",
                "app_extensions/upsells/frontend/embed.ts",
            ]
        );
        assert!(
            discovered.limitations.is_empty(),
            "declared packages must not be blockers: {:?}",
            discovered.limitations
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn hashed_bundles_in_asset_directories_are_built_assets() {
        let root = repository(
            "built-assets",
            &[
                ("package.json", r#"{"workspaces":["app_extensions/*"]}"#),
                ("app/main.ts", "product"),
                ("app_extensions/upsells/package.json", "{}"),
                ("app_extensions/upsells/frontend/embed.ts", "source"),
                (
                    "app_extensions/upsells/assets/app-embed-Be-aUw9g.js",
                    "bundle",
                ),
                ("app_extensions/upsells/assets/stylex-DAnmLURx.js", "bundle"),
                // A hand-written helper in assets keeps its ordinary treatment.
                (
                    "app_extensions/upsells/assets/theme-helper.js",
                    "hand written",
                ),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert!(
            !discovered
                .source_files
                .iter()
                .any(|file| file.contains("-Be-aUw9g.js") || file.contains("-DAnmLURx.js"))
        );
        assert_eq!(
            entry(
                &discovered,
                "app_extensions/upsells/assets/app-embed-Be-aUw9g.js"
            )
            .reason,
            "built asset"
        );
        assert!(
            discovered.limitations.is_empty(),
            "bundles are not blockers: {:?}",
            discovered.limitations
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn root_level_hidden_directories_are_tooling_not_source() {
        let root = repository(
            "root-hidden",
            &[
                ("package.json", "{}"),
                ("app/main.ts", "product"),
                (".shopify/bundle/upsells/frontend/embed.js", "cli bundle"),
                (".vercel/output/functions/index.js", "deploy output"),
                // A nested hidden directory inside a source root keeps its
                // ordinary treatment.
                ("app/.generated/schema.ts", "generated types"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(
            discovered.source_files,
            ["app/.generated/schema.ts", "app/main.ts"]
        );
        assert!(
            discovered.limitations.is_empty(),
            "{:?}",
            discovered.limitations
        );
        assert!(discovered.scope.entries.iter().all(
            |entry| !entry.file.starts_with(".shopify/") && !entry.file.starts_with(".vercel/")
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn nested_checkouts_are_neither_source_nor_limitations() {
        let root = repository(
            "nested-checkout",
            &[
                ("package.json", "{}"),
                ("app/main.ts", "product"),
                // An agent worktree: a full copy of the project carrying its own
                // `.git` file. Real project, 1,032 of these turned into blockers.
                (".claude/worktrees/agent-1/.git", "gitdir: /elsewhere"),
                (".claude/worktrees/agent-1/app/main.ts", "copy"),
                ("vendor-fork/.git/HEAD", "ref: refs/heads/main"),
                ("vendor-fork/src/index.ts", "clone"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(discovered.source_files, ["app/main.ts"]);
        assert!(
            discovered.limitations.is_empty(),
            "nested checkouts must not be blocking limitations: {:?}",
            discovered.limitations
        );
        assert!(
            discovered
                .scope
                .entries
                .iter()
                .all(|entry| !entry.file.starts_with(".claude/")
                    && !entry.file.starts_with("vendor-fork/")),
            "nested checkout files must not appear in scope at all"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn roots_enter_a_runs_identity_only_when_named() {
        // Appending nothing when no roots are named is what keeps every
        // fingerprint recorded before this change valid.
        let mut unchanged = b"pytest\0-q".to_vec();
        fold_roots_into_configuration(&mut unchanged, None);
        assert_eq!(unchanged, b"pytest\0-q");
        fold_roots_into_configuration(&mut unchanged, Some(&[]));
        assert_eq!(unchanged, b"pytest\0-q");

        let mut folded = b"pytest\0-q".to_vec();
        fold_roots_into_configuration(&mut folded, Some(&["src".to_owned(), "a.py".to_owned()]));
        assert_eq!(folded, b"pytest\0-q\0SUPERCOV_SOURCE_ROOTS=src,a.py");
    }

    #[test]
    fn the_variable_is_read_the_same_way_for_every_frontend() {
        let read = |value: &str| {
            configured_source_roots(&BTreeMap::from([(
                SOURCE_ROOTS_VARIABLE.to_owned(),
                value.to_owned(),
            )]))
        };
        assert_eq!(
            read(" src , app ,"),
            Some(vec!["src".to_owned(), "app".to_owned()])
        );
        assert_eq!(
            read(" , "),
            None,
            "naming nothing leaves discovery automatic"
        );
        assert_eq!(configured_source_roots(&BTreeMap::new()), None);
    }

    #[test]
    fn explicit_roots_are_authoritative_and_outside_files_are_not_limitations() {
        let root = repository(
            "explicit",
            &[
                ("package.json", "{}"),
                ("product/main.ts", "product"),
                ("orphan.ts", "outside"),
            ],
        );
        let roots = vec!["product".into()];
        let discovered = discover_source_scope(&root, Some(&roots)).unwrap();
        assert_eq!(discovered.source_files, ["product/main.ts"]);
        assert_eq!(discovered.scope.mode, SourceScopeMode::Explicit);
        assert_eq!(
            entry(&discovered, "orphan.ts").reason,
            "outside explicit source roots"
        );
        assert!(discovered.limitations.is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn parses_jsonc_tsconfig_defaults_and_unicode_paths_without_byte_corruption() {
        let root = repository(
            "jsonc",
            &[
                ("package.json", r#"{"main":"./dist/index.js"}"#),
                (
                    "tsconfig.json",
                    "{ // unicode survives: ž\n \"compilerOptions\": {\"target\": \"es2022\",},\n}",
                ),
                ("events.ts", "event"),
                ("žalias.ts", "unicode"),
                ("library.test.ts", "test"),
            ],
        );
        let discovered = discover_source_scope(&root, None).unwrap();
        assert!(discovered.source_roots.contains(&".".into()));
        assert_eq!(discovered.source_files, ["events.ts", "žalias.ts"]);
        assert!(discovered.limitations.is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn never_follows_source_directory_or_explicit_root_symlinks() {
        use std::os::unix::fs::symlink;

        let root = repository(
            "symlink",
            &[("package.json", "{}"), ("src/real.ts", "real")],
        );
        let outside = repository("outside", &[("secret.ts", "secret")]);
        symlink(&outside, root.join("linked")).unwrap();
        symlink(outside.join("secret.ts"), root.join("src/linked.ts")).unwrap();
        let discovered = discover_source_scope(&root, None).unwrap();
        assert_eq!(discovered.source_files, ["src/real.ts"]);
        let explicit = vec!["linked".into()];
        assert!(matches!(
            discover_source_scope(&root, Some(&explicit)),
            Err(SourceDiscoveryError::InvalidRoot(_))
        ));
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(outside).unwrap();
    }

    #[test]
    fn skips_only_marker_owned_workspace_stores_not_user_supercov_directories() {
        let root = repository(
            "workspace-store",
            &[
                ("package.json", "{}"),
                ("src/main.ts", "main"),
                ("supercov/user.ts", "user code"),
            ],
        );
        let before = discover_source_scope(&root, None).unwrap();
        assert_eq!(
            entry(&before, "supercov/user.ts").status,
            SourceScopeStatus::Ambiguous
        );
        fs::write(
            root.join("supercov/.supercov-workspace-store"),
            b"Supercov instrumented workspace. Safe to delete.\n",
        )
        .unwrap();
        let after = discover_source_scope(&root, None).unwrap();
        assert!(
            after
                .scope
                .entries
                .iter()
                .all(|entry| !entry.file.starts_with("supercov/"))
        );
        fs::remove_dir_all(root).unwrap();
    }
}
