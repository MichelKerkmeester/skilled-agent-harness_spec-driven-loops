#!/usr/bin/env python3
"""
Claude Code PostToolUse hook — source edit warnings.

Reads the hook stdin JSON, extracts tool_input.file_path, runs the shared
checker, and prints a warning to stdout if violations are found.

Always exits 0 (fail-safe): never blocks the tool even if the checker fails.

Hook entry (settings.local.json):
  { "matcher": "Write|Edit",
    "hooks": [{ "type": "command",
                "command": "bash -c 'cd \"/...repo...\" && bash .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh'",
                "timeout": 10 }] }

See: .opencode/skills/sk-code/references/universal/code_style_guide.md §4
"""
import sys
import os
import json
import subprocess

COMMENT_CHECKER_REL = ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
DIST_CHECKER_REL = ".opencode/skills/sk-code/scripts/check-dist-staleness.sh"

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

def main():
    # --- Read stdin ---
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        # Malformed stdin — fail-safe
        sys.exit(0)

    # --- Check tool name ---
    tool_name = data.get("tool_name", "")
    if tool_name not in ("Write", "Edit"):
        sys.exit(0)

    # --- Extract file path ---
    tool_input = data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if not file_path or not os.path.isfile(file_path):
        sys.exit(0)

    # --- Locate checker relative to CWD or repo root ---
    cwd = data.get("cwd", os.getcwd())
    checker_path = resolve_checker(cwd, COMMENT_CHECKER_REL, "check-comment-hygiene.sh")

    if not os.path.isfile(checker_path):
        # Checker not found — fail-safe, log to stderr only
        print(f"WARNING: comment hygiene checker not found at {COMMENT_CHECKER_REL}", file=sys.stderr)
    else:
        # --- Run checker ---
        try:
            result = subprocess.run(
                [checker_path, file_path],
                capture_output=True,
                text=True,
                timeout=8,  # Well under the 10s hook timeout
            )
        except (subprocess.TimeoutExpired, OSError, Exception) as e:
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
                print("See: .opencode/skills/sk-code/references/universal/code_style_guide.md §4")
                print("Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.")
                print()

    dist_checker_path = resolve_checker(cwd, DIST_CHECKER_REL, "check-dist-staleness.sh")
    if os.path.isfile(dist_checker_path):
        try:
            dist_result = subprocess.run(
                [dist_checker_path, file_path],
                capture_output=True,
                text=True,
                timeout=8,
            )
        except (subprocess.TimeoutExpired, OSError, Exception) as e:
            print(f"WARNING: dist staleness checker failed: {e}", file=sys.stderr)
        else:
            if dist_result.stdout.strip():
                print()
                print(dist_result.stdout.strip())
                print()

    # Always exit 0 — this hook is warn-only, never blocking
    sys.exit(0)


if __name__ == "__main__":
    main()
