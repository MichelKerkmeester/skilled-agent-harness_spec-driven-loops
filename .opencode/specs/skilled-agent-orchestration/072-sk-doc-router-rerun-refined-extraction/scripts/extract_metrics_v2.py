#!/usr/bin/env python3
"""extract_metrics_v2.py — refined extractor; only counts POSITIVE resource mentions.

Improvement over 071's extract_metrics.py:
- detect_resources() now skips paths mentioned in NEGATIVE contexts:
  "Not loaded:", "would NOT load", "would not load", "excluded:", "filtered out:",
  "skipped:", "not in the load set", "would NOT be loaded".
- Resources mentioned in lines starting with one of those negative markers (or the
  preceding sentence-fragment) are excluded from the resource set.
- Heuristic: split response into "positive-load" and "negative-load" segments by
  looking for negative-marker phrases; resources in negative segments are dropped.

Output: matrix_v2.csv (same schema as 071's matrix.csv).
"""

import csv
import json
import re
import sys
from pathlib import Path

REPO = Path("/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public")
PB = REPO / ".opencode/skills/sk-doc/manual_testing_playbook"
PHASE2_071 = REPO / ".opencode/specs/skilled-agent-orchestration/071-sk-doc-router-stress-test/002-matrix-execute"
LOGS = PHASE2_071 / "logs"
DELTAS = PHASE2_071 / "deltas"
PACKET_072 = REPO / ".opencode/specs/skilled-agent-orchestration/072-sk-doc-router-rerun-refined-extraction"
MATRIX_V2 = PACKET_072 / "matrix_v2.csv"

INTENTS = ["DOC_QUALITY", "OPTIMIZATION", "SKILL_CREATION", "AGENT_COMMAND",
           "FLOWCHART", "INSTALL_GUIDE", "HVR", "PLAYBOOK", "FEATURE_CATALOG",
           "README_CREATION", "CHANGELOG", "UNKNOWN_FALLBACK"]

NEGATIVE_MARKERS = [
    r"not\s+loaded\s*:",
    r"would\s+NOT\s+load",
    r"would\s+not\s+load",
    r"excluded\s*:",
    r"filtered\s+out\s*:",
    r"skipped\s*:",
    r"not\s+in\s+the\s+load\s+set",
    r"would\s+NOT\s+be\s+loaded",
    r"would\s+not\s+be\s+loaded",
    r"not\s+conditional\s*-\s*loaded",
    r"not\s+selected\s*:",
    r"NOT\s+loaded\s*:",
    r"don'?t\s+load",
    r"resources\s+not\s+loaded",
]

NEGATIVE_PATTERN = re.compile(r"|".join(NEGATIVE_MARKERS), re.IGNORECASE)


def parse_scenario_frontmatter(path):
    text = path.read_text()
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return None
    fm = {}
    body = m.group(1)
    current_list_key = None
    for line in body.split("\n"):
        if not line.strip():
            continue
        m2 = re.match(r"^([a-z_]+):\s*(.*)$", line)
        if m2:
            key, val = m2.group(1), m2.group(2).strip()
            if val:
                fm[key] = val.strip("'\"")
                current_list_key = None
            else:
                fm[key] = []
                current_list_key = key
        elif line.startswith("  - ") and current_list_key:
            fm[current_list_key].append(line[4:].strip())
    return fm


def parse_codex_log(path):
    text = path.read_text()
    tok_m = re.search(r"tokens used\s*\n\s*([\d,]+)", text)
    tokens_total = int(tok_m.group(1).replace(",", "")) if tok_m else 0
    resp = text
    for marker in ["hook: Stop Completed\n", "hook: Stop\n"]:
        if marker in resp:
            resp = resp.split(marker)[-1]
    resp = re.sub(r"^tokens used\s*\n\s*[\d,]+\s*\n", "", resp, count=1)
    return {"tokens_total": tokens_total, "tokens_input": 0, "tokens_output": 0,
            "response": resp.strip()}


def parse_copilot_log(path):
    text = path.read_text()
    up_m = re.search(r"Tokens[^↑]*↑\s*([\d.]+)([kKM]?)", text)
    down_m = re.search(r"↓\s*([\d.]+)([kKM]?)", text)

    def to_int(num, suffix):
        n = float(num)
        if suffix.lower() == "k":
            n *= 1000
        elif suffix.lower() == "m":
            n *= 1_000_000
        return int(n)

    tokens_input = to_int(up_m.group(1), up_m.group(2)) if up_m else 0
    tokens_output = to_int(down_m.group(1), down_m.group(2)) if down_m else 0
    resp = re.sub(r"\n+Changes\s+\+\d+.*$", "", text, flags=re.DOTALL)
    return {"tokens_total": tokens_input + tokens_output,
            "tokens_input": tokens_input,
            "tokens_output": tokens_output,
            "response": resp.strip()}


def parse_opencode_log(path):
    text = path.read_text()
    response_parts = []
    tokens_total = tokens_input = tokens_output = 0
    cost = 0.0
    for line in text.split("\n"):
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            evt = json.loads(line)
        except json.JSONDecodeError:
            continue
        etype = evt.get("type", "")
        if etype == "text":
            txt = evt.get("part", {}).get("text", "")
            if txt:
                response_parts.append(txt)
        elif etype == "step_finish":
            tk = evt.get("part", {}).get("tokens", {})
            if isinstance(tk, dict):
                tokens_total += tk.get("total", 0)
                tokens_input += tk.get("input", 0)
                tokens_output += tk.get("output", 0)
            cost += evt.get("part", {}).get("cost", 0.0) or 0.0
    return {"tokens_total": tokens_total,
            "tokens_input": tokens_input,
            "tokens_output": tokens_output,
            "response": "\n".join(response_parts).strip(),
            "cost_usd_reported": cost}


def detect_intent(response_text):
    for intent in INTENTS:
        if re.search(rf"\b{intent}\b", response_text):
            return intent
    return ""


def detect_resources_v2(response_text, expected_resources):
    """REFINED v2: returns set of FILE BASENAMES mentioned in POSITIVE segments only.

    Captures both full paths (`references/global/foo.md`) AND short filename
    mentions (`foo.md`) — many CLIs cite resources by basename only after the
    section header (`References (references/):` then bare `foo.md` lines).
    Returns basenames so cross-CLI comparison is fair against expected_resources
    (which we also normalize to basenames in main()).
    """
    if not response_text:
        return []
    # Strip "negative segments" — paragraphs that lead with a negative marker
    paragraphs = re.split(r"\n\s*\n", response_text)
    positive_text_parts = []
    for para in paragraphs:
        head = para[:250]
        if NEGATIVE_PATTERN.search(head):
            continue
        positive_text_parts.append(para)
    positive_text = "\n\n".join(positive_text_parts)

    basenames = set()

    # 1) Full paths under references/ or assets/ — extract basename
    for m in re.finditer(r"`?(?:references|assets)/[\w/.-]+\.md", positive_text):
        basenames.add(m.group(0).strip("`").split("/")[-1])

    # 2) Short filename mentions (only if they match an expected basename)
    expected_basenames = {Path(r).name for r in expected_resources}
    for bn in expected_basenames:
        # Match bn as backticked or bare word, but not as part of a path that's
        # already been captured (avoid double-counting)
        if re.search(rf"\b{re.escape(bn)}\b", positive_text):
            basenames.add(bn)

    return sorted(basenames)


def load_delta(cli, scenario_id):
    delta_file = DELTAS / f"{cli}.jsonl"
    for line in delta_file.read_text().split("\n"):
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        if d.get("scenario") == scenario_id and d.get("cli") == cli:
            return d
    return {}


def main():
    rows = []
    scenarios = sorted(PB.rglob("[0-9][0-9][0-9]-*.md"))
    for scenario_path in scenarios:
        fm = parse_scenario_frontmatter(scenario_path)
        if not fm:
            continue
        sid = fm.get("id", "")
        expected_intent = fm.get("expected_intent", "")
        expected_resources = set(fm.get("expected_resources", []))

        expected_intent_set = set()
        for tok in re.split(r"\s*(?:->|→|or|,)\s*", expected_intent):
            tok = tok.strip()
            if tok:
                expected_intent_set.add(tok)

        for cli in ["codex", "copilot", "opencode"]:
            log_path = LOGS / sid / f"{cli}.log"
            if not log_path.exists():
                continue
            if cli == "codex":
                parsed = parse_codex_log(log_path)
            elif cli == "copilot":
                parsed = parse_copilot_log(log_path)
            else:
                parsed = parse_opencode_log(log_path)

            delta = load_delta(cli, sid)
            response = parsed.get("response", "")
            picked_intent = detect_intent(response)
            # Compare BASENAMES across both sides for fair cross-CLI matching
            mentioned_basenames = set(detect_resources_v2(response, expected_resources))
            expected_basenames = {Path(r).name for r in expected_resources}

            intent_match = picked_intent in expected_intent_set
            fp_count = len(mentioned_basenames - expected_basenames)
            tp_count = len(mentioned_basenames & expected_basenames)
            fn_count = len(expected_basenames - mentioned_basenames)
            accuracy_pct = round(100.0 * tp_count / max(len(expected_basenames), 1), 1) \
                if expected_basenames else 0.0

            rows.append({
                "scenario_id": sid,
                "scenario_title": fm.get("title", ""),
                "category": fm.get("category", ""),
                "cli": cli,
                "exit_code": delta.get("exit", -1),
                "duration_s": delta.get("duration_s", 0),
                "tokens_total": parsed.get("tokens_total", 0),
                "tokens_input": parsed.get("tokens_input", 0),
                "tokens_output": parsed.get("tokens_output", 0),
                "expected_intent": " | ".join(sorted(expected_intent_set)),
                "picked_intent": picked_intent,
                "intent_match": intent_match,
                "expected_resources_count": len(expected_basenames),
                "mentioned_resources_count": len(mentioned_basenames),
                "true_positive_resources": tp_count,
                "false_positive_resources": fp_count,
                "false_negative_resources": fn_count,
                "accuracy_pct": accuracy_pct,
                "response_chars": len(response),
            })

    PACKET_072.mkdir(parents=True, exist_ok=True)
    with MATRIX_V2.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows to {MATRIX_V2}")

    by_cli = {}
    for r in rows:
        cli = r["cli"]
        by_cli.setdefault(cli, []).append(r)
    print("\n=== PER-CLI SUMMARY (v2) ===")
    for cli, cli_rows in sorted(by_cli.items()):
        intent_correct = sum(1 for r in cli_rows if r["intent_match"])
        avg_dur = sum(r["duration_s"] for r in cli_rows) / len(cli_rows)
        avg_tok = sum(r["tokens_total"] for r in cli_rows) / len(cli_rows)
        avg_acc = sum(r["accuracy_pct"] for r in cli_rows) / len(cli_rows)
        avg_fp = sum(r["false_positive_resources"] for r in cli_rows) / len(cli_rows)
        exit_zero = sum(1 for r in cli_rows if r["exit_code"] == 0)
        print(f"\n{cli.upper()}:")
        print(f"  Cells:                    {len(cli_rows)}")
        print(f"  Exit-0 rate:              {exit_zero}/{len(cli_rows)}")
        print(f"  Intent-pick accuracy:     {intent_correct}/{len(cli_rows)} ({100*intent_correct/len(cli_rows):.0f}%)")
        print(f"  Avg duration:             {avg_dur:.1f}s")
        print(f"  Avg total tokens:         {avg_tok:.0f}")
        print(f"  Avg resource accuracy:    {avg_acc:.1f}%")
        print(f"  Avg false-positive refs:  {avg_fp:.2f}")


if __name__ == "__main__":
    sys.exit(main())
