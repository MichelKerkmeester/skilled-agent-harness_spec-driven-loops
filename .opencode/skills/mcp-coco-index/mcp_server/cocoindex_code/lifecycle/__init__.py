"""Lifecycle helpers for CocoIndex daemon work ownership."""

from .active_work_registry import (
    ActiveWorkRegistry,
    ActiveWorkRow,
    DrainResult,
    active_work_registry,
)
from .cancel_protocol import CancelRequest, CancelStatus, match_cancel_request
from .daemon_task_registry import DaemonTaskRegistry, daemon_task_registry

__all__ = [
    "ActiveWorkRegistry",
    "ActiveWorkRow",
    "CancelRequest",
    "CancelStatus",
    "DaemonTaskRegistry",
    "DrainResult",
    "active_work_registry",
    "daemon_task_registry",
    "match_cancel_request",
]
