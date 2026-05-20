"""Declarative registry of vetted code-embedder candidates for CocoIndex.

Mirrors the MANIFESTS pattern from 016's mk-spec-memory pluggable architecture.
A new user can list available embedders + see their metadata without diving into
HuggingFace model cards.

Numbers (ram_mb, disk_mb) are best-effort snapshots; refer to the linked
hf_url for authoritative current values.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Literal, Mapping


EmbedderCategory = Literal["text", "code"]
PromptPolicy = Literal["none", "query_only", "asymmetric"]

logger = logging.getLogger(__name__)

PERMISSIVE_LICENSE_PREFIXES = ("apache-2.0", "mit", "bsd")
NON_COMMERCIAL_LICENSE_MARKERS = ("cc-by-nc", "non-commercial")

DIMENSION_MIGRATION_REQUIREMENTS = (
    "Changing to an embedder whose dim differs from the indexed vector schema requires "
    "`ccc reset && ccc index` before search. Keep the previous index directory until the "
    "new index validates, and roll back by restoring the prior COCOINDEX_CODE_EMBEDDING_MODEL "
    "plus rerunning reset/index so stored vectors match the live model dimension."
)


def license_is_commercial_safe(license_name: str) -> bool:
    """Return whether a model license is safe for the commercial-safe profile."""
    normalized = license_name.strip().lower()
    if any(marker in normalized for marker in NON_COMMERCIAL_LICENSE_MARKERS):
        return False
    return normalized.startswith(PERMISSIVE_LICENSE_PREFIXES)


@dataclass(frozen=True)
class EmbedderMetadata:
    """Metadata describing one vetted embedder candidate."""

    name: str
    """sbert/, litellm/, or ollama/ prefixed model string consumed by COCOINDEX_CODE_EMBEDDING_MODEL."""

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

    license: str
    """License identifier from the HuggingFace model card."""

    commercial_safe: bool = field(init=False)
    """True when the license is allowed under COCOINDEX_COMMERCIAL_SAFE_PROFILE."""

    notes: str
    """When to prefer this embedder — operator-facing guidance."""

    requires_ollama_daemon: bool = False
    """True when the embedder requires a reachable local Ollama daemon."""

    prompt_policy: PromptPolicy = "none"
    """Whether the model expects prompt params for query and/or document embedding."""

    query_prompt_name: str | None = None
    """SentenceTransformers prompt_name for search queries, if configured."""

    document_prompt_name: str | None = None
    """SentenceTransformers prompt_name for indexed documents, if configured."""

    indexing_params: Mapping[str, str] = field(default_factory=dict)
    """Upstream-style params forwarded when embedding indexed documents."""

    query_params: Mapping[str, str] = field(default_factory=dict)
    """Upstream-style params forwarded when embedding search queries."""

    def __post_init__(self) -> None:
        object.__setattr__(self, "commercial_safe", license_is_commercial_safe(self.license))
        query_params = dict(self.query_params)
        indexing_params = dict(self.indexing_params)
        query_prompt_name = self.query_prompt_name or query_params.get("prompt_name")
        document_prompt_name = self.document_prompt_name or indexing_params.get("prompt_name")
        if self.query_prompt_name is not None and query_params.get("prompt_name") not in {
            None,
            self.query_prompt_name,
        }:
            raise ValueError(f"{self.name} query_prompt_name conflicts with query_params")
        if self.document_prompt_name is not None and indexing_params.get("prompt_name") not in {
            None,
            self.document_prompt_name,
        }:
            raise ValueError(f"{self.name} document_prompt_name conflicts with indexing_params")
        if query_prompt_name is not None:
            query_params["prompt_name"] = query_prompt_name
        if document_prompt_name is not None:
            indexing_params["prompt_name"] = document_prompt_name
        object.__setattr__(self, "query_prompt_name", query_prompt_name)
        object.__setattr__(self, "document_prompt_name", document_prompt_name)
        object.__setattr__(self, "query_params", MappingProxyType(query_params))
        object.__setattr__(self, "indexing_params", MappingProxyType(indexing_params))


@dataclass(frozen=True)
class RerankerMetadata:
    """Metadata describing one supported reranker candidate."""

    name: str
    hf_url: str
    license: str
    notes: str
    commercial_safe: bool = field(init=False)

    def __post_init__(self) -> None:
        object.__setattr__(self, "commercial_safe", license_is_commercial_safe(self.license))


MANIFESTS: tuple[EmbedderMetadata, ...] = (
    EmbedderMetadata(
        name="sbert/jinaai/jina-embeddings-v2-base-code",
        dim=768,
        ram_mb=600,
        disk_mb=280,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/jinaai/jina-embeddings-v2-base-code",
        license="apache-2.0",
        notes="Former default. Code-tuned (Python/JS/Go/Java/Ruby/PHP), 8192 ctx. Dim matches the 768d schema. Strong general-purpose code retrieval fallback.",
    ),
    EmbedderMetadata(
        name="sbert/google/embeddinggemma-300m",
        dim=768,
        ram_mb=600,
        disk_mb=300,
        mps_compatible=True,
        category="text",
        hf_url="https://huggingface.co/google/embeddinggemma-300m",
        license="gemma",
        notes="BASELINE (pre-018). General-text model, not code-tuned. Kept as a reference baseline for benchmarks and as a fallback.",
        prompt_policy="asymmetric",
        query_prompt_name="InstructionRetrieval",
        document_prompt_name="InstructionRetrieval",
    ),
    EmbedderMetadata(
        name="sbert/nomic-ai/CodeRankEmbed",
        dim=768,
        ram_mb=550,
        disk_mb=270,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/nomic-ai/CodeRankEmbed",
        license="mit",
        notes="DEFAULT as of the 2026-05-19 nomic promotion. Code-tuned embedder that tied bge-code-v1 hit rate on the corrected fixture with lower median latency; keep 768d schema compatibility.",
        prompt_policy="query_only",
        query_prompt_name="query",
    ),
    EmbedderMetadata(
        name="sbert/BAAI/bge-code-v1",
        dim=768,
        ram_mb=700,
        disk_mb=340,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/BAAI/bge-code-v1",
        license="apache-2.0",
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
        license="apache-2.0",
        notes="English-text-tuned variant of jina v2. Use if your repo is documentation-heavy rather than code-heavy.",
    ),
    EmbedderMetadata(
        name="ollama/nomic-embed-text",
        dim=768,
        ram_mb=600,
        disk_mb=270,
        mps_compatible=True,
        category="text",
        hf_url="https://huggingface.co/nomic-ai/nomic-embed-text-v1.5",
        license="apache-2.0",
        notes="Local Ollama text embedder. Useful for operators who already run Ollama and want an immediate 768d local option; not code-tuned, so benchmark before replacing the default code model.",
        requires_ollama_daemon=True,
    ),
    EmbedderMetadata(
        name="sbert/Salesforce/SFR-Embedding-Code-2B_R",
        dim=2048,
        ram_mb=4500,
        disk_mb=4000,
        mps_compatible=True,
        category="code",
        hf_url="https://huggingface.co/Salesforce/SFR-Embedding-Code-2B_R",
        license="cc-by-nc-4.0",
        notes="Large (2B params), top-of-leaderboard on CoIR benchmark. Use if you have GPU/RAM headroom and need maximum code retrieval quality. Slower inference.",
    ),
    EmbedderMetadata(
        name="sbert/dunzhang/stella_en_400M_v5",
        dim=1024,
        ram_mb=800,
        disk_mb=400,
        mps_compatible=True,
        category="text",
        hf_url="https://huggingface.co/dunzhang/stella_en_400M_v5",
        license="mit",
        notes="Small (400M), fast, surprisingly competitive on code + text retrieval. Default 1024d (also supports 768/512). MTEB-strong. Schema migration needed when swapping from 768d default (use vec_1024).",
    ),
)


RERANKER_MANIFESTS: tuple[RerankerMetadata, ...] = (
    RerankerMetadata(
        name="Qwen/Qwen3-Reranker-0.6B",
        hf_url="https://huggingface.co/Qwen/Qwen3-Reranker-0.6B",
        license="apache-2.0",
        notes="DEFAULT as of 2026-05-20 (023B benchmark-2026-05-20). Beat jina-v3 head-to-head on the 73-probe expanded fixture: +1 hit/73 (30 vs 29, n=3, zero stddev) and -32% p95 latency (1984ms vs 2905ms). Apache-2.0 license removes commercial-safe profile contention.",
    ),
    RerankerMetadata(
        name="jinaai/jina-reranker-v3",
        hf_url="https://huggingface.co/jinaai/jina-reranker-v3",
        license="cc-by-nc-4.0",
        notes="Pre-2026-05-20 default. Non-commercial license. Kept as opt-in fallback; lost head-to-head to Qwen3-Reranker-0.6B in 023B expanded-fixture bench (1.4pp hit rate, 32% slower).",
    ),
    RerankerMetadata(
        name="BAAI/bge-reranker-v2-m3",
        hf_url="https://huggingface.co/BAAI/bge-reranker-v2-m3",
        license="apache-2.0",
        notes="Commercial-safe opt-in reranker. Runner-up quality lane in 018; supported by the CrossEncoder adapter.",
    ),
)


DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"  # 018 follow-on: promoted over jina-v2-base-code after corrected-pipeline bench tied bge-code-v1 on hit rate with lower latency
DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"  # 023B follow-on: promoted over jina-v3 after 73-probe expanded-fixture bench (n=3, +1 hit/73, -32% p95, Apache-2.0)
_DEFAULT_NAME = DEFAULT_EMBEDDER_NAME

EmbedderSpec = EmbedderMetadata
RerankerSpec = RerankerMetadata


def list_embedders() -> tuple[EmbedderMetadata, ...]:
    """Return the frozen registry of vetted embedder candidates."""
    return MANIFESTS


def list_rerankers() -> tuple[RerankerMetadata, ...]:
    """Return the frozen registry of supported reranker candidates."""
    return RERANKER_MANIFESTS


def get_embedder_metadata(name: str) -> EmbedderMetadata | None:
    """Look up one embedder by `name` (sbert/ string). Returns None if not registered."""
    for entry in MANIFESTS:
        if entry.name == name:
            return entry
    return None


def get_reranker_metadata(name: str) -> RerankerMetadata | None:
    """Look up one reranker by exact name or registered prefix."""
    for entry in RERANKER_MANIFESTS:
        if name == entry.name or name.startswith(entry.name):
            return entry
    return None


def _unknown_registry_key(kind: str, name: str, known_names: tuple[str, ...]) -> KeyError:
    hint = ", ".join(known_names)
    return KeyError(f"Unknown {kind} {name!r}. Registered {kind}s: {hint}")


def embedder_for(name: str) -> EmbedderSpec:
    """Return the registered embedder spec or raise a clear KeyError."""
    metadata = get_embedder_metadata(name)
    if metadata is None:
        raise _unknown_registry_key("embedder", name, tuple(entry.name for entry in MANIFESTS))
    return metadata


def reranker_for(name: str) -> RerankerSpec:
    """Return the registered reranker spec or raise a clear KeyError."""
    metadata = get_reranker_metadata(name)
    if metadata is None:
        raise _unknown_registry_key(
            "reranker",
            name,
            tuple(entry.name for entry in RERANKER_MANIFESTS),
        )
    return metadata


def embed_query_prompt(name: str) -> str | None:
    """Return the registry query prompt for an embedder."""
    return embedder_for(name).query_prompt_name


def embed_document_prompt(name: str) -> str | None:
    """Return the registry document/index prompt for an embedder."""
    return embedder_for(name).document_prompt_name


def embedder_license(name: str) -> str:
    """Return the registry license for an embedder."""
    return embedder_for(name).license


def rerank_license(name: str) -> str:
    """Return the registry license for a reranker."""
    return reranker_for(name).license


def validate_registry() -> None:
    """Fail fast if registry entries lose required prompt or license metadata."""
    errors: list[str] = []
    for entry in MANIFESTS:
        if not entry.license:
            errors.append(f"embedder {entry.name!r} missing license")
        if not hasattr(entry, "query_prompt_name"):
            errors.append(f"embedder {entry.name!r} missing query_prompt_name")
        if not hasattr(entry, "document_prompt_name"):
            errors.append(f"embedder {entry.name!r} missing document_prompt_name")
        if entry.query_params.get("prompt_name") != entry.query_prompt_name:
            errors.append(f"embedder {entry.name!r} query params drifted from registry prompt")
        if entry.indexing_params.get("prompt_name") != entry.document_prompt_name:
            errors.append(f"embedder {entry.name!r} indexing params drifted from registry prompt")
    for entry in RERANKER_MANIFESTS:
        if not entry.license:
            errors.append(f"reranker {entry.name!r} missing license")
        if not hasattr(entry, "commercial_safe"):
            errors.append(f"reranker {entry.name!r} missing commercial_safe")
    if errors:
        raise RuntimeError("CocoIndex registry validation failed: " + "; ".join(errors))


def commercial_safe_embedder_alternatives() -> list[str]:
    """Return operator-facing commercial-safe embedder names."""
    return [entry.name for entry in MANIFESTS if entry.commercial_safe]


def commercial_safe_reranker_alternatives() -> list[str]:
    """Return operator-facing commercial-safe reranker names."""
    return [entry.name for entry in RERANKER_MANIFESTS if entry.commercial_safe]


def default_embedder() -> EmbedderMetadata:
    """Return the metadata for the production default embedder."""
    metadata = get_embedder_metadata(_DEFAULT_NAME)
    if metadata is None:
        raise RuntimeError(
            f"Default embedder {_DEFAULT_NAME!r} not found in MANIFESTS — "
            "registry and config.py have drifted"
        )
    return metadata


default_embedder()
