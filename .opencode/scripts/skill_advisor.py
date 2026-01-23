#!/usr/bin/env python3
"""
Skill Advisor - Analyzes user requests and recommends appropriate skills.
Used by Gate 2 in AGENTS.md for skill routing.

Usage: python skill_advisor.py "user request" [--threshold 0.8]
Output: JSON array of skill recommendations with confidence scores

Options:
    --health      Run health check diagnostics
    --threshold   Filter results to only show recommendations >= threshold (default: 0.0)
"""
import sys
import json
import os
import re
import glob
import argparse

# Path to skill directory (relative to project root)
# Note: OpenCode native skills use singular "skill" folder
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))  # Go up from scripts/ to .opencode/ to project root
SKILLS_DIR = os.path.join(PROJECT_ROOT, ".opencode/skill")

# Comprehensive stop words - filtered from BOTH query AND corpus
# These words have no semantic meaning for skill matching
STOP_WORDS = {
    'a', 'about', 'able', 'actually', 'agent', 'all', 'also', 'an', 'and', 'any',
    'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did',
    'do', 'does', 'even', 'for', 'from', 'get', 'give', 'go', 'going', 'had',
    'has', 'have', 'he', 'help', 'her', 'him', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'just', 'let', 'like', 'may', 'me', 'might', 'more',
    'most', 'must', 'my', 'need', 'no', 'not', 'now', 'of', 'on', 'only', 'or',
    'other', 'our', 'please', 'really', 'run', 'she', 'should', 'show', 'skill',
    'so', 'some', 'tell', 'that', 'the', 'them', 'then', 'these', 'they',
    'thing', 'things', 'this', 'those', 'to', 'tool', 'try', 'us', 'use',
    'used', 'using', 'very', 'want', 'was', 'way', 'we', 'were', 'what', 'when',
    'where', 'which', 'who', 'why', 'will', 'with', 'work', 'would', 'you', 'your'
}

# Synonym expansion - maps user intent to technical terms in SKILL.md
SYNONYM_MAP = {
    # Code structure & analysis
    "ast": ["treesitter", "syntax", "parse", "structure"],
    "codebase": ["code", "project", "repository", "source"],
    "functions": ["methods", "definitions", "symbols"],
    "classes": ["types", "definitions", "structure"],
    "symbols": ["definitions", "functions", "classes", "exports"],

    # Git & version control
    "branch": ["git", "commit", "merge", "checkout"],
    "commit": ["git", "version", "push", "branch", "changes"],
    "merge": ["git", "branch", "commit", "rebase"],
    "push": ["git", "commit", "remote", "branch"],
    "rebase": ["git", "branch", "commit", "history"],
    "stash": ["git", "changes", "temporary"],
    "worktree": ["git", "branch", "workspace", "isolation"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    "pull": ["git", "fetch", "merge", "remote"],
    "clone": ["git", "repository", "download"],

    # Memory & context preservation
    "context": ["memory", "session", "save"],
    "remember": ["memory", "context", "save", "store"],
    "save": ["context", "memory", "preserve", "store"],
    "recall": ["memory", "search", "find", "retrieve"],
    "forget": ["memory", "delete", "remove"],
    "checkpoint": ["memory", "save", "restore", "backup"],
    "history": ["memory", "context", "past", "previous"],
    "session": ["memory", "context", "conversation"],
    "preserve": ["memory", "save", "context", "store"],
    "store": ["memory", "save", "context", "persist"],

    # Documentation
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "write": ["documentation", "create", "generate"],
    "readme": ["documentation", "markdown", "explain"],
    "flowchart": ["documentation", "diagram", "ascii"],
    "diagram": ["documentation", "flowchart", "visual"],

    # Spec & planning
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    "spec": ["specification", "plan", "document", "folder"],
    "folder": ["spec", "directory", "create", "organize"],
    "scaffold": ["create", "generate", "new", "template"],
    "template": ["scaffold", "create", "generate"],

    # Debugging & browser
    "bug": ["debug", "error", "issue", "defect", "verification"],
    "console": ["chrome", "browser", "debug", "log"],
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "network": ["chrome", "browser", "requests", "debug"],
    "inspect": ["chrome", "browser", "debug", "devtools"],
    "breakpoint": ["debug", "chrome", "devtools"],
    "error": ["bug", "debug", "fix", "issue"],
    "issue": ["bug", "debug", "error", "problem"],

    # Search & discovery
    "find": ["search", "locate", "explore", "lookup"],
    "search": ["find", "locate", "explore", "query", "lookup"],
    "where": ["find", "search", "locate", "navigate"],
    "lookup": ["find", "search", "locate"],
    "explore": ["search", "find", "navigate", "discover"],
    "navigate": ["find", "search", "locate", "goto"],
    "locate": ["find", "search", "where"],

    # Actions & creation
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "make": ["create", "implement", "build", "generate"],
    "new": ["create", "implement", "scaffold", "generate"],
    "add": ["create", "implement", "new", "insert"],
    "build": ["create", "implement", "generate"],
    "generate": ["create", "build", "scaffold"],

    # Code quality & fixes
    "check": ["verify", "validate", "test"],
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    "test": ["verify", "validate", "check", "spec", "quality"],
    "verify": ["check", "validate", "test", "confirm"],
    "validate": ["check", "verify", "test"],

    # Understanding & explanation
    "help": ["guide", "assist", "documentation", "explain"],
    "how": ["understand", "explain", "works", "meaning"],
    "what": ["definition", "structure", "outline", "list"],
    "why": ["understand", "explain", "reason", "purpose"],
    "explain": ["understand", "how", "works", "describe"],
    "understand": ["how", "explain", "learn", "works"],
    "works": ["how", "understand", "explain", "function"],

    # Display & output
    "show": ["list", "display", "outline", "tree"],
    "list": ["show", "display", "enumerate"],
    "display": ["show", "list", "output"],
    "print": ["show", "display", "output"],
}

# Intent boosters - High-confidence keyword → skill direct mapping
# These keywords strongly indicate a specific skill, adding bonus score
# Format: keyword -> (skill_name, boost_amount)
# NOTE: These are checked BEFORE stop word filtering, so question words work here
# Score formula: Two-tiered based on intent boost presence
#   - With intent boost: confidence = min(0.50 + score * 0.15, 0.95)
#   - Without intent boost: confidence = min(0.25 + score * 0.15, 0.95)
# To reach 0.8 threshold with intent boost: need score >= 2.0
INTENT_BOOSTERS = {
    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Context preservation, recall, and specification
    # (Memory functionality merged into system-spec-kit)
    # ─────────────────────────────────────────────────────────────────
    "checkpoint": ("system-spec-kit", 0.6),
    "context": ("system-spec-kit", 0.5),
    "forget": ("system-spec-kit", 0.4),
    "history": ("system-spec-kit", 0.4),
    "memory": ("system-spec-kit", 0.6),
    "preserve": ("system-spec-kit", 0.5),
    "recall": ("system-spec-kit", 0.5),
    "remember": ("system-spec-kit", 0.5),
    "restore": ("system-spec-kit", 0.4),
    "session": ("system-spec-kit", 0.4),
    "store": ("system-spec-kit", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # MCP-NARSIL: Semantic + structural code search (meaning-based)
    # ─────────────────────────────────────────────────────────────────
    "ask": ("mcp-narsil", 0.4),
    "auth": ("mcp-narsil", 1.8),
    "authentication": ("mcp-narsil", 1.8),
    "codebase": ("mcp-narsil", 0.5),
    "does": ("mcp-narsil", 0.6),
    "embeddings": ("mcp-narsil", 0.7),
    "explain": ("mcp-narsil", 3.5),
    "how": ("mcp-narsil", 1.2),
    "index": ("mcp-narsil", 0.3),
    "login": ("mcp-narsil", 0.8),
    "logout": ("mcp-narsil", 0.6),
    "meaning": ("mcp-narsil", 0.6),
    "password": ("mcp-narsil", 0.5),
    "purpose": ("mcp-narsil", 0.5),
    "query": ("mcp-narsil", 0.4),
    "rag": ("mcp-narsil", 0.6),
    "semantic": ("mcp-narsil", 0.5),
    "understand": ("mcp-narsil", 1.5),
    "user": ("mcp-narsil", 0.4),
    "vector": ("mcp-narsil", 0.6),
    "what": ("mcp-narsil", 1.0),
    "why": ("mcp-narsil", 1.5),
    "work": ("mcp-narsil", 1.0),
    "works": ("mcp-narsil", 1.0),

    # ─────────────────────────────────────────────────────────────────
    # MCP-NARSIL: Structural analysis, security scanning, call graphs
    # (Additional structural and security keywords)
    # ─────────────────────────────────────────────────────────────────
    # Structural analysis (AST-based)
    "ast": ("mcp-narsil", 0.6),
    "classes": ("mcp-narsil", 0.4),
    "definitions": ("mcp-narsil", 0.5),
    "exports": ("mcp-narsil", 0.4),
    "functions": ("mcp-narsil", 0.4),
    "imports": ("mcp-narsil", 0.4),
    "list": ("mcp-narsil", 0.3),
    "methods": ("mcp-narsil", 0.4),
    "navigate": ("mcp-narsil", 0.4),
    "outline": ("mcp-narsil", 0.6),
    "structure": ("mcp-narsil", 0.5),
    "symbols": ("mcp-narsil", 0.5),
    "tree": ("mcp-narsil", 0.5),
    "treesitter": ("mcp-narsil", 0.7),

    # Security scanning
    "vulnerability": ("mcp-narsil", 0.8),
    "vulnerabilities": ("mcp-narsil", 0.8),
    "security": ("mcp-narsil", 0.6),
    "secure": ("mcp-narsil", 0.5),
    "scan": ("mcp-narsil", 0.5),
    "scanning": ("mcp-narsil", 0.5),
    "owasp": ("mcp-narsil", 0.9),
    "cwe": ("mcp-narsil", 0.9),
    "taint": ("mcp-narsil", 0.8),
    "injection": ("mcp-narsil", 0.7),
    "xss": ("mcp-narsil", 0.9),
    "sqli": ("mcp-narsil", 0.9),
    "csrf": ("mcp-narsil", 0.8),

    # Code analysis
    "deadcode": ("mcp-narsil", 0.8),
    "dead-code": ("mcp-narsil", 0.8),  # kept for documentation (unreachable due to tokenization)
    "dead": ("mcp-narsil", 0.4),  # partial match for "dead code" queries
    "complexity": ("mcp-narsil", 0.6),
    "callgraph": ("mcp-narsil", 0.8),
    "call-graph": ("mcp-narsil", 0.8),  # kept for documentation (unreachable due to tokenization)
    "call": ("mcp-narsil", 0.3),  # partial match for "call graph" queries
    "graph": ("mcp-narsil", 0.3),  # partial match for "call graph" queries
    "callers": ("mcp-narsil", 0.7),
    "callees": ("mcp-narsil", 0.7),
    "cfg": ("mcp-narsil", 0.7),
    "dfg": ("mcp-narsil", 0.7),

    # Supply chain
    "sbom": ("mcp-narsil", 0.8),
    "license": ("mcp-narsil", 0.5),
    "dependency": ("mcp-narsil", 0.5),
    "dependencies": ("mcp-narsil", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Specification and planning
    # ─────────────────────────────────────────────────────────────────
    "checklist": ("system-spec-kit", 0.5),
    "folder": ("system-spec-kit", 0.4),
    "plan": ("system-spec-kit", 0.5),
    "scaffold": ("system-spec-kit", 0.4),
    "spec": ("system-spec-kit", 0.6),
    "specification": ("system-spec-kit", 0.5),
    "speckit": ("system-spec-kit", 0.8),
    "task": ("system-spec-kit", 0.3),
    "tasks": ("system-spec-kit", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-GIT: Version control operations
    # ─────────────────────────────────────────────────────────────────
    "git": ("workflows-git", 1.0),
    "branch": ("workflows-git", 0.4),
    "checkout": ("workflows-git", 0.5),
    "clone": ("workflows-git", 0.5),
    "commit": ("workflows-git", 0.5),
    "diff": ("workflows-git", 0.5),
    "fetch": ("workflows-git", 0.4),
    "gh": ("workflows-git", 1.5),
    "github": ("workflows-git", 2.0),
    "issue": ("workflows-git", 0.8),
    "log": ("workflows-git", 0.4),
    "merge": ("workflows-git", 0.5),
    "pr": ("workflows-git", 0.8),
    "pull": ("workflows-git", 0.5),
    "push": ("workflows-git", 0.5),
    "rebase": ("workflows-git", 0.8),
    "repo": ("workflows-git", 0.6),
    "repository": ("workflows-git", 0.5),
    "review": ("workflows-git", 0.8),
    "stash": ("workflows-git", 0.5),
    "worktree": ("workflows-git", 1.2),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-CHROME-DEVTOOLS: Browser debugging
    # ─────────────────────────────────────────────────────────────────
    "bdg": ("workflows-chrome-devtools", 1.0),
    "breakpoint": ("workflows-chrome-devtools", 0.6),
    "browser": ("workflows-chrome-devtools", 1.2),
    "chrome": ("workflows-chrome-devtools", 1.0),
    "console": ("workflows-chrome-devtools", 1.0),
    "css": ("workflows-chrome-devtools", 0.4),
    "debug": ("workflows-chrome-devtools", 1.0),
    "debugger": ("workflows-chrome-devtools", 1.0),
    "devtools": ("workflows-chrome-devtools", 1.2),
    "dom": ("workflows-chrome-devtools", 0.5),
    "elements": ("workflows-chrome-devtools", 0.5),
    "inspect": ("workflows-chrome-devtools", 1.0),
    "network": ("workflows-chrome-devtools", 0.8),
    "performance": ("workflows-chrome-devtools", 0.5),
    "screenshot": ("workflows-chrome-devtools", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-DOCUMENTATION: Documentation and diagrams
    # ─────────────────────────────────────────────────────────────────
    "ascii": ("workflows-documentation", 0.4),
    "diagram": ("workflows-documentation", 0.4),
    "document": ("workflows-documentation", 0.5),
    "documentation": ("workflows-documentation", 0.6),
    "flowchart": ("workflows-documentation", 0.7),
    "markdown": ("workflows-documentation", 0.5),
    "readme": ("workflows-documentation", 0.5),
    "template": ("workflows-documentation", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-CODE: Implementation and verification
    # ─────────────────────────────────────────────────────────────────
    "bug": ("workflows-code", 0.5),
    "error": ("workflows-code", 0.4),
    "implement": ("workflows-code", 0.6),
    "refactor": ("workflows-code", 0.5),
    "verification": ("workflows-code", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CODE-MODE: External tool integration
    # ─────────────────────────────────────────────────────────────────
    "clickup": ("mcp-code-mode", 2.5),
    "cms": ("mcp-code-mode", 0.5),
    "component": ("mcp-code-mode", 0.4),
    "external": ("mcp-code-mode", 0.4),
    "figma": ("mcp-code-mode", 2.5),
    "notion": ("mcp-code-mode", 2.5),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "site": ("mcp-code-mode", 0.6),
    "sites": ("mcp-code-mode", 0.6),
    "typescript": ("mcp-code-mode", 0.4),
    "utcp": ("mcp-code-mode", 0.8),
    "webflow": ("mcp-code-mode", 2.5),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.3), ("mcp-narsil", 0.2)],
    "changes": [("workflows-git", 0.4), ("system-spec-kit", 0.2)],
    "code": [("workflows-code", 0.2), ("mcp-narsil", 0.25)],
    "codebase": [("mcp-narsil", 0.4)],
    "context": [("system-spec-kit", 0.3), ("mcp-narsil", 0.2)],
    "find": [("mcp-narsil", 0.4)],
    "fix": [("workflows-code", 0.3), ("workflows-git", 0.1)],
    "mcp": [("mcp-code-mode", 0.3), ("mcp-narsil", 0.4)],
    "plan": [("system-spec-kit", 0.3), ("workflows-code", 0.2)],
    "save": [("system-spec-kit", 0.3), ("workflows-git", 0.2)],
    "search": [("mcp-narsil", 0.4)],
    "session": [("system-spec-kit", 0.4), ("mcp-narsil", 0.2)],
    "test": [("workflows-code", 0.3), ("workflows-chrome-devtools", 0.2)],
    "update": [("mcp-code-mode", 0.3), ("workflows-git", 0.2), ("workflows-code", 0.2)],
}


def parse_frontmatter(file_path):
    """Extract name and description from SKILL.md frontmatter."""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            if match:
                yaml_block = match.group(1)
                data = {}
                for line in yaml_block.split('\n'):
                    if ':' in line:
                        key, val = line.split(':', 1)
                        data[key.strip()] = val.strip().strip('"').strip("'")
                return data
    except Exception as e:
        print(f"Warning: Failed to parse frontmatter from {file_path}: {e}", file=sys.stderr)
        return None
    return None


def get_skills():
    """Dynamically scan the skills directory and return skill configs."""
    skills = {}

    if os.path.exists(SKILLS_DIR):
        for skill_file in glob.glob(os.path.join(SKILLS_DIR, "*/SKILL.md")):
            meta = parse_frontmatter(skill_file)
            if meta and 'name' in meta:
                skills[meta['name']] = {
                    "description": meta.get('description', ''),
                    "weight": 1.0  # Equal weight for all skills
                }

    # Hardcoded command bridges (slash commands)
    skills["command-spec-kit"] = {
        "description": "Create specifications and plans using /spec_kit slash command for new features or complex changes.",
        "weight": 1.0
    }

    skills["command-memory-save"] = {
        "description": "Save conversation context to memory using /memory:save.",
        "weight": 1.0
    }

    return skills


def expand_query(prompt_tokens):
    """Expand user tokens with synonyms for better matching."""
    expanded = set(prompt_tokens)
    for token in prompt_tokens:
        if token in SYNONYM_MAP:
            expanded.update(SYNONYM_MAP[token])
    return list(expanded)


def calculate_confidence(score, has_intent_boost, weight=1.0):
    """
    Calculate confidence score using two-tiered formula.

    The formula distinguishes between queries that match explicit intent keywords
    (INTENT_BOOSTERS) versus those that only match description corpus terms.

    With intent boost (keyword directly matched in INTENT_BOOSTERS):
        confidence = min(0.50 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.80 (meets 0.8 threshold)
        - score=3.0 → 0.95 (max)
        - score=4.0 → 0.95 (capped)

    Without intent boost (corpus matching only):
        confidence = min(0.25 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.55 (below threshold)
        - score=3.0 → 0.70 (below threshold)
        - score=4.0 → 0.85 (meets threshold)
        - score=5.0 → 0.95 (capped)

    The 0.8 threshold in Gate 2 means:
    - With intent boost: Only needs score >= 2.0 to trigger skill routing
    - Without intent boost: Needs score >= 4.0 to trigger skill routing

    This design favors explicit domain keywords while remaining conservative
    for generic corpus matches that may be coincidental.

    Args:
        score: Accumulated match score from corpus matching and intent boosters.
               Higher scores come from matching more terms or important keywords.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
                         True enables the higher-confidence formula.
        weight: Skill weight multiplier (default 1.0, currently unused but
                reserved for future skill prioritization).

    Returns:
        float: Confidence score between 0.0 and 0.95 (or 1.0 if weight > 1.0)
    """
    if has_intent_boost:
        # Intent booster matched - higher confidence curve
        confidence = min(0.50 + score * 0.15, 0.95)
    else:
        # No explicit boosters - conservative (corpus matches only)
        confidence = min(0.25 + score * 0.15, 0.95)

    return min(confidence * weight, 1.0)


def calculate_uncertainty(num_matches, has_intent_boost, num_ambiguous_matches):
    """
    Calculate uncertainty score for skill recommendation.

    Uncertainty measures "how much we don't know" - separate from confidence.
    High confidence + high uncertainty = "confident ignorance" (dangerous state).

    Formula factors:
    - Fewer matches = higher uncertainty (less evidence)
    - No intent boost = higher uncertainty (less clear intent)
    - More ambiguous matches = higher uncertainty (competing interpretations)

    Examples:
    - 5 matches, intent boost, 0 ambiguous: 0.15 (LOW - proceed)
    - 3 matches, intent boost, 1 ambiguous: 0.35 (LOW - proceed)
    - 1 match, no intent boost, 0 ambiguous: 0.55 (MEDIUM - verify)
    - 1 match, no intent boost, 2 ambiguous: 0.75 (HIGH - clarify)
    - 0 matches, no intent boost, 0 ambiguous: 0.85 (HIGH - clarify)

    Args:
        num_matches: Total number of keyword/corpus matches found.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
        num_ambiguous_matches: Count of MULTI_SKILL_BOOSTER matches (ambiguous keywords).

    Returns:
        float: Uncertainty score between 0.0 and 1.0
               <= 0.35: LOW (proceed)
               0.36-0.60: MEDIUM (verify first)
               > 0.60: HIGH (require clarification)
    """
    # Base uncertainty decreases with more matches
    if num_matches >= 5:
        base_uncertainty = 0.15
    elif num_matches >= 3:
        base_uncertainty = 0.25
    elif num_matches >= 1:
        base_uncertainty = 0.40
    else:
        base_uncertainty = 0.70

    # No intent boost increases uncertainty (less clear intent)
    intent_penalty = 0.0 if has_intent_boost else 0.15

    # Ambiguous matches increase uncertainty (competing interpretations)
    ambiguity_penalty = min(num_ambiguous_matches * 0.10, 0.30)

    uncertainty = min(base_uncertainty + intent_penalty + ambiguity_penalty, 1.0)
    return round(uncertainty, 2)


def passes_dual_threshold(confidence, uncertainty, conf_threshold=0.8, uncert_threshold=0.35):
    """
    Check if recommendation passes dual-threshold validation.

    READINESS = (confidence >= threshold) AND (uncertainty <= uncert_threshold)

    Note on thresholds:
    - AGENTS.md Section 4 defines READINESS as: (confidence >= 0.70) AND (uncertainty <= 0.35)
    - Gate 3 skill routing uses conf_threshold=0.8 (stricter for routing decisions)
    - The uncertainty threshold of 0.35 matches AGENTS.md exactly

    Args:
        confidence: Confidence score (0.0-1.0)
        uncertainty: Uncertainty score (0.0-1.0)
        conf_threshold: Minimum confidence required (default 0.8 for skill routing)
        uncert_threshold: Maximum uncertainty allowed (default 0.35 per AGENTS.md)

    Returns:
        bool: True if both thresholds pass
    """
    return confidence >= conf_threshold and uncertainty <= uncert_threshold


def analyze_request(prompt):
    """Analyze user request and return ranked skill recommendations."""
    if not prompt:
        return []

    prompt_lower = prompt.lower()

    # Tokenize: extract words
    all_tokens = re.findall(r'\b\w+\b', prompt_lower)

    # Pre-calculate intent boosts from ALL original tokens BEFORE stop word filtering
    # This is critical because question words (how, why, what) and "work/does" are
    # important signals for semantic search but would be filtered as stop words
    skill_boosts = {}
    boost_reasons = {}
    for token in all_tokens:
        # Single-skill boosters
        if token in INTENT_BOOSTERS:
            skill, boost = INTENT_BOOSTERS[token]
            skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
            if skill not in boost_reasons:
                boost_reasons[skill] = []
            boost_reasons[skill].append(f"!{token}")

        # Multi-skill boosters (ambiguous keywords that boost multiple skills)
        if token in MULTI_SKILL_BOOSTERS:
            for skill, boost in MULTI_SKILL_BOOSTERS[token]:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{token}(multi)")

    # NOW filter stop words and short terms for corpus matching
    # This prevents "me", "help", "a" etc. from polluting description matches
    tokens = [t for t in all_tokens if t not in STOP_WORDS and len(t) > 2]

    # Handle empty tokens after filtering - but still allow if we have boosts
    if not tokens and not skill_boosts:
        return []

    # Expand query with synonyms (only for non-stop-word tokens)
    search_terms = expand_query(tokens) if tokens else []

    recommendations = []
    skills = get_skills()

    for name, config in skills.items():
        # Start with intent boost if any (from pre-calculated boosts)
        score = skill_boosts.get(name, 0)
        matches = boost_reasons.get(name, []).copy()

        # Prepare skill keywords from name and description
        name_parts = name.replace('-', ' ').split()
        desc_parts = re.findall(r'\b\w+\b', config['description'].lower())

        # Build corpus (description terms only, name checked separately)
        corpus = set(desc_parts)
        corpus = {k for k in corpus if len(k) > 2 and k not in STOP_WORDS}

        # Also filter name_parts for stop words
        name_parts_filtered = [p for p in name_parts if p not in STOP_WORDS and len(p) > 2]

        # Score each search term
        for term in search_terms:
            # Priority 1: Term matches skill NAME (highest value)
            if term in name_parts_filtered:
                score += 1.5
                matches.append(f"{term}(name)")
            # Priority 2: Exact match in description corpus
            elif term in corpus:
                score += 1.0
                matches.append(term)
            # Priority 3: Substring match (only for 4+ char terms to avoid false positives)
            elif len(term) >= 4:
                for corpus_word in corpus:
                    if len(corpus_word) >= 4 and (term in corpus_word or corpus_word in term):
                        score += 0.5
                        matches.append(f"{term}~")
                        break

        if score > 0:
            # Use the documented two-tiered confidence formula
            total_intent_boost = skill_boosts.get(name, 0)
            has_boost = total_intent_boost > 0
            confidence = calculate_confidence(
                score=score,
                has_intent_boost=has_boost,
                weight=config['weight']
            )

            # Calculate uncertainty (separate from confidence)
            num_matches = len(matches)
            num_ambiguous = sum(1 for m in matches if '(multi)' in m)
            uncertainty = calculate_uncertainty(
                num_matches=num_matches,
                has_intent_boost=has_boost,
                num_ambiguous_matches=num_ambiguous
            )

            # Check dual-threshold validation
            passes = passes_dual_threshold(confidence, uncertainty)

            recommendations.append({
                "skill": name,
                "confidence": round(confidence, 2),
                "uncertainty": uncertainty,
                "passes_threshold": passes,
                "reason": f"Matched: {', '.join(list(set(matches))[:5])}"
            })

    return sorted(recommendations, key=lambda x: x['confidence'], reverse=True)


def load_all_skills():
    """Load all skills for diagnostics."""
    skills = []
    if os.path.exists(SKILLS_DIR):
        for skill_file in glob.glob(os.path.join(SKILLS_DIR, "*/SKILL.md")):
            meta = parse_frontmatter(skill_file)
            if meta:
                skills.append(meta)
    return skills


def health_check():
    """Return skill count and status for diagnostics."""
    skills = load_all_skills()
    return {
        "status": "ok" if skills else "error",
        "skills_found": len(skills),
        "skill_names": [s.get('name', 'unknown') for s in skills],
        "skills_dir": SKILLS_DIR,
        "skills_dir_exists": os.path.exists(SKILLS_DIR)
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Analyze user requests and recommend appropriate skills.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python skill_advisor.py "how does authentication work"
  python skill_advisor.py "create a git commit" --threshold 0.8
  python skill_advisor.py --health
        '''
    )
    parser.add_argument('prompt', nargs='?', default='',
                        help='User request to analyze')
    parser.add_argument('--health', action='store_true',
                        help='Run health check diagnostics')
    parser.add_argument('--threshold', type=float, default=0.0,
                        help='Confidence threshold for recommendations (default: 0.0, typical: 0.8)')
    parser.add_argument('--uncertainty', type=float, default=1.0,
                        help='Maximum uncertainty threshold for recommendations (default: 1.0, typical: 0.5)')
    parser.add_argument('--show-rejections', action='store_true',
                        help='Include recommendations that failed dual-threshold validation')

    args = parser.parse_args()

    if args.health:
        print(json.dumps(health_check(), indent=2))
        sys.exit(0)

    if not args.prompt:
        print(json.dumps([]))
        sys.exit(0)

    results = analyze_request(args.prompt)

    # Apply threshold filtering if specified
    if args.threshold > 0:
        results = [r for r in results if r['confidence'] >= args.threshold]

    # Apply uncertainty threshold filtering
    if args.uncertainty < 1.0:
        results = [r for r in results if r['uncertainty'] <= args.uncertainty]

    # Filter out rejections unless --show-rejections is set
    if not args.show_rejections:
        results = [r for r in results if r.get('passes_threshold', True)]

    print(json.dumps(results, indent=2))
