#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: MEASURE RULE COMPLIANCE
# ───────────────────────────────────────────────────────────────

"""
Measure how repo rules reach sessions and whether replies keep their prohibitions.

Reads Claude Code and Codex session transcripts (JSONL) and reports, per runtime:
delivery receipts by channel and compaction window, the Gate 5 miss rate (a
non-exempt write with no REPO RULES.md delivery earlier in its window), the reply
rule miss rate (the first substantive reply of a window without communication.md
and communication-prose.md delivered in that window), and five reply prohibitions
split by whether their rule was delivered, by the rule's git blob version, and,
for tables, by whether a table was asked for. Every rate carries its denominator
and a Wilson 95% interval.

A reply counts as "after" delivery only when its rule arrived earlier in the same
compaction window, "before" when the rule arrived elsewhere in the session, and
"never" otherwise. Injected text counts as delivery when it carries a rule's
title, as the rule or as its card, and the first line of its rule section.

Output is aggregates only. No prompt, reply, command or file path text is printed.

Usage: measure-rule-compliance.py [claude-dir] [max-sessions] [since-YYYY-MM-DD]
           [--codex-dir DIR | --no-codex] [--repo DIR] [--until ISO-TIMESTAMP]
           [--channels read,shell,inject] [--json]

Options:
    claude-dir      Claude Code project transcripts (default: derived from --repo)
    max-sessions    Newest sessions per runtime, by file mtime (default 200)
    since           Drop sessions that started before this date
    --codex-dir     Codex sessions root (default ~/.codex/sessions)
    --no-codex      Skip Codex
    --repo          Repository root: rule files, exempt paths, git history (default cwd)
    --until         Ignore every record after this timestamp, to rerun a past window
    --channels      Receipt channels that count as delivery (read, shell, other, inject)
    --json          Print JSON instead of text
"""

import argparse
import glob
import json
import math
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from typing import Dict, Iterator, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

MIN_REPLY_CHARS = 400
INDEX_RULE = "REPO RULES.md"
REPLY_RULES = ("communication.md", "communication-prose.md")
CHANNELS = ("read", "shell", "other", "inject")
DEFAULT_CHANNELS = ("read", "shell", "inject")
DECAY_BUCKETS = [(1, 3), (4, 10), (11, 30), (31, 10**9)]
CLAUDE_WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}
CLAUDE_SHELL_TOOLS = {"Bash"}

RULE_PATH = re.compile(r"repo-rules/([A-Za-z0-9_.-]+\.md)")
INDEX_PATH = re.compile(r"REPO(?: |\\ |%20)RULES\.md")
READ_VERB = re.compile(r"(?:^|[\s;&|(\"'`])(cat|sed|head|tail|nl|awk|less|more|bat|grep|rg)\b")
PATCH_PATH = re.compile(r"\*\*\* (?:Update|Add|Delete) File: ([^\\\n\"]+)|\*\*\* Move to: ([^\\\n\"]+)")
WORKTREE_PREFIX = re.compile(r"^\.worktrees/[^/]+/")
TABLE_ASK = re.compile(r"\b(tables?|matrix|comparison|compare)\b", re.I)

TABLE = re.compile(r"^\s*\|.*\|\s*$\n^\s*\|[\s:|-]+\|\s*$", re.M)
FENCE = re.compile(r"```.*?```", re.S)
INLINE = re.compile(r"`[^`\n]*`")
OPENER = re.compile(r"^\s*(great question|let me |i'll now|i will now|sure[,!]|certainly[,!])", re.I)
LABEL_FIRST_LINE = re.compile(r"^\s*(#{1,6}\s|\*\*?[A-Z][^*\n]{0,40}:\*?\*?\s*$|[A-Z][A-Za-z ]{0,30}:\s*$)")
# build-rule-cards.cjs titles a card "# Card: <rule title without its Rule: prefix>".
CARD_TITLE = re.compile(r"^#\s+(?:Rule:\s*)?")
THE_RULE = re.compile(r"^##\s+The rule\s*$")


def first_line(text: str) -> str:
    stripped = text.strip()
    return stripped.splitlines()[0] if stripped else ""


CHECKS = {
    # name: (governing rule file, predicate over the reply text and its prose-only form)
    "table": ("communication.md", lambda t, p: bool(TABLE.search(t))),
    "empty_opener": ("communication.md", lambda t, p: bool(OPENER.search(t))),
    "label_first_line": ("communication.md", lambda t, p: bool(LABEL_FIRST_LINE.match(first_line(t)))),
    "em_dash": ("communication-prose.md", lambda t, p: "—" in p),
    "semicolon": ("communication-prose.md", lambda t, p: ";" in p),
}

# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────


def wilson(successes: int, n: int, z: float = 1.96) -> Optional[Tuple[float, float]]:
    """Wilson score interval for a binomial proportion, as fractions."""
    if n == 0:
        return None
    phat = successes / n
    denom = 1 + z * z / n
    centre = (phat + z * z / (2 * n)) / denom
    half = z * math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n)) / denom
    return max(0.0, centre - half), min(1.0, centre + half)


def rate(successes: int, n: int) -> Dict:
    ci = wilson(successes, n)
    return {"n": n, "k": successes, "rate": successes / n if n else None, "ci95": ci}


def fmt_rate(r: Dict) -> str:
    if not r["n"]:
        return "n/a"
    lo, hi = r["ci95"]
    return f"{100 * r['rate']:.1f}% of {r['n']} [{100 * lo:.1f}-{100 * hi:.1f}]"


def to_epoch(ts: str) -> Optional[float]:
    if not ts:
        return None
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return None


def utc_day(epoch: float) -> str:
    return datetime.fromtimestamp(epoch, timezone.utc).strftime("%Y-%m-%d")


def prose_only(text: str) -> str:
    return INLINE.sub("", FENCE.sub("", text))


def is_exempt_target(path: str, repo: str, cwd: str) -> bool:
    """Mirror of isExemptTargetPath in system-spec-kit's spec-gate-core.mjs.

    Lexical only: transcripts outlive the files they name, so symlinks are not
    resolved. A `.worktrees/<name>/` prefix is stripped first, because inside a
    worktree the gate classifies paths against the worktree root.
    """
    if not path or not path.strip():
        return True
    absolute = os.path.normpath(path if path.startswith("/") else os.path.join(cwd or repo, path))
    root = os.path.normpath(repo)
    if absolute != root and not absolute.startswith(root + os.sep):
        return True
    relative = WORKTREE_PREFIX.sub("", absolute[len(root) + 1:])
    if relative in ("specs", ".opencode/specs") or relative.startswith(("specs/", ".opencode/specs/")):
        return True
    override = (os.environ.get("SPEC_KIT_SPECS_DIR") or os.environ.get("SPECKIT_SPECS_DIR") or "").strip()
    if override:
        override_root = os.path.normpath(os.path.join(root, override))
        if absolute == override_root or absolute.startswith(override_root + os.sep):
            return True
    if relative == ".git" or relative.startswith(".git/"):
        return True
    if "/node_modules/" in relative or relative.startswith("node_modules/"):
        return True
    if relative == "dist" or relative.startswith("dist/") or "/dist/" in relative:
        return True
    return False


def rule_names_in(text: str) -> List[str]:
    names = set(RULE_PATH.findall(text))
    if INDEX_PATH.search(text):
        names.add(INDEX_RULE)
    return sorted(names)


def tool_channel(is_read_tool: bool, is_shell: bool, text: str) -> str:
    if is_read_tool:
        return "read"
    if is_shell and READ_VERB.search(text):
        return "shell"
    return "other"


class Repo:
    """Rule files, their headings and their git history in one repository."""

    def __init__(self, root: str):
        self.root = os.path.abspath(root)
        rules_dir = os.path.join(self.root, ".skilled", "repo-rules")
        if not os.path.isdir(rules_dir):
            rules_dir = os.path.join(self.root, "repo-rules")
        self.rules_dir = rules_dir
        self.markers: Dict[str, Tuple[Tuple[str, ...], Optional[str]]] = {}
        paths = glob.glob(os.path.join(rules_dir, "*.md")) + [os.path.join(self.root, INDEX_RULE)]
        for path in paths:
            marker = self._marker(path)
            if marker:
                self.markers[os.path.basename(path)] = marker
        self._versions: Dict[str, List[Tuple[float, str]]] = {}

    @staticmethod
    def _marker(path: str) -> Optional[Tuple[Tuple[str, ...], Optional[str]]]:
        """The title lines a rule arrives under, as itself or as its generated card,
        and the first line of its rule section when it has one."""
        try:
            with open(path, errors="ignore") as handle:
                lines = handle.read().splitlines()
        except OSError:
            return None
        heading = next((line.strip() for line in lines if line.startswith("# ")), None)
        if heading is None:
            return None
        title = CARD_TITLE.sub("", heading)
        body = None
        for index, line in enumerate(lines):
            if THE_RULE.match(line):
                body = next((rest.strip() for rest in lines[index + 1:] if rest.strip()), None)
                break
        return (heading, f"# Card: {title}"), body

    def injected_rules(self, text: str) -> List[str]:
        """Rules whose title and opening rule line both appear in injected text.

        A title alone is a mention or a cut-off copy. Requiring the rule's first
        line as well credits only text that carried the rule itself.
        """
        lines = {line.strip() for line in text.splitlines()}
        return sorted(name for name, (titles, body) in self.markers.items()
                      if any(title in lines for title in titles) and (body is None or body in lines))

    def versions(self, rule: str) -> List[Tuple[float, str]]:
        """(commit time, short blob id) per commit that touched the rule, oldest first."""
        if rule in self._versions:
            return self._versions[rule]
        rel = os.path.relpath(os.path.join(self.rules_dir, rule), self.root)
        history: List[Tuple[float, str]] = []
        try:
            out = subprocess.run(
                ["git", "-C", self.root, "log", "--follow", "--format=%x00%H %ct", "--name-only", "--", rel],
                capture_output=True, text=True, check=True,
            ).stdout
        except (OSError, subprocess.CalledProcessError):
            out = ""
        for chunk in out.split("\x00")[1:]:
            lines = [line for line in chunk.strip().splitlines() if line]
            if len(lines) < 2:
                continue
            sha, ctime = lines[0].split()
            blob = subprocess.run(
                ["git", "-C", self.root, "rev-parse", "--short=7", f"{sha}:{lines[1]}"],
                capture_output=True, text=True,
            ).stdout.strip()
            if blob:
                history.append((float(ctime), blob))
        history.sort()
        merged: List[Tuple[float, str]] = []
        for when, blob in history:
            if not merged or merged[-1][1] != blob:
                merged.append((when, blob))
        self._versions[rule] = merged
        return merged

    def version_at(self, rule: str, when: Optional[float]) -> str:
        if when is None:
            return "unknown"
        live = "absent"
        for since, blob in self.versions(rule):
            if since <= when:
                live = blob
        return live

# ───────────────────────────────────────────────────────────────
# 3. ADAPTERS
# ───────────────────────────────────────────────────────────────
# Each adapter yields normalized events in transcript order:
#   ("boundary", ts)                 compaction boundary
#   ("receipt", ts, rule, channel)   a rule reached the context
#   ("write", ts, path, cwd)         a file write
#   ("prompt", ts, asked_for_table)  a user prompt
#   ("reply", ts, text)              an assistant message with no tool call
#   ("malformed",) / ("unknown",)    skipped lines and record shapes


def claude_session(path: str, repo: Repo, until: Optional[str]) -> Iterator[tuple]:
    cwd = ""
    with open(path, errors="ignore") as handle:
        for line in handle:
            try:
                obj = json.loads(line)
            except ValueError:
                yield ("malformed",)
                continue
            if not isinstance(obj, dict):
                yield ("unknown",)
                continue
            raw_ts = obj.get("timestamp", "") or ""
            if until and raw_ts > until:
                break
            ts = to_epoch(raw_ts)
            cwd = obj.get("cwd") or cwd
            kind = obj.get("type")
            if kind == "system" and obj.get("subtype") == "compact_boundary":
                yield ("boundary", ts)
                continue
            if kind == "attachment":
                attachment = obj.get("attachment") or {}
                if attachment.get("type") == "hook_additional_context":
                    content = attachment.get("content")
                    text = "\n".join(map(str, content)) if isinstance(content, list) else str(content or "")
                    for rule in repo.injected_rules(text):
                        yield ("receipt", ts, rule, "inject")
                continue
            msg = obj.get("message") or {}
            content = msg.get("content")
            if kind == "user" and msg.get("role") == "user" and not (obj.get("isCompactSummary") or obj.get("isMeta")):
                if isinstance(content, str):
                    yield ("prompt", ts, bool(TABLE_ASK.search(content)))
                elif isinstance(content, list):
                    texts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
                    if texts and not any(isinstance(b, dict) and b.get("type") == "tool_result" for b in content):
                        yield ("prompt", ts, bool(TABLE_ASK.search(" ".join(texts))))
                continue
            if msg.get("role") != "assistant" or not isinstance(content, list):
                continue
            has_tool = False
            for block in content:
                if not isinstance(block, dict) or block.get("type") != "tool_use":
                    continue
                has_tool = True
                name = block.get("name", "")
                tool_input = block.get("input") or {}
                dumped = json.dumps(tool_input)
                channel = tool_channel(name == "Read", name in CLAUDE_SHELL_TOOLS, str(tool_input.get("command", "")))
                for rule in rule_names_in(dumped):
                    yield ("receipt", ts, rule, channel)
                if name in CLAUDE_WRITE_TOOLS:
                    target = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
                    yield ("write", ts, target, cwd)
            if not has_tool:
                text = "".join(b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text")
                yield ("reply", ts, text)


def codex_session(path: str, repo: Repo, until: Optional[str]) -> Iterator[tuple]:
    cwd = ""
    with open(path, errors="ignore") as handle:
        for line in handle:
            try:
                obj = json.loads(line)
            except ValueError:
                yield ("malformed",)
                continue
            if not isinstance(obj, dict):
                yield ("unknown",)
                continue
            raw_ts = obj.get("timestamp", "") or ""
            if until and raw_ts > until:
                break
            ts = to_epoch(raw_ts)
            kind = obj.get("type")
            payload = obj.get("payload") or {}
            if kind in ("session_meta", "turn_context"):
                cwd = payload.get("cwd") or cwd
                continue
            if kind == "compacted":
                yield ("boundary", ts)
                continue
            if kind != "response_item":
                continue
            item = payload.get("type")
            if item == "message":
                role = payload.get("role")
                parts = payload.get("content") or []
                text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
                if role == "assistant":
                    if payload.get("phase") in (None, "final_answer"):
                        yield ("reply", ts, text)
                elif role in ("user", "developer"):
                    for rule in repo.injected_rules(text):
                        yield ("receipt", ts, rule, "inject")
                    # Codex delivers AGENTS.md and environment context as user messages.
                    if role == "user" and not text.lstrip().startswith(("<", "# AGENTS.md")):
                        yield ("prompt", ts, bool(TABLE_ASK.search(text)))
            elif item in ("custom_tool_call", "function_call"):
                call = str(payload.get("input") or payload.get("arguments") or "")
                is_shell = "exec_command" in call or payload.get("name") in ("shell", "exec_command")
                channel = tool_channel(False, is_shell, call)
                for rule in rule_names_in(call):
                    yield ("receipt", ts, rule, channel)
                for update, moved in PATCH_PATH.findall(call):
                    yield ("write", ts, (update or moved).strip(), cwd)
            elif item in ("custom_tool_call_output", "function_call_output", "reasoning"):
                continue
            else:
                yield ("unknown",)


def session_start(path: str) -> str:
    with open(path, errors="ignore") as handle:
        for line in handle:
            try:
                ts = json.loads(line).get("timestamp", "")
            except (ValueError, AttributeError):
                continue
            if ts:
                return ts[:10]
    return ""


def codex_cwd(path: str) -> str:
    with open(path, errors="ignore") as handle:
        for line in handle:
            try:
                obj = json.loads(line)
            except ValueError:
                continue
            if obj.get("type") == "session_meta":
                return (obj.get("payload") or {}).get("cwd", "") or ""
    return ""

# ───────────────────────────────────────────────────────────────
# 4. MEASURES
# ───────────────────────────────────────────────────────────────


class RuntimeStats:
    """Folds one runtime's sessions into counts; turns them into rates on demand."""

    def __init__(self, repo: Repo, channels: Tuple[str, ...]):
        self.repo = repo
        self.channels = channels
        self.sessions = {"write": 0, "read_only": 0}
        self.first_day: Optional[str] = None
        self.last_day: Optional[str] = None
        self.malformed = 0
        self.unknown = 0
        self.receipts = {c: 0 for c in CHANNELS}
        self.windows = 0
        self.windows_with_receipt = 0
        self.distinct_per_window: List[int] = []
        self.same_window_repeats = 0
        self.cross_window_rereads = 0
        self.gate5_first = [0, 0]  # [eligible, misses]
        self.gate5_writes = [0, 0]
        self.reply_first = {"write": [0, 0], "read_only": [0, 0]}
        self.reply_rule_missing = {rule: [0, 0] for rule in REPLY_RULES}
        self.checks = {n: {s: [0, 0] for s in ("before", "after", "never")} for n in CHECKS}
        self.decay = {n: {b: [0, 0] for b in DECAY_BUCKETS} for n in CHECKS}
        self.versions = {n: {} for n in CHECKS}
        self.table_ask = {k: [0, 0] for k in ("requested", "document", "other")}

    def add_session(self, events: Iterator[tuple]) -> None:
        window_rules: set = set()
        seen_rules: set = set()
        window_has_reply = False
        window_count = 1
        first_write_done = False
        gate5_first_miss = None
        writes_seen = False
        asked_table = False
        rules = sorted({rule for rule, _ in CHECKS.values()})
        since = {rule: None for rule in rules}
        delivered: set = set()
        replies = []
        session_reply_first = []

        def close_window() -> None:
            self.distinct_per_window.append(len(window_rules))
            if window_rules:
                self.windows_with_receipt += 1

        for event in events:
            kind = event[0]
            if kind == "malformed":
                self.malformed += 1
                continue
            if kind == "unknown":
                self.unknown += 1
                continue
            ts = event[1]
            if ts is not None:
                day = utc_day(ts)
                self.first_day = min(self.first_day or day, day)
                self.last_day = max(self.last_day or day, day)
            if kind == "boundary":
                close_window()
                window_rules = set()
                window_has_reply = False
                window_count += 1
                # Compaction drops the rule text, so the next window starts undelivered.
                since = {rule: None for rule in rules}
            elif kind == "receipt":
                _, _, rule, channel = event
                self.receipts[channel] += 1
                if channel not in self.channels:
                    continue
                if rule in window_rules:
                    self.same_window_repeats += 1
                elif rule in seen_rules:
                    self.cross_window_rereads += 1
                window_rules.add(rule)
                seen_rules.add(rule)
                if rule in since:
                    since[rule] = 0
                    delivered.add(rule)
            elif kind == "write":
                _, _, target, cwd = event
                if is_exempt_target(target, self.repo.root, cwd):
                    continue
                writes_seen = True
                missed = INDEX_RULE not in window_rules
                self.gate5_writes[0] += 1
                self.gate5_writes[1] += missed
                if not first_write_done:
                    first_write_done = True
                    gate5_first_miss = missed
            elif kind == "prompt":
                asked_table = event[2]
            elif kind == "reply":
                text = event[2]
                if len(text) < MIN_REPLY_CHARS:
                    continue
                for rule in rules:
                    if since[rule] is not None:
                        since[rule] += 1
                if not window_has_reply:
                    window_has_reply = True
                    missing = [r for r in REPLY_RULES if r not in window_rules]
                    session_reply_first.append(bool(missing))
                    for rule in REPLY_RULES:
                        self.reply_rule_missing[rule][0] += 1
                        self.reply_rule_missing[rule][1] += rule in missing
                replies.append((text, dict(since), ts, asked_table))
        close_window()
        self.windows += window_count

        kind_key = "write" if writes_seen else "read_only"
        self.sessions[kind_key] += 1
        if gate5_first_miss is not None:
            self.gate5_first[0] += 1
            self.gate5_first[1] += gate5_first_miss
        for missed in session_reply_first:
            self.reply_first[kind_key][0] += 1
            self.reply_first[kind_key][1] += missed

        for text, snap, ts, asked in replies:
            prose = prose_only(text)
            for name, (rule, test) in CHECKS.items():
                hit = bool(test(text, prose))
                state = "after" if snap[rule] is not None else ("before" if rule in delivered else "never")
                self.checks[name][state][0] += 1
                self.checks[name][state][1] += hit
                if snap[rule] is not None:
                    for lo, hi in DECAY_BUCKETS:
                        if lo <= snap[rule] <= hi:
                            self.decay[name][(lo, hi)][0] += 1
                            self.decay[name][(lo, hi)][1] += hit
                version = self.repo.version_at(rule, ts)
                cell = self.versions[name].setdefault(version, [0, 0])
                cell[0] += 1
                cell[1] += hit
            bucket = "requested" if asked else ("document" if first_line(text).startswith("# ") else "other")
            self.table_ask[bucket][0] += 1
            self.table_ask[bucket][1] += bool(TABLE.search(text))

    def report(self) -> Dict:
        windows = self.distinct_per_window
        return {
            "sessions": dict(self.sessions, total=sum(self.sessions.values())),
            "window": [self.first_day, self.last_day],
            "malformed_lines": self.malformed,
            "unknown_records": self.unknown,
            "delivery_channels": list(self.channels),
            "receipts": dict(self.receipts),
            "compaction_windows": {
                "total": self.windows,
                "with_receipt": self.windows_with_receipt,
                "mean_distinct_rules": (sum(windows) / len(windows)) if windows else None,
                "same_window_repeats": self.same_window_repeats,
                "cross_window_rereads": self.cross_window_rereads,
            },
            "gate5_first_write_miss": rate(self.gate5_first[1], self.gate5_first[0]),
            "gate5_per_write_miss": rate(self.gate5_writes[1], self.gate5_writes[0]),
            "reply_rules_first_reply_miss": {k: rate(v[1], v[0]) for k, v in self.reply_first.items()},
            "reply_rule_missing": {k: rate(v[1], v[0]) for k, v in self.reply_rule_missing.items()},
            "prohibitions": {
                name: {
                    "rule": CHECKS[name][0],
                    "by_delivery": {s: rate(v[1], v[0]) for s, v in self.checks[name].items()},
                    "decay_after_delivery": {f"{lo}-{hi if hi < 10**8 else '+'}": rate(v[1], v[0])
                                             for (lo, hi), v in self.decay[name].items()},
                    "by_rule_version": {
                        ver: dict(rate(v[1], v[0]), since=self._version_day(CHECKS[name][0], ver))
                        for ver, v in sorted(self.versions[name].items(),
                                             key=lambda kv: self._version_day(CHECKS[name][0], kv[0]) or "")
                    },
                }
                for name in CHECKS
            },
            "table_by_request": {k: rate(v[1], v[0]) for k, v in self.table_ask.items()},
        }

    def _version_day(self, rule: str, blob: str) -> Optional[str]:
        for when, version in self.repo.versions(rule):
            if version == blob:
                return utc_day(when)
        return None

# ───────────────────────────────────────────────────────────────
# 5. REPORT
# ───────────────────────────────────────────────────────────────


def print_text(results: Dict[str, Dict]) -> None:
    print(f"min_reply_chars={MIN_REPLY_CHARS} rates: share of n [Wilson 95% interval]")
    for runtime, r in results.items():
        s, w = r["sessions"], r["compaction_windows"]
        print(f"\n== {runtime}: sessions={s['total']} (write {s['write']}, read-only {s['read_only']}) "
              f"window={r['window'][0]}..{r['window'][1]} malformed={r['malformed_lines']} unknown={r['unknown_records']}")
        print("receipts: " + " ".join(f"{c}={n}" for c, n in r["receipts"].items())
              + f" | delivery counts {','.join(r['delivery_channels'])}")
        mean = f"{w['mean_distinct_rules']:.2f}" if w["mean_distinct_rules"] is not None else "n/a"
        print(f"windows={w['total']} with_receipt={w['with_receipt']} mean_distinct_rules={mean} "
              f"same_window_repeats={w['same_window_repeats']} cross_window_rereads={w['cross_window_rereads']}")
        print(f"gate5 miss: first write {fmt_rate(r['gate5_first_write_miss'])} | "
              f"every write {fmt_rate(r['gate5_per_write_miss'])}")
        first = r["reply_rules_first_reply_miss"]
        print(f"reply rules miss (first reply per window): write sessions {fmt_rate(first['write'])} | "
              f"read-only sessions {fmt_rate(first['read_only'])}")
        print("   missing per rule: " + " | ".join(f"{k} {fmt_rate(v)}" for k, v in r["reply_rule_missing"].items()))
        for name, p in r["prohibitions"].items():
            d = p["by_delivery"]
            print(f"{name} [{p['rule']}] before={fmt_rate(d['before'])} after={fmt_rate(d['after'])} "
                  f"never={fmt_rate(d['never'])}")
            print("   decay after delivery: " + " | ".join(f"replies {k}: {fmt_rate(v)}"
                                                         for k, v in p["decay_after_delivery"].items()))
            print("   by rule version: " + " | ".join(f"{ver} (from {v['since'] or '-'}): {fmt_rate(v)}"
                                                    for ver, v in p["by_rule_version"].items()))
        print("table by request: " + " | ".join(f"{k} {fmt_rate(v)}" for k, v in r["table_by_request"].items()))


def is_within(path: str, root: str) -> bool:
    path = os.path.normpath(path) if path else ""
    return path == root or path.startswith(root + os.sep)


def newest(paths: List[str], limit: int) -> List[str]:
    return sorted(paths, key=os.path.getmtime, reverse=True)[:limit]


def run(args: argparse.Namespace) -> Dict[str, Dict]:
    repo = Repo(args.repo)
    channels = tuple(c.strip() for c in args.channels.split(",") if c.strip())
    unknown = [c for c in channels if c not in CHANNELS]
    if unknown:
        raise SystemExit(f"Error: unknown channel(s): {', '.join(unknown)}")
    claude_dir = args.claude_dir or os.path.expanduser(
        os.path.join("~/.claude/projects", re.sub(r"[^A-Za-z0-9]", "-", repo.root)))
    results: Dict[str, Dict] = {}

    stats = RuntimeStats(repo, channels)
    for path in newest(glob.glob(os.path.join(claude_dir, "*.jsonl")), args.max_sessions):
        if args.since and session_start(path) < args.since:
            continue
        stats.add_session(claude_session(path, repo, args.until))
    results["claude"] = stats.report()

    if not args.no_codex:
        stats = RuntimeStats(repo, channels)
        candidates = [p for p in glob.glob(os.path.join(args.codex_dir, "**", "*.jsonl"), recursive=True)
                      if is_within(codex_cwd(p), repo.root)]
        for path in newest(candidates, args.max_sessions):
            if args.since and session_start(path) < args.since:
                continue
            stats.add_session(codex_session(path, repo, args.until))
        results["codex"] = stats.report()
    return results


def parse_args(argv: List[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Measure repo rule delivery and reply compliance (aggregates only).")
    parser.add_argument("claude_dir", nargs="?", help="Claude Code project transcripts directory")
    parser.add_argument("max_sessions", nargs="?", type=int, default=200, help="newest sessions per runtime")
    parser.add_argument("since", nargs="?", help="drop sessions that started before YYYY-MM-DD")
    parser.add_argument("--codex-dir", default=os.path.expanduser("~/.codex/sessions"))
    parser.add_argument("--no-codex", action="store_true")
    parser.add_argument("--repo", default=os.getcwd())
    parser.add_argument("--until", help="ignore records after this ISO timestamp")
    parser.add_argument("--channels", default=",".join(DEFAULT_CHANNELS))
    parser.add_argument("--json", action="store_true")
    return parser.parse_args(argv)

# ───────────────────────────────────────────────────────────────
# 6. ENTRY POINT
# ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    arguments = parse_args(sys.argv[1:])
    output = run(arguments)
    if arguments.json:
        print(json.dumps(output, indent=2))
    else:
        print_text(output)
