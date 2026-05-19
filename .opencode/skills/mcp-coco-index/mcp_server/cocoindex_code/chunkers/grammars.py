"""Tree-sitter grammar registry for code-aware chunking."""

from __future__ import annotations

import importlib
import logging
from collections.abc import Callable, Mapping
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

from tree_sitter import Language

logger = logging.getLogger(__name__)


LanguageFactory = Callable[[], Language]


@dataclass(frozen=True)
class GrammarSpec:
    """Language-specific tree-sitter settings for code chunk boundaries."""

    language_id: str
    language_object: LanguageFactory
    top_level_node_types: frozenset[str]
    doc_comment_node_types: frozenset[str]
    declaration_wrapper_node_types: frozenset[str] = frozenset()
    arrow_function_node_types: frozenset[str] = frozenset()
    aliases: frozenset[str] = frozenset()

    def load_language(self) -> Language:
        """Load the tree-sitter Language object."""
        return self.language_object()


@lru_cache(maxsize=None)
def _load_language(module_name: str, function_name: str) -> Language:
    module = importlib.import_module(module_name)
    raw_language = getattr(module, function_name)()
    return Language(raw_language)


def _factory(module_name: str, function_name: str = "language") -> LanguageFactory:
    return lambda: _load_language(module_name, function_name)


JS_TS_TOP_LEVEL = frozenset(
    {
        "abstract_class_declaration",
        "class_declaration",
        "enum_declaration",
        "function_declaration",
        "generator_function_declaration",
        "interface_declaration",
        "lexical_declaration",
        "type_alias_declaration",
        "variable_declaration",
    }
)
JS_TS_DOC_COMMENTS = frozenset({"comment"})
JS_TS_WRAPPERS = frozenset({"export_statement"})
JS_TS_ARROW_VALUES = frozenset(
    {
        "arrow_function",
        "class",
        "class_expression",
        "function",
        "function_expression",
        "generator_function",
        "generator_function_declaration",
    }
)


LANGUAGE_GRAMMARS: dict[str, GrammarSpec] = {
    "typescript": GrammarSpec(
        language_id="typescript",
        language_object=_factory("tree_sitter_typescript", "language_typescript"),
        top_level_node_types=JS_TS_TOP_LEVEL,
        doc_comment_node_types=JS_TS_DOC_COMMENTS,
        declaration_wrapper_node_types=JS_TS_WRAPPERS,
        arrow_function_node_types=JS_TS_ARROW_VALUES,
        aliases=frozenset({"tsx"}),
    ),
    "tsx": GrammarSpec(
        language_id="tsx",
        language_object=_factory("tree_sitter_typescript", "language_tsx"),
        top_level_node_types=JS_TS_TOP_LEVEL,
        doc_comment_node_types=JS_TS_DOC_COMMENTS,
        declaration_wrapper_node_types=JS_TS_WRAPPERS,
        arrow_function_node_types=JS_TS_ARROW_VALUES,
    ),
    "javascript": GrammarSpec(
        language_id="javascript",
        language_object=_factory("tree_sitter_javascript"),
        top_level_node_types=JS_TS_TOP_LEVEL,
        doc_comment_node_types=JS_TS_DOC_COMMENTS,
        declaration_wrapper_node_types=JS_TS_WRAPPERS,
        arrow_function_node_types=JS_TS_ARROW_VALUES,
    ),
    "python": GrammarSpec(
        language_id="python",
        language_object=_factory("tree_sitter_python"),
        top_level_node_types=frozenset({"class_definition", "function_definition"}),
        doc_comment_node_types=frozenset({"comment"}),
        declaration_wrapper_node_types=frozenset({"decorated_definition"}),
    ),
    "go": GrammarSpec(
        language_id="go",
        language_object=_factory("tree_sitter_go"),
        top_level_node_types=frozenset(
            {"function_declaration", "method_declaration", "type_declaration"}
        ),
        doc_comment_node_types=frozenset({"comment"}),
    ),
    "rust": GrammarSpec(
        language_id="rust",
        language_object=_factory("tree_sitter_rust"),
        top_level_node_types=frozenset(
            {"enum_item", "function_item", "impl_item", "struct_item", "trait_item"}
        ),
        doc_comment_node_types=frozenset({"block_comment", "line_comment"}),
    ),
    "java": GrammarSpec(
        language_id="java",
        language_object=_factory("tree_sitter_java"),
        top_level_node_types=frozenset(
            {"class_declaration", "interface_declaration", "method_declaration"}
        ),
        doc_comment_node_types=frozenset({"block_comment", "line_comment"}),
    ),
}


def grammar_for_language(
    language: str,
    overrides: Mapping[str, object] | None = None,
) -> GrammarSpec | None:
    """Resolve a language id to a grammar spec, including configured overrides."""
    language_key = language.strip().lower()
    registry = build_language_grammars(overrides)
    if language_key in registry:
        return registry[language_key]

    for spec in registry.values():
        if language_key in spec.aliases:
            return spec
    return None


def build_language_grammars(
    overrides: Mapping[str, object] | None = None,
) -> dict[str, GrammarSpec]:
    """Return the baseline registry plus valid env-configured grammar specs.

    Override shape:
    {
      "language-id": {
        "module": "tree_sitter_example",
        "function": "language",
        "top_level_node_types": ["function_declaration"],
        "doc_comment_node_types": ["comment"]
      }
    }
    """
    registry = dict(LANGUAGE_GRAMMARS)
    if not overrides:
        return registry

    for language_id, raw_spec in overrides.items():
        spec = _parse_override_spec(language_id, raw_spec)
        if spec is not None:
            registry[spec.language_id] = spec
    return registry


def _string_list(value: Any, field_name: str, language_id: str) -> frozenset[str] | None:
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        logger.warning(
            "Ignoring COCOINDEX_TREE_SITTER_LANGUAGES[%s]; %s must be a string list",
            language_id,
            field_name,
        )
        return None
    return frozenset(item.strip() for item in value if item.strip())


def _parse_override_spec(language_id: str, raw_spec: object) -> GrammarSpec | None:
    if not isinstance(raw_spec, Mapping):
        logger.warning(
            "Ignoring COCOINDEX_TREE_SITTER_LANGUAGES[%s]; expected object",
            language_id,
        )
        return None

    module_name = raw_spec.get("module")
    if not isinstance(module_name, str) or not module_name.strip():
        logger.warning(
            "Ignoring COCOINDEX_TREE_SITTER_LANGUAGES[%s]; module is required",
            language_id,
        )
        return None

    top_level = _string_list(
        raw_spec.get("top_level_node_types"),
        "top_level_node_types",
        language_id,
    )
    doc_comments = _string_list(
        raw_spec.get("doc_comment_node_types", []),
        "doc_comment_node_types",
        language_id,
    )
    if top_level is None or doc_comments is None:
        return None

    wrapper_nodes = _string_list(
        raw_spec.get("declaration_wrapper_node_types", []),
        "declaration_wrapper_node_types",
        language_id,
    )
    arrow_nodes = _string_list(
        raw_spec.get("arrow_function_node_types", []),
        "arrow_function_node_types",
        language_id,
    )
    aliases = _string_list(raw_spec.get("aliases", []), "aliases", language_id)
    if wrapper_nodes is None or arrow_nodes is None or aliases is None:
        return None

    function_name = raw_spec.get("function", "language")
    if not isinstance(function_name, str) or not function_name.strip():
        logger.warning(
            "Ignoring COCOINDEX_TREE_SITTER_LANGUAGES[%s]; function must be a string",
            language_id,
        )
        return None

    normalized_id = language_id.strip().lower()
    return GrammarSpec(
        language_id=normalized_id,
        language_object=_factory(module_name.strip(), function_name.strip()),
        top_level_node_types=top_level,
        doc_comment_node_types=doc_comments,
        declaration_wrapper_node_types=wrapper_nodes,
        arrow_function_node_types=arrow_nodes,
        aliases=aliases,
    )
