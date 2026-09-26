//! Strict ingestion of the private rustc companion's manifest candidate.

use std::collections::{BTreeMap, BTreeSet};

use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Digest, Sha256};

use crate::{
    coverage_analysis::PointKind,
    coverage_report::{
        BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
    },
};

const SCHEMA: &str = "supercov-rust-manifest-candidate-v4";
const MODEL: &str = "rust-source-v1";
const SOURCE_SNAPSHOT_SCHEMA: &str = "supercov-rust-source-snapshots-v1";
const SOURCE_FINGERPRINT_DOMAIN: &[u8] = b"supercov-rust-compiler-sources-v1\0";

fn append_fingerprint_field(hash: &mut Sha256, value: &[u8]) {
    hash.update((value.len() as u64).to_le_bytes());
    hash.update(value);
}

fn compiler_source_fingerprint(sources: &BTreeMap<String, RustCompilerSource>) -> (String, usize) {
    let mut hash = Sha256::new();
    hash.update(SOURCE_FINGERPRINT_DOMAIN);
    let mut generated_files = 0;
    for (key, source) in sources {
        generated_files += usize::from(key.starts_with("generated:package:"));
        append_fingerprint_field(&mut hash, key.as_bytes());
        append_fingerprint_field(&mut hash, source.file.as_bytes());
        append_fingerprint_field(&mut hash, source.source.as_bytes());
    }
    (format!("{:x}", hash.finalize()), generated_files)
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerManifest {
    pub schema: String,
    pub model: String,
    #[serde(rename = "crate")]
    pub crate_name: String,
    pub measurement_complete: bool,
    /// Bodies whose obligations were actually bound, not merely collected.
    /// Collected counts come from HIR and do not move when binding stops, so
    /// this is the number that falls if checking is skipped.
    #[serde(default)]
    pub bound_bodies: u64,
    pub points: Vec<RustCompilerPoint>,
    pub branches: Vec<RustCompilerBranch>,
    pub decisions: Vec<RustCompilerDecision>,
    pub selection_groups: Vec<RustCompilerSelectionGroup>,
    pub limitations: Vec<String>,
    /// Obligations the compiler frontend declined to measure exactly.
    #[serde(default)]
    pub unmeasured_obligations: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerPoint {
    pub id: String,
    pub kind: String,
    pub source_key: String,
    pub start: u32,
    pub end: u32,
    pub provenance: String,
    pub discriminator: String,
    pub probe_ordinal: String,
    pub definitions: Vec<String>,
    pub canonical: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerBranchAlternative {
    pub id: String,
    pub label: String,
    pub probe_ordinal: String,
    pub canonical: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerBranch {
    pub id: String,
    pub kind: String,
    pub discriminator: String,
    pub source_key: String,
    pub start: u32,
    pub end: u32,
    pub provenance: String,
    pub probe_ordinal: String,
    pub definitions: Vec<String>,
    pub alternatives: Vec<RustCompilerBranchAlternative>,
    pub canonical: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerCondition {
    pub source_key: String,
    pub start: u32,
    pub end: u32,
    pub source: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerLogicalSelection {
    pub branch_id: String,
    pub right_condition_index: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerDecision {
    pub id: String,
    pub kind: String,
    pub source_key: String,
    pub start: u32,
    pub end: u32,
    pub provenance: String,
    pub probe_ordinal: String,
    pub definitions: Vec<String>,
    pub outcome_branch_id: String,
    pub loop_branch_id: Option<String>,
    pub logical_selections: Vec<RustCompilerLogicalSelection>,
    pub conditions: Vec<RustCompilerCondition>,
    pub canonical: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerMatchArm {
    pub branch_id: String,
    pub body_source_key: String,
    pub body_start: u32,
    pub body_end: u32,
    pub guarded: bool,
    pub guard_decision_id: Option<String>,
    pub selected_ordinal: String,
    pub not_selected_ordinal: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerSelectionGroup {
    pub id: String,
    pub kind: String,
    pub source_key: String,
    pub start: u32,
    pub end: u32,
    pub provenance: String,
    pub probe_ordinal: String,
    pub definitions: Vec<String>,
    pub parent_group_id: Option<String>,
    pub parent_site: Option<String>,
    pub parent_arm_index: Option<usize>,
    pub arms: Vec<RustCompilerMatchArm>,
    pub canonical: String,
}

/// Source bytes are supplied independently from the compiler manifest so the
/// engine never resolves a compiler key by guessing at the user's filesystem.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerSource {
    pub file: String,
    pub source: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerSourceSnapshots {
    pub schema: String,
    #[serde(rename = "crate")]
    pub crate_name: String,
    pub sources: BTreeMap<String, RustCompilerSource>,
}

impl RustCompilerSourceSnapshots {
    pub fn parse(bytes: &[u8]) -> Result<Self, RustCompilerManifestError> {
        let snapshots: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustCompilerManifestError::Json(error.to_string()))?;
        snapshots.validate()?;
        Ok(snapshots)
    }

    pub fn validate(&self) -> Result<(), RustCompilerManifestError> {
        self.validate_with_pending_doctest(None)
    }

    pub(crate) fn parse_pending_doctest(
        bytes: &[u8],
        group: &str,
    ) -> Result<Self, RustCompilerManifestError> {
        let snapshots: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustCompilerManifestError::Json(error.to_string()))?;
        snapshots.validate_with_pending_doctest(Some(group))?;
        Ok(snapshots)
    }

    fn validate_with_pending_doctest(
        &self,
        pending_group: Option<&str>,
    ) -> Result<(), RustCompilerManifestError> {
        if self.schema != SOURCE_SNAPSHOT_SCHEMA
            || self.crate_name.trim().is_empty()
            || self.sources.is_empty()
            || self.sources.iter().any(|(key, source)| {
                !valid_source_key_for(key, pending_group)
                    || source.file.trim().is_empty()
                    || source.file.chars().any(char::is_control)
            })
        {
            return Err(RustCompilerManifestError::InvalidSource(
                "malformed compiler source snapshot envelope".into(),
            ));
        }
        if let Some(group) = pending_group {
            let key = format!("doctest-pending:{group}");
            if !self.crate_name.starts_with("doctest_bundle_")
                || self.sources.len() != 1
                || self
                    .sources
                    .get(&key)
                    .is_none_or(|source| source.file != key)
            {
                return Err(RustCompilerManifestError::InvalidSource(
                    "malformed pending merged-doctest source envelope".into(),
                ));
            }
        }
        Ok(())
    }
}

/// Runtime ordinal semantics retained alongside the language-neutral
/// manifest. A single selected match arm can cover its selected alternative
/// and the not-selected alternatives of every sibling in the evaluated group.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedRustCompilerManifest {
    pub manifest: CoverageManifest,
    pub hit_obligations_by_ordinal: BTreeMap<u64, Vec<String>>,
    pub internal_ordinals: BTreeSet<u64>,
    pub decision_outcome_obligations: BTreeMap<String, (String, String)>,
    pub decision_loop_obligations: BTreeMap<String, (String, String)>,
    pub decision_logical_selection_obligations:
        BTreeMap<String, Vec<NormalizedRustLogicalSelection>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedRustLogicalSelection {
    pub short_circuited_id: String,
    pub right_evaluated_id: String,
    pub right_condition_index: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerNormalizationRequest {
    pub manifest: RustCompilerManifest,
    pub sources: BTreeMap<String, RustCompilerSource>,
}

impl RustCompilerNormalizationRequest {
    pub fn parse_and_normalize(
        bytes: &[u8],
    ) -> Result<NormalizedRustCompilerManifest, RustCompilerManifestError> {
        let request: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustCompilerManifestError::Json(error.to_string()))?;
        request.manifest.normalize(&request.sources)
    }
}

pub fn normalize_rust_compiler_candidates(
    candidates: Vec<(RustCompilerManifest, RustCompilerSourceSnapshots)>,
) -> Result<NormalizedRustCompilerManifest, RustCompilerManifestError> {
    if candidates.is_empty() {
        return Err(RustCompilerManifestError::Invalid(
            "compiler build emitted no owned Rust denominator".into(),
        ));
    }
    let mut crate_names = BTreeSet::new();
    let mut points = BTreeMap::<String, RustCompilerPoint>::new();
    let mut branches = BTreeMap::<String, RustCompilerBranch>::new();
    let mut decisions = BTreeMap::<String, RustCompilerDecision>::new();
    let mut groups = BTreeMap::<String, RustCompilerSelectionGroup>::new();
    let mut limitations = BTreeSet::new();
    let mut unmeasured_obligations = BTreeSet::new();
    let mut sources = BTreeMap::<String, RustCompilerSource>::new();
    let mut bound_bodies = 0_u64;
    for (manifest, snapshots) in candidates {
        manifest.validate()?;
        bound_bodies = bound_bodies.saturating_add(manifest.bound_bodies);
        snapshots.validate()?;
        if snapshots.crate_name != manifest.crate_name {
            return Err(RustCompilerManifestError::InvalidSource(format!(
                "compiler manifest/source snapshot identity mismatch for {}",
                manifest.crate_name
            )));
        }
        crate_names.insert(manifest.crate_name);
        limitations.extend(manifest.limitations);
        unmeasured_obligations.extend(manifest.unmeasured_obligations);
        for (key, source) in snapshots.sources {
            if let Some(existing) = sources.insert(key.clone(), source.clone())
                && existing != source
            {
                return Err(RustCompilerManifestError::InvalidSource(format!(
                    "compiler source {key} changed across build units"
                )));
            }
        }
        for point in manifest.points {
            merge_point(&mut points, point)?;
        }
        for branch in manifest.branches {
            merge_branch(&mut branches, branch)?;
        }
        for decision in manifest.decisions {
            merge_decision(&mut decisions, decision)?;
        }
        for group in manifest.selection_groups {
            merge_selection_group(&mut groups, group)?;
        }
    }
    let manifest = RustCompilerManifest {
        schema: SCHEMA.into(),
        model: MODEL.into(),
        crate_name: if crate_names.len() == 1 {
            crate_names.into_iter().next().expect("one crate")
        } else {
            "workspace".into()
        },
        measurement_complete: false,
        bound_bodies,
        points: points.into_values().collect(),
        branches: branches.into_values().collect(),
        decisions: decisions.into_values().collect(),
        selection_groups: groups.into_values().collect(),
        limitations: limitations.into_iter().collect(),
        unmeasured_obligations: unmeasured_obligations.into_iter().collect(),
    };
    manifest.normalize(&sources)
}

fn merge_definitions(destination: &mut Vec<String>, source: Vec<String>) {
    destination.extend(source);
    destination.sort();
    destination.dedup();
}

fn merge_point(
    destination: &mut BTreeMap<String, RustCompilerPoint>,
    point: RustCompilerPoint,
) -> Result<(), RustCompilerManifestError> {
    if let Some(existing) = destination.get_mut(&point.id) {
        let mut left = existing.clone();
        let mut right = point.clone();
        left.definitions.clear();
        right.definitions.clear();
        if left != right {
            return Err(RustCompilerManifestError::Invalid(format!(
                "point {} changed across build units",
                point.id
            )));
        }
        merge_definitions(&mut existing.definitions, point.definitions);
    } else {
        destination.insert(point.id.clone(), point);
    }
    Ok(())
}

fn merge_branch(
    destination: &mut BTreeMap<String, RustCompilerBranch>,
    branch: RustCompilerBranch,
) -> Result<(), RustCompilerManifestError> {
    if let Some(existing) = destination.get_mut(&branch.id) {
        let mut left = existing.clone();
        let mut right = branch.clone();
        left.definitions.clear();
        right.definitions.clear();
        if left != right {
            return Err(RustCompilerManifestError::Invalid(format!(
                "branch {} changed across build units",
                branch.id
            )));
        }
        merge_definitions(&mut existing.definitions, branch.definitions);
    } else {
        destination.insert(branch.id.clone(), branch);
    }
    Ok(())
}

fn merge_decision(
    destination: &mut BTreeMap<String, RustCompilerDecision>,
    decision: RustCompilerDecision,
) -> Result<(), RustCompilerManifestError> {
    if let Some(existing) = destination.get_mut(&decision.id) {
        let mut left = existing.clone();
        let mut right = decision.clone();
        left.definitions.clear();
        right.definitions.clear();
        if left != right {
            return Err(RustCompilerManifestError::Invalid(format!(
                "decision {} changed across build units",
                decision.id
            )));
        }
        merge_definitions(&mut existing.definitions, decision.definitions);
    } else {
        destination.insert(decision.id.clone(), decision);
    }
    Ok(())
}

fn merge_selection_group(
    destination: &mut BTreeMap<String, RustCompilerSelectionGroup>,
    group: RustCompilerSelectionGroup,
) -> Result<(), RustCompilerManifestError> {
    if let Some(existing) = destination.get_mut(&group.id) {
        let mut left = existing.clone();
        let mut right = group.clone();
        left.definitions.clear();
        right.definitions.clear();
        if left != right {
            return Err(RustCompilerManifestError::Invalid(format!(
                "selection group {} changed across build units",
                group.id
            )));
        }
        merge_definitions(&mut existing.definitions, group.definitions);
    } else {
        destination.insert(group.id.clone(), group);
    }
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustCompilerManifestError {
    Json(String),
    Invalid(String),
    MissingSource(String),
    InvalidSource(String),
}

impl std::fmt::Display for RustCompilerManifestError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(error) => write!(formatter, "invalid Rust compiler manifest JSON: {error}"),
            Self::Invalid(error) => write!(formatter, "invalid Rust compiler manifest: {error}"),
            Self::MissingSource(key) => {
                write!(
                    formatter,
                    "Rust compiler manifest source {key} was not supplied"
                )
            }
            Self::InvalidSource(error) => {
                write!(formatter, "invalid Rust compiler manifest source: {error}")
            }
        }
    }
}

impl std::error::Error for RustCompilerManifestError {}

fn sorted_unique_nonempty(values: &[String]) -> bool {
    !values.is_empty()
        && values.iter().all(|value| !value.trim().is_empty())
        && values.windows(2).all(|pair| pair[0] < pair[1])
}

fn valid_id(id: &str, allowed: &[&str]) -> bool {
    let mut parts = id.split(':');
    parts.next() == Some("rs")
        && parts.next().is_some_and(|kind| allowed.contains(&kind))
        && parts.next().is_some_and(|digest| {
            digest.len() == 24 && digest.bytes().all(|byte| byte.is_ascii_hexdigit())
        })
        && parts.next().is_none()
}

fn normalized_relative_path(value: &str, allow_package_root: bool) -> bool {
    if allow_package_root && value == "." {
        return true;
    }
    !value.is_empty()
        && !value.starts_with('/')
        && !value.contains('\\')
        && value
            .split('/')
            .all(|component| !component.is_empty() && !matches!(component, "." | ".."))
}

fn valid_source_key(key: &str) -> bool {
    if let Some(path) = key.strip_prefix("source:") {
        return normalized_relative_path(path, false);
    }
    let Some(generated) = key.strip_prefix("generated:package:") else {
        return false;
    };
    let Some((package, output)) = generated.split_once(':') else {
        return false;
    };
    normalized_relative_path(package, true) && normalized_relative_path(output, false)
}

fn valid_source_key_for(key: &str, pending_group: Option<&str>) -> bool {
    valid_source_key(key)
        || pending_group.is_some_and(|group| key == format!("doctest-pending:{group}"))
}

fn source_range_for(key: &str, start: u32, end: u32, pending_group: Option<&str>) -> bool {
    valid_source_key_for(key, pending_group) && start < end
}

fn ordinal(value: &str) -> Option<u64> {
    value.parse::<u64>().ok().filter(|ordinal| *ordinal != 0)
}

fn provenance_for(value: &str, pending_group: Option<&str>) -> bool {
    matches!(
        value,
        "authored-source"
            | "authored-expansion"
            | "synthetic-expansion"
            | "generated-source"
            | "doctest-source"
    ) || pending_group.is_some() && value == "doctest-pending"
}

fn insert_identity(
    ids: &mut BTreeSet<String>,
    ordinals: &mut BTreeSet<u64>,
    id: &str,
    probe_ordinal: &str,
) -> Result<(), RustCompilerManifestError> {
    if !ids.insert(id.into()) {
        return Err(RustCompilerManifestError::Invalid(format!(
            "duplicate obligation ID {id}"
        )));
    }
    let ordinal = ordinal(probe_ordinal).ok_or_else(|| {
        RustCompilerManifestError::Invalid(format!(
            "obligation {id} has invalid probe ordinal {probe_ordinal}"
        ))
    })?;
    if !ordinals.insert(ordinal) {
        return Err(RustCompilerManifestError::Invalid(format!(
            "duplicate probe ordinal {ordinal}"
        )));
    }
    Ok(())
}

impl RustCompilerManifest {
    pub fn parse(bytes: &[u8]) -> Result<Self, RustCompilerManifestError> {
        let manifest: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustCompilerManifestError::Json(error.to_string()))?;
        manifest.validate()?;
        Ok(manifest)
    }

    pub fn validate(&self) -> Result<(), RustCompilerManifestError> {
        self.validate_with_pending_doctest(None)
    }

    pub(crate) fn parse_pending_doctest(
        bytes: &[u8],
        group: &str,
    ) -> Result<Self, RustCompilerManifestError> {
        let manifest: Self = serde_json::from_slice(bytes)
            .map_err(|error| RustCompilerManifestError::Json(error.to_string()))?;
        manifest.validate_with_pending_doctest(Some(group))?;
        Ok(manifest)
    }

    fn validate_with_pending_doctest(
        &self,
        pending_group: Option<&str>,
    ) -> Result<(), RustCompilerManifestError> {
        let invalid = |reason: &str| RustCompilerManifestError::Invalid(reason.into());
        if self.schema != SCHEMA || self.model != MODEL {
            return Err(invalid("unsupported schema or source model"));
        }
        if self.crate_name.trim().is_empty() || self.measurement_complete {
            return Err(invalid(
                "a private candidate needs a crate identity and cannot claim completeness",
            ));
        }
        if let Some(group) = pending_group
            && (!self.crate_name.starts_with("doctest_bundle_")
                || group.is_empty()
                || !group
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'_' | b'-')))
        {
            return Err(invalid("malformed pending merged-doctest identity"));
        }
        if self.points.is_empty() || !sorted_unique_nonempty(&self.limitations) {
            return Err(invalid(
                "a candidate needs points and sorted explicit limitations",
            ));
        }
        if !self.points.windows(2).all(|pair| pair[0].id < pair[1].id)
            || !self.branches.windows(2).all(|pair| pair[0].id < pair[1].id)
            || !self
                .decisions
                .windows(2)
                .all(|pair| pair[0].id < pair[1].id)
            || !self
                .selection_groups
                .windows(2)
                .all(|pair| pair[0].id < pair[1].id)
        {
            return Err(invalid("obligation arrays are not in canonical ID order"));
        }
        if let Some(group) = pending_group {
            let key = format!("doctest-pending:{group}");
            let exact_pending = |source_key: &str, provenance: &str| {
                source_key == key && provenance == "doctest-pending"
            };
            if self
                .points
                .iter()
                .any(|point| !exact_pending(&point.source_key, &point.provenance))
                || self
                    .branches
                    .iter()
                    .any(|branch| !exact_pending(&branch.source_key, &branch.provenance))
                || self.decisions.iter().any(|decision| {
                    !exact_pending(&decision.source_key, &decision.provenance)
                        || decision
                            .conditions
                            .iter()
                            .any(|condition| condition.source_key != key)
                })
                || self.selection_groups.iter().any(|selection| {
                    !exact_pending(&selection.source_key, &selection.provenance)
                        || selection.arms.iter().any(|arm| arm.body_source_key != key)
                })
            {
                return Err(invalid(
                    "pending merged-doctest manifest mixes final and temporary source identities",
                ));
            }
        }

        let mut ids = BTreeSet::new();
        let mut ordinals = BTreeSet::new();
        for point in &self.points {
            if !valid_id(&point.id, &["statement", "function"])
                || !matches!(point.kind.as_str(), "statement" | "function")
                || !source_range_for(&point.source_key, point.start, point.end, pending_group)
                || !provenance_for(&point.provenance, pending_group)
                || !sorted_unique_nonempty(&point.definitions)
                || point.canonical.is_empty()
            {
                return Err(invalid("malformed point obligation"));
            }
            insert_identity(&mut ids, &mut ordinals, &point.id, &point.probe_ordinal)?;
        }
        let mut branch_ids = BTreeSet::new();
        for branch in &self.branches {
            if !valid_id(&branch.id, &["branch"])
                || !matches!(
                    branch.kind.as_str(),
                    "decision-outcome"
                        | "loop-entry"
                        | "match-arm"
                        | "let-else"
                        | "try-operator"
                        | "assertion-outcome"
                        | "logical-selection"
                )
                || !source_range_for(&branch.source_key, branch.start, branch.end, pending_group)
                || !provenance_for(&branch.provenance, pending_group)
                || !sorted_unique_nonempty(&branch.definitions)
                || branch.alternatives.len() < 2
                || (branch.kind == "logical-selection"
                    && !matches!(
                        branch.discriminator.as_str(),
                        "logical-selection:and" | "logical-selection:or"
                    ))
                || branch.canonical.is_empty()
            {
                return Err(invalid("malformed branch obligation"));
            }
            insert_identity(&mut ids, &mut ordinals, &branch.id, &branch.probe_ordinal)?;
            branch_ids.insert(branch.id.as_str());
            let mut labels = BTreeSet::new();
            for alternative in &branch.alternatives {
                if !valid_id(&alternative.id, &["branch-alternative"])
                    || alternative.label.trim().is_empty()
                    || alternative.canonical.is_empty()
                    || !labels.insert(alternative.label.as_str())
                {
                    return Err(invalid("malformed branch alternative"));
                }
                insert_identity(
                    &mut ids,
                    &mut ordinals,
                    &alternative.id,
                    &alternative.probe_ordinal,
                )?;
            }
        }
        let mut decision_ids = BTreeSet::new();
        let mut referenced_logical_branch_ids = BTreeSet::new();
        for decision in &self.decisions {
            if !valid_id(&decision.id, &["decision"])
                || !matches!(
                    decision.kind.as_str(),
                    "if" | "if-let"
                        | "while"
                        | "while-let"
                        | "let-chain"
                        | "match-guard"
                        | "assertion"
                )
                || !source_range_for(
                    &decision.source_key,
                    decision.start,
                    decision.end,
                    pending_group,
                )
                || !provenance_for(&decision.provenance, pending_group)
                || !sorted_unique_nonempty(&decision.definitions)
                || decision.conditions.is_empty()
                || !decision
                    .logical_selections
                    .windows(2)
                    .all(|pair| pair[0].right_condition_index < pair[1].right_condition_index)
                || decision.canonical.is_empty()
                || decision.conditions.iter().any(|condition| {
                    !source_range_for(
                        &condition.source_key,
                        condition.start,
                        condition.end,
                        pending_group,
                    ) || condition.source.trim().is_empty()
                })
            {
                return Err(invalid("malformed decision obligation"));
            }
            for selection in &decision.logical_selections {
                if selection.right_condition_index == 0
                    || selection.right_condition_index >= decision.conditions.len()
                    || !referenced_logical_branch_ids.insert(selection.branch_id.as_str())
                {
                    return Err(invalid("malformed logical-selection relation"));
                }
                let Some(branch) = self
                    .branches
                    .iter()
                    .find(|branch| branch.id == selection.branch_id)
                else {
                    return Err(invalid(
                        "decision references a missing logical-selection branch",
                    ));
                };
                if branch.kind != "logical-selection"
                    || branch
                        .alternatives
                        .iter()
                        .map(|alternative| alternative.label.as_str())
                        .collect::<BTreeSet<_>>()
                        != BTreeSet::from(["right operand evaluated", "short-circuited"])
                {
                    return Err(invalid("decision has a malformed logical-selection branch"));
                }
            }
            let Some(outcome_branch) = self
                .branches
                .iter()
                .find(|branch| branch.id == decision.outcome_branch_id)
            else {
                return Err(invalid("decision references a missing outcome branch"));
            };
            let expected_kind = if decision.kind == "assertion" {
                "assertion-outcome"
            } else {
                "decision-outcome"
            };
            let expected_labels = if decision.kind == "assertion" {
                BTreeSet::from(["failed", "passed"])
            } else {
                BTreeSet::from(["condition false", "condition true"])
            };
            if outcome_branch.kind != expected_kind
                || outcome_branch
                    .alternatives
                    .iter()
                    .map(|alternative| alternative.label.as_str())
                    .collect::<BTreeSet<_>>()
                    != expected_labels
            {
                return Err(invalid("decision has a malformed outcome branch"));
            }
            match (
                decision.kind.starts_with("while"),
                decision.loop_branch_id.as_deref(),
            ) {
                (true, Some(loop_branch_id)) => {
                    let Some(loop_branch) = self
                        .branches
                        .iter()
                        .find(|branch| branch.id == loop_branch_id)
                    else {
                        return Err(invalid("decision references a missing loop-entry branch"));
                    };
                    if loop_branch.kind != "loop-entry"
                        || loop_branch
                            .alternatives
                            .iter()
                            .map(|alternative| alternative.label.as_str())
                            .collect::<BTreeSet<_>>()
                            != BTreeSet::from(["entered", "zero iterations"])
                    {
                        return Err(invalid("decision has a malformed loop-entry branch"));
                    }
                }
                (true, None) => {
                    return Err(invalid("while decision lacks an exact loop-entry branch"));
                }
                (false, Some(_)) => {
                    return Err(invalid("non-while decision references a loop-entry branch"));
                }
                (false, None) => {}
            }
            insert_identity(
                &mut ids,
                &mut ordinals,
                &decision.id,
                &decision.probe_ordinal,
            )?;
            decision_ids.insert(decision.id.as_str());
        }
        let selection_ids = self
            .selection_groups
            .iter()
            .map(|group| group.id.as_str())
            .collect::<BTreeSet<_>>();
        if selection_ids.len() != self.selection_groups.len() {
            return Err(invalid("duplicate match selection group ID"));
        }
        let mut grouped_branch_ids = BTreeSet::new();
        for group in &self.selection_groups {
            if !valid_id(&group.id, &["match-group"])
                || group.kind != "match"
                || !source_range_for(&group.source_key, group.start, group.end, pending_group)
                || !provenance_for(&group.provenance, pending_group)
                || !sorted_unique_nonempty(&group.definitions)
                || group.arms.len() < 2
                || group.canonical.is_empty()
                || group
                    .parent_group_id
                    .as_ref()
                    .is_some_and(|parent| !selection_ids.contains(parent.as_str()))
                || group.parent_site.is_some() != group.parent_group_id.is_some()
                || group
                    .parent_site
                    .as_deref()
                    .is_some_and(|site| !matches!(site, "scrutinee" | "guard" | "body"))
                || match group.parent_site.as_deref() {
                    Some("scrutinee") => group.parent_arm_index.is_some(),
                    Some("guard" | "body") => group.parent_arm_index.is_none(),
                    _ => false,
                }
            {
                return Err(RustCompilerManifestError::Invalid(format!(
                    "malformed match selection group {}: id={} kind={} range={} provenance={} definitions={} arms={} canonical={} parent={} site={} arm={}",
                    group.id,
                    valid_id(&group.id, &["match-group"]),
                    group.kind == "match",
                    source_range_for(&group.source_key, group.start, group.end, pending_group,),
                    provenance_for(&group.provenance, pending_group),
                    sorted_unique_nonempty(&group.definitions),
                    group.arms.len(),
                    !group.canonical.is_empty(),
                    group.parent_group_id.is_some(),
                    group.parent_site.is_some(),
                    group.parent_arm_index.is_some(),
                )));
            }
            insert_identity(&mut ids, &mut ordinals, &group.id, &group.probe_ordinal)?;
            let mut arm_branches = BTreeSet::new();
            for arm in &group.arms {
                if !branch_ids.contains(arm.branch_id.as_str())
                    || !arm_branches.insert(arm.branch_id.as_str())
                    || !grouped_branch_ids.insert(arm.branch_id.as_str())
                    || !source_range_for(
                        &arm.body_source_key,
                        arm.body_start,
                        arm.body_end,
                        pending_group,
                    )
                    || arm.guarded != arm.guard_decision_id.is_some()
                    || arm
                        .guard_decision_id
                        .as_ref()
                        .is_some_and(|guard| !decision_ids.contains(guard.as_str()))
                    || ordinal(&arm.selected_ordinal).is_none()
                    || ordinal(&arm.not_selected_ordinal).is_none()
                {
                    return Err(invalid("malformed match arm mapping"));
                }
                let branch = self
                    .branches
                    .iter()
                    .find(|branch| branch.id == arm.branch_id)
                    .expect("validated branch reference");
                if branch.kind != "match-arm"
                    || branch.alternatives.len() != 2
                    || branch
                        .alternatives
                        .iter()
                        .map(|alternative| alternative.label.as_str())
                        .collect::<BTreeSet<_>>()
                        != BTreeSet::from(["not selected", "selected"])
                {
                    return Err(invalid("match group references a non-match branch"));
                }
                let alternatives = branch
                    .alternatives
                    .iter()
                    .map(|alternative| alternative.probe_ordinal.as_str())
                    .collect::<BTreeSet<_>>();
                if alternatives
                    != BTreeSet::from([
                        arm.selected_ordinal.as_str(),
                        arm.not_selected_ordinal.as_str(),
                    ])
                {
                    return Err(invalid("match arm ordinals do not match its branch"));
                }
            }
        }
        for group in &self.selection_groups {
            let mut visited = BTreeSet::new();
            let mut current = group;
            while let Some(parent_id) = &current.parent_group_id {
                if !visited.insert(current.id.as_str()) {
                    return Err(invalid("cyclic match selection group parentage"));
                }
                let parent = self
                    .selection_groups
                    .iter()
                    .find(|candidate| candidate.id == *parent_id)
                    .expect("validated parent group reference");
                if current
                    .parent_arm_index
                    .is_some_and(|index| index >= parent.arms.len())
                {
                    return Err(invalid("match selection parent arm is out of range"));
                }
                current = parent;
            }
        }
        Ok(())
    }

    /// Convert the compiler-owned denominator into Supercov's shared manifest
    /// and exact ordinal resolver. This is intentionally strict: source keys,
    /// byte ranges and UTF-8 boundaries must all resolve before any evidence is
    /// accepted for the crate.
    pub fn normalize(
        &self,
        sources: &BTreeMap<String, RustCompilerSource>,
    ) -> Result<NormalizedRustCompilerManifest, RustCompilerManifestError> {
        self.validate()?;
        let required_source_keys = self
            .points
            .iter()
            .map(|point| point.source_key.as_str())
            .chain(
                self.branches
                    .iter()
                    .map(|branch| branch.source_key.as_str()),
            )
            .chain(self.decisions.iter().flat_map(|decision| {
                std::iter::once(decision.source_key.as_str()).chain(
                    decision
                        .conditions
                        .iter()
                        .map(|condition| condition.source_key.as_str()),
                )
            }))
            .chain(self.selection_groups.iter().flat_map(|group| {
                std::iter::once(group.source_key.as_str())
                    .chain(group.arms.iter().map(|arm| arm.body_source_key.as_str()))
            }))
            .collect::<BTreeSet<_>>();
        let supplied_source_keys = sources.keys().map(String::as_str).collect::<BTreeSet<_>>();
        if supplied_source_keys != required_source_keys {
            let missing = required_source_keys
                .difference(&supplied_source_keys)
                .copied()
                .collect::<Vec<_>>();
            let extra = supplied_source_keys
                .difference(&required_source_keys)
                .copied()
                .collect::<Vec<_>>();
            return Err(RustCompilerManifestError::InvalidSource(format!(
                "source snapshot keys differ from the denominator (missing: {}; extra: {})",
                missing.join(", "),
                extra.join(", ")
            )));
        }
        let location = |key: &str, start: u32, end: u32| source_location(sources, key, start, end);

        let mut hit_obligations_by_ordinal = BTreeMap::<u64, BTreeSet<String>>::new();
        let mut internal_ordinals = BTreeSet::new();
        let mut points = Vec::with_capacity(self.points.len());
        for point in &self.points {
            let (file, line, column, source) = location(&point.source_key, point.start, point.end)?;
            let point_kind = match point.kind.as_str() {
                "statement" => PointKind::Statement,
                "function" => PointKind::Function,
                _ => unreachable!("validated point kind"),
            };
            let probe_ordinal = ordinal(&point.probe_ordinal).expect("validated point ordinal");
            hit_obligations_by_ordinal
                .entry(probe_ordinal)
                .or_default()
                .insert(point.id.clone());
            points.push(PointMeta {
                id: point.id.clone(),
                kind: point_kind,
                file,
                line,
                column,
                source,
                label: (!point.discriminator.is_empty()).then(|| point.discriminator.clone()),
            });
        }

        let decision_logical_branch_ids = self
            .decisions
            .iter()
            .flat_map(|decision| {
                decision
                    .logical_selections
                    .iter()
                    .map(|selection| selection.branch_id.as_str())
            })
            .collect::<BTreeSet<_>>();
        let mut branches = Vec::with_capacity(self.branches.len());
        for branch in &self.branches {
            let (file, line, column, source) =
                location(&branch.source_key, branch.start, branch.end)?;
            internal_ordinals
                .insert(ordinal(&branch.probe_ordinal).expect("validated branch group ordinal"));
            let alternatives = branch
                .alternatives
                .iter()
                .map(|alternative| {
                    let probe_ordinal = ordinal(&alternative.probe_ordinal)
                        .expect("validated branch alternative ordinal");
                    if decision_logical_branch_ids.contains(branch.id.as_str()) {
                        internal_ordinals.insert(probe_ordinal);
                    } else {
                        hit_obligations_by_ordinal
                            .entry(probe_ordinal)
                            .or_default()
                            .insert(alternative.id.clone());
                    }
                    BranchAlternativeMeta {
                        id: alternative.id.clone(),
                        label: alternative.label.clone(),
                    }
                })
                .collect();
            branches.push(BranchMeta {
                id: branch.id.clone(),
                kind: branch.kind.clone(),
                file,
                line,
                column,
                source,
                alternatives,
            });
        }

        let mut decisions = Vec::with_capacity(self.decisions.len());
        let branches_by_id = self
            .branches
            .iter()
            .map(|branch| (branch.id.as_str(), branch))
            .collect::<BTreeMap<_, _>>();
        let mut decision_outcome_obligations = BTreeMap::new();
        let mut decision_loop_obligations = BTreeMap::new();
        let mut decision_logical_selection_obligations = BTreeMap::new();
        for decision in &self.decisions {
            let (file, line, column, source) =
                location(&decision.source_key, decision.start, decision.end)?;
            for condition in &decision.conditions {
                // Resolve even when compiler-reconstructed display text differs
                // from the authored span, as can happen for procedural output.
                location(&condition.source_key, condition.start, condition.end)?;
            }
            internal_ordinals
                .insert(ordinal(&decision.probe_ordinal).expect("validated decision ordinal"));
            let outcome_branch = branches_by_id[decision.outcome_branch_id.as_str()];
            let labels = if decision.kind == "assertion" {
                ("failed", "passed")
            } else {
                ("condition false", "condition true")
            };
            let alternative = |label: &str| {
                outcome_branch
                    .alternatives
                    .iter()
                    .find(|alternative| alternative.label == label)
                    .expect("validated decision outcome label")
                    .id
                    .clone()
            };
            decision_outcome_obligations.insert(
                decision.id.clone(),
                (alternative(labels.0), alternative(labels.1)),
            );
            if let Some(loop_branch_id) = decision.loop_branch_id.as_deref() {
                let loop_branch = branches_by_id[loop_branch_id];
                let loop_alternative = |label: &str| {
                    loop_branch
                        .alternatives
                        .iter()
                        .find(|alternative| alternative.label == label)
                        .expect("validated loop-entry label")
                        .id
                        .clone()
                };
                decision_loop_obligations.insert(
                    decision.id.clone(),
                    (
                        loop_alternative("zero iterations"),
                        loop_alternative("entered"),
                    ),
                );
            }
            let logical_selections = decision
                .logical_selections
                .iter()
                .map(|selection| {
                    let branch = branches_by_id[selection.branch_id.as_str()];
                    let alternative = |label: &str| {
                        branch
                            .alternatives
                            .iter()
                            .find(|alternative| alternative.label == label)
                            .expect("validated logical-selection label")
                            .id
                            .clone()
                    };
                    NormalizedRustLogicalSelection {
                        short_circuited_id: alternative("short-circuited"),
                        right_evaluated_id: alternative("right operand evaluated"),
                        right_condition_index: selection.right_condition_index,
                    }
                })
                .collect::<Vec<_>>();
            if !logical_selections.is_empty() {
                decision_logical_selection_obligations
                    .insert(decision.id.clone(), logical_selections);
            }
            decisions.push(DecisionMeta {
                id: decision.id.clone(),
                file,
                line,
                column,
                source,
                conditions: decision
                    .conditions
                    .iter()
                    .map(|condition| condition.source.clone())
                    .collect(),
                kind: decision.kind.clone(),
            });
        }

        for group in &self.selection_groups {
            internal_ordinals
                .insert(ordinal(&group.probe_ordinal).expect("validated selection group ordinal"));
            for selected in &group.arms {
                let selected_ordinal =
                    ordinal(&selected.selected_ordinal).expect("validated selected ordinal");
                let implied = hit_obligations_by_ordinal
                    .get_mut(&selected_ordinal)
                    .expect("validated selected alternative ordinal");
                for sibling in &group.arms {
                    if sibling.branch_id == selected.branch_id {
                        continue;
                    }
                    let sibling_branch = branches_by_id
                        .get(sibling.branch_id.as_str())
                        .expect("validated match branch");
                    let not_selected = sibling_branch
                        .alternatives
                        .iter()
                        .find(|alternative| {
                            alternative.probe_ordinal == sibling.not_selected_ordinal
                        })
                        .expect("validated not-selected alternative");
                    implied.insert(not_selected.id.clone());
                }
            }
        }

        let limitation_file = points
            .first()
            .map(|point| point.file.clone())
            .unwrap_or_default();
        let limitations = self
            .limitations
            .iter()
            .enumerate()
            .map(|(index, limitation)| {
                json!({
                    "id": format!("rust-compiler-candidate:{index}"),
                    "kind": "rust-compiler-candidate",
                    "file": limitation_file,
                    "line": 1,
                    "column": 0,
                    "source": "",
                    "reason": limitation,
                })
            })
            .collect();

        let (source_fingerprint, generated_source_files) = compiler_source_fingerprint(sources);
        Ok(NormalizedRustCompilerManifest {
            manifest: CoverageManifest {
                decisions,
                points,
                branches,
                limitations,
                unmeasured: self.unmeasured_obligations.clone(),
                scope: Some(json!({
                    "language": "rust",
                    "model": self.model,
                    "crate": self.crate_name,
                    "measurementComplete": self.measurement_complete,
                    "sourceFingerprint": {
                        "algorithm": "sha256",
                        "digest": source_fingerprint,
                        "files": sources.len(),
                        "generatedFiles": generated_source_files,
                    },
                })),
            },
            hit_obligations_by_ordinal: hit_obligations_by_ordinal
                .into_iter()
                .map(|(ordinal, ids)| (ordinal, ids.into_iter().collect()))
                .collect(),
            internal_ordinals,
            decision_outcome_obligations,
            decision_loop_obligations,
            decision_logical_selection_obligations,
        })
    }
}

fn source_location(
    sources: &BTreeMap<String, RustCompilerSource>,
    key: &str,
    start: u32,
    end: u32,
) -> Result<(String, usize, usize, String), RustCompilerManifestError> {
    let source = sources
        .get(key)
        .ok_or_else(|| RustCompilerManifestError::MissingSource(key.into()))?;
    if source.file.trim().is_empty() {
        return Err(RustCompilerManifestError::InvalidSource(format!(
            "{key} has an empty display path"
        )));
    }
    let start = usize::try_from(start).expect("u32 always fits supported usize");
    let end = usize::try_from(end).expect("u32 always fits supported usize");
    if start >= end
        || end > source.source.len()
        || !source.source.is_char_boundary(start)
        || !source.source.is_char_boundary(end)
    {
        return Err(RustCompilerManifestError::InvalidSource(format!(
            "{key} range {start}..{end} is outside UTF-8 source bytes"
        )));
    }
    let line_start = source.source[..start]
        .rfind('\n')
        .map_or(0, |index| index + 1);
    let line = source.source[..start]
        .bytes()
        .filter(|byte| *byte == b'\n')
        .count()
        + 1;
    Ok((
        source.file.clone(),
        line,
        start - line_start,
        source.source[start..end].into(),
    ))
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;

    fn valid_manifest() -> serde_json::Value {
        json!({
            "schema": SCHEMA,
            "model": MODEL,
            "crate": "fixture",
            "measurementComplete": false,
            "points": [{
                "id": "rs:function:000000000000000000000001",
                "kind": "function",
                "sourceKey": "source:src/lib.rs",
                "start": 0,
                "end": 10,
                "provenance": "authored-source",
                "discriminator": "",
                "probeOrdinal": "1",
                "definitions": ["fixture::function"],
                "canonical": "function"
            }],
            "branches": [{
                "id": "rs:branch:000000000000000000000002",
                "kind": "decision-outcome",
                "discriminator": "decision-outcome:if",
                "sourceKey": "source:src/lib.rs",
                "start": 11,
                "end": 20,
                "provenance": "authored-source",
                "probeOrdinal": "2",
                "definitions": ["fixture::function"],
                "alternatives": [
                    {"id": "rs:branch-alternative:000000000000000000000003", "label": "condition true", "probeOrdinal": "3", "canonical": "true"},
                    {"id": "rs:branch-alternative:000000000000000000000004", "label": "condition false", "probeOrdinal": "4", "canonical": "false"}
                ],
                "canonical": "branch"
            }],
            "decisions": [{
                "id": "rs:decision:000000000000000000000005",
                "kind": "if",
                "sourceKey": "source:src/lib.rs",
                "start": 11,
                "end": 15,
                "provenance": "authored-source",
                "probeOrdinal": "5",
                "definitions": ["fixture::function"],
                "outcomeBranchId": "rs:branch:000000000000000000000002",
                "loopBranchId": null,
                "logicalSelections": [],
                "conditions": [{"sourceKey": "source:src/lib.rs", "start": 11, "end": 15, "source": "value"}],
                "canonical": "decision"
            }],
            "selectionGroups": [],
            "limitations": ["RUST_PRIVATE_CANDIDATE: incomplete"]
        })
    }

    #[test]
    fn accepts_only_a_strict_collision_free_private_candidate() {
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&valid_manifest()).unwrap()).unwrap();
        assert_eq!(manifest.crate_name, "fixture");

        let mut legacy_schema = valid_manifest();
        legacy_schema["schema"] = json!("supercov-rust-manifest-candidate-v1");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&legacy_schema).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));
        let mut previous_schema = valid_manifest();
        previous_schema["schema"] = json!("supercov-rust-manifest-candidate-v2");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&previous_schema).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut missing_alternative_canonical = valid_manifest();
        missing_alternative_canonical["branches"][0]["alternatives"][0]
            .as_object_mut()
            .unwrap()
            .remove("canonical");
        assert!(matches!(
            RustCompilerManifest::parse(
                &serde_json::to_vec(&missing_alternative_canonical).unwrap()
            ),
            Err(RustCompilerManifestError::Json(_))
        ));

        let mut unknown = valid_manifest();
        unknown["unexpected"] = json!(true);
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&unknown).unwrap()),
            Err(RustCompilerManifestError::Json(_))
        ));

        let mut collision = valid_manifest();
        collision["decisions"][0]["probeOrdinal"] = json!("1");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&collision).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut complete = valid_manifest();
        complete["measurementComplete"] = json!(true);
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&complete).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut traversal = valid_manifest();
        traversal["points"][0]["sourceKey"] = json!("source:../outside.rs");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&traversal).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut missing_outcome = valid_manifest();
        missing_outcome["decisions"][0]["outcomeBranchId"] = json!("rs:branch:missing");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&missing_outcome).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut wrong_outcome_kind = valid_manifest();
        wrong_outcome_kind["branches"][0]["kind"] = json!("loop-entry");
        wrong_outcome_kind["branches"][0]["alternatives"] = json!([
            {"id": "rs:branch-alternative:000000000000000000000003", "label": "zero iterations", "probeOrdinal": "3", "canonical": "zero"},
            {"id": "rs:branch-alternative:000000000000000000000004", "label": "entered", "probeOrdinal": "4", "canonical": "entered"}
        ]);
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&wrong_outcome_kind).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut loop_manifest = valid_manifest();
        loop_manifest["decisions"][0]["kind"] = json!("while");
        loop_manifest["decisions"][0]["loopBranchId"] = json!("rs:branch:000000000000000000000006");
        loop_manifest["branches"].as_array_mut().unwrap().push(json!({
            "id": "rs:branch:000000000000000000000006",
            "kind": "loop-entry",
            "discriminator": "loop-entry:while",
            "sourceKey": "source:src/lib.rs",
            "start": 11,
            "end": 20,
            "provenance": "authored-source",
            "probeOrdinal": "6",
            "definitions": ["fixture::function"],
            "alternatives": [
                {"id": "rs:branch-alternative:000000000000000000000007", "label": "zero iterations", "probeOrdinal": "7", "canonical": "zero"},
                {"id": "rs:branch-alternative:000000000000000000000008", "label": "entered", "probeOrdinal": "8", "canonical": "entered"}
            ],
            "canonical": "loop-entry"
        }));
        let parsed_loop =
            RustCompilerManifest::parse(&serde_json::to_vec(&loop_manifest).unwrap()).unwrap();
        assert_eq!(
            parsed_loop.decisions[0].loop_branch_id.as_deref(),
            Some("rs:branch:000000000000000000000006")
        );
        let normalized_loop = parsed_loop
            .normalize(&BTreeMap::from([(
                "source:src/lib.rs".into(),
                RustCompilerSource {
                    file: "src/lib.rs".into(),
                    source: "0123456789 value and more source bytes".into(),
                },
            )]))
            .unwrap();
        assert_eq!(
            normalized_loop.decision_loop_obligations["rs:decision:000000000000000000000005"],
            (
                "rs:branch-alternative:000000000000000000000007".into(),
                "rs:branch-alternative:000000000000000000000008".into(),
            )
        );

        let mut missing_loop = loop_manifest.clone();
        missing_loop["decisions"][0]["loopBranchId"] = json!(null);
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&missing_loop).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut non_loop_relation = loop_manifest;
        non_loop_relation["decisions"][0]["kind"] = json!("if");
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&non_loop_relation).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));
    }

    #[test]
    fn logical_selections_are_strict_relations_projected_from_decision_vectors() {
        let mut value = valid_manifest();
        value["branches"].as_array_mut().unwrap().push(json!({
            "id": "rs:branch:000000000000000000000006",
            "kind": "logical-selection",
            "discriminator": "logical-selection:and",
            "sourceKey": "source:src/lib.rs",
            "start": 11,
            "end": 20,
            "provenance": "authored-source",
            "probeOrdinal": "6",
            "definitions": ["fixture::function"],
            "alternatives": [
                {"id": "rs:branch-alternative:000000000000000000000007", "label": "short-circuited", "probeOrdinal": "7", "canonical": "short"},
                {"id": "rs:branch-alternative:000000000000000000000008", "label": "right operand evaluated", "probeOrdinal": "8", "canonical": "evaluated"}
            ],
            "canonical": "logical-selection"
        }));
        value["decisions"][0]["conditions"] = json!([
            {"sourceKey": "source:src/lib.rs", "start": 11, "end": 15, "source": "left"},
            {"sourceKey": "source:src/lib.rs", "start": 16, "end": 20, "source": "right"}
        ]);
        value["decisions"][0]["logicalSelections"] = json!([{
            "branchId": "rs:branch:000000000000000000000006",
            "rightConditionIndex": 1
        }]);

        let manifest = RustCompilerManifest::parse(&serde_json::to_vec(&value).unwrap()).unwrap();
        let normalized = manifest
            .normalize(&BTreeMap::from([(
                "source:src/lib.rs".into(),
                RustCompilerSource {
                    file: "src/lib.rs".into(),
                    source: "0123456789 left && right and more source bytes".into(),
                },
            )]))
            .unwrap();
        let relation = &normalized.decision_logical_selection_obligations["rs:decision:000000000000000000000005"]
            [0];
        assert_eq!(relation.right_condition_index, 1);
        assert_eq!(
            relation.short_circuited_id,
            "rs:branch-alternative:000000000000000000000007"
        );
        assert_eq!(
            relation.right_evaluated_id,
            "rs:branch-alternative:000000000000000000000008"
        );
        assert!(normalized.internal_ordinals.contains(&7));
        assert!(normalized.internal_ordinals.contains(&8));
        assert!(!normalized.hit_obligations_by_ordinal.contains_key(&7));
        assert!(!normalized.hit_obligations_by_ordinal.contains_key(&8));

        let mut missing_relation = value.clone();
        missing_relation["decisions"][0]["logicalSelections"] = json!([]);
        let value_selection =
            RustCompilerManifest::parse(&serde_json::to_vec(&missing_relation).unwrap())
                .unwrap()
                .normalize(&BTreeMap::from([(
                    "source:src/lib.rs".into(),
                    RustCompilerSource {
                        file: "src/lib.rs".into(),
                        source: "0123456789 left && right and more source bytes".into(),
                    },
                )]))
                .unwrap();
        assert!(value_selection.hit_obligations_by_ordinal.contains_key(&7));
        assert!(value_selection.hit_obligations_by_ordinal.contains_key(&8));

        let mut source_ordered = value.clone();
        source_ordered["branches"].as_array_mut().unwrap().push(json!({
            "id": "rs:branch:000000000000000000000009",
            "kind": "logical-selection",
            "discriminator": "logical-selection:or",
            "sourceKey": "source:src/lib.rs",
            "start": 11,
            "end": 20,
            "provenance": "authored-source",
            "probeOrdinal": "9",
            "definitions": ["fixture::function"],
            "alternatives": [
                {"id": "rs:branch-alternative:000000000000000000000010", "label": "short-circuited", "probeOrdinal": "10", "canonical": "short-two"},
                {"id": "rs:branch-alternative:000000000000000000000011", "label": "right operand evaluated", "probeOrdinal": "11", "canonical": "evaluated-two"}
            ],
            "canonical": "logical-selection-two"
        }));
        source_ordered["decisions"][0]["conditions"] = json!([
            {"sourceKey": "source:src/lib.rs", "start": 11, "end": 12, "source": "first"},
            {"sourceKey": "source:src/lib.rs", "start": 13, "end": 14, "source": "second"},
            {"sourceKey": "source:src/lib.rs", "start": 15, "end": 20, "source": "third"}
        ]);
        source_ordered["decisions"][0]["logicalSelections"] = json!([
            {"branchId": "rs:branch:000000000000000000000009", "rightConditionIndex": 1},
            {"branchId": "rs:branch:000000000000000000000006", "rightConditionIndex": 2}
        ]);
        let parsed_source_ordered =
            RustCompilerManifest::parse(&serde_json::to_vec(&source_ordered).unwrap()).unwrap();
        assert_eq!(
            parsed_source_ordered.decisions[0]
                .logical_selections
                .iter()
                .map(|selection| selection.right_condition_index)
                .collect::<Vec<_>>(),
            vec![1, 2],
        );
        source_ordered["decisions"][0]["logicalSelections"]
            .as_array_mut()
            .unwrap()
            .reverse();
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&source_ordered).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));

        let mut invalid_index = value;
        invalid_index["decisions"][0]["logicalSelections"][0]["rightConditionIndex"] = json!(2);
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&invalid_index).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));
        let mut invalid_discriminator = valid_manifest();
        invalid_discriminator["branches"].as_array_mut().unwrap().push(json!({
            "id": "rs:branch:000000000000000000000006",
            "kind": "logical-selection",
            "discriminator": "logical-selection:unknown",
            "sourceKey": "source:src/lib.rs",
            "start": 11,
            "end": 20,
            "provenance": "authored-source",
            "probeOrdinal": "6",
            "definitions": ["fixture::function"],
            "alternatives": [
                {"id": "rs:branch-alternative:000000000000000000000007", "label": "short-circuited", "probeOrdinal": "7", "canonical": "short"},
                {"id": "rs:branch-alternative:000000000000000000000008", "label": "right operand evaluated", "probeOrdinal": "8", "canonical": "evaluated"}
            ],
            "canonical": "logical-selection"
        }));
        assert!(matches!(
            RustCompilerManifest::parse(&serde_json::to_vec(&invalid_discriminator).unwrap()),
            Err(RustCompilerManifestError::Invalid(_))
        ));
    }

    #[test]
    fn accepts_exact_doctest_source_provenance() {
        let mut value = valid_manifest();
        value["points"][0]["provenance"] = json!("doctest-source");

        let manifest = RustCompilerManifest::parse(&serde_json::to_vec(&value).unwrap()).unwrap();
        assert_eq!(manifest.points[0].provenance, "doctest-source");
    }

    #[test]
    fn source_snapshot_envelope_is_strict_and_never_resolves_paths() {
        let snapshots = json!({
            "schema": SOURCE_SNAPSHOT_SCHEMA,
            "crate": "fixture",
            "sources": {
                "source:src/lib.rs": {"file": "src/lib.rs", "source": "fn work() {}\n"},
                "generated:package:.:generated.rs": {
                    "file": "generated:package:.:generated.rs",
                    "source": "fn generated() {}\n"
                }
            }
        });
        let parsed =
            RustCompilerSourceSnapshots::parse(&serde_json::to_vec(&snapshots).unwrap()).unwrap();
        assert_eq!(parsed.crate_name, "fixture");
        assert_eq!(parsed.sources.len(), 2);

        let mut unknown = snapshots.clone();
        unknown["path"] = json!("/tmp/guess");
        assert!(
            RustCompilerSourceSnapshots::parse(&serde_json::to_vec(&unknown).unwrap()).is_err()
        );

        let mut traversal = snapshots;
        traversal["sources"]["source:../outside.rs"] =
            json!({"file": "outside.rs", "source": "fn hidden() {}"});
        assert!(
            RustCompilerSourceSnapshots::parse(&serde_json::to_vec(&traversal).unwrap()).is_err()
        );
    }

    #[test]
    fn repeated_compiler_units_merge_only_when_identity_and_source_are_exact() {
        let first =
            RustCompilerManifest::parse(&serde_json::to_vec(&valid_manifest()).unwrap()).unwrap();
        let mut second = first.clone();
        second.points[0].definitions = vec![
            "fixture::function".into(),
            "fixture::tests::function".into(),
        ];
        let snapshots = RustCompilerSourceSnapshots::parse(
            &serde_json::to_vec(&json!({
                "schema": SOURCE_SNAPSHOT_SCHEMA,
                "crate": "fixture",
                "sources": {
                    "source:src/lib.rs": {
                        "file": "src/lib.rs",
                        "source": "0123456789 value and more source bytes"
                    }
                }
            }))
            .unwrap(),
        )
        .unwrap();
        let normalized = normalize_rust_compiler_candidates(vec![
            (first.clone(), snapshots.clone()),
            (second, snapshots.clone()),
        ])
        .unwrap();
        assert_eq!(normalized.manifest.points.len(), 1);
        assert_eq!(normalized.manifest.branches.len(), 1);
        assert_eq!(normalized.manifest.decisions.len(), 1);

        let mut changed = snapshots;
        changed.sources.get_mut("source:src/lib.rs").unwrap().source =
            "changed source bytes that remain long enough".into();
        assert!(normalize_rust_compiler_candidates(vec![
            (first.clone(), RustCompilerSourceSnapshots::parse(
                &serde_json::to_vec(&json!({
                    "schema": SOURCE_SNAPSHOT_SCHEMA,
                    "crate": "fixture",
                    "sources": {"source:src/lib.rs": {"file": "src/lib.rs", "source": "0123456789 value and more source bytes"}}
                })).unwrap(),
            ).unwrap()),
            (first, changed),
        ]).is_err());
    }

    #[test]
    fn normalizes_exact_source_locations_and_runtime_ordinals() {
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&valid_manifest()).unwrap()).unwrap();
        let sources = BTreeMap::from([(
            "source:src/lib.rs".into(),
            RustCompilerSource {
                file: "src/lib.rs".into(),
                source: "0123456789\nvalue && more text".into(),
            },
        )]);
        let normalized = manifest.normalize(&sources).unwrap();
        assert_eq!(normalized.manifest.points[0].source, "0123456789");
        assert_eq!(normalized.manifest.branches[0].line, 2);
        assert_eq!(normalized.manifest.branches[0].column, 0);
        assert_eq!(normalized.manifest.branches[0].source, "value && ");
        assert_eq!(
            normalized.hit_obligations_by_ordinal[&1],
            ["rs:function:000000000000000000000001"]
        );
        assert_eq!(
            normalized.hit_obligations_by_ordinal[&3],
            ["rs:branch-alternative:000000000000000000000003"]
        );
        assert_eq!(normalized.internal_ordinals, BTreeSet::from([2, 5]));
        assert_eq!(
            normalized.decision_outcome_obligations["rs:decision:000000000000000000000005"],
            (
                "rs:branch-alternative:000000000000000000000004".into(),
                "rs:branch-alternative:000000000000000000000003".into(),
            )
        );
        assert_eq!(normalized.manifest.limitations.len(), 1);
        let fingerprint = &normalized.manifest.scope.as_ref().unwrap()["sourceFingerprint"];
        assert_eq!(fingerprint["algorithm"], "sha256");
        assert_eq!(fingerprint["digest"].as_str().unwrap().len(), 64);
        assert_eq!(fingerprint["files"], 1);
        assert_eq!(fingerprint["generatedFiles"], 0);
    }

    #[test]
    fn source_fingerprint_binds_full_generated_bytes_outside_obligation_ranges() {
        let mut candidate = valid_manifest();
        let generated_key = "generated:package:.:generated.rs";
        candidate["points"][0]["sourceKey"] = json!(generated_key);
        candidate["branches"][0]["sourceKey"] = json!(generated_key);
        candidate["decisions"][0]["sourceKey"] = json!(generated_key);
        candidate["decisions"][0]["conditions"][0]["sourceKey"] = json!(generated_key);
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&candidate).unwrap()).unwrap();
        let baseline_sources = BTreeMap::from([(
            generated_key.into(),
            RustCompilerSource {
                file: generated_key.into(),
                source: "0123456789 value and more source bytes // baseline".into(),
            },
        )]);
        let changed_sources = BTreeMap::from([(
            generated_key.into(),
            RustCompilerSource {
                file: generated_key.into(),
                source: "0123456789 value and more source bytes // changed!".into(),
            },
        )]);
        let baseline = manifest.normalize(&baseline_sources).unwrap().manifest;
        let changed = manifest.normalize(&changed_sources).unwrap().manifest;
        assert_eq!(
            baseline.scope.as_ref().unwrap()["sourceFingerprint"]["generatedFiles"],
            1,
        );
        assert_ne!(
            baseline.scope.as_ref().unwrap()["sourceFingerprint"]["digest"],
            changed.scope.as_ref().unwrap()["sourceFingerprint"]["digest"],
        );
        let mut baseline_without_fingerprint = serde_json::to_value(&baseline).unwrap();
        let mut changed_without_fingerprint = serde_json::to_value(&changed).unwrap();
        baseline_without_fingerprint["scope"]
            .as_object_mut()
            .unwrap()
            .remove("sourceFingerprint");
        changed_without_fingerprint["scope"]
            .as_object_mut()
            .unwrap()
            .remove("sourceFingerprint");
        assert_eq!(baseline_without_fingerprint, changed_without_fingerprint);
    }

    #[test]
    fn match_selection_expands_to_sibling_not_selected_obligations() {
        let mut candidate = valid_manifest();
        let outcome_branch = candidate["branches"][0].clone();
        candidate["branches"] = json!([
            outcome_branch,
            {
                "id": "rs:branch:000000000000000000000006",
                "kind": "match-arm",
                "discriminator": "match-arm:0",
                "sourceKey": "source:src/lib.rs",
                "start": 11,
                "end": 16,
                "provenance": "authored-source",
                "probeOrdinal": "6",
                "definitions": ["fixture::function"],
                "alternatives": [
                    {"id": "rs:branch-alternative:000000000000000000000007", "label": "not selected", "probeOrdinal": "7", "canonical": "not selected"},
                    {"id": "rs:branch-alternative:000000000000000000000008", "label": "selected", "probeOrdinal": "8", "canonical": "selected"}
                ],
                "canonical": "first arm"
            },
            {
                "id": "rs:branch:000000000000000000000009",
                "kind": "match-arm",
                "discriminator": "match-arm:1",
                "sourceKey": "source:src/lib.rs",
                "start": 17,
                "end": 22,
                "provenance": "authored-source",
                "probeOrdinal": "9",
                "definitions": ["fixture::function"],
                "alternatives": [
                    {"id": "rs:branch-alternative:00000000000000000000000a", "label": "not selected", "probeOrdinal": "10", "canonical": "not selected"},
                    {"id": "rs:branch-alternative:00000000000000000000000b", "label": "selected", "probeOrdinal": "11", "canonical": "selected"}
                ],
                "canonical": "second arm"
            }
        ]);
        candidate["selectionGroups"] = json!([{
            "id": "rs:match-group:00000000000000000000000c",
            "kind": "match",
            "sourceKey": "source:src/lib.rs",
            "start": 11,
            "end": 22,
            "provenance": "authored-source",
            "probeOrdinal": "12",
            "definitions": ["fixture::function"],
            "parentGroupId": null,
            "parentSite": null,
            "parentArmIndex": null,
            "arms": [
                {"branchId": "rs:branch:000000000000000000000006", "bodySourceKey": "source:src/lib.rs", "bodyStart": 11, "bodyEnd": 16, "guarded": false, "guardDecisionId": null, "selectedOrdinal": "8", "notSelectedOrdinal": "7"},
                {"branchId": "rs:branch:000000000000000000000009", "bodySourceKey": "source:src/lib.rs", "bodyStart": 17, "bodyEnd": 22, "guarded": false, "guardDecisionId": null, "selectedOrdinal": "11", "notSelectedOrdinal": "10"}
            ],
            "canonical": "match"
        }]);
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&candidate).unwrap()).unwrap();
        let sources = BTreeMap::from([(
            "source:src/lib.rs".into(),
            RustCompilerSource {
                file: "src/lib.rs".into(),
                source: "0123456789\nfirst second trailing".into(),
            },
        )]);
        let normalized = manifest.normalize(&sources).unwrap();
        assert_eq!(
            normalized.hit_obligations_by_ordinal[&8],
            [
                "rs:branch-alternative:000000000000000000000008",
                "rs:branch-alternative:00000000000000000000000a",
            ]
        );
        assert_eq!(
            normalized.hit_obligations_by_ordinal[&11],
            [
                "rs:branch-alternative:000000000000000000000007",
                "rs:branch-alternative:00000000000000000000000b",
            ]
        );
    }

    #[test]
    fn normalization_fails_closed_on_missing_or_non_utf8_boundary_sources() {
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&valid_manifest()).unwrap()).unwrap();
        assert!(matches!(
            manifest.normalize(&BTreeMap::new()),
            Err(RustCompilerManifestError::InvalidSource(_))
        ));

        let mut candidate = valid_manifest();
        candidate["points"][0]["start"] = json!(1);
        candidate["points"][0]["end"] = json!(2);
        let manifest =
            RustCompilerManifest::parse(&serde_json::to_vec(&candidate).unwrap()).unwrap();
        let sources = BTreeMap::from([(
            "source:src/lib.rs".into(),
            RustCompilerSource {
                file: "src/lib.rs".into(),
                source: "é0123456789\nvalue && more text".into(),
            },
        )]);
        assert!(matches!(
            manifest.normalize(&sources),
            Err(RustCompilerManifestError::InvalidSource(_))
        ));
    }
}
