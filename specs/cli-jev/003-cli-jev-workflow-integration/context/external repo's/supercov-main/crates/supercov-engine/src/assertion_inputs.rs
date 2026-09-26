//! Thin syntax inventories and source fingerprints for assertion maps.
//! No type/flow/dependency verifier belongs here.
use crate::{
    assertion_map::{
        Anchor, FileFingerprint, Files, InputManifest, Inputs, InventorySite, LineIndex, local_path,
    },
    evidence_archive::EvidenceArchiveEntry,
    workspace::{canonicalize_simplified, simplified},
};
use std::{
    collections::BTreeSet,
    fs,
    path::{Path, PathBuf},
};

pub const ARCHIVE_PATH: &str = "assertion-inputs.json";

/// Names the variables whose values participate in assertion context identity,
/// as a comma-separated list. Empty or unset means none.
pub const CONTEXT_ENVIRONMENT: &str = "SUPERCOV_ASSERTION_CONTEXT_ENV";

/// Identity of the execution context an authored claim was reviewed against.
///
/// The ambient process environment is deliberately **not** part of this. A run
/// from a different directory, terminal session, package manager or Node
/// installation carries dozens of incidental variables (`INIT_CWD`, `npm_*`,
/// `TERM_SESSION_ID`, per-session sockets and tokens), and folding those in
/// invalidated every flow in a map at once for no semantic reason. Environment
/// differences that actually change behaviour are already caught where it
/// matters: build-relevant variables participate in the run's configuration,
/// dependency and instrumenter fingerprints, and any real behavioural change
/// shows up in re-collected evidence, because credit requires a passing
/// assertion occurrence and execution of the claimed statement in the same
/// selected test.
///
/// Projects that genuinely depend on specific variables name them in
/// [`CONTEXT_ENVIRONMENT`]; only those participate, and a variable that is not
/// set is recorded as absent rather than skipped.
fn context_digest() -> String {
    selected_context_digest(
        &std::env::var(CONTEXT_ENVIRONMENT).unwrap_or_default(),
        |name| std::env::var(name).ok(),
    )
}

fn selected_context_digest(names: &str, value: impl Fn(&str) -> Option<String>) -> String {
    let selected = names
        .split(',')
        .map(str::trim)
        .filter(|name| !name.is_empty())
        .map(|name| (name.to_owned(), value(name)))
        .collect::<std::collections::BTreeMap<_, _>>();
    crate::assertion_map::digest(&("supercov-assertion-context-v2", selected))
}

pub fn capture(
    root: &Path,
    language: &str,
    paths: impl IntoIterator<Item = PathBuf>,
) -> Result<Inputs, String> {
    capture_with_expect_modules(root, language, paths, &[])
}

pub fn capture_with_expect_modules(
    root: &Path,
    language: &str,
    paths: impl IntoIterator<Item = PathBuf>,
    expect_modules: &[String],
) -> Result<Inputs, String> {
    let supplied_root = simplified(root.to_owned());
    let root = canonicalize_simplified(root).map_err(|e| e.to_string())?;
    // Store only a digest of the selected context, never its values.
    let mut inputs = Inputs { schema_version: 1, language: language.into(), context_digest: context_digest(), files: Files::new(), assertions: vec![], limitations: vec![
        "Syntax inventory covers recognized assertion forms, not every possible custom assertion. Agents may add exact source sites; missing runtime identity never earns credit.".into()
    ] };
    if language == "go" {
        inputs.limitations.push("A Go test states its claim with an `if` and reports the violation through t.Error or t.Fatal, so the report is the inventoried site. Custom assertion helpers that wrap it are not recognized.".into());
    }
    if language == "jvm" {
        inputs.limitations.push("Assertion forms spelled assertSomething, assertThat or fail are inventoried, which covers JUnit, TestNG, AssertJ, Hamcrest and kotlin.test. Kotest's infix matchers and custom assertion helpers are not.".into());
    }
    if language == "javascript" {
        inputs.limitations.push("Optional assertion calls are inventoried but currently have no injected phase. Unrecognized custom assertion wrappers and dynamically selected matchers may be absent. Use check --require-observed to detect inventoried sites without passing evidence.".into());
    }
    let watched = watched_by_the_newest_map(&root);
    for path in paths
        .into_iter()
        .map(simplified)
        .chain(watched)
        .collect::<BTreeSet<_>>()
    {
        let full = if path.is_absolute() {
            root.join(path.strip_prefix(&supplied_root).unwrap_or(&path))
        } else {
            root.join(&path)
        };
        if !full.exists() {
            continue;
        }
        let relative = full
            .strip_prefix(&root)
            .map_err(|_| format!("assertion input outside project: {}", full.display()))?
            .to_string_lossy()
            .replace('\\', "/");
        if !local_path(&relative)
            || !canonicalize_simplified(&full)
                .map_err(|e| e.to_string())?
                .starts_with(&root)
        {
            return Err(format!("assertion input outside project: {relative}"));
        }
        if inputs.files.contains_key(&relative) {
            continue;
        }
        let bytes = fs::read(&full).map_err(|e| format!("{relative}: {e}"))?;
        let Ok(text) = String::from_utf8(bytes) else {
            inputs.limitations.push(format!(
                "Non-UTF-8 input omitted from source anchors: {relative}"
            ));
            continue;
        };
        let extension = path.extension().and_then(|s| s.to_str()).unwrap_or("");
        let ranges = match extension {
            "js" | "mjs" | "cjs" | "jsx" | "ts" | "mts" | "cts" | "tsx" => {
                crate::js_instrumenter::assertion_ranges_with_expect_modules(
                    &relative,
                    &text,
                    expect_modules,
                )
            }
            "rs" => rust_ranges(&text),
            "py" => python_ranges(&text),
            "rb" => ruby_ranges(&text),
            "go" => go_ranges(&text),
            "java" => jvm_ranges(&text, crate::jvm_instrumenter::JvmLanguage::Java),
            "kt" => jvm_ranges(&text, crate::jvm_instrumenter::JvmLanguage::Kotlin),
            _ => Ok(vec![]),
        };
        match ranges {
            Ok(ranges) => {
                inputs
                    .assertions
                    .extend(
                        ranges
                            .into_iter()
                            .map(|(start, end, operation)| InventorySite {
                                at: Anchor::new(&relative, &text, start, end),
                                operation,
                            }),
                    )
            }
            Err(e) => inputs
                .limitations
                .push(format!("Inventory unavailable for {relative}: {e}")),
        }
        inputs.files.insert(relative, text);
    }
    inputs.assertions.sort_by(|a, b| a.at.cmp(&b.at));
    Ok(inputs)
}

/// Every file the newest stored map's flows watch.
///
/// A flow may rest on a file no language adapter reads -- a browser test's
/// `index.html` or stylesheet -- and a watch is checked against the files the
/// run captured, so TodoMVC's author was told `watched file missing:
/// index.html` about a file that existed, and removed the watch to get a
/// valid map. The map is the declaration: a run captures what the map it
/// inherits watches, so the dependency is written once, in the map, and holds
/// on every run after it. A file that is gone or not UTF-8 is not captured,
/// and the watch reports it.
fn watched_by_the_newest_map(root: &Path) -> Vec<PathBuf> {
    let Ok(inventory) = crate::run_store::discover_runs(root) else {
        return Vec::new();
    };
    let Some(newest) = inventory
        .runs
        .iter()
        .filter(|run| {
            run.directory
                .join(crate::assertion_store::MAP_FILE)
                .is_file()
        })
        .max_by(|a, b| a.metadata.started_at.cmp(&b.metadata.started_at))
    else {
        return Vec::new();
    };
    let Ok(bytes) = fs::read(newest.directory.join(crate::assertion_store::MAP_FILE)) else {
        return Vec::new();
    };
    let Ok(map) = crate::assertion_map::parse(&bytes) else {
        return Vec::new();
    };
    map.assertions
        .iter()
        .flat_map(|a| a.flows.iter())
        .flat_map(|flow| flow.watch.iter())
        .filter(|file| local_path(file) && root.join(file).is_file())
        .map(PathBuf::from)
        .collect()
}

pub fn append(
    mut entries: Vec<EvidenceArchiveEntry>,
    inputs: &Inputs,
) -> Result<Vec<EvidenceArchiveEntry>, String> {
    if entries.iter().any(|e| e.path == ARCHIVE_PATH) {
        return Err("duplicate assertion inputs".into());
    }
    entries.push(EvidenceArchiveEntry {
        path: ARCHIVE_PATH.into(),
        contents: serde_json::to_vec(&inputs.manifest()).map_err(|e| e.to_string())?,
    });
    Ok(entries)
}

/// Read project files only when their exact bytes still match the run manifest.
/// This is source identity checking, not semantic dependency analysis.
pub fn current_sources(root: &Path, manifest: &InputManifest) -> Result<Inputs, String> {
    let root = canonicalize_simplified(root).map_err(|e| e.to_string())?;
    let mut files = Files::new();
    for (file, expected) in &manifest.files {
        if !local_path(file) {
            return Err(format!("Invalid assertion input path: {file}"));
        }
        let path = root.join(file);
        let source = (|| {
            let canonical = canonicalize_simplified(&path).ok()?;
            if !canonical.starts_with(&root) || !canonical.is_file() {
                return None;
            }
            let text = fs::read_to_string(canonical).ok()?;
            FileFingerprint::of(&text)
                .same_bytes(expected)
                .then_some(text)
        })();
        let Some(source) = source else {
            return Err(format!(
                "Current source differs from the run or is unavailable: {file}; rerun tests to inherit the map for the current checkout"
            ));
        };
        files.insert(file.clone(), source);
    }
    let inputs = manifest.with_sources(files);
    let lines = LineIndex::new(&inputs.files);
    if inputs
        .assertions
        .iter()
        .any(|s| lines.offset(&s.at).is_none())
    {
        return Err("Invalid assertion identities in run manifest".into());
    }
    Ok(inputs)
}

/// Every call in a file, as (byte range, callee text).
///
/// Shared by Go, Java and Kotlin because the question is the same in all
/// three: which calls are the ones that make a claim. Only the node kinds and
/// the names differ, and the caller decides those.
fn calls(tree: &tree_sitter::Tree, source: &str, kinds: &[&str]) -> Vec<(usize, usize, String)> {
    let mut found = Vec::new();
    let mut stack = vec![tree.root_node()];
    while let Some(node) = stack.pop() {
        let mut cursor = node.walk();
        for child in node.children(&mut cursor) {
            stack.push(child);
        }
        if !kinds.contains(&node.kind()) {
            continue;
        }
        // The callee is the part before the arguments, whatever the grammar
        // calls it: a field where one is named, the first child otherwise.
        let callee = node
            .child_by_field_name("function")
            .or_else(|| node.child_by_field_name("name"))
            .or_else(|| node.named_child(0));
        let Some(callee) = callee else {
            continue;
        };
        found.push((
            node.start_byte(),
            node.end_byte(),
            source[callee.byte_range()].trim().to_owned(),
        ));
    }
    found.sort();
    found
}

/// Go's assertion forms.
///
/// A Go test states its claim with an `if` and reports the violation through
/// `t.Error` or `t.Fatal`, so the report is what marks the claim: there is no
/// assertion expression to point at. testify's `assert` and `require` are the
/// other form nearly every Go suite uses.
fn go_ranges(source: &str) -> Result<Vec<(usize, usize, String)>, String> {
    let tree = crate::go_instrumenter::parse(source).map_err(|e| e.to_string())?;
    let harnesses = testing_parameters(&tree, source);
    Ok(calls(&tree, source, &["call_expression"])
        .into_iter()
        .filter(|(_, _, callee)| {
            let Some((receiver, method)) = callee.rsplit_once('.') else {
                return false;
            };
            // `t.Errorf` and `fmt.Errorf` are the same shape, and only one of
            // them is a claim. The receiver has to be something the file
            // actually declared as a *testing.T.
            (harnesses.contains(receiver)
                && matches!(method, "Error" | "Errorf" | "Fatal" | "Fatalf"))
                || matches!(receiver, "assert" | "require")
        })
        .collect())
}

/// Every identifier the file binds to a `*testing.T`, `*testing.B` or
/// `*testing.F`.
///
/// Collected from the declarations rather than assumed to be `t`: a subtest
/// closure rebinds it, a benchmark names it `b`, and a file that chose
/// something else is still a test file.
fn testing_parameters(tree: &tree_sitter::Tree, source: &str) -> BTreeSet<String> {
    let mut names = BTreeSet::new();
    let mut stack = vec![tree.root_node()];
    while let Some(node) = stack.pop() {
        let mut cursor = node.walk();
        for child in node.children(&mut cursor) {
            stack.push(child);
        }
        if node.kind() != "parameter_declaration" {
            continue;
        }
        let Some(kind) = node.child_by_field_name("type") else {
            continue;
        };
        if !matches!(
            source[kind.byte_range()].trim(),
            "*testing.T" | "*testing.B" | "*testing.F"
        ) {
            continue;
        }
        if let Some(name) = node.child_by_field_name("name") {
            names.insert(source[name.byte_range()].trim().to_owned());
        }
    }
    names
}

/// Java and Kotlin's assertion forms.
///
/// JUnit, TestNG, AssertJ, Hamcrest and kotlin.test all spell theirs
/// `assertSomething` or `assertThat`, so the prefix covers every one of them
/// without naming a framework. `fail` is the other half of the same idiom.
/// Kotest writes its own infix matchers, which no call-shaped rule reaches.
fn jvm_ranges(
    source: &str,
    language: crate::jvm_instrumenter::JvmLanguage,
) -> Result<Vec<(usize, usize, String)>, String> {
    let tree = crate::jvm_instrumenter::parse(source, language).map_err(|e| e.to_string())?;
    Ok(
        calls(&tree, source, &["method_invocation", "call_expression"])
            .into_iter()
            .filter(|(_, _, callee)| {
                let last = callee.rsplit('.').next().unwrap_or_default();
                last.starts_with("assert") || last == "fail"
            })
            .collect(),
    )
}

fn rust_ranges(source: &str) -> Result<Vec<(usize, usize, String)>, String> {
    use ra_ap_syntax::{AstNode, Edition, SourceFile, ast};
    let parsed = SourceFile::parse(source, Edition::Edition2024);
    if !parsed.errors().is_empty() {
        return Err("Rust parse errors".into());
    }
    Ok(parsed
        .tree()
        .syntax()
        .descendants()
        .filter_map(ast::MacroCall::cast)
        .filter_map(|m| {
            let path = m.path()?.syntax().text().to_string();
            if !matches!(
                path.rsplit("::").next()?,
                "assert"
                    | "assert_eq"
                    | "assert_ne"
                    | "debug_assert"
                    | "debug_assert_eq"
                    | "debug_assert_ne"
            ) {
                return None;
            }
            let range = m.syntax().text_range();
            Some((
                u32::from(range.start()) as usize,
                u32::from(range.end()) as usize,
                path,
            ))
        })
        .collect())
}
fn python_ranges(source: &str) -> Result<Vec<(usize, usize, String)>, String> {
    use ruff_python_ast::{
        Expr, Stmt,
        visitor::{Visitor, walk_expr, walk_stmt},
    };
    use ruff_text_size::Ranged;
    struct Collector(Vec<(usize, usize, String)>);
    impl<'a> Visitor<'a> for Collector {
        fn visit_stmt(&mut self, stmt: &'a Stmt) {
            if let Stmt::Assert(_) = stmt {
                self.0.push((
                    stmt.range().start().to_usize(),
                    stmt.range().end().to_usize(),
                    "assert".into(),
                ));
            }
            walk_stmt(self, stmt);
        }
        fn visit_expr(&mut self, expr: &'a Expr) {
            if let Expr::Call(call) = expr
                && let Expr::Attribute(attr) = call.func.as_ref()
                && attr.attr.as_str().starts_with("assert")
            {
                self.0.push((
                    expr.range().start().to_usize(),
                    expr.range().end().to_usize(),
                    attr.attr.to_string(),
                ));
            }
            walk_expr(self, expr);
        }
    }
    let parsed = ruff_python_parser::parse_module(source).map_err(|e| e.to_string())?;
    let mut collector = Collector(vec![]);
    for stmt in &parsed.syntax().body {
        collector.visit_stmt(stmt);
    }
    Ok(collector.0)
}
fn ruby_ranges(source: &str) -> Result<Vec<(usize, usize, String)>, String> {
    use ruby_prism::{CallNode, Visit};
    struct Collector(Vec<(usize, usize, String)>);
    impl<'a> Visit<'a> for Collector {
        fn visit_call_node(&mut self, node: &CallNode<'a>) {
            let name = String::from_utf8_lossy(node.name().as_slice()).into_owned();
            if name == "assert"
                || name == "refute"
                || name.starts_with("assert_")
                || name.starts_with("refute_")
                || matches!(name.as_str(), "to" | "not_to" | "to_not")
            {
                let location = node.location();
                self.0
                    .push((location.start_offset(), location.end_offset(), name));
            }
            ruby_prism::visit_call_node(self, node);
        }
    }
    let parsed = ruby_prism::parse(source.as_bytes());
    if parsed.errors().next().is_some() {
        return Err("Ruby parse errors".into());
    }
    let mut collector = Collector(vec![]);
    collector.visit(&parsed.node());
    Ok(collector.0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_run_captures_the_files_its_inherited_map_watches() {
        // TodoMVC's flows rest on index.html, which no JavaScript adapter
        // reads; the watch reported a file that existed as missing.
        let root = std::env::temp_dir().join(format!(
            "supercov-watch-capture-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(root.join("public")).unwrap();
        fs::write(
            root.join("public/index.html"),
            "<script src=\"a.js\"></script>\n",
        )
        .unwrap();
        fs::write(root.join("public/a.js"), "var a = 1;\n").unwrap();
        let run = crate::run_store::create_analyzable_test_run(&root, "run_watch");
        let map = serde_json::json!({
            "schemaVersion": 2,
            "assertions": [{
                "id": "a_1",
                "at": {"file": "e2e/a.spec.js", "line": 1, "column": 1, "text": "expect(x)"},
                "observes": [],
                "flows": [{
                    "id": "f", "basis": null, "questions": [], "explanation": "renders",
                    "appliesTo": [], "nodes": [], "edges": [], "countsAsAsserted": [],
                    "watch": ["public/index.html", "public/gone.css", "../outside.html"]
                }]
            }]
        });
        fs::write(
            run.join(crate::assertion_store::MAP_FILE),
            serde_json::to_vec(&map).unwrap(),
        )
        .unwrap();
        let inputs = capture(&root, "javascript", [PathBuf::from("public/a.js")]).unwrap();
        let _ = fs::remove_dir_all(&root);
        assert!(inputs.files.contains_key("public/index.html"));
        assert!(inputs.files.contains_key("public/a.js"));
        assert!(!inputs.files.contains_key("public/gone.css"));
        assert_eq!(inputs.files.len(), 2);
    }

    fn empty(_: &str) -> Option<String> {
        None
    }

    #[test]
    fn incidental_environment_never_reaches_context_identity() {
        // The values a shell, package manager or terminal happens to export are
        // not semantic inputs; without an explicit selection the identity is a
        // constant, so a map authored in one session stays current in the next.
        let baseline = selected_context_digest("", empty);
        assert_eq!(
            baseline,
            selected_context_digest("", |_| {
                panic!("no variable may be read without an explicit selection")
            })
        );
        assert_eq!(baseline, selected_context_digest("  ,  ,", empty));
    }

    #[test]
    fn explicitly_selected_variables_participate_and_distinguish_absence() {
        let unset = selected_context_digest("TZ", empty);
        let utc = selected_context_digest("TZ", |name| (name == "TZ").then(|| "UTC".to_owned()));
        let berlin = selected_context_digest("TZ", |name| {
            (name == "TZ").then(|| "Europe/Berlin".to_owned())
        });
        assert_ne!(unset, utc, "an unset variable differs from a set one");
        assert_ne!(utc, berlin, "the value participates, not just the name");
        assert_ne!(
            utc,
            selected_context_digest("", empty),
            "selecting a variable differs from selecting none"
        );
        // Order and padding in the selection are not themselves inputs.
        let pair = selected_context_digest("TZ,LANG", |name| Some(name.to_owned()));
        assert_eq!(
            pair,
            selected_context_digest(" LANG , TZ ", |name| Some(name.to_owned()))
        );
    }

    #[test]
    fn go_s_assertion_forms_are_the_failure_report_and_testify() {
        // A Go test states its claim with an `if` and reports the violation,
        // so there is no assertion expression to point at: the report is the
        // site. testify is the other form nearly every Go suite uses.
        let source = "package p\n\nimport (\n\t\"testing\"\n\n\t\"github.com/stretchr/testify/assert\"\n\t\"github.com/stretchr/testify/require\"\n)\n\nfunc TestThings(t *testing.T) {\n\tif got := f(); got != 1 {\n\t\tt.Errorf(\"got %d\", got)\n\t}\n\tif err := g(); err != nil {\n\t\tt.Fatal(err)\n\t}\n\tassert.Equal(t, 1, f())\n\trequire.NoError(t, g())\n\tt.Log(\"not a claim\")\n\tfmt.Errorf(\"not a claim either\")\n}\n";
        let operations = go_ranges(source)
            .expect("parse")
            .into_iter()
            .map(|(_, _, operation)| operation)
            .collect::<Vec<_>>();
        assert_eq!(
            operations,
            ["t.Errorf", "t.Fatal", "assert.Equal", "require.NoError"],
            "fmt.Errorf is the same shape as t.Errorf and is not a claim"
        );
    }

    #[test]
    fn a_subtest_and_a_benchmark_name_their_harness_whatever_they_like() {
        // `t` is the convention, not a rule: a subtest closure rebinds it, a
        // benchmark calls it `b`, and a file is free to choose. Taking the
        // name from the declaration is what makes all three work.
        let source = "package p\n\nimport \"testing\"\n\nfunc TestOuter(outer *testing.T) {\n\touter.Run(\"inner\", func(inner *testing.T) {\n\t\tinner.Fatal(\"inner failed\")\n\t})\n}\n\nfunc BenchmarkThing(b *testing.B) {\n\tb.Fatalf(\"setup failed\")\n}\n";
        let operations = go_ranges(source)
            .expect("parse")
            .into_iter()
            .map(|(_, _, operation)| operation)
            .collect::<Vec<_>>();
        assert_eq!(operations, ["inner.Fatal", "b.Fatalf"]);
    }

    #[test]
    fn the_jvm_s_assertion_forms_are_recognised_by_shape_not_by_framework() {
        // JUnit, TestNG, AssertJ, Hamcrest and kotlin.test all spell theirs
        // the same way, so one rule covers every one of them without naming a
        // framework or pinning a version.
        let java = "class T {\n  void t() {\n    assertEquals(1, f());\n    Assertions.assertTrue(g());\n    assertThat(h()).isEqualTo(2);\n    org.junit.Assert.fail(\"boom\");\n    log(\"not a claim\");\n  }\n}";
        let operations = jvm_ranges(java, crate::jvm_instrumenter::JvmLanguage::Java)
            .expect("parse")
            .into_iter()
            .map(|(_, _, operation)| operation)
            .collect::<Vec<_>>();
        for expected in ["assertEquals", "assertTrue", "assertThat", "fail"] {
            assert!(
                operations
                    .iter()
                    .any(|operation| operation.ends_with(expected)),
                "{expected} missing from {operations:?}"
            );
        }
        assert!(
            !operations.iter().any(|operation| operation.contains("log")),
            "{operations:?}"
        );

        let kotlin = "fun t() {\n    assertEquals(1, f())\n    assertTrue(g())\n    println(\"not a claim\")\n}\n";
        let operations = jvm_ranges(kotlin, crate::jvm_instrumenter::JvmLanguage::Kotlin)
            .expect("parse")
            .into_iter()
            .map(|(_, _, operation)| operation)
            .collect::<Vec<_>>();
        for expected in ["assertEquals", "assertTrue"] {
            assert!(
                operations
                    .iter()
                    .any(|operation| operation.ends_with(expected)),
                "{expected} missing from {operations:?}"
            );
        }
        assert!(
            !operations
                .iter()
                .any(|operation| operation.contains("println")),
            "{operations:?}"
        );
    }
}
