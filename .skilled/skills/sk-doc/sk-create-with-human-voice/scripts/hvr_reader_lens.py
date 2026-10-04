#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: HVR READER-NEEDED LENS — samples the tells a machine cannot settle
# ───────────────────────────────────────────────────────────────

"""Measure the reader-needed Human Voice Rules tells over committed skill docs.

The scanner settles what a machine can settle. Synonym cycling, false ranges,
significance inflation and the rest need a reader, and no count of them can come
from the text alone. This lens draws a fixed sample of tracked skill sections,
prints the census the sample rests on, and reports its no-call comparators
against the operator's labels.

Usage:
  python3 hvr_reader_lens.py                     # census, questions, baselines
  python3 hvr_reader_lens.py --draw --seed <n>   # write the labels file
  python3 hvr_reader_lens.py --labels <path>     # point at another labels file

The default run makes no model call, writes no file and holds no credential.

Exit status: 0 when the run printed its lines, 2 on a bad invocation, an
unreadable input or a thin parse.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import re
import subprocess
import sys
import tempfile
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 1. REPOSITORY READS
# ───────────────────────────────────────────────────────────────

# git reads its target repository from these variables IN PREFERENCE to `-C`,
# and a worktree shares one `.git/config`, so an inherited GIT_DIR would point
# every read at the real repository. Dropping them leaves `-C` the only selector.
GIT_ENV_REDIRECTORS = (
    "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_CONFIG", "GIT_CONFIG_GLOBAL", "GIT_CONFIG_SYSTEM", "GIT_CONFIG_COUNT",
    "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
)


def git(repo_root: str | Path, args: list[str]) -> str:
    """Run git in a repository and return its standard output verbatim.

    Args:
        repo_root: Path of the repository the command runs in.
        args: Git arguments after ``-C <repo_root>``.

    Returns:
        Standard output, unchanged.

    Raises:
        RuntimeError: When git exits non-zero; the message carries stderr.
    """
    env = dict(os.environ)
    for key in GIT_ENV_REDIRECTORS:
        env.pop(key, None)
    result = subprocess.run(
        ["git", "-C", str(repo_root), *args],
        check=False,
        capture_output=True,
        encoding="utf-8",
        env=env,
    )
    if result.returncode != 0:
        raise RuntimeError(f"git {args[0]} failed: {result.stderr.strip()}")
    return result.stdout


def tracked_files(repo_root: str | Path) -> list[str]:
    """List the paths in HEAD's tree in git order.

    Every read is at a commit, so a path only the index holds is left out, and
    a path staged for deletion stays in.

    Args:
        repo_root: Path of the repository.

    Returns:
        Repo-relative paths, without the NUL separators git writes them with.
    """
    return [
        path
        for path in git(repo_root, ["ls-tree", "-r", "-z", "--name-only", "HEAD"]).split("\0")
        if path
    ]


def head_commit(repo_root: str | Path) -> str:
    """Resolve the repository's HEAD commit.

    Args:
        repo_root: Path of the repository.

    Returns:
        The full commit hash.
    """
    return git(repo_root, ["rev-parse", "HEAD"]).strip()


def read_at_commit(repo_root: str | Path, commit: str, rel_path: str) -> str:
    """Read one file as of one commit.

    Reading through git rather than the working tree keeps the measurement on
    the committed text a sample was drawn from, even while later edits land.

    Args:
        repo_root: Path of the repository.
        commit: Commit hash to read from.
        rel_path: Repo-relative path of the file.

    Returns:
        The file's text at that commit.
    """
    return git(repo_root, ["show", f"{commit}:{rel_path}"])


def sha256(text: str) -> str:
    """Hash text with SHA-256.

    Args:
        text: Text to hash.

    Returns:
        Lowercase hex digest.
    """
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def sha12(text: str) -> str:
    """Hash text with SHA-256 and keep the first 12 hex characters."""
    return sha256(text)[:12]


def frame_paths(tracked: list[str]) -> tuple[list[str], int]:
    """Keep the tracked markdown the lens may draw from.

    A dotenv basename is refused outright and counted, wherever it sits: it can
    hold a credential and this script never reads one. Changelogs, fixtures and
    vendored trees are dropped silently, because their prose is not the skill's
    authored voice.

    Args:
        tracked: Repo-relative tracked paths.

    Returns:
        The kept paths in their original order, and the refused count.
    """
    kept = []
    refused = 0
    for path in tracked:
        parts = [part for part in str(path).replace("\\", "/").split("/") if part]
        if not parts:
            continue
        if parts[-1].startswith(".env"):
            refused += 1
            continue
        if not parts[-1].endswith(".md"):
            continue
        if "changelog" in parts or "fixtures" in parts or "node_modules" in parts:
            continue
        if len(parts) < 3 or parts[0] != ".skilled" or parts[1] != "skills":
            continue
        kept.append(path)
    return kept, refused


# ───────────────────────────────────────────────────────────────
# 2. SECTIONS
# ───────────────────────────────────────────────────────────────

# A drawn section needs enough prose for a voice question to mean anything;
# one long enough to be a whole document under a single heading is not the
# authored section the questions ask about. The band keeps both out.
MIN_SECTION_LINES = 5
MAX_SECTION_LINES = 80

# A fence marker closes a block only when it repeats the opening character and
# runs at least as long. A shorter nested run must not end the fence, which
# would turn the heading-like lines inside it back into section breaks.
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
HEADING = re.compile(r"^#{1,6}\s")


def split_sections(text: str) -> list[dict]:
    """Split markdown into ATX sections of 1-based inclusive line ranges.

    A heading opens a new section only outside a fenced block, and a leading
    preamble counts as one section, so every line belongs to exactly one span.
    A fence closes only on a run of the same character at least as long as the
    one that opened it, so a shorter nested marker cannot end the fence and
    turn its own heading-like lines into section breaks.

    Args:
        text: The document's text.

    Returns:
        One ``{"start": n, "end": m}`` range per section; empty text gives [].
    """
    lines = text.splitlines()
    if not lines:
        return []
    starts = [1]
    fence = None
    for index, line in enumerate(lines):
        marker_match = FENCE.match(line)
        if marker_match:
            marker = marker_match.group(1)
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence):
                fence = None
            continue
        if fence is None and index + 1 != starts[-1] and HEADING.match(line):
            starts.append(index + 1)
    ranges = []
    for position, start in enumerate(starts):
        end = starts[position + 1] - 1 if position + 1 < len(starts) else len(lines)
        ranges.append({"start": start, "end": end})
    return ranges


def section_text(lines: list[str], start: int, end: int) -> str:
    """Join one 1-based inclusive line range back into text.

    Args:
        lines: The document's lines, as split for the section ranges.
        start: First line number, 1-based.
        end: Last line number, 1-based inclusive.

    Returns:
        The section's text, newline-joined.
    """
    return "\n".join(lines[start - 1:end])


def in_band(section: dict) -> bool:
    """Report whether a section's line count sits inside the drawing band.

    Below the floor a section holds too little prose for a question about
    voice to mean anything; above the ceiling it is usually a whole document
    folded under one heading rather than one authored section, and either
    would skew the sample.

    Args:
        section: A ``{"start": n, "end": m}`` range from ``split_sections``.

    Returns:
        True when the range holds between ``MIN_SECTION_LINES`` and
        ``MAX_SECTION_LINES`` lines, inclusive.
    """
    count = section["end"] - section["start"] + 1
    return MIN_SECTION_LINES <= count <= MAX_SECTION_LINES


# ───────────────────────────────────────────────────────────────
# 3. CENSUS
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).resolve().parent
# The script sits four levels below the repository root, under the skill
# folder, `sk-doc`, `skills` and `.skilled`.
DEFAULT_REPO_ROOT = SCRIPT_DIR.parents[4]
SCANNER = SCRIPT_DIR / "hvr_scan.py"

# The reader-needed categories this lens measures, in report order. Every row
# carries one of them, so the census, the draw and the report lines agree.
CATEGORIES = ("synonym-cycling", "significance-inflation", "false-ranges")

# One scanner spawn covers many files: the standard parse costs more than the
# scan itself, so a batch keeps the zero-call census quick on a large frame.
BATCH_SIZE = 200

SCANNER_SKIPPED_LINE = "stop: scanner skipped"


class ScannerSkipped(RuntimeError):
    """Raised when the scanner reports that validation is switched off.

    A skipped run answers with a marker instead of report bodies, so treating
    the batch as clean would count unread files as clean.
    """


class ScannerFailed(RuntimeError):
    """Raised when the scanner cannot produce a parseable report.

    A scan that exits 1 after finding hard blockers is a completed scan, not a
    failure; every other exit, and any unparseable output, refuses the census.
    """


def scan_batch(scanner: str | Path, repo_root: str | Path, paths: list[str]) -> list[dict]:
    """Run the scanner once over a batch of files and return its reports.

    Args:
        scanner: Path of the scanner script.
        repo_root: Path of the repository the paths are read from.
        paths: Repo-relative paths of one batch.

    Returns:
        The per-file report dicts, in the scanner's own order.

    Raises:
        ScannerSkipped: When the scanner reports validation is off.
        ScannerFailed: When the scanner cannot produce a parseable report.
    """
    result = subprocess.run(
        [sys.executable, str(scanner), *paths, "--json"],
        cwd=str(repo_root),
        check=False,
        capture_output=True,
        encoding="utf-8",
    )
    if result.returncode not in (0, 1):
        raise ScannerFailed(
            f"scanner exited {result.returncode}: {result.stderr.strip()}"
        )
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError:
        raise ScannerFailed(
            f"scanner printed no parseable report: {result.stderr.strip()}"
        ) from None
    if payload.get("skipped"):
        raise ScannerSkipped(str(payload.get("reason", "validation skipped")))
    reports = payload.get("reports")
    if not isinstance(reports, list):
        raise ScannerFailed("scanner report has no reports list")
    return reports


def build_census(repo_root: str | Path, commit: str, paths: list[str], scanner: str | Path) -> dict:
    """Measure the frame at one commit through the unchanged scanner.

    ``paths`` are the tracked paths; the frame rule decides which of them are
    read here, so the refused count belongs to the census. Every kept file is
    read at the recorded commit, split into sections and marked when a scanner
    finding line falls inside it. The scanner reads the committed text from a
    temporary copy outside the repository, so uncommitted edits never change
    the census. A section is a candidate for a category only
    when it can be drawn (flagged and inside the band) and that category's
    comparator flags it; synonym cycling has no lexical comparator, so it has
    no candidates and its rows are drawn at random instead.

    Args:
        repo_root: Path of the repository.
        commit: Commit hash the frame is measured at.
        paths: Repo-relative tracked paths.
        scanner: Path of the scanner script.

    Returns:
        ``{commit, files, sections, flagged, inBand, refused, candidates, docs}``.

    Raises:
        ScannerSkipped: When the scanner reports validation is off.
        ScannerFailed: When the scanner cannot produce a parseable report.
    """
    phrases = parse_significance_phrases(DEFAULT_RULES_PATH.read_text(encoding="utf-8"))
    kept, refused = frame_paths(paths)
    texts = {path: read_at_commit(repo_root, commit, path) for path in kept}
    findings_by_path: dict[str, list[dict]] = {}
    with tempfile.TemporaryDirectory() as temp_root:
        for path in kept:
            target = Path(temp_root) / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(texts[path], encoding="utf-8")
        for start in range(0, len(kept), BATCH_SIZE):
            for report in scan_batch(scanner, temp_root, kept[start:start + BATCH_SIZE]):
                findings_by_path[report["path"]] = report.get("findings", [])
    docs = []
    candidates = {category: 0 for category in CATEGORIES}
    files = 0
    sections_total = 0
    flagged_total = 0
    in_band_total = 0
    for path in kept:
        text = texts[path]
        lines = text.splitlines()
        finding_lines = {finding["line"] for finding in findings_by_path.get(path, [])}
        entries = []
        for section in split_sections(text):
            start = section["start"]
            end = section["end"]
            body = section_text(lines, start, end)
            flagged = any(start <= line <= end for line in finding_lines)
            inside = in_band(section)
            hits = {
                "synonym-cycling": False,
                "significance-inflation": significance_hit(body, phrases),
                "false-ranges": false_range_hit(body),
            }
            marks = {
                category: flagged and inside and hits[category] for category in CATEGORIES
            }
            for category in CATEGORIES:
                if marks[category]:
                    candidates[category] += 1
            entries.append(
                {
                    "start": start,
                    "end": end,
                    "flagged": flagged,
                    "inBand": inside,
                    "sha12": sha12(body),
                    "candidate": marks,
                }
            )
            sections_total += 1
            if flagged:
                flagged_total += 1
            if flagged and inside:
                in_band_total += 1
        files += 1
        docs.append({"doc": path, "sections": entries})
    return {
        "commit": commit,
        "files": files,
        "sections": sections_total,
        "flagged": flagged_total,
        "inBand": in_band_total,
        "refused": refused,
        "candidates": candidates,
        "docs": docs,
    }


def census_lines(census: dict) -> list[str]:
    """Format a census as its preamble lines.

    Args:
        census: A census from ``build_census``.

    Returns:
        The frame totals line, then one category line per ``CATEGORIES`` entry.
    """
    lines = [
        "census: commit={commit} files={files} sections={sections} flagged={flagged} "
        "in_band_5_80={in_band} refused={refused}".format(
            commit=census["commit"],
            files=census["files"],
            sections=census["sections"],
            flagged=census["flagged"],
            in_band=census["inBand"],
            refused=census["refused"],
        )
    ]
    for category in CATEGORIES:
        lines.append(f"census: category={category} candidates={census['candidates'][category]}")
    return lines


# ───────────────────────────────────────────────────────────────
# 4. COMPARATORS
# ───────────────────────────────────────────────────────────────

DEFAULT_RULES_PATH = SCRIPT_DIR.parent / "references" / "hvr-rules.md"

# Fail-closed floor for the significance parse: a shorter list means the
# standard's section shape moved and the comparator would flag nothing.
MINIMUM_SIGNIFICANCE_PHRASES = 5

# The section title keys the parse, so renumbering the standard cannot point it
# at another rule list; the body runs to the next heading of the same or a
# higher level.
SIGNIFICANCE_BLOCK = re.compile(
    r"^### [^\n]*significance inflation[^\n]*\n(.*?)(?=^#{1,3} |\Z)",
    re.MULTILINE | re.DOTALL | re.IGNORECASE,
)

# A from-to construction reads as a range whatever its scale. The pattern
# cannot tell a rhetorical range from a measurable one, so it flags both and a
# reader settles which it is; that over-flag is why its candidates are labeled.
FALSE_RANGE_PATTERN = re.compile(r"\bfrom\s+\S+(\s+\S+){0,3}\s+to\s+\S+", re.IGNORECASE)


def parse_significance_phrases(rules_text: str) -> list[str]:
    """Read the significance-inflation phrase list from the standard's text.

    The list sits in the section titled ``significance inflation`` as quoted
    bullets. A list shorter than ``MINIMUM_SIGNIFICANCE_PHRASES`` means the
    section shape moved out from under this parser, and the run refuses to
    measure against an unread rule list instead of reporting no candidates.

    Args:
        rules_text: The standard's text.

    Returns:
        The quoted phrases, in the order the standard lists them.

    Raises:
        SystemExit: With code 2 when the parsed list is too thin.
    """
    found = SIGNIFICANCE_BLOCK.search(rules_text)
    body = found.group(1) if found else ""
    phrases = []
    for line in body.splitlines():
        if line.lstrip().startswith("-"):
            phrases.extend(re.findall(r'"([^"]+)"', line))
    if len(phrases) < MINIMUM_SIGNIFICANCE_PHRASES:
        print(
            "hvr_reader_lens: the standard's significance section parsed too thin. "
            "Its shape changed and the comparator needs updating; refusing to "
            "report candidates from an unread rule list.",
            file=sys.stderr,
        )
        raise SystemExit(2)
    return phrases


def significance_hit(text: str, phrases: list[str]) -> bool:
    """Report whether any banned significance phrase appears in the text.

    The match is word-bounded and case-insensitive, so a phrase inside a longer
    word does not count and a sentence-capitalised use still matches the
    standard's own lowercase wording.

    Args:
        text: Section text.
        phrases: Phrases from ``parse_significance_phrases``.

    Returns:
        True when at least one phrase is present.
    """
    if not phrases:
        return False
    pattern = re.compile(
        r"\b(?:" + "|".join(re.escape(phrase) for phrase in phrases) + r")\b",
        re.IGNORECASE,
    )
    return pattern.search(text) is not None


def false_range_hit(text: str) -> bool:
    """Report whether the text carries a from X to Y construction.

    The pattern reads the shape, not the scale, so a measurable range is
    flagged too; the over-flag is what makes the comparator's rows worth
    labeling rather than trusting.

    Args:
        text: Section text.

    Returns:
        True when ``FALSE_RANGE_PATTERN`` matches.
    """
    return FALSE_RANGE_PATTERN.search(text) is not None


# ───────────────────────────────────────────────────────────────
# 5. DRAW AND LABELS
# ───────────────────────────────────────────────────────────────

# The sample is fixed before any label exists: a flat row budget per category,
# half of it drawn from a lexical comparator's own candidates where the category
# has one, so the label gate and the baseline counts stay comparable.
TOTAL_ROWS = 150
ROWS_PER_CATEGORY = 50
CANDIDATE_ROWS_PER_CATEGORY = 25

# A skill may contribute only a handful of rows per category, so one large skill
# cannot dominate the sample.
MAX_ROWS_PER_SKILL = 5

LABELS_PATH = SCRIPT_DIR / "hvr-reader-lens-labels.jsonl"


def read_jsonl(path: str | Path) -> list[dict] | None:
    """Read a JSON Lines file, or None when the file does not exist.

    A line that does not parse names its file and line number, so a corrupt
    labels file is refused by name rather than read as partial rows.

    Args:
        path: Path of the JSON Lines file.

    Returns:
        The parsed rows in file order, or ``None`` when the file is absent.

    Raises:
        ValueError: When a line is not JSON; the message names the file and line.
    """
    target = Path(path)
    if not target.exists():
        return None
    rows = []
    for number, line in enumerate(target.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            raise ValueError(f"{target}:{number}: not JSON") from None
    return rows


def write_jsonl(path: str | Path, rows: list[dict]) -> None:
    """Write rows as JSON Lines, creating the parent directory first.

    Compact one-object-per-line output keeps a drawn file byte-comparable across
    runs, which is what lets one seed reproduce the sample exactly.

    Args:
        path: Path of the JSON Lines file.
        rows: The rows to write, one per line.
    """
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    text = "".join(
        json.dumps(row, separators=(",", ":"), ensure_ascii=False) + "\n" for row in rows
    )
    target.write_text(text, encoding="utf-8")


def holds_label(rows: list[dict] | None) -> bool:
    """Report whether any row already carries an operator's label.

    Only a label blocks a redraw: an unlabeled file holds no measurement yet,
    so a fresh seed may replace it.

    Args:
        rows: Rows from ``read_jsonl``, or ``None`` when the file is absent.

    Returns:
        True when any row's ``label`` is not null.
    """
    return any(row.get("label") is not None for row in (rows or []))


def skill_of(doc: str) -> str:
    """Name the skill a framed document path belongs to.

    Args:
        doc: Repo-relative path that passed the frame rule.

    Returns:
        The path segment after ``skills/``, or the first segment when the path
        carries no ``skills`` segment.
    """
    parts = [part for part in str(doc).replace("\\", "/").split("/") if part]
    if "skills" in parts:
        index = parts.index("skills")
        if index + 1 < len(parts):
            return parts[index + 1]
    return parts[0] if parts else ""


def draw_rows(census: dict, seed: int) -> dict:
    """Draw the fixed sample from a census, carrying no section text.

    The pool is every flagged section inside the drawing band. Synonym cycling
    has no lexical comparator, so it draws its rows at random. Significance
    inflation and false ranges first take up to ``CANDIDATE_ROWS_PER_CATEGORY``
    rows their own comparator flags and then fill the rest from sections it does
    not, so the sample carries both sides of each rule. A skill contributes at
    most ``MAX_ROWS_PER_SKILL`` rows per category. The pool is sorted before the
    seeded shuffle, so one seed reproduces the file byte for byte.

    Args:
        census: A census from ``build_census``.
        seed: The draw seed.

    Returns:
        ``{"rows": [...], "candidate_rows": {<category>: <n>}}``, where every
        row carries ``id``, ``category``, ``doc``, ``section_start``,
        ``section_end``, ``commit``, ``section_sha12``, ``candidate``, ``label``
        and ``labeler``, with both label fields null.

    Raises:
        ValueError: When a category cannot fill its row budget under the
            per-skill cap.
    """
    rand = random.Random(seed)
    pool = []
    for doc in census["docs"]:
        skill = skill_of(doc["doc"])
        for section in doc["sections"]:
            if not (section["flagged"] and section["inBand"]):
                continue
            pool.append(
                {
                    "doc": doc["doc"],
                    "skill": skill,
                    "start": section["start"],
                    "end": section["end"],
                    "sha12": section["sha12"],
                    "candidate": {
                        category: bool(section["candidate"][category]) for category in CATEGORIES
                    },
                }
            )
    pool.sort(key=lambda entry: (entry["doc"], entry["start"]))
    rows = []
    candidate_rows = {}
    for category in CATEGORIES:
        rand.shuffle(pool)
        picked = []
        per_skill = {}
        if category == "synonym-cycling":
            phases = [(None, ROWS_PER_CATEGORY)]
        else:
            phases = [(True, CANDIDATE_ROWS_PER_CATEGORY), (False, ROWS_PER_CATEGORY)]
        for wanted, limit in phases:
            taken = 0
            for entry in pool:
                if len(picked) == ROWS_PER_CATEGORY or taken == limit:
                    break
                if wanted is not None and entry["candidate"][category] != wanted:
                    continue
                if per_skill.get(entry["skill"], 0) >= MAX_ROWS_PER_SKILL:
                    continue
                per_skill[entry["skill"]] = per_skill.get(entry["skill"], 0) + 1
                picked.append(entry)
                taken += 1
        if len(picked) != ROWS_PER_CATEGORY:
            raise ValueError(
                f"draw needs {ROWS_PER_CATEGORY} sections for {category}, "
                f"found {len(picked)} under the per-skill cap"
            )
        candidate_rows[category] = sum(
            1 for entry in picked if entry["candidate"][category]
        )
        for entry in picked:
            rows.append(
                {
                    "id": "",
                    "category": category,
                    "doc": entry["doc"],
                    "section_start": entry["start"],
                    "section_end": entry["end"],
                    "commit": census["commit"],
                    "section_sha12": entry["sha12"],
                    "candidate": entry["candidate"][category],
                    "label": None,
                    "labeler": None,
                }
            )
    for number, row in enumerate(rows, start=1):
        row["id"] = f"r{number:03d}"
    return {"rows": rows, "candidate_rows": candidate_rows}


# ───────────────────────────────────────────────────────────────
# 6. ROWS, LABEL GATE AND BASELINES
# ───────────────────────────────────────────────────────────────

# The one accepted stop while the labels are open: no measurement may start
# before the operator has answered every drawn row.
GATE_STOP_LINE = "stop: fewer than 150 labeled rows"

# Two categories passing is the keep rule's floor, so one passable category
# leaves nothing to beat and the line says so before any measurement.
STOP_CATEGORIES_LINE = "stop: fewer than 2 categories can pass"


def read_section(
    repo_root: str | Path, row: dict, tracked: list[str] | set[str]
) -> str:
    """Read one drawn row's section from its recorded commit.

    The frame rule is re-checked here rather than trusted: a document outside
    ``tracked`` and a dotenv basename are refused before anything is opened,
    and the section must still hash to the value recorded at draw time, so a
    document edited since the draw cannot be measured under the old label.

    Args:
        repo_root: Path of the repository.
        row: A drawn row naming a doc, a commit and a section range.
        tracked: Repo-relative tracked paths, from ``tracked_files``.

    Returns:
        The section's text at the row's commit.

    Raises:
        ValueError: When the row names a path outside ``tracked``, a dotenv
            basename, or a section whose hash differs from ``section_sha12``.
    """
    doc = str(row["doc"]).replace("\\", "/")
    basename = doc.rsplit("/", 1)[-1]
    if basename.startswith(".env"):
        raise ValueError(f"{row.get('id', '?')}: refusing dotenv path {doc}")
    if doc not in tracked:
        raise ValueError(f"{row.get('id', '?')}: refusing untracked path {doc}")
    lines = read_at_commit(repo_root, row["commit"], doc).splitlines()
    text = section_text(lines, row["section_start"], row["section_end"])
    if sha12(text) != row["section_sha12"]:
        raise ValueError(
            f"{row.get('id', '?')}: section does not match its recorded hash"
        )
    return text


def build_rows(repo_root: str | Path, rows: list[dict], phrases: list[str]) -> list[dict]:
    """Read every drawn row's section and recompute its comparator flag.

    A row that is untracked, a dotenv path or no longer matching its recorded
    hash is refused: it is never opened, stays in the returned list marked
    ``refused`` so the refusal is counted, and ``summarize_baseline`` leaves
    it out. The comparator flag is recomputed from the committed text rather
    than trusted from the labels file, so an edited file cannot change the
    rule the baseline is measured against.

    Args:
        repo_root: Path of the repository.
        rows: Drawn rows from ``read_jsonl``.
        phrases: The significance-inflation phrases.

    Returns:
        One row per drawn row, carrying ``id``, ``category``, ``doc``,
        ``commit``, ``section_sha12``, ``label``, ``text``, ``candidate`` and
        ``refused``.
    """
    tracked = set(tracked_files(repo_root))
    built = []
    for row in rows:
        entry = {
            "id": row["id"],
            "category": row["category"],
            "doc": row["doc"],
            "commit": row["commit"],
            "section_sha12": row["section_sha12"],
            "label": row["label"],
            "text": None,
            "candidate": False,
            "refused": True,
        }
        try:
            entry["text"] = read_section(repo_root, row, tracked)
        except ValueError:
            built.append(entry)
            continue
        entry["candidate"] = {
            "synonym-cycling": False,
            "significance-inflation": significance_hit(entry["text"], phrases),
            "false-ranges": false_range_hit(entry["text"]),
        }[row["category"]]
        entry["refused"] = False
        built.append(entry)
    return built


def label_gate(rows: list[dict] | None) -> dict:
    """Count the operator's labels and judge whether the gate is complete.

    The gate is complete only when the whole sample is present and every row
    carries one of the operator's two answers; a missing file counts as zero.

    Args:
        rows: Rows from ``read_jsonl``, or ``None`` when the file is absent.

    Returns:
        ``{"complete": bool, "labeled": int, "total": int}``.
    """
    entries = rows or []
    labeled = sum(1 for row in entries if row.get("label") in ("yes", "no"))
    return {
        "complete": len(entries) == TOTAL_ROWS and labeled == TOTAL_ROWS,
        "labeled": labeled,
        "total": TOTAL_ROWS,
    }


def gate_lines(g: dict) -> list[str]:
    """Format a label gate as its two lines: the count, then the stop line.

    Args:
        g: A gate from ``label_gate``.

    Returns:
        The label count line and the gate stop line, in report order.
    """
    return [f"labels: labeled={g['labeled']} of {TOTAL_ROWS}", GATE_STOP_LINE]


def summarize_baseline(rows: list[dict]) -> dict:
    """Summarize the two no-call baselines per category over the labeled rows.

    Flag-nothing never flags, which is what the scanner does for these
    categories; the category's comparator flags the sections it matches. The
    comparator is chosen only when it is right on strictly more rows, so a tie
    keeps the cheaper baseline. A refused row is left out of every count.

    Args:
        rows: In-memory rows from ``build_rows``.

    Returns:
        ``{"categories": {<category>: {"K", "flagNothingRight",
        "comparatorRight", "method", "B", "yesShare", "flags"}}}``, where
        ``flags`` maps every scored row's id to the chosen baseline's flag.
    """
    categories = {}
    for category in CATEGORIES:
        entries = [
            row
            for row in rows
            if row["category"] == category and not row.get("refused")
        ]
        flag_nothing_right = sum(1 for row in entries if row["label"] == "no")
        comparator_right = sum(
            1
            for row in entries
            if bool(row["candidate"]) == (row["label"] == "yes")
        )
        method = "comparator" if comparator_right > flag_nothing_right else "flag-nothing"
        categories[category] = {
            "K": len(entries),
            "flagNothingRight": flag_nothing_right,
            "comparatorRight": comparator_right,
            "method": method,
            "B": comparator_right if method == "comparator" else flag_nothing_right,
            "yesShare": sum(1 for row in entries if row["label"] == "yes"),
            "flags": {
                row["id"]: method == "comparator" and bool(row["candidate"])
                for row in entries
            },
        }
    return {"categories": categories}


def baseline_lines(s: dict) -> list[str]:
    """Format a baseline summary as its per-category lines.

    Args:
        s: A summary from ``summarize_baseline``.

    Returns:
        One ``baseline (<c>):`` line per category, in ``CATEGORIES`` order.
    """
    lines = []
    for category in CATEGORIES:
        entry = s["categories"][category]
        lines.append(
            "baseline ({category}): flag-nothing right={flag_nothing} of {K} "
            "comparator right={comparator} of {K} chosen={method} B={B} "
            "yes_share={yes} of {K}".format(
                category=category,
                flag_nothing=entry["flagNothingRight"],
                comparator=entry["comparatorRight"],
                K=entry["K"],
                method=entry["method"],
                B=entry["B"],
                yes=entry["yesShare"],
            )
        )
    return lines


def headroom_lines(s: dict) -> list[str]:
    """Format how much room the chosen baseline leaves in each category.

    A baseline right on more than nine tenths of a category leaves no
    headroom, and one wrong on fewer than five rows leaves too little for an
    exact sign test to reach its bar, so neither category can pass.

    Args:
        s: A summary from ``summarize_baseline``.

    Returns:
        One ``headroom (<c>):``, ``no headroom (<c>)`` or
        ``underpowered (<c>)`` line per category, in ``CATEGORIES`` order.
    """
    lines = []
    for category in CATEGORIES:
        entry = s["categories"][category]
        K = entry["K"]
        B = entry["B"]
        if 10 * B > 9 * K:
            lines.append(f"no headroom ({category})")
        elif K - B < 5:
            lines.append(f"underpowered ({category})")
        else:
            lines.append(f"headroom ({category}): baseline wrong on {K - B} of {K}")
    return lines


def stop_categories(s: dict) -> bool:
    """Report whether too few categories still have room to pass the keep rule.

    Args:
        s: A summary from ``summarize_baseline``.

    Returns:
        True when fewer than two categories can pass, which stops the run
        before any measurement against the baseline.
    """
    passable = 0
    for category in CATEGORIES:
        entry = s["categories"][category]
        K = entry["K"]
        B = entry["B"]
        if 10 * B <= 9 * K and K - B >= 5:
            passable += 1
    return passable < 2


# ───────────────────────────────────────────────────────────────
# 7. QUESTIONS AND KEEP RULE
# ───────────────────────────────────────────────────────────────

# The three fixed instructions, one per category, printed verbatim with their
# digests, so a report pins the exact wording each category's label settles.
QUESTIONS = {
    "synonym-cycling": (
        "Does this passage refer to the same thing by three or more different words?"
    ),
    "significance-inflation": (
        "Does this passage declare that something is important or historic instead of "
        "stating what happened?"
    ),
    "false-ranges": (
        "Does this passage use a from X to Y construction whose endpoints are not on a "
        "meaningful scale?"
    ),
}

# The margin and the keep rule are fixed and printed before any measurement, so
# a change to either is an amendment rather than a tuning.
MARGIN = 0.10
MARGIN_LINE = f"margin: {MARGIN:.2f}"
KEEP_RULE_LINE = (
    "keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, "
    "precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, "
    "sign test p < 0.05, keep at two categories passing"
)


def question_lines() -> list[str]:
    """Format the three fixed questions as their preamble lines.

    Each line carries the question's SHA-256 beside its text, so a report pins
    the exact wording each category's label settles, not just the name.

    Returns:
        One ``question <c> sha256=<64hex>: <text>`` line per ``CATEGORIES`` entry.
    """
    return [
        f"question {category} sha256={sha256(QUESTIONS[category])}: {QUESTIONS[category]}"
        for category in CATEGORIES
    ]


# ───────────────────────────────────────────────────────────────
# 8. RUN
# ───────────────────────────────────────────────────────────────


def main(argv: list[str] | None = None, deps: dict | None = None) -> int:
    """Run the lens and return its exit code.

    Args:
        argv: Command-line arguments; the process arguments when omitted.
        deps: Optional overrides for the repository root, the scanner path and
            the output and error writers.

    Returns:
        0 when the run printed its lines, 2 on an invocation, an input or a
        rule list the run refuses.
    """
    deps = deps or {}
    out = deps.get("out") or print
    err = deps.get("err") or (lambda line: print(line, file=sys.stderr))
    parser = argparse.ArgumentParser(
        description="Measure reader-needed voice tells over committed skill docs."
    )
    parser.add_argument("--draw", action="store_true", help="draw the unlabeled labels sample")
    parser.add_argument("--seed", help="the draw seed, a non-negative integer")
    parser.add_argument("--labels", help="path of the labels file")
    try:
        values = parser.parse_args(argv)
    except SystemExit as stop:
        return int(stop.code) if isinstance(stop.code, int) else 2
    repo_root = deps.get("repo_root") or DEFAULT_REPO_ROOT
    scanner = deps.get("scanner") or SCANNER
    if values.draw:
        # The draw writes the unlabeled sample and never measures.
        if re.fullmatch(r"\d+", values.seed or "") is None:
            err("--draw needs --seed <non-negative integer>")
            return 2
        labels_path = Path(values.labels) if values.labels else LABELS_PATH
        try:
            if holds_label(read_jsonl(labels_path)):
                err(f"draw refused: {labels_path} holds a label")
                return 2
            commit = head_commit(repo_root)
            census = build_census(repo_root, commit, tracked_files(repo_root), scanner)
            drawn = draw_rows(census, int(values.seed))
            write_jsonl(labels_path, drawn["rows"])
        except ScannerSkipped:
            out(SCANNER_SKIPPED_LINE)
            return 0
        except ScannerFailed as failure:
            err(f"scanner failed: {failure}")
            return 2
        except ValueError as failure:
            err(f"draw refused: {failure}")
            return 2
        except OSError as failure:
            err(f"cannot read an input: {failure}")
            return 2
        except SystemExit as stop:
            return int(stop.code) if isinstance(stop.code, int) else 1
        out(f"draw: seed={values.seed} commit={commit} rows={TOTAL_ROWS}")
        for category in CATEGORIES:
            out(
                f"draw: category={category} rows={ROWS_PER_CATEGORY} "
                f"candidate_rows={drawn['candidate_rows'][category]}"
            )
        out(f"draw: wrote {labels_path}")
        return 0
    try:
        tracked = tracked_files(repo_root)
        commit = head_commit(repo_root)
        census = build_census(repo_root, commit, tracked, scanner)
    except ScannerSkipped:
        out(SCANNER_SKIPPED_LINE)
        return 0
    except ScannerFailed as failure:
        err(f"scanner failed: {failure}")
        return 2
    except OSError as failure:
        err(f"cannot read an input: {failure}")
        return 2
    except SystemExit as stop:
        return int(stop.code) if isinstance(stop.code, int) else 1

    for line in census_lines(census):
        out(line)
    for line in question_lines():
        out(line)
    out(MARGIN_LINE)
    out(KEEP_RULE_LINE)

    labels_path = Path(values.labels) if values.labels else LABELS_PATH
    try:
        labels = read_jsonl(labels_path)
        gate = label_gate(labels)
        phrases = parse_significance_phrases(
            DEFAULT_RULES_PATH.read_text(encoding="utf-8")
        )
        summary = None
        if gate["complete"]:
            summary = summarize_baseline(build_rows(repo_root, labels, phrases))
    except ValueError as failure:
        err(f"cannot read an input: {failure}")
        return 2
    except OSError as failure:
        err(f"cannot read an input: {failure}")
        return 2
    except SystemExit as stop:
        return int(stop.code) if isinstance(stop.code, int) else 1

    if not gate["complete"]:
        for line in gate_lines(gate):
            out(line)
    else:
        for line in baseline_lines(summary):
            out(line)
        for line in headroom_lines(summary):
            out(line)
        if stop_categories(summary):
            out(STOP_CATEGORIES_LINE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
