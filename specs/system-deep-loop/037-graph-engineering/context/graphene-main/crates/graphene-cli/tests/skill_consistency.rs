//! Spec 10 §7. The surface is derived from the compiled `clap` command rather
//! than transcribed, so a rename in `cli.rs` fails here rather than at the
//! moment an agent runs the command.

use std::collections::{BTreeMap, BTreeSet};
use std::path::{Path, PathBuf};

use clap::CommandFactory;
use graphene_cli::cli::Cli;
use serde_json::Value;

struct Surface {
    globals: BTreeSet<String>,
    commands: BTreeMap<String, CommandSurface>,
}

#[derive(Default)]
struct CommandSurface {
    positional: BTreeSet<String>,
    flags: BTreeSet<String>,
    required: BTreeSet<String>,
}

fn surface() -> Surface {
    let cmd = Cli::command();
    let globals = cmd.get_arguments().filter(|a| a.is_global_set()).map(long_of).collect();

    let commands = cmd
        .get_subcommands()
        .map(|sub| {
            let mut s = CommandSurface::default();
            for a in sub.get_arguments().filter(|a| !a.is_global_set()) {
                if a.is_positional() {
                    s.positional.insert(a.get_id().to_string());
                } else {
                    let long = long_of(a);
                    if a.is_required_set() {
                        s.required.insert(long.clone());
                    }
                    s.flags.insert(long);
                }
            }
            (sub.get_name().to_string(), s)
        })
        .collect();

    Surface { globals, commands }
}

fn long_of(a: &clap::Arg) -> String {
    format!("--{}", a.get_long().unwrap_or(a.get_id().as_str()))
}

fn skill_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../skill").canonicalize().unwrap()
}

fn read(rel: &str) -> String {
    let p = skill_dir().join(rel);
    std::fs::read_to_string(&p).unwrap_or_else(|e| panic!("{}: {e}", p.display()))
}

fn markdown_files() -> Vec<(String, String)> {
    let mut out = vec![("SKILL.md".to_string(), read("SKILL.md"))];
    let refs = skill_dir().join("references");
    let mut names: Vec<_> = std::fs::read_dir(&refs)
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().into_owned())
        .filter(|n| n.ends_with(".md"))
        .collect();
    names.sort();
    for n in names {
        let body = read(&format!("references/{n}"));
        out.push((format!("references/{n}"), body));
    }
    out
}

fn invocations(body: &str) -> Vec<(String, Vec<String>, usize)> {
    let mut found = vec![];
    for (i, raw) in joined_lines(body) {
        let line = raw.trim_start_matches(['|', ' ', '`', '-', '*', '>']);
        let starts: Vec<usize> = line
            .match_indices("gr ")
            .map(|(at, _)| at)
            .filter(|at| {
                !matches!(line[..*at].chars().next_back(),
                    Some(c) if c.is_alphanumeric() || c == '-' || c == '/')
            })
            .collect();

        for (n, start) in starts.iter().enumerate() {
            let end = starts.get(n + 1).copied().unwrap_or(line.len());
            let mut words = line[start + 3..end].split_whitespace();
            let Some(verb) = words.next() else { continue };
            let verb = verb.trim_matches(|c: char| !c.is_ascii_alphanumeric() && c != '-');
            if verb.is_empty() {
                continue;
            }
            let flags = words
                .filter_map(|w| w.strip_prefix("--"))
                .map(|w| {
                    w.trim_matches(|c: char| !c.is_ascii_alphanumeric() && c != '-' && c != '_')
                })
                .filter(|f| !f.is_empty())
                .map(|f| format!("--{f}"))
                .collect();
            found.push((verb.to_string(), flags, i));
        }
    }
    found
}

#[test]
fn manifest_mirrors_the_binary() {
    let s = surface();
    let manifest: Value = serde_json::from_str(&read("manifest.json")).unwrap();

    let declared_globals: BTreeSet<String> =
        manifest["globals"].as_object().unwrap().keys().cloned().collect();
    assert_eq!(declared_globals, s.globals, "manifest globals drifted from clap");

    let mut declared = BTreeMap::new();
    for (_, group) in manifest["groups"].as_object().unwrap() {
        for (name, entry) in group["commands"].as_object().unwrap() {
            assert!(
                declared.insert(name.clone(), entry.clone()).is_none(),
                "{name} is listed in two manifest groups"
            );
        }
    }

    let declared_names: BTreeSet<&String> = declared.keys().collect();
    let actual_names: BTreeSet<&String> = s.commands.keys().collect();
    assert_eq!(
        declared_names, actual_names,
        "manifest commands drifted from the binary — regenerate skill/manifest.json"
    );

    for (name, entry) in &declared {
        let actual = &s.commands[name];
        let list = |key: &str| -> BTreeSet<String> {
            entry
                .get(key)
                .and_then(Value::as_array)
                .map(|a| a.iter().map(|v| v.as_str().unwrap().to_string()).collect())
                .unwrap_or_default()
        };
        assert_eq!(list("args"), actual.positional, "gr {name}: positional args drifted");
        assert_eq!(list("flags"), actual.flags, "gr {name}: flags drifted");
        assert_eq!(list("required"), actual.required, "gr {name}: required flags drifted");
        assert!(
            entry.get("use_when").and_then(Value::as_str).is_some_and(|s| !s.is_empty()),
            "gr {name}: manifest entry has no use_when — an agent cannot tell when to reach for it"
        );
    }
}

#[test]
fn every_command_named_in_the_prose_exists() {
    let s = surface();
    let mut problems = vec![];

    for (file, body) in markdown_files() {
        for (verb, flags, line) in invocations(&body) {
            let Some(cmd) = s.commands.get(&verb) else {
                problems.push(format!("{file}:{line}: `gr {verb}` is not a command"));
                continue;
            };
            for f in flags {
                if !cmd.flags.contains(&f) && !s.globals.contains(&f) {
                    problems.push(format!("{file}:{line}: `gr {verb}` has no {f}"));
                }
            }
        }
    }

    assert!(
        problems.is_empty(),
        "the skill names things the binary does not have:\n{}",
        problems.join("\n")
    );
}

#[test]
fn every_required_flag_appears_in_the_documented_form() {
    let s = surface();
    let bodies: Vec<String> = markdown_files().into_iter().map(|(_, b)| b).collect();
    let mut problems = vec![];

    for (file, body) in markdown_files().iter().zip(bodies.iter()) {
        let _ = file;
        for (verb, flags, line) in invocations(body) {
            let Some(cmd) = s.commands.get(&verb) else { continue };
            if flags.is_empty() {
                continue;
            }
            for missing in cmd.required.difference(&flags.iter().cloned().collect()) {
                problems.push(format!("{}:{line}: `gr {verb}` omits required {missing}", file.0));
            }
        }
    }

    assert!(
        problems.is_empty(),
        "the skill shows invocations that would not parse:\n{}",
        problems.join("\n")
    );
}

#[test]
fn every_referenced_file_exists() {
    let dir = skill_dir();
    let mut missing = vec![];

    for (file, body) in markdown_files() {
        let base = match Path::new(&file).parent() {
            Some(p) if !p.as_os_str().is_empty() => dir.join(p),
            _ => dir.clone(),
        };
        for (_, link) in link_targets(&body) {
            if !base.join(&link).exists() && !dir.join(&link).exists() {
                missing.push(format!("{file} → {link}"));
            }
        }
    }

    for entry in std::fs::read_dir(dir.join("references")).unwrap() {
        let name = entry.unwrap().file_name().to_string_lossy().into_owned();
        if name.ends_with(".md") {
            let linked = read("SKILL.md").contains(&format!("references/{name}"));
            assert!(linked, "references/{name} exists but SKILL.md never points at it");
        }
    }

    assert!(
        missing.is_empty(),
        "the skill links to files that do not exist:\n{}",
        missing.join("\n")
    );
}

fn joined_lines(body: &str) -> Vec<(usize, String)> {
    let mut out: Vec<(usize, String)> = vec![];
    let mut pending: Option<(usize, String)> = None;
    for (i, raw) in body.lines().enumerate() {
        let line = raw.trim_end();
        let (start, mut acc) = match pending.take() {
            Some((s, acc)) => (s, acc),
            None => (i + 1, String::new()),
        };
        match line.strip_suffix('\\') {
            Some(head) => {
                acc.push_str(head);
                acc.push(' ');
                pending = Some((start, acc));
            }
            None => {
                acc.push_str(line);
                out.push((start, acc));
            }
        }
    }
    if let Some(p) = pending {
        out.push(p);
    }
    out
}

fn link_targets(body: &str) -> Vec<(usize, String)> {
    let mut out = vec![];
    for (i, line) in body.lines().enumerate() {
        let mut rest = line;
        while let Some(open) = rest.find("](") {
            let after = &rest[open + 2..];
            match after.find(')') {
                Some(close) => {
                    let target = &after[..close];
                    if !target.starts_with("http") && !target.starts_with('#') {
                        out.push((i + 1, target.to_string()));
                    }
                    rest = &after[close..];
                }
                None => break,
            }
        }
        for word in line.split(|c: char| c.is_whitespace() || c == '`' || c == '|') {
            let w = word.trim_matches(',');
            if (w.starts_with("examples/") || w.starts_with("templates/")) && w.ends_with(".json") {
                out.push((i + 1, w.to_string()));
            }
        }
    }
    out
}

#[test]
fn every_next_action_is_documented_and_real() {
    use graphene_exec::NextAction;

    let variants = [
        NextAction::Check,
        NextAction::FixCheckErrors,
        NextAction::Review,
        NextAction::ResolveFindings { open: 1 },
        NextAction::PresentToUser,
        NextAction::Start,
        NextAction::Claim { nodes: vec![] },
        NextAction::ReportAwaiting { nodes: vec![] },
        NextAction::Wait { reason: String::new() },
        NextAction::Finish,
        NextAction::Nothing { reason: String::new() },
    ];

    let skill = read("SKILL.md");
    for v in variants {
        let tag = serde_json::to_value(&v).unwrap()["do"].as_str().unwrap().to_string();
        assert!(
            skill.contains(&format!("`{tag}`")),
            "next_action `{tag}` is not in the SKILL.md table — an agent would receive it with no instruction"
        );
    }
}

#[test]
fn every_refusal_code_named_in_the_prose_is_real() {
    use graphene_core::refusal::RefusalCode;

    let real: BTreeSet<String> = [
        RefusalCode::TypeForbidden,
        RefusalCode::NoObservationProof,
        RefusalCode::SameSourceCorroboration,
        RefusalCode::FidelityWouldFall,
        RefusalCode::SensitivityWouldFall,
        RefusalCode::WouldCycle,
        RefusalCode::WouldCompleteNogood,
        RefusalCode::NogoodUnenforceable,
        RefusalCode::AlreadyClaimed,
        RefusalCode::StalePremise,
        RefusalCode::ClaimRevoked,
        RefusalCode::NotClaimable,
        RefusalCode::BadGraphState,
        RefusalCode::OutputSchemaViolation,
        RefusalCode::BudgetExhausted,
        RefusalCode::LimitExceeded,
        RefusalCode::NotFound,
        RefusalCode::AlreadyApplied,
    ]
    .iter()
    .map(|c| serde_json::to_value(c).unwrap().as_str().unwrap().to_string())
    .collect();

    let failure = read("references/failure.md");
    let mut named = BTreeSet::new();
    for line in failure.lines().filter(|l| l.starts_with('|')) {
        if let Some(cell) = line.split('|').nth(1) {
            let code = cell.trim().trim_matches('`').trim();
            let is_rule = !code.is_empty() && code.chars().all(|c| c == '-' || c == ':');
            if code.contains('-') && !code.contains(' ') && !is_rule {
                named.insert(code.to_string());
            }
        }
    }

    assert!(!named.is_empty(), "failure.md documents no refusal codes");
    let unknown: Vec<_> = named.difference(&real).collect();
    assert!(unknown.is_empty(), "failure.md names refusal codes that do not exist: {unknown:?}");
}
