use serde_json::{Value, json};
use std::{collections::BTreeSet, process::ExitCode};
use supercov_engine::{
    agent_json, assertion_store as maps,
    run_store::{discover_runs, select_run},
};

const HELP: &str = r#"Usage: supercov runs <run> assertions [options]
       supercov runs <run> assertion <id> [--offset <n>] [--limit <n>] [--json]
       supercov runs <run> source <path> [--offset <n>] [--limit <n>] [--json]
       supercov runs <run> assertions <action> [options]

assertions                  List assertions, including sites without flows, with freshness and execution status.
assertion <id>              Read one assertion, its flows and per-node credit reasons.
source <path>               Read matching current project source with line numbers.

Assertion actions:
validate                    Check syntax/references; return expectedBasis tokens without changing files.
  --view flows|changes|errors Page validation output for large maps (default: all).
files                       List run input paths, byte sizes and SHA-256 hashes.
report [--view <view>]      summary (default), assertions, statements, tests,
                            creditedLines, unassertedLines, excludedStatements, changes.
check                       Fail on invalid references, dirty flows, failed run,
                            pending change impact assessment or a stale/unavailable working tree.
  --require-mappings        Require a current explanation for each observed recognized site.
  --require-observed        Also require passing runtime evidence for every mapped site/flow.
  --min <0..100>             Minimum agent-assessed statement percentage.

--needs-attention           List assertions with no flows, stale/draft flows, open questions or uncredited claims.
--file <path>[,<path>...]   Filter assertion lists or statement/line report views.
--id <id>[,<id>...]         Only these assertions or statements (report --view assertions|statements).
--compact                   List views without source text, with test lists as counts.
--offset <n> --limit <n>     Page lists, assertion flows or source (zero-based offset, limit 1..1000).
--json                      Structured output for integrations; source uses {line, text} items.
                            Large JSON pages may return fewer items; follow pagination.nextOffset.

supercov assertions schema [--json]               Export the JSON Schema.
supercov assertions validate --file <path> [--json] Check JSON shape without a run.

Each new test run creates assertions.json and reuses the newest available map
for the same command and language. Edit the file, validate, copy examined expectedBasis tokens into it, then check.
Exit 0 means the requested check passed; exit 2 means invalid input or an unmet gate.
Pin a run ID while authoring. See docs/assertion-maps.md and docs/assertion-agent.md.
Supercov never authors semantic edges. MC/DC remains separate.
"#;
const SOURCE_HELP: &str = "Usage: supercov runs <run> source <path> [--offset <n>] [--limit <n>] [--json]\n\nRead the current project file after verifying it matches the run. The path is project-relative.\n--offset is zero-based; --limit defaults to 20 (1..1000). --json returns line/text items.\nUse runs <run> assertions files to list run input paths.\n";
const ASSERTION_HELP: &str = "Usage: supercov runs <run> assertion <id> [--offset <n>] [--limit <n>] [--json]\n\nRead one assertion and its authored flows, flow freshness and passing execution evidence.\nEach node shows Credited, Not credited, or Context only, with computed credit reasons.\n--offset pages flows (zero-based); --limit defaults to 20 (1..1000).\nLarge JSON pages may return fewer flows; follow pagination.nextOffset.\n--flow <id> --view nodes|edges pages inside one large flow (default: nodes).\n--compact omits source text from report anchors, preserving locations and byte/line counts. Read source with runs <run> source <path>. The editable map is unchanged.\nUse runs <run> assertions to list IDs.\n";
struct Options {
    action: String,
    require_mappings: bool,
    require_observed: bool,
    minimum: Option<f64>,
    file: Option<String>,
    view: String,
    needs_attention: bool,
    ids: Option<BTreeSet<String>>,
    compact: bool,
    offset: usize,
    limit: usize,
}
fn parse(args: &[String]) -> Result<Options, String> {
    let mut o = Options {
        action: "report".into(),
        require_mappings: false,
        require_observed: false,
        minimum: None,
        file: None,
        view: "assertions".into(),
        needs_attention: false,
        ids: None,
        compact: false,
        offset: 0,
        limit: 20,
    };
    let mut args = args.iter().peekable();
    if args.peek().is_some_and(|a| !a.starts_with('-')) {
        o.action = args.next().unwrap().clone();
        o.view = "summary".into();
    }
    let mut seen = BTreeSet::new();
    while let Some(arg) = args.next() {
        if !seen.insert(arg.as_str()) {
            return Err(format!("Duplicate option: {arg}"));
        }
        match arg.as_str() {
            "--json" => (),
            "--needs-attention" => o.needs_attention = true,
            "--compact" => o.compact = true,
            "--require-mappings" => o.require_mappings = true,
            "--require-observed" => o.require_observed = true,
            "--archived" => return Err("--archived is removed: assertion analysis requires current files matching the run; rerun tests to inherit previous mappings".into()),
            "--file" | "--id" | "--view" | "--offset" | "--limit" | "--min" => {
                let value = args
                    .next()
                    .filter(|v| !v.starts_with('-'))
                    .ok_or_else(|| format!("{arg} requires a value"))?;
                match arg.as_str() {
                    "--min" => o.minimum = Some(value.parse().map_err(|_| "Invalid minimum")?),
                    "--file" => o.file = Some(value.clone()),
                    "--id" => {
                        o.ids = Some(
                            value
                                .split(',')
                                .map(str::trim)
                                .filter(|id| !id.is_empty())
                                .map(str::to_owned)
                                .collect(),
                        );
                    }
                    "--view" => o.view = value.clone(),
                    "--offset" => o.offset = value.parse().map_err(|_| "Invalid offset")?,
                    "--limit" => o.limit = value.parse().map_err(|_| "Invalid limit")?,
                    _ => unreachable!(),
                }
            }
            _ => return Err(format!("Unknown option: {arg}")),
        }
    }
    if !matches!(o.action.as_str(), "report" | "validate" | "check" | "files") {
        return Err(match o.action.as_str() {
            "review" => "The review command is removed: edit assertions.json and copy expectedBasis from assertions validate after examining the claims".into(),
            "inventory" => {
                "Use runs <run> assertions to list all assertion sites and their status".into()
            }
            "source" => "Use runs <run> source <path> to read matching current source".into(),
            _ => "Unknown assertions action".into(),
        });
    }
    if o.minimum
        .is_some_and(|n| !n.is_finite() || !(0.0..=100.0).contains(&n))
    {
        return Err("min must be a finite percentage from 0 to 100".into());
    }
    if o.limit == 0 || o.limit > 1000 {
        return Err("limit must be 1..1000".into());
    }
    for (flag, valid) in [
        ("--min", o.action == "check"),
        ("--require-mappings", o.action == "check"),
        ("--require-observed", o.action == "check"),
        (
            "--needs-attention",
            o.action == "report" && o.view == "assertions",
        ),
        (
            "--file",
            o.action == "report"
                && matches!(
                    o.view.as_str(),
                    "assertions"
                        | "statements"
                        | "creditedLines"
                        | "unassertedLines"
                        | "excludedStatements"
                ),
        ),
        (
            "--id",
            o.action == "report" && matches!(o.view.as_str(), "assertions" | "statements"),
        ),
        ("--compact", o.action == "report" && o.view != "summary"),
        ("--view", matches!(o.action.as_str(), "report" | "validate")),
    ] {
        if seen.contains(flag) && !valid {
            return Err(format!("{flag} is not valid for {}", o.action));
        }
    }
    if (seen.contains("--offset") || seen.contains("--limit"))
        && !(matches!(o.action.as_str(), "report" | "files")
            || o.action == "validate" && o.view != "summary")
    {
        return Err(
            "Pagination requires a list, files, or validate --view flows|changes|errors".into(),
        );
    }
    let view_valid = if o.action == "validate" {
        matches!(o.view.as_str(), "summary" | "flows" | "changes" | "errors")
    } else {
        matches!(
            o.view.as_str(),
            "summary"
                | "assertions"
                | "statements"
                | "tests"
                | "creditedLines"
                | "unassertedLines"
                | "changes"
                | "excludedStatements"
        )
    };
    if !view_valid {
        return Err("Unknown view for this action".into());
    }
    if o.action == "report"
        && o.view == "summary"
        && (seen.contains("--offset") || seen.contains("--limit"))
    {
        return Err("Pagination requires an array view, not summary".into());
    }
    Ok(o)
}
fn needs_attention(row: &Value) -> bool {
    row["questions"].as_array().is_some_and(|q| !q.is_empty())
        || row["flows"].as_array().is_none_or(|flows| {
            flows.is_empty()
                || flows.iter().any(|f| {
                    f["current"] != true
                        || f["eligible"] != true
                        || f["nodeCredit"]
                            .as_array()
                            .is_some_and(|nodes| nodes.iter().any(|n| n["status"] == "notCredited"))
                })
        })
}
fn page(values: &[Value], offset: usize, limit: usize) -> Value {
    let items = values
        .iter()
        .skip(offset)
        .take(limit)
        .cloned()
        .collect::<Vec<_>>();
    let next = offset.saturating_add(items.len());
    json!({"items":items,"pagination":{"offset":offset,"returned":items.len(),"total":values.len(),"nextOffset":if next<values.len(){Some(next)}else{None}}})
}
pub fn command(args: &[String]) -> ExitCode {
    if matches!(
        args.get(1).map(String::as_str),
        Some("source" | "assertion")
    ) {
        return inspection_command(args);
    }
    if args.iter().any(|a| matches!(a.as_str(), "--help" | "-h")) {
        print!("{HELP}");
        return ExitCode::SUCCESS;
    }
    let result = (|| -> Result<Value, String> {
        let o = parse(&args[2..])?;
        let root = std::env::current_dir().map_err(|e| e.to_string())?;
        let inventory = discover_runs(&root).map_err(|e| e.to_string())?;
        let run = select_run(&inventory, Some(&args[0])).map_err(|e| e.to_string())?;
        let working_tree = working_tree(&root, run);
        if o.action != "files" {
            require_current(&working_tree)?;
        }
        let mut check_report = None;
        let mut data = match o.action.as_str() {
            "files" => {
                let input = maps::load_manifest(run)?;
                let values = input
                    .manifest
                    .files
                    .iter()
                    .map(|(file, fingerprint)| json!({"file":file,"bytes":fingerprint.bytes,"sha256":fingerprint.sha256}))
                    .collect::<Vec<_>>();
                let mut data = page(&values, o.offset, o.limit);
                data["revision"] = json!(input.evidence_digest);
                data["view"] = json!("files");
                data
            }
            "validate" => {
                let input = maps::load_inputs(&root, run)?;
                let bytes =
                    std::fs::read(run.directory.join(maps::MAP_FILE)).map_err(|e| e.to_string())?;
                match supercov_engine::assertion_map::parse(&bytes) {
                    Err(error) => json!({"valid":false,"stage":"syntax","errors":[error]}),
                    Ok(_) => {
                        let (map, state) = maps::load(run, &input)?;
                        let mut data =
                            supercov_engine::assertion_map::validation(&map, &state, &input.inputs);
                        data["revision"] = json!(supercov_engine::assertion_map::digest(&(
                            &map,
                            &state,
                            &input.evidence_digest
                        )));
                        if o.view != "summary" {
                            let mut paged =
                                page(data[&o.view].as_array().unwrap(), o.offset, o.limit);
                            for key in ["valid", "stage", "meaning", "revision"] {
                                paged[key] = data[key].clone();
                            }
                            paged["view"] = json!(o.view);
                            paged["errorCount"] = json!(data["errors"].as_array().unwrap().len());
                            paged
                        } else {
                            data
                        }
                    }
                }
            }
            _ => {
                let report = maps::report(&root, run)?;
                let mut data = if o.view == "summary" {
                    json!({})
                } else {
                    let values = report[&o.view]
                        .as_array()
                        .unwrap()
                        .iter()
                        .filter(|row| {
                            // Several files at once, comma-separated: an author
                            // mapping a change reads the files it touches in
                            // one call rather than one call per file.
                            o.file.as_ref().is_none_or(|files| {
                                let file =
                                    row["file"].as_str().or_else(|| row["at"]["file"].as_str());
                                files.split(',').map(str::trim).any(|f| Some(f) == file)
                            })
                        })
                        .filter(|row| {
                            o.ids.as_ref().is_none_or(|ids| {
                                row["id"].as_str().is_some_and(|id| ids.contains(id))
                            })
                        })
                        .filter(|row| !o.needs_attention || needs_attention(row))
                        .cloned()
                        .collect::<Vec<_>>();
                    let mut paged = page(&values, o.offset, o.limit);
                    if o.compact {
                        compact_anchors(&mut paged["items"]);
                        compact_test_lists(&mut paged["items"]);
                        paged["compact"] = json!(true);
                    }
                    paged
                };
                for key in [
                    "summary",
                    "basis",
                    "validationErrors",
                    "limitations",
                    "revision",
                    "inheritance",
                ] {
                    data[key] = report[key].clone();
                }
                data["view"] = json!(o.view);
                data["file"] = json!(o.file);
                // Whether anything in the run asks for work, whatever this
                // page shows. It used to echo the --needs-attention filter, so
                // a map whose check failed on four open questions read
                // `needsAttention: false`.
                let attention = report["assertions"].as_array().map_or(0, |rows| {
                    rows.iter().filter(|row| needs_attention(row)).count()
                });
                data["attention"] = json!({ "assertions": attention });
                data["needsAttention"] = json!(
                    attention > 0
                        || report["summary"]["pendingChanges"].as_u64().unwrap_or(0) > 0
                        || report["validationErrors"]
                            .as_array()
                            .is_none_or(|e| !e.is_empty())
                );
                data["filters"] = json!({
                    "file": o.file,
                    "ids": o.ids,
                    "needsAttention": o.needs_attention,
                    "compact": o.compact,
                });
                data["scope"] = json!(
                    "summary covers the whole run with matching current source; --file filters items only"
                );
                if o.action == "check" {
                    check_report = Some(report);
                }
                data
            }
        };
        data["workingTree"] = working_tree;
        if let Some(report) = check_report {
            let failures = check_failures(&report, &data["workingTree"], &o);
            data["valid"] = json!(failures.is_empty());
            data["failures"] = json!(failures);
            data["requirements"] = json!({"mappings":o.require_mappings,"observed":o.require_observed,"minimum":o.minimum});
        }
        data["run"] = json!(run.id);
        data["map"] = json!(run.directory.join(maps::MAP_FILE));
        Ok(data)
    })();
    emit(
        result,
        args.iter().any(|a| a == "--json"),
        "coverage.assertions",
    )
}
fn require_current(tree: &Value) -> Result<(), String> {
    if tree["stale"] != false {
        return Err("Current checkout differs from the run or cannot be verified; rerun tests to inherit the assertion map for current files".into());
    }
    Ok(())
}
fn working_tree(root: &std::path::Path, run: &supercov_engine::run_store::StoredRun) -> Value {
    match super::current_integrity_for_run(root, run) {
        Some(current) => {
            let comparison = supercov_engine::run_store::compare_run_integrity(
                Some(&run.metadata.integrity),
                &current,
            );
            json!({"stale":comparison.stale,"reasons":comparison.reasons})
        }
        None => json!({"stale":null,"reason":"current source integrity unavailable"}),
    }
}

struct Inspection {
    selector: String,
    flow: Option<String>,
    view: Option<String>,
    compact: bool,
    offset: usize,
    limit: usize,
}
fn parse_inspection(args: &[String], source: bool) -> Result<Inspection, String> {
    let (selector, flags) = args
        .split_first()
        .filter(|(s, _)| !s.starts_with('-'))
        .ok_or(if source {
            "source requires a project-relative path"
        } else {
            "assertion requires an ID"
        })?;
    let mut o = Inspection {
        selector: selector.clone(),
        flow: None,
        view: None,
        compact: false,
        offset: 0,
        limit: 20,
    };
    let mut flags = flags.iter();
    let mut seen = BTreeSet::new();
    while let Some(flag) = flags.next() {
        if !seen.insert(flag) {
            return Err(format!("Duplicate option: {flag}"));
        }
        match flag.as_str() {
            "--json" => (),
            "--compact" if !source => o.compact = true,
            "--flow" | "--view" if !source => {
                let value = flags
                    .next()
                    .filter(|v| !v.starts_with('-'))
                    .ok_or_else(|| format!("{flag} requires a value"))?;
                if flag == "--flow" {
                    o.flow = Some(value.clone());
                } else {
                    o.view = Some(value.clone());
                }
            }
            "--offset" | "--limit" => {
                let value = flags
                    .next()
                    .ok_or_else(|| format!("{flag} requires a value"))?
                    .parse::<usize>()
                    .map_err(|_| format!("Invalid {flag}"))?;
                if flag == "--offset" {
                    o.offset = value;
                } else {
                    o.limit = value;
                }
            }
            _ => return Err(format!("Unexpected argument: {flag}")),
        }
    }
    if o.limit == 0 || o.limit > 1000 {
        return Err("limit must be 1..1000".into());
    }
    if o.view.is_some()
        && (o.flow.is_none() || !matches!(o.view.as_deref(), Some("nodes" | "edges")))
    {
        return Err("--view nodes|edges requires --flow <id>".into());
    }
    Ok(o)
}

/// Test lists as counts. A statement run by four hundred tests carried four
/// hundred IDs in every row of an authoring inventory; the counts say whether
/// and how widely it ran, and `runs <run> line <file:line>` names the tests.
fn compact_test_lists(value: &mut Value) {
    match value {
        Value::Object(object) => {
            for key in ["tests", "passingTests", "outsidePassingTests"] {
                if let Some(Value::Array(tests)) = object.get(key) {
                    let count = tests.len();
                    object.remove(key);
                    object.insert(format!("{key}Count"), json!(count));
                }
            }
            for child in object.values_mut() {
                compact_test_lists(child);
            }
        }
        Value::Array(items) => {
            for item in items {
                compact_test_lists(item);
            }
        }
        _ => {}
    }
}

fn compact_anchors(value: &mut Value) {
    match value {
        Value::Object(object) => {
            if let Some(at) = object.get_mut("at").and_then(Value::as_object_mut)
                && let Some(Value::String(source)) = at.remove("text")
            {
                at.insert("textOmitted".into(), json!(true));
                at.insert("textBytes".into(), json!(source.len()));
                at.insert("sourceLines".into(), json!(source.lines().count()));
            }
            for child in object.values_mut() {
                compact_anchors(child);
            }
        }
        Value::Array(items) => {
            for item in items {
                compact_anchors(item);
            }
        }
        _ => {}
    }
}

fn inspection_command(args: &[String]) -> ExitCode {
    let source = args[1] == "source";
    if args.iter().any(|a| matches!(a.as_str(), "--help" | "-h")) {
        print!("{}", if source { SOURCE_HELP } else { ASSERTION_HELP });
        return ExitCode::SUCCESS;
    }
    let result = (|| -> Result<Value, String> {
        let o = parse_inspection(&args[2..], source)?;
        let root = std::env::current_dir().map_err(|e| e.to_string())?;
        let runs = discover_runs(&root).map_err(|e| e.to_string())?;
        let run = select_run(&runs, Some(&args[0])).map_err(|e| e.to_string())?;
        let working_tree = working_tree(&root, run);
        require_current(&working_tree)?;
        let mut data = if source {
            let input = maps::load_inputs(&root, run)?;
            let text =
                input.inputs.files.get(&o.selector).ok_or_else(|| {
                    format!("File absent from run input manifest: {}", o.selector)
                })?;
            let lines = text
                .lines()
                .enumerate()
                .map(|(i, text)| json!({"line":i+1,"text":text}))
                .collect::<Vec<_>>();
            let mut data = page(&lines, o.offset, o.limit);
            data["file"] = json!(o.selector);
            data["revision"] = json!(input.evidence_digest);
            data["view"] = json!("source");
            data
        } else {
            let report = maps::assertion(&root, run, &o.selector)?;
            let mut data = json!({"view":"assertion", "assertion":report["assertion"],
                "map":run.directory.join(maps::MAP_FILE)});
            let flows = page(
                report["assertion"]["flows"].as_array().unwrap(),
                o.offset,
                o.limit,
            );
            data["assertion"]["flows"] = flows["items"].clone();
            data["pagination"] = flows["pagination"].clone();
            if let Some(flow_id) = &o.flow {
                let flow = report["assertion"]["flows"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .find(|f| f["id"] == flow_id.as_str())
                    .ok_or_else(|| format!("Unknown flow: {flow_id}"))?;
                let view = o.view.as_deref().unwrap_or("nodes");
                let mut values = flow[view].as_array().unwrap().clone();
                if view == "nodes" {
                    for node in &mut values {
                        node["credit"] = flow["nodeCredit"]
                            .as_array()
                            .unwrap()
                            .iter()
                            .find(|c| c["nodeId"] == node["id"])
                            .cloned()
                            .unwrap_or(Value::Null);
                    }
                }
                let paged = page(&values, o.offset, o.limit);
                data["items"] = paged["items"].clone();
                data["pagination"] = paged["pagination"].clone();
                data["view"] = json!("assertionFlow");
                data["flowView"] = json!(view);
                let mut metadata = flow.clone();
                for key in ["nodes", "edges", "nodeCredit", "countsAsAsserted"] {
                    metadata.as_object_mut().unwrap().remove(key);
                }
                metadata["nodeCount"] = json!(flow["nodes"].as_array().unwrap().len());
                metadata["edgeCount"] = json!(flow["edges"].as_array().unwrap().len());
                data["flow"] = metadata;
                data["assertion"]["flows"] = json!([]);
            }
            if o.compact {
                compact_anchors(&mut data);
                data["compact"] = json!(true);
            }

            for key in [
                "summary",
                "basis",
                "validationErrors",
                "limitations",
                "revision",
                "inheritance",
            ] {
                data[key] = report[key].clone();
            }
            let witnessed = report["assertion"]["observedPassingTests"]
                .as_array()
                .unwrap();
            data["tests"] = json!(
                report["tests"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .filter(|test| witnessed.contains(&test["id"]))
                    .collect::<Vec<_>>()
            );
            data
        };
        data["run"] = json!(run.id);
        data["workingTree"] = working_tree;
        Ok(data)
    })();
    emit(
        result,
        args.iter().any(|a| a == "--json"),
        if source {
            "coverage.source"
        } else {
            "coverage.assertion"
        },
    )
}
fn paginated_json(command: &str, mut data: Value) -> Result<String, agent_json::ResponseTooLarge> {
    loop {
        let size = match agent_json::success(command, &data, None) {
            Ok(output) => return Ok(output),
            Err(size) => size,
        };
        let Some(offset) = data["pagination"]["offset"].as_u64() else {
            return Err(size);
        };
        let Some(total) = data["pagination"]["total"].as_u64() else {
            return Err(size);
        };
        let path = if data["view"] == "assertion" {
            "/assertion/flows"
        } else {
            "/items"
        };
        let Some(items) = data.pointer_mut(path).and_then(Value::as_array_mut) else {
            return Err(size);
        };
        if items.len() <= 1 {
            return Err(size);
        }
        // Reduce only the page size. Each returned flow and its source anchors
        // stay intact; nextOffset lets callers retrieve everything omitted.
        let returned = items.len() / 2;
        items.truncate(returned);
        let next = offset.saturating_add(returned as u64);
        data["pagination"]["returned"] = json!(returned);
        data["pagination"]["nextOffset"] = json!(if next < total { Some(next) } else { None });
    }
}
fn emit(result: Result<Value, String>, json_output: bool, command: &str) -> ExitCode {
    match result {
        Ok(data) => {
            let invalid = data.get("valid") == Some(&Value::Bool(false));
            if json_output {
                match paginated_json(command, data) {
                    Ok(output) => print!("{output}"),
                    Err(size) => {
                        print!("{}",agent_json::failure(Some(command), &agent_json::AgentError {
                            code:agent_json::ErrorCode::ResponseTooLarge,
                            message:"Response too large; reduce --limit or use the text view (omit --json)".into(),
                            retryable:false,details:Some(json!({"actualBytes":size.actual_bytes,"maxBytes":size.max_bytes})),
                        }));
                        return ExitCode::from(2);
                    }
                }
            } else if let Some(output) = super::assertions_human::render(&data) {
                print!("{output}");
            } else {
                println!("{}", serde_json::to_string_pretty(&data).unwrap());
            }
            if invalid {
                ExitCode::from(2)
            } else {
                ExitCode::SUCCESS
            }
        }
        Err(message) => {
            if json_output {
                print!(
                    "{}",
                    agent_json::failure(
                        Some(command),
                        &agent_json::AgentError {
                            code: agent_json::ErrorCode::InvalidArgument,
                            message,
                            retryable: false,
                            details: None
                        }
                    )
                );
            } else {
                eprintln!("[supercov] {message}");
            }
            ExitCode::from(2)
        }
    }
}

fn check_failures(report: &Value, working_tree: &Value, o: &Options) -> Vec<String> {
    let s = &report["summary"];
    let mut failures = Vec::new();
    if report["validationErrors"]
        .as_array()
        .is_none_or(|a| !a.is_empty())
    {
        failures.push("Map has invalid references".into());
    }
    if s["runPassed"] != true {
        failures.push("Run did not pass".into());
    }
    if ["draftFlows", "staleFlows", "invalidFlows", "questions"]
        .iter()
        .any(|key| s[key].as_u64().unwrap_or(0) != 0)
    {
        failures.push("Flows or questions need investigation or reference repair".into());
    }
    if s["pendingChanges"].as_u64().unwrap_or(0) != 0 {
        failures.push("Source changes require impact assessment".into());
    }
    if working_tree["stale"] != false {
        failures.push(
            "Working tree is stale or its integrity is unavailable; rerun tests to refresh the map automatically"
                .into(),
        );
    }
    if o.require_mappings
        && (s["observedAssertionsWithoutCurrentExplanation"].as_u64() != Some(0)
            || s["inventoryFailures"].as_u64() != Some(0))
    {
        failures.push(
            "Observed recognized assertions lack current explanations, or assertion discovery failed".into(),
        );
    }
    if o.require_observed
        && (s["unobservedAssertions"].as_u64() != Some(0)
            || report["assertions"].as_array().is_none_or(|rows| {
                rows.iter().any(|a| {
                    a["flows"].as_array().is_none_or(|flows| {
                        flows.iter().any(|f| {
                            f["selectors"].as_array().is_none_or(|v| {
                                v.is_empty() || v.iter().any(|s| s["status"] != "observed")
                            })
                        })
                    })
                })
            }))
    {
        failures.push("Assertions or appliesTo flows lack matching passing runtime evidence; inspect runs <run> assertions".into());
    }
    if let Some(minimum) = o.minimum
        && s["statements"]["percentage"]
            .as_f64()
            .is_none_or(|n| n < minimum)
    {
        failures.push(format!(
            "Statement assertion coverage is below {minimum}% or is not available"
        ));
    }
    failures
}

pub fn global_command(args: &[String]) -> ExitCode {
    if args.is_empty() || args.iter().any(|a| matches!(a.as_str(), "--help" | "-h")) {
        print!("{HELP}");
        return ExitCode::SUCCESS;
    }
    let json_output = args.iter().any(|a| a == "--json");
    let args = args
        .iter()
        .filter(|a| a.as_str() != "--json")
        .map(String::as_str)
        .collect::<Vec<_>>();
    let result = match args.as_slice() {
        ["schema"] => Ok(supercov_engine::assertion_map::schema()),
        ["validate", "--file", file] => std::fs::read(file).map_err(|e| format!("{file}: {e}")).map(|bytes| {
            match supercov_engine::assertion_map::parse(&bytes) {
                Ok(_) => json!({"valid":true,"stage":"syntax","errors":[],"meaning":"JSON shape only; use runs <run> assertions validate for IDs, links and current source references"}),
                Err(error) => json!({"valid":false,"stage":"syntax","errors":[error]}),
            }
        }),
        _ => Err("Use assertions schema or assertions validate --file <path>; run-owned commands need runs <run> assertions".into()),
    };
    emit(result, json_output, "coverage.assertions")
}

#[cfg(test)]
mod tests {
    #[test]
    fn an_authoring_inventory_selects_files_and_ids_and_compacts_rows() {
        let args: Vec<String> = [
            "report",
            "--view",
            "statements",
            "--file",
            "src/a.ts,src/b.ts",
            "--id",
            "s1, s2",
            "--compact",
        ]
        .into_iter()
        .map(String::from)
        .collect();
        let options = super::parse(&args).unwrap();
        assert!(options.compact);
        assert_eq!(
            options.ids.unwrap(),
            ["s1", "s2"].into_iter().map(String::from).collect()
        );
        // Compacting is for list views; a summary has no rows to compact.
        assert!(super::parse(&["report".into(), "--compact".into()]).is_err());
        assert!(super::parse(&["check".into(), "--id".into(), "s1".into()]).is_err());

        let mut rows = serde_json::json!([{
            "id": "s1",
            "at": {"file": "src/a.ts", "line": 1, "column": 1, "text": "return (\n  1\n);"},
            "tests": ["t1", "t2", "t3"],
            "executionEvidence": {"passingTests": ["t1"], "outsidePassingTests": []},
        }]);
        super::compact_anchors(&mut rows);
        super::compact_test_lists(&mut rows);
        let row = &rows[0];
        assert_eq!(row["at"]["textOmitted"], true);
        assert_eq!(row["at"]["sourceLines"], 3);
        assert_eq!(row["testsCount"], 3);
        assert_eq!(row["executionEvidence"]["passingTestsCount"], 1);
        assert!(row.get("tests").is_none());
    }

    #[test]
    fn large_flow_can_be_paged_and_compacted_without_changing_the_map() {
        let options = parse_inspection(
            &[
                "a_id".into(),
                "--flow".into(),
                "route".into(),
                "--view".into(),
                "nodes".into(),
                "--compact".into(),
                "--offset".into(),
                "2".into(),
            ],
            false,
        )
        .unwrap();
        assert_eq!(options.flow.as_deref(), Some("route"));
        assert_eq!(options.view.as_deref(), Some("nodes"));
        assert!(options.compact);
        let original = json!({"id":"node", "at":{"file":"src.ts","line":5,"column":2,"text":"é\nvalue"}, "meaning":"checked value"});
        let mut projected = original.clone();
        compact_anchors(&mut projected);
        assert_eq!(projected["at"]["textBytes"], 8);
        assert_eq!(projected["at"]["sourceLines"], 2);
        assert_eq!(projected["at"]["textOmitted"], true);
        assert!(projected["at"].get("text").is_none());
        assert_eq!(original["at"]["text"], "é\nvalue");
        assert_eq!(projected["meaning"], original["meaning"]);
        assert!(parse_inspection(&["a".into(), "--view".into(), "nodes".into()], false).is_err());
        assert!(parse_inspection(&["file".into(), "--compact".into()], true).is_err());
    }
    #[test]
    fn current_flows_with_uncredited_claims_need_attention_but_context_does_not() {
        let mut row = serde_json::json!({"questions":[],"flows":[{
            "current":true,"eligible":true,"nodeCredit":[{"status":"credited"},{"status":"context"}]
        }]});
        assert!(!super::needs_attention(&row));
        row["flows"][0]["nodeCredit"][0]["status"] = serde_json::json!("notCredited");
        assert!(super::needs_attention(&row));
    }

    use super::*;
    #[test]
    fn rejects_ignored_or_ambiguous_options() {
        for args in [
            vec!["review"],
            vec!["report", "--from", "old"],
            vec!["init"],
            vec!["review", "--all", "--flow", "a/f"],
            vec!["source"],
            vec!["report", "--limit", "0"],
            vec!["report", "--limit", "20"],
            vec!["validate", "--min", "50"],
            vec!["review", "--require-mappings"],
            vec!["check", "--min", "NaN"],
            vec!["check", "--min", "101"],
        ] {
            assert!(parse(&args.iter().map(|s| s.to_string()).collect::<Vec<_>>()).is_err());
        }
    }

    #[test]
    fn defaults_to_assertion_list_and_keeps_explicit_summary() {
        assert_eq!(parse(&[]).unwrap().view, "assertions");
        assert_eq!(parse(&["report".into()]).unwrap().view, "summary");
        assert!(
            parse(&[
                "--file".into(),
                "tests/a.ts".into(),
                "--limit".into(),
                "2".into()
            ])
            .is_ok()
        );
    }

    #[test]
    fn positional_resources_reject_ignored_flags_and_invalid_paging() {
        for (source, args) in [
            (true, vec![]),
            (false, vec![]),
            (true, vec!["a.ts", "--file", "b.ts"]),
            (true, vec!["a.ts", "--limit", "0"]),
            (true, vec!["a.ts", "--offset", "-1"]),
            (true, vec!["a.ts", "--limit", "1001"]),
            (true, vec!["a.ts", "--offset"]),
            (true, vec!["a.ts", "--json", "--json"]),
            (true, vec!["a.ts", "b.ts"]),
            (false, vec!["a_id", "--limit", "0"]),
            (false, vec!["a_id", "--offset", "-1"]),
            (false, vec!["a_id", "--view", "summary"]),
        ] {
            assert!(
                parse_inspection(
                    &args.iter().map(|s| s.to_string()).collect::<Vec<_>>(),
                    source
                )
                .is_err()
            );
        }
        let source = parse_inspection(
            &[
                "tests/a b.ts".into(),
                "--offset".into(),
                "33".into(),
                "--limit".into(),
                "4".into(),
            ],
            true,
        )
        .unwrap();
        assert_eq!(source.selector, "tests/a b.ts");
        assert_eq!((source.offset, source.limit), (33, 4));
        assert!(parse_inspection(&["a_id".into(), "--json".into()], false).is_ok());
        let assertion = parse_inspection(
            &[
                "a_id".into(),
                "--offset".into(),
                "1".into(),
                "--limit".into(),
                "2".into(),
            ],
            false,
        )
        .unwrap();
        assert_eq!((assertion.offset, assertion.limit), (1, 2));
    }

    #[test]
    fn large_json_pages_preserve_complete_items_and_a_resumable_cursor() {
        for (view, path) in [("assertion", "/assertion/flows"), ("assertions", "/items")] {
            let items = (0..4)
                .map(|id| json!({"id":id,"text":"x".repeat(30_000)}))
                .collect::<Vec<_>>();
            let mut data = json!({"view":view,"assertion":{"id":"a","flows":[]},"items":[],
                "summary":{"statements":{"asserted":86}},
                "pagination":{"offset":4,"returned":4,"total":8,"nextOffset":null}});
            *data.pointer_mut(path).unwrap() = json!(items);
            let output: Value =
                serde_json::from_str(&paginated_json("coverage.assertions", data.clone()).unwrap())
                    .unwrap();
            let actual = &output["data"];
            assert_eq!(actual.pointer(path).unwrap(), &json!(&items[..2]));
            assert_eq!(
                actual["pagination"],
                json!({"offset":4,"returned":2,"total":8,"nextOffset":6})
            );
            assert_eq!(actual["summary"], data["summary"]);
            // A single oversize flow must fail rather than silently truncate its graph.
            *data.pointer_mut(path).unwrap() = json!([{"text":"x".repeat(70_000)}]);
            assert!(paginated_json("coverage.assertions", data).is_err());
        }
    }

    #[test]
    fn checks_require_requested_mappings_evidence_and_current_checkout() {
        let mut report = json!({"validationErrors":[],"assertions":[],"summary":{
            "runPassed":true,"draftFlows":0,"staleFlows":0,"invalidFlows":0,"pendingChanges":0,"observedAssertionsWithoutCurrentExplanation":1,
            "inventoryFailures":0,"unobservedAssertions":1,"statements":{"percentage":50}
        }});
        let mut options = parse(&["check".into()]).unwrap();
        assert!(check_failures(&report, &json!({"stale":false}), &options).is_empty());
        options.require_mappings = true;
        options.require_observed = true;
        options.minimum = Some(60.0);
        assert_eq!(
            check_failures(&report, &json!({"stale":true}), &options).len(),
            4
        );
        assert_eq!(
            check_failures(&report, &json!({"stale":null}), &options).len(),
            4
        );
        report["summary"]["observedAssertionsWithoutCurrentExplanation"] = json!(0);
        report["summary"]["unobservedAssertions"] = json!(0);
        options.minimum = Some(50.0);
        assert_eq!(
            check_failures(&report, &json!({"stale":null}), &options).len(),
            1
        );
        assert!(parse(&["check".into(), "--archived".into()]).is_err());
        report["summary"]["statements"]["percentage"] = Value::Null;
        assert_eq!(
            check_failures(&report, &json!({"stale":false}), &options).len(),
            1
        );
    }
}
