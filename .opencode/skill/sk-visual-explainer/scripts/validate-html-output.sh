#!/usr/bin/env bash
# validate-html-output.sh — Static analysis checks for sk-visual-explainer HTML output
# Usage: ./validate-html-output.sh <html-file>
# Exit codes: 0=pass, 1=warnings only, 2=errors (one or more checks failed)

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[2m'
RESET='\033[0m'
BOLD='\033[1m'

# ── State ─────────────────────────────────────────────────────────────────────
ERRORS=0
WARNINGS=0
CHECKS_PASSED=0

# ── Helpers ───────────────────────────────────────────────────────────────────
pass() {
  echo -e "  ${GREEN}✓${RESET} $1"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
}

warn() {
  echo -e "  ${YELLOW}⚠${RESET} $1"
  WARNINGS=$((WARNINGS + 1))
}

fail() {
  echo -e "  ${RED}✗${RESET} $1"
  ERRORS=$((ERRORS + 1))
}

info() {
  echo -e "  ${DIM}→ $1${RESET}"
}

section() {
  echo ""
  echo -e "${CYAN}${BOLD}[$1]${RESET} $2"
}

# ── Usage check ───────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo -e "${RED}Error:${RESET} No file specified."
  echo "Usage: $0 <html-file>"
  echo "       $0 path/to/output.html"
  exit 2
fi

HTML_FILE="$1"

echo ""
echo -e "${BOLD}Visual Explainer — HTML Output Validator${RESET}"
echo -e "${DIM}File: ${HTML_FILE}${RESET}"
echo -e "${DIM}$(date '+%Y-%m-%d %H:%M:%S')${RESET}"

# ── CHECK 1: File exists and is readable ──────────────────────────────────────
section "1" "File Exists & Readable"

if [[ ! -e "$HTML_FILE" ]]; then
  fail "File does not exist: ${HTML_FILE}"
  echo ""
  echo -e "${RED}Fatal: Cannot proceed — file not found.${RESET}"
  exit 2
fi

if [[ ! -f "$HTML_FILE" ]]; then
  fail "Path exists but is not a regular file: ${HTML_FILE}"
  exit 2
fi

if [[ ! -r "$HTML_FILE" ]]; then
  fail "File is not readable (permission denied): ${HTML_FILE}"
  exit 2
fi

pass "File exists and is readable"

# ── CHECK 2: DOCTYPE present ──────────────────────────────────────────────────
section "2" "HTML Doctype"

# Read first 200 chars — DOCTYPE must be near the very top
HEAD_CONTENT=$(head -c 200 "$HTML_FILE")
if echo "$HEAD_CONTENT" | grep -qi '<!DOCTYPE html'; then
  pass "<!DOCTYPE html> found at top of file"
else
  fail "Missing <!DOCTYPE html> declaration (must be first line)"
  info "Every sk-visual-explainer page must begin with <!DOCTYPE html>"
fi

# ── CHECK 3: File size ────────────────────────────────────────────────────────
section "3" "File Size"

FILE_SIZE_BYTES=$(wc -c < "$HTML_FILE" | tr -d ' ')
FILE_SIZE_KB=$(( FILE_SIZE_BYTES / 1024 ))
FILE_SIZE_MB_INT=$(( FILE_SIZE_BYTES / 1048576 ))

if [[ $FILE_SIZE_BYTES -gt 10485760 ]]; then
  # Over 10 MB — error
  fail "File size is ${FILE_SIZE_MB_INT} MB (> 10 MB limit) — HTML file is too large"
  info "Large files cause slow load times and browser memory issues"
  info "Consider splitting into multiple pages or reducing embedded data"
elif [[ $FILE_SIZE_BYTES -gt 2097152 ]]; then
  # Over 2 MB — warning
  warn "File size is ${FILE_SIZE_KB} KB (> 2 MB) — consider reducing"
  info "Large files may cause slow rendering. Check for embedded base64 images or oversized inline data."
else
  pass "File size is acceptable: ${FILE_SIZE_KB} KB"
fi

# Normalize once for multiline-safe CSS/HTML checks and minified one-line files
HTML_NORMALIZED=$(tr '\n' ' ' < "$HTML_FILE")

# ── CHECK 4: Required <meta> tags ─────────────────────────────────────────────
section "4" "Required Meta Tags"

# Extract <head> from normalized HTML first so one-line/minified files are handled.
HEAD_SECTION=$(echo "$HTML_NORMALIZED" | sed -nE 's/.*<head[^>]*>(.*)<\/head>.*/\1/ip')

# Fallback: if <head> extraction fails, scan the top chunk of the file.
if [[ -z "$HEAD_SECTION" ]]; then
  HEAD_SECTION=$(head -c 8000 "$HTML_FILE" | tr '\n' ' ')
fi

if echo "$HEAD_SECTION" | grep -qi 'charset\s*=\s*["\x27]\?utf-8'; then
  pass "charset=UTF-8 meta tag found"
else
  fail "Missing <meta charset=\"UTF-8\"> in <head>"
  info "Required for correct character encoding across all browsers"
fi

if echo "$HEAD_SECTION" | grep -qi 'name\s*=\s*["\x27]\?viewport'; then
  pass "viewport meta tag found"
else
  fail "Missing <meta name=\"viewport\" ...> in <head>"
  info "Required for proper rendering on mobile devices"
  info "Recommended: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
fi

if echo "$HEAD_SECTION" | grep -qi 'name\s*=\s*["\x27]\?color-scheme'; then
  pass "color-scheme meta tag found"
else
  fail "Missing <meta name=\"color-scheme\" content=\"light dark\"> in <head>"
  info "Required for consistent UA form/control rendering in light and dark modes"
fi

# ── CHECK 4A: SpecKit metadata contract (conditional) ────────────────────────
section "4A" "SpecKit Metadata Contract"

extract_meta_value() {
  local meta_name="$1"
  local value
  value=$(
    echo "$HEAD_SECTION" |
      grep -oiE "<meta[^>]*name=[\"']${meta_name}[\"'][^>]*content=[\"'][^\"']+[\"'][^>]*>" |
      head -1 |
      sed -E "s/.*content=[\"']([^\"']+).*/\\1/I" || true
  )
  echo "$value"
}

USES_SPECKIT_METADATA=false
if echo "$HEAD_SECTION" | grep -qiE 'name\s*=\s*["\x27]ve-artifact-type["\x27]'; then
  USES_SPECKIT_METADATA=true
fi

if $USES_SPECKIT_METADATA; then
  REQUIRED_SPECKIT_META=("ve-artifact-type" "ve-source-doc" "ve-speckit-level" "ve-view-mode")
  MISSING_META=0
  for meta_name in "${REQUIRED_SPECKIT_META[@]}"; do
    if echo "$HEAD_SECTION" | grep -qiE "name\\s*=\\s*[\"\\x27]${meta_name}[\"\\x27]"; then
      pass "SpecKit meta present: ${meta_name}"
    else
      fail "Missing SpecKit metadata tag: ${meta_name}"
      MISSING_META=$((MISSING_META + 1))
    fi
  done

  ARTIFACT_TYPE="$(extract_meta_value "ve-artifact-type")"
  SOURCE_DOC="$(extract_meta_value "ve-source-doc")"
  SPECKIT_LEVEL="$(extract_meta_value "ve-speckit-level")"
  VIEW_MODE="$(extract_meta_value "ve-view-mode")"

  if [[ "$ARTIFACT_TYPE" =~ ^(spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide)$ ]]; then
    pass "ve-artifact-type value is valid: ${ARTIFACT_TYPE}"
  else
    fail "Invalid ve-artifact-type value: ${ARTIFACT_TYPE:-<empty>}"
    info "Allowed values: spec, plan, tasks, checklist, implementation-summary, research, decision-record, readme, install-guide"
  fi

  if [[ "$SPECKIT_LEVEL" =~ ^(1|2|3|3\+|n/a)$ ]]; then
    pass "ve-speckit-level value is valid: ${SPECKIT_LEVEL}"
  else
    fail "Invalid ve-speckit-level value: ${SPECKIT_LEVEL:-<empty>}"
    info "Allowed values: 1, 2, 3, 3+, n/a"
  fi

  if [[ "$VIEW_MODE" =~ ^(artifact-dashboard|traceability-board)$ ]]; then
    pass "ve-view-mode value is valid: ${VIEW_MODE}"
  else
    fail "Invalid ve-view-mode value: ${VIEW_MODE:-<empty>}"
    info "Allowed values: artifact-dashboard, traceability-board"
  fi

  if [[ -z "$SOURCE_DOC" ]]; then
    fail "ve-source-doc is empty"
  elif [[ "$SOURCE_DOC" =~ ^/|^~|^[A-Za-z]:\\ ]]; then
    fail "ve-source-doc must be workspace-relative (not absolute): ${SOURCE_DOC}"
  else
    pass "ve-source-doc appears workspace-relative: ${SOURCE_DOC}"
    if [[ "$SOURCE_DOC" != *.md ]]; then
      warn "ve-source-doc does not end with .md: ${SOURCE_DOC}"
      info "Expected source docs to be markdown files for SpecKit/user-guide outputs"
    fi
  fi

  if [[ "$VIEW_MODE" == "artifact-dashboard" ]]; then
    REQUIRED_IDS=("artifact-kpis" "section-coverage-map" "risk-gaps-panel" "evidence-table")
    MISSING_IDS=0
    for required_id in "${REQUIRED_IDS[@]}"; do
      if grep -qiE "id=[\"']${required_id}[\"']" "$HTML_FILE"; then
        pass "artifact-dashboard structure includes #${required_id}"
      else
        fail "artifact-dashboard structure missing #${required_id}"
        MISSING_IDS=$((MISSING_IDS + 1))
      fi
    done
  fi

  if [[ "$VIEW_MODE" == "traceability-board" ]]; then
    REQUIRED_TRACE_IDS=("traceability-graph" "crossref-matrix" "missing-link-diagnostics")
    MISSING_TRACE_IDS=0
    for required_id in "${REQUIRED_TRACE_IDS[@]}"; do
      if grep -qiE "id=[\"']${required_id}[\"']" "$HTML_FILE"; then
        pass "traceability-board structure includes #${required_id}"
      else
        fail "traceability-board structure missing #${required_id}"
        MISSING_TRACE_IDS=$((MISSING_TRACE_IDS + 1))
      fi
    done

    TRACE_DOC_COUNT=$(grep -oE 'spec\.md|plan\.md|tasks\.md|checklist\.md|implementation-summary\.md' "$HTML_FILE" | sort -u | wc -l | tr -d ' ')
    if [[ "${TRACE_DOC_COUNT}" -ge 2 ]]; then
      pass "Traceability board references ${TRACE_DOC_COUNT} core SpecKit docs"
    else
      fail "Traceability board has insufficient core cross-doc references (${TRACE_DOC_COUNT})"
      info "Expected references to at least two of: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md"
    fi
  fi

  if [[ "${MISSING_META}" -eq 0 ]]; then
    pass "SpecKit metadata contract is complete"
  fi
else
  pass "No ve-artifact-type metadata detected (SpecKit metadata checks skipped)"
fi

# ── CHECK 5: No hardcoded absolute paths ─────────────────────────────────────
section "5" "No Hardcoded Absolute Paths"

# Check for common local filesystem path patterns
HARDCODED_PATHS=0

if grep -qE '/Users/[a-zA-Z0-9_-]+/' "$HTML_FILE" 2>/dev/null; then
  fail "Found hardcoded macOS path: /Users/username/..."
  info "Matches: $(grep -oE '/Users/[a-zA-Z0-9_-]+/[^\s\"'\''<]+' "$HTML_FILE" | head -3 | tr '\n' '  ')"
  HARDCODED_PATHS=$((HARDCODED_PATHS + 1))
fi

if grep -qE '/home/[a-zA-Z0-9_-]+/' "$HTML_FILE" 2>/dev/null; then
  fail "Found hardcoded Linux home path: /home/username/..."
  info "Matches: $(grep -oE '/home/[a-zA-Z0-9_-]+/[^\s\"'\''<]+' "$HTML_FILE" | head -3 | tr '\n' '  ')"
  HARDCODED_PATHS=$((HARDCODED_PATHS + 1))
fi

if grep -qiE "[Cc]:\\\\[a-zA-Z0-9_-]+\\\\" "$HTML_FILE" 2>/dev/null; then
  fail "Found hardcoded Windows path: C:\\Users\\..."
  HARDCODED_PATHS=$((HARDCODED_PATHS + 1))
fi

if [[ $HARDCODED_PATHS -eq 0 ]]; then
  pass "No hardcoded absolute filesystem paths found"
fi

# ── CHECK 6: Font loading references ─────────────────────────────────────────
section "6" "Font Loading"

if grep -qi 'fonts\.googleapis\.com\|fonts\.gstatic\.com\|fontshare\.com\|bunny\.net/fonts' "$HTML_FILE"; then
  pass "Font loading reference found (Google Fonts / Fontshare / Bunny)"

  # Bonus check: display=swap
  if grep -qi 'display=swap' "$HTML_FILE"; then
    pass "display=swap found — fonts load without blocking render"
  else
    warn "No display=swap in font URL — may cause flash of unstyled text (FOUT)"
    info "Add &display=swap to your Google Fonts URL"
  fi
else
  warn "No web font loading references found"
  info "Visual explainer pages should use a Google Font pairing (see quick_reference.md)"
  info "If using system fonts intentionally, this warning can be ignored"
fi

# ── CHECK 7: CDN URLs well-formed ─────────────────────────────────────────────
section "7" "CDN URLs"

CDN_ERRORS=0
USES_CDN_LIBS=false

if grep -qiE 'import[[:space:]]+mermaid|new[[:space:]]+Chart\(|anime\(|<script[^>]+src=[^>]*(mermaid|chart\.js|animejs)' "$HTML_FILE"; then
  USES_CDN_LIBS=true
fi

# Extract all script src and link href attributes that look like CDN URLs
CDN_URLS=$(grep -oE 'https://cdn\.[a-zA-Z0-9._/-]+' "$HTML_FILE" 2>/dev/null || true)

if [[ -z "$CDN_URLS" ]]; then
  # Only warn when CDN-backed libraries are actually referenced.
  if $USES_CDN_LIBS; then
    warn "No CDN URLs found (cdn.* pattern)"
    info "Expected at minimum: cdn.jsdelivr.net for Mermaid, Chart.js, or anime.js"
  else
    pass "No CDN URLs found and no CDN-backed libraries detected"
  fi
else
  # Check that URLs at least start with https://
  INSECURE=$(grep -oE 'http://cdn\.[a-zA-Z0-9._/-]+' "$HTML_FILE" 2>/dev/null || true)
  if [[ -n "$INSECURE" ]]; then
    fail "Insecure HTTP CDN URLs found (must use HTTPS)"
    info "$INSECURE"
    CDN_ERRORS=$((CDN_ERRORS + 1))
  fi

  # Check for expected jsdelivr patterns if Mermaid/Chart.js/anime.js are referenced
  if grep -qi 'mermaid' "$HTML_FILE"; then
    if grep -qi 'cdn\.jsdelivr\.net/npm/mermaid' "$HTML_FILE"; then
      pass "Mermaid CDN URL looks well-formed (jsdelivr.net)"
    else
      warn "Mermaid referenced but CDN URL pattern unexpected — verify URL"
    fi
  fi

  if grep -qi 'chart\.js\|new Chart(' "$HTML_FILE"; then
    if grep -qi 'cdn\.jsdelivr\.net/npm/chart\.js' "$HTML_FILE"; then
      pass "Chart.js CDN URL looks well-formed (jsdelivr.net)"
    else
      warn "Chart.js usage detected but CDN URL pattern unexpected — verify URL"
    fi
  fi

  if grep -qi 'animejs\|anime(' "$HTML_FILE"; then
    if grep -qi 'cdn\.jsdelivr\.net/npm/animejs' "$HTML_FILE"; then
      pass "anime.js CDN URL looks well-formed (jsdelivr.net)"
    else
      warn "anime.js usage detected but CDN URL pattern unexpected — verify URL"
    fi
  fi

  if [[ $CDN_ERRORS -eq 0 ]] && ! $USES_CDN_LIBS; then
    pass "CDN URLs found and use HTTPS"
  fi
fi

# ── CHECK 7A: Mermaid hardening signals ──────────────────────────────────────
section "7A" "Mermaid Hardening Signals"

USES_MERMAID=false
if grep -qiE 'import[[:space:]]+mermaid|class=["\x27]mermaid["\x27]|<pre[^>]*class=["\x27]mermaid["\x27]' "$HTML_FILE"; then
  USES_MERMAID=true
fi

if $USES_MERMAID; then
  if grep -qiE "securityLevel[[:space:]]*:[[:space:]]*['\"]strict['\"]" "$HTML_FILE"; then
    pass "Mermaid securityLevel: strict detected"
  else
    fail "Mermaid is used but securityLevel: 'strict' is missing"
    info "Add securityLevel: 'strict' to mermaid.initialize(...)"
  fi

  if grep -qiE 'deterministicIds[[:space:]]*:[[:space:]]*true' "$HTML_FILE"; then
    pass "Mermaid deterministicIds: true detected"
  else
    fail "Mermaid is used but deterministicIds: true is missing"
  fi

  if grep -qiE 'maxTextSize[[:space:]]*:[[:space:]]*[0-9]+' "$HTML_FILE"; then
    pass "Mermaid maxTextSize limit detected"
  else
    fail "Mermaid is used but maxTextSize limit is missing"
  fi

  if grep -qiE 'maxEdges[[:space:]]*:[[:space:]]*[0-9]+' "$HTML_FILE"; then
    pass "Mermaid maxEdges limit detected"
  else
    fail "Mermaid is used but maxEdges limit is missing"
  fi
else
  pass "No Mermaid usage detected (hardening signals not required)"
fi

# ── CHECK 7B: Canvas/Chart accessibility fallback ────────────────────────────
section "7B" "Canvas Accessibility Fallback"

USES_CANVAS=false
if grep -qi '<canvas' "$HTML_FILE"; then
  USES_CANVAS=true
fi

if $USES_CANVAS; then
  if grep -qi '<figcaption' "$HTML_FILE" || grep -qiE '<canvas[^>]*(aria-label|aria-labelledby)=' "$HTML_FILE"; then
    pass "Canvas fallback context detected (figcaption or aria label)"
  else
    fail "Canvas found without textual accessibility fallback"
    info "Add <figcaption> summary or aria-label/aria-labelledby for chart canvas context"
  fi
else
  pass "No canvas elements detected (fallback not required)"
fi

# ── CHECK 8: No broken internal anchor references ────────────────────────────
section "8" "Internal Anchor References"

# Extract all href="#id" values
ANCHOR_HREFS=$(grep -oE 'href="#[a-zA-Z0-9_-]+"' "$HTML_FILE" 2>/dev/null | sed 's/href="#//;s/"//' | sort -u || true)

if [[ -z "$ANCHOR_HREFS" ]]; then
  pass "No internal anchor links found (nothing to verify)"
else
  BROKEN_ANCHORS=0
  while IFS= read -r anchor_id; do
    if [[ -z "$anchor_id" ]]; then continue; fi
    # Check if a matching id="..." exists anywhere in the file
    if grep -qE "id=[\"']${anchor_id}[\"']" "$HTML_FILE" 2>/dev/null; then
      : # found — ok
    else
      fail "Broken anchor: href=\"#${anchor_id}\" has no matching id=\"${anchor_id}\""
      BROKEN_ANCHORS=$((BROKEN_ANCHORS + 1))
    fi
  done <<< "$ANCHOR_HREFS"

  TOTAL_ANCHORS=$(echo "$ANCHOR_HREFS" | grep -c . || true)
  if [[ $BROKEN_ANCHORS -eq 0 ]]; then
    pass "All ${TOTAL_ANCHORS} internal anchor reference(s) have matching id attributes"
  fi
fi

# ── CHECK 9: prefers-color-scheme media query ─────────────────────────────────
section "9" "Dark/Light Theme Support"

if grep -qi 'prefers-color-scheme' "$HTML_FILE"; then
  pass "prefers-color-scheme media query found — light/dark theme supported"

  # Bonus: check both light and dark are covered
  if grep -qi 'prefers-color-scheme:\s*dark' "$HTML_FILE"; then
    pass "Dark mode override (@media prefers-color-scheme: dark) found"
  else
    warn "prefers-color-scheme found but no explicit dark mode override detected"
    info "Ensure @media (prefers-color-scheme: dark) { :root { ... } } is present"
  fi
else
  fail "No prefers-color-scheme media query found"
  info "All sk-visual-explainer pages must support both light and dark themes"
  info "Add: @media (prefers-color-scheme: dark) { :root { --ve-bg: ...; } }"
fi

# ── CHECK 10: prefers-reduced-motion media query ──────────────────────────────
section "10" "Reduced Motion Accessibility"

if grep -qi 'prefers-reduced-motion' "$HTML_FILE"; then
  pass "prefers-reduced-motion media query found — animation accessibility supported"

  # Check the common pattern: animation-duration: 0.01ms
  if grep -qi '0\.01ms' "$HTML_FILE"; then
    pass "Animation kill-switch pattern found (0.01ms duration)"
  else
    warn "prefers-reduced-motion found but 0.01ms kill-switch not detected"
    info "Recommended: *, *::before, *::after { animation-duration: 0.01ms !important; }"
  fi
else
  fail "No prefers-reduced-motion media query found"
  info "Required for accessibility: users with vestibular disorders may be harmed by motion"
  info "Add: @media (prefers-reduced-motion: reduce) {"
  info "       *, *::before, *::after { animation-duration: 0.01ms !important; }"
  info "     }"
fi

# ── CHECK 10A: Contrast + forced-colors coverage ─────────────────────────────
section "10A" "Contrast and Forced-Colors Coverage"

if grep -qi 'prefers-contrast' "$HTML_FILE"; then
  pass "prefers-contrast media query detected"
else
  warn "No prefers-contrast media query detected"
  info "Add @media (prefers-contrast: more) for high-contrast users"
fi

if grep -qi 'forced-colors' "$HTML_FILE"; then
  pass "forced-colors media query detected"
else
  warn "No forced-colors media query detected"
  info "Add @media (forced-colors: active) for system high-contrast compatibility"
fi

# ── CHECK 11: --ve-* token system coverage ────────────────────────────────────
section "11" "Visual Token System"

VE_TOKEN_COUNT=$(
  (grep -oE -- '--ve-[a-zA-Z0-9_-]+' "$HTML_FILE" 2>/dev/null || true) |
  sort -u |
  awk 'NF { count++ } END { print count + 0 }'
)

if [[ $VE_TOKEN_COUNT -ge 6 ]]; then
  pass "--ve-* token system detected (${VE_TOKEN_COUNT} unique tokens)"
elif [[ $VE_TOKEN_COUNT -ge 1 ]]; then
  warn "Limited --ve-* token coverage (${VE_TOKEN_COUNT} unique tokens)"
  info "Use a broader --ve-* variable system (bg/surface/border/text/accent/fonts)"
else
  fail "No --ve-* design token variables found"
  info "Define theme tokens in :root (e.g., --ve-bg, --ve-surface, --ve-text, --ve-accent)"
fi

# ── CHECK 12: Typography guardrails ────────────────────────────────────────────
section "12" "Typography Guardrails"

if grep -qiE 'family=Inter([:&]|$)' "$HTML_FILE"; then
  fail "Primary font request includes Inter (disallowed as primary visual identity)"
  info "Use curated alternatives from references/quick_reference.md"
elif grep -qiE 'family=Roboto([:&]|$)' "$HTML_FILE"; then
  fail "Primary font request includes Inter/Roboto (disallowed as primary visual identity)"
  info "Use curated alternatives from references/quick_reference.md"
elif grep -qiE -- '--(ve-)?font-(display|body)[^;]*(Inter|Roboto|Arial)' "$HTML_FILE"; then
  fail "Primary font variables use Inter/Roboto/Arial (disallowed)"
  info "Choose a non-default display/body pairing and keep system fonts as fallback only"
else
  pass "Primary typography does not use Inter/Roboto/Arial in --ve font variables"
fi

# ── CHECK 13: Background atmosphere signal ─────────────────────────────────────
section "13" "Background Atmosphere"

if echo "$HTML_NORMALIZED" | grep -qiE 'background-image:[^;]*(radial-gradient|linear-gradient|repeating-linear-gradient)'; then
  pass "Background atmosphere detected via gradient treatment"
elif echo "$HTML_NORMALIZED" | grep -qiE 'background-size:[^;]*[0-9]+px[^;]*[0-9]+px'; then
  pass "Background atmosphere detected via pattern sizing"
else
  warn "No explicit atmosphere pattern detected"
  info "Consider subtle gradients, dot grids, or directional patterns to avoid flat output"
fi

# ── CHECK 14: Staggered reveal signal ─────────────────────────────────────────
section "14" "Motion Structure"

if grep -qiE -- '--i[^a-zA-Z0-9_-]' "$HTML_FILE" || grep -qi 'anime\.stagger' "$HTML_FILE"; then
  pass "Staggered reveal signal detected (--i or anime.stagger)"
else
  warn "No staggered reveal signal detected"
  info "Consider using --i delay variables or anime.stagger for intentional motion hierarchy"
fi

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────────"
echo -e "${BOLD}Validation Summary${RESET}"
echo "──────────────────────────────────────────────────"
echo -e "  ${GREEN}Passed:${RESET}   ${CHECKS_PASSED}"
echo -e "  ${YELLOW}Warnings:${RESET} ${WARNINGS}"
echo -e "  ${RED}Errors:${RESET}   ${ERRORS}"
echo ""

if [[ $ERRORS -gt 0 ]]; then
  echo -e "${RED}${BOLD}FAIL${RESET} — ${ERRORS} error(s) must be fixed before delivery."
  echo ""
  exit 2
elif [[ $WARNINGS -gt 0 ]]; then
  echo -e "${YELLOW}${BOLD}PASS WITH WARNINGS${RESET} — ${WARNINGS} warning(s) found. Review before delivery."
  echo ""
  exit 1
else
  echo -e "${GREEN}${BOLD}PASS${RESET} — All checks passed. File is ready for delivery."
  echo ""
  exit 0
fi
