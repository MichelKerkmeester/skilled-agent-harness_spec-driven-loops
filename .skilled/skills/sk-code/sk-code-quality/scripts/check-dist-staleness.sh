#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DIST STALENESS CHECKER
# ───────────────────────────────────────────────────────────────
"""
Dist staleness checker for edited source files.

Usage:
  check-dist-staleness.sh <file>   Check the one watched package that owns <file>.
  check-dist-staleness.sh --all    Check every watched package.

Always exits 0. If a watched TypeScript build surface is stale, or the checker
reports it could not verify a package, prints a bounded banner to stdout for the
caller to surface in-session.

Coverage contract: the default (single-file) mode is intentionally
edited-file-scoped -- it warns only for the package that owns the just-edited
file, keeping each PostToolUse invocation fast and targeted. Cross-package
coverage (a package left stale by an edit elsewhere) is provided by the --all
mode, which the Claude SessionStart hook runs once per session. This mirrors the
OpenCode plugin, which likewise checks all packages at session start and warns
per-turn while scoping per-edit work to the edited file.
"""
# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import json
import os
import re
import subprocess
import sys
from typing import Any, Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

CHECKER_REL = ".skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs"

# ───────────────────────────────────────────────────────────────
# 3. HOOK CONFIGURATION
# ───────────────────────────────────────────────────────────────


def _hook_flags_config() -> Dict[str, str]:
    # Operator config file; env vars still override it. Fail-open on any error.
    try:
        override = os.environ.get("HOOK_FLAGS_CONFIG")
        path = override if override else os.path.join(
            _source_root_from_script(), "hooks", "hook-flags.env"
        )
        cfg = {}
        # utf-8-sig drops a byte order mark, which would otherwise stay on the
        # first name, as the hooks' own readers drop it.
        with open(path, "r", encoding="utf-8-sig") as fh:
            for raw in fh:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, val = line.partition("=")
                key = key.strip()
                # A '#' after a space or tab ends the value, as in the hooks'
                # own resolver, so a line with a trailing comment still counts.
                val = re.sub(r"[ \t]#.*$", "", val).strip()
                if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
                    val = val[1:-1]
                if key:
                    cfg[key] = val
        return cfg
    except (OSError, UnicodeError):
        return {}


def _hook_enabled(concern: str) -> bool:
    def _truthy(v: Any) -> bool:
        return str(v or "").strip().lower() in ("1", "true", "yes", "on")
    cfg = _hook_flags_config()

    def _resolve(key: str) -> Optional[str]:
        return os.environ[key] if key in os.environ else cfg.get(key)

    if _truthy(_resolve("SYSTEM_HOOKS_DISABLED")):
        return False
    import re
    flag = "SYSTEM_" + re.sub(r"[^A-Z0-9]+", "_", concern.upper()) + "_DISABLED"
    if _truthy(_resolve(flag)):
        return False
    return True


# ───────────────────────────────────────────────────────────────
# 4. PATH AND CHECKER HELPERS
# ───────────────────────────────────────────────────────────────


def _source_root_from_script() -> str:
    # The real path, so a copy reached through a runtime link still finds the
    # tree it belongs to, under whichever name that tree carries.
    script_dir = os.path.dirname(os.path.realpath(__file__))
    # scripts -> code-quality -> sk-code -> skills -> source root
    return os.path.abspath(os.path.join(script_dir, "../../../.."))


def _repo_root_from_script() -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # scripts -> code-quality -> sk-code -> skills -> .skilled -> repo root
    return os.path.abspath(os.path.join(script_dir, "../../../../.."))


def _resolve_checker() -> Tuple[str, str]:
    repo_root = os.getcwd()
    checker = os.path.join(repo_root, CHECKER_REL)
    if not os.path.isfile(checker):
        repo_root = _repo_root_from_script()
        checker = os.path.join(repo_root, CHECKER_REL)
    return repo_root, checker


def _run_checker(
    checker: str,
    repo_root: str,
    command_args: List[str],
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """Return the checker's verdict, or (None, reason) when it holds none."""
    try:
        result = subprocess.run(
            ["node", checker, *command_args],
            capture_output=True,
            text=True,
            timeout=8,
            cwd=repo_root,
        )
    except (OSError, subprocess.TimeoutExpired, UnicodeError) as exc:
        if not _read_only_requested():
            print(f"WARNING: dist freshness checker failed: {exc}", file=sys.stderr)
        return None, f"the checker could not run: {exc}"

    text = result.stdout.strip()
    if not text:
        return None, _no_verdict_reason(result)
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        first_line = text.splitlines()[0][:160]
        return None, f"the checker printed output that is not a verdict: {first_line}"
    if not isinstance(payload, dict):
        return None, "the checker printed a verdict that is not an object"
    return payload, None


def _no_verdict_reason(result: Any) -> str:
    if result.returncode == 0:
        return "the checker printed no verdict"
    stderr_lines = (result.stderr or "").strip().splitlines()
    detail = f": {stderr_lines[0][:160]}" if stderr_lines else ""
    return f"the checker exited {result.returncode} without printing a verdict{detail}"


def _print_stale(payload: Dict[str, Any]) -> None:
    package_name = payload.get("packageName") or payload.get("packageId") or "unknown package"
    rebuild_command = payload.get("rebuildCommand") or "npm run build"
    print(f"STALE DIST WARNING: {package_name} -- run: {rebuild_command}")


def _print_error(payload: Dict[str, Any], target: str = "") -> None:
    package_name = payload.get("packageName") or payload.get("packageId") or target or "unknown package"
    message = payload.get("message")
    if not message:
        # An unprovisioned package is the one error a payload can name without a
        # message, and saying so is the reason the caller needs.
        unprovisioned = payload.get("status") == "unprovisioned"
        message = ("the package is not provisioned, so its dist freshness cannot be assessed"
                   if unprovisioned else "dist freshness could not be verified")
    print(f"DIST FRESHNESS CHECK ERROR: {package_name} -- {message}")


def _print_unmatched(payload: Dict[str, Any]) -> None:
    target = payload.get("filePath") or "unknown file"
    message = payload.get("message") or "dist freshness could not be verified"
    print(f"DIST FRESHNESS CHECK UNMATCHED: {target} -- {message}")


def _report_unassessable(target: str, reason: str) -> None:
    # A read-only caller is a gate run, and its banner is the whole verdict: a check
    # that could not answer has to say so, because silence there reads as a pass. The
    # session path stays quiet, where a broken checker is no news the hook can act on.
    if _read_only_requested():
        print(f"DIST FRESHNESS CHECK ERROR: {target} -- {reason}")


def _auto_rebuild_enabled() -> bool:
    # Session-start self-heal is on by default. A stale checked-out build otherwise
    # survives every session and breaks every consumer that imports the compiled
    # entry, so a warning alone -- easily lost in hook output -- does not close the
    # gap. An operator who does not want a compile at session start sets the switch.
    value = os.environ.get("SPECKIT_DIST_AUTO_REBUILD", "1").strip().lower()
    return value not in ("0", "false", "off", "no")


def _read_only_requested() -> bool:
    # A gate run promises to write nothing, and the freshness checker writes a
    # cache record beside the dist entry it verifies. The runner asks for the same
    # verdict without that record, while every other caller -- the session-start
    # self-heal and --all included -- keeps the writable default it relies on.
    value = os.environ.get("SPECKIT_DIST_READ_ONLY", "").strip().lower()
    return value in ("1", "true", "yes", "on")


def _workspace_root_override() -> str:
    # A runner checks the repository it scanned, which is not always the checkout
    # that holds this script or the cwd the hook inherited. Only the runner sets
    # this, so a plain hook keeps resolving packages against the checkout around
    # the checker itself.
    value = os.environ.get("SPECKIT_DIST_WORKSPACE_ROOT", "").strip()
    return os.path.abspath(value) if value else ""


def _try_rebuild(payload: Dict[str, Any], repo_root: str) -> bool:
    # The freshness checker hands back a self-contained command (it cd's into the
    # package itself), so it runs from the repo root. Bounded and fail-open: a build
    # that errors or overruns its timeout returns False and the caller falls back to
    # the warning, so a broken or slow build never blocks the session.
    rebuild_command = payload.get("rebuildCommand")
    if not rebuild_command:
        return False
    package_name = payload.get("packageName") or payload.get("packageId") or "unknown package"
    try:
        result = subprocess.run(
            rebuild_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=180,
            cwd=repo_root,
        )
    except (OSError, subprocess.TimeoutExpired, UnicodeError):
        return False
    if result.returncode == 0:
        print(f"DIST REBUILT: {package_name} -- self-healed a stale build at session start")
        return True
    return False


def _surface_result(
    payload: Dict[str, Any],
    repo_root: str,
    auto_rebuild: bool = False,
    target: str = "",
) -> None:
    if payload.get("stale") is True:
        if auto_rebuild and _auto_rebuild_enabled() and _try_rebuild(payload, repo_root):
            return
        _print_stale(payload)
    elif payload.get("status") == "error":
        _print_error(payload, target)
    elif payload.get("status") == "unprovisioned":
        # A gate run cannot rebuild and has no build record to fall back on, so a
        # package it cannot inspect is a verdict it must not report as clean.
        if _read_only_requested():
            _print_error(payload, target)
    elif payload.get("status") == "unmatched" and _read_only_requested():
        # A read-only caller is a gate run, and every file it hands over is a
        # declared build output. A file the checker cannot map to a package is
        # therefore unverified, and silence here would read as a pass.
            _print_unmatched(payload)
    elif _read_only_requested() and not payload.get("status"):
        _print_error(payload, target)


# ───────────────────────────────────────────────────────────────
# 5. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1].startswith("-") and sys.argv[1] != "--all":
        print(f"check-dist-staleness.sh: unknown option: {sys.argv[1]}", file=sys.stderr)
        print("usage: check-dist-staleness.sh (--all | <file>)", file=sys.stderr)
        sys.exit(2)
    if not _hook_enabled("dist-freshness"):
        sys.exit(0)
    if len(sys.argv) < 2:
        sys.exit(0)

    repo_root, checker = _resolve_checker()
    if not os.path.isfile(checker):
        print("WARNING: dist freshness checker not found", file=sys.stderr)
        sys.exit(0)

    if sys.argv[1] == "--all":
        payload, problem = _run_checker(checker, repo_root, ["check-all", "--json"])
        if payload is None:
            _report_unassessable("all watched packages", problem or "the checker returned no verdict")
            sys.exit(0)
        results = payload.get("results")
        if isinstance(results, list):
            for item in results:
                if isinstance(item, dict):
                    _surface_result(item, repo_root, auto_rebuild=True)
        sys.exit(0)

    file_path = os.path.abspath(sys.argv[1])
    if not os.path.isfile(file_path):
        sys.exit(0)

    command_args = ["check-file", "--file", file_path, "--json"]
    workspace_root = _workspace_root_override()
    if workspace_root:
        command_args.extend(["--workspace-root", workspace_root])
    if _read_only_requested():
        command_args.append("--no-write")
    payload, problem = _run_checker(checker, repo_root, command_args)
    if payload is None:
        _report_unassessable(file_path, problem or "the checker returned no verdict")
        sys.exit(0)

    _surface_result(payload, repo_root, target=file_path)
    sys.exit(0)


if __name__ == "__main__":
    main()
