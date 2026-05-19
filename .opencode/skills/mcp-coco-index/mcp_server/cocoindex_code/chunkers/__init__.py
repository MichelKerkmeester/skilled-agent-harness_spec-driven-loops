"""Chunking strategies for CocoIndex Code."""

from .code_aware import CodeAwareSplitter
from .grammars import GrammarSpec, LANGUAGE_GRAMMARS

__all__ = ["CodeAwareSplitter", "GrammarSpec", "LANGUAGE_GRAMMARS"]
