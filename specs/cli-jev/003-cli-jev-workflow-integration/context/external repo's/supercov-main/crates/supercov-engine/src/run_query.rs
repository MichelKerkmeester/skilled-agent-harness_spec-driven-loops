//! Agent-facing queries over persisted run metadata.

use serde::Serialize;
use supercov_contracts::AgentPagination;

use crate::{
    agent_json,
    coverage_analysis::serialize_javascript_number,
    coverage_index::{CoverageIndex, CoverageViewId},
    coverage_query::CoverageQueryFilters,
    run_store::{
        RawEvidenceMetadata, RunIndexError, RunIntegrity, RunInventory, RunTimings, StoredRun,
        compare_run_integrity, open_or_rebuild_query_index,
    },
};

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunListEntry {
    pub id: String,
    pub generated_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lines: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branches: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mcdc: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub coverage_error: Option<String>,
    pub command: Vec<String>,
    #[serde(serialize_with = "serialize_javascript_number")]
    pub duration_ms: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timings: Option<RunTimings>,
    pub test_exit_code: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub build_reused: Option<bool>,
    pub raw_evidence: RawEvidenceMetadata,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stale: Option<bool>,
    pub reasons: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunListData {
    pub filters: CoverageQueryFilters,
    pub runs: Vec<RunListEntry>,
}

pub fn run_list_query(
    inventory: &RunInventory,
    current_integrity: &dyn Fn(&StoredRun) -> Option<RunIntegrity>,
    view: CoverageViewId,
    offset: usize,
    limit: usize,
) -> Result<(RunListData, AgentPagination), RunIndexError> {
    let runs = inventory
        .runs
        .iter()
        .skip(offset)
        .take(limit)
        .map(|run| -> Result<RunListEntry, RunIndexError> {
            let summary = open_or_rebuild_query_index(run).and_then(|container| {
                let index = CoverageIndex::new(&container)?;
                Ok(index.summary(view)?)
            });
            let (lines, branches, mcdc, coverage_error) = match summary {
                Ok(summary) => (
                    Some(summary.lines.percentage),
                    Some(summary.branches.percentage),
                    Some(summary.condition_coverage_pct),
                    None,
                ),
                Err(error) => (None, None, None, Some(error.to_string())),
            };
            let comparison = current_integrity(run)
                .map(|current| compare_run_integrity(Some(&run.metadata.integrity), &current));
            Ok(RunListEntry {
                id: run.id.clone(),
                generated_at: run.metadata.started_at.clone(),
                lines,
                branches,
                mcdc,
                coverage_error,
                command: run.metadata.command.clone(),
                duration_ms: run.metadata.duration_ms,
                timings: run.metadata.timings.clone(),
                test_exit_code: run.metadata.test_exit_code,
                build_reused: run
                    .metadata
                    .instrumented_build_cache
                    .as_ref()
                    .map(|cache| cache.reused),
                raw_evidence: run.metadata.raw_evidence.clone(),
                stale: comparison.as_ref().map(|comparison| comparison.stale),
                reasons: comparison
                    .map(|comparison| comparison.reasons)
                    .unwrap_or_default(),
            })
        })
        .collect::<Result<Vec<_>, _>>()?;
    let page = agent_json::pagination(offset, limit, runs.len(), inventory.runs.len());
    Ok((
        RunListData {
            filters: CoverageQueryFilters {
                outcome: match view {
                    CoverageViewId::All => "all",
                    CoverageViewId::Passed => "passed",
                    CoverageViewId::Failed => "failed",
                }
                .into(),
                kind: None,
                runner: None,
            },
            runs,
        },
        page,
    ))
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        path::{Path, PathBuf},
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use crate::run_store::{
        create_analyzable_test_run, discover_runs, open_or_rebuild_query_index,
    };

    use super::*;

    fn temporary_directory() -> PathBuf {
        // The clock ticks once per microsecond, so two tests that start
        // together drew the same directory and queried each other's runs. The
        // counter is what makes each name its own, and `create_dir` -- not
        // `create_dir_all` -- means a repeat fails here rather than somewhere
        // that reads as a bug in the code under test.
        static UNIQUE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-run-query-{}-{nonce}-{}",
            std::process::id(),
            UNIQUE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&path).unwrap();
        path
    }

    fn create_indexable_run(root: &Path) -> RunInventory {
        create_analyzable_test_run(root, "test-run");
        discover_runs(root).unwrap()
    }

    #[test]
    fn lists_persisted_metadata_and_lazily_builds_the_typed_index() {
        let root = temporary_directory();
        let inventory = create_indexable_run(&root);
        let run = &inventory.runs[0];
        let (listing, page) =
            run_list_query(&inventory, &|_| None, CoverageViewId::All, 0, 20).unwrap();
        assert_eq!(page.total, 1);
        assert_eq!(listing.runs[0].lines, Some(100.0));
        assert_eq!(listing.runs[0].branches, Some(100.0));
        assert_eq!(listing.runs[0].mcdc, Some(100.0));
        assert_eq!(listing.runs[0].coverage_error, None);
        assert!(run.query_index_path.exists());
        assert!(agent_json::success("runs", &listing, Some(&page)).is_ok());

        let (_, empty_page) =
            run_list_query(&inventory, &|_| None, CoverageViewId::All, 20, 20).unwrap();
        assert_eq!(empty_page.returned, 0);
        assert!(!empty_page.has_more);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn reports_staleness_in_contract_order_and_treats_a_bad_index_as_disposable() {
        let root = temporary_directory();
        let inventory = create_indexable_run(&root);
        let run = &inventory.runs[0];
        open_or_rebuild_query_index(run).unwrap();
        fs::write(&run.query_index_path, b"broken disposable index").unwrap();

        let mut current = run.metadata.integrity.clone();
        current.fingerprint.source = "1".repeat(64);
        current.fingerprint.tests = "2".repeat(64);
        let (listing, _) = run_list_query(
            &inventory,
            &|_| Some(current.clone()),
            CoverageViewId::All,
            0,
            20,
        )
        .unwrap();
        assert_eq!(listing.runs[0].lines, Some(100.0));
        assert_eq!(
            listing.runs[0].reasons,
            ["instrumented source changed", "test files changed"]
        );
        assert_ne!(
            fs::read(&run.query_index_path).unwrap(),
            b"broken disposable index"
        );
        fs::remove_dir_all(root).unwrap();
    }
}
