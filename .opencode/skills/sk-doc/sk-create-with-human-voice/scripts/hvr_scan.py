#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# HVR SCAN — mechanical subset of the Human Voice Rules
# ───────────────────────────────────────────────────────────────

"""Scan prose for the deterministic Human Voice Rules findings.

The term lists are PARSED from the standard at
``.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`` on
every run. This file holds no copy of them. Edit the standard and the scanner
follows.

What it covers: the findings a machine can settle without reading for meaning.
Punctuation bans, the hard blocker words of section 6, the phrase blockers of
section 7, and the soft deductions of section 8.

What it does NOT cover: every structural and voice finding in sections 2, 4 and
5. Three-item enumerations, triple headers, synonym cycling, false ranges,
fragmented headers, copula avoidance, significance inflation, generic
conclusions and personality all need a reader. The printed subtotal is a floor
on the deductions, never the document's score.

Usage:
  python3 hvr_scan.py <file> [<file> ...]
  cat draft.md | python3 hvr_scan.py -
  python3 hvr_scan.py <file> --json
  python3 hvr_scan.py <file> --include-code     # do not skip code spans
  python3 hvr_scan.py <file> --rules <path>     # point at another standard

A target whose name marks it as a template (ends in "template"/"templates") and
sits in an assets/ or templates/ tree is scanned as if --include-code were
passed: its fenced block is the deliverable, not a quotation, and masking it by
default would let a banned character ride into every document authored from it.

Exit status: 0 when no hard blocker is found, 1 when at least one is,
2 on a usage or read error.
"""

import argparse
import json
import re
import sys
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 1. LOCATING THE STANDARD
# ───────────────────────────────────────────────────────────────

# scripts/ -> packet root -> references/hvr-rules.md
DEFAULT_RULES_PATH = (
    Path(__file__).resolve().parents[1] / "references" / "hvr-rules.md"
)

SEVERITY_POINTS = {"hard": 5, "soft2": 2, "soft1": 1, "review": 0}

# Fail-closed floors. A parse that returns fewer terms than these means the
# standard's shape moved out from under this parser, so the run stops instead
# of reporting a clean scan it never actually performed.
MINIMUM_TERMS = {
    "hardWords": 20,
    "hardPhrases": 10,
    "soft2": 8,
    "soft1": 20,
    "punctuation": 3,
}


# ───────────────────────────────────────────────────────────────
# 2. PARSING THE STANDARD
# ───────────────────────────────────────────────────────────────

def _section(text, title_contains):
    """Return the body of the H2 section whose title carries this phrase.

    Keyed on the title, not the section number, so renumbering the standard
    does not silently make the parser read a different section. A rename the
    parser cannot follow empties the list, which the caller treats as a hard
    failure rather than a clean scan.
    """
    pattern = re.compile(
        r"^## \d+\.[^\n]*%s[^\n]*\n(.*?)(?=^## \d+\.|\Z)" % re.escape(title_contains),
        re.MULTILINE | re.DOTALL | re.IGNORECASE,
    )
    found = pattern.search(text)
    return found.group(1) if found else ""


def _strip_parentheticals(line):
    """Drop ``(...)`` spans so a replacement suggestion is not read as a term."""
    return re.sub(r"\([^()]*\)", " ", line)


def _split_slashed(term):
    """Split ``utilize/utilizing`` into its two forms, leaving ``and/or`` alone."""
    parts = [part.strip() for part in term.split("/")]
    return [part for part in parts if part]


def _clean_terms(raw_terms):
    out = []
    for raw in raw_terms:
        for term in _split_slashed(raw):
            term = term.strip().strip(".,").lower()
            if not term or "[" in term:
                continue
            out.append(term)
    # Longest first so "in today's digital landscape" wins over "in today's".
    return sorted(set(out), key=lambda value: (-len(value), value))


def parse_word_blockers(text):
    """Core and extended blockers are hard, context-dependent are review."""
    body = _section(text, "HARD BLOCKER WORDS")
    hard_raw, context_raw = [], []
    bucket = None
    for line in body.splitlines():
        lowered = line.lower()
        if lowered.startswith("**core blockers") or lowered.startswith("**extended blockers"):
            bucket = hard_raw
        elif lowered.startswith("**context-dependent"):
            bucket = context_raw
        if bucket is None:
            continue
        bucket.extend(re.findall(r"`([^`]+)`", line))
    return _clean_terms(hard_raw), _clean_terms(context_raw)


def parse_phrase_blockers(text):
    """Every quoted phrase in the blocker bullet list is a hard blocker."""
    body = _section(text, "PHRASE HARD BLOCKERS")
    raw = []
    for line in body.splitlines():
        if not line.lstrip().startswith("-"):
            continue
        raw.extend(re.findall(r'"([^"]+)"', line))
    return _clean_terms(raw)


def parse_soft_deductions(text):
    """The -2 table, then the -1 prose groups."""
    body = _section(text, "SOFT DEDUCTIONS")
    two_raw, one_raw, transitions_raw = [], [], []

    two_block = re.search(r"### -2 Points Each(.*?)(?=^### )", body, re.MULTILINE | re.DOTALL)
    if two_block:
        for line in two_block.group(1).splitlines():
            if not line.strip().startswith("|"):
                continue
            cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
            if len(cells) < 2 or not cells[0] or set(cells[0]) <= set("-: "):
                continue
            if cells[0].lower() == "word":
                continue
            two_raw.append(cells[0])

    one_block = re.search(
        r"### -1 Point Each(.*?)(?=^### Context Flags)", body, re.MULTILINE | re.DOTALL
    )
    if one_block:
        for line in one_block.group(1).splitlines():
            if "**" not in line:
                continue
            target = transitions_raw if "**transitions**" in line.lower() else one_raw
            target.extend(re.findall(r'"([^"]+)"', _strip_parentheticals(line)))

    return _clean_terms(two_raw), _clean_terms(one_raw), _clean_terms(transitions_raw)


def parse_punctuation(text):
    """The punctuation rows whose action forbids a mark, read as literals."""
    body = _section(text, "PUNCTUATION STANDARDS")
    banned = []
    for line in body.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        name = cells[0].strip("* ").lower()
        symbol, action = cells[1], cells[2].lower()
        if "never" not in action and "only" not in action:
            continue
        banned.append({"name": name, "symbol": symbol})
    return banned


def load_rules(rules_path):
    text = Path(rules_path).read_text(encoding="utf-8")
    hard_words, context_words = parse_word_blockers(text)
    two, one, transitions = parse_soft_deductions(text)
    # A term listed as both an extended blocker and context-dependent is scored
    # once, as the hard blocker. Section 5 precedence, rule 2 over rule 3.
    context_words = [term for term in context_words if term not in set(hard_words)]
    return {
        "source": str(rules_path),
        "hardWords": hard_words,
        "contextWords": context_words,
        "hardPhrases": parse_phrase_blockers(text),
        "soft2": two,
        "soft1": one,
        "transitions": transitions,
        "punctuation": parse_punctuation(text),
    }


# ───────────────────────────────────────────────────────────────
# 3. MASKING WHAT HVR DOES NOT GOVERN
# ───────────────────────────────────────────────────────────────

FENCE = re.compile(r"^\s*(```|~~~)")

# A template's filename ends in "template" (a document ABOUT templates starts
# with the word instead, e.g. "template-guide.md"), which is how the skills tree
# already tells the two apart.
TEMPLATE_STEM_RE = re.compile(r"(?:^|[-_.])templates?$", re.IGNORECASE)


def is_template_path(path):
    """Return whether a target is a template payload rather than running prose.

    A template's whole output lives inside its own fenced block, so masking the
    fence by default reads past the only part that reaches a new file. A target
    counts as a template when its name marks it as one (see ``TEMPLATE_STEM_RE``)
    and it sits where the skills tree keeps a payload rather than prose about
    one: an ``assets/`` directory, or anywhere under a ``templates/`` tree.
    """
    normalized = str(path).replace("\\", "/")
    parts = [part for part in normalized.split("/") if part]
    if not parts:
        return False
    stem = Path(parts[-1]).stem
    if not TEMPLATE_STEM_RE.search(stem):
        return False
    parents = parts[:-1]
    return "assets" in parents or "templates" in parents


def mask_untargeted(lines, include_code):
    """Blank out frontmatter, fenced blocks and inline code spans.

    HVR governs prose. A banned word inside a code sample, a command, an
    identifier or a quoted error string is not a voice defect, and scoring it
    produces edits that break the sample. Masking replaces those spans with
    spaces so line and column numbers stay true.
    """
    masked = list(lines)
    if include_code:
        return masked

    start = 0
    if masked and masked[0].strip() == "---":
        for index in range(1, len(masked)):
            if masked[index].strip() == "---":
                start = index + 1
                break
        for index in range(0, start):
            masked[index] = " " * len(masked[index])

    in_fence = False
    for index in range(start, len(masked)):
        line = masked[index]
        if FENCE.match(line):
            in_fence = not in_fence
            masked[index] = " " * len(line)
            continue
        if in_fence:
            masked[index] = " " * len(line)
            continue
        masked[index] = re.sub(r"`[^`]*`", lambda m: " " * len(m.group(0)), line)
    return masked


# ───────────────────────────────────────────────────────────────
# 4. SCANNING
# ───────────────────────────────────────────────────────────────

def term_pattern(term):
    """Word-bounded where the term starts and ends on a word character."""
    escaped = re.escape(term)
    prefix = r"\b" if term[:1].isalnum() else ""
    suffix = r"\b" if term[-1:].isalnum() else ""
    return re.compile(prefix + escaped + suffix, re.IGNORECASE)


def scan_terms(lines, terms, category, severity, findings):
    for term in terms:
        pattern = term_pattern(term)
        for number, line in enumerate(lines, start=1):
            for match in pattern.finditer(line):
                findings.append(
                    {
                        "line": number,
                        "column": match.start() + 1,
                        "category": category,
                        "severity": severity,
                        "term": term,
                        "text": line.strip()[:120],
                    }
                )


def scan_punctuation(lines, banned, findings):
    for rule in banned:
        symbol, name = rule["symbol"], rule["name"]
        if "oxford" in name:
            pattern = re.compile(r",\s+(and|or)\s")
            severity, category = "review", "oxford-comma-candidate"
        elif "asterisk" in name:
            # The standard exempts Markdown source, which is what this scans.
            continue
        elif "quotation" in name:
            pattern = re.compile(r"[“”‘’]")
            severity, category = "hard", "punctuation"
        elif symbol in {"—", ";"}:
            pattern = re.compile(re.escape(symbol))
            severity, category = "hard", "punctuation"
        else:
            continue
        for number, line in enumerate(lines, start=1):
            for match in pattern.finditer(line):
                findings.append(
                    {
                        "line": number,
                        "column": match.start() + 1,
                        "category": category,
                        "severity": severity,
                        "term": match.group(0) if category == "punctuation" else symbol,
                        "text": line.strip()[:120],
                    }
                )


def apply_precedence(findings):
    """Section 5 rule precedence: one penalty per occurrence, first match wins.

    Occurrences are keyed by position. Hard beats soft, and a longer term beats
    a shorter one that overlaps it, so "in today's digital landscape" is scored
    once rather than three times.
    """
    order = {"hard": 0, "soft2": 1, "soft1": 2, "review": 3}
    findings.sort(
        key=lambda f: (f["line"], f["column"], order[f["severity"]], -len(str(f["term"])))
    )
    kept, claimed = [], []
    for finding in findings:
        start = (finding["line"], finding["column"])
        end = finding["column"] + len(str(finding["term"]))
        overlaps = any(
            line == finding["line"] and finding["column"] < stop and start[1] < stop
            for line, stop in claimed
        )
        if overlaps and finding["severity"] != "review":
            continue
        if finding["severity"] != "review":
            claimed.append((finding["line"], end))
        kept.append(finding)
    return kept


def score_transitions(findings, transitions):
    """A transition costs a point only from its third use onward."""
    seen = {}
    kept = []
    for finding in findings:
        if finding["category"] != "transition":
            kept.append(finding)
            continue
        term = finding["term"]
        seen[term] = seen.get(term, 0) + 1
        if seen[term] >= 3:
            kept.append(finding)
    return kept


def scan_text(text, rules, include_code=False):
    raw_lines = text.splitlines()
    lines = mask_untargeted(raw_lines, include_code)

    findings = []
    scan_punctuation(lines, rules["punctuation"], findings)
    scan_terms(lines, rules["hardPhrases"], "phrase-blocker", "hard", findings)
    scan_terms(lines, rules["hardWords"], "word-blocker", "hard", findings)
    scan_terms(lines, rules["contextWords"], "context-dependent", "review", findings)
    scan_terms(lines, rules["soft2"], "soft-deduction", "soft2", findings)
    scan_terms(lines, rules["soft1"], "soft-deduction", "soft1", findings)
    scan_terms(lines, rules["transitions"], "transition", "soft1", findings)

    findings = apply_precedence(findings)
    findings = score_transitions(findings, rules["transitions"])

    deductions = sum(SEVERITY_POINTS[f["severity"]] for f in findings)
    hard = sum(1 for f in findings if f["severity"] == "hard")
    return {
        "findings": findings,
        "hardBlockers": hard,
        "mechanicalDeductions": deductions,
        "mechanicalCeiling": max(0, 100 - deductions),
    }


# ───────────────────────────────────────────────────────────────
# 5. REPORTING
# ───────────────────────────────────────────────────────────────

UNSCORED = (
    "three-item enumeration, triple headers, setup language, synonym cycling, "
    "false ranges, fragmented headers, copula avoidance, significance inflation, "
    "generic conclusions, sentence rhythm, personality"
)


def render(path, result, every_occurrence=False):
    out = [f"HVR SCAN: {path}"]
    if result.get("templatePayload"):
        out.append("  template payload detected: fenced content scanned, not masked")
    findings = result["findings"]
    if not findings:
        out.append("  no mechanical findings")
    elif every_occurrence:
        for finding in findings:
            out.append(
                "  {line}:{column}  {severity:<6} {category:<20} {term}".format(**finding)
            )
    else:
        grouped = {}
        for finding in findings:
            key = (finding["severity"], finding["category"], finding["term"])
            entry = grouped.setdefault(key, {"count": 0, "first": finding["line"]})
            entry["count"] += 1
            entry["first"] = min(entry["first"], finding["line"])
        order = {"hard": 0, "soft2": 1, "soft1": 2, "review": 3}
        for (severity, category, term), entry in sorted(
            grouped.items(), key=lambda item: (order[item[0][0]], -item[1]["count"], item[0][2])
        ):
            out.append(
                f"  x{entry['count']:<4} first@{entry['first']:<5} "
                f"{severity:<6} {category:<22} {term}"
            )
        out.append("  (--all lists every occurrence with line and column)")
    out.append("")
    out.append(f"  hard blockers:          {result['hardBlockers']}")
    out.append(f"  mechanical deductions:  -{result['mechanicalDeductions']}")
    out.append(f"  mechanical ceiling:     {result['mechanicalCeiling']}/100")
    out.append(f"  NOT scored here:        {UNSCORED}")
    return "\n".join(out)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Scan prose for mechanical HVR findings.")
    parser.add_argument("targets", nargs="+", help="files to scan, or - for stdin")
    parser.add_argument("--rules", default=str(DEFAULT_RULES_PATH), help="path to hvr-rules.md")
    parser.add_argument("--json", action="store_true", help="emit JSON")
    parser.add_argument(
        "--all",
        dest="every_occurrence",
        action="store_true",
        help="list every occurrence instead of grouping by term",
    )
    parser.add_argument(
        "--include-code",
        action="store_true",
        help="scan code blocks and inline code too (off by default)",
    )
    args = parser.parse_args(argv)

    try:
        rules = load_rules(args.rules)
    except OSError as error:
        print(f"hvr_scan: cannot read the standard: {error}", file=sys.stderr)
        return 2

    thin = [name for name, floor in MINIMUM_TERMS.items() if len(rules[name]) < floor]
    if thin:
        print(
            "hvr_scan: the standard parsed too thin on " + ", ".join(sorted(thin)) + ". "
            "Its section shape changed and this parser needs updating. "
            "Refusing to report a clean scan from an unread standard.",
            file=sys.stderr,
        )
        return 2

    reports, worst = [], 0
    for target in args.targets:
        try:
            text = sys.stdin.read() if target == "-" else Path(target).read_text(encoding="utf-8")
        except OSError as error:
            print(f"hvr_scan: cannot read {target}: {error}", file=sys.stderr)
            return 2
        template_payload = target != "-" and is_template_path(target)
        result = scan_text(text, rules, include_code=args.include_code or template_payload)
        result["path"] = target
        result["templatePayload"] = template_payload
        reports.append(result)
        worst = max(worst, result["hardBlockers"])

    if args.json:
        print(json.dumps({"rulesSource": rules["source"], "reports": reports}, indent=2))
    else:
        print(
            "\n\n".join(
                render(report["path"], report, args.every_occurrence) for report in reports
            )
        )

    return 1 if worst else 0


if __name__ == "__main__":
    sys.exit(main())
