"""Repo guard bridge for Hermes Agent.

Hermes keeps shell hooks in the operator's user-level config, so a repository cannot carry them.
A project plugin under ``./.hermes/plugins`` can be carried, and its hook surface reaches every
guard core this repository already runs for the other runtimes. This plugin re-implements none
of them: each hook shells out to the existing core under ``.opencode/`` with the same JSON payload
the Devin adapters use, and maps the core's answer onto Hermes's directive shapes.

Every hook fails open. A guard that cannot run must not block a session, because the cost of a
false block is a stalled dispatch while the cost of a false pass is the failure the caller would
have seen anyway.

Loads only when ``HERMES_ENABLE_PROJECT_PLUGINS`` is set and the working directory is this
repository, which is Hermes's own opt-in for project plugins.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any, Dict, Optional

# The plugin lives at <repo>/.hermes/plugins/repo-guards, so the repository root is three levels up.
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DISPATCH_PREFLIGHT = REPO_ROOT / ".opencode" / "hooks" / "dispatch" / "devin" / "dispatch-preflight-lint.mjs"
COMPLETION_EVIDENCE_STOP = (
    REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "hooks" / "devin" / "completion-evidence-stop.cjs"
)
SESSION_START = REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "dist" / "hooks" / "devin" / "session-start.js"
SESSION_STOP = REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "dist" / "hooks" / "devin" / "session-stop.js"
GIT_PREFLIGHT_ADVISORY = REPO_ROOT / ".opencode" / "hooks" / "git-preflight" / "shared" / "git-preflight-advisory.mjs"

# Hermes has no read-only file toolset: `read_file` and `search_files` share `file` with the write
# tools. The fan-out runner sets this marker on a read-only leaf, and the plugin turns it into the
# refusal the toolset cannot express.
READ_ONLY_ENV = "SPECKIT_HERMES_READ_ONLY"
READ_ONLY_TOOLS = {"write_file", "patch", "terminal", "process_manage", "execute_code"}
READ_ONLY_MESSAGE = (
    "Refused: this Hermes leaf is read-only. It may read and search files and record findings in its "
    "own artifacts through the caller, but it must not write files or run commands."
)

# The bound packet's goal, rendered into the session prompt. Hermes has no session identity the
# shared goal core can bind to, so the packet path arrives in the environment.
SPEC_FOLDER_ENV = "HERMES_SPEC_FOLDER"
# Hermes caps every plugin prompt section at 4000 characters and skips a section that exceeds
# it, so each piece of context is its own section and each stays under the cap.
SECTION_MAX_CHARS = 4000
GOAL_SLICE_MAX_CHARS = 3600

# Hermes has no flag that loads an agent file, so the persona named here is read from the repo's
# agent directory and rendered into the session prompt; the name is a plain agent file stem.
PERSONA_ENV = "HERMES_AGENT_PERSONA"
AGENTS_DIR = REPO_ROOT / ".hermes" / "agents"
PERSONA_NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
AGENT_SKILL_PREFIX = "agent-"

# A git command flagged by the sk-git advisory core; the advisory travels on the tool result
# because Hermes's pre_tool_call directive can only block, approve or modify.
GIT_SHAPE = re.compile(r"(?:^|[\s;&|(])git\s")
_pending_advisories: Dict[str, str] = {}

# A `hermes chat` with a query flag, or the top-level `-z` oneshot, is a Hermes dispatch. Inside a
# Hermes session that is self-invocation, which the cli-hermes packet refuses: Hermes hands work out
# through delegate_task, never by re-dispatching its own CLI.
HERMES_SELF_DISPATCH = re.compile(
    r"\bhermes\s+chat\b[^\n;&|]*\s(?:-q|--query|--query-file|--oneshot)\b|\bhermes\b[^\n;&|]*\s-z\b"
)
SELF_DISPATCH_MESSAGE = (
    "Self-invocation refused: this session is already running inside Hermes. Hand work out with "
    "delegate_task, or dispatch a sibling cli-* runtime; never re-dispatch `hermes chat` from here."
)

# Bounded so a hung core cannot stall a tool call; the cores themselves finish in well under this.
CORE_TIMEOUT_SECONDS = 15


def _run_core(script: Path, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Run one guard core with a JSON payload on stdin and return its parsed JSON stdout, or None."""
    if not script.exists():
        return None
    try:
        completed = subprocess.run(
            ["node", str(script)],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            cwd=str(REPO_ROOT),
            timeout=CORE_TIMEOUT_SECONDS,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    output = (completed.stdout or "").strip()
    if not output:
        return None
    try:
        parsed = json.loads(output.splitlines()[-1])
    except ValueError:
        return None
    return parsed if isinstance(parsed, dict) else None


def _hook_output(result: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    inner = result.get("hookSpecificOutput") if isinstance(result, dict) else None
    return inner if isinstance(inner, dict) else {}


def _command_of(tool_name: str, args: Dict[str, Any]) -> Optional[str]:
    if tool_name != "terminal":
        return None
    command = args.get("command")
    return command if isinstance(command, str) and command.strip() else None


def _read_only_leaf() -> bool:
    return os.environ.get(READ_ONLY_ENV, "").strip() in {"1", "true", "yes"}


def _git_advisory(command: str) -> Optional[str]:
    """The sk-git advisory line for a git-shaped command, or None when the core stays silent."""
    if not GIT_SHAPE.search(command):
        return None
    payload = {"tool_name": "exec", "tool_input": {"command": command}, "cwd": os.getcwd()}
    context = _hook_output(_run_core(GIT_PREFLIGHT_ADVISORY, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


def pre_tool_call(tool_name: str = "", args: Optional[Dict[str, Any]] = None, **_: Any) -> Optional[Dict[str, Any]]:
    """Refuse a self-dispatch or a read-only leaf's write; run the dispatch preflight and stage any git advisory."""
    try:
        if _read_only_leaf() and tool_name in READ_ONLY_TOOLS:
            return {"action": "block", "message": READ_ONLY_MESSAGE}
        command = _command_of(tool_name, args or {})
        if command is None:
            return None
        if HERMES_SELF_DISPATCH.search(command):
            return {"action": "block", "message": SELF_DISPATCH_MESSAGE}
        payload = {"tool_name": "exec", "tool_input": {"command": command}, "cwd": os.getcwd()}
        output = _hook_output(_run_core(DISPATCH_PREFLIGHT, payload))
        if output.get("permissionDecision") == "deny":
            reason = output.get("permissionDecisionReason")
            if isinstance(reason, str) and reason.strip():
                return {"action": "block", "message": reason.strip()}
        advisory = _git_advisory(command)
        if advisory:
            _pending_advisories[command] = advisory
        return None
    except Exception:
        return None


def transform_tool_result(tool_name: str = "", args: Optional[Dict[str, Any]] = None, result: Any = None, **_: Any) -> Optional[str]:
    """Append the staged git advisory to the terminal tool's result so the session reads it."""
    try:
        command = _command_of(tool_name, args or {})
        if command is None:
            return None
        advisory = _pending_advisories.pop(command, None)
        if not advisory:
            return None
        text = result if isinstance(result, str) else json.dumps(result) if result is not None else ""
        return f"{text}\n\n{advisory}"
    except Exception:
        return None


def pre_verify(session_id: str = "", final_response: str = "", **_: Any) -> Optional[Dict[str, Any]]:
    """Nudge the turn to continue when a completion claim names no evidence."""
    try:
        payload = {
            "session_id": session_id or "",
            "cwd": os.getcwd(),
            "last_assistant_message": final_response or "",
            "stop_hook_active": False,
        }
        output = _hook_output(_run_core(COMPLETION_EVIDENCE_STOP, payload))
        context = output.get("additionalContext")
        if isinstance(context, str) and context.strip():
            return {"action": "continue", "message": context.strip()}
        return None
    except Exception:
        return None


def _goal_slice() -> str:
    """The bound packet's durable goal slice: the directive block of its goal.md, frontmatter stripped."""
    folder = os.environ.get(SPEC_FOLDER_ENV, "").strip()
    if not folder:
        return ""
    goal_path = (REPO_ROOT / folder / "goal.md") if not os.path.isabs(folder) else Path(folder) / "goal.md"
    try:
        goal_path.resolve().relative_to(REPO_ROOT.resolve())
    except ValueError:
        return ""
    if not goal_path.is_file():
        return ""
    text = goal_path.read_text(encoding="utf-8", errors="replace")
    start = text.find("<!-- ANCHOR:directive -->")
    end = text.find("<!-- /ANCHOR:directive -->")
    body = text[start + len("<!-- ANCHOR:directive -->"):end] if 0 <= start < end else text
    if body.startswith("---"):
        closing = body.find("\n---", 3)
        if closing > 0:
            body = body[closing + 4:]
    body = body.strip()
    if len(body) > GOAL_SLICE_MAX_CHARS:
        body = body[:GOAL_SLICE_MAX_CHARS].rstrip() + "\n[goal slice truncated]"
    return f"Bound packet: {folder}\n\n{body}"


def _strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        closing = text.find("\n---", 3)
        if closing > 0:
            return text[closing + 4:]
    return text


def _persona() -> str:
    """The agent persona named by the environment, frontmatter stripped, or empty when absent."""
    name = os.environ.get(PERSONA_ENV, "").strip()
    if not name or not PERSONA_NAME.match(name):
        return ""
    persona_path = AGENTS_DIR / f"{name}.md"
    try:
        persona_path.resolve().relative_to(REPO_ROOT.resolve())
    except ValueError:
        return ""
    if not persona_path.is_file():
        return ""
    # The full persona is far larger than a prompt section may be, so it travels as the
    # preloadable skill the generator mirrors from the same file; this section only binds the name.
    skill = f"{AGENT_SKILL_PREFIX}{name}"
    return (
        f"Persona: {name}. Adopt the agent persona defined in .hermes/agents/{name}.md for this whole "
        f"session. Its full text is the skill `{skill}`: it is already in context when the session was "
        f"started with `-s {skill}`; otherwise load it with skill_view(\"{skill}\") before acting."
    )


def _session_context(session_info: Any) -> str:
    """The session-start context the shared lifecycle hook produces, plus the named persona and the bound packet's goal, frozen into the system prompt."""
    try:
        session_id = ""
        if isinstance(session_info, dict):
            session_id = str(session_info.get("session_id") or "")
        payload = {"session_id": session_id or "hermes-session", "cwd": os.getcwd()}
        output = _hook_output(_run_core(SESSION_START, payload))
        context = output.get("additionalContext")
        parts = [context.strip()] if isinstance(context, str) and context.strip() else []
        if _read_only_leaf():
            parts.append("This leaf is read-only: file writes and commands are refused by the repo guard.")
        return "\n\n".join(parts)[:SECTION_MAX_CHARS]
    except Exception:
        return ""


def _persona_section(_session_info: Any) -> str:
    try:
        return _persona()[:SECTION_MAX_CHARS]
    except Exception:
        return ""


def _goal_section(_session_info: Any) -> str:
    try:
        return _goal_slice()[:SECTION_MAX_CHARS]
    except Exception:
        return ""


def on_session_end(session_id: str = "", **_: Any) -> None:
    try:
        _run_core(SESSION_STOP, {"session_id": session_id or "hermes-session", "cwd": os.getcwd()})
    except Exception:
        pass


def register(ctx: Any) -> None:
    ctx.register_hook("pre_tool_call", pre_tool_call)
    ctx.register_hook("transform_tool_result", transform_tool_result)
    ctx.register_hook("pre_verify", pre_verify)
    ctx.register_hook("on_session_end", on_session_end)
    # Hermes ignores an on_session_start callback's return value, so the session-start context
    # travels through the system-prompt section surface instead.
    register_section = getattr(ctx, "register_system_prompt_section", None)
    if callable(register_section):
        for section_id, renderer in (
            ("repo-guards-session-context", _session_context),
            ("repo-guards-persona", _persona_section),
            ("repo-guards-goal", _goal_section),
        ):
            try:
                register_section(section_id, renderer, max_chars=SECTION_MAX_CHARS)
            except TypeError:
                register_section(section_id, renderer)
            except Exception:
                pass
