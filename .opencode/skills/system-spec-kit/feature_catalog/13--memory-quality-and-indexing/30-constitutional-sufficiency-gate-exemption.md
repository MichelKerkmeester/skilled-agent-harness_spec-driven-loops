---
title: "Constitutional sufficiency-gate exemption"
description: "Constitutional markdown files now pass through warn-only sufficiency mode during memory_index_scan. The strict gate that requires three support items and one anchor when primary evidence is absent no longer hard-rejects policy text by design."
---

# Constitutional sufficiency-gate exemption

## 1. OVERVIEW

Constitutional files under `.opencode/skills/*/constitutional/` are policy text, not evidence-bearing memory records. They encode behavior rules for agents and do not carry primary-evidence sections or `<!-- ANCHOR:* -->` tags. Before this feature shipped, the strict sufficiency gate at `memory-sufficiency.ts:372` rejected them with `INSUFFICIENT_CONTEXT_ABORT` because manual fallback requires `support >= 3` plus `anchors >= 1` when primary evidence is absent.

The fix is a 5-line patch in the scan batch loop that widens the existing `useWarnOnly` exemption. The `isConstitutional` classification was already computed downstream of the batch result loop. The patch lifts that classification into the warn-only branch so constitutional files flow through the same warn-only sufficiency path that spec docs use today.

---

## 2. CURRENT REALITY

`handleMemoryIndexScan` in `handlers/memory-index.ts` classifies every file as either a spec doc or a constitutional file during the batch loop. The patched gate selector at line 474 reads:

```
const isConstitutional = constitutionalSet.has(getCachedKey(filePath));
const useWarnOnly = force || isSpecDoc || isConstitutional;
```

Constitutional files now pass `qualityGateMode: 'warn-only'` to `indexSingleFile`. The downstream `evaluateMemorySufficiency` call still runs and still emits advisories when content is genuinely sparse, but advisories no longer halt the save. The strict gate stays intact for any file that is neither spec doc nor constitutional, so non-classified content is still subject to the full sufficiency contract.

Post-patch `memory_index_scan` reports zero `INSUFFICIENT_CONTEXT_ABORT` rejections for constitutional files. The two previously-failing constitutional markdowns (`cli-dispatch-skill-preload.md`, `post-implementation-deep-review.md`) now index successfully on the next scan after daemon restart.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-index.ts` | Scan handler | Line 474 OR-chain extended with `isConstitutional`. Rationale comment block names packet 018 and the policy-not-evidence reasoning |
| `mcp_server/handlers/memory-save.ts` | Save handler | Receives `qualityGateMode` from the scan path. Warn-only mode suppresses the `INSUFFICIENT_CONTEXT_ABORT` hard-reject |
| `shared/parsing/memory-sufficiency.ts` | Sufficiency policy | `evaluateMemorySufficiency` still runs against constitutional content, but the result is downgraded to advisory under warn-only |

### Validation And Tests

| File | Focus |
|------|-------|
| Manual: `memory_index_scan` against `.opencode/skills/*/constitutional/*.md` reports 0 `INSUFFICIENT_CONTEXT_ABORT` rejections after daemon restart |
| Manual: non-classified files (random markdown outside spec doc + constitutional folders) still hit the strict gate when primary evidence is absent |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/30-constitutional-sufficiency-gate-exemption.md`
- Shipping packet: `016/002/018-constitutional-quality-gate-exemption`
