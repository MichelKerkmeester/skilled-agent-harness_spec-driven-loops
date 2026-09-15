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
from typing import Any, Dict, List, Optional, Tuple

# The plugin lives at <repo>/.hermes/plugins/repo-guards, so the repository root is three levels up.
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DISPATCH_PREFLIGHT = REPO_ROOT / ".opencode" / "hooks" / "dispatch" / "devin" / "dispatch-preflight-lint.mjs"
COMPLETION_EVIDENCE_STOP = (
    REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "hooks" / "devin" / "completion-evidence-stop.cjs"
)
SESSION_START = REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "dist" / "hooks" / "devin" / "session-start.js"
SESSION_STOP = REPO_ROOT / ".opencode" / "skills" / "system-spec-kit" / "runtime" / "dist" / "hooks" / "devin" / "session-stop.js"
GIT_PREFLIGHT_ADVISORY = REPO_ROOT / ".opencode" / "hooks" / "git-preflight" / "shared" / "git-preflight-advisory.mjs"
SK_VISION = REPO_ROOT / ".opencode" / "hooks" / "sk-vision" / "devin" / "sk-vision.mjs"
POST_EDIT_QUALITY = (
    REPO_ROOT / ".opencode" / "hooks" / "post-edit-quality" / "devin" / "post-edit-quality.cjs"
)
MCP_ROUTE_GUARD = (
    REPO_ROOT / ".opencode" / "hooks" / "mcp-route-guard" / "devin" / "mcp-route-guard.cjs"
)
TASK_DISPATCH_GUARD = (
    REPO_ROOT / ".opencode" / "hooks" / "task-dispatch" / "devin" / "task-dispatch-guard.cjs"
)
SESSION_CLEANUP = REPO_ROOT / ".opencode" / "hooks" / "session-cleanup" / "devin" / "session-cleanup.sh"
ADVISOR_CLI = REPO_ROOT / ".opencode" / "bin" / "skill-advisor.cjs"
SPEC_GATE_CLASSIFY = REPO_ROOT / ".opencode" / "hooks" / "spec-gate" / "devin" / "spec-gate-classify.mjs"

# Prompt-time context rides Hermes's user-message injection channel rather than the system
# prompt, so it is re-derived per turn: the advisor's brief follows every prompt, while the
# spec-folder question only opens its once-per-session gate on the first turn.
PROMPT_CONTEXT_MAX_CHARS = 3000
ADVISOR_BRIEF_MAX_CHARS = 1200
ADVISOR_TOP_K = 2
ADVISOR_CONFIDENCE_FLOOR = 0.8
ADVISOR_UNCERTAINTY_CEILING = 0.35
SKILL_LABEL = re.compile(r"^[a-z0-9][a-z0-9._-]{0,63}$")
TRUTHY_ENV_VALUES = frozenset({"1", "true", "yes", "on"})

# The two switches a fan-out leaf sets together. Either one alone is an interactive session
# that still wants its briefs, and the spec gate refuses a child session on its own, so the
# pair is the whole signal this bridge needs.
ORCHESTRATED_LEAF_ENVS = ("SYSTEM_SPEC_GATE_DISABLED", "AI_SESSION_CHILD")

# The advisor CLI scores every prompt without consulting the concern's kill-switch, unlike the
# spec-gate adapter that honors its own, so the documented switches are checked here: a session
# that turned the advisor off must not get a brief back through this door.
ADVISOR_DISABLE_ENVS = (
    "SYSTEM_SKILL_ADVISOR_DISABLED",
    "SYSTEM_SKILL_ADVISOR_HOOK_DISABLED",
    "SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED",
    "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED",
    "SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED",
    "MK_SKILL_ADVISOR_DISABLED",
    "SYSTEM_HOOKS_DISABLED",
    "MK_HOOKS_DISABLED",
)

# Mirrors the advisor renderer's directive capsule, which stays the canonical copy: every
# runtime that injects a brief carries this block, and a session that never sees it quietly
# loses the comment-hygiene rule the other runtimes enforce.
ADVISOR_DIRECTIVE_CAPSULE = (
    "\nDirectives:\n"
    "- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in "
    "code comments — forbidden regardless of instruction. Write the durable WHY instead. "
    "Pre-commit gate blocks violations."
)

# The session-start guards, each a shell core that warns on stderr and always exits 0. Nothing in a
# Hermes session reads a SessionStart hook's stderr, so the prompt section carries what each guard
# said instead, under the name of the guard that said it.
# Each guard names its interpreter: the dist checker is a Python program behind a `.sh` name, and
# feeding it to bash yields parse errors instead of a verdict. The dist checker also reports on
# stdout, so a guard's warning is whichever stream it wrote.
SESSION_START_GUARDS: Tuple[Tuple[str, Path, Tuple[str, ...]], ...] = (
    ("worktree-guard", REPO_ROOT / ".opencode" / "hooks" / "git-worktree-guard" / "devin" / "worktree-guard.sh", ("bash",)),
    ("dist-freshness", REPO_ROOT / ".opencode" / "hooks" / "dist-freshness" / "devin" / "check-dist-staleness.sh", ("python3", "--all")),
    ("git-hooks-check", REPO_ROOT / ".opencode" / "hooks" / "git-hooks-check" / "devin" / "check-git-hooks.sh", ("bash",)),
    ("git-primary-reconcile", REPO_ROOT / ".opencode" / "hooks" / "git-primary-reconcile" / "pi" / "git-primary-reconcile.sh", ("bash",)),
)


def _guard_argv(script: Path, shape: Tuple[str, ...]) -> List[str]:
    interpreter, *extra = shape
    return [interpreter, str(script), *extra]

# Hermes has no read-only file toolset: `read_file` and `search_files` share `file` with the write
# tools. The fan-out runner sets this marker on a read-only leaf, and the plugin turns it into the
# refusal the toolset cannot express.
READ_ONLY_ENV = "SPECKIT_HERMES_READ_ONLY"
READ_ONLY_TOOLS = {"write_file", "patch", "terminal", "process_manage", "execute_code"}
READ_ONLY_MESSAGE = (
    "Refused: this Hermes leaf is read-only. It may read and search files and record findings in its "
    "own artifacts through the caller, but it must not write files or run commands."
)

# The bound packet's goal, rendered into the session prompt. Hermes supplies a session identity, so
# the shared goal core binds and serves the goal per session; the environment packet is the
# fallback for a session that has no bound goal of its own.
SPEC_FOLDER_ENV = "HERMES_SPEC_FOLDER"
GOAL_CLI = REPO_ROOT / ".opencode" / "hooks" / "goal" / "bin" / "goal.cjs"
GOAL_RUNTIME = "hermes"

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

# An advisory a synchronous pre hook stages for one tool call -- the sk-git line, the MCP route
# guard, the dispatch guard, the vision guidance -- and the transform appends to that call's result.
# It travels on the result because Hermes's pre_tool_call directive can only block, approve or modify.
GIT_SHAPE = re.compile(r"(?:^|[\s;&|(])git\s")
_pending_advisories: Dict[str, str] = {}

# The Hermes file-write tools. The post-edit quality core recognizes the edit-tool name of its own
# runtime and stays silent for any other, so a Hermes write is reported under that name; the core
# reads the file path, never the name.
EDIT_TOOLS = {"write_file", "patch"}
DEVIN_EDIT_TOOL = "edit"

# Hermes hands work out through one dispatch tool, and the shared dispatch guard expects the
# subagent tool name of its own runtime.
DELEGATE_TOOL = "delegate_task"
DELEGATE_CORE_TOOL = "run_subagent"

# Hermes's vision tool takes its image as `image_url` -- a URL, a local path or a data URL -- and
# the shared vision core reads the image path from its prompt, so the guard payload carries the
# same value and the advisory is staged and read back under it.
VISION_TOOL = "vision_analyze"
VISION_IMAGE_ARG = "image_url"

# The shared dispatch guard reads its generic placeholder as "no target named" and parses the target
# from the prompt body instead, so a role carrying that value is left off the subagent type.
DELEGATE_GENERIC_ROLE = "general"

# Hermes exposes an external MCP server as `<server>_<tool>` or `<server>:<tool>` beside its own
# tools, and only its own tools are declared in the runtime's toolset registry. The registry is
# read once so the MCP guard skips a built-in call; the fallback keeps that decision working when
# the runtime is unreadable.
TOOLSETS_SOURCE = Path.home() / ".hermes" / "hermes-agent" / "toolsets.py"
TOOLSET_TOOL_NAME = re.compile(r'"([a-z][a-z0-9_]*)"')
FALLBACK_BUILTIN_TOOLS = frozenset({
    "clarify", "delegate_task", "execute_code", "image_generate", "manage_connections", "memory",
    "patch", "process_manage", "read_file", "search_files", "session_search", "skill_manage",
    "skill_view", "skills_list", "terminal", "todo_list", "vision_analyze", "web_extract",
    "web_search", "write_file",
})


def _builtin_tools() -> frozenset:
    """Hermes's own tool names: the installed runtime's toolset registry over the fallback set."""
    try:
        registry = TOOLSETS_SOURCE.read_text(encoding="utf-8", errors="replace")
    except OSError:
        registry = ""
    return frozenset(set(FALLBACK_BUILTIN_TOOLS) | set(TOOLSET_TOOL_NAME.findall(registry)))


HERMES_BUILTIN_TOOLS = _builtin_tools()

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


def _path_of(tool_name: str, args: Dict[str, Any]) -> Optional[str]:
    """The file path a Hermes write tool edits, or None when the call is not a write."""
    if tool_name not in EDIT_TOOLS:
        return None
    path = args.get("path")
    return path if isinstance(path, str) and path.strip() else None


def _advisory_key(tool_name: str, args: Dict[str, Any]) -> Optional[str]:
    """The staging key this call's result reads: its command, its image path or its tool name."""
    command = _command_of(tool_name, args)
    if command is not None:
        return command
    if tool_name == VISION_TOOL:
        return _vision_image(args)
    if tool_name == DELEGATE_TOOL or tool_name not in HERMES_BUILTIN_TOOLS:
        return tool_name or None
    return None


def _read_only_leaf() -> bool:
    return os.environ.get(READ_ONLY_ENV, "").strip() in {"1", "true", "yes"}


def _git_advisory(command: str) -> Optional[str]:
    """The sk-git advisory line for a git-shaped command, or None when the core stays silent."""
    if not GIT_SHAPE.search(command):
        return None
    payload = {"tool_name": "exec", "tool_input": {"command": command}, "cwd": os.getcwd()}
    context = _hook_output(_run_core(GIT_PREFLIGHT_ADVISORY, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


def _post_edit_advisory(path: str) -> Optional[str]:
    """The post-edit quality pass's advisory for one edited file, or None when the checkers stay silent."""
    payload = {"tool_name": DEVIN_EDIT_TOOL, "tool_input": {"file_path": path}, "cwd": os.getcwd()}
    context = _hook_output(_run_core(POST_EDIT_QUALITY, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


def _mcp_route_advisory(tool_name: str, args: Dict[str, Any]) -> Optional[str]:
    """The MCP route guard's advisory on a native call to an external server, or None."""
    if tool_name in HERMES_BUILTIN_TOOLS:
        return None
    payload = {"tool_name": tool_name, "tool_input": args, "cwd": os.getcwd()}
    context = _hook_output(_run_core(MCP_ROUTE_GUARD, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


def _vision_image(args: Dict[str, Any]) -> Optional[str]:
    """The image a Hermes vision call analyzes, or None when the argument names none."""
    image = args.get(VISION_IMAGE_ARG)
    return image if isinstance(image, str) and image.strip() else None


def _vision_advisory(image: str) -> Optional[str]:
    """The shared vision core's guidance for one image path, or None when it stays silent."""
    payload = {"prompt": image, "cwd": os.getcwd()}
    context = _hook_output(_run_core(SK_VISION, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


# Hermes carries a dispatch as a `tasks` batch, one entry per child, and every entry spawns its own
# child. Judging the batch as one prompt would pair one task's target with another task's declared
# route, so each entry is evaluated on its own text and role.
def _task_prompt(source: Dict[str, Any]) -> str:
    """One child's prompt text: its goal and context, the pair a single-child call carries at
    top level."""
    return "\n\n".join(
        part for part in (source.get("goal"), source.get("context")) if isinstance(part, str) and part.strip()
    )


def _task_role(source: Dict[str, Any], fallback: Any) -> Optional[str]:
    """The role naming one child: the task's own role, else the call's top-level role."""
    role = source.get("role")
    if not isinstance(role, str) or not role.strip():
        role = fallback
    return role.strip() if isinstance(role, str) and role.strip() else None


def _dispatch_targets(args: Dict[str, Any]) -> List[Tuple[str, Optional[str]]]:
    """Every child one delegate_task call spawns, as (prompt, role) pairs: one per `tasks` entry,
    else the single top-level goal/context pair."""
    top_role = args.get("role")
    tasks = args.get("tasks")
    if isinstance(tasks, list):
        targets = [
            (_task_prompt(task), _task_role(task, top_role))
            for task in tasks
            if isinstance(task, dict)
        ]
        if targets:
            return targets
    return [(_task_prompt(args), _task_role(args, None))]


def _dispatch_guard(tool_name: str, args: Dict[str, Any], session_id: str) -> Optional[Dict[str, Any]]:
    """Guard one delegate_task call: each child it spawns is a dispatch of its own, so a block when
    any one of them is denied, else None after staging the advisories for the result."""
    advisories = []
    for prompt, role in _dispatch_targets(args):
        tool_input: Dict[str, Any] = {"prompt": prompt}
        if role is not None and role.lower() != DELEGATE_GENERIC_ROLE:
            tool_input["subagent_type"] = role
        payload = {
            "tool_name": DELEGATE_CORE_TOOL,
            "tool_input": tool_input,
            "session_id": session_id,
            "cwd": os.getcwd(),
        }
        output = _hook_output(_run_core(TASK_DISPATCH_GUARD, payload))
        if output.get("permissionDecision") == "deny":
            reason = output.get("permissionDecisionReason")
            if isinstance(reason, str) and reason.strip():
                return {"action": "block", "message": reason.strip()}
            return None
        context = output.get("additionalContext")
        if isinstance(context, str) and context.strip():
            advisories.append(context.strip())
    if advisories:
        _pending_advisories[tool_name] = "\n\n".join(advisories)
    return None


def pre_tool_call(
    tool_name: str = "", args: Optional[Dict[str, Any]] = None, session_id: str = "", **_: Any
) -> Optional[Dict[str, Any]]:
    """Refuse a self-dispatch or a read-only leaf's write; run the dispatch preflight and stage any
    git advisory; guard a subagent dispatch and a native external MCP call; stage the vision core's
    guidance for an image call."""
    try:
        if _read_only_leaf() and tool_name in READ_ONLY_TOOLS:
            return {"action": "block", "message": READ_ONLY_MESSAGE}
        tool_args = args or {}
        command = _command_of(tool_name, tool_args)
        if command is not None:
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
        if tool_name == DELEGATE_TOOL:
            return _dispatch_guard(tool_name, tool_args, session_id)
        if tool_name == VISION_TOOL:
            image = _vision_image(tool_args)
            if image is not None:
                advisory = _vision_advisory(image)
                if advisory:
                    _pending_advisories[image] = advisory
            return None
        route_advisory = _mcp_route_advisory(tool_name, tool_args)
        if route_advisory:
            _pending_advisories[tool_name] = route_advisory
        return None
    except Exception:
        return None


# Hermes runs `post_tool_call` and `transform_tool_result` on bounded worker threads it abandons on
# timeout, and a callback is skipped outright after an earlier timeout, so state staged by the post
# hook can be missing when the transform runs. The post-edit core runs here instead, where the
# result is already final; the pre hook stages safely because its directive is awaited before the
# tool call proceeds.
def transform_tool_result(tool_name: str = "", args: Optional[Dict[str, Any]] = None, result: Any = None, **_: Any) -> Optional[str]:
    """Append this call's advisory to its result: the post-edit quality pass for a file write, or
    the advisory the pre hook staged for it -- git, dispatch, MCP route or vision; None leaves it alone."""
    try:
        tool_args = args or {}
        path = _path_of(tool_name, tool_args)
        advisory = _post_edit_advisory(path) if path is not None else None
        if not advisory:
            key = _advisory_key(tool_name, tool_args)
            if key is None:
                return None
            advisory = _pending_advisories.pop(key, None)
        if not advisory:
            return None
        text = result if isinstance(result, str) else json.dumps(result) if result is not None else ""
        return f"{text}\n\n{advisory}"
    except Exception:
        return None


def _truthy_env(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in TRUTHY_ENV_VALUES


def _orchestrated_leaf() -> bool:
    """Whether this session is a dispatched child, which gets no prompt-time briefs."""
    return all(os.environ.get(name, "").strip() == "1" for name in ORCHESTRATED_LEAF_ENVS)


def _advisor_enabled() -> bool:
    """Whether the advisor concern is on: any one of its documented switches turns it off."""
    return not any(_truthy_env(name) for name in ADVISOR_DISABLE_ENVS)


def _prompt_text(value: Any) -> str:
    """The prompt's text wherever it was carried: a string, or the text parts of a message."""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        return _prompt_text(value.get("content", value.get("text")))
    if isinstance(value, list):
        return "\n".join(part for part in (_prompt_text(item) for item in value) if part)
    return ""


def _run_cli_json(script: Path, argv: List[str]) -> Optional[Any]:
    """Run one CLI core and return its parsed JSON stdout, or None.

    The advisor CLI pretty-prints a single envelope across many lines, so stdout is parsed as
    one document rather than line by line; an absent, silent or failing core reads as None.
    """
    if not script.exists():
        return None
    try:
        completed = subprocess.run(
            argv,
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
        return json.loads(output)
    except ValueError:
        return None


def _advisor_routes(body: Dict[str, Any]) -> List[Dict[str, Any]]:
    """The routes the advisor itself would surface: its own thresholds, else the defaults."""
    thresholds = body.get("effectiveThresholds")
    thresholds = thresholds if isinstance(thresholds, dict) else {}
    recommendations = body.get("recommendations")
    return [
        recommendation
        for recommendation in (recommendations if isinstance(recommendations, list) else [])
        if isinstance(recommendation, dict)
        and isinstance(recommendation.get("confidence"), (int, float))
        and isinstance(recommendation.get("uncertainty"), (int, float))
        and recommendation["confidence"] >= thresholds.get("confidenceThreshold", ADVISOR_CONFIDENCE_FLOOR)
        and recommendation["uncertainty"] <= thresholds.get("uncertaintyThreshold", ADVISOR_UNCERTAINTY_CEILING)
    ]


def _advisor_brief_line(routes: List[Dict[str, Any]], freshness: str, ambiguous: bool) -> Optional[str]:
    """One brief line in the shape the other runtimes inject: the single confident route, or
    the top two it reports when both clear the thresholds."""
    labels = []
    for route in routes[:2] if ambiguous else routes[:1]:
        label = route.get("skillId")
        if not isinstance(label, str) or not SKILL_LABEL.match(label):
            return None
        labels.append(f"{label} {route['confidence']:.2f}/{route['uncertainty']:.2f}")
    if len(labels) == 2:
        return f"Advisor: {freshness}; ambiguous: {labels[0]} vs {labels[1]} pass."
    if not labels:
        return None
    return f"Advisor: {freshness}; use {labels[0]} pass."


def _advisor_brief(prompt: str) -> Optional[str]:
    """The advisor's brief for this prompt, or None when it recommends nothing."""
    if not _advisor_enabled():
        return None
    payload = {"prompt": prompt, "options": {"topK": ADVISOR_TOP_K}}
    argv = ["node", str(ADVISOR_CLI), "advisor_recommend", "--json", json.dumps(payload), "--format", "json"]
    envelope = _run_cli_json(ADVISOR_CLI, argv)
    if not isinstance(envelope, dict) or envelope.get("status") != "ok":
        return None
    body = envelope.get("data")
    if not isinstance(body, dict) or body.get("freshness") not in {"live", "stale"}:
        return None
    routes = _advisor_routes(body)
    ambiguous = body.get("ambiguous") is True and len(routes) > 1
    line = _advisor_brief_line(routes, str(body["freshness"]), ambiguous)
    if line is None:
        return None
    return f"{line}{ADVISOR_DIRECTIVE_CAPSULE}"[:ADVISOR_BRIEF_MAX_CHARS]


def _spec_gate_question(prompt: str, session_id: str) -> Optional[str]:
    """The spec-folder gate's question for this prompt, or None while the gate stays closed.

    The gate keys its state on the session identity, so a session without one skips it rather
    than naming a record an answered gate would be stored under.
    """
    if not session_id:
        return None
    payload = {"prompt": prompt, "cwd": os.getcwd(), "session_id": session_id}
    context = _hook_output(_run_core(SPEC_GATE_CLASSIFY, payload)).get("additionalContext")
    return context.strip() if isinstance(context, str) and context.strip() else None


def pre_llm_call(
    user_message: Any = "", is_first_turn: bool = False, session_id: str = "", **_: Any
) -> Optional[Dict[str, Any]]:
    """Return the context Hermes appends to this turn's user message: the advisor's routing
    brief for the prompt, and on the first turn the spec-folder question.

    The gate answer binds the session once it is given, so its question is not repeated on
    later turns the way the per-prompt brief is.
    """
    try:
        if _orchestrated_leaf():
            return None
        prompt = _prompt_text(user_message)
        if not prompt:
            return None
        parts = []
        brief = _advisor_brief(prompt)
        if brief:
            parts.append(brief)
        if is_first_turn:
            question = _spec_gate_question(prompt, session_id if isinstance(session_id, str) else "")
            if question:
                parts.append(question)
        if not parts:
            return None
        return {"context": "\n\n".join(parts)[:PROMPT_CONTEXT_MAX_CHARS]}
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


def _goal_cli(action: str, session_id: str, *extra: str) -> Optional[str]:
    """Run one shared goal-core action for a Hermes session and return its stdout, or None.

    The core keys a goal on the native session identity, so a missing one reads as "no answer"
    rather than guessing an identity the record would then be stored under.
    """
    if not session_id or not GOAL_CLI.is_file():
        return None
    try:
        completed = subprocess.run(
            [
                "node", str(GOAL_CLI), action,
                "--runtime", GOAL_RUNTIME,
                "--session", session_id,
                "--workspace", str(REPO_ROOT),
                *extra,
            ],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            timeout=CORE_TIMEOUT_SECONDS,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return (completed.stdout or "").strip() or None


def _session_goal(session_id: str) -> Optional[str]:
    """The shared goal core's lines for this session's bound goal, or None.

    A session with no goal of its own reads as None so the caller keeps the environment fallback,
    and an unavailable core reads the same way rather than blocking the prompt.
    """
    report = _goal_cli("show", session_id)
    if report is None or not report.startswith("STATUS=OK"):
        return None
    if "goal_present=true" not in report.splitlines()[1:]:
        return None
    return report


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


def _session_id(session_info: Any) -> str:
    """The native session identity Hermes attaches to a prompt renderer call, or empty."""
    if not isinstance(session_info, dict):
        return ""
    return str(session_info.get("session_id") or "")


def _session_context(session_info: Any) -> str:
    """The session-start context the shared lifecycle hook produces, plus the named persona and the bound packet's goal, frozen into the system prompt."""
    try:
        session_id = _session_id(session_info)
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


def _goal_section(session_info: Any) -> str:
    try:
        text = _session_goal(_session_id(session_info)) or _goal_slice()
        return text[:SECTION_MAX_CHARS]
    except Exception:
        return ""


def _session_advisories() -> str:
    """Every session-start guard's warning line, each naming the guard that produced it."""
    lines: List[str] = []
    for name, script, shape in SESSION_START_GUARDS:
        if not script.exists():
            continue
        try:
            completed = subprocess.run(
                _guard_argv(script, shape),
                cwd=str(REPO_ROOT),
                capture_output=True,
                text=True,
                timeout=CORE_TIMEOUT_SECONDS,
                check=False,
            )
        except (OSError, subprocess.SubprocessError):
            continue
        warning = (completed.stderr or "").strip() or (completed.stdout or "").strip()
        if warning:
            lines.append(f"{name}: {warning}")
    return "\n".join(lines)


def _advisories_section(_session_info: Any) -> str:
    try:
        return _session_advisories()[:SECTION_MAX_CHARS]
    except Exception:
        return ""


def _reap_session_helpers() -> None:
    """Reap the MCP helper transports this process spawned.

    The cleanup core kills only descendants of an explicit session PID and reaps nothing without
    one, and this process is the owner of the helpers the session spawned."""
    if not SESSION_CLEANUP.exists():
        return
    subprocess.run(
        ["bash", str(SESSION_CLEANUP)],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
        timeout=CORE_TIMEOUT_SECONDS,
        env=dict(os.environ, SESSION_CLEANUP_PID=str(os.getpid())),
        check=False,
    )


def on_session_start(session_id: str = "", **_: Any) -> None:
    """Bind the environment's packet to this session's own goal record when it has none.

    Hermes supplies the session identity the shared core keys goal state on, so the session can
    carry its own record instead of reading the environment path at render time. A session that
    already carries a goal -- bound here or through the CLI -- keeps it, and a core that cannot
    answer leaves the record untouched for the environment fallback to serve.
    """
    try:
        folder = os.environ.get(SPEC_FOLDER_ENV, "").strip()
        if not folder or not session_id:
            return
        report = _goal_cli("show", session_id)
        if report is None or not report.startswith("STATUS=OK"):
            return
        if "goal_present=true" in report:
            return
        _goal_cli("bind", session_id, folder)
    except Exception:
        pass


def on_session_end(session_id: str = "", **_: Any) -> None:
    try:
        _run_core(SESSION_STOP, {"session_id": session_id or "hermes-session", "cwd": os.getcwd()})
    except Exception:
        pass
    try:
        _reap_session_helpers()
    except Exception:
        pass


def register(ctx: Any) -> None:
    ctx.register_hook("pre_tool_call", pre_tool_call)
    ctx.register_hook("transform_tool_result", transform_tool_result)
    ctx.register_hook("pre_llm_call", pre_llm_call)
    ctx.register_hook("pre_verify", pre_verify)
    ctx.register_hook("on_session_start", on_session_start)
    ctx.register_hook("on_session_end", on_session_end)
    # Hermes ignores an on_session_start callback's return value, so the session-start context
    # travels through the system-prompt section surface instead.
    register_section = getattr(ctx, "register_system_prompt_section", None)
    if callable(register_section):
        for section_id, renderer in (
            ("repo-guards-session-context", _session_context),
            ("repo-guards-persona", _persona_section),
            ("repo-guards-goal", _goal_section),
            ("repo-guards-session-advisories", _advisories_section),
        ):
            try:
                register_section(section_id, renderer, max_chars=SECTION_MAX_CHARS)
            except TypeError:
                register_section(section_id, renderer)
            except Exception:
                pass
