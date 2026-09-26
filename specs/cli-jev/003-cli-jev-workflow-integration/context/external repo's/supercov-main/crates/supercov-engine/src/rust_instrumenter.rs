//! Supercov-owned Rust parsing and obligation discovery.
//!
//! The first private frontend deliberately starts from a lossless concrete
//! syntax tree. LLVM/rustc coverage remains a development oracle; it is not a
//! product input. Probe insertion and Cargo execution build on this exact
//! source denominator.

use std::collections::BTreeSet;

use ra_ap_syntax::{
    AstNode, Edition, SourceFile, SyntaxKind, TextRange,
    ast::{self, BinaryOp, HasAttrs, HasLoopBody, HasName, LogicOp},
};
use serde_json::json;
use sha2::{Digest, Sha256};

use crate::{
    coverage_analysis::PointKind,
    coverage_report::{
        BranchAlternativeMeta, BranchMeta, CoverageManifest, DecisionMeta, PointMeta,
    },
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustInstrumenterError {
    SourceTooLarge,
    Parse(Vec<String>),
    InvalidRange,
    InvalidRuntimePath,
}

impl std::fmt::Display for RustInstrumenterError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::SourceTooLarge => write!(formatter, "Rust source exceeds the parser range"),
            Self::Parse(errors) => write!(formatter, "Rust parse failed: {}", errors.join("; ")),
            Self::InvalidRange => write!(formatter, "Rust parser returned an invalid range"),
            Self::InvalidRuntimePath => write!(formatter, "invalid generated Rust runtime path"),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct RustInstrumentedSource {
    pub code: String,
    pub manifest: CoverageManifest,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum InsertionKind {
    End,
    Direct,
    Start,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct Insertion {
    offset: usize,
    kind: InsertionKind,
    scope_len: usize,
    rank: usize,
    text: String,
}

fn valid_runtime_path(path: &str) -> bool {
    let mut parts = path.split("::");
    if !matches!(parts.next(), Some("crate")) {
        return false;
    }
    let parts = parts.collect::<Vec<_>>();
    !parts.is_empty()
        && parts.into_iter().all(|part| {
            !part.is_empty()
                && part.bytes().enumerate().all(|(index, byte)| {
                    byte == b'_'
                        || byte.is_ascii_alphabetic()
                        || (index > 0 && byte.is_ascii_digit())
                })
        })
}

/// Report whether rustc will evaluate this node at compile time.
///
/// Runtime probes cannot appear anywhere this is true: `condition`, `decision`
/// and `hit` are not `const fn`, so emitting a call here is not a bad
/// measurement but a build failure (E0015). bytes-1.12.1 hit exactly that with
/// `const ITERS: usize = if cfg!(miri) { 100 } else { 1_000 };`.
///
/// `ConstArg` is the shared node for enum discriminants, array lengths, const
/// generic arguments and const parameter defaults, so matching it covers all
/// four. The remaining case is an array repeat expression, `[value; count]`,
/// where only the count after the semicolon is const-evaluated.
/// Report whether the source's doc comments contain a fenced code block.
///
/// rustdoc turns fenced blocks in `///`, `//!` and `#[doc]` text into doctest
/// crates. The scan is line-based and deliberately coarse: a fence inside a
/// doc comment declares the limitation even when the fence is `ignore`d, which
/// over-declares the unmeasured surface rather than ever under-declaring it.
fn in_const_context(node: &ra_ap_syntax::SyntaxNode) -> bool {
    let start = node.text_range().start();
    node.ancestors().any(|ancestor| {
        ast::Fn::cast(ancestor.clone()).is_some_and(|function| function.const_token().is_some())
            || ast::BlockExpr::cast(ancestor.clone())
                .is_some_and(|block| block.const_token().is_some())
            || ast::Const::can_cast(ancestor.kind())
            || ast::Static::can_cast(ancestor.kind())
            || ast::ConstArg::can_cast(ancestor.kind())
            || ast::ArrayExpr::cast(ancestor).is_some_and(|array| {
                array
                    .semicolon_token()
                    .is_some_and(|semicolon| start >= semicolon.text_range().end())
            })
    })
}

/// Report whether this node sits inside a `GlobalAlloc` implementation.
///
/// The probe runtime allocates, so a probe inside `alloc` calls back into
/// `alloc`, which probes again, until the stack is gone. bytes-1.12.1's
/// tests/test_bytes_odd_alloc.rs installs a `#[global_allocator]`, and the
/// instrumented binary died with SIGSEGV before libtest could even list its
/// tests -- while the uninstrumented one listed them fine.
///
/// The general rule this enforces is that nothing the runtime itself calls can
/// carry a probe, and `#[global_allocator]` is the one way a user crate gets
/// onto that path. A `GlobalAlloc` impl is skipped whether or not it is the
/// registered allocator, because the registering `static` may live in another
/// file: declining a handful of allocator bodies costs almost no exactness,
/// while instrumenting the live one costs the whole run.
fn in_global_allocator(node: &ra_ap_syntax::SyntaxNode) -> bool {
    node.ancestors().any(|ancestor| {
        ast::Impl::cast(ancestor).is_some_and(|block| {
            block.trait_().is_some_and(|implemented| {
                implemented
                    .syntax()
                    .descendants_with_tokens()
                    .filter_map(|element| element.into_token())
                    .any(|token| token.kind() == SyntaxKind::IDENT && token.text() == "GlobalAlloc")
            })
        })
    })
}

/// Report whether this `impl` block implements `GlobalAlloc`.
fn in_global_allocator_impl(node: &ra_ap_syntax::SyntaxNode) -> bool {
    ast::Impl::cast(node.clone()).is_some_and(|block| {
        block.trait_().is_some_and(|implemented| {
            implemented
                .syntax()
                .descendants_with_tokens()
                .filter_map(|element| element.into_token())
                .any(|token| token.kind() == SyntaxKind::IDENT && token.text() == "GlobalAlloc")
        })
    })
}

/// Report whether a probe placed at this node could not run correctly.
fn cannot_carry_probe(node: &ra_ap_syntax::SyntaxNode) -> bool {
    in_const_context(node) || in_global_allocator(node)
}

fn range_offsets(range: TextRange) -> (usize, usize) {
    (usize::from(range.start()), usize::from(range.end()))
}

fn push_wrapper(
    insertions: &mut Vec<Insertion>,
    range: TextRange,
    scope: TextRange,
    rank: usize,
    prefix: String,
    suffix: String,
) {
    let (start, end) = range_offsets(range);
    let (scope_start, scope_end) = range_offsets(scope);
    let scope_len = scope_end - scope_start;
    insertions.push(Insertion {
        offset: start,
        kind: InsertionKind::Start,
        scope_len,
        rank,
        text: prefix,
    });
    insertions.push(Insertion {
        offset: end,
        kind: InsertionKind::End,
        scope_len,
        rank,
        text: suffix,
    });
}

fn push_direct(insertions: &mut Vec<Insertion>, offset: usize, text: String) {
    insertions.push(Insertion {
        offset,
        kind: InsertionKind::Direct,
        scope_len: 0,
        rank: 0,
        text,
    });
}

fn apply_insertions(
    source: &str,
    mut insertions: Vec<Insertion>,
) -> Result<String, RustInstrumenterError> {
    if insertions
        .iter()
        .any(|edit| edit.offset > source.len() || !source.is_char_boundary(edit.offset))
    {
        return Err(RustInstrumenterError::InvalidRange);
    }
    insertions.sort_by(|left, right| {
        left.offset.cmp(&right.offset).then_with(|| {
            let kind_order = |kind: InsertionKind| match kind {
                InsertionKind::End => 0,
                InsertionKind::Direct => 1,
                InsertionKind::Start => 2,
            };
            kind_order(left.kind)
                .cmp(&kind_order(right.kind))
                .then_with(|| match left.kind {
                    InsertionKind::End => left
                        .scope_len
                        .cmp(&right.scope_len)
                        .then_with(|| right.rank.cmp(&left.rank)),
                    InsertionKind::Direct => std::cmp::Ordering::Equal,
                    InsertionKind::Start => right
                        .scope_len
                        .cmp(&left.scope_len)
                        .then_with(|| left.rank.cmp(&right.rank)),
                })
        })
    });

    let mut output = source.to_owned();
    let mut index = insertions.len();
    while index > 0 {
        let offset = insertions[index - 1].offset;
        let start = insertions[..index].partition_point(|insertion| insertion.offset < offset);
        let text = insertions[start..index]
            .iter()
            .map(|insertion| insertion.text.as_str())
            .collect::<String>();
        output.insert_str(offset, &text);
        index = start;
    }
    Ok(output)
}

/// A limitation record's ID. One record stands for one kind in one file, and
/// the protocol requires every record's ID to be unique across the manifest,
/// so the file is part of it.
fn limitation_id(kind: &str, file: &str) -> String {
    format!("{kind}#{file}")
}

fn add_manifest_limitation(manifest: &mut CoverageManifest, file: &str, id: &str, reason: &str) {
    let id = limitation_id(id, file);
    if manifest.limitations.iter().any(|limitation| {
        limitation.get("id").and_then(|value| value.as_str()) == Some(id.as_str())
    }) {
        return;
    }
    manifest.limitations.push(json!({
        "id": id,
        "kind": "source-scope",
        "file": file,
        "line": 1,
        "column": 0,
        "source": "",
        "reason": reason,
        // A shape the probes cannot reach is a boundary of the denominator,
        // not a failure to measure what is inside it.
        "blocking": false
    }));
}

fn allocate_frame_name(
    file: &str,
    condition: &ast::Expr,
    kind: &str,
    identifiers: &mut BTreeSet<String>,
) -> String {
    let id = stable_id(file, "decision", condition.syntax().text_range(), kind);
    let suffix = id.rsplit(':').next().unwrap_or("decision");
    let base = format!("__supercov_decision_{suffix}");
    let mut candidate = base.clone();
    let mut attempt = 0_usize;
    while !identifiers.insert(candidate.clone()) {
        attempt += 1;
        candidate = format!("{base}_{attempt}");
    }
    candidate
}

/// The `const` naming a match's alternative IDs. Upper case, so it raises no
/// naming lint in a crate that denies warnings.
fn allocate_table_name(
    file: &str,
    expression: &ast::MatchExpr,
    identifiers: &mut BTreeSet<String>,
) -> String {
    let id = stable_id(file, "match", expression.syntax().text_range(), "arms");
    let suffix = id
        .rsplit(':')
        .next()
        .unwrap_or("match")
        .to_ascii_uppercase();
    let base = format!("__SUPERCOV_ARMS_{suffix}");
    let mut candidate = base.clone();
    let mut attempt = 0_usize;
    while !identifiers.insert(candidate.clone()) {
        attempt += 1;
        candidate = format!("{base}_{attempt}");
    }
    candidate
}

/// The local that remembers whether a `while` loop has run its body.
fn allocate_flag_name(
    file: &str,
    expression: &ast::WhileExpr,
    identifiers: &mut BTreeSet<String>,
) -> String {
    let id = stable_id(file, "loop", expression.syntax().text_range(), "flag");
    let suffix = id.rsplit(':').next().unwrap_or("loop");
    let base = format!("__supercov_loop_{suffix}");
    let mut candidate = base.clone();
    let mut attempt = 0_usize;
    while !identifiers.insert(candidate.clone()) {
        attempt += 1;
        candidate = format!("{base}_{attempt}");
    }
    candidate
}

impl std::error::Error for RustInstrumenterError {}

struct SourceLocations<'a> {
    source: &'a str,
    line_starts: Vec<usize>,
}

impl<'a> SourceLocations<'a> {
    fn new(source: &'a str) -> Self {
        let mut line_starts = vec![0];
        line_starts.extend(
            source
                .bytes()
                .enumerate()
                .filter_map(|(index, byte)| (byte == b'\n').then_some(index + 1)),
        );
        Self {
            source,
            line_starts,
        }
    }

    fn range(&self, range: TextRange) -> Result<(usize, usize), RustInstrumenterError> {
        let start = usize::from(range.start());
        let end = usize::from(range.end());
        if start > end
            || end > self.source.len()
            || !self.source.is_char_boundary(start)
            || !self.source.is_char_boundary(end)
        {
            return Err(RustInstrumenterError::InvalidRange);
        }
        Ok((start, end))
    }

    fn line_column(&self, offset: usize) -> (usize, usize) {
        let line_index = self.line_starts.partition_point(|start| *start <= offset) - 1;
        (line_index + 1, offset - self.line_starts[line_index])
    }

    fn text(&self, range: TextRange) -> Result<String, RustInstrumenterError> {
        let (start, end) = self.range(range)?;
        Ok(self.source[start..end].trim().to_owned())
    }
}

fn stable_id(file: &str, kind: &str, range: TextRange, suffix: &str) -> String {
    let mut hash = Sha256::new();
    let start = usize::from(range.start()).to_string();
    let end = usize::from(range.end()).to_string();
    for value in [file, kind, &start, &end, suffix] {
        hash.update(value.as_bytes());
        hash.update([0]);
    }
    let digest = hash.finalize();
    let mut encoded = String::with_capacity(24);
    for byte in &digest[..12] {
        use std::fmt::Write as _;
        write!(&mut encoded, "{byte:02x}").expect("writing to a string cannot fail");
    }
    format!("rs:{kind}:{encoded}")
}

struct RustObligationCollector<'a> {
    file: &'a str,
    locations: SourceLocations<'a>,
    manifest: CoverageManifest,
    point_ids: BTreeSet<String>,
    decision_ids: BTreeSet<String>,
    branch_ids: BTreeSet<String>,
    /// Limitation kinds already declared for this file.
    site_limitations: BTreeSet<&'static str>,
    /// Where each obligation sits, so the ones no probe can reach can be
    /// declined once the whole file has been read.
    obligation_ranges: Vec<(String, TextRange)>,
    error: Option<RustInstrumenterError>,
}

impl<'a> RustObligationCollector<'a> {
    fn new(file: &'a str, source: &'a str) -> Self {
        Self {
            file,
            locations: SourceLocations::new(source),
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: Vec::new(),
                points: Vec::new(),
                branches: Vec::new(),
                limitations: Vec::new(),
                scope: None,
            },
            point_ids: BTreeSet::new(),
            decision_ids: BTreeSet::new(),
            branch_ids: BTreeSet::new(),
            site_limitations: BTreeSet::new(),
            obligation_ranges: Vec::new(),
            error: None,
        }
    }

    fn location_source(&mut self, range: TextRange) -> Option<(usize, usize, String)> {
        let result = self.locations.range(range).map(|(start, _)| {
            let (line, column) = self.locations.line_column(start);
            (line, column, self.locations.text(range))
        });
        match result {
            Ok((line, column, Ok(source))) => Some((line, column, source)),
            Ok((_, _, Err(error))) | Err(error) => {
                self.error.get_or_insert(error);
                None
            }
        }
    }

    fn point(&mut self, range: TextRange, kind: PointKind, label: Option<String>) {
        self.point_located(range, range, kind, label);
    }

    /// A point identified by `range` but reported at `location`: a function
    /// is identified by its whole node, which begins at its doc comments and
    /// attributes, and reported where the function itself starts.
    fn point_located(
        &mut self,
        range: TextRange,
        location: TextRange,
        kind: PointKind,
        label: Option<String>,
    ) {
        let kind_name = match kind {
            PointKind::Statement => "statement",
            PointKind::Function => "function",
        };
        let id = stable_id(self.file, kind_name, range, label.as_deref().unwrap_or(""));
        self.obligation_ranges.push((id.clone(), range));
        if !self.point_ids.insert(id.clone()) {
            return;
        }
        let Some((line, column, source)) = self.location_source(location) else {
            return;
        };
        self.manifest.points.push(PointMeta {
            id,
            kind,
            file: self.file.into(),
            line,
            column,
            source,
            label,
        });
    }

    fn atomic_condition_ranges(expression: &ast::Expr, ranges: &mut Vec<TextRange>) {
        match expression {
            ast::Expr::ParenExpr(paren) => {
                if let Some(inner) = paren.expr() {
                    Self::atomic_condition_ranges(&inner, ranges);
                } else {
                    ranges.push(expression.syntax().text_range());
                }
            }
            ast::Expr::BinExpr(binary)
                if matches!(
                    binary.op_kind(),
                    Some(BinaryOp::LogicOp(LogicOp::And | LogicOp::Or))
                ) =>
            {
                if let Some(left) = binary.lhs() {
                    Self::atomic_condition_ranges(&left, ranges);
                }
                if let Some(right) = binary.rhs() {
                    Self::atomic_condition_ranges(&right, ranges);
                }
            }
            _ => ranges.push(expression.syntax().text_range()),
        }
    }

    fn decision(&mut self, test: &ast::Expr, kind: &str) {
        let range = test.syntax().text_range();
        let id = stable_id(self.file, "decision", range, kind);
        self.obligation_ranges.push((id.clone(), range));
        if !self.decision_ids.insert(id.clone()) {
            return;
        }
        let Some((line, column, source)) = self.location_source(range) else {
            return;
        };
        let mut condition_ranges = Vec::new();
        Self::atomic_condition_ranges(test, &mut condition_ranges);
        let mut conditions = Vec::with_capacity(condition_ranges.len());
        for condition in condition_ranges {
            match self.locations.text(condition) {
                Ok(source) => conditions.push(source),
                Err(error) => {
                    self.error.get_or_insert(error);
                    return;
                }
            }
        }
        self.manifest.decisions.push(DecisionMeta {
            id: id.clone(),
            file: self.file.into(),
            line,
            column,
            source: source.clone(),
            conditions,
            kind: kind.into(),
        });
        self.branch_with_id(
            format!("{id}:outcome"),
            range,
            kind,
            source,
            [("true", "true"), ("false", "false")],
        );
    }

    fn branch<const N: usize>(
        &mut self,
        range: TextRange,
        kind: &str,
        alternatives: [(&str, &str); N],
    ) {
        let id = stable_id(self.file, "branch", range, kind);
        let Some((_, _, source)) = self.location_source(range) else {
            return;
        };
        self.branch_with_id(id, range, kind, source, alternatives);
    }

    fn branch_with_id<const N: usize>(
        &mut self,
        id: String,
        range: TextRange,
        kind: &str,
        source: String,
        alternatives: [(&str, &str); N],
    ) {
        self.obligation_ranges.push((id.clone(), range));
        if !self.branch_ids.insert(id.clone()) {
            return;
        }
        let Some((line, column, _)) = self.location_source(range) else {
            return;
        };
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
    }

    /// Obligations inside a region no probe can reach leave the denominator.
    /// They stay in the manifest -- the evidence files are named by a token
    /// over its obligation IDs, and the report still needs a line to hang the
    /// limitation on -- and are reported as unmeasured rather than uncovered.
    fn decline_unreachable_obligations(&mut self, root: &ra_ap_syntax::SyntaxNode) {
        // The regions themselves, not their contents: a node is unreachable
        // exactly when one of these encloses it.
        let unreachable = root
            .descendants()
            .filter(|node| {
                (ast::Fn::cast(node.clone())
                    .is_some_and(|function| function.const_token().is_some())
                    || ast::BlockExpr::cast(node.clone())
                        .is_some_and(|block| block.const_token().is_some())
                    || ast::Const::can_cast(node.kind())
                    || ast::Static::can_cast(node.kind()))
                    || ast::Impl::can_cast(node.kind()) && in_global_allocator_impl(node)
            })
            .map(|node| node.text_range())
            .collect::<Vec<_>>();
        if unreachable.is_empty() {
            return;
        }
        let mut declined = self
            .manifest
            .unmeasured
            .iter()
            .cloned()
            .collect::<BTreeSet<_>>();
        for (id, range) in &self.obligation_ranges {
            if unreachable
                .iter()
                .any(|region| region.contains_range(*range))
            {
                declined.insert(id.clone());
            }
        }
        self.manifest.unmeasured = declined.into_iter().collect();
    }

    /// One limitation for one kind in this file, at the first site it hides.
    /// The report can then point at a line, and the file listing counts it
    /// against the file it belongs to. `kind` is "source-scope", which the
    /// index knows for code outside the measured denominator; anything else
    /// it renders as "unknown".
    fn site_limitation(&mut self, id: &'static str, range: TextRange, reason: String) {
        if self.site_limitations.contains(id) {
            return;
        }
        let Some((line, column, source)) = self.location_source(range) else {
            return;
        };
        self.site_limitations.insert(id);
        // The first line of the site is enough to recognise it; a macro
        // invocation can run to dozens of lines.
        let source = source.lines().next().unwrap_or("").trim();
        let source = if source.chars().count() > 120 {
            format!("{}...", source.chars().take(117).collect::<String>())
        } else {
            source.to_owned()
        };
        self.manifest.limitations.push(json!({
            "id": limitation_id(id, self.file),
            "kind": "source-scope",
            "file": self.file,
            "line": line,
            "column": column,
            "source": source,
            // These are permanent boundaries of source instrumentation: the
            // obligations they hide are outside the denominator, not
            // unmeasured within it.
            "blocking": false,
            "reason": reason
        }));
    }

    fn collect(
        mut self,
        file: &SourceFile,
        assertions: &[TextRange],
        matches: &[TextRange],
    ) -> Result<CoverageManifest, RustInstrumenterError> {
        let root = file.syntax();

        for list in root.descendants().filter_map(ast::StmtList::cast) {
            for statement in list.statements() {
                match statement {
                    ast::Stmt::ExprStmt(statement) => {
                        self.point(statement.syntax().text_range(), PointKind::Statement, None);
                    }
                    ast::Stmt::LetStmt(statement) => {
                        self.point(statement.syntax().text_range(), PointKind::Statement, None);
                    }
                    ast::Stmt::Item(_) => {}
                }
            }
            if let Some(tail) = list.tail_expr() {
                self.point(tail.syntax().text_range(), PointKind::Statement, None);
            }
        }

        for function in root.descendants().filter_map(ast::Fn::cast) {
            if function.body().is_none() {
                continue;
            }
            if function.const_token().is_some() {
                self.site_limitation(
                    "rust-const-context-not-instrumented",
                    function.syntax().text_range(),
                    "Runtime probes cannot execute in const fn or compile-time evaluation".into(),
                );
                continue;
            }
            let label = function.name().map(|name| name.text().to_string());
            self.point_located(
                function.syntax().text_range(),
                item_range(function.syntax()),
                PointKind::Function,
                label,
            );
        }

        for closure in root.descendants().filter_map(ast::ClosureExpr::cast) {
            self.point(
                closure.syntax().text_range(),
                PointKind::Function,
                Some("<closure>".into()),
            );
        }

        for expression in root.descendants().filter_map(ast::IfExpr::cast) {
            if let Some(condition) = expression.condition() {
                self.decision(&condition, "if");
            }
        }
        for expression in root.descendants().filter_map(ast::WhileExpr::cast) {
            if let Some(condition) = expression.condition() {
                self.decision(&condition, "while");
            }
            self.branch(
                expression.syntax().text_range(),
                "while-loop",
                [("zero", "zero iterations"), ("entered", "entered")],
            );
        }
        for guard in root.descendants().filter_map(ast::MatchGuard::cast) {
            if let Some(condition) = guard.condition() {
                self.decision(&condition, "match-guard");
            }
        }
        for arguments in assertions {
            if let Some(condition) = assertion_condition(root, *arguments) {
                self.decision(&condition, "assert");
            }
        }
        for expression in standalone_matches(root, matches, assertions) {
            self.decision(&expression, "matches");
        }

        for binary in root.descendants().filter_map(ast::BinExpr::cast) {
            let kind = match binary.op_kind() {
                Some(BinaryOp::LogicOp(LogicOp::And)) => "logical-and",
                Some(BinaryOp::LogicOp(LogicOp::Or)) => "logical-or",
                _ => continue,
            };
            let range = binary.rhs().map_or_else(
                || binary.syntax().text_range(),
                |right| right.syntax().text_range(),
            );
            self.branch(
                range,
                kind,
                [
                    ("short-circuit", "short-circuited"),
                    ("evaluated", "right operand evaluated"),
                ],
            );
        }

        for expression in root.descendants().filter_map(ast::ForExpr::cast) {
            self.branch(
                expression.syntax().text_range(),
                "for-loop",
                [("zero", "zero iterations"), ("entered", "entered")],
            );
        }
        for expression in root.descendants().filter_map(ast::MatchExpr::cast) {
            let Some(list) = expression.match_arm_list() else {
                continue;
            };
            let arms = list.arms().collect::<Vec<_>>();
            let last = arms.len().saturating_sub(1);
            for (index, arm) in arms.iter().enumerate() {
                let range = arm.syntax().text_range();
                if index == last {
                    // A match is exhaustive, so once every earlier arm has
                    // been passed over the last one is selected: it can be
                    // reached but never skipped.
                    self.branch(range, "match-arm", [("selected", "selected")]);
                } else {
                    self.branch(
                        range,
                        "match-arm",
                        [("missed", "not selected"), ("selected", "selected")],
                    );
                }
            }
        }
        for expression in root.descendants().filter_map(ast::TryExpr::cast) {
            self.branch(
                expression.syntax().text_range(),
                "try-operator",
                [("continued", "continued"), ("returned", "early return")],
            );
        }

        // Only macros the view could not open remain: anything but the std
        // expression macros. One limitation for the file, at the first call
        // site, naming the macros it stands for: one per call site would let
        // a file full of `bail!` outrank every real gap, and the file-wide
        // entry this replaces sat at line 1 and named nothing.
        let mut macro_names = BTreeSet::new();
        let mut first_macro = None;
        let mut macro_sites = 0;
        for call in root.descendants().filter_map(ast::MacroCall::cast) {
            macro_names.insert(
                call.path()
                    .map(|path| path.syntax().text().to_string())
                    .unwrap_or_else(|| "?".into()),
            );
            first_macro.get_or_insert_with(|| call.syntax().text_range());
            macro_sites += 1;
        }
        if let Some(range) = first_macro {
            let named = macro_names
                .iter()
                .take(4)
                .map(|name| format!("`{name}!`"))
                .collect::<Vec<_>>()
                .join(", ");
            let rest = macro_names.len().saturating_sub(4);
            self.site_limitation(
                "rust-macro-expansion-not-instrumented",
                range,
                format!(
                    "{named}{} expand in the compiler: their arguments and expansions are outside the owned source denominator ({macro_sites} call site{} in this file)",
                    if rest == 0 {
                        String::new()
                    } else {
                        format!(" and {rest} other macro{}", if rest == 1 { "" } else { "s" })
                    },
                    if macro_sites == 1 { "" } else { "s" }
                ),
            );
        }

        // An obligation the probes cannot reach stays in the denominator, but the
        // gap has to be declared rather than left to read as merely uncovered.
        // Only a context that actually holds an obligation counts:
        // `const MAX: usize = 10;` costs nothing and must not raise a limitation.
        let bears_obligation = |node: &ra_ap_syntax::SyntaxNode| {
            ast::StmtList::cast(node.clone()).is_some_and(|list| {
                list.statements().next().is_some() || list.tail_expr().is_some()
            }) || ast::IfExpr::can_cast(node.kind())
                || ast::WhileExpr::can_cast(node.kind())
                || ast::MatchGuard::can_cast(node.kind())
                || ast::ForExpr::can_cast(node.kind())
                || ast::MatchArm::can_cast(node.kind())
                || ast::TryExpr::can_cast(node.kind())
                || ast::ClosureExpr::can_cast(node.kind())
                || ast::BinExpr::cast(node.clone()).is_some_and(|binary| {
                    matches!(
                        binary.op_kind(),
                        Some(BinaryOp::LogicOp(LogicOp::And | LogicOp::Or))
                    )
                })
        };
        if let Some(node) = root
            .descendants()
            .find(|node| bears_obligation(node) && in_const_context(node))
        {
            self.site_limitation(
                "rust-const-context-not-instrumented",
                node.text_range(),
                "Runtime probes cannot execute in const fn or compile-time evaluation; this and any later const context in the file stay declared".into(),
            );
        }
        if let Some(node) = root
            .descendants()
            .find(|node| bears_obligation(node) && in_global_allocator(node))
        {
            self.site_limitation(
                "rust-global-allocator-not-instrumented",
                node.text_range(),
                "Probing a GlobalAlloc implementation recurses into itself, because the runtime allocates".into(),
            );
        }

        self.decline_unreachable_obligations(root);

        if let Some(error) = self.error {
            return Err(error);
        }
        self.manifest
            .decisions
            .sort_by(|left, right| left.id.cmp(&right.id));
        self.manifest
            .points
            .sort_by(|left, right| left.id.cmp(&right.id));
        self.manifest
            .branches
            .sort_by(|left, right| left.id.cmp(&right.id));
        self.manifest.limitations.sort_by(|left, right| {
            left.get("id")
                .and_then(|value| value.as_str())
                .cmp(&right.get("id").and_then(|value| value.as_str()))
        });
        Ok(self.manifest)
    }
}

/// Set to a directory to receive the transformed text of any file whose
/// instrumentation no longer parses, named after the file.
pub const FAILED_TRANSFORM_DUMP_ENV: &str = "SUPERCOV_RUST_DUMP_FAILED_INSTRUMENTATION";

/// The std macros whose arguments are ordinary expressions. With the `!`
/// turned into `_` (and `vec!`'s brackets into parentheses), `name!(args)`
/// reads as the call `name_(args)` at the same byte offsets -- the same
/// statement start, the arguments an argument list. Probes then land inside
/// the arguments, and the macro receives instrumented expressions. `vec![x;
/// n]` reads as the array `[x; n]` instead, with `vec!` blanked. `matches!`
/// reads as a call on its scrutinee alone, its pattern blanked, and the whole
/// `matches!` is a decision of its own.
const EXPRESSION_MACROS: &[&str] = &[
    "assert",
    "debug_assert",
    "assert_eq",
    "assert_ne",
    "debug_assert_eq",
    "debug_assert_ne",
    "println",
    "print",
    "eprintln",
    "eprint",
    "format",
    "format_args",
    "write",
    "writeln",
    "panic",
    "unreachable",
    "todo",
    "unimplemented",
    "vec",
    "dbg",
    "matches",
];

/// Macros whose first argument decides whether the program goes on.
const ASSERTION_MACROS: &[&str] = &["assert", "debug_assert"];

/// Macros that check something and panic when it does not hold. Passing one
/// witnesses whatever ran before it.
const ASSERTION_STATEMENT_MACROS: &[&str] = &[
    "assert",
    "assert_eq",
    "assert_ne",
    "debug_assert",
    "debug_assert_eq",
    "debug_assert_ne",
];

/// The source as the instrumenter reads it: every expression macro rewritten
/// so its arguments parse as expressions, offsets intact. `assertions` holds
/// the argument-list ranges of `assert!`-like calls.
struct ExpressionView {
    text: String,
    assertions: Vec<TextRange>,
    /// The whole `assert!`-like calls, as opposed to their arguments: a
    /// statement containing one is a statement that asserts.
    assertion_calls: Vec<TextRange>,
    /// The ranges of whole `matches!(...)` calls: each is a boolean decision.
    matches: Vec<TextRange>,
}

/// The editions tried when parsing, newest first: a file that parses under
/// the newest is the common case, and an older one accepts words the newest
/// reserves -- `gen` is an identifier before 2024, and crates still call
/// `rng.gen()`. The edition that parses the original also parses its view and
/// its transformed text.
const EDITIONS: [Edition; 4] = [
    Edition::Edition2024,
    Edition::Edition2021,
    Edition::Edition2018,
    Edition::Edition2015,
];

fn parse_any_edition(source: &str) -> Result<(SourceFile, Edition), Vec<String>> {
    let mut newest_errors = None;
    for edition in EDITIONS {
        let parsed = SourceFile::parse(source, edition);
        let errors = parsed.errors();
        if errors.is_empty() {
            return Ok((parsed.tree(), edition));
        }
        newest_errors.get_or_insert_with(|| {
            errors
                .into_iter()
                .map(|error| error.to_string())
                .collect::<Vec<_>>()
        });
    }
    Err(newest_errors.unwrap_or_default())
}

fn expression_view(source: &str, edition: Edition) -> ExpressionView {
    let mut text = source.to_owned();
    let mut assertions = Vec::new();
    let mut assertion_calls = Vec::new();
    let mut matches = Vec::new();
    // A macro inside another macro's arguments is tokens until the outer one
    // reads as a call, so rewrite, re-parse, and repeat until nothing changes.
    for _ in 0..16 {
        let tree = SourceFile::parse(&text, edition).tree();
        let Some(next) = rewrite_expression_macros(
            &text,
            &tree,
            edition,
            &mut assertions,
            &mut assertion_calls,
            &mut matches,
        ) else {
            break;
        };
        text = next;
    }
    ExpressionView {
        text,
        assertions,
        assertion_calls,
        matches,
    }
}

/// Whether a macro call is a statement of its own or a block's tail: there
/// its start is the statement's start, which a blanked prefix would move.
fn is_statement_macro(call: &ast::MacroCall) -> bool {
    call.syntax().parent().is_some_and(|parent| {
        ast::MacroExpr::can_cast(parent.kind())
            && parent.parent().is_some_and(|grandparent| {
                ast::ExprStmt::can_cast(grandparent.kind())
                    || ast::StmtList::can_cast(grandparent.kind())
            })
    })
}

/// The offset just after the first top-level comma of a token tree, if any.
fn first_top_level_comma_end(arguments: &ast::TokenTree) -> Option<usize> {
    arguments
        .syntax()
        .children_with_tokens()
        .filter_map(|element| element.into_token())
        .find(|token| token.kind() == SyntaxKind::COMMA)
        .map(|token| usize::from(token.text_range().end()))
}

/// One pass over the known macros of `tree`; the rewritten text, or None when
/// no macro was left to rewrite.
fn rewrite_expression_macros(
    source: &str,
    tree: &SourceFile,
    edition: Edition,
    assertions: &mut Vec<TextRange>,
    assertion_calls: &mut Vec<TextRange>,
    matches: &mut Vec<TextRange>,
) -> Option<String> {
    let mut text = source.as_bytes().to_vec();
    let mut changed = false;
    for call in tree.syntax().descendants().filter_map(ast::MacroCall::cast) {
        let Some(name) = call
            .path()
            .and_then(|path| path.segment())
            .and_then(|segment| segment.name_ref())
            .map(|name| name.text().to_string())
        else {
            continue;
        };
        if !EXPRESSION_MACROS.contains(&name.as_str()) {
            continue;
        }
        let (Some(bang), Some(arguments)) = (call.excl_token(), call.token_tree()) else {
            continue;
        };
        let parenthesised = arguments.l_paren_token().is_some();
        if !parenthesised && arguments.l_brack_token().is_none() {
            continue;
        }
        let range = arguments.syntax().text_range();
        let (start, end) = (usize::from(range.start()), usize::from(range.end()));
        let mut rewritten = source.as_bytes()[start..end].to_vec();
        if !parenthesised {
            rewritten[0] = b'(';
            *rewritten
                .last_mut()
                .expect("a token tree has a closing delimiter") = b')';
        }
        if name == "matches" {
            // `matches!(e, pat)`: the scrutinee is an expression, the pattern
            // is not. Blank the pattern so the call reads as `matches_(e, )`.
            let Some(comma_end) = first_top_level_comma_end(&arguments) else {
                continue;
            };
            for byte in &mut rewritten[comma_end - start..end - start - 1] {
                if *byte != b'\n' {
                    *byte = b' ';
                }
            }
        }
        // The arguments must read as a call's argument list.
        let probe = format!(
            "fn __supercov() {{ let _ = __f{}; }}",
            String::from_utf8_lossy(&rewritten)
        );
        if !SourceFile::parse(&probe, edition).errors().is_empty() {
            // `vec![x; n]` is no argument list; as the array `[x; n]` it still
            // holds expressions. Blanking `vec!` moves the start of a
            // statement the macro forms on its own, so that shape stays.
            if !parenthesised && !is_statement_macro(&call) {
                let array = source.as_bytes()[start..end].to_vec();
                let array_probe = format!(
                    "fn __supercov() {{ let _ = {}; }}",
                    String::from_utf8_lossy(&array)
                );
                if SourceFile::parse(&array_probe, edition).errors().is_empty() {
                    let prefix_start = usize::from(call.syntax().text_range().start());
                    let prefix_start = call.attrs().last().map_or(prefix_start, |attribute| {
                        usize::from(attribute.syntax().text_range().end())
                    });
                    for byte in &mut text[prefix_start..start] {
                        if *byte != b'\n' {
                            *byte = b' ';
                        }
                    }
                    changed = true;
                }
            }
            continue;
        }
        text[usize::from(bang.text_range().start())] = b'_';
        text[start..end].copy_from_slice(&rewritten);
        changed = true;
        if ASSERTION_MACROS.contains(&name.as_str()) {
            assertions.push(range);
        }
        if ASSERTION_STATEMENT_MACROS.contains(&name.as_str()) {
            assertion_calls.push(call.syntax().text_range());
        }
        if name == "matches" {
            matches.push(call.syntax().text_range());
        }
    }
    changed.then(|| String::from_utf8(text).expect("rewriting ASCII keeps the source UTF-8"))
}

/// How many arguments an `assert!`-like call has: one means the macro would
/// build the panic message from the condition's own text.
fn assertion_argument_count(root: &ra_ap_syntax::SyntaxNode, arguments: TextRange) -> usize {
    root.descendants()
        .find(|node| node.text_range() == arguments && ast::ArgList::can_cast(node.kind()))
        .and_then(ast::ArgList::cast)
        .map_or(0, |list| list.args().count())
}

/// The condition of an `assert!`-like call, found in the view by the range of
/// the call's argument list: its first argument.
fn assertion_condition(root: &ra_ap_syntax::SyntaxNode, arguments: TextRange) -> Option<ast::Expr> {
    root.descendants()
        .find(|node| node.text_range() == arguments && ast::ArgList::can_cast(node.kind()))
        .and_then(ast::ArgList::cast)?
        .args()
        .next()
}

/// Parse the source, then parse its expression view; the view is what the
/// collector and the instrumenter walk. Should the view not parse -- an
/// argument list that stands alone but not in place -- the original tree is
/// used and every macro stays declared.
struct ParsedSource {
    tree: SourceFile,
    assertions: Vec<TextRange>,
    assertion_calls: Vec<TextRange>,
    matches: Vec<TextRange>,
    edition: Edition,
}

fn parse_for_instrumentation(source: &str) -> Result<ParsedSource, RustInstrumenterError> {
    if source.len() > u32::MAX as usize {
        return Err(RustInstrumenterError::SourceTooLarge);
    }
    let (tree, edition) = parse_any_edition(source).map_err(RustInstrumenterError::Parse)?;
    let view = expression_view(source, edition);
    let parsed_view = SourceFile::parse(&view.text, edition);
    if parsed_view.errors().is_empty() {
        Ok(ParsedSource {
            tree: parsed_view.tree(),
            assertions: view.assertions,
            assertion_calls: view.assertion_calls,
            matches: view.matches,
            edition,
        })
    } else {
        Ok(ParsedSource {
            tree,
            assertions: Vec::new(),
            assertion_calls: Vec::new(),
            matches: Vec::new(),
            edition,
        })
    }
}

/// The `matches!` calls that stand as decisions of their own: those not
/// already serving as an atomic condition of an `if`, `while`, guard or
/// assertion, whose decision records them.
fn standalone_matches(
    root: &ra_ap_syntax::SyntaxNode,
    matches: &[TextRange],
    assertions: &[TextRange],
) -> Vec<ast::Expr> {
    let mut atoms = Vec::new();
    let mut conditions = Vec::new();
    for expression in root.descendants().filter_map(ast::IfExpr::cast) {
        conditions.extend(expression.condition());
    }
    for expression in root.descendants().filter_map(ast::WhileExpr::cast) {
        conditions.extend(expression.condition());
    }
    for guard in root.descendants().filter_map(ast::MatchGuard::cast) {
        conditions.extend(guard.condition());
    }
    for arguments in assertions {
        conditions.extend(assertion_condition(root, *arguments));
    }
    for condition in &conditions {
        RustObligationCollector::atomic_condition_ranges(condition, &mut atoms);
    }
    matches
        .iter()
        .filter(|range| !atoms.contains(range))
        .filter_map(|range| {
            root.descendants()
                .find(|node| node.text_range() == *range && ast::CallExpr::can_cast(node.kind()))
                .and_then(ast::Expr::cast)
        })
        .collect()
}

pub fn build_rust_manifest(
    file: &str,
    source: &str,
) -> Result<CoverageManifest, RustInstrumenterError> {
    let parsed = parse_for_instrumentation(source)?;
    RustObligationCollector::new(file, source).collect(
        &parsed.tree,
        &parsed.assertions,
        &parsed.matches,
    )
}

fn block_entry_offset(block: &ast::BlockExpr) -> Option<usize> {
    let list = block.stmt_list()?;
    list.attrs()
        .last()
        .map(|attribute| usize::from(attribute.syntax().text_range().end()))
        .or_else(|| {
            list.l_curly_token()
                .map(|token| usize::from(token.text_range().end()))
        })
}

/// A node's range without its outer attributes: a wrapper placed here stays
/// under the attributes, so `#[cfg]` governs the wrapper and the node alike.
/// A node's range from its first real token: past the doc comments and
/// attributes that lead it, which the syntax tree folds into the node.
fn item_range(node: &ra_ap_syntax::SyntaxNode) -> TextRange {
    let range = node.text_range();
    node.children_with_tokens()
        .find(|element| match element {
            ra_ap_syntax::NodeOrToken::Token(token) => !token.kind().is_trivia(),
            ra_ap_syntax::NodeOrToken::Node(child) => !ast::Attr::can_cast(child.kind()),
        })
        .map_or(range, |element| {
            TextRange::new(element.text_range().start(), range.end())
        })
}

fn range_after_attributes(node: &impl HasAttrs) -> TextRange {
    let range = node.syntax().text_range();
    node.attrs().last().map_or(range, |attribute| {
        TextRange::new(attribute.syntax().text_range().end(), range.end())
    })
}

fn has_let(expression: &ast::Expr) -> bool {
    expression
        .syntax()
        .descendants()
        .any(|node| ast::LetExpr::can_cast(node.kind()))
}

/// The expression whose condition is a let chain.
enum ChainHost<'a> {
    If(&'a ast::IfExpr),
    While(&'a ast::WhileExpr),
}

/// The `const` naming a let chain's `&&` operators and their alternative IDs.
fn allocate_chain_table_name(
    file: &str,
    condition: &ast::Expr,
    identifiers: &mut BTreeSet<String>,
) -> String {
    let id = stable_id(file, "chain", condition.syntax().text_range(), "operators");
    let suffix = id
        .rsplit(':')
        .next()
        .unwrap_or("chain")
        .to_ascii_uppercase();
    let base = format!("__SUPERCOV_CHAIN_{suffix}");
    let mut candidate = base.clone();
    let mut attempt = 0_usize;
    while !identifiers.insert(candidate.clone()) {
        attempt += 1;
        candidate = format!("{base}_{attempt}");
    }
    candidate
}

/// A fresh identifier for generated code, from the obligation it serves.
fn allocate_identifier(
    file: &str,
    range: TextRange,
    kind: &str,
    identifiers: &mut BTreeSet<String>,
) -> String {
    let id = stable_id(file, kind, range, "");
    let suffix = id.rsplit(':').next().unwrap_or(kind);
    let base = format!("__supercov_{kind}_{suffix}");
    let mut candidate = base.clone();
    let mut attempt = 0_usize;
    while !identifiers.insert(candidate.clone()) {
        attempt += 1;
        candidate = format!("{base}_{attempt}");
    }
    candidate
}

/// The `break`s in `body` that leave the loop it belongs to: unlabeled ones
/// with no other loop between them and the body, and labeled ones naming the
/// loop's own label.
fn own_breaks(body: &ast::BlockExpr, label: Option<ast::Label>) -> Vec<TextRange> {
    let own_label = label
        .and_then(|label| label.lifetime())
        .map(|lifetime| lifetime.text().to_string());
    body.syntax()
        .descendants()
        .filter_map(ast::BreakExpr::cast)
        .filter(|expression| match expression.lifetime() {
            Some(lifetime) => own_label.as_deref() == Some(lifetime.text().to_string().as_str()),
            None => !expression
                .syntax()
                .ancestors()
                .skip(1)
                .take_while(|ancestor| ancestor != body.syntax())
                .any(|ancestor| {
                    ast::LoopExpr::can_cast(ancestor.kind())
                        || ast::WhileExpr::can_cast(ancestor.kind())
                        || ast::ForExpr::can_cast(ancestor.kind())
                        || ast::ClosureExpr::can_cast(ancestor.kind())
                }),
        })
        .map(|expression| expression.syntax().text_range())
        .collect()
}

/// A decision whose condition holds a `let`. A `let` cannot pass through a
/// call and the condition cannot be wrapped as a whole, so the frame lives in
/// a block around the `if` or `while`, ordinary conditions take `condition`
/// wrappers, each later `let` of a chain is preceded by a `reached` marker,
/// and the outcome is recorded where it becomes known: at the entry of the
/// then branch or loop body (taken) and at the else branch or after the loop
/// (not taken). From those, the runtime derives every pattern's outcome
/// exactly: a chain tries its conditions in order and stops at the first that
/// fails. The chain's `&&` operators are recorded from the same frame, through
/// a table of the operators whose left side holds a `let`.
///
/// A lone `let` is not a chain, and an `&&` marker would make it one -- which
/// editions before 2024 reject. Its evaluation is marked by a statement
/// instead: once before an `if`, and for a `while` at each body entry and
/// after the loop, where a `break` has to be told from the condition failing.
fn instrument_let_chain(
    insertions: &mut Vec<Insertion>,
    runtime_path: &str,
    file: &str,
    condition: &ast::Expr,
    host: ChainHost<'_>,
    identifiers: &mut BTreeSet<String>,
) {
    // The block goes after any outer attributes, so `#[cfg]` keeps governing
    // the frame together with the expression it belongs to.
    let (kind, host_range, body, label) = match &host {
        ChainHost::If(expression) => (
            "if",
            range_after_attributes(*expression),
            expression.then_branch(),
            None,
        ),
        ChainHost::While(expression) => (
            "while",
            range_after_attributes(*expression),
            expression.loop_body(),
            expression.label(),
        ),
    };
    let Some(body) = body else {
        return;
    };
    let Some(body_offset) = block_entry_offset(&body) else {
        return;
    };
    let range = condition.syntax().text_range();
    let id = stable_id(file, "decision", range, kind);
    let mut atoms = Vec::new();
    RustObligationCollector::atomic_condition_ranges(condition, &mut atoms);
    let lets = condition
        .syntax()
        .descendants()
        .filter_map(ast::LetExpr::cast)
        .map(|expression| expression.syntax().text_range())
        .collect::<Vec<_>>();
    let frame = allocate_frame_name(file, condition, kind, identifiers);
    let table = allocate_chain_table_name(file, condition, identifiers);
    let single_let = atoms.len() == 1;
    let broke = match &host {
        ChainHost::While(_) if single_let => {
            Some(allocate_identifier(file, range, "broke", identifiers))
        }
        _ => None,
    };

    let mut operators = Vec::new();
    for binary in condition
        .syntax()
        .descendants()
        .filter_map(ast::BinExpr::cast)
    {
        // Let chains are `&&`-only at the top level; an operator whose left
        // side holds a `let` is one the logical wrapper could not touch.
        if !matches!(binary.op_kind(), Some(BinaryOp::LogicOp(LogicOp::And))) {
            continue;
        }
        let (Some(left), Some(right)) = (binary.lhs(), binary.rhs()) else {
            continue;
        };
        if !has_let(&left) {
            continue;
        }
        let branch = stable_id(file, "branch", right.syntax().text_range(), "logical-and");
        let right_range = right.syntax().text_range();
        let Some(first) = atoms
            .iter()
            .position(|atom| right_range.contains_range(*atom))
        else {
            continue;
        };
        operators.push(format!(
            "({first}, {:?}, {:?})",
            format!("{branch}:short-circuit"),
            format!("{branch}:evaluated")
        ));
    }

    let mark = format!("{runtime_path}::reached(&mut {frame}, 0);");
    let record_false = format!("{runtime_path}::decision_chain(&mut {frame}, false, {table});");
    let mut prefix = format!(
        "{{ const {table}: &[(usize, &str, &str)] = &[{}]; let mut {frame} = {runtime_path}::DecisionFrame::new({id:?}, {}); ",
        operators.join(", "),
        atoms.len()
    );
    if single_let {
        prefix.push_str(&mark);
        prefix.push(' ');
    }
    if let Some(broke) = &broke {
        prefix.push_str(&format!("let mut {broke} = false; "));
    }
    let suffix = match &host {
        ChainHost::If(expression) => match expression.else_branch() {
            Some(_) => " }".to_owned(),
            None => format!(" else {{ {record_false} }} }}"),
        },
        ChainHost::While(_) => match &broke {
            Some(broke) => format!(" if !{broke} {{ {mark} {record_false} }} }}"),
            None => format!(" {record_false} }}"),
        },
    };
    push_wrapper(insertions, host_range, host_range, 1, prefix, suffix);
    if !single_let {
        push_direct(
            insertions,
            usize::from(range.start()),
            format!("{runtime_path}::reached(&mut {frame}, 0) && "),
        );
    }
    for (index, atom) in atoms.iter().enumerate() {
        if lets.contains(atom) {
            if index > 0 {
                push_direct(
                    insertions,
                    usize::from(atom.start()),
                    format!("{runtime_path}::reached(&mut {frame}, {index}) && "),
                );
            }
        } else {
            push_wrapper(
                insertions,
                *atom,
                *atom,
                1,
                format!("{runtime_path}::condition(("),
                format!("), &mut {frame}, {index})"),
            );
        }
    }
    let mut entry = String::new();
    if broke.is_some() {
        entry.push_str(&format!("\n{mark}"));
    }
    entry.push_str(&format!(
        "\n{runtime_path}::decision_chain(&mut {frame}, true, {table});"
    ));
    push_direct(insertions, body_offset, entry);
    if let Some(broke) = &broke {
        for break_range in own_breaks(&body, label) {
            push_wrapper(
                insertions,
                break_range,
                break_range,
                0,
                format!("{{ {broke} = true; "),
                " }".into(),
            );
        }
    }
    if let ChainHost::If(expression) = &host {
        match expression.else_branch() {
            Some(ast::ElseBranch::Block(block)) => {
                if let Some(offset) = block_entry_offset(&block) {
                    push_direct(insertions, offset, format!("\n{record_false}"));
                }
            }
            Some(ast::ElseBranch::IfExpr(nested)) => {
                let nested_range = nested.syntax().text_range();
                push_wrapper(
                    insertions,
                    nested_range,
                    nested_range,
                    0,
                    format!("{{ {record_false} "),
                    " }".into(),
                );
            }
            None => {}
        }
    }
}

/// Where an item for `node` can go: the entry of the nearest enclosing block.
/// An item declared there is visible to the whole block, so nothing about the
/// expression itself -- its value, its temporaries -- changes.
fn enclosing_block_entry(node: &ra_ap_syntax::SyntaxNode) -> Option<usize> {
    node.ancestors()
        .skip(1)
        .find_map(ast::BlockExpr::cast)
        .and_then(|block| block_entry_offset(&block))
}

/// A block written as a bare `{ ... }`: a probe placed just inside its brace
/// runs when the block is entered. Labeled, `unsafe`, `async` and `const`
/// blocks are wrapped instead, so an `async` body does not defer the probe.
fn plain_block(block: &ast::BlockExpr) -> bool {
    block
        .syntax()
        .first_token()
        .is_some_and(|token| token.kind() == SyntaxKind::L_CURLY)
}

fn instrument_decision(
    insertions: &mut Vec<Insertion>,
    runtime_path: &str,
    file: &str,
    condition: &ast::Expr,
    kind: &str,
    frame_name: &str,
) -> bool {
    if cannot_carry_probe(condition.syntax())
        || condition
            .syntax()
            .descendants()
            .any(|node| ast::LetExpr::can_cast(node.kind()))
    {
        return false;
    }
    let range = condition.syntax().text_range();
    let id = stable_id(file, "decision", range, kind);
    let mut condition_ranges = Vec::new();
    RustObligationCollector::atomic_condition_ranges(condition, &mut condition_ranges);
    push_wrapper(
        insertions,
        range,
        range,
        0,
        format!(
            "({{ let mut {frame_name} = {runtime_path}::DecisionFrame::new({id:?}, {}); {runtime_path}::decision((",
            condition_ranges.len()
        ),
        format!("), &mut {frame_name}) }})"),
    );
    // Each condition's scope is the condition itself, so a wrapper that
    // started earlier and ends where this condition ends -- the left operand
    // of a logical operator -- closes after it, not before.
    for (index, atomic_range) in condition_ranges.into_iter().enumerate() {
        push_wrapper(
            insertions,
            atomic_range,
            atomic_range,
            1,
            format!("{runtime_path}::condition(("),
            format!("), &mut {frame_name}, {index})"),
        );
    }
    true
}

/// Produce a private Rust candidate using only Supercov-owned probe calls.
///
/// The caller supplies a collision-free generated crate-local runtime path.
/// Every obligation the manifest declares -- statements, functions, decisions
/// with their conditions -- let chains included -- match arms, logical
/// operators, loops and the try operator -- takes an owned probe; what a
/// probe cannot reach (const contexts, macro expansions, an attributed `let`
/// with no initializer) stays in the denominator behind an explicit
/// limitation.
pub fn instrument_rust_source(
    file: &str,
    source: &str,
    runtime_path: &str,
) -> Result<RustInstrumentedSource, RustInstrumenterError> {
    if !valid_runtime_path(runtime_path) {
        return Err(RustInstrumenterError::InvalidRuntimePath);
    }
    // Parsing is the whole cost of preparing a workspace -- 33s of regex's
    // 34s, 18s of tokio's 19s -- and every file was parsed twice: once to
    // build the manifest and once to place the probes. Each parse tries the
    // editions in turn and then rewrites the expression view to a fixpoint,
    // re-parsing each round.
    let parsed = parse_for_instrumentation(source)?;
    let mut manifest = RustObligationCollector::new(file, source).collect(
        &parsed.tree,
        &parsed.assertions,
        &parsed.matches,
    )?;
    let ParsedSource {
        tree,
        assertions,
        assertion_calls,
        matches,
        edition,
    } = parsed;
    let root = tree.syntax();
    let mut insertions = Vec::new();
    let mut identifiers = root
        .descendants_with_tokens()
        .filter_map(|element| element.into_token())
        .filter(|token| token.kind() == SyntaxKind::IDENT)
        .map(|token| token.text().to_string())
        .collect::<BTreeSet<_>>();

    let mut skipped_attributed_statement = false;
    // A probe must never be PREPENDED to a statement that carries outer
    // attributes. `#[cfg]` selects among adjacent statements, and a bare
    // `hit(...)` inserted between them survives the strip and changes which
    // expression is the block's tail: memchr's `is_available` returns bool
    // from one of two cfg-gated blocks, and the stray probe turned the kept
    // block into a statement and the probe itself into a `()` tail -- 32
    // E0308s across the crate. An attributed BLOCK takes the probe inside its
    // braces, where the same cfg governs both; any other attributed
    // expression is wrapped in such a block. Only a `let` with no initializer
    // has nowhere to put a probe, and is declared.
    let attributed_probe = |insertions: &mut Vec<Insertion>,
                            skipped: &mut bool,
                            expression: Option<ast::Expr>,
                            has_attrs: bool,
                            // Whether `expression` IS the statement, as
                            // opposed to the initializer of a `let`, whose
                            // value the binding needs.
                            statement: bool,
                            trailing: bool,
                            range: TextRange,
                            id: String| {
        if !has_attrs {
            push_direct(
                insertions,
                usize::from(range.start()),
                format!("{runtime_path}::hit({id:?});"),
            );
            return;
        }
        let Some(expression) = expression else {
            *skipped = true;
            return;
        };
        if let ast::Expr::BlockExpr(block) = &expression
            && let Some(offset) = block_entry_offset(block)
        {
            push_direct(
                insertions,
                offset,
                format!("\n{runtime_path}::hit({id:?});"),
            );
            return;
        }
        // A brace-delimited macro call closing a block without a semicolon
        // is a STATEMENT to rustc even though it supplies the block's value
        // -- `fn f() -> T { #[rustfmt::skip] m! { .. } }` compiles -- and
        // wrapping it as `#[attr] { hit; (m! { .. }) }` would make it an
        // attributed tail expression, which is unstable (E0658; tokio's
        // `#[rustfmt::skip] tokio::select! { .. }`). The probe goes before
        // the attributes instead, in a block wrapping attributes and macro
        // together, where the macro is again a trailing statement. A `cfg`
        // attribute would then fire the probe for a statement cfg strips, so
        // that shape is declared.
        if trailing && let ast::Expr::MacroExpr(_) = &expression {
            if expression.attrs().any(|attribute| {
                // This grammar parses `cfg(..)` as a keyword and predicate
                // rather than a path, so the meta's leading word is read.
                attribute.meta().is_some_and(|meta| {
                    let text = meta.syntax().text().to_string();
                    let name = text
                        .chars()
                        .take_while(|character| character.is_alphanumeric() || *character == '_')
                        .collect::<String>();
                    matches!(name.as_str(), "cfg" | "cfg_attr")
                })
            }) {
                *skipped = true;
                return;
            }
            let range = expression.syntax().text_range();
            push_wrapper(
                insertions,
                range,
                range,
                0,
                format!("{{ {runtime_path}::hit({id:?}); "),
                " }".into(),
            );
            return;
        }
        // An attributed macro STATEMENT keeps its macro in statement
        // position: what a macro expands to may only be legal there.
        // hyper's `trace!` expands to `#[cfg(feature = "tracing")] { .. }`,
        // and `#[cfg(..)] { hit; (trace!("..")) }` makes that expansion an
        // attributed expression (E0658). The probe goes ahead of it inside
        // the block instead, and the attribute still governs both.
        if statement && let ast::Expr::MacroExpr(_) = &expression {
            let start = expression.attrs().last().map_or_else(
                || expression.syntax().text_range().start(),
                |attribute| attribute.syntax().text_range().end(),
            );
            let wrapped = TextRange::new(start, expression.syntax().text_range().end());
            push_wrapper(
                insertions,
                wrapped,
                wrapped,
                0,
                format!(" {{ {runtime_path}::hit({id:?}); "),
                "; }".into(),
            );
            return;
        }
        // Any other attributed expression -- or the initializer of an
        // attributed `let` -- moves into a block that carries the probe: the
        // attributes now govern probe and expression together, the block has
        // the expression's value where the expression was, and a block's tail
        // still extends the temporaries a `let` would have extended.
        let start = expression.attrs().last().map_or_else(
            || expression.syntax().text_range().start(),
            |attribute| attribute.syntax().text_range().end(),
        );
        let wrapped = TextRange::new(start, expression.syntax().text_range().end());
        push_wrapper(
            insertions,
            wrapped,
            wrapped,
            0,
            format!(" {{ {runtime_path}::hit({id:?}); ("),
            ") }".into(),
        );
    };
    for list in root.descendants().filter_map(ast::StmtList::cast) {
        let last_statement = list.statements().last();
        for statement in list.statements() {
            let (range, expression, has_attrs, statement_expression, trailing) = match &statement {
                ast::Stmt::ExprStmt(statement) if !cannot_carry_probe(statement.syntax()) => {
                    let expression = statement.expr();
                    // Outer attributes on an expression statement attach to
                    // the inner expression in this grammar.
                    let has_attrs = expression
                        .as_ref()
                        .is_some_and(|expression| expression.attrs().next().is_some());
                    // The block's last statement, without a semicolon and
                    // with no tail expression after it, closes the block.
                    let trailing = statement.semicolon_token().is_none()
                        && list.tail_expr().is_none()
                        && last_statement.as_ref() == Some(&ast::Stmt::ExprStmt(statement.clone()));
                    (
                        statement.syntax().text_range(),
                        expression,
                        has_attrs,
                        true,
                        trailing,
                    )
                }
                ast::Stmt::LetStmt(statement) if !cannot_carry_probe(statement.syntax()) => {
                    let has_attrs = statement.attrs().next().is_some();
                    // Only an attributed `let` needs its initializer; a plain
                    // one takes the probe before the statement.
                    let initializer = has_attrs.then(|| statement.initializer()).flatten();
                    (
                        statement.syntax().text_range(),
                        initializer,
                        has_attrs,
                        false,
                        false,
                    )
                }
                _ => continue,
            };
            let id = stable_id(file, "statement", range, "");
            // Passing a statement that asserts means every assertion in it
            // held: a failing one panics instead. What this thread recorded
            // before that point was in scope for the check. An attributed
            // statement gets no marker -- a `cfg` that strips the statement
            // would leave the marker behind -- and neither does a trailing
            // expression, where a statement after it changes the value.
            if !has_attrs
                && !trailing
                && assertion_calls
                    .iter()
                    .any(|call| range.contains_range(*call))
            {
                push_direct(
                    &mut insertions,
                    usize::from(range.end()),
                    format!("{runtime_path}::assertion({id:?});"),
                );
            }
            attributed_probe(
                &mut insertions,
                &mut skipped_attributed_statement,
                expression,
                has_attrs,
                statement_expression,
                trailing,
                range,
                id,
            );
        }
        if let Some(tail) = list
            .tail_expr()
            .filter(|tail| !cannot_carry_probe(tail.syntax()))
        {
            let range = tail.syntax().text_range();
            let id = stable_id(file, "statement", range, "");
            let has_attrs = tail.attrs().next().is_some();
            attributed_probe(
                &mut insertions,
                &mut skipped_attributed_statement,
                Some(tail),
                has_attrs,
                true,
                true,
                range,
                id,
            );
        }
    }

    for function in root.descendants().filter_map(ast::Fn::cast) {
        // `cannot_carry_probe` covers `const fn` itself, since a node's own
        // ancestors include the node.
        if cannot_carry_probe(function.syntax()) {
            continue;
        }
        let Some(body) = function.body() else {
            continue;
        };
        let label = function.name().map(|name| name.text().to_string());
        let id = stable_id(
            file,
            "function",
            function.syntax().text_range(),
            label.as_deref().unwrap_or(""),
        );
        if let Some(offset) = block_entry_offset(&body) {
            push_direct(
                &mut insertions,
                offset,
                format!("\n{runtime_path}::hit({id:?});"),
            );
        }
    }

    for closure in root.descendants().filter_map(ast::ClosureExpr::cast) {
        let Some(body) = closure.body() else {
            continue;
        };
        if cannot_carry_probe(body.syntax()) {
            continue;
        }
        let id = stable_id(file, "function", closure.syntax().text_range(), "<closure>");
        if let ast::Expr::BlockExpr(block) = &body {
            if let Some(offset) = block_entry_offset(block) {
                push_direct(
                    &mut insertions,
                    offset,
                    format!("\n{runtime_path}::hit({id:?});"),
                );
            }
        } else {
            let range = body.syntax().text_range();
            push_wrapper(
                &mut insertions,
                range,
                closure.syntax().text_range(),
                0,
                format!("{{ {runtime_path}::hit({id:?}); ("),
                ") }".into(),
            );
        }
    }

    // Match arms. One `const` per match, at the entry of the enclosing block,
    // names every arm's `not selected` and `selected` IDs in source order;
    // each arm then records itself as selected and every arm before it as
    // passed over, since a match tries its arms in order and stops at the
    // first that fits. The runtime dedupes by ID, so a hot match costs one
    // record per alternative.
    for expression in root.descendants().filter_map(ast::MatchExpr::cast) {
        if cannot_carry_probe(expression.syntax()) {
            continue;
        }
        let Some(list) = expression.match_arm_list() else {
            continue;
        };
        let arms = list.arms().collect::<Vec<_>>();
        if arms.is_empty() {
            continue;
        }
        let Some(table_offset) = enclosing_block_entry(expression.syntax()) else {
            continue;
        };
        let table = allocate_table_name(file, &expression, &mut identifiers);
        let entries = arms
            .iter()
            .map(|arm| {
                let id = stable_id(file, "branch", arm.syntax().text_range(), "match-arm");
                format!(
                    "{:?}, {:?}",
                    format!("{id}:missed"),
                    format!("{id}:selected")
                )
            })
            .collect::<Vec<_>>()
            .join(", ");
        push_direct(
            &mut insertions,
            table_offset,
            format!("\nconst {table}: &[&str] = &[{entries}];"),
        );
        for (index, arm) in arms.iter().enumerate() {
            let Some(body) = arm.expr() else {
                continue;
            };
            let call = format!("{runtime_path}::arms({table}, {index});");
            match &body {
                ast::Expr::BlockExpr(block) if plain_block(block) => {
                    if let Some(offset) = block_entry_offset(block) {
                        push_direct(&mut insertions, offset, format!("\n{call}"));
                    }
                }
                _ => push_wrapper(
                    &mut insertions,
                    body.syntax().text_range(),
                    arm.syntax().text_range(),
                    0,
                    format!("{{ {call} ("),
                    ") }".into(),
                ),
            }
        }
    }

    // Logical operators: the left operand alone decides whether the right one
    // runs, so wrapping it records the outcome without touching evaluation
    // order. `&&` short-circuits on false, `||` on true.
    for binary in root.descendants().filter_map(ast::BinExpr::cast) {
        let short_circuits_when = match binary.op_kind() {
            Some(BinaryOp::LogicOp(LogicOp::And)) => false,
            Some(BinaryOp::LogicOp(LogicOp::Or)) => true,
            _ => continue,
        };
        if cannot_carry_probe(binary.syntax()) {
            continue;
        }
        let (Some(left), Some(right)) = (binary.lhs(), binary.rhs()) else {
            continue;
        };
        // In a let chain the left operand is (or holds) a `let`, whose
        // bindings must stay in scope for the right operand; it cannot pass
        // through a call. The chain's own probes record that operator.
        if has_let(&left) {
            continue;
        }
        let kind = if short_circuits_when {
            "logical-or"
        } else {
            "logical-and"
        };
        let id = stable_id(file, "branch", right.syntax().text_range(), kind);
        push_wrapper(
            &mut insertions,
            left.syntax().text_range(),
            binary.syntax().text_range(),
            2,
            format!("{runtime_path}::logical(("),
            format!(
                "), {short_circuits_when}, {:?}, {:?})",
                format!("{id}:short-circuit"),
                format!("{id}:evaluated")
            ),
        );
    }

    // `for` loops: the iterable passes through an adapter that records, on
    // the first `next`, whether the body ran at all. `into_iter` is called
    // where the loop would have called it, on the same expression.
    for expression in root.descendants().filter_map(ast::ForExpr::cast) {
        if cannot_carry_probe(expression.syntax()) {
            continue;
        }
        let Some(iterable) = expression.iterable() else {
            continue;
        };
        let id = stable_id(file, "branch", expression.syntax().text_range(), "for-loop");
        // Scope is the wrapped range itself: any wrapper that also starts
        // here and reaches further -- a decision, a match arm -- must stay
        // outside this one.
        push_wrapper(
            &mut insertions,
            iterable.syntax().text_range(),
            iterable.syntax().text_range(),
            0,
            format!("{runtime_path}::for_loop(("),
            format!(
                "), {:?}, {:?})",
                format!("{id}:zero"),
                format!("{id}:entered")
            ),
        );
    }

    // `while` loops: a flag beside the loop, cleared by the first body entry
    // and read once the loop is over. The condition stays as written, so
    // `while let` is covered too.
    for expression in root.descendants().filter_map(ast::WhileExpr::cast) {
        if cannot_carry_probe(expression.syntax()) {
            continue;
        }
        let Some(offset) = expression.loop_body().as_ref().and_then(block_entry_offset) else {
            continue;
        };
        let id = stable_id(
            file,
            "branch",
            expression.syntax().text_range(),
            "while-loop",
        );
        let flag = allocate_flag_name(file, &expression, &mut identifiers);
        let range = range_after_attributes(&expression);
        push_wrapper(
            &mut insertions,
            range,
            range,
            0,
            format!("{{ let mut {flag} = true; "),
            format!(
                " {runtime_path}::zero_iterations({flag}, {:?}) }}",
                format!("{id}:zero")
            ),
        );
        push_direct(
            &mut insertions,
            offset,
            format!(
                "\n{runtime_path}::entered(&mut {flag}, {:?});",
                format!("{id}:entered")
            ),
        );
    }

    // The try operator: the operand passes through a probe that reads which
    // way `?` will go. Every stable `Try` type is covered by the runtime's
    // `TryProbe` implementations.
    for expression in root.descendants().filter_map(ast::TryExpr::cast) {
        if cannot_carry_probe(expression.syntax()) {
            continue;
        }
        let Some(operand) = expression.expr() else {
            continue;
        };
        let id = stable_id(
            file,
            "branch",
            expression.syntax().text_range(),
            "try-operator",
        );
        // Scope is the operand alone: a decision wrapping `expr?` as its
        // condition starts at the same offset and must close after this.
        push_wrapper(
            &mut insertions,
            operand.syntax().text_range(),
            operand.syntax().text_range(),
            0,
            format!("{runtime_path}::TryProbe::probe(("),
            format!(
                "), {:?}, {:?})",
                format!("{id}:continued"),
                format!("{id}:returned")
            ),
        );
    }

    for expression in root.descendants().filter_map(ast::IfExpr::cast) {
        let Some(condition) = expression.condition() else {
            continue;
        };
        if has_let(&condition) {
            if !cannot_carry_probe(condition.syntax()) {
                instrument_let_chain(
                    &mut insertions,
                    runtime_path,
                    file,
                    &condition,
                    ChainHost::If(&expression),
                    &mut identifiers,
                );
            }
            continue;
        }
        let frame_name = allocate_frame_name(file, &condition, "if", &mut identifiers);
        instrument_decision(
            &mut insertions,
            runtime_path,
            file,
            &condition,
            "if",
            &frame_name,
        );
    }
    for expression in root.descendants().filter_map(ast::WhileExpr::cast) {
        let Some(condition) = expression.condition() else {
            continue;
        };
        if has_let(&condition) {
            if !cannot_carry_probe(condition.syntax()) {
                instrument_let_chain(
                    &mut insertions,
                    runtime_path,
                    file,
                    &condition,
                    ChainHost::While(&expression),
                    &mut identifiers,
                );
            }
            continue;
        }
        let frame_name = allocate_frame_name(file, &condition, "while", &mut identifiers);
        instrument_decision(
            &mut insertions,
            runtime_path,
            file,
            &condition,
            "while",
            &frame_name,
        );
    }
    for guard in root.descendants().filter_map(ast::MatchGuard::cast) {
        if let Some(condition) = guard.condition() {
            let frame_name = allocate_frame_name(file, &condition, "match-guard", &mut identifiers);
            instrument_decision(
                &mut insertions,
                runtime_path,
                file,
                &condition,
                "match-guard",
                &frame_name,
            );
        }
    }
    // `assert!(cond, ...)`: the condition decides whether the program goes
    // on, and the macro takes an instrumented expression like any other.
    // Without a message of its own, `assert!` stringifies the condition into
    // the panic message -- which `#[should_panic(expected = "...")]` tests
    // read -- so the original text is supplied as the message, exactly as
    // the macro would have built it.
    for arguments in &assertions {
        let Some(condition) = assertion_condition(root, *arguments) else {
            continue;
        };
        let frame_name = allocate_frame_name(file, &condition, "assert", &mut identifiers);
        if !instrument_decision(
            &mut insertions,
            runtime_path,
            file,
            &condition,
            "assert",
            &frame_name,
        ) {
            continue;
        }
        if assertion_argument_count(root, *arguments) == 1 {
            let range = condition.syntax().text_range();
            let original = &source[usize::from(range.start())..usize::from(range.end())];
            push_direct(
                &mut insertions,
                usize::from(range.end()),
                format!(", \"assertion failed: {{}}\", stringify!({original})"),
            );
        }
    }
    // `matches!(e, pat)` is a boolean decision wherever it stands; as a
    // condition of an `if` it is already one of that decision's atoms.
    for expression in standalone_matches(root, &matches, &assertions) {
        let frame_name = allocate_frame_name(file, &expression, "matches", &mut identifiers);
        instrument_decision(
            &mut insertions,
            runtime_path,
            file,
            &expression,
            "matches",
            &frame_name,
        );
    }

    if skipped_attributed_statement {
        add_manifest_limitation(
            &mut manifest,
            file,
            "rust-attributed-statement-probes-not-injected",
            "A `let` without an initializer that carries outer attributes has no expression to hold a probe",
        );
    }
    manifest.limitations.sort_by(|left, right| {
        left.get("id")
            .and_then(|value| value.as_str())
            .cmp(&right.get("id").and_then(|value| value.as_str()))
    });

    let code = apply_insertions(source, insertions)?;
    let transformed = SourceFile::parse(&code, edition);
    let errors = transformed
        .errors()
        .into_iter()
        .map(|error| error.to_string())
        .collect::<Vec<_>>();
    if !errors.is_empty() {
        // The transformed text is what a diagnosis needs; the parse errors
        // alone do not say where. Written only when asked, since it is the
        // size of the source.
        if let Some(directory) = std::env::var_os(FAILED_TRANSFORM_DUMP_ENV) {
            let name = file.replace(['/', '\\'], "__");
            let _ = std::fs::create_dir_all(&directory);
            let _ = std::fs::write(std::path::Path::new(&directory).join(name), &code);
        }
        return Err(RustInstrumenterError::Parse(errors));
    }
    Ok(RustInstrumentedSource { code, manifest })
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        process::Command,
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    /// A limitation's kind: its ID without the file that scopes it.
    fn limitation_kind_of(limitation: &serde_json::Value) -> Option<&str> {
        limitation.get("id")?.as_str()?.split('#').next()
    }

    const NOOP_RUNTIME: &str = r#"
#[doc(hidden)]
mod __supercov_runtime_v1 {
    pub struct DecisionFrame;
    impl DecisionFrame {
        pub fn new(_: &'static str, _: usize) -> Self { Self }
    }
    pub fn hit(_: &'static str) {}
    pub fn arms(_: &[&'static str], _: usize) {}
    pub fn logical(left: bool, _: bool, _: &'static str, _: &'static str) -> bool { left }
    pub fn for_loop<I: IntoIterator>(iterable: I, _: &'static str, _: &'static str) -> I::IntoIter {
        iterable.into_iter()
    }
    pub fn entered(_: &mut bool, _: &'static str) {}
    pub fn zero_iterations(_: bool, _: &'static str) {}
    pub trait TryProbe: Sized {
        fn probe(self, _: &'static str, _: &'static str) -> Self { self }
    }
    impl<T> TryProbe for T {}
    pub fn condition<V: std::ops::Not<Output = bool>>(value: V, _: &mut DecisionFrame, _: usize) -> bool { !!value }
    pub fn decision(value: bool, _: &mut DecisionFrame) -> bool { value }
    pub fn reached(_: &mut DecisionFrame, _: usize) -> bool { true }
    pub fn decision_chain(_: &mut DecisionFrame, _: bool, _: &[(usize, &'static str, &'static str)]) {}
    pub fn assertion(_: &'static str) {}
}
"#;

    fn compile_and_run(source: &str, name: &str) -> std::process::Output {
        compile_and_run_edition(source, name, "2024")
    }

    fn compile_and_run_edition(source: &str, name: &str, edition: &str) -> std::process::Output {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let directory = std::env::temp_dir().join(format!(
            "supercov-rust-transform-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir(&directory).unwrap();
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        fs::write(&input, source).unwrap();
        let compile = Command::new("rustc")
            .arg(format!("--edition={edition}"))
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "rustc failed:\n{}\nsource:\n{source}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary).output().unwrap();
        fs::remove_dir_all(directory).unwrap();
        output
    }

    #[test]
    fn discovers_rust_obligations_with_exact_ranges_and_stable_ids() {
        let source = r#"fn classify<T>(values: &[T], first: bool, second: bool, third: bool) -> Option<&T> {
    let picked = if first && (second || third) {
        values.first()?
    } else {
        None
    };
    for value in values {
        if first || second {
            return Some(value);
        }
    }
    match picked {
        Some(value) if second && third => Some(value),
        _ => None,
    }
}

fn closure(value: i32) -> bool {
    (|candidate| candidate > 0)(value)
}
"#;
        let first = build_rust_manifest("src/lib.rs", source).unwrap();
        let second = build_rust_manifest("src/lib.rs", source).unwrap();
        assert_eq!(first, second);
        assert!(first.points.iter().any(|point| {
            point.kind == PointKind::Function && point.label.as_deref() == Some("classify")
        }));
        assert!(first.points.iter().any(|point| {
            point.kind == PointKind::Function && point.label.as_deref() == Some("<closure>")
        }));
        let first_if = first
            .decisions
            .iter()
            .find(|decision| decision.line == 2)
            .unwrap();
        assert_eq!(first_if.conditions, ["first", "second", "third"]);
        assert_eq!(first_if.column, 20);
        assert!(
            first
                .branches
                .iter()
                .any(|branch| branch.kind == "for-loop")
        );
        let mut arms = first
            .branches
            .iter()
            .filter(|branch| branch.kind == "match-arm")
            .collect::<Vec<_>>();
        arms.sort_by_key(|branch| branch.line);
        assert_eq!(arms.len(), 2);
        assert_eq!(
            arms[0]
                .alternatives
                .iter()
                .map(|alternative| alternative.label.as_str())
                .collect::<Vec<_>>(),
            ["not selected", "selected"]
        );
        // The last arm of an exhaustive match is reached or not; it is never
        // considered and passed over.
        assert_eq!(
            arms[1]
                .alternatives
                .iter()
                .map(|alternative| alternative.label.as_str())
                .collect::<Vec<_>>(),
            ["selected"]
        );
        assert!(
            first
                .branches
                .iter()
                .any(|branch| branch.kind == "try-operator")
        );
        assert!(first.decisions.iter().all(|decision| {
            decision.id.starts_with("rs:decision:") && decision.conditions.len() >= 2
        }));
        assert!(first.limitations.is_empty());
    }

    #[test]
    fn declares_macro_and_const_boundaries_instead_of_hiding_them() {
        let source = r#"const fn doubled(value: usize) -> usize { value * 2 }

macro_rules! noop {
    () => {};
}

fn checked(value: bool) -> bool {
    assert!(value);
    noop!();
    const { doubled(2) == 4 }
}
"#;
        let manifest = build_rust_manifest("src/lib.rs", source).unwrap();
        // The assertion is a decision of its own; the crate's own macro keeps
        // the macro limitation.
        assert!(manifest.decisions.iter().any(|decision| {
            decision.line == 8 && decision.source == "value" && decision.conditions == ["value"]
        }));
        let ids = manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        assert_eq!(
            ids,
            BTreeSet::from([
                "rust-const-context-not-instrumented",
                "rust-macro-expansion-not-instrumented"
            ])
        );
        assert!(!manifest.points.iter().any(|point| {
            point.kind == PointKind::Function && point.label.as_deref() == Some("doubled")
        }));
    }

    #[test]
    fn transforms_points_and_nested_decisions_without_changing_behavior() {
        let source = r#"use std::sync::atomic::{AtomicUsize, Ordering};

static CALLS: AtomicUsize = AtomicUsize::new(0);

fn observed(name: &str, value: bool) -> bool {
    let order = CALLS.fetch_add(1, Ordering::SeqCst);
    println!("{order}:{name}:{value}");
    value
}

fn classify(first: bool, second: bool, third: bool) -> i32 {
    if observed("a", first) && (observed("b", second) || observed("c", third)) {
        7
    } else {
        3
    }
}

fn main() {
    let closure = |value: i32| value + 1;
    println!("result={}", closure(classify(true, false, true)));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        assert!(transformed.code.contains("::condition("));
        assert!(transformed.code.contains("::decision("));
        assert!(transformed.code.contains("::hit("));
        let original = compile_and_run(source, "original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn let_chains_take_derived_condition_probes_and_const_contexts_stay_declared() {
        let source = r#"const fn enabled(value: bool) -> bool {
    if value { true } else { false }
}

fn classify(value: Option<bool>, fallback: bool) -> bool {
    if let Some(inner) = value && inner && fallback { true } else { false }
}
"#;
        let transformed =
            instrument_rust_source("src/lib.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let ids = transformed
            .manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        assert!(ids.contains("rust-const-context-not-instrumented"));
        assert!(!ids.contains("rust-let-chain-probes-not-injected"));
        // The chain: a marker at the front, ordinary conditions wrapped, the
        // outcome recorded in both branches; the `let` itself untouched.
        assert!(
            transformed
                .code
                .contains("::reached(&mut __supercov_decision_")
        );
        assert!(
            transformed
                .code
                .contains("::condition((inner), &mut __supercov_decision_")
        );
        assert!(
            transformed
                .code
                .contains("::decision_chain(&mut __supercov_decision_")
        );
        assert!(transformed.code.contains("&& let Some(inner) = value &&"));
        assert!(!transformed.code.contains("condition((let"));
    }

    #[test]
    fn std_macro_arguments_take_probes_and_assertions_are_decisions() {
        let source = r#"use std::fmt::Write as _;

fn classify(values: &[i32], strict: bool) -> String {
    let mut out = String::new();
    assert!(values.len() < 10 && (strict || !values.is_empty()), "bad input {:?}", values);
    debug_assert!(values.iter().all(|v| *v > -100));
    let doubled = vec![values.iter().map(|v| v * 2).sum::<i32>(), if strict { 1 } else { 2 }];
    let repeated = vec![if strict { 1 } else { 0 }; values.len()];
    let small = matches!(values.first(), Some(v) if *v < 3);
    if matches!(values.len(), 1 | 2) && small {
        println!("small");
    }
    println!("{}", repeated.len() + small as usize);
    write!(out, "{}", doubled.iter().map(|d| if *d > 4 { "big" } else { "small" }).collect::<Vec<_>>().join(",")).unwrap();
    println!("{} {}", format!("{:?}", doubled), if values.first().copied().unwrap_or(0) > 0 && strict { "positive" } else { "other" });
    assert_eq!(doubled.len(), if strict { 2 } else { 2 }, "length for strict={strict}");
    out
}

fn main() {
    println!("{}", classify(&[1, 2], true));
    println!("{}", classify(&[3], false));
    println!("{}", classify(&[], true));
    let total: i32 = dbg!(vec![1, 2, 3]).into_iter().sum();
    println!("{total}");
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // `debug_assert!(cond)` had no message: the condition's own text is
        // supplied so the panic message is the one the macro would build.
        assert!(transformed.code.contains(
            r#", "assertion failed: {}", stringify!(values.iter().all(|v| *v > -100)))"#
        ));
        // `assert!(cond, "msg", args)` keeps its message untouched.
        assert!(
            transformed
                .code
                .contains(r#"), "bad input {:?}", values);"#)
        );
        // The assertion's condition is a two-condition decision, the `if`
        // inside `vec!` and `println!` are decisions, the logical operators
        // inside the macros are branches, and no macro is left declared.
        let assertion = transformed
            .manifest
            .decisions
            .iter()
            .find(|decision| decision.line == 5)
            .expect("assert! decision");
        assert_eq!(
            assertion.conditions,
            ["values.len() < 10", "strict", "!values.is_empty()"]
        );
        assert!(
            transformed
                .manifest
                .decisions
                .iter()
                .any(|decision| decision.line == 7)
        );
        assert!(
            transformed
                .manifest
                .decisions
                .iter()
                .any(|decision| decision.line == 9)
        );
        assert!(
            transformed
                .code
                .contains("assert!(({ let mut __supercov_decision_")
        );
        assert!(
            transformed
                .code
                .contains(", if ({ let mut __supercov_decision_")
        );
        // `vec![x; n]`: the element takes probes as an array element would.
        assert!(
            transformed
                .code
                .contains("vec![if ({ let mut __supercov_decision_")
        );
        // A standalone `matches!` is a decision; one that is already an `if`
        // condition's atom is not doubled.
        assert!(
            transformed
                .code
                .contains("let small = ({ let mut __supercov_decision_")
        );
        assert_eq!(
            transformed
                .manifest
                .decisions
                .iter()
                .filter(|decision| decision.line == 10)
                .count(),
            1
        );
        assert_eq!(
            transformed
                .manifest
                .decisions
                .iter()
                .filter(|decision| decision.line == 9)
                .count(),
            1
        );
        assert!(
            transformed
                .code
                .contains("vec![values.iter().map(|v| { crate::__supercov_runtime_v1::hit(")
        );
        assert!(!transformed.manifest.limitations.iter().any(|limitation| {
            limitation.get("id").and_then(|id| id.as_str())
                == Some("rust-macro-expansion-not-instrumented")
        }));
        let original = compile_and_run(source, "original-macros");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-macros",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        // `dbg!` prints its own file:line:column, which the probes move;
        // compare what follows the location.
        let after_location = |stderr: &[u8]| {
            String::from_utf8_lossy(stderr)
                .lines()
                .map(|line| {
                    line.split_once("] ")
                        .map_or(line, |(_, rest)| rest)
                        .to_owned()
                })
                .collect::<Vec<_>>()
        };
        assert_eq!(
            after_location(&instrumented.stderr),
            after_location(&original.stderr)
        );
    }

    #[test]
    fn assertion_panic_messages_survive_instrumentation() {
        // smallvec's `#[should_panic(expected = "new_capacity >= len")]` reads
        // the message `assert!` builds from its condition's text.
        let source = r#"fn grow(len: usize, new_capacity: usize) {
    assert!(new_capacity >= len);
}

fn check(value: i32) {
    assert!(value > 0 && value < 10, "value {value} out of range");
}

// tokio: `assert!` only negates its operand, so a `&bool` is accepted.
fn all_seen(seen: &[bool]) {
    for was_seen in seen {
        assert!(was_seen);
        debug_assert!(was_seen, "seen");
    }
}

fn main() {
    std::panic::set_hook(Box::new(|_| {}));
    all_seen(&[true, true]);
    match std::panic::catch_unwind(|| all_seen(&[true, false])) {
        Ok(()) => println!("ok"),
        Err(payload) => println!("{}", payload.downcast_ref::<&str>().map(|s| s.to_string()).or_else(|| payload.downcast_ref::<String>().cloned()).unwrap_or_default()),
    }
    for (len, capacity) in [(3, 5), (8, 5)] {
        match std::panic::catch_unwind(|| grow(len, capacity)) {
            Ok(()) => println!("ok"),
            Err(payload) => println!("{}", payload.downcast_ref::<&str>().map(|s| s.to_string()).or_else(|| payload.downcast_ref::<String>().cloned()).unwrap_or_default()),
        }
    }
    match std::panic::catch_unwind(|| check(12)) {
        Ok(()) => println!("ok"),
        Err(payload) => println!("{}", payload.downcast_ref::<String>().cloned().unwrap_or_default()),
    }
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let original = compile_and_run(source, "original-assert-message");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-assert-message",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert!(
            String::from_utf8_lossy(&instrumented.stdout)
                .contains("assertion failed: new_capacity >= len")
        );
        assert!(
            String::from_utf8_lossy(&instrumented.stdout).contains("assertion failed: was_seen")
        );
    }

    #[test]
    fn files_that_predate_a_reserved_word_still_instrument() {
        // itertools' tests call `rng.gen()`; `gen` is a keyword in 2024 only.
        let source = r#"struct Rng(u64);
impl Rng {
    fn gen(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1);
        self.0 >> 33
    }
}

fn main() {
    let mut rng = Rng(7);
    let mut odd = 0;
    for _ in 0..10 {
        if rng.gen() % 2 == 1 {
            odd += 1;
        }
    }
    println!("{odd}");
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        assert!(
            transformed
                .manifest
                .decisions
                .iter()
                .any(|decision| decision.line == 13)
        );
        let original = compile_and_run_edition(source, "original-gen", "2021");
        let instrumented = compile_and_run_edition(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-gen",
            "2021",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
    }

    #[test]
    fn lone_let_conditions_compile_before_edition_2024_and_record_breaks() {
        // bytes and memchr are edition 2018/2021: a plain `if let` there must
        // not become a let chain. `while let` needs its `break`s told apart
        // from the condition failing, including labeled ones from inner loops.
        let source = r#"fn first_even(values: &[i32]) -> Option<i32> {
    let mut it = values.iter();
    'scan: while let Some(value) = it.next() {
        if *value < 0 {
            break;
        }
        for _ in 0..1 {
            if *value == 99 {
                break 'scan;
            }
            if *value == 98 {
                break;
            }
        }
        if *value % 2 == 0 {
            return Some(*value);
        }
    }
    None
}

fn describe(value: Option<i32>) -> &'static str {
    if let Some(inner) = value {
        if inner > 0 { "positive" } else { "non-positive" }
    } else if let None = value {
        "none"
    } else {
        "unreachable"
    }
}

fn count(values: &[Option<i32>]) -> usize {
    let mut total = 0;
    for value in values {
        if let Some(_) = value {
            total += 1;
        }
    }
    total
}

fn main() {
    println!("{:?} {:?} {:?} {:?}", first_even(&[1, 3, 4]), first_even(&[1, -1, 4]), first_even(&[99, 4]), first_even(&[98, 3, 6]));
    println!("{} {} {}", describe(Some(2)), describe(Some(-2)), describe(None));
    println!("{}", count(&[Some(1), None, Some(3)]));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        assert!(!transformed.code.contains("&& let"));
        assert!(transformed.code.contains("__supercov_broke_"));
        assert_eq!(transformed.code.matches("= true; break").count(), 2);
        for edition in ["2021", "2024"] {
            let original =
                compile_and_run_edition(source, &format!("original-lone-let-{edition}"), edition);
            let instrumented = compile_and_run_edition(
                &format!("{}\n{NOOP_RUNTIME}", transformed.code),
                &format!("instrumented-lone-let-{edition}"),
                edition,
            );
            assert_eq!(instrumented.status, original.status);
            assert_eq!(instrumented.stdout, original.stdout);
            assert_eq!(instrumented.stderr, original.stderr);
        }
    }

    #[test]
    fn let_chains_keep_their_behavior() {
        let source = r#"fn describe(value: Option<i32>, flag: bool) -> &'static str {
    if let Some(inner) = value && inner > 0 && flag {
        "positive"
    } else if let Some(inner) = value && (inner < 0 || flag) {
        "negative-or-flagged"
    } else {
        "other"
    }
}

fn count_pairs(values: &[(Option<i32>, i32)]) -> i32 {
    let mut total = 0;
    let mut it = values.iter();
    while let Some((first, second)) = it.next() && let Some(inner) = first && *second > 0 {
        total += inner * second;
        if total > 100 {
            break;
        }
    }
    total
}

fn tail(value: Option<&str>) -> usize {
    let pick = |v: Option<&str>| if let Some(text) = v && !text.is_empty() { text.len() } else { 0 };
    if let Some(text) = value && text.starts_with('x') {
        println!("x-prefixed");
    }
    pick(value)
}

fn main() {
    for value in [Some(3), Some(-3), Some(0), None] {
        for flag in [true, false] {
            println!("{value:?} {flag} {}", describe(value, flag));
        }
    }
    println!("{}", count_pairs(&[(Some(2), 3), (Some(4), 5), (None, 1), (Some(9), 9)]));
    println!("{}", count_pairs(&[(Some(50), 3), (Some(4), 5)]));
    println!("{} {} {}", tail(Some("xyz")), tail(Some("")), tail(None));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        assert_eq!(
            transformed.code.matches("const __SUPERCOV_CHAIN_").count(),
            5
        );
        assert!(!transformed.manifest.limitations.iter().any(|limitation| {
            limitation.get("id").and_then(|id| id.as_str())
                == Some("rust-let-chain-probes-not-injected")
        }));
        let original = compile_and_run(source, "original-chains");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-chains",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn instrumented_const_and_static_initialisers_still_compile() {
        // Every one of these positions is const-evaluated, so none of them can
        // hold a call to the runtime -- `condition`, `decision` and `hit` are
        // not `const fn`. Found on bytes-1.12.1, whose test target has
        // `const ITERS: usize = if cfg!(miri) { 100 } else { 1_000 };` and
        // failed to build with E0015.
        let source = r#"const DIRECT: usize = if cfg!(unix) { 100 } else { 1_000 };
static WIDTH: usize = if cfg!(unix) { 2 } else { 4 };

enum Mode {
    Narrow = if cfg!(unix) { 1 } else { 2 },
}

struct Buffer([u8; if cfg!(unix) { 4 } else { 8 }]);

impl Buffer {
    const SPAN: usize = if cfg!(unix) { 5 } else { 9 };
}

fn scaled(flag: bool) -> usize {
    const LOCAL: usize = if cfg!(unix) { 3 } else { 6 };
    if flag { LOCAL + Buffer::SPAN } else { DIRECT + WIDTH }
}

fn main() {
    let buffer = Buffer([0; if cfg!(unix) { 4 } else { 8 }]);
    println!(
        "{} {} {} {}",
        scaled(true),
        scaled(false),
        Mode::Narrow as usize,
        buffer.0.len()
    );
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // The runtime `if` in `scaled` is still instrumented -- declining a
        // const initialiser must not decline the whole file.
        assert!(transformed.code.contains("::decision("));
        let ids = transformed
            .manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        assert!(ids.contains("rust-const-context-not-instrumented"));

        let original = compile_and_run(source, "const-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "const-instrumented",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn a_probed_global_allocator_would_recurse_into_itself() {
        // The runtime allocates, so a probe inside `alloc` re-enters `alloc` and
        // recurses until the stack is gone. bytes-1.12.1's
        // tests/test_bytes_odd_alloc.rs installs one of these, and the
        // instrumented binary died with SIGSEGV before libtest could list a
        // single test, while the uninstrumented binary listed them fine.
        let source = r#"use std::alloc::{GlobalAlloc, Layout, System};

struct Odd;

unsafe impl GlobalAlloc for Odd {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        if layout.align() == 1 && layout.size() > 0 {
            System.alloc(layout)
        } else {
            System.alloc(layout)
        }
    }

    unsafe fn dealloc(&self, pointer: *mut u8, layout: Layout) {
        System.dealloc(pointer, layout);
    }
}

#[global_allocator]
static ODD: Odd = Odd;

fn classify(flag: bool) -> usize {
    if flag { 1 } else { 2 }
}

fn main() {
    let held = std::vec![7u8; 32];
    println!("{} {}", classify(!held.is_empty()), held.len());
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // Nothing inside the allocator may carry a probe...
        let allocator = transformed
            .code
            .split("unsafe impl GlobalAlloc for Odd")
            .nth(1)
            .and_then(|rest| rest.split("#[global_allocator]").next())
            .expect("the instrumented source still contains the allocator impl");
        assert!(
            !allocator.contains("__supercov_runtime_v1"),
            "probe injected into a GlobalAlloc impl:\n{allocator}"
        );
        // ...while `classify`, right next to it, is still measured.
        assert!(transformed.code.contains("::decision("));
        let ids = transformed
            .manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        assert!(ids.contains("rust-global-allocator-not-instrumented"));

        let original = compile_and_run(source, "alloc-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "alloc-instrumented",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn match_arms_record_selection_without_changing_behavior() {
        let source = r#"#[derive(Debug)]
enum Shape { Dot, Line(i32), Box { w: i32, h: i32 } }

fn area(shape: &Shape) -> i32 {
    match shape {
        Shape::Dot => 0,
        Shape::Line(length) if *length < 0 => -length,
        Shape::Line(length) => *length,
        Shape::Box { w, h } => {
            let area = w * h;
            area
        }
    }
}

fn describe(value: i32) -> &'static str {
    let inner = |v: i32| match v { 0 => "none", 1 => "one", _ => "many" };
    match value {
        0 => inner(value),
        n if n < 0 => unsafe { std::hint::unreachable_unchecked() },
        n => match n % 2 {
            0 => "even",
            _ => inner(n),
        },
    }
}

fn main() {
    for shape in [Shape::Dot, Shape::Line(-3), Shape::Line(4), Shape::Box { w: 2, h: 5 }] {
        println!("{shape:?}={}", area(&shape));
    }
    for value in [0, 1, 3, 8] {
        println!("{value}:{}", describe(value));
    }
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        assert!(transformed.code.contains("::arms(__SUPERCOV_ARMS_"));
        assert_eq!(
            transformed.code.matches("const __SUPERCOV_ARMS_").count(),
            4
        );
        let arms = transformed
            .manifest
            .branches
            .iter()
            .filter(|branch| branch.kind == "match-arm")
            .count();
        assert_eq!(arms, 4 + 3 + 3 + 2);
        // Every arm's alternatives appear in a table, and the source keeps
        // its meaning.
        for branch in transformed
            .manifest
            .branches
            .iter()
            .filter(|branch| branch.kind == "match-arm")
        {
            for alternative in &branch.alternatives {
                assert!(
                    transformed.code.contains(&format!("{:?}", alternative.id)),
                    "{} is not in any table",
                    alternative.id
                );
            }
        }
        let original = compile_and_run(source, "original-arms");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-arms",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn loops_logic_and_try_record_their_branches_without_changing_behavior() {
        let source = r#"use std::ops::ControlFlow;

fn total(values: &[i32]) -> i32 {
    let mut sum = 0;
    for value in values {
        sum += value;
    }
    'outer: for row in 0..3 {
        for column in 0..3 {
            if column > row {
                continue 'outer;
            }
            sum += row * column;
        }
    }
    sum
}

fn first_even(values: &[i32]) -> Option<i32> {
    let mut index = 0;
    'scan: while index < values.len() {
        if values[index] % 2 == 0 {
            break 'scan;
        }
        index += 1;
    }
    let mut it = values.iter().skip(index);
    while let Some(value) = it.next() {
        return Some(*value);
    }
    None
}

fn parse_twice(text: &str) -> Result<i32, String> {
    let value: i32 = text.trim().parse().map_err(|_| "bad".to_string())?;
    let doubled = Some(value).map(|v| v * 2).ok_or("none")?;
    Ok(doubled)
}

fn halve(value: i32) -> Option<i32> {
    let even = (value % 2 == 0).then_some(value)?;
    Some(even / 2)
}

fn flow(values: &[i32]) -> ControlFlow<i32, i32> {
    let mut sum = 0;
    for value in values {
        let step: ControlFlow<i32, i32> = if *value < 0 { ControlFlow::Break(*value) } else { ControlFlow::Continue(*value) };
        sum += step?;
    }
    ControlFlow::Continue(sum)
}

fn gate(a: bool, b: bool, c: bool) -> bool {
    let both = a && b;
    let either = a || b || c;
    both || (either && !c) || (c && a && (b || !b))
}

fn main() {
    println!("{} {}", total(&[]), total(&[1, 2, 3]));
    println!("{:?} {:?} {:?}", first_even(&[]), first_even(&[1, 3]), first_even(&[1, 4, 6]));
    println!("{:?} {:?}", parse_twice(" 21 "), parse_twice("x"));
    println!("{:?} {:?}", halve(8), halve(7));
    println!("{:?} {:?}", flow(&[1, 2]), flow(&[1, -5, 2]));
    for a in [false, true] {
        for b in [false, true] {
            for c in [false, true] {
                print!("{}", gate(a, b, c) as u8);
            }
        }
    }
    println!();
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        for marker in [
            "::logical((",
            "::for_loop((",
            "::entered(&mut __supercov_loop_",
            "::zero_iterations(__supercov_loop_",
            "::TryProbe::probe((",
        ] {
            assert!(transformed.code.contains(marker), "{marker} missing");
        }
        let kinds = |kind: &str| {
            transformed
                .manifest
                .branches
                .iter()
                .filter(|branch| branch.kind == kind)
                .count()
        };
        assert_eq!(kinds("for-loop"), 3 + 1 + 3);
        assert_eq!(kinds("while-loop"), 2);
        assert_eq!(kinds("try-operator"), 4);
        assert_eq!(kinds("logical-and"), 4);
        assert_eq!(kinds("logical-or"), 5);
        assert!(!transformed.manifest.limitations.iter().any(|limitation| {
            limitation.get("id").and_then(|id| id.as_str())
                == Some("rust-structural-branch-probes-not-yet-injected")
        }));
        let original = compile_and_run(source, "original-structural");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "instrumented-structural",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn cfg_gated_sibling_blocks_keep_their_tail_position() {
        // memchr's is_available returns bool from one of two cfg-gated blocks.
        // A probe PREPENDED to the second block sits between the siblings,
        // survives the cfg strip, and becomes the new `()` tail -- 32 E0308s
        // across the crate. Attributed blocks take the probe inside their
        // braces instead, where the same cfg governs both.
        let source = r#"pub fn is_available() -> bool {
    #[cfg(target_endian = "little")]
    {
        true
    }
    #[cfg(not(target_endian = "little"))]
    {
        false
    }
}

fn main() {
    println!("{}", is_available());
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let original = compile_and_run(source, "cfg-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "cfg-instrumented",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        // The kept block is still probed -- inside its braces.
        assert!(
            transformed
                .code
                .contains("{\n\ncrate::__supercov_runtime_v1::hit(")
                || transformed
                    .code
                    .contains("{\ncrate::__supercov_runtime_v1::hit(")
        );

        // An attributed `let` takes the probe inside its initializer, an
        // attributed expression statement inside a block; a `let` without an
        // initializer is the one shape left declared.
        let attributed_let = r#"fn main() {
    #[cfg(target_endian = "little")]
    let value = 1;
    #[cfg(not(target_endian = "little"))]
    let value = 2;
    #[cfg(target_endian = "little")]
    let borrowed: &String = &String::from("little");
    #[cfg(not(target_endian = "little"))]
    let borrowed: &String = &String::from("big");
    #[cfg(target_endian = "little")]
    print!("le ");
    #[cfg(not(target_endian = "little"))]
    print!("be ");
    #[allow(unused_assignments)]
    let mut later;
    later = value + 1;
    println!("{value} {borrowed} {later}");
}
"#;
        let transformed = instrument_rust_source(
            "src/main.rs",
            attributed_let,
            "crate::__supercov_runtime_v1",
        )
        .unwrap();
        let ids = transformed
            .manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        // Declared only for `let mut later;`.
        assert!(ids.contains("rust-attributed-statement-probes-not-injected"));
        assert!(
            transformed
                .code
                .contains("let value =  { crate::__supercov_runtime_v1::hit(")
        );
        assert!(
            transformed
                .code
                .contains("let borrowed: &String =  { crate::__supercov_runtime_v1::hit(")
        );
        assert!(
            transformed
                .code
                .contains("] { crate::__supercov_runtime_v1::hit(")
        );
        let original = compile_and_run(attributed_let, "cfg-let-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "cfg-let-instrumented",
        );
        assert_eq!(instrumented.status, original.status);
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);

        // A brace macro closing a block is a statement to rustc, so its
        // attributes are legal where an attributed tail expression's are not
        // (tokio: `#[rustfmt::skip] tokio::select! { .. }`). The probe goes
        // before the attributes; a `cfg` there stays declared.
        let trailing_macro = r#"macro_rules! pick { ($e:expr) => { $e } }
fn value() -> i32 {
    let base = 20;
    #[rustfmt::skip]
    pick! { base + 1 }
}
fn effect() {
    #[rustfmt::skip]
    println! { "effect" }
}
fn gated() {
    #[cfg(target_endian = "little")]
    println! { "little" }
}
fn main() {
    effect();
    gated();
    println!("{}", value());
}
"#;
        let transformed = instrument_rust_source(
            "src/main.rs",
            trailing_macro,
            "crate::__supercov_runtime_v1",
        )
        .unwrap();
        assert!(
            transformed
                .code
                .contains("{ crate::__supercov_runtime_v1::hit(\"rs:statement:")
        );
        assert!(
            transformed
                .code
                .contains("); #[rustfmt::skip]\n    pick! { base + 1 } }")
        );
        assert!(
            transformed
                .code
                .contains("); #[rustfmt::skip]\n    println! { \"effect\" } }")
        );
        assert!(
            transformed.code.contains(
                "\n    #[cfg(target_endian = \"little\")]\n    println! { \"little\" }\n"
            )
        );
        let ids = transformed
            .manifest
            .limitations
            .iter()
            .filter_map(limitation_kind_of)
            .collect::<BTreeSet<_>>();
        assert!(ids.contains("rust-attributed-statement-probes-not-injected"));
        let original = compile_and_run(trailing_macro, "trailing-macro-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "trailing-macro-instrumented",
        );
        assert_eq!(
            instrumented.status,
            original.status,
            "{}",
            String::from_utf8_lossy(&instrumented.stderr)
        );
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn an_attributed_macro_statement_keeps_its_macro_in_statement_position() {
        // hyper's `trace!` expands to `#[cfg(feature = "tracing")] { .. }`,
        // which is legal only where the expansion is a statement. Wrapping
        // the call as `#[cfg(..)] { hit; (trace!("..")) }` made it an
        // attributed expression, which is unstable, and hyper did not build.
        let source = r#"macro_rules! trace {
    ($($arg:tt)*) => {
        #[cfg(target_endian = "little")]
        {
            println!($($arg)+);
        }
    }
}
fn manual() {
    #[cfg(any(target_endian = "little", target_endian = "big"))]
    trace!("manual");
    let _ = 1;
}
fn main() {
    manual();
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // The probe is inside the block, ahead of the macro, and the macro
        // keeps its semicolon.
        assert!(
            transformed.code.contains(r#"trace!("manual"); }"#),
            "{}",
            transformed.code
        );
        let original = compile_and_run(source, "attributed-macro-statement-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "attributed-macro-statement-instrumented",
        );
        assert_eq!(
            instrumented.status,
            original.status,
            "{}",
            String::from_utf8_lossy(&instrumented.stderr)
        );
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stderr, original.stderr);
    }

    #[test]
    fn an_attributed_lets_macro_initialiser_keeps_its_value() {
        // The rule that keeps an attributed macro STATEMENT in statement
        // position must not reach a `let` initialiser: tokio's
        // `#[cfg(..)] let coop = ready!(..);` became `let coop = { hit;
        // ready!(..); };`, which is `()`, and the next line called a method
        // on it.
        let source = r#"macro_rules! first {
    ($e:expr) => { $e }
}
fn value(flag: bool) -> i32 {
    #[cfg(any(target_endian = "little", target_endian = "big"))]
    let chosen = first!(if flag { 7 } else { 3 });
    chosen + 1
}
fn main() {
    println!("{}", value(true));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // The initialiser keeps its value: the block ends in the macro, with
        // no semicolon to discard it.
        assert!(
            !transformed
                .code
                .contains("first!(if flag { 7 } else { 3 }); }"),
            "{}",
            transformed.code
        );
        let original = compile_and_run(source, "attributed-let-macro-original");
        let instrumented = compile_and_run(
            &format!("{}\n{NOOP_RUNTIME}", transformed.code),
            "attributed-let-macro-instrumented",
        );
        assert_eq!(
            instrumented.status,
            original.status,
            "{}",
            String::from_utf8_lossy(&instrumented.stderr)
        );
        assert_eq!(instrumented.stdout, original.stdout);
        assert_eq!(instrumented.stdout, b"8\n");
    }

    #[test]
    fn obligations_no_probe_can_reach_are_declined() {
        // A `const fn` body has no runtime to record into, and a
        // `GlobalAlloc` implementation would probe the allocator its probe
        // allocates in. Both were declared and still counted, so smallvec's
        // `TaggedLen` -- four `const fn` methods -- read 0% covered where
        // the independent LLVM coverage oracle reads 89%.
        let source = r#"pub struct Tagged(usize);
impl Tagged {
    pub const fn new(len: usize, on_heap: bool) -> Self {
        Self(if on_heap { len << 1 } else { len })
    }
    pub fn plain(len: usize) -> Self {
        Self(if len > 0 { len } else { 0 })
    }
}
"#;
        let manifest = build_rust_manifest("src/lib.rs", source).unwrap();
        let declined = manifest.unmeasured.iter().collect::<BTreeSet<_>>();
        assert!(!declined.is_empty(), "the const fn was not declined");

        // Everything the const fn holds is declined; the plain one is not.
        let line_of = |id: &str| {
            manifest
                .points
                .iter()
                .find(|point| point.id == id)
                .map(|point| point.line)
                .or_else(|| {
                    manifest
                        .decisions
                        .iter()
                        .find(|decision| decision.id == id)
                        .map(|decision| decision.line)
                })
                .or_else(|| {
                    manifest
                        .branches
                        .iter()
                        .find(|branch| branch.id == id)
                        .map(|branch| branch.line)
                })
        };
        for id in &declined {
            let line = line_of(id).unwrap_or_else(|| panic!("no obligation {id}"));
            assert!(
                (3..=5).contains(&line),
                "declined an obligation outside the const fn, at line {line}"
            );
        }
        let measured = manifest
            .points
            .iter()
            .map(|point| (point.id.clone(), point.line))
            .filter(|(id, _)| !declined.contains(id))
            .collect::<Vec<_>>();
        assert!(
            measured.iter().any(|(_, line)| (6..=8).contains(line)),
            "the plain fn must stay measured: {measured:?}"
        );
    }

    #[test]
    fn a_documented_function_is_reported_where_it_starts() {
        // itertools' `group_by` was reported at the line of its doc comment,
        // three lines above the `fn`, because the node's range begins there.
        let source = r#"/// Documented.
/// Twice.
#[inline]
pub fn documented(value: i32) -> i32 {
    value + 1
}
"#;
        let manifest = build_rust_manifest("src/lib.rs", source).unwrap();
        let point = manifest
            .points
            .iter()
            .find(|point| {
                point.kind == PointKind::Function && point.label.as_deref() == Some("documented")
            })
            .unwrap();
        assert_eq!(point.line, 4, "{point:?}");
        assert!(
            point.source.starts_with("pub fn documented"),
            "{}",
            point.source
        );
    }

    #[test]
    fn rejects_non_crate_local_runtime_paths() {
        assert_eq!(
            instrument_rust_source("src/lib.rs", "fn okay() {}", "supercov::runtime"),
            Err(RustInstrumenterError::InvalidRuntimePath)
        );
    }

    #[test]
    fn rejects_invalid_rust_without_partial_obligations() {
        assert!(matches!(
            build_rust_manifest("src/lib.rs", "fn broken( {\n"),
            Err(RustInstrumenterError::Parse(_))
        ));
    }
}
