//! Declaration units and comment-blind digests of one source file.
//!
//! An assertion flow rests on specific code, not on the bytes of a file, and a
//! test executes specific declarations, not a file. This module names what a
//! file declares -- functions, methods, classes, in a tree -- and digests each
//! declaration with comments blanked and nested declarations replaced by a
//! placeholder, so an edit is attributed to the declaration it lands in and to
//! nothing else. A test's recorded execution is expressed in the same units.
//!
//! Comments are erased, each with the formatting that was its own: the line it
//! occupied, or the spaces that set it off from code. Blank lines and trailing
//! whitespace go too, outside string literals, where no language reads them.
//! Whitespace that belongs to code is kept exactly: indentation is syntax in
//! Python, and a line break decides a statement in JavaScript, Go, Ruby and
//! Kotlin. A comment the language or a tool reads -- `//go:embed`, a Ruby
//! magic comment, a Rust doctest -- is kept as well; erasing it would hide a
//! change that runs.
//!
//! Nothing here is a dependency analysis. The tree says where an edit landed;
//! whether that edit matters to a test is decided by what the test executed.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;

/// One declaration, positioned the way anchors are: one-based lines and
/// one-based UTF-8 byte columns, end exclusive.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Unit {
    /// Name path from the file's top level -- `Server.start`, `tests::it_works`
    /// -- and empty for the file itself. Two declarations that would share a
    /// path are told apart by `#2`, `#3` in source order.
    pub path: String,
    pub kind: String,
    pub line: usize,
    pub column: usize,
    pub end_line: usize,
    pub end_column: usize,
    /// Digest of this declaration's own text: comments blanked, each nested
    /// declaration reduced to one placeholder character.
    pub digest: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent: Option<usize>,
    /// A declaration with no runtime presence: a TypeScript interface, type
    /// alias, overload signature or ambient declaration. It has a digest, so a
    /// report can name it, but it takes no part in what a program does.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub inert: bool,
}

/// What a parser could say about one file.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Code {
    /// Digest of everything a program can observe: the whole file with
    /// comments blanked and inert declarations removed.
    pub semantic: String,
    /// Digest of the set of declarations -- kind and path -- that can take
    /// part in name resolution or dispatch. Adding, removing or renaming one
    /// changes it; editing a body does not.
    pub structure: String,
    /// In source order; `units[0]` is the file itself and contains everything.
    pub units: Vec<Unit>,
    /// Lines (one-based, ascending) that hold nothing a program can observe: a
    /// comment on its own, or blank. Counting lines without them gives a
    /// position that inserting either does not move.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub erased: Vec<usize>,
}

impl Unit {
    /// A unit that can only be used by running it. A class, object, type or
    /// module is also data -- a field, a constant, a shape -- that code reads
    /// without a probe firing inside it, so those are never excluded from what
    /// a test depends on.
    pub fn is_code(&self) -> bool {
        matches!(
            self.kind.as_str(),
            "function" | "method" | "constructor" | "get" | "set" | "init"
        )
    }
    pub fn contains(&self, line: usize, column: usize) -> bool {
        (self.line, self.column) <= (line, column)
            && (line, column) < (self.end_line, self.end_column)
    }
    /// `path (line N)`, or `top level` for the file unit.
    pub fn describe(&self) -> String {
        if self.path.is_empty() {
            "top level".to_owned()
        } else {
            format!("{} (line {})", self.path, self.line)
        }
    }
}

impl Code {
    /// A line's number counting only lines that hold code.
    pub fn code_line(&self, line: usize) -> usize {
        line - self.erased.partition_point(|e| *e < line)
    }
    /// The innermost unit holding a position; the file unit when nothing
    /// narrower does.
    pub fn unit_at(&self, line: usize, column: usize) -> usize {
        // Units are in source order with a parent before its children, so the
        // last one starting at or before the position is either the innermost
        // holder or a sibling that ended earlier; its ancestors settle which.
        let mut index = self
            .units
            .partition_point(|u| (u.line, u.column) <= (line, column))
            .saturating_sub(1);
        while !self.units[index].contains(line, column) {
            match self.units[index].parent {
                Some(parent) => index = parent,
                None => return 0,
            }
        }
        index
    }
    /// A unit and everything it sits inside, innermost first, ending at the
    /// file unit.
    pub fn ancestors(&self, index: usize) -> impl Iterator<Item = usize> + '_ {
        std::iter::successors(Some(index), move |i| self.units[*i].parent)
    }
    /// Units by path, for matching one capture against another.
    pub fn by_path(&self) -> BTreeMap<&str, &Unit> {
        self.units.iter().map(|u| (u.path.as_str(), u)).collect()
    }
    /// What moved between two views of the same file, by declaration path.
    pub fn diff(&self, new: &Code) -> Diff {
        let before = self.by_path();
        let after = new.by_path();
        Diff {
            changed: self
                .units
                .iter()
                .enumerate()
                .filter(|(_, u)| {
                    after
                        .get(u.path.as_str())
                        .is_some_and(|n| n.digest != u.digest)
                })
                .map(|(i, _)| i)
                .collect(),
            removed: self
                .units
                .iter()
                .enumerate()
                .filter(|(_, u)| !after.contains_key(u.path.as_str()))
                .map(|(i, _)| i)
                .collect(),
            added: new
                .units
                .iter()
                .enumerate()
                .filter(|(_, u)| !before.contains_key(u.path.as_str()))
                .map(|(i, _)| i)
                .collect(),
            structural: self.structure != new.structure,
        }
    }
}

/// Indices into the old view for what changed or went, into the new for what
/// arrived.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Diff {
    pub changed: Vec<usize>,
    pub removed: Vec<usize>,
    pub added: Vec<usize>,
    pub structural: bool,
}
impl Diff {
    /// Nothing but declaration bodies changed, and only in units that are
    /// code with a probe of their own -- the change can reach a test only by
    /// being run, so a test that ran none of it is untouched.
    pub fn narrow(&self, old: &Code, probed: &[usize]) -> bool {
        !self.structural
            && self.added.is_empty()
            && self.removed.is_empty()
            && self
                .changed
                .iter()
                .all(|i| old.units[*i].is_code() && probed.contains(i))
    }
}

/// A few names, and how many more there are.
pub fn named<'u>(units: impl IntoIterator<Item = &'u Unit>) -> String {
    let names = units.into_iter().map(Unit::describe).collect::<Vec<_>>();
    match names.len() {
        0 => "nothing".to_owned(),
        1..=4 => names.join(", "),
        n => format!("{}, and {} more", names[..3].join(", "), n - 3),
    }
}

/// One declaration the parser found, in bytes.
struct Item {
    name: String,
    kind: &'static str,
    start: usize,
    end: usize,
    inert: bool,
}
struct Outline {
    comments: Vec<(usize, usize)>,
    /// String literals: whitespace inside them is content, not formatting.
    strings: Vec<(usize, usize)>,
    declarations: Vec<Item>,
    separator: &'static str,
}

/// The parser's view of a file, or `None` when Supercov has no parser for it
/// or the file does not parse. A file without a view is compared by its bytes.
pub fn code(path: &str, source: &str) -> Option<Code> {
    let extension = path.rsplit_once('.').map_or("", |(_, e)| e);
    let outline = match extension {
        "js" | "mjs" | "cjs" | "jsx" | "ts" | "mts" | "cts" | "tsx" => javascript(path, source),
        "py" => python(source),
        "rs" => rust(source),
        "rb" => ruby(source),
        "go" => go(source),
        "java" => java(source),
        "kt" | "kts" => kotlin(source),
        _ => return None,
    }?;
    Some(build(source, outline))
}

fn short_digest(text: &str) -> String {
    let digest = Sha256::digest(text.as_bytes());
    digest[..16].iter().map(|b| format!("{b:02x}")).collect()
}

/// Comments any language keeps: Supercov's own pragmas.
fn universally_significant(text: &str) -> bool {
    text.to_ascii_lowercase().contains("supercov")
}

/// What to take out for one comment so that the text reads as if the comment
/// had never been written: the whole line when the comment owns it, the
/// whitespace that set it off from code otherwise, and a single space where
/// removing it would glue two words together.
fn erasure(source: &str, start: usize, end: usize) -> (usize, usize, &'static str) {
    let bytes = source.as_bytes();
    let blank = |b: u8| matches!(b, b' ' | b'\t' | b'\r');
    let word = |b: u8| b.is_ascii_alphanumeric() || b == b'_' || b == b'$';
    let line_start = source[..start].rfind('\n').map_or(0, |i| i + 1);
    let mut after = end;
    while after < bytes.len() && blank(bytes[after]) {
        after += 1;
    }
    let terminated = after >= bytes.len() || bytes[after] == b'\n';
    if terminated {
        if bytes[line_start..start].iter().all(|b| blank(*b)) {
            let stop = if after < bytes.len() {
                after + 1
            } else {
                after
            };
            return (line_start, stop, "");
        }
        let mut before = start;
        while before > line_start && blank(bytes[before - 1]) {
            before -= 1;
        }
        return (before, after, "");
    }
    let preceded = start == line_start || blank(bytes[start - 1]);
    let stop = if preceded { after } else { end };
    let glue = start > 0 && stop < bytes.len() && word(bytes[start - 1]) && word(bytes[stop]);
    (start, stop, if glue { " " } else { "" })
}

fn build(source: &str, outline: Outline) -> Code {
    // The file with insignificant comments erased, and a map from every
    // original offset to its place in that text. Declaration boundaries never
    // fall inside a comment, so mapping them is exact.
    let mut comments = outline.comments;
    comments.sort_unstable();
    let mut stripped = String::with_capacity(source.len());
    let mut map = vec![0usize; source.len() + 1];
    let mut cursor = 0;
    for (start, end) in comments {
        if end > source.len() || start >= end {
            continue;
        }
        let (start, stop, replacement) = erasure(source, start, end);
        let start = start.max(cursor);
        if stop <= start {
            continue;
        }
        stripped.push_str(&source[cursor..start]);
        let base = stripped.len() - (start - cursor);
        for (i, slot) in map[cursor..start].iter_mut().enumerate() {
            *slot = base + i;
        }
        let here = stripped.len();
        stripped.push_str(replacement);
        map[start..stop].fill(here);
        cursor = stop;
    }
    stripped.push_str(&source[cursor..]);
    let base = stripped.len() - (source.len() - cursor);
    for (i, slot) in map[cursor..=source.len()].iter_mut().enumerate() {
        *slot = base + i;
    }
    // Then blank lines and trailing whitespace, outside string literals.
    let mut strings = outline
        .strings
        .iter()
        .filter(|(start, end)| start < end && *end <= source.len())
        .map(|(start, end)| (map[*start], map[*end]))
        .collect::<Vec<_>>();
    strings.sort_unstable();
    let (stripped, remap) = erase_blank(&stripped, &strings);
    for slot in &mut map {
        *slot = remap[*slot];
    }

    let mut declarations = outline.declarations;
    declarations.retain(|d| d.start < d.end && d.end <= source.len());
    declarations.sort_by(|a, b| a.start.cmp(&b.start).then(b.end.cmp(&a.end)));
    declarations
        .dedup_by(|later, earlier| later.start == earlier.start && later.end == earlier.end);

    let lines = line_starts(source);
    let position = |offset: usize| -> (usize, usize) {
        let line = lines.partition_point(|s| *s <= offset);
        (line, offset - lines[line - 1] + 1)
    };
    // A line nothing of which survived erasure.
    let erased = (0..lines.len())
        .filter(|i| {
            let start = lines[*i];
            let next = lines.get(i + 1).copied().unwrap_or(source.len());
            start < next && map[start] == map[next]
        })
        .map(|i| i + 1)
        .collect::<Vec<_>>();

    struct Built {
        path: String,
        kind: &'static str,
        start: usize,
        end: usize,
        parent: Option<usize>,
        inert: bool,
        children: Vec<usize>,
    }
    let mut built = vec![Built {
        path: String::new(),
        kind: "file",
        start: 0,
        end: source.len(),
        parent: None,
        inert: false,
        children: vec![],
    }];
    let mut stack = vec![0usize];
    let mut names: BTreeMap<(usize, String), usize> = BTreeMap::new();
    for d in declarations {
        while stack.len() > 1 && built[*stack.last().unwrap()].end <= d.start {
            stack.pop();
        }
        let parent = *stack.last().unwrap();
        let index = built.len();
        let seen = names.entry((parent, d.name.clone())).or_insert(0);
        *seen += 1;
        let name = if *seen == 1 {
            d.name
        } else {
            format!("{}#{}", d.name, *seen)
        };
        let path = if built[parent].path.is_empty() {
            name
        } else {
            format!("{}{}{}", built[parent].path, outline.separator, name)
        };
        built.push(Built {
            path,
            kind: d.kind,
            start: d.start,
            end: d.end.min(built[parent].end),
            parent: Some(parent),
            inert: d.inert || built[parent].inert,
            children: vec![],
        });
        built[parent].children.push(index);
        stack.push(index);
    }

    let mut units = Vec::with_capacity(built.len());
    for unit in &built {
        let mut text = String::new();
        let mut cursor = map[unit.start];
        for child in unit.children.iter().map(|c| &built[*c]) {
            let (start, end) = (map[child.start], map[child.end]);
            if start < cursor {
                continue;
            }
            text.push_str(&stripped[cursor..start]);
            // An inert declaration leaves no mark: adding a type alias next to
            // a function does not change what the function's file does.
            if child.inert {
                cursor = line_end_after(&stripped, end);
            } else {
                text.push('\u{0}');
                cursor = end;
            }
        }
        text.push_str(&stripped[cursor..map[unit.end]]);
        let (line, column) = position(unit.start);
        let (end_line, end_column) = position(unit.end);
        units.push(Unit {
            path: unit.path.clone(),
            kind: unit.kind.to_owned(),
            line,
            column,
            end_line,
            end_column,
            digest: short_digest(&text),
            parent: unit.parent,
            inert: unit.inert,
        });
    }

    let mut semantic = String::with_capacity(stripped.len());
    let mut cursor = 0;
    for unit in built.iter().filter(|u| u.inert) {
        let (start, end) = (map[unit.start], map[unit.end]);
        if start < cursor {
            continue;
        }
        semantic.push_str(&stripped[cursor..start]);
        cursor = line_end_after(&stripped, end);
    }
    semantic.push_str(&stripped[cursor..]);

    let mut structure = built
        .iter()
        .skip(1)
        .filter(|u| !u.inert)
        .map(|u| format!("{}\u{1}{}\n", u.kind, u.path))
        .collect::<Vec<_>>();
    structure.sort_unstable();

    Code {
        semantic: short_digest(&semantic),
        structure: short_digest(&structure.concat()),
        units,
        erased,
    }
}

/// The end of the line a removed declaration sat on, when nothing but
/// whitespace follows it there; otherwise the position itself.
fn line_end_after(text: &str, position: usize) -> usize {
    let bytes = text.as_bytes();
    let mut p = position;
    while p < bytes.len() && matches!(bytes[p], b' ' | b'\t' | b'\r') {
        p += 1;
    }
    if p < bytes.len() && bytes[p] == b'\n' {
        p + 1
    } else {
        position
    }
}

/// Blank lines and trailing whitespace taken out of `text`, except inside the
/// given (sorted) string ranges, with a map from every offset of `text` to its
/// place in the result.
fn erase_blank(text: &str, strings: &[(usize, usize)]) -> (String, Vec<usize>) {
    let bytes = text.as_bytes();
    let blank = |b: u8| matches!(b, b' ' | b'\t' | b'\r');
    let inside = |start: usize, end: usize| {
        let i = strings.partition_point(|(_, e)| *e <= start);
        strings.get(i).is_some_and(|(s, _)| *s < end)
    };
    let mut out = String::with_capacity(text.len());
    let mut map = vec![0usize; text.len() + 1];
    let mut cursor = 0;
    let mut line_start = 0;
    while line_start <= bytes.len() {
        let line_end = text[line_start..]
            .find('\n')
            .map_or(bytes.len(), |i| line_start + i);
        let next = if line_end < bytes.len() {
            line_end + 1
        } else {
            bytes.len()
        };
        let content_end = {
            let mut e = line_end;
            while e > line_start && blank(bytes[e - 1]) {
                e -= 1;
            }
            e
        };
        // What to drop: the whole line when it is blank, its trailing
        // whitespace otherwise -- unless a string literal owns that stretch.
        let (drop_start, drop_end) = if content_end == line_start {
            (line_start, next)
        } else {
            (content_end, line_end)
        };
        let dropping = drop_start < drop_end && !inside(drop_start, drop_end);
        let keep_until = if dropping { drop_start } else { next };
        out.push_str(&text[cursor..keep_until]);
        let base = out.len() - (keep_until - cursor);
        for (i, slot) in map[cursor..keep_until].iter_mut().enumerate() {
            *slot = base + i;
        }
        if dropping {
            map[drop_start..drop_end].fill(out.len());
            if drop_end < next {
                // A trailing-whitespace drop keeps the newline.
                out.push_str(&text[drop_end..next]);
                let base = out.len() - (next - drop_end);
                for (i, slot) in map[drop_end..next].iter_mut().enumerate() {
                    *slot = base + i;
                }
            }
        }
        cursor = next;
        if next == bytes.len() {
            break;
        }
        line_start = next;
    }
    map[text.len()] = out.len();
    (out, map)
}

fn line_starts(source: &str) -> Vec<usize> {
    std::iter::once(0)
        .chain(source.match_indices('\n').map(|(i, _)| i + 1))
        .collect()
}

fn collapse_whitespace(text: &str) -> String {
    text.split_whitespace().collect::<Vec<_>>().join(" ")
}

// ---------------------------------------------------------------- JavaScript

fn javascript(path: &str, source: &str) -> Option<Outline> {
    use oxc_ast::ast::*;
    use oxc_ast_visit::{Visit, walk};
    use oxc_span::GetSpan;

    let source_type =
        crate::js_instrumenter::project_source_type(std::path::Path::new(path)).ok()?;
    let allocator = oxc_allocator::Allocator::default();
    let parsed = oxc_parser::Parser::new(&allocator, source, source_type).parse();
    if parsed.panicked || !parsed.errors.is_empty() {
        return None;
    }
    let comments = parsed
        .program
        .comments
        .iter()
        .map(|c| (c.span.start as usize, c.span.end as usize))
        .filter(|(start, end)| !universally_significant(&source[*start..*end]))
        .collect();

    struct Collector<'s> {
        source: &'s str,
        declarations: Vec<Item>,
        strings: Vec<(usize, usize)>,
    }
    impl<'s> Collector<'s> {
        fn record(&mut self, name: String, kind: &'static str, start: u32, end: u32, inert: bool) {
            self.declarations.push(Item {
                name,
                kind,
                start: start as usize,
                end: end as usize,
                inert,
            });
        }
        /// A function or class expression with no name of its own takes the
        /// name it is bound to.
        fn anonymous(expression: &Expression<'_>) -> Option<(oxc_span::Span, &'static str, bool)> {
            match expression {
                Expression::FunctionExpression(f) if f.id.is_none() => {
                    Some((f.span, "function", f.body.is_none()))
                }
                Expression::ArrowFunctionExpression(a) => Some((a.span, "function", false)),
                Expression::ClassExpression(c) if c.id.is_none() => {
                    Some((c.span, "class", c.declare))
                }
                _ => None,
            }
        }
        fn key(key: &PropertyKey<'_>) -> Option<String> {
            match key {
                PropertyKey::PrivateIdentifier(id) => Some(format!("#{}", id.name)),
                _ => key.static_name().map(|n| n.into_owned()),
            }
        }
    }
    fn with_decorators(span: oxc_span::Span, decorators: &[Decorator<'_>]) -> u32 {
        decorators
            .iter()
            .map(|d| d.span.start)
            .min()
            .map_or(span.start, |s| s.min(span.start))
    }
    impl<'a> Visit<'a> for Collector<'_> {
        fn visit_string_literal(&mut self, it: &StringLiteral<'a>) {
            self.strings
                .push((it.span.start as usize, it.span.end as usize));
        }
        fn visit_template_literal(&mut self, it: &TemplateLiteral<'a>) {
            self.strings
                .push((it.span.start as usize, it.span.end as usize));
            walk::walk_template_literal(self, it);
        }
        fn visit_ts_template_literal_type(&mut self, it: &TSTemplateLiteralType<'a>) {
            self.strings
                .push((it.span.start as usize, it.span.end as usize));
            walk::walk_ts_template_literal_type(self, it);
        }
        fn visit_function(&mut self, it: &Function<'a>, flags: oxc_syntax::scope::ScopeFlags) {
            if let Some(id) = &it.id {
                self.record(
                    id.name.to_string(),
                    "function",
                    it.span.start,
                    it.span.end,
                    it.declare || it.body.is_none(),
                );
            }
            walk::walk_function(self, it, flags);
        }
        fn visit_class(&mut self, it: &Class<'a>) {
            if let Some(id) = &it.id {
                self.record(
                    id.name.to_string(),
                    "class",
                    with_decorators(it.span, &it.decorators),
                    it.span.end,
                    it.declare,
                );
            }
            walk::walk_class(self, it);
        }
        fn visit_method_definition(&mut self, it: &MethodDefinition<'a>) {
            if let Some(name) = Self::key(&it.key) {
                let kind = match it.kind {
                    MethodDefinitionKind::Constructor => "constructor",
                    MethodDefinitionKind::Method => "method",
                    MethodDefinitionKind::Get => "get",
                    MethodDefinitionKind::Set => "set",
                };
                self.record(
                    name,
                    kind,
                    with_decorators(it.span, &it.decorators),
                    it.span.end,
                    it.value.body.is_none(),
                );
            }
            walk::walk_method_definition(self, it);
        }
        fn visit_property_definition(&mut self, it: &PropertyDefinition<'a>) {
            if let Some(value) = &it.value
                && let Some((_, kind, inert)) = Self::anonymous(value)
                && let Some(name) = Self::key(&it.key)
            {
                self.record(
                    name,
                    kind,
                    with_decorators(it.span, &it.decorators),
                    it.span.end,
                    inert,
                );
            }
            walk::walk_property_definition(self, it);
        }
        fn visit_object_property(&mut self, it: &ObjectProperty<'a>) {
            if (it.method || Self::anonymous(&it.value).is_some())
                && let Some(name) = Self::key(&it.key)
            {
                let kind = match &it.value {
                    Expression::ClassExpression(_) => "class",
                    _ => "method",
                };
                self.record(name, kind, it.span.start, it.span.end, false);
            }
            walk::walk_object_property(self, it);
        }
        fn visit_variable_declarator(&mut self, it: &VariableDeclarator<'a>) {
            if let Some(init) = &it.init
                && let Some(id) = it.id.get_binding_identifier()
            {
                if let Some((span, kind, inert)) = Self::anonymous(init) {
                    self.record(id.name.to_string(), kind, span.start, span.end, inert);
                } else if let Expression::ObjectExpression(object) = init {
                    self.record(
                        id.name.to_string(),
                        "object",
                        object.span.start,
                        object.span.end,
                        false,
                    );
                }
            }
            walk::walk_variable_declarator(self, it);
        }
        fn visit_assignment_expression(&mut self, it: &AssignmentExpression<'a>) {
            // `exports.handle = () => {}`, `Server.prototype.start = function () {}`,
            // `module.exports = { ... }`
            let bound = match &it.right {
                Expression::ObjectExpression(object) => Some((object.span, "object", false)),
                other => Self::anonymous(other),
            };
            if let Some((span, kind, inert)) = bound {
                let target =
                    &self.source[it.left.span().start as usize..it.left.span().end as usize];
                if !target.is_empty()
                    && target
                        .chars()
                        .all(|c| c.is_alphanumeric() || matches!(c, '_' | '$' | '.' | '#'))
                {
                    self.record(target.to_owned(), kind, span.start, span.end, inert);
                }
            }
            walk::walk_assignment_expression(self, it);
        }
        fn visit_ts_enum_declaration(&mut self, it: &TSEnumDeclaration<'a>) {
            self.record(
                it.id.name.to_string(),
                "enum",
                it.span.start,
                it.span.end,
                it.declare,
            );
            walk::walk_ts_enum_declaration(self, it);
        }
        fn visit_ts_module_declaration(&mut self, it: &TSModuleDeclaration<'a>) {
            let name = match &it.id {
                TSModuleDeclarationName::Identifier(id) => id.name.to_string(),
                TSModuleDeclarationName::StringLiteral(s) => s.value.to_string(),
            };
            self.record(name, "namespace", it.span.start, it.span.end, it.declare);
            walk::walk_ts_module_declaration(self, it);
        }
        fn visit_ts_global_declaration(&mut self, it: &TSGlobalDeclaration<'a>) {
            self.record(
                "global".to_owned(),
                "namespace",
                it.span.start,
                it.span.end,
                true,
            );
            walk::walk_ts_global_declaration(self, it);
        }
        fn visit_ts_interface_declaration(&mut self, it: &TSInterfaceDeclaration<'a>) {
            self.record(
                it.id.name.to_string(),
                "interface",
                it.span.start,
                it.span.end,
                true,
            );
            walk::walk_ts_interface_declaration(self, it);
        }
        fn visit_ts_type_alias_declaration(&mut self, it: &TSTypeAliasDeclaration<'a>) {
            self.record(
                it.id.name.to_string(),
                "type",
                it.span.start,
                it.span.end,
                true,
            );
            walk::walk_ts_type_alias_declaration(self, it);
        }
    }
    let mut collector = Collector {
        source,
        declarations: vec![],
        strings: vec![],
    };
    collector.visit_program(&parsed.program);
    Some(Outline {
        comments,
        strings: collector.strings,
        declarations: collector.declarations,
        separator: ".",
    })
}

// -------------------------------------------------------------------- Python

fn python(source: &str) -> Option<Outline> {
    use ruff_python_ast::{
        Stmt,
        visitor::{Visitor, walk_stmt},
    };
    use ruff_text_size::Ranged;

    use ruff_python_ast::token::TokenKind;
    let parsed = ruff_python_parser::parse_module(source).ok()?;
    let strings = parsed
        .tokens()
        .iter()
        .filter(|t| {
            matches!(
                t.kind(),
                TokenKind::String | TokenKind::FStringMiddle | TokenKind::TStringMiddle
            ) || (!matches!(
                t.kind(),
                TokenKind::Comment | TokenKind::Newline | TokenKind::NonLogicalNewline
            ) && source[t.range().start().to_usize()..t.range().end().to_usize()]
                .contains('\n'))
        })
        .map(|t| (t.range().start().to_usize(), t.range().end().to_usize()))
        .collect();
    let comments = parsed
        .tokens()
        .iter()
        .filter(|t| t.kind() == TokenKind::Comment)
        .map(|t| (t.range().start().to_usize(), t.range().end().to_usize()))
        .filter(|(start, end)| {
            let text = &source[*start..*end];
            // PEP 263: the encoding declaration is read before anything else.
            !(universally_significant(text)
                || text.contains("coding:")
                || text.contains("coding=")
                || text.contains("-*-"))
        })
        .collect();

    struct Collector(Vec<Item>);
    impl<'a> Visitor<'a> for Collector {
        fn visit_stmt(&mut self, stmt: &'a Stmt) {
            match stmt {
                Stmt::FunctionDef(def) => {
                    let start = def
                        .decorator_list
                        .iter()
                        .map(|d| d.range().start())
                        .min()
                        .map_or(def.range().start(), |s| s.min(def.range().start()));
                    self.0.push(Item {
                        name: def.name.to_string(),
                        kind: "function",
                        start: start.to_usize(),
                        end: def.range().end().to_usize(),
                        inert: false,
                    });
                }
                Stmt::ClassDef(def) => {
                    let start = def
                        .decorator_list
                        .iter()
                        .map(|d| d.range().start())
                        .min()
                        .map_or(def.range().start(), |s| s.min(def.range().start()));
                    self.0.push(Item {
                        name: def.name.to_string(),
                        kind: "class",
                        start: start.to_usize(),
                        end: def.range().end().to_usize(),
                        inert: false,
                    });
                }
                _ => {}
            }
            walk_stmt(self, stmt);
        }
    }
    let mut collector = Collector(vec![]);
    for stmt in &parsed.syntax().body {
        collector.visit_stmt(stmt);
    }
    Some(Outline {
        comments,
        strings,
        declarations: collector.0,
        separator: ".",
    })
}

// ---------------------------------------------------------------------- Rust

fn rust(source: &str) -> Option<Outline> {
    use ra_ap_syntax::{
        AstNode, AstToken, Edition, NodeOrToken, SourceFile, SyntaxKind, ast, ast::HasName,
    };

    let parsed = SourceFile::parse(source, Edition::Edition2024);
    if !parsed.errors().is_empty() {
        return None;
    }
    let root = parsed.tree();
    let mut comments = Vec::new();
    let mut strings = Vec::new();
    let mut declarations = Vec::new();
    // A doctest is a fenced block inside a run of doc comment lines, and each
    // line is its own token. The run is kept or blanked as one.
    let mut doc_block: Vec<(usize, usize, bool)> = Vec::new();
    let flush = |block: &mut Vec<(usize, usize, bool)>, comments: &mut Vec<(usize, usize)>| {
        if !block.iter().any(|(_, _, fence)| *fence) {
            comments.extend(block.iter().map(|(s, e, _)| (*s, *e)));
        }
        block.clear();
    };
    for element in root.syntax().descendants_with_tokens() {
        match element {
            NodeOrToken::Token(token) if token.kind() == SyntaxKind::COMMENT => {
                let text = token.text();
                let range = token.text_range();
                let range = (
                    u32::from(range.start()) as usize,
                    u32::from(range.end()) as usize,
                );
                if universally_significant(text) {
                    continue;
                }
                let doc = ast::Comment::cast(token.clone()).is_some_and(|c| c.kind().doc.is_some());
                if doc {
                    doc_block.push((range.0, range.1, text.contains("```")));
                } else {
                    flush(&mut doc_block, &mut comments);
                    comments.push(range);
                }
            }
            NodeOrToken::Token(token) if token.kind() == SyntaxKind::WHITESPACE => {}
            NodeOrToken::Token(token) => {
                flush(&mut doc_block, &mut comments);
                if matches!(
                    token.kind(),
                    SyntaxKind::STRING | SyntaxKind::BYTE_STRING | SyntaxKind::C_STRING
                ) || token.text().contains('\n')
                {
                    let range = token.text_range();
                    strings.push((
                        u32::from(range.start()) as usize,
                        u32::from(range.end()) as usize,
                    ));
                }
            }
            NodeOrToken::Node(node) => {
                let range = node.text_range();
                let (start, end) = (
                    u32::from(range.start()) as usize,
                    u32::from(range.end()) as usize,
                );
                let named = |name: Option<ast::Name>, kind: &'static str| {
                    name.map(|n| Item {
                        name: n.text().to_string(),
                        kind,
                        start,
                        end,
                        inert: false,
                    })
                };
                let declaration = if let Some(item) = ast::Fn::cast(node.clone()) {
                    named(item.name(), "function")
                } else if let Some(item) = ast::Impl::cast(node.clone()) {
                    // `impl<T> Display for Wrapper<T>`: the header is the name.
                    let header_end = item
                        .assoc_item_list()
                        .map_or(end, |l| u32::from(l.syntax().text_range().start()) as usize);
                    let header = item
                        .syntax()
                        .children_with_tokens()
                        .filter(|e| {
                            (u32::from(e.text_range().end()) as usize) <= header_end
                                && !matches!(e.kind(), SyntaxKind::COMMENT | SyntaxKind::ATTR)
                        })
                        .map(|e| e.to_string())
                        .collect::<String>();
                    Some(Item {
                        name: collapse_whitespace(&header),
                        kind: "impl",
                        start,
                        end,
                        inert: false,
                    })
                } else if let Some(item) = ast::Struct::cast(node.clone()) {
                    named(item.name(), "struct")
                } else if let Some(item) = ast::Enum::cast(node.clone()) {
                    named(item.name(), "enum")
                } else if let Some(item) = ast::Union::cast(node.clone()) {
                    named(item.name(), "union")
                } else if let Some(item) = ast::Trait::cast(node.clone()) {
                    named(item.name(), "trait")
                } else if let Some(item) = ast::TypeAlias::cast(node.clone()) {
                    named(item.name(), "type")
                } else if let Some(item) = ast::Const::cast(node.clone()) {
                    named(item.name(), "const")
                } else if let Some(item) = ast::Static::cast(node.clone()) {
                    named(item.name(), "static")
                } else if let Some(item) = ast::Module::cast(node.clone()) {
                    named(item.name(), "mod")
                } else if let Some(item) = ast::MacroRules::cast(node.clone()) {
                    named(item.name(), "macro")
                } else if let Some(item) = ast::MacroDef::cast(node.clone()) {
                    named(item.name(), "macro")
                } else {
                    None
                };
                declarations.extend(declaration);
            }
        }
    }
    flush(&mut doc_block, &mut comments);
    Some(Outline {
        comments,
        strings,
        declarations,
        separator: "::",
    })
}

// ---------------------------------------------------------------------- Ruby

fn ruby(source: &str) -> Option<Outline> {
    use ruby_prism::{
        ClassNode, DefNode, InterpolatedRegularExpressionNode, InterpolatedStringNode,
        InterpolatedSymbolNode, InterpolatedXStringNode, Location, ModuleNode,
        RegularExpressionNode, SingletonClassNode, StringNode, SymbolNode, Visit, XStringNode,
    };

    let parsed = ruby_prism::parse(source.as_bytes());
    if parsed.errors().next().is_some() {
        return None;
    }
    // Magic comments are read by the interpreter before the file runs.
    fn magic(text: &str) -> bool {
        let body = text.trim_start_matches('#').trim_start();
        if body.starts_with("-*-") {
            return true;
        }
        let Some((key, _)) = body.split_once(':') else {
            return false;
        };
        matches!(
            key.trim().to_ascii_lowercase().replace('-', "_").as_str(),
            "frozen_string_literal"
                | "encoding"
                | "coding"
                | "warn_indent"
                | "shareable_constant_value"
                | "typed"
        )
    }
    let comments = parsed
        .comments()
        .map(|c| (c.location().start_offset(), c.location().end_offset()))
        .filter(|(start, end)| {
            let text = &source[*start..*end];
            !(universally_significant(text) || magic(text))
        })
        .collect();

    struct Collector<'s> {
        source: &'s str,
        declarations: Vec<Item>,
        strings: Vec<(usize, usize)>,
    }
    impl<'s> Collector<'s> {
        /// A heredoc's node is its opener; its body sits lines below, so the
        /// literal spans from the first of its parts to the last.
        fn literal<'pr>(&mut self, parts: impl IntoIterator<Item = Option<Location<'pr>>>) {
            let mut span: Option<(usize, usize)> = None;
            for part in parts.into_iter().flatten() {
                let (s, e) = (part.start_offset(), part.end_offset());
                span = Some(span.map_or((s, e), |(a, b)| (a.min(s), b.max(e))));
            }
            self.strings.extend(span);
        }
        fn record(&mut self, name: String, kind: &'static str, location: ruby_prism::Location<'_>) {
            self.declarations.push(Item {
                name,
                kind,
                start: location.start_offset(),
                end: location.end_offset(),
                inert: false,
            });
        }
        fn text(&self, location: ruby_prism::Location<'_>) -> String {
            collapse_whitespace(&self.source[location.start_offset()..location.end_offset()])
        }
    }
    impl<'pr> Visit<'pr> for Collector<'_> {
        fn visit_string_node(&mut self, node: &StringNode<'pr>) {
            self.literal([
                node.opening_loc(),
                Some(node.content_loc()),
                node.closing_loc(),
            ]);
        }
        fn visit_interpolated_string_node(&mut self, node: &InterpolatedStringNode<'pr>) {
            let parts = node
                .parts()
                .iter()
                .map(|p| Some(p.location()))
                .collect::<Vec<_>>();
            self.literal(
                [node.opening_loc(), node.closing_loc()]
                    .into_iter()
                    .chain(parts),
            );
            ruby_prism::visit_interpolated_string_node(self, node);
        }
        fn visit_x_string_node(&mut self, node: &XStringNode<'pr>) {
            self.literal([Some(node.location())]);
        }
        fn visit_interpolated_x_string_node(&mut self, node: &InterpolatedXStringNode<'pr>) {
            let parts = node
                .parts()
                .iter()
                .map(|p| Some(p.location()))
                .collect::<Vec<_>>();
            self.literal(
                [Some(node.opening_loc()), Some(node.closing_loc())]
                    .into_iter()
                    .chain(parts),
            );
            ruby_prism::visit_interpolated_x_string_node(self, node);
        }
        fn visit_symbol_node(&mut self, node: &SymbolNode<'pr>) {
            self.literal([Some(node.location())]);
        }
        fn visit_interpolated_symbol_node(&mut self, node: &InterpolatedSymbolNode<'pr>) {
            self.literal([Some(node.location())]);
            ruby_prism::visit_interpolated_symbol_node(self, node);
        }
        fn visit_regular_expression_node(&mut self, node: &RegularExpressionNode<'pr>) {
            self.literal([Some(node.location())]);
        }
        fn visit_interpolated_regular_expression_node(
            &mut self,
            node: &InterpolatedRegularExpressionNode<'pr>,
        ) {
            self.literal([Some(node.location())]);
            ruby_prism::visit_interpolated_regular_expression_node(self, node);
        }
        fn visit_def_node(&mut self, node: &DefNode<'pr>) {
            let name = String::from_utf8_lossy(node.name().as_slice()).into_owned();
            self.record(name, "method", node.location());
            ruby_prism::visit_def_node(self, node);
        }
        fn visit_class_node(&mut self, node: &ClassNode<'pr>) {
            let name = self.text(node.constant_path().location());
            self.record(name, "class", node.location());
            ruby_prism::visit_class_node(self, node);
        }
        fn visit_module_node(&mut self, node: &ModuleNode<'pr>) {
            let name = self.text(node.constant_path().location());
            self.record(name, "module", node.location());
            ruby_prism::visit_module_node(self, node);
        }
        fn visit_singleton_class_node(&mut self, node: &SingletonClassNode<'pr>) {
            let name = format!("<<{}>", self.text(node.expression().location()));
            self.record(name, "singleton", node.location());
            ruby_prism::visit_singleton_class_node(self, node);
        }
    }
    let mut collector = Collector {
        source,
        declarations: vec![],
        strings: vec![],
    };
    collector.visit(&parsed.node());
    Some(Outline {
        comments,
        strings: collector.strings,
        declarations: collector.declarations,
        separator: ".",
    })
}

// ------------------------------------------------------- Go, Java and Kotlin

/// Every node of a tree-sitter tree, in source order.
fn tree_nodes(tree: &tree_sitter::Tree) -> Vec<tree_sitter::Node<'_>> {
    let mut out = Vec::new();
    let mut stack = vec![tree.root_node()];
    while let Some(node) = stack.pop() {
        out.push(node);
        let mut cursor = node.walk();
        let children = node.children(&mut cursor).collect::<Vec<_>>();
        stack.extend(children.into_iter().rev());
    }
    out
}

fn field_text<'t>(node: tree_sitter::Node<'t>, field: &str, source: &str) -> Option<String> {
    node.child_by_field_name(field)
        .map(|n| collapse_whitespace(&source[n.byte_range()]))
}

fn first_child_of_kind<'t>(
    node: tree_sitter::Node<'t>,
    kind: &str,
) -> Option<tree_sitter::Node<'t>> {
    let mut cursor = node.walk();
    node.named_children(&mut cursor).find(|c| c.kind() == kind)
}

fn go(source: &str) -> Option<Outline> {
    let tree = crate::go_instrumenter::parse(source).ok()?;
    let mut comments = Vec::new();
    let mut strings = Vec::new();
    let mut declarations = Vec::new();
    for node in tree_nodes(&tree) {
        let text = &source[node.byte_range()];
        match node.kind() {
            "interpreted_string_literal" | "raw_string_literal" | "rune_literal" => {
                strings.push((node.start_byte(), node.end_byte()));
            }
            "comment" => {
                // Directives the toolchain reads: `//go:embed`, `//go:build`,
                // `//export`, `//line`, and the older `// +build`.
                let directive = text.starts_with("//go:")
                    || text.starts_with("//export")
                    || text.starts_with("//line ")
                    || text.starts_with("//sys")
                    || text
                        .trim_start_matches('/')
                        .trim_start()
                        .starts_with("+build");
                if !directive && !universally_significant(text) {
                    comments.push((node.start_byte(), node.end_byte()));
                }
            }
            "function_declaration" => {
                if let Some(name) = field_text(node, "name", source) {
                    declarations.push(Item {
                        name,
                        kind: "function",
                        start: node.start_byte(),
                        end: node.end_byte(),
                        inert: false,
                    });
                }
            }
            "method_declaration" => {
                let receiver = node
                    .child_by_field_name("receiver")
                    .and_then(|list| first_child_of_kind(list, "parameter_declaration"))
                    .and_then(|p| field_text(p, "type", source))
                    .map(|t| {
                        // `*Server`, `Server[T]` -> `Server`
                        t.trim_start_matches(['*', '(', ' '])
                            .chars()
                            .take_while(|c| c.is_alphanumeric() || *c == '_' || *c == '.')
                            .collect::<String>()
                    });
                if let Some(name) = field_text(node, "name", source) {
                    declarations.push(Item {
                        name: match receiver {
                            Some(r) if !r.is_empty() => format!("{r}.{name}"),
                            _ => name,
                        },
                        kind: "method",
                        start: node.start_byte(),
                        end: node.end_byte(),
                        inert: false,
                    });
                }
            }
            "type_spec" | "type_alias" => {
                if let Some(name) = field_text(node, "name", source) {
                    declarations.push(Item {
                        name,
                        kind: "type",
                        start: node.start_byte(),
                        end: node.end_byte(),
                        inert: false,
                    });
                }
            }
            _ => {}
        }
    }
    Some(Outline {
        comments,
        strings,
        declarations,
        separator: ".",
    })
}

/// `name(Type, Type)`: overloads are different declarations and are told
/// apart by what they take, not by the order they appear in.
fn with_parameters(
    name: String,
    parameters: Option<tree_sitter::Node<'_>>,
    source: &str,
) -> String {
    let Some(parameters) = parameters else {
        return name;
    };
    let mut cursor = parameters.walk();
    let types = parameters
        .named_children(&mut cursor)
        .filter_map(|p| {
            if let Some(kind) = p.child_by_field_name("type") {
                return Some(collapse_whitespace(&source[kind.byte_range()]));
            }
            // Kotlin `name: Type` and Java `Type... name` have no type field;
            // the type is the last (Kotlin) or first (Java) named child.
            let mut inner = p.walk();
            let children = p.named_children(&mut inner).collect::<Vec<_>>();
            let kind = if p.kind() == "spread_parameter" {
                children.first()
            } else {
                children.iter().find(|c| {
                    !matches!(
                        c.kind(),
                        "identifier"
                            | "simple_identifier"
                            | "modifiers"
                            | "parameter_modifiers"
                            | "annotation"
                    )
                })
            };
            kind.map(|k| collapse_whitespace(&source[k.byte_range()]))
        })
        .collect::<Vec<_>>();
    format!("{name}({})", types.join(", "))
}

fn java(source: &str) -> Option<Outline> {
    let tree =
        crate::jvm_instrumenter::parse(source, crate::jvm_instrumenter::JvmLanguage::Java).ok()?;
    let mut comments = Vec::new();
    let mut strings = Vec::new();
    let mut declarations = Vec::new();
    for node in tree_nodes(&tree) {
        let kind = match node.kind() {
            "string_literal" | "character_literal" => {
                strings.push((node.start_byte(), node.end_byte()));
                continue;
            }
            "line_comment" | "block_comment" => {
                if !universally_significant(&source[node.byte_range()]) {
                    comments.push((node.start_byte(), node.end_byte()));
                }
                continue;
            }
            "class_declaration" => "class",
            "interface_declaration" => "interface",
            "enum_declaration" => "enum",
            "record_declaration" => "record",
            "annotation_type_declaration" => "annotation",
            "method_declaration" => "method",
            "constructor_declaration" => "constructor",
            _ => continue,
        };
        let Some(name) = field_text(node, "name", source) else {
            continue;
        };
        let name = if matches!(kind, "method" | "constructor") {
            with_parameters(name, node.child_by_field_name("parameters"), source)
        } else {
            name
        };
        declarations.push(Item {
            name,
            kind,
            start: node.start_byte(),
            end: node.end_byte(),
            inert: false,
        });
    }
    Some(Outline {
        comments,
        strings,
        declarations,
        separator: ".",
    })
}

fn kotlin(source: &str) -> Option<Outline> {
    let tree = crate::jvm_instrumenter::parse(source, crate::jvm_instrumenter::JvmLanguage::Kotlin)
        .ok()?;
    let mut comments = Vec::new();
    let mut strings = Vec::new();
    let mut declarations = Vec::new();
    for node in tree_nodes(&tree) {
        let (name, kind, inert) = match node.kind() {
            "string_literal" | "multiline_string_literal" | "character_literal" => {
                strings.push((node.start_byte(), node.end_byte()));
                continue;
            }
            "line_comment" | "block_comment" | "multiline_comment" => {
                if !universally_significant(&source[node.byte_range()]) {
                    comments.push((node.start_byte(), node.end_byte()));
                }
                continue;
            }
            "class_declaration" => (field_text(node, "name", source), "class", false),
            "object_declaration" => (field_text(node, "name", source), "object", false),
            "companion_object" => (
                Some(field_text(node, "name", source).unwrap_or_else(|| "Companion".to_owned())),
                "object",
                false,
            ),
            "function_declaration" => (
                field_text(node, "name", source).map(|n| {
                    with_parameters(
                        n,
                        first_child_of_kind(node, "function_value_parameters"),
                        source,
                    )
                }),
                "function",
                false,
            ),
            "secondary_constructor" => (
                Some(with_parameters(
                    "constructor".to_owned(),
                    first_child_of_kind(node, "function_value_parameters"),
                    source,
                )),
                "constructor",
                false,
            ),
            "property_declaration" => (
                first_child_of_kind(node, "variable_declaration")
                    .and_then(|v| first_child_of_kind(v, "identifier"))
                    .map(|id| collapse_whitespace(&source[id.byte_range()])),
                "property",
                false,
            ),
            "anonymous_initializer" => (Some("init".to_owned()), "init", false),
            "type_alias" => (
                first_child_of_kind(node, "identifier")
                    .map(|id| collapse_whitespace(&source[id.byte_range()])),
                "type",
                true,
            ),
            _ => continue,
        };
        let Some(name) = name else {
            continue;
        };
        declarations.push(Item {
            name,
            kind,
            start: node.start_byte(),
            end: node.end_byte(),
            inert,
        });
    }
    Some(Outline {
        comments,
        strings,
        declarations,
        separator: ".",
    })
}

#[cfg(test)]
mod tests {
    /// Every acknowledged assertion flow rests on these digests. If this
    /// fails, a change made declaration digests different, so every
    /// acknowledged flow in every map will read as needing acknowledgement:
    /// raise `assertion_map::BASIS_FORMAT` so each says why, and only then
    /// update the pinned value.
    #[test]
    fn declaration_digests_are_pinned_to_the_basis_format() {
        let samples = [
            (
                "a.ts",
                "// lead\nexport class A {\n  /** doc */\n  run(x: number): string {\n    const s = `a ${x}  b`; // tail\n    return s;\n  }\n}\nexport interface I { a: string }\nexport const f = (y) => y ?? 'z';\n",
            ),
            (
                "a.jsx",
                "export function View({ ok }) {\n  return <div title={ok && 'y'}>{ok ? 'yes' : 'no'}</div>;\n}\n",
            ),
            (
                "a.py",
                "# lead\nclass A:\n    def run(self, x):\n        \"\"\"doc\"\"\"\n        s = f\"a {x}  b\"  # tail\n        return s\n\ndef f(y):\n    return y or 'z'\n",
            ),
            (
                "a.rs",
                "//! crate doc\n/// doc\npub fn run(x: u8) -> u8 {\n    // inner\n    let s = \"a  b\";\n    x + s.len() as u8\n}\nmod m {\n    pub fn g() {}\n}\n",
            ),
            (
                "a.rb",
                "# frozen_string_literal: true\nclass A\n  def run(x)\n    s = \"a  b\" # tail\n    x + s.size\n  end\nend\n",
            ),
            (
                "a.go",
                "package a\n\n//go:embed x.txt\nvar x string\n\n// Run runs.\nfunc Run(y int) int {\n\treturn y + len(\"a  b\")\n}\n",
            ),
            (
                "A.java",
                "package a;\n/** doc */\npublic class A {\n  // tail\n  public int run(int x) { return x + \"a  b\".length(); }\n}\n",
            ),
            (
                "A.kt",
                "package a\n// lead\nclass A {\n    fun run(x: Int): Int = x + \"a  b\".length\n}\n",
            ),
        ];
        let mut all = String::new();
        for (path, source) in samples {
            let code = code(path, source).unwrap_or_else(|| panic!("{path} parses"));
            all.push_str(&format!("{path} {} {}", code.semantic, code.structure));
            for unit in &code.units {
                all.push_str(&format!(" {}={}", unit.path, unit.digest));
            }
            all.push('\n');
        }
        let pinned = format!("{:x}", Sha256::digest(all.as_bytes()));
        assert_eq!(
            pinned, PINNED_DECLARATION_DIGESTS,
            "declaration digests changed: raise assertion_map::BASIS_FORMAT, then update the pin\n{all}"
        );
    }
    const PINNED_DECLARATION_DIGESTS: &str =
        "e350d052c0bf53390700122e45fb4ad582d97437028c2a207b413cb1f70d5209";

    use super::*;

    fn paths(code: &Code) -> Vec<(&str, &str)> {
        code.units
            .iter()
            .skip(1)
            .map(|u| (u.kind.as_str(), u.path.as_str()))
            .collect()
    }
    fn unit<'c>(code: &'c Code, path: &str) -> &'c Unit {
        code.units
            .iter()
            .find(|u| u.path == path)
            .unwrap_or_else(|| panic!("no unit {path} in {:?}", paths(code)))
    }

    #[test]
    fn a_comment_changes_no_digest_in_any_language() {
        // Comments are the one thing a program cannot observe, and Supercov's
        // pragmas the one exception that every language shares.
        let cases: [(&str, &str, &str); 7] = [
            (
                "a.js",
                "// note\nexport function f(x) {\n  return x + 1; // why\n}\n",
                "// rewritten\nexport function f(x) {\n  return x + 1; /* changed */\n}\n",
            ),
            (
                "a.py",
                "# note\ndef f(x):\n    return x + 1  # why\n",
                "# rewritten\ndef f(x):\n    return x + 1  # changed\n",
            ),
            (
                "a.rs",
                "// note\npub fn f(x: i32) -> i32 {\n    x + 1 // why\n}\n",
                "/// A doc line without a fence.\npub fn f(x: i32) -> i32 {\n    x + 1 /* changed */\n}\n",
            ),
            (
                "a.rb",
                "# note\ndef f(x)\n  x + 1 # why\nend\n",
                "# rewritten\ndef f(x)\n  x + 1 # changed\nend\n",
            ),
            (
                "a.go",
                "package p\n\n// note\nfunc F(x int) int {\n\treturn x + 1 // why\n}\n",
                "package p\n\n// rewritten\nfunc F(x int) int {\n\treturn x + 1 /* changed */\n}\n",
            ),
            (
                "A.java",
                "// note\nclass A {\n  int f(int x) {\n    return x + 1; // why\n  }\n}\n",
                "/** Rewritten. */\nclass A {\n  int f(int x) {\n    return x + 1; /* changed */\n  }\n}\n",
            ),
            (
                "A.kt",
                "// note\nfun f(x: Int): Int {\n    return x + 1 // why\n}\n",
                "/* rewritten */\nfun f(x: Int): Int {\n    return x + 1 /* changed */\n}\n",
            ),
        ];
        for (path, before, after) in cases {
            let a = code(path, before).unwrap_or_else(|| panic!("{path} parses"));
            let b = code(path, after).unwrap();
            assert_eq!(a.semantic, b.semantic, "{path}: semantic digest");
            assert_eq!(a.structure, b.structure, "{path}: structure");
            assert_eq!(
                a.units
                    .iter()
                    .map(|u| (&u.path, &u.digest))
                    .collect::<Vec<_>>(),
                b.units
                    .iter()
                    .map(|u| (&u.path, &u.digest))
                    .collect::<Vec<_>>(),
                "{path}: unit digests"
            );
            assert!(a.units.len() >= 2, "{path}: declares something");
        }
    }

    #[test]
    fn a_comment_leaves_no_trace_wherever_it_sat() {
        // Adding a comment line, a trailing comment or an inline comment must
        // read the same as never having written it.
        let plain = code("c.js", "function f(a, b) {\n  return a + b;\n}\n").unwrap();
        for commented in [
            "// above\nfunction f(a, b) {\n  return a + b;\n}\n",
            "function f(a, b) {\n  // inside, on its own line\n  return a + b;\n}\n",
            "function f(a, b) { // trailing\n  return a + b;   // and here\n}\n",
            "function f(a, /* inline */ b) {\n  return a + /* mid */ b;\n}\n",
            "function f(a, b) {\n  return/* glued */ a + b;\n}\n",
            "function f(a, b) {\n  /* leading */ return a + b;\n}\n",
            "function f(a, b) {\n  return a + b;\n}\n// at the end, no newline",
            "function f(a, b) {\n  return a + b;\n}\n\n/* a block\n   over lines */\n",
        ] {
            let with = code("c.js", commented).unwrap();
            assert_eq!(plain.semantic, with.semantic, "{commented:?}");
            assert_eq!(
                plain.units[1].digest, with.units[1].digest,
                "f's own digest: {commented:?}"
            );
            assert_eq!(plain.units[0].digest, with.units[0].digest, "{commented:?}");
        }
        let python = code("p.py", "def f():\n    a = 1\n    return a\n").unwrap();
        let commented = code(
            "p.py",
            "def f():\n    a = 1  # set\n    # explain\n    return a\n",
        )
        .unwrap();
        assert_eq!(python.semantic, commented.semantic);
        let string = code(
            "p.py",
            "def f():\n    return '''a\n    # not a comment\n    b'''\n",
        )
        .unwrap();
        let other = code("p.py", "def f():\n    return '''a\n    b'''\n").unwrap();
        assert_ne!(string.semantic, other.semantic, "a string is not a comment");
    }

    #[test]
    fn blank_lines_and_trailing_whitespace_are_formatting_outside_strings() {
        let cases: [(&str, &str, &str); 7] = [
            (
                "b.js",
                "function f() {\n  return 1;\n}\n",
                "\nfunction f() {  \n\n  return 1;\t\n\n}\n\n",
            ),
            (
                "b.py",
                "def f():\n    a = 1\n    return a\n",
                "def f():\n    a = 1   \n\n    return a\n\n\n",
            ),
            (
                "b.rs",
                "fn f() -> i32 {\n    1\n}\n",
                "fn f() -> i32 {\n\n    1  \n}\n",
            ),
            ("b.rb", "def f\n  1\nend\n", "def f\n\n  1  \nend\n\n"),
            (
                "b.go",
                "package p\n\nfunc F() int {\n\treturn 1\n}\n",
                "package p\n\n\nfunc F() int {\n\treturn 1  \n\n}\n",
            ),
            (
                "B.java",
                "class B {\n  int f() {\n    return 1;\n  }\n}\n",
                "class B {\n\n  int f() {  \n    return 1;\n\n  }\n}\n",
            ),
            (
                "B.kt",
                "fun f(): Int {\n    return 1\n}\n",
                "fun f(): Int {\n\n    return 1   \n}\n\n",
            ),
        ];
        for (path, tidy, loose) in cases {
            let a = code(path, tidy).unwrap();
            let b = code(path, loose).unwrap();
            assert_eq!(a.semantic, b.semantic, "{path}");
            assert_eq!(
                a.units.iter().map(|u| &u.digest).collect::<Vec<_>>(),
                b.units.iter().map(|u| &u.digest).collect::<Vec<_>>(),
                "{path}"
            );
        }
        // Inside a literal, the same whitespace is the program's data.
        let literal_cases: [(&str, &str, &str); 7] = [
            ("s.js", "const t = `a\n\nb`;\n", "const t = `a\nb`;\n"),
            ("s.py", "t = '''a  \nb'''\n", "t = '''a\nb'''\n"),
            (
                "s.rs",
                "const T: &str = \"a\n\nb\";\n",
                "const T: &str = \"a\nb\";\n",
            ),
            (
                "s.rb",
                "T = <<~EOS\n  a\n\n  b\nEOS\n",
                "T = <<~EOS\n  a\n  b\nEOS\n",
            ),
            (
                "s.go",
                "package p\n\nconst T = `a\n\nb`\n",
                "package p\n\nconst T = `a\nb`\n",
            ),
            (
                "S.java",
                "class S {\n  String t = \"\"\"\n    a\n\n    b\"\"\";\n}\n",
                "class S {\n  String t = \"\"\"\n    a\n    b\"\"\";\n}\n",
            ),
            (
                "S.kt",
                "val t = \"\"\"a\n\nb\"\"\"\n",
                "val t = \"\"\"a\nb\"\"\"\n",
            ),
        ];
        for (path, with, without) in literal_cases {
            let a = code(path, with).unwrap_or_else(|| panic!("{path} parses"));
            let b = code(path, without).unwrap();
            assert_ne!(
                a.semantic, b.semantic,
                "{path}: a blank line inside a string is content"
            );
        }
    }

    #[test]
    fn erased_lines_are_named_so_positions_can_skip_them() {
        let x = code(
            "e.js",
            "// one\n\nfunction f() {\n  // two\n  return 1; // not erased: code here\n\n}\n",
        )
        .unwrap();
        assert_eq!(x.erased, [1, 2, 4, 6]);
        assert_eq!(x.code_line(3), 1, "f is the first line of code");
        assert_eq!(x.code_line(5), 2);
        assert_eq!(x.code_line(7), 3);
    }

    #[test]
    fn a_supercov_pragma_in_a_comment_is_kept() {
        let a = code("a.js", "// supercov: observes x\nlet x = 1;\n").unwrap();
        let b = code("a.js", "// supercov: observes y\nlet x = 1;\n").unwrap();
        assert_ne!(a.semantic, b.semantic);
    }

    #[test]
    fn an_edit_lands_in_its_own_declaration_only() {
        let before =
            "export function a() {\n  return 1;\n}\nexport function b() {\n  return 2;\n}\n";
        let after =
            "export function a() {\n  return 1;\n}\nexport function b() {\n  return 2 + 0;\n}\n";
        let x = code("m.js", before).unwrap();
        let y = code("m.js", after).unwrap();
        assert_eq!(unit(&x, "a").digest, unit(&y, "a").digest, "a untouched");
        assert_ne!(unit(&x, "b").digest, unit(&y, "b").digest, "b edited");
        assert_eq!(x.units[0].digest, y.units[0].digest, "top level untouched");
        assert_eq!(x.structure, y.structure);
        assert_ne!(x.semantic, y.semantic);
    }

    #[test]
    fn a_class_digest_excludes_its_methods_and_counts_them() {
        let before = "class C {\n  a() { return 1; }\n  b() { return 2; }\n}\n";
        let x = code("c.js", before).unwrap();
        assert_eq!(
            paths(&x),
            [("class", "C"), ("method", "C.a"), ("method", "C.b")]
        );
        // Editing a method body leaves the class alone.
        let y = code(
            "c.js",
            "class C {\n  a() { return 1; }\n  b() { return 3; }\n}\n",
        )
        .unwrap();
        assert_eq!(unit(&x, "C").digest, unit(&y, "C").digest);
        assert_eq!(x.structure, y.structure);
        // Adding a method changes both the class and the structure.
        let z = code(
            "c.js",
            "class C {\n  a() { return 1; }\n  b() { return 2; }\n  c() {}\n}\n",
        )
        .unwrap();
        assert_ne!(unit(&x, "C").digest, unit(&z, "C").digest);
        assert_ne!(x.structure, z.structure);
        // Renaming a method is a structural change even though the class text
        // around the placeholder is unchanged.
        let r = code(
            "c.js",
            "class C {\n  a() { return 1; }\n  d() { return 2; }\n}\n",
        )
        .unwrap();
        assert_eq!(unit(&x, "C").digest, unit(&r, "C").digest);
        assert_ne!(x.structure, r.structure);
    }

    #[test]
    fn reordering_two_methods_changes_nothing() {
        let x = code(
            "c.js",
            "class C {\n  a() { return 1; }\n  b() { return 2; }\n}\n",
        )
        .unwrap();
        let y = code(
            "c.js",
            "class C {\n  b() { return 2; }\n  a() { return 1; }\n}\n",
        )
        .unwrap();
        assert_eq!(unit(&x, "C").digest, unit(&y, "C").digest);
        assert_eq!(unit(&x, "C.a").digest, unit(&y, "C.a").digest);
        assert_eq!(x.structure, y.structure);
    }

    #[test]
    fn whitespace_is_never_blanked() {
        let x = code(
            "a.py",
            "def f(x):\n    if x:\n        return 1\n    return 2\n",
        )
        .unwrap();
        let y = code(
            "a.py",
            "def f(x):\n    if x:\n        return 1\n        return 2\n",
        )
        .unwrap();
        assert_ne!(unit(&x, "f").digest, unit(&y, "f").digest);
    }

    #[test]
    fn typescript_types_are_inert() {
        let before =
            "interface A { x: number }\ntype B = A;\nexport function f(a: A): B { return a; }\n";
        let x = code("t.ts", before).unwrap();
        assert!(unit(&x, "A").inert && unit(&x, "B").inert && !unit(&x, "f").inert);
        // Editing, adding or removing a type changes no digest a program rests on.
        let y = code("t.ts", "interface A { x: number; y: string }\ntype B = A;\ntype C = B;\nexport function f(a: A): B { return a; }\n").unwrap();
        assert_eq!(x.semantic, y.semantic);
        assert_eq!(x.structure, y.structure);
        assert_eq!(x.units[0].digest, y.units[0].digest);
        assert_eq!(unit(&x, "f").digest, unit(&y, "f").digest);
        // An enum is a value: it counts.
        let z = code("t.ts", "enum E { A }\n").unwrap();
        assert!(!unit(&z, "E").inert);
        // An overload signature has no body and is inert; the implementation is not.
        let o = code("o.ts", "export function g(a: string): void;\nexport function g(a: number): void;\nexport function g(a: unknown) {}\n").unwrap();
        let g = o
            .units
            .iter()
            .filter(|u| u.path.starts_with('g'))
            .collect::<Vec<_>>();
        assert_eq!(g.iter().filter(|u| u.inert).count(), 2, "{:?}", paths(&o));
        assert_eq!(g.iter().filter(|u| !u.inert).count(), 1);
    }

    #[test]
    fn javascript_names_what_a_function_is_bound_to() {
        let source = "const handle = async (req) => {};\nexports.run = function () {};\nconst api = {\n  get: () => {},\n  post() {},\n};\nclass S {\n  #secret() {}\n  static create() {}\n  get size() { return 1; }\n  field = () => {};\n}\nit('does a thing', () => {});\n";
        let x = code("s.js", source).unwrap();
        assert_eq!(
            paths(&x),
            [
                ("function", "handle"),
                ("function", "exports.run"),
                ("object", "api"),
                ("method", "api.get"),
                ("method", "api.post"),
                ("class", "S"),
                ("method", "S.#secret"),
                ("method", "S.create"),
                ("get", "S.size"),
                ("function", "S.field"),
            ]
        );
        // An anonymous callback is part of whatever encloses it.
        assert_eq!(x.unit_at(13, 1), 0);
    }

    #[test]
    fn decorators_belong_to_what_they_decorate() {
        let py = code("d.py", "@app.route('/x')\ndef handler():\n    return 1\n").unwrap();
        assert_eq!(
            (unit(&py, "handler").line, unit(&py, "handler").column),
            (1, 1)
        );
        let py2 = code("d.py", "@app.route('/y')\ndef handler():\n    return 1\n").unwrap();
        assert_ne!(unit(&py, "handler").digest, unit(&py2, "handler").digest);
        assert_eq!(
            py.units[0].digest, py2.units[0].digest,
            "the route lives in the handler"
        );

        let ts = code("d.ts", "class C {\n  @Get('/x')\n  handle() {}\n}\n").unwrap();
        assert_eq!(unit(&ts, "C.handle").line, 2);
        let java = code("D.java", "class D {\n  @Test\n  void t() {}\n}\n").unwrap();
        assert_eq!(unit(&java, "D.t()").line, 2);
        let rust = code("d.rs", "#[test]\nfn t() {}\n").unwrap();
        assert_eq!(unit(&rust, "t").line, 1);
    }

    #[test]
    fn rust_paths_use_the_language_s_separator_and_name_impls_by_header() {
        let source = "pub struct W<T>(T);\nimpl<T: std::fmt::Debug> std::fmt::Display for W<T> {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { Ok(()) }\n}\nimpl<T> W<T> {\n    pub fn new(t: T) -> Self { W(t) }\n}\n#[cfg(test)]\nmod tests {\n    #[test]\n    fn it_works() {}\n}\n";
        let x = code("w.rs", source).unwrap();
        assert_eq!(
            paths(&x),
            [
                ("struct", "W"),
                (
                    "impl",
                    "impl<T: std::fmt::Debug> std::fmt::Display for W<T>"
                ),
                (
                    "function",
                    "impl<T: std::fmt::Debug> std::fmt::Display for W<T>::fmt"
                ),
                ("impl", "impl<T> W<T>"),
                ("function", "impl<T> W<T>::new"),
                ("mod", "tests"),
                ("function", "tests::it_works"),
            ]
        );
    }

    #[test]
    fn a_rust_doctest_is_code_and_a_plain_doc_comment_is_not() {
        let a = code("l.rs", "/// Adds one.\npub fn f(x: i32) -> i32 { x + 1 }\n").unwrap();
        let b = code(
            "l.rs",
            "/// Adds exactly one.\npub fn f(x: i32) -> i32 { x + 1 }\n",
        )
        .unwrap();
        assert_eq!(unit(&a, "f").digest, unit(&b, "f").digest);
        let c = code(
            "l.rs",
            "/// ```\n/// assert_eq!(f(1), 2);\n/// ```\npub fn f(x: i32) -> i32 { x + 1 }\n",
        )
        .unwrap();
        let d = code(
            "l.rs",
            "/// ```\n/// assert_eq!(f(1), 3);\n/// ```\npub fn f(x: i32) -> i32 { x + 1 }\n",
        )
        .unwrap();
        assert_ne!(unit(&c, "f").digest, unit(&d, "f").digest);
    }

    #[test]
    fn ruby_keeps_magic_comments_and_names_reopened_classes_apart() {
        let a = code(
            "m.rb",
            "# frozen_string_literal: true\nclass A\n  def go; end\nend\n",
        )
        .unwrap();
        let b = code(
            "m.rb",
            "# frozen_string_literal: false\nclass A\n  def go; end\nend\n",
        )
        .unwrap();
        assert_ne!(a.semantic, b.semantic, "string mutability is behaviour");
        let c = code("m.rb", "# a note\nclass A\n  def go; end\nend\n").unwrap();
        let d = code("m.rb", "# another note\nclass A\n  def go; end\nend\n").unwrap();
        assert_eq!(c.semantic, d.semantic);
        let x = code("r.rb", "module M\n  class A\n    def go; end\n    class << self\n      def make; end\n    end\n  end\nend\nclass A\n  def again; end\nend\n").unwrap();
        assert_eq!(
            paths(&x),
            [
                ("module", "M"),
                ("class", "M.A"),
                ("method", "M.A.go"),
                ("singleton", "M.A.<<self>"),
                ("method", "M.A.<<self>.make"),
                ("class", "A"),
                ("method", "A.again"),
            ]
        );
    }

    #[test]
    fn go_keeps_directives_and_names_methods_by_receiver() {
        let a = code(
            "e.go",
            "package p\n\nimport _ \"embed\"\n\n//go:embed a.txt\nvar data string\n",
        )
        .unwrap();
        let b = code(
            "e.go",
            "package p\n\nimport _ \"embed\"\n\n//go:embed b.txt\nvar data string\n",
        )
        .unwrap();
        assert_ne!(
            a.semantic, b.semantic,
            "the embed directive chooses the data"
        );
        let x = code("s.go", "package p\n\ntype Server struct{}\n\nfunc (s *Server) Start() error { return nil }\n\nfunc New() *Server { return &Server{} }\n").unwrap();
        assert_eq!(
            paths(&x),
            [
                ("type", "Server"),
                ("method", "Server.Start"),
                ("function", "New")
            ]
        );
    }

    #[test]
    fn jvm_overloads_are_named_by_their_parameters() {
        let java = code(
            "O.java",
            "class O {\n  void f(String s) {}\n  void f(int n, String... rest) {}\n  O() {}\n}\n",
        )
        .unwrap();
        assert_eq!(
            paths(&java),
            [
                ("class", "O"),
                ("method", "O.f(String)"),
                ("method", "O.f(int, String)"),
                ("constructor", "O.O()"),
            ]
        );
        let kotlin = code("K.kt", "class K(val x: Int) {\n    init { println(x) }\n    val y: Int get() = x\n    fun f(s: String) {}\n    fun f(n: Int) {}\n    constructor(s: String) : this(s.length)\n    companion object {\n        fun make() = K(1)\n    }\n}\ntypealias Alias = K\n").unwrap();
        assert_eq!(
            paths(&kotlin),
            [
                ("class", "K"),
                ("init", "K.init"),
                ("property", "K.y"),
                ("function", "K.f(String)"),
                ("function", "K.f(Int)"),
                ("constructor", "K.constructor(String)"),
                ("object", "K.Companion"),
                ("function", "K.Companion.make()"),
                ("type", "Alias"),
            ]
        );
        assert!(unit(&kotlin, "Alias").inert);
    }

    #[test]
    fn same_named_declarations_are_numbered_in_order() {
        let x = code("p.py", "def f():\n    return 1\ndef f():\n    return 2\n").unwrap();
        assert_eq!(paths(&x), [("function", "f"), ("function", "f#2")]);
    }

    #[test]
    fn unit_at_finds_the_innermost_holder() {
        let source = "const k = 1;\nclass C {\n  a() {\n    return k;\n  }\n}\nfunction b() {}\n";
        let x = code("u.js", source).unwrap();
        assert_eq!(x.units[x.unit_at(1, 1)].path, "");
        assert_eq!(x.units[x.unit_at(2, 1)].path, "C");
        assert_eq!(x.units[x.unit_at(4, 5)].path, "C.a");
        assert_eq!(
            x.units[x.unit_at(6, 1)].path,
            "C",
            "the closing brace is the class's"
        );
        assert_eq!(x.units[x.unit_at(7, 1)].path, "b");
        assert_eq!(x.units[x.unit_at(7, 16)].path, "", "past b's end");
        assert_eq!(
            x.ancestors(x.unit_at(4, 5))
                .map(|i| x.units[i].path.clone())
                .collect::<Vec<_>>(),
            ["C.a", "C", ""]
        );
    }

    #[test]
    fn positions_are_one_based_byte_columns_like_anchors() {
        let x = code("p.js", "const é = 1; function f() {}\n").unwrap();
        let f = unit(&x, "f");
        assert_eq!((f.line, f.column), (1, 15), "é is two bytes");
        assert_eq!((f.end_line, f.end_column), (1, 30), "end is exclusive");
    }

    #[test]
    fn an_unparsable_or_unknown_file_has_no_view() {
        assert!(code("a.js", "function (").is_none());
        assert!(code("data.json", "{}").is_none());
        assert!(code("README.md", "# hi").is_none());
    }

    #[test]
    fn a_top_level_edit_changes_the_file_unit_and_only_it() {
        // Adding a top-level binding can shadow a name every function in the
        // file uses; the file unit is what carries that.
        let x = code("t.js", "export function f() { return g; }\n").unwrap();
        let y = code("t.js", "const g = 1;\nexport function f() { return g; }\n").unwrap();
        assert_ne!(x.units[0].digest, y.units[0].digest);
        assert_eq!(unit(&x, "f").digest, unit(&y, "f").digest);
        assert_eq!(x.structure, y.structure);
    }
}
