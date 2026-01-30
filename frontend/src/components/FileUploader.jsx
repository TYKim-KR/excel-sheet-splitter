import { useRef } from 'react'

export default function FileUploader({ onUpload, isLoading, hasSheets }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 검증
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    const maxSize = 30 * 1024 * 1024 // 30MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('XLSX 또는 XLS 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > maxSize) {
      alert('파일 크기가 30MB를 초과합니다.')
      return
    }

    onUpload(file)
    
    // 입력 초기화 (같은 파일 재업로드 가능)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoading) {
      e.currentTarget.classList.add('dragover')
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('dragover')

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const event = { target: { files: [file] } }
      handleFileChange(event)
    }
  }

  return (
    <div className="uploader-section">
      <div
        className={`upload-area ${isLoading ? 'disabled' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={isLoading}
          style={{ display: 'none' }}
          aria-label="업로드할 Excel 파일"
        />
        
        <div className="upload-icon">📁</div>
        
        <p className="upload-text">
          {isLoading ? (
            <>업로드 중...</>
          ) : hasSheets ? (
            <>다시 업로드하려면 여기를 클릭하세요</>
          ) : (
            <>
              <strong>여기를 클릭</strong> 또는
              <br />
              <strong>파일을 드래그하여 놓으세요</strong>
            </>
          )}
        </p>
        
        {!isLoading && (
          <p className="upload-hint">XLSX 또는 XLS 파일 (최대 30MB)</p>
        )}
      </div>
    </div>
  )
}
