"""Shared fixtures for the Deem serving-lane tests."""

import json
import threading
import urllib.error
import urllib.request
from contextlib import contextmanager

import pytest

import sys
from pathlib import Path

SERVE_DIR = Path(__file__).resolve().parents[1]
if str(SERVE_DIR) not in sys.path:
    sys.path.insert(0, str(SERVE_DIR))

from deem_server import (  # noqa: E402
    Calibration,
    DeemCore,
    RequestError,
    make_server,
)


class FixedBackend:
    """Deterministic test backend: logits from a per-prompt function.

    Default: uniform logits (all zeros) like the production stub.
    """

    name = "fixed"
    max_letters = 255

    def __init__(self, fn=None):
        self.fn = fn or (lambda prompt, n: [0.0] * n)
        self.calls = []

    def slot_logits(self, prompts, n_valids):
        out = []
        for prompt, n in zip(prompts, n_valids):
            self.calls.append((prompt, n))
            out.append(
                {
                    "logits": list(self.fn(prompt, n)),
                    "tokens": max(1, len(prompt.split())),
                }
            )
        return out


@contextmanager
def live_server(backend=None, calibration=None, model_id="deem-test"):
    """Run the real HTTP server on an ephemeral port; yields its base URL."""
    core = DeemCore(
        backend or FixedBackend(), calibration=calibration, model_id=model_id
    )
    server = make_server(core)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


def post(base_url, path, payload):
    """POST JSON; returns (status, parsed body or None)."""
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        base_url + path, data=data, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, json.loads(response.read())
    except urllib.error.HTTPError as exc:
        return exc.code, json.loads(exc.read())


def get(base_url, path):
    try:
        with urllib.request.urlopen(base_url + path, timeout=30) as response:
            return response.status, json.loads(response.read())
    except urllib.error.HTTPError as exc:
        return exc.code, json.loads(exc.read())


@pytest.fixture
def base_url():
    with live_server() as url:
        yield url
