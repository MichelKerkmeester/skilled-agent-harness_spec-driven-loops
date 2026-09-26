#!/usr/bin/env node
// Check Supercov's Rust numbers against an independent oracle.
//
// A test count that matches plain `cargo test` proves Supercov did not break a
// suite; it says nothing about whether the coverage is true. For each crate
// this runs the same tests three ways -- plain, under the LLVM line-coverage
// oracle (`cargo llvm-cov`), and under Supercov -- and compares line coverage
// file by file. It found five denominator defects in one pass (0.0.42): a
// module behind an off `#[cfg]` counted as uncovered, a module declared inside
// a macro never measured, a proc-macro crate reading 0%, `const fn` bodies
// counted, and two shapes that failed to build.
//
//   node scripts/rust-coverage-oracle.mjs                # every crate
//   node scripts/rust-coverage-oracle.mjs --only memchr,tokio
//   node scripts/rust-coverage-oracle.mjs --work /path   # where clones live
//   node scripts/rust-coverage-oracle.mjs --keep-targets # skip the cleanup
//
// Needs `cargo llvm-cov` on PATH (`cargo binstall cargo-llvm-cov` and
// `rustup component add llvm-tools-preview`) and a built Supercov. Uses
// `target/release/supercov` when present, since instrumentation cost with a
// debug build is not what a user sees; `--binary` overrides. Costs no Actions
// minutes: it is meant to run locally before a release.
//
// The exit code answers one question: did Supercov run every suite the way
// plain Cargo did? A different exit code, a different test count or a failed
// instrumented build is a defect and exits 1. The per-file comparison is for
// a person to read. The two tools count differently -- the oracle counts every
// executable region after monomorphisation, Supercov counts the lines its own
// obligations sit on -- so a few points of difference is expected, and some
// categories below have known benign causes.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { relative, resolve } from "node:path";

import { repository } from "./coverage-test-helpers.mjs";

// `syn` fails plain `cargo test --tests` on stable independently of Supercov.
// tokio's `test_tuning` spins until its scheduler converges, which it cannot
// do while the runner has many test processes in flight.
const CRATES = [
  ["semver", "dtolnay/semver"],
  ["anyhow", "dtolnay/anyhow"],
  ["smallvec", "servo/rust-smallvec"],
  ["memchr", "BurntSushi/memchr"],
  ["bytes", "tokio-rs/bytes"],
  ["itertools", "rust-itertools/itertools"],
  ["serde_json", "serde-rs/json"],
  ["ryu", "dtolnay/ryu"],
  ["once_cell", "matklad/once_cell"],
  ["bitflags", "bitflags/bitflags"],
  ["indexmap", "indexmap-rs/indexmap"],
  ["hashbrown", "rust-lang/hashbrown"],
  ["regex", "rust-lang/regex"],
  ["regex-syntax", "rust-lang/regex", "-p", "regex-syntax"],
  ["crossbeam", "crossbeam-rs/crossbeam"],
  ["async-channel", "smol-rs/async-channel"],
  ["thiserror", "dtolnay/thiserror"],
  ["async-trait", "dtolnay/async-trait"],
  ["heapless", "rust-embedded/heapless"],
  ["serde", "serde-rs/serde", "-p", "serde", "-p", "serde_derive"],
  ["tracing", "tokio-rs/tracing", "-p", "tracing"],
  ["rayon", "rayon-rs/rayon", "-p", "rayon"],
  ["clap", "clap-rs/clap", "-p", "clap"],
  ["hyper", "hyperium/hyper", "--features", "full"],
  ["typenum", "paholg/typenum"],
  ["tokio", "tokio-rs/tokio", "-p", "tokio", "--features", "full", "--", "--skip", "test_tuning"],
];

const argv = process.argv.slice(2);
const option = (name) => {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
};
const only = option("--only")?.split(",").filter(Boolean);
const work = resolve(option("--work") ?? resolve(tmpdir(), "supercov-rust-oracle"));
const keepTargets = argv.includes("--keep-targets");
const releaseBinary = resolve(repository, "target/release/supercov");
const debugBinary = resolve(repository, "target/debug/supercov");
const binary = resolve(
  option("--binary") ?? (existsSync(releaseBinary) ? releaseBinary : debugBinary),
);
if (!existsSync(binary)) {
  console.error(`no Supercov binary at ${binary}; build one first (cargo build --release -p supercov)`);
  process.exit(2);
}
if (spawnSync("cargo", ["llvm-cov", "--version"], { encoding: "utf8" }).status !== 0) {
  console.error("cargo llvm-cov is not available: cargo binstall cargo-llvm-cov && rustup component add llvm-tools-preview");
  process.exit(2);
}
mkdirSync(work, { recursive: true });

function run(command, args, cwd, extraEnv = {}) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1 << 28,
    env: { ...process.env, ...extraEnv },
  });
  return {
    status: result.status ?? -1,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
    seconds: Math.round((Date.now() - started) / 1000),
  };
}

// libtest prints one `test result:` line per artifact; the counts add up.
function libtestTotals(output) {
  let passed = 0;
  let total = 0;
  for (const match of output.matchAll(/^test result: \w+\. (\d+) passed; (\d+) failed; (\d+) ignored/gm)) {
    passed += Number(match[1]);
    total += Number(match[1]) + Number(match[2]) + Number(match[3]);
  }
  return { passed, total };
}

function query(dir, args) {
  const out = execFileSync(binary, ["runs", "latest", ...args, "--json"], {
    cwd: dir,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  });
  return JSON.parse(out);
}

const harness = (file) => /^(?:[^/]+\/)?(tests|benches|examples)\//.test(file);

function compare(dir) {
  const llvm = JSON.parse(readFileSync(resolve(dir, "llvm.json"), "utf8"));
  // The oracle names files by their real path; on macOS a temporary
  // directory is reached through `/var`, which is a link to `/private/var`.
  const root = realpathSync(dir);
  const oracle = new Map();
  for (const file of llvm.data[0].files) {
    const path = relative(root, existsSync(file.filename) ? realpathSync(file.filename) : file.filename);
    if (path.startsWith("..")) continue; // a dependency from the registry
    oracle.set(path, { count: file.summary.lines.count, covered: file.summary.lines.covered });
  }
  // The query refuses a response over 64 KB; page through the files.
  const entries = [];
  for (let offset = 0; ; offset += 100) {
    const page = query(dir, ["files", "--limit", "100", "--offset", String(offset)]);
    entries.push(...page.data.files);
    if (page.data.files.length < 100) break;
  }
  const rows = [];
  for (const entry of entries) {
    if (!entry.file.endsWith(".rs")) continue;
    const counts = query(dir, ["file", entry.file]).data.counts;
    rows.push({
      file: entry.file,
      supercov: { count: counts.totalLines, covered: counts.coveredLines },
      llvm: oracle.get(entry.file) ?? null,
    });
  }
  for (const [file, counts] of oracle) {
    if (!rows.some((row) => row.file === file)) rows.push({ file, supercov: null, llvm: counts });
  }
  const pct = (c) => (c && c.count ? (100 * c.covered) / c.count : c ? 0 : null);
  const flagged = [];
  for (const row of rows) {
    row.supercovPct = pct(row.supercov);
    row.llvmPct = pct(row.llvm);
    if (row.supercov && row.supercov.count === 0) {
      // Every obligation declined: a module the build never compiled, a
      // proc-macro crate, a const fn. Nothing here can disagree.
      continue;
    }
    if (row.supercov && !row.llvm) {
      // The oracle never reports test harness files and drops some files it
      // compiled, so its silence alone proves nothing. A file Supercov saw
      // run was plainly compiled. The one to read is a file Supercov counts
      // with nothing covered and no oracle entry: either a module behind a
      // `#[cfg]` the build should have declined, or code the tests really
      // never reach, which the oracle omits and Supercov is right to show.
      if (harness(row.file)) continue;
      row.flag = row.supercov.covered > 0 ? "absent-from-oracle" : "unexercised-or-uncoverable";
    } else if (!row.supercov && row.llvm) {
      // The oracle measured it and Supercov does not list it. A file that is
      // only `macro_rules!` definitions has no pre-expansion obligations, and
      // the oracle attributes expansions back to it; anything else is a
      // discovery gap.
      row.flag = "missing-in-supercov";
    } else if ((row.supercovPct === 0) !== (row.llvmPct === 0)) {
      row.flag = "zero-vs-nonzero";
    } else if (Math.abs(row.supercovPct - row.llvmPct) >= 15) {
      row.flag = "delta>=15";
    }
    if (row.flag) flagged.push(row);
  }
  const deltas = rows
    .filter((row) => row.supercov && row.supercov.count > 0 && row.llvm)
    .map((row) => Math.abs(row.supercovPct - row.llvmPct));
  const mean = deltas.length ? deltas.reduce((x, y) => x + y, 0) / deltas.length : null;
  const max = deltas.length ? Math.max(...deltas) : null;
  return { rows, flagged, compared: deltas.length, mean, max };
}

const results = [];
let defects = 0;
for (const [name, repo, ...args] of CRATES) {
  if (only && !only.includes(name)) continue;
  const dir = resolve(work, name);
  if (!existsSync(resolve(dir, "Cargo.toml"))) {
    rmSync(dir, { recursive: true, force: true });
    const clone = spawnSync("git", ["clone", "--quiet", "--depth", "1", `https://github.com/${repo}`, dir], { encoding: "utf8" });
    if (clone.status !== 0) {
      console.log(`${name}: clone failed`);
      defects += 1;
      continue;
    }
  }
  rmSync(resolve(dir, ".supercov"), { recursive: true, force: true });
  const testArgs = ["--tests", "--no-fail-fast", ...args];
  const plain = run("cargo", ["test", ...testArgs], dir);
  const oracle = run("cargo", ["llvm-cov", "--json", "--output-path", "llvm.json", ...testArgs], dir);
  const supercov = run(binary, ["--", "cargo", "test", ...testArgs], dir, { SUPERCOV_PHASE_TIMING: "1" });
  const totals = libtestTotals(plain.output);
  const measured = Number(supercov.output.match(/Rust coverage: (\d+) test\(s\)/)?.[1] ?? -1);
  const problem = supercov.output.match(/^\[supercov\] (could not|invalid Rust|Cargo test build failed|Rust runtime emitted|Cargo reported)[^\n]*/m)?.[0];
  const timings = supercov.output.match(/timings initialization=[^\n]*/)?.[0] ?? "";
  const defect = plain.status !== supercov.status || totals.total !== measured || Boolean(problem);
  if (defect) defects += 1;
  console.log(
    `${name}: plain exit=${plain.status} [${totals.passed}/${totals.total}] ${plain.seconds}s | oracle exit=${oracle.status} ${oracle.seconds}s | supercov exit=${supercov.status} [${measured} tests] ${supercov.seconds}s${defect ? "  <-- DEFECT" : ""}${problem ? `\n  ${problem.slice(0, 180)}` : ""}`,
  );
  if (timings) console.log(`  ${timings}`);
  let comparison = null;
  if (supercov.status === 0 && oracle.status === 0) {
    comparison = compare(dir);
    const fmt = (v) => (v === null ? "n/a" : v.toFixed(1));
    console.log(`  ORACLE ${comparison.compared} files compared, ${comparison.flagged.length} flagged, mean |delta| ${fmt(comparison.mean)} pts, max ${fmt(comparison.max)} pts`);
    for (const row of comparison.flagged) {
      const show = (c, p) => (c ? `${c.covered}/${c.count} (${p.toFixed(1)}%)` : "absent");
      console.log(`    ${row.flag.padEnd(27)} ${row.file}  supercov ${show(row.supercov, row.supercovPct ?? 0)}  oracle ${show(row.llvm, row.llvmPct ?? 0)}`);
    }
  }
  results.push({ name, plain, oracle: { status: oracle.status, seconds: oracle.seconds }, supercov: { status: supercov.status, seconds: supercov.seconds, measured, problem, timings }, totals, comparison });
  if (!keepTargets) {
    rmSync(resolve(dir, "target"), { recursive: true, force: true });
    rmSync(resolve(dir, ".supercov/cache/rust-target"), { recursive: true, force: true });
  }
}
writeFileSync(resolve(work, "oracle-results.json"), JSON.stringify(results, null, 1));
console.log(`\n${results.length} crate(s), ${defects} defect(s); details in ${resolve(work, "oracle-results.json")}`);
process.exit(defects === 0 ? 0 : 1);
