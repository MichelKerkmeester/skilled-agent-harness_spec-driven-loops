// Exercises the Webflow.push callback error path with an unguarded lookup.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs
window.Webflow.push(function () { document.querySelector('[data-hero]').classList.add('is-ready'); });
