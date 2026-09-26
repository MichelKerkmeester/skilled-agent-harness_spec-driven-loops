#![feature(rustc_private)]

extern crate rustc_abi;
extern crate rustc_ast;
extern crate rustc_data_structures;
extern crate rustc_driver;
extern crate rustc_errors;
extern crate rustc_hir;
extern crate rustc_hir_pretty;
extern crate rustc_interface;
extern crate rustc_log;
extern crate rustc_middle;
extern crate rustc_parse;
extern crate rustc_session;
extern crate rustc_span;
extern crate tracing_tree;

use std::rc::Rc;
use std::{
    cell::RefCell,
    collections::{BTreeMap, BTreeSet, HashMap},
    env, fmt,
    fs::{self, File, OpenOptions},
    io::{self, Write},
    path::{Component, Path, PathBuf},
    process::{Command, Stdio},
    sync::{
        LazyLock, Mutex, OnceLock,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
};

use rustc_data_structures::steal::Steal;
use rustc_driver::{Callbacks, Compilation};
use rustc_errors::ErrorGuaranteed;
use rustc_hir::{
    self as hir,
    def::DefKind,
    intravisit::{self, Visitor},
};
use rustc_interface::interface::{Compiler, Config};
use rustc_middle::{
    mir::{
        BasicBlock, BasicBlockData, Body, CallSource, Const, ConstOperand, Local, LocalDecl,
        Operand, Place, ProjectionElem, Rvalue, SourceInfo, Statement, StatementKind, Terminator,
        TerminatorKind, UnwindAction,
        coverage::{CoverageKind, MappingKind},
        interpret::Scalar,
    },
    ty::{self, TyCtxt},
    util::Providers,
};
use rustc_session::{
    EarlyDiagCtxt, Session,
    config::{CoverageLevel, ErrorOutputType, InstrumentCoverage},
};
use rustc_span::{DUMMY_SP, DesugaringKind, FileName, def_id::LocalDefId, source_map::Spanned};

use rustc_log::{
    LoggerConfig,
    tracing::{Event, Subscriber, field},
    tracing_subscriber::{
        Layer, Registry,
        filter::{Directive, EnvFilter, LevelFilter, filter_fn},
        fmt::{
            FmtContext,
            format::{self, FmtSpan, FormatEvent, FormatFields},
            writer::BoxMakeWriter,
        },
        layer::SubscriberExt,
        registry::LookupSpan,
    },
};
use rustc_parse::{lexer::StripTokens, new_parser_from_source_str};
use sha2::{Digest, Sha256};

macro_rules! exact_def_path {
    ($tcx:expr, $def_id:expr) => {
        rustc_middle::ty::print::with_no_trimmed_paths!($tcx.def_path_str($def_id))
    };
}

const OUTPUT_DIRECTORY: &str = "SUPERCOV_RUST_COMPILER_OUTPUT";
const INSTRUMENT_MIR: &str = "SUPERCOV_RUST_INSTRUMENT_MIR";
/// Fail the compilation when an obligation cannot be bound exactly, instead
/// of degrading it to a recorded limitation. Supercov's own gates set this so
/// the corpus keeps proving exactness and every new generated-code shape stays
/// a hard, discoverable signal; user builds degrade instead.
const STRICT_BINDING: &str = "SUPERCOV_RUST_STRICT_BINDING";
/// Fault injection: treat every body whose definition contains this value as
/// unbindable. The degradation path must be provable on demand, or the
/// lattice that keeps arbitrary code compiling would itself be untested.
const FORCE_UNBINDABLE: &str = "SUPERCOV_RUST_FORCE_UNBINDABLE";
/// Fails only the decision bind phase, leaving every other phase of the body
/// to instrument normally. This is the shape that dominates the real corpus —
/// a narrow bind failure inside an otherwise bindable body — and the gate
/// built on it proves the surviving probes still fire, rather than being
/// reported as uncovered.
const FORCE_UNBOUND_DECISIONS: &str = "SUPERCOV_RUST_FORCE_UNBOUND_DECISIONS";
/// Marks a construct that cannot be measured here at all, as opposed to one
/// the binder failed to prove. Strict binding exists to keep binder blind
/// spots hard, so it must not fire on code that simply is not in this build.
///
/// The marker carries the exact obligation it refers to, written as
/// `UNMEASURABLE<id>|reason`. Unlike a binder failure — where we cannot know
/// which of a body's probes still fire and must decline the whole body — an
/// uncompiled construct is known precisely, so only that obligation is
/// declined and the rest of its body keeps exact measurement.
const UNMEASURABLE: &str = "UNMEASURABLE";
/// Fault injection: make two conditions of one decision claim the same switch
/// edge. A safety check that has never been shown to fire is not a guarantee,
/// so the misbind post-conditions are proven on demand.
const FORCE_MISBIND: &str = "SUPERCOV_RUST_FORCE_MISBIND";

/// Build the marker for an obligation that is not present in this build.
fn unmeasurable(id: &str, reason: &str) -> String {
    format!("{UNMEASURABLE}{id}|{reason}")
}

/// Recover the obligation an unmeasurable marker names, if the error carries
/// one.
fn unmeasurable_obligation(error: &str) -> Option<&str> {
    let rest = error.split_once(UNMEASURABLE)?.1;
    let (id, _) = rest.split_once('|')?;
    (!id.is_empty()).then_some(id)
}
const INSTRUMENT_CTFE: &str = "SUPERCOV_RUST_INSTRUMENT_CTFE";
const REAL_RUSTDOC: &str = "SUPERCOV_RUST_REAL_RUSTDOC";
const COMPANION_PATH: &str = "SUPERCOV_RUST_COMPANION_PATH";
const RUSTDOC_LAUNCHED: &str = "SUPERCOV_RUSTDOC_LAUNCHED";
const RUSTDOC_GROUP_ID: &str = "SUPERCOV_RUSTDOC_GROUP_ID";
const RUSTDOC_CAPTURE_OUTCOMES: &str = "SUPERCOV_RUSTDOC_CAPTURE_OUTCOMES";
const RUSTDOC_ENGINE_PATH: &str = "SUPERCOV_RUSTDOC_ENGINE_PATH";
const COMPILER_WRAPPER_CONFIG: &str = "SUPERCOV_RUST_COMPILER_WRAPPER_CONFIG";
const RUSTDOC_CATALOG_PATH: &str = "SUPERCOV_RUSTDOC_CATALOG_PATH";
const SOURCE_ROOT: &str = "SUPERCOV_RUST_SOURCE_ROOT";
const TARGET_ROOT: &str = "SUPERCOV_RUST_TARGET_ROOT";
const FORCE_ID_COLLISION: &str = "SUPERCOV_RUSTC_SPIKE_FORCE_ID_COLLISION";
const FORCE_PROBE_COLLISION: &str = "SUPERCOV_RUSTC_SPIKE_FORCE_PROBE_COLLISION";
const ABORT_AFTER_MANIFEST: &str = "SUPERCOV_RUSTC_SPIKE_ABORT_AFTER_MANIFEST";
const ABORT_CRATE: &str = "SUPERCOV_RUSTC_SPIKE_ABORT_CRATE";
const CTFE_WRITE_FAULT: &str = "SUPERCOV_RUSTC_SPIKE_CTFE_WRITE_FAULT";
const CTFE_WRITE_READY: &str = "SUPERCOV_RUSTC_SPIKE_CTFE_WRITE_READY";
const STATIC_RUNTIME_DIRECTORY: &str = "SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY";
const PROBE_FUNCTION: &str = "__supercov_rt_ordinal_hit";
const ACTIVE_CONTEXT_FUNCTION: &str = "__supercov_rt_active_context";
const CONTEXT_MARKER_FUNCTION: &str = "__supercov_rt_context_marker";
const ENTER_CONTEXT_FUNCTION: &str = "__supercov_rt_enter_context";
const ENTER_ASSERTION_CONTEXT_FUNCTION: &str = "__supercov_rt_enter_assertion_context";
const EXIT_CONTEXT_FUNCTION: &str = "__supercov_rt_exit_context";
const EXIT_TEST_CONTEXT_FUNCTION: &str = "__supercov_rt_exit_test_context";
const START_DECISION_FUNCTION: &str = "__supercov_rt_decision_start";
const RECORD_CONDITION_FUNCTION: &str = "__supercov_rt_decision_condition";
const FINISH_DECISION_FUNCTION: &str = "__supercov_rt_decision_finish";
const START_BRANCH_FUNCTION: &str = "__supercov_rt_branch_start";
const HIT_BRANCH_FUNCTION: &str = "__supercov_rt_branch_hit";
const CTFE_EVENT_TARGET: &str = "rustc_const_eval::interpret::step";
const RUNTIME_ABI_DECLARATIONS: &str = r#"
#[allow(dead_code)]
mod __supercov_spike_runtime {
    unsafe extern "C" {
        fn __supercov_rt_ordinal_hit(ordinal: u64);
        fn __supercov_rt_active_context() -> u64;
        fn __supercov_rt_context_marker(tag: u64, context: u64, previous: u64);
        fn __supercov_rt_enter_context(context_id: u64) -> u64;
        fn __supercov_rt_exit_context(previous: u64);
        fn __supercov_rt_exit_test_context(context_id: u64, previous: u64);
        fn __supercov_rt_enter_assertion_context(id_high: u64, id_low: u32) -> u64;
        fn __supercov_rt_decision_start(id_high: u64, id_low: u32, conditions: u64) -> u64;
        fn __supercov_rt_decision_condition(token: u64, index: u64, value: bool);
        fn __supercov_rt_decision_finish(token: u64, outcome: bool);
        fn __supercov_rt_branch_start() -> u64;
        fn __supercov_rt_branch_hit(token: u64, ordinal: u64);
    }
}
"#;

type OptimizedMirProvider = for<'tcx> fn(TyCtxt<'tcx>, LocalDefId) -> &'tcx Body<'tcx>;
type MirForCtfeProvider = for<'tcx> fn(TyCtxt<'tcx>, LocalDefId) -> &'tcx Body<'tcx>;
type MirBuiltProvider = for<'tcx> fn(TyCtxt<'tcx>, LocalDefId) -> &'tcx Steal<Body<'tcx>>;
type MirDropsProvider = for<'tcx> fn(TyCtxt<'tcx>, LocalDefId) -> &'tcx Steal<Body<'tcx>>;

static ORIGINAL_OPTIMIZED_MIR: OnceLock<OptimizedMirProvider> = OnceLock::new();
static ORIGINAL_MIR_FOR_CTFE: OnceLock<MirForCtfeProvider> = OnceLock::new();
static ORIGINAL_MIR_BUILT: OnceLock<MirBuiltProvider> = OnceLock::new();
static ORIGINAL_MIR_DROPS: OnceLock<MirDropsProvider> = OnceLock::new();
/// Obligations that could not be bound exactly and were degraded to recorded
/// limitations instead of failing the build. MIR passes run inside
/// `after_analysis` (it forces `optimized_mir`/`mir_for_ctfe` per body before
/// the manifest is written), so degradations recorded here always reach the
/// crate's manifest candidate.
static BINDER_LIMITATIONS: Mutex<BTreeSet<String>> = Mutex::new(BTreeSet::new());
/// Obligations Supercov declines to measure. A measurement gap is not a
/// coverage gap: these must be reported as unmeasured, never as uncovered,
/// and must leave the covered/uncovered denominator entirely.
static UNMEASURED_OBLIGATIONS: Mutex<BTreeSet<String>> = Mutex::new(BTreeSet::new());
static CTFE_EVENTS: Mutex<Vec<CtfeObservation>> = Mutex::new(Vec::new());
static CTFE_MARKERS: Mutex<BTreeMap<u64, CtfeMarkerIdentity>> = Mutex::new(BTreeMap::new());
static CTFE_MAPPINGS: Mutex<BTreeMap<u64, CtfeMarkerMapping>> = Mutex::new(BTreeMap::new());
static MATCH_ARM_MARKERS: LazyLock<Mutex<HashMap<LocalDefId, BTreeMap<u32, u64>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
static STRUCTURAL_DECISION_MARKERS: LazyLock<
    Mutex<HashMap<LocalDefId, Vec<StructuralDecisionConditionMarker>>>,
> = LazyLock::new(|| Mutex::new(HashMap::new()));
static LET_ELSE_MARKERS: LazyLock<Mutex<HashMap<LocalDefId, Vec<StructuralBranchMarker>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
static TRY_OPERATOR_MARKERS: LazyLock<Mutex<HashMap<LocalDefId, Vec<StructuralBranchMarker>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
static ASSERTION_PHASE_MARKERS: LazyLock<Mutex<HashMap<LocalDefId, Vec<AssertionPhaseMarker>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
static UNREACHABLE_MATCH_ARMS: Mutex<BTreeSet<String>> = Mutex::new(BTreeSet::new());
/// Bumped whenever an arm becomes known-unreachable.
///
/// Pruning depends on that set, so a cached pruning is only reusable while the
/// set is unchanged. Comparing this counter is what lets the body cache hand
/// back a shared value instead of cloning four maps per call.
static UNREACHABLE_MATCH_ARMS_VERSION: AtomicU64 = AtomicU64::new(0);
/// Obligations inside a branch a constant condition eliminates. `cfg!(..)`
/// expands to a bool literal, so `if cfg!(feature = "x")` with the feature off
/// never lowers its body. Such an obligation is unmeasurable in this
/// configuration, not a binder blind spot, and must not be reported as either
/// uncovered or unbound.
static CFG_ELIMINATED_POINTS: Mutex<BTreeSet<String>> = Mutex::new(BTreeSet::new());
static SOURCE_SNAPSHOTS: Mutex<BTreeMap<String, ExactSourceSnapshot>> = Mutex::new(BTreeMap::new());

thread_local! {
    /// Source identity resolved once per file per thread.
    ///
    /// Only populated after the file's bytes have been verified against the
    /// global snapshot, so a cache hit means both the identity and the
    /// verification are already done.
    static FILE_IDENTITY: RefCell<
        BTreeMap<rustc_span::StableSourceFileId, (String, &'static str, bool)>,
    > = const { RefCell::new(BTreeMap::new()) };
}
static DOCTEST_ROLE: OnceLock<&'static str> = OnceLock::new();
static COMPILATION_SUCCEEDED: AtomicBool = AtomicBool::new(false);
/// Binding passes actually run, not obligations merely collected.
///
/// Obligations are collected from HIR and their count never moves when binding
/// stops, so the exact fraction cannot tell "everything bound" from "nothing was
/// checked" -- both drive declines to zero. A change that skipped binding
/// entirely once scored +28 and +21 on the ratchet.
///
/// Counted at the four plan functions rather than at a query provider: an
/// earlier attempt counted `mir_drops` entries, which that same change still
/// triggered, so the number never moved and the gate missed it. Binding is what
/// must be counted, not the pass that usually precedes it.
static BOUND_BODIES: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, PartialEq, Eq)]
struct ExactSourceSnapshot {
    file: String,
    source: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct CtfeMarkerIdentity {
    crate_name: String,
    definition: String,
    observation_kind: &'static str,
    local_ordinal: u32,
}

#[derive(Clone, Debug)]
struct CtfeObservation {
    marker: u64,
    thread: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct CtfeMarkerMapping {
    identity: CtfeMarkerIdentity,
    hit_ordinals: BTreeSet<u64>,
    decision: Option<CtfeDecisionMapping>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct CtfeDecisionMapping {
    id: String,
    event: &'static str,
    condition_index: Option<u64>,
    value: Option<bool>,
    outcome: Option<bool>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct StableSourceRange {
    key: String,
    start: u32,
    end: u32,
    class: &'static str,
    owned: bool,
}

#[derive(Clone, Debug)]
struct PointObligation {
    canonical: String,
    source: StableSourceRange,
    provenance: &'static str,
    point_kind: &'static str,
    discriminator: String,
    probe_ordinal: u64,
    definitions: Vec<String>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct BranchAlternativeObligation {
    identity: StableObligationIdentity,
    label: &'static str,
}

#[derive(Clone, Debug)]
struct BranchObligation {
    identity: StableObligationIdentity,
    branch_kind: &'static str,
    discriminator: String,
    alternatives: Vec<BranchAlternativeObligation>,
    definitions: Vec<String>,
    mapping_source: Option<StableSourceRange>,
    /// The enclosing match arm at recording time. Same-source try operators
    /// generated in parallel arms have no CFG order, so their ControlFlow
    /// selections are scoped through the bound enclosing group's arm entry.
    parent_match_arm: Option<(String, usize)>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct MatchArmSelectionObligation {
    branch_id: String,
    body_source: StableSourceRange,
    /// The arm body's type is uninhabited, so the arm cannot complete. The
    /// `match void {}` idiom on an empty enum is the common case: it lowers to
    /// nothing at all. Such an arm is unmeasurable rather than unbindable, and
    /// must never be reported as uncovered.
    uninhabited_body: bool,
    /// The arm pattern's owned stable range when it has one. Foreign derives
    /// such as serde span generated patterns at the authored field/variant
    /// identifiers, so pre-borrow chain binding must accept an arm's own
    /// pattern range as well as the collapsed group source.
    pattern_source: Option<StableSourceRange>,
    /// The exact literal a string/byte-string pattern accepts. Same-length
    /// literal candidates lower into a shared multiway test tree that erases
    /// source arm order, so binding must match each FalseEdge's recovered
    /// literal instead of walking a chain.
    pattern_literal: Option<Vec<u8>>,
    /// The exact unsigned integer an integer-literal pattern accepts.
    /// Binding-free integer matches lower to one multiway `switchInt` with no
    /// FalseEdges, so arms bind directly to the matching value edges.
    pattern_int: Option<u128>,
    /// The enum variant this arm's pattern selects. A macro that expands one
    /// body fragment into several arms gives them all the same body span, so
    /// spans cannot tell the arms apart; the discriminant can.
    pattern_variant: Option<u32>,
    guarded: bool,
    guard_decision_id: Option<String>,
    selected_ordinal: u64,
    not_selected_ordinal: u64,
}

#[derive(Clone, Debug)]
struct MatchSelectionObligation {
    identity: StableObligationIdentity,
    arms: Vec<MatchArmSelectionObligation>,
    definitions: Vec<String>,
    parent_group_id: Option<String>,
    parent_site: Option<&'static str>,
    parent_arm_index: Option<usize>,
    /// Every ADT path appearing in the arm patterns (nested patterns test
    /// multiple discriminants). Same-source structures from skipped
    /// foreign-macro matches (serde's `tri!` on `Result`) must never compete
    /// as CFG candidates for a group whose patterns never test that type.
    pattern_adts: BTreeSet<String>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct DecisionCondition {
    source: StableSourceRange,
    branch_source: StableSourceRange,
    text: String,
    /// The refutable pattern's ADT for let conditions (`while let Some(..)`
    /// matches on Option). Pattern-class structural switches must test this
    /// exact type, or a sibling discriminant switch (a two-variant serde
    /// field dispatch) can pollute the pool.
    pattern_adt: Option<String>,
    /// The matched variant's index for let conditions on variant patterns
    /// (`if let Ok(..)` matches Result's first variant). An `if let` has no
    /// loop back edge to discriminate its two-way discriminant switch, so
    /// the true edge is the one accepting this variant's discriminant.
    pattern_variant: Option<u32>,
    true_outcome: Option<bool>,
    false_outcome: Option<bool>,
    invert_value: bool,
    authored_expression: bool,
    opaque_authored_macro: bool,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct DecisionLogicalSelection {
    branch_id: String,
    right_condition_index: usize,
}

#[derive(Clone, Debug)]
struct DecisionObligation {
    identity: StableObligationIdentity,
    decision_kind: &'static str,
    conditions: Vec<DecisionCondition>,
    definitions: Vec<String>,
    structural_marker: bool,
    assertion_source: Option<StableSourceRange>,
    outcome_branch_id: String,
    loop_branch_id: Option<String>,
    logical_selections: Vec<DecisionLogicalSelection>,
    /// The enclosing match arm at recording time. Same-source structural
    /// conditions generated in parallel arms have no CFG order, so their
    /// switches are scoped through the bound enclosing group's arm entry.
    parent_match_arm: Option<(String, usize)>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct StructuralDecisionConditionMarker {
    local: u32,
    decision_id: String,
    condition_index: usize,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct StructuralBranchMarker {
    local: u32,
    branch_id: String,
    alternative_ordinal: u64,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct AssertionPhaseMarker {
    local: u32,
    decision_id: String,
    statement_ordinal: Option<u64>,
    suspensions: Vec<AssertionSuspensionMarker>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct AssertionContextMarkerPair {
    tag: u64,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct AssertionSuspensionMarker {
    suspend: AssertionContextMarkerPair,
    resume: AssertionContextMarkerPair,
}

fn prune_unreachable_match_arms(
    branches: &mut BTreeMap<String, BranchObligation>,
    match_groups: &mut BTreeMap<String, MatchSelectionObligation>,
) {
    // Take only the ids this body actually mentions. Cloning the whole
    // unreachable set costs O(set) per call, the set grows with the crate, and
    // this runs for every caller of every body — which made pruning quadratic
    // in crate size and dominated the analysis on large crates.
    let mut removed_branches = BTreeSet::new();
    {
        let unreachable = UNREACHABLE_MATCH_ARMS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if unreachable.is_empty() {
            return;
        }
        for group in match_groups.values() {
            for arm in &group.arms {
                if unreachable.contains(&arm.branch_id) {
                    removed_branches.insert(arm.branch_id.clone());
                }
            }
        }
        for id in branches.keys() {
            if unreachable.contains(id) {
                removed_branches.insert(id.clone());
            }
        }
    }
    if removed_branches.is_empty() {
        return;
    }
    match_groups.retain(|_, group| {
        group
            .arms
            .retain(|arm| !removed_branches.contains(&arm.branch_id));
        if group.arms.len() < 2 {
            removed_branches.extend(group.arms.iter().map(|arm| arm.branch_id.clone()));
            false
        } else {
            true
        }
    });
    branches.retain(|id, _| !removed_branches.contains(id));
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct StableObligationIdentity {
    id: String,
    canonical: String,
    source: StableSourceRange,
    provenance: &'static str,
    probe_ordinal: u64,
    owner_local_ordinal: usize,
}

struct CtfeLayer;

impl<S> Layer<S> for CtfeLayer
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    fn on_event(
        &self,
        event: &Event<'_>,
        _context: rustc_log::tracing_subscriber::layer::Context<'_, S>,
    ) {
        if event.metadata().target() != CTFE_EVENT_TARGET
            || *event.metadata().level() != rustc_log::tracing::Level::INFO
        {
            return;
        }
        let mut visitor = CtfeEventVisitor::default();
        event.record(&mut visitor);
        if let Some(marker) = parse_ctfe_marker(&visitor.fields)
            && CTFE_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .contains_key(&marker)
        {
            CTFE_EVENTS
                .lock()
                .expect("CTFE events lock")
                .push(CtfeObservation {
                    marker,
                    thread: format!("{:?}", std::thread::current().id()),
                });
        }
    }
}

#[derive(Default)]
struct CtfeEventVisitor {
    fields: String,
}

impl field::Visit for CtfeEventVisitor {
    fn record_debug(&mut self, field: &field::Field, value: &dyn std::fmt::Debug) {
        use std::fmt::Write as _;
        // MIR debug values can contain definition paths. This private trace
        // observer is not a diagnostic emitter, so it must not register a
        // trimmed-path query that rustc later expects a diagnostic to consume.
        rustc_middle::ty::print::with_no_trimmed_paths!({
            let _ = write!(&mut self.fields, "{}={value:?};", field.name());
        });
    }
}

struct CompanionBacktraceFormatter {
    target: String,
}

impl<S, N> FormatEvent<S, N> for CompanionBacktraceFormatter
where
    S: Subscriber + for<'span> LookupSpan<'span>,
    N: for<'writer> FormatFields<'writer> + 'static,
{
    fn format_event(
        &self,
        _context: &FmtContext<'_, S, N>,
        mut writer: format::Writer<'_>,
        event: &Event<'_>,
    ) -> fmt::Result {
        if !event.metadata().target().contains(&self.target) {
            return Ok(());
        }
        let backtrace = std::backtrace::Backtrace::force_capture();
        writeln!(writer, "stack backtrace: \n{backtrace:?}")
    }
}

fn init_companion_logger(capture_ctfe: bool) -> Result<(), String> {
    let LoggerConfig {
        filter,
        color_logs,
        verbose_entry_exit,
        verbose_thread_ids,
        backtrace,
        json,
        output_target,
        wraptree,
        lines,
    } = LoggerConfig::from_env("RUSTC_LOG");
    let user_filter = match filter {
        Ok(value) => EnvFilter::new(value),
        Err(_) => EnvFilter::default().add_directive(Directive::from(LevelFilter::WARN)),
    };
    let color_logs = match color_logs {
        Ok(value) => match value.as_str() {
            "always" => true,
            "never" => false,
            "auto" => rustc_log::stderr_isatty(),
            _ => {
                return Err(format!(
                    "invalid log color value '{value}': expected one of always, never, or auto"
                ));
            }
        },
        Err(env::VarError::NotPresent) => rustc_log::stderr_isatty(),
        Err(env::VarError::NotUnicode(_)) => {
            return Err(
                "non-Unicode log color value: expected one of always, never, or auto".into(),
            );
        }
    };
    let verbose_entry_exit = verbose_entry_exit.is_ok_and(|value| value != "0");
    let verbose_thread_ids = verbose_thread_ids.is_ok_and(|value| value == "1");
    let lines = lines.is_ok_and(|value| value == "1");
    let json = json.is_ok_and(|value| value == "1");
    let output_target: BoxMakeWriter = match output_target {
        Ok(path) => match File::options()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&path)
        {
            Ok(file) => BoxMakeWriter::new(Mutex::new(file)),
            Err(error) => {
                eprintln!("couldn't open {path} as a log target: {error:?}");
                BoxMakeWriter::new(io::stderr)
            }
        },
        Err(_) => BoxMakeWriter::new(io::stderr),
    };
    let user_layer = if json {
        let formatter = rustc_log::tracing_subscriber::fmt::format()
            .json()
            .with_span_list(true)
            .with_source_location(true);
        let layer = rustc_log::tracing_subscriber::fmt::layer()
            .json()
            .event_format(formatter)
            .with_writer(output_target)
            .with_target(true)
            .with_ansi(false)
            .with_thread_ids(verbose_thread_ids)
            .with_thread_names(verbose_thread_ids)
            .with_span_events(FmtSpan::ACTIVE);
        Layer::boxed(layer)
    } else {
        let mut layer = tracing_tree::HierarchicalLayer::default()
            .with_writer(output_target)
            .with_ansi(color_logs)
            .with_targets(true)
            .with_verbose_exit(verbose_entry_exit)
            .with_verbose_entry(verbose_entry_exit)
            .with_indent_amount(2)
            .with_indent_lines(lines)
            .with_thread_ids(verbose_thread_ids)
            .with_thread_names(verbose_thread_ids);
        if let Ok(value) = wraptree {
            let width = value.parse::<usize>().map_err(|_| {
                format!("invalid log WRAPTREE value '{value}': expected a non-negative integer")
            })?;
            layer = layer.with_wraparound(width);
        }
        Layer::boxed(layer)
    };
    let backtrace_layer = backtrace.ok().map(|target| {
        rustc_log::tracing_subscriber::fmt::layer()
            .with_writer(io::stderr)
            .without_time()
            .event_format(CompanionBacktraceFormatter { target })
            .with_filter(user_filter.clone())
    });
    let ctfe_layer = capture_ctfe.then(|| {
        CtfeLayer.with_filter(filter_fn(|metadata| {
            metadata.target() == CTFE_EVENT_TARGET
                && *metadata.level() == rustc_log::tracing::Level::INFO
        }))
    });
    let subscriber = Registry::default()
        .with(user_layer.with_filter(user_filter))
        .with(backtrace_layer)
        .with(ctfe_layer);
    rustc_log::tracing::subscriber::set_global_default(subscriber)
        .map_err(|error| error.to_string())
}

fn normalized_path(path: &Path) -> PathBuf {
    let absolute = if path.is_absolute() {
        path.to_owned()
    } else {
        env::current_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
            .join(path)
    };
    let mut normalized = PathBuf::new();
    for component in absolute.components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                normalized.pop();
            }
            other => normalized.push(other.as_os_str()),
        }
    }
    normalized
}

/// Relative path of `path` inside `root`, or `None` when it is outside.
///
/// The lexical comparison is the fast path and decides almost every call.
/// It fails, however, when the root is reached through a symlink while the
/// compiler reports the physical file path — macOS `/tmp` and `/var` are the
/// common cases, along with symlinked worktrees and network mounts. Ownership
/// is a physical containment fact (`package_identity` already compares
/// canonical directories for exactly this reason), so fall back to comparing
/// canonical paths rather than declaring a file external and silently
/// measuring nothing.
fn root_relative(path: &Path, root: &Path) -> Option<PathBuf> {
    if let Ok(relative) = path.strip_prefix(root) {
        return Some(relative.to_owned());
    }
    let canonical_root = fs::canonicalize(root).ok()?;
    let canonical_path = fs::canonicalize(path).ok()?;
    canonical_path
        .strip_prefix(&canonical_root)
        .ok()
        .map(Path::to_owned)
}

fn normalized_root(variable: &str) -> Option<PathBuf> {
    env::var_os(variable)
        .map(PathBuf::from)
        .map(|path| normalized_path(&path))
}

fn generated_relative_path(path: &Path) -> Option<PathBuf> {
    let components = path.components().collect::<Vec<_>>();
    let out = components
        .iter()
        .position(|component| component.as_os_str() == "out")?;
    (out + 1 < components.len()).then(|| {
        components[out + 1..]
            .iter()
            .fold(PathBuf::new(), |mut path, component| {
                path.push(component.as_os_str());
                path
            })
    })
}

fn verify_generated_source_path(path: &Path, target_root: &Path) -> Result<(), String> {
    let metadata = fs::symlink_metadata(path).map_err(|error| {
        format!(
            "could not inspect generated source {}: {error}",
            path.display()
        )
    })?;
    if !metadata.file_type().is_file() {
        return Err(format!(
            "generated source is not a regular file: {}",
            path.display()
        ));
    }
    let canonical_root = fs::canonicalize(target_root).map_err(|error| {
        format!(
            "could not canonicalize generated-source root {}: {error}",
            target_root.display()
        )
    })?;
    let canonical_path = fs::canonicalize(path).map_err(|error| {
        format!(
            "could not canonicalize generated source {}: {error}",
            path.display()
        )
    })?;
    if !canonical_path.starts_with(&canonical_root) {
        return Err(format!(
            "generated source escaped its target root: {}",
            path.display()
        ));
    }
    Ok(())
}

fn package_identity(crate_name: &str) -> (String, bool) {
    let Some(manifest_directory) = env::var_os("CARGO_MANIFEST_DIR")
        .map(PathBuf::from)
        .map(|path| normalized_path(&path))
    else {
        return (format!("crate:{crate_name}"), false);
    };
    let Some(source_root) = normalized_root(SOURCE_ROOT) else {
        return (format!("crate:{crate_name}"), false);
    };
    // Cargo may physicalize CARGO_MANIFEST_DIR even when the command was
    // launched through a filesystem alias (macOS /var -> /private/var is the
    // common example). Ownership is a physical containment fact; the source
    // key below remains a relocatable workspace-relative display identity.
    let Ok(manifest_directory) = fs::canonicalize(manifest_directory) else {
        return (format!("crate:{crate_name}"), false);
    };
    let Ok(source_root) = fs::canonicalize(source_root) else {
        return (format!("crate:{crate_name}"), false);
    };
    let Ok(relative) = manifest_directory.strip_prefix(source_root) else {
        return (format!("crate:{crate_name}"), false);
    };
    let package = if relative.as_os_str().is_empty() {
        ".".into()
    } else {
        relative.to_string_lossy().replace('\\', "/")
    };
    (format!("package:{package}"), true)
}

/// Append a `u32` in decimal without going through the formatting machinery.
fn push_u32(target: &mut String, value: u32) {
    let mut digits = [0_u8; 10];
    let mut written = 0;
    let mut remaining = value;
    loop {
        digits[written] = b'0' + u8::try_from(remaining % 10).expect("single digit");
        written += 1;
        remaining /= 10;
        if remaining == 0 {
            break;
        }
    }
    for digit in digits[..written].iter().rev() {
        target.push(char::from(*digit));
    }
}

fn stable_source_range(
    tcx: TyCtxt<'_>,
    span: rustc_span::Span,
    crate_name: &str,
) -> Result<StableSourceRange, String> {
    if span.is_dummy() {
        return Err("dummy source span".into());
    }
    let source_map = tcx.sess.source_map();
    let file = source_map.lookup_source_file(span.lo());
    if !file.contains(span.hi()) {
        return Err(format!(
            "cross-file source span {}",
            source_map.span_to_diagnostic_string(span)
        ));
    }
    let start = file.original_relative_byte_pos(span.lo()).0;
    let end = file.original_relative_byte_pos(span.hi()).0;
    let merged_bundle_path = (DOCTEST_ROLE.get().copied() == Some("merged-bundle"))
        .then(|| match &file.name {
            FileName::Real(name) => Some(PathBuf::from(
                FileName::Real(name.clone())
                    .prefer_local_unconditionally()
                    .to_string_lossy()
                    .into_owned(),
            )),
            _ => None,
        })
        .flatten()
        .filter(|path| {
            path.file_name()
                .is_some_and(|name| name.to_string_lossy().contains("doctest_bundle_"))
        });
    if let Some(path) = merged_bundle_path {
        let group = env::var(RUSTDOC_GROUP_ID)
            .map_err(|_| "merged doctest bundle has no rustdoc group identity".to_owned())?;
        let source = fs::read_to_string(path)
            .map_err(|error| format!("could not read merged doctest bundle: {error}"))?;
        let key = format!("doctest-pending:{group}");
        let snapshot = ExactSourceSnapshot {
            file: key.clone(),
            source,
        };
        let mut snapshots = SOURCE_SNAPSHOTS
            .lock()
            .map_err(|_| "source snapshot lock poisoned".to_owned())?;
        if let Some(existing) = snapshots.insert(key.clone(), snapshot.clone())
            && existing != snapshot
        {
            return Err(format!("source identity {key} resolved to different bytes"));
        }
        return Ok(StableSourceRange {
            key,
            start,
            end,
            class: "doctest-pending",
            owned: true,
        });
    }
    let extracted_doctest_path = match &file.name {
        FileName::DocTest(path, _) => Some(path.clone()),
        FileName::Real(name) if DOCTEST_ROLE.get().copied() == Some("standalone") => {
            let local = FileName::Real(name.clone())
                .prefer_local_unconditionally()
                .to_string_lossy()
                .into_owned()
                .replace('\\', "/");
            env::var("UNSTABLE_RUSTDOC_TEST_PATH")
                .ok()
                .filter(|path| path.replace('\\', "/") == local)
                .map(PathBuf::from)
        }
        _ => None,
    };
    if let Some(path) = extracted_doctest_path {
        let snippet = source_map
            .span_to_snippet(span)
            .map_err(|_| "rustdoc retained no exact extracted snippet".to_owned())?;
        if snippet.is_empty() || snippet.contains('\r') {
            return Err("empty or carriage-return doctest span".into());
        }
        let start_location = source_map.lookup_char_pos(span.lo());
        let end_location = source_map.lookup_char_pos(span.hi());
        let authored_start = source_map.doctest_offset_line(&file.name, start_location.line);
        let authored_end = source_map.doctest_offset_line(&file.name, end_location.line);
        if authored_start == 0 || authored_end == 0 {
            return Err("doctest span has no authored line mapping".into());
        }
        let root = normalized_root(SOURCE_ROOT)
            .ok_or_else(|| "missing normalized Rust source root".to_owned())?;
        let original_path = normalized_path(&root.join(&path));
        let relative = original_path
            .strip_prefix(&root)
            .map_err(|_| "doctest source escaped the Rust source root".to_owned())?;
        let original = fs::read_to_string(&original_path)
            .map_err(|error| format!("{}: {error}", original_path.display()))?;
        let mut line_offset = 0_usize;
        let original_lines = original
            .split_inclusive('\n')
            .enumerate()
            .map(|(index, line)| {
                let entry = (index + 1, line_offset, line);
                line_offset += line.len();
                entry
            })
            .collect::<Vec<_>>();
        let mut anchors = Vec::new();
        for (index, fragment) in snippet.split('\n').enumerate() {
            if fragment.trim().is_empty() {
                continue;
            }
            let extracted_line = start_location
                .line
                .checked_add(index)
                .ok_or_else(|| "doctest extracted line overflow".to_owned())?;
            let expected = source_map.doctest_offset_line(&file.name, extracted_line);
            if expected == 0 {
                return Err("doctest fragment has no authored line mapping".into());
            }
            let candidates = original_lines
                .iter()
                .filter(|(line, _, _)| line.abs_diff(expected) <= 2)
                .flat_map(|(line, offset, original_line)| {
                    original_line
                        .match_indices(fragment)
                        .map(move |(column, _)| (*line, *offset + column, fragment.len()))
                })
                .collect::<Vec<_>>();
            let [(line, start, length)] = candidates.as_slice() else {
                return Err(format!(
                    "extracted doctest line fragment has {} authored matches near line {expected}",
                    candidates.len()
                ));
            };
            if anchors
                .last()
                .is_some_and(|(previous_line, _, _)| previous_line >= line)
            {
                return Err("doctest source fragments do not map in authored order".into());
            }
            anchors.push((*line, *start, *length));
        }
        let Some((first_line, mapped_start, _)) = anchors.first().copied() else {
            return Err("doctest span has no non-whitespace authored fragment".into());
        };
        let Some((last_line, last_start, last_length)) = anchors.last().copied() else {
            return Err("doctest span has no final authored fragment".into());
        };
        if first_line.abs_diff(authored_start) > 2 || last_line.abs_diff(authored_end) > 2 {
            return Err("doctest span endpoints disagree with authored line metadata".into());
        }
        let mapped_end = last_start
            .checked_add(last_length)
            .ok_or_else(|| "doctest source offset overflow".to_owned())?;
        let key = format!("source:{}", relative.to_string_lossy().replace('\\', "/"));
        let snapshot = ExactSourceSnapshot {
            file: relative.to_string_lossy().replace('\\', "/"),
            source: original,
        };
        let mut snapshots = SOURCE_SNAPSHOTS
            .lock()
            .map_err(|_| "source snapshot lock poisoned".to_owned())?;
        if let Some(existing) = snapshots.insert(key.clone(), snapshot.clone())
            && existing != snapshot
        {
            return Err(format!("source identity {key} resolved to different bytes"));
        }
        return Ok(StableSourceRange {
            key,
            start: u32::try_from(mapped_start)
                .map_err(|_| "doctest start exceeds u32".to_owned())?,
            end: u32::try_from(mapped_end).map_err(|_| "doctest end exceeds u32".to_owned())?,
            class: "doctest",
            owned: true,
        });
    }
    // Identity is a property of the FILE, not of each obligation in it.
    // Recomputing it per obligation clones the FileName, formats it to a string
    // and normalises the path every time, then takes the global snapshot lock
    // just to ask whether the file was already verified. With tens of thousands
    // of obligations against a handful of files that is all repeated work, and
    // it dominates collection.
    let cached_identity = FILE_IDENTITY.with(|cache| cache.borrow().get(&file.stable_id).cloned());
    if let Some((key, class, owned)) = cached_identity {
        return Ok(StableSourceRange {
            key,
            start: span.lo().0.saturating_sub(file.start_pos.0),
            end: span.hi().0.saturating_sub(file.start_pos.0),
            class,
            owned,
        });
    }
    let (key, class, owned) = match &file.name {
        FileName::Real(name) => {
            let local_name = FileName::Real(name.clone())
                .prefer_local_unconditionally()
                .to_string_lossy()
                .into_owned();
            let path = normalized_path(Path::new(&local_name));
            if let Some(root) = normalized_root(SOURCE_ROOT)
                && let Some(relative) = root_relative(&path, &root)
            {
                (
                    format!("source:{}", relative.to_string_lossy().replace('\\', "/")),
                    "authored",
                    true,
                )
            } else if let Some(root) = normalized_root(TARGET_ROOT)
                && let Some(relative) = root_relative(&path, &root)
                && let Some(generated) = generated_relative_path(&relative)
            {
                verify_generated_source_path(&path, &root)?;
                let (package, owned) = package_identity(crate_name);
                (
                    format!(
                        "generated:{package}:{}",
                        generated.to_string_lossy().replace('\\', "/")
                    ),
                    "generated",
                    owned,
                )
            } else {
                (
                    format!("external:{}", path.to_string_lossy().replace('\\', "/")),
                    "external",
                    false,
                )
            }
        }
        FileName::DocTest(_, _) => unreachable!("doctest source returned above"),
        FileName::Custom(name) if name == "supercov-rust-runtime" => {
            ("injected:supercov-rust-runtime".into(), "injected", false)
        }
        other => (
            format!("virtual:{}", other.prefer_remapped_unconditionally()),
            "virtual",
            false,
        ),
    };
    // A file's identity needs verifying once, not once per obligation. This
    // runs for every recorded span, and below it materialises the whole file
    // text, clones it into a snapshot, and compares that snapshot against the
    // stored one — three passes over the source per call. With tens of
    // thousands of obligations against one file that is quadratic in crate
    // size, and it was the dominant cost in the profile by a wide margin.
    let already_verified = SOURCE_SNAPSHOTS
        .lock()
        .map_err(|_| "source snapshot lock poisoned".to_owned())?
        .contains_key(&key);
    if owned && !already_verified {
        let source = if let Some(source) = &file.src {
            source.to_string()
        } else {
            if !source_map.ensure_source_file_source_present(&file) {
                return Err(format!(
                    "rustc could not hash-verify external source text for {key}"
                ));
            }
            file.external_src
                .read()
                .get_source()
                .ok_or_else(|| format!("rustc retained no external source text for {key}"))?
                .to_owned()
        };
        let display = key
            .strip_prefix("source:")
            .map(str::to_owned)
            .unwrap_or_else(|| key.clone());
        let snapshot = ExactSourceSnapshot {
            file: display,
            source,
        };
        let mut snapshots = SOURCE_SNAPSHOTS
            .lock()
            .map_err(|_| "source snapshot lock poisoned".to_owned())?;
        if let Some(existing) = snapshots.insert(key.clone(), snapshot.clone())
            && existing != snapshot
        {
            return Err(format!("source identity {key} resolved to different bytes"));
        }
    }
    // Cached only after the bytes have been verified, so a later hit stands for
    // both the identity and the verification.
    FILE_IDENTITY.with(|cache| {
        cache
            .borrow_mut()
            .insert(file.stable_id, (key.clone(), class, owned));
    });
    Ok(StableSourceRange {
        key,
        start,
        end,
        class,
        owned,
    })
}

fn expansion_identity(
    tcx: TyCtxt<'_>,
    span: rustc_span::Span,
    crate_name: &str,
) -> Result<String, String> {
    let mut frames = Vec::new();
    let mut cursor = span;
    while !cursor.ctxt().is_root() {
        if frames.len() == 1024 {
            return Err("expansion chain exceeds 1024 frames".into());
        }
        let frame = cursor.ctxt().outer_expn_data();
        let callsite = stable_source_range(tcx, frame.call_site, crate_name)?;
        let definition = frame
            .macro_def_id
            .map(|def_id| exact_def_path!(tcx, def_id))
            .unwrap_or_else(|| "<compiler>".into());
        frames.push(format!(
            "{}\0{}\0{}\0{}\0{}",
            frame.kind.descr(),
            callsite.key,
            callsite.start,
            callsite.end,
            definition
        ));
        cursor = frame.call_site;
    }
    if frames.is_empty() {
        return Err("expanded span has no expansion backtrace".into());
    }
    Ok(frames.join("\0"))
}

/// The parts of a branch's alternatives that carry meaning for aggregation:
/// each alternative's stable ID and label, without the visit-order metadata
/// that legitimately differs between two recordings of the same obligation.
fn alternative_identities(alternatives: &[BranchAlternativeObligation]) -> Vec<(&str, &str)> {
    alternatives
        .iter()
        .map(|alternative| (alternative.identity.id.as_str(), alternative.label))
        .collect()
}

fn obligation_identity(
    tcx: TyCtxt<'_>,
    def_id: rustc_span::def_id::DefId,
    span: rustc_span::Span,
    crate_name: &str,
    obligation_kind: &str,
    discriminator: &str,
    owner_local_ordinal: usize,
) -> Result<StableObligationIdentity, String> {
    let source = stable_source_range(tcx, span, crate_name)?;
    if !source.owned {
        return Err(format!("unowned {} source {}", source.class, source.key));
    }
    let callsite = stable_source_range(tcx, span.source_callsite(), crate_name)?;
    let synthetic_expansion = span.from_expansion() && source == callsite;
    let provenance = if source.class == "doctest" {
        "doctest-source"
    } else if source.class == "doctest-pending" {
        "doctest-pending"
    } else if synthetic_expansion {
        "synthetic-expansion"
    } else if span.from_expansion() {
        "authored-expansion"
    } else if source.class == "generated" {
        "generated-source"
    } else {
        "authored-source"
    };
    let canonical = if synthetic_expansion {
        let expansion = expansion_identity(tcx, span, crate_name)?;
        format!(
            "rust-source-v1\0{}\0{}\0{}\0{}\0{}\0synthetic-expansion\0{}\0{}\0{}\0",
            obligation_kind,
            source.key,
            source.start,
            source.end,
            discriminator,
            expansion,
            exact_def_path!(tcx, def_id),
            owner_local_ordinal,
        )
    } else if provenance == "authored-expansion" {
        // Per expanding definition, not per macro body. Every expansion shares
        // the one source range of the macro body, so without this they collapse
        // onto a single obligation and exercising one call site marks every
        // other site covered -- coverage reported for code that never ran.
        //
        // The enclosing definition is the right discriminator and the full
        // expansion chain is not: the binder matches obligations to MIR
        // constructs by source range, and two expansions inside ONE body share
        // that range exactly, so per-expansion identity hands it two
        // indistinguishable obligations and it declines the body's whole scope.
        format!(
            "rust-source-v1\0{}\0{}\0{}\0{}\0{}\0authored-expansion\0{}\0",
            obligation_kind,
            source.key,
            source.start,
            source.end,
            discriminator,
            exact_def_path!(tcx, def_id),
        )
    } else {
        // The overwhelmingly common shape, and `format!` here showed up as
        // `alloc::fmt::format` high in the profile. Same bytes, built directly.
        let mut canonical = String::with_capacity(
            48 + obligation_kind.len() + source.key.len() + discriminator.len(),
        );
        canonical.push_str("rust-source-v1\0");
        canonical.push_str(obligation_kind);
        canonical.push('\0');
        canonical.push_str(&source.key);
        canonical.push('\0');
        push_u32(&mut canonical, source.start);
        canonical.push('\0');
        push_u32(&mut canonical, source.end);
        canonical.push('\0');
        canonical.push_str(discriminator);
        canonical.push('\0');
        canonical
    };
    let mut hash = Sha256::new();
    hash.update(canonical.as_bytes());
    let digest = hash.finalize();
    let encoded = if env::var_os(FORCE_ID_COLLISION).is_some() {
        "000000000000000000000000".into()
    } else {
        // A `format!` per byte is twelve calls into the formatting machinery
        // for every obligation. The digest is fixed width, so a table lookup
        // does the same job.
        const HEX: &[u8; 16] = b"0123456789abcdef";
        let mut encoded = String::with_capacity(24);
        for byte in &digest[..12] {
            encoded.push(char::from(HEX[usize::from(byte >> 4)]));
            encoded.push(char::from(HEX[usize::from(byte & 0x0f)]));
        }
        encoded
    };
    let probe_ordinal = u64::from_be_bytes(digest[..8].try_into().expect("SHA-256 prefix"));
    Ok(StableObligationIdentity {
        id: format!("rs:{obligation_kind}:{encoded}"),
        canonical,
        source,
        provenance,
        probe_ordinal: if env::var_os(FORCE_ID_COLLISION).is_some()
            || env::var_os(FORCE_PROBE_COLLISION).is_some()
        {
            0
        } else {
            probe_ordinal
        },
        owner_local_ordinal,
    })
}

fn function_identity(
    tcx: TyCtxt<'_>,
    def_id: rustc_span::def_id::DefId,
    span: rustc_span::Span,
    crate_name: &str,
) -> Result<StableObligationIdentity, String> {
    obligation_identity(tcx, def_id, span, crate_name, "function", "", 0)
}

fn is_function_body(kind: DefKind) -> bool {
    matches!(
        kind,
        DefKind::Fn | DefKind::AssocFn | DefKind::Closure | DefKind::SyntheticCoroutineBody
    )
}

fn is_async_function_constructor(tcx: TyCtxt<'_>, owner: LocalDefId) -> bool {
    if let hir::Node::Expr(expression) = tcx.hir_node_by_def_id(owner)
        && let hir::ExprKind::Closure(closure) = expression.kind
    {
        return matches!(closure.kind, hir::ClosureKind::CoroutineClosure(_));
    }
    let asyncness = match tcx.hir_node_by_def_id(owner) {
        hir::Node::Item(item) => match item.kind {
            hir::ItemKind::Fn { sig, .. } => Some(sig.header.asyncness),
            _ => None,
        },
        hir::Node::ImplItem(item) => match item.kind {
            hir::ImplItemKind::Fn(sig, ..) => Some(sig.header.asyncness),
            _ => None,
        },
        hir::Node::TraitItem(item) => match item.kind {
            hir::TraitItemKind::Fn(sig, ..) => Some(sig.header.asyncness),
            _ => None,
        },
        _ => None,
    };
    asyncness.is_some_and(|asyncness| matches!(asyncness, hir::IsAsync::Async(_)))
}

fn assertion_macro_kind(tcx: TyCtxt<'_>, span: rustc_span::Span) -> Option<&'static str> {
    if !span.from_expansion() {
        return None;
    }
    let definition = span
        .ctxt()
        .outer_expn_data()
        .macro_def_id
        .map(|id| exact_def_path!(tcx, id))?;
    match definition.rsplit("::").next()? {
        "assert" => Some("assert"),
        "assert_eq" => Some("assert-eq"),
        "assert_ne" => Some("assert-ne"),
        "debug_assert" => Some("debug-assert"),
        "debug_assert_eq" => Some("debug-assert-eq"),
        "debug_assert_ne" => Some("debug-assert-ne"),
        _ => None,
    }
}

struct HirManifestCollector<'a, 'tcx> {
    tcx: TyCtxt<'tcx>,
    def_id: rustc_span::def_id::DefId,
    crate_name: &'a str,
    definition: String,
    ordinal: usize,
    points: &'a mut BTreeMap<String, PointObligation>,
    branches: &'a mut BTreeMap<String, BranchObligation>,
    decisions: &'a mut BTreeMap<String, DecisionObligation>,
    match_groups: &'a mut BTreeMap<String, MatchSelectionObligation>,
    limitations: &'a mut BTreeSet<String>,
    control_overrides: BTreeMap<u32, &'static str>,
    /// Non-zero while walking a branch a constant condition eliminates.
    eliminated_depth: usize,
    /// Set when a constant condition just took a diverging arm: everything
    /// after that `if` in the enclosing block never lowers.
    const_unreachable_after: bool,
    loop_branch_overrides: BTreeMap<u32, String>,
    decision_logical_expressions: BTreeSet<u32>,
    match_context: Option<(String, &'static str, Option<usize>)>,
}

impl<'a, 'tcx> HirManifestCollector<'a, 'tcx> {
    fn identity(
        &mut self,
        kind: &str,
        span: rustc_span::Span,
        discriminator: &str,
    ) -> Option<StableObligationIdentity> {
        if let Ok(source) = stable_source_range(self.tcx, span, self.crate_name)
            && !source.owned
            && span.from_expansion()
            && stable_source_range(self.tcx, span.source_callsite(), self.crate_name)
                .is_ok_and(|callsite| callsite.owned)
        {
            // The external declarative macro's implementation is not part of
            // the owned source graph. Synthetic proc-macro output instead
            // carries the owned invocation span and reaches the normal path.
            return None;
        }
        let ordinal = self.ordinal;
        self.ordinal += 1;
        match obligation_identity(
            self.tcx,
            self.def_id,
            span,
            self.crate_name,
            kind,
            discriminator,
            ordinal,
        ) {
            Ok(identity) => Some(identity),
            Err(error) => {
                self.limitations.insert(format!(
                    "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: {kind}: {error}",
                    self.definition
                ));
                None
            }
        }
    }

    fn point(
        &mut self,
        span: rustc_span::Span,
        point_kind: &'static str,
        discriminator: &str,
    ) -> Option<String> {
        if span.desugaring_kind().is_some() {
            // Compiler lowering scaffolding is not authored executable source.
            // The enclosing control construct records its explicit obligations
            // from the source callsite instead.
            return None;
        }
        let identity = self.identity(point_kind, span, discriminator)?;
        if self.eliminated_depth > 0 {
            CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .insert(identity.id.clone());
        }
        let id = identity.id.clone();
        match self.points.get_mut(&identity.id) {
            Some(existing) if existing.canonical != identity.canonical => self.tcx.dcx().fatal(
                format!("Supercov Rust obligation ID collision for {}", identity.id),
            ),
            Some(existing) => {
                existing.definitions.push(self.definition.clone());
                existing.definitions.sort();
                existing.definitions.dedup();
            }
            None => {
                self.points.insert(
                    identity.id.clone(),
                    PointObligation {
                        canonical: identity.canonical,
                        source: identity.source,
                        provenance: identity.provenance,
                        point_kind,
                        discriminator: discriminator.into(),
                        probe_ordinal: identity.probe_ordinal,
                        definitions: vec![self.definition.clone()],
                    },
                );
            }
        }
        Some(id)
    }

    fn record_control_decision(
        &mut self,
        expression: &'tcx hir::Expr<'tcx>,
        condition: &'tcx hir::Expr<'tcx>,
        control_kind: &'static str,
        opaque_expanded_condition: bool,
    ) -> Option<String> {
        let authored_macro_guard = (opaque_expanded_condition
            && control_kind == "match-guard"
            && condition.span.from_expansion())
        .then(|| stable_source_range(self.tcx, condition.span.source_callsite(), self.crate_name))
        .transpose()
        .ok()?
        .is_some_and(|source| source.owned);
        let mut atomic = Vec::new();
        let mut logical = Vec::new();
        let mut subsumed = Vec::new();
        if authored_macro_guard {
            atomic.push(AtomicDecisionExpression {
                expression: condition,
                true_outcome: Some(true),
                false_outcome: Some(false),
                opaque_authored_macro: true,
            });
        } else {
            flatten_decision_expression(
                self.tcx,
                self.def_id,
                self.crate_name,
                condition,
                Some(true),
                Some(false),
                control_kind != "assertion",
                &mut atomic,
                &mut logical,
                &mut subsumed,
            );
        }
        if atomic
            .iter()
            .any(|condition| external_macro_condition(self.tcx, self.def_id, condition))
        {
            // Hidden control flow emitted by an external macro (for example
            // assert! or println!) is implementation code of that macro, not
            // an authored decision in the caller's denominator.
            return None;
        }
        let has_let = atomic
            .iter()
            .any(|condition| matches!(condition.expression.kind, hir::ExprKind::Let(_)));
        let decision_kind = match (control_kind, has_let, atomic.len() > 1) {
            ("if", false, _) => "if",
            ("if", true, false) => "if-let",
            ("if", true, true) => "let-chain",
            ("while", false, _) => "while",
            ("while", true, _) => "while-let",
            ("match-guard", _, _) => "match-guard",
            ("assertion", _, _) => "assertion",
            _ => self.tcx.dcx().fatal(format!(
                "Supercov has no Rust decision kind for {control_kind} in {}",
                self.definition
            )),
        };
        let mut conditions = Vec::with_capacity(atomic.len());
        for condition in atomic {
            let condition_span = if condition.opaque_authored_macro {
                condition.expression.span.source_callsite()
            } else {
                condition.expression.span
            };
            let source = match stable_source_range(self.tcx, condition_span, self.crate_name) {
                Ok(source) if source.owned => source,
                Ok(source) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: condition: unowned {} source {}",
                        self.definition, source.class, source.key
                    ));
                    return None;
                }
                Err(error) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: condition: {error}",
                        self.definition
                    ));
                    return None;
                }
            };
            let branch_source = match stable_source_range(
                self.tcx,
                if condition.opaque_authored_macro {
                    condition_span
                } else {
                    match condition.expression.kind {
                        hir::ExprKind::Let(let_expression) => let_expression.pat.span,
                        _ => condition.expression.span,
                    }
                },
                self.crate_name,
            ) {
                Ok(branch_source) if branch_source.owned => branch_source,
                Ok(branch_source) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: branch condition: unowned {} source {}",
                        self.definition, branch_source.class, branch_source.key
                    ));
                    return None;
                }
                Err(error) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: branch condition: {error}",
                        self.definition
                    ));
                    return None;
                }
            };
            let (pattern_adt, pattern_variant) = match condition.expression.kind {
                hir::ExprKind::Let(let_expression) => {
                    let typeck = self.tcx.typeck(self.def_id.expect_local());
                    let adt = typeck
                        .node_type_opt(let_expression.pat.hir_id)
                        .map(rustc_middle::ty::Ty::peel_refs)
                        .and_then(rustc_middle::ty::Ty::ty_adt_def);
                    let variant = adt.and_then(|adt| {
                        let qpath = match let_expression.pat.kind {
                            hir::PatKind::TupleStruct(ref qpath, ..)
                            | hir::PatKind::Struct(ref qpath, ..) => qpath,
                            _ => return None,
                        };
                        let variant_definition =
                            match typeck.qpath_res(qpath, let_expression.pat.hir_id) {
                                hir::def::Res::Def(
                                    DefKind::Ctor(hir::def::CtorOf::Variant, _),
                                    constructor,
                                ) => self.tcx.parent(constructor),
                                hir::def::Res::Def(DefKind::Variant, variant) => variant,
                                _ => return None,
                            };
                        Some(adt.variant_index_with_id(variant_definition).as_u32())
                    });
                    (adt.map(|adt| self.tcx.def_path_str(adt.did())), variant)
                }
                _ => (None, None),
            };
            conditions.push(DecisionCondition {
                branch_source,
                pattern_adt,
                pattern_variant,
                text: if condition.opaque_authored_macro {
                    self.tcx
                        .sess
                        .source_map()
                        .span_to_snippet(condition_span)
                        .unwrap_or_else(|_| "<source unavailable>".into())
                } else if condition.expression.span.from_expansion()
                    && stable_source_range(
                        self.tcx,
                        condition.expression.span.source_callsite(),
                        self.crate_name,
                    )
                    .is_ok_and(|callsite| callsite == source)
                {
                    rustc_hir_pretty::expr_to_string(&self.tcx, condition.expression)
                } else {
                    self.tcx
                        .sess
                        .source_map()
                        .span_to_snippet(condition.expression.span)
                        .unwrap_or_else(|_| "<source unavailable>".into())
                },
                source,
                true_outcome: condition.true_outcome,
                false_outcome: condition.false_outcome,
                invert_value: false,
                authored_expression: true,
                opaque_authored_macro: condition.opaque_authored_macro,
            });
        }
        let authored_condition_span = if authored_macro_guard {
            condition.span.source_callsite()
        } else {
            condition.span
        };
        let decision = self.identity("decision", authored_condition_span, decision_kind)?;
        let assertion_source = (decision_kind == "assertion")
            .then(|| {
                stable_source_range(self.tcx, expression.span.source_callsite(), self.crate_name)
            })
            .transpose()
            .ok()?
            .filter(|source| source.owned);
        if decision_kind == "assertion" && assertion_source.is_none() {
            self.limitations.insert(format!(
                "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: assertion phase source",
                self.definition
            ));
            return None;
        }
        let decision_span =
            if control_kind == "while" || decision_kind == "assertion" || authored_macro_guard {
                expression.span.source_callsite()
            } else {
                expression.span
            };
        let (branch_kind, alternatives) = if decision_kind == "assertion" {
            (
                "assertion-outcome",
                [("passed", "passed"), ("failed", "failed")],
            )
        } else {
            (
                "decision-outcome",
                [("true", "condition true"), ("false", "condition false")],
            )
        };
        let outcome_branch_id = self.record_branch(
            decision_span,
            branch_kind,
            &format!("{branch_kind}:{decision_kind}"),
            &alternatives,
        )?;
        for expression in subsumed {
            self.decision_logical_expressions.insert(expression);
        }
        let mut logical_selections = Vec::with_capacity(logical.len());
        for selection in logical {
            self.decision_logical_expressions
                .insert(selection.expression.hir_id.local_id.as_u32());
            let branch_id = self.record_logical_branch(selection.expression, false)?;
            logical_selections.push(DecisionLogicalSelection {
                branch_id,
                right_condition_index: selection.right_condition_index,
            });
        }
        logical_selections.sort_by(|left, right| {
            left.right_condition_index
                .cmp(&right.right_condition_index)
                .then_with(|| left.branch_id.cmp(&right.branch_id))
        });
        let loop_branch_id = if decision_kind.starts_with("while") {
            match self
                .loop_branch_overrides
                .remove(&expression.hir_id.local_id.as_u32())
            {
                Some(branch_id) => Some(branch_id),
                None => {
                    self.limitations.insert(format!(
                        "RUST_CONTROL_MAPPING_UNRESOLVED: {}: while decision has no exact loop-entry branch",
                        self.definition
                    ));
                    return None;
                }
            }
        } else {
            None
        };
        let collapsed_expansion_conditions = decision_kind != "match-guard"
            && decision.provenance == "synthetic-expansion"
            && conditions.iter().enumerate().any(|(index, condition)| {
                conditions[..index]
                    .iter()
                    .any(|previous| previous.branch_source == condition.branch_source)
            });
        // rustc treats `#[automatically_derived]` (and `#[coverage(off)]`)
        // functions as coverage-ineligible, so decisions in them can never
        // bind through native branch mappings and must carry structural
        // markers exactly like CTFE owner kinds.
        let coverage_instrumented = self.tcx.coverage_attr_on(self.def_id.expect_local());
        let structural_marker = !coverage_instrumented
            || decision_kind == "assertion"
            || authored_macro_guard
            || collapsed_expansion_conditions
            || conditions
                .iter()
                .any(|condition| condition.opaque_authored_macro);
        let decision_id = decision.id.clone();
        let parent_match_arm = self
            .match_context
            .as_ref()
            .and_then(|(group, site, index)| {
                (*site == "body")
                    .then(|| index.map(|index| (group.clone(), index)))
                    .flatten()
            });
        if self.eliminated_depth > 0 {
            CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .insert(decision.id.clone());
        }
        match self.decisions.get_mut(&decision.id) {
            Some(existing) if existing.identity.canonical != decision.canonical => {
                self.tcx.dcx().fatal(format!(
                    "Supercov Rust obligation ID collision for {}",
                    decision.id
                ))
            }
            Some(existing)
                if existing.decision_kind != decision_kind
                    || existing.conditions != conditions
                    || existing.structural_marker != structural_marker
                    || existing.assertion_source != assertion_source
                    || existing.outcome_branch_id != outcome_branch_id
                    || existing.loop_branch_id != loop_branch_id
                    || existing.logical_selections != logical_selections =>
            {
                let differing = [
                    (existing.decision_kind != decision_kind, "kind"),
                    (existing.conditions != conditions, "conditions"),
                    (
                        existing.structural_marker != structural_marker,
                        "structural-marker",
                    ),
                    (
                        existing.assertion_source != assertion_source,
                        "assertion-source",
                    ),
                    (
                        existing.outcome_branch_id != outcome_branch_id,
                        "outcome-branch",
                    ),
                    (existing.loop_branch_id != loop_branch_id, "loop-branch"),
                    (
                        existing.logical_selections != logical_selections,
                        "logical-selections",
                    ),
                ]
                .into_iter()
                .filter_map(|(differs, name)| differs.then_some(name))
                .collect::<Vec<_>>()
                .join(",");
                let message = format!(
                    "Supercov Rust decision aggregation mismatch for {} in {}: differing={differing}; existing kind={} conditions={}; new kind={decision_kind} conditions={}",
                    decision.id,
                    self.definition,
                    existing.decision_kind,
                    existing.conditions.len(),
                    conditions.len(),
                );
                let conflicted = decision.id.clone();
                self.degrade_aggregation_conflict(&conflicted, &differing, message);
                return Some(conflicted);
            }
            Some(existing) => {
                // The enclosing match arm describes the invocation, not the
                // obligation; see the branch aggregation above.
                if existing.parent_match_arm != parent_match_arm {
                    existing.parent_match_arm = None;
                }
                existing.definitions.push(self.definition.clone());
                existing.definitions.sort();
                existing.definitions.dedup();
            }
            None => {
                self.decisions.insert(
                    decision.id.clone(),
                    DecisionObligation {
                        identity: decision,
                        decision_kind,
                        conditions,
                        definitions: vec![self.definition.clone()],
                        structural_marker,
                        assertion_source,
                        outcome_branch_id,
                        loop_branch_id,
                        logical_selections,
                        parent_match_arm,
                    },
                );
            }
        }
        Some(decision_id)
    }

    fn record_single_condition_assertion(
        &mut self,
        expression: &'tcx hir::Expr<'tcx>,
        macro_kind: &'static str,
        invert_value: bool,
    ) -> Option<String> {
        let span = expression.span.source_callsite();
        let source = match stable_source_range(self.tcx, span, self.crate_name) {
            Ok(source) if source.owned => source,
            Ok(source) => {
                self.limitations.insert(format!(
                    "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: assertion: unowned {} source {}",
                    self.definition, source.class, source.key
                ));
                return None;
            }
            Err(error) => {
                self.limitations.insert(format!(
                    "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: assertion: {error}",
                    self.definition
                ));
                return None;
            }
        };
        let decision = self.identity("decision", span, "assertion")?;
        let assertion_source = source.clone();
        let condition = DecisionCondition {
            source: source.clone(),
            branch_source: source,
            text: self
                .tcx
                .sess
                .source_map()
                .span_to_snippet(span)
                .unwrap_or_else(|_| format!("{macro_kind}!(...)")),
            true_outcome: Some(true),
            false_outcome: Some(false),
            invert_value,
            authored_expression: false,
            opaque_authored_macro: false,
            pattern_adt: None,
            pattern_variant: None,
        };
        let outcome_branch_id = self.record_branch(
            span,
            "assertion-outcome",
            "assertion-outcome:assertion",
            &[("passed", "passed"), ("failed", "failed")],
        )?;
        let decision_id = decision.id.clone();
        let parent_match_arm = self
            .match_context
            .as_ref()
            .and_then(|(group, site, index)| {
                (*site == "body")
                    .then(|| index.map(|index| (group.clone(), index)))
                    .flatten()
            });
        if self.eliminated_depth > 0 {
            CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .insert(decision.id.clone());
        }
        match self.decisions.get_mut(&decision.id) {
            Some(existing) if existing.identity.canonical != decision.canonical => {
                self.tcx.dcx().fatal(format!(
                    "Supercov Rust obligation ID collision for {}",
                    decision.id
                ))
            }
            Some(existing)
                if existing.decision_kind != "assertion"
                    || existing.conditions.as_slice() != std::slice::from_ref(&condition)
                    || !existing.structural_marker
                    || existing.assertion_source.as_ref() != Some(&assertion_source)
                    || existing.outcome_branch_id != outcome_branch_id
                    || !existing.logical_selections.is_empty() =>
            {
                self.tcx.dcx().fatal(format!(
                    "Supercov Rust assertion aggregation mismatch for {}",
                    decision.id
                ))
            }
            Some(existing) => {
                existing.definitions.push(self.definition.clone());
                existing.definitions.sort();
                existing.definitions.dedup();
            }
            None => {
                self.decisions.insert(
                    decision.id.clone(),
                    DecisionObligation {
                        identity: decision,
                        decision_kind: "assertion",
                        conditions: vec![condition],
                        definitions: vec![self.definition.clone()],
                        structural_marker: true,
                        assertion_source: Some(assertion_source),
                        outcome_branch_id,
                        loop_branch_id: None,
                        logical_selections: Vec::new(),
                        parent_match_arm,
                    },
                );
            }
        }
        Some(decision_id)
    }

    /// Two recordings of one aggregated obligation disagree.
    ///
    /// Authored obligations aggregate across macro invocations by design, but
    /// some recorded parts are derived from the callsite rather than the macro
    /// body (an assertion's phase source and its outcome branch are the known
    /// cases), so two invocations can disagree without either being wrong.
    /// Under strict binding this stays a hard failure. Otherwise the first
    /// recording is kept — never merged with the second — and the conflict is
    /// recorded, so the obligation's exact vectors survive while its ambiguous
    /// callsite link is visible in the report.
    fn degrade_aggregation_conflict(&mut self, id: &str, differing: &str, message: String) {
        if env::var_os(STRICT_BINDING).is_some_and(|value| !value.is_empty()) {
            self.tcx.dcx().fatal(message);
        }
        self.limitations.insert(format!(
            "RUST_OBLIGATION_AGGREGATION_AMBIGUOUS: {id} in {}: differing={differing}",
            self.definition
        ));
    }

    fn record_branch(
        &mut self,
        span: rustc_span::Span,
        branch_kind: &'static str,
        discriminator: &str,
        alternatives: &[(&str, &'static str)],
    ) -> Option<String> {
        let branch = self.identity("branch", span, discriminator)?;
        let alternatives = alternatives
            .iter()
            .filter_map(|(alternative, label)| {
                self.identity(
                    "branch-alternative",
                    span,
                    &format!("{discriminator}:{alternative}"),
                )
                .map(|identity| BranchAlternativeObligation { identity, label })
            })
            .collect::<Vec<_>>();
        if alternatives.len() != 2 {
            return None;
        }
        let branch_id = branch.id.clone();
        let parent_match_arm = self
            .match_context
            .as_ref()
            .and_then(|(group, site, index)| {
                (*site == "body")
                    .then(|| index.map(|index| (group.clone(), index)))
                    .flatten()
            });
        if self.eliminated_depth > 0 {
            CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .insert(branch.id.clone());
        }
        match self.branches.get_mut(&branch.id) {
            Some(existing) if existing.identity.canonical != branch.canonical => {
                self.tcx.dcx().fatal(format!(
                    "Supercov Rust obligation ID collision for {}",
                    branch.id
                ))
            }
            // Aggregation compares semantic identity only. A
            // StableObligationIdentity also carries visit-order metadata
            // (owner_local_ordinal advances on every recorded obligation), and
            // an authored obligation is deliberately visited once per macro
            // invocation, so comparing whole identity structs reports a
            // mismatch for two recordings of the very same alternative.
            Some(existing)
                if existing.branch_kind != branch_kind
                    || existing.discriminator != discriminator
                    || alternative_identities(&existing.alternatives)
                        != alternative_identities(&alternatives) =>
            {
                let differing = [
                    (existing.branch_kind != branch_kind, "kind"),
                    (existing.discriminator != discriminator, "discriminator"),
                    (
                        alternative_identities(&existing.alternatives)
                            != alternative_identities(&alternatives),
                        "alternatives",
                    ),
                ]
                .into_iter()
                .filter_map(|(differs, name)| differs.then_some(name))
                .collect::<Vec<_>>()
                .join(",");
                let message = format!(
                    "Supercov Rust branch aggregation mismatch for {} in {}: differing={differing}; existing kind={}; new kind={branch_kind}",
                    branch.id, self.definition, existing.branch_kind,
                );
                self.degrade_aggregation_conflict(&branch_id, &differing, message);
                return Some(branch_id);
            }
            Some(existing) => {
                // An authored obligation's identity is invocation-independent
                // on purpose, so one macro's code aggregates into a single
                // obligation across its invocations. The enclosing match arm
                // is a property of the invocation, not of the obligation: the
                // same macro can expand inside an arm at one callsite and
                // outside any arm at another. Treat a disagreement as an
                // ambiguous hint and drop it, which falls back to sequential
                // ranking, rather than failing on a difference that carries no
                // identity meaning.
                if existing.parent_match_arm != parent_match_arm {
                    existing.parent_match_arm = None;
                }
                existing.definitions.push(self.definition.clone());
                existing.definitions.sort();
                existing.definitions.dedup();
            }
            None => {
                self.branches.insert(
                    branch.id.clone(),
                    BranchObligation {
                        identity: branch,
                        branch_kind,
                        discriminator: discriminator.into(),
                        alternatives,
                        definitions: vec![self.definition.clone()],
                        mapping_source: None,
                        parent_match_arm,
                    },
                );
            }
        }
        Some(branch_id)
    }

    fn record_logical_branch(
        &mut self,
        expression: &'tcx hir::Expr<'tcx>,
        require_mapping: bool,
    ) -> Option<String> {
        let hir::ExprKind::Binary(operator, left, right) = expression.kind else {
            self.tcx.dcx().fatal(format!(
                "Supercov logical selection is not binary in {}",
                self.definition
            ));
        };
        let operator = match operator.node {
            rustc_ast::BinOpKind::And => "and",
            rustc_ast::BinOpKind::Or => "or",
            _ => self.tcx.dcx().fatal(format!(
                "Supercov logical selection is not && or || in {}",
                self.definition
            )),
        };
        let branch_span =
            if authored_opaque_macro_condition(self.tcx, self.def_id, self.crate_name, right) {
                right.span.source_callsite()
            } else {
                right.span
            };
        let branch_id = self.record_branch(
            branch_span,
            "logical-selection",
            &format!("logical-selection:{operator}"),
            &[
                ("short-circuit", "short-circuited"),
                ("evaluated", "right operand evaluated"),
            ],
        )?;
        let mapping_source = match stable_source_range(
            self.tcx,
            logical_tail_expression(left).span,
            self.crate_name,
        ) {
            Ok(source) if source.owned => source,
            Ok(source) => {
                if !require_mapping {
                    return Some(branch_id);
                }
                self.limitations.insert(format!(
                    "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: logical selection: unowned {} source {}",
                    self.definition, source.class, source.key
                ));
                return None;
            }
            Err(error) => {
                if !require_mapping {
                    return Some(branch_id);
                }
                self.limitations.insert(format!(
                    "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: logical selection: {error}",
                    self.definition
                ));
                return None;
            }
        };
        let branch = self
            .branches
            .get_mut(&branch_id)
            .expect("recorded logical-selection branch");
        let conflicting_mapping = matches!(
            &branch.mapping_source,
            Some(existing) if existing != &mapping_source
        );
        match &branch.mapping_source {
            Some(_) => {}
            None => branch.mapping_source = Some(mapping_source),
        }
        if conflicting_mapping {
            // One aggregated selection reached through two different mapping
            // sources, the same way an assertion's callsite can differ between
            // invocations. Keep the first — never merge the two — and record
            // the ambiguity.
            let message = format!("Supercov logical-selection mapping changed for {branch_id}");
            self.degrade_aggregation_conflict(&branch_id.clone(), "mapping-source", message);
        }
        Some(branch_id)
    }

    fn record_match(
        &mut self,
        expression: &'tcx hir::Expr<'tcx>,
        arms: &'tcx [hir::Arm<'tcx>],
    ) -> Option<String> {
        let authored_match = !expression.span.from_expansion();
        if arms.len() < 2 {
            // An irrefutable single-arm match has no selectable alternative;
            // an empty match diverges while evaluating an uninhabited value.
            return None;
        }
        if expression.span.from_expansion()
            && !self.tcx.def_span(self.def_id).from_expansion()
            && !expression
                .span
                .ctxt()
                .outer_expn_data()
                .macro_def_id
                .is_some_and(|macro_def| macro_def.is_local())
        {
            return None;
        }
        let group = self.identity("match-group", expression.span, "match")?;
        let mut selections = Vec::with_capacity(arms.len());
        for (index, arm) in arms.iter().enumerate() {
            let discriminator = format!("match-arm:{}:{index}", group.id);
            let branch_id = self.record_branch(
                arm.span,
                "match-arm",
                &discriminator,
                &[("not-selected", "not selected"), ("selected", "selected")],
            )?;
            let Some(branch) = self.branches.get(&branch_id) else {
                self.tcx
                    .dcx()
                    .fatal(format!("Supercov lost Rust match-arm branch {branch_id}"));
            };
            let body_source = match stable_source_range(self.tcx, arm.body.span, self.crate_name) {
                Ok(source) if source.owned => source,
                Ok(source) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: match arm body: unowned {} source {}",
                        self.definition, source.class, source.key
                    ));
                    return None;
                }
                Err(error) => {
                    self.limitations.insert(format!(
                        "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: match arm body: {error}",
                        self.definition
                    ));
                    return None;
                }
            };
            let not_selected_ordinal = branch
                .alternatives
                .iter()
                .find(|alternative| alternative.label == "not selected")
                .map(|alternative| alternative.identity.probe_ordinal);
            let selected_ordinal = branch
                .alternatives
                .iter()
                .find(|alternative| alternative.label == "selected")
                .map(|alternative| alternative.identity.probe_ordinal);
            let (Some(not_selected_ordinal), Some(selected_ordinal)) =
                (not_selected_ordinal, selected_ordinal)
            else {
                self.tcx.dcx().fatal(format!(
                    "Supercov match-arm branch {branch_id} has incomplete alternatives"
                ));
            };
            let uninhabited_body = self
                .tcx
                .typeck(self.def_id.expect_local())
                .node_type_opt(arm.body.hir_id)
                .is_some_and(|ty| ty.is_never());
            selections.push(MatchArmSelectionObligation {
                branch_id,
                body_source,
                uninhabited_body,
                pattern_source: stable_source_range(self.tcx, arm.pat.span, self.crate_name)
                    .ok()
                    .filter(|source| source.owned),
                pattern_literal: string_pattern_literal(arm.pat),
                pattern_int: integer_pattern_literal(self.tcx, self.def_id.expect_local(), arm.pat),
                pattern_variant: arm_pattern_variant(self.tcx, self.def_id.expect_local(), arm.pat),
                guarded: arm.guard.is_some(),
                guard_decision_id: None,
                selected_ordinal,
                not_selected_ordinal,
            });
        }
        for (selection, arm) in selections.iter_mut().zip(arms) {
            selection.guard_decision_id = arm.guard.and_then(|guard| {
                self.record_control_decision(guard, guard, "match-guard", authored_match)
            });
        }
        let group_id = group.id.clone();
        let parent = self.match_context.clone();
        // Nested patterns test several discriminants (an `Ok((Field, v))`
        // arm switches on both Result and Field), so the edge constraint is
        // the set of every ADT appearing anywhere in the arm patterns.
        // Recordings from different bodies union their sets.
        let pattern_adts = {
            let typeck = self.tcx.typeck(self.def_id.expect_local());
            let mut adts = BTreeSet::new();
            for arm in arms {
                arm.pat.walk(|pattern| {
                    if let Some(adt) = typeck
                        .node_type_opt(pattern.hir_id)
                        .map(rustc_middle::ty::Ty::peel_refs)
                        .and_then(rustc_middle::ty::Ty::ty_adt_def)
                    {
                        adts.insert(self.tcx.def_path_str(adt.did()));
                    }
                    true
                });
            }
            adts
        };
        if self.eliminated_depth > 0 {
            CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .insert(group.id.clone());
        }
        match self.match_groups.get_mut(&group.id) {
            Some(existing) if existing.identity.canonical != group.canonical => {
                self.tcx.dcx().fatal(format!(
                    "Supercov Rust obligation ID collision for {}",
                    group.id
                ))
            }
            Some(existing)
                if existing.arms != selections
                    || existing.parent_group_id != parent.as_ref().map(|value| value.0.clone())
                    || existing.parent_site != parent.as_ref().map(|value| value.1)
                    || existing.parent_arm_index != parent.as_ref().and_then(|value| value.2) =>
            {
                let differing = [
                    (existing.arms != selections, "arms"),
                    (
                        existing.parent_group_id != parent.as_ref().map(|value| value.0.clone()),
                        "parent-group",
                    ),
                    (
                        existing.parent_site != parent.as_ref().map(|value| value.1),
                        "parent-site",
                    ),
                    (
                        existing.parent_arm_index != parent.as_ref().and_then(|value| value.2),
                        "parent-arm-index",
                    ),
                ]
                .into_iter()
                .filter_map(|(differs, name)| differs.then_some(name))
                .collect::<Vec<_>>()
                .join(",");
                let message = format!(
                    "Supercov Rust match selection aggregation mismatch for {} in {}: differing={differing}; existing arms={} new arms={}",
                    group.id,
                    self.definition,
                    existing.arms.len(),
                    selections.len(),
                );
                let conflicted = group.id.clone();
                self.degrade_aggregation_conflict(&conflicted, &differing, message);
                return Some(conflicted);
            }
            Some(existing) => {
                existing.definitions.push(self.definition.clone());
                existing.definitions.sort();
                existing.definitions.dedup();
                existing.pattern_adts.extend(pattern_adts.iter().cloned());
            }
            None => {
                self.match_groups.insert(
                    group.id.clone(),
                    MatchSelectionObligation {
                        identity: group,
                        arms: selections,
                        definitions: vec![self.definition.clone()],
                        parent_group_id: parent.as_ref().map(|value| value.0.clone()),
                        parent_site: parent.as_ref().map(|value| value.1),
                        parent_arm_index: parent.as_ref().and_then(|value| value.2),
                        pattern_adts,
                    },
                );
            }
        }
        Some(group_id)
    }
}

struct AtomicDecisionExpression<'tcx> {
    expression: &'tcx hir::Expr<'tcx>,
    true_outcome: Option<bool>,
    false_outcome: Option<bool>,
    opaque_authored_macro: bool,
}

struct LogicalDecisionExpression<'tcx> {
    expression: &'tcx hir::Expr<'tcx>,
    right_condition_index: usize,
}

fn logical_tail_expression<'tcx>(expression: &'tcx hir::Expr<'tcx>) -> &'tcx hir::Expr<'tcx> {
    match expression.kind {
        hir::ExprKind::Binary(operator, _, right)
            if matches!(
                operator.node,
                rustc_ast::BinOpKind::And | rustc_ast::BinOpKind::Or
            ) =>
        {
            logical_tail_expression(right)
        }
        _ => expression,
    }
}

fn authored_opaque_macro_condition(
    tcx: TyCtxt<'_>,
    def_id: rustc_span::def_id::DefId,
    crate_name: &str,
    expression: &hir::Expr<'_>,
) -> bool {
    expression.span.from_expansion()
        && !tcx.def_span(def_id).from_expansion()
        && stable_source_range(tcx, expression.span, crate_name)
            .is_ok_and(|expanded| !expanded.owned)
        && stable_source_range(tcx, expression.span.source_callsite(), crate_name)
            .is_ok_and(|callsite| callsite.owned)
}

/// Whether a condition is control flow a non-local macro emitted, rather than
/// anything the author wrote. A decision containing one is implementation code
/// of that macro and is dropped from the caller's denominator.
fn external_macro_condition<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: rustc_span::def_id::DefId,
    condition: &AtomicDecisionExpression<'tcx>,
) -> bool {
    let span = condition.expression.span;
    span.from_expansion()
        && !condition.opaque_authored_macro
        && !tcx.def_span(def_id).from_expansion()
        && !span
            .ctxt()
            .outer_expn_data()
            .macro_def_id
            .is_some_and(|macro_def| macro_def.is_local())
}

// The binder threads compiler state — tcx, def id, crate name, body,
// output buffers — and grouping it into a struct is the abstract-CFG
// extraction tracked separately, not a rename to satisfy a lint.
#[allow(clippy::too_many_arguments)]
fn flatten_decision_expression<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: rustc_span::def_id::DefId,
    crate_name: &str,
    expression: &'tcx hir::Expr<'tcx>,
    true_outcome: Option<bool>,
    false_outcome: Option<bool>,
    // Control decisions collapse `a && true` to `a`: rustc emits no branch
    // for the constant. Assertion decisions measure conditions through CTFE
    // markers, where a constant operand is observable, so they keep it.
    collapse_constants: bool,
    output: &mut Vec<AtomicDecisionExpression<'tcx>>,
    logical: &mut Vec<LogicalDecisionExpression<'tcx>>,
    subsumed: &mut Vec<u32>,
) {
    if authored_opaque_macro_condition(tcx, def_id, crate_name, expression) {
        output.push(AtomicDecisionExpression {
            expression,
            true_outcome,
            false_outcome,
            opaque_authored_macro: true,
        });
        return;
    }
    match expression.kind {
        // `!(a || b)` has two conditions, not one. Negation only exchanges the
        // outcomes: the inner expression's true outcome is the outer's false
        // one, which is De Morgan without any special handling. Without this
        // arm a negated chain falls through to the atomic case below and is
        // recorded as a single condition — a merged MC/DC number rather than
        // an absent one, which is the worse of the two failures.
        // Only when the inner expression actually decomposes. Recursing into
        // an opaque inner — `!matches!(..)` is the case in the wild — strips
        // the negation, yields a single condition that no longer matches a
        // switch, and turns a working binding into a decline. `!(a || b)`
        // does decompose, which is the shape that was being merged.
        hir::ExprKind::Unary(hir::UnOp::Not, inner)
            if matches!(
                inner.kind,
                hir::ExprKind::Binary(
                    rustc_span::source_map::Spanned {
                        node: rustc_ast::BinOpKind::And | rustc_ast::BinOpKind::Or,
                        ..
                    },
                    ..
                )
            ) =>
        {
            // Decomposing must never cost a decision. The caller drops any
            // decision holding an external-macro condition, so a chain mixing
            // authored operands with one — `!(a || (cfg!(unix) && b))` — would
            // decompose into conditions that take the whole authored `if` out
            // of the denominator with it. Splice the decomposition only when
            // it survives that filter, and otherwise fall through to the
            // atomic arm: a merged MC/DC number, but a branch still measured.
            let mut inner_output = Vec::new();
            let mut inner_logical = Vec::new();
            flatten_decision_expression(
                tcx,
                def_id,
                crate_name,
                inner,
                false_outcome,
                true_outcome,
                collapse_constants,
                &mut inner_output,
                &mut inner_logical,
                subsumed,
            );
            if !inner_output
                .iter()
                .any(|condition| external_macro_condition(tcx, def_id, condition))
            {
                let offset = output.len();
                output.append(&mut inner_output);
                logical.extend(inner_logical.into_iter().map(|selection| {
                    LogicalDecisionExpression {
                        right_condition_index: selection.right_condition_index + offset,
                        ..selection
                    }
                }));
                return;
            }
            // The short-circuits stay part of this decision even though it is
            // recorded atomically, so claim them. Left unclaimed they are
            // resurrected as standalone selection obligations by the visitor
            // over unowned `&&`/`||`, and a `cfg!`-folded operand has no
            // switch to bind to — the decline this fallback exists to avoid.
            subsumed.extend(
                inner_logical
                    .iter()
                    .map(|selection| selection.expression.hir_id.local_id.as_u32()),
            );
            output.push(AtomicDecisionExpression {
                expression,
                true_outcome,
                false_outcome,
                opaque_authored_macro: false,
            });
        }
        hir::ExprKind::Binary(operator, left, right) => match operator.node {
            rustc_ast::BinOpKind::And => {
                // A monomorphic constant operand that is the operator's
                // identity is not a run-time condition: `a && true` decides
                // on `a` alone and rustc emits no branch or switch for the
                // constant (zmij's `while i < n && Self::ENABLE`). Collapse
                // to the live operand and claim the operator so the
                // standalone selection visitor cannot resurrect it.
                if collapse_constants && constant_condition(tcx, def_id, right) == Some(true) {
                    subsumed.push(expression.hir_id.local_id.as_u32());
                    flatten_decision_expression(
                        tcx,
                        def_id,
                        crate_name,
                        left,
                        true_outcome,
                        false_outcome,
                        collapse_constants,
                        output,
                        logical,
                        subsumed,
                    );
                    return;
                }
                if collapse_constants && constant_condition(tcx, def_id, left) == Some(true) {
                    subsumed.push(expression.hir_id.local_id.as_u32());
                    flatten_decision_expression(
                        tcx,
                        def_id,
                        crate_name,
                        right,
                        true_outcome,
                        false_outcome,
                        collapse_constants,
                        output,
                        logical,
                        subsumed,
                    );
                    return;
                }
                flatten_decision_expression(
                    tcx,
                    def_id,
                    crate_name,
                    left,
                    None,
                    false_outcome,
                    collapse_constants,
                    output,
                    logical,
                    subsumed,
                );
                let right_condition_index = output.len();
                logical.push(LogicalDecisionExpression {
                    expression,
                    right_condition_index,
                });
                flatten_decision_expression(
                    tcx,
                    def_id,
                    crate_name,
                    right,
                    true_outcome,
                    false_outcome,
                    collapse_constants,
                    output,
                    logical,
                    subsumed,
                );
            }
            rustc_ast::BinOpKind::Or => {
                // `a || false` decides on `a` alone; see the `&&` arm.
                if collapse_constants && constant_condition(tcx, def_id, right) == Some(false) {
                    subsumed.push(expression.hir_id.local_id.as_u32());
                    flatten_decision_expression(
                        tcx,
                        def_id,
                        crate_name,
                        left,
                        true_outcome,
                        false_outcome,
                        collapse_constants,
                        output,
                        logical,
                        subsumed,
                    );
                    return;
                }
                if collapse_constants && constant_condition(tcx, def_id, left) == Some(false) {
                    subsumed.push(expression.hir_id.local_id.as_u32());
                    flatten_decision_expression(
                        tcx,
                        def_id,
                        crate_name,
                        right,
                        true_outcome,
                        false_outcome,
                        collapse_constants,
                        output,
                        logical,
                        subsumed,
                    );
                    return;
                }
                flatten_decision_expression(
                    tcx,
                    def_id,
                    crate_name,
                    left,
                    true_outcome,
                    None,
                    collapse_constants,
                    output,
                    logical,
                    subsumed,
                );
                let right_condition_index = output.len();
                logical.push(LogicalDecisionExpression {
                    expression,
                    right_condition_index,
                });
                flatten_decision_expression(
                    tcx,
                    def_id,
                    crate_name,
                    right,
                    true_outcome,
                    false_outcome,
                    collapse_constants,
                    output,
                    logical,
                    subsumed,
                );
            }
            _ => output.push(AtomicDecisionExpression {
                expression,
                true_outcome,
                false_outcome,
                opaque_authored_macro: false,
            }),
        },
        _ => output.push(AtomicDecisionExpression {
            expression,
            true_outcome,
            false_outcome,
            opaque_authored_macro: false,
        }),
    }
}

impl<'tcx> Visitor<'tcx> for HirManifestCollector<'_, 'tcx> {
    fn visit_stmt(&mut self, statement: &'tcx hir::Stmt<'tcx>) {
        match statement.kind {
            hir::StmtKind::Let(local) if local.init.is_some() => {
                let _ = self.point(statement.span, "statement", "let");
                if local.els.is_some() {
                    let _ = self.record_branch(
                        local.pat.span,
                        "let-else",
                        "let-else",
                        &[("matched", "matched"), ("else", "else")],
                    );
                }
            }
            hir::StmtKind::Expr(expression) | hir::StmtKind::Semi(expression) => {
                // rustc expands assertion macros before HIR. Count the
                // authored invocation as one statement, rather than either
                // dropping it as external macro implementation detail or
                // exposing the macro's internal statements as user source.
                let span = if assertion_macro_kind(self.tcx, expression.span).is_some() {
                    statement.span.source_callsite()
                } else if statement.span.from_expansion()
                    && !statement.span.contains(expression.span)
                {
                    // A macro fragment used as a statement -- `$body` in
                    // http's `insert_phase_one!` -- gives the STATEMENT the
                    // placeholder's span in the macro definition, while the
                    // expression keeps the caller's. Recording the placeholder
                    // names no compiled code, so nothing in MIR carries that
                    // range and the obligation can never bind. The expression's
                    // span is where the code actually is.
                    //
                    // Containment is the test, not ownership: an earlier
                    // attempt at this family reused a predicate requiring a
                    // FOREIGN macro, which never fired on http's local one.
                    expression.span
                } else {
                    statement.span
                };
                let _ = self.point(span, "statement", "expression");
            }
            hir::StmtKind::Let(_) | hir::StmtKind::Item(_) => {}
        }
        intravisit::walk_stmt(self, statement);
    }

    fn visit_block(&mut self, block: &'tcx hir::Block<'tcx>) {
        // The tail-expression point is minted before the statements so probe
        // ordinals keep visitation order, which downstream joins rely on.
        let mut tail_point = None;
        if let Some(tail) = block.expr {
            let assertion = assertion_macro_kind(self.tcx, tail.span).is_some();
            let span = if assertion {
                tail.span.source_callsite()
            } else {
                tail.span
            };
            let duplicate_assertion_statement = assertion
                && stable_source_range(self.tcx, span, self.crate_name).is_ok_and(|source| {
                    self.points.values().any(|point| {
                        point.point_kind == "statement"
                            && point.source == source
                            && point
                                .definitions
                                .iter()
                                .any(|definition| definition == &self.definition)
                    })
                });
            if !duplicate_assertion_statement {
                tail_point = self.point(span, "statement", "tail-expression");
            }
        }
        // Manual traversal so a constant condition that took a diverging arm
        // can mark the rest of its own block eliminated (zmij's tail family:
        // `if TABLE::ENABLE { ... return ...; }` followed by the fallback).
        let mut raised = false;
        for statement in block.stmts {
            self.visit_stmt(statement);
            if !raised && std::mem::take(&mut self.const_unreachable_after) {
                self.eliminated_depth += 1;
                raised = true;
            }
        }
        if let Some(tail) = block.expr {
            if raised && let Some(id) = &tail_point {
                // The tail was minted live above; it turned out to sit after
                // a constant-selected diverging arm, so it never lowers.
                CFG_ELIMINATED_POINTS
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner())
                    .insert(id.clone());
            }
            self.visit_expr(tail);
        }
        self.const_unreachable_after = false;
        if raised {
            self.eliminated_depth -= 1;
        }
    }

    fn visit_expr(&mut self, expression: &'tcx hir::Expr<'tcx>) {
        if let hir::ExprKind::Match(scrutinee, _, hir::MatchSource::TryDesugar(_)) = expression.kind
        {
            // The operand is evaluated before the `?` selection begins. Visit
            // it first so collapsed macro expansions retain semantic order for
            // nested operators as well as sequential ones.
            self.visit_expr(scrutinee);
            let _ = self.record_branch(
                expression.span,
                "try-operator",
                "try-operator",
                &[("continued", "continued"), ("returned", "early return")],
            );
            return;
        }
        if matches!(
            expression.kind,
            hir::ExprKind::Binary(
                hir::BinOp {
                    node: rustc_ast::BinOpKind::And | rustc_ast::BinOpKind::Or,
                    ..
                },
                _,
                _
            )
        ) && !self
            .decision_logical_expressions
            .remove(&expression.hir_id.local_id.as_u32())
            && !(expression.span.from_expansion()
                && !self.tcx.def_span(self.def_id).from_expansion()
                && expression
                    .span
                    .ctxt()
                    .outer_expn_data()
                    .macro_def_id
                    .is_some_and(|macro_def| !macro_def.is_local()))
        {
            let branch_id = self.record_logical_branch(expression, true);
            if let Some(branch_id) = branch_id
                && let hir::ExprKind::Binary(_, left, _) = expression.kind
                && constant_condition(self.tcx, self.def_id, left).is_some()
            {
                CFG_ELIMINATED_POINTS
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner())
                    .insert(branch_id);
            }
        }
        if let hir::ExprKind::Loop(block, _, source, _) = expression.kind {
            match source {
                hir::LoopSource::While => {
                    if let Some(control) = block.expr
                        && matches!(control.kind, hir::ExprKind::If(_, _, _))
                    {
                        self.control_overrides
                            .insert(control.hir_id.local_id.as_u32(), "while");
                        let loop_branch_id = self.record_branch(
                            expression.span.source_callsite(),
                            "loop-entry",
                            "loop-entry:while",
                            &[("zero", "zero iterations"), ("entered", "entered")],
                        );
                        if let Some(loop_branch_id) = loop_branch_id {
                            self.loop_branch_overrides
                                .insert(control.hir_id.local_id.as_u32(), loop_branch_id);
                        }
                    } else {
                        self.limitations.insert(format!(
                            "RUST_CONTROL_MAPPING_UNRESOLVED: {}: while control is not the expected expanded HIR shape",
                            self.definition
                        ));
                    }
                }
                hir::LoopSource::ForLoop => {
                    let _ = self.record_branch(
                        expression.span.source_callsite(),
                        "loop-entry",
                        "loop-entry:for",
                        &[("zero", "zero iterations"), ("entered", "entered")],
                    );
                }
                hir::LoopSource::Loop => {}
            }
        }
        if let hir::ExprKind::Match(scrutinee, arms, source) = expression.kind
            && matches!(source, hir::MatchSource::Normal | hir::MatchSource::Postfix)
            && let Some(group_id) = self.record_match(expression, arms)
        {
            let previous = self
                .match_context
                .replace((group_id.clone(), "scrutinee", None));
            self.visit_expr(scrutinee);
            for (index, arm) in arms.iter().enumerate() {
                self.visit_pat(arm.pat);
                if let Some(guard) = arm.guard {
                    self.match_context = Some((group_id.clone(), "guard", Some(index)));
                    self.visit_expr(guard);
                }
                self.match_context = Some((group_id.clone(), "body", Some(index)));
                self.visit_expr(arm.body);
            }
            self.match_context = previous;
            return;
        }
        let assertion = if let hir::ExprKind::If(condition, _, _) = expression.kind {
            assertion_macro_kind(self.tcx, expression.span).map(|kind| (kind, condition))
        } else {
            None
        };
        if let Some((kind, condition)) = assertion {
            match (kind, condition.kind) {
                (
                    "assert" | "debug-assert",
                    hir::ExprKind::Unary(rustc_ast::UnOp::Not, authored),
                ) => {
                    let _ = self.record_control_decision(expression, authored, "assertion", false);
                }
                (
                    "assert-eq" | "debug-assert-eq",
                    hir::ExprKind::Unary(rustc_ast::UnOp::Not, comparison),
                ) if matches!(
                    comparison.kind,
                    hir::ExprKind::Binary(operator, _, _)
                        if matches!(
                            operator.node,
                            rustc_ast::BinOpKind::Eq | rustc_ast::BinOpKind::Ne
                        )
                ) =>
                {
                    let _ = self.record_single_condition_assertion(expression, kind, false);
                }
                ("assert-ne" | "debug-assert-ne", hir::ExprKind::Binary(operator, _, _))
                    if operator.node == rustc_ast::BinOpKind::Eq =>
                {
                    let _ = self.record_single_condition_assertion(expression, kind, true);
                }
                _ => {}
            }
        } else if let hir::ExprKind::If(condition, then_branch, else_branch) = expression.kind {
            let control_kind = self
                .control_overrides
                .remove(&expression.hir_id.local_id.as_u32())
                .unwrap_or("if");
            let decision_id =
                self.record_control_decision(expression, condition, control_kind, false);
            // `cfg!(..)` expands to a bool literal, and a monomorphic bool
            // `const` folds the same way, so such a condition decides the
            // branch at compile time and the other branch never lowers.
            // Walking it with the counter raised marks its obligations
            // unmeasurable in this configuration rather than leaving them to be
            // reported as unbound. Deciding this from the HIR condition is what
            // makes it exact: inferring it from span geometry instead
            // misclassifies live code in `macro_rules!` bodies, whose MIR spans
            // point at the wider callsite.
            if let Some(taken) = constant_condition(self.tcx, self.def_id, condition) {
                // rustc emits no branch mapping for the folded condition, so
                // the decision itself is unmeasurable here, not unbound.
                if let Some(decision_id) = decision_id {
                    CFG_ELIMINATED_POINTS
                        .lock()
                        .unwrap_or_else(|poisoned| poisoned.into_inner())
                        .insert(decision_id);
                }
                self.visit_expr(condition);
                let (live, dead) = if taken {
                    (Some(then_branch), else_branch)
                } else {
                    (else_branch, Some(then_branch))
                };
                if let Some(live) = live {
                    self.visit_expr(live);
                    // zmij's tail family: when the arm the constant selects
                    // diverges (typeck gives it `!`), everything after this
                    // `if` in the enclosing block never lowers either. The
                    // enclosing visit_block consumes the signal.
                    if diverges_via_return(live) {
                        self.const_unreachable_after = true;
                    }
                }
                if let Some(dead) = dead {
                    self.eliminated_depth += 1;
                    self.visit_expr(dead);
                    self.eliminated_depth -= 1;
                }
                return;
            }
        }
        intravisit::walk_expr(self, expression);
    }
}

/// The value of a condition rustc already decided, if it decided one.
///
/// `cfg!(..)` expands to a `true`/`false` literal, and a path to a
/// monomorphic `const` of type `bool` folds during MIR building exactly the
/// same way (zmij's `if USE_UMUL128_HI64` is the field case): the branch the
/// value rules out never reaches MIR. An associated const of a generic
/// parameter stays a live branch in polymorphic MIR and is deliberately not
/// matched here.
/// True when the expression is a `return` in tail position, walking through
/// nested and `unsafe` blocks. Typeck cannot answer this: an arm that
/// diverges inside `if`-without-`else` is recorded with its coerced `()`
/// type, never `!`. A tail `return` always diverges, so this stays exact.
fn diverges_via_return(expression: &hir::Expr<'_>) -> bool {
    match expression.kind {
        hir::ExprKind::Ret(..) => true,
        hir::ExprKind::Block(block, _) => {
            if let Some(tail) = block.expr {
                diverges_via_return(tail)
            } else {
                block
                    .stmts
                    .last()
                    .is_some_and(|statement| match statement.kind {
                        hir::StmtKind::Semi(expression) | hir::StmtKind::Expr(expression) => {
                            diverges_via_return(expression)
                        }
                        _ => false,
                    })
            }
        }
        _ => false,
    }
}

fn constant_condition(
    tcx: TyCtxt<'_>,
    body_owner: rustc_span::def_id::DefId,
    condition: &hir::Expr<'_>,
) -> Option<bool> {
    let const_path = |def_id: rustc_span::def_id::DefId| {
        if tcx.generics_of(def_id).count() != 0 {
            return None;
        }
        // The expression typechecks as an `if` condition, so the const's
        // type is `bool`; const evaluation is exact, never a heuristic.
        tcx.const_eval_poly(def_id)
            .ok()
            .and_then(|value| value.try_to_scalar_int())
            .and_then(|scalar| scalar.try_to_bool().ok())
    };
    match condition.kind {
        hir::ExprKind::Lit(literal) => match literal.node {
            rustc_ast::LitKind::Bool(value) => Some(value),
            _ => None,
        },
        // `!Self::COMPRESS` folds exactly as its operand does.
        hir::ExprKind::Unary(hir::UnOp::Not, inner) => {
            constant_condition(tcx, body_owner, inner).map(|value| !value)
        }
        hir::ExprKind::Path(hir::QPath::Resolved(None, path)) => {
            let hir::def::Res::Def(
                hir::def::DefKind::Const | hir::def::DefKind::AssocConst,
                def_id,
            ) = path.res
            else {
                return None;
            };
            const_path(def_id)
        }
        // zmij's `if ExpStringTable::ENABLE`: an associated const of a
        // concrete type resolves through typeck rather than the path itself.
        hir::ExprKind::Path(ref qpath @ hir::QPath::TypeRelative(..)) => {
            let typeck = tcx.typeck(body_owner.as_local()?);
            let hir::def::Res::Def(
                hir::def::DefKind::Const | hir::def::DefKind::AssocConst,
                def_id,
            ) = typeck.qpath_res(qpath, condition.hir_id)
            else {
                return None;
            };
            const_path(def_id)
        }
        _ => None,
    }
}

fn manifest_json(
    crate_name: &str,
    points: &BTreeMap<String, PointObligation>,
    branches: &BTreeMap<String, BranchObligation>,
    decisions: &BTreeMap<String, DecisionObligation>,
    match_groups: &BTreeMap<String, MatchSelectionObligation>,
    limitations: &[String],
) -> String {
    let points = points
        .iter()
        .map(|(id, obligation)| {
            format!(
                "{{\"id\":\"{}\",\"kind\":\"{}\",\"sourceKey\":\"{}\",\"start\":{},\"end\":{},\"provenance\":\"{}\",\"discriminator\":\"{}\",\"probeOrdinal\":\"{}\",\"definitions\":{},\"canonical\":\"{}\"}}",
                escape(id),
                obligation.point_kind,
                escape(&obligation.source.key),
                obligation.source.start,
                obligation.source.end,
                obligation.provenance,
                escape(&obligation.discriminator),
                obligation.probe_ordinal,
                json_strings(&obligation.definitions),
                escape(&obligation.canonical),
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let branches = branches
        .values()
        .map(|branch| {
            let alternatives = branch
                .alternatives
                .iter()
                .map(|alternative| {
                    format!(
                        "{{\"id\":\"{}\",\"label\":\"{}\",\"probeOrdinal\":\"{}\",\"canonical\":\"{}\"}}",
                        escape(&alternative.identity.id),
                        alternative.label,
                        alternative.identity.probe_ordinal,
                        escape(&alternative.identity.canonical),
                    )
                })
                .collect::<Vec<_>>()
                .join(",");
            format!(
                "{{\"id\":\"{}\",\"kind\":\"{}\",\"discriminator\":\"{}\",\"sourceKey\":\"{}\",\"start\":{},\"end\":{},\"provenance\":\"{}\",\"probeOrdinal\":\"{}\",\"definitions\":{},\"alternatives\":[{}],\"canonical\":\"{}\"}}",
                escape(&branch.identity.id),
                branch.branch_kind,
                escape(&branch.discriminator),
                escape(&branch.identity.source.key),
                branch.identity.source.start,
                branch.identity.source.end,
                branch.identity.provenance,
                branch.identity.probe_ordinal,
                json_strings(&branch.definitions),
                alternatives,
                escape(&branch.identity.canonical),
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let decisions = decisions
        .values()
        .map(|decision| {
            let conditions = decision
                .conditions
                .iter()
                .map(|condition| {
                    format!(
                        "{{\"sourceKey\":\"{}\",\"start\":{},\"end\":{},\"source\":\"{}\"}}",
                        escape(&condition.source.key),
                        condition.source.start,
                        condition.source.end,
                        escape(&condition.text),
                    )
                })
                .collect::<Vec<_>>()
                .join(",");
            let logical_selections = decision
                .logical_selections
                .iter()
                .map(|selection| {
                    format!(
                        "{{\"branchId\":\"{}\",\"rightConditionIndex\":{}}}",
                        escape(&selection.branch_id),
                        selection.right_condition_index,
                    )
                })
                .collect::<Vec<_>>()
                .join(",");
            format!(
                "{{\"id\":\"{}\",\"kind\":\"{}\",\"sourceKey\":\"{}\",\"start\":{},\"end\":{},\"provenance\":\"{}\",\"probeOrdinal\":\"{}\",\"definitions\":{},\"outcomeBranchId\":\"{}\",\"loopBranchId\":{},\"logicalSelections\":[{}],\"conditions\":[{}],\"canonical\":\"{}\"}}",
                escape(&decision.identity.id),
                decision.decision_kind,
                escape(&decision.identity.source.key),
                decision.identity.source.start,
                decision.identity.source.end,
                decision.identity.provenance,
                decision.identity.probe_ordinal,
                json_strings(&decision.definitions),
                escape(&decision.outcome_branch_id),
                json_string(decision.loop_branch_id.as_deref()),
                logical_selections,
                conditions,
                escape(&decision.identity.canonical),
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let selection_groups = match_groups
        .values()
        .map(|group| {
            let arms = group
                .arms
                .iter()
                .map(|arm| {
                    format!(
                        "{{\"branchId\":\"{}\",\"bodySourceKey\":\"{}\",\"bodyStart\":{},\"bodyEnd\":{},\"guarded\":{},\"guardDecisionId\":{},\"selectedOrdinal\":\"{}\",\"notSelectedOrdinal\":\"{}\"}}",
                        escape(&arm.branch_id),
                        escape(&arm.body_source.key),
                        arm.body_source.start,
                        arm.body_source.end,
                        arm.guarded,
                        json_string(arm.guard_decision_id.as_deref()),
                        arm.selected_ordinal,
                        arm.not_selected_ordinal,
                    )
                })
                .collect::<Vec<_>>()
                .join(",");
            format!(
                "{{\"id\":\"{}\",\"kind\":\"match\",\"sourceKey\":\"{}\",\"start\":{},\"end\":{},\"provenance\":\"{}\",\"probeOrdinal\":\"{}\",\"definitions\":{},\"parentGroupId\":{},\"parentSite\":{},\"parentArmIndex\":{},\"arms\":[{}],\"canonical\":\"{}\"}}",
                escape(&group.identity.id),
                escape(&group.identity.source.key),
                group.identity.source.start,
                group.identity.source.end,
                group.identity.provenance,
                group.identity.probe_ordinal,
                json_strings(&group.definitions),
                json_string(group.parent_group_id.as_deref()),
                json_string(group.parent_site),
                group
                    .parent_arm_index
                    .map(|index| index.to_string())
                    .unwrap_or_else(|| "null".into()),
                arms,
                escape(&group.identity.canonical),
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let limitations = limitations
        .iter()
        .map(|limitation| format!("\"{}\"", escape(limitation)))
        .collect::<Vec<_>>()
        .join(",");
    // Obligations Supercov declined to measure. The analyzer must keep these
    // out of the covered/uncovered denominator and report them separately.
    let unmeasured = UNMEASURED_OBLIGATIONS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .iter()
        .map(|id| format!("\"{}\"", escape(id)))
        .collect::<Vec<_>>()
        .join(",");
    format!(
        "{{\"schema\":\"supercov-rust-manifest-candidate-v4\",\"model\":\"rust-source-v1\",\"crate\":\"{}\",\"measurementComplete\":false,\"boundBodies\":{},\"points\":[{}],\"branches\":[{}],\"decisions\":[{}],\"selectionGroups\":[{}],\"limitations\":[{}],\"unmeasuredObligations\":[{}]}}\n",
        escape(crate_name),
        BOUND_BODIES.load(Ordering::Relaxed),
        points,
        branches,
        decisions,
        selection_groups,
        limitations,
        unmeasured
    )
}

fn source_snapshots_json(crate_name: &str, required: &BTreeSet<String>) -> Result<String, String> {
    let snapshots = SOURCE_SNAPSHOTS
        .lock()
        .map_err(|_| "source snapshot lock poisoned".to_owned())?;
    let mut encoded = Vec::with_capacity(required.len());
    for key in required {
        let snapshot = snapshots
            .get(key)
            .ok_or_else(|| format!("Rust denominator source {key} has no compiler snapshot"))?;
        encoded.push(format!(
            "\"{}\":{{\"file\":\"{}\",\"source\":\"{}\"}}",
            escape(key),
            escape(&snapshot.file),
            escape(&snapshot.source),
        ));
    }
    Ok(format!(
        "{{\"schema\":\"supercov-rust-source-snapshots-v1\",\"crate\":\"{}\",\"sources\":{{{}}}}}\n",
        escape(crate_name),
        encoded.join(","),
    ))
}

fn reject_probe_ordinal_collisions(
    tcx: TyCtxt<'_>,
    points: &BTreeMap<String, PointObligation>,
    branches: &BTreeMap<String, BranchObligation>,
    decisions: &BTreeMap<String, DecisionObligation>,
    match_groups: &BTreeMap<String, MatchSelectionObligation>,
) {
    let mut ordinals = BTreeMap::<u64, String>::new();
    let mut insert = |ordinal: u64, id: &str| {
        if let Some(existing) = ordinals.insert(ordinal, id.into())
            && existing != id
        {
            tcx.dcx().fatal(format!(
                "Supercov Rust probe ordinal collision between {existing} and {id}"
            ));
        }
    };
    for (id, point) in points {
        insert(point.probe_ordinal, id);
    }
    for branch in branches.values() {
        insert(branch.identity.probe_ordinal, &branch.identity.id);
        for alternative in &branch.alternatives {
            insert(alternative.identity.probe_ordinal, &alternative.identity.id);
        }
    }
    for decision in decisions.values() {
        insert(decision.identity.probe_ordinal, &decision.identity.id);
    }
    for group in match_groups.values() {
        insert(group.identity.probe_ordinal, &group.identity.id);
    }
}

fn parse_ctfe_marker(fields: &str) -> Option<u64> {
    fields
        .split_once("const ")?
        .1
        .split_once("_u64")?
        .0
        .parse::<u64>()
        .ok()
}

struct ProbeCallbacks;

impl Callbacks for ProbeCallbacks {
    fn config(&mut self, config: &mut Config) {
        // rustc's own TimePassesCallbacks sets this unconditionally before
        // entering the compiler. A rustc_driver client must reproduce that
        // default or diagnostics expose fully-qualified definition paths that
        // the stock rustc binary trims.
        config.opts.trimmed_def_paths = true;
        if env::var_os(INSTRUMENT_MIR).is_some() {
            // These are private compiler implementation settings, not user
            // command-line options. Setting the exact-version config directly
            // retains rustc's MIR branch map without exposing RUSTC_BOOTSTRAP
            // or unstable feature permissions to the target crate.
            config.opts.cg.instrument_coverage = InstrumentCoverage::Yes;
            config.opts.unstable_opts.coverage_options.level = CoverageLevel::Branch;
            config.opts.unstable_opts.no_profiler_runtime = true;
        }
        config.override_queries = Some(install_query_overrides);
    }

    fn after_crate_root_parsing(
        &mut self,
        compiler: &Compiler,
        krate: &mut rustc_ast::Crate,
    ) -> Compilation {
        if env::var_os(INSTRUMENT_MIR).is_none() {
            return Compilation::Continue;
        }
        let mut parser = rustc_parse::unwrap_or_emit_fatal(new_parser_from_source_str(
            &compiler.sess.psess,
            FileName::Custom("<supercov-rust-runtime>".into()),
            RUNTIME_ABI_DECLARATIONS.to_owned(),
            StripTokens::Nothing,
        ));
        let injected = parser.parse_crate_mod().unwrap_or_else(|error| {
            let guaranteed: ErrorGuaranteed = error.emit();
            guaranteed.raise_fatal()
        });
        krate.items.extend(injected.items);
        Compilation::Continue
    }

    fn after_analysis<'tcx>(&mut self, _compiler: &Compiler, tcx: TyCtxt<'tcx>) -> Compilation {
        if tcx.dcx().has_errors().is_some() {
            return Compilation::Continue;
        }
        rustc_middle::ty::print::with_no_trimmed_paths!({
            COMPILATION_SUCCEEDED.store(true, Ordering::Release);
            let Ok(directory) = env::var(OUTPUT_DIRECTORY) else {
                return Compilation::Continue;
            };
            let directory = PathBuf::from(directory);
            if let Err(error) = fs::create_dir_all(&directory) {
                tcx.dcx().fatal(format!(
                    "Supercov could not create the Rust compiler output directory: {error}"
                ));
            }

            let crate_name = tcx.crate_name(rustc_span::def_id::LOCAL_CRATE);
            let crate_name_string = crate_name.to_string();
            let output = directory.join(format!(
                "{}-{}.jsonl",
                std::process::id(),
                sanitize(&crate_name_string)
            ));
            let Ok(mut output) = OpenOptions::new().create_new(true).write(true).open(output)
            else {
                tcx.dcx()
                    .fatal("Supercov could not create a unique Rust compiler trace");
            };
            let source_map = tcx.sess.source_map();
            let doctest_role = DOCTEST_ROLE.get().copied();
            let doctest_path = env::var("UNSTABLE_RUSTDOC_TEST_PATH").ok();
            let doctest_line = env::var("UNSTABLE_RUSTDOC_TEST_LINE").ok();
            let mut points = BTreeMap::<String, PointObligation>::new();
            let mut branches = BTreeMap::<String, BranchObligation>::new();
            let mut decisions = BTreeMap::<String, DecisionObligation>::new();
            let mut match_groups = BTreeMap::<String, MatchSelectionObligation>::new();
            let mut merged_doctest_descriptors = BTreeMap::<String, MergedDoctestDescriptor>::new();
            let mut manifest_limitations = BTreeSet::from([
                "RUST_FRONTEND_PRIVATE: the frozen R1-R4 promotion matrix is not complete"
                    .to_owned(),
            ]);

            // Decide crate scope ONCE, before touching `hir_body_owners()`.
            // Enumerating body owners forces rustc's lazy per-body analysis for
            // EVERY body, including generics codegen never instantiates. On
            // realprobe, serde_core spent 10.045s -- 65% of the whole build --
            // doing that and finished with every accumulator still empty: the
            // crate is outside the roots, so all of its obligations were
            // discarded. Collection drops from 8.07x to 1.09x by not starting.
            //
            // Doctest crates are ALWAYS in scope. rustdoc compiles each doctest
            // as its own crate whose files live outside both roots; excluding
            // them dropped the rustdoc markers and the corpus caught it.
            //
            // The path test uses the FIRST BODY's own file rather than any file
            // the crate touched, because a dependency picks up OUT_DIR artifacts
            // under TARGET_ROOT and an `any()` over the source map then calls
            // everything in scope. It is deliberately not keyed on
            // CARGO_MANIFEST_DIR: supercov's own pipeline compiles a generated
            // workspace under TARGET_ROOT that must stay in scope.
            let crate_in_scope = doctest_role.is_some() || {
                let source_root = normalized_root(SOURCE_ROOT);
                let target_root = normalized_root(TARGET_ROOT);
                if source_root.is_none() && target_root.is_none() {
                    true
                } else {
                    tcx.hir_body_owners().next().is_none_or(|owner| {
                        let span = tcx.def_span(owner.to_def_id());
                        let file = tcx.sess.source_map().lookup_source_file(span.lo());
                        let rustc_span::FileName::Real(name) = &file.name else {
                            return true;
                        };
                        let Some(path) = name.local_path() else {
                            return true;
                        };
                        let path = normalized_path(path);
                        source_root
                            .as_ref()
                            .is_some_and(|root| root_relative(&path, root).is_some())
                            || target_root
                                .as_ref()
                                .is_some_and(|root| root_relative(&path, root).is_some())
                    })
                }
            };
            for owner in tcx.hir_body_owners() {
                if !crate_in_scope {
                    break;
                }
                let def_id = owner.to_def_id();
                let definition = exact_def_path!(tcx, def_id);
                // The reserved injected module is transport machinery, never
                // authored source. The production shape contains declarations
                // only; keep this boundary fail-safe if a body is ever added.
                if definition.contains("__supercov_spike_runtime") {
                    continue;
                }
                let span = tcx.def_span(def_id);
                let callsite = span.source_callsite();
                let kind = tcx.def_kind(def_id);
                let mir = if matches!(
                    kind,
                    DefKind::Const
                        | DefKind::AssocConst
                        | DefKind::Static { .. }
                        | DefKind::AnonConst
                        | DefKind::InlineConst
                ) {
                    tcx.mir_for_ctfe(def_id)
                } else {
                    tcx.optimized_mir(def_id)
                };
                let mut mir_spans = mir
                    .basic_blocks
                    .iter()
                    .flat_map(|block| {
                        block
                            .statements
                            .iter()
                            .map(|statement| statement.source_info.span)
                            .chain(
                                block
                                    .terminator
                                    .iter()
                                    .map(|terminator| terminator.source_info.span),
                            )
                    })
                    .map(|span| source_map.span_to_diagnostic_string(span))
                    .collect::<Vec<_>>();
                mir_spans.sort();
                mir_spans.dedup();
                let mut mir_authored_lines = if doctest_role == Some("standalone") {
                    mir.basic_blocks
                        .iter()
                        .flat_map(|block| {
                            block
                                .statements
                                .iter()
                                .map(|statement| statement.source_info.span)
                                .chain(
                                    block
                                        .terminator
                                        .iter()
                                        .map(|terminator| terminator.source_info.span),
                                )
                        })
                        .map(|span| source_map.lookup_char_pos(span.lo()))
                        .map(|location| {
                            source_map.doctest_offset_line(&location.file.name, location.line)
                        })
                        .collect::<Vec<_>>()
                } else {
                    Vec::new()
                };
                mir_authored_lines.sort();
                mir_authored_lines.dedup();
                let source_snippet = source_map.span_to_snippet(span).ok();
                let body_snippet = source_map
                    .span_to_snippet(tcx.hir_body_owned_by(owner).value.span)
                    .ok();
                match merged_doctest_descriptor(tcx, &definition) {
                    Ok(Some(descriptor)) => {
                        if merged_doctest_descriptors
                            .insert(descriptor.module.clone(), descriptor)
                            .is_some()
                        {
                            tcx.dcx().fatal(format!(
                                "Supercov observed duplicate merged doctest descriptor {definition}"
                            ));
                        }
                    }
                    Ok(None) => {}
                    Err(error) => tcx.dcx().fatal(error),
                }
                let test_name = test_identity_for(tcx, &definition);
                let test_context_id = test_name.as_deref().map(test_context_id);
                let doctest_display_name = merged_doctest_display_name(tcx, &definition);
                let merged_bundle_module =
                    doctest_role.and_then(|role| merged_doctest_module(&definition, role));
                let synthetic_merged_main = doctest_role == Some("merged-bundle")
                    && merged_bundle_module.is_some()
                    && definition.ends_with("::main");
                let synthetic_merged_wrapper =
                    doctest_role == Some("merged-bundle") && definition.ends_with("::__main_fn");
                let function_identity = if is_function_body(kind)
                    && !is_async_function_constructor(tcx, owner)
                    && !synthetic_merged_main
                    && !synthetic_merged_wrapper
                {
                    match function_identity(tcx, def_id, span, &crate_name_string) {
                        Ok(identity) => {
                            match points.get_mut(&identity.id) {
                                Some(existing) if existing.canonical != identity.canonical => {
                                    tcx.dcx().fatal(format!(
                                        "Supercov Rust obligation ID collision for {}",
                                        identity.id
                                    ))
                                }
                                Some(existing) => {
                                    existing.definitions.push(exact_def_path!(tcx, def_id));
                                    existing.definitions.sort();
                                    existing.definitions.dedup();
                                }
                                None => {
                                    points.insert(
                                        identity.id.clone(),
                                        PointObligation {
                                            canonical: identity.canonical.clone(),
                                            source: identity.source.clone(),
                                            provenance: identity.provenance,
                                            point_kind: "function",
                                            discriminator: String::new(),
                                            probe_ordinal: identity.probe_ordinal,
                                            definitions: vec![exact_def_path!(tcx, def_id)],
                                        },
                                    );
                                }
                            }
                            Some(identity)
                        }
                        Err(error) => {
                            manifest_limitations.insert(format!(
                                "RUST_SOURCE_IDENTITY_UNRESOLVED: {}: {error}",
                                exact_def_path!(tcx, def_id)
                            ));
                            None
                        }
                    }
                } else {
                    None
                };
                if !synthetic_merged_wrapper {
                    let body = tcx.hir_body_owned_by(owner);
                    let mut collector = HirManifestCollector {
                        tcx,
                        def_id,
                        crate_name: &crate_name_string,
                        definition: definition.clone(),
                        ordinal: 1,
                        points: &mut points,
                        branches: &mut branches,
                        decisions: &mut decisions,
                        match_groups: &mut match_groups,
                        limitations: &mut manifest_limitations,
                        control_overrides: BTreeMap::new(),
                        eliminated_depth: 0,
                        const_unreachable_after: false,
                        loop_branch_overrides: BTreeMap::new(),
                        decision_logical_expressions: BTreeSet::new(),
                        match_context: None,
                    };
                    collector.visit_body(body);
                }
                let record = format!(
                    "{{\"crate\":\"{}\",\"definition\":\"{}\",\"kind\":\"{:?}\",\"span\":\"{}\",\"callsite\":\"{}\",\"expanded\":{},\"mirBlocks\":{},\"mirSpans\":{},\"mirAuthoredLines\":{},\"sourceSnippet\":{},\"bodySnippet\":{},\"doctestRole\":{},\"doctestPath\":{},\"doctestLine\":{},\"testName\":{},\"testContextId\":{},\"doctestDisplayName\":{},\"manifestPointCount\":{},\"manifestLimitations\":{},\"functionObligationId\":{},\"sourceKey\":{},\"sourceStart\":{},\"sourceEnd\":{},\"sourceProvenance\":{}}}\n",
                    escape(&crate_name_string),
                    escape(&exact_def_path!(tcx, def_id)),
                    kind,
                    escape(&source_map.span_to_diagnostic_string(span)),
                    escape(&source_map.span_to_diagnostic_string(callsite)),
                    span.from_expansion(),
                    mir.basic_blocks.len(),
                    json_strings(&mir_spans),
                    json_usizes(&mir_authored_lines),
                    json_string(source_snippet.as_deref()),
                    json_string(body_snippet.as_deref()),
                    json_string(doctest_role),
                    json_string(doctest_path.as_deref()),
                    json_string(doctest_line.as_deref()),
                    json_string(test_name.as_deref()),
                    test_context_id.map_or_else(|| "null".into(), |value| format!("\"{value}\"")),
                    json_string(doctest_display_name.as_deref()),
                    points.len(),
                    json_strings(&manifest_limitations.iter().cloned().collect::<Vec<_>>()),
                    json_string(
                        function_identity
                            .as_ref()
                            .map(|identity| identity.id.as_str())
                    ),
                    json_string(
                        function_identity
                            .as_ref()
                            .map(|identity| identity.source.key.as_str()),
                    ),
                    function_identity.as_ref().map_or_else(
                        || "null".into(),
                        |identity| identity.source.start.to_string(),
                    ),
                    function_identity
                        .as_ref()
                        .map_or_else(|| "null".into(), |identity| identity.source.end.to_string(),),
                    json_string(
                        function_identity
                            .as_ref()
                            .map(|identity| identity.provenance),
                    ),
                );
                if output.write_all(record.as_bytes()).is_err() {
                    tcx.dcx()
                        .fatal("Supercov could not persist the Rust compiler trace");
                }
            }
            if output.flush().is_err() {
                tcx.dcx()
                    .fatal("Supercov could not flush the Rust compiler trace");
            }
            if let Err(error) = write_merged_doctest_map(&directory, &merged_doctest_descriptors) {
                tcx.dcx().fatal(error);
            }
            if points.is_empty()
                && branches.is_empty()
                && decisions.is_empty()
                && match_groups.is_empty()
            {
                return Compilation::Continue;
            }
            let manifest_path = directory.join(format!(
                "manifest-{}-{}.json",
                std::process::id(),
                sanitize(&crate_name_string)
            ));
            prune_unreachable_match_arms(&mut branches, &mut match_groups);
            // Obligations degraded during MIR binding. The body loop above forced
            // `optimized_mir`/`mir_for_ctfe` per body, so every degradation has
            // been recorded by now and reaches this crate's manifest candidate.
            manifest_limitations.extend(
                BINDER_LIMITATIONS
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner())
                    .iter()
                    .cloned(),
            );
            let limitations = manifest_limitations.into_iter().collect::<Vec<_>>();
            reject_probe_ordinal_collisions(tcx, &points, &branches, &decisions, &match_groups);
            let manifest = manifest_json(
                &crate_name_string,
                &points,
                &branches,
                &decisions,
                &match_groups,
                &limitations,
            );
            let Ok(mut manifest_output) = OpenOptions::new()
                .create_new(true)
                .write(true)
                .open(manifest_path)
            else {
                tcx.dcx()
                    .fatal("Supercov could not create a unique Rust manifest candidate");
            };
            if manifest_output.write_all(manifest.as_bytes()).is_err()
                || manifest_output.flush().is_err()
            {
                tcx.dcx()
                    .fatal("Supercov could not persist the Rust manifest candidate");
            }
            if let Some(ready_path) = env::var_os(ABORT_AFTER_MANIFEST)
                && env::var(ABORT_CRATE)
                    .map(|target| target == crate_name_string)
                    .unwrap_or(true)
            {
                if let Err(error) = fs::write(&ready_path, crate_name_string.as_bytes()) {
                    tcx.dcx().fatal(format!(
                        "Supercov could not mark the manifest-only crash checkpoint: {error}"
                    ));
                }
                std::process::abort();
            }
            let required_sources = points
                .values()
                .map(|point| point.source.key.clone())
                .chain(
                    branches
                        .values()
                        .map(|branch| branch.identity.source.key.clone()),
                )
                .chain(decisions.values().flat_map(|decision| {
                    std::iter::once(decision.identity.source.key.clone()).chain(
                        decision
                            .conditions
                            .iter()
                            .map(|condition| condition.source.key.clone()),
                    )
                }))
                .chain(match_groups.values().flat_map(|group| {
                    std::iter::once(group.identity.source.key.clone())
                        .chain(group.arms.iter().map(|arm| arm.body_source.key.clone()))
                }))
                .collect::<BTreeSet<_>>();
            let snapshots = source_snapshots_json(&crate_name_string, &required_sources)
                .unwrap_or_else(|error| tcx.dcx().fatal(error));
            let snapshots_path = directory.join(format!(
                "sources-{}-{}.json",
                std::process::id(),
                sanitize(&crate_name_string)
            ));
            let Ok(mut snapshots_output) = OpenOptions::new()
                .create_new(true)
                .write(true)
                .open(snapshots_path)
            else {
                tcx.dcx()
                    .fatal("Supercov could not create a unique Rust source snapshot");
            };
            if snapshots_output.write_all(snapshots.as_bytes()).is_err()
                || snapshots_output.flush().is_err()
            {
                tcx.dcx()
                    .fatal("Supercov could not persist the Rust source snapshot");
            }
            Compilation::Continue
        })
    }
}

fn install_query_overrides(_session: &Session, providers: &mut Providers) {
    let _ = ORIGINAL_OPTIMIZED_MIR.set(providers.queries.optimized_mir);
    let _ = ORIGINAL_MIR_FOR_CTFE.set(providers.queries.mir_for_ctfe);
    let _ = ORIGINAL_MIR_BUILT.set(providers.queries.mir_built);
    let _ = ORIGINAL_MIR_DROPS.set(providers.queries.mir_drops_elaborated_and_const_checked);
    providers.queries.optimized_mir = optimized_mir_with_probe;
    providers.queries.mir_for_ctfe = mir_for_ctfe_with_markers;
    providers.queries.mir_built = mir_built_with_match_markers;
    providers.queries.mir_drops_elaborated_and_const_checked = mir_drops_with_structural_probes;
}

fn semantic_successors(terminator: &Terminator<'_>) -> Vec<BasicBlock> {
    match terminator.kind {
        TerminatorKind::FalseEdge { real_target, .. }
        | TerminatorKind::FalseUnwind { real_target, .. } => vec![real_target],
        _ => terminator.successors().collect(),
    }
}

fn block_reaches(body: &Body<'_>, start: BasicBlock, target: BasicBlock) -> bool {
    let mut pending = vec![start];
    let mut visited = BTreeSet::new();
    while let Some(block) = pending.pop() {
        if block == target {
            return true;
        }
        if !visited.insert(block) {
            continue;
        }
        pending.extend(semantic_successors(body.basic_blocks[block].terminator()));
    }
    false
}

/// Reachability that refuses to pass through `barrier`. Arm-region
/// membership inside a loop needs this: from any arm body the loop back
/// edge re-enters the match, so plain reachability makes every arm reach
/// every block. Barring the claimed arm's entry keeps only paths that enter
/// the region some other way — which exist exactly when the block is not
/// exclusive to that arm.
fn block_reaches_avoiding(
    body: &Body<'_>,
    start: BasicBlock,
    target: BasicBlock,
    barrier: BasicBlock,
) -> bool {
    if start == barrier {
        return start == target;
    }
    let mut pending = vec![start];
    let mut visited = BTreeSet::new();
    while let Some(block) = pending.pop() {
        if block == target {
            return true;
        }
        if block == barrier || !visited.insert(block) {
            continue;
        }
        pending.extend(semantic_successors(body.basic_blocks[block].terminator()));
    }
    false
}

fn guarded_match_arm_entry(
    body: &Body<'_>,
    candidate: BasicBlock,
    rejection: BasicBlock,
) -> Result<BasicBlock, String> {
    let mut pending = vec![candidate];
    let mut visited = BTreeSet::new();
    let mut selected = BTreeSet::new();
    while let Some(block) = pending.pop() {
        if block == rejection || !visited.insert(block) {
            continue;
        }
        let terminator = body.basic_blocks[block].terminator();
        let successors = terminator.successors().collect::<BTreeSet<_>>();
        if matches!(terminator.kind, TerminatorKind::SwitchInt { .. }) {
            let (rejecting, accepting): (Vec<_>, Vec<_>) = successors
                .iter()
                .copied()
                .partition(|successor| block_reaches(body, *successor, rejection));
            if !rejecting.is_empty() && accepting.len() == 1 {
                selected.insert(accepting[0]);
            }
        }
        pending.extend(semantic_successors(terminator));
    }
    let selected = selected.into_iter().collect::<Vec<_>>();
    let [selected] = selected.as_slice() else {
        return Err("guarded collapsed match has no unique accepting edge".into());
    };
    Ok(*selected)
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct SyntheticMatchArmPath {
    entry: BasicBlock,
    guard_candidate: Option<BasicBlock>,
    rejection: Option<BasicBlock>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct SyntheticMatchGroupPath {
    start: BasicBlock,
    arms: Vec<SyntheticMatchArmPath>,
}

fn guard_condition_blocks<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &Body<'tcx>,
    candidate: BasicBlock,
    selected: BasicBlock,
    rejection: BasicBlock,
    expected: usize,
) -> Result<Vec<BasicBlock>, String> {
    let mut pending = vec![candidate];
    let mut visited = BTreeSet::new();
    let mut switches = BTreeSet::new();
    while let Some(block) = pending.pop() {
        if block == selected || block == rejection || !visited.insert(block) {
            continue;
        }
        let terminator = body.basic_blocks[block].terminator();
        if let TerminatorKind::SwitchInt { discr, targets } = &terminator.kind
            && discr.ty(&body.local_decls, tcx) == tcx.types.bool
        {
            let true_target = targets.target_for_value(1);
            let false_target = targets.target_for_value(0);
            let terminal_reachability = |target| {
                (
                    block_reaches(body, target, selected),
                    block_reaches(body, target, rejection),
                )
            };
            if terminal_reachability(true_target) != terminal_reachability(false_target) {
                switches.insert(block);
            }
        }
        pending.extend(semantic_successors(terminator));
    }
    if switches.len() != expected {
        return Err(format!(
            "synthetic guard has {} Boolean switches for {expected} conditions",
            switches.len()
        ));
    }
    let mut ranked = switches
        .iter()
        .copied()
        .map(|block| {
            let predecessors = switches
                .iter()
                .copied()
                .filter(|other| *other != block && block_reaches(body, *other, block))
                .count();
            (predecessors, block)
        })
        .collect::<Vec<_>>();
    ranked.sort();
    if ranked
        .iter()
        .enumerate()
        .any(|(index, (rank, _))| index != *rank)
    {
        return Err("synthetic guard Boolean switches have no total evaluation order".into());
    }
    Ok(ranked.into_iter().map(|(_, block)| block).collect())
}

/// Strict "executes before" order for same-source sibling structures: one-way
/// reachability orders sequential structures, dominance breaks the
/// mutual-reachability tie that loop back edges introduce, and parallel
/// branches of one switch follow MIR lowering order, which mirrors source
/// order (then before else, match arms in order).
fn semantically_before(body: &Body<'_>, first: BasicBlock, second: BasicBlock) -> bool {
    let forward = block_reaches(body, first, second);
    let backward = block_reaches(body, second, first);
    if forward != backward {
        return forward;
    }
    let dominators = body.basic_blocks.dominators();
    if forward {
        if dominators.dominates(first, second) {
            return true;
        }
        if dominators.dominates(second, first) {
            return false;
        }
    }
    let Some(join) = nearest_common_dominator(dominators, first, second) else {
        return false;
    };
    if join == first || join == second {
        return false;
    }
    if !matches!(
        body.basic_blocks[join].terminator().kind,
        TerminatorKind::SwitchInt { .. }
    ) {
        return false;
    }
    let branch_of = |block: BasicBlock| {
        body.basic_blocks[join]
            .terminator()
            .successors()
            .find(|successor| *successor == block || dominators.dominates(*successor, block))
    };
    match (branch_of(first), branch_of(second)) {
        (Some(first_branch), Some(second_branch)) if first_branch != second_branch => {
            first_branch < second_branch
        }
        _ => false,
    }
}

/// Recover the exact literal a candidate's FalseEdge accepts from the
/// pattern tests on its unique predecessor path: either the const operand of
/// a `<str as PartialEq>::eq` call whose success edge enters the region, or
/// the per-byte `switchInt((*scrutinee)[index of len])` edge values, whose
/// indices must cover the complete literal.
fn recovered_edge_literal<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &Body<'tcx>,
    edge: BasicBlock,
) -> Option<Vec<u8>> {
    fn byte_index(operand: &Operand<'_>) -> Option<(u64, u64)> {
        let place = match operand {
            Operand::Copy(place) | Operand::Move(place) => place,
            _ => return None,
        };
        place
            .projection
            .iter()
            .rev()
            .find_map(|element| match element {
                ProjectionElem::ConstantIndex {
                    offset,
                    min_length,
                    from_end: false,
                } => Some((offset, min_length)),
                _ => None,
            })
    }
    let predecessors = body.basic_blocks.predecessors();
    // Only pattern-test switches form the accepting path; FalseEdge imaginary
    // edges from other candidates may also enter it and must be ignored.
    let test_predecessor = |block: BasicBlock| {
        let mut tests = predecessors[block].iter().copied().filter(|predecessor| {
            matches!(
                body.basic_blocks[*predecessor].terminator().kind,
                TerminatorKind::SwitchInt { .. }
            )
        });
        let predecessor = tests.next()?;
        tests.next().is_none().then_some(predecessor)
    };
    let mut current = edge;
    let mut bytes = BTreeMap::new();
    let mut length = None;
    for _ in 0..body.basic_blocks.len() {
        let predecessor = test_predecessor(current)?;
        let predecessor = &predecessor;
        let terminator = body.basic_blocks[*predecessor].terminator();
        let TerminatorKind::SwitchInt { discr, targets } = &terminator.kind else {
            return None;
        };
        if let Some((index, min_length)) = byte_index(discr) {
            let value = targets
                .iter()
                .find_map(|(value, target)| (target == current).then_some(value))?;
            let byte = u8::try_from(value).ok()?;
            if bytes
                .insert(index, byte)
                .is_some_and(|existing| existing != byte)
                || length
                    .replace(min_length)
                    .is_some_and(|existing| existing != min_length)
            {
                return None;
            }
            current = *predecessor;
            continue;
        }
        if discr.ty(&body.local_decls, tcx) == tcx.types.bool {
            if targets.otherwise() != current {
                return None;
            }
            // A byte tree terminates at its length check; a string test's
            // bool comes from the equality call in the switch's predecessor.
            if let Some(collected_length) = length {
                return (bytes.len() as u64 == collected_length
                    && bytes.keys().copied().eq(0..collected_length))
                .then(|| bytes.into_values().collect());
            }
            let mut calls = predecessors[*predecessor].iter().copied().filter(|block| {
                matches!(
                    body.basic_blocks[*block].terminator().kind,
                    TerminatorKind::Call { .. }
                )
            });
            let call_block = calls.next()?;
            if calls.next().is_some() {
                return None;
            }
            let TerminatorKind::Call { args, .. } =
                &body.basic_blocks[call_block].terminator().kind
            else {
                return None;
            };
            return args.iter().find_map(|argument| {
                let Operand::Constant(constant) = &argument.node else {
                    return None;
                };
                let ConstOperand { const_, .. } = **constant;
                let Const::Val(value, ty) = const_ else {
                    return None;
                };
                (ty.peel_refs() == tcx.types.str_)
                    .then(|| value.try_get_slice_bytes_for_diagnostics(tcx))
                    .flatten()
                    .map(<[u8]>::to_vec)
            });
        }
        return None;
    }
    None
}

/// Resolve the next chain link from a candidate-test region. Pattern tests
/// for string and byte-slice literals interpose equality calls, length checks
/// and per-byte switches between consecutive `FalseEdge` blocks, so the link
/// is not always the immediate block. Among the group's span-matching
/// `FalseEdge` blocks reachable from `current`, exactly one reaches all the
/// others — the earliest in candidate order; anything else is ambiguous and
/// yields no link, failing closed.
fn next_synthetic_chain_link(
    body: &Body<'_>,
    matching_edges: &BTreeSet<BasicBlock>,
    current: BasicBlock,
) -> Option<BasicBlock> {
    if matching_edges.contains(&current) {
        return Some(current);
    }
    let reachable = matching_edges
        .iter()
        .copied()
        .filter(|edge| block_reaches(body, current, *edge))
        .collect::<Vec<_>>();
    let mut links = reachable.iter().copied().filter(|edge| {
        reachable
            .iter()
            .all(|other| other == edge || block_reaches(body, *edge, *other))
    });
    let link = links.next()?;
    links.next().is_none().then_some(link)
}

fn synthetic_match_candidates<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    body: &Body<'tcx>,
    group: &MatchSelectionObligation,
) -> Vec<SyntheticMatchGroupPath> {
    let arm_count = group.arms.len();
    if arm_count < 2 {
        return Vec::new();
    }
    let false_edges = body
        .basic_blocks
        .iter_enumerated()
        .filter_map(|(block, data)| match data.terminator().kind {
            TerminatorKind::FalseEdge {
                real_target,
                imaginary_target,
                // Desugared matches (`?`, `while let`, …) are never authored
                // match groups and must not compete as chain candidates.
            } if data
                .terminator()
                .source_info
                .span
                .desugaring_kind()
                .is_none() =>
            {
                Some((block, real_target, imaginary_target))
            }
            _ => None,
        })
        .collect::<Vec<_>>();
    let by_block = false_edges
        .into_iter()
        .map(|(block, real, imaginary)| (block, (real, imaginary)))
        .collect::<BTreeMap<_, _>>();
    // An edge inside a declarative macro's body belongs to that body, while
    // its callsite is the invocation site; the two coincide only for
    // proc-macro output. Offer both and let matching take whichever the
    // obligation was keyed at, exactly as try-operator candidates do.
    let edge_sources = by_block
        .keys()
        .copied()
        .map(|block| {
            let span = body.basic_blocks[block].terminator().source_info.span;
            let sources = [span, span.source_callsite()]
                .into_iter()
                .filter_map(|span| stable_source_range(tcx, span, crate_name).ok())
                .collect::<Vec<_>>();
            (block, sources)
        })
        .collect::<BTreeMap<_, _>>();
    // A group matching on an ADT can only bind edges whose test switches on
    // that ADT's discriminant; skipped foreign-macro matches on other types
    // (serde's `tri!` on `Result`) share the collapsed span but never the
    // scrutinee type.
    let block_predecessors = body.basic_blocks.predecessors();
    let discriminant_adt = |block: BasicBlock| -> Option<String> {
        let mut switches = block_predecessors[block].iter().copied().filter(|block| {
            matches!(
                body.basic_blocks[*block].terminator().kind,
                TerminatorKind::SwitchInt { .. }
            )
        });
        let switch = switches.next()?;
        if switches.next().is_some() {
            return None;
        }
        let TerminatorKind::SwitchInt { discr, .. } = &body.basic_blocks[switch].terminator().kind
        else {
            return None;
        };
        let local = match discr {
            Operand::Copy(place) | Operand::Move(place) => place.as_local()?,
            _ => return None,
        };
        body.basic_blocks[switch]
            .statements
            .iter()
            .rev()
            .find_map(|statement| {
                let StatementKind::Assign(assignment) = &statement.kind else {
                    return None;
                };
                let Rvalue::Discriminant(place) = &assignment.1 else {
                    return None;
                };
                if assignment.0.as_local() != Some(local) {
                    return None;
                }
                place
                    .ty(&body.local_decls, tcx)
                    .ty
                    .peel_refs()
                    .ty_adt_def()
                    .map(|adt| tcx.def_path_str(adt.did()))
            })
    };
    // An arm's chain edge carries either the collapsed group source or the
    // arm's own pattern source (foreign derives span generated patterns at
    // the authored field/variant identifiers).
    let arm_edges_with = |ignore_spans: bool| {
        group
            .arms
            .iter()
            .map(|arm| {
                edge_sources
                    .iter()
                    .filter(|(block, sources)| {
                        let span_matched = ignore_spans
                            || sources.iter().any(|source| {
                                *source == group.identity.source
                                    || arm
                                        .pattern_source
                                        .as_ref()
                                        .is_some_and(|pattern| pattern == source)
                            });
                        // Only a positively identified type the patterns never
                        // test disqualifies an edge; guard structures make the
                        // discriminant unidentifiable and stay span/order-bound.
                        span_matched
                            && (group.pattern_adts.is_empty()
                                || discriminant_adt(**block)
                                    .is_none_or(|edge_adt| group.pattern_adts.contains(&edge_adt)))
                    })
                    .map(|(block, _)| *block)
                    .collect::<BTreeSet<_>>()
            })
            .collect::<Vec<_>>()
    };
    // Coverage-ineligible functions can scatter generated spans across
    // unrelated authored tokens (a builtin derive puts the match, its
    // patterns and its pattern tests on different fields). Span matching
    // stays primary; only when it starves an arm entirely does structure
    // carry the binding alone.
    let mut arm_edges = arm_edges_with(false);
    if arm_edges.iter().all(BTreeSet::is_empty)
        && !tcx.coverage_attr_on(body.source.def_id().expect_local())
    {
        arm_edges = arm_edges_with(true);
    }
    // Integer-switch mode: binding-free integer matches lower to one multiway
    // switchInt with no FalseEdge blocks at all. Bind each arm to its exact
    // value edge; the wildcard arm takes the otherwise edge.
    let tested_arms = &group.arms[..arm_count - 1];
    if by_block.is_empty()
        && tested_arms
            .iter()
            .all(|arm| !arm.guarded && arm.pattern_int.is_some())
    {
        let mut switches = body
            .basic_blocks
            .iter_enumerated()
            .filter(|(_, data)| {
                let terminator = data.terminator();
                let TerminatorKind::SwitchInt { discr, .. } = &terminator.kind else {
                    return false;
                };
                discr.ty(&body.local_decls, tcx) != tcx.types.bool
                    && terminator.source_info.span.desugaring_kind().is_none()
                    && stable_source_range(
                        tcx,
                        terminator.source_info.span.source_callsite(),
                        crate_name,
                    )
                    .is_ok_and(|source| source == group.identity.source)
            })
            .map(|(block, _)| block);
        if let Some(switch) = switches.next()
            && switches.next().is_none()
            && let TerminatorKind::SwitchInt { targets, .. } =
                &body.basic_blocks[switch].terminator().kind
        {
            let entries = tested_arms
                .iter()
                .map(|arm| {
                    let value = arm.pattern_int?;
                    targets
                        .iter()
                        .find_map(|(edge, target)| (edge == value).then_some(target))
                })
                .chain([Some(targets.otherwise())])
                .collect::<Option<Vec<_>>>();
            if let Some(entries) = entries
                && entries.iter().collect::<BTreeSet<_>>().len() == entries.len()
            {
                return vec![SyntheticMatchGroupPath {
                    start: switch,
                    arms: entries
                        .into_iter()
                        .map(|entry| SyntheticMatchArmPath {
                            entry,
                            guard_candidate: None,
                            rejection: None,
                        })
                        .collect(),
                }];
            }
        }
        return Vec::new();
    }
    // Literal mode: when every tested arm is an unguarded string/byte-string
    // literal, bind each arm to the edge whose recovered accepted literal is
    // exactly the arm's pattern. Same-length literals lower into a shared
    // multiway test tree that erases source order, so no chain walk applies.
    if tested_arms
        .iter()
        .all(|arm| !arm.guarded && arm.pattern_literal.is_some())
    {
        let mut edges_by_literal = BTreeMap::<Vec<u8>, Vec<BasicBlock>>::new();
        for block in arm_edges.iter().flatten().copied().collect::<BTreeSet<_>>() {
            if let Some(literal) = recovered_edge_literal(tcx, body, block) {
                edges_by_literal.entry(literal).or_default().push(block);
            }
        }
        let assigned = tested_arms
            .iter()
            .map(|arm| {
                let literal = arm.pattern_literal.as_deref()?;
                match edges_by_literal.get(literal).map(Vec::as_slice) {
                    Some([block]) => Some(*block),
                    _ => None,
                }
            })
            .collect::<Option<Vec<_>>>();
        if let Some(assigned) = assigned
            && assigned.iter().collect::<BTreeSet<_>>().len() == assigned.len()
        {
            let mut entries = assigned
                .iter()
                .map(|block| SyntheticMatchArmPath {
                    entry: by_block[block].0,
                    guard_candidate: None,
                    rejection: None,
                })
                .collect::<Vec<_>>();
            entries.push(SyntheticMatchArmPath {
                entry: by_block[assigned.last().expect("at least one tested arm")].1,
                guard_candidate: None,
                rejection: None,
            });
            if entries
                .iter()
                .map(|entry| entry.entry)
                .collect::<BTreeSet<_>>()
                .len()
                == entries.len()
            {
                return vec![SyntheticMatchGroupPath {
                    start: *assigned.first().expect("at least one tested arm"),
                    arms: entries,
                }];
            }
        }
    }
    let mut candidates = Vec::new();
    for head in arm_edges[0].iter().copied() {
        let mut current = head;
        let mut entries = Vec::with_capacity(arm_count);
        let mut valid = true;
        for (index, arm) in group.arms[..arm_count - 1].iter().enumerate() {
            let link = if index == 0 {
                Some(head)
            } else {
                next_synthetic_chain_link(body, &arm_edges[index], current)
            };
            let Some((real, imaginary)) = link.and_then(|link| by_block.get(&link).copied()) else {
                valid = false;
                break;
            };
            let entry = if arm.guarded {
                match guarded_match_arm_entry(body, real, imaginary) {
                    Ok(entry) => entry,
                    Err(_) => {
                        valid = false;
                        break;
                    }
                }
            } else {
                real
            };
            entries.push(SyntheticMatchArmPath {
                entry,
                guard_candidate: arm.guarded.then_some(real),
                rejection: arm.guarded.then_some(imaginary),
            });
            if index + 1 == arm_count - 1 {
                entries.push(SyntheticMatchArmPath {
                    entry: imaginary,
                    guard_candidate: None,
                    rejection: None,
                });
            } else {
                current = imaginary;
            }
        }
        if valid
            && entries.len() == arm_count
            && entries
                .iter()
                .map(|entry| entry.entry)
                .collect::<BTreeSet<_>>()
                .len()
                == entries.len()
        {
            candidates.push(SyntheticMatchGroupPath {
                start: head,
                arms: entries,
            });
        }
    }
    candidates.sort();
    candidates.dedup();
    candidates
}

/// The exact bytes a string or byte-string literal pattern accepts, when the
/// pattern is such a literal.
fn string_pattern_literal(pattern: &rustc_hir::Pat<'_>) -> Option<Vec<u8>> {
    let rustc_hir::PatKind::Expr(expression) = pattern.kind else {
        return None;
    };
    let rustc_hir::PatExprKind::Lit {
        lit,
        negated: false,
    } = expression.kind
    else {
        return None;
    };
    match lit.node {
        rustc_ast::LitKind::Str(value, _) => Some(value.as_str().as_bytes().to_vec()),
        rustc_ast::LitKind::ByteStr(value, _) => Some(value.as_byte_str().to_vec()),
        _ => None,
    }
}

/// The exact unsigned integer an integer-literal pattern accepts.
fn integer_pattern_literal<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    pattern: &'tcx rustc_hir::Pat<'tcx>,
) -> Option<u128> {
    let rustc_hir::PatKind::Expr(expression) = pattern.kind else {
        return None;
    };
    match expression.kind {
        rustc_hir::PatExprKind::Lit {
            lit,
            negated: false,
        } => match lit.node {
            rustc_ast::LitKind::Int(value, _) => Some(value.get()),
            _ => None,
        },
        // A named constant carries the same switch value as the literal it
        // stands for -- serde_json matches `self::BB`, `self::TT` and friends
        // rather than bare integers -- and without evaluating it the arm has
        // neither a variant nor a value to bind its switch target by.
        rustc_hir::PatExprKind::Path(ref qpath) => {
            let typeck = tcx.typeck(def_id);
            let rustc_hir::def::Res::Def(DefKind::Const, constant) =
                typeck.qpath_res(qpath, expression.hir_id)
            else {
                return None;
            };
            let value = tcx.const_eval_poly(constant).ok()?.try_to_scalar_int()?;
            value.try_to_bits(value.size()).ok()
        }
        _ => None,
    }
}

fn synthetic_match_parent_relation(
    body: &Body<'_>,
    child_group: &MatchSelectionObligation,
    child: &SyntheticMatchGroupPath,
    parent: &SyntheticMatchGroupPath,
) -> bool {
    match (child_group.parent_site, child_group.parent_arm_index) {
        (Some("scrutinee"), None) => {
            block_reaches(body, child.start, parent.start)
                && !block_reaches(body, parent.start, child.start)
        }
        (Some("body"), Some(index)) => parent.arms.get(index).is_some_and(|arm| {
            // Exclusive membership cannot bar re-entry through the parent's
            // start: inside a loop (serde's visit_map key dispatch) the back
            // edge re-enters each arm without revisiting the recorded group
            // start. What holds in every shape is that any other arm's path
            // to a block inside this arm's body must pass through THIS arm's
            // entry — so exclusivity bars that entry instead.
            block_reaches(body, arm.entry, child.start)
                && parent.arms.iter().enumerate().all(|(other, other_arm)| {
                    other == index
                        || !block_reaches_avoiding(body, other_arm.entry, child.start, arm.entry)
                })
        }),
        (Some("guard"), Some(index)) => parent.arms.get(index).is_some_and(|arm| {
            arm.guard_candidate.is_some_and(|candidate| {
                block_reaches(body, candidate, child.start)
                    && block_reaches(body, child.start, arm.entry)
                    && arm
                        .rejection
                        .is_some_and(|rejection| block_reaches(body, child.start, rejection))
            })
        }),
        _ => false,
    }
}

fn synthetic_match_assignments<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    body: &Body<'tcx>,
    groups: &[&MatchSelectionObligation],
) -> Result<BTreeMap<String, SyntheticMatchGroupPath>, String> {
    let candidates = groups
        .iter()
        .map(|group| {
            (
                group.identity.id.clone(),
                synthetic_match_candidates(tcx, crate_name, body, group),
            )
        })
        .collect::<BTreeMap<_, _>>();
    if let Some((group_id, paths)) = candidates.iter().find(|(_, paths)| paths.is_empty()) {
        let group = groups
            .iter()
            .find(|group| &group.identity.id == group_id)
            .expect("empty candidate list came from a known group");
        let false_edges = body
            .basic_blocks
            .iter_enumerated()
            .filter_map(|(block, data)| match data.terminator().kind {
                TerminatorKind::FalseEdge { .. } => Some((
                    block,
                    stable_source_range(
                        tcx,
                        data.terminator().source_info.span.source_callsite(),
                        crate_name,
                    )
                    .map(|source| (source.start, source.end))
                    .ok(),
                )),
                _ => None,
            })
            .collect::<Vec<_>>();
        return Err(format!(
            "collapsed match group {group_id} has {} structurally valid arm chains; group={}-{}; arm_patterns={:?}; false_edges={:?}",
            paths.len(),
            group.identity.source.start,
            group.identity.source.end,
            group
                .arms
                .iter()
                .map(|arm| arm
                    .pattern_source
                    .as_ref()
                    .map(|source| (source.start, source.end)))
                .collect::<Vec<_>>(),
            false_edges,
        ));
    }
    // Precompute the sibling ordering inputs once: the strict before-ness
    // matrix over every candidate start, and the ancestor pairs. The search
    // may have to visit the complete assignment space when solutions are
    // scarce, so its inner checks must be pure lookups.
    let candidate_starts = candidates
        .values()
        .flatten()
        .map(|path| path.start)
        .collect::<BTreeSet<_>>();
    let before = candidate_starts
        .iter()
        .flat_map(|first| {
            candidate_starts.iter().map(move |second| {
                (
                    (first.as_u32(), second.as_u32()),
                    first != second && semantically_before(body, *first, *second),
                )
            })
        })
        .collect::<BTreeMap<_, _>>();
    let mut related = BTreeSet::new();
    for group in groups {
        let mut current = group.parent_group_id.as_deref();
        while let Some(id) = current {
            related.insert((group.identity.id.clone(), id.to_owned()));
            related.insert((id.to_owned(), group.identity.id.clone()));
            current = groups
                .iter()
                .find(|candidate| candidate.identity.id == id)
                .and_then(|candidate| candidate.parent_group_id.as_deref());
        }
    }
    #[allow(clippy::too_many_arguments)]
    fn recurse(
        body: &Body<'_>,
        groups: &[&MatchSelectionObligation],
        candidates: &BTreeMap<String, Vec<SyntheticMatchGroupPath>>,
        before: &BTreeMap<(u32, u32), bool>,
        related: &BTreeSet<(String, String)>,
        index: usize,
        used_starts: &mut BTreeSet<u32>,
        current: &mut BTreeMap<String, SyntheticMatchGroupPath>,
        solutions: &mut Vec<BTreeMap<String, SyntheticMatchGroupPath>>,
    ) {
        if solutions.len() > 1 {
            return;
        }
        if index == groups.len() {
            let valid = groups.iter().all(|group| {
                let Some(parent_id) = &group.parent_group_id else {
                    return true;
                };
                let (Some(child), Some(parent)) =
                    (current.get(&group.identity.id), current.get(parent_id))
                else {
                    if std::env::var_os("SUPERCOV_RUST_DEBUG_MATCH_ASSIGN").is_some() {
                        eprintln!(
                            "[assign-debug] complete assignment missing parent binding: child={} parent={parent_id}",
                            group.identity.id
                        );
                    }
                    return false;
                };
                let held = synthetic_match_parent_relation(body, group, child, parent);
                if !held && std::env::var_os("SUPERCOV_RUST_DEBUG_MATCH_ASSIGN").is_some() {
                    eprintln!(
                        "[assign-debug] parent relation failed: child={} at {:?} parent={} at {:?} arm={:?}",
                        group.identity.id,
                        child.start,
                        parent_id,
                        parent.start,
                        group.parent_arm_index
                    );
                }
                held
            });
            if valid {
                solutions.push(current.clone());
            }
            return;
        }
        let group = groups[index];
        for candidate in &candidates[&group.identity.id] {
            if !used_starts.insert(candidate.start.as_u32()) {
                continue;
            }
            // Structurally identical same-source sibling groups (repeated
            // macro expansions) permute freely under parent constraints
            // alone. Comparable UNRELATED pairs must follow HIR visit order
            // (precomputed strict before-ness: one-way reachability ordered,
            // dominance breaking loop ties). Nested pairs are exactly
            // constrained by their parent relation instead — a
            // scrutinee-nested child executes before its parent despite the
            // later visit order.
            let ordered = groups[..index].iter().all(|earlier| {
                if earlier.identity.source != group.identity.source
                    || related.contains(&(earlier.identity.id.clone(), group.identity.id.clone()))
                {
                    return true;
                }
                let Some(earlier_path) = current.get(&earlier.identity.id) else {
                    return true;
                };
                let source_order =
                    earlier.identity.owner_local_ordinal < group.identity.owner_local_ordinal;
                let forward = before[&(earlier_path.start.as_u32(), candidate.start.as_u32())];
                let backward = before[&(candidate.start.as_u32(), earlier_path.start.as_u32())];
                if forward == backward {
                    return true;
                }
                source_order == forward
            });
            if !ordered {
                used_starts.remove(&candidate.start.as_u32());
                continue;
            }
            current.insert(group.identity.id.clone(), candidate.clone());
            recurse(
                body,
                groups,
                candidates,
                before,
                related,
                index + 1,
                used_starts,
                current,
                solutions,
            );
            current.remove(&group.identity.id);
            used_starts.remove(&candidate.start.as_u32());
        }
    }
    if std::env::var_os("SUPERCOV_RUST_DEBUG_MATCH_ASSIGN").is_some() {
        for (block, data) in body.basic_blocks.iter_enumerated() {
            eprintln!(
                "[assign-debug] cfg {block:?}: {:?} -> {:?}",
                std::mem::discriminant(&data.terminator().kind),
                semantic_successors(data.terminator())
            );
        }
    }
    let mut ordered = groups.to_vec();
    ordered.sort_by_key(|group| candidates[&group.identity.id].len());
    let mut solutions = Vec::new();
    recurse(
        body,
        &ordered,
        &candidates,
        &before,
        &related,
        0,
        &mut BTreeSet::new(),
        &mut BTreeMap::new(),
        &mut solutions,
    );
    let [solution] = solutions.as_slice() else {
        let group_diagnostics = groups
            .iter()
            .map(|group| {
                format!(
                    "{{id={}; source={}-{}; ordinal={}; arms={}; parent={:?}/{:?}/{:?}; adts={:?}}}",
                    group.identity.id,
                    group.identity.source.start,
                    group.identity.source.end,
                    group.identity.owner_local_ordinal,
                    group.arms.len(),
                    group.parent_group_id,
                    group.parent_site,
                    group.parent_arm_index,
                    group.pattern_adts,
                )
            })
            .collect::<Vec<_>>();
        return Err(format!(
            "{} collapsed match groups have {} parent-consistent CFG assignments; groups=[{}]; candidates={candidates:?}; solutions={solutions:?}",
            groups.len(),
            solutions.len(),
            group_diagnostics.join(", "),
        ));
    };
    Ok(solution.clone())
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct SyntheticLetElsePath {
    start: BasicBlock,
    matched: BasicBlock,
    fallback: BasicBlock,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct TryOperatorPath {
    start: BasicBlock,
    continued: BasicBlock,
    returned: BasicBlock,
}

fn control_flow_switch_targets<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &Body<'tcx>,
    block: BasicBlock,
) -> Option<(BasicBlock, BasicBlock)> {
    let TerminatorKind::SwitchInt { discr, targets } = &body.basic_blocks[block].terminator().kind
    else {
        return None;
    };
    let discriminant_local = discr.place()?.as_local()?;
    let enum_place = body.basic_blocks[block]
        .statements
        .iter()
        .rev()
        .find_map(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return None;
            };
            let (destination, value) = &**assignment;
            if destination.as_local() != Some(discriminant_local) {
                return None;
            }
            let Rvalue::Discriminant(place) = value else {
                return None;
            };
            Some(*place)
        })?;
    let ty::Adt(definition, _) = enum_place.ty(&body.local_decls, tcx).ty.kind() else {
        return None;
    };
    let continued = tcx.lang_items().cf_continue_variant()?;
    let returned = tcx.lang_items().cf_break_variant()?;
    if tcx.parent(continued) != definition.did() || tcx.parent(returned) != definition.did() {
        return None;
    }
    let continued = definition
        .discriminant_for_variant(tcx, definition.variant_index_with_id(continued))
        .val;
    let returned = definition
        .discriminant_for_variant(tcx, definition.variant_index_with_id(returned))
        .val;
    Some((
        targets.target_for_value(continued),
        targets.target_for_value(returned),
    ))
}

fn try_operator_assignments<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    body: &Body<'tcx>,
    branches: &[&BranchObligation],
    match_assignments: &BTreeMap<String, SyntheticMatchGroupPath>,
) -> Result<BTreeMap<String, TryOperatorPath>, String> {
    let mut branches_by_source = BTreeMap::<(String, u32, u32), Vec<&BranchObligation>>::new();
    for branch in branches {
        branches_by_source
            .entry((
                branch.identity.source.key.clone(),
                branch.identity.source.start,
                branch.identity.source.end,
            ))
            .or_default()
            .push(branch);
    }
    let candidates = body
        .basic_blocks
        .iter_enumerated()
        .filter_map(|(_, data)| {
            let terminator = data.terminator();
            if terminator.source_info.span.desugaring_kind() != Some(DesugaringKind::QuestionMark) {
                return None;
            }
            let TerminatorKind::Call {
                destination,
                target: Some(target),
                ..
            } = terminator.kind
            else {
                return None;
            };
            let ty::Adt(definition, _) = destination.ty(&body.local_decls, tcx).ty.kind() else {
                return None;
            };
            let continued = tcx.lang_items().cf_continue_variant()?;
            let returned = tcx.lang_items().cf_break_variant()?;
            if tcx.parent(continued) != definition.did() || tcx.parent(returned) != definition.did()
            {
                return None;
            }
            let (continued, returned) = control_flow_switch_targets(tcx, body, target)?;
            // A `?` written inside a declarative macro body is owned by that
            // body, so its obligation is keyed there while the callsite points
            // at the macro invocation. The two coincide only for proc-macro
            // output, where source and callsite are the same span. Offer both
            // and let owner matching take whichever the obligation used.
            let callsite = stable_source_range(
                tcx,
                terminator.source_info.span.source_callsite(),
                crate_name,
            )
            .ok();
            let expanded = stable_source_range(tcx, terminator.source_info.span, crate_name).ok();
            let sources = [expanded, callsite]
                .into_iter()
                .flatten()
                .collect::<Vec<_>>();
            (!sources.is_empty()).then_some((
                sources,
                TryOperatorPath {
                    start: target,
                    continued,
                    returned,
                },
            ))
        })
        .collect::<Vec<_>>();
    let mut paths_by_source = BTreeMap::<(String, u32, u32), Vec<TryOperatorPath>>::new();
    for (sources, path) in candidates {
        let owners = branches_by_source
            .iter()
            .filter(|((key, start, end), _)| {
                sources.iter().any(|source| {
                    key == &source.key && *start <= source.start && *end >= source.end
                })
            })
            .collect::<Vec<_>>();
        let Some(minimum_width) = owners
            .iter()
            .map(|((_, start, end), _)| end.saturating_sub(*start))
            .min()
        else {
            continue;
        };
        let exact_owners = owners
            .into_iter()
            .filter(|((_, start, end), _)| end.saturating_sub(*start) == minimum_width)
            .map(|(key, _)| key.clone())
            .collect::<BTreeSet<_>>();
        let exact_owners = exact_owners.into_iter().collect::<Vec<_>>();
        let [owner] = exact_owners.as_slice() else {
            return Err(format!(
                "question-mark path at {:?} has ambiguous authored owners",
                sources
                    .iter()
                    .map(|source| (source.key.as_str(), source.start, source.end))
                    .collect::<Vec<_>>()
            ));
        };
        paths_by_source.entry(owner.clone()).or_default().push(path);
    }
    // Same-source try operators generated in parallel match arms have no CFG
    // order among themselves. Obligations carry their exact lexical arm, and
    // each arm scope with obligations claims exactly the candidates dominated
    // by its bound entry (and by no deeper bound entry); leftovers form the
    // unscoped sequence. Every scope is then ranked independently.
    let bound_arms = match_assignments
        .iter()
        .flat_map(|(group, path)| {
            path.arms
                .iter()
                .enumerate()
                .map(move |(index, arm)| ((group.clone(), index), arm.entry))
        })
        .collect::<BTreeMap<(String, usize), BasicBlock>>();
    let dominators = body.basic_blocks.dominators();
    let mut assignments = BTreeMap::new();
    for (source, source_branches) in branches_by_source {
        let mut source_paths = paths_by_source.remove(&source).unwrap_or_default();
        let mut scoped_branches =
            BTreeMap::<Option<(String, usize)>, Vec<&BranchObligation>>::new();
        for branch in source_branches {
            let scope = branch
                .parent_match_arm
                .clone()
                .filter(|key| bound_arms.contains_key(key));
            scoped_branches.entry(scope).or_default().push(branch);
        }
        let mut scoped = Vec::new();
        for (scope, mut scope_branches) in scoped_branches {
            let scope_paths = match &scope {
                Some(key) => {
                    let entry = bound_arms[key];
                    let claimed = source_paths
                        .iter()
                        .filter(|path| {
                            dominators.dominates(entry, path.start)
                                && !bound_arms.values().any(|other| {
                                    *other != entry
                                        && dominators.dominates(entry, *other)
                                        && dominators.dominates(*other, path.start)
                                })
                        })
                        .copied()
                        .collect::<Vec<_>>();
                    source_paths
                        .retain(|path| !claimed.iter().any(|kept| kept.start == path.start));
                    claimed
                }
                None => Vec::new(),
            };
            scoped.push((scope, std::mem::take(&mut scope_branches), scope_paths));
        }
        // The unscoped obligations take every candidate no arm claimed.
        for (scope, _, scope_paths) in &mut scoped {
            if scope.is_none() {
                scope_paths.append(&mut source_paths);
            }
        }
        if !source_paths.is_empty() {
            return Err(format!(
                "{} unclaimed try-operator selections at {}:{}-{}",
                source_paths.len(),
                source.0,
                source.1,
                source.2
            ));
        }
        for (_, mut scope_branches, mut scope_paths) in scoped {
            scope_branches.sort_by_key(|branch| branch.identity.owner_local_ordinal);
            let rank_by_start = scope_paths
                .iter()
                .map(|candidate| {
                    let rank = scope_paths
                        .iter()
                        .filter(|other| {
                            other.start != candidate.start
                                && semantically_before(body, other.start, candidate.start)
                        })
                        .count();
                    (candidate.start.as_u32(), rank)
                })
                .collect::<BTreeMap<_, _>>();
            scope_paths.sort_by_key(|candidate| rank_by_start[&candidate.start.as_u32()]);
            if scope_branches.len() != scope_paths.len() {
                let control_flow_switches = body
                    .basic_blocks
                    .iter_enumerated()
                    .filter(|(_, data)| {
                        matches!(data.terminator().kind, TerminatorKind::SwitchInt { .. })
                    })
                    .map(|(block, data)| {
                        (
                            block,
                            stable_source_range(
                                tcx,
                                data.terminator().source_info.span,
                                crate_name,
                            )
                            .map(|range| (range.key, range.start, range.end))
                            .ok(),
                        )
                    })
                    .collect::<Vec<_>>();
                let calls = body
                    .basic_blocks
                    .iter_enumerated()
                    .filter_map(|(block, data)| {
                        let terminator = data.terminator();
                        let TerminatorKind::Call { destination, .. } = &terminator.kind else {
                            return None;
                        };
                        let ty = destination.ty(&body.local_decls, tcx).ty;
                        let is_control_flow = matches!(
                            ty.kind(),
                            ty::Adt(definition, _)
                                if tcx.lang_items().cf_continue_variant()
                                    .is_some_and(|variant| tcx.parent(variant) == definition.did())
                        );
                        (is_control_flow).then(|| {
                            (
                                block,
                                format!("{:?}", terminator.source_info.span.desugaring_kind()),
                                terminator.source_info.span.from_expansion(),
                            )
                        })
                    })
                    .collect::<Vec<_>>();
                return Err(format!(
                    "{} try-operator obligations at {}:{}-{} map to {} ControlFlow selections; branches={:?}; every switch in body={:?}",
                    scope_branches.len(),
                    source.0,
                    source.1,
                    source.2,
                    scope_paths.len(),
                    scope_branches
                        .iter()
                        .map(|branch| branch.identity.id.as_str())
                        .collect::<Vec<_>>(),
                    control_flow_switches,
                ) + &format!(
                    "; ControlFlow calls (block, desugaring, from_expansion)={calls:?}"
                ));
            }
            let ranks = scope_paths
                .iter()
                .map(|candidate| {
                    scope_paths
                        .iter()
                        .filter(|other| {
                            other.start != candidate.start
                                && semantically_before(body, other.start, candidate.start)
                        })
                        .count()
                })
                .collect::<Vec<_>>();
            if ranks.iter().enumerate().any(|(index, rank)| index != *rank) {
                return Err(format!(
                    "try-operator selections at {}:{}-{} have no total semantic order",
                    source.0, source.1, source.2
                ));
            }
            assignments.extend(
                scope_branches
                    .into_iter()
                    .zip(scope_paths)
                    .map(|(branch, path)| (branch.identity.id.clone(), path)),
            );
        }
    }
    Ok(assignments)
}

fn structural_decision_condition_marker_assignments<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    body: &Body<'tcx>,
    decisions: &[&DecisionObligation],
    match_assignments: &BTreeMap<String, SyntheticMatchGroupPath>,
    allow_constant_discriminants: bool,
    subject: &str,
) -> Result<Vec<(String, usize, BasicBlock)>, String> {
    let mut conditions_by_source =
        BTreeMap::<(String, u32, u32), Vec<(&DecisionObligation, usize)>>::new();
    for decision in decisions {
        for (index, condition) in decision.conditions.iter().enumerate() {
            if condition.opaque_authored_macro {
                continue;
            }
            conditions_by_source
                .entry((
                    condition.branch_source.key.clone(),
                    condition.branch_source.start,
                    condition.branch_source.end,
                ))
                .or_default()
                .push((decision, index));
        }
    }
    if conditions_by_source.is_empty() {
        return Ok(Vec::new());
    }
    let mut blocks_by_source = BTreeMap::<(String, u32, u32), Vec<BasicBlock>>::new();
    let mut pattern_blocks_by_source = BTreeMap::<(String, u32, u32), Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        let terminator = data.terminator();
        let TerminatorKind::SwitchInt { discr, targets } = &terminator.kind else {
            continue;
        };
        // A refutable pattern condition (`while let`) selects through a
        // two-way discriminant switch instead of a typed Boolean switch, and
        // must test the condition pattern's exact ADT — sibling two-variant
        // discriminant switches (serde field dispatch) share the shape.
        let switch_adt = || -> Option<String> {
            let local = match discr {
                Operand::Copy(place) | Operand::Move(place) => place.as_local()?,
                _ => return None,
            };
            data.statements.iter().rev().find_map(|statement| {
                let StatementKind::Assign(assignment) = &statement.kind else {
                    return None;
                };
                let Rvalue::Discriminant(place) = &assignment.1 else {
                    return None;
                };
                if assignment.0.as_local() != Some(local) {
                    return None;
                }
                place
                    .ty(&body.local_decls, tcx)
                    .ty
                    .peel_refs()
                    .ty_adt_def()
                    .map(|adt| tcx.def_path_str(adt.did()))
            })
        };
        let pattern_switch =
            discr.ty(&body.local_decls, tcx) != tcx.types.bool && targets.iter().count() == 1;
        if discr.ty(&body.local_decls, tcx) != tcx.types.bool && !pattern_switch {
            continue;
        }
        let discriminant_is_constant = match discr {
            Operand::Constant(_) => true,
            Operand::Copy(place) | Operand::Move(place) => place.as_local().is_some_and(|local| {
                data.statements.iter().rev().any(|statement| {
                    let StatementKind::Assign(assignment) = &statement.kind else {
                        return false;
                    };
                    let (destination, value) = &**assignment;
                    destination.as_local() == Some(local)
                        && matches!(value, Rvalue::Use(Operand::Constant(_)))
                })
            }),
            Operand::RuntimeChecks(_) => false,
        };
        let source = stable_source_range(tcx, terminator.source_info.span, crate_name)?;
        let callsite = stable_source_range(
            tcx,
            terminator.source_info.span.source_callsite(),
            crate_name,
        )?;
        let owners = conditions_by_source
            .keys()
            .filter(|(key, start, end)| {
                [&source, &callsite].iter().any(|candidate| {
                    key == &candidate.key && *start <= candidate.start && *end >= candidate.end
                })
            })
            .collect::<Vec<_>>();
        let Some(minimum_width) = owners
            .iter()
            .map(|(_, start, end)| end.saturating_sub(*start))
            .min()
        else {
            continue;
        };
        let exact = owners
            .into_iter()
            .filter(|(_, start, end)| end.saturating_sub(*start) == minimum_width)
            .cloned()
            .collect::<BTreeSet<_>>();
        let exact = exact.into_iter().collect::<Vec<_>>();
        let [owner] = exact.as_slice() else {
            return Err(format!(
                "{subject} condition at {}:{}-{} has ambiguous authored owners",
                callsite.key, callsite.start, callsite.end
            ));
        };
        if discriminant_is_constant && !allow_constant_discriminants {
            let is_authored_condition = conditions_by_source[owner]
                .iter()
                .all(|(decision, index)| decision.conditions[*index].authored_expression);
            if !is_authored_condition {
                continue;
            }
        }
        if pattern_switch {
            let tested = switch_adt();
            let pattern_adts = conditions_by_source[owner]
                .iter()
                .filter_map(|(decision, index)| decision.conditions[*index].pattern_adt.as_deref())
                .collect::<BTreeSet<_>>();
            if tested
                .as_deref()
                .is_none_or(|tested| pattern_adts.contains(tested))
            {
                pattern_blocks_by_source
                    .entry(owner.clone())
                    .or_default()
                    .push(block);
            }
        } else {
            blocks_by_source
                .entry(owner.clone())
                .or_default()
                .push(block);
        }
    }
    let mut assignments = Vec::new();
    for (source, all_conditions) in conditions_by_source {
        // Let-pattern conditions (`while let`, `if let`, let-chain lets)
        // pair with discriminant switches; every other condition pairs with
        // typed Boolean switches. Each class is ranked and zipped
        // independently within the source.
        let (pattern_conditions, boolean_conditions): (Vec<_>, Vec<_>) = all_conditions
            .into_iter()
            .partition(|(decision, index)| decision.conditions[*index].pattern_adt.is_some());
        // Same-source conditions generated in parallel match arms have no
        // CFG order among themselves. Scope each class's conditions by their
        // exact lexical arm; each bound arm entry claims only the switches it
        // dominates (excluding deeper bound entries) when it has conditions,
        // and the unscoped remainder ranks sequentially.
        let bound_arms = match_assignments
            .iter()
            .flat_map(|(group, path)| {
                path.arms
                    .iter()
                    .enumerate()
                    .map(move |(index, arm)| ((group.clone(), index), arm.entry))
            })
            .collect::<BTreeMap<(String, usize), BasicBlock>>();
        let dominators = body.basic_blocks.dominators();
        let mut class_pools = Vec::new();
        for (class_conditions, class_blocks) in [
            (
                boolean_conditions,
                blocks_by_source.remove(&source).unwrap_or_default(),
            ),
            (
                pattern_conditions,
                pattern_blocks_by_source.remove(&source).unwrap_or_default(),
            ),
        ] {
            if class_conditions.is_empty() && class_blocks.is_empty() {
                continue;
            }
            let mut scoped_conditions =
                BTreeMap::<Option<(String, usize)>, Vec<(&DecisionObligation, usize)>>::new();
            for (decision, index) in class_conditions {
                let scope = decision
                    .parent_match_arm
                    .clone()
                    .filter(|key| bound_arms.contains_key(key));
                scoped_conditions
                    .entry(scope)
                    .or_default()
                    .push((decision, index));
            }
            let mut remaining_blocks = class_blocks;
            let mut scoped = Vec::new();
            for (scope, scope_conditions) in scoped_conditions {
                let scope_blocks = match &scope {
                    Some(key) => {
                        let entry = bound_arms[key];
                        let claimed = remaining_blocks
                            .iter()
                            .copied()
                            .filter(|block| {
                                dominators.dominates(entry, *block)
                                    && !bound_arms.values().any(|other| {
                                        *other != entry
                                            && dominators.dominates(entry, *other)
                                            && dominators.dominates(*other, *block)
                                    })
                            })
                            .collect::<Vec<_>>();
                        remaining_blocks.retain(|block| !claimed.contains(block));
                        claimed
                    }
                    None => Vec::new(),
                };
                scoped.push((scope, scope_conditions, scope_blocks));
            }
            let mut unscoped_present = false;
            for (scope, _, scope_blocks) in &mut scoped {
                if scope.is_none() {
                    unscoped_present = true;
                    scope_blocks.append(&mut remaining_blocks);
                }
            }
            if !unscoped_present && !remaining_blocks.is_empty() {
                scoped.push((None, Vec::new(), std::mem::take(&mut remaining_blocks)));
            }
            class_pools.extend(scoped);
        }
        for (_, mut source_conditions, mut blocks) in class_pools {
            source_conditions
                .sort_by_key(|(decision, index)| (decision.identity.owner_local_ordinal, *index));
            let rank_by_block = blocks
                .iter()
                .map(|candidate| {
                    let rank = blocks
                        .iter()
                        .filter(|other| {
                            other != &candidate && semantically_before(body, **other, *candidate)
                        })
                        .count();
                    (candidate.as_u32(), rank)
                })
                .collect::<BTreeMap<_, _>>();
            blocks.sort_by_key(|block| rank_by_block[&block.as_u32()]);
            if source_conditions.len() != blocks.len() {
                return Err(format!(
                    "{} {subject} conditions at {}:{}-{} map to {} typed Boolean switches; conditions={:?}",
                    source_conditions.len(),
                    source.0,
                    source.1,
                    source.2,
                    blocks.len(),
                    source_conditions
                        .iter()
                        .map(|(decision, index)| (
                            decision.identity.id.as_str(),
                            decision.decision_kind,
                            *index,
                            decision.conditions[*index].text.as_str(),
                        ))
                        .collect::<Vec<_>>(),
                ));
            }
            let ranks = blocks
                .iter()
                .map(|candidate| {
                    blocks
                        .iter()
                        .filter(|other| {
                            other != &candidate && semantically_before(body, **other, *candidate)
                        })
                        .count()
                })
                .collect::<Vec<_>>();
            if ranks.iter().enumerate().any(|(index, rank)| index != *rank) {
                return Err(format!(
                    "{subject} conditions at {}:{}-{} have no total semantic order",
                    source.0, source.1, source.2
                ));
            }
            assignments.extend(
                source_conditions
                    .into_iter()
                    .zip(blocks)
                    .map(|((decision, index), block)| (decision.identity.id.clone(), index, block)),
            );
        }
    }
    Ok(assignments)
}

fn opaque_authored_condition_marker_assignments<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    body: &Body<'tcx>,
    decisions: &[&DecisionObligation],
) -> Result<Vec<(String, usize, BasicBlock)>, String> {
    let mut assignments = Vec::new();
    for decision in decisions {
        for (condition_index, condition) in decision.conditions.iter().enumerate() {
            if !condition.opaque_authored_macro {
                continue;
            }
            let mut switches = body
                .basic_blocks
                .iter_enumerated()
                .filter_map(|(block, data)| {
                    let terminator = data.terminator();
                    let TerminatorKind::SwitchInt { discr, .. } = &terminator.kind else {
                        return None;
                    };
                    if discr.ty(&body.local_decls, tcx) != tcx.types.bool {
                        return None;
                    }
                    let source =
                        stable_source_range(tcx, terminator.source_info.span, crate_name).ok()?;
                    let callsite = stable_source_range(
                        tcx,
                        terminator.source_info.span.source_callsite(),
                        crate_name,
                    )
                    .ok()?;
                    [&source, &callsite]
                        .iter()
                        .any(|candidate| source_range_contains(&condition.branch_source, candidate))
                        .then_some(block)
                })
                .collect::<Vec<_>>();
            switches.sort();
            switches.dedup();
            let results = switches
                .iter()
                .copied()
                .filter(|candidate| {
                    switches
                        .iter()
                        .all(|other| other == candidate || block_reaches(body, *other, *candidate))
                })
                .collect::<Vec<_>>();
            let [result] = results.as_slice() else {
                return Err(format!(
                    "opaque authored decision {} condition {} at {}:{}-{} has {} Boolean switches and {} unique terminal result switches",
                    decision.identity.id,
                    condition_index,
                    condition.branch_source.key,
                    condition.branch_source.start,
                    condition.branch_source.end,
                    switches.len(),
                    results.len()
                ));
            };
            assignments.push((decision.identity.id.clone(), condition_index, *result));
        }
    }
    Ok(assignments)
}

fn source_range_contains(owner: &StableSourceRange, candidate: &StableSourceRange) -> bool {
    owner.key == candidate.key && owner.start <= candidate.start && owner.end >= candidate.end
}

fn assertion_span_matches(
    tcx: TyCtxt<'_>,
    crate_name: &str,
    owner: &StableSourceRange,
    span: rustc_span::Span,
) -> bool {
    [span, span.source_callsite()].into_iter().any(|candidate| {
        stable_source_range(tcx, candidate, crate_name)
            .is_ok_and(|candidate| source_range_contains(owner, &candidate))
    })
}

fn assertion_context_marker_tag(decision_id: &str, suspension: usize, kind: &str) -> u64 {
    let mut hash = Sha256::new();
    hash.update(b"supercov-rust-assertion-context-marker-v1\0");
    hash.update(decision_id.as_bytes());
    hash.update(b"\0");
    hash.update((suspension as u64).to_be_bytes());
    hash.update(b"\0");
    hash.update(kind.as_bytes());
    u64::from_be_bytes(hash.finalize()[..8].try_into().expect("SHA-256 prefix"))
}

// The binder threads compiler state — tcx, def id, crate name, body,
// output buffers — and grouping it into a struct is the abstract-CFG
// extraction tracked separately, not a rename to satisfy a lint.
#[allow(clippy::too_many_arguments)]
fn assertion_context_marker_block<'tcx>(
    tcx: TyCtxt<'tcx>,
    marker_function: LocalDefId,
    tag: u64,
    context: Local,
    previous: Local,
    unit: Local,
    target: BasicBlock,
    cleanup: bool,
) -> (AssertionContextMarkerPair, BasicBlockData<'tcx>) {
    let block = runtime_call_block(
        tcx,
        marker_function,
        [
            Operand::const_from_scalar(tcx, tcx.types.u64, Scalar::from_u64(tag), DUMMY_SP),
            Operand::Copy(Place::from(context)),
            Operand::Copy(Place::from(previous)),
        ]
        .into_iter(),
        Place::from(unit),
        target,
        DUMMY_SP,
        cleanup,
    );
    (AssertionContextMarkerPair { tag }, block)
}

fn install_assertion_phase_markers<'tcx>(
    tcx: TyCtxt<'tcx>,
    crate_name: &str,
    definition: &str,
    body: &mut Body<'tcx>,
    decisions: &[&DecisionObligation],
    points: &BTreeMap<String, PointObligation>,
    context_marker: LocalDefId,
) -> Result<Vec<AssertionPhaseMarker>, String> {
    let mut decisions = decisions.to_vec();
    decisions.sort_by_key(|decision| {
        let source = decision
            .assertion_source
            .as_ref()
            .expect("assertion decisions have a phase source");
        (
            source.end.saturating_sub(source.start),
            source.start,
            decision.identity.owner_local_ordinal,
        )
    });
    let mut markers = Vec::new();
    for decision in decisions {
        let source = decision
            .assertion_source
            .as_ref()
            .ok_or_else(|| format!("assertion {} has no phase source", decision.identity.id))?;
        let statement_points = points
            .iter()
            .filter(|(_, point)| {
                point.point_kind == "statement"
                    && point.source == *source
                    && point
                        .definitions
                        .iter()
                        .any(|candidate| candidate == definition)
            })
            .collect::<Vec<_>>();
        if statement_points.len() > 1 {
            return Err(format!(
                "assertion {} in {definition} maps to {} exact statement obligations: {}",
                decision.identity.id,
                statement_points.len(),
                statement_points
                    .iter()
                    .map(|(id, point)| format!("{id} ({})", point.discriminator))
                    .collect::<Vec<_>>()
                    .join(", ")
            ));
        }
        let statement_ordinal = statement_points
            .first()
            .map(|(_, point)| point.probe_ordinal);
        let region = body
            .basic_blocks
            .iter_enumerated()
            .filter_map(|(block, data)| {
                data.statements
                    .iter()
                    .any(|statement| {
                        assertion_span_matches(tcx, crate_name, source, statement.source_info.span)
                    })
                    .then_some(block)
                    .or_else(|| {
                        assertion_span_matches(
                            tcx,
                            crate_name,
                            source,
                            data.terminator().source_info.span,
                        )
                        .then_some(block)
                    })
            })
            .collect::<BTreeSet<_>>();
        if region.is_empty() {
            return Err(format!(
                "assertion {} has no built-MIR source region",
                decision.identity.id
            ));
        }
        let entries = region
            .iter()
            .copied()
            .filter(|block| {
                *block == rustc_middle::mir::START_BLOCK
                    || body.basic_blocks.predecessors()[*block]
                        .iter()
                        .all(|predecessor| !region.contains(predecessor))
            })
            .collect::<Vec<_>>();
        let [entry] = entries.as_slice() else {
            return Err(format!(
                "assertion {} has {} built-MIR region entries",
                decision.identity.id,
                entries.len()
            ));
        };
        let yield_paths = region
            .iter()
            .copied()
            .filter_map(|block| {
                if let TerminatorKind::Yield { resume, .. } =
                    &body.basic_blocks[block].terminator().kind
                {
                    Some((block, *resume))
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();
        let suspension_locals = if yield_paths.is_empty() {
            None
        } else {
            Some((
                body.local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP)),
                body.local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP)),
                body.local_decls
                    .push(LocalDecl::new(tcx.types.unit, DUMMY_SP)),
            ))
        };
        let mut suspensions = Vec::new();
        for (suspension_index, (block, resume)) in yield_paths.into_iter().enumerate() {
            let (previous, assertion_context, marker_unit) = suspension_locals
                .expect("assertion yield path must have persistent context locals");
            let (resume_marker, resume_data) = assertion_context_marker_block(
                tcx,
                context_marker,
                assertion_context_marker_tag(&decision.identity.id, suspension_index, "resume"),
                assertion_context,
                previous,
                marker_unit,
                resume,
                body.basic_blocks[resume].is_cleanup,
            );
            let resume_bridge = body.basic_blocks_mut().push(resume_data);

            let cleanup = body.basic_blocks[block].is_cleanup;
            let original = body.basic_blocks_mut()[block]
                .terminator
                .take()
                .ok_or_else(|| "assertion suspension block has no yield".to_owned())?;
            let mut yielded = BasicBlockData::new(Some(original), cleanup);
            let TerminatorKind::Yield { resume, .. } = &mut yielded.terminator_mut().kind else {
                return Err("assertion suspension ceased to be a yield".into());
            };
            *resume = resume_bridge;
            let yielded = body.basic_blocks_mut().push(yielded);
            let (suspend, suspend_data) = assertion_context_marker_block(
                tcx,
                context_marker,
                assertion_context_marker_tag(&decision.identity.id, suspension_index, "suspend"),
                assertion_context,
                previous,
                marker_unit,
                yielded,
                cleanup,
            );
            body.basic_blocks_mut()[block]
                .statements
                .extend(suspend_data.statements);
            body.basic_blocks_mut()[block].terminator = suspend_data.terminator;
            suspensions.push(AssertionSuspensionMarker {
                suspend,
                resume: resume_marker,
            });
        }
        let entry_index = body.basic_blocks[*entry]
            .statements
            .iter()
            .position(|statement| {
                assertion_span_matches(tcx, crate_name, source, statement.source_info.span)
            })
            .unwrap_or(body.basic_blocks[*entry].statements.len());
        let entry_local = body
            .local_decls
            .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
        let (tail, terminator, cleanup) = {
            let data = &mut body.basic_blocks_mut()[*entry];
            let tail = data.statements.split_off(entry_index);
            let terminator = data
                .terminator
                .take()
                .ok_or_else(|| "assertion entry block has no terminator".to_owned())?;
            (tail, terminator, data.is_cleanup)
        };
        let mut continuation_data = BasicBlockData::new(Some(terminator), cleanup);
        continuation_data.statements = tail;
        let continuation = body.basic_blocks_mut().push(continuation_data);
        if let Some((previous, assertion_context, _)) = suspension_locals {
            body.basic_blocks_mut()[*entry]
                .statements
                .push(match_arm_marker_statement(tcx, previous, 0));
            body.basic_blocks_mut()[*entry]
                .statements
                .push(match_arm_marker_statement(tcx, assertion_context, 0));
        }
        body.basic_blocks_mut()[*entry]
            .statements
            .push(match_arm_marker_statement(tcx, entry_local, 0));
        body.basic_blocks_mut()[*entry].terminator = Some(Terminator {
            source_info: SourceInfo::outermost(DUMMY_SP),
            kind: TerminatorKind::Goto {
                target: continuation,
            },
        });
        markers.push(AssertionPhaseMarker {
            local: entry_local.as_u32(),
            decision_id: decision.identity.id.clone(),
            statement_ordinal,
            suspensions,
        });
    }
    Ok(markers)
}

fn synthetic_let_else_assignments(
    tcx: TyCtxt<'_>,
    crate_name: &str,
    body: &Body<'_>,
    branches: &[&BranchObligation],
) -> Result<BTreeMap<String, SyntheticLetElsePath>, String> {
    let mut branches_by_source = BTreeMap::<(String, u32, u32), Vec<&BranchObligation>>::new();
    for branch in branches {
        branches_by_source
            .entry((
                branch.identity.source.key.clone(),
                branch.identity.source.start,
                branch.identity.source.end,
            ))
            .or_default()
            .push(branch);
    }
    let false_edges = body
        .basic_blocks
        .iter_enumerated()
        .filter_map(|(start, data)| match data.terminator().kind {
            TerminatorKind::FalseEdge {
                real_target,
                imaginary_target,
            } => stable_source_range(
                tcx,
                data.terminator().source_info.span.source_callsite(),
                crate_name,
            )
            .ok()
            .map(|source| {
                (
                    (source.key, source.start, source.end),
                    SyntheticLetElsePath {
                        start,
                        matched: real_target,
                        fallback: imaginary_target,
                    },
                )
            }),
            _ => None,
        })
        .fold(
            BTreeMap::<(String, u32, u32), Vec<SyntheticLetElsePath>>::new(),
            |mut grouped, (source, path)| {
                grouped.entry(source).or_default().push(path);
                grouped
            },
        );
    let mut assignments = BTreeMap::new();
    for (source, mut source_branches) in branches_by_source {
        let mut candidates = false_edges.get(&source).cloned().unwrap_or_default();
        source_branches.sort_by_key(|branch| branch.identity.owner_local_ordinal);
        let rank_by_start = candidates
            .iter()
            .map(|candidate| {
                let rank = candidates
                    .iter()
                    .filter(|other| {
                        other.start != candidate.start
                            && semantically_before(body, other.start, candidate.start)
                    })
                    .count();
                (candidate.start.as_u32(), rank)
            })
            .collect::<BTreeMap<_, _>>();
        candidates.sort_by_key(|candidate| rank_by_start[&candidate.start.as_u32()]);
        if source_branches.len() != candidates.len() {
            return Err(format!(
                "{} synthetic let-else obligations at {}:{}-{} map to {} final pattern edges",
                source_branches.len(),
                source.0,
                source.1,
                source.2,
                candidates.len()
            ));
        }
        let ranks = candidates
            .iter()
            .map(|candidate| {
                candidates
                    .iter()
                    .filter(|other| {
                        other.start != candidate.start
                            && semantically_before(body, other.start, candidate.start)
                    })
                    .count()
            })
            .collect::<Vec<_>>();
        if ranks.iter().enumerate().any(|(index, rank)| index != *rank) {
            return Err(format!(
                "synthetic let-else edges at {}:{}-{} have no total semantic order",
                source.0, source.1, source.2
            ));
        }
        assignments.extend(
            source_branches
                .into_iter()
                .zip(candidates)
                .map(|(branch, candidate)| (branch.identity.id.clone(), candidate)),
        );
    }
    Ok(assignments)
}

fn match_arm_marker_statement<'tcx>(
    tcx: TyCtxt<'tcx>,
    marker_local: rustc_middle::mir::Local,
    ordinal: u64,
) -> Statement<'tcx> {
    Statement::new(
        SourceInfo::outermost(DUMMY_SP),
        StatementKind::Assign(Box::new((
            Place::from(marker_local),
            Rvalue::Use(Operand::const_from_scalar(
                tcx,
                tcx.types.u64,
                Scalar::from_u64(ordinal),
                DUMMY_SP,
            )),
        ))),
    )
}

/// Record obligations that could not be bound exactly, instead of failing the
/// compilation.
///
/// Supercov's guarantee is that every reported number is either exact or
/// explicitly unmeasured — never silently approximate. When a body's
/// obligations cannot be bound, the honest outcome is to leave that body
/// uninstrumented and record precisely what lost measurement and why, so the
/// report can separate "not covered" from "not measured". An arbitrary
/// codebase then always compiles; only its unbindable shapes go unmeasured.
///
/// Under `SUPERCOV_RUST_STRICT_BINDING` this fails the build instead.
/// Supercov's own gates set it so every unbindable shape stays a hard signal
/// and the corpus keeps proving exactness rather than silently degrading.
/// Which obligations a failed phase actually cost.
///
/// The distinction is a property of the call site, not of the phase name: a
/// phase that degrades its plan list to empty leaves the rest of the body
/// instrumented and firing, while a phase that returns the pristine body — or
/// that continues with a partially instrumented one — costs everything. Two
/// `bind ...` sites abandon the body and two `inject ...` sites do not, so the
/// scope is stated explicitly rather than derived from the phase text.
#[derive(Clone, Copy, PartialEq, Eq)]
enum DeclineScope {
    /// No probe of any kind can be trusted in this body.
    Body,
    Statements,
    Decisions,
    Matches,
    Branches,
}

fn degrade_unbound_obligations(
    scope: DeclineScope,
    tcx: TyCtxt<'_>,
    def_id: LocalDefId,
    phase: &str,
    definition: &str,
    error: &str,
) {
    // A construct that is not in this build cannot be bound by anyone, so it
    // is never a binder defect and never fails strict binding. It is still
    // declined: unmeasurable is not the same as uncovered.
    let unmeasurable = error.contains(UNMEASURABLE);
    if !unmeasurable && env::var_os(STRICT_BINDING).is_some_and(|value| !value.is_empty()) {
        tcx.dcx().fatal(format!(
            "Supercov could not {phase} in {definition}: {error}"
        ));
    }
    let kind = if unmeasurable {
        "RUST_OBLIGATION_NOT_COMPILED"
    } else {
        "RUST_OBLIGATION_UNBOUND"
    };
    BINDER_LIMITATIONS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .insert(format!("{kind}: {phase} in {definition}: {error}"));
    // An uncompiled construct is identified exactly, so decline just it. The
    // rest of the body bound normally and stays measured.
    if let Some(id) = unmeasurable_obligation(error) {
        UNMEASURED_OBLIGATIONS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(id.to_owned());
        return;
    }
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return;
    };
    // A decision owns the branches carrying its outcome, loop back edge and
    // logical selections, and a match group owns its arms' branches and guard
    // decisions. Those are instrumented from the owner's plan, so they are
    // declined with their owner and stay measured without it.
    let decision_owned = |unmeasured: &mut BTreeSet<String>| {
        for (id, decision) in &obligations.decisions {
            unmeasured.insert(id.clone());
            unmeasured.insert(decision.outcome_branch_id.clone());
            unmeasured.extend(decision.loop_branch_id.clone());
            unmeasured.extend(
                decision
                    .logical_selections
                    .iter()
                    .map(|selection| selection.branch_id.clone()),
            );
        }
    };
    let match_owned = |unmeasured: &mut BTreeSet<String>| {
        for (id, group) in &obligations.match_groups {
            unmeasured.insert(id.clone());
            for arm in &group.arms {
                unmeasured.insert(arm.branch_id.clone());
                unmeasured.extend(arm.guard_decision_id.clone());
            }
        }
    };
    let mut unmeasured = UNMEASURED_OBLIGATIONS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    match scope {
        DeclineScope::Statements => unmeasured.extend(obligations.points.keys().cloned()),
        DeclineScope::Decisions => decision_owned(&mut unmeasured),
        DeclineScope::Matches => match_owned(&mut unmeasured),
        DeclineScope::Branches => {
            // Every branch this body records except the ones a decision or
            // match group owns: those bound from a different plan list, which
            // this failure did not touch.
            let mut owned = BTreeSet::new();
            decision_owned(&mut owned);
            match_owned(&mut owned);
            unmeasured.extend(
                obligations
                    .branches
                    .keys()
                    .filter(|id| !owned.contains(*id))
                    .cloned(),
            );
        }
        DeclineScope::Body => {
            unmeasured.extend(obligations.points.keys().cloned());
            unmeasured.extend(obligations.branches.keys().cloned());
            unmeasured.extend(obligations.decisions.keys().cloned());
            unmeasured.extend(obligations.match_groups.keys().cloned());
            // The function obligation occupies owner-local ordinal zero and is
            // recorded outside the per-body collector, so it needs declining
            // explicitly: an uninstrumented body never fires its entry probe
            // either. Every narrower scope leaves the body instrumented, so
            // the entry probe still fires there.
            if let Ok(identity) = function_identity(
                tcx,
                def_id.to_def_id(),
                tcx.def_span(def_id),
                &obligations.crate_name,
            ) {
                unmeasured.insert(identity.id);
            }
        }
    }
}

fn mir_built_with_match_markers<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
) -> &'tcx Steal<Body<'tcx>> {
    let original = ORIGINAL_MIR_BUILT
        .get()
        .expect("original mir_built provider");
    let body = original(tcx, def_id);
    if env::var_os(INSTRUMENT_MIR).is_none() || tcx.dcx().has_errors().is_some() {
        return body;
    }
    rustc_middle::ty::print::with_no_trimmed_paths!({
        let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
            return body;
        };
        if let Some(forced) = env::var_os(FORCE_UNBINDABLE)
            && !forced.is_empty()
            && obligations
                .definition
                .contains(&forced.to_string_lossy().into_owned())
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "bind injected unbindable shape",
                &obligations.definition,
                "SUPERCOV_RUST_FORCE_UNBINDABLE fault injection",
            );
            return body;
        }
        let structural_ctfe_owner = matches!(
            tcx.def_kind(def_id),
            DefKind::Const
                | DefKind::AssocConst
                | DefKind::Static { .. }
                | DefKind::AnonConst
                | DefKind::InlineConst
        );
        let const_context = tcx.hir_body_const_context(def_id).is_some();
        let structural_ctfe_decisions = obligations
            .decisions
            .values()
            .filter(|decision| {
                decision.definitions.contains(&obligations.definition)
                    && (structural_ctfe_owner || (const_context && decision.structural_marker))
            })
            .collect::<Vec<_>>();
        if !structural_ctfe_decisions.is_empty() {
            let assignments = {
                let borrowed = body.borrow();
                structural_decision_condition_marker_assignments(
                    tcx,
                    &obligations.crate_name,
                    &borrowed,
                    &structural_ctfe_decisions,
                    &BTreeMap::new(),
                    true,
                    "CTFE",
                )
                .unwrap_or_else(|error| {
                    degrade_unbound_obligations(
                        DeclineScope::Decisions,
                        tcx,
                        def_id,
                        "bind pre-borrow-check CTFE decisions",
                        &obligations.definition,
                        &error,
                    );
                    Vec::new()
                })
            };
            let mut instrumented = body.steal();
            // Declining after this point cannot hand `body` back: it is stolen, and
            // returning it panics rustc. Keep the uninstrumented copy for that.
            let pristine = instrumented.clone();
            let mut markers = Vec::new();
            for (decision_id, condition_index, block) in assignments {
                let marker_local = instrumented
                    .local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
                instrumented.basic_blocks_mut()[block].statements.insert(
                    0,
                    match_arm_marker_statement(tcx, marker_local, condition_index as u64),
                );
                markers.push(StructuralDecisionConditionMarker {
                    local: marker_local.as_u32(),
                    decision_id,
                    condition_index,
                });
            }
            if markers.len()
                != structural_ctfe_decisions
                    .iter()
                    .map(|decision| decision.conditions.len())
                    .sum::<usize>()
            {
                // Not every CTFE construct exposes a marker site for each of its
                // conditions. That is a binder blind spot, not a broken
                // environment, so it declines the body rather than stopping a
                // user's build; strict binding still keeps it a hard signal here.
                degrade_unbound_obligations(
                    DeclineScope::Body,
                    tcx,
                    def_id,
                    "place CTFE decision markers",
                    &obligations.definition,
                    &format!(
                        "markers cover {}/{} conditions",
                        markers.len(),
                        structural_ctfe_decisions
                            .iter()
                            .map(|decision| decision.conditions.len())
                            .sum::<usize>(),
                    ),
                );
                return tcx.alloc_steal_mir(pristine);
            }
            let mut stored = STRUCTURAL_DECISION_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = stored.insert(def_id, markers.clone())
                && existing != markers
            {
                tcx.dcx().fatal(format!(
                    "Supercov CTFE decision marker collision for {}",
                    obligations.definition
                ));
            }
            return tcx.alloc_steal_mir(instrumented);
        }
        if const_context {
            return body;
        }
        {
            let borrowed = body.borrow();
            let block_sources = executable_block_sources(tcx, &obligations.crate_name, &borrowed);
            let mut reachable = BTreeSet::new();
            let mut pending = vec![rustc_middle::mir::START_BLOCK];
            while let Some(block) = pending.pop() {
                if reachable.insert(block) {
                    pending.extend(semantic_successors(
                        borrowed.basic_blocks[block].terminator(),
                    ));
                }
            }
            let unreachable = obligations
                .match_groups
                .values()
                .filter(|group| {
                    group.definitions.contains(&obligations.definition)
                        && group.identity.provenance != "synthetic-expansion"
                })
                .flat_map(|group| &group.arms)
                .filter(|arm| {
                    !block_sources.iter().any(|(block, sources)| {
                        reachable.contains(block)
                            && sources.iter().any(|source| {
                                source.key == arm.body_source.key
                                    && source.start >= arm.body_source.start
                                    && source.end <= arm.body_source.end
                            })
                    })
                })
                .map(|arm| arm.branch_id.clone())
                .collect::<Vec<_>>();
            let mut arms = UNREACHABLE_MATCH_ARMS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            let before = arms.len();
            arms.extend(unreachable);
            if arms.len() != before {
                UNREACHABLE_MATCH_ARMS_VERSION.fetch_add(1, Ordering::Relaxed);
            }
        }
        // Coverage-ineligible functions (`#[automatically_derived]`,
        // `#[coverage(off)]`) have wholly collapsed spans, so even their
        // authored-expansion match groups can only bind through pre-borrow
        // markers — the span-located planner degenerates on them.
        let coverage_ineligible = !tcx.coverage_attr_on(def_id);
        let synthetic_groups = obligations
            .match_groups
            .values()
            .filter(|group| {
                group.definitions.contains(&obligations.definition)
                    && (group.identity.provenance == "synthetic-expansion"
                        || (coverage_ineligible
                            && group.identity.provenance == "authored-expansion"))
            })
            .collect::<Vec<_>>();
        let synthetic_let_else = obligations
            .branches
            .values()
            .filter(|branch| {
                branch.definitions.contains(&obligations.definition)
                    && branch.branch_kind == "let-else"
                    && branch.identity.provenance == "synthetic-expansion"
            })
            .collect::<Vec<_>>();
        let try_operators = obligations
            .branches
            .values()
            .filter(|branch| {
                branch.definitions.contains(&obligations.definition)
                    && branch.branch_kind == "try-operator"
            })
            .collect::<Vec<_>>();
        let structural_decisions = obligations
            .decisions
            .values()
            .filter(|decision| {
                decision.definitions.contains(&obligations.definition) && decision.structural_marker
            })
            .collect::<Vec<_>>();
        let assertion_decisions = structural_decisions
            .iter()
            .copied()
            .filter(|decision| decision.decision_kind == "assertion")
            .collect::<Vec<_>>();
        let opaque_condition_decisions = structural_decisions
            .iter()
            .copied()
            .filter(|decision| {
                decision
                    .conditions
                    .iter()
                    .any(|condition| condition.opaque_authored_macro)
            })
            .collect::<Vec<_>>();
        if synthetic_groups.is_empty()
            && synthetic_let_else.is_empty()
            && try_operators.is_empty()
            && structural_decisions.is_empty()
        {
            return body;
        }
        let (assignments, guard_blocks, let_else_assignments, try_assignments) = {
            let borrowed = body.borrow();
            let assignments = if synthetic_groups.is_empty() {
                BTreeMap::new()
            } else {
                match synthetic_match_assignments(
                    tcx,
                    &obligations.crate_name,
                    &borrowed,
                    &synthetic_groups,
                ) {
                    Ok(assignments) => assignments,
                    Err(error) => {
                        degrade_unbound_obligations(
                            DeclineScope::Body,
                            tcx,
                            def_id,
                            "bind pre-borrow-check synthetic matches",
                            &obligations.definition,
                            &error,
                        );
                        return body;
                    }
                }
            };
            let mut guard_blocks = Vec::new();
            for group in &synthetic_groups {
                let Some(path) = assignments.get(&group.identity.id) else {
                    return body;
                };
                for (arm, arm_path) in group.arms.iter().zip(&path.arms) {
                    let Some(decision_id) = &arm.guard_decision_id else {
                        continue;
                    };
                    let Some(decision) = obligations.decisions.get(decision_id) else {
                        return body;
                    };
                    let (Some(candidate), Some(rejection)) =
                        (arm_path.guard_candidate, arm_path.rejection)
                    else {
                        return body;
                    };
                    let blocks = match guard_condition_blocks(
                        tcx,
                        &borrowed,
                        candidate,
                        arm_path.entry,
                        rejection,
                        decision.conditions.len(),
                    ) {
                        Ok(blocks) => blocks,
                        Err(error) => {
                            degrade_unbound_obligations(
                                DeclineScope::Body,
                                tcx,
                                def_id,
                                &format!("bind pre-borrow-check synthetic guard {decision_id}"),
                                &obligations.definition,
                                &error,
                            );
                            return body;
                        }
                    };
                    guard_blocks.extend(
                        blocks
                            .into_iter()
                            .enumerate()
                            .map(|(index, block)| (decision_id.clone(), index, block)),
                    );
                }
            }
            guard_blocks.extend(
                opaque_authored_condition_marker_assignments(
                    tcx,
                    &obligations.crate_name,
                    &borrowed,
                    &opaque_condition_decisions,
                )
                .unwrap_or_else(|error| {
                    degrade_unbound_obligations(
                        DeclineScope::Decisions,
                        tcx,
                        def_id,
                        "bind authored opaque decision conditions",
                        &obligations.definition,
                        &error,
                    );
                    Vec::new()
                }),
            );
            guard_blocks.extend(
                structural_decision_condition_marker_assignments(
                    tcx,
                    &obligations.crate_name,
                    &borrowed,
                    &structural_decisions,
                    &assignments,
                    false,
                    "structural decision",
                )
                .unwrap_or_else(|error| {
                    degrade_unbound_obligations(
                        DeclineScope::Decisions,
                        tcx,
                        def_id,
                        "bind pre-borrow-check structural decision conditions",
                        &obligations.definition,
                        &error,
                    );
                    Vec::new()
                }),
            );
            let let_else_assignments = synthetic_let_else_assignments(
                tcx,
                &obligations.crate_name,
                &borrowed,
                &synthetic_let_else,
            )
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "bind pre-borrow-check synthetic let-else",
                    &obligations.definition,
                    &error,
                );
                BTreeMap::new()
            });
            let try_assignments = try_operator_assignments(
                tcx,
                &obligations.crate_name,
                &borrowed,
                &try_operators,
                &assignments,
            )
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "bind pre-borrow-check try operators",
                    &obligations.definition,
                    &error,
                );
                BTreeMap::new()
            });
            (
                assignments,
                guard_blocks,
                let_else_assignments,
                try_assignments,
            )
        };
        let mut instrumented = body.steal();
        let mut local_ordinals = BTreeMap::new();
        for group in &synthetic_groups {
            // A degraded match phase records no assignment for its groups.
            let Some(path) = assignments.get(&group.identity.id) else {
                continue;
            };
            for (arm, arm_path) in group.arms.iter().zip(&path.arms) {
                let marker_local = instrumented
                    .local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
                instrumented.basic_blocks_mut()[arm_path.entry]
                    .statements
                    .insert(
                        0,
                        match_arm_marker_statement(tcx, marker_local, arm.selected_ordinal),
                    );
                local_ordinals.insert(marker_local.as_u32(), arm.selected_ordinal);
            }
        }
        let mut guard_markers = Vec::new();
        for (decision_id, condition_index, block) in guard_blocks {
            let marker_local = instrumented
                .local_decls
                .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
            instrumented.basic_blocks_mut()[block].statements.insert(
                0,
                match_arm_marker_statement(tcx, marker_local, condition_index as u64),
            );
            guard_markers.push(StructuralDecisionConditionMarker {
                local: marker_local.as_u32(),
                decision_id,
                condition_index,
            });
        }
        let mut let_else_markers = Vec::new();
        for branch in &synthetic_let_else {
            let Some(&path) = let_else_assignments.get(&branch.identity.id) else {
                continue;
            };
            for (label, block) in [("matched", path.matched), ("else", path.fallback)] {
                let alternative = branch
                    .alternatives
                    .iter()
                    .find(|alternative| alternative.label == label)
                    .unwrap_or_else(|| {
                        tcx.dcx().fatal(format!(
                            "Supercov synthetic let-else {} has no {label} alternative",
                            branch.identity.id
                        ))
                    });
                let marker_local = instrumented
                    .local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
                instrumented.basic_blocks_mut()[block].statements.insert(
                    0,
                    match_arm_marker_statement(
                        tcx,
                        marker_local,
                        alternative.identity.probe_ordinal,
                    ),
                );
                let_else_markers.push(StructuralBranchMarker {
                    local: marker_local.as_u32(),
                    branch_id: branch.identity.id.clone(),
                    alternative_ordinal: alternative.identity.probe_ordinal,
                });
            }
        }
        let mut try_markers = Vec::new();
        for branch in &try_operators {
            let Some(&path) = try_assignments.get(&branch.identity.id) else {
                continue;
            };
            for (label, block) in [
                ("continued", path.continued),
                ("early return", path.returned),
            ] {
                let alternative = branch
                    .alternatives
                    .iter()
                    .find(|alternative| alternative.label == label)
                    .unwrap_or_else(|| {
                        tcx.dcx().fatal(format!(
                            "Supercov try operator {} has no {label} alternative",
                            branch.identity.id
                        ))
                    });
                let marker_local = instrumented
                    .local_decls
                    .push(LocalDecl::new(tcx.types.u64, DUMMY_SP));
                instrumented.basic_blocks_mut()[block].statements.insert(
                    0,
                    match_arm_marker_statement(
                        tcx,
                        marker_local,
                        alternative.identity.probe_ordinal,
                    ),
                );
                try_markers.push(StructuralBranchMarker {
                    local: marker_local.as_u32(),
                    branch_id: branch.identity.id.clone(),
                    alternative_ordinal: alternative.identity.probe_ordinal,
                });
            }
        }
        let context_marker =
            find_runtime_function(tcx, CONTEXT_MARKER_FUNCTION).unwrap_or_else(|| {
                tcx.dcx().fatal(format!(
                    "Supercov assertion context marker runtime is unavailable in {}",
                    obligations.definition
                ))
            });
        let assertion_phase_markers = install_assertion_phase_markers(
            tcx,
            &obligations.crate_name,
            &obligations.definition,
            &mut instrumented,
            &assertion_decisions,
            &obligations.points,
            context_marker,
        )
        .unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Decisions,
                tcx,
                def_id,
                "bind assertion phase boundaries",
                &obligations.definition,
                &error,
            );
            Vec::new()
        });
        if !local_ordinals.is_empty() {
            let mut markers = MATCH_ARM_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = markers.insert(def_id, local_ordinals.clone())
                && existing != local_ordinals
            {
                tcx.dcx().fatal(format!(
                    "Supercov synthetic match marker collision for {}",
                    obligations.definition
                ));
            }
        }
        if !guard_markers.is_empty() {
            let mut markers = STRUCTURAL_DECISION_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = markers.insert(def_id, guard_markers.clone())
                && existing != guard_markers
            {
                tcx.dcx().fatal(format!(
                    "Supercov synthetic match guard marker collision for {}",
                    obligations.definition
                ));
            }
        }
        if !let_else_markers.is_empty() {
            let mut markers = LET_ELSE_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = markers.insert(def_id, let_else_markers.clone())
                && existing != let_else_markers
            {
                tcx.dcx().fatal(format!(
                    "Supercov synthetic let-else marker collision for {}",
                    obligations.definition
                ));
            }
        }
        if !try_markers.is_empty() {
            let mut markers = TRY_OPERATOR_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = markers.insert(def_id, try_markers.clone())
                && existing != try_markers
            {
                tcx.dcx().fatal(format!(
                    "Supercov try-operator marker collision for {}",
                    obligations.definition
                ));
            }
        }
        if !assertion_phase_markers.is_empty() {
            let mut markers = ASSERTION_PHASE_MARKERS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            if let Some(existing) = markers.insert(def_id, assertion_phase_markers.clone())
                && existing != assertion_phase_markers
            {
                tcx.dcx().fatal(format!(
                    "Supercov assertion phase marker collision for {}",
                    obligations.definition
                ));
            }
        }
        tcx.alloc_steal_mir(instrumented)
    })
}

#[allow(clippy::too_many_arguments)]
fn consume_assertion_context_marker_pair<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    pair: &AssertionContextMarkerPair,
    marker_function: LocalDefId,
    definition: &str,
) -> Result<(BasicBlock, BasicBlock, bool, Place<'tcx>, Place<'tcx>), String> {
    let matches = body
        .basic_blocks
        .iter_enumerated()
        .filter_map(|(block, data)| {
            let TerminatorKind::Call { func, args, .. } = &data.terminator().kind else {
                return None;
            };
            if !matches!(
                func.ty(&body.local_decls, tcx).kind(),
                ty::FnDef(def_id, _) if *def_id == marker_function.to_def_id()
            ) || args.len() != 3
            {
                return None;
            }
            let Operand::Constant(tag) = &args[0].node else {
                return None;
            };
            (tag.const_.try_to_scalar_int()?.to_u64() == pair.tag).then_some(block)
        })
        .collect::<Vec<_>>();
    let [block] = matches.as_slice() else {
        let retained_tags = body
            .basic_blocks
            .iter()
            .filter_map(|data| {
                let TerminatorKind::Call { func, args, .. } = &data.terminator().kind else {
                    return None;
                };
                if !matches!(
                    func.ty(&body.local_decls, tcx).kind(),
                    ty::FnDef(def_id, _) if *def_id == marker_function.to_def_id()
                ) {
                    return None;
                }
                let Operand::Constant(tag) = &args.first()?.node else {
                    return None;
                };
                Some(tag.const_.try_to_scalar_int()?.to_u64())
            })
            .map(|tag| format!("{tag:016x}"))
            .collect::<Vec<_>>();
        return Err(format!(
            "assertion context marker {:016x} survived {} times in {definition}; retained markers: {}",
            pair.tag,
            matches.len(),
            retained_tags.join(", "),
        ));
    };
    let (target, context, previous, cleanup) = {
        let data = &body.basic_blocks[*block];
        let TerminatorKind::Call {
            func,
            args,
            target: Some(target),
            ..
        } = &data.terminator().kind
        else {
            return Err(format!(
                "assertion context marker is not followed by its call in {definition}"
            ));
        };
        if !matches!(
            func.ty(&body.local_decls, tcx).kind(),
            ty::FnDef(def_id, _) if *def_id == marker_function.to_def_id()
        ) || args.len() != 3
        {
            return Err(format!(
                "assertion context marker call changed identity in {definition}"
            ));
        }
        let place = |operand: &Operand<'tcx>| match operand {
            Operand::Copy(place) | Operand::Move(place) => Some(*place),
            _ => None,
        };
        let context = place(&args[1].node).ok_or_else(|| {
            format!("assertion context marker lost its context place in {definition}")
        })?;
        let previous = place(&args[2].node).ok_or_else(|| {
            format!("assertion context marker lost its previous place in {definition}")
        })?;
        (*target, context, previous, data.is_cleanup)
    };
    Ok((*block, target, cleanup, context, previous))
}

#[allow(clippy::too_many_arguments)]
fn instrument_assertion_phases<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &mut Body<'tcx>,
    definition: &str,
    markers: &[AssertionPhaseMarker],
    context_marker: LocalDefId,
    enter: LocalDefId,
    active_context: LocalDefId,
    enter_context: LocalDefId,
    exit: LocalDefId,
    ordinal_hit: Option<LocalDefId>,
    unit: rustc_middle::mir::Local,
    span: rustc_span::Span,
) -> Result<(), String> {
    let obligations = runtime_body_obligations(tcx, def_id)
        .ok_or_else(|| format!("{definition} has assertion markers without obligations"))?;
    let marker_by_local = markers
        .iter()
        .map(|marker| (marker.local, marker))
        .collect::<BTreeMap<_, _>>();
    let mut positions = BTreeMap::<u32, (BasicBlock, usize)>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for (index, statement) in data.statements.iter().enumerate() {
            let StatementKind::Assign(assignment) = &statement.kind else {
                continue;
            };
            let (destination, _) = &**assignment;
            let Some(local) = destination.as_local().map(|local| local.as_u32()) else {
                continue;
            };
            if marker_by_local.contains_key(&local)
                && positions.insert(local, (block, index)).is_some()
            {
                return Err(format!(
                    "assertion phase marker local {local} survived more than once in {definition}"
                ));
            }
        }
    }
    if positions.len() != markers.len() {
        return Err(format!(
            "assertion phase markers survived {}/{} times in {definition}",
            positions.len(),
            markers.len()
        ));
    }
    let mut positions_by_block = BTreeMap::<BasicBlock, Vec<(u32, usize)>>::new();
    for (local, (block, index)) in &positions {
        positions_by_block
            .entry(*block)
            .or_default()
            .push((*local, *index));
    }
    let mut entries = BTreeMap::<u32, (BasicBlock, BasicBlock)>::new();
    for (block, mut block_positions) in positions_by_block {
        block_positions.sort_by_key(|(_, index)| *index);
        let mut current = block;
        let mut consumed = 0;
        for (local, original_index) in block_positions {
            let index = original_index
                .checked_sub(consumed)
                .ok_or_else(|| "assertion phase marker order underflow".to_owned())?;
            let (mut tail, terminator, cleanup) = {
                let data = &mut body.basic_blocks_mut()[current];
                let tail = data.statements.split_off(index);
                let terminator = data
                    .terminator
                    .take()
                    .ok_or_else(|| "assertion phase marker block has no terminator".to_owned())?;
                (tail, terminator, data.is_cleanup)
            };
            let Some(marker_statement) = tail.first() else {
                return Err("assertion phase marker disappeared while splitting".into());
            };
            let marker_matches = if let StatementKind::Assign(assignment) = &marker_statement.kind {
                let (destination, _) = &**assignment;
                destination
                    .as_local()
                    .is_some_and(|candidate| candidate.as_u32() == local)
            } else {
                false
            };
            if !marker_matches {
                return Err(format!(
                    "assertion phase marker local {local} changed order in {definition}"
                ));
            }
            tail.remove(0);
            let mut continuation_data = BasicBlockData::new(Some(terminator), cleanup);
            continuation_data.statements = tail;
            let continuation = body.basic_blocks_mut().push(continuation_data);
            body.basic_blocks_mut()[current].terminator = Some(Terminator {
                source_info: SourceInfo::outermost(DUMMY_SP),
                kind: TerminatorKind::Goto {
                    target: continuation,
                },
            });
            entries.insert(local, (current, continuation));
            current = continuation;
            consumed = original_index + 1;
        }
    }
    for marker in markers {
        let mut suspension_sites = Vec::new();
        for suspension in &marker.suspensions {
            suspension_sites.push((
                false,
                consume_assertion_context_marker_pair(
                    tcx,
                    body,
                    &suspension.suspend,
                    context_marker,
                    definition,
                )?,
            ));
            suspension_sites.push((
                true,
                consume_assertion_context_marker_pair(
                    tcx,
                    body,
                    &suspension.resume,
                    context_marker,
                    definition,
                )?,
            ));
        }
        let (previous, assertion_context) = if let Some((_, (_, _, _, context, previous))) =
            suspension_sites.first()
        {
            if suspension_sites.iter().any(
                |(_, (_, _, _, candidate_context, candidate_previous))| {
                    candidate_context != context || candidate_previous != previous
                },
            ) {
                return Err(format!(
                    "assertion {} suspension markers disagree on stored context in {definition}",
                    marker.decision_id
                ));
            }
            (*previous, Some(*context))
        } else {
            (
                Place::from(body.local_decls.push(LocalDecl::new(tcx.types.u64, span))),
                None,
            )
        };
        let (block, continuation) = entries[&marker.local];
        let decision = obligations
            .decisions
            .get(&marker.decision_id)
            .ok_or_else(|| {
                format!(
                    "assertion phase marker references unknown decision {}",
                    marker.decision_id
                )
            })?;
        let source = decision
            .assertion_source
            .as_ref()
            .ok_or_else(|| format!("assertion {} has no phase source", marker.decision_id))?;
        let digest = marker
            .decision_id
            .strip_prefix("rs:decision:")
            .ok_or_else(|| format!("invalid assertion decision ID {}", marker.decision_id))?;
        if digest.len() != 24 {
            return Err(format!("invalid assertion decision digest {digest}"));
        }
        let id_high = u64::from_str_radix(&digest[..16], 16)
            .map_err(|error| format!("invalid assertion decision ID: {error}"))?;
        let id_low = u32::from_str_radix(&digest[16..], 16)
            .map_err(|error| format!("invalid assertion decision ID: {error}"))?;
        let cleanup = body.basic_blocks[block].is_cleanup;
        let assertion_entry = if let Some(ordinal) = marker.statement_ordinal {
            let hit = ordinal_hit.ok_or_else(|| {
                format!(
                    "assertion {} has a statement obligation without an ordinal runtime",
                    marker.decision_id
                )
            })?;
            body.basic_blocks_mut().push(runtime_call_block(
                tcx,
                hit,
                std::iter::once(Operand::const_from_scalar(
                    tcx,
                    tcx.types.u64,
                    Scalar::from_u64(ordinal),
                    span,
                )),
                Place::from(unit),
                continuation,
                span,
                cleanup,
            ))
        } else {
            continuation
        };
        let assertion_entry = if let Some(assertion_context) = assertion_context {
            body.basic_blocks_mut().push(runtime_call_block(
                tcx,
                active_context,
                std::iter::empty(),
                assertion_context,
                assertion_entry,
                span,
                cleanup,
            ))
        } else {
            assertion_entry
        };
        let call = runtime_call_block(
            tcx,
            enter,
            [
                Operand::const_from_scalar(tcx, tcx.types.u64, Scalar::from_u64(id_high), span),
                Operand::const_from_scalar(tcx, tcx.types.u32, Scalar::from_u32(id_low), span),
            ]
            .into_iter(),
            previous,
            assertion_entry,
            span,
            cleanup,
        );
        body.basic_blocks_mut()[block].terminator = call.terminator;

        let mut region = body
            .basic_blocks
            .iter_enumerated()
            .filter_map(|(candidate, data)| {
                (candidate != block
                    && (data.statements.iter().any(|statement| {
                        assertion_span_matches(
                            tcx,
                            &obligations.crate_name,
                            source,
                            statement.source_info.span,
                        )
                    }) || assertion_span_matches(
                        tcx,
                        &obligations.crate_name,
                        source,
                        data.terminator().source_info.span,
                    )))
                .then_some(candidate)
            })
            .collect::<BTreeSet<_>>();
        region.insert(continuation);
        loop {
            let predecessors = body.basic_blocks.predecessors();
            let additions = body
                .basic_blocks
                .iter_enumerated()
                .filter_map(|(candidate, data)| {
                    if candidate == block || region.contains(&candidate) {
                        return None;
                    }
                    let entered_from_region = predecessors[candidate]
                        .iter()
                        .any(|predecessor| region.contains(predecessor));
                    let returns_to_region = semantic_successors(data.terminator())
                        .into_iter()
                        .any(|target| region.contains(&target))
                        || data
                            .terminator()
                            .unwind()
                            .is_some_and(|unwind| match unwind {
                                UnwindAction::Cleanup(target) => region.contains(target),
                                _ => false,
                            });
                    (entered_from_region && returns_to_region).then_some(candidate)
                })
                .collect::<Vec<_>>();
            if additions.is_empty() {
                break;
            }
            region.extend(additions);
        }
        let regular_exits = region
            .iter()
            .flat_map(|source_block| {
                semantic_successors(body.basic_blocks[*source_block].terminator())
                    .into_iter()
                    .filter(|target| !region.contains(target))
                    .map(|target| (*source_block, target))
            })
            .collect::<BTreeSet<_>>();
        let unwind_exits = region
            .iter()
            .filter_map(|source_block| {
                body.basic_blocks[*source_block]
                    .terminator()
                    .unwind()
                    .and_then(|unwind| match unwind {
                        UnwindAction::Continue => Some((*source_block, None)),
                        UnwindAction::Cleanup(target) if !region.contains(target) => {
                            Some((*source_block, Some(*target)))
                        }
                        _ => None,
                    })
            })
            .collect::<BTreeSet<_>>();
        let terminal_exits = region
            .iter()
            .copied()
            .filter(|source_block| {
                matches!(
                    body.basic_blocks[*source_block].terminator().kind,
                    TerminatorKind::Return | TerminatorKind::UnwindResume
                )
            })
            .collect::<BTreeSet<_>>();
        if regular_exits.is_empty() && unwind_exits.is_empty() && terminal_exits.is_empty() {
            return Err(format!(
                "assertion {} has no post-borrow-check phase exit",
                marker.decision_id
            ));
        }
        for (source_block, target) in regular_exits {
            let cleanup = body.basic_blocks[source_block].is_cleanup;
            let bridge = body.basic_blocks_mut().push(runtime_call_block(
                tcx,
                exit,
                [Operand::Copy(previous)].into_iter(),
                Place::from(unit),
                target,
                span,
                cleanup,
            ));
            let mut replaced = 0;
            body.basic_blocks_mut()[source_block]
                .terminator_mut()
                .successors_mut(|edge| {
                    if *edge == target {
                        *edge = bridge;
                        replaced += 1;
                    }
                });
            if replaced == 0 {
                return Err(format!(
                    "assertion {} lost regular phase exit {:?}->{:?}",
                    marker.decision_id, source_block, target
                ));
            }
        }
        for (source_block, target) in unwind_exits {
            let terminal = target.unwrap_or_else(|| {
                body.basic_blocks_mut().push(BasicBlockData::new(
                    Some(Terminator {
                        source_info: SourceInfo::outermost(span),
                        kind: TerminatorKind::UnwindResume,
                    }),
                    true,
                ))
            });
            let bridge = body.basic_blocks_mut().push(runtime_call_block(
                tcx,
                exit,
                [Operand::Copy(previous)].into_iter(),
                Place::from(unit),
                terminal,
                span,
                true,
            ));
            *body.basic_blocks_mut()[source_block]
                .terminator_mut()
                .unwind_mut()
                .ok_or_else(|| {
                    format!(
                        "assertion {} lost unwind phase exit {:?}",
                        marker.decision_id, source_block
                    )
                })? = UnwindAction::Cleanup(bridge);
        }
        for source_block in terminal_exits {
            let cleanup = body.basic_blocks[source_block].is_cleanup;
            let original = body.basic_blocks_mut()[source_block]
                .terminator
                .take()
                .ok_or_else(|| "assertion terminal phase block has no terminator".to_owned())?;
            let terminal = body
                .basic_blocks_mut()
                .push(BasicBlockData::new(Some(original), cleanup));
            body.basic_blocks_mut()[source_block].terminator = runtime_call_block(
                tcx,
                exit,
                [Operand::Copy(previous)].into_iter(),
                Place::from(unit),
                terminal,
                span,
                cleanup,
            )
            .terminator;
        }
        for (resume, (block, continuation, cleanup, context, previous)) in suspension_sites {
            body.basic_blocks_mut()[block].terminator = if resume {
                runtime_call_block(
                    tcx,
                    enter_context,
                    [Operand::Copy(context)].into_iter(),
                    previous,
                    continuation,
                    span,
                    cleanup,
                )
                .terminator
            } else {
                runtime_call_block(
                    tcx,
                    exit,
                    [Operand::Copy(previous)].into_iter(),
                    Place::from(unit),
                    continuation,
                    span,
                    cleanup,
                )
                .terminator
            };
        }
    }
    Ok(())
}

fn mir_drops_with_structural_probes<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
) -> &'tcx Steal<Body<'tcx>> {
    let original = ORIGINAL_MIR_DROPS
        .get()
        .expect("original mir_drops_elaborated_and_const_checked provider");
    let body = original(tcx, def_id);
    if env::var_os(INSTRUMENT_MIR).is_none()
        || tcx.dcx().has_errors().is_some()
        || tcx.hir_body_const_context(def_id).is_some()
    {
        return body;
    }
    rustc_middle::ty::print::with_no_trimmed_paths!({
        let assertion_phase_markers = ASSERTION_PHASE_MARKERS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .get(&def_id)
            .cloned()
            .unwrap_or_default();
        // Only split when this body actually needs it. The entry block is load
        // bearing elsewhere — observation kind is keyed off it — so bodies that
        // already bind are left exactly as rustc lowered them. Plan against a
        // split clone and apply the same split to the stolen body below;
        // `split_entry_block` appends exactly one block, so both agree on
        // numbering.
        let entry_split_needed = matches!(
            runtime_match_plans(tcx, def_id, &body.borrow()),
            Err(ref error) if error.contains("has no external incoming edge")
        );
        let split_for_planning = entry_split_needed.then(|| {
            let mut clone = body.borrow().clone();
            split_entry_block(&mut clone);
            clone
        });
        let (match_plans, for_plans, guard_plans, let_else_plans, try_plans) = {
            let borrowed = body.borrow();
            let planned: &Body<'tcx> = split_for_planning.as_ref().unwrap_or(&borrowed);
            (
                runtime_match_plans(tcx, def_id, planned),
                runtime_for_loop_plans(tcx, def_id, planned),
                runtime_marked_decision_plans(tcx, def_id, planned),
                runtime_marked_let_else_plans(tcx, def_id, planned),
                runtime_marked_try_operator_plans(tcx, def_id, planned),
            )
        };
        let match_plans = match_plans.unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Matches,
                tcx,
                def_id,
                "bind pre-optimization Rust match probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            Vec::new()
        });
        let for_plans = for_plans.unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Branches,
                tcx,
                def_id,
                "bind pre-optimization Rust for-loop probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            Vec::new()
        });
        let guard_plans = guard_plans.unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Decisions,
                tcx,
                def_id,
                "bind pre-optimization Rust structural decision probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            Vec::new()
        });
        let let_else_plans = let_else_plans.unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Branches,
                tcx,
                def_id,
                "bind pre-optimization Rust synthetic let-else probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            Vec::new()
        });
        let try_plans = try_plans.unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Branches,
                tcx,
                def_id,
                "bind pre-optimization Rust try-operator probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            Vec::new()
        });
        if match_plans.is_empty()
            && for_plans.is_empty()
            && guard_plans.is_empty()
            && let_else_plans.is_empty()
            && try_plans.is_empty()
            && assertion_phase_markers.is_empty()
        {
            return body;
        }
        let has_branch_plans = !match_plans.is_empty()
            || !for_plans.is_empty()
            || !let_else_plans.is_empty()
            || !try_plans.is_empty();
        let start_branch = has_branch_plans
            .then(|| find_runtime_function(tcx, START_BRANCH_FUNCTION))
            .flatten();
        let hit_branch = has_branch_plans
            .then(|| find_runtime_function(tcx, HIT_BRANCH_FUNCTION))
            .flatten();
        let has_guard_plans = !guard_plans.is_empty();
        let has_assertion_statement_points = assertion_phase_markers
            .iter()
            .any(|marker| marker.statement_ordinal.is_some());
        let ordinal_hit = (has_guard_plans || has_assertion_statement_points)
            .then(|| find_runtime_function(tcx, PROBE_FUNCTION))
            .flatten();
        let start_decision = has_guard_plans
            .then(|| find_runtime_function(tcx, START_DECISION_FUNCTION))
            .flatten();
        let record_condition = has_guard_plans
            .then(|| find_runtime_function(tcx, RECORD_CONDITION_FUNCTION))
            .flatten();
        let finish_decision = has_guard_plans
            .then(|| find_runtime_function(tcx, FINISH_DECISION_FUNCTION))
            .flatten();
        let has_assertion_phases = !assertion_phase_markers.is_empty();
        let context_marker = has_assertion_phases
            .then(|| find_runtime_function(tcx, CONTEXT_MARKER_FUNCTION))
            .flatten();
        let enter_assertion_context = has_assertion_phases
            .then(|| find_runtime_function(tcx, ENTER_ASSERTION_CONTEXT_FUNCTION))
            .flatten();
        let active_context = has_assertion_phases
            .then(|| find_runtime_function(tcx, ACTIVE_CONTEXT_FUNCTION))
            .flatten();
        let enter_context = has_assertion_phases
            .then(|| find_runtime_function(tcx, ENTER_CONTEXT_FUNCTION))
            .flatten();
        let exit_context = has_assertion_phases
            .then(|| find_runtime_function(tcx, EXIT_CONTEXT_FUNCTION))
            .flatten();
        if has_branch_plans != (start_branch.is_some() && hit_branch.is_some())
            || has_guard_plans
                != (start_decision.is_some()
                    && record_condition.is_some()
                    && finish_decision.is_some()
                    && ordinal_hit.is_some())
            || (has_assertion_statement_points && ordinal_hit.is_none())
            || has_assertion_phases
                != (context_marker.is_some()
                    && enter_assertion_context.is_some()
                    && active_context.is_some()
                    && enter_context.is_some()
                    && exit_context.is_some())
        {
            tcx.dcx().fatal(format!(
                "Supercov structural runtimes are incomplete while instrumenting {}",
                exact_def_path!(tcx, def_id)
            ));
        }
        let mut instrumented = body.steal();
        if entry_split_needed {
            split_entry_block(&mut instrumented);
        }
        let mut match_rewrites = MatchRewrites::default();
        // Degrading after the steal cannot hand `body` back — it is already
        // stolen, and returning it panics rustc with "attempt to steal from
        // stolen value". Returning the partially instrumented body would be
        // worse: half-applied markers produce evidence we cannot justify. Keep
        // a pristine copy so a decline returns exactly the uninstrumented body.
        let pristine = instrumented.clone();
        let span = tcx.def_span(def_id);
        let unit = instrumented
            .local_decls
            .push(LocalDecl::new(tcx.types.unit, span));
        if let Err(error) =
            strip_match_arm_markers(&mut instrumented, def_id, &exact_def_path!(tcx, def_id))
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "consume pre-borrow-check Rust match markers",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        let mut match_plans = match_plans;
        if let (Some(start), Some(hit)) = (start_branch, hit_branch)
            && let Err(error) = instrument_runtime_matches(
                tcx,
                &mut instrumented,
                &mut match_plans,
                start,
                hit,
                unit,
                span,
                &mut match_rewrites,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject pre-optimization Rust match probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        // Match instrumentation may replace the accepting edge of a guard. Bind
        // exact Boolean targets after that edit while the semantic markers remain.
        let guard_plans =
            runtime_marked_decision_plans(tcx, def_id, &instrumented).unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Matches,
                    tcx,
                    def_id,
                    "rebind pre-optimization Rust synthetic guard probes",
                    &exact_def_path!(tcx, def_id),
                    &error,
                );
                Vec::new()
            });
        if let Err(error) = strip_structural_decision_markers(
            &mut instrumented,
            def_id,
            &exact_def_path!(tcx, def_id),
        ) {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "consume pre-borrow-check Rust match guard markers",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        if let (Some(start), Some(condition), Some(finish)) =
            (start_decision, record_condition, finish_decision)
            && let Err(error) = instrument_runtime_decisions(
                tcx,
                &mut instrumented,
                &guard_plans,
                DecisionRuntime {
                    start,
                    condition,
                    finish,
                    ordinal_hit: ordinal_hit
                        .expect("validated structural decision ordinal runtime"),
                    branch_hit: hit_branch,
                    unit,
                },
                span,
                &[],
                &match_rewrites,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject pre-optimization Rust synthetic guard probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        // Match and guard instrumentation may split an endpoint edge. Rebind the
        // semantic let-else markers only after those enclosing structures settle.
        let mut let_else_plans = runtime_marked_let_else_plans(tcx, def_id, &instrumented)
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "rebind pre-optimization Rust synthetic let-else probes",
                    &exact_def_path!(tcx, def_id),
                    &error,
                );
                Vec::new()
            });
        if let Err(error) =
            strip_let_else_markers(&mut instrumented, def_id, &exact_def_path!(tcx, def_id))
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "consume pre-borrow-check Rust let-else markers",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        if let (Some(start), Some(hit)) = (start_branch, hit_branch)
            && let Err(error) = instrument_runtime_matches(
                tcx,
                &mut instrumented,
                &mut let_else_plans,
                start,
                hit,
                unit,
                span,
                &mut MatchRewrites::default(),
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject pre-optimization Rust synthetic let-else probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        // Structural edits above may split either endpoint of a lowered `?`.
        // Bind the retained semantic markers only after enclosing selections have
        // settled, then remove every marker before this MIR leaves the provider.
        let mut try_plans = runtime_marked_try_operator_plans(tcx, def_id, &instrumented)
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "rebind pre-optimization Rust try-operator probes",
                    &exact_def_path!(tcx, def_id),
                    &error,
                );
                Vec::new()
            });
        if let Err(error) =
            strip_try_operator_markers(&mut instrumented, def_id, &exact_def_path!(tcx, def_id))
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "consume pre-borrow-check Rust try-operator markers",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        if let (Some(start), Some(hit)) = (start_branch, hit_branch)
            && let Err(error) = instrument_runtime_matches(
                tcx,
                &mut instrumented,
                &mut try_plans,
                start,
                hit,
                unit,
                span,
                &mut MatchRewrites::default(),
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject pre-optimization Rust try-operator probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        // Match instrumentation can split blocks enclosing a nested for loop, so
        // bind for-loop structure again against the current body before editing it.
        let mut for_plans =
            runtime_for_loop_plans(tcx, def_id, &instrumented).unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "rebind pre-optimization Rust for-loop probes",
                    &exact_def_path!(tcx, def_id),
                    &error,
                );
                Vec::new()
            });
        if let (Some(start), Some(hit)) = (start_branch, hit_branch)
            && let Err(error) = instrument_runtime_for_loops(
                tcx,
                &mut instrumented,
                &mut for_plans,
                start,
                hit,
                unit,
                span,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject pre-optimization Rust for-loop probes",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        if let (Some(marker), Some(enter), Some(active), Some(resume), Some(exit)) = (
            context_marker,
            enter_assertion_context,
            active_context,
            enter_context,
            exit_context,
        ) && let Err(error) = instrument_assertion_phases(
            tcx,
            def_id,
            &mut instrumented,
            &exact_def_path!(tcx, def_id),
            &assertion_phase_markers,
            marker,
            enter,
            active,
            resume,
            exit,
            ordinal_hit,
            unit,
            span,
        ) {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust assertion phases",
                &exact_def_path!(tcx, def_id),
                &error,
            );
            return tcx.alloc_steal_mir(pristine);
        }
        tcx.alloc_steal_mir(instrumented)
    })
}

fn mir_for_ctfe_with_markers<'tcx>(tcx: TyCtxt<'tcx>, def_id: LocalDefId) -> &'tcx Body<'tcx> {
    let original = ORIGINAL_MIR_FOR_CTFE
        .get()
        .expect("original mir_for_ctfe provider");
    let body = original(tcx, def_id);
    if env::var_os(INSTRUMENT_CTFE).is_none() || tcx.dcx().has_errors().is_some() {
        return body;
    }

    rustc_middle::ty::print::with_no_trimmed_paths!({
        let mut instrumented = body.clone();
        let span = tcx.def_span(def_id);
        let crate_name = tcx.crate_name(rustc_span::def_id::LOCAL_CRATE).to_string();
        let definition = exact_def_path!(tcx, def_id);
        let mut decision_plans =
            runtime_decision_plans(tcx, def_id, body).unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Decisions,
                    tcx,
                    def_id,
                    "bind Rust CTFE decision probes",
                    &definition,
                    &error,
                );
                Vec::new()
            });
        let structural_decision_plans = runtime_marked_decision_plans(tcx, def_id, body)
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Decisions,
                    tcx,
                    def_id,
                    "bind marked Rust CTFE decisions",
                    &definition,
                    &error,
                );
                Vec::new()
            });
        let mut decision_ids = decision_plans
            .iter()
            .map(|plan| plan.id.clone())
            .collect::<BTreeSet<_>>();
        for plan in structural_decision_plans {
            if !decision_ids.insert(plan.id.clone()) {
                tcx.dcx().fatal(format!(
                    "Supercov bound CTFE decision {} through two compiler paths in {definition}",
                    plan.id
                ));
            }
            decision_plans.push(plan);
        }
        let mut selection_plans = runtime_match_plans(tcx, def_id, body).unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Matches,
                tcx,
                def_id,
                "bind Rust CTFE match selections",
                &definition,
                &error,
            );
            Vec::new()
        });
        let let_else_plans = runtime_let_else_plans(tcx, def_id, body).unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Branches,
                tcx,
                def_id,
                "bind Rust CTFE let-else selections",
                &definition,
                &error,
            );
            Vec::new()
        });
        let logical_selection_plans = runtime_logical_selection_plans(tcx, def_id, body)
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "bind Rust CTFE logical selections",
                    &definition,
                    &error,
                );
                Vec::new()
            });
        let mut selection_ids = selection_plans
            .iter()
            .map(|plan| plan.id.clone())
            .collect::<BTreeSet<_>>();
        for plan in let_else_plans {
            if !selection_ids.insert(plan.id.clone()) {
                tcx.dcx().fatal(format!(
                    "Supercov bound CTFE selection {} through two compiler paths in {definition}",
                    plan.id
                ));
            }
            selection_plans.push(plan);
        }
        for plan in logical_selection_plans {
            if !selection_ids.insert(plan.id.clone()) {
                tcx.dcx().fatal(format!(
                    "Supercov bound CTFE selection {} through two compiler paths in {definition}",
                    plan.id
                ));
            }
            selection_plans.push(plan);
        }
        let mut hit_ordinals_by_block = BTreeMap::<BasicBlock, BTreeSet<u64>>::new();
        for plan in runtime_statement_plans(tcx, def_id, body).unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Statements,
                tcx,
                def_id,
                "bind Rust CTFE statement probes",
                &definition,
                &error,
            );
            Vec::new()
        }) {
            hit_ordinals_by_block
                .entry(plan.block)
                .or_default()
                .insert(plan.ordinal);
        }
        if is_function_body(tcx.def_kind(def_id))
            && !is_async_function_constructor(tcx, def_id)
            && let Ok(identity) = function_identity(tcx, def_id.to_def_id(), span, &crate_name)
        {
            hit_ordinals_by_block
                .entry(rustc_middle::mir::START_BLOCK)
                .or_default()
                .insert(identity.probe_ordinal);
        }
        if let Err(error) =
            strip_structural_decision_markers(&mut instrumented, def_id, &definition)
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "consume pre-borrow-check Rust CTFE markers",
                &definition,
                &error,
            );
            return body;
        }
        let marker_local = instrumented
            .local_decls
            .push(LocalDecl::new(tcx.types.u64, span));
        for (block, block_data) in instrumented.basic_blocks_mut().iter_enumerated_mut() {
            let observation_kind = if block == rustc_middle::mir::START_BLOCK {
                "entry"
            } else {
                "block"
            };
            let marker = ctfe_marker_identity(
                tcx,
                &crate_name,
                &definition,
                observation_kind,
                block.as_u32(),
            );
            register_ctfe_hits(
                tcx,
                marker,
                hit_ordinals_by_block
                    .get(&block)
                    .into_iter()
                    .flatten()
                    .copied(),
            );
            block_data
                .statements
                .insert(0, ctfe_marker_statement(tcx, marker_local, marker, span));
            if matches!(block_data.terminator().kind, TerminatorKind::Return) {
                let exit =
                    ctfe_marker_identity(tcx, &crate_name, &definition, "exit", block.as_u32());
                block_data
                    .statements
                    .push(ctfe_marker_statement(tcx, marker_local, exit, span));
            }
        }
        instrument_ctfe_selections(
            tcx,
            &mut instrumented,
            &selection_plans,
            marker_local,
            &crate_name,
            &definition,
            span,
        )
        .unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust CTFE match selections",
                &definition,
                &error,
            );
        });
        instrument_ctfe_decisions(
            tcx,
            &mut instrumented,
            &decision_plans,
            marker_local,
            &crate_name,
            &definition,
            span,
        )
        .unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust CTFE decision probes",
                &definition,
                &error,
            );
        });

        let decision_edges = instrumented
            .basic_blocks
            .iter_enumerated()
            .filter_map(|(source, block)| {
                let targets = block.terminator().successors().collect::<Vec<_>>();
                (targets.len() > 1).then_some(
                    targets
                        .into_iter()
                        .enumerate()
                        .map(move |(edge, target)| (source, edge, target)),
                )
            })
            .flatten()
            .collect::<Vec<_>>();
        let mut bridges = Vec::with_capacity(decision_edges.len());
        for (ordinal, (source, edge, target)) in decision_edges.iter().copied().enumerate() {
            let ordinal = u32::try_from(ordinal)
                .unwrap_or_else(|_| tcx.dcx().fatal("Supercov CTFE edge count exceeds u32"));
            let marker = ctfe_marker_identity(tcx, &crate_name, &definition, "edge", ordinal);
            let mut bridge = BasicBlockData::new(
                Some(Terminator {
                    source_info: SourceInfo::outermost(span),
                    kind: TerminatorKind::Goto { target },
                }),
                false,
            );
            bridge
                .statements
                .push(ctfe_marker_statement(tcx, marker_local, marker, span));
            let bridge = instrumented.basic_blocks_mut().push(bridge);
            bridges.push((source, edge, bridge));
        }
        for (source, edge, bridge) in bridges {
            let mut current = 0;
            instrumented.basic_blocks_mut()[source]
                .terminator_mut()
                .successors_mut(|target| {
                    if current == edge {
                        *target = bridge;
                    }
                    current += 1;
                });
        }
        tcx.arena.alloc(instrumented)
    })
}

fn instrument_ctfe_selections<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &[RuntimeMatchPlan],
    marker_local: rustc_middle::mir::Local,
    crate_name: &str,
    definition: &str,
    span: rustc_span::Span,
) -> Result<(), String> {
    let mut site = 0_u32;
    for plan in plans {
        for arm in &plan.arms {
            let marker = ctfe_marker_identity(tcx, crate_name, definition, "selection", site);
            site = site
                .checked_add(1)
                .ok_or_else(|| "CTFE selection count exceeds u32".to_owned())?;
            register_ctfe_hits(tcx, marker, std::iter::once(arm.selected_ordinal));
            for source in &arm.entry_sources {
                let cleanup = body.basic_blocks[*source].is_cleanup;
                let mut bridge = BasicBlockData::new(
                    Some(Terminator {
                        source_info: SourceInfo::outermost(span),
                        kind: TerminatorKind::Goto {
                            target: arm.entry_block,
                        },
                    }),
                    cleanup,
                );
                bridge
                    .statements
                    .push(ctfe_marker_statement(tcx, marker_local, marker, span));
                let bridge = body.basic_blocks_mut().push(bridge);
                let mut replaced = 0;
                body.basic_blocks_mut()[*source]
                    .terminator_mut()
                    .successors_mut(|edge| {
                        if *edge == arm.entry_block {
                            *edge = bridge;
                            replaced += 1;
                        }
                    });
                if replaced == 0 {
                    return Err(format!(
                        "CTFE selection {} arm {} edge from {:?} was not found",
                        plan.id, arm.branch_id, source
                    ));
                }
            }
        }
    }
    Ok(())
}

fn instrument_ctfe_decisions<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &[RuntimeDecisionPlan],
    marker_local: rustc_middle::mir::Local,
    crate_name: &str,
    definition: &str,
    span: rustc_span::Span,
) -> Result<(), String> {
    let mut starts = BTreeSet::new();
    let mut condition_site = 0_u32;
    for (plan_index, plan) in plans.iter().enumerate() {
        let first = plan
            .conditions
            .first()
            .ok_or_else(|| format!("decision {} has no conditions", plan.id))?;
        if !starts.insert(first.entry_block) {
            return Err(format!(
                "multiple CTFE decisions begin in MIR block {:?}",
                first.entry_block
            ));
        }
        let start_ordinal =
            u32::try_from(plan_index).map_err(|_| "CTFE decision count exceeds u32".to_owned())?;
        let start =
            ctfe_marker_identity(tcx, crate_name, definition, "decision-start", start_ordinal);
        register_ctfe_decision(
            tcx,
            start,
            CtfeDecisionMapping {
                id: plan.id.clone(),
                event: "start",
                condition_index: None,
                value: None,
                outcome: None,
            },
        );
        body.basic_blocks_mut()[first.entry_block]
            .statements
            .insert(1, ctfe_marker_statement(tcx, marker_local, start, span));

        for condition in &plan.conditions {
            for (value, groups, outcome) in [
                (true, &condition.true_edges, condition.true_outcome),
                (false, &condition.false_edges, condition.false_outcome),
            ] {
                let site = condition_site;
                condition_site = condition_site
                    .checked_add(1)
                    .ok_or_else(|| "CTFE decision event count exceeds u32".to_owned())?;
                let condition_marker =
                    ctfe_marker_identity(tcx, crate_name, definition, "decision-condition", site);
                register_ctfe_decision(
                    tcx,
                    condition_marker,
                    CtfeDecisionMapping {
                        id: plan.id.clone(),
                        event: "condition",
                        condition_index: Some(condition.index),
                        value: Some(value),
                        outcome: None,
                    },
                );
                let finish_marker = outcome.map(|outcome| {
                    let marker =
                        ctfe_marker_identity(tcx, crate_name, definition, "decision-finish", site);
                    register_ctfe_decision(
                        tcx,
                        marker,
                        CtfeDecisionMapping {
                            id: plan.id.clone(),
                            event: "finish",
                            condition_index: None,
                            value: None,
                            outcome: Some(outcome),
                        },
                    );
                    let mut hits = vec![if outcome {
                        plan.true_ordinal
                    } else {
                        plan.false_ordinal
                    }];
                    if let Some((zero, entered)) = plan.loop_alternatives {
                        hits.push(if outcome { entered } else { zero });
                    }
                    register_ctfe_hits(tcx, marker, hits.into_iter());
                    marker
                });
                for (sources, target) in groups {
                    let target = *target;
                    for source in sources {
                        let mut bridge = BasicBlockData::new(
                            Some(Terminator {
                                source_info: SourceInfo::outermost(span),
                                kind: TerminatorKind::Goto { target },
                            }),
                            body.basic_blocks[*source].is_cleanup,
                        );
                        bridge.statements.push(ctfe_marker_statement(
                            tcx,
                            marker_local,
                            condition_marker,
                            span,
                        ));
                        if let Some(finish_marker) = finish_marker {
                            bridge.statements.push(ctfe_marker_statement(
                                tcx,
                                marker_local,
                                finish_marker,
                                span,
                            ));
                        }
                        let bridge = body.basic_blocks_mut().push(bridge);
                        let mut replaced = 0;
                        body.basic_blocks_mut()[*source]
                            .terminator_mut()
                            .successors_mut(|edge| {
                                if *edge == target {
                                    *edge = bridge;
                                    replaced += 1;
                                }
                            });
                        if replaced == 0 {
                            return Err(format!(
                                "decision {} condition {} {:?} edge from {:?} was not found",
                                plan.id, condition.index, value, source
                            ));
                        }
                    }
                }
            }
        }
    }
    Ok(())
}

fn ctfe_marker_identity(
    tcx: TyCtxt<'_>,
    crate_name: &str,
    definition: &str,
    observation_kind: &'static str,
    local_ordinal: u32,
) -> u64 {
    let mut hash = Sha256::new();
    for field in [
        "supercov-rust-ctfe-marker-v1",
        crate_name,
        definition,
        observation_kind,
    ] {
        hash.update(field.as_bytes());
        hash.update([0]);
    }
    hash.update(local_ordinal.to_be_bytes());
    let digest = hash.finalize();
    let mut marker = u64::from_be_bytes(digest[..8].try_into().expect("SHA-256 prefix"));
    if matches!(marker, 0 | u64::MAX) {
        marker ^= 0xa5a5_a5a5_a5a5_a5a5;
    }
    let identity = CtfeMarkerIdentity {
        crate_name: crate_name.into(),
        definition: definition.into(),
        observation_kind,
        local_ordinal,
    };
    let mut markers = CTFE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    if let Some(existing) = markers.insert(marker, identity.clone())
        && existing != identity
    {
        tcx.dcx().fatal(format!(
            "Supercov CTFE marker collision {marker} between {existing:?} and {identity:?}"
        ));
    }
    drop(markers);
    let mut mappings = CTFE_MAPPINGS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    match mappings.get(&marker) {
        Some(existing) if existing.identity != identity => tcx.dcx().fatal(format!(
            "Supercov CTFE mapping collision {marker} between {existing:?} and {identity:?}"
        )),
        Some(_) => {}
        None => {
            mappings.insert(
                marker,
                CtfeMarkerMapping {
                    identity,
                    hit_ordinals: BTreeSet::new(),
                    decision: None,
                },
            );
        }
    }
    marker
}

fn register_ctfe_hits(tcx: TyCtxt<'_>, marker: u64, hits: impl Iterator<Item = u64>) {
    let mut mappings = CTFE_MAPPINGS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    let mapping = mappings.get_mut(&marker).unwrap_or_else(|| {
        tcx.dcx()
            .fatal(format!("Supercov CTFE marker {marker} has no mapping"))
    });
    mapping.hit_ordinals.extend(hits);
}

fn register_ctfe_decision(tcx: TyCtxt<'_>, marker: u64, decision: CtfeDecisionMapping) {
    let mut mappings = CTFE_MAPPINGS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    let mapping = mappings.get_mut(&marker).unwrap_or_else(|| {
        tcx.dcx()
            .fatal(format!("Supercov CTFE marker {marker} has no mapping"))
    });
    if let Some(existing) = &mapping.decision
        && existing != &decision
    {
        tcx.dcx().fatal(format!(
            "Supercov CTFE marker {marker} maps to both {existing:?} and {decision:?}"
        ));
    }
    mapping.decision = Some(decision);
}

fn ctfe_marker_statement<'tcx>(
    tcx: TyCtxt<'tcx>,
    marker_local: rustc_middle::mir::Local,
    marker: u64,
    span: rustc_span::Span,
) -> Statement<'tcx> {
    Statement::new(
        SourceInfo::outermost(span),
        StatementKind::Assign(Box::new((
            Place::from(marker_local),
            Rvalue::Use(Operand::const_from_scalar(
                tcx,
                tcx.types.u64,
                Scalar::from_u64(marker),
                span,
            )),
        ))),
    )
}

#[derive(Debug)]
struct RuntimeDecisionCondition {
    index: u64,
    entry_block: BasicBlock,
    /// One `(sources, target)` group per MIR site that evaluates this
    /// condition. Usually one, but a condition reached by two paths is lowered
    /// to two switches with their OWN targets — serde_json's
    /// `deserialize_any` has bb46 -> bb48/bb47 and bb62 -> bb64/bb63 for a
    /// single authored condition. A single target cannot represent that, and
    /// probing only one site would report the condition uncovered whenever
    /// execution took the other.
    true_edges: Vec<(Vec<BasicBlock>, BasicBlock)>,
    false_edges: Vec<(Vec<BasicBlock>, BasicBlock)>,
    true_outcome: Option<bool>,
    false_outcome: Option<bool>,
}

/// Structural post-conditions every decision binding must satisfy.
///
/// The invariant that outranks everything is bind exactly or decline, never
/// misbind — and a misbind yields confident wrong numbers rather than no
/// numbers, so fail-closed uniqueness never exercises it. These checks are the
/// automatic half of that guarantee: a binding that picked a plausible but
/// wrong switch generally violates one of them.
/// Structural post-conditions every match binding must satisfy.
///
/// Two arms of a group are alternatives: they cannot both be entered, so they
/// cannot share an entry block, and an arm cannot be its own selection source.
/// A binding that attached an arm to a plausible but wrong block generally
/// violates one of these.
fn verify_match_bindings(plans: &[RuntimeMatchPlan], definition: &str) -> Result<(), String> {
    if let Some(forced) = env::var_os(FORCE_MISBIND)
        && !forced.is_empty()
        && definition.contains(&forced.to_string_lossy().into_owned())
        && let Some(plan) = plans.iter().find(|plan| plan.arms.len() > 1)
    {
        return Err(format!(
            "misbind check: match arms {} and {} in {definition} both enter block {:?} (SUPERCOV_RUST_FORCE_MISBIND fault injection)",
            plan.arms[0].branch_id, plan.arms[1].branch_id, plan.arms[0].entry_block
        ));
    }
    for plan in plans {
        let mut entries = BTreeMap::<u32, &str>::new();
        for arm in &plan.arms {
            if arm.entry_sources.contains(&arm.entry_block) {
                return Err(format!(
                    "misbind check: match arm {} in {definition} lists its own entry {:?} as a selection source",
                    arm.branch_id, arm.entry_block
                ));
            }
            if let Some(other) = entries.insert(arm.entry_block.as_u32(), &arm.branch_id) {
                return Err(format!(
                    "misbind check: match arms {} and {other} in {definition} both enter block {:?}",
                    arm.branch_id, arm.entry_block
                ));
            }
        }
    }
    Ok(())
}

fn verify_decision_bindings(plans: &[RuntimeDecisionPlan], definition: &str) -> Result<(), String> {
    let mut claimed = BTreeMap::<(u32, u32, u32), (String, u64)>::new();
    if let Some(forced) = env::var_os(FORCE_MISBIND)
        && !forced.is_empty()
        && definition.contains(&forced.to_string_lossy().into_owned())
        && let Some(plan) = plans.iter().find(|plan| plan.conditions.len() > 1)
    {
        let first = &plan.conditions[0];
        return Err(format!(
            "misbind check: {} condition 1 in {definition} bound the same switch edge {:?} as {} condition 0 (SUPERCOV_RUST_FORCE_MISBIND fault injection)",
            plan.id,
            (
                first.entry_block.as_u32(),
                first.true_edges.first().map(|(_, t)| t.as_u32()),
                first.false_edges.first().map(|(_, t)| t.as_u32())
            ),
            plan.id,
        ));
    }
    for plan in plans {
        for condition in &plan.conditions {
            let true_targets = condition
                .true_edges
                .iter()
                .map(|(_, target)| *target)
                .collect::<BTreeSet<_>>();
            if condition
                .false_edges
                .iter()
                .any(|(_, target)| true_targets.contains(target))
            {
                return Err(format!(
                    "misbind check: {} condition {} in {definition} selects block {:?} for both outcomes",
                    plan.id, condition.index, true_targets
                ));
            }
            // Two conditions can only share a switch edge if they are the same
            // condition, so a repeat means at least one binding is wrong.
            let edge = (
                condition.entry_block.as_u32(),
                condition.true_edges.len() as u32,
                condition.false_edges.len() as u32,
            );
            if let Some((other, other_index)) =
                claimed.insert(edge, (plan.id.clone(), condition.index))
            {
                return Err(format!(
                    "misbind check: {} condition {} in {definition} bound the same switch edge {edge:?} as {other} condition {other_index}",
                    plan.id, condition.index
                ));
            }
        }
    }
    Ok(())
}

fn nearest_common_dominator(
    dominators: &rustc_data_structures::graph::dominators::Dominators<BasicBlock>,
    first: BasicBlock,
    second: BasicBlock,
) -> Option<BasicBlock> {
    let mut candidate = second;
    loop {
        if dominators.dominates(candidate, first) {
            return Some(candidate);
        }
        candidate = dominators.immediate_dominator(candidate)?;
    }
}

#[derive(Debug)]
struct RuntimeDecisionPlan {
    id: String,
    id_high: u64,
    id_low: u32,
    conditions: Vec<RuntimeDecisionCondition>,
    false_ordinal: u64,
    true_ordinal: u64,
    loop_alternatives: Option<(u64, u64)>,
    loop_source: Option<StableSourceRange>,
    loop_token: Option<rustc_middle::mir::Local>,
}

/// A cached body walk: the unreachable-set version its pruning was done
/// against, and the shared obligations themselves.
type CachedBodyObligations = (u64, Option<Rc<RuntimeBodyObligations>>);

#[derive(Clone)]
struct RuntimeBodyObligations {
    definition: String,
    crate_name: String,
    points: BTreeMap<String, PointObligation>,
    branches: BTreeMap<String, BranchObligation>,
    decisions: BTreeMap<String, DecisionObligation>,
    match_groups: BTreeMap<String, MatchSelectionObligation>,
}

fn decision_outcome_ordinals(
    decision: &DecisionObligation,
    branches: &BTreeMap<String, BranchObligation>,
) -> Result<(u64, u64), String> {
    let outcome_branch = branches.get(&decision.outcome_branch_id).ok_or_else(|| {
        format!(
            "decision {} references missing outcome branch {}",
            decision.identity.id, decision.outcome_branch_id
        )
    })?;
    let expected_kind = if decision.decision_kind == "assertion" {
        "assertion-outcome"
    } else {
        "decision-outcome"
    };
    if outcome_branch.branch_kind != expected_kind {
        return Err(format!(
            "decision {} references {} instead of {expected_kind}",
            decision.identity.id, outcome_branch.branch_kind
        ));
    }
    let labels = if expected_kind == "assertion-outcome" {
        ("failed", "passed")
    } else {
        ("condition false", "condition true")
    };
    let ordinal = |label: &str| {
        outcome_branch
            .alternatives
            .iter()
            .find(|alternative| alternative.label == label)
            .map(|alternative| alternative.identity.probe_ordinal)
            .ok_or_else(|| {
                format!(
                    "decision {} outcome branch lacks {label}",
                    decision.identity.id
                )
            })
    };
    Ok((ordinal(labels.0)?, ordinal(labels.1)?))
}

struct RuntimeLoopBinding {
    alternatives: (u64, u64),
    source: StableSourceRange,
}

fn decision_loop_binding(
    decision: &DecisionObligation,
    branches: &BTreeMap<String, BranchObligation>,
) -> Result<Option<RuntimeLoopBinding>, String> {
    let Some(loop_branch_id) = decision.loop_branch_id.as_deref() else {
        if decision.decision_kind.starts_with("while") {
            return Err(format!(
                "while decision {} has no exact loop-entry branch",
                decision.identity.id
            ));
        }
        return Ok(None);
    };
    if !decision.decision_kind.starts_with("while") {
        return Err(format!(
            "non-loop decision {} references loop-entry branch {loop_branch_id}",
            decision.identity.id
        ));
    }
    let branch = branches.get(loop_branch_id).ok_or_else(|| {
        format!(
            "decision {} references missing loop-entry branch {loop_branch_id}",
            decision.identity.id
        )
    })?;
    if branch.branch_kind != "loop-entry" || branch.discriminator != "loop-entry:while" {
        return Err(format!(
            "decision {} references malformed loop-entry branch {loop_branch_id}",
            decision.identity.id
        ));
    }
    let ordinal = |label: &str| {
        branch
            .alternatives
            .iter()
            .find(|alternative| alternative.label == label)
            .map(|alternative| alternative.identity.probe_ordinal)
            .ok_or_else(|| {
                format!(
                    "decision {} loop-entry branch lacks {label}",
                    decision.identity.id
                )
            })
    };
    Ok(Some(RuntimeLoopBinding {
        alternatives: (ordinal("zero iterations")?, ordinal("entered")?),
        source: branch.identity.source.clone(),
    }))
}

thread_local! {
    /// One HIR walk per body, not one per caller.
    ///
    /// This is a pure function of the body's HIR, and twelve call sites ask
    /// for it — every plan builder and every degrade path — so the same walk
    /// was repeated many times per body. Profiling a 400-function crate put
    /// 86% of samples under the pre-optimization phase, with the collector's
    /// `visit_expr` recursion the dominant frame beneath it.
    /// Body obligations, already pruned, with the unreachable-set version the
    /// pruning was done against.
    static BODY_OBLIGATIONS: RefCell<BTreeMap<u32, CachedBodyObligations>> =
        const { RefCell::new(BTreeMap::new()) };
}

fn runtime_body_obligations(
    tcx: TyCtxt<'_>,
    def_id: LocalDefId,
) -> Option<Rc<RuntimeBodyObligations>> {
    let key = def_id.local_def_index.as_u32();
    let version = UNREACHABLE_MATCH_ARMS_VERSION.load(Ordering::Relaxed);
    // A hit whose pruning was done against the current set is handed back
    // shared. Cloning it meant copying four BTreeMaps on every call, and the
    // binder calls this once per obligation kind per body, which put
    // `clone_subtree` among the hottest frames in the wrapper.
    if let Some(shared) = BODY_OBLIGATIONS.with(|cache| {
        cache
            .borrow()
            .get(&key)
            .filter(|(cached_version, _)| *cached_version == version)
            .map(|(_, obligations)| obligations.clone())
    }) {
        return shared;
    }
    // Either never collected, or collected before an arm became unreachable.
    // The walk is cacheable and the pruning is not, so re-prune from a fresh
    // walk rather than freezing whichever view existed first.
    let mut collected = collect_body_obligations(tcx, def_id);
    if let Some(obligations) = collected.as_mut() {
        prune_unreachable_match_arms(&mut obligations.branches, &mut obligations.match_groups);
    }
    let shared = collected.map(Rc::new);
    BODY_OBLIGATIONS.with(|cache| {
        cache.borrow_mut().insert(key, (version, shared.clone()));
    });
    shared
}

fn collect_body_obligations(tcx: TyCtxt<'_>, def_id: LocalDefId) -> Option<RuntimeBodyObligations> {
    let definition = exact_def_path!(tcx, def_id);
    if definition.contains("__supercov_spike_runtime") {
        return None;
    }
    let hir_body = tcx.hir_maybe_body_owned_by(def_id)?;
    let crate_name = tcx.crate_name(rustc_span::def_id::LOCAL_CRATE).to_string();
    let mut points = BTreeMap::new();
    let mut branches = BTreeMap::new();
    let mut decisions = BTreeMap::new();
    let mut match_groups = BTreeMap::new();
    let mut limitations = BTreeSet::new();
    HirManifestCollector {
        tcx,
        def_id: def_id.to_def_id(),
        crate_name: &crate_name,
        definition: definition.clone(),
        // Function identity occupies the stable owner-local ordinal zero.
        ordinal: 1,
        points: &mut points,
        branches: &mut branches,
        decisions: &mut decisions,
        match_groups: &mut match_groups,
        limitations: &mut limitations,
        control_overrides: BTreeMap::new(),
        eliminated_depth: 0,
        const_unreachable_after: false,
        loop_branch_overrides: BTreeMap::new(),
        decision_logical_expressions: BTreeSet::new(),
        match_context: None,
    }
    .visit_body(hir_body);
    // Pruning is deliberately NOT done here. It reads UNREACHABLE_MATCH_ARMS,
    // which grows as bodies are bound, so its result is a function of when it
    // runs. Only the HIR walk is stable enough to cache; the caller prunes.
    Some(RuntimeBodyObligations {
        definition,
        crate_name,
        points,
        branches,
        decisions,
        match_groups,
    })
}

fn runtime_decision_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeDecisionPlan>, String> {
    BOUND_BODIES.fetch_add(1, Ordering::Relaxed);
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    // Cloned here because this caller consumes the maps; the other four read
    // them through the shared handle.
    let obligations = (*obligations).clone();
    let RuntimeBodyObligations {
        definition,
        crate_name,
        points: _,
        branches,
        decisions,
        match_groups: _,
    } = obligations;
    if decisions.is_empty() {
        return Ok(Vec::new());
    }
    let marked_decisions = STRUCTURAL_DECISION_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| {
            markers
                .iter()
                .map(|marker| marker.decision_id.clone())
                .collect::<BTreeSet<_>>()
        })
        .unwrap_or_default();
    let decisions = decisions
        .values()
        .filter(|decision| !marked_decisions.contains(&decision.identity.id))
        .collect::<Vec<_>>();
    if decisions.is_empty() {
        return Ok(Vec::new());
    }
    let coverage = body.function_coverage_info.as_deref();
    if coverage.is_none() && !tcx.def_span(def_id).from_expansion() {
        return Err(format!(
            "rustc did not retain branch mappings for decision-bearing function {definition}"
        ));
    }
    let mut bcb_blocks = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            if let StatementKind::Coverage(CoverageKind::VirtualCounter { bcb }) = statement.kind {
                bcb_blocks.entry(bcb.as_u32()).or_default().push(block);
            }
        }
    }
    let mut branch_mappings = coverage
        .into_iter()
        .flat_map(|coverage| coverage.mappings.iter())
        .filter_map(|mapping| match mapping.kind {
            MappingKind::Branch {
                true_bcb,
                false_bcb,
            } => Some((mapping.span, true_bcb.as_u32(), false_bcb.as_u32())),
            MappingKind::Code { .. } => None,
        })
        .map(|(span, true_bcb, false_bcb)| -> Result<_, String> {
            let source = stable_source_range(tcx, span, &crate_name)?;
            Ok((source, true_bcb, false_bcb))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let dominators = body.basic_blocks.dominators().clone();
    let mut plans = Vec::new();
    let mut fallback_blocks = BTreeSet::new();
    for decision in decisions {
        if CFG_ELIMINATED_POINTS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .contains(&decision.identity.id)
        {
            // A constant condition decides this branch at compile time, so
            // rustc emits no branch mapping for it: the decision and the
            // outcome branches it owns are unmeasurable in this
            // configuration, never binder defects. Declining them here keeps
            // the body's other decisions planned and measured.
            let mut owned = vec![
                decision.identity.id.clone(),
                decision.outcome_branch_id.clone(),
            ];
            owned.extend(decision.loop_branch_id.clone());
            owned.extend(
                decision
                    .logical_selections
                    .iter()
                    .map(|selection| selection.branch_id.clone()),
            );
            for id in owned {
                degrade_unbound_obligations(
                    DeclineScope::Decisions,
                    tcx,
                    def_id,
                    "bind Rust decision probes",
                    &definition,
                    &unmeasurable(
                        &id,
                        "not compiled in this configuration: a constant condition decides the branch at compile time, so rustc emitted no branch mapping",
                    ),
                );
            }
            continue;
        }
        let digest = decision
            .identity
            .id
            .strip_prefix("rs:decision:")
            .ok_or_else(|| format!("invalid Rust decision ID {}", decision.identity.id))?;
        if digest.len() != 24 {
            return Err(format!("invalid Rust decision digest {digest}"));
        }
        let id_high = u64::from_str_radix(&digest[..16], 16).map_err(|error| {
            format!("invalid Rust decision ID {}: {error}", decision.identity.id)
        })?;
        let id_low = u32::from_str_radix(&digest[16..], 16).map_err(|error| {
            format!("invalid Rust decision ID {}: {error}", decision.identity.id)
        })?;
        let mut conditions = Vec::new();
        for (index, condition) in decision.conditions.iter().enumerate() {
            let mapping_index = branch_mappings
                .iter()
                .position(|(source, _, _)| source == &condition.branch_source);
            let (entry_block, true_edges, false_edges) = if let Some(mapping_index) = mapping_index
            {
                let (_, true_bcb, false_bcb) = branch_mappings.remove(mapping_index);
                let unique_block = |bcb: u32| -> Result<BasicBlock, String> {
                    let blocks = bcb_blocks.get(&bcb).cloned().unwrap_or_default();
                    match blocks.as_slice() {
                        [block] => Ok(*block),
                        // rustc minimises physical counters: a BCB whose
                        // count follows arithmetically from other counters
                        // carries no VirtualCounter statement, so it is
                        // invisible here. Listing the BCBs that do have
                        // counters distinguishes that from a removed
                        // block, which would need the opposite treatment.
                        _ => Err(format!(
                            "coverage block {bcb} for {} maps to {} MIR blocks; \
                                 counters present for BCBs {:?} of {} blocks",
                            decision.identity.id,
                            blocks.len(),
                            bcb_blocks.keys().copied().collect::<Vec<_>>(),
                            body.basic_blocks.len()
                        )),
                    }
                };
                let true_target = unique_block(true_bcb)?;
                let false_target = unique_block(false_bcb)?;
                if true_target == false_target {
                    return Err(format!(
                        "condition {} of {} has one true/false target",
                        index, decision.identity.id
                    ));
                }
                let entry_block = nearest_common_dominator(&dominators, true_target, false_target)
                    .ok_or_else(|| {
                        format!(
                            "condition {} of {} has no common MIR dominator",
                            index, decision.identity.id
                        )
                    })?;
                let incoming = |target: BasicBlock| {
                    body.basic_blocks.predecessors()[target]
                        .iter()
                        .copied()
                        .filter(|source| dominators.dominates(entry_block, *source))
                        .collect::<Vec<_>>()
                };
                let true_sources = incoming(true_target);
                let false_sources = incoming(false_target);
                if true_sources.is_empty() || false_sources.is_empty() {
                    return Err(format!(
                        "condition {} of {} has incomplete terminal edges ({}/{})",
                        index,
                        decision.identity.id,
                        true_sources.len(),
                        false_sources.len()
                    ));
                }
                (
                    entry_block,
                    vec![(true_sources, true_target)],
                    vec![(false_sources, false_target)],
                )
            } else if tcx.def_span(def_id).from_expansion()
                || condition.branch_source != condition.source
                || condition.authored_expression
            {
                // Whether any switch carries the condition's exact range.
                // Exact matches win outright; containment only applies when
                // nothing matches exactly.
                let exact_match_exists = body
                    .basic_blocks
                    .iter_enumerated()
                    .filter(|(block, _)| !fallback_blocks.contains(&block.as_u32()))
                    .any(|(_, data)| {
                        let TerminatorKind::SwitchInt { .. } = &data.terminator().kind else {
                            return false;
                        };
                        stable_source_range(tcx, data.terminator().source_info.span, &crate_name)
                            .is_ok_and(|source| {
                                source == condition.branch_source || source == condition.source
                            })
                    });
                let source_blocks = body
                    .basic_blocks
                    .iter_enumerated()
                    .filter_map(|(block, data)| {
                        if fallback_blocks.contains(&block.as_u32()) {
                            return None;
                        }
                        let TerminatorKind::SwitchInt { discr, targets } = &data.terminator().kind
                        else {
                            return None;
                        };
                        // A let condition (`if let Some(x) = ..`) selects
                        // through a two-way discriminant switch rather than
                        // a typed Boolean one, exactly as in the structural
                        // marker path. Its true edge is the one accepting
                        // the recorded pattern variant.
                        let is_bool = discr.ty(&body.local_decls, tcx) == tcx.types.bool;
                        // Two shapes occur: one value edge with an
                        // `otherwise`, or every variant enumerated with an
                        // unreachable `otherwise` (Option<T> lowers this
                        // way). Both are two-way selections.
                        let pattern_switch = !is_bool
                            && condition.pattern_variant.is_some()
                            && matches!(targets.iter().count(), 1 | 2);
                        if !is_bool && !pattern_switch {
                            return None;
                        }
                        let source = stable_source_range(
                            tcx,
                            data.terminator().source_info.span,
                            &crate_name,
                        )
                        .ok()?;
                        // A condition written inside a macro body keeps
                        // the body's range, while the lowered switch's
                        // span can collapse to a point inside it. Exact
                        // equality is tried first; containment then
                        // accepts the collapsed form. Ambiguity is still
                        // caught below, because more than one match fails.
                        let exact = source == condition.branch_source || source == condition.source;
                        let contained = [&condition.branch_source, &condition.source]
                            .into_iter()
                            .any(|range| {
                                range.key == source.key
                                    && range.start <= source.start
                                    && range.end >= source.end
                            });
                        if !(exact || contained) {
                            return None;
                        }
                        // Containment is a fallback for spans that collapse
                        // to a point, not an equal alternative. Admitting
                        // both at once lets a nested switch inside the
                        // condition's range compete with the condition's
                        // own switch, and the pair then fails as ambiguous.
                        if !exact && exact_match_exists {
                            return None;
                        }
                        if !pattern_switch {
                            return Some((
                                block,
                                targets.target_for_value(1),
                                targets.target_for_value(0),
                            ));
                        }
                        let variant_index = condition.pattern_variant?;
                        let discriminant_local = match discr {
                            Operand::Copy(place) | Operand::Move(place) => place.as_local(),
                            _ => None,
                        }?;
                        let scrutinee = data.statements.iter().rev().find_map(|statement| {
                            let StatementKind::Assign(assignment) = &statement.kind else {
                                return None;
                            };
                            let (destination, value) = &**assignment;
                            let Rvalue::Discriminant(place) = value else {
                                return None;
                            };
                            (destination.as_local() == Some(discriminant_local))
                                .then(|| place.ty(&body.local_decls, tcx).ty.peel_refs())
                        })?;
                        let expected = scrutinee
                            .ty_adt_def()?
                            .discriminant_for_variant(
                                tcx,
                                rustc_abi::VariantIdx::from_u32(variant_index),
                            )
                            .val;
                        let matched = targets
                            .iter()
                            .find(|(value, _)| *value == expected)
                            .map(|(_, target)| target);
                        let refuted = targets
                            .iter()
                            .filter(|(value, _)| *value != expected)
                            .map(|(_, target)| target)
                            .collect::<Vec<_>>();
                        match (matched, refuted.as_slice()) {
                            (Some(matched), []) => Some((block, matched, targets.otherwise())),
                            (Some(matched), [refuted]) => Some((block, matched, *refuted)),
                            // The pattern's own variant is not tested here;
                            // binding it would be a guess.
                            _ => None,
                        }
                    })
                    .collect::<Vec<_>>();
                // A condition reached by two paths is lowered to two
                // switches, each with its OWN targets. Probing only one
                // would report the condition uncovered whenever execution
                // took the other, so bind every site. The misbind
                // post-condition still guards this: it rejects the binding
                // if any true target coincides with a false one.
                if let [_, ..] = source_blocks.as_slice() {
                    let entry_block = source_blocks
                        .iter()
                        .map(|(block, _, _)| *block)
                        .reduce(|left, right| {
                            nearest_common_dominator(&dominators, left, right).unwrap_or(left)
                        })
                        .expect("non-empty source blocks");
                    for (block, _, _) in &source_blocks {
                        fallback_blocks.insert(block.as_u32());
                    }
                    (
                        entry_block,
                        source_blocks
                            .iter()
                            .map(|(block, target, _)| (vec![*block], *target))
                            .collect::<Vec<_>>(),
                        source_blocks
                            .iter()
                            .map(|(block, _, target)| (vec![*block], *target))
                            .collect::<Vec<_>>(),
                    )
                } else {
                    let all_bool_switches = body
                        .basic_blocks
                        .iter_enumerated()
                        .filter_map(|(block, data)| {
                            let TerminatorKind::SwitchInt { discr, .. } = &data.terminator().kind
                            else {
                                return None;
                            };
                            let is_bool = discr.ty(&body.local_decls, tcx) == tcx.types.bool;
                            let range = stable_source_range(
                                tcx,
                                data.terminator().source_info.span,
                                &crate_name,
                            )
                            .map(|range| (range.key, range.start, range.end))
                            .ok();
                            let TerminatorKind::SwitchInt { targets, .. } = &data.terminator().kind
                            else {
                                return None;
                            };
                            Some((
                                block,
                                is_bool,
                                range,
                                fallback_blocks.contains(&block.as_u32()),
                                targets.iter().count(),
                            ))
                        })
                        .collect::<Vec<_>>();
                    return Err(format!(
                        "condition branch_source={:?} source={:?} pattern_variant={:?} pattern_adt={:?}; switches (block, is_bool, range, is_fallback, value_targets)={all_bool_switches:?}; ",
                        (
                            condition.branch_source.key.as_str(),
                            condition.branch_source.start,
                            condition.branch_source.end
                        ),
                        (
                            condition.source.key.as_str(),
                            condition.source.start,
                            condition.source.end
                        ),
                        condition.pattern_variant,
                        condition.pattern_adt,
                    ) + &format!(
                        "could not bind one expanded boolean MIR branch for {} condition {}; found {}",
                        decision.identity.id,
                        index,
                        source_blocks.len()
                    ));
                }
            } else {
                return Err(format!(
                    "rustc branch mapping missing for {} condition {} at {}:{}-{}; available: {:?}",
                    decision.identity.id,
                    index,
                    condition.branch_source.key,
                    condition.branch_source.start,
                    condition.branch_source.end,
                    branch_mappings
                        .iter()
                        .map(|(source, _, _)| format!(
                            "{}:{}-{}:{}",
                            source.key, source.start, source.end, source.class
                        ))
                        .collect::<Vec<_>>(),
                ));
            };
            let (true_edges, false_edges) = if condition.invert_value {
                (false_edges, true_edges)
            } else {
                (true_edges, false_edges)
            };
            conditions.push(RuntimeDecisionCondition {
                index: index as u64,
                entry_block,
                true_edges,
                false_edges,
                true_outcome: condition.true_outcome,
                false_outcome: condition.false_outcome,
            });
        }
        let (false_ordinal, true_ordinal) = decision_outcome_ordinals(decision, &branches)?;
        let loop_binding = decision_loop_binding(decision, &branches)?;
        plans.push(RuntimeDecisionPlan {
            id: decision.identity.id.clone(),
            id_high,
            id_low,
            conditions,
            false_ordinal,
            true_ordinal,
            loop_alternatives: loop_binding.as_ref().map(|binding| binding.alternatives),
            loop_source: loop_binding.map(|binding| binding.source),
            loop_token: None,
        });
    }
    verify_decision_bindings(&plans, &definition)?;
    Ok(plans)
}

fn runtime_logical_selection_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    BOUND_BODIES.fetch_add(1, Ordering::Relaxed);
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    let decision_branches = obligations
        .decisions
        .values()
        .flat_map(|decision| {
            decision
                .logical_selections
                .iter()
                .map(|selection| selection.branch_id.as_str())
        })
        .collect::<BTreeSet<_>>();
    let branches = obligations
        .branches
        .values()
        .filter(|branch| {
            branch.branch_kind == "logical-selection"
                && branch.definitions.contains(&obligations.definition)
                && !decision_branches.contains(branch.identity.id.as_str())
        })
        .collect::<Vec<_>>();
    if branches.is_empty() {
        return Ok(Vec::new());
    }
    // Coverage-ineligible functions (`#[automatically_derived]`,
    // `#[coverage(off)]`) never receive native branch mappings, so their
    // value-position selections bind structurally: each selection's left
    // operand IS a typed Boolean switch findable by its exact mapping source,
    // and its two edges are the evaluated/short-circuited alternatives.
    if body.function_coverage_info.is_none() && !tcx.coverage_attr_on(def_id) {
        let mut branches_by_source = BTreeMap::<(String, u32, u32), Vec<&BranchObligation>>::new();
        for branch in &branches {
            let mapping_source = branch.mapping_source.as_ref().ok_or_else(|| {
                format!(
                    "logical-selection branch {} has no exact left-operand mapping",
                    branch.identity.id
                )
            })?;
            branches_by_source
                .entry((
                    mapping_source.key.clone(),
                    mapping_source.start,
                    mapping_source.end,
                ))
                .or_default()
                .push(branch);
        }
        let mut switches_by_source = BTreeMap::<(String, u32, u32), Vec<BasicBlock>>::new();
        for (block, data) in body.basic_blocks.iter_enumerated() {
            let terminator = data.terminator();
            let TerminatorKind::SwitchInt { discr, .. } = &terminator.kind else {
                continue;
            };
            if discr.ty(&body.local_decls, tcx) != tcx.types.bool {
                continue;
            }
            for span in [
                terminator.source_info.span,
                terminator.source_info.span.source_callsite(),
            ] {
                let Ok(source) = stable_source_range(tcx, span, &obligations.crate_name) else {
                    continue;
                };
                let key = (source.key.clone(), source.start, source.end);
                if branches_by_source.contains_key(&key) {
                    switches_by_source.entry(key).or_default().push(block);
                    break;
                }
            }
        }
        let mut plans = Vec::new();
        for (source, mut source_branches) in branches_by_source {
            let mut switches = switches_by_source.remove(&source).unwrap_or_default();
            switches.sort();
            switches.dedup();
            source_branches.sort_by_key(|branch| branch.identity.owner_local_ordinal);
            let rank = |candidate: BasicBlock, pool: &[BasicBlock]| {
                pool.iter()
                    .filter(|other| {
                        **other != candidate && semantically_before(body, **other, candidate)
                    })
                    .count()
            };
            let pool = switches.clone();
            switches.sort_by_key(|block| rank(*block, &pool));
            if source_branches.len() != switches.len() {
                return Err(format!(
                    "{} logical-selection branches at {}:{}-{} map to {} structural Boolean switches",
                    source_branches.len(),
                    source.0,
                    source.1,
                    source.2,
                    switches.len()
                ));
            }
            if switches
                .iter()
                .enumerate()
                .any(|(index, block)| rank(*block, &pool) != index)
            {
                return Err(format!(
                    "logical-selection switches at {}:{}-{} have no total semantic order",
                    source.0, source.1, source.2
                ));
            }
            for (branch, switch_block) in source_branches.into_iter().zip(switches) {
                let TerminatorKind::SwitchInt { targets, .. } =
                    &body.basic_blocks[switch_block].terminator().kind
                else {
                    unreachable!("collected structural Boolean switch")
                };
                let true_target = targets.target_for_value(1);
                let false_target = targets.target_for_value(0);
                let (evaluated_target, short_target) = match branch.discriminator.as_str() {
                    "logical-selection:and" => (true_target, false_target),
                    "logical-selection:or" => (false_target, true_target),
                    other => {
                        return Err(format!(
                            "logical-selection branch {} has unknown discriminator {other}",
                            branch.identity.id
                        ));
                    }
                };
                let alternative = |label: &str| {
                    branch
                        .alternatives
                        .iter()
                        .find(|alternative| alternative.label == label)
                        .ok_or_else(|| {
                            format!(
                                "logical-selection branch {} lacks {label}",
                                branch.identity.id
                            )
                        })
                };
                let short = alternative("short-circuited")?;
                let evaluated = alternative("right operand evaluated")?;
                plans.push(RuntimeMatchPlan {
                    id: branch.identity.id.clone(),
                    start_block: switch_block,
                    token: None,
                    arms: vec![
                        RuntimeMatchArm {
                            branch_id: short.identity.id.clone(),
                            entry_block: short_target,
                            entry_sources: vec![switch_block],
                            selected_ordinal: short.identity.probe_ordinal,
                        },
                        RuntimeMatchArm {
                            branch_id: evaluated.identity.id.clone(),
                            entry_block: evaluated_target,
                            entry_sources: vec![switch_block],
                            selected_ordinal: evaluated.identity.probe_ordinal,
                        },
                    ],
                });
            }
        }
        return Ok(plans);
    }
    let coverage = body.function_coverage_info.as_deref().ok_or_else(|| {
        format!(
            "rustc did not retain branch mappings for logical-selection function {}",
            obligations.definition
        )
    })?;
    let mut bcb_blocks = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            if let StatementKind::Coverage(CoverageKind::VirtualCounter { bcb }) = statement.kind {
                bcb_blocks.entry(bcb.as_u32()).or_default().push(block);
            }
        }
    }
    let mappings = coverage
        .mappings
        .iter()
        .filter_map(|mapping| match mapping.kind {
            MappingKind::Branch {
                true_bcb,
                false_bcb,
            } => Some((mapping.span, true_bcb.as_u32(), false_bcb.as_u32())),
            MappingKind::Code { .. } => None,
        })
        .map(|(span, true_bcb, false_bcb)| -> Result<_, String> {
            Ok((
                stable_source_range(tcx, span, &obligations.crate_name)?,
                true_bcb,
                false_bcb,
            ))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let dominators = body.basic_blocks.dominators().clone();
    let mut plans = Vec::new();
    let mut failures = Vec::new();
    for branch in branches {
        let failed_id = branch.identity.id.clone();
        let planned = (|| -> Result<RuntimeMatchPlan, String> {
            // A short-circuit whose left operand is a compile-time constant
            // makes no decision at run time, so rustc emits no switch for it:
            // `false && x` never evaluates the right operand and `true && x`
            // always does. Neither is a branch, and the selection is
            // unmeasurable in this configuration rather than a blind spot.
            if CFG_ELIMINATED_POINTS
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .contains(&branch.identity.id)
            {
                return Err(unmeasurable(
                    &branch.identity.id,
                    "not compiled in this configuration: a constant operand decides the short-circuit, so rustc emitted no branch for it",
                ));
            }
            let mapping_source = branch.mapping_source.as_ref().ok_or_else(|| {
                format!(
                    "logical-selection branch {} has no exact left-operand mapping",
                    branch.identity.id
                )
            })?;
            let matches = mappings
                .iter()
                .filter_map(|(source, true_bcb, false_bcb)| {
                    (source == mapping_source).then_some((*true_bcb, *false_bcb))
                })
                .collect::<Vec<_>>();
            let build_selection_plan = |true_target: BasicBlock,
                                        false_target: BasicBlock|
             -> Result<RuntimeMatchPlan, String> {
                let start_block = nearest_common_dominator(&dominators, true_target, false_target)
                    .ok_or_else(|| {
                        format!(
                            "logical-selection branch {} has no common MIR dominator",
                            branch.identity.id
                        )
                    })?;
                let incoming = |target: BasicBlock| {
                    body.basic_blocks.predecessors()[target]
                        .iter()
                        .copied()
                        .filter(|source| dominators.dominates(start_block, *source))
                        .collect::<Vec<_>>()
                };
                let (evaluated_target, short_target) = match branch.discriminator.as_str() {
                    "logical-selection:and" => (true_target, false_target),
                    "logical-selection:or" => (false_target, true_target),
                    other => {
                        return Err(format!(
                            "logical-selection branch {} has unknown discriminator {other}",
                            branch.identity.id
                        ));
                    }
                };
                let evaluated_sources = incoming(evaluated_target);
                let short_sources = incoming(short_target);
                if evaluated_sources.is_empty() || short_sources.is_empty() {
                    return Err(format!(
                        "logical-selection branch {} has incomplete terminal edges ({}/{})",
                        branch.identity.id,
                        short_sources.len(),
                        evaluated_sources.len()
                    ));
                }
                let alternative = |label: &str| {
                    branch
                        .alternatives
                        .iter()
                        .find(|alternative| alternative.label == label)
                        .ok_or_else(|| {
                            format!(
                                "logical-selection branch {} lacks {label}",
                                branch.identity.id
                            )
                        })
                };
                let short = alternative("short-circuited")?;
                let evaluated = alternative("right operand evaluated")?;
                Ok(RuntimeMatchPlan {
                    id: branch.identity.id.clone(),
                    start_block,
                    token: None,
                    arms: vec![
                        RuntimeMatchArm {
                            branch_id: short.identity.id.clone(),
                            entry_block: short_target,
                            entry_sources: short_sources,
                            selected_ordinal: short.identity.probe_ordinal,
                        },
                        RuntimeMatchArm {
                            branch_id: evaluated.identity.id.clone(),
                            entry_block: evaluated_target,
                            entry_sources: evaluated_sources,
                            selected_ordinal: evaluated.identity.probe_ordinal,
                        },
                    ],
                })
            };
            // rustc emits no branch region for a span inside a macro expansion,
            // so a body whose branching is entirely macro-generated yields an
            // EMPTY mapping set — http's `try_append2` and serde_json's
            // `parse_integer` are the cases in the wild, and the diagnostic
            // says `available: []` rather than naming a rival range. Decisions
            // already fall through to finding the switch structurally when the
            // mapping is absent; selections declined instead. Find the
            // short-circuit's own switch by its span, which is what the mapping
            // would have pointed at.
            if matches.is_empty() {
                let structural = body
                    .basic_blocks
                    .iter_enumerated()
                    .filter(|(_, data)| {
                        let TerminatorKind::SwitchInt { discr, .. } = &data.terminator().kind
                        else {
                            return false;
                        };
                        discr.ty(&body.local_decls, tcx) == tcx.types.bool
                            && stable_source_range(
                                tcx,
                                data.terminator().source_info.span,
                                &obligations.crate_name,
                            )
                            .is_ok_and(|range| &range == mapping_source)
                    })
                    .map(|(block, data)| {
                        let TerminatorKind::SwitchInt { targets, .. } = &data.terminator().kind
                        else {
                            unreachable!("filtered to SwitchInt");
                        };
                        // MIR encodes a bool switch as [0: false, otherwise:
                        // true]. Asking for value 1 falls through to the
                        // otherwise arm, which would make both targets the same
                        // block and leave the terminal edges empty.
                        (block, targets.otherwise(), targets.target_for_value(0))
                    })
                    .collect::<Vec<_>>();
                if let [(_, true_target, false_target)] = structural.as_slice() {
                    return build_selection_plan(*true_target, *false_target);
                }
            }
            let [(true_bcb, false_bcb)] = matches.as_slice() else {
                return Err(format!(
                    "logical-selection branch {} maps to {} rustc branches at {}:{}-{}; available: {:?}",
                    branch.identity.id,
                    matches.len(),
                    mapping_source.key,
                    mapping_source.start,
                    mapping_source.end,
                    mappings
                        .iter()
                        .map(|(source, _, _)| format!(
                            "{}:{}-{}:{}",
                            source.key, source.start, source.end, source.class
                        ))
                        .collect::<Vec<_>>()
                ));
            };
            let unique_block = |bcb: u32| -> Result<BasicBlock, String> {
                let blocks = bcb_blocks.get(&bcb).cloned().unwrap_or_default();
                match blocks.as_slice() {
                    [block] => Ok(*block),
                    _ => Err(format!(
                        "logical-selection coverage block {bcb} maps to {} MIR blocks",
                        blocks.len()
                    )),
                }
            };
            build_selection_plan(unique_block(*true_bcb)?, unique_block(*false_bcb)?)
        })();
        match planned {
            Ok(plan) => plans.push(plan),
            Err(error) => failures.push((failed_id, error)),
        }
    }
    for (id, error) in failures {
        // An uncompiled construct is not a binder defect and never fails strict
        // binding; an unbound one still does, so our own gates keep catching
        // real blind spots. Matches how statement probes classify their
        // failures.
        let unmeasurable = error.contains(UNMEASURABLE);
        if !unmeasurable && env::var_os(STRICT_BINDING).is_some_and(|value| !value.is_empty()) {
            tcx.dcx().fatal(format!(
                "Supercov could not bind Rust logical-selection probes in {}: {error}",
                obligations.definition
            ));
        }
        let kind = if unmeasurable {
            "RUST_OBLIGATION_NOT_COMPILED"
        } else {
            "RUST_OBLIGATION_UNBOUND"
        };
        BINDER_LIMITATIONS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(format!(
                "{kind}: bind Rust logical-selection probes in {}: {error}",
                obligations.definition
            ));
        UNMEASURED_OBLIGATIONS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(id);
    }
    Ok(plans)
}

#[derive(Debug)]
struct RuntimePointPlan {
    id: String,
    ordinal: u64,
    block: BasicBlock,
    source_start: u32,
}

fn runtime_statement_plans<'tcx>(
    tcx: TyCtxt<'_>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimePointPlan>, String> {
    BOUND_BODIES.fetch_add(1, Ordering::Relaxed);
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    // Cloned here because this caller consumes the maps; the other four read
    // them through the shared handle.
    let obligations = (*obligations).clone();
    let RuntimeBodyObligations {
        definition,
        crate_name,
        points,
        ..
    } = obligations;
    let assertion_statement_ordinals = ASSERTION_PHASE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .into_iter()
        .flatten()
        .filter_map(|marker| marker.statement_ordinal)
        .collect::<BTreeSet<_>>();
    let statements = points
        .into_iter()
        .filter(|(_, point)| {
            point.point_kind == "statement"
                && !assertion_statement_ordinals.contains(&point.probe_ordinal)
        })
        .collect::<Vec<_>>();
    if statements.is_empty() {
        return Ok(Vec::new());
    }
    let coverage = body.function_coverage_info.as_deref();
    let mut bcb_blocks = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            if let StatementKind::Coverage(CoverageKind::VirtualCounter { bcb }) = statement.kind {
                bcb_blocks.entry(bcb.as_u32()).or_default().push(block);
            }
        }
    }
    let code_mappings = coverage
        .into_iter()
        .flat_map(|coverage| coverage.mappings.iter())
        .filter_map(|mapping| match mapping.kind {
            MappingKind::Code { bcb } => Some((mapping.span, bcb.as_u32())),
            MappingKind::Branch { .. } => None,
        })
        .filter_map(|(span, bcb)| {
            stable_source_range(tcx, span, &crate_name)
                .or_else(|_| stable_source_range(tcx, span.source_callsite(), &crate_name))
                .ok()
                .map(|source| (source, bcb))
        })
        .collect::<Vec<_>>();
    let dominators = body.basic_blocks.dominators().clone();
    let mut plans = Vec::with_capacity(statements.len());
    // Bind every statement that can be bound and record the ones that cannot.
    //
    // Aborting on the first failure left the body with no statement probes at
    // all, while the unmeasurable path declined only the one obligation it
    // named — so every other statement in that body was uninstrumented, never
    // fired, and was reported as uncovered. That is a measurement gap
    // reported as a coverage gap, which this design exists to prevent.
    let mut failures = Vec::new();
    for (id, point) in statements {
        let failed_id = id.clone();
        let planned = (|| -> Result<RuntimePointPlan, String> {
            let mut candidates = code_mappings
                .iter()
                .filter(|(source, _)| {
                    source.key == point.source.key
                        && source.start >= point.source.start
                        && source.end <= point.source.end
                })
                .flat_map(|(_, bcb)| bcb_blocks.get(bcb).into_iter().flatten().copied())
                .collect::<BTreeSet<_>>();
            if candidates.is_empty() {
                candidates.extend(body.basic_blocks.iter_enumerated().filter_map(
                    |(block, data)| {
                        data.statements
                            .iter()
                            .map(|statement| statement.source_info.span)
                            .chain(std::iter::once(data.terminator().source_info.span))
                            .filter_map(|span| {
                                stable_source_range(tcx, span, &crate_name)
                                    .or_else(|_| {
                                        stable_source_range(
                                            tcx,
                                            span.source_callsite(),
                                            &crate_name,
                                        )
                                    })
                                    .ok()
                            })
                            .any(|source| {
                                source.key == point.source.key
                                    && source.start >= point.source.start
                                    && source.end <= point.source.end
                            })
                            .then_some(block)
                    },
                ));
            }
            let mut candidates = candidates.into_iter();
            let Some(mut block) = candidates.next() else {
                let mut mapped = body
                    .basic_blocks
                    .iter()
                    .flat_map(|data| {
                        data.statements
                            .iter()
                            .map(|statement| statement.source_info.span)
                            .chain(std::iter::once(data.terminator().source_info.span))
                    })
                    .filter_map(|span| {
                        stable_source_range(tcx, span, &crate_name)
                            .or_else(|_| {
                                stable_source_range(tcx, span.source_callsite(), &crate_name)
                            })
                            .ok()
                    })
                    .filter(|source| source.key == point.source.key)
                    .map(|source| format!("{}..{}", source.start, source.end))
                    .collect::<Vec<_>>();
                mapped.sort();
                mapped.dedup();
                // Distinguish "not compiled here" from "we could not bind it".
                // A statement inside a branch rustc proved dead — `cfg!` on this
                // target being the common case — has no MIR anywhere: no span in
                // the body overlaps its range. That is not a binder blind spot and
                // must not read as one, and reporting it as uncovered would claim
                // the user has untested code that this build does not contain.
                let overlaps_any_mir = body
                    .basic_blocks
                    .iter()
                    .flat_map(|data| {
                        data.statements
                            .iter()
                            .map(|statement| statement.source_info.span)
                            .chain(std::iter::once(data.terminator().source_info.span))
                    })
                    .filter_map(|span| {
                        stable_source_range(tcx, span, &crate_name)
                            .or_else(|_| {
                                stable_source_range(tcx, span.source_callsite(), &crate_name)
                            })
                            .ok()
                    })
                    .any(|source| {
                        source.key == point.source.key
                            && source.start < point.source.end
                            && source.end > point.source.start
                    });
                if CFG_ELIMINATED_POINTS
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner())
                    .contains(&id)
                {
                    return Err(format!(
                        "statement {id} in {definition} at {}:{}..{} {}",
                        point.source.key,
                        point.source.start,
                        point.source.end,
                        unmeasurable(
                            &id,
                            "not compiled in this configuration: a constant condition eliminates the enclosing branch, so it never reached MIR",
                        )
                    ));
                }
                if !overlaps_any_mir {
                    return Err(format!(
                        "statement {id} in {definition} at {}:{}..{} {}",
                        point.source.key,
                        point.source.start,
                        point.source.end,
                        unmeasurable(
                            &id,
                            &format!(
                                "not compiled in this configuration: no MIR span overlaps it, so the enclosing branch was eliminated before lowering; mapped ranges: {}",
                                mapped.join(", ")
                            )
                        )
                    ));
                }
                return Err(format!(
                    "statement {id} in {definition} at {}:{}..{} has no exact MIR entry mapping; mapped ranges: {}",
                    point.source.key,
                    point.source.start,
                    point.source.end,
                    mapped.join(", ")
                ));
            };
            for candidate in candidates {
                block =
                    nearest_common_dominator(&dominators, block, candidate).ok_or_else(|| {
                        format!("statement {id} in {definition} has disconnected MIR mappings")
                    })?;
            }
            Ok(RuntimePointPlan {
                id,
                ordinal: point.probe_ordinal,
                block,
                source_start: point.source.start,
            })
        })();
        match planned {
            Ok(plan) => plans.push(plan),
            Err(error) => failures.push((failed_id, error)),
        }
    }
    for (id, error) in failures {
        // An uncompiled construct is not a binder defect and never fails
        // strict binding; an unbound one still does, so our own gates keep
        // catching real blind spots.
        let unmeasurable = error.contains(UNMEASURABLE);
        if !unmeasurable && env::var_os(STRICT_BINDING).is_some_and(|value| !value.is_empty()) {
            tcx.dcx().fatal(format!(
                "Supercov could not bind Rust statement probes in {definition}: {error}"
            ));
        }
        let kind = if unmeasurable {
            "RUST_OBLIGATION_NOT_COMPILED"
        } else {
            "RUST_OBLIGATION_UNBOUND"
        };
        BINDER_LIMITATIONS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(format!(
                "{kind}: bind Rust statement probes in {definition}: {error}"
            ));
        UNMEASURED_OBLIGATIONS
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(id);
    }
    // Replacing a block prepends a probe. Visit coalesced source statements in
    // reverse source order so the resulting call chain executes in authored
    // order before the shared optimized MIR block.
    plans.sort_by(|left, right| {
        left.block
            .as_u32()
            .cmp(&right.block.as_u32())
            .then_with(|| right.source_start.cmp(&left.source_start))
            .then_with(|| right.id.cmp(&left.id))
    });
    Ok(plans)
}

#[derive(Debug)]
struct RuntimeForLoopPlan {
    id: String,
    switch_block: BasicBlock,
    zero_target: BasicBlock,
    entered_target: BasicBlock,
    token: Option<rustc_middle::mir::Local>,
    zero_ordinal: u64,
    entered_ordinal: u64,
}

fn option_switch_targets<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &Body<'tcx>,
    block: BasicBlock,
) -> Option<(BasicBlock, BasicBlock)> {
    let TerminatorKind::SwitchInt { discr, targets } = &body.basic_blocks[block].terminator().kind
    else {
        return None;
    };
    let discriminant_local = discr.place()?.as_local()?;
    let enum_place = body.basic_blocks[block]
        .statements
        .iter()
        .rev()
        .find_map(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return None;
            };
            let (destination, value) = &**assignment;
            if destination.as_local() != Some(discriminant_local) {
                return None;
            }
            let Rvalue::Discriminant(place) = value else {
                return None;
            };
            Some(*place)
        })?;
    let ty::Adt(definition, _) = enum_place.ty(&body.local_decls, tcx).ty.kind() else {
        return None;
    };
    let none = tcx.lang_items().option_none_variant()?;
    let some = tcx.lang_items().option_some_variant()?;
    if tcx.parent(none) != definition.did() || tcx.parent(some) != definition.did() {
        return None;
    }
    let none = definition
        .discriminant_for_variant(tcx, definition.variant_index_with_id(none))
        .val;
    let some = definition
        .discriminant_for_variant(tcx, definition.variant_index_with_id(some))
        .val;
    Some((
        targets.target_for_value(none),
        targets.target_for_value(some),
    ))
}

fn runtime_for_loop_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeForLoopPlan>, String> {
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    let for_branches = obligations
        .branches
        .values()
        .filter(|branch| {
            branch.branch_kind == "loop-entry"
                && branch.discriminator == "loop-entry:for"
                && branch.definitions.contains(&obligations.definition)
        })
        .collect::<Vec<_>>();
    let mut plans = Vec::new();
    for branch in &for_branches {
        let zero_ordinal = branch
            .alternatives
            .iter()
            .find(|alternative| alternative.label == "zero iterations")
            .map(|alternative| alternative.identity.probe_ordinal)
            .ok_or_else(|| format!("for branch {} has no zero alternative", branch.identity.id))?;
        let entered_ordinal = branch
            .alternatives
            .iter()
            .find(|alternative| alternative.label == "entered")
            .map(|alternative| alternative.identity.probe_ordinal)
            .ok_or_else(|| {
                format!(
                    "for branch {} has no entered alternative",
                    branch.identity.id
                )
            })?;
        let candidates = body
            .basic_blocks
            .iter_enumerated()
            .filter_map(|(block, data)| {
                let span = data.terminator().source_info.span;
                if span.desugaring_kind() != Some(DesugaringKind::ForLoop) {
                    return None;
                }
                let source =
                    stable_source_range(tcx, span.source_callsite(), &obligations.crate_name)
                        .ok()?;
                if source.key != branch.identity.source.key
                    || source.start < branch.identity.source.start
                    || source.end > branch.identity.source.end
                {
                    return None;
                }
                let owner = for_branches
                    .iter()
                    .filter(|candidate| {
                        candidate.identity.source.key == source.key
                            && candidate.identity.source.start <= source.start
                            && candidate.identity.source.end >= source.end
                    })
                    .min_by_key(|candidate| {
                        candidate
                            .identity
                            .source
                            .end
                            .saturating_sub(candidate.identity.source.start)
                    })?;
                if owner.identity.id != branch.identity.id {
                    return None;
                }
                option_switch_targets(tcx, body, block)
                    .map(|(zero_target, entered_target)| (block, zero_target, entered_target))
            })
            .collect::<Vec<_>>();
        let [(switch_block, zero_target, entered_target)] = candidates.as_slice() else {
            return Err(format!(
                "for branch {} maps to {} exact Option switches",
                branch.identity.id,
                candidates.len()
            ));
        };
        plans.push(RuntimeForLoopPlan {
            id: branch.identity.id.clone(),
            switch_block: *switch_block,
            zero_target: *zero_target,
            entered_target: *entered_target,
            token: None,
            zero_ordinal,
            entered_ordinal,
        });
    }
    Ok(plans)
}

#[derive(Debug)]
struct RuntimeMatchArm {
    branch_id: String,
    entry_block: BasicBlock,
    entry_sources: Vec<BasicBlock>,
    selected_ordinal: u64,
}

#[derive(Debug)]
struct RuntimeMatchPlan {
    id: String,
    start_block: BasicBlock,
    token: Option<rustc_middle::mir::Local>,
    arms: Vec<RuntimeMatchArm>,
}

fn runtime_let_else_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    let marked_branches = LET_ELSE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| {
            markers
                .iter()
                .map(|marker| marker.branch_id.clone())
                .collect::<BTreeSet<_>>()
        })
        .unwrap_or_default();
    let branches = obligations
        .branches
        .values()
        .filter(|branch| {
            branch.branch_kind == "let-else"
                && branch.definitions.contains(&obligations.definition)
                && !marked_branches.contains(&branch.identity.id)
        })
        .collect::<Vec<_>>();
    if branches.is_empty() {
        return Ok(Vec::new());
    }
    let coverage = body.function_coverage_info.as_deref().ok_or_else(|| {
        format!(
            "rustc did not retain branch mappings for let-else function {}",
            obligations.definition
        )
    })?;
    let mut bcb_blocks = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            if let StatementKind::Coverage(CoverageKind::VirtualCounter { bcb }) = statement.kind {
                bcb_blocks.entry(bcb.as_u32()).or_default().push(block);
            }
        }
    }
    let mut mappings = coverage
        .mappings
        .iter()
        .filter_map(|mapping| match mapping.kind {
            MappingKind::Branch {
                true_bcb,
                false_bcb,
            } => Some((mapping.span, true_bcb.as_u32(), false_bcb.as_u32())),
            MappingKind::Code { .. } => None,
        })
        .map(|(span, true_bcb, false_bcb)| {
            stable_source_range(tcx, span, &obligations.crate_name)
                .map(|source| (source, true_bcb, false_bcb))
        })
        .collect::<Result<Vec<_>, _>>()?;
    let dominators = body.basic_blocks.dominators().clone();
    let mut plans = Vec::new();
    for branch in branches {
        let candidates = mappings
            .iter()
            .enumerate()
            .filter_map(|(index, (source, _, _))| {
                (source == &branch.identity.source).then_some(index)
            })
            .collect::<Vec<_>>();
        let [mapping_index] = candidates.as_slice() else {
            return Err(format!(
                "let-else branch {} maps to {} rustc branch regions",
                branch.identity.id,
                candidates.len()
            ));
        };
        let (_, matched_bcb, else_bcb) = mappings.remove(*mapping_index);
        let unique_block = |bcb: u32| -> Result<BasicBlock, String> {
            let blocks = bcb_blocks.get(&bcb).cloned().unwrap_or_default();
            match blocks.as_slice() {
                [block] => Ok(*block),
                _ => Err(format!(
                    "coverage block {bcb} for {} maps to {} MIR blocks",
                    branch.identity.id,
                    blocks.len()
                )),
            }
        };
        let matched_target = unique_block(matched_bcb)?;
        let else_target = unique_block(else_bcb)?;
        let start_block = nearest_common_dominator(&dominators, matched_target, else_target)
            .ok_or_else(|| {
                format!(
                    "let-else branch {} has no common dominator",
                    branch.identity.id
                )
            })?;
        let incoming = |target: BasicBlock| {
            body.basic_blocks.predecessors()[target]
                .iter()
                .copied()
                .filter(|source| dominators.dominates(start_block, *source))
                .collect::<Vec<_>>()
        };
        let matched_sources = incoming(matched_target);
        let else_sources = incoming(else_target);
        if matched_sources.is_empty() || else_sources.is_empty() {
            return Err(format!(
                "let-else branch {} has incomplete terminal edges ({}/{})",
                branch.identity.id,
                matched_sources.len(),
                else_sources.len()
            ));
        }
        let alternative = |label: &str| {
            branch
                .alternatives
                .iter()
                .find(|alternative| alternative.label == label)
                .map(|alternative| {
                    (
                        alternative.identity.id.clone(),
                        alternative.identity.probe_ordinal,
                    )
                })
                .ok_or_else(|| {
                    format!(
                        "let-else branch {} has no {label} alternative",
                        branch.identity.id
                    )
                })
        };
        let (matched_id, matched_ordinal) = alternative("matched")?;
        let (else_id, else_ordinal) = alternative("else")?;
        plans.push(RuntimeMatchPlan {
            id: branch.identity.id.clone(),
            start_block,
            token: None,
            arms: vec![
                RuntimeMatchArm {
                    branch_id: matched_id,
                    entry_block: matched_target,
                    entry_sources: matched_sources,
                    selected_ordinal: matched_ordinal,
                },
                RuntimeMatchArm {
                    branch_id: else_id,
                    entry_block: else_target,
                    entry_sources: else_sources,
                    selected_ordinal: else_ordinal,
                },
            ],
        });
    }
    Ok(plans)
}

fn executable_block_sources(
    tcx: TyCtxt<'_>,
    crate_name: &str,
    body: &Body<'_>,
) -> BTreeMap<BasicBlock, Vec<StableSourceRange>> {
    body.basic_blocks
        .iter_enumerated()
        .map(|(block, data)| {
            let mut sources = data
                .statements
                .iter()
                .filter(|statement| {
                    !matches!(
                        statement.kind,
                        StatementKind::StorageLive(_)
                            | StatementKind::StorageDead(_)
                            | StatementKind::PlaceMention(_)
                            | StatementKind::Coverage(_)
                            | StatementKind::Nop
                    )
                })
                .map(|statement| statement.source_info.span)
                .chain(
                    matches!(
                        data.terminator().kind,
                        TerminatorKind::SwitchInt { .. }
                            | TerminatorKind::Drop { .. }
                            | TerminatorKind::Call { .. }
                            | TerminatorKind::TailCall { .. }
                            | TerminatorKind::Assert { .. }
                            | TerminatorKind::Yield { .. }
                            | TerminatorKind::InlineAsm { .. }
                            | TerminatorKind::Return
                    )
                    .then_some(data.terminator().source_info.span),
                )
                .filter_map(|span| stable_source_range(tcx, span, crate_name).ok())
                .collect::<Vec<_>>();
            sources.sort_by_key(|source| (source.key.clone(), source.start, source.end));
            sources.dedup();
            (block, sources)
        })
        .collect()
}

/// Give the entry block a predecessor by moving its contents into a successor.
///
/// A match arm entered unconditionally on function entry has its body dominated
/// by `bb0`, and `bb0` has no incoming edge to hang a probe on, so the arm
/// bound nowhere and the whole body's match plans were declined. Splitting the
/// entry leaves `bb0` as a bare `goto` into the original contents, which gives
/// the arm exactly the external incoming edge the binder needs. Any edge that
/// targeted the entry is redirected to the continuation so `bb0` keeps one
/// role: entered once per call.
/// The enum variant a match-arm pattern selects, when it selects one.
///
/// Mirrors the derivation used for `if let` decision conditions, which resolves
/// the pattern's qpath to a variant and asks the ADT for its index.
fn arm_pattern_variant<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    pattern: &'tcx hir::Pat<'tcx>,
) -> Option<u32> {
    let typeck = tcx.typeck(def_id);
    let adt = typeck
        .node_type_opt(pattern.hir_id)
        .map(rustc_middle::ty::Ty::peel_refs)
        .and_then(rustc_middle::ty::Ty::ty_adt_def)?;
    let qpath = match pattern.kind {
        hir::PatKind::TupleStruct(ref qpath, ..)
        | hir::PatKind::Struct(ref qpath, ..)
        | hir::PatKind::Expr(&hir::PatExpr {
            kind: hir::PatExprKind::Path(ref qpath),
            ..
        }) => qpath,
        _ => return None,
    };
    let variant_definition = match typeck.qpath_res(qpath, pattern.hir_id) {
        hir::def::Res::Def(DefKind::Ctor(hir::def::CtorOf::Variant, _), constructor) => {
            tcx.parent(constructor)
        }
        hir::def::Res::Def(DefKind::Variant, variant) => variant,
        _ => return None,
    };
    Some(adt.variant_index_with_id(variant_definition).as_u32())
}

fn split_entry_block(body: &mut rustc_middle::mir::Body<'_>) {
    let start = rustc_middle::mir::START_BLOCK;
    let original = body.basic_blocks[start].clone();
    let continuation = body.basic_blocks_mut().push(original);
    for block in body.basic_blocks_mut().iter_mut() {
        block.terminator_mut().successors_mut(|successor| {
            if *successor == start {
                *successor = continuation;
            }
        });
    }
    let blocks = body.basic_blocks_mut();
    blocks[start].statements.clear();
    blocks[start].is_cleanup = false;
    blocks[start].terminator_mut().kind = rustc_middle::mir::TerminatorKind::Goto {
        target: continuation,
    };
}

fn runtime_match_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    BOUND_BODIES.fetch_add(1, Ordering::Relaxed);
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    let marker_ordinals = MATCH_ARM_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .cloned()
        .unwrap_or_default();
    let marker_blocks = body
        .basic_blocks
        .iter_enumerated()
        .flat_map(|(block, data)| {
            data.statements.iter().filter_map({
                let marker_ordinals = &marker_ordinals;
                move |statement| {
                    let StatementKind::Assign(assignment) = &statement.kind else {
                        return None;
                    };
                    let (destination, _) = &**assignment;
                    let local = destination.as_local()?.as_u32();
                    marker_ordinals
                        .get(&local)
                        .copied()
                        .map(|ordinal| (ordinal, block))
                }
            })
        })
        .fold(
            BTreeMap::<u64, BTreeSet<BasicBlock>>::new(),
            |mut blocks, (ordinal, block)| {
                blocks.entry(ordinal).or_default().insert(block);
                blocks
            },
        );
    let dominators = body.basic_blocks.dominators().clone();
    let block_sources = executable_block_sources(tcx, &obligations.crate_name, body);
    let groups = obligations
        .match_groups
        .values()
        .filter(|group| {
            group.definitions.contains(&obligations.definition)
                && (group.identity.provenance != "synthetic-expansion"
                    || group
                        .arms
                        .iter()
                        .all(|arm| marker_blocks.contains_key(&arm.selected_ordinal)))
        })
        .collect::<Vec<_>>();
    let mut plans = Vec::new();
    for group in groups {
        if group.arms.len() < 2 {
            return Err(format!(
                "match selection group {} has fewer than two reachable arms",
                group.identity.id
            ));
        }
        let mut arms = Vec::new();
        for arm in &group.arms {
            let body_blocks = marker_blocks
                .get(&arm.selected_ordinal)
                .cloned()
                .unwrap_or_else(|| {
                    let by_body = block_sources
                        .iter()
                        .filter_map(|(block, sources)| {
                            sources
                                .iter()
                                .any(|source| {
                                    source.key == arm.body_source.key
                                        && source.start >= arm.body_source.start
                                        && source.end <= arm.body_source.end
                                })
                                .then_some(*block)
                        })
                        .collect::<BTreeSet<_>>();
                    // A macro that expands one body fragment into several arms
                    // — either's `for_both!($pattern => $result)` writes
                    // `$result` into both — gives every arm the identical body
                    // span, so the filter above hands them all the same blocks
                    // and the misbind check rightly rejects two arms entering
                    // one block. Spans cannot separate these arms: MIR carries
                    // the scrutinee span on the test blocks, not the arm
                    // patterns. The discriminant can, so keep only the blocks
                    // this arm's variant target reaches.
                    // Never refine arms of an Option match. A `for` loop
                    // desugars to a match on the Option that `next()` yields,
                    // and the for-loop binder rebinds against that same switch
                    // afterwards -- narrowing the arms to their variant targets
                    // leaves it "maps to 0 exact Option switches". #28's
                    // span-equality trigger had been excluding this case by
                    // accident, which is why widening the trigger surfaced it.
                    let option_match = group
                        .pattern_adts
                        .iter()
                        .any(|adt| adt.ends_with("option::Option") || adt == "Option");
                    // A constant-pattern arm carries its switch value in
                    // `pattern_int` rather than a variant index --
                    // serde_json's escape table matches named `u8` consts --
                    // and the switch lookup is identical either way.
                    let switch_value = arm
                        .pattern_variant
                        .map(u128::from)
                        .or(arm.pattern_int)
                        .filter(|_| !option_match);
                    let Some(switch_value) = switch_value else {
                        return by_body;
                    };
                    let refined = body
                        .basic_blocks
                        .iter_enumerated()
                        .filter_map(|(block, data)| match &data.terminator().kind {
                            TerminatorKind::SwitchInt { targets, .. }
                                if by_body
                                    .iter()
                                    .all(|reached| dominators.dominates(block, *reached)) =>
                            {
                                targets
                                    .iter()
                                    .find(|(value, _)| *value == switch_value)
                                    .map(|(_, target)| target)
                            }
                            _ => None,
                        })
                        .map(|target| {
                            by_body
                                .iter()
                                .copied()
                                .filter(|reached| dominators.dominates(target, *reached))
                                .collect::<BTreeSet<_>>()
                        })
                        .find(|refined: &BTreeSet<_>| !refined.is_empty());
                    refined.unwrap_or(by_body)
                });
            if body_blocks.is_empty() {
                // An arm whose body type is uninhabited cannot complete, so
                // it lowers to no blocks of its own — `match void {}` on an
                // empty enum is the common idiom. That is not a binder blind
                // spot, and calling it uncovered would report code that cannot
                // execute as a coverage gap.
                if arm.uninhabited_body {
                    return Err(format!(
                        "match arm {} at {}:{}-{} {}",
                        arm.branch_id,
                        arm.body_source.key,
                        arm.body_source.start,
                        arm.body_source.end,
                        unmeasurable(
                            &arm.branch_id,
                            "arm body lowers to no MIR at all, so it cannot execute in this build"
                        )
                    ));
                }
                return Err(format!(
                    "match arm {} has no authored MIR body blocks at {}:{}-{}",
                    arm.branch_id, arm.body_source.key, arm.body_source.start, arm.body_source.end
                ));
            }
            let entry_block = body_blocks
                .iter()
                .copied()
                .reduce(|left, right| {
                    nearest_common_dominator(&dominators, left, right).unwrap_or(left)
                })
                .ok_or_else(|| format!("match arm {} has no entry block", arm.branch_id))?;
            if !body_blocks
                .iter()
                .all(|block| dominators.dominates(entry_block, *block))
            {
                return Err(format!(
                    "match arm {} has no unique dominating body entry",
                    arm.branch_id
                ));
            }
            let entry_sources = body.basic_blocks.predecessors()[entry_block]
                .iter()
                .copied()
                .filter(|source| !dominators.dominates(entry_block, *source))
                .collect::<Vec<_>>();
            if entry_sources.is_empty() {
                return Err(format!(
                    "match arm {} entry {:?} has no external incoming edge",
                    arm.branch_id, entry_block
                ));
            }
            arms.push(RuntimeMatchArm {
                branch_id: arm.branch_id.clone(),
                entry_block,
                entry_sources,
                selected_ordinal: arm.selected_ordinal,
            });
        }
        let mut arm_entries = arms.iter().map(|arm| arm.entry_block);
        let Some(first) = arm_entries.next() else {
            return Err(format!(
                "match selection group {} has no arms",
                group.identity.id
            ));
        };
        let start_block = arm_entries.try_fold(first, |left, right| {
            nearest_common_dominator(&dominators, left, right)
        });
        let Some(start_block) = start_block else {
            return Err(format!(
                "match selection group {} has no common MIR dominator",
                group.identity.id
            ));
        };
        if !arms
            .iter()
            .all(|arm| dominators.dominates(start_block, arm.entry_block))
        {
            return Err(format!(
                "match selection group {} has an arm outside its start region",
                group.identity.id
            ));
        }
        plans.push(RuntimeMatchPlan {
            id: group.identity.id.clone(),
            start_block,
            token: None,
            arms,
        });
    }
    verify_match_bindings(&plans, &obligations.definition)?;
    Ok(plans)
}

fn structural_marker_boolean_switch<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &Body<'tcx>,
    marker_block: BasicBlock,
    pattern_condition: bool,
) -> Result<BasicBlock, String> {
    let transparent_runtime_calls = [START_BRANCH_FUNCTION, HIT_BRANCH_FUNCTION]
        .into_iter()
        .filter_map(|suffix| find_runtime_function(tcx, suffix))
        .map(LocalDefId::to_def_id)
        .collect::<Vec<_>>();
    let mut current = marker_block;
    let mut visited = BTreeSet::new();
    loop {
        if !visited.insert(current.as_u32()) {
            return Err(format!(
                "marker path from {marker_block:?} cycles before a Boolean switch"
            ));
        }
        let terminator = body.basic_blocks[current].terminator();
        match &terminator.kind {
            TerminatorKind::SwitchInt { discr, targets } => {
                if discr.ty(&body.local_decls, tcx) == tcx.types.bool {
                    return Ok(current);
                }
                // A refutable pattern condition (`while let`) selects through
                // its two-way discriminant switch.
                if pattern_condition && targets.iter().count() == 1 {
                    return Ok(current);
                }
                return Err(format!(
                    "marker path from {marker_block:?} reaches a non-condition switch at {current:?}"
                ));
            }
            TerminatorKind::Goto { target } => current = *target,
            TerminatorKind::Call {
                func,
                target: Some(target),
                ..
            } if matches!(
                func.ty(&body.local_decls, tcx).kind(),
                ty::FnDef(def_id, _) if transparent_runtime_calls.contains(def_id)
            ) =>
            {
                current = *target
            }
            other => {
                return Err(format!(
                    "marker path from {marker_block:?} reaches {current:?} with {other:?} before a Boolean switch"
                ));
            }
        }
    }
}

fn runtime_marked_decision_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeDecisionPlan>, String> {
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    let markers = STRUCTURAL_DECISION_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .cloned()
        .unwrap_or_default();
    if markers.is_empty() {
        return Ok(Vec::new());
    }
    let markers_by_local = markers
        .iter()
        .map(|marker| (marker.local, marker))
        .collect::<BTreeMap<_, _>>();
    let mut blocks_by_local = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            let StatementKind::Assign(assignment) = &statement.kind else {
                continue;
            };
            let (destination, _) = &**assignment;
            let Some(local) = destination.as_local().map(|local| local.as_u32()) else {
                continue;
            };
            if markers_by_local.contains_key(&local) {
                blocks_by_local.entry(local).or_default().push(block);
            }
        }
    }
    let mut markers_by_decision =
        BTreeMap::<String, Vec<&StructuralDecisionConditionMarker>>::new();
    for marker in &markers {
        markers_by_decision
            .entry(marker.decision_id.clone())
            .or_default()
            .push(marker);
    }
    let mut plans = Vec::new();
    for (decision_id, mut decision_markers) in markers_by_decision {
        let decision = obligations.decisions.get(&decision_id).ok_or_else(|| {
            format!(
                "structural marker references unknown decision {decision_id}; reconstructed decisions: {}",
                obligations
                    .decisions
                    .keys()
                    .cloned()
                    .collect::<Vec<_>>()
                    .join(",")
            )
        })?;
        decision_markers.sort_by_key(|marker| marker.condition_index);
        if decision_markers.len() != decision.conditions.len()
            || decision_markers
                .iter()
                .enumerate()
                .any(|(index, marker)| index != marker.condition_index)
        {
            return Err(format!(
                "structural decision {decision_id} has {}/{} ordered condition markers",
                decision_markers.len(),
                decision.conditions.len()
            ));
        }
        let digest = decision_id
            .strip_prefix("rs:decision:")
            .ok_or_else(|| format!("invalid Rust decision ID {decision_id}"))?;
        if digest.len() != 24 {
            return Err(format!("invalid Rust decision digest {digest}"));
        }
        let id_high = u64::from_str_radix(&digest[..16], 16)
            .map_err(|error| format!("invalid Rust decision ID {decision_id}: {error}"))?;
        let id_low = u32::from_str_radix(&digest[16..], 16)
            .map_err(|error| format!("invalid Rust decision ID {decision_id}: {error}"))?;
        let mut conditions = Vec::new();
        for marker in decision_markers {
            let blocks = blocks_by_local
                .get(&marker.local)
                .cloned()
                .unwrap_or_default();
            let [entry_block] = blocks.as_slice() else {
                return Err(format!(
                    "structural decision {decision_id} condition {} marker survived in {} MIR blocks",
                    marker.condition_index,
                    blocks.len()
                ));
            };
            let pattern_condition = decision.conditions[marker.condition_index]
                .pattern_adt
                .is_some();
            let switch_block =
                structural_marker_boolean_switch(tcx, body, *entry_block, pattern_condition)
                    .map_err(|error| {
                        format!(
                            "structural decision {decision_id} condition {} {error}",
                            marker.condition_index
                        )
                    })?;
            let TerminatorKind::SwitchInt { discr, targets } =
                &body.basic_blocks[switch_block].terminator().kind
            else {
                unreachable!("validated structural marker Boolean switch")
            };
            let condition = &decision.conditions[marker.condition_index];
            let (raw_true_target, raw_false_target) = if discr.ty(&body.local_decls, tcx)
                == tcx.types.bool
            {
                (targets.target_for_value(1), targets.target_for_value(0))
            } else if decision.decision_kind != "while-let" {
                // An `if let` discriminant switch has no back edge; the
                // true edge is the one accepting the recorded pattern
                // variant's discriminant.
                let Some(variant_index) = condition.pattern_variant else {
                    return Err(format!(
                        "structural decision {decision_id} condition {} let pattern records no variant to discriminate its switch",
                        marker.condition_index
                    ));
                };
                let discriminant_local = match discr {
                    Operand::Copy(place) | Operand::Move(place) => place.as_local(),
                    _ => None,
                };
                let scrutinee_adt = discriminant_local.and_then(|local| {
                    body.basic_blocks[switch_block]
                        .statements
                        .iter()
                        .rev()
                        .find_map(|statement| {
                            let StatementKind::Assign(assignment) = &statement.kind else {
                                return None;
                            };
                            let (destination, value) = &**assignment;
                            let Rvalue::Discriminant(place) = value else {
                                return None;
                            };
                            if destination.as_local() != Some(local) {
                                return None;
                            }
                            place.ty(&body.local_decls, tcx).ty.peel_refs().ty_adt_def()
                        })
                });
                let Some(scrutinee_adt) = scrutinee_adt else {
                    return Err(format!(
                        "structural decision {decision_id} condition {} pattern switch has no discriminant scrutinee",
                        marker.condition_index
                    ));
                };
                let expected = scrutinee_adt
                    .discriminant_for_variant(tcx, rustc_abi::VariantIdx::from_u32(variant_index))
                    .val;
                let valued = targets.iter().collect::<Vec<_>>();
                let [(value, valued_target)] = valued.as_slice() else {
                    unreachable!("validated two-way pattern switch")
                };
                if *value == expected {
                    (*valued_target, targets.otherwise())
                } else {
                    (targets.otherwise(), *valued_target)
                }
            } else {
                // The matching variant continues the loop and reaches the
                // switch again through the back edge; the refuted variant
                // exits.
                let successors = targets.all_targets();
                let continuing = successors
                    .iter()
                    .copied()
                    .filter(|target| block_reaches(body, *target, switch_block))
                    .collect::<Vec<_>>();
                let [true_target] = continuing.as_slice() else {
                    return Err(format!(
                        "structural decision {decision_id} condition {} pattern switch has {} looping successors",
                        marker.condition_index,
                        continuing.len()
                    ));
                };
                let exits = successors
                    .iter()
                    .copied()
                    .filter(|target| target != true_target)
                    .collect::<Vec<_>>();
                let [false_target] = exits.as_slice() else {
                    return Err(format!(
                        "structural decision {decision_id} condition {} pattern switch has {} exit successors",
                        marker.condition_index,
                        exits.len()
                    ));
                };
                (*true_target, *false_target)
            };
            let (true_target, false_target) = if condition.invert_value {
                (raw_false_target, raw_true_target)
            } else {
                (raw_true_target, raw_false_target)
            };
            conditions.push(RuntimeDecisionCondition {
                index: marker.condition_index as u64,
                entry_block: switch_block,
                true_edges: vec![(vec![switch_block], true_target)],
                false_edges: vec![(vec![switch_block], false_target)],
                true_outcome: condition.true_outcome,
                false_outcome: condition.false_outcome,
            });
        }
        let (false_ordinal, true_ordinal) =
            decision_outcome_ordinals(decision, &obligations.branches)?;
        let loop_binding = decision_loop_binding(decision, &obligations.branches)?;
        plans.push(RuntimeDecisionPlan {
            id: decision_id,
            id_high,
            id_low,
            conditions,
            false_ordinal,
            true_ordinal,
            loop_alternatives: loop_binding.as_ref().map(|binding| binding.alternatives),
            loop_source: loop_binding.map(|binding| binding.source),
            loop_token: None,
        });
    }
    Ok(plans)
}

fn runtime_marked_branch_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
    markers: Vec<StructuralBranchMarker>,
    kind: &str,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    let Some(obligations) = runtime_body_obligations(tcx, def_id) else {
        return Ok(Vec::new());
    };
    if markers.is_empty() {
        return Ok(Vec::new());
    }
    let marker_locals = markers
        .iter()
        .map(|marker| marker.local)
        .collect::<BTreeSet<_>>();
    let mut blocks_by_local = BTreeMap::<u32, Vec<BasicBlock>>::new();
    for (block, data) in body.basic_blocks.iter_enumerated() {
        for statement in &data.statements {
            let StatementKind::Assign(assignment) = &statement.kind else {
                continue;
            };
            let (destination, _) = &**assignment;
            let Some(local) = destination.as_local().map(|local| local.as_u32()) else {
                continue;
            };
            if marker_locals.contains(&local) {
                blocks_by_local.entry(local).or_default().push(block);
            }
        }
    }
    let mut markers_by_branch = BTreeMap::<String, Vec<&StructuralBranchMarker>>::new();
    for marker in &markers {
        markers_by_branch
            .entry(marker.branch_id.clone())
            .or_default()
            .push(marker);
    }
    let dominators = body.basic_blocks.dominators().clone();
    let mut plans = Vec::new();
    for (branch_id, branch_markers) in markers_by_branch {
        let branch = obligations
            .branches
            .get(&branch_id)
            .ok_or_else(|| format!("{kind} marker references unknown branch {branch_id}"))?;
        if branch_markers.len() != 2 {
            return Err(format!(
                "{kind} {branch_id} has {} endpoint markers",
                branch_markers.len()
            ));
        }
        let mut endpoints = Vec::new();
        for marker in branch_markers {
            let blocks = blocks_by_local
                .get(&marker.local)
                .cloned()
                .unwrap_or_default();
            let [entry_block] = blocks.as_slice() else {
                return Err(format!(
                    "{kind} {branch_id} endpoint marker survived in {} MIR blocks",
                    blocks.len()
                ));
            };
            let alternative = branch
                .alternatives
                .iter()
                .find(|alternative| {
                    alternative.identity.probe_ordinal == marker.alternative_ordinal
                })
                .ok_or_else(|| {
                    format!(
                        "{kind} {branch_id} marker has unknown ordinal {}",
                        marker.alternative_ordinal
                    )
                })?;
            endpoints.push((alternative, *entry_block));
        }
        let start_block = nearest_common_dominator(&dominators, endpoints[0].1, endpoints[1].1)
            .ok_or_else(|| format!("{kind} {branch_id} has no common dominator"))?;
        let mut arms = Vec::new();
        for (alternative, entry_block) in endpoints {
            let entry_sources = body.basic_blocks.predecessors()[entry_block]
                .iter()
                .copied()
                .filter(|source| dominators.dominates(start_block, *source))
                .collect::<Vec<_>>();
            if entry_sources.is_empty() {
                return Err(format!(
                    "{kind} {branch_id} endpoint {} has no incoming selection edge",
                    alternative.identity.id
                ));
            }
            arms.push(RuntimeMatchArm {
                branch_id: alternative.identity.id.clone(),
                entry_block,
                entry_sources,
                selected_ordinal: alternative.identity.probe_ordinal,
            });
        }
        plans.push(RuntimeMatchPlan {
            id: branch_id,
            start_block,
            token: None,
            arms,
        });
    }
    verify_match_bindings(&plans, &obligations.definition)?;
    Ok(plans)
}

fn runtime_marked_let_else_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    let markers = LET_ELSE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .cloned()
        .unwrap_or_default();
    runtime_marked_branch_plans(tcx, def_id, body, markers, "synthetic let-else")
}

fn runtime_marked_try_operator_plans<'tcx>(
    tcx: TyCtxt<'tcx>,
    def_id: LocalDefId,
    body: &Body<'tcx>,
) -> Result<Vec<RuntimeMatchPlan>, String> {
    let markers = TRY_OPERATOR_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .cloned()
        .unwrap_or_default();
    runtime_marked_branch_plans(tcx, def_id, body, markers, "try operator")
}

fn strip_match_arm_markers(
    body: &mut Body<'_>,
    def_id: LocalDefId,
    definition: &str,
) -> Result<(), String> {
    let marker_locals = MATCH_ARM_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| markers.keys().copied().collect::<BTreeSet<_>>())
        .unwrap_or_default();
    if marker_locals.is_empty() {
        return Ok(());
    }
    let mut removed = 0;
    for data in body.basic_blocks_mut() {
        data.statements.retain(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return true;
            };
            let (destination, _) = &**assignment;
            let is_marker = destination
                .as_local()
                .is_some_and(|local| marker_locals.contains(&local.as_u32()));
            removed += usize::from(is_marker);
            !is_marker
        });
    }
    if removed != marker_locals.len() {
        return Err(format!(
            "synthetic match markers in {definition} survived borrow checking {removed}/{} times",
            marker_locals.len()
        ));
    }
    Ok(())
}

fn strip_structural_decision_markers(
    body: &mut Body<'_>,
    def_id: LocalDefId,
    definition: &str,
) -> Result<(), String> {
    let marker_locals = STRUCTURAL_DECISION_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| {
            markers
                .iter()
                .map(|marker| marker.local)
                .collect::<BTreeSet<_>>()
        })
        .unwrap_or_default();
    if marker_locals.is_empty() {
        return Ok(());
    }
    let mut removed = 0;
    for data in body.basic_blocks_mut() {
        data.statements.retain(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return true;
            };
            let (destination, _) = &**assignment;
            let is_marker = destination
                .as_local()
                .is_some_and(|local| marker_locals.contains(&local.as_u32()));
            removed += usize::from(is_marker);
            !is_marker
        });
    }
    if removed != marker_locals.len() {
        return Err(format!(
            "structural decision markers in {definition} survived borrow checking {removed}/{} times",
            marker_locals.len()
        ));
    }
    Ok(())
}

fn strip_let_else_markers(
    body: &mut Body<'_>,
    def_id: LocalDefId,
    definition: &str,
) -> Result<(), String> {
    let marker_locals = LET_ELSE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| {
            markers
                .iter()
                .map(|marker| marker.local)
                .collect::<BTreeSet<_>>()
        })
        .unwrap_or_default();
    if marker_locals.is_empty() {
        return Ok(());
    }
    let mut removed = 0;
    for data in body.basic_blocks_mut() {
        data.statements.retain(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return true;
            };
            let (destination, _) = &**assignment;
            let is_marker = destination
                .as_local()
                .is_some_and(|local| marker_locals.contains(&local.as_u32()));
            removed += usize::from(is_marker);
            !is_marker
        });
    }
    if removed != marker_locals.len() {
        return Err(format!(
            "synthetic let-else markers in {definition} survived borrow checking {removed}/{} times",
            marker_locals.len()
        ));
    }
    Ok(())
}

fn strip_try_operator_markers(
    body: &mut Body<'_>,
    def_id: LocalDefId,
    definition: &str,
) -> Result<(), String> {
    let marker_locals = TRY_OPERATOR_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
        .get(&def_id)
        .map(|markers| {
            markers
                .iter()
                .map(|marker| marker.local)
                .collect::<BTreeSet<_>>()
        })
        .unwrap_or_default();
    if marker_locals.is_empty() {
        return Ok(());
    }
    let mut removed = 0;
    for data in body.basic_blocks_mut() {
        data.statements.retain(|statement| {
            let StatementKind::Assign(assignment) = &statement.kind else {
                return true;
            };
            let (destination, _) = &**assignment;
            let is_marker = destination
                .as_local()
                .is_some_and(|local| marker_locals.contains(&local.as_u32()));
            removed += usize::from(is_marker);
            !is_marker
        });
    }
    if removed != marker_locals.len() {
        return Err(format!(
            "try-operator markers in {definition} survived borrow checking {removed}/{} times",
            marker_locals.len()
        ));
    }
    Ok(())
}

/// What match injection did to the CFG, so a later phase can find an edge it
/// recorded beforehand. Two distinct transformations, and a recorded edge can
/// be subject to both: arm bridging interposes a block on an edge, then the
/// selection-start split moves the whole terminator into a new block. Resolving
/// only one leaves the edge unreachable, which is why each half measured as no
/// improvement on its own.
#[derive(Default)]
struct MatchRewrites {
    /// (source, replaced target) -> the bridge now carrying that edge.
    bridges: BTreeMap<(BasicBlock, BasicBlock), BasicBlock>,
    /// block -> the block its terminator moved to when the block was split.
    relocations: BTreeMap<BasicBlock, BasicBlock>,
}

// The binder threads compiler state — tcx, def id, crate name, body,
// output buffers — and grouping it into a struct is the abstract-CFG
// extraction tracked separately, not a rename to satisfy a lint.
#[allow(clippy::too_many_arguments)]
fn instrument_runtime_matches<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &mut [RuntimeMatchPlan],
    start: LocalDefId,
    hit: LocalDefId,
    unit: rustc_middle::mir::Local,
    span: rustc_span::Span,
    rewrites: &mut MatchRewrites,
) -> Result<(), String> {
    let mut starts = BTreeSet::new();
    for plan in plans.iter() {
        if !starts.insert(plan.start_block.as_u32()) {
            return Err(format!(
                "multiple match selection groups begin in MIR block {:?}",
                plan.start_block
            ));
        }
    }

    // Commit selected arms before splitting selection starts. This preserves
    // nested matches: an outer arm commits on the edge entering the inner
    // match's frame, before the inner scrutinee is selected.
    for plan in plans.iter_mut() {
        let token = body.local_decls.push(LocalDecl::new(tcx.types.u64, span));
        for arm in &plan.arms {
            // An or-pattern arm records one entry edge per pattern
            // alternative, so the same source block can appear repeatedly.
            // One bridge per unique source redirects every edge from it.
            for source in &arm
                .entry_sources
                .iter()
                .copied()
                .collect::<BTreeSet<BasicBlock>>()
            {
                let cleanup = body.basic_blocks[*source].is_cleanup;
                let bridge = body.basic_blocks_mut().push(runtime_call_block(
                    tcx,
                    hit,
                    [
                        Operand::Copy(Place::from(token)),
                        Operand::const_from_scalar(
                            tcx,
                            tcx.types.u64,
                            Scalar::from_u64(arm.selected_ordinal),
                            span,
                        ),
                    ]
                    .into_iter(),
                    Place::from(unit),
                    arm.entry_block,
                    span,
                    cleanup,
                ));
                let mut replaced = 0;
                body.basic_blocks_mut()[*source]
                    .terminator_mut()
                    .successors_mut(|target| {
                        if *target == arm.entry_block {
                            *target = bridge;
                            replaced += 1;
                        }
                    });
                if replaced > 0 {
                    rewrites.bridges.insert((*source, arm.entry_block), bridge);
                }
                if replaced == 0
                    && let Some(existing) =
                        rewrites.bridges.get(&(*source, arm.entry_block)).copied()
                {
                    // Nested matches share this edge by design — an outer arm
                    // commits on the edge entering the inner match's frame — so
                    // an earlier plan already redirected source -> entry_block
                    // through its own bridge and the raw edge is gone. Both
                    // arms still have to commit, so chain this bridge onto that
                    // one rather than declaring the edge missing. The map stays
                    // keyed to the first bridge, which remains the block the
                    // edge from `source` actually enters.
                    body.basic_blocks_mut()[existing]
                        .terminator_mut()
                        .successors_mut(|target| {
                            if *target == arm.entry_block {
                                *target = bridge;
                                replaced += 1;
                            }
                        });
                }
                if replaced == 0 {
                    return Err(format!(
                        "match arm {} entry edge from {:?} was not found; entry_block={:?}; entry_sources={:?}; source successors={:?}; plan start={:?}; arms={:?}",
                        arm.branch_id,
                        source,
                        arm.entry_block,
                        arm.entry_sources,
                        body.basic_blocks[*source]
                            .terminator()
                            .successors()
                            .collect::<Vec<_>>(),
                        plan.start_block,
                        plan.arms
                            .iter()
                            .map(|arm| (arm.entry_block, arm.entry_sources.clone()))
                            .collect::<Vec<_>>(),
                    ));
                }
            }
        }
        // Store the local now; its defining call is installed below after all
        // hit edges retain their original source/target identities.
        plan.token = Some(token);
    }

    for plan in plans.iter() {
        let token = plan
            .token
            .ok_or_else(|| format!("match selection group {} has no frame token", plan.id))?;
        let source = plan.start_block;
        let cleanup = body.basic_blocks[source].is_cleanup;
        let original = body.basic_blocks_mut()[source]
            .terminator
            .take()
            .ok_or_else(|| format!("match selection group {} has no start terminator", plan.id))?;
        let continuation = body
            .basic_blocks_mut()
            .push(BasicBlockData::new(Some(original), cleanup));
        let call = runtime_call_block(
            tcx,
            start,
            std::iter::empty(),
            Place::from(token),
            continuation,
            span,
            cleanup,
        );
        body.basic_blocks_mut()[source].terminator = call.terminator;
        rewrites.relocations.insert(source, continuation);
    }
    Ok(())
}

fn instrument_runtime_for_loops<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &mut [RuntimeForLoopPlan],
    start: LocalDefId,
    hit: LocalDefId,
    unit: rustc_middle::mir::Local,
    span: rustc_span::Span,
) -> Result<(), String> {
    for index in 0..plans.len() {
        let dominators = body.basic_blocks.dominators().clone();
        let mut header = dominators
            .immediate_dominator(plans[index].switch_block)
            .ok_or_else(|| format!("for branch {} has no loop header", plans[index].id))?;
        while !matches!(
            body.basic_blocks[header].terminator().kind,
            TerminatorKind::Call { .. }
        ) {
            header = dominators.immediate_dominator(header).ok_or_else(|| {
                format!("for branch {} has no iterator-next call", plans[index].id)
            })?;
        }
        let TerminatorKind::Call {
            destination,
            target: Some(target),
            ..
        } = body.basic_blocks[header].terminator().kind
        else {
            return Err(format!(
                "for branch {} iterator header is not a returning call",
                plans[index].id
            ));
        };
        let ty::Adt(option, _) = destination.ty(&body.local_decls, tcx).ty.kind() else {
            return Err(format!(
                "for branch {} iterator call does not return Option",
                plans[index].id
            ));
        };
        let some = tcx
            .lang_items()
            .option_some_variant()
            .ok_or_else(|| "rustc has no Option::Some lang item".to_owned())?;
        if tcx.parent(some) != option.did()
            || !dominators.dominates(target, plans[index].switch_block)
        {
            return Err(format!(
                "for branch {} iterator call does not lead to its Option switch",
                plans[index].id
            ));
        }
        let cleanup = body.basic_blocks[header].is_cleanup;
        let original = std::mem::replace(
            &mut body.basic_blocks_mut()[header],
            BasicBlockData::new(None, cleanup),
        );
        let iteration_block = body.basic_blocks_mut().push(original);
        for plan in plans.iter_mut() {
            if plan.switch_block == header {
                plan.switch_block = iteration_block;
            }
            if plan.zero_target == header {
                plan.zero_target = iteration_block;
            }
            if plan.entered_target == header {
                plan.entered_target = iteration_block;
            }
        }
        for (predecessor, _) in body.basic_blocks.predecessors()[header]
            .iter()
            .copied()
            .map(|predecessor| (predecessor, dominators.dominates(header, predecessor)))
            .filter(|(_, backedge)| *backedge)
            .collect::<Vec<_>>()
        {
            let predecessor = if predecessor == header {
                iteration_block
            } else {
                predecessor
            };
            let mut replaced = 0;
            body.basic_blocks_mut()[predecessor]
                .terminator_mut()
                .successors_mut(|target| {
                    if *target == header {
                        *target = iteration_block;
                        replaced += 1;
                    }
                });
            if replaced == 0 {
                return Err(format!(
                    "for branch {} lost back edge from {:?}",
                    plans[index].id, predecessor
                ));
            }
        }
        let token = body.local_decls.push(LocalDecl::new(tcx.types.u64, span));
        body.basic_blocks_mut()[header] = runtime_call_block(
            tcx,
            start,
            std::iter::empty(),
            Place::from(token),
            iteration_block,
            span,
            cleanup,
        );
        plans[index].token = Some(token);
    }

    for plan in plans {
        let token = plan
            .token
            .ok_or_else(|| format!("for branch {} has no frame token", plan.id))?;
        for (target, ordinal) in [
            (plan.zero_target, plan.zero_ordinal),
            (plan.entered_target, plan.entered_ordinal),
        ] {
            let cleanup = body.basic_blocks[plan.switch_block].is_cleanup;
            let bridge = body.basic_blocks_mut().push(runtime_call_block(
                tcx,
                hit,
                [
                    Operand::Copy(Place::from(token)),
                    Operand::const_from_scalar(tcx, tcx.types.u64, Scalar::from_u64(ordinal), span),
                ]
                .into_iter(),
                Place::from(unit),
                target,
                span,
                cleanup,
            ));
            let mut replaced = 0;
            body.basic_blocks_mut()[plan.switch_block]
                .terminator_mut()
                .successors_mut(|edge| {
                    if *edge == target {
                        *edge = bridge;
                        replaced += 1;
                    }
                });
            if replaced != 1 {
                return Err(format!(
                    "for branch {} target {:?} replacement count was {replaced}",
                    plan.id, target
                ));
            }
        }
    }
    Ok(())
}

fn instrument_runtime_loop_frames<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &mut [RuntimeDecisionPlan],
    start: LocalDefId,
    span: rustc_span::Span,
) -> Result<(), String> {
    let loop_indices = plans
        .iter()
        .enumerate()
        .filter_map(|(index, plan)| plan.loop_alternatives.map(|_| index))
        .collect::<Vec<_>>();
    for index in loop_indices {
        let condition_entry = plans[index]
            .conditions
            .first()
            .ok_or_else(|| format!("loop decision {} has no conditions", plans[index].id))?
            .entry_block;
        let loop_source = plans[index]
            .loop_source
            .as_ref()
            .ok_or_else(|| format!("loop decision {} has no source range", plans[index].id))?;
        let dominators = body.basic_blocks.dominators().clone();
        let crate_name = tcx.crate_name(rustc_span::def_id::LOCAL_CRATE).to_string();
        let block_is_in_loop = |block: BasicBlock| {
            body.basic_blocks[block]
                .statements
                .iter()
                .map(|statement| statement.source_info.span)
                .chain(std::iter::once(
                    body.basic_blocks[block].terminator().source_info.span,
                ))
                .filter_map(|span| stable_source_range(tcx, span, &crate_name).ok())
                .any(|source| {
                    source.key == loop_source.key
                        && source.start >= loop_source.start
                        && source.end <= loop_source.end
                })
        };
        let back_edges_for = |header: BasicBlock| {
            body.basic_blocks.predecessors()[header]
                .iter()
                .copied()
                .filter(|predecessor| dominators.dominates(header, *predecessor))
                .collect::<Vec<_>>()
        };
        let mut header = condition_entry;
        let mut back_edges = back_edges_for(header);
        while back_edges.is_empty()
            && let Some(parent) = dominators.immediate_dominator(header)
            && block_is_in_loop(parent)
        {
            header = parent;
            back_edges = back_edges_for(header);
        }
        let cleanup = body.basic_blocks[header].is_cleanup;
        let original = std::mem::replace(
            &mut body.basic_blocks_mut()[header],
            BasicBlockData::new(None, cleanup),
        );
        let condition_block = body.basic_blocks_mut().push(original);
        for predecessor in back_edges {
            let predecessor = if predecessor == header {
                condition_block
            } else {
                predecessor
            };
            let mut replaced = 0;
            body.basic_blocks_mut()[predecessor]
                .terminator_mut()
                .successors_mut(|target| {
                    if *target == header {
                        *target = condition_block;
                        replaced += 1;
                    }
                });
            if replaced == 0 {
                return Err(format!(
                    "loop decision {} lost back edge from {:?}",
                    plans[index].id, predecessor
                ));
            }
        }
        for plan in plans.iter_mut() {
            for condition in &mut plan.conditions {
                let source_inside_loop = dominators.dominates(header, condition.entry_block);
                for (sources, target) in condition
                    .true_edges
                    .iter_mut()
                    .chain(&mut condition.false_edges)
                {
                    if source_inside_loop && *target == header {
                        *target = condition_block;
                    }
                    for source in sources.iter_mut() {
                        if *source == header {
                            *source = condition_block;
                        }
                    }
                }
                if condition.entry_block == header {
                    condition.entry_block = condition_block;
                }
            }
        }
        let token = body.local_decls.push(LocalDecl::new(tcx.types.u64, span));
        body.basic_blocks_mut()[header] = runtime_call_block(
            tcx,
            start,
            std::iter::empty(),
            Place::from(token),
            condition_block,
            span,
            cleanup,
        );
        plans[index].loop_token = Some(token);
    }
    Ok(())
}

fn strip_native_coverage(body: &mut Body<'_>) {
    for data in body.basic_blocks_mut() {
        data.statements
            .retain(|statement| !matches!(statement.kind, StatementKind::Coverage(_)));
    }
    body.coverage_info_hi = None;
    body.function_coverage_info = None;
}

fn instrument_runtime_decisions<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &[RuntimeDecisionPlan],
    runtime: DecisionRuntime,
    span: rustc_span::Span,
    snapshots: &[(&str, Vec<Vec<BasicBlock>>)],
    rewrites: &MatchRewrites,
) -> Result<(), String> {
    // Bridges this call has already spliced, keyed by the exact edge each one
    // replaced. Two decision obligations can legitimately observe the same
    // edge, and the first injected redirects it, leaving the second with
    // nothing to replace. Keying by the precise pair lets the second splice
    // onto the first so both fire, in order, on exactly that edge and no other.
    let mut edge_bridges = BTreeMap::<(BasicBlock, BasicBlock), BasicBlock>::new();
    let mut starts = BTreeSet::new();
    for plan in plans {
        let Some(first) = plan.conditions.first() else {
            return Err(format!("decision {} has no conditions", plan.id));
        };
        if !starts.insert(first.entry_block.as_u32()) {
            return Err(format!(
                "multiple decisions begin in MIR block {:?}; nested/shared starts require an explicit ordering",
                first.entry_block
            ));
        }
        let token = body.local_decls.push(LocalDecl::new(tcx.types.u64, span));
        for mapped in &plan.conditions {
            for (value, groups, outcome) in [
                (true, &mapped.true_edges, mapped.true_outcome),
                (false, &mapped.false_edges, mapped.false_outcome),
            ] {
                for (sources, group_target) in groups {
                    for source in sources {
                        let target = *group_target;
                        // Strictly below the exact rule, and in the order match
                        // injection applied its two rewrites. Arm bridging ran
                        // first and is keyed by the block as it was then, so the
                        // target resolves against the ORIGINAL source; the split
                        // came after, so the source resolves last. Reversing this
                        // finds nothing, since the split block no longer carries a
                        // terminator to match against.
                        let mut target = target;
                        for _ in 0..=rewrites.bridges.len() {
                            match rewrites.bridges.get(&(*source, target)).copied() {
                                Some(bridge) => target = bridge,
                                None => break,
                            }
                        }
                        let mut relocated = *source;
                        for _ in 0..=rewrites.relocations.len() {
                            if body.basic_blocks[relocated]
                                .terminator()
                                .successors()
                                .any(|edge| edge == target)
                            {
                                break;
                            }
                            let Some(moved) = rewrites.relocations.get(&relocated).copied() else {
                                break;
                            };
                            relocated = moved;
                        }
                        let source = &relocated;
                        // Strictly below the exact rule: only when the source no
                        // longer carries the recorded edge does a bridge this call
                        // spliced stand in for it, and only one registered for
                        // precisely this pair. Walk the chain, since several plans
                        // may already have claimed the edge. Bounded by the map
                        // size so a cycle can never spin.
                        for _ in 0..=edge_bridges.len() {
                            if body.basic_blocks[*source]
                                .terminator()
                                .successors()
                                .any(|edge| edge == target)
                            {
                                break;
                            }
                            let Some(bridged) = edge_bridges.get(&(*source, target)).copied()
                            else {
                                break;
                            };
                            target = bridged;
                        }
                        let cleanup = body.basic_blocks[*source].is_cleanup;
                        let mut continuation = target;
                        if let Some(outcome) = outcome {
                            continuation = body.basic_blocks_mut().push(runtime_call_block(
                                tcx,
                                runtime.finish,
                                [
                                    Operand::Copy(Place::from(token)),
                                    Operand::const_from_scalar(
                                        tcx,
                                        tcx.types.bool,
                                        Scalar::from_bool(outcome),
                                        span,
                                    ),
                                ]
                                .into_iter(),
                                Place::from(runtime.unit),
                                continuation,
                                span,
                                cleanup,
                            ));
                            if let (Some(token), Some((zero, entered))) =
                                (plan.loop_token, plan.loop_alternatives)
                            {
                                let Some(branch_hit) = runtime.branch_hit else {
                                    return Err(format!(
                                        "loop decision {} has no branch-hit runtime",
                                        plan.id
                                    ));
                                };
                                continuation = body.basic_blocks_mut().push(runtime_call_block(
                                    tcx,
                                    branch_hit,
                                    [
                                        Operand::Copy(Place::from(token)),
                                        Operand::const_from_scalar(
                                            tcx,
                                            tcx.types.u64,
                                            Scalar::from_u64(if outcome { entered } else { zero }),
                                            span,
                                        ),
                                    ]
                                    .into_iter(),
                                    Place::from(runtime.unit),
                                    continuation,
                                    span,
                                    cleanup,
                                ));
                            }
                            continuation = body.basic_blocks_mut().push(runtime_call_block(
                                tcx,
                                runtime.ordinal_hit,
                                std::iter::once(Operand::const_from_scalar(
                                    tcx,
                                    tcx.types.u64,
                                    Scalar::from_u64(if outcome {
                                        plan.true_ordinal
                                    } else {
                                        plan.false_ordinal
                                    }),
                                    span,
                                )),
                                Place::from(runtime.unit),
                                continuation,
                                span,
                                cleanup,
                            ));
                        }
                        let bridge = body.basic_blocks_mut().push(runtime_call_block(
                            tcx,
                            runtime.condition,
                            [
                                Operand::Copy(Place::from(token)),
                                Operand::const_from_scalar(
                                    tcx,
                                    tcx.types.u64,
                                    Scalar::from_u64(mapped.index),
                                    span,
                                ),
                                Operand::const_from_scalar(
                                    tcx,
                                    tcx.types.bool,
                                    Scalar::from_bool(value),
                                    span,
                                ),
                            ]
                            .into_iter(),
                            Place::from(runtime.unit),
                            continuation,
                            span,
                            cleanup,
                        ));
                        let mut replaced = 0;
                        body.basic_blocks_mut()[*source]
                            .terminator_mut()
                            .successors_mut(|edge| {
                                if *edge == target {
                                    *edge = bridge;
                                    replaced += 1;
                                }
                            });
                        if replaced > 0 {
                            edge_bridges.insert((*source, target), bridge);
                        }
                        if replaced == 0 {
                            // Name what the block targets now. Decisions are
                            // injected after match arms and loop frames, and those
                            // insert bridge blocks by rewriting the very edges the
                            // decision plan recorded, so a missing edge may mean
                            // "already redirected through a bridge" rather than
                            // "never existed". The two need opposite fixes.
                            let successors = body.basic_blocks[*source]
                                .terminator()
                                .successors()
                                .collect::<Vec<_>>();
                            return Err(format!(
                                "decision {} condition {} {:?} edge from {:?} to {:?} was not \
                             found; {:?} targeted {:?} across injection phases; {:?} now \
                             targets {:?}, whose own successors are {:?}, reaching {:?}",
                                plan.id,
                                mapped.index,
                                value,
                                source,
                                target,
                                source,
                                snapshots
                                    .iter()
                                    .map(|(phase, blocks)| {
                                        (
                                            *phase,
                                            blocks
                                                .get(source.as_usize())
                                                .cloned()
                                                .unwrap_or_default(),
                                        )
                                    })
                                    .collect::<Vec<_>>(),
                                source,
                                successors,
                                successors
                                    .iter()
                                    .collect::<BTreeSet<_>>()
                                    .into_iter()
                                    .map(|successor| {
                                        (
                                            *successor,
                                            body.basic_blocks[*successor]
                                                .terminator()
                                                .successors()
                                                .collect::<Vec<_>>(),
                                        )
                                    })
                                    .collect::<Vec<_>>(),
                                target
                            ));
                        }
                    }
                }
            }
        }

        let source = first.entry_block;
        let cleanup = body.basic_blocks[source].is_cleanup;
        let original = body.basic_blocks_mut()[source]
            .terminator
            .take()
            .ok_or_else(|| format!("decision {} start block has no terminator", plan.id))?;
        let continuation = body
            .basic_blocks_mut()
            .push(BasicBlockData::new(Some(original), cleanup));
        let call = runtime_call_block(
            tcx,
            runtime.start,
            [
                Operand::const_from_scalar(
                    tcx,
                    tcx.types.u64,
                    Scalar::from_u64(plan.id_high),
                    span,
                ),
                Operand::const_from_scalar(tcx, tcx.types.u32, Scalar::from_u32(plan.id_low), span),
                Operand::const_from_scalar(
                    tcx,
                    tcx.types.u64,
                    Scalar::from_u64(plan.conditions.len() as u64),
                    span,
                ),
            ]
            .into_iter(),
            Place::from(token),
            continuation,
            span,
            cleanup,
        );
        body.basic_blocks_mut()[source].terminator = call.terminator;
    }
    Ok(())
}

#[derive(Clone, Copy)]
struct DecisionRuntime {
    start: LocalDefId,
    condition: LocalDefId,
    finish: LocalDefId,
    ordinal_hit: LocalDefId,
    branch_hit: Option<LocalDefId>,
    unit: rustc_middle::mir::Local,
}

fn optimized_mir_with_probe<'tcx>(tcx: TyCtxt<'tcx>, def_id: LocalDefId) -> &'tcx Body<'tcx> {
    let original = ORIGINAL_OPTIMIZED_MIR
        .get()
        .expect("original optimized_mir provider");
    let body = original(tcx, def_id);
    if env::var_os(INSTRUMENT_MIR).is_none() || tcx.dcx().has_errors().is_some() {
        return body;
    }
    rustc_middle::ty::print::with_no_trimmed_paths!({
        let definition = exact_def_path!(tcx, def_id);
        let mut decision_plans = runtime_decision_plans(tcx, def_id, body)
            .and_then(|plans| match env::var_os(FORCE_UNBOUND_DECISIONS) {
                Some(forced)
                    if !forced.is_empty()
                        && definition.contains(&forced.to_string_lossy().into_owned()) =>
                {
                    Err("SUPERCOV_RUST_FORCE_UNBOUND_DECISIONS fault injection".to_owned())
                }
                _ => Ok(plans),
            })
            .unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Decisions,
                    tcx,
                    def_id,
                    "bind Rust decision probes",
                    &definition,
                    &error,
                );
                Vec::new()
            });
        let mut branch_plans = runtime_let_else_plans(tcx, def_id, body).unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Branches,
                tcx,
                def_id,
                "bind Rust let-else probes",
                &definition,
                &error,
            );
            Vec::new()
        });
        branch_plans.extend(
            runtime_logical_selection_plans(tcx, def_id, body).unwrap_or_else(|error| {
                degrade_unbound_obligations(
                    DeclineScope::Branches,
                    tcx,
                    def_id,
                    "bind Rust logical-selection probes",
                    &definition,
                    &error,
                );
                Vec::new()
            }),
        );
        let statement_plans = runtime_statement_plans(tcx, def_id, body).unwrap_or_else(|error| {
            degrade_unbound_obligations(
                DeclineScope::Statements,
                tcx,
                def_id,
                "bind Rust statement probes",
                &definition,
                &error,
            );
            Vec::new()
        });
        let probe_id = probe_id_for(tcx, def_id, &definition);
        let context_id = context_id_for(tcx, def_id, &definition);
        let has_ordinal_probes =
            probe_id.is_some() || !statement_plans.is_empty() || !decision_plans.is_empty();
        let probe_function = has_ordinal_probes
            .then(|| find_runtime_function(tcx, PROBE_FUNCTION))
            .flatten();
        let enter_context =
            context_id.and_then(|_| find_runtime_function(tcx, ENTER_CONTEXT_FUNCTION));
        let exit_context =
            context_id.and_then(|_| find_runtime_function(tcx, EXIT_TEST_CONTEXT_FUNCTION));
        let start_decision = (!decision_plans.is_empty())
            .then(|| find_runtime_function(tcx, START_DECISION_FUNCTION))
            .flatten();
        let record_condition = (!decision_plans.is_empty())
            .then(|| find_runtime_function(tcx, RECORD_CONDITION_FUNCTION))
            .flatten();
        let finish_decision = (!decision_plans.is_empty())
            .then(|| find_runtime_function(tcx, FINISH_DECISION_FUNCTION))
            .flatten();
        let has_loop_plans = decision_plans
            .iter()
            .any(|plan| plan.loop_alternatives.is_some());
        let has_branch_plans = has_loop_plans || !branch_plans.is_empty();
        let start_branch = has_branch_plans
            .then(|| find_runtime_function(tcx, START_BRANCH_FUNCTION))
            .flatten();
        let hit_branch = has_branch_plans
            .then(|| find_runtime_function(tcx, HIT_BRANCH_FUNCTION))
            .flatten();
        if has_ordinal_probes != probe_function.is_some()
            || context_id.is_some() != (enter_context.is_some() && exit_context.is_some())
            || (!decision_plans.is_empty()
                && (start_decision.is_none()
                    || record_condition.is_none()
                    || finish_decision.is_none()))
            || has_branch_plans != (start_branch.is_some() && hit_branch.is_some())
        {
            tcx.dcx().fatal(format!(
            "Supercov injected runtime functions are incomplete while instrumenting {definition}"
        ));
        }

        let mut instrumented = body.clone();
        let mut match_rewrites = MatchRewrites::default();
        strip_native_coverage(&mut instrumented);
        // Every block's successors before this function injects anything.
        // A recorded edge that is already absent here was rewritten by an
        // earlier compilation phase whose block ids do not correspond to this
        // body; one that is present here was removed by an injection below.
        // The two need different fixes, so the failure has to say which.
        let snapshot = |body: &Body<'_>| {
            body.basic_blocks
                .iter()
                .map(|data| data.terminator().successors().collect::<Vec<_>>())
                .collect::<Vec<_>>()
        };
        let mut snapshots = vec![("before injection", snapshot(&instrumented))];
        let span = tcx.def_span(def_id);
        if probe_id.is_none()
            && context_id.is_none()
            && decision_plans.is_empty()
            && branch_plans.is_empty()
            && statement_plans.is_empty()
        {
            return tcx.arena.alloc(instrumented);
        }
        let unit = instrumented
            .local_decls
            .push(LocalDecl::new(tcx.types.unit, span));
        if let (Some(start), Some(hit)) = (start_branch, hit_branch)
            && let Err(error) = instrument_runtime_matches(
                tcx,
                &mut instrumented,
                &mut branch_plans,
                start,
                hit,
                unit,
                span,
                &mut match_rewrites,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust branch probes",
                &definition,
                &error,
            );
            return body;
        }
        snapshots.push(("after match arms", snapshot(&instrumented)));
        if let Some(start_branch) = start_branch
            && let Err(error) = instrument_runtime_loop_frames(
                tcx,
                &mut instrumented,
                &mut decision_plans,
                start_branch,
                span,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust loop frames",
                &definition,
                &error,
            );
            return body;
        }
        snapshots.push(("after loop frames", snapshot(&instrumented)));
        if let (Some(start), Some(condition), Some(finish)) =
            (start_decision, record_condition, finish_decision)
            && let Err(error) = instrument_runtime_decisions(
                tcx,
                &mut instrumented,
                &decision_plans,
                DecisionRuntime {
                    start,
                    condition,
                    finish,
                    ordinal_hit: probe_function.expect("validated decision ordinal runtime"),
                    branch_hit: hit_branch,
                    unit,
                },
                span,
                &snapshots,
                &match_rewrites,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust decision probes",
                &definition,
                &error,
            );
            return body;
        }
        if let Some(probe_function) = probe_function
            && let Err(error) = instrument_runtime_points(
                tcx,
                &mut instrumented,
                &statement_plans,
                probe_function,
                unit,
                span,
            )
        {
            degrade_unbound_obligations(
                DeclineScope::Body,
                tcx,
                def_id,
                "inject Rust statement probes",
                &definition,
                &error,
            );
            return body;
        }
        let previous_context = context_id.map(|_| {
            instrumented
                .local_decls
                .push(LocalDecl::new(tcx.types.u64, span))
        });
        if let (Some(context_id), Some(previous), Some(exit)) =
            (context_id, previous_context, exit_context)
        {
            let boundary_context =
                Operand::const_from_scalar(tcx, tcx.types.u64, Scalar::from_u64(context_id), span);
            let continuing_unwinds = instrumented
                .basic_blocks
                .iter_enumerated()
                .filter_map(|(block, data)| {
                    matches!(data.terminator().unwind(), Some(UnwindAction::Continue))
                        .then_some(block)
                })
                .collect::<Vec<_>>();
            let exits = instrumented
                .basic_blocks
                .iter_enumerated()
                .filter_map(|(block, data)| {
                    matches!(
                        data.terminator().kind,
                        TerminatorKind::Return | TerminatorKind::UnwindResume
                    )
                    .then_some((block, data.is_cleanup))
                })
                .collect::<Vec<_>>();
            for (block, cleanup) in exits {
                let original = instrumented.basic_blocks[block].terminator().clone();
                let continuation = instrumented
                    .basic_blocks_mut()
                    .push(BasicBlockData::new(Some(original), cleanup));
                instrumented.basic_blocks_mut()[block] = runtime_call_block(
                    tcx,
                    exit,
                    [
                        boundary_context.clone(),
                        Operand::Copy(Place::from(previous)),
                    ]
                    .into_iter(),
                    Place::from(unit),
                    continuation,
                    span,
                    cleanup,
                );
            }
            if !continuing_unwinds.is_empty() {
                let resume = instrumented.basic_blocks_mut().push(BasicBlockData::new(
                    Some(Terminator {
                        source_info: SourceInfo::outermost(span),
                        kind: TerminatorKind::UnwindResume,
                    }),
                    true,
                ));
                let cleanup = instrumented.basic_blocks_mut().push(runtime_call_block(
                    tcx,
                    exit,
                    [
                        boundary_context.clone(),
                        Operand::Copy(Place::from(previous)),
                    ]
                    .into_iter(),
                    Place::from(unit),
                    resume,
                    span,
                    true,
                ));
                for block in continuing_unwinds {
                    *instrumented.basic_blocks_mut()[block]
                        .terminator_mut()
                        .unwind_mut()
                        .expect("collected unwind action") = UnwindAction::Cleanup(cleanup);
                }
            }
        }
        let continuation = {
            let original_start =
                instrumented.basic_blocks_mut()[rustc_middle::mir::START_BLOCK].clone();
            instrumented.basic_blocks_mut().push(original_start)
        };
        let mut entry = continuation;
        if let (Some(probe_id), Some(probe_function)) = (probe_id, probe_function) {
            let block = runtime_call_block(
                tcx,
                probe_function,
                [Operand::const_from_scalar(
                    tcx,
                    tcx.types.u64,
                    Scalar::from_u64(probe_id),
                    span,
                )]
                .into_iter(),
                Place::from(unit),
                entry,
                span,
                false,
            );
            if context_id.is_some() {
                entry = instrumented.basic_blocks_mut().push(block);
            } else {
                instrumented.basic_blocks_mut()[rustc_middle::mir::START_BLOCK] = block;
            }
        }
        if let (Some(context_id), Some(enter), Some(previous)) =
            (context_id, enter_context, previous_context)
        {
            instrumented.basic_blocks_mut()[rustc_middle::mir::START_BLOCK] = runtime_call_block(
                tcx,
                enter,
                [Operand::const_from_scalar(
                    tcx,
                    tcx.types.u64,
                    Scalar::from_u64(context_id),
                    span,
                )]
                .into_iter(),
                Place::from(previous),
                entry,
                span,
                false,
            );
        }
        tcx.arena.alloc(instrumented)
    })
}

fn instrument_runtime_points<'tcx>(
    tcx: TyCtxt<'tcx>,
    body: &mut Body<'tcx>,
    plans: &[RuntimePointPlan],
    probe_function: LocalDefId,
    unit: rustc_middle::mir::Local,
    span: rustc_span::Span,
) -> Result<(), String> {
    for plan in plans {
        if plan.block.index() >= body.basic_blocks.len() {
            return Err(format!(
                "statement {} lost MIR entry block {:?}",
                plan.id, plan.block
            ));
        }
        let cleanup = body.basic_blocks[plan.block].is_cleanup;
        let original = body.basic_blocks[plan.block].clone();
        let continuation = body.basic_blocks_mut().push(original);
        body.basic_blocks_mut()[plan.block] = runtime_call_block(
            tcx,
            probe_function,
            [Operand::const_from_scalar(
                tcx,
                tcx.types.u64,
                Scalar::from_u64(plan.ordinal),
                span,
            )]
            .into_iter(),
            Place::from(unit),
            continuation,
            span,
            cleanup,
        );
    }
    Ok(())
}

fn find_runtime_function(tcx: TyCtxt<'_>, suffix: &str) -> Option<LocalDefId> {
    tcx.hir_crate_items(())
        .foreign_items()
        .map(|item| tcx.hir_foreign_item(item).owner_id.def_id)
        .find(|item| exact_def_path!(tcx, *item).ends_with(suffix))
}

fn runtime_call_block<'tcx>(
    tcx: TyCtxt<'tcx>,
    function: LocalDefId,
    arguments: impl Iterator<Item = Operand<'tcx>>,
    destination: Place<'tcx>,
    target: rustc_middle::mir::BasicBlock,
    span: rustc_span::Span,
    cleanup: bool,
) -> BasicBlockData<'tcx> {
    BasicBlockData::new(
        Some(Terminator {
            source_info: SourceInfo::outermost(span),
            kind: TerminatorKind::Call {
                func: Operand::function_handle(tcx, function.to_def_id(), [], span),
                args: arguments
                    .map(|node| Spanned {
                        node,
                        span: DUMMY_SP,
                    })
                    .collect(),
                destination,
                target: Some(target),
                unwind: if cleanup {
                    UnwindAction::Unreachable
                } else {
                    UnwindAction::Continue
                },
                call_source: CallSource::Misc,
                fn_span: span,
            },
        }),
        cleanup,
    )
}

fn probe_id_for(tcx: TyCtxt<'_>, def_id: LocalDefId, definition: &str) -> Option<u64> {
    if definition.contains("__supercov_spike_runtime")
        || !is_function_body(tcx.def_kind(def_id))
        || is_async_function_constructor(tcx, def_id)
    {
        return None;
    }
    let crate_name = tcx.crate_name(rustc_span::def_id::LOCAL_CRATE).to_string();
    function_identity(tcx, def_id.to_def_id(), tcx.def_span(def_id), &crate_name)
        .ok()
        .map(|identity| identity.probe_ordinal)
}

fn context_id_for(tcx: TyCtxt<'_>, def_id: LocalDefId, definition: &str) -> Option<u64> {
    if matches!(tcx.def_kind(def_id), DefKind::Fn)
        && let Some(test_name) = test_identity_for(tcx, definition)
    {
        return Some(test_context_id(&test_name));
    }
    for (suffix, context_id) in [("context_normal_scope", 303), ("context_panic_scope", 404)] {
        if definition.ends_with(suffix) {
            return Some(context_id);
        }
    }
    None
}

fn libtest_name_for(tcx: TyCtxt<'_>, definition: &str) -> Option<rustc_span::Symbol> {
    tcx.hir_body_owners().find_map(|owner| {
        rustc_hir::find_attr!(tcx, owner, RustcTestMarker(name) => *name)
            .filter(|name| name.as_str() == definition)
    })
}

struct FirstStringLiteral {
    value: Option<rustc_span::Symbol>,
}

impl<'tcx> Visitor<'tcx> for FirstStringLiteral {
    fn visit_expr(&mut self, expression: &'tcx hir::Expr<'tcx>) {
        if self.value.is_none()
            && let hir::ExprKind::Lit(literal) = expression.kind
            && let rustc_ast::LitKind::Str(value, _) = literal.node
        {
            self.value = Some(value);
            return;
        }
        intravisit::walk_expr(self, expression);
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct MergedDoctestDescriptor {
    module: String,
    display_name: String,
    path: String,
    line: u64,
    ignored: bool,
    no_run: bool,
    should_panic: bool,
}

#[derive(Default)]
struct MergedDoctestCallVisitor {
    values: Vec<(String, String, u64, bool, bool, bool)>,
}

impl<'tcx> Visitor<'tcx> for MergedDoctestCallVisitor {
    fn visit_expr(&mut self, expression: &'tcx hir::Expr<'tcx>) {
        if let hir::ExprKind::Call(_, arguments) = expression.kind
            && arguments.len() == 7
            && let hir::ExprKind::Lit(display) = arguments[0].kind
            && let rustc_ast::LitKind::Str(display, _) = display.node
            && let hir::ExprKind::Lit(ignored) = arguments[1].kind
            && let rustc_ast::LitKind::Bool(ignored) = ignored.node
            && let hir::ExprKind::Lit(path) = arguments[2].kind
            && let rustc_ast::LitKind::Str(path, _) = path.node
            && let hir::ExprKind::Lit(line) = arguments[3].kind
            && let rustc_ast::LitKind::Int(line, _) = line.node
            && let hir::ExprKind::Lit(no_run) = arguments[4].kind
            && let rustc_ast::LitKind::Bool(no_run) = no_run.node
            && let hir::ExprKind::Lit(should_panic) = arguments[5].kind
            && let rustc_ast::LitKind::Bool(should_panic) = should_panic.node
            && let Ok(line) = u64::try_from(line.get())
        {
            self.values.push((
                display.as_str().to_owned(),
                path.as_str().to_owned(),
                line,
                ignored,
                no_run,
                should_panic,
            ));
        }
        intravisit::walk_expr(self, expression);
    }
}

fn merged_doctest_descriptor(
    tcx: TyCtxt<'_>,
    definition: &str,
) -> Result<Option<MergedDoctestDescriptor>, String> {
    if DOCTEST_ROLE.get().copied() != Some("merged-runner") {
        return Ok(None);
    }
    let Some(module) = definition.strip_suffix("::TEST") else {
        return Ok(None);
    };
    if !module.starts_with("__doctest_") {
        return Ok(None);
    }
    let owner = tcx
        .hir_body_owners()
        .find(|owner| exact_def_path!(tcx, owner.to_def_id()) == definition)
        .ok_or_else(|| format!("merged doctest descriptor {definition} has no HIR owner"))?;
    let mut visitor = MergedDoctestCallVisitor::default();
    visitor.visit_body(tcx.hir_body_owned_by(owner));
    let [(display_name, path, line, ignored, no_run, should_panic)] = visitor.values.as_slice()
    else {
        return Err(format!(
            "merged doctest descriptor {definition} contains {} candidate constructor calls",
            visitor.values.len()
        ));
    };
    Ok(Some(MergedDoctestDescriptor {
        module: module.to_owned(),
        display_name: display_name.clone(),
        path: path.clone(),
        line: *line,
        ignored: *ignored,
        no_run: *no_run,
        should_panic: *should_panic,
    }))
}

fn write_merged_doctest_map(
    directory: &Path,
    descriptors: &BTreeMap<String, MergedDoctestDescriptor>,
) -> Result<(), String> {
    if descriptors.is_empty() {
        return Ok(());
    }
    let group = env::var(RUSTDOC_GROUP_ID)
        .map_err(|_| "merged doctest runner has no rustdoc group identity".to_owned())?;
    let entries = descriptors
        .values()
        .map(|descriptor| {
            format!(
                concat!(
                    "{{",
                    "\"module\":\"{}\",",
                    "\"displayName\":\"{}\",",
                    "\"path\":\"{}\",",
                    "\"line\":{},",
                    "\"ignored\":{},",
                    "\"noRun\":{},",
                    "\"shouldPanic\":{}",
                    "}}"
                ),
                escape(&descriptor.module),
                escape(&descriptor.display_name),
                escape(&descriptor.path),
                descriptor.line,
                descriptor.ignored,
                descriptor.no_run,
                descriptor.should_panic,
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let payload = format!(
        concat!(
            "{{",
            "\"schema\":\"supercov-rustdoc-merged-map-v2\",",
            "\"group\":\"{}\",",
            "\"entries\":[{}]",
            "}}"
        ),
        escape(&group),
        entries,
    );
    let identity = format!(
        "doctest-map-{}-{}.json",
        std::process::id(),
        sanitize(&group)
    );
    let path = directory.join(&identity);
    let partial = directory.join(format!(".{identity}.partial"));
    let publication = (|| {
        let mut output = OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&partial)
            .map_err(|error| format!("could not create {}: {error}", partial.display()))?;
        output
            .write_all(payload.as_bytes())
            .and_then(|()| output.sync_all())
            .map_err(|error| format!("could not persist {}: {error}", partial.display()))?;
        fs::rename(&partial, &path)
            .map_err(|error| format!("could not publish {}: {error}", path.display()))?;
        OpenOptions::new()
            .read(true)
            .open(directory)
            .and_then(|directory| directory.sync_all())
            .map_err(|error| format!("could not sync {}: {error}", directory.display()))
    })();
    if publication.is_err() {
        let _ = fs::remove_file(&partial);
    }
    publication
}

fn merged_doctest_display_name(tcx: TyCtxt<'_>, definition: &str) -> Option<String> {
    if DOCTEST_ROLE.get().copied() != Some("merged-runner") {
        return None;
    }
    let test_definition = definition.strip_suffix("::{closure#0}")?;
    let owner = tcx
        .hir_body_owners()
        .find(|owner| exact_def_path!(tcx, owner.to_def_id()) == test_definition)?;
    let body = tcx.hir_body_owned_by(owner);
    let mut visitor = FirstStringLiteral { value: None };
    visitor.visit_body(body);
    visitor.value.map(|value| value.as_str().to_owned())
}

fn merged_doctest_module<'a>(definition: &'a str, role: &str) -> Option<&'a str> {
    let module = match role {
        "merged-runner" => definition.strip_suffix("::TEST::{closure#0}")?,
        "merged-bundle" => definition.strip_suffix("::main")?,
        _ => return None,
    };
    module.starts_with("__doctest_").then_some(module)
}

fn test_identity_for(tcx: TyCtxt<'_>, definition: &str) -> Option<String> {
    if let Some(name) = libtest_name_for(tcx, definition) {
        return Some(name.as_str().to_owned());
    }
    match DOCTEST_ROLE.get().copied() {
        Some("standalone") if definition == "main" => {
            let group = env::var(RUSTDOC_GROUP_ID).ok()?;
            let path = env::var("UNSTABLE_RUSTDOC_TEST_PATH").ok()?;
            let catalog_path = env::var_os(RUSTDOC_CATALOG_PATH).map(PathBuf::from)?;
            let metadata = fs::symlink_metadata(&catalog_path).ok()?;
            if !metadata.file_type().is_file() {
                tcx.dcx().fatal(format!(
                    "Supercov rustdoc catalog is not a regular file: {}",
                    catalog_path.display()
                ));
            }
            let catalog: serde_json::Value =
                serde_json::from_slice(&fs::read(&catalog_path).unwrap_or_else(|error| {
                    tcx.dcx().fatal(format!(
                        "Supercov could not read rustdoc catalog {}: {error}",
                        catalog_path.display()
                    ))
                }))
                .unwrap_or_else(|error| {
                    tcx.dcx().fatal(format!(
                        "Supercov could not parse rustdoc catalog {}: {error}",
                        catalog_path.display()
                    ))
                });
            if catalog
                .get("format_version")
                .and_then(serde_json::Value::as_u64)
                != Some(2)
            {
                tcx.dcx()
                    .fatal("Supercov rustdoc catalog has an unsupported format");
            }
            let doctests = catalog
                .get("doctests")
                .and_then(serde_json::Value::as_array)
                .unwrap_or_else(|| tcx.dcx().fatal("Supercov rustdoc catalog has no doctests"));
            let definitions = tcx
                .hir_body_owners()
                .map(|owner| exact_def_path!(tcx, owner.to_def_id()))
                .collect::<Vec<_>>();
            let encoded_path = path
                .chars()
                .map(|character| {
                    if character.is_ascii_alphanumeric() {
                        character
                    } else {
                        '_'
                    }
                })
                .collect::<String>();
            let matches = doctests
                .iter()
                .filter_map(|entry| {
                    let file = entry.get("file")?.as_str()?;
                    let line = entry.get("line")?.as_u64()?;
                    if file.replace('\\', "/") != path.replace('\\', "/") || line == 0 {
                        return None;
                    }
                    let marker = format!("main::_doctest_main_{encoded_path}_{line}_");
                    definitions
                        .iter()
                        .any(|definition| definition.starts_with(&marker))
                        .then(|| (file.to_owned(), line))
                })
                .collect::<Vec<_>>();
            let [(file, line)] = matches.as_slice() else {
                tcx.dcx().fatal(format!(
                    "Supercov could not bind standalone rustdoc compilation to exactly one catalog entry (matched {})",
                    matches.len()
                ));
            };
            Some(format!("rustdoc:{group}:{file}:{line}"))
        }
        Some(role @ ("merged-runner" | "merged-bundle")) => {
            let group = env::var(RUSTDOC_GROUP_ID).ok()?;
            let module = merged_doctest_module(definition, role)?;
            Some(format!("rustdoc:{group}:{module}"))
        }
        _ => None,
    }
}

fn test_context_id(test_name: &str) -> u64 {
    let mut value = 0xcbf2_9ce4_8422_2325_u64;
    for byte in b"supercov-rust-test-v1\0"
        .iter()
        .copied()
        .chain(test_name.bytes())
    {
        value ^= u64::from(byte);
        value = value.wrapping_mul(0x0000_0100_0000_01b3);
    }
    if matches!(value, 0 | u64::MAX) {
        value ^ 0xa5a5_a5a5_a5a5_a5a5
    } else {
        value
    }
}

fn sanitize(value: &str) -> String {
    value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_') {
                character
            } else {
                '_'
            }
        })
        .collect()
}

fn escape(value: &str) -> String {
    // Copy the runs between escapes rather than pushing one character at a
    // time. This was the hottest frame in the wrapper twice over: first as a
    // `Chars` loop, then as a byte scan that still fell back to that loop for
    // canonical strings, which are separated by NUL bytes and therefore ALWAYS
    // need escaping. Runs make the common stretch a memcpy and leave only the
    // handful of escapes to handle individually.
    // A table lookup per byte rather than a match chain, so the common stretch
    // between escapes is a tight scan and only the table hits branch.
    const NEEDS_ESCAPE: [bool; 256] = {
        let mut table = [false; 256];
        let mut index = 0;
        while index < 0x20 {
            table[index] = true;
            index += 1;
        }
        table[b'\\' as usize] = true;
        table[b'"' as usize] = true;
        table
    };
    let bytes = value.as_bytes();
    let mut escaped = String::new();
    let mut copied = 0;
    let mut index = 0;
    while index < bytes.len() {
        if !NEEDS_ESCAPE[bytes[index] as usize] {
            index += 1;
            continue;
        }
        let byte = &bytes[index];
        let replacement = match byte {
            b'\\' => "\\\\",
            b'"' => "\\\"",
            b'\n' => "\\n",
            b'\r' => "\\r",
            b'\t' => "\\t",
            0..=0x1f => {
                if escaped.is_empty() {
                    escaped.reserve(value.len() + 16);
                }
                escaped.push_str(&value[copied..index]);
                // The only remaining controls are ASCII, so the four hex digits
                // are two fixed zeros and one byte.
                const HEX: &[u8; 16] = b"0123456789abcdef";
                escaped.push_str("\\u00");
                escaped.push(char::from(HEX[usize::from(byte >> 4)]));
                escaped.push(char::from(HEX[usize::from(byte & 0x0f)]));
                copied = index + 1;
                index += 1;
                continue;
            }
            _ => unreachable!("table only flags escapable bytes"),
        };
        if escaped.is_empty() {
            escaped.reserve(value.len() + 16);
        }
        escaped.push_str(&value[copied..index]);
        escaped.push_str(replacement);
        copied = index + 1;
        index += 1;
    }
    if copied == 0 {
        return value.to_owned();
    }
    escaped.push_str(&value[copied..]);
    escaped
}

fn json_string(value: Option<&str>) -> String {
    value.map_or_else(|| "null".into(), |value| format!("\"{}\"", escape(value)))
}

fn json_strings(values: &[String]) -> String {
    let values = values
        .iter()
        .map(|value| format!("\"{}\"", escape(value)))
        .collect::<Vec<_>>()
        .join(",");
    format!("[{values}]")
}

fn json_usizes(values: &[usize]) -> String {
    let values = values
        .iter()
        .map(usize::to_string)
        .collect::<Vec<_>>()
        .join(",");
    format!("[{values}]")
}

fn print_companion_handshake() {
    let executable = env::current_exe().expect("resolve compiler companion executable");
    let build_id = format!(
        "{:x}",
        Sha256::digest(fs::read(executable).expect("read compiler companion executable"))
    );
    println!(
        concat!(
            "{{",
            "\"protocolVersion\":1,",
            "\"frontendId\":\"rust\",",
            "\"coverageModelVariant\":\"rust-source-v1\",",
            "\"evidenceSchemaVersion\":3,",
            "\"companionBuildId\":\"{}\",",
            "\"compiler\":{{",
            "\"rustcCommitHash\":\"{}\",",
            "\"rustcRelease\":\"{}\",",
            "\"hostTriple\":\"{}\",",
            "\"rustcDriverSha256\":\"{}\"",
            "}},",
            "\"capabilities\":{{",
            "\"expandedHirProvenance\":true,",
            "\"runtimeMirProbeInsertion\":true,",
            "\"generatedSourceProvenance\":true,",
            "\"ctfePathTracing\":false,",
            "\"rustdocDoctestTracing\":false,",
            "\"exactTestHarnessAttribution\":true",
            "}}",
            "}}"
        ),
        build_id,
        env!("SUPERCOV_COMPANION_RUSTC_COMMIT"),
        env!("SUPERCOV_COMPANION_RUSTC_RELEASE"),
        env!("SUPERCOV_COMPANION_HOST"),
        env!("SUPERCOV_COMPANION_DRIVER_SHA256"),
    );
}

fn main() {
    let mut args = env::args().skip(1).collect::<Vec<_>>();
    if args.as_slice() == ["--supercov-handshake"] {
        print_companion_handshake();
        return;
    }
    if env::args()
        .next()
        .and_then(|argument| {
            PathBuf::from(argument)
                .file_name()
                .map(|name| name.to_owned())
        })
        .is_some_and(|name| name == "supercov-rustdoc-backend-spike")
    {
        launch_rustdoc(&args);
    }
    if env::var_os(RUSTDOC_LAUNCHED).is_some() {
        let role = doctest_role(&args);
        let _ = DOCTEST_ROLE.set(role);
        if role != "merged-runner" {
            strip_injected_rustdoc_unstable_option(&mut args);
            // SAFETY: the compiler companion has not created any threads yet.
            unsafe { env::remove_var("RUSTC_BOOTSTRAP") };
        }
    }
    if env::var_os(INSTRUMENT_MIR).is_some() {
        // Instrumented builds must not run incrementally. The wrapper forces
        // `optimized_mir` for every body so no obligation reaches the manifest
        // unchecked, and cargo's incremental mode then serialises that far
        // larger dep graph and result cache for every unit: on bytes this was
        // the ENTIRE remaining overhead -- 1.19x with incremental, 1.06x
        // without, against an isolated-unit cost of ~1.01x. The cache also buys
        // nothing here, because Supercov compiles an ephemeral workspace that
        // never reuses it. Stripping the flag at the wrapper makes every
        // driver benefit without configuration.
        let mut index = 0;
        while index < args.len() {
            let strip = args[index] == "-C"
                && args
                    .get(index + 1)
                    .is_some_and(|value| value.starts_with("incremental="));
            let strip_joined = args[index].starts_with("-Cincremental=");
            if strip {
                args.drain(index..index + 2);
            } else if strip_joined {
                args.remove(index);
            } else {
                index += 1;
            }
        }
        // Ask the exact rustc companion to retain its THIR-to-MIR branch
        // regions. optimized_mir_with_probe translates those regions into
        // Supercov probes and removes every native coverage artifact before
        // codegen. The exact-version no-profiler-runtime switch prevents rustc
        // from injecting LLVM's profiler crate; the spike also gates absence
        // of native profile output and symbols in the linked executable.
        args.push("--cfg=supercov_spike_instrumented".into());
        args.push("--check-cfg=cfg(supercov_spike_instrumented)".into());
        if let Some(directory) = env::var_os(STATIC_RUNTIME_DIRECTORY) {
            args.push(format!("-Lnative={}", PathBuf::from(directory).display()));
            // `-l static=name` BUNDLES the archive into every rlib, so each
            // instrumented crate carries its own copy of the runtime — 17 MB
            // apiece, paid again per workspace member, and it dominated the
            // link time. The `-bundle` modifier records the dependency and
            // defers the actual archive to the final link, where one copy is
            // all that was ever needed.
            args.push("-lstatic:-bundle=supercov_runtime".into());
        }
    }
    let early_dcx = EarlyDiagCtxt::new(ErrorOutputType::default());
    if let Err(error) = init_companion_logger(env::var_os(INSTRUMENT_CTFE).is_some()) {
        early_dcx.early_fatal(error);
    }
    let mut callbacks = ProbeCallbacks;
    rustc_driver::run_compiler(&args, &mut callbacks);
    if env::var_os(INSTRUMENT_CTFE).is_some() && COMPILATION_SUCCEEDED.load(Ordering::Acquire) {
        let events = CTFE_EVENTS.lock().expect("CTFE events lock");
        if let Err(error) = write_ctfe_outputs(&args, &events) {
            eprintln!("error: Supercov could not publish Rust CTFE evidence: {error}");
            std::process::exit(1);
        }
    }
}

fn launch_rustdoc(args: &[String]) -> ! {
    let rustdoc = env::var_os(REAL_RUSTDOC).expect("exact rustdoc path");
    let companion = env::var_os(COMPANION_PATH).expect("compiler companion path");
    let group = argument_value(args, "--crate-name").expect("rustdoc crate name");
    let mut invocation = Sha256::new();
    invocation.update(b"supercov-rustdoc-invocation-v1\0");
    for argument in args {
        invocation.update(argument.as_bytes());
        invocation.update(b"\0");
    }
    let invocation = format!("{:x}", invocation.finalize());
    let mut command = Command::new(&rustdoc);
    command
        .args(args)
        .arg("-Zunstable-options")
        .arg("--test-builder-wrapper")
        .arg(companion)
        .env("RUSTC_BOOTSTRAP", "1")
        .env(RUSTDOC_LAUNCHED, "1")
        .env(RUSTDOC_GROUP_ID, group);
    let directory = env::var_os(OUTPUT_DIRECTORY).expect("compiler output directory");
    // Rustdoc's own versioned extraction format is the authority for every
    // test identity and execution attribute. Capture it from the identical
    // invocation before running libtest; compiler maps then augment only the
    // merged subset with source/probe translations.
    let catalog = Command::new(&rustdoc)
        .args(args)
        .arg("-Zunstable-options")
        .arg("--output-format=doctest")
        .env("RUSTC_BOOTSTRAP", "1")
        .output()
        .expect("capture exact rustdoc doctest catalog");
    if !catalog.status.success() {
        let _ = io::stdout().write_all(&catalog.stdout);
        let _ = io::stderr().write_all(&catalog.stderr);
        std::process::exit(catalog.status.code().unwrap_or(1));
    }
    let catalog_path =
        PathBuf::from(&directory).join(format!(".rustdoc-catalog-{invocation}.json"));
    if let Err(error) = write_new_synced(&catalog_path, &catalog.stdout) {
        eprintln!("error: Supercov could not persist exact rustdoc catalog: {error}");
        std::process::exit(1);
    }
    command.env(RUSTDOC_CATALOG_PATH, &catalog_path);

    if env::var_os(RUSTDOC_CAPTURE_OUTCOMES).is_none() {
        let status = command.status().expect("launch exact rustdoc");
        if let Err(error) = fs::remove_file(&catalog_path) {
            eprintln!(
                "error: Supercov could not remove exact rustdoc catalog {}: {error}",
                catalog_path.display()
            );
            std::process::exit(1);
        }
        std::process::exit(status.code().unwrap_or(1));
    }

    let engine = env::var_os(RUSTDOC_ENGINE_PATH).expect("Supercov engine path");
    let reservation = Command::new(&engine)
        .arg("__prepare-rustdoc-transport")
        .arg(&directory)
        .arg(&invocation)
        .env_remove(COMPILER_WRAPPER_CONFIG)
        .output()
        .expect("prepare rustdoc transport");
    if !reservation.status.success() {
        let _ = io::stderr().write_all(&reservation.stderr);
        std::process::exit(1);
    }
    let reservation: serde_json::Value =
        serde_json::from_slice(&reservation.stdout).expect("parse rustdoc transport reservation");
    let transport_path = reservation
        .get("path")
        .and_then(serde_json::Value::as_str)
        .expect("rustdoc transport reservation path");
    let transport_token = reservation
        .get("token")
        .and_then(serde_json::Value::as_str)
        .expect("rustdoc transport reservation token");

    command
        .arg("--test-args=-Z unstable-options")
        .arg("--test-args=--format=json")
        .env("SUPERCOV_RUST_TRANSPORT_FILE", transport_path)
        .env("SUPERCOV_RUST_TRANSPORT_TOKEN", transport_token)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    let output = command.output().expect("capture exact rustdoc outcomes");
    if let Err(error) = fs::remove_file(&catalog_path) {
        eprintln!(
            "error: Supercov could not remove exact rustdoc catalog {}: {error}",
            catalog_path.display()
        );
        std::process::exit(1);
    }
    let executable = env::current_exe().expect("resolve compiler companion executable");
    let build_id = format!(
        "{:x}",
        Sha256::digest(fs::read(executable).expect("read compiler companion executable"))
    );
    let mut publisher = Command::new(engine)
        .arg("__publish-rustdoc-outcome")
        .arg(directory)
        .arg(invocation)
        .arg(group)
        .arg(build_id)
        .env_remove(COMPILER_WRAPPER_CONFIG)
        .env("SUPERCOV_RUST_TRANSPORT_FILE", transport_path)
        .env("SUPERCOV_RUST_TRANSPORT_TOKEN", transport_token)
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .expect("launch rustdoc outcome publisher");
    let mut publisher_stdin = publisher.stdin.take().expect("publisher stdin");
    publisher_stdin
        .write_all(
            &u64::try_from(catalog.stdout.len())
                .expect("rustdoc catalog length exceeds u64")
                .to_be_bytes(),
        )
        .and_then(|()| publisher_stdin.write_all(&catalog.stdout))
        .and_then(|()| publisher_stdin.write_all(&output.stdout))
        .expect("write rustdoc catalog and outcome events");
    drop(publisher_stdin);
    let publication = publisher
        .wait_with_output()
        .expect("wait for rustdoc outcome publisher");
    if !publication.status.success() {
        let _ = io::stderr().write_all(&publication.stderr);
        std::process::exit(1);
    }
    let _ = io::stdout().write_all(&output.stdout);
    let _ = io::stderr().write_all(&output.stderr);
    std::process::exit(output.status.code().unwrap_or(1));
}

fn argument_value<'a>(args: &'a [String], option: &str) -> Option<&'a str> {
    args.iter()
        .find_map(|argument| argument.strip_prefix(&format!("{option}=")))
        .or_else(|| {
            args.windows(2)
                .find_map(|pair| (pair[0] == option).then_some(pair[1].as_str()))
        })
}

fn doctest_role(args: &[String]) -> &'static str {
    if env::var_os("UNSTABLE_RUSTDOC_TEST_PATH").is_some() {
        "standalone"
    } else if args
        .iter()
        .any(|argument| argument.contains("doctest_runner_"))
    {
        "merged-runner"
    } else if args
        .iter()
        .any(|argument| argument.contains("doctest_bundle_"))
    {
        "merged-bundle"
    } else {
        "unknown"
    }
}

fn strip_injected_rustdoc_unstable_option(args: &mut [String]) {
    for argument in args {
        let Some(path) = argument.strip_prefix('@') else {
            continue;
        };
        let Ok(contents) = fs::read_to_string(path) else {
            continue;
        };
        let filtered = contents
            .lines()
            .filter(|line| *line != "-Zunstable-options")
            .collect::<Vec<_>>()
            .join("\n");
        if filtered == contents || filtered.len() == contents.len() {
            continue;
        }
        let filtered_path = format!("{path}.supercov-{}", std::process::id());
        let Ok(mut output) = OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&filtered_path)
        else {
            continue;
        };
        if output.write_all(filtered.as_bytes()).is_ok() && output.flush().is_ok() {
            *argument = format!("@{filtered_path}");
        }
    }
}

fn write_new_synced(path: &Path, contents: &[u8]) -> Result<(), String> {
    let mut output = OpenOptions::new()
        .create_new(true)
        .write(true)
        .open(path)
        .map_err(|error| format!("{}: {error}", path.display()))?;
    if env::var(CTFE_WRITE_FAULT).as_deref() == Ok("enospc") {
        output
            .write_all(&contents[..contents.len() / 2])
            .map_err(|error| format!("{}: {error}", path.display()))?;
        output
            .flush()
            .map_err(|error| format!("{}: {error}", path.display()))?;
        return Err(format!(
            "{}: No space left on device (injected CTFE publication fault)",
            path.display()
        ));
    }
    output
        .write_all(contents)
        .map_err(|error| format!("{}: {error}", path.display()))?;
    output
        .sync_all()
        .map_err(|error| format!("{}: {error}", path.display()))?;
    if env::var(CTFE_WRITE_FAULT).as_deref() == Ok("wait-after-write") {
        let ready = env::var(CTFE_WRITE_READY)
            .map_err(|_| format!("{CTFE_WRITE_READY} is required for wait-after-write"))?;
        fs::write(&ready, b"ready").map_err(|error| format!("{ready}: {error}"))?;
        loop {
            std::thread::park();
        }
    }
    Ok(())
}

fn write_ctfe_outputs(args: &[String], events: &[CtfeObservation]) -> Result<(), String> {
    let directory =
        env::var(OUTPUT_DIRECTORY).map_err(|_| format!("{OUTPUT_DIRECTORY} is not set"))?;
    let directory = PathBuf::from(directory);
    fs::create_dir_all(&directory).map_err(|error| format!("{}: {error}", directory.display()))?;
    let crate_name = args
        .iter()
        .find_map(|argument| argument.strip_prefix("--crate-name="))
        .or_else(|| {
            args.windows(2)
                .find_map(|pair| (pair[0] == "--crate-name").then_some(pair[1].as_str()))
        })
        .unwrap_or("unknown");
    let identity = format!("{}-{}", std::process::id(), sanitize(crate_name));
    let markers = CTFE_MARKERS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    let mappings = CTFE_MAPPINGS
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    if mappings.is_empty() && events.is_empty() {
        return Ok(());
    }
    if markers.len() != mappings.len()
        || markers.iter().any(|(marker, marker_identity)| {
            mappings
                .get(marker)
                .is_none_or(|mapping| mapping.identity != *marker_identity)
        })
    {
        return Err("CTFE marker registry and obligation mapping differ".into());
    }
    if mappings
        .values()
        .any(|mapping| mapping.identity.crate_name != crate_name)
    {
        return Err(format!(
            "CTFE mappings crossed compiler crate identity {crate_name}"
        ));
    }
    let event_records = events
        .iter()
        .map(|observation| {
        let Some(identity) = markers.get(&observation.marker) else {
            return Err(format!(
                "observed unregistered CTFE marker {}",
                observation.marker
            ));
        };
        Ok(format!(
            "{{\"crate\":\"{}\",\"kind\":\"ctfe-marker\",\"marker\":\"{}\",\"definition\":\"{}\",\"observationKind\":\"{}\",\"ordinal\":{},\"thread\":\"{}\"}}",
            escape(&identity.crate_name),
            observation.marker,
            escape(&identity.definition),
            identity.observation_kind,
            identity.local_ordinal,
            escape(&observation.thread),
        ))
    })
        .collect::<Result<Vec<_>, String>>()?
        .join(",");
    let mapping_records = mappings
        .iter()
        .map(|(marker, mapping)| {
            let hit_ordinals = mapping
                .hit_ordinals
                .iter()
                .map(u64::to_string)
                .map(|ordinal| format!("\"{ordinal}\""))
                .collect::<Vec<_>>()
                .join(",");
            let decision = mapping.decision.as_ref().map_or_else(
                || "null".into(),
                |decision| {
                    format!(
                        "{{\"id\":\"{}\",\"event\":\"{}\",\"conditionIndex\":{},\"value\":{},\"outcome\":{}}}",
                        escape(&decision.id),
                        decision.event,
                        decision
                            .condition_index
                            .map_or_else(|| "null".into(), |value| value.to_string()),
                        decision
                            .value
                            .map_or_else(|| "null".into(), |value| value.to_string()),
                        decision
                            .outcome
                            .map_or_else(|| "null".into(), |value| value.to_string()),
                    )
                },
            );
            format!(
                "{{\"marker\":\"{marker}\",\"definition\":\"{}\",\"observationKind\":\"{}\",\"ordinal\":{},\"hitOrdinals\":[{hit_ordinals}],\"decision\":{decision}}}",
                escape(&mapping.identity.definition),
                mapping.identity.observation_kind,
                mapping.identity.local_ordinal,
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    let bundle_bytes = format!(
        "{{\"schema\":\"supercov-rust-ctfe-unit-v1\",\"crate\":\"{}\",\"mappings\":[{mapping_records}],\"events\":[{event_records}]}}\n",
        escape(crate_name),
    );
    let final_path = directory.join(format!("ctfe-unit-{identity}.json"));
    let partial_path = directory.join(format!(".ctfe-unit-{identity}.partial"));
    let publication = (|| {
        write_new_synced(&partial_path, bundle_bytes.as_bytes())?;
        fs::rename(&partial_path, &final_path)
            .map_err(|error| format!("{}: {error}", final_path.display()))?;
        let directory_file = OpenOptions::new()
            .read(true)
            .open(&directory)
            .map_err(|error| format!("{}: {error}", directory.display()))?;
        directory_file
            .sync_all()
            .map_err(|error| format!("{}: {error}", directory.display()))
    })();
    if publication.is_err() {
        let _ = fs::remove_file(&partial_path);
    }
    publication
}
