//! What instrumentation costs, measured rather than asserted.
//!
//! Ignored by default because it is a measurement, not a pass/fail: timings
//! move with the machine, and a threshold that fails on a busy laptop teaches
//! people to rerun suites until they go green. Run it deliberately:
//!
//!     cargo test -p supercov-engine --test go_overhead -- --ignored --nocapture
//!
//! Two workloads, because one number would mislead. A tight numeric loop is
//! nearly all probes and shows the worst case; a string, map and sort pipeline
//! does real work between them and shows what a project would actually feel.

use std::path::{Path, PathBuf};
use std::process::Command;

use supercov_engine::go_instrumenter::{RUNTIME_IMPORT, build_go_obligations, rewrite};
use supercov_engine::go_test_harness::{probe_array_file, synthesized_harness};

mod common;

fn go_binary() -> Option<PathBuf> {
    for candidate in ["go", "/opt/homebrew/bin/go", "/usr/local/go/bin/go"] {
        let path = PathBuf::from(candidate);
        if Command::new(&path)
            .arg("version")
            .output()
            .is_ok_and(|out| out.status.success())
        {
            return Some(path);
        }
    }
    None
}

fn temporary(label: &str) -> PathBuf {
    let root = std::env::temp_dir().join(format!(
        "supercov-go-overhead-{label}-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir_all(&root).unwrap();
    root
}

fn write(root: &Path, relative: &str, contents: &str) {
    let path = root.join(relative);
    std::fs::create_dir_all(path.parent().unwrap()).unwrap();
    std::fs::write(path, contents).unwrap();
}

/// Nanoseconds per operation, from `go test -bench`.
fn bench(go: &Path, root: &Path) -> f64 {
    let output = Command::new(go)
        // Time-based rather than a fixed iteration count, and repeated: a
        // twenty-iteration run varied by 20% between invocations on this
        // machine, which is more than several of the differences being
        // measured. Tuning against that is tuning against noise.
        .args([
            "test",
            "-bench=.",
            "-benchtime=1s",
            "-count=5",
            "-run=NONE",
            "./...",
        ])
        .current_dir(root)
        .output()
        .unwrap();
    let text = String::from_utf8_lossy(&output.stdout);
    assert!(
        output.status.success(),
        "benchmark failed:\n{text}{}",
        String::from_utf8_lossy(&output.stderr)
    );
    // The median of the repeats, so one scheduling hiccup cannot move the
    // answer the way a mean would.
    let mut samples = text
        .lines()
        .filter(|line| line.starts_with("Benchmark"))
        .filter_map(|line| {
            let fields = line.split_whitespace().collect::<Vec<_>>();
            let index = fields.iter().position(|field| *field == "ns/op")?;
            fields.get(index - 1)?.replace(',', "").parse::<f64>().ok()
        })
        .collect::<Vec<_>>();
    assert!(!samples.is_empty(), "no benchmark line in:\n{text}");
    samples.sort_by(f64::total_cmp);
    samples[samples.len() / 2]
}

fn measure(go: &Path, label: &str, source: &str, bench_source: &str) -> (f64, f64, usize) {
    let plain = temporary(&format!("{label}-plain"));
    write(&plain, "go.mod", "module example.com/plain\n\ngo 1.22\n");
    write(&plain, "work.go", source);
    write(&plain, "bench_test.go", bench_source);
    let before = bench(go, &plain);

    let instrumented = temporary(&format!("{label}-instrumented"));
    let runtime =
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../runtime/go/supercov/supercov.go");
    write(
        &instrumented,
        "go.mod",
        "module example.com/probe\n\ngo 1.22\n",
    );
    write(
        &instrumented,
        "supercov/supercov.go",
        &std::fs::read_to_string(runtime).expect("runtime"),
    );
    let mut next = 0;
    let mut decisions = 0;
    let obligations =
        build_go_obligations("work.go", source, &mut next, &mut decisions).expect("obligations");
    let local = "example.com/probe/supercov";
    write(
        &instrumented,
        "work.go",
        &rewrite(source, &obligations.edits).replace(RUNTIME_IMPORT, local),
    );
    write(
        &instrumented,
        "supercov_probes.go",
        &probe_array_file("main", "__supercov", local, obligations.probes.len() + 1),
    );
    write(&instrumented, "bench_test.go", bench_source);
    write(
        &instrumented,
        "supercov_generated_test.go",
        &synthesized_harness(
            "main",
            "__supercov",
            local,
            obligations.probes.len() + 1,
            &obligations.decision_widths,
            "evidence.bin",
            false,
        ),
    );
    let after = bench(go, &instrumented);

    std::fs::remove_dir_all(plain).ok();
    std::fs::remove_dir_all(instrumented).ok();
    (before, after, obligations.probes.len())
}

const TIGHT: &str = r#"package main

func collatz(n int) int {
	steps := 0
	for n != 1 {
		if n%2 == 0 && n > 0 {
			n = n / 2
		} else {
			n = 3*n + 1
		}
		steps++
	}
	return steps
}

func total(limit int) int {
	sum := 0
	for i := 1; i < limit; i++ {
		sum += collatz(i)
	}
	return sum
}
"#;

const TIGHT_BENCH: &str = r#"package main

import "testing"

func BenchmarkTotal(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = total(20000)
	}
}
"#;

const PIPELINE: &str = r#"package main

import (
	"fmt"
	"sort"
	"strings"
)

type Record struct {
	Name  string
	Score int
	Tags  []string
}

func Normalize(raw []string) []Record {
	out := make([]Record, 0, len(raw))
	for _, line := range raw {
		parts := strings.Split(line, ",")
		if len(parts) < 2 || parts[0] == "" {
			continue
		}
		score := 0
		for _, c := range parts[1] {
			if c >= '0' && c <= '9' {
				score = score*10 + int(c-'0')
			}
		}
		tags := []string{}
		if len(parts) > 2 && parts[2] != "" {
			tags = strings.Split(parts[2], "|")
		}
		out = append(out, Record{Name: strings.TrimSpace(parts[0]), Score: score, Tags: tags})
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Score > out[j].Score })
	return out
}

func Summarize(records []Record) string {
	var b strings.Builder
	counts := map[string]int{}
	for _, r := range records {
		for _, t := range r.Tags {
			counts[t]++
		}
	}
	keys := make([]string, 0, len(counts))
	for k := range counts {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Fprintf(&b, "%s=%d;", k, counts[k])
	}
	return b.String()
}
"#;

const PIPELINE_BENCH: &str = r#"package main

import (
	"fmt"
	"testing"
)

func corpus() []string {
	lines := make([]string, 0, 4000)
	for i := 0; i < 4000; i++ {
		lines = append(lines, fmt.Sprintf("name%d, %d, alpha|beta|gamma%d", i, i%997, i%13))
	}
	return lines
}

func BenchmarkPipeline(b *testing.B) {
	raw := corpus()
	for i := 0; i < b.N; i++ {
		_ = Summarize(Normalize(raw))
	}
}
"#;

#[test]
#[ignore = "a measurement, not a pass/fail; run with --ignored"]
fn instrumentation_overhead() {
    let Some(go) = go_binary() else {
        common::skip("go", "no Go toolchain on PATH");
        return;
    };
    println!("\n  workload                       plain      instrumented   overhead  probes");
    for (label, source, bench_source) in [
        ("tight numeric loop", TIGHT, TIGHT_BENCH),
        ("string/map/sort pipeline", PIPELINE, PIPELINE_BENCH),
    ] {
        let (before, after, probes) = measure(&go, label, source, bench_source);
        println!(
            "  {label:<28} {:>9.0}ns {:>13.0}ns {:>9.2}x {:>7}",
            before,
            after,
            after / before,
            probes
        );
    }
    println!();
}
