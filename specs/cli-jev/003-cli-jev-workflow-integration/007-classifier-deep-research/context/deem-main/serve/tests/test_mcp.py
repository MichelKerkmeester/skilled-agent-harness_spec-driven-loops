"""MCP server: JSON-RPC dispatch + stdio round-trip."""

import json
import subprocess
import sys

import pytest

from conftest import FixedBackend
from deem_mcp import McpServer, TOOLS
from deem_server import DeemCore


def make_mcp(backend=None):
    return McpServer(DeemCore(backend or FixedBackend()))


def rpc(method, params=None, request_id=1):
    request = {"jsonrpc": "2.0", "id": request_id, "method": method}
    if params is not None:
        request["params"] = params
    return request


def call_tool(server, name, arguments, request_id=7):
    return server.handle(
        rpc("tools/call", {"name": name, "arguments": arguments}, request_id)
    )


def tool_payload(response):
    assert response["id"] == 7
    assert "error" not in response
    text = response["result"]["content"][0]["text"]
    return json.loads(text)


def test_initialize():
    server = make_mcp()
    response = server.handle(rpc("initialize", {"clientInfo": {}}))
    assert response["result"]["protocolVersion"] == "2024-11-05"
    assert response["result"]["serverInfo"]["name"] == "deem-mcp"


def test_tools_list():
    server = make_mcp()
    response = server.handle(rpc("tools/list"))
    tools = response["result"]["tools"]
    assert [t["name"] for t in tools] == ["classify", "score", "check"]
    for tool in tools:
        assert tool["inputSchema"]["type"] == "object"
        assert "required" in tool["inputSchema"]
    assert len(TOOLS) == 3


def test_classify_call():
    server = make_mcp(FixedBackend(fn=lambda p, n: [3.0, 0.0]))
    response = call_tool(
        server,
        "classify",
        {"state": "the repo", "instructions": "merge?",
         "options": ["merge", "reject"]},
    )
    answer = tool_payload(response)
    assert answer["type"] == "choice"
    assert answer["choice"] == "merge"
    assert answer["probabilities"]["merge"] > 0.9
    assert 0 < answer["confidence"] < 1


def test_score_call():
    server = make_mcp(FixedBackend())
    response = call_tool(
        server,
        "score",
        {
            "state": "the review",
            "instructions": "Rate the tone.",
            "levels": ["warm", "cold"],
        },
    )
    answer = tool_payload(response)
    assert answer["type"] == "score"
    assert answer["expected"] == pytest.approx(0.5)
    assert answer["confidence"] == pytest.approx(0.0)


def test_check_call():
    server = make_mcp(FixedBackend(fn=lambda p, n: [1.0, 3.0]))
    response = call_tool(
        server,
        "check",
        {"state": "the sky", "instructions": "It is raining."},
    )
    answer = tool_payload(response)
    assert answer["type"] == "noul"
    assert answer["value"] > 0.5
    assert 0 < answer["confidence"] < 1


def test_unknown_tool_is_error():
    server = make_mcp()
    response = call_tool(
        server, "teleport", {"state": "x", "instructions": "?"}
    )
    assert response["result"].get("isError") is True


def test_invalid_arguments_reported():
    server = make_mcp()
    response = call_tool(
        server,
        "classify",
        {"state": "x", "instructions": "pick", "options": ["only-one"]},
    )
    assert response["result"].get("isError") is True
    assert "error" in json.loads(
        response["result"]["content"][0]["text"]
    )


def test_unknown_method_with_id():
    server = make_mcp()
    response = server.handle(rpc("bogus/method"))
    assert response["error"]["code"] == -32601


def test_notification_returns_none():
    server = make_mcp()
    request = {"jsonrpc": "2.0", "method": "notifications/initialized"}
    assert server.handle(request) is None


# ---------------------------------------------------------------------------
# End-to-end stdio round-trip (subprocess with the stub backend)
# ---------------------------------------------------------------------------


def test_stdio_roundtrip():
    proc = subprocess.Popen(
        [sys.executable, "serve/deem_mcp.py", "--stub"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )
    try:
        responses = []

        def read():
            line = proc.stdout.readline()
            assert line, "MCP server closed stdout unexpectedly"
            responses.append(json.loads(line))

        proc.stdin.write(json.dumps(rpc("initialize")) + "\n")
        proc.stdin.flush()
        read()
        assert responses[-1]["result"]["serverInfo"]["name"] == "deem-mcp"

        proc.stdin.write(
            json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"})
            + "\n"
        )
        proc.stdin.flush()

        proc.stdin.write(json.dumps(rpc("tools/list", request_id=2)) + "\n")
        proc.stdin.flush()
        read()
        assert len(responses[-1]["result"]["tools"]) == 3

        proc.stdin.write(
            json.dumps(
                rpc(
                    "tools/call",
                    {
                        "name": "check",
                        "arguments": {
                            "state": "the sky",
                            "instructions": "It is blue.",
                        },
                    },
                    request_id=3,
                )
            )
            + "\n"
        )
        proc.stdin.flush()
        read()
        answer = json.loads(
            responses[-1]["result"]["content"][0]["text"]
        )
        assert answer["type"] == "noul"
        assert answer["value"] == pytest.approx(0.5)  # uniform stub
    finally:
        proc.stdin.close()
        proc.wait(timeout=30)
