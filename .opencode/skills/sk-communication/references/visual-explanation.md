# Visual Explanation — modality and depth

The explanation lane answers one question: *what is the smallest picture that makes this land, and how much does the reader already know?* Those are two independent dials. Choose both on every invocation.

---

## 1. MODALITY — which form carries the content

Pick the smallest form that answers the question actually being asked. A diagram that shows everything explains nothing.

| Content being explained | Form | Why this form |
|---|---|---|
| Logic, algorithms, decision rules | Pseudocode | Sequence and branching read faster as steps than as prose |
| Runtime control flow, who calls whom | Call tree | Depth and fan-out are the point; indentation shows both |
| UI structure, state and module boundaries | Component tree | Nesting plus annotated boundaries carry ownership |
| Responsibility layout, refactor targets | File tree | The shape of the directory *is* the argument |
| Interaction, sequence, data flow, state machines | Mermaid | Edges and direction matter more than position |
| What changes between two states | `diff` block | The reader needs the delta, not both versions |
| Mostly-new code, or where exact syntax matters | Code block | Paraphrasing syntax loses the thing being explained |
| Dense comparison, layout, many related values | HTML | A table or layout beats a paragraph when values relate in two dimensions |

**Selection rules**

1. Prefer the plainest form that works. Reach for HTML last, not first.
2. Include only what resolves the current question. Omit files, props, states, branches, and boundaries that do not.
3. Put the visual first and keep prose short. Place supporting text directly beside the part it explains.
4. Read before you draw. Never diagram a structure inferred from a filename or a symbol you have not opened.
5. If no visual would clarify — a single value, a yes/no answer — say so and skip the diagram.

---

## 2. DEPTH — how much background to assume

| Level | Audience | Vocabulary | Shape |
|---|---|---|---|
| `expert` (default) | A peer on this codebase | Real identifiers, precise terms, no glossing | Dense; assumes the domain |
| `plain` | An intelligent non-specialist | Real names kept, each jargon term glossed once at first use | Moderate; one idea per line |
| `novice` | No background at all | Everyday words; a familiar analogy in place of the precise term | Picture first, text sparse and concrete |

**The rule that binds all three levels:** simplification applies to *words*, never to *facts*. Depth changes vocabulary, framing, and how much is shown. It never changes a value, an identifier, a path, or the truth of a claim. A `novice` answer may be incomplete; it may not be wrong.

---

## 3. PROTECTED SPANS

When content is reproduced rather than newly written, these stay byte-for-byte identical at every depth:

fenced and inline code · file and directory paths · terminal commands, scripts, flags · URLs, URIs, endpoints · exact numbers, dates, timestamps, metrics · identifiers (variables, functions, classes, parameters, config keys)

---

## 4. LANE BOUNDARY

This lane **creates new explanatory material** in-context. It does not rewrite a byte stream, does not call a local or hosted model, and is therefore not gated by the projection lane's enablement flag or egress rules.

It writes a file only when the operator passes `--artifact`, and then only a newly created, self-contained HTML file. Rewriting an existing on-disk file remains out of scope for the whole skill.

Command: `/rewrite:explain-visually [--depth=expert|plain|novice] [--artifact] [topic]`
