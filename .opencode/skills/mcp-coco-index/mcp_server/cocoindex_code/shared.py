"""Shared context keys, embedder factory, and CodeChunk schema."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
# Modified by 014-local-embeddings-setup-a / 001-prefix-registry-architecture:
# _QUERY_PROMPT_MODELS converted from set to dict; env override added.
from __future__ import annotations

import logging
import os
import pathlib
from dataclasses import dataclass
from typing import TYPE_CHECKING, Annotated, Union

import cocoindex as coco
from cocoindex.connectors import sqlite
from numpy.typing import NDArray
from pathspec import GitIgnoreSpec

if TYPE_CHECKING:
    from cocoindex.ops.litellm import LiteLLMEmbedder
    from cocoindex.ops.sentence_transformers import SentenceTransformerEmbedder

from .settings import EmbeddingSettings

logger = logging.getLogger(__name__)

SBERT_PREFIX = "sbert/"

# Models that define a "query" prompt for asymmetric retrieval.
# Maps model_id -> prompt_name passed to SentenceTransformerEmbedder.
# Resolution order in resolve_query_prompt_name():
#   1) env override COCOINDEX_QUERY_PROMPT_NAME (empty string == no prompt)
#   2) this registry entry
#   3) None (raw text, no prompt-name flag)
_QUERY_PROMPT_MODELS: dict[str, str] = {
    "nomic-ai/nomic-embed-code": "query",
    "nomic-ai/CodeRankEmbed": "query",
    # 014-local-embeddings-setup-a / 001-prefix-registry-architecture additions:
    "Qwen/Qwen3-Embedding-0.6B": "query",
    "Qwen/Qwen3-Embedding-4B": "query",
    "Qwen/Qwen3-Embedding-8B": "query",
    # 014-local-embeddings-setup-a / 011-embeddinggemma-unification:
    # EmbeddingGemma uses task-specific prompt templates. For CODE SEARCH the
    # canonical prompt is "InstructionRetrieval" -> "task: code retrieval | query: ".
    # The alternative "query" -> "task: search result | query: " is for general
    # retrieval (what mk-spec-memory uses). Code search wants the code variant.
    #
    # NOTE: this sets only the QUERY prompt. EmbeddingGemma also has a distinct
    # DOCUMENT prompt ("title: none | text: ") expected at indexing time.
    # CocoIndex's current daemon doesn't apply asymmetric query/document prompts,
    # so documents are indexed without the document prefix. Quality is suboptimal
    # vs ideal EmbeddingGemma usage but still much better than no prompt at all.
    "google/embeddinggemma-300m": "InstructionRetrieval",
}


def resolve_query_prompt_name(model_name: str) -> str | None:
    """Resolve the query prompt name for a model.

    Env override (COCOINDEX_QUERY_PROMPT_NAME) wins over the registry.
    Empty string is a valid override meaning "explicitly no prompt".
    """
    env_value = os.environ.get("COCOINDEX_QUERY_PROMPT_NAME")
    if env_value is not None:
        return env_value if env_value != "" else None
    return _QUERY_PROMPT_MODELS.get(model_name)


# Type alias
Embedder = Union["SentenceTransformerEmbedder", "LiteLLMEmbedder"]

# Context keys
EMBEDDER = coco.ContextKey[Embedder]("embedder")
SQLITE_DB = coco.ContextKey[sqlite.ManagedConnection]("index_db", tracked=False)
CODEBASE_DIR = coco.ContextKey[pathlib.Path]("codebase", tracked=False)
GITIGNORE_SPEC = coco.ContextKey[GitIgnoreSpec | None]("gitignore_spec", tracked=False)
EXT_LANG_OVERRIDE_MAP = coco.ContextKey[dict[str, str]]("ext_lang_override_map")

# Module-level variable — set by daemon at startup (needed for CodeChunk annotation).
embedder: Embedder | None = None

# Query prompt name — set alongside embedder by create_embedder().
query_prompt_name: str | None = None


def _build_embedder(settings: EmbeddingSettings) -> Embedder:
    """Build an embedder from settings."""
    global query_prompt_name

    if settings.provider == "sentence-transformers":
        from cocoindex.ops.sentence_transformers import SentenceTransformerEmbedder

        model_name = settings.model
        # Strip the legacy sbert/ prefix if present
        if model_name.startswith(SBERT_PREFIX):
            model_name = model_name[len(SBERT_PREFIX) :]

        query_prompt_name = resolve_query_prompt_name(model_name)
        instance = SentenceTransformerEmbedder(
            model_name,
            device=settings.device,
            trust_remote_code=True,
        )
        logger.info("Embedding model: %s | device: %s", settings.model, settings.device)
    else:
        from cocoindex.ops.litellm import LiteLLMEmbedder

        instance = LiteLLMEmbedder(settings.model)
        query_prompt_name = None
        logger.info("Embedding model (LiteLLM): %s", settings.model)

    return instance


def create_embedder(settings: EmbeddingSettings) -> Embedder:
    """Create and return an embedder instance based on settings.

    Also sets the module-level ``embedder`` and ``query_prompt_name`` variables.
    """
    global embedder

    instance = _build_embedder(settings)
    embedder = instance
    return instance


@dataclass
class CodeChunk:
    """Schema for storing code chunks in SQLite."""

    id: int
    file_path: str
    source_realpath: str
    language: str
    content: str
    content_hash: str
    path_class: str
    start_line: int
    end_line: int
    embedding: Annotated[NDArray, embedder]  # type: ignore[type-arg]
