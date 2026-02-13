---
name: documentation
description: Write technical documentation and guides
category: documentation
triggers:
  - document
  - readme
  - api
  - guide
version: 0.1.0
requires:
  - goop-core
---

# Documentation Skill

## Documentation Types

### README.md
Project overview, quick start, basic usage.

### API Documentation
Endpoints, parameters, responses, examples.

### Architecture Documentation
System design, patterns, decisions.

### User Guides
How-to guides, tutorials, walkthroughs.

### Developer Guides
Setup, contribution, debugging.

## README Structure

```markdown
# Project Name

Brief description (1-2 sentences)

## Features
- Feature 1
- Feature 2

## Quick Start

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`typescript
import { thing } from 'project-name';
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option | string | "default" | What it does |

## API Reference

### functionName(param)

Description of function.

**Parameters:**
- `param` (type) - description

**Returns:** type - description

## Contributing
See CONTRIBUTING.md

## License
MIT
```

## API Documentation

### Endpoint Documentation
```markdown
## POST /api/users

Create a new user.

### Request

**Headers:**
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |

**Body:**
\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe"
}
\`\`\`

### Response

**Success (201):**
\`\`\`json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe"
}
\`\`\`

**Error (400):**
\`\`\`json
{
  "error": "Invalid email format"
}
\`\`\`
```

## Code Documentation

### JSDoc/TSDoc
```typescript
/**
 * Creates a new user in the system.
 * 
 * @param data - User creation data
 * @param data.email - User's email address
 * @param data.name - User's display name
 * @returns The created user object
 * @throws {ValidationError} If email is invalid
 * 
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 * ```
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // ...
}
```

## Architecture Decision Records

```markdown
# ADR-001: Use PostgreSQL for primary database

## Status
Accepted

## Context
Need a reliable database for user data and transactions.

## Decision
Use PostgreSQL with Prisma ORM.

## Consequences
- Pros: ACID compliance, rich feature set
- Cons: Operational complexity, scaling limits
```

## Documentation Best Practices

### Do
- Write for your audience
- Include examples
- Keep it up to date
- Use consistent formatting
- Start with the most important info

### Don't
- Assume prior knowledge
- Write walls of text
- Document obvious things
- Leave TODO comments
- Duplicate information

## Documentation Tools

```bash
# Generate API docs from JSDoc
npx typedoc src/index.ts

# Generate from OpenAPI spec
npx @redocly/cli build-docs openapi.yaml

# Markdown linting
npx markdownlint "**/*.md"
```

## Documentation Review Checklist

- [ ] Accurate and up to date
- [ ] Clear and concise
- [ ] Includes examples
- [ ] Proper formatting
- [ ] No broken links
- [ ] Spell checked
- [ ] Reviewed by someone unfamiliar

## When to Document

1. **New feature** - Add usage docs
2. **API change** - Update API docs
3. **Decision made** - Add ADR
4. **Bug fixed** - Update troubleshooting
5. **Process changed** - Update guides
