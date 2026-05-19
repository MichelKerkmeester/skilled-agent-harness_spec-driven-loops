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
_ADAPTERS: dict[str, "CrossEncoderRerankerAdapter"] = {}


def _apply_path_class_boost(
    scores: list[float],
    head: list[QueryResult],
) -> list[float]:
    """Per-path-class score multiplier (ADR-015 Phase 2 path-class boost).

    Reads env on every call so bench lane swaps + tests can change behavior
    without daemon restart. Flag-gated by COCOINDEX_RERANK_PATH_CLASS_BOOST.
    Factors from COCOINDEX_RERANK_PATH_CLASS_FACTORS (JSON dict) or built-in defaults.

    Called inside rerank() BEFORE _maybe_log_scores so the JSONL trail captures
    the boosted scores (single-source-of-truth for the evidence trail).
    """
    flag = os.environ.get("COCOINDEX_RERANK_PATH_CLASS_BOOST", "").strip().lower()
    if flag not in {"1", "true", "yes", "on"}:
        return scores

    # Lazy import to avoid circular import at module load
    from .config import _DEFAULT_PATH_CLASS_FACTORS, _parse_json_dict_env  # noqa: PLC0415

    factors = _parse_json_dict_env(
        "COCOINDEX_RERANK_PATH_CLASS_FACTORS",
        _DEFAULT_PATH_CLASS_FACTORS,
    )
    return [
        score * factors.get(candidate.path_class, 1.0)
        for score, candidate in zip(scores, head, strict=True)
    ]


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


class CrossEncoderRerankerAdapter:
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

        # ADR-015 Phase 2: path-class boost (flag-gated, no-op when disabled)
        scores = _apply_path_class_boost(scores, head)

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


# Backward-compat alias: existing imports of `RerankerAdapter` continue to resolve
# to the cross-encoder implementation (tests + downstream callers unchanged).
RerankerAdapter = CrossEncoderRerankerAdapter


def get_reranker_adapter(model_name: str = _DEFAULT_RERANK_MODEL) -> Any:
    """Return the cached adapter for a reranker model.

    Prefix dispatch (ADR-015 Phase 2): if model_name matches a known custom-adapter
    family OR COCOINDEX_RERANK_ADAPTER overrides explicitly, instantiate the matching
    adapter class. Otherwise fall through to CrossEncoderRerankerAdapter for the
    sentence-transformers CrossEncoder default.

    Lazy-imports custom adapters so callers on the BGE-only path do NOT pay the
    transformers import cost.
    """
    adapter = _ADAPTERS.get(model_name)
    if adapter is None:
        override = os.environ.get("COCOINDEX_RERANK_ADAPTER", "").strip().lower()
        if override == "jina_v3" or model_name.startswith("jinaai/jina-reranker-v3"):
            from .rerankers_jina_v3 import JinaRerankerAdapter  # noqa: PLC0415

            adapter = JinaRerankerAdapter(model_name)
        else:
            adapter = CrossEncoderRerankerAdapter(model_name)
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
