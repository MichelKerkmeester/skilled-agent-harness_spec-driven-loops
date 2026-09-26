//! How much of a map one edit invalidates, measured rather than argued about.
//!
//! B19 reported 410 of supergateway's 618 flows invalidated by edits that did
//! not touch the statements they anchor. That map is an accumulated review
//! backlog, so it cannot separate the causes. This builds a map of a known
//! shape and makes one edit at a time, so each cause is priced on its own --
//! and each price is pinned, so it cannot drift back up.
//!
//! The map: ten source files of twenty functions, one flow per function,
//! every flow applying to the same test, which the execution record says ran
//! every function but the last of each file. Nothing is watched: the watch
//! list is the author's explicit "tell me", and this measures what happens
//! without one.

use supercov_engine::assertion_map::*;

const FILES: usize = 10;
const FLOWS_PER_FILE: usize = 20;
/// The one function per file the test did not run.
const UNRUN: usize = FLOWS_PER_FILE - 1;

fn anchor_at(file: &str, text: &str, needle: &str) -> Anchor {
    let start = text.find(needle).unwrap();
    Anchor::new(file, text, start, start + needle.len())
}

/// A file of many independent functions, the shape real source has.
fn source(file: usize) -> String {
    let mut out = String::new();
    for n in 0..FLOWS_PER_FILE {
        out.push_str(&format!(
            "// what step {n} is for\nexport function step{file}_{n}(value) {{\n  return value + {n};\n}}\n\n"
        ));
    }
    out
}

fn build() -> (Inputs, AssertionMap, State) {
    let test = "import assert from 'node:assert/strict';\nassert.equal(result, 1);\n";
    let mut files = Files::from([("test.js".to_owned(), test.to_owned())]);
    for file in 0..FILES {
        files.insert(format!("src/m{file}.js"), source(file));
    }
    let inputs = Inputs {
        schema_version: 1,
        language: "javascript".into(),
        context_digest: "context".into(),
        files,
        assertions: vec![InventorySite {
            at: anchor_at("test.js", test, "assert.equal(result, 1)"),
            operation: "assert.equal".into(),
        }],
        limitations: vec![],
    };
    let (mut map, mut state) = seed(&inputs, "archive");
    let a = &mut map.assertions[0];
    a.observes = vec!["result equals one".into()];
    a.flows = (0..FILES)
        .flat_map(|file| (0..FLOWS_PER_FILE).map(move |n| (file, n)))
        .map(|(file, n)| {
            let path = format!("src/m{file}.js");
            let body = inputs.files[&path].clone();
            Flow {
                id: format!("f{file}_{n}"),
                basis: None,
                questions: vec![],
                explanation: format!("step {file}_{n} returns its input plus {n}"),
                applies_to: vec![TestSelector {
                    file: "test.js".into(),
                    name: "test".into(),
                }],
                nodes: vec![Node {
                    id: "return".into(),
                    at: anchor_at(&path, &body, &format!("return value + {n};")),
                    role: "value".into(),
                    meaning: String::new(),
                }],
                edges: vec![Edge {
                    from: "return".into(),
                    to: "$assertion".into(),
                    kind: "data".into(),
                    basis: String::new(),
                }],
                counts_as_asserted: vec!["return".into()],
                watch: vec![],
            }
        })
        .collect();
    // The execution record: the test ran every function but the last of each
    // file, and every function holds a probe.
    let manifest = inputs.manifest();
    let mut tests = Vec::new();
    let mut probed = std::collections::BTreeMap::new();
    let mut ran = std::collections::BTreeMap::new();
    for file in 0..FILES {
        let path = format!("src/m{file}.js");
        let code = manifest.files[&path].code.as_ref().expect("parsable");
        let index = |name: &str| code.units.iter().position(|u| u.path == name).unwrap();
        probed.insert(
            path.clone(),
            (0..FLOWS_PER_FILE)
                .map(|n| index(&format!("step{file}_{n}")))
                .collect::<Vec<_>>(),
        );
        ran.insert(
            path,
            (0..UNRUN)
                .map(|n| index(&format!("step{file}_{n}")))
                .collect::<Vec<_>>(),
        );
    }
    tests.push(Execution {
        test: TestSelector {
            file: "test.js".into(),
            name: "test".into(),
        },
        passed: true,
        files: ran.clone(),
        attribution: "exact".into(),
    });
    state.executions = Some(Executions {
        tests,
        covered: ran,
        probed,
    });
    (inputs, map, state)
}

/// Mark every flow reviewed, the way an author who has just read them would.
fn acknowledge(map: &mut AssertionMap, state: &State, inputs: &Inputs) {
    let snapshot = map.clone();
    let manifest = inputs.manifest();
    for a in &mut map.assertions {
        for f in &mut a.flows {
            let prior = snapshot
                .assertions
                .iter()
                .find(|other| other.id == a.id)
                .unwrap();
            f.basis = Some(expected_basis(prior, f, &snapshot, state, &manifest));
        }
    }
}

fn stale(map: &AssertionMap, state: &State, inputs: &Inputs) -> usize {
    let manifest = inputs.manifest();
    map.assertions
        .iter()
        .flat_map(|a| a.flows.iter().map(move |f| (a, f)))
        .filter(|(a, f)| !reasons_for_manifest(a, f, map, state, inputs, &manifest).is_empty())
        .count()
}

struct Outcome {
    stale: usize,
    notices: usize,
    changes: usize,
}

fn after(edit: impl FnOnce(&mut String)) -> Outcome {
    let (inputs, mut map, state) = build();
    acknowledge(&mut map, &state, &inputs);
    assert_eq!(stale(&map, &state, &inputs), 0, "everything reviewed first");
    let mut next = inputs.clone();
    edit(next.files.get_mut("src/m0.js").unwrap());
    let (carried, carried_state) =
        carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    Outcome {
        stale: stale(&carried, &carried_state, &next),
        notices: carried_state
            .flows
            .values()
            .filter(|s| !s.notices.is_empty())
            .count(),
        changes: carried_state.changes.len(),
    }
}

/// One edit to `src/m0.js`, and how many flows the rule says it costs.
type Priced = (&'static str, Box<dyn FnOnce(&mut String)>, usize);

fn edits() -> Vec<Priced> {
    vec![
        (
            "comment text only",
            Box::new(|s: &mut String| *s = s.replace("// what step 3 is for", "// rewritten note")),
            0,
        ),
        (
            "blank lines and trailing whitespace",
            Box::new(|s: &mut String| {
                *s = format!("\n\n{}", s.replace("{\n  return", "{  \n\n  return"))
            }),
            0,
        ),
        (
            "one statement, in a flow's own function",
            Box::new(|s: &mut String| *s = s.replace("return value + 3;", "return value + 3 + 0;")),
            1,
        ),
        (
            "one statement, in a function the test did not run",
            Box::new(|s: &mut String| {
                *s = s.replace(
                    &format!("return value + {UNRUN};"),
                    &format!("return value + {UNRUN} + 0;"),
                )
            }),
            // Its own flow claims it, so that one goes; the other nineteen
            // never saw the change.
            1,
        ),
        (
            "one function appended",
            Box::new(|s: &mut String| {
                s.push_str("\nexport function unrelated() {\n  return 0;\n}\n")
            }),
            // A new declaration can change what an existing call resolves to
            // (Ekstazi's override case), so every flow whose test ran code in
            // the file is read again. Deliberate.
            FLOWS_PER_FILE,
        ),
        (
            "a top-level constant added",
            Box::new(|s: &mut String| s.insert_str(0, "const shared = 1;\n")),
            // Top-level code is what every function in the file closes over.
            FLOWS_PER_FILE,
        ),
    ]
}

#[test]
#[ignore = "a measurement, not a pass/fail; run with --ignored"]
fn one_edit_is_priced_against_every_cause() {
    let total = FILES * FLOWS_PER_FILE;
    println!(
        "\n  map: {total} flows over {FILES} files, {FLOWS_PER_FILE} per file; the test ran all but one function per file\n"
    );
    println!(
        "  edit                                                stale  notices  changes to assess   floor"
    );
    for (name, edit, floor) in edits() {
        let outcome = after(edit);
        println!(
            "  {name:<50} {:>5}  {:>7}  {:>17}   {floor:>5}",
            outcome.stale, outcome.notices, outcome.changes
        );
    }
    println!();
}

/// Each price, held as a test: the floor is what the rule says, and every
/// edit lands exactly on it.
#[test]
fn every_edit_costs_exactly_what_the_rule_says() {
    for (name, edit, floor) in edits() {
        let outcome = after(edit);
        assert_eq!(outcome.stale, floor, "{name}: stale");
    }
}

#[test]
fn a_comment_invalidates_nothing_and_asks_nothing() {
    let outcome = after(|s| *s = s.replace("// what step 3 is for", "// rewritten note"));
    assert_eq!(outcome.stale, 0);
    assert_eq!(outcome.notices, 0, "nothing happened, so nothing to notice");
    assert_eq!(outcome.changes, 0, "and nothing to assess");
}

#[test]
fn a_body_edit_the_test_ran_is_a_review_for_its_flow_and_a_notice_for_its_neighbours() {
    let (inputs, mut map, state) = build();
    acknowledge(&mut map, &state, &inputs);
    let mut next = inputs.clone();
    *next.files.get_mut("src/m0.js").unwrap() =
        next.files["src/m0.js"].replace("return value + 3;", "return value + 3 + 0;");
    let (carried, carried_state) =
        carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(stale(&carried, &carried_state, &next), 1);
    // The other nineteen flows in the file are told, not asked. Flows in the
    // nine other files hear nothing on their own.
    assert_eq!(
        carried_state
            .flows
            .values()
            .filter(|s| !s.notices.is_empty())
            .count(),
        FLOWS_PER_FILE - 1
    );
    // The one test ran the changed function, so the change is assessed once,
    // and the record says who ran it: every flow, since they share the test.
    assert_eq!(carried_state.changes.len(), 1);
    let change = &carried_state.changes[0];
    assert_eq!(
        change.known_flows.len(),
        1,
        "only the flow that claims step 3 is stale"
    );
    assert_eq!(change.exposed.len(), FILES * FLOWS_PER_FILE);
}

#[test]
fn a_body_edit_the_test_did_not_run_reaches_only_the_flow_that_claims_it() {
    let outcome = after(|s| {
        *s = s.replace(
            &format!("return value + {UNRUN};"),
            &format!("return value + {UNRUN} + 0;"),
        )
    });
    assert_eq!(outcome.stale, 1);
    assert_eq!(outcome.notices, FLOWS_PER_FILE - 1);
    assert_eq!(outcome.changes, 0);
}

#[test]
fn a_new_declaration_is_read_by_everyone_who_ran_the_file_and_asked_about_once() {
    let outcome = after(|s| s.push_str("\nexport function unrelated() {\n  return 0;\n}\n"));
    assert_eq!(outcome.stale, FLOWS_PER_FILE, "the file's flows, no others");
    assert_eq!(
        outcome.changes, 1,
        "one change to assess for anyone the record cannot see"
    );
}

/// Without an execution record the prices are the same -- what a claim rests
/// on does not depend on what else the test ran. What the record buys is the
/// change record: without it, every flow is exposed to every change, and a
/// change nobody ran cannot be told from one everybody did.
#[test]
fn without_a_record_the_prices_hold_and_every_flow_is_exposed() {
    let (inputs, mut map, mut state) = build();
    state.executions = None;
    acknowledge(&mut map, &state, &inputs);
    let mut next = inputs.clone();
    *next.files.get_mut("src/m0.js").unwrap() = next.files["src/m0.js"].replace(
        &format!("return value + {UNRUN};"),
        &format!("return value + {UNRUN} + 0;"),
    );
    let (carried, carried_state) =
        carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(stale(&carried, &carried_state, &next), 1);
    assert_eq!(
        carried_state.changes.len(),
        1,
        "with the record this asks nothing"
    );
    assert_eq!(
        carried_state.changes[0].exposed.len(),
        FILES * FLOWS_PER_FILE
    );
    // A comment still costs nothing: no record is needed to know that.
    let mut next = inputs.clone();
    *next.files.get_mut("src/m0.js").unwrap() =
        next.files["src/m0.js"].replace("// what step 3 is for", "// rewritten note");
    let (carried, carried_state) =
        carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(stale(&carried, &carried_state, &next), 0);
    assert!(carried_state.changes.is_empty());
}

/// A change in a file no flow names, which the test ran: the old rule could
/// not see it at all. It does not make a claim stale -- no claim passes
/// through it -- but the record puts every flow whose test ran it on the one
/// change to assess, so the question is asked of the right people.
#[test]
fn a_changed_callee_in_an_unnamed_file_is_asked_of_everyone_who_ran_it() {
    let (mut inputs, mut map, mut state) = build();
    let helper = "export function helper(x) {\n  return x * 2;\n}\n";
    inputs.files.insert("src/helper.js".into(), helper.into());
    let manifest = inputs.manifest();
    let code = manifest.files["src/helper.js"].code.as_ref().unwrap();
    let index = code.units.iter().position(|u| u.path == "helper").unwrap();
    let executions = state.executions.as_mut().unwrap();
    executions.tests[0]
        .files
        .insert("src/helper.js".into(), vec![index]);
    executions
        .probed
        .insert("src/helper.js".into(), vec![index]);
    state.inputs_digest = inputs.identity();
    acknowledge(&mut map, &state, &inputs);
    assert_eq!(stale(&map, &state, &inputs), 0);
    let mut next = inputs.clone();
    next.files
        .insert("src/helper.js".into(), helper.replace("x * 2", "x * 3"));
    let (carried, carried_state) =
        carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(stale(&carried, &carried_state, &next), 0);
    assert_eq!(carried_state.changes.len(), 1);
    let change = &carried_state.changes[0];
    assert_eq!(change.file.as_deref(), Some("src/helper.js"));
    assert!(change.known_flows.is_empty());
    assert_eq!(
        change.exposed.len(),
        FILES * FLOWS_PER_FILE,
        "every flow's test ran the changed helper"
    );
    // Whereas a change to a function of the helper's file nobody ran asks
    // nothing of anyone.
    let mut next = inputs.clone();
    next.files.insert(
        "src/helper.js".into(),
        format!("{helper}export function spare(x) {{\n  return x;\n}}\n"),
    );
    let (_, broad_state) = carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(
        broad_state.changes.len(),
        1,
        "a new declaration is a change to the file's shape, asked of those who ran the file"
    );
}
