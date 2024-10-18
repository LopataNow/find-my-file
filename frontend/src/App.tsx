import { useEffect, useState } from "react";
import { fetchFoldersByPath, FileInfo, FolderInfo } from "./calls/folder-calls";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface Data {
  folders: FolderInfo[];
  files: FileInfo[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

function App() {
  const location = useLocation();
  
  const [filePath, setFilePath] = useState('');
  const [data, setData] = useState<Data>({folders: [], files: [], loading: true, error: ''});

  useEffect(() => {
    const filePath = new URLSearchParams(location.search).get('pathname') ?? '';

    setFilePath(filePath);
    setData({folders: [], files: [], loading: true, error: ''});

    fetchFoldersByPath(filePath)
    .then(data => {
      setData({
        files: data.filter(file=>!file.isDirectory) as FileInfo[],
        folders: data.filter(file=>file.isDirectory),
        loading: false,
        error: ''
      });
    })
    .catch(err => {
      setData({files: [], folders: [], loading: false, error: err});
    });
  }, [location]);

  const isFirstFolder = filePath === '';
  const upperFileTo = `/?pathname=${filePath.split('/').slice(0, -1).join('/')}`;
  const folderLinkTo = (name: string) => `/?pathname=${filePath}/${name}`
  
  return (
    <>
      <h1>File Explorer</h1>
      {data.loading && <h2>Loading...</h2>}
      {!isFirstFolder && <h2>Folder: {filePath}</h2>}
      {data.error && <h2>Missing Files</h2>}
      <ul>
        {!isFirstFolder && <li key='back'><Link to={upperFileTo}>🔙&nbsp;...</Link></li>}
        {data.folders.map((folder, index) => (
          <li key={'folder' + index}>
            <Link to={folderLinkTo(folder.name)} >📁&nbsp;{folder.name}</Link>
          </li>
        ))}
        {data.files.map((file, index) => (
          <li key={'file' + index}>
            <Link to={file.downloadLink} target='_blank' rel='noopener noreferrer'>📄&nbsp;{file.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
