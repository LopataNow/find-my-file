/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export interface FetchData<T> {
    data: T | undefined;
    loading: boolean;
    error?: any;
}

function useFetchData<T>(dependecies:any[], fetch: ()=>Promise<T>): FetchData<T> {
    const [data, setData] = useState<FetchData<T>>({ data: undefined, loading: true, error: '' });

    const fetchNemo = useCallback(fetch, dependecies);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setData({ data: undefined, loading: true, error: '' });
            const result = await fetchNemo();
            setData({
                data: result,
                loading: false,
                error: ''
            });
        } catch (error) {
            setData({ data: undefined, loading: false, error: error });
        }
    };

        fetchData();
    }, [fetchNemo]);

    return data;
};

export default useFetchData;