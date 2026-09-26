//! Supercov's single coverage engine. Target-language runtime adapters remain
//! thin generated shims; instrumentation, orchestration, analysis and queries
//! are owned here.

pub mod agent_json;
pub mod assertion_inputs;
pub mod assertion_map;
pub mod assertion_store;
pub mod build_cache;
pub mod child_signal_guard;
pub mod coverage_analysis;
pub mod coverage_export;
pub mod coverage_html;
pub mod coverage_index;
pub mod coverage_query;
pub mod coverage_report;
pub mod evidence_archive;
pub mod frontend_detection;
pub mod frontend_protocol;
pub mod go_instrumenter;
pub mod go_project;
pub mod go_run;
pub mod go_test_harness;
pub mod indexed_query;
pub mod integrity;
pub mod interned;
pub mod javascript_frontend;
pub mod javascript_run;
pub mod js_instrumenter;
pub mod jvm_instrumenter;
pub mod jvm_project;
pub mod jvm_run;
pub mod lifecycle;
pub mod orchestration;
pub mod owned_evidence;
pub mod patch_view;
pub mod probe_v2;
pub mod process_supervision;
pub mod progress;
pub mod project_discovery;
pub mod python_evidence;
#[cfg(any(test, feature = "oracle-harnesses"))]
pub mod python_frontend;
pub mod python_instrumenter;
pub mod python_project;
pub mod python_run;
pub mod query_index;
pub mod ruby_evidence;
pub mod ruby_instrumenter;
pub mod ruby_project;
pub mod ruby_run;
pub mod run_merge;
pub mod run_query;
pub mod run_store;
pub mod run_view;
pub mod rust_build_cache;
mod rust_cargo_config_model;
pub mod rust_cargo_configuration;
pub mod rust_compiler_ctfe;
pub mod rust_compiler_evidence;
pub mod rust_compiler_manifest;
pub mod rust_compiler_orchestration;
pub mod rust_compiler_run;
pub mod rust_compiler_selection;
pub mod rust_compiler_test_runner;
pub mod rust_doctest;
pub mod rust_instrumenter;
pub mod rust_libtest_companion;
pub mod rust_libtest_events;
pub mod rust_owned_doctests;
pub mod rust_owned_nextest;
pub mod rust_phase_projection;
pub mod rust_probe_transport;
pub mod rust_project;
pub mod rust_run;
pub mod rust_runner_attempt;
pub mod rust_runtime;
pub mod rust_test_context;
pub mod rust_test_runner;
pub mod security_candidates;
pub mod source_discovery;
pub mod source_units;
mod typescript_imports;
pub mod workspace;

pub use supercov_contracts::CONTRACT_VERSION;

pub fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}
