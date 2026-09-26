//! Runner/build/project discovery for zero-configuration JavaScript suites.

use std::{
    collections::{BTreeMap, BTreeSet, HashMap},
    fs, io,
    path::{Path, PathBuf},
};

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    Argument, ArrayExpressionElement, BinaryExpression, CallExpression, Expression,
    ImportDeclarationSpecifier, ImportExpression, ImportOrExportKind, Program, Statement,
    StaticMemberExpression,
};
use oxc_ast_visit::{Visit, walk};
use oxc_parser::Parser;
use oxc_syntax::operator::BinaryOperator;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::source_discovery::{
    DiscoveredSourceScope, SourceDiscoveryError, SourceLimitation, SourceScope,
    discover_source_scope,
};

const PLAYWRIGHT_CONFIGS: &[&str] = &[
    "playwright.config.ts",
    "playwright.config.mts",
    "playwright.config.js",
    "playwright.config.mjs",
    "playwright.config.cts",
    "playwright.config.cjs",
];
const VITEST_CONFIGS: &[&str] = &[
    "vitest.config.ts",
    "vitest.config.mts",
    "vitest.config.js",
    "vitest.config.mjs",
    "vitest.config.cts",
    "vitest.config.cjs",
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.js",
    "vite.config.mjs",
];
const JEST_CONFIGS: &[&str] = &[
    "jest.config.ts",
    "jest.config.mts",
    "jest.config.js",
    "jest.config.mjs",
    "jest.config.cts",
    "jest.config.cjs",
];
const TEST_DIRECTORIES: &[&str] = &["test", "tests", "e2e", "spec", "specs"];
const GENERIC_COMMAND_TERMS: &[&str] = &[
    "bin", "bun", "exec", "node", "npm", "pnpm", "run", "script", "test", "tests", "yarn",
];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum BuildAdapter {
    Vite,
    Generic,
    Direct,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CoverageProject {
    pub root: PathBuf,
    pub source_roots: Vec<String>,
    pub source_files: Vec<String>,
    pub source_scope: SourceScope,
    pub source_limitations: Vec<SourceLimitation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub playwright_config: Option<PathBuf>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vitest_config: Option<PathBuf>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub jest_config: Option<PathBuf>,
    pub uses_jest: bool,
    /// The tests bundle sources for a browser through a runner Supercov has
    /// no adapter for -- karma, testem, airtap, zuul, mochify -- so each
    /// script-style file carries the runtime the page otherwise lacks.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub browser_runner: bool,
    /// The build compiles each source into another directory -- tsc, tshy,
    /// babel, swc -- where a later step may bundle the output, so an
    /// instrumented source imports the runtime by absolute path.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub relocating_build: bool,
    pub playwright_module: String,
    pub playwright_test_export: String,
    pub playwright_exports: Vec<String>,
    pub build_adapter: BuildAdapter,
    pub build_command: Vec<String>,
    pub build_environment: BTreeMap<String, String>,
}

#[derive(Debug)]
pub enum ProjectDiscoveryError {
    Source(SourceDiscoveryError),
    Io { path: PathBuf, source: io::Error },
    NoSourceFiles,
}

impl From<SourceDiscoveryError> for ProjectDiscoveryError {
    fn from(value: SourceDiscoveryError) -> Self {
        Self::Source(value)
    }
}

impl std::fmt::Display for ProjectDiscoveryError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Source(error) => write!(formatter, "{error}"),
            Self::Io { path, source } => write!(formatter, "{}: {source}", path.display()),
            Self::NoSourceFiles => write!(
                formatter,
                "No application source files were discovered. If your sources live somewhere unusual, set SUPERCOV_SOURCE_ROOTS=src,app. Alternatively, Supercov may not support your project layout or test framework yet — if so, please open an issue or PR: https://github.com/supercorp-ai/supercov"
            ),
        }
    }
}

impl std::error::Error for ProjectDiscoveryError {}

fn package_json(root: &Path) -> Value {
    fs::read(root.join("package.json"))
        .ok()
        .and_then(|contents| serde_json::from_slice(&contents).ok())
        .unwrap_or(Value::Null)
}

fn script<'a>(manifest: &'a Value, name: &str) -> Option<&'a str> {
    manifest.get("scripts")?.get(name)?.as_str()
}

fn regular_file(path: &Path) -> bool {
    fs::symlink_metadata(path)
        .map(|metadata| metadata.file_type().is_file())
        .unwrap_or(false)
}

fn source_file(path: &Path) -> bool {
    let name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("");
    let lower = name.to_ascii_lowercase();
    [
        ".js", ".jsx", ".ts", ".tsx", ".cjs", ".cjsx", ".cts", ".ctsx", ".mjs", ".mjsx", ".mts",
        ".mtsx",
    ]
    .iter()
    .any(|extension| lower.ends_with(extension))
}

fn read_directory(path: &Path) -> Result<Vec<fs::DirEntry>, ProjectDiscoveryError> {
    let mut entries = fs::read_dir(path)
        .map_err(|source| ProjectDiscoveryError::Io {
            path: path.to_owned(),
            source,
        })?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|source| ProjectDiscoveryError::Io {
            path: path.to_owned(),
            source,
        })?;
    entries.sort_by_key(fs::DirEntry::file_name);
    Ok(entries)
}

fn parse_program<'a>(
    allocator: &'a Allocator,
    path: &Path,
    source: &'a str,
) -> Option<Program<'a>> {
    let source_type = crate::js_instrumenter::project_source_type(path).ok()?;
    let parsed = Parser::new(allocator, source, source_type).parse();
    parsed.errors.is_empty().then_some(parsed.program)
}

#[derive(Debug, Clone)]
struct TestApiCandidate {
    module: String,
    score: usize,
    test_export: Option<String>,
    exports: Vec<String>,
}

fn imported_test_apis(path: &Path, source: &str) -> Vec<TestApiCandidate> {
    let allocator = Allocator::default();
    let Some(program) = parse_program(&allocator, path, source) else {
        return Vec::new();
    };
    // Aggregate per module across the whole file: a facade's helpers are
    // often imported in their own statement (`import { createTestProduct }
    // from "@acme/fixtures"`), and those names must reach the generated shim
    // even though that statement alone carries no test-API signal.
    let mut by_module = BTreeMap::<String, TestApiCandidate>::new();
    for statement in &program.body {
        let Statement::ImportDeclaration(declaration) = statement else {
            continue;
        };
        if declaration.import_kind == ImportOrExportKind::Type {
            continue;
        }
        let module = declaration.source.value.to_string();
        let candidate = by_module
            .entry(module.clone())
            .or_insert_with(|| TestApiCandidate {
                module,
                score: 0,
                test_export: None,
                exports: Vec::new(),
            });
        for specifier in declaration.specifiers.iter().flatten() {
            let ImportDeclarationSpecifier::ImportSpecifier(specifier) = specifier else {
                continue;
            };
            if specifier.import_kind == ImportOrExportKind::Type {
                continue;
            }
            let imported = specifier.imported.name().to_string();
            let local = specifier.local.name.as_str();
            candidate.exports.push(imported.clone());
            if local == "test" {
                candidate.score += 20;
                candidate.test_export = Some(imported.clone());
            } else if imported.to_ascii_lowercase().ends_with("test") {
                candidate.score += 8;
            }
            if local == "expect" || imported == "expect" {
                candidate.score += 10;
            }
        }
    }
    by_module
        .into_values()
        .filter(|candidate| candidate.score > 0)
        .map(|mut candidate| {
            if candidate.module == "@playwright/test" {
                candidate.score += 100;
            } else if candidate.module.to_ascii_lowercase().contains("playwright") {
                candidate.score += 5;
            }
            candidate
        })
        .collect()
}

fn test_api_candidates(directory: &Path, output: &mut Vec<TestApiCandidate>) {
    let Ok(entries) = read_directory(directory) else {
        return;
    };
    for entry in entries {
        let name = entry.file_name();
        let Some(name) = name.to_str() else { continue };
        if name == "node_modules" || name == "results" || name.starts_with('.') {
            continue;
        }
        let path = entry.path();
        let Ok(file_type) = entry.file_type() else {
            continue;
        };
        if file_type.is_symlink() {
            continue;
        }
        if file_type.is_dir() {
            test_api_candidates(&path, output);
        } else if file_type.is_file()
            && source_file(&path)
            && let Ok(source) = fs::read_to_string(&path)
        {
            output.extend(imported_test_apis(&path, &source));
        }
    }
}

#[derive(Debug, Clone)]
struct PlaywrightAdapter {
    module: String,
    test_export: String,
    exports: Vec<String>,
}

fn discover_playwright_adapter(root: &Path) -> PlaywrightAdapter {
    let mut candidates = Vec::new();
    for directory in TEST_DIRECTORIES {
        test_api_candidates(&root.join(directory), &mut candidates);
    }
    let mut scores = HashMap::<String, usize>::new();
    for candidate in &candidates {
        *scores.entry(candidate.module.clone()).or_default() += candidate.score;
    }
    let module = scores
        .into_iter()
        .min_by(|(left_module, left_score), (right_module, right_score)| {
            right_score
                .cmp(left_score)
                .then_with(|| left_module.cmp(right_module))
        })
        .map(|(module, _)| module)
        .unwrap_or_else(|| "@playwright/test".into());
    let matching = candidates
        .iter()
        .filter(|candidate| candidate.module == module)
        .collect::<Vec<_>>();
    let test_export = matching
        .iter()
        .filter_map(|candidate| {
            candidate
                .test_export
                .as_ref()
                .map(|export| (candidate.score, export))
        })
        .max_by_key(|(score, _)| *score)
        .map(|(_, export)| export.clone())
        .unwrap_or_else(|| "test".into());
    let exports = matching
        .iter()
        .flat_map(|candidate| candidate.exports.iter().cloned())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect();
    PlaywrightAdapter {
        module,
        test_export,
        exports,
    }
}

fn nested_playwright_configs(root: &Path) -> Vec<PathBuf> {
    fn visit(directory: &Path, depth: usize, found: &mut Vec<PathBuf>) {
        if depth > 4 {
            return;
        }
        let Ok(entries) = read_directory(directory) else {
            return;
        };
        for entry in entries {
            let name = entry.file_name();
            let Some(name) = name.to_str() else { continue };
            if name.starts_with('.') || name == "node_modules" {
                continue;
            }
            let path = entry.path();
            let Ok(file_type) = entry.file_type() else {
                continue;
            };
            if file_type.is_symlink() {
                continue;
            }
            if file_type.is_dir() {
                visit(&path, depth + 1, found);
            } else if file_type.is_file() && playwright_config_name(name) {
                found.push(path);
            }
        }
    }

    let mut found = Vec::new();
    for directory in ["test", "tests", "e2e"] {
        visit(&root.join(directory), 0, &mut found);
    }
    found.sort();
    found
}

fn playwright_config_name(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    if !lower.starts_with("playwright") || !lower.contains(".config.") {
        return false;
    }
    source_file(Path::new(name))
        && lower[..lower.find(".config.").unwrap_or(0)]
            .chars()
            .all(|character| {
                character.is_ascii_alphanumeric() || matches!(character, '.' | '-' | '_')
            })
}

pub fn expanded_command(root: &Path, command: &[String]) -> String {
    let manifest = package_json(root);
    let executable = command
        .first()
        .and_then(|value| Path::new(value).file_name())
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .trim_end_matches(".cmd")
        .trim_end_matches(".exe")
        .to_ascii_lowercase();
    let run_index = command.iter().position(|argument| argument == "run");
    let script_name = run_index
        .and_then(|index| command.get(index + 1))
        .or_else(|| {
            (["npm", "pnpm", "yarn", "bun"].contains(&executable.as_str()) && run_index.is_none())
                .then(|| command.get(1))
                .flatten()
        });
    let joined = command.join(" ");
    if ["npm", "pnpm", "yarn", "bun"].contains(&executable.as_str())
        && let Some(script_name) = script_name
    {
        return format!("{joined} {}", script(&manifest, script_name).unwrap_or(""));
    }
    joined
}

fn words(value: &str) -> BTreeSet<String> {
    value
        .to_ascii_lowercase()
        .split(|character: char| !character.is_ascii_alphanumeric())
        .filter(|word| word.len() > 1 && !GENERIC_COMMAND_TERMS.contains(word))
        .map(str::to_owned)
        .collect()
}

fn relative_build_output(source: &str) -> bool {
    let mut rest = source;
    let mut relative = false;
    while let Some(stripped) = rest.strip_prefix("../").or_else(|| rest.strip_prefix("./")) {
        relative = true;
        rest = stripped;
    }
    relative
        && matches!(
            rest.split('/').next(),
            Some("dist" | "build" | "out" | "output")
        )
}

fn string_expression<'a>(expression: &'a Expression<'_>) -> Option<&'a str> {
    let Expression::StringLiteral(literal) = expression else {
        return None;
    };
    Some(literal.value.as_str())
}

struct BuildOutputScanner<'a> {
    found: bool,
    build_output_scripts: &'a BTreeSet<String>,
}

fn child_process_launcher(expression: &Expression<'_>) -> bool {
    let name = match expression {
        Expression::Identifier(identifier) => Some(identifier.name.as_str()),
        Expression::StaticMemberExpression(member) => Some(member.property.name.as_str()),
        _ => None,
    };
    name.is_some_and(|name| {
        [
            "spawn",
            "spawnSync",
            "exec",
            "execSync",
            "execFile",
            "execFileSync",
        ]
        .contains(&name)
    })
}

/// The package script a launch runs, whether the call names a program and an
/// argument array (`spawn("npm", ["run", "start"])`) or hands the shell one
/// command string (`execSync("npm run start")`, or `spawn` with `shell`). The
/// string form is how most suites start a server, and it is the form the
/// array-only match missed.
fn launched_package_script<'a>(
    program: &'a str,
    arguments: Option<&'a oxc_ast::ast::ArrayExpression<'a>>,
) -> Option<String> {
    let words: Vec<String> = match arguments {
        Some(arguments) => {
            if !package_manager(program) {
                return None;
            }
            arguments
                .elements
                .iter()
                .map(|element| match element {
                    ArrayExpressionElement::StringLiteral(value) => Some(value.value.to_string()),
                    _ => None,
                })
                .collect::<Option<Vec<_>>>()?
        }
        None => {
            let mut tokens = command_tokens(program);
            if tokens.is_empty() || !package_manager(&tokens.remove(0)) {
                return None;
            }
            tokens
        }
    };
    match words.first().map(String::as_str) {
        Some("run") => words.get(1).cloned(),
        Some(_) => words.first().cloned(),
        None => None,
    }
}

fn package_manager(value: &str) -> bool {
    let executable = value
        .rsplit(['/', '\\'])
        .next()
        .unwrap_or(value)
        .trim_end_matches(".cmd")
        .trim_end_matches(".exe");
    ["npm", "pnpm", "yarn", "bun"].contains(&executable)
}

fn script_references_build_output(command: &str) -> bool {
    command_tokens(command).iter().any(|token| {
        let token = token.trim_start_matches("../").trim_start_matches("./");
        let mut segments = token.split(['/', '\\']);
        let directory = segments.next();
        // A bare `build` is a subcommand -- `vite build` produces output, it
        // does not consume any -- so only a path reaching INTO the directory
        // means the script runs something already compiled.
        segments.next().is_some() && matches!(directory, Some("dist" | "build" | "out" | "output"))
    })
}

fn build_output_scripts(manifest: &Value) -> BTreeSet<String> {
    manifest
        .get("scripts")
        .and_then(Value::as_object)
        .into_iter()
        .flatten()
        .filter_map(|(name, command)| match command.as_str() {
            Some(command) if script_references_build_output(command) => Some(name.clone()),
            _ => None,
        })
        .collect()
}

impl<'a> Visit<'a> for BuildOutputScanner<'_> {
    fn visit_import_declaration(&mut self, declaration: &oxc_ast::ast::ImportDeclaration<'a>) {
        self.found |= relative_build_output(declaration.source.value.as_str());
        walk::walk_import_declaration(self, declaration);
    }

    fn visit_import_expression(&mut self, expression: &ImportExpression<'a>) {
        if let Some(source) = string_expression(&expression.source) {
            self.found |= relative_build_output(source);
        }
        walk::walk_import_expression(self, expression);
    }

    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        if matches!(&call.callee, Expression::Identifier(identifier) if identifier.name == "require")
            && let Some(Argument::StringLiteral(source)) = call.arguments.first()
        {
            self.found |= relative_build_output(source.value.as_str());
        }
        if child_process_launcher(&call.callee)
            && let Some(Argument::StringLiteral(program)) = call.arguments.first()
        {
            let arguments = match call.arguments.get(1) {
                Some(Argument::ArrayExpression(arguments)) => Some(&**arguments),
                _ => None,
            };
            self.found |= launched_package_script(program.value.as_str(), arguments)
                .is_some_and(|script| self.build_output_scripts.contains(&script));
        }
        walk::walk_call_expression(self, call);
    }
}

/// Whether tests consume compiled output directly or launch a package script
/// that does. Either form requires the instrumented build before the runner.
fn tests_require_build_output(root: &Path, manifest: &Value) -> bool {
    fn visit(directory: &Path, build_output_scripts: &BTreeSet<String>) -> bool {
        let Ok(entries) = read_directory(directory) else {
            return false;
        };
        for entry in entries {
            let name = entry.file_name();
            let Some(name) = name.to_str() else { continue };
            if name == "node_modules" || name.starts_with('.') {
                continue;
            }
            let path = entry.path();
            let Ok(file_type) = entry.file_type() else {
                continue;
            };
            if file_type.is_symlink() {
                continue;
            }
            if file_type.is_dir() && visit(&path, build_output_scripts) {
                return true;
            }
            if file_type.is_file()
                && source_file(&path)
                && let Ok(source) = fs::read_to_string(&path)
            {
                let allocator = Allocator::default();
                if let Some(program) = parse_program(&allocator, &path, &source) {
                    let mut scanner = BuildOutputScanner {
                        found: false,
                        build_output_scripts,
                    };
                    scanner.visit_program(&program);
                    if scanner.found {
                        return true;
                    }
                }
            }
        }
        false
    }

    let build_output_scripts = build_output_scripts(manifest);
    ["test", "tests", "spec", "specs", "e2e", "__tests__"]
        .iter()
        .any(|directory| visit(&root.join(directory), &build_output_scripts))
}

fn identifier(expression: &Expression<'_>, name: &str) -> bool {
    matches!(expression, Expression::Identifier(identifier) if identifier.name == name)
}

fn static_process_env(member: &StaticMemberExpression<'_>) -> bool {
    member.property.name == "env" && identifier(&member.object, "process")
}

fn environment_reference(expression: &Expression<'_>) -> Option<String> {
    match expression {
        Expression::StaticMemberExpression(member) => {
            let Expression::StaticMemberExpression(object) = &member.object else {
                return None;
            };
            static_process_env(object).then(|| member.property.name.to_string())
        }
        Expression::ComputedMemberExpression(member) => {
            let Expression::StaticMemberExpression(object) = &member.object else {
                return None;
            };
            let Expression::StringLiteral(property) = &member.expression else {
                return None;
            };
            static_process_env(object).then(|| property.value.to_string())
        }
        _ => None,
    }
}

#[derive(Default)]
struct BuildEnvironmentScanner {
    values: BTreeMap<String, String>,
}

impl<'a> Visit<'a> for BuildEnvironmentScanner {
    fn visit_binary_expression(&mut self, expression: &BinaryExpression<'a>) {
        if matches!(
            expression.operator,
            BinaryOperator::Equality | BinaryOperator::StrictEquality
        ) && let Some(name) = environment_reference(&expression.left)
            && name
                .bytes()
                .next()
                .is_some_and(|byte| byte.is_ascii_uppercase())
            && name
                .bytes()
                .all(|byte| byte.is_ascii_uppercase() || byte.is_ascii_digit() || byte == b'_')
            && let Some(value) = string_expression(&expression.right)
        {
            self.values.insert(name, value.into());
        }
        walk::walk_binary_expression(self, expression);
    }
}

fn referenced_build_environment(root: &Path) -> BTreeMap<String, String> {
    let Ok(entries) = read_directory(root) else {
        return BTreeMap::new();
    };
    let mut values = BTreeMap::new();
    for entry in entries {
        let path = entry.path();
        let Some(name) = entry.file_name().to_str().map(str::to_owned) else {
            continue;
        };
        if !entry.file_type().is_ok_and(|file_type| file_type.is_file())
            || !["vite", "webpack", "rollup", "remix", "next", "nuxt"]
                .iter()
                .any(|tool| name.starts_with(&format!("{tool}.config.")))
            || !source_file(&path)
        {
            continue;
        }
        let Ok(source) = fs::read_to_string(&path) else {
            continue;
        };
        let allocator = Allocator::default();
        let Some(program) = parse_program(&allocator, &path, &source) else {
            continue;
        };
        let mut scanner = BuildEnvironmentScanner::default();
        scanner.visit_program(&program);
        values.extend(scanner.values);
    }
    values
}

fn infer_build_environment(
    root: &Path,
    command: &[String],
    environment: &BTreeMap<String, String>,
) -> BTreeMap<String, String> {
    let command_words = words(&expanded_command(root, command));
    if command_words.is_empty() {
        return BTreeMap::new();
    }
    let mut values = referenced_build_environment(root)
        .into_iter()
        .filter(|(name, _)| {
            !environment.contains_key(name)
                && words(name).iter().any(|word| command_words.contains(word))
        })
        .collect::<BTreeMap<_, _>>();
    // These overrides affect TypeScript emission and must participate in run
    // and frontend-cache identity even when no build script references them.
    for name in [
        "TS_NODE_COMPILER_OPTIONS",
        "TS_NODE_PROJECT",
        "TSX_TSCONFIG_PATH",
    ] {
        if let Some(value) = environment.get(name) {
            values.insert(name.into(), value.clone());
        }
    }
    values
}

fn command_tokens(value: &str) -> Vec<String> {
    value
        .split_whitespace()
        .map(|token| {
            token
                .trim_matches(|character: char| matches!(character, '\'' | '"' | '(' | ')'))
                .trim_end_matches([';', ','])
                .to_ascii_lowercase()
        })
        .collect()
}

fn has_tool(tokens: &[String], tool: &str) -> bool {
    tokens.iter().any(|token| {
        let file = token.rsplit('/').next().unwrap_or(token);
        file == tool
            || file.strip_suffix(".cmd") == Some(tool)
            || file.strip_suffix(".exe") == Some(tool)
    })
}

/// `tokens` and the tokens of every package script they run, however deep:
/// debug's `npm test` runs `npm run test:browser`, which runs karma.
fn reachable_script_tokens(manifest: &Value, tokens: &[String]) -> Vec<String> {
    let mut all = tokens.to_vec();
    let mut visited = BTreeSet::new();
    let mut index = 0;
    while index < all.len() {
        let runner = all[index]
            .rsplit('/')
            .next()
            .unwrap_or(&all[index])
            .to_owned();
        let named = match runner.as_str() {
            "npm" | "pnpm" | "yarn" | "bun" => {
                let next = all.get(index + 1).map(String::as_str);
                match next {
                    Some("run" | "run-script") => all.get(index + 2).cloned(),
                    Some("test" | "t") => Some("test".to_owned()),
                    Some(name) if runner != "npm" => Some(name.to_owned()),
                    _ => None,
                }
            }
            _ => None,
        };
        if let Some(name) = named
            && visited.insert(name.clone())
            && let Some(body) = script(manifest, &name)
        {
            all.extend(command_tokens(body));
        }
        index += 1;
    }
    all
}

/// Resolve npm/pnpm/yarn script indirection before identifying a runner. This
/// is shared by discovery and the Rust-owned execution frontend so `npm test`
/// receives exactly the same adapter decision as an explicit runner command.
pub fn command_uses_tool(root: &Path, command: &[String], tool: &str) -> bool {
    has_tool(&command_tokens(&expanded_command(root, command)), tool)
}

fn configured_path(
    root: &Path,
    environment: &BTreeMap<String, String>,
    key: &str,
) -> Option<PathBuf> {
    environment.get(key).map(|value| root.join(value))
}

fn first_config(root: &Path, candidates: &[&str]) -> Option<PathBuf> {
    candidates
        .iter()
        .map(|candidate| root.join(candidate))
        .find(|path| regular_file(path))
}

/// The package manager the project's tests were started with, to run its
/// build the same way. A Yarn or pnpm workspace's scripts call the manager
/// that runs them; building through npm changed that for no reason.
fn build_package_manager(command: &[String]) -> String {
    command
        .first()
        .filter(|program| package_manager(program))
        .cloned()
        .unwrap_or_else(|| "npm".into())
}

/// The build a project names in `SUPERCOV_BUILD_COMMAND`, as words or as a
/// JSON array of arguments.
///
/// A monorepo's root `build` builds every package: Actual's ran `lage build`
/// across the repository when its browser tests needed one target. Naming
/// the build, such as `yarn workspace @actual-app/web build`, is the answer
/// no discovery can give, because which target a suite needs is not written
/// down anywhere Supercov reads.
pub fn declared_build_command(environment: &BTreeMap<String, String>) -> Option<Vec<String>> {
    let value = environment.get(BUILD_COMMAND_VARIABLE)?.trim();
    if value.is_empty() {
        return None;
    }
    if value.starts_with('[') {
        return serde_json::from_str::<Vec<String>>(value)
            .ok()
            .filter(|words| !words.is_empty());
    }
    Some(value.split_whitespace().map(str::to_owned).collect())
}

pub const BUILD_COMMAND_VARIABLE: &str = "SUPERCOV_BUILD_COMMAND";

pub fn discover_coverage_project(
    root: &Path,
    environment: &BTreeMap<String, String>,
    command: &[String],
) -> Result<CoverageProject, ProjectDiscoveryError> {
    let manifest = package_json(root);
    let configured_roots = crate::source_discovery::configured_source_roots(environment);
    let DiscoveredSourceScope {
        source_files,
        source_roots,
        scope,
        limitations,
    } = discover_source_scope(root, configured_roots.as_deref())?;
    if source_files.is_empty() {
        return Err(ProjectDiscoveryError::NoSourceFiles);
    }
    let playwright_config = configured_path(root, environment, "SUPERCOV_PLAYWRIGHT_CONFIG")
        .or_else(|| first_config(root, PLAYWRIGHT_CONFIGS))
        .or_else(|| nested_playwright_configs(root).into_iter().next());
    let vitest_config = configured_path(root, environment, "SUPERCOV_VITEST_CONFIG")
        .or_else(|| first_config(root, VITEST_CONFIGS));
    let jest_config = configured_path(root, environment, "SUPERCOV_JEST_CONFIG")
        .or_else(|| first_config(root, JEST_CONFIGS));
    let discovered_playwright = discover_playwright_adapter(root);
    let playwright_module = environment
        .get("SUPERCOV_PLAYWRIGHT_MODULE")
        .cloned()
        .unwrap_or_else(|| discovered_playwright.module.clone());
    let playwright_test_export = environment
        .get("SUPERCOV_PLAYWRIGHT_TEST_EXPORT")
        .cloned()
        .unwrap_or_else(|| {
            if playwright_module == discovered_playwright.module {
                discovered_playwright.test_export.clone()
            } else {
                "test".into()
            }
        });
    let expanded_test_command = expanded_command(root, command);
    let tokens = command_tokens(&expanded_test_command);
    let uses_jest =
        jest_config.is_some() || has_tool(&tokens, "jest") || manifest.get("jest").is_some();
    let script_tokens = reachable_script_tokens(&manifest, &tokens);
    let browser_runner = ["karma", "testem", "airtap", "zuul", "mochify"]
        .iter()
        .any(|tool| has_tool(&script_tokens, tool));
    let source_transforming_runner = has_tool(&tokens, "jest") || has_tool(&tokens, "vitest");
    let node_test = has_tool(&tokens, "node") && tokens.iter().any(|token| token == "--test");
    let typescript_test = tokens.iter().any(|token| {
        [".ts", ".tsx", ".cts", ".mts"]
            .iter()
            .any(|extension| token.ends_with(extension) || token.contains(&format!("{extension}*")))
    });
    let owns_build = ["vite", "tsc", "webpack", "rollup", "next", "remix"]
        .iter()
        .any(|tool| has_tool(&tokens, tool));
    // Reading the suite is the expensive half of this question, so it stays on
    // the right of `&&`: a command that never executes source directly answers
    // it without parsing a single test file.
    let executes_source_directly = (source_transforming_runner
        || (node_test && typescript_test && !owns_build))
        && !tests_require_build_output(root, &manifest);
    let build_command = if let Some(declared) = declared_build_command(environment) {
        declared
    } else if script(&manifest, "build").is_some() && !executes_source_directly {
        vec![build_package_manager(command), "run".into(), "build".into()]
    } else {
        Vec::new()
    };
    let build_tokens = command_tokens(&expanded_command(root, &build_command));
    let relocating_build = ["tsc", "tshy", "babel", "swc"]
        .iter()
        .any(|tool| has_tool(&reachable_script_tokens(&manifest, &build_tokens), tool));
    let uses_vite_build = has_tool(&build_tokens, "vite") || has_tool(&build_tokens, "vite-node");
    let playwright_exports = if playwright_module == discovered_playwright.module {
        discovered_playwright.exports
    } else {
        vec![playwright_test_export.clone(), "expect".into()]
    };
    Ok(CoverageProject {
        root: root.to_owned(),
        source_roots,
        source_files,
        source_scope: scope,
        source_limitations: limitations,
        playwright_config,
        vitest_config,
        jest_config,
        uses_jest,
        browser_runner,
        relocating_build,
        playwright_module,
        playwright_test_export,
        playwright_exports,
        build_adapter: if build_command.is_empty() {
            BuildAdapter::Direct
        } else if uses_vite_build {
            BuildAdapter::Vite
        } else {
            BuildAdapter::Generic
        },
        build_command,
        build_environment: infer_build_environment(root, command, environment),
    })
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;

    fn project(label: &str, files: &[(&str, &str)]) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-project-{label}-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(&root).unwrap();
        for (file, contents) in files {
            let path = root.join(file);
            fs::create_dir_all(path.parent().unwrap()).unwrap();
            fs::write(path, contents).unwrap();
        }
        root
    }

    fn command(values: &[&str]) -> Vec<String> {
        values.iter().map(|value| (*value).into()).collect()
    }

    #[test]
    fn discovers_conventional_vite_playwright_and_vitest_configuration() {
        let root = project(
            "vite",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"vite build"},"devDependencies":{"vite":"1"}}"#,
                ),
                ("src/main.ts", "export const ready = true"),
                ("playwright.config.ts", "export default {}"),
                ("vitest.config.ts", "export default {}"),
                (
                    "tests/example.spec.ts",
                    "import { test } from '@playwright/test'",
                ),
            ],
        );
        let discovered = discover_coverage_project(&root, &BTreeMap::new(), &[]).unwrap();
        assert_eq!(discovered.source_roots, ["src"]);
        assert_eq!(
            discovered.playwright_config,
            Some(root.join("playwright.config.ts"))
        );
        assert_eq!(
            discovered.vitest_config,
            Some(root.join("vitest.config.ts"))
        );
        assert_eq!(discovered.playwright_module, "@playwright/test");
        assert_eq!(discovered.playwright_test_export, "test");
        assert_eq!(discovered.playwright_exports, ["test"]);
        assert_eq!(discovered.build_adapter, BuildAdapter::Vite);
        assert_eq!(discovered.build_command, command(&["npm", "run", "build"]));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_build_that_compiles_into_another_directory_is_told_from_a_bundler() {
        // lru-cache: `npm run build` runs `npm run prepare`, which runs tshy.
        let relocating = project(
            "tshy",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"npm run prepare","prepare":"tshy && bash scripts/build.sh","test":"tap"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
            ],
        );
        let command = ["npm".to_owned(), "test".to_owned()];
        let discovered =
            discover_coverage_project(&relocating, &BTreeMap::new(), &command).unwrap();
        assert!(discovered.relocating_build);
        let bundled = project(
            "next-build",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"next build","test":"playwright test"}}"#,
                ),
                (
                    "app/page.jsx",
                    "export default function Page() { return null }",
                ),
            ],
        );
        let discovered = discover_coverage_project(&bundled, &BTreeMap::new(), &command).unwrap();
        assert!(!discovered.relocating_build);
    }

    #[test]
    fn a_browser_runner_the_tests_reach_through_nested_scripts_is_found() {
        // debug's `npm test` runs `npm run test:browser`, which runs karma.
        let root = project(
            "karma",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"test":"npm run test:node && npm run test:browser","test:node":"mocha test.js","test:browser":"karma start --single-run"}}"#,
                ),
                ("src/index.js", "module.exports = 1"),
            ],
        );
        let command = ["npm".to_owned(), "test".to_owned()];
        let discovered = discover_coverage_project(&root, &BTreeMap::new(), &command).unwrap();
        assert!(discovered.browser_runner);
        let node_only = ["npm".to_owned(), "run".to_owned(), "test:node".to_owned()];
        let discovered = discover_coverage_project(&root, &BTreeMap::new(), &node_only).unwrap();
        assert!(!discovered.browser_runner);
    }

    #[test]
    fn skips_unrelated_builds_for_source_transforming_and_node_test_suites() {
        for (label, test_script, test_file) in [
            ("jest", "jest", "require('../src/index.ts')"),
            ("vitest", "vitest run", "import '../src/index.ts'"),
            (
                "node",
                "node --test tests/*.test.ts",
                "import '../src/index.ts'",
            ),
        ] {
            let root = project(
                label,
                &[
                    (
                        "package.json",
                        &format!(
                            r#"{{"scripts":{{"build":"node build","test":"{test_script}"}}}}"#
                        ),
                    ),
                    ("src/index.ts", "export const ready = true"),
                    ("tests/index.test.ts", test_file),
                ],
            );
            let discovered =
                discover_coverage_project(&root, &BTreeMap::new(), &command(&["npm", "test"]))
                    .unwrap();
            assert_eq!(discovered.build_adapter, BuildAdapter::Direct, "{label}");
            assert!(discovered.build_command.is_empty(), "{label}");
            fs::remove_dir_all(root).unwrap();
        }
    }

    #[test]
    fn builds_with_the_package_manager_the_tests_were_started_with() {
        let root = project(
            "yarn-build",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"tsc","test":"jest --runInBand"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
                ("test/index.test.js", "require('../dist/index.js')"),
            ],
        );
        let discovered =
            discover_coverage_project(&root, &BTreeMap::new(), &command(&["yarn", "test"]))
                .unwrap();
        assert_eq!(discovered.build_command, command(&["yarn", "run", "build"]));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_declared_build_replaces_the_root_one() {
        // Actual's root build is `lage build` across the monorepo; its
        // browser tests need one workspace built.
        let root = project(
            "declared-build",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"lage build","test":"playwright test"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
            ],
        );
        for (value, expected) in [
            (
                "yarn workspace @actual-app/web build",
                command(&["yarn", "workspace", "@actual-app/web", "build"]),
            ),
            (
                r#"["node", ".yarn/releases/yarn-4.cjs", "workspace", "web", "build"]"#,
                command(&[
                    "node",
                    ".yarn/releases/yarn-4.cjs",
                    "workspace",
                    "web",
                    "build",
                ]),
            ),
        ] {
            let environment = BTreeMap::from([(BUILD_COMMAND_VARIABLE.into(), value.into())]);
            let discovered =
                discover_coverage_project(&root, &environment, &command(&["yarn", "test"]))
                    .unwrap();
            assert_eq!(discovered.build_command, expected);
            assert_eq!(discovered.build_adapter, BuildAdapter::Generic);
        }
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn retains_the_build_when_tests_import_compiled_output() {
        let root = project(
            "compiled",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"tsc","test":"jest --runInBand"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
                ("test/index.test.js", "require('../dist/index.js')"),
            ],
        );
        let discovered =
            discover_coverage_project(&root, &BTreeMap::new(), &command(&["npm", "test"])).unwrap();
        assert_eq!(discovered.build_adapter, BuildAdapter::Generic);
        assert!(discovered.uses_jest);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn retains_the_build_when_source_direct_tests_spawn_a_compiled_package_script() {
        let root = project(
            "spawned-compiled-script",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"tsc","start":"node dist/index.js","test":"node --test tests/*.test.ts"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
                (
                    "tests/index.test.ts",
                    "import { spawn } from 'node:child_process';\nspawn('npm', ['run', 'start']);\n",
                ),
            ],
        );
        let discovered =
            discover_coverage_project(&root, &BTreeMap::new(), &command(&["npm", "test"])).unwrap();
        assert_eq!(discovered.build_adapter, BuildAdapter::Generic);
        assert_eq!(discovered.build_command, command(&["npm", "run", "build"]));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn retains_the_build_when_tests_exec_a_compiled_package_script_as_one_string() {
        // `execSync("npm run start")` hands the shell a single string. It is
        // how most suites start the server they test against, and the
        // array-only match let it through to the same hang as an unbuilt
        // gateway.
        let root = project(
            "exec-compiled-script",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"tsc","start":"node dist/index.js","test":"node --test tests/*.test.ts"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
                (
                    "tests/index.test.ts",
                    "import { execSync } from 'node:child_process';\nexecSync('npm run start');\n",
                ),
            ],
        );
        let discovered =
            discover_coverage_project(&root, &BTreeMap::new(), &command(&["npm", "test"])).unwrap();
        assert_eq!(discovered.build_adapter, BuildAdapter::Generic);
        assert_eq!(discovered.build_command, command(&["npm", "run", "build"]));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn keeps_source_direct_when_a_spawned_script_only_runs_a_build_subcommand() {
        let root = project(
            "spawned-build-subcommand",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"tsc","dev":"vite build","test":"node --test tests/*.test.ts"}}"#,
                ),
                ("src/index.ts", "export const ready = true"),
                (
                    "tests/index.test.ts",
                    "import { spawn } from 'node:child_process';\nspawn('npm', ['run', 'dev']);\n",
                ),
            ],
        );
        let discovered =
            discover_coverage_project(&root, &BTreeMap::new(), &command(&["npm", "test"])).unwrap();
        assert_eq!(discovered.build_adapter, BuildAdapter::Direct);
        assert!(discovered.build_command.is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn discovers_a_project_owned_playwright_fixture_via_the_ast() {
        let root = project(
            "fixture",
            &[
                ("package.json", r#"{"scripts":{"build":"vite build"}}"#),
                ("app/root.tsx", "export default null"),
                (
                    "tests/nested/playwright.browser.config.ts",
                    "export default {}",
                ),
                (
                    "tests/example.spec.ts",
                    "import { type Ignored, browserTest as test, expect, fixtureValue } from '@acme/browser-fixtures'\n\
                     import { createFixtureProduct } from '@acme/browser-fixtures'",
                ),
            ],
        );
        let discovered = discover_coverage_project(&root, &BTreeMap::new(), &[]).unwrap();
        assert_eq!(
            discovered.playwright_config,
            Some(root.join("tests/nested/playwright.browser.config.ts"))
        );
        assert_eq!(discovered.playwright_module, "@acme/browser-fixtures");
        assert_eq!(discovered.playwright_test_export, "browserTest");
        // The helper imported in its own statement must reach the shim: a
        // facade's non-test exports vanish otherwise, and every spec importing
        // one fails to link.
        assert_eq!(
            discovered.playwright_exports,
            [
                "browserTest",
                "createFixtureProduct",
                "expect",
                "fixtureValue"
            ]
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn infers_only_unset_build_flags_referenced_by_the_project_ast() {
        let root = project(
            "environment",
            &[
                (
                    "package.json",
                    r#"{"scripts":{"build":"vite build","test:isolated":"node tools/run.js"}}"#,
                ),
                ("app/root.ts", "export const ready = true"),
                (
                    "vite.config.ts",
                    "const isolated = process.env.TEST_ISOLATED === 'true'; const bracket = process.env['TEST_BRACKET'] == \"yes\"; const ignored = 'x' === process.env.REVERSED; export default { isolated, bracket, ignored }",
                ),
            ],
        );
        let discovered = discover_coverage_project(
            &root,
            &BTreeMap::new(),
            &command(&["npm", "run", "test:isolated"]),
        )
        .unwrap();
        assert_eq!(
            discovered.build_environment,
            BTreeMap::from([("TEST_ISOLATED".into(), "true".into())])
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn environment_overrides_are_authoritative() {
        let root = project(
            "override",
            &[
                ("package.json", r#"{"scripts":{"build":"vite build"}}"#),
                ("custom/main.ts", "main"),
                ("configs/browser.ts", "config"),
                (
                    "tests/example.spec.ts",
                    "import { test } from '@playwright/test'",
                ),
            ],
        );
        let environment = BTreeMap::from([
            ("SUPERCOV_SOURCE_ROOTS".into(), "custom".into()),
            (
                "SUPERCOV_PLAYWRIGHT_CONFIG".into(),
                "configs/browser.ts".into(),
            ),
            ("SUPERCOV_PLAYWRIGHT_MODULE".into(), "@custom/test".into()),
            ("SUPERCOV_PLAYWRIGHT_TEST_EXPORT".into(), "scenario".into()),
        ]);
        let discovered = discover_coverage_project(&root, &environment, &[]).unwrap();
        assert_eq!(discovered.source_roots, ["custom"]);
        assert_eq!(
            discovered.playwright_config,
            Some(root.join("configs/browser.ts"))
        );
        assert_eq!(discovered.playwright_module, "@custom/test");
        assert_eq!(discovered.playwright_test_export, "scenario");
        assert_eq!(discovered.playwright_exports, ["scenario", "expect"]);
        fs::remove_dir_all(root).unwrap();
    }
}
