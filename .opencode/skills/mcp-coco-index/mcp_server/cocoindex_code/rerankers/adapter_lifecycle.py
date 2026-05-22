"""Close and measurement helpers for reranker adapter lifecycles."""

from __future__ import annotations

import gc
import logging
import os
import resource
from typing import Any

logger = logging.getLogger(__name__)


def close_resource(resource_obj: Any) -> None:
    """Best-effort idempotent close for nested model/client resources."""
    if resource_obj is None:
        return
    close = getattr(resource_obj, "close", None)
    if callable(close):
        try:
            close()
        except Exception as exc:
            logger.debug("resource close failed during cleanup: %s", exc)

    model = getattr(resource_obj, "model", None)
    to = getattr(model, "to", None)
    if callable(to):
        try:
            to("cpu")
        except Exception:
            pass


def collect_model_garbage() -> None:
    """Release Python refs after nested resources have been closed."""
    gc.collect()


def current_rss_bytes() -> int:
    """Return current process max RSS in bytes for RSS gate fixtures."""
    rss = int(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)
    if os.uname().sysname == "Darwin":
        return rss
    return rss * 1024


def measure_fallback_rss_delta(
    before_rss: int,
    after_rss: int,
    threshold_mb: float = 0.0,
) -> dict[str, float | str]:
    delta_mb = (after_rss - before_rss) / (1024 * 1024)
    if delta_mb > threshold_mb:
        logger.warning("Fallback RSS growth detected: +%.3fMB", delta_mb)
        return {"severity": "P1-escalation-candidate", "delta_mb": delta_mb}
    return {"severity": "P2-default", "delta_mb": delta_mb}


def fallback_rss_threshold_mb() -> float:
    raw = os.environ.get("COCOINDEX_RERANK_FALLBACK_RSS_THRESHOLD_MB", "").strip()
    if not raw:
        return 0.0
    try:
        return float(raw)
    except ValueError:
        return 0.0
