#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: subject plan builder
# ───────────────────────────────────────────────────────────────
"""
Build the ordered subject rewrite plan for a pinned history tip.

Reads subject, body and changed paths for the whole tip in one git-log pass,
joins every commit with the packet plan the first pass produced, applies the
subject rules, and writes one JSON object per commit plus a before-and-after
review table.  A commit the rules cannot resolve becomes a residual row that
carries a one-line reason plus the paths and body head a later judge needs.

Usage:
    python3 build-subject-plan.py --repo . --tip <sha> \\
        --commit-plan plan.jsonl --out subject-plan.jsonl --table review.md

Output:
    <out> JSONL, one object per commit in plan order.
    <table> Markdown review table: rule counts, residual reasons, the rows
    where the most rules fired, a seeded random sample and every row whose
    new subject differs from the old beyond its first word.

Rules:
    R1  git-generated subjects (Merge, Revert, fixup!, squash!, amend!) stay.
    R2  a missing, legacy or unknown type is replaced from the changed files
        or from the summary verb.
    R3  an empty, numeric or non-kebab scope is replaced by the subsystem the
        changed paths name; nothing derivable marks a residual.
    R4  the summary starts lowercase, loses repeated spaces, trailing
        punctuation, process labels and a leading packet-number label.
    R5  the dominant packet's slug words are appended when the subject does
        not already carry one and the result stays under the length cap.
    R6  a subject still past the cap is trimmed at a word boundary below it,
        keeping the type and scope.
    R7  the result is re-checked against the commit-msg grammar, scope,
        lowercase, summary, vagueness and length rules; a failure is a
        residual.  R7 appears among a row's rules only when it rejected.

Determinism: the same tip and plan produce byte-identical output; the review
sample uses a fixed seed.
"""
import argparse
import json
import random
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

RECORD_SEP = b"\x00"
FIELD_SEP = b"\x1f"

EXEMPT_PREFIXES = ("Merge ", 'Revert "', "fixup! ", "squash! ", "amend! ")
ALLOWED_TYPES = (
    "build", "chore", "ci", "docs", "feat", "fix", "merge",
    "perf", "refactor", "release", "revert", "style", "test",
)
LEGACY_TYPES = {
    "spec": "docs", "research": "docs", "review": "docs",
    "config": "chore", "commit": "chore",
}
VERB_TYPES = (
    ("fix", "fix"), ("repair", "fix"), ("correct", "fix"), ("restore", "fix"),
    ("add", "feat"), ("create", "feat"), ("implement", "feat"), ("introduce", "feat"),
    ("rename", "refactor"), ("move", "refactor"), ("restructure", "refactor"), ("extract", "refactor"),
)
VAGUE_SUMMARIES = frozenset({
    "change files", "changes", "checkpoint", "cleanup", "fix", "fix bug", "misc",
    "misc changes", "miscellaneous changes", "stuff", "update", "update files",
    "update stuff", "various changes", "work in progress", "wip",
})

SUBJECT_RE = re.compile(
    r"^(?P<type>" + "|".join(ALLOWED_TYPES) + r")"
    r"\((?P<scope>[a-z0-9]+(?:-[a-z0-9]+)*)\)(?P<breaking>!)?: (?P<summary>.+)$"
)
LOOSE_SUBJECT_RE = re.compile(
    r"^\s*(?P<type>[A-Za-z][A-Za-z0-9_-]*)\((?P<scope>[^()]*)\)"
    r"(?P<breaking>!)?\s*:\s*(?P<summary>.*)$"
)
BARE_TYPE_RE = re.compile(
    r"^\s*(?P<type>[A-Za-z][A-Za-z0-9_-]*)(?P<breaking>!)?\s*:\s*(?P<summary>.*)$"
)
KEBAB_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
NUMERIC_SCOPE_RE = re.compile(r"^[0-9]+(?:-[0-9]+)*$")
REPEATED_SPACE_RE = re.compile(r" {2,}")
TRAILING_PUNCT_RE = re.compile(r"[.!?;:,]+\s*$")
LOWERCASE_START_RE = re.compile(r"^[a-z]")
LEADING_LABEL_RE = re.compile(
    r"^\s*\(?[0-9]{3}(?:[./-][A-Za-z0-9]+)+\)?"
    r"(?:\s*(?:[&,+]{1,2}\s*|and\s+)\(?[0-9]{3}(?:[./-][A-Za-z0-9]+)+\)?)*"
    r"\s*[:\-\u2013\u2014]?\s*"
    r"|^\s*\(?[0-9]{3}\)?\s*:\s*"
    r"|^\s*\(?[0-9]{3}\)?\s*[:\-\u2013\u2014]?\s+"
)
PROCESS_LABEL_RES = (
    re.compile(r"\b(?i:phase|wave|lane)[\s-]+(?:[0-9][a-z0-9]*|[A-Z][a-z0-9]*)"),
    re.compile(r"\b[0-9]+\s+tasks?\b", re.IGNORECASE),
    re.compile(r"\bswarms?\b", re.IGNORECASE),
    re.compile(r"\btranches?\b", re.IGNORECASE),
    re.compile(r"\bWU[0-9]+\b"),
    re.compile(r"\bW[0-9]+(?:\.[0-9]+)+\b"),
)
EDGE_CHARS = " \t:;,-\u2013\u2014\u2192"
EMPTY_BRACKETS_RE = re.compile(r"[\(\[\{]\s*[\)\]\}]")
SPACE_RUN_RE = re.compile(r"\s+")
SLUG_PREFIX_RE = re.compile(r"^[0-9]+-")

DOC_SUFFIXES = (".md", ".mdx", ".rst", ".txt")
TEST_DIRS = frozenset({"test", "tests", "__tests__"})
TEST_BASENAME_RE = re.compile(r"^(?:test_.+|.+_test\.[^.]*|.+\.(?:test|spec|tests)\.[^.]*)$")
CONFIG_BASENAMES = frozenset({
    "opencode.json", "opencode.jsonc", ".utcp_config.json", "package.json",
    "package-lock.json", "tsconfig.json", "pyproject.toml", "requirements.txt",
    "makefile", "setup.py", "setup.cfg", "deno.json", "cargo.toml", "go.mod",
})
GENERIC_CONFIG_BASENAMES = frozenset({
    "settings.json", "models.json", "mcp.json", "config.json", "config.toml",
})
SCOPE_LEVELS = ("skill", "git-hooks", "agents", "commands", "config", "readme")

MAX_SUBJECT = 100
TRIM_TARGET = 97
KEYWORD_MIN_LENGTH = 4
TABLE_SHA_LENGTH = 12
MAX_RESIDUAL_PATHS = 20
BODY_HEAD_LINES = 3
SAMPLE_SIZE = 100
SAMPLE_SEED = 28
TOP_RULE_ROWS = 40

ALL_RULES = ("R1", "R2", "R3", "R4", "R5", "R6", "R7")
REASON_NO_SCOPE = "R3: no subsystem derivable from the touched paths"
REASON_R4_EMPTY = "R4: the summary is empty after process-label cleanup"
REASON_NO_SUMMARY = "R7: the subject carries no summary text"
REASON_VAGUE = "R7: the summary is a vague label from the hook's list"
REASON_LENGTH = "R7: the subject stays past the length cap and cannot be trimmed"
REASON_SCOPE = "R7: the derived scope is not a lowercase kebab-case name"
REASON_GRAMMAR = "R7: the result does not match the type(scope): summary grammar"

# ───────────────────────────────────────────────────────────────
# 2. GIT ACCESS
# ───────────────────────────────────────────────────────────────


def run_git(repo: str, args: Sequence[str]) -> bytes:
    """Run a git command in repo and return its stdout, failing loudly."""
    completed = subprocess.run(["git", "-C", repo, *args], capture_output=True, check=False)
    if completed.returncode != 0:
        detail = completed.stderr.decode("utf-8", errors="replace").strip()
        raise SystemExit(f"error: git {' '.join(args)} failed: {detail}")
    return completed.stdout


def read_history(repo: str, tip: str) -> bytes:
    """Read subject, body and changed paths for the whole tip in one pass."""
    return run_git(
        repo,
        ["log", "--reverse", "--topo-order", "--format=%x00%H%x1f%s%x1f%b%x1f", "--name-only", tip],
    )


def parse_history(raw: bytes) -> Dict[str, Tuple[str, str, List[str]]]:
    """Index one git-log pass by commit hash into subject, body and paths."""
    history: Dict[str, Tuple[str, str, List[str]]] = {}
    for chunk in raw.split(RECORD_SEP):
        if not chunk:
            continue
        parts = chunk.split(FIELD_SEP, 3)
        if len(parts) != 4:
            raise SystemExit("error: unexpected git log record shape")
        old = parts[0].decode("ascii", errors="replace").strip()
        subject = parts[1].decode("utf-8", errors="replace")
        body = parts[2].decode("utf-8", errors="replace")
        paths = [line for line in parts[3].decode("utf-8", errors="replace").split("\n") if line]
        history[old] = (subject, body, paths)
    return history


def read_commit_plan(path: Path) -> List[Dict[str, object]]:
    """Read the first pass plan, one JSON object per line, in ordinal order."""
    rows: List[Dict[str, object]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


# ───────────────────────────────────────────────────────────────
# 3. HOOK GRAMMAR
# ───────────────────────────────────────────────────────────────


def subject_errors(subject: str) -> List[str]:
    """Port the commit-msg subject checks: grammar, scope, summary, length."""
    errors: List[str] = []
    match = SUBJECT_RE.match(subject)
    if match is None:
        return ["subject must match type(scope): a lowercase summary"]
    scope = match.group("scope")
    summary = match.group("summary")
    if NUMERIC_SCOPE_RE.match(scope):
        errors.append("scope is numeric-only")
    if LOWERCASE_START_RE.match(summary) is None:
        errors.append("summary does not start lowercase")
    if REPEATED_SPACE_RE.search(summary):
        errors.append("summary contains repeated spaces")
    if TRAILING_PUNCT_RE.search(summary):
        errors.append("summary ends with punctuation")
    if summary in VAGUE_SUMMARIES:
        errors.append("summary is too vague")
    if len(subject) > MAX_SUBJECT:
        errors.append("subject exceeds the length cap")
    return errors


def parse_subject(subject: str) -> Tuple[Optional[str], Optional[str], str, bool]:
    """Split a subject into type, scope, summary and the breaking marker."""
    match = SUBJECT_RE.match(subject)
    if match is not None:
        return (
            match.group("type"),
            match.group("scope"),
            match.group("summary"),
            bool(match.group("breaking")),
        )
    loose = LOOSE_SUBJECT_RE.match(subject)
    if loose is not None:
        return (
            loose.group("type").lower(),
            loose.group("scope"),
            loose.group("summary"),
            bool(loose.group("breaking")),
        )
    # A bare `type: summary` keeps a usable type and gains a scope from R3.
    bare = BARE_TYPE_RE.match(subject)
    if bare is not None:
        return (
            bare.group("type").lower(),
            None,
            bare.group("summary"),
            bool(bare.group("breaking")),
        )
    return None, None, subject, False


def compose(kind: str, scope: str, breaking: bool, summary: str) -> str:
    """Join the parts into the type(scope)[!]: summary shape."""
    marker = "!" if breaking else ""
    return f"{kind}({scope}){marker}: {summary}"


def trim_subject(subject: str) -> Optional[str]:
    """Trim past the cap at a word boundary to the target, keeping type and scope."""
    head, separator, summary = subject.partition(": ")
    if not separator:
        return None
    budget = TRIM_TARGET - len(head) - 2
    if budget < 1:
        return None
    kept = ""
    for word in summary.split(" "):
        candidate = word if not kept else f"{kept} {word}"
        if len(candidate) > budget:
            break
        kept = candidate
    if not kept:
        return None
    return f"{head}: {kept.rstrip(EDGE_CHARS + '+&')}"


def valid_scope(scope: Optional[str]) -> bool:
    """Return True for a lowercase kebab-case scope that is not numeric-only."""
    if not scope:
        return False
    if NUMERIC_SCOPE_RE.match(scope):
        return False
    return KEBAB_RE.match(scope) is not None


# ───────────────────────────────────────────────────────────────
# 4. TYPE AND SCOPE DERIVATION
# ───────────────────────────────────────────────────────────────


def kebab(name: str) -> str:
    """Lowercase a name and reduce every separator run to one hyphen."""
    return re.sub(r"[^a-z0-9]+", "-", name.strip().lower()).strip("-")


def first_word(text: str) -> str:
    """Return the first word with non-letters removed, lowercased."""
    for word in text.split():
        return re.sub(r"[^A-Za-z]+", "", word).lower()
    return ""


def is_doc(path: str) -> bool:
    """Return True when the path is a document file."""
    return path.lower().endswith(DOC_SUFFIXES)


def is_test(path: str) -> bool:
    """Return True when the path sits in a test tree or names a test file."""
    parts = path.split("/")
    if any(part.lower() in TEST_DIRS for part in parts[:-1]):
        return True
    return TEST_BASENAME_RE.match(parts[-1].lower()) is not None


def is_config(parts: Sequence[str], name: str) -> bool:
    """Return True for a named configuration file or a dotted-directory one."""
    lowered = name.lower()
    if lowered in CONFIG_BASENAMES:
        return True
    if lowered in GENERIC_CONFIG_BASENAMES and parts[0].startswith(".") and len(parts) >= 2:
        return True
    return False


def classify_path(path: str) -> Tuple[str, str]:
    """Return the (owner class, owner name) a changed path implies."""
    parts = [part for part in path.split("/") if part]
    if not parts:
        return "component", ""
    name = parts[-1]
    if len(parts) >= 3 and parts[0] == ".opencode" and parts[1] == "skills":
        return "skill", kebab(parts[2])
    if path.startswith(".opencode/scripts/git-hooks/") or name.startswith("install-git-hooks"):
        return "git-hooks", "git-hooks"
    if name == "AGENTS.md" or ("agents" in parts[:-1] and parts[0].startswith(".")):
        return "agents", "agents"
    if parts[0].startswith(".") and "commands" in parts[:-1]:
        return "commands", "commands"
    if is_config(parts, name):
        return "config", "config"
    if len(parts) == 1 and name.lower().startswith("readme"):
        return "readme", "readme"
    if parts[0] == "specs" or (parts[0] == ".opencode" and len(parts) > 1 and parts[1] == "specs"):
        return "specs", "specs"
    if is_doc(path):
        return "docs", "docs"
    if len(parts) >= 2:
        return "component", kebab(parts[0])
    return "component", kebab(Path(name).stem)


def dominant(names: Iterable[str]) -> Optional[str]:
    """Return the most frequent name, breaking ties lexicographically."""
    counts = Counter(name for name in names if name)
    if not counts:
        return None
    top = max(counts.values())
    return sorted(name for name, count in counts.items() if count == top)[0]


def derive_scope(paths: Sequence[str]) -> Optional[str]:
    """Derive the owning subsystem from the touched paths, in the skill's order."""
    if not paths:
        return None
    classes = [classify_path(path) for path in paths]
    owners = [owner for owner, _name in classes]
    if all(owner == "specs" for owner in owners):
        return "specs"
    if all(owner in ("specs", "docs") for owner in owners):
        return "docs"
    for level in SCOPE_LEVELS:
        name = dominant(name for owner, name in classes if owner == level)
        if name:
            return name
    return dominant(name for owner, name in classes if owner == "component")


def derive_type(paths: Sequence[str], summary: str) -> str:
    """Choose a type from the changed files, then from the summary verb."""
    if paths and all(is_doc(path) for path in paths):
        return "docs"
    if paths and all(is_test(path) for path in paths):
        return "test"
    verb = first_word(summary)
    for stem, kind in VERB_TYPES:
        if verb == stem:
            return kind
    return "chore"


# ───────────────────────────────────────────────────────────────
# 5. SUMMARY CLEANUP
# ───────────────────────────────────────────────────────────────


def lower_first(text: str) -> str:
    """Lowercase the summary start, an all-caps leading word in full."""
    token = text.split(" ", 1)[0]
    match = re.match(r"[^A-Za-z]*([A-Za-z]+)", token)
    if match and match.group(1).isupper():
        return token.lower() + text[len(token):]
    for index, char in enumerate(text):
        if char.isalpha():
            return text[:index] + char.lower() + text[index + 1:]
    return text


def clean_summary(summary: str) -> str:
    """Drop packet and process labels, then normalize spacing and punctuation."""
    text = LEADING_LABEL_RE.sub("", summary)
    for pattern in PROCESS_LABEL_RES:
        text = pattern.sub(" ", text)
    text = SPACE_RUN_RE.sub(" ", text)
    # Removing a process label can expose the packet label that followed it.
    text = LEADING_LABEL_RE.sub("", text)
    text = EMPTY_BRACKETS_RE.sub(" ", text)
    text = text.strip(EDGE_CHARS)
    text = TRAILING_PUNCT_RE.sub("", text)
    text = SPACE_RUN_RE.sub(" ", text).strip(EDGE_CHARS)
    return lower_first(text)


def packet_keyword(packet: Optional[str], subject: str) -> Optional[str]:
    """Return the ` for <slug words>` suffix R5 appends, or None when skipped."""
    if not packet:
        return None
    slug = SLUG_PREFIX_RE.sub("", packet.rsplit("/", 1)[-1])
    words = [
        word
        for word in re.split(r"[^a-z0-9]+", slug.lower())
        if len(word) >= KEYWORD_MIN_LENGTH and not word.isdigit()
    ]
    unique = list(dict.fromkeys(words))
    if not unique:
        return None
    lowered = subject.lower()
    if any(word in lowered for word in unique):
        return None
    return " for " + " ".join(unique)


# ───────────────────────────────────────────────────────────────
# 6. RULES
# ───────────────────────────────────────────────────────────────


def rejection_reason(errors: Sequence[str]) -> str:
    """Map the ported grammar errors to one sturdy residual reason."""
    if "summary is too vague" in errors:
        return REASON_VAGUE
    if "subject exceeds the length cap" in errors:
        return REASON_LENGTH
    if "scope is numeric-only" in errors:
        return REASON_SCOPE
    return REASON_GRAMMAR


def build_subject(
    subject: str, paths: Sequence[str], packet: Optional[str]
) -> Tuple[Optional[str], List[str], Optional[str]]:
    """Apply the ordered rules to one subject and report the rules that fired."""
    if subject.startswith(EXEMPT_PREFIXES):
        return subject, ["R1"], None
    kind, scope, summary, breaking = parse_subject(subject)
    rules: List[str] = []
    if kind not in ALLOWED_TYPES:
        kind = LEGACY_TYPES.get(kind or "", "") or derive_type(paths, summary)
        rules.append("R2")
    if not valid_scope(scope):
        derived = derive_scope(paths)
        if derived is None:
            return None, rules + ["R3"], REASON_NO_SCOPE
        scope = derived
        rules.append("R3")
    cleaned = clean_summary(summary)
    if cleaned != summary:
        rules.append("R4")
    if not cleaned:
        if summary.strip():
            return None, rules, REASON_R4_EMPTY
        return None, rules + ["R7"], REASON_NO_SUMMARY
    text = compose(kind, scope, breaking, cleaned)
    suffix = packet_keyword(packet, text)
    if suffix is not None and len(text) + len(suffix) <= MAX_SUBJECT:
        text = text + suffix
        rules.append("R5")
    if len(text) > MAX_SUBJECT:
        trimmed = trim_subject(text)
        if trimmed is None:
            return None, rules + ["R7"], REASON_LENGTH
        text = trimmed
        rules.append("R6")
    errors = subject_errors(text)
    if errors:
        return None, rules + ["R7"], rejection_reason(errors)
    return text, rules, None


def body_head(body: str) -> List[str]:
    """Return the first non-empty body lines a judge needs."""
    lines = [line.strip() for line in body.splitlines() if line.strip()]
    return lines[:BODY_HEAD_LINES]


def build_rows(
    plan_rows: Sequence[Dict[str, object]],
    history: Dict[str, Tuple[str, str, List[str]]],
) -> List[Dict[str, object]]:
    """Build one subject plan row per commit, in commit plan order."""
    rows: List[Dict[str, object]] = []
    for plan in plan_rows:
        old = str(plan.get("old", ""))
        entry = history.get(old)
        if entry is None:
            raise SystemExit(f"error: git log did not return commit {old}")
        subject, body, paths = entry
        packet = plan.get("spec")
        new_subject, rules, reason = build_subject(
            subject, paths, packet if isinstance(packet, str) else None
        )
        row: Dict[str, object] = {
            "old": old,
            "subject_old": subject,
            "subject_new": new_subject,
            "rules": rules,
            "residual": new_subject is None,
            "reason": reason,
        }
        if new_subject is None:
            row["paths"] = sorted(paths)[:MAX_RESIDUAL_PATHS]
            row["body_head"] = body_head(body)
        rows.append(row)
    return rows


def write_plan(path: Path, rows: Sequence[Dict[str, object]]) -> None:
    """Write the subject plan as one JSON object per line."""
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


# ───────────────────────────────────────────────────────────────
# 7. REVIEW TABLE
# ───────────────────────────────────────────────────────────────


def rule_counts(rows: Sequence[Dict[str, object]]) -> List[Tuple[str, int]]:
    """Count rows per rule, always in rule order and including zero."""
    counts: Counter = Counter()
    for row in rows:
        for rule in row["rules"]:  # type: ignore[union-attr]
            counts[str(rule)] += 1
    return [(rule, counts.get(rule, 0)) for rule in ALL_RULES]


def residual_counts(rows: Sequence[Dict[str, object]]) -> List[Tuple[str, int]]:
    """Count residual rows per reason, sorted for deterministic output."""
    counts: Counter = Counter(str(row["reason"]) for row in rows if row["residual"])
    return sorted(counts.items())


def top_rule_rows(rows: Sequence[Dict[str, object]]) -> List[Dict[str, object]]:
    """Return the rows where the most rules fired, ties in plan order."""
    ranked = sorted(enumerate(rows), key=lambda pair: (-len(pair[1]["rules"]), pair[0]))  # type: ignore[arg-type]
    return [row for _index, row in ranked[:TOP_RULE_ROWS]]


def sample_rows(rows: Sequence[Dict[str, object]]) -> List[Dict[str, object]]:
    """Return a seeded random sample in plan order."""
    size = min(SAMPLE_SIZE, len(rows))
    indices = sorted(random.Random(SAMPLE_SEED).sample(range(len(rows)), size))
    return [rows[index] for index in indices]


def changed_rows(rows: Sequence[Dict[str, object]]) -> List[Dict[str, object]]:
    """Return non-residual rows whose new subject differs beyond the first word."""
    selected: List[Dict[str, object]] = []
    for row in rows:
        new = row["subject_new"]
        if not isinstance(new, str):
            continue
        old_words = str(row["subject_old"]).split()
        new_words = new.split()
        if new_words == old_words:
            continue
        if new_words[1:] != old_words[1:]:
            selected.append(row)
    return selected


def escape_cell(value: object) -> str:
    """Escape a value so it cannot break out of a Markdown table cell."""
    text = "" if value is None else str(value)
    return text.replace("\\", "\\\\").replace("|", "\\|")


def table_row(row: Dict[str, object]) -> str:
    """Format one plan row as a Markdown table line."""
    new = row["subject_new"] if isinstance(row["subject_new"], str) else "(residual)"
    rules = " ".join(str(rule) for rule in row["rules"])  # type: ignore[union-attr]
    return "| {sha} | {old} | {new} | {rules} | {reason} |".format(
        sha=str(row["old"])[:TABLE_SHA_LENGTH],
        old=escape_cell(row["subject_old"]),
        new=escape_cell(new),
        rules=rules,
        reason=escape_cell(row["reason"]),
    )


def row_section(title: str, rows: Sequence[Dict[str, object]]) -> List[str]:
    """Format a titled table of plan rows."""
    lines = [
        f"## {title}",
        "",
        "| Commit | Old subject | New subject | Rules | Reason |",
        "|--------|-------------|-------------|-------|--------|",
    ]
    lines.extend(table_row(row) for row in rows)
    lines.append("")
    return lines


def write_table(path: Path, rows: Sequence[Dict[str, object]]) -> None:
    """Write the before-and-after review table."""
    residual_total = sum(1 for row in rows if row["residual"])
    lines = [
        "# Subject plan review",
        "",
        f"Total rows: {len(rows)}",
        f"Residual rows: {residual_total}",
        "",
        "## Rule counts",
        "",
        "| Rule | Rows |",
        "|------|------|",
    ]
    lines.extend(f"| {rule} | {count} |" for rule, count in rule_counts(rows))
    lines.extend(["", "## Residual reasons", "", "| Reason | Rows |", "|--------|------|"])
    lines.extend(f"| {escape_cell(reason)} | {count} |" for reason, count in residual_counts(rows))
    lines.append("")
    lines.extend(row_section("Rows where the most rules fired", top_rule_rows(rows)))
    lines.extend(row_section(f"Random sample (seed {SAMPLE_SEED})", sample_rows(rows)))
    lines.extend(
        row_section(
            "Rows whose new subject differs beyond the first word",
            changed_rows(rows),
        )
    )
    path.write_text("\n".join(lines), encoding="utf-8")


# ───────────────────────────────────────────────────────────────
# 8. CLI
# ───────────────────────────────────────────────────────────────


def summarise(rows: Sequence[Dict[str, object]]) -> str:
    """Format the total, per-rule counts, residual total and reasons."""
    lines = [f"total: {len(rows)}"]
    lines.extend(f"{rule}: {count}" for rule, count in rule_counts(rows))
    lines.append(f"residual: {sum(1 for row in rows if row['residual'])}")
    lines.extend(f"  {reason}: {count}" for reason, count in residual_counts(rows))
    return "\n".join(lines)


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    """Parse the command line."""
    parser = argparse.ArgumentParser(description="Build the ordered subject rewrite plan.")
    parser.add_argument("--repo", required=True, metavar="PATH", help="repository to read")
    parser.add_argument("--tip", required=True, metavar="SHA", help="commit the plan walks from")
    parser.add_argument("--commit-plan", required=True, metavar="JSONL", help="first pass packet plan")
    parser.add_argument("--out", required=True, metavar="JSONL", help="subject plan output path")
    parser.add_argument("--table", required=True, metavar="MD", help="review table output path")
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    """Build the subject plan, write both outputs and print the summary."""
    args = parse_args(argv)
    plan_rows = read_commit_plan(Path(args.commit_plan))
    history = parse_history(read_history(args.repo, args.tip))
    if len(history) != len(plan_rows):
        print(
            f"warning: plan has {len(plan_rows)} rows but the tip has {len(history)} commits",
            file=sys.stderr,
        )
    rows = build_rows(plan_rows, history)
    write_plan(Path(args.out), rows)
    write_table(Path(args.table), rows)
    print(summarise(rows), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
