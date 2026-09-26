//! Supercov-owned Go parsing and obligation discovery.
//!
//! Go's own `go test -cover` is statement-level and knows nothing about which
//! test reached a line, which branch arm was taken, or whether a condition
//! independently affected its decision. It stays a development oracle, exactly
//! as LLVM does for Rust; the product measures from this tree.
//!
//! The denominator comes from a lossless concrete syntax tree, so every
//! obligation carries the byte range it was discovered at. A line Supercov
//! cannot anchor is not silently dropped: it is either an obligation with a
//! location or it is absent from the manifest entirely.

use std::collections::BTreeMap;

use tree_sitter::{Node, Parser};

use crate::coverage_analysis::PointKind;
use crate::coverage_report::{
    BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum GoInstrumenterError {
    Parse(String),
}

impl std::fmt::Display for GoInstrumenterError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            GoInstrumenterError::Parse(detail) => write!(f, "Go parse error: {detail}"),
        }
    }
}

/// Where a probe has to observe, paired with the obligation it answers for.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum GoProbeTarget {
    Statement {
        id: String,
    },
    Function {
        id: String,
    },
    /// One arm of a branch: the runtime records which alternative ran.
    ///
    /// Conditions and decision outcomes deliberately have no probe. The
    /// recorded vector already says which conditions were evaluated and what
    /// the decision came to, so a probe beside it would store the same fact
    /// twice and charge for it on the hottest path instrumentation has.
    Alternative {
        branch: String,
        alternative: String,
    },
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GoProbe {
    pub id: u64,
    pub target: GoProbeTarget,
    /// Byte offset the probe observes, for the rewriter that comes next.
    pub at: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub struct GoFileObligations {
    pub manifest: CoverageManifest,
    pub probes: BTreeMap<u64, GoProbe>,
    /// Everything the rewriter must insert to observe these obligations.
    pub edits: Vec<GoEdit>,
    /// Conditions per decision, in the order the runtime indexes them. The
    /// harness passes this to `Arm` so the runtime can size its vectors.
    pub decision_widths: Vec<u8>,
}

/// An obligation's identity, derived from what it is rather than from how many
/// came before it.
///
/// A counter per file collides the moment a project has two of them: every
/// file starts again at 1, two obligations share an id with different
/// metadata, and the reader refuses the whole archive. A counter across the
/// project would be unique but would shift every id after any insertion, so
/// adding one statement would invalidate every acknowledgement below it.
///
/// The file, the kind and the byte range answer both: unique across a project,
/// and unchanged by edits to any other file.
pub(crate) fn stable_obligation_id(
    language: &str,
    file: &str,
    kind: &str,
    start: usize,
    end: usize,
) -> String {
    use sha2::{Digest, Sha256};
    let mut hash = Sha256::new();
    for value in [file, kind, &start.to_string(), &end.to_string()] {
        hash.update(value.as_bytes());
        hash.update([0]);
    }
    let digest = hash.finalize();
    let mut encoded = String::with_capacity(24);
    for byte in &digest[..12] {
        use std::fmt::Write as _;
        write!(&mut encoded, "{byte:02x}").expect("writing to a string cannot fail");
    }
    format!("{language}:{kind}:{encoded}")
}

/// One parse, with no attempt to read past anything the grammar refuses.
fn parse_exactly(source: &str) -> Result<tree_sitter::Tree, GoInstrumenterError> {
    let mut parser = Parser::new();
    parser
        .set_language(&tree_sitter_go::LANGUAGE.into())
        .map_err(|error| GoInstrumenterError::Parse(error.to_string()))?;
    let tree = parser
        .parse(source, None)
        .ok_or_else(|| GoInstrumenterError::Parse("parser returned no tree".into()))?;
    if tree.root_node().has_error() {
        return Err(GoInstrumenterError::Parse(parse_failure(&tree, source)));
    }
    Ok(tree)
}

/// The three-byte stand-in written over `new` where its argument is a value.
///
/// Any identifier of the same length would do; the parse never resolves it and
/// the stand-in is never written to disk. Three bytes is the whole point: byte
/// ranges are what every obligation, probe and edit is anchored by, so the
/// tree read from the stand-in has to describe the author's file offset for
/// offset.
const NEW_VALUE_STAND_IN: &str = "nEw";

/// Go 1.26 extended `new` to take a value: `new(x)` is a pointer to a copy of
/// `x`, where before the argument could only be a type.
///
/// tree-sitter-go still models `new` and `make` as a call whose argument list
/// holds a type, so `new("hello")` does not parse -- and a Go file Supercov
/// cannot parse carries no obligations, which is how a package using the
/// construct came to be measured as though it held nothing at all. It is not a
/// rare corner: one codebase this was reported from has 913 call sites across
/// 94 files, and code generators emit it, so a project reintroduces it on
/// every `go generate`.
///
/// The grammar cannot express it, so the parse reads a stand-in: at each call
/// site whose argument is not a type, the three bytes of `new` become another
/// identifier, which makes the call an ordinary one the grammar does accept.
/// Nothing else changes -- not a byte of length, not a token beside it -- so
/// the tree is the author's file in every respect that is measured, and the
/// text every obligation quotes is still sliced from the file itself.
///
/// Per call site rather than per file, because the type forms must be left
/// alone: `new(map[string]int)` parses only while `new` is the builtin, and
/// `new(v)` is a type to the grammar and a value to the compiler without
/// either of them being able to tell from the syntax. Whichever it is, both
/// readings parse, so the stand-in is spent only where the argument is
/// something no type could be.
fn stand_in_for_new_values(source: &str) -> Option<String> {
    let bytes = source.as_bytes();
    let mut masked: Option<String> = None;
    let mut at = 0;
    while at < bytes.len() {
        if let Some(past) = skip_literal_or_comment(bytes, at) {
            at = past;
            continue;
        }
        let Some(open) = builtin_new_at(bytes, at) else {
            at += 1;
            continue;
        };
        let Some(close) = closing_parenthesis(bytes, open) else {
            at += 3;
            continue;
        };
        if !parses_as_a_type(&source[open + 1..close]) {
            masked
                .get_or_insert_with(|| source.to_owned())
                .replace_range(at..at + 3, NEW_VALUE_STAND_IN);
        }
        at += 3;
    }
    masked
}

/// Whether `new` starts here as the builtin being called, and where its
/// argument list opens.
///
/// `new` is not a keyword in Go. `pool.new(v)` is somebody's own method and
/// `renewed` is an ordinary identifier, and the grammar reads both perfectly
/// well already; only a bare `new` immediately followed by `(` is the builtin
/// the grammar has a special rule for.
///
/// Read as bytes rather than as text, and the whole scan with it. Go source is
/// UTF-8, and a `&str` sliced part way through a rune does not return a wrong
/// answer, it panics -- which would mean Supercov breaking the suite it was
/// asked to measure over an accent in a comment. Bytes are safe to walk
/// because no byte of a multi-byte rune is ever ASCII, so nothing the scan
/// looks for can be found inside one.
fn builtin_new_at(bytes: &[u8], at: usize) -> Option<usize> {
    if !bytes[at..].starts_with(b"new") {
        return None;
    }
    if at > 0 && (is_identifier_byte(bytes[at - 1]) || bytes[at - 1] == b'.') {
        return None;
    }
    // Go permits whitespace between the callee and its arguments.
    let mut open = at + 3;
    while open < bytes.len() && bytes[open].is_ascii_whitespace() {
        open += 1;
    }
    (bytes.get(open) == Some(&b'(')).then_some(open)
}

fn is_identifier_byte(byte: u8) -> bool {
    // Anything outside ASCII is a continuation or lead byte of a rune, and Go
    // identifiers may hold those; treating them as part of a name is what
    // keeps `naïvenew` from reading as the builtin.
    byte.is_ascii_alphanumeric() || byte == b'_' || byte >= 0x80
}

/// The parenthesis that closes the one opened at `open`, counting only what is
/// outside a comment or a literal.
fn closing_parenthesis(bytes: &[u8], open: usize) -> Option<usize> {
    let mut depth = 0_usize;
    let mut at = open;
    while at < bytes.len() {
        if let Some(past) = skip_literal_or_comment(bytes, at) {
            at = past;
            continue;
        }
        match bytes[at] {
            b'(' => depth += 1,
            b')' => {
                depth = depth.saturating_sub(1);
                if depth == 0 {
                    return Some(at);
                }
            }
            _ => {}
        }
        at += 1;
    }
    None
}

/// Whether this argument is something Go could name a type by.
///
/// Asked of the grammar rather than guessed at, because the two readings are
/// not distinguishable by shape: `new(int)` and `new(someVar)` are the same
/// syntax, and only the type checker knows which is which. That ambiguity does
/// no harm here -- both readings parse -- so the only question worth asking is
/// whether the argument is something no type could be, which a declaration
/// answers exactly.
fn parses_as_a_type(argument: &str) -> bool {
    // `parse_exactly`, never `parse`: an argument may hold a `new(...)` of its
    // own, and asking the tolerant parser would start again from the top.
    parse_exactly(&format!("package p\n\nvar _ {}\n", argument.trim())).is_ok()
}

/// Just past the comment or literal starting here, or None if one does not.
///
/// Scanning for a construct in Go text means knowing when the text is not
/// code: a `)` inside a string closes nothing, and `// new(` is a remark.
fn skip_literal_or_comment(bytes: &[u8], at: usize) -> Option<usize> {
    let rest = &bytes[at..];
    if rest.starts_with(b"//") {
        return Some(
            bytes[at..]
                .iter()
                .position(|byte| *byte == b'\n')
                .map_or(bytes.len(), |end| at + end),
        );
    }
    if rest.starts_with(b"/*") {
        return Some(
            bytes[at + 2..]
                .windows(2)
                .position(|pair| pair == b"*/")
                .map_or(bytes.len(), |end| at + 4 + end),
        );
    }
    // A raw string runs to its next backquote and holds no escapes at all.
    if bytes[at] == b'`' {
        return Some(
            bytes[at + 1..]
                .iter()
                .position(|byte| *byte == b'`')
                .map_or(bytes.len(), |end| at + 2 + end),
        );
    }
    let quote = match bytes[at] {
        b'"' | b'\'' => bytes[at],
        _ => return None,
    };
    let mut cursor = at + 1;
    while cursor < bytes.len() {
        match bytes[cursor] {
            // An escape consumes whatever follows it, so `"\""` is one string
            // and not two.
            b'\\' => cursor += 2,
            // An unterminated literal is not Go; the file will not parse
            // either way, and stopping at the line keeps the scan bounded.
            b'\n' => return Some(cursor),
            byte if byte == quote => return Some(cursor + 1),
            _ => cursor += 1,
        }
    }
    Some(bytes.len())
}

pub fn parse(source: &str) -> Result<tree_sitter::Tree, GoInstrumenterError> {
    let refusal = match parse_exactly(source) {
        Ok(tree) => return Ok(tree),
        Err(refusal) => refusal,
    };
    // Only now, so every file the grammar already reads costs nothing extra
    // and reads exactly as it did before.
    let stand_in = stand_in_for_new_values(source).ok_or_else(|| refusal.clone())?;
    // And the refusal reported is the one about the author's own file: a
    // stand-in that did not help must not put its own name in the message.
    parse_exactly(&stand_in).map_err(|_| refusal)
}

/// Where a parse went wrong, phrased so a reader knows where to look.
///
/// "source does not parse" for a nine-hundred-line file, or a byte offset into
/// it, says only that something is wrong. tree-sitter recovers as it goes, so
/// the outermost error node routinely spans a whole class while the token it
/// actually choked on is deep inside: the innermost one is the one worth
/// naming.
pub(crate) fn parse_failure(tree: &tree_sitter::Tree, source: &str) -> String {
    let mut deepest: Option<(usize, Node)> = None;
    let mut stack = vec![(0_usize, tree.root_node())];
    while let Some((depth, node)) = stack.pop() {
        if (node.is_error() || node.is_missing()) && deepest.is_none_or(|(found, _)| depth > found)
        {
            deepest = Some((depth, node));
        }
        // Every child, not only those that report an error of their own: an
        // ERROR node holds the tokens it did manage to read, and the one that
        // actually failed is among them.
        let mut cursor = node.walk();
        for child in node.children(&mut cursor) {
            stack.push((depth + 1, child));
        }
    }
    let Some((_, node)) = deepest else {
        return "source does not parse".to_owned();
    };
    let start = node.start_position();
    let mut line = source
        .lines()
        .nth(start.row)
        .unwrap_or_default()
        .trim()
        .to_owned();
    if line.chars().count() > 120 {
        line = line.chars().take(117).collect::<String>() + "...";
    }
    let what = if node.is_missing() {
        "missing syntax"
    } else {
        "unexpected syntax"
    };
    // A recovered ERROR node can swallow everything from the construct it
    // opened to the end of it, and the reader needs to know how far that is:
    // "line 174" alone reads as a one-line problem when the parser gave up on
    // four hundred.
    let end = node.end_position().row + 1;
    let through = if end > start.row + 1 {
        format!(" (through line {end})")
    } else {
        String::new()
    };
    format!(
        "{what} at line {}, column {}{through}: {line}",
        start.row + 1,
        start.column + 1,
    )
}

/// Statements Go nests directly inside a block. Declarations that cannot
/// execute -- an import, a type -- carry no coverage question and are absent
/// rather than counted as uncovered.
fn is_statement(kind: &str) -> bool {
    matches!(
        kind,
        "assignment_statement"
            | "break_statement"
            | "const_declaration"
            | "continue_statement"
            | "dec_statement"
            | "defer_statement"
            | "expression_statement"
            | "expression_switch_statement"
            | "fallthrough_statement"
            | "for_statement"
            | "go_statement"
            | "goto_statement"
            | "if_statement"
            | "inc_statement"
            | "labeled_statement"
            | "return_statement"
            | "select_statement"
            | "send_statement"
            | "short_var_declaration"
            | "type_switch_statement"
            | "var_declaration"
    )
}

struct Collector<'a> {
    file: &'a str,
    source: &'a str,
    alias: &'a str,
    next_probe: &'a mut u64,
    edits: Vec<GoEdit>,
    points: Vec<PointMeta>,
    branches: Vec<BranchMeta>,
    decisions: Vec<DecisionMeta>,
    probes: BTreeMap<u64, GoProbe>,
    limitations: Vec<serde_json::Value>,
    widths: Vec<u8>,
    /// How many decisions the module already numbered before this file. The
    /// runtime holds one decision-state array for the whole module, so an
    /// index that meant "the first decision in this file" would land on every
    /// other file's first decision too.
    decision_base: u32,
}

/// A branch whose condition is a single operand needs no independence
/// obligation; the runtime's sentinel says so.
/// The wrapper a branch needs. A single-operand condition has no independence
/// obligation, so it gets the form with no decision argument — which is the
/// one small enough for Go to inline, and the majority of branches in real
/// code.
fn branch_wrapper(alias: &str, when_true: u64, when_false: u64, decision: Option<usize>) -> String {
    match decision {
        Some(index) => format!("{alias}.BD({when_true}, {when_false}, {index}, "),
        None => format!("{alias}.B({when_true}, {when_false}, "),
    }
}

/// Whether a probe may be placed before this node.
///
/// Go has slots that hold a statement but are not statement positions: the
/// init and post clauses of a `for`, and the initialiser of an `if` or a
/// `switch`. A probe there turns `for i := 0; c; i++` into a four-clause loop
/// that does not compile. Every real statement is a child of a `statement_list`,
/// so that is the rule rather than a list of exceptions to remember.
fn in_statement_position(node: Node) -> bool {
    node.parent()
        .is_some_and(|parent| parent.kind() == "statement_list")
}

/// The condition of a `for` loop, when it has one. A `range` clause and a bare
/// `for {}` have none.
fn loop_condition<'t>(node: Node<'t>) -> Option<Node<'t>> {
    if let Some(condition) = node.child_by_field_name("condition") {
        return Some(condition);
    }
    let mut cursor = node.walk();
    let clause = node
        .children(&mut cursor)
        .find(|child| child.kind() == "for_clause")?;
    let mut inner = clause.walk();
    clause
        .children(&mut inner)
        .find(|child| child.is_named() && child.kind().ends_with("_expression"))
}

impl<'a> Collector<'a> {
    fn id(&mut self, node: Node, kind: &str) -> String {
        stable_obligation_id("go", self.file, kind, node.start_byte(), node.end_byte())
    }

    /// A limitation's identity. The contract requires one, and requires it to
    /// be unique: a manifest whose limitations cannot be told apart cannot say
    /// which surface each one is about, so the reader refuses the run rather
    /// than present a list nobody can act on.
    fn limitation_id(&mut self, node: Node, kind: &str) -> String {
        self.id(node, kind)
    }

    fn probe(&mut self, target: GoProbeTarget, at: usize) -> u64 {
        *self.next_probe += 1;
        let id = *self.next_probe;
        self.probes.insert(id, GoProbe { id, target, at });
        id
    }

    fn edit(&mut self, at: usize, rank: i32, text: String) {
        self.edits.push(GoEdit { at, rank, text });
    }

    /// Insert a statement-position call. Go allows `a(); b()` on one line, so a
    /// probe never changes which line a statement reports as its own.
    fn call_before(&mut self, at: usize, call: String) {
        self.edit(at, 100, format!("{call}; "));
    }

    /// Line and column are one-based, matching every other frontend.
    fn position(&self, node: Node) -> (usize, usize) {
        let start = node.start_position();
        (start.row + 1, start.column + 1)
    }

    fn text(&self, node: Node) -> String {
        let raw = &self.source[node.byte_range()];
        let line = raw.lines().next().unwrap_or("");
        line.trim().to_owned()
    }

    fn add_point(&mut self, node: Node, kind: PointKind, label: Option<String>) {
        let (line, column) = self.position(node);
        let id = self.id(
            node,
            match kind {
                PointKind::Function => "function",
                PointKind::Statement => "statement",
            },
        );
        let target = match kind {
            PointKind::Function => GoProbeTarget::Function { id: id.clone() },
            PointKind::Statement => GoProbeTarget::Statement { id: id.clone() },
        };
        // A function is observed just inside its body, because the declaration
        // itself is not a place a statement may go.
        let at = match kind {
            PointKind::Function => match node.child_by_field_name("body") {
                Some(body) => body.start_byte() + 1,
                None => return,
            },
            PointKind::Statement => node.start_byte(),
        };
        let probe = self.probe(target, at);
        // A direct store into the array this package already holds, not a call
        // that would have to find it first. This is the shape Go's own cover
        // tool and JaCoCo both settled on: one move instruction.
        self.call_before(at, format!("{HITS_VARIABLE}[{probe}] = 2"));
        self.points.push(PointMeta {
            id,
            kind,
            file: self.file.to_owned(),
            line,
            column,
            source: self.text(node),
            label,
        });
    }

    fn add_branch(&mut self, node: Node, kind: &str, labels: &[&str]) -> Vec<u64> {
        let (line, column) = self.position(node);
        let id = self.id(node, "branch");
        let mut probes = Vec::new();
        let alternatives = labels
            .iter()
            .map(|label| {
                let alternative = format!("{id}.{label}");
                probes.push(self.probe(
                    GoProbeTarget::Alternative {
                        branch: id.clone(),
                        alternative: alternative.clone(),
                    },
                    node.start_byte(),
                ));
                BranchAlternativeMeta {
                    id: alternative,
                    label: (*label).to_owned(),
                }
            })
            .collect();
        self.branches.push(BranchMeta {
            id,
            kind: kind.to_owned(),
            file: self.file.to_owned(),
            line,
            column,
            source: self.text(node),
            alternatives,
        });
        probes
    }

    /// Record a boolean expression as a decision when it has more than one
    /// condition. A single condition needs no MC/DC obligation: its branch
    /// outcomes already say everything independence could.
    /// Returns the runtime's index for this decision, or `None` when the
    /// expression has a single condition and needs no independence obligation.
    fn add_decision(&mut self, node: Node, kind: &str) -> Option<usize> {
        let mut leaves = Vec::new();
        condition_nodes(node, self.source, &mut leaves);
        if leaves.len() < 2 {
            return None;
        }
        let conditions = leaves
            .iter()
            .map(|leaf| self.source[leaf.byte_range()].trim().to_owned())
            .collect::<Vec<_>>();
        let (line, column) = self.position(node);
        let id = self.id(node, "decision");
        // The runtime indexes decisions by position across the whole module,
        // so the index a wrapper carries is this decision's place in the
        // module's width table, not in this file's.
        let index_of_decision = self.decision_base as usize + self.widths.len();
        self.widths.push(leaves.len().min(64) as u8);
        let alias = self.alias.to_owned();
        // No probe per condition or outcome. The recorded vector already says
        // which conditions were evaluated and what the decision came to, so a
        // probe beside it would store the same fact twice and charge for it on
        // every evaluation.
        for (index, leaf) in leaves.iter().enumerate() {
            // Wrapping an operand keeps short-circuiting intact: Go evaluates a
            // call argument only when the call is reached, so the right-hand
            // wrapper runs exactly when the unwrapped operand would have.
            self.edit(
                leaf.start_byte(),
                20,
                format!("{alias}.C({index_of_decision}, {index}, "),
            );
            self.edit(leaf.end_byte(), 20, ")".to_owned());
        }
        self.decisions.push(DecisionMeta {
            id,
            file: self.file.to_owned(),
            line,
            column,
            source: self.text(node),
            conditions,
            kind: kind.to_owned(),
        });
        Some(index_of_decision)
    }

    fn walk(&mut self, node: Node) {
        let alias = self.alias.to_owned();
        match node.kind() {
            "function_declaration" | "method_declaration" | "func_literal" => {
                let label = node
                    .child_by_field_name("name")
                    .map(|name| self.source[name.byte_range()].to_owned());
                self.add_point(node, PointKind::Function, label);
            }
            "if_statement" => {
                if let Some(condition) = node.child_by_field_name("condition") {
                    // An `if` without an else still has two outcomes: the body
                    // ran, or control passed it by. Wrapping the condition
                    // records the arm that was *not* taken by never setting its
                    // bit, which is what makes an untested guard visible.
                    let probes = self.add_branch(node, "if", &["true", "false"]);
                    let decision = self.add_decision(condition, "if");
                    self.edit(
                        condition.start_byte(),
                        5,
                        branch_wrapper(&alias, probes[0], probes[1], decision),
                    );
                    self.edit(condition.end_byte(), 5, ")".to_owned());
                }
            }
            "for_statement" => {
                // A `for` with a condition branches on it. A `range` loop and a
                // bare `for {}` have no expression to observe, so Supercov
                // records the limitation rather than an obligation it cannot
                // measure.
                match loop_condition(node) {
                    Some(condition) => {
                        let probes = self.add_branch(node, "loop", &["true", "false"]);
                        let decision = self.add_decision(condition, "loop");
                        self.edit(
                            condition.start_byte(),
                            5,
                            branch_wrapper(&alias, probes[0], probes[1], decision),
                        );
                        self.edit(condition.end_byte(), 5, ")".to_owned());
                    }
                    None => {
                        let (line, column) = self.position(node);
                        let limitation = self.limitation_id(node, "loop-without-condition");
                        self.limitations.push(serde_json::json!({
                            "id": limitation,
                            "kind": "loop-without-condition",
                            "file": self.file,
                            "source": self.text(node),
                            "line": line,
                            "column": column,
                            "reason": "a range or unconditional loop has no condition to observe, so no branch obligation is recorded for it",
                        }));
                    }
                }
            }
            "expression_switch_statement" | "type_switch_statement" | "select_statement" => {
                let kind = match node.kind() {
                    "expression_switch_statement" => "switch",
                    "type_switch_statement" => "type-switch",
                    _ => "select",
                };
                let mut cases = Vec::new();
                let mut has_default = false;
                let mut cursor = node.walk();
                for child in node.children(&mut cursor) {
                    match child.kind() {
                        "expression_case" | "type_case" | "communication_case" => {
                            cases.push((self.text(child), Some(child)))
                        }
                        "default_case" => {
                            has_default = true;
                            cases.push(("default".to_owned(), Some(child)));
                        }
                        _ => {}
                    }
                }
                // A switch with no default can match nothing, which is an
                // outcome a reader has to see, and synthesising the clause is
                // the only way to observe it: an added `default` holding
                // nothing but a probe is the path the program already took.
                //
                // A select is not a switch. Without a default it *blocks*
                // until one of its cases is ready; with one it returns
                // immediately. So there is no "no case matched" outcome to
                // record -- a select always selects -- and adding the clause
                // to observe one would stop it blocking. That is not an
                // instrument changing what is known about a program, it is an
                // instrument changing what the program does: a loop that waited
                // for values spins instead, and the code returns an empty
                // buffer it reports as full.
                if !has_default && node.kind() != "select_statement" {
                    cases.push(("no case matched".to_owned(), None));
                }
                let labels = cases
                    .iter()
                    .map(|(label, _)| label.as_str())
                    .collect::<Vec<_>>();
                let probes = self.add_branch(node, kind, &labels);
                for (probe, (_, clause)) in probes.iter().zip(cases.iter()) {
                    match clause {
                        Some(clause) => {
                            let at = clause
                                .children(&mut clause.walk())
                                .find(|child| child.kind() == "statement_list")
                                .map(|body| body.start_byte())
                                .unwrap_or_else(|| clause.end_byte());
                            self.call_before(at, format!("{alias}.A({probe})"));
                        }
                        None => {
                            // Before the switch's closing brace.
                            let at = node.end_byte().saturating_sub(1);
                            self.edit(at, 100, format!("\ndefault:\n{alias}.A({probe})\n"));
                        }
                    }
                }
            }
            kind if is_statement(kind) && in_statement_position(node) => {
                self.add_point(node, PointKind::Statement, None);
            }
            _ => {}
        }
        // `if`, `for` and `switch` are statements too, and their own point is
        // what says the construct was reached at all.
        if in_statement_position(node)
            && matches!(
                node.kind(),
                "if_statement"
                    | "for_statement"
                    | "expression_switch_statement"
                    | "type_switch_statement"
                    | "select_statement"
            )
        {
            self.add_point(node, PointKind::Statement, None);
        }
        let mut cursor = node.walk();
        for child in node.children(&mut cursor) {
            if child.is_named() {
                self.walk(child);
            }
        }
    }
}

/// Flatten a boolean expression into its independent conditions.
///
/// `&&` and `||` are the only short-circuiting operators Go has, so they are
/// the only ones that split a decision. `!` negates a condition rather than
/// introducing one, and a parenthesised group is transparent.
fn condition_nodes<'t>(node: Node<'t>, source: &str, out: &mut Vec<Node<'t>>) {
    match node.kind() {
        "binary_expression" => {
            let operator = node
                .child_by_field_name("operator")
                .map(|op| &source[op.byte_range()])
                .unwrap_or("");
            if operator == "&&" || operator == "||" {
                if let Some(left) = node.child_by_field_name("left") {
                    condition_nodes(left, source, out);
                }
                if let Some(right) = node.child_by_field_name("right") {
                    condition_nodes(right, source, out);
                }
                return;
            }
            out.push(node);
        }
        "parenthesized_expression" => {
            let mut cursor = node.walk();
            match node.children(&mut cursor).find(|child| child.is_named()) {
                Some(inner) => condition_nodes(inner, source, out),
                None => out.push(node),
            }
        }
        _ => out.push(node),
    }
}

/// One source edit. Every probe is an insertion at a byte offset; wrapping an
/// expression is two of them, at its start and its end.
///
/// `rank` orders edits landing on the same offset. Applying right to left, the
/// edit inserted last ends up leftmost, so an outer wrapper carries a lower
/// rank than the inner one it encloses.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GoEdit {
    pub at: usize,
    pub rank: i32,
    pub text: String,
}

/// Apply edits to source, right to left so earlier offsets stay valid.
pub fn rewrite(source: &str, edits: &[GoEdit]) -> String {
    let mut ordered = edits.to_vec();
    ordered.sort_by(|a, b| b.at.cmp(&a.at).then(b.rank.cmp(&a.rank)));
    let mut out = source.to_owned();
    for edit in ordered {
        if edit.at > out.len() {
            continue;
        }
        out.insert_str(edit.at, &edit.text);
    }
    out
}

/// The import rewritten source needs, placed straight after the package
/// clause. Go rejects an unused import, so this is only added to a file that
/// gained at least one probe.
pub fn import_edit(source: &str, alias: &str, path: &str) -> Option<GoEdit> {
    let tree = parse(source).ok()?;
    let mut cursor = tree.root_node().walk();
    let package = tree
        .root_node()
        .children(&mut cursor)
        .find(|child| child.kind() == "package_clause")?;
    Some(GoEdit {
        at: package.end_byte(),
        rank: 0,
        text: format!("\nimport {alias} \"{path}\""),
    })
}

pub fn build_go_obligations(
    file: &str,
    source: &str,
    next_probe: &mut u64,
    next_decision: &mut u32,
) -> Result<GoFileObligations, GoInstrumenterError> {
    build_go_obligations_with_alias(file, source, next_probe, next_decision, RUNTIME_ALIAS)
}

/// The name rewritten source calls the runtime by. Deliberately unlikely to
/// collide with an identifier a project already uses.
pub const RUNTIME_ALIAS: &str = "__supercov";

/// The package-level array every probe stores into. Declared once per package
/// by a generated file, so a probe is an array index rather than a call.
pub const HITS_VARIABLE: &str = "__supercovHits";

/// The module path the rewritten source imports the runtime from.
pub const RUNTIME_IMPORT: &str = "github.com/supercorp-ai/supercov/runtime/go/supercov";

pub fn build_go_obligations_with_alias(
    file: &str,
    source: &str,
    next_probe: &mut u64,
    next_decision: &mut u32,
    alias: &str,
) -> Result<GoFileObligations, GoInstrumenterError> {
    let tree = parse(source)?;
    let decision_base = *next_decision;
    let mut collector = Collector {
        file,
        source,
        alias,
        next_probe,
        decision_base,
        edits: Vec::new(),
        points: Vec::new(),
        branches: Vec::new(),
        decisions: Vec::new(),
        probes: BTreeMap::new(),
        limitations: Vec::new(),
        widths: Vec::new(),
    };
    let mut cursor = tree.root_node().walk();
    for child in tree.root_node().children(&mut cursor) {
        if child.is_named() {
            collector.walk(child);
        }
    }
    *next_decision += collector.widths.len() as u32;
    let mut edits = collector.edits;
    // The import is only needed by files that call the runtime — decisions and
    // branches do, a file of plain statements does not, and Go rejects an
    // unused import.
    let calls_runtime = edits
        .iter()
        .any(|edit| edit.text.contains(&format!("{alias}.")));
    if calls_runtime && let Some(import) = import_edit(source, alias, RUNTIME_IMPORT) {
        edits.push(import);
    }
    Ok(GoFileObligations {
        manifest: CoverageManifest {
            decisions: collector.decisions,
            points: collector.points,
            branches: collector.branches,
            limitations: collector.limitations,
            unmeasured: Vec::new(),
            scope: None,
        },
        probes: collector.probes,
        edits,
        decision_widths: collector.widths,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Every field the coverage index stores for a limitation.
    ///
    /// A limitation missing one of these is written into a run that then
    /// cannot be opened at all -- `invalid coverage index: coverage
    /// limitation`, with no coverage report and nothing naming the file that
    /// caused it. These were writing `detail` where the index reads `reason`,
    /// and none of them wrote `source`, so any run that measured a for-each
    /// loop was unreadable.
    fn assert_indexable(limitations: &[serde_json::Value]) -> Vec<String> {
        assert!(!limitations.is_empty(), "nothing to check");
        for limitation in limitations {
            for field in ["id", "kind", "file", "source", "reason"] {
                assert!(
                    limitation.get(field).and_then(|v| v.as_str()).is_some(),
                    "a limitation needs a string {field}: {limitation}"
                );
            }
            for field in ["line", "column"] {
                assert!(
                    limitation.get(field).and_then(|v| v.as_u64()).is_some(),
                    "a limitation needs a number {field}: {limitation}"
                );
            }
        }
        let mut kinds = limitations
            .iter()
            .filter_map(|limitation| limitation["kind"].as_str().map(str::to_owned))
            .collect::<Vec<_>>();
        kinds.sort();
        kinds.dedup();
        kinds
    }

    /// A byte offset says a file is broken without saying where to look.
    #[test]
    fn a_file_that_does_not_parse_says_where() {
        let broken = "package main\n\nfunc f() int {\n\treturn 1 )\n}\n";
        let message = parse(broken).expect_err("does not parse").to_string();
        assert!(message.contains("line 4"), "{message}");
        assert!(message.contains("return 1"), "{message}");
        assert!(
            !message.contains("byte"),
            "an offset is not somewhere a reader can look: {message}"
        );
    }

    #[test]
    fn every_limitation_carries_what_the_index_stores() {
        const EVERY: &str = r#"package main

func walk(items []int) int {
	sum := 0
	for _, item := range items {
		sum += item
	}
	for {
		break
	}
	return sum
}
"#;
        let mut next = 0;
        let mut decisions = 0;
        let obligations =
            build_go_obligations("walk.go", EVERY, &mut next, &mut decisions).expect("go");
        assert_eq!(
            assert_indexable(&obligations.manifest.limitations),
            ["loop-without-condition"]
        );
    }

    const SAMPLE: &str = r#"package main

import "fmt"

func classify(a int, b bool) string {
	if a > 10 && b {
		return "big"
	}
	for i := 0; i < a; i++ {
		fmt.Println(i)
	}
	switch {
	case a == 0:
		return "zero"
	default:
		return "small"
	}
}
"#;

    fn obligations(source: &str) -> GoFileObligations {
        let mut next = 0;
        let mut decisions = 0;
        build_go_obligations("main.go", source, &mut next, &mut decisions).expect("obligations")
    }

    /// Rewriting must never produce source Go cannot compile. Re-parsing the
    /// output catches that without a toolchain, on every machine, every run.
    fn rewritten(source: &str) -> String {
        let mut next = 0;
        let mut decisions = 0;
        let go =
            build_go_obligations("x.go", source, &mut next, &mut decisions).expect("obligations");
        let out = rewrite(source, &go.edits);
        parse(&out)
            .unwrap_or_else(|error| panic!("rewritten source does not parse: {error}\n{out}"));
        out
    }

    #[test]
    fn a_probe_never_lands_where_go_does_not_allow_a_statement() {
        // `for i := 0; c; i++` has two slots that hold a statement but are not
        // statement positions; a probe there makes a four-clause loop that does
        // not compile. Same for an `if` or `switch` initialiser.
        let out = rewritten(
            "package main\nfunc f(a int) int {\n\tfor i := 0; i < a; i++ {\n\t\ta++\n\t}\n\tif b := a; b > 1 {\n\t\treturn b\n\t}\n\tswitch c := a; c {\n\tcase 1:\n\t\treturn 1\n\t}\n\treturn 0\n}\n",
        );
        assert!(
            !out.contains("for __supercov"),
            "probe in a for-clause init:\n{out}"
        );
        assert!(
            !out.contains("; __supercov.P"),
            "probe in a for-clause post:\n{out}"
        );
        assert!(
            out.contains("if b := a;"),
            "the if initialiser survived intact:\n{out}"
        );
        assert!(
            out.contains("switch c := a;"),
            "the switch initialiser survived intact:\n{out}"
        );
    }

    #[test]
    fn wrapping_a_condition_preserves_short_circuit_order() {
        // Go evaluates a call argument only when the call is reached, so a
        // wrapped right-hand operand runs exactly when the unwrapped one would
        // have. The branch wrapper must enclose the conditions, or the decision
        // would be closed before its operands had been observed.
        let out = rewritten(
            "package main\nfunc f(a int, b bool) bool {\n\tif a > 10 && b {\n\t\treturn true\n\t}\n\treturn false\n}\n",
        );
        let condition = out
            .lines()
            .find(|line| line.contains("if "))
            .expect("the if survived");
        let branch = condition.find(".BD(").expect("branch and decision wrapper");
        let first = condition.find(".C(").expect("first condition wrapper");
        assert!(
            branch < first,
            "the branch must enclose its conditions: {condition}"
        );
        assert_eq!(
            condition.matches(".C(").count(),
            2,
            "one wrapper per condition: {condition}"
        );
        assert!(
            condition.contains("&&"),
            "the operator itself is untouched: {condition}"
        );
    }

    #[test]
    fn a_single_condition_branch_uses_the_wrapper_that_inlines() {
        // Most branches in real code have one operand and no independence
        // obligation. They take the form with no decision argument, which is
        // the one small enough for the Go compiler to inline.
        let out = rewritten(
            "package main\nfunc f(a int) bool {\n\tif a > 10 {\n\t\treturn true\n\t}\n\treturn false\n}\n",
        );
        assert!(out.contains(".B("), "{out}");
        assert!(!out.contains(".BD("), "no decision here to close:\n{out}");
    }

    #[test]
    fn a_switch_without_a_default_gains_one_so_matching_nothing_is_observable() {
        // The outcome exists whether or not the author wrote a clause for it,
        // and it cannot be seen without one.
        let out = rewritten(
            "package main\nfunc f(a int) {\n\tswitch a {\n\tcase 1:\n\t\treturn\n\t}\n}\n",
        );
        assert!(out.contains("default:"), "{out}");

        // A switch that already has one is left alone.
        let existing = rewritten(
            "package main\nfunc f(a int) {\n\tswitch a {\n\tcase 1:\n\t\treturn\n\tdefault:\n\t\treturn\n\t}\n}\n",
        );
        assert_eq!(existing.matches("default:").count(), 1, "{existing}");
    }

    #[test]
    fn a_loop_with_no_condition_records_a_limitation_not_an_obligation() {
        // A `range` loop and a bare `for {}` have no expression to observe.
        // Declaring a branch nothing can measure would put an obligation in the
        // denominator that no test could ever satisfy.
        let mut next = 0;
        let mut decisions = 0;
        let go = build_go_obligations(
            "x.go",
            "package main\nfunc f(xs []int) {\n\tfor _, x := range xs {\n\t\t_ = x\n\t}\n\tfor {\n\t\tbreak\n\t}\n}\n",
            &mut next,
            &mut decisions,
        )
        .unwrap();
        assert!(
            go.manifest.branches.iter().all(|b| b.kind != "loop"),
            "{:?}",
            go.manifest.branches
        );
        assert_eq!(
            go.manifest.limitations.len(),
            2,
            "{:?}",
            go.manifest.limitations
        );
        assert_eq!(go.manifest.limitations[0]["kind"], "loop-without-condition");
    }

    #[test]
    fn only_a_file_that_gained_a_probe_imports_the_runtime() {
        // Go rejects an unused import, so a file with nothing to observe must
        // not get one.
        let out = rewritten("package main\nfunc f(a int) int {\n\treturn a\n}\n");
        assert!(
            out.contains(RUNTIME_ALIAS),
            "a function is itself an obligation:\n{out}"
        );

        let mut next = 0;
        let mut decisions = 0;
        let bare = build_go_obligations(
            "t.go",
            "package main\n\ntype T struct{}\n",
            &mut next,
            &mut decisions,
        )
        .unwrap();
        assert!(bare.edits.is_empty(), "{:?}", bare.edits);
        assert_eq!(
            rewrite("package main\n\ntype T struct{}\n", &bare.edits),
            "package main\n\ntype T struct{}\n"
        );
    }

    #[test]
    fn a_short_circuiting_operator_splits_a_decision_and_nothing_else_does() {
        // `&&` and `||` are the only operators that let one condition decide
        // the outcome without the other running, which is what MC/DC is about.
        // A comparison is one condition however many operands it reads.
        let go = obligations(SAMPLE);
        let decision = go
            .manifest
            .decisions
            .iter()
            .find(|d| d.kind == "if")
            .expect("the if carries a decision");
        assert_eq!(decision.conditions, ["a > 10", "b"]);

        // A single condition needs no independence obligation: the branch
        // outcomes already say everything it could.
        let simple = obligations(
            "package main\nfunc f(a int) bool {\n\tif a > 1 {\n\t\treturn true\n\t}\n\treturn false\n}\n",
        );
        assert!(
            simple.manifest.decisions.is_empty(),
            "{:?}",
            simple.manifest.decisions
        );
    }

    #[test]
    fn negation_and_parentheses_do_not_invent_conditions() {
        // `!b` is `b` negated, not a second condition, and a parenthesised
        // group is transparent. Counting either as extra would inflate the
        // MC/DC denominator with obligations no test can satisfy separately.
        let go = obligations(
            "package main\nfunc f(a int, b bool, c bool) bool {\n\tif (a > 1 || !b) && c {\n\t\treturn true\n\t}\n\treturn false\n}\n",
        );
        let decision = &go.manifest.decisions[0];
        assert_eq!(decision.conditions, ["a > 1", "!b", "c"]);
    }

    #[test]
    fn every_branching_construct_records_the_outcome_that_was_not_taken() {
        // An `if` with no else, a loop that never runs, and a switch that
        // matches nothing are all outcomes a reader has to see. Recording only
        // the arm that executed would make an untested guard look exercised.
        let go = obligations(SAMPLE);
        let by_kind = |kind: &str| {
            go.manifest
                .branches
                .iter()
                .find(|b| b.kind == kind)
                .map(|b| {
                    b.alternatives
                        .iter()
                        .map(|a| a.label.clone())
                        .collect::<Vec<_>>()
                })
        };
        assert_eq!(by_kind("if").unwrap(), ["true", "false"]);
        // A loop's condition is true on every iteration and false when it
        // stops, so the honest labels are the condition's own outcomes rather
        // than "entered" and "skipped".
        assert_eq!(by_kind("loop").unwrap(), ["true", "false"]);
        let switch = by_kind("switch").unwrap();
        assert!(switch.contains(&"default".to_owned()), "{switch:?}");
        assert!(
            !switch.contains(&"no case matched".to_owned()),
            "a default already covers it"
        );

        // Without a default, the fall-through outcome is named explicitly.
        let open = obligations(
            "package main\nfunc f(a int) {\n\tswitch a {\n\tcase 1:\n\t\treturn\n\t}\n}\n",
        );
        let labels = open
            .manifest
            .branches
            .iter()
            .find(|b| b.kind == "switch")
            .unwrap()
            .alternatives
            .iter()
            .map(|a| a.label.clone())
            .collect::<Vec<_>>();
        assert!(labels.contains(&"no case matched".to_owned()), "{labels:?}");
    }

    #[test]
    fn functions_and_statements_are_separate_obligations_with_locations() {
        let go = obligations(SAMPLE);
        let functions = go
            .manifest
            .points
            .iter()
            .filter(|p| p.kind == PointKind::Function)
            .collect::<Vec<_>>();
        assert_eq!(functions.len(), 1);
        assert_eq!(functions[0].label.as_deref(), Some("classify"));
        assert_eq!(functions[0].line, 5);

        let statements = go
            .manifest
            .points
            .iter()
            .filter(|p| p.kind == PointKind::Statement)
            .count();
        assert!(
            statements >= 6,
            "expected the body's statements, got {statements}"
        );
        // Every obligation is anchored; an unanchorable line is absent rather
        // than counted as uncovered.
        assert!(
            go.manifest
                .points
                .iter()
                .all(|p| p.line > 0 && p.column > 0)
        );
        // Imports and type declarations carry no coverage question.
        assert!(
            !go.manifest
                .points
                .iter()
                .any(|p| p.source.starts_with("import"))
        );
    }

    #[test]
    fn every_obligation_has_a_probe_and_malformed_source_is_refused() {
        let go = obligations(SAMPLE);
        let expected = go.manifest.points.len()
            + go.manifest
                .branches
                .iter()
                .map(|b| b.alternatives.len())
                .sum::<usize>();
        // Points and branch alternatives carry probes. Conditions and outcomes
        // do not: their vector already says which ran and what the decision
        // came to, so a probe would be the same fact stored twice.
        assert_eq!(go.probes.len(), expected);
        // A decision is still an obligation, answered by the width the runtime
        // sizes its vector from rather than by a probe.
        assert_eq!(go.decision_widths.len(), go.manifest.decisions.len());

        // Guessing at a file that does not parse would put obligations on lines
        // that may not exist.
        let mut next = 0;
        let mut decisions = 0;
        assert!(matches!(
            build_go_obligations(
                "broken.go",
                "package main\nfunc f( {",
                &mut next,
                &mut decisions
            ),
            Err(GoInstrumenterError::Parse(_))
        ));
    }

    #[test]
    fn go_1_26_new_of_a_value_is_measured_rather_than_dropped() {
        // Go 1.26 let `new` take a value, not only a type: `new(x)` returns a
        // pointer to a copy of `x`. tree-sitter-go still models new and make
        // as a call whose one argument must be a type, so every file holding
        // one failed to parse -- and a file that does not parse carries no
        // obligations, so a package using the construct was measured as
        // though it held nothing. It appears 913 times in one codebase this
        // was reported from, and code generators emit it, so a project can
        // reintroduce it on every `go generate`.
        let go = obligations(
            "package p\n\nfunc Greeting() *string {\n\treturn new(\"hello\")\n}\n\nfunc Sum(a, b int) *int {\n\treturn new(a + b)\n}\n\nfunc Copy(v int) *int {\n\tif v > 0 {\n\t\treturn new(v)\n\t}\n\treturn new(0)\n}\n",
        );
        assert_eq!(
            go.manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            3,
            "every function in the file is an obligation: {:?}",
            go.manifest.points
        );
        assert_eq!(
            go.manifest.branches.len(),
            1,
            "the `if` beside it is still a branch with both arms to answer for"
        );
        // And the obligation quotes the source the author wrote. The parse
        // reads a stand-in for the construct tree-sitter cannot express; what
        // the manifest records has to be the file itself, or the report shows
        // the reader a line that is not in their repository.
        assert!(
            go.manifest
                .points
                .iter()
                .any(|point| point.source.contains("new(\"hello\")")),
            "{:?}",
            go.manifest.points
        );
        assert!(
            !go.manifest
                .points
                .iter()
                .any(|point| point.source.contains("nEw")),
            "{:?}",
            go.manifest.points
        );
    }

    #[test]
    fn new_of_a_type_is_left_exactly_as_it_was() {
        // Only the value form needs the stand-in. Every type form already
        // parses, and rewriting those would turn `new(map[string]int)` --
        // whose argument is a type and nothing else -- into something that
        // does not parse at all.
        let go = obligations(
            "package p\n\nfunc Types() {\n\t_ = new(int)\n\t_ = new(map[string]int)\n\t_ = new([]byte)\n\t_ = new(chan int)\n\t_ = new(struct{ A int })\n\t_ = new(func(int) error)\n\t_ = new([3]int)\n\t_ = new(interface{})\n}\n",
        );
        assert_eq!(
            go.manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            1
        );
        // The same file gaining one value form must not cost the type forms
        // their parse: the stand-in is chosen per call site, not per file.
        let mixed = obligations(
            "package p\n\nfunc Mixed(v int) {\n\t_ = new(map[string][]chan int)\n\t_ = new(v)\n\t_ = new(\"x\")\n}\n",
        );
        assert_eq!(
            mixed
                .manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            1
        );
    }

    #[test]
    fn a_method_called_new_is_not_the_builtin() {
        // `new` is not a keyword, so `x.new(v)` is an ordinary method call and
        // always parsed. A stand-in written over it would be a rewrite of
        // somebody's own API for no reason -- and the file still has to parse
        // because of the builtin call beside it.
        let go = obligations(
            "package p\n\ntype pool struct{}\n\nfunc (p pool) new(v int) *int {\n\treturn new(v + 1)\n}\n\nfunc use(p pool) *int {\n\treturn p.new(2)\n}\n",
        );
        assert!(
            go.manifest
                .points
                .iter()
                .any(|point| point.source.contains("p.new(2)")),
            "{:?}",
            go.manifest.points
        );
    }

    #[test]
    fn a_file_with_runes_outside_ascii_is_scanned_without_splitting_one() {
        // The scan that finds a `new(` call site walks bytes, and Go source is
        // UTF-8: a comment or a string with a rune in it puts multi-byte
        // sequences between the scanner and the call. Splitting one is not a
        // wrong answer, it is a panic -- Supercov would take down the suite it
        // was asked to measure, on a file whose only crime is a name with an
        // accent in it.
        let go = obligations(
            "package p\n\n// Prüfen: gibt \u{e4}\u{f6}\u{fc} zur\u{fc}ck.\nfunc Gr\u{fc}\u{df}en() *string {\n\tsch\u{f6}n := \"gr\u{fc}\u{df}e \u{2014} \u{fc}ber alles\"\n\treturn new(sch\u{f6}n + \"!\")\n}\n",
        );
        assert_eq!(
            go.manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            1
        );
    }

    #[test]
    fn the_scan_never_mistakes_text_for_code() {
        // The scan that finds a `new(` call site has to know when Go source is
        // not Go: a `)` inside a string closes nothing, `// new(` is a remark,
        // and a backquoted string has no escapes at all. Reading any of them
        // as code finds a call site that is not there, and a stand-in written
        // over one is a rewrite of somebody's string.
        let go = obligations(concat!(
            "package p\n\n",
            "func f(v int) *int {\n",
            // Every one of these holds the text `new(` and none is a call.
            "\t_ = \"new(\\\"x\\\") and an unclosed ( paren\"\n",
            "\t_ = `raw new(\"y\") with ) and \\ backslash`\n",
            "\t_ = '('\n",
            "\t// new(\"comment\") and a stray )\n",
            "\t/* new(\"block\") ) */\n",
            // And this one is.
            "\treturn new(v + 1)\n}\n",
        ));
        assert_eq!(
            go.manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            1
        );

        // The same again where the only `new(` is inside text, so the file
        // parses without the stand-in ever being spent.
        let untouched =
            obligations("package p\n\nfunc g() string {\n\treturn `new(\"only in text\")`\n}\n");
        assert!(
            untouched
                .manifest
                .points
                .iter()
                .any(|point| point.source.contains("new(\"only in text\")")),
            "{:?}",
            untouched.manifest.points
        );
    }

    #[test]
    fn no_shape_of_input_can_make_the_scan_panic() {
        // The scan walks bytes, and every byte position is reachable: a file
        // can end inside a string, inside a comment, inside the argument list
        // of a `new(` that is never closed. A wrong answer there is a file
        // reported as unparseable; a panic is Supercov taking down the suite
        // it was asked to measure. So every truncation of a file holding one
        // of each is parsed, and the only claim made is that it returns.
        let awkward = concat!(
            "package p\n\n",
            "// gr\u{fc}\u{df}e \u{2014} new(\"in a comment\")\n",
            "func f(sch\u{f6}n int) *int {\n",
            "\t_ = \"\u{fc}ber new(\\\"in a string\\\"\"\n",
            "\t_ = `\u{e4}\u{f6}\u{fc} new(\n",
            "\t_ = '\u{fc}'\n",
            "\t/* new(\"unterminated\n",
            "\treturn new(sch\u{f6}n + 1)\n}\n",
        );
        for end in 0..=awkward.len() {
            // Only on a rune boundary: a `&str` cannot hold half a rune, so a
            // split elsewhere is not an input Supercov could ever be given.
            if !awkward.is_char_boundary(end) {
                continue;
            }
            let _ = parse(&awkward[..end]);
            // And the same read from the other end, so a construct that opens
            // before the window is covered too.
            if awkward.is_char_boundary(end) {
                let _ = parse(&awkward[end..]);
            }
        }

        // A `new(` whose argument list never closes, and one at the very end
        // of a file, are the two positions the scan's own bounds depend on.
        for source in [
            "package p\n\nfunc f() {\n\t_ = new(\n",
            "package p\n\nfunc f() {\n\t_ = new",
            "package p\n\nfunc f() {\n\t_ = new(",
            "package p\n\nfunc f() {\n\t_ = new()\n}\n",
            "new",
            "new(",
            "",
        ] {
            let _ = parse(source);
        }
    }

    #[test]
    fn the_scan_reads_new_the_way_go_spells_it() {
        // Every shape of the call site the scanner has to recognise or leave
        // alone, gathered because the measurement said so: the whitespace
        // Go permits between a callee and its arguments was written for and
        // never exercised, and neither was an identifier that merely ends in
        // the word.
        let go = obligations(concat!(
            "package p\n\n",
            "type pool struct{}\n\n",
            "func (p pool) new(v int) *int {\n\treturn &v\n}\n\n",
            "func renew(v string) *string {\n\treturn &v\n}\n\n",
            "func f(p pool, v int) *int {\n",
            // Go allows space, and a newline, between `new` and its argument.
            "\t_ = new (\"spaced\")\n",
            "\t_ = new\t(\"tabbed\")\n",
            // A method of somebody's own, which is not the builtin.
            "\t_ = p.new(2)\n",
            // An identifier that ends in the word, which is not it either.
            "\t_ = renew(\"x\")\n",
            // And an identifier that starts with it.
            "\tnewValue := v\n",
            "\treturn new(newValue)\n}\n",
        ));
        assert_eq!(
            go.manifest
                .points
                .iter()
                .filter(|p| p.kind == PointKind::Function)
                .count(),
            3,
            "{:?}",
            go.manifest.points
        );
        // What the author wrote is what the obligations quote, spacing and all.
        assert!(
            go.manifest
                .points
                .iter()
                .any(|point| point.source.contains("new (\"spaced\")")),
            "{:?}",
            go.manifest.points
        );
        assert!(
            !go.manifest
                .points
                .iter()
                .any(|point| point.source.contains("nEw")),
            "{:?}",
            go.manifest.points
        );
    }

    #[test]
    fn a_file_that_is_simply_broken_still_does_not_parse() {
        // The stand-in must not become a way for any unparseable file to slip
        // through: what it cannot read is still a hole in the denominator, and
        // a hole reported as measured is a wrong number.
        let mut next = 0;
        let mut decisions = 0;
        assert!(matches!(
            build_go_obligations(
                "broken.go",
                "package p\n\nfunc f() {\n\t_ = new(1)\n\tif {\n}\n",
                &mut next,
                &mut decisions
            ),
            Err(GoInstrumenterError::Parse(_))
        ));
    }

    #[test]
    fn decisions_are_numbered_across_the_module_not_within_a_file() {
        // The runtime holds one decision-state array for the whole module, so
        // an index meaning "the first decision in this file" would land on
        // every other file's first decision: two files would share condition
        // state, and the vectors both produced would describe neither.
        let mut next = 0;
        let mut decisions = 0;
        let first = build_go_obligations(
            "a.go",
            "package p\n\nfunc A(x, y bool) bool {\n\tif x && y {\n\t\treturn true\n\t}\n\treturn false\n}\n",
            &mut next,
            &mut decisions,
        )
        .unwrap();
        let second = build_go_obligations(
            "b.go",
            "package p\n\nfunc B(x, y bool) bool {\n\tif x || y {\n\t\treturn true\n\t}\n\treturn false\n}\n",
            &mut next,
            &mut decisions,
        )
        .unwrap();

        let referenced = |obligations: &GoFileObligations| {
            obligations
                .edits
                .iter()
                .filter_map(|edit| {
                    let at = edit.text.find(".C(")?;
                    edit.text[at + 3..]
                        .split(',')
                        .next()?
                        .trim()
                        .parse::<u32>()
                        .ok()
                })
                .collect::<std::collections::BTreeSet<_>>()
        };
        assert_eq!(referenced(&first), [0].into());
        assert_eq!(referenced(&second), [1].into());
        assert_eq!(decisions, 2, "the module numbered two decisions in all");
        // And the widths each file reports stay in the order the ids assume,
        // so the concatenated table lines up with the concatenated manifest.
        assert_eq!(first.decision_widths, [2]);
        assert_eq!(second.decision_widths, [2]);
    }
}
