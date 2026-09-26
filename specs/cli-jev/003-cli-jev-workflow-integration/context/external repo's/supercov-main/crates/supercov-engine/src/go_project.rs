//! Go project discovery: what Supercov measures, and what it deliberately does not.
//!
//! Go settles two questions other languages leave ambiguous. A test file is
//! exactly one ending in `_test.go` — the toolchain enforces it, so there is no
//! heuristic to get wrong. And `vendor/` and `testdata/` have meanings fixed by
//! the toolchain: vendored code is someone else's, and the compiler ignores
//! `testdata` entirely, so measuring either would put obligations on code this
//! project's tests were never meant to exercise.

use std::collections::BTreeSet;
use std::path::{Path, PathBuf};

use crate::coverage_report::CoverageManifest;
use crate::go_instrumenter::{GoProbe, build_go_obligations};
use crate::integrity::ExplicitIntegrityInputs;

/// Directories whose contents are never this project's measured source.
///
/// `vendor` and `testdata` are toolchain-defined. The rest are conventional
/// build and tooling output that happens to contain `.go` files.
const EXCLUDED_DIRECTORIES: &[&str] = &[
    ".git",
    ".idea",
    ".vscode",
    "bin",
    "node_modules",
    "testdata",
    "third_party",
    "vendor",
];

/// Files that pin what the build resolves to.
const DEPENDENCY_FILES: &[&str] = &[
    "go.mod",
    "go.sum",
    "go.work",
    "go.work.sum",
    "vendor/modules.txt",
];

/// Configuration that decides what actually executes.
const CONFIGURATION_FILES: &[&str] = &[".go-version", "go.env"];

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct GoFiles {
    /// Relative, `/`-separated paths of measured application sources.
    pub sources: Vec<String>,
    /// Relative paths of `_test.go` files.
    pub tests: Vec<String>,
    pub dependency_files: Vec<PathBuf>,
    pub configuration_files: Vec<PathBuf>,
    pub excluded: Vec<(String, &'static str)>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct PreparedGoProject {
    pub root: PathBuf,
    pub files: GoFiles,
    pub manifest: CoverageManifest,
    pub probes: std::collections::BTreeMap<u64, GoProbe>,
    /// Each measured source and what it becomes once instrumented, in
    /// discovery order. Carried rather than recomputed: preparing the
    /// obligations already parsed and rewrote every file, and parsing a
    /// project twice to get the same answer is the kind of cost that shows up
    /// as a slow tool with no explanation.
    pub instrumented: Vec<(String, String)>,
    /// Conditions per decision, indexed the way the runtime indexes its
    /// decision state.
    pub decision_widths: Vec<u8>,
    /// Files that did not parse, with the reason. They are reported rather
    /// than skipped silently: a file Supercov cannot read is a hole in the
    /// denominator, and a hole nobody is told about is a wrong number.
    pub unparseable: Vec<(String, String)>,
}

/// A Go test file is exactly one whose name ends `_test.go`. The toolchain
/// enforces this, so unlike every other language there is no guessing here.
pub fn is_test_file(relative: &str) -> bool {
    relative
        .rsplit('/')
        .next()
        .is_some_and(|name| name.ends_with("_test.go"))
}

/// The module directories a `go.work` declares, relative to the workspace root
/// and `/`-separated.
///
/// Empty when there is no workspace, which is also the answer for a repository
/// that simply has one module at its root.
pub fn workspace_modules(root: &Path) -> BTreeSet<String> {
    let Ok(text) = std::fs::read_to_string(root.join("go.work")) else {
        return BTreeSet::new();
    };
    let mut modules = BTreeSet::new();
    let mut in_block = false;
    for line in text.lines() {
        let line = line.split("//").next().unwrap_or_default().trim();
        if line.is_empty() {
            continue;
        }
        // `use ./a`, or a `use (` block of one directory per line.
        let entry = if in_block {
            if line == ")" {
                in_block = false;
                continue;
            }
            Some(line)
        } else if let Some(rest) = line.strip_prefix("use ") {
            let rest = rest.trim();
            if rest == "(" {
                in_block = true;
                continue;
            }
            Some(rest)
        } else {
            if line.starts_with("use(") {
                in_block = true;
            }
            None
        };
        if let Some(entry) = entry {
            let entry = entry.trim_matches('"').trim();
            let entry = entry.strip_prefix("./").unwrap_or(entry);
            let entry = entry.trim_end_matches('/');
            if !entry.is_empty() {
                modules.insert(if entry == "." {
                    ".".to_owned()
                } else {
                    entry.replace('\\', "/")
                });
            }
        }
    }
    modules
}

fn walk(root: &Path, directory: &Path, files: &mut GoFiles) -> Result<(), String> {
    let members = workspace_modules(root);
    let entries = std::fs::read_dir(directory)
        .map_err(|error| format!("could not read {}: {error}", directory.display()))?;
    let mut sorted = entries
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("could not read {}: {error}", directory.display()))?;
    sorted.sort_by_key(std::fs::DirEntry::path);
    for entry in sorted {
        let path = entry.path();
        let Ok(relative) = path.strip_prefix(root) else {
            continue;
        };
        let relative = relative.to_string_lossy().replace('\\', "/");
        let name = path
            .file_name()
            .map(|name| name.to_string_lossy().into_owned())
            .unwrap_or_default();
        let file_type = entry
            .file_type()
            .map_err(|error| format!("could not inspect {}: {error}", path.display()))?;
        if file_type.is_dir() {
            if EXCLUDED_DIRECTORIES.contains(&name.as_str()) || name.starts_with('.') {
                files
                    .excluded
                    .push((relative, "tooling or vendored directory"));
                continue;
            }
            // A directory with a go.mod of its own is a different module. The
            // toolchain does not compile it as part of this one -- `go test
            // ./...` walks straight past it -- so measuring it would put
            // obligations in the denominator that no test here can reach, and
            // writing a probe file there would import a runtime the nested
            // module cannot resolve. That turns a build that worked into one
            // that does not.
            if path.join("go.mod").is_file() && !members.contains(&relative) {
                files.excluded.push((relative, "a module of its own"));
                continue;
            }
            walk(root, &path, files)?;
            continue;
        }
        if !file_type.is_file() {
            continue;
        }
        if DEPENDENCY_FILES.contains(&relative.as_str()) {
            files.dependency_files.push(PathBuf::from(&relative));
            continue;
        }
        if CONFIGURATION_FILES.contains(&name.as_str()) {
            files.configuration_files.push(PathBuf::from(&relative));
            continue;
        }
        if !name.ends_with(".go") {
            continue;
        }
        if is_test_file(&relative) {
            files.tests.push(relative);
        } else {
            files.sources.push(relative);
        }
    }
    Ok(())
}

pub fn discover_go_files(root: &Path) -> Result<GoFiles, String> {
    let mut files = GoFiles::default();
    walk(root, root, &mut files)?;
    files.sources.sort();
    files.tests.sort();
    files.dependency_files.sort();
    files.configuration_files.sort();
    files.excluded.sort();
    Ok(files)
}

const LANGUAGE: &str = "go";

/// A file the parser could not read is a hole in the denominator, and a hole
/// nobody can see is worse than one they can. A diagnostic line scrolls past;
/// this puts the file in the manifest, so it reaches the declaration's
/// structural limitations and `supercov runs latest` can still name it long
/// after the build log is gone.
pub(crate) fn unparseable_limitation(file: &str, reason: &str) -> serde_json::Value {
    serde_json::json!({
        "id": crate::go_instrumenter::stable_obligation_id(LANGUAGE, file, "unparseable", 0, 0),
        "kind": "file-does-not-parse",
        "file": file,
        // The surface is the whole file: there is no construct to quote,
        // because nothing in it parsed.
        "source": file,
        "line": 1,
        "column": 1,
        "reason": format!(
            "{reason}; the file carries no obligations and nothing in it counts towards this run"
        ),
    })
}

pub fn prepare_go_project(
    root: &Path,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<PreparedGoProject, String> {
    let mut files = discover_go_files(root)?;
    if let Some(roots) = roots {
        roots.narrow(&mut files.sources, &mut files.excluded, String::as_str);
        roots.refuse_if_empty(files.sources.len(), "Go")?;
    }
    if files.sources.is_empty() && files.tests.is_empty() {
        return Err(
            "no Go source files were found under the project root; Supercov measures .go files outside vendor, testdata and tooling directories"
                .into(),
        );
    }
    let mut manifest = CoverageManifest {
        decisions: Vec::new(),
        points: Vec::new(),
        branches: Vec::new(),
        limitations: Vec::new(),
        unmeasured: Vec::new(),
        scope: None,
    };
    let mut probes = std::collections::BTreeMap::new();
    let mut instrumented = Vec::new();
    let mut decision_widths = Vec::new();
    let mut unparseable = Vec::new();
    let mut next_probe = 0_u64;
    let mut next_decision = 0_u32;
    for relative in &files.sources {
        let path = root.join(relative);
        let Ok(source) = std::fs::read_to_string(&path) else {
            let reason = "file could not be read as UTF-8";
            manifest
                .limitations
                .push(unparseable_limitation(relative, reason));
            unparseable.push((relative.clone(), reason.to_owned()));
            continue;
        };
        match build_go_obligations(relative, &source, &mut next_probe, &mut next_decision) {
            Ok(obligations) => {
                manifest.decisions.extend(obligations.manifest.decisions);
                manifest.points.extend(obligations.manifest.points);
                manifest.branches.extend(obligations.manifest.branches);
                // What the file could not be measured for travels with what it
                // could. Dropping these left the manifest silently claiming a
                // completeness it had not established.
                manifest
                    .limitations
                    .extend(obligations.manifest.limitations);
                probes.extend(obligations.probes);
                decision_widths.extend(obligations.decision_widths);
                instrumented.push((
                    relative.clone(),
                    crate::go_instrumenter::rewrite(&source, &obligations.edits),
                ));
            }
            Err(error) => {
                manifest
                    .limitations
                    .push(unparseable_limitation(relative, &error.to_string()));
                unparseable.push((relative.clone(), error.to_string()));
            }
        }
    }
    // Only when roots shaped what is measured: without them this frontend
    // records no scope, and its default output stays exactly as it was.
    if let Some(roots) = roots {
        let kept = files.sources.clone();
        manifest.scope = Some(
            serde_json::to_value(
                roots
                    .scope(&kept, &files.excluded)
                    .map_err(|error| error.to_string())?,
            )
            .map_err(|error| error.to_string())?,
        );
    }
    Ok(PreparedGoProject {
        root: root.to_owned(),
        files,
        manifest,
        probes,
        instrumented,
        decision_widths,
        unparseable,
    })
}

/// Integrity inputs: sources and tests are hashed separately, dependency and
/// configuration files identify the environment, and the test command
/// identifies execution.
///
/// The ambient environment is deliberately absent, for the same reason it is
/// absent everywhere else: it is not a property of the project.
pub fn go_integrity_inputs(files: &GoFiles, command: &[String]) -> ExplicitIntegrityInputs {
    ExplicitIntegrityInputs {
        source_files: files.sources.iter().map(PathBuf::from).collect(),
        test_files: files.tests.iter().map(PathBuf::from).collect(),
        dependency_files: files.dependency_files.clone(),
        configuration_files: files.configuration_files.clone(),
        execution_configuration: command.join("\0").into_bytes(),
    }
}

/// The module path declared in `go.mod`, which package identities are relative
/// to.
pub fn module_path(root: &Path) -> Option<String> {
    let text = std::fs::read_to_string(root.join("go.mod")).ok()?;
    text.lines()
        .map(str::trim)
        .find_map(|line| line.strip_prefix("module "))
        .map(|path| path.trim().to_owned())
}

/// Package directories that hold at least one test file, which is the unit
/// `go test` actually runs.
pub fn test_packages(files: &GoFiles) -> Vec<String> {
    files
        .tests
        .iter()
        .map(|test| match test.rsplit_once('/') {
            Some((directory, _)) => directory.to_owned(),
            None => ".".to_owned(),
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    fn fixture(label: &str) -> PathBuf {
        let root = std::env::temp_dir().join(format!(
            "supercov-go-project-{label}-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(&root).unwrap();
        root
    }

    fn write(root: &Path, relative: &str, contents: &str) {
        let path = root.join(relative);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, contents).unwrap();
    }

    fn explicit_roots(root: &Path, roots: &[&str]) -> crate::source_discovery::ExplicitSourceRoots {
        let roots = roots
            .iter()
            .map(|root| (*root).to_owned())
            .collect::<Vec<_>>();
        crate::source_discovery::ExplicitSourceRoots::resolve(root, &roots).unwrap()
    }

    #[test]
    fn explicit_roots_narrow_go_to_the_code_they_name() {
        // `extra`, not `third_party`: Go already leaves third_party, vendor and
        // testdata out by default, and a test passing for that reason would
        // prove nothing about roots. Go had no scope to record at all, so honouring the variable there has
        // to leave a trace of what it did, or it is as invisible as ignoring it.
        let root = fixture("explicit-roots");
        write(&root, "go.mod", "module example.com/app\n");
        write(
            &root,
            "app.go",
            "package main\n\nfunc f(a int) int {\n\treturn a\n}\n",
        );
        write(
            &root,
            "extra/dep.go",
            "package extra\n\nfunc G() int {\n\treturn 1\n}\n",
        );

        let project = prepare_go_project(&root, Some(&explicit_roots(&root, &["app.go"]))).unwrap();
        assert_eq!(project.files.sources, ["app.go"], "{:?}", project.files);
        assert!(
            project
                .files
                .excluded
                .contains(&("extra/dep.go".into(), "outside explicit source roots")),
            "{:?}",
            project.files.excluded
        );
        let scope: crate::source_discovery::SourceScope = serde_json::from_value(
            project
                .manifest
                .scope
                .clone()
                .expect("explicit roots leave a scope"),
        )
        .unwrap();
        assert_eq!(
            scope.mode,
            crate::source_discovery::SourceScopeMode::Explicit
        );
        assert_eq!(scope.roots, ["app.go"]);

        // Unset, Go records no scope, exactly as before.
        assert!(
            prepare_go_project(&root, None)
                .unwrap()
                .manifest
                .scope
                .is_none()
        );
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn a_test_file_is_the_one_the_toolchain_says_it_is() {
        // Go settles this: `_test.go` and nothing else. No directory-name
        // heuristic to disagree with the compiler about.
        for test in ["main_test.go", "pkg/api/handler_test.go", "a/b/z_test.go"] {
            assert!(is_test_file(test), "{test}");
        }
        for source in ["main.go", "pkg/api/handler.go", "testing.go", "pkg/test.go"] {
            assert!(!is_test_file(source), "{source}");
        }
    }

    #[test]
    fn vendored_and_toolchain_directories_are_not_this_project_s_source() {
        // `vendor` is someone else's code and `testdata` is ignored by the
        // compiler itself; measuring either puts obligations on code these
        // tests were never meant to exercise.
        let root = fixture("scope");
        write(&root, "go.mod", "module example.com/app\n\ngo 1.22\n");
        write(&root, "go.sum", "");
        write(&root, ".go-version", "1.22.0\n");
        write(&root, "main.go", "package main\n\nfunc main() {}\n");
        write(
            &root,
            "pkg/api/handler.go",
            "package api\n\nfunc Handle() int {\n\treturn 1\n}\n",
        );
        write(
            &root,
            "pkg/api/handler_test.go",
            "package api\n\nimport \"testing\"\n\nfunc TestHandle(t *testing.T) {}\n",
        );
        write(
            &root,
            "vendor/other/lib.go",
            "package other\n\nfunc X() {}\n",
        );
        write(&root, "testdata/golden.go", "package testdata\n");
        write(&root, "bin/tool.go", "package main\n");

        let files = discover_go_files(&root).unwrap();
        assert_eq!(files.sources, ["main.go", "pkg/api/handler.go"]);
        assert_eq!(files.tests, ["pkg/api/handler_test.go"]);
        assert_eq!(
            files.dependency_files,
            [PathBuf::from("go.mod"), PathBuf::from("go.sum")]
        );
        assert_eq!(files.configuration_files, [PathBuf::from(".go-version")]);
        assert_eq!(module_path(&root).as_deref(), Some("example.com/app"));
        assert_eq!(test_packages(&files), ["pkg/api"]);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_file_that_does_not_parse_is_reported_rather_than_skipped() {
        // A hole in the denominator that nobody is told about is a wrong
        // number, so the project still prepares and names what it could not
        // read.
        let root = fixture("unparseable");
        write(&root, "go.mod", "module example.com/app\n");
        write(
            &root,
            "good.go",
            "package main\n\nfunc f(a int) bool {\n\tif a > 1 && a < 9 {\n\t\treturn true\n\t}\n\treturn false\n}\n",
        );
        write(&root, "broken.go", "package main\n\nfunc f( {\n");

        let project = prepare_go_project(&root, None).unwrap();
        assert_eq!(project.unparseable.len(), 1);
        assert_eq!(project.unparseable[0].0, "broken.go");
        // And the hole it leaves is declared, not merely printed: a
        // diagnostic scrolls past, a limitation reaches the stored run.
        let declared = project
            .manifest
            .limitations
            .iter()
            .filter(|limitation| limitation["kind"] == "file-does-not-parse")
            .collect::<Vec<_>>();
        assert_eq!(declared.len(), 1, "{declared:?}");
        assert!(
            declared[0]["file"].as_str().unwrap().ends_with("broken.go"),
            "{declared:?}"
        );
        assert!(
            declared[0]["id"].as_str().is_some_and(|id| !id.is_empty()),
            "the declaration needs an id to reference: {declared:?}"
        );
        // The readable file still contributed its obligations.
        assert!(!project.manifest.points.is_empty());
        assert_eq!(project.manifest.decisions.len(), 1);
        assert!(!project.probes.is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn an_empty_project_is_refused_rather_than_measured_as_complete() {
        // Zero of zero satisfies every floor, so a project with nothing to
        // measure has to say so instead of reporting success.
        let root = fixture("empty");
        write(&root, "go.mod", "module example.com/app\n");
        assert!(prepare_go_project(&root, None).is_err());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn the_ambient_environment_is_not_part_of_run_identity() {
        // Identity is what the project is, not which shell it was run from.
        let files = GoFiles::default();
        let inputs = go_integrity_inputs(
            &files,
            &["go".to_owned(), "test".to_owned(), "./...".to_owned()],
        );
        assert_eq!(inputs.execution_configuration, b"go\0test\0./...");
    }

    #[test]
    fn a_nested_module_belongs_to_itself() {
        // `go test ./...` walks straight past a directory with a go.mod of its
        // own, so measuring it would put obligations in the denominator that
        // no test here can reach -- and a probe file written there would
        // import a runtime the nested module cannot resolve, which stops the
        // build that worked before Supercov was asked to measure it.
        let root = fixture("nested-module");
        fs::write(root.join("go.mod"), "module example.com/root\n").unwrap();
        fs::write(root.join("root.go"), "package root\n\nfunc A() {}\n").unwrap();
        fs::create_dir_all(root.join("sub")).unwrap();
        fs::write(root.join("sub/go.mod"), "module example.com/sub\n").unwrap();
        fs::write(root.join("sub/sub.go"), "package sub\n\nfunc B() {}\n").unwrap();
        // A plain subdirectory of this module is still measured.
        fs::create_dir_all(root.join("internal")).unwrap();
        fs::write(
            root.join("internal/helper.go"),
            "package internal\n\nfunc C() {}\n",
        )
        .unwrap();

        let files = discover_go_files(&root).expect("discovery");
        assert_eq!(files.sources, ["internal/helper.go", "root.go"]);
        assert!(
            files
                .excluded
                .iter()
                .any(|(path, reason)| path == "sub" && *reason == "a module of its own"),
            "{:?}",
            files.excluded
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_workspace_names_the_modules_it_uses() {
        // go.work writes `use` either inline or as a block, with comments and
        // quoting allowed. Its members are modules Supercov must measure --
        // the opposite of a nested module it must leave alone -- so reading
        // the file wrong means either measuring nothing or breaking a build.
        let root = fixture("go-work");
        fs::write(
            root.join("go.work"),
            "go 1.22\n\n// the services\nuse (\n\t./core\n\t\"./app\"  // quoted\n\t./tools/gen\n)\n",
        )
        .unwrap();
        let modules = workspace_modules(&root);
        assert_eq!(
            modules.iter().map(String::as_str).collect::<Vec<_>>(),
            ["app", "core", "tools/gen"]
        );

        // The inline form says the same thing.
        fs::write(root.join("go.work"), "go 1.22\n\nuse ./only\n").unwrap();
        assert_eq!(
            workspace_modules(&root)
                .iter()
                .map(String::as_str)
                .collect::<Vec<_>>(),
            ["only"]
        );

        // And a repository with no workspace has none, which is how a single
        // module at the root is told apart from a workspace member.
        fs::remove_file(root.join("go.work")).unwrap();
        assert!(workspace_modules(&root).is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_workspace_member_is_measured_where_a_nested_module_is_not() {
        // Both are directories with a go.mod under the root. One is part of
        // what the command runs and one is not, and only go.work says which.
        let root = fixture("go-work-members");
        fs::write(root.join("go.work"), "go 1.22\n\nuse (\n\t./core\n)\n").unwrap();
        for module in ["core", "vendored"] {
            fs::create_dir_all(root.join(module)).unwrap();
            fs::write(
                root.join(module).join("go.mod"),
                format!("module example.com/{module}\n"),
            )
            .unwrap();
            fs::write(
                root.join(module).join("code.go"),
                format!("package {module}\n\nfunc A() {{}}\n"),
            )
            .unwrap();
        }
        let files = discover_go_files(&root).expect("discovery");
        assert_eq!(files.sources, ["core/code.go"]);
        assert!(
            files
                .excluded
                .iter()
                .any(|(path, reason)| path == "vendored" && *reason == "a module of its own"),
            "{:?}",
            files.excluded
        );
        fs::remove_dir_all(root).unwrap();
    }
}
