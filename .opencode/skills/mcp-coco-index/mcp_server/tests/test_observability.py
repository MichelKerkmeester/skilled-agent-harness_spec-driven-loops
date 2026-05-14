#!/usr/bin/env python3
"""Unit tests for CocoIndex MCP observability helpers."""

from cocoindex_code.observability import (
    DEFAULT_MCP_REQUEST_TIMEOUT_MS,
    MAX_MCP_REQUEST_TIMEOUT_MS,
    MCP_REQUEST_TIMEOUT_ENV,
    MIN_MCP_REQUEST_TIMEOUT_MS,
    resolve_mcp_request_timeout_ms,
)


def test_resolve_mcp_request_timeout_default() -> None:
    assert resolve_mcp_request_timeout_ms({}) == DEFAULT_MCP_REQUEST_TIMEOUT_MS


def test_resolve_mcp_request_timeout_invalid_uses_default() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "not-an-int"})
        == DEFAULT_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_clamps_low() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "42"})
        == MIN_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_clamps_high() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "9999999"})
        == MAX_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_accepts_in_range_value() -> None:
    assert resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "12345"}) == 12345
