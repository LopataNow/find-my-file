import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const filesDestination = path.join(__dirname, '../public');
const downloadLink = `${process.env.SERVER_URL}/download`;

app.use(cors());

function getDirectoryContents(filePath: string): Promise<{ name: string, isDirectory: boolean, downloadLink?: string }[]> {
    const dirPath = path.join(filesDestination, filePath);

    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(err);
            }

            const fileList = files.map(file => ({
                name: file.name,
                isDirectory: file.isDirectory(),
                downloadLink: file.isDirectory() ? undefined : `${downloadLink}${filePath}/${file.name}`
            }));

            resolve(fileList);
        });
    });
}

app.get('/download/*', (req: Request, res: Response) => {
    const filePath = decodeURIComponent(req.params[0]);
    const fileDirPath = path.join(filesDestination, filePath);

    fs.stat(fileDirPath, (err, stats) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.download(fileDirPath);
    });
});

app.get('*', (req: Request, res: Response) => {
    const filePath = decodeURIComponent(req.path);

    getDirectoryContents(filePath)
        .then(files => {
            res.json(files);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});