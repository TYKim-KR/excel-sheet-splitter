# 🚀 빠른 시작 가이드

## 5분 안에 실행하기

### ✅ 방법 1: Docker Compose (권장, 가장 간단)

**필수:** Docker & Docker Compose 설치

```bash
# 1. 프로젝트 디렉토리로 이동
cd excel-sheet-splitter

# 2. 실행
docker-compose up -d

# 3. 브라우저에서 열기
# http://localhost:3000

# 4. 중지
docker-compose down
```

**로그 확인:**
```bash
docker-compose logs -f backend    # 백엔드
docker-compose logs -f frontend   # 프론트엔드
```

---

### ✅ 방법 2: 로컬 개발 (macOS/Linux)

**필수:** Python 3.11+, Node.js 18+

#### 터미널 1 (백엔드)
```bash
cd backend
pip install -r requirements.txt
python app.py
# 결과: http://localhost:5000/api/health OK
```

#### 터미널 2 (프론트엔드)
```bash
cd frontend
npm install
npm run dev
# 결과: http://localhost:5173 접속 가능
```

---

### ✅ 방법 3: 로컬 개발 (Windows PowerShell)

#### 터미널 1 (백엔드)
```powershell
cd .\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

#### 터미널 2 (프론트엔드)
```powershell
cd .\frontend
npm install
npm run dev
```

---

## 🧪 빠른 테스트

### 테스트 1: 백엔드 상태 확인
```bash
curl http://localhost:5000/api/health
# 응답: {"status": "ok", "timestamp": "..."}
```

### 테스트 2: 브라우저에서 파일 업로드
1. http://localhost:3000 (또는 5173) 열기
2. Excel 파일 드래그 & 드롭
3. 시트 선택 후 "분리 및 다운로드" 클릭
4. ZIP 또는 XLSX 파일 다운로드 확인

### 테스트 3: 자동화 테스트 (백엔드만)
```bash
cd backend
pip install pytest
python -m pytest test_app.py -v

# 결과 예시:
# test_app.py::TestUtilityFunctions::test_sanitize_filename_basic PASSED
# test_app.py::TestUploadAPI::test_upload_valid_2sheets PASSED
# test_app.py::TestSplitAPI::test_split_2sheets_success PASSED
```

---

## 📋 포트 확인

| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Frontend Dev | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |

---

## 🛑 일반적인 문제 해결

### ❌ "Port already in use" 에러
```bash
# macOS/Linux: 포트 확인
lsof -i :5000
lsof -i :3000

# Windows PowerShell: 포트 확인
netstat -ano | findstr :5000

# 해결: 다른 포트로 변경
# backend/app.py: app.run(port=5001)
# frontend/vite.config.js: port: 3001
```

### ❌ "ModuleNotFoundError: No module named 'openpyxl'"
```bash
cd backend
pip install openpyxl
```

### ❌ "npm ERR! code ERESOLVE"
```bash
cd frontend
npm install --legacy-peer-deps
```

### ❌ "CORS 에러" (프로덕션)
backend/app.py의 CORS 설정 수정:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],  # 본인 도메인으로 변경
        "methods": ["GET", "POST"],
    }
})
```

---

## 📦 Docker 명령어 참고

```bash
# 컨테이너 빌드만 (실행 X)
docker-compose build

# 이미지 재빌드 강제
docker-compose build --no-cache

# 백그라운드 실행
docker-compose up -d

# 포그라운드 실행 (로그 보임)
docker-compose up

# 중지 및 제거
docker-compose down

# 볼륨까지 삭제 (DB 초기화)
docker-compose down -v

# 특정 서비스만 재시작
docker-compose restart backend

# 컨테이너 상태 확인
docker-compose ps

# 실시간 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
```

---

## 🔍 파일 구조 요약

```
excel-sheet-splitter/
├── backend/                   ← Flask API
│   ├── app.py               (메인 로직: 업로드, 분리, 다운로드)
│   ├── requirements.txt      (Python 의존성)
│   ├── Dockerfile           (Docker 이미지)
│   └── test_app.py          (테스트 케이스)
│
├── frontend/                  ← React 웹 UI
│   ├── src/
│   │   ├── App.jsx          (메인 컴포넌트)
│   │   ├── components/      (업로더, 선택기, 진행율)
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml        (로컬/배포용 설정)
├── README.md                 (상세 문서)
└── QUICKSTART.md            (본 파일)
```

---

## 🎯 다음 단계

1. ✅ **로컬 테스트**: Docker Compose 또는 로컬 실행
2. 📝 **설정 커스터마이징**: 파일 크기, 타임아웃 등 수정
3. 🔒 **보안 강화**: HTTPS, CORS, Rate limiting 설정
4. 🚀 **배포**: Kubernetes, AWS, GCP 등

---

## 💡 팁

- **개발 중**: `npm run dev` + Flask `debug=True`로 자동 새로고침
- **프로덕션**: `npm run build` + Gunicorn + Nginx 리버스 프록시
- **대용량 파일**: `MAX_FILE_SIZE` 또는 Nginx `client_max_body_size` 증대
- **로그**: `/tmp/excel_splitter.log` 또는 Docker 로그 확인

---

**문제가 있으시면 README.md의 "알려진 제약사항" 섹션을 확인하세요.**

마지막 업데이트: 2024-01-29
