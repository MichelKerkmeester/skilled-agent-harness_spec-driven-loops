#!/usr/bin/env python3
"""
Claude Code PostToolUse hook — source edit warnings.

Reads the hook stdin JSON, extracts tool_input.file_path, runs the shared
checker, and prints a warning to stdout if violations are found.

Always exits 0 (fail-safe): never blocks the tool even if the checker fails.

Hook entry (settings.json):
  { "matcher": "Write|Edit",
    "hooks": [{ "type": "command",
                "command": "bash -c 'cd \"/...repo...\" && python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh'",
                "timeout": 10 }] }

See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4
"""
import sys
import os
import json
import subprocess
import time

COMMENT_CHECKER_REL = ".opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh"
DIST_CHECKER_REL = ".opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh"
HOOK_BUDGET_SECONDS = 9.0
CHECKER_TIMEOUT_SECONDS = 8.0
MIN_CHECKER_SECONDS = 0.5

def resolve_checker(cwd, checker_rel, fallback_name):
    checker_path = os.path.join(cwd, checker_rel)
    if os.path.isfile(checker_path):
        return checker_path
    checker_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..",
        fallback_name,
    )
    return os.path.normpath(checker_path)

def remaining_timeout(started_at):
    return min(CHECKER_TIMEOUT_SECONDS, HOOK_BUDGET_SECONDS - (time.monotonic() - started_at))

def main():
    started_at = time.monotonic()
    # --- Read stdin ---
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except Exception:
        # Malformed stdin — fail-safe
        return

    if not isinstance(data, dict):
        return

    # --- Check tool name ---
    tool_name = data.get("tool_name", "")
    if tool_name not in ("Write", "Edit"):
        return

    # --- Extract file path ---
    tool_input = data.get("tool_input")
    if not isinstance(tool_input, dict):
        tool_input = {}
    file_path = tool_input.get("file_path", "")

    if not isinstance(file_path, str) or not file_path or not os.path.isfile(file_path):
        return

    # --- Locate checker relative to CWD or repo root ---
    cwd = data.get("cwd")
    if not isinstance(cwd, str) or not cwd:
        cwd = os.getcwd()
    checker_path = resolve_checker(cwd, COMMENT_CHECKER_REL, "check-comment-hygiene.sh")

    if not os.path.isfile(checker_path):
        # Checker not found — fail-safe, log to stderr only
        print(f"WARNING: comment hygiene checker not found at {COMMENT_CHECKER_REL}", file=sys.stderr)
    else:
        # --- Run checker ---
        timeout = remaining_timeout(started_at)
        if timeout < MIN_CHECKER_SECONDS:
            print("WARNING: comment hygiene checker skipped because the hook deadline is exhausted", file=sys.stderr)
        else:
            try:
                result = subprocess.run(
                    [checker_path, file_path],
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                )
            except Exception as e:
                print(f"WARNING: comment hygiene checker failed: {e}", file=sys.stderr)
            else:
                if result.returncode == 1 and result.stdout.strip():
                    # Violations found — print a clear warning to stdout so Claude sees it
                    lines = result.stdout.strip().splitlines()
                    print()
                    print("COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.")
                    print("These references are unstable and will rot. Replace each with the durable WHY.")
                    print(f"Violations in {file_path}:")
                    for line in lines:
                        print(f"  {line}")
                    print("See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4")
                    print("Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.")
                    print()

    dist_checker_path = resolve_checker(cwd, DIST_CHECKER_REL, "check-dist-staleness.sh")
    if os.path.isfile(dist_checker_path):
        timeout = remaining_timeout(started_at)
        if timeout < MIN_CHECKER_SECONDS:
            print("WARNING: dist staleness checker skipped because the hook deadline is exhausted", file=sys.stderr)
        else:
            try:
                dist_result = subprocess.run(
                    [dist_checker_path, file_path],
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                )
            except Exception as e:
                print(f"WARNING: dist staleness checker failed: {e}", file=sys.stderr)
            else:
                if dist_result.stdout.strip():
                    print()
                    print(dist_result.stdout.strip())
                    print()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"WARNING: post-tool-use warning hook failed: {e}", file=sys.stderr)
    sys.exit(0)
