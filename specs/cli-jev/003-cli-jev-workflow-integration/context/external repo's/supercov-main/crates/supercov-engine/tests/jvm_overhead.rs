//! What JVM instrumentation costs, measured rather than asserted.
//!
//! Ignored by default because it is a measurement, not a pass/fail: timings
//! move with the machine, and a threshold that fails on a busy laptop teaches
//! people to rerun suites until they go green. Run it deliberately:
//!
//!     cargo test -p supercov-engine --test jvm_overhead -- --ignored --nocapture
//!
//! The JVM needs warming before it means anything. A cold run measures the
//! interpreter and the JIT deciding what to compile, not the code — so each
//! variant runs a warmup pass whose timing is discarded, and the reported
//! figure is the median of seven measured passes.

use std::path::{Path, PathBuf};
use std::process::Command;

use supercov_engine::jvm_instrumenter::{JvmLanguage, build_jvm_obligations, rewrite};

mod common;

fn temporary(label: &str) -> PathBuf {
    let root = std::env::temp_dir().join(format!(
        "supercov-jvm-overhead-{label}-{}-{}",
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

const TIGHT: &str = r#"public class Work {
    public static int collatz(int n) {
        int steps = 0;
        while (n != 1) {
            if (n % 2 == 0 && n > 0) {
                n = n / 2;
            } else {
                n = 3 * n + 1;
            }
            steps++;
        }
        return steps;
    }

    public static int total(int limit) {
        int sum = 0;
        for (int i = 1; i < limit; i++) {
            sum += collatz(i);
        }
        return sum;
    }
}
"#;

const PIPELINE: &str = r#"import java.util.*;

public class Work {
    public static List<String> normalize(List<String> raw) {
        List<String> out = new ArrayList<>();
        for (String line : raw) {
            String[] parts = line.split(",");
            if (parts.length < 2 || parts[0].isEmpty()) {
                continue;
            }
            int score = 0;
            for (char c : parts[1].toCharArray()) {
                if (c >= '0' && c <= '9') {
                    score = score * 10 + (c - '0');
                }
            }
            out.add(parts[0].trim() + "=" + score);
        }
        Collections.sort(out);
        return out;
    }

    public static int total(int rounds) {
        List<String> raw = new ArrayList<>();
        for (int i = 0; i < 4000; i++) {
            raw.add("name" + i + ", " + (i % 997) + ", tag" + (i % 13));
        }
        int seen = 0;
        for (int i = 0; i < rounds; i++) {
            seen += normalize(raw).size();
        }
        return seen;
    }
}
"#;

/// The harness is the same for both variants; only `Work` differs.
///
/// Three warmup passes are thrown away before any timing: the first pass of a
/// JVM workload runs interpreted while C2 decides what is worth compiling, and
/// timing that measures the compiler. `sink` consumes the result so nothing
/// here is dead code the optimiser can delete outright.
fn harness(arm: &str) -> String {
    format!(
        r#"public class Bench {{
    static int sink;

    public static void main(String[] args) throws Exception {{
        int rounds = Integer.parseInt(args[0]);
        {arm}
        for (int pass = 0; pass < 3; pass++) {{
            sink += Work.total(rounds);
        }}
        long[] passes = new long[7];
        for (int pass = 0; pass < passes.length; pass++) {{
            long started = System.nanoTime();
            sink += Work.total(rounds);
            passes[pass] = System.nanoTime() - started;
        }}
        java.util.Arrays.sort(passes);
        System.out.println(passes[passes.length / 2]);
        if (sink == Integer.MIN_VALUE) {{
            System.out.println("unreachable");
        }}
    }}
}}
"#
    )
}

fn nanos(java: &Path, root: &Path, rounds: &str) -> u64 {
    let output = Command::new(java)
        .args(["-cp", ".", "Bench", rounds])
        .current_dir(root)
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "benchmark failed:\n{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8_lossy(&output.stdout)
        .trim()
        .parse()
        .expect("a nanosecond count")
}

fn measure(
    javac: &Path,
    java: &Path,
    label: &str,
    source: &str,
    rounds: &str,
) -> (u64, u64, usize) {
    let plain = temporary(&format!("{label}-plain"));
    write(&plain, "Work.java", source);
    write(&plain, "Bench.java", &harness(""));
    let compile = Command::new(javac)
        .args(["-d", ".", "Work.java", "Bench.java"])
        .current_dir(&plain)
        .output()
        .unwrap();
    assert!(
        compile.status.success(),
        "{}",
        String::from_utf8_lossy(&compile.stderr)
    );
    let before = nanos(java, &plain, rounds);

    let instrumented = temporary(&format!("{label}-instrumented"));
    let runtime = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../runtime/jvm/com/supercorp/supercov/Supercov.java");
    write(
        &instrumented,
        "com/supercorp/supercov/Supercov.java",
        &std::fs::read_to_string(runtime).expect("runtime"),
    );
    let mut next = 0;
    let mut decisions = 0;
    let obligations = build_jvm_obligations(
        "Work.java",
        source,
        JvmLanguage::Java,
        &mut next,
        &mut decisions,
    )
    .expect("obligations");
    write(
        &instrumented,
        "Work.java",
        &rewrite(source, &obligations.edits),
    );
    let widths = obligations
        .decision_widths
        .iter()
        .map(u8::to_string)
        .collect::<Vec<_>>()
        .join(", ");
    write(
        &instrumented,
        "Bench.java",
        &harness(&format!(
            "com.supercorp.supercov.Supercov.arm({}, new int[] {{{widths}}});",
            obligations.probes.len() + 1
        )),
    );
    let compile = Command::new(javac)
        .args([
            "-d",
            ".",
            "com/supercorp/supercov/Supercov.java",
            "Work.java",
            "Bench.java",
        ])
        .current_dir(&instrumented)
        .output()
        .unwrap();
    assert!(
        compile.status.success(),
        "{}",
        String::from_utf8_lossy(&compile.stderr)
    );
    let after = nanos(java, &instrumented, rounds);

    std::fs::remove_dir_all(plain).ok();
    std::fs::remove_dir_all(instrumented).ok();
    (before, after, obligations.probes.len())
}

#[test]
#[ignore = "a measurement, not a pass/fail; run with --ignored"]
fn instrumentation_overhead() {
    let (Some(javac), Some(java)) = (common::tool("javac"), common::tool("java")) else {
        common::skip("jvm", "no JDK found");
        return;
    };
    println!("\n  workload                       plain     instrumented   overhead  probes");
    for (label, source, rounds) in [
        ("tight numeric loop", TIGHT, "1000000"),
        ("string/sort pipeline", PIPELINE, "500"),
    ] {
        let (before, after, probes) = measure(&javac, &java, label, source, rounds);
        println!(
            "  {label:<28} {:>8.1}ms {:>12.1}ms {:>9.2}x {:>7}",
            before as f64 / 1e6,
            after as f64 / 1e6,
            after as f64 / before as f64,
            probes
        );
    }
    println!();
}
