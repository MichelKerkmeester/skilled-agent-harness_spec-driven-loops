Case: C5

a task where a tempting but irrelevant tangent surfaces, for example a stale TODO

Reply B:

It measures advisor-routing accuracy: whether a projection-intent prompt (e.g. "make CLI output readable", "claudish to english, privacy-first rewrite") routes to `sk-communication` as the advisor's top match. The harness is the skill-advisor scorer (`system-skill-advisor/runtime/scripts/skill_advisor.py`), with dated capture runs under `reports/`.

Two things it explicitly does not cover: the `cli-communication-projection` package itself, which has its own gate (`npm run check`), and reply-quality comparison, which is a separate harness under `reply-harness/` (frozen case set, weighted rubric, blinding, condition comparison).
