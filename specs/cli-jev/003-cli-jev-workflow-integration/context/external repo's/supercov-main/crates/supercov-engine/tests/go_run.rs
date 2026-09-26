//! The whole Go lifecycle, on a module with more than one package.
//!
//! The frontend test proves instrumented Go compiles and reports the truth for
//! one file. This proves the parts around it: that the project is copied and
//! rewritten without touching the author's tree, that each package's test
//! binary writes evidence of its own and the run merges them, that decisions
//! numbered in different files do not collide, and that a run is published.
//!
//! Needs `go` on PATH and skips without it.

use std::path::{Path, PathBuf};
use std::process::Command;

use supercov_engine::go_run::{DirectGoRunRequest, run_direct_go};

mod common;

fn go_binary() -> Option<PathBuf> {
    // Homebrew's Go is not on a non-login shell's PATH on macOS.
    for candidate in ["go", "/opt/homebrew/bin/go", "/usr/local/go/bin/go"] {
        let path = PathBuf::from(candidate);
        if Command::new(&path)
            .arg("version")
            .output()
            .is_ok_and(|out| out.status.success())
        {
            return Some(path);
        }
    }
    None
}

/// What the toolchain on this machine calls itself, as `go version` reports.
fn go_language_version(go: &Path) -> String {
    Command::new(go)
        .arg("version")
        .output()
        .ok()
        .and_then(|out| String::from_utf8(out.stdout).ok())
        // `go version go1.27.1 darwin/arm64`
        .and_then(|text| {
            text.split_whitespace()
                .find(|word| word.starts_with("go1."))
                .map(str::to_owned)
        })
        .unwrap_or_default()
}

fn temporary(label: &str) -> PathBuf {
    let root = std::env::temp_dir().join(format!(
        "supercov-go-run-{label}-{}-{}",
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

/// Two packages, each with a decision of its own. If decisions were numbered
/// per file they would both be decision 0 and would share condition state.
fn fixture(root: &Path) {
    write(root, "go.mod", "module example.com/app\n\ngo 1.22\n");
    write(
        root,
        "auth/auth.go",
        "package auth\n\nfunc Allow(admin bool, active bool) bool {\n\tif admin && active {\n\t\treturn true\n\t}\n\treturn false\n}\n",
    );
    write(
        root,
        "auth/auth_test.go",
        "package auth\n\nimport \"testing\"\n\nfunc TestAllows(t *testing.T) {\n\tif !Allow(true, true) {\n\t\tt.Fatal(\"admin and active should be allowed\")\n\t}\n}\n\nfunc TestDenies(t *testing.T) {\n\tif Allow(false, true) {\n\t\tt.Fatal(\"a non-admin should be denied\")\n\t}\n}\n",
    );
    write(
        root,
        "billing/billing.go",
        "package billing\n\nfunc Charge(amount int, trial bool) int {\n\tif amount > 0 || trial {\n\t\treturn amount\n\t}\n\treturn 0\n}\n",
    );
    write(
        root,
        "billing/billing_test.go",
        "package billing\n\nimport \"testing\"\n\nfunc TestCharges(t *testing.T) {\n\tif Charge(5, false) != 5 {\n\t\tt.Fatal(\"a positive amount is charged\")\n\t}\n}\n\nfunc TestSkipsWhenAsked(t *testing.T) {\n\tt.Skip(\"not today\")\n}\n",
    );
}

#[test]
fn a_multi_package_module_runs_and_publishes_what_each_test_reached() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    // The lifecycle shells out to the command as given, so `go` has to be
    // reachable by the name the command uses.
    let root = temporary("multi-package");
    fixture(&root);

    let before = std::fs::read_to_string(root.join("auth/auth.go")).unwrap();
    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-multi".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };

    // The author's tree is untouched: instrumentation happens on a copy.
    assert_eq!(
        std::fs::read_to_string(root.join("auth/auth.go")).unwrap(),
        before,
        "the project's own sources must come back exactly as they went in"
    );

    assert_eq!(result.exit_code, 0);
    assert_eq!(result.packages, 2, "one test binary per package");
    assert_eq!(result.source_files, 2);
    assert_eq!(result.tests, 4);

    let archive = result.run_directory.join("evidence.raw.gz");
    let named = supercov_engine::evidence_archive::read_archive(&archive)
        .expect("published archive")
        .into_iter()
        .map(|entry| entry.path)
        .collect::<Vec<_>>();
    // A published run carries what the numbers mean, who produced them, the
    // obligations they are measured against, and one record per test.
    for required in ["coverage-model.json", "frontend.json", "manifest.json"] {
        assert!(named.iter().any(|path| path == required), "{named:?}");
    }
    assert_eq!(
        named
            .iter()
            .filter(|path| path.ends_with("mcdc.json"))
            .count(),
        4,
        "one record per test: {named:?}"
    );
}

#[test]
fn decisions_in_different_packages_keep_their_own_condition_state() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    // `auth` evaluates `admin && active` and `billing` evaluates
    // `amount > 0 || trial`. Numbered per file they would both be decision 0,
    // sharing one slot in the runtime's state array: the vectors recorded
    // would describe neither expression, and MC/DC would be judged from an
    // evaluation that never happened.
    let root = temporary("decision-state");
    fixture(&root);

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-decisions".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };

    let archive = result.run_directory.join("evidence.raw.gz");
    assert!(archive.exists(), "{}", archive.display());
    let entries =
        supercov_engine::evidence_archive::read_archive(&archive).expect("published archive");
    let manifest = String::from_utf8(
        entries
            .iter()
            .find(|entry| entry.path == "manifest.json")
            .expect("a published run carries its manifest")
            .contents
            .clone(),
    )
    .expect("utf-8");
    // Two decisions, one per package, each with its own two conditions.
    let decisions = manifest.matches("\"conditions\"").count();
    assert_eq!(
        decisions, 2,
        "each package's decision is its own obligation:\n{manifest}"
    );
    assert!(manifest.contains("auth/auth.go"), "{manifest}");
    assert!(manifest.contains("billing/billing.go"), "{manifest}");
}

/// A go.work repository has several modules and no module at its root. Each
/// needs a runtime of its own, because an import resolves against the module
/// that names it and one module cannot import a package inside another.
#[test]
fn every_module_of_a_workspace_is_measured_and_merged() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("workspace");
    write(
        root.as_path(),
        "go.work",
        "go 1.22\n\nuse (\n\t./core\n\t./app\n)\n",
    );
    write(
        root.as_path(),
        "core/go.mod",
        "module example.com/core\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "core/calc.go",
        "package core\n\nfunc Allow(admin, active bool) bool {\n\tif admin && active {\n\t\treturn true\n\t}\n\treturn false\n}\n",
    );
    write(
        root.as_path(),
        "core/calc_test.go",
        "package core\n\nimport \"testing\"\n\nfunc TestAllow(t *testing.T) {\n\tif !Allow(true, true) {\n\t\tt.Fatal(\"expected allow\")\n\t}\n}\n",
    );
    write(
        root.as_path(),
        "app/go.mod",
        "module example.com/app\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "app/greet.go",
        "package app\n\nfunc Hi(loud bool) string {\n\tif loud {\n\t\treturn \"HI\"\n\t}\n\treturn \"hi\"\n}\n",
    );
    // One line, brace to brace: an announcement inserted after the brace with
    // nothing following it would run into this statement and stop being Go.
    write(
        root.as_path(),
        "app/greet_test.go",
        "package app\n\nimport \"testing\"\n\nfunc TestHi(t *testing.T) { if Hi(true) != \"HI\" { t.Fatal(\"expected HI\") } }\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![
            go.display().to_string(),
            "test".into(),
            "./core/...".into(),
            "./app/...".into(),
        ],
        run_id: "run-go-workspace".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.packages, 2);
    assert_eq!(result.source_files, 2);
    assert_eq!(result.tests, 2);

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
    assert!(manifest.contains("core/calc.go"), "{manifest}");
    assert!(manifest.contains("app/greet.go"), "{manifest}");
    std::fs::remove_dir_all(root).ok();
}

/// A directory with a go.mod that the workspace does not name is a different
/// module. `go test ./...` walks straight past it, so instrumenting it puts
/// obligations in the denominator no test can reach and writes a probe file
/// importing a runtime that module cannot resolve -- which stops a build that
/// worked before Supercov was asked to measure it.
#[test]
fn a_nested_module_does_not_break_the_build_around_it() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("nested");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/root\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "top.go",
        "package root\n\nfunc Top(x bool) int {\n\tif x {\n\t\treturn 1\n\t}\n\treturn 0\n}\n",
    );
    write(
        root.as_path(),
        "top_test.go",
        "package root\n\nimport \"testing\"\n\nfunc TestTop(t *testing.T) { if Top(true) != 1 { t.Fatal(\"no\") } }\n",
    );
    write(
        root.as_path(),
        "sub/go.mod",
        "module example.com/sub\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "sub/sub.go",
        "package sub\n\nfunc Inner(x bool) int {\n\tif x {\n\t\treturn 2\n\t}\n\treturn 0\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-nested".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0, "the build must still work");
    // Only the root module's source: the nested one is not part of this run.
    assert_eq!(result.source_files, 1);
    assert_eq!(result.tests, 1);
    std::fs::remove_dir_all(root).ok();
}

/// A Go test that calls `t.Parallel()` is deliberately left unattributed:
/// probes are a store into one shared array, so what it reaches while others
/// run beside it cannot be credited to it. The declaration says its coverage
/// still counts run-wide — and until there was a record to carry it, nothing
/// did. A suite written the way Go suites are written measured almost nothing
/// and was told nothing about why: samber/lo calls `t.Parallel()` 1606 times
/// across 548 tests, and reported 0.26% of its statements.
#[test]
fn a_parallel_tests_coverage_counts_even_though_no_test_can_claim_it() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("parallel");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/par\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package par\n\nfunc Serial(x bool) int {\n\tif x {\n\t\treturn 1\n\t}\n\treturn 0\n}\n\nfunc Parallel(x bool) int {\n\tif x {\n\t\treturn 2\n\t}\n\treturn 0\n}\n\nfunc Never(x bool) int {\n\tif x {\n\t\treturn 3\n\t}\n\treturn 0\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package par\n\nimport \"testing\"\n\nfunc TestSerial(t *testing.T) {\n\tif Serial(true) != 1 {\n\t\tt.Fatal(\"serial\")\n\t}\n}\n\nfunc TestParallel(t *testing.T) {\n\tt.Parallel()\n\tif Parallel(true) != 2 {\n\t\tt.Fatal(\"parallel\")\n\t}\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-parallel".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // Both ran and both are in the run; only the serial one can be named for
    // what it reached.
    assert_eq!(result.tests, 2);
    assert_eq!(result.unattributed, 1);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();

    let background = records
        .iter()
        .find(|record| record.contains("\"role\":\"background\""))
        .expect("the run carries what no test could claim");
    // What the parallel test reached is in it, and what nothing reached is not.
    assert!(background.contains("go:statement:"), "{background}");
    // It counts as coverage only because the run passed. A failing run cannot
    // say which of this came from the test that failed, so it would not.
    assert!(background.contains("\"status\":\"passed\""), "{background}");
    // And the serial test still claims its own, rather than everything being
    // swept into the background record.
    assert!(
        records
            .iter()
            .any(|record| record.contains("TestSerial") && record.contains("go:statement:")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

/// `t.Parallel()` is idiomatic, and a package where every test calls it is
/// ordinary Go. Every such test is deliberately unattributed — what it reached
/// while others ran beside it cannot be credited to it — and the run was then
/// discarded for having no attributed test, so nothing was published at all:
/// not the lines, not the branches, not the MC/DC. The evidence existed the
/// whole time; it simply had no owner. One reporter's codebase calls
/// `t.Parallel()` in 935 of 1144 test files, leaving 2.7% of its tests
/// measurable.
#[test]
fn a_package_whose_tests_are_all_parallel_still_publishes_what_it_measured() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("all-parallel");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/allpar\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package allpar\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n\nfunc Unreached() string {\n\treturn \"never\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package allpar\n\nimport \"testing\"\n\nfunc TestPositive(t *testing.T) {\n\tt.Parallel()\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"want positive\")\n\t}\n}\n\nfunc TestNonPositive(t *testing.T) {\n\tt.Parallel()\n\tif Classify(-1) != \"non-positive\" {\n\t\tt.Fatal(\"want non-positive\")\n\t}\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-all-parallel".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "a run that measured a whole package was discarded: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // Nothing can be attributed, and the run says so rather than implying the
    // suite is empty: two tests ran and neither could be named for what it
    // reached. Both are recorded -- leaving them out is what made the run
    // report a package of two passing tests as having none.
    assert_eq!(result.tests, 2);
    assert_eq!(
        result.unattributed, 2,
        "both tests ran and neither is named"
    );

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    let background = records
        .iter()
        .find(|record| record.contains("\"role\":\"background\""))
        .unwrap_or_else(|| panic!("the run carries what no test could claim: {records:?}"));
    assert!(background.contains("go:statement:"), "{background}");
    assert!(background.contains("\"status\":\"passed\""), "{background}");
    std::fs::remove_dir_all(root).ok();
}

/// A suite whose tests reach nothing is a zero, and a zero is a measurement.
///
/// The guard this used to trip exists because a run of nothing satisfies every
/// floor -- but that is about a denominator of nothing, not a numerator of
/// nothing. Here there is an obligation and no test reached it, which is `0 of
/// 1`: true, useful, and exactly what someone needs to be told. Refusing it
/// reported `a run that measured nothing is not published` for a suite whose
/// test had just run, which is both wrong and unactionable.
#[test]
fn a_suite_whose_tests_reach_nothing_is_published_as_the_zero_it_is() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("reaches-nothing");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/nothing\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package nothing\n\nfunc Unreached() string {\n\treturn \"never\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package nothing\n\nimport \"testing\"\n\nfunc TestNothing(t *testing.T) {\n\tt.Parallel()\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-reaches-nothing".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "a test that ran and covered nothing is a result, not an absence: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.tests, 1);
    assert_eq!(result.unattributed, 1);
    std::fs::remove_dir_all(root).ok();
}

/// A run that observed no test at all is still refused.
///
/// The measurement that is worth nothing is the one with no denominator and no
/// observer: nothing ran, so nothing can be said, and publishing it would put
/// a floor-satisfying zero where an answer should be. A suite Supercov could
/// not attach to at all looks exactly like this.
#[test]
fn a_run_that_observed_no_test_at_all_is_refused() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("observed-nothing");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/observed\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package observed\n\nfunc Unreached() string {\n\treturn \"never\"\n}\n",
    );
    // A test file the toolchain accepts that declares no test: `go test` runs
    // the package and every obligation goes unanswered by anyone.
    write(
        root.as_path(),
        "lib_test.go",
        "package observed\n\nfunc helper() string {\n\treturn \"not a test\"\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-observed-nothing".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let error = run_direct_go(&request, &mut diagnostics)
        .expect_err("a run nothing observed is not published");
    assert!(error.contains("measured nothing"), "{error}");
    std::fs::remove_dir_all(root).ok();
}

/// Go 1.26 let `new` take a value. tree-sitter-go cannot express that, so
/// every source file holding one was dropped from the denominator with a
/// single warning — and the run then reported success over the files that were
/// left. `Go coverage: 1 test(s) across 0 source file(s)` with exit 0 is the
/// worst shape a wrong number can take, because an agent loop reads it as a
/// pass.
#[test]
fn a_source_file_using_go_1_26_new_is_measured_like_any_other() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("new-value");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/newvalue\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package newvalue\n\nfunc Plain(n int) *int {\n\tif n > 0 {\n\t\treturn &n\n\t}\n\treturn new(int)\n}\n",
    );
    // The value form only compiles on Go 1.26 and the suite has to run on the
    // toolchain that is here, so it goes in a file the toolchain skips and
    // discovery does not. What is being proved is the half that is broken on
    // every version: that Supercov can read the construct, and that the file
    // holding it is in the denominator rather than dropped out of it.
    write(
        root.as_path(),
        "boxed.go",
        "//go:build ignore\n\npackage newvalue\n\nfunc Boxed() *string {\n\treturn new(\"hello\")\n}\n\nfunc Sum(a, b int) *int {\n\treturn new(a + b)\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package newvalue\n\nimport \"testing\"\n\nfunc TestPlain(t *testing.T) {\n\tif *Plain(1) != 1 {\n\t\tt.Fatal(\"plain\")\n\t}\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-new-value".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(
        result.source_files, 2,
        "both files are in the denominator, the one using the construct included"
    );
    assert_eq!(result.unparseable_sources, 0);
    let diagnostics = String::from_utf8_lossy(&diagnostics);
    assert!(!diagnostics.contains("could not parse"), "{diagnostics}");
    std::fs::remove_dir_all(root).ok();
}

/// A source file Supercov cannot read is a hole in the denominator. One that
/// leaves nothing readable at all is not a hole, it is the whole floor: the
/// run would report coverage of zero obligations, which satisfies every
/// threshold, with exit 0. So it is refused, the way a project with no test
/// package already is.
#[test]
fn a_project_whose_sources_none_parse_is_refused_rather_than_reported_green() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("no-source-parses");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/unreadable\n\ngo 1.22\n",
    );
    // Unparseable to Supercov and to the Go compiler alike; what matters is
    // that the run does not report success over a denominator of nothing.
    write(
        root.as_path(),
        "lib.go",
        "package unreadable\n\nfunc f( {\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package unreadable\n\nimport \"testing\"\n\nfunc TestNothing(t *testing.T) {}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-unreadable".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let error = run_direct_go(&request, &mut diagnostics)
        .expect_err("a run with nothing in its denominator is not published");
    assert!(
        error.contains("denominator of nothing"),
        "and it names the file it could not read: {error}"
    );
    assert!(error.contains("lib.go"), "{error}");
    std::fs::remove_dir_all(root).ok();
}

/// One file that does not parse among several that do is a hole, not a floor:
/// the run is published, and the hole travels with the number it was taken out
/// of. It reaches the stored run as a blocking limitation, and the count comes
/// back with the result so the line that reports success can say it.
#[test]
fn an_unparseable_file_among_readable_ones_is_published_and_counted() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("partial-hole");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/partial\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "good.go",
        "package partial\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n",
    );
    // A build constraint the toolchain honours and discovery does not, which
    // is how a file can be unreadable to Supercov without the package failing
    // to build — the shape a generated or platform-specific file takes.
    write(
        root.as_path(),
        "gen.go",
        "//go:build ignore\n\npackage partial\n\nfunc Broken( {\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package partial\n\nimport \"testing\"\n\nfunc TestPositive(t *testing.T) {\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"want positive\")\n\t}\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-partial-hole".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "one hole is not a reason to discard a measured run: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.source_files, 1, "the readable file is measured");
    assert_eq!(result.unparseable_sources, 1, "and the hole is counted");

    // Counted in the result is not enough on its own: the run has to carry it,
    // so `supercov runs latest` can still name the file long after the build
    // log is gone.
    let declaration = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .find(|entry| entry.path.ends_with("manifest.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .expect("the run declares what it measured against");
    assert!(declaration.contains("file-does-not-parse"), "{declaration}");
    assert!(declaration.contains("gen.go"), "{declaration}");
    std::fs::remove_dir_all(root).ok();
}

/// The construct from the report, compiled and run for real.
///
/// The parser tests prove Supercov can read `new(value)` on any toolchain;
/// this proves the whole lifecycle around it -- that instrumented source using
/// it still compiles, that the file is in the denominator, and that the lines
/// inside it are reported covered or uncovered according to what the tests
/// actually reached. It needs both halves of Go's own gate: a toolchain of
/// 1.26 or newer, and a `go.mod` that asks for the 1.26 language.
#[test]
fn go_1_26_new_of_a_value_compiles_instrumented_and_reports_what_ran() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let found = go_language_version(go.as_path());
    if !common::at_least(&found, "1.26") {
        common::skip_below_version("go", "1.26", &found);
        return;
    }
    let root = temporary("new-value-live");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/live\n\ngo 1.26\n",
    );
    // Every shape of the construct the report named: a literal, an expression,
    // a call, and the nested form. Beside them the type forms that have always
    // worked, because a stand-in written over one of those would break a file
    // that used to be fine.
    write(
        root.as_path(),
        "lib.go",
        concat!(
            "package live\n\n",
            "func Greeting() *string {\n\treturn new(\"hello\")\n}\n\n",
            "func Sum(a, b int) *int {\n\treturn new(a + b)\n}\n\n",
            "func Nested() **int {\n\treturn new(new(5))\n}\n\n",
            "func Widened(n int) *int64 {\n\treturn new(int64(n))\n}\n\n",
            "func Types() (*int, *map[string]int, *[]byte, *chan int) {\n",
            "\treturn new(int), new(map[string]int), new([]byte), new(chan int)\n}\n\n",
            "func Unreached() *string {\n\treturn new(\"never\")\n}\n",
        ),
    );
    write(
        root.as_path(),
        "lib_test.go",
        concat!(
            "package live\n\nimport \"testing\"\n\n",
            "func TestValues(t *testing.T) {\n",
            "\tif *Greeting() != \"hello\" {\n\t\tt.Fatal(\"greeting\")\n\t}\n",
            "\tif *Sum(2, 3) != 5 {\n\t\tt.Fatal(\"sum\")\n\t}\n",
            "\tif **Nested() != 5 {\n\t\tt.Fatal(\"nested\")\n\t}\n",
            "\tif *Widened(7) != 7 {\n\t\tt.Fatal(\"widened\")\n\t}\n",
            // The value form inside the test file too: that is the half that
            // used to take the whole run down with it, exit 1.
            "\twant := new(\"hello\")\n",
            "\tif *want != \"hello\" {\n\t\tt.Fatal(\"want\")\n\t}\n}\n\n",
            "func TestTypes(t *testing.T) {\n\tif _, _, _, c := Types(); c == nil {\n\t\tt.Fatal(\"types\")\n\t}\n}\n",
        ),
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-new-value-live".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed on {found}: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    let printed = String::from_utf8_lossy(&diagnostics);
    assert_eq!(
        result.exit_code, 0,
        "instrumented source using the construct has to still compile:\n{printed}"
    );
    assert_eq!(result.source_files, 1);
    assert_eq!(result.unparseable_sources, 0, "{printed}");
    assert!(!printed.contains("could not parse"), "{printed}");
    // Both tests announced themselves: the value form in a test file no longer
    // costs the file its instrumentation.
    assert_eq!(result.tests, 2);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    let values = records
        .iter()
        .find(|record| record.contains("TestValues"))
        .unwrap_or_else(|| panic!("the test that reached the construct: {records:?}"));
    // It is measured, not merely parsed: the test that ran the value forms
    // claims statements of its own.
    assert!(values.contains("go:statement:"), "{values}");
    std::fs::remove_dir_all(root).ok();
}

/// A package of nothing but `Example` functions is the case the parallel
/// report predicted would behave the same way, and it did: `go test` runs an
/// Example with an `Output` comment like any other test, but no Example takes
/// a `*testing.T` to be named by, so the package measured itself perfectly and
/// published nothing.
#[test]
fn a_package_of_nothing_but_examples_publishes_what_it_measured() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("examples-only");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/exonly\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package exonly\n\nimport \"fmt\"\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n\nfunc Show(n int) {\n\tfmt.Println(Classify(n))\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package exonly\n\nfunc ExampleShow() {\n\tShow(1)\n\t// Output: positive\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-examples-only".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "an Example is a test go runs, and what it reached was measured: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // It ran and it is recorded; what it cannot do is claim what it reached.
    assert_eq!(result.tests, 1);
    assert_eq!(result.unattributed, 1);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    assert!(
        records
            .iter()
            .any(|record| record.contains("\"role\":\"background\"")
                && record.contains("go:statement:")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

/// A `Fuzz` target's seed corpus is the same shape of claim as an Example's.
#[test]
fn a_package_of_nothing_but_fuzz_targets_publishes_what_it_measured() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("fuzz-only");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/fuzzonly\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package fuzzonly\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package fuzzonly\n\nimport \"testing\"\n\nfunc FuzzClassify(f *testing.F) {\n\tf.Add(1)\n\tf.Fuzz(func(t *testing.T, n int) {\n\t\tClassify(n)\n\t})\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-fuzz-only".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.unattributed, 1);
    std::fs::remove_dir_all(root).ok();
}

/// A test file Supercov cannot parse took the whole run down with it, exit 1,
/// on a suite the toolchain itself compiled and passed.
///
/// That is the same fail-closed reflex a source file was corrected for, and it
/// is worse here: the file need not even be in the build. What the file costs
/// is attribution for the tests it declares -- there is nowhere to put the
/// announcement -- and what they reach still counts run-wide. So the file is
/// reported as the hole it is and the run goes on.
#[test]
fn an_unparseable_test_file_is_a_hole_rather_than_the_end_of_the_run() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("unparseable-test");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/badtest\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package badtest\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package badtest\n\nimport \"testing\"\n\nfunc TestGood(t *testing.T) {\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"no\")\n\t}\n}\n",
    );
    // A build constraint the toolchain honours and discovery does not: the
    // suite compiles and passes, and only Supercov has a problem with it.
    write(
        root.as_path(),
        "gen_test.go",
        "//go:build ignore\n\npackage badtest\n\nfunc Broken( {\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-unparseable-test".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "one test file it could not read is not a reason to discard a passing suite: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // The test in the file that did parse is still attributed.
    assert_eq!(result.tests, 1);
    assert_eq!(result.unparseable_tests, 1);
    let printed = String::from_utf8_lossy(&diagnostics);
    assert!(printed.contains("gen_test.go"), "{printed}");

    // And the hole is declared rather than merely printed.
    let manifest = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .find(|entry| entry.path.ends_with("manifest.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .expect("the run declares what it measured against");
    assert!(manifest.contains("gen_test.go"), "{manifest}");
    assert!(manifest.contains("file-does-not-parse"), "{manifest}");
    std::fs::remove_dir_all(root).ok();
}

/// A `_test.go` the toolchain never builds declares nothing.
///
/// `//go:build ignore` is the conventional way to keep Go beside Go without
/// compiling it -- a reference harness, a generator's input -- and `go test`
/// walks straight past it. Supercov read its `TestMain` as the package's own
/// and stood its own harness down to avoid declaring a second, so the runtime
/// was never armed: the package wrote no evidence and a passing suite
/// published nothing, with `a run that measured nothing is not published`.
#[test]
fn a_test_file_the_build_ignores_does_not_stand_the_harness_down() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("ignored-test-main");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/ignoredmain\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package ignoredmain\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package ignoredmain\n\nimport \"testing\"\n\nfunc TestGood(t *testing.T) {\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"no\")\n\t}\n}\n",
    );
    let harness = "package ignoredmain\n\nimport (\n\t\"os\"\n\t\"testing\"\n)\n\nfunc TestMain(m *testing.M) {\n\tos.Exit(m.Run())\n}\n";
    write(
        root.as_path(),
        "harness_test.go",
        &format!("//go:build ignore\n\n{harness}"),
    );

    let mut request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-ignored-test-main".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "a file the toolchain never builds cannot stand the harness down: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    assert_eq!(result.tests, 1, "the test that actually runs is measured");

    // The legacy spelling says the same thing, and predates the directive by
    // enough years to still be in real trees.
    write(
        root.as_path(),
        "harness_test.go",
        &format!("// +build ignore\n\n{harness}"),
    );
    request.run_id = "run-go-ignored-test-main-legacy".into();
    let mut diagnostics = Vec::new();
    let result = run_direct_go(&request, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    assert_eq!(result.tests, 1);

    // And a TestMain the build does take is still the package's own: standing
    // the harness down there is what keeps Go's one-per-package rule.
    write(root.as_path(), "harness_test.go", harness);
    request.run_id = "run-go-real-test-main".into();
    let mut diagnostics = Vec::new();
    let result = run_direct_go(&request, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    assert_eq!(result.exit_code, 0, "a second TestMain would not compile");
    assert_eq!(result.tests, 1);
    std::fs::remove_dir_all(root).ok();
}

/// A `TestMain` in a file Supercov could not parse is still a `TestMain`.
///
/// Go permits exactly one per package. Skipping an unreadable test file means
/// its declarations go unseen, and synthesising a second `TestMain` beside one
/// that was there all along does not fail to measure -- it fails to build, and
/// Supercov breaks a suite that worked.
#[test]
fn a_test_main_inside_an_unparseable_file_is_not_declared_twice() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("unparseable-test-main");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/badmain\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package badmain\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package badmain\n\nimport \"testing\"\n\nfunc TestGood(t *testing.T) {\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"no\")\n\t}\n}\n",
    );
    // Compiles and runs; only the parser trips, and on a construct after the
    // TestMain rather than in it.
    write(
        root.as_path(),
        "main_test.go",
        "package badmain\n\nimport (\n\t\"os\"\n\t\"testing\"\n)\n\nfunc TestMain(m *testing.M) {\n\tos.Exit(m.Run())\n}\n\nfunc unreadable( {\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-unparseable-test-main".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = run_direct_go(&request, &mut diagnostics);
    let printed = String::from_utf8_lossy(&diagnostics);
    // Whatever else happens, the generated harness must not declare a second
    // TestMain: that is a build failure, not a measurement gap.
    assert!(
        !printed.contains("TestMain redeclared") && !printed.contains("redeclared in this block"),
        "Supercov declared a second TestMain beside the package's own:\n{printed}"
    );
    if let Ok(result) = &result {
        assert_eq!(result.exit_code, 0, "{printed}");
    }
    std::fs::remove_dir_all(root).ok();
}

/// A test nothing could be credited with is still a test that ran.
///
/// It was absent from the published run entirely, and absence reads everywhere
/// as "did not run": `runs <id> test <name>` answered "Test not found" for a
/// test that had just passed, the summary said the suite had no tests, and
/// affected-test selection returned an empty set for a change to code those
/// tests exercised -- with exit 0, which an agent running only affected tests
/// would act on by running nothing at all.
#[test]
fn a_parallel_test_is_recorded_as_having_run_and_credited_with_nothing() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("parallel-records");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/recorded\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package recorded\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n\nfunc Serial(n int) int {\n\tif n > 0 {\n\t\treturn n\n\t}\n\treturn 0\n}\n",
    );
    // One of each, so the mixed case is covered too: the serial test keeps its
    // exact attribution while the parallel ones lose theirs.
    write(
        root.as_path(),
        "lib_test.go",
        "package recorded\n\nimport \"testing\"\n\nfunc TestSerial(t *testing.T) {\n\tif Serial(1) != 1 {\n\t\tt.Fatal(\"serial\")\n\t}\n}\n\nfunc TestPositive(t *testing.T) {\n\tt.Parallel()\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"positive\")\n\t}\n}\n\nfunc TestSkipped(t *testing.T) {\n\tt.Parallel()\n\tt.Skip(\"not today\")\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-parallel-records".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    let result = match run_direct_go(&request, &mut diagnostics) {
        Ok(result) => result,
        Err(error) => panic!(
            "run failed: {error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        ),
    };
    assert_eq!(result.exit_code, 0);
    // All three ran and all three are in the run. Two of them can be named
    // for nothing they reached, which is a different fact from not existing.
    assert_eq!(result.tests, 3);
    assert_eq!(result.unattributed, 2);

    let records = supercov_engine::evidence_archive::read_archive(
        &result.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();

    let named = |name: &str| {
        records
            .iter()
            .find(|record| record.contains(&format!("\"test\":\"{name}\"")))
            .unwrap_or_else(|| panic!("{name} is in the run: {records:?}"))
    };
    // The serial test keeps exact attribution and its own coverage.
    let serial = named("TestSerial");
    assert!(serial.contains("\"attribution\":\"exact\""), "{serial}");
    assert!(serial.contains("go:statement:"), "{serial}");

    // The parallel ones say what they are, and claim nothing.
    let parallel = named("TestPositive");
    assert!(
        parallel.contains("\"attribution\":\"run-wide\""),
        "{parallel}"
    );
    assert!(
        !parallel.contains("go:statement:"),
        "a test that cannot be attributed must claim no obligation:\n{parallel}"
    );
    // And its outcome is read off its own *testing.T rather than guessed: a
    // skipped test is recorded skipped, not passed and not unknown.
    assert!(parallel.contains("\"status\":\"passed\""), "{parallel}");
    let skipped = named("TestSkipped");
    assert!(skipped.contains("\"status\":\"skipped\""), "{skipped}");

    // What the parallel tests reached is still measured, against the run.
    assert!(
        records
            .iter()
            .any(|record| record.contains("\"role\":\"background\"")
                && record.contains("go:statement:")),
        "{records:?}"
    );
    std::fs::remove_dir_all(root).ok();
}

/// Which tests a change could have reached, when nothing recorded what half of
/// them ran.
///
/// This is the half that was not merely misleading but unsafe. A test whose
/// coverage nothing could attribute recorded no files, and an empty file list
/// read as "no change reached it": a change to the function every test in the
/// package exercised reported `0 of 0 tests affected` and exited 0, so an
/// agent running only the affected tests ran nothing and called the change
/// safe.
///
/// A test like that cannot be narrowed below the run it ran in -- and does not
/// need to be narrowed further than that. Its reach is bounded above by what
/// the run covered, which makes both answers here real: a change inside that
/// bound could have reached it, and a change outside it reached no test at
/// all.
#[test]
fn a_change_selects_the_tests_nothing_could_attribute_when_it_could_have_reached_them() {
    use supercov_engine::run_store::{discover_runs, select_run};

    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("affected-parallel");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/affected\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package affected\n\nfunc Classify(n int) string {\n\tif n > 0 {\n\t\treturn \"positive\"\n\t}\n\treturn \"non-positive\"\n}\n\nfunc NeverCalled(n int) string {\n\tif n > 99 {\n\t\treturn \"big\"\n\t}\n\treturn \"small\"\n}\n",
    );
    write(
        root.as_path(),
        "lib_test.go",
        "package affected\n\nimport \"testing\"\n\nfunc TestPositive(t *testing.T) {\n\tt.Parallel()\n\tif Classify(1) != \"positive\" {\n\t\tt.Fatal(\"positive\")\n\t}\n}\n\nfunc TestNonPositive(t *testing.T) {\n\tt.Parallel()\n\tif Classify(-1) != \"non-positive\" {\n\t\tt.Fatal(\"non-positive\")\n\t}\n}\n",
    );

    let request = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-affected-parallel".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };
    let mut diagnostics = Vec::new();
    run_direct_go(&request, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });

    let selected = |root: &Path| -> (Vec<String>, Vec<String>) {
        let inventory = discover_runs(root).expect("runs");
        let run = select_run(&inventory, None).expect("a run");
        let data = supercov_engine::assertion_store::affected_tests(root, run).expect("affected");
        let names = |bucket: &str| {
            data[bucket]
                .as_array()
                .into_iter()
                .flatten()
                .filter_map(|test| test["name"].as_str().map(str::to_owned))
                .collect::<Vec<_>>()
        };
        (names("affected"), names("undetermined"))
    };

    // Nothing has changed: nothing is selected, and "cannot be narrowed" does
    // not mean "always run".
    let (affected, undetermined) = selected(root.as_path());
    assert!(affected.is_empty(), "{affected:?}");
    assert!(undetermined.is_empty(), "{undetermined:?}");

    // A change to code no test ran reached no test, these included. This is
    // the narrowing that makes the bound worth having: without it the only
    // sound answer would be "every test, always".
    let source = root.join("lib.go");
    let original = std::fs::read_to_string(&source).expect("source");
    std::fs::write(
        &source,
        original.replace("return \"big\"", "return \"huge\""),
    )
    .expect("write");
    let (affected, undetermined) = selected(root.as_path());
    assert!(affected.is_empty(), "{affected:?}");
    assert!(
        undetermined.is_empty(),
        "a change to code no test ran reached no test: {undetermined:?}"
    );

    // A change to the code they did run could have reached them, and nothing
    // can say which of them. Both are selected, and as undetermined rather
    // than affected: "might have run it" is a different claim from "ran it",
    // and reporting the first as the second would claim a precision the run
    // does not have.
    std::fs::write(
        &source,
        original.replace("return \"positive\"", "return \"POSITIVE\""),
    )
    .expect("write");
    let (affected, undetermined) = selected(root.as_path());
    assert!(
        affected.is_empty(),
        "nothing here ran it provably: {affected:?}"
    );
    assert_eq!(
        undetermined,
        ["TestNonPositive", "TestPositive"],
        "a change to the function both tests exercised has to select both"
    );
    std::fs::remove_dir_all(root).ok();
}

/// What `--exact-attribution` buys, and that it is bought rather than assumed.
///
/// A test that calls `t.Parallel()` cannot be credited with what it reached
/// while others run beside it, so by default it is counted run-wide and the
/// suite keeps its parallelism. Asking for exact attribution runs the package
/// one test at a time, and then each is credited with its own.
///
/// The announcement has to wait for `t.Parallel()` to return. Above it, every
/// parallel test would announce itself while entering and pausing -- all of
/// them open at once -- and the runtime would rightly give up attributing any
/// of them, which produced a run with no tests in it at all.
#[test]
fn exact_attribution_credits_a_parallel_test_by_running_it_alone() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain found");
        return;
    };
    let root = temporary("exact-attribution");
    write(
        root.as_path(),
        "go.mod",
        "module example.com/exact\n\ngo 1.22\n",
    );
    write(
        root.as_path(),
        "lib.go",
        "package exact\n\nfunc Positive(n int) bool {\n\tif n > 0 {\n\t\treturn true\n\t}\n\treturn false\n}\n\nfunc Negative(n int) bool {\n\tif n < 0 {\n\t\treturn true\n\t}\n\treturn false\n}\n",
    );
    // Each test reaches a different function, so exact attribution is a claim
    // with an observable consequence: each is credited with its own and not
    // the other's.
    write(
        root.as_path(),
        "lib_test.go",
        "package exact\n\nimport \"testing\"\n\nfunc TestPositive(t *testing.T) {\n\tt.Parallel()\n\tif !Positive(1) {\n\t\tt.Fatal(\"positive\")\n\t}\n}\n\nfunc TestNegative(t *testing.T) {\n\tt.Parallel()\n\tif !Negative(-1) {\n\t\tt.Fatal(\"negative\")\n\t}\n}\n",
    );

    let base = DirectGoRunRequest {
        root: root.clone(),
        command: vec![go.display().to_string(), "test".into(), "./...".into()],
        run_id: "run-go-as-written".into(),
        started_at: "2026-01-01T00:00:00.000Z".into(),
        exact_attribution: false,
    };

    // As written: the suite keeps its parallelism and neither test is credited.
    let mut diagnostics = Vec::new();
    let as_written = run_direct_go(&base, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    assert_eq!(as_written.tests, 2);
    assert_eq!(as_written.unattributed, 2);
    let printed = String::from_utf8_lossy(&diagnostics);
    assert!(!printed.contains("-parallel=1"), "{printed}");

    // Asked for: run in order, and each test carries its own coverage.
    let request = DirectGoRunRequest {
        run_id: "run-go-exact".into(),
        exact_attribution: true,
        ..base
    };
    let mut diagnostics = Vec::new();
    let exact = run_direct_go(&request, &mut diagnostics).unwrap_or_else(|error| {
        panic!(
            "{error}\n--- diagnostics ---\n{}",
            String::from_utf8_lossy(&diagnostics)
        )
    });
    let printed = String::from_utf8_lossy(&diagnostics);
    assert!(printed.contains("-parallel=1"), "{printed}");
    assert_eq!(exact.tests, 2);
    assert_eq!(
        exact.unattributed, 0,
        "running them alone is what makes them attributable: {printed}"
    );

    let records = supercov_engine::evidence_archive::read_archive(
        &exact.run_directory.join("evidence.raw.gz"),
    )
    .expect("published archive")
    .into_iter()
    .filter(|entry| entry.path.ends_with("mcdc.json"))
    .map(|entry| String::from_utf8(entry.contents).expect("utf-8"))
    .collect::<Vec<_>>();
    for name in ["TestPositive", "TestNegative"] {
        let record = records
            .iter()
            .find(|record| record.contains(&format!("\"test\":\"{name}\"")))
            .unwrap_or_else(|| panic!("{name} is in the run: {records:?}"));
        assert!(record.contains("\"attribution\":\"exact\""), "{record}");
        assert!(
            record.contains("go:statement:"),
            "{name} is credited with what it reached:\n{record}"
        );
    }
    std::fs::remove_dir_all(root).ok();
}
