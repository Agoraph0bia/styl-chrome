document
  .getElementById('element-picker-button')
  ?.addEventListener('click', async () =>
    createElementPicker().then(closeSidePanel)
  );

async function createElementPicker() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id ?? 0, {
      ext: 'Styl',
      type: 'elementpicker',
      action: 'start',
    });
  });
}

async function closeSidePanel() {
  window.close();
}
