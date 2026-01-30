# 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# 빌드
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:20-alpine

WORKDIR /app

# 간단한 HTTP 서버 (또는 nginx 사용 가능)
RUN npm install -g serve

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# 실행
CMD ["serve", "-s", "dist", "-l", "3000"]
