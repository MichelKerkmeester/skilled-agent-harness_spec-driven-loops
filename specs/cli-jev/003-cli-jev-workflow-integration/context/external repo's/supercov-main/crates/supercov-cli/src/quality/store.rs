//! Immutable quality snapshots on disk.
//!
//! A scan writes one snapshot and never revises it. Browsing reads snapshots
//! and the response cache, so navigating a saved assessment costs nothing and
//! needs no credential. Raw provider answers are not copied into a snapshot:
//! they already live in the content-addressed response cache, which a snapshot
//! points into by request hash.
//!
//! Layout under the scanned root, one lane per instrument (`quality` for the
//! code-property catalog, `security` for the security surface catalog), so a
//! security snapshot can never be read as a quality one:
//!
//! ```text
//! .supercov/<lane>/
//!   <request-sha256>.json          legacy response cache, still read
//!   requests/<request-sha256>.json response cache
//!   snapshots/latest               the id of the most recent completed scan
//!   snapshots/<id>/manifest.json   what was scanned, with which rubric and model
//!   snapshots/<id>/files.json      per file and window: grades and identities
//! ```

use std::{
    fs,
    io::Write,
    path::{Path, PathBuf},
};

use serde_json::Value;
use sha2::{Digest, Sha256};

pub fn root(project_root: &Path, lane: &str) -> PathBuf {
    project_root.join(".supercov").join(lane)
}

/// Where a response is cached now. The flat directory above it is the earlier
/// location; [`legacy_response`] still reads from there.
pub fn responses(project_root: &Path, lane: &str) -> PathBuf {
    root(project_root, lane).join("requests")
}

/// Only the quality lane ever had the flat layout.
pub fn legacy_response(project_root: &Path, hash: &str) -> PathBuf {
    root(project_root, "quality").join(format!("{hash}.json"))
}

pub fn snapshots(project_root: &Path, lane: &str) -> PathBuf {
    root(project_root, lane).join("snapshots")
}

/// `q_` and sixteen hex characters, following the shape of a public run id:
/// short, opaque, and carrying no meaning a reader might rely on.
pub fn identity() -> Result<(String, String), String> {
    let created_at = time::OffsetDateTime::now_utc()
        .format(crate::PUBLIC_TIMESTAMP_FORMAT)
        .map_err(|error| format!("could not generate the snapshot identity: {error}"))?;
    let seed = format!(
        "{created_at}\0{}\0{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos()
    );
    let digest = format!("{:x}", Sha256::digest(seed.as_bytes()));
    Ok((format!("q_{}", &digest[..16]), created_at))
}

/// Checked before any path is built from a selector, so a snapshot id can
/// never reach outside the snapshot directory.
pub fn is_snapshot_id(value: &str) -> bool {
    value.len() == 18
        && value.starts_with("q_")
        && value[2..]
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

/// Write bytes where nothing was, or replace what is there in one step. A
/// reader sees either the whole previous content or the whole new content.
pub fn write_atomic(path: &Path, bytes: &[u8]) -> Result<(), String> {
    let directory = path.parent().ok_or("invalid path")?;
    fs::create_dir_all(directory).map_err(|e| e.to_string())?;
    let temp = path.with_extension(format!("{}.tmp", std::process::id()));
    let result = (|| -> Result<(), String> {
        let mut file = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&temp)
            .map_err(|e| e.to_string())?;
        file.write_all(bytes).map_err(|e| e.to_string())?;
        file.sync_all().map_err(|e| e.to_string())?;
        fs::rename(&temp, path).map_err(|e| e.to_string())
    })();
    if result.is_err() {
        let _ = fs::remove_file(temp);
    }
    result
}

/// Save one completed scan and point `latest` at it. The snapshot directory is
/// created exclusively, so an id that somehow already exists is refused rather
/// than overwritten.
pub fn write(
    project_root: &Path,
    lane: &str,
    id: &str,
    manifest: &Value,
    files: &Value,
) -> Result<PathBuf, String> {
    if !is_snapshot_id(id) {
        return Err(format!("not a snapshot id: {id}"));
    }
    let directory = snapshots(project_root, lane).join(id);
    fs::create_dir_all(snapshots(project_root, lane)).map_err(|e| e.to_string())?;
    fs::create_dir(&directory).map_err(|e| match e.kind() {
        std::io::ErrorKind::AlreadyExists => format!("{lane} snapshot {id} already exists"),
        _ => e.to_string(),
    })?;
    for (name, document) in [("manifest.json", manifest), ("files.json", files)] {
        let bytes = serde_json::to_vec(document).map_err(|e| e.to_string())?;
        write_atomic(&directory.join(name), &bytes)?;
    }
    // Last, so `latest` never names a snapshot that is still being written.
    write_atomic(&snapshots(project_root, lane).join("latest"), id.as_bytes())?;
    Ok(directory)
}

fn document(path: &Path, what: &str) -> Result<Value, String> {
    let bytes = fs::read(path).map_err(|e| format!("cannot read the snapshot {what}: {e}"))?;
    serde_json::from_slice(&bytes).map_err(|e| format!("invalid snapshot {what}: {e}"))
}

/// The manifest and the per-file record of one snapshot.
pub fn read(project_root: &Path, lane: &str, id: &str) -> Result<(Value, Value), String> {
    if !is_snapshot_id(id) {
        return Err(format!("not a snapshot id: {id}"));
    }
    let directory = snapshots(project_root, lane).join(id);
    if !directory.is_dir() {
        return Err(format!(
            "no {lane} snapshot {id} here; list them with: supercov {lane} snapshots"
        ));
    }
    Ok((
        document(&directory.join("manifest.json"), "manifest")?,
        document(&directory.join("files.json"), "file record")?,
    ))
}

/// Every snapshot with its manifest, most recent first.
pub fn list(project_root: &Path, lane: &str) -> Result<Vec<(String, Value)>, String> {
    let directory = snapshots(project_root, lane);
    let entries = match fs::read_dir(&directory) {
        Ok(entries) => entries,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(e) => return Err(format!("cannot read {lane} snapshots: {e}")),
    };
    let mut found = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let id = entry.file_name().to_string_lossy().into_owned();
        if !is_snapshot_id(&id) || !entry.path().is_dir() {
            continue;
        }
        // A half-written or hand-damaged snapshot is skipped rather than
        // failing a listing of the intact ones.
        if let Ok(manifest) = document(&entry.path().join("manifest.json"), "manifest") {
            found.push((id, manifest));
        }
    }
    found.sort_by(|a, b| {
        b.1["created_at"]
            .as_str()
            .cmp(&a.1["created_at"].as_str())
            .then_with(|| b.0.cmp(&a.0))
    });
    Ok(found)
}

/// The id a selector names: an explicit id, or the most recent scan. The
/// `latest` pointer wins when it names a snapshot that is still there, so
/// concurrent scans resolve to whichever finished last; otherwise the newest
/// surviving snapshot stands in, which keeps browsing working after a snapshot
/// is deleted by hand.
pub fn resolve(project_root: &Path, lane: &str, selector: Option<&str>) -> Result<String, String> {
    if let Some(selector) = selector.filter(|s| *s != "latest") {
        if !is_snapshot_id(selector) {
            return Err(format!(
                "not a snapshot id: {selector}; list them with: supercov {lane} snapshots"
            ));
        }
        return Ok(selector.to_owned());
    }
    let pointer = fs::read_to_string(snapshots(project_root, lane).join("latest"))
        .ok()
        .map(|id| id.trim().to_owned())
        .filter(|id| is_snapshot_id(id))
        .filter(|id| snapshots(project_root, lane).join(id).is_dir());
    match pointer {
        Some(id) => Ok(id),
        None => list(project_root, lane)?
            .into_iter()
            .next()
            .map(|(id, _)| id)
            .ok_or_else(|| {
                format!(
                    "no {lane} snapshot here yet; assess some source first: supercov {lane} <path>"
                )
            }),
    }
}
