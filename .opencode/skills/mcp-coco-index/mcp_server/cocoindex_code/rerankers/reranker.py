"""Optional local cross-encoder reranking for CocoIndex search results."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import replace
from typing import Any

from ..config.config import _DEFAULT_RERANK_MODEL
from ..observability.observability import RetrievalDiagnostics
from ..indexer.schema import QueryResult

logger = logging.getLogger(__name__)

MIN_AVAILABLE_RAM_BYTES = 2 * 1024 * 1024 * 1024
DEFAULT_SIDECAR_PORT = 8765
DEFAULT_SIDECAR_TIMEOUT_S = 30.0
_ADAPTERS: dict[str, Any] = {}
_PATH_CLASS_FACTORS_CACHE: tuple[str | None, dict[str, float]] | None = None


def _rerank_via_sidecar_enabled() -> bool:
    """Cocoindex's rerank-via-sidecar dispatch gate.

    Defaults to True (PROMOTE path) to match ``Config.from_env``'s parsing of
    ``COCOINDEX_RERANK_VIA_SIDECAR`` at ``config/config.py``. Both code paths
    must read the same default or the dispatch silently diverges from the
    documented behavior.
    """
    raw = os.environ.get("COCOINDEX_RERANK_VIA_SIDECAR")
    if raw is None or raw.strip() == "":
        return True
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _apply_path_class_boost(
    scores: list[float],
    head: list[QueryResult],
    *,
    reranker_family: str = "cross_encoder",
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
    raw_factors = os.environ.get("COCOINDEX_RERANK_PATH_CLASS_FACTORS")
    if reranker_family == "jina_v3" and raw_factors is None:
        logger.warning(
            "Ignoring COCOINDEX_RERANK_PATH_CLASS_BOOST for jina-v3 without explicit "
            "COCOINDEX_RERANK_PATH_CLASS_FACTORS; built-in factors were validated on the BGE path-class lane"
        )
        return scores

    # Lazy import to avoid circular import at module load
    from ..config.config import _DEFAULT_PATH_CLASS_FACTORS, _parse_json_dict_env  # noqa: PLC0415

    global _PATH_CLASS_FACTORS_CACHE
    if _PATH_CLASS_FACTORS_CACHE is not None and _PATH_CLASS_FACTORS_CACHE[0] == raw_factors:
        factors = _PATH_CLASS_FACTORS_CACHE[1]
    else:
        factors = _parse_json_dict_env(
            "COCOINDEX_RERANK_PATH_CLASS_FACTORS",
            _DEFAULT_PATH_CLASS_FACTORS,
        )
        _PATH_CLASS_FACTORS_CACHE = (raw_factors, factors)
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
        *,
        diagnostics: RetrievalDiagnostics | None = None,
    ) -> list[QueryResult]:
        """Rerank the first ``top_k`` candidates and keep the remaining tail stable."""
        if len(candidates) < 2:
            return candidates

        model = self._load_model()
        if model is None:
            if diagnostics is not None:
                diagnostics.record_reranker_fallback("model_load_failed")
            fb = _try_fallback_reranker(query, candidates, top_k, diagnostics=diagnostics)
            return fb if fb is not None else candidates

        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]
        pairs = [(query, candidate.content) for candidate in head]

        try:
            scores = [float(score) for score in model.predict(pairs)]
        except Exception as exc:
            logger.warning(
                "Cross-encoder rerank failed: %s; trying fallback chain",
                exc,
            )
            if diagnostics is not None:
                diagnostics.record_reranker_fallback("model_error")
            fb = _try_fallback_reranker(query, candidates, top_k, diagnostics=diagnostics)
            return fb if fb is not None else candidates

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


class HttpSidecarRerankerAdapter:
    """HTTP client adapter for the shared `system-rerank-sidecar` skill.

    POSTs to the local FastAPI sidecar at ``http://127.0.0.1:<port>/rerank`` (port
    from ``RERANK_SIDECAR_PORT`` env or default 8765). On any HTTP failure, falls
    back to a bundled ``CrossEncoderRerankerAdapter`` so search keeps working when
    the sidecar is unreachable.
    """

    def __init__(
        self,
        model_name: str = _DEFAULT_RERANK_MODEL,
        port: int | None = None,
        timeout_s: float | None = None,
    ) -> None:
        self.model_name = model_name
        self.port = port if port is not None else int(
            os.environ.get("RERANK_SIDECAR_PORT", str(DEFAULT_SIDECAR_PORT))
        )
        self.timeout_s = timeout_s if timeout_s is not None else DEFAULT_SIDECAR_TIMEOUT_S
        self._client: Any | None = None
        self._fallback_adapter: CrossEncoderRerankerAdapter | None = None

    def _get_client(self) -> Any:
        if self._client is None:
            import httpx  # noqa: PLC0415

            self._client = httpx.Client(
                base_url=f"http://127.0.0.1:{self.port}",
                timeout=self.timeout_s,
            )
        return self._client

    def _get_fallback(self) -> CrossEncoderRerankerAdapter:
        if self._fallback_adapter is None:
            self._fallback_adapter = CrossEncoderRerankerAdapter(self.model_name)
        return self._fallback_adapter

    def _fallback_to_bundled(
        self,
        query: str,
        candidates: list[QueryResult],
        top_k: int,
        reason: str,
        diagnostics: RetrievalDiagnostics | None,
    ) -> list[QueryResult]:
        if diagnostics is not None:
            diagnostics.record_reranker_fallback(reason)
        return self._get_fallback().rerank(
            query,
            candidates,
            top_k,
            diagnostics=diagnostics,
        )

    def rerank(
        self,
        query: str,
        candidates: list[QueryResult],
        top_k: int,
        *,
        diagnostics: RetrievalDiagnostics | None = None,
    ) -> list[QueryResult]:
        if len(candidates) < 2:
            return candidates

        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]
        documents = [candidate.content for candidate in head]

        try:
            client = self._get_client()
            response = client.post(
                "/rerank",
                json={
                    "query": query,
                    "documents": documents,
                    "top_k": rerank_count,
                },
            )
        except Exception as exc:
            logger.warning(
                "Rerank sidecar request failed (%s); falling back to bundled adapter",
                exc,
            )
            return self._fallback_to_bundled(
                query, candidates, top_k, "sidecar_unavailable", diagnostics
            )

        if response.status_code != 200:
            bucket = "sidecar_5xx" if response.status_code >= 500 else f"sidecar_{response.status_code}"
            logger.warning(
                "Rerank sidecar returned HTTP %d; falling back to bundled adapter",
                response.status_code,
            )
            return self._fallback_to_bundled(
                query, candidates, top_k, bucket, diagnostics
            )

        try:
            payload = response.json()
            results = payload["results"]
            scores_by_index: dict[int, float] = {
                int(r["index"]): float(r["relevance_score"]) for r in results
            }
            scores = [scores_by_index[i] for i in range(len(head))]
        except (ValueError, KeyError, TypeError) as exc:
            logger.warning(
                "Rerank sidecar returned malformed payload (%s); falling back to bundled adapter",
                exc,
            )
            return self._fallback_to_bundled(
                query, candidates, top_k, "sidecar_malformed", diagnostics
            )

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


def _try_fallback_reranker(
    query: str,
    candidates: list,
    top_k: int,
    *,
    diagnostics=None,
) -> list | None:
    """If COCOINDEX_RERANK_FALLBACK_MODEL is set, try that model when the primary fails."""
    fb_name = os.environ.get("COCOINDEX_RERANK_FALLBACK_MODEL", "").strip()
    if not fb_name or fb_name == _DEFAULT_RERANK_MODEL:
        return None
    try:
        fb_adapter = get_reranker_adapter(fb_name)
        logger.warning("Falling back to reranker %r", fb_name)
        return fb_adapter.rerank(query, candidates, top_k, diagnostics=diagnostics)
    except Exception as exc:  # pragma: no cover - fallback best-effort
        logger.warning("Fallback reranker %r also failed: %s", fb_name, exc)
        return None


def get_reranker_adapter(model_name: str = _DEFAULT_RERANK_MODEL) -> Any:
    """Return the cached adapter for a reranker model.

    Dispatch priority:
    1. ``COCOINDEX_RERANK_VIA_SIDECAR=true`` -> ``HttpSidecarRerankerAdapter`` (arc 008/006)
    2. ``COCOINDEX_RERANK_ADAPTER=jina_v3`` or jina model name -> ``JinaRerankerAdapter``
    3. Default -> ``CrossEncoderRerankerAdapter`` (bundled sentence-transformers)

    Lazy-imports custom adapters so callers on the default path do NOT pay the
    transformers/httpx import cost.
    """
    if _rerank_via_sidecar_enabled():
        sidecar_key = f"__http_sidecar__:{model_name}"
        adapter = _ADAPTERS.get(sidecar_key)
        if adapter is None:
            adapter = HttpSidecarRerankerAdapter(model_name)
            _ADAPTERS[sidecar_key] = adapter
        return adapter

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
    diagnostics: RetrievalDiagnostics | None = None,
) -> list[QueryResult]:
    """Feature-callable module entrypoint used by ``query_codebase``."""
    return get_reranker_adapter(model_name).rerank(
        query,
        candidates,
        top_k,
        diagnostics=diagnostics,
    )
