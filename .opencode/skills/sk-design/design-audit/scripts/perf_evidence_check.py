#!/usr/bin/env python3
"""Deterministic performance-evidence gate for filled design audit reports.

The audit score table can otherwise claim strong Performance quality with only
prose. This gate makes the report carry structural evidence: when the
Performance score is greater than 2, the filled Performance Evidence table must
include a metric value or an explicit not-assessed label. It checks presence
only; whether a metric came from a real run remains audit judgment.

Usage:
  perf_evidence_check.py audit-report.md
  perf_evidence_check.py --json audit-report.md

Exit: 0 = satisfied; 1 = violated or unfilled; 2 = usage/read/parse error.
"""
import json
from pathlib import Path
import re
import sys
from typing import Optional


SECTION_5 = re.compile(r"^##\s+5\.\s+FIVE-DIMENSION SCORE\b", re.I)
NEXT_SECTION = re.compile(r"^##\s+\d+\.\s+", re.I)
PERFORMANCE_EVIDENCE = re.compile(r"^###\s+Performance Evidence\b", re.I)
NEXT_HEADING = re.compile(r"^#{1,3}\s+")
NOT_ASSESSED = re.compile(r"\bnot[-\s]*assessed\b", re.I)
PLACEHOLDER = re.compile(r"^[_\s`-]+$")
PLACEHOLDER_RUN = re.compile(r"_{2,}")
SCORE_NUMBER = re.compile(r"(?<![\w.])([0-4](?:\.\d+)?)\b")
NUMBER_WITH_UNIT = re.compile(
    r"(?<![\w.])\d+(?:\.\d+)?\s*(?:ms|s|kb|mb|gb|px|fps|reqs?|requests?|%)(?!\w)",
    re.I,
)
CORE_WEB_VITAL_WITH_NUMBER = re.compile(
    r"\b(?:LCP|INP|CLS|FCP|TTFB)\b[^\n|]*\d+(?:\.\d+)?",
    re.I,
)


def _clean_cell(value: str) -> str:
    value = value.strip()
    while len(value) >= 2 and value[0] == "`" and value[-1] == "`":
        value = value[1:-1].strip()
    return value


def _strip_markdown(value: str) -> str:
    value = value.strip()
    value = re.sub(r"`([^`]*)`", r"\1", value)
    value = value.replace("**", "")
    return value.strip()


def _split_table_row(line: str) -> list[str]:
    line = line.strip()
    if not line.startswith("|") or not line.endswith("|"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def _is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def _is_placeholder(value: str) -> bool:
    cleaned = _strip_markdown(value)
    if not cleaned:
        return True
    if PLACEHOLDER_RUN.search(cleaned):
        return True
    return bool(PLACEHOLDER.fullmatch(cleaned))


def _extract_section(text: str, start_pattern: re.Pattern[str]) -> Optional[str]:
    lines = text.splitlines()
    start = None
    for index, line in enumerate(lines):
        if start_pattern.search(line):
            start = index
            break
    if start is None:
        return None

    end = len(lines)
    for index in range(start + 1, len(lines)):
        if NEXT_SECTION.search(lines[index]):
            end = index
            break
    return "\n".join(lines[start:end])


def _extract_heading_block(text: str, heading_pattern: re.Pattern[str]) -> Optional[str]:
    lines = text.splitlines()
    start = None
    for index, line in enumerate(lines):
        if heading_pattern.search(line):
            start = index
            break
    if start is None:
        return None

    end = len(lines)
    for index in range(start + 1, len(lines)):
        if NEXT_HEADING.search(lines[index]):
            end = index
            break
    return "\n".join(lines[start:end])


def _find_performance_score(section: str) -> Optional[str]:
    dimension_index = None
    score_index = None
    in_score_table = False

    for line in section.splitlines():
        cells = _split_table_row(line)
        if not cells:
            if in_score_table:
                break
            continue

        normalized = [_clean_cell(_strip_markdown(cell)).lower() for cell in cells]
        if "dimension" in normalized and any("score" in cell for cell in normalized):
            dimension_index = normalized.index("dimension")
            score_index = next(index for index, cell in enumerate(normalized) if "score" in cell)
            in_score_table = True
            continue

        if _is_separator_row(cells):
            continue

        if not in_score_table or dimension_index is None or score_index is None:
            continue

        if len(cells) <= max(dimension_index, score_index):
            continue

        dimension = _clean_cell(_strip_markdown(cells[dimension_index]))
        if dimension.lower() == "performance":
            return _clean_cell(_strip_markdown(cells[score_index]))

    return None


def _classify_score(score: Optional[str]) -> dict:
    if score is None:
        return {"status": "parse_error", "reason": "performance score row not found"}

    cleaned = _strip_markdown(score)
    if NOT_ASSESSED.search(cleaned):
        return {"status": "not_assessed", "score": cleaned, "requires_evidence": False}

    if _is_placeholder(cleaned):
        return {"status": "unfilled", "score": cleaned, "reason": "performance score not filled"}

    match = SCORE_NUMBER.search(cleaned)
    if not match:
        return {"status": "unfilled", "score": cleaned, "reason": "performance score not filled"}

    value = float(match.group(1))
    return {
        "status": "scored",
        "score": value,
        "requires_evidence": value > 2,
    }


def _evidence_answers(block: str) -> dict[str, str]:
    answers = {}
    for line in block.splitlines():
        cells = _split_table_row(line)
        if len(cells) < 2 or _is_separator_row(cells):
            continue

        label = _clean_cell(_strip_markdown(cells[0])).lower()
        answer = _strip_markdown(cells[1])
        if label in {"baseline", "post-change", "post change", "static-risk label", "measurement needed"}:
            answers[label] = answer
    return answers


def _filled_answer(value: str) -> str:
    return "" if _is_placeholder(value) else value


def _has_metric(value: str) -> bool:
    filled = _filled_answer(value)
    if not filled:
        return False
    return bool(NUMBER_WITH_UNIT.search(filled) or CORE_WEB_VITAL_WITH_NUMBER.search(filled))


def _has_not_assessed(values: list[str]) -> bool:
    return any(NOT_ASSESSED.search(_filled_answer(value)) for value in values)


def check(text: str) -> dict:
    section = _extract_section(text, SECTION_5)
    if section is None:
        return {
            "ok": False,
            "exit": 2,
            "reason": "Section 5 score table not found",
        }

    score = _find_performance_score(section)
    classification = _classify_score(score)
    if classification["status"] == "parse_error":
        return {
            "ok": False,
            "exit": 2,
            "reason": classification["reason"],
            "score": score,
        }

    if classification["status"] == "unfilled":
        return {
            "ok": False,
            "exit": 1,
            "reason": classification["reason"],
            "score": score,
        }

    if not classification.get("requires_evidence"):
        return {
            "ok": True,
            "exit": 0,
            "reason": "Performance score does not require metric evidence",
            "score": classification.get("score"),
        }

    block = _extract_heading_block(text, PERFORMANCE_EVIDENCE)
    if block is None:
        return {
            "ok": False,
            "exit": 1,
            "reason": "Perf score > 2 without Performance Evidence block",
            "score": classification["score"],
        }

    answers = _evidence_answers(block)
    baseline = answers.get("baseline", "")
    post_change = answers.get("post-change") or answers.get("post change", "")
    table_values = list(answers.values())
    has_metric = _has_metric(baseline) or _has_metric(post_change)
    has_not_assessed = _has_not_assessed(table_values)
    ok = has_metric or has_not_assessed
    return {
        "ok": ok,
        "exit": 0 if ok else 1,
        "reason": (
            "Performance evidence satisfied"
            if ok
            else "Perf score > 2 without numeric metric or not-assessed label"
        ),
        "score": classification["score"],
        "has_metric": has_metric,
        "has_not_assessed": has_not_assessed,
        "evidence_fields": answers,
    }


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    unknown_flags = [arg for arg in argv if arg.startswith("--") and arg != "--json"]
    paths = [arg for arg in argv if not arg.startswith("--")]
    if unknown_flags or len(paths) != 1:
        sys.stderr.write("usage: perf_evidence_check.py [--json] <filled-audit-report.md>\n")
        return 2

    path = Path(paths[0])
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as error:
        sys.stderr.write(f"cannot read {path}: {error}\n")
        return 2

    result = check(text)
    if as_json:
        print(json.dumps({"file": str(path), **result}, indent=2))
    else:
        print(f"Performance evidence gate - {path}")
        print(f"  score: {result.get('score', 'unknown')}")
        print(f"  status: {'PASS' if result['ok'] else 'FAIL'}")
        print(f"  reason: {result['reason']}")

    return int(result["exit"])


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
