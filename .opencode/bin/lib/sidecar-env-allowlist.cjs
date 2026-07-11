// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Sidecar Env Allowlist                                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Frozen env-key allowlist gating vars passed to the sidecar.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const SIDECAR_ENV_ALLOWLIST = Object.freeze({
  exact: Object.freeze([
    'HOME',
    'LANG',
    'PATH',
    'PYTORCH_ENABLE_MPS_FALLBACK',
    'TEMP',
    'TMP',
    'TMPDIR',
    'TRANSFORMERS_OFFLINE',
  ]),
  prefixes: Object.freeze([
    'HF_',
    'LC_',
    'SPECKIT_',
  ]),
});

const SIDECAR_ENV_ALLOWLIST_EXACT = new Set(SIDECAR_ENV_ALLOWLIST.exact);

function isAllowedSidecarEnvKey(key) {
  return SIDECAR_ENV_ALLOWLIST_EXACT.has(key)
    || SIDECAR_ENV_ALLOWLIST.prefixes.some((prefix) => key.startsWith(prefix));
}

module.exports = {
  SIDECAR_ENV_ALLOWLIST,
  isAllowedSidecarEnvKey,
};
