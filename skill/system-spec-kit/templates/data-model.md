# Data Model: [YOUR_VALUE_HERE: feature-name] - Entity & Schema Documentation

Data structure documentation defining entities, relationships, and schema specifications.

<!-- SPECKIT_TEMPLATE_SOURCE: data-model | v1.0 -->

---

## 1. METADATA

- **Model ID**: DATA-[FORMAT: ###]
- **Version**: [FORMAT: X.Y.Z - example: 1.0.0]
- **Status**: [NEEDS CLARIFICATION: What is the model status? (a) Draft - initial design (b) Approved - ready for implementation (c) Implemented - in production (d) Deprecated - being phased out]
- **Date Created**: [FORMAT: YYYY-MM-DD]
- **Last Updated**: [FORMAT: YYYY-MM-DD]
- **Author(s)**: [YOUR_VALUE_HERE: names/roles]
- **Reviewers**: [YOUR_VALUE_HERE: names/roles]

**Related Documents**:
- Spec: [OPTIONAL: link to spec.md if applicable]
- Plan: [OPTIONAL: link to plan.md if applicable]
- API Contract: [OPTIONAL: link to api-contract.md if applicable]

---

## 2. OVERVIEW

### Purpose
[YOUR_VALUE_HERE: describe the purpose of this data model - what problem does it solve? What data does it organize?]

### Scope
[YOUR_VALUE_HERE: what entities and data are covered by this model]

### Key Design Decisions
- [YOUR_VALUE_HERE: decision 1 - example: Using UUIDs instead of auto-increment IDs for distributed systems]
- [YOUR_VALUE_HERE: decision 2 - example: Soft deletes with deleted_at timestamp]
- [YOUR_VALUE_HERE: decision 3 - example: Denormalized user_name for read performance]

---

## 3. ENTITY DEFINITIONS

### Entity 1: [YOUR_VALUE_HERE: EntityName]

**Description**: [What this entity represents]

**Table/Collection Name**: `[YOUR_VALUE_HERE: table_name]`

#### Fields

| Field | Type | Required | Default | Description | Constraints |
|-------|------|----------|---------|-------------|-------------|
| id | [UUID/INT/STRING] | Yes | auto | Primary identifier | Primary Key |
| [field_1] | [type] | Yes/No | [default] | [Description] | [Constraints] |
| [field_2] | [type] | Yes/No | [default] | [Description] | [Constraints] |
| [field_3] | [type] | Yes/No | [default] | [Description] | [Constraints] |
| created_at | TIMESTAMP | Yes | NOW() | Creation timestamp | Immutable |
| updated_at | TIMESTAMP | Yes | NOW() | Last update timestamp | Auto-updated |
| [deleted_at] | TIMESTAMP | No | NULL | Soft delete timestamp | [OPTIONAL] |

#### Indexes

| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| pk_[table] | id | Primary | Primary key lookup |
| idx_[table]_[field] | [field] | B-tree | [Purpose] |
| idx_[table]_[fields] | [field1, field2] | Composite | [Purpose] |

#### Constraints

| Constraint | Type | Definition | Error Message |
|------------|------|------------|---------------|
| [name] | Unique | [field(s)] | [Message] |
| [name] | Check | [condition] | [Message] |
| [name] | Foreign Key | [reference] | [Message] |

---

### Entity 2: [YOUR_VALUE_HERE: EntityName]

**Description**: [What this entity represents]

**Table/Collection Name**: `[YOUR_VALUE_HERE: table_name]`

#### Fields

| Field | Type | Required | Default | Description | Constraints |
|-------|------|----------|---------|-------------|-------------|
| id | [UUID/INT/STRING] | Yes | auto | Primary identifier | Primary Key |
| [field_1] | [type] | Yes/No | [default] | [Description] | [Constraints] |
| [field_2] | [type] | Yes/No | [default] | [Description] | [Constraints] |
| created_at | TIMESTAMP | Yes | NOW() | Creation timestamp | Immutable |
| updated_at | TIMESTAMP | Yes | NOW() | Last update timestamp | Auto-updated |

#### Indexes

| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| pk_[table] | id | Primary | Primary key lookup |

---

### Entity 3: [YOUR_VALUE_HERE: EntityName]

**Description**: [What this entity represents]

**Table/Collection Name**: `[YOUR_VALUE_HERE: table_name]`

#### Fields

| Field | Type | Required | Default | Description | Constraints |
|-------|------|----------|---------|-------------|-------------|
| id | [UUID/INT/STRING] | Yes | auto | Primary identifier | Primary Key |
| [field_1] | [type] | Yes/No | [default] | [Description] | [Constraints] |

[OPTIONAL: Add more entities as needed]

---

## 4. RELATIONSHIPS

### Entity Relationship Diagram

```
[YOUR_VALUE_HERE: ASCII diagram showing entity relationships]

Example:
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Order    │       │   Product   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──────<│ user_id (FK)│       │ id (PK)     │
│ email       │       │ id (PK)     │>──────│ name        │
│ name        │       │ status      │       │ price       │
└─────────────┘       │ total       │       └─────────────┘
                      └─────────────┘
                            │
                            │
                      ┌─────────────┐
                      │ OrderItem   │
                      ├─────────────┤
                      │ order_id(FK)│
                      │ product_id  │
                      │ quantity    │
                      └─────────────┘

Legend: ──< (one-to-many) >──< (many-to-many) ─── (one-to-one)
```

### Relationship Definitions

| Relationship | From Entity | To Entity | Type | Description |
|--------------|-------------|-----------|------|-------------|
| [name] | [Entity A] | [Entity B] | 1:N | [Description] |
| [name] | [Entity B] | [Entity C] | N:M | [Description - via junction table] |
| [name] | [Entity A] | [Entity D] | 1:1 | [Description] |

### Foreign Key Definitions

| FK Name | Source Table | Source Column | Target Table | Target Column | On Delete | On Update |
|---------|--------------|---------------|--------------|---------------|-----------|-----------|
| fk_[name] | [table] | [column] | [table] | [column] | CASCADE/SET NULL/RESTRICT | CASCADE/RESTRICT |

---

## 5. FIELD DESCRIPTIONS

### Field Type Reference

| Type Alias | Database Type | Language Type | Description |
|------------|---------------|---------------|-------------|
| UUID | UUID/CHAR(36) | string | Universally unique identifier |
| STRING | VARCHAR(255) | string | Variable-length text |
| TEXT | TEXT | string | Long-form text |
| INT | INTEGER | number | 32-bit integer |
| BIGINT | BIGINT | number | 64-bit integer |
| DECIMAL | DECIMAL(10,2) | number | Fixed-point decimal |
| BOOLEAN | BOOLEAN | boolean | True/false value |
| TIMESTAMP | TIMESTAMP | Date | Date and time |
| JSON | JSONB/JSON | object | Structured JSON data |
| ENUM | ENUM/VARCHAR | string | Enumerated values |

### Enumerated Values

#### [YOUR_VALUE_HERE: EnumName]
Used by: `[table.field]`

| Value | Label | Description |
|-------|-------|-------------|
| [value_1] | [Label 1] | [Description] |
| [value_2] | [Label 2] | [Description] |
| [value_3] | [Label 3] | [Description] |

---

## 6. CONSTRAINTS

### Business Rules

| Rule ID | Description | Enforcement | Error Message |
|---------|-------------|-------------|---------------|
| BR-001 | [YOUR_VALUE_HERE: business rule - example: Order total must equal sum of items] | Database/Application | [Message] |
| BR-002 | [YOUR_VALUE_HERE: business rule] | Database/Application | [Message] |

### Validation Rules

| Field | Validation | Example Valid | Example Invalid |
|-------|------------|---------------|-----------------|
| [entity.field] | [Rule - example: email format] | user@example.com | not-an-email |
| [entity.field] | [Rule - example: min length 8] | "password123" | "short" |
| [entity.field] | [Rule - example: positive number] | 100 | -5 |

### Uniqueness Constraints

| Constraint | Table | Fields | Scope |
|------------|-------|--------|-------|
| [name] | [table] | [field(s)] | Global/Per-tenant/etc. |

---

## 7. EXAMPLE DATA

### Seed Data

**[Entity 1]**:
```json
[
  {
    "id": "[example-uuid-1]",
    "field_1": "[example value]",
    "field_2": "[example value]",
    "created_at": "2024-01-15T10:00:00Z"
  },
  {
    "id": "[example-uuid-2]",
    "field_1": "[example value]",
    "field_2": "[example value]",
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

**[Entity 2]**:
```json
[
  {
    "id": "[example-uuid-3]",
    "field_1": "[example value]",
    "entity_1_id": "[example-uuid-1]",
    "created_at": "2024-01-15T12:00:00Z"
  }
]
```

### Test Fixtures

**Happy Path**:
```json
{
  "description": "[Valid complete record]",
  "data": {
    "field_1": "[valid value]",
    "field_2": "[valid value]"
  }
}
```

**Edge Cases**:
```json
{
  "description": "[Minimum valid record]",
  "data": {
    "field_1": "[minimum valid value]"
  }
}
```

**Invalid Cases**:
```json
{
  "description": "[Missing required field]",
  "data": {
    "field_2": "[value without required field_1]"
  },
  "expected_error": "[Error message]"
}
```

---

## 8. MIGRATION NOTES

### Schema Changes

#### Version [X.Y.Z] -> [X.Y.Z+1]

**Migration ID**: [FORMAT: YYYYMMDDHHMMSS]

**Changes**:
- [ ] ADD COLUMN: [table.column] ([type], [default])
- [ ] DROP COLUMN: [table.column]
- [ ] MODIFY COLUMN: [table.column] ([old type] -> [new type])
- [ ] ADD INDEX: [index_name] ON [table(columns)]
- [ ] ADD CONSTRAINT: [constraint_name]

**Migration Script**:
```sql
-- Up migration
[SQL statements for applying changes]

-- Down migration (rollback)
[SQL statements for reverting changes]
```

**Data Migration**:
```sql
-- Data transformation required
[SQL statements for data migration]
```

**Risks**:
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

**Rollback Plan**:
[YOUR_VALUE_HERE: how to safely rollback if migration fails]

---

### Breaking Changes

| Version | Change | Impact | Migration Required |
|---------|--------|--------|-------------------|
| [version] | [Change description] | [Who/what is affected] | Yes/No |

### Backward Compatibility

[YOUR_VALUE_HERE: describe how backward compatibility is maintained, or what breaking changes exist]

---

## 9. PERFORMANCE CONSIDERATIONS

### Query Patterns

| Pattern | Frequency | Expected Query | Index Used |
|---------|-----------|----------------|------------|
| [Pattern 1] | High/Medium/Low | `SELECT ... WHERE ...` | [index_name] |
| [Pattern 2] | High/Medium/Low | `SELECT ... JOIN ...` | [index_name] |

### Optimization Notes

- [YOUR_VALUE_HERE: optimization 1 - example: Denormalized user_name to avoid JOIN on read-heavy queries]
- [YOUR_VALUE_HERE: optimization 2 - example: Partitioned by date for large tables]
- [YOUR_VALUE_HERE: optimization 3 - example: Cached frequently-accessed lookup tables]

### Scaling Considerations

- **Read scaling**: [Strategy - example: Read replicas, caching]
- **Write scaling**: [Strategy - example: Sharding, partitioning]
- **Storage growth**: [Estimate - example: ~1GB/month at current growth rate]

---

## 10. SECURITY & PRIVACY

### Sensitive Fields

| Table | Field | Sensitivity | Encryption | Access Control |
|-------|-------|-------------|------------|----------------|
| [table] | [field] | PII/Financial/Secret | At-rest/In-transit/None | [Who can access] |

### Data Retention

| Entity | Retention Period | Deletion Strategy | Legal Basis |
|--------|-----------------|-------------------|-------------|
| [entity] | [period] | Hard delete/Soft delete/Archive | [Reason - GDPR, business, etc.] |

### Audit Requirements

[YOUR_VALUE_HERE: what audit logging is required for this data model]
- [ ] Track all modifications with user/timestamp
- [ ] Log access to sensitive fields
- [ ] Maintain audit trail for [X] years

---

## WHEN TO USE THIS TEMPLATE

**Use data-model.md when:**
- Designing database schema for new features
- Documenting existing data structures for reference
- Planning data migrations or schema changes
- Sharing data structure with API developers
- Need clear entity-relationship documentation

**Do NOT use when:**
- Temporary data structures (use code comments)
- API request/response schemas only (use api-contract.md)
- Single-entity simple CRUD (may be overkill)

**Related templates:**
- Reference from plan.md for data layer planning
- Use alongside api-contract.md for full API + data documentation
- Update when decision-record.md documents schema decisions

---

<!--
  DATA MODEL TEMPLATE - ENTITY & SCHEMA DOCUMENTATION
  - Define entities with full field specifications
  - Document relationships and constraints
  - Provide example data for testing
  - Include migration notes for schema evolution
-->
