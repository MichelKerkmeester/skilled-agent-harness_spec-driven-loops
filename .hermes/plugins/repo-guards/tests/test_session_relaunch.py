#!/usr/bin/env python3
"""Checks the Hermes bridge for session relaunch context and turn-end arming."""

from __future__ import annotations

import importlib.util
import json
import os
import sys
import types
import unittest
from pathlib import Path
from unittest import mock

PLUGIN_DIR = Path(__file__).resolve().parent.parent


def load_plugin():
    spec = importlib.util.spec_from_file_location(
        "repo_guards_relaunch", PLUGIN_DIR / "__init__.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class SessionRelaunchTests(unittest.TestCase):
    def setUp(self):
        self.plugin = load_plugin()
        self.context_path = self.plugin.HERMES_CONTEXT_NUDGE
        self.arm_path = self.plugin.HERMES_SESSION_END_ARM
        self.hooks = {}
        ctx = mock.Mock()
        ctx.register_hook.side_effect = lambda name, fn: self.hooks.__setitem__(name, fn)
        self.plugin.register(ctx)
        self.env = mock.patch.dict(
            os.environ,
            {
                "SYSTEM_SKILL_ADVISOR_DISABLED": "1",
                "SYSTEM_SESSION_RELAUNCH_DISABLED": "",
                "SYSTEM_HOOKS_DISABLED": "",
                "MK_HOOKS_DISABLED": "",
                "AI_SESSION_CHILD": "1",
                "SKILLED_LOOP_ID": "loop-7",
                "SKILLED_LOOP_RUNTIME": "hermes",
            },
            clear=False,
        )
        self.env.start()
        self.addCleanup(self.env.stop)

    def test_post_api_request_records_usage_by_session(self):
        callback = self.hooks["post_api_request"]
        callback(
            session_id="session-a",
            extra={"model": "claude-sonnet", "usage": {"input_tokens": 2048}},
        )
        callback(
            session_id="session-b",
            extra={"model": "gpt-6-luna", "usage": {"input_tokens": 512}},
        )
        self.assertEqual(
            self.plugin.HERMES_SESSION_USAGE["session-a"]["usage"]["input_tokens"], 2048
        )
        self.assertEqual(
            self.plugin.HERMES_SESSION_USAGE["session-b"]["usage"]["input_tokens"], 512
        )

    def test_post_api_request_fills_window_from_model_metadata(self):
        callback = self.hooks["post_api_request"]
        lookup = mock.Mock(return_value=131072)
        fake_metadata = types.SimpleNamespace(get_model_context_length=lookup)
        with mock.patch.dict(sys.modules, {"agent.model_metadata": fake_metadata}):
            callback(
                session_id="session-a",
                extra={"model": "fake-128k-model", "usage": {"input_tokens": 110000}},
            )
        record = self.plugin.HERMES_SESSION_USAGE["session-a"]
        self.assertEqual(record["model_context_window"], 131072)
        lookup.assert_called_once_with("fake-128k-model", base_url="", provider="")

    def test_post_api_request_leaves_window_unset_when_metadata_lookup_fails(self):
        callback = self.hooks["post_api_request"]
        cases = {
            "import": None,
            "lookup": types.SimpleNamespace(
                get_model_context_length=mock.Mock(side_effect=RuntimeError("metadata unavailable"))
            ),
        }
        for name, fake_metadata in cases.items():
            with self.subTest(failure=name):
                self.plugin.HERMES_SESSION_USAGE.clear()
                with mock.patch.dict(sys.modules, {"agent.model_metadata": fake_metadata}):
                    callback(
                        session_id="session-a",
                        extra={"model": "fake-128k-model", "usage": {"input_tokens": 110000}},
                    )
                record = self.plugin.HERMES_SESSION_USAGE["session-a"]
                self.assertNotIn("model_context_window", record)

    def test_post_api_request_keeps_a_reported_window(self):
        callback = self.hooks["post_api_request"]
        lookup = mock.Mock(return_value=131072)
        fake_metadata = types.SimpleNamespace(get_model_context_length=lookup)
        with mock.patch.dict(sys.modules, {"agent.model_metadata": fake_metadata}):
            callback(
                session_id="session-a",
                extra={
                    "model": "fake-model",
                    "usage": {"input_tokens": 100},
                    "model_context_window": 65536,
                },
            )
        record = self.plugin.HERMES_SESSION_USAGE["session-a"]
        self.assertEqual(record["model_context_window"], 65536)
        lookup.assert_not_called()

    def test_pre_llm_call_bridges_seed_and_session_usage(self):
        self.plugin.HERMES_SESSION_USAGE["session-a"] = {
            "usage": {"input_tokens": 2048, "output_tokens": 512},
            "model": "claude-sonnet",
            "model_context_window": 4096,
        }
        prompt = (
            "[session-relaunch] claim and continue handoff /tmp/handoff.md | "
            "Spec folder: specs/demo/001-task "
            "(carried from the handoff; Gate 3 answered in the sending session)"
        )
        seen = []

        def run_core(script, payload, timeout=15):
            seen.append((script, payload))
            return {"context": "seed instructions"}

        with mock.patch.object(self.plugin, "_run_core", side_effect=run_core):
            output = self.plugin.pre_llm_call(
                user_message=prompt, is_first_turn=True, session_id="session-a"
            )
        self.assertIn("seed instructions", output["context"])
        self.assertEqual(seen[0][0], self.context_path)
        self.assertEqual(seen[0][1]["session_id"], "session-a")
        self.assertTrue(seen[0][1]["is_first_turn"])
        self.assertIn("Spec folder: specs/demo/001-task", seen[0][1]["user_message"])
        self.assertEqual(seen[0][1]["usage"]["input_tokens"], 2048)
        self.assertEqual(seen[0][1]["model_context_window"], 4096)

    def test_post_api_request_and_context_bridge_are_failure_open(self):
        callback = self.hooks["post_api_request"]
        with mock.patch.object(self.plugin, "_run_core", side_effect=RuntimeError("node failed")):
            callback(
                session_id="session-a",
                extra={"model": "claude-sonnet", "usage": {"input_tokens": 2048}},
            )
            output = self.plugin.pre_llm_call(
                user_message="continue work", is_first_turn=False, session_id="session-a"
            )
        self.assertIsNone(output)

    def test_session_end_arms_loop_and_keeps_usage_for_the_next_turn(self):
        self.plugin.HERMES_SESSION_USAGE.update({"session-a": {}, "session-b": {}})
        with mock.patch.object(self.plugin, "_run_core") as run_core, \
             mock.patch.object(self.plugin, "_reap_session_helpers"):
            self.plugin.on_session_end(session_id="session-a", cwd="/tmp/work")
        self.assertEqual(run_core.call_args_list[0].args[0], self.arm_path)
        arm_payload = run_core.call_args_list[0].args[1]
        self.assertEqual(arm_payload["session_id"], "session-a")
        self.assertEqual(arm_payload["cwd"], "/tmp/work")
        self.assertIn("session-a", self.plugin.HERMES_SESSION_USAGE)
        self.assertIn("session-b", self.plugin.HERMES_SESSION_USAGE)

    def test_usage_survives_the_per_message_session_end_into_the_next_turn(self):
        # Hermes fires on_session_end after every message, so the next turn's pre_llm_call
        # is the first place the recorded usage can be read.
        self.hooks["post_api_request"](
            session_id="session-a",
            extra={"model": "gpt-6-luna", "usage": {"input_tokens": 190000}},
        )
        seen = []

        def run_core(script, payload, timeout=15):
            seen.append((script, payload))
            return {}

        with mock.patch.object(self.plugin, "_run_core", side_effect=run_core), \
             mock.patch.object(self.plugin, "_reap_session_helpers"):
            self.hooks["on_session_end"](session_id="session-a", cwd="/tmp/work")
            self.plugin.pre_llm_call(
                user_message="continue work", is_first_turn=False, session_id="session-a"
            )
        nudge_payloads = [payload for script, payload in seen if script == self.context_path]
        self.assertEqual(nudge_payloads[0]["usage"]["input_tokens"], 190000)

    def test_session_finalize_and_reset_clear_only_their_own_usage(self):
        for hook in ("on_session_finalize", "on_session_reset"):
            self.plugin.HERMES_SESSION_USAGE.clear()
            self.plugin.HERMES_SESSION_USAGE.update({"session-a": {}, "session-b": {}})
            self.hooks[hook](session_id="session-a")
            self.assertNotIn("session-a", self.plugin.HERMES_SESSION_USAGE, hook)
            self.assertIn("session-b", self.plugin.HERMES_SESSION_USAGE, hook)
            self.hooks[hook]({"session_id": "session-b"})
            self.assertEqual(self.plugin.HERMES_SESSION_USAGE, {}, hook)

    def test_kill_switch_silences_relaunch_hooks(self):
        callback = self.hooks["post_api_request"]
        with mock.patch.dict(os.environ, {"SYSTEM_SESSION_RELAUNCH_DISABLED": "1"}), \
             mock.patch.object(self.plugin, "_run_core") as run_core:
            callback(
                session_id="session-a",
                extra={"model": "claude-sonnet", "usage": {"input_tokens": 2048}},
            )
            output = self.plugin.pre_llm_call(
                user_message="continue work", is_first_turn=False, session_id="session-a"
            )
            self.plugin.on_session_end(session_id="session-a")
        self.assertNotIn("session-a", self.plugin.HERMES_SESSION_USAGE)
        self.assertIsNone(output)
        self.assertNotIn(self.context_path, [call.args[0] for call in run_core.call_args_list])
        self.assertNotIn(self.arm_path, [call.args[0] for call in run_core.call_args_list])


if __name__ == "__main__":
    unittest.main()
