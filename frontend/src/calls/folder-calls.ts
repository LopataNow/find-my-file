import axios from 'axios';

export interface FolderInfo {
  name: string;
  isDirectory: boolean;
}

export interface FileInfo{
  name: string;
  downloadLink: string;
  isDirectory: boolean;
}

const apiUrl = import.meta.env.VITE_BACKEND_API;

export const fetchFoldersByPath = async (path: string = '') => {
  const { data } = await axios.get<Array<FileInfo | FolderInfo>>(apiUrl + path);
  return data;
};