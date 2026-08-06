'use strict';
/*
 * Non-functional fixture plugin for the BRAT headless install scenario (OBS-013).
 * It exists only so the file-layer stage step has a real, parseable main.js and
 * manifest.json to copy into a throwaway vault with no network access. It is never
 * loaded by a real Obsidian instance during the test — the scenario verifies the
 * file-layer stage/register/activate contract, not plugin runtime behaviour.
 */
const obsidian = require('obsidian');

module.exports = class SampleBetaPlugin extends obsidian.Plugin {
  async onload() {
    console.log('[sample-beta fixture] loaded');
  }
  onunload() {
    console.log('[sample-beta fixture] unloaded');
  }
};
