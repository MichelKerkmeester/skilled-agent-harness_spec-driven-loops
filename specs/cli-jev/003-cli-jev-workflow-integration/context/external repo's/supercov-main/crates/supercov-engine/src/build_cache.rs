//! Exact-fingerprint reuse of instrumented JavaScript build outputs.

use std::{
    collections::BTreeMap,
    fs,
    path::{Component, Path, PathBuf},
    process::Command,
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::{lifecycle::atomic_write, project_discovery::CoverageProject, run_store::RunIntegrity};

pub const BUILD_CACHE_SCHEMA_VERSION: u32 = 1;
const OUTPUT_CANDIDATES: &[&str] = &["build", "dist", ".next", ".nuxt", ".output"];
const SCAN_EXCLUSIONS: &[&str] = &[".git", ".supercov", "node_modules"];
const SCAN_DEPTH_LIMIT: usize = 6;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BuildCacheMetadata {
    pub schema_version: u32,
    pub key: String,
    pub created_at: String,
    pub artifact_paths: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CacheIdentity<'a> {
    schema_version: u32,
    execution_fingerprint: &'a str,
    /// Supercov's own build. `execution` no longer carries it, and cached
    /// output from a different instrumenter must never be reused.
    instrumenter_fingerprint: &'a str,
    adapter: crate::project_discovery::BuildAdapter,
    /// Instrumented sources import the runtime by absolute path, so output
    /// built in one place does not run from another.
    root: &'a Path,
    command: &'a [String],
    environment: &'a BTreeMap<String, String>,
    node: String,
    platform: &'static str,
    architecture: &'static str,
}

fn safe_relative(path: &Path) -> bool {
    path.components().next().is_some()
        && path
            .components()
            .all(|component| matches!(component, Component::Normal(_)))
}

fn regular_artifact(workspace: &Path, relative: &Path) -> bool {
    safe_relative(relative)
        && fs::symlink_metadata(workspace.join(relative))
            .is_ok_and(|metadata| metadata.file_type().is_file() || metadata.file_type().is_dir())
}

fn node_version() -> String {
    std::env::var("SUPERCOV_NODE_VERSION").unwrap_or_else(|_| {
        Command::new("node")
            .args(["--print", "process.versions.node"])
            .output()
            .ok()
            .filter(|output| output.status.success())
            .and_then(|output| String::from_utf8(output.stdout).ok())
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty())
            .unwrap_or_else(|| "unavailable".into())
    })
}

pub fn build_cache_key(
    integrity: &RunIntegrity,
    project: &CoverageProject,
) -> Result<String, String> {
    let identity = CacheIdentity {
        schema_version: BUILD_CACHE_SCHEMA_VERSION,
        execution_fingerprint: &integrity.fingerprint.execution,
        instrumenter_fingerprint: &integrity.fingerprint.instrumenter,
        adapter: project.build_adapter,
        root: &project.root,
        command: &project.build_command,
        environment: &project.build_environment,
        node: node_version(),
        platform: std::env::consts::OS,
        architecture: std::env::consts::ARCH,
    };
    let bytes = serde_json::to_vec(&identity)
        .map_err(|error| format!("failed to serialize build-cache identity: {error}"))?;
    Ok(format!("{:x}", Sha256::digest(bytes)))
}

pub fn read_build_cache(workspace: &Path, key: &str) -> Option<BuildCacheMetadata> {
    let path = workspace.join(".supercov/build-cache.json");
    if !fs::symlink_metadata(&path).is_ok_and(|metadata| metadata.file_type().is_file()) {
        return None;
    }
    let metadata: BuildCacheMetadata = serde_json::from_slice(&fs::read(path).ok()?).ok()?;
    if metadata.schema_version != BUILD_CACHE_SCHEMA_VERSION
        || metadata.key != key
        || metadata.artifact_paths.is_empty()
        || metadata
            .artifact_paths
            .iter()
            .any(|path| !regular_artifact(workspace, Path::new(path)))
    {
        return None;
    }
    Some(metadata)
}

pub fn reuse_paths(metadata: &BuildCacheMetadata) -> Vec<PathBuf> {
    metadata
        .artifact_paths
        .iter()
        .map(PathBuf::from)
        .chain([PathBuf::from(".supercov/build-cache.json")])
        .collect()
}

#[derive(Deserialize, Default)]
struct DeclaredOutputs {
    #[serde(default)]
    paths: Vec<String>,
}

/// Monorepo build outputs live at package roots (`packages/*/dist`), not the
/// workspace root, so candidates come from a depth-limited scan of the whole
/// mirror rather than a root-only check.
fn workspace_output_directories(workspace: &Path) -> Vec<String> {
    let mut found = Vec::new();
    let mut pending = vec![(workspace.to_owned(), 0usize)];
    while let Some((directory, depth)) = pending.pop() {
        let Ok(entries) = fs::read_dir(&directory) else {
            continue;
        };
        for entry in entries.flatten() {
            if !entry.file_type().is_ok_and(|kind| kind.is_dir()) {
                continue;
            }
            let name = entry.file_name();
            let Some(name) = name.to_str() else {
                continue;
            };
            if SCAN_EXCLUSIONS.contains(&name) {
                continue;
            }
            if OUTPUT_CANDIDATES.contains(&name) {
                if let Ok(relative) = entry.path().strip_prefix(workspace) {
                    found.push(slash_path(relative));
                }
            } else if depth < SCAN_DEPTH_LIMIT {
                pending.push((entry.path(), depth + 1));
            }
        }
    }
    found
}

/// Cache metadata is read back through `Path::new`, which accepts `/` on
/// every host; a path spelled with `\\` would only ever be right on the host
/// that wrote it.
fn slash_path(path: &Path) -> String {
    path.components()
        .map(|component| component.as_os_str().to_string_lossy().into_owned())
        .collect::<Vec<_>>()
        .join("/")
}

pub fn write_build_cache(
    project_root: &Path,
    workspace: &Path,
    key: &str,
    created_at: &str,
) -> Result<Option<BuildCacheMetadata>, String> {
    let declared = fs::read(workspace.join(".supercov/build-outputs.json"))
        .ok()
        .and_then(|bytes| serde_json::from_slice::<DeclaredOutputs>(&bytes).ok())
        .unwrap_or_default();
    let mut candidates = workspace_output_directories(workspace)
        .into_iter()
        .chain(
            declared
                .paths
                .into_iter()
                .filter(|path| safe_relative(Path::new(path))),
        )
        .collect::<Vec<_>>();
    candidates.sort();
    candidates.dedup();
    candidates.retain(|path| regular_artifact(workspace, Path::new(path)));
    let existing = candidates.clone();
    candidates.retain(|path| {
        !existing.iter().any(|parent| {
            parent != path
                && Path::new(path)
                    .strip_prefix(Path::new(parent))
                    .is_ok_and(|local| local.components().next().is_some())
        })
    });
    if candidates.is_empty() || !regular_artifact(workspace, Path::new(".supercov/manifest.json")) {
        return Ok(None);
    }
    candidates.push(".supercov/manifest.json".into());
    let metadata = BuildCacheMetadata {
        schema_version: BUILD_CACHE_SCHEMA_VERSION,
        key: key.into(),
        created_at: created_at.into(),
        artifact_paths: candidates,
    };
    let mut bytes = serde_json::to_vec_pretty(&metadata)
        .map_err(|error| format!("failed to serialize build-cache metadata: {error}"))?;
    bytes.push(b'\n');
    atomic_write(
        project_root,
        &workspace.join(".supercov/build-cache.json"),
        &bytes,
    )
    .map_err(|error| error.to_string())?;
    Ok(Some(metadata))
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;

    fn temporary() -> PathBuf {
        // Two tests starting on the same nanosecond drew the same directory
        // and polluted each other's artifact scans; the counter breaks ties.
        static UNIQUE: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-build-cache-{}-{nonce}-{}",
            std::process::id(),
            UNIQUE.fetch_add(1, std::sync::atomic::Ordering::Relaxed)
        ));
        fs::create_dir_all(&root).unwrap();
        root
    }

    #[test]
    fn writes_reads_and_rejects_incomplete_exact_cache_metadata() {
        let root = temporary();
        let workspace = root.join(".supercov/cache/workspace/project");
        fs::create_dir_all(workspace.join(".supercov")).unwrap();
        fs::create_dir_all(workspace.join("dist")).unwrap();
        fs::write(workspace.join("dist/app.js"), "built").unwrap();
        fs::write(workspace.join(".supercov/manifest.json"), "{}").unwrap();
        let written = write_build_cache(&root, &workspace, "key", "time")
            .unwrap()
            .unwrap();
        assert_eq!(written.artifact_paths, ["dist", ".supercov/manifest.json"]);
        assert_eq!(read_build_cache(&workspace, "key"), Some(written.clone()));
        assert_eq!(
            reuse_paths(&written),
            [
                PathBuf::from("dist"),
                PathBuf::from(".supercov/manifest.json"),
                PathBuf::from(".supercov/build-cache.json"),
            ]
        );
        fs::remove_dir_all(workspace.join("dist")).unwrap();
        assert_eq!(read_build_cache(&workspace, "key"), None);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn records_package_level_outputs_and_skips_dependency_trees() {
        let root = temporary();
        let workspace = root.join(".supercov/cache/workspace/project");
        fs::create_dir_all(workspace.join(".supercov")).unwrap();
        fs::write(workspace.join(".supercov/manifest.json"), "{}").unwrap();
        fs::create_dir_all(workspace.join("packages/app/dist/assets")).unwrap();
        fs::write(workspace.join("packages/app/dist/app.js"), "built").unwrap();
        fs::create_dir_all(workspace.join("packages/site/.next")).unwrap();
        fs::create_dir_all(workspace.join("node_modules/library/dist")).unwrap();
        fs::create_dir_all(workspace.join("packages/app/node_modules/local/dist")).unwrap();
        let written = write_build_cache(&root, &workspace, "key", "time")
            .unwrap()
            .unwrap();
        assert_eq!(
            written.artifact_paths,
            [
                "packages/app/dist",
                "packages/site/.next",
                ".supercov/manifest.json"
            ]
        );
        assert_eq!(read_build_cache(&workspace, "key"), Some(written));
        fs::remove_dir_all(root).unwrap();
    }
}
