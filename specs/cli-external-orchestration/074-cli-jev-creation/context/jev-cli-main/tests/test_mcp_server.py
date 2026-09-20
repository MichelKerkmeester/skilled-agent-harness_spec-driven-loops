import io
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
from email.message import Message
from pathlib import Path
from unittest.mock import patch

import mcp.types as mcp_types
from mcp.client import Client
from mcp.client.stdio import StdioServerParameters

import jev_cli as jev
from jev_cli import mcp_server

TOOLS = ("choice", "noul", "run", "score")
SUBPROCESS_TIMEOUT = 60
README = Path(__file__).resolve().parents[1] / "README.md"
SHARED_OVERRIDES = ("provider", "model", "endpoint")


def readme_run_example() -> dict:
    """The single documented `run` argument object, read straight out of the README."""
    blocks = re.findall(r"```json\n(.*?)```", README.read_text(), re.DOTALL)
    examples = [parsed for block in blocks if "request" in (parsed := json.loads(block))]
    if len(examples) != 1:
        raise AssertionError(f"README must document exactly one run request, found {len(examples)}")
    return examples[0]


def resolve(schema: dict, node: dict) -> dict:
    """Follow one `$ref` into the schema's `$defs` so tests read the published shape, not the pointer."""
    reference = node.get("$ref")
    if reference is None:
        return node
    return schema["$defs"][reference.removeprefix("#/$defs/")]


def server_environment(home: str, **overrides: str) -> dict[str, str]:
    """A child environment with no inherited Jev credentials or provider configuration."""
    environment = {
        "PATH": os.environ.get("PATH", ""),
        "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
        "HOME": home,
        "USERPROFILE": home,
        "XDG_CONFIG_HOME": home,
        "JEV_PROVIDER": "custom",
    }
    environment.update(overrides)
    return environment


class HttpResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class McpStdioTransportTest(unittest.IsolatedAsyncioTestCase):
    """Drive the installed module over a real stdio subprocess through the MCP SDK client."""

    async def published_schemas(self) -> dict[str, dict]:
        """The input schemas an external agent actually receives from `tools/list`."""
        with tempfile.TemporaryDirectory() as home:
            parameters = StdioServerParameters(
                command=sys.executable,
                args=["-m", "jev_cli.mcp_server"],
                env=server_environment(home),
            )
            async with Client(parameters) as client:
                listed = await client.list_tools()
        return {tool.name: tool.input_schema for tool in listed.tools}

    async def test_every_public_argument_publishes_a_behavioral_description(self):
        schemas = await self.published_schemas()
        self.assertEqual(tuple(sorted(schemas)), TOOLS)
        for name, schema in schemas.items():
            for argument, published in schema["properties"].items():
                with self.subTest(tool=name, argument=argument):
                    description = published.get("description", "")
                    # A title such as "State" is generated; a description has to explain behavior.
                    self.assertNotEqual(description, "")
                    self.assertNotEqual(description.lower(), argument.lower())
                    self.assertGreater(len(description.split()), 4)
        for argument in SHARED_OVERRIDES:
            described = {schema["properties"][argument]["description"] for schema in schemas.values()}
            self.assertEqual(len(described), 1, f"{argument} is described inconsistently: {described}")
            self.assertIn("Normally omitted", described.pop())

    async def test_run_publishes_a_structured_and_forward_compatible_request_schema(self):
        schema = (await self.published_schemas())["run"]
        request = resolve(schema, schema["properties"]["request"])
        self.assertEqual(sorted(request["required"]), ["questions", "state"])
        self.assertEqual(sorted(request["properties"]), ["model", "questions", "state"])
        self.assertTrue(request["additionalProperties"])
        question = resolve(schema, request["properties"]["questions"]["additionalProperties"])
        self.assertEqual(sorted(question["required"]), ["instructions", "type"])
        self.assertEqual(question["properties"]["type"]["enum"], ["noul", "choice", "score"])
        self.assertTrue(question["additionalProperties"])
        criteria = question["properties"]["criteria"]["description"]
        self.assertIn("choice", criteria)
        self.assertIn("score", criteria)

    async def test_the_readme_run_example_matches_the_published_request_schema(self):
        schema = (await self.published_schemas())["run"]
        example = readme_run_example()
        self.assertLessEqual(set(schema["required"]), set(example))
        request = resolve(schema, schema["properties"]["request"])
        self.assertLessEqual(set(request["required"]), set(example["request"]))
        self.assertLessEqual(set(example["request"]), set(request["properties"]))
        question_schema = resolve(schema, request["properties"]["questions"]["additionalProperties"])
        documented = set()
        for key, question in example["request"]["questions"].items():
            with self.subTest(question=key):
                self.assertLessEqual(set(question_schema["required"]), set(question))
                self.assertLessEqual(set(question), set(question_schema["properties"]))
                self.assertIn(question["type"], question_schema["properties"]["type"]["enum"])
                documented.add(question["type"])
        self.assertEqual(documented, set(question_schema["properties"]["type"]["enum"]))

    async def test_stdio_client_discovers_exactly_the_four_jev_tools(self):
        with tempfile.TemporaryDirectory() as home:
            parameters = StdioServerParameters(
                command=sys.executable,
                args=["-m", "jev_cli.mcp_server"],
                env=server_environment(home),
            )
            async with Client(parameters) as client:
                listed = await client.list_tools()
        self.assertEqual(tuple(sorted(tool.name for tool in listed.tools)), TOOLS)
        schemas = {tool.name: tool.input_schema for tool in listed.tools}
        self.assertEqual(sorted(schemas["noul"]["required"]), ["question", "state"])
        self.assertEqual(sorted(schemas["choice"]["required"]), ["options", "question", "state"])
        self.assertEqual(sorted(schemas["score"]["required"]), ["levels", "question", "state"])
        self.assertEqual(schemas["run"]["required"], ["request"])
        self.assertEqual(
            schemas["noul"]["properties"]["provider"]["anyOf"][0]["enum"],
            list(jev.PROVIDERS),
        )

    async def test_stdio_client_receives_configuration_failure_as_a_tool_error(self):
        with tempfile.TemporaryDirectory() as home:
            parameters = StdioServerParameters(
                command=sys.executable,
                args=["-m", "jev_cli.mcp_server"],
                env=server_environment(home),
            )
            async with Client(parameters) as client:
                result = await client.call_tool("noul", {"state": "today", "question": "Urgent?"})
        self.assertTrue(result.is_error)
        self.assertIn("JEV_ENDPOINT", result.content[0].text)


class McpStdioFramingTest(unittest.TestCase):
    def test_stdout_carries_only_json_rpc_frames(self):
        frames = [
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocolVersion": mcp_types.LATEST_PROTOCOL_VERSION,
                    "capabilities": {},
                    "clientInfo": {"name": "framing-test", "version": "0"},
                },
            },
            {"jsonrpc": "2.0", "method": "notifications/initialized"},
            {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}},
            {
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {"name": "noul", "arguments": {"state": "today", "question": "Urgent?"}},
            },
        ]
        with tempfile.TemporaryDirectory() as home:
            process = subprocess.Popen(
                [sys.executable, "-m", "jev_cli.mcp_server"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=server_environment(home),
            )
            watchdog = threading.Timer(SUBPROCESS_TIMEOUT, process.kill)
            watchdog.start()
            try:
                process.stdin.write("".join(json.dumps(frame) + "\n" for frame in frames))
                process.stdin.flush()
                lines = [process.stdout.readline() for _ in range(3)]
            finally:
                watchdog.cancel()
                process.stdin.close()
                process.wait(timeout=SUBPROCESS_TIMEOUT)
                process.stdout.close()
                stderr = process.stderr.read()
                process.stderr.close()
        self.assertEqual(process.returncode, 0, stderr)
        responses = []
        for line in lines:
            self.assertTrue(line.endswith("\n"), f"truncated stdout line: {line!r}")
            frame = json.loads(line)
            self.assertEqual(frame["jsonrpc"], "2.0")
            responses.append(frame)
        self.assertEqual([frame["id"] for frame in responses], [1, 2, 3])
        self.assertEqual(
            tuple(sorted(tool["name"] for tool in responses[1]["result"]["tools"])),
            TOOLS,
        )
        self.assertTrue(responses[2]["result"]["isError"])
        self.assertIn("JEV_ENDPOINT", stderr)

    def test_startup_and_shutdown_write_nothing_to_stdout(self):
        with tempfile.TemporaryDirectory() as home:
            completed = subprocess.run(
                [sys.executable, "-m", "jev_cli.mcp_server"],
                stdin=subprocess.DEVNULL,
                capture_output=True,
                text=True,
                timeout=SUBPROCESS_TIMEOUT,
                env=server_environment(home),
            )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(completed.stdout, "")


class McpToolBehaviorTest(unittest.IsolatedAsyncioTestCase):
    """Exercise the tools through the SDK client in process, with the provider boundary mocked."""

    def setUp(self):
        # An MCP session owns anyio cancel scopes, so each test opens and closes its own.
        environment = patch.dict(os.environ, {}, clear=True)
        environment.start()
        self.addCleanup(environment.stop)

    async def call_tool(self, name, arguments):
        async with Client(mcp_server.mcp) as client:
            return await client.call_tool(name, arguments)

    async def invoke(self, name, arguments, response=None):
        with patch.object(mcp_server, "call", return_value=response or {"answers": {}}) as call:
            result = await self.call_tool(name, arguments)
        return result, call

    async def test_noul_builds_a_single_question_request(self):
        response = {"model": "jev-1.13.0", "answers": {"answer": {"noul": 0.9}}}
        result, call = await self.invoke(
            "noul", {"state": "Restore service today.", "question": "Urgent?"}, response
        )
        self.assertFalse(result.is_error)
        self.assertEqual(result.structured_content, response)
        payload, endpoint, provider = call.call_args.args
        self.assertEqual(provider, "official")
        self.assertEqual(endpoint, jev.API_URL)
        self.assertEqual(
            payload,
            {
                "state": "Restore service today.",
                "model": "jev-latest",
                "questions": {"answer": {"type": "noul", "instructions": "Urgent?"}},
            },
        )

    async def test_choice_sends_the_option_map_as_criteria(self):
        options = {"tech": "Bug", "sales": "Purchase"}
        _, call = await self.invoke(
            "choice", {"state": "broken", "question": "Route?", "options": options}
        )
        question = call.call_args.args[0]["questions"]["answer"]
        self.assertEqual(question["type"], "choice")
        self.assertEqual(question["criteria"], options)

    async def test_score_sends_ordered_levels_as_criteria(self):
        levels = ["Calm", "Concerned", "Angry"]
        _, call = await self.invoke(
            "score", {"state": "Third failure.", "question": "Frustrated?", "levels": levels}
        )
        question = call.call_args.args[0]["questions"]["answer"]
        self.assertEqual(question["type"], "score")
        self.assertEqual(question["criteria"], levels)

    async def test_run_forwards_the_complete_request_and_adds_a_default_model(self):
        request = {"state": {"message": "today"}, "questions": {"urgent": {"type": "noul", "instructions": "?"}}}
        _, call = await self.invoke("run", {"request": request})
        payload = call.call_args.args[0]
        self.assertEqual(payload["state"], request["state"])
        self.assertEqual(payload["questions"], request["questions"])
        self.assertEqual(payload["model"], "jev-latest")

    async def test_run_forwards_a_typed_multi_question_request_without_field_loss(self):
        request = {
            "state": {"message": "The invoice is wrong again and I want a refund."},
            "questions": {
                "urgent": {"type": "noul", "instructions": "Reply today?"},
                "team": {
                    "type": "choice",
                    "instructions": "Owner?",
                    "criteria": {"billing": "Money", "support": "Product"},
                },
                "anger": {"type": "score", "instructions": "Frustrated?", "criteria": ["Calm", "Angry"]},
                # Fields this client predates must survive the typed schema untouched.
                "later": {"type": "noul", "instructions": "?", "unknown_question_field": {"nested": 1}},
            },
            "unknown_request_field": [1, 2],
        }
        _, call = await self.invoke("run", {"request": request})
        self.assertEqual(call.call_args.args[0], {**request, "model": "jev-latest"})

    async def test_run_still_accepts_an_empty_questions_map(self):
        _, call = await self.invoke("run", {"request": {"state": "today", "questions": {}}})
        self.assertEqual(call.call_args.args[0]["questions"], {})

    async def test_the_readme_run_example_reaches_the_provider_unchanged(self):
        example = readme_run_example()
        _, call = await self.invoke("run", example)
        self.assertEqual(call.call_args.args[0], {**example["request"], "model": "jev-latest"})

    async def test_run_preserves_the_request_model_unless_overridden(self):
        request = {"state": "today", "questions": {}, "model": "request-model"}
        _, call = await self.invoke("run", {"request": request})
        self.assertEqual(call.call_args.args[0]["model"], "request-model")
        _, call = await self.invoke("run", {"request": request, "model": "tool-model"})
        self.assertEqual(call.call_args.args[0]["model"], "tool-model")

    async def test_provider_selection_matches_the_cli_defaults(self):
        for provider, model in (
            ("official", "jev-latest"),
            ("vercel", "typesafe-ai/jev"),
            ("openrouter", "typesafe/jev-1.13"),
        ):
            with self.subTest(provider=provider):
                _, call = await self.invoke(
                    "noul", {"state": "today", "question": "Urgent?", "provider": provider}
                )
                payload, endpoint, selected = call.call_args.args
                self.assertEqual(selected, provider)
                self.assertEqual(payload["model"], model)
                self.assertEqual(endpoint, jev.PROVIDERS[provider]["endpoint"])

    async def test_custom_provider_uses_its_environment_configuration(self):
        environment = {"JEV_ENDPOINT": "https://proxy.example.test/v1/systemone", "JEV_MODEL": "proxy-jev"}
        with patch.dict(os.environ, environment):
            _, call = await self.invoke(
                "noul", {"state": "today", "question": "Urgent?", "provider": "custom"}
            )
        payload, endpoint, provider = call.call_args.args
        self.assertEqual(provider, "custom")
        self.assertEqual(endpoint, environment["JEV_ENDPOINT"])
        self.assertEqual(payload["model"], environment["JEV_MODEL"])

    async def test_explicit_model_and_endpoint_override_provider_defaults(self):
        _, call = await self.invoke(
            "noul",
            {
                "state": "today",
                "question": "Urgent?",
                "model": "override-model",
                "endpoint": "https://override.test/systemone",
            },
        )
        payload, endpoint, _ = call.call_args.args
        self.assertEqual(payload["model"], "override-model")
        self.assertEqual(endpoint, "https://override.test/systemone")

    async def test_jev_provider_environment_selects_the_default_provider(self):
        with patch.dict(os.environ, {"JEV_PROVIDER": "openrouter"}):
            _, call = await self.invoke("noul", {"state": "today", "question": "Urgent?"})
        self.assertEqual(call.call_args.args[2], "openrouter")

    async def test_invalid_jev_provider_fails_before_any_provider_access(self):
        with patch.dict(os.environ, {"JEV_PROVIDER": "unknown"}), patch.object(mcp_server, "call") as call:
            result = await self.call_tool("noul", {"state": "today", "question": "Urgent?"})
        self.assertTrue(result.is_error)
        self.assertIn("invalid JEV_PROVIDER: unknown", result.content[0].text)
        call.assert_not_called()

    async def test_invalid_structured_input_fails_before_any_provider_access(self):
        cases = (
            ("choice", {"state": "x", "question": "q", "options": {"a": "Bug", "b": ""}}, "non-empty key and description"),
            ("score", {"state": "x", "question": "q", "levels": ["low", ""]}, "non-empty description"),
            # The published request schema rejects a missing member before the tool body runs.
            ("run", {"request": {"state": "x"}}, "request.questions"),
            ("run", {"request": {"questions": {}}}, "request.state"),
            ("run", {"request": {"state": "x", "questions": {"a": {"type": "vibe"}}}}, "questions.a"),
        )
        for name, arguments, message in cases:
            with self.subTest(tool=name, arguments=arguments):
                with patch.object(mcp_server, "call") as call:
                    result = await self.call_tool(name, arguments)
                self.assertTrue(result.is_error)
                self.assertIn(message, result.content[0].text)
                call.assert_not_called()

    async def test_fewer_than_two_entries_fails_before_any_provider_access(self):
        cases = (
            ("choice", {}, "options map with at least two entries"),
            ("choice", {"tech": "Bug"}, "options map with at least two entries"),
            ("score", [], "levels list with at least two entries"),
            ("score", ["Calm"], "levels list with at least two entries"),
        )
        for name, criteria, message in cases:
            argument = "options" if name == "choice" else "levels"
            with self.subTest(tool=name, criteria=criteria):
                with patch.object(mcp_server, "call") as call:
                    result = await self.call_tool(
                        name, {"state": "x", "question": "q", argument: criteria}
                    )
                self.assertTrue(result.is_error)
                self.assertIn(message, result.content[0].text)
                call.assert_not_called()

    async def test_two_entries_reach_the_provider_with_the_criteria_preserved(self):
        options = {"tech": "Bug", "sales": "Purchase"}
        _, call = await self.invoke(
            "choice", {"state": "broken", "question": "Route?", "options": options}
        )
        self.assertEqual(call.call_args.args[0]["questions"]["answer"]["criteria"], options)
        levels = ["Calm", "Angry"]
        _, call = await self.invoke(
            "score", {"state": "Third failure.", "question": "Frustrated?", "levels": levels}
        )
        self.assertEqual(call.call_args.args[0]["questions"]["answer"]["criteria"], levels)

    async def test_cli_error_reaches_the_client_as_a_bounded_tool_error(self):
        with patch.object(mcp_server, "call", side_effect=jev.CliError("API HTTP 401: bad key", 3)):
            result = await self.call_tool("noul", {"state": "today", "question": "Urgent?"})
        self.assertTrue(result.is_error)
        self.assertIn("API HTTP 401", result.content[0].text)

    async def test_unexpected_api_response_becomes_a_tool_error(self):
        with patch.object(mcp_server, "call", side_effect=KeyError("answers")):
            result = await self.call_tool("noul", {"state": "today", "question": "Urgent?"})
        self.assertTrue(result.is_error)
        self.assertIn("unexpected API response", result.content[0].text)

    async def test_authentication_failure_never_returns_the_api_key(self):
        error = urllib.error.HTTPError(
            "https://example.test", 401, "Unauthorized", Message(), io.BytesIO(b'{"error":"bad key"}')
        )
        with patch.dict(os.environ, {"TYPESAFE_API_KEY": "sentinel-api-key"}), patch(
            "urllib.request.urlopen", side_effect=error
        ):
            result = await self.call_tool("noul", {"state": "today", "question": "Urgent?"})
        text = result.content[0].text
        self.assertTrue(result.is_error)
        self.assertIn("API HTTP 401", text)
        self.assertNotIn("sentinel-api-key", text)
        self.assertNotIn("Bearer", text)

    async def test_state_strings_that_resemble_cli_syntax_are_sent_verbatim(self):
        with tempfile.TemporaryDirectory() as directory:
            secret = Path(directory) / "state.txt"
            secret.write_text("file content that must not be read")
            for state in ("-", f"@{secret}"):
                with self.subTest(state=state):
                    with patch.object(jev, "read_text", side_effect=AssertionError("read_text was called")), patch(
                        "sys.stdin", io.StringIO("stdin content that must not be read")
                    ):
                        _, call = await self.invoke("noul", {"state": state, "question": "Urgent?"})
                    payload = call.call_args.args[0]
                    self.assertEqual(payload["state"], state)
                    self.assertNotIn("file content", json.dumps(payload))
                    self.assertNotIn("stdin content", json.dumps(payload))

    async def test_any_json_value_is_accepted_as_state(self):
        state = {"message": "Please respond today", "priority": "high"}
        _, call = await self.invoke("noul", {"state": state, "question": "Urgent?"})
        self.assertEqual(call.call_args.args[0]["state"], state)

    async def test_vercel_translation_and_normalization_reach_the_tool_result(self):
        body = {"answers": {"answer": {"type": "boolean", "probability": 0.9}}}
        captured = []

        def open_url(request, timeout):
            captured.append(request)
            return HttpResponse(json.dumps(body).encode())

        with patch.dict(os.environ, {"AI_GATEWAY_API_KEY": "gateway-key"}), patch(
            "urllib.request.urlopen", side_effect=open_url
        ):
            result = await self.call_tool(
                "noul", {"state": "today", "question": "Urgent?", "provider": "vercel"}
            )
        self.assertFalse(result.is_error)
        self.assertEqual(result.structured_content, {"answers": {"answer": {"noul": 0.9}}})
        sent = json.loads(captured[0].data)
        self.assertEqual(sent["questions"]["answer"]["type"], "boolean")
        self.assertEqual(captured[0].headers["Ai-model-id"], "typesafe-ai/jev")


if __name__ == "__main__":
    unittest.main()
