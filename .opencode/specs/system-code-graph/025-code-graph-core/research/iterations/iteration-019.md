# Iteration 19: Round H Rust Reference — aionforge-domain → content-addressed ids + the total_cmp portability gotcha

## Focus
Round H: mine `aionforge-domain` for the identity + serialization + determinism primitives — C4-B (content-addressed ids), C5-A (serialization-id render order), and the determinism cluster. Read-only.

## Reference patterns (newInfoRatio 0.85)
| Technique | aionforge impl | Transferable |
|---|---|---|
| Dual-class identity (one type, two paths) | ids.rs:18-71 (UUIDv7 mint + UUIDv8 content-hash, shared parse) | mint = time-sortable (UUIDv7/ULID); derived = content-hash; both round-trip through ONE validation. TS: use UUIDv7/ULID + sha256-hex |
| Content-addressed derived id recipe (C4-B) | fact_extraction.rs:753-770 | key = `{namespace}\|{subject}\|{predicate}\|{object_canonical}\|{episode}\|{rule_version}` → hash; `\|` separator; **rule_version LAST so a bump forks identity** (old kept, non-lossy); multi-source note id sorts the fact-id SET before join (order-insensitive); entity objects render `entity:{id}` (never collide with text). Exactly C4-B; ports verbatim (swap blake3→sha256) |
| SerializationId render key (C5-A) | ids.rs:121-147 | `hash(kind_tag ++ 0x00 ++ canonical_key)` → fixed hex prefix; the 0x00 + kind-tag namespaces so two kinds with identical bytes never collide; fact key = triple ONLY (excludes mint-id AND rule_version) so re-extractions render identically (prefix-cache contract) |
| Render-order vs score-order separation | retriever.rs:452-465 | structured view stays SCORE-order behind the identity prefix; rendered view re-sorts by serialization-id then content() (both content-derived); comment FORBIDS tie-break by mint-id (won't survive rebuild) |
| **NaN-safe total float ordering — the portability gotcha** | fusion.rs:135; merge.rs:38-48 | `b.score.total_cmp(&a.score).then(a.node.cmp(&b.node))`. **JS `(a,b)=>b-a` is NOT a total order — NaN poisons the sort, −0/+0 collapse.** Every determinism candidate (C5-A/B, Q4-C1, det-context-order, DL-merge-tiebreak) MUST hand-write a total comparator (handle NaN explicitly, define −0 vs +0) before claiming deterministic order |
| Canonical JSON before hashing | signing.rs:182-200 | recursively sort object keys at EVERY depth before serialize+hash (arrays positional) so map-construction order can't perturb hashed bytes — the invariant C4-B/C5-A rely on |

## Key port note (highest-value gotcha of the round)
**JS lacks `f64::total_cmp`** — the naive `(a,b)=>b-a` sort is NOT total (NaN/−0 break it). EVERY determinism candidate across all 4 subsystems must hand-write a total comparator + an explicit content-derived id tiebreak. This is the single most important portability finding for the determinism work.

## Next Focus
C4-B/C5-A reference-backed (the id recipe + serialization-id + canonical-JSON port verbatim). The total_cmp gotcha is a cross-cutting determinism prerequisite. Feeds Round J (determinism build sequence).
