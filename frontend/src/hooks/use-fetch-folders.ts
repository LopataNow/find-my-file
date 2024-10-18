import { useEffect, useState } from "react";
import { fetchFoldersByPath, FileInfo, FolderInfo } from "../calls/folder-calls";

export interface FetchFoldersData {
    folders: FolderInfo[];
    files: FileInfo[];
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
}

const useFetchFolders = (filePath: string) => {
    const [data, setData] = useState<FetchFoldersData>({ folders: [], files: [], loading: true, error: '' });

    useEffect(() => {
        const fetchData = async () => {
        try {
            setData({ folders: [], files: [], loading: true, error: '' });
            const result = await fetchFoldersByPath(filePath);
            setData({
            folders: result.filter((item: FileInfo | FolderInfo) => item.isDirectory) as FolderInfo[],
            files: result.filter((item: FileInfo | FolderInfo) => !item.isDirectory) as FileInfo[],
            loading: false,
            error: ''
            });
        } catch (error) {
            setData({ folders: [], files: [], loading: false, error: error });
        }
        };

        fetchData();
    }, [filePath]);

    return data;
};

export default useFetchFolders;