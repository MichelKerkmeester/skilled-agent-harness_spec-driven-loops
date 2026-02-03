# scripts

> CLI utilities for manual memory database operations.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. 💡 USAGE](#3--usage)
- [4. 🔗 RELATED RESOURCES](#4--related-resources)

---

## 1. 📖 OVERVIEW

This folder contains standalone command-line scripts for administrative tasks on the Spec Kit Memory database. These tools operate independently of the MCP server and are used for maintenance, debugging, and force operations.

---

## 2. 📁 STRUCTURE

| File                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `reindex-embeddings.js` | Force regeneration of all embeddings in the database |

---

## 3. 💡 USAGE

### Force Reindex All Memory Files

```bash
node scripts/reindex-embeddings.js
```

**When to use:**
- After changing embedding provider or model
- Database corruption or inconsistent state
- Manual verification of indexing system
- Testing embedding pipeline changes

**Output:**
- 5-phase initialization (database, config, embeddings, modules, scan)
- Progress summary with counts (scanned, indexed, updated, unchanged, failed)
- Constitutional memory tracking
- File-level status for changed entries

---

## 4. 🔗 RELATED RESOURCES

- [Parent README](../README.md) - MCP server documentation
- [Reindex Script](./reindex-embeddings.js) - Full implementation
- [Vector Index Module](../lib/search/vector-index.js) - Underlying indexing system
