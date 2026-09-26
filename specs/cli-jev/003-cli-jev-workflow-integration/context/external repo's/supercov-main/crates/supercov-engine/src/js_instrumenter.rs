//! First oxc-backed vertical slice of the Rust JavaScript instrumenter.
//!
//! This candidate reports and instruments the complete frozen JavaScript
//! denominator, including semantic-safety boundaries and exact wide-decision
//! fallback. It remains private until its generated runtime import, evidence
//! transport, and attribution behavior are defined by Supercov's frozen contracts.

use std::{
    collections::{HashMap, HashSet},
    fmt::Write,
    path::Path,
    sync::Arc,
};

use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64_STANDARD};
use oxc_allocator::{Allocator, CloneIn, TakeIn};
use oxc_ast::{
    AstBuilder, AstKind, NONE,
    ast::{
        Argument, ArrayExpressionElement, ArrowFunctionExpression, AssignmentExpression,
        AssignmentPattern, AssignmentTarget, BindingPattern, CallExpression, CatchClause,
        ChainElement, ChainExpression, Class, Comment, ComputedMemberExpression,
        ConditionalExpression, Declaration, DoWhileStatement, ExportDefaultDeclarationKind,
        Expression, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement,
        ForStatementLeft, FormalParameter, FormalParameterKind, FormalParameters, Function,
        FunctionBody, IfStatement, ImportDeclarationSpecifier, ImportOrExportKind, JSXExpression,
        JSXExpressionContainer, LogicalExpression, NewExpression, ObjectPropertyKind,
        PrivateFieldExpression, Program, PropertyKey, PropertyKind, Statement,
        StaticMemberExpression, SwitchStatement, TSGlobalDeclaration, TSModuleDeclaration,
        TryStatement, VariableDeclaration, VariableDeclarationKind, VariableDeclarator,
        WhileStatement, WithStatement,
    },
};
use oxc_ast_visit::{Visit, VisitMut, walk, walk_mut};
use oxc_codegen::{Codegen, CodegenOptions};
use oxc_parser::Parser;
use oxc_semantic::SemanticBuilder;
use oxc_span::{GetSpan, SourceType, Span};
use oxc_syntax::{
    number::NumberBase,
    operator::{AssignmentOperator, BinaryOperator, LogicalOperator, UnaryOperator},
    scope::ScopeFlags,
    symbol::SymbolId,
};
use oxc_traverse::{Ancestor, Traverse, TraverseCtx, traverse_mut};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateDecision {
    pub id: String,
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub source: String,
    pub conditions: Vec<String>,
    pub kind: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidatePoint {
    pub id: String,
    pub kind: String,
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub source: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateBranchAlternative {
    pub id: String,
    pub label: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateBranch {
    pub id: String,
    pub kind: String,
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub source: String,
    pub alternatives: Vec<CandidateBranchAlternative>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateOutput {
    pub engine: String,
    pub complete: bool,
    pub supported_surface: String,
    pub code: String,
    pub map: Option<serde_json::Value>,
    pub decisions: Vec<CandidateDecision>,
    pub points: Vec<CandidatePoint>,
    /// Source statements erased by the selected TypeScript import policy.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub excluded_statements: Vec<CandidatePoint>,
    pub branches: Vec<CandidateBranch>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub runtime: Option<CandidateRuntime>,
    pub coverage_limitations: Vec<CandidateLimitation>,
    pub limitations: Vec<String>,
}

fn restore_comment_text(
    program: &Program<'_>,
    generated: &str,
    map: oxc_sourcemap::SourceMap,
) -> Result<(String, oxc_sourcemap::SourceMap), CandidateError> {
    if program.comments.is_empty() {
        return Ok((generated.to_string(), map));
    }
    let allocator = Allocator::default();
    let reparsed = Parser::new(&allocator, generated, program.source_type).parse();
    if !reparsed.errors.is_empty() {
        return Err(CandidateError::Parse(
            reparsed
                .errors
                .into_iter()
                .map(|error| error.to_string())
                .collect(),
        ));
    }
    let mut matched = vec![false; program.comments.len()];
    let mut original_index = 0;
    let mut edits = Vec::<(usize, usize, String)>::new();
    for emitted in &reparsed.program.comments {
        let emitted_text = emitted.span.source_text(generated);
        let (index, original) = loop {
            let Some(original) = program.comments.get(original_index) else {
                // The counts are usually equal here, so reporting them alone
                // says the opposite of what happened: nothing was dropped, one
                // comment was not recognised. Name it.
                return Err(CandidateError::CommentPreservation {
                    expected: program.comments.len(),
                    actual: reparsed.program.comments.len(),
                    detail: format!(
                        "no source comment matches the generated comment {emitted_text:?}                          (matched {} before it)",
                        edits.len()
                    ),
                });
            };
            let index = original_index;
            original_index += 1;
            if original.kind == emitted.kind
                && equal_ignoring_whitespace(
                    original.span.source_text(program.source_text),
                    emitted_text,
                )
            {
                break (index, original);
            }
        };
        matched[index] = true;
        edits.push((
            emitted.span.start as usize,
            emitted.span.end as usize,
            original.span.source_text(program.source_text).to_string(),
        ));
    }

    let source_lines = Utf16LineIndex::new(program.source_text);
    let generated_lines = Utf16LineIndex::new(generated);
    let mut mappings = map
        .get_tokens()
        .filter_map(|token| {
            token.get_source_id()?;
            Some((
                source_lines
                    .byte_offset(token.get_src_line() as usize, token.get_src_col() as usize),
                generated_lines
                    .byte_offset(token.get_dst_line() as usize, token.get_dst_col() as usize),
            ))
        })
        .collect::<Vec<_>>();
    mappings.sort_unstable_by_key(|(source, destination)| (*source, *destination));
    let statements = statement_spans(&reparsed.program);
    for (index, original) in program.comments.iter().enumerate() {
        if matched[index] {
            continue;
        }
        let anchor = if original.attached_to > 0 {
            original.attached_to as usize
        } else {
            original.span.end as usize
        };
        let mapping_index = mappings.partition_point(|(source, _)| *source < anchor);
        let mapped = mappings
            .get(mapping_index)
            .map_or(generated.len(), |(_, destination)| *destination);
        let (destination, text) = place_restored_comment(
            generated,
            &statements,
            mapped,
            original,
            original.span.source_text(program.source_text),
        );
        edits.push((destination, destination, text));
    }
    edits.sort_by_key(|(start, end, _)| (*start, *end));
    let restored_len = edits
        .iter()
        .fold(generated.len(), |length, (start, end, text)| {
            length + text.len() - (end - start)
        });
    let mut restored = String::with_capacity(restored_len);
    let mut cursor = 0;
    for (start, end, replacement) in &edits {
        if *start < cursor {
            return Err(CandidateError::CommentPreservation {
                expected: program.comments.len(),
                actual: reparsed.program.comments.len(),
                detail: format!(
                    "restored comments overlap: {replacement:?} would be placed at byte {start},                      behind byte {cursor} already written"
                ),
            });
        }
        restored.push_str(&generated[cursor..*start]);
        restored.push_str(replacement);
        cursor = *end;
    }
    restored.push_str(&generated[cursor..]);
    let map = shift_source_map(map, generated, &restored, &edits);
    Ok((restored, map))
}

/// Every statement span in a program, so a restored comment can be anchored
/// to a statement boundary.
fn statement_spans(program: &Program<'_>) -> Vec<Span> {
    struct Spans(Vec<Span>);
    impl<'a> Visit<'a> for Spans {
        fn visit_statement(&mut self, statement: &Statement<'a>) {
            self.0.push(statement.span());
            walk::walk_statement(self, statement);
        }
    }
    let mut spans = Spans(Vec::new());
    spans.visit_program(program);
    spans.0
}

/// Where a comment the generator dropped goes back in, and with what
/// whitespace around it.
///
/// The mapped position is only a hint: it is where the node the comment was
/// attached to landed, and that can be mid-line. A comment that carries a
/// line break must not be dropped there. After `return`, `throw`, `break`,
/// `continue` or `yield` the break lets automatic semicolon insertion end the
/// statement early -- `return` + newline + JSX parsed as `return;` with the
/// JSX unreachable, and the bundler then removed the whole tree, so a React
/// component rendered nothing under measurement while passing plainly. A `//`
/// comment inserted before more code on the same line comments that code out.
/// Such a comment moves to the start of the innermost statement containing
/// the position, where a line break is always inert. A single-line block
/// comment is inert wherever it sits, so mid-line it stays inline.
fn place_restored_comment(
    generated: &str,
    statements: &[Span],
    mapped: usize,
    comment: &Comment,
    text: &str,
) -> (usize, String) {
    let line_prefix = |offset: usize| generated[..offset].rsplit('\n').next().unwrap_or("");
    let at_line_start = line_prefix(mapped)
        .chars()
        .all(|character| character == ' ' || character == '\t');
    if at_line_start {
        let mut placed = String::new();
        placed.push(if comment.preceded_by_newline() {
            '\n'
        } else {
            ' '
        });
        placed.push_str(text);
        placed.push(if comment.is_line() || comment.followed_by_newline() {
            '\n'
        } else {
            ' '
        });
        return (mapped, placed);
    }
    if !comment.is_line() && !text.contains('\n') {
        let leading = if generated[..mapped].ends_with([' ', '\t']) {
            ""
        } else {
            " "
        };
        return (mapped, format!("{leading}{text} "));
    }
    let Some(statement) = statements
        .iter()
        .filter(|span| span.start as usize <= mapped && mapped < span.end as usize)
        .max_by_key(|span| span.start)
    else {
        return (mapped, format!("\n{text}\n"));
    };
    let start = statement.start as usize;
    let indentation: String = line_prefix(start)
        .chars()
        .take_while(|character| *character == ' ' || *character == '\t')
        .collect();
    (start, format!("{text}\n{indentation}"))
}

/// Whether two comments are the same comment, ignoring how they were laid out
/// and the one escape a JavaScript code generator introduces into them.
///
/// A comment has no escape semantics -- its bytes are its text -- but codegen
/// still rewrites `</script` to `<\/script` inside one, so the output can sit
/// inside an HTML `<script>` element without closing it early. Measured
/// against oxc: that sequence and no other. `</div`, `</style`, `<!--`, `-->`
/// and a bare `/` are all emitted unchanged, as is a `<\/` the author wrote.
///
/// Comparing the two spellings as different text cost the whole file: the
/// matcher below walks originals in order, so one comment it cannot recognise
/// consumes every remaining original and fails the run.
fn equal_ignoring_whitespace(left: &str, right: &str) -> bool {
    fn significant(text: &str) -> impl Iterator<Item = char> + '_ {
        let mut rest = text.char_indices();
        std::iter::from_fn(move || {
            loop {
                let (index, character) = rest.next()?;
                // Normalise both sides, so a `<\/` the author wrote still matches
                // itself and only the codegen artefact is collapsed.
                if character == '\\'
                    && text[index + 1..].starts_with('/')
                    && text[..index].ends_with('<')
                {
                    continue;
                }
                if !character.is_whitespace() {
                    return Some(character);
                }
            }
        })
    }
    significant(left).eq(significant(right))
}

/// Line starts, and for each line how to turn a UTF-16 column into bytes
/// without walking the line from its start.
///
/// Every source-map token is converted, and walking the line made a file with
/// long lines cost the product of its tokens and its line length: recording
/// Actual stopped for more than half an hour inside one such file. An ASCII
/// line's column is its byte offset; a line that is not keeps a checkpoint
/// every `CHECKPOINT` UTF-16 units, so a lookup walks at most that far.
struct Utf16LineIndex<'s> {
    source: &'s str,
    starts: Vec<usize>,
    /// Per line: `None` when ASCII, otherwise `(utf16 column, byte offset)`
    /// checkpoints from the line's start, the first being `(0, 0)`.
    checkpoints: Vec<Option<Vec<(usize, usize)>>>,
}

const CHECKPOINT: usize = 256;

impl<'s> Utf16LineIndex<'s> {
    fn new(source: &'s str) -> Self {
        let mut starts = Vec::with_capacity(source.lines().count() + 1);
        starts.push(0);
        starts.extend(
            source
                .char_indices()
                .filter_map(|(offset, character)| (character == '\n').then_some(offset + 1)),
        );
        let checkpoints = (0..starts.len())
            .map(|line| {
                let end = starts.get(line + 1).copied().unwrap_or(source.len());
                let text = &source[starts[line]..end];
                if text.is_ascii() {
                    return None;
                }
                let mut marks = vec![(0, 0)];
                let mut column = 0;
                for (offset, character) in text.char_indices() {
                    if column >= marks.last().expect("a first mark").0 + CHECKPOINT {
                        marks.push((column, offset));
                    }
                    column += character.len_utf16();
                }
                Some(marks)
            })
            .collect();
        Self {
            source,
            starts,
            checkpoints,
        }
    }

    fn line_end(&self, line: usize) -> usize {
        self.starts
            .get(line + 1)
            .copied()
            .unwrap_or(self.source.len())
    }

    fn byte_offset(&self, target_line: usize, target_utf16_col: usize) -> usize {
        let Some(&start) = self.starts.get(target_line) else {
            return self.source.len();
        };
        let end = self.line_end(target_line);
        match &self.checkpoints[target_line] {
            None => start + target_utf16_col.min(end - start),
            Some(marks) => {
                let at = marks.partition_point(|(column, _)| *column <= target_utf16_col) - 1;
                let (column, offset) = marks[at];
                start
                    + offset
                    + utf16_col_to_byte(
                        &self.source[start + offset..end],
                        target_utf16_col - column,
                    )
            }
        }
    }

    fn line_col(&self, byte_offset: usize) -> (u32, u32) {
        let byte_offset = byte_offset.min(self.source.len());
        let line = self.starts.partition_point(|start| *start <= byte_offset) - 1;
        let start = self.starts[line];
        let column = match &self.checkpoints[line] {
            None => byte_offset - start,
            Some(marks) => {
                let at = marks.partition_point(|(_, offset)| *offset <= byte_offset - start) - 1;
                let (column, offset) = marks[at];
                column
                    + self.source[start + offset..byte_offset]
                        .chars()
                        .map(char::len_utf16)
                        .sum::<usize>()
            }
        };
        (line as u32, column as u32)
    }
}

fn utf16_col_to_byte(line: &str, target_utf16_col: usize) -> usize {
    let mut column = 0;
    for (offset, character) in line.char_indices() {
        if column >= target_utf16_col {
            return offset;
        }
        column += character.len_utf16();
    }
    line.len()
}

fn shift_source_map(
    map: oxc_sourcemap::SourceMap,
    generated: &str,
    restored: &str,
    edits: &[(usize, usize, String)],
) -> oxc_sourcemap::SourceMap {
    let generated_lines = Utf16LineIndex::new(generated);
    let restored_lines = Utf16LineIndex::new(restored);
    let mut edit_index = 0;
    let mut shift = 0isize;
    let tokens = map
        .get_tokens()
        .map(|token| {
            let original_offset = generated_lines
                .byte_offset(token.get_dst_line() as usize, token.get_dst_col() as usize);
            while let Some((start, end, replacement)) = edits.get(edit_index) {
                if *end > original_offset {
                    break;
                }
                shift += replacement.len() as isize - (*end - *start) as isize;
                edit_index += 1;
            }
            let shifted_offset = edits
                .get(edit_index)
                .filter(|(start, end, _)| *start <= original_offset && original_offset < *end)
                .map_or_else(
                    || original_offset.saturating_add_signed(shift),
                    |(start, _, _)| start.saturating_add_signed(shift),
                );
            let (dst_line, dst_col) = restored_lines.line_col(shifted_offset);
            oxc_sourcemap::Token::new(
                dst_line,
                dst_col,
                token.get_src_line(),
                token.get_src_col(),
                token.get_source_id(),
                token.get_name_id(),
            )
        })
        .collect::<Vec<_>>();
    let mut shifted = oxc_sourcemap::SourceMap::new(
        map.get_file().cloned(),
        map.get_names().cloned().collect::<Vec<Arc<str>>>(),
        map.get_source_root().map(str::to_string),
        map.get_sources().cloned().collect::<Vec<Arc<str>>>(),
        map.get_source_contents()
            .map(|content| content.cloned())
            .collect::<Vec<Option<Arc<str>>>>(),
        tokens.into_boxed_slice(),
        None,
    );
    if let Some(ignore_list) = map.get_x_google_ignore_list() {
        shifted.set_x_google_ignore_list(ignore_list.to_vec());
    }
    if let Some(debug_id) = map.get_debug_id() {
        shifted.set_debug_id(debug_id);
    }
    shifted
}

fn generate_candidate(
    program: &Program<'_>,
    file: &str,
) -> Result<(String, Option<serde_json::Value>), CandidateError> {
    let options = CodegenOptions {
        source_map_path: Some(Path::new(file).to_path_buf()),
        ..CodegenOptions::default()
    };
    let generated = Codegen::new().with_options(options).build(program);
    let (code, map) = restore_comment_text(
        program,
        &generated.code,
        generated.map.expect("source maps are enabled"),
    )?;
    let map = Some({
        serde_json::from_str(&map.to_json_string())
            .expect("oxc must serialize its own generated source map")
    });
    Ok((code, map))
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateRuntime {
    pub coverage_hit: String,
    pub mcdc_begin: String,
    pub mcdc_condition: String,
    pub mcdc_end: String,
    pub register_probe_v2: String,
    pub mcdc_end_v2: String,
    pub coverage_hit_v2: String,
    pub probe_file_v2: String,
    pub selection_begin: String,
    pub selection_right: String,
    pub selection_end: String,
    pub parenthesized_assignment_value: String,
    pub with_request_phase: String,
    pub optional_select: String,
    pub rendered_value_v2: String,
    pub optional_call_begin: String,
    pub optional_call_reached: String,
    pub optional_call_continued: String,
    pub optional_call_end: String,
    pub default_selected: String,
    pub default_entered: String,
    pub try_begin: String,
    pub try_catch: String,
    pub try_end: String,
    pub loop_begin: String,
    pub loop_entered: String,
    pub loop_end: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateLimitation {
    pub id: String,
    pub kind: String,
    pub file: String,
    pub line: usize,
    pub column: usize,
    pub source: String,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CandidateError {
    UnknownSourceType(String),
    Parse(Vec<String>),
    CommentPreservation {
        expected: usize,
        actual: usize,
        detail: String,
    },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RuntimeBinding {
    ModuleImport,
    DirectGlobal,
}

const NODE_ASSERT_MODULES: &[&str] = &[
    "assert",
    "assert/strict",
    "node:assert",
    "node:assert/strict",
];
const NODE_ASSERT_METHODS: &[&str] = &[
    "deepEqual",
    "deepStrictEqual",
    "doesNotMatch",
    "doesNotReject",
    "doesNotThrow",
    "equal",
    "fail",
    "ifError",
    "match",
    "notDeepEqual",
    "notDeepStrictEqual",
    "notEqual",
    "notStrictEqual",
    "ok",
    "partialDeepStrictEqual",
    "rejects",
    "strictEqual",
    "throws",
];

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NodeAssertionInstrumentation {
    pub code: String,
    pub assertions: usize,
    pub capability_imports: usize,
}

const CAPABILITY_IMPORT_EXCLUSIONS: &[&str] =
    &["@jest/globals", "@playwright/test", "playwright", "vitest"];

fn capability_source_candidate(source: &str) -> bool {
    // A capability wrapper is useful only when an argument can establish a
    // host/guest workspace mapping. Generic words such as `snapshot`,
    // `machine`, `acquire` and `spawn` are common in tests and application
    // code; treating any of them as sufficient wrapped unrelated framework
    // registration functions and changed their captured callsite.
    let direct_mapping = (source.contains("hostPath") && source.contains("guestPath"))
        || (source.contains("hostRoot") && source.contains("guestRoot"));
    // The guest path is commonly computed (for example
    // `resolve(tmpdir(), "workspace")`), so requiring the literal
    // `/workspace` loses genuine opaque launchers. The nested mount shape is
    // already specific, and the AST pass below still restricts wrapping to
    // the imported root actually called with that argument.
    let mount_mapping =
        source.contains("mounts") && source.contains("source") && source.contains("target");
    direct_mapping || mount_mapping
}

fn excluded_capability_import(source: &str, wrapper: &str) -> bool {
    source == wrapper
        || source.starts_with("node:")
        || source.starts_with("virtual:supercov-")
        || source.contains(".supercov/")
        || CAPABILITY_IMPORT_EXCLUSIONS.contains(&source)
}

fn capability_callee_root(expression: &Expression<'_>) -> Option<String> {
    match expression {
        Expression::Identifier(identifier) => Some(identifier.name.to_string()),
        Expression::StaticMemberExpression(member) => capability_callee_root(&member.object),
        Expression::ComputedMemberExpression(member) => capability_callee_root(&member.object),
        Expression::CallExpression(call) => capability_callee_root(&call.callee),
        Expression::ParenthesizedExpression(parenthesized) => {
            capability_callee_root(&parenthesized.expression)
        }
        Expression::TSAsExpression(expression) => capability_callee_root(&expression.expression),
        Expression::TSSatisfiesExpression(expression) => {
            capability_callee_root(&expression.expression)
        }
        Expression::TSNonNullExpression(expression) => {
            capability_callee_root(&expression.expression)
        }
        Expression::TSTypeAssertion(expression) => capability_callee_root(&expression.expression),
        _ => None,
    }
}

struct CapabilityCallCollector<'s> {
    source: &'s str,
    mapping_variables: HashSet<String>,
    roots: HashSet<String>,
}

impl CapabilityCallCollector<'_> {
    fn argument_has_mapping(&self, argument: &Argument<'_>) -> bool {
        if let Argument::Identifier(identifier) = argument
            && self.mapping_variables.contains(identifier.name.as_str())
        {
            return true;
        }
        capability_source_candidate(source_slice(self.source, argument.span()))
    }
}

impl<'a> Visit<'a> for CapabilityCallCollector<'_> {
    fn visit_variable_declarator(&mut self, declarator: &VariableDeclarator<'a>) {
        if let (BindingPattern::BindingIdentifier(identifier), Some(initializer)) =
            (&declarator.id, &declarator.init)
            && capability_source_candidate(source_slice(self.source, initializer.span()))
        {
            self.mapping_variables.insert(identifier.name.to_string());
        }
        walk::walk_variable_declarator(self, declarator);
    }

    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        if call
            .arguments
            .iter()
            .any(|argument| self.argument_has_mapping(argument))
            && let Some(root) = capability_callee_root(&call.callee)
        {
            self.roots.insert(root);
        }
        walk::walk_call_expression(self, call);
    }
}

fn capability_import_roots(program: &Program<'_>, source: &str) -> HashSet<String> {
    let mut collector = CapabilityCallCollector {
        source,
        mapping_variables: HashSet::new(),
        roots: HashSet::new(),
    };
    // Mapping variables must be known before calls are inspected because a
    // declaration may appear after a function that closes over it.
    collector.visit_program(program);
    let mapping_variables = collector.mapping_variables.clone();
    collector.roots.clear();
    collector.mapping_variables = mapping_variables;
    collector.visit_program(program);
    collector.roots
}

/// One change to a test file's text: `text` replaces `start..end`, an empty
/// range for an insertion. Insertions at one offset are ordered by `rank`, so
/// a wrapper that encloses another opens before it and closes after it.
struct TextEdit {
    start: usize,
    end: usize,
    rank: i64,
    text: String,
}

impl TextEdit {
    fn insert(at: usize, rank: i64, text: String) -> Self {
        Self {
            start: at,
            end: at,
            rank,
            text,
        }
    }

    fn replace(start: usize, end: usize, text: String) -> Self {
        Self {
            start,
            end,
            rank: 0,
            text,
        }
    }
}

/// Apply edits to a test file, keeping every line of it where it was.
///
/// A test file used to be reprinted from its syntax tree to add assertion
/// wrappers, which moved lines and reflowed literals: a `@ts-expect-error`
/// above `period: { period: 'fortnight', amount: 1 }` then sat above a line
/// with no error, and the error surfaced on the next one (TS2578, TS2322).
/// Edits never add or remove a line break, so a directive, a comment and a
/// stack-trace line number all stay where the author put them. The source map
/// maps every copied run of the original back to itself.
fn apply_text_edits(
    source: &str,
    mut edits: Vec<TextEdit>,
    file: &str,
) -> Result<(String, oxc_sourcemap::SourceMap), CandidateError> {
    edits.sort_by_key(|edit| (edit.start, edit.end > edit.start, edit.rank));
    let mut builder = oxc_sourcemap::SourceMapBuilder::default();
    let source_id = builder.set_source_and_content(file, source);
    let mut code = String::with_capacity(source.len() + edits.len() * 64);
    let (mut line, mut column) = (0u32, 0u32);
    let (mut source_line, mut source_column) = (0u32, 0u32);
    let advance = |text: &str, line: &mut u32, column: &mut u32| {
        for unit in text.chars() {
            if unit == '\n' {
                *line += 1;
                *column = 0;
            } else {
                *column += unit.len_utf16() as u32;
            }
        }
    };
    let copy = |from: usize,
                to: usize,
                code: &mut String,
                line: &mut u32,
                column: &mut u32,
                source_line: &mut u32,
                source_column: &mut u32,
                builder: &mut oxc_sourcemap::SourceMapBuilder| {
        for (index, piece) in source[from..to].split('\n').enumerate() {
            if index > 0 {
                code.push('\n');
                *line += 1;
                *column = 0;
                *source_line += 1;
                *source_column = 0;
            }
            if !piece.is_empty() {
                builder.add_token(
                    *line,
                    *column,
                    *source_line,
                    *source_column,
                    Some(source_id),
                    None,
                );
                code.push_str(piece);
                let width = piece.encode_utf16().count() as u32;
                *column += width;
                *source_column += width;
            }
        }
    };
    let mut at = 0;
    for edit in edits {
        if edit.start < at || edit.end > source.len() || edit.start > edit.end {
            return Err(CandidateError::Parse(vec![format!(
                "overlapping assertion edits in {file}"
            )]));
        }
        copy(
            at,
            edit.start,
            &mut code,
            &mut line,
            &mut column,
            &mut source_line,
            &mut source_column,
            &mut builder,
        );
        let removed = &source[edit.start..edit.end];
        if edit.text.matches('\n').count() != removed.matches('\n').count() {
            return Err(CandidateError::Parse(vec![format!(
                "an assertion edit in {file} would move a line"
            )]));
        }
        code.push_str(&edit.text);
        advance(&edit.text, &mut line, &mut column);
        advance(removed, &mut source_line, &mut source_column);
        at = edit.end;
    }
    copy(
        at,
        source.len(),
        &mut code,
        &mut line,
        &mut column,
        &mut source_line,
        &mut source_column,
        &mut builder,
    );
    Ok((code, builder.into_sourcemap()))
}

/// The runtime's assertion helpers as a TypeScript test sees them, declared
/// once at the end of each instrumented file.
///
/// Reading `globalThis.__SUPERCOV_DIRECT_RUNTIME__` without a declaration is
/// an implicit `any` index on `typeof globalThis`, which `tsc --strict` rejects
/// (TS7017) at every wrapped assertion; Actual's browser build failed on 66 of
/// them. A wrapped assertion keeps its own result type, and a bound matcher
/// keeps the method's own signature, overloads included, as `T[K]`: inferring
/// it through a conditional type made generic matchers `never` (TS2349,
/// TS2769). Every instrumented file declares the same type, which TypeScript
/// merges.
const ASSERTION_RUNTIME_TYPE: &str = "{ \
    withNodeAssertionPhase<T>(operation: string, source: string, callback: () => T): T; \
    openNodeAssertionPhase(operation: string, source: string): { close<T>(value: T): T; close(): void; fail(error: unknown): unknown }; \
    bindNodeAssertionPhase<T>(operation: string, source: string, target: T, property: null): T; \
    bindNodeAssertionPhase<T, K extends keyof T>(operation: string, source: string, target: T, property: K): T[K]; \
    bindNodeAssertionPhase(operation: string, source: string, target: unknown, property: PropertyKey): any; \
    }";

const ASSERTION_RUNTIME: &str = "globalThis.__SUPERCOV_DIRECT_RUNTIME__";

/// Where each recognised assertion is wrapped or bound, as text edits.
struct AssertionEdits<'s> {
    source: &'s str,
    sites: HashMap<SpanKey, (String, String, bool)>,
    edits: Vec<TextEdit>,
    /// In TypeScript the call runs in place, under these two names, instead
    /// of in a callback, which TypeScript narrows nothing into.
    in_place: Option<(String, String)>,
}

impl AssertionEdits<'_> {
    fn opening(helper: &str, operation: &str, source: &str) -> String {
        format!(
            "{ASSERTION_RUNTIME}.{helper}({}, {}, ",
            serde_json::to_string(operation).expect("a string serializes"),
            serde_json::to_string(source).expect("a string serializes")
        )
    }

    fn open(operation: &str, source: &str) -> String {
        format!(
            "{ASSERTION_RUNTIME}.openNodeAssertionPhase({}, {})",
            serde_json::to_string(operation).expect("a string serializes"),
            serde_json::to_string(source).expect("a string serializes")
        )
    }

    /// Open the assertion phase around the call, before its arguments run.
    ///
    /// In TypeScript the call stays in its own flow: an immediately invoked
    /// arrow, which TypeScript narrows into, opens the phase as its argument.
    fn wrap(&mut self, call: &CallExpression<'_>, operation: &str, source: &str) {
        let (start, end) = (call.span.start as usize, call.span.end as usize);
        let width = (end - start) as i64;
        let (opening, closing) = match &self.in_place {
            Some((phase, error)) => (
                format!("(({phase}) => {{ try {{ return {phase}.close("),
                format!(
                    "); }} catch ({error}) {{ throw {phase}.fail({error}); }} }})({})",
                    Self::open(operation, source)
                ),
            ),
            None => (
                format!(
                    "{}() => (",
                    Self::opening("withNodeAssertionPhase", operation, source)
                ),
                "))".into(),
            ),
        };
        self.edits.push(TextEdit::insert(start, -width, opening));
        self.edits.push(TextEdit::insert(end, width, closing));
    }

    /// Open the assertion phase around a TypeScript statement that is the
    /// call, leaving the call a statement: an `asserts` signature narrows
    /// only from an expression statement. `finally` closes the phase, so a
    /// call typed `never` leaves nothing after it unreachable.
    fn wrap_statement(
        &mut self,
        statement: &ExpressionStatement<'_>,
        operation: &str,
        source: &str,
    ) {
        let Some((phase, error)) = &self.in_place else {
            return;
        };
        let (start, end) = (statement.span.start as usize, statement.span.end as usize);
        let width = (end - start) as i64;
        let opening = format!(
            "{{ const {phase} = {}; try {{ ",
            Self::open(operation, source)
        );
        let closing = format!(
            " }} catch ({error}) {{ throw {phase}.fail({error}); }} finally {{ {phase}.close(); }} }}"
        );
        self.edits.push(TextEdit::insert(start, -width, opening));
        self.edits.push(TextEdit::insert(end, width, closing));
    }

    /// Bind the original callee and receiver, leaving await and yield operands
    /// in their own function: no async thunk, extra await or new microtask.
    fn bind(&mut self, call: &CallExpression<'_>, operation: &str, source: &str) {
        let callee = call.callee.span();
        let width = (callee.end - callee.start) as i64;
        let opening = Self::opening("bindNodeAssertionPhase", operation, source);
        self.edits
            .push(TextEdit::insert(callee.start as usize, -width, opening));
        match &call.callee {
            Expression::StaticMemberExpression(member) => {
                // `.name` becomes `, "name")`, keeping whatever whitespace and
                // line breaks sat between the receiver and the dot.
                let between = &self.source
                    [member.object.span().end as usize..member.property.span.start as usize];
                let dot = between.rfind('.').unwrap_or(0);
                let mut text = String::from(",");
                text.push_str(&between[..dot]);
                text.push(' ');
                text.push_str(&between[dot + 1..]);
                text.push_str(
                    &serde_json::to_string(member.property.name.as_str())
                        .expect("a string serializes"),
                );
                text.push(')');
                self.edits.push(TextEdit::replace(
                    member.object.span().end as usize,
                    member.property.span.end as usize,
                    text,
                ));
            }
            Expression::ComputedMemberExpression(member) => {
                let object_end = member.object.span().end as usize;
                let open = object_end + self.source[object_end..].find('[').unwrap_or(0);
                self.edits
                    .push(TextEdit::replace(open, open + 1, ",".into()));
                let close = member.span.end as usize - 1;
                self.edits
                    .push(TextEdit::replace(close, close + 1, ")".into()));
            }
            _ => {
                self.edits.push(TextEdit::insert(
                    callee.end as usize,
                    width,
                    ", null)".into(),
                ));
            }
        }
    }
}

impl<'a> Visit<'a> for AssertionEdits<'_> {
    fn visit_expression_statement(&mut self, statement: &ExpressionStatement<'a>) {
        if self.in_place.is_some()
            && let Expression::CallExpression(call) = &statement.expression
            && self
                .sites
                .get(&span_key(call.span))
                .is_some_and(|(_, _, bound)| !bound)
        {
            let (operation, source, _) = self
                .sites
                .remove(&span_key(call.span))
                .expect("the site was just found");
            self.wrap_statement(statement, &operation, &source);
        }
        walk::walk_expression_statement(self, statement);
    }

    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        if let Some((operation, source, bound)) = self.sites.remove(&span_key(call.span)) {
            if bound {
                self.bind(call, &operation, &source);
            } else {
                self.wrap(call, &operation, &source);
            }
        }
        walk::walk_call_expression(self, call);
    }
}

/// `transform_capability_imports` as text edits, for a test file.
fn capability_import_edits(
    program: &Program<'_>,
    source: &str,
    wrapper: &str,
) -> (Vec<TextEdit>, usize) {
    if !capability_source_candidate(source) || !program.source_type.is_module() {
        return (Vec::new(), 0);
    }
    let capability_roots = capability_import_roots(program, source);
    if capability_roots.is_empty() {
        return (Vec::new(), 0);
    }
    let mut names = CandidateNames::new(source);
    let wrapper_local = names.allocate("__supercovImportedCapability");
    let mut edits = Vec::new();
    let mut wrapped = 0;
    for statement in &program.body {
        let Statement::ImportDeclaration(declaration) = statement else {
            continue;
        };
        if declaration.import_kind == ImportOrExportKind::Type
            || excluded_capability_import(declaration.source.value.as_str(), wrapper)
        {
            continue;
        }
        let mut declarators = Vec::new();
        for specifier in declaration.specifiers.iter().flatten() {
            let (local, shorthand) = match specifier {
                ImportDeclarationSpecifier::ImportSpecifier(specifier)
                    if specifier.import_kind == ImportOrExportKind::Type =>
                {
                    continue;
                }
                ImportDeclarationSpecifier::ImportSpecifier(specifier) => (
                    &specifier.local,
                    specifier.imported.span() == specifier.local.span,
                ),
                ImportDeclarationSpecifier::ImportDefaultSpecifier(specifier) => {
                    (&specifier.local, false)
                }
                ImportDeclarationSpecifier::ImportNamespaceSpecifier(specifier) => {
                    (&specifier.local, false)
                }
            };
            let original = local.name.to_string();
            if !capability_roots.contains(&original) {
                continue;
            }
            let raw = names.allocate(&format!("__supercovRaw{original}"));
            if shorthand {
                edits.push(TextEdit::insert(
                    local.span.end as usize,
                    0,
                    format!(" as {raw}"),
                ));
            } else {
                edits.push(TextEdit::replace(
                    local.span.start as usize,
                    local.span.end as usize,
                    raw.clone(),
                ));
            }
            declarators.push(format!("{original} = {wrapper_local}({raw})"));
            wrapped += 1;
        }
        if !declarators.is_empty() {
            edits.push(TextEdit::insert(
                declaration.span.end as usize,
                i64::MAX,
                format!("; const {};", declarators.join(", ")),
            ));
        }
    }
    if wrapped > 0 {
        // First among the imports, as the syntax-tree transform put it, on the
        // first statement's own line.
        let first = program
            .body
            .first()
            .map_or(0, |statement| statement.span().start as usize);
        edits.push(TextEdit::insert(
            first,
            i64::MIN,
            format!(
                "import {{ wrapImportedCapability as {wrapper_local} }} from {}; ",
                serde_json::to_string(wrapper).expect("a string serializes")
            ),
        ));
    }
    (edits, wrapped)
}

/// Wrap value imports that can hide a remote execution capability. This is an
/// ahead-of-run Rust transform; the runtime shim only proxies the imported
/// value and never parses or rewrites source.
fn transform_capability_imports<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    wrapper: &str,
) -> usize {
    if !capability_source_candidate(source) || !program.source_type.is_module() {
        return 0;
    }
    let capability_roots = capability_import_roots(program, source);
    if capability_roots.is_empty() {
        return 0;
    }
    let ast = AstBuilder::new(allocator);
    let mut names = CandidateNames::new(source);
    let wrapper_local = names.allocate("__supercovImportedCapability");
    let mut wrapped = 0;
    let mut output = ast.vec();
    for statement in program.body.take_in(allocator) {
        let Statement::ImportDeclaration(mut declaration) = statement else {
            output.push(statement);
            continue;
        };
        let module_name = declaration.source.value.as_str();
        if declaration.import_kind == ImportOrExportKind::Type
            || excluded_capability_import(module_name, wrapper)
        {
            output.push(Statement::ImportDeclaration(declaration));
            continue;
        }
        let mut declarations = ast.vec();
        for specifier in declaration.specifiers.iter_mut().flatten() {
            let local = match specifier {
                ImportDeclarationSpecifier::ImportSpecifier(specifier)
                    if specifier.import_kind == ImportOrExportKind::Type =>
                {
                    continue;
                }
                ImportDeclarationSpecifier::ImportSpecifier(specifier) => &mut specifier.local,
                ImportDeclarationSpecifier::ImportDefaultSpecifier(specifier) => {
                    &mut specifier.local
                }
                ImportDeclarationSpecifier::ImportNamespaceSpecifier(specifier) => {
                    &mut specifier.local
                }
            };
            let original = local.name.to_string();
            if !capability_roots.contains(&original) {
                continue;
            }
            let raw = names.allocate(&format!("__supercovRaw{original}"));
            local.name = ast.ident(&raw);
            let wrapped_value = ast.expression_call(
                Span::default(),
                ast.expression_identifier(Span::default(), ast.ident(&wrapper_local)),
                NONE,
                ast.vec1(Argument::from(
                    ast.expression_identifier(Span::default(), ast.ident(&raw)),
                )),
                false,
            );
            declarations.push(ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Const,
                ast.binding_pattern_binding_identifier(Span::default(), ast.ident(&original)),
                NONE,
                Some(wrapped_value),
                false,
            ));
            wrapped += 1;
        }
        output.push(Statement::ImportDeclaration(declaration));
        if !declarations.is_empty() {
            output.push(Statement::VariableDeclaration(
                ast.alloc_variable_declaration(
                    Span::default(),
                    VariableDeclarationKind::Const,
                    declarations,
                    false,
                ),
            ));
        }
    }
    if wrapped > 0 {
        output.insert(
            0,
            Statement::ImportDeclaration(ast.alloc_import_declaration(
                Span::default(),
                Some(ast.vec1(ast.import_declaration_specifier_import_specifier(
                    Span::default(),
                    ast.module_export_name_identifier_name(
                        Span::default(),
                        ast.ident("wrapImportedCapability"),
                    ),
                    ast.binding_identifier(Span::default(), ast.ident(&wrapper_local)),
                    ImportOrExportKind::Value,
                ))),
                ast.string_literal(Span::default(), ast.str(wrapper), None),
                None,
                NONE,
                ImportOrExportKind::Value,
            )),
        );
    }
    program.body = output;
    wrapped
}

fn canonical_assert_module(value: &str) -> Option<String> {
    NODE_ASSERT_MODULES.contains(&value).then(|| {
        if value.starts_with("node:") {
            value.into()
        } else {
            format!("node:{value}")
        }
    })
}

fn required_assert_module(
    expression: &Expression<'_>,
    scoping: &oxc_semantic::Scoping,
) -> Option<String> {
    if let Expression::CallExpression(call) = expression
        && matches!(&call.callee, Expression::Identifier(identifier) if identifier.name == "require")
        && matches!(&call.callee, Expression::Identifier(identifier) if referenced_symbol(identifier, scoping).is_none())
        && let [Argument::StringLiteral(module)] = call.arguments.as_slice()
    {
        return canonical_assert_module(module.value.as_str());
    }
    if let Expression::StaticMemberExpression(member) = expression
        && member.property.name == "strict"
        && let Some(module) = required_assert_module(&member.object, scoping)
    {
        return Some(if module == "node:assert" {
            "node:assert/strict".into()
        } else {
            module
        });
    }
    None
}

#[derive(Default)]
struct NodeAssertionBindings {
    objects: HashMap<SymbolId, String>,
    direct: HashMap<SymbolId, String>,
    expects: HashSet<SymbolId>,
    /// Jest (and Jasmine) inject `expect` as a global next to `test`, `it`
    /// and `describe`: a file that reaches for all of those unresolved is a
    /// test file whose bare `expect` is the assertion.
    global_expect: bool,
}

fn bind_object(
    bindings: &mut NodeAssertionBindings,
    identifier: &oxc_ast::ast::BindingIdentifier<'_>,
    module: String,
) {
    if let Some(symbol) = identifier.symbol_id.get() {
        bindings.objects.insert(symbol, module);
    }
}

fn bind_direct(
    bindings: &mut NodeAssertionBindings,
    identifier: &oxc_ast::ast::BindingIdentifier<'_>,
    operation: String,
) {
    if let Some(symbol) = identifier.symbol_id.get() {
        bindings.direct.insert(symbol, operation);
    }
}

fn bind_expect(
    bindings: &mut NodeAssertionBindings,
    identifier: &oxc_ast::ast::BindingIdentifier<'_>,
) {
    if let Some(symbol) = identifier.symbol_id.get() {
        bindings.expects.insert(symbol);
    }
}

struct NodeAssertionBindingCollector<'s> {
    bindings: NodeAssertionBindings,
    scoping: &'s oxc_semantic::Scoping,
    allow_contextual_expect: bool,
    expect_modules: HashSet<String>,
}

impl<'a> Visit<'a> for NodeAssertionBindingCollector<'_> {
    fn visit_import_declaration(&mut self, declaration: &oxc_ast::ast::ImportDeclaration<'a>) {
        let module_name = declaration.source.value.as_str();
        let assert_module = canonical_assert_module(module_name);
        let expect_module =
            self.expect_modules.contains(module_name) || self.allow_contextual_expect;
        for specifier in declaration.specifiers.iter().flatten() {
            match specifier {
                ImportDeclarationSpecifier::ImportDefaultSpecifier(specifier) => {
                    if let Some(module) = &assert_module {
                        bind_object(&mut self.bindings, &specifier.local, module.clone());
                    } else if expect_module && specifier.local.name == "expect" {
                        bind_expect(&mut self.bindings, &specifier.local);
                    }
                }
                ImportDeclarationSpecifier::ImportNamespaceSpecifier(specifier) => {
                    if let Some(module) = &assert_module {
                        bind_object(&mut self.bindings, &specifier.local, module.clone());
                    }
                }
                ImportDeclarationSpecifier::ImportSpecifier(specifier) => {
                    let imported = specifier.imported.name().to_string();
                    if let Some(module) = &assert_module {
                        if imported == "strict" {
                            bind_object(
                                &mut self.bindings,
                                &specifier.local,
                                "node:assert/strict".into(),
                            );
                        } else if NODE_ASSERT_METHODS.contains(&imported.as_str()) {
                            bind_direct(
                                &mut self.bindings,
                                &specifier.local,
                                format!("{module}.{imported}"),
                            );
                        }
                    } else if expect_module && imported == "expect" {
                        bind_expect(&mut self.bindings, &specifier.local);
                    }
                }
            }
        }
        walk::walk_import_declaration(self, declaration);
    }

    fn visit_variable_declarator(&mut self, declarator: &VariableDeclarator<'a>) {
        // CommonJS named expect imports use the same lexical symbol identities
        // as ESM; a local/shadowed require is deliberately not recognized.
        if let Some(Expression::CallExpression(call)) = &declarator.init
            && matches!(&call.callee, Expression::Identifier(i) if i.name == "require" && referenced_symbol(i, self.scoping).is_none())
            && let [Argument::StringLiteral(module)] = call.arguments.as_slice()
            && self.expect_modules.contains(module.value.as_str())
            && let BindingPattern::ObjectPattern(pattern) = &declarator.id
        {
            for property in &pattern.properties {
                if property.key.static_name().as_deref() == Some("expect")
                    && let BindingPattern::BindingIdentifier(local) = &property.value
                {
                    bind_expect(&mut self.bindings, local);
                }
            }
        }
        if let Some(module) = declarator
            .init
            .as_ref()
            .and_then(|expression| required_assert_module(expression, self.scoping))
        {
            match &declarator.id {
                BindingPattern::BindingIdentifier(identifier) => {
                    bind_object(&mut self.bindings, identifier, module);
                }
                BindingPattern::ObjectPattern(pattern) => {
                    for property in &pattern.properties {
                        let Some(imported) = property.key.static_name() else {
                            continue;
                        };
                        let BindingPattern::BindingIdentifier(local) = &property.value else {
                            continue;
                        };
                        if imported == "strict" {
                            bind_object(&mut self.bindings, local, "node:assert/strict".into());
                        } else if NODE_ASSERT_METHODS.contains(&imported.as_ref()) {
                            bind_direct(&mut self.bindings, local, format!("{module}.{imported}"));
                        }
                    }
                }
                _ => {}
            }
        }
        walk::walk_variable_declarator(self, declarator);
    }
}

fn node_assertion_bindings(
    program: &Program<'_>,
    scoping: &oxc_semantic::Scoping,
    extra_expect_modules: &[String],
) -> NodeAssertionBindings {
    let allow_contextual_expect = program.source_text.contains("node:test")
        && program
            .source_text
            .split(|character: char| !character.is_alphanumeric() && character != '_')
            .any(|word| word == "expect");
    let mut collector = NodeAssertionBindingCollector {
        bindings: NodeAssertionBindings::default(),
        scoping,
        allow_contextual_expect,
        expect_modules: ["vitest", "@jest/globals", "expect", "@playwright/test"]
            .into_iter()
            .map(str::to_owned)
            .chain(extra_expect_modules.iter().cloned())
            .collect(),
    };
    collector.visit_program(program);
    let unresolved = scoping.root_unresolved_references();
    let uses = |name: &str| unresolved.contains_key(name);
    collector.bindings.global_expect =
        uses("expect") && (uses("test") || uses("it") || uses("describe"));
    collector.bindings
}

struct NodeAssertionSiteCollector<'s> {
    source: &'s str,
    file: &'s str,
    bindings: &'s NodeAssertionBindings,
    scoping: &'s oxc_semantic::Scoping,
    sites: HashMap<SpanKey, (String, String, bool)>,
    inventory: bool,
}

/// Syntax/binding inventory using the same recognizer as instrumentation.
/// Does not trace assertion operands or infer dependencies.
pub fn assertion_ranges(file: &str, source: &str) -> Result<Vec<(usize, usize, String)>, String> {
    assertion_ranges_with_expect_modules(file, source, &[])
}

/// How a project's JavaScript is parsed: in the script or module mode its
/// extension implies, with JSX allowed. React code is routinely written in
/// `.js` and compiled by Babel, Webpack or Vite, so a `.js` file with JSX in it
/// is ordinary; rejecting it failed a whole run before any test started.
/// Enabling JSX changes nothing for JavaScript without it, because `<` cannot
/// begin an expression there. TypeScript is left alone: in `.ts` a leading `<`
/// is a type assertion, and only `.tsx` means JSX.
pub fn project_source_type(path: &Path) -> Result<SourceType, String> {
    let source_type = SourceType::from_path(path).map_err(|error| error.to_string())?;
    Ok(if source_type.is_typescript() {
        source_type
    } else {
        source_type.with_jsx(true)
    })
}

pub fn assertion_ranges_with_expect_modules(
    file: &str,
    source: &str,
    modules: &[String],
) -> Result<Vec<(usize, usize, String)>, String> {
    let _positions = PositionScope::enter();
    let source_type = project_source_type(Path::new(file))?;
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, source, source_type).parse();
    if !parsed.errors.is_empty() {
        return Err(format!("{} parse errors", parsed.errors.len()));
    }
    let semantic = SemanticBuilder::new().build(&parsed.program).semantic;
    let bindings = node_assertion_bindings(&parsed.program, semantic.scoping(), modules);
    let mut collector = NodeAssertionSiteCollector {
        source,
        file,
        bindings: &bindings,
        scoping: semantic.scoping(),
        sites: HashMap::new(),
        inventory: true,
    };
    collector.visit_program(&parsed.program);
    let mut sites = collector
        .sites
        .into_iter()
        .map(|((start, end), (op, _, _))| (start as usize, end as usize, op))
        .collect::<Vec<_>>();
    sites.sort();
    Ok(sites)
}

fn referenced_symbol(
    identifier: &oxc_ast::ast::IdentifierReference<'_>,
    scoping: &oxc_semantic::Scoping,
) -> Option<SymbolId> {
    identifier
        .reference_id
        .get()
        .and_then(|reference| scoping.get_reference(reference).symbol_id())
}

fn assertion_member_name<'a>(expression: &'a Expression<'a>) -> Option<&'a str> {
    match expression {
        Expression::StaticMemberExpression(member) => Some(member.property.name.as_str()),
        Expression::ComputedMemberExpression(member) => match &member.expression {
            Expression::StringLiteral(literal) => Some(literal.value.as_str()),
            _ => None,
        },
        _ => None,
    }
}

fn assertion_member_object<'a>(expression: &'a Expression<'a>) -> Option<&'a Expression<'a>> {
    match expression {
        Expression::StaticMemberExpression(member) => Some(&member.object),
        Expression::ComputedMemberExpression(member) => Some(&member.object),
        _ => None,
    }
}

fn expect_operation(
    callee: &Expression<'_>,
    bindings: &NodeAssertionBindings,
    scoping: &oxc_semantic::Scoping,
) -> Option<String> {
    let mut current = callee;
    let mut matchers = Vec::new();
    while let Some(name) = assertion_member_name(current) {
        matchers.push(name.to_owned());
        current = assertion_member_object(current)?;
    }
    matchers.reverse();
    let matcher = matchers.last()?;
    if !matcher.starts_with("to") || !matcher.chars().nth(2).is_some_and(char::is_uppercase) {
        return None;
    }
    let Expression::CallExpression(expect_call) = current else {
        return None;
    };
    // `expect(value)` is the usual root, but the assertion APIs wrap it:
    // `expect.element(locator)` in Vitest Browser Mode, `expect.soft(value)`,
    // `expect.poll(fn)`. The receiver is still expect and the matcher is still
    // the assertion, so requiring a bare identifier here made every UI
    // assertion in a browser-mode test invisible -- and an assertion Supercov
    // cannot see can never be mapped or earn credit.
    let mut root = &expect_call.callee;
    let mut prefix = Vec::new();
    while let Some(name) = assertion_member_name(root) {
        prefix.push(name.to_owned());
        root = assertion_member_object(root)?;
    }
    prefix.reverse();
    let Expression::Identifier(identifier) = root else {
        return None;
    };
    let recognized = match referenced_symbol(identifier, scoping) {
        Some(symbol) => bindings.expects.contains(&symbol),
        None => bindings.global_expect && identifier.name == "expect",
    };
    recognized.then(|| {
        let mut parts = prefix;
        parts.extend(matchers.iter().cloned());
        format!("expect.{}", parts.join("."))
    })
}

#[derive(Default)]
struct AwaitYieldScanner {
    found: bool,
}

impl<'a> Visit<'a> for AwaitYieldScanner {
    fn visit_await_expression(&mut self, _expression: &oxc_ast::ast::AwaitExpression<'a>) {
        self.found = true;
    }

    fn visit_yield_expression(&mut self, _expression: &oxc_ast::ast::YieldExpression<'a>) {
        self.found = true;
    }

    fn visit_function(&mut self, _function: &Function<'a>, _flags: ScopeFlags) {}

    fn visit_arrow_function_expression(&mut self, _function: &ArrowFunctionExpression<'a>) {}
}

impl<'a> Visit<'a> for NodeAssertionSiteCollector<'_> {
    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        let operation = match &call.callee {
            Expression::Identifier(identifier) => referenced_symbol(identifier, self.scoping)
                .and_then(|symbol| {
                    self.bindings.direct.get(&symbol).cloned().or_else(|| {
                        self.bindings
                            .objects
                            .get(&symbol)
                            .map(|module| format!("{module}.ok"))
                    })
                }),
            callee => {
                let member_operation = assertion_member_object(callee).and_then(|object| {
                    let Expression::Identifier(identifier) = object else {
                        return None;
                    };
                    let symbol = referenced_symbol(identifier, self.scoping)?;
                    let method = assertion_member_name(callee)?;
                    self.bindings
                        .objects
                        .get(&symbol)
                        .filter(|_| NODE_ASSERT_METHODS.contains(&method))
                        .map(|module| format!("{module}.{method}"))
                });
                member_operation.or_else(|| expect_operation(callee, self.bindings, self.scoping))
            }
        };
        if let Some(operation) = operation {
            let mut unsafe_argument = AwaitYieldScanner::default();
            unsafe_argument.visit_expression(&call.callee);
            for argument in &call.arguments {
                unsafe_argument.visit_argument(argument);
            }
            let optional = call.optional
                || matches!(&call.callee,
                Expression::StaticMemberExpression(m) if m.optional)
                || matches!(&call.callee, Expression::ComputedMemberExpression(m) if m.optional);
            // Keep optional sites in inventory, but never manufacture a passed
            // occurrence when a call can short-circuit before invoking a matcher.
            if optional && !self.inventory {
                walk::walk_call_expression(self, call);
                return;
            }
            let (line, column) = line_and_utf16_column(self.source, call.span.start as usize);
            self.sites.insert(
                span_key(call.span),
                (
                    operation,
                    format!("{}:{line}:{column}", self.file),
                    unsafe_argument.found,
                ),
            );
        }
        walk::walk_call_expression(self, call);
    }
}

/// Attribute native node:assert and node:test expect calls by opening the
/// assertion phase before argument evaluation when possible, or binding the
/// callee when arguments contain await/yield. Lexical symbol identity avoids
/// wrapping a shadowed or merely assert-shaped user binding.
pub fn instrument_node_assertion_phases(
    source: &str,
    file: &str,
) -> Result<NodeAssertionInstrumentation, CandidateError> {
    instrument_node_assertion_phases_with_expect_modules(source, file, &[])
}

pub fn instrument_node_assertion_phases_with_expect_modules(
    source: &str,
    file: &str,
    extra_expect_modules: &[String],
) -> Result<NodeAssertionInstrumentation, CandidateError> {
    instrument_node_assertion_phases_with_runtime_hooks(source, file, extra_expect_modules, None)
}

pub fn instrument_node_assertion_phases_with_runtime_hooks(
    source: &str,
    file: &str,
    extra_expect_modules: &[String],
    capability_wrapper: Option<&str>,
) -> Result<NodeAssertionInstrumentation, CandidateError> {
    instrument_node_assertion_phases_with_runtime_imports(
        source,
        file,
        extra_expect_modules,
        capability_wrapper,
        None,
    )
}

/// Attribute assertions and, for an ESM test module, make the runtime
/// dependency explicit in the transformed module itself. This is required for
/// opaque runners which copy an already-instrumented workspace into another
/// process, container, or VM while constructing a fresh environment. Static
/// imports preserve ESM evaluation ordering and do not depend on runner-specific
/// environment forwarding.
pub fn instrument_node_assertion_phases_with_runtime_imports(
    source: &str,
    file: &str,
    extra_expect_modules: &[String],
    capability_wrapper: Option<&str>,
    assertion_runtime: Option<&str>,
) -> Result<NodeAssertionInstrumentation, CandidateError> {
    let _positions = PositionScope::enter();
    let assertion_candidate = source.contains("assert") || source.contains("expect");
    let capability_candidate = capability_wrapper.is_some() && capability_source_candidate(source);
    if !assertion_candidate && !capability_candidate {
        return Ok(NodeAssertionInstrumentation {
            code: source.into(),
            assertions: 0,
            capability_imports: 0,
        });
    }
    let source_type =
        project_source_type(Path::new(file)).map_err(CandidateError::UnknownSourceType)?;
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, source, source_type).parse();
    if !parsed.errors.is_empty() {
        return Err(CandidateError::Parse(
            parsed
                .errors
                .into_iter()
                .map(|error| error.to_string())
                .collect(),
        ));
    }
    let mut assertions = 0;
    let mut edits = Vec::new();

    if assertion_candidate {
        let semantic = SemanticBuilder::new().build(&parsed.program).semantic;
        let bindings =
            node_assertion_bindings(&parsed.program, semantic.scoping(), extra_expect_modules);
        let mut collector = NodeAssertionSiteCollector {
            source,
            file,
            bindings: &bindings,
            scoping: semantic.scoping(),
            sites: HashMap::new(),
            inventory: false,
        };
        collector.visit_program(&parsed.program);
        assertions = collector.sites.len();
        if assertions > 0 {
            let in_place = source_type.is_typescript().then(|| {
                let mut names = CandidateNames::new(source);
                (
                    names.allocate("__supercovAssertionPhase"),
                    names.allocate("__supercovAssertionError"),
                )
            });
            let mut located = AssertionEdits {
                source,
                sites: collector.sites,
                edits: Vec::new(),
                in_place,
            };
            located.visit_program(&parsed.program);
            edits.extend(located.edits);
        }
    }
    let capability_imports = capability_wrapper.map_or(0, |wrapper| {
        let (found, wrapped) = capability_import_edits(&parsed.program, source, wrapper);
        edits.extend(found);
        wrapped
    });
    if assertions == 0 && capability_imports == 0 {
        return Ok(NodeAssertionInstrumentation {
            code: source.into(),
            assertions: 0,
            capability_imports: 0,
        });
    }
    let module = parsed.program.source_type.is_module();
    let module_assertion_runtime = (assertions > 0 && module)
        .then_some(assertion_runtime)
        .flatten();
    // An inline map is resolved relative to the transformed file itself, and
    // assertion-only transforms replace the file in place, so its basename is
    // the exact source-map reference.
    let reference = Path::new(file)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or(file);
    let (mut code, map) = apply_text_edits(source, edits, reference)?;
    // Append instead of prepend so every line of user code stays where it
    // was. Import declarations are instantiated before module evaluation
    // regardless of their textual position.
    if let Some(runtime) = module_assertion_runtime {
        code.push_str("\nimport ");
        code.push_str(
            &serde_json::to_string(runtime)
                .expect("a JavaScript module specifier always serializes as a string"),
        );
        code.push_str(";\n");
    }
    if assertions > 0 && source_type.is_typescript() {
        if module {
            code.push_str(&format!(
                "\ndeclare global {{ var __SUPERCOV_DIRECT_RUNTIME__: {ASSERTION_RUNTIME_TYPE}; }}\n"
            ));
        } else {
            code.push_str(&format!(
                "\ndeclare var __SUPERCOV_DIRECT_RUNTIME__: {ASSERTION_RUNTIME_TYPE};\n"
            ));
        }
    }
    let map = map.to_json_string();
    code.push_str("\n//# sourceMappingURL=data:application/json;base64,");
    BASE64_STANDARD.encode_string(map, &mut code);
    code.push('\n');
    Ok(NodeAssertionInstrumentation {
        code,
        assertions,
        capability_imports,
    })
}

type SpanKey = (u32, u32);

#[derive(Default)]
struct SafetyAnalysis {
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
    semantic_limitations: Vec<CandidateLimitation>,
    dynamic_limitations: Vec<CandidateLimitation>,
}

struct SafetyScanner<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
    function_limitations: Vec<CandidateLimitation>,
    with_limitations: Vec<CandidateLimitation>,
    dynamic_limitations: Vec<CandidateLimitation>,
    unsafe_function_depth: usize,
    with_depth: usize,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum PointPass {
    Statements,
    Functions,
}

struct PointCollector<'s> {
    source: &'s str,
    file: &'s str,
    pass: PointPass,
    points: Vec<CandidatePoint>,
    statement_targets: HashMap<SpanKey, Vec<String>>,
    function_targets: HashMap<SpanKey, String>,
    rendered_targets: HashMap<SpanKey, String>,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    erased_imports: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    ambient_depth: usize,
}

#[derive(Default)]
struct PointAnalysis {
    points: Vec<CandidatePoint>,
    statement_targets: HashMap<SpanKey, Vec<String>>,
    function_targets: HashMap<SpanKey, String>,
    rendered_targets: HashMap<SpanKey, String>,
}

#[derive(Clone)]
struct PointTarget {
    index: usize,
}

impl PointCollector<'_> {
    fn point(&self, span: Span, kind: &str, label: Option<String>) -> CandidatePoint {
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        CandidatePoint {
            id: stable_id(self.source, self.file, kind, span, ""),
            kind: kind.to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, span).to_string(),
            label,
        }
    }

    fn unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0 || self.ambient_depth > 0
    }

    fn exit_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

fn function_label<State>(
    own_name: Option<&str>,
    context: &TraverseCtx<'_, State>,
) -> Option<String> {
    if let Some(name) = own_name {
        return Some(name.to_string());
    }
    match context.ancestors().next()? {
        Ancestor::ObjectPropertyValue(parent) => property_label(parent.key()),
        Ancestor::MethodDefinitionValue(parent) => property_label(parent.key()),
        Ancestor::VariableDeclaratorInit(parent) => parent
            .id()
            .get_binding_identifier()
            .map(|identifier| identifier.name.to_string()),
        _ => None,
    }
}

fn property_label(key: &PropertyKey<'_>) -> Option<String> {
    key.static_name()
        .map(|name| name.into_owned())
        .or_else(|| match key {
            PropertyKey::Identifier(identifier) => Some(identifier.name.to_string()),
            _ => None,
        })
}

fn function_point_span<State>(span: Span, context: &TraverseCtx<'_, State>) -> Span {
    match context.ancestors().next() {
        Some(Ancestor::ObjectPropertyValue(parent))
            if *parent.method() || *parent.kind() != PropertyKind::Init =>
        {
            *parent.span()
        }
        Some(Ancestor::MethodDefinitionValue(parent)) => *parent.span(),
        _ => span,
    }
}

fn type_only_import(statement: &Statement<'_>) -> bool {
    let Statement::ImportDeclaration(declaration) = statement else {
        return false;
    };
    // Inline `import { type T }` can leave an empty runtime import under
    // verbatimModuleSyntax. Only declaration-level `import type` is universal.
    declaration.import_kind == ImportOrExportKind::Type
}

/// Local binding classification, not dependency/taint analysis. The caller
/// enables implicit elision only for a recognized compiler configuration.
fn erased_imports(program: &Program<'_>, elide_type_imports: bool) -> HashSet<SpanKey> {
    let semantic = SemanticBuilder::new().build(program).semantic;
    let scoping = semantic.scoping();
    program
        .body
        .iter()
        .filter_map(|statement| {
            let Statement::ImportDeclaration(declaration) = statement else {
                return None;
            };
            let erased = declaration.import_kind == ImportOrExportKind::Type
                || (elide_type_imports
                    && program.source_type.is_typescript()
                    && !program.source_type.is_jsx()
                    && declaration.specifiers.as_ref().is_some_and(|specifiers| {
                        !specifiers.is_empty()
                            && specifiers.iter().all(|specifier| {
                                let local = match specifier {
                                    ImportDeclarationSpecifier::ImportSpecifier(s) => {
                                        if s.import_kind == ImportOrExportKind::Type {
                                            return true;
                                        }
                                        &s.local
                                    }
                                    ImportDeclarationSpecifier::ImportDefaultSpecifier(s) => {
                                        &s.local
                                    }
                                    ImportDeclarationSpecifier::ImportNamespaceSpecifier(s) => {
                                        &s.local
                                    }
                                };
                                local.symbol_id.get().is_some_and(|symbol| {
                                    let mut refs =
                                        scoping.get_resolved_references(symbol).peekable();
                                    // An unused binding may be needed by a JSX/decorator
                                    // transform. Only positively identified type uses count.
                                    refs.peek().is_some()
                                        && refs.all(|r| r.is_type() && !r.is_value())
                                })
                            })
                    }));
            erased.then_some(span_key(declaration.span))
        })
        .collect()
}

fn executable_statement(statement: &Statement<'_>) -> bool {
    !matches!(
        statement,
        Statement::BlockStatement(_)
            | Statement::EmptyStatement(_)
            | Statement::FunctionDeclaration(_)
            | Statement::ExportNamedDeclaration(_)
            | Statement::ExportDefaultDeclaration(_)
    ) && !statement.is_typescript_syntax()
        && !type_only_import(statement)
}

impl<'a> Traverse<'a, ()> for PointCollector<'_> {
    fn enter_statement(&mut self, node: &mut Statement<'a>, context: &mut TraverseCtx<'a, ()>) {
        let mut ancestors = context.ancestors();
        let parent = ancestors.next();
        let expression_arrow_body = matches!(parent, Some(Ancestor::FunctionBodyStatements(_)))
            && matches!(ancestors.next(), Some(Ancestor::ArrowFunctionExpressionBody(arrow)) if *arrow.expression());
        if self.pass != PointPass::Statements
            || self.unsafe_context()
            || !executable_statement(node)
            || self.erased_imports.contains(&span_key(node.span()))
            || matches!(parent, Some(Ancestor::LabeledStatementBody(_)))
            || expression_arrow_body
        {
            return;
        }
        let point = self.point(node.span(), "statement", None);
        self.statement_targets
            .entry(span_key(node.span()))
            .or_default()
            .push(point.id.clone());
        self.points.push(point);
    }

    // A JSX tree is one statement, so everything rendered inside it -- an
    // `aria-label={label(state)}`, a child `{formatted(value)}` -- counted as
    // covered the moment the component rendered once, even when that
    // expression never evaluated. It is also the seam a UI assertion attaches
    // to: `toHaveAccessibleName` is about the attribute and `toHaveTextContent`
    // about the child, and with one statement for the whole tree neither could
    // be named apart from the other.
    //
    // Only expressions that can independently fail to evaluate earn a point.
    // A bare identifier or member chain cannot -- it is reached exactly when
    // the enclosing statement is -- and a function is already measured where
    // it is called rather than where it is created.
    fn enter_expression(&mut self, node: &mut Expression<'a>, context: &mut TraverseCtx<'a, ()>) {
        if self.pass != PointPass::Statements
            || self.unsafe_context()
            || !matches!(
                context.ancestors().next(),
                Some(Ancestor::JSXExpressionContainerExpression(_))
            )
            || !rendered_expression_is_measurable(node)
        {
            return;
        }
        let span = node.span();
        let point = self.point(span, "statement", Some("jsx-rendered-expression".into()));
        self.rendered_targets
            .insert(span_key(span), point.id.clone());
        self.points.push(point);
    }

    fn enter_declaration(&mut self, node: &mut Declaration<'a>, context: &mut TraverseCtx<'a, ()>) {
        if self.pass != PointPass::Statements
            || self.unsafe_context()
            || node.is_typescript_syntax()
            || matches!(node, Declaration::FunctionDeclaration(_))
            || !matches!(
                context.ancestors().next(),
                Some(Ancestor::ExportNamedDeclarationDeclaration(_))
                    | Some(Ancestor::ExportDefaultDeclarationDeclaration(_))
            )
        {
            return;
        }
        let point = self.point(node.span(), "statement", None);
        self.statement_targets
            .entry(span_key(node.span()))
            .or_default()
            .push(point.id.clone());
        self.points.push(point);
    }

    fn enter_class(&mut self, node: &mut Class<'a>, context: &mut TraverseCtx<'a, ()>) {
        // oxc represents `export default class` directly inside
        // ExportDefaultDeclarationKind rather than through Declaration, so it
        // does not reach enter_declaration. Babel treats the inner class as the
        // executable statement obligation (excluding the `export default`
        // prefix), which is also the location where the probe belongs.
        if self.pass != PointPass::Statements
            || self.unsafe_context()
            || node.declare
            || !matches!(
                context.ancestors().next(),
                Some(Ancestor::ExportDefaultDeclarationDeclaration(_))
            )
        {
            return;
        }
        let point = self.point(node.span, "statement", None);
        self.statement_targets
            .entry(span_key(node.span))
            .or_default()
            .push(point.id.clone());
        self.points.push(point);
    }

    fn enter_function(&mut self, node: &mut Function<'a>, context: &mut TraverseCtx<'a, ()>) {
        let point_span = function_point_span(node.span, context);
        let label = if point_span == node.span {
            function_label(node.id.as_ref().map(|id| id.name.as_str()), context)
        } else {
            None
        };
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
            return;
        }
        if self.pass == PointPass::Functions && !self.unsafe_context() && node.body.is_some() {
            let point = self.point(point_span, "function", label);
            self.function_targets
                .insert(span_key(node.span), point.id.clone());
            self.points.push(point);
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        context: &mut TraverseCtx<'a, ()>,
    ) {
        let point_span = function_point_span(node.span, context);
        let label = if point_span == node.span {
            function_label(None, context)
        } else {
            None
        };
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
            return;
        }
        if self.pass == PointPass::Functions && !self.unsafe_context() {
            let point = self.point(point_span, "function", label);
            self.function_targets
                .insert(span_key(node.span), point.id.clone());
            self.points.push(point);
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_ts_global_declaration(
        &mut self,
        _node: &mut TSGlobalDeclaration<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.ambient_depth += 1;
    }

    fn exit_ts_global_declaration(
        &mut self,
        _node: &mut TSGlobalDeclaration<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.ambient_depth -= 1;
    }

    fn enter_ts_module_declaration(
        &mut self,
        node: &mut TSModuleDeclaration<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if node.declare {
            self.ambient_depth += 1;
        }
    }

    fn exit_ts_module_declaration(
        &mut self,
        node: &mut TSModuleDeclaration<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if node.declare {
            self.ambient_depth -= 1;
        }
    }
}

/// Whether a JSX expression container holds something that can independently
/// fail to evaluate, and so is worth a coverage obligation of its own.
fn rendered_expression_is_measurable(expression: &Expression<'_>) -> bool {
    match expression {
        // Already measured where it is called.
        Expression::ArrowFunctionExpression(_) | Expression::FunctionExpression(_) => false,
        // Reached exactly when the enclosing statement is.
        Expression::Identifier(_)
        | Expression::ThisExpression(_)
        | Expression::StaticMemberExpression(_)
        | Expression::ComputedMemberExpression(_)
        | Expression::PrivateFieldExpression(_)
        | Expression::JSXElement(_)
        | Expression::JSXFragment(_) => false,
        // `user?.id` is a member access that happens to short-circuit; it is
        // reached with the statement like any other. `user?.load()` is not.
        Expression::ChainExpression(chain) => {
            matches!(chain.expression, ChainElement::CallExpression(_))
        }
        other => !other.is_literal(),
    }
}

fn collect_points<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
    erased_imports: &HashSet<SpanKey>,
) -> PointAnalysis {
    let mut analysis = PointAnalysis::default();
    for pass in [PointPass::Statements, PointPass::Functions] {
        let mut collector = PointCollector {
            source,
            file,
            pass,
            points: Vec::new(),
            statement_targets: HashMap::new(),
            function_targets: HashMap::new(),
            rendered_targets: HashMap::new(),
            source_sensitive_functions,
            erased_imports,
            unsafe_function_depth: 0,
            with_depth: 0,
            ambient_depth: 0,
        };
        traverse_mut(&mut collector, allocator, program, Default::default(), ());
        analysis.points.extend(collector.points);
        analysis
            .statement_targets
            .extend(collector.statement_targets);
        analysis.function_targets.extend(collector.function_targets);
        analysis.rendered_targets.extend(collector.rendered_targets);
    }
    analysis
}

impl<'s> SafetyScanner<'s> {
    fn new(source: &'s str, file: &'s str) -> Self {
        Self {
            source,
            file,
            source_sensitive_functions: HashSet::new(),
            with_statements: HashSet::new(),
            function_limitations: Vec::new(),
            with_limitations: Vec::new(),
            dynamic_limitations: Vec::new(),
            unsafe_function_depth: 0,
            with_depth: 0,
        }
    }

    fn limitation(
        &self,
        span: Span,
        kind: &str,
        suffix: &str,
        reason: &str,
    ) -> CandidateLimitation {
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        CandidateLimitation {
            id: stable_id(self.source, self.file, kind, span, suffix),
            kind: kind.to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, span).to_string(),
            reason: reason.to_string(),
        }
    }

    fn enter_source_sensitive_function<State>(
        &mut self,
        span: Span,
        context: &TraverseCtx<'_, State>,
    ) {
        // A function handed to a compile-time style macro never runs: the
        // bundler's plugin evaluates it while building and replaces the whole
        // call. Probing its body has nothing to measure and breaks the build
        // (StyleX rejects a block-bodied dynamic style). Leave it as source,
        // with no limitation: there is no runtime behavior to lose.
        if compile_time_macro_argument(context) {
            self.source_sensitive_functions.insert(span_key(span));
            self.unsafe_function_depth += 1;
            return;
        }
        let sensitive = observes_function_source(span, context);
        if sensitive {
            self.source_sensitive_functions.insert(span_key(span));
            let limitation = self.limitation(
                span,
                "semantic-safety",
                "function-source",
                "function body is left uninstrumented because this expression observes or coerces Function source text",
            );
            self.function_limitations.push(limitation);
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_source_sensitive_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }

    fn is_unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0
    }
}

impl<'a> Traverse<'a, ()> for SafetyScanner<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, context: &mut TraverseCtx<'a, ()>) {
        self.enter_source_sensitive_function(node.span, context);
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_sensitive_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        context: &mut TraverseCtx<'a, ()>,
    ) {
        self.enter_source_sensitive_function(node.span, context);
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_sensitive_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_statements.insert(span_key(node.span));
        let limitation = self.limitation(
            node.span,
            "semantic-safety",
            "with-environment",
            "with-statement body is left uninstrumented because its object environment can intercept probe identifiers",
        );
        self.with_limitations.push(limitation);
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_call_expression(
        &mut self,
        node: &mut CallExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self.is_unsafe_context() || !expression_is_identifier(&node.callee, "eval") {
            return;
        }
        let limitation = self.limitation(
            node.span,
            "dynamic-code",
            "eval",
            "eval-generated source has no stable pre-run coverage denominator",
        );
        self.dynamic_limitations.push(limitation);
    }

    fn enter_new_expression(
        &mut self,
        node: &mut NewExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self.is_unsafe_context() || !expression_is_identifier(&node.callee, "Function") {
            return;
        }
        let limitation = self.limitation(
            node.span,
            "dynamic-code",
            "Function",
            "Function-generated source has no stable pre-run coverage denominator",
        );
        self.dynamic_limitations.push(limitation);
    }
}

fn analyze_safety<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
) -> SafetyAnalysis {
    // oxc_traverse uses resolved lexical scope IDs while walking ancestry.
    // Building semantics here initializes those IDs without changing the AST.
    SemanticBuilder::new().build(program);
    let mut scanner = SafetyScanner::new(source, file);
    traverse_mut(&mut scanner, allocator, program, Default::default(), ());
    let mut semantic_limitations = scanner.function_limitations;
    semantic_limitations.extend(scanner.with_limitations);
    SafetyAnalysis {
        source_sensitive_functions: scanner.source_sensitive_functions,
        with_statements: scanner.with_statements,
        semantic_limitations,
        dynamic_limitations: scanner.dynamic_limitations,
    }
}

fn span_key(span: Span) -> SpanKey {
    (span.start, span.end)
}

fn expression_is_identifier(expression: &Expression<'_>, name: &str) -> bool {
    matches!(expression, Expression::Identifier(identifier) if identifier.name == name)
}

fn binding_identifier_name(pattern: &BindingPattern<'_>) -> Option<String> {
    match pattern {
        BindingPattern::BindingIdentifier(identifier) => Some(identifier.name.to_string()),
        _ => None,
    }
}

fn expression_is_anonymous_definition(expression: &Expression<'_>) -> bool {
    match expression {
        Expression::ArrowFunctionExpression(_) => true,
        Expression::FunctionExpression(function) => function.id.is_none(),
        Expression::ClassExpression(class) => class.id.is_none(),
        Expression::ParenthesizedExpression(expression) => {
            expression_is_anonymous_definition(&expression.expression)
        }
        Expression::TSAsExpression(expression) => {
            expression_is_anonymous_definition(&expression.expression)
        }
        Expression::TSSatisfiesExpression(expression) => {
            expression_is_anonymous_definition(&expression.expression)
        }
        Expression::TSTypeAssertion(expression) => {
            expression_is_anonymous_definition(&expression.expression)
        }
        Expression::TSNonNullExpression(expression) => {
            expression_is_anonymous_definition(&expression.expression)
        }
        _ => false,
    }
}

struct AssignmentNameSafetyTransformer<'a> {
    ast: AstBuilder<'a>,
    parenthesized_assignment_value: String,
}

impl<'a> VisitMut<'a> for AssignmentNameSafetyTransformer<'a> {
    fn visit_assignment_expression(&mut self, assignment: &mut AssignmentExpression<'a>) {
        walk_mut::walk_assignment_expression(self, assignment);
        let AssignmentTarget::AssignmentTargetIdentifier(identifier) = &assignment.left else {
            return;
        };
        if !(assignment.operator == AssignmentOperator::Assign || assignment.operator.is_logical())
            || assignment.span.start == identifier.span.start
            || !expression_is_anonymous_definition(&assignment.right)
        {
            return;
        }
        let right = assignment.right.take_in(self.ast.allocator);
        assignment.right = self.ast.expression_call(
            Span::default(),
            self.ast.expression_identifier(
                Span::default(),
                self.ast.ident(&self.parenthesized_assignment_value),
            ),
            NONE,
            self.ast.vec_from_array([
                Argument::from(right),
                Argument::from(self.ast.expression_string_literal(
                    Span::default(),
                    identifier.name,
                    None,
                )),
            ]),
            false,
        );
    }
}

/// Compile-time style macros whose arguments the bundler consumes at build
/// time. Only the namespaced form (`stylex.create(...)`) is recognized: it is
/// how the StyleX documentation and its Vite/Babel plugins expect the API to
/// be used, and it needs no binding resolution here.
const COMPILE_TIME_STYLE_MACROS: &[&str] = &[
    "create",
    "createTheme",
    "defineConsts",
    "defineVars",
    "firstThatWorks",
    "keyframes",
    "positionTry",
    "viewTransitionClass",
];

fn compile_time_macro_argument<State>(context: &TraverseCtx<'_, State>) -> bool {
    context.ancestors().any(|ancestor| {
        let Ancestor::CallExpressionArguments(parent) = ancestor else {
            return false;
        };
        let Expression::StaticMemberExpression(member) = parent.callee() else {
            return false;
        };
        let Expression::Identifier(object) = &member.object else {
            return false;
        };
        object.name == "stylex"
            && COMPILE_TIME_STYLE_MACROS.contains(&member.property.name.as_str())
    })
}

fn observes_function_source<State>(span: Span, context: &TraverseCtx<'_, State>) -> bool {
    let mut child_end = span.end;
    for ancestor in context.ancestors() {
        match ancestor {
            Ancestor::ParenthesizedExpressionExpression(parent) => child_end = parent.span().end,
            Ancestor::TSAsExpressionExpression(parent) => child_end = parent.span().end,
            Ancestor::TSSatisfiesExpressionExpression(parent) => child_end = parent.span().end,
            Ancestor::TSTypeAssertionExpression(parent) => child_end = parent.span().end,
            Ancestor::TSNonNullExpressionExpression(parent) => child_end = parent.span().end,
            Ancestor::ConditionalExpressionConsequent(parent) => child_end = parent.span().end,
            Ancestor::ConditionalExpressionAlternate(parent) => child_end = parent.span().end,
            Ancestor::LogicalExpressionLeft(parent) => {
                child_end = parent.span().end;
            }
            Ancestor::LogicalExpressionRight(parent) => {
                child_end = parent.span().end;
            }
            Ancestor::SequenceExpressionExpressions(parent) => {
                if child_end != parent.span().end {
                    return false;
                }
                child_end = parent.span().end;
            }
            Ancestor::AssignmentExpressionRight(parent) => child_end = parent.span().end,
            Ancestor::ObjectPropertyKey(parent) => return *parent.computed(),
            Ancestor::MethodDefinitionKey(parent) => return *parent.computed(),
            Ancestor::PropertyDefinitionKey(parent) => return *parent.computed(),
            Ancestor::AccessorPropertyKey(parent) => return *parent.computed(),
            Ancestor::ComputedMemberExpressionExpression(_) => return true,
            Ancestor::StaticMemberExpressionObject(parent) => {
                return parent.property().name == "toString";
            }
            Ancestor::CallExpressionArguments(parent) => {
                return expression_is_identifier(parent.callee(), "String");
            }
            Ancestor::BinaryExpressionLeft(parent) => {
                return matches!(
                    parent.operator(),
                    BinaryOperator::Addition
                        | BinaryOperator::LessThan
                        | BinaryOperator::LessEqualThan
                        | BinaryOperator::GreaterThan
                        | BinaryOperator::GreaterEqualThan
                );
            }
            Ancestor::BinaryExpressionRight(parent) => {
                return matches!(
                    parent.operator(),
                    BinaryOperator::Addition
                        | BinaryOperator::LessThan
                        | BinaryOperator::LessEqualThan
                        | BinaryOperator::GreaterThan
                        | BinaryOperator::GreaterEqualThan
                );
            }
            _ => return false,
        }
    }
    false
}

pub fn analyze_candidate(source: &str, file: &str) -> Result<CandidateOutput, CandidateError> {
    let _positions = PositionScope::enter();
    let elide_type_imports = false;
    let source_type =
        project_source_type(Path::new(file)).map_err(CandidateError::UnknownSourceType)?;
    let allocator = Allocator::default();
    let mut parsed = Parser::new(&allocator, source, source_type).parse();
    if !parsed.errors.is_empty() {
        return Err(CandidateError::Parse(
            parsed
                .errors
                .into_iter()
                .map(|error| format!("{error:?}"))
                .collect(),
        ));
    }

    let safety = analyze_safety(&allocator, &mut parsed.program, source, file);
    let erased = erased_imports(&parsed.program, elide_type_imports);
    let excluded_statements = parsed
        .program
        .body
        .iter()
        .filter(|s| erased.contains(&span_key(s.span())))
        .map(|s| {
            let span = s.span();
            let (line, column) = line_and_utf16_column(source, span.start as usize);
            CandidatePoint {
                id: stable_id(source, file, "statement", span, ""),
                kind: "statement".into(),
                file: file.into(),
                line,
                column,
                source: source_slice(source, span).into(),
                label: Some("typescript-import-erasure".into()),
            }
        })
        .collect();
    let point_analysis = collect_points(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
        &erased,
    );
    let mut collector = DecisionCollector {
        source,
        file,
        decisions: Vec::new(),
        decision_vector_counts: Vec::new(),
        decision_logical_nodes: HashSet::new(),
        source_sensitive_functions: &safety.source_sensitive_functions,
        with_statements: &safety.with_statements,
    };
    collector.visit_program(&parsed.program);
    let optional_analysis = collect_optional_member_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let call_analysis = collect_optional_call_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let assignment_analysis = collect_logical_assignment_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let default_analysis = collect_default_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let extended_analysis = collect_extended_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let logical_analysis = collect_logical_value_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &collector.decision_logical_nodes,
        &safety.source_sensitive_functions,
    );
    let switch_analysis = collect_switch_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let mut branches = optional_analysis.branches;
    branches.extend(call_analysis.branches);
    branches.extend(assignment_analysis.branches);
    branches.extend(default_analysis.branches);
    branches.extend(extended_analysis.branches);
    branches.extend(logical_analysis.branches);
    branches.extend(switch_analysis.branches);
    let (generated, map) = generate_candidate(&parsed.program, file)?;
    Ok(CandidateOutput {
        engine: "rust-oxc".to_string(),
        complete: false,
        supported_surface: "control-decision-manifest-v1".to_string(),
        code: generated,
        map,
        decisions: collector.decisions,
        points: point_analysis.points,
        excluded_statements,
        branches,
        runtime: None,
        coverage_limitations: {
            let mut limitations = safety.semantic_limitations;
            limitations.extend(call_analysis.limitations);
            limitations.extend(default_analysis.limitations);
            limitations.extend(safety.dynamic_limitations);
            limitations
        },
        limitations: vec![
            "candidate emits metadata only; use the private differential transform for probes"
                .to_string(),
            "coverage points, value branches, and extended branch obligations are not included"
                .to_string(),
        ],
    })
}

fn json_expression<'a>(ast: AstBuilder<'a>, value: &serde_json::Value) -> Expression<'a> {
    match value {
        serde_json::Value::Null => ast.expression_null_literal(Span::default()),
        serde_json::Value::Bool(value) => ast.expression_boolean_literal(Span::default(), *value),
        serde_json::Value::Number(value) => ast.expression_numeric_literal(
            Span::default(),
            value
                .as_f64()
                .expect("coverage registration numbers must fit JavaScript"),
            None,
            NumberBase::Decimal,
        ),
        serde_json::Value::String(value) => {
            ast.expression_string_literal(Span::default(), ast.str(value), None)
        }
        serde_json::Value::Array(values) => ast.expression_array(
            Span::default(),
            ast.vec_from_iter(
                values
                    .iter()
                    .map(|value| ArrayExpressionElement::from(json_expression(ast, value))),
            ),
        ),
        serde_json::Value::Object(properties) => ast.expression_object(
            Span::default(),
            ast.vec_from_iter(properties.iter().map(|(key, value)| {
                ast.object_property_kind_object_property(
                    Span::default(),
                    PropertyKind::Init,
                    ast.property_key_static_identifier(Span::default(), ast.ident(key)),
                    json_expression(ast, value),
                    false,
                    false,
                    false,
                )
            })),
        ),
    }
}

/// Instrument JavaScript with the complete frozen v1 denominator and probe-v2
/// runtime ABI. The source-transform contract is complete and independently
/// conformance-tested; selection of the Rust engine remains private until the
/// Phase 4 CLI/orchestration cutover is complete.
pub fn instrument_candidate(source: &str, file: &str) -> Result<CandidateOutput, CandidateError> {
    instrument_candidate_with_binding(source, file, RuntimeBinding::ModuleImport, None, false)
}

pub fn instrument_candidate_with_runtime_hooks(
    source: &str,
    file: &str,
    capability_wrapper: &str,
) -> Result<CandidateOutput, CandidateError> {
    instrument_candidate_with_binding(
        source,
        file,
        RuntimeBinding::ModuleImport,
        Some(capability_wrapper),
        false,
    )
}

/// Emit code for an isolated source-executing workspace. Unlike the module-
/// import form, this has no virtual module dependency: the generated
/// Node preload installs the frozen runtime on this global before user modules
/// evaluate.
pub fn instrument_direct_candidate(
    source: &str,
    file: &str,
) -> Result<CandidateOutput, CandidateError> {
    instrument_candidate_with_binding(source, file, RuntimeBinding::DirectGlobal, None, false)
}

pub fn instrument_direct_candidate_with_runtime_hooks(
    source: &str,
    file: &str,
    capability_wrapper: &str,
) -> Result<CandidateOutput, CandidateError> {
    instrument_candidate_with_binding(
        source,
        file,
        RuntimeBinding::DirectGlobal,
        Some(capability_wrapper),
        false,
    )
}

pub fn instrument_with_import_policy(
    source: &str,
    file: &str,
    capability_wrapper: &str,
    direct: bool,
    elide_type_imports: bool,
) -> Result<CandidateOutput, CandidateError> {
    instrument_candidate_with_binding(
        source,
        file,
        if direct {
            RuntimeBinding::DirectGlobal
        } else {
            RuntimeBinding::ModuleImport
        },
        Some(capability_wrapper),
        elide_type_imports,
    )
}

fn instrument_candidate_with_binding(
    source: &str,
    file: &str,
    runtime_binding: RuntimeBinding,
    capability_wrapper: Option<&str>,
    elide_type_imports: bool,
) -> Result<CandidateOutput, CandidateError> {
    let _positions = PositionScope::enter();
    let source_type =
        project_source_type(Path::new(file)).map_err(CandidateError::UnknownSourceType)?;
    let allocator = Allocator::default();
    let mut parsed = Parser::new(&allocator, source, source_type).parse();
    if !parsed.errors.is_empty() {
        return Err(CandidateError::Parse(
            parsed
                .errors
                .into_iter()
                .map(|error| format!("{error:?}"))
                .collect(),
        ));
    }

    let safety = analyze_safety(&allocator, &mut parsed.program, source, file);
    let erased = erased_imports(&parsed.program, elide_type_imports);
    let excluded_statements = parsed
        .program
        .body
        .iter()
        .filter(|s| erased.contains(&span_key(s.span())))
        .map(|s| {
            let span = s.span();
            let (line, column) = line_and_utf16_column(source, span.start as usize);
            CandidatePoint {
                id: stable_id(source, file, "statement", span, ""),
                kind: "statement".into(),
                file: file.into(),
                line,
                column,
                source: source_slice(source, span).into(),
                label: Some("typescript-import-erasure".into()),
            }
        })
        .collect();
    let point_analysis = collect_points(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
        &erased,
    );
    let mut collector = DecisionCollector {
        source,
        file,
        decisions: Vec::new(),
        decision_vector_counts: Vec::new(),
        decision_logical_nodes: HashSet::new(),
        source_sensitive_functions: &safety.source_sensitive_functions,
        with_statements: &safety.with_statements,
    };
    collector.visit_program(&parsed.program);
    let optional_analysis = collect_optional_member_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let call_analysis = collect_optional_call_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let assignment_analysis = collect_logical_assignment_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let default_analysis = collect_default_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let extended_analysis = collect_extended_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let logical_analysis = collect_logical_value_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &collector.decision_logical_nodes,
        &safety.source_sensitive_functions,
    );
    let switch_analysis = collect_switch_branches(
        &allocator,
        &mut parsed.program,
        source,
        file,
        &safety.source_sensitive_functions,
    );
    let mut branches = optional_analysis.branches;
    branches.extend(call_analysis.branches.clone());
    branches.extend(assignment_analysis.branches);
    branches.extend(default_analysis.branches.clone());
    branches.extend(extended_analysis.branches.clone());
    branches.extend(logical_analysis.branches);
    branches.extend(switch_analysis.branches.clone());

    // Direct-runtime output can be served as several classic scripts in one
    // document, and every classic script shares the page's global lexical
    // scope: two files declaring `const __supercovMcdcBegin` is a SyntaxError
    // on the second, and a shared probe-file binding would credit one file's
    // statements to another. Names are made unique per file, and declared with
    // `var` so a script included twice is still legal, as it was before.
    let (namespace, runtime_declaration_kind) = if runtime_binding == RuntimeBinding::DirectGlobal {
        (
            format!(
                "_{}",
                &stable_id("", file, "runtime", Span::default(), "")[..8]
            ),
            VariableDeclarationKind::Var,
        )
    } else {
        (String::new(), VariableDeclarationKind::Const)
    };
    let mut names = CandidateNames::within(source, &namespace);
    let mcdc_begin = names.allocate("__supercovMcdcBegin");
    let mcdc_condition = names.allocate("__supercovMcdcCondition");
    let mcdc_end = names.allocate("__supercovMcdcEnd");
    let coverage_hit = names.allocate("__supercovCoverageHit");
    let register_probe_v2 = names.allocate("__supercovRegisterProbeV2");
    let mcdc_end_v2 = names.allocate("__supercovMcdcEndV2");
    let coverage_hit_v2 = names.allocate("__supercovCoverageHitV2");
    let probe_file_v2 = names.allocate("__supercovProbeFileV2");
    let _probe_clock_v2 = names.allocate("__supercovProbeClockV2");
    let _probe_hits_v2 = names.allocate("__supercovProbeHitsV2");
    let _probe_decisions_v2 = names.allocate("__supercovProbeDecisionsV2");
    let _probe_complete_v2 = names.allocate("__supercovProbeCompleteV2");
    let selection_begin = names.allocate("__supercovSelectionBegin");
    let selection_right = names.allocate("__supercovSelectionRight");
    let selection_end = names.allocate("__supercovSelectionEnd");
    let parenthesized_assignment_value = names.allocate("__supercovParenthesizedAssignmentValue");
    let with_request_phase = names.allocate("__supercovWithRequestPhase");
    let optional_select = names.allocate("__supercovOptionalSelect");
    let rendered_value_v2 = names.allocate("__supercovRenderedValueV2");
    let optional_call_begin = names.allocate("__supercovOptionalCallBegin");
    let optional_call_reached = names.allocate("__supercovOptionalCallReached");
    let optional_call_continued = names.allocate("__supercovOptionalCallContinued");
    let optional_call_end = names.allocate("__supercovOptionalCallEnd");
    let default_selected = names.allocate("__supercovDefaultSelected");
    let default_entered = names.allocate("__supercovDefaultEntered");
    let try_begin = names.allocate("__supercovTryBegin");
    let try_catch = names.allocate("__supercovTryCatch");
    let try_end = names.allocate("__supercovTryEnd");
    let loop_begin = names.allocate("__supercovLoopBegin");
    let loop_entered = names.allocate("__supercovLoopEntered");
    let loop_end = names.allocate("__supercovLoopEnd");
    let ast = AstBuilder::new(&allocator);
    let mut assignment_name_safety = AssignmentNameSafetyTransformer {
        ast,
        parenthesized_assignment_value: parenthesized_assignment_value.clone(),
    };
    assignment_name_safety.visit_program(&mut parsed.program);
    let point_indices = point_analysis
        .points
        .iter()
        .enumerate()
        .map(|(index, point)| (point.id.clone(), index))
        .collect::<HashMap<_, _>>();
    let statement_targets = point_analysis
        .statement_targets
        .into_iter()
        .map(|(span, ids)| {
            (
                span,
                ids.into_iter()
                    .map(|id| PointTarget {
                        index: *point_indices
                            .get(&id)
                            .expect("statement point must have a global index"),
                    })
                    .collect(),
            )
        })
        .collect();
    let function_targets = point_analysis
        .function_targets
        .into_iter()
        .map(|(span, id)| {
            (
                span,
                PointTarget {
                    index: *point_indices
                        .get(&id)
                        .expect("function point must have a global index"),
                },
            )
        })
        .collect();
    let rendered_targets = point_analysis
        .rendered_targets
        .into_iter()
        .map(|(span, id)| {
            (
                span,
                PointTarget {
                    index: *point_indices
                        .get(&id)
                        .expect("rendered point must have a global index"),
                },
            )
        })
        .collect();
    let mut statement_transformer = StatementProbeTransformer {
        ast,
        coverage_hit_v2: coverage_hit_v2.clone(),
        probe_file_v2: probe_file_v2.clone(),
        targets: statement_targets,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    statement_transformer.visit_program(&mut parsed.program);
    let mut function_transformer = FunctionProbeTransformer {
        ast,
        coverage_hit_v2: coverage_hit_v2.clone(),
        probe_file_v2: probe_file_v2.clone(),
        targets: function_targets,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
    };
    function_transformer.visit_program(&mut parsed.program);
    let mut rendered_transformer = RenderedExpressionTransformer {
        ast,
        rendered_value_v2: rendered_value_v2.clone(),
        probe_file_v2: probe_file_v2.clone(),
        targets: rendered_targets,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
    };
    rendered_transformer.visit_program(&mut parsed.program);
    let mut optional_transformer = OptionalMemberTransformer {
        ast,
        optional_select: optional_select.clone(),
        targets: optional_analysis.targets,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    optional_transformer.visit_program(&mut parsed.program);
    let mut call_transformer = OptionalCallTransformer::new(
        ast,
        source,
        optional_call_begin.clone(),
        optional_call_reached.clone(),
        optional_call_continued.clone(),
        optional_call_end.clone(),
        call_analysis.sites,
        call_analysis.roots,
        safety.source_sensitive_functions.clone(),
        safety.with_statements.clone(),
    );
    call_transformer.visit_program(&mut parsed.program);
    let mut default_transformer = DefaultTransformer {
        ast,
        default_selected: default_selected.clone(),
        default_entered: default_entered.clone(),
        parameter_targets: default_analysis.parameter_targets,
        binding_targets: default_analysis.binding_targets,
        function_entries: Vec::new(),
        declaration_entries: HashMap::new(),
        active_declaration: Vec::new(),
        parameter_pattern_depth: 0,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    default_transformer.visit_program(&mut parsed.program);
    let mut extended_transformer = ExtendedTransformer {
        ast,
        try_begin: try_begin.clone(),
        try_catch: try_catch.clone(),
        try_end: try_end.clone(),
        loop_begin: loop_begin.clone(),
        loop_entered: loop_entered.clone(),
        loop_end: loop_end.clone(),
        try_targets: extended_analysis.try_targets,
        loop_targets: extended_analysis.loop_targets,
        names: CandidateNames::within(source, &namespace),
        scope_declarations: Vec::new(),
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    extended_transformer.visit_program(&mut parsed.program);
    let mut transformer = ControlProbeV2Transformer {
        ast,
        decisions: &collector.decisions,
        mcdc_begin: mcdc_begin.clone(),
        mcdc_condition: mcdc_condition.clone(),
        mcdc_end: mcdc_end.clone(),
        mcdc_end_v2: mcdc_end_v2.clone(),
        probe_file_v2: probe_file_v2.clone(),
        names,
        scope_declarations: Vec::new(),
        decision_index: 0,
        parameter_depth: 0,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    transformer.visit_program(&mut parsed.program);
    let mut logical_transformer = LogicalValueTransformer {
        ast,
        selection_begin: selection_begin.clone(),
        selection_right: selection_right.clone(),
        selection_end: selection_end.clone(),
        names: CandidateNames::within(source, &namespace),
        scope_declarations: Vec::new(),
        logical_targets: logical_analysis.logical_targets,
        assignment_targets: assignment_analysis.targets,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    logical_transformer.visit_program(&mut parsed.program);
    let mut switch_transformer = SwitchTransformer {
        ast,
        coverage_hit: coverage_hit.clone(),
        targets: switch_analysis.targets,
        names: CandidateNames::within(source, &namespace),
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    switch_transformer.visit_program(&mut parsed.program);
    let mut route_transformer = RouteRequestPhaseTransformer {
        ast,
        file,
        with_request_phase: with_request_phase.clone(),
        used: false,
        names: CandidateNames::within(source, &namespace),
    };
    route_transformer.transform_program(&mut parsed.program);
    let mut request_transformer = RequestPhaseTransformer {
        ast,
        with_request_phase: with_request_phase.clone(),
        used: route_transformer.used,
        source_sensitive_functions: safety.source_sensitive_functions.clone(),
        with_statements: safety.with_statements.clone(),
    };
    request_transformer.visit_program(&mut parsed.program);
    let uses_request_phase = request_transformer.used;

    let registration = serde_json::json!({
        "decisions": &collector.decisions,
        "pointIds": point_analysis.points.iter().map(|point| &point.id).collect::<Vec<_>>(),
        "decisionVectorCounts": &collector.decision_vector_counts,
    });
    let registration_call = ast.expression_call(
        Span::default(),
        ast.expression_identifier(Span::default(), ast.ident(&register_probe_v2)),
        NONE,
        ast.vec1(Argument::from(json_expression(ast, &registration))),
        false,
    );
    parsed.program.body.insert(
        0,
        Statement::VariableDeclaration(ast.alloc_variable_declaration(
            Span::default(),
            runtime_declaration_kind,
            ast.vec1(ast.variable_declarator(
                Span::default(),
                runtime_declaration_kind,
                ast.binding_pattern_binding_identifier(Span::default(), ast.ident(&probe_file_v2)),
                NONE,
                Some(registration_call),
                false,
            )),
            false,
        )),
    );
    let mut runtime_imports = vec![
        ("mcdcBegin", &mcdc_begin),
        ("mcdcCondition", &mcdc_condition),
        ("mcdcEnd", &mcdc_end),
        ("coverageHit", &coverage_hit),
        ("registerProbeV2", &register_probe_v2),
        ("mcdcEndV2", &mcdc_end_v2),
        ("coverageHitV2", &coverage_hit_v2),
        ("selectionBegin", &selection_begin),
        ("selectionRight", &selection_right),
        ("selectionEnd", &selection_end),
        (
            "parenthesizedAssignmentValue",
            &parenthesized_assignment_value,
        ),
        ("optionalSelect", &optional_select),
        ("renderedValueV2", &rendered_value_v2),
        ("optionalCallBegin", &optional_call_begin),
        ("optionalCallReached", &optional_call_reached),
        ("optionalCallContinued", &optional_call_continued),
        ("optionalCallEnd", &optional_call_end),
        ("defaultSelected", &default_selected),
        ("defaultEntered", &default_entered),
        ("tryBegin", &try_begin),
        ("tryCatch", &try_catch),
        ("tryEnd", &try_end),
        ("loopBegin", &loop_begin),
        ("loopEntered", &loop_entered),
        ("loopEnd", &loop_end),
    ];
    if uses_request_phase {
        runtime_imports.insert(10, ("withRequestPhase", &with_request_phase));
    }
    if runtime_binding == RuntimeBinding::DirectGlobal || parsed.program.source_type.is_script() {
        let declarators =
            ast.vec_from_iter(runtime_imports.into_iter().map(|(imported, local)| {
                let global_runtime =
                    Expression::StaticMemberExpression(ast.alloc_static_member_expression(
                        Span::default(),
                        ast.expression_identifier(Span::default(), ast.ident("globalThis")),
                        ast.identifier_name(
                            Span::default(),
                            ast.ident(if runtime_binding == RuntimeBinding::DirectGlobal {
                                "__SUPERCOV_DIRECT_RUNTIME__"
                            } else {
                                "__supercovRuntime"
                            }),
                        ),
                        false,
                    ));
                let runtime_helper =
                    Expression::StaticMemberExpression(ast.alloc_static_member_expression(
                        Span::default(),
                        global_runtime,
                        ast.identifier_name(Span::default(), ast.ident(imported)),
                        false,
                    ));
                ast.variable_declarator(
                    Span::default(),
                    runtime_declaration_kind,
                    ast.binding_pattern_binding_identifier(Span::default(), ast.ident(local)),
                    NONE,
                    Some(runtime_helper),
                    false,
                )
            }));
        parsed.program.body.insert(
            0,
            Statement::VariableDeclaration(ast.alloc_variable_declaration(
                Span::default(),
                runtime_declaration_kind,
                declarators,
                false,
            )),
        );
    } else {
        let import_specifiers =
            ast.vec_from_iter(runtime_imports.into_iter().map(|(imported, local)| {
                ast.import_declaration_specifier_import_specifier(
                    Span::default(),
                    ast.module_export_name_identifier_name(Span::default(), ast.ident(imported)),
                    ast.binding_identifier(Span::default(), ast.ident(local)),
                    oxc_ast::ast::ImportOrExportKind::Value,
                )
            }));
        parsed.program.body.insert(
            0,
            Statement::ImportDeclaration(ast.alloc_import_declaration(
                Span::default(),
                Some(import_specifiers),
                ast.string_literal(Span::default(), ast.str("virtual:supercov-runtime"), None),
                None,
                NONE,
                oxc_ast::ast::ImportOrExportKind::Value,
            )),
        );
    }

    if let Some(wrapper) = capability_wrapper {
        transform_capability_imports(&allocator, &mut parsed.program, source, wrapper);
    }
    let limitations = Vec::new();
    let (code, map) = generate_candidate(&parsed.program, file)?;
    Ok(CandidateOutput {
        engine: "rust-oxc".to_string(),
        complete: true,
        supported_surface: "complete-js-instrumenter-v1".to_string(),
        code,
        map,
        decisions: collector.decisions,
        points: point_analysis.points,
        excluded_statements,
        branches,
        runtime: Some(CandidateRuntime {
            coverage_hit,
            mcdc_begin,
            mcdc_condition,
            mcdc_end,
            register_probe_v2,
            mcdc_end_v2,
            coverage_hit_v2,
            probe_file_v2,
            selection_begin,
            selection_right,
            selection_end,
            parenthesized_assignment_value,
            with_request_phase,
            optional_select,
            rendered_value_v2,
            optional_call_begin,
            optional_call_reached,
            optional_call_continued,
            optional_call_end,
            default_selected,
            default_entered,
            try_begin,
            try_catch,
            try_end,
            loop_begin,
            loop_entered,
            loop_end,
        }),
        coverage_limitations: {
            let mut limitations = safety.semantic_limitations;
            limitations.extend(call_analysis.limitations);
            limitations.extend(default_analysis.limitations);
            limitations.extend(safety.dynamic_limitations);
            limitations
        },
        limitations,
    })
}

/// `file.clock.fast && file.hitEpochs[index] === file.clock.epoch || hit(file, index);`
///
/// A statement probe that already fired in this context costs three loads and
/// a comparison, not a call: in minimatch's backtracking matcher the call per
/// statement was most of a tenfold slowdown, and its guard test failed. The
/// clock is `fast` only while an async hook keeps its epoch current; without
/// one the call decides, as before.
fn probe_v2_hit<'a>(ast: AstBuilder<'a>, hit: &str, file: &str, index: usize) -> Statement<'a> {
    let span = Span::default();
    let file_expression = || ast.expression_identifier(span, ast.ident(file));
    let member = |object: Expression<'a>, name: &str| -> Expression<'a> {
        Expression::from(ast.member_expression_static(
            span,
            object,
            ast.identifier_name(span, ast.ident(name)),
            false,
        ))
    };
    let index_literal =
        || ast.expression_numeric_literal(span, index as f64, None, NumberBase::Decimal);
    let fast = member(member(file_expression(), "clock"), "fast");
    let seen = ast.expression_binary(
        span,
        Expression::from(ast.member_expression_computed(
            span,
            member(file_expression(), "hitEpochs"),
            index_literal(),
            false,
        )),
        BinaryOperator::StrictEquality,
        member(member(file_expression(), "clock"), "epoch"),
    );
    let call = ast.expression_call(
        span,
        ast.expression_identifier(span, ast.ident(hit)),
        NONE,
        ast.vec_from_array([
            Argument::from(file_expression()),
            Argument::from(index_literal()),
        ]),
        false,
    );
    ast.statement_expression(
        span,
        ast.expression_logical(
            span,
            ast.expression_logical(span, fast, LogicalOperator::And, seen),
            LogicalOperator::Or,
            call,
        ),
    )
}

struct StatementProbeTransformer<'a> {
    ast: AstBuilder<'a>,
    coverage_hit_v2: String,
    probe_file_v2: String,
    targets: HashMap<SpanKey, Vec<PointTarget>>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> StatementProbeTransformer<'a> {
    fn probe(&self, target: &PointTarget) -> Statement<'a> {
        probe_v2_hit(
            self.ast,
            &self.coverage_hit_v2,
            &self.probe_file_v2,
            target.index,
        )
    }

    fn take_statement_ids(&mut self, statement: &Statement<'a>) -> Vec<PointTarget> {
        let mut ids = self
            .targets
            .remove(&span_key(statement.span()))
            .unwrap_or_default();
        if let Statement::ExportNamedDeclaration(export) = statement
            && let Some(declaration) = &export.declaration
            && let Some(nested) = self.targets.remove(&span_key(declaration.span()))
        {
            ids.extend(nested);
        }
        if let Statement::ExportDefaultDeclaration(export) = statement
            && let ExportDefaultDeclarationKind::ClassDeclaration(class) = &export.declaration
            && let Some(nested) = self.targets.remove(&span_key(class.span))
        {
            ids.extend(nested);
        }
        ids
    }

    fn wrap_bare(&mut self, statement: &mut Statement<'a>) {
        let ids = self.take_statement_ids(statement);
        if ids.is_empty() {
            return;
        }
        let original = statement.take_in(self.ast.allocator);
        let mut body = self.ast.vec_with_capacity(ids.len() + 1);
        body.extend(ids.iter().map(|target| self.probe(target)));
        body.push(original);
        *statement = self.ast.statement_block(Span::default(), body);
    }
}

impl<'a> VisitMut<'a> for StatementProbeTransformer<'a> {
    fn visit_statements(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let original = statements.take_in(self.ast.allocator);
        let mut instrumented = self.ast.vec_with_capacity(original.len() * 2);
        for mut statement in original {
            let ids = self.take_statement_ids(&statement);
            self.visit_statement(&mut statement);
            instrumented.extend(ids.iter().map(|target| self.probe(target)));
            instrumented.push(statement);
        }
        *statements = instrumented;
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_if_statement(&mut self, statement: &mut IfStatement<'a>) {
        self.wrap_bare(&mut statement.consequent);
        if let Some(alternate) = &mut statement.alternate {
            self.wrap_bare(alternate);
        }
        walk_mut::walk_if_statement(self, statement);
    }

    fn visit_while_statement(&mut self, statement: &mut WhileStatement<'a>) {
        self.wrap_bare(&mut statement.body);
        walk_mut::walk_while_statement(self, statement);
    }

    fn visit_do_while_statement(&mut self, statement: &mut DoWhileStatement<'a>) {
        self.wrap_bare(&mut statement.body);
        walk_mut::walk_do_while_statement(self, statement);
    }

    fn visit_for_statement(&mut self, statement: &mut ForStatement<'a>) {
        self.wrap_bare(&mut statement.body);
        walk_mut::walk_for_statement(self, statement);
    }

    fn visit_for_in_statement(&mut self, statement: &mut ForInStatement<'a>) {
        self.wrap_bare(&mut statement.body);
        walk_mut::walk_for_in_statement(self, statement);
    }

    fn visit_for_of_statement(&mut self, statement: &mut ForOfStatement<'a>) {
        self.wrap_bare(&mut statement.body);
        walk_mut::walk_for_of_statement(self, statement);
    }
}

/// Wraps a rendered JSX expression in `renderedValueV2(file, i, expression)` so
/// the expression records its own evaluation. There is nowhere to put a
/// statement inside JSX, and a sequence expression is not available either --
/// JSX forbids a bare comma operator, and a container prints its expression
/// unparenthesised. A call carries the value through instead. It records after
/// the expression evaluates rather than before, as `optionalSelect` already
/// does, so an expression that throws is reported unevaluated rather than
/// covered.
struct RenderedExpressionTransformer<'a> {
    ast: AstBuilder<'a>,
    rendered_value_v2: String,
    probe_file_v2: String,
    targets: HashMap<SpanKey, PointTarget>,
    source_sensitive_functions: HashSet<SpanKey>,
}

impl<'a> RenderedExpressionTransformer<'a> {
    fn probe(&self, target: &PointTarget, value: Expression<'a>) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.ast
                .expression_identifier(Span::default(), self.ast.ident(&self.rendered_value_v2)),
            NONE,
            self.ast.vec_from_array([
                Argument::from(
                    self.ast.expression_identifier(
                        Span::default(),
                        self.ast.ident(&self.probe_file_v2),
                    ),
                ),
                Argument::from(self.ast.expression_numeric_literal(
                    Span::default(),
                    target.index as f64,
                    None,
                    NumberBase::Decimal,
                )),
                Argument::from(value),
            ]),
            false,
        )
    }
}

impl<'a> VisitMut<'a> for RenderedExpressionTransformer<'a> {
    fn visit_jsx_expression_container(&mut self, container: &mut JSXExpressionContainer<'a>) {
        walk_mut::walk_jsx_expression_container(self, container);
        if matches!(container.expression, JSXExpression::EmptyExpression(_)) {
            return;
        }
        let span = container.expression.span();
        if self.source_sensitive_functions.contains(&span_key(span)) {
            return;
        }
        let Some(target) = self.targets.remove(&span_key(span)) else {
            return;
        };
        let inner = container
            .expression
            .take_in(self.ast.allocator)
            .into_expression();
        container.expression = JSXExpression::from(self.probe(&target, inner));
    }
}

struct FunctionProbeTransformer<'a> {
    ast: AstBuilder<'a>,
    coverage_hit_v2: String,
    probe_file_v2: String,
    targets: HashMap<SpanKey, PointTarget>,
    source_sensitive_functions: HashSet<SpanKey>,
}

impl<'a> FunctionProbeTransformer<'a> {
    fn probe(&self, target: &PointTarget) -> Statement<'a> {
        probe_v2_hit(
            self.ast,
            &self.coverage_hit_v2,
            &self.probe_file_v2,
            target.index,
        )
    }
}

impl<'a> VisitMut<'a> for FunctionProbeTransformer<'a> {
    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        if let Some(target) = self.targets.remove(&span_key(function.span))
            && let Some(body) = &mut function.body
        {
            body.statements.insert(0, self.probe(&target));
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        if let Some(target) = self.targets.remove(&span_key(function.span)) {
            let probe = self.probe(&target);
            if function.expression {
                let original = function
                    .body
                    .statements
                    .pop()
                    .expect("expression arrow must contain its expression statement");
                let Statement::ExpressionStatement(expression) = original else {
                    panic!("expression arrow body must be represented as an expression statement");
                };
                function.expression = false;
                function.body.statements.push(probe);
                function.body.statements.push(
                    self.ast
                        .statement_return(Span::default(), Some(expression.unbox().expression)),
                );
            } else {
                function.body.statements.insert(0, probe);
            }
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }
}

struct OptionalMemberTransformer<'a> {
    ast: AstBuilder<'a>,
    optional_select: String,
    targets: HashMap<SpanKey, (String, String)>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> OptionalMemberTransformer<'a> {
    fn instrument_operand(
        &self,
        operand: Expression<'a>,
        short_id: &str,
        continued_id: &str,
    ) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.ast
                .expression_identifier(Span::default(), self.ast.ident(&self.optional_select)),
            NONE,
            self.ast.vec_from_array([
                Argument::from(self.ast.expression_string_literal(
                    Span::default(),
                    self.ast.str(short_id),
                    None,
                )),
                Argument::from(self.ast.expression_string_literal(
                    Span::default(),
                    self.ast.str(continued_id),
                    None,
                )),
                Argument::from(operand),
            ]),
            false,
        )
    }

    fn instrument_target(&mut self, span: Span, object: &mut Expression<'a>) {
        let Some((short_id, continued_id)) = self.targets.remove(&span_key(span)) else {
            return;
        };
        let operand = object.take_in(self.ast.allocator);
        *object = self.instrument_operand(operand, &short_id, &continued_id);
    }
}

impl<'a> VisitMut<'a> for OptionalMemberTransformer<'a> {
    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_computed_member_expression(&mut self, member: &mut ComputedMemberExpression<'a>) {
        self.instrument_target(member.span, &mut member.object);
        walk_mut::walk_computed_member_expression(self, member);
    }

    fn visit_static_member_expression(&mut self, member: &mut StaticMemberExpression<'a>) {
        self.instrument_target(member.span, &mut member.object);
        walk_mut::walk_static_member_expression(self, member);
    }

    fn visit_private_field_expression(&mut self, member: &mut PrivateFieldExpression<'a>) {
        self.instrument_target(member.span, &mut member.object);
        walk_mut::walk_private_field_expression(self, member);
    }
}

#[derive(Clone)]
struct OptionalCallSiteRuntime {
    frame: String,
    short_id: String,
    continued_id: String,
}

struct OptionalCallTransformer<'a, 's> {
    ast: AstBuilder<'a>,
    optional_call_begin: String,
    optional_call_reached: String,
    optional_call_continued: String,
    optional_call_end: String,
    scope_declarations: Vec<Vec<String>>,
    sites: HashMap<SpanKey, OptionalCallSiteRuntime>,
    roots: HashMap<SpanKey, Vec<SpanKey>>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
    _source: std::marker::PhantomData<&'s str>,
}

impl<'a, 's> OptionalCallTransformer<'a, 's> {
    #[allow(clippy::too_many_arguments)]
    fn new(
        ast: AstBuilder<'a>,
        source: &'s str,
        optional_call_begin: String,
        optional_call_reached: String,
        optional_call_continued: String,
        optional_call_end: String,
        sites: HashMap<SpanKey, (String, String)>,
        roots: HashMap<SpanKey, Vec<SpanKey>>,
        source_sensitive_functions: HashSet<SpanKey>,
        with_statements: HashSet<SpanKey>,
    ) -> Self {
        let mut names = CandidateNames::new(source);
        let sites = sites
            .into_iter()
            .map(|(key, (short_id, continued_id))| {
                (
                    key,
                    OptionalCallSiteRuntime {
                        frame: names.allocate("_optionalCall"),
                        short_id,
                        continued_id,
                    },
                )
            })
            .collect();
        Self {
            ast,
            optional_call_begin,
            optional_call_reached,
            optional_call_continued,
            optional_call_end,
            scope_declarations: Vec::new(),
            sites,
            roots,
            source_sensitive_functions,
            with_statements,
            _source: std::marker::PhantomData,
        }
    }

    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn assignment_target(&self, name: &str) -> AssignmentTarget<'a> {
        AssignmentTarget::from(
            self.ast
                .simple_assignment_target_assignment_target_identifier(
                    Span::default(),
                    self.ast.ident(name),
                ),
        )
    }

    fn call(&self, name: &str, arguments: oxc_allocator::Vec<'a, Argument<'a>>) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.identifier(name),
            NONE,
            arguments,
            false,
        )
    }

    fn string_argument(&self, value: &str) -> Argument<'a> {
        Argument::from(self.ast.expression_string_literal(
            Span::default(),
            self.ast.str(value),
            None,
        ))
    }

    fn reached(&self, frame: &str, value: Expression<'a>) -> Expression<'a> {
        self.call(
            &self.optional_call_reached,
            self.ast.vec_from_array([
                Argument::from(self.identifier(frame)),
                Argument::from(value),
            ]),
        )
    }

    fn enter_scope(&mut self) {
        self.scope_declarations.push(Vec::new());
    }

    fn leave_scope(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let names = self
            .scope_declarations
            .pop()
            .expect("optional-call scope stack must remain balanced");
        if names.is_empty() {
            return;
        }
        let declarations = self.ast.vec_from_iter(names.into_iter().map(|name| {
            self.ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast
                    .binding_pattern_binding_identifier(Span::default(), self.ast.ident(&name)),
                NONE,
                None,
                false,
            )
        }));
        statements.insert(
            0,
            Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                Span::default(),
                VariableDeclarationKind::Let,
                declarations,
                false,
            )),
        );
    }

    fn instrument_callee(
        &self,
        callee: Expression<'a>,
        site: &OptionalCallSiteRuntime,
    ) -> Expression<'a> {
        match callee {
            Expression::ComputedMemberExpression(mut member) => {
                let property = member.expression.take_in(self.ast.allocator);
                member.expression = self.reached(&site.frame, property);
                Expression::ComputedMemberExpression(member)
            }
            Expression::StaticMemberExpression(member) => {
                let member = member.unbox();
                let property = self.ast.expression_string_literal(
                    Span::default(),
                    self.ast.str(member.property.name.as_str()),
                    None,
                );
                Expression::ComputedMemberExpression(self.ast.alloc_computed_member_expression(
                    member.span,
                    member.object,
                    self.reached(&site.frame, property),
                    member.optional,
                ))
            }
            Expression::PrivateFieldExpression(mut member) => {
                let object = member.object.take_in(self.ast.allocator);
                member.object = self.reached(&site.frame, object);
                Expression::PrivateFieldExpression(member)
            }
            Expression::ChainExpression(mut chain) => {
                match &mut chain.expression {
                    ChainElement::ComputedMemberExpression(member) => {
                        let property = member.expression.take_in(self.ast.allocator);
                        member.expression = self.reached(&site.frame, property);
                    }
                    ChainElement::StaticMemberExpression(member) => {
                        let member = member.take_in(self.ast.allocator);
                        let property = self.ast.expression_string_literal(
                            Span::default(),
                            self.ast.str(member.property.name.as_str()),
                            None,
                        );
                        chain.expression = ChainElement::ComputedMemberExpression(
                            self.ast.alloc_computed_member_expression(
                                member.span,
                                member.object,
                                self.reached(&site.frame, property),
                                member.optional,
                            ),
                        );
                    }
                    ChainElement::PrivateFieldExpression(member) => {
                        let object = member.object.take_in(self.ast.allocator);
                        member.object = self.reached(&site.frame, object);
                    }
                    ChainElement::CallExpression(_) | ChainElement::TSNonNullExpression(_) => {
                        return self.reached(&site.frame, Expression::ChainExpression(chain));
                    }
                }
                Expression::ChainExpression(chain)
            }
            Expression::ParenthesizedExpression(mut parenthesized) => {
                let inner = parenthesized.expression.take_in(self.ast.allocator);
                parenthesized.expression = self.instrument_callee(inner, site);
                Expression::ParenthesizedExpression(parenthesized)
            }
            Expression::TSAsExpression(mut wrapped) => {
                let inner = wrapped.expression.take_in(self.ast.allocator);
                wrapped.expression = self.instrument_callee(inner, site);
                Expression::TSAsExpression(wrapped)
            }
            Expression::TSSatisfiesExpression(mut wrapped) => {
                let inner = wrapped.expression.take_in(self.ast.allocator);
                wrapped.expression = self.instrument_callee(inner, site);
                Expression::TSSatisfiesExpression(wrapped)
            }
            Expression::TSTypeAssertion(mut wrapped) => {
                let inner = wrapped.expression.take_in(self.ast.allocator);
                wrapped.expression = self.instrument_callee(inner, site);
                Expression::TSTypeAssertion(wrapped)
            }
            Expression::TSNonNullExpression(mut wrapped) => {
                let inner = wrapped.expression.take_in(self.ast.allocator);
                wrapped.expression = self.instrument_callee(inner, site);
                Expression::TSNonNullExpression(wrapped)
            }
            other => self.reached(&site.frame, other),
        }
    }

    fn instrument_call(&self, call: &mut CallExpression<'a>, site: &OptionalCallSiteRuntime) {
        let callee = call.callee.take_in(self.ast.allocator);
        call.callee = self.instrument_callee(callee, site);
        let continued = self.call(
            &self.optional_call_continued,
            self.ast.vec1(Argument::from(self.identifier(&site.frame))),
        );
        call.arguments.insert(
            0,
            Argument::SpreadElement(self.ast.alloc_spread_element(Span::default(), continued)),
        );
    }

    fn wrap_root(&mut self, expression: &mut Expression<'a>, site_keys: &[SpanKey]) {
        let sites = site_keys
            .iter()
            .map(|key| {
                self.sites
                    .get(key)
                    .expect("optional-call root must reference a known site")
                    .clone()
            })
            .collect::<Vec<_>>();
        self.scope_declarations
            .last_mut()
            .expect("optional-call root must be inside a program or function")
            .extend(sites.iter().map(|site| site.frame.clone()));

        let original = expression.take_in(self.ast.allocator);
        let mut measured = original;
        for site in sites.iter().rev() {
            measured = self.call(
                &self.optional_call_end,
                self.ast.vec_from_array([
                    Argument::from(self.identifier(&site.frame)),
                    Argument::from(measured),
                ]),
            );
        }
        let mut sequence = self.ast.vec_with_capacity(sites.len() + 1);
        for site in &sites {
            let begin = self.call(
                &self.optional_call_begin,
                self.ast.vec_from_array([
                    self.string_argument(&site.short_id),
                    self.string_argument(&site.continued_id),
                ]),
            );
            sequence.push(self.ast.expression_assignment(
                Span::default(),
                AssignmentOperator::Assign,
                self.assignment_target(&site.frame),
                begin,
            ));
        }
        sequence.push(measured);
        *expression = self.ast.expression_sequence(Span::default(), sequence);
    }
}

impl<'a> VisitMut<'a> for OptionalCallTransformer<'a, '_> {
    fn visit_program(&mut self, program: &mut Program<'a>) {
        self.enter_scope();
        walk_mut::walk_program(self, program);
        self.leave_scope(&mut program.body);
    }

    fn visit_function_body(&mut self, body: &mut FunctionBody<'a>) {
        self.enter_scope();
        walk_mut::walk_function_body(self, body);
        self.leave_scope(&mut body.statements);
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_call_expression(&mut self, call: &mut CallExpression<'a>) {
        walk_mut::walk_call_expression(self, call);
        if let Some(site) = self.sites.get(&span_key(call.span)).cloned() {
            self.instrument_call(call, &site);
        }
    }

    fn visit_expression(&mut self, expression: &mut Expression<'a>) {
        let key = span_key(expression.span());
        walk_mut::walk_expression(self, expression);
        if let Some(site_keys) = self.roots.remove(&key) {
            self.wrap_root(expression, &site_keys);
        }
    }
}

struct DefaultTransformer<'a> {
    ast: AstBuilder<'a>,
    default_selected: String,
    default_entered: String,
    parameter_targets: HashMap<SpanKey, DefaultTarget>,
    binding_targets: HashMap<SpanKey, DefaultTarget>,
    function_entries: Vec<Vec<Statement<'a>>>,
    declaration_entries: HashMap<SpanKey, Vec<Statement<'a>>>,
    active_declaration: Vec<SpanKey>,
    parameter_pattern_depth: usize,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> DefaultTransformer<'a> {
    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn string_argument(&self, value: &str) -> Argument<'a> {
        Argument::from(self.ast.expression_string_literal(
            Span::default(),
            self.ast.str(value),
            None,
        ))
    }

    fn selected(&self, value: Expression<'a>, target: &DefaultTarget) -> Expression<'a> {
        let mut arguments = self.ast.vec_from_array([
            self.string_argument(&target.default_id),
            Argument::from(value),
        ]);
        if let Some(name) = &target.inferred_name {
            arguments.push(self.string_argument(name));
        }
        self.ast.expression_call(
            Span::default(),
            self.identifier(&self.default_selected),
            NONE,
            arguments,
            false,
        )
    }

    fn entered(&self, target: &DefaultTarget) -> Statement<'a> {
        self.ast.statement_expression(
            Span::default(),
            self.ast.expression_call(
                Span::default(),
                self.identifier(&self.default_entered),
                NONE,
                self.ast.vec_from_array([
                    self.string_argument(&target.default_id),
                    self.string_argument(&target.provided_id),
                ]),
                false,
            ),
        )
    }

    fn push_entry(&mut self, target: &DefaultTarget) {
        let entry = self.entered(target);
        if self.parameter_pattern_depth > 0 {
            self.function_entries
                .last_mut()
                .expect("parameter default must belong to a function")
                .push(entry);
        } else {
            let declaration = *self
                .active_declaration
                .last()
                .expect("binding default must belong to a declaration");
            self.declaration_entries
                .entry(declaration)
                .or_default()
                .push(entry);
        }
    }

    fn prepend_entries(&self, body: &mut Statement<'a>, entries: Vec<Statement<'a>>) {
        if entries.is_empty() {
            return;
        }
        if let Statement::BlockStatement(block) = body {
            for (index, entry) in entries.into_iter().enumerate() {
                block.body.insert(index, entry);
            }
            return;
        }
        let original = body.take_in(self.ast.allocator);
        let mut statements = self.ast.vec_with_capacity(entries.len() + 1);
        statements.extend(entries);
        statements.push(original);
        *body = self.ast.statement_block(Span::default(), statements);
    }

    fn variable_span(statement: &Statement<'a>) -> Option<SpanKey> {
        match statement {
            Statement::VariableDeclaration(declaration) => Some(span_key(declaration.span)),
            Statement::ExportNamedDeclaration(export) => match &export.declaration {
                Some(Declaration::VariableDeclaration(declaration)) => {
                    Some(span_key(declaration.span))
                }
                _ => None,
            },
            _ => None,
        }
    }

    fn loop_declaration_span(left: &ForStatementLeft<'a>) -> Option<SpanKey> {
        match left {
            ForStatementLeft::VariableDeclaration(declaration) => Some(span_key(declaration.span)),
            _ => None,
        }
    }
}

impl<'a> VisitMut<'a> for DefaultTransformer<'a> {
    fn visit_statements(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let original = statements.take_in(self.ast.allocator);
        let mut instrumented = self.ast.vec_with_capacity(original.len() * 2);
        for mut statement in original {
            let declaration = Self::variable_span(&statement);
            self.visit_statement(&mut statement);
            instrumented.push(statement);
            if let Some(declaration) = declaration
                && let Some(entries) = self.declaration_entries.remove(&declaration)
            {
                instrumented.extend(entries);
            }
        }
        *statements = instrumented;
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        self.function_entries.push(Vec::new());
        walk_mut::walk_function(self, function, flags);
        let entries = self
            .function_entries
            .pop()
            .expect("default function-entry stack must remain balanced");
        if let Some(body) = &mut function.body {
            for (index, entry) in entries.into_iter().enumerate() {
                body.statements.insert(index, entry);
            }
        }
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        self.function_entries.push(Vec::new());
        walk_mut::walk_arrow_function_expression(self, function);
        let entries = self
            .function_entries
            .pop()
            .expect("default arrow-entry stack must remain balanced");
        for (index, entry) in entries.into_iter().enumerate() {
            function.body.statements.insert(index, entry);
        }
    }

    fn visit_formal_parameter(&mut self, parameter: &mut FormalParameter<'a>) {
        let outer = self.parameter_targets.remove(&span_key(parameter.span));
        if let Some(target) = &outer {
            let entry = self.entered(target);
            self.function_entries
                .last_mut()
                .expect("formal parameter must belong to a function")
                .push(entry);
        }
        self.visit_decorators(&mut parameter.decorators);
        self.parameter_pattern_depth += 1;
        self.visit_binding_pattern(&mut parameter.pattern);
        self.parameter_pattern_depth -= 1;
        if let Some(annotation) = &mut parameter.type_annotation {
            self.visit_ts_type_annotation(annotation);
        }
        if let Some(initializer) = &mut parameter.initializer {
            self.visit_expression(initializer);
            if let Some(target) = outer {
                let value = initializer.take_in(self.ast.allocator);
                **initializer = self.selected(value, &target);
            }
        }
    }

    fn visit_assignment_pattern(&mut self, assignment: &mut AssignmentPattern<'a>) {
        let target = if self.parameter_pattern_depth > 0 {
            self.parameter_targets.remove(&span_key(assignment.span))
        } else {
            self.binding_targets.remove(&span_key(assignment.span))
        };
        if let Some(target) = &target {
            self.push_entry(target);
        }
        walk_mut::walk_assignment_pattern(self, assignment);
        if let Some(target) = target {
            let value = assignment.right.take_in(self.ast.allocator);
            assignment.right = self.selected(value, &target);
        }
    }

    fn visit_variable_declaration(&mut self, declaration: &mut VariableDeclaration<'a>) {
        self.active_declaration.push(span_key(declaration.span));
        walk_mut::walk_variable_declaration(self, declaration);
        self.active_declaration
            .pop()
            .expect("default declaration stack must remain balanced");
    }

    fn visit_for_in_statement(&mut self, statement: &mut ForInStatement<'a>) {
        let declaration = Self::loop_declaration_span(&statement.left);
        walk_mut::walk_for_in_statement(self, statement);
        if let Some(declaration) = declaration
            && let Some(entries) = self.declaration_entries.remove(&declaration)
        {
            self.prepend_entries(&mut statement.body, entries);
        }
    }

    fn visit_for_of_statement(&mut self, statement: &mut ForOfStatement<'a>) {
        let declaration = Self::loop_declaration_span(&statement.left);
        walk_mut::walk_for_of_statement(self, statement);
        if let Some(declaration) = declaration
            && let Some(entries) = self.declaration_entries.remove(&declaration)
        {
            self.prepend_entries(&mut statement.body, entries);
        }
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }
}

enum ExtendedKind {
    Try,
    Loop,
}

struct ExtendedTransformer<'a, 's> {
    ast: AstBuilder<'a>,
    try_begin: String,
    try_catch: String,
    try_end: String,
    loop_begin: String,
    loop_entered: String,
    loop_end: String,
    try_targets: HashMap<SpanKey, ExtendedTarget>,
    loop_targets: HashMap<SpanKey, ExtendedTarget>,
    names: CandidateNames<'s>,
    scope_declarations: Vec<Vec<String>>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> ExtendedTransformer<'a, '_> {
    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn assignment_target(&self, name: &str) -> AssignmentTarget<'a> {
        AssignmentTarget::from(
            self.ast
                .simple_assignment_target_assignment_target_identifier(
                    Span::default(),
                    self.ast.ident(name),
                ),
        )
    }

    fn string_argument(&self, value: &str) -> Argument<'a> {
        Argument::from(self.ast.expression_string_literal(
            Span::default(),
            self.ast.str(value),
            None,
        ))
    }

    fn call(&self, name: &str, arguments: oxc_allocator::Vec<'a, Argument<'a>>) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.identifier(name),
            NONE,
            arguments,
            false,
        )
    }

    fn call_statement(
        &self,
        name: &str,
        arguments: oxc_allocator::Vec<'a, Argument<'a>>,
    ) -> Statement<'a> {
        self.ast
            .statement_expression(Span::default(), self.call(name, arguments))
    }

    fn enter_scope(&mut self) {
        self.scope_declarations.push(Vec::new());
    }

    fn leave_scope(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let names = self
            .scope_declarations
            .pop()
            .expect("extended scope stack must remain balanced");
        if names.is_empty() {
            return;
        }
        let declarations = self.ast.vec_from_iter(names.into_iter().map(|name| {
            self.ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast
                    .binding_pattern_binding_identifier(Span::default(), self.ast.ident(&name)),
                NONE,
                None,
                false,
            )
        }));
        statements.insert(
            0,
            Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                Span::default(),
                VariableDeclarationKind::Let,
                declarations,
                false,
            )),
        );
    }

    fn scratch(&mut self, base: &str) -> String {
        let name = self.names.allocate(base);
        self.scope_declarations
            .last_mut()
            .expect("extended branch must be inside a program or function")
            .push(name.clone());
        name
    }

    fn target(statement: &Statement<'a>) -> Option<(ExtendedKind, SpanKey)> {
        match statement {
            Statement::TryStatement(node) => Some((ExtendedKind::Try, span_key(node.span))),
            Statement::ForInStatement(node) => Some((ExtendedKind::Loop, span_key(node.span))),
            Statement::ForOfStatement(node) => Some((ExtendedKind::Loop, span_key(node.span))),
            Statement::LabeledStatement(node) => Self::target(&node.body),
            _ => None,
        }
    }

    fn inner_try<'b>(statement: &'b mut Statement<'a>) -> Option<&'b mut TryStatement<'a>> {
        match statement {
            Statement::TryStatement(node) => Some(node),
            Statement::LabeledStatement(node) => Self::inner_try(&mut node.body),
            _ => None,
        }
    }

    fn inner_loop_body<'b>(statement: &'b mut Statement<'a>) -> Option<&'b mut Statement<'a>> {
        match statement {
            Statement::ForInStatement(node) => Some(&mut node.body),
            Statement::ForOfStatement(node) => Some(&mut node.body),
            Statement::LabeledStatement(node) => Self::inner_loop_body(&mut node.body),
            _ => None,
        }
    }

    fn prepend(body: &mut Statement<'a>, entry: Statement<'a>, ast: AstBuilder<'a>) {
        if let Statement::BlockStatement(block) = body {
            block.body.insert(0, entry);
            return;
        }
        let original = body.take_in(ast.allocator);
        *body = ast.statement_block(Span::default(), ast.vec_from_array([entry, original]));
    }

    fn begin_assignment(&self, frame: &str, begin: &str, target: &ExtendedTarget) -> Statement<'a> {
        let call = self.call(
            begin,
            self.ast.vec_from_array([
                self.string_argument(&target.first_id),
                self.string_argument(&target.second_id),
            ]),
        );
        self.ast.statement_expression(
            Span::default(),
            self.ast.expression_assignment(
                Span::default(),
                AssignmentOperator::Assign,
                self.assignment_target(frame),
                call,
            ),
        )
    }

    fn instrument_try(&mut self, statement: &mut Statement<'a>, target: ExtendedTarget) {
        let frame = self.scratch("_supercovTryFrame");
        let assignment = self.begin_assignment(&frame, &self.try_begin, &target);
        let node = Self::inner_try(statement).expect("try target must remain a try statement");
        node.handler
            .as_mut()
            .expect("try coverage requires a catch handler")
            .body
            .body
            .insert(
                0,
                self.call_statement(
                    &self.try_catch,
                    self.ast.vec_from_array([
                        Argument::from(self.identifier(&frame)),
                        Argument::from(self.identifier("undefined")),
                    ]),
                ),
            );
        let end = self.call_statement(
            &self.try_end,
            self.ast.vec1(Argument::from(self.identifier(&frame))),
        );
        if let Some(finalizer) = &mut node.finalizer {
            finalizer.body.insert(0, end);
        } else {
            node.finalizer = Some(
                self.ast
                    .alloc_block_statement(Span::default(), self.ast.vec1(end)),
            );
        }
        let original = statement.take_in(self.ast.allocator);
        *statement = self.ast.statement_block(
            Span::default(),
            self.ast.vec_from_array([assignment, original]),
        );
    }

    fn instrument_loop(&mut self, statement: &mut Statement<'a>, target: ExtendedTarget) {
        let frame = self.scratch("_supercovLoopFrame");
        let assignment = self.begin_assignment(&frame, &self.loop_begin, &target);
        let entered = self.call_statement(
            &self.loop_entered,
            self.ast.vec1(Argument::from(self.identifier(&frame))),
        );
        Self::prepend(
            Self::inner_loop_body(statement).expect("loop target must remain an enumeration loop"),
            entered,
            self.ast,
        );
        let original = statement.take_in(self.ast.allocator);
        let end = self.call_statement(
            &self.loop_end,
            self.ast.vec1(Argument::from(self.identifier(&frame))),
        );
        let wrapped = self.ast.statement_try(
            Span::default(),
            self.ast
                .block_statement(Span::default(), self.ast.vec1(original)),
            None::<oxc_allocator::Box<'a, CatchClause<'a>>>,
            Some(
                self.ast
                    .block_statement(Span::default(), self.ast.vec1(end)),
            ),
        );
        *statement = self.ast.statement_block(
            Span::default(),
            self.ast.vec_from_array([assignment, wrapped]),
        );
    }
}

impl<'a> VisitMut<'a> for ExtendedTransformer<'a, '_> {
    fn visit_program(&mut self, program: &mut Program<'a>) {
        self.enter_scope();
        walk_mut::walk_program(self, program);
        self.leave_scope(&mut program.body);
    }

    fn visit_function_body(&mut self, body: &mut FunctionBody<'a>) {
        self.enter_scope();
        walk_mut::walk_function_body(self, body);
        self.leave_scope(&mut body.statements);
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_statement(&mut self, statement: &mut Statement<'a>) {
        let Some((kind, key)) = Self::target(statement) else {
            walk_mut::walk_statement(self, statement);
            return;
        };
        match kind {
            ExtendedKind::Try => {
                if let Some(target) = self.try_targets.remove(&key) {
                    walk_mut::walk_statement(self, statement);
                    self.instrument_try(statement, target);
                } else {
                    walk_mut::walk_statement(self, statement);
                }
            }
            ExtendedKind::Loop => {
                if let Some(target) = self.loop_targets.remove(&key) {
                    walk_mut::walk_statement(self, statement);
                    self.instrument_loop(statement, target);
                } else {
                    walk_mut::walk_statement(self, statement);
                }
            }
        }
    }
}

struct LogicalValueTransformer<'a, 's> {
    ast: AstBuilder<'a>,
    selection_begin: String,
    selection_right: String,
    selection_end: String,
    names: CandidateNames<'s>,
    scope_declarations: Vec<Vec<String>>,
    logical_targets: HashMap<SpanKey, (String, String)>,
    assignment_targets: HashMap<SpanKey, (String, String)>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> LogicalValueTransformer<'a, '_> {
    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn assignment_target(&self, name: &str) -> AssignmentTarget<'a> {
        AssignmentTarget::from(
            self.ast
                .simple_assignment_target_assignment_target_identifier(
                    Span::default(),
                    self.ast.ident(name),
                ),
        )
    }

    fn call(&self, name: &str, arguments: oxc_allocator::Vec<'a, Argument<'a>>) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.identifier(name),
            NONE,
            arguments,
            false,
        )
    }

    fn string_argument(&self, value: &str) -> Argument<'a> {
        Argument::from(self.ast.expression_string_literal(
            Span::default(),
            self.ast.str(value),
            None,
        ))
    }

    fn enter_scope(&mut self) {
        self.scope_declarations.push(Vec::new());
    }

    fn leave_scope(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let names = self
            .scope_declarations
            .pop()
            .expect("logical-value scope stack must remain balanced");
        if names.is_empty() {
            return;
        }
        let declarations = self.ast.vec_from_iter(names.into_iter().map(|name| {
            self.ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast
                    .binding_pattern_binding_identifier(Span::default(), self.ast.ident(&name)),
                NONE,
                None,
                false,
            )
        }));
        statements.insert(
            0,
            Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                Span::default(),
                VariableDeclarationKind::Let,
                declarations,
                false,
            )),
        );
    }

    fn scratch(&mut self) -> String {
        let name = self.names.allocate("_supercovSelectionFrame");
        self.scope_declarations
            .last_mut()
            .expect("logical expression must be inside a program or function")
            .push(name.clone());
        name
    }

    fn instrument(
        &mut self,
        logical: oxc_allocator::Box<'a, LogicalExpression<'a>>,
        short_id: &str,
        right_id: &str,
    ) -> Expression<'a> {
        let logical = logical.unbox();
        let frame = self.scratch();
        let begin = self.call(
            &self.selection_begin,
            self.ast.vec_from_array([
                self.string_argument(short_id),
                self.string_argument(right_id),
            ]),
        );
        let assign = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Assign,
            self.assignment_target(&frame),
            begin,
        );
        let right = self.call(
            &self.selection_right,
            self.ast.vec_from_array([
                Argument::from(self.identifier(&frame)),
                Argument::from(logical.right),
            ]),
        );
        let selection =
            self.ast
                .expression_logical(Span::default(), logical.left, logical.operator, right);
        let end = self.call(
            &self.selection_end,
            self.ast.vec_from_array([
                Argument::from(self.identifier(&frame)),
                Argument::from(selection),
            ]),
        );
        self.ast
            .expression_sequence(Span::default(), self.ast.vec_from_array([assign, end]))
    }

    fn instrument_assignment(
        &mut self,
        assignment: oxc_allocator::Box<'a, AssignmentExpression<'a>>,
        short_id: &str,
        right_id: &str,
    ) -> Expression<'a> {
        let assignment = assignment.unbox();
        let inferred_name = match &assignment.left {
            AssignmentTarget::AssignmentTargetIdentifier(identifier)
                if assignment.span.start == identifier.span.start
                    && expression_is_anonymous_definition(&assignment.right) =>
            {
                Some(identifier.name.to_string())
            }
            _ => None,
        };
        let frame = self.scratch();
        let begin = self.call(
            &self.selection_begin,
            self.ast.vec_from_array([
                self.string_argument(short_id),
                self.string_argument(right_id),
            ]),
        );
        let assign_frame = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Assign,
            self.assignment_target(&frame),
            begin,
        );
        let mut right_arguments = self.ast.vec_from_array([
            Argument::from(self.identifier(&frame)),
            Argument::from(assignment.right),
        ]);
        if let Some(name) = inferred_name {
            right_arguments.push(self.string_argument(&name));
        }
        let right = self.call(&self.selection_right, right_arguments);
        let measured_assignment = self.ast.expression_assignment(
            Span::default(),
            assignment.operator,
            assignment.left,
            right,
        );
        let end = self.call(
            &self.selection_end,
            self.ast.vec_from_array([
                Argument::from(self.identifier(&frame)),
                Argument::from(measured_assignment),
            ]),
        );
        self.ast.expression_sequence(
            Span::default(),
            self.ast.vec_from_array([assign_frame, end]),
        )
    }
}

impl<'a> VisitMut<'a> for LogicalValueTransformer<'a, '_> {
    fn visit_program(&mut self, program: &mut Program<'a>) {
        self.enter_scope();
        walk_mut::walk_program(self, program);
        self.leave_scope(&mut program.body);
    }

    fn visit_function_body(&mut self, body: &mut FunctionBody<'a>) {
        self.enter_scope();
        walk_mut::walk_function_body(self, body);
        self.leave_scope(&mut body.statements);
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_expression(&mut self, expression: &mut Expression<'a>) {
        let key = span_key(expression.span());
        walk_mut::walk_expression(self, expression);
        if let Some((short_id, right_id)) = self.assignment_targets.remove(&key) {
            let original = expression.take_in(self.ast.allocator);
            let Expression::AssignmentExpression(assignment) = original else {
                panic!("logical-assignment target must remain an assignment expression");
            };
            *expression = self.instrument_assignment(assignment, &short_id, &right_id);
            return;
        }
        let Some((short_id, right_id)) = self.logical_targets.remove(&key) else {
            return;
        };
        let original = expression.take_in(self.ast.allocator);
        let Expression::LogicalExpression(logical) = original else {
            panic!("logical-value target must remain a logical expression");
        };
        *expression = self.instrument(logical, &short_id, &right_id);
    }
}

struct SwitchTransformer<'a, 's> {
    ast: AstBuilder<'a>,
    coverage_hit: String,
    targets: HashMap<SpanKey, SwitchTarget>,
    names: CandidateNames<'s>,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> SwitchTransformer<'a, '_> {
    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn assignment_target(&self, name: &str) -> AssignmentTarget<'a> {
        AssignmentTarget::from(
            self.ast
                .simple_assignment_target_assignment_target_identifier(
                    Span::default(),
                    self.ast.ident(name),
                ),
        )
    }

    fn probe(&self, id: &str) -> Statement<'a> {
        self.ast.statement_expression(
            Span::default(),
            self.ast.expression_call(
                Span::default(),
                self.identifier(&self.coverage_hit),
                NONE,
                self.ast
                    .vec1(Argument::from(self.ast.expression_string_literal(
                        Span::default(),
                        self.ast.str(id),
                        None,
                    ))),
                false,
            ),
        )
    }

    fn target(statement: &Statement<'a>) -> Option<SpanKey> {
        match statement {
            Statement::SwitchStatement(node) => Some(span_key(node.span)),
            Statement::LabeledStatement(node) => Self::target(&node.body),
            _ => None,
        }
    }

    fn inner_switch<'b>(statement: &'b mut Statement<'a>) -> Option<&'b mut SwitchStatement<'a>> {
        match statement {
            Statement::SwitchStatement(node) => Some(node),
            Statement::LabeledStatement(node) => Self::inner_switch(&mut node.body),
            _ => None,
        }
    }

    fn entered_assignment(&self, entered: &str) -> Statement<'a> {
        self.ast.statement_expression(
            Span::default(),
            self.ast.expression_assignment(
                Span::default(),
                AssignmentOperator::Assign,
                self.assignment_target(entered),
                self.ast.expression_boolean_literal(Span::default(), true),
            ),
        )
    }

    fn instrument(&mut self, statement: &mut Statement<'a>, target: &SwitchTarget) {
        let entered = target
            .no_match_id
            .as_ref()
            .map(|_| self.names.allocate("_supercovSwitchEntered"));
        let node = Self::inner_switch(statement).expect("switch target must remain a switch");
        for (index, case) in node.cases.iter_mut().enumerate() {
            let probe = self.probe(
                target
                    .case_ids
                    .get(index)
                    .expect("switch case target count must remain stable"),
            );
            case.consequent.insert(0, probe);
            if let Some(entered) = &entered {
                case.consequent.insert(0, self.entered_assignment(entered));
            }
        }
        let (Some(entered), Some(no_match_id)) = (entered, &target.no_match_id) else {
            return;
        };
        let declaration =
            Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast.vec1(self.ast.variable_declarator(
                    Span::default(),
                    VariableDeclarationKind::Let,
                    self.ast.binding_pattern_binding_identifier(
                        Span::default(),
                        self.ast.ident(&entered),
                    ),
                    NONE,
                    Some(self.ast.expression_boolean_literal(Span::default(), false)),
                    false,
                )),
                false,
            ));
        let original = statement.take_in(self.ast.allocator);
        let no_match = self.ast.statement_if(
            Span::default(),
            self.ast.expression_unary(
                Span::default(),
                UnaryOperator::LogicalNot,
                self.identifier(&entered),
            ),
            self.probe(no_match_id),
            None,
        );
        *statement = self.ast.statement_block(
            Span::default(),
            self.ast.vec_from_array([declaration, original, no_match]),
        );
    }
}

impl<'a> VisitMut<'a> for SwitchTransformer<'a, '_> {
    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_statement(&mut self, statement: &mut Statement<'a>) {
        let Some(key) = Self::target(statement) else {
            walk_mut::walk_statement(self, statement);
            return;
        };
        let Some(target) = self.targets.remove(&key) else {
            walk_mut::walk_statement(self, statement);
            return;
        };
        let has_no_match = target.no_match_id.is_some();
        self.instrument(statement, &target);
        if !has_no_match {
            walk_mut::walk_statement(self, statement);
        }
    }
}

struct RouteRequestPhaseTransformer<'a, 's> {
    ast: AstBuilder<'a>,
    file: &'s str,
    with_request_phase: String,
    used: bool,
    names: CandidateNames<'s>,
}

impl<'a> RouteRequestPhaseTransformer<'a, '_> {
    fn is_remix_route(&self) -> bool {
        self.file.starts_with("app/routes/")
    }

    fn is_next_route(&self) -> bool {
        let path = Path::new(self.file);
        let Some(name) = path.file_name().and_then(|name| name.to_str()) else {
            return false;
        };
        let is_route_module = [
            "route.js",
            "route.jsx",
            "route.ts",
            "route.tsx",
            "route.mjs",
            "route.mts",
            "route.cjs",
            "route.cts",
        ]
        .contains(&name);
        if !is_route_module {
            return false;
        }
        let components = path
            .components()
            .filter_map(|component| component.as_os_str().to_str())
            .collect::<Vec<_>>();
        components
            .windows(2)
            .any(|window| window[0] == "app" && window[1] != name)
    }

    fn is_handler_name(&self, name: &str) -> bool {
        (self.is_remix_route() && matches!(name, "loader" | "action"))
            || (self.is_next_route()
                && matches!(
                    name,
                    "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS"
                ))
    }

    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn wrap_expression(&self, expression: Expression<'a>) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.identifier(&self.with_request_phase),
            NONE,
            self.ast.vec1(Argument::from(expression)),
            false,
        )
    }

    fn wrapped_named_export(&self, exported_name: &str, original_name: &str) -> Statement<'a> {
        Statement::ExportNamedDeclaration(self.ast.alloc_export_named_declaration(
            Span::default(),
            Some(self.ast.declaration_variable(
                Span::default(),
                VariableDeclarationKind::Const,
                self.ast.vec1(self.ast.variable_declarator(
                    Span::default(),
                    VariableDeclarationKind::Const,
                    self.ast.binding_pattern_binding_identifier(
                        Span::default(),
                        self.ast.ident(exported_name),
                    ),
                    NONE,
                    Some(self.wrap_expression(self.identifier(original_name))),
                    false,
                )),
                false,
            )),
            self.ast.vec(),
            None,
            ImportOrExportKind::Value,
            NONE,
        ))
    }

    fn transform_named_export(
        &mut self,
        mut export: oxc_allocator::Box<'a, oxc_ast::ast::ExportNamedDeclaration<'a>>,
        output: &mut oxc_allocator::Vec<'a, Statement<'a>>,
    ) {
        if let Some(Declaration::VariableDeclaration(declaration)) = &mut export.declaration {
            for declarator in &mut declaration.declarations {
                let Some(name) = binding_identifier_name(&declarator.id) else {
                    continue;
                };
                if !self.is_handler_name(&name) {
                    continue;
                }
                if let Some(initializer) = &mut declarator.init {
                    let original = initializer.take_in(self.ast.allocator);
                    *initializer = self.wrap_expression(original);
                    self.used = true;
                }
            }
            output.push(Statement::ExportNamedDeclaration(export));
            return;
        }

        if matches!(
            export.declaration,
            Some(Declaration::FunctionDeclaration(_))
        ) {
            let Some(Declaration::FunctionDeclaration(mut function)) = export.declaration.take()
            else {
                unreachable!();
            };
            let Some(exported_name) = function.id.as_ref().map(|id| id.name.to_string()) else {
                output.push(Statement::FunctionDeclaration(function));
                return;
            };
            if !self.is_handler_name(&exported_name) {
                export.declaration = Some(Declaration::FunctionDeclaration(function));
                output.push(Statement::ExportNamedDeclaration(export));
                return;
            }
            let original_name = self
                .names
                .allocate(&format!("__supercov{exported_name}CoverageOriginal"));
            function.id = Some(
                self.ast
                    .binding_identifier(Span::default(), self.ast.ident(&original_name)),
            );
            output.push(Statement::FunctionDeclaration(function));
            output.push(self.wrapped_named_export(&exported_name, &original_name));
            self.used = true;
            return;
        }

        if export.source.is_none() {
            output.push(Statement::ExportNamedDeclaration(export));
            return;
        }
        let source = export
            .source
            .as_ref()
            .expect("checked above")
            .clone_in(self.ast.allocator);
        let specifiers = export.specifiers.take_in(self.ast.allocator);
        let mut untouched = self.ast.vec();
        let mut handlers = Vec::new();
        for specifier in specifiers {
            let exported_name = specifier
                .exported
                .identifier_name()
                .map(|name| name.to_string());
            if exported_name
                .as_deref()
                .is_some_and(|name| self.is_handler_name(name))
            {
                handlers.push((exported_name.expect("checked above"), specifier));
            } else {
                untouched.push(specifier);
            }
        }
        if handlers.is_empty() {
            export.specifiers = untouched;
            output.push(Statement::ExportNamedDeclaration(export));
            return;
        }
        if !untouched.is_empty() {
            output.push(Statement::ExportNamedDeclaration(
                self.ast.alloc_export_named_declaration(
                    export.span,
                    None,
                    untouched,
                    Some(source.clone_in(self.ast.allocator)),
                    export.export_kind,
                    export.with_clause.take(),
                ),
            ));
        }
        for (exported_name, specifier) in handlers {
            let original_name = self
                .names
                .allocate(&format!("__supercov{exported_name}CoverageOriginal"));
            output.push(Statement::ImportDeclaration(
                self.ast.alloc_import_declaration(
                    Span::default(),
                    Some(self.ast.vec1(
                        self.ast.import_declaration_specifier_import_specifier(
                            Span::default(),
                            specifier.local,
                            self.ast.binding_identifier(
                                Span::default(),
                                self.ast.ident(&original_name),
                            ),
                            ImportOrExportKind::Value,
                        ),
                    )),
                    source.clone_in(self.ast.allocator),
                    None,
                    NONE,
                    ImportOrExportKind::Value,
                ),
            ));
            output.push(self.wrapped_named_export(&exported_name, &original_name));
        }
        self.used = true;
    }

    fn transform_default_export(
        &mut self,
        mut export: oxc_allocator::Box<'a, oxc_ast::ast::ExportDefaultDeclaration<'a>>,
        output: &mut oxc_allocator::Vec<'a, Statement<'a>>,
    ) {
        if let ExportDefaultDeclarationKind::FunctionDeclaration(mut function) =
            export.declaration.take_in(self.ast.allocator)
        {
            let original_name = self
                .names
                .allocate("__supercovHandleRequestCoverageOriginal");
            function.id = Some(
                self.ast
                    .binding_identifier(Span::default(), self.ast.ident(&original_name)),
            );
            output.push(Statement::FunctionDeclaration(function));
            output.push(Statement::ExportDefaultDeclaration(
                self.ast.alloc_export_default_declaration(
                    Span::default(),
                    ExportDefaultDeclarationKind::from(
                        self.wrap_expression(self.identifier(&original_name)),
                    ),
                ),
            ));
            self.used = true;
            return;
        }
        if export.declaration.is_expression() {
            let original = export
                .declaration
                .take_in(self.ast.allocator)
                .into_expression();
            export.declaration = ExportDefaultDeclarationKind::from(self.wrap_expression(original));
            self.used = true;
        }
        output.push(Statement::ExportDefaultDeclaration(export));
    }

    fn transform_program(&mut self, program: &mut Program<'a>) {
        let route_module = self.is_remix_route() || self.is_next_route();
        let server_entry = self.file.starts_with("app/entry.server.")
            && ["js", "jsx", "ts", "tsx", "mjs", "mts", "cjs", "cts"].contains(
                &Path::new(self.file)
                    .extension()
                    .and_then(|value| value.to_str())
                    .unwrap_or(""),
            );
        if !route_module && !server_entry {
            return;
        }
        let original = program.body.take_in(self.ast.allocator);
        let mut output = self.ast.vec_with_capacity(original.len() + 4);
        for statement in original {
            match statement {
                Statement::ExportNamedDeclaration(export) if route_module => {
                    self.transform_named_export(export, &mut output);
                }
                Statement::ExportDefaultDeclaration(export) if server_entry => {
                    self.transform_default_export(export, &mut output);
                }
                statement => output.push(statement),
            }
        }
        program.body = output;
    }
}

struct RequestPhaseTransformer<'a> {
    ast: AstBuilder<'a>,
    with_request_phase: String,
    used: bool,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

impl<'a> RequestPhaseTransformer<'a> {
    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn callee_is(callee: &Expression<'a>, name: &str) -> bool {
        match callee {
            Expression::Identifier(identifier) => identifier.name == name,
            Expression::StaticMemberExpression(member) => member.property.name == name,
            _ => false,
        }
    }

    fn callback_candidate(argument: &Argument<'a>) -> bool {
        matches!(
            argument,
            Argument::FunctionExpression(_)
                | Argument::ArrowFunctionExpression(_)
                | Argument::Identifier(_)
                | Argument::ComputedMemberExpression(_)
                | Argument::StaticMemberExpression(_)
                | Argument::PrivateFieldExpression(_)
        )
    }

    fn already_wrapped(&self, argument: &Argument<'a>) -> bool {
        matches!(
            argument,
            Argument::CallExpression(call)
                if expression_is_identifier(&call.callee, &self.with_request_phase)
        )
    }

    fn wrap_argument(&mut self, argument: &mut Argument<'a>, event: Option<&str>) {
        if self.already_wrapped(argument) || !argument.is_expression() {
            return;
        }
        let expression = argument.to_expression_mut();
        let original = expression.take_in(self.ast.allocator);
        *expression = self.ast.expression_call(
            Span::default(),
            self.identifier(&self.with_request_phase),
            NONE,
            self.ast
                .vec_from_iter(std::iter::once(Argument::from(original)).chain(event.map(
                    |name| {
                        Argument::from(self.ast.expression_string_literal(
                            Span::default(),
                            self.ast.str(name),
                            None,
                        ))
                    },
                ))),
            false,
        );
        self.used = true;
    }
}

impl<'a> VisitMut<'a> for RequestPhaseTransformer<'a> {
    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk_mut::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_call_expression(&mut self, call: &mut CallExpression<'a>) {
        walk_mut::walk_call_expression(self, call);
        let property = match &call.callee {
            Expression::StaticMemberExpression(member) => Some(member.property.name.as_str()),
            _ => None,
        };
        let mut callback_index = None;
        if matches!(property, Some("on" | "once" | "addListener"))
            && matches!(
                call.arguments.first(),
                Some(Argument::StringLiteral(event))
                    if matches!(event.value.as_str(), "request" | "upgrade" | "connection")
            )
        {
            callback_index = Some(1);
        } else if Self::callee_is(&call.callee, "createServer") {
            callback_index = call.arguments.iter().rposition(Self::callback_candidate);
        }
        let connection = matches!(call.arguments.first(), Some(Argument::StringLiteral(event)) if event.value == "connection");
        if let Some(index) = callback_index
            && let Some(argument) = call.arguments.get_mut(index)
        {
            self.wrap_argument(argument, connection.then_some("connection"));
        }
    }
}

struct CandidateNames<'s> {
    source: &'s str,
    /// Every identifier in the source that begins with `_`, which every
    /// generated name does. Asking the source whether it contains a name was
    /// a scan of the whole file per name, and names are allocated per
    /// function: the second quadratic cost in instrumenting a long file.
    underscored: HashSet<&'s str>,
    allocated: HashSet<String>,
    suffix: usize,
    /// Appended to every name, so output that shares a scope with other
    /// instrumented files cannot collide with theirs.
    namespace: String,
}

impl<'s> CandidateNames<'s> {
    fn new(source: &'s str) -> Self {
        Self::within(source, "")
    }

    fn within(source: &'s str, namespace: &str) -> Self {
        let identifier = |c: char| c.is_ascii_alphanumeric() || c == '_' || c == '$';
        let underscored = source
            .split(|c: char| !identifier(c))
            .filter(|word| word.starts_with('_'))
            .collect();
        Self {
            source,
            underscored,
            allocated: HashSet::new(),
            suffix: 0,
            namespace: namespace.to_owned(),
        }
    }

    fn taken(&self, candidate: &str) -> bool {
        self.allocated.contains(candidate)
            || if candidate.starts_with('_') {
                self.underscored.contains(candidate)
            } else {
                self.source.contains(candidate)
            }
    }

    fn allocate(&mut self, base: &str) -> String {
        loop {
            let candidate = if self.suffix == 0 {
                format!("{base}{}", self.namespace)
            } else {
                format!("{base}{}{}", self.suffix, self.namespace)
            };
            self.suffix += 1;
            if !self.taken(&candidate) {
                self.allocated.insert(candidate.clone());
                return candidate;
            }
        }
    }
}

struct ControlProbeV2Transformer<'a, 's> {
    ast: AstBuilder<'a>,
    decisions: &'s [CandidateDecision],
    mcdc_begin: String,
    mcdc_condition: String,
    mcdc_end: String,
    mcdc_end_v2: String,
    probe_file_v2: String,
    names: CandidateNames<'s>,
    scope_declarations: Vec<Vec<String>>,
    decision_index: usize,
    parameter_depth: usize,
    source_sensitive_functions: HashSet<SpanKey>,
    with_statements: HashSet<SpanKey>,
}

#[derive(Clone, Copy)]
struct DecisionPlan {
    index: usize,
    condition_count: usize,
    inline_frame: bool,
}

impl<'a> ControlProbeV2Transformer<'a, '_> {
    fn enter_declaration_scope(&mut self) {
        self.scope_declarations.push(Vec::new());
    }

    fn leave_declaration_scope(&mut self) -> Vec<String> {
        self.scope_declarations
            .pop()
            .expect("program/function scope stack must remain balanced")
    }

    fn allocate_scratch(&mut self, base: &str) -> String {
        let name = self.names.allocate(base);
        self.scope_declarations
            .last_mut()
            .expect("a control decision must be inside a program or function body")
            .push(name.clone());
        name
    }

    fn scratch_for(&mut self, base: &str, inline: bool) -> String {
        if inline {
            self.names.allocate(base)
        } else {
            self.allocate_scratch(base)
        }
    }

    fn wrap_inline_frame(&self, expression: Expression<'a>, names: &[String]) -> Expression<'a> {
        let declarations = self.ast.vec_from_iter(names.iter().map(|name| {
            self.ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast
                    .binding_pattern_binding_identifier(Span::default(), self.ast.ident(name)),
                NONE,
                None,
                false,
            )
        }));
        let body = self.ast.alloc_function_body(
            Span::default(),
            self.ast.vec(),
            self.ast.vec_from_array([
                Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                    Span::default(),
                    VariableDeclarationKind::Let,
                    declarations,
                    false,
                )),
                self.ast.statement_return(Span::default(), Some(expression)),
            ]),
        );
        let params = self.ast.alloc_formal_parameters(
            Span::default(),
            FormalParameterKind::ArrowFormalParameters,
            self.ast.vec(),
            NONE,
        );
        let arrow = self.ast.expression_arrow_function(
            Span::default(),
            false,
            false,
            NONE,
            params,
            NONE,
            body,
        );
        self.ast
            .expression_call(Span::default(), arrow, NONE, self.ast.vec(), false)
    }

    fn prepend_declarations(
        &self,
        names: Vec<String>,
        statements: &mut oxc_allocator::Vec<'a, Statement<'a>>,
    ) {
        if names.is_empty() {
            return;
        }
        let declarators = self.ast.vec_from_iter(names.into_iter().map(|name| {
            self.ast.variable_declarator(
                Span::default(),
                VariableDeclarationKind::Let,
                self.ast
                    .binding_pattern_binding_identifier(Span::default(), self.ast.ident(&name)),
                NONE,
                None,
                false,
            )
        }));
        statements.insert(
            0,
            Statement::VariableDeclaration(self.ast.alloc_variable_declaration(
                Span::default(),
                VariableDeclarationKind::Let,
                declarators,
                false,
            )),
        );
    }

    fn identifier(&self, name: &str) -> Expression<'a> {
        self.ast
            .expression_identifier(Span::default(), self.ast.ident(name))
    }

    fn assignment_target(&self, name: &str) -> AssignmentTarget<'a> {
        let target = self
            .ast
            .simple_assignment_target_assignment_target_identifier(
                Span::default(),
                self.ast.ident(name),
            );
        AssignmentTarget::from(target)
    }

    fn number(&self, value: u64) -> Expression<'a> {
        self.ast.expression_numeric_literal(
            Span::default(),
            value as f64,
            None,
            NumberBase::Decimal,
        )
    }

    fn string(&self, value: &str) -> Expression<'a> {
        self.ast
            .expression_string_literal(Span::default(), self.ast.str(value), None)
    }

    fn object_property(&self, name: &str, value: Expression<'a>) -> ObjectPropertyKind<'a> {
        self.ast.object_property_kind_object_property(
            Span::default(),
            PropertyKind::Init,
            self.ast
                .property_key_static_identifier(Span::default(), self.ast.ident(name)),
            value,
            false,
            false,
            false,
        )
    }

    fn decision_meta(&self, decision: &CandidateDecision) -> Expression<'a> {
        let conditions = self.ast.expression_array(
            Span::default(),
            self.ast.vec_from_iter(
                decision
                    .conditions
                    .iter()
                    .map(|condition| ArrayExpressionElement::from(self.string(condition))),
            ),
        );
        let properties = self.ast.vec_from_array([
            self.object_property("id", self.string(&decision.id)),
            self.object_property("file", self.string(&decision.file)),
            self.object_property("line", self.number(decision.line as u64)),
            self.object_property("column", self.number(decision.column as u64)),
            self.object_property("source", self.string(&decision.source)),
            self.object_property("conditions", conditions),
            self.object_property("kind", self.string(&decision.kind)),
        ]);
        Expression::ObjectExpression(
            self.ast
                .alloc_object_expression(Span::default(), properties),
        )
    }

    fn instrument_condition(
        &self,
        expression: Expression<'a>,
        frame_name: &str,
        temporary_name: &str,
        index: usize,
    ) -> Expression<'a> {
        let assign_value = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Assign,
            self.assignment_target(temporary_name),
            expression,
        );
        let weight = 3_u64.pow(index as u32);
        let digit = self.ast.expression_conditional(
            Span::default(),
            self.identifier(temporary_name),
            self.number(weight * 2),
            self.number(weight),
        );
        let add_digit = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Addition,
            self.assignment_target(frame_name),
            digit,
        );
        self.ast.expression_sequence(
            Span::default(),
            self.ast
                .vec_from_array([assign_value, add_digit, self.identifier(temporary_name)]),
        )
    }

    fn instrument_conditions(
        &self,
        expression: &mut Expression<'a>,
        frame_name: &str,
        temporary_names: &[String],
        next_index: &mut usize,
    ) {
        match expression {
            Expression::ParenthesizedExpression(parenthesized) => self.instrument_conditions(
                &mut parenthesized.expression,
                frame_name,
                temporary_names,
                next_index,
            ),
            Expression::LogicalExpression(logical)
                if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
            {
                self.instrument_conditions(
                    &mut logical.left,
                    frame_name,
                    temporary_names,
                    next_index,
                );
                self.instrument_conditions(
                    &mut logical.right,
                    frame_name,
                    temporary_names,
                    next_index,
                );
            }
            Expression::UnaryExpression(unary)
                if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
            {
                self.instrument_conditions(
                    &mut unary.argument,
                    frame_name,
                    temporary_names,
                    next_index,
                );
            }
            _ => {
                let index = *next_index;
                *next_index += 1;
                let original = expression.take_in(self.ast.allocator);
                *expression =
                    self.instrument_condition(original, frame_name, &temporary_names[index], index);
            }
        }
    }

    fn instrument_condition_v1(
        &self,
        expression: Expression<'a>,
        frame_name: &str,
        index: usize,
    ) -> Expression<'a> {
        self.ast.expression_call(
            Span::default(),
            self.identifier(&self.mcdc_condition),
            NONE,
            self.ast.vec_from_array([
                Argument::from(self.identifier(frame_name)),
                Argument::from(self.number(index as u64)),
                Argument::from(expression),
            ]),
            false,
        )
    }

    fn instrument_conditions_v1(
        &self,
        expression: &mut Expression<'a>,
        frame_name: &str,
        next_index: &mut usize,
    ) {
        match expression {
            Expression::ParenthesizedExpression(parenthesized) => {
                self.instrument_conditions_v1(&mut parenthesized.expression, frame_name, next_index)
            }
            Expression::LogicalExpression(logical)
                if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
            {
                self.instrument_conditions_v1(&mut logical.left, frame_name, next_index);
                self.instrument_conditions_v1(&mut logical.right, frame_name, next_index);
            }
            Expression::UnaryExpression(unary)
                if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
            {
                self.instrument_conditions_v1(&mut unary.argument, frame_name, next_index);
            }
            _ => {
                let index = *next_index;
                *next_index += 1;
                let original = expression.take_in(self.ast.allocator);
                *expression = self.instrument_condition_v1(original, frame_name, index);
            }
        }
    }

    fn reserve_decision(&mut self, test: &Expression<'a>) -> DecisionPlan {
        let mut condition_spans = Vec::new();
        collect_conditions(test, &mut condition_spans);
        let plan = DecisionPlan {
            index: self.decision_index,
            condition_count: condition_spans.len(),
            inline_frame: self.parameter_depth > 0,
        };
        self.decision_index += 1;
        plan
    }

    fn apply_decision(&mut self, test: &mut Expression<'a>, plan: DecisionPlan) {
        if plan.condition_count > 32 {
            let frame_name = self.scratch_for("_supercovMcdcFrame", plan.inline_frame);
            let mut next_index = 0;
            self.instrument_conditions_v1(test, &frame_name, &mut next_index);
            debug_assert_eq!(next_index, plan.condition_count);

            let decision = &self.decisions[plan.index];
            let begin = self.ast.expression_call(
                Span::default(),
                self.identifier(&self.mcdc_begin),
                NONE,
                self.ast.vec_from_array([
                    Argument::from(self.string(&decision.id)),
                    Argument::from(self.decision_meta(decision)),
                ]),
                false,
            );
            let assign_frame = self.ast.expression_assignment(
                Span::default(),
                AssignmentOperator::Assign,
                self.assignment_target(&frame_name),
                begin,
            );
            let instrumented = test.take_in(self.ast.allocator);
            let end = self.ast.expression_call(
                Span::default(),
                self.identifier(&self.mcdc_end),
                NONE,
                self.ast.vec_from_array([
                    Argument::from(self.identifier(&frame_name)),
                    Argument::from(instrumented),
                ]),
                false,
            );
            let observed = self.ast.expression_sequence(
                Span::default(),
                self.ast.vec_from_array([assign_frame, end]),
            );
            *test = if plan.inline_frame {
                self.wrap_inline_frame(observed, &[frame_name])
            } else {
                observed
            };
            return;
        }

        let frame_name = self.scratch_for("_supercovMcdcFrame", plan.inline_frame);
        let result_name = self.scratch_for("_supercovMcdcResult", plan.inline_frame);
        let temporary_names = (0..plan.condition_count)
            .map(|_| self.scratch_for("_supercovMcdcValue", plan.inline_frame))
            .collect::<Vec<_>>();
        let mut next_index = 0;
        self.instrument_conditions(test, &frame_name, &temporary_names, &mut next_index);
        debug_assert_eq!(next_index, plan.condition_count);

        let original = test.take_in(self.ast.allocator);
        let assign_frame = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Assign,
            self.assignment_target(&frame_name),
            self.number(0),
        );
        let assign_result = self.ast.expression_assignment(
            Span::default(),
            AssignmentOperator::Assign,
            self.assignment_target(&result_name),
            original,
        );
        let arguments = self.ast.vec_from_array([
            Argument::from(self.identifier(&self.probe_file_v2)),
            Argument::from(self.number(plan.index as u64)),
            Argument::from(self.identifier(&frame_name)),
            Argument::from(self.identifier(&result_name)),
        ]);
        let record = self.ast.expression_call(
            Span::default(),
            self.identifier(&self.mcdc_end_v2),
            NONE,
            arguments,
            false,
        );
        let observed = self.ast.expression_sequence(
            Span::default(),
            self.ast.vec_from_array([
                assign_frame,
                assign_result,
                record,
                self.identifier(&result_name),
            ]),
        );
        *test = if plan.inline_frame {
            let mut names = vec![frame_name, result_name];
            names.extend(temporary_names);
            self.wrap_inline_frame(observed, &names)
        } else {
            observed
        };
    }
}

impl<'a> VisitMut<'a> for ControlProbeV2Transformer<'a, '_> {
    fn visit_program(&mut self, program: &mut Program<'a>) {
        self.enter_declaration_scope();
        walk_mut::walk_program(self, program);
        let declarations = self.leave_declaration_scope();
        self.prepend_declarations(declarations, &mut program.body);
    }

    fn visit_function_body(&mut self, body: &mut FunctionBody<'a>) {
        self.enter_declaration_scope();
        walk_mut::walk_function_body(self, body);
        let declarations = self.leave_declaration_scope();
        self.prepend_declarations(declarations, &mut body.statements);
    }

    fn visit_function(&mut self, function: &mut Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        let outer_parameter_depth = self.parameter_depth;
        self.parameter_depth = 0;
        walk_mut::walk_function(self, function, flags);
        self.parameter_depth = outer_parameter_depth;
    }

    fn visit_arrow_function_expression(&mut self, function: &mut ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        let outer_parameter_depth = self.parameter_depth;
        self.parameter_depth = 0;
        walk_mut::walk_arrow_function_expression(self, function);
        self.parameter_depth = outer_parameter_depth;
    }

    fn visit_formal_parameters(&mut self, parameters: &mut FormalParameters<'a>) {
        self.parameter_depth += 1;
        walk_mut::walk_formal_parameters(self, parameters);
        self.parameter_depth -= 1;
    }

    fn visit_with_statement(&mut self, statement: &mut WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk_mut::walk_with_statement(self, statement);
    }

    fn visit_if_statement(&mut self, statement: &mut IfStatement<'a>) {
        let plan = decision_outcome_is_variable(&statement.test)
            .then(|| self.reserve_decision(&statement.test));
        self.visit_expression(&mut statement.test);
        if let Some(plan) = plan {
            self.apply_decision(&mut statement.test, plan);
        }
        self.visit_statement(&mut statement.consequent);
        if let Some(alternate) = &mut statement.alternate {
            self.visit_statement(alternate);
        }
    }

    fn visit_conditional_expression(&mut self, expression: &mut ConditionalExpression<'a>) {
        let plan = decision_outcome_is_variable(&expression.test)
            .then(|| self.reserve_decision(&expression.test));
        self.visit_expression(&mut expression.test);
        if let Some(plan) = plan {
            self.apply_decision(&mut expression.test, plan);
        }
        self.visit_expression(&mut expression.consequent);
        self.visit_expression(&mut expression.alternate);
    }

    fn visit_while_statement(&mut self, statement: &mut WhileStatement<'a>) {
        let plan = decision_outcome_is_variable(&statement.test)
            .then(|| self.reserve_decision(&statement.test));
        self.visit_expression(&mut statement.test);
        if let Some(plan) = plan {
            self.apply_decision(&mut statement.test, plan);
        }
        self.visit_statement(&mut statement.body);
    }

    fn visit_do_while_statement(&mut self, statement: &mut DoWhileStatement<'a>) {
        let plan = decision_outcome_is_variable(&statement.test)
            .then(|| self.reserve_decision(&statement.test));
        self.visit_statement(&mut statement.body);
        self.visit_expression(&mut statement.test);
        if let Some(plan) = plan {
            self.apply_decision(&mut statement.test, plan);
        }
    }

    fn visit_for_statement(&mut self, statement: &mut ForStatement<'a>) {
        let plan = statement
            .test
            .as_ref()
            .filter(|test| decision_outcome_is_variable(test))
            .map(|test| self.reserve_decision(test));
        if let Some(init) = &mut statement.init {
            self.visit_for_statement_init(init);
        }
        if let (Some(test), Some(plan)) = (&mut statement.test, plan) {
            self.visit_expression(test);
            self.apply_decision(test, plan);
        }
        if let Some(update) = &mut statement.update {
            self.visit_expression(update);
        }
        self.visit_statement(&mut statement.body);
    }
}

struct DecisionCollector<'s> {
    source: &'s str,
    file: &'s str,
    decisions: Vec<CandidateDecision>,
    decision_vector_counts: Vec<usize>,
    decision_logical_nodes: HashSet<SpanKey>,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    with_statements: &'s HashSet<SpanKey>,
}

impl DecisionCollector<'_> {
    fn record_decision(&mut self, test: &Expression<'_>, kind: &str) {
        let mut condition_spans = Vec::new();
        collect_conditions(test, &mut condition_spans);
        collect_decision_logical_nodes(test, &mut self.decision_logical_nodes);
        // Babel treats redundant parentheses as parser metadata rather than
        // part of the decision node. oxc preserves a ParenthesizedExpression,
        // so normalize it here to keep locations and stable IDs parser-neutral.
        let span = transparent_expression(test).span();
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        self.decisions.push(CandidateDecision {
            id: stable_id(self.source, self.file, "decision", span, kind),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, span).to_string(),
            conditions: condition_spans
                .iter()
                .map(|condition| source_slice(self.source, *condition).to_string())
                .collect(),
            kind: kind.to_string(),
        });
        self.decision_vector_counts.push(
            if condition_spans.len() <= 6 && decision_conditions_are_transparent(test) {
                reachable_vector_count(test, &condition_spans)
            } else {
                0
            },
        );
    }
}

/// MC/DC applies only when a decision can produce both Boolean outcomes.
/// This deliberately recognizes only semantics that are provable from syntax;
/// it never evaluates user code or assumes values for identifiers/calls.
fn decision_outcome_is_variable(expression: &Expression<'_>) -> bool {
    syntactic_boolean_outcome(expression).is_none()
}

fn syntactic_boolean_outcome(expression: &Expression<'_>) -> Option<bool> {
    match transparent_expression(expression) {
        Expression::BooleanLiteral(literal) => Some(literal.value),
        Expression::UnaryExpression(unary) if unary.operator.is_not() => {
            syntactic_boolean_outcome(&unary.argument).map(|value| !value)
        }
        Expression::LogicalExpression(logical)
            if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
        {
            let left = syntactic_boolean_outcome(&logical.left);
            let right = syntactic_boolean_outcome(&logical.right);
            match logical.operator {
                LogicalOperator::And => match (left, right) {
                    (Some(false), _) | (_, Some(false)) => Some(false),
                    (Some(true), value) | (value, Some(true)) => value,
                    _ => None,
                },
                LogicalOperator::Or => match (left, right) {
                    (Some(true), _) | (_, Some(true)) => Some(true),
                    (Some(false), value) | (value, Some(false)) => value,
                    _ => None,
                },
                LogicalOperator::Coalesce => None,
            }
        }
        _ => None,
    }
}

#[derive(Default)]
struct CoverageSurfaceScanner {
    found: bool,
}

impl<'a> Visit<'a> for CoverageSurfaceScanner {
    fn visit_logical_expression(&mut self, _expression: &LogicalExpression<'a>) {
        self.found = true;
    }

    fn visit_conditional_expression(&mut self, _expression: &ConditionalExpression<'a>) {
        self.found = true;
    }

    fn visit_chain_expression(&mut self, _expression: &ChainExpression<'a>) {
        self.found = true;
    }

    fn visit_function(&mut self, _function: &Function<'a>, _flags: ScopeFlags) {
        self.found = true;
    }

    fn visit_arrow_function_expression(&mut self, _function: &ArrowFunctionExpression<'a>) {
        self.found = true;
    }

    fn visit_class(&mut self, _class: &Class<'a>) {
        self.found = true;
    }

    fn visit_assignment_expression(&mut self, expression: &AssignmentExpression<'a>) {
        if expression.operator.is_logical() {
            self.found = true;
        } else {
            walk::walk_assignment_expression(self, expression);
        }
    }
}

fn decision_conditions_are_transparent(expression: &Expression<'_>) -> bool {
    fn visit_condition(expression: &Expression<'_>) -> bool {
        let mut scanner = CoverageSurfaceScanner::default();
        scanner.visit_expression(expression);
        !scanner.found
    }
    match transparent_expression(expression) {
        Expression::LogicalExpression(logical)
            if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
        {
            decision_conditions_are_transparent(&logical.left)
                && decision_conditions_are_transparent(&logical.right)
        }
        Expression::UnaryExpression(unary)
            if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
        {
            decision_conditions_are_transparent(&unary.argument)
        }
        condition => visit_condition(condition),
    }
}

fn reachable_vector_count(expression: &Expression<'_>, conditions: &[Span]) -> usize {
    fn evaluate(
        expression: &Expression<'_>,
        assignment: usize,
        encoded: &mut usize,
        indices: &HashMap<SpanKey, usize>,
    ) -> bool {
        match transparent_expression(expression) {
            Expression::LogicalExpression(logical)
                if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
            {
                let left = evaluate(&logical.left, assignment, encoded, indices);
                if logical.operator == LogicalOperator::And {
                    left && evaluate(&logical.right, assignment, encoded, indices)
                } else {
                    left || evaluate(&logical.right, assignment, encoded, indices)
                }
            }
            Expression::UnaryExpression(unary)
                if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
            {
                !evaluate(&unary.argument, assignment, encoded, indices)
            }
            condition => {
                let index = indices
                    .get(&span_key(condition.span()))
                    .expect("decision condition index must remain stable");
                let value = assignment & (1 << index) != 0;
                *encoded += (if value { 2 } else { 1 }) * 3_usize.pow(*index as u32);
                value
            }
        }
    }

    let indices = conditions
        .iter()
        .enumerate()
        .map(|(index, span)| (span_key(*span), index))
        .collect::<HashMap<_, _>>();
    let mut vectors = HashSet::new();
    for assignment in 0..(1_usize << conditions.len()) {
        let mut encoded = 0;
        let outcome = evaluate(expression, assignment, &mut encoded, &indices);
        vectors.insert(encoded * 2 + usize::from(outcome));
    }
    vectors.len()
}

fn collect_decision_logical_nodes(expression: &Expression<'_>, nodes: &mut HashSet<SpanKey>) {
    match expression {
        Expression::ParenthesizedExpression(parenthesized) => {
            collect_decision_logical_nodes(&parenthesized.expression, nodes);
        }
        Expression::LogicalExpression(logical)
            if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
        {
            nodes.insert(span_key(logical.span));
            collect_decision_logical_nodes(&logical.left, nodes);
            collect_decision_logical_nodes(&logical.right, nodes);
        }
        Expression::UnaryExpression(unary)
            if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
        {
            collect_decision_logical_nodes(&unary.argument, nodes);
        }
        _ => {}
    }
}

#[derive(Default)]
struct LogicalBranchAnalysis {
    branches: Vec<CandidateBranch>,
    logical_targets: HashMap<SpanKey, (String, String)>,
}

#[derive(Default)]
struct LogicalAssignmentAnalysis {
    branches: Vec<CandidateBranch>,
    targets: HashMap<SpanKey, (String, String)>,
}

#[derive(Default)]
struct OptionalMemberAnalysis {
    branches: Vec<CandidateBranch>,
    targets: HashMap<SpanKey, (String, String)>,
}

#[derive(Default)]
struct OptionalCallAnalysis {
    branches: Vec<CandidateBranch>,
    sites: HashMap<SpanKey, (String, String)>,
    roots: HashMap<SpanKey, Vec<SpanKey>>,
    limitations: Vec<CandidateLimitation>,
}

#[derive(Clone)]
struct DefaultTarget {
    default_id: String,
    provided_id: String,
    inferred_name: Option<String>,
}

#[derive(Default)]
struct DefaultAnalysis {
    branches: Vec<CandidateBranch>,
    parameter_targets: HashMap<SpanKey, DefaultTarget>,
    binding_targets: HashMap<SpanKey, DefaultTarget>,
    limitations: Vec<CandidateLimitation>,
}

#[derive(Clone)]
struct ExtendedTarget {
    first_id: String,
    second_id: String,
}

#[derive(Default)]
struct ExtendedAnalysis {
    branches: Vec<CandidateBranch>,
    try_targets: HashMap<SpanKey, ExtendedTarget>,
    loop_targets: HashMap<SpanKey, ExtendedTarget>,
}

#[derive(Clone)]
struct SwitchTarget {
    case_ids: Vec<String>,
    no_match_id: Option<String>,
}

#[derive(Default)]
struct SwitchAnalysis {
    branches: Vec<CandidateBranch>,
    targets: HashMap<SpanKey, SwitchTarget>,
}

struct SwitchCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    suppressed_depth: usize,
    suppressed_nodes: Vec<bool>,
    analysis: SwitchAnalysis,
}

impl SwitchCollector<'_> {
    fn unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0
    }

    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for SwitchCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_switch_statement(
        &mut self,
        node: &mut SwitchStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        let has_default = node.cases.iter().any(|case| case.test.is_none());
        let transformed = self.suppressed_depth == 0 && !self.unsafe_context();
        let suppresses = transformed && !has_default;
        self.suppressed_nodes.push(suppresses);
        if suppresses {
            self.suppressed_depth += 1;
        }
        if !transformed {
            return;
        }
        let id = stable_id(self.source, self.file, "switch", node.span, "");
        let mut case_ids = Vec::with_capacity(node.cases.len());
        let mut alternatives = Vec::with_capacity(node.cases.len() + usize::from(!has_default));
        for (index, case) in node.cases.iter().enumerate() {
            let alternative_id = format!("{id}:case:{index}");
            let label = case.test.as_ref().map_or_else(
                || "default".to_string(),
                |test| format!("case {}", source_slice(self.source, test.span())),
            );
            case_ids.push(alternative_id.clone());
            alternatives.push(CandidateBranchAlternative {
                id: alternative_id,
                label,
            });
        }
        let no_match_id = (!has_default).then(|| format!("{id}:no-match"));
        if let Some(no_match_id) = &no_match_id {
            alternatives.push(CandidateBranchAlternative {
                id: no_match_id.clone(),
                label: "no matching case".to_string(),
            });
        }
        let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "switch".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, node.discriminant.span()).to_string(),
            alternatives,
        });
        self.analysis.targets.insert(
            span_key(node.span),
            SwitchTarget {
                case_ids,
                no_match_id,
            },
        );
    }

    fn exit_switch_statement(
        &mut self,
        _node: &mut SwitchStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .suppressed_nodes
            .pop()
            .expect("switch collector stack must remain balanced")
        {
            self.suppressed_depth -= 1;
        }
    }
}

fn collect_switch_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> SwitchAnalysis {
    let mut collector = SwitchCollector {
        source,
        file,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        suppressed_depth: 0,
        suppressed_nodes: Vec::new(),
        analysis: SwitchAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct ExtendedCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    entered_loops: HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    analysis: ExtendedAnalysis,
}

impl ExtendedCollector<'_> {
    fn unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0
    }

    fn enter_try(&mut self, node: &TryStatement<'_>) {
        let transformed = !self.unsafe_context() && node.handler.is_some();
        if !transformed {
            return;
        }
        let id = stable_id(self.source, self.file, "try-catch", node.span, "");
        let success_id = format!("{id}:success");
        let catch_id = format!("{id}:catch");
        let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "try-catch".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: "try / catch".to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: success_id.clone(),
                    label: "try completed without catch".to_string(),
                },
                CandidateBranchAlternative {
                    id: catch_id.clone(),
                    label: "catch entered".to_string(),
                },
            ],
        });
        self.analysis.try_targets.insert(
            span_key(node.span),
            ExtendedTarget {
                first_id: success_id,
                second_id: catch_id,
            },
        );
    }

    fn enter_loop(&mut self, span: Span, right: &Expression<'_>, kind: &str) {
        let transformed = !self.unsafe_context();
        if !transformed {
            return;
        }
        // One feasible outcome is not a branch. Recording it as one leaves a
        // permanently unreachable obligation, which is how a project ends up
        // below 100% with nothing to do about it.
        if self.entered_loops.contains(&span_key(span)) {
            return;
        }
        let id = stable_id(self.source, self.file, kind, span, "");
        let zero_id = format!("{id}:zero");
        let entered_id = format!("{id}:entered");
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: kind.to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, right.span()).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: zero_id.clone(),
                    label: "zero iterations".to_string(),
                },
                CandidateBranchAlternative {
                    id: entered_id.clone(),
                    label: "one or more iterations".to_string(),
                },
            ],
        });
        self.analysis.loop_targets.insert(
            span_key(span),
            ExtendedTarget {
                first_id: zero_id,
                second_id: entered_id,
            },
        );
    }

    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for ExtendedCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_try_statement(
        &mut self,
        node: &mut TryStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.enter_try(node);
    }

    fn exit_try_statement(
        &mut self,
        _node: &mut TryStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
    }

    fn enter_for_in_statement(
        &mut self,
        node: &mut ForInStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.enter_loop(node.span, &node.right, "for-in");
    }

    fn exit_for_in_statement(
        &mut self,
        _node: &mut ForInStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
    }

    fn enter_for_of_statement(
        &mut self,
        node: &mut ForOfStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.enter_loop(node.span, &node.right, "for-of");
    }

    fn exit_for_of_statement(
        &mut self,
        _node: &mut ForOfStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
    }
}

/// Loops that must run at least once.
///
/// A `for...of` over a non-empty array literal has no zero-iteration outcome
/// for a test to reach, so asking for one is asking for something impossible.
/// The author's only ways to satisfy it are to fake a test or delete the loop,
/// and a coverage tool should ask for neither.
///
/// This is decided from the syntax tree and symbol resolution alone. It stays
/// there deliberately: a type would answer more questions, but a type can be
/// asserted (`as Foo`) or optimistic (`xs[0]` is `T`, and `[][0]` is
/// `undefined`), and an obligation dropped on a wrong answer is a branch that
/// runs and is never reported again. Over-asking is recoverable; this is not.
fn provably_entered_loops(program: &Program<'_>) -> HashSet<SpanKey> {
    let semantic = SemanticBuilder::new().build(program).semantic;
    let mut found = HashSet::new();
    for node in semantic.nodes() {
        if let AstKind::ForOfStatement(loop_node) = node.kind()
            && never_empty(&loop_node.right, &semantic)
        {
            found.insert(span_key(loop_node.span));
        }
    }
    found
}

/// Whether an iterable cannot be empty: a non-empty array literal, or a
/// `const` bound to one that nothing else in the file can reach.
fn never_empty(expression: &Expression<'_>, semantic: &oxc_semantic::Semantic<'_>) -> bool {
    match transparent_expression(expression) {
        Expression::ArrayExpression(array) => has_definite_element(array),
        Expression::Identifier(identifier) => {
            let Some(symbol) = referenced_symbol(identifier, semantic.scoping()) else {
                return false;
            };
            // Nothing but this loop may reach the binding. A shrinking method
            // (`pop`, `splice`, `length = 0`) is an ordinary read of the
            // identifier, so counting references is what makes this sound --
            // recognising a list of mutating methods would not be.
            if semantic.scoping().get_resolved_references(symbol).count() != 1 {
                return false;
            }
            let declaration = semantic.scoping().symbol_declaration(symbol);
            let AstKind::VariableDeclarator(declarator) =
                semantic.nodes().get_node(declaration).kind()
            else {
                return false;
            };
            declarator.kind == VariableDeclarationKind::Const
                && declarator.init.as_ref().is_some_and(|init| {
                    matches!(transparent_expression(init), Expression::ArrayExpression(array)
                        if has_definite_element(array))
                })
        }
        _ => false,
    }
}

/// An element that is certainly there. A spread may contribute nothing, so
/// `[...xs]` is not known to be non-empty; a hole is, since `[,]` has length 1
/// and yields once.
fn has_definite_element(array: &oxc_ast::ast::ArrayExpression<'_>) -> bool {
    array
        .elements
        .iter()
        .any(|element| !matches!(element, ArrayExpressionElement::SpreadElement(_)))
}

fn collect_extended_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> ExtendedAnalysis {
    let entered_loops = provably_entered_loops(program);
    let mut collector = ExtendedCollector {
        source,
        file,
        source_sensitive_functions,
        entered_loops,
        unsafe_function_depth: 0,
        with_depth: 0,
        analysis: ExtendedAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct DefaultCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    analysis: DefaultAnalysis,
}

impl DefaultCollector<'_> {
    fn unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0
    }

    fn target(
        &mut self,
        span: Span,
        left: &BindingPattern<'_>,
        right: &Expression<'_>,
    ) -> DefaultTarget {
        let id = stable_id(self.source, self.file, "default-value", span, "");
        let default_id = format!("{id}:default");
        let provided_id = format!("{id}:provided");
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "default-value".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, span).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: default_id.clone(),
                    label: "default evaluated".to_string(),
                },
                CandidateBranchAlternative {
                    id: provided_id.clone(),
                    label: "value provided".to_string(),
                },
            ],
        });
        DefaultTarget {
            default_id,
            provided_id,
            inferred_name: binding_identifier_name(left)
                .filter(|_| expression_is_anonymous_definition(right)),
        }
    }

    fn collect_binding_pattern(&mut self, pattern: &BindingPattern<'_>, parameter: bool) {
        match pattern {
            BindingPattern::AssignmentPattern(assignment) => {
                let target = self.target(assignment.span, &assignment.left, &assignment.right);
                if parameter {
                    self.analysis
                        .parameter_targets
                        .insert(span_key(assignment.span), target);
                } else {
                    self.analysis
                        .binding_targets
                        .insert(span_key(assignment.span), target);
                }
                self.collect_binding_pattern(&assignment.left, parameter);
            }
            BindingPattern::ObjectPattern(object) => {
                for property in &object.properties {
                    self.collect_binding_pattern(&property.value, parameter);
                }
                if let Some(rest) = &object.rest {
                    self.collect_binding_pattern(&rest.argument, parameter);
                }
            }
            BindingPattern::ArrayPattern(array) => {
                for element in array.elements.iter().flatten() {
                    self.collect_binding_pattern(element, parameter);
                }
                if let Some(rest) = &array.rest {
                    self.collect_binding_pattern(&rest.argument, parameter);
                }
            }
            BindingPattern::BindingIdentifier(_) => {}
        }
    }

    fn collect_parameters(&mut self, parameters: &FormalParameters<'_>) {
        for parameter in &parameters.items {
            if let Some(initializer) = &parameter.initializer {
                // Babel models a formal-parameter default as an AssignmentPattern whose
                // source range starts at the binding and ends at the initializer. oxc
                // keeps the initializer beside the BindingPattern and, for a TypeScript
                // parameter property, includes access/readonly modifiers in
                // FormalParameter::span. Keep the outer span as the transformation key,
                // but publish the same semantic default-expression range as Babel.
                let default_span =
                    Span::new(parameter.pattern.span().start, initializer.span().end);
                let target = self.target(default_span, &parameter.pattern, initializer);
                self.analysis
                    .parameter_targets
                    .insert(span_key(parameter.span), target);
            }
            self.collect_binding_pattern(&parameter.pattern, true);
        }
        if let Some(rest) = &parameters.rest {
            self.collect_binding_pattern(&rest.rest.argument, true);
        }
    }

    fn has_binding_default(pattern: &BindingPattern<'_>) -> bool {
        match pattern {
            BindingPattern::AssignmentPattern(_) => true,
            BindingPattern::ObjectPattern(object) => {
                object
                    .properties
                    .iter()
                    .any(|property| Self::has_binding_default(&property.value))
                    || object
                        .rest
                        .as_ref()
                        .is_some_and(|rest| Self::has_binding_default(&rest.argument))
            }
            BindingPattern::ArrayPattern(array) => {
                array
                    .elements
                    .iter()
                    .flatten()
                    .any(Self::has_binding_default)
                    || array
                        .rest
                        .as_ref()
                        .is_some_and(|rest| Self::has_binding_default(&rest.argument))
            }
            BindingPattern::BindingIdentifier(_) => false,
        }
    }

    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for DefaultCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
            return;
        }
        if !self.unsafe_context() && node.body.is_some() {
            self.collect_parameters(&node.params);
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
            return;
        }
        if !self.unsafe_context() {
            self.collect_parameters(&node.params);
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_variable_declaration(
        &mut self,
        node: &mut VariableDeclaration<'a>,
        context: &mut TraverseCtx<'a, ()>,
    ) {
        if self.unsafe_context() {
            return;
        }
        let has_default = node
            .declarations
            .iter()
            .any(|declaration| Self::has_binding_default(&declaration.id));
        if !has_default {
            return;
        }
        if matches!(
            context.ancestors().next(),
            Some(Ancestor::ForStatementInit(_))
        ) {
            let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
            self.analysis.limitations.push(CandidateLimitation {
                id: stable_id(
                    self.source,
                    self.file,
                    "dynamic-code",
                    node.span,
                    "for-init-default",
                ),
                kind: "dynamic-code".to_string(),
                file: self.file.to_string(),
                line,
                column,
                source: source_slice(self.source, node.span).to_string(),
                reason: "destructuring defaults in a classic for initializer cannot yet be finalized without restructuring control flow".to_string(),
            });
            return;
        }
        for declaration in &node.declarations {
            self.collect_binding_pattern(&declaration.id, false);
        }
    }
}

fn collect_default_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> DefaultAnalysis {
    let mut collector = DefaultCollector {
        source,
        file,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        analysis: DefaultAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct OptionalCallCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    chain_roots: Vec<SpanKey>,
    analysis: OptionalCallAnalysis,
}

impl OptionalCallCollector<'_> {
    fn unsafe_context(&self) -> bool {
        self.unsafe_function_depth > 0 || self.with_depth > 0
    }

    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for OptionalCallCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_chain_expression(
        &mut self,
        node: &mut ChainExpression<'a>,
        context: &mut TraverseCtx<'a, ()>,
    ) {
        let root = match context.ancestors().next() {
            Some(Ancestor::UnaryExpressionArgument(parent))
                if *parent.operator() == UnaryOperator::Delete =>
            {
                span_key(*parent.span())
            }
            _ => span_key(node.span),
        };
        self.chain_roots.push(root);
    }

    fn exit_chain_expression(
        &mut self,
        _node: &mut ChainExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.chain_roots.pop();
    }

    fn enter_call_expression(
        &mut self,
        node: &mut CallExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if !node.optional || self.unsafe_context() {
            return;
        }
        let root = *self
            .chain_roots
            .last()
            .expect("an optional call must be enclosed by a chain expression");
        let id = stable_id(self.source, self.file, "optional-chain", node.span, "call");
        let short_id = format!("{id}:short");
        let continued_id = format!("{id}:continued");
        let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
        self.analysis.sites.insert(
            span_key(node.span),
            (short_id.clone(), continued_id.clone()),
        );
        self.analysis
            .roots
            .entry(root)
            .or_default()
            .push(span_key(node.span));
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "optional-chain".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, node.span).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: short_id,
                    label: "nullish / short-circuited".to_string(),
                },
                CandidateBranchAlternative {
                    id: continued_id,
                    label: "non-nullish / continued".to_string(),
                },
            ],
        });
    }
}

fn collect_optional_call_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> OptionalCallAnalysis {
    let mut collector = OptionalCallCollector {
        source,
        file,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        chain_roots: Vec::new(),
        analysis: OptionalCallAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct OptionalMemberCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    analysis: OptionalMemberAnalysis,
}

impl OptionalMemberCollector<'_> {
    fn record(&mut self, span: Span, optional: bool) {
        if !optional || self.unsafe_function_depth > 0 || self.with_depth > 0 {
            return;
        }
        let id = stable_id(self.source, self.file, "optional-chain", span, "");
        let short_id = format!("{id}:short");
        let continued_id = format!("{id}:continued");
        let (line, column) = line_and_utf16_column(self.source, span.start as usize);
        self.analysis
            .targets
            .insert(span_key(span), (short_id.clone(), continued_id.clone()));
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "optional-chain".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, span).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: short_id,
                    label: "nullish / short-circuited".to_string(),
                },
                CandidateBranchAlternative {
                    id: continued_id,
                    label: "non-nullish / continued".to_string(),
                },
            ],
        });
    }

    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for OptionalMemberCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn enter_computed_member_expression(
        &mut self,
        node: &mut ComputedMemberExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.record(node.span, node.optional);
    }

    fn enter_static_member_expression(
        &mut self,
        node: &mut StaticMemberExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.record(node.span, node.optional);
    }

    fn enter_private_field_expression(
        &mut self,
        node: &mut PrivateFieldExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.record(node.span, node.optional);
    }
}

fn collect_optional_member_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> OptionalMemberAnalysis {
    let mut collector = OptionalMemberCollector {
        source,
        file,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        analysis: OptionalMemberAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct LogicalAssignmentCollector<'s> {
    source: &'s str,
    file: &'s str,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    analysis: LogicalAssignmentAnalysis,
}

impl LogicalAssignmentCollector<'_> {
    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for LogicalAssignmentCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn exit_assignment_expression(
        &mut self,
        node: &mut AssignmentExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self.unsafe_function_depth > 0 || self.with_depth > 0 || !node.operator.is_logical() {
            return;
        }
        let operator = match node.operator {
            AssignmentOperator::LogicalAnd => "&&=",
            AssignmentOperator::LogicalOr => "||=",
            AssignmentOperator::LogicalNullish => "??=",
            _ => unreachable!("logical assignment filter must be exhaustive"),
        };
        let id = stable_id(
            self.source,
            self.file,
            "logical-assignment",
            node.span,
            operator,
        );
        let short_id = format!("{id}:short");
        let right_id = format!("{id}:right");
        let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
        self.analysis
            .targets
            .insert(span_key(node.span), (short_id.clone(), right_id.clone()));
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "logical-assignment".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, node.span).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: short_id,
                    label: "assignment skipped".to_string(),
                },
                CandidateBranchAlternative {
                    id: right_id,
                    label: "right evaluated / assigned".to_string(),
                },
            ],
        });
    }
}

fn collect_logical_assignment_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> LogicalAssignmentAnalysis {
    let mut collector = LogicalAssignmentCollector {
        source,
        file,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        analysis: LogicalAssignmentAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

struct LogicalBranchCollector<'s> {
    source: &'s str,
    file: &'s str,
    decision_logical_nodes: &'s HashSet<SpanKey>,
    source_sensitive_functions: &'s HashSet<SpanKey>,
    unsafe_function_depth: usize,
    with_depth: usize,
    analysis: LogicalBranchAnalysis,
}

impl LogicalBranchCollector<'_> {
    fn exit_source_function(&mut self, span: Span) {
        if self.source_sensitive_functions.contains(&span_key(span)) {
            self.unsafe_function_depth -= 1;
        }
    }
}

impl<'a> Traverse<'a, ()> for LogicalBranchCollector<'_> {
    fn enter_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, _context: &mut TraverseCtx<'a, ()>) {
        self.exit_source_function(node.span);
    }

    fn enter_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self
            .source_sensitive_functions
            .contains(&span_key(node.span))
        {
            self.unsafe_function_depth += 1;
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        node: &mut ArrowFunctionExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.exit_source_function(node.span);
    }

    fn enter_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth += 1;
    }

    fn exit_with_statement(
        &mut self,
        _node: &mut WithStatement<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        self.with_depth -= 1;
    }

    fn exit_logical_expression(
        &mut self,
        node: &mut LogicalExpression<'a>,
        _context: &mut TraverseCtx<'a, ()>,
    ) {
        if self.unsafe_function_depth > 0
            || self.with_depth > 0
            || self.decision_logical_nodes.contains(&span_key(node.span))
        {
            return;
        }
        let operator = match node.operator {
            LogicalOperator::And => "&&",
            LogicalOperator::Or => "||",
            LogicalOperator::Coalesce => "??",
        };
        let id = stable_id(self.source, self.file, "logical-value", node.span, operator);
        let short_id = format!("{id}:short");
        let right_id = format!("{id}:right");
        let (line, column) = line_and_utf16_column(self.source, node.span.start as usize);
        self.analysis
            .logical_targets
            .insert(span_key(node.span), (short_id.clone(), right_id.clone()));
        self.analysis.branches.push(CandidateBranch {
            id,
            kind: "logical-value".to_string(),
            file: self.file.to_string(),
            line,
            column,
            source: source_slice(self.source, node.span).to_string(),
            alternatives: vec![
                CandidateBranchAlternative {
                    id: short_id,
                    label: "short-circuit / left selected".to_string(),
                },
                CandidateBranchAlternative {
                    id: right_id,
                    label: "right evaluated / selected".to_string(),
                },
            ],
        });
    }
}

fn collect_logical_value_branches<'a>(
    allocator: &'a Allocator,
    program: &mut Program<'a>,
    source: &str,
    file: &str,
    decision_logical_nodes: &HashSet<SpanKey>,
    source_sensitive_functions: &HashSet<SpanKey>,
) -> LogicalBranchAnalysis {
    let mut collector = LogicalBranchCollector {
        source,
        file,
        decision_logical_nodes,
        source_sensitive_functions,
        unsafe_function_depth: 0,
        with_depth: 0,
        analysis: LogicalBranchAnalysis::default(),
    };
    traverse_mut(&mut collector, allocator, program, Default::default(), ());
    collector.analysis
}

impl<'a> Visit<'a> for DecisionCollector<'_> {
    fn visit_function(&mut self, function: &Function<'a>, flags: ScopeFlags) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk::walk_function(self, function, flags);
    }

    fn visit_arrow_function_expression(&mut self, function: &ArrowFunctionExpression<'a>) {
        if self
            .source_sensitive_functions
            .contains(&span_key(function.span))
        {
            return;
        }
        walk::walk_arrow_function_expression(self, function);
    }

    fn visit_with_statement(&mut self, statement: &WithStatement<'a>) {
        if self.with_statements.contains(&span_key(statement.span)) {
            return;
        }
        walk::walk_with_statement(self, statement);
    }

    fn visit_if_statement(&mut self, statement: &IfStatement<'a>) {
        if decision_outcome_is_variable(&statement.test) {
            self.record_decision(&statement.test, "if");
        }
        self.visit_expression(&statement.test);
        self.visit_statement(&statement.consequent);
        if let Some(alternate) = &statement.alternate {
            self.visit_statement(alternate);
        }
    }

    fn visit_conditional_expression(&mut self, expression: &ConditionalExpression<'a>) {
        if decision_outcome_is_variable(&expression.test) {
            self.record_decision(&expression.test, "ternary");
        }
        self.visit_expression(&expression.test);
        self.visit_expression(&expression.consequent);
        self.visit_expression(&expression.alternate);
    }

    fn visit_while_statement(&mut self, statement: &WhileStatement<'a>) {
        if decision_outcome_is_variable(&statement.test) {
            self.record_decision(&statement.test, "while");
        }
        self.visit_expression(&statement.test);
        self.visit_statement(&statement.body);
    }

    fn visit_do_while_statement(&mut self, statement: &DoWhileStatement<'a>) {
        if decision_outcome_is_variable(&statement.test) {
            self.record_decision(&statement.test, "do-while");
        }
        self.visit_statement(&statement.body);
        self.visit_expression(&statement.test);
    }

    fn visit_for_statement(&mut self, statement: &ForStatement<'a>) {
        if let Some(test) = &statement.test
            && decision_outcome_is_variable(test)
        {
            self.record_decision(test, "for");
        }
        if let Some(init) = &statement.init {
            self.visit_for_statement_init(init);
        }
        if let Some(test) = &statement.test {
            self.visit_expression(test);
        }
        if let Some(update) = &statement.update {
            self.visit_expression(update);
        }
        self.visit_statement(&statement.body);
    }
}

fn transparent_expression<'a>(expression: &'a Expression<'a>) -> &'a Expression<'a> {
    match expression {
        Expression::ParenthesizedExpression(parenthesized) => {
            transparent_expression(&parenthesized.expression)
        }
        _ => expression,
    }
}

fn has_compound_boolean_decision(expression: &Expression<'_>) -> bool {
    match expression {
        Expression::ParenthesizedExpression(parenthesized) => {
            has_compound_boolean_decision(&parenthesized.expression)
        }
        Expression::LogicalExpression(logical) => {
            matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or)
        }
        Expression::UnaryExpression(unary) if unary.operator.is_not() => {
            has_compound_boolean_decision(&unary.argument)
        }
        _ => false,
    }
}

fn collect_conditions(expression: &Expression<'_>, conditions: &mut Vec<Span>) {
    match expression {
        Expression::ParenthesizedExpression(parenthesized) => {
            collect_conditions(&parenthesized.expression, conditions);
        }
        Expression::LogicalExpression(logical)
            if matches!(logical.operator, LogicalOperator::And | LogicalOperator::Or) =>
        {
            collect_conditions(&logical.left, conditions);
            collect_conditions(&logical.right, conditions);
        }
        Expression::UnaryExpression(unary)
            if unary.operator.is_not() && has_compound_boolean_decision(&unary.argument) =>
        {
            collect_conditions(&unary.argument, conditions);
        }
        _ => conditions.push(expression.span()),
    }
}

fn source_slice(source: &str, span: Span) -> &str {
    &source[span.start as usize..span.end as usize]
}

/// Where every line of one source starts, in bytes and in UTF-16 units, so a
/// position is a binary search rather than a scan from the top of the file.
///
/// Every probe, decision and branch records its line, column and a UTF-16
/// offset, and each was counted from the first byte of the file: the work
/// grew with the square of the file's length. An 8,000-line file took 97
/// seconds to instrument on a debug build, a 24,000-line one did not finish
/// in ten minutes, and Actual's setup spent minutes before its first test.
struct SourcePositions {
    address: usize,
    length: usize,
    sample: u64,
    line_starts: Vec<usize>,
    utf16_before_line: Vec<usize>,
    /// Per line: `None` when ASCII, otherwise `(byte offset, utf16 column)`
    /// checkpoints from the line's start, so a long line that is not ASCII
    /// -- a table of currency symbols, say -- is not walked per position.
    checkpoints: Vec<Option<Vec<(usize, usize)>>>,
}

impl SourcePositions {
    fn sample(source: &str) -> u64 {
        let bytes = source.as_bytes();
        let head = &bytes[..bytes.len().min(64)];
        let tail = &bytes[bytes.len().saturating_sub(64)..];
        head.iter()
            .chain(tail)
            .fold(0xcbf2_9ce4_8422_2325u64, |hash, byte| {
                (hash ^ u64::from(*byte)).wrapping_mul(0x0100_0000_01b3)
            })
    }

    fn new(source: &str) -> Self {
        let mut line_starts = vec![0];
        let mut utf16_before_line = vec![0];
        let mut checkpoints = Vec::new();
        let mut marks: Option<Vec<(usize, usize)>> = None;
        let mut utf16 = 0;
        let mut column = 0;
        let mut line_start = 0;
        for (index, character) in source.char_indices() {
            if !character.is_ascii() && marks.is_none() {
                marks = Some(vec![(0, 0)]);
            }
            if let Some(marks) = &mut marks
                && column >= marks.last().expect("a first mark").1 + CHECKPOINT
            {
                marks.push((index - line_start, column));
            }
            utf16 += character.len_utf16();
            column += character.len_utf16();
            if character == '\n' {
                line_start = index + 1;
                line_starts.push(line_start);
                utf16_before_line.push(utf16);
                checkpoints.push(marks.take());
                column = 0;
            }
        }
        checkpoints.push(marks);
        Self {
            address: source.as_ptr() as usize,
            length: source.len(),
            sample: Self::sample(source),
            line_starts,
            utf16_before_line,
            checkpoints,
        }
    }

    fn describes(&self, source: &str) -> bool {
        self.address == source.as_ptr() as usize
            && self.length == source.len()
            && self.sample == Self::sample(source)
    }

    /// Zero-based line, and the UTF-16 units from that line's start.
    fn locate(&self, source: &str, offset: usize) -> (usize, usize) {
        let line = self.line_starts.partition_point(|start| *start <= offset) - 1;
        let start = self.line_starts[line];
        let column = match &self.checkpoints[line] {
            None => offset - start,
            Some(marks) => {
                let at = marks.partition_point(|(byte, _)| *byte <= offset - start) - 1;
                let (byte, column) = marks[at];
                column + source[start + byte..offset].encode_utf16().count()
            }
        };
        (line, column)
    }
}

thread_local! {
    static POSITIONS: std::cell::RefCell<Option<Vec<std::rc::Rc<SourcePositions>>>> =
        const { std::cell::RefCell::new(None) };
}

/// While one of these is alive, positions in any source are computed from an
/// index built once for it. It lives for one instrumentation call, during
/// which the source it indexes is borrowed and cannot move; outside one,
/// positions are counted from the top as before.
pub(crate) struct PositionScope {
    owner: bool,
}

impl PositionScope {
    pub(crate) fn enter() -> Self {
        let owner = POSITIONS.with(|positions| {
            let mut positions = positions.borrow_mut();
            let owner = positions.is_none();
            if owner {
                *positions = Some(Vec::new());
            }
            owner
        });
        Self { owner }
    }
}

impl Drop for PositionScope {
    fn drop(&mut self) {
        if self.owner {
            POSITIONS.with(|positions| *positions.borrow_mut() = None);
        }
    }
}

fn indexed(source: &str) -> Option<std::rc::Rc<SourcePositions>> {
    POSITIONS.with(|positions| {
        let mut positions = positions.borrow_mut();
        let known = positions.as_mut()?;
        if let Some(found) = known.iter().find(|index| index.describes(source)) {
            return Some(found.clone());
        }
        let built = std::rc::Rc::new(SourcePositions::new(source));
        known.push(built.clone());
        Some(built)
    })
}

fn utf16_offset(source: &str, offset: usize) -> usize {
    match indexed(source) {
        Some(index) => {
            let (line, column) = index.locate(source, offset);
            index.utf16_before_line[line] + column
        }
        None => source[..offset].encode_utf16().count(),
    }
}

pub(crate) fn line_and_utf16_column(source: &str, offset: usize) -> (usize, usize) {
    if let Some(index) = indexed(source) {
        let (line, column) = index.locate(source, offset);
        return (line + 1, column + 1);
    }
    let prefix = &source[..offset];
    let line_start = prefix.rfind('\n').map_or(0, |index| index + 1);
    let line = prefix.bytes().filter(|byte| *byte == b'\n').count() + 1;
    let column = source[line_start..offset].encode_utf16().count() + 1;
    (line, column)
}

fn stable_id(source: &str, file: &str, kind: &str, span: Span, suffix: &str) -> String {
    let start = utf16_offset(source, span.start as usize);
    let end = utf16_offset(source, span.end as usize);
    let digest = Sha256::digest(format!("{file}:{kind}:{start}:{end}:{suffix}").as_bytes());
    let mut id = String::with_capacity(16);
    for byte in &digest[..8] {
        write!(&mut id, "{byte:02x}").expect("writing to a String cannot fail");
    }
    id
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn line_index_lookups_agree_with_walking_the_line() {
        let long = "é🚀x".repeat(700);
        let source = format!("const a = 1;\nconst s = '{long}';\n\nplain ascii line\n{long}");
        let index = Utf16LineIndex::new(&source);
        for (line, text) in source.split_inclusive('\n').enumerate() {
            let start = index.starts[line];
            let width: usize = text.chars().map(char::len_utf16).sum();
            for column in 0..=width + 2 {
                assert_eq!(
                    index.byte_offset(line, column),
                    start + utf16_col_to_byte(text, column),
                    "line {line} column {column}"
                );
            }
            for (offset, _) in text.char_indices() {
                let walked: usize = text[..offset].chars().map(char::len_utf16).sum();
                assert_eq!(index.line_col(start + offset), (line as u32, walked as u32));
            }
        }
    }

    #[test]
    fn indexed_positions_agree_with_counting_from_the_top() {
        // The long line passes several checkpoints.
        let source = &format!(
            "const s = 'naïve 🚀';\n\nexport function f(a) {{\n  return a ? 'é' : s;\n}}\n// 日本\nconst t = '{}';\nx",
            "é🚀x".repeat(400)
        );
        let source = source.as_str();
        let counted: Vec<_> = source
            .char_indices()
            .map(|(offset, _)| {
                (
                    line_and_utf16_column(source, offset),
                    stable_id(source, "f.js", "k", Span::new(0, offset as u32), ""),
                )
            })
            .collect();
        let _positions = PositionScope::enter();
        for ((offset, _), (position, id)) in source.char_indices().zip(counted) {
            assert_eq!(
                line_and_utf16_column(source, offset),
                position,
                "offset {offset}"
            );
            assert_eq!(
                stable_id(source, "f.js", "k", Span::new(0, offset as u32), ""),
                id
            );
        }
    }

    #[test]
    fn classic_scripts_share_application_globals_but_not_probe_bindings() {
        // TodoMVC's ES5 app loads several classic scripts into one document.
        // They share the global lexical scope, so a second
        // `const __supercovMcdcBegin` was a SyntaxError and no item was added.
        let a = instrument_direct_candidate(
            "var count = 0; function increment() { if (count >= 0) { count += 1; } }",
            "public/a.js",
        )
        .unwrap();
        let b = instrument_direct_candidate("increment(); var observed = count;", "public/b.js")
            .unwrap();
        let runtime = include_str!("../runtime-assets/javascript/runtime.mjs");
        let runtime = &runtime[..runtime.rfind("\nexport {").unwrap()];
        let script = format!(
            "const vm = require('node:vm'); const ctx = vm.createContext({{ setTimeout, clearTimeout, queueMicrotask, console }});\
             vm.runInContext({}, ctx); vm.runInContext({}, ctx); vm.runInContext({}, ctx);\
             if (ctx.observed !== 1) throw Error('shared globals changed');\
             vm.runInContext({}, ctx);\
             if (ctx.observed !== 2) throw Error('a repeated script changed');",
            serde_json::to_string(runtime).unwrap(),
            serde_json::to_string(&a.code).unwrap(),
            serde_json::to_string(&b.code).unwrap(),
            serde_json::to_string(&b.code).unwrap()
        );
        // Through stdin: the script carries the whole runtime, longer than a
        // Windows command line may be.
        let mut node = std::process::Command::new("node")
            .arg("-")
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .expect("Node.js for the JavaScript regression");
        std::io::Write::write_all(&mut node.stdin.take().unwrap(), script.as_bytes()).unwrap();
        let result = node.wait_with_output().unwrap();
        assert!(
            result.status.success(),
            "{}",
            String::from_utf8_lossy(&result.stderr)
        );
    }

    #[test]
    fn javascript_with_jsx_is_measured_in_every_javascript_extension() {
        // TodoMVC's React app keeps JSX in `src/index.js`; the run failed on
        // `Unexpected token` before any test started.
        for file in [
            "src/index.js",
            "src/index.jsx",
            "src/index.mjs",
            "src/index.cjs",
            "src/index.tsx",
        ] {
            let source = "export const View = ({ok}) => <div>{ok ? 'yes' : 'no'}</div>;";
            let output = instrument_candidate(source, file).unwrap();
            assert!(!output.points.is_empty(), "{file}");
            assert!(output.code.contains("<div>"), "{file}");
            assert!(assertion_ranges(file, source).is_ok(), "{file}");
        }
        // TypeScript keeps its angle-bracket assertion; JSX would misread it.
        assert!(instrument_candidate("const n = <number>value;", "src/index.ts").is_ok());
        // The script or module mode an extension implies is kept.
        for file in ["a.js", "a.cjs", "a.mjs"] {
            let before = SourceType::from_path(file).unwrap();
            let after = project_source_type(Path::new(file)).unwrap();
            assert_eq!(after.module_kind(), before.module_kind(), "{file}");
            assert!(after.is_jsx(), "{file}");
        }
    }

    const SOURCE: &str =
        "export function decide(a,b,c) {\n  if ((a && b) || !c) return 1;\n  return 0;\n}\n";

    #[test]
    fn matches_the_frozen_if_decision_manifest_exactly() {
        let output = analyze_candidate(SOURCE, "app/decide.ts").unwrap();
        assert!(!output.complete);
        assert_eq!(
            output.decisions,
            vec![CandidateDecision {
                id: "2f65989a5782c5bd".to_string(),
                file: "app/decide.ts".to_string(),
                line: 2,
                column: 7,
                source: "(a && b) || !c".to_string(),
                conditions: vec!["a".to_string(), "b".to_string(), "!c".to_string()],
                kind: "if".to_string(),
            }]
        );
    }

    #[test]
    fn codegen_output_reparses_for_typescript_and_tsx() {
        for (file, source) in [
            (
                "component.tsx",
                "export const View = ({ok}: {ok: boolean}) => <div>{ok ? 'yes' : 'no'}</div>;",
            ),
            ("module.ts", SOURCE),
        ] {
            let output = analyze_candidate(source, file).unwrap();
            let map = output.map.as_ref().expect("candidate source map");
            assert_eq!(map["version"], 3);
            assert_eq!(map["sources"][0], file);
            assert_eq!(map["sourcesContent"][0], source);
            assert!(
                map["mappings"]
                    .as_str()
                    .is_some_and(|value| !value.is_empty())
            );
            let allocator = Allocator::default();
            let source_type = SourceType::from_path(file).unwrap();
            let reparsed = Parser::new(&allocator, &output.code, source_type).parse();
            assert!(reparsed.errors.is_empty(), "{file}: {:?}", reparsed.errors);
        }
    }

    #[test]
    fn direct_runtime_mode_has_no_virtual_module_or_legacy_global() {
        for file in ["src/module.mjs", "src/script.cjs"] {
            let output = instrument_direct_candidate(
                "export const selected = value => value ? 1 : 0;",
                file,
            )
            .unwrap();
            assert!(
                output
                    .code
                    .contains("globalThis.__SUPERCOV_DIRECT_RUNTIME__")
            );
            assert!(!output.code.contains("virtual:supercov-runtime"));
            assert!(!output.code.contains("globalThis.__supercovRuntime"));
        }
    }

    #[test]
    fn capability_imports_are_rewritten_ahead_of_run_by_rust() {
        let source = concat!(
            "import { ImageBuilder, ordinaryHelper } from './sdk.mjs';\n",
            "await ImageBuilder.build({ mounts: [{ source: process.cwd(), target: '/workspace' }], snapshotKey: 'base' });\n",
            "ordinaryHelper();\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/runner.mjs",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.assertions, 0);
        assert_eq!(output.capability_imports, 1);
        assert!(output.code.contains("wrapImportedCapability"));
        assert!(output.code.contains("__supercovRawImageBuilder"));
        assert!(output.code.contains("const ImageBuilder"));
        assert!(!output.code.contains("__supercovRawordinaryHelper"));
        assert!(output.code.contains("../.supercov/launchSupervisor.mjs"));
    }

    #[test]
    fn capability_imports_accept_a_computed_guest_mount_path() {
        let source = concat!(
            "import { OpaqueImageBuilder, ordinaryHelper } from './sdk.mjs';\n",
            "const guestRoot = resolve(tmpdir(), 'workspace');\n",
            "await OpaqueImageBuilder.build({ mounts: [{ source: process.cwd(), target: guestRoot }], snapshotTag: 'base' });\n",
            "ordinaryHelper();\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/runner.mjs",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.capability_imports, 1);
        assert!(output.code.contains("__supercovRawOpaqueImageBuilder"));
        assert!(!output.code.contains("__supercovRawordinaryHelper"));
    }

    #[test]
    fn capability_import_selection_follows_a_mapping_variable() {
        let source = concat!(
            "import { launch, unrelated } from './sdk.mjs';\n",
            "run();\n",
            "const options = { hostPath: process.cwd(), guestPath: '/workspace' };\n",
            "function run() { launch(options); unrelated(); }\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/runner.mjs",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.capability_imports, 1);
        assert!(output.code.contains("__supercovRawlaunch"));
        assert!(!output.code.contains("__supercovRawunrelated"));
    }

    #[test]
    fn ordinary_imports_remain_byte_identical_without_a_capability_shape() {
        let source = "import { format } from './format.mjs';\nconsole.log(format('value'));";
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "src/main.mjs",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.code, source);
        assert_eq!(output.capability_imports, 0);
    }

    #[test]
    fn ordinary_mount_language_does_not_enable_capability_proxies() {
        let source = concat!(
            "import { render } from '@testing-library/react';\n",
            "it('mounts into a host element', () => render(<main />));\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/component.test.tsx",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.capability_imports, 0);
        assert!(!output.code.contains("wrapImportedCapability"));
    }

    #[test]
    fn test_snapshot_apis_are_not_mistaken_for_remote_workspace_capabilities() {
        let source = concat!(
            "import { test, expect } from '@example/test-admin';\n",
            "test('visual snapshot', async ({ page }) => {\n",
            "  expect(await page.screenshot()).toMatchSnapshot('screen.png');\n",
            "});\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/visual.spec.ts",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.capability_imports, 0);
        assert!(!output.code.contains("wrapImportedCapability"));
    }

    #[test]
    fn capability_rewrite_excludes_runtime_and_type_only_imports() {
        let source = concat!(
            "import type { Machine } from './types.ts';\n",
            "import { test } from 'node:test';\n",
            "import { runtime } from '../.supercov/runtime.mjs';\n",
            "console.log({ machine: true, test, runtime });\n",
        );
        let output = instrument_node_assertion_phases_with_runtime_hooks(
            source,
            "tests/runner.ts",
            &[],
            Some("../.supercov/launchSupervisor.mjs"),
        )
        .unwrap();
        assert_eq!(output.code, source);
        assert_eq!(output.capability_imports, 0);
    }

    #[test]
    fn native_assertion_arguments_execute_inside_the_assertion_phase() {
        let source = concat!(
            "import assert from 'node:assert/strict';\n",
            "assert.equal(value(), 1);\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("withNodeAssertionPhase"));
        assert!(output.code.contains("node:assert/strict.equal"));
        assert!(output.code.contains("tests/value.test.mjs:2:1"));
        assert!(output.code.contains("assert.equal(value(), 1)"));
    }

    #[test]
    fn esm_assertion_transform_carries_its_runtime_across_opaque_launches() {
        let source = "import assert from 'node:assert';\nassert.equal(value(), 1);\n";
        let output = instrument_node_assertion_phases_with_runtime_imports(
            source,
            "tests/value.test.mjs",
            &[],
            None,
            Some("../.supercov/runtime.mjs"),
        )
        .unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("withNodeAssertionPhase"));
        assert!(output.code.contains("import \"../.supercov/runtime.mjs\";"));
    }

    #[test]
    fn native_assertion_phase_never_moves_await_into_a_sync_callback() {
        let source = concat!(
            "import assert from 'node:assert/strict';\n",
            "export async function check() { assert.equal(await value(), 1); }\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("bindNodeAssertionPhase"));
        assert!(output.code.contains("await value()"));
        let allocator = Allocator::default();
        assert!(
            Parser::new(&allocator, &output.code, SourceType::mjs())
                .parse()
                .errors
                .is_empty()
        );
    }

    #[test]
    fn matcher_assertion_phase_never_moves_receiver_await_into_a_sync_callback() {
        let source = concat!(
            "import { expect, test } from '@playwright/test';\n",
            "test('value', async () => { expect(await value()).toBe(1); });\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.spec.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("bindNodeAssertionPhase"));
        assert!(output.code.contains("await value()"));
        let allocator = Allocator::default();
        assert!(
            Parser::new(&allocator, &output.code, SourceType::mjs())
                .parse()
                .errors
                .is_empty()
        );
    }

    #[test]
    fn native_commonjs_assertion_bindings_are_attributed() {
        let source = concat!(
            "const assert = require('node:assert/strict');\n",
            "const { ok: verify } = require('assert');\n",
            "assert.equal(value(), 1);\n",
            "verify(other());\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.cjs").unwrap();
        assert_eq!(output.assertions, 2);
        assert!(output.code.contains("node:assert/strict.equal"));
        assert!(output.code.contains("node:assert.ok"));
    }

    #[test]
    fn nested_commonjs_bindings_are_supported_but_shadowed_require_is_not() {
        let source = concat!(
            "function checked() { const assert = require('node:assert'); assert.ok(value()); }\n",
            "function unrelated(require) { const assert = require('node:assert'); assert.ok(other()); }\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.cjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert_eq!(output.code.matches("withNodeAssertionPhase").count(), 1);
    }

    #[test]
    fn assertion_bindings_are_lexical_and_never_wrap_shadowed_values() {
        let source = concat!(
            "import assert from 'node:assert/strict';\n",
            "function unrelated(assert) { assert.equal(effect(), 1); }\n",
            "assert.equal(value(), 1);\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert_eq!(output.code.matches("withNodeAssertionPhase").count(), 1);
    }

    #[test]
    fn node_test_expect_matchers_are_attributed_through_lexical_imports() {
        let source = concat!(
            "import test from 'node:test';\n",
            "import { expect as verify } from 'expect-library';\n",
            "test('value', () => verify(value()).not.toEqual(1));\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("expect.not.toEqual"));
        assert!(output.code.contains("verify(value()).not.toEqual(1)"));
    }

    #[test]
    fn vitest_expect_matchers_are_attributed_by_the_static_frontend() {
        let source = concat!(
            "import { expect, test } from 'vitest';\n",
            "test('value', () => expect(value()).toBe(1));\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.test.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("expect.toBe"));
    }

    #[test]
    fn browser_mode_expect_wrappers_are_attributed_like_a_bare_expect() {
        // Vitest Browser Mode asserts through `expect.element(locator)`, and
        // `expect.soft`/`expect.poll` wrap the same way. The chain root is a
        // member call rather than a bare `expect` identifier, which is the
        // shape that used to leave every UI assertion unrecognised.
        for (call, operation) in [
            (
                "expect.element(button).toHaveAccessibleName('Copy')",
                "expect.element.toHaveAccessibleName",
            ),
            ("expect.soft(value()).toBe(1)", "expect.soft.toBe"),
            ("expect.poll(() => value()).toBe(1)", "expect.poll.toBe"),
        ] {
            let source = format!(
                "import {{ expect, test }} from 'vitest';\ntest('value', async () => await {call});\n"
            );
            let output = instrument_node_assertion_phases(&source, "tests/value.test.mjs").unwrap();
            assert_eq!(output.assertions, 1, "{call}");
            assert!(output.code.contains(operation), "{call} -> {operation}");
        }
    }

    #[test]
    fn a_rendered_jsx_expression_is_measured_apart_from_the_tree_that_holds_it() {
        // A JSX tree is one statement, so an attribute and a child that call
        // the same function had no way to be told apart -- which is exactly
        // what a UI assertion needs, `toHaveAccessibleName` naming the
        // attribute and `toHaveTextContent` the child.
        let source = concat!(
            "export function Button({ label, copied }) {\n",
            "  return (\n",
            "    <button aria-label={format(copied)} title={label} onClick={() => tap()}>\n",
            "      {format(copied)}\n",
            "    </button>\n",
            "  );\n",
            "}\n",
        );
        let output = instrument_candidate(source, "src/button.tsx").unwrap();
        let rendered = output
            .points
            .iter()
            .filter(|point| point.label.as_deref() == Some("jsx-rendered-expression"))
            .collect::<Vec<_>>();
        // The attribute and the child are separate obligations at separate
        // positions, even though they read identically.
        assert_eq!(rendered.len(), 2, "{:?}", output.points);
        assert!(
            rendered
                .iter()
                .all(|point| point.source == "format(copied)")
        );
        assert_eq!(rendered[0].line, 3);
        assert_eq!(rendered[1].line, 4);
        assert!(rendered[0].column != rendered[1].column || rendered[0].line != rendered[1].line);
        // `{label}` is reached exactly when the tree is, and the handler is
        // measured where it is called; neither earns an obligation.
        assert!(!output.code.contains("title={__supercovRenderedValueV2"));
        // JSX forbids a bare comma operator, so the probe has to carry the
        // value through a call rather than a sequence expression.
        assert!(!output.code.contains("), format(copied)}"));
        assert!(output.code.contains(", format(copied))}"));
    }

    #[test]
    fn instrumented_jsx_stays_parseable_through_every_container_shape() {
        // A JSX container cannot hold a bare comma operator, and a malformed
        // rewrite would surface only as the project's own build failing. Each
        // shape below reaches the rewrite by a different route.
        let source = concat!(
            "export function Panel({ items, user, error, tone }) {\n",
            "  return (\n",
            "    <>\n",
            "      <Row {...spread(user)} title={`hi ${name(user)}`} />\n",
            "      <div className={cx('a', tone && 'b')} data-id={user?.id}>\n",
            "        {error ? <Alert text={message(error)} /> : null}\n",
            "        {items.map((item) => (\n",
            "          <Item key={item.id} label={format(item)} />\n",
            "        ))}\n",
            "        {count(items) > 0 && <Footer total={sum(items)} />}\n",
            "      </div>\n",
            "    </>\n",
            "  );\n",
            "}\n",
        );
        let output = instrument_candidate(source, "src/panel.tsx").unwrap();
        // The instrumented output must itself parse.
        instrument_candidate(&output.code, "src/panel.tsx").expect("instrumented JSX must reparse");
        // A spread attribute is not a container and is never rewritten.
        assert!(output.code.contains("{...spread(user)}"), "{}", output.code);
        let rendered = output
            .points
            .iter()
            .filter(|point| point.label.as_deref() == Some("jsx-rendered-expression"))
            .map(|point| point.source.as_str())
            .collect::<Vec<_>>();
        assert!(rendered.contains(&"`hi ${name(user)}`"), "{rendered:?}");
        assert!(
            rendered.contains(&"cx(\'a\', tone && \'b\')"),
            "{rendered:?}"
        );
        assert!(rendered.contains(&"format(item)"), "{rendered:?}");
        assert!(rendered.contains(&"message(error)"), "{rendered:?}");
        // `user?.id` short-circuits but is still a member access reached with
        // the statement, and a key that is a bare member chain is too.
        assert!(!rendered.contains(&"user?.id"), "{rendered:?}");
        assert!(!rendered.contains(&"item.id"), "{rendered:?}");
    }

    #[test]
    fn jest_global_expect_is_attributed_next_to_its_test_globals() {
        // Jest injects `expect`, `test`, `it` and `describe` into the test
        // environment; none is imported. The bare `expect` is the assertion
        // exactly when the file reaches for those test globals too.
        let source = "test('value', () => expect(value()).toBe(1));\n";
        let output = instrument_node_assertion_phases(source, "tests/value.test.js").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("expect.toBe"));
        // A stray global `expect` in ordinary code is not one.
        let plain = "const ok = expect(value()).toBe(1);\n";
        let output = instrument_node_assertion_phases(plain, "src/value.js").unwrap();
        assert_eq!(output.assertions, 0);
        assert_eq!(output.code, plain);
    }

    #[test]
    fn playwright_expect_matchers_have_the_same_source_identity_as_other_expect_bindings() {
        let source = concat!(
            "import { expect, test } from '@playwright/test';\n",
            "test('value', () => expect(value()).toBe(1));\n",
        );
        let output = instrument_node_assertion_phases(source, "tests/value.spec.mjs").unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("expect.toBe"));
    }

    #[test]
    fn project_discovered_expect_modules_are_not_hardcoded_in_the_transformer() {
        let source = concat!(
            "import { browserTest, expect } from '@acme/browser-fixtures';\n",
            "browserTest('value', () => expect(value()).toBe(1));\n",
        );
        let output = instrument_node_assertion_phases_with_expect_modules(
            source,
            "tests/value.spec.mjs",
            &["@acme/browser-fixtures".into()],
        )
        .unwrap();
        assert_eq!(output.assertions, 1);
        assert!(output.code.contains("expect.toBe"));
    }

    #[test]
    fn preserves_comment_payloads_byte_for_byte() {
        let comment = "/*---\ndescription: >\n  nested indentation is data\ninfo: |\n  first\n    second\n---*/";
        let source = format!("{comment}\nfunction run() {{ return 1; }}\n");
        let output = instrument_candidate(&source, "app/comments.js").unwrap();
        assert!(output.code.contains(comment), "{}", output.code);
    }

    #[test]
    fn source_map_destinations_follow_restored_comments() {
        let source = "function run() {\n  // first omitted comment\n  // second omitted comment\n  return 1;\n}\n";
        let output = analyze_candidate(source, "app/comment-map.js").unwrap();
        let encoded = serde_json::to_string(output.map.as_ref().unwrap()).unwrap();
        let map = oxc_sourcemap::SourceMap::from_json_string(&encoded).unwrap();
        let return_token = map
            .get_tokens()
            .find(|token| token.get_src_line() == 3 && token.get_src_col() == 2)
            .expect("return token mapping");
        let offset = Utf16LineIndex::new(&output.code).byte_offset(
            return_token.get_dst_line() as usize,
            return_token.get_dst_col() as usize,
        );
        assert!(
            output.code[offset..].starts_with("return"),
            "{}",
            output.code
        );
    }

    #[test]
    fn a_comment_mentioning_a_closing_script_tag_still_instruments() {
        // B10. A code generator rewrites `</script` to `<\/script` inside a
        // comment so the output cannot close an HTML <script> element early.
        // The restore compared the two spellings as different text, and because
        // it walks the source comments in order, one comment it could not
        // recognise consumed every remaining one and failed the file. That cost
        // a real project its coverage silently, and later its whole run.
        //
        // Prose about HTML is ordinary in web code, which is how this reached a
        // shipped release and stayed for months: the file was otherwise plain
        // TypeScript.
        for source in [
            "// </script>\nexport const x = 1;\n",
            "// </script\nexport const x = 1;\n",
            "// </SCRIPT>\nexport const x = 1;\n",
            "// see the </script> tag here\nexport const x = 1;\n",
            "/* block </script> here */\nexport const x = 1;\n",
            "/** jsdoc </script> */\nexport const x = 1;\n",
            // A run of comments, as the reported file had.
            "// one </script>\n// two </script>\n// three\nexport const x = 1;\n",
        ] {
            let output = instrument_candidate(source, "src/probe.ts")
                .unwrap_or_else(|error| panic!("{source:?}: {error:?}"));
            let original = source.lines().next().expect("a comment");
            assert!(
                output.code.contains(original),
                "comment was not restored verbatim: {original:?} missing from {:?}",
                output.code
            );
        }
        // The escape is the generator's, not the author's: a backslash the
        // author wrote survives as written rather than being collapsed.
        let written = "// author wrote <\\/script>\nexport const x = 1;\n";
        let output = instrument_candidate(written, "src/probe.ts").expect("instruments");
        assert!(
            output.code.contains("// author wrote <\\/script>"),
            "{:?}",
            output.code
        );
        // Only that sequence is normalised. Nothing else a comment may contain
        // is treated as equal to a different spelling.
        assert!(!equal_ignoring_whitespace("// a/b", "// a\\/b"));
        assert!(!equal_ignoring_whitespace("// </div>", "// </span>"));
        assert!(equal_ignoring_whitespace("// </script>", "// <\\/script>"));
    }

    #[test]
    fn a_comment_that_cannot_be_restored_says_which_comment_and_why() {
        // The counts in this error are usually equal, so reporting them alone
        // says the opposite of what happened -- nothing was dropped, one
        // comment was not recognised. The reported 116-vs-112 sent the first
        // reader looking for four missing comments that were never the cause.
        let error = CandidateError::CommentPreservation {
            expected: 116,
            actual: 112,
            detail:
                "no source comment matches the generated comment \"// x\" (matched 97 before it)"
                    .to_owned(),
        };
        let rendered = format!("{error:?}");
        assert!(rendered.contains("no source comment matches"), "{rendered}");
        assert!(rendered.contains("matched 97 before it"), "{rendered}");
    }

    #[test]
    fn restored_comments_never_split_a_keyword_from_its_argument() {
        // oxc drops the comment that led a parenthesised return argument; the
        // restore used to put it back right after `return`, on its own line,
        // and automatic semicolon insertion turned the statement into `return;`
        // with the JSX unreachable. Vite then removed the unreachable tree and
        // every declaration only it used, so a component rendered nothing under
        // measurement while passing plainly. Expression-bodied arrows are hit
        // too, since instrumentation rewrites them into `return` blocks.
        let source = concat!(
            "export const A = ({ open }) => {\n",
            "  return (\n",
            "    // leading comment before JSX\n",
            "    <div aria-expanded={open}>a</div>\n",
            "  )\n",
            "}\n",
            "export const B = ({ open }) => (\n",
            "  // comment in an expression body\n",
            "  <div aria-expanded={open}>b</div>\n",
            ")\n",
            "export function C(x) {\n",
            "  return ( // inline line comment\n",
            "    x + 1\n",
            "  )\n",
            "}\n",
            "export function D(x) {\n",
            "  throw (\n",
            "    /* block\n       comment */\n",
            "    new Error(String(x))\n",
            "  )\n",
            "}\n",
            "export function E(x) {\n",
            "  return ( /* inline block */ x + 2 )\n",
            "}\n",
        );
        let output = instrument_direct_candidate(source, "app/components/List.tsx").unwrap();
        for keyword in ["return ", "throw "] {
            for (index, _) in output.code.match_indices(keyword) {
                let rest = output.code[index + keyword.len()..].trim_start_matches([' ', '\t']);
                let block_with_line_break = rest.starts_with("/*")
                    && rest[..rest.find("*/").unwrap_or(rest.len())].contains('\n');
                assert!(
                    !rest.starts_with('\n') && !rest.starts_with("//") && !block_with_line_break,
                    "`{keyword}` is separated from its argument:\n{}",
                    output.code
                );
            }
        }
        for comment in [
            "// leading comment before JSX",
            "// comment in an expression body",
            "// inline line comment",
            "/* block\n       comment */",
            "/* inline block */",
        ] {
            assert!(
                output.code.contains(comment),
                "{comment} was lost:\n{}",
                output.code
            );
        }
        assert!(
            output
                .code
                .contains("return <div aria-expanded={open}>a</div>"),
            "{}",
            output.code
        );
        assert!(
            output
                .code
                .contains("return <div aria-expanded={open}>b</div>"),
            "{}",
            output.code
        );
        // The restored output must still parse to the same program shape.
        let allocator = Allocator::default();
        let reparsed = Parser::new(
            &allocator,
            &output.code,
            SourceType::from_path("app/components/List.tsx").unwrap(),
        )
        .parse();
        assert!(
            reparsed.errors.is_empty(),
            "{:?}\n{}",
            reparsed.errors,
            output.code
        );
    }

    #[test]
    fn preserves_reference_order_across_every_control_decision_kind() {
        let source = "function run(a,b) {\n  const selected = a ? b : a;\n  while (a && b) break;\n  do { a = false; } while (a || b);\n  for (let i = 0; i < 1 && b; i++) work();\n  if (selected) return 1;\n  return 0;\n}";
        let output = instrument_candidate(source, "app/control.js").unwrap();
        assert_eq!(
            output
                .decisions
                .iter()
                .map(|decision| decision.kind.as_str())
                .collect::<Vec<_>>(),
            vec!["ternary", "while", "do-while", "for", "if"]
        );
    }

    #[test]
    fn a_loop_that_must_run_has_no_zero_iteration_obligation() {
        // B11. `for (const x of [a, b])` cannot iterate zero times, so the
        // outcome was an obligation no test could ever discharge -- the author
        // could only fake a test or delete the loop.
        let entered = |source: &str| {
            let output = analyze_candidate(source, "src/loops.ts").unwrap();
            output
                .branches
                .iter()
                .filter(|branch| branch.kind == "for-of" || branch.kind == "for-in")
                .count()
        };
        // Folded: the iterable is certainly non-empty.
        for source in [
            "export function f(g) { for (const x of [1, 2]) g(x); }\n",
            "export function f(g) { for (const x of [1]) g(x); }\n",
            "export function f(g) { const xs = [1, 2]; for (const x of xs) g(x); }\n",
            // A hole still yields once: [,].length === 1.
            "export function f(g) { for (const x of [,]) g(x); }\n",
            // A spread may contribute nothing, but a definite element is enough.
            "export function f(g, ys) { for (const x of [...ys, 1]) g(x); }\n",
        ] {
            assert_eq!(entered(source), 0, "should be folded: {source}");
        }
        // Kept: the loop can genuinely run zero times.
        for source in [
            "export function f(g, ys) { for (const x of ys) g(x); }\n",
            "export function f(g) { for (const x of []) g(x); }\n",
            "export function f(g, ys) { for (const x of [...ys]) g(x); }\n",
            "export function f(g) { let xs = [1]; xs = []; for (const x of xs) g(x); }\n",
            // Anything else may reach the binding, including a shrinking call.
            "export function f(g) { const xs = [1]; xs.pop(); for (const x of xs) g(x); }\n",
            "export function f(g) { const xs = [1]; g(xs); for (const x of xs) g(x); }\n",
            "export function f(g) { const xs = [1]; xs.length = 0; for (const x of xs) g(x); }\n",
            // A different binding of the same name must not be borrowed.
            concat!(
                "const xs = [1, 2];\n",
                "export function f(g, ys) { const xs = ys; for (const x of xs) g(x); }\n",
            ),
            // for-in is about keys, not elements, and is left alone.
            "export function f(g) { for (const k in [1, 2]) g(k); }\n",
        ] {
            assert_eq!(entered(source), 1, "should be kept: {source}");
        }
        // The loop body is still measured; only the impossible outcome is gone.
        let output = analyze_candidate(
            "export function f(g) { for (const x of [1, 2]) g(x); }\n",
            "src/loops.ts",
        )
        .unwrap();
        assert!(
            output
                .points
                .iter()
                .any(|point| point.source.contains("g(x)")),
            "the body must still be an obligation"
        );
    }

    #[test]
    fn excludes_syntactically_invariant_control_decisions_from_mcdc() {
        let source = concat!(
            "export function run(value) {\n",
            "  while (true) { break; }\n",
            "  do { value += 1; } while (false);\n",
            "  if (false) value += 2;\n",
            "  if (value || true) value += 3;\n",
            "  if (value && false) value += 4;\n",
            "  if (value) value += 5;\n",
            "  return value;\n",
            "}\n",
        );
        let output = analyze_candidate(source, "src/constants.js").unwrap();
        assert_eq!(output.decisions.len(), 1);
        assert_eq!(output.decisions[0].source, "value");

        let instrumented = instrument_direct_candidate(source, "src/constants.js").unwrap();
        assert_eq!(instrumented.decisions.len(), 1);
        assert_eq!(instrumented.decisions[0].source, "value");
    }

    #[test]
    fn leaves_compile_time_style_macro_arguments_as_source() {
        // StyleX evaluates these at build time and rejects a block-bodied
        // dynamic style; probing them broke a real project's Vite build.
        let source = concat!(
            "import * as stylex from '@stylexjs/stylex';\n",
            "const styles = stylex.create({\n",
            "  container: { display: 'flex' },\n",
            "  paddingTop: (spacing: number) => ({ paddingTop: `${spacing}px` }),\n",
            "  tone: (dark: boolean) => ({ color: dark ? 'white' : 'black' }),\n",
            "});\n",
            "export function render(spacing: number) {\n",
            "  return stylex.props(styles.container, styles.paddingTop(spacing));\n",
            "}\n",
        );
        let output = instrument_direct_candidate(source, "src/styles.tsx").unwrap();
        assert!(
            output.code.contains("=> ({ paddingTop: `${spacing}px` })")
                || output
                    .code
                    .contains("=> ({\n\t\tpaddingTop: `${spacing}px`\n\t})"),
            "dynamic style arrow must stay an expression body:\n{}",
            output.code
        );
        assert!(
            !output
                .decisions
                .iter()
                .any(|decision| decision.source.contains("dark")),
            "no decision may be collected inside the macro argument"
        );
        let function_points = output
            .points
            .iter()
            .filter(|point| point.kind == "function")
            .map(|point| point.source.as_str())
            .collect::<Vec<_>>();
        assert!(
            function_points
                .iter()
                .all(|source| source.contains("render")),
            "only the real function may carry a function point: {function_points:?}"
        );
        assert!(
            output.limitations.is_empty(),
            "compiled-away code is not a limitation: {:?}",
            output.limitations
        );
    }

    #[test]
    fn excludes_typescript_ambient_declarations_from_the_executable_denominator() {
        let source = concat!(
            "declare global {\n",
            "  var Beacon: undefined | ((action: string) => void);\n",
            "}\n",
            "declare module 'virtual:feature' {\n",
            "  export const enabled: boolean;\n",
            "}\n",
            "declare const buildOnly: string;\n",
            "export const live = 1;\n",
        );
        let output = instrument_direct_candidate(source, "src/ambient.ts").unwrap();
        let statements = output
            .points
            .iter()
            .filter(|point| point.kind == "statement")
            .map(|point| point.source.as_str())
            .collect::<Vec<_>>();
        assert_eq!(statements, ["const live = 1;"]);
        assert!(output.code.contains("const live = 1"));
    }

    #[test]
    fn exposes_the_complete_probe_v2_instrumenter_contract() {
        let output = instrument_candidate(SOURCE, "app/decide.ts").unwrap();
        assert!(output.complete);
        assert!(output.limitations.is_empty());
        assert_eq!(output.supported_surface, "complete-js-instrumenter-v1");
        let runtime = output.runtime.expect("candidate runtime binding");
        assert!(output.code.contains(&runtime.mcdc_end_v2));
        assert!(output.code.contains("_supercovMcdcFrame"));
        assert!(output.code.contains("_supercovMcdcResult"));
        assert!(output.code.contains("+= _supercovMcdcValue"));
        assert_eq!(output.decisions.len(), 1);
        assert!(output.points.iter().any(|point| point.kind == "statement"));
        assert!(output.points.iter().any(|point| point.kind == "function"));

        let allocator = Allocator::default();
        let reparsed = Parser::new(
            &allocator,
            &output.code,
            SourceType::from_path("app/decide.ts").unwrap(),
        )
        .parse();
        assert!(reparsed.errors.is_empty(), "{:?}", reparsed.errors);
    }

    #[test]
    fn explicit_type_only_imports_are_not_runtime_coverage_obligations() {
        let source = concat!(
            "import type { Session } from './types.ts';\n",
            "import { type Row } from './rows.ts';\n",
            "import './register.ts';\n",
            "const value = 1;\n",
        );
        let output = instrument_candidate(source, "app/imports.ts").unwrap();
        let statement_lines = output
            .points
            .iter()
            .filter(|point| point.kind == "statement")
            .map(|point| point.line)
            .collect::<Vec<_>>();
        assert_eq!(statement_lines, vec![2, 3, 4]);
    }

    #[test]
    fn configured_import_elision_keeps_values_side_effects_and_statement_ids() {
        let source = concat!(
            "import { Logger } from './types.js';\n",
            "import DefaultType from './default.js';\n",
            "import * as Types from './namespace.js';\n",
            "import { type Inline } from './inline.js';\n",
            "import { run, type Config } from './mixed.js';\n",
            "import './register.js';\n",
            "import {} from './empty.js';\n",
            "import { unused } from './unused.js';\n",
            "export function main(logger: Logger, value: DefaultType, t: Types.Row) { return run(logger); }\n",
        );
        let preserved =
            instrument_with_import_policy(source, "src/main.ts", "./capability.mjs", true, false)
                .unwrap();
        let erased =
            instrument_with_import_policy(source, "src/main.ts", "./capability.mjs", true, true)
                .unwrap();
        assert_eq!(
            erased
                .excluded_statements
                .iter()
                .map(|p| p.line)
                .collect::<Vec<_>>(),
            vec![1, 2, 3, 4]
        );
        let excluded = erased
            .excluded_statements
            .iter()
            .map(|p| &p.id)
            .collect::<HashSet<_>>();
        let expected = preserved
            .points
            .iter()
            .filter(|p| !excluded.contains(&p.id))
            .collect::<Vec<_>>();
        assert_eq!(erased.points.iter().collect::<Vec<_>>(), expected);
        for line in [5, 6, 7, 8] {
            assert!(erased.points.iter().any(|p| p.line == line));
        }
        // JavaScript value imports and type queries with runtime uses remain.
        let source = "import { Factory } from './types.js'; type T = typeof Factory; export const f = () => new Factory();";
        let mixed =
            instrument_with_import_policy(source, "src/mixed.ts", "./capability.mjs", true, true)
                .unwrap();
        assert!(mixed.excluded_statements.is_empty());
    }

    #[test]
    fn allocates_runtime_and_scratch_names_away_from_user_bindings() {
        let source = "const __supercovMcdcEndV2 = 1, _supercovMcdcFrame1 = 2;\nif (a && b) work();";
        let output = instrument_candidate(source, "app/collisions.js").unwrap();
        let runtime = output.runtime.expect("candidate runtime binding");
        assert_ne!(runtime.mcdc_end_v2, "__supercovMcdcEndV2");
        assert!(!output.code.contains("let _supercovMcdcFrame1,"));
    }

    #[test]
    fn instruments_wider_decisions_with_the_exact_v1_fallback() {
        let predicate = (0..33)
            .map(|index| format!("c{index}"))
            .collect::<Vec<_>>()
            .join(" && ");
        let source = format!("if ({predicate}) work();");
        let output = instrument_candidate(&source, "app/wide.js").unwrap();
        assert_eq!(output.decisions[0].conditions.len(), 33);
        let runtime = output.runtime.expect("candidate runtime binding");
        assert!(!output.code.contains(&format!("{}(", runtime.mcdc_end_v2)));
        assert!(output.code.contains(&format!("{}(", runtime.mcdc_begin)));
        assert!(
            output
                .code
                .contains(&format!("{}(", runtime.mcdc_condition))
        );
        assert!(output.code.contains(&format!("{}(", runtime.mcdc_end)));
    }

    #[test]
    fn wraps_framework_request_exports_without_changing_the_public_api() {
        for (file, source, export_prefix) in [
            (
                "app/routes/example.ts",
                "export const loader = async ({ request }) => request.url;",
                "export const loader = ",
            ),
            (
                "app/routes/example.ts",
                "export async function action({ request }) { return request.method; }",
                "export const action = ",
            ),
            (
                "app/api/items/route.ts",
                "export function GET(request) { return Response.json({ url: request.url }); }",
                "export const GET = ",
            ),
            (
                "app/routes/example.ts",
                "export { generateAction as action } from './generateAction';",
                "export const action = ",
            ),
            (
                "app/entry.server.tsx",
                "export default async function handleRequest(request) { return request.url; }",
                "export default ",
            ),
        ] {
            let output = instrument_candidate(source, file).unwrap();
            let runtime = output.runtime.as_ref().expect("runtime binding");
            assert!(
                output
                    .code
                    .contains(&format!("{export_prefix}{}(", runtime.with_request_phase)),
                "{file}: {}",
                output.code
            );
            assert!(
                output.code.contains(&format!(
                    "withRequestPhase as {}",
                    runtime.with_request_phase
                )),
                "{file}: {}",
                output.code
            );
            let allocator = Allocator::default();
            let reparsed = Parser::new(
                &allocator,
                &output.code,
                SourceType::from_path(file).unwrap(),
            )
            .parse();
            assert!(reparsed.errors.is_empty(), "{file}: {:?}", reparsed.errors);
        }
    }

    #[test]
    fn parse_failures_are_explicit_and_never_claim_completeness() {
        assert!(matches!(
            analyze_candidate("if (", "broken.js"),
            Err(CandidateError::Parse(errors)) if !errors.is_empty()
        ));
        assert!(matches!(
            analyze_candidate("let value = 1", "unknown.extension"),
            Err(CandidateError::UnknownSourceType(_))
        ));
    }
}
