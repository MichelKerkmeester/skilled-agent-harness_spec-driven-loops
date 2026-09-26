//! Frozen, implementation-neutral Supercov engine contracts.
//!
//! This crate does not contain coverage behavior. It makes contract drift a
//! compile/test failure while the shipped implementation and Rust candidate
//! coexist. Independent specifications and conformance oracles—not either
//! implementation—decide whether a contract is correct.

use std::collections::BTreeSet;

use serde::{Deserialize, Serialize};

pub const CONTRACT_VERSION: u32 = 1;
pub const EVIDENCE_ARCHIVE_SCHEMA_VERSION: u32 = 3;
pub const EVIDENCE_ARCHIVE_MAGIC: &str = "SUPERCOV-EVIDENCE-3\n";
pub const COVERAGE_MODEL_SCHEMA_VERSION: u32 = 1;
pub const COVERAGE_MODEL_MAX_IDENTIFIER_BYTES: usize = 64;
pub const COVERAGE_MODEL_MAX_DESCRIPTION_BYTES: usize = 4_096;
pub const COVERAGE_MODEL_MAX_SURFACES_PER_LIST: usize = 256;
pub const AGENT_JSON_SCHEMA_VERSION: u32 = 1;
pub const AGENT_JSON_MAX_BYTES: usize = 65_536;
pub const DEFAULT_PAGE_SIZE: usize = 20;
pub const PROCESS_SUPERVISION_SCHEMA_VERSION: u32 = 1;
pub const DEFAULT_DIAGNOSTIC_INTERVAL_MS: u64 = 60_000;
pub const COMMAND_TIMEOUT_EXIT_CODE: i32 = 124;
pub const COMMAND_TERMINATION_GRACE_MS: u64 = 5_000;
pub const PROBE_V2_VERSION: u32 = 2;
pub const PROBE_V2_RADIX: u32 = 3;
pub const PROBE_V2_JS_MAX_CONDITIONS: usize = 32;
pub const LANGUAGE_FRONTEND_PROTOCOL_VERSION: u32 = 2;
pub const RUST_COMPILER_COMPANION_PROTOCOL_VERSION: u32 = 1;
pub const RUST_PROBE_TRANSPORT_PROTOCOL_VERSION: u32 = 1;
pub const RUST_PROBE_TRANSPORT_MAGIC: &str = "SCVRUST1";
pub const RUST_PROBE_TRANSPORT_V3_PROTOCOL_VERSION: u32 = 3;
pub const RUST_PROBE_TRANSPORT_V3_MAGIC: &str = "SCVRUST3";
pub const RUST_PROBE_TRANSPORT_HEADER_SIZE: usize = 128;
pub const RUST_PROBE_TRANSPORT_DESCRIPTOR_SIZE: usize = 40;
pub const RUST_PROBE_TRANSPORT_TOKEN_SIZE: usize = 16;
pub const RUST_LIBTEST_EVENT_PROTOCOL_VERSION: u32 = 1;
pub const RUST_LIBTEST_EVENT_MAGIC: &str = "SCVLTST1";
pub const RUST_LIBTEST_EVENT_HEADER_SIZE: usize = 64;
pub const RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE: usize = 48;
pub const RUST_LIBTEST_EVENT_TOKEN_SIZE: usize = 16;
pub const RUST_LIBTEST_EVENT_MAX_NAME_BYTES: usize = 1_048_576;
pub const RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION: u32 = 3;

pub const ERROR_CODES: &[&str] = &[
    "AMBIGUOUS_SELECTOR",
    "DECISION_NOT_FOUND",
    "FILTER_UNAVAILABLE",
    "INTERNAL_ERROR",
    "INVALID_ARGUMENT",
    "MINIMIZATION_COMPLEXITY_LIMIT",
    "NO_RUNS",
    "RESPONSE_TOO_LARGE",
    "RUN_NOT_FOUND",
    "SCOPE_UNAVAILABLE",
    "SOURCE_NOT_FOUND",
    "TARGET_UNREACHABLE",
    "TEST_FILTER_EMPTY",
    "TEST_NOT_FOUND",
    "UNATTRIBUTED_EVIDENCE",
    "UNKNOWN_COMMAND",
];

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractRegistry {
    pub contract_version: u32,
    pub status: String,
    pub resident_process: bool,
    pub evidence_archive: EvidenceArchiveContract,
    pub run_store: RunStoreContract,
    pub agent_json: AgentJsonContract,
    pub process_supervision: ProcessSupervisionContract,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvidenceArchiveContract {
    pub schema_version: u32,
    pub file: String,
    pub format: String,
    pub magic: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RunStoreContract {
    pub schema_version: u32,
    pub store: String,
    pub workspace_store: String,
    pub published_run_files: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentJsonContract {
    pub schema_version: u32,
    pub max_bytes: usize,
    pub default_page_size: usize,
    pub error_codes: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessSupervisionContract {
    pub schema_version: u32,
    pub diagnostic_interval_ms: u64,
    pub timeout_exit_code: i32,
    pub termination_grace_ms: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentPagination {
    pub offset: usize,
    pub limit: usize,
    pub returned: usize,
    pub total: usize,
    pub has_more: bool,
    pub next_offset: Option<usize>,
}

pub fn registry() -> Result<ContractRegistry, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/v1/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbeV2Contract {
    pub probe_version: u32,
    pub semantics: String,
    pub implementation: String,
    pub decision_encoding: ProbeV2DecisionEncoding,
    pub published_evidence: String,
    pub attribution_epoch: Vec<String>,
    pub fallback: String,
    pub promotion: ProbeV2Promotion,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbeV2DecisionEncoding {
    pub radix: u32,
    pub digits: ProbeV2Digits,
    pub outcome_stored_separately: bool,
    pub javascript_maximum_encoded_conditions: usize,
    pub wider_decision_behavior: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
pub struct ProbeV2Digits {
    pub unreached: u32,
    pub r#false: u32,
    pub r#true: u32,
}

#[derive(Debug, Clone, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbeV2Promotion {
    pub realistic_median_runtime_ratio_max: f64,
    pub semantic_equivalence_required: bool,
    pub manifest_parity_required: bool,
    pub evidence_parity_required: bool,
}

pub fn probe_v2_contract() -> Result<ProbeV2Contract, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/probe-v2/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LanguageFrontendProtocolContract {
    pub frontend_protocol_version: u32,
    pub status: String,
    pub manifest_model: String,
    pub observation_model: String,
    pub probe_model: String,
    pub identity_axes: Vec<String>,
    pub transition_kinds: Vec<String>,
    pub structural_sources: Vec<String>,
    pub execution_models: Vec<String>,
    pub attribution_precisions: Vec<String>,
    pub limitation_scopes: Vec<String>,
    pub requirements: LanguageFrontendRequirements,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LanguageFrontendRequirements {
    pub complete_manifest_before_execution: bool,
    pub unknown_obligation_fatal: bool,
    pub identity_downgrade_requires_limitation: bool,
    pub unknown_phase_reference_fatal: bool,
    pub phase_causality_acyclic: bool,
    pub selected_unstarted_has_test_identity_only: bool,
    pub multiple_runners_per_frontend: bool,
    pub structural_limitations_reference_manifest_ids: bool,
    pub attribution_limitations_runner_scoped: bool,
    pub timestamp_attribution_may_claim_causality: bool,
    pub frontend_may_compute_coverage_verdicts: bool,
    pub engine_owns_manifest_merge: bool,
    pub engine_owns_evidence_validation: bool,
    pub engine_owns_attribution_merge: bool,
    pub engine_owns_coverage_analysis: bool,
    pub engine_owns_persistence_and_queries: bool,
}

pub fn language_frontend_protocol_contract()
-> Result<LanguageFrontendProtocolContract, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/frontend-v2/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonCoverageImportContract {
    pub schema_version: u32,
    pub status: String,
    pub producer: String,
    pub supported_collector_cores_for_exact_contexts: Vec<String>,
    pub requires_branch_measurement: bool,
    pub database_access: String,
    pub frontend_computes_verdicts: bool,
    pub unknown_fields_fatal: bool,
    pub preserve_unrecognized_contexts_as_background: bool,
    pub mcdc_availability: String,
    pub column_locations: String,
}

pub fn python_coverage_import_contract() -> Result<PythonCoverageImportContract, serde_json::Error>
{
    serde_json::from_str(include_str!("../assets/python-coverage-v1/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EvidenceV3Contract {
    pub schema_version: u32,
    pub status: String,
    pub magic: String,
    pub framing: String,
    pub required_entries: Vec<String>,
    pub frontend_protocol_version: u32,
    pub coverage_model_schema_version: u32,
    pub unknown_frontend_fields_fatal: bool,
    pub unknown_coverage_model_fields_fatal: bool,
    pub frontend_language_must_match_coverage_model: bool,
    pub malformed_recognized_jsonl_fatal: bool,
    pub recognized_jsonl_requires_final_newline: bool,
}

pub fn evidence_v3_contract() -> Result<EvidenceV3Contract, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/evidence-v3/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CoverageModelV1Contract {
    pub schema_version: u32,
    pub status: String,
    pub persisted_entry: String,
    pub required_fields: Vec<String>,
    pub unknown_fields_fatal: bool,
    pub frontend_language_must_match: bool,
    pub measured_must_be_nonempty: bool,
    pub surface_lists_must_be_unique: bool,
    pub surface_lists_must_be_disjoint: bool,
    pub strings_must_be_trimmed_single_line: bool,
    pub max_identifier_bytes: usize,
    pub max_description_bytes: usize,
    pub max_surfaces_per_list: usize,
}

pub fn coverage_model_v1_contract() -> Result<CoverageModelV1Contract, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/coverage-model-v1/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCoverageV1Contract {
    pub model_version: u32,
    pub status: String,
    pub language: String,
    pub variant: String,
    pub decision_semantics: String,
    pub condition_order: String,
    pub probe_model: String,
    pub generic_aggregation: String,
    pub source_identity: RustSourceIdentityContract,
    pub test_context_identity: RustTestContextIdentityContract,
    pub runner_attempt_identity: RustRunnerAttemptIdentityContract,
    pub libtest_event_transport: RustLibtestEventTransportContract,
    pub point_kinds: Vec<String>,
    pub control_decision_kinds: Vec<String>,
    pub branch_kinds: Vec<String>,
    pub required_owned_surfaces: Vec<String>,
    pub required_identity_axes: Vec<String>,
    pub completeness_requires: Vec<String>,
    pub external_coverage_in_product: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestEventTransportContract {
    pub protocol_version: u32,
    pub status: String,
    pub magic: String,
    pub byte_order: String,
    pub header_size: usize,
    pub record_header_size: usize,
    pub token_size: usize,
    pub maximum_name_bytes: usize,
    pub writer: String,
    pub event_kinds: Vec<String>,
    pub terminal_results: Vec<String>,
    pub publication: String,
    pub sequence: String,
    pub integrity: String,
    pub unknown_event: String,
    pub truncated_record: String,
    pub invalid_semantics: String,
    pub missing_transport: String,
    pub process_model: String,
    pub output_authority: String,
    pub artifact_binding: RustLibtestArtifactBindingContract,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustLibtestArtifactBindingContract {
    pub schema_version: u32,
    pub manifest_suffix: String,
    pub digest: String,
    pub required_bindings: Vec<String>,
    pub artifact_location: String,
    pub unknown_fields_fatal: bool,
    pub mismatch: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustRunnerAttemptIdentityContract {
    pub version: u32,
    pub cargo_test: RustSingleAttemptRunnerContract,
    pub rustdoc: RustSingleAttemptRunnerContract,
    pub nextest: RustNextestAttemptContract,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustSingleAttemptRunnerContract {
    pub retry: usize,
    pub total_attempts: usize,
    pub identity_authority: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustNextestAttemptContract {
    pub minimum_version: String,
    pub maximum_version: String,
    pub verified_released_versions: Vec<String>,
    pub execution_mode: String,
    pub identity_environment: Vec<String>,
    pub attempt_numbering: String,
    pub retry_derivation: String,
    pub attempt_id_semantics: String,
    pub list_phase: String,
    pub selection_projection: String,
    pub selected_but_unstarted: String,
    pub concurrent_attempts: String,
    pub target_runner_death: String,
    pub partial_identity: String,
    pub stress_iteration: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustTestContextIdentityContract {
    pub version: u32,
    pub algorithm: String,
    pub domain: String,
    pub input: String,
    pub reserved_values: Vec<String>,
    pub reserved_remap_xor: String,
    pub collision_policy: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustSourceIdentityContract {
    pub version: u32,
    pub digest: String,
    pub id_digest_bytes: usize,
    pub separator: String,
    pub authored_canonical_fields: Vec<String>,
    pub synthetic_expansion_canonical_fields: Vec<String>,
    pub generated_source_key_fields: Vec<String>,
    pub repeated_authored_expansions_aggregate: bool,
    pub distinct_synthetic_invocations_remain_distinct: bool,
    pub ephemeral_paths_forbidden: bool,
    pub collision_policy: String,
}

pub fn rust_coverage_v1_contract() -> Result<RustCoverageV1Contract, serde_json::Error> {
    serde_json::from_str(include_str!("../assets/rust-coverage-v1/contract.json"))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerCompanionContract {
    pub protocol_version: u32,
    pub status: String,
    pub frontend_id: String,
    pub coverage_model_variant: String,
    pub evidence_schema_version: u32,
    pub selection_identity: Vec<String>,
    pub required_public_capabilities: Vec<String>,
    pub unknown_fields_fatal: bool,
    pub exact_identity_required: bool,
    pub external_coverage_engine: bool,
    pub missing_or_mismatched_companion: String,
    pub user_runtime_components: Vec<String>,
    pub user_development_components: Vec<String>,
}

pub fn rust_compiler_companion_contract() -> Result<RustCompilerCompanionContract, serde_json::Error>
{
    serde_json::from_str(include_str!(
        "../assets/rust-compiler-companion-v1/contract.json"
    ))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportContract {
    pub protocol_version: u32,
    pub status: String,
    pub magic: String,
    pub byte_order: String,
    pub header_size: usize,
    pub descriptor_size: usize,
    pub token_size: usize,
    pub endian_marker: u32,
    pub header_offsets: RustProbeTransportHeaderOffsets,
    pub descriptor_offsets: RustProbeTransportDescriptorOffsets,
    pub record_kinds: RustProbeTransportRecordKinds,
    #[serde(default)]
    pub thread_scope: Option<RustProbeTransportThreadScope>,
    pub context: RustProbeTransportContext,
    pub publication: RustProbeTransportPublication,
    pub integrity: RustProbeTransportIntegrity,
    pub completeness: RustProbeTransportCompleteness,
    pub supported_targets: Vec<String>,
    pub unsupported_target: String,
}

/// The frozen join-bounded thread acceptance rule: a record whose phase chain
/// includes thread phases is attributed to its root test only when every such
/// thread phase committed its end before the root test's boundary.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportThreadScope {
    pub child_derivation: String,
    pub domain: String,
    pub thread_end_committed_when_start_routine_returns: bool,
    pub test_boundary_committed_when_test_context_exits: bool,
    pub acceptance: String,
    pub escaped_thread_records_become_background: bool,
    pub escaped_thread_limitation: String,
    pub duplicate_thread_end_fatal: bool,
    pub duplicate_test_boundary_fatal: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportHeaderOffsets {
    pub version: usize,
    pub header_size: usize,
    pub descriptor_size: usize,
    pub descriptor_capacity: usize,
    pub payload_capacity: usize,
    pub endian_marker: usize,
    pub next_descriptor: usize,
    pub next_payload: usize,
    pub dropped: usize,
    pub token: usize,
    pub attachments: usize,
    #[serde(default)]
    pub next_phase: Option<usize>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportDescriptorOffsets {
    pub commit: usize,
    pub kind: usize,
    pub outcome: usize,
    pub flags: usize,
    pub process_id: usize,
    pub context_id: usize,
    pub payload_offset: usize,
    pub payload_length: usize,
    pub id_length: usize,
    pub value_length: usize,
    pub checksum: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportRecordKinds {
    pub hit: u8,
    pub decision: u8,
    pub ordinal_hit: u8,
    #[serde(default)]
    pub phase: Option<u8>,
    #[serde(default)]
    pub thread_phase: Option<u8>,
    #[serde(default)]
    pub thread_end: Option<u8>,
    #[serde(default)]
    pub test_boundary: Option<u8>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportContext {
    pub zero: String,
    pub max: String,
    pub nonzero: String,
    pub published_identity: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportPublication {
    pub reservation_order: Vec<String>,
    pub commit_value: u8,
    pub writer_ordering: String,
    pub reader_ordering: String,
    pub complete_descriptors_independently_recoverable: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportIntegrity {
    pub authentication: String,
    pub checksum: String,
    pub unknown_record_kind_fatal: bool,
    pub nonzero_reserved_byte_fatal: bool,
    pub symlink_transport_fatal: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustProbeTransportCompleteness {
    pub zero_attachments_blocks_terminal_passing_attempt: bool,
    pub dropped_records_block_terminal_passing_attempt: bool,
    pub incomplete_records_block_terminal_passing_attempt: bool,
    pub context_zero_excluded_from_passed_per_test_coverage: bool,
    pub malformed_record_fatal: bool,
}

pub fn rust_probe_transport_contract() -> Result<RustProbeTransportContract, serde_json::Error> {
    serde_json::from_str(include_str!(
        "../assets/rust-probe-transport-v1/contract.json"
    ))
}

pub fn rust_probe_transport_v3_contract() -> Result<RustProbeTransportContract, serde_json::Error> {
    serde_json::from_str(include_str!(
        "../assets/rust-probe-transport-v3/contract.json"
    ))
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerIdentity {
    pub rustc_commit_hash: String,
    pub rustc_release: String,
    pub host_triple: String,
    pub rustc_driver_sha256: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerCompanionCapabilities {
    pub expanded_hir_provenance: bool,
    pub runtime_mir_probe_insertion: bool,
    pub generated_source_provenance: bool,
    pub ctfe_path_tracing: bool,
    pub rustdoc_doctest_tracing: bool,
    pub exact_test_harness_attribution: bool,
}

impl RustCompilerCompanionCapabilities {
    pub fn is_public_ready(&self) -> bool {
        self.expanded_hir_provenance
            && self.runtime_mir_probe_insertion
            && self.generated_source_provenance
            && self.ctfe_path_tracing
            && self.rustdoc_doctest_tracing
            && self.exact_test_harness_attribution
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerCompanionHandshake {
    pub protocol_version: u32,
    pub frontend_id: String,
    pub coverage_model_variant: String,
    pub evidence_schema_version: u32,
    pub companion_build_id: String,
    pub compiler: RustCompilerIdentity,
    pub capabilities: RustCompilerCompanionCapabilities,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustCompilerCompanionError {
    UnsupportedProtocolVersion(u32),
    InvalidFrontend,
    InvalidCoverageModel,
    UnsupportedEvidenceSchema(u32),
    InvalidBuildId,
    InvalidRustcCommit,
    InvalidRustcRelease,
    InvalidHostTriple,
    InvalidDriverDigest,
    CompilerMismatch,
    IncompleteCapabilities,
}

impl std::fmt::Display for RustCompilerCompanionError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnsupportedProtocolVersion(version) => {
                write!(
                    formatter,
                    "unsupported Rust compiler companion protocol: {version}"
                )
            }
            Self::InvalidFrontend => formatter.write_str("invalid Rust companion frontend"),
            Self::InvalidCoverageModel => {
                formatter.write_str("invalid Rust companion coverage model")
            }
            Self::UnsupportedEvidenceSchema(version) => {
                write!(
                    formatter,
                    "unsupported Rust companion evidence schema: {version}"
                )
            }
            Self::InvalidBuildId => formatter.write_str("invalid Rust companion build ID"),
            Self::InvalidRustcCommit => formatter.write_str("invalid rustc commit hash"),
            Self::InvalidRustcRelease => formatter.write_str("invalid rustc release"),
            Self::InvalidHostTriple => formatter.write_str("invalid rustc host triple"),
            Self::InvalidDriverDigest => formatter.write_str("invalid rustc driver digest"),
            Self::CompilerMismatch => formatter.write_str("Rust companion compiler mismatch"),
            Self::IncompleteCapabilities => {
                formatter.write_str("Rust companion lacks public coverage capabilities")
            }
        }
    }
}

impl std::error::Error for RustCompilerCompanionError {}

fn valid_lower_hex(value: &str, bytes: usize) -> bool {
    value.len() == bytes * 2
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn valid_rustc_release(value: &str) -> bool {
    (1..=64).contains(&value.len()) && value.trim() == value && !value.chars().any(char::is_control)
}

fn valid_host_triple(value: &str) -> bool {
    (3..=128).contains(&value.len())
        && value.as_bytes()[0].is_ascii_alphanumeric()
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || matches!(byte, b'-' | b'_' | b'.')
        })
}

pub fn validate_rust_compiler_companion_handshake(
    handshake: &RustCompilerCompanionHandshake,
) -> Result<(), RustCompilerCompanionError> {
    if handshake.protocol_version != RUST_COMPILER_COMPANION_PROTOCOL_VERSION {
        return Err(RustCompilerCompanionError::UnsupportedProtocolVersion(
            handshake.protocol_version,
        ));
    }
    if handshake.frontend_id != "rust" {
        return Err(RustCompilerCompanionError::InvalidFrontend);
    }
    if handshake.coverage_model_variant != "rust-source-v1" {
        return Err(RustCompilerCompanionError::InvalidCoverageModel);
    }
    if handshake.evidence_schema_version != EVIDENCE_ARCHIVE_SCHEMA_VERSION {
        return Err(RustCompilerCompanionError::UnsupportedEvidenceSchema(
            handshake.evidence_schema_version,
        ));
    }
    if !valid_lower_hex(&handshake.companion_build_id, 32) {
        return Err(RustCompilerCompanionError::InvalidBuildId);
    }
    if !valid_lower_hex(&handshake.compiler.rustc_commit_hash, 20) {
        return Err(RustCompilerCompanionError::InvalidRustcCommit);
    }
    if !valid_rustc_release(&handshake.compiler.rustc_release) {
        return Err(RustCompilerCompanionError::InvalidRustcRelease);
    }
    if !valid_host_triple(&handshake.compiler.host_triple) {
        return Err(RustCompilerCompanionError::InvalidHostTriple);
    }
    if !valid_lower_hex(&handshake.compiler.rustc_driver_sha256, 32) {
        return Err(RustCompilerCompanionError::InvalidDriverDigest);
    }
    Ok(())
}

pub fn require_matching_rust_compiler_companion(
    handshake: &RustCompilerCompanionHandshake,
    compiler: &RustCompilerIdentity,
    require_public_capabilities: bool,
) -> Result<(), RustCompilerCompanionError> {
    validate_rust_compiler_companion_handshake(handshake)?;
    if handshake.compiler.rustc_commit_hash != compiler.rustc_commit_hash
        || handshake.compiler.host_triple != compiler.host_triple
        || handshake.compiler.rustc_driver_sha256 != compiler.rustc_driver_sha256
    {
        return Err(RustCompilerCompanionError::CompilerMismatch);
    }
    if require_public_capabilities && !handshake.capabilities.is_public_ready() {
        return Err(RustCompilerCompanionError::IncompleteCapabilities);
    }
    Ok(())
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StructuralSource {
    OwnedProbes,
    NativeImport,
    Mixed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ExecutionModel {
    ProcessPerTest,
    SerialInProcess,
    ParallelContextPropagated,
    ParallelUnattributed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AttributionPrecision {
    Exact,
    Aggregate,
    Unavailable,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FrontendTransitionKind {
    Setup,
    Test,
    Action,
    Assertion,
    Teardown,
    Background,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FrontendLimitationScope {
    Worker,
    Test,
    Retry,
    Phase,
    Action,
    Assertion,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FrontendAttribution {
    pub run: AttributionPrecision,
    pub worker: AttributionPrecision,
    pub test: AttributionPrecision,
    pub retry: AttributionPrecision,
    pub phase: AttributionPrecision,
    pub action: AttributionPrecision,
    pub assertion: AttributionPrecision,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FrontendLimitation {
    pub id: String,
    pub scopes: Vec<FrontendLimitationScope>,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FrontendRunDeclaration {
    pub protocol_version: u32,
    pub frontend_id: String,
    pub frontend_version: String,
    pub language: String,
    pub structural_source: StructuralSource,
    pub runners: Vec<FrontendRunnerDeclaration>,
    pub structural_limitations: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FrontendRunnerDeclaration {
    pub runner: String,
    pub execution_model: ExecutionModel,
    pub attribution: FrontendAttribution,
    pub limitations: Vec<FrontendLimitation>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FrontendDeclarationError {
    UnsupportedProtocolVersion(u32),
    InvalidToken(&'static str),
    NoRunners,
    DuplicateRunner(String),
    RunIdentityNotExact,
    DuplicateLimitation(String),
    DuplicateLimitationScope(String),
    EmptyLimitationScopes(String),
    InvalidLimitationReason(String),
    DuplicateStructuralLimitation(String),
    MissingDowngradeLimitation(FrontendLimitationScope),
    ExactRetryRequiresExactTest,
    ExactPhaseRequiresExactTest,
    ExactAssertionRequiresExactTestAndPhase,
    ExactActionRequiresExactTestAndPhase,
    ParallelUnattributedCannotClaimExactCausality,
}

impl std::fmt::Display for FrontendDeclarationError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnsupportedProtocolVersion(version) => {
                write!(
                    formatter,
                    "unsupported language-frontend protocol version: {version}"
                )
            }
            Self::InvalidToken(field) => write!(formatter, "invalid frontend {field}"),
            Self::NoRunners => write!(formatter, "frontend declaration has no runners"),
            Self::DuplicateRunner(runner) => {
                write!(formatter, "duplicate frontend runner: {runner}")
            }
            Self::RunIdentityNotExact => write!(formatter, "frontend run identity must be exact"),
            Self::DuplicateLimitation(id) => {
                write!(formatter, "duplicate frontend limitation: {id}")
            }
            Self::EmptyLimitationScopes(id) => {
                write!(formatter, "frontend limitation has no scopes: {id}")
            }
            Self::DuplicateLimitationScope(id) => {
                write!(formatter, "frontend limitation has duplicate scopes: {id}")
            }
            Self::InvalidLimitationReason(id) => {
                write!(formatter, "frontend limitation has an invalid reason: {id}")
            }
            Self::DuplicateStructuralLimitation(id) => {
                write!(formatter, "duplicate structural limitation reference: {id}")
            }
            Self::MissingDowngradeLimitation(scope) => write!(
                formatter,
                "non-exact {scope:?} attribution has no matching limitation"
            ),
            Self::ExactRetryRequiresExactTest => {
                write!(
                    formatter,
                    "exact retry attribution requires exact test identity"
                )
            }
            Self::ExactPhaseRequiresExactTest => {
                write!(
                    formatter,
                    "exact phase attribution requires exact test identity"
                )
            }
            Self::ExactAssertionRequiresExactTestAndPhase => write!(
                formatter,
                "exact assertion attribution requires exact test and phase identity"
            ),
            Self::ExactActionRequiresExactTestAndPhase => write!(
                formatter,
                "exact action attribution requires exact test and phase identity"
            ),
            Self::ParallelUnattributedCannotClaimExactCausality => write!(
                formatter,
                "parallel-unattributed execution cannot claim exact test, retry, phase, action, or assertion causality"
            ),
        }
    }
}

fn validate_frontend_limitations(
    limitations: &[FrontendLimitation],
    limitation_ids: &mut BTreeSet<String>,
) -> Result<BTreeSet<FrontendLimitationScope>, FrontendDeclarationError> {
    let mut limited_scopes = BTreeSet::new();
    for limitation in limitations {
        if !valid_frontend_token(&limitation.id) {
            return Err(FrontendDeclarationError::InvalidToken("limitation ID"));
        }
        if !limitation_ids.insert(limitation.id.clone()) {
            return Err(FrontendDeclarationError::DuplicateLimitation(
                limitation.id.clone(),
            ));
        }
        if limitation.scopes.is_empty() {
            return Err(FrontendDeclarationError::EmptyLimitationScopes(
                limitation.id.clone(),
            ));
        }
        let unique_scopes = limitation.scopes.iter().copied().collect::<BTreeSet<_>>();
        if unique_scopes.len() != limitation.scopes.len() {
            return Err(FrontendDeclarationError::DuplicateLimitationScope(
                limitation.id.clone(),
            ));
        }
        if limitation.reason.trim().is_empty()
            || limitation.reason.trim().len() != limitation.reason.len()
            || limitation.reason.contains(['\n', '\r', '\0'])
        {
            return Err(FrontendDeclarationError::InvalidLimitationReason(
                limitation.id.clone(),
            ));
        }
        limited_scopes.extend(unique_scopes);
    }
    Ok(limited_scopes)
}

fn validate_frontend_runner(
    runner: &FrontendRunnerDeclaration,
    limitation_ids: &mut BTreeSet<String>,
) -> Result<(), FrontendDeclarationError> {
    if !valid_frontend_runner_token(&runner.runner) {
        return Err(FrontendDeclarationError::InvalidToken("runner"));
    }
    if runner.attribution.run != AttributionPrecision::Exact {
        return Err(FrontendDeclarationError::RunIdentityNotExact);
    }
    let limited_scopes = validate_frontend_limitations(&runner.limitations, limitation_ids)?;
    if runner.attribution.retry == AttributionPrecision::Exact
        && runner.attribution.test != AttributionPrecision::Exact
    {
        return Err(FrontendDeclarationError::ExactRetryRequiresExactTest);
    }
    if runner.attribution.phase == AttributionPrecision::Exact
        && runner.attribution.test != AttributionPrecision::Exact
    {
        return Err(FrontendDeclarationError::ExactPhaseRequiresExactTest);
    }
    for (precision, scope) in [
        (runner.attribution.worker, FrontendLimitationScope::Worker),
        (runner.attribution.test, FrontendLimitationScope::Test),
        (runner.attribution.retry, FrontendLimitationScope::Retry),
        (runner.attribution.phase, FrontendLimitationScope::Phase),
        (runner.attribution.action, FrontendLimitationScope::Action),
        (
            runner.attribution.assertion,
            FrontendLimitationScope::Assertion,
        ),
    ] {
        if precision != AttributionPrecision::Exact && !limited_scopes.contains(&scope) {
            return Err(FrontendDeclarationError::MissingDowngradeLimitation(scope));
        }
    }
    if runner.attribution.assertion == AttributionPrecision::Exact
        && (runner.attribution.test != AttributionPrecision::Exact
            || runner.attribution.phase != AttributionPrecision::Exact)
    {
        return Err(FrontendDeclarationError::ExactAssertionRequiresExactTestAndPhase);
    }
    if runner.attribution.action == AttributionPrecision::Exact
        && (runner.attribution.test != AttributionPrecision::Exact
            || runner.attribution.phase != AttributionPrecision::Exact)
    {
        return Err(FrontendDeclarationError::ExactActionRequiresExactTestAndPhase);
    }
    if runner.execution_model == ExecutionModel::ParallelUnattributed
        && [
            runner.attribution.test,
            runner.attribution.retry,
            runner.attribution.phase,
            runner.attribution.action,
            runner.attribution.assertion,
        ]
        .contains(&AttributionPrecision::Exact)
    {
        return Err(FrontendDeclarationError::ParallelUnattributedCannotClaimExactCausality);
    }
    Ok(())
}

impl std::error::Error for FrontendDeclarationError {}

fn valid_frontend_token(value: &str) -> bool {
    (1..=64).contains(&value.len())
        && value.as_bytes()[0].is_ascii_lowercase()
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || matches!(byte, b'.' | b'+' | b'-')
        })
}

fn valid_frontend_runner_token(value: &str) -> bool {
    (1..=64).contains(&value.len())
        && value.as_bytes()[0].is_ascii_lowercase()
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase()
                || byte.is_ascii_digit()
                || matches!(byte, b'.' | b'+' | b'-' | b':')
        })
}

fn valid_structural_limitation_reference(value: &str) -> bool {
    (1..=512).contains(&value.len())
        && value.trim().len() == value.len()
        && !value.chars().any(char::is_control)
}

pub fn validate_frontend_run_declaration(
    declaration: &FrontendRunDeclaration,
) -> Result<(), FrontendDeclarationError> {
    if declaration.protocol_version != LANGUAGE_FRONTEND_PROTOCOL_VERSION {
        return Err(FrontendDeclarationError::UnsupportedProtocolVersion(
            declaration.protocol_version,
        ));
    }
    for (field, value) in [
        ("ID", declaration.frontend_id.as_str()),
        ("version", declaration.frontend_version.as_str()),
        ("language", declaration.language.as_str()),
    ] {
        if !valid_frontend_token(value) {
            return Err(FrontendDeclarationError::InvalidToken(field));
        }
    }
    if declaration.runners.is_empty() {
        return Err(FrontendDeclarationError::NoRunners);
    }
    let mut limitation_ids = BTreeSet::new();
    for limitation in &declaration.structural_limitations {
        if !valid_structural_limitation_reference(limitation) {
            return Err(FrontendDeclarationError::InvalidToken(
                "structural limitation ID",
            ));
        }
        if !limitation_ids.insert(limitation.clone()) {
            return Err(FrontendDeclarationError::DuplicateStructuralLimitation(
                limitation.clone(),
            ));
        }
    }
    let mut runners = BTreeSet::new();
    for runner in &declaration.runners {
        if !runners.insert(runner.runner.clone()) {
            return Err(FrontendDeclarationError::DuplicateRunner(
                runner.runner.clone(),
            ));
        }
        validate_frontend_runner(runner, &mut limitation_ids)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn checked_in_registry_matches_rust_constants() {
        let contract = registry().expect("contract registry must be valid JSON");
        assert_eq!(contract.contract_version, CONTRACT_VERSION);
        assert_eq!(contract.status, "frozen");
        assert!(!contract.resident_process);
        assert_eq!(
            contract.evidence_archive.schema_version,
            EVIDENCE_ARCHIVE_SCHEMA_VERSION
        );
        assert_eq!(contract.evidence_archive.magic, EVIDENCE_ARCHIVE_MAGIC);
        assert_eq!(
            contract.agent_json.schema_version,
            AGENT_JSON_SCHEMA_VERSION
        );
        assert_eq!(contract.agent_json.max_bytes, AGENT_JSON_MAX_BYTES);
        assert_eq!(contract.agent_json.default_page_size, DEFAULT_PAGE_SIZE);
        assert_eq!(contract.agent_json.error_codes, ERROR_CODES);
        assert_eq!(
            contract.process_supervision.schema_version,
            PROCESS_SUPERVISION_SCHEMA_VERSION
        );
        assert_eq!(
            contract.process_supervision.diagnostic_interval_ms,
            DEFAULT_DIAGNOSTIC_INTERVAL_MS
        );
        assert_eq!(
            contract.process_supervision.timeout_exit_code,
            COMMAND_TIMEOUT_EXIT_CODE
        );
        assert_eq!(
            contract.process_supervision.termination_grace_ms,
            COMMAND_TERMINATION_GRACE_MS
        );
    }

    #[test]
    fn checked_in_probe_v2_contract_matches_rust_constants() {
        let contract = probe_v2_contract().expect("probe v2 contract must be valid JSON");
        assert_eq!(contract.probe_version, PROBE_V2_VERSION);
        assert_eq!(contract.semantics, "frozen");
        assert_eq!(contract.implementation, "experimental");
        assert_eq!(contract.decision_encoding.radix, PROBE_V2_RADIX);
        assert_eq!(contract.decision_encoding.digits.unreached, 0);
        assert_eq!(contract.decision_encoding.digits.r#false, 1);
        assert_eq!(contract.decision_encoding.digits.r#true, 2);
        assert!(contract.decision_encoding.outcome_stored_separately);
        assert_eq!(
            contract
                .decision_encoding
                .javascript_maximum_encoded_conditions,
            PROBE_V2_JS_MAX_CONDITIONS
        );
        assert_eq!(contract.promotion.realistic_median_runtime_ratio_max, 1.10);
    }

    fn exact_frontend_declaration() -> FrontendRunDeclaration {
        FrontendRunDeclaration {
            protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
            frontend_id: "javascript".into(),
            frontend_version: "javascript-v1".into(),
            language: "javascript".into(),
            structural_source: StructuralSource::OwnedProbes,
            runners: vec![FrontendRunnerDeclaration {
                runner: "playwright".into(),
                execution_model: ExecutionModel::ParallelContextPropagated,
                attribution: FrontendAttribution {
                    run: AttributionPrecision::Exact,
                    worker: AttributionPrecision::Exact,
                    test: AttributionPrecision::Exact,
                    retry: AttributionPrecision::Exact,
                    phase: AttributionPrecision::Exact,
                    action: AttributionPrecision::Exact,
                    assertion: AttributionPrecision::Exact,
                },
                limitations: Vec::new(),
            }],
            structural_limitations: Vec::new(),
        }
    }

    #[test]
    fn checked_in_language_frontend_contract_matches_rust_types() {
        let contract = language_frontend_protocol_contract()
            .expect("language frontend protocol must be valid JSON");
        assert_eq!(
            contract.frontend_protocol_version,
            LANGUAGE_FRONTEND_PROTOCOL_VERSION
        );
        assert_eq!(contract.status, "frozen");
        assert_eq!(contract.manifest_model, "coverage-manifest-v1");
        assert_eq!(contract.observation_model, "evidence-archive-v3");
        assert_eq!(contract.probe_model, "ternary-decision-v2");
        assert!(
            contract
                .requirements
                .selected_unstarted_has_test_identity_only
        );
        assert_eq!(
            contract.identity_axes,
            ["run", "worker", "test", "retry", "phase"]
        );
        assert_eq!(
            contract.structural_sources,
            [
                StructuralSource::OwnedProbes,
                StructuralSource::NativeImport,
                StructuralSource::Mixed,
            ]
            .map(|value| serde_json::to_value(value)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned())
        );
        assert_eq!(
            contract.execution_models,
            [
                ExecutionModel::ProcessPerTest,
                ExecutionModel::SerialInProcess,
                ExecutionModel::ParallelContextPropagated,
                ExecutionModel::ParallelUnattributed,
            ]
            .map(|value| serde_json::to_value(value)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned())
        );
        assert_eq!(
            contract.attribution_precisions,
            [
                AttributionPrecision::Exact,
                AttributionPrecision::Aggregate,
                AttributionPrecision::Unavailable,
            ]
            .map(|value| serde_json::to_value(value)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned())
        );
        assert_eq!(
            contract.transition_kinds,
            [
                FrontendTransitionKind::Setup,
                FrontendTransitionKind::Test,
                FrontendTransitionKind::Action,
                FrontendTransitionKind::Assertion,
                FrontendTransitionKind::Teardown,
                FrontendTransitionKind::Background,
            ]
            .map(|value| serde_json::to_value(value)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned())
        );
        assert_eq!(
            contract.limitation_scopes,
            [
                FrontendLimitationScope::Worker,
                FrontendLimitationScope::Test,
                FrontendLimitationScope::Retry,
                FrontendLimitationScope::Phase,
                FrontendLimitationScope::Action,
                FrontendLimitationScope::Assertion,
            ]
            .map(|value| serde_json::to_value(value)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned())
        );
        assert!(
            !contract
                .requirements
                .timestamp_attribution_may_claim_causality
        );
        assert!(!contract.requirements.frontend_may_compute_coverage_verdicts);
        assert!(contract.requirements.multiple_runners_per_frontend);
        assert!(
            contract
                .requirements
                .structural_limitations_reference_manifest_ids
        );
        assert!(contract.requirements.attribution_limitations_runner_scoped);
        assert!(contract.requirements.complete_manifest_before_execution);
        assert!(contract.requirements.unknown_obligation_fatal);
        assert!(contract.requirements.identity_downgrade_requires_limitation);
        assert!(contract.requirements.unknown_phase_reference_fatal);
        assert!(contract.requirements.phase_causality_acyclic);
        assert!(contract.requirements.engine_owns_manifest_merge);
        assert!(contract.requirements.engine_owns_evidence_validation);
        assert!(contract.requirements.engine_owns_attribution_merge);
        assert!(contract.requirements.engine_owns_coverage_analysis);
        assert!(contract.requirements.engine_owns_persistence_and_queries);
    }

    #[test]
    fn validates_exact_and_explicitly_degraded_frontends() {
        validate_frontend_run_declaration(&exact_frontend_declaration()).unwrap();
        let mut degraded = exact_frontend_declaration();
        degraded.runners[0].runner = "opaque-runner".into();
        degraded.runners[0].attribution.action = AttributionPrecision::Unavailable;
        degraded.runners[0].limitations.push(FrontendLimitation {
            id: "no-action-lifecycle".into(),
            scopes: vec![FrontendLimitationScope::Action],
            reason: "The runner exposes assertions but no action lifecycle".into(),
        });
        validate_frontend_run_declaration(&degraded).unwrap();
    }

    #[test]
    fn accepts_the_canonical_node_test_runner_name() {
        let mut declaration = exact_frontend_declaration();
        declaration.runners[0].runner = "node:test".into();
        validate_frontend_run_declaration(&declaration).unwrap();
    }

    #[test]
    fn rejects_unexplained_or_internally_impossible_attribution_claims() {
        let mut unexplained = exact_frontend_declaration();
        unexplained.runners[0].attribution.assertion = AttributionPrecision::Unavailable;
        assert_eq!(
            validate_frontend_run_declaration(&unexplained),
            Err(FrontendDeclarationError::MissingDowngradeLimitation(
                FrontendLimitationScope::Assertion
            ))
        );

        let mut impossible = exact_frontend_declaration();
        impossible.runners[0].execution_model = ExecutionModel::ParallelUnattributed;
        assert_eq!(
            validate_frontend_run_declaration(&impossible),
            Err(FrontendDeclarationError::ParallelUnattributedCannotClaimExactCausality)
        );

        let mut assertion_without_test = exact_frontend_declaration();
        assertion_without_test.runners[0].attribution.test = AttributionPrecision::Aggregate;
        assertion_without_test.runners[0].attribution.retry = AttributionPrecision::Aggregate;
        assertion_without_test.runners[0].attribution.phase = AttributionPrecision::Aggregate;
        assertion_without_test.runners[0]
            .limitations
            .push(FrontendLimitation {
                id: "aggregate-tests".into(),
                scopes: vec![
                    FrontendLimitationScope::Test,
                    FrontendLimitationScope::Retry,
                    FrontendLimitationScope::Phase,
                ],
                reason: "The runner pools concurrent test observations".into(),
            });
        assert_eq!(
            validate_frontend_run_declaration(&assertion_without_test),
            Err(FrontendDeclarationError::ExactAssertionRequiresExactTestAndPhase)
        );
    }

    #[test]
    fn supports_multiple_runners_but_rejects_duplicate_runner_claims() {
        let mut declaration = exact_frontend_declaration();
        let mut vitest = declaration.runners[0].clone();
        vitest.runner = "vitest".into();
        declaration.runners.push(vitest.clone());
        validate_frontend_run_declaration(&declaration).unwrap();
        declaration.runners.push(vitest);
        assert_eq!(
            validate_frontend_run_declaration(&declaration),
            Err(FrontendDeclarationError::DuplicateRunner("vitest".into()))
        );
    }

    #[test]
    fn keeps_structural_limitation_references_unique() {
        let mut declaration = exact_frontend_declaration();
        declaration
            .structural_limitations
            .push("dynamic-python".into());
        validate_frontend_run_declaration(&declaration).unwrap();
        declaration
            .structural_limitations
            .push("dynamic-python".into());
        assert_eq!(
            validate_frontend_run_declaration(&declaration),
            Err(FrontendDeclarationError::DuplicateStructuralLimitation(
                "dynamic-python".into()
            ))
        );
    }

    #[test]
    fn declaration_json_rejects_unknown_fields() {
        let mut value = serde_json::to_value(exact_frontend_declaration()).unwrap();
        value["verdict"] = serde_json::json!({ "mcdc": 100 });
        assert!(serde_json::from_value::<FrontendRunDeclaration>(value).is_err());
    }

    #[test]
    fn checked_in_frontend_examples_are_strict_and_valid() {
        for source in [
            include_str!("../assets/frontend-v2/examples/javascript-mixed-runners.json"),
            include_str!("../assets/frontend-v2/examples/python-pytest-xdist.json"),
        ] {
            let declaration: FrontendRunDeclaration = serde_json::from_str(source).unwrap();
            validate_frontend_run_declaration(&declaration).unwrap();
            assert_eq!(
                serde_json::from_str::<serde_json::Value>(source).unwrap(),
                serde_json::to_value(declaration).unwrap()
            );
        }
    }

    #[test]
    fn python_coverage_import_contract_keeps_the_oracle_at_the_fact_boundary() {
        let contract = python_coverage_import_contract().unwrap();
        assert_eq!(contract.schema_version, 1);
        assert_eq!(contract.status, "private-spike");
        assert_eq!(contract.producer, "coverage.py");
        assert_eq!(
            contract.supported_collector_cores_for_exact_contexts,
            ["ctrace", "pytrace"]
        );
        assert!(contract.requires_branch_measurement);
        assert_eq!(contract.database_access, "forbidden");
        assert!(!contract.frontend_computes_verdicts);
        assert!(contract.unknown_fields_fatal);
        assert!(contract.preserve_unrecognized_contexts_as_background);
        assert_eq!(
            contract.mcdc_availability,
            "unavailable-with-blocking-limitation"
        );
        assert_eq!(
            contract.column_locations,
            "unavailable-with-blocking-limitation"
        );
    }

    #[test]
    fn evidence_v3_is_the_frozen_language_bound_archive() {
        let contract = evidence_v3_contract().unwrap();
        assert_eq!(contract.schema_version, EVIDENCE_ARCHIVE_SCHEMA_VERSION);
        assert_eq!(contract.status, "frozen");
        assert_eq!(contract.magic, EVIDENCE_ARCHIVE_MAGIC);
        assert_eq!(contract.framing, "canonical-sorted-length-framed-gzip");
        assert_eq!(
            contract.required_entries,
            ["coverage-model.json", "frontend.json", "manifest.json"]
        );
        assert_eq!(
            contract.frontend_protocol_version,
            LANGUAGE_FRONTEND_PROTOCOL_VERSION
        );
        assert_eq!(
            contract.coverage_model_schema_version,
            COVERAGE_MODEL_SCHEMA_VERSION
        );
        assert!(contract.unknown_frontend_fields_fatal);
        assert!(contract.unknown_coverage_model_fields_fatal);
        assert!(contract.frontend_language_must_match_coverage_model);
        assert!(contract.malformed_recognized_jsonl_fatal);
        assert!(contract.recognized_jsonl_requires_final_newline);
        assert_eq!(EVIDENCE_ARCHIVE_SCHEMA_VERSION, 3);
        assert_eq!(EVIDENCE_ARCHIVE_MAGIC, "SUPERCOV-EVIDENCE-3\n");
    }

    #[test]
    fn coverage_model_v1_contract_is_frozen_and_bounded() {
        let contract = coverage_model_v1_contract().unwrap();
        assert_eq!(contract.schema_version, COVERAGE_MODEL_SCHEMA_VERSION);
        assert_eq!(contract.status, "frozen");
        assert_eq!(contract.persisted_entry, "coverage-model.json");
        assert_eq!(
            contract.required_fields,
            [
                "schemaVersion",
                "language",
                "variant",
                "name",
                "completenessMeaning",
                "measured",
                "notMeasured",
            ]
        );
        assert!(contract.unknown_fields_fatal);
        assert!(contract.frontend_language_must_match);
        assert!(contract.measured_must_be_nonempty);
        assert!(contract.surface_lists_must_be_unique);
        assert!(contract.surface_lists_must_be_disjoint);
        assert!(contract.strings_must_be_trimmed_single_line);
        assert_eq!(contract.max_identifier_bytes, 64);
        assert_eq!(contract.max_description_bytes, 4096);
        assert_eq!(contract.max_surfaces_per_list, 256);
    }

    #[test]
    fn rust_coverage_v1_contract_fixes_the_complete_target_model() {
        let contract = rust_coverage_v1_contract().unwrap();
        assert_eq!(contract.model_version, 1);
        assert_eq!(contract.status, "frozen-private-frontend");
        assert_eq!(contract.language, "rust");
        assert_eq!(contract.variant, "rust-source-v1");
        assert_eq!(contract.decision_semantics, "masking-mcdc");
        assert_eq!(contract.condition_order, "source-evaluation-order");
        assert_eq!(contract.probe_model, "ternary-decision-v2");
        assert_eq!(contract.source_identity.version, 1);
        assert_eq!(contract.source_identity.digest, "sha256");
        assert_eq!(contract.source_identity.id_digest_bytes, 12);
        assert_eq!(contract.source_identity.separator, "nul");
        assert!(
            contract
                .source_identity
                .repeated_authored_expansions_aggregate
        );
        assert!(
            contract
                .source_identity
                .distinct_synthetic_invocations_remain_distinct
        );
        assert!(contract.source_identity.ephemeral_paths_forbidden);
        assert_eq!(contract.source_identity.collision_policy, "fatal");
        assert_eq!(contract.test_context_identity.version, 1);
        assert_eq!(contract.test_context_identity.algorithm, "fnv1a-64");
        assert_eq!(
            contract.test_context_identity.domain,
            "supercov-rust-test-v1\0"
        );
        assert_eq!(
            contract.test_context_identity.collision_policy,
            "fatal-before-launch"
        );
        assert_eq!(contract.runner_attempt_identity.version, 1);
        assert_eq!(contract.runner_attempt_identity.cargo_test.retry, 0);
        assert_eq!(
            contract.runner_attempt_identity.cargo_test.total_attempts,
            1
        );
        assert_eq!(contract.runner_attempt_identity.rustdoc.retry, 0);
        assert_eq!(contract.runner_attempt_identity.rustdoc.total_attempts, 1);
        assert_eq!(
            contract.libtest_event_transport.protocol_version,
            RUST_LIBTEST_EVENT_PROTOCOL_VERSION
        );
        assert_eq!(
            contract.libtest_event_transport.magic,
            RUST_LIBTEST_EVENT_MAGIC
        );
        assert_eq!(
            contract.libtest_event_transport.header_size,
            RUST_LIBTEST_EVENT_HEADER_SIZE
        );
        assert_eq!(
            contract.libtest_event_transport.record_header_size,
            RUST_LIBTEST_EVENT_RECORD_HEADER_SIZE
        );
        assert_eq!(
            contract.libtest_event_transport.token_size,
            RUST_LIBTEST_EVENT_TOKEN_SIZE
        );
        assert_eq!(
            contract.libtest_event_transport.maximum_name_bytes,
            RUST_LIBTEST_EVENT_MAX_NAME_BYTES
        );
        assert_eq!(
            contract.libtest_event_transport.event_kinds,
            ["filtered-out", "filtered", "started", "timeout", "finished"]
        );
        assert_eq!(
            contract.libtest_event_transport.terminal_results,
            ["passed", "failed", "ignored", "benchmarked"]
        );
        assert_eq!(
            contract.libtest_event_transport.process_model,
            "one-stock-libtest-process-per-artifact"
        );
        assert_eq!(
            contract.libtest_event_transport.output_authority,
            "unmodified-selected-toolchain-libtest"
        );
        assert_eq!(
            contract
                .libtest_event_transport
                .artifact_binding
                .schema_version,
            RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION
        );
        assert_eq!(
            contract
                .libtest_event_transport
                .artifact_binding
                .required_bindings,
            [
                "compilerCompanionBuildId",
                "rustcCommitHash",
                "hostTriple",
                "eventProtocolVersion",
                "originalSourceSha256",
                "eventRuntimeSha256",
                "patchedSourceSha256",
                "artifactSha256",
            ]
        );
        assert!(
            contract
                .libtest_event_transport
                .artifact_binding
                .unknown_fields_fatal
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.minimum_version,
            "0.9.138"
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.maximum_version,
            "0.9.140"
        );
        assert_eq!(
            contract
                .runner_attempt_identity
                .nextest
                .verified_released_versions,
            ["0.9.138", "0.9.140"]
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.execution_mode,
            "process-per-test"
        );
        assert_eq!(
            contract
                .runner_attempt_identity
                .nextest
                .identity_environment,
            [
                "NEXTEST",
                "NEXTEST_RUN_ID",
                "NEXTEST_VERSION",
                "NEXTEST_EXECUTION_MODE",
                "NEXTEST_BINARY_ID",
                "NEXTEST_TEST_NAME",
                "NEXTEST_ATTEMPT",
                "NEXTEST_TOTAL_ATTEMPTS",
                "NEXTEST_ATTEMPT_ID",
                "NEXTEST_STRESS_CURRENT",
                "NEXTEST_STRESS_TOTAL",
            ]
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.stress_iteration,
            "distinct-axis-unsupported-fail-closed"
        );
        assert_eq!(
            contract
                .runner_attempt_identity
                .nextest
                .selected_but_unstarted,
            "logical-test-identity-only"
        );
        assert_eq!(
            contract
                .runner_attempt_identity
                .nextest
                .selection_projection,
            "exact-pre-and-post-separator"
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.concurrent_attempts,
            "distinct-durable-ordinal-and-attempt-id"
        );
        assert_eq!(
            contract.runner_attempt_identity.nextest.target_runner_death,
            "unmatched-durable-reservation-fatal"
        );
        assert!(
            contract
                .source_identity
                .authored_canonical_fields
                .iter()
                .any(|field| field == "semantic-discriminator")
        );
        assert!(
            contract
                .source_identity
                .synthetic_expansion_canonical_fields
                .iter()
                .any(|field| field == "owner-local-ordinal")
        );
        assert_eq!(
            contract.required_identity_axes,
            ["run", "worker", "test", "retry", "phase"]
        );
        for surface in [
            "authored-source",
            "declarative-macro-expansion",
            "procedural-macro-expansion",
            "derive-expansion",
            "build-script-generated-source",
            "included-source",
            "const-evaluation",
            "doctest-source",
        ] {
            assert!(
                contract
                    .required_owned_surfaces
                    .iter()
                    .any(|item| item == surface)
            );
        }
        assert!(!contract.external_coverage_in_product);
    }

    fn private_companion_handshake() -> RustCompilerCompanionHandshake {
        RustCompilerCompanionHandshake {
            protocol_version: RUST_COMPILER_COMPANION_PROTOCOL_VERSION,
            frontend_id: "rust".into(),
            coverage_model_variant: "rust-source-v1".into(),
            evidence_schema_version: EVIDENCE_ARCHIVE_SCHEMA_VERSION,
            companion_build_id: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                .into(),
            compiler: RustCompilerIdentity {
                rustc_commit_hash: "59807616e1fa2540724bfbac14d7976d7e4a3860".into(),
                rustc_release: "1.95.0".into(),
                host_triple: "aarch64-apple-darwin".into(),
                rustc_driver_sha256:
                    "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789".into(),
            },
            capabilities: RustCompilerCompanionCapabilities {
                expanded_hir_provenance: true,
                runtime_mir_probe_insertion: true,
                generated_source_provenance: true,
                ctfe_path_tracing: false,
                rustdoc_doctest_tracing: false,
                exact_test_harness_attribution: false,
            },
        }
    }

    #[test]
    fn rust_compiler_companion_contract_is_owned_exact_and_fail_closed() {
        let contract = rust_compiler_companion_contract().unwrap();
        assert_eq!(
            contract.protocol_version,
            RUST_COMPILER_COMPANION_PROTOCOL_VERSION
        );
        assert_eq!(contract.frontend_id, "rust");
        assert_eq!(contract.coverage_model_variant, "rust-source-v1");
        assert_eq!(
            contract.selection_identity,
            ["rustcCommitHash", "hostTriple", "rustcDriverSha256"]
        );
        assert_eq!(
            contract.evidence_schema_version,
            EVIDENCE_ARCHIVE_SCHEMA_VERSION
        );
        assert_eq!(
            contract.required_public_capabilities,
            [
                "expandedHirProvenance",
                "runtimeMirProbeInsertion",
                "generatedSourceProvenance",
                "ctfePathTracing",
                "rustdocDoctestTracing",
                "exactTestHarnessAttribution",
            ]
        );
        assert!(contract.unknown_fields_fatal);
        assert!(contract.exact_identity_required);
        assert!(!contract.external_coverage_engine);
        assert_eq!(contract.missing_or_mismatched_companion, "fail-closed");
        assert_eq!(contract.user_runtime_components, ["cargo", "rustc"]);
        assert!(contract.user_development_components.is_empty());
    }

    #[test]
    fn rust_probe_transport_contract_fixes_layout_and_fail_closed_health() {
        let contract = rust_probe_transport_contract().unwrap();
        assert_eq!(
            contract.protocol_version,
            RUST_PROBE_TRANSPORT_PROTOCOL_VERSION
        );
        assert_eq!(contract.status, "frozen-private-frontend");
        assert_eq!(contract.magic, RUST_PROBE_TRANSPORT_MAGIC);
        assert_eq!(contract.byte_order, "little-endian");
        assert_eq!(contract.header_size, RUST_PROBE_TRANSPORT_HEADER_SIZE);
        assert_eq!(
            contract.descriptor_size,
            RUST_PROBE_TRANSPORT_DESCRIPTOR_SIZE
        );
        assert_eq!(contract.token_size, RUST_PROBE_TRANSPORT_TOKEN_SIZE);
        assert_eq!(contract.endian_marker, 0x0102_0304);
        assert_eq!(contract.header_offsets.next_descriptor, 32);
        assert_eq!(contract.header_offsets.next_payload, 40);
        assert_eq!(contract.header_offsets.dropped, 48);
        assert_eq!(contract.header_offsets.token, 56);
        assert_eq!(contract.header_offsets.attachments, 72);
        assert_eq!(contract.header_offsets.next_phase, None);
        assert_eq!(contract.descriptor_offsets.commit, 0);
        assert_eq!(contract.descriptor_offsets.process_id, 4);
        assert_eq!(contract.descriptor_offsets.context_id, 8);
        assert_eq!(contract.descriptor_offsets.payload_offset, 16);
        assert_eq!(contract.descriptor_offsets.checksum, 32);
        assert_eq!(contract.record_kinds.hit, 1);
        assert_eq!(contract.record_kinds.decision, 2);
        assert_eq!(contract.record_kinds.ordinal_hit, 3);
        assert_eq!(contract.record_kinds.phase, None);
        assert_eq!(contract.publication.commit_value, 1);
        assert_eq!(contract.publication.writer_ordering, "release");
        assert_eq!(contract.publication.reader_ordering, "acquire");
        assert!(
            contract
                .publication
                .complete_descriptors_independently_recoverable
        );
        assert_eq!(
            contract.context.published_identity,
            ["run", "worker", "test", "retry", "phase"]
        );
        assert_eq!(contract.context.zero, "background-or-unattributed");
        assert_eq!(contract.context.max, "reserved-runtime-sentinel");
        assert!(
            contract
                .completeness
                .zero_attachments_blocks_terminal_passing_attempt
        );
        assert!(
            contract
                .completeness
                .dropped_records_block_terminal_passing_attempt
        );
        assert!(
            contract
                .completeness
                .incomplete_records_block_terminal_passing_attempt
        );
        assert!(
            contract
                .completeness
                .context_zero_excluded_from_passed_per_test_coverage
        );
        assert!(contract.integrity.symlink_transport_fatal);
        assert_eq!(
            contract.supported_targets,
            [
                "aarch64-apple-darwin",
                "x86_64-apple-darwin",
                "aarch64-unknown-linux-gnu",
                "aarch64-unknown-linux-musl",
                "x86_64-unknown-linux-gnu",
                "x86_64-unknown-linux-musl",
            ]
        );
        assert_eq!(contract.unsupported_target, "fail-closed");
    }

    #[test]
    fn rust_probe_transport_v3_adds_join_bounded_thread_phases_only() {
        let v1 = rust_probe_transport_contract().unwrap();
        let v3 = rust_probe_transport_v3_contract().unwrap();
        assert_eq!(v1.protocol_version, RUST_PROBE_TRANSPORT_PROTOCOL_VERSION);
        assert_eq!(v1.magic, RUST_PROBE_TRANSPORT_MAGIC);
        assert_eq!(v1.record_kinds.phase, None);
        assert_eq!(v1.thread_scope, None);
        assert_eq!(
            v3.protocol_version,
            RUST_PROBE_TRANSPORT_V3_PROTOCOL_VERSION
        );
        assert_eq!(v3.status, "candidate-private-frontend");
        assert_eq!(v3.magic, RUST_PROBE_TRANSPORT_V3_MAGIC);
        assert_eq!(v3.record_kinds.phase, Some(4));
        assert_eq!(v3.record_kinds.thread_phase, Some(5));
        assert_eq!(v3.record_kinds.thread_end, Some(6));
        assert_eq!(v3.record_kinds.test_boundary, Some(7));
        assert_eq!(v3.header_offsets.next_phase, Some(80));
        let thread_scope = v3.thread_scope.as_ref().expect("v3 freezes threadScope");
        assert_eq!(thread_scope.domain, "supercov-rust-thread-phase-v1\0");
        assert_eq!(
            thread_scope.escaped_thread_limitation,
            "RUST_THREAD_OUTLIVED_TEST"
        );
        assert!(thread_scope.escaped_thread_records_become_background);
        assert!(thread_scope.duplicate_thread_end_fatal);
        assert!(thread_scope.duplicate_test_boundary_fatal);
        assert!(thread_scope.thread_end_committed_when_start_routine_returns);
        assert!(thread_scope.test_boundary_committed_when_test_context_exits);
        assert_eq!(v3.header_size, v1.header_size);
        assert_eq!(v3.descriptor_size, v1.descriptor_size);
        assert_eq!(v3.token_size, v1.token_size);
        let mut v3_header = v3.header_offsets.clone();
        v3_header.next_phase = None;
        assert_eq!(v3_header, v1.header_offsets);
        assert_eq!(v3.descriptor_offsets, v1.descriptor_offsets);
        assert_eq!(v3.publication, v1.publication);
        assert_eq!(v3.integrity, v1.integrity);
        assert_eq!(v3.completeness, v1.completeness);
        assert_eq!(v3.supported_targets, v1.supported_targets);
        assert_eq!(v3.unsupported_target, v1.unsupported_target);
    }

    #[test]
    fn rust_compiler_companion_allows_private_spikes_but_blocks_public_readiness() {
        let handshake = private_companion_handshake();
        validate_rust_compiler_companion_handshake(&handshake).unwrap();
        require_matching_rust_compiler_companion(&handshake, &handshake.compiler, false).unwrap();
        assert_eq!(
            require_matching_rust_compiler_companion(&handshake, &handshake.compiler, true),
            Err(RustCompilerCompanionError::IncompleteCapabilities)
        );

        let mut diagnostic_release = handshake.compiler.clone();
        diagnostic_release.rustc_release = "1.95.0 (diagnostic alias)".into();
        require_matching_rust_compiler_companion(&handshake, &diagnostic_release, false).unwrap();

        let mut mismatched = handshake.compiler.clone();
        mismatched.rustc_driver_sha256 =
            "0000000000000000000000000000000000000000000000000000000000000000".into();
        assert_eq!(
            require_matching_rust_compiler_companion(&handshake, &mismatched, false),
            Err(RustCompilerCompanionError::CompilerMismatch)
        );
    }

    #[test]
    fn rust_compiler_companion_rejects_malformed_and_unknown_identity() {
        let mut malformed = private_companion_handshake();
        malformed.compiler.rustc_commit_hash = "59807616E1FA2540724BFBAC14D7976D7E4A3860".into();
        assert_eq!(
            validate_rust_compiler_companion_handshake(&malformed),
            Err(RustCompilerCompanionError::InvalidRustcCommit)
        );

        let mut value = serde_json::to_value(private_companion_handshake()).unwrap();
        value["nearestCompatibleCompiler"] = serde_json::json!(true);
        assert!(serde_json::from_value::<RustCompilerCompanionHandshake>(value).is_err());
    }
}
