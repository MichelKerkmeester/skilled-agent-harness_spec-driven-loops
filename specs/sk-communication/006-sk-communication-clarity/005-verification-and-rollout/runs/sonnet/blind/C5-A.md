Case: C5

a task where a tempting but irrelevant tangent surfaces, for example a stale TODO

Reply A:

This benchmark measures **advisor-routing accuracy** for `sk-communication`: whether a projection-intent prompt ("make CLI output readable", "claudish to english, privacy-first rewrite") routes to `sk-communication` as the advisor's top match. It's scored by the skill-advisor scorer (`system-skill-advisor/runtime/scripts/skill_advisor.py`).

Two things worth separating, per the README itself:

- **This harness** covers routing only. Dated capture runs land under `reports/`.
- **A second, separate harness** — `reply-harness/` — does reply-quality comparison: a frozen case set, weighted rubric, and mechanical scoring, documented in its own README.
- **The underlying package** (`cli-communication-projection`) is verified by its own gate (`npm run check`), not by this benchmark at all.

Run command: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-communication`.
