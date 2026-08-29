import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Info,
  Database
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface PrivacyViewProps {
  onDataReset: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onDataReset }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    const rawData = StorageService.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(rawData);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `herself_wellness_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const success = StorageService.importData(jsonStr);
        if (success) {
          setImportStatus('Data successfully restored!');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setImportStatus('Error: Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Error parsing JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    StorageService.clearAllData();
    setShowConfirmReset(false);
    onDataReset();
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/30 via-pink-100/30 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
              <span>Client-Side Privacy Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              Your Data Stays Private & Yours
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              HERSELF operates with a privacy-first mindset. Your intimate health records, period logs, symptoms, notes, and wellness goals are saved entirely in your local browser storage.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="glass-card rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Zero Cloud Account Tracking</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            No mandatory passwords, account creation, or email harvesting. You own full custody of your records.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-purple-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Local Browser Storage</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Data is stored inside your browser's encrypted sandbox via <code className="text-purple-700">localStorage</code>.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Non-Diagnostic Guarantee</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            All insights are educational pattern reflections designed for personal wellness and clinical discussion.
          </p>
        </div>

      </div>

      {/* Backup, Restore & Reset Management Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-md space-y-6">
        <h2 className="text-lg font-bold text-zinc-900">Data Portability & Management</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export JSON */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-rose-500" />
                <span>Export JSON Backup</span>
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Download a complete, offline JSON file of all your cycle logs, symptom entries, habits, and personal diary notes.
              </p>
            </div>

            <button
              id="export-data-json-btn"
              onClick={handleExportJSON}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup File</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Restore from JSON</span>
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Restore your previous HERSELF backup file from another browser or device.
              </p>
            </div>

            <div>
              <label className="w-full py-2.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Select Backup JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
              {importStatus && (
                <div className="text-[11px] font-bold text-purple-700 mt-2 text-center">
                  {importStatus}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Clear Data Row */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Reset or Clear All Data</h2>
            <p className="text-xs text-zinc-500">Erase all stored cycles, habits, and symptoms from this browser.</p>
          </div>

          <button
            id="open-reset-confirm-modal-btn"
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-100 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-zinc-900">Clear All Local Data?</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                This will delete all your period tracking entries, symptoms, habits, and personal reflections from this browser. This action cannot be undone unless you have an exported backup file.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition-colors cursor-pointer"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
