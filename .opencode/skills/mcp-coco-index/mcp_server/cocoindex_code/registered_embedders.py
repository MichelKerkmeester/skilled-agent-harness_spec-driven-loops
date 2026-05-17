"""Declarative registry of vetted code-embedder candidates for CocoIndex.

Mirrors the MANIFESTS pattern from 016's mk-spec-memory pluggable architecture.
A new user can list available embedders + see their metadata without diving into
HuggingFace model cards.

Numbers (ram_mb, disk_mb) are best-effort snapshots; refer to the linked
hf_url for authoritative current values.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


EmbedderCategory = Literal["text", "code"]


@dataclass(frozen=True)
class EmbedderMetadata:
    """Metadata describing one vetted embedder candidate."""

    name: str
    """sbert/ or litellm/ prefixed model string consumed by COCOINDEX_CODE_EMBEDDING_MODEL."""

    dim: int
    """Embedding dimension. Must match the index schema or trigger a re-index on swap."""

    ram_mb: int
    """Approximate resident memory when loaded (FP16/Q4 dependent)."""

    disk_mb: int
    """Approximate disk footprint in HuggingFace cache after first download."""

    mps_compatible: bool
    """True if the model runs on Apple Silicon GPU via PyTorch MPS backend."""

    category: EmbedderCategory
    """Whether the model is text-tuned (prose) or code-tuned (source code)."""

    hf_url: str
    """HuggingFace model card URL (authoritative source for metadata + license)."""

    notes: str
    """When to prefer this embedder — operator-facing guidance."""


MANIFESTS: tuple[EmbedderMetadata, ...] = (
    EmbedderMetadata(
        name="sbert/jinaai/jina-embeddings-v2-base-code",
        dim=768,
        ram_mb=600,
        disk_mb=280,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/jinaai/jina-embeddings-v2-base-code",
        notes="DEFAULT. Code-tuned (Python/JS/Go/Java/Ruby/PHP), 8192 ctx. Dim matches gemma (768) — no schema migration when swapping from baseline. Strong general-purpose code retrieval.",
    ),
    EmbedderMetadata(
        name="sbert/google/embeddinggemma-300m",
        dim=768,
        ram_mb=600,
        disk_mb=300,
        mps_compatible=True,
        category="text",
        hf_url="https://huggingface.co/google/embeddinggemma-300m",
        notes="BASELINE (pre-018). General-text model, not code-tuned. Kept as a reference baseline for benchmarks and as a fallback.",
    ),
    EmbedderMetadata(
        name="sbert/nomic-ai/CodeRankEmbed",
        dim=768,
        ram_mb=550,
        disk_mb=270,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/nomic-ai/CodeRankEmbed",
        notes="Alternative code-tuned embedder from nomic. Python-leaning training data. Use if jina-code underperforms on your repo.",
    ),
    EmbedderMetadata(
        name="sbert/BAAI/bge-code-v1",
        dim=768,
        ram_mb=700,
        disk_mb=340,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/BAAI/bge-code-v1",
        notes="BAAI's code embedder. Use if multilingual code coverage is critical.",
    ),
    EmbedderMetadata(
        name="sbert/jinaai/jina-embeddings-v2-base-en",
        dim=768,
        ram_mb=600,
        disk_mb=280,
        mps_compatible=True,
        category="text",
        hf_url="https://huggingface.co/jinaai/jina-embeddings-v2-base-en",
        notes="English-text-tuned variant of jina v2. Use if your repo is documentation-heavy rather than code-heavy.",
    ),
    EmbedderMetadata(
        name="sbert/Salesforce/SFR-Embedding-Code-2B_R",
        dim=2048,
        ram_mb=4500,
        disk_mb=4000,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/Salesforce/SFR-Embedding-Code-2B_R",
        notes="Large (2B params), top-of-leaderboard on CoIR benchmark. Use if you have GPU/RAM headroom and need maximum code retrieval quality. Slower inference.",
    ),
)


_DEFAULT_NAME = "sbert/jinaai/jina-embeddings-v2-base-code"


def list_embedders() -> tuple[EmbedderMetadata, ...]:
    """Return the frozen registry of vetted embedder candidates."""
    return MANIFESTS


def get_embedder_metadata(name: str) -> EmbedderMetadata | None:
    """Look up one embedder by `name` (sbert/ string). Returns None if not registered."""
    for entry in MANIFESTS:
        if entry.name == name:
            return entry
    return None


def default_embedder() -> EmbedderMetadata:
    """Return the metadata for the production default embedder.

    Should match `cocoindex_code.config._DEFAULT_MODEL`. Enforced by test.
    """
    metadata = get_embedder_metadata(_DEFAULT_NAME)
    if metadata is None:
        raise RuntimeError(
            f"Default embedder {_DEFAULT_NAME!r} not found in MANIFESTS — "
            "registry and config.py have drifted"
        )
    return metadata
