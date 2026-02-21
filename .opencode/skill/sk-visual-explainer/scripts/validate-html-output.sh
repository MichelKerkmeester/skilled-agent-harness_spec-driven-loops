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

# ── CHECK 4: Required <meta> tags ─────────────────────────────────────────────
section "4" "Required Meta Tags"

# Only scan the <head> section for efficiency — extract up to first </head>
HEAD_SECTION=$(awk '/<\/head>/{ found=1 } !found{ print }' "$HTML_FILE" | head -100)

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

if grep -qiE '[Cc]:\\\\[a-zA-Z0-9_-]+\\\\' "$HTML_FILE" 2>/dev/null; then
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

# Extract all script src and link href attributes that look like CDN URLs
CDN_URLS=$(grep -oE 'https://cdn\.[a-zA-Z0-9._/-]+' "$HTML_FILE" 2>/dev/null || true)

if [[ -z "$CDN_URLS" ]]; then
  warn "No CDN URLs found (cdn.* pattern)"
  info "Expected at minimum: cdn.jsdelivr.net for Mermaid, Chart.js, or anime.js"
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

  if [[ $CDN_ERRORS -eq 0 ]] && ! grep -qi 'mermaid\|chart\.js\|animejs' "$HTML_FILE"; then
    pass "CDN URLs found and use HTTPS"
  fi
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
