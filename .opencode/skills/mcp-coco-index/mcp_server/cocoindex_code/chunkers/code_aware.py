"""AST-aware chunking for source files with tree-sitter grammars."""

from __future__ import annotations

import logging
from collections.abc import Iterable, Mapping
from dataclasses import dataclass

from cocoindex.ops.text import RecursiveSplitter
from cocoindex.resources.chunk import Chunk, TextPosition
from tree_sitter import Parser

from .grammars import GrammarSpec, grammar_for_language

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class _NodeRange:
    start_byte: int
    end_byte: int
    start_row: int
    start_column: int
    end_row: int
    end_column: int


class CodeAwareSplitter:
    """Split code at AST definition boundaries with RecursiveSplitter fallback."""

    def __init__(
        self,
        *,
        chunk_size: int,
        chunk_overlap: int,
        min_chunk_size: int,
        grammar_overrides: Mapping[str, object] | None = None,
    ) -> None:
        self._chunk_size = chunk_size
        self._chunk_overlap = chunk_overlap
        self._min_chunk_size = min_chunk_size
        self._grammar_overrides = grammar_overrides
        self._fallback = RecursiveSplitter()

    def split(self, text: str, language: str) -> list[Chunk]:
        """Return code-aware chunks for supported languages."""
        spec = grammar_for_language(language, self._grammar_overrides)
        if spec is None:
            return self.fallback_split(text, language)

        try:
            parser = Parser(spec.load_language())
            source_bytes = text.encode("utf-8")
            tree = parser.parse(source_bytes)
        except Exception as exc:  # pragma: no cover - environment-specific parser failure
            logger.warning(
                "Falling back to RecursiveSplitter for %s after tree-sitter failure: %s",
                language,
                exc,
            )
            return self.fallback_split(text, language)

        if tree.root_node.has_error:
            return self.fallback_split(text, language)

        ranges = list(_definition_ranges(tree.root_node.children, spec, source_bytes))
        if not ranges:
            return self.fallback_split(text, language)

        chunks: list[Chunk] = []
        for node_range in ranges:
            chunk = _chunk_from_range(source_bytes, node_range)
            if len(chunk.text) > self._chunk_size * 2:
                chunks.extend(self._split_oversized_chunk(chunk, language))
            elif chunk.text.strip():
                chunks.append(chunk)

        return chunks or self.fallback_split(text, language)

    def fallback_split(self, text: str, language: str) -> list[Chunk]:
        """Run the pre-015 RecursiveSplitter path."""
        return self._fallback.split(
            text,
            chunk_size=self._chunk_size,
            min_chunk_size=self._min_chunk_size,
            chunk_overlap=self._chunk_overlap,
            language=language,
        )

    def _split_oversized_chunk(self, chunk: Chunk, language: str) -> list[Chunk]:
        sub_chunks = self.fallback_split(chunk.text, language)
        adjusted: list[Chunk] = []
        for sub_chunk in sub_chunks:
            adjusted.append(_offset_chunk(sub_chunk, chunk.start))
        return adjusted


def _definition_ranges(
    nodes: Iterable[object],
    spec: GrammarSpec,
    source_bytes: bytes,
) -> Iterable[_NodeRange]:
    siblings = list(nodes)
    for index, node in enumerate(siblings):
        if not _is_definition_node(node, spec):
            continue
        yield _range_with_doc_prefix(siblings, index, spec, source_bytes)


def _is_definition_node(node: object, spec: GrammarSpec) -> bool:
    node_type = getattr(node, "type", "")
    if node_type in spec.top_level_node_types:
        if node_type in {"lexical_declaration", "variable_declaration"}:
            return _contains_arrow_definition(node, spec)
        return True

    if node_type in spec.declaration_wrapper_node_types:
        declaration = _child_for_field_name(node, "declaration")
        definition = _child_for_field_name(node, "definition")
        return any(
            child is not None and _is_definition_node(child, spec)
            for child in (declaration, definition)
        )

    return False


def _contains_arrow_definition(node: object, spec: GrammarSpec) -> bool:
    for child in getattr(node, "named_children", []):
        if getattr(child, "type", "") != "variable_declarator":
            continue
        value = _child_for_field_name(child, "value")
        if value is not None and getattr(value, "type", "") in spec.arrow_function_node_types:
            return True
    return False


def _child_for_field_name(node: object, field_name: str) -> object | None:
    child_for_field_name = getattr(node, "child_by_field_name", None) or getattr(
        node,
        "childForFieldName",
        None,
    )
    if child_for_field_name is None:
        return None
    return child_for_field_name(field_name)


def _range_with_doc_prefix(
    siblings: list[object],
    index: int,
    spec: GrammarSpec,
    source_bytes: bytes,
) -> _NodeRange:
    node = siblings[index]
    start_node = node
    for previous in reversed(siblings[:index]):
        previous_type = getattr(previous, "type", "")
        if previous_type not in spec.doc_comment_node_types:
            break
        gap = source_bytes[getattr(previous, "end_byte") : getattr(start_node, "start_byte")]
        if gap.strip():
            break
        start_node = previous

    return _NodeRange(
        start_byte=getattr(start_node, "start_byte"),
        end_byte=getattr(node, "end_byte"),
        start_row=getattr(start_node, "start_point").row,
        start_column=getattr(start_node, "start_point").column,
        end_row=getattr(node, "end_point").row,
        end_column=getattr(node, "end_point").column,
    )


def _chunk_from_range(source_bytes: bytes, node_range: _NodeRange) -> Chunk:
    chunk_text = source_bytes[node_range.start_byte : node_range.end_byte].decode("utf-8")
    start_char = len(source_bytes[: node_range.start_byte].decode("utf-8"))
    end_char = len(source_bytes[: node_range.end_byte].decode("utf-8"))
    return Chunk(
        text=chunk_text,
        start=TextPosition(
            byte_offset=node_range.start_byte,
            char_offset=start_char,
            line=node_range.start_row + 1,
            column=node_range.start_column + 1,
        ),
        end=TextPosition(
            byte_offset=node_range.end_byte,
            char_offset=end_char,
            line=node_range.end_row + 1,
            column=node_range.end_column + 1,
        ),
    )


def _offset_chunk(chunk: Chunk, base_start: TextPosition) -> Chunk:
    start_line = base_start.line + chunk.start.line - 1
    end_line = base_start.line + chunk.end.line - 1
    start_column = (
        base_start.column + chunk.start.column - 1
        if chunk.start.line == 1
        else chunk.start.column
    )
    end_column = (
        base_start.column + chunk.end.column - 1
        if chunk.end.line == 1
        else chunk.end.column
    )
    return Chunk(
        text=chunk.text,
        start=TextPosition(
            byte_offset=base_start.byte_offset + chunk.start.byte_offset,
            char_offset=base_start.char_offset + chunk.start.char_offset,
            line=start_line,
            column=start_column,
        ),
        end=TextPosition(
            byte_offset=base_start.byte_offset + chunk.end.byte_offset,
            char_offset=base_start.char_offset + chunk.end.char_offset,
            line=end_line,
            column=end_column,
        ),
    )
