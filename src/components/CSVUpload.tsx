import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../lib/authContext';

interface CSVUploadProps {
  title?: string;
  description?: string;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ 
  title = "Data Import", 
  description = "Upload CSV files to import data into the system" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hasPermission } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files[0]);
  };

  const handleFileSelection = (file: File) => {
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      setUploadStatus('idle');
    } else {
      setUploadStatus('error');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsProcessing(false);
      setUploadStatus('success');
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadedFile(null);
        setUploadStatus('idle');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!hasPermission('canUpload')) {
    return (
      <Card className="bg-gradient-to-br from-amber-50/50 via-yellow-50/50 to-orange-50/50 backdrop-blur-sm border border-amber-200/50 shadow-lg opacity-60">
        <CardContent className="p-6 text-center">
          <div className="text-amber-600">
            📤 CSV Upload requires Admin access
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-extralight bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700 bg-clip-text text-transparent flex items-center tracking-wide">
          <span className="text-3xl mr-4">📊</span>
          {title}
        </CardTitle>
        <CardDescription className="text-amber-700 font-light text-base tracking-wide">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-amber-400 bg-amber-100/50'
              : uploadStatus === 'error'
              ? 'border-red-400 bg-red-50/50'
              : uploadStatus === 'success'
              ? 'border-green-400 bg-green-50/50'
              : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {uploadStatus === 'success' ? (
            <div className="text-green-600">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-lg font-medium">Upload Successful!</p>
              <p className="text-sm opacity-75">File processed successfully</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="text-red-600">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-lg font-medium">Upload Failed</p>
              <p className="text-sm opacity-75">Please upload a valid CSV file</p>
            </div>
          ) : uploadedFile ? (
            <div className="text-amber-700">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium">File Ready</p>
              <p className="text-sm opacity-75 mb-4">{uploadedFile.name}</p>
              <p className="text-xs text-amber-600 mb-6">
                Size: {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
              <Button 
                onClick={handleUpload}
                disabled={isProcessing}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Upload & Process'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-amber-600">
              <div className="text-4xl mb-4">📤</div>
              <p className="text-lg font-medium mb-2">Drop CSV file here</p>
              <p className="text-sm opacity-75 mb-6">or click to browse</p>
              <Button 
                variant="outline" 
                onClick={triggerFileInput}
                className="border-amber-300 text-amber-700 hover:bg-amber-100/50"
              >
                Select CSV File
              </Button>
            </div>
          )}
        </div>

        {/* Supported formats info */}
        <div className="mt-4 p-4 bg-amber-100/30 rounded-xl border border-amber-200/50">
          <p className="text-xs text-amber-700 font-medium mb-2">📋 Supported Formats:</p>
          <ul className="text-xs text-amber-600 space-y-1">
            <li>• CSV files (.csv)</li>
            <li>• Maximum file size: 10MB</li>
            <li>• UTF-8 encoding recommended</li>
            <li>• First row should contain headers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUpload;
