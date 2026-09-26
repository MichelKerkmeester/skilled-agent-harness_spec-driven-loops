//! Cargo workspace discovery and isolated owned-Rust frontend preparation.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::{Component, Path, PathBuf},
    process::Command,
};

use ra_ap_syntax::{
    AstNode, AstToken, Edition, SourceFile, SyntaxKind,
    ast::{self, HasAttrs, HasModuleItem, HasName},
};
use serde::Deserialize;
use sha2::{Digest, Sha256};

use crate::{
    coverage_report::CoverageManifest, rust_instrumenter::instrument_rust_source,
    rust_runtime::render_rust_runtime,
};

#[derive(Debug, Clone, PartialEq)]
pub struct PreparedRustProject {
    pub workspace_root: PathBuf,
    pub target_directory: PathBuf,
    pub source_files: Vec<String>,
    pub crate_roots: Vec<String>,
    pub runtime_module: String,
    pub manifest: CoverageManifest,
    pub preparation: RustPreparationTimings,
}

/// Where preparing the instrumented workspace spent its time, for
/// `SUPERCOV_PHASE_TIMING=1`.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct RustPreparationTimings {
    pub metadata_ms: f64,
    pub discovery_ms: f64,
    pub instrument_ms: f64,
    pub runtime_ms: f64,
}

#[derive(Debug)]
pub enum RustProjectError {
    Io { path: PathBuf, reason: String },
    MetadataLaunch(String),
    MetadataFailed(String),
    MetadataJson(String),
    UnsafePath(String),
    NoWorkspacePackages,
    NoSourceFiles,
    Instrument { file: String, reason: String },
    DuplicateObligation(String),
    Runtime(String),
    SourceRoots(String),
}

impl std::fmt::Display for RustProjectError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::MetadataLaunch(reason) => {
                write!(formatter, "could not launch cargo metadata: {reason}")
            }
            Self::MetadataFailed(reason) => write!(formatter, "cargo metadata failed: {reason}"),
            Self::MetadataJson(reason) => write!(formatter, "invalid cargo metadata: {reason}"),
            Self::UnsafePath(path) => {
                write!(formatter, "Cargo reported an unsafe workspace path: {path}")
            }
            Self::NoWorkspacePackages => {
                write!(formatter, "Cargo metadata reported no workspace packages")
            }
            Self::NoSourceFiles => write!(
                formatter,
                "Cargo workspace contains no owned Rust source files"
            ),
            Self::Instrument { file, reason } => {
                write!(formatter, "could not instrument {file}: {reason}")
            }
            Self::DuplicateObligation(id) => {
                write!(formatter, "duplicate Rust obligation ID: {id}")
            }
            Self::Runtime(reason) => write!(formatter, "could not generate Rust runtime: {reason}"),
            Self::SourceRoots(reason) => write!(formatter, "{reason}"),
        }
    }
}

impl std::error::Error for RustProjectError {}

#[derive(Deserialize)]
struct CargoMetadata {
    packages: Vec<CargoPackage>,
    workspace_members: Vec<String>,
    workspace_root: PathBuf,
    target_directory: PathBuf,
}

#[derive(Deserialize)]
struct CargoPackage {
    id: String,
    manifest_path: PathBuf,
    targets: Vec<CargoTarget>,
}

#[derive(Deserialize)]
struct CargoTarget {
    kind: Vec<String>,
    src_path: PathBuf,
}

fn canonical_directory(path: &Path) -> Result<PathBuf, RustProjectError> {
    fs::canonicalize(path).map_err(|error| RustProjectError::Io {
        path: path.to_owned(),
        reason: error.to_string(),
    })
}

fn confined_relative(root: &Path, path: &Path) -> Result<String, RustProjectError> {
    let relative = path
        .strip_prefix(root)
        .map_err(|_| RustProjectError::UnsafePath(path.display().to_string()))?;
    if relative.as_os_str().is_empty()
        || relative
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(RustProjectError::UnsafePath(path.display().to_string()));
    }
    Ok(relative.to_string_lossy().replace('\\', "/"))
}

fn cargo_metadata(root: &Path) -> Result<CargoMetadata, RustProjectError> {
    let target_directory = root.join(".supercov/rust-target");
    let output = Command::new("cargo")
        .args(["metadata", "--format-version=1", "--no-deps"])
        .current_dir(root)
        .env("CARGO_TARGET_DIR", &target_directory)
        .output()
        .map_err(|error| RustProjectError::MetadataLaunch(error.to_string()))?;
    if !output.status.success() {
        return Err(RustProjectError::MetadataFailed(
            String::from_utf8_lossy(&output.stderr).trim().to_owned(),
        ));
    }
    serde_json::from_slice(&output.stdout)
        .map_err(|error| RustProjectError::MetadataJson(error.to_string()))
}

/// The workspace sources the build actually read, from the depinfo rustc
/// writes beside every artifact (`<artifact>.d`: a make rule whose
/// prerequisites are every file that went into it). `None` when no depinfo
/// could be read, which means "do not prune".
///
/// Source discovery follows `mod` declarations because that is what rustc
/// RESOLVES; this is what it COMPILES. A module behind a `#[cfg]` that is off
/// is resolved and never built, and its obligations can never be covered --
/// smallvec's `serde`, `borsh`, `rayon` and `specialization` modules are 142
/// such lines. Reading the build is exact for every `cfg` predicate, where
/// evaluating them here would have to reproduce Cargo's feature resolution.
pub fn compiled_source_files(
    workspace: &Path,
    target_directory: &Path,
) -> Option<BTreeSet<String>> {
    let mut compiled = BTreeSet::new();
    let mut depinfo_files = 0;
    let mut directories = vec![target_directory.to_path_buf()];
    while let Some(directory) = directories.pop() {
        let Ok(entries) = fs::read_dir(&directory) else {
            continue;
        };
        for entry in entries.flatten() {
            let path = entry.path();
            match entry.file_type() {
                Ok(file_type) if file_type.is_dir() => directories.push(path),
                Ok(file_type) if file_type.is_file() => {
                    if path.extension().is_some_and(|extension| extension == "d")
                        && let Ok(text) = fs::read_to_string(&path)
                    {
                        depinfo_files += 1;
                        collect_depinfo_sources(&text, workspace, &mut compiled);
                    }
                }
                _ => {}
            }
        }
    }
    (depinfo_files > 0).then_some(compiled)
}

/// The prerequisites of every rule in a depinfo file, as workspace-relative
/// paths. A rule is `target: prerequisite prerequisite`, and a space inside a
/// path is escaped as `\ `.
fn collect_depinfo_sources(text: &str, workspace: &Path, compiled: &mut BTreeSet<String>) {
    for line in text.lines() {
        // A prerequisite-only line (`path:` with nothing after it) carries no
        // sources, and a target's own path is not a source.
        let Some((_, prerequisites)) = line.split_once(": ") else {
            continue;
        };
        let mut current = String::new();
        let mut characters = prerequisites.chars().peekable();
        while let Some(character) = characters.next() {
            match character {
                '\\' if characters.peek() == Some(&' ') => {
                    characters.next();
                    current.push(' ');
                }
                ' ' => {
                    push_workspace_source(&current, workspace, compiled);
                    current.clear();
                }
                _ => current.push(character),
            }
        }
        push_workspace_source(&current, workspace, compiled);
    }
}

fn push_workspace_source(path: &str, workspace: &Path, compiled: &mut BTreeSet<String>) {
    let path = path.trim();
    if path.is_empty() || !path.ends_with(".rs") {
        return;
    }
    // Cargo runs rustc with the workspace as its working directory, so a
    // source of the crate being built is named relatively and a dependency's
    // source -- from the registry -- absolutely.
    let candidate = Path::new(path);
    let relative = if candidate.is_absolute() {
        let Ok(relative) = candidate.strip_prefix(workspace) else {
            return;
        };
        relative
    } else {
        candidate
    };
    if let Some(text) = relative.to_str() {
        compiled.insert(text.replace('\\', "/"));
    }
}

/// The files rustc compiles for the given crate roots: each root and,
/// transitively, every module it declares with `mod name;` (resolved the way
/// rustc resolves it, `#[path]` included) and every file it pulls in with a
/// literal `include!("....rs")`. A `.rs` file under the package that no module
/// reaches -- a runtime source embedded as data with `include_str!`, a test
/// fixture, a snippet -- is not part of any crate, so instrumenting it would
/// change the data and count code that is never compiled.
///
/// A file that does not exist is skipped, not an error: a `#[cfg]`-gated
/// module may name a file the checkout lacks, and rustc only complains when
/// that cfg is active. Files outside the workspace are left alone as well.
fn resolve_module_tree(
    workspace: &Path,
    roots: &BTreeSet<PathBuf>,
    files: &mut BTreeSet<PathBuf>,
) -> Result<(), RustProjectError> {
    let canonical_workspace = canonical_directory(workspace)?;
    // (file, directory its `mod` children resolve in)
    let mut pending = roots
        .iter()
        .map(|root| (root.clone(), owner_directory(root)))
        .collect::<Vec<_>>();
    while let Some((file, directory)) = pending.pop() {
        // `#[path = "../src/shared.rs"]` climbs out of its directory; the
        // path is normalised lexically so the workspace check and the file
        // set see one spelling of it.
        let file = normalize(&file);
        let directory = normalize(&directory);
        if !file.starts_with(workspace) {
            continue;
        }
        let Ok(metadata) = fs::symlink_metadata(&file) else {
            continue;
        };
        // A symlink is followed only within the workspace: crossbeam shares
        // one source file between its crates that way. The file is recorded
        // under its target's path, so it is instrumented and digested once as
        // a regular file; a symlink leaving the workspace would be
        // instrumented in place, outside the copy, and is refused.
        let file = if metadata.file_type().is_symlink() {
            let target = fs::canonicalize(&file).map_err(|error| RustProjectError::Io {
                path: file.clone(),
                reason: error.to_string(),
            })?;
            if !target.starts_with(&canonical_workspace) || !target.is_file() {
                return Err(RustProjectError::UnsafePath(file.display().to_string()));
            }
            target
        } else if metadata.is_file() {
            file.clone()
        } else {
            continue;
        };
        if !files.insert(file.clone()) {
            continue;
        }
        let source = fs::read_to_string(&file).map_err(|error| RustProjectError::Io {
            path: file.clone(),
            reason: error.to_string(),
        })?;
        let parsed = SourceFile::parse(&source, Edition::CURRENT).tree();
        collect_module_declarations(parsed.items(), &file, &directory, false, &mut pending);
    }
    Ok(())
}

/// Resolve `.` and `..` components without touching the filesystem.
fn normalize(path: &Path) -> PathBuf {
    let mut normalized = PathBuf::new();
    for component in path.components() {
        match component {
            Component::ParentDir => {
                normalized.pop();
            }
            Component::CurDir => {}
            other => normalized.push(other.as_os_str()),
        }
    }
    normalized
}

fn owner_directory(file: &Path) -> PathBuf {
    file.parent().map_or_else(PathBuf::new, Path::to_path_buf)
}

/// Walk the items of one module body. `directory` is where this module's
/// `mod name;` children live; `inline` says whether we are inside a
/// `mod name { ... }` block, which changes what `#[path]` is relative to.
fn collect_module_declarations(
    items: impl Iterator<Item = ast::Item>,
    file: &Path,
    directory: &Path,
    inline: bool,
    pending: &mut Vec<(PathBuf, PathBuf)>,
) {
    for item in items {
        match item {
            ast::Item::Module(module) => {
                let Some(name) = module.name() else {
                    continue;
                };
                let name = name.text().to_string();
                let path_attribute = module.attrs().find_map(|attr| {
                    let is_path = attr
                        .path()
                        .is_some_and(|path| path.syntax().text() == "path");
                    is_path.then(|| string_literal(attr.syntax())).flatten()
                });
                if let Some(list) = module.item_list() {
                    let nested = directory.join(&name);
                    collect_module_declarations(list.items(), file, &nested, true, pending);
                } else if let Some(path) = path_attribute {
                    // Relative to the file's own directory at the top level,
                    // to the inline module's directory inside a block; the
                    // loaded file owns its directory like a `mod.rs` does.
                    let base = if inline {
                        directory.to_path_buf()
                    } else {
                        owner_directory(file)
                    };
                    let target = base.join(path);
                    let owner = owner_directory(&target);
                    pending.push((target, owner));
                } else {
                    // `name.rs` and `name/mod.rs` both put their children in
                    // `directory/name/`.
                    let children = directory.join(&name);
                    pending.push((directory.join(format!("{name}.rs")), children.clone()));
                    pending.push((children.join("mod.rs"), children));
                }
            }
            ast::Item::MacroCall(call) => {
                let is_include = call.path().is_some_and(|path| {
                    matches!(
                        path.syntax().text().to_string().as_str(),
                        "include" | "std::include" | "core::include" | "::std::include"
                    )
                });
                if !is_include {
                    // A macro that selects among implementations declares its
                    // modules in its token tree, where no item walk reaches
                    // them: hashbrown's `cfg_select!` and the `cfg_if!` in
                    // crates everywhere. Both arms are followed; the build
                    // decides which one counts.
                    for name in token_tree_modules(call.syntax()) {
                        let children = directory.join(&name);
                        pending.push((directory.join(format!("{name}.rs")), children.clone()));
                        pending.push((children.join("mod.rs"), children));
                    }
                    continue;
                }
                let Some(literal) = string_literal(call.syntax()) else {
                    continue;
                };
                if !literal.ends_with(".rs") {
                    continue;
                }
                // Included code is spliced into this module: its own `mod`
                // declarations resolve where this module's do.
                pending.push((owner_directory(file).join(literal), directory.to_path_buf()));
            }
            _ => {}
        }
    }
}

/// Every `mod <name>;` declared inside a macro's token tree. The tokens are
/// unparsed there, so the sequence is matched directly.
fn token_tree_modules(node: &ra_ap_syntax::SyntaxNode) -> Vec<String> {
    let mut names = Vec::new();
    let mut tokens = node
        .descendants_with_tokens()
        .filter_map(|element| element.into_token())
        .filter(|token| !token.kind().is_trivia())
        .peekable();
    while let Some(token) = tokens.next() {
        if token.text() != "mod" {
            continue;
        }
        let Some(name) = tokens
            .peek()
            .filter(|next| next.kind() == SyntaxKind::IDENT)
        else {
            continue;
        };
        let name = name.text().to_string();
        tokens.next();
        // `mod name;` declares a file; `mod name { .. }` is inline and its
        // items are already in this tree.
        if tokens
            .peek()
            .is_some_and(|next| next.kind() == SyntaxKind::SEMICOLON)
        {
            tokens.next();
            names.push(name);
        }
    }
    names
}

/// The first string literal under a node, unescaped. Inside a macro's token
/// tree the literal is a bare token, not a `Literal` node, so look at tokens.
fn string_literal(node: &ra_ap_syntax::SyntaxNode) -> Option<String> {
    node.descendants_with_tokens().find_map(|element| {
        let string = ast::String::cast(element.into_token()?)?;
        string.value().ok().map(|value| value.into_owned())
    })
}

/// The crate roots of every workspace member: the source file of each Cargo
/// target except build scripts, which Cargo compiles and runs on their own.
/// The crate roots of proc-macro targets. What they compile to is a compiler
/// plugin: rustc loads it while building the crate under test and runs it
/// there, so no test process ever executes it and the owned probes see
/// nothing.
fn proc_macro_crate_roots(
    workspace: &Path,
    packages: &[CargoPackage],
) -> Result<BTreeSet<PathBuf>, RustProjectError> {
    let mut roots = BTreeSet::new();
    for package in packages {
        for target in &package.targets {
            if !target.kind.iter().any(|kind| kind == "proc-macro") {
                continue;
            }
            let root =
                fs::canonicalize(&target.src_path).map_err(|error| RustProjectError::Io {
                    path: target.src_path.clone(),
                    reason: error.to_string(),
                })?;
            if confined_relative(workspace, &root).is_ok() {
                roots.insert(root);
            }
        }
    }
    Ok(roots)
}

fn crate_roots(
    workspace: &Path,
    packages: &[CargoPackage],
) -> Result<BTreeSet<PathBuf>, RustProjectError> {
    let mut roots = BTreeSet::new();
    for package in packages {
        let directory = package.manifest_path.parent().ok_or_else(|| {
            RustProjectError::UnsafePath(package.manifest_path.display().to_string())
        })?;
        let directory = canonical_directory(directory)?;
        confined_relative(workspace, &directory).or_else(|error| {
            (directory == workspace)
                .then_some(String::new())
                .ok_or(error)
        })?;
        for target in &package.targets {
            if target.kind.iter().any(|kind| kind == "custom-build") {
                continue;
            }
            let root =
                fs::canonicalize(&target.src_path).map_err(|error| RustProjectError::Io {
                    path: target.src_path.clone(),
                    reason: error.to_string(),
                })?;
            confined_relative(workspace, &root)?;
            roots.insert(root);
        }
    }
    Ok(roots)
}

/// Read-only Cargo workspace source discovery used by integrity checks. This
/// deliberately shares the same path policy as transformation preparation.
pub fn discover_rust_source_files(workspace: &Path) -> Result<Vec<String>, RustProjectError> {
    let workspace = canonical_directory(workspace)?;
    let metadata = cargo_metadata(&workspace)?;
    let metadata_root = canonical_directory(&metadata.workspace_root)?;
    if metadata_root != workspace {
        return Err(RustProjectError::UnsafePath(
            metadata.workspace_root.display().to_string(),
        ));
    }
    let members = metadata
        .workspace_members
        .into_iter()
        .collect::<BTreeSet<_>>();
    let packages = metadata
        .packages
        .into_iter()
        .filter(|package| members.contains(&package.id))
        .collect::<Vec<_>>();
    if packages.is_empty() {
        return Err(RustProjectError::NoWorkspacePackages);
    }
    let mut files = BTreeSet::new();
    resolve_module_tree(&workspace, &crate_roots(&workspace, &packages)?, &mut files)?;
    if files.is_empty() {
        return Err(RustProjectError::NoSourceFiles);
    }
    files
        .into_iter()
        .map(|path| confined_relative(&workspace, &path))
        .collect()
}

fn runtime_module_name(sources: &BTreeMap<String, String>) -> String {
    let mut suffix = 0_usize;
    loop {
        let candidate = if suffix == 0 {
            "__supercov_runtime_v1".to_owned()
        } else {
            format!("__supercov_runtime_v1_{suffix}")
        };
        if sources.values().all(|source| !source.contains(&candidate)) {
            return candidate;
        }
        suffix += 1;
    }
}

/// Twelve hex digits identifying an instrumentation: a digest of every
/// obligation ID in the manifest. Two builds of the same sources share it;
/// any other program's instrumentation, such as a fixture a test prepares
/// and runs, has another.
/// Obligations in a proc-macro crate leave the denominator: the compiler runs
/// that code while it builds the crate under test, so a test process cannot
/// observe it. They stay in the manifest -- the evidence files are named by a
/// token over its obligation IDs -- and are declined, with one limitation per
/// file saying why.
fn decline_proc_macro_obligations(
    workspace: &Path,
    proc_macro_roots: &BTreeSet<PathBuf>,
    manifest: &mut CoverageManifest,
) -> Result<(), RustProjectError> {
    if proc_macro_roots.is_empty() {
        return Ok(());
    }
    let mut reached = BTreeSet::new();
    resolve_module_tree(workspace, proc_macro_roots, &mut reached)?;
    let mut files = BTreeSet::new();
    for path in reached {
        if let Ok(relative) = confined_relative(workspace, &path) {
            files.insert(relative);
        }
    }
    if files.is_empty() {
        return Ok(());
    }
    let mut unmeasured = manifest.unmeasured.iter().cloned().collect::<BTreeSet<_>>();
    unmeasured.extend(
        manifest
            .points
            .iter()
            .filter(|point| files.contains(&point.file))
            .map(|point| point.id.clone()),
    );
    unmeasured.extend(
        manifest
            .decisions
            .iter()
            .filter(|decision| files.contains(&decision.file))
            .map(|decision| decision.id.clone()),
    );
    unmeasured.extend(
        manifest
            .branches
            .iter()
            .filter(|branch| files.contains(&branch.file))
            .map(|branch| branch.id.clone()),
    );
    manifest.unmeasured = unmeasured.into_iter().collect();
    // The boundaries already declared inside these files say nothing now.
    manifest.limitations.retain(|limitation| {
        limitation
            .get("file")
            .and_then(|file| file.as_str())
            .is_none_or(|file| !files.contains(file))
    });
    for file in files {
        manifest.limitations.push(serde_json::json!({
            "id": format!("rust-proc-macro-runs-in-the-compiler#{file}"),
            "kind": "source-scope",
            "file": file,
            "line": 1,
            "column": 0,
            "source": "",
            "blocking": false,
            "reason": "This crate compiles to a compiler plugin: rustc loads it and runs it while building the crate under test, so no test process executes it"
        }));
    }
    Ok(())
}

pub fn manifest_token(manifest: &CoverageManifest) -> String {
    let mut ids = manifest
        .points
        .iter()
        .map(|point| point.id.as_str())
        .chain(
            manifest
                .decisions
                .iter()
                .map(|decision| decision.id.as_str()),
        )
        .chain(manifest.branches.iter().flat_map(|branch| {
            branch
                .alternatives
                .iter()
                .map(|alternative| alternative.id.as_str())
        }))
        .collect::<Vec<_>>();
    ids.sort_unstable();
    ids.dedup();
    let mut hasher = Sha256::new();
    for id in ids {
        hasher.update(id.as_bytes());
        hasher.update(b"\n");
    }
    hex(&hasher.finalize()[..6])
}

/// The runtime names its evidence files `<crate key>-<pid>.events`; the key
/// is the manifest token followed by a digest of the crate root, so the
/// reader can tell this instrumentation's files from any other's and two
/// crates of one process write separate files.
fn crate_key(token: &str, path: &str) -> String {
    format!("{token}{}", hex(&Sha256::digest(path.as_bytes())[..6]))
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn merge_manifest(
    destination: &mut CoverageManifest,
    mut source: CoverageManifest,
) -> Result<(), RustProjectError> {
    let mut ids = destination
        .points
        .iter()
        .map(|point| point.id.as_str())
        .chain(
            destination
                .decisions
                .iter()
                .map(|decision| decision.id.as_str()),
        )
        .chain(destination.branches.iter().map(|branch| branch.id.as_str()))
        .collect::<BTreeSet<_>>();
    for id in source
        .points
        .iter()
        .map(|point| point.id.as_str())
        .chain(source.decisions.iter().map(|decision| decision.id.as_str()))
        .chain(source.branches.iter().map(|branch| branch.id.as_str()))
    {
        if !ids.insert(id) {
            return Err(RustProjectError::DuplicateObligation(id.into()));
        }
    }
    destination.points.append(&mut source.points);
    destination.decisions.append(&mut source.decisions);
    destination.branches.append(&mut source.branches);
    // Obligations the file declined -- a `const fn` body, a `GlobalAlloc`
    // implementation -- are declined for the project too.
    destination.unmeasured.append(&mut source.unmeasured);
    // A limitation is one site in one file. Deduping on the id alone kept a
    // single macro-expansion limitation for the whole project, charged to
    // whichever file merged first.
    let site = |value: &serde_json::Value| {
        (
            value
                .get("id")
                .and_then(|id| id.as_str())
                .map(str::to_owned),
            value
                .get("file")
                .and_then(|file| file.as_str())
                .map(str::to_owned),
            value.get("line").and_then(serde_json::Value::as_u64),
            value.get("column").and_then(serde_json::Value::as_u64),
        )
    };
    for limitation in source.limitations {
        let key = site(&limitation);
        if !destination
            .limitations
            .iter()
            .any(|existing| site(existing) == key)
        {
            destination.limitations.push(limitation);
        }
    }
    Ok(())
}

pub fn prepare_rust_project(
    workspace: &Path,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<PreparedRustProject, RustProjectError> {
    // Named apart from the crate roots below, which reuse `roots`.
    let source_roots = roots;
    let elapsed = |started: std::time::Instant| started.elapsed().as_secs_f64() * 1000.0;
    let mut preparation = RustPreparationTimings::default();
    let workspace = canonical_directory(workspace)?;
    let started = std::time::Instant::now();
    let metadata = cargo_metadata(&workspace)?;
    preparation.metadata_ms = elapsed(started);
    let metadata_root = canonical_directory(&metadata.workspace_root)?;
    if metadata_root != workspace {
        return Err(RustProjectError::UnsafePath(
            metadata.workspace_root.display().to_string(),
        ));
    }
    let members = metadata
        .workspace_members
        .into_iter()
        .collect::<BTreeSet<_>>();
    let packages = metadata
        .packages
        .into_iter()
        .filter(|package| members.contains(&package.id))
        .collect::<Vec<_>>();
    if packages.is_empty() {
        return Err(RustProjectError::NoWorkspacePackages);
    }

    let started = std::time::Instant::now();
    let roots = crate_roots(&workspace, &packages)?;
    let proc_macro_roots = proc_macro_crate_roots(&workspace, &packages)?;
    let mut files = BTreeSet::new();
    resolve_module_tree(&workspace, &roots, &mut files)?;
    if files.is_empty() {
        return Err(RustProjectError::NoSourceFiles);
    }

    let mut sources = BTreeMap::new();
    for path in files {
        let relative = confined_relative(&workspace, &path)?;
        let source = fs::read_to_string(&path).map_err(|error| RustProjectError::Io {
            path: path.clone(),
            reason: error.to_string(),
        })?;
        sources.insert(relative, source);
    }
    preparation.discovery_ms = elapsed(started);
    let started = std::time::Instant::now();
    let runtime_module = runtime_module_name(&sources);
    // Narrowed only after the runtime's name is chosen: that name must not
    // collide with any module in the crate, including those the roots leave
    // out. A module left out is simply not instrumented, and compiles as the
    // author wrote it.
    let mut outside = Vec::new();
    if let Some(source_roots) = source_roots {
        let mut kept = sources.keys().cloned().collect::<Vec<_>>();
        source_roots.narrow(&mut kept, &mut outside, String::as_str);
        let kept = kept.into_iter().collect::<BTreeSet<_>>();
        sources.retain(|relative, _| kept.contains(relative));
        source_roots
            .refuse_if_empty(sources.len(), "Rust")
            .map_err(RustProjectError::SourceRoots)?;
    }
    let runtime_path = format!("crate::{runtime_module}");
    let mut manifest = CoverageManifest {
        unmeasured: Vec::new(),
        decisions: Vec::new(),
        points: Vec::new(),
        branches: Vec::new(),
        limitations: Vec::new(),
        scope: None,
    };
    for (relative, source) in &sources {
        let transformed =
            instrument_rust_source(relative, source, &runtime_path).map_err(|error| {
                RustProjectError::Instrument {
                    file: relative.clone(),
                    reason: error.to_string(),
                }
            })?;
        merge_manifest(&mut manifest, transformed.manifest)?;
        fs::write(workspace.join(relative), transformed.code).map_err(|error| {
            RustProjectError::Io {
                path: workspace.join(relative),
                reason: error.to_string(),
            }
        })?;
    }

    preparation.instrument_ms = elapsed(started);
    let started = std::time::Instant::now();
    decline_proc_macro_obligations(&workspace, &proc_macro_roots, &mut manifest)?;

    let token = manifest_token(&manifest);
    let mut crate_roots = Vec::new();
    for root in roots {
        let relative = confined_relative(&workspace, &root)?;
        let runtime = render_rust_runtime(&runtime_module, &crate_key(&token, &relative))
            .map_err(RustProjectError::Runtime)?;
        let mut source = fs::read_to_string(&root).map_err(|error| RustProjectError::Io {
            path: root.clone(),
            reason: error.to_string(),
        })?;
        source.push('\n');
        source.push_str(&runtime);
        fs::write(&root, source).map_err(|error| RustProjectError::Io {
            path: root,
            reason: error.to_string(),
        })?;
        crate_roots.push(relative);
    }
    preparation.runtime_ms = elapsed(started);

    manifest
        .points
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest
        .decisions
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest
        .branches
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest.limitations.sort_by(|left, right| {
        left.get("id")
            .and_then(|value| value.as_str())
            .cmp(&right.get("id").and_then(|value| value.as_str()))
    });
    let target_directory = metadata.target_directory;
    let target_directory = if target_directory.is_absolute() {
        target_directory
    } else {
        workspace.join(target_directory)
    };
    if !target_directory.starts_with(&workspace) {
        return Err(RustProjectError::UnsafePath(
            target_directory.display().to_string(),
        ));
    }
    // Only when roots shaped what is measured, so default output is unchanged.
    if let Some(source_roots) = source_roots {
        let kept = sources.keys().cloned().collect::<Vec<_>>();
        let scope = source_roots
            .scope(&kept, &outside)
            .map_err(|error| RustProjectError::SourceRoots(error.to_string()))?;
        manifest.scope = Some(
            serde_json::to_value(scope)
                .map_err(|error| RustProjectError::SourceRoots(error.to_string()))?,
        );
    }
    Ok(PreparedRustProject {
        workspace_root: workspace,
        target_directory,
        source_files: sources.into_keys().collect(),
        crate_roots,
        runtime_module,
        manifest,
        preparation,
    })
}

#[cfg(test)]
mod tests {
    use std::{
        process::Command,
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    fn fixture() -> PathBuf {
        // One test calls this today, so nothing can collide with it yet. The
        // counter is here because the clock is not enough on its own: it ticks
        // once per microsecond and every test shares the pid, so the second
        // test to use this helper would draw the same root as the first when
        // the two start together.
        static UNIQUE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-project-{}-{nonce}-{}",
            std::process::id(),
            UNIQUE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&root).unwrap();
        fs::create_dir(root.join("src")).unwrap();
        fs::create_dir(root.join("tests")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='rust-project-fixture'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            r#"pub fn choose(first: bool, second: bool) -> i32 {
    if first && second { 7 } else { 3 }
}

#[cfg(test)]
mod tests {
    #[test]
    fn unit_choice() {
        assert_eq!(super::choose(true, true), 7);
    }
}
"#,
        )
        .unwrap();
        fs::write(
            root.join("tests/integration.rs"),
            r#"#[test]
fn integration_choice() {
    assert_eq!(rust_project_fixture::choose(false, true), 3);
}
"#,
        )
        .unwrap();
        root
    }

    #[test]
    fn explicit_roots_narrow_what_rust_instruments() {
        // A module the roots leave out is not instrumented, so it compiles as
        // the author wrote it. The runtime module is still declared in the
        // crate root whether or not that root is kept, which is what lets the
        // modules that are kept refer to it.
        let root = fixture();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='rust_project_fixture'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            "mod helper;\nmod vendored;\npub fn entry(flag: bool) -> i32 { if flag { helper::one() } else { vendored::two() } }\n",
        )
        .unwrap();
        fs::write(root.join("src/helper.rs"), "pub fn one() -> i32 { 1 }\n").unwrap();
        let vendored = "pub fn two() -> i32 { 2 }\n";
        fs::write(root.join("src/vendored.rs"), vendored).unwrap();

        let roots = crate::source_discovery::ExplicitSourceRoots::resolve(
            &root,
            &["src/lib.rs".to_owned(), "src/helper.rs".to_owned()],
        )
        .unwrap();
        let prepared = prepare_rust_project(&root, Some(&roots)).unwrap();
        assert_eq!(prepared.source_files, ["src/helper.rs", "src/lib.rs"]);
        assert!(
            prepared
                .manifest
                .points
                .iter()
                .all(|point| point.file != "src/vendored.rs"),
            "a module outside the roots carries no obligations"
        );
        assert_eq!(
            fs::read_to_string(root.join("src/vendored.rs")).unwrap(),
            vendored,
            "and is left exactly as written"
        );
        let scope: crate::source_discovery::SourceScope =
            serde_json::from_value(prepared.manifest.scope.clone().expect("a scope")).unwrap();
        assert_eq!(
            scope.mode,
            crate::source_discovery::SourceScopeMode::Explicit
        );
        assert!(
            scope
                .entries
                .iter()
                .any(|entry| entry.file == "src/vendored.rs"
                    && entry.reason == "outside explicit source roots"),
            "{scope:?}"
        );
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn a_proc_macro_crates_own_code_is_declined() {
        // async-trait, serde_derive and thiserror-impl compile to compiler
        // plugins: rustc loads them while building the crate under test and
        // runs them there, so no test process executes a line of them and
        // every file read 0%.
        let root = fixture();
        fs::write(
            root.join("Cargo.toml"),
            concat!(
                "[package]\nname='rust_project_fixture'\nversion='0.0.0'\nedition='2024'\n",
                "\n[lib]\nproc-macro=true\n",
            ),
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            "mod helper;\npub fn entry(flag: bool) -> i32 { if flag { helper::one() } else { 0 } }\n",
        )
        .unwrap();
        fs::write(root.join("src/helper.rs"), "pub fn one() -> i32 { 1 }\n").unwrap();

        let prepared = prepare_rust_project(&root, None).unwrap();
        // The files are still instrumented and still in the manifest; their
        // obligations are declined, and a limitation says why.
        let declined = prepared.manifest.unmeasured.iter().collect::<BTreeSet<_>>();
        assert!(!declined.is_empty());
        for point in &prepared.manifest.points {
            let plugin = point.file == "src/lib.rs" || point.file == "src/helper.rs";
            assert_eq!(declined.contains(&point.id), plugin, "{}", point.file);
        }
        let reasons = prepared
            .manifest
            .limitations
            .iter()
            .filter_map(|limitation| limitation.get("id")?.as_str())
            .filter(|id| id.starts_with("rust-proc-macro-runs-in-the-compiler#"))
            .collect::<BTreeSet<_>>();
        assert_eq!(
            reasons,
            BTreeSet::from([
                "rust-proc-macro-runs-in-the-compiler#src/helper.rs",
                "rust-proc-macro-runs-in-the-compiler#src/lib.rs",
            ])
        );
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn modules_declared_inside_a_macro_are_instrumented() {
        // hashbrown selects its SIMD group with `cfg_select! { ... mod neon;
        // ... }`, and `cfg_if!` has the same shape; the declaration lives in
        // the macro's token tree, which no item walk reaches. Both arms are
        // followed -- the build decides which one is in the denominator.
        let root = fixture();
        fs::write(
            root.join("src/lib.rs"),
            concat!(
                "macro_rules! select { ($($rest:tt)*) => { $($rest)* } }\n",
                "select! {\n",
                "    #[cfg(target_endian = \"little\")]\n",
                "    mod little;\n",
                "    #[cfg(not(target_endian = \"little\"))]\n",
                "    mod big;\n",
                "    mod inline { pub fn here() -> i32 { 1 } }\n",
                "}\n",
                "pub fn value() -> i32 { inline::here() }\n",
            ),
        )
        .unwrap();
        fs::write(root.join("src/little.rs"), "pub fn v() -> i32 { 1 }\n").unwrap();
        fs::write(root.join("src/big.rs"), "pub fn v() -> i32 { 2 }\n").unwrap();

        let prepared = prepare_rust_project(&root, None).unwrap();
        // Both arms, and never the inline module, which has no file.
        assert_eq!(
            prepared.source_files,
            [
                "src/big.rs",
                "src/lib.rs",
                "src/little.rs",
                "tests/integration.rs"
            ],
            "{:?}",
            prepared.source_files
        );
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn only_files_the_module_tree_reaches_are_instrumented() {
        let root = fixture();
        fs::create_dir_all(root.join("src/nested")).unwrap();
        fs::create_dir_all(root.join("src/deep/inner")).unwrap();
        fs::create_dir_all(root.join("runtime-assets")).unwrap();
        fs::write(
            root.join("src/lib.rs"),
            concat!(
                "mod util;\n",
                "mod nested;\n",
                "#[path = \"renamed_file.rs\"]\n",
                "mod renamed;\n",
                "mod deep;\n",
                "include!(\"included.rs\");\n",
                "pub const EMBEDDED: &str = include_str!(\"../runtime-assets/embedded.rs\");\n",
                "pub fn choose(first: bool, second: bool) -> i32 {\n",
                "    if first && second { util::seven() } else { nested::three() }\n",
                "}\n",
            ),
        )
        .unwrap();
        fs::write(root.join("src/util.rs"), "pub fn seven() -> i32 { 7 }\n").unwrap();
        fs::write(
            root.join("src/nested/mod.rs"),
            "mod leaf;\npub fn three() -> i32 { leaf::three() }\n",
        )
        .unwrap();
        fs::write(
            root.join("src/nested/leaf.rs"),
            "pub fn three() -> i32 { 3 }\n",
        )
        .unwrap();
        fs::write(
            root.join("src/renamed_file.rs"),
            "pub fn renamed() -> i32 { 1 }\n",
        )
        .unwrap();
        fs::write(
            root.join("src/deep.rs"),
            "pub mod inner {\n    mod block_child;\n    pub fn deep() -> i32 { block_child::v() }\n}\n",
        )
        .unwrap();
        fs::write(
            root.join("src/deep/inner/block_child.rs"),
            "pub fn v() -> i32 { 9 }\n",
        )
        .unwrap();
        fs::write(
            root.join("src/included.rs"),
            "pub fn included() -> i32 { 2 }\n",
        )
        .unwrap();
        // serde_json's tests reach into src with `#[path = "../src/..."]`.
        fs::write(
            root.join("tests/integration.rs"),
            concat!(
                "#[path = \"../src/util.rs\"]\n",
                "mod util;\n",
                "#[test]\n",
                "fn integration_choice() {\n",
                "    assert_eq!(rust_project_fixture::choose(false, true), 3);\n",
                "    assert_eq!(util::seven(), 7);\n",
                "}\n",
            ),
        )
        .unwrap();
        // Data, not code: embedded verbatim and compiled by a consumer of
        // its own, which would not know any runtime module of ours.
        let embedded = "pub fn standalone() -> i32 { if true { 1 } else { 0 } }\n";
        fs::write(root.join("runtime-assets/embedded.rs"), embedded).unwrap();
        fs::write(
            root.join("src/orphan.rs"),
            "pub fn unreachable_module() {}\n",
        )
        .unwrap();

        let prepared = prepare_rust_project(&root, None).unwrap();
        assert_eq!(
            prepared.source_files,
            [
                "src/deep.rs",
                "src/deep/inner/block_child.rs",
                "src/included.rs",
                "src/lib.rs",
                "src/nested/leaf.rs",
                "src/nested/mod.rs",
                "src/renamed_file.rs",
                "src/util.rs",
                "tests/integration.rs",
            ]
        );
        assert_eq!(
            fs::read_to_string(root.join("runtime-assets/embedded.rs")).unwrap(),
            embedded
        );
        assert!(
            !fs::read_to_string(root.join("src/orphan.rs"))
                .unwrap()
                .contains("__supercov")
        );
        assert!(
            fs::read_to_string(root.join("src/deep/inner/block_child.rs"))
                .unwrap()
                .contains("__supercov")
        );
        let build = Command::new("cargo")
            .args(["test", "--no-run"])
            .current_dir(&root)
            .env("CARGO_TARGET_DIR", &prepared.target_directory)
            .output()
            .unwrap();
        assert!(
            build.status.success(),
            "{}",
            String::from_utf8_lossy(&build.stderr)
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn a_module_shared_through_a_symlink_is_instrumented_once() {
        let root = fixture();
        fs::write(root.join("src/shared.rs"), "pub fn shared() -> i32 { 5 }\n").unwrap();
        std::os::unix::fs::symlink("../src/shared.rs", root.join("tests/shared.rs")).unwrap();
        fs::write(
            root.join("src/lib.rs"),
            concat!(
                "pub mod shared;\n",
                "pub fn choose(first: bool, second: bool) -> i32 {\n",
                "    if first && second { 7 } else { shared::shared() }\n",
                "}\n",
            ),
        )
        .unwrap();
        fs::write(
            root.join("tests/integration.rs"),
            concat!(
                "mod shared;\n",
                "#[test]\n",
                "fn integration_choice() {\n",
                "    assert_eq!(rust_project_fixture::choose(false, true), 5);\n",
                "    assert_eq!(shared::shared(), 5);\n",
                "}\n",
            ),
        )
        .unwrap();
        let prepared = prepare_rust_project(&root, None).unwrap();
        // The target's path, once; never the symlink's spelling.
        let shared = prepared
            .source_files
            .iter()
            .filter(|file| file.ends_with("shared.rs"))
            .collect::<Vec<_>>();
        assert_eq!(shared, ["src/shared.rs"], "{:?}", prepared.source_files);
        // The one function in it carries one function probe: instrumented
        // once, through whichever spelling reached it first.
        let instrumented = fs::read_to_string(root.join("src/shared.rs")).unwrap();
        assert_eq!(instrumented.matches("rs:function:").count(), 1);
        let build = Command::new("cargo")
            .args(["test", "--no-run"])
            .current_dir(&root)
            .env("CARGO_TARGET_DIR", &prepared.target_directory)
            .output()
            .unwrap();
        assert!(
            build.status.success(),
            "{}",
            String::from_utf8_lossy(&build.stderr)
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn crate_keys_carry_the_manifest_token() {
        let root = fixture();
        let prepared = prepare_rust_project(&root, None).unwrap();
        let token = manifest_token(&prepared.manifest);
        assert_eq!(token.len(), 12);
        assert!(token.bytes().all(|byte| byte.is_ascii_hexdigit()));
        assert_eq!(token, manifest_token(&prepared.manifest));
        let key = crate_key(&token, "src/lib.rs");
        assert_eq!(key.len(), 24);
        assert!(key.starts_with(&token));
        assert_ne!(key, crate_key(&token, "tests/integration.rs"));
        for crate_root in &prepared.crate_roots {
            assert!(
                fs::read_to_string(root.join(crate_root))
                    .unwrap()
                    .contains(&crate_key(&token, crate_root))
            );
        }
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn prepares_every_workspace_crate_root_and_compiles_without_manifest_changes() {
        let root = fixture();
        let manifest_before = fs::read(root.join("Cargo.toml")).unwrap();
        let prepared = prepare_rust_project(&root, None).unwrap();
        assert_eq!(
            prepared.source_files,
            ["src/lib.rs", "tests/integration.rs"]
        );
        assert_eq!(prepared.crate_roots, ["src/lib.rs", "tests/integration.rs"]);
        assert!(!prepared.manifest.points.is_empty());
        assert!(!prepared.manifest.decisions.is_empty());
        assert_eq!(fs::read(root.join("Cargo.toml")).unwrap(), manifest_before);
        for crate_root in &prepared.crate_roots {
            assert!(
                fs::read_to_string(root.join(crate_root))
                    .unwrap()
                    .contains(&format!("mod {}", prepared.runtime_module))
            );
        }
        let build = Command::new("cargo")
            .args(["test", "--no-run"])
            .current_dir(&root)
            .env("CARGO_TARGET_DIR", &prepared.target_directory)
            .output()
            .unwrap();
        assert!(
            build.status.success(),
            "{}",
            String::from_utf8_lossy(&build.stderr)
        );
        fs::remove_dir_all(root).unwrap();
    }
}
