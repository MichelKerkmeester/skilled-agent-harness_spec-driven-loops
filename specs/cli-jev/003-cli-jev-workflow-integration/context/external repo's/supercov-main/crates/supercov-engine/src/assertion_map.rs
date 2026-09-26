//! Agent-authored assertion maps. Edges are explanations, never inferred proofs.
//! This module owns format validation, text relocation and input acknowledgement bookkeeping.

use crate::source_units::{Code, Diff, named};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};

pub type Files = BTreeMap<String, String>;
pub fn digest(value: &impl Serialize) -> String {
    format!(
        "{:x}",
        Sha256::digest(serde_json::to_vec(value).expect("serializable map"))
    )
}
fn version() -> u32 {
    1
}

/// One-based lines and UTF-8 byte columns, for every language. Text is exact.
#[derive(
    Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, schemars::JsonSchema,
)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Anchor {
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub text: String,
}

pub fn local_path(file: &str) -> bool {
    !file.is_empty()
        && !file.contains(['\\', ':'])
        && file.split('/').all(|p| !matches!(p, "" | "." | ".."))
}
impl Anchor {
    pub fn new(file: &str, source: &str, start: usize, end: usize) -> Self {
        Self {
            file: file.into(),
            line: source[..start].bytes().filter(|b| *b == b'\n').count() + 1,
            column: start - source[..start].rfind('\n').map_or(0, |n| n + 1) + 1,
            text: source[start..end].into(),
        }
    }
    pub fn offset(&self, files: &Files) -> Option<usize> {
        let source = files.get(&self.file)?;
        self.offset_in(source, &line_starts(source))
    }

    /// `offset`, given where each line of the anchor's file starts. A caller
    /// locating many anchors computes those starts once per file: scanning
    /// from the top of the file for every anchor made an assessment quadratic
    /// in file length, and a fifth of `runs latest` on a 300-file run was
    /// spent here.
    pub fn offset_in(&self, source: &str, starts: &[usize]) -> Option<usize> {
        locate(
            &self.file,
            self.line,
            self.column,
            &self.text,
            source,
            starts,
        )
    }
}

/// Where an anchor with these parts starts in `source`, without building one.
/// Counting the statements that cannot be located needs only this answer, and
/// building an anchor clones the source text of the node around the statement
/// -- once per statement, which is the allocation a summary exists to avoid.
pub fn locate(
    file: &str,
    line: usize,
    column: usize,
    text: &str,
    source: &str,
    starts: &[usize],
) -> Option<usize> {
    if !local_path(file) || text.is_empty() || line == 0 || column == 0 {
        return None;
    }
    // A line the file does not reach has no start; this is the check the scan
    // used to make by counting the line feeds before it.
    let start = *starts.get(line - 1)?;
    let row = source.get(start..)?.split('\n').next()?;
    if column - 1 > row.len() {
        return None;
    }
    let pos = start.checked_add(column - 1)?;
    source.get(pos..)?.starts_with(text).then_some(pos)
}

/// The byte offset at which each line of `source` starts: 0, then one past
/// every line feed.
pub fn line_starts(source: &str) -> Vec<usize> {
    std::iter::once(0)
        .chain(source.match_indices('\n').map(|(at, _)| at + 1))
        .collect()
}

/// The text of 1-based `line`, exactly as `str::lines` would yield it: without
/// its line ending, with a carriage return stripped only where a line feed
/// follows it, and with no empty line after a final line feed.
pub fn line_text<'s>(source: &'s str, starts: &[usize], line: usize) -> Option<&'s str> {
    let start = *starts.get(line.checked_sub(1)?)?;
    if start >= source.len() {
        return None;
    }
    match starts.get(line) {
        Some(next) => {
            let text = &source[start..next - 1];
            Some(text.strip_suffix('\r').unwrap_or(text))
        }
        None => Some(&source[start..]),
    }
}

/// Line starts for every file of a source set, computed once.
pub struct LineIndex<'a> {
    starts: BTreeMap<&'a str, (&'a str, Vec<usize>)>,
}

impl<'a> LineIndex<'a> {
    pub fn new(files: &'a Files) -> Self {
        Self {
            starts: files
                .iter()
                .map(|(file, source)| (file.as_str(), (source.as_str(), line_starts(source))))
                .collect(),
        }
    }

    /// A file's source and the start of each of its lines.
    pub fn get(&self, file: &str) -> Option<(&'a str, &[usize])> {
        self.starts
            .get(file)
            .map(|(source, starts)| (*source, starts.as_slice()))
    }

    /// The same answer as `Anchor::offset`, without rescanning the file.
    pub fn offset(&self, anchor: &Anchor) -> Option<usize> {
        let (source, starts) = self.get(&anchor.file)?;
        anchor.offset_in(source, starts)
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct InventorySite {
    pub at: Anchor,
    pub operation: String,
}

/// Source text held in memory for capture or a verified current-checkout query.
/// The serialized form is retained only for reading legacy source archives.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Inputs {
    #[serde(default = "version")]
    pub schema_version: u32,
    pub language: String,
    pub context_digest: String,
    pub files: Files,
    pub assertions: Vec<InventorySite>,
    pub limitations: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FileFingerprint {
    pub sha256: String,
    pub bytes: usize,
    /// The parser's view of the file: what it declares, each declaration
    /// digested with comments blanked. Absent for a file no parser reads and
    /// in manifests written before this existed; such a file is compared by
    /// its bytes, as every file once was.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<Code>,
}
impl FileFingerprint {
    pub fn of(source: &str) -> Self {
        Self {
            sha256: format!("{:x}", Sha256::digest(source.as_bytes())),
            bytes: source.len(),
            code: None,
        }
    }
    /// Bytes and, where Supercov has a parser for the file, its declarations.
    pub fn read(path: &str, source: &str) -> Self {
        let mut fingerprint = Self::of(source);
        fingerprint.code = crate::source_units::code(path, source);
        fingerprint
    }
    pub fn same_bytes(&self, other: &Self) -> bool {
        self.sha256 == other.sha256
    }
}
pub type FileManifest = BTreeMap<String, FileFingerprint>;

/// The run stores identities and hashes, never complete source files.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct InputManifest {
    pub schema_version: u32,
    pub language: String,
    pub context_digest: String,
    pub files: FileManifest,
    pub assertions: Vec<InventorySite>,
    pub limitations: Vec<String>,
}
impl Inputs {
    pub fn manifest(&self) -> InputManifest {
        InputManifest {
            schema_version: 2,
            language: self.language.clone(),
            context_digest: self.context_digest.clone(),
            files: self
                .files
                .iter()
                .map(|(p, s)| (p.clone(), FileFingerprint::read(p, s)))
                .collect(),
            assertions: self.assertions.clone(),
            limitations: self.limitations.clone(),
        }
    }
    pub fn identity(&self) -> String {
        digest(&self.manifest())
    }
}
impl InputManifest {
    pub fn with_sources(&self, files: Files) -> Inputs {
        Inputs {
            schema_version: 1,
            language: self.language.clone(),
            context_digest: self.context_digest.clone(),
            files,
            assertions: self.assertions.clone(),
            limitations: self.limitations.clone(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Node {
    pub id: String,
    pub at: Anchor,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub role: String,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub meaning: String,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Edge {
    pub from: String,
    pub to: String,
    pub kind: String,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub basis: String,
}
#[derive(
    Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, schemars::JsonSchema,
)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TestSelector {
    pub file: String,
    pub name: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Flow {
    pub id: String,
    #[serde(deserialize_with = "required_basis")]
    #[schemars(required, schema_with = "basis_schema")]
    pub basis: Option<String>,
    pub explanation: String,
    pub applies_to: Vec<TestSelector>,
    pub nodes: Vec<Node>,
    #[serde(default)]
    pub edges: Vec<Edge>,
    pub counts_as_asserted: Vec<String>,
    pub watch: Vec<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub questions: Vec<String>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Assertion {
    pub id: String,
    pub at: Anchor,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub questions: Vec<String>,
    #[serde(default)]
    pub observes: Vec<String>,
    #[serde(default)]
    pub flows: Vec<Flow>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Retired {
    pub assertion: Assertion,
    pub reason: String,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AssertionMap {
    #[schemars(range(min = 2, max = 2))]
    pub schema_version: u32,
    pub assertions: Vec<Assertion>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub change_assessments: Vec<ChangeAssessment>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub retired_assertions: Vec<Retired>,
}

// Missing basis is a syntax error; null explicitly means unfinished work.
fn required_basis<'de, D: serde::Deserializer<'de>>(d: D) -> Result<Option<String>, D::Error> {
    let value = Option::<String>::deserialize(d)?;
    if value.as_deref().is_some_and(|s| !valid_basis(s)) {
        return Err(serde::de::Error::custom(
            "expected null or scov<format>:<64 lowercase hex digits>",
        ));
    }
    Ok(value)
}
fn basis_schema(_: &mut schemars::SchemaGenerator) -> schemars::Schema {
    schemars::json_schema!({"type":["string","null"],"pattern":"^scov[0-9]+:[0-9a-f]{64}$"})
}
/// The format of an acknowledgement token: what goes into its digest.
///
/// Raise it whenever that changes -- the parts of a claim the token covers,
/// or how a declaration is digested -- because every acknowledged flow then
/// reads as needing acknowledgement, and with the format raised it says why.
/// Without it, 0.0.51 to 0.0.53 left 604 of supergateway's 721 flows stale
/// with nothing changed and nothing said. The tests that pin a token and the
/// declaration digests fail when the format should rise.
pub const BASIS_FORMAT: u32 = 3;
fn basis_format(s: &str) -> Option<u32> {
    let (format, hash) = s.strip_prefix("scov")?.split_once(':')?;
    let format = format.parse::<u32>().ok()?;
    (hash.len() == 64
        && hash
            .bytes()
            .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b)))
    .then_some(format)
}
fn valid_basis(s: &str) -> bool {
    basis_format(s).is_some_and(|format| (2..=BASIS_FORMAT).contains(&format))
}
/// A token from a release whose format was different. It still parses, so the
/// map stays valid; it can no longer match, so the claim reads as needing
/// acknowledgement, with this as its reason rather than a change that never
/// happened.
pub fn superseded_basis(s: &str) -> bool {
    basis_format(s).is_some_and(|format| format < BASIS_FORMAT)
}
pub const SUPERSEDED_BASIS: &str = "acknowledged under an earlier Supercov basis format; reread the claim and copy the current expectedBasis";
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ChangeAssessment {
    pub id: String,
    #[serde(deserialize_with = "required_basis")]
    #[schemars(required, schema_with = "basis_schema")]
    pub basis: Option<String>,
    pub affected_flows: Vec<String>,
    pub explanation: String,
}

/// Editor schema generated from the same Rust types used by every map command.
/// Source existence, links, freshness and semantic meaning are outside JSON Schema.
pub fn schema() -> serde_json::Value {
    serde_json::to_value(schemars::schema_for!(AssertionMap)).expect("schema")
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseError {
    pub pointer: String,
    pub line: usize,
    pub column: usize,
    pub message: String,
}
impl std::fmt::Display for ParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{} at {} (JSON line {}, column {})",
            self.message, self.pointer, self.line, self.column
        )
    }
}
pub fn parse(bytes: &[u8]) -> Result<AssertionMap, ParseError> {
    let mut deserializer = serde_json::Deserializer::from_slice(bytes);
    let map: AssertionMap = serde_path_to_error::deserialize(&mut deserializer).map_err(|e| {
        let pointer = e
            .path()
            .iter()
            .map(|segment| {
                use serde_path_to_error::Segment;
                let part = match segment {
                    Segment::Seq { index } => index.to_string(),
                    Segment::Map { key } => key.clone(),
                    Segment::Enum { variant } => variant.clone(),
                    Segment::Unknown => "?".into(),
                };
                format!("/{}", part.replace('~', "~0").replace('/', "~1"))
            })
            .collect();
        ParseError {
            pointer,
            line: e.inner().line(),
            column: e.inner().column(),
            message: e.inner().to_string(),
        }
    })?;
    deserializer.end().map_err(|e| ParseError {
        pointer: String::new(),
        line: e.line(),
        column: e.column(),
        message: e.to_string(),
    })?;
    if map.schema_version != 2 {
        return Err(ParseError {
            pointer: "/schemaVersion".into(),
            line: 0,
            column: 0,
            message: "unsupported map schema version; expected 2".into(),
        });
    }
    Ok(map)
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FlowState {
    pub generation: String,
    pub reasons: BTreeSet<String>,
    /// Changes near this flow that could not have reached it: a file it
    /// depends on changed only in code its test never ran. Told, not asked.
    #[serde(default, skip_serializing_if = "BTreeSet::is_empty")]
    pub notices: BTreeSet<String>,
    /// What the flow rested on when this state was written, part by part.
    ///
    /// `basis` is one hash of everything, so a mismatch can say that
    /// *something* moved and no more. Recording the parts separately lets a
    /// later mismatch name the one that moved -- an author who deleted a watch
    /// entry and one who rewrote an explanation were given the same sentence.
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub footprint: BTreeMap<String, String>,
}
/// What each test of a run executed, in the units of that run's manifest.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Executions {
    pub tests: Vec<Execution>,
    /// Per file, the units that hold a probe of their own. A change confined
    /// to these can reach a test only by being run.
    pub probed: BTreeMap<String, Vec<usize>>,
    /// Per file, the units the run actually reached -- every record's, the one
    /// holding execution no test could be credited with included.
    ///
    /// This is the bound on a test whose own reach nothing recorded. It cannot
    /// have run more than the run did, so a change outside this reached no
    /// test at all and a change inside it might have reached any of them.
    /// Without it the only sound answer for such a test would be "affected by
    /// everything", which is true and useless.
    #[serde(default)]
    pub covered: BTreeMap<String, Vec<usize>>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Execution {
    pub test: TestSelector,
    pub passed: bool,
    /// Per file, the innermost unit of every probe this test fired.
    pub files: BTreeMap<String, Vec<usize>>,
    /// How completely `files` describes what this test ran: `exact`, `partial`
    /// where it is a lower bound, or `run-wide` where nothing was recorded.
    ///
    /// Only under `exact` does an absence here mean the test did not run the
    /// code. A Go test that called `t.Parallel()` records nothing of its own,
    /// and a Ruby test records only the lines no earlier test had reached --
    /// so reading either silence as proof is how a change to code a test
    /// exercised comes back as "this test is unaffected".
    #[serde(default = "exact_by_default")]
    pub attribution: String,
}

/// Every execution recorded before attribution was a question was an exact
/// one, so a record that does not say is one.
fn exact_by_default() -> String {
    crate::coverage_report::ATTRIBUTION_EXACT.to_owned()
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Change {
    pub id: String,
    pub file: Option<String>,
    pub before: Option<String>,
    pub after: Option<String>,
    pub reason: String,
    /// Flows this change has already made stale. An assessment has to name
    /// them; it may name more.
    pub known_flows: BTreeSet<String>,
    /// Flows whose selected tests ran the changed code, or have no execution
    /// record to say. Not stale for it -- the claim they make does not pass
    /// through that code -- but these are the ones the assessment is about.
    #[serde(default, skip_serializing_if = "BTreeSet::is_empty")]
    pub exposed: BTreeSet<String>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct State {
    pub schema_version: u32,
    pub inputs_digest: String,
    pub evidence_digest: String,
    pub flows: BTreeMap<String, FlowState>,
    pub changes: Vec<Change>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inheritance: Option<Inheritance>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub executions: Option<Executions>,
}
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Inheritance {
    pub from: Option<String>,
    pub skipped: Vec<SkippedMap>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, schemars::JsonSchema)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SkippedMap {
    pub run: String,
    pub reason: String,
}
pub fn flow_key(a: &Assertion, f: &Flow) -> String {
    format!("{}/{}", a.id, f.id)
}
fn valid_id(id: &str) -> bool {
    !id.is_empty()
        && id
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'_' | b'-' | b'.'))
}

pub fn seed(inputs: &Inputs, evidence_digest: &str) -> (AssertionMap, State) {
    seed_manifest(&inputs.manifest(), evidence_digest)
}
pub fn seed_manifest(inputs: &InputManifest, evidence_digest: &str) -> (AssertionMap, State) {
    (
        AssertionMap {
            schema_version: 2,
            assertions: inputs
                .assertions
                .iter()
                .map(|site| Assertion {
                    id: format!("a_{}", &digest(&site.at)[..20]),
                    at: site.at.clone(),
                    questions: vec![],
                    observes: vec![],
                    flows: vec![],
                })
                .collect(),
            change_assessments: vec![],
            retired_assertions: vec![],
        },
        State {
            schema_version: 3,
            inputs_digest: digest(inputs),
            evidence_digest: evidence_digest.into(),
            flows: BTreeMap::new(),
            changes: vec![],
            inheritance: None,
            executions: None,
        },
    )
}

/// Structural checks only; malformed entries cannot silently earn credit.
pub fn validate(map: &AssertionMap, inputs: &Inputs) -> Vec<String> {
    let mut errors = Vec::new();
    let lines = LineIndex::new(&inputs.files);
    if map.schema_version != 2 || inputs.schema_version != 1 {
        errors.push("unsupported schema version".into());
    }
    let mut ids = BTreeSet::new();
    let mut sites = BTreeSet::new();
    for a in &map.assertions {
        if !valid_id(&a.id) || !ids.insert(&a.id) {
            errors.push(format!("{}: invalid/duplicate assertion ID", a.id));
        }
        if !sites.insert(&a.at) {
            errors.push(format!("{}: duplicate assertion location", a.id));
        }
        if lines.offset(&a.at).is_none() {
            errors.push(format!("{}: invalid assertion anchor", a.id));
        }
        // Agents can register custom assertions absent from the syntax inventory.
        // They still require exact run evidence to earn execution-backed credit.
        let mut flows = BTreeSet::new();
        for f in &a.flows {
            let key = flow_key(a, f);
            if !valid_id(&f.id) || !flows.insert(&f.id) {
                errors.push(format!("{key}: invalid/duplicate flow ID"));
            }
            errors.extend(
                validate_flow(f, &inputs.files)
                    .into_iter()
                    .map(|e| format!("{key}: {e}")),
            );
        }
    }
    let mut changes = BTreeSet::new();
    for change in &map.change_assessments {
        if !valid_id(&change.id) || !changes.insert(&change.id) {
            errors.push("invalid/duplicate change assessment ID".into());
        }
    }
    errors
}
/// Things worth telling the author that do not make the map wrong.
///
/// A redundant `watch` is the one that matters today. Supercov already marks
/// every flow dirty when a dependency manifest or the execution configuration
/// changes, so naming one of those files per flow catches nothing extra. It
/// does teach a false model -- that per-flow watching is how dependency drift
/// is caught -- and an author who believes it spends the effort on entries that
/// change nothing instead of on the helper their claim actually rests on.
pub fn advisories(map: &AssertionMap) -> Vec<String> {
    let mut out = Vec::new();
    for a in &map.assertions {
        for f in &a.flows {
            for file in &f.watch {
                let key = flow_key(a, f);
                if crate::integrity::globally_tracked(file) {
                    out.push(format!(
                        "{key}: watch \"{file}\" is redundant; Supercov invalidates every flow when that file changes"
                    ));
                    continue;
                }
                if a.at.file == *file || f.applies_to.iter().any(|t| t.file == *file) {
                    out.push(format!(
                        "{key}: watch \"{file}\" is redundant; this flow already depends on that file as a whole"
                    ));
                    continue;
                }
                // Not redundant -- it changes what the flow rests on, which is
                // the part an author cannot see. Naming a file that holds this
                // flow's nodes takes the file out of declaration-level footing
                // and puts the whole file back in, so a neighbouring function's
                // body becomes a review again. That can be exactly what the
                // author means -- "no other handler in here registers /admin"
                // is a claim about the file's shape -- so it is said, not
                // refused.
                let here = f
                    .nodes
                    .iter()
                    .filter(|n| n.at.file == *file)
                    .map(|n| format!("{}:{}", n.id, n.at.line))
                    .collect::<Vec<_>>();
                if !here.is_empty() {
                    out.push(format!(
                        "{key}: watch \"{file}\" widens this flow to the whole file; without it only the declarations holding its nodes ({}) and the file's set of declarations would count. Remove it unless a change anywhere in that file should be a review.",
                        here.join(", ")
                    ));
                }
            }
        }
    }
    out
}
pub fn validate_flow(flow: &Flow, files: &Files) -> Vec<String> {
    let mut errors = Vec::new();
    let mut nodes = BTreeSet::new();
    for node in &flow.nodes {
        if !valid_id(&node.id) || !nodes.insert(&node.id) {
            errors.push("invalid/duplicate node ID".into());
        }
        if node.at.offset(files).is_none() {
            errors.push(format!("node {}: invalid anchor", node.id));
        }
    }
    for edge in &flow.edges {
        if !nodes.contains(&edge.from) || (!nodes.contains(&edge.to) && edge.to != "$assertion") {
            errors.push("dangling edge".into());
        }
    }
    if flow.counts_as_asserted.iter().any(|id| !nodes.contains(id)) {
        errors.push("unknown counted node".into());
    }
    // Traverse only the author's graph. Never infer a dependency from source.
    let mut reaches = BTreeSet::from(["$assertion".to_owned()]);
    loop {
        let size = reaches.len();
        for edge in &flow.edges {
            if reaches.contains(&edge.to) {
                reaches.insert(edge.from.clone());
            }
        }
        if reaches.len() == size {
            break;
        }
    }
    for id in &flow.counts_as_asserted {
        if !reaches.contains(id) {
            errors.push(format!(
                "counted node {id} has no authored path to $assertion"
            ));
        }
    }
    if flow.edges.iter().any(|e| e.kind.trim().is_empty()) {
        errors.push("missing edge kind".into());
    }
    if flow
        .applies_to
        .iter()
        .any(|t| !local_path(&t.file) || !files.contains_key(&t.file) || t.name.trim().is_empty())
    {
        errors.push("invalid test selector file or name".into());
    }
    if flow.applies_to.iter().collect::<BTreeSet<_>>().len() != flow.applies_to.len() {
        errors.push("duplicate test selector".into());
    }
    if flow
        .counts_as_asserted
        .iter()
        .collect::<BTreeSet<_>>()
        .len()
        != flow.counts_as_asserted.len()
    {
        errors.push("duplicate counted node".into());
    }
    if flow.explanation.trim().is_empty() {
        errors.push("missing explanation".into());
    }
    for file in &flow.watch {
        if !local_path(file) {
            errors.push(format!("watched file is not a project path: {file}"));
        } else if !files.contains_key(file) {
            // A run captures what its inherited map watches, so a watch added
            // since this run was recorded is captured by the next one.
            errors.push(format!(
                "watched file missing: {file} is not among this run's inputs; if it exists, \
                 run the tests again, since a run captures every file its map watches"
            ));
        }
    }
    errors
}

/// The watch entries that are the flow's own.
///
/// A manifest, lockfile or runner configuration is tracked for the whole run,
/// so naming one here catches nothing -- `advisories()` tells the author so.
/// An entry that catches nothing must also cost nothing, in both directions:
/// it is not a dependency, and taking it back out is not a new claim. Those
/// are two different code paths -- `dependencies()` and `claim()` -- and when
/// only the first filtered, Supercov advised authors to delete an entry it
/// then charged a full re-acknowledgement for.
///
/// Only the watch list is filtered. An anchor or a node in one of those files
/// is the flow's actual subject -- `setup.py` is a dependency manifest and
/// measured source at once -- and editing it must still cost a review.
fn watched(f: &Flow) -> impl Iterator<Item = &str> {
    f.watch
        .iter()
        .map(String::as_str)
        .filter(|path| !crate::integrity::globally_tracked(path))
}
/// Whole-file input dependencies, not a mechanically inferred semantic slice.
pub fn dependencies<'a>(a: &'a Assertion, f: &'a Flow) -> BTreeSet<&'a str> {
    std::iter::once(a.at.file.as_str())
        .chain(f.applies_to.iter().map(|t| t.file.as_str()))
        .chain(f.nodes.iter().map(|n| n.at.file.as_str()))
        // Hashing a manifest's bytes here would quietly undo the manifest
        // rule: a version bump would make every flow that names
        // `package.json` stale, which is most of them in a real map. The
        // run-level signal still fires, as a change to assess.
        .chain(watched(f))
        .collect()
}
fn token(value: &impl Serialize) -> String {
    format!("scov{BASIS_FORMAT}:{}", digest(value))
}
fn flow_keys(map: &AssertionMap) -> BTreeSet<String> {
    map.assertions
        .iter()
        .flat_map(|a| a.flows.iter().map(move |f| flow_key(a, f)))
        .collect()
}
/// An assessment is the author's judgement, so it is validated against the
/// map it names flows in -- not against the change. The change no longer
/// determines any part of a well-formed response.
pub fn change_errors(map: &AssertionMap, response: &ChangeAssessment) -> Vec<String> {
    change_errors_with(&flow_keys(map), response)
}
fn change_errors_with(keys: &BTreeSet<String>, response: &ChangeAssessment) -> Vec<String> {
    let affected = response
        .affected_flows
        .iter()
        .cloned()
        .collect::<BTreeSet<_>>();
    let mut errors = Vec::new();
    if response.explanation.trim().is_empty() {
        errors.push("missing impact explanation".into());
    }
    if affected.len() != response.affected_flows.len() {
        errors.push("duplicate affected flow".into());
    }
    if !affected.is_subset(keys) {
        errors.push("unknown affected flow".into());
    }
    // `affectedFlows` is the author's judgement -- the dependents this change
    // actually invalidates -- not a restatement of `knownFlows`.
    //
    // Requiring the exhaustive set made the field carry no judgement at all: it
    // was fully determined by data Supercov already holds, and every flow it
    // named lost its acknowledgement. On a real map that meant one no-op
    // manifest edit took 657 flows to zero, so the only ways forward were to
    // copy 653 basis tokens for claims nobody had read, or leave the change
    // pending and keep no percentage. That is the rubber-stamping the whole
    // invalidation rule exists to prevent, one step further down.
    //
    // There is deliberately no floor -- not even "name everything whose test
    // ran the change". Under an integration suite every test runs everything,
    // so that floor is the same cascade wearing a different hat. Exposure is
    // reported so the author can judge; it does not judge for them.
    errors
}
pub fn expected_change_basis(
    change: &Change,
    response: &ChangeAssessment,
    inputs: &InputManifest,
) -> String {
    expected_change_basis_with(change, response, &digest(inputs))
}
fn expected_change_basis_with(
    change: &Change,
    response: &ChangeAssessment,
    inputs_digest: &str,
) -> String {
    token(&(
        "supercov-change-v2",
        change,
        inputs_digest,
        &response.id,
        &response.affected_flows,
        &response.explanation,
    ))
}
pub fn change_current(map: &AssertionMap, change: &Change, inputs: &InputManifest) -> bool {
    Ledger::with_changes(map, std::slice::from_ref(change), inputs).current(&change.id)
}
/// What every token of one run shares, computed once: the manifest's digest,
/// and each change whose assessment is current with the flows it names.
///
/// Computed per flow instead, this serialised the whole manifest once per
/// flow per pending change -- minutes on a real map with a backlog of
/// changes, on every carry and every report.
pub struct Ledger<'a> {
    pub inputs_digest: String,
    keys: BTreeSet<String>,
    /// Current assessments by change id: the basis the author recorded and
    /// the flows it names.
    current: BTreeMap<&'a str, (&'a Option<String>, &'a [String])>,
}
impl<'a> Ledger<'a> {
    pub fn new(map: &'a AssertionMap, state: &'a State, inputs: &InputManifest) -> Self {
        Self::with_changes(map, &state.changes, inputs)
    }
    fn with_changes(map: &'a AssertionMap, changes: &'a [Change], inputs: &InputManifest) -> Self {
        let inputs_digest = digest(inputs);
        let keys = flow_keys(map);
        let current = changes
            .iter()
            .filter_map(|change| {
                let responses = map
                    .change_assessments
                    .iter()
                    .filter(|r| r.id == change.id)
                    .collect::<Vec<_>>();
                match responses.as_slice() {
                    [r] if change_errors_with(&keys, r).is_empty()
                        && r.basis.as_deref()
                            == Some(
                                expected_change_basis_with(change, r, &inputs_digest).as_str(),
                            ) =>
                    {
                        Some((change.id.as_str(), (&r.basis, r.affected_flows.as_slice())))
                    }
                    _ => None,
                }
            })
            .collect();
        Self {
            inputs_digest,
            keys,
            current,
        }
    }
    /// Whether the change has a valid, current assessment.
    pub fn current(&self, change: &str) -> bool {
        self.current.contains_key(change)
    }
    pub fn expected_change_basis(&self, change: &Change, response: &ChangeAssessment) -> String {
        expected_change_basis_with(change, response, &self.inputs_digest)
    }
    pub fn change_errors(&self, response: &ChangeAssessment) -> Vec<String> {
        change_errors_with(&self.keys, response)
    }
}
/// Why a file is one of a flow's dependencies, and where the flow sits in it.
///
/// "dependency file changed" names a file and leaves the author to work out
/// what it has to do with this claim. A flow depends on a file for one of four
/// reasons, and they call for different judgements: a node there is the claim's
/// subject, a watch is something the author asked to be told about, the test
/// file is where the claim is exercised, and the assertion's own file is where
/// it is written. Saying which -- and where the nodes are -- is the difference
/// between rereading a claim and glancing at a line number.
fn roles(a: &Assertion, f: &Flow, file: &str) -> Vec<String> {
    let mut roles: Vec<String> = Vec::new();
    let lines = node_sites(f, file);
    if !lines.is_empty() {
        roles.push(format!("holds this flow's {}", lines.join(", ")));
    }
    roles.extend(whole_file_roles(a, f, file));
    roles
}
fn node_sites(f: &Flow, file: &str) -> Vec<String> {
    f.nodes
        .iter()
        .filter(|n| n.at.file == file)
        .map(|n| format!("{}:{}", n.id, n.at.line))
        .collect()
}
/// Why the flow depends on the file *as a whole*, which is a different claim
/// from where its nodes sit in it.
fn whole_file_roles(a: &Assertion, f: &Flow, file: &str) -> Vec<String> {
    let mut roles: Vec<String> = Vec::new();
    if a.at.file == file {
        roles.push(format!("holds the assertion, line {}", a.at.line));
    }
    if f.applies_to.iter().any(|t| t.file == file) {
        roles.push("is the test this claim applies to".to_owned());
    }
    if f.watch.iter().any(|w| w == file) {
        roles.push("is watched by this flow".to_owned());
    }
    roles
}
fn in_role(roles: &[String]) -> String {
    if roles.is_empty() {
        // Every path into dependencies() is covered above; say nothing rather
        // than guess if that ever stops being true.
        String::new()
    } else {
        format!(" ({})", roles.join("; "))
    }
}
/// A file the flow rests on as a whole: the test it applies to, a file it
/// watches, the file its assertion is written in. Any change there is the
/// author's to judge; only its comments are not.
fn whole_file(a: &Assertion, f: &Flow, file: &str) -> bool {
    a.at.file == file
        || f.applies_to.iter().any(|t| t.file == file)
        || f.watch.iter().any(|w| w == file)
}
/// A claim's identity is where it points and what it says, not the line it
/// happens to be on: a file edited above a node moves the node without
/// touching the claim. Where the file has a parser's view, a node is placed by
/// the declaration holding it and how many lines of code lie between it and
/// the nearest boundary in that declaration -- the declaration's start, or the
/// end of the last nested declaration before it. Growth anywhere else, and
/// comments or blank lines anywhere, leave it in place; pointing it at another
/// statement of the same text on another line does not.
#[derive(Serialize)]
struct Site<'a> {
    file: &'a str,
    text: &'a str,
    #[serde(skip_serializing_if = "Option::is_none")]
    unit: Option<&'a str>,
    line: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    column: Option<usize>,
}
fn site<'a>(at: &'a Anchor, inputs: &'a InputManifest) -> Site<'a> {
    let code = inputs.files.get(&at.file).and_then(|f| f.code.as_ref());
    let Some(code) = code else {
        return Site {
            file: &at.file,
            text: &at.text,
            unit: None,
            line: at.line,
            column: Some(at.column),
        };
    };
    let holder = code.unit_at(at.line, at.column);
    let mut boundary = code.units[holder].line;
    for child in code.units.iter().filter(|u| u.parent == Some(holder)) {
        if (child.end_line, child.end_column) <= (at.line, at.column) && child.end_line > boundary {
            boundary = child.end_line;
        }
    }
    Site {
        file: &at.file,
        text: &at.text,
        unit: Some(&code.units[holder].path),
        line: code
            .code_line(at.line)
            .saturating_sub(code.code_line(boundary)),
        column: None,
    }
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct NodeClaim<'a> {
    id: &'a str,
    at: Site<'a>,
    role: &'a str,
    meaning: &'a str,
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Claim<'a> {
    id: &'a str,
    explanation: &'a str,
    applies_to: &'a [TestSelector],
    nodes: Vec<NodeClaim<'a>>,
    edges: &'a [Edge],
    counts_as_asserted: &'a [String],
    /// The flow's own watches. A redundant manifest entry is left out so that
    /// writing one and removing it are both free.
    watch: Vec<&'a str>,
    questions: &'a [String],
}
fn claim<'a>(f: &'a Flow, inputs: &'a InputManifest) -> Claim<'a> {
    Claim {
        id: &f.id,
        explanation: &f.explanation,
        applies_to: &f.applies_to,
        nodes: f
            .nodes
            .iter()
            .map(|n| NodeClaim {
                id: &n.id,
                at: site(&n.at, inputs),
                role: &n.role,
                meaning: &n.meaning,
            })
            .collect(),
        edges: &f.edges,
        counts_as_asserted: &f.counts_as_asserted,
        watch: watched(f).collect(),
        questions: &f.questions,
    }
}
/// What an acknowledgement rests on in one dependency file.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
enum Footing<'a> {
    /// Named by the flow but not among the run's inputs.
    Absent,
    /// No parser reads this file; its bytes are the claim's ground.
    Bytes(&'a str),
    /// Everything the file does, comments aside.
    Semantic(&'a str),
    /// The declarations holding this flow's nodes, and the file's set of
    /// declarations. Code elsewhere in the file is answered for by what the
    /// flow's test executed, which `carry` judges.
    Units {
        structure: &'a str,
        units: BTreeMap<&'a str, &'a str>,
    },
}
fn footing<'a>(
    a: &'a Assertion,
    f: &'a Flow,
    inputs: &'a InputManifest,
) -> BTreeMap<&'a str, Footing<'a>> {
    dependencies(a, f)
        .into_iter()
        .map(|file| {
            let Some(fingerprint) = inputs.files.get(file) else {
                return (file, Footing::Absent);
            };
            let Some(code) = &fingerprint.code else {
                return (file, Footing::Bytes(&fingerprint.sha256));
            };
            if whole_file(a, f, file) {
                return (file, Footing::Semantic(&code.semantic));
            }
            let units = f
                .nodes
                .iter()
                .filter(|n| n.at.file == file)
                .flat_map(|n| code.ancestors(code.unit_at(n.at.line, n.at.column)))
                .map(|i| (code.units[i].path.as_str(), code.units[i].digest.as_str()))
                .collect();
            (
                file,
                Footing::Units {
                    structure: &code.structure,
                    units,
                },
            )
        })
        .collect()
}

fn generation(a: &Assertion, f: &Flow, state: &State, ledger: &Ledger<'_>) -> String {
    let key = flow_key(a, f);
    let base = state.flows.get(&key).map_or("0", |s| s.generation.as_str());
    let impacts = ledger
        .current
        .iter()
        .filter(|(_, (_, affected))| affected.contains(&key))
        .map(|(id, (basis, _))| (*id, *basis))
        .collect::<BTreeMap<_, _>>();
    if impacts.is_empty() {
        base.into()
    } else {
        digest(&("supercov-generation-v2", base, impacts))
    }
}
/// The parts of `expected_basis` that depend only on the map and the run's
/// inputs, each digested on its own.
///
/// `generation` is deliberately absent: it is a function of the state being
/// written, and a change assessment naming this flow already explains itself
/// through the change channel.
fn footprint(a: &Assertion, f: &Flow, inputs: &InputManifest) -> BTreeMap<String, String> {
    let claim = claim(f, inputs);
    BTreeMap::from([
        (
            "the run's context".to_owned(),
            digest(&inputs.context_digest),
        ),
        (
            "the assertion's site".to_owned(),
            digest(&site(&a.at, inputs)),
        ),
        (
            "what the assertion observes".to_owned(),
            digest(&a.observes),
        ),
        (
            "the flow's explanation".to_owned(),
            digest(&claim.explanation),
        ),
        (
            "the test this flow applies to".to_owned(),
            digest(&claim.applies_to),
        ),
        ("the flow's nodes".to_owned(), digest(&claim.nodes)),
        ("the flow's edges".to_owned(), digest(&claim.edges)),
        (
            "the flow's counted nodes".to_owned(),
            digest(&claim.counts_as_asserted),
        ),
        ("the flow's watch list".to_owned(), digest(&claim.watch)),
        ("the flow's questions".to_owned(), digest(&claim.questions)),
        (
            "the files this flow rests on".to_owned(),
            digest(&footing(a, f, inputs)),
        ),
    ])
}
/// Which recorded parts no longer match, in the order they are listed above.
fn moved(before: &BTreeMap<String, String>, after: &BTreeMap<String, String>) -> Vec<String> {
    after
        .iter()
        .filter(|(part, now)| before.get(*part).is_some_and(|then| then != *now))
        .map(|(part, _)| format!("{part} changed"))
        .collect()
}
pub fn expected_basis(
    a: &Assertion,
    f: &Flow,
    map: &AssertionMap,
    state: &State,
    inputs: &InputManifest,
) -> String {
    expected_basis_with(a, f, state, inputs, &Ledger::new(map, state, inputs))
}
/// The token with the run-wide facts already in hand; what every caller with
/// more than one flow to judge should use.
pub fn expected_basis_with(
    a: &Assertion,
    f: &Flow,
    state: &State,
    inputs: &InputManifest,
    ledger: &Ledger<'_>,
) -> String {
    token(&(
        "supercov-flow-v3",
        &inputs.context_digest,
        &a.id,
        site(&a.at, inputs),
        &a.observes,
        claim(f, inputs),
        footing(a, f, inputs),
        generation(a, f, state, ledger),
    ))
}
pub fn reasons(
    a: &Assertion,
    f: &Flow,
    map: &AssertionMap,
    state: &State,
    inputs: &Inputs,
) -> BTreeSet<String> {
    reasons_for_manifest(a, f, map, state, inputs, &inputs.manifest())
}
pub fn reasons_for_manifest(
    a: &Assertion,
    f: &Flow,
    map: &AssertionMap,
    state: &State,
    inputs: &Inputs,
    manifest: &InputManifest,
) -> BTreeSet<String> {
    reasons_with(
        a,
        f,
        state,
        inputs,
        manifest,
        &Ledger::new(map, state, manifest),
    )
}
pub fn reasons_with(
    a: &Assertion,
    f: &Flow,
    state: &State,
    inputs: &Inputs,
    manifest: &InputManifest,
    ledger: &Ledger<'_>,
) -> BTreeSet<String> {
    let mut reasons = BTreeSet::new();
    if state.schema_version != 3 || state.inputs_digest != ledger.inputs_digest {
        reasons.insert("state does not match run inputs".into());
    }
    if f.basis.as_deref() != Some(expected_basis_with(a, f, state, manifest, ledger).as_str()) {
        let recorded = state.flows.get(&flow_key(a, f));
        match f.basis.as_deref() {
            None => {
                reasons.insert("draft: input acknowledgement not recorded".into());
            }
            Some(basis) if superseded_basis(basis) => {
                reasons.insert(SUPERSEDED_BASIS.into());
            }
            Some(_) => {
                // Say which part moved. One hash over everything can only
                // report that something did, which gave an author who deleted
                // a watch entry the same sentence as one who rewrote a claim.
                let parts = recorded
                    .map(|s| moved(&s.footprint, &footprint(a, f, manifest)))
                    .unwrap_or_default();
                if parts.is_empty() {
                    reasons.insert("claim or inputs changed; needs rechecking".into());
                } else {
                    reasons.extend(parts);
                }
            }
        }
        if let Some(s) = recorded {
            reasons.extend(s.reasons.iter().cloned());
        }
    }
    reasons.extend(validate_flow(f, &inputs.files));
    if a.at.offset(&inputs.files).is_none() {
        reasons.insert("invalid assertion anchor".into());
    }
    if !f.questions.is_empty() {
        reasons.insert("flow has unresolved questions".into());
    }
    reasons
}
/// Read-only validation. Tokens acknowledge authored claims, never prove them.
pub fn validation(map: &AssertionMap, state: &State, inputs: &Inputs) -> serde_json::Value {
    use serde_json::json;
    let manifest = inputs.manifest();
    let ledger = Ledger::new(map, state, &manifest);
    let mut errors = validate(map, inputs);
    for r in &map.change_assessments {
        if !state.changes.iter().any(|c| c.id == r.id) {
            errors.push(format!("{}: unknown change assessment", r.id));
        }
    }
    // Exposure is kept per flow but read per test: hundreds of flow keys say
    // less than the dozen tests they apply to, and cost more to page.
    let selectors = map
        .assertions
        .iter()
        .flat_map(|a| a.flows.iter().map(move |f| (flow_key(a, f), &f.applies_to)))
        .collect::<BTreeMap<_, _>>();
    let changes = state.changes.iter().map(|c| {
        let response = map.change_assessments.iter().find(|r| r.id == c.id);
        let faults = response.map(|r| ledger.change_errors(r)).unwrap_or_default();
        errors.extend(faults.iter().map(|e| format!("{}: {e}", c.id)));
        // Every list a change carries is bounded, or one item outgrows any
        // page and cannot be fetched at all -- B17. `knownFlows` was the first
        // to do it; `exposed` inherited the defect the moment it was added,
        // because its test list grows with the suite, not with the change.
        let tests = c.exposed.iter().filter_map(|k| selectors.get(k)).flat_map(|t| t.iter()).collect::<BTreeSet<_>>();
        let shown = tests.iter().take(20).collect::<Vec<_>>();
        json!({"id":c.id,"file":c.file,"before":c.before,"after":c.after,"reason":c.reason,
            "knownFlows":{"flows":c.known_flows.len(),"sample":c.known_flows.iter().take(8).collect::<Vec<_>>()},
            "exposed":{"flows":c.exposed.len(),"tests":shown,"testCount":tests.len(),"sample":c.exposed.iter().take(8).collect::<Vec<_>>()},
            "current":ledger.current(&c.id),"assessment":response,"errors":faults,
            "expectedBasis":response.map(|r| ledger.expected_change_basis(c,r))})
    }).collect::<Vec<_>>();
    let flows = map.assertions.iter().flat_map(|a| a.flows.iter().map(move |f| (a,f))).map(|(a,f)| {
        json!({"id":flow_key(a,f),"expectedBasis":expected_basis_with(a,f,state,&manifest,&ledger),"reasons":reasons_with(a,f,state,inputs,&manifest,&ledger)})
    }).collect::<Vec<_>>();
    json!({"valid":errors.is_empty(),"stage":"references","errors":errors,"flows":flows,"changes":changes,
        "meaning":"Authored graph references and input acknowledgements only; no semantic proof or completeness claim"})
}
pub fn invalidate(state: &mut State, map: &AssertionMap, reason: &str) {
    for a in &map.assertions {
        for f in &a.flows {
            let key = flow_key(a, f);
            let previous = state.flows.get(&key);
            let base = previous.map_or("0", |s| s.generation.as_str());
            // Whole-map invalidation says nothing about the parts, so keep the
            // record rather than erasing what it knew.
            let footprint = previous.map(|s| s.footprint.clone()).unwrap_or_default();
            let generation = digest(&(base, reason, &state.inputs_digest));
            state.flows.insert(
                key,
                FlowState {
                    generation,
                    reasons: BTreeSet::from([reason.into()]),
                    notices: BTreeSet::new(),
                    footprint,
                },
            );
        }
    }
}
pub fn add_change(
    state: &mut State,
    file: Option<String>,
    before: Option<String>,
    after: Option<String>,
    reason: String,
    known_flows: BTreeSet<String>,
    exposed: BTreeSet<String>,
) {
    // Include pending history so edit/revert/edit cannot alias a still-pending event.
    let id = format!(
        "c_{}",
        &digest(&(
            "supercov-change-id-v2",
            &state.changes,
            &file,
            &before,
            &after,
            &reason
        ))[..24]
    );
    state.changes.push(Change {
        id,
        file,
        before,
        after,
        reason,
        known_flows,
        exposed,
    });
}

fn unique_occurrence(text: &str, snippet: &str) -> Option<usize> {
    if snippet.is_empty() {
        return None;
    }
    let first = text.find(snippet)?;
    // Include overlapping occurrences; match_indices skips them.
    let next = first + text[first..].chars().next()?.len_utf8();
    text[next..]
        .contains(snippet)
        .then_some(())
        .map_or(Some(first), |_| None)
}
fn target_file(file: &str, old: &FileManifest, new: &Files) -> Option<String> {
    if new.contains_key(file) {
        return Some(file.into());
    }
    let hash = old.get(file)?;
    let mut matches = new
        .iter()
        .filter(|(_, s)| FileFingerprint::of(s).same_bytes(hash));
    let first = matches.next()?.0;
    matches.next().is_none().then(|| first.clone())
}
pub fn relocate(at: &Anchor, old: &FileManifest, new: &Files) -> Option<Anchor> {
    relocate_indexed(at, old, new, None, None)
}

/// Where a statement is now, when the declaration holding it did not change
/// and only moved: its digest, and the place of everything nested in it, are
/// what they were. Code added above a function moves every statement in it
/// by the same number of lines, and a statement whose text repeats in the
/// file -- `return null;`, `expect(html).toContain("li")` -- has no other way
/// to be found again, since a text search needs the text to be unique.
fn moved_with_declaration(
    at: &Anchor,
    target: &str,
    old: &FileManifest,
    new: &FileManifest,
) -> Option<Anchor> {
    let before = old.get(&at.file)?.code.as_ref()?;
    let after = new.get(target)?.code.as_ref()?;
    let held = before.unit_at(at.line, at.column);
    if held == 0 {
        // The file itself: an edit anywhere in it is an edit to its unit.
        return None;
    }
    let unit = &before.units[held];
    let moved = after.units.iter().position(|u| u.path == unit.path)?;
    let now = &after.units[moved];
    let layout = |code: &Code, index: usize| {
        let base = code.units[index].line;
        code.units
            .iter()
            .enumerate()
            .filter(|(i, _)| *i != index && code.ancestors(*i).any(|a| a == index))
            .map(|(_, u)| {
                (
                    u.path.clone(),
                    u.line - base,
                    u.end_line - base,
                    u.digest.clone(),
                )
            })
            .collect::<Vec<_>>()
    };
    if now.digest != unit.digest
        || now.end_line - now.line != unit.end_line - unit.line
        || layout(before, held) != layout(after, moved)
    {
        return None;
    }
    let mut candidate = at.clone();
    candidate.file = target.to_owned();
    candidate.line = at.line - unit.line + now.line;
    if at.line == unit.line {
        candidate.column = at.column - unit.column + now.column;
    }
    Some(candidate)
}

fn relocate_indexed(
    at: &Anchor,
    old: &FileManifest,
    new: &Files,
    lines: Option<&LineIndex<'_>>,
    new_manifest: Option<&FileManifest>,
) -> Option<Anchor> {
    old.get(&at.file)?;
    let target = target_file(&at.file, old, new)?;
    let after = &new[&target];
    let mut candidate = at.clone();
    candidate.file.clone_from(&target);
    // Read the recorded position first. Edits elsewhere in the file say nothing
    // about this anchor: if its complete text is still here, it did not move.
    //
    // Without this, every anchor in a changed file is re-found by searching the
    // whole file, and that search insists the text be unique -- so a statement
    // that appears twice is reported "changed or ambiguous" while sitting
    // untouched at the line it was recorded at. That is a false statement about
    // a specific node, and it is most of the staleness in a real map.
    // offset checks the anchor's complete text, so a whole-file fingerprint
    // adds nothing here. Carrying many anchors reuses one line index per file.
    if lines
        .map_or_else(|| candidate.offset(new), |index| index.offset(&candidate))
        .is_some()
    {
        return Some(candidate);
    }
    if let Some(moved) = new_manifest.and_then(|m| moved_with_declaration(at, &target, old, m))
        && lines
            .map_or_else(|| moved.offset(new), |index| index.offset(&moved))
            .is_some()
    {
        return Some(moved);
    }
    let position = unique_occurrence(after, &at.text)?;
    Some(Anchor::new(
        &target,
        after,
        position,
        position + at.text.len(),
    ))
}

/// Old inventory sites matched to new ones, file by file, keeping their order.
///
/// A site used to be found again only by the exact place it was recorded at,
/// or by text unique in the whole file. A test file repeats its assertions --
/// TodoMVC's suite checks `toHaveText` two dozen times -- so one line added at
/// the top retired every repeated assertion below it along with its
/// explanation: 11 of 25 in the reported case. Aligning the two inventories
/// as sequences finds them where they went. A pair is certain when the
/// earliest and the latest optimal alignment agree on it; when they differ,
/// identical assertions could have traded places, and the pair is only a
/// suggestion, which keeps the explanation and asks for its identity to be
/// confirmed.
fn aligned_inventories<'a>(
    old: &'a [InventorySite],
    new: &'a [InventorySite],
) -> BTreeMap<&'a Anchor, (&'a Anchor, bool)> {
    let by_file = |sites: &'a [InventorySite]| {
        let mut files: BTreeMap<&'a str, Vec<&'a Anchor>> = BTreeMap::new();
        for site in sites {
            files
                .entry(site.at.file.as_str())
                .or_default()
                .push(&site.at);
        }
        for anchors in files.values_mut() {
            anchors.sort_by_key(|at| (at.line, at.column));
        }
        files
    };
    let (before, after) = (by_file(old), by_file(new));
    let mut aligned = BTreeMap::new();
    for (file, old_sites) in &before {
        let Some(new_sites) = after.get(file) else {
            continue;
        };
        let (n, m) = (old_sites.len(), new_sites.len());
        // Bounded, so a generated file with thousands of assertions costs
        // nothing here; it keeps the exact and unique-text matches it had.
        if n.saturating_mul(m) > 4_000_000 {
            continue;
        }
        let same = |i: usize, j: usize| old_sites[i].text == new_sites[j].text;
        // prefix[i][j]: common subsequence of the first i and first j sites.
        let mut prefix = vec![vec![0u32; m + 1]; n + 1];
        for i in 0..n {
            for j in 0..m {
                prefix[i + 1][j + 1] = if same(i, j) {
                    prefix[i][j] + 1
                } else {
                    prefix[i][j + 1].max(prefix[i + 1][j])
                };
            }
        }
        // suffix[i][j]: the same for the sites from i and from j on.
        let mut suffix = vec![vec![0u32; m + 1]; n + 1];
        for i in (0..n).rev() {
            for j in (0..m).rev() {
                suffix[i][j] = if same(i, j) {
                    suffix[i + 1][j + 1] + 1
                } else {
                    suffix[i + 1][j].max(suffix[i][j + 1])
                };
            }
        }
        // Latest: trace back from the end, matching as late as possible.
        let mut latest = BTreeMap::new();
        let (mut i, mut j) = (n, m);
        while i > 0 && j > 0 {
            if same(i - 1, j - 1) && prefix[i][j] == prefix[i - 1][j - 1] + 1 {
                latest.insert(i - 1, j - 1);
                i -= 1;
                j -= 1;
            } else if prefix[i - 1][j] >= prefix[i][j - 1] {
                i -= 1;
            } else {
                j -= 1;
            }
        }
        // Earliest: trace forward from the start, matching as early as possible.
        let (mut i, mut j) = (0, 0);
        while i < n && j < m {
            if same(i, j) && suffix[i][j] == suffix[i + 1][j + 1] + 1 {
                aligned.insert(old_sites[i], (new_sites[j], latest.get(&i) == Some(&j)));
                i += 1;
                j += 1;
            } else if suffix[i + 1][j] >= suffix[i][j + 1] {
                i += 1;
            } else {
                j += 1;
            }
        }
    }
    aligned
}

/// How one captured file moved between two runs, judged once and read for
/// every flow.
pub enum FileChange<'a> {
    Same,
    /// Only comments changed: no program can tell.
    CommentsOnly,
    /// Not among the previous run's inputs.
    Added,
    Removed,
    /// No parser reads the file on one side or the other; its bytes moved.
    Bytes,
    Code {
        before: &'a Code,
        after: &'a Code,
        diff: Diff,
        /// The change is confined to declaration bodies that only run: it
        /// reaches a test only if the test ran one of them.
        narrow: bool,
    },
}
pub fn file_change<'a>(
    before: Option<&'a FileFingerprint>,
    after: Option<&'a FileFingerprint>,
    probed: Option<&[usize]>,
) -> Option<FileChange<'a>> {
    let Some(before) = before else {
        return after.map(|_| FileChange::Added);
    };
    let Some(after) = after else {
        return Some(FileChange::Removed);
    };
    if before.same_bytes(after) {
        return Some(FileChange::Same);
    }
    let (Some(old), Some(new)) = (&before.code, &after.code) else {
        return Some(FileChange::Bytes);
    };
    if old.semantic == new.semantic {
        return Some(FileChange::CommentsOnly);
    }
    let diff = old.diff(new);
    let narrow = probed.is_some_and(|probed| diff.narrow(old, probed));
    Some(FileChange::Code {
        before: old,
        after: new,
        diff,
        narrow,
    })
}
/// Every unit that moved, by name: what changed, what arrived, what went.
pub fn describe(before: &Code, after: &Code, diff: &Diff) -> String {
    let mut parts = Vec::new();
    if !diff.changed.is_empty() {
        parts.push(named(diff.changed.iter().map(|i| &before.units[*i])));
    }
    if !diff.added.is_empty() {
        parts.push(format!(
            "added {}",
            named(diff.added.iter().map(|i| &after.units[*i]))
        ));
    }
    if !diff.removed.is_empty() {
        parts.push(format!(
            "removed {}",
            named(diff.removed.iter().map(|i| &before.units[*i]))
        ));
    }
    if parts.is_empty() {
        "declarations".to_owned()
    } else {
        parts.join("; ")
    }
}
/// The units a flow's tests executed, per file, each with what it sits
/// inside; `None` when a selected test has no execution record in this state,
/// in which case nothing about execution can be assumed.
fn executed<'s>(
    records: &BTreeMap<&TestSelector, &'s Execution>,
    f: &Flow,
    manifest: &InputManifest,
) -> Option<BTreeMap<&'s str, BTreeSet<usize>>> {
    let mut out: BTreeMap<&str, BTreeSet<usize>> = BTreeMap::new();
    for selector in &f.applies_to {
        let record = records.get(selector)?;
        for (file, units) in &record.files {
            let code = manifest.files.get(file).and_then(|fp| fp.code.as_ref());
            let set = out.entry(file.as_str()).or_default();
            for &unit in units {
                match code {
                    Some(code) if unit < code.units.len() => set.extend(code.ancestors(unit)),
                    _ => {
                        set.insert(unit);
                    }
                }
            }
        }
    }
    Some(out)
}

/// Carries explanations, never execution events. Uncertain matches are retained
/// as retired suggestions; no nearest-line heuristic assigns semantic meaning.
///
/// A flow goes stale for a change to what its claim rests on and for nothing
/// else: the declarations holding its nodes and the top level of their files,
/// the test it applies to, a file it watches, its assertion, the run's
/// context. A change elsewhere in a node's file is a notice. A change to
/// comments or blank lines is nothing.
///
/// What each flow's test executed does not make the flow stale -- a claim
/// does not pass through every function its test happened to run, and an
/// acknowledgement demanded for all of them at once stops being read. It goes
/// on the change record instead: a changed file names the flows whose tests
/// ran the changed code, so the one assessment the change asks for is asked
/// of the right people, and a change nobody ran asks for none.
pub fn carry(
    map: &AssertionMap,
    state: &State,
    old: &InputManifest,
    new: &Inputs,
    evidence_digest: &str,
    context_changed: bool,
) -> Result<(AssertionMap, State), String> {
    if map.schema_version != 2 || old.schema_version != 2 || new.schema_version != 1 {
        return Err("unsupported map/input schema version".into());
    }
    if state.inputs_digest != digest(old) || state.schema_version != 3 {
        return Err("old map state does not match its run inputs".into());
    }
    let ledger = Ledger::new(map, state, old);
    let new_manifest = new.manifest();
    let (mut next, mut next_state) = seed_manifest(&new_manifest, evidence_digest);
    next.assertions.clear();
    next.retired_assertions = map.retired_assertions.clone();
    next_state.changes = state
        .changes
        .iter()
        .filter(|c| !ledger.current(&c.id))
        .cloned()
        .collect();
    next.change_assessments = map
        .change_assessments
        .iter()
        .filter(|r| next_state.changes.iter().any(|c| c.id == r.id))
        .cloned()
        .collect();
    let records = state
        .executions
        .iter()
        .flat_map(|e| e.tests.iter().map(|t| (&t.test, t)))
        .collect::<BTreeMap<_, _>>();
    let probed = |file: &str| {
        state
            .executions
            .as_ref()
            .and_then(|e| e.probed.get(file))
            .map(Vec::as_slice)
    };
    let changes = old
        .files
        .keys()
        .chain(new_manifest.files.keys())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .filter_map(|file| {
            file_change(
                old.files.get(file),
                new_manifest.files.get(file),
                probed(file),
            )
            .map(|change| (file.as_str(), change))
        })
        .collect::<BTreeMap<_, _>>();
    // Per changed file: the flows it made stale, and the flows whose tests ran
    // the changed code or have no record to say -- what the change record
    // names as known and as exposed.
    let mut marked: BTreeMap<&str, BTreeSet<String>> = BTreeMap::new();
    let mut exposed: BTreeMap<&str, BTreeSet<String>> = BTreeMap::new();
    let mut consumed = BTreeSet::new();
    let lines = LineIndex::new(&new.files);
    let new_sites = new
        .assertions
        .iter()
        .map(|site| &site.at)
        .collect::<BTreeSet<_>>();
    let old_sites = old
        .assertions
        .iter()
        .map(|site| &site.at)
        .collect::<BTreeSet<_>>();
    let aligned = aligned_inventories(&old.assertions, &new.assertions);
    let exact = map
        .assertions
        .iter()
        .map(|a| {
            relocate_indexed(
                &a.at,
                &old.files,
                &new.files,
                Some(&lines),
                Some(&new_manifest.files),
            )
            .or_else(|| {
                aligned
                    .get(&a.at)
                    .filter(|(_, certain)| *certain)
                    .map(|(at, _)| (*at).clone())
            })
            .filter(|at| new_sites.contains(at) || !old_sites.contains(&a.at))
        })
        .collect::<Vec<_>>();
    let reserved = exact.iter().flatten().collect::<BTreeSet<_>>();
    let mut candidates = BTreeMap::<&str, Vec<&Anchor>>::new();
    for site in &new.assertions {
        if !reserved.contains(&site.at) {
            candidates.entry(&site.at.file).or_default().push(&site.at);
        }
    }
    let mut unmatched = BTreeMap::<&str, usize>::new();
    for (other, at) in map.assertions.iter().zip(&exact) {
        if at.is_none() {
            *unmatched.entry(&other.at.file).or_default() += 1;
        }
    }
    for (index, a) in map.assertions.iter().enumerate() {
        // A sole old/new unmatched site in the same file is a review
        // suggestion. Preserve its explanation but never its reviewed status.
        let replacement = if exact[index].is_none() && unmatched.get(a.at.file.as_str()) == Some(&1)
        {
            match candidates.get(a.at.file.as_str()).map(Vec::as_slice) {
                Some([at]) => Some(*at),
                _ => None,
            }
        } else {
            None
        };
        // An alignment that another, equally good one contradicts is a
        // suggestion too: identical assertions can trade places.
        let replacement = replacement.or_else(|| {
            aligned
                .get(&a.at)
                .filter(|(_, certain)| !*certain)
                .map(|(at, _)| *at)
        });
        let matched = exact[index]
            .as_ref()
            .or(replacement)
            .filter(|at| !consumed.contains(*at));
        let Some(at) = matched else {
            next.retired_assertions.push(Retired {
                assertion: a.clone(),
                reason:
                    "assertion removed, changed or ambiguous; reuse its explanation after review"
                        .into(),
            });
            continue;
        };
        consumed.insert(at.clone());
        let mut updated = a.clone();
        updated.at = at.clone();
        for (prior, f) in a.flows.iter().zip(&mut updated.flows) {
            let key = flow_key(a, f);
            let base = generation(a, prior, state, &ledger);
            let mut dirty = BTreeSet::new();
            let mut notices = BTreeSet::new();
            match prior.basis.as_deref() {
                Some(basis) if superseded_basis(basis) => {
                    dirty.insert(SUPERSEDED_BASIS.into());
                }
                Some(basis) if basis != expected_basis_with(a, prior, state, old, &ledger) => {
                    dirty.insert("inherited claim still needs rechecking".into());
                }
                _ => {}
            }
            // What the flow's test ran, for the change record: a changed file
            // is assessed by whoever ran the change, and a change nobody ran
            // is not assessed at all.
            match executed(&records, prior, old) {
                Some(ran) => {
                    for (file, units) in &ran {
                        let reached = match changes.get(file) {
                            None
                            | Some(
                                FileChange::Same | FileChange::CommentsOnly | FileChange::Added,
                            ) => false,
                            Some(FileChange::Removed | FileChange::Bytes) => true,
                            Some(FileChange::Code { diff, narrow, .. }) => {
                                !*narrow || diff.changed.iter().any(|i| units.contains(i))
                            }
                        };
                        if reached {
                            exposed.entry(file).or_default().insert(key.clone());
                        }
                    }
                }
                None => {
                    for (file, change) in &changes {
                        if !matches!(
                            change,
                            FileChange::Same | FileChange::CommentsOnly | FileChange::Added
                        ) {
                            exposed.entry(file).or_default().insert(key.clone());
                        }
                    }
                }
            }
            // What the flow names: its test, its watch list and its assertion's
            // file as a whole; the file of a node for the declarations that
            // hold the node, its top level and its set of declarations.
            for file in dependencies(a, prior) {
                let roles = roles(a, prior, file);
                let verdict = match changes.get(file) {
                    None => Some(format!(
                        "{file} is not among the run's inputs{}",
                        in_role(&roles)
                    )),
                    Some(FileChange::Added) => Some(format!(
                        "{file} is new since the previous run{}",
                        in_role(&roles)
                    )),
                    Some(FileChange::Same | FileChange::CommentsOnly) => None,
                    Some(FileChange::Removed) => Some(format!("{file} removed{}", in_role(&roles))),
                    Some(FileChange::Bytes) => Some(format!("{file} changed{}", in_role(&roles))),
                    Some(FileChange::Code {
                        before,
                        after,
                        diff,
                        ..
                    }) => {
                        if whole_file(a, prior, file) {
                            // The file's roles describe the file. Attached to
                            // the declaration that changed they say something
                            // false: in `other (line 4) changed (holds this
                            // flow's n:2)`, `work` holds n:2 and `other` is its
                            // neighbour. What makes this change count is the
                            // dependency on the whole file; where the nodes sit
                            // is context, and is said as context.
                            let mut why = whole_file_roles(a, prior, file);
                            let sites = node_sites(prior, file);
                            if !sites.is_empty() {
                                let holders = prior
                                    .nodes
                                    .iter()
                                    .filter(|n| n.at.file == file)
                                    .map(|n| before.unit_at(n.at.line, n.at.column))
                                    .collect::<BTreeSet<_>>();
                                why.push(format!(
                                    "this flow's {} sits in {}",
                                    sites.join(", "),
                                    named(holders.iter().map(|i| &before.units[*i]))
                                ));
                            }
                            Some(format!(
                                "{file}: {} changed{}",
                                describe(before, after, diff),
                                in_role(&why)
                            ))
                        } else {
                            let holders = prior
                                .nodes
                                .iter()
                                .filter(|n| n.at.file == file)
                                .flat_map(|n| {
                                    before.ancestors(before.unit_at(n.at.line, n.at.column))
                                })
                                .collect::<BTreeSet<_>>();
                            let moved = holders
                                .iter()
                                .filter(|i| diff.changed.contains(i) || diff.removed.contains(i))
                                .map(|i| &before.units[*i])
                                .collect::<Vec<_>>();
                            if !moved.is_empty() {
                                Some(format!(
                                    "{file}: {} changed{}",
                                    named(moved),
                                    in_role(&roles)
                                ))
                            } else if diff.structural {
                                Some(format!(
                                    "{file}: declarations changed, {}{}",
                                    describe(before, after, diff),
                                    in_role(&roles)
                                ))
                            } else {
                                notices.insert(format!(
                                    "{file} changed outside this flow's nodes: {}",
                                    describe(before, after, diff)
                                ));
                                None
                            }
                        }
                    }
                };
                if let Some(reason) = verdict {
                    dirty.insert(reason);
                    marked.entry(file).or_default().insert(key.clone());
                }
            }
            if replacement.is_some() {
                dirty.insert("assertion changed or replaced; confirm identity and meaning".into());
            }
            for node in &mut f.nodes {
                if let Some(at) = relocate_indexed(
                    &node.at,
                    &old.files,
                    &new.files,
                    Some(&lines),
                    Some(&new_manifest.files),
                ) {
                    node.at = at;
                } else {
                    dirty.insert(format!("node {} changed or ambiguous", node.id));
                }
            }
            for file in f
                .watch
                .iter_mut()
                .chain(f.applies_to.iter_mut().map(|t| &mut t.file))
            {
                if let Some(target) = target_file(file, &old.files, &new.files) {
                    *file = target;
                } else {
                    dirty.insert(format!("dependency file removed: {file}"));
                }
            }
            if context_changed {
                dirty.insert("run configuration, dependencies or execution context changed".into());
            }
            next_state.flows.insert(
                key,
                FlowState {
                    generation: if dirty.is_empty() {
                        base
                    } else {
                        digest(&("supercov-carry-v3", base, &new_manifest, &dirty))
                    },
                    reasons: dirty,
                    notices,
                    footprint: footprint(a, f, &new_manifest),
                },
            );
        }
        next.assertions.push(updated);
    }
    let mut ids = map
        .assertions
        .iter()
        .map(|a| a.id.clone())
        .chain(
            map.retired_assertions
                .iter()
                .map(|r| r.assertion.id.clone()),
        )
        .collect::<BTreeSet<_>>();
    for a in seed(new, evidence_digest).0.assertions {
        if !consumed.contains(&a.at) {
            let mut a = a;
            while !ids.insert(a.id.clone()) {
                a.id.push('_');
            }
            next.assertions.push(a);
        }
    }
    for file in old
        .files
        .keys()
        .chain(new_manifest.files.keys())
        .collect::<BTreeSet<_>>()
    {
        // A manifest is answered for by the run's dependency fingerprint, which
        // reads what it declares. Reporting its bytes here as well would make
        // cutting a release look like a change to assess when nothing about the
        // project moved.
        if crate::integrity::tracked_manifest(file) {
            continue;
        }
        let exposed_to = exposed.get(file.as_str()).cloned().unwrap_or_default();
        match changes.get(file.as_str()) {
            // A comment is not a change to assess.
            Some(FileChange::Same | FileChange::CommentsOnly) => continue,
            // A change confined to code that only runs, which no selected test
            // ran, cannot have reached any claim; the flow claiming that code
            // is already stale for it. Nothing to ask.
            Some(FileChange::Code { narrow: true, .. }) if exposed_to.is_empty() => continue,
            _ => {}
        }
        add_change(
            &mut next_state,
            Some(file.clone()),
            old.files.get(file).map(|f| f.sha256.clone()),
            new_manifest.files.get(file).map(|f| f.sha256.clone()),
            "captured source file changed".into(),
            marked.get(file.as_str()).cloned().unwrap_or_default(),
            exposed_to,
        );
    }
    next.assertions.sort_by(|a, b| a.at.cmp(&b.at));
    Ok((next, next_state))
}

#[path = "assertion_legacy.rs"]
mod legacy;
pub fn parse_stored(bytes: &[u8]) -> Result<AssertionMap, String> {
    let value: serde_json::Value = serde_json::from_slice(bytes).map_err(|e| e.to_string())?;
    match value
        .get("schemaVersion")
        .and_then(serde_json::Value::as_u64)
    {
        None | Some(1) => legacy::import(bytes),
        _ => parse(bytes).map_err(|e| e.to_string()),
    }
}
pub fn parse_state(
    bytes: &[u8],
    map: &AssertionMap,
    inputs: &InputManifest,
    evidence: &str,
    legacy_digest: Option<&str>,
) -> Result<State, String> {
    let value: serde_json::Value = serde_json::from_slice(bytes).map_err(|e| e.to_string())?;
    if value["schemaVersion"] == 3 {
        let state: State = serde_json::from_slice(bytes).map_err(|e| e.to_string())?;
        if state.inputs_digest != digest(inputs) || state.evidence_digest != evidence {
            return Err("Assertion state belongs to different run evidence; rerun tests".into());
        }
        Ok(state)
    } else {
        legacy::state(bytes, map, inputs, evidence, legacy_digest)
    }
}

#[cfg(test)]
mod line_index_tests {
    use super::*;

    // The awkward shapes: no final line feed, a final one, blank lines, CRLF,
    // a lone carriage return, an empty file, and text whose UTF-8 and UTF-16
    // widths differ.
    const SOURCES: &[&str] = &[
        "",
        "a",
        "a\n",
        "a\n\n",
        "\n\n\n",
        "a\r\nb",
        "a\r\nb\r\n",
        "a\rb\nc",
        "x\r",
        "héllo\nwörld\n",
        "😀x\ny😀z\n",
        "def f(a):\n    if a:\n        return 1\n    return 0\n",
    ];

    /// `Anchor::offset` as it was before it took line starts: the oracle the
    /// new form must agree with everywhere.
    fn reference_offset(anchor: &Anchor, source: &str) -> Option<usize> {
        if !local_path(&anchor.file)
            || anchor.text.is_empty()
            || anchor.line == 0
            || anchor.column == 0
        {
            return None;
        }
        let start = source
            .split_inclusive('\n')
            .take(anchor.line - 1)
            .map(str::len)
            .sum::<usize>();
        if source[..start].bytes().filter(|b| *b == b'\n').count() != anchor.line - 1 {
            return None;
        }
        let line = source.get(start..)?.split('\n').next()?;
        if anchor.column - 1 > line.len() {
            return None;
        }
        let pos = start.checked_add(anchor.column - 1)?;
        source.get(pos..)?.starts_with(&anchor.text).then_some(pos)
    }

    #[test]
    fn a_line_reads_exactly_as_str_lines_reads_it() {
        for source in SOURCES {
            let starts = line_starts(source);
            for line in 0..source.len() + 3 {
                let expected = line.checked_sub(1).and_then(|n| source.lines().nth(n));
                assert_eq!(
                    line_text(source, &starts, line),
                    expected,
                    "line {line} of {source:?}"
                );
            }
        }
    }

    #[test]
    fn an_offset_from_line_starts_agrees_with_scanning_everywhere() {
        let mut compared = 0;
        for source in SOURCES {
            let files = Files::from([("f.py".to_owned(), (*source).to_owned())]);
            let index = LineIndex::new(&files);
            // Every text that occurs, a text that does not, and every position
            // around each line -- including just past its end.
            let mut texts = vec!["zzz".to_owned()];
            for start in 0..=source.len() {
                for end in start..=source.len() {
                    if let Some(text) = source.get(start..end) {
                        texts.push(text.to_owned());
                    }
                }
            }
            texts.sort();
            texts.dedup();
            for line in 0..source.lines().count() + 3 {
                for column in 0..source.len() + 3 {
                    for text in &texts {
                        let anchor = Anchor {
                            file: "f.py".into(),
                            line,
                            column,
                            text: text.clone(),
                        };
                        let expected = reference_offset(&anchor, source);
                        assert_eq!(anchor.offset(&files), expected, "{anchor:?} in {source:?}");
                        assert_eq!(index.offset(&anchor), expected, "{anchor:?} in {source:?}");
                        compared += 1;
                    }
                }
            }
        }
        assert!(
            compared > 10_000,
            "the comparison has to be broad to mean anything: {compared}"
        );
    }
}
