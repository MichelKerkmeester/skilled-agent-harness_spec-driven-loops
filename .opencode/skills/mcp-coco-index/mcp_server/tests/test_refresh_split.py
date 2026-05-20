#!/usr/bin/env python3
"""Tests for MCP refresh/search split behavior."""

from __future__ import annotations

import asyncio
from typing import Any

from cocoindex_code.core.protocol import IndexResponse, SearchResponse
from cocoindex_code.server import create_mcp_server


class FakeDaemonClient:
    """Small daemon-client fake for FastMCP tool tests."""

    def __init__(self) -> None:
        self.index_calls: list[str] = []
        self.search_calls: list[dict[str, Any]] = []

    def index(self, project_root: str) -> IndexResponse:
        self.index_calls.append(project_root)
        return IndexResponse(success=True, message="indexed")

    def search(
        self,
        *,
        project_root: str,
        query: str,
        languages: list[str] | None = None,
        paths: list[str] | None = None,
        limit: int = 5,
        offset: int = 0,
        req_id: str | None = None,
    ) -> SearchResponse:
        self.search_calls.append(
            {
                "project_root": project_root,
                "query": query,
                "languages": languages,
                "paths": paths,
                "limit": limit,
                "offset": offset,
                "req_id": req_id,
            }
        )
        return SearchResponse(
            success=True,
            results=[],
            total_returned=0,
            offset=offset,
            dedupedAliases=0,
            uniqueResultCount=0,
            message="searched",
        )


def _mcp_and_tools(client: FakeDaemonClient) -> tuple[Any, dict[str, Any]]:
    mcp = create_mcp_server(client, "/tmp/cocoindex-project")
    return mcp, mcp._tool_manager._tools  # noqa: SLF001 - FastMCP has no public test accessor.


def test_mcp_search_refresh_index_default_is_false() -> None:
    client = FakeDaemonClient()
    mcp, tools = _mcp_and_tools(client)
    search_tool = tools["search"]

    assert search_tool.parameters["properties"]["refresh_index"]["default"] is False

    _content, result = asyncio.run(mcp.call_tool("search", {"query": "authentication logic"}))

    assert result["success"] is True
    assert client.index_calls == []
    assert len(client.search_calls) == 1


def test_mcp_search_explicit_refresh_index_true_refreshes_before_search() -> None:
    client = FakeDaemonClient()
    mcp, _tools = _mcp_and_tools(client)

    _content, result = asyncio.run(
        mcp.call_tool("search", {"query": "authentication logic", "refresh_index": True})
    )

    assert result["success"] is True
    assert client.index_calls == ["/tmp/cocoindex-project"]
    assert len(client.search_calls) == 1


def test_mcp_refresh_index_tool_refreshes_without_searching() -> None:
    client = FakeDaemonClient()
    mcp, tools = _mcp_and_tools(client)

    assert "cocoindex_refresh_index" in tools

    _content, result = asyncio.run(
        mcp.call_tool("cocoindex_refresh_index", {"paths": ["src/api"]})
    )

    assert result["success"] is True
    assert result["reqId"]
    assert result["paths"] == ["src/api"]
    assert client.index_calls == ["/tmp/cocoindex-project"]
    assert client.search_calls == []
