
import React, { useEffect, useState } from 'react';
import { getSubmissions, exportToExcel, clearDatabase } from '../services/storageService';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setData(getSubmissions());
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-white text-zinc-900 font-sans overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4 border-zinc-200">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Yue-Lao Database</h1>
                        <p className="font-mono text-sm text-zinc-500">Total Records: {data.length}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={clearDatabase} className="px-4 py-2 text-xs font-mono font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-sm">
                            CLEAR DB
                        </button>
                        <button onClick={exportToExcel} className="px-6 py-2 bg-green-600 text-white font-mono font-bold text-sm uppercase hover:bg-green-500 shadow-md rounded-sm">
                            Download Excel (.xlsx)
                        </button>
                        <button onClick={onClose} className="px-6 py-2 bg-zinc-900 text-white font-mono font-bold text-sm uppercase hover:bg-zinc-700 rounded-sm">
                            Exit
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border border-zinc-200 shadow-sm rounded-sm">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-100 border-b border-zinc-200 font-mono text-xs uppercase text-zinc-500">
                            <tr>
                                <th className="p-3">Time</th>
                                <th className="p-3">Photo</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Goal</th>
                                <th className="p-3">Gender/Age</th>
                                <th className="p-3">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-mono">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-zinc-50">
                                    <td className="p-3 text-zinc-400">{new Date(row.timestamp).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        {row.photo ? (
                                            <img src={row.photo} alt="user" className="w-8 h-8 rounded-full object-cover border border-zinc-300" />
                                        ) : <span className="text-zinc-300">-</span>}
                                    </td>
                                    <td className="p-3 font-bold">{row.name}</td>
                                    <td className="p-3 text-cyan-600">{row.email}</td>
                                    <td className="p-3">{row.relationshipType === 'LIFE_PARTNER' ? '💍 Life' : '🔥 Casual'}</td>
                                    <td className="p-3">{row.gender}, {row.age}</td>
                                    <td className="p-3 text-xs truncate max-w-[150px]">
                                        {row.analysisResult?.archetypeTitle || 'Processing...'}
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-zinc-400 italic">No data collected yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
