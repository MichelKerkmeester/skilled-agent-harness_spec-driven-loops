use serde_json::json;
use supercov_engine::{
    agent_json::{AgentError, ErrorCode},
    coverage_query::{DecisionSort, MinimizeMetric},
    indexed_query::IndexedQueryRequest,
};

const DEFAULT_LIMIT: usize = 20;
const DEFAULT_MAX_STATES: usize = 5_000;
const MAX_SAFE_INTEGER: u64 = 9_007_199_254_740_991;

pub fn help_for(command: &str, arguments: &[String]) -> Option<String> {
    if !arguments
        .iter()
        .any(|argument| matches!(argument.as_str(), "--help" | "-h"))
    {
        return None;
    }
    if command == "diff" {
        return Some(
            "Usage: supercov diff <older-run> <newer-run> [options]\n\nOptions:\n  --filter <all|passed|failed>\n  --kind <kind>\n  --runner <runner>\n  --metric <metric>\n  --offset <n>\n  --limit <n>\n  --json\n"
                .into(),
        );
    }
    let run = arguments
        .first()
        .filter(|argument| !argument.starts_with('-'));
    let Some(_) = run else {
        return Some(
            "Usage: supercov runs [options]\n       supercov runs <run-id> [query]\n\nLists runs and lazily calculates their coverage summaries.\n\nOptions:\n  --filter <all|passed|failed>\n  --offset <n>\n  --limit <n>\n  --json\n"
                .into(),
        );
    };
    let child = arguments
        .get(1)
        .filter(|argument| !argument.starts_with('-'))
        .map(String::as_str);
    let Some(child) = child else {
        return Some(
            "Usage: supercov runs <run-id> [query] [options]\n\nWithout a query, prints the run's coverage summary.\n\nQueries:\n  files                 every included file, including fully covered files\n  gaps                  only files with unresolved coverage or measurement gaps\n  file <path>           gap lines with consolidated obligations\n  line <file:line>      line state, obligations, tests and phases\n  decision <location>   MC/DC vectors and witness pairs for one decision\n  test <id|name>        coverage attributed to one test\n  kinds                 coverage grouped by unit/component/integration/e2e\n  runners               coverage grouped by test runner\n  scope                 included, excluded and ambiguous source files\n  minimize              smallest test set for a coverage target\n  tests affected        tests the changes since the run could have reached\n  assertions            assertion map status; see runs <run-id> assertions --help\n\nCommon options:\n  --filter <all|passed|failed>   recalculate coverage from those attempts only\n  --kind <kind>\n  --runner <runner>\n  --offset <n>\n  --limit <n>\n  --json\n\nRun any query with --help for its exact usage.\n"
                .replace("  minimize              ", "  assertions            list assertion mapping, review and execution status\n  assertion <id>        one assertion and its mapped flows\n  source <path>         matching current source with line numbers\n  minimize              "),
        );
    };
    let usage = match child {
        "summary" => {
            "supercov runs <run-id> [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--json]"
        }
        "files" => {
            "supercov runs <run-id> files [--metric <all|lines|statements|functions|branches|mcdc>] [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--offset <n>] [--limit <n>] [--json]"
        }
        "gaps" => {
            "supercov runs <run-id> gaps [--metric <all|lines|statements|functions|branches|mcdc>] [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--offset <n>] [--limit <n>] [--json]"
        }
        "kinds" => {
            "supercov runs <run-id> kinds [--filter <all|passed|failed>] [--runner <runner>] [--offset <n>] [--limit <n>] [--json]"
        }
        "runners" => {
            "supercov runs <run-id> runners [--filter <all|passed|failed>] [--kind <kind>] [--offset <n>] [--limit <n>] [--json]"
        }
        "scope" => "supercov runs <run-id> scope [--offset <n>] [--limit <n>] [--json]",
        "file" => {
            "supercov runs <run-id> file <path> [--group decision] [--sort <location|missing>] [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--offset <n>] [--limit <n>] [--json]"
        }
        "decision" => {
            "supercov runs <run-id> decision <id|source-file:line> [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--json]"
        }
        "line" => {
            "supercov runs <run-id> line <source-file:line> [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--offset <n>] [--limit <n>] [--json]"
        }
        "test" => {
            "supercov runs <run-id> test <id|name-fragment> [--filter <all|passed|failed>] [--json]"
        }
        "minimize" => {
            "supercov runs <run-id> minimize [--target <0..100>] [--metric <all|lines|statements|functions|branches|mcdc>] [--filter <all|passed|failed>] [--kind <kind>] [--runner <runner>] [--json]"
        }
        _ => "supercov runs <run-id> --help",
    };
    Some(format!("Usage: {usage}\n"))
}

#[derive(Debug)]
pub struct PublicQueryError {
    pub command: Option<String>,
    pub json: bool,
    pub error: Box<AgentError>,
}

impl PublicQueryError {
    fn invalid(command: Option<&str>, json_output: bool, message: impl Into<String>) -> Self {
        Self {
            command: command.map(str::to_owned),
            json: json_output,
            error: Box::new(AgentError {
                code: ErrorCode::InvalidArgument,
                message: message.into(),
                retryable: false,
                details: None,
            }),
        }
    }

    fn unknown(
        command: Option<&str>,
        json_output: bool,
        message: impl Into<String>,
        details: serde_json::Value,
    ) -> Self {
        Self {
            command: command.map(str::to_owned),
            json: json_output,
            error: Box::new(AgentError {
                code: ErrorCode::UnknownCommand,
                message: message.into(),
                retryable: false,
                details: Some(details),
            }),
        }
    }
}

#[derive(Debug)]
pub enum PublicQueryInvocation {
    Runs {
        filter: String,
        offset: usize,
        limit: usize,
        json: bool,
    },
    Coverage {
        request: Box<IndexedQueryRequest>,
        newer_run_id: Option<String>,
        agent_command: String,
        json: bool,
    },
}

#[derive(Debug)]
struct QueryOptions {
    run: Option<String>,
    kind: Option<String>,
    runner: Option<String>,
    filter: String,
    limit: usize,
    offset: usize,
    json: bool,
    target: f64,
    metric: MinimizeMetric,
    group_decision: bool,
    sort: DecisionSort,
    positional: Vec<String>,
}

impl Default for QueryOptions {
    fn default() -> Self {
        Self {
            run: None,
            kind: None,
            runner: None,
            filter: "all".into(),
            limit: DEFAULT_LIMIT,
            offset: 0,
            json: false,
            target: 100.0,
            metric: MinimizeMetric::All,
            group_decision: false,
            sort: DecisionSort::Location,
            positional: Vec::new(),
        }
    }
}

fn parse_unsigned(value: Option<&String>, positive: bool) -> Option<usize> {
    let value = value?;
    let parsed = value.parse::<f64>().ok()?;
    if !parsed.is_finite()
        || parsed.fract() != 0.0
        || parsed < 0.0
        || parsed > MAX_SAFE_INTEGER as f64
        || (positive && parsed == 0.0)
    {
        return None;
    }
    Some(parsed as usize)
}

fn parse_options(
    command: &str,
    arguments: &[String],
    json_output: bool,
) -> Result<QueryOptions, PublicQueryError> {
    let agent_command = if matches!(command, "runs" | "diff" | "help") {
        command.to_owned()
    } else {
        format!("coverage.{command}")
    };
    let mut options = QueryOptions {
        json: json_output,
        ..QueryOptions::default()
    };
    let mut index = 0;
    while index < arguments.len() {
        let value = &arguments[index];
        match value.as_str() {
            "--json" => options.json = true,
            "--run" => {
                index += 1;
                let Some(run) = arguments.get(index) else {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--run requires a run ID",
                    ));
                };
                options.run = Some(run.clone());
            }
            "--kind" => {
                index += 1;
                let Some(kind) = arguments.get(index) else {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--kind requires a test kind",
                    ));
                };
                options.kind = Some(kind.to_lowercase());
            }
            "--runner" => {
                index += 1;
                let Some(runner) = arguments.get(index) else {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--runner requires a runner name",
                    ));
                };
                options.runner = Some(runner.to_lowercase());
            }
            "--filter" => {
                index += 1;
                let filter = arguments.get(index).map(|filter| filter.to_lowercase());
                if !matches!(filter.as_deref(), Some("all" | "passed" | "failed")) {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--filter must be all, passed, or failed",
                    ));
                }
                options.filter = filter.expect("validated coverage filter");
            }
            "--target" => {
                index += 1;
                let target = arguments
                    .get(index)
                    .and_then(|value| value.parse::<f64>().ok());
                if !target
                    .is_some_and(|target| target.is_finite() && (0.0..=100.0).contains(&target))
                {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--target must be between 0 and 100",
                    ));
                }
                options.target = target.expect("validated minimization target");
            }
            "--metric" => {
                index += 1;
                options.metric = match arguments.get(index).map(|metric| metric.to_lowercase()) {
                    Some(metric) if metric == "all" => MinimizeMetric::All,
                    Some(metric) if metric == "lines" => MinimizeMetric::Lines,
                    Some(metric) if metric == "statements" => MinimizeMetric::Statements,
                    Some(metric) if metric == "functions" => MinimizeMetric::Functions,
                    Some(metric) if metric == "branches" => MinimizeMetric::Branches,
                    Some(metric) if metric == "mcdc" => MinimizeMetric::Mcdc,
                    _ => {
                        return Err(PublicQueryError::invalid(
                            Some(&agent_command),
                            json_output,
                            "--metric must be all, lines, statements, functions, branches, or mcdc",
                        ));
                    }
                };
            }
            "--limit" => {
                index += 1;
                let Some(limit) = parse_unsigned(arguments.get(index), true) else {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--limit must be a positive integer",
                    ));
                };
                options.limit = limit;
            }
            "--offset" => {
                index += 1;
                let Some(offset) = parse_unsigned(arguments.get(index), false) else {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--offset must be a non-negative integer",
                    ));
                };
                options.offset = offset;
            }
            "--group" => {
                index += 1;
                if arguments
                    .get(index)
                    .map(|group| group.to_lowercase())
                    .as_deref()
                    != Some("decision")
                {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--group must be decision",
                    ));
                }
                if command != "file" {
                    return Err(PublicQueryError::invalid(
                        Some(&agent_command),
                        json_output,
                        "--group is only supported by: supercov runs <run-id> file <source-file>",
                    ));
                }
                options.group_decision = true;
            }
            "--sort" => {
                index += 1;
                options.sort = match arguments.get(index).map(|sort| sort.to_lowercase()) {
                    Some(sort) if sort == "location" => DecisionSort::Location,
                    Some(sort) if sort == "missing" => DecisionSort::Missing,
                    _ => {
                        return Err(PublicQueryError::invalid(
                            Some(&agent_command),
                            json_output,
                            "--sort must be location or missing",
                        ));
                    }
                };
            }
            option if option.starts_with("--") => {
                let mut error = PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    format!("Unknown option: {option}"),
                );
                error.error.details = Some(json!({ "option": option }));
                return Err(error);
            }
            _ => options.positional.push(value.clone()),
        }
        index += 1;
    }
    if options.sort != DecisionSort::Location && !options.group_decision {
        return Err(PublicQueryError::invalid(
            Some(&agent_command),
            json_output,
            "--sort requires --group decision",
        ));
    }
    if options.group_decision
        && !matches!(options.metric, MinimizeMetric::All | MinimizeMetric::Mcdc)
    {
        return Err(PublicQueryError::invalid(
            Some(&agent_command),
            json_output,
            "--group decision lists MC/DC decisions; omit --metric or use --metric mcdc",
        ));
    }
    Ok(options)
}

fn parse_location(selector: &str) -> Option<(String, usize)> {
    let without_column = selector.rsplit_once(':')?;
    let (file_and_maybe_line, final_number) = without_column;
    let final_number = final_number.parse::<usize>().ok()?;
    if let Some((file, line)) = file_and_maybe_line.rsplit_once(':')
        && let Ok(line) = line.parse::<usize>()
    {
        return Some((file.to_owned(), line));
    }
    Some((file_and_maybe_line.to_owned(), final_number))
}

fn coverage_invocation(
    run_id: String,
    command: &str,
    arguments: &[String],
    json_output: bool,
) -> Result<PublicQueryInvocation, PublicQueryError> {
    let options = parse_options(command, arguments, json_output)?;
    let agent_command = format!("coverage.{command}");
    let mut request = IndexedQueryRequest {
        run_id,
        filter: options.filter,
        command: command.into(),
        metric: options.metric,
        kind: options.kind,
        runner: options.runner,
        file: None,
        line: None,
        selector: None,
        sort: None,
        valid: None,
        test_exit_code: None,
        stale: None,
        stale_reasons: None,
        offset: options.offset,
        limit: options.limit,
        target: None,
        max_states: None,
    };
    match command {
        "summary" | "kinds" | "runners" | "scope" | "files" | "gaps" => {}
        "file" => {
            let Some(file) = options.positional.first() else {
                return Err(PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    "Usage: supercov runs <run-id> file <source-file>",
                ));
            };
            request.file = Some(file.clone());
            if options.group_decision {
                request.command = "file-decisions".into();
                request.sort = Some(options.sort);
            } else {
                request.command = "file-detail".into();
            }
        }
        "decision" => {
            let Some(selector) = options.positional.first() else {
                return Err(PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    "Usage: supercov runs <run-id> decision <id|source-file:line>",
                ));
            };
            request.selector = Some(selector.clone());
        }
        "line" => {
            let Some(selector) = options.positional.first() else {
                return Err(PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    "Usage: supercov runs <run-id> line <source-file:line>",
                ));
            };
            let Some((file, line)) = parse_location(selector) else {
                let mut error = PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    "Expected <source-file>:<line>",
                );
                error.error.details = Some(json!({ "selector": selector }));
                return Err(error);
            };
            request.file = Some(file);
            request.line = Some(line);
        }
        "test" => {
            if options.positional.is_empty() {
                return Err(PublicQueryError::invalid(
                    Some(&agent_command),
                    json_output,
                    "Usage: supercov runs <run-id> test <id|name-fragment>",
                ));
            }
            request.selector = Some(options.positional.join(" ").to_lowercase());
        }
        "minimize" => {
            request.target = Some(options.target);
            request.max_states = Some(DEFAULT_MAX_STATES);
        }
        _ => unreachable!("coverage hierarchy validates child commands"),
    }
    Ok(PublicQueryInvocation::Coverage {
        request: Box::new(request),
        newer_run_id: None,
        agent_command,
        json: options.json,
    })
}

pub fn parse_public_query(
    command: &str,
    arguments: &[String],
) -> Result<PublicQueryInvocation, PublicQueryError> {
    let json_output = arguments.iter().any(|argument| argument == "--json");
    if command == "diff" {
        let options = parse_options(command, arguments, json_output)?;
        let Some(older) = options.positional.first() else {
            return Err(PublicQueryError::invalid(
                Some("diff"),
                json_output,
                "Usage: supercov diff <older-run> <newer-run>",
            ));
        };
        let Some(newer) = options.positional.get(1) else {
            return Err(PublicQueryError::invalid(
                Some("diff"),
                json_output,
                "Usage: supercov diff <older-run> <newer-run>",
            ));
        };
        return Ok(PublicQueryInvocation::Coverage {
            request: Box::new(IndexedQueryRequest {
                run_id: older.clone(),
                filter: options.filter,
                command: "diff".into(),
                metric: options.metric,
                kind: options.kind,
                runner: options.runner,
                file: None,
                line: None,
                selector: None,
                sort: None,
                valid: None,
                test_exit_code: None,
                stale: None,
                stale_reasons: None,
                offset: options.offset,
                limit: options.limit,
                target: None,
                max_states: None,
            }),
            newer_run_id: Some(newer.clone()),
            agent_command: "diff".into(),
            json: options.json,
        });
    }

    debug_assert_eq!(command, "runs");
    let Some(run_id) = arguments
        .first()
        .filter(|argument| !argument.starts_with('-'))
    else {
        let options = parse_options(command, arguments, json_output)?;
        return Ok(PublicQueryInvocation::Runs {
            filter: options.filter,
            offset: options.offset,
            limit: options.limit,
            json: options.json,
        });
    };
    let child_index = 1;
    let child = arguments
        .get(child_index)
        .filter(|child| !child.starts_with('-'))
        .map_or("summary", String::as_str);
    if !matches!(
        child,
        "summary"
            | "kinds"
            | "runners"
            | "scope"
            | "files"
            | "gaps"
            | "file"
            | "decision"
            | "line"
            | "test"
            | "minimize"
    ) {
        return Err(PublicQueryError::unknown(
            Some(&format!("coverage.{child}")),
            json_output,
            format!("Unknown run query: {child}. Try supercov runs <run-id> --help."),
            json!({ "command": child }),
        ));
    }
    let child_arguments = if arguments
        .get(child_index)
        .is_some_and(|candidate| !candidate.starts_with('-'))
    {
        &arguments[child_index + 1..]
    } else {
        &arguments[child_index..]
    };
    coverage_invocation(run_id.clone(), child, child_arguments, json_output)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn args(values: &[&str]) -> Vec<String> {
        values.iter().map(|value| (*value).into()).collect()
    }

    #[test]
    fn parses_the_instance_first_summary_and_default_pagination() {
        let PublicQueryInvocation::Coverage {
            request,
            agent_command,
            json,
            ..
        } = parse_public_query("runs", &args(&["latest", "--json"])).unwrap()
        else {
            panic!("expected coverage invocation");
        };
        assert_eq!(request.run_id, "latest");
        assert_eq!(request.command, "summary");
        assert_eq!(request.offset, 0);
        assert_eq!(request.limit, 20);
        assert_eq!(agent_command, "coverage.summary");
        assert!(json);

        let PublicQueryInvocation::Coverage { request, .. } =
            parse_public_query("runs", &args(&["run_abc123"])).unwrap()
        else {
            panic!("expected default coverage invocation");
        };
        assert_eq!(request.run_id, "run_abc123");
        assert_eq!(request.command, "summary");
    }

    #[test]
    fn parses_all_structural_file_and_test_options() {
        let PublicQueryInvocation::Coverage { request, .. } = parse_public_query(
            "runs",
            &args(&[
                "run-1",
                "file",
                "src/a.ts",
                "--group",
                "decision",
                "--sort",
                "missing",
                "--metric",
                "mcdc",
                "--filter",
                "passed",
                "--kind",
                "E2E",
                "--runner",
                "Playwright",
                "--offset",
                "40",
            ]),
        )
        .unwrap() else {
            panic!("expected coverage invocation");
        };
        assert_eq!(request.command, "file-decisions");
        assert_eq!(request.file.as_deref(), Some("src/a.ts"));
        assert_eq!(request.sort, Some(DecisionSort::Missing));
        assert_eq!(request.filter, "passed");
        assert_eq!(request.kind.as_deref(), Some("e2e"));
        assert_eq!(request.runner.as_deref(), Some("playwright"));
        assert_eq!(request.offset, 40);
        assert_eq!(request.limit, 20);
    }

    #[test]
    fn splits_line_locations_without_confusing_an_optional_column() {
        let PublicQueryInvocation::Coverage { request, .. } =
            parse_public_query("runs", &args(&["run-1", "line", "src/a.ts:12:8"])).unwrap()
        else {
            panic!("expected coverage invocation");
        };
        assert_eq!(request.file.as_deref(), Some("src/a.ts"));
        assert_eq!(request.line, Some(12));
    }

    #[test]
    fn refuses_to_degrade_a_malformed_instance_query_to_a_listing() {
        let error =
            parse_public_query("runs", &args(&["run-1", "coverage", "--json"])).unwrap_err();
        assert_eq!(error.error.code, ErrorCode::UnknownCommand);
        assert_eq!(error.command.as_deref(), Some("coverage.coverage"));
        assert_eq!(
            error.error.message,
            "Unknown run query: coverage. Try supercov runs <run-id> --help."
        );
        assert!(error.json);
    }

    #[test]
    fn validates_agent_options_before_storage_access() {
        let error = parse_public_query("runs", &args(&["run-1", "gaps", "--limit", "0", "--json"]))
            .unwrap_err();
        assert_eq!(error.error.code, ErrorCode::InvalidArgument);
        assert_eq!(error.command.as_deref(), Some("coverage.gaps"));
        assert_eq!(error.error.message, "--limit must be a positive integer");
    }
}
