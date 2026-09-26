//! The whole JVM lifecycle, through a real build system.
//!
//! The frontend test proves instrumented Java and Kotlin compile and that the
//! JUnit Platform listener attributes what they reach. This proves the parts
//! around it: that a project is copied and rewritten without touching the
//! author's tree, that Supercov's runtime, listener and configuration land
//! where the build already looks, that the build runs the suite unchanged, and
//! that a run is published and can be read back.
//!
//! Needs Maven and a JDK, and Maven needs its dependencies resolvable. Skips
//! otherwise rather than failing a suite the machine cannot run.
//!
//! Every test here is `#[ignore]`, and `npm run test:jvm` passes
//! `--include-ignored`. Not because they are unimportant -- they are the only
//! proof the JVM frontend works at all -- but because running a real Gradle or
//! Maven build belongs to a job that provisioned one. The CI job that does
//! sets up a JDK, Gradle with its cache, the Kotlin compiler and the JUnit
//! console runner, and finishes in twelve minutes. `cargo test --workspace`
//! picks them up on any runner that merely happens to have a JDK on it, cold
//! caches and all: the filesystem-safety job went from eleven minutes to over
//! seventy on Windows that way, and would now hit its timeout and fail.
//!
//! A test that needs a toolchain provisioned for it should say so rather than
//! run wherever one is lying around.

use std::path::{Path, PathBuf};
use std::process::Command;

use supercov_engine::jvm_project::JvmBuild;
use supercov_engine::jvm_run::{DirectJvmRunRequest, DirectJvmRunResult, run_direct_jvm};

mod common;

fn temporary(label: &str) -> PathBuf {
    let root = std::env::temp_dir().join(format!(
        "supercov-jvm-run-{label}-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir_all(&root).unwrap();
    root
}

fn write(root: &Path, relative: &str, contents: &str) {
    let path = root.join(relative);
    std::fs::create_dir_all(path.parent().unwrap()).unwrap();
    std::fs::write(path, contents).unwrap();
}

const POM: &str = r#"<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0</version>
  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.5</version>
      </plugin>
    </plugins>
  </build>
</project>
"#;

/// `a > 10 && loud` gives two conditions, so MC/DC has something to say. The
/// suite shows one condition's independence and not the other's, which is the
/// difference between a number that measures something and one that does not.
const SOURCE: &str = r#"package app;

public class Calculator {
    public static String size(int a, boolean loud) {
        if (a > 10 && loud) {
            return "BIG";
        }
        return "small";
    }
}
"#;

const SUITE: &str = r#"package app;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculatorTest {
    @Test
    void bigWhenLoudAndLarge() {
        assertEquals("BIG", Calculator.size(20, true));
    }

    @Test
    void smallOtherwise() {
        assertEquals("small", Calculator.size(1, false));
    }

    @Test
    @Disabled("proves a skipped test is recorded as one")
    void neverRuns() {
        assertEquals("small", Calculator.size(0, true));
    }
}
"#;

fn fixture(root: &Path) {
    write(root, "pom.xml", POM);
    write(root, "src/main/java/app/Calculator.java", SOURCE);
    write(root, "src/test/java/app/CalculatorTest.java", SUITE);
}

/// Maven resolves from the network on a cold cache. A machine without it can
/// still run every other test in the suite.
fn maven_can_resolve(mvn: &Path, root: &Path) -> bool {
    fixture(root);
    Command::new(mvn)
        .args(["-q", "test"])
        .current_dir(root)
        .output()
        .is_ok_and(|out| out.status.success())
}

#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_maven_project_runs_through_its_own_build_and_publishes_what_each_test_reached() {
    let _building = common::building();
    let Some(mvn) = common::tool("mvn") else {
        common::skip("jvm", "no Maven found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("maven-warmup");
        let built = maven_can_resolve(&mvn, &warmup);
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Maven cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("maven");
    fixture(&root);
    let before = std::fs::read_to_string(root.join("src/main/java/app/Calculator.java")).unwrap();

    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![mvn.display().to_string(), "test".into()],
        run_id: "run-jvm-maven".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };

    // The author's tree is untouched: instrumentation happens on a copy, and
    // nothing Supercov generates lands beside the code they wrote.
    assert_eq!(
        std::fs::read_to_string(root.join("src/main/java/app/Calculator.java")).unwrap(),
        before,
        "the project's own sources must come back exactly as they went in"
    );
    assert!(
        !root
            .join("src/main/java/com/supercorp/supercov/Supercov.java")
            .exists(),
        "Supercov's runtime belongs in the workspace, not in the author's tree"
    );

    assert_eq!(result.exit_code, 0);
    assert_eq!(result.build, JvmBuild::Maven);
    assert_eq!(result.source_files, 1);
    // The disabled one included: a test the suite declared and did not run is
    // a fact worth reporting, not an absence worth hiding.
    assert_eq!(result.tests, 3);

    let archive = result.run_directory.join("evidence.raw.gz");
    let entries =
        supercov_engine::evidence_archive::read_archive(&archive).expect("published archive");
    let named = entries
        .iter()
        .map(|entry| entry.path.as_str())
        .collect::<Vec<_>>();
    for required in ["coverage-model.json", "frontend.json", "manifest.json"] {
        assert!(named.contains(&required), "{named:?}");
    }
    assert_eq!(
        named
            .iter()
            .filter(|path| path.ends_with("mcdc.json"))
            .count(),
        3,
        "one record per test: {named:?}"
    );

    let records = entries
        .iter()
        .filter(|entry| entry.path.ends_with("mcdc.json"))
        .map(|entry| String::from_utf8(entry.contents.clone()).expect("utf-8"))
        .collect::<Vec<_>>();
    let statuses = records
        .iter()
        .filter(|record| record.contains("\"status\":\"skipped\""))
        .count();
    assert_eq!(statuses, 1, "the disabled test is recorded as skipped");
    assert!(
        records
            .iter()
            .any(|record| record.contains("CalculatorTest#bigWhenLoudAndLarge()")),
        "tests carry the names the framework itself chose"
    );
    assert!(
        records
            .iter()
            .all(|record| record.contains("\"runner\":\"junit-platform\"")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

const BUILD_GRADLE: &str = r#"plugins {
    id 'java'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
    // Gradle 9 requires every project to declare this itself, in exactly the
    // configuration its documentation recommends: on the classpath the tests
    // run with, not the one they compile against.
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

test {
    useJUnitPlatform()
}
"#;

fn gradle_fixture(root: &Path) {
    write(root, "settings.gradle", "rootProject.name = 'demo'\n");
    write(root, "build.gradle", BUILD_GRADLE);
    write(root, "src/main/java/app/Calculator.java", SOURCE);
    write(root, "src/test/java/app/CalculatorTest.java", SUITE);
}

#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_gradle_project_runs_through_its_own_build_and_publishes_what_each_test_reached() {
    let _building = common::building();
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("gradle-warmup");
        gradle_fixture(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Gradle cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("gradle");
    gradle_fixture(&root);
    let before = std::fs::read_to_string(root.join("build.gradle")).unwrap();

    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-gradle".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };

    // The launcher dependency goes into the copy, never into the author's own
    // build file.
    assert_eq!(
        std::fs::read_to_string(root.join("build.gradle")).unwrap(),
        before,
        "the project's own build file must come back exactly as it went in"
    );
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.build, JvmBuild::Gradle);
    assert_eq!(result.tests, 3);
    std::fs::remove_dir_all(root).ok();
}

const TESTNG_POM: &str = r#"<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0</version>
  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <version>7.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.5</version>
      </plugin>
    </plugins>
  </build>
</project>
"#;

/// TestNG's own idioms: a data provider that runs one method several times,
/// and a skip. Neither has a JUnit Platform equivalent to fall back on.
const TESTNG_SUITE: &str = r#"package app;

import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import static org.testng.Assert.assertEquals;

public class CalculatorTest {
    @DataProvider(name = "sizes")
    public Object[][] sizes() {
        return new Object[][] {{20, true, "BIG"}, {1, false, "small"}};
    }

    @Test(dataProvider = "sizes")
    public void sizesAreNamed(int a, boolean loud, String expected) {
        assertEquals(Calculator.size(a, loud), expected);
    }

    @Test
    public void notToday() {
        throw new SkipException("nothing to do here");
    }
}
"#;

fn testng_fixture(root: &Path) {
    write(root, "pom.xml", TESTNG_POM);
    write(root, "src/main/java/app/Calculator.java", SOURCE);
    write(root, "src/test/java/app/CalculatorTest.java", TESTNG_SUITE);
}

#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_testng_suite_is_attributed_through_its_own_lifecycle() {
    let _building = common::building();
    // TestNG is the one framework the JUnit Platform does not report, so it
    // needs a listener of its own. Kotest and Spock are platform engines and
    // need nothing extra.
    let Some(mvn) = common::tool("mvn") else {
        common::skip("jvm", "no Maven found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("testng-warmup");
        testng_fixture(&warmup);
        let built = Command::new(&mvn)
            .args(["-q", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip("jvm", "Maven cannot resolve TestNG here");
        return;
    }

    let root = temporary("testng");
    testng_fixture(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![mvn.display().to_string(), "-q".into(), "test".into()],
        run_id: "run-jvm-testng".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };

    // Two data-provider invocations and the skip. The invocations are separate
    // tests because they reach different code, which is the point of a data
    // provider: collapsing them would credit one with what the other proved.
    assert_eq!(
        result.tests,
        3,
        "{diagnostics:?}",
        diagnostics = String::from_utf8_lossy(&diagnostics)
    );

    let archive = result.run_directory.join("evidence.raw.gz");
    let records = supercov_engine::evidence_archive::read_archive(&archive)
        .expect("published archive")
        .into_iter()
        .filter(|entry| entry.path.ends_with("mcdc.json"))
        .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
        .collect::<Vec<_>>();
    assert!(
        records
            .iter()
            .any(|record| record.contains("CalculatorTest#sizesAreNamed()")),
        "{records:?}"
    );
    assert!(
        records
            .iter()
            .any(|record| record.contains("CalculatorTest#sizesAreNamed()[1]")),
        "a second invocation is its own test: {records:?}"
    );
    assert_eq!(
        records
            .iter()
            .filter(|record| record.contains("\"status\":\"skipped\""))
            .count(),
        1,
        "the skipped test is recorded as one: {records:?}"
    );
    // Attributed by the lifecycle that actually saw it. A project can run both
    // frameworks in one JVM, so a result naming the platform here would claim
    // it was announced by something that never saw it.
    assert!(
        records
            .iter()
            .all(|record| record.contains("\"runner\":\"testng\"")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

const KOTLIN_BUILD_GRADLE: &str = r#"plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.2.20'
}

repositories {
    mavenCentral()
}

// Pinned so the Java and Kotlin compilers agree on a target; Gradle refuses
// the build otherwise, and what is under test here is Supercov, not a
// toolchain mismatch.
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

test {
    useJUnitPlatform()
}
"#;

const KOTLIN_SOURCE: &str = r#"package app

object Calculator {
    fun size(a: Int, loud: Boolean): String {
        if (a > 10 && loud) {
            return "BIG"
        }
        return "small"
    }
}
"#;

const KOTLIN_SUITE: &str = r#"package app

import kotlin.test.Test
import kotlin.test.assertEquals

class CalculatorTest {
    @Test
    fun bigWhenLoudAndLarge() {
        assertEquals("BIG", Calculator.size(20, true))
    }

    @Test
    fun smallOtherwise() {
        assertEquals("small", Calculator.size(1, false))
    }
}
"#;

fn kotlin_fixture(root: &Path) {
    write(root, "settings.gradle", "rootProject.name = 'demo'\n");
    write(root, "build.gradle", KOTLIN_BUILD_GRADLE);
    write(root, "src/main/kotlin/app/Calculator.kt", KOTLIN_SOURCE);
    write(root, "src/test/kotlin/app/CalculatorTest.kt", KOTLIN_SUITE);
}

#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_kotlin_project_is_measured_like_any_other_jvm_one() {
    let _building = common::building();
    // Kotlin is instrumented by the same rewriter and attributed by the same
    // listener; what differs is only the grammar the obligations come from.
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("kotlin-warmup");
        kotlin_fixture(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip("jvm", "Gradle cannot build this Kotlin project here");
        return;
    }

    let root = temporary("kotlin");
    kotlin_fixture(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-kotlin".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.tests, 2);
    assert_eq!(result.source_files, 1);

    // The decision the Kotlin source declares is in the published manifest,
    // which is what the numbers are measured against.
    let entries = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive");
    let manifest = String::from_utf8(
        entries
            .into_iter()
            .find(|entry| entry.path == "manifest.json")
            .expect("manifest")
            .contents,
    )
    .expect("utf-8");
    assert!(manifest.contains("Calculator.kt"), "{manifest}");
    assert_eq!(manifest.matches("\"conditions\"").count(), 1, "{manifest}");
    std::fs::remove_dir_all(root).ok();
}

/// Two modules, each with its own source set and its own test JVM. This is
/// the shape most real Java projects have, and almost nothing about a
/// single-module build generalises to it on its own: each module compiles only
/// its own sources, so a runtime written once at the top is invisible to every
/// one of them, and each forks a JVM of its own, so one evidence path would be
/// overwritten by whichever module finished last.
fn multi_module_maven(root: &Path) {
    write(
        root,
        "pom.xml",
        r#"<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>example</groupId>
  <artifactId>parent</artifactId>
  <version>1.0</version>
  <packaging>pom</packaging>
  <modules>
    <module>core</module>
    <module>app</module>
  </modules>
  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
"#,
    );
    for module in ["core", "app"] {
        write(
            root,
            &format!("{module}/pom.xml"),
            &format!(
                r#"<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>example</groupId>
    <artifactId>parent</artifactId>
    <version>1.0</version>
  </parent>
  <artifactId>{module}</artifactId>
</project>
"#
            ),
        );
    }
    write(
        root,
        "core/src/main/java/core/Calc.java",
        &SOURCE
            .replace("package app;", "package core;")
            .replace("class Calculator", "class Calc"),
    );
    write(
        root,
        "core/src/test/java/core/CalcTest.java",
        "package core;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\nclass CalcTest {\n    @Test void big() { assertEquals(\"BIG\", Calc.size(20, true)); }\n    @Test void small() { assertEquals(\"small\", Calc.size(1, false)); }\n}\n",
    );
    write(
        root,
        "app/src/main/java/app/Greet.java",
        "package app;\n\npublic class Greet {\n    public static String hi(boolean loud) {\n        if (loud) { return \"HI\"; }\n        return \"hi\";\n    }\n}\n",
    );
    write(
        root,
        "app/src/test/java/app/GreetTest.java",
        "package app;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\nclass GreetTest {\n    @Test void loud() { assertEquals(\"HI\", Greet.hi(true)); }\n}\n",
    );
}

#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn every_module_of_a_multi_module_build_is_measured_and_merged() {
    let _building = common::building();
    let Some(mvn) = common::tool("mvn") else {
        common::skip("jvm", "no Maven found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("multi-warmup");
        multi_module_maven(&warmup);
        let built = Command::new(&mvn)
            .args(["-q", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Maven cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("multi");
    multi_module_maven(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![mvn.display().to_string(), "-q".into(), "test".into()],
        run_id: "run-jvm-multi".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.modules, 2);
    assert_eq!(result.source_files, 2);
    // Every module's tests, not just the last one to finish.
    assert_eq!(result.tests, 3);

    let entries = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive");
    let records = entries
        .iter()
        .filter(|entry| entry.path.ends_with("mcdc.json"))
        .map(|entry| String::from_utf8(entry.contents.clone()).expect("utf-8"))
        .collect::<Vec<_>>();
    // The module is the worker, because the module is what forked a JVM.
    assert!(
        records
            .iter()
            .any(|record| record.contains("\"workerId\":\"core\"")),
        "{records:?}"
    );
    assert!(
        records
            .iter()
            .any(|record| record.contains("\"workerId\":\"app\"")),
        "{records:?}"
    );
    // And both modules' obligations are in the one manifest the numbers are
    // measured against.
    let manifest = String::from_utf8(
        entries
            .into_iter()
            .find(|entry| entry.path == "manifest.json")
            .expect("manifest")
            .contents,
    )
    .expect("utf-8");
    assert!(
        manifest.contains("core/src/main/java/core/Calc.java"),
        "{manifest}"
    );
    assert!(
        manifest.contains("app/src/main/java/app/Greet.java"),
        "{manifest}"
    );
    std::fs::remove_dir_all(root).ok();
}

fn multi_project_gradle(root: &Path) {
    write(
        root,
        "settings.gradle",
        "rootProject.name = 'demo'\ninclude 'core', 'app'\n",
    );
    // The root only aggregates: it has no source set of its own, which is the
    // usual shape and the one a root-only dependency declaration would miss.
    write(
        root,
        "build.gradle",
        "subprojects {\n    apply plugin: 'java'\n    repositories { mavenCentral() }\n    dependencies {\n        testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'\n        testRuntimeOnly 'org.junit.platform:junit-platform-launcher'\n    }\n    test { useJUnitPlatform() }\n}\n",
    );
    write(root, "core/build.gradle", "");
    write(root, "app/build.gradle", "");
    write(
        root,
        "core/src/main/java/core/Calc.java",
        "package core;\n\npublic class Calc {\n    public static String size(int a, boolean loud) {\n        if (a > 10 && loud) { return \"BIG\"; }\n        return \"small\";\n    }\n}\n",
    );
    write(
        root,
        "core/src/test/java/core/CalcTest.java",
        "package core;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\nclass CalcTest {\n    @Test void big() { assertEquals(\"BIG\", Calc.size(20, true)); }\n}\n",
    );
    write(
        root,
        "app/src/main/java/app/Greet.java",
        "package app;\n\npublic class Greet {\n    public static String hi(boolean loud) {\n        if (loud) { return \"HI\"; }\n        return \"hi\";\n    }\n}\n",
    );
    write(
        root,
        "app/src/test/java/app/GreetTest.java",
        "package app;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\nclass GreetTest {\n    @Test void loud() { assertEquals(\"HI\", Greet.hi(true)); }\n}\n",
    );
}

/// A Gradle build whose root only aggregates. A dependency declared in the
/// root reaches none of the subprojects, and the subprojects are where the
/// test sources -- and so the listener Supercov compiles -- actually live.
#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_multi_project_gradle_build_reaches_every_subproject() {
    let _building = common::building();
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("multi-gradle-warmup");
        multi_project_gradle(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Gradle cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("multi-gradle");
    multi_project_gradle(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-multi-gradle".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.modules, 2);
    assert_eq!(result.tests, 2);
    std::fs::remove_dir_all(root).ok();
}

/// Kotest is the reason the platform listener exists rather than an annotation
/// rewriter: its tests are strings in a constructor block, not annotated
/// methods, so nothing that reads test source can find them. The platform
/// announces them like any other engine's.
#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_kotest_spec_is_attributed_under_the_names_kotest_reports() {
    let _building = common::building();
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let fixture = |root: &Path| {
        write(root, "settings.gradle", "rootProject.name = 'demo'\n");
        write(
            root,
            "build.gradle",
            &KOTLIN_BUILD_GRADLE.replace(
                "testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'\n    testImplementation 'org.jetbrains.kotlin:kotlin-test'",
                "testImplementation 'io.kotest:kotest-runner-junit5:5.9.1'",
            ),
        );
        write(root, "src/main/kotlin/app/Calculator.kt", KOTLIN_SOURCE);
        write(
            root,
            "src/test/kotlin/app/CalculatorSpec.kt",
            "package app\n\nimport io.kotest.core.spec.style.StringSpec\nimport io.kotest.matchers.shouldBe\n\nclass CalculatorSpec : StringSpec({\n    \"loud and large is big\" {\n        Calculator.size(20, true) shouldBe \"BIG\"\n    }\n    \"anything else is small\" {\n        Calculator.size(1, false) shouldBe \"small\"\n    }\n})\n",
        );
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("kotest-warmup");
        fixture(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip("jvm", "Gradle cannot build this Kotest project here");
        return;
    }

    let root = temporary("kotest");
    fixture(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-kotest".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.tests, 2);

    let entries = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive");
    let records = entries
        .iter()
        .filter(|entry| entry.path.ends_with("mcdc.json"))
        .map(|entry| String::from_utf8(entry.contents.clone()).expect("utf-8"))
        .collect::<Vec<_>>();
    // The sentence its author wrote, not a method name invented for it.
    assert!(
        records
            .iter()
            .any(|record| record.contains("loud and large is big")),
        "{records:?}"
    );

    // And the Kotlin function it reached is measured at all. A Kotlin function
    // declaration hides its block behind an unnamed node, so asking the
    // grammar for a `body` field answered nothing and every Kotlin function
    // went unrecorded -- silently, because a function with no block is a real
    // thing in Kotlin and the absence read as one of those.
    let manifest = String::from_utf8(
        entries
            .into_iter()
            .find(|entry| entry.path == "manifest.json")
            .expect("manifest")
            .contents,
    )
    .expect("utf-8");
    assert!(manifest.contains("\"kind\":\"function\""), "{manifest}");
    assert!(
        records
            .iter()
            .all(|record| record.contains("kotlin:function:")),
        "both tests enter the function they exercise: {records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

/// Spock writes its tests in Groovy, which Supercov does not parse: it
/// measures the Java those specifications exercise, not the specifications
/// themselves. That makes a module with a Groovy test set look, to a
/// discovery pass that only reads .java and .kt, like a module with no tests
/// at all -- so it got no listener, recorded nothing, and the unarmed runtime
/// then threw on the first instrumented line. Supercov turned a passing suite
/// into a failing one.
#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn a_spock_specification_is_measured_though_its_tests_are_groovy() {
    let _building = common::building();
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let fixture = |root: &Path| {
        write(
            root,
            "settings.gradle",
            "plugins {\n    id 'org.gradle.toolchains.foojay-resolver-convention' version '1.0.0'\n}\nrootProject.name = 'demo'\n",
        );
        write(
            root,
            "build.gradle",
            // Groovy cannot read the newest JDKs' class files, so the build
            // asks for one it can; what is under test is Supercov.
            "plugins {\n    id 'groovy'\n    id 'java'\n}\n\nrepositories { mavenCentral() }\n\njava {\n    toolchain { languageVersion = JavaLanguageVersion.of(21) }\n}\n\ndependencies {\n    testImplementation 'org.spockframework:spock-core:2.3-groovy-4.0'\n    testImplementation 'org.apache.groovy:groovy:4.0.22'\n    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'\n}\n\ntest { useJUnitPlatform() }\n",
        );
        write(root, "src/main/java/app/Calculator.java", SOURCE);
        write(
            root,
            "src/test/groovy/app/CalculatorSpec.groovy",
            "package app\n\nimport spock.lang.Specification\n\nclass CalculatorSpec extends Specification {\n    def \"loud and large is big\"() {\n        expect:\n        Calculator.size(20, true) == \"BIG\"\n    }\n\n    def \"anything else is small\"() {\n        expect:\n        Calculator.size(1, false) == \"small\"\n    }\n}\n",
        );
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("spock-warmup");
        fixture(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip("jvm", "Gradle cannot build this Spock project here");
        return;
    }

    let root = temporary("spock");
    fixture(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-spock".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    // The suite passes, which is the part that matters most: an unmeasurable
    // test set must cost coverage, never correctness.
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.tests, 2);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    // Under the sentence its author wrote, as Spock reports it.
    assert!(
        records
            .iter()
            .any(|record| record.contains("CalculatorSpec#loud and large is big")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

/// A build may fork more than one JVM to run its tests in parallel: Gradle's
/// maxParallelForks and surefire's forkCount both do, and RxJava sets the
/// first to the number of processors. Every fork runs the listener, so a
/// single agreed path meant each overwrote the last and the run kept whichever
/// finished last — 49 of the 406 tests RxJava had actually run.
#[test]
#[ignore = "drives a real Maven or Gradle build; run it with `npm run test:jvm`"]
fn every_forked_jvm_is_merged_rather_than_overwriting_the_last() {
    let _building = common::building();
    let Some(gradle) = common::tool("gradle") else {
        common::skip("jvm", "no Gradle found");
        return;
    };
    let fixture = |root: &Path| {
        write(root, "settings.gradle", "rootProject.name = 'demo'\n");
        write(
            root,
            "build.gradle",
            "plugins {\n    id 'java'\n}\n\nrepositories { mavenCentral() }\n\ndependencies {\n    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'\n    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'\n}\n\ntest {\n    useJUnitPlatform()\n    // The whole point: more than one JVM, each writing evidence.\n    maxParallelForks = 4\n    forkEvery = 1\n}\n",
        );
        write(root, "src/main/java/app/Calculator.java", SOURCE);
        // Four classes, forkEvery = 1, so four JVMs.
        for name in ["A", "B", "C", "D"] {
            write(
                root,
                &format!("src/test/java/app/{name}Test.java"),
                &format!(
                    "package app;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\nclass {name}Test {{\n    @Test\n    void first() {{ assertEquals(\"BIG\", Calculator.size(20, true)); }}\n    @Test\n    void second() {{ assertEquals(\"small\", Calculator.size(1, false)); }}\n}}\n"
                ),
            );
        }
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("forks-warmup");
        fixture(&warmup);
        let built = Command::new(&gradle)
            .args(["--quiet", "--console=plain", "test"])
            .current_dir(&warmup)
            .output()
            .is_ok_and(|out| out.status.success());
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Gradle cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("forks");
    fixture(&root);
    let request = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![
            gradle.display().to_string(),
            "--console=plain".into(),
            "test".into(),
        ],
        run_id: "run-jvm-forks".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_jvm(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // Every test from every fork, not just the fork that finished last.
    assert_eq!(result.tests, 8);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    for class in ["ATest", "BTest", "CTest", "DTest"] {
        assert!(
            records.iter().any(|record| record.contains(class)),
            "{class} is missing, so a fork was lost: {records:?}"
        );
    }
    std::fs::remove_dir_all(root).ok();
}

fn records_of(result: &DirectJvmRunResult) -> Vec<String> {
    supercov_engine::evidence_archive::read_archive(&result.run_directory.join("evidence.raw.gz"))
        .expect("published archive")
        .into_iter()
        .filter(|entry| entry.path.ends_with("mcdc.json"))
        .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
        .collect()
}

/// JUnit runs a suite's tests at once when the project asks it to, and two
/// tests sharing one probe array cannot both be credited with what they
/// reached. Everything else in this file runs a suite that never asked, which
/// left both halves of that choice -- recording it against the run, and
/// `--exact-attribution` running the suite in order instead -- resting on the
/// claim that they worked.
#[test]
#[ignore = "drives a real Maven build; run it with `npm run test:jvm`"]
fn a_suite_that_runs_at_once_is_credited_per_test_only_when_asked() {
    let _building = common::building();
    let Some(mvn) = common::tool("mvn") else {
        common::skip("jvm", "no Maven found");
        return;
    };
    let resolvable = common::resolvable("jvm", || {
        let warmup = temporary("maven-parallel-warmup");
        let built = maven_can_resolve(&mvn, &warmup);
        std::fs::remove_dir_all(&warmup).ok();
        built
    });
    if !resolvable {
        common::skip(
            "jvm",
            "Maven cannot resolve this project's dependencies here",
        );
        return;
    }

    let root = temporary("maven-parallel");
    fixture(&root);
    // The project's own choice, which is what makes this a measurement of the
    // suite as its author runs it.
    write(
        &root,
        "src/test/resources/junit-platform.properties",
        "junit.jupiter.execution.parallel.enabled=true\n\
         junit.jupiter.execution.parallel.mode.default=concurrent\n",
    );
    let properties = root.join("src/test/resources/junit-platform.properties");
    let before = std::fs::read_to_string(&properties).unwrap();

    let base = DirectJvmRunRequest {
        root: root.clone(),
        command: vec![mvn.display().to_string(), "test".into()],
        run_id: "run-jvm-as-written".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };

    // As written: the suite keeps its parallelism, and what overlaps belongs
    // to the run.
    let mut diagnostics = Vec::new();
    let as_written = run_direct_jvm(&base, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    let printed = String::from_utf8_lossy(&diagnostics).into_owned();
    assert_eq!(as_written.exit_code, 0, "{printed}");
    assert!(
        printed.contains("recorded against the run rather than against a test"),
        "the suite was left parallel and the run has to say so:\n{printed}"
    );
    assert!(
        printed.contains("--exact-attribution"),
        "and say what to do about it:\n{printed}"
    );
    assert!(
        !printed.contains("turned JUnit's parallel execution off"),
        "nothing was taken away from the suite as written:\n{printed}"
    );
    assert_eq!(
        std::fs::read_to_string(&properties).unwrap(),
        before,
        "the author's own properties are not rewritten"
    );
    // And the records say the same thing the diagnostic does. Saying it only
    // in prose would leave the evidence free to credit a test with whatever
    // ran beside it.
    let overlapped = records_of(&as_written);
    assert!(
        overlapped
            .iter()
            .any(|record| record.contains("\"attribution\":\"run-wide\"")),
        "what overlapped belongs to the run: {overlapped:?}"
    );

    // Asked for: the workspace copy runs in order, and each test carries its
    // own coverage.
    let request = DirectJvmRunRequest {
        run_id: "run-jvm-exact".into(),
        exact_attribution: true,
        ..base
    };
    let mut diagnostics = Vec::new();
    let exact = run_direct_jvm(&request, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    let printed = String::from_utf8_lossy(&diagnostics).into_owned();
    assert_eq!(exact.exit_code, 0, "{printed}");
    assert!(
        printed.contains("turned JUnit's parallel execution off"),
        "changing how the suite runs is said out loud:\n{printed}"
    );
    assert_eq!(
        std::fs::read_to_string(&properties).unwrap(),
        before,
        "and it is said about the copy: the author's file is untouched"
    );

    let records = records_of(&exact);
    for name in ["bigWhenLoudAndLarge", "smallOtherwise"] {
        let record = records
            .iter()
            .find(|record| record.contains(name))
            .unwrap_or_else(|| panic!("{name} is in the run: {records:?}"));
        assert!(
            record.contains("\"attribution\":\"exact\""),
            "running them in order is what makes them attributable:\n{record}"
        );
    }
    std::fs::remove_dir_all(root).ok();
}
