#!/usr/bin/env python3
"""
Skill Advisor - Analyzes user requests and recommends appropriate skills.
Used by Gate 2 in AGENTS.md for mandatory skill routing.

Usage: python skill_advisor.py "user request"
Output: JSON array of skill recommendations with confidence scores
"""
import sys
import json
import os
import re
import glob

# Path to skills directory (relative to project root)
PROJECT_ROOT = os.getcwd()
SKILLS_DIR = os.path.join(PROJECT_ROOT, ".opencode/skills")

# Comprehensive stop words - filtered from BOTH query AND corpus
# These words have no semantic meaning for skill matching
STOP_WORDS = {
    # Articles & pronouns
    'the', 'a', 'an', 'i', 'me', 'my', 'you', 'your', 'we', 'our', 'it', 'its',
    'he', 'she', 'they', 'them', 'him', 'her', 'us',
    # Prepositions
    'to', 'in', 'on', 'at', 'for', 'with', 'from', 'into', 'of', 'by', 'about',
    # Conjunctions
    'and', 'or', 'but', 'so', 'if', 'then', 'as',
    # Common auxiliary/modal verbs
    'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did',
    'can', 'could', 'will', 'would', 'should', 'may', 'might', 'must',
    # Non-semantic action words (requests/helpers)
    'want', 'need', 'help', 'please', 'let', 'get', 'try', 'go', 'going',
    # Demonstratives
    'this', 'that', 'these', 'those',
    # Quantifiers
    'some', 'any', 'all', 'no', 'not', 'more', 'most', 'other',
    # Question words (usually context, not intent)
    'how', 'what', 'when', 'where', 'which', 'who', 'why',
    # Fillers
    'just', 'also', 'very', 'really', 'actually', 'only', 'even', 'now',
    # Generic terms
    'use', 'using', 'used', 'like', 'thing', 'things', 'way', 'work',
    # Agent/tool noise
    'skill', 'agent', 'tool', 'run', 'show', 'tell', 'give', 'able'
}

# Synonym expansion - maps user intent to technical terms in SKILL.md
SYNONYM_MAP = {
    # Debugging/fixing
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "bug": ["debug", "error", "issue", "defect", "verification"],
    # Creation
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "make": ["implement", "build", "generate", "create"],
    "new": ["create", "implement", "scaffold", "generate"],
    # Testing/verification
    "test": ["verify", "validate", "check", "spec", "quality"],
    "check": ["verify", "validate", "test"],
    # Refactoring
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    # Documentation
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "write": ["documentation", "create", "generate"],
    # Search/exploration
    "search": ["find", "locate", "explore", "query", "lookup"],
    "find": ["search", "locate", "explore", "lookup"],
    # Planning
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    # Git operations - expanded for better git skill matching
    "commit": ["git", "version", "push", "branch", "changes"],
    "push": ["git", "commit", "remote", "branch"],
    "branch": ["git", "commit", "merge", "checkout"],
    "merge": ["git", "branch", "commit", "rebase"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    # Memory/context
    "save": ["context", "memory", "preserve", "store"],
    "remember": ["memory", "context", "save", "store"],
    "context": ["memory", "session", "save"],
    # Reverse mappings - domain-specific terms expand to parent domain
    "worktree": ["git", "branch", "workspace", "isolation"],
    "rebase": ["git", "branch", "commit", "history"],
    "stash": ["git", "changes", "temporary"],
    # DevTools reverse mappings
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "console": ["chrome", "browser", "debug", "log"],
    "network": ["chrome", "browser", "requests", "debug"],
    # Code analysis reverse mappings
    "ast": ["treesitter", "syntax", "parse", "structure"],
    # Natural language to technical terms
    "how": ["understand", "explain", "works", "meaning"],
    "what": ["definition", "structure", "outline", "list"],
    "where": ["find", "search", "locate", "navigate"],
    "show": ["list", "display", "outline", "tree"],
    "make": ["create", "implement", "build", "generate"],
    "help": ["guide", "assist", "documentation", "explain"],
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
    # Question word patterns - semantic search signals (checked before stop word filtering)
    # Combined "how does X work" pattern: 1.2 + 0.6 + 1.0 = 2.8 → 0.72 confidence
    # With "codebase" multi-boost: +0.4 → 3.2 → 0.78 confidence  
    "how": ("mcp-leann", 1.2),      # "how does X work" = strong semantic signal
    "why": ("mcp-leann", 1.5),      # "why is X happening" = strong semantic signal (often standalone)
    "what": ("mcp-leann", 1.0),     # "what does X do" = semantic query
    "explain": ("mcp-leann", 3.5),  # explicit explanation request - single word should route (3.5 * 0.15 + 0.3 = 0.825)
    "understand": ("mcp-leann", 1.5),
    "work": ("mcp-leann", 1.0),     # "how does X work" pattern - key word
    "works": ("mcp-leann", 1.0),    # same pattern
    "does": ("mcp-leann", 0.6),     # auxiliary in "how does X work"
    
    # Git workflow - very specific terms
    "commit": ("workflows-git", 0.5),
    "push": ("workflows-git", 0.5),
    "pull": ("workflows-git", 0.5),
    "branch": ("workflows-git", 0.4),
    "merge": ("workflows-git", 0.5),
    "rebase": ("workflows-git", 0.8),
    "worktree": ("workflows-git", 1.2),
    "stash": ("workflows-git", 0.5),
    "checkout": ("workflows-git", 0.5),
    
    # Documentation - specific terms
    "markdown": ("workflows-documentation", 0.5),
    "flowchart": ("workflows-documentation", 0.7),
    "ascii": ("workflows-documentation", 0.4),
    "diagram": ("workflows-documentation", 0.4),
    
    # Memory system - specific terms
    "checkpoint": ("system-memory", 0.6),
    "remember": ("system-memory", 0.5),
    "session": ("system-memory", 0.4),
    "restore": ("system-memory", 0.4),
    
    # Code search - specific terms  
    "semantic": ("mcp-leann", 0.5),
    "embeddings": ("mcp-leann", 0.7),
    "vector": ("mcp-leann", 0.6),
    "rag": ("mcp-leann", 0.6),
    
    # Chrome DevTools - specific terms
    "devtools": ("workflows-chrome-devtools", 1.2),
    "chrome": ("workflows-chrome-devtools", 1.0),
    "browser": ("workflows-chrome-devtools", 1.2),
    "debugger": ("workflows-chrome-devtools", 1.0),
    "debug": ("workflows-chrome-devtools", 1.0),
    "network": ("workflows-chrome-devtools", 0.8),
    "console": ("workflows-chrome-devtools", 1.0),
    "inspect": ("workflows-chrome-devtools", 1.0),
    
    # Spec kit - specific terms
    "checklist": ("system-spec-kit", 0.5),
    "specification": ("system-spec-kit", 0.5),
    
    # Code context - specific terms
    "symbols": ("mcp-code-context", 0.5),
    "definitions": ("mcp-code-context", 0.5),
    "treesitter": ("mcp-code-context", 0.7),
    "ast": ("mcp-code-context", 0.6),
    "functions": ("mcp-code-context", 0.4),
    "classes": ("mcp-code-context", 0.4),
    
    # mcp-leann - Additional terms
    "leann": ("mcp-leann", 1.0),
    "index": ("mcp-leann", 0.3),
    "ask": ("mcp-leann", 0.4),
    "query": ("mcp-leann", 0.4),
    
    # Semantic search keywords - authentication/auth is semantic understanding
    "auth": ("mcp-leann", 1.8),           # Authentication is semantic search
    "authentication": ("mcp-leann", 1.8),
    "login": ("mcp-leann", 0.8),
    "logout": ("mcp-leann", 0.6),
    "user": ("mcp-leann", 0.4),           # Often part of auth queries
    "password": ("mcp-leann", 0.5),
    "session": ("mcp-leann", 0.4),        # Auth-related (also in system-memory)
    
    # Natural language code search - structural (mcp-code-context)
    "structure": ("mcp-code-context", 0.5),
    "outline": ("mcp-code-context", 0.6),
    "tree": ("mcp-code-context", 0.5),
    "navigate": ("mcp-code-context", 0.4),
    "list": ("mcp-code-context", 0.3),
    
    # mcp-code-mode - External MCP tools (Webflow, Figma, ClickUp, etc.)
    # High boost values because these are strong domain signals
    "webflow": ("mcp-code-mode", 2.5),    # Strong signal - single word routes
    "figma": ("mcp-code-mode", 2.5),      # Strong signal
    "clickup": ("mcp-code-mode", 2.5),    # Strong signal
    "notion": ("mcp-code-mode", 2.5),     # Strong signal
    "external": ("mcp-code-mode", 0.4),
    "typescript": ("mcp-code-mode", 0.4),
    "utcp": ("mcp-code-mode", 0.8),
    "site": ("mcp-code-mode", 0.6),       # Webflow context
    "sites": ("mcp-code-mode", 0.6),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "component": ("mcp-code-mode", 0.4),
    "cms": ("mcp-code-mode", 0.5),        # Webflow CMS
    
    # workflows-code - Implementation and debugging
    "implement": ("workflows-code", 0.6),
    "bug": ("workflows-code", 0.5),
    "refactor": ("workflows-code", 0.6),
    "verification": ("workflows-code", 0.5),
    
    # system-spec-kit - Additional terms
    "spec": ("system-spec-kit", 0.6),
    "folder": ("system-spec-kit", 0.4),
    
    # system-memory - Additional terms
    "memory": ("system-memory", 0.6),
    "recall": ("system-memory", 0.5),
    "history": ("system-memory", 0.4),
    
    # workflows-git - Additional terms
    "pr": ("workflows-git", 0.6),
    "diff": ("workflows-git", 0.5),
    "log": ("workflows-git", 0.4),
    
    # mcp-leann - Additional terms
    "ask": ("mcp-leann", 0.4),
    "query": ("mcp-leann", 0.4),
    
    # mcp-code-context - Additional terms
    "methods": ("mcp-code-context", 0.4),
    "exports": ("mcp-code-context", 0.4),
    "imports": ("mcp-code-context", 0.4),
    
    # workflows-chrome-devtools - Additional terms
    "bdg": ("workflows-chrome-devtools", 1.0),
    "screenshot": ("workflows-chrome-devtools", 0.5),
    "dom": ("workflows-chrome-devtools", 0.5),
    "css": ("workflows-chrome-devtools", 0.4),
    
    # workflows-documentation - Additional terms
    "document": ("workflows-documentation", 0.5),
    "readme": ("workflows-documentation", 0.5),
    "template": ("workflows-documentation", 0.4),
    "flowchart": ("workflows-documentation", 0.6),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "codebase": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "search": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "code": [("workflows-code", 0.2), ("mcp-code-context", 0.15), ("mcp-leann", 0.1)],
    "find": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "fix": [("workflows-code", 0.3), ("workflows-git", 0.1)],
    "test": [("workflows-code", 0.3), ("workflows-chrome-devtools", 0.2)],
    "save": [("system-memory", 0.3), ("workflows-git", 0.2)],
    "context": [("system-memory", 0.3), ("mcp-code-context", 0.2)],
    "plan": [("system-spec-kit", 0.3), ("workflows-code", 0.2)],
    "api": [("mcp-code-mode", 0.3), ("mcp-leann", 0.2)],
    "mcp": [("mcp-code-mode", 0.3), ("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    # Common action words
    "update": [("mcp-code-mode", 0.3), ("workflows-git", 0.2), ("workflows-code", 0.2)],
    "changes": [("workflows-git", 0.4), ("system-memory", 0.2)],
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
    except Exception:
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
            # Two-tiered confidence formula:
            # - With intent boost: higher confidence (strong domain signal)
            # - Without intent boost: conservative (corpus matches only)
            total_intent_boost = skill_boosts.get(name, 0)
            
            if total_intent_boost > 0:
                # Intent booster matched - higher confidence curve
                # score=2 → 0.80, score=3 → 0.95 (capped)
                confidence = min(0.50 + score * 0.15, 0.95)
            else:
                # No explicit boosters - conservative (corpus matches only)
                # score=2 → 0.55, score=3 → 0.70, score=4 → 0.85
                confidence = min(0.25 + score * 0.15, 0.95)
            
            confidence = min(confidence * config['weight'], 1.0)
            
            recommendations.append({
                "skill": name,
                "confidence": round(confidence, 2),
                "reason": f"Matched: {', '.join(list(set(matches))[:5])}"
            })

    return sorted(recommendations, key=lambda x: x['confidence'], reverse=True)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
        
    prompt = sys.argv[1]
    results = analyze_request(prompt)
    
    print(json.dumps(results, indent=2))
