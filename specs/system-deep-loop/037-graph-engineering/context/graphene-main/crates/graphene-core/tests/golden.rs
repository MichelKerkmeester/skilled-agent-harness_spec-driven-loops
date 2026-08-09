//! Spec 10 §5: a committed corpus of logs with their expected folds.
//!
//! Each case is a `.jsonl` log beside a `.expected.json` snapshot of the fold it
//! must produce. A change to fold semantics either leaves these untouched or is
//! a deliberate act with a visible diff — never a silent drift.
//!
//! Regenerate with `GRAPHENE_BLESS=1 cargo test -p graphene-core --test golden`,
//! and read the diff before committing it.

use std::path::{Path, PathBuf};

use graphene_core::event::Record;
use graphene_core::fold::{apply, fold, fold_up_to, State};

fn corpus() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/golden")
}

fn cases() -> Vec<PathBuf> {
    let mut out: Vec<PathBuf> = std::fs::read_dir(corpus())
        .expect("the golden corpus directory exists")
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "jsonl"))
        .collect();
    out.sort();
    assert!(!out.is_empty(), "the golden corpus is empty");
    out
}

fn read_log(path: &Path) -> Vec<Record> {
    std::fs::read_to_string(path)
        .unwrap()
        .lines()
        .filter(|l| !l.trim().is_empty() && !l.trim_start().starts_with("//"))
        .enumerate()
        .map(|(i, l)| {
            serde_json::from_str(l).unwrap_or_else(|e| panic!("{}:{}: {e}", path.display(), i + 1))
        })
        .collect()
}

fn canonical(state: &State) -> String {
    let mut s = serde_json::to_string_pretty(state).unwrap();
    s.push('\n');
    s
}

#[test]
fn every_golden_log_folds_to_its_recorded_state() {
    let bless = std::env::var("GRAPHENE_BLESS").is_ok();

    for log in cases() {
        let name = log.file_stem().unwrap().to_string_lossy().into_owned();
        let records = read_log(&log);
        let state = fold(&records).unwrap_or_else(|e| panic!("{name}: the log does not fold: {e}"));
        let expected_path = log.with_extension("expected.json");
        let actual = canonical(&state);

        if bless {
            std::fs::write(&expected_path, &actual).unwrap();
            continue;
        }

        let expected = std::fs::read_to_string(&expected_path).unwrap_or_else(|_| {
            panic!("{name}: no snapshot; run with GRAPHENE_BLESS=1 and read the diff")
        });
        assert_eq!(
            actual, expected,
            "{name}: the fold changed. If that was deliberate, GRAPHENE_BLESS=1 and commit the diff."
        );
    }
}

/// Rebuild equivalence over the committed corpus, not just generated logs.
#[test]
fn every_golden_log_rebuilds_to_the_same_state() {
    for log in cases() {
        let records = read_log(&log);
        let rebuilt = fold(&records).unwrap();
        let mut incremental = State::default();
        for r in &records {
            apply(&mut incremental, r).unwrap();
        }
        assert_eq!(rebuilt, incremental, "{}", log.display());
    }
}

/// Point-in-time over the corpus: the state at seq n is the state a live fold
/// was in after event n.
#[test]
fn every_golden_log_replays_to_any_point() {
    for log in cases() {
        let records = read_log(&log);
        let mut live = State::default();
        for r in &records {
            apply(&mut live, r).unwrap();
            let at = fold_up_to(&records, r.seq).unwrap();
            assert_eq!(live, at, "{} at seq {}", log.display(), r.seq.0);
        }
    }
}

/// The corpus has to cover what spec 10 §5 says it covers, or it is a corpus of
/// whatever happened to get written.
#[test]
fn the_corpus_covers_what_it_claims_to() {
    let names: Vec<String> =
        cases().iter().map(|p| p.file_stem().unwrap().to_string_lossy().into_owned()).collect();

    for required in [
        "truth-states",
        "cascade",
        "nogood",
        "for-each",
        "claim-lease",
        "human-gate",
        "human-timeout",
        "out-of-order",
        "stale-chain",
        "amendment",
    ] {
        assert!(
            names.iter().any(|n| n == required),
            "the corpus is missing `{required}.jsonl`; §5 lists it as required coverage"
        );
    }
}
