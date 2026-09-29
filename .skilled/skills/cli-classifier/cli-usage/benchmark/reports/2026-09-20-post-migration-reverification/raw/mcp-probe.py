#!/usr/bin/env python3
"""Handshake with `jev-mcp` over stdio and print its advertised tools.

Read-only probe: it starts the server, initializes a session, lists tools, and
exits. No judgment call is made, so no credential is required and no network
request leaves the machine.
"""

import json
import subprocess
import sys


def main() -> int:
    process = subprocess.Popen(
        ["jev-mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )

    def send(payload: dict) -> None:
        assert process.stdin is not None
        process.stdin.write(json.dumps(payload) + "\n")
        process.stdin.flush()

    send(
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-06-18",
                "capabilities": {},
                "clientInfo": {"name": "jev-contract-probe", "version": "1.0.0"},
            },
        }
    )
    print("initialize:", process.stdout.readline().strip())

    send({"jsonrpc": "2.0", "method": "notifications/initialized"})
    send({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
    line = process.stdout.readline().strip()
    print("tools/list:", line)

    try:
        tools = json.loads(line)["result"]["tools"]
    except (json.JSONDecodeError, KeyError, TypeError) as exc:
        print(f"could not parse the tool list: {exc}", file=sys.stderr)
        process.kill()
        return 1

    for tool in tools:
        schema = tool.get("inputSchema", {})
        required = schema.get("required", [])
        properties = sorted(schema.get("properties", {}))
        print(f"  tool={tool['name']} required={required} properties={properties}")

    process.kill()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
