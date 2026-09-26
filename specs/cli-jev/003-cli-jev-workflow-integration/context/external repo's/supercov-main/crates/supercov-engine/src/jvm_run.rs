//! Public, isolated JVM coverage run lifecycle, for Java and Kotlin.
//!
//! Supercov owns the probes, so measuring a project means rewriting its
//! sources. That happens on a copy in an isolated workspace; the tree the
//! author edits is never touched.
//!
//! The build system runs the tests, and Supercov puts three things where that
//! build will find them without being reconfigured:
//!
//! - `Supercov` in the main source set, because instrumented product code
//!   stores into its probe array;
//! - `SupercovListener` and a generated `SupercovConfig` in the test source
//!   set, because attribution comes from the JUnit Platform and only the test
//!   classpath has it;
//! - a services file registering the listener, and a
//!   `junit-platform.properties` that turns parallel execution off.
//!
//! That last one is prevention rather than detection. Two tests running at
//! once share one probe array, so the runtime cannot attribute either, and it
//! notices and says so — but the better outcome is that it never happens, and
//! Supercov owns the workspace, so it can simply make sure of it.

use std::{
    collections::{BTreeMap, BTreeSet},
    ffi::OsString,
    fs,
    io::Write,
    path::{Path, PathBuf},
    time::Instant,
};

use serde::{Deserialize, Serialize};

use crate::{
    evidence_archive::write_archive,
    frontend_protocol::validate_frontend_report_request,
    integrity::{FrontendIntegrityInputs, create_explicit_run_integrity},
    jvm_project::{
        JvmBuild, PreparedJvmProject, detect_build, jvm_integrity_inputs, prepare_jvm_project,
    },
    lifecycle::{
        ProjectLock, finalize_published_run, note_kept_evidence, publish_run,
        recover_abandoned_runs, remove_stored_tree_deferred,
    },
    orchestration::{ExecutionPhase, ExecutionPlan, PhaseKind, execute_plan},
    owned_evidence::{
        OwnedRunInputs, OwnedTestOutcome, build_frontend_run, jvm_coverage_model, jvm_declaration,
        merge_evidence, read_evidence,
    },
    process_supervision::{CommandSpec, SupervisionOptions},
    run_store::{RawEvidenceMetadata, RunMetadata, RunTimings},
    workspace::{canonicalize_simplified, prepare_cached_workspace, recover_cached_workspace},
};

const RUNTIME_SOURCE: &str =
    include_str!("../runtime-assets/jvm/com/supercorp/supercov/Supercov.java");
const LISTENER_SOURCE: &str =
    include_str!("../runtime-assets/jvm/com/supercorp/supercov/SupercovListener.java");

const TESTNG_LISTENER_SOURCE: &str =
    include_str!("../runtime-assets/jvm/com/supercorp/supercov/SupercovTestNGListener.java");

const PACKAGE_DIRECTORY: &str = "com/supercorp/supercov";

/// Where the JUnit Platform looks for listeners to register.
const SERVICES_FILE: &str = "META-INF/services/org.junit.platform.launcher.TestExecutionListener";

const LISTENER_CLASS: &str = "com.supercorp.supercov.SupercovListener";

/// Where TestNG looks for listeners to register.
const TESTNG_SERVICES_FILE: &str = "META-INF/services/org.testng.ITestNGListener";

const TESTNG_LISTENER_CLASS: &str = "com.supercorp.supercov.SupercovTestNGListener";

/// Which test frameworks a project actually depends on.
///
/// This decides which listeners are written, and it has to: each is compiled
/// from the project's own test sources, so one whose framework is absent would
/// fail on imports the project never asked for. A project that names neither
/// gets the platform listener, which is what nearly every JVM suite runs on
/// and what Kotest and Spock report through.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Frameworks {
    platform: bool,
    testng: bool,
    /// JUnit 4 with no platform engine beside it. Supercov cannot attribute
    /// such a suite, and must not try: see `frameworks`.
    junit4: bool,
}

/// A Gradle version catalog, read as the accessors a build file writes.
///
/// `testImplementation(libs.junit)` says nothing about which framework that is.
/// `gradle/libs.versions.toml` says `junit = "junit:junit:4.13.2"`. A catalog
/// is how Gradle builds are written now, and to a reader that does not open one
/// every dependency declared through it is invisible: moshi's suite is JUnit 4,
/// was taken for a platform one because nothing said otherwise, and recorded
/// nothing at all while its 25 test classes passed.
///
/// An alias is addressed with dots where it is declared with dashes, so
/// `kotlin-reflect` is written `libs.kotlin.reflect`. Coordinates come back
/// quoted, the shape they would have had written inline, because that is what
/// `frameworks` reads.
fn version_catalog(workspace: &Path) -> BTreeMap<String, String> {
    let mut resolved = BTreeMap::new();
    let Ok(text) = fs::read_to_string(workspace.join("gradle/libs.versions.toml")) else {
        return resolved;
    };
    let Ok(catalog) = text.parse::<toml::Table>() else {
        return resolved;
    };
    let accessor = |alias: &str| alias.replace(['-', '_'], ".");
    if let Some(libraries) = catalog.get("libraries").and_then(toml::Value::as_table) {
        for (alias, value) in libraries {
            let coordinates = match value {
                toml::Value::String(coordinates) => coordinates.clone(),
                toml::Value::Table(table) => {
                    match table.get("module").and_then(toml::Value::as_str) {
                        Some(module) => module.to_owned(),
                        None => match (
                            table.get("group").and_then(toml::Value::as_str),
                            table.get("name").and_then(toml::Value::as_str),
                        ) {
                            (Some(group), Some(name)) => format!("{group}:{name}"),
                            _ => continue,
                        },
                    }
                }
                _ => continue,
            };
            resolved.insert(accessor(alias), format!("\"{coordinates}\""));
        }
    }
    // Naming a bundle depends on every library in it. A bundle is addressed
    // under `libs.bundles.`, a library directly under `libs.`.
    if let Some(bundles) = catalog.get("bundles").and_then(toml::Value::as_table) {
        let libraries = resolved.clone();
        for (alias, value) in bundles {
            let Some(members) = value.as_array() else {
                continue;
            };
            let expanded = members
                .iter()
                .filter_map(toml::Value::as_str)
                .filter_map(|member| libraries.get(&accessor(member)).cloned())
                .collect::<Vec<_>>()
                .join(" ");
            resolved.insert(format!("bundles.{}", accessor(alias)), expanded);
        }
    }
    resolved
}

/// The build text with the coordinates of every catalog accessor it names.
fn with_catalog(text: &str, catalog: &BTreeMap<String, String>) -> String {
    let mut out = text.to_owned();
    for (accessor, coordinates) in catalog {
        // `libs.kotlin` must not answer for `libs.kotlin.reflect`.
        let needle = format!("libs.{accessor}");
        let named = text.match_indices(&needle).any(|(at, _)| {
            text[at + needle.len()..]
                .chars()
                .next()
                .is_none_or(|next| !next.is_alphanumeric() && !matches!(next, '.' | '_' | '-'))
        });
        if named {
            out.push('\n');
            out.push_str(coordinates);
        }
    }
    out
}

fn frameworks(build_file: &str) -> Frameworks {
    let testng = build_file.contains("testng");
    // The platform is what Jupiter, Vintage, Kotest and Spock all run on.
    let platform = [
        "junit-jupiter",
        "junit-platform",
        "junit-vintage",
        "kotest",
        "spock",
    ]
    .iter()
    .any(|name| build_file.contains(name));
    // JUnit 4 is not a platform engine and does not run on one. Surefire runs
    // it through a provider of its own, and choosing that provider is decided
    // by what is on the classpath -- so adding the launcher to a JUnit 4
    // project makes surefire switch to the platform provider, find no engine
    // there, and fail the suite outright.
    let junit4 = !platform
        && (build_file.contains("<groupId>junit</groupId>") || build_file.contains("'junit:junit"))
        || build_file.contains("\"junit:junit");
    Frameworks {
        // A TestNG-only or JUnit-4-only project would fail on a platform
        // listener, so the fallback applies only when nothing was recognised.
        platform: platform || !(testng || junit4),
        testng,
        junit4: junit4 && !platform,
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectJvmRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub started_at: String,
    /// Credit every test with what it reached, by running the suite in order.
    ///
    /// Attribution is a sweep of one shared probe array at each test boundary,
    /// so two tests running at once cannot both be credited. Turning JUnit's
    /// parallel execution off is what buys that, and what it costs is the
    /// suite's own parallelism -- 3.6x on sixteen I/O-bound tests across
    /// fifteen cores. Supercov used to spend that without being asked.
    #[serde(default)]
    pub exact_attribution: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct DirectJvmRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub exit_code: i32,
    pub tests: usize,
    pub source_files: usize,
    pub modules: usize,
    pub build: JvmBuild,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

fn elapsed_ms(started: Instant) -> f64 {
    (started.elapsed().as_secs_f64() * 10_000.0).round() / 10.0
}

fn write(path: &Path, contents: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| format!("{}: {error}", parent.display()))?;
    }
    fs::write(path, contents).map_err(|error| format!("{}: {error}", path.display()))
}

/// The source root Supercov's own Java lands in for a given source set.
///
/// Maven, Gradle and a plain tree have meant the same thing by these paths for
/// long enough that the convention is more reliable than reading a build file,
/// and a Kotlin project compiles Java from here too.
fn source_root(source_set: &str) -> String {
    format!("src/{source_set}/java")
}

/// Java source escaping for a string literal, so a Windows path or a name with
/// a quote in it cannot end the literal early.
fn java_literal(value: &str) -> String {
    let mut out = String::with_capacity(value.len() + 2);
    out.push('"');
    for character in value.chars() {
        match character {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            other => out.push(other),
        }
    }
    out.push('"');
    out
}

/// The runtime, sized for this project.
///
/// A probe is a bare store into the array with nothing checking its bounds,
/// which is what makes it cost one instruction. So the array has to be the
/// right size before any product code runs, rather than only once a listener
/// arms it: a run where no listener starts -- a suite in a language Supercov
/// does not parse, a build that never reaches the test task -- would otherwise
/// throw on the first instrumented line, and Supercov would have turned a
/// passing suite into a failing one.
fn runtime_source(probe_count: usize) -> String {
    let marker = "static final int PROBE_COUNT = 0; // supercov:probe-count";
    debug_assert!(
        RUNTIME_SOURCE.contains(marker),
        "the runtime no longer declares the probe count Supercov substitutes"
    );
    RUNTIME_SOURCE.replace(
        marker,
        &format!("static final int PROBE_COUNT = {probe_count}; // supercov:probe-count"),
    )
}

/// What the listener reads to know the shape of the run it is recording.
fn configuration(probe_count: usize, widths: &[u8], evidence: &Path) -> String {
    let widths = widths
        .iter()
        .map(u8::to_string)
        .collect::<Vec<_>>()
        .join(", ");
    format!(
        "// Code generated by Supercov. DO NOT EDIT.\npackage com.supercorp.supercov;\n\npublic final class SupercovConfig {{\n  private SupercovConfig() {{}}\n\n  public static final int PROBES = {probe_count};\n  public static final int[] WIDTHS = new int[] {{{widths}}};\n  public static final String EVIDENCE = {};\n}}\n",
        java_literal(&evidence.to_string_lossy())
    )
}

/// Whether the project's own configuration asked for parallel execution.
///
/// Only worth telling someone about when it was on: a project that never
/// enabled it is not having anything taken away, and a line about every run
/// is a line nobody reads.
fn asks_for_parallel_execution(existing: Option<&str>) -> bool {
    existing.unwrap_or("").lines().any(|line| {
        let line = line.trim_start();
        line.starts_with("junit.jupiter.execution.parallel.enabled")
            && line
                .split_once('=')
                .is_some_and(|(_, value)| value.trim().eq_ignore_ascii_case("true"))
    })
}

/// The project's JUnit Platform configuration with parallel execution turned
/// off, keeping whatever else it already said.
///
/// Attribution is a sweep of one shared probe array at each test boundary, so
/// two tests running at once cannot both be credited. The runtime notices and
/// degrades honestly; this is the half that means it never has to.
fn sequential_properties(existing: Option<&str>) -> String {
    let mut out = String::new();
    for line in existing.unwrap_or("").lines() {
        if line
            .trim_start()
            .starts_with("junit.jupiter.execution.parallel.enabled")
        {
            continue;
        }
        out.push_str(line);
        out.push('\n');
    }
    out.push_str(
        "# Set by Supercov: probes are a store into one shared array, so two tests running\n\
         # at once cannot both be credited with what they reached.\n\
         junit.jupiter.execution.parallel.enabled=false\n",
    );
    out
}

/// The JUnit Platform artifact the listener is written against.
///
/// `junit-jupiter` does not bring it: Maven's surefire and Gradle's test task
/// both put it on the test *runtime* classpath because they need it
/// themselves, but neither offers it at compile time, so a listener declared
/// in the project's own test sources will not compile without it. Supercov
/// owns the workspace copy, so it adds the dependency there — the same line a
/// person would add, in a tree the author never sees.
const LAUNCHER_ARTIFACT: &str = "junit-platform-launcher";

/// The launcher version to ask for.
///
/// JUnit numbers the platform 1.N alongside Jupiter 5.N, so a project that
/// pins its Jupiter version tells us exactly which launcher agrees with the
/// engine it will run on. A project using the BOM has already said how to
/// version every JUnit artifact, and naming a version there would override the
/// answer it gave.
fn launcher_version(build_file: &str) -> Option<String> {
    // The one case where naming no version is right: a project using the BOM
    // has already said how every JUnit artifact is versioned, and naming one
    // would override the answer it gave. Every other path must produce a
    // version -- a versionless dependency in a pom with no BOM to manage it is
    // one Maven cannot resolve, and the build stops before any test runs.
    if build_file.contains("junit-bom") {
        return None;
    }
    Some(jupiter_version(build_file).unwrap_or_else(|| DEFAULT_LAUNCHER_VERSION.to_owned()))
}

/// The platform version matching whatever Jupiter this file pins, if it pins
/// one. JUnit numbers the platform 1.N alongside Jupiter 5.N.
fn jupiter_version(build_file: &str) -> Option<String> {
    let jupiter = build_file.find("junit-jupiter")?;
    let rest = &build_file[jupiter..];
    rest.match_indices("5.").find_map(|(at, _)| {
        let tail = &rest[at + 2..];
        let minor = tail
            .chars()
            .take_while(char::is_ascii_digit)
            .collect::<String>();
        let patch = tail[minor.len()..]
            .strip_prefix('.')?
            .chars()
            .take_while(char::is_ascii_digit)
            .collect::<String>();
        (!minor.is_empty() && !patch.is_empty()).then(|| format!("1.{minor}.{patch}"))
    })
}

const DEFAULT_LAUNCHER_VERSION: &str = "1.10.2";

/// The engine version matching a platform version: 1.N.P becomes 5.N.P.
fn engine_version_of_platform(platform: &str) -> String {
    match platform.strip_prefix("1.") {
        Some(rest) => format!("5.{rest}"),
        None => platform.to_owned(),
    }
}

/// `pom.xml` with the launcher among its test dependencies.
fn maven_with_launcher(pom: &str) -> Option<String> {
    maven_with_test_artifacts(pom, &[LAUNCHER_ARTIFACT])
}

/// The engine that runs JUnit 4 tests on the JUnit Platform.
///
/// A JUnit 4 suite is not a platform one and cannot be attributed as it
/// stands. Vintage is the platform's own answer: it discovers and runs exactly
/// the same JUnit 4 tests, through the lifecycle Supercov listens to. Adding
/// it to the copy turns a suite Supercov could only decline into one it can
/// measure, and the author's own build still runs JUnit 4 as before.
const VINTAGE_ARTIFACT: &str = "junit-vintage-engine";

fn maven_with_vintage(pom: &str) -> Option<String> {
    maven_with_test_artifacts(pom, &[LAUNCHER_ARTIFACT, VINTAGE_ARTIFACT])
}

fn maven_with_test_artifacts(pom: &str, artifacts: &[&str]) -> Option<String> {
    let missing = artifacts
        .iter()
        .filter(|artifact| !pom.contains(**artifact))
        .collect::<Vec<_>>();
    if missing.is_empty() {
        return None;
    }
    let platform = launcher_version(pom);
    let dependency = missing
        .iter()
        .map(|artifact| {
            // Vintage is versioned with Jupiter, not with the platform: JUnit
            // numbers the engines 5.N and the platform 1.N, and asking for
            // vintage 1.N asks for something that was never published.
            let (group, version) = if **artifact == VINTAGE_ARTIFACT {
                (
                    "org.junit.vintage",
                    platform.as_deref().map(engine_version_of_platform),
                )
            } else {
                ("org.junit.platform", platform.clone())
            };
            let version = version
                .map(|version| format!("\n      <version>{version}</version>"))
                .unwrap_or_default();
            format!(
                "    <dependency>\n      <groupId>{group}</groupId>\n      <artifactId>{artifact}</artifactId>{version}\n      <scope>test</scope>\n    </dependency>\n"
            )
        })
        .collect::<String>();
    match project_dependencies_end(pom) {
        Some(at) => Some(format!("{}{dependency}{}", &pom[..at], &pom[at..])),
        // A project with no dependencies block of its own still needs one.
        None => pom.rfind("</project>").map(|at| {
            format!(
                "{}  <dependencies>\n{dependency}  </dependencies>\n{}",
                &pom[..at],
                &pom[at..]
            )
        }),
    }
}

/// Where the project's own `<dependencies>` ends.
///
/// Not simply the last one. A pom's `<dependencyManagement>` holds a
/// `<dependencies>` too, and so does every `<profile>` and every `<plugin>`;
/// a dependency added inside `<dependencyManagement>` is a version for
/// something else to ask for rather than something the project depends on, so
/// the module compiles exactly as it did before and the listener still cannot
/// find the API it implements. Depth is what tells them apart.
fn project_dependencies_end(pom: &str) -> Option<usize> {
    const NESTED: [&str; 4] = ["dependencyManagement", "profiles", "build", "reporting"];
    let bytes = pom.as_bytes();
    let mut depth = 0usize;
    let mut at = 0usize;
    while at < bytes.len() {
        let Some(open) = pom[at..].find('<') else {
            break;
        };
        let start = at + open;
        let Some(close) = pom[start..].find('>') else {
            break;
        };
        let tag = &pom[start + 1..start + close];
        at = start + close + 1;
        let name = tag.trim_start_matches('/').trim_end_matches('/').trim();
        let name = name.split_whitespace().next().unwrap_or_default();
        if NESTED.contains(&name) {
            if tag.starts_with('/') {
                depth = depth.saturating_sub(1);
            } else if !tag.ends_with('/') {
                depth += 1;
            }
        } else if name == "dependencies" && tag.starts_with('/') && depth == 0 {
            return Some(start);
        }
    }
    None
}

/// Whether a Gradle script already puts the launcher where test *sources* can
/// see it.
///
/// Presence is not enough. Gradle 9 requires every project to declare the
/// launcher itself, and the configuration its own documentation recommends is
/// `testRuntimeOnly` — which puts the artifact on the classpath the tests run
/// with and not the one they compile against. A project following that advice
/// has the artifact and still cannot compile a listener, so the question is
/// which configuration declares it, not whether one does.
fn declares_launcher_for_compilation(build_file: &str) -> bool {
    build_file.lines().any(|line| {
        line.contains(LAUNCHER_ARTIFACT)
            && ["testImplementation", "testCompileOnly", "testApi"]
                .iter()
                .any(|configuration| line.contains(configuration))
    })
}

/// A Gradle build file with the launcher among its test dependencies.
///
/// Appended as its own `dependencies` block rather than edited into the
/// existing one: Gradle merges them, and finding the right brace in a Groovy
/// or Kotlin script by hand is the kind of parsing that works until it does
/// not.
fn gradle_with_launcher(build_file: &str, kotlin: bool) -> Option<String> {
    if declares_launcher_for_compilation(build_file) {
        return None;
    }
    let coordinate = match launcher_version(build_file) {
        Some(version) => format!("org.junit.platform:{LAUNCHER_ARTIFACT}:{version}"),
        None => format!("org.junit.platform:{LAUNCHER_ARTIFACT}"),
    };
    // `allprojects` rather than a bare `dependencies` block, because a
    // multi-project build compiles each subproject's test sources against that
    // subproject's own classpath and a declaration in the root reaches none of
    // them. Guarded by the java plugin so a root that only aggregates — which
    // has no test source set and no configurations to add to — is left alone.
    // In the Kotlin DSL the typed accessor does not exist inside `allprojects`,
    // so the configuration is named as a string.
    let line = if kotlin {
        format!("            \"testImplementation\"(\"{coordinate}\")")
    } else {
        format!("            testImplementation '{coordinate}'")
    };
    let plugin = if kotlin { "\"java\"" } else { "'java'" };
    Some(format!(
        "{build_file}\n// Added by Supercov: the JUnit Platform listener that attributes coverage\n// to each test is compiled from each project's own test sources, and the\n// launcher API it implements is on the test runtime classpath but not the\n// compile one.\nallprojects {{\n    plugins.withId({plugin}) {{\n        dependencies {{\n{line}\n        }}\n    }}\n}}\n"
    ))
}

/// A build file with its warnings-as-errors policy relaxed.
///
/// A project is free to fail its build on any warning, and several good ones
/// do. The instrumented copy contains code that project never wrote and never
/// agreed a style for, so its own policy would reject it -- gson's Error Prone
/// configuration rejects a fully-qualified name, and nothing Supercov can emit
/// satisfies every such rule. The Rust frontend caps lints for the same reason
/// and in the same place: the copy, never the tree the author keeps.
///
/// Only the escalation is removed. The warnings are still emitted, the
/// compiler still compiles exactly what it would have, and the author's own
/// build is untouched.
fn without_warnings_as_errors(build_file: &str) -> Option<String> {
    let mut updated = build_file.to_owned();
    for (from, to) in [
        (
            "<failOnWarning>true</failOnWarning>",
            "<failOnWarning>false</failOnWarning>",
        ),
        (
            "<failOnWarnings>true</failOnWarnings>",
            "<failOnWarnings>false</failOnWarnings>",
        ),
        ("<arg>-Werror</arg>", ""),
        ("<compilerArgument>-Werror</compilerArgument>", ""),
        ("options.compilerArgs << '-Werror'", ""),
        ("allWarningsAsErrors = true", "allWarningsAsErrors = false"),
    ] {
        updated = updated.replace(from, to);
    }
    updated = without_error_prone(&updated);
    (updated != build_file).then_some(updated)
}

/// The same build file with Error Prone switched off.
///
/// Relaxing warnings is not enough on its own: Error Prone has checks that
/// fail at error severity, and some are about the shape of a method rather
/// than its meaning — an `@InlineMe` method must hold exactly one statement,
/// and a probe makes two. No instrumentation can satisfy a rule like that,
/// because the rule is about source the author wrote and the copy holds source
/// they did not.
///
/// Switching the analyser off in the copy costs nothing: it says nothing about
/// whether the tests pass, and the author's own build still runs it in full.
fn without_error_prone(build_file: &str) -> String {
    let Some(start) = build_file.find("<arg>-Xplugin:ErrorProne") else {
        return build_file.to_owned();
    };
    let Some(end) = build_file[start..].find("</arg>") else {
        return build_file.to_owned();
    };
    let mut updated = build_file.to_owned();
    updated.replace_range(start..start + end + "</arg>".len(), "");
    updated
}

/// Make the build run its tests again rather than reporting a cached result.
///
/// A test that does not run records nothing, and a run that measured half a
/// suite without saying so is worse than one that took longer.
fn command_with_fresh_results(
    build: JvmBuild,
    command: &[String],
) -> (Vec<String>, Option<String>) {
    let mut updated = command.to_vec();
    match build {
        JvmBuild::Gradle => {
            if updated
                .iter()
                .any(|argument| argument == "--rerun-tasks" || argument == "--rerun")
            {
                return (updated, None);
            }
            updated.push("--rerun-tasks".into());
            (
                updated,
                Some(
                    "added --rerun-tasks: Gradle skips a test task it considers up to date, and a task that does not run records no coverage"
                        .into(),
                ),
            )
        }
        // Maven's default lifecycle re-runs surefire every time, and Gradle's
        // build cache has no Maven equivalent worth defeating here.
        JvmBuild::Maven | JvmBuild::Plain => (updated, None),
    }
}

/// One module of the build, and where its evidence lands.
///
/// A single-project build has exactly one of these, rooted at the workspace.
/// A multi-module build has one per module, because each module compiles only
/// its own source set and forks its own JVM to run its tests: a runtime
/// written once at the top would be invisible to every module, and one
/// evidence path shared by every module's JVM would be overwritten by
/// whichever finished last.
#[derive(Debug, Clone)]
struct JvmModule {
    /// Relative to the workspace, `/`-separated; `.` for the build root.
    directory: String,
    /// Where this module's JVMs write. A directory rather than a file: a build
    /// may fork more than one to run tests in parallel, and each writes under
    /// a name of its own so none overwrites another.
    evidence: PathBuf,
    has_tests: bool,
}

struct InstrumentedWorkspace {
    project: PreparedJvmProject,
    build: JvmBuild,
    modules: Vec<JvmModule>,
    /// Which file declared each test class, so a result can point at a source.
    declared_in: BTreeMap<String, String>,
    /// The build file the launcher dependency was added to, if it was.
    added_launcher: Option<&'static str>,
    /// Modules whose own configuration asked for parallel execution and had it
    /// turned off in the copy, so the user hears that their suite ran a
    /// different way rather than discovering it from a test that now hangs.
    serialised: BTreeSet<String>,
    /// Modules left running their tests at once, where what overlaps cannot be
    /// credited to either test that produced it.
    concurrent: BTreeSet<String>,
    /// Whether a JUnit 4 module was given the engine that runs it on the
    /// platform, so the user hears that their suite ran a different way.
    added_vintage: bool,
    /// What had to be relaxed in the copy's build files for instrumented code
    /// to compile, named so the user knows rather than infers.
    relaxed: Vec<&'static str>,
    /// Modules Supercov instrumented but cannot attribute, and why they were
    /// left without a listener rather than broken by one.
    unmeasurable: Vec<String>,
    /// Modules whose tests are a named JPMS module, which cannot take a listener.
    modular: Vec<String>,
}

/// The module a `src/main/...` or `src/test/...` path belongs to.
///
/// The build root for a single-project build, and the subdirectory holding
/// that source set otherwise. Derived from the paths themselves rather than
/// from the build file, because Maven's `<modules>` and Gradle's
/// `settings.gradle` say the same thing in two languages and the layout says
/// it in one.
fn module_of(relative: &str) -> String {
    match relative.find("src/") {
        Some(0) | None => ".".to_owned(),
        Some(at) => relative[..at].trim_end_matches('/').to_owned(),
    }
}

/// The class a test's reported name belongs to, as JUnit names it:
/// `CalculatorTest#zeroIsNamed()`, or a DSL framework's own wording.
fn class_of(test_name: &str) -> Option<&str> {
    test_name.split('#').next().filter(|name| !name.is_empty())
}

fn instrument_workspace(
    workspace: &Path,
    evidence_directory: &Path,
    exact_attribution: bool,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<InstrumentedWorkspace, String> {
    let project = prepare_jvm_project(workspace, roots)?;
    let build = detect_build(workspace);

    for (relative, instrumented) in &project.instrumented {
        write(&workspace.join(relative), instrumented)?;
    }

    let probe_count = project
        .probes
        .keys()
        .max()
        .map_or(0, |highest| *highest as usize + 1);

    // Which frameworks a module runs is a question about that module. A
    // repository can hold a JUnit 4 module beside a JUnit 5 one, and asking
    // the whole tree at once answers neither: the platform listener would go
    // into the JUnit 4 module, where it cannot work, and the launcher with it,
    // where it makes the build choose a provider that finds no engine.
    let catalog = version_catalog(workspace);
    let frameworks_of = |directory: &str| -> Frameworks {
        let names = ["pom.xml", "build.gradle.kts", "build.gradle"];
        let mut text = names
            .iter()
            .find_map(|name| fs::read_to_string(workspace.join(name)).ok())
            .unwrap_or_default();
        for name in names {
            if let Ok(own) = fs::read_to_string(workspace.join(directory).join(name)) {
                text.push('\n');
                text.push_str(&own);
                break;
            }
        }
        frameworks(&with_catalog(&text, &catalog))
    };
    let mut unmeasurable: Vec<String> = Vec::new();
    let mut modular: Vec<String> = Vec::new();

    // One entry per module that has a main or a test source set, keyed by
    // directory so a module contributing both is listed once.
    let mut modules: BTreeMap<String, bool> = BTreeMap::new();
    for (relative, _) in &project.files.sources {
        modules.entry(module_of(relative)).or_insert(false);
    }
    for (relative, _) in &project.files.tests {
        *modules.entry(module_of(relative)).or_default() = true;
    }
    // A module's tests may be in a language Supercov does not parse -- Spock
    // writes them in Groovy, and Supercov measures the Java and Kotlin they
    // exercise rather than the specification itself. Those files are not in
    // `files.tests`, so the source sets are asked directly: a module judged to
    // have no tests gets no listener, and a run with no listener records
    // nothing at all.
    for module in modules.keys().cloned().collect::<Vec<_>>() {
        if workspace.join(&module).join("src/test").is_dir() {
            modules.insert(module, true);
        }
    }
    if modules.is_empty() {
        modules.insert(".".to_owned(), true);
    }

    let modules = modules
        .into_iter()
        .map(|(directory, has_tests)| JvmModule {
            evidence: evidence_directory.join(
                directory
                    .chars()
                    .map(|c| if c.is_ascii_alphanumeric() { c } else { '_' })
                    .collect::<String>(),
            ),
            directory,
            has_tests,
        })
        .collect::<Vec<_>>();

    for module in &modules {
        let frameworks = frameworks_of(&module.directory);
        let at = |source_set: &str| {
            workspace
                .join(&module.directory)
                .join(source_root(source_set))
                .join(PACKAGE_DIRECTORY)
        };
        // The runtime goes in every module's main source set: instrumented
        // product code stores into its array, and a module compiles only its
        // own sources. The class is identical everywhere, and each module's
        // tests fork a JVM that loads exactly one of them.
        write(
            &at("main").join("Supercov.java"),
            &runtime_source(probe_count),
        )?;
        if !module.has_tests {
            continue;
        }
        if frameworks.junit4 && build != JvmBuild::Maven {
            // Only Maven's copy gets Vintage added below; elsewhere the module
            // keeps its probes and gets no listener, because attributing it is
            // impossible and trying would break it.
            unmeasurable.push(module.directory.clone());
            continue;
        }
        // A test source set with a module-info.java is a named JPMS module,
        // and a named module is closed: every package it holds is its own and
        // every dependency has to be declared in that file. A listener written
        // into it imports org.junit.platform, which the module does not
        // require, and reads the runtime from a package its main module does
        // not export -- so the module stops compiling and takes the build with
        // it. gson's test-jpms is exactly this, and it tests module boundaries
        // rather than product logic, so leaving it alone costs the report
        // nothing it could have had.
        if workspace
            .join(&module.directory)
            .join(source_root("test"))
            .join("module-info.java")
            .exists()
        {
            modular.push(module.directory.clone());
            continue;
        }
        // The listeners and their configuration go in the test source set,
        // because only the test classpath has the frameworks to listen to.
        let test = at("test");
        write(
            &test.join("SupercovConfig.java"),
            &configuration(probe_count, &project.decision_widths, &module.evidence),
        )?;
        if frameworks.platform || frameworks.junit4 {
            write(&test.join("SupercovListener.java"), LISTENER_SOURCE)?;
        }
        if frameworks.testng {
            write(
                &test.join("SupercovTestNGListener.java"),
                TESTNG_LISTENER_SOURCE,
            )?;
        }
    }

    // A project's warning policy applies to code it wrote. The copy holds code
    // it did not.
    let mut relaxed: Vec<&'static str> = Vec::new();
    for name in ["pom.xml", "build.gradle.kts", "build.gradle"] {
        let path = workspace.join(name);
        let Ok(existing) = fs::read_to_string(&path) else {
            continue;
        };
        let Some(updated) = without_warnings_as_errors(&existing) else {
            continue;
        };
        // Named separately, because switching a static analyser off is a
        // bigger thing than not failing on a warning and the user should hear
        // it said rather than work it out.
        if !relaxed.contains(&"stopped the build failing on warnings")
            && updated.contains("<failOnWarning>false</failOnWarning>")
                != existing.contains("<failOnWarning>false</failOnWarning>")
            || existing.contains("-Werror") && !updated.contains("-Werror")
        {
            relaxed.push("stopped the build failing on warnings");
        }
        if existing.contains("Xplugin:ErrorProne") && !updated.contains("Xplugin:ErrorProne") {
            relaxed.push("switched Error Prone off");
        }
        write(&path, &updated)?;
    }
    relaxed.dedup();

    // The platform listener is compiled from the project's own test sources,
    // so the launcher API it implements has to be on the compile classpath. A
    // TestNG-only project needs none of that: it already depends on the
    // framework its own listener implements.
    let mut added_launcher = None;
    let mut serialised: BTreeSet<String> = BTreeSet::new();
    let mut concurrent: BTreeSet<String> = BTreeSet::new();
    let mut added_vintage = false;
    match build {
        // Per module, not once at the top: the module's own pom is where its
        // JUnit version is in scope, and a module that runs JUnit 4 must not
        // get the launcher at all.
        JvmBuild::Maven => {
            for module in modules
                .iter()
                .filter(|module| {
                    module.has_tests
                        && !unmeasurable.contains(&module.directory)
                        && !modular.contains(&module.directory)
                })
                // A TestNG module needs none of this: it already depends on
                // the framework its own listener implements, and the launcher
                // would only change which provider the build chooses.
                .filter(|module| {
                    let frameworks = frameworks_of(&module.directory);
                    frameworks.platform || frameworks.junit4
                })
            {
                let pom = workspace.join(&module.directory).join("pom.xml");
                let Ok(existing) = fs::read_to_string(&pom) else {
                    continue;
                };
                // A JUnit 4 module also needs the engine that runs JUnit 4
                // tests on the platform; without it the launcher would find no
                // engine at all.
                let updated = if frameworks_of(&module.directory).junit4 {
                    added_vintage = true;
                    maven_with_vintage(&existing)
                } else {
                    maven_with_launcher(&existing)
                };
                if let Some(updated) = updated {
                    write(&pom, &updated)?;
                    added_launcher = Some("pom.xml");
                }
            }
        }
        JvmBuild::Gradle
            if !modules
                .iter()
                .any(|module| module.has_tests && frameworks_of(&module.directory).platform) => {}
        JvmBuild::Gradle => {
            for name in ["build.gradle.kts", "build.gradle"] {
                let path = workspace.join(name);
                let Ok(existing) = fs::read_to_string(&path) else {
                    continue;
                };
                if let Some(updated) = gradle_with_launcher(&existing, name.ends_with(".kts")) {
                    write(&path, &updated)?;
                    added_launcher = Some(if name.ends_with(".kts") {
                        "build.gradle.kts"
                    } else {
                        "build.gradle"
                    });
                }
                break;
            }
        }
        // Nothing resolves dependencies for a plain tree; whoever compiles it
        // supplies the classpath.
        JvmBuild::Plain => {}
    }

    for module in modules.iter().filter(|module| {
        module.has_tests
            && !unmeasurable.contains(&module.directory)
            && !modular.contains(&module.directory)
    }) {
        let frameworks = frameworks_of(&module.directory);
        let resources = workspace.join(&module.directory).join("src/test/resources");
        if frameworks.platform || frameworks.junit4 {
            write(
                &resources.join(SERVICES_FILE),
                &format!("{LISTENER_CLASS}\n"),
            )?;
            let properties = resources.join("junit-platform.properties");
            let existing = fs::read_to_string(&properties).ok();
            if !exact_attribution {
                // The suite runs the way its author wrote it. Where that means
                // tests run at once the runtime notices, says what it could
                // not credit, and the run records it -- which is a smaller
                // price than several times the suite's wall time, and not one
                // Supercov gets to spend on somebody's behalf.
                if asks_for_parallel_execution(existing.as_deref()) {
                    concurrent.insert(module.directory.clone());
                }
                continue;
            }
            // Said out loud, because it changes how the suite runs rather than
            // how it is measured. Every other thing Supercov does to the
            // workspace is announced -- the isolated copy, the added launcher,
            // `-count=1` over in Go -- and this is the one with a chance of
            // changing an outcome: a test that waits on another test's thread
            // passes under the project's own command and hangs under this one.
            if asks_for_parallel_execution(existing.as_deref()) {
                serialised.insert(module.directory.clone());
            }
            write(&properties, &sequential_properties(existing.as_deref()))?;
        }
        if frameworks.testng {
            write(
                &resources.join(TESTNG_SERVICES_FILE),
                &format!("{TESTNG_LISTENER_CLASS}\n"),
            )?;
        }
    }

    // A test class's file, so a result can name where it came from. Matched on
    // the class rather than the test, because the name a framework reports for
    // a test is its own and need not be a method at all.
    let mut declared_in = BTreeMap::new();
    for (relative, _) in &project.files.tests {
        if let Some(stem) = relative
            .rsplit('/')
            .next()
            .and_then(|name| name.split('.').next())
        {
            declared_in.insert(stem.to_owned(), relative.clone());
        }
    }

    Ok(InstrumentedWorkspace {
        project,
        build,
        modules,
        declared_in,
        added_launcher,
        serialised,
        concurrent,
        added_vintage,
        relaxed,
        unmeasurable,
        modular,
    })
}

/// The fingerprint a later query compares against the stored run.
pub fn current_jvm_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Result<crate::run_store::RunIntegrity, String> {
    let root = canonicalize_simplified(root).map_err(|error| error.to_string())?;
    let files = crate::jvm_project::discover_jvm_files(&root)?;
    let mut inputs = jvm_integrity_inputs(&files, command);
    crate::source_discovery::fold_roots_into_configuration(
        &mut inputs.execution_configuration,
        source_roots,
    );
    create_explicit_run_integrity(&root, &inputs, &FrontendIntegrityInputs::embedded_jvm())
        .map_err(|error| error.to_string())
}

pub fn run_direct_jvm(
    request: &DirectJvmRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<DirectJvmRunResult, String> {
    if request.command.is_empty() {
        return Err("test command must not be empty".into());
    }
    let total_started = Instant::now();
    let initialization_started = Instant::now();
    let root = canonicalize_simplified(&request.root)
        .map_err(|error| format!("{}: {error}", request.root.display()))?;
    let mut lock = ProjectLock::acquire(&root, &request.run_id, &request.started_at)
        .map_err(|error| error.to_string())?;
    let initialization_ms = elapsed_ms(initialization_started);
    let work_directory = root.join(".supercov/work").join(&request.run_id);
    // Whether the tests were measured. A run that failed before that has no
    // evidence worth keeping; one that failed after has evidence that cost the
    // suite its wall clock.
    let measured = std::cell::Cell::new(false);
    let result = (|| {
        let recovered_runs = recover_abandoned_runs(&root, &request.started_at)
            .map_err(|error| error.to_string())?;
        if !recovered_runs.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] recovered abandoned run(s): {}",
                recovered_runs.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }

        let adapter_started = Instant::now();
        let files = crate::jvm_project::discover_jvm_files(&root)?;
        let source_roots = crate::source_discovery::configured_source_roots(
            &std::env::vars().collect::<std::collections::BTreeMap<_, _>>(),
        );
        let mut integrity_inputs = jvm_integrity_inputs(&files, &request.command);
        crate::source_discovery::fold_roots_into_configuration(
            &mut integrity_inputs.execution_configuration,
            source_roots.as_deref(),
        );
        let assertion_inputs =
            crate::assertion_inputs::capture(&root, "jvm", integrity_inputs.assertion_paths())?;
        let integrity = create_explicit_run_integrity(
            &root,
            &integrity_inputs,
            &FrontendIntegrityInputs::embedded_jvm(),
        )
        .map_err(|error| error.to_string())?;

        let workspace_started = Instant::now();
        recover_cached_workspace(&root, &lock).map_err(|error| error.to_string())?;
        let workspace =
            prepare_cached_workspace(&root, &lock, &[]).map_err(|error| error.to_string())?;
        let evidence_directory = work_directory.join("jvm");
        fs::create_dir_all(&evidence_directory).map_err(|error| error.to_string())?;
        let ambient = std::env::vars().collect::<std::collections::BTreeMap<_, _>>();
        let roots = crate::source_discovery::ExplicitSourceRoots::from_environment_in(
            &root, &workspace, &ambient,
        )
        .map_err(|error| error.to_string())?;
        let instrumented = instrument_workspace(
            &workspace,
            &evidence_directory,
            request.exact_attribution,
            roots.as_ref(),
        )?;
        let workspace_preparation_ms = elapsed_ms(workspace_started);
        let adapter_setup_ms = (elapsed_ms(adapter_started) - workspace_preparation_ms).max(0.0);
        writeln!(
            diagnostics,
            "[supercov] detected {}; instrumenting {} source file(s) in isolated workspace {}",
            match instrumented.build {
                JvmBuild::Maven => "a Maven project",
                JvmBuild::Gradle => "a Gradle project",
                JvmBuild::Plain => "Java/Kotlin sources",
            },
            instrumented.project.instrumented.len(),
            workspace.display()
        )
        .map_err(|error| error.to_string())?;
        if let Some(build_file) = instrumented.added_launcher {
            writeln!(
                diagnostics,
                "[supercov] added a test-scoped {LAUNCHER_ARTIFACT} to the workspace's {build_file}: per-test attribution comes from a JUnit Platform listener, and the API it implements is on the test runtime classpath but not the compile one. Your own {build_file} is untouched."
            )
            .map_err(|error| error.to_string())?;
        }
        if !instrumented.serialised.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] turned JUnit's parallel execution off in the workspace copy ({}): attribution is a sweep of one shared probe array at each test boundary, so two tests running at once cannot both be credited with what they reached. Your suite runs in order here and your own configuration is untouched.",
                instrumented
                    .serialised
                    .iter()
                    .map(|module| if module.is_empty() { "." } else { module.as_str() })
                    .collect::<Vec<_>>()
                    .join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        if !instrumented.concurrent.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] JUnit runs this suite's tests at once ({}), so what they reach while they overlap is recorded against the run rather than against a test. `--exact-attribution` credits each of them instead, by running the suite in order.",
                instrumented
                    .concurrent
                    .iter()
                    .map(|module| if module.is_empty() { "." } else { module.as_str() })
                    .collect::<Vec<_>>()
                    .join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        if !instrumented.relaxed.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] in the workspace copy only: {}. The copy holds instrumented code your project never wrote a policy for, and a rule about the shape of a method is one no instrumentation can satisfy. Warnings are still reported, your build file is untouched, and your own build still runs every check in full.",
                instrumented.relaxed.join("; ")
            )
            .map_err(|error| error.to_string())?;
        }
        if instrumented.added_vintage {
            writeln!(
                diagnostics,
                "[supercov] added junit-vintage-engine to the workspace copy: JUnit 4 is not a JUnit Platform engine, and Vintage is the platform's own way of running exactly these tests through the lifecycle Supercov listens to. Your own build still runs JUnit 4 as it did."
            )
            .map_err(|error| error.to_string())?;
        }
        if !instrumented.modular.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] {} module(s) declare their tests as a Java module and are not attributed: {}. A named module names every package it holds and every dependency it may use, in its own module-info.java, so a listener added to it would not compile -- and neither would the module. Supercov leaves those tests to run exactly as they did.",
                instrumented.modular.len(),
                instrumented.modular.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        if !instrumented.unmeasurable.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] {} module(s) run JUnit 4, which is not a JUnit Platform engine, so they are not attributed: {}. Supercov listens through the platform's own lifecycle, and putting the platform on a JUnit 4 classpath makes the build choose a provider that finds no engine -- so it leaves those modules alone rather than break them. Adding junit-vintage-engine runs the same tests on the platform, and Supercov measures them.",
                instrumented.unmeasurable.len(),
                instrumented.unmeasurable.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        for (file, reason) in &instrumented.project.unparseable {
            writeln!(
                diagnostics,
                "[supercov] could not parse {file}: {reason}; it carries no obligations"
            )
            .map_err(|error| error.to_string())?;
        }

        let (command, note) = command_with_fresh_results(instrumented.build, &request.command);
        if let Some(note) = note {
            writeln!(diagnostics, "[supercov] {note}").map_err(|error| error.to_string())?;
        }
        let test_started = Instant::now();
        let plan = ExecutionPlan {
            preparation: Vec::new(),
            test: ExecutionPhase {
                name: "test".into(),
                kind: PhaseKind::Test,
                command: CommandSpec {
                    program: command[0].clone().into(),
                    arguments: command[1..].iter().map(OsString::from).collect(),
                    cwd: workspace.clone(),
                    environment: None,
                    captured_output: None,
                },
            },
        };
        let options = SupervisionOptions::from_environment().map_err(|error| error.to_string())?;
        let execution = execute_plan(&plan, options, diagnostics, |_, _| Ok(()))
            .map_err(|error| error.to_string())?;
        let test_command_ms = elapsed_ms(test_started);
        if let Some(signal) = execution.interrupted_signal {
            return Err(format!(
                "the test command was interrupted by {signal:?}; no run was published"
            ));
        }
        let exit_code = execution.exit_code;

        let publication_started = Instant::now();
        // One JVM per module, so one evidence file per module.
        let mut parts = Vec::new();
        let mut outcomes = Vec::new();
        let mut silent = Vec::new();
        for module in instrumented
            .modules
            .iter()
            .filter(|module| module.has_tests)
        {
            // Every JVM the build forked for this module wrote its own file.
            let mut written = fs::read_dir(&module.evidence)
                .map(|entries| {
                    entries
                        .flatten()
                        .map(|entry| entry.path())
                        .filter(|path| path.extension().is_some_and(|kind| kind == "bin"))
                        .collect::<Vec<_>>()
                })
                .unwrap_or_default();
            written.sort();
            if written.is_empty() {
                silent.push(module.directory.clone());
                continue;
            }
            let mut forked = Vec::new();
            for path in &written {
                let bytes =
                    fs::read(path).map_err(|error| format!("{}: {error}", path.display()))?;
                forked.push(
                    read_evidence(&bytes)
                        .map_err(|error| format!("{}: {error}", path.display()))?,
                );
            }
            let evidence = merge_evidence(forked);
            for test in &evidence.tests {
                outcomes.push(OwnedTestOutcome {
                    name: test.name.clone(),
                    runner: test.runner.clone(),
                    // The module is the unit that forked a JVM of its own, so
                    // it is what a worker identity means here. The class is
                    // already in the name the framework reported.
                    package: module.directory.clone(),
                    file: class_of(&test.name)
                        .and_then(|class| instrumented.declared_in.get(class))
                        .cloned(),
                    status: test.status.clone(),
                    // True while the suite runs its tests one at a time, which
                    // is what `--exact-attribution` asks for. Left to run as
                    // written, JUnit may run them at once; the runtime says so
                    // per record, and a test that overlapped is credited with
                    // nothing rather than with a neighbour's work.
                    attributed: !test.unattributed,
                });
            }
            parts.push(evidence);
        }
        if !silent.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] {} module(s) wrote no evidence and are absent from this run: {}",
                silent.len(),
                silent.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        if outcomes.is_empty() {
            return Err(format!(
                "the test run wrote no coverage evidence (the command exited {exit_code}). Supercov attributes through each framework's own lifecycle, so the suite has to run on the JUnit Platform or TestNG."
            ));
        }
        let evidence = merge_evidence(parts);
        measured.set(true);
        let run = build_frontend_run(OwnedRunInputs {
            declaration: jvm_declaration(),
            environment: "jvm",
            manifest: &instrumented.project.manifest,
            probes: &instrumented.project.probes,
            evidence: &evidence,
            outcomes: &outcomes,
            run_id: &request.run_id,
            generated_at: &request.started_at,
            test_exit_code: exit_code,
            coverage_model: jvm_coverage_model(),
        })
        .map_err(|error| error.to_string())?;
        validate_frontend_report_request(&run.declaration, &run.request)
            .map_err(|error| error.to_string())?;
        let archive_path = work_directory.join("evidence.raw.gz");
        let raw = write_archive(
            crate::assertion_inputs::append(
                run.archive_entries().map_err(|error| error.to_string())?,
                &assertion_inputs,
            )?,
            &archive_path,
        )
        .map_err(|error| error.to_string())?;
        let evidence_publication_ms = elapsed_ms(publication_started);

        let timings = RunTimings {
            initialization_ms,
            workspace_preparation_ms,
            adapter_setup_ms,
            instrumented_build_ms: 0.0,
            test_command_ms,
            evidence_publication_ms,
        };
        let metadata = RunMetadata {
            id: request.run_id.clone(),
            started_at: request.started_at.clone(),
            duration_ms: elapsed_ms(total_started),
            command: request.command.clone(),
            test_exit_code: Some(exit_code),
            integrity,
            raw_evidence: RawEvidenceMetadata {
                schema_version: raw.schema_version,
                format: raw.format.into(),
                file: raw.file.into(),
                files: raw.files,
                uncompressed_bytes: raw.uncompressed_bytes,
                compressed_bytes: raw.compressed_bytes,
            },
            isolated_build: Some(true),
            instrumented_build_cache: None,
            timings: Some(timings),
            merged: None,
            parents: None,
            source_roots: source_roots.clone(),
        };
        let run_directory =
            publish_run(&root, &metadata, &archive_path).map_err(|error| error.to_string())?;
        finalize_published_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        Ok(DirectJvmRunResult {
            run_id: request.run_id.clone(),
            run_directory,
            exit_code,
            tests: outcomes
                .iter()
                .map(|outcome| outcome.name.as_str())
                .collect::<BTreeSet<_>>()
                .len(),
            source_files: instrumented.project.instrumented.len(),
            modules: instrumented.modules.len(),
            build: instrumented.build,
            recovered_runs,
            metadata,
        })
    })();
    let result = result.map_err(|error| {
        if !measured.get() {
            return error;
        }
        note_kept_evidence(&root, &work_directory.join("jvm"), &request.run_id, error)
    });
    if result.is_err() {
        let _ = remove_stored_tree_deferred(&root, &work_directory);
    }
    let release = lock.release().map_err(|error| error.to_string());
    match (result, release) {
        (Ok(result), Ok(())) => Ok(result),
        (Err(error), _) => Err(error),
        (Ok(_), Err(error)) => Err(error),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_a_project_that_asked_for_parallel_execution_is_told_it_lost_it() {
        // The line is worth printing when something was taken away and noise
        // when nothing was: most projects never enable it, and a diagnostic on
        // every run is one nobody reads by the time it matters.
        assert!(asks_for_parallel_execution(Some(
            "junit.jupiter.execution.parallel.enabled=true\n"
        )));
        assert!(asks_for_parallel_execution(Some(
            "  junit.jupiter.execution.parallel.enabled = True  \n"
        )));
        assert!(!asks_for_parallel_execution(Some(
            "junit.jupiter.execution.parallel.enabled=false\n"
        )));
        // Naming the mode without enabling it leaves the suite sequential, so
        // nothing was taken away.
        assert!(!asks_for_parallel_execution(Some(
            "junit.jupiter.execution.parallel.mode.default=concurrent\n"
        )));
        assert!(!asks_for_parallel_execution(None));
        assert!(!asks_for_parallel_execution(Some("")));
    }

    #[test]
    fn parallel_execution_is_turned_off_without_discarding_what_else_was_set() {
        // Two tests running at once share one probe array, so neither can be
        // credited with what it reached. The runtime notices and says so; this
        // is the half that means it never has to.
        let existing = "junit.jupiter.testinstance.lifecycle.default=per_class\n\
                        junit.jupiter.execution.parallel.enabled=true\n\
                        junit.jupiter.displayname.generator.default=org.junit.jupiter.api.DisplayNameGenerator$ReplaceUnderscores\n";
        let updated = sequential_properties(Some(existing));
        assert!(updated.contains("junit.jupiter.execution.parallel.enabled=false"));
        assert!(
            !updated.contains("parallel.enabled=true"),
            "the project's own setting must not survive:\n{updated}"
        );
        // Everything the project chose for reasons of its own stays.
        assert!(updated.contains("testinstance.lifecycle.default=per_class"));
        assert!(updated.contains("displayname.generator.default"));

        // And a project with no properties at all still gets the setting.
        assert!(
            sequential_properties(None).contains("junit.jupiter.execution.parallel.enabled=false")
        );
    }

    #[test]
    fn gradle_is_told_to_run_the_tests_again() {
        // Gradle skips a test task it considers up to date, and a task that
        // does not run records nothing.
        let (command, note) = command_with_fresh_results(
            JvmBuild::Gradle,
            &["./gradlew".to_owned(), "test".to_owned()],
        );
        assert_eq!(command, ["./gradlew", "test", "--rerun-tasks"]);
        assert!(note.is_some());

        // An author who already said so means it.
        let (command, note) = command_with_fresh_results(
            JvmBuild::Gradle,
            &[
                "./gradlew".to_owned(),
                "test".to_owned(),
                "--rerun".to_owned(),
            ],
        );
        assert_eq!(command, ["./gradlew", "test", "--rerun"]);
        assert!(note.is_none());

        // Maven's lifecycle re-runs surefire every time; nothing to defeat.
        let (command, note) =
            command_with_fresh_results(JvmBuild::Maven, &["mvn".to_owned(), "test".to_owned()]);
        assert_eq!(command, ["mvn", "test"]);
        assert!(note.is_none());
    }

    #[test]
    fn a_configuration_literal_survives_a_path_java_would_have_read_as_escapes() {
        // A Windows path is full of backslashes, and one of them landing
        // before a `t` or a `"` would change the path or end the literal.
        let configuration = configuration(7, &[2, 3], Path::new(r"C:\tmp\runs\evidence.bin"));
        assert!(
            configuration.contains(r#""C:\\tmp\\runs\\evidence.bin""#),
            "{configuration}"
        );
        assert!(configuration.contains("PROBES = 7"));
        assert!(configuration.contains("new int[] {2, 3}"));
    }

    #[test]
    fn a_tests_class_is_read_from_the_name_the_framework_chose() {
        // JUnit reports `CalculatorTest#zeroIsNamed()`; a DSL framework
        // reports its own wording under the same class.
        assert_eq!(
            class_of("CalculatorTest#zeroIsNamed()"),
            Some("CalculatorTest")
        );
        assert_eq!(
            class_of("CalculatorSpec#a sum adds its parts"),
            Some("CalculatorSpec")
        );
        assert_eq!(class_of("Standalone"), Some("Standalone"));
        assert_eq!(class_of(""), None);
    }

    #[test]
    fn the_launcher_version_follows_whatever_junit_the_project_chose() {
        // JUnit numbers the platform 1.N alongside Jupiter 5.N, so a pinned
        // Jupiter says exactly which launcher agrees with the engine that will
        // run. Guessing instead could pair a launcher with an engine it does
        // not understand.
        assert_eq!(
            launcher_version("<artifactId>junit-jupiter</artifactId><version>5.10.2</version>")
                .as_deref(),
            Some("1.10.2")
        );
        assert_eq!(
            launcher_version("testImplementation 'org.junit.jupiter:junit-jupiter:5.13.1'")
                .as_deref(),
            Some("1.13.1")
        );
        // A project using the BOM has already said how every JUnit artifact is
        // versioned; naming one would override the answer it gave.
        assert_eq!(
            launcher_version("<artifactId>junit-bom</artifactId><version>5.11.0</version>"),
            None
        );
        // And one that says nothing gets a launcher new enough to drive an
        // older engine, which is the direction that works.
        assert_eq!(
            launcher_version("<artifactId>junit-jupiter</artifactId>").as_deref(),
            Some(DEFAULT_LAUNCHER_VERSION)
        );
        // Including a file that names no JUnit artifact at all -- an
        // aggregating parent, say, whose children each declare their own.
        // Reading that as "a BOM manages it" writes a versionless dependency
        // into a pom with no BOM to resolve it, and the build stops before a
        // single test runs.
        assert_eq!(
            launcher_version("<artifactId>parent</artifactId>").as_deref(),
            Some(DEFAULT_LAUNCHER_VERSION)
        );
        assert_eq!(
            launcher_version("").as_deref(),
            Some(DEFAULT_LAUNCHER_VERSION)
        );
    }

    #[test]
    fn the_launcher_is_added_once_and_only_where_it_is_missing() {
        let pom = "<project>\n  <dependencies>\n    <dependency>\n      <groupId>org.junit.jupiter</groupId>\n      <artifactId>junit-jupiter</artifactId>\n      <version>5.10.2</version>\n      <scope>test</scope>\n    </dependency>\n  </dependencies>\n</project>\n";
        let updated = maven_with_launcher(pom).expect("the launcher is missing");
        assert!(updated.contains("junit-platform-launcher"), "{updated}");
        assert!(updated.contains("<version>1.10.2</version>"), "{updated}");
        // Inside the existing block, not after it.
        assert!(
            updated.find("junit-platform-launcher") < updated.find("</dependencies>"),
            "{updated}"
        );
        // A project that already has it is left exactly as it is.
        assert_eq!(maven_with_launcher(&updated), None);

        // And one with no dependencies block at all still gets a valid pom.
        let bare = "<project>\n  <artifactId>demo</artifactId>\n</project>\n";
        let updated = maven_with_launcher(bare).expect("a block is created");
        assert!(updated.contains("<dependencies>"), "{updated}");
        assert!(
            updated.find("</dependencies>") < updated.find("</project>"),
            "{updated}"
        );
    }

    #[test]
    fn gradle_gets_the_launcher_in_the_dialect_its_script_is_written_in() {
        let groovy =
            "dependencies {\n    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'\n}\n";
        let updated = gradle_with_launcher(groovy, false).expect("the launcher is missing");
        assert!(
            updated
                .contains("testImplementation 'org.junit.platform:junit-platform-launcher:1.10.2'"),
            "{updated}"
        );
        // The project's own block survives: Gradle merges what we append.
        assert!(updated.contains("junit-jupiter:5.10.2"), "{updated}");
        assert_eq!(gradle_with_launcher(&updated, false), None);

        // Gradle 9 makes every project declare the launcher, and the
        // configuration its own documentation recommends is testRuntimeOnly,
        // which the tests run with but do not compile against. A project
        // following that advice has the artifact and still cannot compile a
        // listener, so it gets a compile-visible declaration alongside.
        let runtime_only = "dependencies {\n    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'\n    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'\n}\n";
        let updated = gradle_with_launcher(runtime_only, false)
            .expect("a runtime-only declaration does not reach the compiler");
        assert!(
            updated.contains("testImplementation 'org.junit.platform:junit-platform-launcher"),
            "{updated}"
        );
        assert!(
            updated.contains("testRuntimeOnly 'org.junit.platform:junit-platform-launcher'"),
            "the project's own declaration stays:\n{updated}"
        );

        let kotlin = "dependencies {\n    testImplementation(\"org.junit.jupiter:junit-jupiter:5.10.2\")\n}\n";
        let updated = gradle_with_launcher(kotlin, true).expect("the launcher is missing");
        assert!(
            updated.contains(
                "\"testImplementation\"(\"org.junit.platform:junit-platform-launcher:1.10.2\")"
            ),
            "the Kotlin DSL has no typed accessor inside allprojects:\n{updated}"
        );
        assert!(updated.contains("plugins.withId(\"java\")"), "{updated}");
    }

    #[test]
    fn only_the_listeners_a_project_can_compile_are_written() {
        // Each listener is compiled from the project's own test sources, so
        // one whose framework is absent would fail on imports the project
        // never asked for.
        let junit = frameworks("<artifactId>junit-jupiter</artifactId>");
        assert!(junit.platform && !junit.testng);

        let testng = frameworks("<artifactId>testng</artifactId>");
        assert!(testng.testng && !testng.platform);

        // A migration in progress runs both, and both listeners fire in one
        // JVM against one runtime.
        let both = frameworks("testng ... junit-jupiter");
        assert!(both.platform && both.testng);

        // Kotest and Spock are platform engines, so the platform listener
        // reports their tests without either being named.
        assert!(frameworks("io.kotest:kotest-runner-junit5").platform);
        assert!(frameworks("org.spockframework:spock-core").platform);

        // And a project naming nothing recognisable gets the platform, which
        // is what nearly every JVM suite runs on.
        let unknown = frameworks("<artifactId>demo</artifactId>");
        assert!(unknown.platform && !unknown.testng);
    }

    #[test]
    fn junit_four_is_not_the_platform_and_is_not_treated_as_it() {
        // Surefire picks its provider from what is on the classpath. Adding
        // the platform launcher to a JUnit 4 project makes it choose the
        // platform provider, find no engine there, and fail the suite --
        // Supercov breaking a build it was asked to measure. The word "junit"
        // appears in both, so the artifact is what tells them apart.
        let four = frameworks("<groupId>junit</groupId><artifactId>junit</artifactId>");
        assert!(four.junit4 && !four.platform && !four.testng);

        let five = frameworks("<artifactId>junit-jupiter</artifactId>");
        assert!(five.platform && !five.junit4);

        // Vintage runs JUnit 4 tests on the platform, so a project with both
        // is a platform project.
        let both = frameworks(
            "<artifactId>junit</artifactId><artifactId>junit-vintage-engine</artifactId>",
        );
        assert!(both.platform && !both.junit4);

        // Gradle spells its dependencies differently and means the same.
        assert!(frameworks("testImplementation 'junit:junit:4.13.2'").junit4);
        assert!(frameworks("testImplementation(\"junit:junit:4.13.2\")").junit4);
        assert!(!frameworks("testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'").junit4);
    }

    #[test]
    fn a_module_whose_tests_are_a_java_module_is_left_to_run_as_it_did() {
        // gson's test-jpms declares `module com.google.gson.jpms_test`, which
        // requires com.google.gson, junit and truth and nothing else. A
        // listener written into it imports org.junit.platform -- not visible
        // -- and reads a runtime from a package the main module does not
        // export. The module stops compiling and takes the reactor with it,
        // for tests that check module boundaries rather than product logic.
        let root = std::env::temp_dir().join(format!(
            "supercov-jpms-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        write(&root.join("pom.xml"), "<project>\n  <modules>\n    <module>lib</module>\n    <module>boundaries</module>\n  </modules>\n  <dependencies>\n    <dependency>\n      <groupId>org.junit.jupiter</groupId>\n      <artifactId>junit-jupiter</artifactId>\n    </dependency>\n  </dependencies>\n</project>\n").unwrap();
        for module in ["lib", "boundaries"] {
            write(&root.join(module).join("pom.xml"), "<project/>").unwrap();
            write(
                &root.join(module).join("src/main/java/app/Api.java"),
                "package app;\npublic class Api { public int one() { return 1; } }\n",
            )
            .unwrap();
            write(
                &root.join(module).join("src/test/java/app/ApiTest.java"),
                "package app;\nclass ApiTest { void t() {} }\n",
            )
            .unwrap();
        }
        write(
            &root.join("boundaries/src/test/java/module-info.java"),
            "module app.boundaries {\n  requires app.lib;\n}\n",
        )
        .unwrap();

        let evidence = root.join("evidence");
        let instrumented = instrument_workspace(&root, &evidence, false, None).expect("instrument");
        assert_eq!(instrumented.modular, ["boundaries"]);

        // The listener goes into the ordinary module and not the named one.
        assert!(
            root.join("lib/src/test/java/com/supercorp/supercov/SupercovListener.java")
                .exists()
        );
        for name in ["SupercovListener.java", "SupercovConfig.java"] {
            assert!(
                !root
                    .join("boundaries/src/test/java/com/supercorp/supercov")
                    .join(name)
                    .exists(),
                "{name} must not be written into a named module"
            );
        }
        assert!(
            !root
                .join("boundaries/src/test/resources")
                .join(SERVICES_FILE)
                .exists(),
            "and nothing registers a listener that is not there"
        );
        // Its product code is still instrumented, and the runtime it stores
        // into is a package of the module's own -- which a named module may
        // hold without exporting.
        assert!(
            root.join("boundaries/src/main/java/com/supercorp/supercov/Supercov.java")
                .exists()
        );

        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn a_framework_declared_through_a_version_catalog_is_still_recognised() {
        // moshi is JUnit 4 and writes `testImplementation(libs.junit)`. Read
        // without the catalog the build file names no framework at all, the
        // fallback takes it for a platform project, and a listener goes in
        // that nothing will ever call: the suite passes and records nothing.
        let root = std::env::temp_dir().join(format!(
            "supercov-catalog-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        write(
            &root.join("gradle/libs.versions.toml"),
            "[versions]\nkotlin = \"2.0.0\"\n\n[libraries]\njunit = \"junit:junit:4.13.2\"\nkotlin-reflect = { module = \"org.jetbrains.kotlin:kotlin-reflect\", version.ref = \"kotlin\" }\njupiter = { group = \"org.junit.jupiter\", name = \"junit-jupiter\" }\n\n[bundles]\nunit = [\"junit\", \"kotlin-reflect\"]\n",
        )
        .unwrap();
        let catalog = version_catalog(&root);

        let junit4 = frameworks(&with_catalog(
            "dependencies { testImplementation(libs.junit) }",
            &catalog,
        ));
        assert!(junit4.junit4 && !junit4.platform, "{junit4:?}");

        // An accessor is a prefix of a longer one, and must not answer for it.
        let reflect = frameworks(&with_catalog(
            "dependencies { testImplementation(libs.kotlin.reflect) }",
            &catalog,
        ));
        assert!(!reflect.junit4, "{reflect:?}");

        let jupiter = frameworks(&with_catalog(
            "dependencies { testImplementation(libs.jupiter) }",
            &catalog,
        ));
        assert!(jupiter.platform && !jupiter.junit4, "{jupiter:?}");

        // A bundle stands for every library in it.
        let bundle = frameworks(&with_catalog(
            "dependencies { testImplementation(libs.bundles.unit) }",
            &catalog,
        ));
        assert!(bundle.junit4 && !bundle.platform, "{bundle:?}");

        // A build that names no accessor is unchanged by a catalog.
        let plain = "dependencies { testImplementation(\"org.testng:testng:7.10.2\") }";
        assert_eq!(with_catalog(plain, &catalog), plain);

        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn the_launcher_joins_the_projects_dependencies_not_its_managed_versions() {
        // A pom's <dependencyManagement> holds a <dependencies> too, and so
        // does every profile and plugin. A dependency added there is a version
        // for something else to ask for rather than something the project
        // depends on: the module compiles exactly as before and the listener
        // still cannot find the API it implements.
        let pom = "<project>\n  <dependencyManagement>\n    <dependencies>\n      <dependency>\n        <groupId>org.junit</groupId>\n        <artifactId>junit-bom</artifactId>\n        <version>5.10.2</version>\n      </dependency>\n    </dependencies>\n  </dependencyManagement>\n  <dependencies>\n    <dependency>\n      <groupId>org.junit.jupiter</groupId>\n      <artifactId>junit-jupiter</artifactId>\n    </dependency>\n  </dependencies>\n  <build>\n    <plugins>\n      <plugin>\n        <dependencies>\n          <dependency><groupId>x</groupId></dependency>\n        </dependencies>\n      </plugin>\n    </plugins>\n  </build>\n</project>\n";
        let updated = maven_with_launcher(pom).expect("the launcher is missing");
        let at = updated.find(LAUNCHER_ARTIFACT).expect("added");
        let managed_end = updated
            .find("</dependencyManagement>")
            .expect("managed block");
        let build_start = updated.find("<build>").expect("build block");
        assert!(
            at > managed_end,
            "not among the managed versions:\n{updated}"
        );
        assert!(at < build_start, "nor among a plugin's own:\n{updated}");
        // The BOM manages every JUnit artifact, so naming a version would
        // override the answer the project already gave.
        assert!(!updated[at..at + 200].contains("<version>"), "{updated}");
    }

    #[test]
    fn a_projects_warning_policy_does_not_apply_to_code_it_never_wrote() {
        // A project is free to fail its build on any warning, and good ones
        // do. The copy holds code that project never wrote and never agreed a
        // style for -- and Error Prone goes further, failing at error severity
        // on rules about the shape of a method that no instrumentation can
        // satisfy.
        let pom = "<project>\n  <failOnWarning>true</failOnWarning>\n  <compilerArgs>\n    <arg>-XDcompilePolicy=simple</arg>\n    <arg>-Xplugin:ErrorProne\n      -Xep:NotJavadoc:OFF\n    </arg>\n  </compilerArgs>\n</project>\n";
        let updated = without_warnings_as_errors(pom).expect("a policy to relax");
        assert!(
            updated.contains("<failOnWarning>false</failOnWarning>"),
            "{updated}"
        );
        assert!(!updated.contains("Xplugin:ErrorProne"), "{updated}");
        // Only the escalation goes: the compiler still compiles what it would
        // have, and everything else the project configured is untouched.
        assert!(updated.contains("-XDcompilePolicy=simple"), "{updated}");

        // A project with no such policy is left exactly as it is.
        assert_eq!(without_warnings_as_errors("<project></project>"), None);

        // Failing on warnings and running a static analyser are separate
        // things, and a project may do either without the other.
        let only_warnings = "<project><failOnWarning>true</failOnWarning></project>";
        let updated = without_warnings_as_errors(only_warnings).expect("a policy to relax");
        assert!(updated.contains("<failOnWarning>false</failOnWarning>"));

        let only_analyser =
            "<project><compilerArgs><arg>-Xplugin:ErrorProne</arg></compilerArgs></project>";
        let updated = without_warnings_as_errors(only_analyser).expect("an analyser to switch off");
        assert!(!updated.contains("ErrorProne"), "{updated}");
    }

    #[test]
    fn vintage_carries_the_engine_version_not_the_platform_one() {
        // JUnit numbers the engines 5.N and the platform 1.N, so asking for
        // vintage 1.N asks for something that was never published and the
        // build stops at dependency resolution.
        assert_eq!(engine_version_of_platform("1.10.2"), "5.10.2");
        assert_eq!(engine_version_of_platform("1.13.1"), "5.13.1");

        let pom = "<project>\n  <dependencies>\n    <dependency>\n      <groupId>junit</groupId>\n      <artifactId>junit</artifactId>\n      <version>4.13.2</version>\n    </dependency>\n  </dependencies>\n</project>\n";
        let updated = maven_with_vintage(pom).expect("a JUnit 4 project needs both");
        assert!(updated.contains("<artifactId>junit-platform-launcher</artifactId>"));
        assert!(updated.contains("<artifactId>junit-vintage-engine</artifactId>"));
        assert!(
            updated.contains("<groupId>org.junit.vintage</groupId>"),
            "{updated}"
        );
        // The launcher takes the platform version and the engine the Jupiter
        // one, in the same pom.
        assert!(updated.contains(&format!("<version>{DEFAULT_LAUNCHER_VERSION}</version>")));
        assert!(
            updated.contains(&format!(
                "<version>{}</version>",
                engine_version_of_platform(DEFAULT_LAUNCHER_VERSION)
            )),
            "{updated}"
        );

        // A project that already has both is left alone.
        assert_eq!(maven_with_vintage(&updated), None);
    }
}
