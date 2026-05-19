"""THROWAWAY jina-reranker-v3 adapter for the 011 Phase 2 diagnostic bench.

This file is DELIBERATELY scoped to the smoke-gate measurement that decides whether
jina-reranker-v3 plausibly outranks BGE+path-class boost on the internal 18-probe
fixture. The 011 deep-research convergence flagged a gap: jina-v3 carries the
highest CoIR NDCG@10 in the candidate pool (63.28 vs BGE 24.86) but was filtered
out at Phase 1 triage on integration-cost grounds without measurement on this
codebase's fixture. This adapter exists ONLY to answer that empirical question.

If jina-v3 dominates path-class boost in the Phase 2 bench → open the production
jina-v3 adapter packet (proper listwise scoring per the v3 paper, error surfacing,
test coverage). If jina-v3 ties or loses → DELETE this file (and its test file)
post-investigation.

Scoring model: POINTWISE yes/no causal-LM scoring (not listwise).
- For each (query, doc) pair, prompt the model with a "Is this relevant?" template
- Extract the logit for the " yes" token at the final position
- Score = sigmoid(logit_yes - logit_no) — clipped to [0, 1]
- This is the classic LLM-as-reranker pointwise approach; works for many causal-LM
  rerankers without depending on v3's exact listwise format. A production adapter
  would use the v3 listwise mode for proper performance, but this PoC is
  sufficient to answer the dominance question.

ADR-015 Phase 2 / 011/research/research-convergence.md §"Final Candidate Ranking"
"""

from __future__ import annotations

import logging
import os
from dataclasses import replace
from typing import Any

from .reranker import (
    _apply_path_class_boost,
    _available_ram_bytes,
    _maybe_log_scores,
    MIN_AVAILABLE_RAM_BYTES,
)
from .schema import QueryResult

logger = logging.getLogger(__name__)

# Yes/no token strings for pointwise relevance scoring. Tokenized at model-load
# time; the first sub-token id of each is used at scoring time.
_YES_TOKEN = " yes"
_NO_TOKEN = " no"

# Hard limit on per-document characters to keep the prompt under the model's
# context window. Truncates the document content before assembling the prompt.
_DEFAULT_MAX_DOC_CHARS = 1500


class JinaRerankerAdapter:
    """Throwaway pointwise yes/no causal-LM adapter for jina-reranker-v3.

    Loads via transformers.AutoModelForCausalLM. Scores each candidate by querying
    the model for relevance and extracting the yes/no logit gap at the final
    position. Reuses the same path-class boost block as CrossEncoderRerankerAdapter
    so the two candidates compose identically.

    Cleanup contract: delete this file and tests/test_rerankers_jina_v3.py
    post-Phase-2-bench if jina-v3 doesn't materially outrank BGE+path-class boost.
    """

    def __init__(self, model_name: str = "jinaai/jina-reranker-v3") -> None:
        self.model_name = model_name
        self._model: Any | None = None
        self._tokenizer: Any | None = None
        self._yes_token_id: int | None = None
        self._no_token_id: int | None = None
        self._device: str = "cpu"
        self._load_failed = False

    def _load_model(self) -> tuple[Any, Any] | None:
        if self._model is not None and self._tokenizer is not None:
            return self._model, self._tokenizer
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
            from transformers import (  # noqa: PLC0415
                AutoModelForCausalLM,
                AutoTokenizer,
            )

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

            self._tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                trust_remote_code=True,
            )
            self._model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                trust_remote_code=True,
                torch_dtype=dtype,
            ).to(device)
            self._model.eval()
            self._device = device

            # Cache yes/no token ids — use the first sub-token of each
            yes_ids = self._tokenizer.encode(_YES_TOKEN, add_special_tokens=False)
            no_ids = self._tokenizer.encode(_NO_TOKEN, add_special_tokens=False)
            if not yes_ids or not no_ids:
                raise ValueError(
                    f"Tokenizer produced empty token id for yes/no markers: "
                    f"yes={yes_ids!r} no={no_ids!r}"
                )
            self._yes_token_id = yes_ids[0]
            self._no_token_id = no_ids[0]

            logger.info(
                "Loaded jina-v3 reranker: device=%s dtype=%s yes_id=%d no_id=%d",
                device,
                dtype,
                self._yes_token_id,
                self._no_token_id,
            )

        except Exception as exc:
            logger.warning(
                "Failed to load jina-reranker-v3 %r: %s; returning original order",
                self.model_name,
                exc,
            )
            self._load_failed = True
            return None

        return self._model, self._tokenizer

    @staticmethod
    def _build_prompt(query: str, doc_content: str, max_doc_chars: int) -> str:
        """Pointwise yes/no relevance prompt. Truncate doc to fit context."""
        truncated = doc_content[:max_doc_chars]
        return (
            "You are a relevance grader.\n"
            f"Query: {query}\n"
            f"Document: {truncated}\n"
            "Is the document relevant to the query? Answer with yes or no."
        )

    def _score_pair(self, model: Any, tokenizer: Any, prompt: str) -> float:
        """Forward pass + extract sigmoid(logit_yes - logit_no) at final position."""
        import torch  # noqa: PLC0415

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=4096,
        ).to(self._device)

        with torch.no_grad():
            outputs = model(**inputs)
            # logits shape: (batch=1, seq_len, vocab)
            final_logits = outputs.logits[0, -1, :]
            yes_logit = float(final_logits[self._yes_token_id].item())
            no_logit = float(final_logits[self._no_token_id].item())

        # sigmoid(diff) → probability of "yes"
        diff = yes_logit - no_logit
        if diff > 50:
            return 1.0
        if diff < -50:
            return 0.0
        import math  # noqa: PLC0415
        return 1.0 / (1.0 + math.exp(-diff))

    def rerank(
        self,
        query: str,
        candidates: list[QueryResult],
        top_k: int,
    ) -> list[QueryResult]:
        """Pointwise rerank the first ``top_k`` candidates; stable tail."""
        if len(candidates) < 2:
            return candidates

        loaded = self._load_model()
        if loaded is None:
            return candidates
        model, tokenizer = loaded

        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]

        max_doc_chars = int(
            os.environ.get("COCOINDEX_RERANK_JINA_MAX_DOC_CHARS", _DEFAULT_MAX_DOC_CHARS)
        )

        try:
            scores = [
                self._score_pair(
                    model,
                    tokenizer,
                    self._build_prompt(query, c.content, max_doc_chars),
                )
                for c in head
            ]
        except Exception as exc:
            logger.warning(
                "jina-v3 rerank forward pass failed: %s; returning original order",
                exc,
            )
            return candidates

        # ADR-015 Phase 2: path-class boost (flag-gated, no-op when disabled)
        # Shared with CrossEncoderRerankerAdapter so both candidates compose identically.
        scores = _apply_path_class_boost(scores, head)

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
