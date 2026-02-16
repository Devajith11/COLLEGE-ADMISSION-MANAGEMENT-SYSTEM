import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const DocumentUpload = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(null); // ID of file being uploaded
    const [files, setFiles] = useState({
        allotmentMemo: null,
        sslcCertificate: null,
        transferCertificate: null,
        physicalFitness: null,
        incomeCertificate: null
    });

    const [uploadStatus, setUploadStatus] = useState({
        allotmentMemo: 'pending',
        sslcCertificate: 'pending',
        transferCertificate: 'pending',
        physicalFitness: 'pending',
        incomeCertificate: 'pending'
    });

    React.useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get('/api/student/profile');
                if (res.data.documents) {
                    const statusUpdate = { ...uploadStatus };
                    const fileUpdate = { ...files };

                    res.data.documents.forEach(doc => {
                        const docEntry = docList.find(d => d.name === doc.name);
                        if (docEntry) {
                            statusUpdate[docEntry.id] = 'success';
                            fileUpdate[docEntry.id] = { name: 'File Uploaded' };
                        }
                    });

                    setUploadStatus(statusUpdate);
                    setFiles(fileUpdate);
                }
            } catch (err) {
                console.error('Failed to fetch existing documents', err);
            }
        };
        fetchDocs();
    }, []);

    const docList = [
        { id: 'allotmentMemo', name: 'KEAM Allotment Memo', description: 'Latest allotment memo issued by CEE' },
        { id: 'sslcCertificate', name: 'SSLC / 10th Certificate', description: 'For proof of age and date of birth' },
        { id: 'transferCertificate', name: 'Transfer Certificate (TC)', description: 'Issued from the last institution attended' },
        { id: 'physicalFitness', name: 'Physical Fitness Certificate', description: 'In the format prescribed in the prospectus' },
        { id: 'incomeCertificate', name: 'Income Certificate', description: 'For fee concession (if applicable)' }
    ];

    const handleFileChange = async (id, e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setUploading(id);
        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('name', docList.find(d => d.id === id).name);

        try {
            await api.post('/api/student/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFiles(prev => ({ ...prev, [id]: selectedFile }));
            setUploadStatus(prev => ({ ...prev, [id]: 'success' }));
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed');
            setUploadStatus(prev => ({ ...prev, [id]: 'error' }));
        } finally {
            setUploading(null);
        }
    };

    const handleFinish = () => {
        const allUploaded = Object.values(uploadStatus).every(status => status === 'success');
        if (allUploaded) {
            alert('All documents uploaded successfully! Your application is now complete and sent for verification.');
            navigate('/dashboard');
        } else {
            alert('Please upload all mandatory documents before finishing.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 bg-[#f8fafc] dark:bg-background-dark">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-[#111318] dark:text-white">Document Upload Center</h1>
                    <p className="text-gray-500 mt-2">Upload digital copies of your certificates for verification (PDF/JPG, Max 2MB)</p>
                </div>

                {/* Upload Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {docList.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-[#1e2532] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all"
                        >
                            <div className={`size-14 rounded-xl flex items-center justify-center shrink-0 ${uploadStatus[doc.id] === 'success' ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-primary'
                                }`}>
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                                    {uploadStatus[doc.id] === 'success' ? 'check_circle' : 'upload_file'}
                                </span>
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-lg font-bold text-[#111318] dark:text-white">{doc.name}</h3>
                                <p className="text-sm text-gray-500">{doc.description}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {files[doc.id] ? (
                                    <div className="flex flex-col items-center md:items-end flex-grow">
                                        <span className="text-xs font-medium text-gray-400 truncate max-w-[150px]">{files[doc.id].name}</span>
                                        <button
                                            onClick={() => {
                                                setFiles(prev => ({ ...prev, [doc.id]: null }));
                                                setUploadStatus(prev => ({ ...prev, [doc.id]: 'pending' }));
                                            }}
                                            className="text-xs text-red-500 font-bold hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex-grow md:flex-grow-0">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(doc.id, e)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <div className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-primary/90 transition-all text-center">
                                            {uploading === doc.id ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Uploading...
                                                </div>
                                            ) : 'Select File'}
                                        </div>
                                    </label>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex gap-4">
                    <span className="material-symbols-outlined text-amber-600">info</span>
                    <div>
                        <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Upload Guidelines</h4>
                        <ul className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 list-disc list-inside space-y-1">
                            <li>Supported formats: PDF, JPEG, PNG.</li>
                            <li>Ensure all text is clearly legible in the uploaded files.</li>
                            <li>Maximum file size per document is 2MB.</li>
                        </ul>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pb-12">
                    <button
                        onClick={() => window.history.back()}
                        className="text-gray-500 font-bold hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">west</span>
                        Back to Application
                    </button>

                    <button
                        onClick={handleFinish}
                        className="w-full sm:w-auto bg-accent text-white px-10 py-4 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                    >
                        Complete Application
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
