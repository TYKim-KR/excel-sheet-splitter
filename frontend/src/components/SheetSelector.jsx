export default function SheetSelector({
  sheets,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onToggle,
  onSplit,
  isLoading
}) {
  return (
    <div className="sheet-selector-section">
      <div className="sheet-controls">
        <h2>📋 분리할 시트 선택</h2>
        
        <div className="control-buttons">
          <button
            className="control-btn all"
            onClick={onSelectAll}
            disabled={isLoading}
            title="모든 시트 선택"
          >
            ✓ 전체 선택
          </button>
          
          <button
            className="control-btn none"
            onClick={onDeselectAll}
            disabled={isLoading}
            title="모든 시트 해제"
          >
            ✗ 전체 해제
          </button>
          
          <span className="sheet-count">
            {selectedCount} / {sheets.length} 선택됨
          </span>
        </div>
      </div>

      <div className="sheet-list">
        {sheets.map((sheet) => (
          <div key={sheet.name} className="sheet-item">
            <label className="sheet-checkbox">
              <input
                type="checkbox"
                checked={sheet.checked}
                onChange={() => onToggle(sheet.name)}
                disabled={isLoading}
                aria-label={`시트 '${sheet.name}' 선택`}
              />
              <span className="checkmark"></span>
            </label>
            
            <span className="sheet-name" title={sheet.name}>
              📄 {sheet.name}
            </span>
          </div>
        ))}
      </div>

      <button
        className="split-button"
        onClick={onSplit}
        disabled={isLoading || selectedCount === 0}
        title={selectedCount === 0 ? '시트를 선택해주세요' : '선택한 시트 분리 및 다운로드'}
      >
        {isLoading ? (
          <>⏳ 처리 중...</>
        ) : (
          <>⬇️ 분리 및 다운로드</>
        )}
      </button>
    </div>
  )
}
