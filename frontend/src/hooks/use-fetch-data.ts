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

function setDataMap<T>(dependencies: any[], data: FetchData<T>) {
    dataMap.set(dependencies.map((d) => d.toString()).join('-'), data);
}

function getDataMap<T>(dependencies: any[]): FetchData<T>  | undefined {
    return dataMap.get(dependencies.map((d) => d.toString()).join('-'));
}

function updateSubscriptions() {
    for (const subscription of subscriptions) {
        subscription();
    }
}

function subscribe(listener: any) {
    subscriptions.push(listener);

    return function unsubscribe() {
        const index = subscriptions.indexOf(listener);
        if (index !== -1) {
            subscriptions.splice(index, 1);
        }
    }
}

function useFetchData<T>(dependencies: any[], fetch: ()=>Promise<T>): FetchData<T> {
    const [, setEptyState] = useState({});

    const fetchNemo = useCallback(fetch, dependencies);

    useEffect(() => {
        const unsubscribe = subscribe(() => setEptyState({}));
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        if (getDataMap(dependencies) || getDataMap(dependencies)?.loading) {
            return;
        }

        try {
            updateSubscriptions();
            setDataMap(dependencies, { data: undefined, loading: true, error: '' });

            const result = await fetchNemo();
            updateSubscriptions();

            setDataMap(dependencies, { data: result, loading: false, error: '' });
        } catch (error) {
            updateSubscriptions();
            setDataMap(dependencies, { data: undefined, loading: false, error: error });
        }
    };

        fetchData();
    }, [fetchNemo]);

    return getDataMap(dependencies) || { data: undefined, loading: false };
};

export default useFetchData;