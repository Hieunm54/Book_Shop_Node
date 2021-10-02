import fs from 'fs';

const deleteFile = (path) => {
    fs.unlink(path, (err)=>{
        if(err) {
            throw err;
        }
    })
}

export {deleteFile}