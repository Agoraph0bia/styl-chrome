document
  .getElementById('element-picker-button')
  ?.addEventListener('click', test);

async function test() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].id) return;

    chrome.tabs.sendMessage(
      tabs[0].id,
      { ext: 'Styl', action: 'elementpicker' }, //Add salted hash check for security?
      () => {
        closeSidePanel();
        return true;
      }
    );
  });
}

async function closeSidePanel() {
  window.close();
}
