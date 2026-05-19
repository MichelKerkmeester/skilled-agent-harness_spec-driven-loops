"""Production jina-reranker-v3 adapter for CocoIndex reranking.

This adapter became the default reranker after the 018 rerank-matrix rebench.
It keeps the diagnostic Phase 2 mapping semantics while carrying production
fallback behavior, bounded document clipping, and regression tests.

Scoring model: Jina's NATIVE listwise rerank API (NOT pointwise yes/no).
jinaai/jina-reranker-v3 is a JinaForRanking model (Qwen3-base) that projects
hidden states at <|rerank_token|>/<|embed_token|> positions and returns cosine
similarities between projected query/doc embeddings. The model exposes a clean
public API: `model.rerank(query, documents, top_n=...)` returning a list of
dicts with `relevance_score` and `index`. We map those scores back to the
original QueryResult ordering.

ADR-015 Phase 2 / 011/research/research-convergence.md §"Final Candidate Ranking"
"""

from __future__ import annotations

import logging
import os
from dataclasses import replace
from typing import Any

from .config import _parse_int_env
from .reranker import (
    MIN_AVAILABLE_RAM_BYTES,
    _apply_path_class_boost,
    _available_ram_bytes,
    _maybe_log_scores,
)
from .schema import QueryResult

logger = logging.getLogger(__name__)

# Hard limit on per-document characters before passing to the model's own
# truncator (the model truncates internally at max_doc_length tokens, but we
# clip upstream to keep latency predictable on tail-heavy queries).
_DEFAULT_MAX_DOC_CHARS = 6000


class JinaRerankerAdapter:
    """Listwise adapter for jinaai/jina-reranker-v3.

    Loads via transformers.AutoModel with trust_remote_code=True so the
    JinaForRanking class registers. Scoring uses the model's native rerank() API
    which returns [{"relevance_score": float, "index": int, ...}, ...] sorted
    descending. We map scores back to the input candidate order and then run the
    standard score logging hook.
    """

    def __init__(self, model_name: str = "jinaai/jina-reranker-v3") -> None:
        self.model_name = model_name
        self._model: Any | None = None
        self._device: str = "cpu"
        self._load_failed = False

    def _load_model(self) -> Any | None:
        if self._model is not None:
            return self._model
        if self._load_failed:
            return None

        available_ram = _available_ram_bytes()
        if available_ram is not None and available_ram < MIN_AVAILABLE_RAM_BYTES:
            logger.warning(
                "Skipping jina-v3 rerank: available RAM %.2fGB is below 2GB gate",
                available_ram / (1024 * 1024 * 1024),
            )
            self._load_failed = True
            return None

        try:
            import torch  # noqa: PLC0415
            from transformers import AutoModel  # noqa: PLC0415

            # Device pick: MPS on Darwin → CUDA → CPU. Env var override.
            requested = os.environ.get("COCOINDEX_CODE_DEVICE", "").strip().lower()
            if requested in {"cuda", "mps", "cpu"}:
                device = requested
            elif torch.cuda.is_available():
                device = "cuda"
            elif torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"

            # fp16 on GPU/MPS; fp32 on CPU
            dtype = torch.float16 if device in {"cuda", "mps"} else torch.float32

            # AutoModel + trust_remote_code → JinaForRanking instance with the
            # native rerank() method available
            self._model = AutoModel.from_pretrained(
                self.model_name,
                trust_remote_code=True,
                torch_dtype=dtype,
            ).to(device)
            self._model.eval()
            self._device = device

            logger.info(
                "Loaded jina-v3 reranker: device=%s dtype=%s",
                device,
                dtype,
            )

        except Exception as exc:
            logger.warning(
                "Failed to load jina-reranker-v3 %r: %s; returning original order",
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
        """Listwise rerank the first ``top_k`` candidates; stable tail."""
        if len(candidates) < 2:
            return candidates

        model = self._load_model()
        if model is None:
            return candidates

        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]

        max_doc_chars = _parse_int_env(
            "COCOINDEX_RERANK_JINA_MAX_DOC_CHARS",
            _DEFAULT_MAX_DOC_CHARS,
            1,
            50000,
        )

        # Clip doc content upstream of the model's own tokenizer truncation
        docs = [c.content[:max_doc_chars] for c in head]

        try:
            results = model.rerank(query, docs)
        except Exception as exc:
            logger.warning(
                "jina-v3 rerank forward pass failed: %s; returning original order",
                exc,
            )
            return candidates

        # results is List[{"document": str, "relevance_score": float, "index": int, ...}]
        # Map scores back to the original head order using the index field
        score_by_index: dict[int, float] = {}
        for entry in results:
            idx = int(entry.get("index", -1))
            score = float(entry.get("relevance_score", 0.0))
            if 0 <= idx < len(head):
                score_by_index[idx] = score

        # Build aligned scores list (missing indices → 0.0, defensive)
        scores = [score_by_index.get(i, 0.0) for i in range(len(head))]

        # Path-class defaults were validated on the BGE path-class lane; Jina
        # only composes with the boost when operators provide explicit factors.
        scores = _apply_path_class_boost(scores, head, reranker_family="jina_v3")

        _maybe_log_scores(query, head, scores)

        reranked_head = [
            replace(
                candidate,
                score=reranker_score,
                pre_rerank_score=candidate.score,
                reranker_score=reranker_score,
                rankingSignals=[*candidate.rankingSignals, "jina_v3_rerank"],
            )
            for candidate, reranker_score in zip(head, scores, strict=True)
        ]
        reranked_head.sort(key=lambda result: result.reranker_score or float("-inf"), reverse=True)
        return [*reranked_head, *tail]
