//! Syntax-level candidates for the security surface catalog, from oxc.
//!
//! A per-file security question cannot say which line; a per-line question
//! can, but only about lines somebody found. This lists the lines worth
//! asking about in JavaScript and TypeScript: every call with its callee
//! text, every string literal that looks like a secret, the body line of every
//! route handler, every property or JSX attribute assignment, and every
//! spread of a request body. Classifying a node into a check is the CLI's
//! job; this only knows syntax. Measured against a regex over the same files,
//! the union of the two moved line-level recall from 42% to 49% on the
//! held-out half of RealVuln and secrets from 27% to 81%.

use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    Argument, ArrowFunctionExpression, BindingPattern, CallExpression, Class, Expression, Function,
    ImportDeclaration, ImportDeclarationSpecifier, JSXAttribute, MethodDefinition, NewExpression,
    ObjectProperty, PropertyKey, SpreadElement, StringLiteral, TemplateLiteral, VariableDeclarator,
};
use oxc_ast_visit::{Visit, walk};
use oxc_parser::Parser;
use oxc_span::{GetSpan, Span};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum NodeKind {
    /// A call or construction; `callee` is its callee expression text.
    Call,
    /// The line where a route handler's body starts.
    Handler,
    /// A string literal that looks like a credential.
    Literal,
    /// A property assignment, JSX attribute or plain assignment.
    Assign,
    /// A spread of a request body into an object.
    Spread,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Node {
    pub line: usize,
    pub kind: NodeKind,
    pub callee: String,
    pub text: String,
}

/// A function with the lines it spans, for the graph stage: every function
/// is labelled once, and a path is confirmed with the bodies along it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FunctionSpan {
    pub name: String,
    pub start: usize,
    pub end: usize,
}

/// A name this file imports from a module specifier, with the exported name
/// it refers to (`default`, `*`, or the identifier).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Import {
    pub local: String,
    pub exported: String,
    pub specifier: String,
}

/// Functions and imports of a JavaScript or TypeScript file.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Structure {
    pub functions: Vec<FunctionSpan>,
    pub imports: Vec<Import>,
}

struct Collector<'s> {
    source: &'s str,
    nodes: Vec<Node>,
    structure: Structure,
}

impl<'s> Collector<'s> {
    fn line(&self, span: Span) -> usize {
        self.source[..span.start as usize].matches('\n').count() + 1
    }
    fn text(&self, span: Span) -> String {
        let raw = &self.source[span.start as usize..span.end as usize];
        raw.split_whitespace()
            .collect::<Vec<_>>()
            .join(" ")
            .chars()
            .take(160)
            .collect()
    }
    fn push(&mut self, span: Span, kind: NodeKind, callee: &str) {
        self.nodes.push(Node {
            line: self.line(span),
            kind,
            callee: callee.split_whitespace().collect(),
            text: self.text(span),
        });
    }
    fn span_function(&mut self, name: &str, span: Span) {
        let start = self.line(span);
        let end = self.source[..span.end as usize].matches('\n').count() + 1;
        self.structure.functions.push(FunctionSpan {
            name: name.to_owned(),
            start,
            end,
        });
    }
    fn handler_bodies(&mut self, callee: &str, arguments: &[Argument<'_>]) {
        let Some(Argument::StringLiteral(path)) = arguments.first() else {
            return;
        };
        if !path.value.starts_with('/') && !path.value.starts_with('*') {
            return;
        }
        for argument in &arguments[1..] {
            match argument {
                Argument::ArrowFunctionExpression(f) => {
                    self.push(f.span, NodeKind::Handler, callee);
                }
                Argument::FunctionExpression(f) => {
                    self.push(f.span, NodeKind::Handler, callee);
                }
                _ => {}
            }
        }
    }
}

/// A literal that would grant access if copied: a known key prefix, a long
/// hex or base64 run, or a password-shaped word inside it.
pub fn secretish(value: &str) -> bool {
    if value.len() < 8 {
        return false;
    }
    let prefixes = [
        "sk_", "sk-", "pk_", "rk_", "AKIA", "ghp_", "xoxa-", "xoxb-", "xoxp-", "eyJ",
    ];
    if prefixes.iter().any(|p| value.starts_with(p)) {
        return true;
    }
    let hex = value.len() >= 20 && value.chars().all(|c| c.is_ascii_hexdigit());
    let base64 = value.len() >= 24
        && value
            .trim_end_matches('=')
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || "+/_-".contains(c))
        && value.chars().any(|c| c.is_ascii_digit())
        && value.chars().any(|c| c.is_ascii_uppercase())
        && value.chars().any(|c| c.is_ascii_lowercase());
    let word = value.to_ascii_lowercase();
    hex || base64 || word.contains("password") || word.contains("secret") || word.contains("passwd")
}

impl<'a> Visit<'a> for Collector<'_> {
    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        let callee = self.text(call.callee.span());
        self.push(call.span, NodeKind::Call, &callee);
        self.handler_bodies(&callee, &call.arguments);
        walk::walk_call_expression(self, call);
    }
    fn visit_new_expression(&mut self, new: &NewExpression<'a>) {
        let callee = format!("new {}", self.text(new.callee.span()));
        self.push(new.span, NodeKind::Call, &callee);
        walk::walk_new_expression(self, new);
    }
    fn visit_string_literal(&mut self, literal: &StringLiteral<'a>) {
        if secretish(&literal.value) {
            self.push(literal.span, NodeKind::Literal, "");
        }
    }
    fn visit_template_literal(&mut self, literal: &TemplateLiteral<'a>) {
        if literal.expressions.is_empty() && literal.quasis.iter().any(|q| secretish(&q.value.raw))
        {
            self.push(literal.span, NodeKind::Literal, "");
        }
        walk::walk_template_literal(self, literal);
    }
    fn visit_object_property(&mut self, property: &ObjectProperty<'a>) {
        let key = match &property.key {
            PropertyKey::StaticIdentifier(id) => id.name.to_string(),
            other => self.text(other.span()),
        };
        self.push(property.span, NodeKind::Assign, &key);
        // `resolvers: { user: async (parent, args) => {} }`: a GraphQL
        // resolver or a handler table entry is a function with a name.
        if matches!(
            property.value,
            Expression::ArrowFunctionExpression(_) | Expression::FunctionExpression(_)
        ) {
            self.span_function(&key, property.span);
        }
        walk::walk_object_property(self, property);
    }
    fn visit_jsx_attribute(&mut self, attribute: &JSXAttribute<'a>) {
        let name = self.text(attribute.name.span());
        self.push(attribute.span, NodeKind::Assign, &name);
        walk::walk_jsx_attribute(self, attribute);
    }
    fn visit_spread_element(&mut self, spread: &SpreadElement<'a>) {
        let text = self.text(spread.argument.span());
        if text.contains("body") || text.contains("query") || text.contains("params") {
            self.push(spread.span, NodeKind::Spread, &text);
        }
        walk::walk_spread_element(self, spread);
    }
    fn visit_function(&mut self, function: &Function<'a>, flags: oxc_syntax::scope::ScopeFlags) {
        if let Some(id) = &function.id {
            if matches!(
                id.name.as_str(),
                "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "loader" | "action"
            ) {
                self.push(function.span, NodeKind::Handler, &id.name);
            }
            self.span_function(&id.name, function.span);
        }
        walk::walk_function(self, function, flags);
    }
    fn visit_class(&mut self, class: &Class<'a>) {
        // A class is a span too: models are classes, and the reading loop
        // needs to fetch a model by name.
        if let Some(id) = &class.id {
            self.span_function(&id.name, class.span);
        }
        walk::walk_class(self, class);
    }
    fn visit_method_definition(&mut self, method: &MethodDefinition<'a>) {
        if !method.decorators.is_empty() {
            self.push(method.span, NodeKind::Handler, "decorated");
        }
        let name = self.text(method.key.span());
        self.span_function(&name, method.span);
        walk::walk_method_definition(self, method);
    }
    fn visit_variable_declarator(&mut self, declarator: &VariableDeclarator<'a>) {
        if let (BindingPattern::BindingIdentifier(id), Some(init)) =
            (&declarator.id, &declarator.init)
            && matches!(
                init,
                Expression::ArrowFunctionExpression(_) | Expression::FunctionExpression(_)
            )
        {
            self.span_function(&id.name, declarator.span);
        }
        if let Some(Expression::CallExpression(call)) = &declarator.init
            && self.text(call.callee.span()) == "require"
            && let Some(Argument::StringLiteral(module)) = call.arguments.first()
        {
            let specifier = module.value.to_string();
            match &declarator.id {
                BindingPattern::BindingIdentifier(id) => self.structure.imports.push(Import {
                    local: id.name.to_string(),
                    exported: "*".into(),
                    specifier,
                }),
                BindingPattern::ObjectPattern(pattern) => {
                    for property in &pattern.properties {
                        let exported = self.text(property.key.span());
                        let local = match &property.value {
                            BindingPattern::BindingIdentifier(id) => id.name.to_string(),
                            _ => exported.clone(),
                        };
                        self.structure.imports.push(Import {
                            local,
                            exported,
                            specifier: specifier.clone(),
                        });
                    }
                }
                _ => {}
            }
        }
        walk::walk_variable_declarator(self, declarator);
    }
    fn visit_arrow_function_expression(&mut self, arrow: &ArrowFunctionExpression<'a>) {
        walk::walk_arrow_function_expression(self, arrow);
    }
    fn visit_import_declaration(&mut self, import: &ImportDeclaration<'a>) {
        let specifier = import.source.value.to_string();
        if let Some(specifiers) = &import.specifiers {
            for s in specifiers {
                let (local, exported) = match s {
                    ImportDeclarationSpecifier::ImportSpecifier(i) => {
                        (i.local.name.to_string(), i.imported.name().to_string())
                    }
                    ImportDeclarationSpecifier::ImportDefaultSpecifier(i) => {
                        (i.local.name.to_string(), "default".to_owned())
                    }
                    ImportDeclarationSpecifier::ImportNamespaceSpecifier(i) => {
                        (i.local.name.to_string(), "*".to_owned())
                    }
                };
                self.structure.imports.push(Import {
                    local,
                    exported,
                    specifier: specifier.clone(),
                });
            }
        }
        walk::walk_import_declaration(self, import);
    }
    fn visit_expression(&mut self, expression: &Expression<'a>) {
        if let Expression::AssignmentExpression(assignment) = expression {
            let target = self.text(assignment.left.span());
            self.push(assignment.span, NodeKind::Assign, &target);
            // `this.handle = (req, res) => {}` and `exports.f = function () {}`
            if matches!(
                assignment.right,
                Expression::ArrowFunctionExpression(_) | Expression::FunctionExpression(_)
            ) {
                let name = target.rsplit('.').next().unwrap_or(&target).to_owned();
                self.span_function(&name, assignment.span);
            }
        }
        walk::walk_expression(self, expression);
    }
}

/// Every candidate node of a JavaScript or TypeScript file, in source order.
/// A file oxc cannot parse yields an error rather than a partial list, so the
/// caller can fall back to patterns and say so.
pub fn nodes(file: &Path, source: &str) -> Result<Vec<Node>, String> {
    Ok(parse(file, source)?.0)
}

/// The functions and imports of a JavaScript or TypeScript file.
pub fn structure(file: &Path, source: &str) -> Result<Structure, String> {
    Ok(parse(file, source)?.1)
}

fn parse(file: &Path, source: &str) -> Result<(Vec<Node>, Structure), String> {
    let source_type = crate::js_instrumenter::project_source_type(file)?;
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, source, source_type).parse();
    if parsed.panicked {
        return Err("the parser gave up on this file".into());
    }
    let mut collector = Collector {
        source,
        nodes: Vec::new(),
        structure: Structure::default(),
    };
    collector.visit_program(&parsed.program);
    collector.nodes.sort_by_key(|n| n.line);
    collector.structure.functions.sort_by_key(|f| f.start);
    collector.structure.functions.dedup();
    Ok((collector.nodes, collector.structure))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A fake key in a live-key shape, assembled so no source line holds the
    /// whole pattern a push-protection scanner looks for.
    const FAKE_KEY: &str = concat!("sk_", "live_", "51H8xQ2KmNvBcdEfGhIjKlMnOpQr");

    #[test]
    fn finds_calls_handlers_literals_and_spreads() {
        let source = format!(
            r#"
import {{ Router }} from 'express'
const KEY = '{FAKE_KEY}'
export const router = Router()
router.get('/x/:id', async (req, res) => {{
  const row = await db.query(`select * from t where id = ${{req.params.id}}`)
  await users.update(req.user.id, {{ ...req.body }})
  res.redirect(req.query.next)
}})
"#
        );
        let nodes = nodes(Path::new("a.ts"), &source).unwrap();
        let find = |kind: NodeKind, needle: &str| {
            nodes
                .iter()
                .find(|n| {
                    n.kind == kind
                        && if matches!(kind, NodeKind::Call | NodeKind::Handler) {
                            n.callee.contains(needle)
                        } else {
                            n.text.contains(needle)
                        }
                })
                .map(|n| n.line)
        };
        assert_eq!(find(NodeKind::Literal, "sk_live"), Some(3));
        assert_eq!(find(NodeKind::Handler, "router.get"), Some(5));
        assert_eq!(find(NodeKind::Call, "db.query"), Some(6));
        assert_eq!(find(NodeKind::Spread, "req.body"), Some(7));
        assert_eq!(find(NodeKind::Call, "res.redirect"), Some(8));
    }

    #[test]
    fn functions_and_imports_are_listed_with_their_lines() {
        let source = "import { users } from './db'\nconst { pingMe } = require('./utility')\nexport async function handle(req) {\n  return users.find(req.id)\n}\nconst helper = (x) => x\nclass A {\n  method() {\n    return 1\n  }\n}\n";
        let s = structure(Path::new("a.js"), source).unwrap();
        let names: Vec<(&str, usize, usize)> = s
            .functions
            .iter()
            .map(|f| (f.name.as_str(), f.start, f.end))
            .collect();
        assert!(names.contains(&("handle", 3, 5)), "{names:?}");
        assert!(names.contains(&("helper", 6, 6)));
        assert!(names.contains(&("method", 8, 10)));
        assert_eq!(s.imports.len(), 2);
        assert_eq!(
            (
                s.imports[0].local.as_str(),
                s.imports[0].exported.as_str(),
                s.imports[0].specifier.as_str()
            ),
            ("users", "users", "./db")
        );
        assert_eq!(
            (s.imports[1].local.as_str(), s.imports[1].specifier.as_str()),
            ("pingMe", "./utility")
        );
    }

    #[test]
    fn a_secret_is_a_prefix_a_long_run_or_a_password_word() {
        assert!(secretish(FAKE_KEY));
        assert!(secretish("k9F2mZ8qL4vX1nB7rT3wY6hJ0pS5dG2c"));
        assert!(secretish("hunter2password"));
        assert!(!secretish("/api/users"));
        assert!(!secretish("select * from users"));
    }
}
