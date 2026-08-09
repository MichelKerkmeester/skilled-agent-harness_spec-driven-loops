//! Every example and every fenced plan the skill ships is compiled and checked.
//! An agent reads them as artifacts in the format it is about to produce.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};

use graphene_check::{check, CapabilityRegistry, Report};
use graphene_cli::plan::{compile, TaskDoc};
use graphene_core::budget::{Budget, Spend};
use graphene_core::fold::State;
use graphene_core::graph::{Graph, GraphState};
use graphene_core::id::GraphId;
use graphene_core::time::{Seq, Timestamp};
use serde_json::Value;

static NEXT: AtomicUsize = AtomicUsize::new(0);

fn skill_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../skill").canonicalize().unwrap()
}

/// Exactly what `nodes.md` tells an agent to register.
fn documented_registry() -> CapabilityRegistry {
    CapabilityRegistry {
        registered: ["read_zendesk", "read_web", "read_crm", "read_logs", "read_repo", "run_tests"]
            .iter()
            .map(|s| s.to_string())
            .collect(),
        gated: Default::default(),
    }
}

fn plan_and_check(body: &str) -> Result<Report, String> {
    let doc: TaskDoc =
        serde_json::from_str(body).map_err(|e| format!("not a task.v1 document: {e}"))?;
    let graph = GraphId::from_seed(&format!("skill-{}", NEXT.fetch_add(1, Ordering::SeqCst)));
    let nodes = compile(&doc, &graph).map_err(|e| e.to_string())?;

    let mut state = State::default();
    state.graph = Some(Graph {
        id: graph.clone(),
        title: doc.goal.clone().unwrap_or_else(|| "skill example".into()),
        description: String::new(),
        task: "skill example".into(),
        state: GraphState::Draft,
        parent: None,
        budget: Budget::UNLIMITED,
        spend: Spend::default(),
        limits: Default::default(),
        tags: vec![],
        created_at: Timestamp(0),
        updated_at: Timestamp(0),
        completed_at: None,
        requested_by: None,
        created_seq: Seq(1),
    });
    for node in nodes {
        state.nodes.insert(node.id.clone(), node);
    }

    Ok(check(&state, &documented_registry().resolve()))
}

fn examples() -> Vec<PathBuf> {
    let mut out: Vec<PathBuf> = std::fs::read_dir(skill_dir().join("examples"))
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "json"))
        .collect();
    out.sort();
    assert!(out.len() >= 7, "the skill ships fewer examples than spec 09 §6 lists");
    out
}

fn codes(findings: &[graphene_check::Finding]) -> Vec<String> {
    findings.iter().map(|f| format!("{:?}: {}", f.code, f.detail)).collect()
}

fn check_file(path: &Path) -> Report {
    let body = std::fs::read_to_string(path).unwrap();
    plan_and_check(&body).unwrap_or_else(|e| panic!("{}: {e}", path.display()))
}

#[test]
fn good_examples_pass_check() {
    for path in examples() {
        let name = path.file_name().unwrap().to_string_lossy().into_owned();
        if name.starts_with("BAD-") {
            continue;
        }
        let report = check_file(&path);
        assert!(report.ok, "{name} does not pass gr check:\n{}", codes(&report.errors).join("\n"));
    }
}

/// Each must fail for the reason the skill says it does, not incidentally.
#[test]
fn bad_examples_fail_with_their_documented_code() {
    use graphene_check::Code;
    let expected =
        [("BAD-fake-edges.json", Code::FakeEdge), ("BAD-monolith.json", Code::UngatedCapability)];

    for (name, want) in expected {
        let path = skill_dir().join("examples").join(name);
        assert!(path.exists(), "{name} is named in the skill but not shipped");
        let report = check_file(&path);
        assert!(!report.ok, "{name} should fail gr check");
        assert!(
            report.errors.iter().any(|f| f.code == want),
            "{name} should fail {want:?}, got:\n{}",
            codes(&report.errors).join("\n")
        );
    }
}

#[test]
fn every_finding_carries_a_fix_hint() {
    for path in examples() {
        let report = check_file(&path);
        for f in report.errors.iter().chain(report.warnings.iter()) {
            assert!(
                !f.fix_hint.is_empty(),
                "{}: {:?} has no fix_hint",
                path.file_name().unwrap().to_string_lossy(),
                f.code
            );
        }
    }
}

#[test]
fn the_review_template_instantiates_and_checks() {
    let path = skill_dir().join("templates/review-subgraph.json");
    let report = check_file(&path);
    assert!(report.ok, "the review template does not check:\n{}", codes(&report.errors).join("\n"));

    let doc: Value = serde_json::from_str(&std::fs::read_to_string(&path).unwrap()).unwrap();
    let nodes = doc["nodes"].as_array().unwrap();
    let lenses: Vec<&str> = nodes.iter().filter_map(|n| n["id"].as_str()).collect();

    for lens in
        ["granularity", "dependency", "gate-placement", "completeness", "stop-rule", "failure"]
    {
        assert!(
            lenses.iter().any(|n| n.contains(lens)),
            "the review template is missing the {lens} lens"
        );
    }

    let merges = nodes.iter().filter(|n| n["job"] == "merge").count();
    assert_eq!(merges, 1, "exactly one merge node owns the findings — that is the stop rule");
}

/// A field name that has drifted from `plan.rs` teaches a plan that will not
/// compile, and nothing else in the suite would notice.
#[test]
fn every_task_document_in_the_prose_compiles() {
    let dir = skill_dir();
    let mut files = vec![dir.join("SKILL.md")];
    let mut refs: Vec<PathBuf> = std::fs::read_dir(dir.join("references"))
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "md"))
        .collect();
    refs.sort();
    files.append(&mut refs);

    let mut checked = 0;
    for file in files {
        let body = std::fs::read_to_string(&file).unwrap();
        let name = file.file_name().unwrap().to_string_lossy().into_owned();
        for (line, block) in json_blocks(&body) {
            let Ok(doc) = serde_json::from_str::<Value>(&block) else {
                panic!("{name}:{line}: fenced json block does not parse");
            };
            if doc["graph"] != "task.v1" {
                continue;
            }
            let report = plan_and_check(&block).unwrap_or_else(|e| panic!("{name}:{line}: {e}"));
            let fatal: Vec<String> = report
                .errors
                .iter()
                .filter(|f| f.code != graphene_check::Code::OrphanNode)
                .map(|f| format!("{:?}: {}", f.code, f.detail))
                .collect();
            assert!(
                fatal.is_empty(),
                "{name}:{line}: the documented task.v1 does not compile:\n{}",
                fatal.join("\n")
            );
            checked += 1;
        }
    }

    assert!(checked >= 2, "no task.v1 blocks were found in the prose — the extractor is broken");
}

fn json_blocks(body: &str) -> Vec<(usize, String)> {
    let mut out = vec![];
    let mut current: Option<(usize, String)> = None;
    for (i, line) in body.lines().enumerate() {
        match &mut current {
            Some((_, acc)) => {
                if line.trim_start().starts_with("```") {
                    out.push(current.take().unwrap());
                } else {
                    acc.push_str(line);
                    acc.push('\n');
                }
            }
            None => {
                if line.trim() == "```json" {
                    current = Some((i + 1, String::new()));
                }
            }
        }
    }
    out
}

/// The tests above call the library directly; this proves the verbs still reach
/// it.
#[test]
fn the_binary_plans_and_checks_a_shipped_example() {
    let dir = std::env::temp_dir().join(format!(
        "graphene-skill-e2e-{}-{}",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::SeqCst)
    ));
    std::fs::create_dir_all(&dir).unwrap();
    let store = dir.join("store.db");

    let run = |args: &[&str]| -> (i32, Value) {
        let out = std::process::Command::new(env!("CARGO_BIN_EXE_gr"))
            .arg("--store")
            .arg(&store)
            .args(args)
            .output()
            .expect("gr");
        let stdout = String::from_utf8_lossy(&out.stdout).into_owned();
        let value: Value = serde_json::from_str(&stdout).unwrap_or_else(|e| {
            panic!(
                "gr {args:?} did not emit JSON ({e})\n{stdout}\n{}",
                String::from_utf8_lossy(&out.stderr)
            )
        });
        (out.status.code().unwrap_or(-1), value)
    };

    let (_, caps) = run(&["capabilities", "--register", "read_web"]);
    assert!(caps["registered"].as_array().unwrap().iter().any(|c| c == "read_web"));

    let (_, new) = run(&["new", "--task", "skill example"]);
    let graph = new["graph"].as_str().unwrap().to_string();

    let example = skill_dir().join("examples/research-competitors.json");
    let (code, planned) = run(&["plan", &graph, "--file", example.to_str().unwrap()]);
    assert_eq!(code, 0, "{planned}");
    assert!(!planned["nodes"].as_array().unwrap().is_empty());

    let (code, report) = run(&["check", &graph]);
    assert_eq!(code, 0, "the binary rejects a shipped example: {report}");
    assert_eq!(report["ok"], Value::Bool(true));
}
