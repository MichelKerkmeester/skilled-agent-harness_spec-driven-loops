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
    "ast": ["treesitter", "syntax", "parse", "structure"],
    "branch": ["git", "commit", "merge", "checkout"],
    "bug": ["debug", "error", "issue", "defect", "verification"],
    "check": ["verify", "validate", "test"],
    "commit": ["git", "version", "push", "branch", "changes"],
    "console": ["chrome", "browser", "debug", "log"],
    "context": ["memory", "session", "save"],
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "find": ["search", "locate", "explore", "lookup"],
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    "help": ["guide", "assist", "documentation", "explain"],
    "how": ["understand", "explain", "works", "meaning"],
    "make": ["create", "implement", "build", "generate"],
    "merge": ["git", "branch", "commit", "rebase"],
    "network": ["chrome", "browser", "requests", "debug"],
    "new": ["create", "implement", "scaffold", "generate"],
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    "push": ["git", "commit", "remote", "branch"],
    "rebase": ["git", "branch", "commit", "history"],
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    "remember": ["memory", "context", "save", "store"],
    "save": ["context", "memory", "preserve", "store"],
    "search": ["find", "locate", "explore", "query", "lookup"],
    "show": ["list", "display", "outline", "tree"],
    "stash": ["git", "changes", "temporary"],
    "test": ["verify", "validate", "check", "spec", "quality"],
    "what": ["definition", "structure", "outline", "list"],
    "where": ["find", "search", "locate", "navigate"],
    "worktree": ["git", "branch", "workspace", "isolation"],
    "write": ["documentation", "create", "generate"],
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
    "ascii": ("workflows-documentation", 0.4),
    "ask": ("mcp-leann", 0.4),
    "ast": ("mcp-code-context", 0.6),
    "auth": ("mcp-leann", 1.8),
    "authentication": ("mcp-leann", 1.8),
    "bdg": ("workflows-chrome-devtools", 1.0),
    "branch": ("workflows-git", 0.4),
    "browser": ("workflows-chrome-devtools", 1.2),
    "bug": ("workflows-code", 0.5),
    "checklist": ("system-spec-kit", 0.5),
    "checkpoint": ("system-memory", 0.6),
    "checkout": ("workflows-git", 0.5),
    "chrome": ("workflows-chrome-devtools", 1.0),
    "classes": ("mcp-code-context", 0.4),
    "clickup": ("mcp-code-mode", 2.5),
    "cms": ("mcp-code-mode", 0.5),
    "commit": ("workflows-git", 0.5),
    "component": ("mcp-code-mode", 0.4),
    "console": ("workflows-chrome-devtools", 1.0),
    "css": ("workflows-chrome-devtools", 0.4),
    "debug": ("workflows-chrome-devtools", 1.0),
    "debugger": ("workflows-chrome-devtools", 1.0),
    "definitions": ("mcp-code-context", 0.5),
    "devtools": ("workflows-chrome-devtools", 1.2),
    "diagram": ("workflows-documentation", 0.4),
    "diff": ("workflows-git", 0.5),
    "does": ("mcp-leann", 0.6),
    "dom": ("workflows-chrome-devtools", 0.5),
    "document": ("workflows-documentation", 0.5),
    "embeddings": ("mcp-leann", 0.7),
    "explain": ("mcp-leann", 3.5),
    "exports": ("mcp-code-context", 0.4),
    "external": ("mcp-code-mode", 0.4),
    "figma": ("mcp-code-mode", 2.5),
    "flowchart": ("workflows-documentation", 0.7),
    "folder": ("system-spec-kit", 0.4),
    "functions": ("mcp-code-context", 0.4),
    "gh": ("workflows-git", 1.5),
    "github": ("workflows-git", 2.0),
    "history": ("system-memory", 0.4),
    "how": ("mcp-leann", 1.2),
    "implement": ("workflows-code", 0.6),
    "imports": ("mcp-code-context", 0.4),
    "index": ("mcp-leann", 0.3),
    "inspect": ("workflows-chrome-devtools", 1.0),
    "issue": ("workflows-git", 0.8),
    "leann": ("mcp-leann", 1.0),
    "list": ("mcp-code-context", 0.3),
    "log": ("workflows-git", 0.4),
    "login": ("mcp-leann", 0.8),
    "logout": ("mcp-leann", 0.6),
    "markdown": ("workflows-documentation", 0.5),
    "memory": ("system-memory", 0.6),
    "merge": ("workflows-git", 0.5),
    "methods": ("mcp-code-context", 0.4),
    "navigate": ("mcp-code-context", 0.4),
    "network": ("workflows-chrome-devtools", 0.8),
    "notion": ("mcp-code-mode", 2.5),
    "outline": ("mcp-code-context", 0.6),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "password": ("mcp-leann", 0.5),
    "pr": ("workflows-git", 0.8),
    "pull": ("workflows-git", 0.5),
    "push": ("workflows-git", 0.5),
    "query": ("mcp-leann", 0.4),
    "rag": ("mcp-leann", 0.6),
    "readme": ("workflows-documentation", 0.5),
    "rebase": ("workflows-git", 0.8),
    "recall": ("system-memory", 0.5),
    "refactor": ("workflows-code", 0.6),
    "remember": ("system-memory", 0.5),
    "repo": ("workflows-git", 0.6),
    "restore": ("system-memory", 0.4),
    "review": ("workflows-git", 0.8),
    "screenshot": ("workflows-chrome-devtools", 0.5),
    "semantic": ("mcp-leann", 0.5),
    "site": ("mcp-code-mode", 0.6),
    "sites": ("mcp-code-mode", 0.6),
    "spec": ("system-spec-kit", 0.6),
    "specification": ("system-spec-kit", 0.5),
    "stash": ("workflows-git", 0.5),
    "structure": ("mcp-code-context", 0.5),
    "symbols": ("mcp-code-context", 0.5),
    "template": ("workflows-documentation", 0.4),
    "tree": ("mcp-code-context", 0.5),
    "treesitter": ("mcp-code-context", 0.7),
    "typescript": ("mcp-code-mode", 0.4),
    "understand": ("mcp-leann", 1.5),
    "user": ("mcp-leann", 0.4),
    "utcp": ("mcp-code-mode", 0.8),
    "vector": ("mcp-leann", 0.6),
    "verification": ("workflows-code", 0.5),
    "webflow": ("mcp-code-mode", 2.5),
    "what": ("mcp-leann", 1.0),
    "why": ("mcp-leann", 1.5),
    "work": ("mcp-leann", 1.0),
    "works": ("mcp-leann", 1.0),
    "worktree": ("workflows-git", 1.2),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.3), ("mcp-leann", 0.2)],
    "changes": [("workflows-git", 0.4), ("system-memory", 0.2)],
    "code": [("workflows-code", 0.2), ("mcp-code-context", 0.15), ("mcp-leann", 0.1)],
    "codebase": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "context": [("system-memory", 0.3), ("mcp-code-context", 0.2)],
    "find": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "fix": [("workflows-code", 0.3), ("workflows-git", 0.1)],
    "mcp": [("mcp-code-mode", 0.3), ("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "plan": [("system-spec-kit", 0.3), ("workflows-code", 0.2)],
    "save": [("system-memory", 0.3), ("workflows-git", 0.2)],
    "search": [("mcp-leann", 0.2), ("mcp-code-context", 0.2)],
    "session": [("system-memory", 0.4), ("mcp-leann", 0.4)],
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
    if len(sys.argv) > 1 and sys.argv[1] == "--health":
        print(json.dumps(health_check(), indent=2))
        sys.exit(0)
    
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
        
    prompt = sys.argv[1]
    results = analyze_request(prompt)
    
    print(json.dumps(results, indent=2))