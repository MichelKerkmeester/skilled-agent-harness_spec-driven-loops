//! Python project discovery and ahead-of-run obligation preparation.
//!
//! The project runs in place: nothing here copies or rewrites sources. Rust
//! reads every in-scope `.py` file once, builds the complete manifest and the
//! runtime probe plan, and records which files were included, excluded or
//! unparseable so the run can say exactly what its denominator covers.

use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::{Path, PathBuf},
};

use serde_json::json;

use crate::{
    coverage_report::CoverageManifest,
    integrity::ExplicitIntegrityInputs,
    python_instrumenter::{
        PYTHON_PROBE_PLAN_VERSION, PythonFilePlan, PythonProbePlan, build_python_obligations,
    },
    source_discovery::{SourceScope, SourceScopeEntry, SourceScopeMode, SourceScopeStatus},
};

pub const UNPARSEABLE_LIMITATION: &str = "python-source-unparseable";

/// Directories that never hold the project's own measured source.
const EXCLUDED_DIRECTORIES: &[&str] = &[
    ".git",
    ".hg",
    ".svn",
    ".supercov",
    ".mcdc-pool",
    ".cache",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    ".env",
    "env",
    ".tox",
    ".nox",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".hypothesis",
    ".eggs",
    "build",
    "dist",
    "target",
    "site-packages",
    "htmlcov",
];

const DEPENDENCY_FILES: &[&str] = &[
    "pyproject.toml",
    "setup.cfg",
    "setup.py",
    "requirements.txt",
    "requirements-dev.txt",
    "Pipfile",
    "Pipfile.lock",
    "poetry.lock",
    "uv.lock",
    "pdm.lock",
];

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct PythonFiles {
    /// Relative, `/`-separated paths of measured application sources.
    pub sources: Vec<String>,
    /// Relative paths of test modules, conftests and other excluded `.py`.
    pub tests: Vec<String>,
    pub dependency_files: Vec<PathBuf>,
    pub configuration_files: Vec<PathBuf>,
    pub excluded: Vec<(String, &'static str)>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct PreparedPythonProject {
    pub root: PathBuf,
    pub files: PythonFiles,
    pub manifest: CoverageManifest,
    pub plan: PythonProbePlan,
    pub unparseable: Vec<(String, String)>,
}

fn is_venv(directory: &Path) -> bool {
    fs::symlink_metadata(directory.join("pyvenv.cfg")).is_ok()
}

fn is_test_path(relative: &str) -> Option<&'static str> {
    let mut components = relative.split('/').peekable();
    let mut file_name = "";
    while let Some(component) = components.next() {
        if components.peek().is_none() {
            file_name = component;
            break;
        }
        if matches!(component, "tests" | "test" | "testing" | "__tests__") {
            return Some("inside a test directory");
        }
    }
    if file_name == "conftest.py" {
        return Some("pytest conftest");
    }
    if file_name.starts_with("test_") && file_name.ends_with(".py") {
        return Some("test module by name");
    }
    if file_name.ends_with("_test.py") || file_name.ends_with("_tests.py") {
        return Some("test module by name");
    }
    if matches!(
        file_name,
        "setup.py" | "noxfile.py" | "tasks.py" | "fabfile.py"
    ) {
        return Some("build/test tooling script");
    }
    None
}

fn walk(
    root: &Path,
    directory: &Path,
    files: &mut PythonFiles,
    all_python: &mut Vec<String>,
) -> Result<(), String> {
    let mut entries = fs::read_dir(directory)
        .map_err(|error| format!("{}: {error}", directory.display()))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())?;
    entries.sort_by_key(fs::DirEntry::file_name);
    for entry in entries {
        let path = entry.path();
        let name = entry.file_name().into_string().map_err(|_| {
            format!(
                "Python project contains a non-UTF-8 path: {}",
                path.display()
            )
        })?;
        let file_type = entry.file_type().map_err(|error| error.to_string())?;
        let relative = path
            .strip_prefix(root)
            .map_err(|_| format!("path escaped root: {}", path.display()))?
            .to_string_lossy()
            .replace('\\', "/");
        if file_type.is_dir() {
            if (EXCLUDED_DIRECTORIES.contains(&name.as_str())
                && (name != "target" || crate::source_discovery::target_is_build_output(&path)))
                || name.ends_with(".egg-info")
                || is_venv(&path)
            {
                files
                    .excluded
                    .push((relative, "tooling or environment directory"));
                continue;
            }
            walk(root, &path, files, all_python)?;
        } else if file_type.is_file() {
            if DEPENDENCY_FILES.contains(&name.as_str())
                || (name.starts_with("requirements") && name.ends_with(".txt"))
            {
                files.dependency_files.push(PathBuf::from(&relative));
                if name != "setup.py" {
                    continue;
                }
            }
            // A type checker and a coverage tool do not change what the code
            // does when it runs, so neither is execution context, any more than
            // a formatter is. pytest and tox decide what executes;
            // `.python-version` decides which interpreter executes it.
            if matches!(name.as_str(), "pytest.ini" | "tox.ini" | ".python-version") {
                files.configuration_files.push(PathBuf::from(&relative));
                continue;
            }
            if !name.ends_with(".py") {
                continue;
            }
            all_python.push(relative.clone());
            match is_test_path(&relative) {
                Some(reason) => {
                    files.tests.push(relative.clone());
                    files.excluded.push((relative, reason));
                }
                None => files.sources.push(relative),
            }
        }
        // Symlinks are neither followed nor measured: a linked source tree is
        // outside the project's own denominator.
    }
    Ok(())
}

pub fn discover_python_files(root: &Path) -> Result<PythonFiles, String> {
    let mut files = PythonFiles::default();
    let mut all_python = Vec::new();
    walk(root, root, &mut files, &mut all_python)?;
    files.sources.sort();
    files.tests.sort();
    files.dependency_files.sort();
    files.configuration_files.sort();
    Ok(files)
}

fn limitation(id: &str, kind: &str, file: &str, reason: &str) -> serde_json::Value {
    json!({
        "id": id,
        "kind": kind,
        "file": file,
        "line": 1,
        "column": 0,
        "source": "",
        "reason": reason
    })
}

pub fn prepare_python_project(
    root: &Path,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<PreparedPythonProject, String> {
    let mut files = discover_python_files(root)?;
    if let Some(roots) = roots {
        roots.narrow(&mut files.sources, &mut files.excluded, String::as_str);
        roots.refuse_if_empty(files.sources.len(), "Python")?;
    }
    if files.sources.is_empty() && files.tests.is_empty() {
        return Err(
            "no Python source files were found under the project root; Supercov measures .py files outside virtual environments, build output and test directories".into(),
        );
    }
    let mut manifest = CoverageManifest {
        unmeasured: Vec::new(),
        decisions: Vec::new(),
        points: Vec::new(),
        branches: Vec::new(),
        limitations: Vec::new(),
        scope: None,
    };
    let mut plan_files = BTreeMap::<String, PythonFilePlan>::new();
    let mut limitation_ids = BTreeSet::new();
    let mut unparseable = Vec::new();
    for relative in &files.sources {
        let path = root.join(relative);
        let source = fs::read(&path).map_err(|error| format!("{}: {error}", path.display()))?;
        let Ok(source) = String::from_utf8(source) else {
            unparseable.push((relative.clone(), "source is not valid UTF-8".to_owned()));
            continue;
        };
        match build_python_obligations(relative, &source) {
            Ok(obligations) => {
                manifest.points.extend(obligations.manifest.points);
                manifest.decisions.extend(obligations.manifest.decisions);
                manifest.branches.extend(obligations.manifest.branches);
                manifest.unmeasured.extend(obligations.manifest.unmeasured);
                for item in obligations.manifest.limitations {
                    let id = item
                        .get("id")
                        .and_then(serde_json::Value::as_str)
                        .unwrap_or_default()
                        .to_owned();
                    if limitation_ids.insert(id) {
                        manifest.limitations.push(item);
                    }
                }
                plan_files.insert(relative.clone(), obligations.plan);
            }
            Err(error) => unparseable.push((relative.clone(), error.to_string())),
        }
    }
    if let Some((file, reason)) = unparseable.first()
        && limitation_ids.insert(UNPARSEABLE_LIMITATION.into())
    {
        manifest.limitations.push(limitation(
            UNPARSEABLE_LIMITATION,
            "source-scope",
            file,
            &format!(
                "{} source file(s) could not be parsed and carry no obligations; first: {file}: {reason}",
                unparseable.len()
            ),
        ));
    }
    manifest.unmeasured.sort();
    manifest.unmeasured.dedup();
    let mut entries = Vec::new();
    for file in &files.sources {
        let unparseable_file = unparseable.iter().any(|(path, _)| path == file);
        entries.push(SourceScopeEntry {
            file: file.clone(),
            status: if unparseable_file {
                SourceScopeStatus::Excluded
            } else {
                SourceScopeStatus::Included
            },
            reason: if unparseable_file {
                "could not be parsed".into()
            } else {
                "Python application source".into()
            },
            package_root: None,
        });
    }
    for (file, reason) in &files.excluded {
        if file.ends_with(".py") {
            entries.push(SourceScopeEntry {
                file: file.clone(),
                status: SourceScopeStatus::Excluded,
                reason: (*reason).into(),
                package_root: None,
            });
        }
    }
    entries.sort_by(|left, right| left.file.cmp(&right.file));
    manifest.scope = Some(
        serde_json::to_value(SourceScope {
            version: 1,
            mode: if roots.is_some() {
                SourceScopeMode::Explicit
            } else {
                SourceScopeMode::Automatic
            },
            roots: match roots {
                Some(roots) => roots.local_roots().map_err(|error| error.to_string())?,
                None => vec![".".into()],
            },
            entries,
        })
        .map_err(|error| error.to_string())?,
    );
    Ok(PreparedPythonProject {
        root: root.to_owned(),
        plan: PythonProbePlan {
            version: PYTHON_PROBE_PLAN_VERSION,
            root: root.display().to_string(),
            files: plan_files,
            assertion_sites: BTreeMap::new(),
        },
        manifest,
        files,
        unparseable,
    })
}

/// Integrity inputs: sources and tests are hashed separately, dependency and
/// configuration files identify the environment, and the test command
/// identifies execution.
///
/// The ambient environment is deliberately absent. It is not a property of the
/// project, it changes with every terminal, and folding it in made a run
/// identity that no two machines could agree on. What a project actually needs
/// from its environment is declared in the files above.
pub fn python_integrity_inputs(files: &PythonFiles, command: &[String]) -> ExplicitIntegrityInputs {
    let execution_configuration = command.join("\0").into_bytes();
    ExplicitIntegrityInputs {
        source_files: files.sources.iter().map(PathBuf::from).collect(),
        test_files: files.tests.iter().map(PathBuf::from).collect(),
        dependency_files: files.dependency_files.clone(),
        configuration_files: files.configuration_files.clone(),
        execution_configuration,
    }
}

#[cfg(test)]
mod tests {

    #[test]
    fn the_ambient_environment_is_not_part_of_run_identity() {
        // Identity is what the project is, not which shell it was run from.
        // Folding the environment in meant no two terminals, and no two
        // machines, ever agreed on the same run. What a project genuinely needs
        // from its environment it declares in the files that are hashed above.
        let files = PythonFiles::default();
        let command = ["pytest".to_owned(), "-q".to_owned()];
        let inputs = python_integrity_inputs(&files, &command);
        assert_eq!(inputs.execution_configuration, b"pytest\0-q");
    }
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;

    fn fixture(name: &str) -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-python-project-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir_all(&root).unwrap();
        root
    }

    fn write(root: &Path, relative: &str, contents: &str) {
        let path = root.join(relative);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, contents).unwrap();
    }

    #[test]
    fn a_type_checker_and_a_coverage_tool_are_not_execution_context() {
        // Neither changes what the code does when it runs, so neither should
        // cost every flow in the map a re-reading. What decides execution does:
        // pytest and tox choose what runs, `.python-version` chooses the
        // interpreter that runs it.
        let root = fixture("inert-tooling");
        write(&root, "pyproject.toml", "[project]\nname='x'\n");
        write(&root, "mypy.ini", "[mypy]\n");
        write(&root, ".coveragerc", "[run]\n");
        write(&root, "pytest.ini", "[pytest]\n");
        write(&root, ".python-version", "3.13\n");
        write(&root, "src/pkg/core.py", "def f(a):\n    return a\n");
        let project = prepare_python_project(&root, None).unwrap();
        assert_eq!(
            project.files.configuration_files,
            [
                PathBuf::from(".python-version"),
                PathBuf::from("pytest.ini")
            ]
        );
        fs::remove_dir_all(root).unwrap();
    }

    fn scope_of(project: &PreparedPythonProject) -> crate::source_discovery::SourceScope {
        serde_json::from_value(project.manifest.scope.clone().expect("a scope")).unwrap()
    }

    fn explicit(root: &Path, roots: &[&str]) -> crate::source_discovery::ExplicitSourceRoots {
        let roots = roots
            .iter()
            .map(|root| (*root).to_owned())
            .collect::<Vec<_>>();
        crate::source_discovery::ExplicitSourceRoots::resolve(root, &roots).unwrap()
    }

    #[test]
    fn explicit_roots_narrow_a_flat_layout_to_the_modules_it_names() {
        // The reported project kept its own modules at the root with a vendored
        // PySide6 tree beside them, and measured 660 files instead of about
        // fifteen: nothing on the Python path read SUPERCOV_SOURCE_ROOTS. A flat
        // layout has no directory to name, so a file has to be a root too, the
        // way it already is for JavaScript.
        let root = fixture("flat-roots");
        write(&root, "a.py", "def f(x):\n    return x if x else 0\n");
        write(&root, "vendor/pkg/b.py", "def g():\n    return 1\n");
        write(&root, "test/test_a.py", "from a import f\n");

        let project = prepare_python_project(&root, Some(&explicit(&root, &["a.py"]))).unwrap();
        assert_eq!(project.files.sources, ["a.py"], "{:?}", project.files);
        assert_eq!(
            project.plan.files.keys().collect::<Vec<_>>(),
            ["a.py"],
            "the runtime is not handed a file the roots leave out, which is what \
             keeps it from being instrumented at all"
        );
        assert!(
            project
                .files
                .excluded
                .contains(&("vendor/pkg/b.py".into(), "outside explicit source roots")),
            "{:?}",
            project.files.excluded
        );
        let scope = scope_of(&project);
        assert_eq!(
            scope.mode,
            crate::source_discovery::SourceScopeMode::Explicit
        );
        assert_eq!(scope.roots, ["a.py"]);

        // A directory is a root just as well, and narrows to what is under it.
        let project = prepare_python_project(&root, Some(&explicit(&root, &["vendor"]))).unwrap();
        assert_eq!(project.files.sources, ["vendor/pkg/b.py"]);

        // Unset, discovery is what it always was.
        let project = prepare_python_project(&root, None).unwrap();
        assert_eq!(project.files.sources, ["a.py", "vendor/pkg/b.py"]);
        assert_eq!(
            scope_of(&project).mode,
            crate::source_discovery::SourceScopeMode::Automatic
        );
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn roots_that_name_nothing_are_refused_rather_than_measuring_nothing() {
        // A typo in the variable must not become a green run over zero files,
        // the failure mode most likely to pass unnoticed in an agent loop.
        let root = fixture("roots-name-nothing");
        write(&root, "a.py", "x = 1\n");
        write(&root, "test/test_a.py", "import a\n");
        let error = prepare_python_project(&root, Some(&explicit(&root, &["scr"]))).unwrap_err();
        assert!(error.contains("SUPERCOV_SOURCE_ROOTS=scr"), "{error}");
        assert!(
            error.contains("scr does not exist"),
            "the typo is what the person needs to see: {error}"
        );
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn a_root_never_pulls_a_test_back_into_the_denominator() {
        // Roots narrow what would be measured; they are not a second way to
        // choose files. A root that happens to contain the test directory must
        // still leave its tests out.
        let root = fixture("roots-keep-tests-out");
        write(&root, "a.py", "x = 1\n");
        write(&root, "test/test_a.py", "import a\n");
        let project = prepare_python_project(&root, Some(&explicit(&root, &["."]))).unwrap();
        assert_eq!(project.files.sources, ["a.py"]);
        assert!(project.files.tests.contains(&"test/test_a.py".to_owned()));
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn separates_sources_tests_environments_and_tooling() {
        let root = fixture("discover");
        write(&root, "pyproject.toml", "[project]\nname='x'\n");
        write(&root, "pytest.ini", "[pytest]\n");
        write(&root, "src/pkg/__init__.py", "");
        write(&root, "src/pkg/core.py", "def f(a):\n    return a and 1\n");
        write(&root, "tests/test_core.py", "def test():\n    pass\n");
        write(&root, "conftest.py", "");
        write(&root, "setup.py", "print(1)\n");
        write(&root, ".venv/pyvenv.cfg", "home = /usr\n");
        write(&root, ".venv/lib/site.py", "x = 1\n");
        write(&root, "env2/pyvenv.cfg", "home = /usr\n");
        write(&root, "env2/lib/thing.py", "y = 2\n");
        write(&root, "broken/old.py", "print 'python 2'\n");
        let project = prepare_python_project(&root, None).unwrap();
        assert_eq!(
            project.files.sources,
            ["broken/old.py", "src/pkg/__init__.py", "src/pkg/core.py"]
        );
        assert_eq!(
            project.files.tests,
            ["conftest.py", "setup.py", "tests/test_core.py"]
        );
        assert_eq!(
            project.files.dependency_files,
            [PathBuf::from("pyproject.toml"), PathBuf::from("setup.py")]
        );
        assert_eq!(
            project.files.configuration_files,
            [PathBuf::from("pytest.ini")]
        );
        assert_eq!(project.unparseable.len(), 1);
        assert!(project.plan.files.contains_key("src/pkg/core.py"));
        assert!(!project.plan.files.contains_key("broken/old.py"));
        let ids = project
            .manifest
            .limitations
            .iter()
            .map(|item| item["id"].as_str().unwrap().to_owned())
            .collect::<BTreeSet<_>>();
        assert_eq!(ids.len(), 1);
        assert!(ids.contains(UNPARSEABLE_LIMITATION));
        assert!(
            project
                .manifest
                .points
                .iter()
                .all(|point| point.file.starts_with("src/"))
        );
        fs::remove_dir_all(root).unwrap();
    }
}
