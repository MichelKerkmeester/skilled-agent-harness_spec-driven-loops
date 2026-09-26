//! Binding Go's test functions to the evidence they produce.
//!
//! Attribution needs two things the source does not have: every test function
//! announcing itself, and somewhere to write the evidence once the package has
//! finished. Go gives exactly one after-all hook, `TestMain`, so this augments
//! the package's own when it has one and synthesises it when it does not.
//!
//! The wrapping is deliberate rather than a deferred call. The idiomatic
//! `TestMain` ends in `os.Exit(m.Run())`, and `os.Exit` runs no deferred
//! function, so a `defer` there would silently produce no evidence for exactly
//! the projects that wrote the most careful harness.

use tree_sitter::Node;

use crate::go_instrumenter::{GoEdit, GoInstrumenterError, RUNTIME_IMPORT, import_edit, parse};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GoTestFile {
    /// Test functions this file declares, in source order.
    pub tests: Vec<String>,
    /// Functions `go test` runs that get a checkpoint rather than an
    /// announcement, because nothing they reach can be credited to them: a
    /// test that calls `t.Parallel()`, whose work runs alongside other tests;
    /// and an Example or Fuzz target, which takes no `*testing.T` to be named
    /// by. What they reach is swept into the run-wide totals all the same.
    pub unattributed: Vec<String>,
    /// True when this file declares `TestMain`, which the package may only
    /// have one of.
    pub declares_test_main: bool,
    pub edits: Vec<GoEdit>,
}

fn function_name(node: Node, source: &str) -> Option<String> {
    node.child_by_field_name("name")
        .map(|name| source[name.byte_range()].to_owned())
}

/// Go's own rule for what the toolchain will run as a test, from
/// `cmd/go/internal/load/test.go`: the prefix, then either nothing or a rune
/// that is not lowercase.
///
/// So a bare `Test` is a test, and `Testify` is not — the `i` makes it an
/// ordinary function that merely starts with the word. Guessing differently
/// from the toolchain would attribute evidence to something `go test` never
/// runs, or miss a test that it does.
fn is_test_function(name: &str) -> bool {
    name.strip_prefix("Test")
        .is_some_and(|rest| rest.chars().next().is_none_or(|c| !c.is_lowercase()))
}

/// `go test` runs more than `TestX`. An `ExampleX` with an "Output:" comment
/// runs like any other test, and a `FuzzX` runs its seed corpus. Neither takes
/// a `*testing.T`, so neither can be announced -- but both reach product code,
/// and where the end-of-run write is never made, everything they reach has to
/// be swept before they return or it is never recorded at all.
///
/// samber/lo has three and a half thousand lines of examples and a TestMain
/// that ends in goleak's VerifyTestMain, which exits the process itself. Its
/// example coverage survived or did not according to which test happened to
/// checkpoint last, and the run reported anywhere between 74% and 95% of the
/// same suite.
fn is_checkpoint_only_function(name: &str, node: Node, source: &str) -> bool {
    let after = |prefix: &str| {
        name.strip_prefix(prefix)
            .is_some_and(|rest| rest.chars().next().is_none_or(|c| !c.is_lowercase()))
    };
    if after("Example") {
        // An example takes nothing and returns nothing; anything else that
        // starts with the word is an ordinary function.
        return first_parameter(node).is_none();
    }
    after("Fuzz") && parameter_type(node, source).as_deref() == Some("*testing.F")
}

fn first_parameter<'t>(node: Node<'t>) -> Option<Node<'t>> {
    let parameters = node.child_by_field_name("parameters")?;
    let mut cursor = parameters.walk();
    parameters
        .children(&mut cursor)
        .find(|child| child.kind() == "parameter_declaration")
}

fn parameter_type(node: Node, source: &str) -> Option<String> {
    let kind = first_parameter(node)?.child_by_field_name("type")?;
    Some(source[kind.byte_range()].trim().to_owned())
}

/// What the test calls its `*testing.T`, which the announcement needs in order
/// to read the outcome from it. Almost always `t`, but nothing requires that,
/// and a harness that assumed it would fail to compile on the files that
/// chose otherwise.
fn parameter_name(node: Node, source: &str) -> Option<String> {
    let name = first_parameter(node)?.child_by_field_name("name")?;
    let text = source[name.byte_range()].trim();
    // `func TestX(*testing.T)` is legal and names nothing there is to read.
    (text != "_" && !text.is_empty()).then(|| text.to_owned())
}

/// Instrument one `_test.go` file so every test announces itself.
///
/// `serialised` says the run was asked for exact attribution and the command
/// carries `-parallel=1`, so a test that calls `t.Parallel()` is the only test
/// running while its probes fire. It can then be announced like any other, and
/// the run credits it with what it reached. Without that, announcing it would
/// bind whatever ran beside it to its name.
pub fn instrument_test_file(
    source: &str,
    alias: &str,
    evidence_path: &str,
    serialised: bool,
) -> Result<GoTestFile, GoInstrumenterError> {
    let tree = parse(source)?;
    let mut file = GoTestFile {
        tests: Vec::new(),
        unattributed: Vec::new(),
        declares_test_main: false,
        edits: Vec::new(),
    };
    let root = tree.root_node();
    // Only the edits that name the runtime directly need its import. The
    // per-test announcement goes through a package-local helper instead, so a
    // file of ordinary tests must not gain an import it never mentions.
    let mut needs_runtime = false;
    let mut cursor = root.walk();
    for child in root.children(&mut cursor) {
        if child.kind() != "function_declaration" {
            continue;
        }
        let Some(name) = function_name(child, source) else {
            continue;
        };
        let Some(body) = child.child_by_field_name("body") else {
            continue;
        };
        if name == "TestMain" {
            file.declares_test_main = true;
            needs_runtime = true;
            // Whether there will be an end-of-run write decides how eagerly
            // the runtime has to persist, so the wrapping is decided first and
            // the destination written with the answer.
            let mut wrapping = Vec::new();
            let wrapped = wrap_run_calls(body, source, alias, evidence_path, &mut wrapping);
            file.edits.push(GoEdit {
                at: body.start_byte() + 1,
                rank: 100,
                text: format!(
                    "\n\t{alias}.Arm(__supercovProbeCount, __supercovDecisionWidths)\n\t{alias}.Destination(\"{evidence_path}\", {})\n",
                    !wrapped
                ),
            });
            file.edits.extend(wrapping);
            continue;
        }
        if !is_test_function(&name) {
            if is_checkpoint_only_function(&name, child, source) {
                file.unattributed.push(name.clone());
                // A Fuzz target takes a *testing.F, which reports an outcome
                // the same way a *testing.T does. An Example takes nothing at
                // all, so the only honest status for it is that it ran: `go
                // test` fails the run when an Example's output does not match,
                // and the run's own exit code carries that.
                let record = match parameter_name(child, source) {
                    Some(parameter)
                        if parameter_type(child, source).as_deref() == Some("*testing.F") =>
                    {
                        format!(
                            "\n\tdefer {HARNESS_UNATTRIBUTED_FUZZ}({parameter}, \"{name}\")()\n"
                        )
                    }
                    _ => format!(
                        "\n\tdefer func() {{ {alias}.Ran(\"{name}\", \"unknown\"); {alias}.Checkpoint() }}()\n"
                    ),
                };
                // Only a file that names the runtime needs its import, and
                // the Fuzz form names nothing but the generated helper: an
                // import it never mentions does not fail to measure, it fails
                // to compile, and Supercov breaks the suite it was measuring.
                needs_runtime |= record.contains(&format!("{alias}."));
                file.edits.push(GoEdit {
                    at: body.start_byte() + 1,
                    rank: 100,
                    text: record,
                });
            }
            continue;
        }
        // `func TestX(t *testing.T)` is a test; `func TestX(b *testing.B)` is
        // not, whatever its name suggests.
        if parameter_type(child, source).as_deref() != Some("*testing.T") {
            continue;
        }
        file.tests.push(name.clone());
        // Serialised, and the test pauses itself: the announcement waits until
        // `t.Parallel()` has returned, which is when this test is the one
        // running.
        let announce_at = if serialised && calls_parallel(body, source) {
            own_parallel_call_end(body, source).unwrap_or(body.start_byte() + 1)
        } else {
            body.start_byte() + 1
        };
        if calls_parallel(body, source) && !serialised {
            // Announcing it would bind whatever runs next to this test, and
            // what runs next includes the other parallel tests. Its coverage
            // still counts run-wide; it simply belongs to no test, which is
            // the truth rather than a guess dressed as a measurement.
            //
            // It still gets a checkpoint. Go resumes parallel tests after the
            // serial ones are done, so without one there is no announcement
            // left to sweep at and everything the parallel phase reached sits
            // in the probe array until the process ends -- which, where the
            // end-of-run write is never reached, means it is never recorded.
            file.unattributed.push(name.clone());
            // Named, with its real outcome, and credited with nothing. Leaving
            // it out of the evidence entirely was what made a suite of
            // parallel tests publish zero tests: `runs <id> test <name>`
            // answered "Test not found" for a test that had just passed, and
            // affected-test selection returned an empty set for a change those
            // tests exercised.
            let record = match parameter_name(child, source) {
                Some(parameter) => {
                    format!("\n\tdefer {HARNESS_UNATTRIBUTED}({parameter}, \"{name}\")()\n")
                }
                // `func TestX(*testing.T)` names nothing to read an outcome
                // from, and is reported as having passed unless the run says
                // otherwise -- the same rule the announced path uses.
                None => format!(
                    "\n\tdefer func() {{ {alias}.Ran(\"{name}\", \"passed\"); {alias}.Checkpoint() }}()\n"
                ),
            };
            needs_runtime |= record.contains(&format!("{alias}."));
            file.edits.push(GoEdit {
                at: body.start_byte() + 1,
                rank: 100,
                text: record,
            });
            continue;
        }
        // Through the generated helper rather than the runtime directly, so
        // the announcement can read the outcome off the test's own *testing.T
        // without the runtime ever importing `testing`.
        // The trailing newline matters: a body written on one line puts its
        // first statement immediately after the brace, and an announcement
        // with nothing after it would run into that statement and not compile.
        let announcement = match parameter_name(child, source) {
            Some(parameter) => {
                format!("\n\tdefer {HARNESS_ENTER}({parameter}, \"{name}\")()\n")
            }
            None => format!("\n\tdefer {alias}.EnterTest(\"{name}\")()\n"),
        };
        if announcement.contains(&format!("{alias}.")) {
            needs_runtime = true;
        }
        file.edits.push(GoEdit {
            at: announce_at,
            rank: 100,
            text: announcement,
        });
    }
    // A file that names the runtime needs the import that makes it resolve;
    // one that only calls the generated helper must not get an unused import.
    if needs_runtime && let Some(import) = import_edit(source, alias, RUNTIME_IMPORT) {
        file.edits.push(import);
    }
    Ok(file)
}

/// Where a test's own `t.Parallel()` call ends, if it makes one directly.
///
/// `t.Parallel()` does not return until the serial phase is over and this test
/// is the one being run, so a statement after it runs with the test actually
/// running. That is the only place an announcement can go when the run is
/// serialised: at the top of the body it would fire while every other parallel
/// test was also entering and pausing, all of them open at once, and the
/// runtime would rightly give up on attributing any of them.
///
/// Only a call the test makes itself counts. `t.Parallel()` inside a subtest
/// closure pauses the subtest, not this function, so there is nothing to wait
/// for here.
fn own_parallel_call_end(body: Node, source: &str) -> Option<usize> {
    // A block holds its statements in a `statement_list`, not directly, so the
    // statements are one level further down than a block's own children.
    let statements = {
        let mut cursor = body.walk();
        body.children(&mut cursor)
            .find(|child| child.kind() == "statement_list")
            .unwrap_or(body)
    };
    let mut cursor = statements.walk();
    for statement in statements.children(&mut cursor).filter(Node::is_named) {
        // The grammar wraps a call standing alone as a statement in an
        // `expression_statement`; it is never a statement's child on its own.
        let call = match statement.kind() {
            "expression_statement" => match statement.named_child(0) {
                Some(inner) if inner.kind() == "call_expression" => inner,
                // Some other expression standing alone -- a channel receive,
                // say -- which is not the call being looked for; the next
                // statement might be.
                _ => continue,
            },
            _ => continue,
        };
        if call
            .child_by_field_name("function")
            .is_some_and(|function| {
                source[function.byte_range()]
                    .trim_end()
                    .ends_with(".Parallel")
            })
        {
            return Some(statement.end_byte());
        }
    }
    None
}

/// Whether a test hands itself to Go's parallel scheduler.
///
/// Detected from the source rather than at runtime, because by the time
/// `t.Parallel()` returns the test has already been descheduled and anything
/// observed afterwards may belong to another one.
fn calls_parallel(node: Node, source: &str) -> bool {
    if node.kind() == "call_expression"
        && let Some(function) = node.child_by_field_name("function")
        && source[function.byte_range()]
            .trim_end()
            .ends_with(".Parallel")
    {
        return true;
    }
    let mut cursor = node.walk();
    node.children(&mut cursor)
        .filter(Node::is_named)
        .any(|child| calls_parallel(child, source))
}

fn wrap_run_calls(
    node: Node,
    source: &str,
    alias: &str,
    evidence: &str,
    edits: &mut Vec<GoEdit>,
) -> bool {
    if node.kind() == "call_expression"
        && let Some(function) = node.child_by_field_name("function")
        && source[function.byte_range()].trim_end().ends_with(".Run")
    {
        edits.push(GoEdit {
            at: node.start_byte(),
            rank: 50,
            text: format!("{alias}.Finish("),
        });
        edits.push(GoEdit {
            at: node.end_byte(),
            rank: 50,
            text: format!(", \"{evidence}\")"),
        });
        return true;
    }
    let mut cursor = node.walk();
    let mut wrapped = false;
    for child in node.children(&mut cursor) {
        if child.is_named() {
            wrapped |= wrap_run_calls(child, source, alias, evidence, edits);
        }
    }
    wrapped
}

/// The generated file that gives a package the array its probes store into.
///
/// A normal source file, not a test one: instrumented statements live in
/// ordinary code and must compile in every build of the package, not only
/// under `go test`.
pub fn probe_array_file(package: &str, alias: &str, import: &str, probe_count: usize) -> String {
    format!(
        "// Code generated by Supercov. DO NOT EDIT.\n\npackage {package}\n\nimport {alias} \"{import}\"\n\n// Reserved once per package and shared across the module, so a probe is an\n// index into an array this file already holds rather than a call that has to\n// find one.\nvar {} = {alias}.Reserve({probe_count})\n",
        crate::go_instrumenter::HITS_VARIABLE
    )
}

/// The package-local function every instrumented test defers to.
pub const HARNESS_ENTER: &str = "__supercovTest";

/// The package-local function a test that cannot be attributed defers to.
pub const HARNESS_UNATTRIBUTED: &str = "__supercovUnattributed";

/// The same for a Fuzz target, which reports its outcome through a
/// `*testing.F` rather than a `*testing.T`.
pub const HARNESS_UNATTRIBUTED_FUZZ: &str = "__supercovUnattributedFuzz";

/// The generated `TestMain` for a package that has none, plus the probe count
/// every instrumented file in the package refers to.
pub fn synthesized_harness(
    package: &str,
    alias: &str,
    import: &str,
    probe_count: usize,
    decision_widths: &[u8],
    evidence_path: &str,
    declares_test_main: bool,
) -> String {
    let mut out =
        format!("// Code generated by Supercov. DO NOT EDIT.\n\npackage {package}\n\nimport (\n");
    // Always, because the announcement helper below takes a *testing.T. This
    // file is a `_test.go`, so importing `testing` here reaches only the test
    // binary and never a build of the product.
    out.push_str("\t\"testing\"\n\n");
    out.push_str(&format!("\t{alias} \"{import}\"\n)\n\n"));
    // The runtime sizes each decision's vector from this, so a width the
    // harness got wrong would record vectors of the wrong shape.
    let widths = decision_widths
        .iter()
        .map(u8::to_string)
        .collect::<Vec<_>>()
        .join(", ");
    out.push_str(&format!(
        "const __supercovProbeCount = {probe_count}\n\nvar __supercovDecisionWidths = []uint8{{{widths}}}\n\n"
    ));
    // Binding and outcome in one place, so the edit inside the author's test
    // is a single deferred call. Reading *testing.T here rather than in the
    // runtime is what keeps `testing` out of every product binary that
    // imports the runtime.
    out.push_str(&format!(
        "func {HARNESS_ENTER}(t *testing.T, name string) func() {{\n\tdone := {alias}.EnterTest(name)\n\treturn func() {{\n\t\tif t.Skipped() {{\n\t\t\t{alias}.Outcome(\"skipped\")\n\t\t}} else if t.Failed() {{\n\t\t\t{alias}.Outcome(\"failed\")\n\t\t}}\n\t\tdone()\n\t}}\n}}\n\n"
    ));
    // Named and credited with nothing. The outcome is read here for the same
    // reason the announced path reads it here: so the runtime never imports
    // `testing` and never reaches a product binary.
    out.push_str(&format!(
        "func {HARNESS_UNATTRIBUTED}(t *testing.T, name string) func() {{\n\treturn func() {{\n\t\tstatus := \"passed\"\n\t\tif t.Skipped() {{\n\t\t\tstatus = \"skipped\"\n\t\t}} else if t.Failed() {{\n\t\t\tstatus = \"failed\"\n\t\t}}\n\t\t{alias}.Ran(name, status)\n\t\t{alias}.Checkpoint()\n\t}}\n}}\n\n"
    ));
    out.push_str(&format!(
        "func {HARNESS_UNATTRIBUTED_FUZZ}(f *testing.F, name string) func() {{\n\treturn func() {{\n\t\tstatus := \"passed\"\n\t\tif f.Skipped() {{\n\t\t\tstatus = \"skipped\"\n\t\t}} else if f.Failed() {{\n\t\t\tstatus = \"failed\"\n\t\t}}\n\t\t{alias}.Ran(name, status)\n\t\t{alias}.Checkpoint()\n\t}}\n}}\n\n"
    ));
    if declares_test_main {
        // The author's TestMain arms the runtime; this keeps the widths
        // referenced even in a package where nothing else names them.
        out.push_str("var _ = __supercovDecisionWidths\n");
        return out;
    }
    out.push_str(&format!(
        "func TestMain(m *testing.M) {{\n\t{alias}.Arm(__supercovProbeCount, __supercovDecisionWidths)\n\t{alias}.Destination(\"{evidence_path}\", false)\n\tos.Exit({alias}.Finish(m.Run(), \"{evidence_path}\"))\n}}\n"
    ));
    out.replace("\t\"testing\"\n", "\t\"os\"\n\t\"testing\"\n")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::go_instrumenter::rewrite;

    fn instrumented(source: &str) -> (GoTestFile, String) {
        let file =
            instrument_test_file(source, "__supercov", "evidence.bin", false).expect("instrument");
        let out = rewrite(source, &file.edits);
        parse(&out).unwrap_or_else(|error| panic!("{error}\n{out}"));
        (file, out)
    }

    #[test]
    fn go_s_own_rule_decides_what_counts_as_a_test() {
        // `Test` followed by a non-lowercase rune, taking *testing.T. A
        // benchmark named like a test is not one, and neither is a helper.
        let (file, _) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc Test(t *testing.T) {}\nfunc TestOne(t *testing.T) {}\nfunc Testify(t *testing.T) {}\nfunc TestBench(b *testing.B) {}\nfunc helper(t *testing.T) {}\n",
        );
        // Bare `Test` counts; `Testify` does not, because the rune after the
        // prefix is lowercase. This is the toolchain's rule, not a guess at it.
        assert_eq!(file.tests, ["Test", "TestOne"]);
    }

    #[test]
    fn an_existing_test_main_is_wrapped_rather_than_deferred_into() {
        // `os.Exit(m.Run())` runs no deferred function, so a defer here would
        // produce no evidence for exactly the projects with the most careful
        // harness. The run call is wrapped instead.
        let (file, out) = instrumented(
            "package p\n\nimport (\n\t\"os\"\n\t\"testing\"\n)\n\nfunc TestMain(m *testing.M) {\n\tos.Exit(m.Run())\n}\n",
        );
        assert!(file.declares_test_main);
        assert!(
            out.contains("__supercov.Finish(m.Run(), \"evidence.bin\")"),
            "{out}"
        );
        assert!(
            out.contains("__supercov.Arm(__supercovProbeCount, __supercovDecisionWidths)"),
            "{out}"
        );
        assert!(
            !out.contains("defer __supercov.Write"),
            "a defer would never run:\n{out}"
        );
    }

    #[test]
    fn a_package_without_test_main_gets_one_and_never_two() {
        // Go allows a package exactly one TestMain, so the generated file must
        // declare it only when the package has none.
        let generated = synthesized_harness(
            "p",
            "__supercov",
            "example.com/rt",
            42,
            &[2, 3],
            "e.bin",
            false,
        );
        assert!(
            generated.contains("[]uint8{2, 3}"),
            "the runtime sizes its vectors from this:\n{generated}"
        );
        assert!(
            generated.contains("func TestMain(m *testing.M)"),
            "{generated}"
        );
        assert!(generated.contains("const __supercovProbeCount = 42"));
        assert!(
            generated.contains("os.Exit"),
            "the generated harness preserves the exit code"
        );

        let alongside =
            synthesized_harness("p", "__supercov", "example.com/rt", 42, &[], "e.bin", true);
        assert!(!alongside.contains("func TestMain"), "{alongside}");
        assert!(
            alongside.contains("func __supercovTest(t *testing.T"),
            "every package gets the announcement helper, TestMain or not:\n{alongside}"
        );
    }

    #[test]
    fn a_serialised_parallel_test_is_announced_after_it_resumes() {
        // `t.Parallel()` does not return until the serial phase is over, so an
        // announcement above it fires while every other parallel test is also
        // entering and pausing. All of them would be open at once and the
        // runtime would give up attributing any of them -- which is how asking
        // for exact attribution produced a run with no tests in it at all.
        let file = instrument_test_file(
            "package p\n\nimport \"testing\"\n\nfunc TestParallel(t *testing.T) {\n\tt.Parallel()\n\tdoWork()\n}\n",
            "__supercov",
            "evidence.bin",
            true,
        )
        .expect("instrument");
        let out = rewrite(
            "package p\n\nimport \"testing\"\n\nfunc TestParallel(t *testing.T) {\n\tt.Parallel()\n\tdoWork()\n}\n",
            &file.edits,
        );
        parse(&out).unwrap_or_else(|error| panic!("{error}\n{out}"));
        assert!(file.unattributed.is_empty(), "{file:?}");
        let parallel = out.find("t.Parallel()").expect("the call");
        let announced = out
            .find("__supercovTest(t, \"TestParallel\")")
            .expect("announced");
        assert!(
            parallel < announced,
            "the announcement has to wait for the test to resume:\n{out}"
        );
    }

    #[test]
    fn a_serialised_run_leaves_a_serial_test_where_it_was() {
        // `serialised` only moves the announcement for a test that pauses
        // itself. A serial test in the same run has no `t.Parallel()` to wait
        // for, and putting its announcement anywhere but the top of the body
        // would leave whatever ran first uncredited.
        //
        // Measured rather than guessed: the decision that reads `serialised &&
        // calls_parallel(..)` had no witness for the second operand until this
        // existed, so nothing showed the two apart.
        let source =
            "package p\n\nimport \"testing\"\n\nfunc TestSerial(t *testing.T) {\n\tdoWork()\n}\n";
        let file =
            instrument_test_file(source, "__supercov", "evidence.bin", true).expect("instrument");
        let out = rewrite(source, &file.edits);
        parse(&out).unwrap_or_else(|error| panic!("{error}\n{out}"));
        assert!(file.unattributed.is_empty(), "{file:?}");
        let announced = out
            .find("__supercovTest(t, \"TestSerial\")")
            .expect("announced");
        let work = out.find("doWork()").expect("body");
        assert!(
            announced < work,
            "a serial test is announced before anything it calls:\n{out}"
        );
    }

    #[test]
    fn a_test_file_is_read_past_whatever_else_it_declares() {
        // A `_test.go` holds more than functions -- fixtures, tables, helper
        // types -- and the scan has to walk past all of it rather than stop.
        let (file, out) = instrumented(concat!(
            "package p\n\nimport \"testing\"\n\n",
            "type fixture struct{ n int }\n\n",
            "var cases = []fixture{{1}, {2}}\n\n",
            "const limit = 3\n\n",
            "func TestOne(t *testing.T) {\n\tdoWork()\n}\n",
        ));
        assert_eq!(file.tests, ["TestOne"]);
        assert!(out.contains("__supercovTest(t, \"TestOne\")"), "{out}");
    }

    #[test]
    fn a_parallel_call_is_found_wherever_the_test_makes_it() {
        // `t.Parallel()` first is the shape every other test here uses, and it
        // is not the shape most suites are written in: a test sets something
        // up and then hands itself to the scheduler. The scan has to walk past
        // whatever came before, which is a path nothing exercised -- the
        // measurement showed the statement loop only ever matching on its
        // first look.
        let source = concat!(
            "package p\n\nimport \"testing\"\n\n",
            "func TestLater(t *testing.T) {\n",
            "\tsetUp()\n",
            "\tname := \"x\"\n",
            "\t<-ready\n",
            "\tt.Parallel()\n",
            "\tdoWork(name)\n}\n",
        );
        let file =
            instrument_test_file(source, "__supercov", "evidence.bin", true).expect("instrument");
        let out = rewrite(source, &file.edits);
        parse(&out).unwrap_or_else(|error| panic!("{error}\n{out}"));
        assert!(file.unattributed.is_empty(), "{file:?}");
        let parallel = out.find("t.Parallel()").expect("the call");
        let announced = out
            .find("__supercovTest(t, \"TestLater\")")
            .expect("announced");
        assert!(
            parallel < announced,
            "the announcement still waits for the call, wherever it is:\n{out}"
        );
        // And it waits for that call rather than landing after the setup it
        // happened to follow.
        let work = out.find("doWork(name)").expect("body");
        assert!(announced < work, "{out}");
    }

    #[test]
    fn a_function_with_no_body_is_walked_past() {
        // Go declares a function with no body when the implementation is in
        // assembly. It is not a test, it has nothing to instrument, and the
        // scan has to keep going rather than reach for a body that is not
        // there.
        let (file, out) = instrumented(concat!(
            "package p\n\nimport \"testing\"\n\n",
            "func fastSum(a, b int) int\n\n",
            "func TestOne(t *testing.T) {\n\tdoWork()\n}\n",
        ));
        assert_eq!(file.tests, ["TestOne"]);
        assert!(out.contains("__supercovTest(t, \"TestOne\")"), "{out}");
    }

    #[test]
    fn a_test_file_with_nothing_in_it_is_read_without_complaint() {
        // The loop over a file's declarations has to survive having none.
        let file = instrument_test_file("package p\n", "__supercov", "evidence.bin", false)
            .expect("instrument");
        assert!(file.tests.is_empty());
        assert!(file.edits.is_empty(), "{file:?}");
        assert!(!file.declares_test_main);
    }

    #[test]
    fn a_parallel_test_is_named_rather_than_attributed_by_guesswork() {
        // Go runs these alongside each other. Binding probes to whichever was
        // most recently announced would produce per-test numbers that look
        // exact and are not; the coverage still counts run-wide.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestSerial(t *testing.T) {\n\tdoWork()\n}\n\nfunc TestParallel(t *testing.T) {\n\tt.Parallel()\n\tdoWork()\n}\n",
        );
        assert_eq!(file.tests, ["TestSerial", "TestParallel"]);
        assert_eq!(file.unattributed, ["TestParallel"]);
        assert!(out.contains("__supercovTest(t, \"TestSerial\")"), "{out}");
        // It is named, and it claims nothing. Those are different edits: the
        // announcement binds whatever runs next to the test, and what runs
        // next includes the other parallel tests. This one records that the
        // test ran and how it ended, and credits it with no coverage at all.
        //
        // Leaving the name out entirely was the other extreme, and it read
        // downstream as a test that never ran: a package of nothing but
        // parallel tests published zero tests, so asking for one by name
        // answered "Test not found" for a test that had just passed.
        assert!(
            out.contains("__supercovUnattributed(t, \"TestParallel\")"),
            "{out}"
        );
        assert!(
            !out.contains("__supercovTest(t, \"TestParallel\")"),
            "a parallel test must not claim what ran beside it:\n{out}"
        );
    }

    #[test]
    fn a_file_that_names_only_the_generated_helper_gains_no_import() {
        // Go rejects an import nothing mentions, so an import added for a file
        // that reaches the runtime only through a package-local helper does
        // not fail to measure -- it fails to compile, and Supercov breaks the
        // suite it was asked to measure. A Fuzz target is exactly that shape.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc FuzzWork(f *testing.F) {\n\tf.Add(1)\n\tf.Fuzz(func(t *testing.T, n int) {\n\t\tdoWork(n)\n\t})\n}\n",
        );
        assert_eq!(file.unattributed, ["FuzzWork"]);
        assert!(
            out.contains("__supercovUnattributedFuzz(f, \"FuzzWork\")"),
            "{out}"
        );
        assert!(
            !out.contains(RUNTIME_IMPORT),
            "the file names only the generated helper:\n{out}"
        );

        // An Example has no receiver to read an outcome from, so it names the
        // runtime directly and does need the import.
        let (_, out) =
            instrumented("package p\n\nfunc ExampleWork() {\n\tdoWork()\n\t// Output: 1\n}\n");
        assert!(out.contains("__supercov.Ran(\"ExampleWork\""), "{out}");
        assert!(out.contains(RUNTIME_IMPORT), "{out}");
    }

    #[test]
    fn a_test_whose_subtests_run_in_parallel_cannot_claim_them_either() {
        // `t.Run(name, func(t *testing.T) { t.Parallel() })` is how a Go suite
        // usually reaches for parallelism, and it is the same problem one
        // level down: Go resumes the parallel subtests after the parent
        // returns, so what they reach arrives with no announcement standing
        // and cannot be credited to the parent that started them.
        //
        // The parent is therefore checkpointed rather than announced. It costs
        // the parent its own attribution -- the serial part of its body is
        // swept in with the rest -- which is the honest reading: nothing can
        // say which of the two it came from.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestGroup(t *testing.T) {\n\tsetUp()\n\tfor _, c := range cases {\n\t\tt.Run(c.name, func(t *testing.T) {\n\t\t\tt.Parallel()\n\t\t\tdoWork(c)\n\t\t})\n\t}\n}\n",
        );
        assert_eq!(file.tests, ["TestGroup"]);
        assert_eq!(file.unattributed, ["TestGroup"]);
        assert!(
            !out.contains("__supercovTest(t, \"TestGroup\")"),
            "a parent cannot claim what its parallel subtests reached:\n{out}"
        );
        assert!(
            out.contains("__supercovUnattributed(t, \"TestGroup\")"),
            "{out}"
        );

        // Where the subtests are serial there is nothing to run beside them,
        // and the parent is named for all of it as before.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestGroup(t *testing.T) {\n\tt.Run(\"one\", func(t *testing.T) {\n\t\tdoWork()\n\t})\n}\n",
        );
        assert!(file.unattributed.is_empty(), "{file:?}");
        assert!(out.contains("__supercovTest(t, \"TestGroup\")"), "{out}");
    }

    #[test]
    fn an_example_is_swept_even_though_it_cannot_be_announced() {
        // `go test` runs an Example with an Output comment like any other
        // test, and a Fuzz target runs its seed corpus, but neither takes a
        // *testing.T and neither can be attributed. What they reach still has
        // to be swept before they return: where TestMain never returns --
        // goleak's VerifyTestMain exits the process itself -- the only writes
        // are the ones made at a boundary, and anything reached after the last
        // one is never recorded. samber/lo has three and a half thousand lines
        // of examples, and reported between 74% and 95% of one unchanged suite
        // depending on which test finished last.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc ExampleWork() {\n\tdoWork()\n\t// Output: 1\n}\n\nfunc FuzzWork(f *testing.F) {\n\tdoWork()\n}\n\nfunc Examples(t *testing.T) {\n\tdoWork()\n}\n\nfunc ExampleHelper(x int) {\n\tdoWork()\n}\n",
        );
        // Both are swept before they return, and both are named for having
        // run. The Example sweeps inline because it has no receiver to read an
        // outcome from; the Fuzz target goes through the generated helper,
        // which sweeps in turn -- so counting the word here would count one.
        assert!(
            out.contains("Ran(\"ExampleWork\", \"unknown\"); __supercov.Checkpoint()"),
            "{out}"
        );
        let generated =
            synthesized_harness("p", "__supercov", "example.com/rt", 0, &[], "e.bin", true);
        assert!(
            generated.matches("__supercov.Checkpoint()").count() == 2,
            "both generated helpers sweep before returning:\n{generated}"
        );
        // A Fuzz target takes a *testing.F, which reports an outcome the same
        // way a *testing.T does, so its status is read rather than guessed.
        assert!(
            out.contains("__supercovUnattributedFuzz(f, \"FuzzWork\")"),
            "{out}"
        );
        assert!(
            file.unattributed.contains(&"ExampleWork".to_owned()),
            "{file:?}"
        );
        assert!(
            file.unattributed.contains(&"FuzzWork".to_owned()),
            "{file:?}"
        );
        // `Examples` is an ordinary function whose name starts with the word,
        // exactly as `Testify` is, and one taking arguments is not an example
        // `go test` will ever run.
        assert!(file.tests.is_empty(), "{file:?}");
        assert!(!out.contains("\"Examples\""), "{out}");
        assert!(!out.contains("\"ExampleHelper\""), "{out}");
    }

    #[test]
    fn the_announcement_uses_whatever_the_test_called_its_t() {
        // `t` is the convention, not a rule. A harness that assumed it would
        // fail to compile on the files that chose otherwise, and a file of
        // ordinary tests must not gain a runtime import it never names.
        let (_, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestOne(tt *testing.T) {\n\tdoWork()\n}\n",
        );
        assert!(out.contains("__supercovTest(tt, \"TestOne\")"), "{out}");
        assert!(
            !out.contains(RUNTIME_IMPORT),
            "an ordinary test file names only the generated helper:\n{out}"
        );
    }

    #[test]
    fn a_test_that_names_no_t_still_gets_bound() {
        // `func TestX(*testing.T)` is legal Go and there is nothing to read an
        // outcome from, so it announces itself directly and is reported as
        // having passed unless the run says otherwise.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestOne(*testing.T) {\n\tdoWork()\n}\n",
        );
        assert_eq!(file.tests, ["TestOne"]);
        assert!(out.contains("__supercov.EnterTest(\"TestOne\")"), "{out}");
        assert!(
            out.contains(RUNTIME_IMPORT),
            "naming the runtime directly requires its import:\n{out}"
        );
    }

    #[test]
    fn a_test_file_using_go_1_26_new_is_still_instrumented() {
        // A source file that could not be parsed was dropped and the run went
        // on; a test file that could not be parsed took the whole run down
        // with it, exit 1. Both came from the same construct, and neither is
        // the author's mistake -- `new` has taken a value since Go 1.26.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestOne(t *testing.T) {\n\twant := new(\"hello\")\n\tif *greet() != *want {\n\t\tt.Fatal(\"bad\")\n\t}\n}\n",
        );
        assert_eq!(file.tests, ["TestOne"]);
        assert!(out.contains("__supercovTest(t, \"TestOne\")"), "{out}");
        // And what is written back is the author's own file, not the stand-in
        // the parse read.
        assert!(out.contains("new(\"hello\")"), "{out}");
        assert!(!out.contains("nEw"), "{out}");
    }

    #[test]
    fn a_test_announces_itself_before_anything_it_calls() {
        let (_, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestOne(t *testing.T) {\n\tdoWork()\n}\n",
        );
        let body = out.find("TestOne").unwrap();
        let enter = out
            .find("__supercovTest(t, \"TestOne\")")
            .expect("announcement");
        let work = out.find("doWork()").unwrap();
        assert!(body < enter && enter < work, "{out}");
    }

    #[test]
    fn a_test_written_on_one_line_still_compiles() {
        // A body on one line puts its first statement immediately after the
        // brace. An announcement inserted there with nothing after it runs
        // straight into that statement, and the file stops being Go -- so
        // Supercov breaks the suite it was asked to measure.
        let (file, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestOne(t *testing.T) { if work() != 1 { t.Fatal(\"no\") } }\n",
        );
        assert_eq!(file.tests, ["TestOne"]);
        // `instrumented` parses the result, so reaching here is most of the
        // claim; this says the announcement is on a line of its own.
        assert!(out.contains("__supercovTest(t, \"TestOne\")()\n"), "{out}");

        // The same for a TestMain nobody spread over several lines.
        let (_, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestMain(m *testing.M) { os.Exit(m.Run()) }\n",
        );
        assert!(out.contains("__supercovDecisionWidths)\n"), "{out}");
    }

    #[test]
    fn a_test_main_that_never_calls_run_makes_the_runtime_persist_eagerly() {
        // The idiomatic TestMain ends in os.Exit(m.Run()), which the harness
        // wraps so everything is written at the end. A TestMain that hands `m`
        // to something else -- goleak's VerifyTestMain, testcontainers, a
        // hand-written harness -- runs the suite and exits itself, and Go can
        // run no code on os.Exit. Then the only evidence that survives is what
        // was already written, so every checkpoint has to persist rather than
        // wait out the window: samber/lo's parallel phase finishes inside one,
        // and with a window it recorded 36% of its statements where the same
        // run records 86% without.
        let (_, out) = instrumented(
            "package p\n\nimport \"testing\"\n\nfunc TestMain(m *testing.M) {\n\tgoleak.VerifyTestMain(m)\n}\n",
        );
        assert!(
            out.contains(".Destination(\"evidence.bin\", true)"),
            "{out}"
        );
        assert!(
            !out.contains(".Finish("),
            "there is no m.Run() here to wrap:\n{out}"
        );

        // Where the end-of-run write does happen, the window is safe and the
        // per-test write is not paid.
        let (_, out) = instrumented(
            "package p\n\nimport (\n\t\"os\"\n\t\"testing\"\n)\n\nfunc TestMain(m *testing.M) {\n\tos.Exit(m.Run())\n}\n",
        );
        assert!(
            out.contains(".Destination(\"evidence.bin\", false)"),
            "{out}"
        );
        assert!(out.contains(".Finish(m.Run()"), "{out}");
    }
}
