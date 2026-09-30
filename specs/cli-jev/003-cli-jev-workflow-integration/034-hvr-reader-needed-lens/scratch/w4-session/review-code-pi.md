# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (DeepSeek V4.1 Flash). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md). This review covers the code only; the docs are reviewed separately. Every code step, including the session's fix briefs, was written by DeepSeek; review the whole of both files. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py b/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py
new file mode 100644
index 0000000000..c318b687ac
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py
@@ -0,0 +1,2279 @@
+#!/usr/bin/env python3
+# ───────────────────────────────────────────────────────────────
+# HVR READER-NEEDED LENS — samples the tells a machine cannot settle
+# ───────────────────────────────────────────────────────────────
+
+"""Measure how well a classifier spots the Human Voice Rules tells a reader has to settle.
+
+The scanner settles what a machine can settle. Synonym cycling, false ranges,
+significance inflation and the rest need a reader, and no count of them can come
+from the text alone. This lens draws a fixed sample of tracked skill sections,
+prints the census the sample rests on, and then measures a backend against the
+operator's labels when a switch names one.
+
+Usage:
+  python3 hvr_reader_lens.py                     # census, questions, baselines
+  python3 hvr_reader_lens.py --draw --seed <n>   # write the labels file
+  python3 hvr_reader_lens.py --jev --out <dir>   # measure the Jev backend
+  python3 hvr_reader_lens.py --deem --out <dir>  # measure the Deem backend
+  python3 hvr_reader_lens.py --labels <path>     # point at another labels file
+
+The default run makes no model call, writes no file and holds no credential.
+Jev and Deem each need --out <dir> so every call can be recorded, and a run
+refuses that switch without it before any call is made.
+
+Exit status: 0 when the run printed its lines, 2 on a bad invocation, an
+unreadable input or a thin parse, refused before any call.
+"""
+
+from __future__ import annotations
+
+import argparse
+import hashlib
+import json
+import math
+import os
+import random
+import re
+import subprocess
+import sys
+import time
+from pathlib import Path
+
+# ───────────────────────────────────────────────────────────────
+# 1. REPOSITORY READS
+# ───────────────────────────────────────────────────────────────
+
+# git reads its target repository from these variables IN PREFERENCE to `-C`,
+# and a worktree shares one `.git/config`, so an inherited GIT_DIR would point
+# every read at the real repository. Dropping them leaves `-C` the only selector.
+GIT_ENV_REDIRECTORS = (
+    "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
+    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
+    "GIT_CONFIG", "GIT_CONFIG_GLOBAL", "GIT_CONFIG_SYSTEM", "GIT_CONFIG_COUNT",
+    "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
+)
+
+
+def git(repo_root: str | Path, args: list[str]) -> str:
+    """Run git in a repository and return its standard output verbatim.
+
+    Args:
+        repo_root: Path of the repository the command runs in.
+        args: Git arguments after ``-C <repo_root>``.
+
+    Returns:
+        Standard output, unchanged.
+
+    Raises:
+        RuntimeError: When git exits non-zero; the message carries stderr.
+    """
+    env = dict(os.environ)
+    for key in GIT_ENV_REDIRECTORS:
+        env.pop(key, None)
+    result = subprocess.run(
+        ["git", "-C", str(repo_root), *args],
+        check=False,
+        capture_output=True,
+        encoding="utf-8",
+        env=env,
+    )
+    if result.returncode != 0:
+        raise RuntimeError(f"git {args[0]} failed: {result.stderr.strip()}")
+    return result.stdout
+
+
+def tracked_files(repo_root: str | Path) -> list[str]:
+    """List the repository's tracked files in git order.
+
+    Args:
+        repo_root: Path of the repository.
+
+    Returns:
+        Repo-relative paths, without the NUL separators git writes them with.
+    """
+    return [path for path in git(repo_root, ["ls-files", "-z"]).split("\0") if path]
+
+
+def head_commit(repo_root: str | Path) -> str:
+    """Resolve the repository's HEAD commit.
+
+    Args:
+        repo_root: Path of the repository.
+
+    Returns:
+        The full commit hash.
+    """
+    return git(repo_root, ["rev-parse", "HEAD"]).strip()
+
+
+def read_at_commit(repo_root: str | Path, commit: str, rel_path: str) -> str:
+    """Read one file as of one commit.
+
+    Reading through git rather than the working tree keeps the measurement on
+    the committed text a sample was drawn from, even while later edits land.
+
+    Args:
+        repo_root: Path of the repository.
+        commit: Commit hash to read from.
+        rel_path: Repo-relative path of the file.
+
+    Returns:
+        The file's text at that commit.
+    """
+    return git(repo_root, ["show", f"{commit}:{rel_path}"])
+
+
+def sha256(text: str) -> str:
+    """Hash text with SHA-256.
+
+    Args:
+        text: Text to hash.
+
+    Returns:
+        Lowercase hex digest.
+    """
+    return hashlib.sha256(text.encode("utf-8")).hexdigest()
+
+
+def sha12(text: str) -> str:
+    """Hash text with SHA-256 and keep the first 12 hex characters."""
+    return sha256(text)[:12]
+
+
+def frame_paths(tracked: list[str]) -> tuple[list[str], int]:
+    """Keep the tracked markdown the lens may draw from.
+
+    A dotenv basename is refused outright and counted, wherever it sits: it can
+    hold a credential and this script never reads one. Changelogs, fixtures and
+    vendored trees are dropped silently, because their prose is not the skill's
+    authored voice.
+
+    Args:
+        tracked: Repo-relative tracked paths.
+
+    Returns:
+        The kept paths in their original order, and the refused count.
+    """
+    kept = []
+    refused = 0
+    for path in tracked:
+        parts = [part for part in str(path).replace("\\", "/").split("/") if part]
+        if not parts:
+            continue
+        if parts[-1].startswith(".env"):
+            refused += 1
+            continue
+        if not parts[-1].endswith(".md"):
+            continue
+        if "changelog" in parts or "fixtures" in parts or "node_modules" in parts:
+            continue
+        if len(parts) < 3 or parts[0] != ".skilled" or parts[1] != "skills":
+            continue
+        kept.append(path)
+    return kept, refused
+
+
+# ───────────────────────────────────────────────────────────────
+# 2. SECTIONS
+# ───────────────────────────────────────────────────────────────
+
+# A drawn section needs enough prose for a voice question to mean anything;
+# one long enough to be a whole document under a single heading is not the
+# authored section the questions ask about. The band keeps both out.
+MIN_SECTION_LINES = 5
+MAX_SECTION_LINES = 80
+
+# A fence marker closes a block only when it repeats the opening character and
+# runs at least as long. A shorter nested run must not end the fence, which
+# would turn the heading-like lines inside it back into section breaks.
+FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
+HEADING = re.compile(r"^#{1,6}\s")
+
+
+def split_sections(text: str) -> list[dict]:
+    """Split markdown into ATX sections of 1-based inclusive line ranges.
+
+    A heading opens a new section only outside a fenced block, and a leading
+    preamble counts as one section, so every line belongs to exactly one span.
+    A fence closes only on a run of the same character at least as long as the
+    one that opened it, so a shorter nested marker cannot end the fence and
+    turn its own heading-like lines into section breaks.
+
+    Args:
+        text: The document's text.
+
+    Returns:
+        One ``{"start": n, "end": m}`` range per section; empty text gives [].
+    """
+    lines = text.splitlines()
+    if not lines:
+        return []
+    starts = [1]
+    fence = None
+    for index, line in enumerate(lines):
+        marker_match = FENCE.match(line)
+        if marker_match:
+            marker = marker_match.group(1)
+            if fence is None:
+                fence = marker
+            elif marker[0] == fence[0] and len(marker) >= len(fence):
+                fence = None
+            continue
+        if fence is None and index + 1 != starts[-1] and HEADING.match(line):
+            starts.append(index + 1)
+    ranges = []
+    for position, start in enumerate(starts):
+        end = starts[position + 1] - 1 if position + 1 < len(starts) else len(lines)
+        ranges.append({"start": start, "end": end})
+    return ranges
+
+
+def section_text(lines: list[str], start: int, end: int) -> str:
+    """Join one 1-based inclusive line range back into text.
+
+    Args:
+        lines: The document's lines, as split for the section ranges.
+        start: First line number, 1-based.
+        end: Last line number, 1-based inclusive.
+
+    Returns:
+        The section's text, newline-joined.
+    """
+    return "\n".join(lines[start - 1:end])
+
+
+def in_band(section: dict) -> bool:
+    """Report whether a section's line count sits inside the drawing band.
+
+    Below the floor a section holds too little prose for a question about
+    voice to mean anything; above the ceiling it is usually a whole document
+    folded under one heading rather than one authored section, and either
+    would skew the sample.
+
+    Args:
+        section: A ``{"start": n, "end": m}`` range from ``split_sections``.
+
+    Returns:
+        True when the range holds between ``MIN_SECTION_LINES`` and
+        ``MAX_SECTION_LINES`` lines, inclusive.
+    """
+    count = section["end"] - section["start"] + 1
+    return MIN_SECTION_LINES <= count <= MAX_SECTION_LINES
+
+
+# ───────────────────────────────────────────────────────────────
+# 3. CENSUS
+# ───────────────────────────────────────────────────────────────
+
+SCRIPT_DIR = Path(__file__).resolve().parent
+# The script sits four levels below the repository root, under the skill
+# folder, `sk-doc`, `skills` and `.skilled`.
+DEFAULT_REPO_ROOT = SCRIPT_DIR.parents[4]
+SCANNER = SCRIPT_DIR / "hvr_scan.py"
+
+# The reader-needed categories this lens measures, in report order. Every row
+# carries one of them, so the census, the draw and the verdict lines agree.
+CATEGORIES = ("synonym-cycling", "significance-inflation", "false-ranges")
+
+# One scanner spawn covers many files: the standard parse costs more than the
+# scan itself, so a batch keeps the zero-call census quick on a large frame.
+BATCH_SIZE = 200
+
+SCANNER_SKIPPED_LINE = "stop: scanner skipped"
+
+
+class ScannerSkipped(RuntimeError):
+    """Raised when the scanner reports that validation is switched off.
+
+    A skipped run answers with a marker instead of report bodies, so treating
+    the batch as clean would count unread files as clean.
+    """
+
+
+class ScannerFailed(RuntimeError):
+    """Raised when the scanner cannot produce a parseable report.
+
+    A scan that exits 1 after finding hard blockers is a completed scan, not a
+    failure; every other exit, and any unparseable output, refuses the census.
+    """
+
+
+def scan_batch(scanner: str | Path, repo_root: str | Path, paths: list[str]) -> list[dict]:
+    """Run the scanner once over a batch of files and return its reports.
+
+    Args:
+        scanner: Path of the scanner script.
+        repo_root: Path of the repository the paths are read from.
+        paths: Repo-relative paths of one batch.
+
+    Returns:
+        The per-file report dicts, in the scanner's own order.
+
+    Raises:
+        ScannerSkipped: When the scanner reports validation is off.
+        ScannerFailed: When the scanner cannot produce a parseable report.
+    """
+    result = subprocess.run(
+        [sys.executable, str(scanner), *paths, "--json"],
+        cwd=str(repo_root),
+        check=False,
+        capture_output=True,
+        encoding="utf-8",
+    )
+    if result.returncode not in (0, 1):
+        raise ScannerFailed(
+            f"scanner exited {result.returncode}: {result.stderr.strip()}"
+        )
+    try:
+        payload = json.loads(result.stdout)
+    except json.JSONDecodeError:
+        raise ScannerFailed(
+            f"scanner printed no parseable report: {result.stderr.strip()}"
+        ) from None
+    if payload.get("skipped"):
+        raise ScannerSkipped(str(payload.get("reason", "validation skipped")))
+    reports = payload.get("reports")
+    if not isinstance(reports, list):
+        raise ScannerFailed("scanner report has no reports list")
+    return reports
+
+
+def build_census(repo_root: str | Path, commit: str, paths: list[str], scanner: str | Path) -> dict:
+    """Measure the frame at one commit through the unchanged scanner.
+
+    ``paths`` are the tracked paths; the frame rule decides which of them are
+    read here, so the refused count belongs to the census. Every kept file is
+    read at the recorded commit, split into sections and marked when a scanner
+    finding line falls inside it. A section is a candidate for a category only
+    when it can be drawn (flagged and inside the band) and that category's
+    comparator flags it; synonym cycling has no lexical comparator, so it has
+    no candidates and its rows are drawn at random instead.
+
+    Args:
+        repo_root: Path of the repository.
+        commit: Commit hash the frame is measured at.
+        paths: Repo-relative tracked paths.
+        scanner: Path of the scanner script.
+
+    Returns:
+        ``{commit, files, sections, flagged, inBand, refused, candidates, docs}``.
+
+    Raises:
+        ScannerSkipped: When the scanner reports validation is off.
+        ScannerFailed: When the scanner cannot produce a parseable report.
+    """
+    phrases = parse_significance_phrases(DEFAULT_RULES_PATH.read_text(encoding="utf-8"))
+    kept, refused = frame_paths(paths)
+    findings_by_path: dict[str, list[dict]] = {}
+    for start in range(0, len(kept), BATCH_SIZE):
+        for report in scan_batch(scanner, repo_root, kept[start:start + BATCH_SIZE]):
+            findings_by_path[report["path"]] = report.get("findings", [])
+    docs = []
+    candidates = {category: 0 for category in CATEGORIES}
+    files = 0
+    sections_total = 0
+    flagged_total = 0
+    in_band_total = 0
+    for path in kept:
+        text = read_at_commit(repo_root, commit, path)
+        lines = text.splitlines()
+        finding_lines = {finding["line"] for finding in findings_by_path.get(path, [])}
+        entries = []
+        for section in split_sections(text):
+            start = section["start"]
+            end = section["end"]
+            body = section_text(lines, start, end)
+            flagged = any(start <= line <= end for line in finding_lines)
+            inside = in_band(section)
+            hits = {
+                "synonym-cycling": False,
+                "significance-inflation": significance_hit(body, phrases),
+                "false-ranges": false_range_hit(body),
+            }
+            marks = {
+                category: flagged and inside and hits[category] for category in CATEGORIES
+            }
+            for category in CATEGORIES:
+                if marks[category]:
+                    candidates[category] += 1
+            entries.append(
+                {
+                    "start": start,
+                    "end": end,
+                    "flagged": flagged,
+                    "inBand": inside,
+                    "sha12": sha12(body),
+                    "candidate": marks,
+                }
+            )
+            sections_total += 1
+            if flagged:
+                flagged_total += 1
+            if flagged and inside:
+                in_band_total += 1
+        files += 1
+        docs.append({"doc": path, "sections": entries})
+    return {
+        "commit": commit,
+        "files": files,
+        "sections": sections_total,
+        "flagged": flagged_total,
+        "inBand": in_band_total,
+        "refused": refused,
+        "candidates": candidates,
+        "docs": docs,
+    }
+
+
+def census_lines(census: dict) -> list[str]:
+    """Format a census as its preamble lines.
+
+    Args:
+        census: A census from ``build_census``.
+
+    Returns:
+        The frame totals line, then one category line per ``CATEGORIES`` entry.
+    """
+    lines = [
+        "census: commit={commit} files={files} sections={sections} flagged={flagged} "
+        "in_band_5_80={in_band} refused={refused}".format(
+            commit=census["commit"],
+            files=census["files"],
+            sections=census["sections"],
+            flagged=census["flagged"],
+            in_band=census["inBand"],
+            refused=census["refused"],
+        )
+    ]
+    for category in CATEGORIES:
+        lines.append(f"census: category={category} candidates={census['candidates'][category]}")
+    return lines
+
+
+# ───────────────────────────────────────────────────────────────
+# 4. COMPARATORS
+# ───────────────────────────────────────────────────────────────
+
+DEFAULT_RULES_PATH = SCRIPT_DIR.parent / "references" / "hvr-rules.md"
+
+# Fail-closed floor for the significance parse: a shorter list means the
+# standard's section shape moved and the comparator would flag nothing.
+MINIMUM_SIGNIFICANCE_PHRASES = 5
+
+# The section title keys the parse, so renumbering the standard cannot point it
+# at another rule list; the body runs to the next heading of the same or a
+# higher level.
+SIGNIFICANCE_BLOCK = re.compile(
+    r"^### [^\n]*significance inflation[^\n]*\n(.*?)(?=^#{1,3} |\Z)",
+    re.MULTILINE | re.DOTALL | re.IGNORECASE,
+)
+
+# A from-to construction reads as a range whatever its scale. The pattern
+# cannot tell a rhetorical range from a measurable one, so it flags both and a
+# reader settles which it is; that over-flag is why its candidates are labeled.
+FALSE_RANGE_PATTERN = re.compile(r"\bfrom\s+\S+(\s+\S+){0,3}\s+to\s+\S+", re.IGNORECASE)
+
+
+def parse_significance_phrases(rules_text: str) -> list[str]:
+    """Read the significance-inflation phrase list from the standard's text.
+
+    The list sits in the section titled ``significance inflation`` as quoted
+    bullets. A list shorter than ``MINIMUM_SIGNIFICANCE_PHRASES`` means the
+    section shape moved out from under this parser, and the run refuses to
+    measure against an unread rule list instead of reporting no candidates.
+
+    Args:
+        rules_text: The standard's text.
+
+    Returns:
+        The quoted phrases, in the order the standard lists them.
+
+    Raises:
+        SystemExit: With code 2 when the parsed list is too thin.
+    """
+    found = SIGNIFICANCE_BLOCK.search(rules_text)
+    body = found.group(1) if found else ""
+    phrases = []
+    for line in body.splitlines():
+        if line.lstrip().startswith("-"):
+            phrases.extend(re.findall(r'"([^"]+)"', line))
+    if len(phrases) < MINIMUM_SIGNIFICANCE_PHRASES:
+        print(
+            "hvr_reader_lens: the standard's significance section parsed too thin. "
+            "Its shape changed and the comparator needs updating; refusing to "
+            "report candidates from an unread rule list.",
+            file=sys.stderr,
+        )
+        raise SystemExit(2)
+    return phrases
+
+
+def significance_hit(text: str, phrases: list[str]) -> bool:
+    """Report whether any banned significance phrase appears in the text.
+
+    The match is word-bounded and case-insensitive, so a phrase inside a longer
+    word does not count and a sentence-capitalised use still matches the
+    standard's own lowercase wording.
+
+    Args:
+        text: Section text.
+        phrases: Phrases from ``parse_significance_phrases``.
+
+    Returns:
+        True when at least one phrase is present.
+    """
+    if not phrases:
+        return False
+    pattern = re.compile(
+        r"\b(?:" + "|".join(re.escape(phrase) for phrase in phrases) + r")\b",
+        re.IGNORECASE,
+    )
+    return pattern.search(text) is not None
+
+
+def false_range_hit(text: str) -> bool:
+    """Report whether the text carries a from X to Y construction.
+
+    The pattern reads the shape, not the scale, so a measurable range is
+    flagged too; the over-flag is what makes the comparator's rows worth
+    labeling rather than trusting.
+
+    Args:
+        text: Section text.
+
+    Returns:
+        True when ``FALSE_RANGE_PATTERN`` matches.
+    """
+    return FALSE_RANGE_PATTERN.search(text) is not None
+
+
+# ───────────────────────────────────────────────────────────────
+# 5. DRAW AND LABELS
+# ───────────────────────────────────────────────────────────────
+
+# The sample is fixed before any label exists: a flat row budget per category,
+# half of it drawn from a lexical comparator's own candidates where the category
+# has one, so the label gate and the verdict counts stay comparable.
+TOTAL_ROWS = 150
+ROWS_PER_CATEGORY = 50
+CANDIDATE_ROWS_PER_CATEGORY = 25
+
+# A skill may contribute only a handful of rows per category, so one large skill
+# cannot dominate the sample.
+MAX_ROWS_PER_SKILL = 5
+
+LABELS_PATH = SCRIPT_DIR / "hvr-reader-lens-labels.jsonl"
+
+
+def read_jsonl(path: str | Path) -> list[dict] | None:
+    """Read a JSON Lines file, or None when the file does not exist.
+
+    A line that does not parse names its file and line number, so a corrupt
+    labels file is refused by name rather than read as partial rows.
+
+    Args:
+        path: Path of the JSON Lines file.
+
+    Returns:
+        The parsed rows in file order, or ``None`` when the file is absent.
+
+    Raises:
+        ValueError: When a line is not JSON; the message names the file and line.
+    """
+    target = Path(path)
+    if not target.exists():
+        return None
+    rows = []
+    for number, line in enumerate(target.read_text(encoding="utf-8").splitlines(), start=1):
+        if not line.strip():
+            continue
+        try:
+            rows.append(json.loads(line))
+        except json.JSONDecodeError:
+            raise ValueError(f"{target}:{number}: not JSON") from None
+    return rows
+
+
+def write_jsonl(path: str | Path, rows: list[dict]) -> None:
+    """Write rows as JSON Lines, creating the parent directory first.
+
+    Compact one-object-per-line output keeps a drawn file byte-comparable across
+    runs, which is what lets one seed reproduce the sample exactly.
+
+    Args:
+        path: Path of the JSON Lines file.
+        rows: The rows to write, one per line.
+    """
+    target = Path(path)
+    target.parent.mkdir(parents=True, exist_ok=True)
+    text = "".join(
+        json.dumps(row, separators=(",", ":"), ensure_ascii=False) + "\n" for row in rows
+    )
+    target.write_text(text, encoding="utf-8")
+
+
+def holds_label(rows: list[dict] | None) -> bool:
+    """Report whether any row already carries an operator's label.
+
+    Only a label blocks a redraw: an unlabeled file holds no measurement yet,
+    so a fresh seed may replace it.
+
+    Args:
+        rows: Rows from ``read_jsonl``, or ``None`` when the file is absent.
+
+    Returns:
+        True when any row's ``label`` is not null.
+    """
+    return any(row.get("label") is not None for row in (rows or []))
+
+
+def skill_of(doc: str) -> str:
+    """Name the skill a framed document path belongs to.
+
+    Args:
+        doc: Repo-relative path that passed the frame rule.
+
+    Returns:
+        The path segment after ``skills/``, or the first segment when the path
+        carries no ``skills`` segment.
+    """
+    parts = [part for part in str(doc).replace("\\", "/").split("/") if part]
+    if "skills" in parts:
+        index = parts.index("skills")
+        if index + 1 < len(parts):
+            return parts[index + 1]
+    return parts[0] if parts else ""
+
+
+def draw_rows(census: dict, seed: int) -> dict:
+    """Draw the fixed sample from a census, carrying no section text.
+
+    The pool is every flagged section inside the drawing band. Synonym cycling
+    has no lexical comparator, so it draws its rows at random. Significance
+    inflation and false ranges first take up to ``CANDIDATE_ROWS_PER_CATEGORY``
+    rows their own comparator flags and then fill the rest from sections it does
+    not, so the sample carries both sides of each rule. A skill contributes at
+    most ``MAX_ROWS_PER_SKILL`` rows per category. The pool is sorted before the
+    seeded shuffle, so one seed reproduces the file byte for byte.
+
+    Args:
+        census: A census from ``build_census``.
+        seed: The draw seed.
+
+    Returns:
+        ``{"rows": [...], "candidate_rows": {<category>: <n>}}``, where every
+        row carries ``id``, ``category``, ``doc``, ``section_start``,
+        ``section_end``, ``commit``, ``section_sha12``, ``candidate``, ``label``
+        and ``labeler``, with both label fields null.
+
+    Raises:
+        ValueError: When a category cannot fill its row budget under the
+            per-skill cap.
+    """
+    rand = random.Random(seed)
+    pool = []
+    for doc in census["docs"]:
+        skill = skill_of(doc["doc"])
+        for section in doc["sections"]:
+            if not (section["flagged"] and section["inBand"]):
+                continue
+            pool.append(
+                {
+                    "doc": doc["doc"],
+                    "skill": skill,
+                    "start": section["start"],
+                    "end": section["end"],
+                    "sha12": section["sha12"],
+                    "candidate": {
+                        category: bool(section["candidate"][category]) for category in CATEGORIES
+                    },
+                }
+            )
+    pool.sort(key=lambda entry: (entry["doc"], entry["start"]))
+    rows = []
+    candidate_rows = {}
+    for category in CATEGORIES:
+        rand.shuffle(pool)
+        picked = []
+        per_skill = {}
+        if category == "synonym-cycling":
+            phases = [(None, ROWS_PER_CATEGORY)]
+        else:
+            phases = [(True, CANDIDATE_ROWS_PER_CATEGORY), (False, ROWS_PER_CATEGORY)]
+        for wanted, limit in phases:
+            taken = 0
+            for entry in pool:
+                if len(picked) == ROWS_PER_CATEGORY or taken == limit:
+                    break
+                if wanted is not None and entry["candidate"][category] != wanted:
+                    continue
+                if per_skill.get(entry["skill"], 0) >= MAX_ROWS_PER_SKILL:
+                    continue
+                per_skill[entry["skill"]] = per_skill.get(entry["skill"], 0) + 1
+                picked.append(entry)
+                taken += 1
+        if len(picked) != ROWS_PER_CATEGORY:
+            raise ValueError(
+                f"draw needs {ROWS_PER_CATEGORY} sections for {category}, "
+                f"found {len(picked)} under the per-skill cap"
+            )
+        candidate_rows[category] = sum(
+            1 for entry in picked if entry["candidate"][category]
+        )
+        for entry in picked:
+            rows.append(
+                {
+                    "id": "",
+                    "category": category,
+                    "doc": entry["doc"],
+                    "section_start": entry["start"],
+                    "section_end": entry["end"],
+                    "commit": census["commit"],
+                    "section_sha12": entry["sha12"],
+                    "candidate": entry["candidate"][category],
+                    "label": None,
+                    "labeler": None,
+                }
+            )
+    for number, row in enumerate(rows, start=1):
+        row["id"] = f"r{number:03d}"
+    return {"rows": rows, "candidate_rows": candidate_rows}
+
+
+# ───────────────────────────────────────────────────────────────
+# 6. ROWS, LABEL GATE AND BASELINES
+# ───────────────────────────────────────────────────────────────
+
+# The one accepted stop while the labels are open: no measurement may start
+# before the operator has answered every drawn row.
+GATE_STOP_LINE = "stop: fewer than 150 labeled rows"
+
+# Two categories passing is the keep rule's floor, so one passable category
+# leaves nothing to beat and the line says so before either backend is asked.
+STOP_CATEGORIES_LINE = "stop: fewer than 2 categories can pass"
+
+
+def read_section(
+    repo_root: str | Path, row: dict, tracked: list[str] | set[str]
+) -> str:
+    """Read one drawn row's section from its recorded commit.
+
+    The frame rule is re-checked here rather than trusted: a document outside
+    ``tracked`` and a dotenv basename are refused before anything is opened,
+    and the section must still hash to the value recorded at draw time, so a
+    document edited since the draw cannot be measured under the old label.
+
+    Args:
+        repo_root: Path of the repository.
+        row: A drawn row naming a doc, a commit and a section range.
+        tracked: Repo-relative tracked paths, from ``tracked_files``.
+
+    Returns:
+        The section's text at the row's commit.
+
+    Raises:
+        ValueError: When the row names a path outside ``tracked``, a dotenv
+            basename, or a section whose hash differs from ``section_sha12``.
+    """
+    doc = str(row["doc"]).replace("\\", "/")
+    basename = doc.rsplit("/", 1)[-1]
+    if basename.startswith(".env"):
+        raise ValueError(f"{row.get('id', '?')}: refusing dotenv path {doc}")
+    if doc not in tracked:
+        raise ValueError(f"{row.get('id', '?')}: refusing untracked path {doc}")
+    lines = read_at_commit(repo_root, row["commit"], doc).splitlines()
+    text = section_text(lines, row["section_start"], row["section_end"])
+    if sha12(text) != row["section_sha12"]:
+        raise ValueError(
+            f"{row.get('id', '?')}: section does not match its recorded hash"
+        )
+    return text
+
+
+def build_rows(repo_root: str | Path, rows: list[dict], phrases: list[str]) -> list[dict]:
+    """Read every drawn row's section and recompute its comparator flag.
+
+    A row that is untracked, a dotenv path or no longer matching its recorded
+    hash is refused: it is never opened, stays in the returned list marked
+    ``refused`` so the refusal is counted, and ``summarize_baseline`` leaves
+    it out. The comparator flag is recomputed from the committed text rather
+    than trusted from the labels file, so an edited file cannot change the
+    rule the baseline is measured against.
+
+    Args:
+        repo_root: Path of the repository.
+        rows: Drawn rows from ``read_jsonl``.
+        phrases: The significance-inflation phrases.
+
+    Returns:
+        One row per drawn row, carrying ``id``, ``category``, ``doc``,
+        ``commit``, ``section_sha12``, ``label``, ``text``, ``candidate`` and
+        ``refused``.
+    """
+    tracked = set(tracked_files(repo_root))
+    built = []
+    for row in rows:
+        entry = {
+            "id": row["id"],
+            "category": row["category"],
+            "doc": row["doc"],
+            "commit": row["commit"],
+            "section_sha12": row["section_sha12"],
+            "label": row["label"],
+            "text": None,
+            "candidate": False,
+            "refused": True,
+        }
+        try:
+            entry["text"] = read_section(repo_root, row, tracked)
+        except ValueError:
+            built.append(entry)
+            continue
+        entry["candidate"] = {
+            "synonym-cycling": False,
+            "significance-inflation": significance_hit(entry["text"], phrases),
+            "false-ranges": false_range_hit(entry["text"]),
+        }[row["category"]]
+        entry["refused"] = False
+        built.append(entry)
+    return built
+
+
+def label_gate(rows: list[dict] | None) -> dict:
+    """Count the operator's labels and judge whether the gate is complete.
+
+    The gate is complete only when the whole sample is present and every row
+    carries one of the operator's two answers; a missing file counts as zero.
+
+    Args:
+        rows: Rows from ``read_jsonl``, or ``None`` when the file is absent.
+
+    Returns:
+        ``{"complete": bool, "labeled": int, "total": int}``.
+    """
+    entries = rows or []
+    labeled = sum(1 for row in entries if row.get("label") in ("yes", "no"))
+    return {
+        "complete": len(entries) == TOTAL_ROWS and labeled == TOTAL_ROWS,
+        "labeled": labeled,
+        "total": TOTAL_ROWS,
+    }
+
+
+def gate_lines(g: dict) -> list[str]:
+    """Format a label gate as its two lines: the count, then the stop line.
+
+    Args:
+        g: A gate from ``label_gate``.
+
+    Returns:
+        The label count line and the gate stop line, in report order.
+    """
+    return [f"labels: labeled={g['labeled']} of {TOTAL_ROWS}", GATE_STOP_LINE]
+
+
+def summarize_baseline(rows: list[dict]) -> dict:
+    """Summarize the two no-call baselines per category over the labeled rows.
+
+    Flag-nothing never flags, which is what the scanner does for these
+    categories; the category's comparator flags the sections it matches. The
+    comparator is chosen only when it is right on strictly more rows, so a tie
+    keeps the cheaper baseline. A refused row is left out of every count.
+
+    Args:
+        rows: In-memory rows from ``build_rows``.
+
+    Returns:
+        ``{"categories": {<category>: {"K", "flagNothingRight",
+        "comparatorRight", "method", "B", "yesShare", "flags"}}}``, where
+        ``flags`` maps every scored row's id to the chosen baseline's flag.
+    """
+    categories = {}
+    for category in CATEGORIES:
+        entries = [
+            row
+            for row in rows
+            if row["category"] == category and not row.get("refused")
+        ]
+        flag_nothing_right = sum(1 for row in entries if row["label"] == "no")
+        comparator_right = sum(
+            1
+            for row in entries
+            if bool(row["candidate"]) == (row["label"] == "yes")
+        )
+        method = "comparator" if comparator_right > flag_nothing_right else "flag-nothing"
+        categories[category] = {
+            "K": len(entries),
+            "flagNothingRight": flag_nothing_right,
+            "comparatorRight": comparator_right,
+            "method": method,
+            "B": comparator_right if method == "comparator" else flag_nothing_right,
+            "yesShare": sum(1 for row in entries if row["label"] == "yes"),
+            "flags": {
+                row["id"]: method == "comparator" and bool(row["candidate"])
+                for row in entries
+            },
+        }
+    return {"categories": categories}
+
+
+def baseline_lines(s: dict) -> list[str]:
+    """Format a baseline summary as its per-category lines.
+
+    Args:
+        s: A summary from ``summarize_baseline``.
+
+    Returns:
+        One ``baseline (<c>):`` line per category, in ``CATEGORIES`` order.
+    """
+    lines = []
+    for category in CATEGORIES:
+        entry = s["categories"][category]
+        lines.append(
+            "baseline ({category}): flag-nothing right={flag_nothing} of {K} "
+            "comparator right={comparator} of {K} chosen={method} B={B} "
+            "yes_share={yes} of {K}".format(
+                category=category,
+                flag_nothing=entry["flagNothingRight"],
+                comparator=entry["comparatorRight"],
+                K=entry["K"],
+                method=entry["method"],
+                B=entry["B"],
+                yes=entry["yesShare"],
+            )
+        )
+    return lines
+
+
+def headroom_lines(s: dict) -> list[str]:
+    """Format how much room the chosen baseline leaves in each category.
+
+    A baseline right on more than nine tenths of a category leaves no
+    headroom, and one wrong on fewer than five rows leaves too little for an
+    exact sign test to reach its bar, so neither category can pass.
+
+    Args:
+        s: A summary from ``summarize_baseline``.
+
+    Returns:
+        One ``headroom (<c>):``, ``no headroom (<c>)`` or
+        ``underpowered (<c>)`` line per category, in ``CATEGORIES`` order.
+    """
+    lines = []
+    for category in CATEGORIES:
+        entry = s["categories"][category]
+        K = entry["K"]
+        B = entry["B"]
+        if 10 * B > 9 * K:
+            lines.append(f"no headroom ({category})")
+        elif K - B < 5:
+            lines.append(f"underpowered ({category})")
+        else:
+            lines.append(f"headroom ({category}): baseline wrong on {K - B} of {K}")
+    return lines
+
+
+def stop_categories(s: dict) -> bool:
+    """Report whether too few categories still have room for a verdict.
+
+    Args:
+        s: A summary from ``summarize_baseline``.
+
+    Returns:
+        True when fewer than two categories can pass, which stops the run
+        before either backend is asked to beat the baseline.
+    """
+    passable = 0
+    for category in CATEGORIES:
+        entry = s["categories"][category]
+        K = entry["K"]
+        B = entry["B"]
+        if 10 * B <= 9 * K and K - B >= 5:
+            passable += 1
+    return passable < 2
+
+
+# ───────────────────────────────────────────────────────────────
+# 7. CALLS AND RECORDS
+# ───────────────────────────────────────────────────────────────
+
+# A child gets a hard cap, so an unresponsive backend cannot hold a run open,
+# and a retry after a refused answer waits before it asks again.
+JEV_TIMEOUT_MS = 90000
+JEV_BACKOFF_MS = 2000
+
+
+def which(name: str, env: dict) -> str | None:
+    """Return the first executable file of this name on the environment's PATH.
+
+    Args:
+        name: Executable file name to look for.
+        env: Environment whose ``PATH`` is searched.
+
+    Returns:
+        The first match, or None when no entry holds an executable file of
+        this name. An empty entry, a directory and a file without an execute
+        bit are all misses.
+    """
+    for entry in env.get("PATH", "").split(os.pathsep):
+        if not entry:
+            continue
+        candidate = Path(entry) / name
+        if candidate.is_file() and os.access(candidate, os.X_OK):
+            return str(candidate)
+    return None
+
+
+def spawn_call(
+    file: str | Path,
+    args: list[str],
+    stdin_text: str,
+    env: dict,
+    timeout_ms: int,
+) -> dict:
+    """Run one bounded child and return its exit, output and wall time.
+
+    The timeout kills the child and returns at the deadline, never waiting for
+    a pipe a grandchild could hold open past the kill. Stdin is written and
+    then closed, because the CLI reads stdin to EOF and would otherwise wait
+    on an inherited terminal. A spawn error reads as exit code 127 with the
+    message as stderr.
+
+    Args:
+        file: Executable to spawn.
+        args: Arguments after the executable.
+        stdin_text: Text written to stdin, then closed.
+        env: Child environment.
+        timeout_ms: Kill and return after this many milliseconds.
+
+    Returns:
+        ``{"code": int | None, "stdout": str, "stderr": str, "wall_ms": int,
+        "timed_out": bool}``. ``code`` is None and ``timed_out`` True when the
+        cap fired.
+    """
+    start = time.monotonic()
+
+    def elapsed_ms() -> int:
+        return int((time.monotonic() - start) * 1000)
+
+    try:
+        child = subprocess.Popen(
+            [str(file), *[str(argument) for argument in args]],
+            stdin=subprocess.PIPE,
+            stdout=subprocess.PIPE,
+            stderr=subprocess.PIPE,
+            env=env,
+            encoding="utf-8",
+            errors="replace",
+        )
+    except OSError as error:
+        return {
+            "code": 127,
+            "stdout": "",
+            "stderr": str(error),
+            "wall_ms": elapsed_ms(),
+            "timed_out": False,
+        }
+
+    try:
+        stdout, stderr = child.communicate(
+            input=stdin_text, timeout=timeout_ms / 1000
+        )
+        return {
+            "code": child.returncode,
+            "stdout": stdout,
+            "stderr": stderr,
+            "wall_ms": elapsed_ms(),
+            "timed_out": False,
+        }
+    except subprocess.TimeoutExpired as timeout:
+        child.kill()
+        child.wait()
+        stdout = timeout.output or ""
+        stderr = timeout.stderr or ""
+        if isinstance(stdout, bytes):
+            stdout = stdout.decode("utf-8", "replace")
+        if isinstance(stderr, bytes):
+            stderr = stderr.decode("utf-8", "replace")
+        return {
+            "code": None,
+            "stdout": stdout,
+            "stderr": stderr,
+            "wall_ms": elapsed_ms(),
+            "timed_out": True,
+        }
+
+
+def create_call_log(out_dir: str | Path | None) -> dict:
+    """Return an append-only writer for one run's call records.
+
+    The file is created empty on the first append, so a killed arm's earlier
+    lines stay readable. A run that records no call creates nothing.
+
+    Args:
+        out_dir: Directory that holds ``calls.jsonl``, or None.
+
+    Returns:
+        A dict whose ``append`` callable writes one compact JSON object per
+        record to ``<out_dir>/calls.jsonl``.
+    """
+    state = {"created": False}
+
+    def append(record: dict) -> None:
+        if out_dir is None or str(out_dir) == "":
+            return
+        directory = Path(out_dir)
+        path = directory / "calls.jsonl"
+        if not state["created"]:
+            directory.mkdir(parents=True, exist_ok=True)
+            path.write_text("", encoding="utf-8")
+            state["created"] = True
+        with path.open("a", encoding="utf-8") as handle:
+            handle.write(json.dumps(record, separators=(",", ":")) + "\n")
+
+    return {"append": append}
+
+
+def read_stored_report(out_dir: str | Path | None) -> dict | None:
+    """Return the report an earlier run wrote into this directory.
+
+    Args:
+        out_dir: Directory that may hold ``report.json``, or None.
+
+    Returns:
+        The parsed body, or None when no directory is named, the file is
+        missing, or its text does not parse; a requalify comparison treats all
+        of those as "nothing stored".
+    """
+    if out_dir is None or str(out_dir) == "":
+        return None
+    try:
+        return json.loads((Path(out_dir) / "report.json").read_text(encoding="utf-8"))
+    except (OSError, ValueError):
+        return None
+
+
+# ───────────────────────────────────────────────────────────────
+# 8. DEEM ARM
+# ───────────────────────────────────────────────────────────────
+
+# A served Deem repeats itself exactly, so a result stands on the commit pair
+# it was measured against, never on a rerun; the health check reads that pair
+# before any row is asked and every record keeps it.
+DEEM_MODEL = "deem-0.8-v1"
+# A ``noul`` probability at or above this counts as a flag.
+FLAG_AT = 0.5
+DEEM_P50_MS = 60.5
+HEALTH_TIMEOUT_MS = 2000
+
+# The client checkout beside the classifier skill, used when nothing of that
+# name is installed on PATH; the interpreter running this script runs it.
+REPO_CLI_DEEM = SCRIPT_DIR.parents[3] / "cli-classifier" / "cli-deem" / "scripts" / "cli-deem.mjs"
+
+
+def deem_command(env: dict) -> list[str]:
+    """Resolve the command that runs one Deem call.
+
+    The installed client wins so an operator's own copy is measured, and the
+    checkout beside the classifier skill is the fallback.
+
+    Args:
+        env: Environment whose ``PATH`` is searched.
+
+    Returns:
+        The command and its leading arguments, without the subcommand.
+    """
+    on_path = which("cli-deem", env)
+    if on_path is not None:
+        return [on_path]
+    return [sys.executable, str(REPO_CLI_DEEM)]
+
+
+def read_deem_health(cmd: list[str], env: dict) -> dict:
+    """Run one health check and name why a failed check cannot be measured.
+
+    A client that does not answer inside ``HEALTH_TIMEOUT_MS``, a missing
+    binary and a server that reports itself gone are one reason: nothing is
+    listening. A stub backend, a model other than ``DEEM_MODEL`` and an
+    unreadable body are named on their own, so the skip line says what was
+    found rather than a generic failure.
+
+    Args:
+        cmd: Command from ``deem_command``.
+        env: Environment for the call.
+
+    Returns:
+        ``{"ok": True, "backend", "model", "modelCommit", "sourceCommit"}``
+        on a healthy answer, else ``{"ok": False, "reason", "found"}``.
+    """
+    result = spawn_call(cmd[0], [*cmd[1:], "health"], "", env, HEALTH_TIMEOUT_MS)
+    error_text = result["stderr"].strip()
+    try:
+        parsed_error = json.loads(error_text)
+    except json.JSONDecodeError:
+        parsed_error = None
+    if isinstance(parsed_error, dict) and "error" in parsed_error:
+        error_text = parsed_error["error"]
+    if result["timed_out"] or result["code"] in (4, 127):
+        return {"ok": False, "reason": "not reachable", "found": error_text}
+    if result["code"] == 3:
+        reason = "bad health response"
+        if isinstance(error_text, str) and "stub" in error_text:
+            reason = "stub backend"
+        elif isinstance(error_text, str) and "refused model" in error_text:
+            reason = "model"
+        return {"ok": False, "reason": reason, "found": error_text}
+    if result["code"] == 0:
+        text = result["stdout"].strip()
+        try:
+            body = json.loads(text)
+        except json.JSONDecodeError:
+            body = None
+        if not isinstance(body, dict):
+            return {"ok": False, "reason": "bad health response", "found": text}
+        backend = body.get("backend")
+        if isinstance(backend, str) and "stub" in backend:
+            return {"ok": False, "reason": "stub backend", "found": backend}
+        if not (
+            backend == "torch"
+            or (isinstance(backend, str) and backend.startswith("ensemble:"))
+        ):
+            return {"ok": False, "reason": "bad health response", "found": str(backend)}
+        model = body.get("model")
+        if model != DEEM_MODEL:
+            return {"ok": False, "reason": "model", "found": str(model)}
+        model_commit = body.get("model_commit")
+        source_commit = body.get("source_commit")
+        if (
+            body.get("ok") is not True
+            or not isinstance(model_commit, str)
+            or model_commit == ""
+            or not isinstance(source_commit, str)
+            or source_commit == ""
+        ):
+            return {"ok": False, "reason": "bad health response", "found": text}
+        return {
+            "ok": True,
+            "backend": backend,
+            "model": model,
+            "modelCommit": model_commit,
+            "sourceCommit": source_commit,
+        }
+    return {
+        "ok": False,
+        "reason": "bad health response",
+        "found": f"exit {result['code']}: {error_text}",
+    }
+
+
+def deem_gate(ctx: dict) -> dict:
+    """Run the health check and print the line a passer or skipper earns.
+
+    The gate starts no server and passes no key: the local client answers for
+    itself, and a skip leaves the rest of the run untouched.
+
+    Args:
+        ctx: ``{"out": <line writer>, "env": <environment>}``.
+
+    Returns:
+        ``{"passed": True, "cmd", "backend", "model", "modelCommit",
+        "sourceCommit"}`` when the check passed; else ``{"passed": False,
+        "cmd", "reason"}`` with the skip line already printed. A ``model`` or
+        ``bad health response`` failure adds a line naming what was found.
+    """
+    cmd = deem_command(ctx["env"])
+    health = read_deem_health(cmd, ctx["env"])
+    if health["ok"]:
+        ctx["out"](
+            f"deem: health backend={health['backend']} model={health['model']} "
+            f"model_commit={health['modelCommit']} source_commit={health['sourceCommit']}"
+        )
+        return {"passed": True, "cmd": cmd, **health}
+    skip_line = f"deem arm skipped: {health['reason']}"
+    ctx["out"](skip_line)
+    if health["reason"] in ("model", "bad health response"):
+        ctx["out"](f"deem: found={json.dumps(health['found'])}")
+    return {"passed": False, "cmd": cmd, "reason": skip_line}
+
+
+def run_deem_arm(plan: dict, gate: dict, ctx: dict) -> dict:
+    """Ask the local Deem model once per drawn row and print its column.
+
+    One ``noul`` call per row carries the row's own question, and stdin is
+    closed after the write, because the client reads it to EOF. Exit 4 gets
+    one retry behind a fresh health check, because a dropped connection is
+    not a judgment; any other refusing exit stops the arm with the rows that
+    finished and prints no column. Every spawn gets one ``calls.jsonl``
+    record naming the commit pair it ran against.
+
+    Args:
+        plan: ``{"rows": [...], "baseline": ..., "phrases": ...}``; each
+            row carries ``id``, ``category``, ``label``, ``text`` and
+            ``question``.
+        gate: A passing ``deem_gate`` result.
+        ctx: ``{"out", "env", "timeoutMs", "callLog", "stored"}``;
+            ``stored`` is an earlier run's report, read only to compare the
+            pair.
+
+    Returns:
+        ``{"stopped": <line>, "partialRows": <n>}`` on a stop, else the
+        column summary and the requalify line when a stored pair differs.
+    """
+    rows = plan["rows"]
+    ctx["out"](
+        f"deem: nothing leaves the machine; planned calls: {len(rows)}; "
+        f"estimated wall time: {len(rows) * DEEM_P50_MS / 1000:.1f} s at "
+        f"{DEEM_P50_MS} ms per call, the noul p50 from deem-local.md"
+    )
+    probs = {}
+    finished = 0
+
+    def record(row: dict, attempt: int, result: dict, probability, status: str) -> dict:
+        return {
+            "backend": "deem",
+            "kind": "noul",
+            "rowId": row["id"],
+            "category": row["category"],
+            "rerun": 0,
+            "attempt": attempt,
+            "wallMs": result["wall_ms"],
+            "exitCode": result["code"],
+            "probability": probability,
+            "flag": None if probability is None else probability >= FLAG_AT,
+            "status": status,
+            "modelId": gate["model"],
+            "modelCommit": gate["modelCommit"],
+            "sourceCommit": gate["sourceCommit"],
+        }
+
+    def stop(line: str) -> dict:
+        ctx["out"](line)
+        ctx["out"](f"deem: partial rows={finished}")
+        return {"stopped": line, "partialRows": finished}
+
+    for row in rows:
+        call_args = [*gate["cmd"][1:], "noul", "-q", row["question"]]
+        attempt = 1
+        result = spawn_call(
+            gate["cmd"][0], call_args, row["text"], ctx["env"], ctx["timeoutMs"]
+        )
+        if not result["timed_out"] and result["code"] == 4:
+            ctx["callLog"]["append"](record(row, attempt, result, None, "unmeasured"))
+            health = read_deem_health(gate["cmd"], ctx["env"])
+            if not health["ok"]:
+                return stop("deem arm stopped: server gone")
+            if (
+                health["modelCommit"] != gate["modelCommit"]
+                or health["sourceCommit"] != gate["sourceCommit"]
+            ):
+                return stop("deem arm stopped: model commit changed mid-run")
+            attempt = 2
+            result = spawn_call(
+                gate["cmd"][0], call_args, row["text"], ctx["env"], ctx["timeoutMs"]
+            )
+        probability = None
+        status = "unmeasured"
+        stop_line = None
+        if result["timed_out"]:
+            status = "unmeasured_timeout"
+        elif result["code"] == 0:
+            try:
+                parsed = json.loads(result["stdout"])
+            except json.JSONDecodeError:
+                parsed = None
+            answer = None
+            if isinstance(parsed, dict):
+                answer = parsed.get("answers", {}).get("answer", {}).get("noul")
+            if (
+                isinstance(answer, (int, float))
+                and not isinstance(answer, bool)
+                and 0 <= answer <= 1
+            ):
+                probability = float(answer)
+                status = "measured"
+        elif result["code"] == 2:
+            stop_line = "deem arm stopped: usage error"
+        elif result["code"] == 3:
+            stop_line = "deem arm stopped: backend refused"
+        elif result["code"] == 130:
+            stop_line = "deem arm stopped: interrupted"
+        ctx["callLog"]["append"](record(row, attempt, result, probability, status))
+        if stop_line is not None:
+            return stop(stop_line)
+        probs[row["id"]] = [probability]
+        finished += 1
+
+    column = summarize_column("deem", rows, probs, plan["baseline"], plan["phrases"])
+    ctx["out"](column["detail"])
+    for category in CATEGORIES:
+        entry = column["categories"][category]
+        ctx["out"](
+            f"category {category}: {entry['outcome']} K={entry['K']} "
+            f"M={entry['M']} A={entry['A']} B={entry['B']} W={entry['W']} "
+            f"L={entry['L']} TP={entry['TP']} FP={entry['FP']} F={entry['F']} "
+            f"p={entry['p']}"
+        )
+    for category in CATEGORIES:
+        brier = column["categories"][category]["brier"]
+        shown = "none" if brier is None else f"{brier:.4f}"
+        ctx["out"](f"brier ({category}): {shown}")
+    ctx["out"]("flips: not applicable (deem noul)")
+    stored = ((ctx.get("stored") or {}).get("columns") or {}).get("deem")
+    requalify = None
+    if stored is not None and (
+        stored.get("modelCommit") != gate["modelCommit"]
+        or stored.get("sourceCommit") != gate["sourceCommit"]
+    ):
+        requalify = "requalify: model commit changed"
+        ctx["out"](requalify)
+    ctx["out"](column["line"])
+    return {"column": column, "requalify": requalify}
+
+
+# ───────────────────────────────────────────────────────────────
+# 9. JEV ARM
+# ───────────────────────────────────────────────────────────────
+
+# The gate pins one version: the answer shape, the exit classes and the
+# provider flag are read from that build, so any other build is unmeasured
+# until its contract is read again rather than trusted to behave the same.
+JEV_VERSION = "jev 0.6.2"
+# Three fresh calls per row, each a measurement of its own: the CLI keeps no
+# cache, so a flaky answer shows up in the flip count instead of hiding under
+# a rerun.
+JEV_RERUNS = 3
+
+
+def jev_gate(ctx: dict) -> dict:
+    """Print the identity line, then check the pinned version and a credential.
+
+    The provider comes from ``JEV_PROVIDER`` and falls back to ``official``.
+    The identity line is printed before any check, so a skip still says which
+    path and provider were tried. The script reads and passes no key: the CLI
+    resolves its own credential, and a refused check is a skip, not a prompt.
+
+    Args:
+        ctx: ``{"out": <line writer>, "env": <environment>}``; an optional
+            ``timeoutMs`` caps each check.
+
+    Returns:
+        ``{"passed": True, "path", "provider"}`` when both checks pass; else
+        ``{"passed": False, "path", "provider", "reason"}`` with the skip line
+        already printed. A wrong version adds a line naming what was found.
+    """
+    provider = ctx["env"].get("JEV_PROVIDER") or "official"
+    path = which("jev", ctx["env"])
+    ctx["out"](f"jev: path={path if path is not None else 'none'} provider={provider}")
+    if path is None:
+        reason = "jev arm skipped: jev not on PATH"
+        ctx["out"](reason)
+        return {"passed": False, "path": None, "provider": provider, "reason": reason}
+
+    timeout_ms = ctx.get("timeoutMs") or JEV_TIMEOUT_MS
+    version = spawn_call(path, ["--version"], "", ctx["env"], timeout_ms)
+    trimmed = version["stdout"].strip()
+    found = trimmed.splitlines()[0] if trimmed else ""
+    if found != JEV_VERSION:
+        reason = "jev arm skipped: version"
+        ctx["out"](reason)
+        ctx["out"](f"jev: found={json.dumps(found)} path={path}")
+        return {"passed": False, "path": path, "provider": provider, "reason": reason}
+
+    auth = spawn_call(
+        path, ["auth", "status", "--provider", provider], "", ctx["env"], timeout_ms
+    )
+    if auth["code"] != 0:
+        reason = "jev arm skipped: no credential"
+        ctx["out"](reason)
+        return {"passed": False, "path": path, "provider": provider, "reason": reason}
+
+    return {"passed": True, "path": path, "provider": provider}
+
+
+def run_jev_arm(plan: dict, gate: dict, ctx: dict) -> dict:
+    """Ask the Jev CLI for one column over the drawn rows and print it.
+
+    One ``auth test`` names the model, then every row gets ``JEV_RERUNS``
+    fresh ``noul`` calls, each carrying the provider so the identity cannot
+    drift mid-run. The calls share no cache, so a row's probability is the
+    mean of its reruns and a flaky answer shows up in the flip count. Exit 4
+    gets one retry behind a backoff, because a dropped connection is not a
+    judgment; any other refusing exit stops the arm with the rows that
+    finished and prints no column. Every spawn gets one ``calls.jsonl``
+    record.
+
+    Args:
+        plan: ``{"rows": [...], "baseline": ..., "phrases": ...}``; each row
+            carries ``id``, ``category``, ``label``, ``text`` and ``question``.
+        gate: A passing ``jev_gate`` result.
+        ctx: ``{"out", "env", "timeoutMs", "backoffMs", "callLog", "stored"}``;
+            ``stored`` is an earlier run's report, read only to compare the
+            identity.
+
+    Returns:
+        ``{"stopped": <line>, "partialRows": <n>}`` on a stop, else the
+        column summary and the requalify line when a stored identity differs.
+    """
+    rows = plan["rows"]
+    chars = sum(
+        len(row["text"]) + len(row.get("question", "")) for row in rows
+    ) * JEV_RERUNS
+    ctx["out"](
+        f"jev: payload: sections of tracked committed skill docs; planned calls: "
+        f"{JEV_RERUNS * len(rows) + 1}; estimated input tokens: {(chars + 3) // 4}"
+    )
+    probs = {}
+    finished = 0
+
+    def stop(line: str) -> dict:
+        ctx["out"](line)
+        ctx["out"](f"jev: partial rows={finished}")
+        return {"stopped": line, "partialRows": finished}
+
+    timeout_ms = ctx.get("timeoutMs") or JEV_TIMEOUT_MS
+    backoff_ms = ctx.get("backoffMs") or JEV_BACKOFF_MS
+    auth = spawn_call(
+        gate["path"],
+        ["auth", "test", "--provider", gate["provider"]],
+        "",
+        ctx["env"],
+        timeout_ms,
+    )
+    model = "unknown"
+    if auth["code"] == 0:
+        try:
+            parsed = json.loads(auth["stdout"])
+        except json.JSONDecodeError:
+            parsed = None
+        if isinstance(parsed, dict) and isinstance(parsed.get("model"), str):
+            model = parsed["model"]
+    ctx["callLog"]["append"](
+        {
+            "backend": "jev",
+            "kind": "auth_test",
+            "rowId": None,
+            "category": None,
+            "rerun": None,
+            "attempt": 1,
+            "wallMs": auth["wall_ms"],
+            "exitCode": auth["code"],
+            "probability": None,
+            "flag": None,
+            "status": "measured" if auth["code"] == 0 else "unmeasured",
+            "jevVersion": JEV_VERSION,
+            "provider": gate["provider"],
+            "model": model,
+        }
+    )
+    if auth["code"] != 0:
+        if auth["code"] == 3:
+            return stop("jev arm stopped: key rejected")
+        if auth["code"] == 130:
+            return stop("jev arm stopped: interrupted")
+        return stop("jev arm stopped: auth test failed")
+    ctx["out"](f"jev: auth test provider={gate['provider']} model={model}")
+
+    def record(row: dict, rerun: int, attempt: int, result: dict, probability, status: str) -> dict:
+        return {
+            "backend": "jev",
+            "kind": "noul",
+            "rowId": row["id"],
+            "category": row["category"],
+            "rerun": rerun,
+            "attempt": attempt,
+            "wallMs": result["wall_ms"],
+            "exitCode": result["code"],
+            "probability": probability,
+            "flag": None if probability is None else probability >= FLAG_AT,
+            "status": status,
+            "jevVersion": JEV_VERSION,
+            "provider": gate["provider"],
+            "model": model,
+        }
+
+    for row in rows:
+        call_args = ["noul", "--provider", gate["provider"], "-q", row["question"]]
+        answers = []
+        for rerun in range(JEV_RERUNS):
+            attempt = 1
+            result = spawn_call(gate["path"], call_args, row["text"], ctx["env"], timeout_ms)
+            if not result["timed_out"] and result["code"] == 4:
+                ctx["callLog"]["append"](record(row, rerun, attempt, result, None, "unmeasured"))
+                time.sleep(backoff_ms / 1000)
+                attempt = 2
+                result = spawn_call(gate["path"], call_args, row["text"], ctx["env"], timeout_ms)
+            probability = None
+            status = "unmeasured"
+            stop_line = None
+            if result["timed_out"]:
+                status = "unmeasured_timeout"
+            elif result["code"] == 0:
+                try:
+                    parsed = json.loads(result["stdout"])
+                except json.JSONDecodeError:
+                    parsed = None
+                answer = None
+                if isinstance(parsed, dict):
+                    answer = parsed.get("answers", {}).get("answer", {}).get("noul")
+                if (
+                    isinstance(answer, (int, float))
+                    and not isinstance(answer, bool)
+                    and 0 <= answer <= 1
+                ):
+                    probability = float(answer)
+                    status = "measured"
+            elif result["code"] == 2:
+                stop_line = "jev arm stopped: usage error"
+            elif result["code"] == 3:
+                stop_line = "jev arm stopped: key rejected"
+            elif result["code"] == 130:
+                stop_line = "jev arm stopped: interrupted"
+            ctx["callLog"]["append"](record(row, rerun, attempt, result, probability, status))
+            if stop_line is not None:
+                return stop(stop_line)
+            answers.append(probability)
+        probs[row["id"]] = answers
+        finished += 1
+
+    column = summarize_column("jev", rows, probs, plan["baseline"], plan["phrases"])
+    ctx["out"](column["detail"])
+    for category in CATEGORIES:
+        entry = column["categories"][category]
+        ctx["out"](
+            f"category {category}: {entry['outcome']} K={entry['K']} "
+            f"M={entry['M']} A={entry['A']} B={entry['B']} W={entry['W']} "
+            f"L={entry['L']} TP={entry['TP']} FP={entry['FP']} F={entry['F']} "
+            f"p={entry['p']}"
+        )
+    for category in CATEGORIES:
+        brier = column["categories"][category]["brier"]
+        shown = "none" if brier is None else f"{brier:.4f}"
+        ctx["out"](f"brier ({category}): {shown}")
+    ctx["out"](
+        f"flips: F={column['totals']['F']} of {JEV_RERUNS * column['totals']['M']} calls"
+    )
+    stored = ((ctx.get("stored") or {}).get("columns") or {}).get("jev")
+    requalify = None
+    if stored is not None and (
+        stored.get("provider") != gate["provider"] or stored.get("model") != model
+    ):
+        requalify = "requalify: model changed"
+        ctx["out"](requalify)
+    ctx["out"](column["line"])
+    return {"column": column, "requalify": requalify}
+
+
+# ───────────────────────────────────────────────────────────────
+# 10. VERDICT
+# ───────────────────────────────────────────────────────────────
+
+# The three fixed instructions, one per category, printed verbatim with their
+# digests before any row is asked, so a report can be checked against the text
+# a model was actually given.
+QUESTIONS = {
+    "synonym-cycling": (
+        "Does this passage refer to the same thing by three or more different words?"
+    ),
+    "significance-inflation": (
+        "Does this passage declare that something is important or historic instead of "
+        "stating what happened?"
+    ),
+    "false-ranges": (
+        "Does this passage use a from X to Y construction whose endpoints are not on a "
+        "meaningful scale?"
+    ),
+}
+
+# The margin is fixed before any call: a backend has to beat its baseline by at
+# least a tenth of the measured rows, and the line that names every threshold
+# prints before the first row is asked.
+MARGIN = 0.10
+MARGIN_LINE = "margin: 0.10"
+KEEP_RULE_LINE = (
+    "keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, "
+    "precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, "
+    "sign test p < 0.05, flips 10*F <= 3*M (jev only), keep at two categories passing"
+)
+
+
+def question_lines() -> list[str]:
+    """Format the three fixed questions as their preamble lines.
+
+    Each line carries the question's SHA-256 beside its text, so a report
+    records the exact instruction a backend was asked, not just its name.
+
+    Returns:
+        One ``question <c> sha256=<64hex>: <text>`` line per ``CATEGORIES`` entry.
+    """
+    return [
+        f"question {category} sha256={sha256(QUESTIONS[category])}: {QUESTIONS[category]}"
+        for category in CATEGORIES
+    ]
+
+
+def sign_test_p(wins: int, losses: int) -> dict:
+    """Compute the exact one-sided sign test over backend-only wins and losses.
+
+    The tail sums the binomial coefficients from ``wins`` to ``wins + losses``
+    over ``2 ** n`` fair trials, and the 0.05 bar is tested on the integers
+    themselves, so no float rounding can decide a verdict. No disagreements
+    give p 1.
+
+    Args:
+        wins: Rows only the backend got right.
+        losses: Rows only the baseline got right.
+
+    Returns:
+        ``{"p": <float>, "below": <bool>}``, where ``below`` is the exact
+        ``p < 0.05`` answer.
+    """
+    n = wins + losses
+    if n == 0:
+        return {"p": 1, "below": False}
+    num = sum(math.comb(n, i) for i in range(wins, n + 1))
+    den = 1 << n
+    return {"p": num / den, "below": 20 * num < den}
+
+
+def _category_condition(entry: dict, backend: str) -> str | None:
+    """Name the first per-category keep-rule condition an entry fails.
+
+    The five conditions run in the order the printed line names them: the
+    zero-call refusal, precision, margin, the sign test and, for Jev only,
+    stability. ``None`` means every condition passed.
+
+    Args:
+        entry: One category's counts, as ``decide_verdict`` receives them.
+        backend: ``jev`` or ``deem``.
+
+    Returns:
+        The failing condition's name, or None when the category passes.
+    """
+    if entry.get("headroom"):
+        return entry["headroom"]
+    flags = entry["TP"] + entry["FP"]
+    if not (flags >= 1 and 5 * entry["TP"] >= 4 * flags):
+        return "precision"
+    if not (10 * (entry["A"] - entry["B"]) >= entry["M"]):
+        return "margin"
+    if not sign_test_p(entry["W"], entry["L"])["below"]:
+        return "sign test"
+    if backend == "jev" and not (10 * entry["F"] <= 3 * entry["M"]):
+        return "flips"
+    return None
+
+
+def decide_verdict(counts: dict, backend: str) -> dict:
+    """Decide one column's verdict from its per-category counts.
+
+    The keep rule runs in its own order: the coverage check over every
+    category first, then the kill clause, and only then each category's own
+    conditions. A column that fails coverage stops, a column whose precision
+    is below the bar in every category kills, and a column that leaves fewer
+    than two categories passing stops without a keep.
+
+    Args:
+        counts: ``{<category>: <counts>}``, each entry carrying ``K``, ``M``,
+            ``A``, ``B``, ``W``, ``L``, ``TP``, ``FP``, ``F`` and an optional
+            ``headroom`` naming the zero-call refusal.
+        backend: ``jev`` or ``deem``.
+
+    Returns:
+        ``{"outcome": "keep"|"kill"|"stop", "reason": <str|None>,
+        "p": <float>}``, where ``p`` is the sign test over the column's wins
+        and losses.
+    """
+    entries = list(counts.values())
+    sign = sign_test_p(
+        sum(entry["W"] for entry in entries),
+        sum(entry["L"] for entry in entries),
+    )
+    if not all(10 * entry["M"] >= 9 * entry["K"] for entry in entries):
+        return {"outcome": "stop", "reason": "coverage", "p": sign["p"]}
+    if all(
+        entry["TP"] + entry["FP"] == 0
+        or 5 * entry["TP"] < 3 * (entry["TP"] + entry["FP"])
+        for entry in entries
+    ):
+        return {"outcome": "kill", "reason": "precision", "p": sign["p"]}
+    passing = sum(1 for entry in entries if _category_condition(entry, backend) is None)
+    if passing >= 2:
+        return {"outcome": "keep", "reason": None, "p": sign["p"]}
+    return {"outcome": "stop", "reason": "categories", "p": sign["p"]}
+
+
+def verdict_text(v: dict) -> str:
+    """Render a verdict as its report words.
+
+    Args:
+        v: A verdict from ``decide_verdict``.
+
+    Returns:
+        ``keep``, ``kill (precision)`` or ``stop (<reason>)``.
+    """
+    if v["outcome"] == "keep":
+        return "keep"
+    if v["outcome"] == "kill":
+        return "kill (precision)"
+    return f"stop ({v['reason']})"
+
+
+def summarize_column(
+    backend: str, rows: list[dict], probs: dict, baseline: dict, phrases: list[str]
+) -> dict:
+    """Score one backend's column from the calls it made.
+
+    A row is measured only when every expected call returned a probability in
+    [0, 1], so a timeout or an empty answer leaves the row out of M instead of
+    counting as a no. Its flag is the modal call flag (``2 * yes > calls``),
+    TP and FP read that flag against the label, and F counts the calls that
+    disagreed with the modal flag. Each category is tested against its own
+    baseline flags and carries the first condition it fails. Brier is per
+    category over measured rows, with a Jev row's probability the mean of its
+    reruns; it is reported and never decides.
+
+    Args:
+        backend: ``jev`` or ``deem``.
+        rows: Plan rows, each carrying ``id``, ``category``, ``label`` and
+            ``text``.
+        probs: ``{<row id>: [<probability or None>, ...]}``, one entry per
+            call the backend was expected to make for that row.
+        baseline: A summary from ``summarize_baseline``; its flags say which
+            measured rows the baseline got right.
+        phrases: The significance-inflation phrases, kept so every plan shares
+            one signature; the built rows already carry their candidate flags.
+
+    Returns:
+        The column summary: the counts ``K``, ``M``, ``A``, ``B``, ``W``,
+        ``L``, ``TP``, ``FP``, ``F`` and ``p``, the column's ``outcome`` and
+        ``reason``, a ``categories`` entry per category (the same counts plus
+        ``outcome``, ``condition``, ``brier``, ``candidate`` and
+        ``yesShare``), ``totals``, the verdict ``line`` and the ``detail``
+        line. The detail's latency fields read ``none``: this summary sees
+        probabilities, and the wall times live in the run's call records.
+    """
+    expected = JEV_RERUNS if backend == "jev" else 1
+    categories = {}
+    totals = {
+        "K": 0, "M": 0, "A": 0, "B": 0, "W": 0, "L": 0, "TP": 0, "FP": 0, "F": 0,
+    }
+    baseline_categories = baseline.get("categories") or {}
+    headroom_source = {
+        category: baseline_categories.get(category) or {"K": 0, "B": 0}
+        for category in CATEGORIES
+    }
+    headroom_by_category = dict(
+        zip(CATEGORIES, headroom_lines({"categories": headroom_source}))
+    )
+    for category in CATEGORIES:
+        entries = [row for row in rows if row["category"] == category]
+        base = baseline_categories.get(category) or {"K": 0, "B": 0}
+        flags = base.get("flags") or {}
+        headroom_line = headroom_by_category[category]
+        entry = {
+            "K": len(entries),
+            "M": 0,
+            "A": 0,
+            "B": 0,
+            "W": 0,
+            "L": 0,
+            "TP": 0,
+            "FP": 0,
+            "F": 0,
+            "headroom": (
+                None
+                if headroom_line.startswith("headroom")
+                else headroom_line.split(" (", 1)[0]
+            ),
+            "brier": None,
+            "candidate": sum(1 for row in entries if row.get("candidate")),
+            "yesShare": sum(1 for row in entries if row.get("label") == "yes"),
+        }
+        brier_sum = 0.0
+        for row in entries:
+            answers = probs.get(row["id"])
+            if not isinstance(answers, list) or len(answers) != expected:
+                continue
+            if not all(
+                isinstance(value, (int, float))
+                and not isinstance(value, bool)
+                and 0 <= value <= 1
+                for value in answers
+            ):
+                continue
+            entry["M"] += 1
+            yes_count = sum(1 for value in answers if value >= FLAG_AT)
+            flag = 2 * yes_count > len(answers)
+            entry["F"] += len(answers) - (yes_count if flag else len(answers) - yes_count)
+            label_yes = row.get("label") == "yes"
+            right = flag == label_yes
+            base_right = bool(flags.get(row["id"])) == label_yes
+            if right:
+                entry["A"] += 1
+            if base_right:
+                entry["B"] += 1
+            if right and not base_right:
+                entry["W"] += 1
+            if base_right and not right:
+                entry["L"] += 1
+            if flag:
+                if label_yes:
+                    entry["TP"] += 1
+                else:
+                    entry["FP"] += 1
+            brier_sum += ((sum(answers) / len(answers)) - (1.0 if label_yes else 0.0)) ** 2
+        entry["brier"] = brier_sum / entry["M"] if entry["M"] else None
+        entry["p"] = sign_test_p(entry["W"], entry["L"])["p"]
+        entry["condition"] = _category_condition(entry, backend)
+        entry["outcome"] = entry["condition"] or "pass"
+        categories[category] = entry
+        for key in totals:
+            totals[key] += entry[key]
+    verdict = decide_verdict(categories, backend)
+    totals["p"] = verdict["p"]
+    line = (
+        f"verdict {backend}: {verdict_text(verdict)} K={totals['K']} "
+        f"M={totals['M']} A={totals['A']} B={totals['B']} W={totals['W']} "
+        f"L={totals['L']} TP={totals['TP']} FP={totals['FP']} F={totals['F']} "
+        f"p={totals['p']:.4g}"
+    )
+    detail = (
+        f"column {backend}: measured={totals['M']} of {totals['K']} "
+        "p50=none p95=none"
+    )
+    return {
+        "backend": backend,
+        "K": totals["K"],
+        "M": totals["M"],
+        "A": totals["A"],
+        "B": totals["B"],
+        "W": totals["W"],
+        "L": totals["L"],
+        "TP": totals["TP"],
+        "FP": totals["FP"],
+        "F": totals["F"],
+        "p": totals["p"],
+        "outcome": verdict["outcome"],
+        "reason": verdict["reason"],
+        "categories": categories,
+        "totals": totals,
+        "line": line,
+        "detail": detail,
+    }
+
+
+def build_report(input: dict) -> dict:
+    """Lay out one run's report body for ``report.json``.
+
+    Args:
+        input: The run's pieces: ``commit``, ``questions``, ``margin``,
+            ``keepRule``, the ``baseline`` summary, the per-category
+            ``headroom`` lines, the ``columns`` that ran, the ``skipped`` and
+            ``stopped`` arms, the ``requalify`` lines and whether the
+            categories stop fired.
+
+    Returns:
+        The report body: the run's identity, the frame and baseline facts,
+        then one column per backend that ran, with its counts, its categories
+        and its own identity fields.
+    """
+    baseline = input.get("baseline") or {}
+    report = {
+        "commit": input["commit"],
+        "questions": input["questions"],
+        "margin": input["margin"],
+        "keepRule": input["keepRule"],
+        "baseline": {"categories": {}},
+        "headroom": input.get("headroom") or {},
+        "columns": {},
+        "skipped": input.get("skipped") or {},
+        "stopped": input.get("stopped") or {},
+        "requalify": input.get("requalify") or {},
+        "categoriesStopped": bool(input.get("categoriesStopped")),
+    }
+    for category in CATEGORIES:
+        entry = (baseline.get("categories") or {}).get(category) or {}
+        report["baseline"]["categories"][category] = {
+            "K": entry.get("K", 0),
+            "flagNothingRight": entry.get("flagNothingRight", 0),
+            "comparatorRight": entry.get("comparatorRight", 0),
+            "method": entry.get("method"),
+            "B": entry.get("B", 0),
+            "yesShare": entry.get("yesShare", 0),
+        }
+    for backend, column in (input.get("columns") or {}).items():
+        entry = {
+            "verdict": column["outcome"],
+            "reason": column["reason"],
+            "line": column["line"],
+            "totals": column["totals"],
+            "categories": {},
+        }
+        for category in CATEGORIES:
+            counts = column["categories"][category]
+            entry["categories"][category] = {
+                "K": counts["K"],
+                "M": counts["M"],
+                "A": counts["A"],
+                "B": counts["B"],
+                "W": counts["W"],
+                "L": counts["L"],
+                "TP": counts["TP"],
+                "FP": counts["FP"],
+                "F": counts["F"],
+                "p": counts["p"],
+                "outcome": counts["outcome"],
+                "condition": counts["condition"],
+                "brier": counts["brier"],
+                "candidate": counts["candidate"],
+                "yesShare": counts["yesShare"],
+            }
+        entry.update(column.get("identity") or {})
+        report["columns"][backend] = entry
+    return report
+
+
+# ───────────────────────────────────────────────────────────────
+# 11. RUN
+# ───────────────────────────────────────────────────────────────
+
+
+def main(argv: list[str] | None = None, deps: dict | None = None) -> int:
+    """Run the lens and return its exit code.
+
+    Args:
+        argv: Command-line arguments; the process arguments when omitted.
+        deps: Optional overrides for the repository root, the scanner path,
+            the output and error writers, the spawn environment and the
+            call timeouts.
+
+    Returns:
+        0 when the run printed its lines, 2 on an invocation, an input or a
+        rule list the run refuses.
+    """
+    deps = deps or {}
+    out = deps.get("out") or print
+    err = deps.get("err") or (lambda line: print(line, file=sys.stderr))
+    parser = argparse.ArgumentParser(
+        description="Measure reader-needed voice tells over committed skill docs."
+    )
+    parser.add_argument("--draw", action="store_true", help="draw the unlabeled labels sample")
+    parser.add_argument("--seed", help="the draw seed, a non-negative integer")
+    parser.add_argument("--labels", help="path of the labels file")
+    parser.add_argument("--jev", action="store_true", help="measure the Jev backend")
+    parser.add_argument("--deem", action="store_true", help="measure the Deem backend")
+    parser.add_argument("--out", help="directory that holds report.json and calls.jsonl")
+    try:
+        values = parser.parse_args(argv)
+    except SystemExit as stop:
+        return int(stop.code) if isinstance(stop.code, int) else 2
+    if (values.jev or values.deem) and not values.out:
+        err("--jev and --deem need --out <dir> so every call is recorded")
+        return 2
+    repo_root = deps.get("repo_root") or DEFAULT_REPO_ROOT
+    scanner = deps.get("scanner") or SCANNER
+    env = deps.get("env") or dict(os.environ)
+    timeout_ms = deps.get("timeout_ms") or JEV_TIMEOUT_MS
+    backoff_ms = deps.get("backoff_ms") or JEV_BACKOFF_MS
+    if values.draw:
+        # The draw writes the unlabeled sample only; an arm switch would ask for
+        # a measurement this mode never makes.
+        if (
+            getattr(values, "jev", False)
+            or getattr(values, "deem", False)
+            or getattr(values, "out", None) not in (None, "")
+        ):
+            err("--draw takes only --seed and --labels")
+            return 2
+        if re.fullmatch(r"\d+", values.seed or "") is None:
+            err("--draw needs --seed <non-negative integer>")
+            return 2
+        labels_path = Path(values.labels) if values.labels else LABELS_PATH
+        try:
+            if holds_label(read_jsonl(labels_path)):
+                err(f"draw refused: {labels_path} holds a label")
+                return 2
+            commit = head_commit(repo_root)
+            census = build_census(repo_root, commit, tracked_files(repo_root), scanner)
+            drawn = draw_rows(census, int(values.seed))
+            write_jsonl(labels_path, drawn["rows"])
+        except ScannerSkipped:
+            out(SCANNER_SKIPPED_LINE)
+            return 0
+        except ScannerFailed as failure:
+            err(f"scanner failed: {failure}")
+            return 2
+        except ValueError as failure:
+            err(f"draw refused: {failure}")
+            return 2
+        except OSError as failure:
+            err(f"cannot read an input: {failure}")
+            return 2
+        except SystemExit as stop:
+            return int(stop.code) if isinstance(stop.code, int) else 1
+        out(f"draw: seed={values.seed} commit={commit} rows={TOTAL_ROWS}")
+        for category in CATEGORIES:
+            out(
+                f"draw: category={category} rows={ROWS_PER_CATEGORY} "
+                f"candidate_rows={drawn['candidate_rows'][category]}"
+            )
+        out(f"draw: wrote {labels_path}")
+        return 0
+    try:
+        tracked = tracked_files(repo_root)
+        commit = head_commit(repo_root)
+        census = build_census(repo_root, commit, tracked, scanner)
+    except ScannerSkipped:
+        out(SCANNER_SKIPPED_LINE)
+        return 0
+    except ScannerFailed as failure:
+        err(f"scanner failed: {failure}")
+        return 2
+    except OSError as failure:
+        err(f"cannot read an input: {failure}")
+        return 2
+    except SystemExit as stop:
+        return int(stop.code) if isinstance(stop.code, int) else 1
+
+    for line in census_lines(census):
+        out(line)
+    for line in question_lines():
+        out(line)
+    out(MARGIN_LINE)
+    out(KEEP_RULE_LINE)
+
+    labels_path = Path(values.labels) if values.labels else LABELS_PATH
+    try:
+        labels = read_jsonl(labels_path)
+        gate = label_gate(labels)
+        phrases = parse_significance_phrases(
+            DEFAULT_RULES_PATH.read_text(encoding="utf-8")
+        )
+        rows = []
+        summary = None
+        if gate["complete"]:
+            built = build_rows(repo_root, labels, phrases)
+            rows = [row for row in built if not row["refused"]]
+            for row in rows:
+                row["question"] = QUESTIONS[row["category"]]
+            summary = summarize_baseline(built)
+    except ValueError as failure:
+        err(f"cannot read an input: {failure}")
+        return 2
+    except OSError as failure:
+        err(f"cannot read an input: {failure}")
+        return 2
+    except SystemExit as stop:
+        return int(stop.code) if isinstance(stop.code, int) else 1
+
+    categories_stopped = False
+    if not gate["complete"]:
+        for line in gate_lines(gate):
+            out(line)
+    else:
+        for line in baseline_lines(summary):
+            out(line)
+        for line in headroom_lines(summary):
+            out(line)
+        categories_stopped = stop_categories(summary)
+        if categories_stopped:
+            out(STOP_CATEGORIES_LINE)
+
+    columns = {}
+    skipped = {}
+    stopped = {}
+    requalify = {}
+    if not categories_stopped:
+        stored = read_stored_report(values.out) if (values.jev or values.deem) else None
+        call_log = create_call_log(values.out)
+        for backend in ("jev", "deem"):
+            if backend == "jev" and not values.jev:
+                continue
+            if backend == "deem" and not values.deem:
+                continue
+            if backend == "jev":
+                check = jev_gate({"out": out, "env": env, "timeoutMs": timeout_ms})
+            else:
+                check = deem_gate({"out": out, "env": env})
+            if not check["passed"]:
+                skipped[backend] = check["reason"]
+                continue
+            if not gate["complete"]:
+                line = f"{backend} arm skipped: fewer than 150 labeled rows"
+                out(line)
+                skipped[backend] = line
+                continue
+            plan = {"rows": rows, "baseline": summary, "phrases": phrases}
+            ctx = {
+                "out": out,
+                "env": env,
+                "timeoutMs": timeout_ms,
+                "backoffMs": backoff_ms,
+                "callLog": call_log,
+                "stored": stored,
+            }
+            if backend == "jev":
+                arm = run_jev_arm(plan, check, ctx)
+            else:
+                arm = run_deem_arm(plan, check, ctx)
+            if "stopped" in arm:
+                stopped[backend] = {
+                    "line": arm["stopped"],
+                    "partialRows": arm["partialRows"],
+                }
+                continue
+            column = dict(arm["column"])
+            if backend == "jev":
+                column["identity"] = {
+                    "jevVersion": JEV_VERSION,
+                    "provider": check["provider"],
+                }
+            else:
+                column["identity"] = {
+                    "modelId": check["model"],
+                    "modelCommit": check["modelCommit"],
+                    "sourceCommit": check["sourceCommit"],
+                }
+            columns[backend] = column
+            requalify[backend] = arm["requalify"]
+
+    if values.out and (columns or stopped or categories_stopped):
+        headroom = {}
+        if summary is not None:
+            for category, line in zip(CATEGORIES, headroom_lines(summary)):
+                headroom[category] = {
+                    "line": line,
+                    "canPass": line.startswith("headroom"),
+                }
+        report = build_report(
+            {
+                "commit": commit,
+                "questions": {
+                    category: {
+                        "text": QUESTIONS[category],
+                        "sha256": sha256(QUESTIONS[category]),
+                    }
+                    for category in CATEGORIES
+                },
+                "margin": MARGIN,
+                "keepRule": KEEP_RULE_LINE,
+                "baseline": summary,
+                "headroom": headroom,
+                "columns": columns,
+                "skipped": skipped,
+                "stopped": stopped,
+                "requalify": requalify,
+                "categoriesStopped": categories_stopped,
+            }
+        )
+        target = Path(values.out)
+        target.mkdir(parents=True, exist_ok=True)
+        (target / "report.json").write_text(
+            json.dumps(report, indent=2) + "\n", encoding="utf-8"
+        )
+    return 0
+
+
+if __name__ == "__main__":
+    sys.exit(main())
diff --git a/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py b/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py
new file mode 100644
index 0000000000..a19063912c
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py
@@ -0,0 +1,1346 @@
+#!/usr/bin/env python3
+"""Plain-runner tests for the reader-needed lens.
+
+Every case runs against a throwaway git repository and stub jev and cli-deem
+binaries first on PATH, so no case reaches a live backend. The runner prints one
+PASS or FAIL line per case and ends with ALL PASS or the failure count.
+"""
+
+from __future__ import annotations
+
+import contextlib
+import io
+import json
+import os
+import subprocess
+import sys
+import tempfile
+from pathlib import Path
+
+SCRIPT_ROOT = Path(__file__).resolve().parents[1]
+sys.path.insert(0, str(SCRIPT_ROOT))
+import hvr_reader_lens as S  # noqa: E402
+
+# ───────────────────────────────────────────────────────────────
+# FIXTURE HARNESS
+# ───────────────────────────────────────────────────────────────
+
+
+def clean_env() -> dict:
+    """Return a copy of the process environment without fixture redirectors.
+
+    A fixture must not inherit the caller's git redirectors or backend
+    endpoints; a git one would retarget a command at the real repository, and
+    the worktree carries one routinely.
+    """
+    env = dict(os.environ)
+    for key in (
+        "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
+        "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
+        "GIT_CONFIG", "GIT_CONFIG_GLOBAL", "GIT_CONFIG_SYSTEM", "GIT_CONFIG_COUNT",
+        "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
+        "JEV_PROVIDER", "CLI_DEEM_URL",
+    ):
+        env.pop(key, None)
+    return env
+
+
+def temp_dir(prefix: str) -> Path:
+    """Create a fresh temp directory whose name marks it as a fixture."""
+    return Path(tempfile.mkdtemp(prefix=f"hvrlens-{prefix}-"))
+
+
+def _write_files(root: Path, files: dict) -> None:
+    """Write repo-relative paths to text under one fixture root."""
+    for rel_path, text in files.items():
+        target = root / rel_path
+        target.parent.mkdir(parents=True, exist_ok=True)
+        target.write_text(text, encoding="utf-8")
+
+
+def make_repo(files: dict, second: dict | None = None) -> Path:
+    """Build a git repository in a temp directory from repo-relative paths to text.
+
+    Args:
+        files: Repo-relative path to file text, committed first.
+        second: Optional paths committed on top of the first commit, so a case
+            can read one path at two different commits.
+
+    Returns:
+        The repository root.
+    """
+    root = temp_dir("repo")
+    git_args = [
+        "-C", str(root),
+        "-c", "user.email=fixture@example.com", "-c", "user.name=fixture",
+        "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null",
+        "-c", "core.excludesFile=/dev/null", "-c", "core.attributesFile=/dev/null",
+    ]
+
+    def run_git(*args: str) -> None:
+        subprocess.run(
+            ["git", *git_args, *args], check=True, capture_output=True, encoding="utf-8", env=clean_env()
+        )
+
+    _write_files(root, files)
+    run_git("init", "-q")
+    run_git("add", "-A")
+    run_git("commit", "-q", "-m", "fixture")
+    if second:
+        _write_files(root, second)
+        run_git("add", "-A")
+        run_git("commit", "-q", "-m", "fixture second")
+    return root
+
+
+# The stubs answer the two reader-needed constructions the corpus carries and
+# nothing else, so a fixture labeled from those constructions is answered right.
+JEV_STUB = r'''#!/usr/bin/env python3
+"""Stub jev: logs its argv, then answers identity, auth and noul offline."""
+
+import json
+import os
+import sys
+from pathlib import Path
+
+ARGS = sys.argv[1:]
+with (Path(__file__).resolve().parent / 'jev.log').open('a', encoding='utf-8') as handle:
+    handle.write(json.dumps(ARGS) + '\n')
+
+
+def answer_noul() -> None:
+    text = sys.stdin.read().lower()
+    if os.environ.get('STUB_NOUL_EXIT'):
+        raise SystemExit(int(os.environ['STUB_NOUL_EXIT']))
+    if os.environ.get('STUB_NOUL_EMPTY') == '1':
+        print('{"answers":{"answer":{}}}')
+        return
+    tell = 'marks a pivotal moment in' in text or 'from startups to' in text
+    print(json.dumps({'answers': {'answer': {'noul': 0.9 if tell else 0.1}}}, separators=(',', ':')))
+
+
+if ARGS[:1] == ['--version']:
+    print(os.environ.get('STUB_JEV_VERSION', 'jev 0.6.2'))
+elif ARGS[:2] == ['auth', 'status']:
+    raise SystemExit(int(os.environ.get('STUB_AUTH_STATUS_EXIT', '0')))
+elif ARGS[:2] == ['auth', 'test']:
+    print('{"ok":true,"model":"stub-model"}')
+    raise SystemExit(int(os.environ.get('STUB_AUTH_TEST_EXIT', '0')))
+elif ARGS[:1] == ['noul']:
+    answer_noul()
+else:
+    raise SystemExit(2)
+'''
+
+DEEM_STUB = r'''#!/usr/bin/env python3
+"""Stub cli-deem: logs its argv, then answers health and noul offline."""
+
+import json
+import os
+import sys
+from pathlib import Path
+
+SCRIPT_DIR = Path(__file__).resolve().parent
+ARGS = sys.argv[1:]
+with (SCRIPT_DIR / 'cli-deem.log').open('a', encoding='utf-8') as handle:
+    handle.write(json.dumps(ARGS) + '\n')
+
+
+def answer_noul() -> None:
+    text = sys.stdin.read().lower()
+    if os.environ.get('STUB_NOUL_EXIT'):
+        raise SystemExit(int(os.environ['STUB_NOUL_EXIT']))
+    if os.environ.get('STUB_NOUL_EMPTY') == '1':
+        print('{"answers":{"answer":{}}}')
+        return
+    tell = 'marks a pivotal moment in' in text or 'from startups to' in text
+    print(json.dumps({'answers': {'answer': {'noul': 0.9 if tell else 0.1}}}, separators=(',', ':')))
+
+
+if ARGS[:1] == ['health']:
+    count_file = SCRIPT_DIR / 'health.count'
+    seen = int(count_file.read_text(encoding='utf-8')) if count_file.exists() else 0
+    count_file.write_text(str(seen + 1), encoding='utf-8')
+    commits = os.environ.get('STUB_MODEL_COMMITS', 'aaa').split(',')
+    model_commit = commits[min(seen, len(commits) - 1)]
+    backend = os.environ.get('STUB_DEEM_BACKEND', 'torch')
+    if backend == 'stub':
+        sys.stderr.write('{"ok":false,"error":"refused backend: stub"}\n')
+        raise SystemExit(3)
+    print(json.dumps({
+        'ok': True,
+        'backend': backend,
+        'model': 'deem-0.8-v1',
+        'model_commit': model_commit,
+        'source_commit': 'bbb',
+    }, separators=(',', ':')))
+elif ARGS[:1] == ['noul']:
+    answer_noul()
+else:
+    raise SystemExit(2)
+'''
+
+
+def make_stubs() -> Path:
+    """Write the stub jev and cli-deem binaries into a fresh temp directory."""
+    bin_dir = temp_dir("bin")
+    for name, source in (("jev", JEV_STUB), ("cli-deem", DEEM_STUB)):
+        target = bin_dir / name
+        target.write_text(source, encoding="utf-8")
+        target.chmod(0o755)
+    return bin_dir
+
+
+def stub_log(bin_dir: Path, name: str) -> list:
+    """Return the parsed argument arrays the named stub recorded, empty when it never ran."""
+    log = Path(bin_dir) / f"{name}.log"
+    if not log.exists():
+        return []
+    return [json.loads(line) for line in log.read_text(encoding="utf-8").splitlines() if line]
+
+
+def stub_env(bin_dir: Path, extra: dict | None = None) -> dict:
+    """Return an environment with the stub directory first on PATH."""
+    env = clean_env()
+    env["PATH"] = f"{bin_dir}{os.pathsep}{env.get('PATH', '')}"
+    env.update(extra or {})
+    return env
+
+
+def run_main(args: list, options: dict | None = None) -> dict:
+    """Run the lens against one fixture and collect its output lines and exit code.
+
+    Args:
+        args: Command-line arguments for the lens.
+        options: Optional ``root``, ``bin``, ``scanner`` and ``env`` overrides.
+
+    Returns:
+        ``{"code": int, "lines": list, "errs": list}``.
+    """
+    opts = options or {}
+    lines: list[str] = []
+    errs: list[str] = []
+    env = clean_env()
+    if opts.get("bin"):
+        env["PATH"] = f"{opts['bin']}{os.pathsep}{env.get('PATH', '')}"
+    env.update(opts.get("env") or {})
+    code = S.main(
+        list(args),
+        {
+            "repo_root": opts.get("root"),
+            "scanner": opts.get("scanner"),
+            "out": lines.append,
+            "err": errs.append,
+            "env": env,
+            "timeout_ms": 20000,
+            "backoff_ms": 1,
+        },
+    )
+    return {"code": code, "lines": lines, "errs": errs}
+
+
+# ───────────────────────────────────────────────────────────────
+# CORPUS FIXTURE
+# ───────────────────────────────────────────────────────────────
+
+CORPUS_SKILLS = (
+    "alpha-skill", "beta-skill", "gamma-skill", "delta-skill", "epsilon-skill", "zeta-skill",
+    "eta-skill", "theta-skill", "iota-skill", "kappa-skill", "lambda-skill", "mu-skill",
+)
+PLAIN_DOCS_PER_SKILL = 5
+TELL_DOCS_PER_SKILL = 5
+SIGNIFICANCE_TELL = "This marks a pivotal moment in the field."
+FALSE_RANGE_TELL = "From startups to enterprises, everyone benefits."
+
+
+def section_doc(title: str, tell_line: str) -> str:
+    """Build one in-band section: a heading, the caller's line and four fillers.
+
+    Six lines sits inside the band every draw and every measurement works in,
+    and one section per document keeps the drawn pool a known size.
+    """
+    body = [f"# {title}", tell_line]
+    body.extend(f"Reference line {number} for {title}." for number in range(1, 5))
+    return "\n".join(body) + "\n"
+
+
+def corpus_files() -> dict:
+    """Build the shared corpus: twelve skills, each carrying both tells and plain docs.
+
+    Five documents per tell per skill leave the per-skill cap reachable in every
+    category, and the plain documents give the fills somewhere to come from. The
+    stub backends answer the two tell lines, so a fixture labeled from the same
+    constructions is answered correctly.
+    """
+    files: dict = {}
+    for skill in CORPUS_SKILLS:
+        for number in range(1, PLAIN_DOCS_PER_SKILL + 1):
+            files[f".skilled/skills/{skill}/docs/plain-{number:02d}.md"] = section_doc(
+                f"{skill} plain {number}", "The guide states each step once."
+            )
+        for number in range(1, TELL_DOCS_PER_SKILL + 1):
+            files[f".skilled/skills/{skill}/docs/significance-{number:02d}.md"] = section_doc(
+                f"{skill} significance {number}", SIGNIFICANCE_TELL
+            )
+            files[f".skilled/skills/{skill}/docs/false-range-{number:02d}.md"] = section_doc(
+                f"{skill} false range {number}", FALSE_RANGE_TELL
+            )
+    files[".skilled/skills/sk-doc/.env.example"] = "PLACEHOLDER=1\n"
+    files[".skilled/skills/sk-doc/changelog/v1.0.0.0.md"] = section_doc(
+        "changelog entry", "The release notes live here."
+    )
+    files[".skilled/skills/sk-doc/tests/fixtures/sample.md"] = section_doc(
+        "fixture sample", "A fixture sentence."
+    )
+    return files
+
+
+# ───────────────────────────────────────────────────────────────
+# SCANNER STUB
+# ───────────────────────────────────────────────────────────────
+
+SCAN_STUB = r'''#!/usr/bin/env python3
+"""Stub scanner: one hard finding per line holding FINDING, over the targets given."""
+
+import json
+import sys
+from pathlib import Path
+
+reports = []
+for target in [argument for argument in sys.argv[1:] if argument != "--json"]:
+    text = Path(target).read_text(encoding="utf-8")
+    findings = [
+        {
+            "line": number,
+            "column": 1,
+            "severity": "hard",
+            "category": "word-blocker",
+            "term": "FINDING",
+            "text": "",
+        }
+        for number, line in enumerate(text.splitlines(), start=1)
+        if "FINDING" in line
+    ]
+    reports.append({
+        "path": target,
+        "findings": findings,
+        "hardBlockers": len(findings),
+        "mechanicalDeductions": 0,
+        "mechanicalCeiling": 100,
+    })
+print(json.dumps({"rulesSource": "stub", "reports": reports}))
+raise SystemExit(1 if any(report["findings"] for report in reports) else 0)
+'''
+
+
+def make_scanner(bin_dir: Path, source: str = SCAN_STUB) -> Path:
+    """Write one stub scanner into a fixture directory and return its path."""
+    target = Path(bin_dir) / "scanner"
+    target.write_text(source, encoding="utf-8")
+    target.chmod(0o755)
+    return target
+
+
+# The draw cases walk the flagged frame, so this stub marks every line: it keeps
+# no section out of the pool and leaves the cursor on the per-skill cap.
+FLAG_ALL_STUB = r'''#!/usr/bin/env python3
+"""Stub scanner: one finding per line, so every section is flagged."""
+
+import json
+import sys
+from pathlib import Path
+
+reports = []
+for target in [argument for argument in sys.argv[1:] if argument != "--json"]:
+    text = Path(target).read_text(encoding="utf-8")
+    findings = [
+        {
+            "line": number,
+            "column": 1,
+            "severity": "hard",
+            "category": "word-blocker",
+            "term": "FINDING",
+            "text": "",
+        }
+        for number, line in enumerate(text.splitlines(), start=1)
+    ]
+    reports.append({
+        "path": target,
+        "findings": findings,
+        "hardBlockers": len(findings),
+        "mechanicalDeductions": 0,
+        "mechanicalCeiling": 100,
+    })
+print(json.dumps({"rulesSource": "stub", "reports": reports}))
+raise SystemExit(1)
+'''
+
+
+# ───────────────────────────────────────────────────────────────
+# CASES
+# ───────────────────────────────────────────────────────────────
+
+
+def run() -> int:
+    failures = []
+
+    def check(name: str, condition: bool) -> None:
+        print(("PASS " if condition else "FAIL ") + name)
+        if not condition:
+            failures.append(name)
+
+    root = make_repo(
+        {"a.md": "# A\n", "dir/it's.md": "# B\n"},
+        {"dir/it's.md": "# B, revised\n"},
+    )
+    first = S.git(root, ["rev-parse", "HEAD~1"]).strip()
+    head = S.head_commit(root)
+    check(
+        "tracked files and read at commit",
+        S.tracked_files(root) == ["a.md", "dir/it's.md"]
+        and len(head) == 40
+        and all(character in "0123456789abcdef" for character in head)
+        and head != first
+        and S.read_at_commit(root, first, "dir/it's.md") == "# B\n"
+        and S.read_at_commit(root, head, "dir/it's.md") == "# B, revised\n"
+        and S.sha12("abc") == "ba7816bf8f01",
+    )
+
+    walk_root = make_repo(
+        {
+            ".skilled/skills/sk-doc/guide.md": "# Guide\nA body line.\n",
+            ".skilled/skills/sk-doc/changelog/v1.0.0.0.md": "# Entry\nA body line.\n",
+            ".skilled/skills/sk-doc/tests/fixtures/sample.md": "# Sample\nA body line.\n",
+            ".skilled/skills/sk-doc/.env.example": "PLACEHOLDER=1\n",
+        }
+    )
+    kept, refused = S.frame_paths(S.tracked_files(walk_root))
+    check(
+        "frame walker keeps skill markdown and refuses .env and changelog",
+        kept == [".skilled/skills/sk-doc/guide.md"] and refused == 1,
+    )
+
+    heading_doc = "Preamble.\n# A\n" + "a\n" * 3 + "# B\n" + "b\n" * 5
+    heading_sections = S.split_sections(heading_doc)
+    check(
+        "split sections at ATX headings",
+        heading_sections == [{"start": 1, "end": 1}, {"start": 2, "end": 5}, {"start": 6, "end": 11}]
+        and [S.in_band(section) for section in heading_sections] == [False, False, True]
+        and S.section_text(heading_doc.splitlines(), 2, 5) == "# A\na\na\na",
+    )
+
+    fence_doc = "intro\n# A\n```\n# not a heading\n```\n~~~\n## still code\n~~~\n# B\nend\n"
+    fence_sections = S.split_sections(fence_doc)
+    check(
+        "a heading inside a fence does not split",
+        fence_sections == [{"start": 1, "end": 1}, {"start": 2, "end": 8}, {"start": 9, "end": 10}]
+        and S.section_text(fence_doc.splitlines(), 9, 10) == "# B\nend",
+    )
+
+    scan_root = make_repo(
+        {
+            ".skilled/skills/alpha-skill/doc.md": (
+                "# Short\nFINDING one\none\ntwo\n"
+                "# Band\nFrom startups to enterprises, everyone benefits.\n"
+                "This marks a pivotal moment in the field.\nFINDING two\nthree\nfour\n"
+                "# Long\nFINDING three\n"
+                + "".join(f"line {number}\n" for number in range(1, 89))
+            )
+        }
+    )
+    scan_bin = temp_dir("scan")
+    scanner = make_scanner(scan_bin)
+    census = S.build_census(
+        scan_root, S.head_commit(scan_root), S.tracked_files(scan_root), scanner
+    )
+    census_text = S.census_lines(census)
+    check(
+        "census counts files, sections, flagged and in-band",
+        census["files"] == 1
+        and census["sections"] == 3
+        and census["flagged"] == 3
+        and census["inBand"] == 1
+        and census["refused"] == 0
+        and census["candidates"] == {
+            "synonym-cycling": 0,
+            "significance-inflation": 1,
+            "false-ranges": 1,
+        }
+        and census_text[0] == "census: commit={0} files=1 sections=3 flagged=3 "
+        "in_band_5_80=1 refused=0".format(census["commit"])
+        and census_text[1:4] == [
+            "census: category=synonym-cycling candidates=0",
+            "census: category=significance-inflation candidates=1",
+            "census: category=false-ranges candidates=1",
+        ],
+    )
+
+    skip_root = make_repo(
+        {".skilled/skills/alpha-skill/guide.md": "# Guide\nFINDING body\nline\nline\nline\n"}
+    )
+    os.environ["SKDOC_SKIP_VALIDATION"] = "1"
+    try:
+        skipped = run_main([], {"root": skip_root})
+    finally:
+        os.environ.pop("SKDOC_SKIP_VALIDATION", None)
+    check(
+        "a skipped scanner stops the run",
+        skipped["code"] == 0
+        and skipped["lines"] == [S.SCANNER_SKIPPED_LINE]
+        and not any(line.startswith("census:") for line in skipped["lines"]),
+    )
+
+    fail_bin = temp_dir("scan")
+    failing = make_scanner(fail_bin, "import sys\n\nraise SystemExit(2)\n")
+    failed = run_main([], {"root": skip_root, "scanner": failing})
+    check(
+        "a scanner exit 2 stops the run",
+        failed["code"] == 2
+        and not any(line.startswith("census:") for line in failed["lines"]),
+    )
+
+    phrases = S.parse_significance_phrases(
+        S.DEFAULT_RULES_PATH.read_text(encoding="utf-8")
+    )
+    check(
+        "significance comparator flags a listed phrase",
+        len(phrases) == 8
+        and S.significance_hit("This marks a pivotal moment in the field.", phrases)
+        and not S.significance_hit("The guide states each step once.", phrases),
+    )
+
+    # The pattern reads the shape, not the scale, so a measurable range is
+    # flagged too; the over-flag is why its rows are worth labeling.
+    check(
+        "false-range comparator flags a construction and a genuine range",
+        S.false_range_hit("From startups to enterprises, everyone benefits.")
+        and S.false_range_hit("Temperatures range from -10C to 40C."),
+    )
+
+    thin_rules = (
+        "### Significance Inflation\n\n"
+        "Banned phrases:\n"
+        '- "marks a pivotal moment in"\n'
+    )
+    try:
+        # The refusal message is expected; keep it out of the runner's output.
+        with contextlib.redirect_stderr(io.StringIO()):
+            S.parse_significance_phrases(thin_rules)
+        thin_code = None
+    except SystemExit as stop:
+        thin_code = stop.code
+    check(
+        "a thin standard stops the comparator parse",
+        thin_code == 2,
+    )
+
+    draw_bin = temp_dir("draw-bin")
+    draw_scanner = make_scanner(draw_bin, FLAG_ALL_STUB)
+    draw_root = make_repo(corpus_files())
+    draw_a = temp_dir("draw-a")
+    draw_b = temp_dir("draw-b")
+    labels_a = draw_a / "labels.jsonl"
+    labels_b = draw_b / "labels.jsonl"
+    first_draw = run_main(
+        ["--draw", "--seed", "7", "--labels", str(labels_a)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    seed7_bytes = labels_a.read_bytes()
+    drawn_rows = S.read_jsonl(labels_a)
+    second_draw = run_main(
+        ["--draw", "--seed", "7", "--labels", str(labels_b)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    same_seed_bytes = seed7_bytes == labels_b.read_bytes()
+    same_seed_again = run_main(
+        ["--draw", "--seed", "7", "--labels", str(labels_a)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    stable_bytes = labels_a.read_bytes() == seed7_bytes
+    different_seed = run_main(
+        ["--draw", "--seed", "8", "--labels", str(labels_b)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    other_seed_bytes = labels_b.read_bytes() != seed7_bytes
+    draw_keys = [
+        "id", "category", "doc", "section_start", "section_end",
+        "commit", "section_sha12", "candidate", "label", "labeler",
+    ]
+    per_category = {
+        category: [row for row in drawn_rows if row["category"] == category]
+        for category in S.CATEGORIES
+    }
+    check(
+        "draw is reproducible and carries no text",
+        first_draw["code"] == 0
+        and second_draw["code"] == 0
+        and same_seed_again["code"] == 0
+        and different_seed["code"] == 0
+        and first_draw["lines"] == [
+            f"draw: seed=7 commit={S.head_commit(draw_root)} rows=150",
+            "draw: category=synonym-cycling rows=50 candidate_rows=0",
+            "draw: category=significance-inflation rows=50 candidate_rows=25",
+            "draw: category=false-ranges rows=50 candidate_rows=25",
+            f"draw: wrote {labels_a}",
+        ]
+        and len(drawn_rows) == 150
+        and [len(per_category[category]) for category in S.CATEGORIES] == [50, 50, 50]
+        and all(list(row.keys()) == draw_keys for row in drawn_rows)
+        and all(row["label"] is None and row["labeler"] is None for row in drawn_rows)
+        and all(len(row["section_sha12"]) == 12 for row in drawn_rows)
+        and same_seed_bytes
+        and stable_bytes
+        and other_seed_bytes,
+    )
+
+    cap_counts = {}
+    for row in drawn_rows:
+        counts = cap_counts.setdefault(row["category"], {})
+        skill = S.skill_of(row["doc"])
+        counts[skill] = counts.get(skill, 0) + 1
+    check(
+        "draw caps rows per skill per category",
+        len(cap_counts) == len(S.CATEGORIES)
+        and all(
+            count <= S.MAX_ROWS_PER_SKILL
+            for counts in cap_counts.values()
+            for count in counts.values()
+        )
+        and max(cap_counts["synonym-cycling"].values()) == S.MAX_ROWS_PER_SKILL,
+    )
+
+    refuse_dir = temp_dir("draw-refuse")
+    refuse_labels = refuse_dir / "labels.jsonl"
+    run_main(
+        ["--draw", "--seed", "7", "--labels", str(refuse_labels)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    refuse_rows = S.read_jsonl(refuse_labels)
+    refuse_rows[0]["label"] = "yes"
+    S.write_jsonl(refuse_labels, refuse_rows)
+    refuse_before = refuse_labels.read_bytes()
+    refused = run_main(
+        ["--draw", "--seed", "8", "--labels", str(refuse_labels)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    check(
+        "draw refuses to overwrite a labeled file",
+        refused["code"] == 2
+        and any("draw refused" in line for line in refused["errs"])
+        and refuse_labels.read_bytes() == refuse_before,
+    )
+
+    seed_dir = temp_dir("draw-seed")
+    seed_labels = seed_dir / "labels.jsonl"
+    bad_seed_runs = [
+        run_main(
+            ["--draw", "--labels", str(seed_labels)],
+            {"root": draw_root, "scanner": draw_scanner},
+        ),
+        run_main(
+            ["--draw", "--seed", "x", "--labels", str(seed_labels)],
+            {"root": draw_root, "scanner": draw_scanner},
+        ),
+        run_main(
+            ["--draw", "--jev", "--labels", str(seed_labels)],
+            {"root": draw_root, "scanner": draw_scanner},
+        ),
+    ]
+    check(
+        "--draw needs a valid non-negative seed",
+        all(result["code"] == 2 for result in bad_seed_runs) and not seed_labels.exists(),
+    )
+
+    def synthetic_rows(category: str, labels: list, candidates: list) -> list:
+        """Build in-memory rows in the shape ``build_rows`` returns."""
+        return [
+            {
+                "id": f"{category}-{number:02d}",
+                "category": category,
+                "label": label,
+                "candidate": candidate,
+            }
+            for number, (label, candidate) in enumerate(zip(labels, candidates), start=1)
+        ]
+
+    labeled_149 = [{"id": f"r{n:03d}", "label": "yes"} for n in range(1, 150)]
+    gate_149 = S.label_gate(labeled_149)
+    gate_150 = S.label_gate(labeled_149 + [{"id": "r150", "label": "no"}])
+    gate_missing = S.label_gate(None)
+    check(
+        "label gate stops at 149 labeled rows",
+        gate_149 == {"complete": False, "labeled": 149, "total": 150}
+        and S.gate_lines(gate_149) == [
+            "labels: labeled=149 of 150",
+            "stop: fewer than 150 labeled rows",
+        ]
+        and gate_150 == {"complete": True, "labeled": 150, "total": 150}
+        and gate_missing == {"complete": False, "labeled": 0, "total": 150},
+    )
+
+    baseline_rows = (
+        synthetic_rows("synonym-cycling", ["yes", "yes", "no", "no"], [False] * 4)
+        + synthetic_rows(
+            "significance-inflation",
+            ["yes", "yes", "no", "no"],
+            [True, True, False, False],
+        )
+        + synthetic_rows(
+            "false-ranges", ["yes", "no", "no", "no"], [True, True, True, False]
+        )
+    )
+    baseline = S.summarize_baseline(baseline_rows)
+    check(
+        "baseline picks the comparator only when it beats flag-nothing",
+        S.baseline_lines(baseline) == [
+            "baseline (synonym-cycling): flag-nothing right=2 of 4 comparator "
+            "right=2 of 4 chosen=flag-nothing B=2 yes_share=2 of 4",
+            "baseline (significance-inflation): flag-nothing right=2 of 4 comparator "
+            "right=4 of 4 chosen=comparator B=4 yes_share=2 of 4",
+            "baseline (false-ranges): flag-nothing right=3 of 4 comparator "
+            "right=2 of 4 chosen=flag-nothing B=3 yes_share=1 of 4",
+        ]
+        and baseline["categories"]["significance-inflation"]["flags"] == {
+            "significance-inflation-01": True,
+            "significance-inflation-02": True,
+            "significance-inflation-03": False,
+            "significance-inflation-04": False,
+        }
+        and baseline["categories"]["synonym-cycling"]["flags"] == {
+            "synonym-cycling-01": False,
+            "synonym-cycling-02": False,
+            "synonym-cycling-03": False,
+            "synonym-cycling-04": False,
+        },
+    )
+
+    headroom_rows = (
+        synthetic_rows("synonym-cycling", ["yes"] * 9 + ["no"] * 91, [False] * 100)
+        + synthetic_rows(
+            "significance-inflation", ["yes"] * 4 + ["no"] * 6, [False] * 10
+        )
+        + synthetic_rows("false-ranges", ["yes"] * 50 + ["no"] * 50, [False] * 100)
+    )
+    headroom = S.summarize_baseline(headroom_rows)
+    check(
+        "headroom, power and the categories stop",
+        S.headroom_lines(headroom) == [
+            "no headroom (synonym-cycling)",
+            "underpowered (significance-inflation)",
+            "headroom (false-ranges): baseline wrong on 50 of 100",
+        ]
+        and S.stop_categories(headroom) is True
+        and S.STOP_CATEGORIES_LINE == "stop: fewer than 2 categories can pass",
+    )
+
+    refuse_root = make_repo(
+        {
+            ".skilled/skills/alpha-skill/guide.md": (
+                "# Guide\nBody line one.\nBody line two.\nBody line three.\n"
+            ),
+        }
+    )
+    refuse_tracked = S.tracked_files(refuse_root)
+    refuse_rows = [
+        {
+            "id": "r001",
+            "category": "synonym-cycling",
+            "doc": ".skilled/skills/alpha-skill/missing.md",
+            "section_start": 1,
+            "section_end": 1,
+            "commit": S.head_commit(refuse_root),
+            "section_sha12": "000000000000",
+            "label": None,
+        },
+        {
+            "id": "r002",
+            "category": "significance-inflation",
+            "doc": ".skilled/skills/alpha-skill/.env",
+            "section_start": 1,
+            "section_end": 1,
+            "commit": S.head_commit(refuse_root),
+            "section_sha12": "000000000000",
+            "label": None,
+        },
+    ]
+    direct_refusals = 0
+    for row in refuse_rows:
+        try:
+            # A read would raise RuntimeError from git, so reaching this count
+            # through ValueError alone is what "never read" means here.
+            S.read_section(refuse_root, row, refuse_tracked)
+        except ValueError:
+            direct_refusals += 1
+    built_refusals = S.build_rows(refuse_root, refuse_rows, phrases)
+    check(
+        "an untracked or .env row is refused",
+        direct_refusals == 2
+        and sum(1 for row in built_refusals if row["refused"]) == 2
+        and all(row["text"] is None for row in built_refusals),
+    )
+
+    # The cap fires before the child's sleep ends, so a stalled backend can
+    # never hold a run open; the arms record the timed_out flag as
+    # unmeasured_timeout rather than a score.
+    slow_dir = temp_dir("slow")
+    slow_script = slow_dir / "slow_child.py"
+    slow_script.write_text("import time\n\ntime.sleep(30)\n", encoding="utf-8")
+    slow_call = S.spawn_call(sys.executable, [str(slow_script)], "", clean_env(), 300)
+    check(
+        "a spawn past the timeout is killed and marked unmeasured_timeout",
+        slow_call["timed_out"] is True
+        and slow_call["code"] is None
+        and slow_call["stdout"] == ""
+        and slow_call["stderr"] == ""
+        and isinstance(slow_call["wall_ms"], int)
+        and slow_call["wall_ms"] < 30000
+        and S.JEV_TIMEOUT_MS == 90000
+        and S.JEV_BACKOFF_MS == 2000,
+    )
+
+    # A body with no answer is a missed measurement: the record keeps a null
+    # probability and an unmeasured status, so a missing answer can never be
+    # read as a score of 0.
+    call_bin = make_stubs()
+    empty_call = S.spawn_call(
+        str(call_bin / "cli-deem"),
+        ["noul", "-q", "Does this text tell?"],
+        "The guide states each step once.",
+        stub_env(call_bin, {"STUB_NOUL_EMPTY": "1"}),
+        20000,
+    )
+    empty_body = json.loads(empty_call["stdout"])
+    calls_dir = temp_dir("calls")
+    call_log = S.create_call_log(calls_dir)
+    call_log["append"](
+        {
+            "backend": "deem",
+            "kind": "noul",
+            "rowId": "r001",
+            "category": "synonym-cycling",
+            "rerun": 0,
+            "attempt": 1,
+            "wallMs": empty_call["wall_ms"],
+            "exitCode": empty_call["code"],
+            "probability": None,
+            "flag": None,
+            "status": "unmeasured",
+            "modelId": "deem-0.8-v1",
+            "modelCommit": "aaa",
+            "sourceCommit": "bbb",
+        }
+    )
+    recorded_calls = S.read_jsonl(calls_dir / "calls.jsonl")
+    check(
+        "a missing answer is recorded unmeasured, never 0",
+        empty_call["code"] == 0
+        and "noul" not in empty_body["answers"]["answer"]
+        and len(recorded_calls) == 1
+        and recorded_calls[0]["probability"] is None
+        and recorded_calls[0]["status"] == "unmeasured"
+        and recorded_calls[0]["flag"] is None,
+    )
+
+    torch_bin = make_stubs()
+    torch_env = stub_env(torch_bin)
+    torch_lines: list[str] = []
+    torch_gate = S.deem_gate({"out": torch_lines.append, "env": torch_env})
+    check(
+        "deem gate passes a torch health",
+        torch_gate["passed"] is True
+        and S.deem_command(torch_env) == [str(torch_bin / "cli-deem")]
+        and torch_lines == [
+            "deem: health backend=torch model=deem-0.8-v1 "
+            "model_commit=aaa source_commit=bbb"
+        ],
+    )
+
+    stub_backend_bin = make_stubs()
+    stub_backend_lines: list[str] = []
+    stub_backend_gate = S.deem_gate(
+        {
+            "out": stub_backend_lines.append,
+            "env": stub_env(stub_backend_bin, {"STUB_DEEM_BACKEND": "stub"}),
+        }
+    )
+    stub_backend_log = stub_log(stub_backend_bin, "cli-deem")
+    stub_backend_run = run_main(
+        ["--deem", "--out", str(temp_dir("deem-skip"))],
+        {
+            "root": draw_root,
+            "scanner": draw_scanner,
+            "bin": stub_backend_bin,
+            "env": {"STUB_DEEM_BACKEND": "stub"},
+        },
+    )
+    check(
+        "deem gate skips a stub backend",
+        stub_backend_gate["passed"] is False
+        and stub_backend_lines == ["deem arm skipped: stub backend"]
+        and stub_backend_log == [["health"]]
+        and stub_backend_run["code"] == 0
+        and "deem arm skipped: stub backend" in stub_backend_run["lines"],
+    )
+
+    changed_bin = make_stubs()
+    changed_env = stub_env(
+        changed_bin, {"STUB_MODEL_COMMITS": "aaa,ccc", "STUB_NOUL_EXIT": "4"}
+    )
+    changed_lines: list[str] = []
+    changed_gate = S.deem_gate({"out": changed_lines.append, "env": changed_env})
+    changed_out = temp_dir("deem-changed")
+    changed_plan = {
+        "rows": [
+            {
+                "id": "r001",
+                "category": "significance-inflation",
+                "label": "yes",
+                "text": SIGNIFICANCE_TELL,
+                "question": "Does this passage declare that something is important?",
+            }
+        ],
+        "baseline": {"categories": {}},
+        "phrases": phrases,
+    }
+    changed_arm = S.run_deem_arm(
+        changed_plan,
+        changed_gate,
+        {
+            "out": changed_lines.append,
+            "env": changed_env,
+            "timeoutMs": 20000,
+            "callLog": S.create_call_log(changed_out),
+            "stored": None,
+        },
+    )
+    check(
+        "deem exit 4 with a changed commit pair stops the arm",
+        changed_arm == {
+            "stopped": "deem arm stopped: model commit changed mid-run",
+            "partialRows": 0,
+        }
+        and changed_lines[-2:] == [
+            "deem arm stopped: model commit changed mid-run",
+            "deem: partial rows=0",
+        ]
+        and not any(line.startswith("verdict") for line in changed_lines)
+        and len(S.read_jsonl(changed_out / "calls.jsonl")) == 1,
+    )
+
+    no_out_bin = make_stubs()
+    no_out_runs = [
+        run_main(
+            ["--jev"],
+            {"root": draw_root, "scanner": draw_scanner, "bin": no_out_bin},
+        ),
+        run_main(
+            ["--deem"],
+            {"root": draw_root, "scanner": draw_scanner, "bin": no_out_bin},
+        ),
+    ]
+    check(
+        "--out is required for both switches",
+        [result["code"] for result in no_out_runs] == [2, 2]
+        and all(result["lines"] == [] for result in no_out_runs)
+        and all(
+            result["errs"]
+            == ["--jev and --deem need --out <dir> so every call is recorded"]
+            for result in no_out_runs
+        )
+        and stub_log(no_out_bin, "jev") == []
+        and stub_log(no_out_bin, "cli-deem") == [],
+    )
+
+    verdict_bin = make_stubs()
+    verdict_env = stub_env(verdict_bin)
+    verdict_lines: list[str] = []
+    verdict_gate = S.deem_gate({"out": verdict_lines.append, "env": verdict_env})
+    verdict_questions = {
+        "synonym-cycling": (
+            "Does this passage refer to the same thing by three or more different words?"
+        ),
+        "significance-inflation": (
+            "Does this passage declare that something is important or historic instead of "
+            "stating what happened?"
+        ),
+        "false-ranges": (
+            "Does this passage use a from X to Y construction whose endpoints are not on a "
+            "meaningful scale?"
+        ),
+    }
+    verdict_rows = []
+    number = 0
+    for category, tell in (
+        ("synonym-cycling", SIGNIFICANCE_TELL),
+        ("significance-inflation", SIGNIFICANCE_TELL),
+        ("false-ranges", FALSE_RANGE_TELL),
+    ):
+        for _ in range(50):
+            number += 1
+            verdict_rows.append(
+                {
+                    "id": f"r{number:03d}",
+                    "category": category,
+                    "label": "yes",
+                    "text": tell,
+                    "question": verdict_questions[category],
+                }
+            )
+    verdict_baseline = S.summarize_baseline(
+        [
+            {
+                "id": row["id"],
+                "category": row["category"],
+                "label": "yes",
+                "candidate": False,
+            }
+            for row in verdict_rows
+        ]
+    )
+    verdict_out = temp_dir("deem-verdict")
+    verdict_arm = S.run_deem_arm(
+        {"rows": verdict_rows, "baseline": verdict_baseline, "phrases": phrases},
+        verdict_gate,
+        {
+            "out": verdict_lines.append,
+            "env": verdict_env,
+            "timeoutMs": 20000,
+            "callLog": S.create_call_log(verdict_out),
+            "stored": None,
+        },
+    )
+    verdict_records = S.read_jsonl(verdict_out / "calls.jsonl")
+    check(
+        "deem arm prints a verdict and records every call",
+        any(line.startswith("verdict deem:") for line in verdict_lines)
+        and "flips: not applicable (deem noul)" in verdict_lines
+        and verdict_arm["column"]["line"] in verdict_lines
+        and len(verdict_records) == 150
+        and all(record["status"] == "measured" for record in verdict_records)
+        and all(
+            {"wallMs", "exitCode", "modelId", "modelCommit", "sourceCommit"}
+            <= set(record)
+            for record in verdict_records
+        ),
+    )
+
+    requal_bin = make_stubs()
+    requal_env = stub_env(requal_bin)
+    requal_lines: list[str] = []
+    requal_gate = S.deem_gate({"out": requal_lines.append, "env": requal_env})
+    requal_out = temp_dir("deem-requalify")
+    requal_arm = S.run_deem_arm(
+        {"rows": verdict_rows, "baseline": verdict_baseline, "phrases": phrases},
+        requal_gate,
+        {
+            "out": requal_lines.append,
+            "env": requal_env,
+            "timeoutMs": 20000,
+            "callLog": S.create_call_log(requal_out),
+            "stored": {
+                "columns": {"deem": {"modelCommit": "old", "sourceCommit": "old"}}
+            },
+        },
+    )
+    requal_index = next(
+        (
+            index
+            for index, line in enumerate(requal_lines)
+            if line.startswith("verdict deem:")
+        ),
+        None,
+    )
+    check(
+        "a stored commit pair that differs prints requalify",
+        requal_arm["requalify"] == "requalify: model commit changed"
+        and requal_index is not None
+        and requal_lines[requal_index - 1] == "requalify: model commit changed",
+    )
+
+    jev_bin = make_stubs()
+    jev_env = stub_env(jev_bin, {"JEV_PROVIDER": "openrouter"})
+    jev_lines: list[str] = []
+    jev_gate = S.jev_gate({"out": jev_lines.append, "env": jev_env, "timeoutMs": 20000})
+    check(
+        "jev gate passes jev 0.6.2 with a credential",
+        jev_gate["passed"] is True
+        and jev_gate["path"] == str(jev_bin / "jev")
+        and jev_gate["provider"] == "openrouter"
+        and jev_lines == [f"jev: path={jev_bin / 'jev'} provider=openrouter"]
+        and stub_log(jev_bin, "jev")
+        == [["--version"], ["auth", "status", "--provider", "openrouter"]],
+    )
+
+    no_cred_bin = make_stubs()
+    no_cred_env = stub_env(
+        no_cred_bin, {"STUB_AUTH_STATUS_EXIT": "3", "JEV_PROVIDER": "openrouter"}
+    )
+    no_cred_lines: list[str] = []
+    no_cred_gate = S.jev_gate(
+        {"out": no_cred_lines.append, "env": no_cred_env, "timeoutMs": 20000}
+    )
+    no_cred_run = run_main(
+        [
+            "--jev",
+            "--out",
+            str(temp_dir("jev-skip-out")),
+            "--labels",
+            str(temp_dir("jev-skip") / "labels.jsonl"),
+        ],
+        {
+            "root": draw_root,
+            "scanner": draw_scanner,
+            "bin": no_cred_bin,
+            "env": {"STUB_AUTH_STATUS_EXIT": "3", "JEV_PROVIDER": "openrouter"},
+        },
+    )
+    check(
+        "jev gate skips no credential",
+        no_cred_gate["passed"] is False
+        and no_cred_lines == [
+            f"jev: path={no_cred_bin / 'jev'} provider=openrouter",
+            "jev arm skipped: no credential",
+        ]
+        and no_cred_run["code"] == 0
+        and "jev arm skipped: no credential" in no_cred_run["lines"],
+    )
+
+    version_bin = make_stubs()
+    version_env = stub_env(version_bin, {"STUB_JEV_VERSION": "jev 0.7.0"})
+    version_lines: list[str] = []
+    version_gate = S.jev_gate(
+        {"out": version_lines.append, "env": version_env, "timeoutMs": 20000}
+    )
+    check(
+        "jev gate skips a wrong version",
+        version_gate["passed"] is False
+        and version_lines == [
+            f"jev: path={version_bin / 'jev'} provider=official",
+            "jev arm skipped: version",
+            f'jev: found="jev 0.7.0" path={version_bin / "jev"}',
+        ]
+        and stub_log(version_bin, "jev") == [["--version"]],
+    )
+
+    jev_arm_bin = make_stubs()
+    jev_arm_env = stub_env(jev_arm_bin, {"JEV_PROVIDER": "openrouter"})
+    jev_arm_lines: list[str] = []
+    jev_arm_gate = S.jev_gate(
+        {"out": jev_arm_lines.append, "env": jev_arm_env, "timeoutMs": 20000}
+    )
+    jev_arm_out = temp_dir("jev-verdict")
+    jev_arm = S.run_jev_arm(
+        {"rows": verdict_rows, "baseline": verdict_baseline, "phrases": phrases},
+        jev_arm_gate,
+        {
+            "out": jev_arm_lines.append,
+            "env": jev_arm_env,
+            "timeoutMs": 20000,
+            "backoffMs": 1,
+            "callLog": S.create_call_log(jev_arm_out),
+            "stored": None,
+        },
+    )
+    jev_calls = [
+        call
+        for call in stub_log(jev_arm_bin, "jev")
+        if call[:1] == ["noul"] or call[:2] == ["auth", "test"]
+    ]
+    check(
+        "jev arm sends one --provider on every call",
+        jev_arm_gate["passed"] is True
+        and len(jev_calls) == 1 + S.JEV_RERUNS * len(verdict_rows)
+        and sum(1 for call in jev_calls if call[:2] == ["auth", "test"]) == 1
+        and sum(1 for call in jev_calls if call[:1] == ["noul"])
+        == S.JEV_RERUNS * len(verdict_rows)
+        and all(call.count("--provider") == 1 for call in jev_calls)
+        and all(
+            call[call.index("--provider") + 1] == "openrouter" for call in jev_calls
+        )
+        and any(
+            line.startswith(
+                "jev: payload: sections of tracked committed skill docs; "
+                "planned calls: 451; estimated input tokens: "
+            )
+            for line in jev_arm_lines
+        )
+        and jev_arm["column"]["line"] in jev_arm_lines,
+    )
+
+    stop_bin = make_stubs()
+    stop_env = stub_env(
+        stop_bin, {"STUB_NOUL_EXIT": "3", "JEV_PROVIDER": "openrouter"}
+    )
+    stop_lines: list[str] = []
+    stop_gate = S.jev_gate(
+        {"out": stop_lines.append, "env": stop_env, "timeoutMs": 20000}
+    )
+    stop_out = temp_dir("jev-stop")
+    stop_arm = S.run_jev_arm(
+        {"rows": verdict_rows, "baseline": verdict_baseline, "phrases": phrases},
+        stop_gate,
+        {
+            "out": stop_lines.append,
+            "env": stop_env,
+            "timeoutMs": 20000,
+            "backoffMs": 1,
+            "callLog": S.create_call_log(stop_out),
+            "stored": None,
+        },
+    )
+    check(
+        "jev exit 3 after the gate stops the arm",
+        stop_gate["passed"] is True
+        and stop_arm == {
+            "stopped": "jev arm stopped: key rejected",
+            "partialRows": 0,
+        }
+        and stop_lines[-2:]
+        == ["jev arm stopped: key rejected", "jev: partial rows=0"]
+        and not any(line.startswith("verdict") for line in stop_lines),
+    )
+
+    def verdict_entry(**overrides) -> dict:
+        """Build one category's counts with every keep-rule condition passing."""
+        entry = {
+            "K": 10, "M": 15, "A": 15, "B": 5, "W": 10, "L": 0,
+            "TP": 15, "FP": 0, "F": 0, "headroom": None,
+        }
+        entry.update(overrides)
+        return entry
+
+    keep_verdict = S.decide_verdict(
+        {category: verdict_entry() for category in S.CATEGORIES}, "jev"
+    )
+    check(
+        "verdict keep when every check passes",
+        keep_verdict["outcome"] == "keep"
+        and keep_verdict["reason"] is None
+        and S.verdict_text(keep_verdict) == "keep"
+        and keep_verdict["p"] < 0.05,
+    )
+
+    kill_verdict = S.decide_verdict(
+        {category: verdict_entry(TP=0, FP=5) for category in S.CATEGORIES}, "jev"
+    )
+    silent_verdict = S.decide_verdict(
+        {category: verdict_entry(TP=0, FP=0) for category in S.CATEGORIES}, "jev"
+    )
+    check(
+        "verdict kill (precision)",
+        kill_verdict["outcome"] == "kill"
+        and kill_verdict["reason"] == "precision"
+        and S.verdict_text(kill_verdict) == "kill (precision)"
+        and silent_verdict["outcome"] == "kill",
+    )
+
+    coverage_counts = {category: verdict_entry() for category in S.CATEGORIES}
+    coverage_counts[S.CATEGORIES[0]] = verdict_entry(M=8)
+    coverage_verdict = S.decide_verdict(coverage_counts, "deem")
+    check(
+        "verdict stop (coverage)",
+        coverage_verdict["outcome"] == "stop"
+        and coverage_verdict["reason"] == "coverage"
+        and S.verdict_text(coverage_verdict) == "stop (coverage)",
+    )
+
+    one_pass_verdict = S.decide_verdict(
+        {
+            S.CATEGORIES[0]: verdict_entry(),
+            S.CATEGORIES[1]: verdict_entry(A=5, B=5),
+            S.CATEGORIES[2]: verdict_entry(W=0, L=0),
+        },
+        "deem",
+    )
+    check(
+        "verdict stop (categories)",
+        one_pass_verdict["outcome"] == "stop"
+        and one_pass_verdict["reason"] == "categories"
+        and S.verdict_text(one_pass_verdict) == "stop (categories)",
+    )
+
+    check(
+        "sign test is exact and returns p 1 at no disagreements",
+        S.sign_test_p(5, 0) == {"p": 0.03125, "below": True}
+        and S.sign_test_p(4, 0)["p"] == 0.0625
+        and S.sign_test_p(4, 0)["below"] is False
+        and S.sign_test_p(0, 0) == {"p": 1, "below": False},
+    )
+
+    # Both switches in one call: each backend runs behind its own gate and the
+    # Jev column prints first, whatever the other column's outcome. The labels
+    # are mixed against the comparators so the zero-call run keeps the headroom
+    # both arms need before they may start.
+    both_bin = make_stubs()
+    both_labels = temp_dir("both-labels") / "labels.jsonl"
+    run_main(
+        ["--draw", "--seed", "7", "--labels", str(both_labels)],
+        {"root": draw_root, "scanner": draw_scanner},
+    )
+    both_rows = S.read_jsonl(both_labels)
+    both_tracked = S.tracked_files(draw_root)
+    for row in both_rows:
+        text = S.read_section(draw_root, row, both_tracked)
+        if row["category"] == "synonym-cycling":
+            row["label"] = (
+                "yes" if SIGNIFICANCE_TELL in text or FALSE_RANGE_TELL in text else "no"
+            )
+        else:
+            row["label"] = "no" if row["candidate"] else "yes"
+    S.write_jsonl(both_labels, both_rows)
+    both_out = temp_dir("both-out")
+    both_run = run_main(
+        ["--jev", "--deem", "--out", str(both_out), "--labels", str(both_labels)],
+        {"root": draw_root, "scanner": draw_scanner, "bin": both_bin},
+    )
+    both_lines = both_run["lines"]
+    jev_verdict_at = next(
+        (index for index, line in enumerate(both_lines) if line.startswith("verdict jev:")),
+        None,
+    )
+    deem_verdict_at = next(
+        (index for index, line in enumerate(both_lines) if line.startswith("verdict deem:")),
+        None,
+    )
+    check(
+        "both switches print Jev first",
+        both_run["code"] == 0
+        and jev_verdict_at is not None
+        and deem_verdict_at is not None
+        and jev_verdict_at < deem_verdict_at
+        and sum(
+            1 for line in both_lines[:jev_verdict_at] if line.startswith("category ")
+        )
+        == 3
+        and sum(
+            1
+            for line in both_lines[jev_verdict_at:deem_verdict_at]
+            if line.startswith("category ")
+        )
+        == 3,
+    )
+
+    idle_bin = make_stubs()
+    idle_dir = temp_dir("idle")
+    idle_labels = idle_dir / "labels.jsonl"
+    idle_run = run_main(
+        ["--labels", str(idle_labels)],
+        {"root": draw_root, "scanner": draw_scanner, "bin": idle_bin},
+    )
+    check(
+        "default run calls no stub and writes no file",
+        idle_run["code"] == 0
+        and stub_log(idle_bin, "jev") == []
+        and stub_log(idle_bin, "cli-deem") == []
+        and not (idle_dir / "report.json").exists()
+        and not (idle_dir / "calls.jsonl").exists()
+        and not idle_labels.exists()
+        and S.GATE_STOP_LINE in idle_run["lines"],
+    )
+
+    print(f"\n{'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
+    return 1 if failures else 0
+
+
+if __name__ == "__main__":
+    sys.exit(run())
```
