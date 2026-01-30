# 📊 Excel Sheet Splitter

엑셀 파일의 각 시트를 개별 파일로 분리하고 ZIP으로 다운로드하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- ✅ **시트 분리**: XLSX/XLS 파일의 각 시트를 개별 파일로 생성
- ✅ **선택적 분리**: 업로드 후 필요한 시트만 선택하여 분리
- ✅ **데이터 보존**: 값, 수식, 스타일, 열너비, 행높이 유지
- ✅ **안전한 파일명**: Windows/Mac/Linux 호환, 한글/특수문자 자동 처리
- ✅ **자동 중복 해결**: 파일명 충돌 시 `(1)(2)...` 자동 추가
- ✅ **ZIP 다운로드**: 여러 파일을 1번에 ZIP으로 받기
- ✅ **진행 상태**: 실시간 프로그레스 바 표시
- ✅ **보안**: 업로드 파일 즉시 삭제, 로그에 내용 미기록
- ✅ **용량 제한**: 30MB 제한 + 타임아웃 보호

## 🏗️ 아키텍처

```
Frontend (React + Vite)
    ↓ /api/upload
Backend (Flask + openpyxl)
    ├─ 파일 검증 & 시트 추출
    ├─ 임시 디렉토리 관리
    └─ /api/split: 시트 분리 & ZIP 생성
    ↓
Client Download (XLSX 또는 ZIP)
```

### 기술 스택

| 계층 | 기술 |
|------|------|
| Frontend | React 18 + Vite + CSS3 |
| Backend | Flask 3.0 + openpyxl 3.11 |
| Container | Docker + Docker Compose |
| Deployment | Docker, Kubernetes 호환 |

---

## 🚀 실행 방법

### 1️⃣ 로컬 실행 (개발)

**필수 요건:**
- Python 3.11+
- Node.js 18+

**백엔드 실행:**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

백엔드는 `http://localhost:5000`에서 실행됩니다.

**프론트엔드 실행 (별도 터미널):**

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

**접속:**
- 브라우저에서 `http://localhost:5173` 열기
- 또는 프록시 설정된 `http://localhost:3000` (build 후)

---

### 2️⃣ Docker Compose로 실행 (권장)

```bash
# 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 접속
# http://localhost:3000
```

**중지 및 정리:**

```bash
docker-compose down                    # 컨테이너 중지
docker-compose down -v                 # 볼륨까지 삭제
```

---

### 3️⃣ Docker 개별 빌드

**백엔드:**

```bash
cd backend
docker build -t excel-splitter-backend .
docker run -p 5000:5000 excel-splitter-backend
```

**프론트엔드:**

```bash
cd frontend
docker build -t excel-splitter-frontend .
docker run -p 3000:3000 excel-splitter-frontend
```

---

## 📋 API 명세

### POST `/api/upload`

파일을 업로드하고 시트 목록을 반환합니다.

**요청:**
```bash
curl -X POST \
  -F "file=@sample.xlsx" \
  http://localhost:5000/api/upload
```

**응답:**
```json
{
  "session_id": "tmp_xyz123",
  "temp_file": "/tmp/tmp_xyz123/sample.xlsx",
  "filename": "sample.xlsx",
  "sheets": ["Sheet1", "Sheet2", "Sheet3"]
}
```

---

### POST `/api/split`

선택한 시트를 분리하여 다운로드합니다.

**요청:**
```json
{
  "session_id": "tmp_xyz123",
  "temp_file": "/tmp/tmp_xyz123/sample.xlsx",
  "filename": "sample.xlsx",
  "sheets": ["Sheet1", "Sheet3"]
}
```

**응답:**
- 파일 1개: XLSX 파일 직접 반환
- 파일 2개 이상: ZIP 파일 반환

---

### GET `/api/health`

서버 상태 확인

```bash
curl http://localhost:5000/api/health
```

응답:
```json
{
  "status": "ok",
  "timestamp": "2024-01-29T10:30:45.123456"
}
```

---

## 🧪 테스트 시나리오

### 테스트 1️⃣: 기본 분리 (2개 시트)

1. `sample_2sheets.xlsx` 파일 준비 (시트: "Sales", "Expenses")
2. UI에서 업로드
3. 두 시트 모두 선택 → "분리 및 다운로드" 클릭
4. ZIP 파일 다운로드 확인
5. 압축 해제 후 파일 확인:
   - `sample_2sheets_Sales.xlsx`
   - `sample_2sheets_Expenses.xlsx`

**예상 결과:** ✅ 두 파일 모두 원본 데이터 유지, 스타일 보존

---

### 테스트 2️⃣: 특수문자/한글 시트명

1. 시트명이 다음과 같은 파일 준비:
   - "2024년 매출"
   - "특수문자 !@#$%"
   - "Mixed_정보_Data"

2. 업로드 및 분리
3. 생성된 파일명 확인:
   - `{원본}__2024____매출.xlsx`
   - `{원본}_특수문자______Data.xlsx`
   - `{원본}_Mixed___Data.xlsx`

**예상 결과:** ✅ 모든 파일명이 OS 안전화되어 생성됨

---

### 테스트 3️⃣: 파일명 중복 처리

1. 파일 준비: 시트명이 모두 "Data"인 여러 시트 포함
2. 업로드 및 분리 (모든 시트 선택)
3. 생성 파일 확인:
   - `sample_Data.xlsx`
   - `sample_Data(1).xlsx`
   - `sample_Data(2).xlsx`

**예상 결과:** ✅ 자동으로 suffix 추가되어 충돌 해결

---

## ⚙️ 설정 및 커스터마이징

### 파일 크기 제한 변경

**backend/app.py:**
```python
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB로 변경
```

### 타임아웃 조정

```python
UPLOAD_TIMEOUT = 60  # 60초로 변경
```

### CORS 설정 (프로덕션)

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 로깅 커스터마이징

```python
# 로그 레벨 변경
logging.basicConfig(level=logging.DEBUG)

# 로그 파일 경로 변경
logging.FileHandler('/var/log/excel_splitter.log')
```

---

## 🔒 보안 가이드

### 프로덕션 배포 체크리스트

- [ ] `FLASK_ENV = production` 설정
- [ ] `CORS` 원본 명시적 지정
- [ ] HTTPS 활성화 (reverse proxy: nginx/Apache)
- [ ] 파일 업로드 경로 권한 제한
- [ ] 정기적 임시 파일 정리 (cron job)
- [ ] 로그 로테이션 설정
- [ ] Rate limiting 추가 (프로덕션)
- [ ] 안티바이러스 스캔 통합 (선택)

### 임시 파일 자동 정리

현재 구현: 1시간 미사용 세션 자동 정리
```python
CLEANUP_TIME_INTERVAL = 3600  # 초 단위
```

---

## 📊 성능 최적화

| 항목 | 현재값 | 최적화 |
|------|--------|---------|
| Max Workers | 4 | CPU 코어수 기반 자동 조정 |
| Upload Timeout | 30s | 대용량: 120s로 증대 |
| ZIP Compression | DEFLATE | 선택적: STORED (빠름) |
| Memory Limit | 무제한 | 1GB 제한 권장 |

---

## 🐛 알려진 제약사항

### 완벽 보존 불가능한 항목

| 항목 | 상태 | 이유 |
|------|------|------|
| 셀 값/수식 | ✅ 완벽 | openpyxl 완벽 지원 |
| 기본 스타일 | ✅ 완벽 | 폰트, 색상, 정렬 등 |
| 차트 | ⚠️ 부분 | openpyxl 제약 (형식 유지, 데이터 손실 가능) |
| 피벗 테이블 | ⚠️ 부분 | 참조 손실, 재계산 필요 |
| 매크로 | ❌ 불가 | VBA 제거됨 (보안) |
| 외부 연결 | ❌ 불가 | 참조 손실 |
| ActiveX | ❌ 불가 | XLSX 미지원 |

---

## 📈 추후 개선 사항

- [ ] 여러 파일 한번에 업로드
- [ ] 시트명 동적 변경 UI
- [ ] 데이터 미리보기
- [ ] 필터/정렬 조건 유지
- [ ] 암호 보호 XLS 지원
- [ ] 배치 처리 API
- [ ] S3/GCS 직접 업로드
- [ ] 처리 결과 이메일 전송
- [ ] Webhook 지원
- [ ] WebSocket 실시간 진행 상황

---

## 🤝 Contributing

버그 리포트 및 개선 제안은 GitHub Issues를 통해 주시기 바랍니다.

---

## 📄 라이선스

MIT License

---

## 📞 문의

- 버그 리포트: [GitHub Issues](https://github.com/yourname/excel-sheet-splitter/issues)
- 토론: [GitHub Discussions](https://github.com/yourname/excel-sheet-splitter/discussions)

---

**마지막 업데이트:** 2024-01-29  
**버전:** 1.0.0
