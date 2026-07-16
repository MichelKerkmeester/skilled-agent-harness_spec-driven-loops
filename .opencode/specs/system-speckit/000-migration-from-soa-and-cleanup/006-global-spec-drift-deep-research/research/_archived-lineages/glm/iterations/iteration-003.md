# Iteration 3: Naming-convention violations (Q3) vs hyphen-case program

## Focus
Quantify naming-convention violations against the sk-doc/032 kebab-case (hyphen) filesystem-naming program (which bans snake_case repo-wide except Python), determine which tracks are out of compliance, and assess whether the convention is actually enforced. Q3 closes the naming-drift characterization.

## Findings

### F3.1 — The kebab-case program (sk-doc/032) is NOT enforced — status `planned`
sk-doc/032-hyphen-naming-convention is the repo-wide kebab-case program (reverses/supersedes packet 027's snake_case migration). Its graph-metadata status is `planned` (Draft) — i.e. authored but not shipped, so the ban is not yet live. Until it ships, snake_case dirs are "pre-convention debt", not active violations.
- [SOURCE: file:.opencode/specs/sk-doc/032-hyphen-naming-convention/spec.md] (program description: 12-phase, worktree-pinned, immutable BASE SHA).
- [SOURCE: file:.opencode/specs/sk-doc/032-hyphen-naming-convention/graph-metadata.json] = `planned`.

### F3.2 — 61 snake_case directories exist; concentrated in 4 buckets
Repo-wide scan for `*_*` directories under `.opencode/specs/` yields 61 hits in 4 clusters:
1. **`z_archive` (×11, every track):** the archive folder name itself is snake_case. Under 032 this would become `z-archive`. May be a reserved name, but it is non-conforming. [SOURCE: all `*/z_archive/`]
2. **`z_future` packets (×9):** `agent-memory`, `code-ensemble`, `code-graph-and-cocoindex`, `headroom`, `loop-cli`, `mex`, `openhuman`, `rag-code-index`, `sqlite-to-turso` — packet-level snake_case slugs. [SOURCE: z_future/]
3. **sk-doc/013 legacy scratch/fixtures (~30):** `manual_testing_playbook` / `feature_catalog` dirs in `scratch/manifests/` and `tooling/fixtures/` — these are artifacts of packet 027's underscore migration that 032 reverses. [SOURCE: sk-doc/013-catalog-playbook-snippet-denumbering/scratch/, tooling/fixtures/]
4. **Misc:** `review_archive` (×2 in system-code-graph/031), `kimi-k2_6` dispatch state (cli-external-orchestration/018). [SOURCE: those paths]

### F3.3 — The convention itself flip-flopped (meta-drift / churn)
The repo's filesystem naming convention reversed direction once already: **packet 027 introduced snake_case**, then **sk-doc/032 reverses it back to kebab-case**, explicitly "reversing and superseding" 027 and flipping the validator's guard logic (`check_no_hyphenated_catalog_content.py` currently *rejects* the desired state). This convention churn is itself a documented drift pattern — the naming "truth" is unstable across two packets.
- [SOURCE: file:.opencode/specs/sk-doc/032-hyphen-naming-convention/spec.md] ("Reverses and supersedes the 027 underscore migration").

### F3.4 — Packet-level (top-depth) slugs are mostly clean; non-numeric packets are the outlier
At packet depth (`track/packet/`), numbered slugs are already kebab-case across all 12 tracks. The only packet-depth naming deviations are the non-numeric ones: `z_archive` (all tracks), `changelog` (system-skill-advisor), and the unnumbered `z_future/*` set. So **naming drift is concentrated in archive/future zones and in scratch/deep sub-phase artifacts, not in the primary numbered packets.**

## Sources Consulted
- `find .opencode/specs -type d -name '*_*'` (61 results).
- sk-doc/032 spec.md + graph-metadata.json.
- sk-doc/013 scratch/ and tooling/fixtures/ trees.

## Assessment
- **newInfoRatio: 0.65** — new bucket quantification (61 dirs, 4 clusters) and the flip-flop churn characterization; slightly below prior because z_future/z_archive observations were partly seeded in the init snapshot, and several snake_case hits are scratch/fixture artifacts (lower signal).
- **Confidence:** high on the counts and clusters (mechanical); high that 032 is unenforced (status=planned).
- **Q3 status:** answered — naming drift is concentrated in archive/future/scratch zones + a convention flip-flop; primary numbered packets are clean kebab-case. The actionable debt is gated behind 032 shipping.

## Reflection
- **Worked:** depth-aware `find` separated real packet-slug drift (rare) from scratch/fixture noise (common), avoiding false alarm inflation.
- **Failed:** none.
- **Ruled out:** "primary numbered packets have snake_case slugs" — they do not; deviations are confined to z_archive/z_future/changelog/scratch.

## Recommended Next Focus
Iteration 4: pivot to **Q4 (context-optimization efforts)** — de-duplicate the 9,834 raw keyword hits into real documented optimization efforts (compaction, pruning, summarization, continuity-shrinking) and extract patterns/outcomes usable as phase-007 teardown evidence.
