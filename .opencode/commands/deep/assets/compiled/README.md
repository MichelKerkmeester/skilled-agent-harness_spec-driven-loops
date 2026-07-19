---
title: "Compiled Deep Command Contracts"
description: "Developer reference for generated deep-command contracts, rollout metadata and the alignment placeholder contract."
trigger_phrases:
  - "compiled deep contracts"
  - "deep command contract manifest"
  - "command injection contracts"
importance_tier: "important"
---

# Compiled Deep Command Contracts

> Generated executor contracts and rollout metadata derived from maintained deep-command authorities.

---

## 1. OVERVIEW

`.opencode/commands/deep/assets/compiled/` stores flattened command contracts used by deep-command injection tooling.

The generated contracts combine maintained command, workflow, skill, reference and agent sources into grep-checkable executor instructions. Maintained source files remain authoritative.

---

## 2. DIRECTORY TREE

```text
compiled/
+-- deep-ai-council.contract.md
+-- deep-alignment.contract.md
+-- deep-research.contract.md
+-- deep-review.contract.md
+-- manifest.jsonl
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `deep-research.contract.md` | Generated executor contract for `/deep:research`. |
| `deep-review.contract.md` | Generated executor contract for `/deep:review`. |
| `deep-ai-council.contract.md` | Generated executor contract for `/deep:ai-council`. |
| `deep-alignment.contract.md` | Placeholder required by manifest hashing while alignment remains outside the compiler command map. |
| `manifest.jsonl` | Append-only render records with command, mode and content digests. |

---

## 4. GENERATION MODEL

Generated contracts record:

- The command identifier and contract version
- The compiler entrypoint
- Source paths and source digests
- The compiled body digest
- Setup and execution rules
- Write boundaries
- Tool grants
- Dispatch or council execution requirements

The compiler named in generated headers is:

```text
.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs
```

Regenerate a contract when any maintained source digest changes.

---

## 5. AUTHORITY BOUNDARY

The generated contracts are derived artifacts. Do not edit their generated sections by hand.

`deep-alignment.contract.md` is different. It documents that `/deep:alignment` is not registered in the compiler and that fallback injection uses the matching legacy body. It must not act as an execution authority.

The maintained command files, workflow YAML assets, skill instructions and referenced runtime files remain the source of truth.

---

## 6. MANIFEST

Each `manifest.jsonl` row records:

| Field | Meaning |
|---|---|
| `command` | Deep command identifier. |
| `mode` | Injection or render mode. |
| `argsSha256` | Digest of bound render arguments. |
| `legacyBodySha256` | Digest of the legacy command body. |
| `compiledContractSha256` | Digest of the compiled contract file. |
| `renderedSha256` | Digest of the rendered command payload. |

The manifest can contain multiple records for the same command because each render appends evidence for a specific mode and input set.

---

## 7. VALIDATION

Check the JSONL structure from the repository root:

```bash
node -e '
const fs = require("fs");
const lines = fs.readFileSync(".opencode/commands/deep/assets/compiled/manifest.jsonl", "utf8").trim().split("\n");
for (const line of lines) JSON.parse(line);
console.log(`OK ${lines.length} manifest rows`);
'
```

Expected result: every non-empty line parses as JSON and the command prints an `OK` count.

Use the deep-loop compiler's validation path when verifying contract freshness. Do not infer freshness from file presence alone.

---

## 8. RELATED

- [Legacy deep command bodies](../legacy/)
- [Deep command assets](../)
- [Deep command router files](../../)
- [Deep-loop skill](../../../../skills/system-deep-loop/SKILL.md)
