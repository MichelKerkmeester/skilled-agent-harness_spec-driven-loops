//! Supercov-owned Java and Kotlin parsing and obligation discovery.
//!
//! JaCoCo instruments bytecode; Supercov instruments source, for the same
//! reason it does everywhere else. Bytecode branches are the compiler's
//! branches, and a condition the compiler folded away is one no test can be
//! asked about. The denominator has to be the source the author wrote.
//!
//! Java and Kotlin share this module because they share a runtime and most of
//! a model. Where they differ they differ sharply, and each difference is
//! named at the point it matters rather than hidden behind a trait.

use std::collections::BTreeMap;

use tree_sitter::{Node, Parser};

use crate::coverage_analysis::PointKind;
use crate::coverage_report::{
    BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
};
use crate::go_instrumenter::{GoEdit, GoProbe, GoProbeTarget};

/// The runtime class instrumented source calls.
pub const RUNTIME_CLASS: &str = "com.supercorp.supercov.Supercov";
/// The array probes store into, qualified so no import is needed.
pub const HITS: &str = "com.supercorp.supercov.Supercov.HITS";

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum JvmLanguage {
    Java,
    Kotlin,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum JvmInstrumenterError {
    Parse(String),
}

impl std::fmt::Display for JvmInstrumenterError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            JvmInstrumenterError::Parse(detail) => write!(f, "JVM parse error: {detail}"),
        }
    }
}

pub fn parse(
    source: &str,
    language: JvmLanguage,
) -> Result<tree_sitter::Tree, JvmInstrumenterError> {
    let mut parser = Parser::new();
    let grammar = match language {
        JvmLanguage::Java => tree_sitter_java::LANGUAGE.into(),
        JvmLanguage::Kotlin => tree_sitter_kotlin_ng::LANGUAGE.into(),
    };
    parser
        .set_language(&grammar)
        .map_err(|error| JvmInstrumenterError::Parse(error.to_string()))?;
    let tree = parser
        .parse(source, None)
        .ok_or_else(|| JvmInstrumenterError::Parse("parser returned no tree".into()))?;
    if tree.root_node().has_error() {
        return Err(JvmInstrumenterError::Parse(
            crate::go_instrumenter::parse_failure(&tree, source),
        ));
    }
    Ok(tree)
}

#[derive(Debug, Clone, PartialEq)]
pub struct JvmFileObligations {
    pub manifest: CoverageManifest,
    pub probes: BTreeMap<u64, GoProbe>,
    pub edits: Vec<GoEdit>,
    pub decision_widths: Vec<u8>,
}

/// Statements Java nests directly inside a block. A declaration that cannot
/// execute carries no coverage question and is absent rather than uncovered.
fn is_java_statement(kind: &str) -> bool {
    matches!(
        kind,
        "assert_statement"
            | "break_statement"
            | "continue_statement"
            | "do_statement"
            | "enhanced_for_statement"
            | "expression_statement"
            | "for_statement"
            | "if_statement"
            | "labeled_statement"
            | "local_variable_declaration"
            | "return_statement"
            | "switch_expression"
            | "synchronized_statement"
            | "throw_statement"
            | "try_statement"
            | "try_with_resources_statement"
            | "while_statement"
            | "yield_statement"
    )
}

/// The kinds tree-sitter's Kotlin grammar actually produces in statement
/// position, which are not the ones the language's own vocabulary suggests.
///
/// Everything in Kotlin is an expression, so a `return` is a
/// `return_expression` and a `y--` is a `unary_expression`. `break` and
/// `continue` are stranger still: the grammar gives them no kind of their own
/// and reports them as identifiers, so they are recognised by their text.
/// Matching identifiers in general would put a probe before every bare name.
fn is_kotlin_statement(node: Node, source: &str) -> bool {
    match node.kind() {
        "assignment"
        | "call_expression"
        | "do_while_statement"
        | "for_statement"
        | "if_expression"
        | "property_declaration"
        | "return_expression"
        | "throw_expression"
        | "try_expression"
        | "unary_expression"
        | "when_expression"
        | "while_statement" => true,
        "identifier" => matches!(source[node.byte_range()].trim(), "break" | "continue"),
        _ => false,
    }
}

struct Collector<'a> {
    file: &'a str,
    source: &'a str,
    language: JvmLanguage,
    next_probe: &'a mut u64,
    edits: Vec<GoEdit>,
    points: Vec<PointMeta>,
    branches: Vec<BranchMeta>,
    decisions: Vec<DecisionMeta>,
    probes: BTreeMap<u64, GoProbe>,
    limitations: Vec<serde_json::Value>,
    widths: Vec<u8>,
    /// How many decisions the project already numbered before this file. The
    /// runtime holds one decision-state array for the whole run, so an index
    /// that meant "the first decision in this file" would land on every other
    /// file's first decision too.
    decision_base: u32,
}

impl Collector<'_> {
    fn id(&mut self, node: Node, kind: &str) -> String {
        let language = match self.language {
            JvmLanguage::Java => "java",
            JvmLanguage::Kotlin => "kotlin",
        };
        crate::go_instrumenter::stable_obligation_id(
            language,
            self.file,
            kind,
            node.start_byte(),
            node.end_byte(),
        )
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

    fn position(&self, node: Node) -> (usize, usize) {
        let start = node.start_position();
        (start.row + 1, start.column + 1)
    }

    fn text(&self, node: Node) -> String {
        self.source[node.byte_range()]
            .lines()
            .next()
            .unwrap_or("")
            .trim()
            .to_owned()
    }

    /// A probe in statement position. Java needs the semicolon; Kotlin's
    /// newline-terminated statements do not mind one either way, and writing
    /// it keeps a probe and the statement it precedes on one line so neither
    /// moves the other's reported position.
    fn store(&mut self, at: usize, probe: u64) {
        self.edit(at, 100, format!("{HITS}[{probe}] = 2; "));
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
        // A contract has to stay the first statement, so the probe that
        // records the function being entered goes after it instead of before.
        let mut after_contract = false;
        let at = match kind {
            PointKind::Function => match body_block(node, self.language) {
                Some(body) => match opening_contract(body, self.source, self.language) {
                    Some(contract) => {
                        after_contract = true;
                        contract.end_byte()
                    }
                    None => body.start_byte() + 1,
                },
                // An expression-bodied Kotlin function has no block to open.
                // Its expression is still measured; the function itself simply
                // has nowhere to record being entered.
                None => return,
            },
            PointKind::Statement => node.start_byte(),
        };
        let probe = self.probe(target, at);
        if after_contract {
            // Kotlin separates statements by newline, and this one follows the
            // contract on its own line, so it needs the semicolon written.
            self.edit(at, 100, format!("; {HITS}[{probe}] = 2;"));
        } else {
            self.store(at, probe);
        }
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
        let index = self.decision_base as usize + self.widths.len();
        self.widths.push(leaves.len().min(64) as u8);
        for (position, leaf) in leaves.iter().enumerate() {
            // Java and Kotlin both evaluate an argument only when the call is
            // reached, so a wrapped right-hand operand runs exactly when the
            // unwrapped one would have.
            self.edit(
                leaf.start_byte(),
                20,
                format!("{RUNTIME_CLASS}.c({index}, {position}, "),
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
        Some(index)
    }

    /// Give a branch arm somewhere to record itself.
    ///
    /// `if (x) return;` has no block, so a probe before the statement would
    /// leave it outside the `if` entirely: it would run unconditionally while
    /// the return stayed guarded, and the report would claim the arm was
    /// taken. Braces are the only honest fix.
    ///
    /// The arm also needs its own point. Walking never reaches it, because a
    /// statement is recognised by its parent being a block and this one's
    /// parent is the branch.
    /// Record which way a branch went from inside its arms, for a condition
    /// that cannot be wrapped.
    ///
    /// An `if` with no `else` has nowhere to record being false, so one is
    /// added holding nothing but the probe. An empty else changes no
    /// behaviour: it is the branch the program already took.
    fn record_arms(&mut self, node: Node, language: JvmLanguage, probes: &[u64]) {
        let (consequence, alternative) = arms(node, language);
        for (arm, probe) in [consequence, alternative].into_iter().zip(probes) {
            match arm {
                // `ensure_block` has already braced an unbraced arm, and a
                // store ranked above that brace lands inside it.
                Some(arm) if arm.kind() == "block" => self.store(arm.start_byte() + 1, *probe),
                Some(arm) => self.store(arm.start_byte(), *probe),
                // Ranked above the brace `ensure_block` may have added at
                // this same offset. Edits at one offset are applied highest
                // rank first and each pushes the last to the right, so a
                // lower rank here would put the `else` inside the braces
                // rather than after them -- which is what an unbraced arm on
                // one line produced, and it is not Kotlin.
                None => self.edit(
                    node.end_byte(),
                    70,
                    format!(" else {{ {HITS}[{probe}] = 2; }}"),
                ),
            }
        }
    }

    fn ensure_block(&mut self, node: Node) {
        if node.kind() == "block" {
            return;
        }
        self.edit(node.start_byte(), 60, "{ ".to_owned());
        self.edit(node.end_byte(), 60, " }".to_owned());
        if is_statement(node, self.source, self.language) {
            // Ranked above the brace so that applying right to left leaves the
            // brace outermost and the probe within it.
            self.add_point(node, PointKind::Statement, None);
        }
    }
}

/// The block a function's statements live in, if it has one.
///
/// Java names the field; Kotlin's grammar does not. It puts an unnamed
/// `function_body` between the declaration and the block, so asking for the
/// `body` field there answers nothing and every Kotlin function goes
/// unmeasured — silently, because a function with no block is a real thing in
/// Kotlin and the caller treats the absence as one.
fn body_block<'t>(node: Node<'t>, language: JvmLanguage) -> Option<Node<'t>> {
    let body = node.child_by_field_name("body").or_else(|| {
        let mut cursor = node.walk();
        node.children(&mut cursor)
            .find(|child| matches!(child.kind(), "function_body" | "block"))
    })?;
    match language {
        JvmLanguage::Java => (body.kind() == "block").then_some(body),
        JvmLanguage::Kotlin => {
            if body.kind() == "block" {
                return Some(body);
            }
            let mut cursor = body.walk();
            body.children(&mut cursor)
                .find(|child| child.kind() == "block")
        }
    }
}

/// Flatten a boolean expression into its independent conditions.
///
/// `&&` and `||` are the only short-circuiting operators either language has,
/// so they are the only ones that split a decision. `!` negates a condition
/// rather than introducing one, and parentheses are transparent. Java's
/// non-short-circuiting `&` and `|` deliberately do not split: both operands
/// always run, so neither can independently affect the outcome in the sense
/// MC/DC means.
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

/// The `contract { ... }` a Kotlin function body may open with.
///
/// Kotlin requires a contract to be the *first* statement of its function --
/// "Contract should be the first statement" is an error, not a warning -- so a
/// probe written at the top of the body stops the function compiling, and
/// moshi's `knownNotNull` is exactly that shape. The function probe goes after
/// the contract instead, which records the same event: a contract block is
/// erased before bytecode and cannot throw, so reaching it and reaching the
/// statement after it cannot come apart. For the same reason the contract
/// takes no statement obligation of its own -- it is a declaration the
/// compiler reads, not code that runs.
fn opening_contract<'tree>(
    body: Node<'tree>,
    source: &str,
    language: JvmLanguage,
) -> Option<Node<'tree>> {
    if language != JvmLanguage::Kotlin {
        return None;
    }
    let mut cursor = body.walk();
    let first = body.children(&mut cursor).find(|child| child.is_named())?;
    if first.kind() != "call_expression" {
        return None;
    }
    let callee = first.child(0)?;
    (source[callee.byte_range()].trim() == "contract").then_some(first)
}

/// Whether this node *is* the contract its block opens with.
fn is_opening_contract(node: Node, source: &str, language: JvmLanguage) -> bool {
    node.parent()
        .and_then(|parent| opening_contract(parent, source, language))
        .is_some_and(|contract| contract.id() == node.id())
}

/// Whether the compiler has to see this condition to compile the code around
/// it.
///
/// Some conditions are not only values: the compiler reads them and narrows a
/// type in the branch that follows. Java's pattern `instanceof` binds a name
/// whose scope is decided by flow analysis; Kotlin's `is` and its null
/// comparisons produce smart casts. Wrapping such a condition in a call leaves
/// an ordinary boolean expression, the narrowing never happens, and the code
/// after it stops compiling -- `cannot find symbol: variable s`, `unresolved
/// reference on receiver of type Any?`.
///
/// This is not a corner. Pattern `instanceof` is how Java has been written
/// since 16, and `x != null` guards a great deal of Kotlin.
fn narrows_a_type(node: Node, source: &str, language: JvmLanguage) -> bool {
    let narrows = match language {
        // A binding gives the pattern a name to scope; without one the
        // condition is an ordinary value. Java spells a binding two ways: a
        // trailing name (`o instanceof String s`) and a record pattern, which
        // deconstructs into names of its own (`o instanceof R(int a)`) and
        // carries no name field at all.
        JvmLanguage::Java => {
            node.kind() == "instanceof_expression"
                && (node.child_by_field_name("name").is_some() || {
                    let mut cursor = node.walk();
                    node.children(&mut cursor)
                        .any(|child| child.kind().ends_with("_pattern"))
                })
        }
        JvmLanguage::Kotlin => {
            node.kind() == "is_expression"
                || (node.kind() == "binary_expression"
                    && matches!(
                        node.child_by_field_name("operator")
                            .map(|operator| source[operator.byte_range()].trim())
                            .unwrap_or_default(),
                        "==" | "!="
                    )
                    && ["left", "right"].iter().any(|side| {
                        node.child_by_field_name(side)
                            .is_some_and(|side| source[side.byte_range()].trim() == "null")
                    }))
        }
    };
    if narrows {
        return true;
    }
    let mut cursor = node.walk();
    node.children(&mut cursor)
        .filter(Node::is_named)
        .any(|child| narrows_a_type(child, source, language))
}

/// An `if`'s two arms.
///
/// Java names them; Kotlin's grammar does not, so there they are the named
/// children either side of the `else` keyword. Asking Kotlin for a field it
/// has no name for answers nothing, which silently left its unbraced arms
/// unmeasured and, worse, made a branch recorded from its arms write two
/// `else` blocks onto one `if`.
fn arms<'t>(node: Node<'t>, language: JvmLanguage) -> (Option<Node<'t>>, Option<Node<'t>>) {
    match language {
        JvmLanguage::Java => (
            node.child_by_field_name("consequence"),
            node.child_by_field_name("alternative"),
        ),
        JvmLanguage::Kotlin => {
            let condition = node
                .child_by_field_name("condition")
                .map(|c| c.byte_range());
            let mut cursor = node.walk();
            let children = node.children(&mut cursor).collect::<Vec<_>>();
            let otherwise = children.iter().position(|child| child.kind() == "else");
            let arm = |child: &&Node<'t>| child.is_named() && Some(child.byte_range()) != condition;
            (
                children
                    .iter()
                    .take(otherwise.unwrap_or(children.len()))
                    .find(arm)
                    .copied(),
                otherwise.and_then(|at| children.iter().skip(at + 1).find(arm).copied()),
            )
        }
    }
}

/// The expression inside `if (...)`. Java parenthesises its condition; Kotlin
/// does not.
fn condition_of<'t>(node: Node<'t>, language: JvmLanguage) -> Option<Node<'t>> {
    let condition = node.child_by_field_name("condition")?;
    if language == JvmLanguage::Java && condition.kind() == "parenthesized_expression" {
        let mut cursor = condition.walk();
        return condition
            .children(&mut cursor)
            .find(|child| child.is_named());
    }
    Some(condition)
}

pub fn build_jvm_obligations(
    file: &str,
    source: &str,
    language: JvmLanguage,
    next_probe: &mut u64,
    next_decision: &mut u32,
) -> Result<JvmFileObligations, JvmInstrumenterError> {
    let tree = parse(source, language)?;
    let decision_base = *next_decision;
    let mut collector = Collector {
        file,
        source,
        language,
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
    walk(&mut collector, tree.root_node());
    *next_decision += collector.widths.len() as u32;
    Ok(JvmFileObligations {
        manifest: CoverageManifest {
            decisions: collector.decisions,
            points: collector.points,
            branches: collector.branches,
            limitations: collector.limitations,
            unmeasured: Vec::new(),
            scope: None,
        },
        probes: collector.probes,
        edits: collector.edits,
        decision_widths: collector.widths,
    })
}

fn walk(collector: &mut Collector, node: Node) {
    let language = collector.language;
    match node.kind() {
        "method_declaration" | "constructor_declaration" | "function_declaration" => {
            let label = node
                .child_by_field_name("name")
                .map(|name| collector.source[name.byte_range()].to_owned());
            collector.add_point(node, PointKind::Function, label);
        }
        "if_statement" | "if_expression" => {
            if let Some(condition) = condition_of(node, language) {
                let probes = collector.add_branch(node, "if", &["true", "false"]);
                // An arm written without braces has nowhere to record itself.
                let (consequence, alternative) = arms(node, language);
                for arm in [consequence, alternative].into_iter().flatten() {
                    collector.ensure_block(arm);
                }
                if narrows_a_type(condition, collector.source, language) {
                    // The condition stays exactly as written, and the branch is
                    // recorded from inside the arms instead. Which way it went
                    // is still measured; only the vectors are lost, because
                    // those need the operands wrapped.
                    collector.record_arms(node, language, &probes);
                    let limitation = collector.limitation_id(node, "condition-narrows-a-type");
                    collector.limitations.push(serde_json::json!({
                        "id": limitation,
                        "kind": "condition-narrows-a-type",
                        "file": collector.file,
                        "source": collector.text(node),
                        "line": collector.position(node).0,
                        "column": collector.position(node).1,
                        "reason": "the compiler reads this condition to narrow a type in the branch below it, so observing its operands would stop the code compiling; the branch is recorded from its arms and carries no condition vectors",
                    }));
                    return;
                }
                let decision = collector.add_decision(condition, "if");
                let wrapper = match decision {
                    Some(index) => {
                        format!("{RUNTIME_CLASS}.bd({}, {}, {index}, ", probes[0], probes[1])
                    }
                    None => format!("{RUNTIME_CLASS}.b({}, {}, ", probes[0], probes[1]),
                };
                collector.edit(condition.start_byte(), 5, wrapper);
                collector.edit(condition.end_byte(), 5, ")".to_owned());
            }
        }
        "while_statement" | "for_statement" | "do_statement" | "do_while_statement" => {
            match node.child_by_field_name("condition") {
                Some(condition) => {
                    let inner = if language == JvmLanguage::Java
                        && condition.kind() == "parenthesized_expression"
                    {
                        let mut cursor = condition.walk();
                        condition
                            .children(&mut cursor)
                            .find(|child| child.is_named())
                            .unwrap_or(condition)
                    } else {
                        condition
                    };
                    // `while (true)` is not an ordinary condition. The Java
                    // compiler treats a constant one specially: it knows the
                    // loop never completes, so a method whose body is one
                    // needs no return after it. Wrapping the constant in a
                    // call makes it an ordinary boolean expression, the
                    // compiler decides the loop can exit, and the method stops
                    // compiling for want of a return it never needed.
                    //
                    // There is nothing to measure there either. A condition
                    // that can only go one way is an obligation no test could
                    // ever half-satisfy, so leaving it alone is the more
                    // accurate answer as well as the only compiling one.
                    if matches!(
                        collector.source[inner.byte_range()].trim(),
                        "true" | "false"
                    ) {
                        let (line, column) = collector.position(node);
                        let limitation =
                            collector.limitation_id(node, "loop-with-constant-condition");
                        collector.limitations.push(serde_json::json!({
                            "id": limitation,
                            "kind": "loop-with-constant-condition",
                            "file": collector.file,
                            "source": collector.text(node),
                            "line": line,
                            "column": column,
                            "reason": "a loop whose condition is a constant can only go one way, and wrapping it would change what the compiler knows about the code around it",
                        }));
                    } else if narrows_a_type(inner, collector.source, language) {
                        // A loop condition narrows types too. `while (node !=
                        // null)` is how a great deal of Kotlin walks a
                        // structure, and the body below it reads `node` as
                        // non-null. An `if` survives this because its arms can
                        // carry the probes instead; a loop has only the one
                        // arm, and no place to record the exit that a `break`
                        // would not also reach. So the condition is left
                        // exactly as written and the loop carries no branch
                        // obligation, rather than one no test could close.
                        let (line, column) = collector.position(node);
                        let limitation = collector.limitation_id(node, "condition-narrows-a-type");
                        collector.limitations.push(serde_json::json!({
                            "id": limitation,
                            "kind": "condition-narrows-a-type",
                            "file": collector.file,
                            "source": collector.text(node),
                            "line": line,
                            "column": column,
                            "reason": "the compiler reads this loop condition to narrow a type in the body below it, so observing its operands would stop the code compiling; the loop carries no branch obligation and its body is measured by its statements",
                        }));
                    } else {
                        let probes = collector.add_branch(node, "loop", &["true", "false"]);
                        let decision = collector.add_decision(inner, "loop");
                        let wrapper = match decision {
                            Some(index) => format!(
                                "{RUNTIME_CLASS}.bd({}, {}, {index}, ",
                                probes[0], probes[1]
                            ),
                            None => format!("{RUNTIME_CLASS}.b({}, {}, ", probes[0], probes[1]),
                        };
                        collector.edit(inner.start_byte(), 5, wrapper);
                        collector.edit(inner.end_byte(), 5, ")".to_owned());
                    }
                }
                None => {
                    let (line, column) = collector.position(node);
                    let limitation = collector.limitation_id(node, "loop-without-condition");
                    collector.limitations.push(serde_json::json!({
                        "id": limitation,
                        "kind": "loop-without-condition",
                        "file": collector.file,
                        "source": collector.text(node),
                        "line": line,
                        "column": column,
                        "reason": "a for-each or unconditional loop has no condition to observe, so no branch obligation is recorded for it",
                    }));
                }
            }
            if let Some(body) = node.child_by_field_name("body") {
                collector.ensure_block(body);
            }
        }
        "enhanced_for_statement" => {
            let (line, column) = collector.position(node);
            let limitation = collector.limitation_id(node, "loop-without-condition");
            collector.limitations.push(serde_json::json!({
                "id": limitation,
                "kind": "loop-without-condition",
                "file": collector.file,
                "source": collector.text(node),
                "line": line,
                "column": column,
                "reason": "a for-each loop has no condition to observe, so no branch obligation is recorded for it",
            }));
            if let Some(body) = node.child_by_field_name("body") {
                collector.ensure_block(body);
            }
        }
        _ if in_statement_position(node, language)
            && is_statement(node, collector.source, language)
            && !is_opening_contract(node, collector.source, language) =>
        {
            collector.add_point(node, PointKind::Statement, None);
        }
        _ => {}
    }
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        if child.is_named() {
            walk(collector, child);
        }
    }
}

fn is_statement(node: Node, source: &str, language: JvmLanguage) -> bool {
    match language {
        JvmLanguage::Java => is_java_statement(node.kind()),
        JvmLanguage::Kotlin => is_kotlin_statement(node, source),
    }
}

/// Whether a probe may be placed before this node.
///
/// Both languages have slots that hold a statement but are not statement
/// positions — a `for` loop's initialiser and update, a resource in
/// `try-with-resources`. A probe there does not compile. Everything that is
/// genuinely a statement is a child of a block or a switch group, so that is
/// the rule rather than a list of exceptions to remember.
fn in_statement_position(node: Node, _language: JvmLanguage) -> bool {
    node.parent().is_some_and(|parent| {
        matches!(
            parent.kind(),
            "block" | "statements" | "switch_block_statement_group" | "constructor_body"
        )
    })
}

/// Apply edits right to left so earlier offsets stay valid.
pub fn rewrite(source: &str, edits: &[GoEdit]) -> String {
    crate::go_instrumenter::rewrite(source, edits)
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

    /// A file that does not parse has to say where, or nobody can act on it.
    /// square/moshi's JsonReader.kt is this shape: nine hundred lines, and a
    /// nested class whose primary constructor is written on the line after its
    /// name, which tree-sitter-kotlin-ng 1.1.0 does not accept. The message
    /// said "source does not parse" and left the reader to find it.
    #[test]
    fn a_file_that_does_not_parse_says_where() {
        const NESTED: &str = r#"package app

class Outer {
  public class Options
  private constructor(
    internal val strings: Array<out String>,
  ) {
  }
}
"#;
        let message = parse(NESTED, JvmLanguage::Kotlin)
            .expect_err("does not parse")
            .to_string();
        // Where the parser gave up, and how far it gave up for -- a class it
        // could not read is not a one-line problem, and saying "line 3" alone
        // reads as though it were.
        assert!(message.contains("line 3"), "{message}");
        // The extent is tree-sitter's own account of how far it recovered, so
        // the test holds that a range is given rather than pinning its end.
        assert!(message.contains("through line "), "{message}");
        assert!(message.contains("class Outer"), "{message}");

        // An error inside an otherwise valid file is named where it is,
        // which is the case a reader meets most often.
        let local = "class A {\n    fun f(): Int {\n        return 1 )\n    }\n}\n";
        let message = parse(local, JvmLanguage::Kotlin)
            .expect_err("does not parse")
            .to_string();
        assert!(message.contains("line 3"), "{message}");
    }

    #[test]
    fn every_limitation_carries_what_the_index_stores() {
        const JAVA: &str = r#"class Every {
    int walk(java.util.List<Object> items) {
        int sum = 0;
        for (Object item : items) {
            if (item instanceof Integer value) {
                sum += value;
            }
        }
        for (;;) {
            break;
        }
        while (true) {
            break;
        }
        return sum;
    }
}
"#;
        let (obligations, _) = java(JAVA);
        assert_eq!(
            assert_indexable(&obligations.manifest.limitations),
            [
                "condition-narrows-a-type",
                "loop-with-constant-condition",
                "loop-without-condition"
            ]
        );

        const KOTLIN: &str = r#"fun walk(items: List<Any>, head: Any?): Int {
    var sum = 0
    for (item in items) {
        if (item is Int) {
            sum += item
        }
    }
    var node = head
    while (node != null) {
        node = null
    }
    while (true) {
        break
    }
    return sum
}
"#;
        let mut next = 0;
        let mut decisions = 0;
        let obligations = build_jvm_obligations(
            "Every.kt",
            KOTLIN,
            JvmLanguage::Kotlin,
            &mut next,
            &mut decisions,
        )
        .expect("kotlin");
        assert_eq!(
            assert_indexable(&obligations.manifest.limitations),
            [
                "condition-narrows-a-type",
                "loop-with-constant-condition",
                "loop-without-condition"
            ]
        );
    }

    fn java(source: &str) -> (JvmFileObligations, String) {
        let mut next = 0;
        let mut decisions = 0;
        let obligations = build_jvm_obligations(
            "X.java",
            source,
            JvmLanguage::Java,
            &mut next,
            &mut decisions,
        )
        .expect("java");
        let out = rewrite(source, &obligations.edits);
        parse(&out, JvmLanguage::Java)
            .unwrap_or_else(|error| panic!("rewritten Java does not parse: {error}\n{out}"));
        (obligations, out)
    }

    const SAMPLE: &str = r#"class Classify {
    String classify(int a, boolean b) {
        if (a > 10 && b) {
            return "big";
        }
        for (int i = 0; i < a; i++) {
            System.out.print(i);
        }
        return "small";
    }
}
"#;

    #[test]
    fn a_short_circuiting_operator_splits_a_decision_and_a_bitwise_one_does_not() {
        // `&` and `|` evaluate both operands always, so neither can
        // independently affect the outcome in the sense MC/DC means. Counting
        // them would put obligations in the denominator no test could satisfy.
        let (short_circuit, _) = java(SAMPLE);
        assert_eq!(
            short_circuit.manifest.decisions[0].conditions,
            ["a > 10", "b"]
        );

        let (bitwise, _) = java(
            "class X { boolean f(boolean a, boolean b) { if (a & b) { return true; } return false; } }",
        );
        assert!(
            bitwise.manifest.decisions.is_empty(),
            "{:?}",
            bitwise.manifest.decisions
        );
    }

    #[test]
    fn an_arm_written_without_braces_gets_them() {
        // `if (x) return;` has no block, so a probe before the statement would
        // sit outside the `if`: it would run unconditionally while the return
        // stayed guarded, and the report would claim the arm was taken.
        let (_, out) = java("class X { int f(int a) { if (a > 1) return 1; else return 2; } }");
        assert!(out.contains("{ "), "{out}");
        let guarded = out.find("return 1").expect("consequence");
        let opened = out[..guarded].rfind('{').expect("a brace before it");
        let probe = out[..guarded].rfind("HITS[").expect("a probe before it");
        assert!(
            opened < probe,
            "the probe must be inside the braces:\n{out}"
        );
    }

    #[test]
    fn a_probe_never_lands_where_java_forbids_a_statement() {
        // A `for` loop's initialiser and update hold statements but are not
        // statement positions, and try-with-resources holds declarations.
        let (_, out) = java(
            "import java.io.*;\nclass X { void f(int a) throws Exception { for (int i = 0; i < a; i++) { g(); } try (Reader r = open()) { g(); } } void g() {} Reader open() { return null; } }",
        );
        assert!(
            !out.contains("for (com.supercorp"),
            "probe in a for initialiser:\n{out}"
        );
        assert!(
            !out.contains("try (com.supercorp"),
            "probe in a resource:\n{out}"
        );
    }

    #[test]
    fn a_for_each_loop_records_a_limitation_not_an_obligation() {
        // There is no condition to observe. Declaring a branch nothing can
        // measure would put an obligation in the denominator no test could
        // ever satisfy.
        let (obligations, _) =
            java("class X { void f(int[] xs) { for (int x : xs) { g(x); } } void g(int x) {} }");
        assert!(
            obligations
                .manifest
                .branches
                .iter()
                .all(|b| b.kind != "loop")
        );
        assert_eq!(obligations.manifest.limitations.len(), 1);
        assert_eq!(
            obligations.manifest.limitations[0]["kind"],
            "loop-without-condition"
        );
    }

    #[test]
    fn kotlin_shares_the_model_and_differs_where_it_must() {
        // Kotlin's `if` is an expression and its condition is not
        // parenthesised, so the wrapper has to find a different child.
        let source = "fun f(a: Int, b: Boolean): String {\n    if (a > 10 && b) {\n        return \"big\"\n    }\n    return \"small\"\n}\n";
        let mut next = 0;
        let mut decisions = 0;
        let obligations = build_jvm_obligations(
            "X.kt",
            source,
            JvmLanguage::Kotlin,
            &mut next,
            &mut decisions,
        )
        .expect("kotlin");
        assert_eq!(
            obligations.manifest.decisions[0].conditions,
            ["a > 10", "b"]
        );
        let out = rewrite(source, &obligations.edits);
        parse(&out, JvmLanguage::Kotlin)
            .unwrap_or_else(|error| panic!("rewritten Kotlin does not parse: {error}\n{out}"));
        assert!(out.contains(".bd("), "{out}");
        assert!(
            out.contains(".c(0, 0, ") && out.contains(".c(0, 1, "),
            "{out}"
        );
    }

    #[test]
    fn decisions_are_numbered_across_the_project_not_within_a_file() {
        // The runtime holds one decision-state array for the whole run, so an
        // index meaning "the first decision in this file" would land on every
        // other file's first decision: two classes would share condition
        // state, and the vectors both produced would describe neither.
        let mut next = 0;
        let mut decisions = 0;
        let java = build_jvm_obligations(
            "A.java",
            "class A { static boolean f(boolean x, boolean y) { if (x && y) { return true; } return false; } }",
            JvmLanguage::Java,
            &mut next,
            &mut decisions,
        )
        .unwrap();
        let kotlin = build_jvm_obligations(
            "B.kt",
            "fun g(x: Boolean, y: Boolean): Boolean {\n    if (x || y) {\n        return true\n    }\n    return false\n}\n",
            JvmLanguage::Kotlin,
            &mut next,
            &mut decisions,
        )
        .unwrap();

        let referenced = |obligations: &JvmFileObligations| {
            obligations
                .edits
                .iter()
                .filter_map(|edit| {
                    let at = edit.text.find(".c(")?;
                    edit.text[at + 3..]
                        .split(',')
                        .next()?
                        .trim()
                        .parse::<u32>()
                        .ok()
                })
                .collect::<std::collections::BTreeSet<_>>()
        };
        assert_eq!(referenced(&java), [0].into());
        assert_eq!(referenced(&kotlin), [1].into());
        assert_eq!(decisions, 2, "the project numbered two decisions in all");
        assert_eq!(java.decision_widths, [2]);
        assert_eq!(kotlin.decision_widths, [2]);
    }

    #[test]
    fn kotlin_statements_are_the_kinds_the_grammar_produces() {
        // Everything in Kotlin is an expression, so the grammar's names are
        // not the language's vocabulary: a `return` is a return_expression,
        // a `y--` is a unary_expression, and `break` and `continue` get no
        // kind of their own at all and arrive as identifiers. A list written
        // from the language reference misses all of them, and a function of
        // nothing but returns measures as having no statements.
        let source = "fun f(xs: List<Int>, a: Int): Int {\n    var y = a\n    y = y + 1\n    y--\n    for (i in xs) {\n        if (i == 1) { continue }\n        if (i == 2) { break }\n    }\n    try { println(y) } catch (e: Exception) { throw e }\n    return y\n}\n";
        let mut next = 0;
        let mut decisions = 0;
        let obligations = build_jvm_obligations(
            "f.kt",
            source,
            JvmLanguage::Kotlin,
            &mut next,
            &mut decisions,
        )
        .expect("obligations");

        // The rewritten source still parses, which is what says the probes
        // went somewhere Kotlin accepts.
        let rewritten = rewrite(source, &obligations.edits);
        parse(&rewritten, JvmLanguage::Kotlin)
            .unwrap_or_else(|error| panic!("{error}\n{rewritten}"));

        let lines = obligations
            .manifest
            .points
            .iter()
            .map(|point| point.line)
            .collect::<std::collections::BTreeSet<_>>();
        // A loop is a branch rather than a point, in both languages: what
        // matters about it is which way it went, and its body's statements
        // are measured on their own.
        for (line, what) in [
            (1, "the function itself"),
            (2, "var y = a"),
            (3, "y = y + 1"),
            (4, "y--"),
            (6, "if/continue"),
            (7, "if/break"),
            (9, "try/throw"),
            (10, "return"),
        ] {
            assert!(
                lines.contains(&line),
                "{what} on line {line} is unmeasured: {lines:?}"
            );
        }
    }

    #[test]
    fn a_loop_on_a_constant_keeps_what_the_compiler_knows() {
        // `while (true)` is how Java writes a loop that never completes, and
        // the compiler treats the constant specially: a method whose body is
        // one needs no return after it. Wrapping the constant in a call makes
        // it an ordinary boolean expression, the compiler decides the loop can
        // exit, and the method stops compiling for want of a return it never
        // needed. There is nothing to measure there in any case.
        let source = "class X {\n  String f() {\n    while (true) {\n      if (g()) { return \"a\"; }\n    }\n  }\n  boolean g() { return true; }\n}";
        let mut next = 0;
        let mut decisions = 0;
        let obligations = build_jvm_obligations(
            "X.java",
            source,
            JvmLanguage::Java,
            &mut next,
            &mut decisions,
        )
        .expect("obligations");
        let rewritten = rewrite(source, &obligations.edits);
        assert!(
            rewritten.contains("while (true)"),
            "the constant must survive untouched:\n{rewritten}"
        );
        // The `if` beside it is still measured, so this is a narrow exception
        // rather than a loop nobody looks at.
        assert!(
            obligations
                .manifest
                .branches
                .iter()
                .any(|branch| branch.kind == "if"),
            "{:?}",
            obligations.manifest.branches
        );
        assert!(
            !obligations
                .manifest
                .branches
                .iter()
                .any(|branch| branch.kind == "loop"),
            "a condition that can only go one way is not an obligation: {:?}",
            obligations.manifest.branches
        );
        assert!(
            obligations
                .manifest
                .limitations
                .iter()
                .any(|limitation| limitation["kind"] == "loop-with-constant-condition"),
            "{:?}",
            obligations.manifest.limitations
        );
    }
}
