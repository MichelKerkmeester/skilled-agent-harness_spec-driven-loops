"""Persistent index metadata and compatibility checks for code search."""

from __future__ import annotations

import argparse
import json
import logging
import os
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from enum import StrEnum
from pathlib import Path
from typing import Any

from ._version import __version__

INDEX_META_FILE = "index_meta.json"
CURRENT_SCHEMA_VERSION = 1

logger = logging.getLogger(__name__)
_UNSET = object()


class CompatibilitySeverity(StrEnum):
    HARD_REFUSE = "HARD_REFUSE"
    SOFT_WARN = "SOFT_WARN"
    INFO = "INFO"


@dataclass(frozen=True)
class IndexFingerprintMismatch:
    """One compatibility difference between runtime config and index metadata."""

    field: str
    expected: Any
    actual: Any
    severity: CompatibilitySeverity

    def dump(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["severity"] = self.severity.value
        return payload


class IndexCompatibilityError(RuntimeError):
    """Raised when index metadata is incompatible with the current runtime."""

    def __init__(self, mismatches: list[IndexFingerprintMismatch]) -> None:
        self.mismatches = mismatches
        summary = "; ".join(
            f"{m.field}: expected {m.expected!r}, actual {m.actual!r}"
            for m in mismatches
            if m.severity == CompatibilitySeverity.HARD_REFUSE
        )
        super().__init__(f"INDEX_FINGERPRINT_MISMATCH: {summary}")

    def details(self) -> dict[str, Any]:
        return {"mismatches": [m.dump() for m in self.mismatches]}


@dataclass(frozen=True)
class IndexCompatibilityResult:
    mismatches: list[IndexFingerprintMismatch] = field(default_factory=list)

    @property
    def hard_refusals(self) -> list[IndexFingerprintMismatch]:
        return [
            mismatch
            for mismatch in self.mismatches
            if mismatch.severity == CompatibilitySeverity.HARD_REFUSE
        ]

    @property
    def soft_warnings(self) -> list[IndexFingerprintMismatch]:
        return [
            mismatch
            for mismatch in self.mismatches
            if mismatch.severity == CompatibilitySeverity.SOFT_WARN
        ]

    def raise_for_hard_refusal(self) -> None:
        if self.hard_refusals:
            raise IndexCompatibilityError(self.mismatches)


@dataclass(frozen=True)
class IndexMetadata:
    """Durable metadata stored next to the vector index."""

    schema_version: int
    embedder_name: str
    embedder_provider: str
    embedder_dim: int | None
    query_prompt_name: str | None
    document_prompt_name: str | None
    chunking_policy: str
    chunk_size: int
    chunk_overlap: int
    mirror_dedup_canonical_preference: bool
    corpus_root: str
    created_at: str
    indexer_version: str
    reranker_name: str
    reranker_enabled: bool
    reranker_license: str
    chunk_count: int = 0
    file_count: int = 0
    rrf_K: int = 60
    rrf_V: float = 0.9
    rrf_F: float = 0.5
    hybrid_boost_path: bool = True
    hybrid_boost_canonical: bool = True
    effective_config_hash: str = ""

    def dump(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> IndexMetadata:
        fields = set(cls.__dataclass_fields__)
        values = {key: value for key, value in payload.items() if key in fields}
        values.setdefault("schema_version", CURRENT_SCHEMA_VERSION)
        values.setdefault("created_at", "")
        values.setdefault("indexer_version", "")
        values.setdefault("mirror_dedup_canonical_preference", True)
        values.setdefault("reranker_name", "")
        values.setdefault("reranker_enabled", False)
        values.setdefault("reranker_license", "unknown")
        values.setdefault("effective_config_hash", "")
        return cls(**values)


class IndexCompatibility:
    """Compare persisted index metadata with the current runtime fingerprint."""

    HARD_FIELDS = {
        "schema_version",
        "embedder_name",
        "embedder_provider",
        "embedder_dim",
        "query_prompt_name",
        "document_prompt_name",
        "corpus_root",
        "mirror_dedup_canonical_preference",
    }
    SOFT_FIELDS = {
        "chunking_policy",
        "chunk_size",
        "chunk_overlap",
        "reranker_name",
        "reranker_enabled",
        "reranker_license",
        "rrf_K",
        "rrf_V",
        "rrf_F",
        "hybrid_boost_path",
        "hybrid_boost_canonical",
    }

    def __init__(self, *, expected: IndexMetadata, actual: IndexMetadata | None) -> None:
        self.expected = expected
        self.actual = actual

    def check(self) -> IndexCompatibilityResult:
        if self.actual is None:
            return IndexCompatibilityResult(
                [
                    IndexFingerprintMismatch(
                        field="index_meta",
                        expected="present",
                        actual="missing",
                        severity=CompatibilitySeverity.HARD_REFUSE,
                    )
                ]
            )

        mismatches: list[IndexFingerprintMismatch] = []
        for field_name in sorted(self.HARD_FIELDS | self.SOFT_FIELDS):
            expected_value = getattr(self.expected, field_name)
            actual_value = getattr(self.actual, field_name)
            if expected_value == actual_value:
                continue
            severity = (
                CompatibilitySeverity.HARD_REFUSE
                if field_name in self.HARD_FIELDS
                else CompatibilitySeverity.SOFT_WARN
            )
            mismatches.append(
                IndexFingerprintMismatch(
                    field=field_name,
                    expected=expected_value,
                    actual=actual_value,
                    severity=severity,
                )
            )
        return IndexCompatibilityResult(mismatches)


def index_meta_path(project_root: Path) -> Path:
    return project_root / ".cocoindex_code" / INDEX_META_FILE


def _created_at() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def write_index_meta(project_root: Path, metadata: IndexMetadata) -> Path:
    """Atomically write index metadata with temp-file plus replace."""
    path = index_meta_path(project_root)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp_path.write_text(json.dumps(metadata.dump(), indent=2, sort_keys=True) + "\n")
    os.replace(tmp_path, path)
    return path


def read_index_meta(project_root: Path) -> IndexMetadata | None:
    path = index_meta_path(project_root)
    if not path.is_file():
        return None
    try:
        payload = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(payload, dict):
        return None
    try:
        return IndexMetadata.from_dict(payload)
    except TypeError:
        logger.exception("Invalid index metadata at %s", path)
        return None


def effective_config_hash(config_dict: dict[str, Any]) -> str:
    import hashlib

    payload = json.dumps(config_dict, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


def build_current_index_metadata(
    *,
    project_root: Path,
    chunk_count: int = 0,
    file_count: int = 0,
    embedding_model: str | None = None,
    embedding_provider: str | None = None,
    query_prompt_name: str | None | object = _UNSET,
    document_prompt_name: str | None | object = _UNSET,
) -> IndexMetadata:
    from .config import config
    from .registered_embedders import get_embedder_metadata
    from . import shared

    embedder_name = embedding_model or config.embedding_model
    metadata = get_embedder_metadata(embedder_name)
    embedder_dim = metadata.dim if metadata is not None else None
    embedder_provider = embedding_provider or (
        "sentence-transformers" if embedder_name.startswith("sbert/") else "litellm"
    )
    resolved_query_prompt_name = (
        query_prompt_name
        if query_prompt_name is not _UNSET
        else (
            shared.query_prompt_name
            if shared.query_prompt_name is not None
            else shared.resolve_query_prompt_name(embedder_name)
        )
    )
    resolved_document_prompt_name = (
        document_prompt_name
        if document_prompt_name is not _UNSET
        else (
            shared.document_prompt_name
            if shared.document_prompt_name is not None
            else shared.resolve_document_prompt_name(embedder_name)
        )
    )
    chunking_policy = "tree-sitter" if config.code_aware_chunking else "simple"
    hash_payload = {
        "schema_version": CURRENT_SCHEMA_VERSION,
        "embedder_name": embedder_name,
        "embedder_provider": embedder_provider,
        "embedder_dim": embedder_dim,
        "query_prompt_name": resolved_query_prompt_name,
        "document_prompt_name": resolved_document_prompt_name,
        "chunking_policy": chunking_policy,
        "chunk_size": config.chunk_size,
        "chunk_overlap": config.chunk_overlap,
        "mirror_dedup_canonical_preference": True,
        "corpus_root": str(project_root.resolve()),
        "indexer_version": __version__,
        "reranker_name": config.rerank_model,
        "reranker_enabled": config.rerank_enabled,
        "reranker_license": _reranker_license(config.rerank_model),
        "rrf_K": config.hybrid_rrf_k,
        "rrf_V": config.hybrid_vector_weight,
        "rrf_F": config.hybrid_fts5_weight,
        "hybrid_boost_path": True,
        "hybrid_boost_canonical": True,
    }
    return IndexMetadata(
        **hash_payload,
        created_at=_created_at(),
        chunk_count=chunk_count,
        file_count=file_count,
        effective_config_hash=effective_config_hash(hash_payload),
    )


def _reranker_license(model_name: str) -> str:
    from .registered_embedders import get_reranker_metadata

    metadata = get_reranker_metadata(model_name)
    if metadata is not None:
        return metadata.license
    return "unknown"


def check_index_compatibility(project_root: Path, expected: IndexMetadata) -> IndexCompatibilityResult:
    return IndexCompatibility(expected=expected, actual=read_index_meta(project_root)).check()


def ensure_index_compatible(project_root: Path, expected: IndexMetadata) -> IndexCompatibilityResult:
    result = check_index_compatibility(project_root, expected)
    result.raise_for_hard_refusal()
    return result


def _backfill(project_root: Path) -> Path:
    metadata = build_current_index_metadata(project_root=project_root.resolve())
    return write_index_meta(project_root, metadata)


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage CocoIndex Code index metadata.")
    parser.add_argument("--backfill", metavar="PROJECT", help="write index_meta.json for a project")
    args = parser.parse_args()
    if args.backfill:
        path = _backfill(Path(args.backfill).expanduser().resolve())
        print(path)
        return
    parser.error("expected --backfill <project>")


if __name__ == "__main__":
    main()
