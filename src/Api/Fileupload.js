import axios from 'axios';
import { FileUpload } from './ApiRoutes';

const handleFileUpload = async (file) => {
    if (!file) {
        console.error('No file selected');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    for (let [key, value] of formData.entries()) {
    }
    try {
        const response = await FileUpload(formData);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};
<input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
