"""Optional local cross-encoder reranking for CocoIndex search results."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import replace
from typing import Any

from .config import _DEFAULT_RERANK_MODEL
from .schema import QueryResult

logger = logging.getLogger(__name__)

MIN_AVAILABLE_RAM_BYTES = 2 * 1024 * 1024 * 1024
_ADAPTERS: dict[str, "RerankerAdapter"] = {}


def _maybe_log_scores(query: str, head: list[QueryResult], scores: list[float]) -> None:
    """Env-gated per-probe top-K score logger. Off unless COCOINDEX_RERANK_LOG_PATH is set.

    Writes one JSON line per rerank call: {query, candidates: [{file_path, pre_score, rerank_score}]}.
    Used by the 016/007/003 pre-confirmation instrumentation to size rerank non-determinism risk.
    """
    log_path = os.environ.get("COCOINDEX_RERANK_LOG_PATH", "").strip()
    if not log_path:
        return
    try:
        row = {
            "query": query,
            "candidates": [
                {
                    "file_path": c.file_path,
                    "pre_score": float(c.score) if c.score is not None else None,
                    "rerank_score": float(s),
                }
                for c, s in zip(head, scores, strict=True)
            ],
        }
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(row) + "\n")
    except Exception as exc:  # pragma: no cover - never break rerank because logging failed
        logger.warning("rerank score log failed: %s (path=%r)", exc, log_path)


def _available_ram_bytes() -> int | None:
    """Return available RAM when the platform exposes it."""
    try:
        import psutil  # type: ignore[import-not-found]  # noqa: PLC0415
    except ImportError:
        psutil = None

    if psutil is not None:
        return int(psutil.virtual_memory().available)

    if hasattr(os, "sysconf"):
        try:
            page_size = int(os.sysconf("SC_PAGE_SIZE"))
            available_pages = int(os.sysconf("SC_AVPHYS_PAGES"))
        except (OSError, ValueError):
            return None
        return page_size * available_pages

    return None


class RerankerAdapter:
    """Lazy wrapper around a sentence-transformers CrossEncoder model."""

    def __init__(self, model_name: str = _DEFAULT_RERANK_MODEL) -> None:
        self.model_name = model_name
        self._model: Any | None = None
        self._load_failed = False

    def _load_model(self) -> Any | None:
        if self._model is not None:
            return self._model
        if self._load_failed:
            return None

        available_ram = _available_ram_bytes()
        if available_ram is not None and available_ram < MIN_AVAILABLE_RAM_BYTES:
            logger.warning(
                "Skipping cross-encoder rerank: available RAM %.2fGB is below 2GB gate",
                available_ram / (1024 * 1024 * 1024),
            )
            self._load_failed = True
            return None

        try:
            from sentence_transformers import CrossEncoder  # noqa: PLC0415

            try:
                self._model = CrossEncoder(self.model_name, trust_remote_code=True)
            except TypeError:
                self._model = CrossEncoder(self.model_name)
        except Exception as exc:  # pragma: no cover - exercised by mocked tests
            logger.warning(
                "Failed to load cross-encoder reranker %r: %s; returning original order",
                self.model_name,
                exc,
            )
            self._load_failed = True
            return None

        return self._model

    def rerank(
        self,
        query: str,
        candidates: list[QueryResult],
        top_k: int,
    ) -> list[QueryResult]:
        """Rerank the first ``top_k`` candidates and keep the remaining tail stable."""
        if len(candidates) < 2:
            return candidates

        model = self._load_model()
        if model is None:
            return candidates

        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]
        pairs = [(query, candidate.content) for candidate in head]

        try:
            scores = [float(score) for score in model.predict(pairs)]
        except Exception as exc:
            logger.warning(
                "Cross-encoder rerank failed: %s; returning original order",
                exc,
            )
            return candidates

        _maybe_log_scores(query, head, scores)

        reranked_head = [
            replace(
                candidate,
                score=reranker_score,
                pre_rerank_score=candidate.score,
                reranker_score=reranker_score,
                rankingSignals=[*candidate.rankingSignals, "cross_encoder_rerank"],
            )
            for candidate, reranker_score in zip(head, scores, strict=True)
        ]
        reranked_head.sort(key=lambda result: result.reranker_score or float("-inf"), reverse=True)
        return [*reranked_head, *tail]


def get_reranker_adapter(model_name: str = _DEFAULT_RERANK_MODEL) -> RerankerAdapter:
    """Return the cached adapter for a reranker model."""
    adapter = _ADAPTERS.get(model_name)
    if adapter is None:
        adapter = RerankerAdapter(model_name)
        _ADAPTERS[model_name] = adapter
    return adapter


def rerank(
    query: str,
    candidates: list[QueryResult],
    top_k: int,
    *,
    model_name: str = _DEFAULT_RERANK_MODEL,
) -> list[QueryResult]:
    """Feature-callable module entrypoint used by ``query_codebase``."""
    return get_reranker_adapter(model_name).rerank(query, candidates, top_k)
