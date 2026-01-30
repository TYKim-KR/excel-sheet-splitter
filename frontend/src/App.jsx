import { useState } from 'react'
import FileUploader from './components/FileUploader'
import SheetSelector from './components/SheetSelector'
import ProgressBar from './components/ProgressBar'
import './styles/App.css'

function App() {
  const [sheets, setSheets] = useState([])
  const [selectedSheets, setSelectedSheets] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedData, setUploadedData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleFileUpload = async (file) => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      setProgress(50)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '파일 업로드 실패')
      }

      const data = await response.json()
      const sheetList = data.sheets.map(name => ({ name, checked: true }))
      
      setSheets(sheetList)
      setSelectedSheets(new Set(data.sheets))
      setUploadedData({
        session_id: data.session_id,
        temp_file: data.temp_file,
        filename: data.filename,
        sheets: data.sheets
      })
      setProgress(100)

      setTimeout(() => setProgress(0), 500)
      
      console.log(`✅ Upload successful: ${data.sheets.length} sheets found`)

    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(error.message)
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = () => {
    const newSelected = new Set(sheets.map(s => s.name))
    setSelectedSheets(newSelected)
    setSheets(sheets.map(s => ({ ...s, checked: true })))
  }

  const handleDeselectAll = () => {
    setSelectedSheets(new Set())
    setSheets(sheets.map(s => ({ ...s, checked: false })))
  }

  const handleSheetToggle = (sheetName) => {
    const newSelected = new Set(selectedSheets)
    if (newSelected.has(sheetName)) {
      newSelected.delete(sheetName)
    } else {
      newSelected.add(sheetName)
    }
    setSelectedSheets(newSelected)
    setSheets(sheets.map(s => ({
      ...s,
      checked: newSelected.has(s.name)
    })))
  }

  const handleSplit = async () => {
    if (selectedSheets.size === 0) {
      setErrorMessage('분리할 시트를 1개 이상 선택해주세요.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)
    setProgress(10)

    try {
      const response = await fetch(`${BACKEND_URL}/api/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: uploadedData.session_id,
          temp_file: uploadedData.temp_file,
          filename: uploadedData.filename,
          sheets: Array.from(selectedSheets),
        }),
      })

      setProgress(80)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '분리 실패')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // 다운로드 파일명 추출
      const contentDisposition = response.headers.get('content-disposition')
      let downloadName = 'download'
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="?([^"]+)"?/)
        if (matches) downloadName = matches[1]
      }

      // 다운로드 트리거
      const a = document.createElement('a')
      a.href = url
      a.download = downloadName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setProgress(100)
      setSuccessMessage(`✅ ${selectedSheets.size}개 시트 분리 완료! 다운로드 시작됨.`)
      
      console.log(`✅ Split successful: ${downloadName}`)

      // 상태 리셋
      setTimeout(() => {
        setSheets([])
        setSelectedSheets(new Set())
        setUploadedData(null)
        setProgress(0)
        setErrorMessage('')
        setSuccessMessage('')
      }, 2000)

    } catch (error) {
      console.error('Split error:', error)
      setErrorMessage(error.message)
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>📊 Excel Sheet Splitter</h1>
          <p className="subtitle">엑셀 파일의 각 시트를 개별 파일로 분리하고 다운로드하세요</p>
        </div>

        <FileUploader 
          onUpload={handleFileUpload} 
          isLoading={isLoading}
          hasSheets={sheets.length > 0}
        />

        {progress > 0 && <ProgressBar progress={progress} />}

        {errorMessage && (
          <div className="message error">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="message success">
            <span>{successMessage}</span>
          </div>
        )}

        {sheets.length > 0 && (
          <SheetSelector
            sheets={sheets}
            selectedCount={selectedSheets.size}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onToggle={handleSheetToggle}
            onSplit={handleSplit}
            isLoading={isLoading}
          />
        )}
      </div>

      <div className="footer">
        <p>
          💡 최대 파일 크기: 30MB | 지원 형식: XLSX, XLS
        </p>
      </div>
    </div>
  )
}

export default App
