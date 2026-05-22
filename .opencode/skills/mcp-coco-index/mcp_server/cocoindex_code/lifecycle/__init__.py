"""Lifecycle helpers for CocoIndex daemon work ownership."""

from .active_work_registry import (
    ActiveWorkRegistry,
    ActiveWorkRow,
    DrainResult,
    active_work_registry,
    async_remove_project_with_drain,
    remove_project_timeout_seconds,
    remove_project_with_drain,
)
from .cancel_protocol import CancelRequest, CancelStatus, match_cancel_request
from .daemon_task_registry import (
    DaemonTaskRegistry,
    daemon_task_registry,
    get_mcp_threadpool,
    shutdown_mcp_threadpool,
)

__all__ = [
    "ActiveWorkRegistry",
    "ActiveWorkRow",
    "CancelRequest",
    "CancelStatus",
    "DaemonTaskRegistry",
    "DrainResult",
    "active_work_registry",
    "async_remove_project_with_drain",
    "daemon_task_registry",
    "get_mcp_threadpool",
    "match_cancel_request",
    "remove_project_timeout_seconds",
    "remove_project_with_drain",
    "shutdown_mcp_threadpool",
]
