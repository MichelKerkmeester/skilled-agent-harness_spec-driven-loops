#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Design search - query the sk-interface-design data sets (BM25, zero-dependency).

Adapted from ui-ux-pro-max search.py (MIT, (c) 2024 Next Level Builder); see
../THIRD-PARTY-NOTICES.md and ../LICENSE-ui-ux-pro-max.txt. Adaptations: the
design-system GENERATOR and PERSISTENCE surface was removed (no design_system
import, no --design-system, no --persist, no written design-system/ files), and
the stack search was dropped. This is a query-only lookup, never a required step.

Usage:
  python design_search.py "<query>" [--domain <domain>] [--max-results 3] [--json]

Domains: style, color, chart, landing, product, ux, typography, web, reasoning
Use the data as an inventory of common/expected patterns to critique against,
not as authoritative answers. design_principles.md remains the authority.
"""

import argparse
import sys
import io
from design_search_core import CSV_CONFIG, MAX_RESULTS, search

# Force UTF-8 for stdout/stderr to handle emojis on Windows (cp1252 default)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def format_output(result):
    """Format results for terminal/agent consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    output.append("## Design Search Results")
    output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")

    return "\n".join(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Design data search (query-only)")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Search domain")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    result = search(args.query, args.domain, args.max_results)
    if args.json:
        import json
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(format_output(result))
