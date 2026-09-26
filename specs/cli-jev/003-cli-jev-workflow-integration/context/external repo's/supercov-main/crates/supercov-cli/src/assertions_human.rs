//! Readable views for assertion resources and matching current source.
use serde_json::Value;
use std::fmt::Write;

fn text(value: &Value) -> &str {
    value.as_str().unwrap_or("")
}

fn items(value: &Value) -> &[Value] {
    value.as_array().map(Vec::as_slice).unwrap_or(&[])
}

fn quote(value: &str) -> String {
    format!("'{}'", value.replace('\'', "'\\''"))
}

fn location(at: &Value) -> String {
    format!("{}:{}:{}", text(&at["file"]), at["line"], at["column"])
}

fn code(out: &mut String, source: &str, indent: &str) {
    for line in source.lines() {
        let _ = writeln!(out, "{indent}{line}");
    }
}

fn page_footer(out: &mut String, data: &Value, command: &str) {
    let page = &data["pagination"];
    let offset = page["offset"].as_u64().unwrap_or(0);
    let returned = page["returned"].as_u64().unwrap_or(0);
    let start = if returned == 0 { 0 } else { offset + 1 };
    let end = if returned == 0 { 0 } else { offset + returned };
    let unit = if data["view"] == "assertion" {
        "flows "
    } else {
        ""
    };
    let _ = writeln!(out, "\nShowing {unit}{start}-{end} of {}", page["total"]);
    if let Some(next) = page["nextOffset"].as_u64() {
        let _ = writeln!(out, "Next: {command} --offset {next} --limit {returned}");
    }
}

fn notes(out: &mut String, data: &Value) {
    if data["workingTree"]["stale"] == true {
        let _ = writeln!(
            out,
            "\nThe current checkout has changed; this view describes the archived run."
        );
    }
    for error in items(&data["validationErrors"]) {
        let _ = writeln!(out, "Map error: {}", text(error));
    }
}

fn summary(out: &mut String, data: &Value) {
    let score = &data["summary"]["statements"];
    if let Some(pct) = score["percentage"].as_f64() {
        let _ = writeln!(
            out,
            "Assertion coverage: {pct:.2}% ({}/{}) agent-assessed statements",
            score["asserted"], score["total"]
        );
    } else {
        let _ = writeln!(
            out,
            "Assertion coverage: {} — {}",
            text(&data["summary"]["status"]),
            text(&data["summary"]["reason"])
        );
    }
    if let Some(path) = data["map"].as_str() {
        let _ = writeln!(out, "Map: {path}");
    }
    for skipped in items(&data["inheritance"]["skipped"]) {
        let _ = writeln!(
            out,
            "Map reuse skipped {}: {}",
            text(&skipped["run"]),
            text(&skipped["reason"])
        );
    }
}

fn source(data: &Value) -> String {
    let mut out = format!(
        "{} — matching current source, run {}\n\n",
        text(&data["file"]),
        text(&data["run"])
    );
    let width = data["pagination"]["total"].to_string().len();
    for line in items(&data["items"]) {
        let number = line["line"].as_u64().unwrap_or(0);
        let _ = writeln!(out, "{number:>width$} │ {}", text(&line["text"]));
    }
    let command = format!(
        "supercov runs {} source {}",
        quote(text(&data["run"])),
        quote(text(&data["file"]))
    );
    page_footer(&mut out, data, &command);
    notes(&mut out, data);
    out
}

fn assertions(data: &Value) -> String {
    let mut out = format!("Assertions — run {}\n", text(&data["run"]));
    summary(&mut out, data);
    for a in items(&data["items"]) {
        let flows = items(&a["flows"]);
        let dirty = flows.iter().filter(|f| f["current"] != true).count();
        let review = if flows.is_empty() {
            "no flows".to_owned()
        } else if dirty > 0 {
            format!("{dirty}/{} flows need rechecking", flows.len())
        } else {
            format!(
                "{} current {}",
                flows.len(),
                if flows.len() == 1 { "flow" } else { "flows" }
            )
        };
        let observed = items(&a["observedPassingTests"]).len();
        let test_label = if observed == 1 { "test" } else { "tests" };
        let _ = writeln!(
            out,
            "\n{} · {review} · {observed} passing {test_label}",
            text(&a["id"])
        );
        let _ = writeln!(out, "  {}", location(&a["at"]));
        if observed == 0 {
            let _ = writeln!(out, "  {}", text(&a["observation"]));
        }
        let expression = text(&a["at"]["text"]);
        let first = expression.lines().next().unwrap_or("");
        let preview = first.chars().take(140).collect::<String>();
        let suffix = if expression.lines().count() > 1 || first.chars().count() > 140 {
            " …"
        } else {
            ""
        };
        let _ = writeln!(out, "  {preview}{suffix}");
        let uncredited = flows
            .iter()
            .flat_map(|f| items(&f["nodeCredit"]))
            .filter(|n| n["status"] == "notCredited")
            .count();
        if uncredited > 0 {
            let _ = writeln!(
                out,
                "  {uncredited} claimed node(s) without credit; inspect assertion details for reasons."
            );
        }
        if a["inMap"] == false {
            let _ = writeln!(
                out,
                "  Missing from assertions.json; this site was found in matching current source."
            );
        }
    }
    let mut command = format!("supercov runs {} assertions", quote(text(&data["run"])));
    if let Some(file) = data["file"].as_str() {
        let _ = write!(command, " --file {}", quote(file));
    }
    if data["filters"]["needsAttention"] == true {
        command.push_str(" --needs-attention");
    }
    page_footer(&mut out, data, &command);
    let _ = writeln!(
        out,
        "Details: supercov runs {} assertion <id>",
        quote(text(&data["run"]))
    );
    notes(&mut out, data);
    out
}

fn assertion(data: &Value) -> String {
    let a = &data["assertion"];
    let mut out = format!(
        "Assertion {} — run {}\n{}\n",
        text(&a["id"]),
        text(&data["run"]),
        location(&a["at"])
    );
    code(&mut out, text(&a["at"]["text"]), "  ");
    for question in items(&a["questions"]) {
        let _ = writeln!(out, "Question: {}", text(question));
    }
    if a["inMap"] == false {
        let _ = writeln!(
            out,
            "Missing from assertions.json; add this discovered site to the map."
        );
    }
    for property in items(&a["observes"]) {
        let _ = writeln!(out, "Observes: {}", text(property));
    }
    if items(&data["tests"]).is_empty() {
        let _ = writeln!(out, "No passing assertion occurrence was recorded.");
    }
    for test in items(&data["tests"]) {
        let _ = writeln!(out, "Observed in passing test: {}", text(&test["name"]));
    }
    let _ = writeln!(out, "{}", text(&a["observation"]));
    if items(&a["flows"]).is_empty() {
        if data["pagination"]["total"].as_u64().unwrap_or(0) > 0 {
            let _ = writeln!(out, "\nNo flows on this page.");
        } else {
            let _ = writeln!(out, "\nNo flows mapped yet.");
        }
    }
    for flow in items(&a["flows"]) {
        let current = if flow["current"] == true {
            "current"
        } else {
            "needs rechecking"
        };
        let eligible = if flow["eligible"] == true {
            "eligible for credit"
        } else {
            "not eligible for credit"
        };
        let _ = writeln!(
            out,
            "\nFlow {}/{} — {current}, {eligible}",
            text(&a["id"]),
            text(&flow["id"])
        );
        code(&mut out, text(&flow["explanation"]), "  ");
        for case in items(&flow["appliesTo"]) {
            let _ = writeln!(
                out,
                "  Applies to: {} — {}",
                text(&case["file"]),
                text(&case["name"])
            );
        }
        for reason in items(&flow["reasons"])
            .iter()
            .chain(items(&flow["blockers"]))
        {
            let _ = writeln!(out, "  Review/evidence: {}", text(reason));
        }
        for node in items(&flow["nodes"]) {
            let assessment = items(&flow["nodeCredit"])
                .iter()
                .find(|credit| credit["nodeId"] == node["id"]);
            let label = match assessment.map(|credit| text(&credit["status"])) {
                Some("credited") => "Credited",
                Some("notCredited") => "Not credited",
                Some("context") => "Context only",
                _ if items(&flow["countsAsAsserted"]).contains(&node["id"]) => {
                    "Claimed as asserted"
                }
                _ => "Context only",
            };
            let _ = writeln!(
                out,
                "  Node {} — {} [{label}]",
                text(&node["id"]),
                location(&node["at"])
            );
            if let Some(assessment) = assessment {
                for reason in items(&assessment["reasons"]) {
                    let _ = writeln!(out, "    Credit reason: {}", text(&reason["message"]));
                }
            }
            code(&mut out, text(&node["at"]["text"]), "    ");
            if node["at"]["textOmitted"] == true {
                let _ = writeln!(
                    out,
                    "    Source text omitted (--compact); read the matching source file at this location."
                );
            }
            if let Some(meaning) = node["meaning"].as_str().filter(|s| !s.is_empty()) {
                let _ = writeln!(out, "    Agent explanation: {meaning}");
            }
        }
        for edge in items(&flow["edges"]) {
            let _ = writeln!(
                out,
                "  {} → {} ({}) {}",
                text(&edge["from"]),
                text(&edge["to"]),
                text(&edge["kind"]),
                text(&edge["basis"])
            );
        }
        for watch in items(&flow["watch"]) {
            let _ = writeln!(out, "  Watches file: {}", text(watch));
        }
    }
    if data["pagination"].is_object() {
        page_footer(
            &mut out,
            data,
            &format!(
                "supercov runs {} assertion {}",
                quote(text(&data["run"])),
                quote(text(&a["id"]))
            ),
        );
    }
    let _ = writeln!(out);
    summary(&mut out, data);
    notes(&mut out, data);
    out
}

pub fn render(data: &Value) -> Option<String> {
    match data["view"].as_str()? {
        "source" => Some(source(data)),
        "assertions" => Some(assertions(data)),
        "assertion" => Some(assertion(data)),
        "assertionFlow" => {
            let mut out = format!(
                "Assertion {} / flow {} — {}\n",
                text(&data["assertion"]["id"]),
                text(&data["flow"]["id"]),
                text(&data["flowView"])
            );
            for item in items(&data["items"]) {
                if data["flowView"] == "nodes" {
                    let _ = writeln!(
                        out,
                        "\nNode {} — {} [{}]",
                        text(&item["id"]),
                        location(&item["at"]),
                        text(&item["credit"]["status"])
                    );
                    code(&mut out, text(&item["at"]["text"]), "  ");
                    if item["at"]["textOmitted"] == true {
                        let _ = writeln!(
                            out,
                            "  Source text omitted (--compact); use runs <run> source <path> at this location."
                        );
                    }
                    let _ = writeln!(out, "  {}", text(&item["meaning"]));
                    for reason in items(&item["credit"]["reasons"]) {
                        let _ = writeln!(out, "  Credit reason: {}", text(&reason["message"]));
                    }
                } else {
                    let _ = writeln!(
                        out,
                        "  {} → {} ({}) {}",
                        text(&item["from"]),
                        text(&item["to"]),
                        text(&item["kind"]),
                        text(&item["basis"])
                    );
                }
            }
            page_footer(
                &mut out,
                data,
                &format!(
                    "supercov runs {} assertion {} --flow {} --view {}{}",
                    quote(text(&data["run"])),
                    quote(text(&data["assertion"]["id"])),
                    quote(text(&data["flow"]["id"])),
                    text(&data["flowView"]),
                    if data["compact"] == true {
                        " --compact"
                    } else {
                        ""
                    }
                ),
            );
            Some(out)
        }
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn source_preserves_indentation_blank_lines_and_unicode_and_quotes_next_path() {
        let data = json!({"view":"source","run":"run_one","file":"tests/a b's.ts",
            "items":[{"line":34,"text":"  const x = '🧪';"},{"line":35,"text":""},{"line":36,"text":"\tassert(x);"}],
            "pagination":{"offset":33,"returned":3,"total":100,"nextOffset":36}});
        let rendered = render(&data).unwrap();
        assert!(rendered.contains(" 34 │   const x = '🧪';\n 35 │ \n 36 │ \tassert(x);\n"));
        assert!(rendered.contains("Showing 34-36 of 100"));
        assert!(rendered.contains("source 'tests/a b'\\''s.ts' --offset 36 --limit 3"));
        assert!(!rendered.contains("\"text\""));
    }

    #[test]
    fn empty_source_page_never_reports_imaginary_line_numbers() {
        let data = json!({"view":"source","run":"run_one","file":"empty.ts","items":[],
            "pagination":{"offset":100,"returned":0,"total":0,"nextOffset":null}});
        let rendered = render(&data).unwrap();
        assert!(rendered.contains("Showing 0-0 of 0"));
        assert!(!rendered.contains("Next:"));
    }

    #[test]
    fn assertion_distinguishes_agent_explanation_from_computed_credit() {
        let data = json!({"view":"assertion","run":"run_one","assertion":{
            "id":"a_one","at":{"file":"test.js","line":4,"column":1,"text":"assert(result)"},
            "flows":[{"id":"value","current":true,"eligible":true,"nodes":[
                {"id":"return","at":{"file":"src.js","line":1,"column":1,"text":"return result;"},"meaning":"Returns the checked value."},
                {"id":"callback","at":{"file":"src.js","line":2,"column":1,"text":"callback();"}},
                {"id":"setup","at":{"file":"test.js","line":1,"column":1,"text":"setup();"}}
            ],"countsAsAsserted":["return","callback"],"nodeCredit":[
                {"nodeId":"return","status":"credited","reasons":[{"code":"same_test_execution","message":"Statement executed in the selected test."}]},
                {"nodeId":"callback","status":"notCredited","reasons":[{"code":"no_same_test_execution","message":"No execution evidence attributed to this test."}]},
                {"nodeId":"setup","status":"context","reasons":[{"code":"context_only","message":"Included as context only."}]}
            ]}]
        }});
        let output = render(&data).unwrap();
        assert!(output.contains("Node return — src.js:1:1 [Credited]"));
        assert!(output.contains("Node callback — src.js:2:1 [Not credited]"));
        assert!(output.contains("Node setup — test.js:1:1 [Context only]"));
        assert!(output.contains("Credit reason: No execution evidence attributed to this test."));
        assert!(output.contains("Agent explanation: Returns the checked value."));
    }
}
