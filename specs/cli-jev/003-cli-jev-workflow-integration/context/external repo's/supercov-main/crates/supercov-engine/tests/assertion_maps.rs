use serde_json::json;
use std::collections::BTreeSet;
use supercov_engine::{
    assertion_map::*,
    assertion_store::{assess, assess_summary},
    coverage_report::*,
};

fn anchor(file: &str, text: &str, needle: &str) -> Anchor {
    let start = text.find(needle).unwrap();
    Anchor::new(file, text, start, start + needle.len())
}
fn fixture() -> (Inputs, AssertionMap, State) {
    let test = "import assert from 'node:assert/strict';\nassert.equal(result, 1);\n";
    let source = "return 1;\n";
    let at = anchor("test.js", test, "assert.equal(result, 1)");
    let inputs = Inputs {
        schema_version: 1,
        language: "javascript".into(),
        context_digest: "context".into(),
        files: Files::from([
            ("test.js".into(), test.into()),
            ("src/a.js".into(), source.into()),
            ("src/b.js".into(), source.into()),
            ("src/helper.js".into(), "helper();\n".into()),
        ]),
        assertions: vec![InventorySite {
            at,
            operation: "assert.equal".into(),
        }],
        limitations: vec![],
    };
    let (mut map, state) = seed(&inputs, "archive");
    let a = &mut map.assertions[0];
    a.observes = vec!["result equals one".into()];
    a.flows = ["a", "b"]
        .into_iter()
        .map(|id| Flow {
            id: id.into(),
            basis: None,
            questions: vec![],
            explanation: format!("Author judgement for {id}"),
            applies_to: vec![TestSelector {
                file: "test.js".into(),
                name: "test".into(),
            }],
            nodes: vec![Node {
                id: "return".into(),
                at: anchor(&format!("src/{id}.js"), source, "return 1;"),
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
            watch: vec![format!("src/{id}.js"), "test.js".into()],
        })
        .collect();
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    (inputs, map, state)
}
fn acknowledge(
    map: &mut AssertionMap,
    state: &State,
    inputs: &Inputs,
    selected: &BTreeSet<String>,
    all: bool,
    changes: bool,
) -> Result<(), String> {
    if state.inputs_digest != inputs.identity() {
        return Err("inputs changed".into());
    }
    if changes {
        for c in &state.changes {
            let mut response = ChangeAssessment {
                id: c.id.clone(),
                basis: None,
                affected_flows: c
                    .known_flows
                    .iter()
                    .filter(|key| {
                        map.assertions
                            .iter()
                            .any(|a| a.flows.iter().any(|f| flow_key(a, f) == **key))
                    })
                    .cloned()
                    .collect(),
                explanation: "Fixture agent inspected the change".into(),
            };
            response.basis = Some(expected_change_basis(c, &response, &inputs.manifest()));
            map.change_assessments.retain(|r| r.id != c.id);
            map.change_assessments.push(response);
        }
    }
    let snapshot = map.clone();
    for a in &mut map.assertions {
        let prior = snapshot.assertions.iter().find(|p| p.id == a.id).unwrap();
        for f in &mut a.flows {
            if all || selected.contains(&flow_key(prior, f)) {
                if !validate_flow(f, &inputs.files).is_empty()
                    || prior.at.offset(&inputs.files).is_none()
                {
                    return Err("invalid reference".into());
                }
                f.basis = Some(expected_basis(
                    prior,
                    f,
                    &snapshot,
                    state,
                    &inputs.manifest(),
                ));
            }
        }
    }
    Ok(())
}
fn current(map: &AssertionMap, state: &State, inputs: &Inputs) -> usize {
    map.assertions
        .iter()
        .flat_map(|a| a.flows.iter().map(move |f| (a, f)))
        .filter(|(a, f)| reasons(a, f, map, state, inputs).is_empty())
        .count()
}

#[test]
fn serialized_manifest_reuses_analysis_without_previous_source() {
    let (old, map, state) = fixture();
    let encoded = serde_json::to_vec(&old.manifest()).unwrap();
    let old_manifest: InputManifest = serde_json::from_slice(&encoded).unwrap();
    let mut new = old.clone();
    drop(old);
    new.files.insert("src/a.js".into(), "return 2;\n".into());
    let (next, state) = carry(&map, &state, &old_manifest, &new, "new", false).unwrap();
    assert_eq!(next.assertions[0].id, map.assertions[0].id);
    assert_eq!(next.assertions[0].flows, map.assertions[0].flows);
    assert_eq!(current(&next, &state, &new), 1);
    assert_eq!(state.changes.len(), 1);
    let report = assess(&next, &state, &new, &report_fixture(&["b"], true), true);
    assert_eq!(report["summary"]["statements"]["asserted"], 1);
}

#[test]
fn test_setup_changes_dirty_flows_even_without_an_explicit_test_watch() {
    let (old, mut map, state) = fixture();
    for flow in &mut map.assertions[0].flows {
        flow.watch.retain(|w| w != "test.js");
    }
    acknowledge(&mut map, &state, &old, &BTreeSet::new(), true, false).unwrap();
    let mut new = old.clone();
    new.files
        .get_mut("test.js")
        .unwrap()
        .push_str("setupChanged();\n");
    let (next, state) = carry(&map, &state, &old.manifest(), &new, "new", false).unwrap();
    assert_eq!(current(&next, &state, &new), 0);
    assert_eq!(next.assertions[0].flows, map.assertions[0].flows);
}

#[test]
fn changing_a_node_location_requires_review_even_when_its_text_is_identical() {
    let (mut inputs, mut map, mut state) = fixture();
    inputs
        .files
        .insert("src/a.js".into(), "return 1;\nreturn 1;\n".into());
    state.inputs_digest = inputs.identity();
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    map.assertions[0].flows[0].nodes[0].at.line = 2;
    assert!(validate(&map, &inputs).is_empty());
    let (next, state) = carry(&map, &state, &inputs.manifest(), &inputs, "new", false).unwrap();
    assert_eq!(current(&next, &state, &inputs), 1);
}

#[test]
fn input_archive_contains_hashes_and_requires_matching_current_files() {
    use supercov_engine::assertion_inputs::{append, capture, current_sources};
    let root = std::env::temp_dir().join(format!("supercov-manifest-{}", std::process::id()));
    std::fs::create_dir_all(&root).unwrap();
    let source = "// source-only-sentinel-not-an-assertion\nimport assert from 'node:assert/strict';\nassert.equal(1, 1);\n";
    std::fs::write(root.join("test.js"), source).unwrap();
    let inputs = capture(&root, "javascript", ["test.js".into()]).unwrap();
    let entries = append(vec![], &inputs).unwrap();
    let encoded = &entries[0].contents;
    assert!(!String::from_utf8_lossy(encoded).contains("source-only-sentinel"));
    let value: serde_json::Value = serde_json::from_slice(encoded).unwrap();
    assert_eq!(value["schemaVersion"], 2);
    assert_eq!(value["files"]["test.js"]["bytes"], source.len());
    assert!(value["files"]["test.js"]["sha256"].as_str().unwrap().len() == 64);
    let manifest: InputManifest = serde_json::from_slice(encoded).unwrap();
    assert_eq!(
        current_sources(&root, &manifest).unwrap().files,
        inputs.files
    );
    std::fs::write(root.join("test.js"), source.replace("1, 1", "2, 2")).unwrap();
    assert!(
        current_sources(&root, &manifest)
            .unwrap_err()
            .contains("Current source differs")
    );
    std::fs::remove_file(root.join("test.js")).unwrap();
    assert!(current_sources(&root, &manifest).is_err());
    std::fs::remove_dir_all(root).unwrap();
}

#[test]
fn unchanged_files_reuse_review_and_blank_line_moves_preserve_dirty_mappings() {
    let (old, map, state) = fixture();
    let (same, same_state) = carry(&map, &state, &old.manifest(), &old, "same", false).unwrap();
    assert_eq!(current(&same, &same_state, &old), 2);
    let mut new = old.clone();
    for text in new.files.values_mut() {
        *text = format!("\n\n{text}");
    }
    for site in &mut new.assertions {
        site.at.line += 2;
    }
    let (carried, state) = carry(&map, &state, &old.manifest(), &new, "new", false).unwrap();
    // src/a.js and src/b.js are not parsable JavaScript, so their bytes are
    // what the flows rest on, and two blank lines are a change to them.
    assert_eq!(current(&carried, &state, &new), 0);
    // src/helper.js is, and blank lines are not a change to anything it does:
    // nothing to assess.
    assert!(
        !state
            .changes
            .iter()
            .any(|c| c.file.as_deref() == Some("src/helper.js")),
        "{:?}",
        state.changes
    );
    assert!(
        state
            .changes
            .iter()
            .any(|c| c.file.as_deref() == Some("src/a.js"))
    );
    assert_eq!(map.assertions[0].id, carried.assertions[0].id);
    assert_eq!(carried.assertions[0].at.line, 4);
}
#[test]
fn changed_flow_stays_dirty_through_carries_and_partial_review() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files.insert("src/a.js".into(), "return 2;\n".into());
    let (mut map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&map, &state, &new), 1);
    let (next, state) = carry(&map, &state, &new.manifest(), &new, "three", false).unwrap();
    map = next;
    assert_eq!(current(&map, &state, &new), 1);
    // Acknowledging only the unaffected sibling never clears the dirty one.
    let selected = BTreeSet::from([flow_key(&map.assertions[0], &map.assertions[0].flows[1])]);
    acknowledge(&mut map, &state, &new, &selected, false, false).unwrap();
    assert_eq!(current(&map, &state, &new), 1);
    assert!(acknowledge(&mut map, &state, &new, &BTreeSet::new(), true, false).is_err());
    map.assertions[0].flows[0].nodes[0].at.text = "return 2;".into();
    acknowledge(&mut map, &state, &new, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &new), 2);
}

#[test]
fn changed_assertion_keeps_its_explanation_as_a_dirty_identity_suggestion() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .get_mut("test.js")
        .unwrap()
        .replace_range(.., &old.files["test.js"].replace("result, 1", "result, 2"));
    new.assertions[0].at.text = "assert.equal(result, 2)".into();
    let (next, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(next.assertions.len(), 1);
    assert_eq!(next.assertions[0].id, map.assertions[0].id);
    assert_eq!(
        next.assertions[0].flows[0].explanation,
        map.assertions[0].flows[0].explanation
    );
    assert_eq!(current(&next, &state, &new), 0);
}

#[test]
fn newly_declared_watch_missing_in_old_snapshot_does_not_panic_on_carry() {
    let (old, mut map, state) = fixture();
    let mut new = old.clone();
    map.assertions[0].flows[0].watch.push("new.js".into());
    new.files.insert("new.js".into(), "new();".into());
    let (next, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&next, &state, &new), 1);
}
#[test]
fn revert_does_not_implicitly_acknowledge_review() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files.insert("src/a.js".into(), "return 2;\n".into());
    let (map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    let (map, state) = carry(&map, &state, &new.manifest(), &old, "three", false).unwrap();
    assert_eq!(current(&map, &state, &old), 1);
}
#[test]
fn map_edits_require_acknowledgement_even_with_unchanged_sources() {
    let (inputs, mut map, state) = fixture();
    map.assertions[0].flows[0].explanation.push_str(" revised");
    assert_eq!(current(&map, &state, &inputs), 1);
    let (map, state) = carry(&map, &state, &inputs.manifest(), &inputs, "two", false).unwrap();
    assert_eq!(current(&map, &state, &inputs), 1);
}
#[test]
fn assertion_meaning_edit_invalidates_every_flow() {
    let (inputs, mut map, state) = fixture();
    map.assertions[0].observes.push("another property".into());
    assert_eq!(current(&map, &state, &inputs), 0);
}
#[test]
fn deleted_or_changed_assertions_keep_their_explanations() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.assertions.clear();
    new.files.insert("test.js".into(), String::new());
    let (next, _) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert!(next.assertions.is_empty());
    assert_eq!(next.retired_assertions[0].assertion, map.assertions[0]);
}
#[test]
fn new_assertions_are_unmapped_and_do_not_steal_old_ids() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .get_mut("test.js")
        .unwrap()
        .push_str("assert.equal(other, 2);\n");
    new.assertions.push(InventorySite {
        at: anchor("test.js", &new.files["test.js"], "assert.equal(other, 2)"),
        operation: "assert.equal".into(),
    });
    let (next, _) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(next.assertions.len(), 2);
    assert_eq!(next.assertions[0].id, map.assertions[0].id);
    assert!(next.assertions[1].flows.is_empty());
}
#[test]
fn ambiguous_duplicate_is_never_matched_by_distance() {
    let old = Files::from([("a.js".into(), "before(); x(); after();".into())]);
    let at = anchor("a.js", &old["a.js"], "x()");
    let new = Files::from([("a.js".into(), "changed(); x(); x(); after();".into())]);
    let hashes = old
        .iter()
        .map(|(p, s)| (p.clone(), FileFingerprint::of(s)))
        .collect();
    assert!(relocate(&at, &hashes, &new).is_none());
}
#[test]
fn unique_file_rename_rebases_and_ambiguous_rename_dirties() {
    let (mut old, mut map, state) = fixture();
    old.files
        .insert("src/a.js".into(), "return 1;\n// unique".into());
    let mut state = state;
    acknowledge(&mut map, &state, &old, &BTreeSet::new(), true, false).unwrap_err();
    state.inputs_digest = old.identity();
    acknowledge(&mut map, &state, &old, &BTreeSet::new(), true, false).unwrap();
    let mut new = old.clone();
    let source = new.files.remove("src/a.js").unwrap();
    new.files.insert("src/renamed.js".into(), source.clone());
    let (next, next_state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&next, &next_state, &new), 1);
    assert_eq!(next_state.changes.len(), 2);
    new.files.insert("src/other.js".into(), source);
    let (next, next_state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&next, &next_state, &new), 1);
}
#[test]
fn unwatched_changes_and_new_files_queue_scope_review() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .insert("src/helper.js".into(), "changed();\n".into());
    new.files.insert("src/new.js".into(), "newThing();".into());
    let (mut map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&map, &state, &new), 2);
    assert_eq!(state.changes.len(), 2);
    acknowledge(&mut map, &state, &new, &BTreeSet::new(), false, true).unwrap();
    assert!(
        state
            .changes
            .iter()
            .all(|c| change_current(&map, c, &new.manifest()))
    );
}
#[test]
fn context_change_dirties_all_without_new_tracing() {
    let (inputs, map, state) = fixture();
    let (map, state) = carry(&map, &state, &inputs.manifest(), &inputs, "two", true).unwrap();
    assert_eq!(current(&map, &state, &inputs), 0);
}
#[test]
fn whole_file_changes_queue_impact_even_when_already_watched() {
    let (mut old, mut map, mut state) = fixture();
    old.files
        .insert("src/a.js".into(), "setup();\nreturn 1;\n".into());
    map.assertions[0].flows[0].nodes[0].at.line = 2;
    state.inputs_digest = old.identity();
    acknowledge(&mut map, &state, &old, &BTreeSet::new(), true, false).unwrap();
    let mut new = old.clone();
    new.files
        .insert("src/a.js".into(), "setupChanged();\nreturn 1;\n".into());
    let (map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&map, &state, &new), 1);
    assert!(
        state
            .changes
            .iter()
            .any(|c| c.file.as_deref() == Some("src/a.js"))
    );
}
#[test]
fn unicode_and_multiline_anchors_use_utf8_byte_columns() {
    let source = "🙂; assert(\n  true\n);";
    let at = anchor("test.js", source, "assert(\n  true\n)");
    assert_eq!(at.column, 7);
    assert_eq!(
        at.offset(&Files::from([("test.js".into(), source.into())])),
        Some(6)
    );
    let mut invalid = at;
    invalid.column = 2;
    assert!(
        invalid
            .offset(&Files::from([("test.js".into(), source.into())]))
            .is_none()
    );
}
#[test]
fn validation_rejects_dangling_edges_unknown_credit_duplicate_ids_and_bad_paths() {
    let (inputs, map, _) = fixture();
    for kind in 0..4 {
        let mut map = map.clone();
        let f = &mut map.assertions[0].flows[0];
        match kind {
            0 => f.edges.push(Edge {
                from: "absent".into(),
                to: "return".into(),
                kind: "agent-defined".into(),
                basis: String::new(),
            }),
            1 => f.counts_as_asserted.push("absent".into()),
            2 => f.nodes.push(f.nodes[0].clone()),
            _ => f.nodes[0].at.file = "../outside".into(),
        };
        assert!(!validate(&map, &inputs).is_empty());
    }
}
fn report_fixture(hits: &[&str], assertion_passed: bool) -> CoverageReport {
    let phase = json!({"id":"phase","kind":"assertion","operation":"assert.equal","source":"test.js:2:1","startedAtMs":0,"endedAtMs":1,"status":if assertion_passed {"passed"}else{"failed"}});
    let raw = json!({"testId":"test","test":"test","testFile":"test.js","retry":0,"status":"passed","flaky":false,"provenance":{"runner":"node:test","kind":"unit","source":"test"},"role":"test","phases":[phase],"runtime":[{"hits":hits}],"browser":[],"server":[]});
    let request: CoverageReportRequest=serde_json::from_value(json!({"runId":"run","generatedAt":"now","testExitCode":0,
        "manifest":{"decisions":[],"branches":[],"points":[
            {"id":"a","kind":"statement","file":"src/a.js","line":1,"column":1,"source":"return 1;"},
            {"id":"b","kind":"statement","file":"src/b.js","line":1,"column":1,"source":"return 1;"}]},"rawResults":[raw]})).unwrap();
    analyze_coverage_results(&request).unwrap()
}
#[test]
fn shared_setup_is_visible_but_never_borrowed_as_same_test_evidence() {
    let (inputs, map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    for view in [&mut coverage.view, &mut coverage.filters.passed] {
        let mut setup = view.tests[0].clone();
        setup.id = "setup".into();
        setup.name = "shared setup".into();
        setup.role = "setup".into();
        view.tests[0].hits.clear();
        view.tests[0].lines.clear();
        view.tests.push(setup);
        for point in &mut view.points {
            point.tests = vec!["setup".into()];
        }
    }
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["asserted"], 0);
    assert_eq!(
        report["statements"][0]["executionEvidence"]["anyExecution"],
        true
    );
    assert_eq!(
        report["statements"][0]["executionEvidence"]["passingTests"],
        json!([])
    );
    assert_eq!(
        report["statements"][0]["executionEvidence"]["outsidePassingTests"],
        json!(["setup"])
    );
    assert!(
        report["assertions"][0]["flows"][0]["nodeCredit"][0]["reasons"]
            .as_array()
            .unwrap()
            .iter()
            .any(|r| r["code"] == "shared_setup_execution")
    );
    // A setup assertion is not silently reclassified as a passing test site.
    for phase in &mut coverage.filters.passed.phases {
        phase.test = "setup".into();
    }
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["unobservedAssertions"], 1);
}
#[test]
fn score_requires_explicit_credit_current_review_and_passing_site() {
    let (inputs, mut map, state) = fixture();
    let coverage = report_fixture(&["a", "b"], true);
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["lines"]["percentage"],
        100.0
    );
    let failed_site = report_fixture(&["a", "b"], false);
    assert_eq!(
        assess(&map, &state, &inputs, &failed_site, true)["summary"]["lines"]["asserted"],
        0
    );
    map.assertions[0].flows[0].counts_as_asserted.clear();
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["lines"]["asserted"],
        1
    );
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, false)["summary"]["lines"]["asserted"],
        0
    );
}
#[test]
fn absence_claims_do_not_credit_unexecuted_code_and_scope_blocks_credit() {
    let (inputs, map, mut state) = fixture();
    let coverage = report_fixture(&["a"], true);
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["lines"]["percentage"],
        50.0
    );
    add_change(
        &mut state,
        None,
        None,
        None,
        "unknown helper".into(),
        BTreeSet::new(),
        BTreeSet::new(),
    );
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["statements"]["percentage"],
        serde_json::Value::Null
    );
}
#[test]
fn unsupported_runtime_identity_does_not_borrow_test_level_assertions() {
    let (inputs, map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    coverage.filters.passed.phases[0].phase.source = Some("test.js::whole_test".into());
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["lines"]["asserted"],
        0
    );
}

#[test]
fn measured_lines_without_a_statement_stay_out_of_the_line_denominator() {
    let (inputs, map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    let baseline = assess(&map, &state, &inputs, &coverage, true);
    let total = baseline["summary"]["lines"]["total"].as_u64().unwrap();
    assert_eq!(baseline["summary"]["lines"]["percentage"], 100.0);
    // Continuation lines of a multi-line statement, and nested arrow bodies
    // with no statement of their own, are measured but carry no claimable
    // statement. Counting them would cap the percentage for structural reasons
    // and offer an agent work it cannot do.
    let mut orphan = coverage.view.lines[0].clone();
    orphan.line = 99;
    orphan.measured = true;
    coverage.view.lines.push(orphan);
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["lines"]["total"], total);
    assert_eq!(report["summary"]["lines"]["percentage"], 100.0);
    assert_eq!(
        report["unassertedLines"],
        json!([]),
        "a line no statement anchors is not reported as unasserted work"
    );
}
#[test]
fn unmeasured_statements_never_enter_the_primary_denominator_or_numerator() {
    let (inputs, map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    coverage.filters.passed.points[1].measured = false;
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["total"], 1);
    assert_eq!(report["summary"]["statements"]["asserted"], 1);
    assert_eq!(report["summary"]["statements"]["percentage"], 100.0);
}
#[test]
fn execution_from_another_test_cannot_supply_credit() {
    let (inputs, map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    for p in &mut coverage.filters.passed.points {
        p.tests = vec!["different test".into()];
    }
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["lines"]["asserted"],
        0
    );
}

#[test]
fn node_credit_distinguishes_context_unexecuted_and_other_test_evidence() {
    let (inputs, mut map, state) = fixture();
    let flow = &mut map.assertions[0].flows[0];
    flow.nodes.push(Node {
        id: "context".into(),
        at: flow.nodes[0].at.clone(),
        role: String::new(),
        meaning: "Background explanation only".into(),
    });
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let original = map.clone();
    let report = assess(&map, &state, &inputs, &report_fixture(&["a"], true), true);
    let flows = &report["assertions"][0]["flows"];
    let credited = &flows[0]["nodeCredit"][0];
    assert_eq!(credited["nodeId"], "return");
    assert_eq!(credited["status"], "credited");
    assert_eq!(credited["statementIds"], json!(["a"]));
    assert_eq!(credited["matchingTests"], json!(["test"]));
    assert_eq!(credited["reasons"][0]["code"], "same_test_execution");
    assert_eq!(flows[0]["nodeCredit"][1]["status"], "context");
    assert_eq!(
        flows[0]["nodeCredit"][1]["reasons"][0]["code"],
        "context_only"
    );
    assert_eq!(flows[1]["nodeCredit"][0]["status"], "notCredited");
    assert_eq!(
        flows[1]["nodeCredit"][0]["reasons"][0]["code"],
        "no_passing_execution"
    );
    assert_eq!(report["summary"]["statements"]["asserted"], 1);

    let mut coverage = report_fixture(&["a", "b"], true);
    coverage.filters.passed.points[1].tests = vec!["another test".into()];
    let report = assess(&map, &state, &inputs, &coverage, true);
    let flow = &report["assertions"][0]["flows"][1];
    assert_eq!(flow["current"], true);
    assert_eq!(flow["eligible"], true);
    assert_eq!(
        flow["nodeCredit"][0]["reasons"][0]["code"],
        "no_same_test_execution"
    );
    assert_eq!(flow["nodeCredit"][0]["matchingTests"], json!([]));
    assert_eq!(report["summary"]["statements"]["asserted"], 1);
    assert_eq!(
        map, original,
        "Credit diagnostics must not mutate authored claims"
    );
}

#[test]
fn node_credit_reports_reference_freshness_and_run_blockers() {
    let (inputs, map, state) = fixture();
    let coverage = report_fixture(&["a", "b"], true);
    for (case, expected) in [
        (0, "flow_needs_attention"),
        (1, "no_measured_statement"),
        (2, "invalid_source_anchor"),
        (3, "no_passing_assertion"),
        (4, "run_failed"),
        (5, "invalid_map_identity"),
    ] {
        let mut map = map.clone();
        let mut state = state.clone();
        let mut coverage = coverage.clone();
        match case {
            0 => map.assertions[0].flows[0].basis = None,
            1 => {
                // A valid source fragment is not an exact measured statement.
                map.assertions[0].flows[0].nodes[0].at.text = "return".into();
                acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
            }
            2 => map.assertions[0].flows[0].nodes[0].at.line = 99,
            3 => coverage.filters.passed.phases.clear(),
            4 => (),
            5 => state.inputs_digest = "wrong-inputs".into(),
            _ => unreachable!(),
        }
        let report = assess(&map, &state, &inputs, &coverage, case != 4);
        let node = &report["assertions"][0]["flows"][0]["nodeCredit"][0];
        assert_eq!(node["status"], "notCredited", "{expected}");
        assert!(
            node["reasons"]
                .as_array()
                .unwrap()
                .iter()
                .any(|r| r["code"] == expected),
            "{node}"
        );
    }
}
#[test]
fn frozen_inputs_accept_absolute_relative_and_windows_verbatim_paths_once() {
    let temporary = std::env::temp_dir().join(format!("supercov-map-paths-{}", std::process::id()));
    let directory = temporary.join("project");
    std::fs::create_dir_all(&directory).unwrap();
    let canonical = std::fs::canonicalize(&directory).unwrap();
    // Discovery supplies ordinary absolute paths, while canonicalize on Windows
    // returns a verbatim path. Both must identify the same frozen source file.
    #[cfg(windows)]
    let root = std::path::PathBuf::from(canonical.to_str().unwrap().strip_prefix(r"\\?\").unwrap());
    #[cfg(not(windows))]
    let root = canonical.clone();
    let source = "import assert from 'node:assert/strict'; assert.equal(1, 1);";
    std::fs::write(root.join("test.js"), source).unwrap();
    let inputs = supercov_engine::assertion_inputs::capture(
        &root,
        "javascript",
        [
            "test.js".into(),
            root.join("test.js"),
            canonical.join("test.js"),
        ],
    )
    .unwrap();
    assert_eq!(inputs.files.len(), 1);
    assert_eq!(inputs.assertions.len(), 1);
    assert_eq!(inputs.assertions[0].at.file, "test.js");
    assert_eq!(inputs.files["test.js"], source);
    let outside = root.parent().unwrap().join("outside.js");
    std::fs::write(&outside, source).unwrap();
    assert!(
        supercov_engine::assertion_inputs::capture(&root, "javascript", [outside])
            .unwrap_err()
            .contains("assertion input outside project")
    );
    std::fs::remove_dir_all(temporary).unwrap();
}

#[test]
fn syntax_inventory_spans_work_across_all_language_adapters() {
    let root = std::env::temp_dir().join(format!("supercov-map-languages-{}", std::process::id()));
    std::fs::create_dir_all(&root).unwrap();
    for (file, source, expected) in [
        (
            "test.js",
            "import assert from 'node:assert/strict'; assert.equal(1, 1);",
            1,
        ),
        ("test.py", "assert True\nself.assertEqual(1, 1)\n", 2),
        ("test.rb", "assert_equal 1, 1\nexpect(1).to eq(1)\n", 2),
        ("test.rs", "fn main() { assert_eq!(1, 1); }", 1),
    ] {
        std::fs::write(root.join(file), source).unwrap();
        let inputs =
            supercov_engine::assertion_inputs::capture(&root, "fixture", [file.into()]).unwrap();
        assert_eq!(inputs.assertions.len(), expected, "{file}");
        assert!(
            inputs
                .assertions
                .iter()
                .all(|s| s.at.offset(&inputs.files).is_some())
        );
    }
    std::fs::remove_dir_all(root).unwrap();
}

#[test]
fn syntax_diagnostics_locate_nested_errors_and_reject_ambiguous_json() {
    let (_, map, _) = fixture();
    let mut value = serde_json::to_value(map).unwrap();
    value["assertions"][0]["flows"][0]["countsAsAsserted"] = json!(true);
    let error = parse(&serde_json::to_vec_pretty(&value).unwrap()).unwrap_err();
    assert_eq!(error.pointer, "/assertions/0/flows/0/countsAsAsserted");
    assert!(error.line > 1);
    for text in [
        r#"{"assertions":[],"assertions":[]}"#,
        r#"{"assertions":[],"unknown":1}"#,
        r#"{"assertions":[],"schemaVersion":1}"#,
        r#"{"assertions":[]} {}"#,
    ] {
        assert!(parse(text.as_bytes()).is_err(), "{text}");
    }
    assert!(parse(br#"{"schemaVersion":2,"assertions":[]}"#).is_ok());
    assert!(parse(br#"{"assertions":[]}"#).is_err());
}

#[test]
fn javascript_inventory_includes_async_operands_and_fixture_modules() {
    use supercov_engine::js_instrumenter::{
        assertion_ranges_with_expect_modules, instrument_node_assertion_phases_with_expect_modules,
    };
    let source = "import { expect as check } from '@acme/fixtures';\nasync function test() { check(await value()).toBe(1); check(value()).toBe(1); }\n";
    let modules = vec!["@acme/fixtures".into()];
    let inventory = assertion_ranges_with_expect_modules("test.ts", source, &modules).unwrap();
    assert_eq!(inventory.len(), 2, "await sites must stay inventoried");
    assert!(source[inventory[0].0..inventory[0].1].contains("await"));
    let transformed =
        instrument_node_assertion_phases_with_expect_modules(source, "test.ts", &modules).unwrap();
    assert_eq!(
        transformed.assertions, 2,
        "callee binding preserves await syntax"
    );
    let cjs = "const { expect: check } = require('@jest/globals'); check(1).toBe(1); function f(check) { check(2).toBe(2); }";
    assert_eq!(
        assertion_ranges_with_expect_modules("test.cjs", cjs, &[])
            .unwrap()
            .len(),
        1
    );
}

#[test]
fn a_coordinate_cannot_substitute_for_exact_assertion_identity() {
    let (inputs, mut map, state) = fixture();
    let coverage = report_fixture(&["a", "b"], true);
    map.assertions[0].at.text.push(';');
    assert!(
        validate(&map, &inputs).is_empty(),
        "source exists but it is a different anchor"
    );
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["asserted"], 0);
    assert_eq!(report["summary"]["unobservedAssertions"], 1);
}

#[test]
fn statement_view_exposes_exact_anchors_and_flow_credit() {
    let (inputs, map, state) = fixture();
    let report = assess(&map, &state, &inputs, &report_fixture(&["a"], true), true);
    let rows = report["statements"].as_array().unwrap();
    assert_eq!(rows.len(), 2);
    assert_eq!(rows[0]["at"]["text"], "return 1;");
    assert_eq!(
        rows[0]["flows"][0],
        flow_key(&map.assertions[0], &map.assertions[0].flows[0])
    );
    assert_eq!(rows[1]["declared"], true);
    assert_eq!(rows[1]["asserted"], false);
}

#[test]
fn crediting_a_control_statement_does_not_credit_its_nested_body() {
    let (mut inputs, mut map, mut state) = fixture();
    let source = "if (true) { return 1; }\n";
    inputs.files.insert("src/a.js".into(), source.into());
    map.assertions[0].flows[0].nodes[0].at = anchor("src/a.js", source, source.trim());
    state.inputs_digest = inputs.identity();
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let mut coverage = report_fixture(&["a", "b"], true);
    let mut inner = coverage.filters.passed.points[0].clone();
    inner.meta.id = "inner".into();
    inner.meta.column = 13;
    coverage.filters.passed.points[0].meta.source = source.trim().into();
    coverage.filters.passed.points.push(inner);
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["asserted"], 2);
    assert_eq!(report["summary"]["statements"]["total"], 3);
    assert_eq!(report["statements"][2]["asserted"], false);
    assert_eq!(
        report["assertions"][0]["flows"][0]["nodeCredit"][0]["statementIds"],
        json!(["a"])
    );
}

#[test]
fn basis_syntax_requires_an_explicit_null_or_versioned_token() {
    let (_, map, _) = fixture();
    let base = serde_json::to_value(map).unwrap();
    for value in [
        json!(""),
        json!("scov2:ABC"),
        json!("scov1:0000"),
        json!(42),
    ] {
        let mut map = base.clone();
        map["assertions"][0]["flows"][0]["basis"] = value;
        assert!(parse(&serde_json::to_vec(&map).unwrap()).is_err());
    }
    let mut missing = base.clone();
    missing["assertions"][0]["flows"][0]
        .as_object_mut()
        .unwrap()
        .remove("basis");
    assert!(parse(&serde_json::to_vec(&missing).unwrap()).is_err());
    missing["assertions"][0]["flows"][0]["basis"] = json!(null);
    assert!(parse(&serde_json::to_vec(&missing).unwrap()).is_ok());
}

#[test]
fn a_manifest_is_never_reported_twice_as_a_change_to_assess() {
    // The run's dependency fingerprint already answers for a manifest, and it
    // reads what the manifest declares rather than its bytes. Recording the
    // bytes here as well made cutting a release look like a change that needed
    // an explanation before coverage would report a number again.
    let (inputs, map, state) = fixture();
    let mut released = inputs.clone();
    released
        .files
        .insert("package.json".into(), r#"{"version":"2.0.0"}"#.into());
    let (_, next) = carry(&map, &state, &inputs.manifest(), &released, "next", false).unwrap();
    assert!(
        next.changes.is_empty(),
        "a manifest must not queue an assessment: {:?}",
        next.changes
    );

    // An ordinary source file still does, which is what the mechanism is for.
    let mut edited = inputs.clone();
    edited.files.insert("src/a.js".into(), "return 2;\n".into());
    let (_, reported) = carry(&map, &state, &inputs.manifest(), &edited, "next", false).unwrap();
    assert!(!reported.changes.is_empty());
}

#[test]
fn a_redundant_watch_cannot_undo_the_manifest_rule() {
    // Found by running a real 653-flow map through the upgrade: almost every
    // flow watched `package.json`, so a version bump still made all of them
    // stale even though the manifest digest ignores version numbers. The bytes
    // were reaching the flow's own token by the back door.
    let (mut inputs, mut map, state) = fixture();
    inputs
        .files
        .insert("package.json".into(), r#"{"version":"1.0.0"}"#.into());
    map.assertions[0].flows[0].watch = vec!["package.json".into()];
    let before = expected_basis(
        &map.assertions[0],
        &map.assertions[0].flows[0],
        &map,
        &state,
        &inputs.manifest(),
    );

    let mut released = inputs.clone();
    released
        .files
        .insert("package.json".into(), r#"{"version":"2.0.0"}"#.into());
    assert_eq!(
        before,
        expected_basis(
            &map.assertions[0],
            &map.assertions[0].flows[0],
            &map,
            &state,
            &released.manifest(),
        ),
        "cutting a release must not move a flow's token"
    );

    // A node in that file is the flow's subject, not a redundant watch, so it
    // still counts. `setup.py` is a dependency manifest and measured source at
    // once, and editing it has to cost a review.
    let mut subject = map.clone();
    subject.assertions[0].flows[0].watch.clear();
    subject.assertions[0].flows[0].nodes[0].at.file = "package.json".into();
    assert!(
        dependencies(&subject.assertions[0], &subject.assertions[0].flows[0])
            .contains("package.json")
    );
}

#[test]
fn a_watch_on_a_file_supercov_already_tracks_is_reported_as_redundant() {
    // Every flow is marked dirty when a dependency manifest or the execution
    // configuration changes, so naming one of those per flow catches nothing
    // extra. The map is not wrong, which is why this is an advisory -- but left
    // unsaid it teaches the author that per-flow watching is how dependency
    // drift is caught, and the effort goes to entries that change nothing.
    let (mut inputs, mut map, _) = fixture();
    let about = |map: &AssertionMap, file: &str| {
        advisories(map)
            .into_iter()
            .filter(|a| a.contains(&format!("watch \"{file}\"")))
            .collect::<Vec<_>>()
    };
    for tracked in ["package-lock.json", "package.json", "Cargo.toml"] {
        // A real project carries these in the inventory, so watching one is a
        // well-formed thing to write. That is exactly why it needs saying.
        inputs.files.insert(tracked.into(), "{}".into());
        assert!(about(&map, tracked).is_empty());
        map.assertions[0].flows[0].watch = vec![tracked.into()];
        let advice = about(&map, tracked);
        assert!(
            advice.iter().any(|a| a.contains("redundant")),
            "{tracked} should be reported: {advice:?}"
        );
        // It stays an advisory. A redundant watch never fails validation.
        assert!(validate_flow(&map.assertions[0].flows[0], &inputs.files).is_empty());
    }
    // A file no fingerprint covers, holding none of the flow's nodes, is
    // exactly what watch exists for: nothing to say about it.
    map.assertions[0].flows[0].watch = vec!["tests/helpers/peer.js".into()];
    assert!(about(&map, "tests/helpers/peer.js").is_empty());
}

#[test]
fn counted_nodes_need_an_authored_path_to_the_exact_assertion_sink() {
    let (inputs, mut map, _) = fixture();
    let flow = &mut map.assertions[0].flows[0];
    flow.edges[0].to = "return".into(); // A cycle alone proves no connection.
    assert!(
        validate_flow(flow, &inputs.files)
            .iter()
            .any(|e| e.contains("no authored path"))
    );
    flow.edges.push(Edge {
        from: "return".into(),
        to: "$assertion".into(),
        kind: "data".into(),
        basis: String::new(),
    });
    assert!(validate_flow(flow, &inputs.files).is_empty());
    flow.nodes.push(Node {
        id: "context".into(),
        at: flow.nodes[0].at.clone(),
        role: String::new(),
        meaning: String::new(),
    });
    // Context can be disconnected; it is not counted automatically.
    assert!(validate_flow(flow, &inputs.files).is_empty());
    flow.counts_as_asserted.push("context".into());
    assert!(!validate_flow(flow, &inputs.files).is_empty());
}

#[test]
fn empty_selectors_never_mean_all_tests_and_zero_credit_is_distinct_from_no_work() {
    let (inputs, mut map, state) = fixture();
    let coverage = report_fixture(&["a", "b"], true);
    for f in &mut map.assertions[0].flows {
        f.applies_to.clear();
    }
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["status"], "pending");
    assert_eq!(report["summary"]["statements"]["percentage"], json!(null));
    for f in &mut map.assertions[0].flows {
        f.applies_to = vec![TestSelector {
            file: "test.js".into(),
            name: "test".into(),
        }];
        f.counts_as_asserted.clear();
    }
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["status"], "available");
    assert_eq!(report["summary"]["statements"]["percentage"], 0.0);
    assert_eq!(
        report["summary"]["observedAssertionsWithoutCurrentExplanation"],
        0
    );
    map.assertions[0].flows.clear();
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["status"],
        "notAssessed"
    );
}

#[test]
fn observed_unexplained_assertions_require_exact_inventory_identity() {
    let (inputs, mut map, state) = fixture();
    let coverage = report_fixture(&["a", "b"], true);
    let count = |map: &AssertionMap, coverage: &CoverageReport| {
        assess_summary(map, &state, &inputs, coverage, true)["summary"]
            ["observedAssertionsWithoutCurrentExplanation"]
            .as_u64()
            .unwrap()
    };
    assert_eq!(count(&map, &coverage), 0, "a current explanation exists");
    map.assertions[0].flows.clear();
    assert_eq!(count(&map, &coverage), 1, "observed but unexplained");
    assert_eq!(count(&map, &report_fixture(&["a", "b"], false)), 0);
    // Same coordinates with different text must not count twice. The exact
    // inventoried assertion is still included as an unmapped inventory site.
    map.assertions[0].at.text.push_str(" /* stale */");
    assert_eq!(count(&map, &coverage), 1);
    map.assertions.clear();
    assert_eq!(count(&map, &coverage), 1, "unmapped inventory is included");
}

#[test]
fn qualified_selectors_reject_ambiguous_names_and_missing_siblings_do_not_erase_evidence() {
    let (inputs, mut map, state) = fixture();
    let mut coverage = report_fixture(&["a", "b"], true);
    for f in &mut map.assertions[0].flows {
        f.applies_to.push(TestSelector {
            file: "test.js".into(),
            name: "missing case".into(),
        });
    }
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["asserted"], 2);
    assert_eq!(
        report["assertions"][0]["flows"][0]["selectors"][1]["status"],
        "missing"
    );
    let mut other = coverage.view.tests[0].clone();
    other.id = "another-test".into();
    other.file = Some("another.js".into());
    coverage.view.tests.push(other.clone());
    assert_eq!(
        assess(&map, &state, &inputs, &coverage, true)["summary"]["statements"]["asserted"],
        2
    );
    other.file = Some("test.js".into());
    coverage.view.tests.push(other);
    let report = assess(&map, &state, &inputs, &coverage, true);
    assert_eq!(report["summary"]["statements"]["asserted"], 0);
    assert_eq!(
        report["assertions"][0]["flows"][0]["selectors"][0]["status"],
        "ambiguous"
    );
}

#[test]
fn a_selected_test_file_is_an_implicit_dependency_and_questions_are_per_flow() {
    let (mut inputs, mut map, mut state) = fixture();
    inputs
        .files
        .insert("tests/shared.js".into(), "setup();\n".into());
    state.inputs_digest = inputs.identity();
    map.assertions[0].flows[0].applies_to.push(TestSelector {
        file: "tests/shared.js".into(),
        name: "shared".into(),
    });
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let mut new = inputs.clone();
    new.files
        .insert("tests/shared.js".into(), "editedSetup();\n".into());
    let (mut next, state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    assert_eq!(current(&next, &state, &new), 1);
    next.assertions[0]
        .questions
        .push("More flows may exist".into());
    assert_eq!(current(&next, &state, &new), 1);
    next.assertions[0].flows[1]
        .questions
        .push("Which guard controls this return?".into());
    acknowledge(&mut next, &state, &new, &BTreeSet::new(), true, true).unwrap();
    assert_eq!(current(&next, &state, &new), 1);
    assert!(
        reasons(
            &next.assertions[0],
            &next.assertions[0].flows[1],
            &next,
            &state,
            &new
        )
        .contains("flow has unresolved questions")
    );
}

#[test]
fn change_impact_can_invalidate_an_unwatched_sibling_and_folds_without_churning_tokens() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .insert("src/helper.js".into(), "changed();\n".into());
    let (mut map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert_eq!(current(&map, &state, &new), 2);
    let before = assess(&map, &state, &new, &report_fixture(&["a", "b"], true), true);
    assert_eq!(before["summary"]["status"], "pending");
    assert_eq!(before["summary"]["statements"]["asserted"], 2); // Diagnostic only.
    let change = &state.changes[0];
    let key = flow_key(&map.assertions[0], &map.assertions[0].flows[0]);
    let mut response = ChangeAssessment {
        id: change.id.clone(),
        basis: None,
        affected_flows: vec![key],
        explanation: "Helper affects the first claim despite its missing watch".into(),
    };
    response.basis = Some(expected_change_basis(change, &response, &new.manifest()));
    map.change_assessments.push(response);
    assert_eq!(current(&map, &state, &new), 1);
    acknowledge(&mut map, &state, &new, &BTreeSet::new(), true, false).unwrap();
    let tokens = map.assertions[0]
        .flows
        .iter()
        .map(|f| f.basis.clone())
        .collect::<Vec<_>>();
    let (next, next_state) = carry(&map, &state, &new.manifest(), &new, "three", false).unwrap();
    assert_eq!(current(&next, &next_state, &new), 2);
    assert!(next.change_assessments.is_empty());
    assert!(next_state.changes.is_empty());
    assert_eq!(
        tokens,
        next.assertions[0]
            .flows
            .iter()
            .map(|f| f.basis.clone())
            .collect::<Vec<_>>()
    );
    let mut later = new.clone();
    later
        .files
        .insert("brand-new.js".into(), "// unrelated".into());
    let (later_map, later_state) =
        carry(&next, &next_state, &new.manifest(), &later, "four", false).unwrap();
    assert_eq!(current(&later_map, &later_state, &later), 2);
    assert_eq!(later_state.changes.len(), 1);
    assert_eq!(later_state.changes[0].file.as_deref(), Some("brand-new.js"));
}

#[test]
fn missing_impact_responses_cannot_clear_changes_and_an_empty_judgement_needs_a_reason() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .get_mut("src/a.js")
        .unwrap()
        .push_str("// changed");
    let (mut map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    let c = &state.changes[0];
    // An explanation is what the channel asks for. Without one there is no
    // assessment, whatever the flow list says.
    let mut r = ChangeAssessment {
        id: c.id.clone(),
        basis: None,
        affected_flows: vec![],
        explanation: "   ".into(),
    };
    r.basis = Some(expected_change_basis(c, &r, &new.manifest()));
    map.change_assessments.push(r);
    assert!(!change_current(&map, c, &new.manifest()));
    assert_eq!(validation(&map, &state, &new)["valid"], false);
    // With one, an empty judgement is the documented contract: one explanation
    // answers for the change.
    map.change_assessments.clear();
    let mut r = ChangeAssessment {
        id: c.id.clone(),
        basis: None,
        affected_flows: vec![],
        explanation: "No effect".into(),
    };
    r.basis = Some(expected_change_basis(c, &r, &new.manifest()));
    map.change_assessments.push(r);
    assert!(change_current(&map, c, &new.manifest()));
    assert_eq!(validation(&map, &state, &new)["valid"], true);
    map.change_assessments.clear();
    let (next, next_state) = carry(&map, &state, &new.manifest(), &new, "three", false).unwrap();
    assert_eq!(next_state.changes.len(), 1);
    assert_eq!(
        assess(
            &next,
            &next_state,
            &new,
            &report_fixture(&["a", "b"], true),
            true
        )["summary"]["status"],
        "pending"
    );
    map.assertions[0].flows.remove(0);
    let mut r = ChangeAssessment {
        id: c.id.clone(),
        basis: None,
        affected_flows: vec![],
        explanation: "The affected claim was explicitly removed".into(),
    };
    r.basis = Some(expected_change_basis(c, &r, &new.manifest()));
    map.change_assessments.push(r);
    assert!(change_current(&map, c, &new.manifest()));
}

#[test]
fn validation_only_reads_and_basis_encoding_is_stable() {
    let (inputs, map, state) = fixture();
    let before = serde_json::to_vec(&(&map, &state)).unwrap();
    let v = validation(&map, &state, &inputs);
    assert_eq!(v["valid"], true);
    assert_eq!(before, serde_json::to_vec(&(&map, &state)).unwrap());
    let a = &map.assertions[0];
    let f = &a.flows[0];
    assert_eq!(
        expected_basis(a, f, &map, &state, &inputs.manifest()),
        "scov3:696d86be4b85a19b2e73dc5484fb2fe0b65ce5216c93ec27464740bb1a8e51e6"
    );
}

#[test]
fn editor_schema_accepts_explicit_null_basis_and_requires_the_field() {
    let schema = schema();
    for name in ["Flow", "ChangeAssessment"] {
        assert_eq!(
            schema["$defs"][name]["properties"]["basis"]["type"],
            json!(["string", "null"])
        );
        assert!(
            schema["$defs"][name]["required"]
                .as_array()
                .unwrap()
                .contains(&json!("basis"))
        );
    }
}

/// "src/a.js changed" names a file and leaves the author to work out what it
/// has to do with this claim. A flow depends on a file for one of four reasons
/// and they call for different judgements, so the reason says which, what in
/// the file changed, and where the flow's nodes sit in it.
#[test]
fn a_changed_dependency_says_why_it_is_one_and_where_the_flow_sits() {
    let (mut inputs, mut map, mut state) = fixture();
    let source =
        "export function a() {\n  return 1;\n}\nexport function other() {\n  return 2;\n}\n";
    inputs.files.insert("src/a.js".into(), source.into());
    state.inputs_digest = inputs.identity();
    map.assertions[0].flows[0].nodes[0].at = anchor("src/a.js", source, "return 1;");
    map.assertions[0].flows[0].watch = vec!["test.js".into()];
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let mut new = inputs.clone();
    new.files.insert(
        "src/a.js".into(),
        source.replace("  return 1;", "  log();\n  return 1;"),
    );
    let (next, next_state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let why = reasons(a, &a.flows[0], &next, &next_state, &new);
    let named = why
        .iter()
        .find(|r| r.starts_with("src/a.js: a (line 1) changed"))
        .unwrap_or_else(|| panic!("{why:?}"));
    // The node's role and its line, so the author can look rather than reread.
    assert!(named.contains("holds this flow's"), "{named}");
    assert!(named.contains("return:2"), "{named}");
    // And not a role it does not have: src/a.js is not watched here, test.js is.
    assert!(!named.contains("watched"), "{named}");
}

/// A watched file is the author's own "tell me if this changes", and reads
/// differently from a file that merely holds a node.
#[test]
fn a_watched_file_is_named_as_watched() {
    let (inputs, mut map, state) = fixture();
    map.assertions[0].flows[0].watch = vec!["src/helper.js".into()];
    map.assertions[0].flows[0].nodes[0].at = anchor("src/a.js", "return 1;\n", "return 1;");
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let mut new = inputs.clone();
    new.files
        .get_mut("src/helper.js")
        .unwrap()
        .push_str("more();\n");
    let (next, next_state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let why = reasons(a, &a.flows[0], &next, &next_state, &new);
    let named = why
        .iter()
        .find(|r| r.contains("src/helper.js"))
        .unwrap_or_else(|| panic!("{why:?}"));
    assert!(named.contains("is watched by this flow"), "{named}");
    assert!(!named.contains("holds this flow's"), "{named}");
}

/// B19: a node that did not move, in a file that changed elsewhere, was
/// reported as "changed or ambiguous" -- a false statement about that node.
///
/// `relocate` had one fast path, for a file that did not change at all. Once
/// the file changed anywhere, every node in it was re-found by searching the
/// whole file for its text, and that search insists the text be unique. A node
/// whose statement appears twice in its file therefore failed to relocate even
/// though it sat at the same line, byte for byte, untouched by the edit.
#[test]
fn a_node_that_did_not_move_is_not_ambiguous() {
    let (mut inputs, mut map, mut state) = fixture();
    // Two identical statements: the node's text is no longer unique.
    let source = "export function a() {\n  return 1;\n}\nexport function b() {\n  return 1;\n}\n";
    inputs.files.insert("src/a.js".into(), source.into());
    state.inputs_digest = inputs.identity();
    // The flow's node is the first of them, and nothing watches the file, so
    // the only thing that should speak is whether the node itself changed.
    map.assertions[0].flows[0].nodes[0].at = anchor("src/a.js", source, "return 1;");
    map.assertions[0].flows[0].watch = vec!["test.js".into()];
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &inputs), 2, "fresh to begin with");

    // A comment at the end of the file. The node is above it and untouched.
    let mut new = inputs.clone();
    new.files
        .get_mut("src/a.js")
        .unwrap()
        .push_str("// a comment, far below the node\n");
    let (next, next_state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let f = &a.flows[0];
    let why = reasons(a, f, &next, &next_state, &new);
    assert!(
        !why.iter().any(|r| r.contains("node")),
        "no reason may name a node that did not move: {why:?}"
    );
    // A comment cannot change what the file does, so the review is saved.
    assert!(why.is_empty(), "a comment invalidates nothing: {why:?}");
    assert!(
        next_state.flows[&flow_key(a, f)].notices.is_empty(),
        "nor is there anything to notice"
    );

    // An edit inside the other function: outside this flow's nodes, so a
    // notice, not a review. With no record of what the test ran, the change
    // is recorded for assessment with this flow among the exposed.
    let mut new = inputs.clone();
    new.files.insert(
        "src/a.js".into(),
        source.replace(
            "export function b() {\n  return 1;",
            "export function b() {\n  return 1 + 1;",
        ),
    );
    let (next, next_state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let f = &a.flows[0];
    let why = reasons(a, f, &next, &next_state, &new);
    assert!(why.is_empty(), "b is not this flow's business: {why:?}");
    let notices = &next_state.flows[&flow_key(a, f)].notices;
    assert_eq!(notices.len(), 1, "{notices:?}");
    assert!(
        notices.iter().next().unwrap().contains("b (line 4)"),
        "{notices:?}"
    );
    let change = next_state
        .changes
        .iter()
        .find(|c| c.file.as_deref() == Some("src/a.js"))
        .expect("a change to assess");
    assert!(change.known_flows.is_empty(), "nothing was made stale");
    assert!(change.exposed.contains(&flow_key(a, f)), "{change:?}");

    // With the record -- the test ran `a` and nothing else here -- the same
    // edit cannot have reached any selected test. Nothing to assess at all.
    let mut recorded = state.clone();
    recorded.executions = Some(executions_running(&inputs, "src/a.js", &["a"]));
    let (next, next_state) =
        carry(&map, &recorded, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let f = &a.flows[0];
    assert!(reasons(a, f, &next, &next_state, &new).is_empty());
    assert_eq!(next_state.flows[&flow_key(a, f)].notices.len(), 1);
    assert!(next_state.changes.is_empty(), "{:?}", next_state.changes);

    // And when the record says the test ran `b`, the flow is exposed to the
    // change -- asked about, still not made stale.
    let mut recorded = state.clone();
    recorded.executions = Some(executions_running(&inputs, "src/a.js", &["a", "b"]));
    let (next, next_state) =
        carry(&map, &recorded, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let f = &a.flows[0];
    assert!(reasons(a, f, &next, &next_state, &new).is_empty());
    assert_eq!(next_state.changes.len(), 1);
    assert!(next_state.changes[0].exposed.contains(&flow_key(a, f)));
}

/// An execution record saying the fixture's one test ran exactly the named
/// declarations of one file, every code unit of which holds a probe.
fn executions_running(inputs: &Inputs, file: &str, ran: &[&str]) -> Executions {
    let manifest = inputs.manifest();
    let code = manifest.files[file].code.as_ref().expect("parsable");
    let index = |path: &str| {
        code.units
            .iter()
            .position(|u| u.path == path)
            .unwrap_or_else(|| panic!("no unit {path}"))
    };
    Executions {
        tests: vec![Execution {
            test: TestSelector {
                file: "test.js".into(),
                name: "test".into(),
            },
            passed: true,
            files: [(file.to_owned(), ran.iter().map(|p| index(p)).collect())].into(),
            attribution: "exact".into(),
        }],
        covered: [(file.to_owned(), ran.iter().map(|p| index(p)).collect())].into(),
        probed: [(
            file.to_owned(),
            code.units
                .iter()
                .enumerate()
                .filter(|(_, u)| u.is_code())
                .map(|(i, _)| i)
                .collect(),
        )]
        .into(),
    }
}

/// The edits that change nothing a program can observe leave an acknowledged
/// claim acknowledged, wherever they land: above the node, inside its
/// declaration, in the test file.
#[test]
fn comments_and_blank_lines_anywhere_leave_an_acknowledgement_standing() {
    let (mut inputs, mut map, mut state) = fixture();
    let source = "export function a() {\n  const x = 1;\n  return 1;\n}\n";
    inputs.files.insert("src/a.js".into(), source.into());
    state.inputs_digest = inputs.identity();
    map.assertions[0].flows[0].nodes[0].at = anchor("src/a.js", source, "return 1;");
    map.assertions[0].flows[0].watch = vec![];
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    let mut new = inputs.clone();
    new.files.insert(
        "src/a.js".into(),
        format!(
            "// a header comment\n\n{}",
            source.replace(
                "  const x = 1;",
                "  // about x\n\n  const x = 1; // trailing"
            )
        ),
    );
    let test = new.files["test.js"].clone();
    new.files
        .insert("test.js".into(), format!("// about this test\n\n{test}"));
    for site in &mut new.assertions {
        site.at.line += 2;
    }
    let (next, next_state) = carry(&map, &state, &inputs.manifest(), &new, "new", false).unwrap();
    let a = &next.assertions[0];
    let f = &a.flows[0];
    assert_eq!(f.nodes[0].at.line, 7, "the node followed its statement");
    assert_eq!(a.at.line, 4, "so did the assertion");
    let why = reasons(a, f, &next, &next_state, &new);
    assert!(why.is_empty(), "{why:?}");
    assert!(next_state.changes.is_empty(), "{:?}", next_state.changes);
}

/// B16: Supercov reports a manifest watch as redundant, so taking it back out
/// must not restate the claim. Writing one and removing one are both free; a
/// watch on a file the run does not answer for is not.
#[test]
fn a_redundant_manifest_watch_is_free_to_write_and_free_to_remove() {
    let (mut inputs, mut map, state) = fixture();
    inputs
        .files
        .insert("package.json".into(), "{\"name\":\"x\"}\n".into());
    let state = State {
        inputs_digest: inputs.identity(),
        ..state
    };
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &inputs), 2);

    // The author follows the documentation and watches the manifest.
    for a in &mut map.assertions {
        for f in &mut a.flows {
            f.watch.push("package.json".into());
        }
    }
    assert_eq!(
        current(&map, &state, &inputs),
        2,
        "writing a redundant watch restated the claim"
    );
    let advice = advisories(&map)
        .into_iter()
        .filter(|a| a.contains("watch \"package.json\""))
        .collect::<Vec<_>>();
    assert_eq!(advice.len(), 2, "{advice:?}");
    assert!(advice.iter().all(|a| a.contains("redundant")), "{advice:?}");
    assert!(
        !dependencies(&map.assertions[0], &map.assertions[0].flows[0]).contains("package.json"),
        "a redundant watch became a dependency"
    );

    // Taking the tool's advice must not cost an acknowledgement.
    for a in &mut map.assertions {
        for f in &mut a.flows {
            f.watch.retain(|w| w != "package.json");
        }
    }
    assert_eq!(
        current(&map, &state, &inputs),
        2,
        "removing an entry Supercov calls redundant restated the claim"
    );

    // A watch the run does not answer for is a real part of the claim, and
    // dropping it is still a new claim.
    for a in &mut map.assertions {
        for f in &mut a.flows {
            f.watch.retain(|w| w != "test.js");
        }
    }
    assert_eq!(
        current(&map, &state, &inputs),
        0,
        "dropping a real watch kept the acknowledgement"
    );
}

/// A watch on a file that holds the flow's own nodes is not redundant -- it
/// widens the flow from the declarations holding those nodes to the whole
/// file, so a neighbouring function's body becomes a review again. That can be
/// what the author means, so it is reported rather than refused; what must not
/// happen is it taking effect unsaid.
#[test]
fn watching_a_file_that_holds_your_nodes_is_reported_and_says_what_it_costs() {
    let (inputs, map, state) = fixture();
    // The fixture itself carries the pattern: each flow watches the file its
    // node is in, and the test file it applies to.
    let advice = advisories(&map);
    let widened = advice
        .iter()
        .find(|a| a.contains("watch \"src/a.js\""))
        .unwrap_or_else(|| panic!("{advice:?}"));
    assert!(
        widened.contains("widens this flow to the whole file"),
        "{widened}"
    );
    assert!(widened.contains("return:1"), "names the nodes: {widened}");
    assert!(
        widened.contains("the declarations holding its nodes"),
        "says what it would otherwise rest on: {widened}"
    );

    // Watching the test file adds nothing: the flow already depends on it whole.
    let test_file = advice
        .iter()
        .find(|a| a.contains("watch \"test.js\""))
        .unwrap_or_else(|| panic!("{advice:?}"));
    assert!(test_file.contains("redundant"), "{test_file}");
    assert!(
        test_file.contains("already depends on that file as a whole"),
        "{test_file}"
    );

    // An advisory never fails validation, and never invalidates.
    assert_eq!(current(&map, &state, &inputs), 2);
    for a in &map.assertions {
        for f in &a.flows {
            assert!(validate_flow(f, &inputs.files).is_empty());
        }
    }
}

/// The roles describe the file. Attached to the declaration that changed they
/// said something false -- that the neighbour holds the flow's node.
#[test]
fn a_whole_file_reason_does_not_blame_the_declaration_that_holds_no_node() {
    let test = "import assert from 'node:assert/strict';\nassert.equal(result, 1);\n";
    let source = "function work() {\n  return 1;\n}\nfunction other() {\n  return 2;\n}\n";
    let inputs = Inputs {
        schema_version: 1,
        language: "javascript".into(),
        context_digest: "context".into(),
        files: Files::from([
            ("test.js".into(), test.into()),
            ("src/a.js".into(), source.into()),
        ]),
        assertions: vec![InventorySite {
            at: anchor("test.js", test, "assert.equal(result, 1)"),
            operation: "assert.equal".into(),
        }],
        limitations: vec![],
    };
    let (mut map, state) = seed(&inputs, "archive");
    let a = &mut map.assertions[0];
    a.observes = vec!["result equals one".into()];
    a.flows = vec![Flow {
        id: "f".into(),
        basis: None,
        questions: vec![],
        explanation: "Author judgement".into(),
        applies_to: vec![TestSelector {
            file: "test.js".into(),
            name: "test".into(),
        }],
        nodes: vec![Node {
            id: "n".into(),
            at: anchor("src/a.js", source, "return 1;"),
            role: "value".into(),
            meaning: String::new(),
        }],
        edges: vec![Edge {
            from: "n".into(),
            to: "$assertion".into(),
            kind: "data".into(),
            basis: String::new(),
        }],
        counts_as_asserted: vec!["n".into()],
        watch: vec!["src/a.js".into()],
    }];
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &inputs), 1);

    // Edit only the neighbour. The watch makes this a review; the reason must
    // say why, and must not claim `other` holds the node.
    let mut next = inputs.clone();
    next.files
        .insert("src/a.js".into(), source.replace("return 2;", "return 3;"));
    let (map2, state2) = carry(&map, &state, &inputs.manifest(), &next, "new", false).unwrap();
    assert_eq!(
        current(&map2, &state2, &next),
        0,
        "the watch makes it a review"
    );
    let b = &map2.assertions[0];
    let why = reasons(b, &b.flows[0], &map2, &state2, &next);
    let named = why
        .iter()
        .find(|r| r.contains("src/a.js"))
        .unwrap_or_else(|| panic!("{why:?}"));
    assert!(named.contains("other (line 4) changed"), "{named}");
    assert!(named.contains("is watched by this flow"), "{named}");
    assert!(
        named.contains("this flow's n:2 sits in work (line 1)"),
        "the nodes are located, not blamed: {named}"
    );
    assert!(
        !named.contains("holds this flow's"),
        "the changed declaration holds no node: {named}"
    );
}

/// B15: recording an assessment used to de-acknowledge every flow it named,
/// and the exhaustive list was mandatory -- so one no-op manifest edit took a
/// 657-flow map to zero asserted statements. The author's only ways out were
/// to copy hundreds of basis tokens for claims nobody had read, or leave the
/// change pending and keep no percentage.
///
/// A test that only checks the assessment is accepted does not catch this. It
/// has to measure the credit before and after.
#[test]
fn assessing_a_change_costs_only_the_flows_the_author_judges_affected() {
    let (old, map, state) = fixture();
    let mut new = old.clone();
    new.files
        .get_mut("src/a.js")
        .unwrap()
        .push_str("// changed");
    let (mut map, state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    let c = state.changes[0].clone();
    let dependents = c
        .known_flows
        .iter()
        .filter(|k| {
            map.assertions
                .iter()
                .any(|a| a.flows.iter().any(|f| flow_key(a, f) == **k))
        })
        .cloned()
        .collect::<Vec<_>>();
    assert!(!dependents.is_empty(), "the change has live dependents");

    // The author rereads the claims the edit touched and re-acknowledges them.
    acknowledge(&mut map, &state, &new, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &new), 2, "re-acknowledged");

    // One explanation answers for the change. The dependents keep their credit.
    let assess_with = |map: &mut AssertionMap, affected: Vec<String>, why: &str| {
        map.change_assessments.clear();
        let mut r = ChangeAssessment {
            id: c.id.clone(),
            basis: None,
            affected_flows: affected,
            explanation: why.into(),
        };
        r.basis = Some(expected_change_basis(&c, &r, &new.manifest()));
        map.change_assessments.push(r);
    };
    assess_with(
        &mut map,
        vec![],
        "The edit is a comment; no claim rests on it",
    );
    assert!(change_current(&map, &c, &new.manifest()));
    assert_eq!(
        current(&map, &state, &new),
        2,
        "assessing the change cost the flows their acknowledgement"
    );

    // Naming one is a judgement about that one, and costs exactly it.
    assess_with(
        &mut map,
        vec![dependents[0].clone()],
        "This claim reads the edited line",
    );
    assert!(change_current(&map, &c, &new.manifest()));
    assert_eq!(
        current(&map, &state, &new),
        1,
        "exactly the flow the author named should go stale"
    );

    // Naming a flow that is not in the map is still an error.
    assess_with(&mut map, vec!["nope/flow".into()], "typo");
    assert!(!change_current(&map, &c, &new.manifest()));
    assert!(
        validation(&map, &state, &new)["errors"]
            .as_array()
            .unwrap()
            .iter()
            .any(|e| e.as_str().unwrap().contains("unknown affected flow"))
    );
}

/// B17: one change carried every dependent key and every exposed test, so a
/// single item outgrew the JSON page cap and could not be fetched at any page
/// size -- the documented pagination loop returned 48 of 49 changes. The lists
/// that did it grew with the map and the suite, not with the change.
///
/// The invariant is scale invariance: a change item must not grow when the
/// project does.
#[test]
fn a_change_item_does_not_grow_with_the_map_or_the_suite() {
    let bytes = |flows: usize| {
        let test = "import assert from 'node:assert/strict';\nassert.equal(result, 1);\n";
        let source = "helper();\n";
        let mut files = Files::from([
            ("test.js".into(), test.into()),
            ("src/shared.js".into(), source.into()),
        ]);
        for i in 0..flows {
            files.insert(format!("tests/suite{i}.test.js"), test.into());
        }
        let inputs = Inputs {
            schema_version: 1,
            language: "javascript".into(),
            context_digest: "context".into(),
            files,
            assertions: vec![InventorySite {
                at: anchor("test.js", test, "assert.equal(result, 1)"),
                operation: "assert.equal".into(),
            }],
            limitations: vec![],
        };
        let (mut map, state) = seed(&inputs, "archive");
        let a = &mut map.assertions[0];
        a.observes = vec!["result equals one".into()];
        a.flows = (0..flows)
            .map(|i| Flow {
                id: format!("flow-number-{i}"),
                basis: None,
                questions: vec![],
                explanation: format!("Author judgement for flow {i}"),
                applies_to: vec![TestSelector {
                    file: format!("tests/suite{i}.test.js"),
                    name: format!("a reasonably long test name for suite {i}"),
                }],
                nodes: vec![Node {
                    id: "n".into(),
                    at: anchor("src/shared.js", source, "helper();"),
                    role: "value".into(),
                    meaning: String::new(),
                }],
                edges: vec![Edge {
                    from: "n".into(),
                    to: "$assertion".into(),
                    kind: "data".into(),
                    basis: String::new(),
                }],
                counts_as_asserted: vec!["n".into()],
                watch: vec![],
            })
            .collect();
        acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
        let mut new = inputs.clone();
        new.files
            .insert("src/shared.js".into(), "helper();\nmore();\n".into());
        let (map2, state2) = carry(&map, &state, &inputs.manifest(), &new, "two", false).unwrap();
        let v = validation(&map2, &state2, &new);
        let changes = v["changes"].as_array().unwrap();
        assert_eq!(changes.len(), 1, "one file changed");
        let c = &changes[0];
        // The counts are still exact; only the lists are sampled.
        assert_eq!(c["knownFlows"]["flows"].as_u64().unwrap() as usize, flows);
        assert_eq!(c["exposed"]["flows"].as_u64().unwrap() as usize, flows);
        assert_eq!(c["exposed"]["testCount"].as_u64().unwrap() as usize, flows);
        serde_json::to_vec(c).unwrap().len()
    };
    let small = bytes(50);
    let large = bytes(400);
    // Eight times the map and eight times the suite. What is left is the
    // sampled identifiers getting longer -- `suite399` over `suite49` -- not
    // the item carrying more of the project.
    assert!(
        large.abs_diff(small) < 256,
        "a change item grew with the project: {small} -> {large} bytes"
    );
    // And it fits a page with room to spare, whatever the project does.
    assert!(large < 8_192, "{large} bytes");
}

/// One edit to a flow, and the part its reason must name.
type Edit = (&'static str, Box<dyn Fn(&mut Flow)>, &'static str);

/// A map edit used to report `claim or inputs changed; needs rechecking`,
/// whatever the author had done. Deleting a watch entry and rewriting an
/// explanation are different acts and deserve different sentences -- the claim
/// is a structure, and a mismatch can say which part of it moved.
#[test]
fn a_map_edit_says_which_part_of_the_claim_moved() {
    let (inputs, map, state) = fixture();
    // The state that carries the record is written by a run, so take one.
    let (map, state) = carry(&map, &state, &inputs.manifest(), &inputs, "two", false).unwrap();
    let mut map = map;
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    assert_eq!(current(&map, &state, &inputs), 2);

    let why = |map: &AssertionMap| {
        let a = &map.assertions[0];
        reasons(a, &a.flows[0], map, &state, &inputs)
            .into_iter()
            .collect::<Vec<_>>()
            .join(" | ")
    };
    let edits: Vec<Edit> = vec![
        (
            "explanation",
            Box::new(|f: &mut Flow| f.explanation = "A different judgement".into()),
            "the flow's explanation changed",
        ),
        (
            "watch",
            Box::new(|f: &mut Flow| f.watch.clear()),
            "the flow's watch list changed",
        ),
        (
            "questions",
            Box::new(|f: &mut Flow| f.questions.push("is this right?".into())),
            "the flow's questions changed",
        ),
        (
            "counted nodes",
            Box::new(|f: &mut Flow| f.counts_as_asserted.clear()),
            "the flow's counted nodes changed",
        ),
        (
            "node meaning",
            Box::new(|f: &mut Flow| f.nodes[0].meaning = "the returned value".into()),
            "the flow's nodes changed",
        ),
    ];
    for (name, edit, expected) in edits {
        let mut edited = map.clone();
        edit(&mut edited.assertions[0].flows[0]);
        let reported = why(&edited);
        assert!(
            reported.contains(expected),
            "editing the {name} reported {reported:?}"
        );
        assert!(
            !reported.contains("claim or inputs changed"),
            "editing the {name} fell back to the generic reason: {reported:?}"
        );
        // Only the part that moved is named.
        assert_eq!(
            reported.matches(" changed").count(),
            1,
            "editing the {name} named more than one part: {reported:?}"
        );
    }

    // Editing what the assertion observes is not a flow edit, and says so.
    let mut edited = map.clone();
    edited.assertions[0].observes = vec!["something else entirely".into()];
    assert!(
        why(&edited).contains("what the assertion observes changed"),
        "{:?}",
        why(&edited)
    );

    // A flow with no recorded parts still gets an answer rather than silence.
    let mut bare = state.clone();
    for flow in bare.flows.values_mut() {
        flow.footprint.clear();
    }
    let mut edited = map.clone();
    edited.assertions[0].flows[0].explanation = "Changed".into();
    let a = &edited.assertions[0];
    assert!(
        reasons(a, &a.flows[0], &edited, &bare, &inputs)
            .iter()
            .any(|r| r.contains("claim or inputs changed")),
        "a state written before parts were recorded must still say something"
    );
}

#[test]
fn a_summary_counts_exactly_what_the_full_assessment_counts() {
    // `runs latest` shows five fields of the assessment and used to build all of
    // it to get them: every measured statement, each carrying the source of the
    // node around it. On a 300-file run that was 300,000 entries and 4 GB. The
    // summary now skips that list, so the one thing that must not happen is the
    // two computing different numbers -- which is what every scenario checks,
    // including one where a statement cannot be located, since that count is the
    // one taken from the list the summary no longer builds.
    let (inputs, map, state) = fixture();
    let mut unlocatable = inputs.clone();
    unlocatable
        .files
        .insert("src/b.js".into(), "something else entirely;\n".into());
    let scenarios = [
        (
            "both statements reached",
            inputs.clone(),
            report_fixture(&["a", "b"], true),
            true,
        ),
        (
            "one reached",
            inputs.clone(),
            report_fixture(&["a"], true),
            true,
        ),
        (
            "none reached",
            inputs.clone(),
            report_fixture(&[], true),
            true,
        ),
        (
            "assertion failed",
            inputs.clone(),
            report_fixture(&["a", "b"], false),
            false,
        ),
        (
            "a statement cannot be located",
            unlocatable,
            report_fixture(&["a", "b"], true),
            true,
        ),
    ];
    for (name, inputs, coverage, passed) in scenarios {
        let full = assess(&map, &state, &inputs, &coverage, passed);
        let summary = assess_summary(&map, &state, &inputs, &coverage, passed);
        assert_eq!(full["summary"], summary["summary"], "{name}");
        assert_eq!(
            full["statements"].as_array().map(Vec::len),
            Some(2),
            "{name}"
        );
        for list in ["statements", "creditedLines", "unassertedLines"] {
            assert!(
                summary[list].as_array().is_none_or(Vec::is_empty),
                "{name}: the summary builds no {list}"
            );
        }
        if name == "a statement cannot be located" {
            assert_eq!(
                summary["summary"]["unanchoredStatements"], 1,
                "the count taken from the skipped list is still counted"
            );
        }
    }
}

/// Two tests asserting the same thing, each explained by one flow.
fn repeated_fixture(test: &str) -> (Inputs, AssertionMap, State) {
    let source =
        "export function a() {\n  return null;\n}\nexport function b() {\n  return null;\n}\n";
    let sites: Vec<InventorySite> = test
        .match_indices("assert.equal(result, 1)")
        .map(|(start, needle)| InventorySite {
            at: Anchor::new("test.js", test, start, start + needle.len()),
            operation: "assert.equal".into(),
        })
        .collect();
    let inputs = Inputs {
        schema_version: 1,
        language: "javascript".into(),
        context_digest: "context".into(),
        files: Files::from([
            ("test.js".into(), test.into()),
            ("src/a.js".into(), source.into()),
        ]),
        assertions: sites,
        limitations: vec![],
    };
    let (mut map, state) = seed(&inputs, "archive");
    let second = source.rfind("return null;").unwrap();
    for (index, a) in map.assertions.iter_mut().enumerate() {
        a.observes = vec!["result equals one".into()];
        a.flows = vec![Flow {
            id: format!("f{index}"),
            basis: None,
            questions: vec![],
            explanation: format!("Author judgement {index}"),
            applies_to: vec![TestSelector {
                file: "test.js".into(),
                name: format!("test {index}"),
            }],
            nodes: vec![Node {
                id: "return".into(),
                at: Anchor::new("src/a.js", source, second, second + "return null;".len()),
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
        }];
    }
    acknowledge(&mut map, &state, &inputs, &BTreeSet::new(), true, false).unwrap();
    (inputs, map, state)
}

fn with_file(inputs: &Inputs, file: &str, text: &str) -> Inputs {
    let mut next = inputs.clone();
    next.files.insert(file.into(), text.into());
    if file == "test.js" {
        next.assertions = text
            .match_indices("assert.")
            .map(|(start, _)| {
                let end = start + text[start..].find(')').unwrap() + 1;
                InventorySite {
                    at: Anchor::new("test.js", text, start, end),
                    operation: "assert.equal".into(),
                }
            })
            .collect();
    }
    next
}

#[test]
fn a_line_added_above_repeated_assertions_keeps_them_and_their_explanations() {
    // TodoMVC: one assertion added at the top of a test retired 11 of 25
    // mapped assertions, because their text repeats in the file and a moved
    // site was found again only by text unique in the whole file.
    let test = "test('0', () => {\n  assert.equal(result, 1);\n});\ntest('1', () => {\n  assert.equal(result, 1);\n});\n";
    let (old, map, state) = repeated_fixture(test);
    let edited = format!("assert.ok(ready);\n{test}");
    let new = with_file(&old, "test.js", &edited);
    let (next, _) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert!(
        next.retired_assertions.is_empty(),
        "{:?}",
        next.retired_assertions
    );
    for (index, previous) in map.assertions.iter().enumerate() {
        let kept = next
            .assertions
            .iter()
            .find(|a| a.id == previous.id)
            .unwrap();
        assert_eq!(
            kept.at.line,
            previous.at.line + 1,
            "assertion {index} moved with its line"
        );
        assert_eq!(kept.flows[0].explanation, previous.flows[0].explanation);
    }
}

#[test]
fn identical_assertions_that_could_have_traded_places_are_only_suggestions() {
    // A third identical assertion between the two: either old one could be
    // either new one. The explanations are kept, and their identity is asked.
    let test = "test('0', () => {\n  assert.equal(result, 1);\n});\ntest('1', () => {\n  assert.equal(result, 1);\n});\n";
    let (old, map, state) = repeated_fixture(test);
    let edited = test.replacen(
        "test('1'",
        "test('new', () => {\n  assert.equal(result, 1);\n});\ntest('1'",
        1,
    );
    let new = with_file(&old, "test.js", &edited);
    let (next, next_state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    assert!(next.retired_assertions.is_empty());
    for previous in &map.assertions {
        let kept = next
            .assertions
            .iter()
            .find(|a| a.id == previous.id)
            .unwrap();
        let why = reasons(kept, &kept.flows[0], &next, &next_state, &new);
        assert!(
            why.iter().any(|r| r.contains("confirm identity")),
            "{why:?}"
        );
    }
}

#[test]
fn a_node_in_an_unchanged_function_follows_it_down_the_file() {
    // `return null;` appears in both functions, so a text search cannot find
    // the second one again after a line is added above them.
    let test = "test('0', () => {\n  assert.equal(result, 1);\n});\n";
    let (old, map, state) = repeated_fixture(test);
    let source = &old.files["src/a.js"];
    let new = with_file(
        &old,
        "src/a.js",
        &format!("import {{ x }} from './x.js';\n{source}"),
    );
    let (next, next_state) = carry(&map, &state, &old.manifest(), &new, "two", false).unwrap();
    let node = &next.assertions[0].flows[0].nodes[0];
    assert_eq!(
        node.at.line,
        map.assertions[0].flows[0].nodes[0].at.line + 1
    );
    let why = reasons(
        &next.assertions[0],
        &next.assertions[0].flows[0],
        &next,
        &next_state,
        &new,
    );
    assert!(
        !why.iter().any(|r| r.contains("changed or ambiguous")),
        "{why:?}"
    );
}
