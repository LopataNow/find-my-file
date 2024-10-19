import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchFoldersByPath, FileInfo, FolderInfo } from "./calls/folder-calls";
import useFetchData from "./hooks/use-fetch-data";

function App() {
  const location = useLocation();
  const [filePath, setFilePath] = useState('');
  const {data, loading, error} = useFetchData<{files: FileInfo[], folders: FolderInfo[]}>(
    ['files-folders', filePath],
    () => fetchFoldersByPath(filePath).then((data) => {
      return {
        files: data.filter((file) => !file.isDirectory) as FileInfo[],
        folders: data.filter((folder) => folder.isDirectory) as FolderInfo[],
      };
  }));
  const files = data?.files || [];
  const folders = data?.folders || [];

  useEffect(() => {
    const filePath = location.pathname === '/' ? '' : location.pathname;

    setFilePath(filePath);
  }, [location]);

  const isFirstFolder = filePath === '';
  const upperFileTo = `${filePath.split('/').slice(0, -1).join('/')}`;
  const folderLinkTo = (name: string) => `${filePath}/${name}`
  
  return (
    <>
      <h1>File Explorer</h1>
      {loading && <h2>Loading...</h2>}
      {!isFirstFolder && <h2>Folder: {filePath}</h2>}
      {error && <h2>Missing Files</h2>}
      <ul>
        {!isFirstFolder && <li key='back'><Link to={upperFileTo}>🔙&nbsp;...</Link></li>}
        {folders.map((folder, index) => (
          <li key={'folder' + index}>
            <Link to={folderLinkTo(folder.name)} >📁&nbsp;{folder.name}</Link>
          </li>
        ))}
        {files.map((file, index) => (
          <li key={'file' + index}>
            <Link to={file.downloadLink} target='_blank' rel='noopener noreferrer'>📄&nbsp;{file.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
