//! Supercov-owned Ruby obligation discovery.
//!
//! Prism (Ruby's own parser) supplies syntax and exact byte ranges. Supercov
//! owns the denominator: every statement, method, decision and branch
//! obligation is decided here, ahead of the run, from source alone.
//!
//! Alongside the shared [`CoverageManifest`] this module emits a *probe plan*
//! for the stdlib-only Ruby runtime. The runtime reads Ruby's `Coverage`
//! module for lines, and proves everything else two ways at once, so that
//! either interpreter generation can pick its own:
//!
//! - **Ruby 3.4+** reads line events only. Asking `Coverage` for `branches`
//!   and `methods` too made every sample rebuild both tables for every loaded
//!   file (7 ms per sample with 550 files, five samples per test), which was
//!   80% of the runtime's cost. Instead, the statement that starts a branch
//!   body or a method body proves the branch, the method and the decision
//!   outcome it witnesses (the `implied` map), and what has no such statement
//!   — an else-less or modifier `if`, a ternary, `&.`, a `case` without
//!   `else`, an empty body — gets a probe. Probes also prove what `Coverage`
//!   never sees: the operands of `&&`/`||` for MC/DC, `||=`, loop entry,
//!   `rescue` flow and a second statement on a line.
//! - **Ruby 3.3** cannot apply the insertions (it does not cover code compiled
//!   by a load hook), so it keeps asking `Coverage` for branches and methods
//!   and proves those obligations by matching its keys in the untouched
//!   source; the probe-only remainder is declared unmeasured.
//!
//! No insertion contains a newline, so line numbers, backtraces and the
//! stdlib line table stay exact.

use std::collections::{BTreeMap, BTreeSet};

use ruby_prism::{
    AndNode, BeginNode, CallNode, CaseMatchNode, CaseNode, DefNode, ForNode, IfNode, Location,
    Node, OrNode, RescueModifierNode, RescueNode, StatementsNode, UnlessNode, UntilNode, Visit,
    WhileNode,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Digest, Sha256};

use crate::{
    coverage_analysis::PointKind,
    coverage_report::{
        BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
    },
};

pub const RUBY_PROBE_PLAN_VERSION: u32 = 1;
/// Global the runtime binds its probe receiver to. Chosen to be unpronounceable
/// in application code.
pub const RUBY_PROBE_RECEIVER: &str = "$__supercov";

/// Block-taking methods whose block runs once per element (or per count):
/// the idiomatic Ruby loops. Methods that may call the block zero times on a
/// non-empty receiver (`cycle`, `loop`, `lazy`) are deliberately absent.
const ITERATORS: &[&[u8]] = &[
    b"each",
    b"each_with_index",
    b"each_with_object",
    b"each_pair",
    b"each_key",
    b"each_value",
    b"each_char",
    b"each_byte",
    b"each_line",
    b"each_slice",
    b"each_cons",
    b"each_entry",
    b"each_index",
    b"reverse_each",
    b"map",
    b"collect",
    b"flat_map",
    b"collect_concat",
    b"filter_map",
    b"select",
    b"filter",
    b"reject",
    b"find",
    b"detect",
    b"find_index",
    b"find_all",
    b"all?",
    b"any?",
    b"none?",
    b"one?",
    b"count",
    b"sum",
    b"min_by",
    b"max_by",
    b"sort_by",
    b"group_by",
    b"partition",
    b"inject",
    b"reduce",
    b"take_while",
    b"drop_while",
    b"times",
    b"upto",
    b"downto",
    b"step",
];
pub const BEGIN_BODY_LIMITATION: &str = "ruby-begin-completion-unmeasured";
/// A `Ractor.new` block cannot call the probes: a non-main Ractor cannot read
/// the receiver global, so a probe there raises where the untouched program
/// ran. Nothing is inserted inside one; what only a probe could prove there
/// is unmeasured and declared at the block.
pub const RACTOR_BLOCK_LIMITATION: &str = "ruby-ractor-block-unprobed";

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RubyInstrumenterError {
    Parse(String),
    InvalidRange,
}

impl std::fmt::Display for RubyInstrumenterError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Parse(error) => write!(formatter, "Ruby parse failed: {error}"),
            Self::InvalidRange => write!(formatter, "Ruby parser returned an invalid range"),
        }
    }
}

impl std::error::Error for RubyInstrumenterError {}

/// A source span in one-based lines and zero-based byte columns, the units
/// Ruby's `Coverage` module reports. Serialized as `[[line, col], [line, col]]`.
/// What a stdlib key's span names.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum KeyKind {
    /// A statement list (`then`, `else`, `when`, `in`, a loop body): Ruby
    /// spans it from its first statement's start to its last statement's
    /// end, so a probe or wrapper on its first statement becomes part of it.
    List,
    /// One expression node: a wrapper around it is a different node.
    Node,
    /// A zero-width position at the end of a predicate, which Ruby reports
    /// for an `if` without a body; it follows anything inserted up to there.
    Point,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(from = "[[usize; 2]; 2]", into = "[[usize; 2]; 2]")]
pub struct PlanSpan {
    pub start: [usize; 2],
    pub end: [usize; 2],
}

impl From<[[usize; 2]; 2]> for PlanSpan {
    fn from(value: [[usize; 2]; 2]) -> Self {
        Self {
            start: value[0],
            end: value[1],
        }
    }
}

impl From<PlanSpan> for [[usize; 2]; 2] {
    fn from(value: PlanSpan) -> Self {
        [value.start, value.end]
    }
}

/// One text insertion the runtime applies to the original source before
/// compiling it. Offsets are bytes into the original file; the runtime applies
/// insertions from the end of the file backwards, so offsets stay valid.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Edit {
    pub offset: usize,
    pub text: String,
    /// `clause`, `statement`, `opener` or `closer`: how the insertion sits
    /// relative to the node at its offset, which decides whether keys
    /// starting or ending there move (see [`Collector::shifted`]).
    pub rank: String,
    /// The other end of the range the insertion belongs to: the end of the
    /// wrapped node or probed statement for an opener or probe, the opener's
    /// offset for a closer.
    pub scope: usize,
}

/// A `Coverage` branch key: the group type (`if`, `case`, `&.`, `while`), the
/// branch type (`then`, `else`, `when`, `in`, `body`) and the branch span in
/// post-insertion coordinates.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdlibKey {
    pub group: String,
    pub branch: String,
    /// What the key's span names, which decides how insertions at its edges
    /// move it (see [`Collector::shifted`]).
    pub kind: KeyKind,
    /// Span after the plan's insertions are applied.
    pub span: PlanSpan,
    /// Span in the untouched source, for interpreters that cannot apply the
    /// insertions (Ruby 3.3 does not cover code compiled by a load hook).
    pub unshifted: PlanSpan,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdlibDecision {
    pub id: String,
    pub value: bool,
    pub outcome: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BranchKeyPlan {
    pub key: StdlibKey,
    /// Obligation IDs proven when this branch executed: alternatives and any
    /// statement whose first line is shared with an earlier statement.
    pub hits: Vec<String>,
    /// A single-condition decision whose vector this branch witnesses.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub decision: Option<StdlibDecision>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MethodKeyPlan {
    pub span: PlanSpan,
    pub unshifted: PlanSpan,
    pub id: String,
}

/// What observing one obligation also proves: the branch body it starts, the
/// method it opens, the single-condition decision outcome it witnesses. Keyed
/// by the statement (or decision outcome) whose hit implies the rest, so the
/// runtime pays one hash lookup per first sighting and nothing per execution.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ImpliedPlan {
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub hits: Vec<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub decisions: Vec<StdlibDecision>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CaseClausePlan {
    pub key: StdlibKey,
    pub missed: String,
    pub selected: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CaseNoMatchPlan {
    pub key: StdlibKey,
    pub matched: String,
    pub unmatched: String,
}

/// `case` clauses are tested in order, so a clause was missed exactly when a
/// later clause (or the implicit else) was selected. The runtime derives that
/// per phase from the selected counts.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CasePlan {
    pub clauses: Vec<CaseClausePlan>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub no_match: Option<CaseNoMatchPlan>,
}

/// Short-circuit structure of a decision. Leaves are condition indexes.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ConditionTree {
    Leaf(usize),
    Node {
        op: String,
        items: Vec<ConditionTree>,
        #[serde(default, skip_serializing_if = "std::ops::Not::not")]
        negate: bool,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DerivedLogical {
    pub previous_leaves: Vec<usize>,
    pub operand_leaves: Vec<usize>,
    pub short_circuit: String,
    pub evaluated: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LoopTarget {
    pub id: String,
    pub zero: String,
    pub entered: String,
    /// `until` enters the body when the predicate is falsy.
    pub until: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HandlerTarget {
    pub id: String,
    pub missed: String,
    pub selected: String,
}

/// What a probe call reports. The runtime looks the key up and records the
/// obligations named here.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "camelCase", deny_unknown_fields)]
pub enum ProbeTarget {
    /// `s(k)`: a statement sharing a line with an earlier statement ran.
    #[serde(rename_all = "camelCase")]
    Statement { id: String },
    /// `c(k, i, v)` per condition, `d(k, v)` or `w(k, v)` for the outcome.
    #[serde(rename_all = "camelCase")]
    Decision {
        id: String,
        width: usize,
        not: Vec<bool>,
        tree: ConditionTree,
        outcome_true: String,
        outcome_false: String,
        logical: Vec<DerivedLogical>,
        #[serde(rename = "loop", skip_serializing_if = "Option::is_none")]
        loop_: Option<LoopTarget>,
    },
    /// `f(k, collection)` at the loop head and `fb(k)` as the first body statement.
    #[serde(rename_all = "camelCase")]
    For {
        id: String,
        zero: String,
        entered: String,
    },
    /// `l(k, left)` for value-context `&&`/`||`/`||=`/`&&=`.
    #[serde(rename_all = "camelCase")]
    Logical {
        op: String,
        short_circuit: String,
        evaluated: String,
    },
    /// `pre(k)` before an operator assignment whose target cannot be re-read
    /// without side effects, `es(k)` as the first thing its right side does:
    /// arrivals that never started the right side are short-circuits.
    #[serde(rename_all = "camelCase")]
    Arrival {
        short_circuit: String,
        evaluated: String,
    },
    /// `n(k, receiver)` before `&.`: the receiver was nil, or the method was
    /// called.
    #[serde(rename_all = "camelCase")]
    SafeNavigation { nil: String, called: String },
    /// `hs(k)` where a branch body or method body would start when it has no
    /// statement to observe: the alternatives (and method) it proves.
    #[serde(rename_all = "camelCase")]
    Hits { ids: Vec<String> },
    /// `ok(k, v)`/`ok0(k)` completion, `h(k, n)` handler entry, `p(k)`
    /// propagation, `hm(k, v)` rescue-modifier fallback.
    #[serde(rename_all = "camelCase")]
    Try {
        id: String,
        success: String,
        raised: String,
        handlers: Vec<HandlerTarget>,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RubyFilePlan {
    pub edits: Vec<Edit>,
    /// Line -> statement id for statements that own their first line.
    pub lines: BTreeMap<usize, String>,
    /// Statement id -> [start, end] byte offsets for line-owned statements,
    /// so the runtime can probe one whose first line Ruby turns out not to
    /// count (`begin`, `case` without subject, multi-line literals).
    pub statement_offsets: BTreeMap<String, [usize; 2]>,
    pub branches: Vec<BranchKeyPlan>,
    pub methods: Vec<MethodKeyPlan>,
    pub cases: Vec<CasePlan>,
    /// Obligation id -> what its observation implies (Ruby 3.4+ path).
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub implied: BTreeMap<String, ImpliedPlan>,
    /// This file's share of [`RubyProbePlan::probe_obligations`], so a file
    /// the runtime fails to instrument can declare exactly its own.
    #[serde(default)]
    pub probe_obligations: Vec<String>,
    /// Byte ranges of `Ractor.new` blocks, where the runtime must not add
    /// load-time probes either (see [`RACTOR_BLOCK_LIMITATION`]).
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub ractor_blocks: Vec<[usize; 2]>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RubyProbePlan {
    pub version: u32,
    pub root: String,
    pub receiver: String,
    pub files: BTreeMap<String, RubyFilePlan>,
    pub probes: BTreeMap<u64, ProbeTarget>,
    /// See [`RubyProbePlan::probe_obligations`]; stored so the runtime can
    /// declare them without re-deriving alternative ids.
    #[serde(default)]
    pub probe_obligations: Vec<String>,
}

impl RubyProbePlan {
    /// Manifest obligations (points, decisions, branches) that only a probe
    /// can prove: the union of each file's, which already leaves out what
    /// Ruby 3.3 still proves through Coverage's keys. An interpreter that
    /// cannot apply the insertions reports them as unmeasured.
    pub fn probe_obligations(&self) -> Vec<String> {
        let mut ids = self
            .files
            .values()
            .flat_map(|file| file.probe_obligations.iter().cloned())
            .collect::<Vec<_>>();
        ids.sort();
        ids.dedup();
        ids
    }
}

/// Manifest obligations (points, decisions, branches) that only a probe can
/// prove.
fn probe_obligations_of(probes: &BTreeMap<u64, ProbeTarget>) -> Vec<String> {
    {
        let mut ids = BTreeSet::new();
        for target in probes.values() {
            match target {
                ProbeTarget::Statement { id } => {
                    ids.insert(id.clone());
                }
                ProbeTarget::Decision {
                    id,
                    outcome_true,
                    logical,
                    loop_,
                    ..
                } => {
                    ids.insert(id.clone());
                    ids.insert(branch_of(outcome_true));
                    for derived in logical {
                        ids.insert(branch_of(&derived.short_circuit));
                    }
                    if let Some(loop_) = loop_ {
                        ids.insert(loop_.id.clone());
                    }
                }
                ProbeTarget::For { id, .. } => {
                    ids.insert(id.clone());
                }
                ProbeTarget::Logical { short_circuit, .. } => {
                    ids.insert(branch_of(short_circuit));
                }
                ProbeTarget::Arrival { short_circuit, .. } => {
                    ids.insert(branch_of(short_circuit));
                }
                ProbeTarget::SafeNavigation { nil, .. } => {
                    ids.insert(branch_of(nil));
                }
                ProbeTarget::Hits { ids: proven } => {
                    for id in proven {
                        ids.insert(obligation_of(id));
                    }
                }
                ProbeTarget::Try { id, handlers, .. } => {
                    ids.insert(id.clone());
                    for handler in handlers {
                        ids.insert(handler.id.clone());
                    }
                }
            }
        }
        ids.into_iter().collect()
    }
}

/// The probe keys an insertion's text calls: every `<receiver>.<name>(<key>`.
fn probe_keys_in(text: &str) -> Vec<u64> {
    let mut keys = Vec::new();
    let mut rest = text;
    while let Some(position) = rest.find(RUBY_PROBE_RECEIVER) {
        rest = &rest[position + RUBY_PROBE_RECEIVER.len()..];
        let Some(open) = rest.find('(') else { break };
        let digits: String = rest[open + 1..]
            .chars()
            .take_while(char::is_ascii_digit)
            .collect();
        if let Ok(key) = digits.parse() {
            keys.push(key);
        }
        rest = &rest[open + 1..];
    }
    keys
}

/// Every id a probe target names, so implications keyed by any of them can
/// be found when the probe is dropped.
fn target_ids(target: &ProbeTarget) -> Vec<String> {
    match target {
        ProbeTarget::Statement { id } => vec![id.clone()],
        ProbeTarget::Decision {
            id,
            outcome_true,
            outcome_false,
            logical,
            loop_,
            ..
        } => {
            let mut ids = vec![id.clone(), outcome_true.clone(), outcome_false.clone()];
            for derived in logical {
                ids.push(derived.short_circuit.clone());
                ids.push(derived.evaluated.clone());
            }
            if let Some(loop_) = loop_ {
                ids.push(loop_.zero.clone());
                ids.push(loop_.entered.clone());
            }
            ids
        }
        ProbeTarget::For { id, zero, entered } => vec![id.clone(), zero.clone(), entered.clone()],
        ProbeTarget::Logical {
            short_circuit,
            evaluated,
            ..
        }
        | ProbeTarget::Arrival {
            short_circuit,
            evaluated,
        } => vec![short_circuit.clone(), evaluated.clone()],
        ProbeTarget::Try {
            id,
            success,
            raised,
            handlers,
        } => {
            let mut ids = vec![id.clone(), success.clone(), raised.clone()];
            for handler in handlers {
                ids.push(handler.id.clone());
                ids.push(handler.missed.clone());
                ids.push(handler.selected.clone());
            }
            ids
        }
        ProbeTarget::SafeNavigation { nil, called } => vec![nil.clone(), called.clone()],
        ProbeTarget::Hits { ids } => ids.clone(),
    }
}

/// `rb:branch:<hash>:alternative` -> `rb:branch:<hash>`; decision outcome
/// branches are `rb:decision:<hash>:outcome`.
fn branch_of(alternative: &str) -> String {
    alternative
        .rsplit_once(':')
        .map(|(branch, _)| branch.to_owned())
        .unwrap_or_else(|| alternative.to_owned())
}

/// The manifest obligation an id names: a point (`rb:statement:<hash>`,
/// `rb:function:<hash>`) is its own obligation; an alternative
/// (`rb:branch:<hash>:selected`, `rb:decision:<hash>:outcome:true`) belongs
/// to its branch.
fn obligation_of(id: &str) -> String {
    if id.matches(':').count() >= 3 {
        branch_of(id)
    } else {
        id.to_owned()
    }
}

/// Everything Ruby 3.3 proves by matching `Coverage`'s branch and method
/// keys. A probe that proves one of these on 3.4+ is not a gap on 3.3.
fn stdlib_provable(
    branches: &[BranchKeyPlan],
    cases: &[CasePlan],
    methods: &[MethodKeyPlan],
) -> BTreeSet<String> {
    let mut ids = BTreeSet::new();
    for branch in branches {
        for hit in &branch.hits {
            ids.insert(obligation_of(hit));
        }
        if let Some(decision) = &branch.decision {
            ids.insert(decision.id.clone());
            ids.insert(obligation_of(&decision.outcome));
        }
    }
    for case in cases {
        for clause in &case.clauses {
            ids.insert(obligation_of(&clause.missed));
            ids.insert(obligation_of(&clause.selected));
        }
        if let Some(no_match) = &case.no_match {
            ids.insert(obligation_of(&no_match.matched));
            ids.insert(obligation_of(&no_match.unmatched));
        }
    }
    for method in methods {
        ids.insert(method.id.clone());
    }
    ids
}

#[derive(Debug, Clone, PartialEq)]
pub struct RubyFileObligations {
    pub manifest: CoverageManifest,
    pub plan: RubyFilePlan,
    pub probes: BTreeMap<u64, ProbeTarget>,
}

fn stable_id(file: &str, kind: &str, start: usize, end: usize, suffix: &str) -> String {
    let mut hash = Sha256::new();
    for value in [file, kind, &start.to_string(), &end.to_string(), suffix] {
        hash.update(value.as_bytes());
        hash.update([0]);
    }
    let digest = hash.finalize();
    let mut encoded = String::with_capacity(24);
    for byte in &digest[..12] {
        use std::fmt::Write as _;
        write!(&mut encoded, "{byte:02x}").expect("writing to a string cannot fail");
    }
    format!("rb:{kind}:{encoded}")
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum EditRank {
    Clause,
    StatementProbe,
    Opener,
    Closer,
}

#[derive(Debug, Clone)]
struct PendingEdit {
    offset: usize,
    rank: EditRank,
    /// Openers sort by ascending depth (outer first), closers by descending.
    order: i64,
    sequence: usize,
    text: String,
    scope: usize,
}

/// How a statement that a stdlib branch key proves on Ruby 3.3 is proven on
/// 3.4+, where no keys are read.
#[derive(Debug, Clone)]
enum KeyProof {
    /// Like any statement: its own line when it owns one, else a probe.
    Probe,
    /// The body of a modifier (`x if c`, `x while c`): it runs exactly when
    /// this decision outcome or loop alternative is observed, and its line
    /// belongs to the modifier statement.
    Implied(String),
}

#[derive(Debug, Clone)]
struct KeyStatement {
    index: usize,
    proof: KeyProof,
}

/// The body statements whose execution witnesses each outcome of a
/// single-condition decision. Both sides present: the decision is derived
/// from lines; either side missing: the predicate is probed.
#[derive(Debug, Default)]
struct DecisionProof {
    true_statements: Vec<String>,
    false_statements: Vec<String>,
}

struct Collector<'a> {
    file: &'a str,
    source: &'a [u8],
    line_starts: Vec<usize>,
    manifest: CoverageManifest,
    lines: BTreeMap<usize, String>,
    statement_offsets: BTreeMap<String, [usize; 2]>,
    branches: Vec<BranchKeyPlan>,
    methods: Vec<MethodKeyPlan>,
    cases: Vec<CasePlan>,
    implied: BTreeMap<String, ImpliedPlan>,
    probes: BTreeMap<u64, ProbeTarget>,
    edits: Vec<PendingEdit>,
    next_probe: &'a mut u64,
    point_ids: BTreeSet<String>,
    decision_ids: BTreeSet<String>,
    branch_ids: BTreeSet<String>,
    claimed_lines: BTreeSet<usize>,
    /// Statement start offsets a stdlib branch key proves on Ruby 3.3 (index
    /// into `branches`), and how 3.4+ proves them instead.
    key_statements: BTreeMap<usize, KeyStatement>,
    /// Start offsets of the body expressions of endless method definitions,
    /// which take a wrapped probe because `def m = s(k); expr` would end the
    /// definition at the probe.
    endless_bodies: std::collections::BTreeSet<usize>,
    /// Offsets of `&&`/`||` nodes that belong to a decision's tree.
    tree_logicals: BTreeSet<usize>,
    /// Statement lists that are expressions in disguise (parentheses, string
    /// interpolation): their children are not statements in the denominator.
    expression_lists: BTreeSet<usize>,
    /// `if`/`unless` nodes that are `case/in` guards, owned by the clause.
    guard_nodes: BTreeSet<usize>,
    /// `elsif` nodes already handled through their parent's chain walk.
    elsif_nodes: BTreeSet<usize>,
    depth: i64,
    begin_unmeasured: Vec<(String, usize)>,
    /// Byte ranges of `Ractor.new` blocks; no insertion may land inside.
    ractor_blocks: Vec<(usize, usize)>,
    error: Option<RubyInstrumenterError>,
}

impl<'a> Collector<'a> {
    fn new(file: &'a str, source: &'a [u8], next_probe: &'a mut u64) -> Self {
        let mut line_starts = vec![0];
        line_starts.extend(
            source
                .iter()
                .enumerate()
                .filter_map(|(index, byte)| (*byte == b'\n').then_some(index + 1)),
        );
        Self {
            file,
            source,
            line_starts,
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: Vec::new(),
                points: Vec::new(),
                branches: Vec::new(),
                limitations: Vec::new(),
                scope: None,
            },
            lines: BTreeMap::new(),
            statement_offsets: BTreeMap::new(),
            branches: Vec::new(),
            methods: Vec::new(),
            cases: Vec::new(),
            implied: BTreeMap::new(),
            probes: BTreeMap::new(),
            edits: Vec::new(),
            next_probe,
            point_ids: BTreeSet::new(),
            decision_ids: BTreeSet::new(),
            branch_ids: BTreeSet::new(),
            claimed_lines: BTreeSet::new(),
            key_statements: BTreeMap::new(),
            endless_bodies: std::collections::BTreeSet::new(),
            tree_logicals: BTreeSet::new(),
            expression_lists: BTreeSet::new(),
            guard_nodes: BTreeSet::new(),
            elsif_nodes: BTreeSet::new(),
            depth: 0,
            begin_unmeasured: Vec::new(),
            ractor_blocks: Vec::new(),
            error: None,
        }
    }

    // -- positions ----------------------------------------------------------

    fn line_column(&self, offset: usize) -> (usize, usize) {
        let line_index = self.line_starts.partition_point(|start| *start <= offset) - 1;
        (line_index + 1, offset - self.line_starts[line_index])
    }

    fn span(&self, start: usize, end: usize) -> PlanSpan {
        let (start_line, start_column) = self.line_column(start);
        let (end_line, end_column) = self.line_column(end);
        PlanSpan {
            start: [start_line, start_column],
            end: [end_line, end_column],
        }
    }

    fn point_span(&self, offset: usize) -> PlanSpan {
        let (line, column) = self.line_column(offset);
        PlanSpan {
            start: [line, column],
            end: [line, column],
        }
    }

    fn location_span(&self, location: &Location<'_>) -> PlanSpan {
        self.span(location.start_offset(), location.end_offset())
    }

    fn node_span(&self, node: &Node<'_>) -> PlanSpan {
        self.location_span(&node.location())
    }

    fn text(&self, start: usize, end: usize) -> String {
        String::from_utf8_lossy(&self.source[start.min(end)..end.min(self.source.len())])
            .trim()
            .to_owned()
    }

    fn statements_span(&self, statements: &Option<StatementsNode<'_>>) -> Option<PlanSpan> {
        statements
            .as_ref()
            .map(|statements| self.location_span(&statements.location()))
    }

    // -- edits --------------------------------------------------------------

    fn edit(&mut self, offset: usize, rank: EditRank, text: String, scope: usize) {
        debug_assert!(!text.contains('\n'));
        let order = match rank {
            EditRank::Opener => self.depth,
            EditRank::Closer => -self.depth,
            _ => 0,
        };
        let sequence = self.edits.len();
        self.edits.push(PendingEdit {
            offset,
            rank,
            order,
            sequence,
            text,
            scope,
        });
    }

    fn probe_key(&mut self, target: ProbeTarget) -> u64 {
        let key = *self.next_probe;
        *self.next_probe += 1;
        self.probes.insert(key, target);
        key
    }

    fn wrap(&mut self, start: usize, end: usize, opener: String) {
        self.edit(start, EditRank::Opener, opener, end);
        self.edit(end, EditRank::Closer, "))".into(), start);
    }

    // -- manifest helpers ---------------------------------------------------

    fn push_point(
        &mut self,
        id: &str,
        start: usize,
        end: usize,
        kind: PointKind,
        label: Option<String>,
    ) {
        let (line, column) = self.line_column(start);
        self.manifest.points.push(PointMeta {
            id: id.into(),
            kind,
            file: self.file.into(),
            line,
            column,
            source: self.text(start, end),
            label,
        });
    }

    fn branch<const N: usize>(
        &mut self,
        start: usize,
        end: usize,
        kind: &str,
        alternatives: [(&str, &str); N],
    ) -> Option<String> {
        let id = stable_id(self.file, "branch", start, end, kind);
        let source = self.text(start, end);
        self.branch_with_id(id, start, end, kind, source, alternatives)
    }

    fn branch_with_id<const N: usize>(
        &mut self,
        id: String,
        start: usize,
        _end: usize,
        kind: &str,
        source: String,
        alternatives: [(&str, &str); N],
    ) -> Option<String> {
        if !self.branch_ids.insert(id.clone()) {
            return None;
        }
        let (line, column) = self.line_column(start);
        self.manifest.branches.push(BranchMeta {
            id: id.clone(),
            kind: kind.into(),
            file: self.file.into(),
            line,
            column,
            source,
            alternatives: alternatives
                .into_iter()
                .map(|(suffix, label)| BranchAlternativeMeta {
                    id: format!("{id}:{suffix}"),
                    label: label.into(),
                })
                .collect(),
        });
        Some(id)
    }

    fn stdlib(
        &mut self,
        group: &str,
        branch: &str,
        span: PlanSpan,
        kind: KeyKind,
        hits: Vec<String>,
    ) -> usize {
        self.branches.push(BranchKeyPlan {
            key: StdlibKey {
                group: group.into(),
                branch: branch.into(),
                kind,
                span,
                unshifted: span,
            },
            hits,
            decision: None,
        });
        self.branches.len() - 1
    }

    // -- statements ---------------------------------------------------------

    fn statements(&mut self, statements: &StatementsNode<'_>) {
        for statement in statements.body().iter() {
            self.statement(&statement);
        }
    }

    fn statement(&mut self, node: &Node<'_>) {
        let location = node.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let id = stable_id(self.file, "statement", start, end, "");
        if !self.point_ids.insert(id.clone()) {
            return;
        }
        self.push_point(&id, start, end, PointKind::Statement, None);
        let (line, _) = self.line_column(start);
        if let Some(key) = self.key_statements.get(&start).cloned() {
            // The body of a modifier or one-line branch: on Ruby 3.3 the
            // stdlib branch key that proves the branch proves this statement.
            self.branches[key.index].hits.push(id.clone());
            if let KeyProof::Implied(by) = key.proof {
                // A modifier body shares its line with the modifier statement,
                // so the line proves nothing about it; the decision outcome or
                // loop entry that runs it does.
                self.claimed_lines.insert(line);
                self.implied.entry(by).or_default().hits.push(id);
                return;
            }
        }
        if self.needs_probe(node) {
            // No instruction carries this statement's first line: `x = begin`
            // starts executing inside the begin body.
            self.claimed_lines.insert(line);
            let key = self.probe_key(ProbeTarget::Statement { id });
            self.statement_probe(start, end, key);
        } else if self.claimed_lines.insert(line) {
            // Ruby's line table counts the statement's first line; the
            // offsets let the runtime probe it instead where the interpreter
            // turns out not to count that line.
            self.lines.insert(line, id.clone());
            self.statement_offsets.insert(id, [start, end]);
        } else {
            let key = self.probe_key(ProbeTarget::Statement { id });
            self.statement_probe(start, end, key);
        }
    }

    /// `s(k); statement`, or `(s(k); expression)` for the body of an endless
    /// method definition, which admits exactly one expression.
    fn statement_probe(&mut self, start: usize, end: usize, key: u64) {
        if self.endless_bodies.contains(&start) {
            self.depth += 1;
            self.edit(
                start,
                EditRank::Opener,
                format!("({RUBY_PROBE_RECEIVER}.s({key}); "),
                end,
            );
            self.edit(end, EditRank::Closer, ")".into(), start);
            self.depth -= 1;
        } else {
            self.edit(
                start,
                EditRank::StatementProbe,
                format!("{RUBY_PROBE_RECEIVER}.s({key}); "),
                end,
            );
        }
    }

    fn needs_probe(&self, node: &Node<'_>) -> bool {
        let value = if let Some(write) = node.as_local_variable_write_node() {
            Some(write.value())
        } else if let Some(write) = node.as_instance_variable_write_node() {
            Some(write.value())
        } else if let Some(write) = node.as_class_variable_write_node() {
            Some(write.value())
        } else if let Some(write) = node.as_global_variable_write_node() {
            Some(write.value())
        } else if let Some(write) = node.as_constant_write_node() {
            Some(write.value())
        } else {
            node.as_multi_write_node().map(|write| write.value())
        };
        // `x = begin ... end` and `x = (\n ... )` start executing inside the
        // value on a later line; Ruby records nothing for the assignment line.
        value.is_some_and(|value| {
            value
                .as_begin_node()
                .is_some_and(|begin| begin.begin_keyword_loc().is_some())
                || value.as_parentheses_node().is_some()
        })
    }

    /// Register the first statement of a body as proven by a stdlib key.
    fn key_body(&mut self, statements: Option<StatementsNode<'_>>, index: usize, proof: KeyProof) {
        if let Some(first) = statements.and_then(|statements| statements.body().iter().next()) {
            self.key_statements.insert(
                first.location().start_offset(),
                KeyStatement { index, proof },
            );
        }
    }

    /// A clause header (`when 1 then`, `elsif b`, `else`) runs its test on
    /// its own line whether or not its body follows, so a body statement
    /// starting on that line proves nothing by the line and takes a probe.
    fn claim_line_at(&mut self, offset: usize) {
        let (line, _) = self.line_column(offset);
        self.claimed_lines.insert(line);
    }

    /// The obligation id of a body's first statement, whose observation
    /// (its own line, or a probe when it shares one) witnesses that the body
    /// ran. `None` for an empty body.
    fn first_statement_id(&self, statements: &Option<StatementsNode<'_>>) -> Option<String> {
        let first = statements.as_ref()?.body().iter().next()?;
        let location = first.location();
        Some(stable_id(
            self.file,
            "statement",
            location.start_offset(),
            location.end_offset(),
            "",
        ))
    }

    /// Attach what running a body proves to its first statement, or, for a
    /// body with no statement, to a `hs(k)` probe inserted where the body
    /// would start (`before` and `after` supply the punctuation).
    fn body_proves(
        &mut self,
        statements: &Option<StatementsNode<'_>>,
        ids: Vec<String>,
        offset: usize,
        before: &str,
        after: &str,
    ) {
        match self.first_statement_id(statements) {
            Some(first) => self.implied.entry(first).or_default().hits.extend(ids),
            None => {
                let key = self.probe_key(ProbeTarget::Hits { ids });
                // Closer rank: a guard's `d(...)` wrapper closes at the very
                // offset an empty `in` body starts, and the probe must follow
                // that `))`, not split it.
                self.edit(
                    offset,
                    EditRank::Closer,
                    format!("{before}{RUBY_PROBE_RECEIVER}.hs({key}){after}"),
                    offset,
                );
            }
        }
    }

    // -- decisions ----------------------------------------------------------

    /// Strip parentheses and `!`/`not`, counting the negations.
    fn strip<'n>(&self, node: Node<'n>) -> (Node<'n>, usize) {
        let mut current = node;
        let mut not = 0;
        loop {
            if let Some(parens) = current.as_parentheses_node() {
                if !parens.is_multiple_statements()
                    && let Some(body) = parens.body()
                    && let Some(statements) = body.as_statements_node()
                    && statements.body().iter().count() == 1
                    && let Some(inner) = statements.body().iter().next()
                {
                    current = inner;
                    continue;
                }
                break;
            }
            if let Some(call) = current.as_call_node()
                && call.name().as_slice() == b"!"
                && call.arguments().is_none()
                && call.block().is_none()
                && let Some(receiver) = call.receiver()
            {
                not += 1;
                current = receiver;
                continue;
            }
            break;
        }
        (current, not)
    }

    fn tree(
        &mut self,
        node: Node<'_>,
        leaves: &mut Vec<(usize, usize, usize)>,
        logicals: &mut Vec<(String, Vec<Vec<usize>>)>,
    ) -> ConditionTree {
        let (operand, not) = self.strip(node);
        let logical: Option<(&str, Node<'_>, Node<'_>, usize)> =
            if let Some(and) = operand.as_and_node() {
                Some((
                    "and",
                    and.left(),
                    and.right(),
                    operand.location().start_offset(),
                ))
            } else if let Some(or) = operand.as_or_node() {
                Some((
                    "or",
                    or.left(),
                    or.right(),
                    operand.location().start_offset(),
                ))
            } else {
                None
            };
        if let Some((op, left, right, offset)) = logical {
            self.tree_logicals.insert(offset);
            let first = leaves.len();
            let left_tree = self.tree(left, leaves, logicals);
            let middle = leaves.len();
            let right_tree = self.tree(right, leaves, logicals);
            logicals.push((
                op.into(),
                vec![(first..middle).collect(), (middle..leaves.len()).collect()],
            ));
            return ConditionTree::Node {
                op: op.into(),
                items: vec![left_tree, right_tree],
                negate: not % 2 == 1,
            };
        }
        let location = operand.location();
        leaves.push((location.start_offset(), location.end_offset(), not));
        ConditionTree::Leaf(leaves.len() - 1)
    }

    /// A decision proven by probes: multi-condition predicates, loop
    /// predicates and pattern guards. Returns the probe key the outcome
    /// wrapper must use.
    fn probe_decision(
        &mut self,
        predicate: Node<'_>,
        kind: &str,
        loop_: Option<LoopTarget>,
        wrapper: &str,
    ) -> Option<u64> {
        let location = predicate.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let id = stable_id(self.file, "decision", start, end, kind);
        if !self.decision_ids.insert(id.clone()) {
            return None;
        }
        let mut leaves = Vec::new();
        let mut logicals = Vec::new();
        let tree = self.tree(predicate, &mut leaves, &mut logicals);
        let conditions = leaves
            .iter()
            .map(|(leaf_start, leaf_end, not)| {
                let text = self.text(*leaf_start, *leaf_end);
                if not % 2 == 1 {
                    format!("!{text}")
                } else {
                    text
                }
            })
            .collect::<Vec<_>>();
        let (line, column) = self.line_column(start);
        let source = self.text(start, end);
        self.manifest.decisions.push(DecisionMeta {
            id: id.clone(),
            file: self.file.into(),
            line,
            column,
            source: source.clone(),
            conditions,
            kind: kind.into(),
        });
        let outcome_id = format!("{id}:outcome");
        self.branch_with_id(
            outcome_id.clone(),
            start,
            end,
            kind,
            source,
            [("true", "true"), ("false", "false")],
        );
        let mut derived = Vec::new();
        for (op, groups) in logicals {
            // The logical branch lives on the right operand's range.
            let right_leaf = groups[1].first().copied().unwrap_or(0);
            let (right_start, right_end, _) = leaves[right_leaf];
            if let Some(branch_id) = self.branch(
                right_start,
                right_end,
                &format!("logical-{op}"),
                [
                    ("short-circuit", "short-circuited"),
                    ("evaluated", "right operand evaluated"),
                ],
            ) {
                derived.push(DerivedLogical {
                    previous_leaves: groups[0].clone(),
                    operand_leaves: groups[1].clone(),
                    short_circuit: format!("{branch_id}:short-circuit"),
                    evaluated: format!("{branch_id}:evaluated"),
                });
            }
        }
        let key = self.probe_key(ProbeTarget::Decision {
            id,
            width: leaves.len(),
            not: leaves.iter().map(|(_, _, not)| not % 2 == 1).collect(),
            tree,
            outcome_true: format!("{outcome_id}:true"),
            outcome_false: format!("{outcome_id}:false"),
            logical: derived,
            loop_,
        });
        self.depth += 1;
        self.wrap(
            start,
            end,
            format!("{RUBY_PROBE_RECEIVER}.{wrapper}({key}, ("),
        );
        self.depth += 1;
        // A lone condition's value is the outcome; the runtime reads it from
        // the outcome probe, so it needs no wrapper of its own.
        if leaves.len() > 1 {
            for (index, (leaf_start, leaf_end, _)) in leaves.iter().enumerate() {
                self.wrap(
                    *leaf_start,
                    *leaf_end,
                    format!("{RUBY_PROBE_RECEIVER}.c({key}, {index}, ("),
                );
            }
        }
        self.depth -= 2;
        Some(key)
    }

    /// A single-condition `if`/`unless`/ternary decision: Ruby's `then`/`else`
    /// counts already witness both outcomes, so no probe is inserted.
    fn stdlib_decision(
        &mut self,
        predicate: Node<'_>,
        kind: &str,
        then_index: usize,
        else_index: usize,
        then_is_true: bool,
        proof: DecisionProof,
    ) {
        let location = predicate.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let id = stable_id(self.file, "decision", start, end, kind);
        if !self.decision_ids.insert(id.clone()) {
            return;
        }
        let (operand, not) = self.strip(predicate);
        let operand_location = operand.location();
        let mut condition = self.text(
            operand_location.start_offset(),
            operand_location.end_offset(),
        );
        if not % 2 == 1 {
            condition = format!("!{condition}");
        }
        let (line, column) = self.line_column(start);
        let source = self.text(start, end);
        self.manifest.decisions.push(DecisionMeta {
            id: id.clone(),
            file: self.file.into(),
            line,
            column,
            source: source.clone(),
            conditions: vec![condition],
            kind: kind.into(),
        });
        let outcome_id = format!("{id}:outcome");
        self.branch_with_id(
            outcome_id.clone(),
            start,
            end,
            kind,
            source,
            [("true", "true"), ("false", "false")],
        );
        let (true_index, false_index) = if then_is_true {
            (then_index, else_index)
        } else {
            (else_index, then_index)
        };
        self.branches[true_index].decision = Some(StdlibDecision {
            id: id.clone(),
            value: true,
            outcome: format!("{outcome_id}:true"),
        });
        self.branches[false_index].decision = Some(StdlibDecision {
            id: id.clone(),
            value: false,
            outcome: format!("{outcome_id}:false"),
        });
        // Ruby 3.4+ reads no branch keys. Both arms have a statement: each
        // arm's first statement witnesses its outcome. Otherwise the
        // predicate is probed -- one call per evaluation, no condition
        // wrapper, because a lone condition's value is the outcome.
        if !proof.true_statements.is_empty() && !proof.false_statements.is_empty() {
            for (statements, value) in [
                (&proof.true_statements, true),
                (&proof.false_statements, false),
            ] {
                for statement in statements {
                    self.implied
                        .entry(statement.clone())
                        .or_default()
                        .decisions
                        .push(StdlibDecision {
                            id: id.clone(),
                            value,
                            outcome: format!("{outcome_id}:{value}"),
                        });
                }
            }
        } else {
            let key = self.probe_key(ProbeTarget::Decision {
                id,
                width: 1,
                not: vec![not % 2 == 1],
                tree: ConditionTree::Leaf(0),
                outcome_true: format!("{outcome_id}:true"),
                outcome_false: format!("{outcome_id}:false"),
                logical: Vec::new(),
                loop_: None,
            });
            self.depth += 1;
            self.wrap(start, end, format!("{RUBY_PROBE_RECEIVER}.d({key}, ("));
            self.depth -= 1;
        }
    }

    /// Outcome ids of a decision before it is registered, so a modifier body
    /// can be tied to the outcome that runs it.
    fn decision_outcomes(&self, predicate: &Node<'_>, kind: &str) -> (String, String) {
        let location = predicate.location();
        let id = stable_id(
            self.file,
            "decision",
            location.start_offset(),
            location.end_offset(),
            kind,
        );
        (format!("{id}:outcome:true"), format!("{id}:outcome:false"))
    }

    /// The first statements of every arm after `subsequent` in an `if`
    /// chain, which together witness the false outcome of the arm before
    /// them; `None` when an arm is empty or the chain has no final `else`.
    fn chain_false_statements(&self, subsequent: Option<Node<'_>>) -> Option<Vec<String>> {
        let mut ids = Vec::new();
        let mut current = subsequent;
        loop {
            let node = current?;
            if let Some(elsif) = node.as_if_node() {
                ids.push(self.first_statement_id(&elsif.statements())?);
                current = elsif.subsequent();
            } else if let Some(else_node) = node.as_else_node() {
                ids.push(self.first_statement_id(&else_node.statements())?);
                return Some(ids);
            } else {
                return None;
            }
        }
    }

    /// `Some(truthiness)` for a predicate Ruby folds at compile time: a
    /// `true`, `false` or `nil` literal, or a numeric, string or symbol
    /// literal, possibly parenthesised. Ruby emits neither a branch nor the
    /// dead arm for these.
    fn literal_truth(&self, predicate: Node<'_>) -> Option<bool> {
        let mut node = predicate;
        loop {
            let inner = node.as_parentheses_node().and_then(|parens| {
                let body = parens.body()?;
                let statements = body.as_statements_node()?;
                let mut iter = statements.body().iter();
                let only = iter.next()?;
                iter.next().is_none().then_some(only)
            });
            match inner {
                Some(inner) => node = inner,
                None => break,
            }
        }
        if node.as_true_node().is_some()
            || node.as_integer_node().is_some()
            || node.as_float_node().is_some()
            || node.as_rational_node().is_some()
            || node.as_imaginary_node().is_some()
            || node.as_string_node().is_some()
            || node.as_symbol_node().is_some()
        {
            Some(true)
        } else if node.as_false_node().is_some() || node.as_nil_node().is_some() {
            Some(false)
        } else if let Some(and) = node.as_and_node() {
            // Ruby folds `x and false` the same way: the then arm is never
            // compiled and reports no branch, while `x` still runs.
            match (
                self.literal_truth(and.left()),
                self.literal_truth(and.right()),
            ) {
                (Some(false), _) | (_, Some(false)) => Some(false),
                (Some(true), Some(true)) => Some(true),
                _ => None,
            }
        } else if let Some(or) = node.as_or_node() {
            match (
                self.literal_truth(or.left()),
                self.literal_truth(or.right()),
            ) {
                (Some(true), _) | (_, Some(true)) => Some(true),
                (Some(false), Some(false)) => Some(false),
                _ => None,
            }
        } else {
            None
        }
    }

    fn is_compound(&self, predicate: Node<'_>) -> bool {
        let (operand, _) = self.strip(predicate);
        operand.as_and_node().is_some() || operand.as_or_node().is_some()
    }

    /// `predicate` is called twice because Prism nodes are handles that
    /// cannot be copied; every call returns the same node.
    fn predicate_decision<'n>(
        &mut self,
        predicate: impl Fn() -> Node<'n>,
        kind: &str,
        then_index: usize,
        else_index: usize,
        then_is_true: bool,
        proof: DecisionProof,
    ) {
        if self.is_compound(predicate()) {
            self.probe_decision(predicate(), kind, None, "d");
        } else {
            self.stdlib_decision(
                predicate(),
                kind,
                then_index,
                else_index,
                then_is_true,
                proof,
            );
        }
    }

    // -- constructs ---------------------------------------------------------

    fn if_node(&mut self, node: &IfNode<'_>, kind: &str) {
        let location = node.location();
        let node_span = self.location_span(&location);
        let then_statements = self.statements_span(&node.statements());
        // An `if` without a body gets a zero-width key at its predicate's end.
        let (then_span, then_kind) = match then_statements {
            Some(span) => (span, KeyKind::List),
            None => (
                self.point_span(node.predicate().location().end_offset()),
                KeyKind::Point,
            ),
        };
        let (else_span, else_kind) = match node.subsequent() {
            Some(subsequent) => match subsequent.as_else_node() {
                Some(else_node) => match self.statements_span(&else_node.statements()) {
                    Some(span) => (span, KeyKind::List),
                    None => (self.node_span(&subsequent), KeyKind::Node),
                },
                None => (self.node_span(&subsequent), KeyKind::Node),
            },
            None => (node_span, KeyKind::Node),
        };
        let then_index = self.stdlib("if", "then", then_span, then_kind, Vec::new());
        let else_index = self.stdlib("if", "else", else_span, else_kind, Vec::new());
        if kind == "ternary" {
            // A ternary's arms are expressions, not statements.
            if let Some(statements) = node.statements() {
                self.expression_lists
                    .insert(statements.location().start_offset());
            }
            if let Some(subsequent) = node.subsequent()
                && let Some(else_node) = subsequent.as_else_node()
                && let Some(statements) = else_node.statements()
            {
                self.expression_lists
                    .insert(statements.location().start_offset());
            }
        } else {
            // `x if c`: the body precedes the keyword and shares its line
            // with the modifier statement, so the true outcome proves it.
            let modifier = node.statements().is_some_and(|statements| {
                statements.location().start_offset() < node.predicate().location().start_offset()
            });
            let then_proof = if modifier {
                KeyProof::Implied(self.decision_outcomes(&node.predicate(), kind).0)
            } else {
                KeyProof::Probe
            };
            self.claim_line_at(node.predicate().location().end_offset());
            self.key_body(node.statements(), then_index, then_proof);
            if let Some(subsequent) = node.subsequent()
                && let Some(else_node) = subsequent.as_else_node()
            {
                self.claim_line_at(else_node.else_keyword_loc().end_offset());
                self.key_body(else_node.statements(), else_index, KeyProof::Probe);
            }
        }
        let proof = if kind == "ternary" {
            // Arms are expressions, not statements: nothing to derive from.
            DecisionProof::default()
        } else {
            DecisionProof {
                true_statements: self
                    .first_statement_id(&node.statements())
                    .into_iter()
                    .collect(),
                false_statements: self
                    .chain_false_statements(node.subsequent())
                    .unwrap_or_default(),
            }
        };
        self.predicate_decision(
            || node.predicate(),
            kind,
            then_index,
            else_index,
            true,
            proof,
        );
    }

    fn unless_node(&mut self, node: &UnlessNode<'_>) {
        let node_span = self.location_span(&node.location());
        let then_statements = self.statements_span(&node.statements());
        let (then_span, then_kind) = match then_statements {
            Some(span) => (span, KeyKind::List),
            None => (
                self.point_span(node.predicate().location().end_offset()),
                KeyKind::Point,
            ),
        };
        let (else_span, else_kind) = match node.else_clause() {
            Some(else_node) => match self.statements_span(&else_node.statements()) {
                Some(span) => (span, KeyKind::List),
                None => (self.location_span(&else_node.location()), KeyKind::Node),
            },
            None => (node_span, KeyKind::Node),
        };
        let then_index = self.stdlib("unless", "then", then_span, then_kind, Vec::new());
        let else_index = self.stdlib("unless", "else", else_span, else_kind, Vec::new());
        let modifier = node.statements().is_some_and(|statements| {
            statements.location().start_offset() < node.predicate().location().start_offset()
        });
        let then_proof = if modifier {
            KeyProof::Implied(self.decision_outcomes(&node.predicate(), "unless").1)
        } else {
            KeyProof::Probe
        };
        self.claim_line_at(node.predicate().location().end_offset());
        self.key_body(node.statements(), then_index, then_proof);
        if let Some(else_node) = node.else_clause() {
            self.claim_line_at(else_node.else_keyword_loc().end_offset());
            self.key_body(else_node.statements(), else_index, KeyProof::Probe);
        }
        // `unless` runs `then` when the predicate is falsy.
        let proof = DecisionProof {
            true_statements: node
                .else_clause()
                .and_then(|else_node| self.first_statement_id(&else_node.statements()))
                .into_iter()
                .collect(),
            false_statements: self
                .first_statement_id(&node.statements())
                .into_iter()
                .collect(),
        };
        self.predicate_decision(
            || node.predicate(),
            "unless",
            then_index,
            else_index,
            false,
            proof,
        );
    }

    fn loop_node(
        &mut self,
        location: &Location<'_>,
        predicate: Node<'_>,
        statements: Option<StatementsNode<'_>>,
        begin_modifier: bool,
        until: bool,
    ) {
        let kind = if until { "until" } else { "while" };
        let (start, end) = (location.start_offset(), location.end_offset());
        let loop_target = if begin_modifier {
            // `begin ... end while` always enters the body once.
            None
        } else {
            self.branch(
                start,
                end,
                kind,
                [("zero", "zero iterations"), ("entered", "entered")],
            )
            .map(|id| LoopTarget {
                zero: format!("{id}:zero"),
                entered: format!("{id}:entered"),
                id,
                until,
            })
        };
        // The stdlib `body` key proves a same-offset modifier body statement
        // on 3.3; on 3.4+ `x while c` runs its body exactly when the loop is
        // entered, and any other body statement is proven like a statement.
        if let Some(body_span) = self.statements_span(&statements) {
            let index = self.stdlib(kind, "body", body_span, KeyKind::List, Vec::new());
            let modifier = !begin_modifier
                && statements.as_ref().is_some_and(|statements| {
                    statements.location().start_offset() < predicate.location().start_offset()
                });
            let proof = match (&loop_target, modifier) {
                (Some(target), true) => KeyProof::Implied(target.entered.clone()),
                _ => KeyProof::Probe,
            };
            self.key_body(statements, index, proof);
        }
        self.probe_decision(predicate, kind, loop_target, "w");
    }

    fn for_node(&mut self, node: &ForNode<'_>) {
        let location = node.location();
        let Some(id) = self.branch(
            location.start_offset(),
            location.end_offset(),
            "for",
            [("zero", "zero iterations"), ("entered", "entered")],
        ) else {
            return;
        };
        let key = self.probe_key(ProbeTarget::For {
            zero: format!("{id}:zero"),
            entered: format!("{id}:entered"),
            id: id.clone(),
        });
        let collection = node.collection().location();
        self.depth += 1;
        self.wrap(
            collection.start_offset(),
            collection.end_offset(),
            format!("{RUBY_PROBE_RECEIVER}.f({key}, ("),
        );
        self.depth -= 1;
        match node
            .statements()
            .and_then(|statements| statements.body().iter().next())
        {
            Some(first) => self.edit(
                first.location().start_offset(),
                EditRank::StatementProbe,
                format!("{RUBY_PROBE_RECEIVER}.fb({key}); "),
                first.location().end_offset(),
            ),
            None => {
                self.manifest.unmeasured.push(format!("{id}:entered"));
                self.manifest.unmeasured.push(format!("{id}:zero"));
            }
        }
    }

    /// `items.each { ... }` and friends: Ruby's loops are usually method
    /// calls with a block. The receiver is wrapped like a `for` collection
    /// and the block body gets the entry probe, so zero-versus-entered is
    /// exact for every iterator in [`ITERATORS`].
    fn iterator_loop(
        &mut self,
        node: &CallNode<'_>,
        receiver: &Node<'_>,
        block: &ruby_prism::BlockNode<'_>,
    ) {
        let location = node.location();
        let name = String::from_utf8_lossy(node.name().as_slice()).into_owned();
        let Some(id) = self.branch(
            location.start_offset(),
            location.end_offset(),
            &format!("iterator-{}", name.trim_end_matches(['?', '!'])),
            [("zero", "zero iterations"), ("entered", "entered")],
        ) else {
            return;
        };
        let first = block.body().and_then(|body| {
            if let Some(statements) = body.as_statements_node() {
                statements.body().iter().next()
            } else if let Some(begin) = body.as_begin_node() {
                begin
                    .statements()
                    .and_then(|statements| statements.body().iter().next())
            } else {
                None
            }
        });
        let Some(first) = first else {
            // An empty block never enters; both alternatives stay declared
            // but nothing can witness them.
            self.manifest.unmeasured.push(format!("{id}:entered"));
            self.manifest.unmeasured.push(format!("{id}:zero"));
            return;
        };
        let key = self.probe_key(ProbeTarget::For {
            zero: format!("{id}:zero"),
            entered: format!("{id}:entered"),
            id,
        });
        let receiver_location = receiver.location();
        self.depth += 1;
        self.wrap(
            receiver_location.start_offset(),
            receiver_location.end_offset(),
            format!("{RUBY_PROBE_RECEIVER}.f({key}, ("),
        );
        self.depth -= 1;
        self.edit(
            first.location().start_offset(),
            EditRank::StatementProbe,
            format!("{RUBY_PROBE_RECEIVER}.fb({key}); "),
            first.location().end_offset(),
        );
    }

    fn case_node(&mut self, node: &CaseNode<'_>) {
        let node_span = self.location_span(&node.location());
        let (start, end) = (node.location().start_offset(), node.location().end_offset());
        // Known up front so that every clause selection also proves "some
        // clause matched" for a `case` without `else`.
        let no_match_id = node
            .else_clause()
            .is_none()
            .then(|| stable_id(self.file, "branch", start, end, "case-no-match"));
        // An explicit `else` is missed whenever a clause before it is selected.
        let else_id = node.else_clause().map(|else_node| {
            stable_id(
                self.file,
                "branch",
                else_node.location().start_offset(),
                else_node.location().end_offset(),
                "case-else",
            )
        });
        let mut clauses = Vec::new();
        let mut clause_ids = Vec::new();
        for (index, condition) in node.conditions().iter().enumerate() {
            let Some(when) = condition.as_when_node() else {
                continue;
            };
            let Some(id) = self.branch(
                when.location().start_offset(),
                when.location().end_offset(),
                &format!("case-when-{index}"),
                [("missed", "not selected"), ("selected", "selected")],
            ) else {
                return;
            };
            let statements = self.statements_span(&when.statements());
            let span = statements.unwrap_or_else(|| self.location_span(&when.location()));
            let key_index = self.stdlib(
                "case",
                "when",
                span,
                if statements.is_some() {
                    KeyKind::List
                } else {
                    KeyKind::Node
                },
                vec![format!("{id}:selected")],
            );
            self.key_body(when.statements(), key_index, KeyProof::Probe);
            let proven =
                self.clause_proof(&id, &clause_ids, no_match_id.as_deref(), else_id.as_deref());
            // An empty body gets its probe after `then`, or as a `then` of
            // its own after the last condition.
            let (offset, before) = match when.then_keyword_loc() {
                Some(then) => (then.end_offset(), " "),
                None => (
                    when.conditions()
                        .iter()
                        .last()
                        .map(|condition| condition.location().end_offset())
                        .unwrap_or_else(|| when.location().end_offset()),
                    " then ",
                ),
            };
            self.claim_line_at(offset);
            self.body_proves(&when.statements(), proven, offset, before, "");
            clauses.push(CaseClausePlan {
                key: self.branches[key_index].key.clone(),
                missed: format!("{id}:missed"),
                selected: format!("{id}:selected"),
            });
            clause_ids.push(id);
        }
        let no_match = match node.else_clause() {
            Some(else_node) => {
                let Some(id) = self.branch(
                    else_node.location().start_offset(),
                    else_node.location().end_offset(),
                    "case-else",
                    [("missed", "not selected"), ("selected", "selected")],
                ) else {
                    return;
                };
                let statements = self.statements_span(&else_node.statements());
                let span = statements.unwrap_or_else(|| self.location_span(&else_node.location()));
                let key_index = self.stdlib(
                    "case",
                    "else",
                    span,
                    if statements.is_some() {
                        KeyKind::List
                    } else {
                        KeyKind::Node
                    },
                    vec![format!("{id}:selected")],
                );
                self.key_body(else_node.statements(), key_index, KeyProof::Probe);
                let proven = self.clause_proof(&id, &clause_ids, None, None);
                self.claim_line_at(else_node.else_keyword_loc().end_offset());
                self.body_proves(
                    &else_node.statements(),
                    proven,
                    else_node.else_keyword_loc().end_offset(),
                    " ",
                    "",
                );
                clauses.push(CaseClausePlan {
                    key: self.branches[key_index].key.clone(),
                    missed: format!("{id}:missed"),
                    selected: format!("{id}:selected"),
                });
                None
            }
            None => self
                .branch(
                    start,
                    end,
                    "case-no-match",
                    [
                        ("matched", "some clause matched"),
                        ("unmatched", "no clause matched"),
                    ],
                )
                .map(|id| {
                    let key_index = self.stdlib(
                        "case",
                        "else",
                        node_span,
                        KeyKind::Node,
                        vec![format!("{id}:unmatched")],
                    );
                    // Ruby 3.4+: an `else` of Supercov's own, whose only
                    // statement is the probe, runs exactly when no clause
                    // matched and leaves the value nil as before.
                    self.no_match_probe(&id, &clause_ids, node.end_keyword_loc().start_offset());
                    CaseNoMatchPlan {
                        key: self.branches[key_index].key.clone(),
                        matched: format!("{id}:matched"),
                        unmatched: format!("{id}:unmatched"),
                    }
                }),
        };
        self.cases.push(CasePlan { clauses, no_match });
    }

    /// What selecting a clause proves: itself selected, every earlier clause
    /// tested and missed, the explicit `else` missed, and for a `case`
    /// without `else` that a clause matched.
    fn clause_proof(
        &self,
        id: &str,
        earlier: &[String],
        no_match_id: Option<&str>,
        else_id: Option<&str>,
    ) -> Vec<String> {
        let mut ids = vec![format!("{id}:selected")];
        ids.extend(earlier.iter().map(|clause| format!("{clause}:missed")));
        if let Some(no_match) = no_match_id {
            ids.push(format!("{no_match}:matched"));
        }
        if let Some(else_id) = else_id {
            ids.push(format!("{else_id}:missed"));
        }
        ids
    }

    fn no_match_probe(&mut self, id: &str, clauses: &[String], end_keyword: usize) {
        let mut ids = vec![format!("{id}:unmatched")];
        ids.extend(clauses.iter().map(|clause| format!("{clause}:missed")));
        let key = self.probe_key(ProbeTarget::Hits { ids });
        self.edit(
            end_keyword,
            EditRank::StatementProbe,
            format!("else {RUBY_PROBE_RECEIVER}.hs({key}); "),
            end_keyword,
        );
    }

    fn case_match_node(&mut self, node: &CaseMatchNode<'_>) {
        let node_span = self.location_span(&node.location());
        let (start, end) = (node.location().start_offset(), node.location().end_offset());
        let no_match_id = node
            .else_clause()
            .is_none()
            .then(|| stable_id(self.file, "branch", start, end, "case-no-match"));
        // An explicit `else` is missed whenever a clause before it is selected.
        let else_id = node.else_clause().map(|else_node| {
            stable_id(
                self.file,
                "branch",
                else_node.location().start_offset(),
                else_node.location().end_offset(),
                "case-else",
            )
        });
        let mut clauses = Vec::new();
        let mut clause_ids = Vec::new();
        for (index, condition) in node.conditions().iter().enumerate() {
            let Some(in_node) = condition.as_in_node() else {
                continue;
            };
            let Some(id) = self.branch(
                in_node.location().start_offset(),
                in_node.location().end_offset(),
                &format!("case-in-{index}"),
                [("missed", "not selected"), ("selected", "selected")],
            ) else {
                return;
            };
            let statements = self.statements_span(&in_node.statements());
            let span = statements.unwrap_or_else(|| self.location_span(&in_node.location()));
            let key_index = self.stdlib(
                "case",
                "in",
                span,
                if statements.is_some() {
                    KeyKind::List
                } else {
                    KeyKind::Node
                },
                vec![format!("{id}:selected")],
            );
            self.key_body(in_node.statements(), key_index, KeyProof::Probe);
            let proven =
                self.clause_proof(&id, &clause_ids, no_match_id.as_deref(), else_id.as_deref());
            let (offset, before) = match in_node.then_loc() {
                Some(then) => (then.end_offset(), " "),
                None => (in_node.pattern().location().end_offset(), " then "),
            };
            self.claim_line_at(offset);
            self.body_proves(&in_node.statements(), proven, offset, before, "");
            clauses.push(CaseClausePlan {
                key: self.branches[key_index].key.clone(),
                missed: format!("{id}:missed"),
                selected: format!("{id}:selected"),
            });
            clause_ids.push(id);
            // A guard is a decision of its own; Ruby reports no branch key
            // for it, so it is always probe-driven.
            let pattern = in_node.pattern();
            if let Some(guard) = pattern.as_if_node() {
                self.guard_nodes.insert(pattern.location().start_offset());
                self.probe_decision(guard.predicate(), "in-guard", None, "d");
            } else if let Some(guard) = pattern.as_unless_node() {
                self.guard_nodes.insert(pattern.location().start_offset());
                self.probe_decision(guard.predicate(), "in-guard-unless", None, "d");
            }
        }
        let no_match = match node.else_clause() {
            Some(else_node) => {
                let Some(id) = self.branch(
                    else_node.location().start_offset(),
                    else_node.location().end_offset(),
                    "case-else",
                    [("missed", "not selected"), ("selected", "selected")],
                ) else {
                    return;
                };
                let statements = self.statements_span(&else_node.statements());
                let span = statements.unwrap_or_else(|| self.location_span(&else_node.location()));
                let key_index = self.stdlib(
                    "case",
                    "else",
                    span,
                    if statements.is_some() {
                        KeyKind::List
                    } else {
                        KeyKind::Node
                    },
                    vec![format!("{id}:selected")],
                );
                self.key_body(else_node.statements(), key_index, KeyProof::Probe);
                let proven = self.clause_proof(&id, &clause_ids, None, None);
                self.claim_line_at(else_node.else_keyword_loc().end_offset());
                self.body_proves(
                    &else_node.statements(),
                    proven,
                    else_node.else_keyword_loc().end_offset(),
                    " ",
                    "",
                );
                clauses.push(CaseClausePlan {
                    key: self.branches[key_index].key.clone(),
                    missed: format!("{id}:missed"),
                    selected: format!("{id}:selected"),
                });
                None
            }
            None => self
                .branch(
                    start,
                    end,
                    "case-no-match",
                    [
                        ("matched", "some pattern matched"),
                        ("unmatched", "no pattern matched"),
                    ],
                )
                .map(|id| {
                    let key_index = self.stdlib(
                        "case",
                        "else",
                        node_span,
                        KeyKind::Node,
                        vec![format!("{id}:unmatched")],
                    );
                    self.no_match_probe(&id, &clause_ids, node.end_keyword_loc().start_offset());
                    CaseNoMatchPlan {
                        key: self.branches[key_index].key.clone(),
                        matched: format!("{id}:matched"),
                        unmatched: format!("{id}:unmatched"),
                    }
                }),
        };
        self.cases.push(CasePlan { clauses, no_match });
    }

    fn safe_navigation(&mut self, node: &CallNode<'_>) {
        let location = node.location();
        let Some(id) = self.branch(
            location.start_offset(),
            location.end_offset(),
            "safe-navigation",
            [("nil", "receiver nil"), ("called", "method called")],
        ) else {
            return;
        };
        // Ruby's key runs from the receiver to the closing parenthesis or the
        // last argument, and to the message when there are no arguments; a
        // block or block argument is never part of it.
        let end = match node.arguments() {
            Some(arguments) => node
                .closing_loc()
                .map(|closing| closing.end_offset())
                .unwrap_or_else(|| arguments.location().end_offset()),
            None => node
                .message_loc()
                .map(|message| message.end_offset())
                .unwrap_or_else(|| location.end_offset()),
        };
        let (start_line, start_column) = self.line_column(location.start_offset());
        let (end_line, end_column) = self.line_column(end);
        let span = PlanSpan {
            start: [start_line, start_column],
            end: [end_line, end_column],
        };
        self.stdlib(
            "&.",
            "then",
            span,
            KeyKind::Node,
            vec![format!("{id}:called")],
        );
        self.stdlib("&.", "else", span, KeyKind::Node, vec![format!("{id}:nil")]);
        // Ruby 3.4+: the receiver's value decides, so the receiver is probed.
        if let Some(receiver) = node.receiver() {
            let key = self.probe_key(ProbeTarget::SafeNavigation {
                nil: format!("{id}:nil"),
                called: format!("{id}:called"),
            });
            let receiver = receiver.location();
            self.depth += 1;
            self.wrap(
                receiver.start_offset(),
                receiver.end_offset(),
                format!("{RUBY_PROBE_RECEIVER}.n({key}, ("),
            );
            self.depth -= 1;
        }
    }

    fn value_logical(&mut self, op: &str, left: &Node<'_>, node_start: usize, node_end: usize) {
        let Some(id) = self.branch(
            node_start,
            node_end,
            &format!("logical-{op}"),
            [
                ("short-circuit", "short-circuited"),
                ("evaluated", "right operand evaluated"),
            ],
        ) else {
            return;
        };
        let key = self.probe_key(ProbeTarget::Logical {
            op: op.into(),
            short_circuit: format!("{id}:short-circuit"),
            evaluated: format!("{id}:evaluated"),
        });
        let left = left.location();
        self.depth += 1;
        self.wrap(
            left.start_offset(),
            left.end_offset(),
            format!("{RUBY_PROBE_RECEIVER}.l({key}, ("),
        );
        self.depth -= 1;
    }

    /// `x ||= v` / `x &&= v`. A variable target can be re-read without side
    /// effects, so the whole expression becomes `(l(k, x); x ||= v)`; other
    /// targets only get the evaluated side.
    fn op_assign(
        &mut self,
        op: &str,
        node_start: usize,
        node_end: usize,
        name: Option<&[u8]>,
        value: &Node<'_>,
    ) {
        let Some(id) = self.branch(
            node_start,
            node_end,
            &format!("{op}-assign"),
            [
                ("short-circuit", "assignment skipped"),
                ("evaluated", "value evaluated and assigned"),
            ],
        ) else {
            return;
        };
        match name {
            Some(name) => {
                let key = self.probe_key(ProbeTarget::Logical {
                    op: op.into(),
                    short_circuit: format!("{id}:short-circuit"),
                    evaluated: format!("{id}:evaluated"),
                });
                let name = String::from_utf8_lossy(name);
                self.depth += 1;
                self.edit(
                    node_start,
                    EditRank::Opener,
                    format!("({RUBY_PROBE_RECEIVER}.l({key}, {name}); "),
                    node_end,
                );
                self.edit(node_end, EditRank::Closer, ")".into(), node_start);
                self.depth -= 1;
            }
            None => {
                // `(pre(k); recv[i] ||= (es(k); v))`: the target is evaluated
                // exactly once, as before; arrivals and right-side starts are
                // counted per phase and their difference is the skipped side.
                let key = self.probe_key(ProbeTarget::Arrival {
                    short_circuit: format!("{id}:short-circuit"),
                    evaluated: format!("{id}:evaluated"),
                });
                let value_location = value.location();
                self.depth += 1;
                self.edit(
                    node_start,
                    EditRank::Opener,
                    format!("({RUBY_PROBE_RECEIVER}.pre({key}); "),
                    node_end,
                );
                self.edit(node_end, EditRank::Closer, ")".into(), node_start);
                self.depth += 1;
                self.edit(
                    value_location.start_offset(),
                    EditRank::Opener,
                    format!("({RUBY_PROBE_RECEIVER}.es({key}); "),
                    value_location.end_offset(),
                );
                self.edit(
                    value_location.end_offset(),
                    EditRank::Closer,
                    ")".into(),
                    value_location.start_offset(),
                );
                self.depth -= 2;
            }
        }
    }

    // -- exception flow -----------------------------------------------------

    /// `begin`/`rescue`/`else`/`ensure` in any host: explicit `begin`, a
    /// method body, or a `do` block. `close` is where the closing keyword
    /// lives, which is where the propagation clause is inserted when the
    /// construct has no `else` or `ensure`.
    fn begin_node(&mut self, node: &BeginNode<'_>, close: Option<usize>) {
        let has_rescue = node.rescue_clause().is_some();
        let has_ensure = node.ensure_clause().is_some();
        if !has_rescue && !has_ensure {
            return;
        }
        let location = node.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let Some(id) = self.branch(
            start,
            end,
            "begin",
            [
                ("success", "body completed"),
                ("raised", "exception raised"),
            ],
        ) else {
            return;
        };
        let mut handlers = Vec::new();
        let mut handler_edits = Vec::new();
        let mut rescue = node.rescue_clause();
        let mut index = 0;
        while let Some(clause) = rescue {
            let clause_location = clause.location();
            let Some(handler_id) = self.branch(
                clause_location.start_offset(),
                clause_location.end_offset(),
                &format!("rescue-{index}"),
                [("missed", "not selected"), ("selected", "selected")],
            ) else {
                return;
            };
            handlers.push(HandlerTarget {
                missed: format!("{handler_id}:missed"),
                selected: format!("{handler_id}:selected"),
                id: handler_id,
            });
            handler_edits.push(self.handler_probe_position(&clause));
            rescue = clause.subsequent();
            index += 1;
        }
        let key = self.probe_key(ProbeTarget::Try {
            success: format!("{id}:success"),
            raised: format!("{id}:raised"),
            id: id.clone(),
            handlers,
        });
        for (index, (offset, leading, scope_end)) in handler_edits.into_iter().enumerate() {
            let text = if leading {
                format!("; {RUBY_PROBE_RECEIVER}.h({key}, {index})")
            } else {
                format!("{RUBY_PROBE_RECEIVER}.h({key}, {index}); ")
            };
            self.edit(offset, EditRank::StatementProbe, text, scope_end);
        }
        // Propagation clause: after every user clause, before else/ensure/end.
        let clause_offset = node
            .else_clause()
            .map(|clause| clause.else_keyword_loc().start_offset())
            .or_else(|| {
                node.ensure_clause()
                    .map(|clause| clause.ensure_keyword_loc().start_offset())
            })
            .or_else(|| node.end_keyword_loc().map(|loc| loc.start_offset()))
            .or(close);
        match clause_offset {
            Some(offset) => self.edit(
                offset,
                EditRank::Clause,
                format!(
                    "rescue Exception => __supercov_e; {RUBY_PROBE_RECEIVER}.p({key}); raise; "
                ),
                offset,
            ),
            None => {
                self.manifest.unmeasured.push(format!("{id}:raised"));
                let (line, _) = self.line_column(start);
                self.begin_unmeasured.push((id.clone(), line));
            }
        }
        // Completion: the else clause runs only after a completed body.
        if let Some(else_clause) = node.else_clause() {
            match else_clause
                .statements()
                .and_then(|statements| statements.body().iter().next())
            {
                Some(first) => self.edit(
                    first.location().start_offset(),
                    EditRank::StatementProbe,
                    format!("{RUBY_PROBE_RECEIVER}.ok0({key}); "),
                    first.location().end_offset(),
                ),
                None => self.edit(
                    else_clause.else_keyword_loc().end_offset(),
                    EditRank::StatementProbe,
                    format!(" {RUBY_PROBE_RECEIVER}.ok0({key});"),
                    else_clause.else_keyword_loc().end_offset(),
                ),
            }
            return;
        }
        let last = node
            .statements()
            .and_then(|statements| statements.body().iter().last());
        match last {
            Some(last) => {
                if !self.completion_probe(last, key) {
                    self.manifest.unmeasured.push(format!("{id}:success"));
                    let (line, _) = self.line_column(start);
                    self.begin_unmeasured.push((id, line));
                }
            }
            None => {
                self.manifest.unmeasured.push(format!("{id}:success"));
                let (line, _) = self.line_column(start);
                self.begin_unmeasured.push((id, line));
            }
        }
    }

    /// Where the handler-entry probe goes: before the first body statement,
    /// or right after the clause header when the body is empty.
    fn handler_probe_position(&self, clause: &RescueNode<'_>) -> (usize, bool, usize) {
        if let Some(first) = clause
            .statements()
            .and_then(|statements| statements.body().iter().next())
        {
            return (
                first.location().start_offset(),
                false,
                first.location().end_offset(),
            );
        }
        let offset = if let Some(then_keyword) = clause.then_keyword_loc() {
            then_keyword.end_offset()
        } else if let Some(reference) = clause.reference() {
            reference.location().end_offset()
        } else if let Some(last) = clause.exceptions().iter().last() {
            last.location().end_offset()
        } else {
            clause.keyword_loc().end_offset()
        };
        (offset, true, offset)
    }

    /// True for an expression whose own value can be a jump: a `return`,
    /// `break`, `next`, `redo` or `retry`, or an `if`, `unless`, ternary,
    /// `case` or nested `begin` with an arm that ends in one. Such an
    /// expression may not be wrapped. Ruby rejects the parenthesised form
    /// outright when every arm is a jump ("void value expression"), and when
    /// only some arms are, passing it as an argument -- which is what a
    /// wrapper does -- makes the compiler miscount its stack ("argument stack
    /// underflow") for shapes that are hard to predict. Its arms are probed
    /// instead. A jump reached through a block, a loop or `&&`/`||` belongs to
    /// that construct rather than to this expression's value, and is fine.
    fn jump_exposed(&self, node: &Node<'_>) -> bool {
        if Self::is_jump(node) {
            return true;
        }
        if let Some(if_node) = node.as_if_node() {
            let else_exposed = match if_node.subsequent() {
                Some(subsequent) => match subsequent.as_else_node() {
                    Some(else_node) => self.arm_jump_exposed(else_node.statements()),
                    None => self.jump_exposed(&subsequent),
                },
                None => false,
            };
            return else_exposed || self.arm_jump_exposed(if_node.statements());
        }
        if let Some(unless_node) = node.as_unless_node() {
            let else_exposed = match unless_node.else_clause() {
                Some(else_node) => self.arm_jump_exposed(else_node.statements()),
                None => false,
            };
            return else_exposed || self.arm_jump_exposed(unless_node.statements());
        }
        if let Some(begin) = node.as_begin_node() {
            if self.arm_jump_exposed(begin.statements())
                || begin
                    .else_clause()
                    .is_some_and(|else_node| self.arm_jump_exposed(else_node.statements()))
            {
                return true;
            }
            let mut rescue = begin.rescue_clause();
            while let Some(clause) = rescue {
                if self.arm_jump_exposed(clause.statements()) {
                    return true;
                }
                rescue = clause.subsequent();
            }
            return false;
        }
        if let Some(case_node) = node.as_case_node() {
            return case_node
                .conditions()
                .iter()
                .any(|condition| match condition.as_when_node() {
                    Some(when_node) => self.arm_jump_exposed(when_node.statements()),
                    None => false,
                })
                || case_node
                    .else_clause()
                    .is_some_and(|else_node| self.arm_jump_exposed(else_node.statements()));
        }
        if let Some(case_node) = node.as_case_match_node() {
            return case_node
                .conditions()
                .iter()
                .any(|condition| match condition.as_in_node() {
                    Some(in_node) => self.arm_jump_exposed(in_node.statements()),
                    None => false,
                })
                || case_node
                    .else_clause()
                    .is_some_and(|else_node| self.arm_jump_exposed(else_node.statements()));
        }
        if let Some(parentheses) = node.as_parentheses_node() {
            return match parentheses.body() {
                Some(body) => match body.as_statements_node() {
                    Some(statements) => self.arm_jump_exposed(Some(statements)),
                    None => self.jump_exposed(&body),
                },
                None => false,
            };
        }
        false
    }

    fn arm_jump_exposed(&self, statements: Option<StatementsNode<'_>>) -> bool {
        match statements.and_then(|statements| statements.body().iter().last()) {
            Some(last) => self.jump_exposed(&last),
            None => false,
        }
    }

    /// The expressions to wrap so the construct's normal completion is
    /// observed, or `None` when it cannot be observed at all. A statement that
    /// may not be wrapped is replaced by its arms, of which exactly one runs;
    /// an arm that is missing (an `if` with no `else`, whose fall-through
    /// carries no expression) makes the whole construct unobservable.
    fn probe_targets<'n>(&self, node: Node<'n>) -> Option<Vec<Node<'n>>> {
        if Self::is_jump(&node) {
            return Some(vec![node]);
        }
        if node.as_multi_write_node().is_some()
            || node.as_alias_method_node().is_some()
            || node.as_alias_global_variable_node().is_some()
            || node.as_undef_node().is_some()
        {
            return None;
        }
        if !self.jump_exposed(&node) {
            return Some(vec![node]);
        }
        if let Some(if_node) = node.as_if_node() {
            let mut targets = self.arm_targets(if_node.statements())?;
            match if_node.subsequent() {
                Some(subsequent) => match subsequent.as_else_node() {
                    Some(else_node) => targets.extend(self.arm_targets(else_node.statements())?),
                    None => targets.extend(self.probe_targets(subsequent)?),
                },
                None => return None,
            }
            return Some(targets);
        }
        if let Some(unless_node) = node.as_unless_node() {
            let mut targets = self.arm_targets(unless_node.statements())?;
            let else_node = unless_node.else_clause()?;
            targets.extend(self.arm_targets(else_node.statements())?);
            return Some(targets);
        }
        if let Some(case_node) = node.as_case_node() {
            let mut targets = Vec::new();
            for condition in case_node.conditions().iter() {
                let when_node = condition.as_when_node()?;
                targets.extend(self.arm_targets(when_node.statements())?);
            }
            targets.extend(self.arm_targets(case_node.else_clause()?.statements())?);
            return Some(targets);
        }
        if let Some(case_node) = node.as_case_match_node() {
            let mut targets = Vec::new();
            for condition in case_node.conditions().iter() {
                let in_node = condition.as_in_node()?;
                targets.extend(self.arm_targets(in_node.statements())?);
            }
            targets.extend(self.arm_targets(case_node.else_clause()?.statements())?);
            return Some(targets);
        }
        if let Some(begin) = node.as_begin_node() {
            let mut targets = match begin.else_clause() {
                Some(else_node) => self.arm_targets(else_node.statements())?,
                None => self.arm_targets(begin.statements())?,
            };
            let mut rescue = begin.rescue_clause();
            while let Some(clause) = rescue {
                targets.extend(self.arm_targets(clause.statements())?);
                rescue = clause.subsequent();
            }
            return Some(targets);
        }
        if let Some(parentheses) = node.as_parentheses_node() {
            let body = parentheses.body()?;
            return match body.as_statements_node() {
                Some(statements) => self.arm_targets(Some(statements)),
                None => self.probe_targets(body),
            };
        }
        None
    }

    fn arm_targets<'n>(&self, statements: Option<StatementsNode<'n>>) -> Option<Vec<Node<'n>>> {
        let last = statements.and_then(|statements| statements.body().iter().last())?;
        self.probe_targets(last)
    }

    /// Wrap the body's final statement so its normal completion is observed
    /// without changing the value of the construct. Returns false when the
    /// statement has no expression form to wrap (see
    /// [`Collector::jump_exposed`]).
    fn completion_probe(&mut self, last: Node<'_>, key: u64) -> bool {
        let Some(targets) = self.probe_targets(last) else {
            return false;
        };
        for target in &targets {
            self.wrap_completion(target, key);
        }
        true
    }

    /// One expression whose completion proves the construct completed.
    fn wrap_completion(&mut self, last: &Node<'_>, key: u64) {
        let location = last.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let arguments = if let Some(node) = last.as_return_node() {
            Some((node.keyword_loc(), node.arguments()))
        } else if let Some(node) = last.as_break_node() {
            Some((node.keyword_loc(), node.arguments()))
        } else {
            last.as_next_node()
                .map(|node| (node.keyword_loc(), node.arguments()))
        };
        if let Some((keyword, arguments)) = arguments {
            match arguments {
                Some(arguments) => {
                    let arguments_location = arguments.location();
                    let multiple = arguments.arguments().iter().count() > 1
                        || arguments
                            .arguments()
                            .iter()
                            .any(|argument| argument.as_splat_node().is_some());
                    let (open, close) = if multiple {
                        // `return a, b` already returns `[a, b]`.
                        (format!("{RUBY_PROBE_RECEIVER}.ok({key}, ["), "])")
                    } else {
                        (format!("{RUBY_PROBE_RECEIVER}.ok({key}, ("), "))")
                    };
                    self.depth += 1;
                    self.edit(
                        arguments_location.start_offset(),
                        EditRank::Opener,
                        open,
                        arguments_location.end_offset(),
                    );
                    self.edit(
                        arguments_location.end_offset(),
                        EditRank::Closer,
                        close.into(),
                        arguments_location.start_offset(),
                    );
                    self.depth -= 1;
                }
                None => self.edit(
                    keyword.start_offset(),
                    EditRank::StatementProbe,
                    format!("{RUBY_PROBE_RECEIVER}.ok0({key}); "),
                    end,
                ),
            }
            return;
        }
        if last.as_redo_node().is_some() || last.as_retry_node().is_some() {
            self.edit(
                start,
                EditRank::StatementProbe,
                format!("{RUBY_PROBE_RECEIVER}.ok0({key}); "),
                end,
            );
            return;
        }
        self.depth += 1;
        self.wrap(start, end, format!("{RUBY_PROBE_RECEIVER}.ok({key}, ("));
        self.depth -= 1;
    }

    fn rescue_modifier(&mut self, node: &RescueModifierNode<'_>) {
        let location = node.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let Some(id) = self.branch(
            start,
            end,
            "rescue-modifier",
            [
                ("success", "expression completed"),
                ("raised", "fallback used"),
            ],
        ) else {
            return;
        };
        let key = self.probe_key(ProbeTarget::Try {
            success: format!("{id}:success"),
            raised: format!("{id}:raised"),
            id,
            handlers: Vec::new(),
        });
        let expression = node.expression();
        let fallback_node = node.rescue_expression();
        let fallback = fallback_node.location();
        self.depth += 1;
        if Self::is_jump(&expression) {
            // `return x rescue y` has no value to wrap: probe the jump's
            // argument or the jump itself, as for a body's final statement.
            self.completion_probe(expression, key);
        } else {
            let expression = expression.location();
            self.wrap(
                expression.start_offset(),
                expression.end_offset(),
                format!("{RUBY_PROBE_RECEIVER}.ok({key}, ("),
            );
        }
        if Self::is_jump(&fallback_node) {
            // `rescue next` has no value either: `rescue (hm0(k); next)`.
            self.edit(
                fallback.start_offset(),
                EditRank::Opener,
                format!("({RUBY_PROBE_RECEIVER}.hm0({key}); "),
                fallback.end_offset(),
            );
            self.edit(
                fallback.end_offset(),
                EditRank::Closer,
                ")".into(),
                fallback.start_offset(),
            );
        } else {
            self.wrap(
                fallback.start_offset(),
                fallback.end_offset(),
                format!("{RUBY_PROBE_RECEIVER}.hm({key}, ("),
            );
        }
        self.depth -= 1;
    }

    /// A statement that leaves its frame or loop without producing a value.
    fn is_jump(node: &Node<'_>) -> bool {
        node.as_return_node().is_some()
            || node.as_break_node().is_some()
            || node.as_next_node().is_some()
            || node.as_redo_node().is_some()
            || node.as_retry_node().is_some()
    }

    fn def_node(&mut self, node: &DefNode<'_>) {
        let location = node.location();
        let (start, end) = (location.start_offset(), location.end_offset());
        let name = String::from_utf8_lossy(node.name().as_slice()).into_owned();
        let id = stable_id(self.file, "function", start, end, &name);
        if !self.point_ids.insert(id.clone()) {
            return;
        }
        self.push_point(&id, start, end, PointKind::Function, Some(name));
        let span = self.location_span(&location);
        self.methods.push(MethodKeyPlan {
            span,
            unshifted: span,
            id: id.clone(),
        });
        // Ruby 3.4+: the body's first statement runs exactly when the method
        // is entered; a body with none gets a probe after the signature.
        let body_statements = node.body().and_then(|body| {
            if let Some(statements) = body.as_statements_node() {
                Some(statements)
            } else {
                body.as_begin_node().and_then(|begin| begin.statements())
            }
        });
        let signature_end = node
            .rparen_loc()
            .map(|rparen| rparen.end_offset())
            .or_else(|| {
                node.parameters()
                    .map(|parameters| parameters.location().end_offset())
            })
            .unwrap_or_else(|| node.name_loc().end_offset());
        self.body_proves(&body_statements, vec![id], signature_end, "; ", "");
        if let Some(body) = node.body()
            && let Some(begin) = body.as_begin_node()
        {
            self.begin_node(&begin, node.end_keyword_loc().map(|loc| loc.start_offset()));
        }
        if node.equal_loc().is_some()
            && let Some(body) = node.body()
            && let Some(statements) = body.as_statements_node()
        {
            for statement in statements.body().iter() {
                self.endless_bodies
                    .insert(statement.location().start_offset());
            }
        }
    }

    // -- finishing ----------------------------------------------------------

    /// Column shift the insertions cause on one line, for positions the
    /// runtime will read back from Ruby's `Coverage`. Insertions strictly
    /// inside a key's line range move whatever follows them. At a key's start,
    /// a probe moves an expression (it now follows the probe) but not a
    /// statement list whose first statement was probed, since the list still
    /// starts where the probe does; a list strictly containing the probed
    /// statement moves. An opener moves a key whose node it wraps (the node
    /// now sits inside the wrapper) and leaves alone a key whose node contains
    /// the wrapped one, since that node now begins with the wrapper. At a key's
    /// end, only a closer whose opener lies inside the key extends it: a list
    /// includes a wrapper around its last statement, an expression does not
    /// include the wrapper around itself. A point key follows everything
    /// inserted up to it, closers included.
    fn shifted(&self, span: PlanSpan, kind: KeyKind, edits: &[PendingEdit]) -> PlanSpan {
        let start_offset = self.line_starts[span.start[0] - 1] + span.start[1];
        let end_offset = self.line_starts[span.end[0] - 1] + span.end[1];
        let mut start_shift = 0;
        let mut end_shift = 0;
        for edit in edits {
            let (line, _) = self.line_column(edit.offset);
            let moves_start = edit.offset < start_offset
                || (edit.offset == start_offset
                    && match (edit.rank, kind) {
                        (_, KeyKind::Point) => true,
                        (EditRank::Closer, _) => false,
                        (EditRank::Opener, KeyKind::List) => end_offset < edit.scope,
                        (EditRank::Opener, KeyKind::Node) => end_offset <= edit.scope,
                        (_, KeyKind::List) => end_offset < edit.scope,
                        (_, KeyKind::Node) => true,
                    });
            let moves_end = edit.offset < end_offset
                || (edit.offset == end_offset
                    && match (edit.rank, kind) {
                        (_, KeyKind::Point) => true,
                        (EditRank::Closer, KeyKind::List) => edit.scope >= start_offset,
                        (EditRank::Closer, KeyKind::Node) => edit.scope > start_offset,
                        _ => false,
                    });
            if line == span.start[0] && moves_start {
                start_shift += edit.text.len();
            }
            if line == span.end[0] && moves_end {
                end_shift += edit.text.len();
            }
        }
        PlanSpan {
            start: [span.start[0], span.start[1] + start_shift],
            end: [span.end[0], span.end[1] + end_shift],
        }
    }

    /// Remove every insertion inside a `Ractor.new` block. What those probes
    /// alone would have proven -- and what their observations would have
    /// implied -- leaves the denominator, declared at the block; lines stay.
    fn drop_ractor_insertions(
        &mut self,
        pending: Vec<PendingEdit>,
        blocks: &[(usize, usize)],
    ) -> Vec<PendingEdit> {
        let inside = |offset: usize| {
            blocks
                .iter()
                .any(|(start, end)| offset >= *start && offset < *end)
        };
        let (dropped, kept): (Vec<_>, Vec<_>) =
            pending.into_iter().partition(|edit| inside(edit.offset));
        let mut keys = BTreeSet::new();
        for edit in &dropped {
            keys.extend(probe_keys_in(&edit.text));
        }
        let mut targets = BTreeMap::new();
        for key in &keys {
            if let Some(target) = self.probes.remove(key) {
                targets.insert(*key, target);
            }
        }
        let mut unmeasured = probe_obligations_of(&targets);
        for target in targets.values() {
            for named in target_ids(target) {
                if let Some(implied) = self.implied.get(&named) {
                    unmeasured.extend(implied.hits.iter().map(|id| obligation_of(id)));
                    unmeasured.extend(implied.decisions.iter().map(|d| d.id.clone()));
                }
            }
        }
        unmeasured.sort();
        unmeasured.dedup();
        self.manifest.unmeasured.extend(unmeasured);
        for (start, end) in blocks {
            let (line, _) = self.line_column(*start);
            let source = self
                .text(*start, *end)
                .lines()
                .next()
                .unwrap_or_default()
                .to_owned();
            self.manifest.limitations.push(limitation(
                RACTOR_BLOCK_LIMITATION,
                self.file,
                line,
                &source,
                "a Ractor block cannot call Supercov's probes (a non-main Ractor cannot read the probe receiver), so what only a probe could prove inside it is unmeasured; its lines are still counted",
            ));
        }
        kept
    }

    fn finish(mut self) -> RubyFileObligations {
        let mut pending = std::mem::take(&mut self.edits);
        pending.sort_by(|left, right| {
            left.offset
                .cmp(&right.offset)
                .then(left.rank.cmp(&right.rank))
                .then(left.order.cmp(&right.order))
                .then(left.sequence.cmp(&right.sequence))
        });
        let ractor_blocks = std::mem::take(&mut self.ractor_blocks);
        if !ractor_blocks.is_empty() {
            pending = self.drop_ractor_insertions(pending, &ractor_blocks);
        }
        let branches = std::mem::take(&mut self.branches)
            .into_iter()
            .map(|mut branch| {
                branch.key.span = self.shifted(branch.key.span, branch.key.kind, &pending);
                branch
            })
            .collect::<Vec<_>>();
        let cases: Vec<CasePlan> = std::mem::take(&mut self.cases)
            .into_iter()
            .map(|mut case| {
                for clause in &mut case.clauses {
                    clause.key.span = self.shifted(clause.key.span, clause.key.kind, &pending);
                }
                if let Some(no_match) = &mut case.no_match {
                    no_match.key.span =
                        self.shifted(no_match.key.span, no_match.key.kind, &pending);
                }
                case
            })
            .collect();
        let methods: Vec<MethodKeyPlan> = std::mem::take(&mut self.methods)
            .into_iter()
            .map(|mut method| {
                method.span = self.shifted(method.span, KeyKind::Node, &pending);
                method
            })
            .collect();
        let edits = pending
            .into_iter()
            .map(|edit| Edit {
                offset: edit.offset,
                text: edit.text,
                rank: match edit.rank {
                    EditRank::Clause => "clause",
                    EditRank::StatementProbe => "statement",
                    EditRank::Opener => "opener",
                    EditRank::Closer => "closer",
                }
                .into(),
                scope: edit.scope,
            })
            .collect::<Vec<_>>();
        if let Some((id, line)) = self.begin_unmeasured.first() {
            let source = self
                .manifest
                .branches
                .iter()
                .find(|branch| &branch.id == id)
                .map(|branch| branch.source.lines().next().unwrap_or_default().to_owned())
                .unwrap_or_default();
            self.manifest.limitations.push(limitation(
                BEGIN_BODY_LIMITATION,
                self.file,
                *line,
                &source,
                "a begin body that is empty, or ends in a statement with no expression form, cannot have its completion observed",
            ));
        }
        self.manifest.unmeasured.sort();
        self.manifest.unmeasured.dedup();
        RubyFileObligations {
            manifest: self.manifest,
            plan: RubyFilePlan {
                ractor_blocks: ractor_blocks
                    .iter()
                    .map(|(start, end)| [*start, *end])
                    .collect(),
                // What only a probe proves on 3.3: the probe-provable set
                // minus what 3.3 still proves through Coverage's keys.
                probe_obligations: {
                    let keyed = stdlib_provable(&branches, &cases, &methods);
                    probe_obligations_of(&self.probes)
                        .into_iter()
                        .filter(|id| !keyed.contains(id))
                        .collect()
                },
                edits,
                lines: self.lines,
                statement_offsets: self.statement_offsets,
                branches,
                methods,
                cases,
                implied: self.implied,
            },
            probes: self.probes,
        }
    }
}

fn limitation(id: &str, file: &str, line: usize, source: &str, reason: &str) -> serde_json::Value {
    json!({
        "id": id,
        "kind": "semantic-safety",
        "file": file,
        "line": line,
        "column": 0,
        "source": source,
        "reason": reason
    })
}

impl<'pr> Visit<'pr> for Collector<'_> {
    fn visit_statements_node(&mut self, node: &StatementsNode<'pr>) {
        if !self
            .expression_lists
            .contains(&node.location().start_offset())
        {
            self.statements(node);
        }
        ruby_prism::visit_statements_node(self, node);
    }

    fn visit_parentheses_node(&mut self, node: &ruby_prism::ParenthesesNode<'pr>) {
        if let Some(body) = node.body() {
            self.expression_lists.insert(body.location().start_offset());
        }
        ruby_prism::visit_parentheses_node(self, node);
    }

    fn visit_embedded_statements_node(&mut self, node: &ruby_prism::EmbeddedStatementsNode<'pr>) {
        if let Some(statements) = node.statements() {
            self.expression_lists
                .insert(statements.location().start_offset());
        }
        ruby_prism::visit_embedded_statements_node(self, node);
    }

    fn visit_if_node(&mut self, node: &IfNode<'pr>) {
        let offset = node.location().start_offset();
        if self.guard_nodes.contains(&offset) {
            // A `case/in` guard: Prism hands the guarded pattern over as the
            // guard's statements, but a pattern is not a statement. Only the
            // predicate holds code.
            self.depth += 1;
            self.visit(&node.predicate());
            self.depth -= 1;
            return;
        }
        if self.elsif_nodes.contains(&offset) {
            self.depth += 1;
            ruby_prism::visit_if_node(self, node);
            self.depth -= 1;
            return;
        }
        if let Some(truthy) = self.literal_truth(node.predicate()) {
            // Ruby compiles only the live arm of `if false` / `if true` and
            // reports no branch for it; the dead arm is not code that can run.
            // A folded `x and false` still evaluates `x`, whose own code is
            // measured like any expression.
            self.depth += 1;
            self.visit(&node.predicate());
            if truthy {
                if let Some(statements) = node.statements() {
                    self.visit_statements_node(&statements);
                }
            } else if let Some(subsequent) = node.subsequent() {
                match subsequent.as_if_node() {
                    Some(elsif) => self.visit_if_node(&elsif),
                    None => {
                        if let Some(else_node) = subsequent.as_else_node()
                            && let Some(statements) = else_node.statements()
                        {
                            self.visit_statements_node(&statements);
                        }
                    }
                }
            }
            self.depth -= 1;
            return;
        }
        // Ternaries have no `if` keyword; `elsif` is reached through
        // `subsequent` and handled by the parent's chain walk below.
        let kind = if node.if_keyword_loc().is_none() {
            "ternary"
        } else {
            "if"
        };
        self.if_node(node, kind);
        let mut subsequent = node.subsequent();
        while let Some(next) = subsequent {
            match next.as_if_node() {
                Some(elsif) => {
                    self.elsif_nodes.insert(elsif.location().start_offset());
                    self.if_node(&elsif, "elsif");
                    subsequent = elsif.subsequent();
                }
                None => break,
            }
        }
        self.depth += 1;
        // Children: predicate, statements, then the chain. Elsif nodes are
        // visited as children here too, but `if_node` deduplicates by
        // decision id.
        ruby_prism::visit_if_node(self, node);
        self.depth -= 1;
    }

    fn visit_unless_node(&mut self, node: &ruby_prism::UnlessNode<'pr>) {
        if self.guard_nodes.contains(&node.location().start_offset()) {
            self.depth += 1;
            self.visit(&node.predicate());
            self.depth -= 1;
            return;
        }
        if let Some(truthy) = self.literal_truth(node.predicate()) {
            self.depth += 1;
            self.visit(&node.predicate());
            if truthy {
                if let Some(else_node) = node.else_clause()
                    && let Some(statements) = else_node.statements()
                {
                    self.visit_statements_node(&statements);
                }
            } else if let Some(statements) = node.statements() {
                self.visit_statements_node(&statements);
            }
            self.depth -= 1;
            return;
        }
        self.unless_node(node);
        self.depth += 1;
        ruby_prism::visit_unless_node(self, node);
        self.depth -= 1;
    }

    fn visit_while_node(&mut self, node: &WhileNode<'pr>) {
        self.loop_node(
            &node.location(),
            node.predicate(),
            node.statements(),
            node.is_begin_modifier(),
            false,
        );
        self.depth += 1;
        ruby_prism::visit_while_node(self, node);
        self.depth -= 1;
    }

    fn visit_until_node(&mut self, node: &UntilNode<'pr>) {
        self.loop_node(
            &node.location(),
            node.predicate(),
            node.statements(),
            node.is_begin_modifier(),
            true,
        );
        self.depth += 1;
        ruby_prism::visit_until_node(self, node);
        self.depth -= 1;
    }

    fn visit_for_node(&mut self, node: &ForNode<'pr>) {
        self.for_node(node);
        self.depth += 1;
        ruby_prism::visit_for_node(self, node);
        self.depth -= 1;
    }

    fn visit_case_node(&mut self, node: &CaseNode<'pr>) {
        self.case_node(node);
        self.depth += 1;
        ruby_prism::visit_case_node(self, node);
        self.depth -= 1;
    }

    fn visit_case_match_node(&mut self, node: &CaseMatchNode<'pr>) {
        self.case_match_node(node);
        self.depth += 1;
        ruby_prism::visit_case_match_node(self, node);
        self.depth -= 1;
    }

    fn visit_and_node(&mut self, node: &AndNode<'pr>) {
        let location = node.location();
        if !self.tree_logicals.contains(&location.start_offset()) {
            let left = node.left();
            self.value_logical("and", &left, location.start_offset(), location.end_offset());
        }
        self.depth += 1;
        ruby_prism::visit_and_node(self, node);
        self.depth -= 1;
    }

    fn visit_or_node(&mut self, node: &OrNode<'pr>) {
        let location = node.location();
        if !self.tree_logicals.contains(&location.start_offset()) {
            let left = node.left();
            self.value_logical("or", &left, location.start_offset(), location.end_offset());
        }
        self.depth += 1;
        ruby_prism::visit_or_node(self, node);
        self.depth -= 1;
    }

    fn visit_call_node(&mut self, node: &CallNode<'pr>) {
        if node.name().as_slice() == b"new"
            && node.receiver().is_some_and(|receiver| {
                receiver
                    .as_constant_read_node()
                    .is_some_and(|constant| constant.name().as_slice() == b"Ractor")
            })
            && let Some(block) = node.block()
            && block.as_block_node().is_some()
        {
            let location = block.location();
            self.ractor_blocks
                .push((location.start_offset(), location.end_offset()));
        }
        if node.is_safe_navigation() {
            self.safe_navigation(node);
        }
        if let Some(block) = node.block()
            && let Some(block) = block.as_block_node()
            && let Some(receiver) = node.receiver()
            && !node.is_safe_navigation()
            && ITERATORS.contains(&node.name().as_slice())
        {
            self.iterator_loop(node, &receiver, &block);
        }
        self.depth += 1;
        ruby_prism::visit_call_node(self, node);
        self.depth -= 1;
    }

    fn visit_local_variable_or_write_node(
        &mut self,
        node: &ruby_prism::LocalVariableOrWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            Some(node.name().as_slice()),
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_local_variable_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_local_variable_and_write_node(
        &mut self,
        node: &ruby_prism::LocalVariableAndWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "and",
            location.start_offset(),
            location.end_offset(),
            Some(node.name().as_slice()),
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_local_variable_and_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_instance_variable_or_write_node(
        &mut self,
        node: &ruby_prism::InstanceVariableOrWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            Some(node.name().as_slice()),
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_instance_variable_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_instance_variable_and_write_node(
        &mut self,
        node: &ruby_prism::InstanceVariableAndWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "and",
            location.start_offset(),
            location.end_offset(),
            Some(node.name().as_slice()),
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_instance_variable_and_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_global_variable_or_write_node(
        &mut self,
        node: &ruby_prism::GlobalVariableOrWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            Some(node.name().as_slice()),
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_global_variable_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_class_variable_or_write_node(
        &mut self,
        node: &ruby_prism::ClassVariableOrWriteNode<'pr>,
    ) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            // Reading an uninitialized class variable raises (unlike an
            // instance or global variable), so it cannot be re-read up front;
            // the arrival form counts the skipped side instead. Found by the
            // corpus sweep on railties' `@@extensions ||= {}`.
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_class_variable_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_call_or_write_node(&mut self, node: &ruby_prism::CallOrWriteNode<'pr>) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_call_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_call_and_write_node(&mut self, node: &ruby_prism::CallAndWriteNode<'pr>) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "and",
            location.start_offset(),
            location.end_offset(),
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_call_and_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_index_or_write_node(&mut self, node: &ruby_prism::IndexOrWriteNode<'pr>) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_index_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_index_and_write_node(&mut self, node: &ruby_prism::IndexAndWriteNode<'pr>) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "and",
            location.start_offset(),
            location.end_offset(),
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_index_and_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_constant_or_write_node(&mut self, node: &ruby_prism::ConstantOrWriteNode<'pr>) {
        let location = node.location();
        let value = node.value();
        self.op_assign(
            "or",
            location.start_offset(),
            location.end_offset(),
            None,
            &value,
        );
        self.depth += 1;
        ruby_prism::visit_constant_or_write_node(self, node);
        self.depth -= 1;
    }

    fn visit_def_node(&mut self, node: &DefNode<'pr>) {
        self.def_node(node);
        self.depth += 1;
        ruby_prism::visit_def_node(self, node);
        self.depth -= 1;
    }

    fn visit_begin_node(&mut self, node: &BeginNode<'pr>) {
        // Explicit `begin ... end`. Method and block bodies reach `begin_node`
        // through their hosts, which know the closing keyword; the branch id
        // dedupes the second visit.
        if node.begin_keyword_loc().is_some() {
            self.begin_node(node, None);
        }
        self.depth += 1;
        ruby_prism::visit_begin_node(self, node);
        self.depth -= 1;
    }

    fn visit_block_node(&mut self, node: &ruby_prism::BlockNode<'pr>) {
        if let Some(body) = node.body()
            && let Some(begin) = body.as_begin_node()
        {
            self.begin_node(&begin, Some(node.closing_loc().start_offset()));
        }
        self.depth += 1;
        ruby_prism::visit_block_node(self, node);
        self.depth -= 1;
    }

    fn visit_lambda_node(&mut self, node: &ruby_prism::LambdaNode<'pr>) {
        if let Some(body) = node.body()
            && let Some(begin) = body.as_begin_node()
        {
            self.begin_node(&begin, Some(node.closing_loc().start_offset()));
        }
        self.depth += 1;
        ruby_prism::visit_lambda_node(self, node);
        self.depth -= 1;
    }

    fn visit_rescue_modifier_node(&mut self, node: &RescueModifierNode<'pr>) {
        self.rescue_modifier(node);
        self.depth += 1;
        ruby_prism::visit_rescue_modifier_node(self, node);
        self.depth -= 1;
    }
}

/// Build the complete obligation manifest and probe plan for one Ruby file.
/// `next_probe` numbers probes uniquely across the whole project.
pub fn build_ruby_obligations(
    file: &str,
    source: &[u8],
    next_probe: &mut u64,
) -> Result<RubyFileObligations, RubyInstrumenterError> {
    let result = ruby_prism::parse(source);
    let errors = result
        .errors()
        .map(|error| error.message().to_owned())
        .collect::<Vec<_>>();
    if !errors.is_empty() {
        return Err(RubyInstrumenterError::Parse(errors.join("; ")));
    }
    let mut collector = Collector::new(file, source, next_probe);
    collector.visit(&result.node());
    if let Some(error) = collector.error.take() {
        return Err(error);
    }
    Ok(collector.finish())
}

/// Apply a plan's edits to the original source the way the runtime does.
pub fn apply_edits(source: &[u8], edits: &[Edit]) -> Vec<u8> {
    let mut output =
        Vec::with_capacity(source.len() + edits.iter().map(|e| e.text.len()).sum::<usize>());
    let mut cursor = 0;
    for edit in edits {
        output.extend_from_slice(&source[cursor..edit.offset]);
        output.extend_from_slice(edit.text.as_bytes());
        cursor = edit.offset;
    }
    output.extend_from_slice(&source[cursor..]);
    output
}

#[cfg(test)]
mod tests {
    use super::*;

    const SOURCE: &str = r#"class Shapes
  def classify(a, b, c)
    if a && (b || c)
      :yes
    elsif a
      :half
    else
      :no
    end
  end

  def loops(items, flag)
    total = 0
    items.each { |i| total += i if i > 2 && flag }
    while total > 100
      total -= 50
    end
    for x in items do total += x end
    total
  end

  def logical(a, b)
    x = a || b
    @cache ||= {}
    @cache[a] ||= b
    y = a ? 1 : 2; z = a&.size
    [x, y, z]
  end

  def guarded(s)
    Integer(s)
  rescue ArgumentError
    -1
  ensure
    @done = true
  end

  def cases(v)
    case v
    when 0 then :zero
    else :other
    end
    v.to_s rescue "bad"
  end
end
"#;

    #[test]
    fn discovers_obligations_with_stable_ids_and_newline_free_edits() {
        let mut probe = 0;
        let first = build_ruby_obligations("lib/shapes.rb", SOURCE.as_bytes(), &mut probe).unwrap();
        let mut probe = 0;
        let second =
            build_ruby_obligations("lib/shapes.rb", SOURCE.as_bytes(), &mut probe).unwrap();
        assert_eq!(first, second);
        let manifest = &first.manifest;
        let functions = manifest
            .points
            .iter()
            .filter(|point| point.kind == PointKind::Function)
            .map(|point| point.label.clone().unwrap())
            .collect::<Vec<_>>();
        assert_eq!(
            functions,
            ["classify", "loops", "logical", "guarded", "cases"]
        );
        let compound = manifest
            .decisions
            .iter()
            .find(|decision| decision.source == "a && (b || c)")
            .unwrap();
        assert_eq!(compound.conditions, ["a", "b", "c"]);
        assert_eq!(compound.kind, "if");
        assert!(
            manifest
                .decisions
                .iter()
                .any(|d| d.kind == "elsif" && d.conditions == ["a"])
        );
        assert!(manifest.decisions.iter().any(|d| d.kind == "ternary"));
        assert!(manifest.decisions.iter().any(|d| d.kind == "while"));
        for kind in [
            "for",
            "logical-or",
            "or-assign",
            "safe-navigation",
            "begin",
            "rescue-0",
            "case-when-0",
            "case-else",
            "rescue-modifier",
        ] {
            assert!(
                manifest.branches.iter().any(|branch| branch.kind == kind),
                "missing branch kind {kind}"
            );
        }
        for edit in &first.plan.edits {
            assert!(!edit.text.contains('\n'));
        }
        assert!(
            first
                .plan
                .edits
                .windows(2)
                .all(|pair| pair[0].offset <= pair[1].offset)
        );
        // `@cache[a] ||= b` is measured through arrival and right-side
        // probes; nothing is unmeasured.
        assert!(manifest.unmeasured.is_empty());
        assert!(manifest.limitations.is_empty());
    }

    #[test]
    fn transformed_source_keeps_line_count_and_carries_probes() {
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/shapes.rb", SOURCE.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(SOURCE.as_bytes(), &obligations.plan.edits)).unwrap();
        assert_eq!(transformed.lines().count(), SOURCE.lines().count());
        assert!(
            transformed.contains("if $__supercov.d(0, ($__supercov.c(0, 0, (a)) && ($__supercov.c(0, 1, (b)) || $__supercov.c(0, 2, (c)))))"),
            "{transformed}"
        );
        assert!(transformed.contains("while $__supercov.w("));
        assert!(transformed.contains("for x in $__supercov.f("));
        assert!(transformed.contains("do $__supercov.fb("));
        assert!(transformed.contains("x = $__supercov.l("));
        assert!(transformed.contains("($__supercov.pre("));
        assert!(transformed.contains("||= ($__supercov.es("));
        assert!(transformed.contains("rescue Exception => __supercov_e; $__supercov.p("));
        assert!(transformed.contains("$__supercov.h("));
        assert!(transformed.contains("$__supercov.ok("));
        assert!(transformed.contains("rescue $__supercov.hm("));
        // The second statement on the `y = ...; z = ...` line gets a probe.
        assert!(transformed.contains("; $__supercov.s("));
        // Same-offset modifier bodies are proven by the stdlib branch key.
        assert!(
            obligations
                .plan
                .branches
                .iter()
                .any(|branch| !branch.hits.is_empty() && branch.key.group == "if")
        );
    }

    #[test]
    fn jumps_and_endless_bodies_take_wrapped_probes_and_literal_predicates_fold() {
        let source = "def inc(x) = x + 1\n\
                      [1].each { |v| y = Integer(v) rescue next }\n\
                      if false\n  dead\nelse\n  live\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/x.rb", source.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(source.as_bytes(), &obligations.plan.edits)).unwrap();
        assert!(
            transformed.contains("def inc(x) = ($__supercov.s("),
            "{transformed}"
        );
        assert!(
            transformed.contains("rescue ($__supercov.hm0("),
            "{transformed}"
        );
        // `if false` has no branch and its dead arm no statements.
        assert!(
            obligations
                .plan
                .branches
                .iter()
                .all(|branch| branch.key.group != "if")
        );
        assert!(
            obligations
                .manifest
                .points
                .iter()
                .all(|point| point.source != "dead")
        );
        assert!(
            obligations
                .manifest
                .points
                .iter()
                .any(|point| point.source == "live")
        );
    }

    #[test]
    fn void_valued_last_statements_are_probed_arm_by_arm() {
        // Wrapping `if ... return ... else return ... end` in a value context
        // is a syntax error; each arm carries the completion probe instead.
        let source =
            "def m(c)\n  if c\n    return 1\n  else\n    return 2\n  end\nrescue\n  nil\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/v.rb", source.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(source.as_bytes(), &obligations.plan.edits)).unwrap();
        assert_eq!(
            transformed.matches("$__supercov.ok(").count(),
            2,
            "{transformed}"
        );
        assert!(
            transformed.contains("return $__supercov.ok("),
            "{transformed}"
        );
        assert!(
            !obligations
                .manifest
                .unmeasured
                .iter()
                .any(|id| id.ends_with(":success")),
            "{:?}",
            obligations.manifest.unmeasured
        );
        assert!(!obligations.plan.probe_obligations.is_empty());
    }

    #[test]
    fn expressions_that_can_return_are_never_wrapped() {
        // `ok(k, (if a then return b end))` passes an expression that can jump
        // as an argument, which makes Ruby's compiler miscount its stack.
        let source = "def m(a, d)\n  begin\n    if a\n      return d\n    end\n  ensure\n    unlock\n  end\n  d\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/e.rb", source.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(source.as_bytes(), &obligations.plan.edits)).unwrap();
        assert!(!transformed.contains("$__supercov.ok"), "{transformed}");
        assert!(
            obligations
                .manifest
                .unmeasured
                .iter()
                .any(|id| id.ends_with(":success")),
            "the begin's completion is declared instead"
        );
        // With both arms present the arms carry the probe and nothing is lost.
        let both = "def m(a, d)\n  begin\n    if a\n      return d\n    else\n      d + 1\n    end\n  ensure\n    unlock\n  end\nend\n";
        let mut probe = 0;
        let obligations = build_ruby_obligations("lib/f.rb", both.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(both.as_bytes(), &obligations.plan.edits)).unwrap();
        assert!(
            transformed.contains("return $__supercov.ok("),
            "{transformed}"
        );
        assert!(
            !obligations
                .manifest
                .unmeasured
                .iter()
                .any(|id| id.ends_with(":success")),
            "{:?}",
            obligations.manifest.unmeasured
        );
    }

    #[test]
    fn stdlib_keys_shift_with_insertions_on_their_line() {
        let source = "def f(a, b)\n  x = 1 if a && b\nend\n";
        let mut probe = 0;
        let obligations = build_ruby_obligations("m.rb", source.as_bytes(), &mut probe).unwrap();
        let then_key = obligations
            .plan
            .branches
            .iter()
            .find(|branch| branch.key.branch == "then")
            .unwrap();
        // `x = 1` starts at column 2 and nothing is inserted before it.
        assert_eq!(then_key.key.span.start, [2, 2]);
        // Its end (column 7) is untouched too: insertions land in the
        // predicate, which comes after the body on this line.
        assert_eq!(then_key.key.span.end, [2, 7]);
        let else_key = obligations
            .plan
            .branches
            .iter()
            .find(|branch| branch.key.branch == "else")
            .unwrap();
        // The implicit else uses the whole if node, whose end moves right by
        // every inserted byte on that line.
        let inserted: usize = obligations
            .plan
            .edits
            .iter()
            .map(|edit| edit.text.len())
            .sum();
        assert_eq!(else_key.key.span.end, [2, 17 + inserted]);
        assert!(
            then_key.hits.len() == 1,
            "modifier body statement proven by the then key"
        );
    }

    #[test]
    fn line_events_prove_bodies_and_probes_prove_the_rest() {
        // Ruby 3.4+ reads no branch or method keys. A body's first statement
        // implies the branch, the method and the decision outcome; an `if`
        // without `else`, a `&.` and a `case` without `else` are probed; the
        // ids Ruby 3.3 still proves through its keys are not declared as
        // probe-only.
        let source = "def both(a)\n  if a\n    1\n  else\n    2\n  end\nend\n\ndef guard(a)\n  return 0 if a\n  a&.size\nend\n\ndef pick(v)\n  case v\n  when 1 then :one\n  when 2\n    :two\n  end\nend\n\ndef short = 3\n\ndef empty; end\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/m.rb", source.as_bytes(), &mut probe).unwrap();
        let plan = &obligations.plan;
        let manifest = &obligations.manifest;
        let function = |name: &str| {
            manifest
                .points
                .iter()
                .find(|point| {
                    point.kind == PointKind::Function && point.label.as_deref() == Some(name)
                })
                .unwrap()
                .id
                .clone()
        };
        let statement_on = |line: usize| plan.lines.get(&line).cloned().unwrap();
        let transformed = String::from_utf8(apply_edits(source.as_bytes(), &plan.edits)).unwrap();
        assert_eq!(transformed.lines().count(), source.lines().count());

        // `if a ... else ... end`: line 3 proves `both` and the true outcome,
        // line 5 the false outcome; no predicate probe.
        assert_eq!(
            plan.implied[&statement_on(2)].hits,
            [function("both")],
            "the `if` statement opens the method"
        );
        let three = &plan.implied[&statement_on(3)];
        assert!(three.hits.is_empty());
        assert_eq!(three.decisions.len(), 1);
        assert!(three.decisions[0].value);
        let five = &plan.implied[&statement_on(5)];
        assert!(!five.decisions[0].value);
        assert!(!transformed.contains(".d(") || transformed.matches(".d(").count() == 1);

        // `return 0 if a`: the predicate is probed (one `d`, no `c`), and the
        // body is implied by the true outcome, not by its line.
        let guard_decision = manifest
            .decisions
            .iter()
            .find(|d| d.kind == "if" && d.conditions == ["a"] && d.line == 10)
            .unwrap();
        let outcome_true = format!("{}:outcome:true", guard_decision.id);
        assert!(
            plan.implied.contains_key(&outcome_true),
            "modifier body implied by its outcome"
        );
        assert!(transformed.contains("return 0 if $__supercov.d("));
        assert!(
            !transformed.contains(".c("),
            "a lone condition needs no wrapper"
        );
        // `a&.size`: the receiver is probed.
        assert!(transformed.contains("$__supercov.n("));
        // `case` without `else` gets an else of its own; the one-line `when`
        // body is a probed statement.
        assert!(transformed.contains("else $__supercov.hs("));
        assert!(transformed.contains("when 1 then $__supercov.s("));
        // Endless and empty methods.
        assert!(transformed.contains("def short = ($__supercov.s("));
        assert!(transformed.contains("def empty; $__supercov.hs("));
        let empty_probe = plan
            .edits
            .iter()
            .find(|edit| edit.text.contains(".hs(") && edit.text.starts_with("; "))
            .unwrap();
        assert!(empty_probe.text.contains("hs"));
        // Everything 3.3 proves through keys stays out of the 3.3 declaration:
        // the modifier body statement, the guard decision, the `&.` branch,
        // the case alternatives and the methods.
        for id in [
            guard_decision.id.clone(),
            function("empty"),
            function("short"),
        ] {
            assert!(
                !plan.probe_obligations.contains(&id),
                "{id} is key-provable on 3.3"
            );
        }
        let safe = manifest
            .branches
            .iter()
            .find(|b| b.kind == "safe-navigation")
            .unwrap();
        assert!(!plan.probe_obligations.contains(&safe.id));
    }

    #[test]
    fn ractor_blocks_get_no_probes_and_declare_what_only_probes_could_prove() {
        // A probe inside a Ractor reads a global the Ractor cannot see and
        // raises where the untouched program ran. Nothing is inserted inside
        // the block; the same shapes outside it are probed as ever.
        let source = "def inside(a)\n  Ractor.new(a) { |v| v ? 1 : 2 }.take\nend\n\ndef outside(a)\n  a ? 1 : 2\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/r.rb", source.as_bytes(), &mut probe).unwrap();
        let plan = &obligations.plan;
        let manifest = &obligations.manifest;
        let transformed = String::from_utf8(apply_edits(source.as_bytes(), &plan.edits)).unwrap();
        let block_line = transformed.lines().nth(1).unwrap();
        assert!(
            !block_line.contains("$__supercov"),
            "no probe inside the Ractor block: {block_line}"
        );
        assert!(
            transformed
                .lines()
                .nth(5)
                .unwrap()
                .contains("$__supercov.d("),
            "the ternary outside is probed"
        );
        let inside = manifest.decisions.iter().find(|d| d.line == 2).unwrap();
        assert!(
            manifest.unmeasured.contains(&inside.id),
            "the block's ternary leaves the denominator"
        );
        let outside = manifest.decisions.iter().find(|d| d.line == 6).unwrap();
        assert!(!manifest.unmeasured.contains(&outside.id));
        assert_eq!(plan.ractor_blocks.len(), 1);
        assert!(
            manifest
                .limitations
                .iter()
                .any(|l| l["id"] == RACTOR_BLOCK_LIMITATION && l["line"] == 2)
        );
        // Dropped probes are not in the plan either, so 3.3 declares nothing for them.
        assert!(!plan.probe_obligations.contains(&inside.id));
    }

    #[test]
    fn an_empty_guarded_in_body_takes_its_probe_after_the_guard_wrapper() {
        // net-imap: `in Array if data.all? { ... }` with no body. The guard's
        // decision wrapper closes exactly where the body would start; the
        // body probe must come after it. Found by the corpus sweep.
        let source = "def f(data)\n  case data\n  in String then data = 1\n  in Array if data.all? { _1 > 0 }\n  else\n    raise TypeError\n  end\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/g.rb", source.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(source.as_bytes(), &obligations.plan.edits)).unwrap();
        let guard_line = transformed.lines().nth(3).unwrap();
        assert!(
            guard_line.contains(")) then $__supercov.hs("),
            "probe after the wrapper: {guard_line}"
        );
        assert!(
            !guard_line.contains("then $__supercov.hs(")
                || !guard_line.contains("hs(")
                || guard_line.matches(')').count() == guard_line.matches('(').count(),
            "balanced: {guard_line}"
        );
    }

    #[test]
    fn a_class_variable_or_assignment_is_never_read_before_it_exists() {
        let source = "class C\n  def self.ext\n    @@ext ||= {}\n  end\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/c.rb", source.as_bytes(), &mut probe).unwrap();
        let transformed =
            String::from_utf8(apply_edits(source.as_bytes(), &obligations.plan.edits)).unwrap();
        let line = transformed.lines().nth(2).unwrap();
        assert!(
            !line.contains(".l("),
            "no read of @@ext before the assignment: {line}"
        );
        assert!(
            line.contains(".pre(") && line.contains(".es("),
            "arrival form: {line}"
        );
    }

    #[test]
    fn a_predicate_ruby_folds_leaves_no_obligations_in_the_dead_arm() {
        // optparse: `if Process.respond_to?(:fork) and false` -- Ruby never
        // compiles the then arm and reports no branch for the ternary inside
        // it, so neither is an obligation; the live operand still runs.
        let source = "def f(x)\n  if x and false\n    x ? 1 : 2\n  end\n  if x or true\n    3\n  else\n    4\n  end\nend\n";
        let mut probe = 0;
        let obligations =
            build_ruby_obligations("lib/f.rb", source.as_bytes(), &mut probe).unwrap();
        let manifest = &obligations.manifest;
        assert!(
            !manifest.decisions.iter().any(|d| d.kind == "ternary"),
            "the dead arm's ternary is not an obligation"
        );
        assert!(
            !manifest.decisions.iter().any(|d| d.kind == "if"),
            "a folded predicate is no decision"
        );
        assert!(
            !manifest.points.iter().any(|p| p.line == 8),
            "the dead else arm holds no statement"
        );
        assert!(
            manifest.points.iter().any(|p| p.line == 6),
            "the live arm does"
        );
    }

    #[test]
    fn rejects_invalid_ruby() {
        let mut probe = 0;
        assert!(matches!(
            build_ruby_obligations("m.rb", b"def x(\n", &mut probe),
            Err(RubyInstrumenterError::Parse(_))
        ));
    }
}
