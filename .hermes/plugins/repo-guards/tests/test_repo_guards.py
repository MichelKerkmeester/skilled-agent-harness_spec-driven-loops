"""In-process checks for the repo-guards Hermes plugin: every directive shape it can return."""

from __future__ import annotations

import importlib.util
import os
import sys
import unittest
from pathlib import Path
from unittest import mock

PLUGIN_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = PLUGIN_DIR.parent.parent.parent


def _load_plugin():
    spec = importlib.util.spec_from_file_location("repo_guards", PLUGIN_DIR / "__init__.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FakeContext:
    def __init__(self):
        self.hooks = {}
        self.sections = {}

    def register_hook(self, name, fn):
        self.hooks[name] = fn

    def register_system_prompt_section(self, name, fn, max_chars=None):
        self.sections[name] = fn


class RepoGuardsTests(unittest.TestCase):
    def setUp(self):
        self.plugin = _load_plugin()
        self.ctx = FakeContext()
        self.plugin.register(self.ctx)

    def test_registers_every_declared_hook(self):
        self.assertEqual(
            set(self.ctx.hooks), {"pre_tool_call", "transform_tool_result", "pre_verify", "on_session_end"},
        )
        self.assertEqual(set(self.ctx.sections), {"repo-guards-session-context", "repo-guards-persona", "repo-guards-goal"})

    def test_self_dispatch_is_blocked(self):
        out = self.plugin.pre_tool_call("terminal", {"command": 'hermes chat -Q --oneshot -q "x"'})
        self.assertEqual(out["action"], "block")
        self.assertIn("Self-invocation refused", out["message"])

    def test_plain_shell_passes(self):
        self.assertIsNone(self.plugin.pre_tool_call("terminal", {"command": "ls -la"}))
        self.assertIsNone(self.plugin.pre_tool_call("read_file", {"path": "README.md"}))

    def test_read_only_leaf_refuses_writes_and_commands_but_reads(self):
        with mock.patch.dict(os.environ, {"SPECKIT_HERMES_READ_ONLY": "1"}):
            for tool in ("write_file", "patch", "terminal"):
                out = self.plugin.pre_tool_call(tool, {"command": "ls", "path": "x"})
                self.assertEqual(out["action"], "block", tool)
                self.assertIn("read-only", out["message"])
            self.assertIsNone(self.plugin.pre_tool_call("read_file", {"path": "README.md"}))
            self.assertIsNone(self.plugin.pre_tool_call("search_files", {"pattern": "x"}))
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("SPECKIT_HERMES_READ_ONLY", None)
            self.assertIsNone(self.plugin.pre_tool_call("write_file", {"path": "x", "content": "y"}))

    def test_git_advisory_reaches_the_tool_result(self):
        # Force the advisory core's answer so the test does not depend on the repo's git state.
        with mock.patch.object(self.plugin, "_git_advisory", return_value="⚠ sk-git advisory — test"):
            self.assertIsNone(self.plugin.pre_tool_call("terminal", {"command": "git push origin feature"}))
            out = self.plugin.transform_tool_result("terminal", {"command": "git push origin feature"}, "pushed")
            self.assertEqual(out, "pushed\n\n⚠ sk-git advisory — test")
        # A command without a staged advisory leaves the result untouched.
        self.assertIsNone(self.plugin.transform_tool_result("terminal", {"command": "git status"}, "clean"))

    def test_git_advisory_core_is_wired_to_the_shared_script(self):
        self.assertTrue(self.plugin.GIT_PREFLIGHT_ADVISORY.is_file(), self.plugin.GIT_PREFLIGHT_ADVISORY)
        self.assertIsNone(self.plugin._git_advisory("ls -la"))

    def test_goal_slice_comes_from_the_bound_packet(self):
        with mock.patch.dict(os.environ, {"HERMES_SPEC_FOLDER": "specs/cli-external-orchestration/071-cli-hermes-creation"}):
            text = self.plugin._goal_slice()
        self.assertIn("Bound packet: specs/cli-external-orchestration/071-cli-hermes-creation", text)
        self.assertIn("Objective:", text)
        self.assertNotIn("_memory:", text)
        self.assertLessEqual(len(text), 4000)

    def test_goal_slice_is_empty_outside_the_repo_or_without_a_packet(self):
        with mock.patch.dict(os.environ, {"HERMES_SPEC_FOLDER": "../../etc"}):
            self.assertEqual(self.plugin._goal_slice(), "")
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("HERMES_SPEC_FOLDER", None)
            self.assertEqual(self.plugin._goal_slice(), "")

    def test_persona_comes_from_the_agents_directory(self):
        with mock.patch.dict(os.environ, {"HERMES_AGENT_PERSONA": "markdown"}):
            text = self.plugin._persona()
        self.assertIn("Persona: markdown", text)
        self.assertIn("-s agent-markdown", text)
        self.assertLess(len(text), 4000)
        for bad in ("../markdown", "Nope", "does-not-exist"):
            with mock.patch.dict(os.environ, {"HERMES_AGENT_PERSONA": bad}):
                self.assertEqual(self.plugin._persona(), "", bad)

    def test_session_section_carries_the_goal_and_the_read_only_notice(self):
        with mock.patch.object(self.plugin, "_run_core", return_value={"hookSpecificOutput": {"additionalContext": "Session context received."}}), \
             mock.patch.dict(os.environ, {"HERMES_SPEC_FOLDER": "specs/cli-external-orchestration/071-cli-hermes-creation", "SPECKIT_HERMES_READ_ONLY": "1", "HERMES_AGENT_PERSONA": "markdown"}):
            context = self.ctx.sections["repo-guards-session-context"]({"session_id": "s"})
            persona = self.ctx.sections["repo-guards-persona"]({"session_id": "s"})
            goal = self.ctx.sections["repo-guards-goal"]({"session_id": "s"})
        self.assertIn("Session context received.", context)
        self.assertIn("read-only", context)
        self.assertIn("Persona: markdown", persona)
        self.assertIn("Bound packet:", goal)
        for section in (context, persona, goal):
            self.assertLessEqual(len(section), 4000)

    def test_every_hook_fails_open(self):
        with mock.patch.object(self.plugin, "_run_core", side_effect=RuntimeError("boom")):
            self.assertIsNone(self.plugin.pre_tool_call("terminal", {"command": "devin -p x"}))
            self.assertIsNone(self.plugin.pre_verify("s", "done"))
            self.assertEqual(self.ctx.sections["repo-guards-session-context"]({}), "")


if __name__ == "__main__":
    unittest.main()
