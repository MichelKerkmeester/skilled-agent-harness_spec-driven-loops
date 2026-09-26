//! Exact-input stable workspace metadata for the owned Rust frontend.

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::{coverage_report::CoverageManifest, lifecycle::atomic_write, run_store::RunIntegrity};

pub const RUST_BUILD_CACHE_SCHEMA_VERSION: u32 = 1;
const CACHE_FILE: &str = ".supercov/rust-build-cache.json";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustArtifactFingerprint {
    pub path: String,
    pub bytes: u64,
    pub sha256: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustBuildCacheMetadata {
    pub schema_version: u32,
    pub key: String,
    pub created_at: String,
    pub source_files: Vec<String>,
    pub instrumented_source_sha256: String,
    pub artifacts: Vec<RustArtifactFingerprint>,
    pub manifest: CoverageManifest,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RustBuildCacheIdentity<'a> {
    schema_version: u32,
    execution_fingerprint: &'a str,
    /// Supercov's own build. `execution` no longer carries it, and cached
    /// output from a different instrumenter must never be reused.
    instrumenter_fingerprint: &'a str,
    command: &'a [String],
    rustc: String,
    cargo: String,
    platform: &'static str,
    architecture: &'static str,
}

fn tool_version(program: &str, arguments: &[&str]) -> String {
    Command::new(program)
        .args(arguments)
        .output()
        .ok()
        .filter(|output| output.status.success())
        .and_then(|output| String::from_utf8(output.stdout).ok())
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| "unavailable".into())
}

pub fn rust_build_cache_key(
    integrity: &RunIntegrity,
    command: &[String],
) -> Result<String, serde_json::Error> {
    let identity = RustBuildCacheIdentity {
        schema_version: RUST_BUILD_CACHE_SCHEMA_VERSION,
        execution_fingerprint: &integrity.fingerprint.execution,
        instrumenter_fingerprint: &integrity.fingerprint.instrumenter,
        command,
        rustc: tool_version("rustc", &["-vV"]),
        cargo: tool_version("cargo", &["-Vv"]),
        platform: std::env::consts::OS,
        architecture: std::env::consts::ARCH,
    };
    Ok(format!(
        "{:x}",
        Sha256::digest(serde_json::to_vec(&identity)?)
    ))
}

fn regular_directory(path: &Path) -> bool {
    fs::symlink_metadata(path).is_ok_and(|metadata| metadata.file_type().is_dir())
}

fn safe_relative(value: &str) -> bool {
    let path = Path::new(value);
    !value.is_empty()
        && !path.is_absolute()
        && path
            .components()
            .all(|component| matches!(component, std::path::Component::Normal(_)))
}

fn digest_files(root: &Path, files: &[String]) -> Option<String> {
    let mut digest = Sha256::new();
    for relative in files {
        if !safe_relative(relative) {
            return None;
        }
        let path = root.join(relative);
        let metadata = fs::symlink_metadata(&path).ok()?;
        if !metadata.file_type().is_file() {
            return None;
        }
        let bytes = fs::read(path).ok()?;
        digest.update((relative.len() as u64).to_le_bytes());
        digest.update(relative.as_bytes());
        digest.update((bytes.len() as u64).to_le_bytes());
        digest.update(bytes);
    }
    Some(format!("{:x}", digest.finalize()))
}

fn fingerprint_artifacts(
    target_directory: &Path,
    artifacts: &[PathBuf],
) -> Result<Vec<RustArtifactFingerprint>, String> {
    let canonical_target = fs::canonicalize(target_directory).map_err(|error| error.to_string())?;
    let mut fingerprints = Vec::new();
    for artifact in artifacts {
        let artifact = fs::canonicalize(artifact).map_err(|error| error.to_string())?;
        let relative = artifact
            .strip_prefix(&canonical_target)
            .map_err(|_| {
                format!(
                    "cached Rust artifact escaped target: {}",
                    artifact.display()
                )
            })?
            .to_string_lossy()
            .replace('\\', "/");
        if !safe_relative(&relative) {
            return Err(format!("unsafe cached Rust artifact: {relative}"));
        }
        let metadata = fs::symlink_metadata(&artifact).map_err(|error| error.to_string())?;
        if !metadata.file_type().is_file() {
            return Err(format!(
                "cached Rust artifact is not a regular file: {}",
                artifact.display()
            ));
        }
        let bytes = fs::read(&artifact).map_err(|error| error.to_string())?;
        fingerprints.push(RustArtifactFingerprint {
            path: relative,
            bytes: bytes.len() as u64,
            sha256: format!("{:x}", Sha256::digest(bytes)),
        });
    }
    fingerprints.sort_by(|left, right| left.path.cmp(&right.path));
    fingerprints.dedup_by(|left, right| left.path == right.path);
    Ok(fingerprints)
}

fn artifacts_match(target_directory: &Path, expected: &[RustArtifactFingerprint]) -> bool {
    if expected.is_empty() || expected.windows(2).any(|pair| pair[0].path >= pair[1].path) {
        return false;
    }
    expected.iter().all(|expected| {
        if !safe_relative(&expected.path) {
            return false;
        }
        let path = target_directory.join(&expected.path);
        let Ok(metadata) = fs::symlink_metadata(&path) else {
            return false;
        };
        if !metadata.file_type().is_file() || metadata.len() != expected.bytes {
            return false;
        }
        fs::read(path).is_ok_and(|bytes| format!("{:x}", Sha256::digest(bytes)) == expected.sha256)
    })
}

pub fn read_rust_build_cache(
    workspace: &Path,
    target_directory: &Path,
    key: &str,
) -> Option<RustBuildCacheMetadata> {
    if !regular_directory(workspace) || !regular_directory(target_directory) {
        return None;
    }
    let path = workspace.join(CACHE_FILE);
    if !fs::symlink_metadata(&path).is_ok_and(|metadata| metadata.file_type().is_file()) {
        return None;
    }
    let metadata: RustBuildCacheMetadata = serde_json::from_slice(&fs::read(path).ok()?).ok()?;
    if metadata.schema_version != RUST_BUILD_CACHE_SCHEMA_VERSION
        || metadata.key != key
        || metadata.source_files.is_empty()
        || metadata.manifest.points.is_empty()
        || metadata
            .source_files
            .windows(2)
            .any(|pair| pair[0] >= pair[1])
        || digest_files(workspace, &metadata.source_files).as_deref()
            != Some(metadata.instrumented_source_sha256.as_str())
        || !artifacts_match(target_directory, &metadata.artifacts)
    {
        return None;
    }
    Some(metadata)
}

pub fn write_rust_build_cache(
    project_root: &Path,
    workspace: &Path,
    key: &str,
    created_at: &str,
    source_files: &[String],
    manifest: &CoverageManifest,
    artifacts: &[PathBuf],
) -> Result<RustBuildCacheMetadata, String> {
    let mut source_files = source_files.to_vec();
    source_files.sort();
    source_files.dedup();
    let instrumented_source_sha256 = digest_files(workspace, &source_files)
        .ok_or_else(|| "could not authenticate instrumented Rust sources".to_owned())?;
    let target_directory = rust_target_directory(project_root);
    let metadata = RustBuildCacheMetadata {
        schema_version: RUST_BUILD_CACHE_SCHEMA_VERSION,
        key: key.into(),
        created_at: created_at.into(),
        source_files,
        instrumented_source_sha256,
        artifacts: fingerprint_artifacts(&target_directory, artifacts)?,
        manifest: manifest.clone(),
    };
    let mut bytes = serde_json::to_vec_pretty(&metadata).map_err(|error| error.to_string())?;
    bytes.push(b'\n');
    atomic_write(project_root, &workspace.join(CACHE_FILE), &bytes)
        .map_err(|error| error.to_string())?;
    Ok(metadata)
}

pub fn rust_target_directory(project_root: &Path) -> PathBuf {
    project_root.join(".supercov/cache/rust-target")
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;
    use crate::{coverage_analysis::PointKind, coverage_report::PointMeta};

    #[test]
    fn cache_requires_exact_key_regular_workspace_target_and_sorted_sources() {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-cache-{}-{nonce}",
            std::process::id()
        ));
        let workspace = root.join(".supercov/cache/workspace/project");
        let target = rust_target_directory(&root);
        fs::create_dir_all(workspace.join(".supercov")).unwrap();
        fs::create_dir_all(workspace.join("src")).unwrap();
        fs::create_dir_all(workspace.join("tests")).unwrap();
        fs::write(workspace.join("src/lib.rs"), "fn work() {}\n").unwrap();
        fs::write(workspace.join("tests/test.rs"), "#[test] fn works() {}\n").unwrap();
        fs::create_dir_all(target.join("debug")).unwrap();
        fs::write(target.join("debug/test-bin"), b"binary").unwrap();
        let manifest = CoverageManifest {
            unmeasured: Vec::new(),
            decisions: Vec::new(),
            points: vec![PointMeta {
                id: "rs:statement:000000000000000000000000".into(),
                kind: PointKind::Statement,
                file: "src/lib.rs".into(),
                line: 1,
                column: 0,
                source: "work();".into(),
                label: None,
            }],
            branches: Vec::new(),
            limitations: Vec::new(),
            scope: None,
        };
        let written = write_rust_build_cache(
            &root,
            &workspace,
            "key",
            "time",
            &["tests/test.rs".into(), "src/lib.rs".into()],
            &manifest,
            &[target.join("debug/test-bin")],
        )
        .unwrap();
        assert_eq!(written.source_files, ["src/lib.rs", "tests/test.rs"]);
        assert_eq!(
            read_rust_build_cache(&workspace, &target, "key"),
            Some(written)
        );
        assert!(read_rust_build_cache(&workspace, &target, "other").is_none());
        fs::write(workspace.join("src/lib.rs"), "fn changed() {}\n").unwrap();
        assert!(read_rust_build_cache(&workspace, &target, "key").is_none());
        fs::write(workspace.join("src/lib.rs"), "fn work() {}\n").unwrap();
        assert!(read_rust_build_cache(&workspace, &target, "key").is_some());
        fs::write(target.join("debug/test-bin"), b"tamper").unwrap();
        assert!(read_rust_build_cache(&workspace, &target, "key").is_none());
        fs::remove_dir_all(target).unwrap();
        assert!(read_rust_build_cache(&workspace, &root.join("missing"), "key").is_none());
        fs::remove_dir_all(root).unwrap();
    }
}
