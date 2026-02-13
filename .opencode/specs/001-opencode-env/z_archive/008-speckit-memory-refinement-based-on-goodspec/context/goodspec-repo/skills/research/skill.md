---
name: research
description: Research technologies, patterns, and best practices
category: core
triggers:
  - research
  - investigate
  - explore
  - learn
version: 0.1.0
requires:
  - goop-core
---

# Research Skill

## Research Methodology

### 1. Define Scope
What specific question needs answering?

### 2. Identify Sources
- Official documentation (Context7)
- Community resources (Exa search)
- Example repositories
- Expert articles

### 3. Gather Information
- Use multiple sources
- Note contradictions
- Track source reliability

### 4. Synthesize Findings
- Identify patterns
- Extract actionable recommendations
- Flag uncertainties

### 5. Document Results
Create RESEARCH.md with findings.

## Research Tools

### Context7 (Official Docs)
```typescript
// Resolve library ID first
context7_resolve_library_id({
  query: "how to implement auth in Next.js",
  libraryName: "next.js"
})

// Query documentation
context7_query_docs({
  libraryId: "/vercel/next.js",
  query: "authentication middleware"
})
```

### Exa Search (Web)
```typescript
web_search_exa({
  query: "Next.js authentication best practices 2024",
  numResults: 5
})
```

### Web Fetch (Deep Dive)
```typescript
webfetch({
  url: "https://example.com/article",
  format: "markdown"
})
```

## Research Areas

### Stack Discovery
- Core libraries and frameworks
- Build tools and bundlers
- Testing frameworks
- Development tools

### Architecture Patterns
- Common patterns for domain
- Best practices
- Project structure conventions

### Pitfalls
- Common mistakes
- Performance issues
- Security vulnerabilities
- Maintenance traps

### Expert Resources
- Official documentation
- Community guides
- Reference implementations

## RESEARCH.md Template

```markdown
# Research: {Topic}

**Domain:** {Technology area}
**Date:** {YYYY-MM-DD}
**Sources:** {Count} analyzed

## Executive Summary
{2-3 sentences on key findings}

## Standard Stack

| Category | Recommended | Alternatives | Notes |
|----------|-------------|--------------|-------|
| Framework | Next.js | Remix, SvelteKit | SSR support |
| Auth | NextAuth | Clerk, Auth0 | Built-in |

## Architecture Patterns

### Recommended: {Pattern Name}
{Description and when to use}

## Common Pitfalls

1. **{Issue}** - {Description}
   - Prevention: {How to avoid}

## Expert Resources

- [Official Docs]({url}) - {description}
- [Guide]({url}) - {description}

## Recommendations

### Must Use
- {Technology} - {Rationale}

### Avoid
- {Technology} - {Why}

## Uncertainties
- {Question needing clarification}
```

## Parallel Research

Spawn multiple researchers for different aspects:

```
Researcher 1: Stack Discovery
Researcher 2: Architecture Patterns
Researcher 3: Pitfalls & Gotchas
Researcher 4: Expert Resources
```

## Best Practices

1. **Cite sources** - Every claim has a source
2. **Note dates** - Technology changes fast
3. **Flag uncertainty** - Be honest about gaps
4. **Actionable findings** - Recommendations, not just facts
5. **Time-box** - 30-60 minutes typical, 2 hours max
