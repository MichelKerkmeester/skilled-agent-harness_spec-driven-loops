#!/usr/bin/env python3
"""
Cross-Encoder Reranking Script for Semantic Memory

Uses sentence-transformers cross-encoder to rerank search results
for improved accuracy. This is an optional enhancement.

Input (stdin): JSON with query and documents
Output (stdout): JSON array of reranking scores

Requirements:
  pip install sentence-transformers torch

Usage:
  echo '{"query": "...", "documents": [...]}' | python3 rerank.py

@version 11.0.0
"""

import sys
import json
import os
from typing import List, Dict, Any

# Model configuration
MODEL_NAME = 'cross-encoder/ms-marco-MiniLM-L-6-v2'
MAX_LENGTH = 512

# Global model instance (loaded on first use)
_model = None

def get_model():
    """Lazy-load the cross-encoder model."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import CrossEncoder
            _model = CrossEncoder(MODEL_NAME, max_length=MAX_LENGTH)
        except ImportError:
            print("Error: sentence-transformers not installed", file=sys.stderr)
            print("Install with: pip install sentence-transformers torch", file=sys.stderr)
            sys.exit(1)
    return _model


def rerank(query: str, documents: List[Dict[str, Any]]) -> List[float]:
    """
    Rerank documents using cross-encoder.

    Args:
        query: Search query
        documents: List of dicts with 'text' field

    Returns:
        List of reranking scores (higher = more relevant)
    """
    model = get_model()

    # Create query-document pairs
    pairs = [[query, doc.get('text', '')] for doc in documents]

    # Get cross-encoder scores
    scores = model.predict(pairs)

    return scores.tolist()


def main():
    """Main entry point - read from stdin, output to stdout."""
    try:
        # Read JSON from stdin
        data = json.load(sys.stdin)

        query = data.get('query', '')
        documents = data.get('documents', [])

        if not query:
            print(json.dumps({"error": "Missing query"}))
            sys.exit(1)

        if not documents:
            print(json.dumps([]))
            return

        # Rerank
        scores = rerank(query, documents)

        # Output scores
        print(json.dumps(scores))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
