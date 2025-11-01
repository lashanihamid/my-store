import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://shirazchap.net/api/api/settings')
            .then(res => {
                if (res.data.success && res.data.data) {
                    setSettings(res.data.data);
                }
            })
            .catch(err => console.error('خطا در دریافت تنظیمات:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);