//! Turning what a Supercov-owned runtime wrote into the model the report reads.
//!
//! Go, Java and Kotlin all write the same transport, because there is no
//! reason for them to differ and every reason not to: one format means one
//! reader, one set of edge cases, and no way for two languages to disagree
//! about what an evaluation was. Only the frontend declaration is per
//! language, because only that differs in substance.
//!
//! The transport itself is deliberately dumb — sparse pairs of probe ids and packed
//! vector words — because everything it could have computed instead is cheaper
//! to compute here, once, than in a process that is trying to run tests. The
//! mapping from probe id back to obligation lives in the manifest this module
//! is handed, so the runtime never carries a string.

use std::collections::{BTreeMap, BTreeSet};

use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION,
};

use crate::coverage_analysis::McdcVector;
use crate::coverage_report::{
    CoverageManifest, CoverageModelDeclaration, CoveragePhase, CoverageReportRequest,
    DecisionSnapshot, ExecutionScope, ExitCodeInput, PersistedCoverageModel, RawTestResult,
    RuntimeEvent, RuntimeSnapshot, TestProvenance,
};

/// The one phase an owned frontend can speak for is the test body itself, but
/// a phase identifies itself across the whole run: two tests naming their
/// bodies the same thing would be one phase claimed twice.
fn test_phase(test_id: &str) -> String {
    format!("{test_id}#call")
}
use crate::evidence_archive::EvidenceArchiveEntry;
use crate::go_instrumenter::{GoProbe, GoProbeTarget};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OwnedEvidenceError {
    Truncated(&'static str),
    NoTests,
}

impl std::fmt::Display for OwnedEvidenceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OwnedEvidenceError::Truncated(part) => {
                write!(f, "Coverage evidence ended in the middle of its {part}")
            }
            OwnedEvidenceError::NoTests => write!(
                f,
                "the run produced coverage evidence but no test announced itself"
            ),
        }
    }
}

/// One evaluation of a decision, as the runtime packed it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PackedVector {
    pub decision: u32,
    pub key: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct OwnedTestEvidence {
    pub name: String,
    /// How the test ended, as the framework saw it: `passed`, `failed` or
    /// `skipped`.
    pub status: String,
    /// Which runner announced it. Empty where the frontend has only one, in
    /// which case that one is the answer.
    pub runner: String,
    /// Whether what this test reached could be credited to it. False for a Go
    /// test that called `t.Parallel()`, an Example or a Fuzz target: the test
    /// ran and its coverage is in the run-wide totals, and nothing can say
    /// which of those totals were its.
    pub unattributed: bool,
    /// Probe id to the bitmask it was observed with.
    pub probes: BTreeMap<u32, u32>,
    pub vectors: Vec<PackedVector>,
}

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct OwnedEvidence {
    /// Run-wide probe totals, the union of every test's.
    pub global: Vec<u32>,
    pub tests: Vec<OwnedTestEvidence>,
    /// Conditions per decision, as the manifest ordered them.
    pub widths: Vec<u8>,
    /// Every distinct vector each decision produced, run-wide.
    pub decision_vectors: Vec<Vec<u64>>,
}

struct Cursor<'a> {
    bytes: &'a [u8],
    offset: usize,
}

impl Cursor<'_> {
    fn u64(&mut self, part: &'static str) -> Result<u64, OwnedEvidenceError> {
        let end = self.offset + 8;
        let slice = self
            .bytes
            .get(self.offset..end)
            .ok_or(OwnedEvidenceError::Truncated(part))?;
        self.offset = end;
        Ok(u64::from_le_bytes(slice.try_into().expect("eight bytes")))
    }

    fn text(&mut self, length: usize, part: &'static str) -> Result<String, OwnedEvidenceError> {
        let end = self.offset + length;
        let slice = self
            .bytes
            .get(self.offset..end)
            .ok_or(OwnedEvidenceError::Truncated(part))?;
        self.offset = end;
        String::from_utf8(slice.to_vec()).map_err(|_| OwnedEvidenceError::Truncated(part))
    }
}

/// Read the transport. A truncated file is an error rather than a short read:
/// a run that was killed half way through has partial evidence, and reporting
/// it as though it were complete would understate coverage as a fact.
pub fn read_evidence(bytes: &[u8]) -> Result<OwnedEvidence, OwnedEvidenceError> {
    let mut cursor = Cursor { bytes, offset: 0 };
    let probe_count = cursor.u64("probe totals")? as usize;
    let mut global = Vec::with_capacity(probe_count);
    for _ in 0..probe_count {
        global.push(cursor.u64("probe totals")? as u32);
    }
    let test_count = cursor.u64("test count")? as usize;
    let mut tests = Vec::with_capacity(test_count);
    for _ in 0..test_count {
        let length = cursor.u64("test name")? as usize;
        let name = cursor.text(length, "test name")?;
        let status_length = cursor.u64("test status")? as usize;
        let status = cursor.text(status_length, "test status")?;
        // Whether the probes below are this test's own. An empty probe list
        // means "reached nothing" when they are and "nothing can say what it
        // reached" when they are not, and the two must never be conflated.
        let unattributed = cursor.u64("test attribution")? != 0;
        let runner_length = cursor.u64("test runner")? as usize;
        let runner = cursor.text(runner_length, "test runner")?;
        let hits = cursor.u64("test probes")? as usize;
        let mut probes = BTreeMap::new();
        for _ in 0..hits {
            let index = cursor.u64("test probes")? as u32;
            probes.insert(index, cursor.u64("test probes")? as u32);
        }
        let vector_count = cursor.u64("test vectors")? as usize;
        let mut vectors = Vec::with_capacity(vector_count);
        for _ in 0..vector_count {
            let decision = cursor.u64("test vectors")? as u32;
            vectors.push(PackedVector {
                decision,
                key: cursor.u64("test vectors")?,
            });
        }
        tests.push(OwnedTestEvidence {
            name,
            status,
            runner,
            unattributed,
            probes,
            vectors,
        });
    }
    let decision_count = cursor.u64("decision table")? as usize;
    let mut widths = Vec::with_capacity(decision_count);
    let mut decision_vectors = Vec::with_capacity(decision_count);
    for _ in 0..decision_count {
        widths.push(cursor.u64("decision table")? as u8);
        let keys = cursor.u64("decision table")? as usize;
        let mut seen = Vec::with_capacity(keys);
        for _ in 0..keys {
            seen.push(cursor.u64("decision table")?);
        }
        decision_vectors.push(seen);
    }
    Ok(OwnedEvidence {
        global,
        tests,
        widths,
        decision_vectors,
    })
}

const PACKED_VALUE_SHIFT: u32 = 24;
const PACKED_OUTCOME_SHIFT: u32 = 48;

/// Unpack one evaluation into the vector MC/DC is judged from.
///
/// A condition the run never evaluated is `None`, not `false`. That is the
/// distinction the whole measurement rests on: `a && b` with `a` false says
/// nothing about `b`, and recording it as `false` would claim it had been
/// tested.
pub fn unpack_vector(key: u64, width: u8) -> McdcVector {
    let evaluated = key & ((1 << PACKED_VALUE_SHIFT) - 1);
    let values = (key >> PACKED_VALUE_SHIFT) & ((1 << PACKED_VALUE_SHIFT) - 1);
    McdcVector {
        values: (0..width)
            .map(|index| {
                let bit = 1_u64 << index;
                (evaluated & bit != 0).then_some(values & bit != 0)
            })
            .collect(),
        outcome: (key >> PACKED_OUTCOME_SHIFT) & 1 == 1,
    }
}

/// How a test's name and package became the identity the report uses.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OwnedTestOutcome {
    pub name: String,
    pub package: String,
    pub file: Option<String>,
    /// `passed`, `failed` or `skipped`, as the runner reported it.
    pub status: String,
    /// Which runner announced it, as the frontend declares that runner. Empty
    /// where the frontend has only one.
    pub runner: String,
    /// Whether what this test reached could be credited to it. False for a Go
    /// test that called `t.Parallel()`, an Example or a Fuzz target: it ran,
    /// and its coverage is in the run-wide record rather than in its own.
    pub attributed: bool,
}

/// How a language's runner attributes what it records.
///
/// Declared rather than assumed. A frontend that overstates its precision is
/// worse than one that admits a gap, because the report would then present a
/// guess as a measurement.
pub fn go_declaration() -> FrontendRunDeclaration {
    FrontendRunDeclaration {
        protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
        frontend_id: "supercov-go".into(),
        frontend_version: "go-owned-v1".into(),
        language: "go".into(),
        // Supercov owns the probes: `go test -cover` is a development oracle
        // here, not a product input.
        structural_source: supercov_contracts::StructuralSource::OwnedProbes,
        runners: vec![FrontendRunnerDeclaration {
            runner: "go-test".into(),
            // Go runs a package's tests one after another unless a test opts
            // into parallelism, and Supercov runs one package at a time.
            execution_model: ExecutionModel::SerialInProcess,
            attribution: exact_per_test(),
            limitations: {
                let mut limitations = owned_attribution_limitations("go");
                limitations.push(FrontendLimitation {
                    id: "go-parallel-tests".into(),
                    scopes: vec![FrontendLimitationScope::Test],
                    reason:
                        "a test that calls t.Parallel() runs alongside others, so work it does after that call is recorded run-wide rather than against that test"
                            .into(),
                });
                limitations
            },
        }],
        structural_limitations: Vec::new(),
    }
}

/// What a Go run's numbers mean, so a reader is never left to infer it.
pub fn go_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "go".into(),
        variant: "go-owned-probes-v1".into(),
        name: "supercov-go-owned-v1".into(),
        completeness_meaning: "Every obligation Supercov derived from the module's own Go sources was observed; explicit manifest limitations identify unmeasured Go surfaces.".into(),
        measured: vec![
            "owned Go statements and function entries".into(),
            "owned atomic condition vectors and decision outcomes".into(),
            "exact per-test attribution for tests that do not call t.Parallel()".into(),
        ],
        not_measured: vec![
            "generated code, vendored packages and testdata".into(),
            "work a test does after calling t.Parallel(), which counts run-wide".into(),
            "causal linkage to individual actions".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

/// The JVM's, where each framework reports a test's start and finish and
/// attribution follows the lifecycle the framework itself defines.
///
/// Two runners, because there are two lifecycles. The JUnit Platform covers
/// every engine built on it — Jupiter, Vintage, Kotest, Spock — and TestNG,
/// which is not one, reports through its own listener interface. They measure
/// the same way and say so with the same precision; what differs is who does
/// the announcing.
pub fn jvm_declaration() -> FrontendRunDeclaration {
    let runner = |name: &str, concurrency: &str| FrontendRunnerDeclaration {
        runner: name.into(),
        execution_model: ExecutionModel::SerialInProcess,
        attribution: exact_per_test(),
        limitations: {
            let mut limitations = owned_attribution_limitations(name);
            limitations.push(FrontendLimitation {
                id: format!("{name}-parallel-execution"),
                scopes: vec![FrontendLimitationScope::Test],
                reason: format!(
                    "with {concurrency}, tests overlap in one process; work they do concurrently is recorded run-wide rather than against a single test, and condition coverage is dropped because concurrent evaluations corrupt it"
                ),
            });
            limitations
        },
    };
    FrontendRunDeclaration {
        protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
        frontend_id: "supercov-jvm".into(),
        frontend_version: "jvm-owned-v1".into(),
        language: "jvm".into(),
        structural_source: supercov_contracts::StructuralSource::OwnedProbes,
        runners: vec![
            runner("junit-platform", "JUnit parallel execution enabled"),
            runner("testng", "TestNG's parallel suites or methods"),
        ],
        structural_limitations: Vec::new(),
    }
}

/// What a JVM run's numbers mean.
pub fn jvm_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "jvm".into(),
        variant: "jvm-owned-probes-v1".into(),
        name: "supercov-jvm-owned-v1".into(),
        completeness_meaning: "Every obligation Supercov derived from the project's own Java and Kotlin sources was observed; explicit manifest limitations identify unmeasured JVM surfaces.".into(),
        measured: vec![
            "owned Java and Kotlin statements and method entries".into(),
            "owned atomic condition vectors and decision outcomes".into(),
            "exact per-test attribution through the JUnit Platform's own lifecycle".into(),
        ],
        not_measured: vec![
            "generated sources, and bytecode with no source in the project".into(),
            "tests run concurrently, which count run-wide and drop condition coverage".into(),
            "causal linkage to individual actions".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

/// What the owned frontends cannot attribute, and why.
///
/// The contract will not accept a precision below `Exact` without a limitation
/// naming that scope, which is the right rule: a number that quietly means
/// less than it appears to is worse than one that says so. Supercov measures
/// statements and decisions here, so a test's individual actions and
/// assertions are outside what it claims, and a phase is a lifecycle the
/// probes never see.
fn owned_attribution_limitations(language: &str) -> Vec<FrontendLimitation> {
    vec![
        FrontendLimitation {
            id: format!("{language}-phase-linkage-aggregate"),
            scopes: vec![FrontendLimitationScope::Phase],
            reason:
                "probes record what a test reached, not which of its setup, body or teardown phases reached it"
                    .into(),
        },
        FrontendLimitation {
            id: format!("{language}-action-linkage-unavailable"),
            scopes: vec![FrontendLimitationScope::Action],
            reason: "there is no general application-action lifecycle to link coverage to".into(),
        },
        FrontendLimitation {
            id: format!("{language}-assertion-linkage-unavailable"),
            scopes: vec![FrontendLimitationScope::Assertion],
            reason:
                "coverage is attributed to the test that reached the code, not to the assertion that checked it"
                    .into(),
        },
    ]
}

fn exact_per_test() -> FrontendAttribution {
    FrontendAttribution {
        run: AttributionPrecision::Exact,
        worker: AttributionPrecision::Exact,
        test: AttributionPrecision::Exact,
        retry: AttributionPrecision::Exact,
        phase: AttributionPrecision::Aggregate,
        // Supercov measures statements and decisions here, not the individual
        // actions or assertions inside a test.
        action: AttributionPrecision::Unavailable,
        assertion: AttributionPrecision::Unavailable,
    }
}

/// Merge what several processes recorded into one run's evidence.
///
/// Both owned frontends need this, because both run a suite as more than one
/// process: `go test` builds a binary per package, and a multi-module JVM
/// build forks a JVM per module. Probe indices are project-wide, so run-wide
/// totals are a union of equal-length arrays, and test records simply
/// accumulate — each belongs to exactly the process that produced it.
pub fn merge_evidence(parts: Vec<OwnedEvidence>) -> OwnedEvidence {
    let mut merged = OwnedEvidence::default();
    for part in parts {
        if merged.global.len() < part.global.len() {
            merged.global.resize(part.global.len(), 0);
        }
        for (slot, value) in merged.global.iter_mut().zip(part.global) {
            *slot |= value;
        }
        if merged.widths.len() < part.widths.len() {
            merged.widths.resize(part.widths.len(), 0);
            merged
                .decision_vectors
                .resize(part.widths.len(), Vec::new());
        }
        for (id, width) in part.widths.into_iter().enumerate() {
            merged.widths[id] = merged.widths[id].max(width);
        }
        for (id, keys) in part.decision_vectors.into_iter().enumerate() {
            let seen = &mut merged.decision_vectors[id];
            for key in keys {
                if !seen.contains(&key) {
                    seen.push(key);
                }
            }
        }
        merged.tests.extend(part.tests);
    }
    merged
}

/// A short, stable identity derived from what makes the thing itself, so two
/// runs of the same test agree on what to call it.
fn stable_id(prefix: &str, values: &[&str]) -> String {
    use sha2::{Digest, Sha256};
    let mut hash = Sha256::new();
    for value in values {
        hash.update(value.as_bytes());
        hash.update([0]);
    }
    let digest = hash.finalize();
    let mut encoded = String::with_capacity(prefix.len() + 25);
    encoded.push_str(prefix);
    encoded.push(':');
    for byte in &digest[..12] {
        use std::fmt::Write as _;
        write!(&mut encoded, "{byte:02x}").expect("string formatting");
    }
    encoded
}

/// The obligation each probe answers for, by id.
fn obligations(probes: &BTreeMap<u64, GoProbe>) -> BTreeMap<u32, String> {
    probes
        .iter()
        .map(|(id, probe)| {
            let obligation = match &probe.target {
                GoProbeTarget::Statement { id } | GoProbeTarget::Function { id } => id.clone(),
                GoProbeTarget::Alternative { alternative, .. } => alternative.clone(),
            };
            (*id as u32, obligation)
        })
        .collect()
}

fn snapshot(
    environment: &str,
    evidence: &OwnedTestEvidence,
    manifest: &CoverageManifest,
    by_probe: &BTreeMap<u32, String>,
    phase: &str,
) -> RuntimeSnapshot {
    let mut events = Vec::new();
    let mut clock = 0_i64;
    let hits = evidence
        .probes
        .keys()
        .filter_map(|probe| by_probe.get(probe).cloned())
        .collect::<BTreeSet<_>>();
    for id in &hits {
        events.push(RuntimeEvent {
            event_type: "hit".into(),
            id: id.clone(),
            vector: None,
            timestamp_ms: clock,
            phase_id: Some(phase.to_owned()),
            statement_id: None,
            environment: environment.into(),
        });
        clock += 1;
    }
    let mut by_decision: BTreeMap<u32, Vec<u64>> = BTreeMap::new();
    for vector in &evidence.vectors {
        by_decision
            .entry(vector.decision)
            .or_default()
            .push(vector.key);
    }
    let mut decisions = Vec::new();
    for (index, meta) in manifest.decisions.iter().enumerate() {
        let Some(keys) = by_decision.get(&(index as u32)) else {
            continue;
        };
        let width = meta.conditions.len() as u8;
        let observed = keys
            .iter()
            .map(|key| unpack_vector(*key, width))
            .collect::<Vec<_>>();
        for vector in &observed {
            events.push(RuntimeEvent {
                event_type: "decision".into(),
                id: meta.id.clone(),
                vector: Some(vector.clone()),
                timestamp_ms: clock,
                phase_id: Some(phase.to_owned()),
                statement_id: None,
                environment: environment.into(),
            });
            clock += 1;
        }
        decisions.push(DecisionSnapshot {
            meta: meta.clone(),
            vectors: observed,
        });
    }
    RuntimeSnapshot {
        decisions,
        hits: hits.into_iter().collect(),
        events,
        logicals: Vec::new(),
        phase_id: None,
    }
}

pub struct OwnedFrontendRun {
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
    pub tests: usize,
}

impl OwnedFrontendRun {
    /// The archive a run publishes: what the numbers mean, who produced them,
    /// the obligations they are measured against, and one record per test.
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let model = PersistedCoverageModel::from_declaration(
            self.request
                .coverage_model
                .as_ref()
                .expect("an owned frontend always declares a coverage model"),
        )
        .expect("owned coverage models are contract-valid");
        let mut entries = vec![
            EvidenceArchiveEntry {
                path: "coverage-model.json".into(),
                contents: serde_json::to_vec(&model)?,
            },
            EvidenceArchiveEntry {
                path: "frontend.json".into(),
                contents: serde_json::to_vec(&self.declaration)?,
            },
            EvidenceArchiveEntry {
                path: "manifest.json".into(),
                contents: serde_json::to_vec(&self.request.manifest)?,
            },
        ];
        for (index, result) in self.request.raw_results.iter().enumerate() {
            entries.push(EvidenceArchiveEntry {
                path: format!("results/{index:08}/mcdc.json"),
                contents: serde_json::to_vec(result)?,
            });
        }
        Ok(entries)
    }
}

/// Build the report request from what the run recorded.
///
/// A test the runner reported but that announced nothing still becomes a
/// result, with no coverage. Dropping it would make a suite look smaller than
/// it is, and a test that ran without reaching any measured line is a fact
/// worth seeing rather than an absence worth hiding.
/// Everything a report needs about one run of one owned frontend.
pub struct OwnedRunInputs<'a> {
    pub declaration: FrontendRunDeclaration,
    /// The label runtime events carry, so a reader can tell which frontend
    /// produced them.
    pub environment: &'a str,
    pub manifest: &'a CoverageManifest,
    pub probes: &'a BTreeMap<u64, GoProbe>,
    pub evidence: &'a OwnedEvidence,
    pub outcomes: &'a [OwnedTestOutcome],
    pub run_id: &'a str,
    pub generated_at: &'a str,
    pub test_exit_code: i32,
    /// What the numbers mean. Carried rather than inferred from the language,
    /// so a frontend cannot quietly inherit another's claims.
    pub coverage_model: CoverageModelDeclaration,
}

/// Build the report request from what the run recorded.
///
/// A test the runner reported but that announced nothing still becomes a
/// result, with no coverage. Dropping it would make a suite look smaller than
/// it is, and a test that ran without reaching any measured line is a fact
/// worth seeing rather than an absence worth hiding.
pub fn build_frontend_run(inputs: OwnedRunInputs) -> Result<OwnedFrontendRun, OwnedEvidenceError> {
    let OwnedRunInputs {
        declaration,
        environment,
        manifest,
        probes,
        evidence,
        outcomes,
        run_id,
        generated_at,
        test_exit_code,
        coverage_model,
    } = inputs;
    // The runner every result claims must be one the declaration names: a
    // result attributed to a runner nobody declared is a result nothing can
    // say the precision of, and the reader refuses it rather than guess.
    let default_runner = declaration
        .runners
        .first()
        .map(|runner| runner.runner.clone())
        .ok_or(OwnedEvidenceError::NoTests)?;
    let declared = declaration
        .runners
        .iter()
        .map(|runner| runner.runner.as_str())
        .collect::<BTreeSet<_>>();
    let source = declaration.frontend_version.clone();
    let by_probe = obligations(probes);
    let recorded = evidence
        .tests
        .iter()
        .map(|test| (test.name.clone(), test))
        .collect::<BTreeMap<_, _>>();
    let empty = OwnedTestEvidence::default();
    let mut raw_results = outcomes
        .iter()
        .map(|outcome| {
            let test = recorded.get(&outcome.name).copied().unwrap_or(&empty);
            // A test nothing could be credited to takes no hits at all, and
            // says so. Handing it the record's probes would be worse than
            // wrong: the runtime gives an unattributed record none, so the
            // result would read as a test that reached nothing.
            let test = if outcome.attributed { test } else { &empty };
            let test_id = format!("{}::{}", outcome.package, outcome.name);
            let phase = test_phase(&test_id);
            let provenance = TestProvenance {
                // What the record says, when the frontend declares it. A JVM
                // project can run JUnit and TestNG in one JVM, and a result
                // naming the wrong one would claim it was attributed by a
                // lifecycle that never saw it.
                runner: if declared.contains(outcome.runner.as_str()) {
                    outcome.runner.clone()
                } else {
                    default_runner.clone()
                },
                kind: "unit".into(),
                project: Some(outcome.package.clone()),
                source: source.clone(),
            };
            RawTestResult {
                scope: Some(ExecutionScope {
                    version: 1,
                    run_id: run_id.to_owned(),
                    // The unit that ran as its own process: a Go test binary
                    // is built per package, and a JVM suite is one JVM. A
                    // worker identity the reader can trust is what lets it
                    // accept exact attribution at all.
                    worker_id: outcome.package.clone(),
                    test_id: test_id.clone(),
                    test_key: stable_id("owned-test", &[&outcome.package, &outcome.name]),
                    retry: 0,
                    attempt_id: stable_id(
                        "owned-attempt",
                        &[run_id, &outcome.package, &outcome.name, "0"],
                    ),
                }),
                test_id: Some(test_id),
                test: outcome.name.clone(),
                test_file: outcome.file.clone(),
                title: None,
                retry: Some(0),
                status: Some(outcome.status.clone()),
                expected_status: None,
                flaky: false,
                provenance: provenance.clone(),
                role: "test".into(),
                attribution: if outcome.attributed {
                    crate::coverage_report::ATTRIBUTION_EXACT
                } else {
                    crate::coverage_report::ATTRIBUTION_RUN_WIDE
                }
                .into(),
                // Every event a probe produces belongs to the test body: the
                // runtime binds coverage at the test boundary and knows
                // nothing of setup or teardown. One declared phase says
                // exactly that, and leaves the events with somewhere real to
                // point rather than at a phase nobody declared.
                phases: vec![CoveragePhase {
                    id: phase.clone(),
                    kind: "test".into(),
                    operation: format!("{} {}", provenance.runner, outcome.name),
                    source: outcome.file.clone(),
                    caused_by_phase_id: None,
                    started_at_ms: 0,
                    ended_at_ms: None,
                    status: Some(outcome.status.clone()),
                    error: None,
                }],
                runtime: vec![snapshot(environment, test, manifest, &by_probe, &phase)],
                browser: Vec::new(),
                server: Vec::new(),
            }
        })
        .collect::<Vec<_>>();
    // Everything the run reached that no test claimed.
    //
    // A Go test that calls t.Parallel() is deliberately left unattributed:
    // probes are a store into one shared array, so what it reaches while
    // others run beside it cannot be credited to it. The declaration says that
    // coverage still counts run-wide -- and until now nothing carried it, so a
    // suite written the way Go suites are written measured almost nothing and
    // was told nothing about why. samber/lo calls t.Parallel() 1606 times.
    //
    // It is recorded as its own record, under a role that is not a test,
    // holding only what the tests did not claim: reached, by nobody nameable.
    let claimed = evidence
        .tests
        .iter()
        .filter(|test| !test.unattributed)
        .flat_map(|test| test.probes.keys().copied())
        .collect::<BTreeSet<_>>();
    let unclaimed = evidence
        .global
        .iter()
        .enumerate()
        .filter(|(index, mask)| **mask != 0 && !claimed.contains(&(*index as u32)))
        .map(|(index, mask)| (index as u32, *mask))
        .collect::<BTreeMap<_, _>>();
    if !unclaimed.is_empty() {
        // Whether this counts as coverage turns on whether it was produced by
        // something that passed, which is the same rule every test record
        // obeys: a failing test's coverage is not evidence that anything
        // works. Here the producers cannot be named individually, so the
        // question is asked of the run: if every test passed, everything this
        // holds was produced by a passing test. If any failed, there is no
        // telling which of this came from it, and none of it counts.
        let status = if test_exit_code == 0 {
            "passed"
        } else {
            "failed"
        };
        let test_id = format!("{}::background", declaration.language);
        let phase = test_phase(&test_id);
        let background = OwnedTestEvidence {
            name: "background".into(),
            status: "unknown".into(),
            runner: String::new(),
            // This record is where unattributed coverage goes; it is not
            // itself a test whose coverage went elsewhere.
            unattributed: false,
            probes: unclaimed,
            vectors: Vec::new(),
        };
        raw_results.push(RawTestResult {
            scope: Some(ExecutionScope {
                version: 1,
                run_id: run_id.to_owned(),
                worker_id: "background".into(),
                test_id: test_id.clone(),
                test_key: stable_id("owned-background", &[run_id]),
                retry: 0,
                attempt_id: stable_id("owned-background-attempt", &[run_id]),
            }),
            test_id: Some(test_id),
            test: "execution no test could be credited with".into(),
            test_file: None,
            title: None,
            retry: Some(0),
            status: Some(status.into()),
            expected_status: None,
            flaky: false,
            provenance: TestProvenance {
                runner: default_runner.clone(),
                kind: "background".into(),
                project: None,
                source: source.clone(),
            },
            role: "background".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: vec![CoveragePhase {
                id: phase.clone(),
                kind: "background".into(),
                operation: "execution outside any test".into(),
                source: None,
                caused_by_phase_id: None,
                started_at_ms: 0,
                ended_at_ms: Some(0),
                status: Some(status.into()),
                error: None,
            }],
            runtime: vec![snapshot(
                environment,
                &background,
                manifest,
                &by_probe,
                &phase,
            )],
            browser: Vec::new(),
            server: Vec::new(),
        });
    }

    // Nothing to publish only when neither a test nor the run as a whole
    // reached anything. An empty list of outcomes on its own is not that: a Go
    // package whose every test calls `t.Parallel()` announces no test by
    // design, and refusing it there discarded a fully measured package --
    // lines, branches and MC/DC alike -- over the fact that the evidence had
    // no owner. The background record above is the owner it has.
    if raw_results.is_empty() {
        return Err(OwnedEvidenceError::NoTests);
    }

    // A declaration naming a runner that produced nothing claims something the
    // run did not do, and the reader refuses it — rightly. A JVM frontend can
    // drive JUnit and TestNG, but any one project usually runs one of them, so
    // the run declares the ones it actually observed.
    let observed = raw_results
        .iter()
        .map(|result| result.provenance.runner.as_str())
        .collect::<BTreeSet<_>>();
    let mut declaration = declaration;

    // What the manifest says could not be measured, the declaration has to
    // name too: the reader checks that the two agree, so a limitation cannot
    // appear in one and be missing from the other. The ids are derived per
    // obligation from the file and the node, so a static declaration could
    // never have listed them and this is the only place that knows them.
    declaration.structural_limitations = manifest
        .limitations
        .iter()
        .filter_map(|limitation| limitation.get("id")?.as_str().map(str::to_owned))
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect();

    if declaration
        .runners
        .iter()
        .any(|runner| observed.contains(runner.runner.as_str()))
    {
        declaration
            .runners
            .retain(|runner| observed.contains(runner.runner.as_str()));
    }
    Ok(OwnedFrontendRun {
        declaration,
        tests: raw_results.len(),
        request: CoverageReportRequest {
            run_id: run_id.to_owned(),
            manifest: manifest.clone(),
            raw_results,
            generated_at: generated_at.to_owned(),
            coverage_model: Some(coverage_model),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(test_exit_code)),
        },
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn write(values: &[u64]) -> Vec<u8> {
        values.iter().flat_map(|v| v.to_le_bytes()).collect()
    }

    #[test]
    fn an_unevaluated_condition_is_absent_rather_than_false() {
        // The distinction the whole measurement rests on. `a && b` with `a`
        // false says nothing about `b`; recording it as false would claim it
        // had been tested, and independence would be judged from a fact that
        // never happened.
        let short_circuited = unpack_vector(0b01, 2);
        assert_eq!(short_circuited.values, [Some(false), None]);
        assert!(!short_circuited.outcome);

        let both = unpack_vector(0b11 | (0b11 << 24) | (1 << 48), 2);
        assert_eq!(both.values, [Some(true), Some(true)]);
        assert!(both.outcome);

        // A condition evaluated and false is Some(false), which is a different
        // vector from the one above.
        let first_false = unpack_vector(0b11 | (0b01 << 24), 2);
        assert_eq!(first_false.values, [Some(true), Some(false)]);
    }

    #[test]
    fn a_truncated_file_is_refused_rather_than_read_short() {
        // A run killed part way through has partial evidence. Reading what
        // survived and reporting it as complete would understate coverage as
        // though it were a fact about the tests.
        let full = write(&[2, 0, 2, 1, 4, u64::from_le_bytes(*b"Test\0\0\0\0"), 0, 0, 0]);
        for cut in [0, 8, 16, 24, 32] {
            assert!(
                read_evidence(&full[..cut.min(full.len())]).is_err(),
                "a file cut at {cut} bytes must not decode"
            );
        }
        assert!(matches!(
            read_evidence(&write(&[5, 1])),
            Err(OwnedEvidenceError::Truncated("probe totals"))
        ));
    }

    #[test]
    fn a_run_with_no_tests_is_an_error_not_an_empty_report() {
        // Nothing announced itself and nothing was reached: there is no run
        // here, and an empty report would claim a floor it never established.
        // What makes this an error is the second half, not the first -- see
        // the test below.
        let evidence = OwnedEvidence::default();
        let manifest = CoverageManifest {
            decisions: Vec::new(),
            points: Vec::new(),
            branches: Vec::new(),
            limitations: Vec::new(),
            unmeasured: Vec::new(),
            scope: None,
        };
        assert_eq!(
            build_frontend_run(OwnedRunInputs {
                declaration: go_declaration(),
                environment: "go",
                manifest: &manifest,
                probes: &BTreeMap::new(),
                evidence: &evidence,
                outcomes: &[],
                run_id: "run",
                generated_at: "now",
                test_exit_code: 0,
                coverage_model: go_coverage_model(),
            })
            .err(),
            Some(OwnedEvidenceError::NoTests)
        );
    }

    #[test]
    fn a_run_nothing_could_be_attributed_to_is_still_a_run() {
        // A Go package where every test calls `t.Parallel()` announces no test
        // by design: probes are a store into one shared array, so what a test
        // reaches while others run beside it cannot be credited to it. The
        // coverage is real and has no owner, and refusing the run over that
        // discarded a fully measured package -- lines, branches and MC/DC
        // alike -- which is how an idiomatic Go suite came to publish nothing
        // at all.
        let evidence = OwnedEvidence {
            global: vec![1],
            ..OwnedEvidence::default()
        };
        let manifest = CoverageManifest {
            decisions: Vec::new(),
            points: vec![crate::coverage_report::PointMeta {
                id: "go:statement:one".into(),
                kind: crate::coverage_analysis::PointKind::Statement,
                file: "lib.go".into(),
                line: 1,
                column: 1,
                source: "return 1".into(),
                label: None,
            }],
            branches: Vec::new(),
            limitations: Vec::new(),
            unmeasured: Vec::new(),
            scope: None,
        };
        let probes = BTreeMap::from([(
            0_u64,
            GoProbe {
                id: 0,
                target: GoProbeTarget::Statement {
                    id: "go:statement:one".into(),
                },
                at: 0,
            },
        )]);
        let run = build_frontend_run(OwnedRunInputs {
            declaration: go_declaration(),
            environment: "go",
            manifest: &manifest,
            probes: &probes,
            evidence: &evidence,
            outcomes: &[],
            run_id: "run",
            generated_at: "now",
            test_exit_code: 0,
            coverage_model: go_coverage_model(),
        })
        .expect("a measured package publishes even when no test can claim it");
        assert_eq!(run.tests, 1, "the one record is what nobody could claim");
        assert_eq!(run.request.raw_results[0].role, "background");
        assert_eq!(
            run.request.raw_results[0].status.as_deref(),
            Some("passed"),
            "it counts as coverage because the run passed"
        );
    }

    #[test]
    fn each_declaration_says_what_its_runner_can_and_cannot_attribute() {
        // The JVM's differs in substance, not just in name: it lists TestNG as
        // a gap because TestNG is not a platform engine, and parallel
        // execution as another.
        let jvm = jvm_declaration();
        let jvm_runner = &jvm.runners[0];
        assert_eq!(jvm_runner.runner, "junit-platform");
        let gaps = jvm_runner
            .limitations
            .iter()
            .map(|limitation| limitation.id.as_str())
            .collect::<Vec<_>>();
        assert!(
            gaps.contains(&"junit-platform-parallel-execution"),
            "{gaps:?}"
        );
        // TestNG is a runner of its own rather than a gap in another: it is
        // not a platform engine, so it reports through its own listener.
        let named = jvm
            .runners
            .iter()
            .map(|runner| runner.runner.as_str())
            .collect::<Vec<_>>();
        assert_eq!(named, ["junit-platform", "testng"]);
    }

    #[test]
    fn the_declaration_says_what_go_can_and_cannot_attribute() {
        // A frontend that overstates its precision is worse than one that
        // admits a gap: the report would present guesses as measurements.
        let declared = go_declaration();
        let runner = &declared.runners[0];
        assert_eq!(runner.execution_model, ExecutionModel::SerialInProcess);
        assert_eq!(runner.attribution.test, AttributionPrecision::Exact);
        assert_eq!(
            runner.attribution.assertion,
            AttributionPrecision::Unavailable
        );
        let gaps = runner
            .limitations
            .iter()
            .map(|limitation| limitation.id.as_str())
            .collect::<Vec<_>>();
        assert!(gaps.contains(&"go-parallel-tests"), "{gaps:?}");
        // And every precision below Exact is accounted for, which is what the
        // contract requires before a reader will accept the run at all.
        for gap in [
            "go-phase-linkage-aggregate",
            "go-action-linkage-unavailable",
            "go-assertion-linkage-unavailable",
        ] {
            assert!(gaps.contains(&gap), "{gaps:?}");
        }
    }

    #[test]
    fn a_test_nothing_can_credit_is_named_without_being_handed_the_run() {
        // This is the whole of the fix in one place. A test that called
        // `t.Parallel()` is announced by name and with its real outcome, and a
        // record for it exists -- but the probes in that record are a store
        // into one shared array, so they are whatever ran beside it. Handing
        // them over would read as a measurement of this test, which is the
        // failure the run-wide label exists to prevent: it must take no hits
        // at all and say why, while the test beside it keeps its own.
        let manifest = CoverageManifest {
            decisions: Vec::new(),
            points: vec![
                crate::coverage_report::PointMeta {
                    id: "go:statement:one".into(),
                    kind: crate::coverage_analysis::PointKind::Statement,
                    file: "lib.go".into(),
                    line: 1,
                    column: 1,
                    source: "return 1".into(),
                    label: None,
                },
                crate::coverage_report::PointMeta {
                    id: "go:statement:two".into(),
                    kind: crate::coverage_analysis::PointKind::Statement,
                    file: "lib.go".into(),
                    line: 2,
                    column: 1,
                    source: "return 2".into(),
                    label: None,
                },
            ],
            branches: Vec::new(),
            limitations: Vec::new(),
            unmeasured: Vec::new(),
            scope: None,
        };
        let probes = BTreeMap::from([
            (
                0_u64,
                GoProbe {
                    id: 0,
                    target: GoProbeTarget::Statement {
                        id: "go:statement:one".into(),
                    },
                    at: 0,
                },
            ),
            (
                1_u64,
                GoProbe {
                    id: 1,
                    target: GoProbeTarget::Statement {
                        id: "go:statement:two".into(),
                    },
                    at: 0,
                },
            ),
        ]);
        // Both records hold probes. Only one of them owns what it holds.
        let evidence = OwnedEvidence {
            global: vec![1, 1],
            tests: vec![
                OwnedTestEvidence {
                    name: "TestSerial".into(),
                    status: "passed".into(),
                    runner: String::new(),
                    unattributed: false,
                    probes: BTreeMap::from([(0, 1)]),
                    vectors: Vec::new(),
                },
                OwnedTestEvidence {
                    name: "TestParallel".into(),
                    status: "passed".into(),
                    runner: String::new(),
                    unattributed: true,
                    probes: BTreeMap::from([(0, 1), (1, 1)]),
                    vectors: Vec::new(),
                },
            ],
            ..OwnedEvidence::default()
        };
        let outcome = |name: &str, attributed| OwnedTestOutcome {
            name: name.into(),
            runner: String::new(),
            package: "example.com/p".into(),
            file: Some("p/x_test.go".into()),
            status: "passed".into(),
            attributed,
        };
        let run = build_frontend_run(OwnedRunInputs {
            declaration: go_declaration(),
            environment: "go",
            manifest: &manifest,
            probes: &probes,
            evidence: &evidence,
            outcomes: &[outcome("TestSerial", true), outcome("TestParallel", false)],
            run_id: "run",
            generated_at: "now",
            test_exit_code: 0,
            coverage_model: go_coverage_model(),
        })
        .expect("run");

        let result = |name: &str| {
            run.request
                .raw_results
                .iter()
                .find(|result| result.test == name)
                .unwrap_or_else(|| panic!("{name} is missing from the run"))
        };
        let serial = result("TestSerial");
        assert_eq!(
            serial.attribution,
            crate::coverage_report::ATTRIBUTION_EXACT
        );
        assert_eq!(
            serial.runtime[0].hits,
            ["go:statement:one"],
            "a test that ran alone keeps what it reached"
        );

        let parallel = result("TestParallel");
        assert_eq!(
            parallel.attribution,
            crate::coverage_report::ATTRIBUTION_RUN_WIDE,
            "it ran, and what it reached belongs to the run rather than to it"
        );
        assert_eq!(
            parallel.status.as_deref(),
            Some("passed"),
            "unattributed is not unknown: the runner said how it ended"
        );
        assert!(
            parallel.runtime[0].hits.is_empty(),
            "it was handed the record's probes and they are not its own: {:?}",
            parallel.runtime[0].hits
        );
    }

    #[test]
    fn a_test_the_runner_saw_but_that_recorded_nothing_still_appears() {
        // Dropping it would make the suite look smaller than it is, and a test
        // that reached no measured line is a fact worth seeing.
        let manifest = CoverageManifest {
            decisions: Vec::new(),
            points: Vec::new(),
            branches: Vec::new(),
            limitations: Vec::new(),
            unmeasured: Vec::new(),
            scope: None,
        };
        let run = build_frontend_run(OwnedRunInputs {
            declaration: go_declaration(),
            environment: "go",
            manifest: &manifest,
            probes: &BTreeMap::new(),
            evidence: &OwnedEvidence::default(),
            outcomes: &[OwnedTestOutcome {
                name: "TestSilent".into(),
                runner: String::new(),
                package: "example.com/p".into(),
                file: Some("p/x_test.go".into()),
                status: "passed".into(),
                attributed: true,
            }],
            run_id: "run",
            generated_at: "now",
            test_exit_code: 0,
            coverage_model: go_coverage_model(),
        })
        .expect("run");
        assert_eq!(run.tests, 1);
        let result = &run.request.raw_results[0];
        assert_eq!(result.test, "TestSilent");
        assert_eq!(result.test_id.as_deref(), Some("example.com/p::TestSilent"));
        assert!(result.runtime[0].hits.is_empty());
    }

    #[test]
    fn both_owned_declarations_satisfy_the_contract_they_are_read_back_through() {
        // A declaration is written at publication and checked at read. The two
        // owned frontends once hardcoded a protocol version while the contract
        // moved on, so every Go and JVM run published cleanly and then failed
        // the moment anyone asked for its report.
        for declaration in [go_declaration(), jvm_declaration()] {
            let language = declaration.language.clone();
            supercov_contracts::validate_frontend_run_declaration(&declaration)
                .unwrap_or_else(|error| panic!("{language} declaration is unreadable: {error}"));
        }
    }
    #[test]
    fn merging_processes_unions_the_run_and_keeps_every_test() {
        let left = OwnedEvidence {
            global: vec![0b01, 0b00],
            tests: vec![OwnedTestEvidence {
                name: "TestA".into(),
                status: "passed".into(),
                ..Default::default()
            }],
            widths: vec![2],
            decision_vectors: vec![vec![0b01]],
        };
        let right = OwnedEvidence {
            global: vec![0b10, 0b10],
            tests: vec![OwnedTestEvidence {
                name: "TestB".into(),
                status: "failed".into(),
                ..Default::default()
            }],
            widths: vec![2],
            decision_vectors: vec![vec![0b01, 0b11]],
        };
        let merged = merge_evidence(vec![left, right]);
        // Run-wide totals are a union: a probe any package reached is reached.
        assert_eq!(merged.global, [0b11, 0b10]);
        // Tests accumulate, because each belongs to exactly one binary.
        assert_eq!(
            merged
                .tests
                .iter()
                .map(|test| test.name.as_str())
                .collect::<Vec<_>>(),
            ["TestA", "TestB"]
        );
        // And a vector seen in both packages is one vector, not two.
        assert_eq!(merged.decision_vectors, [vec![0b01, 0b11]]);
    }
}
