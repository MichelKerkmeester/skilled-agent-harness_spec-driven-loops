#!/usr/bin/env python3
"""Run one arm of the spec-memory rerank A/B benchmark."""

from __future__ import annotations

import argparse
import json
import os
import selectors
import sqlite3
import subprocess
import sys
import time
import uuid
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def repo_root_from_script() -> Path:
    return Path(__file__).resolve().parents[7]


def db_path(repo_root: Path) -> Path:
    return repo_root / ".opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite"


def normalize_doc_id(value: str | None, repo_root: Path) -> str | None:
    if not value:
        return None
    path = value.replace("\\", "/")
    root = str(repo_root).replace("\\", "/").rstrip("/")
    if path.startswith(root + "/"):
        path = path[len(root) + 1 :]
    for marker in (".opencode/specs/", ".opencode/skills/"):
        if marker in path:
            return path.split(marker, 1)[1]
    return path.lstrip("/")


def compute_snapshot(repo_root: Path) -> dict[str, Any]:
    conn = sqlite3.connect(db_path(repo_root))
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id,
               COALESCE(spec_folder, '') AS spec_folder,
               COALESCE(file_path, '') AS file_path,
               COALESCE(content_hash, '') AS content_hash,
               COALESCE(title, '') AS title,
               COALESCE(document_type, '') AS document_type
        FROM memory_index
        ORDER BY id
        """
    ).fetchall()
    digest = sha256()
    for row in rows:
        digest.update(
            f"{row['id']}\t{row['spec_folder']}\t{row['file_path']}\t"
            f"{row['content_hash']}\t{row['title']}\t{row['document_type']}\n".encode()
        )
    max_id = conn.execute("SELECT MAX(id) FROM memory_index").fetchone()[0]
    conn.close()
    return {
        "memory_index_hash": "sha256:" + digest.hexdigest(),
        "memory_index_size": len(rows),
        "memory_index_max_id": max_id,
        "captured_at": utc_now(),
    }


def update_fixture_snapshot(fixture_path: Path, repo_root: Path) -> dict[str, Any]:
    fixture = json.loads(fixture_path.read_text())
    snapshot = compute_snapshot(repo_root)
    fixture["memory_index_hash"] = snapshot["memory_index_hash"]
    fixture["memory_index_size"] = snapshot["memory_index_size"]
    fixture["captured_at"] = snapshot["captured_at"]
    fixture_path.write_text(json.dumps(fixture, indent=2) + "\n")
    return snapshot


def verify_fixture(fixture_path: Path, repo_root: Path) -> dict[str, Any]:
    fixture = json.loads(fixture_path.read_text())
    conn = sqlite3.connect(db_path(repo_root))
    missing: list[dict[str, Any]] = []
    checked = 0
    for probe in fixture["probes"]:
        for memory_id in probe.get("gold_memory_ids", []):
            checked += 1
            row = conn.execute("SELECT id FROM memory_index WHERE id = ?", (memory_id,)).fetchone()
            if row is None:
                missing.append({"probe": probe["id"], "memory_id": memory_id})
    conn.close()
    return {"checked": checked, "missing": missing}


class McpServer:
    def __init__(self, repo_root: Path, env_overrides: dict[str, str]) -> None:
        env = os.environ.copy()
        env.update(env_overrides)
        env.setdefault("SPECKIT_SKIP_API_VALIDATION", "true")
        env.setdefault("SPECKIT_RESPONSE_PROFILE", "false")
        env.setdefault("SPECKIT_INTENT_AUTO_PROFILE", "false")
        env.setdefault("SPECKIT_PROGRESSIVE_DISCLOSURE", "false")
        env.setdefault("SPECKIT_FILE_WATCHER", "false")
        env.setdefault("MEMORY_DB_PATH", str(db_path(repo_root)))
        env.setdefault("SPECKIT_IPC_SOCKET_DIR", f"/tmp/mk-spec-memory-bench-{uuid.uuid4().hex[:10]}")

        self.repo_root = repo_root
        self.next_id = 1
        self.stderr_tail: list[str] = []
        self.proc = subprocess.Popen(
            ["node", ".opencode/skills/system-spec-kit/mcp-server/dist/context-server.js"],
            cwd=repo_root,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            env=env,
        )
        self.selector = selectors.DefaultSelector()
        assert self.proc.stdout is not None
        assert self.proc.stderr is not None
        self.selector.register(self.proc.stdout, selectors.EVENT_READ)
        self.selector.register(self.proc.stderr, selectors.EVENT_READ)

    def close(self) -> None:
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=8)
            except subprocess.TimeoutExpired:
                self.proc.kill()
                self.proc.wait(timeout=8)

    def send(self, method: str, params: dict[str, Any] | None = None, expect_response: bool = True) -> int | None:
        request_id = self.next_id if expect_response else None
        if expect_response:
            self.next_id += 1
        message: dict[str, Any] = {"jsonrpc": "2.0", "method": method}
        if expect_response:
            message["id"] = request_id
        if params is not None:
            message["params"] = params
        assert self.proc.stdin is not None
        self.proc.stdin.write(json.dumps(message) + "\n")
        self.proc.stdin.flush()
        return request_id

    def wait_response(self, request_id: int, timeout: float = 90.0) -> dict[str, Any]:
        deadline = time.time() + timeout
        while time.time() < deadline:
            if self.proc.poll() is not None:
                raise RuntimeError(
                    f"context-server exited {self.proc.returncode}; stderr tail: "
                    + "\n".join(self.stderr_tail[-40:])
                )
            for key, _ in self.selector.select(0.2):
                line = key.fileobj.readline()
                if not line:
                    continue
                if key.fileobj is self.proc.stderr:
                    self.stderr_tail.append(line.rstrip())
                    self.stderr_tail = self.stderr_tail[-200:]
                    continue
                try:
                    message = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if message.get("id") == request_id:
                    return message
        raise TimeoutError(f"timed out waiting for JSON-RPC id {request_id}")

    def drain_until_startup_scan(self, timeout: float = 120.0) -> bool:
        deadline = time.time() + timeout
        while time.time() < deadline:
            if any("Startup scan:" in line for line in self.stderr_tail):
                return True
            if self.proc.poll() is not None:
                raise RuntimeError(
                    f"context-server exited {self.proc.returncode}; stderr tail: "
                    + "\n".join(self.stderr_tail[-40:])
                )
            for key, _ in self.selector.select(0.2):
                line = key.fileobj.readline()
                if not line:
                    continue
                if key.fileobj is self.proc.stderr:
                    self.stderr_tail.append(line.rstrip())
                    self.stderr_tail = self.stderr_tail[-200:]
        return False

    def initialize(self) -> None:
        request_id = self.send(
            "initialize",
            {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "rerank-ab-benchmark", "version": "1.0"},
            },
        )
        assert request_id is not None
        self.wait_response(request_id, timeout=120)
        self.send("notifications/initialized", {}, expect_response=False)
        self.drain_until_startup_scan(timeout=180)

    def call_tool(self, name: str, arguments: dict[str, Any], timeout: float = 120.0) -> dict[str, Any]:
        request_id = self.send("tools/call", {"name": name, "arguments": arguments})
        assert request_id is not None
        response = self.wait_response(request_id, timeout=timeout)
        if "error" in response:
            raise RuntimeError(json.dumps(response["error"]))
        return response["result"]


def parse_search_payload(result: dict[str, Any]) -> dict[str, Any]:
    content = result.get("content") or []
    if not content:
        return {}
    text = content[0].get("text", "")
    return json.loads(text)


def result_doc_ids(result: dict[str, Any], repo_root: Path) -> tuple[list[str], list[int]]:
    ids: list[str] = []
    memory_ids: list[int] = []
    raw_results = result.get("data", {}).get("results", [])
    for row in raw_results[:10]:
        memory_id = row.get("id")
        if isinstance(memory_id, int):
            memory_ids.append(memory_id)
            ids.append(f"memory_index:{memory_id}")
        file_path = row.get("filePath") or row.get("file_path")
        doc_id = normalize_doc_id(file_path, repo_root)
        if doc_id:
            ids.append(doc_id)
    return ids, memory_ids


def reciprocal_rank(probe: dict[str, Any], returned_doc_ids: list[str], returned_memory_ids: list[int]) -> float:
    gold_docs = set(probe.get("gold_doc_ids", []))
    gold_memory_ids = {int(v) for v in probe.get("gold_memory_ids", [])}
    for index, doc_id in enumerate(returned_doc_ids[:10], start=1):
        if doc_id in gold_docs:
            return 1.0 / index
        if doc_id.startswith("memory_index:"):
            try:
                if int(doc_id.split(":", 1)[1]) in gold_memory_ids:
                    return 1.0 / index
            except ValueError:
                pass
    for index, memory_id in enumerate(returned_memory_ids[:10], start=1):
        if memory_id in gold_memory_ids:
            return 1.0 / index
    return 0.0


def run_arm(args: argparse.Namespace) -> None:
    repo_root = Path(args.repo_root).resolve()
    fixture_path = Path(args.fixture).resolve()
    fixture = json.loads(fixture_path.read_text())
    verification = verify_fixture(fixture_path, repo_root)
    if verification["missing"]:
        raise SystemExit(f"Fixture gold_memory_ids missing from memory_index: {verification['missing']}")

    env = {
        "SPECKIT_CROSS_ENCODER": args.cross_encoder,
        "RERANKER_LOCAL": args.reranker_local,
    }
    server = McpServer(repo_root, env)
    try:
        server.initialize()
        if args.settle_only:
            print(json.dumps({"status": "settled", "verification": verification}))
            return

        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        rows_written = 0
        with out_path.open("w", encoding="utf-8") as handle:
            for run in range(1, args.runs + 1):
                for probe in fixture["probes"]:
                    search_args = {
                        "query": probe["query"],
                        "limit": 10,
                        "includeTrace": True,
                        "includeContent": False,
                        "rerank": True,
                        "bypassCache": True,
                        "enableDedup": False,
                        "trackAccess": False,
                    }
                    started = time.perf_counter()
                    error: str | None = None
                    payload: dict[str, Any] = {}
                    try:
                        raw_result = server.call_tool("memory_search", search_args, timeout=args.query_timeout)
                        payload = parse_search_payload(raw_result)
                    except Exception as exc:  # noqa: BLE001 - benchmark rows preserve failures.
                        error = str(exc)
                    latency_ms = round((time.perf_counter() - started) * 1000, 3)
                    returned_doc_ids, returned_memory_ids = result_doc_ids(payload, repo_root)
                    rr = reciprocal_rank(probe, returned_doc_ids, returned_memory_ids)
                    stage3 = payload.get("data", {}).get("pipelineMetadata", {}).get("stage3", {})
                    rerank_provider = stage3.get("rerankProvider")
                    scoring_method = "cross-encoder" if rerank_provider == "cross-encoder" else "fallback"
                    row = {
                        "arm": args.arm,
                        "run": run,
                        "fixture_id": probe["id"],
                        "query": probe["query"],
                        "gold_doc_ids": probe["gold_doc_ids"],
                        "gold_memory_ids": probe.get("gold_memory_ids", []),
                        "difficulty": probe["difficulty"],
                        "category": probe["category"],
                        "returned_doc_ids": returned_doc_ids[:10],
                        "returned_memory_ids": returned_memory_ids[:10],
                        "hit_at_10": rr > 0,
                        "reciprocal_rank": rr,
                        "latency_ms": latency_ms,
                        "scoringMethod": scoring_method,
                        "rerank_used": bool(stage3.get("rerankApplied")),
                        "rerank_provider": rerank_provider,
                        "rerank_gate": stage3.get("rerankGateDecision"),
                        "result_count": len(payload.get("data", {}).get("results", [])),
                        "memory_index_hash": fixture.get("memory_index_hash"),
                        "memory_index_size": fixture.get("memory_index_size"),
                        "ts": utc_now(),
                    }
                    if error:
                        row["error"] = error
                    handle.write(json.dumps(row, sort_keys=True) + "\n")
                    rows_written += 1
                    handle.flush()
        print(json.dumps({"status": "ok", "rows": rows_written, "out": str(out_path)}))
    finally:
        server.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture", required=True)
    parser.add_argument("--out")
    parser.add_argument("--arm", default="A")
    parser.add_argument("--runs", type=int, default=5)
    parser.add_argument("--repo-root", default=str(repo_root_from_script()))
    parser.add_argument("--cross-encoder", choices=["true", "false"], default="false")
    parser.add_argument("--reranker-local", choices=["true", "false"], default="false")
    parser.add_argument("--query-timeout", type=float, default=180.0)
    parser.add_argument("--settle-only", action="store_true")
    parser.add_argument("--update-snapshot", action="store_true")
    parser.add_argument("--verify-fixture", action="store_true")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    fixture_path = Path(args.fixture).resolve()
    if args.update_snapshot:
        print(json.dumps(update_fixture_snapshot(fixture_path, repo_root)))
        return
    if args.verify_fixture:
        result = verify_fixture(fixture_path, repo_root)
        print(json.dumps(result))
        if result["missing"]:
            raise SystemExit(1)
        return
    if not args.out and not args.settle_only:
        parser.error("--out is required unless --settle-only is set")
    run_arm(args)


if __name__ == "__main__":
    main()
