---
title: Transformation Pattern Catalog - 16 AI-Friendly Doc Patterns
description: The full before/after catalog of the 16 transformation patterns for converting reference-style docs into question-answering format.
trigger_phrases:
  - "transformation pattern catalog"
  - "before after doc patterns"
  - "api reference to usage example"
  - "16 optimization patterns"
importance_tier: normal
contextType: implementation
version: 1.8.0.1
---

# Transformation Pattern Catalog

The full before/after catalog for the 16 transformation patterns. `SKILL.md` §3 Step 3 names all 16 and tells you when to apply each; this file is the worked-example overflow — the concrete before/after code for every pattern. Load it only when you need the exact transform shape.

For the surrounding procedure (heuristics, analysis workflow, README strategy, iteration), see [optimization.md](./optimization.md).

---

## 1. OVERVIEW

This file is the worked-example catalog for the 16 transformation patterns that convert reference-style documentation into question-answering format — each entry pairs a before/after code sample with its impact and effort rating.

---

## Pattern 1: API Reference → Usage Example

**Impact**: High
**Effort**: Medium

**Before**:
```
Client.authenticate(api_key: str) -> bool
Parameters: api_key (str)
Returns: bool
```

**After**:
```
Authenticating Your Client
```python
from library import Client

client = Client(api_key="your_key")
if client.authenticate():
    print("Authenticated!")
```
```

## Pattern 2: Import-Only → Complete Setup

**Impact**: High
**Effort**: Low

**Before**:
```python
from library import Client, Query
```

**After**:
```
Quick Start
```python
# Install: pip install library
from library import Client

client = Client(api_key="key")
response = client.query("SELECT * FROM data")
for row in response:
    print(row)
```
```

## Pattern 3: Multiple Small → One Comprehensive

**Impact**: Medium
**Effort**: Medium

**Before** (3 separate snippets):
```python
client = Client()
client.connect()
client.query("SELECT *")
```

**After** (1 complete workflow):
```python
from library import Client

# Initialize and connect
client = Client(api_key="key", region="us-west-2")
client.connect()

# Execute query
result = client.query("SELECT * FROM users")
for row in result:
    print(row)

# Close connection
client.close()
```

## Pattern 4: Remove Metadata

**Impact**: Low
**Effort**: Low

**Delete entirely**:
- Project directory structures
- License text (link to LICENSE file instead)
- Academic citations
- Contributor lists (move to CONTRIBUTORS.md)

## Pattern 5: Add Error Handling

**Impact**: Medium
**Effort**: Medium

**Enhance existing examples**:
```python
try:
    client.connect()
    results = client.query("SELECT *")
except TimeoutError:
    print("Query timed out")
except AuthError:
    print("Check API key")
finally:
    client.close()
```

## Pattern 6: Combine Installation + First Usage

**Impact**: High
**Effort**: Low

**Never show installation alone** - always include immediate usage:
```python
# Install: pip install library
from library import Client

# First request
client = Client(api_key="key")
result = client.get_data()
print(result)
```

## Pattern 7: Add Configuration Examples

**Impact**: Medium
**Effort**: Low

**Show common config scenarios**:
```python
# Development config
client = Client(
    api_key="dev_key",
    environment="staging",
    debug=True
)

# Production config
client = Client(
    api_key="prod_key",
    environment="production",
    timeout=30,
    retries=3
)
```

## Pattern 8: Demonstrate OAuth/Auth Patterns

**Impact**: High (auth-heavy docs)
**Effort**: High

**Complete auth flow**:
```python
# OAuth flow
client = Client(client_id="id", client_secret="secret")
auth_url = client.get_auth_url("callback_url")
# User visits auth_url
tokens = client.exchange_code(auth_code)
client.connect()
```

## Pattern 9: Show Batch/Bulk Operations

**Impact**: Medium
**Effort**: Medium

**Performance-optimized patterns**:
```python
# Batch insert for better performance
users = [
    {"name": "Alice", "email": "alice@ex.com"},
    {"name": "Bob", "email": "bob@ex.com"}
]
result = client.batch_insert("users", users)
print(f"Inserted {result.count} users")
```

## Pattern 10: Add Testing Examples

**Impact**: Low-Medium
**Effort**: Medium

**Show how to test code using library**:
```python
import unittest
from library import Client

class TestClient(unittest.TestCase):
    def test_connection(self):
        client = Client(api_key="test_key")
        self.assertTrue(client.connect())
```

## Pattern 11: Provide Advanced Use Cases

**Impact**: High
**Effort**: High

**Complex real-world scenarios**:
```python
# Advanced: Streaming large datasets
client = Client(api_key="key")
for chunk in client.query_stream("SELECT * FROM large_table"):
    process(chunk)
    # Process incrementally, avoid memory issues
```

## Pattern 12: Add Integration Examples

**Impact**: Medium-High
**Effort**: Medium

**Show integration with popular tools**:
```python
# Integration with pandas
import pandas as pd
from library import Client

client = Client(api_key="key")
data = client.query("SELECT * FROM users")
df = pd.DataFrame(data)
print(df.head())
```

## Pattern 13: Clarify Common Pitfalls

**Impact**: Medium
**Effort**: Low

**Prevent common mistakes**:
```python
# Correct: Close connection in finally
try:
    client.connect()
    data = client.query("SELECT *")
finally:
    client.close()

# Wrong: Connection leak if error occurs
client.connect()
data = client.query("SELECT *")
client.close()
```

## Pattern 14: Add Output Examples

**Impact**: Low
**Effort**: Low

**Show expected results**:
```python
response = client.get_user(123)
print(response)
# Output: {'id': 123, 'name': 'Alice', 'email': 'alice@example.com'}
```

## Pattern 15: Consolidate Duplicates

**Impact**: Medium
**Effort**: Low

**Merge similar examples** - if 3 examples show nearly identical patterns, keep 1 comprehensive version.

## Pattern 16: Fix Formatting

**Impact**: Low
**Effort**: Low

**Ensure all code blocks**:
- Have language tags: ` ```python ` not ` ``` `
- Are syntactically valid
- Include necessary imports
- Use consistent naming conventions

---

## RELATED RESOURCES

- [optimization.md](./optimization.md) - Optimization procedure, quality heuristics, README strategy, and the snippet quality checklist that verifies the output of these patterns
- [README.md](./README.md) - create-quality-control reference route map
- [workflows.md](./workflows.md) - Execution modes for the create-quality-control workflow
