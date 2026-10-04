#!/usr/bin/env python3
"""Plain-runner tests for the reader-needed lens.

Every case runs against a throwaway git repository and a stub scanner, so no
case reads outside its fixture. The runner prints one PASS or FAIL line per
case and ends with ALL PASS or the failure count.
"""

from __future__ import annotations

import contextlib
import io
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPT_ROOT))
import hvr_reader_lens as S  # noqa: E402

# ───────────────────────────────────────────────────────────────
# FIXTURE HARNESS
# ───────────────────────────────────────────────────────────────


def clean_env() -> dict:
    """Return a copy of the process environment without fixture redirectors.

    A fixture must not inherit the caller's git redirectors; one would retarget
    a command at the real repository, and the worktree carries one routinely.
    """
    env = dict(os.environ)
    for key in (
        "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
        "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
        "GIT_CONFIG", "GIT_CONFIG_GLOBAL", "GIT_CONFIG_SYSTEM", "GIT_CONFIG_COUNT",
        "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
    ):
        env.pop(key, None)
    return env


def temp_dir(prefix: str) -> Path:
    """Create a fresh temp directory whose name marks it as a fixture."""
    return Path(tempfile.mkdtemp(prefix=f"hvrlens-{prefix}-"))


def _write_files(root: Path, files: dict) -> None:
    """Write repo-relative paths to text under one fixture root."""
    for rel_path, text in files.items():
        target = root / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")


def make_repo(files: dict, second: dict | None = None) -> Path:
    """Build a git repository in a temp directory from repo-relative paths to text.

    Args:
        files: Repo-relative path to file text, committed first.
        second: Optional paths committed on top of the first commit, so a case
            can read one path at two different commits.

    Returns:
        The repository root.
    """
    root = temp_dir("repo")
    git_args = [
        "-C", str(root),
        "-c", "user.email=fixture@example.com", "-c", "user.name=fixture",
        "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null",
        "-c", "core.excludesFile=/dev/null", "-c", "core.attributesFile=/dev/null",
    ]

    def run_git(*args: str) -> None:
        subprocess.run(
            ["git", *git_args, *args], check=True, capture_output=True, encoding="utf-8", env=clean_env()
        )

    _write_files(root, files)
    run_git("init", "-q")
    run_git("add", "-A")
    run_git("commit", "-q", "-m", "fixture")
    if second:
        _write_files(root, second)
        run_git("add", "-A")
        run_git("commit", "-q", "-m", "fixture second")
    return root


def run_main(args: list, options: dict | None = None) -> dict:
    """Run the lens against one fixture and collect its output lines and exit code.

    Args:
        args: Command-line arguments for the lens.
        options: Optional ``root`` and ``scanner`` overrides.

    Returns:
        ``{"code": int, "lines": list, "errs": list}``.
    """
    opts = options or {}
    lines: list[str] = []
    errs: list[str] = []
    code = S.main(
        list(args),
        {
            "repo_root": opts.get("root"),
            "scanner": opts.get("scanner"),
            "out": lines.append,
            "err": errs.append,
        },
    )
    return {"code": code, "lines": lines, "errs": errs}


# ───────────────────────────────────────────────────────────────
# CORPUS FIXTURE
# ───────────────────────────────────────────────────────────────

CORPUS_SKILLS = (
    "alpha-skill", "beta-skill", "gamma-skill", "delta-skill", "epsilon-skill", "zeta-skill",
    "eta-skill", "theta-skill", "iota-skill", "kappa-skill", "lambda-skill", "mu-skill",
)
PLAIN_DOCS_PER_SKILL = 5
TELL_DOCS_PER_SKILL = 5
SIGNIFICANCE_TELL = "This marks a pivotal moment in the field."
FALSE_RANGE_TELL = "From startups to enterprises, everyone benefits."


def section_doc(title: str, tell_line: str) -> str:
    """Build one in-band section: a heading, the caller's line and four fillers.

    Six lines sits inside the band every draw and every measurement works in,
    and one section per document keeps the drawn pool a known size.
    """
    body = [f"# {title}", tell_line]
    body.extend(f"Reference line {number} for {title}." for number in range(1, 5))
    return "\n".join(body) + "\n"


def corpus_files() -> dict:
    """Build the shared corpus: twelve skills, each carrying both tells and plain docs.

    Five documents per tell per skill leave the per-skill cap reachable in every
    category, and the plain documents give the fills somewhere to come from.
    """
    files: dict = {}
    for skill in CORPUS_SKILLS:
        for number in range(1, PLAIN_DOCS_PER_SKILL + 1):
            files[f".skilled/skills/{skill}/docs/plain-{number:02d}.md"] = section_doc(
                f"{skill} plain {number}", "The guide states each step once."
            )
        for number in range(1, TELL_DOCS_PER_SKILL + 1):
            files[f".skilled/skills/{skill}/docs/significance-{number:02d}.md"] = section_doc(
                f"{skill} significance {number}", SIGNIFICANCE_TELL
            )
            files[f".skilled/skills/{skill}/docs/false-range-{number:02d}.md"] = section_doc(
                f"{skill} false range {number}", FALSE_RANGE_TELL
            )
    files[".skilled/skills/sk-doc/.env.example"] = "PLACEHOLDER=1\n"
    files[".skilled/skills/sk-doc/changelog/v1.0.0.0.md"] = section_doc(
        "changelog entry", "The release notes live here."
    )
    files[".skilled/skills/sk-doc/tests/fixtures/sample.md"] = section_doc(
        "fixture sample", "A fixture sentence."
    )
    return files


# ───────────────────────────────────────────────────────────────
# SCANNER STUB
# ───────────────────────────────────────────────────────────────

SCAN_STUB = r'''#!/usr/bin/env python3
"""Stub scanner: one hard finding per line holding FINDING, over the targets given."""

import json
import sys
from pathlib import Path

reports = []
for target in [argument for argument in sys.argv[1:] if argument != "--json"]:
    text = Path(target).read_text(encoding="utf-8")
    findings = [
        {
            "line": number,
            "column": 1,
            "severity": "hard",
            "category": "word-blocker",
            "term": "FINDING",
            "text": "",
        }
        for number, line in enumerate(text.splitlines(), start=1)
        if "FINDING" in line
    ]
    reports.append({
        "path": target,
        "findings": findings,
        "hardBlockers": len(findings),
        "mechanicalDeductions": 0,
        "mechanicalCeiling": 100,
    })
print(json.dumps({"rulesSource": "stub", "reports": reports}))
raise SystemExit(1 if any(report["findings"] for report in reports) else 0)
'''


def make_scanner(bin_dir: Path, source: str = SCAN_STUB) -> Path:
    """Write one stub scanner into a fixture directory and return its path."""
    target = Path(bin_dir) / "scanner"
    target.write_text(source, encoding="utf-8")
    target.chmod(0o755)
    return target


# The draw cases walk the flagged frame, so this stub marks every line: it keeps
# no section out of the pool and leaves the cursor on the per-skill cap.
FLAG_ALL_STUB = r'''#!/usr/bin/env python3
"""Stub scanner: one finding per line, so every section is flagged."""

import json
import sys
from pathlib import Path

reports = []
for target in [argument for argument in sys.argv[1:] if argument != "--json"]:
    text = Path(target).read_text(encoding="utf-8")
    findings = [
        {
            "line": number,
            "column": 1,
            "severity": "hard",
            "category": "word-blocker",
            "term": "FINDING",
            "text": "",
        }
        for number, line in enumerate(text.splitlines(), start=1)
    ]
    reports.append({
        "path": target,
        "findings": findings,
        "hardBlockers": len(findings),
        "mechanicalDeductions": 0,
        "mechanicalCeiling": 100,
    })
print(json.dumps({"rulesSource": "stub", "reports": reports}))
raise SystemExit(1)
'''


# ───────────────────────────────────────────────────────────────
# CASES
# ───────────────────────────────────────────────────────────────


def run() -> int:
    failures = []

    def check(name: str, condition: bool) -> None:
        print(("PASS " if condition else "FAIL ") + name)
        if not condition:
            failures.append(name)

    root = make_repo(
        {"a.md": "# A\n", "dir/it's.md": "# B\n"},
        {"dir/it's.md": "# B, revised\n"},
    )
    first = S.git(root, ["rev-parse", "HEAD~1"]).strip()
    head = S.head_commit(root)
    check(
        "tracked files and read at commit",
        S.tracked_files(root) == ["a.md", "dir/it's.md"]
        and len(head) == 40
        and all(character in "0123456789abcdef" for character in head)
        and head != first
        and S.read_at_commit(root, first, "dir/it's.md") == "# B\n"
        and S.read_at_commit(root, head, "dir/it's.md") == "# B, revised\n"
        and S.sha12("abc") == "ba7816bf8f01",
    )

    walk_root = make_repo(
        {
            ".skilled/skills/sk-doc/guide.md": "# Guide\nA body line.\n",
            ".skilled/skills/sk-doc/changelog/v1.0.0.0.md": "# Entry\nA body line.\n",
            ".skilled/skills/sk-doc/tests/fixtures/sample.md": "# Sample\nA body line.\n",
            ".skilled/skills/sk-doc/.env.example": "PLACEHOLDER=1\n",
        }
    )
    kept, refused = S.frame_paths(S.tracked_files(walk_root))
    check(
        "frame walker keeps skill markdown and refuses .env and changelog",
        kept == [".skilled/skills/sk-doc/guide.md"] and refused == 1,
    )

    heading_doc = "Preamble.\n# A\n" + "a\n" * 3 + "# B\n" + "b\n" * 5
    heading_sections = S.split_sections(heading_doc)
    check(
        "split sections at ATX headings",
        heading_sections == [{"start": 1, "end": 1}, {"start": 2, "end": 5}, {"start": 6, "end": 11}]
        and [S.in_band(section) for section in heading_sections] == [False, False, True]
        and S.section_text(heading_doc.splitlines(), 2, 5) == "# A\na\na\na",
    )

    fence_doc = "intro\n# A\n```\n# not a heading\n```\n~~~\n## still code\n~~~\n# B\nend\n"
    fence_sections = S.split_sections(fence_doc)
    check(
        "a heading inside a fence does not split",
        fence_sections == [{"start": 1, "end": 1}, {"start": 2, "end": 8}, {"start": 9, "end": 10}]
        and S.section_text(fence_doc.splitlines(), 9, 10) == "# B\nend",
    )

    scan_root = make_repo(
        {
            ".skilled/skills/alpha-skill/doc.md": (
                "# Short\nFINDING one\none\ntwo\n"
                "# Band\nFrom startups to enterprises, everyone benefits.\n"
                "This marks a pivotal moment in the field.\nFINDING two\nthree\nfour\n"
                "# Long\nFINDING three\n"
                + "".join(f"line {number}\n" for number in range(1, 89))
            )
        }
    )
    scan_bin = temp_dir("scan")
    scanner = make_scanner(scan_bin)
    census = S.build_census(
        scan_root, S.head_commit(scan_root), S.tracked_files(scan_root), scanner
    )
    census_text = S.census_lines(census)
    check(
        "census counts files, sections, flagged and in-band",
        census["files"] == 1
        and census["sections"] == 3
        and census["flagged"] == 3
        and census["inBand"] == 1
        and census["refused"] == 0
        and census["candidates"] == {
            "synonym-cycling": 0,
            "significance-inflation": 1,
            "false-ranges": 1,
        }
        and census_text[0] == "census: commit={0} files=1 sections=3 flagged=3 "
        "in_band_5_80=1 refused=0".format(census["commit"])
        and census_text[1:4] == [
            "census: category=synonym-cycling candidates=0",
            "census: category=significance-inflation candidates=1",
            "census: category=false-ranges candidates=1",
        ],
    )

    doc_path = scan_root / ".skilled/skills/alpha-skill/doc.md"
    doc_path.write_text(
        doc_path.read_text(encoding="utf-8").replace("FINDING", "plain"), encoding="utf-8"
    )
    dirty_census = S.build_census(
        scan_root, S.head_commit(scan_root), S.tracked_files(scan_root), scanner
    )
    check(
        "census reads committed text, not uncommitted edits",
        S.census_lines(dirty_census) == census_text,
    )

    staged_doc = ".skilled/skills/alpha-skill/staged.md"
    _write_files(scan_root, {staged_doc: "# Staged\nFINDING body\n"})
    S.git(scan_root, ["add", staged_doc])
    check(
        "census leaves out a staged, uncommitted doc",
        staged_doc not in S.tracked_files(scan_root)
        and S.census_lines(
            S.build_census(
                scan_root, S.head_commit(scan_root), S.tracked_files(scan_root), scanner
            )
        )
        == census_text,
    )

    skip_root = make_repo(
        {".skilled/skills/alpha-skill/guide.md": "# Guide\nFINDING body\nline\nline\nline\n"}
    )
    os.environ["SKDOC_SKIP_VALIDATION"] = "1"
    try:
        skipped = run_main([], {"root": skip_root})
    finally:
        os.environ.pop("SKDOC_SKIP_VALIDATION", None)
    check(
        "a skipped scanner stops the run",
        skipped["code"] == 0
        and skipped["lines"] == [S.SCANNER_SKIPPED_LINE]
        and not any(line.startswith("census:") for line in skipped["lines"]),
    )

    fail_bin = temp_dir("scan")
    failing = make_scanner(fail_bin, "import sys\n\nraise SystemExit(2)\n")
    failed = run_main([], {"root": skip_root, "scanner": failing})
    check(
        "a scanner exit 2 stops the run",
        failed["code"] == 2
        and not any(line.startswith("census:") for line in failed["lines"]),
    )

    phrases = S.parse_significance_phrases(
        S.DEFAULT_RULES_PATH.read_text(encoding="utf-8")
    )
    check(
        "significance comparator flags a listed phrase",
        len(phrases) == 8
        and S.significance_hit("This marks a pivotal moment in the field.", phrases)
        and not S.significance_hit("The guide states each step once.", phrases),
    )

    # The pattern reads the shape, not the scale, so a measurable range is
    # flagged too; the over-flag is why its rows are worth labeling.
    check(
        "false-range comparator flags a construction and a genuine range",
        S.false_range_hit("From startups to enterprises, everyone benefits.")
        and S.false_range_hit("Temperatures range from -10C to 40C."),
    )

    thin_rules = (
        "### Significance Inflation\n\n"
        "Banned phrases:\n"
        '- "marks a pivotal moment in"\n'
    )
    try:
        # The refusal message is expected; keep it out of the runner's output.
        with contextlib.redirect_stderr(io.StringIO()):
            S.parse_significance_phrases(thin_rules)
        thin_code = None
    except SystemExit as stop:
        thin_code = stop.code
    check(
        "a thin standard stops the comparator parse",
        thin_code == 2,
    )

    draw_bin = temp_dir("draw-bin")
    draw_scanner = make_scanner(draw_bin, FLAG_ALL_STUB)
    draw_root = make_repo(corpus_files())
    draw_a = temp_dir("draw-a")
    draw_b = temp_dir("draw-b")
    labels_a = draw_a / "labels.jsonl"
    labels_b = draw_b / "labels.jsonl"
    first_draw = run_main(
        ["--draw", "--seed", "7", "--labels", str(labels_a)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    seed7_bytes = labels_a.read_bytes()
    drawn_rows = S.read_jsonl(labels_a)
    second_draw = run_main(
        ["--draw", "--seed", "7", "--labels", str(labels_b)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    same_seed_bytes = seed7_bytes == labels_b.read_bytes()
    same_seed_again = run_main(
        ["--draw", "--seed", "7", "--labels", str(labels_a)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    stable_bytes = labels_a.read_bytes() == seed7_bytes
    different_seed = run_main(
        ["--draw", "--seed", "8", "--labels", str(labels_b)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    other_seed_bytes = labels_b.read_bytes() != seed7_bytes
    draw_keys = [
        "id", "category", "doc", "section_start", "section_end",
        "commit", "section_sha12", "candidate", "label", "labeler",
    ]
    per_category = {
        category: [row for row in drawn_rows if row["category"] == category]
        for category in S.CATEGORIES
    }
    check(
        "draw is reproducible and carries no text",
        first_draw["code"] == 0
        and second_draw["code"] == 0
        and same_seed_again["code"] == 0
        and different_seed["code"] == 0
        and first_draw["lines"] == [
            f"draw: seed=7 commit={S.head_commit(draw_root)} rows=150",
            "draw: category=synonym-cycling rows=50 candidate_rows=0",
            "draw: category=significance-inflation rows=50 candidate_rows=25",
            "draw: category=false-ranges rows=50 candidate_rows=25",
            f"draw: wrote {labels_a}",
        ]
        and len(drawn_rows) == 150
        and [len(per_category[category]) for category in S.CATEGORIES] == [50, 50, 50]
        and all(list(row.keys()) == draw_keys for row in drawn_rows)
        and all(row["label"] is None and row["labeler"] is None for row in drawn_rows)
        and all(len(row["section_sha12"]) == 12 for row in drawn_rows)
        and same_seed_bytes
        and stable_bytes
        and other_seed_bytes,
    )

    cap_counts = {}
    for row in drawn_rows:
        counts = cap_counts.setdefault(row["category"], {})
        skill = S.skill_of(row["doc"])
        counts[skill] = counts.get(skill, 0) + 1
    check(
        "draw caps rows per skill per category",
        len(cap_counts) == len(S.CATEGORIES)
        and all(
            count <= S.MAX_ROWS_PER_SKILL
            for counts in cap_counts.values()
            for count in counts.values()
        )
        and max(cap_counts["synonym-cycling"].values()) == S.MAX_ROWS_PER_SKILL,
    )

    refuse_dir = temp_dir("draw-refuse")
    refuse_labels = refuse_dir / "labels.jsonl"
    run_main(
        ["--draw", "--seed", "7", "--labels", str(refuse_labels)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    refuse_rows = S.read_jsonl(refuse_labels)
    refuse_rows[0]["label"] = "yes"
    S.write_jsonl(refuse_labels, refuse_rows)
    refuse_before = refuse_labels.read_bytes()
    refused = run_main(
        ["--draw", "--seed", "8", "--labels", str(refuse_labels)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    check(
        "draw refuses to overwrite a labeled file",
        refused["code"] == 2
        and any("draw refused" in line for line in refused["errs"])
        and refuse_labels.read_bytes() == refuse_before,
    )

    seed_dir = temp_dir("draw-seed")
    seed_labels = seed_dir / "labels.jsonl"
    bad_seed_runs = [
        run_main(
            ["--draw", "--labels", str(seed_labels)],
            {"root": draw_root, "scanner": draw_scanner},
        ),
        run_main(
            ["--draw", "--seed", "x", "--labels", str(seed_labels)],
            {"root": draw_root, "scanner": draw_scanner},
        ),

    ]
    check(
        "--draw needs a valid non-negative seed",
        all(result["code"] == 2 for result in bad_seed_runs) and not seed_labels.exists(),
    )

    def synthetic_rows(category: str, labels: list, candidates: list) -> list:
        """Build in-memory rows in the shape ``build_rows`` returns."""
        return [
            {
                "id": f"{category}-{number:02d}",
                "category": category,
                "label": label,
                "candidate": candidate,
            }
            for number, (label, candidate) in enumerate(zip(labels, candidates), start=1)
        ]

    labeled_149 = [{"id": f"r{n:03d}", "label": "yes"} for n in range(1, 150)]
    gate_149 = S.label_gate(labeled_149)
    gate_150 = S.label_gate(labeled_149 + [{"id": "r150", "label": "no"}])
    gate_missing = S.label_gate(None)
    check(
        "label gate stops at 149 labeled rows",
        gate_149 == {"complete": False, "labeled": 149, "total": 150}
        and S.gate_lines(gate_149) == [
            "labels: labeled=149 of 150",
            "stop: fewer than 150 labeled rows",
        ]
        and gate_150 == {"complete": True, "labeled": 150, "total": 150}
        and gate_missing == {"complete": False, "labeled": 0, "total": 150},
    )

    baseline_rows = (
        synthetic_rows("synonym-cycling", ["yes", "yes", "no", "no"], [False] * 4)
        + synthetic_rows(
            "significance-inflation",
            ["yes", "yes", "no", "no"],
            [True, True, False, False],
        )
        + synthetic_rows(
            "false-ranges", ["yes", "no", "no", "no"], [True, True, True, False]
        )
    )
    baseline = S.summarize_baseline(baseline_rows)
    check(
        "baseline picks the comparator only when it beats flag-nothing",
        S.baseline_lines(baseline) == [
            "baseline (synonym-cycling): flag-nothing right=2 of 4 comparator "
            "right=2 of 4 chosen=flag-nothing B=2 yes_share=2 of 4",
            "baseline (significance-inflation): flag-nothing right=2 of 4 comparator "
            "right=4 of 4 chosen=comparator B=4 yes_share=2 of 4",
            "baseline (false-ranges): flag-nothing right=3 of 4 comparator "
            "right=2 of 4 chosen=flag-nothing B=3 yes_share=1 of 4",
        ]
        and baseline["categories"]["significance-inflation"]["flags"] == {
            "significance-inflation-01": True,
            "significance-inflation-02": True,
            "significance-inflation-03": False,
            "significance-inflation-04": False,
        }
        and baseline["categories"]["synonym-cycling"]["flags"] == {
            "synonym-cycling-01": False,
            "synonym-cycling-02": False,
            "synonym-cycling-03": False,
            "synonym-cycling-04": False,
        },
    )

    headroom_rows = (
        synthetic_rows("synonym-cycling", ["yes"] * 9 + ["no"] * 91, [False] * 100)
        + synthetic_rows(
            "significance-inflation", ["yes"] * 4 + ["no"] * 6, [False] * 10
        )
        + synthetic_rows("false-ranges", ["yes"] * 50 + ["no"] * 50, [False] * 100)
    )
    headroom = S.summarize_baseline(headroom_rows)
    check(
        "headroom, power and the categories stop",
        S.headroom_lines(headroom) == [
            "no headroom (synonym-cycling)",
            "underpowered (significance-inflation)",
            "headroom (false-ranges): baseline wrong on 50 of 100",
        ]
        and S.stop_categories(headroom) is True
        and S.STOP_CATEGORIES_LINE == "stop: fewer than 2 categories can pass",
    )

    refuse_root = make_repo(
        {
            ".skilled/skills/alpha-skill/guide.md": (
                "# Guide\nBody line one.\nBody line two.\nBody line three.\n"
            ),
        }
    )
    refuse_tracked = S.tracked_files(refuse_root)
    refuse_rows = [
        {
            "id": "r001",
            "category": "synonym-cycling",
            "doc": ".skilled/skills/alpha-skill/missing.md",
            "section_start": 1,
            "section_end": 1,
            "commit": S.head_commit(refuse_root),
            "section_sha12": "000000000000",
            "label": None,
        },
        {
            "id": "r002",
            "category": "significance-inflation",
            "doc": ".skilled/skills/alpha-skill/.env",
            "section_start": 1,
            "section_end": 1,
            "commit": S.head_commit(refuse_root),
            "section_sha12": "000000000000",
            "label": None,
        },
    ]
    direct_refusals = 0
    for row in refuse_rows:
        try:
            # A read would raise RuntimeError from git, so reaching this count
            # through ValueError alone is what "never read" means here.
            S.read_section(refuse_root, row, refuse_tracked)
        except ValueError:
            direct_refusals += 1
    built_refusals = S.build_rows(refuse_root, refuse_rows, phrases)
    check(
        "an untracked or .env row is refused",
        direct_refusals == 2
        and sum(1 for row in built_refusals if row["refused"]) == 2
        and all(row["text"] is None for row in built_refusals),
    )


    idle_dir = temp_dir("idle")
    idle_labels = idle_dir / "labels.jsonl"
    idle_run = run_main(
        ["--labels", str(idle_labels)],
        {"root": draw_root, "scanner": draw_scanner},
    )
    check(
        "default run writes no file and stops at the label gate",
        idle_run["code"] == 0
        and not (idle_dir / "report.json").exists()
        and not idle_labels.exists()
        and S.GATE_STOP_LINE in idle_run["lines"],
    )

    print(f"\n{'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(run())
