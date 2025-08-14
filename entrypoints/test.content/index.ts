export default defineContentScript({
    matches: ['*://*/*'],
    runAt: 'document_idle',
    main() {
      console.log('Hello content.');
    },
  });
  