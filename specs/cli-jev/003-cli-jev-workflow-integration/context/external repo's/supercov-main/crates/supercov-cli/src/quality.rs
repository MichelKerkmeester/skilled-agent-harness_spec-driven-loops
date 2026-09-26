//! Advisory, source-only quality assessment. No coverage run or test execution.
//!
//! One instrument: the code-property catalog in `properties.json`. The nine-construct
//! rubric this module used to carry was removed on 2026-09-18, because it ordered
//! human-rated classes 90.2% correctly where counting the statements in a file
//! got 90.3%, and a paid call cannot justify itself by matching `wc`. Declaration
//! scope went with it: graded declarations located the function a maintainer
//! fixed 5 times in 12 against 3.77 by chance, and reformatting a file moved two
//! of its constructs more than real fixes did.
use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    io::Read,
    path::{Path, PathBuf},
    process::ExitCode,
    time::{Duration, Instant},
};

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};

mod candidates;
mod catalog;
mod changes;
mod query;
mod scope;
mod store;

/// Which catalog a command asks, and where its answers live. Two lanes, one
/// plumbing: discovery, budget, cache, snapshots and views are shared, and what
/// differs is the questions, whether the answers compose into a number, and
/// the directory under `.supercov/`.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Instrument {
    /// Twelve code properties, composed into health. `supercov quality`.
    Catalog,
    /// Twelve security surface checks, never composed: a file is clean or it
    /// names what fired. `supercov security`.
    Security,
}

impl Instrument {
    fn lane(self) -> &'static str {
        match self {
            Self::Catalog => "quality",
            Self::Security => "security",
        }
    }
    fn name(self) -> &'static str {
        match self {
            Self::Catalog => "catalog",
            Self::Security => "security",
        }
    }
    fn version(self) -> &'static str {
        match self {
            Self::Catalog => catalog::CATALOG_VERSION,
            Self::Security => catalog::security::VERSION,
        }
    }
    /// Whether the answers compose into a health number. Security answers
    /// never do: nothing in the probe supported averaging them.
    fn scores(self) -> bool {
        self == Self::Catalog
    }
    fn file_request(self, path: &str, source: &str) -> Value {
        match self {
            Self::Catalog => catalog::file_request(path, source),
            Self::Security => catalog::security::file_request(path, source),
        }
    }
    fn change_request(self, before: &str, after: &str) -> Value {
        match self {
            Self::Catalog => catalog::change_request(before, after),
            Self::Security => catalog::security::change_request(before, after),
        }
    }
    fn patch_request(self, patch: &str) -> Value {
        match self {
            Self::Catalog => catalog::patch_request(patch),
            Self::Security => catalog::security::patch_request(patch),
        }
    }
    fn described(self) -> Value {
        match self {
            Self::Catalog => catalog::described(),
            Self::Security => catalog::security::described(),
        }
    }
    /// Every check an answer to this instrument's request may carry. A quality
    /// change is asked the security questions too, so the quality lane collects
    /// all three catalogs; a file is only ever asked its own.
    fn ids(self) -> Vec<String> {
        let own: Vec<String> = match self {
            Self::Catalog => catalog::properties()
                .iter()
                .chain(catalog::risks())
                .map(|c| c.id.clone())
                .collect(),
            Self::Security => Vec::new(),
        };
        own.into_iter()
            .chain(catalog::security::checks().iter().map(|c| c.id.clone()))
            .collect()
    }
    fn policy(self) -> Value {
        match self {
            Self::Catalog => json!({"present_at": catalog::PRESENT_AT,
                "composition": "health is the mean of the catalog answers, computed by this CLI",
                "aggregation": "directory and repository health weight files by size",
                "cutoffs": "none; no threshold in this project has survived calibration",
                "fail_on_finding": false}),
            Self::Security => json!({"present_at": catalog::PRESENT_AT,
                "composition": "none; a file is clean or it names what fired, and nothing is averaged",
                "aggregation": "files flagged, counted by check",
                "cutoffs": "none; a finding is shown with its value and its evidence",
                "fail_on_finding": false}),
        }
    }
}

/// The model the catalogs were calibrated against, asked unless
/// `TYPESAFE_DEFAULT_MODEL` names another.
const MODEL: &str = "jev-1.13.0";
const BASE_URL: &str = "https://api.typesafe.ai";

/// The model every request names. `TYPESAFE_DEFAULT_MODEL` is the variable
/// TypeSafe's own SDKs read, so a gateway that names Jev differently works the
/// way it already does for them.
fn model() -> &'static str {
    static MODEL_IN_USE: std::sync::OnceLock<String> = std::sync::OnceLock::new();
    MODEL_IN_USE.get_or_init(|| setting("TYPESAFE_DEFAULT_MODEL").unwrap_or_else(|| MODEL.into()))
}

/// Where requests go: `TYPESAFE_BASE_URL`, read as TypeSafe's SDKs read it,
/// with the API path appended.
fn endpoint() -> Result<&'static str, String> {
    static ENDPOINT: std::sync::OnceLock<Result<String, String>> = std::sync::OnceLock::new();
    ENDPOINT
        .get_or_init(|| endpoint_for(setting("TYPESAFE_BASE_URL").as_deref()))
        .as_ref()
        .map(String::as_str)
        .map_err(Clone::clone)
}

/// The key travels with every request, so it only ever goes over TLS, or in
/// the clear to this machine.
fn endpoint_for(base: Option<&str>) -> Result<String, String> {
    let base = base.unwrap_or(BASE_URL).trim_end_matches('/');
    let local = matches!(host(base), "localhost" | "127.0.0.1" | "[::1]");
    if base.starts_with("https://") || (base.starts_with("http://") && local) {
        Ok(format!("{base}/v1/systemone"))
    } else {
        Err(format!(
            "TYPESAFE_BASE_URL must be an https:// URL (http:// only for localhost), not {base}"
        ))
    }
}

/// The host of a URL, which is what a person needs to see to know where their
/// requests and key are going.
fn host(url: &str) -> &str {
    let rest = url.split_once("://").map_or(url, |(_, rest)| rest);
    let authority = rest.split(['/', '?', '#']).next().unwrap_or(rest);
    let authority = authority
        .rsplit_once('@')
        .map_or(authority, |(_, host)| host);
    match authority.find(']') {
        Some(end) if authority.starts_with('[') => &authority[..=end],
        _ => authority.split(':').next().unwrap_or(authority),
    }
}

/// An environment variable, where blank means unset as it does for the SDKs.
fn setting(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}
// Jev 1.13.0 documents 32k tokens for state plus the longest question and 64k
// for state plus every question. This budget targets the tighter limit and
// leaves room for the estimate below to be wrong. Source is never truncated;
// a file over budget is assessed as windows instead.
const MAX_REQUEST_TOKENS: usize = 30_000;
// Bytes per token, deliberately low. A 105,562-byte Rust file measured 3.8
// bytes per token on jev-1.13.0; dense, minified or non-Latin source packs more
// tokens into the same bytes, so estimating low keeps us inside the limit.
const BYTES_PER_TOKEN: usize = 3;
// A run of base64 characters at least this long is counted at a token a byte.
// Identifiers and URLs in ordinary source stay well under it.
const DENSE_RUN: usize = 64;
// Nothing larger is read into memory, whether it would be windowed or not.
const MAX_SOURCE_BYTES: usize = 4 << 20;
// A declaration larger than half the budget is split at its own children rather
// than kept whole as a window boundary. Without this a file holding a single
// large class has one boundary, so it cannot be split at all, and most Java
// files hold a single class.
const SPLIT_INSIDE_BYTES: usize = MAX_REQUEST_TOKENS * BYTES_PER_TOKEN / 2;
const MAX_RESPONSE_BYTES: u64 = 1_048_576;
// Shared by every construct that does not supply wording of its own.
// Used in place of GRADING_TASK when only part of a file is supplied.
// The largest movement seen between two identical requests when this rubric
// family was measured on real files: 28 source snapshots across 8 constructs,
// where the median difference was 0.075 and the largest 0.700. A movement no
// larger than this is reported with that fact attached rather than hidden. It
// is an observed maximum, not a statistical threshold, and an identical request
// is answered from cache anyway, so an unchanged file usually moves by zero.
// Weakest maintainability first, then readability, then Jev's own overall answer.
// These are the two constructs with calibrated cutoffs and human references.

const HELP: &str = "Code quality powered by Jev.

Usage:
  supercov quality [file-or-directory ...]     assess code, saving a snapshot
  supercov quality gaps [snapshot]             only files something fired on
  supercov quality file <path> [snapshot]      one file, every check
  supercov quality scope                       which files are assessed, and why
  supercov quality snapshots                   list saved assessments
  supercov quality clean [--keep N]            remove saved assessments
  supercov quality show [snapshot]             read a saved assessment
  supercov quality diff <snapshot> <snapshot>  what declined between two
  supercov quality patch [file-or-directory]   what a change introduced

Change range (quality patch). With none of these, it reviews uncommitted work
when the tree is dirty and everything since this branch left its default branch
when it is clean:
  --unstaged          Working tree against the index
  --staged            Index against HEAD: what a commit would contain
  --base <ref>        Working tree against the merge base with a branch or tag

Patch options:
  --annotate github   Print GitHub workflow annotations; posts nothing
  --run <id|latest>   Cross the findings with a saved coverage run, to see what
                      a change introduced in code no test exercises

Assessment options:
  --all               Include test files, generated output and anything outside
                      a source root, all of which are left out by default
  --json              Print the report as JSON
  --dry-run           Print exact request bodies as JSON; no API call, no writes
  --refresh           Bypass cached responses

Reading options:
  --json              Print the view as JSON
  --limit <n>         Rows to show, 0 for all of them (default 20)

Environment:
  TYPESAFE_API_KEY        API key; assessing needs one, reading never does
  TYPESAFE_BASE_URL       Another host serving the same API, such as
                          https://openrouter.ai/api (default https://api.typesafe.ai)
  TYPESAFE_DEFAULT_MODEL  The model to ask for (default jev-1.13.0)

Twelve named properties are asked of each file as yes/no questions, and the
arithmetic that turns twelve answers into one number is done here rather than by
the model, so every part of a score is a claim you can check against the file.
Text reports a band because the measured resolution is about a point; --json
carries the number.

With no path the subject is this repository. Which files that means is decided
the way coverage decides it: source roots found from package manifests, with
test code and generated output left out, and anything under no recognised root
reported rather than guessed at. SUPERCOV_SOURCE_ROOTS=src,app declares them.

Cache: .supercov/quality/requests/ (exact request hash; --refresh to reassess).
Snapshots: .supercov/quality/snapshots/.
";

const HELP_SECURITY: &str = "Security surface powered by Jev.

Usage:
  supercov security [file-or-directory ...]    assess code, saving a snapshot
  supercov security gaps [snapshot]            only files something fired on
  supercov security file <path> [snapshot]     one file, every check
  supercov security scope                      which files are assessed, and why
  supercov security snapshots                  list saved assessments
  supercov security show [snapshot]            read a saved assessment
  supercov security diff <snapshot> <snapshot> what appeared between two
  supercov security patch [file-or-directory]  what a change introduced

Change range (security patch), as for quality patch:
  --unstaged          Working tree against the index
  --staged            Index against HEAD: what a commit would contain
  --base <ref>        Working tree against the merge base with a branch or tag

Options shared with quality:
  --run <id|latest>   Cross the findings with a saved coverage run, to see which
                      flagged files no test exercises
  --annotate github   (patch) Print GitHub workflow annotations; posts nothing
  --all               Include test files, generated output and anything outside
                      a source root
  --json              Print the report or view as JSON
  --dry-run           Print exact request bodies as JSON; no API call, no writes
  --refresh           Bypass cached responses
  --limit <n>         Rows to show, 0 for all of them (default 20)

Environment:
  TYPESAFE_API_KEY        API key; assessing needs one, reading never does
  TYPESAFE_BASE_URL       Another host serving the same API, such as
                          https://openrouter.ai/api (default https://api.typesafe.ai)
  TYPESAFE_DEFAULT_MODEL  The model to ask for (default jev-1.13.0)

Twelve named security surfaces are asked of each file as yes/no questions: a
query built from a caller's value, a path taken from a request, a handler with
no visible authorisation check, and so on, each mapped to the CWE classes it
stands for. Nothing is averaged. A file is clean or it names what fired, with
the value and what is known about that check's accuracy.

Cache: .supercov/security/requests/. Snapshots: .supercov/security/snapshots/.
";

#[derive(Default, Debug)]
struct Options {
    paths: Vec<PathBuf>,
    /// Assess test files and generated output too, which discovery leaves out.
    all: bool,
    json: bool,
    dry_run: bool,
    refresh: bool,
    context: Option<PathBuf>,
    /// A saved coverage run to cross the findings with.
    run: Option<String>,
}

/// What the user asked for: a new assessment, or a reading of a saved one.
/// Reading never contacts the provider.
enum Command {
    Snapshots {
        json: bool,
        limit: usize,
    },
    /// Which files an assessment is about, and why, mirroring `runs scope`.
    Scope {
        json: bool,
        limit: usize,
    },
    /// Only the files something fired on, mirroring `runs gaps`.
    Gaps {
        snapshot: Option<String>,
        json: bool,
        limit: usize,
    },
    Show {
        snapshot: Option<String>,
        json: bool,
        limit: usize,
    },
    File {
        path: String,
        snapshot: Option<String>,
        json: bool,
    },
    Diff {
        from: String,
        to: String,
        json: bool,
        limit: usize,
    },
    /// Remove saved assessments, newest kept first.
    Clean {
        keep: usize,
        dry_run: bool,
        json: bool,
    },
    /// The catalog: twelve named properties, composed here. The default.
    Health(Options),
    /// Ask the same catalog what a change introduced.
    Patch {
        /// A saved coverage run to cross the findings with.
        run: Option<String>,
        /// None means: work out what to review from the repository.
        range: Option<changes::Range>,
        paths: Vec<PathBuf>,
        json: bool,
        refresh: bool,
        limit: usize,
        annotate: bool,
        all: bool,
    },
}

/// The change range, shared by any command that works on a change rather than
/// on a tree. Kept separate from scan's options so a later command can take the
/// same three flags without inheriting the rest.
fn parse_patch(arguments: Vec<String>) -> Result<Command, String> {
    let (mut range, mut json, mut refresh, mut limit) = (None, false, false, None);
    let mut annotate = false;
    let mut all = false;
    let mut run = None;
    let mut paths = Vec::new();
    let mut arguments = arguments.into_iter();
    let set = |chosen: changes::Range, slot: &mut Option<changes::Range>| match slot {
        Some(existing) if *existing != chosen => {
            Err("pick one change range: --unstaged, --staged or --since <ref>".to_string())
        }
        slot => {
            *slot = Some(chosen);
            Ok(())
        }
    };
    while let Some(argument) = arguments.next() {
        match argument.as_str() {
            "--json" => json = true,
            "--refresh" => refresh = true,
            "--all" => all = true,
            "--unstaged" => set(changes::Range::Unstaged, &mut range)?,
            "--staged" | "--cached" => set(changes::Range::Staged, &mut range)?,
            "--base" => {
                let reference = arguments
                    .next()
                    .ok_or("--base needs a commit, branch or tag")?;
                set(changes::Range::Base(reference), &mut range)?;
            }
            "--run" => {
                run = Some(arguments.next().ok_or("--run needs a run id, or latest")?);
            }
            "--annotate" => {
                // Only GitHub's form exists, and naming it keeps room for others.
                match arguments.next().as_deref() {
                    Some("github") => annotate = true,
                    Some(other) => {
                        return Err(format!("--annotate does not know {other}; use github"));
                    }
                    None => return Err("--annotate needs a format; use github".into()),
                }
            }
            "--limit" => {
                limit = Some(
                    arguments
                        .next()
                        .ok_or("--limit needs a number")?
                        .parse::<usize>()
                        .map_err(|_| "--limit needs a number")?,
                );
            }
            other if other.starts_with("--") => {
                return Err(format!("unknown option {other} for quality patch"));
            }
            other => paths.push(PathBuf::from(other)),
        }
    }
    Ok(Command::Patch {
        // Resolved against the repository when the command runs, because which
        // range makes sense depends on whether the tree is dirty.
        range,
        paths,
        json,
        refresh,
        limit: limit.unwrap_or(20),
        annotate,
        all,
        run,
    })
}

/// The first argument is a subcommand only when it is one of the reserved
/// words. A directory that happens to be called `show` is still assessable as
/// `supercov quality scan show`.
fn parse(arguments: Vec<String>) -> Result<Command, String> {
    let subcommand = arguments.first().map_or("", String::as_str);
    let rest = || arguments[1..].to_vec();
    match subcommand {
        "scan" => Ok(Command::Health(defaulted(parse_scan(rest())?))),
        "snapshots" | "show" | "gaps" | "scope" | "file" | "diff" => parse_view(subcommand, rest()),
        "clean" => parse_clean(rest()),
        "patch" => parse_patch(rest()),
        _ => Ok(Command::Health(defaulted(parse_scan(arguments)?))),
    }
}

fn parse_clean(arguments: Vec<String>) -> Result<Command, String> {
    let mut keep = None;
    let mut dry_run = false;
    let mut json = false;
    let mut arguments = arguments.into_iter();
    while let Some(argument) = arguments.next() {
        match argument.as_str() {
            "--dry-run" => dry_run = true,
            "--json" => json = true,
            "--keep" => {
                let value = arguments
                    .next()
                    .and_then(|value| value.parse::<usize>().ok())
                    .ok_or("--keep requires a count of assessments to retain")?;
                if keep.replace(value).is_some() {
                    return Err("--keep may only be specified once".into());
                }
            }
            value => return Err(format!("unknown quality clean option: {value}")),
        }
    }
    Ok(Command::Clean {
        keep: keep.unwrap_or(0),
        dry_run,
        json,
    })
}

/// Remove saved assessments, keeping the newest.
///
/// An assessment costs money and cannot be reproduced from the repository, so
/// this is never part of cleaning up after a run: it only happens when somebody
/// asks for it by name. Snapshots are ordered by when they were taken, never by
/// their identifiers, which carry no order.
fn clean(root: &Path, lane: &str, keep: usize, dry_run: bool) -> Result<Value, String> {
    let saved = store::list(root, lane)?;
    let removed: Vec<String> = saved.iter().skip(keep).map(|(id, _)| id.clone()).collect();
    if !dry_run {
        for id in &removed {
            let directory = store::snapshots(root, lane).join(id);
            if !store::is_snapshot_id(id) {
                continue;
            }
            fs::remove_dir_all(&directory).map_err(|e| format!("{}: {e}", directory.display()))?;
        }
        // The pointer may name something just removed. Dropping it is enough:
        // resolving a snapshot already falls back to the newest that survives.
        let pointer = store::snapshots(root, lane).join("latest");
        if let Ok(named) = fs::read_to_string(&pointer)
            && removed.iter().any(|id| id == named.trim())
        {
            let _ = fs::remove_file(&pointer);
        }
    }
    Ok(json!({
        "view": format!("{lane}.clean"),
        "dry_run": dry_run,
        "kept": saved.len().saturating_sub(removed.len()),
        "removed": removed,
    }))
}

fn parse_view(kind: &str, arguments: Vec<String>) -> Result<Command, String> {
    let mut json = false;
    let mut limit = None;
    let mut positional = Vec::new();
    let mut arguments = arguments.into_iter();
    while let Some(argument) = arguments.next() {
        match argument.as_str() {
            "--json" => json = true,
            "--limit" => {
                let value = arguments
                    .next()
                    .and_then(|value| value.parse::<usize>().ok())
                    .ok_or("--limit requires a row count, or 0 for every row")?;
                if limit.replace(value).is_some() {
                    return Err("--limit may only be specified once".into());
                }
            }
            "--" => positional.extend(arguments.by_ref()),
            value if value.starts_with('-') => {
                return Err(format!("unknown quality {kind} option: {value}"));
            }
            _ => positional.push(argument),
        }
    }
    if kind == "file" && limit.is_some() {
        return Err(format!(
            "quality {kind} shows one thing and takes no --limit"
        ));
    }
    let limit = limit.unwrap_or(query::DEFAULT_LIMIT);
    let mut positional = positional.into_iter();
    let mut required = |what: &str| {
        positional
            .next()
            .ok_or_else(|| format!("quality {kind} requires {what}"))
    };
    Ok(match kind {
        "snapshots" => Command::Snapshots { json, limit },
        "scope" => Command::Scope { json, limit },
        "gaps" => Command::Gaps {
            snapshot: positional.next(),
            json,
            limit,
        },
        "show" => Command::Show {
            snapshot: positional.next(),
            json,
            limit,
        },
        "file" => Command::File {
            path: required("a file path")?,
            snapshot: positional.next(),
            json,
        },
        "diff" => Command::Diff {
            from: required("two snapshots to compare")?,
            to: required("a second snapshot to compare")?,
            json,
            limit,
        },
        other => return Err(format!("unknown quality view: {other}")),
    })
}

/// With no path, the subject is everything here. `supercov quality` should say
/// something about this repository without being told where to look, the way
/// `supercov runs` needs no argument.
fn here() -> Vec<PathBuf> {
    vec![PathBuf::from(".")]
}

fn defaulted(mut options: Options) -> Options {
    if options.paths.is_empty() {
        options.paths = here();
    }
    options
}

fn parse_scan(args: Vec<String>) -> Result<Options, String> {
    let mut options = Options::default();
    let mut args = args.into_iter();
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--json" => options.json = true,
            "--dry-run" => options.dry_run = true,
            "--refresh" => options.refresh = true,
            "--all" => options.all = true,
            "--run" => {
                let selector = args
                    .next()
                    .filter(|s| !s.starts_with('-'))
                    .ok_or("--run requires a run id or `latest`")?;
                if options.run.replace(selector).is_some() {
                    return Err("--run may only be specified once".into());
                }
            }
            "--context" => {
                let path = args
                    .next()
                    .filter(|s| !s.starts_with('-'))
                    .ok_or("--context requires a file")?;
                if options.context.replace(path.into()).is_some() {
                    return Err("--context may only be specified once".into());
                }
            }
            "--" => {
                options.paths.extend(args.map(PathBuf::from));
                break;
            }
            value if value.starts_with('-') => {
                return Err(format!("unknown quality option: {value}"));
            }
            path => options.paths.push(path.into()),
        }
    }
    // No path is not an error: the caller fills in this directory. Asking for
    // the quality of the repository you are standing in should need no argument.
    Ok(options)
}

/// A contiguous group of whole top-level declarations, in one-based inclusive
/// lines. The windows of a file partition it: every line belongs to exactly one.
#[derive(Debug, Clone, Serialize)]
struct Window {
    index: usize,
    of: usize,
    start_line: usize,
    end_line: usize,
    declarations: Vec<String>,
}

/// Tokens the provider is likely to charge for a serialized request. An
/// estimate, never a measurement; `BYTES_PER_TOKEN` explains the direction.
///
/// A long run of base64 characters, such as an image inlined into an HTML
/// report, is counted at a token per byte. Such text has no words for a
/// tokenizer to merge: a 74,653-byte report whose inline images made up
/// 33,804 bytes was estimated at 24,885 tokens, sent, and rejected by the API
/// as too large. Measured against 1,367 requests whose real input counts the
/// API reported, this estimate is below the real count once, by 3%, which the
/// gap between `MAX_REQUEST_TOKENS` and the model's limit absorbs.
fn estimated_tokens(bytes: &[u8]) -> usize {
    let dense = |b: &u8| b.is_ascii_alphanumeric() || matches!(b, b'+' | b'/' | b'=' | b'_' | b'-');
    let mut runs = 0;
    let mut run = 0;
    for byte in bytes {
        if dense(byte) {
            run += 1;
        } else {
            if run >= DENSE_RUN {
                runs += run;
            }
            run = 0;
        }
    }
    if run >= DENSE_RUN {
        runs += run;
    }
    (bytes.len() - runs).div_ceil(BYTES_PER_TOKEN) + runs
}

/// The serialized request, when it fits the token budget.
fn within_budget(request: &Value) -> Result<Option<Vec<u8>>, String> {
    let bytes = serde_json::to_vec(request).map_err(|e| e.to_string())?;
    Ok((estimated_tokens(&bytes) <= MAX_REQUEST_TOKENS).then_some(bytes))
}

/// Byte offset of every line start, so a window can be sliced without
/// rewriting a single byte. Line endings stay exactly as the file has them.
fn line_starts(source: &str) -> Vec<usize> {
    std::iter::once(0)
        .chain(source.match_indices('\n').map(|(i, _)| i + 1))
        .filter(|start| *start < source.len())
        .collect()
}

fn window_source<'s>(source: &'s str, starts: &[usize], window: &Window) -> &'s str {
    let from = starts[window.start_line - 1];
    let to = starts.get(window.end_line).copied().unwrap_or(source.len());
    &source[from..to]
}

/// The declarations a file is split around: its top-level ones, descending into
/// any declaration too large to send on its own. A file that is a single class
/// splits at that class's methods, rather than having one boundary and so no
/// way to be split at all. `None` when Supercov has no parser for the language
/// or the file does not parse.
fn split_units(path: &str, source: &str) -> Option<(Value, Vec<(String, usize)>)> {
    let code = supercov_engine::source_units::code(path, source)?;
    let lines = line_starts(source);
    let offset = |line: usize, column: usize| {
        lines
            .get(line - 1)
            .map_or(source.len(), |start| start + column - 1)
    };
    let children = |parent: usize| -> Vec<usize> {
        code.units
            .iter()
            .enumerate()
            .filter(|(_, unit)| unit.parent == Some(parent))
            .map(|(index, _)| index)
            .collect()
    };
    fn collect(
        parent: usize,
        children: &impl Fn(usize) -> Vec<usize>,
        span: &impl Fn(usize) -> usize,
        found: &mut Vec<usize>,
    ) {
        for index in children(parent) {
            let inner = children(index);
            if span(index) > SPLIT_INSIDE_BYTES && !inner.is_empty() {
                collect(index, children, span, found);
            } else {
                found.push(index);
            }
        }
    }
    let span = |index: usize| {
        let unit = &code.units[index];
        offset(unit.end_line, unit.end_column).saturating_sub(offset(unit.line, unit.column))
    };
    let mut found = Vec::new();
    collect(0, &children, &span, &mut found);
    let units: Vec<&supercov_engine::source_units::Unit> =
        found.iter().map(|index| &code.units[*index]).collect();
    let outline = Value::Array(
        units
            .iter()
            .map(|unit| {
                json!({"name": unit.path, "kind": unit.kind, "start_line": unit.line, "end_line": unit.end_line})
            })
            .collect(),
    );
    Some((
        outline,
        units
            .iter()
            .map(|unit| (unit.path.clone(), unit.line))
            .collect(),
    ))
}

/// Every line of the file assigned to one candidate window, split only at the
/// first line of a top-level declaration. Code before the first declaration
/// joins it rather than becoming a window of its own.
/// Where a file may be split: its declarations when Supercov parses it, and
/// otherwise the whole file as one piece for the caller to cut at lines.
fn window_candidates(path: &str, source: &str, lines: &[usize]) -> Vec<Window> {
    candidates(path, source, lines).map_or_else(
        || {
            vec![Window {
                index: 1,
                of: 1,
                start_line: 1,
                end_line: lines.len().max(1),
                declarations: Vec::new(),
            }]
        },
        |(_, windows)| windows,
    )
}

fn candidates(path: &str, source: &str, lines: &[usize]) -> Option<(Value, Vec<Window>)> {
    let (outline, top) = split_units(path, source)?;
    if top.is_empty() {
        return None;
    }
    let mut boundaries: Vec<usize> = top.iter().map(|(_, line)| *line).collect();
    boundaries.dedup();
    let windows = boundaries
        .iter()
        .enumerate()
        .map(|(index, boundary)| {
            let start_line = if index == 0 { 1 } else { *boundary };
            let end_line = boundaries
                .get(index + 1)
                .map_or(lines.len(), |next| next - 1);
            Window {
                index: index + 1,
                of: boundaries.len(),
                start_line,
                end_line,
                declarations: top
                    .iter()
                    .filter(|(_, line)| *line >= start_line && *line <= end_line)
                    .map(|(name, _)| name.clone())
                    .collect(),
            }
        })
        .collect();
    Some((outline, windows))
}

fn digest(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn is_source(path: &Path) -> bool {
    matches!(
        path.extension().and_then(|s| s.to_str()),
        Some(
            "js" | "jsx"
                | "mjs"
                | "cjs"
                | "ts"
                | "tsx"
                | "mts"
                | "cts"
                | "rs"
                | "py"
                | "pyi"
                | "rb"
                | "go"
                | "java"
                | "kt"
                | "kts"
                | "c"
                | "h"
                | "cc"
                | "cpp"
                | "hpp"
                | "cs"
                | "swift"
                | "php"
        )
    )
}

/// Why a file is left out of an assessment by default.
///
/// Not a judgment that the code does not matter. A score is about the code you
/// ship, these files cost a request each, and several checks encode assumptions
/// that are wrong for them: duplication between two test cases is often
/// deliberate and good, and a literal in a fixture is the fixture.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Skipped {
    Test,
    Generated,
}

impl Skipped {
    fn reason(self) -> &'static str {
        match self {
            Skipped::Test => "test",
            Skipped::Generated => "generated",
        }
    }
}

/// Directory names that mean test code in every language this assesses.
const TEST_DIRECTORIES: &[&str] = &[
    "__mocks__",
    "__snapshots__",
    "__tests__",
    "cypress",
    "e2e",
    "features",
    "fixture",
    "fixtures",
    "mock",
    "mocks",
    "spec",
    "specs",
    "test",
    "testdata",
    "tests",
];

/// A directory that holds tests, by name or by suffix.
///
/// The suffix form covers `runtime-tests` in Hono and `Shop.Tests` in .NET, and
/// requires a separator before it so `contest` and `latest` stay source.
pub(super) fn is_test_directory(segment: &str) -> bool {
    if TEST_DIRECTORIES.contains(&segment) {
        return true;
    }
    ["test", "tests", "spec", "specs"].iter().any(|word| {
        segment.len() > word.len() + 1
            && segment.ends_with(word)
            && matches!(
                segment.as_bytes()[segment.len() - word.len() - 1],
                b'-' | b'_' | b'.'
            )
    })
}

/// A CamelCase suffix that names a test class, for the languages that spell it
/// that way rather than with a separator: Java, Kotlin, C#, Swift, PHP.
fn camel_test_suffix(stem: &str) -> bool {
    for suffix in ["Test", "Tests", "TestCase", "TestCases", "Spec", "Specs"] {
        if stem.len() > suffix.len() && stem.ends_with(suffix) {
            return true;
        }
    }
    // `OrderIT` is an integration test; `AUDIT` is not. Requiring a lowercase
    // letter before the suffix separates them.
    stem.len() > 2
        && stem.ends_with("IT")
        && stem
            .chars()
            .nth(stem.len() - 3)
            .is_some_and(|c| c.is_ascii_lowercase())
}

/// Whether a path is test code or generated output, and which.
///
/// Matching is on whole separator-delimited parts, never on substrings, so
/// `latest.ts`, `contest.rs`, `manifest.java` and `attestation.go` are source.
fn skipped_path(relative: &str) -> Option<Skipped> {
    let lower = relative.to_ascii_lowercase();
    let (directories, file) = match lower.rsplit_once('/') {
        Some((directories, file)) => (directories, file),
        None => ("", lower.as_str()),
    };
    if directories.split('/').any(is_test_directory) {
        return Some(Skipped::Test);
    }
    let parts: Vec<&str> = file.split(['.', '_', '-']).collect();
    if parts.iter().any(|part| matches!(*part, "test" | "spec")) {
        return Some(Skipped::Test);
    }
    if matches!(
        file,
        "conftest.py" | "spec_helper.rb" | "test_helper.rb" | "rails_helper.rb"
    ) {
        return Some(Skipped::Test);
    }
    let stem = relative.rsplit('/').next().unwrap_or(relative);
    let stem = stem.split('.').next().unwrap_or(stem);
    if camel_test_suffix(stem) {
        return Some(Skipped::Test);
    }
    // Type declarations carry no logic, and the rest are the file names that
    // code generators produce across these ecosystems.
    if lower.ends_with(".d.ts") || lower.ends_with(".d.mts") || lower.ends_with(".d.cts") {
        return Some(Skipped::Generated);
    }
    if lower.ends_with(".min.js")
        || lower.ends_with(".pb.go")
        || lower.ends_with(".pb.cc")
        || lower.ends_with(".pb.h")
        || lower.ends_with("_pb2.py")
        || lower.ends_with("_pb2_grpc.py")
        || lower.ends_with(".designer.cs")
        || lower.ends_with(".g.cs")
        || parts.contains(&"generated")
    {
        return Some(Skipped::Generated);
    }
    None
}

/// The marker a generator leaves in the file itself, which is the one signal
/// that does not depend on a naming convention. Go's is a standard; the others
/// are conventions wide enough to be worth reading.
fn generated_header(source: &str) -> bool {
    source
        .char_indices()
        .take_while(|(index, _)| *index < 2048)
        .last()
        .map(|(index, c)| &source[..index + c.len_utf8()])
        .unwrap_or(source)
        .lines()
        .take(20)
        .any(|line| {
            line.contains("Code generated by")
                || line.contains("@generated")
                || line.contains("DO NOT EDIT")
                || line.contains("do not edit")
                || line.contains("auto-generated")
                || line.contains("autogenerated")
        })
}

/// A directory an assessment never walks into. `target` is one only when a
/// build owns it; see `target_is_build_output`.
fn ignored_directory_at(path: &Path) -> bool {
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy())
        .unwrap_or_default();
    ignored_directory(&name)
        && (name != "target" || supercov_engine::source_discovery::target_is_build_output(path))
}

fn ignored_directory(name: &str) -> bool {
    matches!(
        name,
        "node_modules"
            | "target"
            | "vendor"
            | "dist"
            | "build"
            | "coverage"
            | "generated"
            | "__pycache__"
            | "venv"
            | "out"
    )
}

/// Which files an instrument reads. The complexity catalog reads source; the
/// security catalog also reads templates and configuration, because that is
/// where cross-site scripting and secrets are labelled in every corpus.
fn is_assessable(path: &Path, instrument: Instrument) -> bool {
    is_source(path) || (instrument == Instrument::Security && candidates::is_security_extra(path))
}

#[cfg(test)]
fn discover(root: &Path, paths: &[PathBuf]) -> Result<Vec<PathBuf>, String> {
    discover_for(root, paths, Instrument::Catalog)
}

fn discover_for(
    root: &Path,
    paths: &[PathBuf],
    instrument: Instrument,
) -> Result<Vec<PathBuf>, String> {
    let mut files = BTreeSet::new();
    for path in paths {
        let input = root.join(path);
        let metadata =
            fs::symlink_metadata(&input).map_err(|e| format!("{}: {e}", path.display()))?;
        if metadata.file_type().is_symlink() {
            return Err(format!(
                "symbolic link is not a quality target: {}",
                path.display()
            ));
        }
        let canonical = input.canonicalize().map_err(|e| e.to_string())?;
        if !canonical.starts_with(root) {
            return Err(format!(
                "quality target is outside current directory: {}",
                path.display()
            ));
        }
        for ancestor in input.ancestors().take_while(|ancestor| *ancestor != root) {
            if fs::symlink_metadata(ancestor)
                .map_err(|e| e.to_string())?
                .file_type()
                .is_symlink()
            {
                return Err(format!(
                    "symbolic link in quality target path: {}",
                    path.display()
                ));
            }
        }
        // Assessability is judged on the path inside the project: a JSON file
        // is configuration by its own directories, not by where the checkout
        // happens to sit.
        let inside = |path: &Path| path.strip_prefix(root).unwrap_or(path).to_owned();
        if metadata.is_file() {
            if !is_assessable(&inside(&canonical), instrument) {
                return Err(format!("unsupported source extension: {}", path.display()));
            }
            files.insert(canonical);
        } else if metadata.is_dir() {
            let walker = ignore::WalkBuilder::new(&canonical)
                .follow_links(false)
                .require_git(false)
                .filter_entry(|entry| {
                    entry.depth() == 0
                        || !entry.file_type().is_some_and(|t| t.is_dir())
                        || !ignored_directory_at(entry.path())
                })
                .build();
            for entry in walker {
                let entry = entry.map_err(|e| e.to_string())?;
                if entry.file_type().is_some_and(|t| t.is_file())
                    && is_assessable(&inside(entry.path()), instrument)
                {
                    files.insert(entry.into_path());
                }
            }
        } else {
            return Err(format!(
                "not a regular file or directory: {}",
                path.display()
            ));
        }
    }
    if files.is_empty() {
        return Err("no supported source files found".into());
    }
    Ok(files.into_iter().collect())
}

fn read_text(path: &Path) -> Result<String, String> {
    let file = fs::File::open(path).map_err(|e| e.to_string())?;
    let mut bytes = Vec::new();
    file.take(MAX_SOURCE_BYTES as u64 + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() > MAX_SOURCE_BYTES {
        return Err(format!(
            "source/context is larger than {MAX_SOURCE_BYTES} bytes and is not assessed"
        ));
    }
    String::from_utf8(bytes).map_err(|_| "source/context must be valid UTF-8".into())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ApiResponse {
    model: String,
    answers: BTreeMap<String, Answer>,
    usage: Usage,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Usage {
    input_tokens: u64,
    output_tokens: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
enum Answer {
    Noul {
        noul: f64,
    },
    Choice {
        choice: String,
        probabilities: BTreeMap<String, f64>,
        confidence: f64,
    },
    Score {
        score: f64,
        legend: BTreeMap<String, String>,
        probabilities: BTreeMap<String, f64>,
        confidence: f64,
    },
}

fn probability(value: f64) -> bool {
    value.is_finite() && (0.0..=1.0).contains(&value)
}

fn distribution(values: &BTreeMap<String, f64>, keys: BTreeSet<String>) -> bool {
    // Live responses round each probability to two decimal places separately.
    // Their serialized sum can therefore differ from one by up to n * 0.005.
    let rounding_error = values.len() as f64 * 0.005 + 1e-9;
    values.keys().cloned().collect::<BTreeSet<_>>() == keys
        && values.values().all(|&v| probability(v))
        && (values.values().sum::<f64>() - 1.0).abs() <= rounding_error
}

fn validate(response: &ApiResponse, request: &Value) -> Result<(), String> {
    // The calibrated model must answer as itself. A model someone chose is
    // often an alias a gateway resolves to a dated build, and the snapshot
    // records what was asked, so there is nothing to compare it with.
    if request["model"] == MODEL && response.model != MODEL {
        return Err(format!(
            "expected model {MODEL}, received {}",
            response.model
        ));
    }
    let questions = request["questions"]
        .as_object()
        .ok_or("invalid request questions")?;
    if response.answers.keys().collect::<BTreeSet<_>>() != questions.keys().collect::<BTreeSet<_>>()
    {
        return Err("response question IDs do not match request".into());
    }
    for (id, question) in questions {
        let valid = match &response.answers[id] {
            Answer::Noul { noul } => question["type"] == "noul" && probability(*noul),
            Answer::Choice {
                choice,
                probabilities,
                confidence,
            } => {
                let options = question["criteria"]
                    .as_object()
                    .filter(|_| question["type"] == "choice");
                options.is_some_and(|options| {
                    let keys: BTreeSet<String> = options.keys().cloned().collect();
                    keys.contains(choice)
                        && probability(*confidence)
                        && distribution(probabilities, keys)
                })
            }
            Answer::Score {
                score,
                legend,
                probabilities,
                confidence,
            } => {
                let levels = question["criteria"]
                    .as_array()
                    .filter(|_| question["type"] == "score");
                levels.is_some_and(|levels| {
                    let keys = (0..levels.len()).map(|i| i.to_string()).collect();
                    let expected: f64 = (0..levels.len())
                        .map(|i| {
                            i as f64 * probabilities.get(&i.to_string()).copied().unwrap_or(0.0)
                        })
                        .sum();
                    // The provider rounds the score and each probability
                    // independently. Bound both errors, including float noise.
                    let rounding_error =
                        0.005 * (1 + (0..levels.len()).sum::<usize>()) as f64 + 1e-9;
                    score.is_finite()
                        && *score >= 0.0
                        && *score <= (levels.len() - 1) as f64
                        && probability(*confidence)
                        && distribution(probabilities, keys)
                        && (*score - expected).abs() <= rounding_error
                        && legend.len() == levels.len()
                        && levels.iter().enumerate().all(|(i, level)| {
                            legend.get(&i.to_string()).map(String::as_str) == level.as_str()
                        })
                })
            }
        };
        if !valid {
            return Err(format!("invalid answer for {id}"));
        }
    }
    Ok(())
}

/// A validated Noul answer, or `None` when this question set did not ask it.
fn noul(response: &ApiResponse, id: &str) -> Option<f64> {
    match response.answers.get(id) {
        Some(Answer::Noul { noul }) => Some(*noul),
        _ => None,
    }
}

/// When the provider last asked everyone to wait, and for how long.
///
/// Eight requests run at once. Without somewhere shared to put a rate limit,
/// each worker discovers it alone, sleeps alone and wakes at the same moment as
/// the other seven, which is how a limit becomes a stampede. A worker checks
/// this before sending and waits out whatever is left.
static PAUSED_UNTIL: std::sync::Mutex<Option<Instant>> = std::sync::Mutex::new(None);

fn pause_for(delay: Duration) {
    let until = Instant::now() + delay;
    let mut slot = PAUSED_UNTIL
        .lock()
        .expect("the pause is only read and replaced");
    if slot.is_none_or(|current| current < until) {
        *slot = Some(until);
    }
}

fn wait_out_any_pause() {
    loop {
        let remaining = {
            let slot = PAUSED_UNTIL
                .lock()
                .expect("the pause is only read and replaced");
            match *slot {
                Some(until) => until.checked_duration_since(Instant::now()),
                None => None,
            }
        };
        match remaining {
            // A little jitter, so the workers do not all resume on the same
            // millisecond and reproduce the burst that caused the limit.
            Some(left) => std::thread::sleep(left + jitter()),
            None => return,
        }
    }
}

/// Up to 250ms, derived from the clock rather than a dependency.
fn jitter() -> Duration {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.subsec_nanos())
        .unwrap_or(0);
    Duration::from_millis((nanos % 250) as u64)
}

fn client() -> ureq::Agent {
    ureq::Agent::config_builder()
        .timeout_global(Some(Duration::from_secs(45)))
        .max_redirects(0)
        .http_status_as_error(false)
        .build()
        .new_agent()
}

fn evaluate(
    agent: &ureq::Agent,
    endpoint: &str,
    key: &str,
    request: &Value,
) -> Result<ApiResponse, String> {
    let host = host(endpoint);
    for attempt in 0..4 {
        wait_out_any_pause();
        let mut response = agent
            .post(endpoint)
            .header("Authorization", format!("Bearer {key}"))
            .send_json(request)
            .map_err(|_| {
                format!("{host} transport failed (connection, TLS or timeout); retry the command")
            })?;
        let status = response.status().as_u16();
        if (status == 429 || (500..600).contains(&status)) && attempt < 3 {
            let asked = response
                .headers()
                .get("retry-after")
                .and_then(|s| s.to_str().ok())
                .and_then(|s| s.parse::<u64>().ok());
            // A server naming a delay is telling us something; doubling from a
            // second is the guess to make when it does not. Either way the wait
            // is shared, so the other seven workers pause too.
            let delay = asked.unwrap_or(1 << attempt).min(MAX_BACKOFF_SECONDS);
            if asked.is_some_and(|seconds| seconds > MAX_BACKOFF_SECONDS) {
                return Err(format!(
                    "{host} HTTP {status} and asked for {} seconds, longer than this command \
                     will wait; try again later or with fewer paths",
                    asked.unwrap_or_default()
                ));
            }
            pause_for(Duration::from_secs(delay) + jitter());
            continue;
        }
        if !(200..300).contains(&status) {
            return Err(http_failure(host, status));
        }
        let mut bytes = Vec::new();
        response
            .body_mut()
            .as_reader()
            .take(MAX_RESPONSE_BYTES + 1)
            .read_to_end(&mut bytes)
            .map_err(|_| format!("failed to read the response from {host}"))?;
        if bytes.len() as u64 > MAX_RESPONSE_BYTES {
            return Err(format!("{host} response exceeds size limit"));
        }
        let parsed: ApiResponse = serde_json::from_slice(&bytes)
            .map_err(|_| format!("{host} returned an invalid response schema"))?;
        validate(&parsed, request)?;
        return Ok(parsed);
    }
    unreachable!("last attempt returns")
}

#[derive(Serialize, Deserialize)]
struct CacheEntry {
    request_hash: String,
    response: ApiResponse,
    elapsed_ms: u64,
}

fn cached(path: &Path, hash: &str, request: &Value) -> Result<Option<CacheEntry>, String> {
    match fs::read(path) {
        Ok(bytes) => {
            let entry: CacheEntry = serde_json::from_slice(&bytes)
                .map_err(|_| "invalid quality cache; use --refresh")?;
            if entry.request_hash != hash {
                return Err("quality cache hash mismatch; use --refresh".into());
            }
            validate(&entry.response, request)
                .map_err(|e| format!("{e} in cache; use --refresh"))?;
            Ok(Some(entry))
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(format!("cannot read quality cache: {e}")),
    }
}

fn save(path: &Path, entry: &CacheEntry) -> Result<(), String> {
    store::write_atomic(path, &serde_json::to_vec(entry).map_err(|e| e.to_string())?)
}

/// One request answered: from the cache when this exact request was answered
/// before, otherwise from the provider.
fn resolve(
    project_root: &Path,
    lane: &str,
    agent: &ureq::Agent,
    key: Option<&str>,
    refresh: bool,
    request: &Value,
    hash: &str,
) -> Result<(CacheEntry, bool, Option<String>), String> {
    let cache_path = store::responses(project_root, lane).join(format!("{hash}.json"));
    if !refresh {
        // The flat directory is where responses were cached before snapshots
        // existed. An answer saved there still answers this exact request.
        for path in [&cache_path, &store::legacy_response(project_root, hash)] {
            if let Some(entry) = cached(path, hash, request)? {
                return Ok((entry, true, None));
            }
        }
    }
    let key = key
        .filter(|s| !s.trim().is_empty())
        .ok_or("set TYPESAFE_API_KEY for uncached assessments, or use --dry-run")?;
    let started = Instant::now();
    let response = evaluate(agent, endpoint()?, key, request)?;
    let entry = CacheEntry {
        request_hash: hash.to_owned(),
        response,
        elapsed_ms: started.elapsed().as_millis() as u64,
    };
    let warning = save(&cache_path, &entry)
        .err()
        .map(|e| format!("assessment completed but cache could not be saved: {e}"));
    Ok((entry, false, warning))
}

/// How many requests are in flight at once. A scan spends nearly all its time
/// waiting on the provider, which allows 1,200 requests a minute, so a handful
/// in flight turns minutes into seconds while staying well inside that. Each
/// answer is saved under its own request hash, so no two threads ever write the
/// same file.
const CONCURRENCY: usize = 8;

/// The longest this command waits out a rate limit before giving the caller
/// their terminal back. A provider asking for longer is telling you to come
/// back later, not to sleep through it.
const MAX_BACKOFF_SECONDS: u64 = 30;

/// What Jev charges for input. Output is free, so this is the whole bill.
const USD_PER_MILLION_INPUT_TOKENS: f64 = 0.042;

/// A request answered: its hash, the answer, whether it came from the cache,
/// and any trouble saving it.
type Answered = Result<(String, CacheEntry, bool, Option<String>), String>;

/// Which request an answer belongs to: a file, and a window within it when the
/// file was too large to send whole.
type Slot = (usize, Option<usize>);

/// Answer every prepared request, a few at a time.
fn answer_all(
    root: &Path,
    lane: &str,
    agent: &ureq::Agent,
    key: Option<&str>,
    refresh: bool,
    pending: &[(Slot, Value, Vec<u8>)],
    progress: bool,
) -> BTreeMap<Slot, Answered> {
    use std::sync::atomic::{AtomicUsize, Ordering};
    let next = AtomicUsize::new(0);
    let finished = AtomicUsize::new(0);
    let answers = std::sync::Mutex::new(BTreeMap::new());
    std::thread::scope(|scope| {
        for _ in 0..CONCURRENCY.min(pending.len()) {
            scope.spawn(|| {
                loop {
                    let index = next.fetch_add(1, Ordering::Relaxed);
                    let Some((slot, request, bytes)) = pending.get(index) else {
                        return;
                    };
                    let hash = digest(bytes);
                    let answered = resolve(root, lane, agent, key, refresh, request, &hash)
                        .map(|(entry, hit, warning)| (hash, entry, hit, warning));
                    if progress {
                        let count = finished.fetch_add(1, Ordering::Relaxed) + 1;
                        eprintln!("[supercov] {lane}: {count}/{}", pending.len());
                    }
                    answers
                        .lock()
                        .expect("answers are only locked to insert one")
                        .insert(*slot, answered);
                }
            });
        }
    });
    answers
        .into_inner()
        .expect("answers are only locked to insert one")
}

/// Whether a report has nothing in it to read: every file it tried failed.
///
/// That, and not one oversized data file among five hundred, is what exit 2
/// ("Supercov could not complete the request") means. A report that assessed
/// 490 of 532 files is complete, names the rest with their reasons, and exits
/// 0; a script that treated 2 as failure was discarding it.
fn nothing_assessed(files: &[Value]) -> bool {
    !files.is_empty() && files.iter().all(|f| f["status"] == "failed")
}

/// The line that says some files were not assessed, for a report that is
/// otherwise complete.
fn unassessed_note(report: &Value) -> Option<String> {
    let files = report["files"].as_array()?;
    let failed = files.iter().filter(|f| f["status"] == "failed").count();
    (failed > 0 && failed < files.len()).then(|| {
        format!(
            "[supercov] {failed} of {} files could not be assessed; each is listed in the \
             report with its reason",
            files.len()
        )
    })
}

/// What a refused request most likely means, by status. One message naming
/// credentials, quota and size together sent a reader to their key for a file
/// that was simply too large.
fn http_failure(host: &str, status: u16) -> String {
    let cause = match status {
        400 | 413 => {
            "the request was refused, most often because it is larger than the \
                      model accepts"
        }
        401 | 403 => "the key was refused; check TYPESAFE_API_KEY",
        402 | 429 => "the account is out of quota or rate-limited; try again later",
        _ => "the request failed",
    };
    format!("{host} HTTP {status}: {cause}")
}

/// A saved view: JSON for a program, text for a person. Reading never fails
/// the command on the strength of what it found.
/// Windows for a file too large to send whole, planned for the catalog.
///
/// A single file can be split where a pair of versions cannot: there is only
/// one text, so a window is still a real piece of code to ask about. Windows
/// merge greedily while the merged request still fits, which keeps their number
/// down and each one as wide as possible.
///
/// Sized with the instrument's own request, which is the one sent: the
/// security questions are longer than the catalog's, so a window planned for
/// the catalog could still be over budget when security sent it.
///
/// A piece too large to send on its own is cut at line boundaries: a file
/// with no parser, such as a template, or one declaration larger than the
/// budget. Only a single line over the budget cannot be assessed, and the
/// error says so.
fn catalog_windows(
    path: &str,
    source: &str,
    instrument: Instrument,
) -> Result<Vec<(Window, String)>, String> {
    let starts = line_starts(source);
    let fits = |window: &Window| -> Result<bool, String> {
        let text = window_source(source, &starts, window);
        Ok(within_budget(&instrument.file_request(path, text))?.is_some())
    };
    let mut pieces: Vec<Window> = Vec::new();
    for candidate in window_candidates(path, source, &starts) {
        if fits(&candidate)? {
            pieces.push(candidate);
            continue;
        }
        for line in candidate.start_line..=candidate.end_line {
            let piece = Window {
                index: 0,
                of: 0,
                start_line: line,
                end_line: line,
                declarations: candidate.declarations.clone(),
            };
            if !fits(&piece)? {
                return Err(format!(
                    "file is over the request budget and line {line} alone is too; \
                     it is probably minified or embeds data"
                ));
            }
            pieces.push(piece);
        }
    }
    let mut planned: Vec<Window> = Vec::new();
    for candidate in pieces {
        let merged = planned.last().map(|open| Window {
            index: open.index,
            of: open.of,
            start_line: open.start_line,
            end_line: candidate.end_line,
            declarations: [open.declarations.clone(), candidate.declarations.clone()].concat(),
        });
        match merged {
            Some(merged) if fits(&merged)? => {
                *planned.last_mut().expect("a window to merge into") = merged;
            }
            _ => planned.push(candidate),
        }
    }
    let total = planned.len();
    Ok(planned
        .into_iter()
        .enumerate()
        .map(|(index, mut window)| {
            window.index = index + 1;
            window.of = total;
            let text = window_source(source, &starts, &window).to_owned();
            (window, text)
        })
        .collect())
}

/// One subject to ask the smell catalog about: a file as it stands, or a file
/// before and after a change. Both produce the same twelve answers, so both
/// travel through one sender.
struct Subject {
    path: String,
    bytes: u64,
    /// SHA-256 of the whole file, even when it is assessed in windows, so a
    /// reader can tell whether a grade describes the source in front of them.
    sha256: String,
    request: Value,
    /// Set when this subject is not being asked the preferred question, so the
    /// report can say the answer is weaker rather than look the same.
    note: Option<String>,
}

/// Every answer for one subject, or why it has none.
struct Answers {
    /// Pass two: candidate lines the model confirmed, as `{line, check, value, text}`.
    lines: Vec<Value>,
    /// The graph stage's labels for this file's functions, in declaration
    /// order: `{takes_outside, reaches_sink, sanitises, sink_kind}`.
    labels: Vec<FunctionLabel>,
    /// Lines pass one already classified, when the first chunk of nodes rode
    /// on its request: node index to check.
    classified: BTreeMap<usize, String>,
    path: String,
    bytes: u64,
    sha256: String,
    /// How many requests this row came from. More than one means the file was
    /// windowed, which the report says.
    windows: usize,
    note: Option<String>,
    values: Option<BTreeMap<String, f64>>,
    cached: bool,
    error: Option<String>,
}

/// What the graph stage knows about one function after pass one.
#[derive(Debug, Clone, Default)]
struct FunctionLabel {
    takes_outside: f64,
    reaches_sink: f64,
    sanitises: f64,
    sink_kind: String,
}

fn classifications(response: &ApiResponse) -> BTreeMap<usize, String> {
    response
        .answers
        .keys()
        .filter_map(|key| {
            key.strip_prefix('n')
                .and_then(|n| n.parse::<usize>().ok())
                .map(|i| (i, key.clone()))
        })
        .filter_map(|(i, key)| {
            let (check, confidence) = choice_with_confidence(response, &key)?;
            (check != "none" && confidence >= CLASSIFY_CONFIDENCE).then_some((i, check))
        })
        .collect()
}

fn choice(response: &ApiResponse, id: &str) -> Option<String> {
    match response.answers.get(id) {
        Some(Answer::Choice { choice, .. }) => Some(choice.clone()),
        _ => None,
    }
}

/// The function labels an answer carries, read back by index until a key is
/// missing. A request that carried no function questions yields none.
fn function_labels(response: &ApiResponse) -> Vec<FunctionLabel> {
    let mut labels = Vec::new();
    let mut i = 0;
    while let Some(takes_outside) = noul(response, &format!("f{i}_takes_outside")) {
        labels.push(FunctionLabel {
            takes_outside,
            reaches_sink: noul(response, &format!("f{i}_reaches_sink")).unwrap_or(0.0),
            sanitises: noul(response, &format!("f{i}_sanitises")).unwrap_or(1.0),
            sink_kind: choice(response, &format!("f{i}_sink_kind"))
                .unwrap_or_else(|| "none".into()),
        });
        i += 1;
    }
    labels
}

/// Refuse before doing any work when there is no credential.
///
/// Without this the command discovered the problem once per file, deep inside
/// the sender, and every file failed separately: the result was an empty report
/// claiming a score over zero files, and an exit code of success.
///
/// The variable is the only way in on purpose. A key on the command line lands
/// in shell history and in the process list, where anyone on the machine can
/// read it.
///
/// The message names the command that was run: `security` shares this path
/// with `quality`, and an agent told "quality needs a key" after asking for a
/// security scan has reason to doubt which command it is looking at.
fn require_key(key: Option<&str>, instrument: Instrument) -> Result<(), String> {
    if key.is_some_and(|value| !value.trim().is_empty()) {
        return Ok(());
    }
    Err(format!(
        "{} needs a TypeSafe AI API key in TYPESAFE_API_KEY.\n\n  \
         export TYPESAFE_API_KEY=...        # this shell\n  \
         TYPESAFE_API_KEY=... supercov ...  # one command\n\n\
         Get one at https://typesafe.ai. Reading a saved assessment needs no key, \
         and --dry-run prints the exact requests without sending them.",
        instrument.lane()
    ))
}

/// What a set of requests will cost, before any of it is spent.
///
/// Output tokens are free, so the whole bill is the input, and the input is
/// known exactly from the bytes about to be sent. On a large monorepo this is
/// the difference between a surprise and a decision.
fn estimated_cost(pending: &[(Slot, Value, Vec<u8>)]) -> (usize, f64) {
    let tokens: usize = pending
        .iter()
        .map(|(_, _, bytes)| estimated_tokens(bytes))
        .sum();
    (tokens, tokens as f64 / 1e6 * USD_PER_MILLION_INPUT_TOKENS)
}

/// Send every subject, a few at a time, reusing the scan cache and retry path.
type Asked = (Vec<Answers>, Usage, Usage);

fn ask_smells(
    root: &Path,
    instrument: Instrument,
    key: Option<&str>,
    refresh: bool,
    subjects: Vec<Subject>,
    progress: bool,
) -> Asked {
    let agent = client();
    let mut pending = Vec::new();
    let mut out: Vec<Answers> = Vec::new();
    for (index, subject) in subjects.iter().enumerate() {
        let sendable = within_budget(&subject.request);
        let error = match &sendable {
            Ok(Some(_)) => None,
            Ok(None) => Some(format!(
                "over the {MAX_REQUEST_TOKENS} token request budget; a pair of versions \
                 cannot be split into windows the way one file can"
            )),
            Err(e) => Some(e.clone()),
        };
        if let Ok(Some(bytes)) = sendable {
            pending.push(((index, None), subject.request.clone(), bytes));
        }
        out.push(Answers {
            lines: Vec::new(),
            labels: Vec::new(),
            classified: BTreeMap::new(),
            path: subject.path.clone(),
            bytes: subject.bytes,
            sha256: subject.sha256.clone(),
            windows: 1,
            note: subject.note.clone(),
            values: None,
            cached: false,
            error,
        });
    }
    if progress && key.is_some() {
        let (tokens, usd) = estimated_cost(&pending);
        eprintln!(
            "[supercov] {}: {} requests to {} ({}), about {tokens} input tokens \
             (${usd:.4}) if none is cached",
            instrument.lane(),
            pending.len(),
            endpoint().map_or("?", host),
            model()
        );
    }
    let answered = answer_all(
        root,
        instrument.lane(),
        &agent,
        key,
        refresh,
        &pending,
        progress,
    );
    // Counted apart, because a cached answer costs nothing and reporting it as
    // spend would tell a reader their bill was 34 requests when it was none.
    let mut usage = Usage {
        input_tokens: 0,
        output_tokens: 0,
    };
    let mut reused = Usage {
        input_tokens: 0,
        output_tokens: 0,
    };
    for ((index, _), result) in answered {
        match result {
            Ok((_, entry, hit, warning)) => {
                let counted = if hit { &mut reused } else { &mut usage };
                counted.input_tokens += entry.response.usage.input_tokens;
                counted.output_tokens += entry.response.usage.output_tokens;
                // Every catalog the instrument's request may carry, because a
                // change is asked the risk and security questions too and
                // collecting only the complexity ones once silently threw
                // every risk answer away. A file is only ever asked its own
                // catalog, so nothing extra appears there and health stays the
                // mean of the same twelve.
                out[index].values = Some(
                    instrument
                        .ids()
                        .into_iter()
                        .filter_map(|id| Some((id.clone(), noul(&entry.response, &id)?)))
                        .collect(),
                );
                out[index].labels = function_labels(&entry.response);
                out[index].classified = classifications(&entry.response);
                out[index].cached = hit;
                out[index].error = warning;
            }
            Err(e) => out[index].error = Some(e),
        }
    }
    (out, usage, reused)
}

/// Fold a windowed file's answers back into one.
///
/// The highest value wins for each check, because every question is existential:
/// "does this file contain a method that..." is true if any window has one. The
/// note on a windowed file says which properties that reasoning does not serve.
fn combine_windows(answered: Vec<Answers>) -> Vec<Answers> {
    let mut order: Vec<String> = Vec::new();
    let mut merged: BTreeMap<String, Answers> = BTreeMap::new();
    for answer in answered {
        match merged.get_mut(&answer.path) {
            None => {
                order.push(answer.path.clone());
                merged.insert(answer.path.clone(), answer);
            }
            Some(into) => {
                into.bytes += answer.bytes;
                into.cached = into.cached && answer.cached;
                into.windows += 1;
                match (&mut into.values, answer.values) {
                    (Some(kept), Some(next)) => {
                        for (check, value) in next {
                            let slot = kept.entry(check).or_insert(value);
                            *slot = slot.max(value);
                        }
                    }
                    (slot @ None, next) => *slot = next,
                    (Some(_), None) => {}
                }
                if into.error.is_none() {
                    into.error = answer.error;
                }
            }
        }
    }
    order
        .into_iter()
        .filter_map(|path| merged.remove(&path))
        .collect()
}

/// Which checks fired: the shared cut for the complexity catalog, each
/// check's own fitted cut for security.
fn present_for(values: &BTreeMap<String, f64>, instrument: Instrument) -> Vec<(String, f64)> {
    match instrument {
        Instrument::Catalog => catalog::present(values),
        Instrument::Security => catalog::security::present(values),
    }
}

/// The line tier: the file questions gate, then a Choice per node over
/// only the checks that fired (four options, not thirteen, so a hundred
/// nodes fit beside the file), then confirmation. On fifteen held-out
/// repositories: F1 0.47 at $0.33, against 0.46 at $0.66 for a thirteen-way
/// Choice on every node of every file.
fn enumerate_lines() -> bool {
    true
}

fn narrow_nodes() -> bool {
    true
}

/// A file question at or above this sends the check into the narrowing
/// tier. Lower than the 0.6 that flags a file, because the exhaustive tier
/// found lines in files whose file question had not fired.
const LOCALISE_AT: f64 = 0.3;

/// What the line pass sends as state for a file: the whole file when it
/// fits the request budget, otherwise each of its catalog windows. A request
/// speaks in the view's own line numbers; everything stored is absolute.
/// Before this, a file over the budget had every line request skipped, and
/// the largest file of a repository is where its handlers live.
struct View {
    text: String,
    /// The absolute line number of the view's first line, less one.
    offset: usize,
    nodes: Vec<candidates::Node>,
    structure: candidates::Structure,
}

fn line_views(path: &str, source: &str, nodes: &[candidates::Node]) -> Vec<View> {
    let structure = candidates::structure(Path::new(path), source);
    if matches!(
        within_budget(&catalog::security::file_request(path, source)),
        Ok(Some(_))
    ) {
        return vec![View {
            text: source.to_string(),
            offset: 0,
            nodes: nodes.to_vec(),
            structure,
        }];
    }
    let Ok(windows) = line_windows(path, source) else {
        return Vec::new();
    };
    windows
        .into_iter()
        .map(|(window, text)| {
            let offset = window.start_line - 1;
            View {
                text,
                offset,
                nodes: candidates::spread(
                    nodes
                        .iter()
                        .filter(|n| n.line >= window.start_line && n.line <= window.end_line)
                        .map(|n| candidates::Node {
                            line: n.line - offset,
                            text: n.text.clone(),
                        })
                        .collect(),
                ),
                structure: candidates::Structure {
                    functions: structure
                        .functions
                        .iter()
                        .filter(|f| f.end >= window.start_line && f.start <= window.end_line)
                        .map(|f| candidates::FunctionSpan {
                            name: f.name.clone(),
                            start: f.start.max(window.start_line) - offset,
                            end: f.end.min(window.end_line) - offset,
                        })
                        .collect(),
                    imports: structure.imports.clone(),
                },
            }
        })
        .collect()
}

/// Windows for the line pass of a file too large to send whole: the same
/// declaration boundaries as the catalog's, merged while the merged text
/// stays under half the request budget, so thirty classification Choices fit
/// beside the state. A catalog window fills the budget on its own; on a
/// 2,342-line Express file that left room for four Choices per request, and
/// seventy-five requests for one file. A single declaration over the half
/// budget is cut every two hundred lines.
fn line_windows(path: &str, source: &str) -> Result<Vec<(Window, String)>, String> {
    let starts = line_starts(source);
    let declared = window_candidates(path, source, &starts);
    let half = MAX_REQUEST_TOKENS * BYTES_PER_TOKEN / 2;
    let bytes = |window: &Window| window_source(source, &starts, window).len();
    let mut cut: Vec<Window> = Vec::new();
    for window in declared {
        if bytes(&window) <= half || window.end_line - window.start_line < 200 {
            cut.push(window);
            continue;
        }
        let mut start = window.start_line;
        while start <= window.end_line {
            let end = (start + 199).min(window.end_line);
            cut.push(Window {
                index: 0,
                of: 0,
                start_line: start,
                end_line: end,
                declarations: window.declarations.clone(),
            });
            start = end + 1;
        }
    }
    let mut planned: Vec<Window> = Vec::new();
    for candidate in cut {
        let merged = planned.last().map(|open| Window {
            index: 0,
            of: 0,
            start_line: open.start_line,
            end_line: candidate.end_line,
            declarations: [open.declarations.clone(), candidate.declarations.clone()].concat(),
        });
        match merged {
            Some(merged) if bytes(&merged) <= half => {
                *planned.last_mut().expect("a window to merge into") = merged;
            }
            _ => planned.push(candidate),
        }
    }
    let total = planned.len();
    Ok(planned
        .into_iter()
        .enumerate()
        .map(|(i, mut window)| {
            window.index = i + 1;
            window.of = total;
            let text = window_source(source, &starts, &window).to_string();
            (window, text)
        })
        .collect())
}

fn ask_lines(
    root: &Path,
    key: Option<&str>,
    refresh: bool,
    answers: &mut [Answers],
) -> (usize, Usage, Usage) {
    let zero = || Usage {
        input_tokens: 0,
        output_tokens: 0,
    };
    let (mut usage, mut reused) = (zero(), zero());
    let agent = client();
    // Round one: the parser lists every node, the model says which check, if
    // any, each shows. Whatever pass one already classified on its own
    // request is kept; the rest is asked in chunks sized to the budget, per
    // view. Files no parser knows keep their pattern candidates and skip to
    // round two.
    let mut views_by_index: BTreeMap<usize, Vec<View>> = BTreeMap::new();
    let mut pairs: BTreeMap<usize, Vec<candidates::Candidate>> = BTreeMap::new();
    // Each pending request names its job: which file and which view.
    let mut jobs: Vec<(usize, usize)> = Vec::new();
    let mut pending = Vec::new();
    for (index, answer) in answers.iter().enumerate() {
        if answer.values.is_none() {
            continue;
        }
        let Ok(source) = read_text(&root.join(&answer.path)) else {
            continue;
        };
        let path = Path::new(&answer.path);
        match candidates::nodes(path, &source) {
            Some(nodes) if !nodes.is_empty() => {
                let fired: Vec<String> = answer
                    .values
                    .iter()
                    .flatten()
                    .filter(|(check, value)| {
                        **value >= LOCALISE_AT && check.as_str() != "missing_authorization"
                    })
                    .map(|(check, _)| check.clone())
                    .collect();
                if narrow_nodes() && fired.is_empty() {
                    continue;
                }
                let among = narrow_nodes().then_some(fired.as_slice());
                for (i, check) in &answer.classified {
                    if let Some(node) = nodes.get(*i) {
                        pairs.entry(index).or_default().push(candidates::Candidate {
                            line: node.line,
                            check: check.clone(),
                            text: node.text.clone(),
                        });
                    }
                }
                let asked = pass_one_asked(&answer.path, &nodes, answer);
                let views = line_views(&answer.path, &source, &nodes);
                for (v, view) in views.iter().enumerate() {
                    // Pass one answers every node it was given, so the first
                    // key it did not carry is where the remaining chunks
                    // start. A windowed file was never given any.
                    let mut offset = if views.len() == 1 { asked } else { 0 };
                    while offset < view.nodes.len() {
                        let left = view.nodes.len() - offset;
                        let mut took = 0;
                        // A window sized to fit the twelve questions does
                        // not fit thirty Choices on top; the chunk shrinks
                        // until it does.
                        for take in [left, 120, 60, 30, 15, 8, 4] {
                            if take > left {
                                continue;
                            }
                            let request = catalog::security::classify_request(
                                &answer.path,
                                &view.text,
                                &view.nodes[offset..offset + take],
                                offset,
                                among,
                            );
                            if let Ok(Some(bytes)) = within_budget(&request) {
                                jobs.push((index, v));
                                pending.push(((index, Some(jobs.len() - 1)), request, bytes));
                                took = take;
                                break;
                            }
                        }
                        if took == 0 {
                            break;
                        }
                        offset += took;
                    }
                }
                views_by_index.insert(index, views);
            }
            Some(_) => continue,
            None => {
                let found = candidates::candidates(path, &source);
                if !found.is_empty() {
                    pairs.insert(index, found);
                    views_by_index.insert(index, line_views(&answer.path, &source, &[]));
                }
            }
        }
    }
    if !pending.is_empty() {
        let answered = answer_all(
            root,
            "security",
            &agent,
            key,
            refresh,
            &pending,
            pending.len() > 4,
        );
        for ((index, slot), result) in answered {
            let entry = match result {
                Ok((_, entry, hit, _)) => {
                    let counted = if hit { &mut reused } else { &mut usage };
                    counted.input_tokens += entry.response.usage.input_tokens;
                    entry
                }
                Err(_) => continue,
            };
            let Some(view) = slot
                .and_then(|k| jobs.get(k))
                .and_then(|(_, v)| views_by_index.get(&index).and_then(|views| views.get(*v)))
            else {
                continue;
            };
            let classified = classifications(&entry.response);
            for (i, check) in classified {
                if let Some(node) = view.nodes.get(i) {
                    pairs.entry(index).or_default().push(candidates::Candidate {
                        line: node.line + view.offset,
                        check,
                        text: node.text.clone(),
                    });
                }
            }
        }
    }
    // Round two: the check's own question and the triage question on every
    // classified line. Authorisation stays file-level: at a line it confirmed
    // 21% of labelled handlers and was the most frequent fire on clean files,
    // and leaving it out of this tier moved precision from 56% to 60% for
    // four points of recall. Chunked to the budget: a file with forty
    // classified lines and a source Choice for each does not fit one
    // request, and a request that does not fit is split, never dropped.
    // Before this, every line finding of a file that large was lost without
    // a word.
    let mut jobs: Vec<(usize, usize, Vec<candidates::Candidate>)> = Vec::new();
    let mut pending = Vec::new();
    for (index, found) in &mut pairs {
        found.retain(|c| c.check != "missing_authorization");
        found.sort();
        found.dedup();
        found.truncate(candidates::MAX_CANDIDATES);
        if found.is_empty() {
            continue;
        }
        let Some(views) = views_by_index.get(index) else {
            continue;
        };
        for (v, view) in views.iter().enumerate() {
            let last = view.offset + view.text.lines().count();
            let mine: Vec<candidates::Candidate> = found
                .iter()
                .filter(|c| c.line > view.offset && c.line <= last)
                .cloned()
                .collect();
            if mine.is_empty() {
                continue;
            }
            let local: Vec<candidates::Candidate> = mine
                .iter()
                .map(|c| candidates::Candidate {
                    line: c.line - view.offset,
                    check: c.check.clone(),
                    text: c.text.clone(),
                })
                .collect();
            let mut offset = 0;
            while offset < local.len() {
                let left = local.len() - offset;
                let mut took = 0;
                for take in [left, 16, 8, 4, 2, 1] {
                    if take > left {
                        continue;
                    }
                    let request = catalog::security::confirm_request(
                        &answers[*index].path,
                        &view.text,
                        &local[offset..offset + take],
                        &view.structure,
                    );
                    if let Ok(Some(bytes)) = within_budget(&request) {
                        jobs.push((*index, v, mine[offset..offset + take].to_vec()));
                        pending.push(((*index, Some(jobs.len() - 1)), request, bytes));
                        took = take;
                        break;
                    }
                }
                if took == 0 {
                    took = 1;
                }
                offset += took;
            }
        }
    }
    if pending.is_empty() {
        return (0, usage, reused);
    }
    let answered = answer_all(
        root,
        "security",
        &agent,
        key,
        refresh,
        &pending,
        pending.len() > 4,
    );
    let mut confirmed = 0usize;
    let mut lines_by_index: BTreeMap<usize, Vec<Value>> = BTreeMap::new();
    for ((index, slot), result) in answered {
        let entry = match result {
            Ok((_, entry, hit, _)) => {
                let counted = if hit { &mut reused } else { &mut usage };
                counted.input_tokens += entry.response.usage.input_tokens;
                entry
            }
            Err(_) => continue,
        };
        let Some((_, v, chunk)) = slot.and_then(|k| jobs.get(k)) else {
            continue;
        };
        let offset = views_by_index
            .get(&index)
            .and_then(|views| views.get(*v))
            .map(|view| view.offset)
            .unwrap_or(0);
        let lines = lines_by_index.entry(index).or_default();
        for (i, candidate) in chunk.iter().enumerate() {
            let Some(value) = noul(&entry.response, &format!("c{i}")) else {
                break;
            };
            let dismissed = noul(&entry.response, &format!("t{i}")).unwrap_or(0.0);
            if value >= catalog::security::cut_for(&candidate.check)
                && dismissed < catalog::security::DISMISS_AT
            {
                let mut line = json!({ "line": candidate.line, "check": candidate.check,
                    "value": value, "text": candidate.text });
                if let Some(chosen) = choice(&entry.response, &format!("s{i}"))
                    && let Some(number) =
                        chosen.strip_prefix('L').and_then(|n| n.parse::<u64>().ok())
                {
                    line["enters_at"] = json!(number + offset as u64);
                }
                lines.push(line);
            }
        }
    }
    // One finding per check per ten lines: three `eval` calls in a row are
    // one thing to fix, and are counted as one. The strongest line of the
    // window is the one shown, so a handler's `def` line at 0.62 does not
    // stand in for the `pickle.loads` at 0.96 eleven lines below it.
    let mut kept_by_index: BTreeMap<usize, Vec<Value>> = BTreeMap::new();
    for (index, mut lines) in lines_by_index {
        lines.sort_by(|a, b| {
            b["value"]
                .as_f64()
                .partial_cmp(&a["value"].as_f64())
                .unwrap_or(std::cmp::Ordering::Equal)
                .then(a["line"].as_u64().cmp(&b["line"].as_u64()))
        });
        let mut kept: Vec<Value> = Vec::new();
        for line in lines {
            let near = kept.iter().any(|k| {
                k["check"] == line["check"]
                    && k["line"]
                        .as_u64()
                        .unwrap_or(0)
                        .abs_diff(line["line"].as_u64().unwrap_or(0))
                        <= 10
            });
            if !near {
                kept.push(line);
            }
        }
        kept.sort_by(|a, b| a["line"].as_u64().cmp(&b["line"].as_u64()));
        if !kept.is_empty() {
            kept_by_index.insert(index, kept);
        }
    }
    for (index, kept) in kept_by_index {
        confirmed += 1;
        answers[index].lines = kept;
    }
    (confirmed, usage, reused)
}

/// How many nodes pass one's request carried for this file: the largest
/// classified index plus one when any were classified, otherwise what the
/// same sizing would have chosen. Recomputed rather than stored, because the
/// choice is deterministic on the same file.
fn pass_one_asked(path: &str, nodes: &[candidates::Node], answer: &Answers) -> usize {
    if let Some(max) = answer.classified.keys().max() {
        // Every node asked was answered, so the keys reach at least this far;
        // the chunk sizes are the same three, so the smallest that covers it.
        return [nodes.len(), 60, 30]
            .into_iter()
            .filter(|take| *take > *max && *take <= nodes.len())
            .min()
            .unwrap_or(nodes.len());
    }
    let _ = path;
    0
}

/// A Choice below this confidence is read as `none`.
const CLASSIFY_CONFIDENCE: f64 = 0.3;

fn choice_with_confidence(response: &ApiResponse, id: &str) -> Option<(String, f64)> {
    match response.answers.get(id) {
        Some(Answer::Choice {
            choice, confidence, ..
        }) => Some((choice.clone(), *confidence)),
        _ => None,
    }
}

/// How many functions of one file are labelled. Beyond this a file is a
/// module of helpers, and the largest are not the ones that matter most; the
/// first by declaration order are kept, which for a route file is the routes.
const MAX_LABELLED_FUNCTIONS: usize = 24;

/// The graph stage. Every labelled function that takes outside data is
/// followed through the file's resolved imports to every labelled function
/// that reaches a sink without sanitising, where the caller's body names the
/// callee; each such pair is one candidate path, confirmed with both bodies in
/// state and one question. Host code does the walking; the model only ever
/// judges one function, or one pair.
fn confirm_paths(
    root: &Path,
    key: Option<&str>,
    refresh: bool,
    answers: &[Answers],
    structures: &BTreeMap<String, (candidates::Structure, String)>,
) -> (Vec<Value>, Usage, Usage) {
    let cut = catalog::PRESENT_AT;
    let by_path: BTreeMap<&str, &Answers> = answers.iter().map(|a| (a.path.as_str(), a)).collect();
    let body = |source: &str, f: &candidates::FunctionSpan| -> String {
        source
            .lines()
            .skip(f.start.saturating_sub(1))
            .take(f.end.saturating_sub(f.start) + 1)
            .collect::<Vec<_>>()
            .join("\n")
            .chars()
            .take(40_000)
            .collect()
    };
    let mut pending = Vec::new();
    let mut candidates_found: Vec<Value> = Vec::new();
    for (file, (structure, source)) in structures {
        let Some(answer) = by_path.get(file.as_str()) else {
            continue;
        };
        if answer.labels.is_empty() {
            continue;
        }
        for import in &structure.imports {
            let Some(target) = candidates::resolve_import(root, file, &import.specifier) else {
                continue;
            };
            let Some((callee_structure, callee_source)) = structures.get(&target) else {
                continue;
            };
            let Some(callee_answer) = by_path.get(target.as_str()) else {
                continue;
            };
            for (i, caller) in structure
                .functions
                .iter()
                .enumerate()
                .take(answer.labels.len())
            {
                if answer.labels[i].takes_outside < cut {
                    continue;
                }
                let caller_body = body(source, caller);
                for (j, callee) in callee_structure
                    .functions
                    .iter()
                    .enumerate()
                    .take(callee_answer.labels.len())
                {
                    let label = &callee_answer.labels[j];
                    let named = import.exported == "*"
                        || import.exported == "default"
                        || callee.name == import.exported
                        || callee.name == import.local;
                    if !named
                        || label.reaches_sink < cut
                        || label.sanitises >= cut
                        || label.sink_kind == "none"
                    {
                        continue;
                    }
                    let direct = format!("{}(", import.local);
                    let member = format!("{}.{}(", import.local, callee.name);
                    let Some(offset) = caller_body
                        .find(&member)
                        .or_else(|| caller_body.find(&direct))
                    else {
                        continue;
                    };
                    let call_line = caller.start + caller_body[..offset].matches('\n').count();
                    let request = catalog::security::path_request(
                        &catalog::security::PathEnd {
                            file: file.clone(),
                            function: caller.name.clone(),
                            line: caller.start,
                            source: caller_body.clone(),
                        },
                        &catalog::security::PathEnd {
                            file: target.clone(),
                            function: callee.name.clone(),
                            line: callee.start,
                            source: body(callee_source, callee),
                        },
                        &label.sink_kind,
                    );
                    if let Ok(Some(bytes)) = within_budget(&request) {
                        let index = candidates_found.len();
                        candidates_found.push(json!({
                            "caller": { "file": file, "function": caller.name, "line": call_line },
                            "callee": { "file": target, "function": callee.name, "line": callee.start },
                            "check": label.sink_kind,
                        }));
                        pending.push(((index, None), request, bytes));
                    }
                }
            }
        }
    }
    confirm_pending(root, key, refresh, pending, candidates_found)
}

/// Confirm candidate paths, however they were found: one question each with
/// both bodies in state, confirmed at the shared cut.
fn confirm_pending(
    root: &Path,
    key: Option<&str>,
    refresh: bool,
    pending: Vec<(Slot, Value, Vec<u8>)>,
    candidates_found: Vec<Value>,
) -> (Vec<Value>, Usage, Usage) {
    let cut = catalog::PRESENT_AT;
    let (mut usage, mut reused) = (
        Usage {
            input_tokens: 0,
            output_tokens: 0,
        },
        Usage {
            input_tokens: 0,
            output_tokens: 0,
        },
    );
    if pending.is_empty() {
        return (Vec::new(), usage, reused);
    }
    let agent = client();
    let answered = answer_all(
        root,
        "security",
        &agent,
        key,
        refresh,
        &pending,
        pending.len() > 4,
    );
    let mut confirmed = Vec::new();
    for ((index, _), result) in answered {
        let Ok((_, entry, hit, _)) = result else {
            continue;
        };
        let counted = if hit { &mut reused } else { &mut usage };
        counted.input_tokens += entry.response.usage.input_tokens;
        if let Some(value) = noul(&entry.response, "path")
            && value >= cut
        {
            let mut path = candidates_found[index].clone();
            path["value"] = json!(value);
            confirmed.push(path);
        }
    }
    confirmed.sort_by(|a, b| {
        b["value"]
            .as_f64()
            .unwrap_or(0.0)
            .total_cmp(&a["value"].as_f64().unwrap_or(0.0))
    });
    (confirmed, usage, reused)
}

fn run_paths(
    root: &Path,
    key: Option<&str>,
    refresh: bool,
    answers: &[Answers],
    structures: &BTreeMap<String, (candidates::Structure, String)>,
    points: &[(String, usize, Vec<String>)],
    already: &[Value],
) -> (Vec<Value>, Usage, Usage) {
    let cut = catalog::PRESENT_AT;
    let by_path: BTreeMap<&str, &Answers> = answers.iter().map(|a| (a.path.as_str(), a)).collect();
    // test -> file -> executed lines
    let mut by_test: BTreeMap<&str, BTreeMap<&str, BTreeSet<usize>>> = BTreeMap::new();
    for (file, line, tests) in points {
        for test in tests {
            by_test
                .entry(test.as_str())
                .or_default()
                .entry(file.as_str())
                .or_default()
                .insert(*line);
        }
    }
    let body = |source: &str, f: &candidates::FunctionSpan| -> String {
        source
            .lines()
            .skip(f.start.saturating_sub(1))
            .take(f.end.saturating_sub(f.start) + 1)
            .collect::<Vec<_>>()
            .join("\n")
            .chars()
            .take(40_000)
            .collect()
    };
    let known: BTreeSet<(String, String)> = already
        .iter()
        .filter_map(|p| {
            Some((
                format!(
                    "{}#{}",
                    p["caller"]["file"].as_str()?,
                    p["caller"]["function"].as_str()?
                ),
                format!(
                    "{}#{}",
                    p["callee"]["file"].as_str()?,
                    p["callee"]["function"].as_str()?
                ),
            ))
        })
        .collect();
    let mut seen: BTreeSet<(String, String)> = BTreeSet::new();
    let mut pending = Vec::new();
    let mut candidates_found: Vec<Value> = Vec::new();
    for (callee_file, (callee_structure, callee_source)) in structures {
        let Some(callee_answer) = by_path.get(callee_file.as_str()) else {
            continue;
        };
        for (j, callee) in callee_structure
            .functions
            .iter()
            .enumerate()
            .take(callee_answer.labels.len())
        {
            let label = &callee_answer.labels[j];
            if label.reaches_sink < cut || label.sanitises >= cut || label.sink_kind == "none" {
                continue;
            }
            // Tests that executed a line of this function.
            let tests: Vec<&str> = by_test
                .iter()
                .filter(|(_, files)| {
                    files.get(callee_file.as_str()).is_some_and(|lines| {
                        lines.range(callee.start..=callee.end).next().is_some()
                    })
                })
                .map(|(t, _)| *t)
                .collect();
            let mut callers = 0;
            for test in tests {
                for (caller_file, lines) in &by_test[test] {
                    if *caller_file == callee_file.as_str() {
                        continue;
                    }
                    let Some((caller_structure, caller_source)) = structures.get(*caller_file)
                    else {
                        continue;
                    };
                    let Some(caller_answer) = by_path.get(caller_file) else {
                        continue;
                    };
                    for (i, caller) in caller_structure
                        .functions
                        .iter()
                        .enumerate()
                        .take(caller_answer.labels.len())
                    {
                        if caller_answer.labels[i].takes_outside < cut
                            || lines.range(caller.start..=caller.end).next().is_none()
                        {
                            continue;
                        }
                        let pair = (
                            format!("{caller_file}#{}", caller.name),
                            format!("{callee_file}#{}", callee.name),
                        );
                        if known.contains(&pair) || !seen.insert(pair) || callers >= 3 {
                            continue;
                        }
                        callers += 1;
                        let request = catalog::security::path_request(
                            &catalog::security::PathEnd {
                                file: (*caller_file).to_owned(),
                                function: caller.name.clone(),
                                line: caller.start,
                                source: body(caller_source, caller),
                            },
                            &catalog::security::PathEnd {
                                file: callee_file.clone(),
                                function: callee.name.clone(),
                                line: callee.start,
                                source: body(callee_source, callee),
                            },
                            &label.sink_kind,
                        );
                        if let Ok(Some(bytes)) = within_budget(&request) {
                            let index = candidates_found.len();
                            candidates_found.push(json!({
                                "caller": { "file": caller_file, "function": caller.name, "line": caller.start },
                                "callee": { "file": callee_file, "function": callee.name, "line": callee.start },
                                "check": label.sink_kind, "via": "run", "test": test,
                            }));
                            pending.push(((index, None), request, bytes));
                        }
                    }
                }
            }
        }
    }
    confirm_pending(root, key, refresh, pending, candidates_found)
}

/// Guards a run observed. For every function that takes outside data, the
/// tests that executed it; for each of those tests, whether any function the
/// model labelled as validating or authorising executed under the same test,
/// in any file. A handler that ran under tests where no guard ran is the
/// evidence a per-file question cannot have: not that a guard is absent from
/// the file, but that nothing guard-shaped ran in front of it. No trace, no
/// framework knowledge; labels and co-execution only.
fn run_guards(
    answers: &[Answers],
    structures: &BTreeMap<String, (candidates::Structure, String)>,
    points: &[(String, usize, Vec<String>)],
) -> BTreeMap<String, Vec<Value>> {
    let cut = catalog::PRESENT_AT;
    let by_path: BTreeMap<&str, &Answers> = answers.iter().map(|a| (a.path.as_str(), a)).collect();
    let mut by_test: BTreeMap<&str, BTreeMap<&str, BTreeSet<usize>>> = BTreeMap::new();
    for (file, line, tests) in points {
        for test in tests {
            by_test
                .entry(test.as_str())
                .or_default()
                .entry(file.as_str())
                .or_default()
                .insert(*line);
        }
    }
    // Guard functions: every labelled function that sanitises or authorises.
    let mut guards: Vec<(&str, &candidates::FunctionSpan)> = Vec::new();
    for (file, (structure, _)) in structures {
        let Some(answer) = by_path.get(file.as_str()) else {
            continue;
        };
        for (i, f) in structure
            .functions
            .iter()
            .enumerate()
            .take(answer.labels.len())
        {
            if answer.labels[i].sanitises >= cut {
                guards.push((file.as_str(), f));
            }
        }
    }
    let guard_ran = |files: &BTreeMap<&str, BTreeSet<usize>>| -> Option<String> {
        guards.iter().find_map(|(file, f)| {
            files
                .get(*file)
                .filter(|lines| lines.range(f.start..=f.end).next().is_some())
                .map(|_| format!("{}:{} {}", file, f.start, f.name))
        })
    };
    let mut out: BTreeMap<String, Vec<Value>> = BTreeMap::new();
    for (file, (structure, _)) in structures {
        let Some(answer) = by_path.get(file.as_str()) else {
            continue;
        };
        for (i, handler) in structure
            .functions
            .iter()
            .enumerate()
            .take(answer.labels.len())
        {
            if answer.labels[i].takes_outside < cut {
                continue;
            }
            let mut guarded = Vec::new();
            let mut unguarded = Vec::new();
            for (test, files) in &by_test {
                let ran = files
                    .get(file.as_str())
                    .is_some_and(|lines| lines.range(handler.start..=handler.end).next().is_some());
                if !ran {
                    continue;
                }
                match guard_ran(files) {
                    Some(guard) => guarded.push(json!({ "test": test, "guard": guard })),
                    None => unguarded.push(json!(test)),
                }
            }
            if guarded.is_empty() && unguarded.is_empty() {
                continue;
            }
            out.entry(file.clone()).or_default().push(json!({
                "function": handler.name, "line": handler.start,
                "tests_with_a_guard": guarded.len(), "tests_without": unguarded.len(),
                "guard_example": guarded.first().map(|g| g["guard"].clone()),
                "unguarded_tests": unguarded.iter().take(3).collect::<Vec<_>>(),
            }));
        }
    }
    out
}

fn scored(answers: &Answers, instrument: Instrument) -> Value {
    let present: Vec<Value> = match &answers.values {
        Some(values) => {
            let mut fired = present_for(values, instrument);
            // A line the second round confirmed for a check pass one did not
            // fire on is still a finding; it carries the line's value.
            for line in &answers.lines {
                if let (Some(check), Some(value)) = (line["check"].as_str(), line["value"].as_f64())
                    && !fired.iter().any(|(id, _)| id == check)
                {
                    fired.push((check.to_owned(), value));
                }
            }
            fired
                .into_iter()
                .map(|(id, value)| {
                    // The lines pass two confirmed for this check, if any:
                    // that is the tier a reader sees.
                    let lines: Vec<&Value> =
                        answers.lines.iter().filter(|l| l["check"] == id).collect();
                    json!({ "check": id, "value": value,
                        "tier": if lines.is_empty() { "file" } else { "line" },
                        "lines": lines })
                })
                .collect()
        }
        None => Vec::new(),
    };
    match &answers.values {
        Some(values) => json!({
            "path": answers.path,
            "bytes": answers.bytes,
            "sha256": answers.sha256,
            "status": "completed",
            "cached": answers.cached,
            "health": if instrument.scores() { catalog::health(values) } else { None },
            "present": present,
            "checks": values,
            "windows": answers.windows,
            "basis": answers.note.clone().unwrap_or_else(|| "both versions".into()),
            "warning": answers.error,
        }),
        None => json!({
            "path": answers.path,
            "bytes": answers.bytes,
            "sha256": answers.sha256,
            "status": "failed",
            "error": answers.error,
        }),
    }
}

/// Count the published findings, including checks only the line pass found.
fn finding_counts(files: &[Value]) -> (usize, usize, BTreeMap<String, usize>) {
    let mut flagged = 0;
    let mut line_confirmed = 0;
    let mut by_check = BTreeMap::new();
    for file in files {
        let Some(findings) = file["present"].as_array() else {
            continue;
        };
        flagged += usize::from(!findings.is_empty());
        line_confirmed += usize::from(findings.iter().any(|finding| {
            finding["lines"]
                .as_array()
                .is_some_and(|lines| !lines.is_empty())
        }));
        for finding in findings {
            if let Some(check) = finding["check"].as_str() {
                *by_check.entry(check.to_owned()).or_default() += 1;
            }
        }
    }
    (flagged, line_confirmed, by_check)
}

/// The files an instrument reads, decided once for the assessment, its dry run,
/// its `scope` view and its `patch`. Each used to decide for itself, so
/// `security scope` could report no source at all on a checkout `security`
/// then assessed.
///
/// Security reads every file the conventions did not exclude. The model's
/// reading of what ships is a fine scope for a health number and a bad one for
/// weaknesses: a directory it reads as not part of the product (`bad/` in a
/// vulnerable-by-design app, an examples tree, a script) is deployed as often
/// as not, and leaving it out cost 53 of 57 labelled weaknesses on one
/// repository.
fn scope_for(root: &Path, files: &[PathBuf], instrument: Instrument) -> scope::Scope {
    let configured = scope::configured_roots();
    let mut scope = scope::classify(root, files, configured.as_deref());
    if instrument == Instrument::Security {
        for entry in scope
            .entries
            .iter_mut()
            .filter(|e| e.status == scope::Status::Ambiguous)
        {
            entry.status = scope::Status::Included;
            entry.reason = "security reads every file the conventions do not exclude".into();
        }
    }
    scope
}

/// Health for every file, every directory that holds one, and the tree.
/// Ask the model about the files no convention could settle.
///
/// One request, paths only, with the whole tree as context. Silent when there is
/// nothing ambiguous, when there is no credential, and when the user declared
/// roots, because an explicit declaration is an answer and this would override
/// it.
fn resolve_ambiguity(
    root: &Path,
    scope: &mut scope::Scope,
    found: &[PathBuf],
    key: Option<&str>,
    refresh: bool,
) -> Option<Value> {
    let key = key.filter(|k| !k.trim().is_empty())?;
    if scope.mode != "automatic" || scope.ambiguous() == 0 {
        return None;
    }
    let relative = |path: &Path| {
        path.strip_prefix(root)
            .unwrap_or(path)
            .to_string_lossy()
            .replace('\\', "/")
    };
    let mut tree: Vec<String> = found.iter().map(|p| relative(p)).collect();
    tree.sort();
    let manifests = tree
        .iter()
        .filter(|p| scope::declares_a_package(p))
        .cloned()
        .collect::<Vec<_>>()
        .join("\n");
    let asking: Vec<String> = scope
        .entries
        .iter()
        .filter(|e| e.status == scope::Status::Ambiguous)
        .map(|e| e.path.clone())
        .collect();
    let name = root
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_default();
    let request = catalog::scope_request(&name, &tree.join("\n"), &manifests, &asking);
    let bytes = within_budget(&request).ok()??;
    let agent = client();
    let hash = digest(&bytes);
    // Scope is a property of the tree, not of an instrument, so both lanes
    // share one cached answer under the quality lane.
    let (entry, _, _) =
        resolve(root, "quality", &agent, Some(key), refresh, &request, &hash).ok()?;
    let mut ships = 0usize;
    for (index, path) in asking.iter().enumerate() {
        let Some(value) = noul(&entry.response, &format!("f{index}")) else {
            continue;
        };
        if value >= catalog::PRESENT_AT {
            ships += 1;
            if let Some(found) = scope.entries.iter_mut().find(|e| &e.path == path) {
                found.status = scope::Status::Included;
                found.reason = "the model reads it as part of the product".into();
            }
        } else if let Some(found) = scope.entries.iter_mut().find(|e| &e.path == path) {
            found.status = scope::Status::Excluded;
            found.reason = "the model reads it as not part of the product".into();
        }
    }
    Some(json!({
        "asked": asking.len(), "ships": ships, "does_not": asking.len() - ships,
        "basis": "paths and the whole tree, no file contents",
    }))
}

fn run_health(
    root: &Path,
    options: &Options,
    key: Option<&str>,
    instrument: Instrument,
) -> Result<(Value, bool), String> {
    if !options.dry_run {
        require_key(key, instrument)?;
        endpoint()?;
    }
    let found = discover_for(root, &options.paths, instrument)?;
    let mut scope = scope_for(root, &found, instrument);
    let resolved = if options.dry_run || instrument == Instrument::Security {
        None
    } else {
        resolve_ambiguity(root, &mut scope, &found, key, options.refresh)
    };
    // A file the user names directly is an unambiguous request for it, whatever
    // the scope would have decided.
    let named: BTreeSet<PathBuf> = options
        .paths
        .iter()
        .filter_map(|path| root.join(path).canonicalize().ok())
        .filter(|path| path.is_file())
        .collect();
    let wanted: BTreeSet<String> = named
        .iter()
        .map(|path| {
            path.strip_prefix(root)
                .unwrap_or(path)
                .to_string_lossy()
                .replace('\\', "/")
        })
        .collect();
    let paths: Vec<PathBuf> = found
        .iter()
        .filter(|path| {
            let file = path
                .strip_prefix(root)
                .unwrap_or(path)
                .to_string_lossy()
                .replace('\\', "/");
            options.all
                || wanted.contains(&file)
                || scope
                    .entries
                    .iter()
                    .any(|e| e.path == file && e.status == scope::Status::Included)
        })
        .cloned()
        .collect();
    let mut skipped_files: Vec<Value> = scope
        .entries
        .iter()
        .filter(|e| e.status != scope::Status::Included && !wanted.contains(&e.path))
        .map(|e| json!({ "path": e.path, "reason": e.reason, "status": e.status }))
        .collect();
    let mut subjects = Vec::new();
    let mut unreadable = Vec::new();
    let mut structures: BTreeMap<String, (candidates::Structure, String)> = BTreeMap::new();
    for path in &paths {
        let relative = path
            .strip_prefix(root)
            .unwrap_or(path)
            .to_string_lossy()
            .replace('\\', "/");
        match read_text(path) {
            Ok(source) if !options.all && generated_header(&source) => {
                skipped_files.push(json!({ "path": relative, "reason": "generated" }));
            }
            Ok(source) => {
                let sha256 = digest(source.as_bytes());
                let mut whole = instrument.file_request(&relative, &source);
                // The graph stage: label every function on the same state,
                // when the file has a parser and the questions fit. A file
                // that does not fit with them is asked without them.
                if instrument == Instrument::Security {
                    let structure = candidates::structure(Path::new(&relative), &source);
                    if !structure.functions.is_empty() {
                        let mut functions = structure.functions.clone();
                        functions.truncate(MAX_LABELLED_FUNCTIONS);
                        let mut labelled = whole.clone();
                        if let Some(questions) = labelled["questions"].as_object_mut() {
                            questions.extend(catalog::security::function_questions(&functions));
                        }
                        if matches!(within_budget(&labelled), Ok(Some(_))) {
                            whole = labelled;
                            structures.insert(relative.clone(), (structure, source.clone()));
                        }
                    }
                    // The first chunk of line classifications rides here too,
                    // as many as fit: the state is already being sent. Only
                    // when the line tier enumerates; the narrowing tier asks
                    // per function after the file questions have answered.
                    if enumerate_lines()
                        && !narrow_nodes()
                        && let Some(nodes) = candidates::nodes(Path::new(&relative), &source)
                    {
                        for take in [nodes.len(), 60, 30] {
                            if take == 0 || take > nodes.len() {
                                continue;
                            }
                            let mut with = whole.clone();
                            if let Some(questions) = with["questions"].as_object_mut() {
                                questions.extend(catalog::security::classify_questions(
                                    &nodes[..take],
                                    0,
                                ));
                            }
                            if matches!(within_budget(&with), Ok(Some(_))) {
                                whole = with;
                                break;
                            }
                        }
                    }
                }
                match within_budget(&whole) {
                    Ok(Some(_)) => subjects.push(Subject {
                        bytes: source.len() as u64,
                        request: whole,
                        path: relative,
                        sha256,
                        note: None,
                    }),
                    Ok(None) => match catalog_windows(&relative, &source, instrument) {
                        Ok(windows) => {
                            let count = windows.len();
                            for (window, text) in windows {
                                subjects.push(Subject {
                                    bytes: text.len() as u64,
                                    request: instrument.file_request(&relative, &text),
                                    path: relative.clone(),
                                    sha256: sha256.clone(),
                                    note: Some(format!(
                                        "assessed in {count} windows at declaration boundaries; \
                                         a property of the whole file, such as a god class or \
                                         logic duplicated across windows, is judged within a \
                                         window and is weaker here (window {} of {})",
                                        window.index, window.of
                                    )),
                                });
                            }
                        }
                        Err(e) => unreadable.push(json!({
                            "path": relative, "status": "failed", "error": e
                        })),
                    },
                    Err(e) => unreadable.push(json!({
                        "path": relative, "status": "failed", "error": e
                    })),
                }
            }
            Err(e) => unreadable.push(json!({
                "path": relative, "status": "failed", "error": e
            })),
        }
    }
    if options.dry_run {
        return Ok((
            json!({
                "instrument": instrument.name(),
                "catalog_version": instrument.version(), "model": model(),
                "endpoint": endpoint()?,
                "requests": subjects.iter().map(|s| &s.request).collect::<Vec<_>>(),
            }),
            false,
        ));
    }
    let count = subjects.len();
    let (answered, usage, reused) =
        ask_smells(root, instrument, key, options.refresh, subjects, count > 4);
    let mut answers = combine_windows(answered);
    // Pass two, security only: for every file something fired on, ask one
    // question per candidate line. A finding both passes agree on is shown
    // with its line; on the held-out half of RealVuln that tier fires on 9%
    // of unlabelled files against pass one's 23%, at 58% recall with a line.
    let (mut usage, mut reused) = (usage, reused);
    let mut paths_found: Vec<Value> = Vec::new();
    let mut handlers_by_file: BTreeMap<String, Vec<Value>> = BTreeMap::new();
    if instrument == Instrument::Security {
        let (_, more, cached) = ask_lines(root, key, options.refresh, &mut answers);
        usage.input_tokens += more.input_tokens;
        reused.input_tokens += cached.input_tokens;
        let (paths, more, cached) =
            confirm_paths(root, key, options.refresh, &answers, &structures);
        usage.input_tokens += more.input_tokens;
        reused.input_tokens += cached.input_tokens;
        paths_found = paths;
        if let Some(selector) = options.run.as_deref()
            && let Ok(points) = crate::load_point_tests((selector != "latest").then_some(selector))
        {
            let (paths, more, cached) = run_paths(
                root,
                key,
                options.refresh,
                &answers,
                &structures,
                &points,
                &paths_found,
            );
            usage.input_tokens += more.input_tokens;
            reused.input_tokens += cached.input_tokens;
            paths_found.extend(paths);
            handlers_by_file = run_guards(&answers, &structures, &points);
        }
    }

    let mut weighted: Vec<(u64, f64)> = Vec::new();
    let mut by_directory: BTreeMap<String, Vec<(u64, f64)>> = BTreeMap::new();
    let mut files: Vec<Value> = Vec::new();
    for answer in &answers {
        if instrument.scores()
            && let Some(values) = &answer.values
            && let Some(health) = catalog::health(values)
        {
            weighted.push((answer.bytes, health));
            // Every ancestor directory, so a tree can be read at any depth.
            let mut directory = Path::new(&answer.path).parent();
            while let Some(current) = directory {
                by_directory
                    .entry(current.to_string_lossy().replace('\\', "/"))
                    .or_default()
                    .push((answer.bytes, health));
                directory = current.parent();
            }
        }
        let mut record = scored(answer, instrument);
        if let Some(handlers) = handlers_by_file.get(&answer.path) {
            record["handlers"] = json!(handlers);
        }
        files.push(record);
    }
    if instrument.scores() {
        files.sort_by(|a, b| {
            let key = |v: &Value| v["health"].as_f64().unwrap_or(f64::MAX);
            key(a).total_cmp(&key(b))
        });
    } else {
        // Most findings first, then the strongest, then the path: the order a
        // reader would triage in, since there is no number to sort by.
        files.sort_by(|a, b| {
            let fires = |v: &Value| v["present"].as_array().map_or(0, Vec::len);
            let strongest = |v: &Value| {
                v["present"]
                    .as_array()
                    .and_then(|p| p.first())
                    .and_then(|p| p["value"].as_f64())
                    .unwrap_or(0.0)
            };
            fires(b)
                .cmp(&fires(a))
                .then_with(|| strongest(b).total_cmp(&strongest(a)))
                .then_with(|| a["path"].as_str().cmp(&b["path"].as_str()))
        });
    }
    files.extend(unreadable);
    let (flagged, line_confirmed, by_check) = finding_counts(&files);
    let failed = nothing_assessed(&files);
    let errors = files.iter().filter(|f| f["status"] == "failed").count();

    let directories: Vec<Value> = by_directory
        .iter()
        .filter(|(name, _)| !name.is_empty())
        .filter_map(|(name, members)| {
            Some(json!({
                "path": name, "files": members.len(),
                "bytes": members.iter().map(|(b, _)| b).sum::<u64>(),
                "health": catalog::aggregate(members)?,
            }))
        })
        .collect();

    // The identity of what this assessment read: a digest over exactly the files
    // it answered for, and nothing else in the tree.
    //
    // It is not a run's source fingerprint and must never be compared with one.
    // That fingerprint keys the instrumented build cache and so covers every
    // file the frontend may rewrite, which is a wider set; the two disagree on
    // any real project. Whether an assessment and a run read the same code is
    // answered per file, by the digests each records.
    let assessed: Vec<PathBuf> = answers
        .iter()
        .filter(|answer| answer.values.is_some())
        .map(|answer| root.join(&answer.path))
        .collect();
    let assessed_files = assessed.len();
    let assessed_fingerprint = supercov_engine::integrity::digest_source_files(root, assessed).ok();

    let (id, created_at) = store::identity()?;
    let mut manifest = json!({
        "schema_version": 4, "id": id, "created_at": created_at, "parent": Value::Null,
        // Null when a file moved or became unreadable between the assessment and
        // this line: absent is honest, a digest over a different set is not.
        "assessed_files_fingerprint": assessed_fingerprint,
        "assessed_files": assessed_files,
        "supercov_version": env!("CARGO_PKG_VERSION"),
        // Which instrument produced this. A reader must never mistake a catalog
        // snapshot for a rubric one: they answer different questions and their
        // numbers are not comparable.
        "instrument": instrument.name(),
        "catalog_version": instrument.version(),
        "model": model(), "scope": "file",
        "paths": options.paths.iter()
            .map(|path| path.display().to_string().replace('\\', "/"))
            .collect::<Vec<_>>(),
        "counts": {"files": files.len(), "scored": weighted.len(), "errors": errors,
            "assessed": files.len() - errors, "flagged": flagged, "line_confirmed": line_confirmed,
            "directories": directories.len(), "skipped": skipped_files.len()},
        "by_check": by_check,
        "scope": scope.summary(),
        "scope_resolved": resolved,
        "limitation": scope.limitation(),
        "skipped": skipped_files,
        "catalog": instrument.described(),
        "health": if instrument.scores() { catalog::aggregate(&weighted) } else { None },
        "bytes": weighted.iter().map(|(b, _)| b).sum::<u64>(),
        "policy": instrument.policy(),
        "usage_this_run": usage,
        "usage_from_cache": reused,
    });
    let recorded = json!({ "files": files, "directories": directories, "paths": paths_found });
    let saved = store::write(root, instrument.lane(), &id, &manifest, &recorded);
    let mut report = manifest.take();
    if let Err(error) = &saved {
        report["snapshot_warning"] = json!(format!(
            "the assessment completed but no snapshot was saved: {error}"
        ));
    }
    report["directories"] = recorded["directories"].clone();
    report["files"] = recorded["files"].clone();
    report["paths"] = recorded["paths"].clone();
    report["files_scored"] = json!(weighted.len());
    Ok((report, failed))
}

/// What a change introduced, file by file.
fn run_patch(
    root: &Path,
    range: &changes::Range,
    paths: &[PathBuf],
    refresh: bool,
    all: bool,
    key: Option<&str>,
    instrument: Instrument,
) -> Result<(Value, bool), String> {
    require_key(key, instrument)?;
    endpoint()?;
    let collected = changes::collect(root, range, paths)?;
    let changed: Vec<PathBuf> = collected.iter().map(|c| root.join(&c.path)).collect();
    let scope = scope_for(root, &changed, instrument);
    let in_scope: BTreeMap<String, scope::Status> = scope
        .entries
        .iter()
        .map(|e| (e.path.clone(), e.status))
        .collect();
    let scope_reasons: BTreeMap<String, String> = scope
        .entries
        .iter()
        .map(|e| (e.path.clone(), e.reason.clone()))
        .collect();
    let mut subjects = Vec::new();
    let mut skipped = Vec::new();
    for change in &collected {
        if !change.reviewable() {
            skipped.push(json!({
                "path": change.path,
                "reason": "a deletion cannot introduce anything",
            }));
            continue;
        }
        if !is_assessable(Path::new(&change.path), instrument) {
            skipped.push(json!({ "path": change.path, "reason": "not a source file" }));
            continue;
        }
        // The same scope as an assessment, so a reviewer reading `runs patch`
        // and `quality patch` together sees one set of files. A change outside
        // it is reported rather than dropped.
        if !all
            && let Some(entry) = in_scope.get(&change.path)
            && *entry != scope::Status::Included
        {
            skipped.push(json!({
                "path": change.path,
                "reason": scope_reasons.get(&change.path).cloned().unwrap_or_default(),
            }));
            continue;
        }
        if !all && generated_header(&change.after) {
            skipped.push(json!({ "path": change.path, "reason": "generated" }));
            continue;
        }
        // Both whole versions are the validated question. When they do not fit,
        // the patch alone is asked instead and the report says so.
        let whole = instrument.change_request(&change.before, &change.after);
        let (request, note) = match within_budget(&whole) {
            Ok(Some(_)) => (whole, None),
            _ if !change.patch.is_empty() => (
                instrument.patch_request(&change.patch),
                Some("unified diff only: both versions exceed the request budget".to_owned()),
            ),
            _ => (whole, None),
        };
        subjects.push(Subject {
            bytes: change.after.len() as u64,
            request,
            path: change.path.clone(),
            sha256: digest(change.after.as_bytes()),
            note,
        });
    }
    let anchors: BTreeMap<String, u32> = collected
        .iter()
        .filter_map(|c| changes::first_added_line(&c.patch).map(|l| (c.path.clone(), l)))
        .collect();
    let count = subjects.len();
    let (answers, usage, reused) = ask_smells(root, instrument, key, refresh, subjects, count > 4);
    let mut introduced = 0usize;
    let files: Vec<Value> = answers
        .iter()
        .map(|answer| {
            let mut value = scored(answer, instrument);
            value["line"] = json!(anchors.get(&answer.path));
            if let Some(values) = &answer.values {
                let fired = present_for(values, instrument);
                introduced += fired.len();
                // Health is a property of a file, not of a change; what a review
                // reports is which properties appeared.
                value["health"] = Value::Null;
                value["introduced"] = json!(fired.len());
            }
            value
        })
        .collect();
    let mut ordered = files;
    ordered.sort_by(|a, b| {
        b["introduced"]
            .as_u64()
            .unwrap_or(0)
            .cmp(&a["introduced"].as_u64().unwrap_or(0))
            .then_with(|| a["path"].as_str().cmp(&b["path"].as_str()))
    });
    let failed = nothing_assessed(&ordered);
    Ok((
        json!({
            "instrument": instrument.name(),
            "catalog_version": instrument.version(),
            "model": model(),
            "catalog": instrument.described(),
            "scope": scope.summary(),
            "range": range.id(),
            "range_description": range.describe(),
            "head": changes::head(root),
            "changed_files": collected.len(),
            "reviewed_files": count,
            "introduced": introduced,
            "skipped": skipped,
            "usage": usage,
            "usage_from_cache": reused,
            "files": ordered,
        }),
        failed,
    ))
}

/// The caveat that belongs next to any number this catalog produces.
const HOW_IT_IS_SCORED: &str = "Each check is a judgment you can verify against the file. Health is \
arithmetic over those checks, done here and not by the model.\n";

/// A band, not a decimal. The measured resolution of these judgments is about
/// one point, so `4.4/10` would claim precision nobody observed. The number
/// stays in `--json`, where something has to sort.
fn band(health: Option<f64>) -> &'static str {
    // Banded on the number a reader sees, not the one behind it, so 4.95 can
    // never print as `weak (5.0/10)`.
    match health.map(|h| (h * 10.0).round() / 10.0) {
        Some(h) if h >= 8.0 => "good",
        Some(h) if h >= 5.0 => "fair",
        Some(_) => "weak",
        None => "\u{2014}",
    }
}

/// The three strongest findings and how many more there are.
///
/// Listing all twelve is a wall. Three checks fire on more than half of a real
/// repository, so a full list buries the one finding that is news under the
/// ones that are true of everything. The rest stay a keystroke away in
/// `quality file <path>`.
fn top_findings(present: &[Value]) -> String {
    let named: Vec<String> = present
        .iter()
        .take(3)
        .map(|p| {
            format!(
                "{} {:.2}",
                p["check"].as_str().unwrap_or("?"),
                p["value"].as_f64().unwrap_or(0.0)
            )
        })
        .collect();
    match present.len().saturating_sub(3) {
        0 => named.join(", "),
        more => format!("{}, +{more} more", named.join(", ")),
    }
}

fn human_quality(report: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    let health = report["health"].as_f64();
    let files = report["files"].as_array().unwrap_or(&empty);
    let scored: Vec<&Value> = files.iter().filter(|f| f["health"].is_number()).collect();
    let count = |low: f64, high: f64| {
        scored
            .iter()
            .filter(|f| {
                let h = f["health"].as_f64().unwrap_or(0.0);
                h >= low && h < high
            })
            .count()
    };
    out.push_str(&format!(
        "Quality {} ({:.1}/10) over {} files.\n",
        band(health),
        health.unwrap_or(0.0),
        scored.len()
    ));
    out.push_str(&format!(
        "  {} good, {} fair, {} weak.\n",
        count(8.0, f64::INFINITY),
        count(5.0, 8.0),
        count(f64::NEG_INFINITY, 5.0)
    ));
    if let Some(resolved) = report["scope_resolved"].as_object() {
        out.push_str(&format!(
            "  {} files under no source root were read by the model from the tree: \
             {} ship, {} do not.\n",
            resolved["asked"].as_u64().unwrap_or(0),
            resolved["ships"].as_u64().unwrap_or(0),
            resolved["does_not"].as_u64().unwrap_or(0)
        ));
    }
    if let Some(limitation) = report["limitation"].as_str() {
        out.push_str(&format!("\n{limitation}\n"));
    }
    let skipped = report["counts"]["skipped"].as_u64().unwrap_or(0);
    if skipped > 0 {
        let by = |reason: &str| {
            report["skipped"]
                .as_array()
                .map(|all| all.iter().filter(|s| s["reason"] == reason).count())
                .unwrap_or(0)
        };
        let scope = &report["scope"];
        out.push_str(&format!(
            "  {} of {skipped} not assessed are test or generated; \
             {} sit under no source root. Add --all to include everything.\n",
            by("test") + by("generated"),
            scope["ambiguous"].as_u64().unwrap_or(0)
        ));
    }
    out.push_str(&format!(
        "Catalog {}, model {}, snapshot {}.\n{HOW_IT_IS_SCORED}\n",
        report["catalog_version"].as_str().unwrap_or("?"),
        report["model"].as_str().unwrap_or("?"),
        report["id"].as_str().unwrap_or("?")
    ));

    let failed: Vec<&Value> = files.iter().filter(|f| f["status"] == "failed").collect();
    let shown = 10.min(scored.len());
    if shown > 0 {
        out.push_str("Weakest:\n");
    }
    for file in scored.iter().take(shown) {
        out.push_str(&format!(
            "  {:>4}  {}\n",
            band(file["health"].as_f64()),
            file["path"].as_str().unwrap_or("?")
        ));
        let present = file["present"].as_array().unwrap_or(&empty);
        if !present.is_empty() {
            out.push_str(&format!("        {}\n", top_findings(present)));
        }
    }
    if scored.len() > shown {
        out.push_str(&format!("  ... and {} more\n", scored.len() - shown));
    }
    for file in failed.iter().take(5) {
        out.push_str(&format!(
            "  error  {}  ({})\n",
            file["path"].as_str().unwrap_or("?"),
            file["error"].as_str().unwrap_or("unknown error")
        ));
    }
    if failed.len() > 5 {
        out.push_str(&format!("  ... and {} more errors\n", failed.len() - 5));
    }
    out.push_str(
        "\nNarrow with `quality gaps`, read one with `quality file <path>`,\nor ask what a change introduced with `quality patch --base origin/main`.\n",
    );
    out
}

/// The security report as text: no number, the flagged files first, each with
/// what fired and, when a run was crossed in, whether tests reach it.
fn human_security(report: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    let files = report["files"].as_array().unwrap_or(&empty);
    let counts = &report["counts"];
    let assessed = counts["assessed"].as_u64().unwrap_or(0);
    let flagged = counts["flagged"].as_u64().unwrap_or(0);
    out.push_str(&format!(
        "Security: {flagged} of {assessed} files flagged, {} clean{}.\n",
        assessed.saturating_sub(flagged),
        match counts["line_confirmed"].as_u64() {
            Some(n) if flagged > 0 => format!("; {n} confirmed at a line"),
            _ => String::new(),
        }
    ));
    if let Some(by_check) = report["by_check"].as_object()
        && !by_check.is_empty()
    {
        let mut pairs: Vec<(&String, u64)> = by_check
            .iter()
            .map(|(check, n)| (check, n.as_u64().unwrap_or(0)))
            .collect();
        pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(b.0)));
        let named: Vec<String> = pairs.iter().map(|(c, n)| format!("{c} {n}")).collect();
        out.push_str(&format!("  {}\n", named.join(", ")));
    }
    if let Some(run) = report["run"].as_str() {
        out.push_str(&format!(
            "  {} flagged files have lines no test in run {run} executed",
            report["flagged_in_untested_code"].as_u64().unwrap_or(0)
        ));
        match report["flagged_executed_unasserted"].as_u64() {
            Some(n) => out.push_str(&format!(
                "; {n} are executed by tests that no assertion is credited with.\n"
            )),
            None => out.push_str(".\n"),
        }
    }
    if let Some(limitation) = report["limitation"].as_str() {
        out.push_str(&format!("\n{limitation}\n"));
    }
    out.push_str(&format!(
        "Catalog {}, model {}, snapshot {}.\nEach line is a judgment you can check against the file. \
         Nothing is averaged; the value is the model's, the evidence is measured.\n\n",
        report["catalog_version"].as_str().unwrap_or("?"),
        report["model"].as_str().unwrap_or("?"),
        report["id"].as_str().unwrap_or("?")
    ));
    let shown: Vec<&Value> = files
        .iter()
        .filter(|f| f["present"].as_array().is_some_and(|p| !p.is_empty()))
        .take(10)
        .collect();
    if !shown.is_empty() {
        out.push_str("Flagged:\n");
    }
    for file in &shown {
        out.push_str(&format!("  {}\n", file["path"].as_str().unwrap_or("?")));
        for finding in file["present"].as_array().unwrap_or(&empty) {
            out.push_str(&format!(
                "    {:.2}  {}{}\n",
                finding["value"].as_f64().unwrap_or(0.0),
                finding["check"].as_str().unwrap_or("?"),
                if finding["tier"] == "line" {
                    ""
                } else {
                    "  (file-level only)"
                }
            ));
            for line in finding["lines"].as_array().unwrap_or(&empty).iter().take(3) {
                out.push_str(&format!(
                    "          line {}  {:.2}  {}{}\n",
                    line["line"].as_u64().unwrap_or(0),
                    line["value"].as_f64().unwrap_or(0.0),
                    line["text"]
                        .as_str()
                        .unwrap_or("")
                        .chars()
                        .take(70)
                        .collect::<String>(),
                    match line["enters_at"].as_u64() {
                        Some(n) => format!("  (enters at line {n})"),
                        None => String::new(),
                    } + &if line["by"] == "agent" {
                        match (
                            line["registered_at"]["file"].as_str(),
                            line["registered_at"]["line"].as_u64(),
                        ) {
                            (Some(f), Some(l)) => format!("  [agent; registered at {f}:{l}]"),
                            _ => "  [agent]".to_owned(),
                        }
                    } else {
                        String::new()
                    }
                ));
            }
        }
        if file["flagged_and_untested"] == true {
            out.push_str(&format!(
                "    and {} of its measured lines are not covered by the run\n",
                file["coverage"]["uncovered_lines"].as_u64().unwrap_or(0)
            ));
        } else if file["coverage"]["in_run"] == false {
            out.push_str("    the run did not measure this file\n");
        }
        for handler in file["handlers"].as_array().unwrap_or(&empty) {
            let without = handler["tests_without"].as_u64().unwrap_or(0);
            let with = handler["tests_with_a_guard"].as_u64().unwrap_or(0);
            if without > 0 {
                out.push_str(&format!(
                    "    {} (line {}) ran under {without} test{} with no guard running{}\n",
                    handler["function"].as_str().unwrap_or("?"),
                    handler["line"].as_u64().unwrap_or(0),
                    if without == 1 { "" } else { "s" },
                    if with > 0 {
                        format!(", and under {with} with one")
                    } else {
                        String::new()
                    }
                ));
            }
        }
        if file["flagged_and_unasserted"] == true {
            out.push_str(
                "    executed by tests, but no assertion is credited with any line of it\n",
            );
        } else if let Some(credited) = file["assertions"]["lines_credited"].as_u64() {
            out.push_str(&format!(
                "    {credited} of its lines are credited to assertions\n"
            ));
            for finding in file["present"].as_array().unwrap_or(&empty) {
                for line in finding["lines"].as_array().unwrap_or(&empty) {
                    match line["asserted"].as_str() {
                        Some("exercised") => out.push_str(&format!(
                            "    line {}: proven reachable by a test that asserts it happens: {}\n",
                            line["line"].as_u64().unwrap_or(0),
                            line["asserted_by"].as_str().unwrap_or("")
                        )),
                        Some("prevented") => out.push_str(&format!(
                            "    line {}: a test asserts it is prevented: {}\n",
                            line["line"].as_u64().unwrap_or(0),
                            line["asserted_by"].as_str().unwrap_or("")
                        )),
                        _ => {}
                    }
                }
            }
        }
    }
    if flagged as usize > shown.len() {
        out.push_str(&format!(
            "  ... and {} more\n",
            flagged as usize - shown.len()
        ));
    }
    let paths = report["paths"].as_array().unwrap_or(&empty);
    if !paths.is_empty() {
        out.push_str(&format!("\nCross-file paths confirmed: {}\n", paths.len()));
        for path in paths.iter().take(10) {
            out.push_str(&format!(
                "  {:.2}  {}{}  {}:{} {} -> {}:{} {}\n",
                path["value"].as_f64().unwrap_or(0.0),
                path["check"].as_str().unwrap_or("?"),
                if path["via"] == "run" {
                    " (observed in a test)"
                } else {
                    ""
                },
                path["caller"]["file"].as_str().unwrap_or("?"),
                path["caller"]["line"].as_u64().unwrap_or(0),
                path["caller"]["function"].as_str().unwrap_or("?"),
                path["callee"]["file"].as_str().unwrap_or("?"),
                path["callee"]["line"].as_u64().unwrap_or(0),
                path["callee"]["function"].as_str().unwrap_or("?"),
            ));
        }
    }
    let failed: Vec<&Value> = files.iter().filter(|f| f["status"] == "failed").collect();
    for file in failed.iter().take(5) {
        out.push_str(&format!(
            "  error  {}  ({})\n",
            file["path"].as_str().unwrap_or("?"),
            file["error"].as_str().unwrap_or("unknown error")
        ));
    }
    if failed.len() > 5 {
        out.push_str(&format!("  ... and {} more errors\n", failed.len() - 5));
    }
    out.push_str(
        "\nNarrow with `security gaps`, read one with `security file <path>`,\nor ask what a change introduced with `security patch --base origin/main`.\n",
    );
    out
}

fn human_patch(report: &Value, limit: usize) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    out.push_str(HOW_IT_IS_SCORED);
    out.push_str(&format!(
        "Reviewing {}.\n\n",
        report["range_description"].as_str().unwrap_or("a change")
    ));
    let reviewed = report["reviewed_files"].as_u64().unwrap_or(0);
    let introduced = report["introduced"].as_u64().unwrap_or(0);
    if reviewed == 0 {
        out.push_str("No changed source files to review.\n");
        return out;
    }
    if introduced == 0 {
        out.push_str(&format!(
            "Nothing introduced across {reviewed} changed files.\n"
        ));
    }
    let files = report["files"].as_array().unwrap_or(&empty);
    let shown = if limit == 0 { files.len() } else { limit };
    for file in files.iter().take(shown) {
        if file["status"] == "failed" {
            out.push_str(&format!(
                "  failed  {}  ({})\n",
                file["path"].as_str().unwrap_or("?"),
                file["error"].as_str().unwrap_or("unknown error")
            ));
            continue;
        }
        let fired = file["present"].as_array().unwrap_or(&empty);
        if fired.is_empty() {
            continue;
        }
        let basis = file["basis"].as_str().unwrap_or("both versions");
        out.push_str(&format!("{}\n", file["path"].as_str().unwrap_or("?")));
        if file["untested_and_changed"] == true {
            out.push_str(&format!(
                "  and {} of its measured lines are not covered by the run\n",
                file["coverage"]["uncovered_lines"].as_u64().unwrap_or(0)
            ));
        }
        if basis != "both versions" {
            out.push_str(&format!("  ({basis})\n"));
        }
        for finding in fired {
            out.push_str(&format!(
                "  {:.2}  {}\n",
                finding["value"].as_f64().unwrap_or(0.0),
                finding["check"].as_str().unwrap_or("?")
            ));
        }
        out.push('\n');
    }
    if files.len() > shown {
        out.push_str(&format!(
            "... and {} more changed files\n",
            files.len() - shown
        ));
    }
    let skipped = report["skipped"].as_array().unwrap_or(&empty).len();
    if skipped > 0 {
        out.push_str(&format!("{skipped} changed files not reviewed.\n"));
    }
    out
}

/// Cross what a change introduced with what a saved run covered.
///
/// Neither half justifies stopping anyone on its own. A structural property is
/// a judgment, and an uncovered line is normal in code nobody has tested yet.
/// Both at once describes something else: a change that made code harder to
/// follow in a place no test exercises, which is the one claim this product can
/// make that a coverage tool and a quality tool cannot make separately.
///
/// Coverage is read from a run that already happened. This never starts one,
/// and nothing about quality is added to a run's own output, because an
/// assessment costs money and needs a credential.
fn cross_with_coverage(
    report: &mut Value,
    selector: &str,
    file_flag: &str,
    total_key: &str,
) -> Result<(), String> {
    let selector = (selector != "latest").then_some(selector);
    let view = crate::load_run_view(selector)?;
    // Assertion credit is the third shelf, and only the security view asks
    // for it: a change review already says what appeared and where tests do
    // not go. A run with no assertion map leaves every file on the second.
    let asserted = (file_flag == "flagged_and_untested")
        .then(|| crate::load_asserted_lines(selector).unwrap_or_default());
    // What each credited flow establishes, asked once of the map's text. A
    // line credited by a flow that asserts prevention is close to handled; a
    // line credited by one that asserts the operation ran is proven reachable.
    let verdicts: BTreeMap<(String, u64), (String, String)> = asserted
        .as_ref()
        .filter(|a| !a.is_empty())
        .and_then(|_| crate::load_credited_flows(selector).ok())
        .filter(|flows| !flows.is_empty())
        .map(|flows| {
            let key = std::env::var("TYPESAFE_API_KEY").ok();
            let request = catalog::security::flow_request(&flows);
            let mut out = BTreeMap::new();
            if let Ok(Some(bytes)) = within_budget(&request)
                && let Ok(root) = std::env::current_dir()
            {
                let agent = client();
                let answered = answer_all(
                    &root,
                    "security",
                    &agent,
                    key.as_deref(),
                    false,
                    &[((0, None), request, bytes)],
                    false,
                );
                if let Some(Ok((_, entry, _, _))) = answered.into_values().next() {
                    for (i, flow) in flows.iter().enumerate() {
                        if let Some(verdict) = choice(&entry.response, &format!("w{i}")) {
                            for (file, line) in &flow.lines {
                                out.insert(
                                    (file.clone(), *line),
                                    (verdict.clone(), flow.assertion.clone()),
                                );
                            }
                        }
                    }
                }
            }
            out
        })
        .unwrap_or_default();
    let mut both = 0usize;
    let mut unasserted = 0usize;
    let empty = Vec::new();
    let files = report["files"].as_array().cloned().unwrap_or(empty);
    let crossed: Vec<Value> = files
        .into_iter()
        .map(|mut file| {
            let Some(path) = file["path"].as_str().map(str::to_owned) else {
                return file;
            };
            let introduced = file["present"]
                .as_array()
                .is_some_and(|present| !present.is_empty());
            match view.file(&path) {
                Some(measured) => {
                    let uncovered = measured.uncovered_lines.len();
                    file["coverage"] = json!({
                        "measured_lines": measured.measured_lines.len(),
                        "uncovered_lines": uncovered,
                        "in_run": true,
                    });
                    if introduced && uncovered > 0 {
                        both += 1;
                        file[file_flag] = json!(true);
                    }
                    if let Some(asserted) = &asserted
                        && introduced
                        && measured.measured_lines.len() > uncovered
                    {
                        let credited = asserted.get(&path).map_or(0, |lines| lines.len());
                        file["assertions"] = json!({ "lines_credited": credited });
                        if credited == 0 {
                            unasserted += 1;
                            file["flagged_and_unasserted"] = json!(true);
                        }
                        // Per confirmed line: what the crediting assertion establishes.
                        if let Some(present) = file["present"].as_array_mut() {
                            for finding in present {
                                if let Some(lines) = finding["lines"].as_array_mut() {
                                    for line in lines {
                                        let number = line["line"].as_u64().unwrap_or(0);
                                        if let Some((verdict, assertion)) =
                                            verdicts.get(&(path.clone(), number))
                                        {
                                            line["asserted"] = json!(verdict);
                                            line["asserted_by"] = json!(assertion);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                None => {
                    file["coverage"] = json!({
                        "in_run": false,
                        "note": "the run did not measure this file",
                    });
                }
            }
            file
        })
        .collect();
    report["run"] = json!(view.run);
    report["run_stale"] = json!(view.stale);
    report["files"] = json!(crossed);
    report[total_key] = json!(both);
    if asserted.is_some() {
        report["flagged_executed_unasserted"] = json!(unasserted);
    }
    Ok(())
}

/// GitHub workflow annotations for what a change introduced.
///
/// Printed on stdout, needing no token and posting no comment, the way the
/// coverage patch already does it. A named property is a fact about a file
/// rather than about one line, so each annotation is anchored at the start of
/// the change and says which check fired, never guessing at a line.
fn annotations(report: &Value) -> String {
    let empty = Vec::new();
    let escape = |text: &str| {
        text.replace('%', "%25")
            .replace('\r', "%0D")
            .replace('\n', "%0A")
    };
    let mut out = String::new();
    for file in report["files"].as_array().unwrap_or(&empty) {
        let Some(path) = file["path"].as_str() else {
            continue;
        };
        let line = file["line"].as_u64().unwrap_or(1).max(1);
        for finding in file["present"].as_array().unwrap_or(&empty) {
            let Some(check) = finding["check"].as_str() else {
                continue;
            };
            let value = finding["value"].as_f64().unwrap_or(0.0);
            out.push_str(&format!(
                "::warning file={path},line={line},title=quality: {check}::{}\n",
                escape(&format!(
                    "This change appears to introduce {check} ({value:.2}). \
                     Advisory: a model judgment you can check against the file."
                ))
            ));
        }
    }
    out
}

fn present(view: Value, json: bool) -> Result<bool, String> {
    if json {
        println!(
            "{}",
            serde_json::to_string_pretty(&view).map_err(|e| e.to_string())?
        );
    } else {
        print!("{}", query::render(&view));
    }
    Ok(false)
}

/// Saved assessments, newest first, for a reader outside this module.
///
/// Returns the manifest and the per-file rows together, because a report needs
/// both: the manifest says which instrument answered and over what source, and
/// only the rows can be placed beside a file. Snapshots that cannot be read are
/// left out rather than failing the caller, matching how they are listed.
pub fn report_snapshots(root: &Path, lane: &str, limit: usize) -> Vec<(String, Value, Value)> {
    store::list(root, lane)
        .unwrap_or_default()
        .into_iter()
        .take(limit)
        .filter_map(|(id, manifest)| {
            let (_, files) = store::read(root, lane, &id).ok()?;
            Some((id, manifest, files))
        })
        .collect()
}

pub fn command(arguments: Vec<String>) -> ExitCode {
    dispatch(arguments, Instrument::Catalog)
}

/// `supercov security`: the same grammar as `quality`, the security catalog,
/// its own lane under `.supercov/`, and no number.
pub fn security_command(arguments: Vec<String>) -> ExitCode {
    dispatch(arguments, Instrument::Security)
}

fn dispatch(arguments: Vec<String>, instrument: Instrument) -> ExitCode {
    if arguments.iter().any(|arg| arg == "--help" || arg == "-h") {
        print!(
            "{}",
            match instrument {
                Instrument::Catalog => HELP,
                Instrument::Security => HELP_SECURITY,
            }
        );
        return ExitCode::SUCCESS;
    }
    let lane = instrument.lane();
    let result = (|| -> Result<bool, String> {
        let root = std::env::current_dir()
            .and_then(|p| p.canonicalize())
            .map_err(|e| e.to_string())?;
        match parse(arguments)? {
            Command::Snapshots { json, limit } => {
                present(query::snapshots(&root, lane, limit)?, json)
            }
            Command::Clean {
                keep,
                dry_run,
                json,
            } => present(clean(&root, lane, keep, dry_run)?, json),
            Command::Gaps {
                snapshot,
                json,
                limit,
            } => present(query::gaps(&root, lane, snapshot.as_deref(), limit)?, json),
            Command::Scope { json, limit } => {
                let found = discover_for(&root, &here(), instrument)?;
                let view = scope_for(&root, &found, instrument);
                let shown: Vec<&scope::Entry> = view
                    .entries
                    .iter()
                    .filter(|e| e.status != scope::Status::Included)
                    .take(if limit == 0 { usize::MAX } else { limit })
                    .collect();
                present(
                    json!({
                        "view": "scope",
                        "summary": view.summary(),
                        "limitation": view.limitation(),
                        "not_included": shown,
                        "total_not_included": view.entries.iter()
                            .filter(|e| e.status != scope::Status::Included).count(),
                    }),
                    json,
                )
            }
            Command::Show {
                snapshot,
                json,
                limit,
            } => present(query::show(&root, lane, snapshot.as_deref(), limit)?, json),
            Command::File {
                path,
                snapshot,
                json,
            } => present(query::file(&root, lane, &path, snapshot.as_deref())?, json),
            Command::Diff {
                from,
                to,
                json,
                limit,
            } => present(query::diff(&root, lane, &from, &to, limit)?, json),
            Command::Health(options) => {
                let key = std::env::var("TYPESAFE_API_KEY").ok();
                let (mut report, failed) = run_health(&root, &options, key.as_deref(), instrument)?;
                if let Some(selector) = options.run.as_deref().filter(|_| !options.dry_run) {
                    cross_with_coverage(
                        &mut report,
                        selector,
                        "flagged_and_untested",
                        "flagged_in_untested_code",
                    )?;
                }
                if options.json || options.dry_run {
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&report).map_err(|e| e.to_string())?
                    );
                } else if instrument.scores() {
                    print!("{}", human_quality(&report));
                } else {
                    print!("{}", human_security(&report));
                }
                if let Some(note) = unassessed_note(&report) {
                    eprintln!("{note}");
                }
                Ok(failed)
            }
            Command::Patch {
                range,
                paths,
                json,
                refresh,
                limit,
                annotate,
                all,
                run,
            } => {
                let key = std::env::var("TYPESAFE_API_KEY").ok();
                if !changes::is_repository(&root) {
                    return Err(format!(
                        "{lane} patch needs a Git repository; run it inside one"
                    ));
                }
                let range = range.unwrap_or_else(|| changes::automatic(&root));
                let (mut report, failed) = run_patch(
                    &root,
                    &range,
                    &paths,
                    refresh,
                    all,
                    key.as_deref(),
                    instrument,
                )?;
                if let Some(selector) = run.as_deref() {
                    cross_with_coverage(
                        &mut report,
                        selector,
                        "untested_and_changed",
                        "introduced_in_untested_code",
                    )?;
                }
                if json {
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&report).map_err(|e| e.to_string())?
                    );
                } else {
                    print!("{}", human_patch(&report, limit));
                }
                if annotate {
                    print!("{}", annotations(&report));
                }
                if let Some(note) = unassessed_note(&report) {
                    eprintln!("{note}");
                }
                Ok(failed)
            }
        }
    })();
    match result {
        Ok(false) => ExitCode::SUCCESS,
        Ok(true) => ExitCode::from(2),
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

#[cfg(test)]
mod tests;
