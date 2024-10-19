/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export interface FetchData<T> {
    data: T | undefined;
    loading: boolean;
    error?: any;
}

const dataMap = new Map<string, FetchData<any>>();

function setDataMap<T>(dependecies: any[], data: FetchData<T>) {
    dataMap.set(dependecies.map((d) => d.toString()).join('-'), data);
}

function getDataMap<T>(dependecies: any[]): FetchData<T> {
    return dataMap.get(dependecies.map((d) => d.toString()).join('-')) || { data: undefined, loading: false };
}

function useFetchData<T>(dependecies: any[], fetch: ()=>Promise<T>): FetchData<T> {
    const [, setData] = useState({});

    const fetchNemo = useCallback(fetch, dependecies);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setData({});
            setDataMap(dependecies, { data: undefined, loading: true, error: '' });

            const result = await fetchNemo();
            setData({});

            setDataMap(dependecies, { data: result, loading: false, error: '' });
        } catch (error) {
            setData({ });
            setDataMap(dependecies, { data: undefined, loading: false, error: error });
        }
    };

        fetchData();
    }, [fetchNemo]);

    return getDataMap(dependecies);
};

export default useFetchData;