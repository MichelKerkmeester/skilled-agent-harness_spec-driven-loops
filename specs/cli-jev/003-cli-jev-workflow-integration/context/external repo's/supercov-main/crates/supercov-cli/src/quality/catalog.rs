//! The two catalogs: code properties, and risks a change can introduce.
//!
//! This is a different instrument from the rubric in `rubric.json`. The rubric
//! asks the model to place a file on a scale, which ties with counting
//! statements. These ask whether a specific, named, checkable property is
//! present, and the arithmetic that turns twelve answers into one number lives
//! here rather than in the model, so every part of the score is a claim a reader
//! can check against the file in seconds.
//!
//! Evidence, on 272 Java classes carrying professional maintainability ratings:
//! the composite orders size-matched pairs 78% correctly against CodeScene Code
//! Health's 67%, a statement count's 58% and the Maintainability Index's 52%.
//! Repeated, a check moves by a median of 0.01 and the composite by 0.5% of its
//! range. Asked about a change instead of a file, eight of eight deliberately
//! introduced smells were detected, seven of eight ranked first, with one false
//! alarm in 312 control questions.
//!
//! Two limits belong next to the number. The composite still correlates 0.92
//! with a statement count, so it is largely a size measure whose residual is
//! right. And six checks score as well as twelve, because these are not twelve
//! measurements but one measurement taken twelve times.

use serde::Deserialize;
use serde_json::{Map, Value, json};
use std::collections::BTreeMap;
use std::sync::OnceLock;

/// Bumped whenever a check's wording changes, so a saved answer is never read
/// as an answer to a question that was not asked.
pub const CATALOG_VERSION: &str = "properties-v1";

const PROPERTIES: &str = include_str!("properties.json");

/// Risks a change can introduce, which the complexity catalog cannot express.
///
/// Three of the original six, `hardcoded_secret`, `injection_risk` and
/// `touches_auth`, moved on 2026-09-20 into the twelve-check security surface
/// catalog below, which asks the same things of a file and, in differential
/// form, of a change; the constructed evidence for those three is kept in the
/// riskchecks note. What remains here is what only a change can show.
///
/// A [benchmark of 173 comments real reviewers wrote] found the complexity
/// catalog has a word for 8% of them: the rest are bugs, concurrency, security
/// and api. These seven are aimed at that gap and, on constructed positives with
/// matched safe changes, they separate by 0.91 or more where the complexity
/// checks separate by far less and co-fire constantly. They are asked only of a
/// change, never of a file, because every one of them is about what a change did.
///
/// They are not a bug finder. 94 of those 173 comments are bugs and none of
/// these asks about correctness.
///
/// An eighth, `breaks_api`, was removed on 2026-09-18. It caught its constructed
/// positive cleanly but fired on 20 of 50 real pull requests with a median of
/// 0.45, which is a common event being announced rather than a rare one being
/// caught. Changing an exported signature is ordinary in library work, so it may
/// have been correct and useless at once; either way it had no ground truth.
const RISKS: &str = include_str!("risks.json");

/// How a change question is framed. Both versions go in one request, because
/// scoring each alone and subtracting hits a ceiling: a file the model already
/// half-believes is guilty has no room left to rise.
const CHANGE_PREFIX: &str = "Two versions of one file are given, `before` and `after`. \
Answer only about what changed: does `after` show the following where `before` did not? ";
/// A risk check already asks about the change, so it needs the framing without
/// the "where `before` did not" clause the complexity questions require.
const CHANGE_PREFIX_PLAIN: &str = "Two versions of one file are given, `before` and `after`. \
Answer only about what changed: ";
const CHANGE_PRESENT: &str = "`after` shows it and `before` did not.";
const CHANGE_ABSENT: &str =
    "`before` already showed it, or neither version does, or `after` no longer does.";

#[derive(Debug, Deserialize)]
pub struct Check {
    pub id: String,
    pub task: String,
    pub present: String,
    pub absent: String,
    /// What is known about this check's accuracy, shown on request rather than
    /// left in a commit message.
    pub evidence: String,
}

pub fn properties() -> &'static [Check] {
    static PARSED: OnceLock<Vec<Check>> = OnceLock::new();
    PARSED.get_or_init(|| {
        serde_json::from_str(PROPERTIES).expect("properties.json ships with the binary and parses")
    })
}

pub fn risks() -> &'static [Check] {
    static PARSED: OnceLock<Vec<Check>> = OnceLock::new();
    PARSED.get_or_init(|| {
        serde_json::from_str(RISKS).expect("risks.json ships with the binary and parses")
    })
}

fn noul(task: String, present: &str, absent: &str) -> Value {
    json!({
        "type": "noul",
        "instructions": { "task": task },
        "criteria": { "true": present, "false": absent },
    })
}

/// Every check, asked about one file as it stands.
pub fn file_questions() -> Map<String, Value> {
    properties()
        .iter()
        .map(|c| (c.id.clone(), noul(c.task.clone(), &c.present, &c.absent)))
        .collect()
}

/// Every check, asked about what a change introduced: the complexity catalog in
/// its differential form, the risk checks, which only exist in this form, and
/// the security catalog in its differential form, so one review of a change
/// carries everything either instrument can say about it.
pub fn change_questions() -> Map<String, Value> {
    let mut questions: Map<String, Value> = properties()
        .iter()
        .map(|c| {
            (
                c.id.clone(),
                noul(
                    format!("{CHANGE_PREFIX}{}", c.task),
                    CHANGE_PRESENT,
                    CHANGE_ABSENT,
                ),
            )
        })
        .collect();
    for risk in risks() {
        questions.insert(
            risk.id.clone(),
            noul(
                format!("{CHANGE_PREFIX_PLAIN}{}", risk.task),
                &risk.present,
                &risk.absent,
            ),
        );
    }
    questions.extend(security::change_questions());
    questions
}

/// The catalog as a report carries it: what each check asks, and what is known
/// about how well it answers. A finding is only checkable if the question and
/// its evidence travel with it.
pub fn described() -> Value {
    let mut all: Vec<Value> = properties()
        .iter()
        .chain(risks())
        .map(|c| json!({ "check": c.id, "asks": c.present, "evidence": c.evidence }))
        .collect();
    all.extend(
        security::described()
            .as_array()
            .cloned()
            .unwrap_or_default(),
    );
    Value::Array(all)
}

/// Ask which of these paths the repository actually ships.
///
/// A convention is per-path and cannot see the tree. The model sees all of it in
/// one request, which is the whole difference: `runtime/python/supercov_runtime.py`
/// is unclassifiable alone and obvious beside `runtime/javascript/`,
/// `runtime/ruby/` and a manifest that ships one of them.
///
/// Measured on six repositories in six languages: 99.1% agreement with the
/// conventions on the 1,503 files they decide, and on the 115 they cannot it
/// separated a shipped runtime tree from prototype crates exactly. Paths only,
/// no contents, so it costs a fraction of a cent.
pub fn scope_request(repository: &str, tree: &str, manifests: &str, asking: &[String]) -> Value {
    const TASK: &str = "The complete list of source files in this repository is in `tree`, \
and the manifests it declares are in `manifests`. Is the file named in this question part of \
the product this repository ships or runs in production, rather than one of: a test, a fixture, a \
build or tooling script, an example or demo, documentation, a benchmark, generated output, or a \
prototype the project does not ship? Judge it in the context of the whole tree.";
    let questions: Map<String, Value> = asking
        .iter()
        .enumerate()
        .map(|(index, path)| {
            (
                format!("f{index}"),
                noul(
                    format!("{TASK}\n\nThe file: {path}"),
                    "It is part of the product.",
                    "It is a test, tooling, an example, documentation, a benchmark, \
                     generated output or a prototype.",
                ),
            )
        })
        .collect();
    json!({
        "model": super::model(),
        "state": { "repository": repository, "tree": tree, "manifests": manifests },
        "questions": questions,
    })
}

pub fn file_request(path: &str, source: &str) -> Value {
    json!({
        "model": super::model(),
        "state": { "file": { "path": path, "source": source } },
        "questions": file_questions(),
    })
}

/// The fallback when two whole versions do not fit: the unified diff alone.
///
/// A patch cannot separate a property the change introduced from one the file
/// already had, which is the reason whole files are sent at all. On one real
/// change it scored 0.83 where both versions scored 0.82, so it is a usable
/// second choice and a great deal better than refusing to review the file. It
/// is reported as a different kind of answer, never silently substituted.
pub fn patch_request(patch: &str) -> Value {
    json!({
        "model": super::model(),
        "state": { "diff": patch },
        "questions": change_questions(),
    })
}

/// State is exactly `before` and `after` and nothing else.
///
/// The path is deliberately left out. Wrapping the two versions under a `file`
/// key and adding the path measurably weakened detection in testing: a real
/// five-level nest came back at 0.37 with the wrapper and 0.5 or better
/// without. The shape that was validated is the shape that ships.
pub fn change_request(before: &str, after: &str) -> Value {
    json!({
        "model": super::model(),
        "state": { "before": before, "after": after },
        "questions": change_questions(),
    })
}

/// A check is reported as present at or above this value.
///
/// Chosen against three references rather than taken as the midpoint, which is
/// what 0.5 was. On 240 judgements a blind reader and the model both made, 0.60
/// agrees with the reader 80.8% of the time against 79.2% at 0.50, which is
/// inside the noise on that many judgements. The other two references are not
/// noisy and both point the same way: across 272 classes it reports 2.2
/// properties per file rather than 2.8, and on eight deliberately introduced
/// smells it still catches all eight while co-firing on unrelated checks falls
/// from 12% to 7%. Nothing favoured 0.50.
///
/// The composite does not use this. Health is the mean of the raw answers, so a
/// threshold decides only what is shown, never what is scored.
pub const PRESENT_AT: f64 = 0.6;

/// Health on a 0 to 10 scale, where 10 is a file no check fires on.
///
/// The mean rather than the sum, so the number means the same thing if the
/// catalog gains or loses a check. Ranking is identical either way, and the sum
/// is what the evidence above was measured on.
pub fn health(values: &BTreeMap<String, f64>) -> Option<f64> {
    if values.is_empty() {
        return None;
    }
    let mean = values.values().sum::<f64>() / values.len() as f64;
    Some(((1.0 - mean) * 10.0 * 100.0).round() / 100.0)
}

/// Which checks fired, strongest first.
pub fn present(values: &BTreeMap<String, f64>) -> Vec<(String, f64)> {
    let mut fired: Vec<_> = values
        .iter()
        .filter(|(_, v)| **v >= PRESENT_AT)
        .map(|(k, v)| (k.clone(), *v))
        .collect();
    fired.sort_by(|a, b| b.1.total_cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
    fired
}

/// Health across many files, weighted by size.
///
/// A plain average would let a directory of one-line re-exports outvote the
/// file everything depends on. Weighting by bytes says the score is about the
/// code, not about how it happens to be split into files. This is arithmetic
/// done here and is not a judgment the model was asked for; the per-file
/// numbers it combines are.
pub fn aggregate(files: &[(u64, f64)]) -> Option<f64> {
    let total: u64 = files.iter().map(|(bytes, _)| *bytes).sum();
    if total == 0 {
        return None;
    }
    let weighted: f64 = files
        .iter()
        .map(|(bytes, health)| *bytes as f64 * health)
        .sum();
    Some((weighted / total as f64 * 100.0).round() / 100.0)
}

/// Security surface a file shows, asked the way the complexity catalog is
/// asked: twelve named, checkable properties, each with a stated exception, each
/// mapped to the CWE classes it stands for.
///
/// A second instrument, `supercov security`, and never a security score. Each
/// check's `evidence` line carries what the probe in
/// `supercov-company/notes/security-catalog-probe-2026-09-20/` measured: twelve
/// of twelve constructed positives caught with the matched safe files quiet, in
/// both the file and the differential form; six borderline fires on a 73-file
/// clean floor; and on RealVuln's 140 repositories, recall from 96% down to
/// 43% by check against 3,381 labelled findings, with 5 of 76 certified
/// false-positive traps fired. The wording is frozen there and here together;
/// a change to one is a change to both and bumps [`security::VERSION`].
///
/// Two things the literature settled before a line of this was written. Asked
/// "is this vulnerable", language models answer at roughly the level of a
/// classifier over size and complexity metrics (Risse et al., ICSE 2026), and
/// the complexity composite already correlates 0.92 with a statement count, so
/// a per-file "security health" mean would be a size measure wearing a badge.
/// Asked whether a named, verifiable pattern is present, the three security
/// risk checks separated constructed positives from matched safe changes by
/// 0.91 or more. So these ask about surface, never about exploitability, and
/// they are never averaged: a file is clean or it names what fired.
#[cfg_attr(
    not(test),
    allow(dead_code, reason = "unwired until the probe reports")
)]
pub mod security {
    use super::*;
    use std::collections::BTreeMap;

    const SECURITY: &str = include_str!("security.json");

    /// Bumped whenever a security check's wording changes.
    pub const VERSION: &str = "security-v4";

    #[derive(Debug, Deserialize)]
    pub struct Check {
        pub id: String,
        /// The weakness classes this check stands for, so a finding can be read
        /// against CWE and OWASP without a translation table.
        pub cwe: Vec<String>,
        pub task: String,
        pub present: String,
        pub absent: String,
        pub evidence: String,
        /// A cut of its own, fitted on one half of a labelled corpus and
        /// reported on the other; absent, the shared [`PRESENT_AT`] applies.
        #[serde(default)]
        pub cut: Option<f64>,
    }

    /// The cut a check is shown at.
    pub fn cut_for(id: &str) -> f64 {
        checks()
            .iter()
            .find(|c| c.id == id)
            .and_then(|c| c.cut)
            .unwrap_or(PRESENT_AT)
    }

    /// Which checks fired, strongest first, each at its own cut.
    pub fn present(values: &BTreeMap<String, f64>) -> Vec<(String, f64)> {
        let mut fired: Vec<_> = values
            .iter()
            .filter(|(id, v)| **v >= cut_for(id))
            .map(|(k, v)| (k.clone(), *v))
            .collect();
        fired.sort_by(|a, b| b.1.total_cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
        fired
    }

    /// One question per candidate line: the check's own question, re-scoped
    /// to that line, with the trust boundary stated where the check asks
    /// about outside values. Keys are `c0`, `c1`, ... in candidate order.
    pub fn line_questions(
        candidates: &[super::super::candidates::Candidate],
    ) -> Map<String, Value> {
        const HANDLER: &str = "A request handler is declared at line {n}: `{text}`. Considering only \
that handler and what it does, does it read, change or delete a record chosen by a caller-supplied \
identifier, or perform an administrative or privileged action, without any visible check that the \
caller is signed in and allowed to act on it? A check applied by a decorator, middleware, guard or \
route group visible in this file counts as a check. A handler that only serves public, non-sensitive \
data does not count.";
        candidates
            .iter()
            .enumerate()
            .filter_map(|(i, candidate)| {
                let check = checks().iter().find(|c| c.id == candidate.check);
                let (task, present, absent) = match check {
                    Some(c) if c.id == "missing_authorization" => (
                        HANDLER
                            .replace("{n}", &candidate.line.to_string())
                            .replace("{text}", &candidate.text),
                        "This handler acts on a caller-chosen record or a privileged operation with no visible authorisation.".to_owned(),
                        "This handler is guarded, or acts on nothing sensitive.".to_owned(),
                    ),
                    Some(c) => (
                        format!(
                            "Line {} of the file reads: `{}`. Considering only what reaches that line, and how the value got there: {}{}",
                            candidate.line,
                            candidate.text,
                            c.task.replacen("Does this file", "does this line", 1),
                            ""
                        ),
                        c.present.clone(),
                        c.absent.clone(),
                    ),
                    None => return None,
                };
                Some((format!("c{i}"), noul(task, &present, &absent)))
            })
            .collect()
    }

    /// One short description per check, for the Choice that classifies a line.
    /// Short on purpose: the criteria travel with every question.
    pub fn short(id: &str) -> &'static str {
        match id {
            "secret_in_source" => "a credential, key, token or signing secret written as a literal",
            "injection_sink" => {
                "a database query, shell command or filter built from a caller's value"
            }
            "unsafe_code_execution" => {
                "eval, exec, a template compiled from a string, or a code-carrying deserialiser on outside data"
            }
            "unescaped_output" => {
                "an outside value written into HTML, a DOM or markup without escaping"
            }
            "path_from_input" => {
                "a file opened, served, saved or deleted at a caller-controlled path or name"
            }
            "missing_authorization" => {
                "a handler acting on a caller-chosen record or a privileged operation with no visible authorisation check"
            }
            "weak_authentication" => {
                "a token accepted without verification, a plaintext password comparison, or a cookie or session set insecurely"
            }
            "weak_cryptography" => {
                "MD5 or SHA-1 for passwords or signatures, ECB, a fixed IV, or non-cryptographic randomness for a secret"
            }
            "sensitive_data_exposure" => {
                "a secret, token, session id, stack trace or internal error written to a log or a response"
            }
            "destination_from_input" => "a redirect or outbound request to a URL a caller supplies",
            "unchecked_mass_assignment" => {
                "a request body copied wholesale into a record or object"
            }
            "insecure_configuration" => {
                "TLS verification, CSRF, CORS or another provided protection switched off, or debug mode left on"
            }
            _ => "",
        }
    }

    /// One Choice per node: which check, if any, does this line show. Keys are
    /// `n{offset+i}`, so chunks of one file can share a key space.
    pub fn classify_questions(
        nodes: &[super::super::candidates::Node],
        offset: usize,
    ) -> Map<String, Value> {
        classify_among(nodes, offset, None)
    }

    /// The same Choice per node over only the checks the file question fired
    /// on, when `among` names them: four options instead of thirteen, so a
    /// hundred nodes fit beside the file where thirty did.
    pub fn classify_among(
        nodes: &[super::super::candidates::Node],
        offset: usize,
        among: Option<&[String]>,
    ) -> Map<String, Value> {
        let mut criteria = Map::new();
        for c in checks() {
            if among.is_none_or(|fired| fired.contains(&c.id)) {
                criteria.insert(c.id.clone(), Value::String(short(&c.id).to_owned()));
            }
        }
        criteria.insert(
            "none".into(),
            Value::String("none of these; an ordinary line".into()),
        );
        nodes
            .iter()
            .enumerate()
            .map(|(i, node)| {
                (
                    format!("n{}", offset + i),
                    json!({
                        "type": "choice",
                        "instructions": { "task": format!(
                            "Line {} of `file.source` reads: `{}`. Which of these, if any, does that line show, given how the values on it were obtained? Choose none unless one plainly applies.",
                            node.line, node.text) },
                        "criteria": criteria,
                    }),
                )
            })
            .collect()
    }

    pub fn classify_request(
        path: &str,
        source: &str,
        nodes: &[super::super::candidates::Node],
        offset: usize,
        among: Option<&[String]>,
    ) -> Value {
        json!({
            "model": super::super::model(),
            "state": { "file": { "path": path, "source": source } },
            "questions": classify_among(nodes, offset, among),
        })
    }

    /// The confirmation round: the check's own question on each classified
    /// line (`c{i}`) and the triage question beside it (`t{i}`): would a
    /// careful reviewer report this or dismiss it. Measured on the held-out
    /// half, triage took precision from 50% to 56% and certified traps from 6
    /// to 4 of 29 for two points of recall; a question about the value instead
    /// of the report moved nothing.
    pub fn confirm_request(
        path: &str,
        source: &str,
        candidates: &[super::super::candidates::Candidate],
        structure: &super::super::candidates::Structure,
    ) -> Value {
        let mut questions = line_questions(candidates);
        // The source end rides on the same request: one Choice per candidate
        // over the lines of its function, "where does the outside value
        // enter".
        let lines: Vec<&str> = source.lines().collect();
        for (i, candidate) in candidates.iter().enumerate() {
            if let Some(question) =
                source_question(candidate.line, &candidate.check, &lines, structure)
            {
                questions.insert(format!("s{i}"), question);
            }
        }
        for (i, candidate) in candidates.iter().enumerate() {
            questions.insert(format!("t{i}"), noul(
                format!(
                    "Line {} of `file.source` reads: `{}`. A scanner reported it as: {}. Would a careful security reviewer who has read this whole file report that line as a real weakness worth fixing, or dismiss the report as noise, a false alarm, or something already handled elsewhere in the file?{}",
                    candidate.line, candidate.text, short(&candidate.check),
                    ""),
                "Dismiss: noise, a false alarm, or already handled in this file.",
                "Report: a real weakness worth fixing.",
            ));
        }
        json!({
            "model": super::super::model(),
            "state": { "file": { "path": path, "source": source } },
            "questions": questions,
        })
    }

    /// One Choice for one line: over the lines of the function it sits in (or
    /// thirty lines above it), "on which line does the outside value enter".
    /// Options `L{n}`, `same`, `none`.
    pub fn source_question(
        line: usize,
        check: &str,
        lines: &[&str],
        structure: &super::super::candidates::Structure,
    ) -> Option<Value> {
        let (start, end) = structure
            .functions
            .iter()
            .find(|f| f.start <= line && line <= f.end)
            // The outside value enters at or above the sink, so the options
            // run from the function's start to the line itself, forty lines
            // at most: enough for every labelled entry seen, and small enough
            // that a file with many candidates still fits its requests.
            .map(|f| (f.start.max(line.saturating_sub(40)).max(1), line))
            .unwrap_or((line.saturating_sub(30).max(1), line));
        let mut options = Map::new();
        for n in start..=end.min(lines.len()) {
            let text = lines[n - 1].trim();
            if !text.is_empty() && !text.starts_with('#') && !text.starts_with("//") {
                let shown: String = text.chars().take(100).collect();
                options.insert(format!("L{n}"), Value::String(format!("line {n}: {shown}")));
            }
        }
        if options.is_empty() {
            return None;
        }
        options.insert(
            "same".into(),
            Value::String("the value is produced on the reported line itself".into()),
        );
        options.insert(
            "none".into(),
            Value::String("no outside value enters within these lines".into()),
        );
        Some(json!({
            "type": "choice",
            "instructions": { "task": format!(
                "Line {line} was reported as: {}. On which of these lines does the outside value that reaches line {line} first enter the program (a request parameter, body, header, cookie, upload or message being read)?",
                short(check)) },
            "criteria": options,
        }))
    }

    /// What an assertion establishes about the weakness on its flow, asked of
    /// the map's own text, one Choice per credited flow. `prevented` is close
    /// to a verified negative; `exercised` is a finding proven reachable by the
    /// project's own test. Both authored vulnpy flows came back `exercised`
    /// at 1.0.
    pub fn flow_request(flows: &[crate::CreditedFlow]) -> Value {
        let mut state = Map::new();
        let mut questions = Map::new();
        for (i, flow) in flows.iter().enumerate() {
            state.insert(
                flow.key.clone(),
                json!({ "assertion": flow.assertion, "observes": flow.observes,
                    "flow_explanation": flow.explanation, "nodes": flow.nodes }),
            );
            questions.insert(format!("w{i}"), json!({
                "type": "choice",
                "instructions": { "task": format!(
                    "`flows[\"{}\"]` describes a test assertion and the source flow it checks, written by a reviewer. What does this assertion establish about the weakness on that flow?",
                    flow.key) },
                "criteria": {
                    "prevented": "The test asserts the weakness is prevented: the input was rejected, escaped, parameterised, confined or denied.",
                    "exercised": "The test asserts the operation ran with the input, or its effect came back, so the weakness is reachable and real.",
                    "unrelated": "The assertion establishes nothing about the weakness on this flow.",
                },
            }));
        }
        json!({ "model": super::super::model(), "state": { "flows": state }, "questions": questions })
    }

    /// A report dismissed at or above this by the triage question is not shown.
    pub const DISMISS_AT: f64 = 0.6;

    /// The checks a function's dangerous operation can belong to; the graph
    /// stage asks which, as a Choice with `none`.
    pub const SINK_KINDS: &[&str] = &[
        "injection_sink",
        "unsafe_code_execution",
        "unescaped_output",
        "path_from_input",
        "destination_from_input",
        "sensitive_data_exposure",
        "unchecked_mass_assignment",
    ];

    /// Four questions per function, on the same file state as the twelve:
    /// does it take caller-supplied data, does a parameter reach a dangerous
    /// operation unprotected inside it, does it sanitise or authorise what it
    /// receives, and which kind of operation. Keys are `f{i}_takes_outside`,
    /// `f{i}_reaches_sink`, `f{i}_sanitises`, `f{i}_sink_kind`. Host code
    /// then walks imports between labelled functions; the model never sees
    /// two files at once until a path is confirmed.
    pub fn function_questions(
        functions: &[super::super::candidates::FunctionSpan],
    ) -> Map<String, Value> {
        let mut questions = Map::new();
        for (i, f) in functions.iter().enumerate() {
            let where_ = format!(
                "The function `{}` declared at line {} (through about line {}) of `file.source`. Considering only that function: ",
                f.name, f.start, f.end
            );
            questions.insert(format!("f{i}_takes_outside"), noul(
                format!("{where_}does it read data that arrives at run time from a caller of the program, such as request parameters, body, headers, cookies, uploaded files or incoming messages, either directly or through a parameter that plainly carries such data (named or typed as a request, body, query, input, payload or the like)? Reading configuration, environment or files the program ships with does not count."),
                "It handles caller-supplied data.",
                "It handles no caller-supplied data.",
            ));
            questions.insert(format!("f{i}_reaches_sink"), noul(
                format!("{where_}does a value received through one of its parameters reach a dangerous operation inside it, a database query or command string, a shell command, eval or a code-carrying deserialiser, HTML or markup written without escaping, a filesystem path, a redirect or outbound request destination, a log line or response, or a wholesale object assignment, without being bound as a parameter, escaped, confined to an allowed set, or authorised on the way? A parameter that is only compared, counted, or passed to a function that binds or escapes it does not count."),
                "A parameter reaches a dangerous operation unprotected inside this function.",
                "No parameter reaches a dangerous operation, or every one is protected first.",
            ));
            questions.insert(format!("f{i}_sanitises"), noul(
                format!("{where_}is its purpose, or one of its effects, to validate, escape, confine, normalise or authorise the data it receives before returning it or passing it on: an allow-list check, an escape or encode, a path confinement, a schema validation that rejects, a permission check that refuses? Logging, formatting or renaming the value does not count."),
                "It validates, escapes, confines or authorises what it receives.",
                "It passes what it receives through unchanged in that respect.",
            ));
            let mut criteria = Map::new();
            for kind in SINK_KINDS {
                if let Some(c) = checks().iter().find(|c| c.id == *kind) {
                    criteria.insert((*kind).to_owned(), Value::String(c.present.clone()));
                }
            }
            criteria.insert(
                "none".into(),
                Value::String(
                    "No parameter reaches a dangerous operation in this function.".into(),
                ),
            );
            questions.insert(format!("f{i}_sink_kind"), json!({
                "type": "choice",
                "instructions": { "task": format!("{where_}if a parameter reaches a dangerous operation inside it, which kind is that operation? Choose none if no parameter reaches one.") },
                "criteria": criteria,
            }));
        }
        questions
    }

    /// One end of a cross-file path: a function, with its body, in a file.
    #[derive(Debug, Clone)]
    pub struct PathEnd {
        pub file: String,
        pub function: String,
        pub line: usize,
        pub source: String,
    }

    /// One question with both bodies in state: does outside data reach the
    /// callee's operation through this call unprotected. Answer key `path`.
    pub fn path_request(caller: &PathEnd, callee: &PathEnd, check: &str) -> Value {
        let present = checks()
            .iter()
            .find(|c| c.id == check)
            .map(|c| c.present.clone())
            .unwrap_or_default();
        let task = format!(
            "`caller` is a function in {} that handles caller-supplied data and calls `{}`, which is `callee`, a function in {}. \
Does a value that arrives from outside the program in the caller reach, through that call, the dangerous operation inside the callee, \
without being bound as a parameter, escaped, confined to an allowed set, or authorised anywhere on the way, in either function? \
The operation in question: {present} A value that the caller derives from configuration or constants, or that either function protects \
before it arrives, does not count.",
            caller.file, callee.function, callee.file
        );
        json!({
            "model": super::super::model(),
            "state": {
                "caller": { "file": caller.file, "function": caller.function, "starts_at_line": caller.line, "source": caller.source },
                "callee": { "file": callee.file, "function": callee.function, "starts_at_line": callee.line, "source": callee.source },
            },
            "questions": { "path": noul(task,
                "Outside data reaches the operation through this call unprotected.",
                "It is protected on the way, or the value is not from outside.") },
        })
    }

    pub fn checks() -> &'static [Check] {
        static PARSED: OnceLock<Vec<Check>> = OnceLock::new();
        PARSED.get_or_init(|| {
            serde_json::from_str(SECURITY).expect("security.json ships with the binary and parses")
        })
    }

    /// Every check, asked about one file as it stands.
    pub fn file_questions() -> Map<String, Value> {
        checks()
            .iter()
            .map(|c| (c.id.clone(), noul(c.task.clone(), &c.present, &c.absent)))
            .collect()
    }

    /// Every check in differential form: did the change introduce the surface
    /// where `before` did not show it. The complexity catalog's framing, for the
    /// same reason: scoring each version alone and subtracting hits a ceiling.
    pub fn change_questions() -> Map<String, Value> {
        checks()
            .iter()
            .map(|c| {
                (
                    c.id.clone(),
                    noul(
                        format!("{CHANGE_PREFIX}{}", c.task),
                        CHANGE_PRESENT,
                        CHANGE_ABSENT,
                    ),
                )
            })
            .collect()
    }

    pub fn file_request(path: &str, source: &str) -> Value {
        json!({
            "model": super::super::model(),
            "state": { "file": { "path": path, "source": source } },
            "questions": file_questions(),
        })
    }

    pub fn change_request(before: &str, after: &str) -> Value {
        json!({
            "model": super::super::model(),
            "state": { "before": before, "after": after },
            "questions": change_questions(),
        })
    }

    /// The unified diff alone, when both versions do not fit; reported as a
    /// different kind of answer, the way the complexity catalog does it.
    pub fn patch_request(patch: &str) -> Value {
        json!({
            "model": super::super::model(),
            "state": { "diff": patch },
            "questions": change_questions(),
        })
    }

    /// The catalog as a report would carry it, CWE classes included.
    pub fn described() -> Value {
        checks()
            .iter()
            .map(|c| {
                json!({ "check": c.id, "asks": c.present, "cwe": c.cwe, "evidence": c.evidence,
                "present_at": c.cut.unwrap_or(PRESENT_AT) })
            })
            .collect()
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use std::collections::BTreeSet;

        #[test]
        fn twelve_checks_with_ids_that_collide_with_no_other_catalog() {
            let ids: BTreeSet<&str> = checks().iter().map(|c| c.id.as_str()).collect();
            assert_eq!(checks().len(), 12);
            assert_eq!(ids.len(), 12, "duplicate id in security.json");
            for other in properties().iter().chain(risks()) {
                assert!(
                    !ids.contains(other.id.as_str()),
                    "{} is also a complexity or risk check; one request may carry both",
                    other.id
                );
            }
        }

        #[test]
        fn every_check_names_its_weakness_classes_its_exception_and_its_evidence() {
            for check in checks() {
                assert!(!check.cwe.is_empty(), "{} has no CWE", check.id);
                for cwe in &check.cwe {
                    let number = cwe.strip_prefix("CWE-").and_then(|n| n.parse::<u32>().ok());
                    assert!(number.is_some(), "{}: {cwe} is not a CWE id", check.id);
                }
                assert!(
                    !check.evidence.is_empty(),
                    "{} has no evidence line",
                    check.id
                );
                assert!(
                    check.task.contains("does not count") || check.task.contains("counts as"),
                    "{}: the task must state its exception",
                    check.id
                );
            }
        }

        #[test]
        fn file_request_carries_the_source_once_and_one_noul_per_check() {
            let request = file_request("src/a.ts", "export const a = 1");
            assert_eq!(request["model"], super::super::super::model());
            assert_eq!(request["state"]["file"]["path"], "src/a.ts");
            let questions = request["questions"].as_object().unwrap();
            assert_eq!(questions.len(), 12);
            for (id, question) in questions {
                assert_eq!(question["type"], "noul", "{id}");
                let task = question["instructions"]["task"].as_str().unwrap();
                assert!(task.starts_with("Does this file"), "{id}: {task}");
                assert!(question["criteria"]["true"].is_string());
                assert!(question["criteria"]["false"].is_string());
            }
        }

        #[test]
        fn change_request_asks_differentially() {
            let request = change_request("a", "b");
            assert_eq!(request["state"], json!({ "before": "a", "after": "b" }));
            for (_, question) in request["questions"].as_object().unwrap() {
                let task = question["instructions"]["task"].as_str().unwrap();
                assert!(task.starts_with(CHANGE_PREFIX));
                assert_eq!(question["criteria"]["true"], CHANGE_PRESENT);
            }
        }

        #[test]
        fn version_is_its_own_lane() {
            assert!(VERSION.starts_with("security-"));
            assert_ne!(VERSION, CATALOG_VERSION);
        }

        #[test]
        fn described_carries_cwe() {
            let described = described();
            let first = &described.as_array().unwrap()[0];
            assert_eq!(first["check"], "secret_in_source");
            assert!(
                first["cwe"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .any(|c| c == "CWE-798")
            );
        }
    }
}
