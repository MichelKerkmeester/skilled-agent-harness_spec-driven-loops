#!/usr/bin/env python3
"""Deem MCP server — classify / score / check over JSON-RPC 2.0 stdio.

Minimal implementation: no MCP SDK dependency, just newline-delimited
JSON-RPC 2.0 over stdin/stdout (per the MCP stdio transport), errors and
logs to stderr.  Exposes three tools that call the same core readout as
``deem_server.py``:

* ``classify`` — Choice: pick from 2–255 options.
* ``score``    — Score: rate against 2–10 ordered levels.
* ``check``    — Noul: probability a proposition is true.

Configuration is shared with the HTTP server (same environment variables;
see ``deem_server.py``).  Run:

    .venv/bin/python serve/deem_mcp.py            # stub backend
    DEEM_CHECKPOINT=... .venv-sft/bin/python serve/deem_mcp.py

Wire it into a client (e.g. Claude Code) as a stdio MCP server; every tool
returns its answer as a JSON text block with ``probabilities``,
``confidence`` and the applied ``temperature``.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# deem_server.py lives next to us; core logic is shared with the HTTP lane.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from deem_server import (  # noqa: E402
    Calibration,
    DEFAULT_MODEL_ID,
    DeemCore,
    RequestError,
    StubBackend,
    TorchBackend,
)

PROTOCOL_VERSION = "2024-11-05"
SERVER_INFO = {"name": "deem-mcp", "version": "0.1.0"}

CLASSIFY_SCHEMA = {
    "type": "object",
    "properties": {
        "state": {"description": "The decision state (any JSON value)."},
        "instructions": {"type": "string"},
        "options": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 2,
            "maxItems": 255,
        },
        "dataset": {"type": "string",
                    "description": "calibration temperature key"},
    },
    "required": ["state", "instructions", "options"],
}

SCORE_SCHEMA = {
    "type": "object",
    "properties": {
        "state": {"description": "The decision state (any JSON value)."},
        "instructions": {"type": "string"},
        "levels": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 2,
            "maxItems": 10,
        },
        "dataset": {"type": "string",
                    "description": "calibration temperature key"},
    },
    "required": ["state", "instructions", "levels"],
}

CHECK_SCHEMA = {
    "type": "object",
    "properties": {
        "state": {"description": "The decision state (any JSON value)."},
        "instructions": {
            "type": "string",
            "description": "The proposition to evaluate.",
        },
        "dataset": {"type": "string",
                    "description": "calibration temperature key"},
    },
    "required": ["state", "instructions"],
}

TOOLS = [
    {
        "name": "classify",
        "description": (
            "Pick one option (2-255) for the given state. Returns the "
            "choice, per-option probabilities and derived confidence."
        ),
        "inputSchema": CLASSIFY_SCHEMA,
    },
    {
        "name": "score",
        "description": (
            "Rate the state against 2-10 ordered descriptive levels. "
            "Returns the level, level distribution, expected score and "
            "confidence."
        ),
        "inputSchema": SCORE_SCHEMA,
    },
    {
        "name": "check",
        "description": (
            "Probability that a proposition about the state is true. "
            "Returns a value in [0, 1] plus derived confidence."
        ),
        "inputSchema": CHECK_SCHEMA,
    },
]


class McpServer:
    """JSON-RPC 2.0 dispatch for the three Deem tools."""

    def __init__(self, core: DeemCore):
        self.core = core

    def handle(self, request: dict):
        """Handle one JSON-RPC request. Notifications (no id) -> None."""
        method = request.get("method")
        params = request.get("params", {})
        if method == "initialize":
            return self._result(request, {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {"tools": {}},
                "serverInfo": SERVER_INFO,
            })
        if method == "ping":
            return self._result(request, {})
        if method == "tools/list":
            return self._result(request, {"tools": TOOLS})
        if method == "tools/call":
            return self._result(request, self._call_tool(params))
        if method.startswith("notifications/"):
            return None
        if "id" in request:
            return self._error(request, -32601, f"unknown method: {method}")
        return None

    def _result(self, request, result):
        return {"jsonrpc": "2.0", "id": request.get("id"), "result": result}

    def _error(self, request, code, message):
        return {
            "jsonrpc": "2.0",
            "id": request.get("id"),
            "error": {"code": code, "message": message},
        }

    def _call_tool(self, params):
        name = params.get("name")
        args = params.get("arguments", {}) or {}
        if name not in ("classify", "score", "check"):
            return {
                "content": [{"type": "text", "text": json.dumps(
                    {"error": f"unknown tool: {name}"}
                )}],
                "isError": True,
            }
        try:
            if name == "classify":
                questions = {
                    "q": {
                        "type": "choice",
                        "instructions": args["instructions"],
                        "options": args["options"],
                    }
                }
            elif name == "score":
                questions = {
                    "q": {
                        "type": "score",
                        "instructions": args["instructions"],
                        "levels": args["levels"],
                    }
                }
            else:
                questions = {
                    "q": {
                        "type": "noul",
                        "instructions": args["instructions"],
                    }
                }
            result = self.core.decide(
                args["state"], questions, args.get("dataset")
            )
            answer = result["answers"]["q"]
            answer["usage"] = result["usage"]
            return {
                "content": [
                    {"type": "text", "text": json.dumps(answer)}
                ]
            }
        except (RequestError, KeyError, TypeError, ValueError) as exc:
            return {
                "content": [{"type": "text", "text": json.dumps(
                    {"error": str(exc)}
                )}],
                "isError": True,
            }


def make_core():
    """Build a DeemCore from the environment (same vars as the server)."""
    checkpoint = os.environ.get("DEEM_CHECKPOINT", "")
    if checkpoint:
        import torch  # noqa: F401  (fail fast on missing deps)
        from transformers import AutoModelForCausalLM  # noqa: F401
        backend = TorchBackend(
            checkpoint,
            device=os.environ.get("DEEM_DEVICE", "auto"),
            batch_size=int(os.environ.get("DEEM_BATCH_SIZE", "4")),
        )
    else:
        backend = StubBackend()
    calibration = Calibration()
    calib_path = os.environ.get("DEEM_CALIBRATION", "")
    if calib_path:
        calibration = Calibration.from_file(
            calib_path, key=os.environ.get("DEEM_CALIBRATION_KEY")
        )
    return DeemCore(
        backend,
        calibration=calibration,
        model_id=os.environ.get("DEEM_MODEL_ID", DEFAULT_MODEL_ID),
    )


def serve(stdin, stdout):
    server = McpServer(make_core())
    for line in stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
        except json.JSONDecodeError as exc:
            if '"id"' in line:
                print(
                    json.dumps({
                        "jsonrpc": "2.0", "id": None,
                        "error": {"code": -32700, "message": str(exc)},
                    }),
                    file=stdout,
                )
                stdout.flush()
            continue
        response = server.handle(request)
        if response is not None:
            print(json.dumps(response), file=stdout)
            stdout.flush()


def main(argv=None):
    import argparse

    parser = argparse.ArgumentParser(description="Deem MCP stdio server")
    parser.add_argument(
        "--stub", action="store_true",
        help="force the deterministic stub backend (uniform logits)",
    )
    args = parser.parse_args(argv)
    if args.stub:
        os.environ.pop("DEEM_CHECKPOINT", None)
    serve(sys.stdin, sys.stdout)


if __name__ == "__main__":
    main()
