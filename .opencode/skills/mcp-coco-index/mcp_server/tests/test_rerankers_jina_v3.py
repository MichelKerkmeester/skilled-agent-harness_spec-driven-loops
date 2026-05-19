"""Smoke test for the THROWAWAY jina-reranker-v3 adapter.

Verifies the pointwise yes/no scoring math + sort order without loading the actual
transformers model. Mocks AutoModelForCausalLM + AutoTokenizer.

DELETE this file alongside cocoindex_code/rerankers_jina_v3.py if the Phase 2
bench shows jina-v3 doesn't materially outrank BGE+path-class boost.
"""

from __future__ import annotations

import sys
from typing import Any
from unittest.mock import MagicMock

from cocoindex_code.rerankers_jina_v3 import JinaRerankerAdapter
from cocoindex_code.schema import QueryResult


def _candidate(file_path: str, score: float, content: str = "def f(): pass") -> QueryResult:
    return QueryResult(
        file_path=file_path,
        language="python",
        content=content,
        start_line=1,
        end_line=2,
        score=score,
        raw_score=score,
        path_class="implementation",
        rankingSignals=[],
    )


def test_jina_adapter_handles_empty_candidates() -> None:
    adapter = JinaRerankerAdapter()
    assert adapter.rerank("query", [], top_k=20) == []


def test_jina_adapter_returns_input_on_load_failure(monkeypatch: Any) -> None:
    """If transformers fails to import, the adapter returns candidates unchanged."""
    adapter = JinaRerankerAdapter()
    candidates = [_candidate("a.py", 0.9), _candidate("b.py", 0.8)]
    # Force load failure by patching _load_model to None
    monkeypatch.setattr(adapter, "_load_model", lambda: None)

    reranked = adapter.rerank("query", candidates, top_k=20)
    assert reranked is candidates


def test_jina_adapter_sorts_by_yes_logit_gap(monkeypatch: Any) -> None:
    """With mocked logits favoring doc1 (high yes_logit), it should rank first."""
    import torch  # noqa: PLC0415

    adapter = JinaRerankerAdapter()

    # Mock tokenizer: yes_id=100, no_id=200; returns trivial input_ids
    fake_tokenizer = MagicMock()
    fake_tokenizer.encode.side_effect = lambda token, **_: {
        " yes": [100],
        " no": [200],
    }[token]

    def _fake_tokenize(prompt: str, **_kwargs: Any) -> Any:
        # Encode prompt length into a deterministic per-call marker so we can
        # distinguish which call is for which doc. Return tensor with 1 token.
        result = MagicMock()
        result.to = lambda _device: result
        # Stash which doc this is so the fake model can return different logits
        # We tag by checking which doc content is in the prompt
        result._prompt = prompt
        return result

    fake_tokenizer.side_effect = _fake_tokenize

    # Mock model: vocabulary of 300. doc_high content → high yes_logit at pos -1.
    # doc_low content → high no_logit.
    fake_model = MagicMock()

    def _fake_forward(**kwargs: Any) -> Any:
        # Find which doc this prompt is for
        # The MagicMock side_effect for tokenizer doesn't actually push the
        # _prompt through; instead we'll use call_count to alternate scores.
        # For this test, scores returned in call order: high, low.
        nonlocal call_count
        logits = torch.zeros((1, 1, 300))
        if call_count == 0:
            logits[0, -1, 100] = 10.0  # yes
            logits[0, -1, 200] = 0.0   # no
        else:
            logits[0, -1, 100] = 0.0
            logits[0, -1, 200] = 10.0  # no dominant
        call_count += 1
        result = MagicMock()
        result.logits = logits
        return result

    call_count = 0
    fake_model.side_effect = _fake_forward
    fake_model.eval = MagicMock()

    # Pre-seed the adapter to skip _load_model
    adapter._model = fake_model
    adapter._tokenizer = fake_tokenizer
    adapter._yes_token_id = 100
    adapter._no_token_id = 200
    adapter._device = "cpu"

    candidates = [
        _candidate("high_doc.py", 0.5, content="high_doc"),
        _candidate("low_doc.py", 0.5, content="low_doc"),
    ]

    reranked = adapter.rerank("query", candidates, top_k=20)

    # high_doc should rank first because its yes_logit > no_logit
    assert [c.file_path for c in reranked] == ["high_doc.py", "low_doc.py"]
    # Both scores should be in [0, 1] (sigmoid output)
    assert 0.0 <= reranked[0].reranker_score <= 1.0
    assert 0.0 <= reranked[1].reranker_score <= 1.0
    assert "jina_v3_rerank" in reranked[0].rankingSignals
