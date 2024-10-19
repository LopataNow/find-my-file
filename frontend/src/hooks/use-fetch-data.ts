/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export interface FetchData<T> {
    data: T | undefined;
    loading: boolean;
    error?: any;
}

const dataMap = new Map<string, FetchData<any>>();
const subscriptions: any[] = [];

function setDataMap<T>(dependecies: any[], data: FetchData<T>) {
    dataMap.set(dependecies.map((d) => d.toString()).join('-'), data);
}

function getDataMap<T>(dependecies: any[]): FetchData<T> {
    return dataMap.get(dependecies.map((d) => d.toString()).join('-')) || { data: undefined, loading: false };
}

function updateSupcruptions() {
    for (const subscription of subscriptions) {
        subscription({});
    }
}

function useFetchData<T>(dependecies: any[], fetch: ()=>Promise<T>): FetchData<T> {
    const [, setData] = useState({});

    const fetchNemo = useCallback(fetch, dependecies);

    useEffect(() => {
        subscriptions.push(setData);
        return () => {
            const index = subscriptions.indexOf(setData);
            if (index !== -1) {
                subscriptions.splice(index, 1);
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        if (getDataMap(dependecies)?.data || getDataMap(dependecies)?.loading) {
            return;
        }

        try {
            updateSupcruptions();
            setDataMap(dependecies, { data: undefined, loading: true, error: '' });

            const result = await fetchNemo();
            updateSupcruptions();

            setDataMap(dependecies, { data: result, loading: false, error: '' });
        } catch (error) {
            updateSupcruptions();
            setDataMap(dependecies, { data: undefined, loading: false, error: error });
        }
    };

        fetchData();
    }, [fetchNemo]);

    return getDataMap(dependecies);
};

export default useFetchData;