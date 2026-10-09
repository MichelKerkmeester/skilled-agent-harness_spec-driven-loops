// Known-good control for guarded Webflow initialization.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs
(function () {
  const init = () => {
    const containers = document.querySelectorAll('[data-component="example"]');
    if (!containers.length) return;

    const target = document.querySelector('[data-target]');
    if (!target) return;

    window.requestAnimationFrame(() => {
      const frame_target = document.querySelector('[data-target]');
      if (!frame_target) return;
      frame_target.classList.add('is-ready');
    });
  };

  const start = () => {
    if (window.__guardedExampleInit) return;
    window.__guardedExampleInit = true;
    window.setTimeout(init, 50);
  };

  window.Webflow.push(start);
})();
