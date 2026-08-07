# Generalization Findings — Deterministic Replay vs. Production LLM Routing

The held-out work answered the program's central open question ("nothing
generalizes yet"). The answer is not what the fitted numbers implied.

## What was measured

Three routers were scored against the SAME sk-doc intent→leaf map (RESOURCE_MAP),
on the SAME requests.

| Router | Fitted (rehearsed phrasings) | Held-out, blind natural phrasing |
|--------|------------------------------|----------------------------------|
| Deterministic keyword replay (benchmark) | 87 | **1/8** |
| Deterministic keyword replay + broadened synonyms | 87 | 1/8 independent (5/5 only on the phrasings the synonyms were written for) |
| **LLM reading the intent→leaf map** | — | **8/8 (perfect recall, correct top intent)** |

Held-out prompts were authored by agents blind to the keyword list, so their
wording is genuinely independent of what any keyword set was tuned on.

## Conclusion

1. **The generalization gap belongs to the keyword matcher, not the router.**
   Production routing is the LLM reading `smart_routing.md`; given the correct
   RESOURCE_MAP it routes unseen natural phrasing at 8/8. The deterministic
   replay's 1/8 (and the earlier "~19% recall") is a config-coherence lower
   bound — it measures literal keyword coverage, not how the assistant routes.

2. **Keyword broadening is a dead end for generalization.** It only covers
   phrasings anticipated in advance, fails on near-misses ("trim it down" vs
   "trim the doc"), and introduces misroutes ("release notes" in a skill-creation
   request hijacked to CHANGELOG). None of that touches the LLM path.

3. **The RESOURCE_MAP itself is already correct.** The LLM's perfect score comes
   from applying the existing intent→leaf map — no embeddings or new routing
   layer were required to clear the gap. The foundation work that mattered was
   making that map correct, canonical (typed mode+leaf pairs), and measurable.

## Implications

- The meaningful generalization metric is the **live-mode** benchmark (LLM
  subject), not the router-mode replay. The 13-scenario held-out corpus is the
  instrument; run it live to quantify production routing at scale.
- Treat the deterministic router-replay as a **coherence gate** (does the config
  resolve, do modes/leaves agree) rather than a routing-quality oracle.
- The keyword synonym set is useful only as inline vocabulary hints for the LLM
  and any keyword-based advisor pre-filter — never as the generalization
  mechanism.
