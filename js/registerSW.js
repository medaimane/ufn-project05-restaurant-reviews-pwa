// Add offline support
((async () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            let registration = await navigator.serviceWorker.getRegistration('/');
            if (registration) {
                console.log('ServiceWorker registration already with scope: ', registration.scope);
            } else {
                registration = await navigator.serviceWorker.register('../sw.js');
                if (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                } else {
                    console.log('ServiceWorker registration failed :(', registration);
                }
            }
        });
    }
})());
