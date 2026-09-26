//! Strict deferred source joining for rustdoc's merged doctest mode.
//!
//! rustdoc compiles an extracted bundle before it compiles the runner that
//! carries each `__doctest_N` module's original path and line. The bundle must
//! therefore publish temporary, run-local identities. This module validates
//! the later runner map and resolves extracted byte ranges back to immutable
//! authored source before the ordinary compiler-manifest parser sees them.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
};

use ra_ap_syntax::{
    AstNode, Edition, SourceFile,
    ast::{self, HasName},
};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::rust_compiler_manifest::{
    RustCompilerManifest, RustCompilerSource, RustCompilerSourceSnapshots,
};
use crate::{
    rust_probe_transport::{
        DEFAULT_DESCRIPTOR_CAPACITY, DEFAULT_PAYLOAD_CAPACITY, RustPhaseContext, RustThreadPhase,
        RustTransportRead, create_rust_transport, read_rust_transport, rust_assertion_context_id,
        rust_thread_context_id, validate_rust_phase_contexts,
    },
    rust_runtime::RustProbeObservation,
    rust_test_context::rust_test_context_id,
};

const MAP_SCHEMA: &str = "supercov-rustdoc-merged-map-v2";
const OUTCOME_SCHEMA: &str = "supercov-rustdoc-outcome-unit-v4";
const RUSTDOC_CATALOG_FORMAT_VERSION: u32 = 2;
const MAX_OUTCOME_UNIT_BYTES: u64 = 16 * 1024 * 1024;
const SOURCE_MODEL: &str = "rust-source-v1";
const RUSTDOC_TRANSPORT_TOKEN_BYTES: usize = supercov_contracts::RUST_PROBE_TRANSPORT_TOKEN_SIZE;

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustdocMergedMap {
    pub schema: String,
    pub group: String,
    pub entries: Vec<RustdocMergedEntry>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustdocMergedEntry {
    pub module: String,
    pub display_name: String,
    pub path: String,
    pub line: u64,
    pub ignored: bool,
    pub no_run: bool,
    pub should_panic: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustdocMappedRange {
    pub source_key: String,
    pub start: u32,
    pub end: u32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustSourceIdentity {
    pub id: String,
    pub canonical: String,
    pub probe_ordinal: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustdocMergedJoin {
    pub manifest: RustCompilerManifest,
    pub sources: RustCompilerSourceSnapshots,
    /// Every temporary bundle identity translated to its final authored ID.
    pub obligation_ids: BTreeMap<String, String>,
    /// Every temporary runtime ordinal translated to its final authored ordinal.
    pub probe_ordinals: BTreeMap<String, String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustdocMergedUnit {
    pub map: RustdocMergedMap,
    /// A map can describe a doctest with no executable source obligations.
    /// Such a test still participates in outcome attribution but needs no
    /// identity or runtime translation.
    pub join: Option<RustdocMergedJoin>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustdocResolvedCandidates {
    pub candidates: Vec<(RustCompilerManifest, RustCompilerSourceSnapshots)>,
    pub merged_units: Vec<RustdocMergedUnit>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "lowercase", deny_unknown_fields)]
pub enum RustdocOutcomeStatus {
    Passed,
    Failed,
    Ignored,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustdocTestOutcome {
    pub display_name: String,
    pub status: RustdocOutcomeStatus,
    pub execution_seconds: Option<f64>,
    pub stdout: Option<String>,
    pub message: Option<String>,
    pub reason: Option<String>,
    /// Libtest's `timeout` event is a long-running-test notification. It does
    /// not itself determine the eventual result.
    pub timeout_warning: bool,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustdocOutcomeReport {
    pub outcomes: Vec<RustdocTestOutcome>,
    pub suites: usize,
    pub planned_tests: u64,
    pub filtered_out: u64,
    /// Tests that emitted `started` but no terminal event before a failed
    /// fail-fast suite ended.
    pub unfinished_started: Vec<String>,
    /// Planned tests for which libtest emitted neither a start nor a terminal
    /// event because a failed suite stopped early.
    pub unstarted_tests: u64,
    pub total_seconds: Option<f64>,
    pub compilation_seconds: Option<f64>,
}

/// The exact JSON catalog emitted by the pinned rustdoc implementation with
/// `-Zunstable-options --output-format=doctest`.
///
/// This is compiler output, not a Supercov reconstruction. Keeping the full
/// versioned record lets the outcome join identify merged, standalone,
/// compile-fail, ignored, no-run and syntax-error doctests without deriving
/// names or execution attributes from human-readable output.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RustdocExtractedCatalog {
    pub format_version: u32,
    pub doctests: Vec<RustdocExtractedDoctest>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RustdocExtractedDoctest {
    pub file: String,
    pub line: u64,
    pub doctest_attributes: RustdocDoctestAttributes,
    pub original_code: String,
    pub doctest_code: Option<RustdocDoctestCode>,
    pub name: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RustdocDoctestAttributes {
    pub original: String,
    pub should_panic: bool,
    pub no_run: bool,
    pub ignore: RustdocDoctestIgnore,
    pub rust: bool,
    pub test_harness: bool,
    pub compile_fail: bool,
    pub standalone_crate: bool,
    pub error_codes: Vec<String>,
    pub edition: Option<String>,
    pub added_css_classes: Vec<String>,
    pub unknown: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub enum RustdocDoctestIgnore {
    All,
    None,
    Some(Vec<String>),
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RustdocDoctestCode {
    pub crate_level: String,
    pub code: String,
    pub wrapper: Option<RustdocDoctestWrapper>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RustdocDoctestWrapper {
    pub before: String,
    pub after: String,
    pub returns_result: bool,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustdocOutcomeUnit {
    pub schema: String,
    pub invocation_id: String,
    pub group: String,
    pub companion_build_id: String,
    pub raw_catalog_sha256: String,
    pub raw_events_sha256: String,
    pub transport_sha256: String,
    pub catalog: RustdocExtractedCatalog,
    pub report: RustdocOutcomeReport,
    pub transport: RustTransportRead,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustdocTransportReservation {
    pub path: PathBuf,
    pub token: [u8; RUSTDOC_TRANSPORT_TOKEN_BYTES],
}

/// The exact execution state for one compiler-described merged doctest.
///
/// A fail-fast libtest suite can stop after announcing its total test count.
/// `Unstarted` is therefore distinct from `Ignored`: it has no terminal
/// outcome and must never be treated as skipped or passing.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase", tag = "state")]
pub enum RustdocJoinedOutcomeState {
    Completed {
        outcome: RustdocTestOutcome,
    },
    UnfinishedStarted,
    Unstarted,
    FilteredOut,
    /// Libtest reports only aggregate filtered and fail-fast-unstarted counts.
    /// If both are non-zero, assigning either state to a particular catalog
    /// identity would be invented attribution.
    NotRunAmbiguous,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustdocJoinedOutcome {
    pub catalog_index: u64,
    pub catalog: RustdocExtractedDoctest,
    pub merged_entry: Option<RustdocMergedEntry>,
    pub state: RustdocJoinedOutcomeState,
}

/// Lossless join of one authenticated rustdoc invocation to every test in its
/// compiler catalog. The optional merged descriptor exists only for tests
/// whose temporary bundle identities need source/probe translation.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustdocOutcomeGroupJoin {
    pub invocation_id: String,
    pub group: String,
    pub companion_build_id: String,
    pub raw_catalog_sha256: String,
    pub raw_events_sha256: String,
    pub transport_sha256: String,
    /// Identity/ordinal translation for the merged bundle. `None` is valid
    /// only when every mapped doctest has zero executable obligations.
    pub join: Option<RustdocMergedJoin>,
    pub transport: RustTransportRead,
    pub entries: Vec<RustdocJoinedOutcome>,
    pub ambiguous_filtered_out: u64,
    pub ambiguous_unstarted_tests: u64,
}

impl RustdocOutcomeGroupJoin {
    pub fn has_ambiguous_outcomes(&self) -> bool {
        self.ambiguous_filtered_out != 0 || self.ambiguous_unstarted_tests != 0
    }

    fn canonical_test_name(&self, entry: &RustdocJoinedOutcome) -> String {
        format!(
            "rustdoc:{}:{}:{}",
            self.group, entry.catalog.file, entry.catalog.line
        )
    }

    fn merged_test_name(&self, entry: &RustdocJoinedOutcome) -> Option<String> {
        entry
            .merged_entry
            .as_ref()
            .map(|merged| format!("rustdoc:{}:{}", self.group, merged.module))
    }

    pub fn attributed_transport(
        &self,
        entry: &RustdocJoinedOutcome,
    ) -> Result<(u64, RustTransportRead), RustdocOutcomeError> {
        let base = rust_test_context_id(&self.canonical_test_name(entry))
            .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
        let mut read = transport_for_root(&self.transport, base)?;
        if let Some(merged_name) = self.merged_test_name(entry) {
            let merged_base = rust_test_context_id(&merged_name)
                .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
            if merged_base == base {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc test context collision between {} and {merged_name}",
                    self.canonical_test_name(entry)
                )));
            }
            let mut merged = transport_for_root(&self.transport, merged_base)?;
            if merged.committed != 0 {
                merged = self
                    .join
                    .as_ref()
                    .ok_or_else(|| {
                        RustdocOutcomeError::Invalid(format!(
                            "merged doctest {} has runtime evidence but no identity translation",
                            entry.catalog.name
                        ))
                    })?
                    .translate_transport(merged_base, &merged)
                    .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
                merged = rebase_transport_root(&merged, merged_base, base)?;
                merge_transport(&mut read, merged)?;
            }
        }
        Ok((base, read))
    }

    /// Background evidence: context-zero records plus every record whose
    /// chain contains a thread phase that escaped its root test. Quarantined
    /// records keep their real contexts; projection must flatten them.
    pub fn background_transport(&self) -> Result<RustTransportRead, RustdocOutcomeError> {
        let parents = phase_parent_map(&self.transport)?;
        let scope = RustdocThreadScope::from_transport(&self.transport)?;
        let quarantined = |context: u64| -> Result<bool, RustdocOutcomeError> {
            let root = root_context(context, &parents)?;
            Ok(!scope.escaped_threads(context, root, &parents)?.is_empty())
        };
        let mut observations = Vec::new();
        for record in &self.transport.observations {
            if record.context_id == 0 || quarantined(record.context_id)? {
                observations.push(record.clone());
            }
        }
        let mut ordinal_hits = Vec::new();
        for record in &self.transport.ordinal_hits {
            if record.context_id == 0 || quarantined(record.context_id)? {
                ordinal_hits.push(*record);
            }
        }
        let mut phases = Vec::new();
        for phase in &self.transport.phases {
            if quarantined(phase.child_context_id)? {
                phases.push(phase.clone());
            }
        }
        let mut thread_phases = Vec::new();
        for phase in &self.transport.thread_phases {
            if quarantined(phase.child_context_id)? {
                thread_phases.push(*phase);
            }
        }
        let mut thread_ends = Vec::new();
        for end in &self.transport.thread_ends {
            if quarantined(end.context_id)? {
                thread_ends.push(*end);
            }
        }
        let committed = u64::try_from(
            observations.len()
                + ordinal_hits.len()
                + phases.len()
                + thread_phases.len()
                + thread_ends.len(),
        )
        .map_err(|_| {
            RustdocOutcomeError::Invalid("rustdoc background transport count exceeds u64".into())
        })?;
        Ok(RustTransportRead {
            committed,
            observations,
            ordinal_hits,
            phases,
            thread_phases,
            thread_ends,
            test_boundaries: Vec::new(),
            incomplete: self.transport.incomplete,
            dropped: self.transport.dropped,
            attachments: self.transport.attachments,
        })
    }

    /// One deterministic note per thread phase whose lifetime escaped its
    /// root test in this invocation's transport.
    pub fn thread_scope_limitations(&self) -> Result<BTreeSet<String>, RustdocOutcomeError> {
        let parents = phase_parent_map(&self.transport)?;
        let scope = RustdocThreadScope::from_transport(&self.transport)?;
        let mut limitations = BTreeSet::new();
        for phase in &self.transport.thread_phases {
            let root = root_context(phase.child_context_id, &parents)?;
            for escaped in scope.escaped_threads(phase.child_context_id, root, &parents)? {
                if escaped == phase.child_context_id {
                    limitations.insert(format!(
                        "RUST_THREAD_OUTLIVED_TEST: thread phase {escaped:016x} escaped test {root:016x}"
                    ));
                }
            }
        }
        Ok(limitations)
    }

    fn validate_transport_ownership(&self) -> Result<(), RustdocOutcomeError> {
        let mut expected = BTreeMap::new();
        for entry in &self.entries {
            let names = std::iter::once(self.canonical_test_name(entry))
                .chain(self.merged_test_name(entry));
            for name in names {
                let context = rust_test_context_id(&name)
                    .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
                if let Some(other) = expected.insert(context, name.clone()) {
                    return Err(RustdocOutcomeError::Invalid(format!(
                        "rustdoc test context {context:016x} collides between {other} and {name}"
                    )));
                }
            }
        }
        let phase_parents = phase_parent_map(&self.transport)?;
        RustdocThreadScope::from_transport(&self.transport)?;
        for boundary in &self.transport.test_boundaries {
            if !expected.contains_key(&boundary.context_id) {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc test boundary {:016x} does not identify a known test",
                    boundary.context_id
                )));
            }
        }
        for context in self
            .transport
            .observations
            .iter()
            .map(|record| record.context_id)
            .chain(
                self.transport
                    .ordinal_hits
                    .iter()
                    .map(|record| record.context_id),
            )
            .chain(
                self.transport
                    .phases
                    .iter()
                    .map(|phase| phase.child_context_id),
            )
            .chain(
                self.transport
                    .thread_phases
                    .iter()
                    .map(|phase| phase.child_context_id),
            )
            .chain(self.transport.thread_ends.iter().map(|end| end.context_id))
            .filter(|context| *context != 0)
        {
            let root = root_context(context, &phase_parents)?;
            if !expected.contains_key(&root) {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc transport context {context:016x} has unknown test root {root:016x}; expected {}",
                    expected
                        .iter()
                        .map(|(context, name)| format!("{context:016x}={name}"))
                        .collect::<Vec<_>>()
                        .join(", ")
                )));
            }
        }
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustdocOutcomeResolution {
    pub groups: Vec<RustdocOutcomeGroupJoin>,
    /// Runner maps for which no authenticated terminal outcome unit exists.
    pub unmatched_maps: Vec<RustdocMergedUnit>,
}

impl RustdocOutcomeResolution {
    pub fn is_fully_catalogued(&self) -> bool {
        self.unmatched_maps.is_empty()
    }

    pub fn has_ambiguous_outcomes(&self) -> bool {
        self.groups
            .iter()
            .any(RustdocOutcomeGroupJoin::has_ambiguous_outcomes)
    }
}

fn phase_parent_map(read: &RustTransportRead) -> Result<BTreeMap<u64, u64>, RustdocOutcomeError> {
    let mut parents = BTreeMap::new();
    for (child, parent) in read
        .phases
        .iter()
        .map(|phase| (phase.child_context_id, phase.parent_context_id))
        .chain(
            read.thread_phases
                .iter()
                .map(|phase| (phase.child_context_id, phase.parent_context_id)),
        )
    {
        if parents.insert(child, parent).is_some() {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc transport repeats phase context {child:016x}"
            )));
        }
    }
    Ok(parents)
}

/// The join-bounded thread acceptance state for one rustdoc invocation's
/// shared transport: which thread phases exist, when each ended, and when
/// each test context committed its boundary.
struct RustdocThreadScope {
    thread_children: BTreeSet<u64>,
    thread_end_index: BTreeMap<u64, u64>,
    boundary_index: BTreeMap<u64, u64>,
}

impl RustdocThreadScope {
    fn from_transport(read: &RustTransportRead) -> Result<Self, RustdocOutcomeError> {
        let thread_children = read
            .thread_phases
            .iter()
            .map(|phase| phase.child_context_id)
            .collect::<BTreeSet<_>>();
        let mut thread_end_index = BTreeMap::new();
        for end in &read.thread_ends {
            if !thread_children.contains(&end.context_id)
                || thread_end_index
                    .insert(end.context_id, end.commit_index)
                    .is_some()
            {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc thread end {:016x} has no unique thread-phase definition",
                    end.context_id
                )));
            }
        }
        let mut boundary_index = BTreeMap::new();
        for boundary in &read.test_boundaries {
            if boundary_index
                .insert(boundary.context_id, boundary.commit_index)
                .is_some()
            {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc test boundary {:016x} is repeated",
                    boundary.context_id
                )));
            }
        }
        Ok(Self {
            thread_children,
            thread_end_index,
            boundary_index,
        })
    }

    /// Thread phases on `context`'s chain whose lifetimes escaped `root`:
    /// every record under such a chain is deterministic background evidence.
    fn escaped_threads(
        &self,
        mut context: u64,
        root: u64,
        parents: &BTreeMap<u64, u64>,
    ) -> Result<Vec<u64>, RustdocOutcomeError> {
        let boundary = self.boundary_index.get(&root).copied();
        let mut escaped = Vec::new();
        let mut seen = BTreeSet::new();
        loop {
            if self.thread_children.contains(&context)
                && !matches!(
                    (self.thread_end_index.get(&context), boundary),
                    (Some(end), Some(boundary)) if *end < boundary
                )
            {
                escaped.push(context);
            }
            let Some(parent) = parents.get(&context) else {
                break;
            };
            if !seen.insert(context) {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc transport phase cycle at {context:016x}"
                )));
            }
            context = *parent;
        }
        Ok(escaped)
    }
}

fn root_context(
    mut context: u64,
    parents: &BTreeMap<u64, u64>,
) -> Result<u64, RustdocOutcomeError> {
    let mut seen = BTreeSet::new();
    while let Some(parent) = parents.get(&context) {
        if !seen.insert(context) {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc transport phase cycle at {context:016x}"
            )));
        }
        context = *parent;
    }
    Ok(context)
}

/// Keep exactly the records whose chain resolves to `expected_root` and whose
/// thread phases all ended before the root's boundary. Records under an
/// escaped thread phase are excluded here and belong to background.
fn transport_for_root(
    read: &RustTransportRead,
    expected_root: u64,
) -> Result<RustTransportRead, RustdocOutcomeError> {
    let parents = phase_parent_map(read)?;
    let scope = RustdocThreadScope::from_transport(read)?;
    let accepts = |context: u64| -> Result<bool, RustdocOutcomeError> {
        if root_context(context, &parents)? != expected_root {
            return Ok(false);
        }
        Ok(scope
            .escaped_threads(context, expected_root, &parents)?
            .is_empty())
    };
    let mut observations = Vec::new();
    for record in &read.observations {
        if record.context_id != 0 && accepts(record.context_id)? {
            observations.push(record.clone());
        }
    }
    let mut ordinal_hits = Vec::new();
    for record in &read.ordinal_hits {
        if record.context_id != 0 && accepts(record.context_id)? {
            ordinal_hits.push(*record);
        }
    }
    let mut phases = Vec::new();
    for phase in &read.phases {
        if accepts(phase.child_context_id)? {
            phases.push(phase.clone());
        }
    }
    let mut thread_phases = Vec::new();
    for phase in &read.thread_phases {
        if accepts(phase.child_context_id)? {
            thread_phases.push(*phase);
        }
    }
    let mut thread_ends = Vec::new();
    for end in &read.thread_ends {
        if accepts(end.context_id)? {
            thread_ends.push(*end);
        }
    }
    let mut test_boundaries = Vec::new();
    for boundary in &read.test_boundaries {
        if boundary.context_id == expected_root {
            test_boundaries.push(*boundary);
        }
    }
    let committed = u64::try_from(
        observations.len()
            + ordinal_hits.len()
            + phases.len()
            + thread_phases.len()
            + thread_ends.len()
            + test_boundaries.len(),
    )
    .map_err(|_| RustdocOutcomeError::Invalid("rustdoc transport count exceeds u64".into()))?;
    Ok(RustTransportRead {
        observations,
        ordinal_hits,
        phases,
        thread_phases,
        thread_ends,
        test_boundaries,
        committed,
        incomplete: 0,
        dropped: 0,
        attachments: 0,
    })
}

enum RustdocPhaseDefinition<'read> {
    Assertion(&'read RustPhaseContext),
    Thread(&'read RustThreadPhase),
}

impl RustdocPhaseDefinition<'_> {
    fn parent_context_id(&self) -> u64 {
        match self {
            Self::Assertion(phase) => phase.parent_context_id,
            Self::Thread(phase) => phase.parent_context_id,
        }
    }
}

fn rustdoc_phase_definitions(
    read: &RustTransportRead,
) -> Result<BTreeMap<u64, RustdocPhaseDefinition<'_>>, RustdocOutcomeError> {
    let mut definitions = BTreeMap::new();
    for phase in &read.phases {
        if definitions
            .insert(
                phase.child_context_id,
                RustdocPhaseDefinition::Assertion(phase),
            )
            .is_some()
        {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc transport has duplicate assertion contexts".into(),
            ));
        }
    }
    for phase in &read.thread_phases {
        if definitions
            .insert(
                phase.child_context_id,
                RustdocPhaseDefinition::Thread(phase),
            )
            .is_some()
        {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc transport has duplicate phase contexts".into(),
            ));
        }
    }
    Ok(definitions)
}

fn rebase_transport_root(
    read: &RustTransportRead,
    old_base: u64,
    new_base: u64,
) -> Result<RustTransportRead, RustdocOutcomeError> {
    validate_rust_phase_contexts(old_base, read)
        .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
    let definitions = rustdoc_phase_definitions(read)?;
    fn translate(
        context: u64,
        old_base: u64,
        new_base: u64,
        definitions: &BTreeMap<u64, RustdocPhaseDefinition<'_>>,
        translated: &mut BTreeMap<u64, u64>,
        visiting: &mut BTreeSet<u64>,
    ) -> Result<u64, RustdocOutcomeError> {
        if context == old_base {
            return Ok(new_base);
        }
        if let Some(context) = translated.get(&context) {
            return Ok(*context);
        }
        if !visiting.insert(context) {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc assertion context cycle at {context:016x}"
            )));
        }
        let phase = definitions.get(&context).ok_or_else(|| {
            RustdocOutcomeError::Invalid(format!(
                "rustdoc context {context:016x} has no phase definition"
            ))
        })?;
        let parent = translate(
            phase.parent_context_id(),
            old_base,
            new_base,
            definitions,
            translated,
            visiting,
        )?;
        let rebased = match phase {
            RustdocPhaseDefinition::Assertion(phase) => {
                rust_assertion_context_id(parent, &phase.decision_id, phase.invocation_nonce)
                    .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?
            }
            RustdocPhaseDefinition::Thread(phase) => {
                rust_thread_context_id(parent, phase.invocation_nonce)
            }
        };
        visiting.remove(&context);
        translated.insert(context, rebased);
        Ok(rebased)
    }
    let mut translated = BTreeMap::from([(old_base, new_base)]);
    let mut visiting = BTreeSet::new();
    for context in definitions.keys() {
        translate(
            *context,
            old_base,
            new_base,
            &definitions,
            &mut translated,
            &mut visiting,
        )?;
    }
    let map_context = |context: u64| {
        translated.get(&context).copied().ok_or_else(|| {
            RustdocOutcomeError::Invalid(format!(
                "rustdoc record context {context:016x} was not rebased"
            ))
        })
    };
    let mut rebased = read.clone();
    for observation in &mut rebased.observations {
        observation.context_id = map_context(observation.context_id)?;
    }
    for hit in &mut rebased.ordinal_hits {
        hit.context_id = map_context(hit.context_id)?;
    }
    for phase in &mut rebased.phases {
        phase.child_context_id = map_context(phase.child_context_id)?;
        phase.parent_context_id = map_context(phase.parent_context_id)?;
    }
    for phase in &mut rebased.thread_phases {
        phase.child_context_id = map_context(phase.child_context_id)?;
        phase.parent_context_id = map_context(phase.parent_context_id)?;
    }
    for end in &mut rebased.thread_ends {
        end.context_id = map_context(end.context_id)?;
    }
    for boundary in &mut rebased.test_boundaries {
        boundary.context_id = map_context(boundary.context_id)?;
    }
    validate_rust_phase_contexts(new_base, &rebased)
        .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
    Ok(rebased)
}

fn merge_transport(
    destination: &mut RustTransportRead,
    source: RustTransportRead,
) -> Result<(), RustdocOutcomeError> {
    let mut phase_ids = destination
        .phases
        .iter()
        .map(|phase| phase.child_context_id)
        .chain(
            destination
                .thread_phases
                .iter()
                .map(|phase| phase.child_context_id),
        )
        .collect::<BTreeSet<_>>();
    if source
        .phases
        .iter()
        .map(|phase| phase.child_context_id)
        .chain(
            source
                .thread_phases
                .iter()
                .map(|phase| phase.child_context_id),
        )
        .any(|child| !phase_ids.insert(child))
    {
        return Err(RustdocOutcomeError::Invalid(
            "rustdoc standalone and merged assertion contexts collide".into(),
        ));
    }
    let mut end_ids = destination
        .thread_ends
        .iter()
        .map(|end| end.context_id)
        .collect::<BTreeSet<_>>();
    if source
        .thread_ends
        .iter()
        .any(|end| !end_ids.insert(end.context_id))
    {
        return Err(RustdocOutcomeError::Invalid(
            "rustdoc standalone and merged thread ends collide".into(),
        ));
    }
    let mut boundary_ids = destination
        .test_boundaries
        .iter()
        .map(|boundary| boundary.context_id)
        .collect::<BTreeSet<_>>();
    if source
        .test_boundaries
        .iter()
        .any(|boundary| !boundary_ids.insert(boundary.context_id))
    {
        return Err(RustdocOutcomeError::Invalid(
            "rustdoc standalone and merged test boundaries collide".into(),
        ));
    }
    destination.committed = destination
        .committed
        .checked_add(source.committed)
        .ok_or_else(|| RustdocOutcomeError::Invalid("rustdoc committed count overflow".into()))?;
    destination.observations.extend(source.observations);
    destination.ordinal_hits.extend(source.ordinal_hits);
    destination.phases.extend(source.phases);
    destination.thread_phases.extend(source.thread_phases);
    destination.thread_ends.extend(source.thread_ends);
    destination.test_boundaries.extend(source.test_boundaries);
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustdocOutcomeError {
    Io { path: PathBuf, reason: String },
    Json(String),
    Invalid(String),
}

impl std::fmt::Display for RustdocOutcomeError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::Json(reason) => write!(formatter, "invalid rustdoc outcome JSON: {reason}"),
            Self::Invalid(reason) => write!(formatter, "invalid rustdoc outcome: {reason}"),
        }
    }
}

impl std::error::Error for RustdocOutcomeError {}

#[derive(Debug, Clone, Default, PartialEq)]
enum StrictField<T> {
    #[default]
    Missing,
    Value(T),
}

impl<'de, T: Deserialize<'de>> Deserialize<'de> for StrictField<T> {
    fn deserialize<D: serde::Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        T::deserialize(deserializer).map(Self::Value)
    }
}

impl<T> StrictField<T> {
    fn take(self) -> Option<T> {
        match self {
            Self::Missing => None,
            Self::Value(value) => Some(value),
        }
    }

    fn is_missing(&self) -> bool {
        matches!(self, Self::Missing)
    }
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
struct RawLibtestEvent {
    #[serde(rename = "type")]
    kind: String,
    #[serde(default)]
    event: StrictField<String>,
    #[serde(default)]
    name: StrictField<String>,
    #[serde(default)]
    test_count: StrictField<u64>,
    #[serde(default)]
    shuffle_seed: StrictField<u64>,
    #[serde(default)]
    passed: StrictField<u64>,
    #[serde(default)]
    failed: StrictField<u64>,
    #[serde(default)]
    ignored: StrictField<u64>,
    #[serde(default)]
    measured: StrictField<u64>,
    #[serde(default)]
    filtered_out: StrictField<u64>,
    #[serde(default)]
    exec_time: StrictField<f64>,
    #[serde(default)]
    stdout: StrictField<String>,
    #[serde(default)]
    message: StrictField<String>,
    #[serde(default)]
    reason: StrictField<String>,
    #[serde(default)]
    total_time: StrictField<f64>,
    #[serde(default)]
    compilation_time: StrictField<f64>,
}

impl RawLibtestEvent {
    fn has_only(&self, fields: &[&str]) -> bool {
        let present = [
            ("event", !self.event.is_missing()),
            ("name", !self.name.is_missing()),
            ("test_count", !self.test_count.is_missing()),
            ("shuffle_seed", !self.shuffle_seed.is_missing()),
            ("passed", !self.passed.is_missing()),
            ("failed", !self.failed.is_missing()),
            ("ignored", !self.ignored.is_missing()),
            ("measured", !self.measured.is_missing()),
            ("filtered_out", !self.filtered_out.is_missing()),
            ("exec_time", !self.exec_time.is_missing()),
            ("stdout", !self.stdout.is_missing()),
            ("message", !self.message.is_missing()),
            ("reason", !self.reason.is_missing()),
            ("total_time", !self.total_time.is_missing()),
            ("compilation_time", !self.compilation_time.is_missing()),
        ];
        present
            .into_iter()
            .all(|(field, present)| !present || fields.contains(&field))
    }
}

#[derive(Debug)]
struct ActiveSuite {
    expected: u64,
    outcomes: BTreeMap<String, RustdocOutcomeStatus>,
    started: BTreeSet<String>,
    timed_out: BTreeSet<String>,
}

fn nonnegative_finite(value: Option<f64>) -> bool {
    value.is_none_or(|value| value.is_finite() && value >= 0.0)
}

/// Parse the exact JSON event stream emitted by the pinned Rust libtest
/// formatter. The parser validates field shapes, event ordering, terminal
/// uniqueness and suite arithmetic; a truncated or future-incompatible stream
/// cannot silently become passing coverage.
pub fn parse_rustdoc_libtest_json(bytes: &[u8]) -> Result<RustdocOutcomeReport, RustdocJoinError> {
    let source =
        std::str::from_utf8(bytes).map_err(|error| RustdocJoinError::Json(error.to_string()))?;
    let mut active: Option<ActiveSuite> = None;
    let mut outcomes = BTreeMap::<String, RustdocTestOutcome>::new();
    let mut suites = 0_usize;
    let mut planned_tests = 0_u64;
    let mut filtered_out = 0_u64;
    let mut unfinished_started = BTreeSet::new();
    let mut unstarted_tests = 0_u64;
    let mut report = None;
    for (index, line) in source.lines().enumerate() {
        if line.trim().is_empty() {
            return Err(RustdocJoinError::Json(format!(
                "libtest event {} is empty",
                index + 1
            )));
        }
        let raw: RawLibtestEvent = serde_json::from_str(line).map_err(|error| {
            RustdocJoinError::Json(format!("libtest event {}: {error}", index + 1))
        })?;
        let event = raw.event.clone().take();
        match (raw.kind.as_str(), event.as_deref()) {
            ("suite", Some("started")) => {
                if active.is_some()
                    || report.is_some()
                    || !raw.has_only(&["event", "test_count", "shuffle_seed"])
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest suite start {} is out of order or malformed",
                        index + 1
                    )));
                }
                let expected = raw.test_count.take().ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest suite start has no test count".into())
                })?;
                active = Some(ActiveSuite {
                    expected,
                    outcomes: BTreeMap::new(),
                    started: BTreeSet::new(),
                    timed_out: BTreeSet::new(),
                });
            }
            ("test", Some("started")) => {
                if !raw.has_only(&["event", "name"]) {
                    return Err(RustdocJoinError::Invalid(
                        "libtest test start has unexpected fields".into(),
                    ));
                }
                let name = raw
                    .name
                    .take()
                    .filter(|name| !name.is_empty())
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid("libtest test start has no name".into())
                    })?;
                let suite = active.as_mut().ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest test started outside a suite".into())
                })?;
                if !suite.started.insert(name.clone()) || suite.outcomes.contains_key(&name) {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} started more than once"
                    )));
                }
            }
            ("test", Some("timeout")) => {
                if !raw.has_only(&["event", "name"]) {
                    return Err(RustdocJoinError::Invalid(
                        "libtest timeout has unexpected fields".into(),
                    ));
                }
                let name = raw
                    .name
                    .take()
                    .filter(|name| !name.is_empty())
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid("libtest timeout has no name".into())
                    })?;
                let suite = active.as_mut().ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest timeout is outside a suite".into())
                })?;
                if !suite.started.contains(&name) || !suite.timed_out.insert(name.clone()) {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest timeout for {name} has no unique start"
                    )));
                }
            }
            ("test", Some(status @ ("ok" | "failed" | "ignored"))) => {
                if !raw.has_only(&["event", "name", "exec_time", "stdout", "message", "reason"]) {
                    return Err(RustdocJoinError::Invalid(
                        "libtest terminal test event has unexpected fields".into(),
                    ));
                }
                let name = raw
                    .name
                    .take()
                    .filter(|name| !name.is_empty())
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid("libtest terminal event has no name".into())
                    })?;
                let execution_seconds = raw.exec_time.take();
                if !nonnegative_finite(execution_seconds) {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} has invalid execution time"
                    )));
                }
                let message = raw.message.take();
                let reason = raw.reason.take();
                if (status == "ok" && (message.is_some() || reason.is_some()))
                    || (status == "ignored" && reason.is_some())
                    || (status == "failed" && message.is_some() && reason.is_some())
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} has impossible terminal details"
                    )));
                }
                let status = match status {
                    "ok" => RustdocOutcomeStatus::Passed,
                    "failed" => RustdocOutcomeStatus::Failed,
                    "ignored" => RustdocOutcomeStatus::Ignored,
                    _ => unreachable!(),
                };
                let suite = active.as_mut().ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest result is outside a suite".into())
                })?;
                if !suite.started.contains(&name) {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} has a terminal result without a start"
                    )));
                }
                if suite.outcomes.insert(name.clone(), status).is_some()
                    || outcomes.contains_key(&name)
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} has more than one terminal result"
                    )));
                }
                if reason
                    .as_deref()
                    .is_some_and(|reason| reason != "time limit exceeded")
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "libtest test {name} has an unknown failure reason"
                    )));
                }
                let timeout_warning = suite.timed_out.contains(&name);
                let stdout = raw.stdout.take();
                if status == RustdocOutcomeStatus::Ignored
                    && (execution_seconds.is_some() || stdout.is_some())
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "ignored libtest {name} has impossible execution details"
                    )));
                }
                outcomes.insert(
                    name.clone(),
                    RustdocTestOutcome {
                        display_name: name,
                        status,
                        execution_seconds,
                        stdout,
                        message,
                        reason,
                        timeout_warning,
                    },
                );
            }
            ("suite", Some(status @ ("ok" | "failed"))) => {
                if !raw.has_only(&[
                    "event",
                    "passed",
                    "failed",
                    "ignored",
                    "measured",
                    "filtered_out",
                    "exec_time",
                ]) {
                    return Err(RustdocJoinError::Invalid(
                        "libtest suite result has unexpected fields".into(),
                    ));
                }
                let suite = active.take().ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest suite ended without a start".into())
                })?;
                let passed = raw.passed.take();
                let failed = raw.failed.take();
                let ignored = raw.ignored.take();
                let measured = raw.measured.take();
                let filtered = raw.filtered_out.take();
                let execution = raw.exec_time.take();
                if passed.is_none()
                    || failed.is_none()
                    || ignored.is_none()
                    || measured.is_none()
                    || filtered.is_none()
                    || !nonnegative_finite(execution)
                {
                    return Err(RustdocJoinError::Invalid(
                        "libtest suite result is incomplete".into(),
                    ));
                }
                let actual_passed = suite
                    .outcomes
                    .values()
                    .filter(|outcome| **outcome == RustdocOutcomeStatus::Passed)
                    .count() as u64;
                let actual_failed = suite
                    .outcomes
                    .values()
                    .filter(|outcome| **outcome == RustdocOutcomeStatus::Failed)
                    .count() as u64;
                let actual_ignored = suite
                    .outcomes
                    .values()
                    .filter(|outcome| **outcome == RustdocOutcomeStatus::Ignored)
                    .count() as u64;
                let actual_completed = actual_passed + actual_failed + actual_ignored;
                let suite_unfinished = suite
                    .started
                    .iter()
                    .filter(|name| !suite.outcomes.contains_key(*name))
                    .cloned()
                    .collect::<BTreeSet<_>>();
                if suite.expected < suite.started.len() as u64
                    || suite.expected < actual_completed
                    || actual_completed != suite.outcomes.len() as u64
                {
                    return Err(RustdocJoinError::Invalid(
                        "libtest suite contains more events than planned tests".into(),
                    ));
                }
                let stopped_early = actual_completed != suite.expected;
                if passed != Some(actual_passed)
                    || failed != Some(actual_failed)
                    || ignored != Some(actual_ignored)
                    || measured != Some(0)
                    || (status == "ok") != (actual_failed == 0)
                    || (stopped_early && actual_failed == 0)
                {
                    return Err(RustdocJoinError::Invalid(
                        "libtest suite arithmetic does not match terminal events".into(),
                    ));
                }
                planned_tests = planned_tests.checked_add(suite.expected).ok_or_else(|| {
                    RustdocJoinError::Invalid("libtest planned-test count overflow".into())
                })?;
                filtered_out = filtered_out
                    .checked_add(filtered.expect("validated above"))
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid("libtest filtered-test count overflow".into())
                    })?;
                unstarted_tests = unstarted_tests
                    .checked_add(
                        suite
                            .expected
                            .checked_sub(suite.started.len() as u64)
                            .expect("event count validated above"),
                    )
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid("libtest unstarted-test count overflow".into())
                    })?;
                for name in suite_unfinished {
                    if !unfinished_started.insert(name.clone()) {
                        return Err(RustdocJoinError::Invalid(format!(
                            "libtest unfinished test {name} appeared in more than one suite"
                        )));
                    }
                }
                suites += 1;
            }
            ("report", None) => {
                if active.is_some()
                    || suites == 0
                    || report.is_some()
                    || !raw.has_only(&["total_time", "compilation_time"])
                {
                    return Err(RustdocJoinError::Invalid(
                        "libtest merged report is out of order or malformed".into(),
                    ));
                }
                let total = raw.total_time.take();
                let compilation = raw.compilation_time.take();
                if total.is_none()
                    || compilation.is_none()
                    || !nonnegative_finite(total)
                    || !nonnegative_finite(compilation)
                    || compilation > total
                {
                    return Err(RustdocJoinError::Invalid(
                        "libtest merged report has invalid timings".into(),
                    ));
                }
                report = Some((total, compilation));
            }
            _ => {
                return Err(RustdocJoinError::Invalid(format!(
                    "unsupported libtest event {} ({:?})",
                    raw.kind, event
                )));
            }
        }
    }
    if active.is_some() || suites == 0 {
        return Err(RustdocJoinError::Invalid(
            "libtest event stream is truncated or contains no suite".into(),
        ));
    }
    let (total_seconds, compilation_seconds) = report.unwrap_or((None, None));
    let report = RustdocOutcomeReport {
        outcomes: outcomes.into_values().collect(),
        suites,
        planned_tests,
        filtered_out,
        unfinished_started: unfinished_started.into_iter().collect(),
        unstarted_tests,
        total_seconds,
        compilation_seconds,
    };
    report
        .validate()
        .map_err(|error| RustdocJoinError::Invalid(error.to_string()))?;
    Ok(report)
}

fn canonical_sha256(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

impl RustdocOutcomeReport {
    pub fn validate(&self) -> Result<(), RustdocOutcomeError> {
        if self.suites == 0
            || !nonnegative_finite(self.total_seconds)
            || !nonnegative_finite(self.compilation_seconds)
            || self.total_seconds.is_some() != self.compilation_seconds.is_some()
            || self.compilation_seconds > self.total_seconds
        {
            return Err(RustdocOutcomeError::Invalid(
                "report has invalid suite or timing metadata".into(),
            ));
        }
        let mut previous = None;
        let mut completed = BTreeSet::new();
        let mut has_failure = false;
        for outcome in &self.outcomes {
            if outcome.display_name.trim().is_empty()
                || outcome.display_name.chars().any(char::is_control)
                || previous.is_some_and(|previous| previous >= outcome.display_name.as_str())
                || !completed.insert(outcome.display_name.as_str())
                || !nonnegative_finite(outcome.execution_seconds)
            {
                return Err(RustdocOutcomeError::Invalid(
                    "report outcomes are malformed, duplicated or unsorted".into(),
                ));
            }
            previous = Some(outcome.display_name.as_str());
            match outcome.status {
                RustdocOutcomeStatus::Passed
                    if outcome.message.is_some() || outcome.reason.is_some() =>
                {
                    return Err(RustdocOutcomeError::Invalid(format!(
                        "passed doctest {} has failure details",
                        outcome.display_name
                    )));
                }
                RustdocOutcomeStatus::Failed => {
                    has_failure = true;
                    if (outcome.message.is_some() && outcome.reason.is_some())
                        || outcome
                            .reason
                            .as_deref()
                            .is_some_and(|reason| reason != "time limit exceeded")
                    {
                        return Err(RustdocOutcomeError::Invalid(format!(
                            "failed doctest {} has incompatible details",
                            outcome.display_name
                        )));
                    }
                }
                RustdocOutcomeStatus::Ignored
                    if outcome.execution_seconds.is_some()
                        || outcome.stdout.is_some()
                        || outcome.reason.is_some() =>
                {
                    return Err(RustdocOutcomeError::Invalid(format!(
                        "ignored doctest {} has execution details",
                        outcome.display_name
                    )));
                }
                _ => {}
            }
        }
        let mut previous: Option<&str> = None;
        for name in &self.unfinished_started {
            if name.trim().is_empty()
                || name.chars().any(char::is_control)
                || previous.is_some_and(|previous| previous >= name.as_str())
                || completed.contains(name.as_str())
            {
                return Err(RustdocOutcomeError::Invalid(
                    "unfinished doctest identities are malformed, duplicated or completed".into(),
                ));
            }
            previous = Some(name.as_str());
        }
        let completed = u64::try_from(self.outcomes.len()).map_err(|_| {
            RustdocOutcomeError::Invalid("completed doctest count exceeds u64".into())
        })?;
        let unfinished = u64::try_from(self.unfinished_started.len()).map_err(|_| {
            RustdocOutcomeError::Invalid("unfinished doctest count exceeds u64".into())
        })?;
        let accounted = completed
            .checked_add(unfinished)
            .and_then(|count| count.checked_add(self.unstarted_tests))
            .ok_or_else(|| RustdocOutcomeError::Invalid("doctest count overflow".into()))?;
        if accounted != self.planned_tests
            || ((unfinished != 0 || self.unstarted_tests != 0) && !has_failure)
        {
            return Err(RustdocOutcomeError::Invalid(
                "planned, completed and fail-fast doctest counts disagree".into(),
            ));
        }
        Ok(())
    }
}

fn clean_catalog_text(value: &str) -> bool {
    !value.is_empty() && !value.chars().any(char::is_control)
}

fn clean_catalog_values(values: &[String]) -> bool {
    values.iter().all(|value| clean_catalog_text(value))
}

impl RustdocExtractedCatalog {
    pub fn parse(bytes: &[u8]) -> Result<Self, RustdocOutcomeError> {
        let catalog: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustdocOutcomeError::Json(format!("rustdoc catalog: {error}")))?;
        catalog.validate()?;
        Ok(catalog)
    }

    pub fn validate(&self) -> Result<(), RustdocOutcomeError> {
        if self.format_version != RUSTDOC_CATALOG_FORMAT_VERSION {
            return Err(RustdocOutcomeError::Invalid(format!(
                "unsupported rustdoc doctest catalog format {}",
                self.format_version
            )));
        }
        let mut names = BTreeSet::new();
        let mut source_sites = BTreeSet::new();
        for doctest in &self.doctests {
            doctest.validate()?;
            if !names.insert(doctest.name.as_str()) {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc catalog contains duplicate doctest name {}",
                    doctest.name
                )));
            }
            if !source_sites.insert((doctest.file.as_str(), doctest.line)) {
                return Err(RustdocOutcomeError::Invalid(format!(
                    "rustdoc catalog contains duplicate source site {}:{}",
                    doctest.file, doctest.line
                )));
            }
        }
        Ok(())
    }
}

impl RustdocExtractedDoctest {
    fn validate(&self) -> Result<(), RustdocOutcomeError> {
        if !clean_catalog_text(&self.file) || self.line == 0 || !clean_catalog_text(&self.name) {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc catalog contains an invalid file, line or name".into(),
            ));
        }
        let prefix = format!("{} - ", self.file);
        let suffix = format!("(line {})", self.line);
        if !self.name.starts_with(&prefix) || !self.name.ends_with(&suffix) {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc catalog name {} does not bind to {}:{}",
                self.name, self.file, self.line
            )));
        }
        let attributes = &self.doctest_attributes;
        if !matches!(
            attributes.edition.as_deref(),
            None | Some("2015" | "2018" | "2021" | "2024")
        ) || !clean_catalog_values(&attributes.error_codes)
            || !clean_catalog_values(&attributes.added_css_classes)
            || !clean_catalog_values(&attributes.unknown)
            || matches!(&attributes.ignore, RustdocDoctestIgnore::Some(targets) if targets.is_empty() || !clean_catalog_values(targets))
        {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc catalog attributes are invalid for {}",
                self.name
            )));
        }
        Ok(())
    }

    fn ignored(&self) -> bool {
        !matches!(self.doctest_attributes.ignore, RustdocDoctestIgnore::None)
    }
}

impl RustdocOutcomeUnit {
    pub fn validate(&self) -> Result<(), RustdocOutcomeError> {
        if self.schema != OUTCOME_SCHEMA
            || !canonical_sha256(&self.invocation_id)
            || !safe_group(&self.group)
            || !canonical_sha256(&self.companion_build_id)
            || !canonical_sha256(&self.raw_catalog_sha256)
            || !canonical_sha256(&self.raw_events_sha256)
            || !canonical_sha256(&self.transport_sha256)
        {
            return Err(RustdocOutcomeError::Invalid(
                "outcome unit has an unsupported schema or invalid identity binding".into(),
            ));
        }
        self.catalog.validate()?;
        self.report.validate()?;
        let transport_bytes = serde_json::to_vec(&self.transport)
            .map_err(|error| RustdocOutcomeError::Json(error.to_string()))?;
        if self.transport_sha256 != format!("{:x}", Sha256::digest(&transport_bytes)) {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc transport digest does not match its authenticated snapshot".into(),
            ));
        }
        let committed = u64::try_from(
            self.transport.observations.len()
                + self.transport.ordinal_hits.len()
                + self.transport.phases.len()
                + self.transport.thread_phases.len()
                + self.transport.thread_ends.len()
                + self.transport.test_boundaries.len(),
        )
        .map_err(|_| RustdocOutcomeError::Invalid("rustdoc transport count exceeds u64".into()))?;
        if committed != self.transport.committed {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc transport committed count disagrees with its records".into(),
            ));
        }
        let mut children = BTreeSet::new();
        for phase in &self.transport.phases {
            if !children.insert(phase.child_context_id)
                || rust_assertion_context_id(
                    phase.parent_context_id,
                    &phase.decision_id,
                    phase.invocation_nonce,
                )
                .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?
                    != phase.child_context_id
            {
                return Err(RustdocOutcomeError::Invalid(
                    "rustdoc transport contains an invalid or duplicate phase context".into(),
                ));
            }
        }
        for phase in &self.transport.thread_phases {
            if !children.insert(phase.child_context_id)
                || rust_thread_context_id(phase.parent_context_id, phase.invocation_nonce)
                    != phase.child_context_id
            {
                return Err(RustdocOutcomeError::Invalid(
                    "rustdoc transport contains an invalid or duplicate thread phase context"
                        .into(),
                ));
            }
        }
        Ok(())
    }
}

pub fn rustdoc_outcome_unit_from_libtest(
    invocation_id: String,
    group: String,
    companion_build_id: String,
    raw_catalog: &[u8],
    raw_events: &[u8],
    transport: RustTransportRead,
) -> Result<RustdocOutcomeUnit, RustdocOutcomeError> {
    let catalog = RustdocExtractedCatalog::parse(raw_catalog)?;
    let report = parse_rustdoc_libtest_json(raw_events)
        .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
    let transport_bytes = serde_json::to_vec(&transport)
        .map_err(|error| RustdocOutcomeError::Json(error.to_string()))?;
    let unit = RustdocOutcomeUnit {
        schema: OUTCOME_SCHEMA.into(),
        invocation_id,
        group,
        companion_build_id,
        raw_catalog_sha256: format!("{:x}", Sha256::digest(raw_catalog)),
        raw_events_sha256: format!("{:x}", Sha256::digest(raw_events)),
        transport_sha256: format!("{:x}", Sha256::digest(&transport_bytes)),
        catalog,
        report,
        transport,
    };
    unit.validate()?;
    Ok(unit)
}

/// Decode the private launcher-to-engine frame: an eight-byte big-endian
/// catalog length, the exact catalog bytes, then the exact libtest JSONL
/// bytes. The hashes in the published unit bind both compiler outputs.
pub fn rustdoc_outcome_unit_from_framed_input(
    invocation_id: String,
    group: String,
    companion_build_id: String,
    input: &[u8],
    transport: RustTransportRead,
) -> Result<RustdocOutcomeUnit, RustdocOutcomeError> {
    let length = input.get(..8).ok_or_else(|| {
        RustdocOutcomeError::Invalid("rustdoc outcome input has no catalog frame".into())
    })?;
    let catalog_length = usize::try_from(u64::from_be_bytes(
        length
            .try_into()
            .expect("checked eight-byte catalog length"),
    ))
    .map_err(|_| {
        RustdocOutcomeError::Invalid("rustdoc outcome catalog length exceeds this platform".into())
    })?;
    let catalog_end = 8usize.checked_add(catalog_length).ok_or_else(|| {
        RustdocOutcomeError::Invalid("rustdoc outcome catalog frame length overflow".into())
    })?;
    let catalog = input.get(8..catalog_end).ok_or_else(|| {
        RustdocOutcomeError::Invalid("rustdoc outcome catalog frame is truncated".into())
    })?;
    let events = input.get(catalog_end..).ok_or_else(|| {
        RustdocOutcomeError::Invalid("rustdoc outcome event frame is missing".into())
    })?;
    if catalog.is_empty() || events.is_empty() {
        return Err(RustdocOutcomeError::Invalid(
            "rustdoc outcome catalog and event frames must both be non-empty".into(),
        ));
    }
    rustdoc_outcome_unit_from_libtest(
        invocation_id,
        group,
        companion_build_id,
        catalog,
        events,
        transport,
    )
}

fn outcome_io(path: &Path, error: impl std::fmt::Display) -> RustdocOutcomeError {
    RustdocOutcomeError::Io {
        path: path.to_path_buf(),
        reason: error.to_string(),
    }
}

fn validate_outcome_directory(directory: &Path) -> Result<(), RustdocOutcomeError> {
    let metadata = fs::symlink_metadata(directory).map_err(|error| outcome_io(directory, error))?;
    if !metadata.file_type().is_dir() {
        return Err(outcome_io(
            directory,
            "rustdoc outcome destination is not a non-symlink directory",
        ));
    }
    Ok(())
}

pub fn reserve_rustdoc_transport(
    directory: &Path,
    invocation_id: &str,
) -> Result<RustdocTransportReservation, RustdocOutcomeError> {
    validate_outcome_directory(directory)?;
    if !canonical_sha256(invocation_id) {
        return Err(RustdocOutcomeError::Invalid(
            "rustdoc transport invocation identity is invalid".into(),
        ));
    }
    let path = directory.join(format!("doctest-transport-{invocation_id}.mmap"));
    let mut token = [0_u8; RUSTDOC_TRANSPORT_TOKEN_BYTES];
    getrandom::fill(&mut token).map_err(|error| RustdocOutcomeError::Io {
        path: path.clone(),
        reason: error.to_string(),
    })?;
    create_rust_transport(
        &path,
        token,
        DEFAULT_DESCRIPTOR_CAPACITY,
        DEFAULT_PAYLOAD_CAPACITY,
    )
    .map_err(|error| outcome_io(&path, error))?;
    Ok(RustdocTransportReservation { path, token })
}

pub fn rustdoc_transport_token_hex(token: &[u8; RUSTDOC_TRANSPORT_TOKEN_BYTES]) -> String {
    token.iter().map(|byte| format!("{byte:02x}")).collect()
}

pub fn read_reserved_rustdoc_transport(
    path: &Path,
    token_hex: &str,
) -> Result<RustTransportRead, RustdocOutcomeError> {
    if token_hex.len() != RUSTDOC_TRANSPORT_TOKEN_BYTES * 2
        || !token_hex.bytes().all(|byte| byte.is_ascii_hexdigit())
    {
        return Err(outcome_io(path, "rustdoc transport token is invalid"));
    }
    let mut token = [0_u8; RUSTDOC_TRANSPORT_TOKEN_BYTES];
    for (index, byte) in token.iter_mut().enumerate() {
        *byte = u8::from_str_radix(&token_hex[index * 2..index * 2 + 2], 16)
            .map_err(|error| outcome_io(path, error))?;
    }
    read_rust_transport(path, &token).map_err(|error| outcome_io(path, error))
}

pub fn publish_rustdoc_outcome_unit(
    directory: &Path,
    unit: &RustdocOutcomeUnit,
) -> Result<PathBuf, RustdocOutcomeError> {
    unit.validate()?;
    validate_outcome_directory(directory)?;
    let name = format!("doctest-outcome-{}.json", unit.invocation_id);
    let destination = directory.join(&name);
    let partial = directory.join(format!(".{name}.partial"));
    let bytes =
        serde_json::to_vec(unit).map_err(|error| RustdocOutcomeError::Json(error.to_string()))?;
    let publication = (|| {
        if fs::symlink_metadata(&destination).is_ok() {
            return Err(outcome_io(&destination, "outcome unit already exists"));
        }
        let mut options = OpenOptions::new();
        options.create_new(true).write(true);
        #[cfg(unix)]
        {
            use std::os::unix::fs::OpenOptionsExt as _;
            options.mode(0o600);
        }
        let mut output = options
            .open(&partial)
            .map_err(|error| outcome_io(&partial, error))?;
        output
            .write_all(&bytes)
            .and_then(|()| output.sync_all())
            .map_err(|error| outcome_io(&partial, error))?;
        if fs::symlink_metadata(&destination).is_ok() {
            return Err(outcome_io(
                &destination,
                "outcome unit appeared during publication",
            ));
        }
        fs::rename(&partial, &destination).map_err(|error| outcome_io(&destination, error))?;
        crate::lifecycle::sync_directory_handle(directory)
            .map_err(|error| outcome_io(directory, error))?;
        Ok(destination.clone())
    })();
    if publication.is_err() {
        let _ = fs::remove_file(&partial);
    }
    publication
}

pub fn read_rustdoc_outcome_units(
    directory: &Path,
) -> Result<Vec<RustdocOutcomeUnit>, RustdocOutcomeError> {
    validate_outcome_directory(directory)?;
    let mut units = BTreeMap::new();
    for entry in fs::read_dir(directory)
        .map_err(|error| outcome_io(directory, error))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| outcome_io(directory, error))?
    {
        let path = entry.path();
        let Some(name) = entry.file_name().to_str().map(str::to_owned) else {
            return Err(RustdocOutcomeError::Invalid(
                "rustdoc outcome directory contains a non-UTF-8 name".into(),
            ));
        };
        let relevant =
            name.starts_with("doctest-outcome-") || name.starts_with(".doctest-outcome-");
        if !relevant {
            continue;
        }
        let file_type = entry
            .file_type()
            .map_err(|error| outcome_io(&path, error))?;
        if !file_type.is_file() {
            return Err(outcome_io(
                &path,
                "rustdoc outcome artifact is not a regular file",
            ));
        }
        let Some(invocation_id) = name
            .strip_prefix("doctest-outcome-")
            .and_then(|name| name.strip_suffix(".json"))
            .filter(|identity| canonical_sha256(identity))
        else {
            return Err(RustdocOutcomeError::Invalid(format!(
                "unrecognized or incomplete rustdoc outcome artifact {name}"
            )));
        };
        let metadata = entry.metadata().map_err(|error| outcome_io(&path, error))?;
        if metadata.len() == 0 || metadata.len() > MAX_OUTCOME_UNIT_BYTES {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc outcome artifact {name} has invalid size"
            )));
        }
        let bytes = fs::read(&path).map_err(|error| outcome_io(&path, error))?;
        let unit: RustdocOutcomeUnit = serde_json::from_slice(&bytes)
            .map_err(|error| RustdocOutcomeError::Json(format!("{name}: {error}")))?;
        unit.validate()?;
        if unit.invocation_id != invocation_id {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc outcome filename does not match {}",
                unit.invocation_id
            )));
        }
        if units.insert(invocation_id.to_owned(), unit).is_some() {
            return Err(RustdocOutcomeError::Invalid(format!(
                "duplicate rustdoc outcome invocation {invocation_id}"
            )));
        }
    }
    Ok(units.into_values().collect())
}

/// Join rustdoc's authoritative extracted catalog, compiler-described merged
/// doctests and authenticated libtest outcomes without guessing identities.
///
/// The extracted catalog names every merged, standalone and compile-fail
/// doctest. The compiler map is required only for merged source/probe identity
/// translation. Libtest's filtered and fail-fast-unstarted counts are
/// aggregate-only; when both are non-zero the affected catalog entries remain
/// explicitly ambiguous instead of receiving an invented status.
pub fn join_rustdoc_outcomes(
    merged_units: Vec<RustdocMergedUnit>,
    outcome_units: Vec<RustdocOutcomeUnit>,
) -> Result<RustdocOutcomeResolution, RustdocOutcomeError> {
    let mut maps = BTreeMap::new();
    for unit in merged_units {
        unit.map
            .validate()
            .map_err(|error| RustdocOutcomeError::Invalid(error.to_string()))?;
        let group = unit.map.group.clone();
        if maps.insert(group.clone(), unit).is_some() {
            return Err(RustdocOutcomeError::Invalid(format!(
                "duplicate merged rustdoc outcome group {group}"
            )));
        }
    }

    let mut outcomes = BTreeMap::new();
    for unit in outcome_units {
        unit.validate()?;
        let group = unit.group.clone();
        if outcomes.insert(group.clone(), unit).is_some() {
            return Err(RustdocOutcomeError::Invalid(format!(
                "more than one rustdoc outcome invocation uses group {group}"
            )));
        }
    }

    let mut groups = Vec::new();
    for (group, outcome_unit) in outcomes {
        let map_unit = maps.remove(&group);
        let catalog_count = u64::try_from(outcome_unit.catalog.doctests.len()).map_err(|_| {
            RustdocOutcomeError::Invalid(format!(
                "rustdoc catalog for {group} exceeds the supported test count"
            ))
        })?;
        let reported_count = outcome_unit
            .report
            .planned_tests
            .checked_add(outcome_unit.report.filtered_out)
            .ok_or_else(|| {
                RustdocOutcomeError::Invalid(format!(
                    "rustdoc catalog arithmetic overflow for {group}"
                ))
            })?;
        if catalog_count != reported_count {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc catalog for {group} has {catalog_count} tests but libtest accounted for {reported_count}"
            )));
        }

        let mut merged_entries = BTreeMap::new();
        let join = if let Some(map_unit) = map_unit {
            for entry in &map_unit.map.entries {
                let catalog = outcome_unit
                    .catalog
                    .doctests
                    .iter()
                    .find(|candidate| candidate.name == entry.display_name)
                    .ok_or_else(|| {
                        RustdocOutcomeError::Invalid(format!(
                            "merged doctest {} is absent from rustdoc's catalog",
                            entry.display_name
                        ))
                    })?;
                if catalog.file != entry.path
                    || catalog.line != entry.line
                    || catalog.ignored() != entry.ignored
                    || catalog.doctest_attributes.no_run != entry.no_run
                    || catalog.doctest_attributes.should_panic != entry.should_panic
                    || catalog.doctest_attributes.compile_fail
                    || catalog.doctest_attributes.standalone_crate
                {
                    return Err(RustdocOutcomeError::Invalid(format!(
                        "merged compiler descriptor disagrees with rustdoc's catalog for {}",
                        entry.display_name
                    )));
                }
                if merged_entries
                    .insert(entry.display_name.clone(), entry.clone())
                    .is_some()
                {
                    return Err(RustdocOutcomeError::Invalid(format!(
                        "duplicate merged catalog binding for {}",
                        entry.display_name
                    )));
                }
            }
            map_unit.join
        } else {
            None
        };

        let mut terminal = outcome_unit
            .report
            .outcomes
            .iter()
            .cloned()
            .map(|outcome| (outcome.display_name.clone(), outcome))
            .collect::<BTreeMap<_, _>>();
        let mut unfinished = outcome_unit
            .report
            .unfinished_started
            .iter()
            .cloned()
            .collect::<BTreeSet<_>>();
        let mut entries = Vec::with_capacity(outcome_unit.catalog.doctests.len());
        for (catalog_index, catalog) in outcome_unit.catalog.doctests.into_iter().enumerate() {
            let state = if let Some(outcome) = terminal.remove(&catalog.name) {
                RustdocJoinedOutcomeState::Completed { outcome }
            } else if unfinished.remove(&catalog.name) {
                RustdocJoinedOutcomeState::UnfinishedStarted
            } else if outcome_unit.report.filtered_out == 0 {
                RustdocJoinedOutcomeState::Unstarted
            } else if outcome_unit.report.unstarted_tests == 0 {
                RustdocJoinedOutcomeState::FilteredOut
            } else {
                RustdocJoinedOutcomeState::NotRunAmbiguous
            };
            let catalog_index = u64::try_from(catalog_index).map_err(|_| {
                RustdocOutcomeError::Invalid(format!(
                    "rustdoc catalog index exceeds u64 for {}",
                    catalog.name
                ))
            })?;
            let merged_entry = merged_entries.remove(&catalog.name);
            entries.push(RustdocJoinedOutcome {
                catalog_index,
                catalog,
                merged_entry,
                state,
            });
        }
        if !terminal.is_empty() || !unfinished.is_empty() || !merged_entries.is_empty() {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc outcomes or compiler descriptors for {group} contain identities absent from the authoritative catalog"
            )));
        }
        let unnamed_count = entries
            .iter()
            .filter(|entry| {
                matches!(
                    entry.state,
                    RustdocJoinedOutcomeState::Unstarted
                        | RustdocJoinedOutcomeState::FilteredOut
                        | RustdocJoinedOutcomeState::NotRunAmbiguous
                )
            })
            .count();
        let expected_unnamed = outcome_unit
            .report
            .filtered_out
            .checked_add(outcome_unit.report.unstarted_tests)
            .and_then(|count| usize::try_from(count).ok())
            .ok_or_else(|| {
                RustdocOutcomeError::Invalid(format!(
                    "rustdoc unresolved outcome count exceeds this platform for {group}"
                ))
            })?;
        if unnamed_count != expected_unnamed {
            return Err(RustdocOutcomeError::Invalid(format!(
                "rustdoc unresolved catalog count disagrees with libtest for {group}"
            )));
        }
        let joined_group = RustdocOutcomeGroupJoin {
            invocation_id: outcome_unit.invocation_id,
            group,
            companion_build_id: outcome_unit.companion_build_id,
            raw_catalog_sha256: outcome_unit.raw_catalog_sha256,
            raw_events_sha256: outcome_unit.raw_events_sha256,
            transport_sha256: outcome_unit.transport_sha256,
            join,
            transport: outcome_unit.transport,
            entries,
            ambiguous_filtered_out: outcome_unit.report.filtered_out
                * u64::from(outcome_unit.report.unstarted_tests != 0),
            ambiguous_unstarted_tests: outcome_unit.report.unstarted_tests
                * u64::from(outcome_unit.report.filtered_out != 0),
        };
        joined_group.validate_transport_ownership()?;
        groups.push(joined_group);
    }

    let unmatched_maps = maps.into_values().collect();

    Ok(RustdocOutcomeResolution {
        groups,
        unmatched_maps,
    })
}

impl RustdocMergedJoin {
    /// Translate transport records emitted before rustdoc's merged runner made
    /// final authored identities available. Assertion context IDs are derived
    /// from decision IDs, so translating a decision also requires rebuilding
    /// its complete nested phase chain and every record that refers to it.
    pub fn translate_transport(
        &self,
        base_context_id: u64,
        read: &RustTransportRead,
    ) -> Result<RustTransportRead, RustdocJoinError> {
        validate_rust_phase_contexts(base_context_id, read)
            .map_err(|error| RustdocJoinError::Invalid(error.to_string()))?;

        let definitions = rustdoc_phase_definitions(read)
            .map_err(|error| RustdocJoinError::Invalid(error.to_string()))?;
        let mut translated_contexts = BTreeMap::from([(base_context_id, base_context_id)]);
        let mut visiting = BTreeSet::new();
        fn translate_context(
            context: u64,
            base: u64,
            definitions: &BTreeMap<u64, RustdocPhaseDefinition<'_>>,
            obligation_ids: &BTreeMap<String, String>,
            translated: &mut BTreeMap<u64, u64>,
            visiting: &mut BTreeSet<u64>,
        ) -> Result<u64, RustdocJoinError> {
            if context == 0 || context == base {
                return Ok(context);
            }
            if let Some(translated) = translated.get(&context) {
                return Ok(*translated);
            }
            if !visiting.insert(context) {
                return Err(RustdocJoinError::Invalid(format!(
                    "merged doctest assertion context cycle at {context:016x}"
                )));
            }
            let phase = definitions.get(&context).ok_or_else(|| {
                RustdocJoinError::Invalid(format!(
                    "merged doctest context {context:016x} has no phase definition"
                ))
            })?;
            let parent = translate_context(
                phase.parent_context_id(),
                base,
                definitions,
                obligation_ids,
                translated,
                visiting,
            )?;
            let final_context = match phase {
                RustdocPhaseDefinition::Assertion(phase) => {
                    let decision = obligation_ids
                        .get(&phase.decision_id)
                        .map_or(phase.decision_id.as_str(), String::as_str);
                    rust_assertion_context_id(parent, decision, phase.invocation_nonce)
                        .map_err(|error| RustdocJoinError::Invalid(error.to_string()))?
                }
                RustdocPhaseDefinition::Thread(phase) => {
                    rust_thread_context_id(parent, phase.invocation_nonce)
                }
            };
            visiting.remove(&context);
            translated.insert(context, final_context);
            Ok(final_context)
        }
        for context in definitions.keys() {
            translate_context(
                *context,
                base_context_id,
                &definitions,
                &self.obligation_ids,
                &mut translated_contexts,
                &mut visiting,
            )?;
        }

        let translate_record_context = |context: u64| {
            if context == 0 {
                Ok(0)
            } else {
                translated_contexts.get(&context).copied().ok_or_else(|| {
                    RustdocJoinError::Invalid(format!(
                        "merged doctest record context {context:016x} was not translated"
                    ))
                })
            }
        };
        let mut translated = read.clone();
        for observation in &mut translated.observations {
            observation.context_id = translate_record_context(observation.context_id)?;
            let id = match &mut observation.observation {
                RustProbeObservation::Hit { id, .. }
                | RustProbeObservation::Decision { id, .. }
                | RustProbeObservation::Assertion { id, .. } => id,
            };
            if let Some(final_id) = self.obligation_ids.get(id) {
                *id = final_id.clone();
            }
        }
        for hit in &mut translated.ordinal_hits {
            hit.context_id = translate_record_context(hit.context_id)?;
            let old = hit.ordinal.to_string();
            if let Some(final_ordinal) = self.probe_ordinals.get(&old) {
                hit.ordinal = final_ordinal.parse::<u64>().map_err(|_| {
                    RustdocJoinError::Invalid(format!(
                        "merged doctest final probe ordinal {final_ordinal} is invalid"
                    ))
                })?;
            }
        }
        for phase in &mut translated.phases {
            phase.child_context_id = translate_record_context(phase.child_context_id)?;
            phase.parent_context_id = translate_record_context(phase.parent_context_id)?;
            if let Some(final_id) = self.obligation_ids.get(&phase.decision_id) {
                phase.decision_id = final_id.clone();
            }
        }
        for phase in &mut translated.thread_phases {
            phase.child_context_id = translate_record_context(phase.child_context_id)?;
            phase.parent_context_id = translate_record_context(phase.parent_context_id)?;
        }
        for end in &mut translated.thread_ends {
            end.context_id = translate_record_context(end.context_id)?;
        }
        for boundary in &mut translated.test_boundaries {
            boundary.context_id = translate_record_context(boundary.context_id)?;
        }
        let unique_phases = translated
            .phases
            .iter()
            .map(|phase| phase.child_context_id)
            .chain(
                translated
                    .thread_phases
                    .iter()
                    .map(|phase| phase.child_context_id),
            )
            .collect::<BTreeSet<_>>();
        if unique_phases.len() != translated.phases.len() + translated.thread_phases.len() {
            return Err(RustdocJoinError::Invalid(
                "merged doctest assertion contexts collided after identity translation".into(),
            ));
        }
        validate_rust_phase_contexts(base_context_id, &translated)
            .map_err(|error| RustdocJoinError::Invalid(error.to_string()))?;
        Ok(translated)
    }
}

/// Parse an entire compiler-output generation and resolve every deferred
/// merged-doctest candidate before ordinary workspace normalization. Normal
/// candidates provide immutable authored source snapshots; a pending bundle
/// must match exactly one runner map, while a map without a pending bundle is
/// retained because the represented test may have no source obligations.
pub fn resolve_merged_doctest_candidates(
    raw_pairs: Vec<(Vec<u8>, Vec<u8>)>,
    raw_maps: Vec<Vec<u8>>,
) -> Result<RustdocResolvedCandidates, RustdocJoinError> {
    let mut maps = BTreeMap::<String, RustdocMergedMap>::new();
    for raw in raw_maps {
        let map = RustdocMergedMap::parse(&raw)?;
        if maps.insert(map.group.clone(), map).is_some() {
            return Err(RustdocJoinError::Invalid(
                "compiler output contains duplicate merged-doctest groups".into(),
            ));
        }
    }

    struct Pending {
        group: String,
        manifest: Vec<u8>,
        sources: Vec<u8>,
    }
    let mut candidates = Vec::new();
    let mut pending = Vec::new();
    let mut authored_sources = BTreeMap::<String, RustCompilerSource>::new();
    for (manifest_bytes, source_bytes) in raw_pairs {
        let ordinary_manifest = RustCompilerManifest::parse(&manifest_bytes);
        let ordinary_sources = RustCompilerSourceSnapshots::parse(&source_bytes);
        if let (Ok(manifest), Ok(sources)) = (ordinary_manifest, ordinary_sources) {
            if manifest.crate_name != sources.crate_name {
                return Err(RustdocJoinError::Manifest(format!(
                    "compiler manifest/source identity differs for {}",
                    manifest.crate_name
                )));
            }
            for (key, source) in &sources.sources {
                if authored_sources
                    .insert(key.clone(), source.clone())
                    .is_some_and(|existing| existing != *source)
                {
                    return Err(RustdocJoinError::Invalid(format!(
                        "authored compiler source {key} changed across units"
                    )));
                }
            }
            candidates.push((manifest, sources));
            continue;
        }

        let matching = maps
            .keys()
            .filter(|group| {
                RustCompilerManifest::parse_pending_doctest(&manifest_bytes, group).is_ok()
                    && RustCompilerSourceSnapshots::parse_pending_doctest(&source_bytes, group)
                        .is_ok()
            })
            .cloned()
            .collect::<Vec<_>>();
        let [group] = matching.as_slice() else {
            return Err(RustdocJoinError::Invalid(format!(
                "compiler candidate matches {} merged-doctest maps instead of exactly one",
                matching.len()
            )));
        };
        if pending
            .iter()
            .any(|candidate: &Pending| candidate.group == *group)
        {
            return Err(RustdocJoinError::Invalid(format!(
                "merged-doctest group {group} has more than one pending bundle"
            )));
        }
        pending.push(Pending {
            group: group.clone(),
            manifest: manifest_bytes,
            sources: source_bytes,
        });
    }

    let mut joined_by_group = BTreeMap::new();
    for pending in pending {
        let map = maps
            .get(&pending.group)
            .expect("pending group was selected from parsed maps");
        let encoded_map =
            serde_json::to_vec(map).map_err(|error| RustdocJoinError::Json(error.to_string()))?;
        let joined = join_merged_doctest(
            &pending.manifest,
            &pending.sources,
            &encoded_map,
            &authored_sources,
        )?;
        candidates.push((joined.manifest.clone(), joined.sources.clone()));
        joined_by_group.insert(pending.group, joined);
    }
    candidates.sort_by(|left, right| {
        left.0.crate_name.cmp(&right.0.crate_name).then_with(|| {
            left.0
                .points
                .first()
                .map(|point| &point.id)
                .cmp(&right.0.points.first().map(|point| &point.id))
        })
    });
    let merged_units = maps
        .into_iter()
        .map(|(group, map)| RustdocMergedUnit {
            map,
            join: joined_by_group.remove(&group),
        })
        .collect();
    Ok(RustdocResolvedCandidates {
        candidates,
        merged_units,
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustdocJoinError {
    Json(String),
    Manifest(String),
    Invalid(String),
}

impl std::fmt::Display for RustdocJoinError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(reason) => write!(formatter, "invalid merged rustdoc map JSON: {reason}"),
            Self::Manifest(reason) => {
                write!(
                    formatter,
                    "invalid merged rustdoc compiler manifest: {reason}"
                )
            }
            Self::Invalid(reason) => write!(formatter, "invalid merged rustdoc join: {reason}"),
        }
    }
}

impl std::error::Error for RustdocJoinError {}

fn safe_group(value: &str) -> bool {
    !value.is_empty()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'_' | b'-'))
}

fn module_index(value: &str) -> Option<u64> {
    value.strip_prefix("__doctest_")?.parse::<u64>().ok()
}

fn normalized_relative_path(value: &str) -> bool {
    !value.is_empty()
        && !value.starts_with('/')
        && !value.contains('\\')
        && value
            .split('/')
            .all(|component| !component.is_empty() && !matches!(component, "." | ".."))
}

impl RustdocMergedMap {
    pub fn parse(bytes: &[u8]) -> Result<Self, RustdocJoinError> {
        let map: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustdocJoinError::Json(error.to_string()))?;
        map.validate()?;
        Ok(map)
    }

    pub fn validate(&self) -> Result<(), RustdocJoinError> {
        if self.schema != MAP_SCHEMA || !safe_group(&self.group) || self.entries.is_empty() {
            return Err(RustdocJoinError::Invalid(
                "schema, group and at least one entry are required".into(),
            ));
        }
        let mut modules = BTreeSet::new();
        let mut display_names = BTreeSet::new();
        let mut source_sites = BTreeSet::new();
        let mut previous = None;
        for entry in &self.entries {
            let Some(index) = module_index(&entry.module) else {
                return Err(RustdocJoinError::Invalid(format!(
                    "invalid merged doctest module {}",
                    entry.module
                )));
            };
            if previous.is_some_and(|previous| previous >= index) {
                return Err(RustdocJoinError::Invalid(
                    "merged doctest entries are not in numeric module order".into(),
                ));
            }
            previous = Some(index);
            if !modules.insert(entry.module.as_str())
                || !display_names.insert(entry.display_name.as_str())
                || !source_sites.insert((entry.path.as_str(), entry.line))
                || !normalized_relative_path(&entry.path)
                || entry.line == 0
                || entry.display_name.trim().is_empty()
                || entry.display_name.chars().any(char::is_control)
            {
                return Err(RustdocJoinError::Invalid(format!(
                    "malformed merged doctest entry {}",
                    entry.module
                )));
            }
        }
        Ok(())
    }

    pub fn entry(&self, module: &str) -> Result<&RustdocMergedEntry, RustdocJoinError> {
        self.entries
            .iter()
            .find(|entry| entry.module == module)
            .ok_or_else(|| {
                RustdocJoinError::Invalid(format!(
                    "pending bundle module {module} has no runner descriptor"
                ))
            })
    }

    fn next_line_for(&self, entry: &RustdocMergedEntry) -> Option<u64> {
        self.entries
            .iter()
            .filter(|candidate| candidate.path == entry.path && candidate.line > entry.line)
            .map(|candidate| candidate.line)
            .min()
    }
}

fn source_lines(source: &str) -> Vec<(u64, usize, &str)> {
    let mut offset = 0;
    source
        .split_inclusive('\n')
        .enumerate()
        .map(|(index, line)| {
            let record = (index as u64 + 1, offset, line);
            offset += line.len();
            record
        })
        .collect()
}

#[derive(Clone, Copy)]
struct ExtractedLine<'a> {
    start: usize,
    end: usize,
    source: &'a str,
}

fn extracted_module_lines<'a>(
    bundle_source: &'a str,
    module: &str,
) -> Result<Vec<ExtractedLine<'a>>, RustdocJoinError> {
    let parsed = SourceFile::parse(bundle_source, Edition::CURRENT);
    if !parsed.errors().is_empty() {
        return Err(RustdocJoinError::Invalid(format!(
            "merged bundle does not parse as Rust: {}",
            parsed
                .errors()
                .iter()
                .map(ToString::to_string)
                .collect::<Vec<_>>()
                .join("; ")
        )));
    }
    let tree = parsed.tree();
    let modules = tree
        .syntax()
        .descendants()
        .filter_map(ast::Module::cast)
        .filter(|candidate| candidate.name().is_some_and(|name| name.text() == module))
        .collect::<Vec<_>>();
    let [module_node] = modules.as_slice() else {
        return Err(RustdocJoinError::Invalid(format!(
            "merged bundle contains {} modules named {module}",
            modules.len()
        )));
    };
    let functions = module_node
        .syntax()
        .descendants()
        .filter_map(ast::Fn::cast)
        .filter(|function| {
            function.name().is_some_and(|name| name.text() == "main")
                && function
                    .syntax()
                    .ancestors()
                    .skip(1)
                    .find_map(ast::Module::cast)
                    .as_ref()
                    == Some(module_node)
        })
        .collect::<Vec<_>>();
    let [function] = functions.as_slice() else {
        return Err(RustdocJoinError::Invalid(format!(
            "merged module {module} contains {} direct main functions",
            functions.len()
        )));
    };
    let body = function.body().ok_or_else(|| {
        RustdocJoinError::Invalid(format!("merged module {module} main has no body"))
    })?;
    let range = body.syntax().text_range();
    let body_start = usize::from(range.start());
    let body_end = usize::from(range.end());
    if body_end <= body_start + 1
        || bundle_source.as_bytes().get(body_start) != Some(&b'{')
        || bundle_source.as_bytes().get(body_end - 1) != Some(&b'}')
    {
        return Err(RustdocJoinError::Invalid(format!(
            "merged module {module} main has an invalid syntax range"
        )));
    }
    let content_start = body_start + 1;
    let content = &bundle_source[content_start..body_end - 1];
    let mut offset = content_start;
    let lines = content
        .split_inclusive('\n')
        .filter_map(|line| {
            let source = line.strip_suffix('\n').unwrap_or(line);
            let record = (!source.trim().is_empty()).then_some(ExtractedLine {
                start: offset,
                end: offset + source.len(),
                source,
            });
            offset += line.len();
            record
        })
        .collect::<Vec<_>>();
    if lines.is_empty() {
        return Err(RustdocJoinError::Invalid(format!(
            "merged module {module} main has no extracted source lines"
        )));
    }
    Ok(lines)
}

/// Map one exact extracted range to its authored source. Its nonblank lines
/// must have exactly one complete, ordered mapping inside that doctest's
/// runner-bounded source interval. Repeated fragments are valid when their
/// sequence identifies one mapping; genuinely ambiguous sequences fail closed.
pub fn map_merged_range(
    map: &RustdocMergedMap,
    module: &str,
    bundle_source: &str,
    pending_start: u32,
    pending_end: u32,
    authored_source: &str,
) -> Result<RustdocMappedRange, RustdocJoinError> {
    map.validate()?;
    let entry = map.entry(module)?;
    let start = pending_start as usize;
    let end = pending_end as usize;
    if start >= end
        || end > bundle_source.len()
        || !bundle_source.is_char_boundary(start)
        || !bundle_source.is_char_boundary(end)
    {
        return Err(RustdocJoinError::Invalid(format!(
            "pending range {pending_start}..{pending_end} is outside UTF-8 bundle bytes"
        )));
    }
    if bundle_source[start..end].contains('\r') {
        return Err(RustdocJoinError::Invalid(
            "carriage-return extracted source is unsupported".into(),
        ));
    }
    let next_line = map.next_line_for(entry).unwrap_or(u64::MAX);
    let authored_lines = source_lines(authored_source);
    let extracted_lines = extracted_module_lines(bundle_source, module)?;
    let candidates = extracted_lines
        .iter()
        .map(|extracted| {
            authored_lines
                .iter()
                .filter(|(line, _, _)| *line >= entry.line && *line < next_line)
                .flat_map(|(line, offset, authored_line)| {
                    authored_line
                        .match_indices(extracted.source)
                        .map(move |(column, _)| (*line, *offset + column, extracted.source.len()))
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    if candidates.iter().any(Vec::is_empty) {
        return Err(RustdocJoinError::Invalid(format!(
            "merged fragment has no authored match in {}:{}",
            entry.path, entry.line
        )));
    }
    fn ordered_sequences(
        candidates: &[Vec<(u64, usize, usize)>],
        index: usize,
        previous_line: Option<u64>,
        current: &mut Vec<(u64, usize, usize)>,
        solutions: &mut Vec<Vec<(u64, usize, usize)>>,
    ) {
        if solutions.len() > 1 {
            return;
        }
        if index == candidates.len() {
            solutions.push(current.clone());
            return;
        }
        for candidate in &candidates[index] {
            if previous_line.is_some_and(|previous| previous >= candidate.0) {
                continue;
            }
            current.push(*candidate);
            ordered_sequences(candidates, index + 1, Some(candidate.0), current, solutions);
            current.pop();
            if solutions.len() > 1 {
                return;
            }
        }
    }
    let mut solutions = Vec::new();
    ordered_sequences(&candidates, 0, None, &mut Vec::new(), &mut solutions);
    let [anchors] = solutions.as_slice() else {
        return Err(RustdocJoinError::Invalid(format!(
            "merged fragments have {} ordered authored mappings in {}:{}",
            solutions.len(),
            entry.path,
            entry.line
        )));
    };
    let start_line = extracted_lines
        .iter()
        .position(|line| start >= line.start && start < line.end)
        .ok_or_else(|| {
            RustdocJoinError::Invalid(format!(
                "pending range start {pending_start} is outside extracted source lines"
            ))
        })?;
    let end_line = extracted_lines
        .iter()
        .position(|line| end > line.start && end <= line.end)
        .ok_or_else(|| {
            RustdocJoinError::Invalid(format!(
                "pending range end {pending_end} is outside extracted source lines"
            ))
        })?;
    if start_line > end_line {
        return Err(RustdocJoinError::Invalid(
            "pending range crosses extracted lines in reverse order".into(),
        ));
    }
    let authored_start = anchors[start_line]
        .1
        .checked_add(start - extracted_lines[start_line].start)
        .ok_or_else(|| RustdocJoinError::Invalid("authored source offset overflow".into()))?;
    let authored_end = anchors[end_line]
        .1
        .checked_add(end - extracted_lines[end_line].start)
        .ok_or_else(|| RustdocJoinError::Invalid("authored source offset overflow".into()))?;
    Ok(RustdocMappedRange {
        source_key: format!("source:{}", entry.path),
        start: u32::try_from(authored_start)
            .map_err(|_| RustdocJoinError::Invalid("authored start exceeds u32".into()))?,
        end: u32::try_from(authored_end)
            .map_err(|_| RustdocJoinError::Invalid("authored end exceeds u32".into()))?,
    })
}

/// Produce the frozen identity for a non-synthetic authored/doctest
/// obligation after deferred source mapping.
pub fn rust_source_identity(
    kind: &str,
    source: &RustdocMappedRange,
    discriminator: &str,
) -> Result<RustSourceIdentity, RustdocJoinError> {
    if !matches!(
        kind,
        "statement" | "function" | "branch" | "branch-alternative" | "decision" | "match-group"
    ) || !source.source_key.starts_with("source:")
        || !normalized_relative_path(&source.source_key["source:".len()..])
        || source.start >= source.end
    {
        return Err(RustdocJoinError::Invalid(
            "invalid final Rust source identity input".into(),
        ));
    }
    identity_for_range(kind, source, discriminator)
}

fn identity_for_range(
    kind: &str,
    source: &RustdocMappedRange,
    discriminator: &str,
) -> Result<RustSourceIdentity, RustdocJoinError> {
    if !matches!(
        kind,
        "statement" | "function" | "branch" | "branch-alternative" | "decision" | "match-group"
    ) || source.start >= source.end
        || source.source_key.chars().any(char::is_control)
        || discriminator.chars().any(char::is_control)
    {
        return Err(RustdocJoinError::Invalid(
            "invalid Rust source identity components".into(),
        ));
    }
    let canonical = format!(
        "{SOURCE_MODEL}\0{kind}\0{}\0{}\0{}\0{discriminator}\0",
        source.source_key, source.start, source.end
    );
    identity_from_canonical(kind, canonical)
}

fn identity_from_canonical(
    kind: &str,
    canonical: String,
) -> Result<RustSourceIdentity, RustdocJoinError> {
    let digest = Sha256::digest(canonical.as_bytes());
    let encoded = digest[..12]
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<String>();
    let probe_ordinal = u64::from_be_bytes(
        digest[..8]
            .try_into()
            .expect("a SHA-256 digest always has eight prefix bytes"),
    );
    Ok(RustSourceIdentity {
        id: format!("rs:{kind}:{encoded}"),
        canonical,
        probe_ordinal,
    })
}

#[derive(Debug)]
struct SyntheticExpansionFrame {
    description: String,
    source: RustdocMappedRange,
    definition: String,
}

#[derive(Debug)]
struct SyntheticCanonical {
    frames: Vec<SyntheticExpansionFrame>,
    definition: String,
    owner_ordinal: u64,
}

fn canonical_u32(value: &str, field: &str) -> Result<u32, RustdocJoinError> {
    let parsed = value.parse::<u32>().map_err(|_| {
        RustdocJoinError::Invalid(format!("synthetic canonical has invalid {field}"))
    })?;
    if value != parsed.to_string() {
        return Err(RustdocJoinError::Invalid(format!(
            "synthetic canonical has non-canonical {field}"
        )));
    }
    Ok(parsed)
}

fn canonical_u64(value: &str, field: &str) -> Result<u64, RustdocJoinError> {
    let parsed = value.parse::<u64>().map_err(|_| {
        RustdocJoinError::Invalid(format!("synthetic canonical has invalid {field}"))
    })?;
    if value != parsed.to_string() {
        return Err(RustdocJoinError::Invalid(format!(
            "synthetic canonical has non-canonical {field}"
        )));
    }
    Ok(parsed)
}

fn parse_synthetic_canonical(
    canonical: &str,
    kind: &str,
    source_key: &str,
    start: u32,
    end: u32,
    discriminator: &str,
) -> Result<Option<SyntheticCanonical>, RustdocJoinError> {
    let parts = canonical.split('\0').collect::<Vec<_>>();
    if parts.get(6) != Some(&"synthetic-expansion") {
        return Ok(None);
    }
    if parts.last() != Some(&"")
        || parts.len() < 15
        || (parts.len() - 10) % 5 != 0
        || parts[0] != SOURCE_MODEL
        || parts[1] != kind
        || parts[2] != source_key
        || canonical_u32(parts[3], "source start")? != start
        || canonical_u32(parts[4], "source end")? != end
        || parts[5] != discriminator
    {
        return Err(RustdocJoinError::Invalid(format!(
            "malformed synthetic canonical for {kind}"
        )));
    }
    let frame_count = (parts.len() - 10) / 5;
    let mut frames = Vec::with_capacity(frame_count);
    for frame in parts[7..7 + frame_count * 5].chunks_exact(5) {
        if frame[0].is_empty() || frame[1].is_empty() || frame[4].is_empty() {
            return Err(RustdocJoinError::Invalid(
                "synthetic expansion frame has an empty identity component".into(),
            ));
        }
        frames.push(SyntheticExpansionFrame {
            description: frame[0].into(),
            source: RustdocMappedRange {
                source_key: frame[1].into(),
                start: canonical_u32(frame[2], "frame start")?,
                end: canonical_u32(frame[3], "frame end")?,
            },
            definition: frame[4].into(),
        });
    }
    let definition_index = 7 + frame_count * 5;
    let definition = parts[definition_index];
    let owner_ordinal = canonical_u64(parts[definition_index + 1], "owner ordinal")?;
    if definition.is_empty() {
        return Err(RustdocJoinError::Invalid(
            "synthetic canonical has an empty owner definition".into(),
        ));
    }
    Ok(Some(SyntheticCanonical {
        frames,
        definition: definition.into(),
        owner_ordinal,
    }))
}

fn stable_definition(
    entry: &RustdocMergedEntry,
    definition: &str,
) -> Result<String, RustdocJoinError> {
    let main = format!("{}::main", entry.module);
    if let Some(suffix) = definition.strip_prefix(&main) {
        return Ok(format!("doctest:{}:{}{suffix}", entry.path, entry.line));
    }
    if definition.is_empty()
        || definition.chars().any(char::is_control)
        || definition.contains("doctest_bundle_")
        || definition.contains("__doctest_")
    {
        return Err(RustdocJoinError::Invalid(format!(
            "synthetic expansion definition {definition} is not stable"
        )));
    }
    Ok(definition.into())
}

struct RebasedIdentity {
    identity: RustSourceIdentity,
    source: RustdocMappedRange,
    provenance: &'static str,
}

#[allow(clippy::too_many_arguments)]
fn rebase_identity(
    map: &RustdocMergedMap,
    entry: &RustdocMergedEntry,
    bundle_source: &str,
    authored_sources: &BTreeMap<String, RustCompilerSource>,
    kind: &str,
    source_key: &str,
    start: u32,
    end: u32,
    old_discriminator: &str,
    new_discriminator: &str,
    id: &str,
    canonical: &str,
    probe_ordinal: &str,
) -> Result<RebasedIdentity, RustdocJoinError> {
    let source = map_obligation_range(map, entry, bundle_source, start, end, authored_sources)?;
    if let Some(synthetic) =
        parse_synthetic_canonical(canonical, kind, source_key, start, end, old_discriminator)?
    {
        let old = identity_from_canonical(kind, canonical.into())?;
        verify_pending_identity(&old, id, Some(canonical), probe_ordinal)?;
        let pending_key = format!("doctest-pending:{}", map.group);
        let mut frame_canonical = String::new();
        for frame in synthetic.frames {
            if frame.source.source_key != pending_key {
                return Err(RustdocJoinError::Invalid(format!(
                    "synthetic expansion frame escaped pending source {}",
                    frame.source.source_key
                )));
            }
            let mapped = map_obligation_range(
                map,
                entry,
                bundle_source,
                frame.source.start,
                frame.source.end,
                authored_sources,
            )?;
            frame_canonical.push_str(&format!(
                "{}\0{}\0{}\0{}\0{}\0",
                frame.description,
                mapped.source_key,
                mapped.start,
                mapped.end,
                stable_definition(entry, &frame.definition)?,
            ));
        }
        let canonical = format!(
            "{SOURCE_MODEL}\0{kind}\0{}\0{}\0{}\0{new_discriminator}\0synthetic-expansion\0{}{}\0{}\0",
            source.source_key,
            source.start,
            source.end,
            frame_canonical,
            stable_definition(entry, &synthetic.definition)?,
            synthetic.owner_ordinal,
        );
        return Ok(RebasedIdentity {
            identity: identity_from_canonical(kind, canonical)?,
            source,
            provenance: "synthetic-expansion",
        });
    }
    let old = pending_identity(kind, source_key, start, end, old_discriminator)?;
    verify_pending_identity(&old, id, Some(canonical), probe_ordinal)?;
    Ok(RebasedIdentity {
        identity: rust_source_identity(kind, &source, new_discriminator)?,
        source,
        provenance: "doctest-source",
    })
}

fn pending_identity(
    kind: &str,
    source_key: &str,
    start: u32,
    end: u32,
    discriminator: &str,
) -> Result<RustSourceIdentity, RustdocJoinError> {
    identity_for_range(
        kind,
        &RustdocMappedRange {
            source_key: source_key.into(),
            start,
            end,
        },
        discriminator,
    )
}

fn verify_pending_identity(
    identity: &RustSourceIdentity,
    id: &str,
    canonical: Option<&str>,
    probe_ordinal: &str,
) -> Result<(), RustdocJoinError> {
    if identity.probe_ordinal == 0
        || id != identity.id
        || canonical.is_some_and(|canonical| canonical != identity.canonical)
        || probe_ordinal != identity.probe_ordinal.to_string()
    {
        return Err(RustdocJoinError::Invalid(format!(
            "temporary merged-doctest identity {id} does not match its frozen canonical form"
        )));
    }
    Ok(())
}

fn insert_translation(
    ids: &mut BTreeMap<String, String>,
    ordinals: &mut BTreeMap<String, String>,
    old_id: &str,
    old_ordinal: &str,
    new_identity: &RustSourceIdentity,
) -> Result<(), RustdocJoinError> {
    let parsed_ordinal = old_ordinal.parse::<u64>().map_err(|_| {
        RustdocJoinError::Invalid(format!(
            "temporary obligation {old_id} has an invalid ordinal"
        ))
    })?;
    if parsed_ordinal == 0 || old_ordinal != parsed_ordinal.to_string() {
        return Err(RustdocJoinError::Invalid(format!(
            "temporary obligation {old_id} has a non-canonical ordinal"
        )));
    }
    if ids.insert(old_id.into(), new_identity.id.clone()).is_some()
        || ordinals
            .insert(old_ordinal.into(), new_identity.probe_ordinal.to_string())
            .is_some()
    {
        return Err(RustdocJoinError::Invalid(format!(
            "duplicate temporary merged-doctest identity {old_id}"
        )));
    }
    Ok(())
}

fn definition_module<'a>(
    map: &'a RustdocMergedMap,
    definitions: &[String],
) -> Result<&'a RustdocMergedEntry, RustdocJoinError> {
    let mut matches = BTreeSet::new();
    for definition in definitions {
        for entry in &map.entries {
            let main = format!("{}::main", entry.module);
            if definition == &main || definition.starts_with(&format!("{main}::")) {
                matches.insert(entry.module.as_str());
            }
        }
    }
    if matches.len() != 1 {
        return Err(RustdocJoinError::Invalid(format!(
            "obligation definitions do not resolve to exactly one merged doctest module: {}",
            definitions.join(", ")
        )));
    }
    let module = matches.into_iter().next().expect("exactly one module");
    map.entry(module)
}

fn stable_definitions(
    entry: &RustdocMergedEntry,
    definitions: &[String],
) -> Result<Vec<String>, RustdocJoinError> {
    let main = format!("{}::main", entry.module);
    let root = format!("doctest:{}:{}", entry.path, entry.line);
    let mut stable = definitions
        .iter()
        .map(|definition| {
            definition
                .strip_prefix(&main)
                .map(|suffix| format!("{root}{suffix}"))
        })
        .collect::<Option<Vec<_>>>()
        .ok_or_else(|| {
            RustdocJoinError::Invalid(format!(
                "definition escaped merged doctest module {}",
                entry.module
            ))
        })?;
    stable.sort();
    stable.dedup();
    if stable.is_empty() {
        return Err(RustdocJoinError::Invalid(
            "merged doctest obligation has no stable definitions".into(),
        ));
    }
    Ok(stable)
}

fn authored_source<'a>(
    sources: &'a BTreeMap<String, RustCompilerSource>,
    entry: &RustdocMergedEntry,
) -> Result<&'a RustCompilerSource, RustdocJoinError> {
    let key = format!("source:{}", entry.path);
    let source = sources.get(&key).ok_or_else(|| {
        RustdocJoinError::Invalid(format!("authored source snapshot {key} was not supplied"))
    })?;
    if source.file != entry.path {
        return Err(RustdocJoinError::Invalid(format!(
            "authored source snapshot {key} has display path {}",
            source.file
        )));
    }
    Ok(source)
}

fn map_obligation_range(
    map: &RustdocMergedMap,
    entry: &RustdocMergedEntry,
    bundle_source: &str,
    start: u32,
    end: u32,
    authored_sources: &BTreeMap<String, RustCompilerSource>,
) -> Result<RustdocMappedRange, RustdocJoinError> {
    let source = authored_source(authored_sources, entry)?;
    map_merged_range(
        map,
        &entry.module,
        bundle_source,
        start,
        end,
        &source.source,
    )
}

fn alternative_discriminator(
    discriminator: &str,
    kind: &str,
    label: &str,
) -> Result<String, RustdocJoinError> {
    let token = match (kind, label) {
        ("decision-outcome", "condition false") => "false",
        ("decision-outcome", "condition true") => "true",
        ("assertion-outcome", "failed") => "failed",
        ("assertion-outcome", "passed") => "passed",
        ("loop-entry", "zero iterations") => "zero",
        ("loop-entry", "entered") => "entered",
        ("match-arm", "not selected") => "not-selected",
        ("match-arm", "selected") => "selected",
        ("let-else", "matched") => "matched",
        ("let-else", "else") => "else",
        ("try-operator", "continued") => "continued",
        ("try-operator", "early return") => "returned",
        ("logical-selection", "short-circuited") => "short-circuit",
        ("logical-selection", "right operand evaluated") => "evaluated",
        _ => {
            return Err(RustdocJoinError::Invalid(format!(
                "unknown {} alternative label {label}",
                kind
            )));
        }
    };
    Ok(format!("{discriminator}:{token}"))
}

/// Resolve a merged rustdoc bundle only after its runner map and immutable
/// authored source snapshots are available. The returned ID/ordinal maps are
/// required to translate already-emitted bundle observations; accepting the
/// final manifest without translating those observations would silently lose
/// coverage.
pub fn join_merged_doctest(
    pending_manifest_bytes: &[u8],
    pending_source_bytes: &[u8],
    map_bytes: &[u8],
    authored_sources: &BTreeMap<String, RustCompilerSource>,
) -> Result<RustdocMergedJoin, RustdocJoinError> {
    let map = RustdocMergedMap::parse(map_bytes)?;
    let mut manifest =
        RustCompilerManifest::parse_pending_doctest(pending_manifest_bytes, &map.group)
            .map_err(|error| RustdocJoinError::Manifest(error.to_string()))?;
    let pending_sources =
        RustCompilerSourceSnapshots::parse_pending_doctest(pending_source_bytes, &map.group)
            .map_err(|error| RustdocJoinError::Manifest(error.to_string()))?;
    if pending_sources.crate_name != manifest.crate_name {
        return Err(RustdocJoinError::Invalid(
            "pending merged-doctest manifest/source crate mismatch".into(),
        ));
    }
    let pending_key = format!("doctest-pending:{}", map.group);
    let bundle_source = &pending_sources
        .sources
        .get(&pending_key)
        .expect("pending source parser requires the exact key")
        .source;
    let mut ids = BTreeMap::new();
    let mut ordinals = BTreeMap::new();

    for point in &mut manifest.points {
        let entry = definition_module(&map, &point.definitions)?;
        let rebased = rebase_identity(
            &map,
            entry,
            bundle_source,
            authored_sources,
            &point.kind,
            &point.source_key,
            point.start,
            point.end,
            &point.discriminator,
            &point.discriminator,
            &point.id,
            &point.canonical,
            &point.probe_ordinal,
        )?;
        insert_translation(
            &mut ids,
            &mut ordinals,
            &point.id,
            &point.probe_ordinal,
            &rebased.identity,
        )?;
        point.id = rebased.identity.id;
        point.canonical = rebased.identity.canonical;
        point.probe_ordinal = rebased.identity.probe_ordinal.to_string();
        point.source_key = rebased.source.source_key;
        point.start = rebased.source.start;
        point.end = rebased.source.end;
        point.provenance = rebased.provenance.into();
        point.definitions = stable_definitions(entry, &point.definitions)?;
    }

    let mut group_ids = BTreeMap::new();
    for group in &mut manifest.selection_groups {
        let entry = definition_module(&map, &group.definitions)?;
        let rebased = rebase_identity(
            &map,
            entry,
            bundle_source,
            authored_sources,
            "match-group",
            &group.source_key,
            group.start,
            group.end,
            "match",
            "match",
            &group.id,
            &group.canonical,
            &group.probe_ordinal,
        )?;
        insert_translation(
            &mut ids,
            &mut ordinals,
            &group.id,
            &group.probe_ordinal,
            &rebased.identity,
        )?;
        group_ids.insert(group.id.clone(), rebased.identity.id.clone());
        group.id = rebased.identity.id;
        group.canonical = rebased.identity.canonical;
        group.probe_ordinal = rebased.identity.probe_ordinal.to_string();
        group.source_key = rebased.source.source_key;
        group.start = rebased.source.start;
        group.end = rebased.source.end;
        group.provenance = rebased.provenance.into();
        group.definitions = stable_definitions(entry, &group.definitions)?;
        for arm in &mut group.arms {
            let source = map_obligation_range(
                &map,
                entry,
                bundle_source,
                arm.body_start,
                arm.body_end,
                authored_sources,
            )?;
            arm.body_source_key = source.source_key;
            arm.body_start = source.start;
            arm.body_end = source.end;
        }
    }

    let mut branch_ids = BTreeMap::new();
    for branch in &mut manifest.branches {
        let old_discriminator = branch.discriminator.clone();
        let old_source_key = branch.source_key.clone();
        let old_start = branch.start;
        let old_end = branch.end;
        let entry = definition_module(&map, &branch.definitions)?;
        let discriminator = if branch.kind == "match-arm" {
            let mut translated = old_discriminator.clone();
            for (old_group, new_group) in &group_ids {
                translated = translated.replace(old_group, new_group);
            }
            if translated == old_discriminator {
                return Err(RustdocJoinError::Invalid(format!(
                    "match-arm discriminator {} has no translated parent group",
                    old_discriminator
                )));
            }
            translated
        } else {
            old_discriminator.clone()
        };
        let rebased = rebase_identity(
            &map,
            entry,
            bundle_source,
            authored_sources,
            "branch",
            &old_source_key,
            old_start,
            old_end,
            &old_discriminator,
            &discriminator,
            &branch.id,
            &branch.canonical,
            &branch.probe_ordinal,
        )?;
        insert_translation(
            &mut ids,
            &mut ordinals,
            &branch.id,
            &branch.probe_ordinal,
            &rebased.identity,
        )?;
        branch_ids.insert(branch.id.clone(), rebased.identity.id.clone());
        branch.id = rebased.identity.id;
        branch.canonical = rebased.identity.canonical;
        branch.probe_ordinal = rebased.identity.probe_ordinal.to_string();
        branch.source_key = rebased.source.source_key.clone();
        branch.start = rebased.source.start;
        branch.end = rebased.source.end;
        branch.provenance = rebased.provenance.into();
        branch.definitions = stable_definitions(entry, &branch.definitions)?;
        branch.discriminator = discriminator.clone();
        for alternative in &mut branch.alternatives {
            let old_alternative_discriminator =
                alternative_discriminator(&old_discriminator, &branch.kind, &alternative.label)?;
            let new_discriminator =
                alternative_discriminator(&discriminator, &branch.kind, &alternative.label)?;
            let rebased = rebase_identity(
                &map,
                entry,
                bundle_source,
                authored_sources,
                "branch-alternative",
                &old_source_key,
                old_start,
                old_end,
                &old_alternative_discriminator,
                &new_discriminator,
                &alternative.id,
                &alternative.canonical,
                &alternative.probe_ordinal,
            )?;
            insert_translation(
                &mut ids,
                &mut ordinals,
                &alternative.id,
                &alternative.probe_ordinal,
                &rebased.identity,
            )?;
            alternative.id = rebased.identity.id;
            alternative.probe_ordinal = rebased.identity.probe_ordinal.to_string();
            alternative.canonical = rebased.identity.canonical;
        }
    }

    let mut decision_ids = BTreeMap::new();
    for decision in &mut manifest.decisions {
        let entry = definition_module(&map, &decision.definitions)?;
        let rebased = rebase_identity(
            &map,
            entry,
            bundle_source,
            authored_sources,
            "decision",
            &decision.source_key,
            decision.start,
            decision.end,
            &decision.kind,
            &decision.kind,
            &decision.id,
            &decision.canonical,
            &decision.probe_ordinal,
        )?;
        insert_translation(
            &mut ids,
            &mut ordinals,
            &decision.id,
            &decision.probe_ordinal,
            &rebased.identity,
        )?;
        decision_ids.insert(decision.id.clone(), rebased.identity.id.clone());
        decision.id = rebased.identity.id;
        decision.canonical = rebased.identity.canonical;
        decision.probe_ordinal = rebased.identity.probe_ordinal.to_string();
        decision.source_key = rebased.source.source_key;
        decision.start = rebased.source.start;
        decision.end = rebased.source.end;
        decision.provenance = rebased.provenance.into();
        decision.definitions = stable_definitions(entry, &decision.definitions)?;
        decision.outcome_branch_id = branch_ids
            .get(&decision.outcome_branch_id)
            .cloned()
            .ok_or_else(|| {
                RustdocJoinError::Invalid("decision outcome branch was not rebased".into())
            })?;
        decision.loop_branch_id = decision
            .loop_branch_id
            .as_ref()
            .map(|id| {
                branch_ids.get(id).cloned().ok_or_else(|| {
                    RustdocJoinError::Invalid("decision loop branch was not rebased".into())
                })
            })
            .transpose()?;
        for selection in &mut decision.logical_selections {
            selection.branch_id =
                branch_ids
                    .get(&selection.branch_id)
                    .cloned()
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid(
                            "decision logical-selection branch was not rebased".into(),
                        )
                    })?;
        }
        decision
            .logical_selections
            .sort_by(|left, right| left.branch_id.cmp(&right.branch_id));
        for condition in &mut decision.conditions {
            let source = map_obligation_range(
                &map,
                entry,
                bundle_source,
                condition.start,
                condition.end,
                authored_sources,
            )?;
            condition.source_key = source.source_key;
            condition.start = source.start;
            condition.end = source.end;
        }
    }

    for group in &mut manifest.selection_groups {
        group.parent_group_id = group
            .parent_group_id
            .as_ref()
            .map(|id| {
                group_ids.get(id).cloned().ok_or_else(|| {
                    RustdocJoinError::Invalid("match parent group was not rebased".into())
                })
            })
            .transpose()?;
        for arm in &mut group.arms {
            arm.branch_id = branch_ids.get(&arm.branch_id).cloned().ok_or_else(|| {
                RustdocJoinError::Invalid("match arm branch was not rebased".into())
            })?;
            arm.guard_decision_id = arm
                .guard_decision_id
                .as_ref()
                .map(|id| {
                    decision_ids.get(id).cloned().ok_or_else(|| {
                        RustdocJoinError::Invalid("match guard decision was not rebased".into())
                    })
                })
                .transpose()?;
            arm.selected_ordinal = ordinals
                .get(&arm.selected_ordinal)
                .ok_or_else(|| {
                    RustdocJoinError::Invalid("match selected ordinal was not rebased".into())
                })?
                .clone();
            arm.not_selected_ordinal = ordinals
                .get(&arm.not_selected_ordinal)
                .ok_or_else(|| {
                    RustdocJoinError::Invalid("match not-selected ordinal was not rebased".into())
                })?
                .clone();
        }
    }

    manifest
        .points
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest
        .branches
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest
        .decisions
        .sort_by(|left, right| left.id.cmp(&right.id));
    manifest
        .selection_groups
        .sort_by(|left, right| left.id.cmp(&right.id));

    let required_keys = manifest
        .points
        .iter()
        .map(|point| point.source_key.as_str())
        .chain(
            manifest
                .branches
                .iter()
                .map(|branch| branch.source_key.as_str()),
        )
        .chain(manifest.decisions.iter().flat_map(|decision| {
            std::iter::once(decision.source_key.as_str()).chain(
                decision
                    .conditions
                    .iter()
                    .map(|condition| condition.source_key.as_str()),
            )
        }))
        .chain(manifest.selection_groups.iter().flat_map(|group| {
            std::iter::once(group.source_key.as_str())
                .chain(group.arms.iter().map(|arm| arm.body_source_key.as_str()))
        }))
        .collect::<BTreeSet<_>>();
    let sources = RustCompilerSourceSnapshots {
        schema: pending_sources.schema,
        crate_name: manifest.crate_name.clone(),
        sources: required_keys
            .into_iter()
            .map(|key| {
                authored_sources
                    .get(key)
                    .cloned()
                    .map(|source| (key.into(), source))
                    .ok_or_else(|| {
                        RustdocJoinError::Invalid(format!(
                            "final authored source snapshot {key} was not supplied"
                        ))
                    })
            })
            .collect::<Result<_, _>>()?,
    };
    manifest
        .validate()
        .map_err(|error| RustdocJoinError::Manifest(error.to_string()))?;
    sources
        .validate()
        .map_err(|error| RustdocJoinError::Manifest(error.to_string()))?;
    manifest
        .normalize(&sources.sources)
        .map_err(|error| RustdocJoinError::Manifest(error.to_string()))?;
    Ok(RustdocMergedJoin {
        manifest,
        sources,
        obligation_ids: ids,
        probe_ordinals: ordinals,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rust_compiler_manifest::{
        RustCompilerBranch, RustCompilerBranchAlternative, RustCompilerCondition,
        RustCompilerDecision, RustCompilerManifest, RustCompilerMatchArm, RustCompilerPoint,
        RustCompilerSelectionGroup, RustCompilerSourceSnapshots,
        normalize_rust_compiler_candidates,
    };
    use crate::rust_probe_transport::{
        RustOrdinalHit, RustTestBoundary, RustThreadEnd, RustTransportObservation,
        rust_assertion_context_id,
    };

    fn map() -> RustdocMergedMap {
        RustdocMergedMap::parse(
            br#"{
                "schema":"supercov-rustdoc-merged-map-v2",
                "group":"fixture",
                "entries":[
                    {"module":"__doctest_0","displayName":"src/lib.rs - (line 3)","path":"src/lib.rs","line":3,"ignored":false,"noRun":false,"shouldPanic":false},
                    {"module":"__doctest_1","displayName":"src/lib.rs - (line 10)","path":"src/lib.rs","line":10,"ignored":false,"noRun":true,"shouldPanic":true}
                ]
            }"#,
        )
        .expect("valid map")
    }

    fn merged_bundle(body: &str) -> String {
        format!(
            "\n#![allow(unused)]\npub mod __doctest_0 {{\nfn main() {{\n{body}\n}}\npub fn __main_fn() -> impl std::process::Termination {{ main() }}\n}}\n"
        )
    }

    fn libtest_stream(lines: &[&str]) -> Vec<u8> {
        lines.join("\n").into_bytes()
    }

    fn empty_transport() -> RustTransportRead {
        RustTransportRead::empty()
    }

    fn transport_sha256(transport: &RustTransportRead) -> String {
        format!(
            "{:x}",
            Sha256::digest(serde_json::to_vec(transport).unwrap())
        )
    }

    fn catalog_doctest(
        name: &str,
        line: u64,
        ignored: bool,
        no_run: bool,
        should_panic: bool,
        compile_fail: bool,
        standalone_crate: bool,
    ) -> RustdocExtractedDoctest {
        RustdocExtractedDoctest {
            file: "src/lib.rs".into(),
            line,
            doctest_attributes: RustdocDoctestAttributes {
                original: String::new(),
                should_panic,
                no_run,
                ignore: if ignored {
                    RustdocDoctestIgnore::All
                } else {
                    RustdocDoctestIgnore::None
                },
                rust: true,
                test_harness: false,
                compile_fail,
                standalone_crate,
                error_codes: Vec::new(),
                edition: None,
                added_css_classes: Vec::new(),
                unknown: Vec::new(),
            },
            original_code: "assert!(true);".into(),
            doctest_code: Some(RustdocDoctestCode {
                crate_level: "#![allow(unused)]\n".into(),
                code: "assert!(true);".into(),
                wrapper: Some(RustdocDoctestWrapper {
                    before: "fn main() {\n".into(),
                    after: "\n}".into(),
                    returns_result: false,
                }),
            }),
            name: name.into(),
        }
    }

    struct OutcomeDirectory(PathBuf);

    impl OutcomeDirectory {
        fn new() -> Self {
            use std::sync::atomic::{AtomicU64, Ordering};
            static NEXT: AtomicU64 = AtomicU64::new(0);
            let path = std::env::temp_dir().join(format!(
                "supercov-rustdoc-outcome-{}-{}",
                std::process::id(),
                NEXT.fetch_add(1, Ordering::Relaxed)
            ));
            fs::create_dir(&path).expect("create outcome test directory");
            Self(path)
        }
    }

    impl Drop for OutcomeDirectory {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.0);
        }
    }

    fn passing_outcome_unit() -> RustdocOutcomeUnit {
        let transport = empty_transport();
        RustdocOutcomeUnit {
            schema: OUTCOME_SCHEMA.into(),
            invocation_id: "1".repeat(64),
            group: "fixture".into(),
            companion_build_id: "2".repeat(64),
            raw_catalog_sha256: "4".repeat(64),
            raw_events_sha256: "3".repeat(64),
            transport_sha256: transport_sha256(&transport),
            catalog: RustdocExtractedCatalog {
                format_version: RUSTDOC_CATALOG_FORMAT_VERSION,
                doctests: vec![catalog_doctest(
                    "src/lib.rs - (line 3)",
                    3,
                    false,
                    false,
                    false,
                    false,
                    false,
                )],
            },
            report: RustdocOutcomeReport {
                outcomes: vec![RustdocTestOutcome {
                    display_name: "src/lib.rs - (line 3)".into(),
                    status: RustdocOutcomeStatus::Passed,
                    execution_seconds: Some(0.25),
                    stdout: None,
                    message: None,
                    reason: None,
                    timeout_warning: false,
                }],
                suites: 1,
                planned_tests: 1,
                filtered_out: 0,
                unfinished_started: Vec::new(),
                unstarted_tests: 0,
                total_seconds: None,
                compilation_seconds: None,
            },
            transport,
        }
    }

    fn merged_unit() -> RustdocMergedUnit {
        RustdocMergedUnit {
            map: map(),
            join: None,
        }
    }

    fn outcome(display_name: &str, status: RustdocOutcomeStatus) -> RustdocTestOutcome {
        RustdocTestOutcome {
            display_name: display_name.into(),
            status,
            execution_seconds: (status != RustdocOutcomeStatus::Ignored).then_some(0.25),
            stdout: None,
            message: None,
            reason: None,
            timeout_warning: false,
        }
    }

    #[test]
    fn parses_the_exact_pinned_rustdoc_catalog_format() {
        let raw = br##"{
            "format_version": 2,
            "doctests": [
                {
                    "file": "src/lib.rs",
                    "line": 3,
                    "doctest_attributes": {
                        "original": "ignore-x86_64,edition2024",
                        "should_panic": false,
                        "no_run": false,
                        "ignore": {"Some": ["x86_64"]},
                        "rust": true,
                        "test_harness": false,
                        "compile_fail": false,
                        "standalone_crate": false,
                        "error_codes": [],
                        "edition": "2024",
                        "added_css_classes": [],
                        "unknown": []
                    },
                    "original_code": "assert!(true);",
                    "doctest_code": {
                        "crate_level": "#![allow(unused)]\n",
                        "code": "assert!(true);",
                        "wrapper": null
                    },
                    "name": "src/lib.rs - example (line 3)"
                },
                {
                    "file": "src/lib.rs",
                    "line": 10,
                    "doctest_attributes": {
                        "original": "compile_fail,E0308",
                        "should_panic": false,
                        "no_run": true,
                        "ignore": "None",
                        "rust": true,
                        "test_harness": false,
                        "compile_fail": true,
                        "standalone_crate": false,
                        "error_codes": ["E0308"],
                        "edition": null,
                        "added_css_classes": [],
                        "unknown": []
                    },
                    "original_code": "let _: u8 = true;",
                    "doctest_code": null,
                    "name": "src/lib.rs - compile_error (line 10)"
                }
            ]
        }"##;
        let catalog = RustdocExtractedCatalog::parse(raw).expect("pinned catalog v2");
        assert_eq!(catalog.doctests.len(), 2);
        assert!(matches!(
            &catalog.doctests[0].doctest_attributes.ignore,
            RustdocDoctestIgnore::Some(targets)
                if targets.len() == 1 && targets[0] == "x86_64"
        ));
        assert!(catalog.doctests[1].doctest_code.is_none());
        assert!(catalog.doctests[1].doctest_attributes.compile_fail);
    }

    #[test]
    fn rejects_unknown_malformed_or_ambiguous_rustdoc_catalogs() {
        let valid = serde_json::to_value(&passing_outcome_unit().catalog).unwrap();
        let mut cases = Vec::new();

        let mut value = valid.clone();
        value["format_version"] = serde_json::json!(3);
        cases.push(value);

        let mut value = valid.clone();
        value["extra"] = serde_json::json!(true);
        cases.push(value);

        let mut value = valid.clone();
        value["doctests"][0]["line"] = serde_json::json!(0);
        cases.push(value);

        let mut value = valid.clone();
        value["doctests"][0]["name"] = serde_json::json!("a guessed name");
        cases.push(value);

        let mut value = valid.clone();
        let duplicate = value["doctests"][0].clone();
        value["doctests"].as_array_mut().unwrap().push(duplicate);
        cases.push(value);

        let mut value = valid;
        value["doctests"][0]["doctest_attributes"]["edition"] = serde_json::json!("2099");
        cases.push(value);

        for value in cases {
            let bytes = serde_json::to_vec(&value).unwrap();
            assert!(
                RustdocExtractedCatalog::parse(&bytes).is_err(),
                "accepted invalid rustdoc catalog: {value}"
            );
        }
    }

    #[test]
    fn parses_exact_libtest_outcomes_across_merged_suites() {
        let report = parse_rustdoc_libtest_json(&libtest_stream(&[
            r#"{"type":"suite","event":"started","test_count":3,"shuffle_seed":17}"#,
            r#"{"type":"test","event":"started","name":"alpha"}"#,
            r#"{"type":"test","event":"timeout","name":"alpha"}"#,
            r#"{"type":"test","name":"alpha","event":"ok","exec_time":1.25,"stdout":"visible\noutput"}"#,
            r#"{"type":"test","event":"started","name":"beta"}"#,
            r#"{"type":"test","name":"beta","event":"failed","exec_time":0.5,"stdout":"failure","reason":"time limit exceeded"}"#,
            r#"{"type":"test","event":"started","name":"ignored"}"#,
            r#"{"type":"test","name":"ignored","event":"ignored","message":"platform"}"#,
            r#"{"type":"suite","event":"failed","passed":1,"failed":1,"ignored":1,"measured":0,"filtered_out":2,"exec_time":1.75}"#,
            r#"{"type":"suite","event":"started","test_count":0}"#,
            r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":0,"measured":0,"filtered_out":3}"#,
            r#"{"type":"report","total_time":2.5,"compilation_time":0.75}"#,
        ]))
        .expect("pinned libtest stream");

        assert_eq!(report.suites, 2);
        assert_eq!(report.planned_tests, 3);
        assert_eq!(report.filtered_out, 5);
        assert!(report.unfinished_started.is_empty());
        assert_eq!(report.unstarted_tests, 0);
        assert_eq!(report.total_seconds, Some(2.5));
        assert_eq!(report.compilation_seconds, Some(0.75));
        assert_eq!(
            report
                .outcomes
                .iter()
                .map(|outcome| (
                    outcome.display_name.as_str(),
                    outcome.status,
                    outcome.timeout_warning,
                    outcome.message.as_deref(),
                    outcome.reason.as_deref(),
                ))
                .collect::<Vec<_>>(),
            vec![
                ("alpha", RustdocOutcomeStatus::Passed, true, None, None),
                (
                    "beta",
                    RustdocOutcomeStatus::Failed,
                    false,
                    None,
                    Some("time limit exceeded"),
                ),
                (
                    "ignored",
                    RustdocOutcomeStatus::Ignored,
                    false,
                    Some("platform"),
                    None,
                ),
            ]
        );
        assert_eq!(report.outcomes[0].execution_seconds, Some(1.25));
        assert_eq!(
            report.outcomes[0].stdout.as_deref(),
            Some("visible\noutput")
        );
    }

    #[test]
    fn represents_failed_fail_fast_suites_without_inventing_outcomes() {
        let report = parse_rustdoc_libtest_json(&libtest_stream(&[
            r#"{"type":"suite","event":"started","test_count":4}"#,
            r#"{"type":"test","event":"started","name":"failing"}"#,
            r#"{"type":"test","event":"started","name":"still-running"}"#,
            r#"{"type":"test","name":"failing","event":"failed","message":"boom"}"#,
            r#"{"type":"suite","event":"failed","passed":0,"failed":1,"ignored":0,"measured":0,"filtered_out":7}"#,
        ]))
        .expect("valid fail-fast stream");

        assert_eq!(report.planned_tests, 4);
        assert_eq!(report.filtered_out, 7);
        assert_eq!(report.unfinished_started, ["still-running"]);
        assert_eq!(report.unstarted_tests, 2);
        assert_eq!(report.outcomes.len(), 1);
        assert_eq!(report.outcomes[0].status, RustdocOutcomeStatus::Failed);
        assert_eq!(report.outcomes[0].message.as_deref(), Some("boom"));
        assert_eq!(report.total_seconds, None);
    }

    #[test]
    fn rejects_malformed_truncated_or_semantically_impossible_libtest_streams() {
        let cases = [
            vec![],
            vec![r#"{"type":"suite","event":"started","test_count":0,"extra":true}"#],
            vec![r#"{"type":"suite","event":null,"test_count":0}"#],
            vec![r#"{"type":"suite","event":"started","event":"started","test_count":0}"#],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","name":"missing-start","event":"ok"}"#,
                r#"{"type":"suite","event":"ok","passed":1,"failed":0,"ignored":0,"measured":0,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"started","name":"duplicate"}"#,
                r#"{"type":"test","event":"started","name":"duplicate"}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"timeout","name":"missing-start"}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"started","name":"unknown-reason"}"#,
                r#"{"type":"test","name":"unknown-reason","event":"failed","reason":"new reason"}"#,
                r#"{"type":"suite","event":"failed","passed":0,"failed":1,"ignored":0,"measured":0,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"started","name":"ignored"}"#,
                r#"{"type":"test","name":"ignored","event":"ignored","stdout":"impossible"}"#,
                r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":1,"measured":0,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"started","name":"unfinished"}"#,
                r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":0,"measured":0,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":1}"#,
                r#"{"type":"test","event":"started","name":"wrong-count"}"#,
                r#"{"type":"test","name":"wrong-count","event":"ok"}"#,
                r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":0,"measured":0,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":0}"#,
                r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":0,"measured":1,"filtered_out":0}"#,
            ],
            vec![
                r#"{"type":"suite","event":"started","test_count":0}"#,
                r#"{"type":"suite","event":"ok","passed":0,"failed":0,"ignored":0,"measured":0,"filtered_out":0}"#,
                r#"{"type":"report","total_time":1.0,"compilation_time":2.0}"#,
            ],
            vec![r#"{"type":"suite","event":"discovery"}"#],
            vec![r#"{"type":"suite","event":"started","test_count":0}"#],
        ];
        for lines in cases {
            assert!(
                parse_rustdoc_libtest_json(&libtest_stream(&lines)).is_err(),
                "accepted invalid libtest stream: {lines:?}"
            );
        }
    }

    #[test]
    fn publishes_and_reads_exact_atomic_rustdoc_outcome_units() {
        let directory = OutcomeDirectory::new();
        let unit = passing_outcome_unit();
        let path = publish_rustdoc_outcome_unit(&directory.0, &unit).expect("publish outcome");
        assert_eq!(
            path.file_name().and_then(|name| name.to_str()),
            Some(format!("doctest-outcome-{}.json", unit.invocation_id).as_str())
        );
        assert_eq!(
            read_rustdoc_outcome_units(&directory.0).expect("read outcome"),
            std::slice::from_ref(&unit)
        );
        assert!(publish_rustdoc_outcome_unit(&directory.0, &unit).is_err());
        assert_eq!(
            read_rustdoc_outcome_units(&directory.0).expect("published outcome stayed intact"),
            [unit]
        );
    }

    #[test]
    fn reserves_each_rustdoc_transport_once_and_authenticates_reads() {
        let directory = OutcomeDirectory::new();
        let invocation = "a".repeat(64);
        let reservation = reserve_rustdoc_transport(&directory.0, &invocation)
            .expect("reserve rustdoc transport");
        assert!(reservation.path.is_file());
        let token = rustdoc_transport_token_hex(&reservation.token);
        assert_eq!(
            read_reserved_rustdoc_transport(&reservation.path, &token)
                .expect("authenticated empty transport"),
            empty_transport()
        );
        assert!(reserve_rustdoc_transport(&directory.0, &invocation).is_err());
        assert!(read_reserved_rustdoc_transport(&reservation.path, &"0".repeat(32)).is_err());
    }

    #[test]
    fn decodes_and_hashes_the_exact_catalog_and_event_frame() {
        let catalog = serde_json::to_vec(&passing_outcome_unit().catalog).unwrap();
        let events = libtest_stream(&[
            r#"{"type":"suite","event":"started","test_count":1}"#,
            r#"{"type":"test","event":"started","name":"src/lib.rs - (line 3)"}"#,
            r#"{"type":"test","name":"src/lib.rs - (line 3)","event":"ok"}"#,
            r#"{"type":"suite","event":"ok","passed":1,"failed":0,"ignored":0,"measured":0,"filtered_out":0}"#,
        ]);
        let mut framed = u64::try_from(catalog.len()).unwrap().to_be_bytes().to_vec();
        framed.extend_from_slice(&catalog);
        framed.extend_from_slice(&events);
        let unit = rustdoc_outcome_unit_from_framed_input(
            "1".repeat(64),
            "fixture".into(),
            "2".repeat(64),
            &framed,
            empty_transport(),
        )
        .expect("exact framed rustdoc outputs");
        assert_eq!(
            unit.raw_catalog_sha256,
            format!("{:x}", Sha256::digest(&catalog))
        );
        assert_eq!(
            unit.raw_events_sha256,
            format!("{:x}", Sha256::digest(&events))
        );
        for invalid in [
            Vec::new(),
            1u64.to_be_bytes().to_vec(),
            1000u64.to_be_bytes().into_iter().chain([b'{']).collect(),
            {
                let mut only_catalog = u64::try_from(catalog.len()).unwrap().to_be_bytes().to_vec();
                only_catalog.extend_from_slice(&catalog);
                only_catalog
            },
        ] {
            assert!(
                rustdoc_outcome_unit_from_framed_input(
                    "1".repeat(64),
                    "fixture".into(),
                    "2".repeat(64),
                    &invalid,
                    empty_transport(),
                )
                .is_err()
            );
        }
    }

    #[test]
    fn joins_merged_standalone_compile_fail_and_fail_fast_state_from_catalog() {
        let mut unit = passing_outcome_unit();
        unit.catalog.doctests = vec![
            catalog_doctest(
                "src/lib.rs - (line 3)",
                3,
                false,
                false,
                false,
                false,
                false,
            ),
            catalog_doctest(
                "src/lib.rs - (line 10)",
                10,
                false,
                true,
                true,
                false,
                false,
            ),
            catalog_doctest(
                "src/lib.rs - standalone (line 20)",
                20,
                false,
                false,
                false,
                false,
                true,
            ),
            catalog_doctest(
                "src/lib.rs - compile_fail (line 30)",
                30,
                false,
                true,
                false,
                true,
                false,
            ),
            catalog_doctest(
                "src/lib.rs - later (line 40)",
                40,
                false,
                false,
                false,
                false,
                false,
            ),
        ];
        unit.report = RustdocOutcomeReport {
            outcomes: vec![
                outcome("src/lib.rs - (line 10)", RustdocOutcomeStatus::Ignored),
                outcome("src/lib.rs - (line 3)", RustdocOutcomeStatus::Passed),
                outcome(
                    "src/lib.rs - standalone (line 20)",
                    RustdocOutcomeStatus::Failed,
                ),
            ],
            suites: 1,
            planned_tests: 5,
            filtered_out: 0,
            unfinished_started: vec!["src/lib.rs - compile_fail (line 30)".into()],
            unstarted_tests: 1,
            total_seconds: None,
            compilation_seconds: None,
        };
        unit.validate().expect("valid mixed rustdoc outcome unit");

        let resolution = join_rustdoc_outcomes(vec![merged_unit()], vec![unit])
            .expect("lossless merged outcome join");
        assert!(resolution.is_fully_catalogued());
        assert!(resolution.unmatched_maps.is_empty());
        let [group] = resolution.groups.as_slice() else {
            panic!("expected one joined rustdoc group")
        };
        assert_eq!(group.entries.len(), 5);
        assert!(matches!(
            &group.entries[0].state,
            RustdocJoinedOutcomeState::Completed { outcome }
                if outcome.status == RustdocOutcomeStatus::Passed
        ));
        assert!(matches!(
            &group.entries[1].state,
            RustdocJoinedOutcomeState::Completed { outcome }
                if outcome.status == RustdocOutcomeStatus::Ignored
        ));
        assert!(matches!(
            &group.entries[2].state,
            RustdocJoinedOutcomeState::Completed { outcome }
                if outcome.status == RustdocOutcomeStatus::Failed
        ));
        assert!(group.entries[2].merged_entry.is_none());
        assert!(matches!(
            group.entries[3].state,
            RustdocJoinedOutcomeState::UnfinishedStarted
        ));
        assert!(group.entries[3].catalog.doctest_attributes.compile_fail);
        assert!(matches!(
            group.entries[4].state,
            RustdocJoinedOutcomeState::Unstarted
        ));
        assert_eq!(
            group.raw_catalog_sha256,
            "4".repeat(64),
            "catalog binding must survive the join"
        );
        assert!(!group.has_ambiguous_outcomes());
    }

    #[test]
    fn joins_named_fail_fast_states_without_inventing_terminal_outcomes() {
        let mut unit = passing_outcome_unit();
        unit.catalog.doctests.push(catalog_doctest(
            "src/lib.rs - (line 10)",
            10,
            false,
            true,
            true,
            false,
            false,
        ));
        unit.report = RustdocOutcomeReport {
            outcomes: vec![outcome(
                "src/lib.rs - (line 3)",
                RustdocOutcomeStatus::Failed,
            )],
            suites: 1,
            planned_tests: 2,
            filtered_out: 0,
            unfinished_started: vec!["src/lib.rs - (line 10)".into()],
            unstarted_tests: 0,
            total_seconds: None,
            compilation_seconds: None,
        };
        let resolution = join_rustdoc_outcomes(vec![merged_unit()], vec![unit])
            .expect("join fail-fast identities");
        assert!(resolution.is_fully_catalogued());
        assert!(matches!(
            resolution.groups[0].entries[1].state,
            RustdocJoinedOutcomeState::UnfinishedStarted
        ));

        let mut unit = passing_outcome_unit();
        unit.catalog.doctests.push(catalog_doctest(
            "src/lib.rs - (line 10)",
            10,
            false,
            true,
            true,
            false,
            false,
        ));
        unit.report = RustdocOutcomeReport {
            outcomes: vec![outcome(
                "src/lib.rs - (line 3)",
                RustdocOutcomeStatus::Failed,
            )],
            suites: 1,
            planned_tests: 2,
            filtered_out: 0,
            unfinished_started: Vec::new(),
            unstarted_tests: 1,
            total_seconds: None,
            compilation_seconds: None,
        };
        let resolution = join_rustdoc_outcomes(vec![merged_unit()], vec![unit])
            .expect("join unstarted identity");
        assert!(resolution.is_fully_catalogued());
        assert!(matches!(
            resolution.groups[0].entries[1].state,
            RustdocJoinedOutcomeState::Unstarted
        ));
    }

    #[test]
    fn preserves_filter_and_fail_fast_identity_ambiguity_instead_of_guessing() {
        let mut unit = passing_outcome_unit();
        unit.catalog.doctests.extend([
            catalog_doctest(
                "src/lib.rs - filtered-or-unstarted-a (line 20)",
                20,
                false,
                false,
                false,
                false,
                true,
            ),
            catalog_doctest(
                "src/lib.rs - filtered-or-unstarted-b (line 30)",
                30,
                false,
                true,
                false,
                true,
                false,
            ),
        ]);
        unit.report = RustdocOutcomeReport {
            outcomes: vec![outcome(
                "src/lib.rs - (line 3)",
                RustdocOutcomeStatus::Failed,
            )],
            suites: 1,
            planned_tests: 2,
            filtered_out: 1,
            unfinished_started: Vec::new(),
            unstarted_tests: 1,
            total_seconds: None,
            compilation_seconds: None,
        };
        let resolution =
            join_rustdoc_outcomes(Vec::new(), vec![unit]).expect("lossless ambiguous outcome join");
        assert!(resolution.is_fully_catalogued());
        assert!(resolution.has_ambiguous_outcomes());
        assert_eq!(resolution.groups[0].ambiguous_filtered_out, 1);
        assert_eq!(resolution.groups[0].ambiguous_unstarted_tests, 1);
        assert!(
            resolution.groups[0].entries[1..]
                .iter()
                .all(|entry| { matches!(entry.state, RustdocJoinedOutcomeState::NotRunAmbiguous) })
        );
    }

    #[test]
    fn outcome_join_rejects_ambiguous_groups_and_impossible_missing_entries() {
        let unit = passing_outcome_unit();
        assert!(
            join_rustdoc_outcomes(vec![merged_unit(), merged_unit()], vec![unit.clone()]).is_err()
        );
        assert!(join_rustdoc_outcomes(vec![merged_unit()], vec![unit.clone(), unit]).is_err());

        let mut incomplete = passing_outcome_unit();
        incomplete.report.outcomes[0].display_name = "src/lib.rs - (line 3)".into();
        assert!(join_rustdoc_outcomes(vec![merged_unit()], vec![incomplete]).is_err());
    }

    #[test]
    fn outcome_join_retains_maps_without_outcomes_and_catalogs_units_without_maps() {
        let maps_only = join_rustdoc_outcomes(vec![merged_unit()], Vec::new()).unwrap();
        assert_eq!(maps_only.unmatched_maps.len(), 1);
        assert!(!maps_only.is_fully_catalogued());

        let units_only = join_rustdoc_outcomes(Vec::new(), vec![passing_outcome_unit()]).unwrap();
        assert_eq!(units_only.groups.len(), 1);
        assert!(units_only.groups[0].entries[0].merged_entry.is_none());
        assert!(units_only.is_fully_catalogued());
    }

    #[test]
    fn rejects_incomplete_tampered_or_inconsistent_rustdoc_outcome_units() {
        let mut invalid = Vec::new();

        let mut unit = passing_outcome_unit();
        unit.schema = "supercov-rustdoc-outcome-unit-v0".into();
        invalid.push(unit);

        let mut unit = passing_outcome_unit();
        unit.invocation_id = "A".repeat(64);
        invalid.push(unit);

        let mut unit = passing_outcome_unit();
        unit.report.planned_tests = 2;
        invalid.push(unit);

        let mut unit = passing_outcome_unit();
        unit.report.total_seconds = Some(1.0);
        invalid.push(unit);

        let mut unit = passing_outcome_unit();
        unit.report.outcomes[0].status = RustdocOutcomeStatus::Ignored;
        invalid.push(unit);

        let mut unit = passing_outcome_unit();
        unit.transport.attachments = 1;
        invalid.push(unit);

        for unit in invalid {
            assert!(unit.validate().is_err(), "accepted invalid unit: {unit:?}");
        }

        let directory = OutcomeDirectory::new();
        let unit = passing_outcome_unit();
        fs::write(
            directory.0.join(format!(
                ".doctest-outcome-{}.json.partial",
                unit.invocation_id
            )),
            b"partial",
        )
        .unwrap();
        assert!(read_rustdoc_outcome_units(&directory.0).is_err());
    }

    #[test]
    fn outcome_join_rejects_transport_owned_by_an_unknown_test() {
        let mut unit = passing_outcome_unit();
        unit.transport.observations.push(RustTransportObservation {
            process_id: 1,
            context_id: 7,
            observation: RustProbeObservation::Hit {
                id: "rs:function:111111111111111111111111".into(),
            },
        });
        unit.transport.committed = 1;
        unit.transport_sha256 = transport_sha256(&unit.transport);
        assert!(unit.validate().is_ok());
        assert!(join_rustdoc_outcomes(Vec::new(), vec![unit]).is_err());
    }

    #[test]
    fn map_is_strict_sorted_and_path_safe() {
        let valid = map();
        assert_eq!(valid.entry("__doctest_1").expect("entry").line, 10);
        assert!(valid.entry("__doctest_1").expect("entry").no_run);
        assert!(valid.entry("__doctest_1").expect("entry").should_panic);
        for invalid in [
            br#"{"schema":"wrong","group":"fixture","entries":[]}"#.as_slice(),
            br#"{"schema":"supercov-rustdoc-merged-map-v1","group":"fixture","entries":[{"module":"__doctest_0","displayName":"old","path":"src/lib.rs","line":3,"ignored":false,"noRun":false,"shouldPanic":false}]}"#.as_slice(),
            br#"{"schema":"supercov-rustdoc-merged-map-v2","group":"fixture","entries":[{"module":"__doctest_1","displayName":"one","path":"src/lib.rs","line":10,"ignored":false,"noRun":false,"shouldPanic":false},{"module":"__doctest_0","displayName":"zero","path":"src/lib.rs","line":3,"ignored":false,"noRun":false,"shouldPanic":false}]}"#.as_slice(),
            br#"{"schema":"supercov-rustdoc-merged-map-v2","group":"fixture","entries":[{"module":"__doctest_0","displayName":"duplicate","path":"src/lib.rs","line":3,"ignored":false,"noRun":false,"shouldPanic":false},{"module":"__doctest_1","displayName":"duplicate","path":"src/lib.rs","line":10,"ignored":false,"noRun":false,"shouldPanic":false}]}"#.as_slice(),
            br#"{"schema":"supercov-rustdoc-merged-map-v2","group":"fixture","entries":[{"module":"__doctest_0","displayName":"bad","path":"../src/lib.rs","line":3,"ignored":false,"noRun":false,"shouldPanic":false}]}"#.as_slice(),
            br#"{"schema":"supercov-rustdoc-merged-map-v2","group":"fixture","entries":[{"module":"__doctest_0","displayName":"bad","path":"src/lib.rs","line":0,"ignored":false,"noRun":false,"shouldPanic":false,"extra":true}]}"#.as_slice(),
        ] {
            assert!(RustdocMergedMap::parse(invalid).is_err());
        }
    }

    #[test]
    fn maps_hidden_multiline_and_duplicate_later_doctests_exactly() {
        let map = map();
        let snippet = "let value = hidden\n    + 2;";
        let bundle = merged_bundle(snippet);
        let start = bundle.find(snippet).unwrap() as u32;
        let end = start + snippet.len() as u32;
        let authored = concat!(
            "//! docs\n",
            "//! ```\n",
            "//! # let hidden = 20;\n",
            "//! let value = hidden\n",
            "//!     + 2;\n",
            "//! assert_eq!(value, 22);\n",
            "//! ```\n",
            "//! more\n",
            "//! ```\n",
            "//! let value = hidden\n",
            "//!     + 2;\n",
            "//! ```\n",
        );
        let mapped = map_merged_range(&map, "__doctest_0", &bundle, start, end, authored)
            .expect("exact range");
        assert_eq!(mapped.source_key, "source:src/lib.rs");
        assert_eq!(
            &authored[mapped.start as usize..mapped.end as usize],
            "let value = hidden\n//!     + 2;"
        );
    }

    #[test]
    fn rejects_ambiguous_or_unmapped_bundle_ranges() {
        let map = map();
        let bundle = merged_bundle("same();");
        let start = bundle.find("same();").unwrap() as u32;
        let end = start + 7;
        let ambiguous = "//! docs\n//! ```\n//! same();\n//! same();\n//! ```\n";
        assert!(map_merged_range(&map, "__doctest_0", &bundle, start, end, ambiguous).is_err());
        assert!(map_merged_range(&map, "__doctest_9", &bundle, start, end, ambiguous).is_err());
        assert!(map_merged_range(&map, "__doctest_0", &bundle, end, start, ambiguous).is_err());
    }

    #[test]
    fn maps_repeated_fragments_when_the_full_sequence_is_unique() {
        let map = map();
        let snippet = "same();\nsame();";
        let bundle = merged_bundle(snippet);
        let start = bundle.find(snippet).unwrap() as u32;
        let end = start + snippet.len() as u32;
        let authored = concat!(
            "//! docs\n",
            "//! ```\n",
            "//! same();\n",
            "//! same();\n",
            "//! ```\n",
        );
        let mapped = map_merged_range(&map, "__doctest_0", &bundle, start, end, authored)
            .expect("one ordered mapping");
        assert_eq!(
            &authored[mapped.start as usize..mapped.end as usize],
            "same();\n//! same();"
        );
    }

    #[test]
    fn maps_repeated_subexpressions_through_their_extracted_line_context() {
        let map = map();
        let snippet = concat!(
            "let flag = true;\n",
            "if flag { yes(); } else { no(); }\n",
            "match flag { true => yes(), false => no() };",
        );
        let bundle = merged_bundle(snippet);
        let if_line = "if flag { yes(); } else { no(); }";
        let start = bundle.find(if_line).unwrap() + "if ".len();
        let end = start + "flag".len();
        let authored = concat!(
            "//! docs\n",
            "//! ```\n",
            "//! let flag = true;\n",
            "//! if flag { yes(); } else { no(); }\n",
            "//! match flag { true => yes(), false => no() };\n",
            "//! ```\n",
        );
        let mapped = map_merged_range(
            &map,
            "__doctest_0",
            &bundle,
            start as u32,
            end as u32,
            authored,
        )
        .expect("full extracted-line context disambiguates flag");
        assert_eq!(
            &authored[mapped.start as usize..mapped.end as usize],
            "flag"
        );
        assert_eq!(
            authored[..mapped.start as usize]
                .bytes()
                .filter(|byte| *byte == b'\n')
                .count(),
            3,
            "the mapped flag must come from the if line"
        );
    }

    #[test]
    fn final_identity_matches_the_frozen_rust_source_model() {
        let source = RustdocMappedRange {
            source_key: "source:src/lib.rs".into(),
            start: 42,
            end: 57,
        };
        let identity =
            rust_source_identity("statement", &source, "expression").expect("valid identity");
        assert_eq!(
            identity.canonical,
            "rust-source-v1\0statement\0source:src/lib.rs\x0042\x0057\0expression\0"
        );
        assert_eq!(identity.id, "rs:statement:8446ba638fcb36ffc76b4293");
        assert_eq!(identity.probe_ordinal, 9531510598153221887);
    }

    fn pending_assertion_candidate() -> (
        Vec<u8>,
        Vec<u8>,
        Vec<u8>,
        BTreeMap<String, RustCompilerSource>,
    ) {
        let group = "fixture";
        let key = format!("doctest-pending:{group}");
        let snippet = "assert_eq!(fixture::authored(true), 1)";
        let bundle = format!(
            "\n#![allow(unused)]\npub mod __doctest_0 {{\nfn main() {{\n{snippet};\n}}\n}}\n"
        );
        let start = u32::try_from(bundle.find(snippet).expect("snippet")).unwrap();
        let end = start + u32::try_from(snippet.len()).unwrap();
        let definition = vec!["__doctest_0::main".into()];
        let point_identity = pending_identity("statement", &key, start, end, "expression").unwrap();
        let branch_identity =
            pending_identity("branch", &key, start, end, "assertion-outcome:assertion").unwrap();
        let passed_identity = pending_identity(
            "branch-alternative",
            &key,
            start,
            end,
            "assertion-outcome:assertion:passed",
        )
        .unwrap();
        let failed_identity = pending_identity(
            "branch-alternative",
            &key,
            start,
            end,
            "assertion-outcome:assertion:failed",
        )
        .unwrap();
        let decision_identity =
            pending_identity("decision", &key, start, end, "assertion").unwrap();
        let manifest = RustCompilerManifest {
            unmeasured_obligations: Vec::new(),
            schema: "supercov-rust-manifest-candidate-v4".into(),
            model: "rust-source-v1".into(),
            crate_name: "doctest_bundle_2024".into(),
            measurement_complete: false,
            bound_bodies: 1,
            points: vec![RustCompilerPoint {
                id: point_identity.id,
                kind: "statement".into(),
                source_key: key.clone(),
                start,
                end,
                provenance: "doctest-pending".into(),
                discriminator: "expression".into(),
                probe_ordinal: point_identity.probe_ordinal.to_string(),
                definitions: definition.clone(),
                canonical: point_identity.canonical,
            }],
            branches: vec![RustCompilerBranch {
                id: branch_identity.id.clone(),
                kind: "assertion-outcome".into(),
                discriminator: "assertion-outcome:assertion".into(),
                source_key: key.clone(),
                start,
                end,
                provenance: "doctest-pending".into(),
                probe_ordinal: branch_identity.probe_ordinal.to_string(),
                definitions: definition.clone(),
                alternatives: vec![
                    RustCompilerBranchAlternative {
                        id: passed_identity.id,
                        label: "passed".into(),
                        probe_ordinal: passed_identity.probe_ordinal.to_string(),
                        canonical: passed_identity.canonical,
                    },
                    RustCompilerBranchAlternative {
                        id: failed_identity.id,
                        label: "failed".into(),
                        probe_ordinal: failed_identity.probe_ordinal.to_string(),
                        canonical: failed_identity.canonical,
                    },
                ],
                canonical: branch_identity.canonical,
            }],
            decisions: vec![RustCompilerDecision {
                id: decision_identity.id,
                kind: "assertion".into(),
                source_key: key.clone(),
                start,
                end,
                provenance: "doctest-pending".into(),
                probe_ordinal: decision_identity.probe_ordinal.to_string(),
                definitions: definition,
                outcome_branch_id: branch_identity.id,
                loop_branch_id: None,
                logical_selections: Vec::new(),
                conditions: vec![RustCompilerCondition {
                    source_key: key.clone(),
                    start,
                    end,
                    source: snippet.into(),
                }],
                canonical: decision_identity.canonical,
            }],
            selection_groups: Vec::new(),
            limitations: vec!["RUST_DOCTEST_MAPPING_PENDING".into()],
        };
        let snapshots = RustCompilerSourceSnapshots {
            schema: "supercov-rust-source-snapshots-v1".into(),
            crate_name: manifest.crate_name.clone(),
            sources: BTreeMap::from([(
                key.clone(),
                RustCompilerSource {
                    file: key,
                    source: bundle,
                },
            )]),
        };
        let map = br#"{
            "schema":"supercov-rustdoc-merged-map-v2",
            "group":"fixture",
            "entries":[{
                "module":"__doctest_0",
                "displayName":"src/lib.rs - (line 3)",
                "path":"src/lib.rs",
                "line":3,
                "ignored":false,
                "noRun":false,
                "shouldPanic":false
            }]
        }"#
        .to_vec();
        let authored = concat!(
            "//! docs\n",
            "//! ```\n",
            "//! assert_eq!(fixture::authored(true), 1);\n",
            "//! ```\n",
        );
        (
            serde_json::to_vec(&manifest).unwrap(),
            serde_json::to_vec(&snapshots).unwrap(),
            map,
            BTreeMap::from([(
                "source:src/lib.rs".into(),
                RustCompilerSource {
                    file: "src/lib.rs".into(),
                    source: authored.into(),
                },
            )]),
        )
    }

    fn pending_branch(
        key: &str,
        start: u32,
        end: u32,
        kind: &str,
        discriminator: &str,
        alternatives: [(&str, &str); 2],
    ) -> RustCompilerBranch {
        let identity = pending_identity("branch", key, start, end, discriminator).unwrap();
        RustCompilerBranch {
            id: identity.id,
            kind: kind.into(),
            discriminator: discriminator.into(),
            source_key: key.into(),
            start,
            end,
            provenance: "doctest-pending".into(),
            probe_ordinal: identity.probe_ordinal.to_string(),
            definitions: vec!["__doctest_0::main".into()],
            alternatives: alternatives
                .into_iter()
                .map(|(token, label)| {
                    let identity = pending_identity(
                        "branch-alternative",
                        key,
                        start,
                        end,
                        &format!("{discriminator}:{token}"),
                    )
                    .unwrap();
                    RustCompilerBranchAlternative {
                        id: identity.id,
                        label: label.into(),
                        probe_ordinal: identity.probe_ordinal.to_string(),
                        canonical: identity.canonical,
                    }
                })
                .collect(),
            canonical: identity.canonical,
        }
    }

    fn synthetic_pending_identity(
        kind: &str,
        key: &str,
        start: u32,
        end: u32,
        discriminator: &str,
        owner_ordinal: u64,
    ) -> RustSourceIdentity {
        identity_from_canonical(
            kind,
            format!(
                concat!(
                    "rust-source-v1\0{}\0{}\0{}\0{}\0{}\0",
                    "synthetic-expansion\0proc-macro\0{}\0{}\0{}\0probe_macros::generated\0",
                    "__doctest_0::main\0{}\0"
                ),
                kind, key, start, end, discriminator, key, start, end, owner_ordinal,
            ),
        )
        .unwrap()
    }

    #[test]
    fn joins_pending_bundle_manifest_into_final_authored_identities() {
        let (manifest, sources, map, authored) = pending_assertion_candidate();
        assert!(RustCompilerManifest::parse(&manifest).is_err());
        assert!(RustCompilerSourceSnapshots::parse(&sources).is_err());

        let joined =
            join_merged_doctest(&manifest, &sources, &map, &authored).expect("strict merged join");
        assert_eq!(joined.manifest.points.len(), 1);
        assert_eq!(joined.manifest.branches.len(), 1);
        assert_eq!(joined.manifest.decisions.len(), 1);
        assert_eq!(joined.obligation_ids.len(), 5);
        assert_eq!(joined.probe_ordinals.len(), 5);
        assert_eq!(joined.manifest.points[0].source_key, "source:src/lib.rs");
        assert_eq!(joined.manifest.branches[0].source_key, "source:src/lib.rs");
        assert_eq!(joined.manifest.decisions[0].source_key, "source:src/lib.rs");
        let point = &joined.manifest.points[0];
        let source = &authored["source:src/lib.rs"].source;
        assert_eq!(
            &source[point.start as usize..point.end as usize],
            "assert_eq!(fixture::authored(true), 1)"
        );
        assert_eq!(point.provenance, "doctest-source");
        assert_eq!(point.definitions, ["doctest:src/lib.rs:3"]);
        assert_eq!(joined.sources.sources.len(), 1);
        joined
            .manifest
            .normalize(&joined.sources.sources)
            .expect("final manifest normalizes through the production path");
    }

    #[test]
    fn merged_join_rejects_tampering_missing_sources_and_malformed_synthetic_expansion() {
        let (manifest, sources, map, authored) = pending_assertion_candidate();
        let mut tampered: serde_json::Value = serde_json::from_slice(&manifest).unwrap();
        tampered["points"][0]["id"] =
            serde_json::Value::String("rs:statement:000000000000000000000000".into());
        assert!(
            join_merged_doctest(
                &serde_json::to_vec(&tampered).unwrap(),
                &sources,
                &map,
                &authored,
            )
            .is_err()
        );

        assert!(join_merged_doctest(&manifest, &sources, &map, &BTreeMap::new(),).is_err());

        let mut synthetic: serde_json::Value = serde_json::from_slice(&manifest).unwrap();
        synthetic["points"][0]["canonical"] = serde_json::Value::String(
            concat!(
                "rust-source-v1\0statement\0doctest-pending:fixture\0",
                "1\0",
                "2\0expression\0synthetic-expansion\0"
            )
            .into(),
        );
        assert!(
            join_merged_doctest(
                &serde_json::to_vec(&synthetic).unwrap(),
                &sources,
                &map,
                &authored,
            )
            .is_err()
        );
    }

    #[test]
    fn rebases_decision_match_cross_references_and_runtime_ordinals() {
        let key = "doctest-pending:fixture";
        let body = concat!(
            "let flag = true;\n",
            "if flag { yes(); } else { no(); }\n",
            "match flag { true => yes(), false => no() };",
        );
        let bundle = merged_bundle(body);
        let range = |fragment: &str| {
            let start = bundle.find(fragment).unwrap() as u32;
            (start, start + fragment.len() as u32)
        };
        let point_range = range("let flag = true;");
        let if_range = range("if flag { yes(); } else { no(); }");
        let if_flag_start = if_range.0 + "if ".len() as u32;
        let if_flag_end = if_flag_start + "flag".len() as u32;
        let match_range = range("match flag { true => yes(), false => no() }");
        let first_arm_range = range("true => yes()");
        let second_arm_range = range("false => no()");
        let match_start = match_range.0 as usize;
        let first_body_start = match_start + bundle[match_start..].find("yes()").unwrap();
        let second_body_start = match_start + bundle[match_start..].find("no()").unwrap();
        let first_body_range = (
            first_body_start as u32,
            (first_body_start + "yes()".len()) as u32,
        );
        let second_body_range = (
            second_body_start as u32,
            (second_body_start + "no()".len()) as u32,
        );

        let point_identity =
            pending_identity("statement", key, point_range.0, point_range.1, "let").unwrap();
        let decision_identity =
            pending_identity("decision", key, if_flag_start, if_flag_end, "if").unwrap();
        let outcome = pending_branch(
            key,
            if_range.0,
            if_range.1,
            "decision-outcome",
            "decision-outcome:if",
            [("true", "condition true"), ("false", "condition false")],
        );
        let group_identity =
            pending_identity("match-group", key, match_range.0, match_range.1, "match").unwrap();
        let first_arm = pending_branch(
            key,
            first_arm_range.0,
            first_arm_range.1,
            "match-arm",
            &format!("match-arm:{}:0", group_identity.id),
            [("not-selected", "not selected"), ("selected", "selected")],
        );
        let second_arm = pending_branch(
            key,
            second_arm_range.0,
            second_arm_range.1,
            "match-arm",
            &format!("match-arm:{}:1", group_identity.id),
            [("not-selected", "not selected"), ("selected", "selected")],
        );
        let arm_ordinals = |branch: &RustCompilerBranch| {
            let ordinal = |label: &str| {
                branch
                    .alternatives
                    .iter()
                    .find(|alternative| alternative.label == label)
                    .unwrap()
                    .probe_ordinal
                    .clone()
            };
            (ordinal("selected"), ordinal("not selected"))
        };
        let first_ordinals = arm_ordinals(&first_arm);
        let second_ordinals = arm_ordinals(&second_arm);
        let mut branches = vec![outcome.clone(), first_arm.clone(), second_arm.clone()];
        branches.sort_by(|left, right| left.id.cmp(&right.id));
        let manifest = RustCompilerManifest {
            unmeasured_obligations: Vec::new(),
            schema: "supercov-rust-manifest-candidate-v4".into(),
            model: "rust-source-v1".into(),
            crate_name: "doctest_bundle_2024".into(),
            measurement_complete: false,
            bound_bodies: 1,
            points: vec![RustCompilerPoint {
                id: point_identity.id,
                kind: "statement".into(),
                source_key: key.into(),
                start: point_range.0,
                end: point_range.1,
                provenance: "doctest-pending".into(),
                discriminator: "let".into(),
                probe_ordinal: point_identity.probe_ordinal.to_string(),
                definitions: vec!["__doctest_0::main".into()],
                canonical: point_identity.canonical,
            }],
            branches,
            decisions: vec![RustCompilerDecision {
                id: decision_identity.id,
                kind: "if".into(),
                source_key: key.into(),
                start: if_flag_start,
                end: if_flag_end,
                provenance: "doctest-pending".into(),
                probe_ordinal: decision_identity.probe_ordinal.to_string(),
                definitions: vec!["__doctest_0::main".into()],
                outcome_branch_id: outcome.id,
                loop_branch_id: None,
                logical_selections: Vec::new(),
                conditions: vec![RustCompilerCondition {
                    source_key: key.into(),
                    start: if_flag_start,
                    end: if_flag_end,
                    source: "flag".into(),
                }],
                canonical: decision_identity.canonical,
            }],
            selection_groups: vec![RustCompilerSelectionGroup {
                id: group_identity.id,
                kind: "match".into(),
                source_key: key.into(),
                start: match_range.0,
                end: match_range.1,
                provenance: "doctest-pending".into(),
                probe_ordinal: group_identity.probe_ordinal.to_string(),
                definitions: vec!["__doctest_0::main".into()],
                parent_group_id: None,
                parent_site: None,
                parent_arm_index: None,
                arms: vec![
                    RustCompilerMatchArm {
                        branch_id: first_arm.id,
                        body_source_key: key.into(),
                        body_start: first_body_range.0,
                        body_end: first_body_range.1,
                        guarded: false,
                        guard_decision_id: None,
                        selected_ordinal: first_ordinals.0,
                        not_selected_ordinal: first_ordinals.1,
                    },
                    RustCompilerMatchArm {
                        branch_id: second_arm.id,
                        body_source_key: key.into(),
                        body_start: second_body_range.0,
                        body_end: second_body_range.1,
                        guarded: false,
                        guard_decision_id: None,
                        selected_ordinal: second_ordinals.0,
                        not_selected_ordinal: second_ordinals.1,
                    },
                ],
                canonical: group_identity.canonical,
            }],
            limitations: vec!["RUST_DOCTEST_MAPPING_PENDING".into()],
        };
        let snapshots = RustCompilerSourceSnapshots {
            schema: "supercov-rust-source-snapshots-v1".into(),
            crate_name: manifest.crate_name.clone(),
            sources: BTreeMap::from([(
                key.into(),
                RustCompilerSource {
                    file: key.into(),
                    source: bundle,
                },
            )]),
        };
        let authored = concat!(
            "//! docs\n",
            "//! ```\n",
            "//! let flag = true;\n",
            "//! if flag { yes(); } else { no(); }\n",
            "//! match flag { true => yes(), false => no() };\n",
            "//! ```\n",
        );
        let map = br#"{
            "schema":"supercov-rustdoc-merged-map-v2",
            "group":"fixture",
            "entries":[{
                "module":"__doctest_0",
                "displayName":"src/lib.rs - (line 3)",
                "path":"src/lib.rs",
                "line":3,
                "ignored":false,
                "noRun":false,
                "shouldPanic":false
            }]
        }"#;
        let joined = join_merged_doctest(
            &serde_json::to_vec(&manifest).unwrap(),
            &serde_json::to_vec(&snapshots).unwrap(),
            map,
            &BTreeMap::from([(
                "source:src/lib.rs".into(),
                RustCompilerSource {
                    file: "src/lib.rs".into(),
                    source: authored.into(),
                },
            )]),
        )
        .expect("decision and match join");

        let decision = &joined.manifest.decisions[0];
        assert!(
            joined
                .manifest
                .branches
                .iter()
                .any(|branch| branch.id == decision.outcome_branch_id)
        );
        let group = &joined.manifest.selection_groups[0];
        assert!(group.id.starts_with("rs:match-group:"));
        for arm in &group.arms {
            let branch = joined
                .manifest
                .branches
                .iter()
                .find(|branch| branch.id == arm.branch_id)
                .unwrap();
            assert!(branch.discriminator.contains(&group.id));
            assert!(
                branch
                    .alternatives
                    .iter()
                    .any(|alternative| alternative.probe_ordinal == arm.selected_ordinal)
            );
            assert!(
                branch
                    .alternatives
                    .iter()
                    .any(|alternative| alternative.probe_ordinal == arm.not_selected_ordinal)
            );
        }
        assert!(
            joined.manifest.decisions[0]
                .conditions
                .iter()
                .all(|condition| condition.source_key == "source:src/lib.rs")
        );
        assert_eq!(joined.obligation_ids.len(), 12);
        assert_eq!(joined.probe_ordinals.len(), 12);
    }

    #[test]
    fn rebases_complete_synthetic_expansion_canonicals_without_guessing() {
        let (manifest, sources, map, authored) = pending_assertion_candidate();
        let mut manifest = RustCompilerManifest::parse_pending_doctest(&manifest, "fixture")
            .expect("pending candidate");
        let key = "doctest-pending:fixture";
        let mut owner_ordinal = 1;
        let mut replace = |kind: &str,
                           start: u32,
                           end: u32,
                           discriminator: &str,
                           id: &mut String,
                           canonical: &mut String,
                           ordinal: &mut String| {
            let identity =
                synthetic_pending_identity(kind, key, start, end, discriminator, owner_ordinal);
            owner_ordinal += 1;
            *id = identity.id;
            *canonical = identity.canonical;
            *ordinal = identity.probe_ordinal.to_string();
        };
        for point in &mut manifest.points {
            replace(
                &point.kind,
                point.start,
                point.end,
                &point.discriminator,
                &mut point.id,
                &mut point.canonical,
                &mut point.probe_ordinal,
            );
        }
        for branch in &mut manifest.branches {
            replace(
                "branch",
                branch.start,
                branch.end,
                &branch.discriminator,
                &mut branch.id,
                &mut branch.canonical,
                &mut branch.probe_ordinal,
            );
            for alternative in &mut branch.alternatives {
                let discriminator = alternative_discriminator(
                    &branch.discriminator,
                    &branch.kind,
                    &alternative.label,
                )
                .unwrap();
                replace(
                    "branch-alternative",
                    branch.start,
                    branch.end,
                    &discriminator,
                    &mut alternative.id,
                    &mut alternative.canonical,
                    &mut alternative.probe_ordinal,
                );
            }
        }
        let branch_id = manifest.branches[0].id.clone();
        for decision in &mut manifest.decisions {
            replace(
                "decision",
                decision.start,
                decision.end,
                &decision.kind,
                &mut decision.id,
                &mut decision.canonical,
                &mut decision.probe_ordinal,
            );
            decision.outcome_branch_id = branch_id.clone();
        }
        manifest
            .points
            .sort_by(|left, right| left.id.cmp(&right.id));
        manifest
            .branches
            .sort_by(|left, right| left.id.cmp(&right.id));
        manifest
            .decisions
            .sort_by(|left, right| left.id.cmp(&right.id));

        let joined = join_merged_doctest(
            &serde_json::to_vec(&manifest).unwrap(),
            &sources,
            &map,
            &authored,
        )
        .expect("synthetic expansion join");
        assert!(
            joined
                .manifest
                .points
                .iter()
                .all(|point| point.provenance == "synthetic-expansion")
        );
        assert!(
            joined
                .manifest
                .branches
                .iter()
                .all(|branch| branch.provenance == "synthetic-expansion"
                    && branch.alternatives.iter().all(|alternative| {
                        alternative.canonical.contains("source:src/lib.rs")
                            && !alternative.canonical.contains("doctest-pending:")
                    }))
        );
        assert!(
            joined
                .manifest
                .decisions
                .iter()
                .all(|decision| decision.provenance == "synthetic-expansion")
        );
        for canonical in joined
            .manifest
            .points
            .iter()
            .map(|point| &point.canonical)
            .chain(joined.manifest.branches.iter().flat_map(|branch| {
                std::iter::once(&branch.canonical).chain(
                    branch
                        .alternatives
                        .iter()
                        .map(|alternative| &alternative.canonical),
                )
            }))
            .chain(
                joined
                    .manifest
                    .decisions
                    .iter()
                    .map(|decision| &decision.canonical),
            )
        {
            assert!(canonical.contains("doctest:src/lib.rs:3"));
            assert!(!canonical.contains("__doctest_0"));
            assert!(!canonical.contains("doctest-pending:"));
        }
        assert_eq!(joined.obligation_ids.len(), 5);
        assert_eq!(joined.probe_ordinals.len(), 5);
    }

    #[test]
    fn translates_deferred_runtime_ids_ordinals_and_nested_assertion_contexts() {
        let (pending_manifest, sources, map, authored) = pending_assertion_candidate();
        let pending = RustCompilerManifest::parse_pending_doctest(&pending_manifest, "fixture")
            .expect("pending candidate");
        let mut joined = join_merged_doctest(&pending_manifest, &sources, &map, &authored)
            .expect("strict merged join");
        let old_point = &pending.points[0];
        let old_outer = &pending.decisions[0].id;
        let final_outer = joined.obligation_ids[old_outer].clone();
        let old_inner = "rs:decision:111111111111111111111111".to_owned();
        let final_inner = "rs:decision:222222222222222222222222".to_owned();
        joined
            .obligation_ids
            .insert(old_inner.clone(), final_inner.clone());

        let base = 42;
        let outer_nonce = 7;
        let inner_nonce = 8;
        let old_outer_context =
            rust_assertion_context_id(base, old_outer, outer_nonce).expect("old outer context");
        let old_inner_context =
            rust_assertion_context_id(old_outer_context, &old_inner, inner_nonce)
                .expect("old inner context");
        let final_outer_context =
            rust_assertion_context_id(base, &final_outer, outer_nonce).expect("final outer");
        let final_inner_context =
            rust_assertion_context_id(final_outer_context, &final_inner, inner_nonce)
                .expect("final inner");
        let dependency = "rs:function:333333333333333333333333";
        let read = RustTransportRead {
            observations: vec![
                RustTransportObservation {
                    process_id: 10,
                    context_id: old_outer_context,
                    observation: RustProbeObservation::Hit {
                        id: old_point.id.clone(),
                    },
                },
                RustTransportObservation {
                    process_id: 10,
                    context_id: old_inner_context,
                    observation: RustProbeObservation::Decision {
                        id: old_inner.clone(),
                        values: vec![Some(true)],
                        outcome: true,
                    },
                },
                RustTransportObservation {
                    process_id: 10,
                    context_id: 0,
                    observation: RustProbeObservation::Hit {
                        id: dependency.into(),
                    },
                },
            ],
            ordinal_hits: vec![RustOrdinalHit {
                process_id: 10,
                context_id: old_outer_context,
                ordinal: old_point.probe_ordinal.parse().unwrap(),
            }],
            // Deliberately child-first: transport descriptor order is not a
            // topological guarantee and the rewriter must not depend on it.
            phases: vec![
                RustPhaseContext {
                    process_id: 10,
                    child_context_id: old_inner_context,
                    parent_context_id: old_outer_context,
                    invocation_nonce: inner_nonce,
                    decision_id: old_inner,
                },
                RustPhaseContext {
                    process_id: 10,
                    child_context_id: old_outer_context,
                    parent_context_id: base,
                    invocation_nonce: outer_nonce,
                    decision_id: old_outer.clone(),
                },
            ],
            committed: 6,
            incomplete: 1,
            dropped: 0,
            attachments: 2,
            ..RustTransportRead::empty()
        };

        let translated = joined
            .translate_transport(base, &read)
            .expect("exact transport translation");
        assert_eq!(translated.committed, read.committed);
        assert_eq!(translated.incomplete, read.incomplete);
        assert_eq!(translated.attachments, read.attachments);
        assert_eq!(translated.observations[0].context_id, final_outer_context);
        assert_eq!(translated.observations[1].context_id, final_inner_context);
        assert_eq!(translated.observations[2], read.observations[2]);
        assert!(matches!(
            &translated.observations[0].observation,
            RustProbeObservation::Hit { id }
                if id == &joined.obligation_ids[&old_point.id]
        ));
        assert!(matches!(
            &translated.observations[1].observation,
            RustProbeObservation::Decision { id, .. } if id == &final_inner
        ));
        assert_eq!(translated.ordinal_hits[0].context_id, final_outer_context);
        assert_eq!(
            translated.ordinal_hits[0].ordinal.to_string(),
            joined.probe_ordinals[&old_point.probe_ordinal]
        );
        assert_eq!(translated.phases[0].child_context_id, final_inner_context);
        assert_eq!(translated.phases[0].parent_context_id, final_outer_context);
        assert_eq!(translated.phases[0].decision_id, final_inner);
        assert_eq!(translated.phases[1].child_context_id, final_outer_context);
        assert_eq!(translated.phases[1].parent_context_id, base);
        assert_eq!(translated.phases[1].decision_id, final_outer);
    }

    #[test]
    fn combines_canonical_and_merged_runtime_roots_into_one_exact_doctest() {
        let (pending_manifest, sources, map_bytes, authored) = pending_assertion_candidate();
        let pending = RustCompilerManifest::parse_pending_doctest(&pending_manifest, "fixture")
            .expect("pending candidate");
        let joined = join_merged_doctest(&pending_manifest, &sources, &map_bytes, &authored)
            .expect("strict merged join");
        let final_point = joined.obligation_ids[&pending.points[0].id].clone();
        let catalog = catalog_doctest(
            "src/lib.rs - (line 3)",
            3,
            false,
            false,
            false,
            false,
            false,
        );
        let merged_entry = map().entries[0].clone();
        let canonical_name = "rustdoc:fixture:src/lib.rs:3";
        let merged_name = "rustdoc:fixture:__doctest_0";
        let canonical = rust_test_context_id(canonical_name).expect("canonical context");
        let merged = rust_test_context_id(merged_name).expect("merged context");
        assert_ne!(canonical, merged);
        let entry = RustdocJoinedOutcome {
            catalog_index: 0,
            catalog,
            merged_entry: Some(merged_entry),
            state: RustdocJoinedOutcomeState::Completed {
                outcome: outcome("src/lib.rs - (line 3)", RustdocOutcomeStatus::Passed),
            },
        };
        let group = RustdocOutcomeGroupJoin {
            invocation_id: "1".repeat(64),
            group: "fixture".into(),
            companion_build_id: "2".repeat(64),
            raw_catalog_sha256: "3".repeat(64),
            raw_events_sha256: "4".repeat(64),
            transport_sha256: "5".repeat(64),
            join: Some(joined),
            transport: RustTransportRead {
                observations: vec![
                    RustTransportObservation {
                        process_id: 10,
                        context_id: canonical,
                        observation: RustProbeObservation::Hit {
                            id: final_point.clone(),
                        },
                    },
                    RustTransportObservation {
                        process_id: 11,
                        context_id: merged,
                        observation: RustProbeObservation::Hit {
                            id: pending.points[0].id.clone(),
                        },
                    },
                ],
                ordinal_hits: Vec::new(),
                phases: Vec::new(),
                committed: 2,
                incomplete: 0,
                dropped: 0,
                attachments: 2,
                ..RustTransportRead::empty()
            },
            entries: vec![entry.clone()],
            ambiguous_filtered_out: 0,
            ambiguous_unstarted_tests: 0,
        };

        let (base, combined) = group
            .attributed_transport(&entry)
            .expect("canonical plus merged transport");
        assert_eq!(base, canonical);
        assert_eq!(combined.committed, 2);
        assert_eq!(combined.observations.len(), 2);
        assert!(
            combined
                .observations
                .iter()
                .all(|observation| observation.context_id == canonical)
        );
        assert!(combined.observations.iter().all(|observation| {
            matches!(
                &observation.observation,
                RustProbeObservation::Hit { id } if id == &final_point
            )
        }));
    }

    #[test]
    fn doctest_thread_phases_are_join_bounded_and_escapes_become_background() {
        let canonical_name = "rustdoc:fixture:src/lib.rs:3";
        let canonical = rust_test_context_id(canonical_name).expect("canonical context");
        let joined_thread = rust_thread_context_id(canonical, 0);
        let escaped_thread = rust_thread_context_id(canonical, 1);
        let hit = |context_id: u64| RustTransportObservation {
            process_id: 10,
            context_id,
            observation: RustProbeObservation::Hit {
                id: "rs:statement:0123456789abcdef01234567".into(),
            },
        };
        let entry = RustdocJoinedOutcome {
            catalog_index: 0,
            catalog: catalog_doctest(
                "src/lib.rs - (line 3)",
                3,
                false,
                false,
                false,
                false,
                false,
            ),
            merged_entry: None,
            state: RustdocJoinedOutcomeState::Completed {
                outcome: outcome("src/lib.rs - (line 3)", RustdocOutcomeStatus::Passed),
            },
        };
        let group = RustdocOutcomeGroupJoin {
            invocation_id: "1".repeat(64),
            group: "fixture".into(),
            companion_build_id: "2".repeat(64),
            raw_catalog_sha256: "3".repeat(64),
            raw_events_sha256: "4".repeat(64),
            transport_sha256: "5".repeat(64),
            join: None,
            transport: RustTransportRead {
                observations: vec![hit(joined_thread), hit(escaped_thread), hit(0)],
                thread_phases: vec![
                    RustThreadPhase {
                        process_id: 10,
                        child_context_id: joined_thread,
                        parent_context_id: canonical,
                        invocation_nonce: 0,
                        commit_index: 0,
                    },
                    RustThreadPhase {
                        process_id: 10,
                        child_context_id: escaped_thread,
                        parent_context_id: canonical,
                        invocation_nonce: 1,
                        commit_index: 1,
                    },
                ],
                thread_ends: vec![RustThreadEnd {
                    process_id: 10,
                    context_id: joined_thread,
                    commit_index: 4,
                }],
                test_boundaries: vec![RustTestBoundary {
                    process_id: 10,
                    context_id: canonical,
                    commit_index: 5,
                }],
                committed: 7,
                attachments: 1,
                ..RustTransportRead::empty()
            },
            entries: vec![entry.clone()],
            ambiguous_filtered_out: 0,
            ambiguous_unstarted_tests: 0,
        };
        group
            .validate_transport_ownership()
            .expect("thread-kind records stay within known doctest roots");

        let (base, attributed) = group
            .attributed_transport(&entry)
            .expect("join-bounded canonical transport");
        assert_eq!(base, canonical);
        // Joined thread phase, its end, its hit and the boundary are exact.
        assert_eq!(attributed.committed, 4);
        assert_eq!(attributed.observations, vec![hit(joined_thread)]);
        assert_eq!(attributed.thread_phases.len(), 1);
        assert_eq!(attributed.thread_ends.len(), 1);
        assert_eq!(attributed.test_boundaries.len(), 1);

        let background = group.background_transport().expect("background transport");
        assert_eq!(background.committed, 3);
        assert_eq!(background.observations, vec![hit(escaped_thread), hit(0)]);
        assert_eq!(background.thread_phases.len(), 1);
        assert_eq!(background.thread_phases[0].child_context_id, escaped_thread);

        assert_eq!(
            group.thread_scope_limitations().expect("limitations"),
            std::collections::BTreeSet::from([format!(
                "RUST_THREAD_OUTLIVED_TEST: thread phase {escaped_thread:016x} escaped test {canonical:016x}"
            )])
        );

        // A boundary for an unknown context fails ownership validation.
        let mut unknown_boundary = group;
        unknown_boundary
            .transport
            .test_boundaries
            .push(RustTestBoundary {
                process_id: 10,
                context_id: 99,
                commit_index: 6,
            });
        unknown_boundary.transport.committed = 8;
        assert!(unknown_boundary.validate_transport_ownership().is_err());
    }

    #[test]
    fn resolves_a_complete_compiler_generation_before_normalization() {
        let (pending_manifest, pending_sources, map, authored) = pending_assertion_candidate();
        let direct =
            join_merged_doctest(&pending_manifest, &pending_sources, &map, &authored).unwrap();
        let ordinary_manifest = serde_json::to_vec(&direct.manifest).unwrap();
        let ordinary_sources = serde_json::to_vec(&direct.sources).unwrap();

        let resolved = resolve_merged_doctest_candidates(
            vec![
                (pending_manifest.clone(), pending_sources.clone()),
                (ordinary_manifest.clone(), ordinary_sources.clone()),
            ],
            vec![map.clone()],
        )
        .expect("generation join");
        assert_eq!(resolved.candidates.len(), 2);
        assert_eq!(resolved.merged_units.len(), 1);
        assert_eq!(resolved.merged_units[0].join.as_ref().unwrap(), &direct);
        normalize_rust_compiler_candidates(resolved.candidates).unwrap();

        let no_obligations = resolve_merged_doctest_candidates(
            vec![(ordinary_manifest, ordinary_sources)],
            vec![map.clone()],
        )
        .expect("map-only test remains attributable");
        assert!(no_obligations.merged_units[0].join.is_none());

        assert!(
            resolve_merged_doctest_candidates(
                vec![(pending_manifest.clone(), pending_sources.clone())],
                Vec::new(),
            )
            .is_err()
        );
        assert!(
            resolve_merged_doctest_candidates(
                vec![(pending_manifest, pending_sources)],
                vec![map.clone(), map],
            )
            .is_err()
        );
    }
}
