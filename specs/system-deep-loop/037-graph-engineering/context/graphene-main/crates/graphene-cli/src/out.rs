//! Output discipline.
//!
//! **A refusal is a result, not an error.** It goes to stdout as JSON with exit
//! 0, because the caller is meant to read and act on it. Non-zero is reserved
//! for genuine failure: bad usage, an unreachable store, a failed gate, a
//! protocol mismatch.
//!
//! The exception is `--quiet`, whose contract is that the exit code is the only
//! channel. Staying at 0 there would emit nothing *and* signal nothing, so a
//! caller could not tell a refusal from success.

use graphene_core::refusal::Refusal;
use serde::Serialize;

/// Exit codes (spec 07 §11).
pub mod code {
    pub const OK: i32 = 0;
    pub const USAGE: i32 = 1;
    pub const STORE: i32 = 2;
    pub const CHECK_FAILED: i32 = 3;
    pub const PROTOCOL: i32 = 4;
    /// Only under `--quiet`. With output, a refusal is readable and exits 0.
    pub const REFUSED: i32 = 5;
}

#[derive(Clone, Copy, Debug)]
pub struct Format {
    pub human: bool,
    pub quiet: bool,
}

/// Emit a successful result and exit 0.
pub fn ok<T: Serialize>(value: &T, fmt: Format) -> i32 {
    if fmt.quiet {
        return code::OK;
    }
    if fmt.human {
        println!("{}", human(value));
    } else {
        println!("{}", serde_json::to_string_pretty(value).unwrap_or_default());
    }
    code::OK
}

/// Emit a structured refusal — **exit 0**, unless the caller asked for the exit
/// code to be the only channel.
pub fn refused(r: &Refusal, fmt: Format) -> i32 {
    if fmt.quiet {
        return code::REFUSED;
    }
    if fmt.human {
        eprintln!("refused: {}", r.reason);
        eprintln!("  try: {:?}", r.suggestion);
        if let Some(d) = r.detail() {
            for s in &d.stale {
                eprintln!("  stale: {} — {} ({})", s.id, s.summary, s.state.as_str());
            }
        }
    } else {
        println!(
            "{}",
            serde_json::to_string_pretty(&serde_json::json!({ "refused": r })).unwrap_or_default()
        );
    }
    code::OK
}

/// Emit a genuine failure and its exit code.
pub fn failed(message: impl std::fmt::Display, exit: i32, fmt: Format) -> i32 {
    if !fmt.quiet {
        if fmt.human {
            eprintln!("error: {message}");
        } else {
            eprintln!(
                "{}",
                serde_json::to_string(&serde_json::json!({ "error": message.to_string() }))
                    .unwrap_or_default()
            );
        }
    }
    exit
}

/// A readable rendering for a person at a terminal. Never the default.
fn human<T: Serialize>(value: &T) -> String {
    let v = serde_json::to_value(value).unwrap_or_default();
    render(&v, 0)
}

fn render(v: &serde_json::Value, indent: usize) -> String {
    let pad = "  ".repeat(indent);
    match v {
        serde_json::Value::Object(map) => map
            .iter()
            .filter(|(_, val)| !is_empty(val))
            .map(|(k, val)| {
                if val.is_object() || val.is_array() {
                    format!("{pad}{k}:\n{}", render(val, indent + 1))
                } else {
                    format!("{pad}{k}: {}", scalar(val))
                }
            })
            .collect::<Vec<_>>()
            .join("\n"),
        serde_json::Value::Array(items) => items
            .iter()
            .map(|i| {
                if i.is_object() {
                    format!("{pad}-\n{}", render(i, indent + 1))
                } else {
                    format!("{pad}- {}", scalar(i))
                }
            })
            .collect::<Vec<_>>()
            .join("\n"),
        other => format!("{pad}{}", scalar(other)),
    }
}

fn scalar(v: &serde_json::Value) -> String {
    match v {
        serde_json::Value::String(s) => s.clone(),
        other => other.to_string(),
    }
}

fn is_empty(v: &serde_json::Value) -> bool {
    match v {
        serde_json::Value::Null => true,
        serde_json::Value::Array(a) => a.is_empty(),
        serde_json::Value::Object(o) => o.is_empty(),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use graphene_core::refusal::{RefusalCode, Suggestion};

    fn a_refusal() -> Refusal {
        Refusal::new(
            RefusalCode::AlreadyClaimed,
            Suggestion::ClaimAnother,
            "another session holds this node",
        )
    }

    #[test]
    fn a_refusal_exits_zero_because_it_is_a_result() {
        assert_eq!(refused(&a_refusal(), Format { human: false, quiet: false }), code::OK);
    }

    /// `--quiet` means the exit code is the only channel. Exiting 0 there emits
    /// nothing and signals nothing, so a refusal is indistinguishable from
    /// success — which is how a scripted `gr done && …` proceeds on work it
    /// never actually recorded.
    #[test]
    fn a_refusal_is_visible_in_the_exit_code_when_that_is_all_there_is() {
        assert_eq!(refused(&a_refusal(), Format { human: false, quiet: true }), code::REFUSED);
        assert_ne!(code::REFUSED, code::OK);
    }

    #[test]
    fn genuine_failures_carry_their_own_codes() {
        let f = Format { human: false, quiet: true };
        assert_eq!(failed("bad flags", code::USAGE, f), 1);
        assert_eq!(failed("no store", code::STORE, f), 2);
        assert_eq!(failed("check failed", code::CHECK_FAILED, f), 3);
        assert_eq!(failed("version skew", code::PROTOCOL, f), 4);
    }

    #[test]
    fn human_rendering_skips_empty_fields() {
        let v = serde_json::json!({ "name": "fetch", "tags": [], "notes": null, "count": 3 });
        let out = human(&v);
        assert!(out.contains("name: fetch"));
        assert!(out.contains("count: 3"));
        assert!(!out.contains("tags"), "an empty list is noise at a terminal");
        assert!(!out.contains("notes"));
    }
}
