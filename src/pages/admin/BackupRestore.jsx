import { useRef, useState } from 'react'
import { exportBackup, downloadBackupFile, importBackup } from '../../db/backup'
import { DownloadIcon, UploadIcon } from '../../components/Icons'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function BackupRestore() {
  const fileInputRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState(null)
  const [importStatus, setImportStatus] = useState(null)
  const [importing, setImporting] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)

  async function handleExport() {
    setExporting(true)
    setExportStatus(null)
    try {
      const blob = await exportBackup()
      const stamp = new Date().toISOString().slice(0, 10)
      downloadBackupFile(blob, `SalonCatalogBackup-${stamp}.json`)
      setExportStatus({ ok: true, message: 'Backup file downloaded.' })
    } catch (err) {
      setExportStatus({ ok: false, message: err.message || 'Export failed.' })
    } finally {
      setExporting(false)
    }
  }

  function handleFilePicked(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPendingFile(file)
  }

  async function runImport() {
    const file = pendingFile
    setPendingFile(null)
    setImporting(true)
    setImportStatus(null)
    try {
      const result = await importBackup(file, { mode: 'replace' })
      setImportStatus({
        ok: true,
        message: `Restored ${result.products} products, ${result.brands} brands and ${result.categories} categories.`
      })
    } catch (err) {
      setImportStatus({ ok: false, message: err.message || 'Import failed.' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <h2>Backup &amp; Restore</h2>
      <p className="section-desc">
        This catalog lives only on this device, so keeping a backup file is the only way to protect your
        work. Both export and import work completely offline.
      </p>

      <div className="backup-panel">
        <div className="backup-card">
          <h3>Export backup</h3>
          <p>
            Save the complete catalog — brands, categories, products, descriptions and photos — into one
            file: <code>SalonCatalogBackup.json</code>. Keep a copy somewhere safe (email it to yourself,
            save it to a USB drive, or upload it to cloud storage from a computer).
          </p>
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            <DownloadIcon width={17} height={17} />
            {exporting ? 'Preparing…' : 'Export backup'}
          </button>
          {exportStatus && (
            <div className={`backup-status ${exportStatus.ok ? 'backup-status--ok' : 'backup-status--error'}`}>
              {exportStatus.message}
            </div>
          )}
        </div>

        <div className="backup-card">
          <h3>Restore from backup</h3>
          <p>
            Choose a previously exported backup file to restore. <strong>This replaces everything currently
            in the catalog</strong> on this device with the contents of the backup.
          </p>
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            <UploadIcon width={17} height={17} />
            {importing ? 'Restoring…' : 'Choose backup file'}
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFilePicked} />
          {importStatus && (
            <div className={`backup-status ${importStatus.ok ? 'backup-status--ok' : 'backup-status--error'}`}>
              {importStatus.message}
            </div>
          )}
        </div>
      </div>

      {pendingFile && (
        <ConfirmDialog
          title="Replace current catalog?"
          message={`Restoring "${pendingFile.name}" will permanently replace every brand, category and product currently stored on this device.`}
          warning="This cannot be undone. Export a backup of the current catalog first if you want to keep it."
          confirmLabel="Restore backup"
          onConfirm={runImport}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </div>
  )
}
