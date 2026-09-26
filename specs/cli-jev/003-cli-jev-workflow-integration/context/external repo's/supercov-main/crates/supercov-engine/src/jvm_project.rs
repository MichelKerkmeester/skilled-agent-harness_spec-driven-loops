//! JVM project discovery for Maven and Gradle layouts.
//!
//! Both build systems put tests under `src/test` and product source under
//! `src/main`, and have done for twenty years. That convention is stronger
//! than any heuristic a coverage tool could invent, so it is the rule here:
//! a file's place in the tree decides what it is, not its name.
//!
//! Where the convention is absent — a loose file outside `src` — the file is
//! reported as out of scope rather than guessed at. Measuring source this
//! project's tests were never pointed at would put obligations in the
//! denominator nobody agreed to.

use std::path::{Path, PathBuf};

use crate::coverage_report::CoverageManifest;
use crate::go_instrumenter::GoProbe;
use crate::integrity::ExplicitIntegrityInputs;
use crate::jvm_instrumenter::{JvmLanguage, build_jvm_obligations};

/// Directories that never hold this project's measured source.
const EXCLUDED_DIRECTORIES: &[&str] = &[
    ".git",
    ".gradle",
    ".idea",
    ".mvn",
    ".vscode",
    "build",
    "node_modules",
    "out",
    "target",
];

/// Files that pin what the build resolves to.
const DEPENDENCY_FILES: &[&str] = &[
    "build.gradle",
    "build.gradle.kts",
    "gradle.properties",
    "libs.versions.toml",
    "pom.xml",
    "settings.gradle",
    "settings.gradle.kts",
    "gradle-wrapper.properties",
];

/// Configuration that decides what actually executes.
const CONFIGURATION_FILES: &[&str] = &[".java-version", ".sdkmanrc", "junit-platform.properties"];

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct JvmFiles {
    /// Relative, `/`-separated paths of measured application sources, paired
    /// with the language that reads them.
    pub sources: Vec<(String, JvmLanguage)>,
    pub tests: Vec<(String, JvmLanguage)>,
    pub dependency_files: Vec<PathBuf>,
    pub configuration_files: Vec<PathBuf>,
    pub excluded: Vec<(String, &'static str)>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct PreparedJvmProject {
    pub root: PathBuf,
    pub files: JvmFiles,
    pub manifest: CoverageManifest,
    pub probes: std::collections::BTreeMap<u64, GoProbe>,
    pub decision_widths: Vec<u8>,
    /// Each measured source and what it becomes once instrumented, in
    /// discovery order. Carried rather than recomputed: preparing the
    /// obligations already parsed and rewrote every file.
    pub instrumented: Vec<(String, String)>,
    /// Files that did not parse, with the reason. Reported rather than skipped:
    /// a hole in the denominator nobody is told about is a wrong number.
    pub unparseable: Vec<(String, String)>,
}

/// Which build system, decided by what is actually in the tree.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum JvmBuild {
    Maven,
    Gradle,
    /// Sources laid out conventionally with no build file; still measurable.
    Plain,
}

pub fn detect_build(root: &Path) -> JvmBuild {
    if root.join("pom.xml").is_file() {
        return JvmBuild::Maven;
    }
    for name in [
        "build.gradle",
        "build.gradle.kts",
        "settings.gradle",
        "settings.gradle.kts",
    ] {
        if root.join(name).is_file() {
            return JvmBuild::Gradle;
        }
    }
    JvmBuild::Plain
}

fn language_of(name: &str) -> Option<JvmLanguage> {
    if name.ends_with(".java") {
        return Some(JvmLanguage::Java);
    }
    if name.ends_with(".kt") {
        return Some(JvmLanguage::Kotlin);
    }
    None
}

/// Maven and Gradle both mean the same thing by these paths, and have for
/// long enough that the convention is more reliable than any name-based guess.
fn role(relative: &str) -> Option<&'static str> {
    let mut parts = relative.split('/');
    while let Some(part) = parts.next() {
        if part != "src" {
            continue;
        }
        // `src/<sourceSet>/<language>/...`, where the source set is `main`,
        // `test`, or a custom one a project defined.
        return match parts.next() {
            Some("test") | Some("integrationTest") | Some("testFixtures") => Some("test"),
            Some("main") => Some("main"),
            // A Kotlin Multiplatform project names its source sets by target:
            // `jvmMain` builds for the JVM and nothing else, so it is measured
            // like any other main. `commonMain` builds for every target the
            // project declares, and a probe there is a call to a runtime that
            // exists only on the JVM -- so it is measured only where the JVM
            // is the only target, which `discover_jvm_files` decides.
            Some("jvmMain") => Some("main"),
            Some("commonMain") => Some("common"),
            // Tests are never instrumented on the JVM -- attribution comes
            // from the framework's own lifecycle -- so recognising a test
            // source set only decides whether a module has tests at all.
            Some(set) if set.ends_with("Test") => Some("test"),
            Some(_) => Some("other"),
            None => None,
        };
    }
    None
}

/// Whether the JVM is the only target this build produces.
///
/// A Kotlin Multiplatform build compiles `commonMain` for every target it
/// declares. Instrumenting it inserts a call to a runtime that exists on the
/// JVM and nowhere else, so where anything but the JVM is declared that source
/// is left alone: losing its coverage is a cost, and breaking the build that
/// produces the other targets is not a trade worth making.
fn targets_only_the_jvm(root: &Path) -> bool {
    let mut text = String::new();
    for name in ["build.gradle.kts", "build.gradle", "pom.xml"] {
        if let Ok(own) = std::fs::read_to_string(root.join(name)) {
            text.push_str(&own);
            text.push('\n');
        }
    }
    ![
        "js(",
        "wasmJs(",
        "wasmWasi(",
        "linuxX64(",
        "macosX64(",
        "macosArm64(",
        "mingwX64(",
        "iosArm64(",
        "iosX64(",
        "iosSimulatorArm64(",
        "watchos",
        "tvos",
        "androidNativeArm64(",
    ]
    .iter()
    .any(|target| text.contains(target))
}

fn walk(root: &Path, directory: &Path, files: &mut JvmFiles) -> Result<(), String> {
    let jvm_only = targets_only_the_jvm(root);
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
                    .push((relative, "build output or tooling directory"));
                continue;
            }
            walk(root, &path, files)?;
            continue;
        }
        if !file_type.is_file() {
            continue;
        }
        if DEPENDENCY_FILES.contains(&name.as_str()) {
            files.dependency_files.push(PathBuf::from(&relative));
            continue;
        }
        if CONFIGURATION_FILES.contains(&name.as_str()) {
            files.configuration_files.push(PathBuf::from(&relative));
            continue;
        }
        let Some(language) = language_of(&name) else {
            continue;
        };
        match role(&relative) {
            Some("main") => files.sources.push((relative, language)),
            Some("test") => files.tests.push((relative, language)),
            Some("common") if jvm_only => files.sources.push((relative, language)),
            Some("common") => files.excluded.push((
                relative,
                "shared with a target that has no Supercov runtime",
            )),
            Some(other) => files.excluded.push((
                relative,
                if other == "other" {
                    "a source set that is neither main nor test"
                } else {
                    other
                },
            )),
            // A loose file outside `src` was never pointed at by this
            // project's build, so measuring it would add obligations nobody
            // agreed to.
            None => files.excluded.push((relative, "outside a src source set")),
        }
    }
    Ok(())
}

pub fn discover_jvm_files(root: &Path) -> Result<JvmFiles, String> {
    let mut files = JvmFiles::default();
    walk(root, root, &mut files)?;
    files.sources.sort();
    files.tests.sort();
    files.dependency_files.sort();
    files.configuration_files.sort();
    files.excluded.sort();
    Ok(files)
}

const LANGUAGE: &str = "jvm";

/// A file the parser could not read is a hole in the denominator, and a hole
/// nobody can see is worse than one they can. A diagnostic line scrolls past;
/// this puts the file in the manifest, so it reaches the declaration's
/// structural limitations and `supercov runs latest` can still name it long
/// after the build log is gone.
fn unparseable_limitation(file: &str, reason: &str) -> serde_json::Value {
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

pub fn prepare_jvm_project(
    root: &Path,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<PreparedJvmProject, String> {
    let mut files = discover_jvm_files(root)?;
    if let Some(roots) = roots {
        roots.narrow(
            &mut files.sources,
            &mut files.excluded,
            |(file, _): &(String, JvmLanguage)| file.as_str(),
        );
        roots.refuse_if_empty(files.sources.len(), "Java or Kotlin")?;
    }
    if files.sources.is_empty() && files.tests.is_empty() {
        return Err(
            "no Java or Kotlin sources were found under src/main or src/test; Supercov measures the source sets Maven and Gradle define"
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
    let mut widths = Vec::new();
    let mut instrumented = Vec::new();
    let mut unparseable = Vec::new();
    let mut next_probe = 0_u64;
    let mut next_decision = 0_u32;
    for (relative, language) in &files.sources {
        let path = root.join(relative);
        let Ok(source) = std::fs::read_to_string(&path) else {
            let reason = "file could not be read as UTF-8";
            manifest
                .limitations
                .push(unparseable_limitation(relative, reason));
            unparseable.push((relative.clone(), reason.to_owned()));
            continue;
        };
        match build_jvm_obligations(
            relative,
            &source,
            *language,
            &mut next_probe,
            &mut next_decision,
        ) {
            Ok(obligations) => {
                manifest.decisions.extend(obligations.manifest.decisions);
                manifest.points.extend(obligations.manifest.points);
                manifest.branches.extend(obligations.manifest.branches);
                manifest
                    .limitations
                    .extend(obligations.manifest.limitations);
                probes.extend(obligations.probes);
                widths.extend(obligations.decision_widths);
                instrumented.push((
                    relative.clone(),
                    crate::jvm_instrumenter::rewrite(&source, &obligations.edits),
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
        let kept = files
            .sources
            .iter()
            .map(|(file, _)| file.clone())
            .collect::<Vec<_>>();
        manifest.scope = Some(
            serde_json::to_value(
                roots
                    .scope(&kept, &files.excluded)
                    .map_err(|error| error.to_string())?,
            )
            .map_err(|error| error.to_string())?,
        );
    }
    Ok(PreparedJvmProject {
        root: root.to_owned(),
        files,
        manifest,
        probes,
        decision_widths: widths,
        instrumented,
        unparseable,
    })
}

/// Integrity inputs: the ambient environment is absent, as it is everywhere.
pub fn jvm_integrity_inputs(files: &JvmFiles, command: &[String]) -> ExplicitIntegrityInputs {
    ExplicitIntegrityInputs {
        source_files: files
            .sources
            .iter()
            .map(|(path, _)| PathBuf::from(path))
            .collect(),
        test_files: files
            .tests
            .iter()
            .map(|(path, _)| PathBuf::from(path))
            .collect(),
        dependency_files: files.dependency_files.clone(),
        configuration_files: files.configuration_files.clone(),
        execution_configuration: command.join("\0").into_bytes(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    fn fixture(label: &str) -> PathBuf {
        let root = std::env::temp_dir().join(format!(
            "supercov-jvm-project-{label}-{}-{}",
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
    fn explicit_roots_narrow_the_jvm_to_the_code_they_name() {
        let root = fixture("explicit-roots");
        write(&root, "pom.xml", "<project/>");
        write(
            &root,
            "src/main/java/app/Good.java",
            "class Good { int f(int a) { return a; } }",
        );
        write(
            &root,
            "src/main/java/shaded/Dep.java",
            "class Dep { int g() { return 1; } }",
        );

        let project =
            prepare_jvm_project(&root, Some(&explicit_roots(&root, &["src/main/java/app"])))
                .unwrap();
        assert_eq!(
            project
                .files
                .sources
                .iter()
                .map(|(file, _)| file.as_str())
                .collect::<Vec<_>>(),
            ["src/main/java/app/Good.java"],
            "{:?}",
            project.files
        );
        assert!(
            project.files.excluded.contains(&(
                "src/main/java/shaded/Dep.java".into(),
                "outside explicit source roots"
            )),
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
        assert!(
            prepare_jvm_project(&root, None)
                .unwrap()
                .manifest
                .scope
                .is_none()
        );
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn the_source_set_decides_what_a_file_is_not_its_name() {
        // Maven and Gradle have meant the same thing by these paths for
        // twenty years, which is a stronger signal than any name-based guess a
        // coverage tool could invent. `TestHelper.java` under src/main is
        // product source; `Calculator.java` under src/test is a test.
        let root = fixture("layout");
        write(&root, "pom.xml", "<project/>");
        write(
            &root,
            "src/main/java/app/TestHelper.java",
            "class TestHelper {}",
        );
        write(&root, "src/main/kotlin/app/Api.kt", "class Api");
        write(
            &root,
            "src/test/java/app/Calculator.java",
            "class Calculator {}",
        );
        write(&root, "src/test/kotlin/app/ApiTest.kt", "class ApiTest");

        let files = discover_jvm_files(&root).unwrap();
        assert_eq!(
            files.sources,
            [
                (
                    "src/main/java/app/TestHelper.java".to_owned(),
                    JvmLanguage::Java
                ),
                ("src/main/kotlin/app/Api.kt".to_owned(), JvmLanguage::Kotlin),
            ]
        );
        assert_eq!(
            files.tests,
            [
                (
                    "src/test/java/app/Calculator.java".to_owned(),
                    JvmLanguage::Java
                ),
                (
                    "src/test/kotlin/app/ApiTest.kt".to_owned(),
                    JvmLanguage::Kotlin
                ),
            ]
        );
        assert_eq!(detect_build(&root), JvmBuild::Maven);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn build_output_and_loose_files_are_out_of_scope_rather_than_guessed_at() {
        // `target` and `build` hold compiled copies of the same source, and a
        // file outside `src` was never pointed at by the build. Measuring
        // either adds obligations nobody agreed to.
        let root = fixture("scope");
        write(&root, "build.gradle.kts", "plugins { java }");
        write(&root, "gradle/libs.versions.toml", "[versions]");
        write(&root, ".java-version", "21");
        write(&root, "src/main/java/app/Api.java", "class Api {}");
        write(&root, "target/classes/app/Api.java", "class Api {}");
        write(&root, "build/generated/app/Gen.java", "class Gen {}");
        write(&root, "Scratch.java", "class Scratch {}");

        let files = discover_jvm_files(&root).unwrap();
        assert_eq!(files.sources.len(), 1);
        assert_eq!(files.sources[0].0, "src/main/java/app/Api.java");
        assert!(
            files
                .excluded
                .iter()
                .any(|(path, why)| path == "Scratch.java" && *why == "outside a src source set")
        );
        assert_eq!(detect_build(&root), JvmBuild::Gradle);
        assert!(
            files
                .dependency_files
                .contains(&PathBuf::from("gradle/libs.versions.toml"))
        );
        assert_eq!(files.configuration_files, [PathBuf::from(".java-version")]);
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_file_that_does_not_parse_is_reported_rather_than_skipped() {
        let root = fixture("unparseable");
        write(&root, "pom.xml", "<project/>");
        write(
            &root,
            "src/main/java/app/Good.java",
            "class Good { boolean f(int a, boolean b) { if (a > 1 && b) { return true; } return false; } }",
        );
        write(
            &root,
            "src/main/java/app/Broken.java",
            "class Broken { void f( {",
        );

        let project = prepare_jvm_project(&root, None).unwrap();
        assert_eq!(project.unparseable.len(), 1);
        assert!(project.unparseable[0].0.ends_with("Broken.java"));
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
            declared[0]["file"]
                .as_str()
                .unwrap()
                .ends_with("Broken.java"),
            "{declared:?}"
        );
        assert!(
            declared[0]["id"].as_str().is_some_and(|id| !id.is_empty()),
            "the declaration needs an id to reference: {declared:?}"
        );
        assert_eq!(project.manifest.decisions.len(), 1);
        assert_eq!(project.decision_widths, [2]);
        assert!(!project.probes.is_empty());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_project_with_nothing_to_measure_is_refused() {
        // Zero of zero satisfies every floor, so reporting success for a
        // project that proved nothing is worse than refusing to start.
        let root = fixture("empty");
        write(&root, "pom.xml", "<project/>");
        assert!(prepare_jvm_project(&root, None).is_err());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_multiplatform_layout_is_measured_where_the_jvm_is_the_only_target() {
        // Kotlin Multiplatform names its source sets by target, so `src/main`
        // never appears and the whole project used to be invisible. jvmMain
        // builds for the JVM and nothing else, so it is measured like any
        // other main; commonMain builds for every target declared, and a probe
        // there calls a runtime that exists only on the JVM.
        let root = fixture("kmp-jvm");
        fs::write(root.join("build.gradle.kts"), "kotlin {\n    jvm()\n}\n").unwrap();
        for (path, body) in [
            ("src/commonMain/kotlin/Shared.kt", "fun shared() {}"),
            ("src/jvmMain/kotlin/Jvm.kt", "fun onlyJvm() {}"),
            ("src/commonTest/kotlin/SharedTest.kt", "fun sharedTest() {}"),
            ("src/jvmTest/kotlin/JvmTest.kt", "fun jvmTest() {}"),
        ] {
            let full = root.join(path);
            fs::create_dir_all(full.parent().unwrap()).unwrap();
            fs::write(full, body).unwrap();
        }
        let files = discover_jvm_files(&root).expect("discovery");
        assert_eq!(
            files
                .sources
                .iter()
                .map(|(p, _)| p.as_str())
                .collect::<Vec<_>>(),
            [
                "src/commonMain/kotlin/Shared.kt",
                "src/jvmMain/kotlin/Jvm.kt"
            ]
        );
        assert_eq!(
            files
                .tests
                .iter()
                .map(|(p, _)| p.as_str())
                .collect::<Vec<_>>(),
            [
                "src/commonTest/kotlin/SharedTest.kt",
                "src/jvmTest/kotlin/JvmTest.kt"
            ]
        );

        // Declare a second target and the shared source is left alone, because
        // instrumenting it would stop the build that produces that target.
        // Losing its coverage costs a measurement; breaking the build costs
        // the thing being measured.
        fs::write(
            root.join("build.gradle.kts"),
            "kotlin {\n    jvm()\n    js(IR) { nodejs() }\n}\n",
        )
        .unwrap();
        let files = discover_jvm_files(&root).expect("discovery");
        assert_eq!(
            files
                .sources
                .iter()
                .map(|(p, _)| p.as_str())
                .collect::<Vec<_>>(),
            ["src/jvmMain/kotlin/Jvm.kt"]
        );
        assert!(
            files
                .excluded
                .iter()
                .any(|(path, reason)| path == "src/commonMain/kotlin/Shared.kt"
                    && *reason == "shared with a target that has no Supercov runtime"),
            "{:?}",
            files.excluded
        );
        fs::remove_dir_all(root).unwrap();
    }
}
