//! Atomic, integrity-checked merging of independently executed run shards.

use std::{
    collections::{BTreeMap, BTreeSet},
    path::Path,
};

use serde_json::Value;
use supercov_contracts::FrontendRunDeclaration;

use crate::{
    evidence_archive::{EvidenceArchiveEntry, read_archive, write_archive},
    lifecycle::{ProjectLock, finalize_published_run, publish_run, remove_stored_tree_deferred},
    run_store::{RawEvidenceMetadata, RunMetadata, StoredRun, discover_runs},
};

fn rewrite_scope_run_ids(value: &mut Value, merged_run_id: &str) {
    match value {
        Value::Array(values) => {
            for value in values {
                rewrite_scope_run_ids(value, merged_run_id);
            }
        }
        Value::Object(object) => {
            for (key, value) in object {
                if key == "scope" && value.is_object() {
                    value
                        .as_object_mut()
                        .expect("scope was checked as an object")
                        .insert("runId".into(), Value::String(merged_run_id.into()));
                } else {
                    rewrite_scope_run_ids(value, merged_run_id);
                }
            }
        }
        _ => {}
    }
}

fn rewritten_contents(contents: &[u8], merged_run_id: &str) -> Result<Vec<u8>, String> {
    let contents = std::str::from_utf8(contents)
        .map_err(|_| "coverage evidence contains non-UTF-8 data".to_owned())?;
    let mut rewritten = Vec::with_capacity(contents.len());
    for (index, line) in contents.split('\n').enumerate() {
        if index > 0 {
            rewritten.push(b'\n');
        }
        if line.is_empty() {
            continue;
        }
        match serde_json::from_str::<Value>(line) {
            Ok(mut value) => {
                rewrite_scope_run_ids(&mut value, merged_run_id);
                rewritten.extend(
                    serde_json::to_vec(&value)
                        .map_err(|error| format!("failed to rewrite merged evidence: {error}"))?,
                );
            }
            Err(error) => {
                return Err(format!(
                    "cannot merge malformed recognized JSON evidence at line {}: {error}",
                    index + 1
                ));
            }
        }
    }
    Ok(rewritten)
}

fn merged_path(path: &str, shard: usize) -> String {
    if path.starts_with("server/background/") {
        return format!(
            "server/background/shard-{shard}-{}",
            path.rsplit('/').next().unwrap_or(path)
        );
    }
    if let Some(path) = path.strip_prefix("server/") {
        return format!("server/shard-{shard}/{path}");
    }
    format!("shards/{shard}/{path}")
}

fn incompatible_dimensions(first: &StoredRun, candidate: &StoredRun) -> Vec<&'static str> {
    let first = &first.metadata.integrity;
    let candidate = &candidate.metadata.integrity;
    let mut dimensions = Vec::new();
    if candidate.schema_version != first.schema_version {
        dimensions.push("coverage schema");
    }
    if candidate.instrumenter_version != first.instrumenter_version
        || candidate.fingerprint.instrumenter != first.fingerprint.instrumenter
    {
        dimensions.push("instrumenter");
    }
    if candidate.fingerprint.source != first.fingerprint.source {
        dimensions.push("source");
    }
    if candidate.fingerprint.tests != first.fingerprint.tests {
        dimensions.push("tests");
    }
    if candidate.fingerprint.dependencies != first.fingerprint.dependencies {
        dimensions.push("dependencies");
    }
    if candidate.fingerprint.configuration != first.fingerprint.configuration {
        dimensions.push("configuration");
    }
    if dimensions.is_empty() && candidate.fingerprint.combined != first.fingerprint.combined {
        dimensions.push("integrity fingerprint");
    }
    dimensions
}

/// Merge two or more complete, compatible stored runs into one immutable run.
pub fn merge_coverage_runs(
    root: &Path,
    run_ids: &[String],
    merged_run_id: &str,
    started_at: &str,
) -> Result<String, String> {
    if run_ids.len() < 2 {
        return Err("Usage: supercov merge <run-id> <run-id> [...]".into());
    }
    if run_ids.iter().collect::<BTreeSet<_>>().len() != run_ids.len() {
        return Err("Each merged run must be unique".into());
    }
    let inventory =
        discover_runs(root).map_err(|error| format!("Cannot read local coverage runs: {error}"))?;
    let inputs = run_ids
        .iter()
        .map(|id| {
            inventory
                .runs
                .iter()
                .find(|run| run.id == *id)
                .ok_or_else(|| format!("Cannot merge coverage run {id}: incomplete run"))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let first = inputs[0];
    for input in inputs.iter().skip(1) {
        let dimensions = incompatible_dimensions(first, input);
        if !dimensions.is_empty() {
            return Err(format!(
                "Cannot merge incompatible run {}: differing domains: {}",
                input.id,
                dimensions.join(", ")
            ));
        }
    }

    let archives = inputs
        .iter()
        .map(|input| {
            read_archive(&input.evidence_path)
                .map_err(|error| format!("Cannot merge coverage run {}: {error}", input.id))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let manifests = archives
        .iter()
        .map(|entries| {
            entries
                .iter()
                .find(|entry| entry.path == "manifest.json")
                .map(|entry| entry.contents.as_slice())
        })
        .collect::<Vec<_>>();
    let Some(manifest) = manifests[0] else {
        return Err("Cannot merge runs with different coverage denominators".into());
    };
    if manifests
        .iter()
        .any(|candidate| *candidate != Some(manifest))
    {
        return Err("Cannot merge runs with different coverage denominators".into());
    }
    let models = archives
        .iter()
        .map(|entries| {
            entries
                .iter()
                .find(|entry| entry.path == "coverage-model.json")
                .map(|entry| entry.contents.as_slice())
        })
        .collect::<Vec<_>>();
    let Some(model) = models[0] else {
        return Err("Cannot merge runs without a coverage model".into());
    };
    if models.iter().any(|candidate| *candidate != Some(model)) {
        return Err("Cannot merge runs with different coverage models".into());
    }
    let declarations = archives
        .iter()
        .map(|entries| {
            let contents = entries
                .iter()
                .find(|entry| entry.path == "frontend.json")
                .ok_or_else(|| "Cannot merge runs without a frontend declaration".to_owned())?;
            serde_json::from_slice::<FrontendRunDeclaration>(&contents.contents)
                .map_err(|error| format!("Cannot merge invalid frontend declaration: {error}"))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let mut merged_declaration = declarations[0].clone();
    let mut runners = BTreeMap::new();
    for declaration in declarations {
        if declaration.protocol_version != merged_declaration.protocol_version
            || declaration.frontend_id != merged_declaration.frontend_id
            || declaration.frontend_version != merged_declaration.frontend_version
            || declaration.language != merged_declaration.language
            || declaration.structural_source != merged_declaration.structural_source
            || declaration.structural_limitations != merged_declaration.structural_limitations
        {
            return Err("Cannot merge runs with different frontend declarations".into());
        }
        for runner in declaration.runners {
            if let Some(existing) = runners.get(&runner.runner) {
                if existing != &runner {
                    return Err(format!(
                        "Cannot merge incompatible declarations for runner {}",
                        runner.runner
                    ));
                }
            } else {
                runners.insert(runner.runner.clone(), runner);
            }
        }
    }
    merged_declaration.runners = runners.into_values().collect();

    let mut lock = ProjectLock::acquire(root, merged_run_id, started_at)
        .map_err(|error| format!("Cannot lock coverage store for merge: {error}"))?;
    let work = root.join(".supercov/work").join(merged_run_id);
    let result = (|| {
        let mut entries = vec![
            EvidenceArchiveEntry {
                path: "coverage-model.json".into(),
                contents: model.to_vec(),
            },
            EvidenceArchiveEntry {
                path: "frontend.json".into(),
                contents: serde_json::to_vec(&merged_declaration)
                    .map_err(|error| format!("Could not encode merged frontend: {error}"))?,
            },
            EvidenceArchiveEntry {
                path: "manifest.json".into(),
                contents: manifest.to_vec(),
            },
        ];
        for (shard, archive) in archives.iter().enumerate() {
            for entry in archive.iter().filter(|entry| {
                !matches!(
                    entry.path.as_str(),
                    "coverage-model.json" | "frontend.json" | "manifest.json"
                )
            }) {
                entries.push(EvidenceArchiveEntry {
                    path: merged_path(&entry.path, shard),
                    contents: rewritten_contents(&entry.contents, merged_run_id)?,
                });
            }
        }
        let archive_path = work.join("evidence.raw.gz");
        let raw = write_archive(entries, &archive_path)
            .map_err(|error| format!("Could not write merged evidence: {error}"))?;
        let metadata = RunMetadata {
            id: merged_run_id.into(),
            started_at: started_at.into(),
            duration_ms: 0.0,
            command: std::iter::once("supercov".into())
                .chain(std::iter::once("merge".into()))
                .chain(run_ids.iter().cloned())
                .collect(),
            test_exit_code: Some(
                if inputs
                    .iter()
                    .all(|input| input.metadata.test_exit_code == Some(0))
                {
                    0
                } else {
                    1
                },
            ),
            integrity: first.metadata.integrity.clone(),
            raw_evidence: RawEvidenceMetadata {
                schema_version: raw.schema_version,
                format: raw.format.into(),
                file: raw.file.into(),
                files: raw.files,
                uncompressed_bytes: raw.uncompressed_bytes,
                compressed_bytes: raw.compressed_bytes,
            },
            isolated_build: None,
            instrumented_build_cache: None,
            timings: None,
            merged: Some(true),
            parents: Some(run_ids.to_vec()),
            source_roots: None,
        };
        publish_run(root, &metadata, &archive_path)
            .map_err(|error| format!("Could not publish merged run: {error}"))?;
        finalize_published_run(root, merged_run_id)
            .map_err(|error| format!("Could not finalize merged run: {error}"))?;
        Ok(merged_run_id.to_owned())
    })();
    let _ = remove_stored_tree_deferred(root, &work);
    let release = lock
        .release()
        .map_err(|error| format!("Could not release merge lock: {error}"));
    match (result, release) {
        (Err(error), _) => Err(error),
        (Ok(_), Err(error)) => Err(error),
        (Ok(id), Ok(())) => Ok(id),
    }
}

#[cfg(test)]
mod tests {
    use std::{
        collections::BTreeSet,
        fs,
        sync::{
            Arc, Barrier,
            atomic::{AtomicU64, Ordering},
        },
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;
    use crate::{evidence_archive::read_archive, run_store::create_analyzable_test_run};

    /// The name alone, so the uniqueness this depends on can be tested without
    /// creating a directory for every sample.
    fn temporary_name() -> String {
        // The clock below ticks once per microsecond, so the pid and the nonce
        // do not distinguish two tests that start together -- and the tests in
        // this module rewrite run-b's metadata and delete the root when they
        // finish, which the other test then reads as an incomplete run. The
        // counter is what makes each name its own.
        static UNIQUE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        format!(
            "supercov-run-merge-{}-{nonce}-{}",
            std::process::id(),
            UNIQUE.fetch_add(1, Ordering::Relaxed)
        )
    }

    fn temporary() -> std::path::PathBuf {
        let root = std::env::temp_dir().join(temporary_name());
        // `create_dir`, not `create_dir_all`: if a root is ever handed out
        // twice, the second test must fail here saying so, rather than share a
        // directory and fail somewhere else for a reason that reads as a bug in
        // the code under test.
        fs::create_dir(&root).unwrap();
        root
    }

    #[test]
    fn temporary_roots_stay_distinct_when_tests_start_together() {
        // What the harness does to adjacent tests: release several at once and
        // require that no two of them are handed the same directory.
        const THREADS: usize = 8;
        const EACH: usize = 500;
        let barrier = Arc::new(Barrier::new(THREADS));
        let names: Vec<String> = (0..THREADS)
            .map(|_| {
                let barrier = Arc::clone(&barrier);
                std::thread::spawn(move || {
                    barrier.wait();
                    (0..EACH).map(|_| temporary_name()).collect::<Vec<_>>()
                })
            })
            .collect::<Vec<_>>()
            .into_iter()
            .flat_map(|handle| handle.join().unwrap())
            .collect();
        let distinct = names.iter().collect::<BTreeSet<_>>();
        assert_eq!(
            distinct.len(),
            names.len(),
            "two tests would have shared a temporary root"
        );
    }

    #[test]
    fn merges_compatible_runs_atomically_and_rejects_duplicates() {
        let root = temporary();
        create_analyzable_test_run(&root, "run-a");
        create_analyzable_test_run(&root, "run-b");
        let id = merge_coverage_runs(
            &root,
            &["run-a".into(), "run-b".into()],
            "merged",
            "2026-01-01T00:00:00.000Z",
        )
        .unwrap();
        assert_eq!(id, "merged");
        let metadata: RunMetadata =
            serde_json::from_slice(&fs::read(root.join(".supercov/runs/merged/run.json")).unwrap())
                .unwrap();
        assert_eq!(metadata.merged, Some(true));
        assert_eq!(metadata.parents, Some(vec!["run-a".into(), "run-b".into()]));
        let archive = read_archive(&root.join(".supercov/runs/merged/evidence.raw.gz")).unwrap();
        assert!(archive.iter().any(|entry| entry.path == "manifest.json"));
        assert!(
            archive
                .iter()
                .any(|entry| entry.path.starts_with("shards/0/"))
        );
        assert!(
            archive
                .iter()
                .any(|entry| entry.path.starts_with("shards/1/"))
        );
        assert!(matches!(
            merge_coverage_runs(
                &root,
                &["run-a".into(), "run-a".into()],
                "invalid",
                "2026-01-01T00:00:00.000Z",
            ),
            Err(error) if error == "Each merged run must be unique"
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn names_every_incompatible_integrity_dimension() {
        let root = temporary();
        create_analyzable_test_run(&root, "run-a");
        create_analyzable_test_run(&root, "run-b");
        let metadata_path = root.join(".supercov/runs/run-b/run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.integrity.fingerprint.source = "1".repeat(64);
        metadata.integrity.fingerprint.tests = "2".repeat(64);
        metadata.integrity.fingerprint.configuration = "3".repeat(64);
        metadata.integrity.fingerprint.combined = "4".repeat(64);
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();

        let error = merge_coverage_runs(
            &root,
            &["run-a".into(), "run-b".into()],
            "merged",
            "2026-01-01T00:00:00.000Z",
        )
        .unwrap_err();
        assert_eq!(
            error,
            "Cannot merge incompatible run run-b: differing domains: source, tests, configuration"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn rewrites_nested_scope_run_ids_and_rejects_non_json_records() {
        let rewritten = rewritten_contents(
            b"{\"scope\":{\"runId\":\"old\",\"testId\":\"test\"},\"nested\":[{\"scope\":{\"runId\":\"old\"}}]}\n",
            "merged",
        )
        .unwrap();
        assert_eq!(
            std::str::from_utf8(&rewritten).unwrap(),
            "{\"scope\":{\"runId\":\"merged\",\"testId\":\"test\"},\"nested\":[{\"scope\":{\"runId\":\"merged\"}}]}\n"
        );
        assert!(rewritten_contents(b"plain\n", "merged").is_err());
    }
}
