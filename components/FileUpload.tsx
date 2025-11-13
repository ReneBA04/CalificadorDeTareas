
import React, { useRef } from 'react';
import { UploadCloudIcon, FileIcon, XIcon } from './Icons';

interface FileUploadProps {
  id: string;
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, file, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileSelect(selectedFile);
    } else if (selectedFile) {
        alert("Please select a PDF file.");
        onFileSelect(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };
  
  const handleRemoveFile = () => {
    onFileSelect(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2 overflow-hidden">
                <FileIcon className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
            </div>
            <button onClick={handleRemoveFile} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <XIcon className="h-5 w-5"/>
            </button>
        </div>
      ) : (
        <div 
            className="flex justify-center items-center w-full px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <div className="text-center">
                <UploadCloudIcon className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF only</p>
            </div>
            <input
                id={id}
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
            />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
