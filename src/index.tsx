import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { store } from './store';
import './App.css'
const root = createRoot(document.getElementById('app') as Element);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
)