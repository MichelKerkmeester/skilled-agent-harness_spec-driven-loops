# Iteration 2: D2 Security — design-md-generator Backend (URL/Path/Spawn Handling)

## Focus

- **Dimension:** security (D2)
- **Scope:** `design-md-generator/backend/scripts/{cli,extract,crawl,guided-run,validate}.ts` — the only code surface that takes URLs, file paths, and operator-supplied shell argv.
- **Goal:** audit shell-injection paths, URL handling, file-path traversal, spawn discipline, and in-page side effects.

## Scorecard

- Dimensions covered: security (deep pass 1)
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18 (5 P2 across 5 audit surfaces)

## Baseline Security Posture (positive)

- `extract.ts:261-272` — `--output` is required and the code refuses to write inside the skill directory (`resolvedOut.startsWith(skillRoot + path.sep)`). Strong path-traversal guard for skill pollution.
- `extract.ts:64-71` — `parsePositiveInt` rejects NaN and non-positive values, preventing `Semaphore(-5)` deadlocks (the comment explains why).
- `extract.ts:117` — `--wait-for` allowlisted to `networkidle | css | selector:*`; selector body is sandboxed in Playwright.
- `crawl.ts:28-29, 638-639` — `ignoreHTTPSErrors: insecure` defaults to `false`; TLS validation on by default. `--insecure` is operator opt-in.
- `extract.ts:654-658` — `urlToSlug` strips non-alphanumerics before file write, blocking URL-based path traversal in screenshot filenames.
- `guided-run.ts:79` — preflight check refuses in-skill `--output` (mirrors `extract.ts`).
- `guided-run.ts:114` — `spawnSync(command, args, ...)` uses array form, never shell-string interpolation. No shell injection.
- `crawl.ts:330-355` — `discoverLinks` sanitizes anchor hrefs through `new URL(href)` with same-domain enforcement and resource-extension filtering.
- All operator-supplied paths are operator-controlled (CLI); the threat model is "user-typed-command footgun", not "untrusted remote input".

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion

- **F002** — `crawl.ts:514-588` `triggerModals` clicks buttons matching `SAFE_BUTTON_PATTERNS` (`/sign\s*up/i, /get\s*started/i, /contact/i, /demo/i, /try/i, /learn\s*more/i, /subscribe/i, /join/i, /watch/i`) **on the live crawled production site**. Real-world side effects: `subscribe` and `join` patterns can trigger mailing-list / community-join flows server-side on the operator's behalf, with no undo. Crawls against production sites can create accounts, send confirmation emails, or pollute analytics. Mitigation: add an `--allow-side-effects` flag (default off), or narrow the patterns to ones that open an in-page modal only (e.g., require the click target to be inside a `<nav>` or to have `aria-haspopup`).
  - **Category:** security
  - **Dimension:** security
  - **ScopeProof:** `crawl.ts` is the page-fetch surface for `design-md-generator`, which is in the orchestrator's reviewScopeNote.
  - **Recommendation:** gate `triggerModals` behind `--allow-side-effects` OR restrict button candidates by anchor properties.

- **F003** — `crawl.ts:178-194` `dismissCookieBanners` runs `document.querySelectorAll('*')` and calls `getComputedStyle` on every element to find bottom-fixed high-z-index bars. On a 5k-element enterprise page this is a 500ms-1s synchronous main-thread block per crawl, and it dismisses **legitimate** consent banners (GDPR/CCPA) by setting `display:none`. Suppressing consent banners during extraction can have privacy/legal implications for the crawled site's analytics, and the operator may not realize their crawl is bypassing consent. Mitigation: limit the scan to elements with class/id/aria matching the explicit `COOKIE_SELECTORS` list (lines 85-91) — drop the blanket `querySelectorAll('*')` branch.
  - **Category:** security
  - **Dimension:** security
  - **ScopeProof:** `crawl.ts` is in scope.
  - **Recommendation:** remove the blanket `querySelectorAll('*')` loop (lines 178-192) and rely on the explicit cookie/consent selector list.

- **F004** — `crawl.ts:283-290` `isCaptchaPage` only detects reCAPTCHA (`iframe[src*="recaptcha"]`) and Cloudflare challenges (`.cf-challenge-running`, `#challenge-running`). Misses hCaptcha, Cloudflare Turnstile, Arkose FunCaptcha, Datadome, PerimeterX, Akamai Bot Manager. A challenge page that doesn't match the two patterns is crawled as if it were real content, extracting bot-challenge UI tokens into the design-system corpus. Mitigation: extend the selector set and add a generic "challenge detected" heuristic (e.g., very low text-content / known bot-detection vendor hostnames in iframes).
  - **Category:** security
  - **Dimension:** security
  - **ScopeProof:** `crawl.ts` is in scope.
  - **Recommendation:** broaden CAPTCHA / bot-detection vendor coverage.

- **F005** — `guided-run.ts:114` `spawnSync(step.command, step.args, { cwd: BACKEND_ROOT, encoding: 'utf-8' })` has no `timeout`. A hung child process (e.g., Playwright stuck on `networkidle` because `extract.ts`'s own `NAV_TIMEOUT` doesn't cover every waiting strategy, or `npx` waiting on a registry prompt) blocks the guided runner indefinitely. Operator impact: a CI run or unattended extraction that hangs without exit. Mitigation: add `timeout: 5 * 60 * 1000` and treat `result.signal === 'SIGTERM'` as a failure.
  - **Category:** security
  - **Dimension:** security
  - **ScopeProof:** `guided-run.ts` is the MODULE-header guided runner named in the orchestrator's reviewScopeNote.
  - **Recommendation:** set a `spawnSync` `timeout` and handle the resulting `SIGTERM`.

- **F006** — `extract.ts:766-769 / 285` `--extra-urls <file>` entries are pushed into `crawlPages`'s `initialUrls` set **without** the bare-URL normalization (`https://` prefix, root-URL derivation) that CLI positional URLs get at `extract.ts:158-175`. A bare-domain line (`example.com`) in the extra-urls file is silently caught and dropped at `crawl.ts:756-763` (the `new URL(url)` throws), wasting a crawl slot and producing a confusing failure. Not strictly a vulnerability, but a robustness gap on the operator-supplied input surface that masks typos. Mitigation: run the extra-urls list through the same `normalizedUrls` map.
  - **Category:** security
  - **Dimension:** security
  - **ScopeProof:** `extract.ts` is the CLI entry point in scope.
  - **Recommendation:** normalize `extraUrls` through the same `https://`-prefixed map at line 158.

### Claim-Adjudication Packets
(none — no new P0/P1)

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | deferred | hard | — | scheduled for D3 traceability iteration |
| checklist_evidence | n/a | hard | — | no spec-folder checklist |

## Assessment

- New findings ratio: 0.18
- Dimensions addressed: security
- Novelty justification: 5 distinct security-posture gaps on the URL/spawn/cookie-dismissal surfaces. None rise to P1 because the threat model is operator-supplied input and the existing path/skill guards are strong; F002 is the closest to P1 (real-world side effects on third-party sites) but the operator explicitly invokes extraction on a target site.

## Ruled Out

- `cli.ts:36-37` banner terminal-escape-sequence injection — operator owns the CLI, not a security boundary.
- `guided-run.ts:46-66` `parseGuidedRunArgs` missing-url validation — covered by the `if (!url || !output) throw usage()` guard at line 55.

## Dead Ends

- Searched `crawl.ts` for `child_process` / `exec` / `spawn` — none. All shell-out happens in `guided-run.ts` via `spawnSync` array form. No shell injection.

## Recommended Next Focus

D3 Traceability pass: execute the `spec_code` and `skill_agent` overlay protocols. Verify SKILL.md normative claims (5 modes, hub routes via `mode-registry.json`, mode packets have no own `graph-metadata.json`) against shipped artifacts, and verify each mode SKILL.md ↔ runtime agent definition agreement.

Review verdict: PASS
