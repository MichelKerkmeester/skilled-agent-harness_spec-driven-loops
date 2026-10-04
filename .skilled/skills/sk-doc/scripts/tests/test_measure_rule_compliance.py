#!/usr/bin/env python3
"""Tests for sk-create-repo-rule's measure-rule-compliance.py over synthetic transcripts."""

import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List

SCRIPT = Path(__file__).resolve().parents[2] / "sk-create-repo-rule" / "scripts" / "measure-rule-compliance.py"

spec = importlib.util.spec_from_file_location("measure_rule_compliance", SCRIPT)
mrc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mrc)

LONG = "This reply is long enough to count as substantive prose for the analyzer. " * 7
RULE_HEADINGS = {
    "communication.md": "# Rule: Communication",
    "communication-prose.md": "# Rule: Communication prose",
    "scope-discipline.md": "# Rule: Scope discipline",
}


def make_repo(root: Path) -> Path:
    rules = root / ".skilled" / "repo-rules"
    rules.mkdir(parents=True)
    for name, heading in RULE_HEADINGS.items():
        (rules / name).write_text(f"---\ntitle: x\n---\n{heading}\n\nBody.\n")
    (root / "REPO RULES.md").write_text("# REPO RULES\n\nTrigger table.\n")
    return root


def write_jsonl(path: Path, records: List[Dict]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(r) + "\n" for r in records))
    return path


def stamp(minute: int, day: str = "2026-09-20") -> str:
    return f"{day}T10:{minute:02d}:00Z"


def tool(minute: int, name: str, tool_input: Dict, cwd: str) -> Dict:
    return {"type": "assistant", "timestamp": stamp(minute), "cwd": cwd,
            "message": {"role": "assistant", "content": [{"type": "tool_use", "name": name, "input": tool_input}]}}


def reply(minute: int, text: str, day: str = "2026-09-20") -> Dict:
    return {"type": "assistant", "timestamp": stamp(minute, day),
            "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}


def prompt(minute: int, text: str) -> Dict:
    return {"type": "user", "timestamp": stamp(minute), "message": {"role": "user", "content": text}}


def boundary(minute: int) -> Dict:
    return {"type": "system", "subtype": "compact_boundary", "timestamp": stamp(minute)}


def injection(minute: int, text: str) -> Dict:
    return {"type": "attachment", "timestamp": stamp(minute),
            "attachment": {"type": "hook_additional_context", "content": [text], "hookName": "SessionStart"}}


def analyze(repo: Path, claude_dir: Path, *extra: str, codex_dir: Path = None) -> Dict:
    args = [str(claude_dir), "--repo", str(repo), "--json"]
    args += ["--codex-dir", str(codex_dir)] if codex_dir else ["--no-codex"]
    out = subprocess.run([sys.executable, str(SCRIPT), *args, *extra], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def test_output_carries_no_transcript_text(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    markers = ["MARKERPROMPT7731", "MARKERREPLY7731", "MARKERCMD7731", "MARKERPATH7731", "MARKERHOOK7731"]
    records = [
        prompt(0, f"please write {markers[0]} as a table"),
        injection(1, f"{markers[4]}\n# Rule: Communication\n"),
        tool(2, "Bash", {"command": f"cat .skilled/repo-rules/communication.md # {markers[2]}"}, str(repo)),
        tool(3, "Write", {"file_path": str(repo / f"src/{markers[3]}.py"), "content": markers[1]}, str(repo)),
        reply(4, f"{LONG} {markers[1]}; with a semicolon\n\n| a | b |\n|---|---|\n| 1 | 2 |\n"),
    ]
    claude_dir = tmp_path / "claude"
    write_jsonl(claude_dir / "s1.jsonl", records)
    codex_dir = tmp_path / "codex"
    write_jsonl(codex_dir / "2026" / "09" / "20" / "c1.jsonl", [
        {"type": "session_meta", "timestamp": stamp(0), "payload": {"cwd": str(repo)}},
        {"type": "response_item", "timestamp": stamp(1),
         "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": markers[0]}]}},
        {"type": "response_item", "timestamp": stamp(2),
         "payload": {"type": "message", "role": "assistant", "phase": "final_answer",
                     "content": [{"type": "output_text", "text": LONG + markers[1]}]}},
    ])

    for mode in (["--json"], []):
        args = [str(claude_dir), "--repo", str(repo), "--codex-dir", str(codex_dir), *mode]
        out = subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True, check=True)
        combined = out.stdout + out.stderr
        for marker in markers:
            assert marker not in combined
        assert "sessions=1" in combined or '"total": 1' in combined


def test_gate5_counts_a_write_before_and_after_the_index_read(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    cwd = str(repo)
    write_jsonl(tmp_path / "claude" / "s1.jsonl", [
        tool(0, "Write", {"file_path": str(repo / "specs/x/spec.md")}, cwd),
        tool(1, "Edit", {"file_path": str(repo / "src/a.py")}, cwd),
        tool(2, "Read", {"file_path": str(repo / "REPO RULES.md")}, cwd),
        tool(3, "Write", {"file_path": str(repo / "src/b.py")}, cwd),
    ])

    claude = analyze(repo, tmp_path / "claude")["claude"]

    assert claude["gate5_per_write_miss"]["n"] == 2
    assert claude["gate5_per_write_miss"]["k"] == 1
    assert (claude["gate5_first_write_miss"]["n"], claude["gate5_first_write_miss"]["k"]) == (1, 1)
    assert claude["sessions"]["write"] == 1


def test_channels_and_windows_are_counted_separately(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    cwd = str(repo)
    write_jsonl(tmp_path / "claude" / "s1.jsonl", [
        tool(0, "Read", {"file_path": str(repo / ".skilled/repo-rules/scope-discipline.md")}, cwd),
        tool(1, "Bash", {"command": "cat .skilled/repo-rules/scope-discipline.md"}, cwd),
        boundary(2),
        injection(3, "intro\n# Rule: Scope discipline\nbody"),
    ])

    claude = analyze(repo, tmp_path / "claude")["claude"]

    assert claude["receipts"] == {"read": 1, "shell": 1, "other": 0, "inject": 1}
    windows = claude["compaction_windows"]
    assert (windows["total"], windows["with_receipt"]) == (2, 2)
    assert (windows["same_window_repeats"], windows["cross_window_rereads"]) == (1, 1)


def test_reply_rule_miss_is_scoped_to_the_compaction_window(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    cwd = str(repo)
    write_jsonl(tmp_path / "claude" / "s1.jsonl", [
        tool(0, "Read", {"file_path": str(repo / ".skilled/repo-rules/communication.md")}, cwd),
        tool(1, "Read", {"file_path": str(repo / ".skilled/repo-rules/communication-prose.md")}, cwd),
        reply(2, LONG),
        boundary(3),
        reply(4, LONG),
    ])

    first = analyze(repo, tmp_path / "claude")["claude"]["reply_rules_first_reply_miss"]["read_only"]

    assert (first["n"], first["k"]) == (2, 1)


def test_replies_split_by_the_rule_version_live_at_their_time(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    git_env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@example.com",
                   GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@example.com")

    def commit(when: str) -> None:
        env = dict(git_env, GIT_AUTHOR_DATE=when, GIT_COMMITTER_DATE=when)
        subprocess.run(["git", "-C", str(repo), "add", "-A"], check=True, env=env)
        subprocess.run(["git", "-C", str(repo), "commit", "-q", "--no-verify", "-m", "v"], check=True, env=env)

    subprocess.run(["git", "-C", str(repo), "init", "-q"], check=True)
    commit("2026-09-10T00:00:00Z")
    rule = repo / ".skilled" / "repo-rules" / "communication.md"
    rule.write_text(rule.read_text() + "\nA second version.\n")
    commit("2026-09-20T00:00:00Z")
    write_jsonl(tmp_path / "claude" / "s1.jsonl", [
        reply(0, LONG + "\n\n| a | b |\n|---|---|\n| 1 | 2 |\n", day="2026-09-15"),
        reply(1, LONG, day="2026-09-25"),
        reply(2, LONG, day="2026-09-26"),
    ])

    versions = analyze(repo, tmp_path / "claude")["claude"]["prohibitions"]["table"]["by_rule_version"]

    assert [(v["since"], v["n"], v["k"]) for v in versions.values()] == [("2026-09-10", 1, 1), ("2026-09-20", 2, 0)]


def test_codex_session_produces_a_codex_row(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    write_jsonl(tmp_path / "claude" / "none.jsonl", [])
    patch = f"const patch = \"*** Begin Patch\\n*** Update File: {repo}/src/a.py\\n@@\\n-x\\n+y\\n*** End Patch\";"
    codex_dir = tmp_path / "codex"
    write_jsonl(codex_dir / "2026" / "09" / "20" / "rollout.jsonl", [
        {"type": "session_meta", "timestamp": stamp(0), "payload": {"cwd": str(repo)}},
        {"type": "response_item", "timestamp": stamp(1),
         "payload": {"type": "custom_tool_call", "name": "exec",
                     "input": "await tools.exec_command({cmd: \"sed -n '1,40p' .skilled/repo-rules/communication.md\"})"}},
        {"type": "response_item", "timestamp": stamp(2),
         "payload": {"type": "custom_tool_call", "name": "exec", "input": patch}},
        {"type": "compacted", "timestamp": stamp(3), "payload": {}},
        {"type": "response_item", "timestamp": stamp(4),
         "payload": {"type": "message", "role": "assistant", "phase": "final_answer",
                     "content": [{"type": "output_text", "text": LONG}]}},
    ])
    write_jsonl(codex_dir / "2026" / "09" / "20" / "elsewhere.jsonl", [
        {"type": "session_meta", "timestamp": stamp(0), "payload": {"cwd": str(tmp_path / "other")}},
    ])

    codex = analyze(repo, tmp_path / "claude", codex_dir=codex_dir)["codex"]

    assert codex["sessions"] == {"write": 1, "read_only": 0, "total": 1}
    assert codex["receipts"]["shell"] == 1
    assert codex["compaction_windows"]["total"] == 2
    assert (codex["gate5_first_write_miss"]["n"], codex["gate5_first_write_miss"]["k"]) == (1, 1)
    assert codex["prohibitions"]["table"]["by_delivery"]["after"]["n"] == 1


def test_exempt_paths_mirror_the_spec_gate(tmp_path: Path) -> None:
    root = str(tmp_path / "repo")
    exempt = ["", "/tmp/elsewhere.py", "specs/a/spec.md", ".opencode/specs/x.md", ".git/config",
              "pkg/node_modules/x.js", "dist/app.js", "web/dist/app.js", ".worktrees/wt-1/specs/a.md"]
    gated = ["src/a.py", "AGENTS.md", ".worktrees/wt-1/src/a.py", "distribution/notes.md"]

    for path in exempt:
        assert mrc.is_exempt_target(path, root, root), path
    for path in gated:
        assert not mrc.is_exempt_target(path, root, root), path


def test_wilson_interval_matches_known_values() -> None:
    lo, hi = mrc.wilson(5, 10)
    assert (round(lo, 4), round(hi, 4)) == (0.2366, 0.7634)
    assert mrc.wilson(0, 0) is None
    assert round(mrc.wilson(0, 10)[1], 4) == 0.2775


def test_malformed_lines_are_counted_not_fatal(tmp_path: Path) -> None:
    repo = make_repo(tmp_path / "repo")
    path = tmp_path / "claude" / "s1.jsonl"
    path.parent.mkdir(parents=True)
    path.write_text("{not json\n" + json.dumps(reply(0, LONG)) + "\n")

    claude = analyze(repo, tmp_path / "claude")["claude"]

    assert claude["malformed_lines"] == 1
    assert claude["prohibitions"]["table"]["by_delivery"]["never"]["n"] == 1
