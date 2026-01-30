export default function ProgressBar({ progress }) {
  return (
    <div className="progress-section">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">{progress}% 완료</p>
    </div>
  )
}
