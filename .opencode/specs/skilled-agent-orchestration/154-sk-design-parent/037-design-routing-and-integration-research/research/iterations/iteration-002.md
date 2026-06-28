# Focus

[D1-2 / D1] impeccable per-model `<codex>` / `<gemini>` defect blocks at finer grain vs `design-audit` `ai_fingerprint_tells` (corpus: impeccable-main).

# Actions Taken

1. Re-read the deep-research and spec-kit workflow contracts, then confirmed this is a leaf research iteration: write only the research iteration artifacts and do not edit live `sk-design`, commands, MCP, or CLI content.
2. Reviewed the current strategy and prior D1 iteration to avoid re-covering `harden`, `optimize`, and `polish`.
3. Located the actual impeccable provider-block and detector surfaces: `skill/SKILL.src.md`, `skill/reference/critique.md`, provider transformer files, detector registry/checks, CLI flags, and provider-gated detector tests.
4. Compared those against `sk-design/design-audit/references/ai_fingerprint_tells.md`, the audit report template, anti-pattern scoring rubric, and manual testing scenario.

# Findings

## F1 - Impeccable has two enforceable per-model layers; `design-audit` has one human catalog

Evidence:
- Impeccable's source skill carries provider-specific prevention text: a Codex-only letter-spacing repeat block (`skill/SKILL.src.md:43-46`), a Gemini-only image-hover hard ban (`skill/SKILL.src.md:70-72`), and a Codex-only defect list covering ghost-card, over-rounding, sketchy SVG, stripes, and meta-criticism copy (`skill/SKILL.src.md:101-109`).
- The impeccable build system knows provider tags by target: Gemini keeps `gemini`, Codex keeps `codex`, and the Codex Repo Skills target also keeps `codex` (`scripts/lib/transformers/providers.js:34-44`, `scripts/lib/transformers/providers.js:55-63`).
- Its tests prove provider blocks compile by keeping matching bodies, dropping non-matching bodies, and removing the tags from skill bodies, reference files, and generated agents (`tests/lib/transformers/provider-blocks.test.js:29-50`, `tests/lib/transformers/provider-blocks.test.js:53-81`, `tests/lib/transformers/provider-blocks.test.js:84-117`).
- `design-audit` has a single cross-model reference that describes Codex tells, one Gemini tell, and 2026-general tells (`ai_fingerprint_tells.md:34-90`, `ai_fingerprint_tells.md:92-120`). It gives check text and severity, but no provider-specific delivery/proof unit analogous to the impeccable `<codex>` / `<gemini>` blocks.

Buildable recommendation:
- Add a `design-audit` tell registry table, likely in `references/ai_fingerprint_tells.md` or a companion `assets/ai_fingerprint_registry.json`, with columns: `tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `expected_evidence`, `severity_floor`, and `owner`.
- Add a small "model self-defect card" generated from that registry for Codex and Gemini dispatch/evaluation contexts. It should not replace the human catalog; it should be the compact prevention/proof unit that can be compared against output.
- Add a corpus validator that fails when a catalog tell lacks a registry row, when a model-specific row lacks a fixture, or when the generated self-defect card omits that model's row.

Enforceability:
- ENFORCEABLE on a test corpus and generated docs: registry completeness, card generation, and fixture coverage are deterministic.
- ADVISORY at runtime: whether a model internalizes the self-defect card still requires behavior tests or real output review.

## F2 - `design-audit` is missing impeccable's Codex "theater / meta-criticism copy" tell

Evidence:
- Impeccable's Codex defect block explicitly bans "Meta-criticism copy" where a concept is named then layered with an ironic modifier or staged as a strawman (`skill/SKILL.src.md:108`).
- The detector registry has a gated GPT rule for `theater-slop-phrase`, with category `slop`, gate `gpt`, and a description warning against dismissing something as "theater" (`cli/engine/registry/antipatterns.mjs:380-388`).
- The detector implements the static check with `\b(\w+)\s+theater\b` over body text and emits `theater-slop-phrase` (`cli/engine/rules/checks.mjs:576-585`).
- The provider-gated fixture test includes `theater-slop-phrase` in the GPT ID set and expects exactly one hit only when providers include `gpt` (`tests/detect-antipatterns-fixtures.test.mjs:746-765`).
- `design-audit`'s Codex section lists ghost-card, over-rounded cards, sketchy SVG, diagonal stripe background, and element-tracking (`ai_fingerprint_tells.md:38-76`); the Gemini section lists image-hover animation (`ai_fingerprint_tells.md:80-88`). The broader `design-interface` copy gate has related prose warnings, but marks selected UI-copy tells as examples rather than a validator (`copy_and_mock_data.md:61-63`, `copy_and_mock_data.md:76-87`).

Buildable recommendation:
- Add a Codex tell to `design-audit/references/ai_fingerprint_tells.md` for "theater framing / meta-criticism copy".
- Cross-link it to `design-interface/references/design-process/copy_and_mock_data.md` as the authoring-side content gate, but keep the audit-side entry model-specific with a deterministic narrow check and a broader advisory check.
- Fixture it with one positive string like "security theater" or "compliance theater" when used as a decorative critique, and one negative case where "theater" is literal venue content.

Enforceability:
- ENFORCEABLE for the narrow static pattern on a text/source fixture and for expected audit-report evidence.
- ADVISORY for the broader "ironic modifier / strawman" copy shape, because literal meaning and brand voice require context.

## F3 - Impeccable's provider-gated tests are more precise than `design-audit`'s manual tell scenario

Evidence:
- Impeccable exposes detector flags `--gpt` and `--gemini`, describes them as off by default, and maps them into a `providers` array (`plugin/skills/impeccable/scripts/detector/cli/main.mjs:91-95`, `plugin/skills/impeccable/scripts/detector/cli/main.mjs:151-160`).
- The detector registry marks provider tells with `gated: 'gpt'` or `gated: 'gemini'` (`cli/engine/registry/antipatterns.mjs:356-400`) and filters gated findings unless the provider is explicitly enabled (`cli/engine/registry/antipatterns.mjs:422-437`).
- Tests prove negative and positive behavior separately: GPT tells are absent by default and exactly one of each expected GPT tell appears under the GPT provider (`tests/detect-antipatterns-fixtures.test.mjs:749-765`); Gemini image-hover is absent by default and returns two hits under Gemini (`tests/detect-antipatterns-fixtures.test.mjs:769-780`).
- `design-audit`'s manual scenario asks for one concrete artifact and pass criteria around exact evidence labels and severity, but it has no fixture corpus, provider gate, expected counts, or clean negative column (`manual_testing_playbook/03--slop-hardening/001-ai-fingerprint-tells.md:30-49`).
- The audit report template asks only for tell count and named tells observed (`assets/audit_report_template.md:40-46`), while the scoring rubric compresses tell outcomes into a 0-4 dimension ladder (`assets/anti_patterns_score_rubric.md:17-31`).

Buildable recommendation:
- Add a fixture-backed `design-audit` manual/automated scenario for AI fingerprint tells. Minimum fixtures: clean pass, Codex ghost-card, Codex stripe, Codex theater-copy, Gemini image-hover CSS, Gemini image-hover utility, and three-tell gallery.
- Expected output should include `tell_id`, model family, evidence label, selector/file/line or rendered observation, severity, owner, and anti-pattern score impact.
- Later, add a small benchmark script that runs the audit prompt over these fixtures and asserts the report includes the expected tell IDs and no gated/off-family false positives.

Enforceability:
- ENFORCEABLE on a deterministic fixture corpus and generated reports.
- PARTLY ENFORCEABLE on live UI source when source lines are available.
- ADVISORY for screenshot-only audits, where findings can only be inferred unless source or rendered DOM evidence is supplied.

# Questions Answered

- Q2 partially: the enforceable unit is not "the agent noticed slop"; it is a registry row plus fixture plus expected report evidence for each model-specific tell.
- Q5 partially: D1 backlog should prioritize a tell registry, a per-model self-defect card, a fixture-backed audit scenario, and one missing Codex copy tell before adding more prose.

# Questions Remaining

- Should `design-audit` get an actual detector script, or should the benchmark remain report-output based and leave detector execution to a separate future tool?
- Should the self-defect card live only in `design-audit`, or should the parent `sk-design` hub expose model-family cards for every mode that can author UI?
- Should "theater framing / meta-criticism copy" be a Codex-only tell, a 2026-general tell with Codex examples, or both with separate severity floors?
- Should fixture gating be model-family based (`codex`, `gemini`) or executor based (`cli-codex`, Gemini CLI, future provider surfaces)?

# Next Focus

Advance to D1-3. Recommended next D1 thread: compare impeccable `audit.md` and `critique.md` report structure against `design-audit`'s severity, evidence, and score contract now that the per-model tell enforcement gap is mapped.
